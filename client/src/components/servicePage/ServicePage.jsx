import React from 'react';
import { Layout } from "antd";
import Header from './components/header/Header';
import Gallery from './components/gallery/Gallery';

const { Content } = Layout;

const ServicePage = () => {
    
    return (
        <Layout style={{ backgroundColor: '#edf1f7', minHeight: '100vh'}}>
            <Header/>
            <Content style={{padding: '24px',}}>
                <Gallery/>
            </Content>
        </Layout>
    );
};

export default ServicePage;
