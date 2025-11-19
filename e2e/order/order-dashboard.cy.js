import OrderDashboardPage from '../../support/pageObjects/OrderDashboardPage';
import OrderApiHelpers from '../../support/helpers/orderApiHelpers';
import OrderDataGenerators from '../../support/helpers/orderDataGenerators';

describe('Order Dashboard', () => {
    const dashboardPage = new OrderDashboardPage();
    let testOrders;

    beforeEach(() => {
        testOrders = OrderDataGenerators.generateMultipleOrders(3);
    });

    it('should display dashboard with all elements', () => {
        OrderApiHelpers.mockGetOrders(testOrders);
        
        dashboardPage
            .visit()
            .verifyPageLoaded()
            .verifyTableHeaders();

        cy.contains('Order Management').should('be.visible');
        cy.contains('Add New Order').should('be.visible');
        cy.contains('Export Excel').should('be.visible');
        cy.get('input[placeholder*="Search"]').should('be.visible');
    });

    it('should load order data table with mock data', () => {
        OrderApiHelpers.mockGetOrders(testOrders);
        
        dashboardPage.visit();
        cy.wait('@getOrders');
        
        dashboardPage.getTableRows().should('have.length', 3);
        dashboardPage.verifyOrderExists('Customer 1');
        dashboardPage.verifyOrderExists('Customer 2');
    });

    it('should navigate to add order page', () => {
        OrderApiHelpers.mockGetOrders([]);
        dashboardPage.visit();
        
        dashboardPage.clickAddNewOrder();
        cy.url().should('include', '/addOrder');
    });

    it('should navigate to edit order page', () => {
        OrderApiHelpers.mockGetOrders(testOrders);
        dashboardPage.visit();
        
        dashboardPage.clickEditOrder('Customer 1');
        cy.url().should('include', '/addOrder/1');
    });

    it('should show loading state', () => {
        OrderApiHelpers.mockDelayedResponse('GET', 'order', { data: [] }, 2000, 'delayedOrders');
        
        dashboardPage.visit();
        dashboardPage.verifyLoadingState();
        
        cy.wait('@delayedOrders');
        dashboardPage.verifyLoadingStateHidden();
    });

    it('should show no data message when no orders exist', () => {
        OrderApiHelpers.mockGetOrders([]);
        dashboardPage.visit();
        
        dashboardPage.verifyNoDataMessage();
    });

    it('should change rows per page', () => {
        OrderApiHelpers.mockGetOrders([]);
        dashboardPage.visit();
        
        dashboardPage.changeRowsPerPage(20);
        cy.get('select').first().should('have.value', '20');
    });

    it('should handle empty orders state', () => {
        OrderApiHelpers.mockGetOrders([]);
        dashboardPage.visit();
        
        dashboardPage.verifyNoDataMessage();
    });

    it('should navigate back with back arrow', () => {
        OrderApiHelpers.mockGetOrders([]);
        dashboardPage.visit();
        
        dashboardPage.clickBackButton();
        cy.url().should('not.include', '/orderDashboard');
    });
});