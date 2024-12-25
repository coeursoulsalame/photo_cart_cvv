import { useCallback, useContext } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { WsEventContext } from '../../../../context/ws-Context'; 

export const useLoadFilterByDate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { setPhotos, setIsFiltered, setLoading } = useContext(WsEventContext);

    const filterPhotosByDate = useCallback(async (startDate, endDate) => {
        try {
            setLoading(true);
            console.log(`Фильтруем фотографии с ${startDate} по ${endDate}`);
            const response = await axios.get('/api/photos/filter', {
                params: { startDate, endDate }
            });
            const filteredPhotos = response.data.photos;
            setPhotos(filteredPhotos);
            setIsFiltered(true);
            enqueueSnackbar(`Фотографии загружены с ${startDate} по ${endDate}`, { variant: 'success' });
        } catch (error) {
            console.error('Ошибка при фильтрации фотографий:', error);
            enqueueSnackbar('Ошибка при фильтрации фотографий', { variant: 'error' });
        }   finally {
            // Снимаем loading в false после выполнения запроса
            setLoading(false);
        }
    }, [enqueueSnackbar, setPhotos, setIsFiltered]);

    return { filterPhotosByDate };
};
