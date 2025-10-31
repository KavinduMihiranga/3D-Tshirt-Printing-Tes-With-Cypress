class DataGenerators {
  // Generate random customer data
  generateCustomer(overrides = {}) {
    const randomId = Math.floor(Math.random() * 10000);
    return {
      _id: `${randomId}`,
      name: `Customer ${randomId}`,
      gender: 'Male',
      email: `customer${randomId}@example.com`,
      password: 'Password123',
      nic: `${randomId}V`,
      phone: `077${1000000 + randomId}`,
      addressLine1: `${randomId} Main Street`,
      addressLine2: 'Apt 1A',
      city: 'Colombo',
      country: 'Sri Lanka',
      status: 'Active',
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }

  // Generate multiple customers
  generateMultipleCustomers(count, baseData = {}) {
    return Array.from({ length: count }, (_, i) => 
      this.generateCustomer({
        _id: `${i + 1}`,
        name: `Customer${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `077${1000000 + i}`,
        addressLine1: `Address ${i + 1}`,
        ...baseData
      })
    );
  }

  // Generate customer for testing pagination
  generatePaginationData(totalCount = 15) {
    return this.generateMultipleCustomers(totalCount);
  }

  // Generate customer with specific status
  generateCustomerWithStatus(status) {
    return this.generateCustomer({ status });
  }

  // Generate customer for form testing
  generateFormData(includePassword = true) {
    const data = {
      name: 'Test Customer',
      gender: 'Female',
      email: 'test@example.com',
      nic: '123456789V',
      phone: '0771234567',
      addressLine1: '123 Test Street',
      addressLine2: 'Unit 5',
      city: 'Kandy',
      country: 'Sri Lanka'
    };
    
    if (includePassword) {
      data.password = 'TestPass123';
    }
    
    return data;
  }

  // Generate invalid customer data
  generateInvalidCustomer(invalidField) {
    const customer = this.generateFormData();
    
    switch (invalidField) {
      case 'email':
        customer.email = 'invalid-email';
        break;
      case 'phone':
        customer.phone = 'invalid-phone';
        break;
      case 'emptyName':
        customer.name = '';
        break;
      case 'emptyEmail':
        customer.email = '';
        break;
      default:
        break;
    }
    
    return customer;
  }

  // Generate edge case data
  generateEdgeCaseData(caseType) {
    switch (caseType) {
      case 'longName':
        return this.generateCustomer({ name: 'A'.repeat(100) });
      case 'specialCharacters':
        return this.generateCustomer({ name: '@#$%^&*()' });
      case 'maxLength':
        return this.generateCustomer({
          addressLine1: 'A'.repeat(200)
        });
      default:
        return this.generateCustomer();
    }
  }

  // Generate API response
  generateApiResponse(type, data = null) {
    const responses = {
      success: {
        message: 'Operation successful',
        data: data
      },
      created: {
        message: 'Customer created successfully',
        data: { _id: data?._id || '123' }
      },
      updated: {
        message: 'Customer updated successfully',
        data: data
      },
      deleted: {
        message: 'Customer deleted successfully'
      },
      error: {
        message: 'An error occurred'
      },
      validationError: {
        message: 'Validation error',
        errors: data || []
      }
    };

    return responses[type] || responses.success;
  }
}

export default new DataGenerators();