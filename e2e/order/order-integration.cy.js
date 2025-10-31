import OrderDashboardPage from '../../support/pageObjects/OrderDashboardPage';
import AddOrderPage from '../../support/pageObjects/AddOrderPage';
import EditOrderPage from '../../support/pageObjects/EditOrderPage';
import OrderApiHelpers from '../../support/helpers/orderApiHelpers';
import OrderDataGenerators from '../../support/helpers/orderDataGenerators';

describe('Order Management Integration', () => {
    const dashboardPage = new OrderDashboardPage();
    const addPage = new AddOrderPage();

    it('should navigate through order management workflow', () => {
        // Start with empty dashboard
        OrderApiHelpers.mockGetOrders([]);
        dashboardPage.visit();
        dashboardPage.verifyNoDataMessage();

        // Navigate to add order page
        dashboardPage.clickAddNewOrder();
        cy.url().should('include', '/addOrder');
        addPage.verifyPageLoaded();

        // Fill form with test data (but don't submit to avoid complex integration)
        const testOrder = OrderDataGenerators.getValidOrderData();
        addPage.fillForm(testOrder);

        // Navigate back to dashboard
        cy.go('back');
        cy.url().should('include', '/orderDashboard');
    });

    it('should display mock orders in dashboard', () => {
        // Mock orders directly
        const mockOrders = OrderDataGenerators.generateMultipleOrders(2);
        OrderApiHelpers.mockGetOrders(mockOrders);
        dashboardPage.visit();
        cy.wait('@getOrders');
        
        // Verify mock orders are displayed
        dashboardPage.verifyOrderExists('Customer 1');
        dashboardPage.verifyOrderExists('Customer 2');
    });
});