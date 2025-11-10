import BasePage from './BasePage';

class DashboardPage extends BasePage {
    constructor() {
        super();
        this.url = '/';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.url().should('eq', 'http://localhost:5173/');
        cy.get('body').should('be.visible');
        return this;
    }

    verifyProductsGrid() {
        cy.get('.grid').should('be.visible');
        cy.get('.grid > *').should('have.length.at.least', 1);
        return this;
    }

    verifyProductCards() {
        cy.contains('Test Product 1').should('be.visible');
        cy.contains('Test Product 2').should('be.visible');
        cy.contains('29.99').should('be.visible');
        cy.contains('39.99').should('be.visible');
        cy.contains('T-Shirts').should('be.visible');
        cy.contains('Hoodies').should('be.visible');
        return this;
    }

    verifyProductImages() {
        cy.get('img').should('have.length.at.least', 1);
        cy.get('img').each(($img) => {
            cy.wrap($img).should('be.visible').and('have.attr', 'src');
        });
        return this;
    }

    verifyPagination() {
        cy.get('.p-6').should('be.visible');
        cy.contains('button', '1').should('be.visible');
        return this;
    }

    clickPagination(pageNumber) {
        cy.contains('button', pageNumber.toString()).click();
        return this;
    }

    verifyNavigationMenu() {
        cy.get('nav').should('exist');
        cy.get('a[href="/"]').should('exist');
        cy.get('a[href="/productPage"]').should('exist');
        cy.get('a[href="/design"]').should('exist');
        return this;
    }

    navigateToProductPage() {
        cy.get('a[href="/productPage"]').click();
        return this;
    }

    navigateToDesignPage() {
        cy.get('a[href="/design"]').click();
        return this;
    }

    navigateToAboutPage() {
        cy.get('a[href="/aboutUs"]').click();
        return this;
    }

    navigateToContactPage() {
        cy.get('a[href="/contactUs"]').click();
        return this;
    }

    navigateToHome() {
        cy.get('a[href="/"]').first().click();
        return this;
    }

    verifyNavigationSuccess(page) {
        cy.url({ timeout: 10000 }).should('include', page);
        cy.get('body').should('be.visible');
        return this;
    }

    mockProductsAPI(products = null, statusCode = 200) {
        const mockProducts = products || [
            {
                _id: '1',
                name: 'Test Product 1',
                title: 'Test Product 1',
                description: 'This is test product 1 description',
                price: 29.99,
                qty: 10,
                status: 'Active',
                category: 'T-Shirts',
                image: '/api/uploads/product1.jpg'
            },
            {
                _id: '2', 
                name: 'Test Product 2',
                title: 'Test Product 2',
                description: 'This is test product 2 description',
                price: 39.99,
                qty: 5,
                status: 'Active',
                category: 'Hoodies',
                image: '/api/uploads/product2.jpg'
            }
        ];

        cy.intercept('GET', 'http://localhost:5000/api/product', {
            statusCode: statusCode,
            body: { data: mockProducts }
        }).as('getProducts');
        return this;
    }

    mockEmptyProducts() {
        cy.intercept('GET', 'http://localhost:5000/api/product', {
            statusCode: 200,
            body: { data: [] }
        }).as('getEmptyProducts');
        return this;
    }

    mockAPIError() {
        cy.intercept('GET', 'http://localhost:5000/api/product', {
            statusCode: 500,
            body: { message: 'Internal Server Error' }
        }).as('getProductsError');
        return this;
    }

    mockNetworkError() {
        cy.intercept('GET', 'http://localhost:5000/api/product', {
            forceNetworkError: true
        }).as('getProductsNetworkError');
        return this;
    }

    mockDelayedResponse(delay = 2000) {
        cy.intercept('GET', 'http://localhost:5000/api/product', (req) => {
            req.reply({
                delay: delay,
                statusCode: 200,
                body: { 
                    data: [
                        {
                            _id: '1',
                            name: 'Delayed Product',
                            title: 'Delayed Product',
                            price: 25.99,
                            category: 'T-Shirts'
                        }
                    ]
                }
            });
        }).as('delayedProducts');
        return this;
    }
}

export default DashboardPage;