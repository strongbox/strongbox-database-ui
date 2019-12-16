import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ConsoleQueryResultComponent} from './console-query-result.component';
import {MaterialModule} from '../../../../material.module';
import {ConsoleQueryResultGraphViewComponent} from './components/console-query-result-graph-view/console-query-result-graph-view.component';
import {ConsoleQueryResultJsonViewComponent} from './components/console-query-result-json-view/console-query-result-json-view.component';
import {ConsoleQueryResultTableViewComponent} from './components/console-query-result-table-view/console-query-result-table-view.component';

describe('ConsoleQueryResultComponent', () => {
    let component: ConsoleQueryResultComponent;
    let fixture: ComponentFixture<ConsoleQueryResultComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule, FormsModule, ReactiveFormsModule],
            declarations: [
                ConsoleQueryResultComponent,
                ConsoleQueryResultGraphViewComponent,
                ConsoleQueryResultJsonViewComponent,
                ConsoleQueryResultTableViewComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConsoleQueryResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
