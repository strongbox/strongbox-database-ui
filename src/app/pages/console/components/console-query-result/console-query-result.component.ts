import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {QueryResponse} from '../../../../models/query-result.model';

@Component({
    selector: 'app-console-query-result',
    templateUrl: './console-query-result.component.html',
    styleUrls: ['./console-query-result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsoleQueryResultComponent implements OnInit {
    @Input()
    result: BehaviorSubject<QueryResponse> = new BehaviorSubject<QueryResponse>(null);

    @Input()
    loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @Input()
    executionTime = 0;

    viewType: ViewQueryResultTypes = ViewQueryResultTypes.JSON;

    disableGraphView = false;
    disableTableView = false;

    ngOnInit(): void {
        if (this.result.getValue() !== null) {
            const response = this.result.getValue();

            if (!response.isSuccess()) {
                this.disableGraphView = true;
                this.disableTableView = true;
            }

            if (response.result.data !== null && response.result.data['@type'] === 'g:list' && response.result.data['@value'].length > 0) {
                this.disableTableView = false;
            }
        }
    }

    setJsonView() {
        this.viewType = ViewQueryResultTypes.JSON;
    }

    isJsonView() {
        return this.viewType === ViewQueryResultTypes.JSON;
    }

    setTableView() {
        if (this.disableTableView === false) {
            this.viewType = ViewQueryResultTypes.TABLE;
        }
    }

    isTableView() {
        return this.viewType === ViewQueryResultTypes.TABLE;
    }

    setGraphView() {
        if (this.disableGraphView === false) {
            this.viewType = ViewQueryResultTypes.GRAPH;
        }
    }

    isGraphView() {
        return this.viewType === ViewQueryResultTypes.GRAPH;
    }
}

export enum ViewQueryResultTypes {
    JSON,
    TABLE,
    GRAPH
}
