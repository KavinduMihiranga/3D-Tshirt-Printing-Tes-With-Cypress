// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom Cypress commands for announcement tests
// Custom Cypress commands for announcement tests

Cypress.Commands.add('createAnnouncement', (title, content) => {
  cy.visit('/addAnnouncement')
  cy.get('[data-testid="title-input"]').type(title)
  cy.get('[data-testid="content-textarea"]').type(content)
  cy.get('[data-testid="save-button"]').click()
})

Cypress.Commands.add('deleteAnnouncement', (index = 0) => {
  cy.get(`[data-testid="delete-button-${index}"]`).click()
})

Cypress.Commands.add('editAnnouncement', (index = 0, newTitle, newContent) => {
  cy.get(`[data-testid="edit-button-${index}"]`).click()
  
  cy.get('[data-testid="title-input"]').clear().type(newTitle)
  cy.get('[data-testid="content-textarea"]').clear().type(newContent)
  cy.get('[data-testid="update-button"]').click()
})

Cypress.Commands.add('navigateToAnnouncements', () => {
  cy.visit('/announcements')
})

Cypress.Commands.add('navigateToAddAnnouncement', () => {
  cy.visit('/addAnnouncement')
})

// Command to mock cart context
Cypress.Commands.add('mockCartContext', () => {
  cy.window().then((win) => {
    // Set up localStorage that might be used by CartContext
    win.localStorage.setItem('cart', JSON.stringify([]));
    win.localStorage.setItem('cart-total', '0');
  });
});

// Command to visit product page with state
Cypress.Commands.add('visitProductWithState', (productId, productData) => {
  cy.visit(`http://localhost:5173/product/${productId}`, {
    state: productData
  });
});

// Command to check product details
Cypress.Commands.add('verifyProductDetails', (product) => {
  cy.contains(product.title || product.name).should('be.visible');
  cy.contains(`Rs. ${product.price}`).should('be.visible');
  if (product.description) {
    cy.contains(product.description).should('be.visible');
  }
});

// ***********************************************
// Custom commands for Customer Management
// ***********************************************

// Comment out or remove these problematic imports
// import ApiHelpers from './helpers/apiHelpers';
// import DataGenerators from './helpers/dataGenerators';

// Login command
Cypress.Commands.add('loginAsAdmin', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
  });
});

// Load fixture data
Cypress.Commands.add('loadFixture', (fixturePath) => {
  return cy.fixture(fixturePath);
});

// Stub window methods
Cypress.Commands.add('stubWindowMethods', (methods = {}) => {
  cy.window().then((win) => {
    if (methods.confirm !== undefined) {
      cy.stub(win, 'confirm').returns(methods.confirm);
    }
    if (methods.alert !== undefined) {
      cy.stub(win, 'alert').as('alertStub');
    }
  });
});

// Wait for table to load
Cypress.Commands.add('waitForTableLoad', (timeout = 10000) => {
  cy.get('table', { timeout }).should('be.visible');
  cy.contains('Loading...').should('not.exist');
});

// Mock customer list API - UPDATED to remove imports
Cypress.Commands.add('mockCustomerList', (customers = []) => {
  cy.intercept('GET', '**/api/customers**', {
    statusCode: 200,
    body: { data: customers }
  }).as('getCustomers');
});

// Mock customer CRUD operations - UPDATED to remove imports
Cypress.Commands.add('mockCustomerCRUD', (customerId, customerData) => {
  // Mock get customer by ID
  cy.intercept('GET', `**/api/customers/${customerId}**`, {
    statusCode: 200,
    body: { data: customerData }
  }).as('getCustomer');
  
  // Mock update customer
  cy.intercept('PUT', `**/api/customers/${customerId}**`, {
    statusCode: 200,
    body: { message: 'Customer updated successfully', data: customerData }
  }).as('updateCustomer');
  
  // Mock delete customer
  cy.intercept('DELETE', `**/api/customers/${customerId}**`, {
    statusCode: 200,
    body: { message: 'Customer deleted successfully' }
  }).as('deleteCustomer');
});

// Generate and mock customer data - UPDATED to remove imports
Cypress.Commands.add('generateAndMockCustomers', (count = 5) => {
  const customers = Array.from({ length: count }, (_, i) => ({
    _id: `${i + 1}`,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `123-456-78${i}`
  }));
  
  cy.intercept('GET', '**/api/customers**', {
    statusCode: 200,
    body: { data: customers }
  }).as('getCustomers');
  
  return cy.wrap(customers);
});

// Fill customer form
Cypress.Commands.add('fillCustomerForm', (customerData) => {
  Object.keys(customerData).forEach(field => {
    if (customerData[field]) {
      cy.get(`input[name="${field}"]`).clear().type(customerData[field]);
    }
  });
});

// Verify customer in table
Cypress.Commands.add('verifyCustomerInTable', (customerName, shouldExist = true) => {
  if (shouldExist) {
    cy.contains('tr', customerName).should('be.visible');
  } else {
    cy.contains('tr', customerName).should('not.exist');
  }
});

// Navigate with authentication
Cypress.Commands.add('authenticatedVisit', (url) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
    }
  });
});

// Mock API with delay
Cypress.Commands.add('mockApiWithDelay', (method, endpoint, response, delay = 2000) => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  cy.intercept(method, `${apiUrl}/${endpoint}`, (req) => {
    req.reply({
      statusCode: 200,
      body: response,
      delay: delay
    });
  }).as('delayedResponse');
});

// Wait for multiple API calls
Cypress.Commands.add('waitForApis', (...aliases) => {
  aliases.forEach(alias => {
    cy.wait(`@${alias}`);
  });
});

// ***********************************************
// Custom commands for Admin Management
// ***********************************************

// Comment out or remove these problematic imports
// import AdminApiHelpers from './helpers/adminApiHelpers';
// import AdminDataGenerators from './helpers/adminDataGenerators';

// Mock admin list API - UPDATED to remove imports
Cypress.Commands.add('mockAdminList', (admins = []) => {
  cy.intercept('GET', '**/api/admins**', {
    statusCode: 200,
    body: { data: admins }
  }).as('getAdmins');
});

// Mock admin CRUD operations - UPDATED to remove imports
Cypress.Commands.add('mockAdminCRUD', (adminId, adminData) => {
  // Mock get admin by ID
  cy.intercept('GET', `**/api/admins/${adminId}**`, {
    statusCode: 200,
    body: { data: adminData }
  }).as('getAdmin');
  
  // Mock update admin
  cy.intercept('PUT', `**/api/admins/${adminId}**`, {
    statusCode: 200,
    body: { message: 'Admin updated successfully', data: adminData }
  }).as('updateAdmin');
  
  // Mock delete admin
  cy.intercept('DELETE', `**/api/admins/${adminId}**`, {
    statusCode: 200,
    body: { message: 'Admin deleted successfully' }
  }).as('deleteAdmin');
});

// Generate and mock admin data - UPDATED to remove imports
Cypress.Commands.add('generateAndMockAdmins', (count = 5) => {
  const admins = Array.from({ length: count }, (_, i) => ({
    _id: `${i + 1}`,
    username: `admin${i + 1}`,
    email: `admin${i + 1}@example.com`,
    role: i === 0 ? 'superadmin' : 'admin'
  }));
  
  cy.intercept('GET', '**/api/admins**', {
    statusCode: 200,
    body: { data: admins }
  }).as('getAdmins');
  
  return cy.wrap(admins);
});

// Fill admin form
Cypress.Commands.add('fillAdminForm', (adminData) => {
  Object.keys(adminData).forEach(field => {
    if (adminData[field]) {
      if (field === 'role') {
        cy.get(`select[name="${field}"]`).select(adminData[field]);
      } else {
        cy.get(`input[name="${field}"]`).clear().type(adminData[field]);
      }
    }
  });
});

// Verify admin in table
Cypress.Commands.add('verifyAdminInTable', (username, shouldExist = true) => {
  if (shouldExist) {
    cy.contains('tr', username).should('be.visible');
  } else {
    cy.contains('tr', username).should('not.exist');
  }
});

// Product Management Commands - UPDATED to remove imports
Cypress.Commands.add('mockProductList', (products = []) => {
  cy.intercept('GET', '**/api/product**', {
    statusCode: 200,
    body: { data: products }
  }).as('getProducts');
});

Cypress.Commands.add('fillProductForm', (productData) => {
  Object.keys(productData).forEach(field => {
    if (productData[field]) {
      const selector = `[name="${field}"], #${field}, [data-testid="${field}-input"]`;
      cy.get(selector).clear().type(productData[field].toString());
    }
  });
});

Cypress.Commands.add('mockProductCRUD', (productId, productData) => {
  // Mock get product by ID
  cy.intercept('GET', `**/api/product/${productId}**`, {
    statusCode: 200,
    body: { data: productData }
  }).as('getProduct');
  
  // Mock update product
  cy.intercept('PUT', `**/api/product/${productId}**`, {
    statusCode: 200,
    body: { message: 'Product updated successfully', data: productData }
  }).as('updateProduct');
  
  // Mock delete product
  cy.intercept('DELETE', `**/api/product/${productId}**`, {
    statusCode: 200,
    body: { message: 'Product deleted successfully' }
  }).as('deleteProduct');
});

Cypress.Commands.add('generateAndMockProducts', (count = 5) => {
  const products = Array.from({ length: count }, (_, i) => ({
    _id: `${i + 1}`,
    name: `Product ${i + 1}`,
    title: `Product ${i + 1} Title`,
    description: `Description for product ${i + 1}`,
    category: ['Clothing', 'Accessories', 'Electronics'][i % 3],
    price: (i + 1) * 1000,
    qty: (i + 1) * 10,
    status: 'in stock'
  }));
  
  cy.intercept('GET', '**/api/product**', {
    statusCode: 200,
    body: { data: products }
  }).as('getProducts');
  
  return cy.wrap(products);
});

Cypress.Commands.add('verifyProductInTable', (productName, shouldExist = true) => {
  if (shouldExist) {
    cy.contains('tr', productName).should('be.visible');
  } else {
    cy.contains('tr', productName).should('not.exist');
  }
});

// ***********************************************
// Announcement Management Commands - UPDATED
// ***********************************************

// Simple announcement commands without imports
Cypress.Commands.add('createAnnouncement', (title, content) => {
  cy.visit('/addAnnouncement');
  cy.get('input[name="title"]').type(title);
  cy.get('textarea[name="content"]').type(content);
  cy.contains('button', 'Save Announcement').click();
});

Cypress.Commands.add('deleteAnnouncement', (announcementTitle) => {
  cy.contains('tr', announcementTitle).within(() => {
    cy.contains('Delete').click();
  });
});

Cypress.Commands.add('editAnnouncement', (oldTitle, newTitle, newContent) => {
  cy.contains('tr', oldTitle).within(() => {
    cy.contains('Edit').click();
  });
  
  cy.get('input[name="title"]').clear().type(newTitle);
  cy.get('textarea[name="content"]').clear().type(newContent);
  cy.contains('button', 'Update Announcement').click();
});

Cypress.Commands.add('mockAnnouncements', (announcements = []) => {
  cy.intercept('GET', '**/api/announcements**', {
    statusCode: 200,
    body: announcements
  }).as('getAnnouncements');
});

Cypress.Commands.add('verifyAnnouncementInTable', (title, shouldExist = true) => {
  if (shouldExist) {
    cy.contains('tr', title).should('be.visible');
  } else {
    cy.contains('tr', title).should('not.exist');
  }
});

// Additional announcement commands
Cypress.Commands.add('setAdminToken', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('adminToken', 'test-token-123');
  });
});

Cypress.Commands.add('mockCreateAnnouncement', (responseData = { message: 'Announcement created successfully' }) => {
  cy.intercept('POST', '**/api/announcements**', {
    statusCode: 201,
    body: responseData
  }).as('createAnnouncement');
});

Cypress.Commands.add('mockUpdateAnnouncement', (announcementId, responseData = { message: 'Announcement updated successfully' }) => {
  cy.intercept('PUT', `**/api/announcements/${announcementId}**`, {
    statusCode: 200,
    body: responseData
  }).as('updateAnnouncement');
});

Cypress.Commands.add('mockDeleteAnnouncement', (announcementId) => {
  cy.intercept('DELETE', `**/api/announcements/${announcementId}**`, {
    statusCode: 200,
    body: { message: 'Announcement deleted successfully' }
  }).as('deleteAnnouncement');
});

Cypress.Commands.add('mockGetAnnouncement', (announcementId, announcementData) => {
  cy.intercept('GET', `**/api/announcements/${announcementId}**`, {
    statusCode: 200,
    body: announcementData
  }).as('getAnnouncement');
});

// Order Management Commands
Cypress.Commands.add('createOrder', (orderData) => {
    cy.visit('/addOrder');
    cy.get('input[name="customerName"]').type(orderData.customerName);
    cy.get('input[name="tShirtName"]').type(orderData.tShirtName);
    cy.get('input[name="address"]').type(orderData.address);
    cy.get('input[name="qty"]').type(orderData.qty);
    cy.get('form').submit();
});

Cypress.Commands.add('mockOrders', (orders = []) => {
    const OrderApiHelpers = require('../support/helpers/orderApiHelpers').default;
    OrderApiHelpers.mockGetOrders(orders);
});

// Design Management Commands
Cypress.Commands.add('createTextDesign', (text = 'Test Design') => {
    const dashboardPage = new DesignDashboardPage();
    dashboardPage
        .mockPromptResponse(text)
        .clickAddText();
});

Cypress.Commands.add('uploadDesignImage', () => {
    const dashboardPage = new DesignDashboardPage();
    const testImage = DesignDataGenerators.getTestImageFile();
    dashboardPage.uploadImage(testImage.fileName, testImage.fileContent);
});

Cypress.Commands.add('setupDesignOrder', (sizeQuantities = { XS: 2, M: 3 }) => {
    const dashboardPage = new DesignDashboardPage();
    
    // Add design
    dashboardPage
        .mockPromptResponse('Test Order Design')
        .clickAddText();

    // Set quantities
    Object.entries(sizeQuantities).forEach(([size, quantity]) => {
        dashboardPage.setSizeQuantity(size, quantity);
    });

    return dashboardPage;
});

Cypress.Commands.add('mockDesignAPI', () => {
    DesignApiHelpers.mockDesignInquirySuccess();
});

// Cart Page Commands
Cypress.Commands.add('visitCartPage', (cartData = null) => {
    const cartPage = new CartPage();
    if (cartData) {
        cartPage.setCartData(cartData);
    }
    return cartPage.visit();
});

Cypress.Commands.add('setupCartWithItems', (itemCount = 1) => {
    const cartPage = new CartPage();
    const cartData = CartDataGenerators.generateMultipleCartItems(itemCount);
    return cartPage.setCartData(cartData).visit();
});

Cypress.Commands.add('verifyCartStructure', () => {
    const cartPage = new CartPage();
    return cartPage
        .verifyPageLoaded()
        .findCartItems()
        .then($items => {
            if ($items) {
                return cy.wrap($items).should('exist');
            }
            // Fallback verification
            return cartPage.verifyCheckoutButton();
        });
});

Cypress.Commands.add('mockCartCheckout', () => {
    CartApiHelpers.mockCheckoutSuccess();
});

// Checkout Page Commands
Cypress.Commands.add('visitCheckoutPage', (options = {}) => {
    const checkoutPage = new CheckoutPage();
    
    if (options.designData) {
        checkoutPage.setPendingDesign(options.designData);
    }
    
    if (options.cartItems) {
        checkoutPage.setCartItems(options.cartItems);
    }
    
    return checkoutPage.visit();
});

Cypress.Commands.add('fillCheckoutForm', (formData = {}) => {
    const checkoutPage = new CheckoutPage();
    const defaultData = CheckoutDataGenerators.generateFormData();
    const dataToFill = { ...defaultData, ...formData };
    
    return checkoutPage.fillForm(dataToFill);
});

Cypress.Commands.add('submitDesignOrder', (formData = {}) => {
    const checkoutPage = new CheckoutPage();
    CheckoutApiHelpers.mockDesignInquirySuccess();
    
    return checkoutPage
        .setPendingDesign(CheckoutDataGenerators.generatePendingDesign())
        .visit()
        .fillForm(formData)
        .submitForm();
});

Cypress.Commands.add('mockCheckoutAPI', () => {
    CheckoutApiHelpers.mockDesignInquirySuccess();
    return CheckoutApiHelpers.mockRegularOrderSuccess();
});

import LoginPage from './pageObjects/LoginPage';
import ForgotPasswordPage from './pageObjects/ForgotPasswordPage';
import ResetPasswordPage from './pageObjects/ResetPasswordPage';
import AuthApiHelpers from './helpers/AuthApiHelpers';
import AuthDataGenerators from './helpers/AuthDataGenerators';

// Login Commands
Cypress.Commands.add('loginAsAdmin', (credentials = {}) => {
    const loginPage = new LoginPage();
    const loginData = { ...AuthDataGenerators.generateLoginData(), ...credentials };
    AuthApiHelpers.mockLoginSuccess();
    
    return loginPage
        .visit()
        .fillEmail(loginData.email)
        .fillPassword(loginData.password)
        .clickSubmit();
});

Cypress.Commands.add('fillSampleCredentials', () => {
    const loginPage = new LoginPage();
    return loginPage.clickFillSampleCredentials();
});

// Forgot Password Commands
Cypress.Commands.add('requestPasswordReset', (email = 'test@example.com') => {
    const forgotPage = new ForgotPasswordPage();
    AuthApiHelpers.mockForgotPasswordSuccess();
    
    return forgotPage
        .visit()
        .fillEmail(email)
        .clickSubmit();
});

// Reset Password Commands
Cypress.Commands.add('resetPassword', (newPassword = 'newpassword123', token = 'valid-token') => {
    const resetPage = new ResetPasswordPage(token);
    AuthApiHelpers.mockResetPasswordSuccess();
    
    return resetPage
        .visit()
        .fillBothPasswords(newPassword)
        .clickSubmit();
});

// Mock Helpers
Cypress.Commands.add('mockAuthAPI', () => {
    AuthApiHelpers.mockLoginSuccess();
    AuthApiHelpers.mockForgotPasswordSuccess();
    AuthApiHelpers.mockResetPasswordSuccess();
});


import DashboardPage from './pageObjects/DashboardPage';

// Dashboard Commands
Cypress.Commands.add('visitDashboard', () => {
    const dashboardPage = new DashboardPage();
    return dashboardPage.visit();
});

Cypress.Commands.add('mockDashboardProducts', (products = null, statusCode = 200) => {
    const dashboardPage = new DashboardPage();
    return dashboardPage.mockProductsAPI(products, statusCode);
});

Cypress.Commands.add('navigateFromDashboard', (page) => {
    const dashboardPage = new DashboardPage();
    
    switch(page) {
        case 'product':
            return dashboardPage.navigateToProductPage();
        case 'design':
            return dashboardPage.navigateToDesignPage();
        case 'about':
            return dashboardPage.navigateToAboutPage();
        case 'contact':
            return dashboardPage.navigateToContactPage();
        default:
            return dashboardPage;
    }
});

