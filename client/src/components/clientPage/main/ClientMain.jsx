import React, { useState } from "react";
import { Layout, Button, Space } from "antd";
import ServiceModal from "../modal/service/ServiceModal";
import { useSnackbar } from "notistack"; // временно
import "./style/clientmain.style.css";

const { Content } = Layout;

const ClientMain = () => {
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar(); // временный стейт

    const handleRepairClick = () => {
        enqueueSnackbar("Функционал в разработке", { variant: "error" }); // на время разработки
    };

    const modalOpen = () => {
        setServiceModalOpen(true);
    };

    const modalClose = () => {
        setServiceModalOpen(false);
    };

    return (
        <Layout className="client-main-layout">
            <Content className="client-main-content">
                <Space size="large" align="center">
                    <Button type="primary" size="large" className="main-button" onClick={modalOpen}>
                        Обслуживание вагонеток
                    </Button>

                    <Button type="primary" size="large" className="main-button" onClick={handleRepairClick}>
                        Вывести в ремонт
                    </Button>

                    <Button type="default" size="large" className="main-button" href="/service" rel="noopener noreferrer">
                        Администрирование
                    </Button>
                </Space>
            </Content>

            <ServiceModal open={serviceModalOpen} onClose={modalClose} />
        </Layout>
    );
};

export default ClientMain;