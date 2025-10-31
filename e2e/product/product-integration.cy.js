import ProductDashboardPage from '../../support/pageObjects/ProductDashboardPage';
import AddProductPage from '../../support/pageObjects/AddProductPage';
import ProductApiHelpers from '../../support/helpers/productApiHelpers';
import ProductDataGenerators from '../../support/helpers/productDataGenerators';

describe('Product Management - Simple Integration', () => {
    const dashboardPage = new ProductDashboardPage();
    const addPage = new AddProductPage();

    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.setItem('adminToken', 'test-token-123');
        });
    });

    it('should navigate through product management pages', () => {
        // Start at dashboard
        ProductApiHelpers.mockGetProducts([]);
        dashboardPage.visit();
        dashboardPage.verifyPageLoaded();
        cy.log('✅ Dashboard loaded');

        // Navigate to add product
        dashboardPage.clickAddNewProduct();
        cy.url().should('include', '/addProduct');
        addPage.verifyPageLoaded();
        cy.log('✅ Add product page loaded');

        // Fill form (but don't submit to avoid complex integration)
        const testProduct = ProductDataGenerators.getValidProductData();
        addPage.fillForm(testProduct);
        cy.log('✅ Form filled with test data');

        // Navigate back to dashboard
        cy.go('back');
        cy.url().should('include', '/productDashboard');
        cy.log('✅ Successfully navigated back to dashboard');
    });

    it('should display mock products in dashboard', () => {
        // Mock products directly
        const mockProducts = [
            {
                _id: '1',
                name: 'Mock Product 1',
                category: 'Electronics',
                price: 1000,
                qty: 10,
                status: 'in stock'
            },
            {
                _id: '2',
                name: 'Mock Product 2',
                category: 'Clothing',
                price: 2000,
                qty: 20,
                status: 'in stock'
            }
        ];
        
        ProductApiHelpers.mockGetProducts(mockProducts);
        dashboardPage.visit();
        cy.wait('@getProducts');
        
        // Verify mock products are displayed
        dashboardPage.verifyProductExists('Mock Product 1');
        dashboardPage.verifyProductExists('Mock Product 2');
        
        cy.log('✅ Mock products displayed correctly in dashboard');
    });
});