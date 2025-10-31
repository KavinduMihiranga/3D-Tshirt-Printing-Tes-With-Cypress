it('should complete full product lifecycle', () => {
    const newProduct = ProductDataGenerators.getValidProductData();
    const productName = newProduct.name; // Use variable
    
    // Start with empty dashboard
    ProductApiHelpers.mockGetProducts([]);
    dashboardPage.visit();
    dashboardPage.verifyNoDataMessage();

    // Add debugging
    cy.log('Starting product creation...');

    // Add new product
    ProductApiHelpers.mockCreateProduct({
        message: 'Product created successfully',
        data: { _id: 'new-123' }
    });
    dashboardPage.clickAddNewProduct();
    
    addPage
        .fillForm(newProduct)
        .submit();
    
    cy.wait('@createProduct').then((interception) => {
        cy.log('Create product response:', interception.response?.body);
    });

    // Verify product appears in list
    const createdProduct = ProductDataGenerators.generateProduct({
        _id: 'new-123',
        name: productName, // Use the same name
        category: newProduct.category,
        price: parseInt(newProduct.price),
        qty: parseInt(newProduct.qty)
    });
    
    // Mock the updated products list
    ProductApiHelpers.mockGetProducts([createdProduct]);
    
    // Add explicit reload and wait
    cy.reload();
    cy.wait('@getProducts').then((interception) => {
        cy.log('Get products response:', interception.response?.body);
    });
    
    // Debug: Check what's actually in the table
    cy.get('table tbody tr').then(($rows) => {
        cy.log(`Found ${$rows.length} rows in table`);
        $rows.each((index, row) => {
            cy.log(`Row ${index}: ${row.textContent}`);
        });
    });
    
    dashboardPage.verifyProductExists(productName);
});