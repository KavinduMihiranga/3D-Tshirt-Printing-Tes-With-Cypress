describe('🧪 Product Management Suite', () => {
  beforeEach(() => {
    // Set auth token
    cy.window().then((win) => {
      win.localStorage.setItem('adminToken', 'test-token-123');
    });
  });

  describe('📊 Product Dashboard', () => {
    beforeEach(() => {
      // Mock the EXACT endpoint your app calls
      cy.intercept('GET', '**/api/product**', {
        statusCode: 200,
        body: {
          data: [
            {
              _id: '1',
              name: 'Classic T-Shirt',
              category: 'Clothing',
              price: 1999,
              qty: 50,
              status: 'in stock'
            },
            {
              _id: '2',
              name: 'Coffee Mug',
              category: 'Accessories', 
              price: 899,
              qty: 25,
              status: 'in stock'
            }
          ]
        }
      }).as('getProducts');

      cy.visit('/productDashboard');
      cy.wait('@getProducts');
    });

    it('should display dashboard with products', () => {
      cy.contains('Product Management').should('be.visible');
      cy.contains('Classic T-Shirt').should('be.visible');
      cy.contains('Coffee Mug').should('be.visible');
      cy.get('table tbody tr').should('have.length', 2);
    });

    // it('should navigate to product detail page', () => {
    //   // Mock the specific product detail endpoint
    //   cy.intercept('GET', '**/api/product/1**', {
    //     statusCode: 200,
    //     body: {
    //       data: {
    //         _id: '1',
    //         name: 'Classic T-Shirt',
    //         category: 'Clothing',
    //         price: 1999,
    //         qty: 50,
    //         status: 'in stock'
    //       }
    //     }
    //   }).as('getProductDetail');

    //   // Click on View button for the first product
    //   cy.get('table tbody tr').first().within(() => {
    //     cy.contains('View').click();
    //   });
      
    //   cy.wait('@getProductDetail');
    //   cy.url().should('include', '/product/1');
    // });
  });

  describe('🔍 Product Details', () => {
    it('should display product details correctly', () => {
      // Mock the EXACT endpoint with proper response
      cy.intercept('GET', '**/api/product/123**', {
        statusCode: 200,
        body: {
          data: {
            _id: '123',
            name: 'Test Product',
            title: 'Test Product Title',
            description: 'Test product description for testing',
            category: 'Test Category',
            price: 2999,
            qty: 15,
            status: 'in stock',
            image: '/api/uploads/test-image.jpg'
          }
        }
      }).as('getProduct');

      cy.visit('/product/123');
      cy.wait('@getProduct');
      
      // Verify the product details
      cy.contains('Test Product').should('be.visible');
      cy.contains('Test Category').should('be.visible');
      cy.contains('in stock').should('be.visible');
    });

    // it('should handle product not found', () => {
    //   const invalidId = '999';
      
    //   // Mock 404 with the EXACT endpoint
    //   cy.intercept('GET', `**/api/product/${invalidId}**`, {
    //     statusCode: 404,
    //     body: { message: 'Product not found' }
    //   }).as('notFound');

    //   cy.visit(`/product/${invalidId}`);
    //   cy.wait('@notFound');

    //   cy.contains('Product not found').should('be.visible');
    // });
  });

  describe('➕ Add/Edit Products', () => {
    it('should submit new product successfully', () => {
      // Mock create product endpoint
      cy.intercept('POST', '**/api/product**', {
        statusCode: 201,
        body: {
          message: 'Product created successfully',
          data: { _id: 'new-123' }
        }
      }).as('createProduct');

      cy.visit('/addProduct');
      
      // Fill the form
      cy.get('input[name="name"]').type('New Test Product');
      cy.get('input[name="category"]').type('Test Category');
      cy.get('textarea[name="description"]').type('Test description');
      cy.get('input[name="price"]').type('1000');
      cy.get('input[name="qty"]').type('10');
      cy.get('input[name="status"]').type('in stock');

      // Submit form
      cy.get('button[type="submit"]').click();
      
      cy.wait('@createProduct');
      cy.url().should('include', '/productDashboard');
    });

    // it('should edit existing product', () => {
    //   // Mock getting existing product - use the EXACT endpoint from your logs
    //   cy.intercept('GET', '**/api/product/1**', {
    //     statusCode: 200,
    //     body: {
    //       data: {
    //         _id: '1',
    //         name: 'Existing Product',
    //         category: 'Clothing',
    //         price: 1999,
    //         qty: 50,
    //         status: 'in stock'
    //       }
    //     }
    //   }).as('getProduct');

    //   // Mock update endpoint - use the EXACT endpoint from your logs
    //   cy.intercept('PUT', '**/api/product/1**', {
    //     statusCode: 200,
    //     body: {
    //       message: 'Product updated successfully'
    //     }
    //   }).as('updateProduct');

    //   cy.visit('/addProduct/1');
    //   cy.wait('@getProduct');

    //   // Update the product name
    //   cy.get('input[name="name"]').clear().type('Updated Product Name');
    //   cy.get('button:contains("Update")').click();
      
    //   cy.wait('@updateProduct');
    //   cy.url().should('include', '/productDashboard');
    // });

    it('should handle edit form validation', () => {
      // Mock getting existing product
      cy.intercept('GET', '**/api/product/1**', {
        statusCode: 200,
        body: {
          data: {
            _id: '1',
            name: 'Existing Product',
            category: 'Clothing',
            price: 1999,
            qty: 50,
            status: 'in stock'
          }
        }
      }).as('getProduct');

      cy.visit('/addProduct/1');
      cy.wait('@getProduct');

      // Try to submit with empty required fields
      cy.get('input[name="name"]').clear();
      cy.get('button:contains("Update")').click();
      
      // Should stay on the same page due to validation
      cy.url().should('include', '/addProduct/1');
    });
  });

  describe('🗑️ Delete Operations', () => {
    beforeEach(() => {
      // Mock products list
      cy.intercept('GET', '**/api/product**', {
        statusCode: 200,
        body: {
          data: [
            {
              _id: '1',
              name: 'Product to Delete',
              category: 'Test',
              price: 1000,
              qty: 10,
              status: 'in stock'
            }
          ]
        }
      }).as('getProducts');

      cy.visit('/productDashboard');
      cy.wait('@getProducts');
    });

    // it('should delete product with confirmation', () => {
    //   // Mock delete endpoint
    //   cy.intercept('DELETE', '**/api/product/1**', {
    //     statusCode: 200,
    //     body: { message: 'Product deleted successfully' }
    //   }).as('deleteProduct');

    //   // Mock updated products list after deletion
    //   cy.intercept('GET', '**/api/product**', {
    //     statusCode: 200,
    //     body: { data: [] }
    //   }).as('getEmptyProducts');

    //   // Stub confirmation dialog
    //   cy.window().then((win) => {
    //     cy.stub(win, 'confirm').returns(true);
    //     cy.stub(win, 'alert').as('alertStub');
    //   });

    //   // Click delete button
    //   cy.contains('tr', 'Product to Delete').within(() => {
    //     cy.contains('Delete').click();
    //   });

    //   cy.wait('@deleteProduct');
    //   cy.get('@alertStub').should('be.calledWith', 'Product deleted successfully!');
    //   cy.contains('No products available').should('be.visible');
    // });

    it('should cancel delete when user declines', () => {
      // Stub confirmation to return false
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false);
      });

      // Click delete button
      cy.contains('tr', 'Product to Delete').within(() => {
        cy.contains('Delete').click();
      });

      // Product should still be visible
      cy.contains('Product to Delete').should('be.visible');
    });
  });

  describe('🔍 Search & Filter', () => {
    beforeEach(() => {
      // Mock products with different categories
      cy.intercept('GET', '**/api/product**', {
        statusCode: 200,
        body: {
          data: [
            {
              _id: '1',
              name: 'Red T-Shirt',
              category: 'Clothing',
              price: 1999,
              qty: 50,
              status: 'in stock'
            },
            {
              _id: '2',
              name: 'Coffee Mug',
              category: 'Accessories',
              price: 899,
              qty: 25,
              status: 'in stock'
            },
            {
              _id: '3',
              name: 'Blue T-Shirt',
              category: 'Clothing',
              price: 1799,
              qty: 30,
              status: 'in stock'
            }
          ]
        }
      }).as('getProducts');

      cy.visit('/productDashboard');
      cy.wait('@getProducts');
    });

    // it('should filter products by search term', () => {
    //   cy.get('input[placeholder*="Search"]').type('Coffee');
      
    //   cy.contains('Coffee Mug').should('be.visible');
    //   cy.contains('Red T-Shirt').should('not.exist');
    //   cy.contains('Blue T-Shirt').should('not.exist');
      
    //   // Clear search
    //   cy.get('input[placeholder*="Search"]').clear();
    //   cy.contains('Red T-Shirt').should('be.visible');
    // });

    // it('should show no results message for non-matching search', () => {
    //   cy.get('input[placeholder*="Search"]').type('Nonexistent Product');
    //   cy.contains('No matching product found').should('be.visible');
    // });
  });
});