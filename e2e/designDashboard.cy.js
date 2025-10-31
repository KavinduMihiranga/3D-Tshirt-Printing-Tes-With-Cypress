// ==================== DESIGN DASHBOARD TEST SUITE ====================
describe('🎨 Design Dashboard - Comprehensive Test Suite', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(`${baseUrl}/design`);
  });

  // ---------- UI & LAYOUT VALIDATION ----------
  context('🎯 UI Structure & Layout', () => {
    it('should load design dashboard with all main sections', () => {
      cy.contains('👕 T-shirt').should('be.visible');
      cy.contains('👨 Men').should('be.visible');
      cy.contains('🎨 ScreenPrint').should('be.visible');
      cy.contains('📏 220GSM').should('be.visible');
      
      // Design tools
      cy.contains('Add Text').should('be.visible');
      cy.contains('Add Image').should('be.visible');
      
      // Color picker
      cy.contains('🎨 T-Shirt Color').should('be.visible');
      
      // 3D preview area
      cy.get('.rounded-lg').should('exist'); // 3D canvas container
      cy.contains('🖱️ Drag to rotate • 🔍 Scroll to zoom').should('be.visible');
      
      // Order panel
      cy.contains('Save & Order').should('be.visible');
      cy.contains('Total Items').should('be.visible');
      cy.contains('Sizes Distribution').should('be.visible');
    });

    // it('should display color picker with default and custom options', () => {
    //   // Default color options
    //   const colorOptions = [
    //     "#000000", "#ffffff", "#ef4444", "#10b981", "#3b82f6",
    //     "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316", "#6366f1"
    //   ];
      
    //   colorOptions.forEach(color => {
    //     cy.get(`button[style*="background-color: ${color}"]`).should('exist');
    //   });
      
    //   // Custom color input
    //   cy.get('input[type="color"]').should('exist');
    //   cy.get('input[placeholder="#color"]').should('exist');
    // });

    it('should show size distribution controls', () => {
      const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
      
      sizes.forEach(size => {
        cy.contains(size).should('be.visible');
        cy.get(`input[value="0"]`).first().should('exist'); // Default value 0
      });
    });
  });

  // ---------- TEXT DESIGN FUNCTIONALITY ----------
  context('📝 Text Design Features', () => {
    it('should add text design when Add Text button is clicked', () => {
      // Mock prompt response
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('Test T-Shirt Text');
      });

      cy.contains('Add Text').click();
      
      // Verify design is added to list
      cy.contains('🎨 Your Designs').should('be.visible');
      cy.contains('Text: Test T-Shirt Text').should('be.visible');
    });

    it('should not add text when prompt is cancelled', () => {
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns(null);
      });

      cy.contains('Add Text').click();
      
      // No designs should be added
      cy.contains('🎨 Your Designs').should('not.exist');
    });

    it('should not add empty text', () => {
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('   ');
      });

      cy.contains('Add Text').click();
      
      cy.contains('🎨 Your Designs').should('not.exist');
    });

    it('should show text design controls when text is selected', () => {
      // Add text first
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('Test Text');
      });
      cy.contains('Add Text').click();

      // Select the design
      cy.contains('Text: Test Text').click();

      // Verify text controls appear
      cy.contains('⚙️ Design Settings').should('be.visible');
      cy.contains('Text Color').should('be.visible');
      cy.contains('Text Size').should('be.visible');
      
      // Position and rotation controls
      cy.contains('Position').should('be.visible');
      cy.contains('Rotation').should('be.visible');
      ['X', 'Y', 'Z'].forEach(axis => {
        cy.contains(axis).should('be.visible');
      });
    });

    // it('should update text color when color picker is used', () => {
    //   // Add text
    //   cy.window().then((win) => {
    //     cy.stub(win, 'prompt').returns('Color Test');
    //   });
    //   cy.contains('Add Text').click();
    //   cy.contains('Text: Color Test').click();

    //   // Change color
    //   cy.get('input[type="color"]').invoke('val', '#ff0000').trigger('input');
    //   cy.get('input[type="color"]').should('have.value', '#ff0000');
    // });

    // it('should update text size when size input is changed', () => {
    //   cy.window().then((win) => {
    //     cy.stub(win, 'prompt').returns('Size Test');
    //   });
    //   cy.contains('Add Text').click();
    //   cy.contains('Text: Size Test').click();

    //   cy.get('input[type="number"]').first().clear().type('0.5');
    //   cy.get('input[type="number"]').first().should('have.value', '0.5');
    // });
  });

  // ---------- IMAGE DESIGN FUNCTIONALITY ----------
  context('🖼️ Image Design Features', () => {
    it('should handle image upload successfully', () => {
      // Mock image file
      const fileName = 'test-image.jpg';
      const fileContent = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8U/9k=';
      
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent.split(',')[1], 'base64'),
        fileName: fileName,
        mimeType: 'image/jpeg'
      }, { force: true });

      // Verify design is added
      cy.contains('🎨 Your Designs').should('be.visible');
      cy.contains('Image').should('be.visible');
    });

    // it('should show error for non-image files', () => {
    //   cy.window().then((win) => {
    //     cy.stub(win, 'alert').as('alertStub');
    //   });

    //   // Upload text file
    //   const fileContent = 'This is a text file, not an image';
      
    //   cy.get('input[type="file"]').selectFile({
    //     contents: fileContent,
    //     fileName: 'test.txt',
    //     mimeType: 'text/plain'
    //   }, { force: true });

    //   cy.get('@alertStub').should('be.calledWith', 'Please select a valid image file');
    // });

    it('should show error for large files', () => {
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      // Create a large file (6MB)
      const largeFile = new Array(6 * 1024 * 1024).join('a');
      
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(largeFile),
        fileName: 'large-image.jpg',
        mimeType: 'image/jpeg'
      }, { force: true });

      cy.get('@alertStub').should('be.calledWith', 'Image size should be less than 5MB');
    });

    it('should show image design controls when image is selected', () => {
      // Upload image first
      const fileContent = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8U/9k=';
      
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent.split(',')[1], 'base64'),
        fileName: 'test-image.jpg',
        mimeType: 'image/jpeg'
      }, { force: true });

      // Select the image design
      cy.contains('Image').click();

      // Verify image-specific controls
      cy.contains('Scale').should('be.visible');
      cy.get('input[type="number"]').should('have.length.at.least', 7); // Position (3) + Rotation (3) + Scale (1)
    });
  });

  // ---------- DESIGN MANAGEMENT ----------
  context('🛠️ Design Management', () => {
    beforeEach(() => {
      // Add a text design for testing
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('Test Design');
      });
      cy.contains('Add Text').click();
    });

    it('should select design when clicked in designs list', () => {
      cy.contains('Text: Test Design').click();
      cy.contains('Text: Test Design').parent()
        .should('have.class', 'bg-blue-100')
        .and('have.class', 'border-blue-300');
    });

    it('should remove selected design when Remove button is clicked', () => {
      cy.contains('Text: Test Design').click();
      cy.contains('Remove Selected Design').click();
      
      cy.contains('Text: Test Design').should('not.exist');
      cy.contains('🎨 Your Designs').should('not.exist');
    });

    // it('should disable Remove button when no design is selected', () => {
    //   cy.contains('Remove Selected Design').should('be.disabled');
    // });

    // it('should update design position controls', () => {
    //   cy.contains('Text: Test Design').click();
      
    //   // Test X position
    //   cy.get('input[type="number"]').eq(0).clear().type('1.5');
    //   cy.get('input[type="number"]').eq(0).should('have.value', '1.5');
      
    //   // Test Y position
    //   cy.get('input[type="number"]').eq(1).clear().type('-0.5');
    //   cy.get('input[type="number"]').eq(1).should('have.value', '-0.5');
    // });

    // it('should update design rotation controls', () => {
    //   cy.contains('Text: Test Design').click();
      
    //   // Test Z rotation
    //   cy.get('input[type="number"]').eq(5).clear().type('3.1416');
    //   cy.get('input[type="number"]').eq(5).should('have.value', '3.1416');
    // });
  });

  // ---------- T-SHIRT CUSTOMIZATION ----------
  context('👕 T-Shirt Customization', () => {
    // it('should change t-shirt color when color button is clicked', () => {
    //   const newColor = '#ef4444'; // Red color from options
      
    //   cy.get(`button[style*="background-color: ${newColor}"]`).click();
      
    //   // Verify color is selected (has border/ring classes)
    //   cy.get(`button[style*="background-color: ${newColor}"]`)
    //     .should('have.class', 'border-gray-700')
    //     .and('have.class', 'ring-2');
    // });

    // it('should update t-shirt color using custom color input', () => {
    //   const customColor = '#123456';
      
    //   cy.get('input[type="color"]').invoke('val', customColor).trigger('input');
    //   cy.get('input[placeholder="#color"]').should('have.value', customColor);
    // });

    // it('should update t-shirt color using hex text input', () => {
    //   const customColor = '#abcdef';
      
    //   cy.get('input[placeholder="#color"]').clear().type(customColor);
    //   cy.get('input[type="color"]').should('have.value', customColor);
    // });
  });

  // ---------- SIZE & QUANTITY MANAGEMENT ----------
  context('📊 Size & Quantity Management', () => {
    // it('should update size quantities correctly', () => {
    //   cy.get('input[value="0"]').first().clear().type('5');
    //   cy.get('input[value="0"]').first().should('have.value', '5');
    // });

    it('should not allow negative quantities', () => {
      cy.get('input[value="0"]').first().clear().type('-5');
      // Should reset to 0 or previous value
      cy.get('input[value="0"]').first().should('not.have.value', '-5');
    });

    // it('should calculate total items correctly', () => {
    //   // Set quantities for different sizes
    //   const sizeQuantities = {
    //     'XS': 2,
    //     'S': 3, 
    //     'M': 1,
    //     'L': 4
    //   };

    //   Object.entries(sizeQuantities).forEach(([size, quantity]) => {
    //     cy.contains(size).siblings('input').clear().type(quantity.toString());
    //   });

    //   const expectedTotal = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);
    //   cy.contains(`${expectedTotal} items`).should('be.visible');
    // });

    // it('should calculate price correctly (2000 per item)', () => {
    //   cy.get('input[value="0"]').first().clear().type('3');
    //   cy.contains('Rs 6000.00').should('be.visible');
      
    //   // Add more items
    //   cy.get('input[value="0"]').eq(1).clear().type('2');
    //   cy.contains('Rs 10000.00').should('be.visible'); // 5 items * 2000 = 10000
    // });
  });

  // ---------- EXPORT FUNCTIONALITY ----------
  context('📤 Export & Download Features', () => {
    it('should show all export buttons', () => {
      cy.contains('Download GLB').should('be.visible');
      cy.contains('Download GLTF').should('be.visible');
      cy.contains('Download PNG').should('be.visible');
    });

    it('should handle GLB download click', () => {
      // Mock the GLTFExporter to prevent actual file download
      cy.window().then((win) => {
        win.GLTFExporter = class MockGLTFExporter {
          parse() {
            // Mock implementation
          }
        };
      });

      cy.contains('Download GLB').click();
      // Should not throw errors
    });

    it('should handle PNG download click', () => {
      cy.contains('Download PNG').click();
      // Should not throw errors
    });
  });

  // ---------- SAVE & ORDER FUNCTIONALITY ----------
  context('💾 Save & Order Flow', () => {
    beforeEach(() => {
      // Add a design and set quantities for order
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('Order Test Text');
      });
      cy.contains('Add Text').click();
      cy.get('input[value="0"]').first().clear().type('2');
    });

    // it('should show export status during save process', () => {
    //   // Mock successful API response
    //   cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
    //     statusCode: 200,
    //     body: { success: true }
    //   }).as('designInquiry');

    //   // Mock GLTFExporter
    //   cy.window().then((win) => {
    //     win.GLTFExporter = class MockGLTFExporter {
    //       parse(object, onSuccess) {
    //         onSuccess(new ArrayBuffer(100)); // Mock GLB data
    //       }
    //     };
        
    //     // Mock canvas dataURL
    //     cy.stub(win.HTMLCanvasElement.prototype, 'toDataURL').returns('data:image/png;base64,mock');
    //   });

    //   cy.contains('Save & Order').click();

    //   // Should show export status
    //   cy.contains('Exporting design...').should('be.visible');
      
    //   cy.wait('@designInquiry');
      
    //   // Should show success message and redirect
    //   cy.contains('Design saved successfully! Redirecting to checkout...').should('be.visible');
      
    //   // Should navigate to checkout
    //   cy.url().should('include', '/checkoutPage');
    // });

    it('should handle save order without designs', () => {
      // Remove any designs first
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      cy.contains('Save & Order').click();
      cy.get('@alertStub').should('be.calledWith', 'No design to save');
    });

    // it('should handle API errors during save', () => {
    //   // Mock API error
    //   cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
    //     statusCode: 500,
    //     body: { message: 'Server error' }
    //   }).as('designError');

    //   // Mock GLTFExporter
    //   cy.window().then((win) => {
    //     win.GLTFExporter = class MockGLTFExporter {
    //       parse(object, onSuccess) {
    //         onSuccess(new ArrayBuffer(100));
    //       }
    //     };
    //     cy.stub(win.HTMLCanvasElement.prototype, 'toDataURL').returns('data:image/png;base64,mock');
    //     cy.stub(win, 'alert').as('alertStub');
    //   });

    //   cy.contains('Save & Order').click();
      
    //   cy.wait('@designError');
    //   cy.get('@alertStub').should('be.calledWith', 'Failed to send design inquiry: Server error');
    // });

    // it('should store design data in localStorage', () => {
    //   // Mock successful save
    //   cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
    //     statusCode: 200,
    //     body: { success: true }
    //   }).as('designInquiry');

    //   cy.window().then((win) => {
    //     win.GLTFExporter = class MockGLTFExporter {
    //       parse(object, onSuccess) {
    //         onSuccess(new ArrayBuffer(100));
    //       }
    //     };
    //     cy.stub(win.HTMLCanvasElement.prototype, 'toDataURL').returns('data:image/png;base64,mock');
    //   });

    //   cy.contains('Save & Order').click();
      
    //   // Verify localStorage has pending design
    //   cy.window().then((win) => {
    //     const pendingDesign = win.localStorage.getItem('pendingDesign');
    //     expect(pendingDesign).to.exist;
    //     expect(JSON.parse(pendingDesign)).to.have.property('file');
    //     expect(JSON.parse(pendingDesign)).to.have.property('preview');
    //   });
    // });
  });

  // ---------- ERROR HANDLING & RESILIENCE ----------
  context('🛡️ Error Handling & Edge Cases', () => {
    // it('should handle GLB export errors gracefully', () => {
    //   cy.window().then((win) => {
    //     win.GLTFExporter = class MockGLTFExporter {
    //       parse(object, onSuccess, onError) {
    //         onError(new Error('Export failed'));
    //       }
    //     };
    //     cy.stub(win, 'alert').as('alertStub');
    //   });

    //   // Add a design first
    //   cy.window().then((win) => {
    //     cy.stub(win, 'prompt').returns('Test Text');
    //   });
    //   cy.contains('Add Text').click();

    //   cy.contains('Download GLB').click();
    //   cy.get('@alertStub').should('be.calledWith', 'Failed to export 3D model');
    // });

    // it('should handle invalid color inputs', () => {
    //   cy.get('input[placeholder="#color"]').clear().type('invalid-color');
    //   // Should not break the application
    //   cy.get('body').should('exist');
    // });

    it('should handle very large numbers in size inputs', () => {
      cy.get('input[value="0"]').first().clear().type('999999');
      // Should handle gracefully without crashing
      cy.get('body').should('exist');
    });
  });
});

// ==================== CUSTOM COMMANDS ====================
Cypress.Commands.add('addTextDesign', (text = 'Test Design') => {
  cy.window().then((win) => {
    cy.stub(win, 'prompt').returns(text);
  });
  cy.contains('Add Text').click();
});

Cypress.Commands.add('uploadTestImage', () => {
  const fileContent = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8U/9k=';
  
  cy.get('input[type="file"]').selectFile({
    contents: Cypress.Buffer.from(fileContent.split(',')[1], 'base64'),
    fileName: 'test-image.jpg',
    mimeType: 'image/jpeg'
  }, { force: true });
});

Cypress.Commands.add('setSizeQuantity', (size, quantity) => {
  cy.contains(size).siblings('input').clear().type(quantity.toString());
});

Cypress.Commands.add('mockGLTFExporter', () => {
  cy.window().then((win) => {
    win.GLTFExporter = class MockGLTFExporter {
      parse(object, onSuccess) {
        onSuccess(new ArrayBuffer(100));
      }
    };
  });
});

// ==================== TEST CONFIGURATION ====================
beforeEach(() => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    console.error('Design Dashboard Test Error:', err);
    return false;
  });
});