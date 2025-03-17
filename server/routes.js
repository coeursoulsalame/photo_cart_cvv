const initializeServices = require('./services/core/serviceInitializer');
const { photoService, archiveService, statisticsService } = initializeServices();

module.exports = function configureRoutes(app) {
    app.get('/api/photos/get', photoService.getPhotos.bind(photoService));
    app.get('/api/photos/photo/:filename', photoService.getPhoto.bind(photoService));
    app.get('/api/photos/photo-info', photoService.getPhotoInfo.bind(photoService));
    app.post('/api/photos/update-value', photoService.updatePhotoValue.bind(photoService));
    app.post('/api/photos/delete-photo', photoService.deletePhoto.bind(photoService));
    app.get('/api/photos/filter', photoService.filterPhotos.bind(photoService));

    app.get('/api/photos/screenshot', archiveService.getPhotoFromArchive.bind(archiveService));

    app.get('/api/database/get-table', statisticsService.getTableData.bind(statisticsService));
    app.post('/api/service/insert', statisticsService.insertServiceRecord.bind(statisticsService));
};