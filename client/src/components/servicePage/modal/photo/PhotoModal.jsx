import React, { useEffect, useState } from "react";
import { Modal, Button, Spin, Input, Flex, Space, Card, Divider, Tooltip } from "antd";
import { LeftOutlined, RightOutlined, DeleteOutlined, InfoCircleOutlined,SaveOutlined} from "@ant-design/icons";
import useGetPhotoInfo from "./hooks/useGetPhotoInfo";
import useNavKeyboard from "./hooks/useNavKeyboard";
import useUpdateValue from "./hooks/useUpdateValue";
import ConfirmDelete from "./ConfirmDelete";

const PhotoModal = ({ open, photo, onClose, photos, setSelectedPhotoIndex, GalleryValueUpdate }) => {
    const { photoData, loadPhotoInfo, valueInputRef } = useGetPhotoInfo(photo?.name);
    const [loading, setLoading] = useState(true);
    const { editedValue, setEditedValue, updateValue } = useUpdateValue(photo?.name, photoData?.value);
    const { onNext, onPrev } = useNavKeyboard(open, setSelectedPhotoIndex, photos.length);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (open && photo?.name) {
            setLoading(true);
            loadPhotoInfo().finally(() => setLoading(false));
            const index = photos.findIndex(p => p.name === photo.name);
            if (index !== -1) {
                setCurrentIndex(index);
            }
        }
    }, [open, photo, loadPhotoInfo, photos]);

    useEffect(() => {
        if (photoData && photoData.value !== undefined) {
            setEditedValue(photoData.value);
        } else {
            setEditedValue('');
        }
    }, [photo, photoData, setEditedValue]);

    const setValue = async () => {
        try {
            const upd = await updateValue();
            if (upd) {
                GalleryValueUpdate(photo.name, editedValue);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const confirmDeleteOpen = () => {
        setConfirmOpen(true);
    };

    const confirmDeleteClose = () => {
        setConfirmOpen(false);
    };

    if (!photo) return null;

    const isValidValue = /^(0[1-9]|[1-5][0-9]|60)$/.test(editedValue);

    return (
        <>
            <Modal
                open={open}
                onCancel={onClose}
                footer={null}
                width={900}
                centered
                title={<h2 style={{ margin: 0 }}>{photo.name}</h2>}
            >
                {loading ? (
                    <Flex align="center" justify="center" style={{ height: 500 }}>
                        <Spin size="small" />
                    </Flex>
                ) : (
                    <Flex>
                        <Flex 
                            style={{ 
                                flex: 3, 
                                background: '#000', 
                                position: 'relative',
                                height: 500,
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            <img 
                                src={photo.fullSrc} 
                                alt={photo.name} 
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '100%', 
                                    objectFit: 'contain'
                                }} 
                            />
                            <Button 
                                type="text" 
                                icon={<LeftOutlined />} 
                                onClick={onPrev} 
                                style={{ 
                                    position: 'absolute', 
                                    left: 10, 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: 'white',
                                    fontSize: 24,
                                    opacity: 0.7,
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                disabled={currentIndex === 0}
                            />
                            <Button 
                                type="text" 
                                icon={<RightOutlined />} 
                                onClick={onNext} 
                                style={{ 
                                    position: 'absolute', 
                                    right: 10, 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: 'white',
                                    fontSize: 24,
                                    opacity: 0.7,
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                disabled={currentIndex === photos.length - 1}
                            />
                        </Flex>
                        
                        <Flex 
                            vertical 
                            style={{ 
                                flex: 1, 
                                padding: 24,
                                background: '#f5f5f5',
                                height: 500,
                                justifyContent: 'space-between'
                            }}
                        >
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Card title="Информация о фотографии">
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Flex justify="space-between">
                                            <p>Имя файла:</p>
                                            <p>{photo.name}</p>
                                        </Flex>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Flex justify="space-between">
                                            <p>Предсказание:</p>
                                            <p>{photoData.pred || "Нет данных"}</p>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <p>Распознанное:</p>
                                            <p>{photoData.confidence_score || "Нет данных"}</p>
                                        </Flex>
                                    </Space>
                                </Card>
                                
                                <Card 
                                    title="Фактическое значение" 
                                    extra={
                                        <Tooltip title="Введите значение от 01 до 60">
                                            <InfoCircleOutlined />
                                        </Tooltip>
                                    }
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Flex justify="space-between" gap="small">
                                            <Input
                                                size="large"
                                                value={editedValue}
                                                ref={valueInputRef}
                                                onChange={(e) => setEditedValue(e.target.value)}
                                                onPressEnter={setValue}
                                                maxLength={2}
                                                style={{ 
                                                    textAlign: 'center',
                                                    borderColor: isValidValue ? undefined : '#ff4d4f'
                                                }}
                                                status={isValidValue ? '' : 'error'}
                                            />
                                            <Button 
                                                type="primary" 
                                                icon={<SaveOutlined />} 
                                                onClick={setValue}
                                                size="large"
                                            >
                                                Сохранить
                                            </Button>
                                        </Flex>
                                        {!isValidValue && editedValue && (
                                            <p style={{ color: '#ff4d4f' }}>
                                                Значение должно быть от 01 до 60
                                            </p>
                                        )}
                                    </Space>
                                </Card>
                            </Space>
                            
                            <Flex justify="space-between">
                                <Button 
                                    type="primary" 
                                    danger 
                                    icon={<DeleteOutlined />} 
                                    onClick={confirmDeleteOpen}
                                >
                                    Удалить
                                </Button>
                                <Button type="primary" onClick={onClose}>
                                    Закрыть
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                )}
            </Modal>

            <ConfirmDelete
                open={confirmOpen}
                name={photo.name}
                onClose={confirmDeleteClose}
            />
        </>
    );
};

export default PhotoModal;