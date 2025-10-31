class OrderApiHelpers {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
    }

    mockGetOrders(orders = [], alias = 'getOrders') {
        cy.intercept('GET', `${this.baseUrl}/order`, {
            statusCode: 200,
            body: { data: orders }
        }).as(alias);
    }

    mockGetOrder(orderId, orderData, alias = 'getOrder') {
        cy.intercept('GET', `${this.baseUrl}/order/${orderId}`, {
            statusCode: 200,
            body: { data: orderData }
        }).as(alias);
    }

    mockCreateOrder(response = { success: true, data: { _id: '123' } }, alias = 'createOrder') {
        cy.intercept('POST', `${this.baseUrl}/order`, {
            statusCode: 201,
            body: response
        }).as(alias);
    }

    mockUpdateOrder(orderId, response = { success: true, data: { _id: '123' } }, alias = 'updateOrder') {
        cy.intercept('PUT', `${this.baseUrl}/order/${orderId}`, {
            statusCode: 200,
            body: response
        }).as(alias);
    }

    mockDeleteOrder(orderId, alias = 'deleteOrder') {
        cy.intercept('DELETE', `${this.baseUrl}/order/${orderId}`, {
            statusCode: 200,
            body: { success: true, message: 'Order deleted successfully' }
        }).as(alias);
    }

    mockServerError(method, endpoint, alias = 'serverError') {
        cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
            statusCode: 500,
            body: { message: 'Server error' }
        }).as(alias);
    }

    mockValidationError(method, endpoint, alias = 'validationError') {
        cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
            statusCode: 400,
            body: { message: 'Validation error' }
        }).as(alias);
    }

    mockNotFoundError(method, endpoint, alias = 'notFoundError') {
        cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
            statusCode: 404,
            body: { message: 'Order not found' }
        }).as(alias);
    }

    mockNetworkError(method, endpoint, alias = 'networkError') {
        cy.intercept(method, `${this.baseUrl}/${endpoint}`, {
            forceNetworkError: true
        }).as(alias);
    }

    mockDelayedResponse(method, endpoint, responseData, delay = 1000, alias = 'delayedResponse') {
        cy.intercept(method, `${this.baseUrl}/${endpoint}`, (req) => {
            req.reply({
                statusCode: 200,
                body: responseData,
                delay
            });
        }).as(alias);
    }
}

export default new OrderApiHelpers();