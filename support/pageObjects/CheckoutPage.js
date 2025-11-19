class CheckoutPage {
    visit() {
        cy.visit('/checkoutPage');
        return this;
    }

    verifyPageLoaded() {
        cy.get('body').should('be.visible');
        cy.contains('h1', 'Checkout Page').should('be.visible');
        cy.wait(1000);
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
        cy.get('input[placeholder="Enter your full name (first and last name)"]').should('exist');
        cy.get('input[placeholder="Enter your email"]').should('exist');
        cy.get('input[placeholder="Enter your phone number"]').should('exist');
        cy.get('input[placeholder="Enter your address line1"]').should('exist');
        cy.get('input[placeholder="Enter your address line2"]').should('exist');
        cy.get('input[placeholder="Enter your city"]').should('exist');
        cy.get('input[placeholder="Enter your province"]').should('exist');
        return this;
    }

    verifySubmitButton() {
        cy.get('button[type="submit"]')
            .should('contain', 'Continue to Payment');
        return this;
    }

    verifySubmitButtonEnabled() {
        cy.get('button[type="submit"]')
            .should('not.be.disabled')
            .and('not.have.class', 'bg-gray-400');
        return this;
    }

    verifySubmitButtonDisabled() {
        cy.get('button[type="submit"]')
            .should('be.disabled')
            .and('have.class', 'bg-gray-400');
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
        if (name) {
            cy.get('input[placeholder="Enter your full name (first and last name)"]')
                .clear()
                .type(name);
        }
        if (email) {
            cy.get('input[placeholder="Enter your email"]')
                .clear()
                .type(email);
        }
        if (phone) {
            cy.get('input[placeholder="Enter your phone number"]')
                .clear()
                .type(phone);
        }
        return this;
    }

    fillBillingAddress(addressLine1, addressLine2, city, province) {
        if (addressLine1) {
            cy.get('input[placeholder="Enter your address line1"]')
                .clear()
                .type(addressLine1);
        }
        
        if (addressLine2) {
            cy.get('input[placeholder="Enter your address line2"]')
                .clear()
                .type(addressLine2);
        }
        
        if (city) {
            cy.get('input[placeholder="Enter your city"]')
                .clear()
                .type(city);
        }
        
        if (province) {
            cy.get('input[placeholder="Enter your province"]')
                .clear()
                .type(province);
        }
        return this;
    }

    fillShippingAddress(addressLine1, addressLine2, city, province) {
        // First uncheck the same address checkbox
        this.toggleSameAddressCheckbox();
        
        if (addressLine1) {
            cy.get('input[placeholder="Enter your address line1"]')
                .eq(1) // Second address line1 input (shipping)
                .clear()
                .type(addressLine1);
        }
        
        if (addressLine2) {
            cy.get('input[placeholder="Enter your address line2"]')
                .eq(1) // Second address line2 input (shipping)
                .clear()
                .type(addressLine2);
        }
        
        if (city) {
            cy.get('input[placeholder="Enter your city"]')
                .eq(1) // Second city input (shipping)
                .clear()
                .type(city);
        }
        
        if (province) {
            cy.get('input[placeholder="Enter your province"]')
                .eq(1) // Second province input (shipping)
                .clear()
                .type(province);
        }
        return this;
    }

    fillForm(formData) {
        return this
            .fillPersonalInfo(formData.name, formData.email, formData.phone)
            .fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province);
    }

    submitForm() {
        cy.get('button[type="submit"]').click({ force: true });
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

    verifyValidationError(field, expectedError) {
        cy.contains('.text-red-500', expectedError).should('be.visible');
        return this;
    }

    verifyValidationSuccess(field) {
        cy.contains('.text-green-500', 'looks good!').should('be.visible');
        return this;
    }

    verifyNoValidationErrors() {
        cy.get('.text-red-500').should('not.exist');
        return this;
    }

    // Debug method
    debugFormState() {
        cy.log('=== FORM DEBUG INFO ===');
        cy.get('input').each(($input, index) => {
            const placeholder = $input.attr('placeholder');
            const value = $input.val();
            const disabled = $input.is(':disabled');
            cy.log(`Input ${index}: placeholder="${placeholder}", value="${value}", disabled=${disabled}`);
        });
        
        cy.get('button[type="submit"]').then(($btn) => {
            cy.log(`Submit button: disabled=${$btn.is(':disabled')}, text="${$btn.text()}"`);
        });
        return this;
    }

    // Wait for form to be ready
    waitForFormReady() {
        cy.get('form').should('exist');
        cy.get('input[placeholder="Enter your full name (first and last name)"]').should('be.visible');
        return this;
    }
}

export default CheckoutPage;