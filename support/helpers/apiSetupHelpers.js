class ApiSetupHelpers {
  constructor() {
    this.baseUrl = Cypress.env('apiUrl') || '/api';
  }

  // Mock all product API endpoints
  mockApiEndpoints(products = []) {
    // Mock GET /api/product
    cy.intercept('GET', `${this.baseUrl}/product*`, {
      statusCode: 200,
      body: { data: products }
    }).as('getProducts');

    // Mock GET /api/product/:id
    if (products.length > 0) {
      products.forEach(product => {
        cy.intercept('GET', `${this.baseUrl}/product/${product._id}`, {
          statusCode: 200,
          body: { data: product }
        }).as(`getProduct-${product._id}`);
      });
    }

    // Mock POST /api/product
    cy.intercept('POST', `${this.baseUrl}/product*`, {
      statusCode: 201,
      body: { message: 'Product created successfully', data: { _id: 'new-id' } }
    }).as('createProduct');

    // Mock PUT /api/product/:id
    cy.intercept('PUT', `${this.baseUrl}/product/*`, {
      statusCode: 200,
      body: { message: 'Product updated successfully' }
    }).as('updateProduct');

    // Mock DELETE /api/product/:id
    cy.intercept('DELETE', `${this.baseUrl}/product/*`, {
      statusCode: 200,
      body: { message: 'Product deleted successfully' }
    }).as('deleteProduct');
  }

  // Mock empty state
  mockEmptyProducts() {
    cy.intercept('GET', `${this.baseUrl}/product*`, {
      statusCode: 200,
      body: { data: [] }
    }).as('getEmptyProducts');
  }

  // Mock error state
  mockServerError() {
    cy.intercept('GET', `${this.baseUrl}/product*`, {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('serverError');
  }

  // Setup authentication
  setupAuth() {
    cy.window().then((win) => {
      win.localStorage.setItem('adminToken', 'test-token-123');
    });
  }
}

export default new ApiSetupHelpers();