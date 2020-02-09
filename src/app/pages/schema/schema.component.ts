import {Component, OnDestroy, OnInit} from '@angular/core';

import {DatabaseService} from '../../services/database.service';
import {GremlinQueryRequest} from '../../models/query.model';
import {QueryResponse} from '../../models/query-result.model';
import {BehaviorSubject, Subject} from 'rxjs';
import {filter, finalize, take, takeUntil} from 'rxjs/operators';
import {ConnectionStateEnum} from '../../models/connection.model';

@Component({
    selector: 'app-schema',
    templateUrl: './schema.component.html',
    styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit, OnDestroy {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    result: any;

    private destroy$: Subject<any> = new Subject();

    constructor(public db: DatabaseService) {
    }

    ngOnInit() {
        if (this.db.isConnected()) {
            this.getLabels();
        } else {
            this.db
                .connectionStateObservable()
                .pipe(
                    takeUntil(this.destroy$),
                    filter((state: ConnectionStateEnum) => state === ConnectionStateEnum.CONNECTED),
                    take(1)
                )
                .subscribe(() => {
                    this.getLabels();
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getLabels() {
        const query = new GremlinQueryRequest(`
JanusGraphManagement jgm = ((org.janusgraph.core.JanusGraph)g.getGraph()).openManagement();
String schema = jgm.printSchema();
jgm.rollback();
[schema]`);

        this.loading$.next(true);
        this.db
            .execute(query)
            .pipe(takeUntil(this.destroy$), finalize(() => {
                this.loading$.next(false);
            }))
            .subscribe((response: QueryResponse) => {
                this.result = response.result.data['@value'][0];
            });
    }

}
