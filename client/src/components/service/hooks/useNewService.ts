import { useState } from 'react';
import { message } from 'antd';
import axios from 'axios';

interface ServiceFormData {
    number: string;
    start_date: string;
    end_date: string;
    option: number;
}

interface ServiceRecord {
    id: number;
    number: string;
    startDate: string;
    endDate: string;
    serviceType: string;
}

interface UseNewServiceReturn {
    loading: boolean;
    createService: (data: ServiceFormData) => Promise<ServiceRecord | null>;
}

const useNewService = (): UseNewServiceReturn => {
    const [loading, setLoading] = useState<boolean>(false);

    const createService = async (data: ServiceFormData): Promise<ServiceRecord | null> => {
        setLoading(true);

        try {
            const response = await axios.post<ServiceRecord>('/api/static/create-logs', data);
            message.success('Запись обслуживания успешно добавлена');
            return response.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            message.error(`Ошибка добавления записи: ${errorMessage}`);
            console.error('Error creating service log:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createService
    };
};

export default useNewService;