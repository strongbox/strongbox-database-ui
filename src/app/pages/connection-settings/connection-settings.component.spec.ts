import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {ConnectionSettingsComponent} from './connection-settings.component';
import {SettingsService} from '../../services/settings.service';
import {MaterialModule} from '../../material.module';
import {DatabaseService} from '../../services/database.service';

describe('ConnectionSettingsComponent', () => {
    let component: ConnectionSettingsComponent;
    let fixture: ComponentFixture<ConnectionSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, MaterialModule, FormsModule, ReactiveFormsModule, ToastrModule.forRoot()],
            declarations: [ConnectionSettingsComponent],
            providers: [DatabaseService, SettingsService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnectionSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
