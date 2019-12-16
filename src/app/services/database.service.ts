import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Connection, ConnectionStateEnum, WebSocketConnection} from '../models/connection.model';
import {ConnectionProtocolEnum, DataSource} from '../models/datasource.model';
import {QueryInterface} from '../models/query.model';
import {QueryResponse} from '../models/query-result.model';
import {ToastrService} from 'ngx-toastr';
import {filter, take, takeWhile} from 'rxjs/operators';

/**
 * The gremlin-javascript library (npm install gremlin) is meant to be used on Node.js platforms and
 * cannot be used inside a browser environment. This is why we have slightly modified their code to meet our needs.
 *
 * @see http://tinkerpop.apache.org/docs/3.4.4/reference/#gremlin-javascript
 * @see https://github.com/apache/tinkerpop/tree/3.4.4/gremlin-javascript/src/main/javascript/gremlin-javascript/lib/driver
 */
@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    private connection: Connection = null;
    private connectionStateObservable$ =  new BehaviorSubject(ConnectionStateEnum.NONE);

    constructor(private notify: ToastrService) {
    }

    connect(config: DataSource) {
        if (this.isConnected()) {
            this.connection.disconnect();
        }

        if (config.protocol === ConnectionProtocolEnum.WS) {
            this.connection = new WebSocketConnection(config);
            this.connectionStateObservable$ = this.connection.connectionStateObservable();
            this.connectionStateObservable()
                .pipe(
                    takeWhile(() => this.connection.connectionStateObservable().getValue() !== ConnectionStateEnum.CONNECTED),
                    filter((state: ConnectionStateEnum) => state === ConnectionStateEnum.FAILED),
                    take(1)
                )
                .subscribe(() => {
                    this.notify.error(`Connection to '${config.label}' failed. Check browser console.`);
                    this.disconnect();
                });

            this.connection.connect();
        }
    }

    disconnect(): void {
        if (this.isConnected()) {
            this.connection.disconnect();
            this.connection = null;
        }
    }

    isConnected() {
        return this.connection !== null && this.connection.isConnected();
    }

    connectionStateObservable(): BehaviorSubject<ConnectionStateEnum> {
        return this.connectionStateObservable$;
    }

    execute(query: QueryInterface): Observable<QueryResponse> {
        return this.connection.execute(query);
    }
}
