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
        cy.get('input[name="price"]').clear().type(price);
        return this;
    }

    updateQuantity(quantity) {
        cy.get('input[name="qty"]').clear().type(quantity);
        return this;
    }

    updateStatus(status) {
        cy.get('input[name="status"]').clear().type(status);
        return this;
    }

    submit() {
        cy.contains('button', 'Update').click();
        return this;
    }

    updateForm(productData) {
        if (productData.name) this.updateName(productData.name);
        if (productData.category) this.updateCategory(productData.category);
        if (productData.description) this.updateDescription(productData.description);
        if (productData.price) this.updatePrice(productData.price);
        if (productData.qty) this.updateQuantity(productData.qty);
        if (productData.status) this.updateStatus(productData.status);
        return this;
    }
}

export default EditProductPage;