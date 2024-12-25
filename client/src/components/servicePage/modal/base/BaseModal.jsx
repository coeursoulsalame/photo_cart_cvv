import React, {useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, IconButton, MenuItem, DialogActions, Select, FormControl, Box, Typography, CircularProgress } from '@mui/material';
import { useDataBase } from './hooks/useDataBase';
import CloseIcon from '@mui/icons-material/Close';
import BaseTable from './BaseTable';

const tableOptions = [
    { id: 1, label: 'Su168' },
    { id: 2, label: 'Service Log' },
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

    const handleRowsCountChange = (event) => {
        setRowsCount(Number(event.target.value));
    };

    const handleTableChange = (event) => {
        setTableId(event.target.value); 
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ ml:2 ,flexGrow: 1, textAlign: 'left' }}>
                    ДАННЫЕ С БАЗЫ
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select value={tableId || ''} onChange={handleTableChange} sx={{ color: 'black' }}>
                        {tableOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogTitle>
            <DialogContent dividers sx={{ padding: '0px' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <CircularProgress />
                        <p>Загрузка данных...</p>
                    </Box>
                ) : (
                    <BaseTable data={dbData} tableId={tableId}/>
                )}
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <TextField type="number" value={rowsCount} onChange={handleRowsCountChange} label="Размер выборки" variant="outlined" size="small" sx={{ width: '150px' }}/>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default BaseModal;