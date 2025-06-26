import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { HeatmapService } from './heatmap.service';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/heatmap'
})
export class HeatmapGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients: Set<Socket> = new Set();

    constructor(private readonly heatmapService: HeatmapService) {}

    handleConnection(client: Socket) {
        this.clients.add(client);
        
        const latestData = this.heatmapService.getLatestHeatmapDataSync();
        if (latestData.success && latestData.data) {
            client.emit('heatmap_data', latestData.data);
        }
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client);
    }

    notifyHeatmapUpdate(data: any) {
        for (const client of this.clients) {
            client.emit('heatmap_data', data);
        }
    }
} 