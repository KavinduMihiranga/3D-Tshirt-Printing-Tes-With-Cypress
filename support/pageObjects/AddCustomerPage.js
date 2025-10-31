import BasePage from './BasePage';

class AddCustomerPage extends BasePage {
  constructor() {
    super();
    this.addPath = '/addCustomer';
    
    // Selectors
    this.selectors = {
      addTitle: 'ADD CUSTOMER',
      editTitle: 'EDIT CUSTOMER',
      submitButton: 'button:contains("Submit")',
      updateButton: 'button:contains("Update")',
      cancelButton: 'button:contains("Cancel")',
      closeButton: 'button:contains("×")',
      formFields: {
        name: 'input[name="name"]',
        gender: 'input[name="gender"]',
        email: 'input[name="email"]',
        password: 'input[name="password"]',
        nic: 'input[name="nic"]',
        phone: 'input[name="phone"]',
        addressLine1: 'input[name="addressLine1"]',
        addressLine2: 'input[name="addressLine2"]',
        city: 'input[name="city"]',
        country: 'input[name="country"]'
      },
      labels: {
        name: 'label:contains("Name")',
        gender: 'label:contains("Gender")',
        email: 'label:contains("Email Address")',
        password: 'label:contains("Password")',
        nic: 'label:contains("NIC")',
        phone: 'label:contains("Phone Number")',
        addressLine1: 'label:contains("Address Line 1")',
        addressLine2: 'label:contains("Address Line 2")',
        city: 'label:contains("City")',
        country: 'label:contains("Country")'
      }
    };
  }

  visitAddCustomer() {
    this.visit(this.addPath);
  }

  visitEditCustomer(customerId) {
    this.visit(`${this.addPath}/${customerId}`);
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
    cy.get(this.selectors.updateButton).should('be.visible');
  }

  fillCustomerForm(customerData) {
    Object.keys(customerData).forEach(field => {
      if (this.selectors.formFields[field] && customerData[field] !== undefined) {
        cy.get(this.selectors.formFields[field]).clear().type(customerData[field]);
      }
    });
  }

  fillField(fieldName, value) {
    if (this.selectors.formFields[fieldName]) {
      cy.get(this.selectors.formFields[fieldName]).clear().type(value);
    }
  }

  clearField(fieldName) {
    if (this.selectors.formFields[fieldName]) {
      cy.get(this.selectors.formFields[fieldName]).clear();
    }
  }

  verifyFieldValue(fieldName, expectedValue) {
    if (this.selectors.formFields[fieldName]) {
      cy.get(this.selectors.formFields[fieldName]).should('have.value', expectedValue);
    }
  }

  verifyFormPopulatedWithData(customerData) {
    Object.keys(customerData).forEach(field => {
      if (this.selectors.formFields[field] && field !== 'password') {
        this.verifyFieldValue(field, customerData[field]);
      }
    });
  }

  clickSubmit() {
    cy.get(this.selectors.submitButton).click();
  }

  clickUpdate() {
    cy.get(this.selectors.updateButton).click();
  }

  clickCancel() {
    cy.get(this.selectors.cancelButton).click();
  }

  clickClose() {
    cy.get(this.selectors.closeButton).click();
  }

  submitForm() {
    this.clickSubmit();
  }

  updateForm() {
    this.clickUpdate();
  }
}

export default AddCustomerPage;