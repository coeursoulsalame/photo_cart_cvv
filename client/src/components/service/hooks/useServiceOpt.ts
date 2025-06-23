import { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';

interface ServiceOption {
    value: number;
    label: string;
}

interface UseServiceOptReturn {
    options: ServiceOption[];
    loading: boolean;
    refetch: () => void;
}

const useServiceOpt = (): UseServiceOptReturn => {
    const [options, setOptions] = useState<ServiceOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchServiceOptions = async () => {
        setLoading(true);

        try {
            const response = await axios.get<ServiceOption[]>('/api/static/service-options');
            setOptions(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            message.error(`Ошибка загрузки опций обслуживания: ${errorMessage}`);
            console.error('Error fetching service options:', err);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchServiceOptions();
    };

    useEffect(() => {
        fetchServiceOptions();
    }, []);

    return {
        options,
        loading,
        refetch
    };
};

export default useServiceOpt;