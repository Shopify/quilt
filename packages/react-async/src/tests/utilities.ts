import {Manager, Record} from '../manager';

export function createManager(registered: Record<any>[] = []): Manager {
  return {
    registered: new Set(registered),
    markAsUsed() {},
    register() {
      return () => {};
    },
  };
}
