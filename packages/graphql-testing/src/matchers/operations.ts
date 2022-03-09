import {
  matcherHint,
  printExpected,
  EXPECTED_COLOR as expectedColor,
} from 'jest-matcher-utils';
import {GraphQLOperation, DocumentNode} from 'graphql-typed';
import {Operation} from '@apollo/client';

import {GraphQL} from '../graphql-controller';
import {
  operationNameFromDocument,
  operationTypeFromDocument,
} from '../utilities';

import {assertIsGraphQL, diffVariablesForOperation} from './utilities';

export function toHavePerformedGraphQLOperation<Variables>(
  this: jest.MatcherUtils,
  graphQL: GraphQL,
  document: GraphQLOperation<any, Variables, any>,
  variables?: Variables,
) {
  assertIsGraphQL(graphQL, {
    expectation: 'toHavePerformedGraphQLOperation',
    isNot: this.isNot,
  });

  const foundByOperation = graphQL.operations.all({
    query: document as DocumentNode,
  });

  const foundByVariables =
    variables == null
      ? foundByOperation
      : foundByOperation.filter((operation) =>
          Object.keys(variables).every((key) =>
            this.equals(variables[key], operation.variables[key]),
          ),
        );

  const pass = foundByVariables.length > 0;

  const type = operationTypeFromDocument(document as DocumentNode) || 'query';
  const name = operationNameFromDocument(document as DocumentNode) || 'unnamed';

  const message = pass
    ? () =>
        `${matcherHint('.not.toHavePerformedGraphQLOperation')}\n\n` +
        `Expected not to have performed GraphQL ${type}:\n  ${expectedColor(
          name,
        )}\n${
          variables
            ? `With variables matching:\n  ${printExpected(variables)}\n`
            : ''
        }` +
        `But ${foundByVariables.length} matching ${
          foundByVariables.length === 1 ? 'operation was' : 'operations were'
        } found.\n`
    : () =>
        `${
          `${matcherHint('.toHavePerformedGraphQLOperation')}\n\n` +
          `Expected to have performed GraphQL ${type}:\n  ${expectedColor(
            name,
          )}\n${
            variables
              ? `With props matching:\n  ${printExpected(variables)}\n`
              : ''
          }`
        }${
          foundByVariables.length === 0
            ? `But no matching operations were found.\n`
            : `But the ${
                foundByVariables.length === 1
                  ? 'found operation has'
                  : 'found operations have'
              } the following variable differences:\n\n${diffs(
                foundByVariables,
                variables! as any,
                this.expand,
              )}`
        }`;

  return {pass, message};
}

function diffs(operations: Operation[], variables: object, expand?: boolean) {
  return operations.reduce<string>(
    (diffs, operation, index) =>
      `${diffs}${index === 0 ? '' : '\n\n'}${normalizedDiff(
        operation,
        variables,
        {
          expand,
          showLegend: index === 0,
        },
      )}`,
    '',
  );
}

function normalizedDiff(
  operation: Operation,
  variables: object,
  {expand = false, showLegend = false},
) {
  const result =
    diffVariablesForOperation(operation, variables, {
      expand,
    }) || '';

  return showLegend ? result : result.split('\n\n')[1];
}
