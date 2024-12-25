import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, TableSortLabel } from '@mui/material';
import dayjs from 'dayjs';

const BaseTable = ({ data, tableId }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <Typography sx={{ mt: 2, textAlign: 'center' }} variant="body1">
                Нет данных для отображения.
            </Typography>
        );
    }

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            const isAsc = prevConfig.key === key && prevConfig.direction === 'asc';
            return { key, direction: isAsc ? 'desc' : 'asc' };
        });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return sortConfig.direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }

        return 0;
    });

    const sortableColumnsCount = tableId === 1 ? 2 : tableId === 2 ? 4 : 0;

    const formatDate = (dateString) => {
        return dayjs(dateString).isValid()
            ? dayjs(dateString).format('DD.MM.YYYY HH:mm:ss')
            : dateString;
    };

    const formatOption = (value) => {
        const optionMap = {
            1: 'Осмотр',
            2: 'Замена подшипников',
            3: 'Аварийная замена подшипников'
        };
        return optionMap[value] || value;
    };

    return (
        <TableContainer component={Paper} sx={{ height: 'calc(100vh - 130px)', overflow: 'auto' }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        {Object.keys(data[0]).map((columnName, index) => (
                            <TableCell
                                key={columnName}
                                sortDirection={sortConfig.key === columnName ? sortConfig.direction : false}
                                sx={{
                                    backgroundColor: 'white',
                                    fontWeight: 'bold',
                                    zIndex: 1,
                                }}
                            >
                                {index < sortableColumnsCount ? (
                                    <TableSortLabel
                                        active={sortConfig.key === columnName}
                                        direction={sortConfig.key === columnName ? sortConfig.direction : 'asc'}
                                        onClick={() => handleSort(columnName)}
                                    >
                                        {columnName}
                                    </TableSortLabel>
                                ) : (
                                    columnName
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Object.keys(row).map((columnName, cellIndex) => {
                                let cellValue = row[columnName];

                                if (['date', 'start_date', 'end_date'].includes(columnName)) {
                                    cellValue = formatDate(cellValue);
                                }

                                if (columnName === 'option') {
                                    cellValue = formatOption(cellValue);
                                }

                                return (
                                    <TableCell key={cellIndex}>
                                        {Array.isArray(cellValue) ? cellValue.join(', ') : cellValue}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BaseTable;