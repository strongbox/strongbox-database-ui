import {Injectable} from '@angular/core';
import {plainToClass} from 'class-transformer';

import {DataSource} from '../models/datasource.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    static readonly LOCAL_STORAGE_KEY = 'databaseConsoleConfigurations';
    private configurations: DataSource[] = [];

    constructor() {
        this.getSavedConfigurations(true);
    }

    saveConfiguration(configuration: DataSource, index = null) {
        if (index !== null) {
            this.configurations[index] = configuration;
        } else {
            this.configurations.push(configuration);
        }

        localStorage.setItem(SettingsService.LOCAL_STORAGE_KEY, JSON.stringify(this.configurations));
    }

    deleteConfiguration(index: number = null) {
        if (index === null) {
            this.configurations = [];
        } else {
            this.configurations.splice(index, 1);
        }

        localStorage.setItem(SettingsService.LOCAL_STORAGE_KEY, JSON.stringify(this.configurations));
    }

    getConfigurationByIndex(index: number): DataSource {
        return this.configurations[index] || null;
    }

    getSavedConfigurations(forceSync = false): DataSource[] {
        if (!forceSync) {
            return this.configurations;
        }

        try {
            const parsedConfigurations: any = JSON.parse(localStorage.getItem(SettingsService.LOCAL_STORAGE_KEY));
            if (parsedConfigurations !== null) {
                this.configurations = plainToClass(DataSource, parsedConfigurations) as any;
            }
        } catch (e) {
            this.configurations = [];
        }

        return this.configurations;
    }

}
