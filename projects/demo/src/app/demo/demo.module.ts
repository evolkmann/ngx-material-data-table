import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
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
