import { Modal, Carousel, Row, Col, Descriptions, Typography, Input, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { PhotoResponse } from '../gallery/hooks/useGallery';
import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { CarouselRef } from 'antd/es/carousel';
import useNewValue from '../gallery/hooks/useNewValue';
import useDelete from '../gallery/hooks/useDelete';
import React from 'react';

const { Title } = Typography;

interface PhotoModalProps {
    visible: boolean;
    onClose: () => void;
    photos: PhotoResponse[];
    currentIndex: number;
    onIndexChange?: (index: number) => void;
    onPhotoUpdate?: (photoId: number, newValue: string) => void;
}

const PhotoSlide = React.memo(({ 
    photo, 
    isActive, 
    isPreloading 
}: { 
    photo: PhotoResponse; 
    isActive: boolean;
    isPreloading: boolean;
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const shouldShowImage = isActive || isPreloading;

    return (
        <div style={{ 
            textAlign: 'center',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            position: 'relative'
        }}>
            {shouldShowImage ? (
                <>
                    <img
                        src={photo.fullSrc}
                        alt={photo.fileName}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}
                        loading="eager"
                        onLoad={handleImageLoad}
                    />

                    {!imageLoaded && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '16px',
                            borderRadius: '8px'
                        }}>
                            Загрузка
                        </div>
                    )}
                </>
            ) : (
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#d9d9d9',
                    borderRadius: '8px'
                }}>
                </div>
            )}
        </div>
    );
});

const PhotoInfo = React.memo(({ 
    photo, 
    index, 
    totalPhotos, 
    isVisible, 
    carouselRef, 
    activeIndex, 
    photos, 
    onPhotoUpdate
}: { 
    photo: PhotoResponse; 
    index: number; 
    totalPhotos: number;
    isVisible: boolean;
    carouselRef: React.RefObject<CarouselRef>;
    activeIndex: number;
    photos: PhotoResponse[];
    onPhotoUpdate?: ((photoId: number, newValue: string) => void) | undefined;
}) => {
    const [actualValue, setActualValue] = useState<string>(photo.value);
    const inputRef = useRef<any>(null);
    const { updateValue } = useNewValue();
    const { deletePhoto } = useDelete();

    useEffect(() => {
        setActualValue(photo.value);
    }, [photo.value, photo.id]);

    useEffect(() => {
        if (isVisible && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 200);
        }
    }, [isVisible, photo.id]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '').slice(0, 2);
        setActualValue(numericValue);
    }, []);

    const handleDelete = useCallback(async () => {
        try {
            await deletePhoto({
                id: photo.id,
                fileName: photo.fileName
            });
            console.log('Фото удалено:', photo.fileName);
        } catch (error) {
            console.error('Ошибка при удалении фото:', error);
        }
    }, [deletePhoto, photo.id, photo.fileName]);

    const handleKeyPress = useCallback(async(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (activeIndex > 0) {
                carouselRef.current?.prev();
            }
            return;
        }
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (activeIndex < photos.length - 1) {
                carouselRef.current?.next();
            }
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            
            if (actualValue === '') {
                console.log('Обновлено', 'Пустое значение');
                return;
            }

            const numValue = parseInt(actualValue, 10);
            if (numValue >= 1 && numValue <= 60) {
                try {
                    await updateValue({
                        id: photo.id,
                        value: actualValue 
                    });
                    console.log('Обновлено', actualValue);
                    
                    onPhotoUpdate?.(photo.id, actualValue);
                    
                } catch (error) {
                    console.error('Ошибка при обновлении:', error);
                    setActualValue(photo.value);
                }
            } else {
                console.log('Значение вне диапазона 1-60:', numValue);
                setActualValue(photo.value);
            }
            return;
        }
    }, [carouselRef, activeIndex, photos.length, updateValue, photo.id, actualValue, photo.value, onPhotoUpdate]);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const numericValue = pastedData.replace(/[^0-9]/g, '').slice(0, 2);
        const numValue = parseInt(numericValue, 10);
        
        if (numericValue === '' || (numValue >= 1 && numValue <= 60)) {
            setActualValue(numericValue);
        }
    }, []);

    return (
        <>
            <Title level={4}>Информация о фотографии</Title>
            <Descriptions
                column={1}
                bordered
                size="small"
                styles={{
                    label: { 
                        width: '40%', 
                        fontWeight: 'bold' 
                    }
                }}
            >   
                <Descriptions.Item label="Имя файла">
                    {photo.fileName}
                </Descriptions.Item>
                
                <Descriptions.Item label="Предсказание">
                    {photo.pred !== null ? photo.pred : 'Не определено'}
                </Descriptions.Item>
                
                <Descriptions.Item label="Распознанное">
                    {photo.confidenceScore || 'Не определено'}
                </Descriptions.Item>

                <Descriptions.Item label="Фактическое значение">
                    <Input
                        ref={inputRef}
                        value={actualValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        onPaste={handlePaste}
                        placeholder="Введите значение (1-60)"
                        maxLength={2}
                        style={{ width: '100%' }}
                    />
                </Descriptions.Item>

                <Descriptions.Item label="Изменено ли значение вручную?">
                    {photo.validAi ? 'Нет' : 'Да'}
                </Descriptions.Item>
                
            </Descriptions>

            <div style={{ 
                marginTop: 16, 
                textAlign: 'center',
                color: '#666',
                fontSize: '14px'
            }}>
                {index + 1} из {totalPhotos}
            </div>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Popconfirm
                    title="Удалить фото"
                    description="Вы уверены, что хотите удалить это фото? Это действие нельзя отменить."
                    onConfirm={handleDelete}
                    okText="Да, удалить"
                    cancelText="Отмена"
                    okType="danger"
                >
                    <Button 
                        type="primary" 
                        danger 
                        icon={<DeleteOutlined />}
                    >
                        Удалить фото
                    </Button>
                </Popconfirm>
            </div>
        </>
    );
});

const PhotoModal = ({
    visible,
    onClose,
    photos,
    currentIndex,
    onIndexChange,
    onPhotoUpdate
}: PhotoModalProps) => {
    const carouselRef = useRef<CarouselRef>(null);
    const [activeIndex, setActiveIndex] = useState(currentIndex);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (visible) {
            setActiveIndex(currentIndex);
            setTimeout(() => {
                carouselRef.current?.goTo(currentIndex, false);
            }, 50);
        }
    }, [visible, currentIndex]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!visible) return;

        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT';

        if (isInputFocused) return;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                if (activeIndex > 0) {
                    carouselRef.current?.prev();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (activeIndex < photos.length - 1) {
                    carouselRef.current?.next();
                }
                break;
            case 'Escape':
                event.preventDefault();
                onClose();
                break;
        }
    }, [visible, activeIndex, photos.length, onClose]);

    useEffect(() => {
        if (visible) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [visible, handleKeyDown]);

    const handleAfterChange = useCallback((current: number) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (current >= 0 && current < photos.length) {
                setActiveIndex(current);
                onIndexChange?.(current);
            }
        }, 50);
    }, [photos.length, onIndexChange]);

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const visibleSlides = useMemo(() => {
        const buffer = 1;
        return photos.map((photo, index) => ({
            photo,
            index,
            isActive: index === activeIndex,
            isPreloading: Math.abs(index - activeIndex) <= buffer
        }));
    }, [photos, activeIndex]);

    const currentPhoto = photos[activeIndex];

    return (
        <Modal
            title="Просмотр"
            open={visible}
            onCancel={onClose}
            footer={null}
            width="90%"
            style={{ maxWidth: 1200 }}
            centered
            destroyOnHidden={true}
            maskClosable={false}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                    {photos.length > 0 && (
                        <Carousel
                            ref={carouselRef}
                            arrows
                            infinite={false}
                            dots={false}
                            afterChange={handleAfterChange}
                            speed={0}
                            waitForAnimate={false}
                            swipeToSlide={false}
                        >
                            {visibleSlides.map(({ photo, isActive, isPreloading }) => (
                                <PhotoSlide
                                    key={photo.id}
                                    photo={photo}
                                    isActive={isActive}
                                    isPreloading={isPreloading}
                                />
                            ))}
                        </Carousel>
                    )}
                </Col>

                <Col xs={24} lg={10}>
                    {currentPhoto && (
                        <PhotoInfo 
                            photo={currentPhoto} 
                            index={activeIndex} 
                            totalPhotos={photos.length}
                            isVisible={visible}
                            carouselRef={carouselRef}
                            activeIndex={activeIndex}
                            photos={photos}
                            onPhotoUpdate={onPhotoUpdate}
                        />
                    )}
                </Col>
            </Row>
        </Modal>
    );
};

export default PhotoModal; 