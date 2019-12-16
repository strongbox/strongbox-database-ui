import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

import {DatabaseService} from '../../services/database.service';
import {CypherQueryRequest} from '../../models/query.model';
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

    displayedColumns: string[] = ['node', 'count'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

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
        const query = new CypherQueryRequest(`
MATCH (n)
WITH DISTINCT labels(n) AS labels, count(*) AS count
UNWIND labels AS label
RETURN DISTINCT label, count
ORDER BY label, count
`);

        this.loading$.next(true);
        this.db
            .execute(query)
            .pipe(takeUntil(this.destroy$), finalize(() => {
                this.loading$.next(false);
            }))
            .subscribe((response: QueryResponse) => {
                if (response.result.data['@type'] === 'g:List') {
                    const data = [];
                    for (const [index, record] of response.result.data['@value'].entries()) {
                        data.push({node: record['@value'][1], count: record['@value'][3]['@value'] || 0});
                    }
                    this.dataSource.data = data;
                }
            });
    }

}
