import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConsoleQueryResultGraphViewComponent} from './console-query-result-graph-view.component';

describe('ConsoleQueryResultGraphViewComponent', () => {
    let component: ConsoleQueryResultGraphViewComponent;
    let fixture: ComponentFixture<ConsoleQueryResultGraphViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                   declarations: [ConsoleQueryResultGraphViewComponent]
               })
               .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConsoleQueryResultGraphViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
