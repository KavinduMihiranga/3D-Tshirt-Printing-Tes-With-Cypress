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
            
            forgotPasswordPage
                .fillEmail(emailData.email)
                .clickSubmit()
                .verifyLoadingState();

            cy.wait('@forgotPasswordRequest');
            
            forgotPasswordPage
                .verifySuccessMessage()
                .verifyResetLinkDisplayed(resetLink);
        });

        // it('should copy reset link to clipboard', () => {
        //     const resetLink = AuthDataGenerators.getResetLink();
        //     AuthApiHelpers.mockForgotPasswordSuccess(resetLink);
            
        //     forgotPasswordPage
        //         .mockClipboard()
        //         .fillEmail('test@example.com')
        //         .clickSubmit();

        //     cy.wait('@forgotPasswordRequest');
            
        //     forgotPasswordPage.clickCopyResetLink();
            
        //     cy.get('@clipboardWrite').should('be.calledWith', resetLink);
            
        //     cy.on('window:alert', (text) => {
        //         expect(text).to.equal('Reset link copied to clipboard!');
        //     });
        // });
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