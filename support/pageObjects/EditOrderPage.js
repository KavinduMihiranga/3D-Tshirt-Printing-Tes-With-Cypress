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

    verifyStatus(value) {
        cy.get('input[name="status"]').should('have.value', value);
        return this;
    }

    updateCustomerName(name) {
        cy.get('input[name="customerName"]').clear().type(name);
        return this;
    }

    updateTShirtName(tShirtName) {
        cy.get('input[name="tShirtName"]').clear().type(tShirtName);
        return this;
    }

    updateAddress(address) {
        cy.get('input[name="address"]').clear().type(address);
        return this;
    }

    updateQuantity(qty) {
        cy.get('input[name="qty"]').clear().type(qty);
        return this;
    }

    updateDate(date) {
        cy.get('input[name="date"]').clear().type(date);
        return this;
    }

    updateStatus(status) {
        cy.get('input[name="status"]').clear().type(status);
        return this;
    }

    submitUpdate() {
        cy.contains('button', 'Update').click();
        return this;
    }

    clickCancel() {
        cy.contains('button', 'Cancel').click();
        return this;
    }

    updateForm(orderData) {
        if (orderData.customerName) this.updateCustomerName(orderData.customerName);
        if (orderData.tShirtName) this.updateTShirtName(orderData.tShirtName);
        if (orderData.address) this.updateAddress(orderData.address);
        if (orderData.qty) this.updateQuantity(orderData.qty);
        if (orderData.date) this.updateDate(orderData.date);
        if (orderData.status) this.updateStatus(orderData.status);
        return this;
    }

    verifyFormData(order) {
        if (order.customerName) this.verifyCustomerName(order.customerName);
        if (order.tShirtName) this.verifyTShirtName(order.tShirtName);
        if (order.address) this.verifyAddress(order.address);
        if (order.qty) this.verifyQuantity(order.qty);
        if (order.date) this.verifyDate(order.date);
        if (order.status) this.verifyStatus(order.status);
        return this;
    }
}

export default EditOrderPage;