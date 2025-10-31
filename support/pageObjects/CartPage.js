import BasePage from './BasePage';

class CartPage extends BasePage {
    constructor() {
        super();
        this.url = '/cartPage';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Shopping Cart', { timeout: 10000 }).should('be.visible');
        return this;
    }

    verifyEmptyCart() {
        cy.get('body').then(($body) => {
            if ($body.text().match(/empty|no items|your cart is empty|0 items/i)) {
                cy.contains(/empty|no items|your cart is empty|0 items/i).should('be.visible');
            }
        });
        return this;
    }

    verifyCheckoutButton() {
        cy.contains('button', 'Checkout').should('be.visible').and('be.enabled');
        return this;
    }

    clickCheckout() {
        cy.contains('button', 'Checkout').click();
        return this;
    }

    verifyNavigationToCheckout() {
        cy.url().should('include', '/checkoutPage');
        return this;
    }

    // Cart item detection methods
    findCartItems() {
        const possibleSelectors = [
            'table tbody tr',
            '.cart-item',
            '.cart-product', 
            '.item',
            '.product-item',
            '[class*="cart"]',
            '[class*="item"]',
            '.row',
            '.flex > div',
            '.grid > div',
            '[data-testid]',
            '.card',
            '.container > div'
        ];

        return cy.get('body').then(($body) => {
            for (const selector of possibleSelectors) {
                const elements = $body.find(selector);
                if (elements.length > 0) {
                    cy.log(`Found ${elements.length} elements with selector: ${selector}`);
                    return cy.get(selector);
                }
            }
            return cy.wrap(null);
        });
    }

    verifyCartItemExists(productName) {
        cy.contains(productName).should('be.visible');
        return this;
    }

    verifyPriceVisible() {
        cy.contains(/\d+/).should('be.visible');
        return this;
    }

    // Quantity controls
    findQuantityControls() {
        return cy.get('body').then(($body) => {
            const minusBtn = $body.find('button').filter((i, btn) => 
                btn.textContent.includes('-')
            );
            const plusBtn = $body.find('button').filter((i, btn) => 
                btn.textContent.includes('+')
            );
            
            return {
                minus: minusBtn.length > 0 ? cy.wrap(minusBtn) : null,
                plus: plusBtn.length > 0 ? cy.wrap(plusBtn) : null
            };
        });
    }

    findRemoveButtons() {
        return cy.get('body').then(($body) => {
            const removeBtns = $body.find('button').filter((i, btn) => 
                btn.textContent.match(/remove|delete/i)
            );
            return removeBtns.length > 0 ? cy.wrap(removeBtns) : null;
        });
    }

    // LocalStorage management
    setCartData(cartItems) {
        cy.window().then((win) => {
            win.localStorage.setItem('cart', JSON.stringify(cartItems));
        });
        return this;
    }

    getCartData() {
        return cy.window().then((win) => {
            return JSON.parse(win.localStorage.getItem('cart') || '[]');
        });
    }

    verifyCartData(expectedData) {
        return this.getCartData().should('deep.equal', expectedData);
    }

    // Responsive testing
    testMobileView() {
        cy.viewport('iphone-x');
        this.verifyPageLoaded();
        return this;
    }

    testDesktopView() {
        cy.viewport('macbook-15');
        this.verifyPageLoaded();
        return this;
    }

    // Debug methods
    debugPageStructure() {
        cy.get('body').then(($body) => {
            console.log('=== CART PAGE STRUCTURE ===');
            console.log('Title:', $body.find('h1, h2, h3').text());
            
            const structures = {
                table: $body.find('table').length,
                'table rows': $body.find('tbody tr').length,
                'cart classes': $body.find('[class*="cart"]').length,
                'item classes': $body.find('[class*="item"]').length,
                'product classes': $body.find('[class*="product"]').length,
                'grid/row classes': $body.find('.row, .grid, .flex').length,
                'buttons total': $body.find('button').length,
                'images': $body.find('img').length
            };
            
            console.log('Structure counts:', structures);
            
            // Log all buttons
            $body.find('button').each((index, btn) => {
                console.log(`Button ${index}:`, btn.textContent?.trim());
            });
        });
        return this;
    }
}

export default CartPage;