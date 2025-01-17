import React from "react";
import { Layout } from "antd";
import ClientMain from "./main/ClientMain";

const { Content } = Layout;

const ClientPage = () => {
    return (
        <Layout>
            <Content>
                <ClientMain />
            </Content>
        </Layout>
    );
};

export default ClientPage;