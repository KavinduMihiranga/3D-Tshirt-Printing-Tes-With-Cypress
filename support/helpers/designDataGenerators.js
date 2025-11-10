class DesignDataGenerators {
    static getTestImageFile() {
        return {
            fileName: 'test-image.jpg',
            fileContent: Cypress.Blob.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
        };
    }

    static getLargeImageFile() {
        // Create a mock large file (6MB)
        const largeContent = new ArrayBuffer(6 * 1024 * 1024);
        return {
            fileName: 'large-image.jpg',
            fileContent: largeContent
        };
    }

    static getCustomerInfo() {
        return {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            notes: 'Test order notes'
        };
    }

    static getDesignData() {
        return {
            text: 'Test Design',
            color: '#000000',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1.0
        };
    }
}

export default DesignDataGenerators;