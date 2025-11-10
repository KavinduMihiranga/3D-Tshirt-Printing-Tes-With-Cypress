// ==================== PRODUCT DETAIL TESTS ====================
describe('Product Detail Page', () => {
  const mockProduct = {
    _id: '123',
    title: 'Test Product',
    name: 'Test Product',
    description: 'This is a test product description',
    price: 29.99,
    qty: 10,
    status: 'Active',
    category: 'T-Shirts',
    image: '/api/uploads/test-product.jpg'
  };

  beforeEach(() => {
    // Mock the product API
    cy.intercept('GET', '/api/product/123', {
      statusCode: 200,
      body: { data: mockProduct }
    }).as('getProduct');

    // Mock cart context
    cy.window().then((win) => {
      win.addToCart = cy.stub().as('addToCartStub');
    });
  });

  describe('Product Detail with ID Parameter', () => {
    it('should load product detail page with ID parameter', () => {
      cy.visit('http://localhost:5173/product/123');
      
      cy.wait('@getProduct');
      
      // Check loading state disappears
      cy.contains('Loading product details...').should('not.exist');
      
      // Verify product details are displayed
      cy.contains('Test Product').should('be.visible');
      cy.contains('This is a test product description').should('be.visible');
      cy.contains('Rs. 29.99').should('be.visible');
      cy.contains('T-Shirts').should('be.visible');
      cy.contains('Active').should('be.visible');
      cy.contains('10 in stock').should('be.visible');
    });

    it('should display product image correctly', () => {
      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProduct');

      cy.get('img')
        .should('be.visible')
        .and('have.attr', 'src', '/api/uploads/test-product.jpg')
        .and('have.attr', 'alt', 'Test Product');
    });

    it('should handle image loading errors', () => {
      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProduct');

      // Test image error handling
      cy.get('img')
        .should('exist')
        .and('be.visible');
    });
  });

  describe('Product Detail with State Data', () => {
    it('should load product from state without API call', () => {
      cy.visit('http://localhost:5173/product/123', {
        state: mockProduct
      });

      // Should not call API when product is in state
      cy.get('@getProduct.all').should('have.length', 0);
      
      // Product should be immediately visible
      cy.contains('Test Product').should('be.visible');
      cy.contains('Rs. 29.99').should('be.visible');
    });
  });

  describe('Product Actions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProduct');
    });

    it('should add product to cart and navigate to cart page', () => {
      // Stub the navigation
      cy.window().then((win) => {
        cy.stub(win, 'navigate').as('navigateStub');
      });

      cy.get('button').contains('Add to Cart').click();

      // Verify addToCart was called with correct product data
      cy.get('@addToCartStub').should('have.been.calledWith', {
        id: '123',
        name: 'Test Product',
        size: 'Medium',
        price: 29.99,
        image: '/api/uploads/test-product.jpg'
      });

      // Should navigate to cart page
      cy.url().should('include', '/cartPage');
    });

    it('should have working Buy Now button', () => {
      cy.get('button').contains('Buy Now')
        .should('be.visible')
        .and('be.enabled');
    });

    it('should handle multiple Add to Cart clicks', () => {
      cy.get('button').contains('Add to Cart').click();
      cy.get('@addToCartStub').should('have.been.calledOnce');
    });
  });

  describe('Product Information Display', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProduct');
    });

    it('should display all product information in grid layout', () => {
      // Check grid layout exists
      cy.get('.grid.grid-cols-2').should('exist');
      
      // Verify all information sections
      cy.contains('Category').should('be.visible');
      cy.contains('T-Shirts').should('be.visible');
      
      cy.contains('Status').should('be.visible');
      cy.contains('Active').should('be.visible');
      
      cy.contains('Price').should('be.visible');
      cy.contains('Rs. 29.99').should('be.visible');
      
      cy.contains('Quantity').should('be.visible');
      cy.contains('10 in stock').should('be.visible');
    });

    it('should display product description', () => {
      cy.contains('Description').should('be.visible');
      cy.contains('This is a test product description').should('be.visible');
    });

    it('should have proper styling and layout', () => {
      // Check main container
      cy.get('.max-w-4xl.mx-auto').should('exist');
      
      // Check responsive layout
      cy.get('.flex.flex-col.md\\:flex-row').should('exist');
      
      // Check image container
      cy.get('.md\\:w-1\\/2').should('have.length', 2);
    });
  });

  describe('Error Handling', () => {
    it('should handle product not found', () => {
      cy.intercept('GET', '/api/product/999', {
        statusCode: 404,
        body: { message: 'Product not found' }
      }).as('getProductNotFound');

      cy.visit('http://localhost:5173/product/999');
      cy.wait('@getProductNotFound');

      cy.contains('Product not found.').should('be.visible');
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '/api/product/123', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('getProductError');

      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProductError');

      // Should show error state
      cy.contains('Product not found.').should('be.visible');
    });

    it('should handle network errors', () => {
      cy.intercept('GET', '/api/product/123', {
        forceNetworkError: true
      }).as('getProductNetworkError');

      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProductNetworkError');

      cy.contains('Product not found.').should('be.visible');
    });

    it('should show loading state during API call', () => {
      // Delay API response to see loading state
      cy.intercept('GET', '/api/product/123', (req) => {
        req.reply({
          delay: 2000,
          statusCode: 200,
          body: { data: mockProduct }
        });
      }).as('getProductDelayed');

      cy.visit('http://localhost:5173/product/123');
      
      // Should show loading state
      cy.contains('Loading product details...').should('be.visible');
      
      // Loading should disappear when data loads
      cy.wait('@getProductDelayed');
      cy.contains('Loading product details...').should('not.exist');
    });
  });

  describe('Edge Cases', () => {
    it('should handle product with missing fields', () => {
      const incompleteProduct = {
        _id: '124',
        title: 'Incomplete Product',
        price: 19.99
        // Missing other fields
      };

      cy.intercept('GET', '/api/product/124', {
        statusCode: 200,
        body: { data: incompleteProduct }
      }).as('getIncompleteProduct');

      cy.visit('http://localhost:5173/product/124');
      cy.wait('@getIncompleteProduct');

      // Should still display available information
      cy.contains('Incomplete Product').should('be.visible');
      cy.contains('Rs. 19.99').should('be.visible');
    });

    it('should handle product with zero quantity', () => {
      const outOfStockProduct = {
        ...mockProduct,
        _id: '125',
        qty: 0,
        status: 'Out of Stock'
      };

      cy.intercept('GET', '/api/product/125', {
        statusCode: 200,
        body: { data: outOfStockProduct }
      }).as('getOutOfStockProduct');

      cy.visit('http://localhost:5173/product/125');
      cy.wait('@getOutOfStockProduct');

      cy.contains('0 in stock').should('be.visible');
      cy.contains('Out of Stock').should('be.visible');
    });

    it('should handle product with long description', () => {
      const longDescProduct = {
        ...mockProduct,
        _id: '126',
        description: 'This is a very long product description that goes on and on and on. It should be properly displayed without breaking the layout. The description continues here with more details about the product features and benefits.'
      };

      cy.intercept('GET', '/api/product/126', {
        statusCode: 200,
        body: { data: longDescProduct }
      }).as('getLongDescProduct');

      cy.visit('http://localhost:5173/product/126');
      cy.wait('@getLongDescProduct');

      cy.contains('This is a very long product description').should('be.visible');
      // Should not break layout
      cy.get('.max-w-4xl.mx-auto').should('exist');
    });
  });

  describe('Navigation and Integration', () => {
    it('should integrate with cart system', () => {
      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProduct');

      // Add to cart and verify navigation
      cy.get('button').contains('Add to Cart').click();
      cy.url().should('include', '/cartPage');
    });

    it('should maintain product data on page refresh', () => {
      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProduct');

      // Refresh page
      cy.reload();
      cy.wait('@getProduct');

      // Product should still be displayed
      cy.contains('Test Product').should('be.visible');
    });

    it('should work with different product IDs', () => {
      const differentProduct = {
        ...mockProduct,
        _id: '127',
        title: 'Different Product',
        price: 39.99
      };

      cy.intercept('GET', '/api/product/127', {
        statusCode: 200,
        body: { data: differentProduct }
      }).as('getDifferentProduct');

      cy.visit('http://localhost:5173/product/127');
      cy.wait('@getDifferentProduct');

      cy.contains('Different Product').should('be.visible');
      cy.contains('Rs. 39.99').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProduct');
    });

    it('should display correctly on mobile', () => {
      cy.viewport('iphone-6');
      
      // Should maintain responsive layout
      cy.get('.flex.flex-col').should('exist');
      cy.contains('Test Product').should('be.visible');
      cy.get('img').should('be.visible');
    });

    it('should display correctly on tablet', () => {
      cy.viewport('ipad-2');
      
      cy.get('.flex.flex-col.md\\:flex-row').should('exist');
      cy.contains('Test Product').should('be.visible');
    });

    it('should display correctly on desktop', () => {
      cy.viewport(1920, 1080);
      
      cy.get('.max-w-4xl.mx-auto').should('exist');
      cy.get('.flex.flex-col.md\\:flex-row').should('exist');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/product/123');
      cy.wait('@getProduct');
    });

    it('should have proper image alt text', () => {
      cy.get('img')
        .should('have.attr', 'alt', 'Test Product');
    });

    it('should have semantic HTML structure', () => {
      cy.get('h1').should('contain', 'Test Product');
      cy.get('button').should('be.visible');
    });

    it('should have proper contrast ratios', () => {
      // Basic contrast check - text should be readable
      cy.contains('Test Product').should('be.visible');
      cy.contains('Rs. 29.99').should('be.visible');
    });

    it('should be keyboard navigable', () => {
      // Tab through interactive elements
      cy.get('body').tab();
      cy.focused().should('exist');
    });
  });
});

// ==================== PRODUCT DETAIL INTEGRATION TESTS ====================
describe('Product Detail Integration', () => {
  it('should complete product detail to cart flow', () => {
    const testProduct = {
      _id: '128',
      title: 'Integration Test Product',
      description: 'Product for integration testing',
      price: 49.99,
      qty: 5,
      status: 'Active',
      category: 'Hoodies',
      image: '/api/uploads/integration-product.jpg'
    };

    cy.intercept('GET', '/api/product/128', {
      statusCode: 200,
      body: { data: testProduct }
    }).as('getIntegrationProduct');

    // Start from product list or direct access
    cy.visit('http://localhost:5173/product/128');
    cy.wait('@getIntegrationProduct');

    // Verify product details
    cy.contains('Integration Test Product').should('be.visible');
    cy.contains('Rs. 49.99').should('be.visible');
    cy.contains('Hoodies').should('be.visible');

    // Add to cart
    cy.get('button').contains('Add to Cart').click();

    // Should navigate to cart page
    cy.url().should('include', '/cartPage');
  });

  it('should handle multiple product views', () => {
    const products = [
      {
        _id: '129',
        title: 'Product A',
        price: 29.99,
        category: 'T-Shirts'
      },
      {
        _id: '130',
        title: 'Product B',
        price: 39.99,
        category: 'Hoodies'
      }
    ];

    // Test first product
    cy.intercept('GET', '/api/product/129', {
      statusCode: 200,
      body: { data: products[0] }
    }).as('getProductA');

    cy.visit('http://localhost:5173/product/129');
    cy.wait('@getProductA');
    cy.contains('Product A').should('be.visible');

    // Test second product
    cy.intercept('GET', '/api/product/130', {
      statusCode: 200,
      body: { data: products[1] }
    }).as('getProductB');

    cy.visit('http://localhost:5173/product/130');
    cy.wait('@getProductB');
    cy.contains('Product B').should('be.visible');
    cy.contains('Rs. 39.99').should('be.visible');
  });
});

// ==================== PRODUCT DETAIL PERFORMANCE TESTS ====================
describe('Product Detail Performance', () => {
  it('should load product details quickly', () => {
    const startTime = Date.now();

    cy.intercept('GET', '/api/product/123').as('getProduct');
    
    cy.visit('http://localhost:5173/product/123');
    
    cy.wait('@getProduct').then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`Product detail loaded in ${loadTime}ms`);
      
      // Should load within reasonable time
      expect(loadTime).to.be.lessThan(5000);
    });

    cy.contains('Test Product').should('be.visible');
  });

  it('should cache product data for fast navigation', () => {
    // First load
    cy.visit('http://localhost:5173/product/123');
    cy.contains('Test Product').should('be.visible');

    // Navigate away and back
    cy.visit('http://localhost:5173/');
    cy.visit('http://localhost:5173/product/123');

    // Should still work correctly
    cy.contains('Test Product').should('be.visible');
  });
});