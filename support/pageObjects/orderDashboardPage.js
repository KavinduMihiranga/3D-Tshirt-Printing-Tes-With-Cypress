import BasePage from './BasePage';

class OrderDashboardPage extends BasePage {
    constructor() {
        super();
        this.url = '/orderDashboard';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Order Management').should('be.visible');
        return this;
    }

    clickAddNewOrder() {
        cy.contains('Add New Order').click();
        return this;
    }

    clickEditOrder(customerName) {
        cy.contains('tr', customerName).within(() => {
            cy.contains('Edit').click();
        });
        return this;
    }

    clickDeleteOrder(customerName) {
        cy.contains('tr', customerName).within(() => {
            cy.contains('Delete').click();
        });
        return this;
    }

    verifyOrderExists(customerName) {
        cy.contains('tr', customerName).should('be.visible');
        return this;
    }

    verifyOrderNotExists(customerName) {
        cy.contains('tr', customerName).should('not.exist');
        return this;
    }

    verifyNoDataMessage() {
        cy.contains('No orders found.').should('be.visible');
        return this;
    }

    searchOrders(searchTerm) {
        cy.get('input[placeholder*="Search"]').type(searchTerm);
        return this;
    }

    clearSearch() {
        cy.get('input[placeholder*="Search"]').clear();
        return this;
    }

    verifyTableHeaders() {
        const headers = ['Customer Name', 'T-shirt Name', 'Address', 'Qty', 'Date', 'Status', 'Action'];
        headers.forEach(header => {
            cy.contains('th', header).should('be.visible');
        });
        return this;
    }

    changeRowsPerPage(rows) {
        cy.get('select').first().select(rows.toString());
        return this;
    }

    clickExportExcel() {
        cy.contains('Export Excel').click();
        return this;
    }

    clickBackButton() {
        cy.get('svg').first().click();
        return this;
    }

    getTableRows() {
        return cy.get('table tbody tr');
    }

    verifyLoadingState() {
        cy.contains('Loading...').should('be.visible');
        return this;
    }

    verifyLoadingStateHidden() {
        cy.contains('Loading...').should('not.exist');
        return this;
    }
}

export default OrderDashboardPage;