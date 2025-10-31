export const mockApiEndpoints = () => {
  const mockProducts = [
    {
      _id: "mock-product-id-1",
      name: "Mock T-Shirt",
      category: "T-Shirts",
      price: 1200,
      qty: 50,
      status: "Available",
    },
  ];

  cy.intercept("GET", "/api/products", { statusCode: 200, body: mockProducts }).as("getProducts");
  cy.intercept("GET", "/api/products/mock-product-id-1", { statusCode: 200, body: mockProducts[0] }).as("getProductById");
  cy.intercept("DELETE", "/api/products/*", { statusCode: 200, body: { message: "Product deleted successfully" } }).as("deleteProduct");
  cy.intercept("POST", "/api/products", { statusCode: 201, body: { message: "Product added successfully" } }).as("addProduct");
  cy.intercept("PUT", "/api/products/*", { statusCode: 200, body: { message: "Product updated successfully" } }).as("updateProduct");
};
