import { useEffect, useCallback } from 'react';

const useNavKeyboard = (open, setSelectedPhotoIndex, photosLength) => {
    const onNext = useCallback(() => {
        setSelectedPhotoIndex((prevIndex) => (prevIndex + 1) % photosLength);
    }, [setSelectedPhotoIndex, photosLength]);

    const onPrev = useCallback(() => {
        setSelectedPhotoIndex((prevIndex) => (prevIndex - 1 + photosLength) % photosLength);
    }, [setSelectedPhotoIndex, photosLength]);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                onNext();
            } else if (event.key === 'ArrowLeft') {
                onPrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onNext, onPrev]);

    return { onNext, onPrev };
};

export default useNavKeyboard;
