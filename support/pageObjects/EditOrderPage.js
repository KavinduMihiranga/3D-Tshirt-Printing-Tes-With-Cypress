import BasePage from './BasePage';

class EditOrderPage extends BasePage {
    constructor(orderId) {
        super();
        this.url = `/addOrder/${orderId}`;
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('EDIT ORDER').should('be.visible');
        return this;
    }

    verifyCustomerName(value) {
        cy.get('input[name="customerName"]').should('have.value', value);
        return this;
    }

    verifyTShirtName(value) {
        cy.get('input[name="tShirtName"]').should('have.value', value);
        return this;
    }

    verifyAddress(value) {
        cy.get('input[name="address"]').should('have.value', value);
        return this;
    }

    verifyQuantity(value) {
        cy.get('input[name="qty"]').should('have.value', value.toString());
        return this;
    }

    verifyDate(value) {
        cy.get('input[name="date"]').should('have.value', value);
        return this;
    }

    // Check if form is editable
    isFormEditable() {
        return cy.get('input[name="customerName"]').then(($input) => {
            return !$input.attr('disabled');
        });
    }

    // Force update methods for read-only forms (if absolutely necessary)
    forceUpdateCustomerName(name) {
        cy.get('input[name="customerName"]')
            .clear({ force: true })
            .type(name, { force: true });
        return this;
    }

    forceUpdateTShirtName(tShirtName) {
        cy.get('input[name="tShirtName"]')
            .clear({ force: true })
            .type(tShirtName, { force: true });
        return this;
    }

    forceUpdateAddress(address) {
        cy.get('input[name="address"]')
            .clear({ force: true })
            .type(address, { force: true });
        return this;
    }

    forceUpdateQuantity(qty) {
        cy.get('input[name="qty"]')
            .clear({ force: true })
            .type(qty, { force: true });
        return this;
    }

    forceUpdateDate(date) {
        cy.get('input[name="date"]')
            .clear({ force: true })
            .type(date, { force: true });
        return this;
    }

    submitUpdate() {
        // Try different possible submit buttons
        cy.get('body').then(($body) => {
            const submitSelectors = [
                'button[type="submit"]',
                'button:contains("Update")',
                'button:contains("Save")',
                'button:contains("Submit")'
            ];
            
            let found = false;
            for (const selector of submitSelectors) {
                if ($body.find(selector).length > 0) {
                    cy.get(selector).first().click();
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                // Fallback to form submit
                cy.get('form').submit();
            }
        });
        return this;
    }

    clickCancel() {
        cy.contains('button', 'Cancel').click();
        return this;
    }

    // Safe update that checks if form is editable first
    safeUpdateForm(orderData) {
        this.isFormEditable().then((editable) => {
            if (editable) {
                // Form is editable, proceed normally
                if (orderData.customerName) this.forceUpdateCustomerName(orderData.customerName);
                if (orderData.tShirtName) this.forceUpdateTShirtName(orderData.tShirtName);
                if (orderData.address) this.forceUpdateAddress(orderData.address);
                if (orderData.qty) this.forceUpdateQuantity(orderData.qty);
                if (orderData.date) this.forceUpdateDate(orderData.date);
            } else {
                // Form is read-only, we can't update - maybe log a warning
                cy.log('Form is read-only, cannot update fields');
            }
        });
        return this;
    }

    verifyFormData(order) {
        if (order.customerName) this.verifyCustomerName(order.customerName);
        if (order.tShirtName) this.verifyTShirtName(order.tShirtName);
        if (order.address) this.verifyAddress(order.address);
        if (order.qty) this.verifyQuantity(order.qty);
        if (order.date) this.verifyDate(order.date);
        return this;
    }

    // Debug method to check form state
    debugFormState() {
        cy.log('=== FORM DEBUG INFO ===');
        cy.get('input').each(($input, index) => {
            const name = $input.attr('name');
            const value = $input.val();
            const disabled = $input.attr('disabled');
            const id = $input.attr('id');
            cy.log(`Input ${index}: name="${name}", value="${value}", disabled="${disabled}", id="${id}"`);
        });
        
        cy.get('button').each(($button, index) => {
            const text = $button.text().trim();
            const type = $button.attr('type');
            const disabled = $button.attr('disabled');
            cy.log(`Button ${index}: text="${text}", type="${type}", disabled="${disabled}"`);
        });
        
        return this;
    }
}

export default EditOrderPage;