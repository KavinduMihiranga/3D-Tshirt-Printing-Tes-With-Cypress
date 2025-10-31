import BasePage from './BasePage';

class LoginPage extends BasePage {
    constructor() {
        super();
        this.url = '/login';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Admin Login').should('be.visible');
        return this;
    }

    verifyFormElements() {
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
        cy.contains('Fill Sample Credentials').should('be.visible');
        cy.contains('Forgot Password?').should('be.visible');
        return this;
    }

    fillEmail(email) {
        cy.get('input[type="email"]').clear().type(email);
        return this;
    }

    fillPassword(password) {
        cy.get('input[type="password"]').clear().type(password);
        return this;
    }

    clickSubmit() {
        cy.get('button[type="submit"]').click();
        return this;
    }

    clickFillSampleCredentials() {
        cy.contains('Fill Sample Credentials').click();
        return this;
    }

    clickForgotPassword() {
        cy.contains('Forgot Password?').click();
        return this;
    }

    togglePasswordVisibility() {
        cy.get('input[type="password"]').parent().within(() => {
            cy.get('button').click();
        });
        return this;
    }

    verifyPasswordVisible() {
        cy.get('input[type="text"]').should('exist');
        return this;
    }

    verifyPasswordHidden() {
        cy.get('input[type="password"]').should('exist');
        return this;
    }

    verifySampleCredentialsFilled() {
        cy.get('input[type="email"]').should('have.value', 'admin@example.com');
        cy.get('input[type="password"]').should('have.value', 'admin123');
        return this;
    }

    verifyErrorMessage(message) {
        cy.contains('Login Failed').should('be.visible');
        cy.contains(message).should('be.visible');
        return this;
    }

    verifyNavigationToForgotPassword() {
        cy.url().should('include', '/forgot-password');
        return this;
    }
}

export default LoginPage;