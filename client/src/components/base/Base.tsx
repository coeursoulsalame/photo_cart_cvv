import { Table, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useBaseTable from './hooks/useBaseTable';

interface Su168Record {
    id: number;
    date: string;
    file_name: string;
    detection: string;
    value: string;
    pred: string;
    confidence_score: number;
    valid_ai: boolean;
}

const Base = () => {
    const { data, loading, total, page, limit, fetchData } = useBaseTable();

    const columns: ColumnsType<Su168Record> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            width: 300,
        },
        {
            title: 'Имя файла',
            dataIndex: 'file_name',
            key: 'file_name',
            ellipsis: true,
        },
        {
            title: 'Обнаружение',
            dataIndex: 'detection',
            key: 'detection',
            width: 120,
        },
        {
            title: 'Значение',
            dataIndex: 'value',
            key: 'value',
            width: 100,
        },
        {
            title: 'Предсказание',
            dataIndex: 'pred',
            key: 'pred',
            width: 120,
        },
        {
            title: 'Уверенность',
            dataIndex: 'confidence_score',
            key: 'confidence_score',
            width: 120,
            render: (value: number) => value?.toFixed(4),
        },
        {
            title: 'Изменено ли значение',
            dataIndex: 'valid_ai',
            key: 'valid_ai',
            width: 200,
            render: (value: boolean) => value ? 'Нет' : 'Да',
        },
    ];

    const handleTableChange = (pagination: any) => {
        fetchData(pagination.current, pagination.pageSize);
    };

    return (
        <div style={{ padding: '24px', height: '100%' }}>
            <Card title="Таблица SU168">
                <Table
                    className="width-97-5rem"
                    bordered
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: total,
                        showSizeChanger: false,
                        showQuickJumper: false,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} из ${total} записей`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1000, y: 500 }}
                    size="small"
                />
            </Card>
        </div>
    );
};

export default Base;