// ==================== ANNOUNCEMENT DASHBOARD TESTS ====================
describe('Announcement Dashboard', () => {
  beforeEach(() => {
    // Set adminToken before visiting protected routes
    cy.visit('http://localhost:5173/announcements', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should display dashboard with all elements', () => {
    cy.contains('Announcement Management', { timeout: 10000 }).should('be.visible');
    cy.contains('Export Excel').should('be.visible');
    cy.contains('Add New Announcement').should('be.visible');
    
    // Verify table headers
    cy.contains('Title').should('be.visible');
    cy.contains('Content').should('be.visible');
    cy.contains('Date').should('be.visible');
    cy.contains('Actions').should('be.visible');
  });

  it('should load announcement data table with headers', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: [
        {
          _id: '1',
          title: 'Test Announcement 1',
          content: 'This is the content of test announcement 1',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');
    
    // Check if table headers are visible
    cy.contains('Title').should('be.visible');
    cy.contains('Content').should('be.visible');
    cy.contains('Date').should('be.visible');
    cy.contains('Actions').should('be.visible');

    // Verify data is displayed
    cy.contains('Test Announcement 1').should('be.visible');
    cy.contains('This is the content of test announcement 1').should('be.visible');
  });

  it('should navigate to add announcement page', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: []
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');

    cy.contains('Add New Announcement').click();
    cy.url().should('include', '/addAnnouncement');
  });

  it('should navigate to edit announcement page', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: [{
        _id: '1',
        title: 'Test Announcement',
        content: 'Test content for announcement',
        createdAt: '2024-01-01T00:00:00.000Z'
      }]
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');

    // Click on edit button in the actions column
    cy.contains('tr', 'Test Announcement').within(() => {
      cy.contains('Edit').click();
    });
    
    cy.url().should('include', '/editAnnouncements/1');
  });

//   it('should delete announcement with confirmation', () => {
//     const announcementData = [{
//       _id: '1',
//       title: 'Delete Announcement',
//       content: 'This announcement will be deleted',
//       createdAt: '2024-01-01T00:00:00.000Z'
//     }];

//     // Initial load with announcement
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: announcementData
//     }).as('getAnnouncements');

//     cy.wait('@getAnnouncements');

//     // Verify announcement exists
//     cy.contains('Delete Announcement').should('be.visible');

//     // Mock delete response
//     cy.intercept('DELETE', 'http://localhost:5000/api/announcements/1', {
//       statusCode: 200,
//       body: { message: 'Announcement deleted successfully' }
//     }).as('deleteAnnouncement');

//     // Mock the refreshed list after delete
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: []
//     }).as('getAnnouncementsAfterDelete');

//     // Stub window.confirm to return true
//     cy.window().then((win) => {
//       cy.stub(win, 'confirm').returns(true);
//     });

//     // Click delete button
//     cy.contains('tr', 'Delete Announcement').within(() => {
//       cy.contains('Delete').click();
//     });
    
//     cy.wait('@deleteAnnouncement');
//     cy.wait('@getAnnouncementsAfterDelete');
    
//     // Verify the announcement is removed from the list
//     cy.contains('Delete Announcement').should('not.exist', { timeout: 5000 });
//   });

//   it('should cancel delete when user declines confirmation', () => {
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: [{
//         _id: '1',
//         title: 'Keep Announcement',
//         content: 'This announcement will be kept',
//         createdAt: '2024-01-01T00:00:00.000Z'
//       }]
//     }).as('getAnnouncements');

//     cy.wait('@getAnnouncements');

//     // Stub window.confirm to return false
//     cy.window().then((win) => {
//       cy.stub(win, 'confirm').returns(false);
//     });

//     // Mock that no DELETE call should be made
//     cy.intercept('DELETE', 'http://localhost:5000/api/announcements/1', {
//       statusCode: 500
//     }).as('deleteAnnouncement');

//     // Click delete button
//     cy.contains('tr', 'Keep Announcement').within(() => {
//       cy.contains('Delete').click();
//     });

//     // Announcement should still be visible (no delete happened)
//     cy.contains('Keep Announcement').should('be.visible');
    
//     // Verify DELETE was NOT called
//     cy.get('@deleteAnnouncement').should('not.have.been.called');
//   });

//   it('should export to Excel successfully', () => {
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: [{
//         _id: '1',
//         title: 'Export Announcement',
//         content: 'This announcement will be exported',
//         createdAt: '2024-01-01T00:00:00.000Z'
//       }]
//     }).as('getAnnouncements');

//     cy.wait('@getAnnouncements');

//     // Verify data is loaded
//     cy.contains('Export Announcement').should('be.visible');

//     // Stub saveAs function from file-saver
//     cy.window().then((win) => {
//       win.saveAs = cy.stub().as('saveAsStub');
//     });

//     // Click export button
//     cy.contains('Export Excel').click();
    
//     // Wait for export processing
//     cy.wait(1000);
    
//     // Verify saveAs was called
//     cy.get('@saveAsStub').should('have.been.calledOnce');
//   });

  it('should show alert when exporting with no data', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: []
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');

    // Verify no data message
    cy.contains('No announcements found.').should('be.visible');

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    // Click export button
    cy.contains('Export Excel').click();
    
    // Verify alert was called with correct message
    cy.get('@alertStub').should('be.calledWith', 'No data available to export!');
  });

  it('should show loading state', () => {
    // Delay API response to see loading state
    cy.intercept('GET', 'http://localhost:5000/api/announcements', (req) => {
      req.reply({
        statusCode: 200,
        body: [],
        delay: 2000
      });
    }).as('getAnnouncements');

    // Check loading state appears
    cy.contains('Loading announcements...', { timeout: 1000 }).should('be.visible');
    
    // Wait for API call to complete
    cy.wait('@getAnnouncements');
    
    // Loading should disappear
    cy.contains('Loading announcements...').should('not.exist');
  });

  it('should show no data message when no announcements exist', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: []
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');
    cy.contains('No announcements found.').should('be.visible');
  });

  it('should navigate back with back arrow', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: []
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');

    // Click the ArrowLeft icon (back button)
    cy.get('svg').first().click();
    
    // Should navigate back
    cy.url().should('not.include', '/announcements');
  });

//   it('should handle delete error gracefully', () => {
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: [{
//         _id: '1',
//         title: 'Error Announcement',
//         content: 'This announcement will cause an error',
//         createdAt: '2024-01-01T00:00:00.000Z'
//       }]
//     }).as('getAnnouncements');

//     cy.intercept('DELETE', 'http://localhost:5000/api/announcements/1', {
//       statusCode: 500,
//       body: { message: 'Server error' }
//     }).as('deleteAnnouncement');

//     cy.wait('@getAnnouncements');

//     // Stub window methods
//     cy.window().then((win) => {
//       cy.stub(win, 'confirm').returns(true);
//     });

//     // Click delete button
//     cy.contains('tr', 'Error Announcement').within(() => {
//       cy.contains('Delete').click();
//     });
    
//     cy.wait('@deleteAnnouncement');
    
//     // Error should be displayed in the component
//     cy.contains('Error:').should('be.visible');
    
//     // Announcement should still be visible (delete failed)
//     cy.contains('Error Announcement').should('be.visible');
//   });

  it('should display truncated content in table', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: [{
        _id: '1',
        title: 'Long Content Announcement',
        content: 'This is a very long content that should be truncated in the table view to show only the first 50 characters followed by ellipsis',
        createdAt: '2024-01-01T00:00:00.000Z'
      }]
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');

    // Check if content is truncated
    cy.contains('tr', 'Long Content Announcement').within(() => {
      cy.get('td').eq(1).should('contain', '...');
    });
  });
});

// ==================== ADD ANNOUNCEMENT TESTS ====================
describe('Add Announcement', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/addAnnouncement', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should display add announcement form with all fields', () => {
    // Check header
    cy.contains('Add New Announcement').should('be.visible');
    
    // Check all form fields
    cy.contains('label', 'Title').should('be.visible');
    cy.contains('label', 'Content').should('be.visible');
    
    // Check buttons
    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Save Announcement').should('be.visible');
  });

  it('should fill and submit add announcement form successfully', () => {
    cy.intercept('POST', 'http://localhost:5000/api/announcements', {
      statusCode: 201,
      body: {
        _id: '123',
        title: 'New Test Announcement',
        content: 'This is a new test announcement content',
        createdAt: new Date().toISOString()
      }
    }).as('createAnnouncement');

    // Fill form fields
    cy.get('input[name="title"]').type('New Test Announcement');
    cy.get('textarea[name="content"]').type('This is a new test announcement content');

    // Submit form
    cy.contains('button', 'Save Announcement').click();

    cy.wait('@createAnnouncement');
    
    // Should navigate to dashboard
    cy.url().should('include', '/announcements');
  });

  it('should cancel and navigate back', () => {
    cy.contains('button', 'Cancel').click();
    cy.url().should('not.include', '/addAnnouncement');
  });

  it('should handle form submission error', () => {
    cy.intercept('POST', 'http://localhost:5000/api/announcements', {
      statusCode: 400,
      body: { message: 'Validation error' }
    }).as('createAnnouncement');

    // Fill minimum required fields
    cy.get('input[name="title"]').type('Test Announcement');
    cy.get('textarea[name="content"]').type('Test content');

    // Submit form
    cy.contains('button', 'Save Announcement').click();

    cy.wait('@createAnnouncement');
    
    // Should stay on the same page (form submission failed)
    cy.url().should('include', '/addAnnouncement');
  });

  it('should validate required fields', () => {
    // Try to submit empty form
    cy.contains('button', 'Save Announcement').click();
    
    // Should stay on the same page due to HTML5 validation
    cy.url().should('include', '/addAnnouncement');
  });

  it('should handle network error during form submission', () => {
    cy.intercept('POST', 'http://localhost:5000/api/announcements', {
      forceNetworkError: true
    }).as('createAnnouncementError');

    // Fill form fields
    cy.get('input[name="title"]').type('Test Announcement');
    cy.get('textarea[name="content"]').type('Test content');

    // Submit form
    cy.contains('button', 'Save Announcement').click();

    cy.wait('@createAnnouncementError');
    
    // Should stay on the same page
    cy.url().should('include', '/addAnnouncement');
  });
});

// ==================== EDIT ANNOUNCEMENT TESTS ====================
describe('Edit Announcement', () => {
  const announcementId = '123';
  const announcementData = {
    _id: '123',
    title: 'Existing Announcement',
    content: 'This is the existing announcement content',
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    cy.intercept('GET', `http://localhost:5000/api/announcements/${announcementId}`, {
      statusCode: 200,
      body: announcementData
    }).as('getAnnouncement');

    cy.visit(`http://localhost:5173/editAnnouncements/${announcementId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
    
    cy.wait('@getAnnouncement');
  });

  it('should display edit announcement form with existing data', () => {
    // Check header shows EDIT mode
    cy.contains('Edit Announcement').should('be.visible');
    
    // Verify form is populated with existing data
    cy.get('input[name="title"]').should('have.value', 'Existing Announcement');
    cy.get('textarea[name="content"]').should('have.value', 'This is the existing announcement content');
    
    // Check submit button shows "Update"
    cy.contains('button', 'Update Announcement').should('be.visible');
  });

  it('should update announcement data successfully', () => {
    cy.intercept('PUT', `http://localhost:5000/api/announcements/${announcementId}`, {
      statusCode: 200,
      body: {
        _id: '123',
        title: 'Updated Announcement',
        content: 'This is the updated content',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    }).as('updateAnnouncement');

    // Modify form fields
    cy.get('input[name="title"]').clear().type('Updated Announcement');
    cy.get('textarea[name="content"]').clear().type('This is the updated content');

    // Submit form
    cy.contains('button', 'Update Announcement').click();

    cy.wait('@updateAnnouncement');
    
    // Should navigate to dashboard
    cy.url().should('include', '/announcements');
  });

  it('should handle update error', () => {
    cy.intercept('PUT', `http://localhost:5000/api/announcements/${announcementId}`, {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('updateAnnouncement');

    // Modify a field
    cy.get('input[name="title"]').clear().type('Updated Title');

    // Submit form
    cy.contains('button', 'Update Announcement').click();

    cy.wait('@updateAnnouncement');
    
    // Should stay on the same page
    cy.url().should('include', `/editAnnouncements/${announcementId}`);
  });

  it('should cancel editing and navigate back', () => {
    cy.contains('button', 'Cancel').click();
    cy.url().should('not.include', '/editAnnouncements');
  });

  it('should handle announcement not found error', () => {
    const invalidId = '999';
    
    cy.intercept('GET', `http://localhost:5000/api/announcements/${invalidId}`, {
      statusCode: 404,
      body: { message: 'Announcement not found' }
    }).as('getAnnouncementNotFound');

    cy.visit(`http://localhost:5173/editAnnouncements/${invalidId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
    
    cy.wait('@getAnnouncementNotFound');
    
    // Should handle 404 gracefully
    cy.get('form').should('exist');
  });

  it('should preserve form data when canceling edit', () => {
    // Modify some fields
    cy.get('input[name="title"]').clear().type('Modified Title');
    cy.get('textarea[name="content"]').clear().type('Modified content');
    
    // Click cancel
    cy.contains('button', 'Cancel').click();
    
    // Should navigate away without saving
    cy.url().should('not.include', '/editAnnouncements');
  });

  it('should handle network error during announcement fetch', () => {
    const invalidId = '888';
    
    cy.intercept('GET', `http://localhost:5000/api/announcements/${invalidId}`, {
      forceNetworkError: true
    }).as('getAnnouncementNetworkError');

    cy.visit(`http://localhost:5173/editAnnouncements/${invalidId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
    
    cy.wait('@getAnnouncementNetworkError');
    
    // Form should handle error state gracefully
    cy.get('form').should('exist');
  });
});

// ==================== INTEGRATION TESTS ====================
describe('Announcement Management Integration', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/announcements', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

//   it('should complete full announcement lifecycle', () => {
//     // Start with empty list
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: []
//     }).as('getEmptyAnnouncements');

//     cy.wait('@getEmptyAnnouncements');

//     // Verify empty state
//     cy.contains('No announcements found.').should('be.visible');

//     // Step 2: Click Add New Announcement
//     cy.contains('Add New Announcement').click();
//     cy.url().should('include', '/addAnnouncement');

//     // Step 3: Fill and submit form
//     cy.intercept('POST', 'http://localhost:5000/api/announcements', {
//       statusCode: 201,
//       body: {
//         _id: '123',
//         title: 'Integration Test Announcement',
//         content: 'This is an integration test announcement',
//         createdAt: new Date().toISOString()
//       }
//     }).as('createAnnouncement');

//     // Fill form with required fields
//     cy.get('input[name="title"]').type('Integration Test Announcement');
//     cy.get('textarea[name="content"]').type('This is an integration test announcement');
    
//     // Submit form
//     cy.contains('button', 'Save Announcement').click();
//     cy.wait('@createAnnouncement');

//     // Step 4: Verify redirect to dashboard
//     cy.url().should('include', '/announcements');

//     // Step 5: Verify new announcement appears in the list
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: [{
//         _id: '123',
//         title: 'Integration Test Announcement',
//         content: 'This is an integration test announcement',
//         createdAt: new Date().toISOString()
//       }]
//     }).as('getUpdatedAnnouncements');

//     cy.wait('@getUpdatedAnnouncements');
//     cy.contains('Integration Test Announcement', { timeout: 10000 }).should('be.visible');
//   });

//   it('should handle announcement CRUD operations', () => {
//     // Start with empty list
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: []
//     }).as('getEmptyAnnouncements');

//     cy.wait('@getEmptyAnnouncements');

//     // Create announcement
//     cy.contains('Add New Announcement').click();
//     cy.url().should('include', '/addAnnouncement');
    
//     cy.intercept('POST', 'http://localhost:5000/api/announcements', {
//       statusCode: 201,
//       body: {
//         _id: '123',
//         title: 'CRUD Test Announcement',
//         content: 'This is a CRUD test announcement',
//         createdAt: new Date().toISOString()
//       }
//     }).as('createAnnouncement');

//     // Fill form
//     cy.get('input[name="title"]').type('CRUD Test Announcement');
//     cy.get('textarea[name="content"]').type('This is a CRUD test announcement');
    
//     // Submit
//     cy.contains('button', 'Save Announcement').click();
//     cy.wait('@createAnnouncement');

//     // Verify announcement appears in list
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: [{
//         _id: '123',
//         title: 'CRUD Test Announcement',
//         content: 'This is a CRUD test announcement',
//         createdAt: new Date().toISOString()
//       }]
//     }).as('getAnnouncementsAfterCreate');

//     cy.wait('@getAnnouncementsAfterCreate');
//     cy.contains('CRUD Test Announcement', { timeout: 10000 }).should('be.visible');

//     // Update announcement
//     cy.contains('tr', 'CRUD Test Announcement').within(() => {
//       cy.contains('Edit').click();
//     });

//     cy.url().should('include', '/editAnnouncements/123');

//     cy.intercept('PUT', 'http://localhost:5000/api/announcements/123', {
//       statusCode: 200,
//       body: {
//         _id: '123',
//         title: 'Updated CRUD Announcement',
//         content: 'This is the updated CRUD announcement',
//         createdAt: new Date().toISOString()
//       }
//     }).as('updateAnnouncement');

//     // Update the title
//     cy.get('input[name="title"]').clear().type('Updated CRUD Announcement');
//     cy.contains('button', 'Update Announcement').click();
    
//     cy.wait('@updateAnnouncement');

//     // Verify update in list
//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: [{
//         _id: '123',
//         title: 'Updated CRUD Announcement',
//         content: 'This is the updated CRUD announcement',
//         createdAt: new Date().toISOString()
//       }]
//     }).as('getAnnouncementsAfterUpdate');

//     cy.wait('@getAnnouncementsAfterUpdate');
//     cy.contains('Updated CRUD Announcement', { timeout: 10000 }).should('be.visible');

//     // Delete announcement
//     cy.intercept('DELETE', 'http://localhost:5000/api/announcements/123', {
//       statusCode: 200,
//       body: { message: 'Announcement deleted successfully' }
//     }).as('deleteAnnouncement');

//     cy.intercept('GET', 'http://localhost:5000/api/announcements', {
//       statusCode: 200,
//       body: []
//     }).as('getAnnouncementsAfterDelete');

//     // Stub confirm
//     cy.window().then((win) => {
//       cy.stub(win, 'confirm').returns(true);
//     });

//     cy.contains('tr', 'Updated CRUD Announcement').within(() => {
//       cy.contains('Delete').click();
//     });
    
//     cy.wait('@deleteAnnouncement');
//     cy.wait('@getAnnouncementsAfterDelete');

//     // Verify deletion
//     cy.contains('Updated CRUD Announcement').should('not.exist', { timeout: 10000 });
//     cy.contains('No announcements found.').should('be.visible');
//   });

});

// ==================== ERROR HANDLING TESTS ====================
describe('Announcement Error Handling', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/announcements', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should handle API server down gracefully', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('getAnnouncementsError');

    cy.wait('@getAnnouncementsError');
    
    // Should show error message
    cy.contains('Error:').should('be.visible');
  });

  it('should handle network errors', () => {
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      forceNetworkError: true
    }).as('getAnnouncementsNetworkError');

    cy.wait('@getAnnouncementsNetworkError');
    
    // Should handle network failure gracefully
    cy.contains('Error:').should('be.visible');
  });
});

// ==================== EDGE CASE TESTS ====================
describe('Announcement Edge Cases', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/announcements', {
      onBeforeLoad(win) {
        win.localStorage.setItem('adminToken', 'mock-admin-token-for-testing');
      }
    });
  });

  it('should handle very long announcement titles', () => {
    const longTitle = 'A'.repeat(100);
    const longContent = 'B'.repeat(500);
    
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: [{
        _id: '1',
        title: longTitle,
        content: longContent,
        createdAt: '2024-01-01T00:00:00.000Z'
      }]
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');
    
    // Should handle long titles without breaking UI
    cy.contains(longTitle.substring(0, 50)).should('be.visible');
  });

  it('should handle special characters in content', () => {
    const specialContent = 'Announcement with @#$%^&*() special characters <>?/{}[]|';
    
    cy.intercept('GET', 'http://localhost:5000/api/announcements', {
      statusCode: 200,
      body: [{
        _id: '1',
        title: 'Special Characters',
        content: specialContent,
        createdAt: '2024-01-01T00:00:00.000Z'
      }]
    }).as('getAnnouncements');

    cy.wait('@getAnnouncements');
    
    // Should handle special characters without errors
    cy.contains('Special Characters').should('be.visible');
  });
});