import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import { MinioHandler } from '../storage/handlers/minio-handler';
import { PostgresHandler } from '../database/handlers/postgres-handler';
import { RedisService } from '../cache/redis.service';
import { PhotoResponse, GetPhotosResponse } from './gallery.dto';

@Injectable()
export class GalleryService {
    constructor(
        private configService: ConfigService,
        private minioHandler: MinioHandler,
        private postgresHandler: PostgresHandler,
        private redisService: RedisService,
    ) {}

    async getPhotos(query: { page: number; limit: number; startDate?: string; endDate?: string, showUnrecognizedOnly?: boolean }): Promise<GetPhotosResponse> {
        const page = parseInt(String(query.page));
        const limit = parseInt(String(query.limit));
        const offset = (page - 1) * limit;

        try {
            let whereConditions: string[] = [];
            let filterParams: any[] = [];
            let paramIndex = 1;
            
            if (query.startDate) {
                whereConditions.push(`date >= $${paramIndex}`);
                filterParams.push(query.startDate);
                paramIndex++;
            }
            
            if (query.endDate) {
                whereConditions.push(`date <= $${paramIndex}`);
                filterParams.push(query.endDate);
                paramIndex++;
            }

            console.log('showUnrecognizedOnly', query.showUnrecognizedOnly);
            if (query.showUnrecognizedOnly === true) {
            console.log('выполняем')
            whereConditions.push(`(
                    value IS NULL 
                    OR value = '' 
                    OR value = '0'
                    OR NOT (value ~ '^(0[1-9]|[1-5][0-9]|60)$')
                )`);
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

            const countQuery = `SELECT COUNT(*) FROM su168 ${whereClause}`;
            const countResult = await this.postgresHandler.queryMain(countQuery, filterParams);
            const totalCount = parseInt(countResult.rows[0].count);
            const totalPages = Math.ceil(totalCount / limit);

            const dataParams = [...filterParams, limit, offset];
            const limitOffsetIndex = filterParams.length + 1;
            
            const dataQuery = `
                SELECT id, date, file_name, detection, value, pred, confidence_score, valid_ai
                FROM su168 
                ${whereClause}
                ORDER BY date DESC 
                LIMIT $${limitOffsetIndex} OFFSET $${limitOffsetIndex + 1}
            `;
            
            const result = await this.postgresHandler.queryMain(dataQuery, dataParams);
            
            const photos: PhotoResponse[] = result.rows.map(data => ({
                id: data.id,
                fileName: data.file_name,
                fullSrc: `/api/gallery/photo?filename=${data.file_name}`,
                thumbnail: `/api/gallery/thumbnail?filename=${data.file_name}`, 
                date: data.date,
                detection: data.detection,
                value: data.value,
                pred: data.pred,
                confidenceScore: data.confidence_score,
                validAi: data.valid_ai,
            }));

            return {
                photos,
                currentPage: page,
                totalPages,
                totalCount,
                hasNextPage: page < totalPages,
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch photos',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getThumbnail(fileName: string): Promise<Buffer> {
        const cacheKey = `thumbnail:${fileName}`;
        
        try {
            const cachedThumbnail = await this.redisService.get(cacheKey);
            if (cachedThumbnail) {
                return Buffer.from(cachedThumbnail, 'base64');
            }

            const imageBuffer = await this.getPhotoBuffer(fileName);
            if (!imageBuffer) {
                throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
            }

            const thumbnailBuffer = await this.createThumbnail(imageBuffer);
            
            await this.redisService.setex(cacheKey, 604800, thumbnailBuffer.toString('base64'));
            
            return thumbnailBuffer;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to generate thumbnail',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async getPhotoBuffer(fileName: string): Promise<Buffer | null> {
        try {
            const minioClient = this.minioHandler.getClient();
            const bucketName = this.configService.get('minio.bucketName');
            
            return new Promise<Buffer | null>((resolve) => {
                (minioClient as any).getObject(bucketName, fileName, (err: any, dataStream: any) => {
                    if (err) {
                        if (err.code === 'NoSuchKey') {
                            return resolve(null);
                        }
                        return resolve(null);
                    }

                    const buffers: Buffer[] = [];
                    dataStream.on('data', (chunk: Buffer) => buffers.push(chunk));
                    dataStream.on('end', () => {
                        const buffer = Buffer.concat(buffers);
                        resolve(buffer);
                    });
                    dataStream.on('error', () => {
                        resolve(null);
                    });
                });
            });
        } catch (error) {
            return null;
        }
    }

    private async createThumbnail(imageBuffer: Buffer, width = 300, height = 300): Promise<Buffer> {
        try {
            return sharp(imageBuffer)
                .resize(width, height, { 
                    fit: sharp.fit.inside,
                    withoutEnlargement: true 
                })
                .jpeg({ quality: 80 })
                .toBuffer();
        } catch (error) {
            throw new HttpException(
                'Failed to create thumbnail',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getPhoto(fileName: string): Promise<NodeJS.ReadableStream> {
        try {
            const minioClient = this.minioHandler.getClient();
            const bucketName = this.configService.get('minio.bucketName') || 'photos';
            
            return new Promise<NodeJS.ReadableStream>((resolve, reject) => {
                (minioClient as any).getObject(bucketName, fileName, (err: any, dataStream: any) => {
                    if (err) {
                        if (err.code === 'NoSuchKey') {
                            reject(new HttpException(
                                'Photo not found',
                                HttpStatus.NOT_FOUND,
                            ));
                        } else {
                            reject(new HttpException(
                                'Failed to fetch photo',
                                HttpStatus.INTERNAL_SERVER_ERROR,
                            ));
                        }
                        return;
                    }

                    resolve(dataStream);
                });
            });
        } catch (error) {
            throw new HttpException(
                'Failed to fetch photo',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async handleNewPhoto(fileName: string): Promise<PhotoResponse | null> {
        try {
            const dataQuery = `
                SELECT id, date, file_name, detection, value, pred, confidence_score, valid_ai
                FROM su168 
                WHERE file_name = $1
            `;
            
            const result = await this.postgresHandler.queryMain(dataQuery, [fileName]);
            
            if (result.rows.length === 0) {
                return null;
            }
    
            const data = result.rows[0];
    
            const photoResponse: PhotoResponse = {
                id: data.id,
                fileName: data.file_name,
                fullSrc: `/api/gallery/photo?filename=${data.file_name}`,
                thumbnail: `/api/gallery/thumbnail?filename=${data.file_name}`,
                date: data.date,
                detection: data.detection,
                value: data.value,
                pred: data.pred,
                confidenceScore: data.confidence_score,
                validAi: data.valid_ai,
            };
    
            try {
                await this.getThumbnail(fileName);
            } catch (error) {
            }
    
            return photoResponse;
        } catch (error) {
            return null;
        }
    }

    async handlePhotoDeleted(fileName: string): Promise<{ fileName: string }> {
        try {
            const cacheKey = `thumbnail:${fileName}`;
            await this.redisService.del(cacheKey);
    
            return { fileName };
        } catch (error) {
            return { fileName };
        }
    }

    async updateValue(id: number, value: string): Promise<{ success: boolean; message: string }> {
        try {
            const updateQuery = `
                UPDATE su168 
                SET value = $1, valid_ai = false 
                WHERE id = $2
            `;
            
            const result = await this.postgresHandler.queryMain(updateQuery, [value, id]);
            
            if (result.rowCount === 0) {
                throw new HttpException(
                    'Photo not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            return {
                success: true,
                message: `Значение успешно обновлено для фото с ID ${id}`
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to update value',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deletePhoto(id: number, fileName: string): Promise<{ success: boolean; message: string }> {
        try {
            const deleteQuery = `
                DELETE FROM su168 
                WHERE id = $1 AND file_name = $2
            `;
            
            const result = await this.postgresHandler.queryMain(deleteQuery, [id, fileName]);
            
            if (result.rowCount === 0) {
                throw new HttpException(
                    'Photo not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            try {
                const minioClient = this.minioHandler.getClient();
                const bucketName = this.configService.get('minio.bucketName');
                await (minioClient as any).removeObject(bucketName, fileName);
            } catch (minioError) {
                console.error('Ошибка при удалении файла из Minio:', minioError);
            }

            try {
                const cacheKey = `thumbnail:${fileName}`;
                await this.redisService.del(cacheKey);
            } catch (cacheError) {
                console.error('Ошибка при удалении кеша:', cacheError);
            }

            return {
                success: true,
                message: `Фото с ID ${id} успешно удалено`
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to delete photo',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
