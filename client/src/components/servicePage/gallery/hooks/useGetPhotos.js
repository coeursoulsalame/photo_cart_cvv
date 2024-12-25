import { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { WsEventContext } from '../../../../context/ws-Context'; 

const useGetPhotos = () => { 
    const limit = 60;   
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);  
    const { setPhotos, isFiltered, uncorrectpred, setLoading } = useContext(WsEventContext);
    const { enqueueSnackbar } = useSnackbar();

    const isFirstRender = useRef(true);

    const loadPhotos = async () => {
        if (!hasMore || isFiltered) return; 
        setLoading(true); 

        try {
            const response = await axios.get('/api/photos/get', {
                params: { limit, page, uncorrectpred },
            });
            console.log('limit ', limit, 'page ', page, 'uncorrectpred ', uncorrectpred, 'hasMore', hasMore, 'isFiltered', isFiltered);
            
            if (response.data.photos.length > 0) {
                setPhotos((prevPhotos) => [...prevPhotos, ...response.data.photos]);
                setPage((prevPage) => prevPage + 1);
                enqueueSnackbar('Фотографии загружены', { variant: 'success' });
            } else {
                setHasMore(false);
                enqueueSnackbar('Фотографии отсутствуют', { variant: 'warning' });
            }
        } catch (error) {
            enqueueSnackbar('Ошибка при загрузке фотографий', { variant: 'error' });
        } finally {
            setLoading(false); 
        }
    };

    const resetPagination = () => {
        setPhotos([]); 
        setPage(1);  
        setHasMore(true); 
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        resetPagination();
    }, [uncorrectpred]);

    return { hasMore, loadPhotos };
};

export default useGetPhotos;