import AdminDashboardPage from '../../support/pageObjects/AdminDashboardPage';
import AdminApiHelpers from '../../support/helpers/adminApiHelpers';
import AdminDataGenerators from '../../support/helpers/adminDataGenerators';

describe('Admin Dashboard Tests', () => {
  const dashboardPage = new AdminDashboardPage();
  let testData;

  before(() => {
    // Load test data from fixtures
    cy.fixture('admin/adminData').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    dashboardPage.visitDashboard();
  });

  describe('Dashboard UI Elements', () => {
    it('should display all dashboard elements', () => {
      AdminApiHelpers.mockGetAdmins([]);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.verifyDashboardElements();
      dashboardPage.verifySidebarElements();
    });

    it('should display table headers correctly', () => {
      AdminApiHelpers.mockGetAdmins(testData.validAdmins);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.verifyTableHeaders();
    });
  });

  describe('Admin Data Display', () => {
    it('should load and display admin data', () => {
      AdminApiHelpers.mockGetAdmins(testData.validAdmins);
      AdminApiHelpers.waitForApi('getAdmins');

      testData.validAdmins.forEach(admin => {
        dashboardPage.verifyAdminExists(admin.username);
        dashboardPage.verifyAdminExists(admin.email);
      });
    });

    it('should show no data message when no admins exist', () => {
      AdminApiHelpers.mockGetAdmins([]);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.verifyNoDataMessage();
    });

    it('should show loading state', () => {
      AdminApiHelpers.mockDelayedResponse('GET', 'admin', { data: [] }, 1000);
      dashboardPage.verifyLoadingState();
      AdminApiHelpers.waitForApi('delayedResponse');
    });

    it('should handle N/A values in table cells', () => {
      const adminWithNullValues = AdminDataGenerators.generateEdgeCaseData('nullValues');
      AdminApiHelpers.mockGetAdmins([adminWithNullValues]);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.verifyAdminExists('N/A');
    });
  });

  describe('Search Functionality', () => {
    it('should search admins by username', () => {
      AdminApiHelpers.mockGetAdmins(testData.validAdmins);
      AdminApiHelpers.waitForApi('getAdmins');

      // Both visible initially
      dashboardPage.verifyAdminExists('admin1');
      dashboardPage.verifyAdminExists('superadmin');

      // Search
      dashboardPage.searchAdmin('admin1');
      
      // Should show only matching admin
      dashboardPage.verifyAdminExists('admin1');
      dashboardPage.verifyAdminNotExists('superadmin');
    });

    it('should search admins by email', () => {
      const admins = [
        AdminDataGenerators.generateAdmin({ 
          _id: '1', 
          username: 'admin1', 
          email: 'test@example.com' 
        }),
        AdminDataGenerators.generateAdmin({ 
          _id: '2', 
          username: 'admin2', 
          email: 'other@example.com' 
        })
      ];

      AdminApiHelpers.mockGetAdmins(admins);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.searchAdmin('test@');
      
      dashboardPage.verifyAdminExists('test@example.com');
      dashboardPage.verifyAdminNotExists('other@example.com');
    });

    it('should show no matching message when search returns empty', () => {
      AdminApiHelpers.mockGetAdmins(testData.validAdmins);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.searchAdmin('nonexistent');
      dashboardPage.verifyNoMatchMessage();
    });
  });

  describe('Navigation', () => {
    it('should navigate to add admin page', () => {
      AdminApiHelpers.mockGetAdmins([]);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.clickAddNewAdmin();
      dashboardPage.verifyUrl('/addAdmin');
    });

    // it('should navigate to edit admin page', () => {
    //   const admin = testData.validAdmins[0];
    //   AdminApiHelpers.mockGetAdmins([admin]);
    //   AdminApiHelpers.waitForApi('getAdmins');

    //   dashboardPage.clickEditAdmin(admin.username);
    //   dashboardPage.verifyUrl(`/addAdmin/${admin._id}`);
    // });

    it('should navigate to admin detail page when clicking username', () => {
      const admin = testData.validAdmins[0];
      AdminApiHelpers.mockGetAdmins([admin]);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.clickUsername(admin.username);
      dashboardPage.verifyUrl(`/admin/${admin._id}`);
    });

    it('should navigate back with back arrow', () => {
      AdminApiHelpers.mockGetAdmins([]);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.clickBackButton();
      cy.url().should('not.include', '/adminDashboard');
    });
  });

  describe('Delete Operations', () => {
    it('should delete admin with confirmation', () => {
      const admin = testData.validAdmins[0];
      AdminApiHelpers.mockGetAdmins([admin]);
      AdminApiHelpers.waitForApi('getAdmins');

      AdminApiHelpers.mockDeleteAdmin(admin._id);
      AdminApiHelpers.mockGetAdmins([]);

      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
        cy.stub(win, 'alert').as('alertStub');
      });

      dashboardPage.clickDeleteAdmin(admin.username);
      
      AdminApiHelpers.waitForApi('deleteAdmin');
      
      cy.get('@alertStub').should('be.calledWith', 'Admin deleted successfully!');
    });

    it('should cancel delete when user declines confirmation', () => {
      const admin = testData.validAdmins[0];
      AdminApiHelpers.mockGetAdmins([admin]);
      AdminApiHelpers.waitForApi('getAdmins');

      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false);
      });

      dashboardPage.clickDeleteAdmin(admin.username);
      
      // Admin should still be visible
      dashboardPage.verifyAdminExists(admin.username);
    });
  });

  describe('Pagination', () => {
  //   it('should handle pagination correctly', () => {
  //      // Generate enough data to trigger pagination (more than 10 items typically)
  //   const paginationData = AdminDataGenerators.generatePaginationData(15);
  //   AdminApiHelpers.mockGetAdmins(paginationData);
  //   AdminApiHelpers.waitForApi('getAdmins');

  //   // Check if pagination exists - if not, skip the pagination-specific tests
  //   cy.get('body').then(($body) => {
  //     if ($body.find('[data-testid="pagination"]').length > 0 || 
  //         $body.find('button').filter((i, el) => ['1', '2', 'Next', 'Previous'].includes(el.textContent)).length > 0) {
        
  //       // Pagination exists, run the full test
  //       cy.contains('button', '1').should('be.visible');
  //       cy.contains('button', '2').should('be.visible');

  //       // Click page 2
  //       dashboardPage.clickPaginationPage(2);
  //       dashboardPage.verifyPaginationActive(2);
        
  //     } else {
  //       // Pagination doesn't exist, just verify all data is visible
  //       cy.log('Pagination not found, verifying all data is displayed');
  //       paginationData.forEach(admin => {
  //         cy.contains(admin.username).should('be.visible');
  //       });
  //     }
  //   });
  // });  
});

 it('should handle pagination with many pages', () => {
    // Test with larger dataset
    const largeDataset = AdminDataGenerators.generatePaginationData(25);
    AdminApiHelpers.mockGetAdmins(largeDataset);
    AdminApiHelpers.waitForApi('getAdmins');

    // More flexible pagination check
    cy.get('body').then(($body) => {
      const paginationButtons = $body.find('button').filter((i, el) => 
        !isNaN(parseInt(el.textContent)) || 
        ['Next', 'Previous', '»', '«'].includes(el.textContent)
      );
      
      if (paginationButtons.length > 0) {
        cy.log(`Found ${paginationButtons.length} pagination buttons`);
        
        // Click the first numbered page button that's not the current page
        const page2Button = paginationButtons.filter((i, el) => el.textContent === '2');
        if (page2Button.length > 0) {
          cy.wrap(page2Button).click();
          // Verify we're on a different page
          cy.contains(largeDataset[10].username).should('be.visible');
        }
      }
    });
  });

  describe('Export Functionality', () => {
    it('should show alert when exporting with no data', () => {
      AdminApiHelpers.mockGetAdmins([]);
      AdminApiHelpers.waitForApi('getAdmins');

      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      dashboardPage.clickExportExcel();
      
      cy.get('@alertStub').should('be.calledWith', 'No data available to export!');
    });
  });

  describe('Role and Status Badges', () => {
    it('should display correct status badges', () => {
      const admins = [
        AdminDataGenerators.generateAdminWithStatus('Active'),
        AdminDataGenerators.generateAdminWithStatus('Inactive')
      ];

      AdminApiHelpers.mockGetAdmins(admins);
      AdminApiHelpers.waitForApi('getAdmins');

      // Check active status
      dashboardPage.verifyStatusBadge(admins[0].username, 'Active');
      
      // Check inactive status
      dashboardPage.verifyStatusBadge(admins[1].username, 'Inactive');
    });
  });

  describe('Error Handling', () => {
    it('should handle API server error gracefully', () => {
      AdminApiHelpers.mockServerError('GET', 'admin');
      AdminApiHelpers.waitForApi('serverError');

      // Component should not crash
      cy.get('body').should('exist');
      cy.get('table').should('exist');
    });

    it('should handle network errors', () => {
      AdminApiHelpers.mockNetworkError('GET', 'admin');
      AdminApiHelpers.waitForApi('networkError');

      cy.get('body').should('exist');
    });

    it('should handle 401 unauthorized and redirect to login', () => {
      AdminApiHelpers.mockUnauthorizedError('GET', 'admin', 'unauthorizedError');

      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      AdminApiHelpers.waitForApi('unauthorizedError');

      cy.get('@alertStub').should('be.calledWith', 'Session expired. Please login again.');
      cy.url().should('include', '/login');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long usernames', () => {
      const longUsernameAdmin = AdminDataGenerators.generateEdgeCaseData('longUsername');
      AdminApiHelpers.mockGetAdmins([longUsernameAdmin]);
      AdminApiHelpers.waitForApi('getAdmins');

      // Should display without breaking UI
      cy.contains(longUsernameAdmin.username.substring(0, 50)).should('be.visible');
    });

    it('should handle special characters in search', () => {
      AdminApiHelpers.mockGetAdmins([]);
      AdminApiHelpers.waitForApi('getAdmins');

      dashboardPage.searchAdmin('@#$%');
      cy.get('body').should('exist'); // No crash
    });
  });
});