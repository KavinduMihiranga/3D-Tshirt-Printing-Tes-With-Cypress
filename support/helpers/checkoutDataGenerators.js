class CheckoutDataGenerators {
    generateFormData(overrides = {}) {
        const baseData = {
            name: 'John Doe',
            email: 'john@example.com',
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
            size: ['S', 'M', 'L'][i % 3]
        }));
    }

    // Add methods for edge cases
    generateEdgeCaseData() {
        return {
            empty: this.generateFormData({
                name: '',
                email: '',
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                province: ''
            }),
            longValues: this.generateFormData({
                name: 'A'.repeat(100),
                addressLine1: 'B'.repeat(150)
            }),
            specialChars: this.generateFormData({
                name: 'John Doe-Smith Jr.',
                addressLine1: '123 Main St. #4B'
            })
        };
    }

      getRegularOrderScenario() {
        return {
            formData: this.generateFormData({ name: 'Regular Customer' }),
            cartItems: this.generateCartItems(2),
            isDesignOrder: false
        };
    }

    getDesignOrderScenario() {
        return {
            formData: this.generateFormData(),
            designData: this.generatePendingDesign(),
            isDesignOrder: true
        };
    }
}

export default new CheckoutDataGenerators();