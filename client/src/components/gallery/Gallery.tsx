import { Layout, Row, Col, Card, Badge, Space, Button, DatePicker, Flex, Checkbox, CheckboxProps, message } from 'antd';
import { useEffect, useCallback, useRef, useState } from 'react';
import { FileImageOutlined } from '@ant-design/icons';
import useGallery, { PhotoResponse } from './hooks/useGallery';
import useArchive from './hooks/useArchive';
import PhotoModal from '../modal/PhotoModal';
import dayjs, { Dayjs } from 'dayjs';
const { RangePicker } = DatePicker;

const { Header, Content } = Layout;

const VALID_VALUE_REGEX = /^(0[1-9]|[1-5][0-9]|60)$/;

interface GalleryProps {
    photos?: PhotoResponse[];
    isWebSocketConnected?: boolean;
    onPhotoClick?: (index: number) => void;
}

interface GalleryHeaderProps {
    isWebSocketConnected?: boolean;
    selectedDateRange: [Dayjs, Dayjs] | null;
    setSelectedDateRange: (range: [Dayjs, Dayjs] | null) => void;
    onApplyFilter: () => void;
    onClearFilter: () => void;
    hasActiveFilter: boolean;
    showUnrecognizedOnly: boolean;
    setShowUnrecognizedOnly: (value: boolean) => void;
}

const GalleryHeader = ({ 
    isWebSocketConnected = false, 
    selectedDateRange, 
    setSelectedDateRange,
    onApplyFilter,
    onClearFilter,
    hasActiveFilter,
    showUnrecognizedOnly,
    setShowUnrecognizedOnly
}: GalleryHeaderProps) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const { loadArchive } = useArchive();

    const handleLoadClick = () => {
        if (!selectedDate) {
            message.warning('Пожалуйста, выберите дату и время');
            return;
        }
        loadArchive(selectedDate);
        message.success('Запрос на загрузку архива отправлен');
    };

    const handleFilterClick = () => {
        if (!selectedDateRange || !selectedDateRange[0] || !selectedDateRange[1]) {
            message.warning('Пожалуйста, выберите диапазон дат');
            return;
        }
        onApplyFilter();
    };

    const handleClearClick = () => {
        setSelectedDateRange(null);
        onClearFilter();
    };

    const handleUnrecognizedChange: CheckboxProps['onChange'] = (e) => {
        setShowUnrecognizedOnly(e.target.checked);
    };
      
    return (
        <Header className='gallery-header'>
            <Flex align='center' justify='space-between'>
                <Space>
                    <Badge 
                        status={isWebSocketConnected ? 'success' : 'error'} 
                    />
                    <Checkbox 
                        checked={showUnrecognizedOnly}
                        onChange={handleUnrecognizedChange}
                    >
                        Нераспознанные значения
                    </Checkbox>
                </Space>
                <Space>
                    <Space>
                        <DatePicker
                            showTime={{
                                format: 'HH:mm:ss',
                                defaultValue: dayjs('00:00:00', 'HH:mm:ss')
                            }}
                            format="DD.MM.YYYY HH:mm:ss"
                            placeholder="Выберите дату и время"
                            style={{ width: 200 }}
                            value={selectedDate}
                            onChange={setSelectedDate}
                        />
                        <Button 
                            type="primary" 
                            onClick={handleLoadClick}
                            disabled={!selectedDate}
                        >
                            Загрузить
                        </Button>
                    </Space>

                    <Space>
                        <RangePicker
                            showTime={{
                                format: 'HH:mm:ss',
                                defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]
                            }}
                            format="DD.MM.YYYY HH:mm:ss"
                            placeholder={['Дата начала', 'Дата окончания']}
                            style={{ width: 350 }}
                            value={selectedDateRange}
                            onChange={(dates) => setSelectedDateRange(dates as [Dayjs, Dayjs] | null)}
                        />
                        <Button 
                            type="primary" 
                            onClick={handleFilterClick}
                            disabled={!selectedDateRange}
                        >
                            Фильтровать
                        </Button>
                        <Button 
                            onClick={handleClearClick}
                            disabled={!hasActiveFilter}
                        >
                            Очистить
                        </Button>
                    </Space>
                </Space>
            </Flex>
        </Header>
    );
};

const GalleryContent = ({ photos = [], onPhotoClick }: GalleryProps) => {
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    const isValidValue = (value: string): boolean => {
        return VALID_VALUE_REGEX.test(value);
    };

    const handleCardClick = useCallback((index: number) => {
        onPhotoClick?.(index);
    }, [onPhotoClick]);

    const handleImageError = useCallback((photoId: number) => {
        setImageErrors(prev => new Set(prev).add(photoId));
    }, []);

    const renderCardCover = (photo: PhotoResponse) => {
        const hasError = imageErrors.has(photo.id);
        
        if (hasError) {
            return (
                <div style={{
                    height: 200,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    border: '1px dashed #d9d9d9'
                }}>
                    <FileImageOutlined style={{ fontSize: '48px', marginBottom: '8px' }} />
                    <span>Изображение недоступно</span>
                </div>
            );
        }

        return (
            <img 
                alt={photo.fileName}
                src={photo.thumbnail}
                style={{ 
                    height: 200, 
                    objectFit: 'cover' 
                }}
                onError={() => handleImageError(photo.id)}
                loading="lazy"
            />
        );
    };

    return (
        <Content style={{ padding: '24px' }}>
            <Row gutter={[16, 16]}>
                {photos.map((photo, index) => {
                    const isValid = isValidValue(photo.value);
                    
                    return (
                        <Col 
                            key={photo.id}
                            xs={24} 
                            sm={12} 
                            md={8} 
                            lg={4} 
                            xl={4}
                        >
                            <Card
                                hoverable
                                style={{
                                    border: isValid ? undefined : '2px solid #ff4d4f',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                                cover={renderCardCover(photo)}
                                onClick={() => handleCardClick(index)}
                            >
                                <Card.Meta 
                                    title={photo.fileName} 
                                    description={`Фактическое значение: ${photo.value}`}
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Content>
    );
};

const Gallery = () => {
    const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [appliedDateRange, setAppliedDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [showUnrecognizedOnly, setShowUnrecognizedOnly] = useState(false);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    
    const { data, loading, loadMore, hasMore, isWebSocketConnected } = useGallery({ 
        dateRange: appliedDateRange,
        showUnrecognizedOnly: showUnrecognizedOnly
    });
    
    const isLoadingMoreRef = useRef(false);
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleApplyFilter = () => {
        setAppliedDateRange(selectedDateRange);
    };

    const handleClearFilter = () => {
        setAppliedDateRange(null);
    };

    const handlePhotoClick = (index: number) => {
        setCurrentPhotoIndex(index);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleModalIndexChange = (index: number) => {
        setCurrentPhotoIndex(index);
    };

    const handleScroll = useCallback(() => {
        if (loading || !hasMore || isLoadingMoreRef.current) return;

        if (throttleTimeoutRef.current) return;

        throttleTimeoutRef.current = setTimeout(() => {
            throttleTimeoutRef.current = null;
            
            if (loading || !hasMore || isLoadingMoreRef.current) return;

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - 200) {
                isLoadingMoreRef.current = true;
                loadMore();
                setTimeout(() => {
                    isLoadingMoreRef.current = false;
                }, 1000);
            }
        }, 150);
    }, [loading, hasMore, loadMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const photos = data?.photos || [];

    return (
        <>
            <GalleryHeader 
                isWebSocketConnected={isWebSocketConnected}
                selectedDateRange={selectedDateRange}
                setSelectedDateRange={setSelectedDateRange}
                onApplyFilter={handleApplyFilter}
                onClearFilter={handleClearFilter}
                hasActiveFilter={appliedDateRange !== null}
                showUnrecognizedOnly={showUnrecognizedOnly}
                setShowUnrecognizedOnly={setShowUnrecognizedOnly}
            />
            <GalleryContent 
                photos={photos} 
                onPhotoClick={handlePhotoClick}
            />
            
            <PhotoModal
                visible={modalVisible}
                onClose={handleModalClose}
                photos={photos}
                currentIndex={currentPhotoIndex}
                onIndexChange={handleModalIndexChange}
            />
            
            {loading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    fontSize: '16px',
                    color: '#999' 
                }}>
                    Загрузка...
                </div>
            )}
        </>
    );
};

export default Gallery;