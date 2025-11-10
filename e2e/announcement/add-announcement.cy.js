import AddAnnouncementPage from '../../support/pageObjects/AddAnnouncementPage';
import AnnouncementApiHelpers from '../../support/helpers/announcementApiHelpers';
import AnnouncementDataGenerators from '../../support/helpers/announcementDataGenerators';

describe('Add Announcement', () => {
    const addPage = new AddAnnouncementPage();
    const validData = AnnouncementDataGenerators.getValidAnnouncementData();

    beforeEach(() => {
        addPage.visit();
    });

    it('should display add announcement form', () => {
        addPage.verifyPageLoaded();
        
        cy.get('input[name="title"]').should('be.visible');
        cy.get('textarea[name="content"]').should('be.visible');
        cy.contains('button', 'Save Announcement').should('be.visible');
    });

    it('should submit announcement successfully', () => {
        AnnouncementApiHelpers.mockCreateAnnouncement();
        
        addPage
            .fillForm(validData.title, validData.content)
            .submit();

        cy.wait('@createAnnouncement');
        cy.url().should('include', '/announcements');
    });

    it('should cancel and navigate away', () => {
        addPage.cancel();
        cy.url().should('not.include', '/addAnnouncement');
    });

    it('should handle validation errors', () => {
        AnnouncementApiHelpers.mockError('POST', '**/api/announcements**', 400);
        
        addPage.submit();
        cy.url().should('include', '/addAnnouncement');
    });
});