const db = require('../../config/db');
const { minioClient } = require('../../config/minio');
const bucketName = process.env.MINIO_BUCKET_NAME;

const DatabaseCheck = require('./notification/database-check');
const PhotoController = require('./photo/photo-controller');
const PhotoService = require('./photo/photo-service');
const WSservice = require('./server/ws-serivce');
const WSController = require('./server/ws-controller');
const WSserver = require('./server/ws-server');

function initializeServices() {
    const databaseCheck = new DatabaseCheck(db);
    const photoController = new PhotoController(db, minioClient, bucketName);
    const wsService = new WSservice();
    const photoService = new PhotoService(photoController, wsService);
    const wsController = new WSController();
    const wsServer = new WSserver(wsController);

    return {
        databaseCheck,
        photoController,
        wsService,
        photoService,
        wsController,
        wsServer
    };
}

function setupWebSocketWithServices(server) {
    const services = initializeServices();
    
    const wss = services.wsServer.initialize(server);
    services.wsService.setWebSocketServer(wss);

    services.databaseCheck.subscribe('new_photo', (fileName) => {
        services.photoService.handleNewPhoto(fileName);
    });

    services.databaseCheck.subscribe('photo_deleted', (fileName) => {
        services.photoService.handlePhotoDeleted(fileName);
    });

    services.databaseCheck.setupNotifications();

    return wss;
}

module.exports = {
    initializeServices,
    setupWebSocketWithServices
};