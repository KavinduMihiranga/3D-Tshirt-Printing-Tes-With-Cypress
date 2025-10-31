import EditAnnouncementPage from '../../support/pageObjects/EditAnnouncementPage';
import AnnouncementApiHelpers from '../../support/helpers/announcementApiHelpers';
import AnnouncementDataGenerators from '../../support/helpers/announcementDataGenerators';

describe('Edit Announcement', () => {
    const announcementId = '123';
    const existingAnnouncement = AnnouncementDataGenerators.generateAnnouncement({
        _id: announcementId,
        title: 'Existing Title',
        content: 'Existing Content'
    });
    const editPage = new EditAnnouncementPage(announcementId);

    beforeEach(() => {
        AnnouncementApiHelpers.mockGetAnnouncement(announcementId, existingAnnouncement);
        editPage.visit();
        cy.wait('@getAnnouncement');
    });

    it('should display form with existing data', () => {
        editPage
            .verifyPageLoaded()
            .verifyTitle('Existing Title')
            .verifyContent('Existing Content');
    });

    it('should update announcement successfully', () => {
        AnnouncementApiHelpers.mockUpdateAnnouncement(announcementId);
        
        editPage
            .updateForm('Updated Title', 'Updated Content')
            .submit();

        cy.wait('@updateAnnouncement');
        cy.url().should('include', '/announcements');
    });

    it('should cancel editing', () => {
        editPage.cancel();
        cy.url().should('not.include', '/editAnnouncements');
    });

    it('should handle update errors', () => {
        AnnouncementApiHelpers.mockError('PUT', `**/api/announcements/${announcementId}**`, 500);
        
        editPage
            .updateForm('Updated Title', 'Updated Content')
            .submit();

        cy.url().should('include', `/editAnnouncements/${announcementId}`);
    });
});