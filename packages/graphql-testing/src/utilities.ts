import {Operation} from 'apollo-link';

export class Operations {
  private operations: Operation[] = [];

  constructor(operations?: Operation[]) {
    this.operations = operations ? [...operations] : [];
  }

  [Symbol.iterator]() {
    return this.operations[Symbol.iterator]();
  }

  nth(index: number) {
    return index < 0
      ? this.operations[this.operations.length + index]
      : this.operations[index];
  }

  push(...operations: Operation[]) {
    this.operations.push(...operations);
  }

  all(options?: {operationName?: string}): Operation[] {
    const operationName = options && options.operationName;
    if (!options || !operationName) {
      return this.operations;
    }

    const allMatchedOperations = this.operations.filter(
      req => req.operationName === operationName,
    );

    return allMatchedOperations;
  }

  last(options?: {operationName?: string}): Operation {
    const operationName = options && options.operationName;
    const lastOperation = operationName
      ? this.operations
          .reverse()
          .find(req => req.operationName === operationName)
      : this.operations[this.operations.length - 1];

    if (lastOperation == null && operationName) {
      throw new Error(
        `no operation with operationName '${operationName}' were found.`,
      );
    } else if (lastOperation == null) {
      throw new Error(`no operation were found.`);
    }

    return lastOperation;
  }
}
