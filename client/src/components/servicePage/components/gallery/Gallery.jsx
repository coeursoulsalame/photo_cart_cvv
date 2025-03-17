import React, { useState, useCallback, useContext } from "react";
import { Row, Col, Card, Spin, Tooltip } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useGetPhotos from "./hooks/useGetPhotos";
import usePhotoScroll from "./hooks/usePhotoScroll";
import PhotoModal from "../../modal/photo/PhotoModal";
import { WsEventContext } from "../../../../context/ws-Context";
import "./style/gallery.style.css";

const VALID_VALUE_REGEX = /^(0[1-9]|[1-5][0-9]|60)$/;

const Gallery = () => {
    const { hasMore, loadPhotos } = useGetPhotos();
    const { photos, setPhotos, loading } = useContext(WsEventContext);
    const loaderRef = usePhotoScroll(loadPhotos, hasMore);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

    const isPredError = (value) => {
        return value === "error" || !VALID_VALUE_REGEX.test(value);
    };

    const handlePhotoClick = (index) => {
        setSelectedPhotoIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedPhotoIndex(null);
    };

    const handleValueUpdate = useCallback((fileName, newValue) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
                photo.name === fileName ? { ...photo, value: newValue } : photo
            )
        );
    }, [setPhotos]);

    const renderPhotoCard = (photo, index) => {
        const hasError = isPredError(photo.value);
        
        return (
            <Col key={photo.name} span={4}>
                <Card
                    hoverable
                    className={`gallery-card ${hasError ? "error" : ""}`}
                    cover={
                        <img 
                            alt={photo.name} 
                            src={photo.src} 
                            onClick={() => handlePhotoClick(index)} 
                        />
                    }
                >
                    <Card.Meta
                        title={<h4 style={{ marginBottom: 0, fontWeight: 600 }}>{photo.name}</h4>}
                        description={`Фактическое значение: ${photo.value}`}
                    />
                    {hasError && (
                        <Tooltip title={photo.value === "error" ? "Ошибка" : "Недопустимое значение"}>
                            <ExclamationCircleOutlined className="error-icon" />
                        </Tooltip>
                    )}
                </Card>
            </Col>
        );
    };

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <Spin />
                </div>
            )}
            
            <Row gutter={[20, 20]}>
                {photos.map(renderPhotoCard)}
            </Row>
            
            {hasMore && !loading && (
                <div ref={loaderRef} className="loader-placeholder" />
            )}

            <PhotoModal
                open={selectedPhotoIndex !== null}
                photo={selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null}
                onClose={handleCloseModal}
                index={selectedPhotoIndex}
                photos={photos}
                setSelectedPhotoIndex={setSelectedPhotoIndex}
                GalleryValueUpdate={handleValueUpdate}
            />
        </div>
    );
};

export default Gallery;