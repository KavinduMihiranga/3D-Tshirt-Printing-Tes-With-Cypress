import BasePage from './BasePage';

class CustomerDashboardPage extends BasePage {
  constructor() {
    super();
    this.path = '/customerDashboard';
    
    // Selectors
    this.selectors = {
      pageTitle: 'Customer Management',
      addButton: 'Add New Customer',
      exportButton: 'Export Excel',
      searchInput: 'input[placeholder="Search Customer..."]',
      loadingText: 'Loading...',
      noDataText: 'No Customers found.',
      noSearchResultsText: 'No customers match your search.', 
      tableHeaders: {
        name: 'Name',
        email: 'Email',
        contact: 'Contact Number',
        address: 'Address',
        status: 'Status',
        actions: 'Actions'
      },
      editButton: 'Edit',
      deleteButton: 'Delete',
      backButton: 'svg:first',
      pagination: {
        page1: 'button:contains("1")',
        page2: 'button:contains("2")'
      }
    };
  }

  visitDashboard() {
    this.visit(this.path);
  }

  verifyDashboardElements() {
    this.verifyText(this.selectors.pageTitle);
    this.verifyText(this.selectors.addButton);
    this.verifyText(this.selectors.exportButton);
    this.verifyElementVisible(this.selectors.searchInput);
  }

  verifySidebarElements() {
    this.verifyText('Admin Panel');
    this.verifyText('Admin');
    this.verifyText('Customer');
    this.verifyText('Order');
    this.verifyText('Product');
  }

  verifyTableHeaders() {
    Object.values(this.selectors.tableHeaders).forEach(header => {
      this.verifyText(header);
    });
  }

  searchCustomer(searchTerm) {
    cy.get(this.selectors.searchInput).clear().type(searchTerm, { delay: 150 });
  }

  clearSearch() {
    cy.get(this.selectors.searchInput).clear();
  }

  clickAddNewCustomer() {
    cy.contains(this.selectors.addButton).click();
  }

  clickExportExcel() {
    cy.contains(this.selectors.exportButton).click();
  }

  clickEditCustomer(customerName) {
    cy.contains('tr', customerName).within(() => {
      cy.contains(this.selectors.editButton).click();
    });
  }

  clickDeleteCustomer(customerName) {
    cy.contains('tr', customerName).within(() => {
      cy.contains(this.selectors.deleteButton).click();
    });
  }

  verifyCustomerExists(customerName) {
    cy.contains(customerName).should('be.visible');
  }

  verifyCustomerNotExists(customerName) {
    cy.contains(customerName).should('not.exist');
  }

  verifyNoDataMessage() {
      cy.contains(/(No customers found|No customers match your search)\.?/)
      .should('be.visible');
  }

    // ADDED: Specific method for empty state (no search)
  verifyEmptyState() {
    cy.contains('No customers found.').should('be.visible');
  }

  // ADDED: Specific method for no search results
  verifyNoSearchResults() {
    cy.contains('No customers match your search.').should('be.visible');
  }

  verifyLoadingState() {
    cy.contains(this.selectors.loadingText, { timeout: 1000 }).should('be.visible');
  }

  clickPaginationPage(pageNumber) {
    cy.contains('button', pageNumber.toString()).click();
  }

  verifyPaginationActive(pageNumber) {
    cy.contains('button', pageNumber.toString()).should('have.class', 'bg-green-600');
  }

  clickBackButton() {
    cy.get(this.selectors.backButton).click();
  }
}

export default CustomerDashboardPage;