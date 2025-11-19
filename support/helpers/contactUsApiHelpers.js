class ContactUsApiHelpers {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
    }

    // Mock successful form submission
    mockSubmitContactUsSuccess(alias = 'submitContactUs') {
        cy.intercept('POST', `${this.baseUrl}/contact-us`, {
            statusCode: 201,
            body: {
                success: true,
                message: 'Contact request submitted successfully',
                data: {
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
        cy.intercept('POST', `${this.baseUrl}/contact-us`, {
            statusCode: 400,
            body: {
                success: false,
                message: 'Validation error'
            }
        }).as(alias);
        return this;
    }

    mockNetworkError(alias = 'contactUsNetworkError') {
        cy.intercept('POST', `${this.baseUrl}/contact-us`, {
            forceNetworkError: true
        }).as(alias);
        return this;
    }

    mockDelayedResponse(delay = 2000, alias = 'delayedContactUsResponse') {
        cy.intercept('POST', `${this.baseUrl}/contact-us`, {
            delay: delay,
            statusCode: 201,
            body: {
                success: true,
                message: 'Contact request submitted successfully'
            }
        }).as(alias);
        return this;
    }

    mockTimeoutResponse(alias = 'timeoutContactUsResponse') {
        cy.intercept('POST', `${this.baseUrl}/contact-us`, {
            delay: 10000,
            statusCode: 201
        }).as(alias);
        return this;
    }

    mockGetContactsSuccess(alias = 'getContacts') {
        cy.intercept('GET', `${this.baseUrl}/contact-us**`, {
            statusCode: 200,
            body: {
                success: true,
                data: [
                    {
                        _id: '1',
                        name: 'John Doe',
                        email: 'john@example.com',
                        phone: '0771234567',
                        subject: 'Test Subject',
                        message: 'Test message',
                        status: 'new',
                        priority: 'medium',
                        createdAt: new Date().toISOString()
                    }
                ]
            }
        }).as(alias);
        return this;
    }

    mockEmptyContacts(alias = 'emptyContacts') {
        cy.intercept('GET', `${this.baseUrl}/contact-us**`, {
            statusCode: 200,
            body: {
                success: true,
                data: []
            }
        }).as(alias);
        return this;
    }

    mockUpdateContactStatus(contactId = '1', alias = 'updateContactStatus') {
        cy.intercept('PUT', `${this.baseUrl}/contact-us/${contactId}`, {
            statusCode: 200,
            body: {
                success: true,
                message: 'Contact status updated successfully'
            }
        }).as(alias);
        return this;
    }

    mockUpdateContactPriority(contactId = '1', alias = 'updateContactPriority') {
        cy.intercept('PUT', `${this.baseUrl}/contact-us/${contactId}`, {
            statusCode: 200,
            body: {
                success: true,
                message: 'Contact priority updated successfully'
            }
        }).as(alias);
        return this;
    }

    mockGetContactDetails(contactId = '1', alias = 'getContactDetails') {
        cy.intercept('GET', `${this.baseUrl}/contact-us/${contactId}`, {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    _id: contactId,
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '0771234567',
                    subject: 'Test Subject',
                    message: 'Test message',
                    status: 'new',
                    priority: 'medium',
                    createdAt: new Date().toISOString()
                }
            }
        }).as(alias);
        return this;
    }
}

export default new ContactUsApiHelpers();