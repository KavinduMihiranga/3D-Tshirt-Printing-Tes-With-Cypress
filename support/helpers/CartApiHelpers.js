import AuthDataGenerators from './AuthDataGenerators';

class AuthApiHelpers {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api/auth';
    }

    mockLoginSuccess(userData = {}, alias = 'loginRequest') {
        const response = AuthDataGenerators.getLoginSuccessResponse();
        if (userData && Object.keys(userData).length > 0) {
            response.body.data.user = { ...response.body.data.user, ...userData };
        }
        
        cy.intercept('POST', `${this.baseUrl}/login`, response).as(alias);
        return this;
    }

    mockLoginError(type = 'invalidCredentials', alias = 'loginError') {
        const response = AuthDataGenerators.getLoginErrorResponse(type);
        cy.intercept('POST', `${this.baseUrl}/login`, response).as(alias);
        return this;
    }

    mockForgotPasswordSuccess(alias = 'forgotPasswordRequest') {
        const response = AuthDataGenerators.getForgotPasswordSuccessResponse();
        cy.intercept('POST', `${this.baseUrl}/forgot-password`, response).as(alias);
        return this;
    }

    mockForgotPasswordError(type = 'emailNotFound', alias = 'forgotPasswordError') {
        const response = AuthDataGenerators.getForgotPasswordErrorResponse(type);
        cy.intercept('POST', `${this.baseUrl}/forgot-password`, response).as(alias);
        return this;
    }

    mockResetPasswordSuccess(alias = 'resetPasswordRequest') {
        const response = AuthDataGenerators.getResetPasswordSuccessResponse();
        cy.intercept('POST', `${this.baseUrl}/reset-password`, response).as(alias);
        return this;
    }

    mockResetPasswordError(type = 'invalidToken', alias = 'resetPasswordError') {
        const response = AuthDataGenerators.getResetPasswordErrorResponse(type);
        cy.intercept('POST', `${this.baseUrl}/reset-password`, response).as(alias);
        return this;
    }

    mockNetworkError(endpoint, alias = 'networkError') {
        cy.intercept('POST', `${this.baseUrl}/${endpoint}`, {
            forceNetworkError: true
        }).as(alias);
        return this;
    }

    mockDelayedResponse(endpoint, delay = 2000, alias = 'delayedResponse') {
        cy.intercept('POST', `${this.baseUrl}/${endpoint}`, (req) => {
            req.reply({
                statusCode: 200,
                body: { success: true },
                delay
            });
        }).as(alias);
        return this;
    }
}

export default new AuthApiHelpers();