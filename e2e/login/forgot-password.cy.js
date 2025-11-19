import ForgotPasswordPage from '../../support/pageObjects/ForgotPasswordPage';
import AuthApiHelpers from '../../support/helpers/AuthApiHelpers';
import AuthDataGenerators from '../../support/helpers/AuthDataGenerators';

describe('Forgot Password Page', () => {
    const forgotPasswordPage = new ForgotPasswordPage();

    beforeEach(() => {
        forgotPasswordPage.visit();
    });

    context('🎯 UI Structure & Layout', () => {
        it('should display forgot password form', () => {
            forgotPasswordPage
                .verifyPageLoaded()
                .verifyFormElements();
        });
    });

    context('✅ Successful Flow', () => {
        it('should submit forgot password request successfully', () => {
           const resetLink = AuthDataGenerators.getResetLink();
            AuthApiHelpers.mockForgotPasswordSuccess(resetLink);
            const emailData = AuthDataGenerators.generateForgotPasswordData();
            
            cy.intercept('POST', '/api/auth/forgot-password').as('forgotPasswordRequest');
            
            forgotPasswordPage
                .fillEmail(emailData.email)
                .clickSubmit();

            // Debug: Check what's actually on the page
            cy.get('button[type="submit"]').then(($btn) => {
                console.log('Actual button text:', $btn.text());
                console.log('Button content:', $btn.html());
            });
            
            // Check the entire page for any loading indicators
            cy.get('body').then(($body) => {
                console.log('Page text:', $body.text());
            });

            cy.wait('@forgotPasswordRequest');
            
            forgotPasswordPage
            .verifySuccessMessage()
            .verifyResetLinkDisplayed(resetLink);
        });

    });

    context('🚨 Error Handling', () => {
        it('should show error for invalid email', () => {
            AuthApiHelpers.mockForgotPasswordError();
            const emailData = AuthDataGenerators.generateForgotPasswordData();
            
            forgotPasswordPage
                .fillEmail(emailData.email)
                .clickSubmit();

            cy.wait('@forgotPasswordError');
            forgotPasswordPage.verifyErrorMessage('Email not found');
        });
    });

    context('🔗 Navigation', () => {
        it('should navigate back to login', () => {
            forgotPasswordPage
                .clickBackToLogin()
                .verifyNavigationToLogin();
        });
    });
});