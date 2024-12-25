const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { minioClient } = require('../../minio/minio');
const db = require('../../db'); 
const sharp = require('sharp'); 

const bucketName = process.env.MINIO_BUCKET_NAME;

router.get('/filter', async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const { rows } = await db.query(
            `SELECT file_name, date, value FROM su168 
             WHERE date >= $1 AND date <= $2 
             ORDER BY date DESC`, 
            [startDate, endDate]
        );

        const photos = await Promise.all(rows.map(async (row) => {
            const { file_name, value } = row;
            try {
                const imageBuffer = await new Promise((resolve, reject) => {
                    minioClient.getObject(bucketName, file_name, (err, dataStream) => {
                        if (err) {
                            if (err.code === 'NoSuchKey') {
                                console.warn(`Файл ${file_name} не найден в MinIO, пропускаем его`);
                                return resolve(null); 
                            }
                            return reject(err);
                        }
                        const buffers = [];
                        dataStream.on('data', chunk => buffers.push(chunk));
                        dataStream.on('end', () => resolve(Buffer.concat(buffers)));
                        dataStream.on('error', reject);
                    });
                });

                if (!imageBuffer) return null; 

                const thumbnailBuffer = await sharp(imageBuffer)
                    .resize(300, 300, { fit: sharp.fit.inside })
                    .toBuffer();

                return {
                    fullSrc: `/api/photos/photo/${file_name}`,
                    src: `data:image/jpeg;base64,${thumbnailBuffer.toString('base64')}`,
                    name: file_name,
                    value: value
                };
            } catch (error) {
                console.error(error);
                return null; 
            }
        }));

        res.json({
            photos: photos.filter(photo => photo !== null),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
