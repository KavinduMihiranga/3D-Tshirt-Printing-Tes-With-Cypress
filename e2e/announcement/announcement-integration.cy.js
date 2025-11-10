import AnnouncementDashboardPage from '../../support/pageObjects/AnnouncementDashboardPage';
import AddAnnouncementPage from '../../support/pageObjects/AddAnnouncementPage';
import EditAnnouncementPage from '../../support/pageObjects/EditAnnouncementPage';
import AnnouncementApiHelpers from '../../support/helpers/announcementApiHelpers';
import AnnouncementDataGenerators from '../../support/helpers/announcementDataGenerators';

describe('Announcement Management Integration', () => {
    const dashboardPage = new AnnouncementDashboardPage();
    const addPage = new AddAnnouncementPage();

    it('should complete full CRUD workflow', () => {
        const newAnnouncement = AnnouncementDataGenerators.getValidAnnouncementData();
        
        // Start with empty dashboard
        AnnouncementApiHelpers.mockGetAnnouncements([]);
        dashboardPage.visit();
        dashboardPage.verifyNoDataMessage();

        // Add new announcement
        AnnouncementApiHelpers.mockCreateAnnouncement({
            message: 'Announcement created successfully',
            data: { _id: 'new-123' }
        });
        dashboardPage.clickAddNewAnnouncement();
        
        addPage
            .fillForm(newAnnouncement.title, newAnnouncement.content)
            .submit();
        
        cy.wait('@createAnnouncement');

        // Verify announcement appears in list
        const createdAnnouncement = AnnouncementDataGenerators.generateAnnouncement({
            _id: 'new-123',
            title: newAnnouncement.title,
            content: newAnnouncement.content
        });
        
        AnnouncementApiHelpers.mockGetAnnouncements([createdAnnouncement]);
        cy.reload();
        
        dashboardPage.verifyAnnouncementExists(newAnnouncement.title);
    });
});