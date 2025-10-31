class OrderDataGenerators {
    generateOrder(overrides = {}) {
        const baseOrder = {
            _id: '1',
            customerName: 'Test Customer',
            tShirtName: 'Test T-Shirt',
            address: '123 Test Street, City, State',
            qty: 2,
            date: '2024-01-15',
            status: 'Pending',
            createdAt: new Date().toISOString()
        };
        return { ...baseOrder, ...overrides };
    }

    generateMultipleOrders(count = 3) {
        return Array.from({ length: count }, (_, i) =>
            this.generateOrder({
                _id: `${i + 1}`,
                customerName: `Customer ${i + 1}`,
                tShirtName: `T-Shirt ${i + 1}`,
                address: `Address ${i + 1}`,
                qty: i + 1,
                date: `2024-01-${15 + i}`,
                status: i % 2 === 0 ? 'Pending' : 'Completed'
            })
        );
    }

    getValidOrderData() {
        return {
            customerName: 'New Customer',
            tShirtName: 'New T-Shirt',
            address: '789 Pine Rd, Village, State',
            qty: '2',
            date: '2024-01-20',
            status: 'Pending'
        };
    }

    getInvalidOrderData() {
        return {
            customerName: '',
            tShirtName: '',
            qty: '-1'
        };
    }

    getUpdateOrderData() {
        return {
            customerName: 'Updated Customer',
            tShirtName: 'Updated Shirt',
            qty: '10'
        };
    }
}

export default new OrderDataGenerators();