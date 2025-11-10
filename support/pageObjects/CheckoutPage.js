class CheckoutPage {
    visit() {
        cy.visit('/checkoutPage');
        return this;
    }

    verifyPageLoaded() {
        cy.contains('h1', 'Checkout Page').should('be.visible');
        return this;
    }

    verifyFormSections() {
        cy.contains('label', 'Full Name').should('be.visible');
        cy.contains('label', 'Email Address').should('be.visible');
        cy.contains('label', 'Phone Number').should('be.visible');
        cy.contains('h2', 'Billing Address').should('be.visible');
        cy.contains('h2', 'Shipping Address').should('be.visible');
        return this;
    }

    verifyRequiredFields() {
        cy.get('input[placeholder="Enter your name"]').should('exist');
        cy.get('input[placeholder="Enter your email"]').should('exist');
        cy.get('input[placeholder="Enter your phone number"]').should('exist');
        cy.get('input[placeholder="Enter your addressLine1"]').should('exist');
        cy.get('input[placeholder="Enter your addressLine2"]').should('exist');
        cy.get('input[placeholder="Enter your city"]').should('exist');
        cy.get('input[placeholder="Enter your province"]').should('exist');
        return this;
    }

    verifySubmitButton() {
        cy.get('button[type="submit"]')
            .should('contain', 'Continue')
            .and('be.enabled');
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

    toggleSameAddressCheckbox() {
        cy.get('input[type="checkbox"]').click();
        return this;
    }

    fillPersonalInfo(name, email, phone) {
        cy.get('input[placeholder="Enter your name"]').clear().type(name);
        cy.get('input[placeholder="Enter your email"]').clear().type(email);
        cy.get('input[placeholder="Enter your phone number"]').clear().type(phone);
        return this;
    }

    fillBillingAddress(addressLine1, addressLine2, city, province) {
        cy.get('input[placeholder="Enter your addressLine1"]').clear().type(addressLine1);
        cy.get('input[placeholder="Enter your addressLine2"]').clear().type(addressLine2);
        cy.get('input[placeholder="Enter your city"]').clear().type(city);
        cy.get('input[placeholder="Enter your province"]').clear().type(province);
        return this;
    }

    fillForm(formData) {
        return this
            .fillPersonalInfo(formData.name, formData.email, formData.phone)
            .fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province);
    }

    submitForm() {
        cy.get('button[type="submit"]').click();
        return this;
    }

    mockAlert() {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });
        return this;
    }

    clearPendingDesign() {
        cy.window().then((win) => {
            win.localStorage.removeItem('pendingDesign');
        });
        return this;
    }

    setCartItems(cartItems) {
        cy.window().then((win) => {
            win.localStorage.setItem('cartItems', JSON.stringify(cartItems));
        });
        return this;
    }

    // Add to your CheckoutPage class
fillBillingAddressRequiredOnly(addressLine1, city, province) {
    cy.get('input[placeholder="Enter your addressLine1"]').clear().type(addressLine1);
    cy.get('input[placeholder="Enter your city"]').clear().type(city);
    cy.get('input[placeholder="Enter your province"]').clear().type(province);
    // Completely skip the optional addressLine2 field
    return this;
}

// Update the existing fillBillingAddress method to handle empty strings properly
fillBillingAddress(addressLine1, addressLine2, city, province) {
    cy.get('input[placeholder="Enter your addressLine1"]').clear().type(addressLine1);
    
    // Only interact with addressLine2 if it has a value
    if (addressLine2 && addressLine2.trim() !== '') {
        cy.get('input[placeholder="Enter your addressLine2"]').clear().type(addressLine2);
    }
    // If addressLine2 is empty, don't touch the field at all
    
    cy.get('input[placeholder="Enter your city"]').clear().type(city);
    cy.get('input[placeholder="Enter your province"]').clear().type(province);
    return this;
}
}

export default CheckoutPage;