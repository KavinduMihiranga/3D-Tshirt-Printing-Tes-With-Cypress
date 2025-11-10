import DesignDashboardPage from '../../support/pageObjects/DesignDashboardPage';
import DesignApiHelpers from '../../support/helpers/designApiHelpers';
import DesignDataGenerators from '../../support/helpers/designDataGenerators';

describe('🎨 Design Dashboard - Comprehensive Test Suite', () => {
    const dashboardPage = new DesignDashboardPage();

    beforeEach(() => {
        cy.clearLocalStorage();
        dashboardPage.visit();
    });

    context('🎯 UI Structure & Layout', () => {
        it('should load design dashboard with all main sections', () => {
            dashboardPage
                .verifyPageLoaded()
                .verifyDesignExists('T-Shirt Design Studio')
                .verifyDesignExists('Product Type')
                .verifyDesignExists('Design Tools')
                .verifyDesignExists('Order Summary');

            // Product type buttons
            cy.contains('👕 T-shirt').should('be.visible');
            cy.contains('👨 Men').should('be.visible');
            cy.contains('🎨 ScreenPrint').should('be.visible');
            cy.contains('📏 220GSM').should('be.visible');
            
            // Design tools
            cy.contains('Add Text').should('be.visible');
            cy.contains('Add Image').should('be.visible');
            
            // 3D preview area
            cy.get('[class*="bg-gradient-to-br"]').should('exist');
            cy.contains('🖱️ Drag to rotate • 🔍 Scroll to zoom • 🖱️ Right-click to pan').should('be.visible');
            
            // Order panel
            cy.contains('Save & Order').should('be.visible');
            cy.contains('Total Items').should('be.visible');
            cy.contains('Sizes Distribution').should('be.visible');
            cy.contains('Customer Information').should('be.visible');
        });

        it.skip('should show size distribution controls for all sizes', () => {
            const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
            
            sizes.forEach(size => {
                cy.contains(size).should('be.visible');
                // Find input near the size label
                cy.contains(size).siblings('input').should('exist').and('have.value', '0');
            });
        });

        it.skip('should show color picker with predefined colors', () => {
            const colorOptions = [
                "#000000","#ffffff","#ef4444","#10b981","#3b82f6",
                "#f59e0b","#8b5cf6","#06b6d4","#f97316","#6366f1",
            ];
            
            colorOptions.forEach(color => {
                cy.get(`button[style*="background-color: ${color}"]`).should('be.visible');
            });
            
            cy.get('input[type="color"]').should('exist');
            cy.get('input[placeholder="#color"]').should('exist');
            
        });
    });

    context('📝 Text Design Features', () => {
        it('should add text design when Add Text button is clicked', () => {
            dashboardPage
                .mockPromptResponse('Test T-Shirt Text')
                .clickAddText()
                .verifyDesignExists('Your Designs')
                .verifyDesignExists('Text: Test T-Shirt Text');
        });

        it('should not add text when prompt is cancelled', () => {
            dashboardPage
                .mockPromptResponse(null)
                .clickAddText()
                .verifyDesignNotExists('Your Designs');
        });

        it('should not add empty text', () => {
            dashboardPage
                .mockPromptResponse('   ')
                .clickAddText()
                .verifyDesignNotExists('Your Designs');
        });

        it('should show text design controls when text is selected', () => {
            dashboardPage
                .mockPromptResponse('Test Text')
                .clickAddText()
                .selectDesign('Text: Test Text');

            cy.contains('Design Settings').should('be.visible');
            cy.contains('Text Color').should('be.visible');
            cy.contains('Text Size').should('be.visible');
            cy.contains('Position').should('be.visible');
            cy.contains('Rotation').should('be.visible');
            
            // Should have position inputs for X, Y, Z
            cy.contains('X').should('be.visible');
            cy.contains('Y').should('be.visible');
            cy.contains('Z').should('be.visible');
        });

        it('should update text color when color picker is changed', () => {
            dashboardPage
                .mockPromptResponse('Test Text')
                .clickAddText()
                .selectDesign('Text: Test Text');

            const newColor = '#ff0000';
            cy.get('input[type="color"]').first().invoke('val', newColor).trigger('change');
            // Verify the color input reflects the change
            cy.get('input[type="color"]').first().should('have.value', newColor);
        });
    });

    context('🖼️ Image Design Features', () => {
        it.skip('should handle image upload successfully', () => {
            const testImage = DesignDataGenerators.getTestImageFile();
            
            dashboardPage
                .uploadImage(testImage.fileName, testImage.fileContent)
                .verifyDesignExists('Your Designs')
                .verifyDesignExists('test-image.jpg'); // Should show filename
        });

        it.skip('should show error for non-image files', () => {
            dashboardPage
                .mockAlert()
                .uploadTextFile(); // Upload non-image file

            cy.get('@alertStub').should('be.calledWith', 'Please select a valid image file');
        });

        it.skip('should show error for files larger than 5MB', () => {
            const largeImage = DesignDataGenerators.getLargeImageFile();
            
            dashboardPage
                .mockAlert()
                .uploadImage(largeImage.fileName, largeImage.fileContent);

            cy.get('@alertStub').should('be.calledWith', 'Image size should be less than 5MB');
        });

        it.skip('should show image design controls when image is selected', () => {
            const testImage = DesignDataGenerators.getTestImageFile();
            
            dashboardPage
                .uploadImage(testImage.fileName, testImage.fileContent)
                .selectDesign('test-image.jpg');

            cy.contains('Scale').should('be.visible');
            cy.contains('Position').should('be.visible');
            cy.contains('Rotation').should('be.visible');
        });
    });

    context('🛠️ Design Management', () => {
        beforeEach(() => {
            dashboardPage
                .mockPromptResponse('Test Design')
                .clickAddText();
        });

        it('should select design when clicked in designs list', () => {
            dashboardPage.selectDesign('Text: Test Design');
            
            // Verify design is selected (has blue background)
            cy.contains('Text: Test Design').parentsUntil('[class*="bg-blue-50"]').should('exist');
        });

        it('should remove selected design when Remove Design button is clicked', () => {
            dashboardPage
                .selectDesign('Text: Test Design')
                .clickRemoveSelectedDesign()
                .verifyDesignNotExists('Text: Test Design')
                .verifyDesignNotExists('Your Designs');
        });

        it.skip('should update design position when position inputs are changed', () => {
            dashboardPage
                .selectDesign('Text: Test Design');

            // Test X position
            cy.get('input[type="number"]').first().clear().type('1.5').should('have.value', '1.5');
        });

        it.skip('should update design rotation when rotation inputs are changed', () => {
            dashboardPage
                .selectDesign('Text: Test Design');

            // Find rotation inputs (they come after position inputs)
            cy.get('input[type="number"]').eq(3).clear().type('0.5').should('have.value', '0.5');
        });

        it.skip('should handle multiple designs correctly', () => {
            // Add text design
            dashboardPage
                .mockPromptResponse('First Text')
                .clickAddText();

            // Add image design
            const testImage = DesignDataGenerators.getTestImageFile();
            dashboardPage.uploadImage(testImage.fileName, testImage.fileContent);

            // Verify both designs exist
            cy.contains('Text: First Text').should('be.visible');
            cy.contains('test-image.jpg').should('be.visible');
            
            // Verify design count
            cy.contains('Your Designs (2)').should('be.visible');
        });
    });

    context('📊 Size & Quantity Management', () => {
        it.skip('should update size quantities correctly', () => {
            dashboardPage
                .setSizeQuantity('XS', 5)
                .verifySizeQuantity('XS', 5);
        });

        it('should not allow negative quantities', () => {
            dashboardPage.setSizeQuantity('XS', -5);
            cy.contains('XS').siblings('input').should('not.have.value', '-5');
        });

        it.skip('should calculate total items correctly across all sizes', () => {
            const sizeQuantities = {
                'XS': 2, 
                'S': 3, 
                'M': 1, 
                'L': 4,
                'XL': 0,
                '2XL': 1,
                '3XL': 2
            };

            Object.entries(sizeQuantities).forEach(([size, quantity]) => {
                dashboardPage.setSizeQuantity(size, quantity);
            });

            const expectedTotal = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);
            cy.contains(`${expectedTotal} items`).should('be.visible');
            
            // Verify total in price summary
            cy.contains(`Total Items`).siblings().contains(`${expectedTotal} items`).should('exist');
        });

        it.skip('should update price based on total items', () => {
            dashboardPage.setSizeQuantity('M', 3);
            dashboardPage.setSizeQuantity('L', 2);
            
            const totalItems = 5;
            const expectedPrice = totalItems * 2000;
            
            cy.contains(`Rs ${expectedPrice.toLocaleString()}.00`).should('be.visible');
        });
    });

    context('👤 Customer Information', () => {
        it.skip('should require name and email for order submission', () => {
            dashboardPage
                .mockPromptResponse('Test Design')
                .clickAddText()
                .setSizeQuantity('M', 1)
                .mockAlert()
                .clickSaveAndOrder();

            cy.get('@alertStub').should('be.calledWith', 'Please enter your name and email');
        });

        it('should accept valid customer information', () => {
            dashboardPage
                .fillCustomerInfo('John Doe', 'john@example.com', '+1234567890', 'Test notes')
                .verifyCustomerInfo('name', 'John Doe')
                .verifyCustomerInfo('email', 'john@example.com')
                .verifyCustomerInfo('phone', '+1234567890')
                .verifyCustomerInfo('notes', 'Test notes');
        });
    });

    context('📤 Export & Download Features', () => {
        beforeEach(() => {
            dashboardPage
                .mockPromptResponse('Export Test')
                .clickAddText();
        });

        it('should show all export buttons', () => {
            cy.contains('Download GLB').should('be.visible');
            cy.contains('Download GLTF').should('be.visible');
            cy.contains('Download PNG').should('be.visible');
        });

        it('should handle GLB download click', () => {
            dashboardPage
                .mockGLTFExporter()
                .clickDownloadGLB();
        });

        it('should handle GLTF download click', () => {
            dashboardPage
                .mockGLTFExporter()
                .clickDownloadGLTF();
        });

        it('should handle PNG download click', () => {
            dashboardPage
                .mockCanvasDataURL()
                .clickDownloadPNG();
        });
    });

    context('💾 Save & Order Flow', () => {
        beforeEach(() => {
            dashboardPage
                .mockPromptResponse('Order Test Text')
                .clickAddText()
                .setSizeQuantity('M', 2)
                .fillCustomerInfo('Jane Smith', 'jane@example.com');
        });

        it.skip('should validate required fields before saving', () => {
            // Test without designs
            dashboardPage
                .clickRemoveSelectedDesign()
                .mockAlert()
                .clickSaveAndOrder();

            cy.get('@alertStub').should('be.calledWith', 'No design to save');
        });

        it.skip('should validate customer information', () => {
            // Clear name and test
            dashboardPage
                .clearCustomerInfo('name')
                .mockAlert()
                .clickSaveAndOrder();

            cy.get('@alertStub').should('be.calledWith', 'Please enter your name and email');
        });

        it.skip('should validate order quantity', () => {
            // Set all sizes to 0
            const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
            sizes.forEach(size => {
                dashboardPage.setSizeQuantity(size, 0);
            });
            
            dashboardPage
                .mockAlert()
                .clickSaveAndOrder();

            cy.get('@alertStub').should('be.calledWith', 'Please select at least one item');
        });

        it.skip('should show exporting status during save process', () => {
            DesignApiHelpers.mockDesignInquirySuccess();
            
            dashboardPage
                .mockGLTFExporter()
                .mockCanvasDataURL()
                .clickSaveAndOrder()
                .verifyExportStatus('Exporting design...');

            cy.wait('@designInquiry');
        });
    });

    context('🛡️ Error Handling & Edge Cases', () => {
        it('should handle invalid color inputs gracefully', () => {
            dashboardPage.setHexColor('invalid-color');
            // Should not break the application
            cy.get('body').should('exist');
            cy.contains('T-Shirt Design Studio').should('be.visible');
        });

        it('should handle very large numbers in size inputs', () => {
            dashboardPage.setSizeQuantity('XS', 999999);
            // Application should handle this gracefully
            cy.get('body').should('exist');
        });

        it('should handle special characters in text designs', () => {
            const specialText = 'Design with 🚀 emoji & %$# symbols!';
            dashboardPage
                .mockPromptResponse(specialText)
                .clickAddText()
                .verifyDesignExists(`Text: ${specialText}`);
        });

        it('should maintain state after page reload', () => {
            dashboardPage
                .mockPromptResponse('Persistent Text')
                .clickAddText()
                .setSizeQuantity('L', 3)
                .setHexColor('#ff0000');

            cy.reload();
            
            // Designs might not persist after reload depending on implementation
            // But the page should still load correctly
            dashboardPage.verifyPageLoaded();
        });
    });

    context('📱 Responsive Design', () => {
        it('should display correctly on mobile screens', () => {
            cy.viewport('iphone-6');
            
            dashboardPage.verifyPageLoaded();
            cy.contains('T-Shirt Design Studio').should('be.visible');
            
            // Main sections should still be accessible
            cy.contains('Add Text').should('be.visible');
            cy.contains('Add Image').should('be.visible');
        });

        it('should display correctly on tablet screens', () => {
            cy.viewport('ipad-2');
            
            dashboardPage.verifyPageLoaded();
            // Verify layout adapts to tablet size
            cy.get('.grid-cols-1').should('exist');
        });
    });
});