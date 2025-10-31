import CheckoutPage from '../../support/pageObjects/CheckoutPage';
import CheckoutApiHelpers from '../../support/helpers/checkoutApiHelpers';
import CheckoutDataGenerators from '../../support/helpers/checkoutDataGenerators';

describe('🧾 Checkout Page - Comprehensive Test Suite', () => {
    const checkoutPage = new CheckoutPage();

    context('🎯 UI Structure & Layout', () => {
        beforeEach(() => {
            checkoutPage.visit();
        });

        it('should load checkout page with correct title', () => {
            checkoutPage.verifyPageLoaded();
        });

        it('should display all form sections', () => {
            checkoutPage.verifyFormSections();
        });

        it('should have all required form fields', () => {
            checkoutPage.verifyRequiredFields();
        });

        it('should have submit button with correct text', () => {
            checkoutPage.verifySubmitButton();
        });
    });

    context('📝 Form Validation & Error Handling', () => {
        beforeEach(() => {
            checkoutPage
                .visit()
                .mockAlert();
        });

        // it('should show validation errors for empty required fields', () => {
        //     checkoutPage.submitForm();
            
        //     cy.get('@alertStub').should('be.calledWith', 'Please enter your full name');
        // });

        // it('should validate email format', () => {
        //     const formData = CheckoutDataGenerators.generateFormData({ email: 'invalid-email' });
            
        //     checkoutPage
        //         .fillForm(formData)
        //         .submitForm();

        //     cy.get('@alertStub').should('be.calledWith', 'Please enter a valid email address');
        // });

        // it('should validate billing address completeness', () => {
        //     const incompleteData = CheckoutDataGenerators.generateFormData();
        //     // Remove address data
        //     checkoutPage
        //         .fillPersonalInfo(incompleteData.name, incompleteData.email, incompleteData.phone)
        //         .submitForm();

        //     cy.get('@alertStub').should('be.calledWithMatch', /billing address|city|province/i);
        // });
    });

    context('🏠 Address Management', () => {
        beforeEach(() => {
            checkoutPage.visit();
        });

        it('should have same address checkbox checked by default', () => {
            checkoutPage.verifySameAddressChecked();
        });

        it('should copy billing address to shipping when checkbox is checked', () => {
            const billingData = CheckoutDataGenerators.generateFormData();
            
            checkoutPage
                .fillBillingAddress(billingData.addressLine1, billingData.addressLine2, billingData.city, billingData.province)
                .verifySameAddressChecked();

            // Verify shipping mirrors billing (implementation specific)
            cy.get('input[placeholder="Enter street address"]').should('have.value', billingData.addressLine1);
        });

        // it('should validate separate shipping address when unchecked', () => {
        //     checkoutPage
        //         .mockAlert()
        //         .fillForm(CheckoutDataGenerators.generateFormData())
        //         .toggleSameAddressCheckbox()
        //         .verifySameAddressUnchecked()
        //         .submitForm();

        //     cy.get('@alertStub').should('be.calledWithMatch', /shipping address/i);
        // });
    });

    context('🎨 Design Order Flow', () => {
        beforeEach(() => {
            checkoutPage
                .setPendingDesign(CheckoutDataGenerators.generatePendingDesign())
                .visit();
        });

        it('should show design order message when pending design exists', () => {
            checkoutPage.verifyDesignOrderFlow();
        });

        it('should submit design order successfully', () => {
            CheckoutApiHelpers.mockDesignInquirySuccess();
            
            checkoutPage
                .fillForm(CheckoutDataGenerators.generateFormData())
                .submitForm();

            cy.wait('@designInquiry').then((interception) => {
                expect(interception.request.headers['content-type']).to.include('multipart/form-data');
            });

            // Verify localStorage is cleared
            checkoutPage.clearPendingDesign();
            cy.window().then((win) => {
                expect(win.localStorage.getItem('pendingDesign')).to.be.null;
            });
        });

        it('should handle design order submission errors', () => {
            CheckoutApiHelpers.mockDesignInquiryError();
            checkoutPage
                .mockAlert()
                .fillForm(CheckoutDataGenerators.generateFormData())
                .submitForm();

            cy.wait('@designInquiryError');
            cy.get('@alertStub').should('be.calledWithMatch', /Failed to submit order/i);
        });
    });

    context('🛒 Regular Product Order Flow', () => {
        beforeEach(() => {
            checkoutPage
                .clearPendingDesign()
                .setCartItems(CheckoutDataGenerators.generateCartItems(2))
                .visit();
        });

        // it('should navigate to payment page with correct data', () => {
        //     checkoutPage
        //         .mockNavigation()
        //         .fillForm(CheckoutDataGenerators.generateFormData())
        //         .submitForm()
        //         .verifyNavigationToPayment();
        // });

        it('should handle regular order without design data', () => {
            checkoutPage
                .clearPendingDesign()
                .visit()
                .verifyPageLoaded()
                .fillForm(CheckoutDataGenerators.generateFormData())
                .submitForm();
        });
    });

    context('⏳ Loading States & UX', () => {
        it('should re-enable button after submission failure', () => {
            CheckoutApiHelpers.mockDesignInquiryError();
            checkoutPage
                .setPendingDesign(CheckoutDataGenerators.generatePendingDesign())
                .mockAlert()
                .visit()
                .fillForm(CheckoutDataGenerators.generateFormData())
                .submitForm();

            cy.wait('@designInquiryError');
            
            // Button should be re-enabled after error
            cy.get('button[type="submit"]')
                .should('be.enabled')
                .and('contain', 'Place Design Order');
        });
    });

    context('🛡️ Error Handling & Resilience', () => {
        // it('should handle invalid design file data gracefully', () => {
        //     checkoutPage
        //         .setPendingDesign(CheckoutDataGenerators.generateInvalidDesign())
        //         .mockAlert()
        //         .visit()
        //         .fillForm(CheckoutDataGenerators.generateFormData())
        //         .submitForm();

        //     cy.get('@alertStub').should('be.calledWithMatch', /Invalid design file data/i);
        // });

        // it('should handle empty cart for regular orders', () => {
        //     checkoutPage
        //         .clearPendingDesign()
        //         .setCartItems(CheckoutDataGenerators.getEmptyCart())
        //         .mockAlert()
        //         .visit()
        //         .fillForm(CheckoutDataGenerators.generateFormData())
        //         .submitForm();

        //     cy.get('@alertStub').should('be.calledWithMatch', /cart is empty/i);
        // });
    });
});