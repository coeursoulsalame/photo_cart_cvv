import { useEffect, useRef, useContext } from 'react';
import { WsEventContext } from '../../../../../context/ws-Context';

const usePhotoScroll = (loadPhotos, hasMore ) => {
    const loaderRef = useRef(null);
    const { loading } = useContext(WsEventContext);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading && hasMore) {
                loadPhotos();
            }
        }, { root: null, rootMargin: '20px', threshold: 1.0 });

        const currentLoaderRef = loaderRef.current;
        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }

        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, [hasMore, loading, loadPhotos]);

    return loaderRef;
};

export default usePhotoScroll;