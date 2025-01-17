import React, { useEffect, useState } from "react";
import { Modal, Typography, Button, Spin, Input, Row, Col } from "antd";
import { LeftOutlined, RightOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useGetPhotoInfo from "./hooks/useGetPhotoInfo";
import useNavKeyboard from "./hooks/useNavKeyboard";
import useUpdateValue from "./hooks/useUpdateValue";
import ConfirmDelete from "./ConfirmDelete";
import "./style/photomodal.style.css";

const { Text } = Typography;

const PhotoModal = ({ open, photo, onClose, photos, setSelectedPhotoIndex, GalleryValueUpdate }) => {
    const { photoData, loadPhotoInfo, valueInputRef } = useGetPhotoInfo(photo?.name);
    const [loading, setLoading] = useState(true);
    const { editedValue, setEditedValue, updateValue } = useUpdateValue(photo?.name, photoData?.value);
    const { onNext, onPrev } = useNavKeyboard(open, setSelectedPhotoIndex, photos.length);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        if (open && photo?.name) {
            setLoading(true);
            loadPhotoInfo().finally(() => setLoading(false));
        }
    }, [open, photo, loadPhotoInfo]);

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

    return (
        <>
            <Modal
                open={open}
                onCancel={onClose}
                footer={null}
                width={800}
                centered
                title={photo.name}
            >
                <div className="modal-content-photo">
                    {loading ? (
                        <div className="load-modal-photo">
                            <Spin size="large"/>
                        </div>
                    ) : (
                        <div className="photo-container">
                            <Button type="text" icon={<LeftOutlined />} onClick={onPrev} className="nav-button prev-button"/>
                            <img src={photo.fullSrc} alt={photo.name} className="photo-image" />
                            <Button
                                type="text"
                                icon={<RightOutlined />}
                                onClick={onNext}
                                className="nav-button next-button"
                            />
                            <div className="photo-info">
                                <Text>Предсказание: {photoData.pred || ""}</Text>
                                <Row align="middle" gutter={8} className="value-row">
                                    <Col>
                                        <Text>Фактическое значение:</Text>
                                    </Col>
                                    <Col>
                                        <Input
                                            size="small"
                                            value={editedValue}
                                            ref={valueInputRef}
                                            onChange={(e) => setEditedValue(e.target.value)}
                                            onPressEnter={setValue}
                                            maxLength={2}
                                            className="value-input"
                                        />
                                    </Col>
                                    <Col>
                                        <Button type="primary" icon={<EditOutlined />} onClick={setValue}>
                                            Изменить
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-footer-photo">
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={confirmDeleteOpen}>
                        Удалить
                    </Button>
                    <Button type="primary" onClick={onClose}>
                        Закрыть
                    </Button>
                </div>
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