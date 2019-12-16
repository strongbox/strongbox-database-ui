import {TestBed} from '@angular/core/testing';

import {SettingsService} from './settings.service';
import {DataSource} from '../models/datasource.model';

describe('SettingsService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [SettingsService]
    }));
    afterEach(() => localStorage.removeItem(SettingsService.LOCAL_STORAGE_KEY));

    it('should be created', () => {
        const service: SettingsService = TestBed.get(SettingsService);
        expect(service).toBeTruthy();
    });

    it('should get configuration by index', () => {
        const service: SettingsService = TestBed.get(SettingsService);
        const localhost = new DataSource();
        localhost.host = 'localhost';
        const somehost = new DataSource();
        somehost.host = 'somehost';

        service.saveConfiguration(localhost);
        service.saveConfiguration(somehost);
        const storedRawData = localStorage.getItem(SettingsService.LOCAL_STORAGE_KEY);
        expect(storedRawData).toBeTruthy();

        expect(service.getConfigurationByIndex(0).host).toBe(localhost.host);
        expect(service.getConfigurationByIndex(1).host).toBe(somehost.host);
    });

    it('should save configuration into localStorage', () => {
        const service: SettingsService = TestBed.get(SettingsService);
        const localhost = new DataSource();
        localhost.host = 'localhost';
        service.saveConfiguration(localhost);
        const storedRawData = localStorage.getItem(SettingsService.LOCAL_STORAGE_KEY);
        expect(storedRawData).toBeTruthy();

        const storedParsedData = service.getSavedConfigurations();
        expect(storedParsedData.length).toBeGreaterThanOrEqual(1);
    });

    it('should delete all configurations in localStorage when no index is provided', () => {
        const service: SettingsService = TestBed.get(SettingsService);
        const localhost = new DataSource();
        localhost.host = 'localhost';
        service.saveConfiguration(localhost);
        service.saveConfiguration(localhost);
        service.saveConfiguration(localhost);
        const storedRawData = localStorage.getItem(SettingsService.LOCAL_STORAGE_KEY);
        expect(storedRawData).toBeTruthy();

        // delete all
        service.deleteConfiguration();

        const storedParsedData = service.getSavedConfigurations();
        expect(storedParsedData.length).toBe(0);
    });

    it('should delete specific configurations in localStorage when an index is provided', () => {
        const service: SettingsService = TestBed.get(SettingsService);
        const localhost = new DataSource();
        localhost.host = 'localhost';
        const somehost = new DataSource();
        somehost.host = 'somehost';

        service.saveConfiguration(localhost);
        service.saveConfiguration(somehost);
        service.saveConfiguration(localhost);
        const storedRawData = localStorage.getItem(SettingsService.LOCAL_STORAGE_KEY);
        expect(storedRawData).toBeTruthy();

        // delete somehost
        service.deleteConfiguration(1);

        const storedParsedData = service.getSavedConfigurations();
        expect(storedParsedData.length).toBe(2);
        expect(storedParsedData[0].host).toBe('localhost');
        expect(storedParsedData[1].host).toBe('localhost');
        expect(storedParsedData[2]).toBeFalsy();
    });

});
