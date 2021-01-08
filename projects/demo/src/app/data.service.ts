import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, share, tap } from 'rxjs/operators';
import { Page, zeroBasedPageOptions } from '../../../../dist/ngx-material-data-table';
import { PersonTableConfig } from './demo/components/demo-table/demo-table.component';

export interface Person {
  id: number;
  name: string;
  age: number;
}

export enum PersonOrderBy {
  ID_ASC = 'ID_ASC',
  ID_DESC = 'ID_DESC',
  NAME_ASC = 'NAME_ASC',
  NAME_DESC = 'NAME_DESC',
  AGE_ASC = 'AGE_ASC',
  AGE_DESC = 'AGE_DESC'
}

const persons: Person[] = [];

for (let i = 1; i <= 100; i++) {
  persons.push({
    id: i,
    name: `Person #${i}`,
    age: Math.trunc(Math.random() * 70) + 10
  });
}

// https://www.30secondsofcode.org/js/s/chunk
const chunk = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly loading = new BehaviorSubject<boolean>(false);
  readonly isLoading = this.loading.asObservable().pipe(share());

  constructor() { }

  getData(config: PersonTableConfig): Observable<Page<Person>> {
    this.startLoading();

    const pageSize = config.pageSize || zeroBasedPageOptions.pageSize;
    const sorted = persons.sort((a, b) => {
      switch (config.orderBy && config.orderBy[0]) {
        case PersonOrderBy.ID_ASC: return a.id - b.id;
        case PersonOrderBy.ID_DESC: return b.id - a.id;
        case PersonOrderBy.NAME_ASC: return a.name < b.name ? -1 : 1;
        case PersonOrderBy.NAME_DESC: return b.name < a.name ? -1 : 1;
        case PersonOrderBy.AGE_ASC: return a.age - b.age;
        case PersonOrderBy.AGE_DESC: return b.age - a.age;
        default: return 0;
      }
    });
    const filtered = sorted.filter(person => {
      if (config.minAge) {
        return person.age >= config.minAge;
      }

      return true;
    });
    const data = chunk(filtered, pageSize)[config.pageIndex || zeroBasedPageOptions.page];

    return of({
      results: data,
      totalResultsSize: filtered.length
    }).pipe(
      delay(500),
      tap(_ => this.stopLoading())
    );
  }

  private startLoading() {
    requestAnimationFrame(() => this.loading.next(true));
  }

  private stopLoading() {
    requestAnimationFrame(() => this.loading.next(false));
  }
}
