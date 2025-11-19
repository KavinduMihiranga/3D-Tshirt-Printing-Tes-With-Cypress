// In AddOrderPage.js - Fixed with import
import BasePage from './BasePage';

class AddOrderPage extends BasePage {
    constructor() {
        super();
        this.url = '/addOrder';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('ADD ORDER').should('be.visible');
        return this;
    }

    fillCustomerName(name) {
        cy.get('input[name="customerName"]').clear().type(name);
        return this;
    }

    fillTShirtName(tShirtName) {
        cy.get('input[name="tShirtName"]').clear().type(tShirtName);
        return this;
    }

    fillAddress(address) {
        cy.get('input[name="address"]').clear().type(address);
        return this;
    }

    fillQuantity(qty) {
        cy.get('input[name="qty"]').clear().type(qty);
        return this;
    }

    fillDate(date) {
        cy.get('input[name="date"]').clear().type(date);
        return this;
    }

    submit() {
        cy.get('form').submit();
        return this;
    }

    clickCancel() {
        cy.contains('button', 'Cancel').click();
        return this;
    }

    clickCloseButton() {
        cy.get('button').contains('×').click();
        return this;
    }

    fillForm(orderData) {
        if (orderData.customerName) this.fillCustomerName(orderData.customerName);
        if (orderData.tShirtName) this.fillTShirtName(orderData.tShirtName);
        if (orderData.address) this.fillAddress(orderData.address);
        if (orderData.qty) this.fillQuantity(orderData.qty);
        if (orderData.date) this.fillDate(orderData.date);
        return this;
    }

    verifyFormFields() {
        cy.get('input[name="customerName"]').should('be.visible');
        cy.get('input[name="tShirtName"]').should('be.visible');
        cy.get('input[name="address"]').should('be.visible');
        cy.get('input[name="qty"]').should('be.visible');
        cy.get('input[name="date"]').should('be.visible');
        return this;
    }
}

export default AddOrderPage;