import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ConnectionSettingsComponent} from './pages/connection-settings/connection-settings.component';
import {ConsoleComponent} from './pages/console/console.component';
import {SchemaComponent} from './pages/schema/schema.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', component: ConsoleComponent},
    {path: 'connection', component: ConnectionSettingsComponent},
    {path: 'schema', component: SchemaComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
