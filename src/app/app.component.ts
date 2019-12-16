import {Component, OnDestroy, OnInit} from '@angular/core';

import {DatabaseService} from './services/database.service';
import {SettingsService} from './services/settings.service';

@Component({
    selector: 'app-strongbox-database',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    constructor(private databaseService: DatabaseService, private settingsService: SettingsService) {
    }

    ngOnInit(): void {
        if (this.settingsService.getSavedConfigurations().length >= 1) {
            // Autoconnect to the first database source
            this.databaseService.connect(this.settingsService.getConfigurationByIndex(0));
        }
    }

    ngOnDestroy(): void {
        this.databaseService.disconnect();
    }

}
