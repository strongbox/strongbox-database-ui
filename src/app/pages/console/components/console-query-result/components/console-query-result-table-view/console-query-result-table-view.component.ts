import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {NgxJsonViewerComponent} from 'ngx-json-viewer';
import {Subject} from 'rxjs';

import {QueryResponse} from '../../../../../../models/query-result.model';
import {TableViewData} from '../../../../../../models/views/table-view-data';

@Component({
    selector: 'app-console-query-result-table-view',
    templateUrl: './console-query-result-table-view.component.html',
    styleUrls: ['./console-query-result-table-view.component.scss']
})
export class ConsoleQueryResultTableViewComponent implements OnInit, OnDestroy {
    @Input()
    result: QueryResponse = null;

    selectableColumns: string[] = [];
    displayedColumns: FormControl = new FormControl();
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    @ViewChild('jsonViewer', {static: false, read: NgxJsonViewerComponent})
    jsonView: NgxJsonViewerComponent;

    tableViewData: TableViewData = null;

    private destroy$: Subject<any> = new Subject<any>();

    ngOnInit() {
        this.processResult(this.result);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    hasSelectedColumns() {
        const columns = this.displayedColumns.value;
        return columns instanceof Array && columns.length > 0;
    }

    isTableViewAvailable() {
        return this.tableViewData !== null && this.tableViewData.columns.size > 0;
    }

    isObject(data): boolean {
        return typeof data === 'object';
    }

    getColumnValue(record: Map<string, any>, column: string) {
        if (record.has(column)) {
            let value = record.get(column);

            if (typeof value === 'object' && (value['@type'] === 'g:Int64' || value['@type'] === 'g:Int32')) {
                value = value['@value'];
            }

            return value;
        }
        return 'N/A';
    }

    processResult(response: QueryResponse = null): any {
        if (response !== null && response.result.data !== null) {
            this.tableViewData = new TableViewData(response);
            this.dataSource = new MatTableDataSource<any>(this.tableViewData.data);

            this.selectableColumns = Array.from(this.tableViewData.columns);
            this.displayedColumns.patchValue(this.selectableColumns);
        }
    }

    compareSelected = (val1: string, val2: string) => val1 === val2;
}
