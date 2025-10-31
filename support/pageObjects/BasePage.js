class BasePage {
  constructor() {
    this.baseUrl = Cypress.config('baseUrl') || 'http://localhost:5173';
    this.apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  }

  visit(path, options = {}) {
    const defaultOptions = {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    };
    cy.visit(`${this.baseUrl}${path}`, { ...defaultOptions, ...options });
  }

  getElement(selector) {
    return cy.get(selector);
  }

  clickElement(selector) {
    return cy.get(selector).click();
  }

  typeText(selector, text) {
    return cy.get(selector).clear().type(text);
  }

  verifyText(text) {
    return cy.contains(text).should('be.visible');
  }

  verifyElementVisible(selector) {
    return cy.get(selector).should('be.visible');
  }

  verifyElementNotExist(selector) {
    return cy.get(selector).should('not.exist');
  }

  verifyUrl(urlPart) {
    return cy.url().should('include', urlPart);
  }

  waitForElement(selector, timeout = 10000) {
    return cy.get(selector, { timeout }).should('be.visible');
  }
}

export default BasePage;