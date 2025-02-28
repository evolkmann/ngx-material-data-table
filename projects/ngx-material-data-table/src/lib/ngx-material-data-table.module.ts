import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionCellComponent } from './selection-cell/selection-cell.component';

@NgModule({
  declarations: [
    SelectionCellComponent
  ],
  imports: [
    MatBadgeModule,
    MatCheckboxModule,
    CdkTableModule,
    CommonModule
  ],
  exports: [
    SelectionCellComponent
  ]
})
export class NgxMaterialDataTableModule { }
