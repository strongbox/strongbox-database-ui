import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ConnectionSettingsComponent} from './pages/connection-settings/connection-settings.component';
import {TopNavbarComponent} from './components/top-navbar/top-navbar.component';
import {MaterialModule} from './material.module';
import {ConsoleComponent} from './pages/console/console.component';
import {ConsoleQueryComponent} from './pages/console/components/console-query/console-query.component';
import {ConsoleQueryResultComponent} from './pages/console/components/console-query-result/console-query-result.component';
import {ConsoleQueryResultJsonViewComponent} from './pages/console/components/console-query-result/components/console-query-result-json-view/console-query-result-json-view.component';
import {ConsoleQueryResultTableViewComponent} from './pages/console/components/console-query-result/components/console-query-result-table-view/console-query-result-table-view.component';
import {ConsoleQueryResultGraphViewComponent} from './pages/console/components/console-query-result/components/console-query-result-graph-view/console-query-result-graph-view.component';
import {SchemaComponent} from './pages/schema/schema.component';

@NgModule({
    declarations: [
        AppComponent,
        TopNavbarComponent,
        ConsoleComponent,
        ConsoleQueryComponent,
        ConsoleQueryResultComponent,
        ConsoleQueryResultJsonViewComponent,
        ConsoleQueryResultTableViewComponent,
        ConsoleQueryResultGraphViewComponent,
        ConnectionSettingsComponent,
        SchemaComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientModule,
        ToastrModule.forRoot({
            autoDismiss: true,
            disableTimeOut: false,
            progressBar: true,
            preventDuplicates: false,
            progressAnimation: 'decreasing',
            timeOut: 3500,
            extendedTimeOut: 2000,
            positionClass: 'toast-bottom-right'
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
