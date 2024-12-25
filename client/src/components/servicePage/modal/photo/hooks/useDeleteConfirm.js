import axios from 'axios';
import { useCallback, useContext } from 'react';
import { WsEventContext } from '../../../../../context/ws-Context';
import { useSnackbar } from 'notistack';

export const useDeleteConfirm = (name, closeConfirmModal) => {
    const { removePhoto } = useContext(WsEventContext);
    const { enqueueSnackbar } = useSnackbar();

    const onConfirm = useCallback(async () => {
        try {
            await axios.post('/api/photos/delete-photo', { name });
            removePhoto(name);
            closeConfirmModal();
            enqueueSnackbar('Фотография удалена', { variant: 'success' });
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Ошибка при удалении фотографии', { variant: 'success' });
        }
    }, [name, removePhoto, closeConfirmModal, enqueueSnackbar]);

    return { onConfirm };
};