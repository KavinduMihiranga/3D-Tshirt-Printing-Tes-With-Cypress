class CartDataGenerators {
    generateCartItem(overrides = {}) {
        const baseItem = {
            id: 'test-001',
            name: 'Polo Red T-shirt',
            size: 'Medium',
            qty: 2,
            price: 5000,
            image: '/api/uploads/test-shirt.jpg'
        };
        return { ...baseItem, ...overrides };
    }

    generateMultipleCartItems(count = 3) {
        return Array.from({ length: count }, (_, i) =>
            this.generateCartItem({
                id: `item-${i + 1}`,
                name: `Product ${i + 1}`,
                size: i % 2 === 0 ? 'Medium' : 'Large',
                qty: i + 1,
                price: 2500 + (i * 500)
            })
        );
    }

    getEmptyCart() {
        return [];
    }

    getSingleItemCart() {
        return [this.generateCartItem()];
    }

    getMultipleItemsCart() {
        return this.generateMultipleCartItems(3);
    }

    getCartWithDifferentSizes() {
        return [
            this.generateCartItem({ id: 'size-s', name: 'Small Shirt', size: 'Small', qty: 1 }),
            this.generateCartItem({ id: 'size-m', name: 'Medium Shirt', size: 'Medium', qty: 2 }),
            this.generateCartItem({ id: 'size-l', name: 'Large Shirt', size: 'Large', qty: 1 })
        ];
    }

    getCartWithZeroQuantity() {
        return [this.generateCartItem({ qty: 0 })];
    }

    getCartWithHighQuantity() {
        return [this.generateCartItem({ qty: 10 })];
    }
}

export default new CartDataGenerators();