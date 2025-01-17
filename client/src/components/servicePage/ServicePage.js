import React from 'react';
import { Layout } from "antd";
import Header from './header/Header';
import Gallery from './gallery/Gallery';

const { Content } = Layout;

const ServicePage = () => {
    
    return (
        <Layout>
            <Content>
                <Header/>
                <Gallery/>
            </Content>
        </Layout>
    );
};

export default ServicePage;
