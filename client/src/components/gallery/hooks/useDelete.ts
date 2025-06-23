import { useCallback } from 'react';
import axios from 'axios';

interface DeletePhotoParams {
    id: number;
    fileName: string;
}

const useDelete = () => {
    const deletePhoto = useCallback(async (params: DeletePhotoParams) => {
        try {
            const response = await axios.delete('/api/gallery/delete-photo', {
                data: params
            });
            console.log('Фото успешно удалено:', response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении фото:', error);
            throw error;
        }
    }, []);

    return { deletePhoto };
};

export default useDelete;