import {AfterContentInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatList} from '@angular/material';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {DatabaseService} from '../../../../services/database.service';
import {slideInOut} from '../../../../animations';
import {CypherQueryRequest, GremlinQueryRequest, QueryInterface, QueryTypeEnum} from '../../../../models/query.model';
import {QueryResponse} from '../../../../models/query-result.model';
import {ConnectionStateEnum} from '../../../../models/connection.model';

@Component({
    selector: 'app-console-query',
    templateUrl: './console-query.component.html',
    styleUrls: ['./console-query.component.scss'],
    animations: [
        slideInOut
    ]
})
export class ConsoleQueryComponent implements OnInit, OnDestroy, AfterContentInit {

    static readonly LOCAL_STORAGE_KEY = 'databaseConsoleQueryHistory';

    queryFormControl = new FormControl('', [Validators.required]);
    queryTypes = [];
    queryTypeFormControl = new FormControl(QueryTypeEnum.CYPHER, [Validators.required]);

    result$: BehaviorSubject<QueryResponse> = new BehaviorSubject<QueryResponse>(null);
    waiting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    showHistory = false;
    showHelp = false;

    history: QueryHistory[] = [];

    @ViewChild('queryTextArea', {static: true, read: ElementRef})
    private queryTextArea: ElementRef;

    @ViewChild('historyList', {static: false, read: MatList})
    private historyList: MatList;

    private destroy$: Subject<any> = new Subject();

    constructor(public databaseService: DatabaseService) {
    }

    ngOnInit() {
        this.queryTypes = Object.keys(QueryTypeEnum)
                                .filter(key => typeof QueryTypeEnum[key] === 'number')
                                .map(key => ({id: QueryTypeEnum[key], label: key}));

        this.waiting$.subscribe((state) => {
            if (state === false) {
                this.queryFormControl.enable();
                this.queryTypeFormControl.enable();
            } else {
                this.queryFormControl.disable();
                this.queryTypeFormControl.disable();
            }
            this.focusInput();
        });

        // Attempt to guess query type
        this.queryFormControl
            .valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((v: string) => {
                // if the query starts with `g. ....` or contains ` g.` it's likely a gremlin and we can automatically set the query type.
                // @see https://github.com/JanusGraph/janusgraph/blob/v0.4.0/docs/basics.adoc#gremlin-query-language
                const gremlinQuery = /^[g]|(.+)= g|(g\.+)|([ ]g\.+)$/gi;

                // if query starts with CREATE|MERGE|MATCH|etc - then it's cypher
                // @see https://neo4j.com/docs/cypher-manual/3.5/clauses/
                const cypherQuery = /^CALL|MATCH|MERGE|UNWIND/gi;

                if (this.queryTypeFormControl.value !== QueryTypeEnum.GREMLIN && v.match(gremlinQuery)) {
                    this.queryTypeFormControl.setValue(QueryTypeEnum.GREMLIN);
                }

                if (this.queryTypeFormControl.value !== QueryTypeEnum.CYPHER && v.match(cypherQuery)) {
                    this.queryTypeFormControl.setValue(QueryTypeEnum.CYPHER);
                }
            });

        this.databaseService
            .connectionStateObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                if (state === ConnectionStateEnum.CONNECTED) {
                    this.queryFormControl.enable();
                    this.queryTypeFormControl.enable();
                    this.focusInput();
                } else {
                    this.queryFormControl.disable();
                    this.queryTypeFormControl.disable();
                }
            })
        ;

        // Attempt to restore query history from localStorage
        try {
            if (localStorage.getItem(ConsoleQueryComponent.LOCAL_STORAGE_KEY) !== null) {
                this.history = JSON.parse(localStorage.getItem(ConsoleQueryComponent.LOCAL_STORAGE_KEY));
            }
        } catch (e) {
            this.history = [];
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterContentInit(): void {
        this.focusInput();
    }

    focusInput() {
        this.queryTextArea.nativeElement.focus();
    }

    onInputKey(event: KeyboardEvent) {
        // don't execute if not connected to db or waiting for response
        if (this.databaseService.isConnected() && !this.waiting$.getValue()) {
            // trigger only for ctrl + enter and only if query is "valid"
            if ((event.ctrlKey || event.altKey) && event.key === 'Enter' && this.queryFormControl.valid) {
                this.execute();
            }
        }
    }

    @HostListener('document:keydown.alt.h', ['$event'])
    onHistoryShow(event: KeyboardEvent) {
        this.showHistory = !this.showHistory;
    }

    @HostListener('document:keydown.alt.l', ['$event'])
    executeFirstHistory(event: KeyboardEvent) {
        if (this.history.length > 0 && this.databaseService.isConnected()) {
            this.queryFormControl.patchValue(this.history[0].query);
            this.queryFormControl.markAsDirty();

            const type = this.queryTypes.filter((qt: any) => qt.label === this.history[0].type);

            if (type.length > 0) {
                this.queryTypeFormControl.patchValue(type[0].id);
                this.queryTypeFormControl.markAsDirty();
            }

            this.execute();
        }
    }

    selectQueryFromHistory(history: QueryHistory) {
        this.queryFormControl.patchValue(history.query);
        this.queryFormControl.markAsDirty();

        const type = this.queryTypes.filter((qt: any) => qt.label === this.history[0].type);

        if (type.length > 0) {
            this.queryTypeFormControl.patchValue(type[0].id);
            this.queryTypeFormControl.markAsDirty();
        }

        this.showHistory = !this.showHistory;
        this.focusInput();
    }

    saveHistory(query: QueryInterface) {
        const type = query instanceof CypherQueryRequest ? QueryTypeEnum[QueryTypeEnum.CYPHER] : QueryTypeEnum[QueryTypeEnum.GREMLIN];

        const candidate: QueryHistory = {
            type: type.toLowerCase(),
            query: query.getQuery()
        };

        const foundIndex = this.history.findIndex(h => h.type === candidate.type && h.query === candidate.query);

        if (foundIndex > -1) {
            this.history.splice(foundIndex, 1);
        }

        // add the candidate to the beginning (or update existing one)
        this.history.unshift(candidate);

        if (this.history.length > 20) {
            this.history.pop();
        }

        localStorage.setItem(ConsoleQueryComponent.LOCAL_STORAGE_KEY, JSON.stringify(this.history));
    }

    executable() {
        return this.databaseService.isConnected() &&
            this.waiting$.value !== true &&
            !this.queryFormControl.pristine &&
            this.queryFormControl.valid;
    }

    execute() {
        this.result$.next(null);
        this.waiting$.next(true);

        let query: QueryInterface = null;

        if (this.queryTypeFormControl.value === QueryTypeEnum.CYPHER) {
            query = new CypherQueryRequest(this.queryFormControl.value);
        } else if (this.queryTypeFormControl.value === QueryTypeEnum.GREMLIN) {
            query = new GremlinQueryRequest(this.queryFormControl.value);
        } else {
            throw Error('Unknown query type.');
        }

        this.saveHistory(query);

        this.databaseService
            .execute(query)
            .subscribe(
                (result: QueryResponse) => {
                    this.result$.next(result);
                    this.waiting$.next(false);
                },
                (error: QueryResponse) => {
                    this.result$.next(error);
                    this.waiting$.next(false);
                }
            );
    }
}

interface QueryHistory {
    type: string;
    query: string;
}
