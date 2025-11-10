class AdminApiHelpers {
  constructor() {
    this.baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  }

  // Admin API endpoints
  mockGetAdmins(admins, alias = 'getAdmins') {
    cy.intercept('GET', `${this.baseUrl}/admin`, {
      statusCode: 200,
      body: { data: admins }
    }).as(alias);
  }

  mockGetAdminById(adminId, adminData, alias = 'getAdmin') {
    cy.intercept('GET', `${this.baseUrl}/admin/${adminId}`, {
      statusCode: 200,
      body: { data: adminData }
    }).as(alias);
  }

  mockCreateAdmin(responseData, alias = 'createAdmin') {
    cy.intercept('POST', `${this.baseUrl}/admin`, {
      statusCode: 200,
      body: responseData
    }).as(alias);
  }

  mockUpdateAdmin(adminId, responseData, alias = 'updateAdmin') {
    cy.intercept('PUT', `${this.baseUrl}/admin/${adminId}`, {
      statusCode: 200,
      body: responseData
    }).as(alias);
  }

  mockDeleteAdmin(adminId, alias = 'deleteAdmin') {
    cy.intercept('DELETE', `${this.baseUrl}/admin/${adminId}`, {
      statusCode: 200,
      body: { message: 'Admin deleted successfully' }
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
      body: { message: 'Admin not found' }
    }).as(alias);
  }

  mockUnauthorizedError(method, endpoint, alias = 'unauthorizedError') {
    cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
      statusCode: 401,
      body: { message: 'Session expired. Please login again.' }
    }).as(alias);
  }

  mockNetworkError(method, endpoint, alias = 'networkError') {
    cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
      forceNetworkError: true
    }).as(alias);
  }

  mockDelayedResponse(method, endpoint, responseData, delay = 1000, alias = 'delayedResponse') {
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

export default new AdminApiHelpers();