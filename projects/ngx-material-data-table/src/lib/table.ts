import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Directive, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { share, startWith, switchMap, tap } from 'rxjs/operators';
import { BaseTableConfig, BaseTableConfigShort, ConfigToDataMapper, ConfigToShortNamesMapper, decodeConfig, encodeConfig, SortEventMapper } from './config';
import { _afterAfterViewInitActive, _afterOnDestroyActive, _afterOnInitActive, _beforeAfterViewInitActive, _beforeOnDestroyActive, _beforeOnInitActive } from './lifecycle-hooks';
import { defaultPageSizes, Page, zeroBasedPageOptions } from './page';

/**
 * @param {DataType} DataType
 *    The type of data you are displaying in the table
 * @param {ConfigType} ConfigType
 *    When your table accepts special config params,
 *    extend the `BaseTableConfig` interface and provide this parameter.
 *    (ex: `interface Conf { minAge?: number; name?: string; }`)
 * @param {ShortConfigType} ShortConfigType
 *    To serialize the table config in the URL, you can optionally provide
 *    an interface with the same content as `ConfigType` but with short names.
 *    (ex: `interface ShortConf { m?: number; e?: string; }`)
 * @param {SelectionType} SelectionType
 *    The type of data stored in the table's selection when using the
 *    `<mdt-selection-cell>` component. This defaults to `number`, since
 *    most records have a numeric `id` property. If you use `uuid`s for example,
 *    you could set this to `string`.
 * @param {OrderByType} OrderByType
 *    Please check the documentation of `SortEventMapper`.
 *
 * @see {SortEventMapper} for documentation of the `OrderByType` param.
 *
 * @dynamic (fixes https://github.com/ng-packagr/ng-packagr/issues/1185)
 */
@Directive()
export abstract class NgxMaterialDataTable<
  DataType,
  ConfigType extends BaseTableConfig = BaseTableConfig,
  ShortConfigType extends BaseTableConfigShort = BaseTableConfigShort,
  SelectionType = number,
  OrderByType = string
> implements OnInit, AfterViewInit, OnDestroy {

  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  protected readonly configFromUrl: ConfigType | undefined;
  protected readonly config: BehaviorSubject<ConfigType>;

  private configSub?: Subscription;
  private valueChangesSub?: Subscription;
  /**
   * Indicates if `ngOnInit()` has passed.
   */
  private initialized = false;

  readonly initialPageEvent: PageEvent;
  readonly defaultPageSizeOptions = defaultPageSizes;

  data!: Observable<Page<DataType>>;

  @ViewChild(MatPaginator, { static: true })
  paginator?: MatPaginator;

  /**
   * Emitted each time the table config changes.
   */
  @Output()
  readonly configChange = new EventEmitter<ConfigType>();

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
  private readonly pageIdsStorageKey = `ngx_material_data_table_page_ids_`;

  /**
   * @param tableName
   *    Unique identifier for this table inside your application.
   *    It is used to create query params and localStorage entries.
   *    We recommend to use an `enum`.
   * @param configDataMapper
   *    Based on the table config, this must return an observable
   *    with the current page data.
   * @param sortEventMapper
   *    Please check the documentation of `SortEventMapper`.
   * @param configToShortNamesMapper
   *    Please check the documentation of `ConfigToShortNamesMapper`.
   * @param defaultConfigValues
   *    Optionally set some default options to be applied.
   * @param defaultPageOptions
   *    By default, the table assumes your pagination is zero based.
   * @param defaultIdProperty
   *    By default, the table assumes that your records have an `id`
   *    property to use for selections.
   */
  protected constructor(
    protected readonly tableName: string,
    private readonly configDataMapper: ConfigToDataMapper<ConfigType, DataType>,
    private readonly sortEventMapper?: SortEventMapper<OrderByType>,
    private readonly configToShortNamesMapper?: ConfigToShortNamesMapper<ConfigType, ShortConfigType>,
    public readonly defaultConfigValues?: Partial<ConfigType>,
    private readonly defaultPageOptions = zeroBasedPageOptions,
    public readonly defaultIdProperty = 'id'
  ) {
    this.pageIdsStorageKey += this.tableName;

    this.configFromUrl = decodeConfig(this.route.snapshot.queryParams[this.tableName], this.configToShortNamesMapper);

    this.initialPageEvent = {
      pageIndex: typeof this.configFromUrl?.pageIndex === 'number'
        ? this.configFromUrl.pageIndex
        : (typeof defaultConfigValues?.pageIndex === 'number' ? defaultConfigValues.pageIndex : this.defaultPageOptions.page),
      pageSize: typeof this.configFromUrl?.pageSize === 'number'
        ? this.configFromUrl.pageSize
        : (typeof defaultConfigValues?.pageSize === 'number' ? defaultConfigValues.pageSize : this.defaultPageOptions.pageSize),
      length: 0,
      previousPageIndex: undefined
    };

    this.config = new BehaviorSubject({
      ...(this.defaultConfigValues || {}),
      ...(this.configFromUrl || {}),
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize
    } as ConfigType);
  }

  ngOnInit() {
    if (_beforeOnInitActive(this)) {
      this.beforeOnInit();
    }

    this.data = this.config.pipe(
      switchMap(config => this.configDataMapper(config)),
      tap(page => {
        const pageIds = page.results.map((result: any) => result[this.defaultIdProperty]);
        this.setPageIds(pageIds);
        this.updateIsAllSelected();
      }),
      share()
    );

    if (_afterOnInitActive(this)) {
      this.afterOnInit();
    }

    this.initialized = true;
  }

  private updateIsAllSelected() {
    this.isAllSelected.next(this.getPageIds().every(pageId => {
      return this.selection.selected.includes(pageId);
    }));
  }

  ngAfterViewInit() {
    if (_beforeAfterViewInitActive(this)) {
      this.beforeAfterViewInit();
    }

    this.onPaginatorChange();
    this.storeConfigInUrl();

    if (_afterAfterViewInitActive(this)) {
      this.afterAfterViewInit();
    }
  }

  ngOnDestroy() {
    if (_beforeOnDestroyActive(this)) {
      this.beforeOnDestroy();
    }

    if (this.configSub) {
      this.configSub.unsubscribe();
    }
    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }

    if (_afterOnDestroyActive(this)) {
      this.afterOnDestroy();
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

  /**
   * When using Angular `Inputs()`, use this function to populate the config
   * instead of manually calling `this.config.next()`;
   *
   * It will use the encoded value from the URL if possible when the component
   * is first loaded. After `ngOnInit()` has run, the input-provided value will
   * always be used and the URL-encoded value will be ignored.
   *
   * @param key The key of the config object to populate
   * @param inputValue The value received in your `@Input` setter
   * @param shouldUseValueFromUrl An expression to determine of the value from
   *   the URL is valid, for example if it is not null.
   *
   * @example
   * ```ts
   * @Input()
   * set myInput(value: boolean) {
   *   this.safelySetConfigProperty<boolean | undefined>(
   *     'myConfigKey',
   *     value,
   *     valueFromUrl => typeof valueFromUrl === 'boolean'
   *   );
   * }
   * ```
   */
  protected safelySetConfigProperty<InputType = any>(
    key: keyof ConfigType,
    inputValue: InputType,
    shouldUseValueFromUrl: (val: InputType) => boolean = () => false
  ): void {
    const useValueFromUrl = !this.initialized && shouldUseValueFromUrl((this.configFromUrl as any)?.[key]);
    this.config.next({
      ...this.config.value,
      [key]: useValueFromUrl ? this.configFromUrl?.[key] : inputValue
    });
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
      tap(config => this.configChange.emit(config)),
      switchMap(config => this.router.navigate([], {
        queryParams: {
          [this.tableName]: encodeConfig(config, this.configToShortNamesMapper)
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
