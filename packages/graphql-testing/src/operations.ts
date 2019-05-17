import {DocumentNode} from 'graphql';
import {Operation} from 'apollo-link';
import {operationNameFromDocument} from './utilities';

interface FindOptions {
  operationName?: string;
  query?: DocumentNode | {resolved?: DocumentNode};
  mutation?: DocumentNode;
}

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

  private filterWhere({query, mutation, operationName}: FindOptions = {}) {
    if ([query, mutation, operationName].filter(Boolean).length > 1) {
      throw new Error(
        'You can only pass one of query, mutation, or operationName when finding a GraphQL operation',
      );
    }

    const finalOperationName =
      operationName || operationNameFromDocument((query || mutation)!);

    return finalOperationName
      ? this.operations.filter(
          ({operationName}) => operationName === finalOperationName,
        )
      : this.operations;
  }
}
