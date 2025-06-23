import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PostgresHandler } from '../database/handlers/postgres-handler';
import { GalleryGateway } from './gallery.gateway';
import { PoolClient } from 'pg';

@Injectable()
export class GalleryNotificationsService implements OnModuleInit, OnModuleDestroy {
    private pgClient: PoolClient;

    constructor(
        private postgresHandler: PostgresHandler,
        private galleryGateway: GalleryGateway,
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

            await this.pgClient.query('LISTEN new_photo');
            await this.pgClient.query('LISTEN photo_deleted');
            await this.pgClient.query('LISTEN photo_updated');

            this.pgClient.on('notification', (notification) => {
                this.handleNotification(notification);
            });

        } catch (error) {
            console.log(error);
        }
    }

    private async handleNotification(notification: any) {
        const { channel, payload } = notification;

        switch (channel) {
            case 'new_photo':
                await this.galleryGateway.notifyNewPhoto(payload);
                break;
            case 'photo_deleted':
                await this.galleryGateway.notifyPhotoDeleted(payload);
                break;
            case 'photo_updated':
                await this.galleryGateway.notifyPhotoUpdated(payload);
                break;
        }
    }
}