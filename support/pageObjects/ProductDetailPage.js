import BasePage from './BasePage';

class ProductDetailPage extends BasePage {
    constructor(productId) {
        super();
        this.url = `/product/${productId}`;
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.get('body').should('exist');
        return this;
    }

    verifyProductName(name) {
        cy.contains(name).should('be.visible');
        return this;
    }

    verifyProductCategory(category) {
        cy.contains(category).should('be.visible');
        return this;
    }

    verifyProductPrice(price) {
        cy.contains(price.toString()).should('be.visible');
        return this;
    }

    verifyProductStock(stock) {
        cy.contains(stock.toString()).should('be.visible');
        return this;
    }

    verifyProductStatus(status) {
        cy.contains(status).should('be.visible');
        return this;
    }

    verifyProductDescription(description) {
        cy.contains(description).should('be.visible');
        return this;
    }

    verifyProductImage() {
        cy.get('img').should('be.visible');
        return this;
    }

    clickAddToCart() {
        cy.contains('button', 'Add to Cart').click();
        return this;
    }

    verifyNotFound() {
        cy.contains('Product not found').should('be.visible');
        return this;
    }
}

export default ProductDetailPage;