import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ConsoleQueryResultTableViewComponent} from './console-query-result-table-view.component';
import {MaterialModule} from '../../../../../../material.module';
import {ConsoleQueryResultJsonViewComponent} from '../console-query-result-json-view/console-query-result-json-view.component';

describe('ConsoleQueryResultTableViewComponent', () => {
    let component: ConsoleQueryResultTableViewComponent;
    let fixture: ComponentFixture<ConsoleQueryResultTableViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule, FormsModule, ReactiveFormsModule],
            declarations: [ConsoleQueryResultTableViewComponent, ConsoleQueryResultJsonViewComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConsoleQueryResultTableViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
