import axios from 'axios';
import { useCallback, useState, useEffect } from 'react';
import { message } from 'antd';

const useUpdateValue = (fileName, value) => {
    const [editedValue, setEditedValue] = useState('');

    useEffect(() => {
        if (value !== undefined && value !== null) {
            setEditedValue(value);
        }
    }, [value]);

    const updateValue = useCallback(async () => {
        try {
            const response = await axios.post('/api/photos/update-value', {
                fileName,
                value: editedValue,
            });
            message.success('Значение обновлено');
            return response.data;
        } catch (error) {
            message.error('Ошибка при обновлении');
            console.error('Ошибка при обновлении значения:', error);
            throw error;
        }
    }, [fileName, editedValue]);

    return { editedValue, setEditedValue, updateValue };
};

export default useUpdateValue;
