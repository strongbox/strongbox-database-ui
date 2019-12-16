import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {SchemaComponent} from './schema.component';
import {MaterialModule} from '../../material.module';
import {DatabaseService} from '../../services/database.service';
import {SettingsService} from '../../services/settings.service';

describe('SchemaComponent', () => {
    let component: SchemaComponent;
    let fixture: ComponentFixture<SchemaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, MaterialModule, ToastrModule.forRoot()],
            declarations: [SchemaComponent],
            providers: [DatabaseService, SettingsService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SchemaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
