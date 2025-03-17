import { useCallback, useContext } from 'react';
import axios from 'axios';
import { WsEventContext } from '../../../../../context/ws-Context'; 
import { message } from 'antd';

export const useLoadFilterByDate = () => {
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
            message.success(`Фотографии загружены с ${startDate} по ${endDate}`);
        } catch (err) {
            message.error('Ошибка при фильтрации фотографий');
        }   finally {
            setLoading(false);
        }
    }, [setPhotos, setIsFiltered]);

    return { filterPhotosByDate };
};
