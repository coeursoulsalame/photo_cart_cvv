import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useGetPhotoInfo = (photoName) => {
    const [photoData, setPhotoData] = useState(null);
    const valueInputRef = useRef(null);

    const loadPhotoInfo = useCallback(async () => {
        if (!photoName) return;
        try {
            const response = await axios.get('/api/photos/photo-info', {
                params: { name: photoName }
            });
            console.log(response.data);

            if (response.status === 404) {
                message.error('Не удалось открыть информацию о фото');
            } else {
                setPhotoData(response.data);
            }
        } catch (error) {
            console.log(error);
            message.error('Ошибка при открытии модального окна');
        }
    }, [photoName]);

    useEffect(()=>{
        if (valueInputRef.current) {
            valueInputRef.current.focus();
        }
    })

    return { photoData, loadPhotoInfo, valueInputRef };
};

export default useGetPhotoInfo;