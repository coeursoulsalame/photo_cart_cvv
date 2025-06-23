import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { GalleryGateway } from './gallery.gateway';
import { GalleryNotificationsService } from './gallery-notifications.service';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [StorageModule],
    controllers: [GalleryController],
    providers: [GalleryService, GalleryGateway, GalleryNotificationsService],
    exports: [GalleryService],
})
export class GalleryModule {} 