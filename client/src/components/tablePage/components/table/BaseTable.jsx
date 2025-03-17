import React from "react";
import { Table, Tag, Typography } from "antd";

const { Text } = Typography;

const BaseTable = ({ data, loading }) => {

    if (!Array.isArray(data) || data.length === 0) {
        return <Text>Нет данных для отображения</Text>;
    }

    const formatOption = (value) => {
        const optionMap = {
            1: "Осмотр",
            2: "Замена подшипников",
            3: "Аварийная замена подшипников",
        };
        return optionMap[value] || value;
    };

    const renderCellValue = (value, columnName) => {
        if (["date", "start_date", "end_date"].includes(columnName)) {
            if (!value) return <Text>—</Text>;
            return <Text>{value}</Text>;
        }

        if (columnName === "option") {
            const formattedValue = formatOption(value);
            const colorMap = {
                "Осмотр": "blue",
                "Замена подшипников": "green",
                "Аварийная замена подшипников": "red"
            };
            
            return (
                <Tag color={colorMap[formattedValue] || "default"}>
                    {formattedValue}
                </Tag>
            );
        }

        if (typeof value === "number") {
            return <Text>{value}</Text>;
        }

        if (Array.isArray(value)) {
            return value.join(", ");
        }

        if (value === null || value === undefined || value === "") {
            return <Text>—</Text>;
        }

        return value;
    };

    const columns = Object.keys(data[0]).map((columnName) => ({
        title: (
            <Text style={{ fontWeight: 600 }}>{columnName}</Text>
        ),
        dataIndex: columnName,
        key: columnName,
        render: (value) => renderCellValue(value, columnName),
        ellipsis: true,
        width: 100,
    }));

    return (
        <>
            <Table
                dataSource={data}
                loading={loading}
                columns={columns}
                pagination={false}
                rowKey="id"
                scroll={{ x: 'max-content', y: 650 }}
                bordered
                size="small"
            />
        </>
    );
};

export default BaseTable;