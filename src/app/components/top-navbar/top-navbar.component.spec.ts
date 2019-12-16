import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastrModule} from 'ngx-toastr';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {TopNavbarComponent} from './top-navbar.component';
import {MaterialModule} from '../../material.module';

describe('TopNavbarComponent', () => {
    let component: TopNavbarComponent;
    let fixture: ComponentFixture<TopNavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule, RouterTestingModule, NoopAnimationsModule, ToastrModule.forRoot()],
            declarations: [TopNavbarComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopNavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
