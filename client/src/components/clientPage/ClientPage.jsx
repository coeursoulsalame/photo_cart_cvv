import React from "react";
import { Layout, Flex } from "antd";
import ClientMain from "./components/ClientMain";

const ClientPage = () => {
    return (
        <Layout style={{ backgroundColor: '#edf1f7' }}>
            <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
                <ClientMain />
            </Flex>
        </Layout>
    );
};

export default ClientPage;