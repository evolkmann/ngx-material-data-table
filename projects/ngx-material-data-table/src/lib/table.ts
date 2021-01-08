import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Directive, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { share, startWith, switchMap, tap } from 'rxjs/operators';
import { BaseTableConfig, ConfigToDataMapper, ConfigToShortNamesMapper, SortEventMapper } from './config';
import { zeroBasedPageOptions, Page, defaultPageSizes } from './page';

/**
 * Compiler-Flags:
 * - @dynamic (fixes https://github.com/ng-packagr/ng-packagr/issues/1185)
 */
@Directive()
export abstract class NgxMaterialDataTable<
  DataType,
  ConfigType extends BaseTableConfig = BaseTableConfig,
  SelectionType = number,
  OrderByType = string
> implements OnInit, AfterViewInit, OnDestroy {

  protected readonly _router: Router;
  protected readonly _route: ActivatedRoute;

  protected readonly configFromUrl: ConfigType | undefined;
  protected readonly config: BehaviorSubject<ConfigType>;

  private configSub?: Subscription;
  private valueChangesSub?: Subscription;

  readonly initialPageEvent: PageEvent;
  readonly defaultPageSizeOptions = defaultPageSizes;

  data!: Observable<Page<DataType>>;

  @ViewChild(MatPaginator, { static: true })
  paginator?: MatPaginator;

  /**
   * Please use `toggleRowSelection()` instead of
   * `selection.toggle()`!
   */
  readonly selection = new SelectionModel<SelectionType>(true, []);
  readonly isAllSelected = new BehaviorSubject<boolean>(false);
  /**
   * We store the IDs on the current page to check if all options
   * are selected (for the checkbox in the header row).
   */
  private readonly pageIdsStorageKey = `${NgxMaterialDataTable.name}_pageIds_`;

  constructor(
    /**
     * Unique identifier for this table inside your application.
     * It is used to create query params and localStorage entries.
     *
     * We recommend to use an `enum`.
     */
    protected readonly tableName: string,
    /**
     * We need a router instance to modify query params.
     */
    router: Router,
    /**
     * We need the activated route to read query params.
     */
    route: ActivatedRoute,
    private readonly configDataMapper: ConfigToDataMapper<ConfigType, DataType>,
    private readonly sortEventMapper?: SortEventMapper<OrderByType>,
    private readonly configToShortNamesMapper?: ConfigToShortNamesMapper<ConfigType>,
    public readonly defaultConfigValues?: Partial<ConfigType>,
    /**
     * By default, the table assumes your pagination is zero based.
     */
    private readonly defaultPageOptions = zeroBasedPageOptions,
    /**
     * By default, the table assumes that your records have an `id`
     * property to use for selections.
     */
    public readonly defaultIdProperty = 'id'
  ) {
    this.pageIdsStorageKey += this.tableName;
    this._router = router;
    this._route = route;

    this.configFromUrl = BaseTableConfig.decode(this._route.snapshot.queryParams[this.tableName], this.configToShortNamesMapper) as ConfigType;

    this.initialPageEvent = {
      pageIndex: this.configFromUrl?.pageIndex || (defaultConfigValues?.pageIndex as number) || this.defaultPageOptions.page,
      pageSize: this.configFromUrl?.pageSize || (defaultConfigValues?.pageSize as number) || this.defaultPageOptions.pageSize,
      length: 0,
      previousPageIndex: undefined
    };

    this.config = new BehaviorSubject({
      ...(this.defaultConfigValues || {}),
      ...this.configFromUrl,
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize
    } as ConfigType);
  }

  ngOnInit() {
    this.data = this.config.pipe(
      switchMap(config => this.configDataMapper(config)),
      tap(page => {
        const pageIds = page.results.map((result: any) => result[this.defaultIdProperty]);
        this.setPageIds(pageIds);
        this.updateIsAllSelected();
      }),
      share()
    );
  }

  private updateIsAllSelected() {
    this.isAllSelected.next(this.getPageIds().every(pageId => {
      return this.selection.selected.includes(pageId);
    }));
  }

  ngAfterViewInit() {
    this.onPaginatorChange();
    this.storeConfigInUrl();
  }

  ngOnDestroy() {
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }
  }

  onSortChange(sortEvent: Sort) {
    let orderBy = this.sortEventMapper ? this.sortEventMapper(sortEvent, sortEvent.direction === 'asc') : sortEvent;
    if (orderBy) {
      this.config.next({
        ...this.config.value,
        orderBy
      });
    }
  }

  /**
   * Please use this instead of `selection.toggle` to make sure
   * that `isAllSelected` is properly updated.
   *
   * @param id the record id to select or deselect
   */
  toggleRowSelection(id: SelectionType) {
    this.selection.toggle(id);
    this.updateIsAllSelected();
  }

  masterToggle() {
    const isAllSelected = this.isAllSelected.value;
    const pageIds = this.getPageIds();
    if (isAllSelected) {
      this.selection.deselect(...pageIds);
    } else {
      this.selection.select(...pageIds);
    }
    this.updateIsAllSelected();
  }

  private onPaginatorChange() {
    if (!this.paginator) {
      console.warn(`MatPaginator is missing in ${this.constructor.name}:

        <mat-paginator
          [length]="(data | async)?.totalResultsSize"
          [pageSize]="initialPageEvent.pageSize"
          [pageIndex]="initialPageEvent.pageIndex"
          [pageSizeOptions]="defaultPageSizeOptions">
        </mat-paginator>
      `)
      return;
    }

    this.valueChangesSub = this.paginator.page.asObservable().pipe(
      startWith(this.initialPageEvent)
    ).pipe(
      tap(pageEvent => {
        this.config.next({
          ...this.config.value,
          pageIndex: pageEvent.pageIndex,
          pageSize: pageEvent.pageSize
        });
      })
    ).subscribe();
  }

  private storeConfigInUrl() {
    this.configSub = this.config.pipe(
      switchMap(config => this._router.navigate([], {
        queryParams: {
          [this.tableName]: BaseTableConfig.encode(config, this.configToShortNamesMapper)
        },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
        replaceUrl: true
      }))
    ).subscribe();
  }

  private setPageIds(ids: SelectionType[]) {
    localStorage.setItem(this.pageIdsStorageKey, JSON.stringify(ids));
  }

  private getPageIds(): SelectionType[] {
    return JSON.parse(localStorage.getItem(this.pageIdsStorageKey) || '[]');
  }

}
