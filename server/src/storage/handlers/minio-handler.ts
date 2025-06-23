import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioHandler {
    private readonly minioClient: Minio.Client;

    constructor(private configService: ConfigService) {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get('minio.endPoint') || 'localhost',
            port: this.configService.get('minio.port'),
            useSSL: false,
            accessKey: this.configService.get('minio.accessKey'),
            secretKey: this.configService.get('minio.secretKey'),
        });
    }

    getClient(): Minio.Client {
        return this.minioClient;
    }
}