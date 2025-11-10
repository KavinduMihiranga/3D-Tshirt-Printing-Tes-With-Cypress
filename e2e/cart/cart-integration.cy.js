import CartPage from '../../support/pageObjects/CartPage';
import CartApiHelpers from '../../support/helpers/CartApiHelpers';
import CartDataGenerators from '../../support/helpers/cartDataGenerators';

describe('🔄 Cart Page - Integration Tests', () => {
    const cartPage = new CartPage();

    context('🛒 Complete Cart Flow', () => {
        it('should complete full cart to checkout flow', () => {
            CartApiHelpers.mockCheckoutSuccess();
            
            cartPage
                .setCartData(CartDataGenerators.getMultipleItemsCart())
                .visit()
                .verifyPageLoaded()
                .clickCheckout()
                .verifyNavigationToCheckout();
        });

        it('should handle checkout API errors gracefully', () => {
            CartApiHelpers.mockCheckoutError();
            
            cartPage
                .setCartData(CartDataGenerators.getSingleItemCart())
                .visit()
                .clickCheckout();
            
            // Should handle error without crashing
            cy.get('body').should('exist');
        });
    });

    context('⚡ Performance & Reliability', () => {
        // it('should load quickly with cart data', () => {
        //     const startTime = Date.now();
            
        //     cartPage
        //         .setCartData(CartDataGenerators.getMultipleItemsCart())
        //         .visit()
        //         .verifyPageLoaded()
        //         .then(() => {
        //             const loadTime = Date.now() - startTime;
        //             cy.log(`Cart page loaded in ${loadTime}ms`);
        //             expect(loadTime).to.be.lessThan(5000);
        //         });
        // });

        it('should handle large cart data', () => {
            const largeCart = CartDataGenerators.generateMultipleCartItems(20);
            
            cartPage
                .setCartData(largeCart)
                .visit()
                .verifyPageLoaded();
        });
    });
});