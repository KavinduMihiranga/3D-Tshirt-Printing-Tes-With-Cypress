import AddProductPage from '../../support/pageObjects/AddProductPage';
import ProductApiHelpers from '../../support/helpers/productApiHelpers';
import ProductDataGenerators from '../../support/helpers/productDataGenerators';

describe('Add Product', () => {
    const addPage = new AddProductPage();
    const validData = ProductDataGenerators.getValidProductData();

    beforeEach(() => {
        addPage.visit();
    });

    it('should display add product form', () => {
        addPage.verifyPageLoaded();
        
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="category"]').should('be.visible');
        cy.get('textarea[name="description"]').should('be.visible');
        cy.get('input[name="price"]').should('be.visible');
        cy.get('input[name="qty"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('should submit product successfully', () => {
        ProductApiHelpers.mockCreateProduct();
        
        addPage
            .fillForm(validData)
            .submit();

        cy.wait('@createProduct');
        cy.url().should('include', '/productDashboard');
    });

    // it('should handle validation errors', () => {
    //     ProductApiHelpers.mockError('POST', '**/api/product**', 400);
        
    //     addPage.submit();
    //     cy.url().should('include', '/addProduct');
    // });

    // it('should handle network errors', () => {
    //     ProductApiHelpers.mockError('POST', '**/api/product**', 500);
        
    //     addPage
    //         .fillForm(validData)
    //         .submit();

    //     cy.url().should('include', '/addProduct');
    // });
});