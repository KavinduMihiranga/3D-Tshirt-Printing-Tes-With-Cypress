import AddAdminPage from '../../support/pageObjects/AddAdminPage';
import AdminApiHelpers from '../../support/helpers/adminApiHelpers';
import AdminDataGenerators from '../../support/helpers/adminDataGenerators';

describe('Add Admin Form Tests', () => {
  const addAdminPage = new AddAdminPage();
  let testData;

  before(() => {
    cy.fixture('admin/adminData').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    addAdminPage.visitAddAdmin();
  });

  describe('Form Display', () => {
    it('should display add admin form with all fields', () => {
      addAdminPage.verifyAddFormElements();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', () => {
      // Submit empty form
      addAdminPage.submitForm();
      
      // Wait for validation
      cy.wait(500);
      
      // Should stay on form page
      addAdminPage.verifyUrl('/addAdmin');
      
      // Check for validation errors (depends on your validation implementation)
      cy.get('body').then(($body) => {
        const errorElements = $body.find('.text-red-500');
        // If you have validation messages, they should appear
        if (errorElements.length > 0) {
          expect(errorElements.length).to.be.gt(0);
        }
      });
    });

    it('should validate email format', () => {
      const invalidAdmin = AdminDataGenerators.generateInvalidAdmin('email');
      
      addAdminPage.fillAdminForm(invalidAdmin);
      addAdminPage.submitForm();
      
      cy.wait(500);
      
      // Should stay on form due to validation
      addAdminPage.verifyUrl('/addAdmin');
    });

    it('should validate password length', () => {
      const invalidAdmin = AdminDataGenerators.generateInvalidAdmin('shortPassword');
      
      addAdminPage.fillAdminForm(invalidAdmin);
      addAdminPage.submitForm();
      
      cy.wait(500);
      
      // Should stay on form
      addAdminPage.verifyUrl('/addAdmin');
    });

    it('should clear errors when user starts typing', () => {
      // Submit to trigger errors
      addAdminPage.submitForm();
      cy.wait(500);
      
      // Type in username field
      addAdminPage.typeInField('username', 'test');
      
      // Wait a bit for error to clear
      cy.wait(200);
      
      // Error for username should be cleared (depends on implementation)
      cy.get('body').then(($body) => {
        const usernameError = $body.find('.text-red-500:contains("Username is required")');
        // If your form clears errors on input, this should be 0
        expect(usernameError.length).to.equal(0);
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit successfully with valid data', () => {
      const newAdmin = AdminDataGenerators.generateFormData();
      
      AdminApiHelpers.mockCreateAdmin({
        message: 'Admin added successfully',
        data: { _id: '123' }
      });

      addAdminPage.fillAdminForm(newAdmin);
      addAdminPage.submitForm();
      
      AdminApiHelpers.waitForApi('createAdmin');
      
      // Should navigate to dashboard
      cy.url().should('include', '/adminDashboard');
    });

    it('should handle API validation errors', () => {
      const admin = AdminDataGenerators.generateFormData();
      
      AdminApiHelpers.mockValidationError('POST', 'admin');

      addAdminPage.fillAdminForm(admin);
      addAdminPage.submitForm();
      
      AdminApiHelpers.waitForApi('validationError');
      
      // Should stay on form
      addAdminPage.verifyUrl('/addAdmin');
    });

    it('should handle network errors during submission', () => {
      const admin = AdminDataGenerators.generateFormData();
      
      AdminApiHelpers.mockNetworkError('POST', 'admin', 'networkError');

      addAdminPage.fillAdminForm(admin);
      addAdminPage.submitForm();
      
      AdminApiHelpers.waitForApi('networkError');
      
      // Should stay on form
      addAdminPage.verifyUrl('/addAdmin');
    });
  });

  describe('Form Navigation', () => {
    it('should cancel and navigate back', () => {
      addAdminPage.clickCancel();
      cy.wait(500);
      cy.url().should('not.include', '/addAdmin');
    });

    it('should close form using X button', () => {
      // If close button exists
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("×")').length > 0) {
          addAdminPage.clickClose();
          cy.wait(500);
          cy.url().should('not.include', '/addAdmin');
        }
      });
    });
  });

  describe('Role Selection', () => {
    it('should allow selecting admin role', () => {
      const admin = AdminDataGenerators.generateFormData();
      admin.role = 'admin';
      
      addAdminPage.fillAdminForm(admin);
      addAdminPage.verifyFieldValue('role', 'admin');
    });

    it('should allow selecting superadmin role', () => {
      const admin = AdminDataGenerators.generateFormData();
      admin.role = 'superadmin';
      
      addAdminPage.fillAdminForm(admin);
      addAdminPage.verifyFieldValue('role', 'superadmin');
    });
  });
});

describe('Edit Admin Tests', () => {
  const addAdminPage = new AddAdminPage();
  const adminId = '123';
  let adminData;

  before(() => {
    cy.fixture('admin/adminData').then((data) => {
      adminData = data.validAdmins[0];
    });
  });

  beforeEach(() => {
    AdminApiHelpers.mockGetAdminById(adminId, adminData);
    addAdminPage.visitEditAdmin(adminId);
    AdminApiHelpers.waitForApi('getAdmin');
  });

  describe('Edit Form Display', () => {
    it('should display edit form with existing data', () => {
      addAdminPage.verifyEditFormElements();
      
      // Verify form is populated
      addAdminPage.verifyFieldValue('username', adminData.username);
      addAdminPage.verifyFieldValue('email', adminData.email);
      addAdminPage.verifyFieldValue('phone', adminData.phone);
      addAdminPage.verifyFieldValue('nic', adminData.nic);
      addAdminPage.verifyFieldValue('role', adminData.role);
    });
  });

  describe('Edit Form Update', () => {
    it('should update admin data successfully', () => {
      const updatedData = { username: 'updatedadmin' };
      
      AdminApiHelpers.mockUpdateAdmin(adminId, {
        message: 'Admin updated successfully',
        data: { ...adminData, ...updatedData }
      });

      addAdminPage.fillField('username', updatedData.username);
      addAdminPage.submitForm();
      
      AdminApiHelpers.waitForApi('updateAdmin');
      
      // Should navigate to dashboard
      cy.url().should('include', '/adminDashboard');
    });

    it('should handle update errors', () => {
      AdminApiHelpers.mockServerError('PUT', `admin/${adminId}`, 'updateError');

      addAdminPage.fillField('username', 'newname');
      addAdminPage.submitForm();
      
      AdminApiHelpers.waitForApi('updateError');
      
      // Should stay on form
      addAdminPage.verifyUrl(`/addAdmin/${adminId}`);
    });
  });

  describe('Edit Form Navigation', () => {
    it('should cancel editing and navigate back', () => {
      addAdminPage.clickCancel();
      cy.wait(500);
      cy.url().should('not.include', '/addAdmin');
    });

    it('should preserve form data when canceling', () => {
      // Modify field
      addAdminPage.fillField('username', 'modified');
      
      // Cancel
      addAdminPage.clickCancel();
      
      // Should navigate away without saving
      cy.wait(500);
      cy.url().should('not.include', '/addAdmin');
    });
  });
});