import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { PhotoResponse } from './useGallery';
import { User } from '../../common/types/types';

interface PhotoUpdateData {
    operation: 'UPDATE';
    id: number;
    newData: {
        id: number;
        date: string;
        file_name: string;
        detection: string;
        value: string;
        pred: string;
        confidence_score: string;
        valid_ai: boolean;
    };
    oldData: any;
    timestamp: Date;
}

interface WebSocketEvents {
    onNewPhoto: (photoData: PhotoResponse) => void;
    onPhotoDeleted: (fileName: string) => void;
    onPhotoUpdated: (updateData: PhotoUpdateData) => void;
    user: User | null;
}

const useGalleryWebSocket = ({ onNewPhoto, onPhotoDeleted, onPhotoUpdated, user }: WebSocketEvents) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user?.locationId) {
            return;
        }

        socketRef.current = io('/gallery', {
            query: { locationId: user.locationId },
            forceNew: true,
            reconnection: true,
            timeout: 5000,
            transports: ['websocket', 'polling'],
            path: '/socket.io/'
        });

        const socket = socketRef.current;

        const handleNewPhoto = (data: { fileName: string; photoData: PhotoResponse | null; timestamp: string }) => {
            console.log('New photo notification:', data);
            
            if (data.photoData) {
                onNewPhoto(data.photoData);
            }
        };

        const handlePhotoDeleted = (data: { fileName: string; timestamp: string }) => {
            console.log('Photo deleted notification:', data);
            onPhotoDeleted(data.fileName);
        };

        const handlePhotoUpdated = (data: PhotoUpdateData) => {
            console.log('Photo updated notification:', data);
            onPhotoUpdated(data);
        };

        socket.on('new_photo', handleNewPhoto);
        socket.on('photo_deleted', handlePhotoDeleted);
        socket.on('photo_updated', handlePhotoUpdated);

        socket.on('connect', () => {
            console.log('Connected to gallery WebSocket');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from gallery WebSocket');
            setIsConnected(false);
        });

        return () => {
            socket.off('new_photo', handleNewPhoto);
            socket.off('photo_deleted', handlePhotoDeleted);
            socket.off('photo_updated', handlePhotoUpdated);
            socket.off('connect');
            socket.off('disconnect');
            socket.disconnect();
            setIsConnected(false);
        };
    }, [onNewPhoto, onPhotoDeleted, onPhotoUpdated, user]);

    return {
        isConnected
    };
};

export default useGalleryWebSocket;