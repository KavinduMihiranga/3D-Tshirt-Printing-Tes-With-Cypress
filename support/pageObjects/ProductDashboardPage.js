import BasePage from './BasePage';

class ProductDashboardPage extends BasePage {
    constructor() {
        super();
        this.url = '/productDashboard';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Product Management').should('be.visible');
        return this;
    }

    clickAddNewProduct() {
        cy.contains('Add New Product').click();
        return this;
    }

    clickEditProduct(productName) {
        cy.contains('tr', productName).within(() => {
            cy.contains('Edit').click();
        });
        return this;
    }

    clickDeleteProduct(productName) {
        cy.contains('tr', productName).within(() => {
            cy.contains('Delete').click();
        });
        return this;
    }

    clickViewProduct(productName) {
        cy.contains('tr', productName).within(() => {
            cy.contains('View').click();
        });
        return this;
    }

    verifyProductExists(productName) {
        cy.log(`🔍 Looking for product: "${productName}"`);
        
        // First, make sure table is loaded
        cy.get('table', { timeout: 10000 }).should('be.visible');
        
        // Then look for the product in table rows
        cy.contains('tr', productName, { timeout: 10000 })
            .should('be.visible')
            .then(($row) => {
                cy.log(`✅ Found product "${productName}" in table`);
            });
            
        return this;
    }

    verifyProductNotExists(productName) {
        cy.contains('tr', productName).should('not.exist');
        return this;
    }

    verifyNoDataMessage() {
        cy.contains('No products available').should('be.visible');
        return this;
    }

    searchProducts(searchTerm) {
        cy.get('input[placeholder*="Search"]').type(searchTerm);
        return this;
    }

    clearSearch() {
        cy.get('input[placeholder*="Search"]').clear();
        return this;
    }

    getTableRows() {
        return cy.get('table tbody tr');
    }

    // Debug method to see what's in the table
    debugTableContents() {
        cy.get('table').then(($table) => {
            if ($table.length > 0) {
                cy.log('📊 Table exists, checking rows...');
                cy.get('table tbody tr').then(($rows) => {
                    cy.log(`Found ${$rows.length} rows in table`);
                    $rows.each((index, row) => {
                        cy.log(`Row ${index + 1}: ${row.textContent}`);
                    });
                });
            } else {
                cy.log('❌ No table found on page');
            }
        });
        return this;
    }
}

export default ProductDashboardPage;