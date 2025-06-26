import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

interface Sensor {
    id: string;
    x: number;
    y: number;
    value: number;
    timestamp: number;
}

interface GridInfo {
    method: string;
    power: number;
    stepSize: number;
    totalPoints: number;
    dimensions: string;
    timestamp: string;
}

export interface HeatmapApiResponse {
    sensors: Sensor[];
    heatmapData: [number, number, number][];
    xLabels: string[];
    yLabels: string[];
    gridInfo: GridInfo;
}

// Функция для глубокого сравнения данных
const deepEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    
    if (typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        
        if (Array.isArray(a)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!deepEqual(a[i], b[i])) return false;
            }
            return true;
        }
        
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        
        for (const key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
        }
        return true;
    }
    
    return false;
};

export const useHeatmapWebSocket = () => {
    const [data, setData] = useState<HeatmapApiResponse | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const previousDataRef = useRef<HeatmapApiResponse | null>(null);

    // Мемоизированная функция обработки данных
    const handleHeatmapData = useCallback((newData: HeatmapApiResponse) => {
        // Сравниваем с предыдущими данными
        if (!deepEqual(previousDataRef.current, newData)) {
            previousDataRef.current = newData;
            setData(newData);
            setError(null);
        }
    }, []);

    useEffect(() => {
        const socket = io('/heatmap', {
            transports: ['websocket'],
            forceNew: false, // Переиспользуем соединение
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            setError(null);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('connect_error', (err) => {
            setError(`Ошибка подключения: ${err.message}`);
            setIsConnected(false);
        });

        socket.on('heatmap_data', handleHeatmapData);

        return () => {
            socket.off('heatmap_data', handleHeatmapData);
            socket.disconnect();
        };
    }, [handleHeatmapData]);

    // Мемоизируем возвращаемый объект
    const result = useMemo(() => ({
        data,
        isConnected,
        error
    }), [data, isConnected, error]);

    console.log(result);
    console.log(data);
    return result;
}; 