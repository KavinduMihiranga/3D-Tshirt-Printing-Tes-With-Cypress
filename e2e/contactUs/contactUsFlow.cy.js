import ContactUsPage from "../../support/pageObjects/ContactUsPage";
import ContactUsManagementPage from "../../support/pageObjects/ContactUsManagementPage";
import ContactUsDataGenerators from "../../support/helpers/contactUsDataGenerators";
import ContactUsApiHelpers from "../../support/helpers/contactUsApiHelpers";

describe('Contact Us Form to Management Dashboard Flow', () => {
    const contactUsPage = new ContactUsPage();
    const contactUsManagementPage = new ContactUsManagementPage();

    beforeEach(() => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('WebAssembly') || err.message.includes('Out of memory')) {
                return false;
            }
        });
    });

    it('should submit contact form and appear in management dashboard', () => {
        // Mock the complete flow
        ContactUsApiHelpers.mockCompleteFlow();
        
        const testData = ContactUsDataGenerators.generateConatctUs();
        
        // Step 1: Submit contact form
        cy.visit('http://localhost:5173/contactUs');
        
        contactUsPage
            .fillForm(testData)
            .submit()
            .waitForSubmission()
            .verifySuccessMessage();
        
        // Step 2: Go to management dashboard with authentication
        contactUsManagementPage.visit().verifyPageLoaded();
        
        // Step 3: Search and verify the submitted data appears
        contactUsManagementPage
            .searchContact(testData.name)
            .verifyContactExists(testData.name, testData.email);
        
        // Step 4: Verify contact details
        contactUsManagementPage
            .viewContactDetails(testData.name)
            .verifyContactDetails(testData);
    });

    it('should show new contact with correct status in dashboard', () => {
        const testData = ContactUsDataGenerators.generateConatctUs({
            name: 'Flow Test User',
            email: 'flowtest@example.com'
        });
        
        // Mock APIs
        ContactUsApiHelpers.mockCompleteFlow();
        
        // Submit contact form
        cy.visit('http://localhost:5173/contactUs');
        
        contactUsPage
            .fillForm(testData)
            .submit()
            .waitForSubmission()
            .verifySuccessMessage();
        
        // Check management dashboard with authentication
        contactUsManagementPage.visit().verifyPageLoaded();
        
        // Verify the contact appears with correct initial status
        contactUsManagementPage
            .searchContact(testData.name)
            .verifyContactExists(testData.name, testData.email)
            .verifyContactStatus(testData.name, 'new');
    });
});