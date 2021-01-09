import { NgxMaterialDataTable } from './table';

/**
 * Allows you to use the Angular lifecycle hooks that
 * the table already uses internally.
 */
export namespace NgxMaterialDataTableHooks {

  /**
   * A lifecycle hook that is executed before Angular's `ngOnInit()`.
   */
  export interface BeforeOnInit {
    beforeOnInit(): void;
  }

  /**
   * A lifecycle hook that is executed after Angular's `ngOnInit()`.
   */
  export interface AfterOnInit {
    afterOnInit(): void;
  }

  /**
   * A lifecycle hook that is executed before Angular's `ngAfterViewInit()`.
   */
  export interface BeforeAfterViewInit {
    beforeAfterViewInit(): void;
  }

  /**
   * A lifecycle hook that is executed after Angular's `ngAfterViewInit()`.
   */
  export interface AfterAfterViewInit {
    afterAfterViewInit(): void;
  }

  /**
   * A lifecycle hook that is executed before Angular's `ngOnDestroy()`.
   */
  export interface BeforeOnDestroy {
    beforeOnDestroy(): void;
  }

  /**
   * A lifecycle hook that is executed after Angular's `ngOnDestroy()`.
   */
  export interface AfterOnDestroy {
    afterOnDestroy(): void;
  }

}

type AnyTable = NgxMaterialDataTable<any, any, any, any, any>;

export function _beforeOnInitActive(host: AnyTable & Partial<NgxMaterialDataTableHooks.BeforeOnInit>): host is AnyTable & NgxMaterialDataTableHooks.BeforeOnInit {
  return typeof host.beforeOnInit !== 'undefined';
}

export function _afterOnInitActive(host: AnyTable & Partial<NgxMaterialDataTableHooks.AfterOnInit>): host is AnyTable & NgxMaterialDataTableHooks.AfterOnInit {
  return typeof host.afterOnInit !== 'undefined';
}

export function _beforeAfterViewInitActive(host: AnyTable & Partial<NgxMaterialDataTableHooks.BeforeAfterViewInit>): host is AnyTable & NgxMaterialDataTableHooks.BeforeAfterViewInit {
  return typeof host.beforeAfterViewInit !== 'undefined';
}

export function _afterAfterViewInitActive(host: AnyTable & Partial<NgxMaterialDataTableHooks.AfterAfterViewInit>): host is AnyTable & NgxMaterialDataTableHooks.AfterAfterViewInit {
  return typeof host.afterAfterViewInit !== 'undefined';
}

export function _beforeOnDestroyActive(host: AnyTable & Partial<NgxMaterialDataTableHooks.BeforeOnDestroy>): host is AnyTable & NgxMaterialDataTableHooks.BeforeOnDestroy {
  return typeof host.beforeOnDestroy !== 'undefined';
}

export function _afterOnDestroyActive(host: AnyTable & Partial<NgxMaterialDataTableHooks.AfterOnDestroy>): host is AnyTable & NgxMaterialDataTableHooks.AfterOnDestroy {
  return typeof host.afterOnDestroy !== 'undefined';
}
