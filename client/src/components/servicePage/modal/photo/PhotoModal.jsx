import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography, CircularProgress, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import useGetPhotoInfo from './hooks/useGetPhotoInfo';
import useNavKeyboard from './hooks/useNavKeyboard';
import useUpdateValue from './hooks/useUpdateValue';

import ConfirmDelete from './ConfirmDelete';

const PhotoModal = ({ open, photo, onClose, photos, setSelectedPhotoIndex, GalleryValueUpdate }) => {
    const { photoData, loadPhotoInfo, valueInputRef } = useGetPhotoInfo(photo?.name);
    const [ loading, setLoading ] = useState(true);
    const { editedValue, setEditedValue, updateValue } = useUpdateValue(photo?.name, photoData?.value);
    const { onNext, onPrev } = useNavKeyboard(open, setSelectedPhotoIndex, photos.length);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        if (open && photo?.name) {
            setLoading(true);
            loadPhotoInfo().finally(() => setLoading(false));
        }
    }, [open, photo, loadPhotoInfo]);

    const setValue = async () => {
        try {
            const upd = await updateValue();
            if(upd) {
                GalleryValueUpdate(photo.name, editedValue);
            }
        } catch(error) {
            console.log(error);
        }
    }

    const confirmDeleteOpen = () => {
        setConfirmOpen(true);
    };

    const confirmDeleteClose = () => {
        setConfirmOpen(false);
    };

    if (!photo) return null;

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} component="div">
                    <Typography variant="h6" component="h2">{photo.name}</Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{ color: 'grey.500' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ position: 'relative', overflow: 'auto', margin: 'auto', textAlign: 'center', height: 520}}>
                        {loading ? (
                            <Box sx={{height:'100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress size={25} sx={{color: 'green'}}/>
                            </Box>
                        ) : (
                            <Box>
                                <Box sx={{minHeight:'420px'}}>
                                    <IconButton
                                        onClick={onPrev}
                                        sx={{ position: 'absolute', top: '40%', left: 15, transform: 'translateY(-50%)', color: 'white' }}
                                    >
                                        <ArrowBackIosIcon />
                                    </IconButton>
                                    <img src={photo.fullSrc} alt={photo.name} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
                                    <IconButton
                                        onClick={onNext}
                                        sx={{ position: 'absolute', top: '40%', right: 15, transform: 'translateY(-50%)', color: 'white' }}
                                    >
                                        <ArrowForwardIosIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ textAlign: 'left', marginTop: 2 }}>
                                    <Typography variant="h6">
                                        Предсказание: {photoData.pred || ''}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                                        <Typography variant="body1">
                                            Фактическое значение: 
                                        </Typography>
                                        <TextField
                                            size="small"
                                            value={editedValue}
                                            inputRef={valueInputRef}
                                            onChange={(e) => setEditedValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setValue(); 
                                                }
                                            }}
                                            slotProps={{
                                                htmlInput: {
                                                    maxLength: 2,
                                                },
                                            }}
                                            sx={{ width: '60px', ml: 1,mr: 1 }}
                                        />
                                        <Button variant="contained" color="success" onClick={setValue} startIcon={<EditIcon />} size="small" sx={{ml:2}}>
                                            Изменить
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={confirmDeleteOpen}
                    >
                        Удалить
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={onClose}
                    >
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDelete
                open={confirmOpen}
                name={photo.name}
                onClose={confirmDeleteClose}
            />
        </>
    );
};

export default PhotoModal;