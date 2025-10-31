import EditOrderPage from '../../support/pageObjects/EditOrderPage';
import OrderApiHelpers from '../../support/helpers/orderApiHelpers';
import OrderDataGenerators from '../../support/helpers/orderDataGenerators';

describe('Edit Order', () => {
    const orderId = '123';
    const existingOrder = OrderDataGenerators.generateOrder({
        _id: orderId,
        customerName: 'Existing Customer',
        tShirtName: 'Existing Shirt',
        address: 'Existing Address',
        qty: 5,
        date: '2024-01-15',
        status: 'Pending'
    });
    const editPage = new EditOrderPage(orderId);

    beforeEach(() => {
        OrderApiHelpers.mockGetOrder(orderId, existingOrder);
        editPage.visit();
        cy.wait('@getOrder');
    });

    it('should display edit order form with existing data', () => {
        editPage
            .verifyPageLoaded()
            .verifyFormData(existingOrder);
    });

    it('should update order data successfully', () => {
        OrderApiHelpers.mockUpdateOrder(orderId);
        const updateData = OrderDataGenerators.getUpdateOrderData();
        
        editPage
            .updateForm(updateData)
            .submitUpdate();

        cy.wait('@updateOrder');
        cy.url().should('match', /\/orderDashboard|\/order/);
    });

    it('should handle update error', () => {
        OrderApiHelpers.mockServerError('PUT', `order/${orderId}`);
        const updateData = OrderDataGenerators.getUpdateOrderData();
        
        editPage
            .updateForm(updateData)
            .submitUpdate();

        cy.url().should('include', `/addOrder/${orderId}`);
    });

    it('should cancel editing and navigate back', () => {
        editPage.clickCancel();
        cy.url().should('not.include', '/addOrder');
    });

    it('should handle order not found error', () => {
        const invalidId = '999';
        const invalidPage = new EditOrderPage(invalidId);
        
        OrderApiHelpers.mockNotFoundError('GET', `order/${invalidId}`);
        invalidPage.visit();
        
        cy.get('form').should('exist');
    });
});