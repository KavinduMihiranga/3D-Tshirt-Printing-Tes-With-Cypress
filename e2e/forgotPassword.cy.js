describe('Forgot Password Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/forgot-password');
  });

  it('should display forgot password form', () => {
    cy.contains('Forgot Password').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('Enter your email address and we\'ll send you a link to reset your password.').should('be.visible');
  });

  it('should submit forgot password request successfully', () => {
    // Mock successful API response
    cy.intercept('POST', 'http://localhost:5000/api/auth/forgot-password', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Reset link sent to your email',
        resetLink: 'http://localhost:5173/reset-password?token=fake-token'
      }
    }).as('forgotPasswordRequest');

    // Fill email and submit
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    // Check loading state
    cy.contains('Sending...').should('be.visible');
    
    // Wait for API call and check success message
    cy.wait('@forgotPasswordRequest');
    cy.contains('Success').should('be.visible');
    cy.contains('Reset link sent to your email').should('be.visible');
    
    // Check if reset link is displayed
    cy.contains('Reset Link (Copy this):').should('be.visible');
    cy.get('input[value="http://localhost:5173/reset-password?token=fake-token"]').should('exist');
  });

   it('should show error for invalid email', () => {
    // Mock failed API response for email not found
    cy.intercept('POST', 'http://localhost:5000/api/auth/forgot-password', {
      statusCode: 404,
      body: {
        success: false,
        message: 'Email not found'
      }
    }).as('forgotPasswordRequest');

    // Fill email and submit
    cy.get('input[type="email"]').type('nonexistent@example.com');
    cy.get('button[type="submit"]').click();

    // Wait for API response
    cy.wait('@forgotPasswordRequest');
    
    // Check error message - your component shows the error message directly
    cy.contains('Email not found').should('be.visible');
  });

  it('should copy reset link to clipboard', () => {
    // Mock response with reset link
    cy.intercept('POST', 'http://localhost:5000/api/auth/forgot-password', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Reset link sent to your email',
        resetLink: 'http://localhost:5173/reset-password?token=fake-token'
      }
    }).as('forgotPasswordRequest');

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@forgotPasswordRequest');

    // Mock clipboard API
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves();
    });

    // Click copy button
    cy.contains('Copy').click();
    
    // Check if alert is shown
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Reset link copied to clipboard!');
    });
  });

  it('should navigate back to login', () => {
    cy.contains('Back to Login').click();
    cy.url().should('include', '/login');
  });

});