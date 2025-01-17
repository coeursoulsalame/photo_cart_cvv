import React, { useEffect } from "react";
import { Modal, Select, InputNumber, Spin, Row, Col } from "antd";
import { useDataBase } from "./hooks/useDataBase";
import BaseTable from "./BaseTable";
import "./style/basemodal.style.css";

const { Option } = Select;

const tableOptions = [
    { id: 1, label: "Su168" },
    { id: 2, label: "Service Log" },
];

const BaseModal = ({ open, onClose }) => {
    const { rowsCount, setRowsCount, dbData, loading, setShouldFetch, tableId, setTableId } = useDataBase();

    useEffect(() => {
        if (open) {
            setShouldFetch(true);
        } else {
            setShouldFetch(false);
        }
    }, [open, setShouldFetch]);

    const handleRowsCountChange = (value) => {
        setRowsCount(value);
    };

    const handleTableChange = (value) => {
        setTableId(value);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            centered
            footer={null}
            width={{
                xxl: '100%',
            }}
            title={"Данные с базы"}
        >
            <div className="modal-content-base">
                {loading ? (
                    <div className="loading-container-base">
                        <Spin size="large" />
                        <p>Загрузка данных...</p>
                    </div>
                ) : (
                    <BaseTable data={dbData} tableId={tableId} />
                )}
            </div>

            <div className="modal-footer-base">
                <Row gutter={16} align="middle">
                    <Col>
                        <InputNumber
                            min={1}
                            value={rowsCount}
                            onChange={handleRowsCountChange}
                            className="rows-input"
                        />
                        <span>Размер выборки</span>
                    </Col>
                    <Col>
                        <Select
                            value={tableId || ""}
                            onChange={handleTableChange}
                            className="table-select"
                            placeholder="Выберите таблицу"
                        >
                            {tableOptions.map((option) => (
                                <Option key={option.id} value={option.id}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

export default BaseModal;