import { Injectable } from '@nestjs/common';
import { PostgresHandler } from '../../database/handlers/postgres-handler';
import { LocationMappingService } from './location-mapping.service';

@Injectable()
export class DatabaseRouterService {
    constructor(
        private readonly postgresHandler: PostgresHandler,
        private readonly locationMappingService: LocationMappingService,
    ) {}

    async getTableName(locationId?: number): Promise<string> {
        if (!locationId) {
            return 'su168';
        }

        const config = await this.locationMappingService.getLocationConfig(locationId);
        return config?.databaseTable || 'su168';
    }

    async queryPhotoTable(locationId: number | undefined, query: string, params?: any[]): Promise<any> {
        const tableName = await this.getTableName(locationId);
        const finalQuery = query.replace(/{{TABLE}}/g, tableName);
        return this.postgresHandler.queryMain(finalQuery, params);
    }
} 