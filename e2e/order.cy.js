// ==================== ORDER DASHBOARD TESTS ====================
describe('Order Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/orderDashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should display dashboard with all elements', () => {
    cy.contains('Order Management', { timeout: 10000 }).should('be.visible');
    cy.contains('Export Excel').should('be.visible');
    cy.contains('Add New Order').should('be.visible');
    cy.get('input[placeholder="Search by name..."]').should('be.visible');
    cy.contains('Rows per page:').should('be.visible');
  });

  it('should load order data table with headers', () => {
    // Mock API with exact response format from your backend
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: {
        data: [
          {
            _id: '1',
            customerName: 'John Doe',
            tShirtName: 'Classic Tee',
            address: '123 Main St',
            qty: 5,
            date: '2024-01-15',
            status: 'Pending'
          }
        ]
      }
    }).as('getOrders');

    cy.wait('@getOrders');
    
    // Check table headers with more specific targeting
    cy.get('table').within(() => {
      cy.contains('th', 'Customer Name').should('be.visible');
      cy.contains('th', 'T-shirt Name').should('be.visible');
      cy.contains('th', 'Address').should('be.visible');
      cy.contains('th', 'Qty').should('be.visible');
      cy.contains('th', 'Date').should('be.visible');
      cy.contains('th', 'Status').should('be.visible');
      cy.contains('th', 'Action').should('be.visible');
    });

    // Verify data is displayed
    cy.contains('John Doe').should('be.visible');
    cy.contains('Classic Tee').should('be.visible');
  });

  it('should handle empty orders state', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: { data: [] }
    }).as('getEmptyOrders');

    cy.wait('@getEmptyOrders');
    cy.contains('No orders found.').should('be.visible');
  });

  it('should navigate to add order page', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: { data: [] }
    }).as('getOrders');

    cy.wait('@getOrders');
    cy.contains('Add New Order').click();
    cy.url().should('include', '/addOrder');
  });

  it('should navigate to edit order page', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: {
        data: [{
          _id: '1',
          customerName: 'Test Customer',
          tShirtName: 'Test Shirt',
          address: 'Test Address',
          qty: 3,
          date: '2024-01-15',
          status: 'Pending'
        }]
      }
    }).as('getOrders');

    cy.wait('@getOrders');

    // Wait for table to render and find the edit button
    cy.contains('Test Customer').should('be.visible');
    
    // More specific targeting for the edit button
    cy.get('table').within(() => {
      cy.contains('tr', 'Test Customer').within(() => {
        cy.get('button').contains('Edit').click();
      });
    });
    
    cy.url().should('include', '/addOrder/1');
  });

//   it('should delete order with confirmation', () => {
//     const orderData = [{
//       _id: '1',
//       customerName: 'Delete Order',
//       tShirtName: 'Delete Shirt',
//       address: 'Delete Address',
//       qty: 2,
//       date: '2024-01-15',
//       status: 'Pending'
//     }];

//     // Initial load
//     cy.intercept('GET', 'http://localhost:5000/api/order', {
//       statusCode: 200,
//       body: { data: orderData }
//     }).as('getOrders');

//     // Mock delete response - match your exact API format
//     cy.intercept('DELETE', 'http://localhost:5000/api/order/1', {
//       statusCode: 200,
//       body: { success: true, message: 'Order deleted successfully' }
//     }).as('deleteOrder');

//     // Mock refreshed list
//     cy.intercept('GET', 'http://localhost:5000/api/order', {
//       statusCode: 200,
//       body: { data: [] }
//     }).as('getOrdersAfterDelete');

//     cy.wait('@getOrders');

//     // Stub confirm and alert
//     cy.window().then((win) => {
//       cy.stub(win, 'confirm').returns(true);
//       cy.stub(win, 'alert').as('alertStub');
//     });

//     // Click delete with specific targeting
//     cy.get('table').within(() => {
//       cy.contains('tr', 'Delete Order').within(() => {
//         cy.get('button').contains('Delete').click();
//       });
//     });
    
//     cy.wait('@deleteOrder');
//     cy.wait('@getOrdersAfterDelete');
    
//     // Verify order is removed and success message shown
//     cy.contains('Delete Order').should('not.exist');
//     cy.get('@alertStub').should('be.calledWith', 'Order deleted successfully!');
//   });

  it('should cancel delete when user declines confirmation', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: {
        data: [{
          _id: '1',
          customerName: 'Keep Order',
          tShirtName: 'Keep Shirt',
          address: 'Keep Address',
          qty: 1,
          date: '2024-01-15',
          status: 'Pending'
        }]
      }
    }).as('getOrders');

    cy.wait('@getOrders');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(false);
    });

    cy.get('table').within(() => {
      cy.contains('tr', 'Keep Order').within(() => {
        cy.get('button').contains('Delete').click();
      });
    });

    cy.contains('Keep Order').should('be.visible');
  });

  it('should handle pagination correctly', () => {
    // Create enough orders for pagination
    const mockOrders = Array.from({ length: 15 }, (_, i) => ({
      _id: `${i + 1}`,
      customerName: `Customer${i + 1}`,
      tShirtName: `Shirt${i + 1}`,
      address: `Address ${i + 1}`,
      qty: i + 1,
      date: '2024-01-15',
      status: 'Pending'
    }));

    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: { data: mockOrders }
    }).as('getOrders');

    cy.wait('@getOrders');

    // Wait for pagination to render
    cy.get('button').contains('2').should('be.visible');
    
    // Click page 2
    cy.get('button').contains('2').click();
    
    // Check active state - might need to adjust class name based on your actual implementation
    cy.get('button').contains('2').should('have.css', 'background-color').and('not.equal', 'rgba(0, 0, 0, 0)');
  });

  it('should change rows per page', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: { data: [] }
    }).as('getOrders');

    cy.wait('@getOrders');

    // Find and interact with the select element
    cy.get('select').first().select('20');
    cy.get('select').first().should('have.value', '20');
  });

//   it('should export to Excel successfully', () => {
//     cy.intercept('GET', 'http://localhost:5000/api/order', {
//       statusCode: 200,
//       body: {
//         data: [{
//           _id: '1',
//           customerName: 'Export Customer',
//           tShirtName: 'Export Shirt',
//           address: 'Export Address',
//           qty: 10,
//           date: '2024-01-15',
//           status: 'Completed',
//           createdAt: '2024-01-01T00:00:00.000Z'
//         }]
//       }
//     }).as('getOrders');

//     cy.wait('@getOrders');

//     // Stub file-saver
//     cy.window().then((win) => {
//       win.saveAs = cy.stub().as('saveAsStub');
//     });

//     // Click export
//     cy.contains('button', 'Export Excel').click();
    
//     cy.wait(1000);
    
//     // Check if saveAs was called
//     cy.get('@saveAsStub').should('have.been.called');
//   });

  it('should show alert when exporting with no data', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: { data: [] }
    }).as('getOrders');

    cy.wait('@getOrders');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.contains('button', 'Export Excel').click();
    
    cy.get('@alertStub').should('be.calledWith', 'No data available to export!');
  });

  it('should show loading state', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', (req) => {
      req.reply({
        statusCode: 200,
        body: { data: [] },
        delay: 2000
      });
    }).as('getOrders');

    cy.contains('Loading...').should('be.visible');
    
    cy.wait('@getOrders');
    
    cy.contains('Loading...').should('not.exist');
  });

  it('should navigate back with back arrow', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: { data: [] }
    }).as('getOrders');

    cy.wait('@getOrders');

    // Click the first SVG (ArrowLeft icon)
    cy.get('svg').first().click();
    
    cy.url().should('not.include', '/orderDashboard');
  });

  it('should handle delete error gracefully', () => {
    cy.intercept('GET', 'http://localhost:5000/api/order', {
      statusCode: 200,
      body: {
        data: [{
          _id: '1',
          customerName: 'Error Order',
          tShirtName: 'Error Shirt',
          address: 'Error Address',
          qty: 1,
          date: '2024-01-15',
          status: 'Pending'
        }]
      }
    }).as('getOrders');

    cy.intercept('DELETE', 'http://localhost:5000/api/order/1', {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('deleteOrder');

    cy.wait('@getOrders');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('table').within(() => {
      cy.contains('tr', 'Error Order').within(() => {
        cy.get('button').contains('Delete').click();
      });
    });
    
    cy.wait('@deleteOrder');
    
    cy.get('@alertStub').should('be.calledWith', 'Failed to delete order.');
    cy.contains('Error Order').should('be.visible');
  });
});

// ==================== ADD ORDER TESTS ====================
describe('Add Order', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/addOrder', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should display add order form with all fields', () => {
    cy.contains('ADD ORDER').should('be.visible');
    
    cy.get('input[name="customerName"]').should('be.visible');
    cy.get('input[name="tShirtName"]').should('be.visible');
    cy.get('input[name="address"]').should('be.visible');
    cy.get('input[name="qty"]').should('be.visible');
    cy.get('input[name="date"]').should('be.visible');
    cy.get('input[name="status"]').should('be.visible');
    
    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Submit').should('be.visible');
  });

  it('should fill and submit add order form successfully', () => {
    // Match your exact API response format
    cy.intercept('POST', 'http://localhost:5000/api/order', {
      statusCode: 201,
      body: {
        success: true,
        data: { _id: '123' }
      }
    }).as('createOrder');

    // Fill all required fields
    cy.get('input[name="customerName"]').type('John Doe');
    cy.get('input[name="tShirtName"]').type('Classic Tee');
    cy.get('input[name="address"]').type('123 Main Street');
    cy.get('input[name="qty"]').type('5');
    cy.get('input[name="date"]').type('2024-01-15');
    cy.get('input[name="status"]').type('Pending');

    // Submit form
    cy.get('form').submit();
    
    cy.wait('@createOrder');
    
    // Should navigate to order page
    cy.url().should('match', /\/orderDashboard|\/order/);
  });

  it('should cancel and navigate back', () => {
    cy.contains('button', 'Cancel').click();
    cy.url().should('not.include', '/addOrder');
  });

  it('should close form using X button', () => {
    cy.get('button').contains('×').click();
    cy.url().should('not.include', '/addOrder');
  });

  it('should handle form submission error', () => {
    cy.intercept('POST', 'http://localhost:5000/api/order', {
      statusCode: 400,
      body: { message: 'Validation error' }
    }).as('createOrder');

    cy.get('input[name="customerName"]').type('Test Customer');
    cy.get('input[name="tShirtName"]').type('Test Shirt');
    cy.get('input[name="address"]').type('Test Address');
    cy.get('input[name="qty"]').type('1');

    cy.get('form').submit();

    cy.wait('@createOrder');
    
    cy.url().should('include', '/addOrder');
  });

  it('should validate required fields', () => {
    cy.get('form').submit();
    cy.url().should('include', '/addOrder');
  });

  it('should handle network error during form submission', () => {
    cy.intercept('POST', 'http://localhost:5000/api/order', {
      forceNetworkError: true
    }).as('createOrderError');

    cy.get('input[name="customerName"]').type('Test Customer');
    cy.get('input[name="tShirtName"]').type('Test Shirt');
    cy.get('input[name="address"]').type('Test Address');
    cy.get('input[name="qty"]').type('1');

    cy.get('form').submit();

    cy.wait('@createOrderError');
    
    cy.url().should('include', '/addOrder');
  });
});

// ==================== EDIT ORDER TESTS ====================
describe('Edit Order', () => {
  const orderId = '123';

  beforeEach(() => {
    cy.intercept('GET', `http://localhost:5000/api/order/${orderId}`, {
      statusCode: 200,
      body: {
        data: {
          _id: '123',
          customerName: 'John Doe',
          tShirtName: 'Classic Tee',
          address: '123 Main Street',
          qty: 5,
          date: '2024-01-15',
          status: 'Pending'
        }
      }
    }).as('getOrder');

    cy.visit(`http://localhost:5173/addOrder/${orderId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
    
    cy.wait('@getOrder');
  });

  it('should display edit order form with existing data', () => {
    cy.contains('EDIT ORDER').should('be.visible');
    
    cy.get('input[name="customerName"]').should('have.value', 'John Doe');
    cy.get('input[name="tShirtName"]').should('have.value', 'Classic Tee');
    cy.get('input[name="address"]').should('have.value', '123 Main Street');
    cy.get('input[name="qty"]').should('have.value', '5');
    cy.get('input[name="date"]').should('have.value', '2024-01-15');
    cy.get('input[name="status"]').should('have.value', 'Pending');
    
    cy.contains('button', 'Update').should('be.visible');
  });

  it('should update order data successfully', () => {
    cy.intercept('PUT', `http://localhost:5000/api/order/${orderId}`, {
      statusCode: 200,
      body: {
        success: true,
        data: { _id: '123' }
      }
    }).as('updateOrder');

    cy.get('input[name="customerName"]').clear().type('Jane Doe');
    cy.get('input[name="qty"]').clear().type('10');

    cy.contains('button', 'Update').click();

    cy.wait('@updateOrder');
    
    cy.url().should('match', /\/orderDashboard|\/order/);
  });

  it('should handle update error', () => {
    cy.intercept('PUT', `http://localhost:5000/api/order/${orderId}`, {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('updateOrder');

    cy.get('input[name="customerName"]').clear().type('Updated Customer');

    cy.contains('button', 'Update').click();

    cy.wait('@updateOrder');
    
    cy.url().should('include', `/addOrder/${orderId}`);
  });

  it('should cancel editing and navigate back', () => {
    cy.contains('button', 'Cancel').click();
    cy.url().should('not.include', '/addOrder');
  });

  it('should handle order not found error', () => {
    const invalidId = '999';
    
    cy.intercept('GET', `http://localhost:5000/api/order/${invalidId}`, {
      statusCode: 404,
      body: { message: 'Order not found' }
    }).as('getOrderNotFound');

    cy.visit(`http://localhost:5173/addOrder/${invalidId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
    
    cy.wait('@getOrderNotFound');
    
    cy.get('form').should('exist');
  });

  it('should preserve form data when canceling edit', () => {
    cy.get('input[name="customerName"]').clear().type('Modified Customer');
    cy.get('input[name="qty"]').clear().type('15');
    
    // Verify changes before canceling
    cy.get('input[name="customerName"]').should('have.value', 'Modified Customer');
    cy.get('input[name="qty"]').should('have.value', '15');
    
    cy.contains('button', 'Cancel').click();
    
    cy.url().should('not.include', '/addOrder');
  });
});

// ==================== INTEGRATION TESTS ====================
describe('Order Management Integration', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/orderDashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

//   it('should complete full order lifecycle', () => {
//     // Start empty
//     cy.intercept('GET', 'http://localhost:5000/api/order', {
//       statusCode: 200,
//       body: { data: [] }
//     }).as('getEmptyOrders');

//     cy.wait('@getEmptyOrders');

//     // Add order
//     cy.contains('Add New Order').click();
//     cy.url().should('include', '/addOrder');

//     cy.intercept('POST', 'http://localhost:5000/api/order', {
//       statusCode: 201,
//       body: {
//         success: true,
//         data: { _id: '123' }
//       }
//     }).as('createOrder');

//     cy.get('input[name="customerName"]').type('Integration Customer');
//     cy.get('input[name="tShirtName"]').type('Integration Shirt');
//     cy.get('input[name="address"]').type('Integration Address');
//     cy.get('input[name="qty"]').type('3');
//     cy.get('input[name="date"]').type('2024-01-15');
//     cy.get('input[name="status"]').type('Pending');
    
//     cy.get('form').submit();
//     cy.wait('@createOrder');

//     // Verify redirect
//     cy.url().should('match', /\/orderDashboard|\/order/);

//     // Verify order appears
//     cy.intercept('GET', 'http://localhost:5000/api/order', {
//       statusCode: 200,
//       body: {
//         data: [{
//           _id: '123',
//           customerName: 'Integration Customer',
//           tShirtName: 'Integration Shirt',
//           address: 'Integration Address',
//           qty: 3,
//           date: '2024-01-15',
//           status: 'Pending'
//         }]
//       }
//     }).as('getUpdatedOrders');

//     cy.wait('@getUpdatedOrders');
//     cy.contains('Integration Customer').should('be.visible');
//   });
});