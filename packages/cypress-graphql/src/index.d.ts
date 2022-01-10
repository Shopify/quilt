declare namespace Cypress {
  interface Chainable {
    /**
     * interceptGql will log and intercept GQL queries/mutations based on the operationname
     * Said requests can be awaited and their responses may be tested like any cypress route
     * @see https://docs.cypress.io/api/commands/intercept
     * @future If this works well, add as package for https://github.com/Shopify/quilt
     * @param knownOperations list of known queries/mutations (plus response intercepts, if needed)
     */
    interceptGql(knownOperations: Array<string | [string, StaticResponse | HttpResponseInterceptor]>): Cypress.Chainable<undefined>;
  }
}
