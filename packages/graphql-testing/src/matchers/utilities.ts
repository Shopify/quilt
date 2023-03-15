import {
  diff,
  matcherErrorMessage,
  matcherHint,
  RECEIVED_COLOR as receivedColor,
  printWithType,
  printReceived,
} from 'jest-matcher-utils';
import {Operation} from '@apollo/client';

import {GraphQL} from '../graphql-controller';

export function assertIsGraphQL(
  graphQL: unknown,
  {expectation, isNot}: {expectation: string; isNot: boolean},
) {
  if (!(graphQL instanceof GraphQL)) {
    throw new Error(
      matcherErrorMessage(
        matcherHint(`.${expectation}`, undefined, undefined, {isNot}),
        `${receivedColor(
          'received',
        )} value must be a @shopify/graphql-testing GraphQL object`,
        printWithType('Received', graphQL, printReceived),
      ),
    );
  }
}

export function diffVariablesForOperation(
  operation: Operation,
  variables: object,
  {expand = false},
) {
  return diff(variables, getObjectSubset(operation.variables, variables), {
    expand,
  });
}

// Original from https://github.com/facebook/jest/blob/master/packages/expect/src/utils.ts#L107
function getObjectSubset(object: any, subset: any): any {
  if (Array.isArray(object)) {
    if (Array.isArray(subset) && subset.length === object.length) {
      return subset.map((sub: any, i: number) =>
        getObjectSubset(object[i], sub),
      );
    }
  } else if (object instanceof Date) {
    return object;
  } else if (
    typeof object === 'object' &&
    object !== null &&
    typeof subset === 'object' &&
    subset !== null
  ) {
    const trimmed: any = {};
    Object.keys(subset)
      .filter((key) => Reflect.has(object, key))
      .forEach(
        (key) => (trimmed[key] = getObjectSubset(object[key], subset[key])),
      );

    if (Object.keys(trimmed).length > 0) {
      return trimmed;
    }
  }

  return object;
}
