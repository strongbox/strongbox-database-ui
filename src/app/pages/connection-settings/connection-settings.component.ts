import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {plainToClass} from 'class-transformer';

import {SettingsService} from '../../services/settings.service';
import {DatabaseService} from '../../services/database.service';
import {ConnectionProtocolEnum, DataSource, GremlinVersionEnum} from '../../models/datasource.model';

@Component({
    selector: 'app-connection-settings',
    templateUrl: './connection-settings.component.html',
    styleUrls: ['./connection-settings.component.scss']
})
export class ConnectionSettingsComponent implements OnInit {

    form: FormGroup = null;
    index = null;

    availableProtocols = [];
    availableGremlinVersions = [];

    constructor(public settingsService: SettingsService, public db: DatabaseService) {
    }

    updateForm(index) {
        this.index = index;
        const config = this.settingsService.getConfigurationByIndex(index);
        this.form.patchValue(config);
    }

    saveForm(index = null) {
        if (this.form.valid) {
            this.settingsService.saveConfiguration(plainToClass(DataSource, this.form.getRawValue()), index);
            this.index = null;
            this.form.reset();
            this.form.get('port').setValue(8182);
            this.form.get('protocol').setValue(ConnectionProtocolEnum.WS);
            this.form.get('gremlinVersion').setValue(GremlinVersionEnum.VER_3_3);
            Object.keys(this.form.controls).forEach(key => {
                this.form.get(key).setErrors(null);
            });
        }
    }

    ngOnInit() {
        this.availableProtocols = Object.keys(ConnectionProtocolEnum)
                                        .filter(key => typeof ConnectionProtocolEnum[key] === 'number')
                                        .map(key => ({id: ConnectionProtocolEnum[key], label: key}));

        this.availableGremlinVersions = Object.keys(GremlinVersionEnum)
                                              .filter(key => typeof GremlinVersionEnum[key] === 'number')
                                              .map(key => ({id: GremlinVersionEnum[key], label: key}));

        this.form = new FormGroup({
            label: new FormControl(null, [Validators.required]),
            host: new FormControl(null, [Validators.required]),
            port: new FormControl(8182, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
            protocol: new FormControl(ConnectionProtocolEnum.WS, [Validators.required]),
            gremlinVersion: new FormControl(GremlinVersionEnum.VER_3_3, [Validators.required])
        });
    }

}
