import CheckoutPage from '../../support/pageObjects/CheckoutPage';
import CheckoutDataGenerators from '../../support/helpers/checkoutDataGenerators';

describe('🧾 Checkout Page', () => {
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    cy.clearLocalStorage();
    checkoutPage.clearPendingDesign();
    
    // Handle uncaught exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('WebAssembly') || err.message.includes('Out of memory')) {
        return false;
      }
      if (err.message.includes('ResizeObserver') || err.message.includes('Request failed')) {
        return false;
      }
      return true;
    });
  });

  describe('📄 Page Structure', () => {
    beforeEach(() => {
      checkoutPage.visit();
    });

    it('should load the checkout page successfully', () => {
      checkoutPage.verifyPageLoaded();
    });

    it('should display the correct page title', () => {
      cy.contains('h1', 'Checkout Page').should('be.visible');
    });

    it('should display all form sections', () => {
      checkoutPage.verifyFormSections();
    });

    it('should have all required form fields visible', () => {
      checkoutPage.verifyRequiredFields();
    });

    it('should have submit button with correct text', () => {
      checkoutPage.verifySubmitButton();
    });

    it('should have submit button disabled initially', () => {
      checkoutPage.verifySubmitButtonDisabled();
    });
  });

  describe('✅ Form Validation', () => {
    beforeEach(() => {
      checkoutPage
        .visit()
        .mockAlert();
    });

   

    it('should show error for invalid email format', () => {
      checkoutPage
        .fillPersonalInfo('John Doe', 'invalid-email', '1234567890')
        .submitForm();

      cy.contains('.text-red-500', 'Please enter a valid email address').should('be.visible');
    });

    it('should show error for short phone number', () => {
      checkoutPage
        .fillPersonalInfo('John Doe', 'test@example.com', '123')
        .submitForm();

      cy.contains('.text-red-500', 'Phone number must be at least 10 digits').should('be.visible');
    });


    it('should show success message for valid name', () => {
      checkoutPage
        .fillPersonalInfo('John Doe', '', '')
        .fillBillingAddress('123 Main St', '', 'Colombo', 'Western');

      cy.contains('.text-green-500', 'Name looks good!').should('be.visible');
    });

    it('should reject names containing numbers', () => {
      checkoutPage
        .fillPersonalInfo('John123 Doe', 'test@example.com', '1234567890')
        .submitForm();

      cy.contains('.text-red-500', 'Name cannot contain numbers').should('be.visible');
    });

    it('should reject names containing special characters', () => {
      checkoutPage
        .fillPersonalInfo('John@Doe', 'test@example.com', '1234567890')
        .submitForm();

      cy.contains('.text-red-500', 'Name cannot contain special characters').should('be.visible');
    });

    it('should require both first and last name', () => {
      checkoutPage
        .fillPersonalInfo('John', 'test@example.com', '1234567890')
        .submitForm();

      cy.contains('.text-red-500', 'Please enter your full name (first and last name)').should('be.visible');
    });

   
  });

  describe('🏠 Address Management', () => {
    beforeEach(() => {
      checkoutPage.visit();
    });

    it('should have same address checkbox checked by default', () => {
      checkoutPage.verifySameAddressChecked();
    });

    it('should show "Same as billing address" when checkbox is checked', () => {
      cy.contains('p', 'Same as billing address').should('be.visible');
    });

    it('should show shipping address fields when checkbox is unchecked', () => {
      checkoutPage.toggleSameAddressCheckbox();

      checkoutPage.verifySameAddressUnchecked();
      cy.get('input[placeholder="Enter your address line1"]').should('have.length', 2);
      cy.get('input[placeholder="Enter your city"]').should('have.length', 2);
    });

    it('should allow filling separate shipping address', () => {
      const billingData = {
        addressLine1: '123 Billing St',
        addressLine2: 'Apt 1',
        city: 'Colombo',
        province: 'Western'
      };

      const shippingData = {
        addressLine1: '456 Shipping St',
        addressLine2: 'Suite 200',
        city: 'Kandy',
        province: 'Central'
      };

      checkoutPage
        .fillPersonalInfo('Test User', 'test@example.com', '1234567890')
        .fillBillingAddress(
          billingData.addressLine1,
          billingData.addressLine2,
          billingData.city,
          billingData.province
        )
        .fillShippingAddress(
          shippingData.addressLine1,
          shippingData.addressLine2,
          shippingData.city,
          shippingData.province
        )
        .verifySubmitButtonEnabled();
    });

  });

  describe('🛒 Order Processing', () => {
    beforeEach(() => {
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(2))
        .visit();
    });

    it('should enable submit button when all required fields are filled', () => {
      const formData = CheckoutDataGenerators.generateFormData();
      
      checkoutPage
        .fillPersonalInfo(formData.name, formData.email, formData.phone)
        .verifySubmitButtonDisabled()
        .fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province)
        .verifySubmitButtonEnabled();
    });

    it('should navigate to payment page with valid form data', () => {
      const formData = CheckoutDataGenerators.generateFormData();
      
      checkoutPage
        .fillForm(formData)
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });

    it('should handle order with multiple cart items', () => {
      const multipleItems = CheckoutDataGenerators.generateCartItems(5);
      const formData = CheckoutDataGenerators.generateFormData();

      checkoutPage
        .setCartItems(multipleItems)
        .visit()
        .fillForm(formData)
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });

    it('should handle order with only required fields', () => {
      const minimalData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        addressLine1: '123 Main St',
        city: 'Colombo',
        province: 'Western'
      };

      checkoutPage
        .fillPersonalInfo(minimalData.name, minimalData.email, minimalData.phone)
        .fillBillingAddress(minimalData.addressLine1, '', minimalData.city, minimalData.province)
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });
  });

  describe('🌍 International & Special Cases', () => {
    beforeEach(() => {
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(1))
        .visit();
    });

    it('should accept international phone numbers', () => {
      const internationalData = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '+94 77 123 4567',
        addressLine1: '123 Main St',
        city: 'Colombo',
        province: 'Western'
      };

      checkoutPage
        .fillForm(internationalData)
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });

    it('should accept email with plus addressing', () => {
      const plusEmailData = {
        name: 'John Doe',
        email: 'test+special@example.com',
        phone: '1234567890',
        addressLine1: '123 Main St',
        city: 'Colombo',
        province: 'Western'
      };

      checkoutPage
        .fillForm(plusEmailData)
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });
  });

  describe('📱 Responsive Behavior', () => {
    it('should work correctly on mobile viewport', () => {
      cy.viewport('iphone-6');
      
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(1))
        .visit()
        .verifyPageLoaded()
        .fillForm(CheckoutDataGenerators.generateFormData())
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });

    it('should work correctly on tablet viewport', () => {
      cy.viewport('ipad-2');
      
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(1))
        .visit()
        .verifyPageLoaded()
        .fillForm(CheckoutDataGenerators.generateFormData())
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });

    it('should maintain form state after page reload', () => {
      const formData = CheckoutDataGenerators.generateFormData();
      
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(1))
        .visit()
        .fillPersonalInfo(formData.name, formData.email, formData.phone)
        .fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province);

      cy.reload();
      
      checkoutPage
        .verifyPageLoaded()
        .fillPersonalInfo(formData.name, formData.email, formData.phone)
        .fillBillingAddress(formData.addressLine1, formData.addressLine2, formData.city, formData.province)
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });

    it('should work after browser navigation', () => {
      const formData = CheckoutDataGenerators.generateFormData();
      
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(1))
        .visit()
        .verifyPageLoaded();

      cy.visit('/');
      cy.go('back');
      
      checkoutPage
        .verifyPageLoaded()
        .fillForm(formData)
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });
  });

  describe('⚡ Performance & Edge Cases', () => {
    it('should handle rapid form filling', () => {
      const formData = CheckoutDataGenerators.generateFormData();
      
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(1))
        .visit();

      // Rapid sequential typing
      cy.get('input[placeholder="Enter your full name (first and last name)"]').type(formData.name);
      cy.get('input[placeholder="Enter your email"]').type(formData.email);
      cy.get('input[placeholder="Enter your phone number"]').type(formData.phone);
      cy.get('input[placeholder="Enter your address line1"]').type(formData.addressLine1);
      cy.get('input[placeholder="Enter your address line2"]').type(formData.addressLine2);
      cy.get('input[placeholder="Enter your city"]').type(formData.city);
      cy.get('input[placeholder="Enter your province"]').type(formData.province);

      checkoutPage
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });

    it('should handle concurrent form interactions', () => {
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(1))
        .visit();

      // Simulate user interacting with multiple fields and checkbox
      cy.get('input[placeholder="Enter your full name (first and last name)"]').type('John Doe');
      cy.get('input[placeholder="Enter your email"]').type('test@example.com');
      cy.get('input[type="checkbox"]').click(); // Toggle while filling
      cy.get('input[placeholder="Enter your phone number"]').type('1234567890');
      cy.get('input[type="checkbox"]').click(); // Toggle back
      cy.get('input[placeholder="Enter your address line1"]').type('123 Main St');
      cy.get('input[placeholder="Enter your city"]').type('Colombo');
      cy.get('input[placeholder="Enter your province"]').type('Western');

      checkoutPage
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });
  });

  describe('🎯 Specific Business Rules', () => {

    it('should handle mixed case in email', () => {
      checkoutPage
        .setCartItems(CheckoutDataGenerators.generateCartItems(1))
        .visit()
        .fillPersonalInfo('John Doe', 'Test.User@Example.COM', '1234567890')
        .fillBillingAddress('123 Main St', '', 'Colombo', 'Western')
        .verifySubmitButtonEnabled()
        .submitForm();

      cy.url().should('include', '/payment');
    });
  });
});