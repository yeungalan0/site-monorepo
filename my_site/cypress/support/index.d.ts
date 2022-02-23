/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select set session and mock next-auth login during testing
     * @example cy.login()
     */
    login(sessionName: string): void;
  }
}
