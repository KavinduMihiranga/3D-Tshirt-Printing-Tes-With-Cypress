class ProductDataGenerators {
    generateProduct(overrides = {}) {
        const baseProduct = {
            _id: '1',
            name: 'Test Product',
            title: 'Test Product Title',
            description: 'Test product description',
            category: 'Test Category',
            price: 1000,
            qty: 10,
            status: 'in stock',
            image: '/api/uploads/test-image.jpg',
            createdAt: new Date().toISOString()
        };
        return { ...baseProduct, ...overrides };
    }

    generateMultipleProducts(count = 3) {
        return Array.from({ length: count }, (_, i) => 
            this.generateProduct({
                _id: `${i + 1}`,
                name: `Product ${i + 1}`,
                title: `Product ${i + 1} Title`,
                category: i % 2 === 0 ? 'Clothing' : 'Accessories',
                price: (i + 1) * 1000,
                qty: (i + 1) * 10
            })
        );
    }

    getValidProductData() {
        return {
            name: 'New Product',
            category: 'Electronics',
            description: 'New product description',
            price: '2999',
            qty: '50',
            status: 'in stock'
        };
    }

    getInvalidProductData() {
        return {
            name: '',
            category: '',
            price: '-100',
            qty: '-10'
        };
    }

    getUpdateProductData() {
        return {
            name: 'Updated Product',
            price: '2499'
        };
    }
}

export default new ProductDataGenerators();