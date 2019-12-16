import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConsoleQueryResultJsonViewComponent} from './console-query-result-json-view.component';
import {MaterialModule} from '../../../../../../material.module';
import {QueryResponse} from '../../../../../../models/query-result.model';

describe('ConsoleQueryResultJsonViewComponent', () => {
    let component: ConsoleQueryResultJsonViewComponent;
    let fixture: ComponentFixture<ConsoleQueryResultJsonViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ConsoleQueryResultJsonViewComponent]
        }).compileComponents();
    }));

    it('should create when [result]=null ', () => {
        fixture = TestBed.createComponent(ConsoleQueryResultJsonViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should create when [result]=QueryResponse', () => {
        fixture = TestBed.createComponent(ConsoleQueryResultJsonViewComponent);
        component = fixture.componentInstance;
        component.result = new QueryResponse();
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

});
