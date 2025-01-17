import React, { useState } from "react";
import { Table, Typography } from "antd";
import dayjs from "dayjs";
import "./style/basetable.style.css";

const BaseTable = ({ data, tableId }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <Typography.Text className="no-data-message">
                Нет данных для отображения.
            </Typography.Text>
        );
    }

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            const isAsc = prevConfig.key === key && prevConfig.direction === "asc";
            return { key, direction: isAsc ? "desc" : "asc" };
        });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (typeof valueA === "number" && typeof valueB === "number") {
            return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
            return sortConfig.direction === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }

        return 0;
    });

    const sortableColumnsCount = tableId === 1 ? 2 : tableId === 2 ? 4 : 0;

    const formatDate = (dateString) => {
        return dayjs(dateString).isValid()
            ? dayjs(dateString).format("DD.MM.YYYY HH:mm:ss")
            : dateString;
    };

    const formatOption = (value) => {
        const optionMap = {
            1: "Осмотр",
            2: "Замена подшипников",
            3: "Аварийная замена подшипников",
        };
        return optionMap[value] || value;
    };

    const columns = Object.keys(data[0]).map((columnName, index) => ({
        title: columnName,
        dataIndex: columnName,
        key: columnName,
        sorter: index < sortableColumnsCount,
        sortOrder: sortConfig.key === columnName ? sortConfig.direction : null,
        onHeaderCell: () => ({
            onClick: () => handleSort(columnName),
        }),
        render: (value) => {
            if (["date", "start_date", "end_date"].includes(columnName)) {
                return formatDate(value);
            }

            if (columnName === "option") {
                return formatOption(value);
            }

            return Array.isArray(value) ? value.join(", ") : value;
        },
    }));

    return (
        <Table
            dataSource={sortedData.map((item, index) => ({
                ...item,
                uniqueKey: item.id || `${item.someField}-${index}`, 
            }))}
            columns={columns}
            pagination={false}
            rowKey="uniqueKey"
            scroll={{ y: 650 }}
            className="base-table"
            bordered
            size="small"
        />
    );
};

export default BaseTable;