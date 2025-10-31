class DesignApiHelpers {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
    }

    mockDesignInquirySuccess(alias = 'designInquiry') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, {
            statusCode: 200,
            body: { success: true }
        }).as(alias);
    }

    mockDesignInquiryError(statusCode = 500, message = 'Server error', alias = 'designInquiryError') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, {
            statusCode: statusCode,
            body: { message: message }
        }).as(alias);
    }

    mockValidationError(alias = 'validationError') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, {
            statusCode: 400,
            body: { message: 'Validation error' }
        }).as(alias);
    }

    mockNetworkError(alias = 'networkError') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, {
            forceNetworkError: true
        }).as(alias);
    }

    mockDelayedResponse(delay = 1000, alias = 'delayedDesignInquiry') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, (req) => {
            req.reply({
                statusCode: 200,
                body: { success: true },
                delay
            });
        }).as(alias);
    }
}

export default new DesignApiHelpers();