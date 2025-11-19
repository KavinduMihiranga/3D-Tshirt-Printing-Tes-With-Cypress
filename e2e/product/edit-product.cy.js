// cypress/e2e/editProduct.cy.js

import EditProductPage from '../../support/pageObjects/EditProductPage';
import ProductApiHelpers from '../../support/helpers/productApiHelpers';
import ProductDataGenerators from '../../support/helpers/productDataGenerators';

describe('Edit Product', () => {
    const productId = '123';
    const existingProduct = ProductDataGenerators.generateProduct({
        _id: productId,
        name: 'Existing Product',
        category: 'Clothing',
        size: 'Medium',
        description: 'Existing description',
        price: 1999,
        qty: 50,
        status: 'in stock'
    });
    const editPage = new EditProductPage(productId);
    const updateData = ProductDataGenerators.getUpdateProductData();

    beforeEach(() => {
        // Handle WebAssembly memory errors
        Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('WebAssembly') || err.message.includes('Out of memory')) {
                return false;
            }
            return true;
        });

        ProductApiHelpers.mockGetProduct(productId, existingProduct);
        editPage.visit();
        cy.wait('@getProduct');
    });

    it('should update product successfully with all fields', () => {
        ProductApiHelpers.mockUpdateProduct(productId);
        
        editPage
            .debugFormValues()
            .updateForm(updateData)
            .debugFormValues()
            .submit();

        cy.wait('@updateProduct');
        cy.url().should('include', '/productDashboard');
    });

    it('should update product with partial fields', () => {
        ProductApiHelpers.mockUpdateProduct(productId);
        
        const partialUpdate = {
            name: 'Partially Updated Product',
            price: 2999
        };

        editPage
            .updateForm(partialUpdate)
            .submit();

        cy.wait('@updateProduct');
        cy.url().should('include', '/productDashboard');
    });

    it('should handle invalid price and quantity values', () => {
        editPage
            .updatePrice('-100') // Negative price
            .updateQuantity('-10') // Negative quantity
            .submit();

        cy.url().should('include', `/addProduct/${productId}`);
    });

    it('should handle server errors during update', () => {
        ProductApiHelpers.mockError('PUT', `**/api/product/${productId}**`, 500, {
            message: 'Internal server error'
        });
        
        editPage
            .updateForm(updateData)
            .submit();

        cy.wait('@apiError');
        cy.url().should('include', `/addProduct/${productId}`);
    });

    it('should cancel and return to previous page', () => {
        editPage.cancel();
        cy.url().should('not.include', `/addProduct/${productId}`);
    });

    it('should close form using X button', () => {
        editPage.closeForm();
        cy.url().should('not.include', `/addProduct/${productId}`);
    });


    it('should update product size selection', () => {
        ProductApiHelpers.mockUpdateProduct(productId);
        
        editPage
            .updateSize('Large')
            .submit();

        cy.wait('@updateProduct');
        cy.url().should('include', '/productDashboard');
    });

    it('should update product status selection', () => {
        ProductApiHelpers.mockUpdateProduct(productId);
        
        editPage
            .updateStatus('out of stock')
            .submit();

        cy.wait('@updateProduct');
        cy.url().should('include', '/productDashboard');
    });
});

describe('Edit Product - Error Scenarios', () => {
    const productId = '123';
    const editPage = new EditProductPage(productId);
});

describe('Edit Product - Edge Cases', () => {
    const productId = '123';
    const editPage = new EditProductPage(productId);

    it('should handle very long product names', () => {
        const longName = 'A'.repeat(255);
        ProductApiHelpers.mockGetProduct(productId, ProductDataGenerators.generateProduct());
        ProductApiHelpers.mockUpdateProduct(productId);
        
        editPage.visit();
        cy.wait('@getProduct');

        editPage
            .updateName(longName)
            .submit();

        cy.wait('@updateProduct');
        cy.url().should('include', '/productDashboard');
    });

    it('should handle maximum quantity values', () => {
        const maxQuantity = 999999;
        ProductApiHelpers.mockGetProduct(productId, ProductDataGenerators.generateProduct());
        ProductApiHelpers.mockUpdateProduct(productId);
        
        editPage.visit();
        cy.wait('@getProduct');

        editPage
            .updateQuantity(maxQuantity)
            .submit();

        cy.wait('@updateProduct');
        cy.url().should('include', '/productDashboard');
    });

    it('should handle decimal prices', () => {
        ProductApiHelpers.mockGetProduct(productId, ProductDataGenerators.generateProduct());
        ProductApiHelpers.mockUpdateProduct(productId);
        
        editPage.visit();
        cy.wait('@getProduct');

        editPage
            .updatePrice('1999.99')
            .submit();

        cy.wait('@updateProduct');
        cy.url().should('include', '/productDashboard');
    });
});