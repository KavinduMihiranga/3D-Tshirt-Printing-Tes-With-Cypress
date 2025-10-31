class DesignDataGenerators {
    generateDesignData(overrides = {}) {
        const baseDesign = {
            customerName: 'Test Customer',
            tShirtColor: '#000000',
            designs: [],
            sizes: {
                XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0
            },
            totalPrice: 0
        };
        return { ...baseDesign, ...overrides };
    }

    generateTextDesign(text = 'Test Design') {
        return {
            type: 'text',
            content: text,
            color: '#000000',
            size: 0.3,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        };
    }

    generateImageDesign() {
        return {
            type: 'image',
            content: 'mock-image-data',
            scale: 1,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        };
    }

    getValidSizeDistribution() {
        return {
            XS: 2, S: 3, M: 5, L: 4, XL: 3, '2XL': 2, '3XL': 1
        };
    }

    getTestImageFile() {
        return {
            fileName: 'test-image.jpg',
            fileContent: Cypress.Buffer.from(
                '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8U/9k=',
                'base64'
            )
        };
    }

    getLargeImageFile() {
        // Create a 6MB file
        const largeContent = new Array(6 * 1024 * 1024).join('a');
        return {
            fileName: 'large-image.jpg',
            fileContent: Cypress.Buffer.from(largeContent)
        };
    }

    getInvalidFile() {
        return {
            fileName: 'test.txt',
            fileContent: 'This is a text file, not an image'
        };
    }
}

export default new DesignDataGenerators();