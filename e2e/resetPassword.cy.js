describe('Reset Password Page', () => {
  it('should display reset password form with valid token', () => {
    // Visit reset password page with a token
    cy.visit('http://localhost:5173/reset-password?token=valid-token-123');
    
    cy.contains('Reset Password').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show error for missing token', () => {
    // Visit without token
    cy.visit('http://localhost:5173/reset-password');
    
    cy.contains('Invalid Reset Link').should('be.visible');
    cy.contains('This password reset link is invalid or has expired.').should('be.visible');
  });

  it('should validate password mismatch', () => {
    cy.visit('http://localhost:5173/reset-password?token=valid-token-123');
    
    // Fill different passwords
    cy.get('input[type="password"]').first().type('password123');
    cy.get('input[type="password"]').last().type('differentpassword');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should validate password length', () => {
    cy.visit('http://localhost:5173/reset-password?token=valid-token-123');
    
    // Fill short password
    cy.get('input[type="password"]').first().type('123');
    cy.get('input[type="password"]').last().type('123');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Password must be at least 6 characters long').should('be.visible');
  });

  it('should reset password successfully', () => {
    // Mock successful reset API response
    cy.intercept('POST', 'http://localhost:5000/api/auth/reset-password', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Password reset successfully'
      }
    }).as('resetPasswordRequest');

    cy.visit('http://localhost:5173/reset-password?token=valid-token-123');
    
    // Fill matching passwords
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').last().type('newpassword123');
    cy.get('button[type="submit"]').click();

    // Check loading state
    cy.contains('Resetting Password...').should('be.visible');
    
    // Wait for API call and check success
    cy.wait('@resetPasswordRequest');
    cy.contains('Password reset successfully! Redirecting to admin login...').should('be.visible');
  });

  it('should show/hide password fields', () => {
    cy.visit('http://localhost:5173/reset-password?token=valid-token-123');
    
    // Check both password fields start as hidden
    cy.get('input[type="password"]').should('have.length', 2);
    
    // Click show password buttons
    cy.get('.relative button').first().click();
    cy.get('.relative button').last().click();
    
    // Both should now be visible as text
    cy.get('input[type="text"]').should('have.length', 2);
    
    // Click again to hide
    cy.get('.relative button').first().click();
    cy.get('.relative button').last().click();
    
    // Both should be hidden again
    cy.get('input[type="password"]').should('have.length', 2);
  });

  it('should navigate to login links', () => {
    cy.visit('http://localhost:5173/reset-password?token=valid-token-123');
    
    // Click back to admin login
    cy.contains('Back to Admin Login').click();
    cy.url().should('include', '/login');
  });
});