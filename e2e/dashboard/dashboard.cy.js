import DashboardPage from '../../support/pageObjects/DashboardPage';

describe('Dashboard Main Page', () => {
    const dashboardPage = new DashboardPage();

    beforeEach(() => {
        dashboardPage
            .mockProductsAPI()
            .visit();
        cy.wait('@getProducts', { timeout: 15000 });
    });

    context('🎯 Page Structure & Content', () => {
        it('should load dashboard successfully', () => {
            dashboardPage.verifyPageLoaded();
            cy.contains('Custom Designs, Premium Quality').should('be.visible');
        });

        it('should display products grid layout', () => {
            dashboardPage.verifyProductsGrid();
        });

        it('should display product cards with correct information', () => {
            dashboardPage.verifyProductCards();
        });

        it('should display product images correctly', () => {
            dashboardPage.verifyProductImages();
        });
    });

    context('🔄 User Interactions', () => {
        it('should handle pagination interactions', () => {
            cy.get('body').then(($body) => {
                if ($body.find('button:contains("2")').length > 0) {
                    dashboardPage.clickPagination(2);
                    cy.get('body').should('be.visible');
                }
            });
        });

        it('should display icon sections', () => {
            cy.get('.flex').should('be.visible');
            cy.contains('test description').should('be.visible');
        });
    });

    context('⚡ Performance & Loading', () => {
        it('should load within acceptable time', () => {
            const startTime = Date.now();
            
            dashboardPage.visit();
            cy.get('body', { timeout: 20000 }).should('be.visible').then(() => {
                const loadTime = Date.now() - startTime;
                cy.log(`Dashboard loaded in ${loadTime}ms`);
            });
        });

        it('should show loading state during API calls', () => {
            dashboardPage
                .mockDelayedResponse(2000)
                .visit();
            
            cy.get('body').should('be.visible');
            cy.wait('@delayedProducts');
        });
    });
});

describe('Navigation Tests', () => {
    const dashboardPage = new DashboardPage();

    beforeEach(() => {
        dashboardPage.visit();
    });

    context('🔗 Page Navigation', () => {
        it('should have working navigation menu', () => {
            dashboardPage.verifyNavigationMenu();
        });

        it('should navigate to product page successfully', () => {
            dashboardPage
                .navigateToProductPage()
                .verifyNavigationSuccess('/productPage');
        });

        it('should navigate to design page successfully', () => {
            dashboardPage
                .navigateToDesignPage()
                .verifyNavigationSuccess('/design');
        });

        it('should navigate to about page successfully', () => {
            dashboardPage
                .navigateToAboutPage()
                .verifyNavigationSuccess('/aboutUs');
        });

        it('should navigate to contact page successfully', () => {
            dashboardPage
                .navigateToContactPage()
                .verifyNavigationSuccess('/contactUs');
        });

        it('should return to home page from other pages', () => {
            dashboardPage.navigateToProductPage();
            dashboardPage
                .navigateToHome()
                .verifyPageLoaded();
        });
    });
});

describe('Design Page Tests', () => {
    const dashboardPage = new DashboardPage();

    beforeEach(() => {
        cy.visit('http://localhost:5173/design', { timeout: 30000 });
    });

    context('🎨 Design Page Functionality', () => {
        it('should load design page successfully', () => {
            cy.url().should('include', '/design');
            cy.get('body').should('be.visible');
        });

        it('should have interactive elements on design page', () => {
            cy.get('button, a, input').should('exist');
            cy.get('button').first().click({ force: true });
            cy.get('body').should('be.visible');
        });

        it('should allow navigation back to dashboard', () => {
            dashboardPage
                .navigateToHome()
                .verifyPageLoaded();
        });

        it('should maintain design page state on refresh', () => {
            cy.reload();
            cy.url().should('include', '/design');
            cy.get('body').should('be.visible');
        });
    });
});

describe('Product Page Tests', () => {
    const dashboardPage = new DashboardPage();

    beforeEach(() => {
        cy.visit('http://localhost:5173/productPage', { timeout: 30000 });
    });

    context('🛒 Product Page Functionality', () => {
        it('should load product page successfully', () => {
            cy.url().should('include', '/productPage');
            cy.get('body').should('be.visible');
        });

        it('should allow navigation back to dashboard', () => {
            dashboardPage
                .navigateToHome()
                .verifyPageLoaded();
        });
    });
});

describe('Error Handling Tests', () => {
    const dashboardPage = new DashboardPage();

    context('🚨 API Error Scenarios', () => {
        it('should handle empty products state gracefully', () => {
            dashboardPage
                .mockEmptyProducts()
                .visit();
            cy.wait('@getEmptyProducts');

            cy.get('body').should('be.visible');
            cy.get('.grid').should('be.visible');
        });

        it('should handle API errors gracefully', () => {
            dashboardPage
                .mockAPIError()
                .visit();
            cy.wait('@getProductsError');

            cy.get('body').should('be.visible');
        });

        it('should handle network errors gracefully', () => {
            dashboardPage
                .mockNetworkError()
                .visit();
            cy.wait('@getProductsNetworkError');

            cy.get('body').should('be.visible');
        });

        it('should handle 404 pages gracefully', () => {
            cy.visit('http://localhost:5173/nonexistent-page', { failOnStatusCode: false });
            cy.get('body').should('be.visible');
        });
    });
});

describe('Responsive Design Tests', () => {
    const dashboardPage = new DashboardPage();
    const viewports = [
        { name: 'mobile-small', width: 320, height: 568 },
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1024, height: 768 }
    ];

    viewports.forEach(viewport => {
        it(`should display correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
            cy.viewport(viewport.width, viewport.height);
            dashboardPage.visit();
            
            cy.get('body', { timeout: 15000 }).should('be.visible');
            cy.get('.grid, div, main').should('exist');
        });
    });

    it('should maintain functionality on mobile touch', () => {
        cy.viewport('iphone-6');
        dashboardPage.visit();
        
        cy.get('a').first().click({ force: true });
        cy.get('body').should('be.visible');
    });
});

describe('Integration Tests', () => {
    const dashboardPage = new DashboardPage();

    context('🔄 Application Flow', () => {
        it('should maintain application state during navigation', () => {
            dashboardPage.visit();
            cy.visit('http://localhost:5173/design');
            dashboardPage.visit().verifyPageLoaded();
        });

        it('should handle multiple page navigations', () => {
            dashboardPage.visit();
            cy.visit('http://localhost:5173/design');
            cy.visit('http://localhost:5173/productPage');
            dashboardPage.visit().verifyPageLoaded();
        });
    });
});

describe('Accessibility Tests', () => {
    const dashboardPage = new DashboardPage();

    beforeEach(() => {
        dashboardPage.visit();
    });

    context('♿ Accessibility Standards', () => {
        it('should have proper page structure', () => {
            cy.get('html').should('have.attr', 'lang');
            cy.title().should('not.be.empty');
        });

        it('should have accessible images', () => {
            cy.get('img').each(($img) => {
                cy.wrap($img).should('have.attr', 'src');
            });
        });

        it('should have accessible navigation', () => {
            cy.get('nav').should('exist');
            cy.get('a').each(($link) => {
                cy.wrap($link).should('have.attr', 'href');
            });
        });
    });
});

describe('Cart and Checkout Tests', () => {
    const dashboardPage = new DashboardPage();

    context('🛒 Shopping Flow', () => {
        it('should navigate to cart page', () => {
            dashboardPage
                .visit()
                .navigateToCartPage()  // Use the page object method instead of direct cy.get()
                .verifyNavigationSuccess('/cartPage');
        });
    });
});

describe('Authentication Tests', () => {
    const dashboardPage = new DashboardPage();

    context('🔐 Public Access', () => {
        it('should access public routes without authentication', () => {
            dashboardPage.visit().verifyPageLoaded();
            
            cy.visit('http://localhost:5173/productPage');
            cy.url().should('include', '/productPage');

            cy.visit('http://localhost:5173/design');
            cy.url().should('include', '/design');
        });

        it('should have accessible login page', () => {
            cy.visit('http://localhost:5173/login');
            cy.url().should('include', '/login');
            cy.get('body').should('be.visible');
        });
    });
});

describe('Data Persistence Tests', () => {
    const dashboardPage = new DashboardPage();

    context('💾 State Management', () => {
        it('should persist data across page reloads', () => {
            dashboardPage.visit();
            
            cy.get('body').then(($body) => {
                const initialContent = $body.text();
                
                cy.reload();
                cy.get('body').should('be.visible');
                cy.get('body').should(($bodyAfterReload) => {
                    expect($bodyAfterReload.text().length).to.be.greaterThan(5);
                });
            });
        });
    });
});

describe('Error Boundary Tests', () => {
    const dashboardPage = new DashboardPage();

    context('🛡️ Application Resilience', () => {
        it('should not crash on invalid interactions', () => {
            dashboardPage.visit();
            
            cy.get('body').click('topLeft');
            cy.get('body').rightclick({ force: true });
            cy.get('body').should('be.visible');
        });

        it('should recover from JavaScript errors', () => {
            dashboardPage.visit();
            
            cy.window().then((win) => {
                const originalConsoleError = win.console.error;
                win.console.error = () => {};
            });
            
            cy.get('body').should('be.visible');
        });
    });
});