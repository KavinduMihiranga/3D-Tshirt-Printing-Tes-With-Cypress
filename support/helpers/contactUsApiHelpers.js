class contactUsAPIHelpers {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api/contactUs';
    }   

    mockSubmitContactUsSuccess(alias = 'submitContactUsSuccess') {
        cy.intercept('POST', `${this.baseUrl}/contact-us`, {
            statusCode: 201,
            body: {
                success: true,
                message: 'Contact request submitted successfully',
                data:{
                    
                    _id: '123',
                    name: 'Test User',
                    email: 'test@example.com',
                    status: 'new'
                }
                
            }
        }).as(alias);
        return this;
    }
    mockSubmitContactUsError(statusCode = 500, message = 'Server error', alias = 'submitContactUsError') {
        cy.intercept('POST', `${this.baseUrl}/contact-us`, {
            statusCode: statusCode,
            body: {
                success: false,
                message: message
            }
        }).as(alias);
        return this;
    }

    mockValidationError(alias = 'contactUsValidationError') {
        cy.intercept('POST', `${this.baseUrl}/contactUs`, {
            statusCode: 400,
            body: {
                success: false,
                message: 'Validation error'
            }
        }).as(alias);
        return this;
    }
    mockNetworkError(alias = 'contactUsNetworkError') {
        cy.intercept('POST', `${this.baseUrl}/contactUs`, {
            forceNetworkError: true
        }).as(alias);
        return this;
    }
    mockDelayedResponse(delay = 1000, alias = 'delayedContactUsResponse') {
        cy.intercept('POST', `${this.baseUrl}/contactUs`, (req) => {
            req.reply({
                statusCode: 200,
                body: { success: true },
                delay
            });
        }).as(alias);
        return this;
    }

     mockCompleteFlow() {
        // Mock contact form submission
        cy.intercept('POST', '**/api/contact-us', {
            statusCode: 201,
            body: {
                success: true,
                message: 'Contact request submitted successfully',
                data: {
                    _id: 'flow-test-123',
                    name: 'Flow Test User',
                    email: 'flowtest@example.com',
                    status: 'new'
                }
            }
        }).as('submitContact');

        // Mock getting contacts for management dashboard
        cy.intercept('GET', '**/api/contact-us**', {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        _id: 'flow-test-123',
                        name: 'Flow Test User',
                        email: 'flowtest@example.com',
                        phone: '0771234567',
                        subject: 'Flow Test Subject',
                        message: 'This is a flow test message',
                        status: 'new',
                        priority: 'medium',
                        createdAt: new Date().toISOString()
                    }
                ]
            }
        }).as('getContacts');

        // Mock getting single contact details
        cy.intercept('GET', '**/api/contact-us/flow-test-123**', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    _id: 'flow-test-123',
                    name: 'Flow Test User',
                    email: 'flowtest@example.com',
                    phone: '0771234567',
                    subject: 'Flow Test Subject',
                    quantity: 2,
                    address: '123 Test St, Test City',
                    message: 'This is a flow test message',
                    status: 'new',
                    priority: 'medium',
                    createdAt: new Date().toISOString()
                }
            }
        }).as('getContactDetails');
    }
}

export default new contactUsAPIHelpers();