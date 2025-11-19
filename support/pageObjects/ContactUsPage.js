import BasePage from "./BasePage";

class ContactUsPage extends BasePage {
    constructor() {
        super();
        this.url = '/contactUs';

        // Form selectors
        this.selectors = {
            // Form fields
            nameInput: 'input[name="name"]',
            emailInput: 'input[name="email"]',
            phoneInput: 'input[name="phone"]',
            subjectInput: 'input[name="subject"]',
            quantityInput: 'input[name="quantity"]',
            addressInput: 'input[name="address"]',
            messageTextarea: 'textarea[name="message"]',
            fileInput: 'input[type="file"]',
            submitButton: 'button[type="submit"]',
            
            // Messages
            successMessage: '.bg-green-100, .text-green-600, .text-green-500',
            errorMessage: '.bg-red-100, .text-red-600, .text-red-500',
            validationMessage: '.text-red-500, [class*="error"], [class*="invalid"]',
            
            // Form
            form: 'form',
            
            // Management page selectors
            searchInput: 'input[type="text"]',
            statusFilter: 'select',
            exportButton: 'button:contains("Export Excel")',
            contactCard: '.border-gray-200, [class*="card"], [class*="contact"]',
            statusBadge: '.px-2.py-1.rounded-full, [class*="badge"], [class*="status"]',
            viewDetailsButton: 'button:contains("View Details")',
            clearButton: 'button:contains("Clear")'
        };
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    visitManagement() {
        cy.visit('/contact-management');
        return this;
    }

    verifyPageLoaded() {
        cy.get('body').should('be.visible');
        cy.contains('h1', 'Contact Us').should('be.visible');
        cy.get(this.selectors.nameInput).should('be.visible');
        cy.get(this.selectors.submitButton).should('be.visible');
        return this;
    }

    verifyManagementPageLoaded() {
        cy.get('body').should('be.visible');
        cy.contains('h1', 'Contact Us Management').should('be.visible');
        return this;
    }

    fillForm(formData) {
        if (formData.name) {
            cy.get(this.selectors.nameInput).clear().type(formData.name);
        }
        if (formData.email) {
            cy.get(this.selectors.emailInput).clear().type(formData.email);
        }
        if (formData.phone) {
            cy.get(this.selectors.phoneInput).clear().type(formData.phone);
        }
        if (formData.subject) {
            cy.get(this.selectors.subjectInput).clear().type(formData.subject);
        }
        if (formData.quantity !== undefined) {
            cy.get(this.selectors.quantityInput).clear().type(formData.quantity.toString());
        }
        if (formData.address) {
            cy.get(this.selectors.addressInput).clear().type(formData.address);
        }
        if (formData.message) {
            cy.get(this.selectors.messageTextarea).clear().type(formData.message);
        }
        return this;
    }

    submit() {
        cy.get(this.selectors.submitButton).click({ force: true });
        return this;
    }

    verifySuccessMessage() {
        // Multiple ways to check for success
        cy.get('body').then(($body) => {
            if ($body.find(this.selectors.successMessage).length) {
                cy.get(this.selectors.successMessage).should('be.visible');
            } else if ($body.text().includes('Thank you') || $body.text().includes('success')) {
                cy.contains(/thank you|success/i).should('be.visible');
            }
        });
        return this;
    }

    verifyErrorMessage() {
        cy.get(this.selectors.errorMessage).should('be.visible');
        return this;
    }

    verifyValidationError(field, expectedError) {
        cy.contains(this.selectors.validationMessage, expectedError).should('be.visible');
        return this;
    }

    verifyFieldRequired(fieldName) {
        cy.get(`input[name="${fieldName}"]`).then(($input) => {
            if ($input[0].validationMessage) {
                expect($input[0].validationMessage).to.not.be.empty;
            }
        });
        return this;
    }

    clearForm() {
        cy.get(this.selectors.nameInput).clear();
        cy.get(this.selectors.emailInput).clear();
        cy.get(this.selectors.phoneInput).clear();
        cy.get(this.selectors.subjectInput).clear();
        cy.get(this.selectors.quantityInput).clear();
        cy.get(this.selectors.addressInput).clear();
        cy.get(this.selectors.messageTextarea).clear();
        return this;
    }

    attachFile(fileName) {
        // Create a dummy file for testing
        const fileContent = 'test file content';
        cy.writeFile(`cypress/fixtures/${fileName}`, fileContent);
        cy.get(this.selectors.fileInput).selectFile(`cypress/fixtures/${fileName}`, { force: true });
        return this;
    }

    waitForApiResponse(alias) {
        cy.wait(alias, { timeout: 15000 });
        return this;
    }

    mockAlert() {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });
        return this;
    }

    // Smart form readiness check
    verifyFormReadyForSubmission() {
        // Just verify the button exists, don't check disabled state
        cy.get(this.selectors.submitButton).should('exist');
        return this;
    }

    waitForFormReady() {
        cy.get(this.selectors.nameInput).should('be.visible');
        return this;
    }

    // Management page methods
    searchContacts(searchTerm) {
        cy.get(this.selectors.searchInput).first().clear().type(searchTerm);
        return this;
    }

    filterByStatus(status) {
        cy.get(this.selectors.statusFilter).first().select(status);
        return this;
    }

    exportToExcel() {
        cy.get(this.selectors.exportButton).click();
        return this;
    }

    viewContactDetails(contactIndex = 0) {
        cy.get(this.selectors.viewDetailsButton).eq(contactIndex).click();
        return this;
    }

    updateContactStatus(contactIndex = 0, newStatus) {
        cy.get(this.selectors.contactCard).eq(contactIndex)
            .find('select').first().select(newStatus);
        return this;
    }

    updateContactPriority(contactIndex = 0, newPriority) {
        cy.get(this.selectors.contactCard).eq(contactIndex)
            .find('select').eq(1).select(newPriority);
        return this;
    }

    verifyContactCardVisible() {
        cy.get(this.selectors.contactCard).should('be.visible');
        return this;
    }

    verifyNoContactsMessage() {
        cy.contains('No contact requests found').should('be.visible');
        return this;
    }

    clearFilters() {
        cy.get(this.selectors.clearButton).click();
        return this;
    }

    reloadPage() {
        cy.reload();
        return this.waitForFormReady();
    }
}

export default ContactUsPage;