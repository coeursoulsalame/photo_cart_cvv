import { Result, Layout } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Content } = Layout;

const Repair = () => {
    return (
        <Layout className="layout-content">
            <Content
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    padding: 24,
                    margin: 0,
                }}
            >
                <Result
                    icon={<ToolOutlined style={{ color: '#1890ff' }} />}
                    title="Вывести в ремонт"
                    subTitle="Раздел находится в разработке"
                    extra={
                        <div style={{ color: '#666', marginTop: '20px' }}>
                            Функциональность для управления ремонтом вагонеток будет добавлена позже
                        </div>
                    }
                />
            </Content>
        </Layout>
    );
};

export default Repair;