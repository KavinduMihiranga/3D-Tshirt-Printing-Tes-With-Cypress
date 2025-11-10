import BasePage from './BasePage';

class AddAdminPage extends BasePage {
  constructor() {
    super();
    this.addPath = '/addAdmin';
    
    // Selectors
    this.selectors = {
      addTitle: 'ADD ADMIN',
      editTitle: 'EDIT ADMIN',
      submitButton: 'button[type="submit"]',
      cancelButton: 'button:contains("Cancel")',
      closeButton: 'button:contains("×")',
      formFields: {
        username: 'input[name="username"]',
        email: 'input[name="email"]',
        password: 'input[name="password"]',
        phone: 'input[name="phone"]',
        nic: 'input[name="nic"]',
        role: 'select[name="role"]'
      },
      labels: {
        username: 'label:contains("Username")',
        email: 'label:contains("Email")',
        password: 'label:contains("Password")',
        phone: 'label:contains("Phone")',
        nic: 'label:contains("NIC")',
        role: 'label:contains("Role")'
      },
      errorMessage: '.text-red-500',
      errorBorder: '.border-red-500'
    };
  }

  visitAddAdmin() {
    this.visit(this.addPath);
  }

  visitEditAdmin(adminId) {
    this.visit(`${this.addPath}/${adminId}`);
  }

  verifyAddFormElements() {
    this.verifyText(this.selectors.addTitle);
    Object.values(this.selectors.labels).forEach(label => {
      cy.get(label).should('be.visible');
    });
    cy.get(this.selectors.cancelButton).should('be.visible');
    cy.get(this.selectors.submitButton).should('be.visible');
  }

  verifyEditFormElements() {
    this.verifyText(this.selectors.editTitle);
    cy.get(this.selectors.submitButton).should('be.visible');
  }

  fillAdminForm(adminData) {
    Object.keys(adminData).forEach(field => {
      if (this.selectors.formFields[field] && adminData[field] !== undefined) {
        if (field === 'role') {
          cy.get(this.selectors.formFields[field]).select(adminData[field]);
        } else {
          cy.get(this.selectors.formFields[field]).clear().type(adminData[field]);
        }
      }
    });
  }

  fillField(fieldName, value) {
    if (this.selectors.formFields[fieldName]) {
      if (fieldName === 'role') {
        cy.get(this.selectors.formFields[fieldName]).select(value);
      } else {
        cy.get(this.selectors.formFields[fieldName]).clear().type(value);
      }
    }
  }

  clearField(fieldName) {
    if (this.selectors.formFields[fieldName] && fieldName !== 'role') {
      cy.get(this.selectors.formFields[fieldName]).clear();
    }
  }

  verifyFieldValue(fieldName, expectedValue) {
    if (this.selectors.formFields[fieldName]) {
      cy.get(this.selectors.formFields[fieldName]).should('have.value', expectedValue);
    }
  }

  verifyFormPopulatedWithData(adminData) {
    Object.keys(adminData).forEach(field => {
      if (this.selectors.formFields[field] && field !== 'password') {
        this.verifyFieldValue(field, adminData[field]);
      }
    });
  }

  submitForm() {
    cy.get(this.selectors.submitButton).click();
  }

  clickCancel() {
    cy.get(this.selectors.cancelButton).click();
  }

  clickClose() {
    cy.get(this.selectors.closeButton).click();
  }

  verifyValidationError(fieldName, errorMessage) {
    // Check for error message near the field
    cy.get(this.selectors.formFields[fieldName])
      .parent()
      .find(this.selectors.errorMessage)
      .should('contain', errorMessage);
  }

  verifyFieldHasError(fieldName) {
    cy.get(this.selectors.formFields[fieldName])
      .should('have.class', 'border-red-500');
  }

  verifyNoValidationErrors() {
    cy.get(this.selectors.errorMessage).should('not.exist');
  }

  typeInField(fieldName, text) {
    if (this.selectors.formFields[fieldName]) {
      cy.get(this.selectors.formFields[fieldName]).type(text);
    }
  }
}

export default AddAdminPage;