class ArchiveService {
    constructor(archiveController) {
        this.archiveController = archiveController;
    }

    async getPhotoFromArchive(req, res) {
        return this.archiveController.getPhotoFromArchive(req, res);
    }
}

module.exports = ArchiveService;