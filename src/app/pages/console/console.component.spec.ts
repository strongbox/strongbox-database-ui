import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {ConsoleComponent} from './console.component';
import {MaterialModule} from '../../material.module';
import {DatabaseService} from '../../services/database.service';
import {ConsoleQueryComponent} from './components/console-query/console-query.component';
import {ConsoleQueryResultComponent} from './components/console-query-result/console-query-result.component';
import {ConsoleQueryResultJsonViewComponent} from './components/console-query-result/components/console-query-result-json-view/console-query-result-json-view.component';
import {ConsoleQueryResultTableViewComponent} from './components/console-query-result/components/console-query-result-table-view/console-query-result-table-view.component';
import {ConsoleQueryResultGraphViewComponent} from './components/console-query-result/components/console-query-result-graph-view/console-query-result-graph-view.component';

describe('ConsoleComponent', () => {
    let component: ConsoleComponent;
    let fixture: ComponentFixture<ConsoleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, MaterialModule, FormsModule, ReactiveFormsModule, ToastrModule.forRoot()],
            declarations: [
                ConsoleComponent,
                ConsoleQueryComponent,
                ConsoleQueryResultComponent,
                ConsoleQueryResultGraphViewComponent,
                ConsoleQueryResultJsonViewComponent,
                ConsoleQueryResultTableViewComponent
            ],
            providers: [DatabaseService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConsoleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
