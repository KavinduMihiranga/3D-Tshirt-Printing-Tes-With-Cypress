import BasePage from './BasePage';

class DesignDashboardPage extends BasePage {
    constructor() {
        super();
        this.url = '/design';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('T-Shirt Design Studio').should('be.visible');
        cy.contains('Add Text').should('be.visible');
        cy.contains('Add Image').should('be.visible');
        return this;
    }

    // Design Tools
    clickAddText() {
        cy.contains('Add Text').click();
        return this;
    }

    // Color Picker
    selectColor(colorValue) {
        cy.get(`button[title="${colorValue}"]`).click();
        return this;
    }

    setCustomColor(colorHex) {
        cy.get('input[type="color"]').first().invoke('val', colorHex).trigger('input');
        return this;
    }

    setHexColor(colorHex) {
        cy.get('input[placeholder="#color"]').clear().type(colorHex);
        return this;
    }

    // Size Management
    setSizeQuantity(size, quantity) {
        cy.contains(size).parent().find('input').clear().type(quantity.toString());
        return this;
    }

    verifySizeQuantity(size, expectedQuantity) {
        cy.contains(size).parent().find('input').should('have.value', expectedQuantity.toString());
        return this;
    }

    // Design Management
    selectDesign(designText) {
        cy.contains(designText).click();
        return this;
    }

    clickRemoveSelectedDesign() {
        cy.contains('Remove Design').click();
        return this;
    }

    verifyDesignExists(designText) {
        cy.contains(designText).should('be.visible');
        return this;
    }

    verifyDesignNotExists(designText) {
        cy.contains(designText).should('not.exist');
        return this;
    }

    // Export Functions
    clickDownloadGLB() {
        cy.contains('Download GLB').click();
        return this;
    }

    clickDownloadGLTF() {
        cy.contains('Download GLTF').click();
        return this;
    }

    clickDownloadPNG() {
        cy.contains('Download PNG').click();
        return this;
    }

    // Save & Order
    clickSaveAndOrder() {
        cy.contains('Save & Order').click();
        return this;
    }

    verifyExportStatus(message = 'Exporting design...') {
        cy.contains(message).should('be.visible');
        return this;
    }

    verifySuccessMessage() {
        cy.contains('Design saved successfully!').should('be.visible');
        return this;
    }

    // File Upload
    uploadImage(fileName, fileContent) {
        cy.get('input[type="file"]').selectFile({
            contents: fileContent,
            fileName: fileName,
            mimeType: 'image/jpeg'
        }, { force: true });
        return this;
    }

    uploadTextFile() {
        cy.get('input[type="file"]').selectFile({
            contents: Cypress.Blob.fromText('test'),
            fileName: 'test.txt',
            mimeType: 'text/plain'
        }, { force: true });
        return this;
    }

    // Customer Information
    fillCustomerInfo(name, email, phone = '', notes = '') {
        cy.get('input[placeholder="Full Name *"]').clear().type(name);
        cy.get('input[placeholder="Email *"]').clear().type(email);
        if (phone) {
            cy.get('input[placeholder="Phone Number"]').clear().type(phone);
        }
        if (notes) {
            cy.get('textarea[placeholder="Additional Notes"]').clear().type(notes);
        }
        return this;
    }

    clearCustomerInfo(field) {
        const selectors = {
            name: 'input[placeholder="Full Name *"]',
            email: 'input[placeholder="Email *"]',
            phone: 'input[placeholder="Phone Number"]',
            notes: 'textarea[placeholder="Additional Notes"]'
        };
        cy.get(selectors[field]).clear();
        return this;
    }

    verifyCustomerInfo(field, expectedValue) {
        const selectors = {
            name: 'input[placeholder="Full Name *"]',
            email: 'input[placeholder="Email *"]',
            phone: 'input[placeholder="Phone Number"]',
            notes: 'textarea[placeholder="Additional Notes"]'
        };
        cy.get(selectors[field]).should('have.value', expectedValue);
        return this;
    }

    // Mock Helpers
    mockPromptResponse(text) {
        cy.window().then((win) => {
            cy.stub(win, 'prompt').returns(text);
        });
        return this;
    }

    mockAlert() {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });
        return this;
    }

    mockGLTFExporter() {
        cy.window().then((win) => {
            win.GLTFExporter = class MockGLTFExporter {
                parse(object, onSuccess, onError, options) {
                    if (onSuccess) {
                        onSuccess(new ArrayBuffer(100));
                    }
                }
            };
        });
        return this;
    }

    mockCanvasDataURL() {
        cy.window().then((win) => {
            cy.stub(win.HTMLCanvasElement.prototype, 'toDataURL').returns('data:image/png;base64,mock');
        });
        return this;
    }
}

export default DesignDashboardPage;