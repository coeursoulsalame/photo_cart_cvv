import React, {createContext, useState, useEffect, useCallback } from 'react';

export const WsEventContext = createContext();

export const WsProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);  
    const [isFiltered, setIsFiltered] = useState(false);
    const [uncorrectpred, setUncorrectpred] = useState(false);

    useEffect(() => {
        connectWebSocket();
    }, []);

    const connectWebSocket = () => {
        if (socket) {
            socket.close();
        }

        const PhotoSocket = new WebSocket(`ws://${window.location.host}/ws`);

        PhotoSocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'NEW_PHOTO') {
                    setPhotos(prevPhotos => [message.photo, ...prevPhotos]);
                } else if (message.type === 'PHOTO_DELETED') {
                    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.name !== message.photoName));
                }
            } catch (error) {
                console.error(error);
            }
        };

        PhotoSocket.onopen = () => {
            console.log('WebSocket client connected');
        };

        PhotoSocket.onclose = () => {
            console.warn('WebSocket client discon...');
        };

        PhotoSocket.onerror = (error) => {
            console.error('WebSocket client error:', error);
        };

        setSocket(PhotoSocket);
    };

    const removePhoto = useCallback((name) => {
        setPhotos(prevPhotos => prevPhotos.filter(photo => photo.name !== name));
        if (socket) {
            socket.send(JSON.stringify({ type: 'PHOTO_DELETED', photoName: name }));
        }
    }, [socket]);

    return (
        <WsEventContext.Provider value={{ photos, setPhotos, removePhoto, isFiltered, setIsFiltered, uncorrectpred, setUncorrectpred, loading, setLoading }}>
            {children}
        </WsEventContext.Provider>
    );
}