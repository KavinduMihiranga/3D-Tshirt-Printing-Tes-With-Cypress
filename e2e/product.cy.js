// ==================== PRODUCT DASHBOARD TESTS ====================
describe('Product Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/productDashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should display dashboard with all elements', () => {
    cy.contains('Product Management', { timeout: 10000 }).should('be.visible');
    cy.contains('Export Excel').should('be.visible');
    cy.contains('Add New Product').should('be.visible');
    cy.get('input[placeholder="Search products..."]').should('be.visible');
  });

  it('should load product data table with headers', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: {
        data: [
          {
            _id: '1',
            name: 'Classic T-Shirt',
            title: 'Classic T-Shirt',
            description: 'A comfortable classic t-shirt',
            category: 'Clothing',
            price: 1999,
            qty: 50,
            status: 'in stock',
            image: '/api/uploads/image1.jpg',
            createdAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }).as('getProducts');

    cy.wait('@getProducts');
    
    // Check table headers
    cy.contains('Product').should('be.visible');
    cy.contains('Description').should('be.visible');
    cy.contains('Category').should('be.visible');
    cy.contains('Price (LKR)').should('be.visible');
    cy.contains('Stock').should('be.visible');
    cy.contains('Status').should('be.visible');
    cy.contains('Actions').should('be.visible');

    // Verify data is displayed
    cy.contains('Classic T-Shirt').should('be.visible');
    cy.contains('Clothing').should('be.visible');
    cy.contains('1,999').should('be.visible');
    cy.contains('50').should('be.visible');
    cy.contains('in stock').should('be.visible');
  });

  it('should handle empty products state', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: { data: [] }
    }).as('getEmptyProducts');

    cy.wait('@getEmptyProducts');
    cy.contains('No products available').should('be.visible');
  });

  it('should search products by name or category', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: {
        data: [
          {
            _id: '1',
            name: 'Classic T-Shirt',
            title: 'Classic T-Shirt',
            description: 'Comfortable cotton t-shirt',
            category: 'Clothing',
            price: 1999,
            qty: 50,
            status: 'in stock'
          },
          {
            _id: '2',
            name: 'Coffee Mug',
            title: 'Coffee Mug',
            description: 'Ceramic coffee mug',
            category: 'Accessories',
            price: 899,
            qty: 25,
            status: 'in stock'
          }
        ]
      }
    }).as('getProducts');

    cy.wait('@getProducts');

    // Search for "Coffee"
    cy.get('input[placeholder="Search products..."]').type('Coffee');
    
    // Should show only matching product
    cy.contains('Coffee Mug').should('be.visible');
    cy.contains('Classic T-Shirt').should('not.exist');

    // Clear search
    cy.get('input[placeholder="Search products..."]').clear();
    
    // Both should be visible again
    cy.contains('Coffee Mug').should('be.visible');
    cy.contains('Classic T-Shirt').should('be.visible');
  });

  it('should navigate to add product page', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: { data: [] }
    }).as('getProducts');

    cy.contains('Add New Product').click();
    cy.url().should('include', '/addProduct');
  });

  it('should navigate to edit product page', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: {
        data: [{
          _id: '1',
          name: 'Test Product',
          title: 'Test Product',
          description: 'Test Description',
          category: 'Test Category',
          price: 1000,
          qty: 10,
          status: 'in stock'
        }]
      }
    }).as('getProducts');

    cy.wait('@getProducts');

    // Click on edit button
    cy.contains('tr', 'Test Product').within(() => {
      cy.contains('Edit').click();
    });
    
    cy.url().should('include', '/addProduct/1');
  });

  it('should navigate to product detail page', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: {
        data: [{
          _id: '1',
          name: 'Test Product',
          title: 'Test Product',
          description: 'Test Description',
          category: 'Test Category',
          price: 1000,
          qty: 10,
          status: 'in stock'
        }]
      }
    }).as('getProducts');

    cy.wait('@getProducts');

    // Click on product name to view details
    cy.contains('button', 'Test Product').click();
    cy.url().should('include', '/product/1');
  });

//   it('should delete product with confirmation', () => {
//     const productData = [{
//       _id: '1',
//       name: 'Delete Product',
//       title: 'Delete Product',
//       description: 'Product to delete',
//       category: 'Test',
//       price: 1000,
//       qty: 10,
//       status: 'in stock'
//     }];

//     // Initial load with product
//     cy.intercept('GET', '/api/product', {
//       statusCode: 200,
//       body: { data: productData }
//     }).as('getProducts');

//     // Mock delete response
//     cy.intercept('DELETE', '/api/product/1', {
//       statusCode: 200,
//       body: { message: 'Product deleted successfully' }
//     }).as('deleteProduct');

//     // Mock refreshed list after delete
//     cy.intercept('GET', '/api/product', {
//       statusCode: 200,
//       body: { data: [] }
//     }).as('getProductsAfterDelete');

//     cy.wait('@getProducts');

//     // Stub window.confirm to return true
//     cy.window().then((win) => {
//       cy.stub(win, 'confirm').returns(true);
//     });

//     // Stub alert
//     cy.window().then((win) => {
//       cy.stub(win, 'alert').as('alertStub');
//     });

//     // Click delete button
//     cy.contains('tr', 'Delete Product').within(() => {
//       cy.contains('Delete').click();
//     });
    
//     cy.wait('@deleteProduct');
//     cy.wait('@getProductsAfterDelete');
    
//     // Verify product is removed and success message shown
//     cy.contains('Delete Product').should('not.exist');
//     cy.get('@alertStub').should('be.calledWith', 'Product deleted successfully!');
//   });

  it('should cancel delete when user declines confirmation', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: {
        data: [{
          _id: '1',
          name: 'Keep Product',
          title: 'Keep Product',
          description: 'Product to keep',
          category: 'Test',
          price: 1000,
          qty: 10,
          status: 'in stock'
        }]
      }
    }).as('getProducts');

    cy.wait('@getProducts');

    // Stub window.confirm to return false
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(false);
    });

    // Click delete button
    cy.contains('tr', 'Keep Product').within(() => {
      cy.contains('Delete').click();
    });

    // Product should still be visible
    cy.contains('Keep Product').should('be.visible');
  });

//   it('should export to Excel successfully', () => {
//     cy.intercept('GET', '/api/product', {
//       statusCode: 200,
//       body: {
//         data: [{
//           _id: '1',
//           name: 'Export Product',
//           title: 'Export Product',
//           description: 'Product for export',
//           category: 'Export',
//           price: 2500,
//           qty: 15,
//           status: 'in stock',
//           createdAt: '2024-01-01T00:00:00.000Z'
//         }]
//       }
//     }).as('getProducts');

//     cy.wait('@getProducts');

//     // Stub saveAs function
//     cy.window().then((win) => {
//       win.saveAs = cy.stub().as('saveAsStub');
//     });

//     // Click export button
//     cy.contains('Export Excel').click();
    
//     // Wait for export processing
//     cy.wait(1000);
    
//     // Verify saveAs was called
//     cy.get('@saveAsStub').should('have.been.calledOnce');
//   });

  it('should show alert when exporting with no data', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: { data: [] }
    }).as('getProducts');

    cy.wait('@getProducts');

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    // Click export button
    cy.contains('Export Excel').click();
    
    // Verify alert was called
    cy.get('@alertStub').should('be.calledWith', 'No data available to export!');
  });

  it('should show loading state', () => {
    // Delay API response to see loading state
    cy.intercept('GET', '/api/product', (req) => {
      req.reply({
        statusCode: 200,
        body: { data: [] },
        delay: 2000
      });
    }).as('getProducts');

    // Check loading state appears
    cy.contains('Loading products...').should('be.visible');
    
    // Wait for API call to complete
    cy.wait('@getProducts');
    
    // Loading should disappear
    cy.contains('Loading products...').should('not.exist');
  });

  it('should navigate back with back arrow', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: { data: [] }
    }).as('getProducts');

    cy.wait('@getProducts');

    // Click the ArrowLeft icon
    cy.get('svg').first().click();
    
    // Should navigate back
    cy.url().should('not.include', '/productDashboard');
  });

  it('should handle delete error gracefully', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: {
        data: [{
          _id: '1',
          name: 'Error Product',
          title: 'Error Product',
          description: 'Product with error',
          category: 'Test',
          price: 1000,
          qty: 10,
          status: 'in stock'
        }]
      }
    }).as('getProducts');

    cy.intercept('DELETE', '/api/product/1', {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('deleteProduct');

    cy.wait('@getProducts');

    // Stub window methods
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
      cy.stub(win, 'alert').as('alertStub');
    });

    // Click delete button
    cy.contains('tr', 'Error Product').within(() => {
      cy.contains('Delete').click();
    });
    
    cy.wait('@deleteProduct');
    
    // Verify error alert was shown
    cy.get('@alertStub').should('be.calledWith', 'Failed to delete product.');
    
    // Product should still be visible (delete failed)
    cy.contains('Error Product').should('be.visible');
  });
});

// ==================== ADD PRODUCT TESTS ====================
describe('Add Product', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/addProduct', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should display add product form with all fields', () => {
    cy.contains('ADD PRODUCT').should('be.visible');
    
    // Check all form fields
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="category"]').should('be.visible');
    cy.get('textarea[name="description"]').should('be.visible');
    cy.get('input[name="price"]').should('be.visible');
    cy.get('input[name="qty"]').should('be.visible');
    cy.get('input[name="status"]').should('be.visible');
    cy.get('input[name="image"]').should('be.visible');
    
    // Check buttons
    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Submit').should('be.visible');
  });

  it('should fill and submit add product form successfully', () => {
    // Mock the API response
    cy.intercept('POST', '/api/product', {
      statusCode: 201,
      body: {
        message: 'Product created successfully',
        data: { _id: '123' }
      }
    }).as('createProduct');

    // Fill form fields
    cy.get('input[name="name"]').type('New Product');
    cy.get('input[name="category"]').type('Electronics');
    cy.get('textarea[name="description"]').type('A great new product');
    cy.get('input[name="price"]').type('2999');
    cy.get('input[name="qty"]').type('50');
    cy.get('input[name="status"]').type('in stock');

    // Submit form
    cy.contains('button', 'Submit').click();

    cy.wait('@createProduct');
    
    // Should navigate to product dashboard
    cy.url().should('include', '/productDashboard');
  });

  it('should handle image upload and preview', () => {
    // Mock file upload
    cy.get('input[name="image"]').then((input) => {
      const file = new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input[0].files = dataTransfer.files;
      input[0].dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Should show image preview
    cy.get('img[alt="Preview"]').should('be.visible');
  });

  it('should cancel and navigate back', () => {
    cy.contains('button', 'Cancel').click();
    cy.url().should('not.include', '/addProduct');
  });

  it('should close form using X button', () => {
    cy.get('button').contains('×').click();
    cy.url().should('not.include', '/addProduct');
  });

//   it('should handle form submission error', () => {
//     cy.intercept('POST', '/api/product', {
//       statusCode: 400,
//       body: { message: 'Validation error' }
//     }).as('createProduct');

//     // Fill minimum required fields
//     cy.get('input[name="name"]').type('Test Product');
//     cy.get('input[name="category"]').type('Test Category');
//     cy.get('textarea[name="description"]').type('Test Description');
//     cy.get('input[name="price"]').type('1000');
//     cy.get('input[name="qty"]').type('10');

//     // Submit form
//     cy.contains('button', 'Submit').click();

//     cy.wait('@createProduct');
    
//     // Should stay on the same page (form submission failed)
//     cy.url().should('include', '/addProduct');
//   });

  it('should validate required fields', () => {
    // Try to submit empty form
    cy.contains('button', 'Submit').click();
    
    // Should stay on the same page
    cy.url().should('include', '/addProduct');
  });
});

// ==================== EDIT PRODUCT TESTS ====================
describe('Edit Product', () => {
  const productId = '123';

  beforeEach(() => {
    // Mock product data response
    cy.intercept('GET', `/api/product/${productId}`, {
      statusCode: 200,
      body: {
        data: {
          _id: '123',
          name: 'Existing Product',
          category: 'Electronics',
          description: 'Existing product description',
          price: 1999,
          qty: 25,
          status: 'in stock',
          image: '/api/uploads/existing-image.jpg'
        }
      }
    }).as('getProduct');

    cy.visit(`http://localhost:5173/addProduct/${productId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
    
    cy.wait('@getProduct');
  });

  it('should display edit product form with existing data', () => {
    // Check header shows EDIT mode
    cy.contains('EDIT PRODUCT').should('be.visible');
    
    // Verify form is populated with existing data
    cy.get('input[name="name"]').should('have.value', 'Existing Product');
    cy.get('input[name="category"]').should('have.value', 'Electronics');
    cy.get('textarea[name="description"]').should('have.value', 'Existing product description');
    cy.get('input[name="price"]').should('have.value', '1999');
    cy.get('input[name="qty"]').should('have.value', '25');
    cy.get('input[name="status"]').should('have.value', 'in stock');
    
    // Check submit button shows "Update"
    cy.contains('button', 'Update').should('be.visible');
  });

  it('should update product data successfully', () => {
    cy.intercept('PUT', `/api/product/${productId}`, {
      statusCode: 200,
      body: {
        message: 'Product updated successfully',
        data: { _id: '123' }
      }
    }).as('updateProduct');

    // Modify form fields
    cy.get('input[name="name"]').clear().type('Updated Product');
    cy.get('input[name="price"]').clear().type('2499');

    // Submit form
    cy.contains('button', 'Update').click();

    cy.wait('@updateProduct');
    
    // Should navigate to product dashboard
    cy.url().should('include', '/productDashboard');
  });

  it('should handle update error', () => {
    cy.intercept('PUT', `/api/product/${productId}`, {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('updateProduct');

    // Modify a field
    cy.get('input[name="name"]').clear().type('Updated Product Name');

    // Submit form
    cy.contains('button', 'Update').click();

    cy.wait('@updateProduct');
    
    // Should stay on the same page
    cy.url().should('include', `/addProduct/${productId}`);
  });

  it('should cancel editing and navigate back', () => {
    cy.contains('button', 'Cancel').click();
    cy.url().should('not.include', '/addProduct');
  });

  it('should handle product not found error', () => {
    const invalidId = '999';
    
    cy.intercept('GET', `/api/product/${invalidId}`, {
      statusCode: 404,
      body: { message: 'Product not found' }
    }).as('getProductNotFound');

    cy.visit(`http://localhost:5173/addProduct/${invalidId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
    
    cy.wait('@getProductNotFound');
    
    // Form should handle error state
    cy.get('form').should('exist');
  });
});

// ==================== PRODUCT DETAIL TESTS ====================
describe('Product Detail', () => {
  const productId = '123';

  beforeEach(() => {
    cy.intercept('GET', `/api/product/${productId}`, {
      statusCode: 200,
      body: {
        data: {
          _id: '123',
          name: 'Test Product',
          title: 'Test Product',
          description: 'Detailed product description',
          category: 'Electronics',
          price: 2999,
          qty: 15,
          status: 'in stock',
          image: '/api/uploads/test-image.jpg'
        }
      }
    }).as('getProduct');

    cy.visit(`http://localhost:5173/product/${productId}`);
    
    cy.wait('@getProduct');
  });

//   it('should display product details correctly', () => {
//     cy.contains('Test Product').should('be.visible');
//     cy.contains('Electronics').should('be.visible');
//     cy.contains('in stock').should('be.visible');
//     cy.contains('Rs. 2,999').should('be.visible');
//     cy.contains('15 in stock').should('be.visible');
//     cy.contains('Detailed product description').should('be.visible');
//   });

//   it('should display product image', () => {
//     cy.get('img').should('be.visible');
//     cy.get('img').should('have.attr', 'src').and('include', '/api/uploads/');
//   });

//   it('should navigate to cart when adding to cart', () => {
//     // Mock the cart context
//     cy.window().then((win) => {
//       win.addToCart = cy.stub().as('addToCartStub');
//     });

//     cy.contains('button', 'Add to Cart').click();
    
//     // Should call addToCart and navigate to cart
//     cy.get('@addToCartStub').should('have.been.calledOnce');
//     cy.url().should('include', '/cartPage');
//   });

  it('should handle product not found', () => {
    const invalidId = '999';
    
    cy.intercept('GET', `/api/product/${invalidId}`, {
      statusCode: 404
    }).as('getProductNotFound');

    cy.visit(`http://localhost:5173/product/${invalidId}`);
    
    cy.wait('@getProductNotFound');
    
    cy.contains('Product not found').should('be.visible');
  });
});

// ==================== INTEGRATION TESTS ====================
describe('Product Management Integration', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/productDashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should complete full product lifecycle', () => {
    // Start with empty list
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: { data: [] }
    }).as('getEmptyProducts');

    cy.wait('@getEmptyProducts');

    // Add product
    cy.contains('Add New Product').click();
    cy.url().should('include', '/addProduct');

    cy.intercept('POST', '/api/product', {
      statusCode: 201,
      body: {
        message: 'Product created successfully',
        data: { _id: '123' }
      }
    }).as('createProduct');

    // Fill form
    cy.get('input[name="name"]').type('Integration Test Product');
    cy.get('input[name="category"]').type('Integration Category');
    cy.get('textarea[name="description"]').type('Integration test product description');
    cy.get('input[name="price"]').type('1999');
    cy.get('input[name="qty"]').type('25');
    cy.get('input[name="status"]').type('in stock');
    
    cy.contains('button', 'Submit').click();
    cy.wait('@createProduct');

    // Verify redirect
    cy.url().should('include', '/productDashboard');

    // Verify product appears in list
    cy.intercept('GET', '/api/product', {
      statusCode: 200,
      body: {
        data: [{
          _id: '123',
          name: 'Integration Test Product',
          title: 'Integration Test Product',
          description: 'Integration test product description',
          category: 'Integration Category',
          price: 1999,
          qty: 25,
          status: 'in stock'
        }]
      }
    }).as('getUpdatedProducts');

    cy.wait('@getUpdatedProducts');
    cy.contains('Integration Test Product').should('be.visible');
  });
});

// ==================== ERROR HANDLING TESTS ====================
describe('Product Error Handling', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/productDashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should handle API server down gracefully', () => {
    cy.intercept('GET', '/api/product', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('getProductsError');

    cy.wait('@getProductsError');
    
    // Should handle error gracefully without crashing
    cy.get('body').should('exist');
    cy.get('table').should('exist');
  });

  it('should handle network errors', () => {
    cy.intercept('GET', '/api/product', {
      forceNetworkError: true
    }).as('getProductsNetworkError');

    cy.wait('@getProductsNetworkError');
    
    // Should handle network failure gracefully
    cy.get('body').should('exist');
    cy.get('table').should('exist');
  });
});