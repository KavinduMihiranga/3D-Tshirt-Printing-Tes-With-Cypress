class CheckoutApiHelpers {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
    }

    mockDesignInquirySuccess(alias = 'designInquiry') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, {
            statusCode: 200,
            body: { 
                success: true, 
                data: { _id: 'design-123' } 
            }
        }).as(alias);
        return this;
    }

    mockDesignInquiryError(statusCode = 500, message = 'Server error', alias = 'designInquiryError') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, {
            statusCode: statusCode,
            body: { message: message }
        }).as(alias);
        return this;
    }

    mockDesignInquiryTimeout(alias = 'designInquiryTimeout') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, {
            delay: 40000, // 40 seconds timeout
            statusCode: 200
        }).as(alias);
        return this;
    }

    mockRegularOrderSuccess(alias = 'regularOrder') {
        cy.intercept('POST', `${this.baseUrl}/order`, {
            statusCode: 200,
            body: { 
                success: true, 
                data: { _id: 'order-123' } 
            }
        }).as(alias);
        return this;
    }

    mockValidationError(alias = 'validationError') {
        cy.intercept('POST', `${this.baseUrl}/design-inquiry`, {
            statusCode: 400,
            body: { message: 'Validation error' }
        }).as(alias);
        return this;
    }

    mockNetworkError(endpoint, alias = 'networkError') {
        cy.intercept('POST', `${this.baseUrl}/${endpoint}`, {
            forceNetworkError: true
        }).as(alias);
        return this;
    }

    mockEmptyCartError(alias = 'emptyCartError') {
        cy.intercept('POST', `${this.baseUrl}/order`, {
            statusCode: 400,
            body: { message: 'Cart cannot be empty' }
        }).as(alias);
        return this;
    }

    mockPaymentSuccess(alias = 'paymentSuccess') {
        cy.intercept('POST', `${this.baseUrl}/payment`, {
            statusCode: 200,
            body: { 
                success: true, 
                data: { _id: 'payment-123', status: 'completed' } 
            }
        }).as(alias);
        return this;
    }
}

export default new CheckoutApiHelpers();