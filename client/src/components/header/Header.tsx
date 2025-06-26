import { useContext } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Flex, Layout, Menu, Space, Typography } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";
import { User } from '../common/types/types';

const { Text } = Typography;

const { Header: AntHeader } = Layout;

interface HeaderProps {
    hideOnPaths?: string[];
}

const Header = ({ hideOnPaths = [] }: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const authContext = useContext(AuthContext);
    const user = authContext?.auth.user as User | null;

    if (hideOnPaths.includes(location.pathname)) {
        return null;
    }

    const handleLogout = () => {
        if (authContext) {
            authContext.logout();
            navigate('/auth');
        }
    };

    const items = [
        {
            key: '/',
            label: 'Администрирование',
        },
        {
            key: '/repair',
            label: 'Вывести в ремонт',
        },
        {
            key: '/service',
            label: 'Обслуживание вагонеток',
        },
        {
            key: '/base',
            label: 'Данные',
        },
        {
            key: '/heatmap',
            label: 'Тепловая карта',
        },
    ];

    const userMenuItems: ItemType[] = [
        {
            key: 'profile',
            label: (
                <Space direction="vertical" size={1}>
                    <Text strong>{user?.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {user?.roleId === 1 ? 'Администратор' : 'Пользователь'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <Text strong>Площадка: {user?.locationName}</Text>
                    </Text>
                </Space>
            ),
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            danger: true,
            icon: <LogoutOutlined size={14} />,
            label: 'Выйти',
            onClick: handleLogout,
        },
    ];

    return (
        <AntHeader className="main-header" style={{ backgroundColor: '#fff'}}>
            <Flex justify="space-between" align="center" style={{ padding: '0 24px' }}>
                <Menu
                    theme="light"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={items}
                    onClick={({ key }) => navigate(key)}
                    style={{ flex: 1, minWidth: 0, backgroundColor: '#fff' }}
                />
                <Dropdown 
                    menu={{ items: userMenuItems }} 
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button type="text" style={{ padding: '0px 4px' }}>
                        <Space>
                            <span>{user?.name}</span>
                            <Avatar 
                                icon={<UserOutlined />} 
                                size="small"
                                shape="square"
                                style={{ 
                                    backgroundColor: user?.roleId === 1 ? '#1890ff' : '#52c41a'
                                }} 
                            />
                        </Space>
                    </Button>
                </Dropdown>
            </Flex>
        </AntHeader>
    );
};

export default Header; 