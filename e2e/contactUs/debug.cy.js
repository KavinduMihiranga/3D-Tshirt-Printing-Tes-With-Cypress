import ContactUsPage from "../../support/pageObjects/ContactUsPage";
import ContactUsDataGenerators from "../../support/helpers/contactUsDataGenerators";

describe('Debug Contact Us Form', () => {
    const contactUsPage = new ContactUsPage();

    it('debug form submission', () => {
        cy.visit('http://localhost:5173/contactUs');
        
        const testData = ContactUsDataGenerators.generateConatctUs();
        
        // Fill the form
        contactUsPage.fillForm(testData);
        
        // Intercept the API call to see what's being sent/received
        cy.intercept('POST', 'http://localhost:5000/api/contact-us').as('submitForm');
        
        // Submit the form
        contactUsPage.submit();
        
        // Wait for the API call and log everything
        cy.wait('@submitForm').then((interception) => {
            console.log('API Request:', interception.request);
            console.log('API Response:', interception.response);
        });
        
        // Check what's on the page after submission
        cy.get('body').then(($body) => {
            console.log('Page HTML after submission:', $body.html());
            
            // Check for any success messages
            const successSelectors = [
                '.bg-green-100',
                '.text-green-700', 
                '.alert-success',
                '[data-testid="success-message"]',
                '.success',
                '.toast-success'
            ];
            
            successSelectors.forEach(selector => {
                if ($body.find(selector).length) {
                    console.log(`Found element with selector: ${selector}`);
                    console.log('Content:', $body.find(selector).text());
                }
            });
            
            // Check for any error messages
            const errorSelectors = [
                '.bg-red-100',
                '.text-red-700',
                '.alert-error',
                '.error'
            ];
            
            errorSelectors.forEach(selector => {
                if ($body.find(selector).length) {
                    console.log(`Found error with selector: ${selector}`);
                    console.log('Error content:', $body.find(selector).text());
                }
            });
        });
        
        // Wait a bit and check again
        cy.wait(2000);
        cy.screenshot('after-form-submission');
    });
});