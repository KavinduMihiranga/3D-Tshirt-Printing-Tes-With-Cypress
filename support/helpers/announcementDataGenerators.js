class AnnouncementDataGenerators {
    generateAnnouncement(overrides = {}) {
        const baseAnnouncement = {
            _id: '1',
            title: 'Test Announcement',
            content: 'This is a test announcement content',
            createdAt: new Date().toISOString()
        };
        return { ...baseAnnouncement, ...overrides };
    }

    generateMultipleAnnouncements(count = 3) {
        return Array.from({ length: count }, (_, i) => 
            this.generateAnnouncement({
                _id: `${i + 1}`,
                title: `Announcement ${i + 1}`,
                content: `Content for announcement ${i + 1}`
            })
        );
    }

    getValidAnnouncementData() {
        return {
            title: 'New Announcement',
            content: 'This is the content of the new announcement'
        };
    }

    getInvalidAnnouncementData() {
        return {
            title: '',
            content: ''
        };
    }
}

export default new AnnouncementDataGenerators();