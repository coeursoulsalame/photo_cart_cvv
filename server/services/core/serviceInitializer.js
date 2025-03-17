const { minioClient } = require('../../config/minio');
const bucketName = process.env.MINIO_BUCKET_NAME;

const PhotoController = require('./photo/photo-controller');
const PhotoService = require('./photo/photo-service');
const ArchiveController = require('./archive/archive-controller');
const ArchiveService = require('./archive/archive-service');
const StatisticsController = require('./statistics/statistics-controller');
const StatisticsService = require('./statistics/statistics-service');

function initializeServices() {
    const photoController = new PhotoController(minioClient, bucketName);
    const archiveController = new ArchiveController();
    const statisticsController = new StatisticsController();

    const photoService = new PhotoService(photoController);
    const archiveService = new ArchiveService(archiveController);
    const statisticsService = new StatisticsService(statisticsController);

    return {
        photoService,
        archiveService,
        statisticsService
    };
}

module.exports = initializeServices;