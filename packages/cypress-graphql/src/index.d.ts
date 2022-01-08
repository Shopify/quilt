declare namespace Cypress {
  interface Chainable {
    /**
     * Get the redux store for the page
     * @example
     * cy.store().should('exist')
     */
    store: () => Chainable<Store>
    /**
     * Get the redux store for the page
     * @example
     * cy.getState()
     *   .should('have.property', 'todos')
     * cy.getState('todos[0].complete')
     *   .should('be.true')
     */
    getState: (node: string) => Chainable<any>
    /**
     * Dispatch a redux action
     * @example
     * cy.dispatch({ type: 'ADD_TODO', payload: {} })
     *   .then(() => { ... })
     */
    dispatch: (action: Action) => Chainable<any>
  }
}
