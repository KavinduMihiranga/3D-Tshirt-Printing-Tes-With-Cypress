// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// Import commands.js
// Import commands.js
import './commands'

import './pageObjects/BasePage';
import './pageObjects/AnnouncementDashboardPage';
import './pageObjects/AddAnnouncementPage';
import './pageObjects/EditAnnouncementPage';
import './helpers/announcementApiHelpers';
import './helpers/announcementDataGenerators';

// Product imports
import './pageObjects/ProductDashboardPage';
import './pageObjects/AddProductPage';
import './pageObjects/EditProductPage';
import './pageObjects/ProductDetailPage';
import './helpers/productApiHelpers';
import './helpers/productDataGenerators';

// Order imports
import './pageObjects/OrderDashboardPage';
import './pageObjects/AddOrderPage';
import './pageObjects/EditOrderPage';
import './helpers/orderApiHelpers';
import './helpers/orderDataGenerators';

// cypress/support/e2e.js
import './pageObjects/DesignDashboardPage';
import './helpers/designApiHelpers';
import './helpers/designDataGenerators';

import './pageObjects/CartPage';
import './helpers/CartApiHelpers';
import './helpers/cartDataGenerators';

// cypress/support/e2e.js

import './pageObjects/CheckoutPage';
import './helpers/checkoutApiHelpers';
import './helpers/checkoutDataGenerators';

// cypress/support/e2e.js


// Auth Page Objects
import './pageObjects/LoginPage';
import './pageObjects/ForgotPasswordPage';
import './pageObjects/ResetPasswordPage';

// Auth Helpers
import './helpers/AuthApiHelpers';
import './helpers/AuthDataGenerators';

// Contact Us Page Object
import './pageObjects/ContactUsPage';
import './helpers/contactUsDataGenerators';
import './pageObjects/ContactUsPage';
import './pageObjects/ContactUsManagementPage';


// Global beforeEach hook
beforeEach(() => {
  // Set up any global test configurations
  cy.viewport(1280, 720)
  
  // Handle uncaught exceptions
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
  })

  Cypress.on('uncaught:exception', (err, runnable) => {
        console.error('Checkout Test Error:', err);
        return false;
    });
})