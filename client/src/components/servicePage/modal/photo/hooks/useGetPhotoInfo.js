import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const useGetPhotoInfo = (photoName) => {
    const [photoData, setPhotoData] = useState(null);
    const valueInputRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

    const loadPhotoInfo = useCallback(async () => {
        if (!photoName) return;
        try {
            const response = await axios.get('/api/photos/photo-info', {
                params: { name: photoName }
            });
            console.log(response.data);

            if (response.status === 404) {
                enqueueSnackbar('Не удалось открыть информацию о фото', { variant: 'error' });
            } else {
                setPhotoData(response.data);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Ошибка при открытии модального окна', { variant: 'error' });
        }
    }, [photoName, enqueueSnackbar]);

    useEffect(()=>{
        if (valueInputRef.current) {
            valueInputRef.current.focus();
        }
    })

    return { photoData, loadPhotoInfo, valueInputRef };
};

export default useGetPhotoInfo;