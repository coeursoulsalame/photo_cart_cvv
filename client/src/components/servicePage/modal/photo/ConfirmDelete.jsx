import React from "react";
import { Modal, Button, Typography } from "antd";
import { useDeleteConfirm } from "./hooks/useDeleteConfirm";

const ConfirmDelete = ({ open, name, onClose }) => {
    const { onConfirm } = useDeleteConfirm(name, onClose);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={`Вы уверены, что хотите удалить фотографию?`}
            centered
            className="confirm-delete-modal"
        >
            <div className="modal-content-delete">
                <Typography.Text>{name}</Typography.Text>
            </div>
            <div className="modal-footer">
                <Button onClick={onClose} type="default">
                    Нет
                </Button>
                <Button onClick={onConfirm} type="primary" danger>
                    Да
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmDelete;