import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Page } from './page';

export enum BaseTableConfigPropertyShortName {
  PAGE_INDEX = 'i',
  PAGE_SIZE = 's',
  ORDER_BY = 'o'
}

export interface BaseTableConfigShort {
  [BaseTableConfigPropertyShortName.PAGE_INDEX]: BaseTableConfig['pageIndex'];
  [BaseTableConfigPropertyShortName.PAGE_SIZE]: BaseTableConfig['pageSize'];
  [BaseTableConfigPropertyShortName.ORDER_BY]: BaseTableConfig['orderBy'];
}

/**
 * This mapper can be used to have different/shorter query param names
 * than the internal config variables.
 *
 * For example, internally we use such a mapper to convert `pageIndex` to `i`
 * before storing it in the query param.
 *
 * @example
 * {
 *   toShort: c => ({
 *     m: c.minAge
 *   }),
 *   fromShort: c => ({
 *     minAge: c.m
 *   })
 * }
 */
export type ConfigToShortNamesMapper<ConfigType extends BaseTableConfig, ShortConfigType extends BaseTableConfigShort> = {
  toShort: (config: ConfigType) => Omit<ShortConfigType, keyof BaseTableConfigShort>;
  fromShort: (shortConfig: ShortConfigType) => Omit<ConfigType, keyof BaseTableConfig>;
};

export interface BaseTableConfig {
  pageIndex?: number;
  pageSize?: number;
  orderBy?: string[];
}

/**
 * Use this function to store a config in the URL.
 */
export function encodeConfig<
  ConfigType extends BaseTableConfig,
  ShortConfigType extends BaseTableConfigShort
>(config: ConfigType, mapper?: ConfigToShortNamesMapper<ConfigType, ShortConfigType>): string {
  return JSON.stringify(toShortNames<ConfigType, ShortConfigType>(config, mapper));
}

/**
 * Use this function to re-construct a config obj from an encoded string.
 */
export function decodeConfig<
  ConfigType extends BaseTableConfig,
  ShortConfigType extends BaseTableConfigShort
>(config: string, mapper?: ConfigToShortNamesMapper<ConfigType, ShortConfigType>): ConfigType | undefined {
  try {
    return fromShortNames(JSON.parse(config), mapper);
  } catch {
    return undefined;
  }
}

function toShortNames<
  ConfigType extends BaseTableConfig,
  ShortConfigType extends BaseTableConfigShort
>(config: ConfigType, mapper?: ConfigToShortNamesMapper<ConfigType, ShortConfigType>): ShortConfigType {
  const mapped = mapper?.toShort ? mapper.toShort(config) : config;
  return {
    [BaseTableConfigPropertyShortName.PAGE_INDEX]: config.pageIndex,
    [BaseTableConfigPropertyShortName.PAGE_SIZE]: config.pageSize,
    [BaseTableConfigPropertyShortName.ORDER_BY]: config.orderBy,
    ...mapped,
    pageIndex: undefined,
    pageSize: undefined,
    orderBy: undefined
  } as unknown as ShortConfigType;
}

function fromShortNames<
  ConfigType extends BaseTableConfig,
  ShortConfigType extends BaseTableConfigShort
>(config: ShortConfigType, mapper?: ConfigToShortNamesMapper<ConfigType, ShortConfigType>): ConfigType {
  const mapped = mapper?.fromShort ? mapper.fromShort(config) : config;
  return {
    pageIndex: Number(config[BaseTableConfigPropertyShortName.PAGE_INDEX]),
    pageSize: Number(config[BaseTableConfigPropertyShortName.PAGE_SIZE]),
    orderBy: config[BaseTableConfigPropertyShortName.ORDER_BY],
    ...mapped
  } as ConfigType;
}

/**
 * This function can be provided to map sort events from the table and
 * transform them to an array of strings will be part of the next config
 * update.
 *
 * If not provided, the config will contain the raw sort event.
 *
 * **Example**
 *
 * This might be useful if your data provider expects a certain set of strings
 * as in a generated GraphQL API
 * (for example by https://github.com/graphile-contrib/pg-order-by-related).
 */
export type SortEventMapper<T> = (sort: Sort, isAscending: boolean) => T[];

/**
 * A function that returns an Observable which yields the paginated data
 * required for the table.
 */
export type ConfigToDataMapper<C extends BaseTableConfig, R> = (config: C) => Observable<Page<R>>;
