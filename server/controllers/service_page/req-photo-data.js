const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { minioClient } = require('../../minio/minio');
const db = require('../../db'); 
const sharp = require('sharp'); 

const bucketName = process.env.MINIO_BUCKET_NAME;

router.get('/get', async (req, res) => {
    const limit = parseInt(req.query.limit); 
    const page = parseInt(req.query.page); 
    const uncorrectpred = req.query.uncorrectpred === 'true';

    try {
        let query;
        let params = [limit, (page - 1) * limit];

        if (uncorrectpred) {
            // Если uncorrectpred = true, выбираем только те фото, у которых pred НЕ в диапазоне '01'...'60'
            query = `
                SELECT file_name, value FROM su168 
                WHERE value !~ '^(0[1-9]|[1-5][0-9]|60)$'
                ORDER BY file_name DESC
                LIMIT $1 OFFSET $2;          
            `;
        } else {
            query = `
                SELECT file_name, value FROM su168 
                ORDER BY file_name DESC 
                LIMIT $1 OFFSET $2
            `;
        }

        const { rows } = await db.query(query, params);
        // Извлекаем имена файлов и значения предсказания
        const fileData = rows.map(row => ({
            fileName: row.file_name,
            value: row.value
        }));

        const photos = await Promise.all(fileData.map(async (data) => {
            try {
                const imageBuffer = await new Promise((resolve, reject) => {
                    minioClient.getObject(bucketName, data.fileName, (err, dataStream) => {
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

                return {
                    fullSrc: `/api/photos/photo/${data.fileName}`,
                    src: `data:image/jpeg;base64,${thumbnailBuffer.toString('base64')}`,
                    name: data.fileName,
                    value: data.value
                };
            } catch (error) {
                console.warn(error);
                return null;
            }
        }));

        res.json({
            photos: photos.filter(photo => photo !== null),
            currentPage: page,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/photo/:filename', (req, res) => {
    const fileName = req.params.filename;

    minioClient.getObject(bucketName, fileName, (err, dataStream) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching file from Minio' });
        }

        res.setHeader('Content-Type', 'image/jpeg'); 
        dataStream.pipe(res); 
    });
});

module.exports = router;