import BasePage from "./BasePage";

class ContactUsManagementPage extends BasePage {
    constructor() {
        super();
        this.url = '/contactUsManagement';
        this.selectors = {
         searchInput: 'input[type="text"]',
            contactRow: '.border-gray-200', // Updated to match the card class
            contactCard: '.border-gray-200', // Card container
            contactName: '.font-bold.text-lg',
            contactEmail: '.text-sm.text-gray-600',
            statusBadge: '.px-2.py-1.rounded-full',
            viewDetailsButton: 'button:contains("View Details")'
        };

    }

    visit() {
        cy.window().then((win) => {
            win.localStorage.setItem('adminToken', 'mock-admin-token');
        });
        super.visit(this.url);
        return this;
    }   
verifyPageLoaded() {
        cy.contains('Contact Us Management').should('be.visible');
        return this;
    }

    searchContact(searchTerm) {
        cy.get(this.selectors.searchInput).type(searchTerm);
        return this;
    }

    verifyContactExists(name, email) {
        cy.contains(this.selectors.contactRow, name).within(() => {
            cy.contains(name).should('be.visible');
            cy.contains(email).should('be.visible');
        });
        return this;
    }

    viewContactDetails(contactName) {
        cy.contains(this.selectors.contactRow, contactName).within(() => {
            cy.get(this.selectors.viewDetailsButton).click();
        });
        return this;
    }

    verifyContactDetails(contactData) {
        // Verify details in the contact details page
        cy.contains(contactData.name).should('be.visible');
        cy.contains(contactData.email).should('be.visible');
        cy.contains(contactData.phone).should('be.visible');
        cy.contains(contactData.subject).should('be.visible');
        cy.contains(contactData.message).should('be.visible');
        
        if (contactData.quantity) {
            cy.contains(`Quantity: ${contactData.quantity}`).should('be.visible');
        }
        
        return this;
    }

    verifyContactStatus(contactName, expectedStatus) {
        cy.contains(this.selectors.contactRow, contactName).within(() => {
            cy.get(this.selectors.statusBadge).contains(expectedStatus).should('be.visible');
        });
        return this;
    }
}

export default ContactUsManagementPage;