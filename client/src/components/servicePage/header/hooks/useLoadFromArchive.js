import axios from 'axios';

export function useLoadFromArchive() {

    const fetchPhotoByDate = async (timestamp) => {
        console.log(`Отправляем запрос с датой: ${timestamp}`);
        try {
            const response = await axios.get('/api/photos/screenshot', {
                params: { timestamp },
            });
            const { imageUrl } = response.data;
            return imageUrl;
        } catch (err) {
            console.error(err);

            throw err;
        }
    };

    return { fetchPhotoByDate };
}