import ProductDetailPage from '../../support/pageObjects/ProductDetailPage';
import ProductApiHelpers from '../../support/helpers/productApiHelpers';
import ProductDataGenerators from '../../support/helpers/productDataGenerators';

describe('Product Detail', () => {
    const productId = '123';
    const testProduct = ProductDataGenerators.generateProduct({
        _id: productId,
        name: 'Test Product',
        category: 'Electronics',
        price: 2999,
        qty: 15,
        status: 'in stock',
        description: 'Detailed product description'
    });
    const detailPage = new ProductDetailPage(productId);

    beforeEach(() => {
        ProductApiHelpers.mockGetProduct(productId, testProduct);
        detailPage.visit();
        cy.wait('@getProduct');
    });

    it('should display product details correctly', () => {
        detailPage
            .verifyPageLoaded()
            .verifyProductName('Test Product')
            .verifyProductCategory('Electronics')
            .verifyProductPrice(2999)
            .verifyProductStock(15)
            .verifyProductStatus('in stock')
            .verifyProductDescription('Detailed product description')
            .verifyProductImage();
    });

    // it('should handle product not found', () => {
    //     const invalidId = '999';
    //     const invalidPage = new ProductDetailPage(invalidId);
        
    //     ProductApiHelpers.mockError('GET', `**/api/product/${invalidId}**`, 404);
    //     invalidPage.visit();
        
    //     cy.contains('Product not found').should('be.visible');
    // });

    it('should add product to cart', () => {
        detailPage.clickAddToCart();
        cy.url().should('include', '/cart');
    });
});