import EditProductPage from '../../support/pageObjects/EditProductPage';
import ProductApiHelpers from '../../support/helpers/productApiHelpers';
import ProductDataGenerators from '../../support/helpers/productDataGenerators';

describe('Edit Product', () => {
    const productId = '123';
    const existingProduct = ProductDataGenerators.generateProduct({
        _id: productId,
        name: 'Existing Product',
        category: 'Clothing',
        description: 'Existing description',
        price: 1999,
        qty: 50
    });
    const editPage = new EditProductPage(productId);
    const updateData = ProductDataGenerators.getUpdateProductData();

    beforeEach(() => {
        ProductApiHelpers.mockGetProduct(productId, existingProduct);
        editPage.visit();
        cy.wait('@getProduct');
    });

    it('should display form with existing data', () => {
        editPage
            .verifyPageLoaded()
            .verifyName('Existing Product')
            .verifyCategory('Clothing')
            .verifyDescription('Existing description')
            .verifyPrice(1999)
            .verifyQuantity(50);
    });

    it('should update product successfully', () => {
        ProductApiHelpers.mockUpdateProduct(productId);
        
        editPage
            .updateForm(updateData)
            .submit();

        cy.wait('@updateProduct');
        cy.url().should('include', '/productDashboard');
    });

    // it('should handle update errors', () => {
    //     ProductApiHelpers.mockError('PUT', `**/api/product/${productId}**`, 500);
        
    //     editPage
    //         .updateForm(updateData)
    //         .submit();

    //     cy.url().should('include', `/addProduct/${productId}`);
    // });
});