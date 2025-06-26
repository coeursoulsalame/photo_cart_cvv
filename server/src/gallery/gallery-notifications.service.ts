import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PostgresHandler } from '../database/handlers/postgres-handler';
import { GalleryGateway } from './gallery.gateway';
import { PoolClient } from 'pg';
import { WsConfigService } from '../common/services/ws-config.service';

@Injectable()
export class GalleryNotificationsService implements OnModuleInit, OnModuleDestroy {
    private pgClient: PoolClient;

    constructor(
        private postgresHandler: PostgresHandler,
        private galleryGateway: GalleryGateway,
        private wsConfigService: WsConfigService,
    ) {}

    async onModuleInit() {
        await this.initializeListeners();
    }

    async onModuleDestroy() {
        if (this.pgClient) {
            this.pgClient.release();
        }
    }

    private async initializeListeners() {
        try {
            this.pgClient = await this.postgresHandler.getClient();
            const wsConfigs = await this.wsConfigService.getAllConfigs();

            for (const config of wsConfigs) {
                if (config.newPhotoListener) await this.pgClient.query(`LISTEN ${config.newPhotoListener}`);
                if (config.deletePhotoListener) await this.pgClient.query(`LISTEN ${config.deletePhotoListener}`);
                if (config.updatePhotoListener) await this.pgClient.query(`LISTEN ${config.updatePhotoListener}`);
            }

            this.pgClient.on('notification', (notification) => {
                this.handleNotification(notification);
            });

        } catch (error) {
            console.error('Error initializing WS listeners:', error);
        }
    }

    private async handleNotification(notification: any) {
        const { channel, payload } = notification;
        const locationId = this.wsConfigService.getLocationIdByChannel(channel);

        if (locationId === undefined) {
            return; 
        }

        const config = await this.wsConfigService.getAllConfigs().then(all => all.find(c => c.locationId === locationId));
        if (!config) return;

        if (channel === config.newPhotoListener) {
            await this.galleryGateway.notifyNewPhoto(payload, locationId);
        } else if (channel === config.deletePhotoListener) {
            await this.galleryGateway.notifyPhotoDeleted(payload, locationId);
        } else if (channel === config.updatePhotoListener) {
            await this.galleryGateway.notifyPhotoUpdated(payload, locationId);
        }
    }
}