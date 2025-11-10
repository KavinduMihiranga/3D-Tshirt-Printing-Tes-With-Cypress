class DesignApiHelpers {
    static mockDesignInquirySuccess() {
        cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
            statusCode: 200,
            body: {
                success: true,
                data: {
                    _id: '12345',
                    customerName: 'Test User',
                    totalPrice: 4000
                }
            }
        }).as('designInquiry');
    }

    static mockDesignInquiryError() {
        cy.intercept('POST', 'http://localhost:5000/api/design-inquiry', {
            statusCode: 500,
            body: {
                success: false,
                message: 'Server error'
            }
        }).as('designInquiryError');
    }

    static mockExportSuccess() {
        cy.intercept('POST', '**/export**', {
            statusCode: 200,
            body: { success: true }
        }).as('exportSuccess');
    }
}

export default DesignApiHelpers;