import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/gallery'
})
export class GalleryGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients: Map<string, { socket: Socket, locationId?: number }> = new Map();

    constructor(private readonly galleryService: GalleryService) {}

    handleConnection(client: Socket) {
        const locationId = client.handshake.query.locationId;
        const parsedLocationId = locationId ? parseInt(locationId as string, 10) : undefined;
        this.clients.set(client.id, { socket: client, locationId: parsedLocationId });
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
    }

    async notifyNewPhoto(fileName: string, locationId: number) {
        const photoData = await this.galleryService.handleNewPhoto(fileName, locationId);
        
        for (const client of this.clients.values()) {
            if (client.locationId === locationId) {
                client.socket.emit('new_photo', { 
                    fileName, 
                    photoData, 
                    timestamp: new Date() 
                });
            }
        }
    }

    async notifyPhotoDeleted(fileName: string, locationId: number) {
        await this.galleryService.handlePhotoDeleted(fileName);
        
        for (const client of this.clients.values()) {
            if (client.locationId === locationId) {
                client.socket.emit('photo_deleted', { 
                    fileName, 
                    timestamp: new Date() 
                });
            }
        }
    }

    async notifyPhotoUpdated(payload: string, locationId: number) {
        try {
            const data = JSON.parse(payload);
            for (const client of this.clients.values()) {
                if (client.locationId === locationId) {
                    client.socket.emit('photo_updated', {
                        operation: data.operation,
                        id: data.id,
                        newData: data.new_data,
                        oldData: data.old_data,
                        timestamp: new Date()
                    });
                }
            }
        } catch (error) {
            console.error('Error parsing photo_updated payload:', error);
        }
    }
}