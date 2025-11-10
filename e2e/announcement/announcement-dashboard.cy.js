import AnnouncementDashboardPage from '../../support/pageObjects/AnnouncementDashboardPage';
import AnnouncementApiHelpers from '../../support/helpers/announcementApiHelpers';
import AnnouncementDataGenerators from '../../support/helpers/announcementDataGenerators';

describe('Announcement Dashboard', () => {
    const dashboardPage = new AnnouncementDashboardPage();
    let testAnnouncements;

    beforeEach(() => {
        testAnnouncements = AnnouncementDataGenerators.generateMultipleAnnouncements(2);
    });

    it('should display dashboard with announcements', () => {
        AnnouncementApiHelpers.mockGetAnnouncements(testAnnouncements);
        
        dashboardPage
            .visit()
            .verifyPageLoaded()
            .verifyAnnouncementExists('Announcement 1')
            .verifyAnnouncementExists('Announcement 2');

        cy.contains('Announcement Management').should('be.visible');
        cy.contains('Add New Announcement').should('be.visible');
    });

    it('should navigate to add announcement page', () => {
        AnnouncementApiHelpers.mockGetAnnouncements([]);
        
        dashboardPage
            .visit()
            .clickAddNewAnnouncement();

        cy.url().should('include', '/addAnnouncement');
    });

    it('should navigate to edit announcement page', () => {
        AnnouncementApiHelpers.mockGetAnnouncements(testAnnouncements);
        
        dashboardPage
            .visit()
            .clickEditAnnouncement('Announcement 1');

        cy.url().should('include', '/editAnnouncements/1');
    });

    it('should show no data message', () => {
        AnnouncementApiHelpers.mockGetAnnouncements([]);
        
        dashboardPage
            .visit()
            .verifyNoDataMessage();
    });

    // it('should search announcements', () => {
    //     AnnouncementApiHelpers.mockGetAnnouncements(testAnnouncements);
        
    //     dashboardPage
    //         .visit()
    //         .searchAnnouncements('Announcement 1')
    //         .verifyAnnouncementExists('Announcement 1')
    //         .verifyAnnouncementNotExists('Announcement 2')
    //         .clearSearch()
    //         .verifyAnnouncementExists('Announcement 2');
    // });
});