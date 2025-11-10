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
}

export default new ProductApiHelpers();