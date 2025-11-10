import BasePage from './BasePage';

class EditAnnouncementPage extends BasePage {
    constructor(announcementId) {
        super();
        this.url = `/editAnnouncements/${announcementId}`;
    }

    visit() {
        super.visit(this.url);
        return this;
    }

    verifyPageLoaded() {
        cy.contains('Edit Announcement').should('be.visible');
        return this;
    }

    verifyTitle(value) {
        cy.get('input[name="title"]').should('have.value', value);
        return this;
    }

    verifyContent(value) {
        cy.get('textarea[name="content"]').should('have.value', value);
        return this;
    }

    updateTitle(title) {
        cy.get('input[name="title"]').clear().type(title);
        return this;
    }

    updateContent(content) {
        cy.get('textarea[name="content"]').clear().type(content);
        return this;
    }

    submit() {
        cy.contains('button', 'Update Announcement').click();
        return this;
    }

    cancel() {
        cy.contains('button', 'Cancel').click();
        return this;
    }

    updateForm(title, content) {
        return this.updateTitle(title).updateContent(content);
    }
}

export default EditAnnouncementPage;