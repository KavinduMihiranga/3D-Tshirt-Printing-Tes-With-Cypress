class AuthDataGenerators {
    generateLoginData(overrides = {}) {
        const baseData = {
            email: 'admin@example.com',
            password: 'admin123'
        };
        return { ...baseData, ...overrides };
    }

    generateInvalidLoginData() {
        return {
            email: 'wrong@example.com',
            password: 'wrongpassword'
        };
    }

    generateForgotPasswordData(overrides = {}) {
        const baseData = {
            email: 'test@example.com'
        };
        return { ...baseData, ...overrides };
    }

    generateResetPasswordData(overrides = {}) {
        const baseData = {
            newPassword: 'newpassword123',
            confirmPassword: 'newpassword123',
            token: 'valid-token-123'
        };
        return { ...baseData, ...overrides };
    }

    generateInvalidResetData() {
        return {
            newPassword: '123', // Too short
            confirmPassword: 'different', // Mismatch
            token: 'invalid-token'
        };
    }

    getValidToken() {
        return 'valid-token-123';
    }

    getInvalidToken() {
        return 'invalid-token';
    }

    getExpiredToken() {
        return 'expired-token';
    }

    getResetLink(token = null) {
        return `http://localhost:5173/reset-password?token=${token || this.getValidToken()}`;
    }
}

export default new AuthDataGenerators();