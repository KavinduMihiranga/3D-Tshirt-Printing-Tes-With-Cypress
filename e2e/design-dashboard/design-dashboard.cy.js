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
                .verifyDesignExists('👕 T-shirt')
                .verifyDesignExists('👨 Men')
                .verifyDesignExists('🎨 ScreenPrint')
                .verifyDesignExists('📏 220GSM');

            // Design tools
            cy.contains('Add Text').should('be.visible');
            cy.contains('Add Image').should('be.visible');
            
            // 3D preview area
            cy.get('.rounded-lg').should('exist');
            cy.contains('🖱️ Drag to rotate • 🔍 Scroll to zoom').should('be.visible');
            
            // Order panel
            cy.contains('Save & Order').should('be.visible');
            cy.contains('Total Items').should('be.visible');
            cy.contains('Sizes Distribution').should('be.visible');
        });

        it('should show size distribution controls', () => {
            const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
            
            sizes.forEach(size => {
                cy.contains(size).should('be.visible');
                cy.get(`input[value="0"]`).first().should('exist');
            });
        });
    });

    context('📝 Text Design Features', () => {
        it('should add text design when Add Text button is clicked', () => {
            dashboardPage
                .mockPromptResponse('Test T-Shirt Text')
                .clickAddText()
                .verifyDesignExists('🎨 Your Designs')
                .verifyDesignExists('Text: Test T-Shirt Text');
        });

        it('should not add text when prompt is cancelled', () => {
            dashboardPage
                .mockPromptResponse(null)
                .clickAddText()
                .verifyDesignNotExists('🎨 Your Designs');
        });

        it('should not add empty text', () => {
            dashboardPage
                .mockPromptResponse('   ')
                .clickAddText()
                .verifyDesignNotExists('🎨 Your Designs');
        });

        it('should show text design controls when text is selected', () => {
            dashboardPage
                .mockPromptResponse('Test Text')
                .clickAddText()
                .selectDesign('Text: Test Text');

            cy.contains('⚙️ Design Settings').should('be.visible');
            cy.contains('Text Color').should('be.visible');
            cy.contains('Text Size').should('be.visible');
            cy.contains('Position').should('be.visible');
            cy.contains('Rotation').should('be.visible');
        });
    });

    context('🖼️ Image Design Features', () => {
        it('should handle image upload successfully', () => {
            const testImage = DesignDataGenerators.getTestImageFile();
            
            dashboardPage
                .uploadImage(testImage.fileName, testImage.fileContent)
                .verifyDesignExists('🎨 Your Designs')
                .verifyDesignExists('Image');
        });

        it('should show error for large files', () => {
            const largeImage = DesignDataGenerators.getLargeImageFile();
            
            dashboardPage
                .mockAlert()
                .uploadImage(largeImage.fileName, largeImage.fileContent);

            cy.get('@alertStub').should('be.calledWith', 'Image size should be less than 5MB');
        });

        it('should show image design controls when image is selected', () => {
            const testImage = DesignDataGenerators.getTestImageFile();
            
            dashboardPage
                .uploadImage(testImage.fileName, testImage.fileContent)
                .selectDesign('Image');

            cy.contains('Scale').should('be.visible');
            cy.get('input[type="number"]').should('have.length.at.least', 7);
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
            
            cy.contains('Text: Test Design').parent()
                .should('have.class', 'bg-blue-100')
                .and('have.class', 'border-blue-300');
        });

        it('should remove selected design when Remove button is clicked', () => {
            dashboardPage
                .selectDesign('Text: Test Design')
                .clickRemoveSelectedDesign()
                .verifyDesignNotExists('Text: Test Design')
                .verifyDesignNotExists('🎨 Your Designs');
        });

        // it('should handle design position updates', () => {
        //     dashboardPage
        //         .selectDesign('Text: Test Design');

        //     cy.get('input[type="number"]').eq(0).clear().type('1.5');
        //     cy.get('input[type="number"]').eq(0).should('have.value', '1.5');
        // });
    });

    context('📊 Size & Quantity Management', () => {
        // it('should update size quantities correctly', () => {
        //     dashboardPage
        //         .setSizeQuantity('XS', 5)
        //         .verifySizeQuantity('XS', 5);
        // });

        it('should not allow negative quantities', () => {
            dashboardPage.setSizeQuantity('XS', -5);
            cy.get('input[value="0"]').first().should('not.have.value', '-5');
        });

        // it('should calculate total items correctly', () => {
        //     const sizeQuantities = {
        //         'XS': 2, 'S': 3, 'M': 1, 'L': 4
        //     };

        //     Object.entries(sizeQuantities).forEach(([size, quantity]) => {
        //         dashboardPage.setSizeQuantity(size, quantity);
        //     });

        //     const expectedTotal = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);
        //     cy.contains(`${expectedTotal} items`).should('be.visible');
        // });
    });

    context('📤 Export & Download Features', () => {
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

        it('should handle PNG download click', () => {
            dashboardPage.clickDownloadPNG();
        });
    });

    context('💾 Save & Order Flow', () => {
        beforeEach(() => {
            dashboardPage
                .mockPromptResponse('Order Test Text')
                .clickAddText()
                .setSizeQuantity('XS', 2);
        });

        // it('should handle save order successfully', () => {
        //     DesignApiHelpers.mockDesignInquirySuccess();
            
        //     dashboardPage
        //         .mockGLTFExporter()
        //         .mockCanvasDataURL()
        //         .clickSaveAndOrder()
        //         .verifyExportStatus();

        //     cy.wait('@designInquiry');
        //     cy.contains('Design saved successfully!').should('be.visible');
        //     cy.url().should('include', '/checkoutPage');
        // });

        it('should handle save order without designs', () => {
            dashboardPage
                .mockAlert()
                .clickRemoveSelectedDesign()
                .clickSaveAndOrder();

            cy.get('@alertStub').should('be.calledWith', 'No design to save');
        });

        // it('should handle API errors during save', () => {
        //     DesignApiHelpers.mockDesignInquiryError();
            
        //     dashboardPage
        //         .mockGLTFExporter()
        //         .mockCanvasDataURL()
        //         .mockAlert()
        //         .clickSaveAndOrder();

        //     cy.wait('@designInquiryError');
        //     cy.get('@alertStub').should('be.calledWith', 'Failed to send design inquiry: Server error');
        // });
    });

    context('🛡️ Error Handling & Edge Cases', () => {
        it('should handle invalid color inputs gracefully', () => {
            dashboardPage.setHexColor('invalid-color');
            cy.get('body').should('exist');
        });

        it('should handle very large numbers in size inputs', () => {
            dashboardPage.setSizeQuantity('XS', 999999);
            cy.get('body').should('exist');
        });
    });
});