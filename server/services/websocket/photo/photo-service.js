
class PhotoService {
    constructor(photoController, webSocketService) {
        this.photoController = photoController;
        this.webSocketService = webSocketService;
    }

    async handleNewPhoto(fileName) {
        try {
            const photoData = await this.photoController.getPhotoData(fileName);
            
            const imageBuffer = await this.photoController.getPhotoBuffer(fileName);
            
            const thumbnailBuffer = await this.photoController.createThumbnail(imageBuffer);

            const message = {
                type: 'NEW_PHOTO',
                photo: {
                    src: `data:image/jpeg;base64,${thumbnailBuffer.toString('base64')}`,
                    fullSrc: `/api/photos/photo/${fileName}`,
                    name: fileName,
                    value: photoData.value,
                }
            };

            this.webSocketService.broadcastMessage(message);
            
            console.log('Новое фото отправлено:', fileName);
        } catch (error) {
            console.error('Ошибка при отправке нового фото:', error);
        }
    }

    handlePhotoDeleted(fileName) {
        const message = {
            type: 'PHOTO_DELETED',
            photoName: fileName,
        };
        
        this.webSocketService.broadcastMessage(message);
    }
}

module.exports = PhotoService;