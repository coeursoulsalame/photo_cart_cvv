import React, { useState, useCallback, useContext } from "react";
import { Row, Col, Card, Spin, Tooltip } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useGetPhotos from "./hooks/useGetPhotos";
import usePhotoScroll from "./hooks/usePhotoScroll";
import PhotoModal from "../modal/photo/PhotoModal";
import { WsEventContext } from "../../../context/ws-Context";
import "./style/gallery.style.css";

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
    }, [setPhotos]);

    const isPredError = (value) => {
        return value === "error" || !/^(0[1-9]|[1-5][0-9]|60)$/.test(value);
    };

    return (
        <div className="gallery-container">
            {loading && (
                <div className="loading-overlay">
                    <Spin/>
                </div>
            )}
            <Row gutter={[20, 20]}>
                {photos.map((photo, index) => (
                    <Col key={photo.name} span={4}>
                        <Card
                            hoverable
                            className={`gallery-card ${isPredError(photo.value) ? "error" : ""}`}
                            cover={<img alt={photo.name} src={photo.src} onClick={() => handlePhotoClick(index)} />}
                        >
                            <Card.Meta
                                title={photo.name}
                                description={`Фактическое значение: ${photo.value}`}
                            />
                            {isPredError(photo.value) && (
                                <Tooltip title={photo.value === "error" ? "Ошибка" : "Недопустимое значение"}>
                                    <ExclamationCircleOutlined className="error-icon" />
                                </Tooltip>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
            {hasMore && !loading && <div ref={loaderRef} className="loader-placeholder" />}

            <PhotoModal
                open={selectedPhotoIndex !== null}
                photo={photos[selectedPhotoIndex]}
                onClose={handleCloseModal}
                index={selectedPhotoIndex}
                photos={photos}
                setSelectedPhotoIndex={setSelectedPhotoIndex}
                GalleryValueUpdate={GalleryValueUpdated}
            />
        </div>
    );
};

export default Gallery;