import { BaseTableConfig } from './config';
import { zeroBasedPageOptions } from './page';

/**
 * Based on a `BaseTableConfig` (or an extension of that interface),
 * performs the calculation to transform `pageSize` and `pageIndex` to `offset`.
 *
 * @param config table config object
 * @param defaultPageOptions if `config` does not contain all pagination info, these defaults are used
 * @returns object to be used for offset-based-pagination
 */
export function offsetPaginationVariables(config?: BaseTableConfig, defaultPageOptions = zeroBasedPageOptions): {
  first?: number;
  offset?: number;
  orderBy?: string[];
} {
  return {
    first: config?.pageSize || defaultPageOptions.pageSize,
    offset: (config?.pageIndex || defaultPageOptions.page) * (config?.pageSize || defaultPageOptions.pageSize),
    orderBy: config?.orderBy
  };
}
