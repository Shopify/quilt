import {Operation} from '@apollo/client';

import {operationNameFromFindOptions} from './utilities';
import {FindOptions} from './types';

export class Operations {
  private operations: Operation[] = [];

  constructor(operations?: Operation[]) {
    this.operations = operations ? [...operations] : [];
  }

  [Symbol.iterator]() {
    return this.operations[Symbol.iterator]();
  }

  push(...operations: Operation[]) {
    this.operations.push(...operations);
  }

  all(options?: FindOptions): Operation[] {
    return this.filterWhere(options);
  }

  first(options?: FindOptions): Operation | undefined {
    return this.nth(0, options);
  }

  last(options?: FindOptions): Operation | undefined {
    return this.nth(-1, options);
  }

  nth(index: number, options?: FindOptions) {
    const found = this.filterWhere(options);
    return index < 0 ? found[found.length + index] : found[index];
  }

  private filterWhere(options: FindOptions = {}) {
    const finalOperationName = operationNameFromFindOptions(options);

    return finalOperationName
      ? this.operations.filter(
          ({operationName}) => operationName === finalOperationName,
        )
      : this.operations;
  }
}
