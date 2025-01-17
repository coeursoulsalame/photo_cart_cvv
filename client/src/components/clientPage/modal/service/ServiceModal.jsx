import React, { useState } from "react";
import { Modal, Form, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import useInsertService from "./hooks/useInsertService";
import "./style/servicemodal.style.css";

const { Option } = Select;

const ServiceModal = ({ onClose, open }) => {
    const { sendServiceData } = useInsertService();

    const [wagonNumber, setWagonNumber] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);

    const handleSubmit = async () => {
        const selectedServiceType = serviceTypes.find((service) => service.id === serviceType);
        const serviceTypeId = selectedServiceType ? selectedServiceType.id : null;

        try {
            const response = await sendServiceData(
                wagonNumber,
                startDateTime ? dayjs(startDateTime).format("DD.MM.YYYY HH:mm") : "",
                endDateTime ? dayjs(endDateTime).format("DD.MM.YYYY HH:mm") : "",
                serviceTypeId
            );
            console.log("Ответ от сервера:", response);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const wagonNumbers = Array.from({ length: 99 }, (_, index) => ({
        id: String(index + 1).padStart(2, "0"),
        label: `${String(index + 1).padStart(2, "0")}`,
    }));

    const serviceTypes = [
        { id: 1, label: "Осмотр" },
        { id: 2, label: "Замена подшипников" },
        { id: 3, label: "Аварийная замена подшипников" },
    ];

    return (
        <Modal
            title="Форма обслуживания"
            open={open}
            onCancel={onClose}
            footer={null}
            centered
        >
            <Form layout="vertical">
                <Form.Item label="Номер вагонетки">
                    <Select
                        value={wagonNumber}
                        onChange={(value) => setWagonNumber(value)}
                        placeholder="Выберите номер вагонетки"
                        className="service-select"
                    >
                        {wagonNumbers.map((wagon) => (
                            <Option key={wagon.id} value={wagon.id}>
                                {wagon.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Дата начала">
                    <DatePicker
                        showTime
                        value={startDateTime}
                        onChange={(value) => setStartDateTime(value)}
                        format="DD.MM.YYYY HH:mm"
                        className="service-datepicker"
                    />
                </Form.Item>

                <Form.Item label="Дата окончания">
                    <DatePicker
                        showTime
                        value={endDateTime}
                        onChange={(value) => setEndDateTime(value)}
                        format="DD.MM.YYYY HH:mm"
                        className="service-datepicker"
                    />
                </Form.Item>

                <Form.Item label="Вариант обслуживания">
                    <Select
                        value={serviceType}
                        onChange={(value) => setServiceType(value)}
                        placeholder="Выберите вариант обслуживания"
                        className="service-select"
                    >
                        {serviceTypes.map((service) => (
                            <Option key={service.id} value={service.id}>
                                {service.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <div className="service-modal-actions">
                    <Button onClick={onClose} className="cancel-button">
                        Закрыть
                    </Button>
                    <Button type="primary" onClick={handleSubmit} className="submit-button">
                        Сохранить
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ServiceModal;