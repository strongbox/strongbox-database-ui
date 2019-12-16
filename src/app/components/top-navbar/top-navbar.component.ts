import {Component} from '@angular/core';

import {DatabaseService} from '../../services/database.service';

@Component({
    selector: 'app-top-navbar',
    templateUrl: './top-navbar.component.html',
    styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent {
    constructor(public databaseService: DatabaseService) {
    }
}
