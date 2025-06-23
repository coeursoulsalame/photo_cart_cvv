import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/gallery'
})
export class GalleryGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly galleryService: GalleryService) {}

    async notifyNewPhoto(fileName: string) {
        const photoData = await this.galleryService.handleNewPhoto(fileName);
        this.server.emit('new_photo', { 
            fileName, 
            photoData, 
            timestamp: new Date() 
        });
    }

    async notifyPhotoDeleted(fileName: string) {
        await this.galleryService.handlePhotoDeleted(fileName);
        this.server.emit('photo_deleted', { 
            fileName, 
            timestamp: new Date() 
        });
    }

    async notifyPhotoUpdated(payload: string) {
        try {
            const data = JSON.parse(payload);
            this.server.emit('photo_updated', {
                operation: data.operation,
                id: data.id,
                newData: data.new_data,
                oldData: data.old_data,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error parsing photo_updated payload:', error);
        }
    }
}