import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {filter, map, mergeMap, take, takeUntil, tap} from 'rxjs/operators';
import {classToPlain, plainToClass} from 'class-transformer';

import {ConnectionProtocolEnum, DataSource} from './datasource.model';
import {GremlinQueryRequest, QueryInterface, UUID4} from './query.model';
import {QueryResponse} from './query-result.model';

export enum ConnectionTypeEnum {
    WEBSOCKET,
    REST
}

export enum ConnectionStateEnum {
    NONE,
    CONNECTING,
    CONNECTED,
    FAILED
}

export interface Connection {
    /**
     * Get the websocket connection.
     */
    type(): ConnectionTypeEnum;

    /**
     * Connect to a web socket (or do nothing in other cases)
     */
    connect(): void;

    /**
     * Is the connection still active?
     */
    connectionStateObservable(): BehaviorSubject<ConnectionStateEnum>;

    isConnected(): boolean;

    /**
     * Do we have any errors while connecting?
     */
    errorStateObservable(): BehaviorSubject<boolean>;

    /**
     * Disconnect any active connections to the backend.
     */
    disconnect(): void;

    /**
     * Executes a query against the backend.
     * @param query A query to send to the backend.
     */
    execute(query: QueryInterface): Observable<QueryResponse>;
}

export abstract class AbstractConnection implements Connection {

    /* tslint:disable:variable-name */
    protected _dataSource: DataSource;
    protected _options: Map<string, any>;
    protected _connectionState$: BehaviorSubject<ConnectionStateEnum> = new BehaviorSubject(ConnectionStateEnum.NONE);
    protected _error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /* tslint:enable:variable-name */

    /**
     * Does all necessary preparation to open a connection to the backend using the appropriate protocol.
     *
     * @param dataSource Connection settings
     * @param options Connection options, i.e. pass an http client for rest connection
     */
    constructor(dataSource: DataSource, options?: Map<string, any>) {
        this._dataSource = dataSource;
        this._options = options;
    }

    /**
     * Returns the base url to connect to (i.e. ws://localhost:8182/gremlin ; https://host.com:80/gremlin)
     */
    getConnectUrl() {
        const schema = ConnectionProtocolEnum[this._dataSource.protocol].toLowerCase();
        const host = `${this._dataSource.host}:${this._dataSource.port}`;
        return `${schema}://${host}${this._dataSource.contextPath}`;
    }

    connectionStateObservable(): BehaviorSubject<ConnectionStateEnum> {
        return this._connectionState$;
    }

    isConnected(): boolean {
        return this._connectionState$.getValue() === ConnectionStateEnum.CONNECTED;
    }

    errorStateObservable(): BehaviorSubject<any> {
        return this._error$;
    }

    log(type: 'info' | 'warn' | 'error' = 'info', ...opts) {
        const args = Array.from(arguments);
        args.shift();

        if (typeof args[0] === 'string') {
            args[0] = `[${this._dataSource.label}]  ${args[0]}`;
        } else {
            args.splice(0, 0, `[${this._dataSource.label}] `);
        }

        if (type === 'info') {
            console.log.apply(console, args);
        } else if (type === 'warn') {
            console.warn.apply(console, args);
        } else {
            console.error.apply(console, args);
        }
    }

    abstract type(): ConnectionTypeEnum;

    abstract connect(): void;

    abstract disconnect(): void;

    abstract execute(query: QueryInterface): Observable<QueryResponse>;
}

export class WebSocketConnection extends AbstractConnection {

    private socket: WebSocketSubject<any> = null;
    private destroy$: Subject<any>;

    type(): ConnectionTypeEnum {
        return ConnectionTypeEnum.WEBSOCKET;
    }

    connect() {
        if (this.socket) {
            return;
        }

        this.destroy$ = new Subject();

        this.log('info', 'Setting connecting...');
        this._connectionState$.next(ConnectionStateEnum.CONNECTING);

        this.socket = webSocket({
            url: this.getConnectUrl(),
            serializer: (alreadySerialized: string) => alreadySerialized,
            openObserver: {
                next: () => {
                    if (!this.isConnected()) {
                        this._connectionState$.next(ConnectionStateEnum.CONNECTED);
                        this.log('info', '%cConnection is established', 'background: green; color: white');
                    }
                }
            },
            closeObserver: {
                next: (event: CloseEvent) => {
                    // Return an info error message when the connection is going away (i.e. server is stopped)
                    if (event.code > 1000 && !event.wasClean) {
                        this._connectionState$.next(ConnectionStateEnum.FAILED);
                        this.log('warn', 'Failed to connect to database source!', event);
                    }
                }
            }
        });

        const initialQuery = new GremlinQueryRequest(`
nodes = g.V().groupCount().by(label);
nodesprop = g.V().valueMap().select(keys).groupCount();
edges = g.E().groupCount().by(label);
edgesprop = g.E().valueMap().select(keys).groupCount();
[nodes.toList(),nodesprop.toList(),edges.toList(),edgesprop.toList()]
        `);

        this.execute(initialQuery)
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe(() => {});
    }

    disconnect(): void {
        if (this.destroy$ !== null) {
            this.socket.complete();
            this.destroy$.next();
            this.destroy$.complete();
            this.socket = null;
            this._connectionState$.next(ConnectionStateEnum.NONE);
        }
    }

    execute(query: QueryInterface): Observable<QueryResponse> {
        const plainJson = classToPlain(query) as any;
        plainJson.requestId = UUID4();

        this.log('info', 'Submitting query: ', plainJson);

        // send the stringified json object (we are skipping automatic rxjs websocket serialization so we need to do this here)
        this.socket.next(JSON.stringify(plainJson));

        return this.socket
                   .asObservable()
                   .pipe(
                       takeUntil(this.destroy$),
                       map(r => {
                           const result = plainToClass(QueryResponse, r);
                           result.query = query;
                           return result;
                       }),
                       mergeMap((r) => r.isSuccess() ? of(r) : throwError(r)),
                       // we are interested to receive only the query with the requestId we have sent.
                       filter((r: QueryResponse) => r.requestId === plainJson.requestId),
                       // we'll receive only one result so we can automatically unsubscribe.
                       take(1),
                       // display debugging data in console
                       tap(r => this.log('info', 'Received query result: ', r))
                   );
    }

}

export class RestConnection extends AbstractConnection {

    private http: HttpClient;
    private destroy$: Subject<any>;

    constructor(dataSource: DataSource, options?: Map<string, any>) {
        super(dataSource, options);

        if (!options.has('http')) {
            throw Error('Cannot use RestConnection without an HttpClient');
        }

        this.http = options.get('http');
    }

    type(): ConnectionTypeEnum {
        return ConnectionTypeEnum.REST;
    }

    connect(): Subject<any> | WebSocketSubject<any> | null {
        return null;
    }

    disconnect(): void {
    }

    execute(query: QueryInterface): Observable<QueryResponse> {
        throw Error('// TODO: Not implemented yet.');
    }
}
