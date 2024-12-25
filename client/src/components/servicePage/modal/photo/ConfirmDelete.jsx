import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useDeleteConfirm } from './hooks/useDeleteConfirm';

const ConfirmDelete = ({ open, name, onClose }) => {
    const { onConfirm } = useDeleteConfirm(name, onClose);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Вы уверены, что хотите удалить фотографию  "{name}"?</DialogTitle>
            <DialogContent>
                <Typography>{name}</Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button onClick={onClose} color="primary">
                    Нет
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Да
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDelete;