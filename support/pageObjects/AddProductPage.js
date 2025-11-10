import BasePage from './BasePage';

class AddProductPage extends BasePage {
    constructor() {
        super();
        this.url = '/addProduct';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('ADD PRODUCT').should('be.visible');
        return this;
    }

    fillName(name) {
        cy.get('input[name="name"]').clear().type(name);
        return this;
    }

    fillCategory(category) {
        cy.get('input[name="category"]').clear().type(category);
        return this;
    }

    fillDescription(description) {
        cy.get('textarea[name="description"]').clear().type(description);
        return this;
    }

    fillPrice(price) {
        cy.get('input[name="price"]').clear().type(price);
        return this;
    }

    fillQuantity(quantity) {
        cy.get('input[name="qty"]').clear().type(quantity);
        return this;
    }

    fillStatus(status) {
        cy.get('input[name="status"]').clear().type(status);
        return this;
    }

    submit() {
        cy.get('button[type="submit"]').click();
        return this;
    }

    fillForm(productData) {
        if (productData.name) this.fillName(productData.name);
        if (productData.category) this.fillCategory(productData.category);
        if (productData.description) this.fillDescription(productData.description);
        if (productData.price) this.fillPrice(productData.price);
        if (productData.qty) this.fillQuantity(productData.qty);
        if (productData.status) this.fillStatus(productData.status);
        return this;
    }
}

export default AddProductPage;