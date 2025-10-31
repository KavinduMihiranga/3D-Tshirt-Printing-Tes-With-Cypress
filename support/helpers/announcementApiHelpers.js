class AnnouncementApiHelpers {
    mockGetAnnouncements(announcements = []) {
        cy.intercept('GET', '**/api/announcements**', {
            statusCode: 200,
            body: announcements
        }).as('getAnnouncements');
    }

    mockGetAnnouncement(announcementId, announcementData) {
        cy.intercept('GET', `**/api/announcements/${announcementId}**`, {
            statusCode: 200,
            body: announcementData
        }).as('getAnnouncement');
    }

    mockCreateAnnouncement(response = { message: 'Announcement created successfully' }) {
        cy.intercept('POST', '**/api/announcements**', {
            statusCode: 201,
            body: response
        }).as('createAnnouncement');
    }

    mockUpdateAnnouncement(announcementId, response = { message: 'Announcement updated successfully' }) {
        cy.intercept('PUT', `**/api/announcements/${announcementId}**`, {
            statusCode: 200,
            body: response
        }).as('updateAnnouncement');
    }

    mockDeleteAnnouncement(announcementId) {
        cy.intercept('DELETE', `**/api/announcements/${announcementId}**`, {
            statusCode: 200,
            body: { message: 'Announcement deleted successfully' }
        }).as('deleteAnnouncement');
    }

    mockError(method, url, statusCode = 500) {
        cy.intercept(method, url, {
            statusCode: statusCode,
            body: { message: 'Error occurred' }
        }).as(`${method.toLowerCase()}Error`);
    }
}

export default new AnnouncementApiHelpers();