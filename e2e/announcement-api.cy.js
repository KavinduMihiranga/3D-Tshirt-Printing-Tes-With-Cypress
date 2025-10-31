describe('Announcement API Tests', () => {
  const API_BASE = 'http://localhost:5000/api/announcements'

  it('should fetch all announcements', () => {
    cy.request('GET', API_BASE).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
    })
  })

  it('should create a new announcement', () => {
    const newAnnouncement = {
      title: 'API Test Announcement',
      content: 'This is created via API test'
    }

    cy.request('POST', API_BASE, newAnnouncement).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('_id')
      expect(response.body.title).to.eq(newAnnouncement.title)
      expect(response.body.content).to.eq(newAnnouncement.content)
    })
  })

  it('should update an announcement', () => {
    const updatedData = {
      title: 'Updated via API',
      content: 'Updated content via API'
    }

    // First create an announcement to update
    cy.request('POST', API_BASE, {
      title: 'Test to Update',
      content: 'Original content'
    }).then((createResponse) => {
      const announcementId = createResponse.body._id
      
      cy.request('PUT', `${API_BASE}/${announcementId}`, updatedData).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200)
        expect(updateResponse.body.title).to.eq(updatedData.title)
        expect(updateResponse.body.content).to.eq(updatedData.content)
      })
    })
  })

  it('should delete an announcement', () => {
    // First create an announcement to delete
    cy.request('POST', API_BASE, {
      title: 'Test to Delete',
      content: 'This will be deleted'
    }).then((createResponse) => {
      const announcementId = createResponse.body._id
      
      cy.request('DELETE', `${API_BASE}/${announcementId}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200)
      })
    })
  })

  it('should handle invalid announcement creation', () => {
    cy.request({
      method: 'POST',
      url: API_BASE,
      body: { title: '' }, // Missing content
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.not.eq(201)
    })
  })
})