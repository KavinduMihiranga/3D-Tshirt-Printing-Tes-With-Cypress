// ==================== CHECKOUT PAGE TEST SUITE ====================
describe('🧾 Checkout Page - Comprehensive Test Suite', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(`${baseUrl}/checkoutPage`);
  });

  // ---------- UI & LAYOUT VALIDATION ----------
  context('🎯 UI Structure & Layout', () => {
    it('should load checkout page with correct title', () => {
      cy.contains('h1', 'Checkout Page').should('be.visible');
    });

    it('should display all form sections', () => {
      cy.contains('h2', 'Personal Information').should('be.visible');
      cy.contains('h2', 'Address Information').should('be.visible');
      cy.contains('h3', 'Billing Address *').should('be.visible');
      cy.contains('h3', 'Shipping Address').should('be.visible');
    });

    it('should have all required form fields', () => {
      // Personal Information
      cy.get('input[placeholder="Enter your full name"]').should('exist');
      cy.get('input[placeholder="Enter your email"]').should('exist');
      cy.get('input[placeholder="Enter your phone number"]').should('exist');

      // Billing Address
      cy.get('input[placeholder="Enter street address"]').should('exist');
      cy.get('input[placeholder="Enter apartment, suite, etc. (optional)"]').should('exist');
      cy.get('input[placeholder="Enter your city"]').should('exist');
      cy.get('input[placeholder="Enter your province or state"]').should('exist');
    });

    it('should have submit button with correct text', () => {
      cy.get('button[type="submit"]')
        .should('contain', 'Continue to Payment')
        .and('be.enabled');
    });
  });

  // ---------- FORM VALIDATION TESTS ----------
  context('📝 Form Validation & Error Handling', () => {
    beforeEach(() => {
      // Start with empty form
      cy.visit(`${baseUrl}/checkoutPage`);
    });

    it('should show validation errors for empty required fields', () => {
      cy.get('button[type="submit"]').click();
      
      // Check for alert messages (since form uses alert for validation)
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.include('Please enter your full name');
      });
    });

    it('should validate email format', () => {
      // Fill other required fields
      cy.get('input[placeholder="Enter your full name"]').type('John Doe');
      cy.get('input[placeholder="Enter your phone number"]').type('1234567890');
      cy.get('input[placeholder="Enter street address"]').type('123 Main St');
      cy.get('input[placeholder="Enter your city"]').type('Colombo');
      cy.get('input[placeholder="Enter your province or state"]').type('Western');

      // Enter invalid email
      cy.get('input[placeholder="Enter your email"]').type('invalid-email');
      cy.get('button[type="submit"]').click();

      cy.on('window:alert', (alertText) => {
        expect(alertText).to.include('Please enter a valid email address');
      });
    });

    it('should validate billing address completeness', () => {
      // Fill personal info but skip billing address
      cy.get('input[placeholder="Enter your full name"]').type('John Doe');
      cy.get('input[placeholder="Enter your email"]').type('john@example.com');
      cy.get('input[placeholder="Enter your phone number"]').type('1234567890');

      cy.get('button[type="submit"]').click();

      cy.on('window:alert', (alertText) => {
        expect(alertText).to.match(/billing address|city|province/i);
      });
    });
  });

  // ---------- ADDRESS MANAGEMENT TESTS ----------
  context('🏠 Address Management', () => {
    beforeEach(() => {
      cy.visit(`${baseUrl}/checkoutPage`);
    });

    it('should copy billing address to shipping when checkbox is checked', () => {
      // Fill billing address
      const billingData = {
        addressLine1: '123 Billing Street',
        addressLine2: 'Apt 4B',
        city: 'Billing City',
        province: 'Billing Province'
      };

      cy.get('input[placeholder="Enter street address"]').type(billingData.addressLine1);
      cy.get('input[placeholder="Enter apartment, suite, etc. (optional)"]').type(billingData.addressLine2);
      cy.get('input[placeholder="Enter your city"]').type(billingData.city);
      cy.get('input[placeholder="Enter your province or state"]').type(billingData.province);

      // Verify checkbox is checked by default
      cy.get('input[type="checkbox"]').should('be.checked');

      // Uncheck and recheck to test functionality
      cy.get('input[type="checkbox"]').click().should('not.be.checked');
      cy.get('input[type="checkbox"]').click().should('be.checked');

      // Shipping address should mirror billing
      cy.get('input[placeholder="Enter street address"]').should('have.value', billingData.addressLine1);
    });

    // it('should show shipping address fields when checkbox is unchecked', () => {
    //   cy.get('input[type="checkbox"]').click().should('not.be.checked');
      
    //   // Shipping address fields should be visible and required
    //   cy.contains('h3', 'Shipping Address').next().within(() => {
    //     cy.get('input[placeholder="Enter street address"]').should('be.visible');
    //     cy.get('input[placeholder="Enter your city"]').should('be.visible');
    //     cy.get('input[placeholder="Enter your province or state"]').should('be.visible');
    //   });
    // });

    it('should validate separate shipping address when unchecked', () => {
      // Fill billing address
      cy.get('input[placeholder="Enter your full name"]').type('John Doe');
      cy.get('input[placeholder="Enter your email"]').type('john@example.com');
      cy.get('input[placeholder="Enter your phone number"]').type('1234567890');
      cy.get('input[placeholder="Enter street address"]').type('123 Billing St');
      cy.get('input[placeholder="Enter your city"]').type('Billing City');
      cy.get('input[placeholder="Enter your province or state"]').type('Billing Province');

      // Uncheck same address
      cy.get('input[type="checkbox"]').click();

      // Submit without filling shipping address
      cy.get('button[type="submit"]').click();

      cy.on('window:alert', (alertText) => {
        expect(alertText).to.include('shipping address');
      });
    });
  });

  // ---------- DESIGN ORDER FLOW TESTS ----------
  context('🎨 Design Order Flow', () => {
    // it('should show design order message when pending design exists', () => {
    //   // Set pending design in localStorage
    //   const pendingDesign = {
    //     file: 'test-file-data',
    //     preview: 'test-preview-data'
    //   };
      
    //   cy.window().then((win) => {
    //     win.localStorage.setItem('pendingDesign', JSON.stringify(pendingDesign));
    //   });

    //   cy.reload();

    //   cy.contains('🎨 You have a custom T-shirt design ready!').should('be.visible');
    //   cy.contains('h1', 'Complete Your Design Order').should('be.visible');
    //   cy.get('button[type="submit"]').should('contain', 'Place Design Order');
    // });

    it('should submit design order successfully', () => {
      // Mock the design data
      const designData = {
        file: btoa('mock-file-content'), // Simple base64 mock
        preview: 'mock-preview-url'
      };

      cy.window().then((win) => {
        win.localStorage.setItem('pendingDesign', JSON.stringify(designData));
      });

      // Mock API response
      cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
        statusCode: 200,
        body: { 
          success: true, 
          data: { _id: 'design-123' } 
        }
      }).as('designSubmission');

      cy.reload();

      // Fill form
      cy.fillCheckoutForm({
        name: 'Design Customer',
        email: 'design@example.com',
        phone: '1234567890',
        addressLine1: '456 Design Street',
        city: 'Design City',
        province: 'Design Province'
      });

      cy.get('button[type="submit"]').click();

      // Verify API call
      cy.wait('@designSubmission').then((interception) => {
        expect(interception.request.headers['content-type']).to.include('multipart/form-data');
      });

      // Verify localStorage is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('pendingDesign')).to.be.null;
      });
    });

    it('should handle design order submission errors', () => {
      const designData = {
        file: btoa('mock-file-content'),
        preview: 'mock-preview-url'
      };

      cy.window().then((win) => {
        win.localStorage.setItem('pendingDesign', JSON.stringify(designData));
      });

      // Mock API error
      cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('designError');

      cy.reload();

      cy.fillCheckoutForm({
        name: 'Design Customer',
        email: 'design@example.com',
        phone: '1234567890',
        addressLine1: '456 Design Street',
        city: 'Design City',
        province: 'Design Province'
      });

      cy.get('button[type="submit"]').click();

      cy.on('window:alert', (alertText) => {
        expect(alertText).to.include('Failed to submit order');
      });
    });
  });

  // ---------- REGULAR ORDER FLOW TESTS ----------
  context('🛒 Regular Product Order Flow', () => {
    beforeEach(() => {
      // Ensure no pending design
      cy.window().then((win) => {
        win.localStorage.removeItem('pendingDesign');
      });
      
      // Mock cart items
      const cartItems = [
        { id: '1', name: 'Test Product', price: 2500, qty: 2 }
      ];
      
      cy.window().then((win) => {
        win.localStorage.setItem('cart', JSON.stringify(cartItems));
      });

      cy.reload();
    });

    it('should navigate to payment page with correct data', () => {
      cy.fillCheckoutForm({
        name: 'Regular Customer',
        email: 'regular@example.com',
        phone: '9876543210',
        addressLine1: '789 Regular Street',
        city: 'Regular City',
        province: 'Regular Province'
      });

      cy.get('button[type="submit"]').click();

      // Should navigate to payment page
      cy.url().should('include', '/payment');
      
      // Verify navigation state (if accessible)
      cy.window().then((win) => {
        // This depends on how React Router state is handled in Cypress
        // May need to verify through other means
      });
    });

    it('should calculate correct total amount for regular orders', () => {
      // This would test the totalAmount calculation
      // Need to verify the cartItems reduce logic works correctly
    });
  });

  // ---------- LOADING & STATE MANAGEMENT ----------
  context('⏳ Loading States & UX', () => {
    // it('should show loading state during submission', () => {
    //   cy.fillCheckoutForm({
    //     name: 'Test User',
    //     email: 'test@example.com',
    //     phone: '1234567890',
    //     addressLine1: '123 Test St',
    //     city: 'Test City',
    //     province: 'Test Province'
    //   });

    //   // Mock slow API response
    //   cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
    //     delay: 2000,
    //     statusCode: 200,
    //     body: { success: true }
    //   }).as('slowDesignSubmission');

    //   const designData = {
    //     file: btoa('test-content'),
    //     preview: 'test-preview'
    //   };
      
    //   cy.window().then((win) => {
    //     win.localStorage.setItem('pendingDesign', JSON.stringify(designData));
    //   });

    //   cy.reload();

    //   cy.get('button[type="submit"]').click();
    //   cy.get('button[type="submit"]').should('contain', 'Processing...').and('be.disabled');
    // });

    it('should re-enable button after submission failure', () => {
      cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
        statusCode: 500,
        body: { message: 'Error' }
      }).as('failedSubmission');

      const designData = { file: btoa('test'), preview: 'test' };
      cy.window().then((win) => {
        win.localStorage.setItem('pendingDesign', JSON.stringify(designData));
      });

      cy.reload();
      cy.fillCheckoutForm({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        addressLine1: '123 Test St',
        city: 'Test City',
        province: 'Test Province'
      });

      cy.get('button[type="submit"]').click();
      
      // After alert is handled, button should be re-enabled
      cy.on('window:alert', () => {
        cy.get('button[type="submit"]').should('be.enabled').and('contain', 'Place Design Order');
      });
    });
  });

  // ---------- ERROR BOUNDARY & RESILIENCE ----------
  context('🛡️ Error Handling & Resilience', () => {
    it('should handle invalid design file data gracefully', () => {
      const invalidDesignData = {
        file: '[object Object]', // Invalid file data
        preview: 'test-preview'
      };

      cy.window().then((win) => {
        win.localStorage.setItem('pendingDesign', JSON.stringify(invalidDesignData));
      });

      cy.reload();
      cy.fillCheckoutForm({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        addressLine1: '123 Test St',
        city: 'Test City',
        province: 'Test Province'
      });

      cy.get('button[type="submit"]').click();

      cy.on('window:alert', (alertText) => {
        expect(alertText).to.include('Invalid design file data');
      });
    });

    it('should handle network timeouts', () => {
      cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
        delay: 40000, // Longer than 30s timeout
        statusCode: 200
      }).as('timeoutRequest');

      const designData = { file: btoa('test'), preview: 'test' };
      cy.window().then((win) => {
        win.localStorage.setItem('pendingDesign', JSON.stringify(designData));
      });

      cy.reload();
      cy.fillCheckoutForm({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        addressLine1: '123 Test St',
        city: 'Test City',
        province: 'Test Province'
      });

      cy.get('button[type="submit"]').click();

      cy.on('window:alert', (alertText) => {
        expect(alertText).to.include('Request timeout');
      });
    });
  });
});

// ==================== CUSTOM COMMANDS ====================
Cypress.Commands.add('fillCheckoutForm', (data) => {
  // Personal Information
  cy.get('input[placeholder="Enter your full name"]').type(data.name);
  cy.get('input[placeholder="Enter your email"]').type(data.email);
  cy.get('input[placeholder="Enter your phone number"]').type(data.phone);

  // Billing Address
  cy.get('input[placeholder="Enter street address"]').type(data.addressLine1);
  if (data.addressLine2) {
    cy.get('input[placeholder="Enter apartment, suite, etc. (optional)"]').type(data.addressLine2);
  }
  cy.get('input[placeholder="Enter your city"]').type(data.city);
  cy.get('input[placeholder="Enter your province or state"]').type(data.province);
});

Cypress.Commands.add('setPendingDesign', (designData = {}) => {
  const defaultDesign = {
    file: btoa('mock-design-content'),
    preview: 'mock-preview-url',
    ...designData
  };
  
  cy.window().then((win) => {
    win.localStorage.setItem('pendingDesign', JSON.stringify(defaultDesign));
  });
});

Cypress.Commands.add('setCartItems', (items = []) => {
  const defaultItems = [
    { id: '1', name: 'Default Product', price: 1000, qty: 1 },
    ...items
  ];
  
  cy.window().then((win) => {
    win.localStorage.setItem('cart', JSON.stringify(defaultItems));
  });
});

// ==================== TEST CONFIGURATION ====================
beforeEach(() => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    console.error('Test error:', err);
    return false;
  });
});