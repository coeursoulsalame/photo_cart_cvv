const db = require('../../../config/db');
const sharp = require('sharp');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') });

class PhotoController {
    constructor(minioClient, bucketName) {
        this.db = db;
        this.minioClient = minioClient;
        this.bucketName = bucketName;
    }

    async getPhotos(req, res) {
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

            const { rows } = await this.db.query(query, params);

            const fileData = rows.map(row => ({
                fileName: row.file_name,
                value: row.value
            }));

            const photos = await Promise.all(fileData.map(async (data) => {
                try {
                    const imageBuffer = await this._getPhotoBuffer(data.fileName);
                    
                    const thumbnailBuffer = await this._createThumbnail(imageBuffer);

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
    }

    async getPhoto(req, res) {
        const fileName = req.params.filename;

        this.minioClient.getObject(this.bucketName, fileName, (err, dataStream) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching file from Minio' });
            }

            res.setHeader('Content-Type', 'image/jpeg'); 
            dataStream.pipe(res); 
        });
    }

    async getPhotoInfo(req, res) {
        const { name } = req.query;

        try {
            const trimmedFileName = name.split('.')[0]; 

            const query = `
                SELECT pred, value, confidence_score, valid_ai
                FROM su168 
                WHERE file_name LIKE $1 || '%'
            `;
            const values = [trimmedFileName];
            const result = await this.db.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Photo not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updatePhotoValue(req, res) {
        const { fileName, value } = req.body;

        const extractDateFromFileName = (fileName) => {
            const parts = fileName.split('_');
            const dateTimePart = parts[1]?.trim();
            return dateTimePart ? `${dateTimePart}.000` : null;
        };

        try {
            //АЛГОРИТМ
            // 1. Попробуем обновить строку, если она найдена
            const updateQuery = `
                UPDATE su168 
                SET value = $1, valid_ai = false 
                WHERE file_name LIKE $2 || '%'
                RETURNING *
            `;
            const values = [value, fileName];
            const result = await this.db.query(updateQuery, values);

            if (result.rowCount > 0) {
            // 2. Если строка найдена и обновлена возвращаем её
                return res.json(result.rows[0]);
            }

            // 3. Если строка не найдена извлекаем дату
            const date = extractDateFromFileName(fileName);

            if (!date) {
            // 4. Если дата не извлечена возвращаем ошибку
                return res.status(400).json({ error: 'Invalid fileName format' });
            }

            // 5. Если дата извлечена добавляем новую запись с изменённым именем файла
            const adjustedFileName = `${fileName}.000.jpg`;
            const insertQuery = `
                INSERT INTO su168 (file_name, value, date, valid_ai) 
                VALUES ($1, $2, $3, false)
                RETURNING *
            `;
            const insertValues = [adjustedFileName, value, date];
            const insertResult = await this.db.query(insertQuery, insertValues);

            // 6. Возвращаем добавленную строку
            return res.status(201).json(insertResult.rows[0]);
        } catch (error) {
            // 7. ошибку и 500
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deletePhoto(req, res) {
        const { name } = req.body; 

        try {
            await this._deleteFileFromMinio(name);

            const deleteQuery = `
                DELETE FROM su168 
                WHERE file_name = $1
                RETURNING *
            `;
            const values = [name];
            const result = await this.db.query(deleteQuery, values);

            if (result.rowCount > 0) {
                return res.json({ message: 'File and row db deleted', deletedFile: result.rows[0] });
            } else {
                return res.status(404).json({ error: 'Row not found in db' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async filterPhotos(req, res) {
        const { startDate, endDate } = req.query;

        try {
            const { rows } = await this.db.query(
                `SELECT file_name, date, value FROM su168 
                 WHERE date >= $1 AND date <= $2 
                 ORDER BY date DESC`, 
                [startDate, endDate]
            );

            const photos = await Promise.all(rows.map(async (row) => {
                const { file_name, value } = row;
                try {
                    const imageBuffer = await this._getPhotoBuffer(file_name);

                    if (!imageBuffer) return null; 

                    const thumbnailBuffer = await this._createThumbnail(imageBuffer);

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
    }

    // Вспомогательные методы
    async _getPhotoBuffer(fileName) {
        return new Promise((resolve, reject) => {
            this.minioClient.getObject(this.bucketName, fileName, (err, dataStream) => {
                if (err) {
                    if (err.code === 'NoSuchKey') {
                        console.warn(`Файл ${fileName} не найден в MinIO, пропускаем его`);
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
    }

    async _createThumbnail(imageBuffer, width = 300, height = 300) {
        if (!imageBuffer) return null;
        return sharp(imageBuffer)
            .resize(width, height, { fit: sharp.fit.inside })
            .toBuffer();
    }

    async _deleteFileFromMinio(fileName) {
        return new Promise((resolve, reject) => {
            this.minioClient.removeObject(this.bucketName, fileName, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

module.exports = PhotoController;