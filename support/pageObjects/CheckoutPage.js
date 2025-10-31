import BasePage from './BasePage';

class CheckoutPage extends BasePage {
    constructor() {
        super();
        this.url = '/checkoutPage';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('h1', 'Checkout Page').should('be.visible');
        return this;
    }

    verifyFormSections() {
        cy.contains('h2', 'Personal Information').should('be.visible');
        cy.contains('h2', 'Address Information').should('be.visible');
        cy.contains('h3', 'Billing Address *').should('be.visible');
        cy.contains('h3', 'Shipping Address').should('be.visible');
        return this;
    }

    verifyRequiredFields() {
        // Personal Information
        cy.get('input[placeholder="Enter your full name"]').should('exist');
        cy.get('input[placeholder="Enter your email"]').should('exist');
        cy.get('input[placeholder="Enter your phone number"]').should('exist');

        // Billing Address
        cy.get('input[placeholder="Enter street address"]').should('exist');
        cy.get('input[placeholder="Enter apartment, suite, etc. (optional)"]').should('exist');
        cy.get('input[placeholder="Enter your city"]').should('exist');
        cy.get('input[placeholder="Enter your province or state"]').should('exist');
        return this;
    }

    verifySubmitButton() {
        cy.get('button[type="submit"]')
            .should('contain', 'Continue to Payment')
            .and('be.enabled');
        return this;
    }

    // Form filling methods
    fillPersonalInfo(name, email, phone) {
        cy.get('input[placeholder="Enter your full name"]').type(name);
        cy.get('input[placeholder="Enter your email"]').type(email);
        cy.get('input[placeholder="Enter your phone number"]').type(phone);
        return this;
    }

    fillBillingAddress(addressLine1, addressLine2, city, province) {
        cy.get('input[placeholder="Enter street address"]').type(addressLine1);
        if (addressLine2) {
            cy.get('input[placeholder="Enter apartment, suite, etc. (optional)"]').type(addressLine2);
        }
        cy.get('input[placeholder="Enter your city"]').type(city);
        cy.get('input[placeholder="Enter your province or state"]').type(province);
        return this;
    }

    fillForm(formData) {
        if (formData.name) this.fillPersonalInfo(formData.name, formData.email, formData.phone);
        if (formData.addressLine1) this.fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province);
        return this;
    }

    // Address management
    toggleSameAddressCheckbox() {
        cy.get('input[type="checkbox"]').click();
        return this;
    }

    verifySameAddressChecked() {
        cy.get('input[type="checkbox"]').should('be.checked');
        return this;
    }

    verifySameAddressUnchecked() {
        cy.get('input[type="checkbox"]').should('not.be.checked');
        return this;
    }

    // Submission
    submitForm() {
        cy.get('button[type="submit"]').click();
        return this;
    }

    verifyNavigationToPayment() {
        cy.url().should('include', '/payment');
        return this;
    }

    // Design order specific
    verifyDesignOrderFlow() {
        cy.contains('🎨 You have a custom T-shirt design ready!').should('be.visible');
        cy.contains('h1', 'Complete Your Design Order').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Place Design Order');
        return this;
    }

    // LocalStorage management
    setPendingDesign(designData) {
        cy.window().then((win) => {
            win.localStorage.setItem('pendingDesign', JSON.stringify(designData));
        });
        return this;
    }

    setCartItems(cartItems) {
        cy.window().then((win) => {
            win.localStorage.setItem('cart', JSON.stringify(cartItems));
        });
        return this;
    }

    clearPendingDesign() {
        cy.window().then((win) => {
            win.localStorage.removeItem('pendingDesign');
        });
        return this;
    }

    clearCart() {
        cy.window().then((win) => {
            win.localStorage.removeItem('cart');
        });
        return this;
    }

    // Mock helpers
    mockAlert() {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });
        return this;
    }

    mockNavigation() {
        cy.window().then((win) => {
            cy.stub(win, 'navigate').as('navigateStub');
        });
        return this;
    }
}

export default CheckoutPage;