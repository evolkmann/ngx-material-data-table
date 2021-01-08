export interface Page<T = any> {
  results: T[];
  totalResultsSize: number;
}

export interface PageOptions {
  page: number;
  pageSize: number;
}

export const defaultPageSizes = [
  5,
  10,
  25,
  50
]

export const zeroBasedPageOptions: PageOptions = {
  page: 0,
  pageSize: defaultPageSizes[0]
}

export const oneBasedPageOptions: PageOptions = {
  page: 0,
  pageSize: defaultPageSizes[0]
}

export const noPagination: PageOptions = {
  page: undefined as unknown as number,
  pageSize: undefined as unknown as number
}
