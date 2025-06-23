import { Result } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const Repair = () => {
    return (
        <div style={{ 
            padding: '50px',
            textAlign: 'center',
            height: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
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
        </div>
    );
};

export default Repair;