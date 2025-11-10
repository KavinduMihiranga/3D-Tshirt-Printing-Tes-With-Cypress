import BasePage from './BasePage';

class ForgotPasswordPage extends BasePage {
    constructor() {
        super();
        this.url = '/forgot-password';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Forgot Password').should('be.visible');
        return this;
    }

    verifyFormElements() {
        cy.get('input[type="email"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
        cy.contains('Enter your email address and we\'ll send you a link to reset your password.').should('be.visible');
        cy.contains('Back to Login').should('be.visible');
        return this;
    }

    fillEmail(email) {
        cy.get('input[type="email"]').clear().type(email);
        return this;
    }

    clickSubmit() {
        cy.get('button[type="submit"]').click();
        return this;
    }

    clickBackToLogin() {
        cy.contains('Back to Login').click();
        return this;
    }

    clickCopyResetLink() {
        cy.contains('Copy').click();
        return this;
    }

    verifyLoadingState() {
        cy.contains('Sending...').should('be.visible');
        return this;
    }

    verifySuccessMessage() {
        cy.contains('Success').should('be.visible');
        cy.contains('Reset link sent to your email').should('be.visible');
        return this;
    }

    verifyResetLinkDisplayed(link) {
        cy.contains('Reset Link (Copy this):').should('be.visible');
        cy.get(`input[value="${link}"]`).should('exist');
        return this;
    }

    verifyErrorMessage(message) {
        cy.contains(message).should('be.visible');
        return this;
    }

    verifyNavigationToLogin() {
        cy.url().should('include', '/login');
        return this;
    }

    mockClipboard() {
        cy.window().then((win) => {
            cy.stub(win.navigator.clipboard, 'writeText').as('clipboardWrite');
        });
        return this;
    }
}

export default ForgotPasswordPage;