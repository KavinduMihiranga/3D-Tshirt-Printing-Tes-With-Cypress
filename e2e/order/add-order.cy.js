import AddOrderPage from '../../support/pageObjects/AddOrderPage';
import OrderApiHelpers from '../../support/helpers/orderApiHelpers';
import OrderDataGenerators from '../../support/helpers/orderDataGenerators';

describe('Add Order', () => {
    const addPage = new AddOrderPage();

    beforeEach(() => {
        addPage.visit();
    });

    it('should display add order form with all fields', () => {
        addPage
            .verifyPageLoaded()
            .verifyFormFields();

        cy.contains('button', 'Cancel').should('be.visible');
    });

    it('should submit order form successfully', () => {
        OrderApiHelpers.mockCreateOrder();
        const validData = OrderDataGenerators.getValidOrderData();
        
        addPage
            .fillForm(validData)
            .submit();

        cy.wait('@createOrder');
        cy.url().should('match', /\/orderDashboard|\/order/);
    });

    it('should handle form validation errors', () => {
        OrderApiHelpers.mockValidationError('POST', 'order');
        
        addPage.submit();
        cy.url().should('include', '/addOrder');
    });

    it('should cancel and navigate back', () => {
        addPage.clickCancel();
        cy.url().should('not.include', '/addOrder');
    });

    it('should close form using X button', () => {
        addPage.clickCloseButton();
        cy.url().should('not.include', '/addOrder');
    });

    it('should handle network errors during submission', () => {
        OrderApiHelpers.mockNetworkError('POST', 'order');
        const validData = OrderDataGenerators.getValidOrderData();
        
        addPage
            .fillForm(validData)
            .submit();

        cy.url().should('include', '/addOrder');
    });
});