import axios from 'axios';
import { message } from 'antd';
export function useLoadFromArchive() {

    const fetchPhotoByDate = async (timestamp) => {
        try {
            message.info('Отправлен запрос на получение фото из архива');
            const response = await axios.get('/api/photos/screenshot', {
                params: { timestamp },
            });
            const { imageUrl } = response.data;
            return imageUrl;
        } catch (err) {
            message.error('Ошибка при получении фото из архива');
        }
    };

    return { fetchPhotoByDate };
}