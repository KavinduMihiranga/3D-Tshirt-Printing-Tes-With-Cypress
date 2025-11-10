// cypress/support/helpers/CartApiHelpers.js

class CartApiHelpers {
    // Mock successful checkout response
    static mockCheckoutSuccess() {
        cy.intercept('POST', '/api/checkout', {
            statusCode: 200,
            body: {
                success: true,
                message: 'Order placed successfully',
                orderId: 'ORD-12345',
                total: 99.99
            }
        }).as('checkoutSuccess');
    }

    // Mock checkout error response
    static mockCheckoutError() {
        cy.intercept('POST', '/api/checkout', {
            statusCode: 400,
            body: {
                success: false,
                error: 'Payment failed',
                message: 'Insufficient funds'
            }
        }).as('checkoutError');
    }

    // Mock successful cart data retrieval
    static mockGetCartSuccess(cartData) {
        cy.intercept('GET', '/api/cart', {
            statusCode: 200,
            body: cartData
        }).as('getCartSuccess');
    }

    // Mock empty cart
    static mockEmptyCart() {
        cy.intercept('GET', '/api/cart', {
            statusCode: 200,
            body: {
                items: [],
                total: 0,
                itemCount: 0
            }
        }).as('getEmptyCart');
    }

    // Mock cart not found
    static mockCartNotFound() {
        cy.intercept('GET', '/api/cart', {
            statusCode: 404,
            body: {
                error: 'Cart not found'
            }
        }).as('cartNotFound');
    }

    // Mock server error during checkout
    static mockCheckoutServerError() {
        cy.intercept('POST', '/api/checkout', {
            statusCode: 500,
            body: {
                error: 'Internal server error'
            }
        }).as('checkoutServerError');
    }

    // Mock network error
    static mockCheckoutNetworkError() {
        cy.intercept('POST', '/api/checkout', {
            forceNetworkError: true
        }).as('checkoutNetworkError');
    }

    // Wait for checkout API call
    static waitForCheckout() {
        cy.wait('@checkoutSuccess');
    }

    // Wait for checkout error
    static waitForCheckoutError() {
        cy.wait('@checkoutError');
    }

    // Wait for cart load
    static waitForCartLoad() {
        cy.wait('@getCartSuccess');
    }
}

export default CartApiHelpers;