class PhotoService {
    constructor(photoController) {
        this.photoController = photoController;
    }

    // Методы для работы с фотографиями через контроллер
    async getPhotos(req, res) {
        return this.photoController.getPhotos(req, res);
    }

    async getPhoto(req, res) {
        return this.photoController.getPhoto(req, res);
    }

    async getPhotoInfo(req, res) {
        return this.photoController.getPhotoInfo(req, res);
    }

    async updatePhotoValue(req, res) {
        return this.photoController.updatePhotoValue(req, res);
    }

    async deletePhoto(req, res) {
        return this.photoController.deletePhoto(req, res);
    }

    async filterPhotos(req, res) {
        return this.photoController.filterPhotos(req, res);
    }
}

module.exports = PhotoService;