describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should display login form', () => {
    // Check if the main elements are visible
    cy.contains('Admin Login').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('Fill Sample Credentials').should('be.visible');
  });

  it('should fill sample credentials', () => {
    // Click the sample credentials button
    cy.contains('Fill Sample Credentials').click();
    
    // Check if values are filled
    cy.get('input[type="email"]').should('have.value', 'admin@example.com');
    cy.get('input[type="password"]').should('have.value', 'admin123');
  });

   it('should show/hide password', () => {
    // Type password first
    cy.get('input[type="password"]').type('testpassword');
    
    // Click the eye icon button (it's inside the password input container)
    cy.get('input[type="password"]').parent().within(() => {
      cy.get('button').click(); // Click the eye icon button
    });
    
    // Password should now be visible as text
    cy.get('input[type="text"]').should('exist');
    
    // Click again to hide
    cy.get('input[type="text"]').parent().within(() => {
      cy.get('button').click();
    });
    
    // Password should be hidden again
    cy.get('input[type="password"]').should('exist');
  });

  it('should show error with invalid credentials', () => {
    // Mock failed login
    cy.intercept('POST', 'http://localhost:5000/api/auth/login', {
      statusCode: 401,
      body: {
        success: false,
        message: 'Invalid credentials'
      }
    }).as('loginRequest');

    // Fill form
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check error message
    cy.contains('Login Failed').should('be.visible');
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should navigate to forgot password', () => {
    cy.contains('Forgot Password?').click();
    cy.url().should('include', '/forgot-password');
  });
});