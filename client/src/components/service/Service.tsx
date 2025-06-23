import { Form, DatePicker, Select, Button, Table, Card, Row, Col, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useServiceOpt from './hooks/useServiceOpt';
import useServiceTable from './hooks/useServiceTable';
import useNewService from './hooks/useNewService';
const { Option } = Select;

interface ServiceRecord {
    id: number;
    number: string;
    startDate: string;
    endDate: string;
    serviceType: string;
}

interface ServiceFormData {
    cartNumber: string;
    startDate: any;
    endDate: any;
    serviceType: number;
}

const WAGON_NUMBERS = Array.from({ length: 99 }, (_, index) => ({
    id: String(index + 1).padStart(2, "0"),
    label: `${String(index + 1).padStart(2, "0")}`,
}));

const Service = () => {
    const [form] = Form.useForm();
    const { options: serviceOptions, loading: optionsLoading } = useServiceOpt();
    const { data, loading: tableLoading, refetch } = useServiceTable();
    const { loading: createLoading, createService } = useNewService();

    const columns: ColumnsType<ServiceRecord> = [
        {
            title: 'Номер вагонетки',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Дата начала',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'Дата окончания',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Вариант обслуживания',
            dataIndex: 'serviceType',
            key: 'serviceType',
        }
    ];

    const handleSubmit = async (values: ServiceFormData) => {
        const serviceData = {
            number: values.cartNumber,
            start_date: values.startDate.format('YYYY-MM-DD'),
            end_date: values.endDate.format('YYYY-MM-DD'),
            option: values.serviceType
        };

        const result = await createService(serviceData);
        if (result) {
            form.resetFields();
            refetch();
        }
    };

    const handleReset = () => {
        form.resetFields();
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card 
                        title="Форма обслуживания"
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            style={{ marginBottom: '24px' }}
                        >
                            <Row gutter={16} className="width-97-5rem">
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item
                                        label="Номер вагонетки"
                                        name="cartNumber"
                                        rules={[
                                            { required: true, message: 'Введите номер вагонетки' }
                                        ]}
                                    >
                                        <Select placeholder="Выберите номер вагонетки">
                                            {WAGON_NUMBERS.map(({ id, label }) => (
                                            <Option key={id} value={id}>{label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item
                                        label="Дата начала"
                                        name="startDate"
                                        rules={[
                                            { required: true, message: 'Выберите дату начала' }
                                        ]}
                                    >
                                        <DatePicker 
                                            style={{ width: '100%' }}
                                            placeholder="Выберите дату начала"
                                            format="DD.MM.YYYY"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item
                                        label="Дата окончания"
                                        name="endDate"
                                        rules={[
                                            { required: true, message: 'Выберите дату окончания' }
                                        ]}
                                    >
                                        <DatePicker 
                                            style={{ width: '100%' }}
                                            placeholder="Выберите дату окончания"
                                            format="DD.MM.YYYY"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item
                                        label="Вариант обслуживания"
                                        name="serviceType"
                                        rules={[
                                            { required: true, message: 'Выберите вариант обслуживания' }
                                        ]}
                                    >
                                        <Select 
                                            placeholder="Выберите вариант обслуживания"
                                            options={serviceOptions}
                                            loading={optionsLoading}
                                            notFoundContent={optionsLoading ? 'Загрузка...' : 'Данные не найдены'}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Space>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit"
                                            icon={<PlusOutlined />}
                                            loading={createLoading}
                                        >
                                            Добавить
                                        </Button>
                                        <Button onClick={handleReset}>
                                            Очистить
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title="Список обслуживания">
                        <Table
                            size="middle"
                            className="width-97-5rem"
                            columns={columns}
                            dataSource={data}
                            rowKey="id"
                            loading={tableLoading}
                            bordered
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: false,
                                showQuickJumper: false,
                                showTotal: (total, range) => 
                                    `${range[0]}-${range[1]} из ${total} записей`,
                            }}
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Service;