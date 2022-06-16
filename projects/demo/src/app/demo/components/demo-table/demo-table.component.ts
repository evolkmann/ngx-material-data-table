import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseTableConfig, BaseTableConfigShort, ConfigToShortNamesMapper, NgxMaterialDataTable, SortEventMapper } from 'ngx-material-data-table';
import { tap } from 'rxjs/operators';
import { DataService, Person, PersonOrderBy } from '../../../data.service';

enum DisplayColumns {
  SELECT = 'select',
  ID = 'id',
  NAME = 'first_name',
  AGE = 'last_name'
}

export interface PersonTableConfig extends BaseTableConfig {
  minAge?: number;
}

interface PersonTableShortConfig extends BaseTableConfigShort {
  m?: number;
}

const sortEventMapper: SortEventMapper<PersonOrderBy> = (sort, isAscending) => {
  let order = PersonOrderBy.ID_ASC;
  if (sort.direction === '') {
    order = PersonOrderBy.ID_ASC;
  } else {
    switch (sort.active) {
      case DisplayColumns.ID: order = (isAscending ? PersonOrderBy.ID_ASC : PersonOrderBy.ID_DESC); break;
      case DisplayColumns.NAME: order = (isAscending ? PersonOrderBy.NAME_ASC : PersonOrderBy.NAME_DESC); break;
      case DisplayColumns.AGE: order = (isAscending ? PersonOrderBy.AGE_ASC : PersonOrderBy.AGE_DESC); break;
    }
  }
  return [order];
}

const configMapper: ConfigToShortNamesMapper<PersonTableConfig, PersonTableShortConfig> = {
  toShort: c => ({
    m: c.minAge
  }),
  fromShort: c => ({
    minAge: c.m
  })
};

@Component({
  selector: 'app-demo-table',
  templateUrl: './demo-table.component.html',
  styleUrls: ['./demo-table.component.scss'],
})
export class DemoTableComponent extends NgxMaterialDataTable<
  Person,
  PersonTableConfig,
  PersonTableShortConfig,
  Person['id'],
  PersonOrderBy
> {
  host = this;

  readonly configForm = new FormGroup({
    minAge: new FormControl<number | null>(null, Validators.min(0))
  });

  readonly columnNames = DisplayColumns;
  readonly displayedColumns: DisplayColumns[] = [
    DisplayColumns.SELECT,
    DisplayColumns.ID,
    DisplayColumns.NAME,
    DisplayColumns.AGE
  ];

  constructor(
    route: ActivatedRoute,
    router: Router,
    private readonly service: DataService
  ) {
    super(
      'persons',
      router,
      route,
      config => this.service.getData(config),
      sortEventMapper,
      configMapper
    );

    // Set our custom options based on parsed options from query params
    this.configForm.get('minAge')?.setValue(this.config.value.minAge || null);

    // Update the config with our custom properties
    this.configForm.valueChanges.pipe(
      tap(value => {
        this.config.next({
          ...this.config.value,
          minAge: value.minAge || undefined
        })
      })
    ).subscribe();
  }

}
