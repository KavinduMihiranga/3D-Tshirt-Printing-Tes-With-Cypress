import BasePage from './BasePage';

class ResetPasswordPage extends BasePage {
    constructor(token = 'valid-token-123') {
        super();
        this.url = `/reset-password?token=${token}`;
        this.token = token;
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Reset Password').should('be.visible');
        return this;
    }

    verifyFormElements() {
        cy.get('input[type="password"]').should('have.length', 2);
        cy.get('button[type="submit"]').should('be.visible');
        cy.contains('Back to Admin Login').should('be.visible');
        return this;
    }

    verifyInvalidTokenMessage() {
        cy.contains('Invalid Reset Link').should('be.visible');
        cy.contains('This password reset link is invalid or has expired.').should('be.visible');
        return this;
    }

    fillNewPassword(password) {
        cy.get('input[type="password"]').first().clear().type(password);
        return this;
    }

    fillConfirmPassword(password) {
        cy.get('input[type="password"]').last().clear().type(password);
        return this;
    }

    fillBothPasswords(password) {
        this.fillNewPassword(password);
        this.fillConfirmPassword(password);
        return this;
    }

    clickSubmit() {
        cy.get('button[type="submit"]').click();
        return this;
    }

    clickBackToLogin() {
        cy.contains('Back to Admin Login').click();
        return this;
    }

    togglePasswordVisibility(fieldIndex = 0) {
        cy.get('.relative button').eq(fieldIndex).click();
        return this;
    }

    verifyPasswordMismatchError() {
        cy.contains('Passwords do not match').should('be.visible');
        return this;
    }

    verifyPasswordLengthError() {
        cy.contains('Password must be at least 6 characters long').should('be.visible');
        return this;
    }

    verifyLoadingState() {
        cy.contains('Resetting Password...').should('be.visible');
        return this;
    }

    verifySuccessMessage() {
        cy.contains('Password reset successfully! Redirecting to admin login...').should('be.visible');
        return this;
    }

    verifyPasswordFieldsVisible() {
        cy.get('input[type="text"]').should('have.length', 2);
        return this;
    }

    verifyPasswordFieldsHidden() {
        cy.get('input[type="password"]').should('have.length', 2);
        return this;
    }

    verifyNavigationToLogin() {
        cy.url().should('include', '/login');
        return this;
    }
}

export default ResetPasswordPage;