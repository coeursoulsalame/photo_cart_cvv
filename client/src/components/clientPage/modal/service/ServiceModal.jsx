import React from "react";
import { Modal, Form, Select, DatePicker, Button, Flex, Divider } from "antd";
import dayjs from "dayjs";
import useInsertService from "./hooks/useInsertService";

const { Option } = Select;

const WAGON_NUMBERS = Array.from({ length: 99 }, (_, index) => ({
    id: String(index + 1).padStart(2, "0"),
    label: `${String(index + 1).padStart(2, "0")}`,
}));

const SERVICE_TYPES = [
    { id: 1, label: "Осмотр" },
    { id: 2, label: "Замена подшипников" },
    { id: 3, label: "Аварийная замена подшипников" },
];

const ServiceModal = ({ onClose, open }) => {
    const { sendServiceData } = useInsertService();
    const [form] = Form.useForm();
    
    const formatDateTime = (dateTime) => dateTime ? dayjs(dateTime).format("DD.MM.YYYY HH:mm") : "";
  
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const { wagonNumber, serviceType, startDateTime, endDateTime } = values;
            
            const result = await sendServiceData(
                wagonNumber,
                formatDateTime(startDateTime),
                formatDateTime(endDateTime),
                serviceType
            );
            
            if (result) {
                form.resetFields();
                onClose();
            }
        } catch (error) {

        }
    };
  
    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={<h4>Форма обслуживания</h4>}
            open={open}
            onCancel={handleCancel}
            footer={null}
            centered
        >
            <Divider style={{ margin: 16, marginLeft: 0, marginRight: 0 }} />
            <Form 
                form={form} 
                layout="vertical"
                initialValues={{
                    wagonNumber: undefined,
                    serviceType: undefined,
                    startDateTime: null,
                    endDateTime: null
                }}
            >
                <Form.Item 
                    name="wagonNumber"
                    label="Номер вагонетки"
                    rules={[{ required: true, message: 'Пожалуйста, выберите номер вагонетки' }]}
                >
                    <Select placeholder="Выберите номер вагонетки">
                        {WAGON_NUMBERS.map(({ id, label }) => (
                        <Option key={id} value={id}>{label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item 
                    name="startDateTime"
                    label="Дата начала"
                    rules={[{ required: true, message: 'Пожалуйста, выберите дату начала' }]}
                >
                    <DatePicker
                        showTime
                        format="DD.MM.YYYY HH:mm"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item 
                    name="endDateTime"
                    label="Дата окончания"
                    rules={[{ required: true, message: 'Пожалуйста, выберите дату окончания' }]}
                >
                    <DatePicker
                        showTime
                        format="DD.MM.YYYY HH:mm"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item 
                    name="serviceType"
                    label="Вариант обслуживания"
                    rules={[{ required: true, message: 'Пожалуйста, выберите вариант обслуживания' }]}
                >
                    <Select placeholder="Выберите вариант обслуживания">
                        {SERVICE_TYPES.map(({ id, label }) => (
                        <Option key={id} value={id}>{label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Flex justify="end" gap="small">
                    <Button onClick={handleCancel}>
                        Закрыть
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                        Сохранить
                    </Button>
                </Flex>
            </Form>
        </Modal>
    );
};

export default ServiceModal;