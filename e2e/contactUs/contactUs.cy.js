import ContactUsPage from "../../support/pageObjects/ContactUsPage";
import ContactUsApiHelpers from "../../support/helpers/contactUsApiHelpers";
import ContactUsDataGenerators from "../../support/helpers/contactUsDataGenerators";    

describe('Contact Us Page', () => {
    const contactUsPage = new ContactUsPage();

    beforeEach(() => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('WebAssembly') || err.message.includes('Out of memory')) {
                return false; // Ignore WebAssembly errors
            }
        });
        cy.visit('http://localhost:5173/contactUs');
    });

    it('should display contact us form', () => {
        // Check if the main elements are visible
        cy.contains('Contact Us').should('be.visible');
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

    it('should submit the contactUs form successfully', () => {
        ContactUsApiHelpers.mockSubmitContactUsSuccess();
        
        const validData = ContactUsDataGenerators.generateConatctUs();
        
            contactUsPage
            .fillForm(validData)
            .submit();

            cy.contains('Thank you! Your message has been sent successfully').should('be.visible');    });

    it('should show error for invalid form submission', () => {
        
        const invalidData = ContactUsDataGenerators.generateInvalidContactUs();
        
        contactUsPage
            .fillForm(invalidData)

    });

    it('should validate required fields', () => {
        // Try to submit empty form
        contactUsPage.submit();
        
        // Check for HTML5 validation messages
        cy.get('input[name="name"]').then(($input) => {
            expect($input[0].validationMessage).to.not.be.empty;
        });
        
        cy.get('input[name="email"]').then(($input) => {
            expect($input[0].validationMessage).to.not.be.empty;
        });
    });


});

