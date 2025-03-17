import React, { useState } from "react";
import { Layout, Button, Flex, message } from "antd";
import ServiceModal from "../modal/service/ServiceModal";

const { Content } = Layout;

const ClientMain = () => {
    const [serviceModalOpen, setServiceModalOpen] = useState(false);

    const handleRepairClick = () => {
        message.error("Функционал в разработке");
    };

    const modalOpen = () => {
        setServiceModalOpen(true);
    };

    const modalClose = () => {
        setServiceModalOpen(false);
    };

    return (
        <Content>
            <Flex gap="large" align="center" justify="center" direction="horizontal">
                <Button type="primary" size="large" onClick={modalOpen} style={{ padding: '32px 32px', fontSize: '1.5rem'}}>
                    Обслуживание вагонеток
                </Button>

                <Button type="primary" size="large" onClick={handleRepairClick} style={{ padding: '32px 32px', fontSize: '1.5rem' }}>
                    Вывести в ремонт
                </Button>

                <Button type="default" size="large" href="/service" rel="noopener noreferrer" style={{ padding: '32px 32px', fontSize: '1.5rem' }}>
                    Администрирование
                </Button>
            </Flex>
            <ServiceModal 
                open={serviceModalOpen} 
                onClose={modalClose}
            />
        </Content>
    );
};

export default ClientMain;