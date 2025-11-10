class AuthApiHelpers {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api/auth';
    }

    mockLoginSuccess(userData = {}, alias = 'loginRequest') {
        cy.intercept('POST', `${this.baseUrl}/login`, {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    token: 'fake-jwt-token',
                    user: {
                        id: '1',
                        email: 'admin@example.com',
                        role: 'admin',
                        ...userData
                    }
                }
            }
        }).as(alias);
        return this;
    }

    mockLoginError(statusCode = 401, message = 'Invalid credentials', alias = 'loginError') {
        cy.intercept('POST', `${this.baseUrl}/login`, {
            statusCode: statusCode,
            body: {
                success: false,
                message: message
            }
        }).as(alias);
        return this;
    }

    mockForgotPasswordSuccess(resetLink = null, alias = 'forgotPasswordRequest') {
        const response = {
            statusCode: 200,
            body: {
                success: true,
                message: 'Reset link sent to your email'
            }
        };

        if (resetLink) {
            response.body.resetLink = resetLink;
        }

        cy.intercept('POST', `${this.baseUrl}/forgot-password`, response).as(alias);
        return this;
    }

    mockForgotPasswordError(statusCode = 404, message = 'Email not found', alias = 'forgotPasswordError') {
        cy.intercept('POST', `${this.baseUrl}/forgot-password`, {
            statusCode: statusCode,
            body: {
                success: false,
                message: message
            }
        }).as(alias);
        return this;
    }

    mockResetPasswordSuccess(alias = 'resetPasswordRequest') {
        cy.intercept('POST', `${this.baseUrl}/reset-password`, {
            statusCode: 200,
            body: {
                success: true,
                message: 'Password reset successfully'
            }
        }).as(alias);
        return this;
    }

    mockResetPasswordError(statusCode = 400, message = 'Invalid token', alias = 'resetPasswordError') {
        cy.intercept('POST', `${this.baseUrl}/reset-password`, {
            statusCode: statusCode,
            body: {
                success: false,
                message: message
            }
        }).as(alias);
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