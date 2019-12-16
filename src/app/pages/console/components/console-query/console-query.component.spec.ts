import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {ConsoleQueryComponent} from './console-query.component';
import {MaterialModule} from '../../../../material.module';
import {QueryTypeEnum} from '../../../../models/query.model';

describe('ConsoleQueryComponent', () => {
    let component: ConsoleQueryComponent;
    let fixture: ComponentFixture<ConsoleQueryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, MaterialModule, FormsModule, ReactiveFormsModule, ToastrModule.forRoot()],
            declarations: [ConsoleQueryComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConsoleQueryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // @see https://github.com/JanusGraph/janusgraph/blob/v0.4.0/docs/basics.adoc#gremlin-query-language
    it('should auto-guess gremlin query ', () => {
        // entire query is "g"
        component.queryTypeFormControl.patchValue(QueryTypeEnum.CYPHER);
        component.queryFormControl.patchValue('g');
        expect(component.queryTypeFormControl.value).toBe(QueryTypeEnum.GREMLIN);

        // query starts with "g."
        component.queryTypeFormControl.patchValue(QueryTypeEnum.CYPHER);
        component.queryFormControl.patchValue('g.V().has("name", "hercules").repeat(out("father")).emit().values("name")');
        expect(component.queryTypeFormControl.value).toBe(QueryTypeEnum.GREMLIN);

        // contains "g."
        component.queryTypeFormControl.patchValue(QueryTypeEnum.CYPHER);
        component.queryFormControl.patchValue('hercules = g.V().has("name", "hercules").next()');
        expect(component.queryTypeFormControl.value).toBe(QueryTypeEnum.GREMLIN);
    });

    // @see https://neo4j.com/docs/cypher-manual/3.5/clauses/
    it('should auto-guess cypher query ', () => {
        // entire query matches CALL
        component.queryTypeFormControl.patchValue(QueryTypeEnum.GREMLIN);
        component.queryFormControl.patchValue('CALL dbms.procedures() YIELD name, signature WHERE name="dbms.listConfig" RETURN signature');
        expect(component.queryTypeFormControl.value).toBe(QueryTypeEnum.CYPHER);

        // entire query matches MATCH
        component.queryTypeFormControl.patchValue(QueryTypeEnum.GREMLIN);
        component.queryFormControl.patchValue('MATCH (n) RETURN n');
        expect(component.queryTypeFormControl.value).toBe(QueryTypeEnum.CYPHER);

        // entire query matches MERGE
        component.queryTypeFormControl.patchValue(QueryTypeEnum.GREMLIN);
        component.queryFormControl.patchValue('MERGE (charlie { name: "Charlie Sheen", age: 10 }) RETURN charlie');
        expect(component.queryTypeFormControl.value).toBe(QueryTypeEnum.CYPHER);
    });

});
