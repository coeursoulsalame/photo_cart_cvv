import { Injectable, OnModuleInit } from '@nestjs/common';
import { PostgresHandler } from '../../database/handlers/postgres-handler';

export interface LocationConfig {
    locationId: number;
    minioEndpoint: string;
    minioPort: number;
    minioAccessKey: string;
    minioSecretKey: string;
    minioBucketName: string;
    databaseTable: string;
}

@Injectable()
export class LocationMappingService implements OnModuleInit {
    private configCache: Map<number, LocationConfig> = new Map();

    constructor(private readonly postgresHandler: PostgresHandler) {}

    async onModuleInit() {
        await this.refreshCache();
    }

    async getLocationConfig(locationId: number): Promise<LocationConfig | null> {
        await this.refreshCache(); 
        return this.configCache.get(locationId) || null;
    }

    async getAllLocationConfigs(): Promise<LocationConfig[]> {
        await this.refreshCache();
        return Array.from(this.configCache.values());
    }

    private async refreshCache(): Promise<void> {
        try {
            const query = `
                SELECT 
                    location_id, minio_endpoint, minio_port,
                    minio_access_key, minio_secret_key, minio_bucket_name, database_table
                FROM location_config 
                WHERE is_active = true
                ORDER BY location_id
            `;
            
            const result = await this.postgresHandler.queryMain(query);
            
            const newCache = new Map<number, LocationConfig>();
            result.rows.forEach(row => {
                newCache.set(row.location_id, {
                    locationId: row.location_id,
                    minioEndpoint: row.minio_endpoint,
                    minioPort: row.minio_port,
                    minioAccessKey: row.minio_access_key,
                    minioSecretKey: row.minio_secret_key,
                    minioBucketName: row.minio_bucket_name,
                    databaseTable: row.database_table,
                });
            });

            this.configCache = newCache;
        } catch (error) {
            console.error('Failed to refresh location config cache:', error);
        }
    }
} 