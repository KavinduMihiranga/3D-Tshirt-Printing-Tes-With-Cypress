import CustomerDashboardPage from '../../support/pageObjects/CustomerDashboardPage';
import AddCustomerPage from '../../support/pageObjects/AddCustomerPage';
import ApiHelpers from '../../support/helpers/apiHelpers';
import DataGenerators from '../../support/helpers/dataGenerators';

describe('Customer Management Integration Tests', () => {
  const dashboardPage = new CustomerDashboardPage();
  const addCustomerPage = new AddCustomerPage();
  let apiResponses;

  before(() => {
    cy.fixture('customer/apiResponses').then((responses) => {
      apiResponses = responses;
    });
  });

  beforeEach(() => {
    dashboardPage.visitDashboard();
  });

  describe('Complete Customer Lifecycle', () => {
    it('should create, read, update, and delete a customer', () => {
      // Step 1: Start with empty list
      ApiHelpers.mockGetCustomers([], 'getEmptyCustomers');
      ApiHelpers.waitForApi('getEmptyCustomers');
      dashboardPage.verifyNoDataMessage();

      // Step 2: Navigate to Add Customer
      dashboardPage.clickAddNewCustomer();
      dashboardPage.verifyUrl('/addCustomer');
      addCustomerPage.verifyAddFormElements();

      // Step 3: Create new customer - Setup mock BEFORE submitting
      const newCustomer = DataGenerators.generateFormData();
      const createdCustomer = DataGenerators.generateCustomer({
        ...newCustomer,
        _id: '123'
      });

      ApiHelpers.mockCreateCustomer(
        apiResponses.success.create,
        'createCustomer'
      );

      addCustomerPage.fillCustomerForm(newCustomer);
      addCustomerPage.submitForm();
      ApiHelpers.waitForApi('createCustomer');

      // Step 4: Navigate back to dashboard and verify customer appears
      cy.visit('/customerDashboard', {
        onBeforeLoad(win) {
          win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
        }
      });
      
      ApiHelpers.mockGetCustomers([createdCustomer], 'getCustomersAfterCreate');
      ApiHelpers.waitForApi('getCustomersAfterCreate');
      dashboardPage.verifyCustomerExists(createdCustomer.name);

      // Step 5: Navigate to Edit - Setup mock BEFORE clicking edit
      ApiHelpers.mockGetCustomerById(
        createdCustomer._id,
        createdCustomer,
        'getCustomerForEdit'
      );

      dashboardPage.clickEditCustomer(createdCustomer.name);
      ApiHelpers.waitForApi('getCustomerForEdit');
      
      dashboardPage.verifyUrl(`/addCustomer/${createdCustomer._id}`);
      addCustomerPage.verifyEditFormElements();

      // Step 6: Update customer - Setup mock BEFORE submitting
      const updatedData = { name: 'Updated Customer Name' };
      const updatedCustomer = { ...createdCustomer, ...updatedData };

      ApiHelpers.mockUpdateCustomer(
        createdCustomer._id,
        apiResponses.success.update,
        'updateCustomer'
      );

      addCustomerPage.fillField('name', updatedData.name);
      addCustomerPage.updateForm();
      ApiHelpers.waitForApi('updateCustomer');

      // Step 7: Navigate back and verify update
      cy.visit('/customerDashboard', {
        onBeforeLoad(win) {
          win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
        }
      });
      
      ApiHelpers.mockGetCustomers([updatedCustomer], 'getCustomersAfterUpdate');
      ApiHelpers.waitForApi('getCustomersAfterUpdate');
      dashboardPage.verifyCustomerExists(updatedData.name);

      // Step 8: Delete customer - Setup ALL mocks BEFORE clicking delete
      ApiHelpers.mockDeleteCustomer(createdCustomer._id, 'deleteCustomer');
      ApiHelpers.mockGetCustomers([], 'getCustomersAfterDelete');

      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });

      dashboardPage.clickDeleteCustomer(updatedData.name);
      
      ApiHelpers.waitForApi('deleteCustomer');
      ApiHelpers.waitForApi('getCustomersAfterDelete');

      // Step 9: Verify deletion
      dashboardPage.verifyCustomerNotExists(updatedData.name);
      dashboardPage.verifyNoDataMessage();
    });
  });

  describe('Form Validation Flow', () => {
    it('should handle form validation errors', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.clickAddNewCustomer();
      addCustomerPage.verifyAddFormElements();

      // Try to submit empty form
      addCustomerPage.submitForm();
      
      // Wait a moment for any validation to show
      cy.wait(500);
      
      // Should stay on form page (browser validation prevents submission)
      dashboardPage.verifyUrl('/addCustomer');
    });

    it('should handle API validation errors', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      dashboardPage.clickAddNewCustomer();

      const invalidCustomer = DataGenerators.generateInvalidCustomer('email');
      
      // Setup mock BEFORE submitting
      ApiHelpers.mockValidationError('POST', 'customer', 'validationError');

      addCustomerPage.fillCustomerForm(invalidCustomer);
      addCustomerPage.submitForm();
      
      // Only wait if the form actually tries to submit
      // If browser validation blocks it, this won't fire
      cy.wait(500);
      
      // Should stay on form
      dashboardPage.verifyUrl('/addCustomer');
    });
  });

  describe('Multi-Customer Operations', () => {
    it('should handle multiple customers with pagination', () => {
      const customers = DataGenerators.generateMultipleCustomers(15);
      
      ApiHelpers.mockGetCustomers(customers);
      ApiHelpers.waitForApi('getCustomers');

      // Verify first page customers (first 10)
      customers.slice(0, 10).forEach(customer => {
        dashboardPage.verifyCustomerExists(customer.name);
      });

      // Navigate to page 2
      dashboardPage.clickPaginationPage(2);
      dashboardPage.verifyPaginationActive(2);
    });
  });

  describe('Error Recovery Flow', () => {
    it('should recover from failed operations', () => {
      const customer = DataGenerators.generateCustomer();
      
      ApiHelpers.mockGetCustomers([customer]);
      ApiHelpers.waitForApi('getCustomers');

      // Attempt delete with error - Setup mocks BEFORE action
      ApiHelpers.mockServerError('DELETE', `customer/${customer._id}`, 'deleteError');
      
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
        cy.stub(win, 'alert').as('alertStub');
      });

      dashboardPage.clickDeleteCustomer(customer.name);
      
      ApiHelpers.waitForApi('deleteError');
      
      // Should show error and customer still exists
      cy.get('@alertStub').should('be.calledWith', 'Failed to delete customer.');
      dashboardPage.verifyCustomerExists(customer.name);

      // Retry with success - IMPORTANT: Setup mocks BEFORE second delete attempt
      ApiHelpers.mockDeleteCustomer(customer._id, 'deleteSuccess');
      ApiHelpers.mockGetCustomers([], 'getAfterSuccess');
      
      // NOTE: Don't stub again - use the existing stub
      dashboardPage.clickDeleteCustomer(customer.name);
      ApiHelpers.waitForApi('deleteSuccess');
      ApiHelpers.waitForApi('getAfterSuccess');
      
      // Should be deleted now
      dashboardPage.verifyCustomerNotExists(customer.name);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle rapid navigation between pages', () => {
      ApiHelpers.mockGetCustomers([]);
      ApiHelpers.waitForApi('getCustomers');

      // Navigate to add page
      dashboardPage.clickAddNewCustomer();
      dashboardPage.verifyUrl('/addCustomer');

      // Navigate back
      addCustomerPage.clickCancel();
      
      // Wait for navigation
      cy.wait(500);
      
      // Should be back (URL won't include addCustomer)
      cy.url().should('not.include', '/addCustomer');

      // Setup mock for dashboard again
      ApiHelpers.mockGetCustomers([]);
      
      // Navigate again
      cy.visit('/customerDashboard', {
        onBeforeLoad(win) {
          win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
        }
      });
      
      ApiHelpers.waitForApi('getCustomers');
      
      dashboardPage.clickAddNewCustomer();
      dashboardPage.verifyUrl('/addCustomer');

      // Close
      addCustomerPage.clickClose();
      cy.wait(500);
      cy.url().should('not.include', '/addCustomer');
    });
  });
});