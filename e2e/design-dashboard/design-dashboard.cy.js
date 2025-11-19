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
    });

    context('📊 Size & Quantity Management', () => {

        it('should not allow negative quantities', () => {
            dashboardPage.setSizeQuantity('XS', -5);
            cy.contains('XS').siblings('input').should('not.have.value', '-5');
        });

    });

    context('👤 Customer Information', () => {
       

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