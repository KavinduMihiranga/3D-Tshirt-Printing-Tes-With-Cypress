class ContactUsDataGenerators {
    generateContactUs(overrides = {}) {
        const baseContactUs = {
            name: 'Test User',
            email: 'test@example.com',
            phone: '0771234567',
            subject: 'Test Subject for Validation',
            quantity: 2,
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
            message: 'short', // Too short message
        };
    }

    generateMinimalValidContactUs() {
        return {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '0771234567',
            subject: 'Test Subject',
            message: 'This is a valid test message with sufficient length.'
        };
    }

    generateLongMessageContactUs() {
        return {
            name: 'Test User',
            email: 'test@example.com',
            phone: '0771234567',
            subject: 'Test Subject',
            message: 'A'.repeat(1000) // Long message
        };
    }

    generateSpecialCharactersContactUs() {
        return {
            name: 'María José Martínez-López',
            email: 'test+special@example.com',
            phone: '+94 77 123-4567',
            subject: 'Test Subject with #Special@Characters!',
            address: '123/4 Test St, Colombo 05',
            message: 'This message contains special characters: !@#$%^&*()'
        };
    }

    generateEdgeCaseContactUs() {
        return {
            name: 'A'.repeat(50), // Long name
            email: 'a'.repeat(30) + '@example.com', // Long email
            phone: '1'.repeat(15), // Long phone
            subject: 'A'.repeat(100), // Long subject
            quantity: 999999, // Large quantity
            address: 'B'.repeat(150), // Long address
            message: 'C'.repeat(500) // Long message
        };
    }

    generateFileUploadContactUs() {
        return {
            name: 'File Upload Test',
            email: 'filetest@example.com',
            phone: '0771234567',
            subject: 'File Upload Test Subject',
            message: 'Testing file upload functionality',
            file: 'test-image.jpg'
        };
    }

    generateBusinessContactUs() {
        return {
            name: 'Business Customer',
            email: 'business@company.com',
            phone: '+1 (555) 123-4567',
            subject: 'Bulk Order Inquiry - 500+ T-Shirts',
            quantity: 500,
            address: '123 Business Park, Corporate District, Colombo 03',
            message: 'We are interested in bulk ordering custom T-shirts for our company event. Please provide pricing and timeline for 500+ units with custom printing.'
        };
    }

    generateContactForManagement() {
        return {
            _id: 'test-' + Date.now(),
            name: 'Management Test User',
            email: 'management@example.com',
            phone: '0771234567',
            subject: 'Management Test Subject',
            message: 'This is a test message for management testing.',
            status: 'new',
            priority: 'medium',
            quantity: 5,
            address: '123 Test Street',
            assignedTo: 'Test Agent',
            createdAt: new Date().toISOString()
        };
    }

    generateMultipleContacts(count = 5) {
        return Array.from({ length: count }, (_, index) => ({
            _id: `contact-${index + 1}`,
            name: `User ${index + 1}`,
            email: `user${index + 1}@example.com`,
            phone: `077${1000000 + index}`,
            subject: `Subject ${index + 1}`,
            message: `Message content for contact ${index + 1}`,
            status: ['new', 'contacted', 'in-progress', 'resolved'][index % 4],
            priority: ['low', 'medium', 'high', 'urgent'][index % 4],
            quantity: index + 1,
            address: `${index + 1} Test Street`,
            assignedTo: index % 2 === 0 ? 'Agent A' : 'Agent B',
            createdAt: new Date(Date.now() - index * 86400000).toISOString() // Different dates
        }));
    }
}

export default new ContactUsDataGenerators();