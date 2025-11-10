class contactUsDataGenerators {
    generateConatctUs(overrides = {}) {
        const baseContactUs = {
            name: 'Test User',
            email: 'kavindutest0001@gmail.com',
            phone: '0771234567',
            subject: 'Test Subject for Validation',
            quantity:2,
            address: '123 Test St, Test City',
            message: 'This is a test message that meets the minimum length requirement.',
        };
        return { ...baseContactUs, ...overrides };
    }

    generateInvalidContactUs() {
        return {
            name: '',   // Missing name
            email: 'invalid-email', // Invalid email format
            phone: 'abc123', // Invalid phone number    
            subject: 'hi', 
            quantity: -1, // Invalid quantity
            address: '', // Missing address
            message: 'short', // Missing message
        };
    }

}

export default new contactUsDataGenerators();