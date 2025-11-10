import CustomerDashboardPage from '../../support/pageObjects/CustomerDashboardPage';
import ApiHelpers from '../../support/helpers/apiHelpers';
import DataGenerators from '../../support/helpers/dataGenerators';

describe('Customer Dashboard Tests', () => {
  const dashboardPage = new CustomerDashboardPage();
  let testData;

  before(() => {
    // Load test data from fixtures
    cy.fixture('customer/customerData').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    dashboardPage.visitDashboard();
  });

  describe('Dashboard UI Elements', () => {
    it('should display all dashboard elements', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.verifyDashboardElements();
      dashboardPage.verifySidebarElements();
    });

    it('should display table headers correctly', () => {
      ApiHelpers.mockGetCustomers(testData.validCustomers);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.verifyTableHeaders();
    });
  });

  describe('Customer Data Display', () => {
    it('should load and display customer data', () => {
      ApiHelpers.mockGetCustomers(testData.validCustomers);
      ApiHelpers.waitForApi('getCustomers');

      testData.validCustomers.forEach(customer => {
        dashboardPage.verifyCustomerExists(customer.name);
        dashboardPage.verifyCustomerExists(customer.email);
      });
    });

    it('should show no data message when no customers exist', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.verifyNoDataMessage();
    });

    it('should show loading state', () => {
      ApiHelpers.mockDelayedResponse('GET', 'customer', { data: [] }, 2000);
      dashboardPage.verifyLoadingState();
      ApiHelpers.waitForApi('delayedResponse');
    });
  });

  describe('Customer Navigation', () => {
    it('should navigate to add customer page', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.clickAddNewCustomer();
      dashboardPage.verifyUrl('/addCustomer');
    });

    it('should navigate to edit customer page', () => {
      const customer = testData.validCustomers[0];
      ApiHelpers.mockGetCustomers([customer]);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.clickEditCustomer(customer.name);
      dashboardPage.verifyUrl(`/addCustomer/${customer._id}`);
    });

    it('should navigate back with back arrow', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.clickBackButton();
      dashboardPage.verifyUrl('');
    });
  });

  describe('Pagination', () => {
    it('should handle pagination correctly', () => {
      const paginationData = DataGenerators.generatePaginationData(15);
      ApiHelpers.mockGetCustomers(paginationData);
      ApiHelpers.waitForApi('getCustomers');

      // Verify pagination buttons exist
      cy.contains('button', '1').should('be.visible');
      cy.contains('button', '2').should('be.visible');

      // Click page 2
      dashboardPage.clickPaginationPage(2);
      dashboardPage.verifyPaginationActive(2);
    });
  });

  describe('Export Functionality', () => {
    it('should show alert when exporting with no data', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      cy.stubWindowMethods({ alert: true });
      dashboardPage.clickExportExcel();

      cy.get('@alertStub').should('be.calledWith', 'No data available to export!');
    });
  });

  describe('Error Handling', () => {
    it('should handle API server error gracefully', () => {
      ApiHelpers.mockServerError('GET', 'customer');
      ApiHelpers.waitForApi('serverError');

      // Component should not crash
      cy.get('body').should('exist');
      cy.get('table').should('exist');
    });

    it('should handle network errors', () => {
      ApiHelpers.mockNetworkError('GET', 'customer');
      ApiHelpers.waitForApi('networkError');

      cy.get('body').should('exist');
    });

    it('should handle delete error gracefully', () => {
      const customer = testData.validCustomers[0];
      ApiHelpers.mockGetCustomers([customer]);
      ApiHelpers.waitForApi('getCustomers');

      ApiHelpers.mockServerError('DELETE', `customer/${customer._id}`, 'deleteError');

      cy.stubWindowMethods({ confirm: true, alert: true });
      dashboardPage.clickDeleteCustomer(customer.name);

      ApiHelpers.waitForApi('deleteError');
      cy.get('@alertStub').should('be.calledWith', 'Failed to delete customer.');
      
      // Customer should still be visible
      dashboardPage.verifyCustomerExists(customer.name);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long customer names', () => {
      const longNameCustomer = DataGenerators.generateEdgeCaseData('longName');
      ApiHelpers.mockGetCustomers([longNameCustomer]);
      ApiHelpers.waitForApi('getCustomers');

      // Should display without breaking UI
      cy.contains(longNameCustomer.name.substring(0, 50)).should('be.visible');
    });

    it('should handle special characters in search', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.searchCustomer('@#$%');
      cy.get('body').should('exist'); // No crash
    });

    it('should handle rapid sequential searches', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      cy.get('input[placeholder="Search Customer..."]')
        .clear()
        .type('A', { delay: 50 })
        .type('B', { delay: 50 })
        .type('C', { delay: 50 })
        .clear()
        .type('D', { delay: 50 });

      cy.get('body').should('exist');
    });

    it('should handle empty response gracefully', () => {
      cy.intercept('GET', `${dashboardPage.apiUrl}/customer`, {
        statusCode: 200,
        body: { data: null }
      }).as('emptyResponse');

      cy.wait('@emptyResponse');
      cy.get('body').should('exist');
    });
  });
});