class ApiHelpers {
  constructor() {
    this.baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  }

  // Customer API endpoints
  mockGetCustomers(customers, alias = 'getCustomers') {
    cy.intercept('GET', `${this.baseUrl}/customer`, {
      statusCode: 200,
      body: { data: customers }
    }).as(alias);
  }

  mockGetCustomerById(customerId, customerData, alias = 'getCustomer') {
    cy.intercept('GET', `${this.baseUrl}/customer/${customerId}`, {
      statusCode: 200,
      body: { data: customerData }
    }).as(alias);
  }

  mockCreateCustomer(responseData, alias = 'createCustomer') {
    cy.intercept('POST', `${this.baseUrl}/customer`, {
      statusCode: 201,
      body: responseData
    }).as(alias);
  }

  mockUpdateCustomer(customerId, responseData, alias = 'updateCustomer') {
    cy.intercept('PUT', `${this.baseUrl}/customer/${customerId}`, {
      statusCode: 200,
      body: responseData
    }).as(alias);
  }

  mockDeleteCustomer(customerId, alias = 'deleteCustomer') {
    cy.intercept('DELETE', `${this.baseUrl}/customer/${customerId}`, {
      statusCode: 200,
      body: { message: 'Customer deleted successfully' }
    }).as(alias);
  }

  // Error responses
  mockServerError(method, endpoint, alias = 'serverError') {
    cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as(alias);
  }

  mockValidationError(method, endpoint, alias = 'validationError') {
    cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
      statusCode: 400,
      body: { message: 'Validation error' }
    }).as(alias);
  }

  mockNotFoundError(method, endpoint, alias = 'notFoundError') {
    cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
      statusCode: 404,
      body: { message: 'Not found' }
    }).as(alias);
  }

  mockNetworkError(method, endpoint, alias = 'networkError') {
    cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
      forceNetworkError: true
    }).as(alias);
  }

  mockDelayedResponse(method, endpoint, responseData, delay = 2000, alias = 'delayedResponse') {
    cy.intercept(method, `${this.baseUrl}/${endpoint}`, (req) => {
      req.reply({
        statusCode: 200,
        body: responseData,
        delay: delay
      });
    }).as(alias);
  }

  // Wait for API calls
  waitForApi(alias) {
    cy.wait(`@${alias}`);
  }

  waitForMultipleApis(aliases) {
    aliases.forEach(alias => {
      cy.wait(`@${alias}`);
    });
  }
}

export default new ApiHelpers();