import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { SelectionCellComponent } from './selection-cell/selection-cell.component';

@NgModule({
  declarations: [
    SelectionCellComponent
  ],
  imports: [
    MatBadgeModule,
    MatCheckboxModule,
    MatTableModule,
    CommonModule
  ],
  exports: [
    SelectionCellComponent
  ]
})
export class NgxMaterialDataTableModule { }
