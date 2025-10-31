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

    generateInvalidFormData() {
        return {
            name: '',
            email: 'invalid-email',
            phone: '',
            addressLine1: '',
            city: '',
            province: ''
        };
    }

    generatePendingDesign(overrides = {}) {
        const baseDesign = {
            file: btoa('mock-design-file-content'),
            preview: 'mock-preview-url',
            sizes: { XS: 1, M: 2, XL: 1 },
            totalPrice: 8000
        };
        return { ...baseDesign, ...overrides };
    }

    generateInvalidDesign() {
        return {
            file: '[object Object]', // Invalid file data
            preview: 'test-preview'
        };
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

    getEmptyCart() {
        return [];
    }

    getDesignOrderScenario() {
        return {
            formData: this.generateFormData(),
            designData: this.generatePendingDesign(),
            isDesignOrder: true
        };
    }

    getRegularOrderScenario() {
        return {
            formData: this.generateFormData({ name: 'Regular Customer' }),
            cartItems: this.generateCartItems(2),
            isDesignOrder: false
        };
    }
}

export default new CheckoutDataGenerators();