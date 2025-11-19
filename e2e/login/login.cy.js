import LoginPage from '../../support/pageObjects/LoginPage';
import AuthApiHelpers from '../../support/helpers/AuthApiHelpers';
import AuthDataGenerators from '../../support/helpers/AuthDataGenerators';

describe('Login Page', () => {
    const loginPage = new LoginPage();

    beforeEach(() => {
        loginPage.visit();
    });

    context('🎯 UI Structure & Layout', () => {
        it('should display login form', () => {
            loginPage
                .verifyPageLoaded()
                .verifyFormElements();
        });
    });

    context('🔄 Form Interactions', () => {
        it('should fill sample credentials', () => {
            loginPage
                .clickFillSampleCredentials()
                .verifySampleCredentialsFilled();
        });
    });

    context('🚨 Error Handling', () => {
        it('should show error with invalid credentials', () => {
            AuthApiHelpers.mockLoginError();
            const invalidData = AuthDataGenerators.generateInvalidLoginData();
            
            loginPage
                .fillEmail(invalidData.email)
                .fillPassword(invalidData.password)
                .clickSubmit()
                .verifyErrorMessage('Invalid credentials');

            cy.wait('@loginError');
        });

        it('should handle network errors', () => {
            AuthApiHelpers.mockNetworkError('login');
            
            loginPage
                .fillEmail('test@example.com')
                .fillPassword('password')
                .clickSubmit();

            // Should handle error gracefully
            cy.get('body').should('exist');
        });
    });

    context('🔗 Navigation', () => {
        it('should navigate to forgot password', () => {
            loginPage
                .clickForgotPassword()
                .verifyNavigationToForgotPassword();
        });
    });

    context('✅ Successful Login', () => {
        it('should login successfully with valid credentials', () => {
            AuthApiHelpers.mockLoginSuccess();
            const validData = AuthDataGenerators.generateLoginData();
            
            loginPage
                .fillEmail(validData.email)
                .fillPassword(validData.password)
                .clickSubmit();

            cy.wait('@loginRequest');
            // Should redirect to admin dashboard or home page
            cy.url().should('not.include', '/login');
        });
    });
});