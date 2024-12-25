// hooks/useUpdateValue.js

import axios from 'axios';
import { useCallback, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

const useUpdateValue = (fileName, value) => {
    const { enqueueSnackbar } = useSnackbar();
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
            enqueueSnackbar('Значение обновлено', { variant: 'success' });
            return response.data;
        } catch (error) {
            enqueueSnackbar('Ошибка при обновлении', { variant: 'error' });
            console.error('Ошибка при обновлении значения:', error);
            throw error;
        }
    }, [enqueueSnackbar, fileName, editedValue]);

    return { editedValue, setEditedValue, updateValue };
};

export default useUpdateValue;
