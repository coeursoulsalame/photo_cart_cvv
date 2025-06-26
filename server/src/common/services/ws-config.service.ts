import { Injectable, OnModuleInit } from '@nestjs/common';
import { PostgresHandler } from '../../database/handlers/postgres-handler';

export interface WsConfig {
    locationId: number;
    newPhotoListener: string;
    updatePhotoListener: string;
    deletePhotoListener: string;
}

@Injectable()
export class WsConfigService implements OnModuleInit {
    private configCache: WsConfig[] = [];
    private channelToLocationMap: Map<string, number> = new Map();

    constructor(private readonly postgresHandler: PostgresHandler) {}

    async onModuleInit() {
        await this.refreshCache();
    }

    public async getAllConfigs(): Promise<WsConfig[]> {
        await this.refreshCache();
        return this.configCache;
    }

    public getLocationIdByChannel(channel: string): number | undefined {
        return this.channelToLocationMap.get(channel);
    }

    private async refreshCache(): Promise<void> {
        try {
            const query = `
                SELECT 
                    location_id, listener_new_photo, listener_update_photo, listener_delete_photo
                FROM ws_config
            `;
            
            const result = await this.postgresHandler.queryMain(query);
            
            const newCache: WsConfig[] = [];
            const newChannelMap = new Map<string, number>();

            result.rows.forEach(row => {
                const config: WsConfig = {
                    locationId: row.location_id,
                    newPhotoListener: row.listener_new_photo,
                    updatePhotoListener: row.listener_update_photo,
                    deletePhotoListener: row.listener_delete_photo,
                };
                newCache.push(config);

                if (config.newPhotoListener) newChannelMap.set(config.newPhotoListener, config.locationId);
                if (config.updatePhotoListener) newChannelMap.set(config.updatePhotoListener, config.locationId);
                if (config.deletePhotoListener) newChannelMap.set(config.deletePhotoListener, config.locationId);
            });

            this.configCache = newCache;
            this.channelToLocationMap = newChannelMap;

        } catch (error) {
            console.error('Failed to refresh ws_config cache:', error);
        }
    }
} 