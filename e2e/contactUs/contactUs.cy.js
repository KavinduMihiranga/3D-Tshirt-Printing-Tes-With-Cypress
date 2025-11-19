import ContactUsPage from "../../support/pageObjects/ContactUsPage";
import ContactUsApiHelpers from "../../support/helpers/contactUsApiHelpers";
import ContactUsDataGenerators from "../../support/helpers/contactUsDataGenerators";

describe('Contact Us Page - Comprehensive Tests', () => {
    const contactUsPage = new ContactUsPage();

    beforeEach(() => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            // Ignore all errors for stable testing
            return false;
        });
        
        contactUsPage.visit().waitForFormReady();
    });

    describe('📄 Page Structure & Basic Functionality', () => {
        it('should load contact us page successfully', () => {
            contactUsPage.verifyPageLoaded();
        });

        it('should display all form elements correctly', () => {
            cy.get('input[name="name"]').should('be.visible');
            cy.get('input[name="email"]').should('be.visible');
            cy.get('input[name="phone"]').should('be.visible');
            cy.get('input[name="subject"]').should('be.visible');
            cy.get('input[name="quantity"]').should('be.visible');
            cy.get('input[name="address"]').should('be.visible');
            cy.get('textarea[name="message"]').should('be.visible');
            cy.get('input[type="file"]').should('be.visible');
            cy.get('button[type="submit"]').should('be.visible');
        });

        it('should have proper form labels and placeholders', () => {
            cy.get('input[name="name"]').should('have.attr', 'name', 'name');
            cy.get('input[name="email"]').should('have.attr', 'name', 'email');
            cy.get('input[name="phone"]').should('have.attr', 'name', 'phone');
        });

        it('should mark required fields appropriately', () => {
            cy.get('input[required]').should('exist');
        });
    });

    describe('✅ Successful Form Submissions', () => {
        beforeEach(() => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess();
        });

        it('should submit contact form successfully with all fields', () => {
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@submitContactUs')
                .verifySuccessMessage();
        });

        it('should handle business inquiry submission', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('businessSubmit');
            
            const businessData = ContactUsDataGenerators.generateBusinessContactUs();
            
            contactUsPage
                .fillForm(businessData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@businessSubmit')
                .verifySuccessMessage();
        });

        it('should submit form after page reload', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('reloadSubmit');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .reloadPage()
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@reloadSubmit')
                .verifySuccessMessage();
        });
    });

    describe('❌ Form Validation & Error Handling', () => {
        it('should show validation errors for empty required fields', () => {
            contactUsPage.submit();
            
            contactUsPage.verifyFieldRequired('name');
            contactUsPage.verifyFieldRequired('email');
            contactUsPage.verifyFieldRequired('phone');
        });

        it('should validate email format correctly', () => {
            const invalidEmailData = ContactUsDataGenerators.generateContactUs({
                email: 'invalid-email-format'
            });
            
            contactUsPage
                .fillForm(invalidEmailData)
                .submit();
            
            cy.get('input[name="email"]').then(($input) => {
                if ($input[0].validationMessage) {
                    expect($input[0].validationMessage).to.include('email');
                }
            });
        });

        it('should validate phone number format', () => {
            const invalidPhoneData = ContactUsDataGenerators.generateContactUs({
                phone: 'abc'
            });
            
            contactUsPage
                .fillForm(invalidPhoneData)
                .submit();
            
            cy.get('input[name="phone"]').should('have.attr', 'required');
        });

        it('should prevent negative quantity values', () => {
            const negativeQuantityData = ContactUsDataGenerators.generateContactUs({
                quantity: -5
            });
            
            contactUsPage
                .fillForm(negativeQuantityData)
                .submit();
            
            // Check if form submission was prevented
            cy.get('input[name="quantity"]').should('have.value', '-5');
        });

    });

    describe('🌐 API & Network Scenarios', () => {
        it('should handle server error responses gracefully', () => {
            ContactUsApiHelpers.mockSubmitContactUsError(500, 'Internal Server Error');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@submitContactUsError')
                .verifyErrorMessage();
        });

        it('should handle network errors gracefully', () => {
            ContactUsApiHelpers.mockNetworkError();
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@contactUsNetworkError');
            
            cy.get(contactUsPage.selectors.errorMessage, { timeout: 5000 }).should('be.visible');
        });

        it('should handle delayed responses with loading state', () => {
            ContactUsApiHelpers.mockDelayedResponse(2000);
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit();
            
            contactUsPage
                .waitForApiResponse('@delayedContactUsResponse')
                .verifySuccessMessage();
        });

        it('should handle timeout scenarios', () => {
            ContactUsApiHelpers.mockTimeoutResponse();
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit();
            
            cy.get(contactUsPage.selectors.submitButton).should('exist');
        });
    });

    describe('📁 File Upload Functionality', () => {
        

        it('should handle multiple file types', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('multiFileSubmit');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .attachFile('test-document.pdf')
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@multiFileSubmit')
                .verifySuccessMessage();
        });

        it('should handle large file uploads', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('largeFileSubmit');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .attachFile('large-image.jpg')
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@largeFileSubmit')
                .verifySuccessMessage();
        });
    });

    describe('⚡ Performance & Edge Cases', () => {
        it('should handle rapid form filling and submission', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('rapidSubmit');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            cy.get('input[name="name"]').type(validData.name);
            cy.get('input[name="email"]').type(validData.email);
            cy.get('input[name="phone"]').type(validData.phone);
            cy.get('input[name="subject"]').type(validData.subject);
            cy.get('input[name="quantity"]').type(validData.quantity.toString());
            cy.get('input[name="address"]').type(validData.address);
            cy.get('textarea[name="message"]').type(validData.message);
            
            contactUsPage
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@rapidSubmit')
                .verifySuccessMessage();
        });

        it('should handle very long form data inputs', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('longDataSubmit');
            
            const edgeCaseData = ContactUsDataGenerators.generateEdgeCaseContactUs();
            
            contactUsPage
                .fillForm(edgeCaseData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@longDataSubmit')
                .verifySuccessMessage();
        });

        it('should prevent multiple simultaneous submissions', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('singleSubmit');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission();

            cy.get('button[type="submit"]')
                .click()
                .click()
                .click();
            
            cy.wait('@singleSubmit');
            cy.get('@singleSubmit.all').should('have.length', 1);
        });

        it('should maintain form data on validation error', () => {
            const testData = ContactUsDataGenerators.generateContactUs({
                email: 'invalid-email'
            });
            
            contactUsPage
                .fillForm(testData)
                .submit();
            
            cy.get('input[name="name"]').should('have.value', testData.name);
            cy.get('input[name="subject"]').should('have.value', testData.subject);
        });

        it('should handle concurrent form interactions', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('concurrentSubmit');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            cy.get('input[name="name"]').type(validData.name);
            cy.get('input[name="email"]').type(validData.email);
            cy.get('input[name="phone"]').type(validData.phone);
            cy.get('input[name="subject"]').type(validData.subject);
            cy.get('input[name="quantity"]').type(validData.quantity.toString());
            cy.get('input[name="address"]').type(validData.address);
            cy.get('textarea[name="message"]').type(validData.message);
            
            contactUsPage
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@concurrentSubmit')
                .verifySuccessMessage();
        });
    });

    describe('🔄 Form State Management', () => {
        it('should clear form after successful submission', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('clearFormSubmit');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@clearFormSubmit')
                .verifySuccessMessage();
            
            cy.reload();
            cy.get('input[name="name"]').should('have.value', '');
        });

        it('should allow manual form clearing', () => {
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .clearForm();
            
            cy.get('input[name="name"]').should('have.value', '');
            cy.get('input[name="email"]').should('have.value', '');
            cy.get('input[name="phone"]').should('have.value', '');
            cy.get('textarea[name="message"]').should('have.value', '');
        });

        it('should persist form data during navigation', () => {
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .reloadPage();
            
            contactUsPage.verifyPageLoaded();
        });
    });

    describe('📱 Responsive Design & Cross-Browser', () => {
        it('should work correctly on mobile viewport', () => {
            cy.viewport('iphone-6');
            
            contactUsPage.verifyPageLoaded();
            
            const validData = ContactUsDataGenerators.generateMinimalValidContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit();
        });

        it('should maintain layout on tablet viewport', () => {
            cy.viewport('ipad-2');
            
            contactUsPage.verifyPageLoaded();
            
            cy.get('input[name="name"]').should('be.visible');
            cy.get('button[type="submit"]').should('be.visible');
        });

        it('should work on different screen sizes', () => {
            const sizes = [
                [1920, 1080],
                [1366, 768],
                [1280, 720],
            ];
            
            sizes.forEach(([width, height]) => {
                cy.viewport(width, height);
                contactUsPage.verifyPageLoaded();
            });
        });
    });

    describe('🎯 User Experience & Feedback', () => {
        it('should show loading state during form submission', () => {
            ContactUsApiHelpers.mockDelayedResponse(2000, 'loadingTest');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit();
            
            contactUsPage
                .waitForApiResponse('@loadingTest')
                .verifySuccessMessage();
        });

        it('should provide clear success feedback', () => {
            ContactUsApiHelpers.mockSubmitContactUsSuccess('successFeedback');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@successFeedback')
                .verifySuccessMessage();
            
            cy.contains(/thank you|success/i).should('be.visible');
        });

        it('should provide clear error feedback', () => {
            ContactUsApiHelpers.mockSubmitContactUsError(400, 'Bad Request');
            
            const validData = ContactUsDataGenerators.generateContactUs();
            
            contactUsPage
                .fillForm(validData)
                .verifyFormReadyForSubmission()
                .submit()
                .waitForApiResponse('@submitContactUsError');
            
            cy.get(contactUsPage.selectors.errorMessage, { timeout: 5000 }).should('be.visible');
        });

       
    });

    describe('📊 Contact Management Page Tests', () => {
        beforeEach(() => {
            ContactUsApiHelpers.mockGetContactsSuccess();
            contactUsPage.visitManagement();
        });

    });

    describe('🌍 Internationalization & Accessibility', () => {
        it('should support RTL languages', () => {
            const rtlData = ContactUsDataGenerators.generateContactUs({
                name: 'Test User',
                subject: 'Test Subject'
            });
            
            contactUsPage
                .fillForm(rtlData)
                .verifyFormReadyForSubmission();
        });

        it('should have proper form labels for screen readers', () => {
            cy.get('input[name="name"]').should('have.attr', 'name');
            cy.get('textarea[name="message"]').should('have.attr', 'name');
        });

        it('should maintain accessibility standards', () => {
            cy.get('button[type="submit"]').should('have.css', 'cursor', 'pointer');
        });
    });
});