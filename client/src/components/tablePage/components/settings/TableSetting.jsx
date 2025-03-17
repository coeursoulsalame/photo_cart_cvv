import React from "react";
import { Typography, Flex, InputNumber, Select, Divider } from "antd";
import { TableOutlined, NumberOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const tableOptions = [
    { id: 1, label: "Su168" },
    { id: 2, label: "Service Log" },
];

const TableSetting = ({ rowsCount, setRowsCount, tableId, setTableId }) => {
    const handleRowsCountChange = (value) => {
        setRowsCount(value);
    };

    const handleTableChange = (value) => {
        setTableId(value);
    };

    return (
        <Flex align="center" gap="large">
            <Flex align="center" gap="small">
                <NumberOutlined />
                <Text strong>Размер выборки:</Text>
                <InputNumber
                    min={1}
                    value={rowsCount}
                    onChange={handleRowsCountChange}
                    style={{ width: 100 }}
                />
            </Flex>
            
            <Divider type="vertical" style={{ height: 24 }} />
            
            <Flex align="center" gap="small">
                <TableOutlined />
                <Text strong>Таблица:</Text>
                <Select
                    value={tableId || ""}
                    onChange={handleTableChange}
                    style={{ width: 200 }}
                    placeholder="Выберите таблицу"
                >
                    {tableOptions.map((option) => (
                        <Option key={option.id} value={option.id}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </Flex>
        </Flex>
    );
};

export default TableSetting;