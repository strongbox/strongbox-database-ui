import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

import {CdkTableModule} from '@angular/cdk/table';

const components = [
    CdkTableModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    NgxJsonViewerModule
];

@NgModule({
    exports: components
})
export class MaterialModule {
}
