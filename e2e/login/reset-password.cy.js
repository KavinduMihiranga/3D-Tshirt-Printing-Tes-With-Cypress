import ResetPasswordPage from '../../support/pageObjects/ResetPasswordPage';
import AuthApiHelpers from '../../support/helpers/AuthApiHelpers';
import AuthDataGenerators from '../../support/helpers/AuthDataGenerators';

describe('Reset Password Page', () => {
    context('🎯 UI Structure & Layout', () => {
        it('should display reset password form with valid token', () => {
            const resetPage = new ResetPasswordPage();
            resetPage
                .visit()
                .verifyPageLoaded()
                .verifyFormElements();
        });

        it('should show error for missing token', () => {
            const resetPage = new ResetPasswordPage('');
            resetPage
                .visit()
                .verifyInvalidTokenMessage();
        });
    });

    context('📝 Form Validation', () => {
        it('should validate password mismatch', () => {
            const resetPage = new ResetPasswordPage();
            resetPage
                .visit()
                .fillNewPassword('password123')
                .fillConfirmPassword('differentpassword')
                .clickSubmit()
                .verifyPasswordMismatchError();
        });

        it('should validate password length', () => {
            const resetPage = new ResetPasswordPage();
            resetPage
                .visit()
                .fillBothPasswords('123')
                .clickSubmit()
                .verifyPasswordLengthError();
        });
    });

    context('✅ Successful Flow', () => {
        it.skip('should reset password successfully', () => {
            AuthApiHelpers.mockResetPasswordSuccess();
            const resetPage = new ResetPasswordPage();
            const passwordData = AuthDataGenerators.generateResetPasswordData();
            
            resetPage
                .visit()
                .fillBothPasswords(passwordData.newPassword)
                .clickSubmit()
                .verifyLoadingState();

            cy.wait('@resetPasswordRequest');
            resetPage.verifySuccessMessage();
        });
    });

    context('👁️ Password Visibility', () => {
        it('should show/hide password fields', () => {
            const resetPage = new ResetPasswordPage();
            resetPage
                .visit()
                .verifyPasswordFieldsHidden()
                .togglePasswordVisibility(0)
                .togglePasswordVisibility(1)
                .verifyPasswordFieldsVisible()
                .togglePasswordVisibility(0)
                .togglePasswordVisibility(1)
                .verifyPasswordFieldsHidden();
        });
    });

    context('🔗 Navigation', () => {
        it('should navigate to login links', () => {
            const resetPage = new ResetPasswordPage();
            resetPage
                .visit()
                .clickBackToLogin()
                .verifyNavigationToLogin();
        });
    });

    context('🚨 Error Handling', () => {
        it('should handle invalid token', () => {
            AuthApiHelpers.mockResetPasswordError();
            const resetPage = new ResetPasswordPage('invalid-token');
            const passwordData = AuthDataGenerators.generateResetPasswordData();
            
            resetPage
                .visit()
                .fillBothPasswords(passwordData.newPassword)
                .clickSubmit();

            cy.wait('@resetPasswordError');
            // Should show appropriate error message
        });
    });
});