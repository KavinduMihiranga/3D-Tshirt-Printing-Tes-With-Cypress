class AdminDataGenerators {
  // Generate random admin data
  generateAdmin(overrides = {}) {
    const randomId = Math.floor(Math.random() * 10000);
    return {
      _id: `${randomId}`,
      username: `admin${randomId}`,
      email: `admin${randomId}@example.com`,
      password: 'Password123',
      phone: `077${1000000 + randomId}`,
      nic: `${100000000 + randomId}V`,
      role: 'admin',
      status: 'Active',
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }

  // Generate multiple admins
  generateMultipleAdmins(count, baseData = {}) {
    return Array.from({ length: count }, (_, i) => 
      this.generateAdmin({
        _id: `${i + 1}`,
        username: `admin${i + 1}`,
        email: `admin${i + 1}@example.com`,
        phone: `077${1000000 + i}`,
        nic: `${100000000 + i}V`,
        ...baseData
      })
    );
  }

  // Generate admin for testing pagination
  generatePaginationData(totalCount = 15) {
    return this.generateMultipleAdmins(totalCount);
  }

  // Generate admin with specific role
  generateAdminWithRole(role) {
    return this.generateAdmin({ role });
  }

  // Generate admin with specific status
  generateAdminWithStatus(status) {
    return this.generateAdmin({ status });
  }

  // Generate admin for form testing
  generateFormData(includePassword = true) {
    const data = {
      username: 'testadmin',
      email: 'test@example.com',
      phone: '0771234567',
      nic: '123456789V',
      role: 'admin'
    };
    
    if (includePassword) {
      data.password = 'TestPass123';
    }
    
    return data;
  }

  // Generate invalid admin data
  generateInvalidAdmin(invalidField) {
    const admin = this.generateFormData();
    
    switch (invalidField) {
      case 'email':
        admin.email = 'invalid-email';
        break;
      case 'phone':
        admin.phone = 'invalid-phone';
        break;
      case 'emptyUsername':
        admin.username = '';
        break;
      case 'emptyEmail':
        admin.email = '';
        break;
      case 'shortPassword':
        admin.password = '123';
        break;
      default:
        break;
    }
    
    return admin;
  }

  // Generate edge case data
  generateEdgeCaseData(caseType) {
    switch (caseType) {
      case 'longUsername':
        return this.generateAdmin({ username: 'A'.repeat(100) });
      case 'specialCharacters':
        return this.generateAdmin({ username: '@#$%^&*()' });
      case 'maxLength':
        return this.generateAdmin({
          email: 'a'.repeat(200) + '@example.com'
        });
      case 'nullValues':
        return this.generateAdmin({
          username: null,
          phone: null,
          nic: null
        });
      default:
        return this.generateAdmin();
    }
  }

  // Generate different role admins
  generateAdminsByRole() {
    return {
      admin: this.generateAdmin({ role: 'admin' }),
      superadmin: this.generateAdmin({ role: 'superadmin' })
    };
  }

  // Generate different status admins
  generateAdminsByStatus() {
    return {
      active: this.generateAdmin({ status: 'Active' }),
      inactive: this.generateAdmin({ status: 'Inactive' })
    };
  }

  // Generate API response
  generateApiResponse(type, data = null) {
    const responses = {
      success: {
        message: 'Operation successful',
        data: data
      },
      created: {
        message: 'Admin added successfully',
        data: { _id: data?._id || '123' }
      },
      updated: {
        message: 'Admin updated successfully',
        data: data
      },
      deleted: {
        message: 'Admin deleted successfully'
      },
      error: {
        message: 'An error occurred'
      },
      validationError: {
        message: 'Validation error',
        errors: data || []
      },
      unauthorized: {
        message: 'Session expired. Please login again.'
      }
    };

    return responses[type] || responses.success;
  }
}

export default new AdminDataGenerators();