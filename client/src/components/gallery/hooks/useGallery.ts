import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useGalleryWebSocket from './useGalleryWebSocket';
import { Dayjs } from 'dayjs';

export interface PhotoResponse {
    id: number;
    fileName: string;
    fullSrc: string;
    thumbnail: string;
    date: string;
    detection: string;
    value: string;
    pred: string;
    confidenceScore: string;
    validAi: boolean;
}

export interface GetPhotosResponse {
    photos: PhotoResponse[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
}

interface UseGalleryParams {
    page?: number;
    limit?: number;
    dateRange?: [Dayjs, Dayjs] | null;
    showUnrecognizedOnly?: boolean;
}

const useGallery = ({ page = 1, limit = 100, dateRange, showUnrecognizedOnly = false }: UseGalleryParams = {}) => {
    const [data, setData] = useState<GetPhotosResponse | null>(null);
    const [allPhotos, setAllPhotos] = useState<PhotoResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(page);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([page]));

    const handleNewPhoto = useCallback((photoData: PhotoResponse) => {
        setAllPhotos(prev => {
            const existingPhoto = prev.find(photo => photo.id === photoData.id);
            if (existingPhoto) {
                return prev;
            }
            
            return [photoData, ...prev];
        });

        setData(prev => prev ? {
            ...prev,
            totalCount: prev.totalCount + 1
        } : prev);
    }, []);

    const handlePhotoDeleted = useCallback((fileName: string) => {
        setAllPhotos(prev => {
            const filteredPhotos = prev.filter(photo => photo.fileName !== fileName);
            return filteredPhotos;
        });

        setData(prev => prev ? {
            ...prev,
            totalCount: Math.max(0, prev.totalCount - 1)
        } : prev);
    }, []);

    const handlePhotoUpdated = useCallback((updateData: any) => {
        setAllPhotos(prev => {
            return prev.map(photo => {
                if (photo.id === updateData.id) {
                    return {
                        ...photo,
                        value: updateData.newData.value,
                        pred: updateData.newData.pred,
                        confidenceScore: updateData.newData.confidence_score,
                        validAi: updateData.newData.valid_ai,
                    };
                }
                return photo;
            });
        });
    }, []);

    const { isConnected } = useGalleryWebSocket({
        onNewPhoto: handleNewPhoto,
        onPhotoDeleted: handlePhotoDeleted,
        onPhotoUpdated: handlePhotoUpdated
    });

    const fetchPhotos = useCallback(async (pageToLoad: number, isLoadMore = false) => {
        if (loading) return;
        
        if (isLoadMore && loadedPages.has(pageToLoad)) {
            return;
        }
        
        setLoading(true);
        try {
            const params: any = { page: pageToLoad, limit };
            
            if (dateRange && dateRange[0] && dateRange[1]) {
                params.startDate = dateRange[0].toISOString();
                params.endDate = dateRange[1].toISOString();
            }

            if (showUnrecognizedOnly) {
                params.showUnrecognizedOnly = true;
            }

            const response = await axios.get<GetPhotosResponse>('/api/gallery/get-all', {
                params
            });
            
            console.log(`Loaded page ${pageToLoad}:`, response.data);
            
            setData(response.data);
            
            if (isLoadMore) {
                setLoadedPages(prev => new Set(prev).add(pageToLoad));
                
                setAllPhotos(prev => {
                    const existingIds = new Set(prev.map(photo => photo.id));
                    const newPhotos = response.data.photos.filter(photo => !existingIds.has(photo.id));
                    
                    return [...prev, ...newPhotos];
                });
            } else {
                setAllPhotos(response.data.photos);
                setLoadedPages(new Set([pageToLoad]));
            }
            
            setHasMore(response.data.hasNextPage);
            setCurrentPage(pageToLoad);
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    }, [limit, loading, loadedPages, dateRange, showUnrecognizedOnly]);

    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            const nextPage = currentPage + 1;
            fetchPhotos(nextPage, true);
        }
    }, [hasMore, loading, currentPage, fetchPhotos]);

    useEffect(() => {
        setAllPhotos([]);
        setLoadedPages(new Set([1]));
        setCurrentPage(1);
        fetchPhotos(1, false);
    }, [dateRange, showUnrecognizedOnly]);

    return { 
        data: data ? { ...data, photos: allPhotos } : null, 
        loading, 
        loadMore, 
        hasMore,
        isWebSocketConnected: isConnected
    };
};

export default useGallery;