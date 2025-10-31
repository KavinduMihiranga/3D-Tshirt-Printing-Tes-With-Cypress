describe('Product Detail Debug', () => {
  it('should debug what happens on product detail page', () => {
    const productId = '123';
    
    // Log all network requests
    cy.intercept('*', (req) => {
      console.log('🔍 NETWORK:', req.method, req.url);
      req.continue();
    });

    // Set auth
    cy.window().then((win) => {
      win.localStorage.setItem('adminToken', 'test-token-123');
    });

    console.log('🚀 Visiting product detail page...');
    
    cy.visit(`/product/${productId}`);
    
    // Wait and check what's displayed
    cy.wait(5000);
    
    cy.get('body').then(($body) => {
      console.log('📄 PAGE CONTENT:');
      console.log('Title:', $body.find('h1, h2').text());
      console.log('Product name exists:', $body.text().includes('T-shirt') || $body.text().includes('Product'));
      console.log('Price exists:', $body.text().includes('Rs.') || $body.text().includes('$'));
      console.log('Add to Cart button exists:', $body.find('button:contains("Add to Cart")').length > 0);
      
      // Log all text content for analysis
      console.log('Full page text:', $body.text().substring(0, 500) + '...');
    });
  });
});