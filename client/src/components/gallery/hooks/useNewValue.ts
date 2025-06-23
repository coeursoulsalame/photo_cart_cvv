import { useCallback } from 'react';
import axios from 'axios';

interface UpdateValueParams {
    id: number;
    value: string;
}

const useNewValue = () => {
    const updateValue = useCallback(async (params: UpdateValueParams) => {
        try {
            const response = await axios.patch('/api/gallery/update-value', params);
            console.log('Значение успешно обновлено:', response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении значения:', error);
            throw error;
        }
    }, []);

    return { updateValue };
};

export default useNewValue;