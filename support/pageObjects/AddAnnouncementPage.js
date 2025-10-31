import BasePage from './BasePage';

class AddAnnouncementPage extends BasePage {
    constructor() {
        super();
        this.url = '/addAnnouncement';
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Add New Announcement').should('be.visible');
        return this;
    }

    fillTitle(title) {
        cy.get('input[name="title"]').clear().type(title);
        return this;
    }

    fillContent(content) {
        cy.get('textarea[name="content"]').clear().type(content);
        return this;
    }

    submit() {
        cy.contains('button', 'Save Announcement').click();
        return this;
    }

    cancel() {
        cy.contains('button', 'Cancel').click();
        return this;
    }

    fillForm(title, content) {
        return this.fillTitle(title).fillContent(content);
    }
}

export default AddAnnouncementPage;