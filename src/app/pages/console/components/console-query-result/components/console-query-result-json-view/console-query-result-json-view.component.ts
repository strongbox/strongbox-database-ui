import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgxJsonViewerComponent} from 'ngx-json-viewer';
import {BehaviorSubject, Subject} from 'rxjs';
import {distinctUntilChanged, filter, pairwise, takeUntil} from 'rxjs/operators';

import {QueryResponse} from '../../../../../../models/query-result.model';

@Component({
    selector: 'app-console-query-result-json-view',
    templateUrl: './console-query-result-json-view.component.html',
    styleUrls: ['./console-query-result-json-view.component.scss']
})
export class ConsoleQueryResultJsonViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input()
    position: 'right' | 'top' = 'right';

    @Input()
    result: QueryResponse = null;

    @ViewChild('jsonViewer', {static: false, read: NgxJsonViewerComponent})
    jsonView: NgxJsonViewerComponent = null;

    prettyView: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    private destroy$: Subject<any> = new Subject<any>();

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.prettyView
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                pairwise(),
                filter(states => states[0] !== states[1] && states[1] === true)
            )
            .subscribe(() => setTimeout(() => this.toggleJsonPaths(), 1));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.toggleJsonPaths();
        }, 5);
    }

    hasResult() {
        return this.result !== null && this.result !== undefined && this.result instanceof QueryResponse;
    }

    toggleJsonPaths() {
        if (this.jsonView !== null) {
            this.jsonView.segments.filter(segment => {
                if (segment.key === 'result' || segment.key === 'status') {
                    this.jsonView.toggle(segment);
                }
            });
            this.cdr.markForCheck();
        }
    }

}
