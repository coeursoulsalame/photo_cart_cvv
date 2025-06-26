import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { LocationMappingService } from '../../common/services/location-mapping.service';

@Injectable()
export class MinioHandler {
    private readonly clientCache: Map<number, Minio.Client> = new Map();
    private readonly defaultClient: Minio.Client;

    constructor(
        private configService: ConfigService,
        private locationMappingService: LocationMappingService
    ) {
        this.defaultClient = new Minio.Client({
            endPoint: this.configService.get('minio.endPoint') || 'localhost',
            port: parseInt(this.configService.get('minio.port') || '9000'),
            useSSL: false,
            accessKey: this.configService.get('minio.accessKey'),
            secretKey: this.configService.get('minio.secretKey'),
        });
    }

    async getClient(locationId?: number): Promise<Minio.Client> {
        if (!locationId) {
            return this.defaultClient;
        }

        if (this.clientCache.has(locationId)) {
            return this.clientCache.get(locationId)!;
        }

        const config = await this.locationMappingService.getLocationConfig(locationId);
        if (!config) {
            return this.defaultClient;
        }

        const newClient = new Minio.Client({
            endPoint: config.minioEndpoint,
            port: config.minioPort,
            useSSL: false,
            accessKey: config.minioAccessKey,
            secretKey: config.minioSecretKey,
        });

        this.clientCache.set(locationId, newClient);
        return newClient;
    }

    async getBucketName(locationId?: number): Promise<string> {
        if (!locationId) {
            return this.configService.get('minio.bucketName') || 'photos';
        }

        const config = await this.locationMappingService.getLocationConfig(locationId);
        return config?.minioBucketName || this.configService.get('minio.bucketName') || 'photos';
    }
}