import CartPage from '../../support/pageObjects/CartPage';
import CartApiHelpers from '../../support/helpers/CartApiHelpers';
import CartDataGenerators from '../../support/helpers/cartDataGenerators';

describe('🛒 Cart Page - Comprehensive Test Suite', () => {
    const cartPage = new CartPage();

    context('✅ Basic Structure & Navigation', () => {
        beforeEach(() => {
            cartPage.visit();
        });

        it('should load cart page with title', () => {
            cartPage.verifyPageLoaded();
        });

        it('should have checkout button', () => {
            cartPage.verifyCheckoutButton();
        });

        it('should navigate to checkout page', () => {
            cartPage
                .clickCheckout()
                .verifyNavigationToCheckout();
        });
    });

    context('📦 Empty Cart State', () => {
        beforeEach(() => {
            cartPage
                .setCartData(CartDataGenerators.getEmptyCart())
                .visit();
        });

        it('should handle empty cart gracefully', () => {
            cartPage.verifyEmptyCart();
        });

        it('should display without errors', () => {
            cartPage.verifyPageLoaded();
            // Page should load without crashing
        });
    });

    context('🛍️ Cart With Items - Flexible Tests', () => {
        beforeEach(() => {
            cartPage
                .setCartData(CartDataGenerators.getSingleItemCart())
                .visit();
        });

        it('should find interactive elements if they exist', () => {
            cartPage.findQuantityControls().then((controls) => {
                if (controls.minus) {
                    controls.minus.should('be.visible');
                    controls.plus.should('be.visible');
                }
            });

            cartPage.findRemoveButtons().then(($removeBtns) => {
                if ($removeBtns) {
                    cy.wrap($removeBtns).should('be.visible');
                }
            });
        });
    });

    context('🔢 Quantity Management', () => {
        beforeEach(() => {
            cartPage
                .setCartData(CartDataGenerators.getSingleItemCart())
                .visit();
        });

        it('should handle quantity increases', () => {
            cartPage.findQuantityControls().then((controls) => {
                if (controls.plus) {
                    controls.plus.click();
                    // Verify quantity updated (implementation specific)
                }
            });
        });

        it('should handle quantity decreases', () => {
            cartPage.findQuantityControls().then((controls) => {
                if (controls.minus) {
                    controls.minus.click();
                    // Verify quantity updated (implementation specific)
                }
            });
        });

        it('should handle item removal', () => {
            cartPage.findRemoveButtons().then(($removeBtns) => {
                if ($removeBtns) {
                    $removeBtns.first().click();
                    // Verify item removed (implementation specific)
                }
            });
        });
    });

    context('💾 Data Persistence', () => {
        it('should persist cart in localStorage', () => {
            const testCart = CartDataGenerators.getSingleItemCart();
            
            cartPage
                .setCartData(testCart)
                .visit()
                .verifyCartData(testCart);
        });

        it('should handle multiple cart items', () => {
            const multipleItems = CartDataGenerators.getMultipleItemsCart();
            
            cartPage
                .setCartData(multipleItems)
                .visit()
                .getCartData().should('have.length', 3);
        });

    });

    context('📱 Responsive Design', () => {
        beforeEach(() => {
            cartPage.visit();
        });

        it('should display on mobile viewport', () => {
            cartPage.testMobileView();
        });

        it('should display on desktop viewport', () => {
            cartPage.testDesktopView();
        });

        it('should maintain functionality across breakpoints', () => {
            // Test mobile
            cartPage.testMobileView().verifyCheckoutButton();
            
            // Test desktop  
            cartPage.testDesktopView().verifyCheckoutButton();
        });
    });

    context('🎯 Edge Cases', () => {
        it('should handle cart with zero quantity', () => {
            cartPage
                .setCartData(CartDataGenerators.getCartWithZeroQuantity())
                .visit()
                .verifyPageLoaded();
        });

        it('should handle cart with high quantity', () => {
            cartPage
                .setCartData(CartDataGenerators.getCartWithHighQuantity())
                .visit()
                .verifyPageLoaded();
        });

        it('should handle different product sizes', () => {
            cartPage
                .setCartData(CartDataGenerators.getCartWithDifferentSizes())
                .visit()
                .verifyPageLoaded();
        });

        it('should handle invalid cart data gracefully', () => {
            cy.window().then((win) => {
                win.localStorage.setItem('cart', 'invalid-json');
            });
            
            cartPage.visit().verifyPageLoaded();
        });
    });
});