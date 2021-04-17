import { BaseTableConfig } from './config';
import { oneBasedPageOptions, zeroBasedPageOptions } from './page';
import { offsetPaginationVariables } from './utils';

describe('utils', () => {

  describe('offsetPaginationVariables', () => {
    it('should transform the table config', () => {
      const config: BaseTableConfig = {
        pageIndex: 0,
        pageSize: 10
      };
      expect(offsetPaginationVariables(config)).toEqual({
        first: config.pageSize,
        offset: 0
      });

      config.pageSize = 5;
      config.pageIndex = 1;
      expect(offsetPaginationVariables(config)).toEqual({
        first: config.pageSize,
        offset: 5
      });
    });

    it('should apply defaults', () => {
      expect(offsetPaginationVariables({
        pageSize: 10
      })).toEqual({
        first: 10,
        offset: zeroBasedPageOptions.page * 10
      });
      expect(offsetPaginationVariables({
        pageIndex: 5
      })).toEqual({
        first: zeroBasedPageOptions.pageSize,
        offset: zeroBasedPageOptions.pageSize * 5
      });

      expect(offsetPaginationVariables({
        pageSize: 10
      }, oneBasedPageOptions)).toEqual({
        first: 10,
        offset: oneBasedPageOptions.page * 10
      });
      expect(offsetPaginationVariables({
        pageIndex: 5
      }, oneBasedPageOptions)).toEqual({
        first: oneBasedPageOptions.pageSize,
        offset: oneBasedPageOptions.pageSize * 5
      });
    });
  });

});
