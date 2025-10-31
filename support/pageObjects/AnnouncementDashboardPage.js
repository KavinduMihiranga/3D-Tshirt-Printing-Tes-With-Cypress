import BasePage from './BasePage';

class AnnouncementDashboardPage extends BasePage {
    constructor() {
        super();
        this.url = '/announcements';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Announcement Management').should('be.visible');
        return this;
    }

    clickAddNewAnnouncement() {
        cy.contains('Add New Announcement').click();
        return this;
    }

    clickEditAnnouncement(title) {
        cy.contains('tr', title).within(() => {
            cy.contains('Edit').click();
        });
        return this;
    }

    clickDeleteAnnouncement(title) {
        cy.contains('tr', title).within(() => {
            cy.contains('Delete').click();
        });
        return this;
    }

    verifyAnnouncementExists(title) {
        cy.contains('tr', title).should('be.visible');
        return this;
    }

    verifyAnnouncementNotExists(title) {
        cy.contains('tr', title).should('not.exist');
        return this;
    }

    verifyNoDataMessage() {
        cy.contains('No announcements found.').should('be.visible');
        return this;
    }

    searchAnnouncements(searchTerm) {
        cy.get('input[placeholder*="Search"]').type(searchTerm);
        return this;
    }

    clearSearch() {
        cy.get('input[placeholder*="Search"]').clear();
        return this;
    }
}

export default AnnouncementDashboardPage;