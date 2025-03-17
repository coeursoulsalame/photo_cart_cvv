import React from "react";
import { Layout, Button, Flex } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
    return (
        <AntHeader style={{ 
            background: '#fff', 
            padding: '0 24px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            height: 'auto'
        }}>
            <Flex justify="space-between" align="center">
                <Flex align="center" gap="middle">
                    <h2 style={{ margin: 0 }}>База данных</h2>
                </Flex>
                <Link to="/service">
                    <Button icon={<ArrowLeftOutlined />}>
                        В сервис
                    </Button>
                </Link>
            </Flex>
        </AntHeader>
    );
};

export default Header;