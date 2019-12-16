import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {DatabaseService} from './database.service';
import {SettingsService} from './settings.service';
import {ToastrModule} from 'ngx-toastr';

describe('DatabaseService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            ToastrModule.forRoot()
        ],
        providers: [DatabaseService, SettingsService]
    }));

    it('should be created', () => {
        const service: DatabaseService = TestBed.get(DatabaseService);
        expect(service).toBeTruthy();
    });

});
