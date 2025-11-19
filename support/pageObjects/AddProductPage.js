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

    fillSize(size) {
        cy.get('select[name="size"]').select(size);
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
        cy.get('select[name="status"]').select(status);
        return this;
    }

    uploadImage(fileName = 'test-image.jpg') {
        cy.get('input[type="file"]').selectFile({
            contents: Cypress.Buffer.from('file contents'),
            fileName: fileName,
            lastModified: Date.now(),
        }, { force: true });
        return this;
    }

    submit() {
        cy.get('button[type="submit"]').click();
        return this;
    }

    clickCancel() {
        cy.contains('button', 'Cancel').click();
        return this;
    }

    fillForm(productData) {
        if (productData.name) this.fillName(productData.name);
        if (productData.category) this.fillCategory(productData.category);
        if (productData.size) this.fillSize(productData.size);
        if (productData.description) this.fillDescription(productData.description);
        if (productData.price) this.fillPrice(productData.price);
        if (productData.qty) this.fillQuantity(productData.qty);
        if (productData.status) this.fillStatus(productData.status);
        return this;
    }

    verifyFormFields() {
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="category"]').should('be.visible');
        cy.get('select[name="size"]').should('be.visible');
        cy.get('textarea[name="description"]').should('be.visible');
        cy.get('input[name="price"]').should('be.visible');
        cy.get('input[name="qty"]').should('be.visible');
        cy.get('select[name="status"]').should('be.visible');
        cy.get('input[type="file"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
        return this;
    }

    verifyImagePreview() {
        cy.get('img').should('be.visible');
        return this;
    }
}

export default AddProductPage;