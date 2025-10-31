import CartPage from '../../support/pageObjects/CartPage';
import CartDataGenerators from '../../support/helpers/cartDataGenerators';

describe('🔍 Cart Page - Debug & Discovery', () => {
    const cartPage = new CartPage();

    it('should reveal actual cart page structure', () => {
        cartPage
            .setCartData(CartDataGenerators.getSingleItemCart())
            .visit()
            .debugPageStructure();
    });

    it('should test all possible cart item selectors', () => {
        cartPage
            .setCartData(CartDataGenerators.getMultipleItemsCart())
            .visit();

        // Test each selector pattern
        const selectors = [
            'table tbody tr',
            '.cart-item',
            '.item',
            '.product',
            '[class*="cart"]',
            '.row',
            '.flex > div',
            '.grid > div'
        ];

        selectors.forEach(selector => {
            cy.get('body').then($body => {
                const elements = $body.find(selector);
                if (elements.length > 0) {
                    cy.log(`✅ Found ${elements.length} elements with: ${selector}`);
                    cy.get(selector).should('exist');
                }
            });
        });
    });

    it('should identify all interactive elements', () => {
        cartPage
            .setCartData(CartDataGenerators.getSingleItemCart())
            .visit();

        cy.get('body').then($body => {
            // Find all buttons and their purposes
            const buttons = $body.find('button');
            cy.log(`Total buttons found: ${buttons.length}`);
            
            buttons.each((index, btn) => {
                const text = btn.textContent?.trim();
                const classes = btn.className;
                cy.log(`Button ${index}: "${text}" - classes: ${classes}`);
            });

            // Find all inputs
            const inputs = $body.find('input');
            cy.log(`Total inputs found: ${inputs.length}`);
            
            inputs.each((index, input) => {
                const type = input.type;
                const placeholder = input.placeholder;
                cy.log(`Input ${index}: type=${type}, placeholder=${placeholder}`);
            });
        });
    });
});