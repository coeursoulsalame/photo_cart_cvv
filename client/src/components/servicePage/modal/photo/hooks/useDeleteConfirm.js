import axios from 'axios';
import { useCallback, useContext } from 'react';
import { WsEventContext } from '../../../../../context/ws-Context';
import { message } from 'antd';
export const useDeleteConfirm = (name, closeConfirmModal) => {
    const { removePhoto } = useContext(WsEventContext);

    const onConfirm = useCallback(async () => {
        try {
            await axios.post('/api/photos/delete-photo', { name });
            removePhoto(name);
            closeConfirmModal();
            message.success('Фотография удалена');
        } catch (error) {
            console.log(error);
            message.error('Ошибка при удалении фотографии');
        }
    }, [name, removePhoto, closeConfirmModal]);

    return { onConfirm };
};