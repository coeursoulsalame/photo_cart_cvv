const { setupDbNotifications, setNotifyNewPhotoCallback, setNotifyPhotoDeletedCallback } = require('./db-notifications');
const { minioClient } = require('../minio/minio');
const sharp = require('sharp');

const bucketName = process.env.MINIO_BUCKET_NAME;

const notifyClientsAboutNewPhotos = (wss) => {

    setNotifyNewPhotoCallback(async (fileName) => {
        try {
            const imageBuffer = await new Promise((resolve, reject) => {
                minioClient.getObject(bucketName, fileName, (err, dataStream) => {
                    if (err) {
                        return reject(err);
                    }
                    const buffers = [];
                    dataStream.on('data', chunk => buffers.push(chunk));
                    dataStream.on('end', () => resolve(Buffer.concat(buffers)));
                    dataStream.on('error', reject);
                });
            });

            const thumbnailBuffer = await sharp(imageBuffer)
                .resize(300, 300, { fit: sharp.fit.inside })
                .toBuffer();

            const message = {
                type: 'NEW_PHOTO',
                photo: {
                    src: `data:image/jpeg;base64,${thumbnailBuffer.toString('base64')}`,
                    fullSrc: `/api/photos/photo/${fileName}`,
                    name: fileName,
                }
            };

            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });

            console.log('Новое фото отправлено:', fileName);
        } catch (error) {
            console.error('Ошибка при отправке нового фото:', error);
        }
    });

    setNotifyPhotoDeletedCallback((fileName) => {
        const message = {
            type: 'PHOTO_DELETED',
            photoName: fileName,
        };

        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });

    setupDbNotifications();
};

module.exports = notifyClientsAboutNewPhotos;