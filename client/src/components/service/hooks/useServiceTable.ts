import { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';

interface ServiceRecord {
    id: number;
    number: string;
    startDate: string;
    endDate: string;
    serviceType: string;
}

interface UseServiceTableReturn {
    data: ServiceRecord[];
    loading: boolean;
    refetch: () => void;
}

const useServiceTable = (): UseServiceTableReturn => {
    const [data, setData] = useState<ServiceRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchServiceLogs = async () => {
        setLoading(true);

        try {
            const response = await axios.get<ServiceRecord[]>('/api/static/service-logs');
            console.log(response.data);
            setData(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            message.error(`Ошибка загрузки данных обслуживания: ${errorMessage}`);
            console.error('Error fetching service logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchServiceLogs();
    };

    useEffect(() => {
        fetchServiceLogs();
    }, []);

    return {
        data,
        loading,
        refetch
    };
};

export default useServiceTable;