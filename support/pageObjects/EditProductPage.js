// cypress/support/pageObjects/EditProductPage.js

import BasePage from './BasePage';

class EditProductPage extends BasePage {
    constructor(productId) {
        super();
        this.url = `/addProduct/${productId}`;
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.get('form').should('be.visible');
        cy.contains(isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT').should('be.visible');
        return this;
    }

    verifyName(value) {
        cy.get('input[name="name"]').should('have.value', value);
        return this;
    }

    verifyCategory(value) {
        cy.get('input[name="category"]').should('have.value', value);
        return this;
    }

    verifyDescription(value) {
        cy.get('textarea[name="description"]').should('have.value', value);
        return this;
    }

    verifyPrice(value) {
        cy.get('input[name="price"]').should('have.value', value.toString());
        return this;
    }

    verifyQuantity(value) {
        cy.get('input[name="qty"]').should('have.value', value.toString());
        return this;
    }

    verifyStatus(value) {
        cy.get('select[name="status"]').should('have.value', value);
        return this;
    }

    verifySize(value) {
        cy.get('select[name="size"]').should('have.value', value);
        return this;
    }

    updateName(name) {
        cy.get('input[name="name"]').clear().type(name);
        return this;
    }

    updateCategory(category) {
        cy.get('input[name="category"]').clear().type(category);
        return this;
    }

    updateDescription(description) {
        cy.get('textarea[name="description"]').clear().type(description);
        return this;
    }

    updatePrice(price) {
        cy.get('input[name="price"]').clear().type(price.toString());
        return this;
    }

    updateQuantity(quantity) {
        cy.get('input[name="qty"]').clear().type(quantity.toString());
        return this;
    }

    updateStatus(status) {
        cy.get('select[name="status"]').select(status);
        return this;
    }

    updateSize(size) {
        cy.get('select[name="size"]').select(size);
        return this;
    }

    uploadImage(filePath) {
        cy.get('input[type="file"]').selectFile(filePath);
        return this;
    }

    submit() {
        cy.contains('button', 'Update').click();
        return this;
    }

    cancel() {
        cy.contains('button', 'Cancel').click();
        return this;
    }

    closeForm() {
        cy.get('button').contains('×').click();
        return this;
    }

    updateForm(productData) {
        if (productData.name) this.updateName(productData.name);
        if (productData.category) this.updateCategory(productData.category);
        if (productData.description) this.updateDescription(productData.description);
        if (productData.price) this.updatePrice(productData.price);
        if (productData.qty) this.updateQuantity(productData.qty);
        if (productData.status) this.updateStatus(productData.status);
        if (productData.size) this.updateSize(productData.size);
        return this;
    }

    // Debug methods
    debugFormValues() {
        cy.log('=== DEBUG: Current Form Values ===');
        cy.get('input[name="name"]').then($input => cy.log(`Name: ${$input.val()}`));
        cy.get('input[name="category"]').then($input => cy.log(`Category: ${$input.val()}`));
        cy.get('textarea[name="description"]').then($textarea => cy.log(`Description: ${$textarea.val()}`));
        cy.get('input[name="price"]').then($input => cy.log(`Price: ${$input.val()}`));
        cy.get('input[name="qty"]').then($input => cy.log(`Quantity: ${$input.val()}`));
        cy.get('select[name="status"]').then($select => cy.log(`Status: ${$select.val()}`));
        cy.get('select[name="size"]').then($select => cy.log(`Size: ${$select.val()}`));
        return this;
    }

    // Validation methods
    verifyValidationError(message) {
        cy.contains(message).should('be.visible');
        return this;
    }

    verifyRequiredFieldError(fieldName) {
        cy.get(`[name="${fieldName}"]`).then(($field) => {
            $field[0].checkValidity();
            expect($field[0].validationMessage).to.not.be.empty;
        });
        return this;
    }
}

export default EditProductPage;