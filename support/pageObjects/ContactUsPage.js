import BasePage from "./BasePage";

class ContactUsPage extends BasePage {
    constructor() {
        super();
        this.url = '/contactUs';

         // Form selectors
        this.selectors = {
            nameInput: 'input[name="name"]',
            emailInput: 'input[name="email"]',
            phoneInput: 'input[name="phone"]',
            subjectInput: 'input[name="subject"]',
            quantityInput: 'input[name="quantity"]',
            addressInput: 'input[name="address"]',
            messageTextarea: 'textarea[name="message"]',
            submitButton: 'button[type="submit"]',
            successMessage: '.bg-green-100', // Success message div
            errorMessage: '.bg-red-100' // Error message div
        };
    }
    visit() {
        super.visit(this.url);
        return this;
    }
    verifyPageLoaded() {
        cy.contains('Contact Us').should('be.visible');
        cy.get(this.selectors.nameInput).should('be.visible');
        return this;
    }

    fillForm(formData) {
        if (formData.name) cy.get(this.selectors.nameInput).type(formData.name);
        if (formData.email) cy.get(this.selectors.emailInput).type(formData.email);
        if (formData.phone) cy.get(this.selectors.phoneInput).type(formData.phone);
        if (formData.subject) cy.get(this.selectors.subjectInput).type(formData.subject);
        if (formData.quantity) cy.get(this.selectors.quantityInput).type(formData.quantity.toString());
        if (formData.address) cy.get(this.selectors.addressInput).type(formData.address);
        if (formData.message) cy.get(this.selectors.messageTextarea).type(formData.message);
        
        return this;
    }

    submit() {
        cy.get(this.selectors.submitButton).click();
        return this;
    }

    verifySuccessMessage() {
        cy.get(this.selectors.successMessage)
          .should('be.visible')
          .and('contain', 'Thank you! Your message has been sent successfully');
        return this;
    }

}
    export default ContactUsPage;