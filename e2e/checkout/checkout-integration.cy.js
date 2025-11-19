import CheckoutPage from '../../support/pageObjects/CheckoutPage';
import CheckoutApiHelpers from '../../support/helpers/checkoutApiHelpers';
import CheckoutDataGenerators from '../../support/helpers/checkoutDataGenerators';

describe('🧾 Checkout Page - Comprehensive Test Suite', () => {
    const checkoutPage = new CheckoutPage();

    beforeEach(() => {
        // Clear storage and handle potential errors
        cy.clearLocalStorage();
        checkoutPage.clearPendingDesign();
        
        // Handle uncaught exceptions
        Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('WebAssembly') || err.message.includes('Out of memory')) {
                return false;
            }
            if (err.message.includes('ResizeObserver') || err.message.includes('Request failed')) {
                return false;
            }
            return true;
        });
    });

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

        it('should have submit button disabled by default', () => {
            checkoutPage.verifySubmitButtonDisabled();
        });
    });

    context('📝 Form Validation & Error Handling', () => {
        beforeEach(() => {
            checkoutPage
                .visit()
                .mockAlert();
        });

        it('should show validation error for invalid email format', () => {
            checkoutPage
                .fillPersonalInfo('John Doe', 'invalid-email', '1234567890')
                .submitForm();

            checkoutPage.verifyValidationError('email', 'Please enter a valid email address');
        });

        it('should show validation error for short phone number', () => {
            checkoutPage
                .fillPersonalInfo('John Doe', 'test@example.com', '123')
                .submitForm();

            checkoutPage.verifyValidationError('phone', 'Phone number must be at least 10 digits');
        });

        it('should show validation success for valid fields', () => {
            checkoutPage
                .fillPersonalInfo('John Doe', 'test@example.com', '1234567890123')
                .fillBillingAddress('123 Main St', 'Apt 1', 'Colombo', 'Western');

            checkoutPage.verifyValidationSuccess('name');
            checkoutPage.verifyValidationSuccess('email');
            checkoutPage.verifyValidationSuccess('phone');
        });
    });

    context('🏠 Address Management', () => {
        beforeEach(() => {
            checkoutPage.visit();
        });

        it('should have same address checkbox checked by default', () => {
            checkoutPage.verifySameAddressChecked();
        });

        it('should copy billing address to shipping when checkbox is checked', () => {
            const billingData = {
                addressLine1: '123 Test Street',
                addressLine2: 'Apt 5C',
                city: 'Colombo',
                province: 'Western Province'
            };
            
            checkoutPage
                .fillBillingAddress(
                    billingData.addressLine1,
                    billingData.addressLine2,
                    billingData.city,
                    billingData.province
                )
                .verifySameAddressChecked();

            // Verify shipping address shows "Same as billing address"
            cy.contains('p', 'Same as billing address').should('be.visible');
        });

        it('should show shipping address fields when checkbox is unchecked', () => {
            checkoutPage
                .toggleSameAddressCheckbox()
                .verifySameAddressUnchecked();

            // Should show shipping address input fields
            cy.get('input[placeholder="Enter your address line1"]').should('have.length', 2);
            cy.get('input[placeholder="Enter your city"]').should('have.length', 2);
            cy.get('input[placeholder="Enter your province"]').should('have.length', 2);
        });

        it('should allow separate shipping address when unchecked', () => {
            const billingData = {
                addressLine1: '123 Billing St',
                addressLine2: 'Apt 1',
                city: 'Colombo',
                province: 'Western'
            };

            const shippingData = {
                addressLine1: '456 Shipping St',
                addressLine2: 'Suite 200',
                city: 'Kandy',
                province: 'Central'
            };

            checkoutPage
                .fillPersonalInfo('Test User', 'test@example.com', '1234567890')
                .fillBillingAddress(
                    billingData.addressLine1,
                    billingData.addressLine2,
                    billingData.city,
                    billingData.province
                )
                .fillShippingAddress(
                    shippingData.addressLine1,
                    shippingData.addressLine2,
                    shippingData.city,
                    shippingData.province
                )
                .verifySubmitButtonEnabled();
        });
    });

    context('🛒 Regular Order Flow', () => {
        beforeEach(() => {
            checkoutPage
                .clearPendingDesign()
                .setCartItems(CheckoutDataGenerators.generateCartItems(2))
                .visit();
        });

        it('should navigate to payment page with valid form data', () => {
            const formData = CheckoutDataGenerators.generateFormData();
            
            checkoutPage
                .fillForm(formData)
                .verifySubmitButtonEnabled()
                .submitForm();

            cy.url().should('include', '/payment');
        });

        it('should enable submit button when all required fields are filled', () => {
            const formData = CheckoutDataGenerators.generateFormData();
            
            checkoutPage
                .fillPersonalInfo(formData.name, formData.email, formData.phone)
                .verifySubmitButtonDisabled() // Should still be disabled without address
                .fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province)
                .verifySubmitButtonEnabled(); // Should be enabled now
        });
    });

    context('⏳ Form Submission States', () => {

        it('should allow submission with valid data', () => {
            checkoutPage
                .setCartItems(CheckoutDataGenerators.generateCartItems(1))
                .visit()
                .fillForm(CheckoutDataGenerators.generateFormData())
                .verifySubmitButtonEnabled()
                .submitForm();

            cy.url().should('include', '/payment');
        });
    });

    context('🔧 Technical Scenarios', () => {
       
        it('should handle form with only required fields', () => {
            const minimalData = {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                addressLine1: '123 Main St',
                city: 'Colombo',
                province: 'Western'
            };

            checkoutPage
                .setCartItems(CheckoutDataGenerators.generateCartItems(1))
                .visit()
                .fillPersonalInfo(minimalData.name, minimalData.email, minimalData.phone)
                .fillBillingAddress(minimalData.addressLine1, '', minimalData.city, minimalData.province)
                .verifySubmitButtonEnabled()
                .submitForm();

            cy.url().should('include', '/payment');
        });
    });

    context('🔄 Edge Cases', () => {
        it('should handle international phone numbers', () => {
            const internationalData = {
                name: 'John Doe',
                email: 'test@example.com',
                phone: '+94 77 123 4567',
                addressLine1: '123 Main St',
                city: 'Colombo',
                province: 'Western'
            };

            checkoutPage
                .setCartItems(CheckoutDataGenerators.generateCartItems(1))
                .visit()
                .fillForm(internationalData)
                .verifySubmitButtonEnabled()
                .submitForm();

            cy.url().should('include', '/payment');
        });

        it('should reject names with numbers', () => {
            checkoutPage
                .visit()
                .fillPersonalInfo('John123 Doe', 'test@example.com', '1234567890')
                .submitForm();

            checkoutPage.verifyValidationError('name', 'Name cannot contain numbers');
        });

        it('should reject names with special characters', () => {
            checkoutPage
                .visit()
                .fillPersonalInfo('John@Doe', 'test@example.com', '1234567890')
                .submitForm();

            checkoutPage.verifyValidationError('name', 'Name cannot contain special characters');
        });

        it('should require full name (first and last)', () => {
            checkoutPage
                .visit()
                .fillPersonalInfo('John', 'test@example.com', '1234567890')
                .submitForm();

            checkoutPage.verifyValidationError('name', 'Please enter your full name (first and last name)');
        });
    });

    context('📱 Responsive & UI Behavior', () => {
        it('should work on mobile viewport', () => {
            cy.viewport('iphone-6');
            
            checkoutPage
                .setCartItems(CheckoutDataGenerators.generateCartItems(1))
                .visit()
                .verifyPageLoaded()
                .fillForm(CheckoutDataGenerators.generateFormData())
                .verifySubmitButtonEnabled()
                .submitForm();

            cy.url().should('include', '/payment');
        });

        it('should maintain form functionality after page reload', () => {
            const formData = CheckoutDataGenerators.generateFormData();
            
            checkoutPage
                .setCartItems(CheckoutDataGenerators.generateCartItems(1))
                .visit()
                .fillPersonalInfo(formData.name, formData.email, formData.phone)
                .fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province);

            // Reload page
            cy.reload();
            
            // Form should still be submittable (values may persist in some browsers)
            checkoutPage
                .verifyPageLoaded()
                .fillPersonalInfo(formData.name, formData.email, formData.phone)
                .fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province)
                .verifySubmitButtonEnabled()
                .submitForm();

            cy.url().should('include', '/payment');
        });
    });

    context('🎯 Integration Scenarios', () => {
        it('should handle checkout with multiple cart items', () => {
            const multipleItems = CheckoutDataGenerators.generateCartItems(5);
            const formData = CheckoutDataGenerators.generateFormData();

            checkoutPage
                .setCartItems(multipleItems)
                .visit()
                .fillForm(formData)
                .verifySubmitButtonEnabled()
                .submitForm();

            cy.url().should('include', '/payment');
        });

        
        //     checkoutPage
        //         .setCartItems([])
        //         .visit()
        //         .mockAlert()
        //         .fillForm(CheckoutDataGenerators.generateFormData())
        //         .submitForm();

        //     // Should show alert but the actual behavior depends on your CartContext
        //     cy.get('@alertStub').should('be.called');
        // });
    });
});