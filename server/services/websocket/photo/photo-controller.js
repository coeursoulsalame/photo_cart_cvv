class PhotoController {
    constructor(db, minioClient, bucketName) {
        this.db = db;
        this.minioClient = minioClient;
        this.bucketName = bucketName;
    }

    async getPhotoData(fileName) {
        const photoDataQuery = await this.db.query(
            'SELECT value FROM su168 WHERE file_name = $1',
            [fileName]
        );
        return photoDataQuery.rows[0] || {};
    }

    async getPhotoBuffer(fileName) {
        return new Promise((resolve, reject) => {
            this.minioClient.getObject(this.bucketName, fileName, (err, dataStream) => {
                if (err) {
                    return reject(err);
                }
                const buffers = [];
                dataStream.on('data', chunk => buffers.push(chunk));
                dataStream.on('end', () => resolve(Buffer.concat(buffers)));
                dataStream.on('error', reject);
            });
        });
    }

    async createThumbnail(imageBuffer, width = 300, height = 300) {
        const sharp = require('sharp');
        return sharp(imageBuffer)
            .resize(width, height, { fit: sharp.fit.inside })
            .toBuffer();
    }
}

module.exports = PhotoController;