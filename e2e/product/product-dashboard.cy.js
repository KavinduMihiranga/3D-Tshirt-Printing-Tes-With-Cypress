import ProductDashboardPage from '../../support/pageObjects/ProductDashboardPage';
import ProductApiHelpers from '../../support/helpers/productApiHelpers';
import ProductDataGenerators from '../../support/helpers/productDataGenerators';

describe('Product Dashboard', () => {
    const dashboardPage = new ProductDashboardPage();
    let testProducts;

    beforeEach(() => {
        testProducts = ProductDataGenerators.generateMultipleProducts(3);
    });

    it('should display dashboard with products', () => {
        ProductApiHelpers.mockGetProducts(testProducts);
        
        dashboardPage
            .visit()
            .verifyPageLoaded()
            .verifyProductExists('Product 1')
            .verifyProductExists('Product 2')
            .verifyProductExists('Product 3');

        cy.contains('Product Management').should('be.visible');
        cy.contains('Add New Product').should('be.visible');
    });

    it('should navigate to add product page', () => {
        ProductApiHelpers.mockGetProducts([]);
        
        dashboardPage
            .visit()
            .clickAddNewProduct();

        cy.url().should('include', '/addProduct');
    });

    it('should navigate to edit product page', () => {
        ProductApiHelpers.mockGetProducts(testProducts);
        
        dashboardPage
            .visit()
            .clickEditProduct('Product 1');

        cy.url().should('include', '/addProduct/1');
    });

    // it('should navigate to product detail page', () => {
    //     ProductApiHelpers.mockGetProducts(testProducts);
    //     ProductApiHelpers.mockGetProduct('1', testProducts[0]);
        
    //     dashboardPage
    //         .visit()
    //         .clickViewProduct('Product 1');

    //     cy.url().should('include', '/product/1');
    // });

    it('should show no data message', () => {
        ProductApiHelpers.mockGetProducts([]);
        
        dashboardPage
            .visit()
            .verifyNoDataMessage();
    });

    it('should search products', () => {
        ProductApiHelpers.mockGetProducts(testProducts);
        
        dashboardPage
            .visit()
            .searchProducts('Product 1')
            .verifyProductExists('Product 1')
            .verifyProductNotExists('Product 2')
            .clearSearch()
            .verifyProductExists('Product 2');
    });
});