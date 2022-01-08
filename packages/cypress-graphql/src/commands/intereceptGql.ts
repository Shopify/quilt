import {
  HttpResponseInterceptor,
  StaticResponse,
} from 'cypress/types/net-stubbing';

import {hasOperationName} from '../utils/hasOperationName';

Cypress.Commands.add(
  'interceptGql',
  (
    knownOperations: (
      | string
      | [string, StaticResponse | HttpResponseInterceptor]
    )[],
  ) => {
    // Create a single cypress route for all GQL queries
    Cypress.log({
      name: 'Intercept GraphQL',
      displayName: 'interceptGql',
      message: knownOperations.map((op) => (Array.isArray(op) ? op[0] : op)),
      consoleProps: () => knownOperations,
    });
    cy.intercept('POST', '**/graphql', (req) => {
      // Define sub-routes based on the graphql operation name
      for (const operation of knownOperations) {
        const operationName = Array.isArray(operation)
          ? operation[0]
          : operation;
        const responseInterceptor = Array.isArray(operation)
          ? operation[1]
          : undefined;
        if (hasOperationName(req, operationName)) {
          // NOTE: cannot use cy.log in here due to circular logic
          console.log(`Request fired for @${operationName}:`, req);
          req.alias = operationName; // practical usage: cy.wait('@QueryName')
          // Override the response with mock data, if provided
          if (typeof responseInterceptor !== 'undefined') {
            console.warn(
              `Response intercepted for ${operationName}:`,
              responseInterceptor,
            );
            req.reply(responseInterceptor);
          }
          return undefined;
        }
      }
    }).as('GraphQL');
  },
);
