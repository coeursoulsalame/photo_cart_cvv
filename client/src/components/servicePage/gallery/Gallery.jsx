import React, { useState, useCallback, useContext } from 'react';
import { Box, Container, ImageList, ImageListItem, ImageListItemBar, CircularProgress } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import useGetPhotos from './hooks/useGetPhotos';
import usePhotoScroll from './hooks/usePhotoScroll';
import PhotoModal from '../modal/photo/PhotoModal';
import { WsEventContext } from '../../../context/ws-Context';

const Gallery = () => {
    const { hasMore, loadPhotos } = useGetPhotos();
    const { photos, setPhotos, loading } = useContext(WsEventContext);
    const loaderRef = usePhotoScroll(loadPhotos, hasMore);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

    const handlePhotoClick = (index) => {
        setSelectedPhotoIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedPhotoIndex(null);
    };

    const GalleryValueUpdated = useCallback((fileName, newValue) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
                photo.name === fileName ? { ...photo, value: newValue } : photo
            )
        );
    },[setPhotos]);

    const isPredError = (value) => {
        return value === 'error' || !/^(0[1-9]|[1-5][0-9]|60)$/.test(value);
    };

    return (
        <Container maxWidth={false} disableGutters sx={{ maxWidth: '100%', pt: 1, pb: '50px', px: 2 }}>
            {loading && (
                <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                    <CircularProgress size={25} sx={{ color: 'green' }} />
                </Box>
            )}
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '100%', overflow: 'hidden', display: 'flex' }}>
                    <ImageList sx={{ width: '100%', height: 'auto', display: 'grid' }} gap={20} cols={6} rowHeight={200}>
                        {photos.map((photo, index) => (
                            <ImageListItem
                                key={photo.name}
                                sx={{ position: 'relative', cursor: 'pointer', boxShadow: '0 5px 20px rgb(0 78 149 / 7%)', borderRadius: '4px', overflow: 'hidden', border: '3px solid', transition: 'border 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#43a047',
                                        boxShadow: '0 20px 20px rgb(0 78 200 / 9%)',
                                    },
                                }}
                                onClick={() => handlePhotoClick(index)}
                            >
                                <img
                                    src={photo.src}
                                    alt={photo.name}
                                    sx={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '2px' }}
                                />
                                <ImageListItemBar
                                    title={photo.name}
                                    subtitle={'Фактическое значение: ' + photo.value}
                                    sx={{ background: 'rgba(0, 0, 0, 0.8)', '& .MuiImageListItemBar-title': { fontSize: '0.8rem', }, '& .MuiImageListItemBar-subtitle': { color: '#999999'}}}
                                />
                                {isPredError(photo.value) && (
                                    <Box sx={{ position: 'absolute', bottom: 10, right: 15, }}>
                                        <ErrorOutlinedIcon sx={{ color: photo.value === 'error' ? 'orange' : 'gray' }} />
                                    </Box>
                                )}
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </Box>
            {hasMore && !loading && (
                <Box ref={loaderRef} sx={{ height: 50, width: '100%' }} />
            )}

            <PhotoModal
                open={selectedPhotoIndex !== null}
                photo={photos[selectedPhotoIndex]}
                onClose={handleCloseModal}
                index={selectedPhotoIndex}
                photos={photos}
                setSelectedPhotoIndex={setSelectedPhotoIndex}
                GalleryValueUpdate={GalleryValueUpdated}
            />
        </Container>
    );
};

export default Gallery;
