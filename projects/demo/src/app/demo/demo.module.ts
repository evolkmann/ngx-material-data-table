import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { NgxMaterialDataTableModule } from 'ngx-material-data-table';
import { DemoTableComponent } from './components/demo-table/demo-table.component';
import { DemoRoutingModule } from './demo-routing.module';
import { DemoViewComponent } from './views/demo-view/demo-view.component';

@NgModule({
  declarations: [
    DemoViewComponent,
    DemoTableComponent
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxMaterialDataTableModule,
  ]
})
export class DemoModule { }
