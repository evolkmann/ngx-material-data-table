import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatColumnDef, MatTable } from '@angular/material/table';
import { NgxMaterialDataTable } from '../table';

@Component({
  selector: 'mdt-selection-cell',
  templateUrl: './selection-cell.component.html',
  styleUrls: ['./selection-cell.component.scss']
})
export class SelectionCellComponent implements OnInit {

  @ViewChild(MatColumnDef)
  columnDef!: MatColumnDef;

  /**
   * A reference to the host table.
   *
   * @example
   * export class MyTable extends NgxMaterialDataTable {
   *     readonly host = this;
   *     // ...
   * }
   *
   * @example ```html
   * <mdt-selection-cell [host]="host" name="select"></mdt-selection-cell>
   * ```
   */
  @Input()
  host?: NgxMaterialDataTable<any>

  private _name!: string;

  /**
   * The name of the underlying `MatColumnDef`.
   *
   * @example ```html
   * <mdt-selection-cell [host]="host" name="select"></mdt-selection-cell>
   * ```
   *
   * @see MatColumnDef
   */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
    if (this.columnDef) {
      this.columnDef.name = name;
    }
  }

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    public table: MatTable<any>
  ) { }

  ngOnInit() {
    this.changeDetector.detectChanges();
    this.table.addColumnDef(this.columnDef);

    if (!this.host) {
      console.warn(`
        [${SelectionCellComponent.name}]
        Could not find host component. Make sure you use the "host" input
        and provide the "this" of your Table component!
      `);
    }
  }

}
