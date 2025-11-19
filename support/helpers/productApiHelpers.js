class ProductApiHelpers {
    mockGetProducts(products = []) {
        cy.intercept('GET', '**/api/product**', {
            statusCode: 200,
            body: { 
                data: products 
            }
        }).as('getProducts');
    }

    mockGetProduct(productId, productData) {
        cy.intercept('GET', `**/api/product/${productId}**`, {
            statusCode: 200,
            body: { 
                data: productData 
            }
        }).as('getProduct');
    }

    mockCreateProduct(response = { message: 'Product created successfully' }) {
        cy.intercept('POST', '**/api/product**', {
            statusCode: 201,
            body: response
        }).as('createProduct');
    }

    mockUpdateProduct(productId, response = { message: 'Product updated successfully' }) {
        cy.intercept('PUT', `**/api/product/${productId}**`, {
            statusCode: 200,
            body: response
        }).as('updateProduct');
    }

    mockDeleteProduct(productId) {
        cy.intercept('DELETE', `**/api/product/${productId}**`, {
            statusCode: 200,
            body: { message: 'Product deleted successfully' }
        }).as('deleteProduct');
    }

    // Generic error mock method
    mockError(method, url, statusCode = 400, response = { message: 'Error occurred' }) {
        cy.intercept(method, url, {
            statusCode: statusCode,
            body: response
        }).as('apiError');
    }

    // Specific error helpers
    mockValidationError() {
        cy.intercept('POST', '**/api/product**', {
            statusCode: 400,
            body: { message: 'Validation failed' }
        }).as('validationError');
    }

    mockServerError() {
        cy.intercept('POST', '**/api/product**', {
            statusCode: 500,
            body: { message: 'Internal server error' }
        }).as('serverError');
    }

    mockNetworkError() {
        cy.intercept('POST', '**/api/product**', {
            forceNetworkError: true
        }).as('networkError');
    }

    mockNotFoundError() {
        cy.intercept('GET', '**/api/product/**', {
            statusCode: 404,
            body: { message: 'Product not found' }
        }).as('notFoundError');
    }
}

export default new ProductApiHelpers();