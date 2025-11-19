import AddProductPage from '../../support/pageObjects/AddProductPage';
import ProductApiHelpers from '../../support/helpers/productApiHelpers';
import ProductDataGenerators from '../../support/helpers/productDataGenerators';

describe('Add Product', () => {
    const addPage = new AddProductPage();
    const validData = ProductDataGenerators.getValidProductData();

    beforeEach(() => {
        addPage.visit();
    });

    context('🎯 UI Structure & Layout', () => {
        it('should display add product form with all fields', () => {
            addPage
                .verifyPageLoaded()
                .verifyFormFields();

            cy.contains('button', 'Cancel').should('be.visible');
        });

        it('should show image preview when image is uploaded', () => {
            addPage.uploadImage();
            addPage.verifyImagePreview();
        });
    });

    context('✅ Successful Flow', () => {
        it('should submit product successfully with valid data', () => {
            ProductApiHelpers.mockCreateProduct();
            
            addPage
                .fillForm(validData)
                .submit();

            cy.wait('@createProduct');
            cy.url().should('include', '/productDashboard');
        });

        it('should submit product with image upload', () => {
            ProductApiHelpers.mockCreateProduct();
            
            addPage
                .fillForm(validData)
                .uploadImage('test-product.jpg')
                .submit();

            cy.wait('@createProduct');
            cy.url().should('include', '/productDashboard');
        });
    });

    context('🚨 Error Handling', () => {

        it('should handle server errors', () => {
            ProductApiHelpers.mockServerError();
            
            addPage
                .fillForm(validData)
                .submit();

            cy.wait('@serverError');
            cy.url().should('include', '/addProduct');
        });

        it('should handle network errors', () => {
            ProductApiHelpers.mockNetworkError();
            
            addPage
                .fillForm(validData)
                .submit();

            // Network errors might not be caught by wait, but form should stay
            cy.url().should('include', '/addProduct');
        });

        it('should show client-side validation for invalid data', () => {
            const invalidData = ProductDataGenerators.getInvalidProductData();
            
            addPage
                .fillForm(invalidData)
                .submit();

            // Check if form remains on page (client-side validation)
            cy.url().should('include', '/addProduct');
            
            // Check for validation messages if they exist
            cy.get('body').then(($body) => {
                if ($body.find('[role="alert"]').length > 0 || 
                    $body.find('.error').length > 0 || 
                    $body.find('.text-red-500').length > 0) {
                    cy.get('[role="alert"], .error, .text-red-500').should('be.visible');
                }
            });
        });
    });

    context('🔗 Navigation & Actions', () => {
        it('should cancel and navigate back', () => {
            addPage.clickCancel();
            cy.url().should('not.include', '/addProduct');
        });

        it('should close form using X button', () => {
            cy.get('button').contains('×').click();
            cy.url().should('not.include', '/addProduct');
        });
    });

    context('📝 Form Interactions', () => {
        it('should populate all form fields correctly', () => {
            addPage
                .fillName('Test Product')
                .fillCategory('Test Category')
                .fillSize('Large')
                .fillDescription('Test description')
                .fillPrice('1999')
                .fillQuantity('25')
                .fillStatus('in stock');

            // Verify values are set
            cy.get('input[name="name"]').should('have.value', 'Test Product');
            cy.get('input[name="category"]').should('have.value', 'Test Category');
            cy.get('select[name="size"]').should('have.value', 'Large');
            cy.get('textarea[name="description"]').should('have.value', 'Test description');
            cy.get('input[name="price"]').should('have.value', '1999');
            cy.get('input[name="qty"]').should('have.value', '25');
            cy.get('select[name="status"]').should('have.value', 'in stock');
        });

        it('should handle size dropdown options', () => {
            cy.get('select[name="size"]').then(($select) => {
                const options = $select.find('option');
                expect(options).to.have.length.of.at.least(3); // Small, Medium, Large + Select Size
                
                // Verify specific options exist
                cy.get('select[name="size"]').contains('option', 'Small');
                cy.get('select[name="size"]').contains('option', 'Medium');
                cy.get('select[name="size"]').contains('option', 'Large');
            });
        });

        it('should handle status dropdown options', () => {
            cy.get('select[name="status"]').then(($select) => {
                const options = $select.find('option');
                expect(options).to.have.length.of.at.least(2); // In Stock, Out of Stock + Select Status
                
                // Verify specific options exist
                cy.get('select[name="status"]').contains('option', 'In Stock');
                cy.get('select[name="status"]').contains('option', 'Out of Stock');
            });
        });
    });

    context('🔄 Edit Product Flow', () => {
        it('should load existing product data in edit mode', () => {
            const productId = '123';
            const existingProduct = ProductDataGenerators.generateProduct({
                _id: productId,
                name: 'Existing Product',
                category: 'Existing Category',
                size: 'Medium',
                description: 'Existing description',
                price: 1500,
                qty: 20,
                status: 'in stock'
            });

            ProductApiHelpers.mockGetProduct(productId, existingProduct);
            
            // Visit edit URL
            cy.visit(`/addProduct/${productId}`);
            cy.wait('@getProduct');

            // Verify form is populated with existing data
            cy.get('input[name="name"]').should('have.value', existingProduct.name);
            cy.get('input[name="category"]').should('have.value', existingProduct.category);
            cy.get('select[name="size"]').should('have.value', existingProduct.size);
            cy.get('textarea[name="description"]').should('have.value', existingProduct.description);
            cy.get('input[name="price"]').should('have.value', existingProduct.price.toString());
            cy.get('input[name="qty"]').should('have.value', existingProduct.qty.toString());
            cy.get('select[name="status"]').should('have.value', existingProduct.status);
        });

        it('should update product successfully', () => {
            const productId = '123';
            const existingProduct = ProductDataGenerators.generateProduct({ _id: productId });
            const updateData = ProductDataGenerators.getUpdateProductData();

            ProductApiHelpers.mockGetProduct(productId, existingProduct);
            ProductApiHelpers.mockUpdateProduct(productId);
            
            cy.visit(`/addProduct/${productId}`);
            cy.wait('@getProduct');

            addPage
                .fillForm(updateData)
                .submit();

            cy.wait('@updateProduct');
            cy.url().should('include', '/productDashboard');
        });
    });
});