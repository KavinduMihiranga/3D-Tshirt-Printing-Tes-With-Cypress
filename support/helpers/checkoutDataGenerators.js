class CheckoutDataGenerators {
    generateFormData(overrides = {}) {
        const baseData = {
            name: 'John Alexander Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            addressLine1: '123 Main Street',
            addressLine2: 'Apt 4B',
            city: 'Colombo',
            province: 'Western Province'
        };
        return { ...baseData, ...overrides };
    }

    generateCartItems(count = 2) {
        return Array.from({ length: count }, (_, i) => ({
            id: `item-${i + 1}`,
            name: `Product ${i + 1}`,
            price: 2500 + (i * 500),
            qty: i + 1,
            size: ['S', 'M', 'L'][i % 3],
            color: ['Red', 'Blue', 'Green'][i % 3],
            image: `/images/product-${i + 1}.jpg`
        }));
    }

    // Test data for validation scenarios
    generateValidationTestData() {
        return {
            valid: this.generateFormData(),
            emptyName: this.generateFormData({ name: '' }),
            invalidEmail: this.generateFormData({ email: 'invalid-email' }),
            shortPhone: this.generateFormData({ phone: '123' }),
            emptyAddress: this.generateFormData({ 
                addressLine1: '', 
                city: '', 
                province: '' 
            }),
            nameWithNumbers: this.generateFormData({ name: 'John123 Doe' }),
            nameWithSpecialChars: this.generateFormData({ name: 'John@Doe' }),
            singleName: this.generateFormData({ name: 'John' }),
            internationalPhone: this.generateFormData({ phone: '+94 77 123 4567' }),
            specialCharacters: this.generateFormData({ 
                name: 'María José Martínez-López',
                email: 'test+special@example.com'
            })
        };
    }

    generateEdgeCaseData() {
        return {
            minimal: this.generateFormData({
                addressLine2: '' // Only addressLine2 is optional
            }),
            longButValid: this.generateFormData({
                name: 'John Alexander William Doe-Smith Jr.',
                addressLine1: '123 Main Street, Building A, Floor 3, Left Wing'
            })
        };
    }
}

export default new CheckoutDataGenerators();