import React from "react";
import { Modal, Button, Typography, Flex, Space } from "antd";
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
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Typography.Text>{name}</Typography.Text>
                
                <Flex justify="end" gap="small">
                    <Button onClick={onClose} type="default">
                        Нет
                    </Button>
                    <Button onClick={onConfirm} type="primary" danger>
                        Да
                    </Button>
                </Flex>
            </Space>
        </Modal>
    );
};

export default ConfirmDelete;