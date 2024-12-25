import React, {useState, useContext}from "react";
import { AppBar, Box, Button, FormControlLabel, Switch, Divider } from "@mui/material";
import Calendar from '@mui/icons-material/Event';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker, DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import 'dayjs/locale/ru'; 
import dayjs from 'dayjs';
import { useTimeFormat } from "./hooks/useTimeFormat";
import { useLoadFromArchive } from "./hooks/useLoadFromArchive";
import { useLoadFilterByDate } from "./hooks/useLoadFilterByDate";
import { useSnackbar } from 'notistack';
import useLoadUncorect from "./hooks/useLoadUncorect";
import BaseModal from "../modal/base/BaseModal";
import { WsEventContext } from "../../../context/ws-Context";

import StartIcon from '@mui/icons-material/Start';

dayjs.locale('ru');

function Header() {
    const { archiveDateTime, startDateTime, endDateTime, handleDateTimeChange, handleStartDateTimeChange, handleEndDateTimeChange, formatTimestamp } = useTimeFormat();
    const { fetchPhotoByDate } = useLoadFromArchive();
    const { filterPhotosByDate } = useLoadFilterByDate()
    const { uncorrectpred, toggleUncorrect } = useLoadUncorect();
    const { enqueueSnackbar } = useSnackbar();
    const [ BaseOpen, setBaseOpen] = useState(false);
    const { loading } = useContext(WsEventContext);

    const GetPhotoFromArchive = async () => {
        const formattedTimestamp = formatTimestamp(archiveDateTime);
        try {
            await fetchPhotoByDate(formattedTimestamp);
            enqueueSnackbar('Отправлен запрос на получение фото из архива', { variant: 'success' });
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Ошибка при получении фото', { variant: 'error' });
        }
    };

    const GetFilterByDate = () => {
        if (startDateTime && endDateTime) {
            const formattedStart = formatTimestamp(startDateTime, true);
            const formattedEnd = formatTimestamp(endDateTime, true);
            filterPhotosByDate(formattedStart, formattedEnd);
        }
    };

    const BaseModalOpen = () => {
        setBaseOpen(true);
    };

    const BaseModalClose = () => {
        setBaseOpen(false);
    };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <AppBar sx={{ position: 'sticky', backgroundColor: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', py: 1, px: 2 }}>
                        <Box>
                            <Button variant="contained" size="small" color="success" onClick={BaseModalOpen} sx={{mr:2}}>База данных</Button>
                        </Box>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="success"
                                        checked={uncorrectpred}
                                        onChange={toggleUncorrect}
                                        disabled={loading}
                                    />
                                }
                                label="НЕРАСПОЗНАННЫЕ ФОТО"
                                sx={{ color: 'text.secondary',ml: 1, mr: 0 }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }} />
                        <Box>
                            <DateTimePicker
                                label="Дата и время"
                                slotProps={{
                                    field: {
                                        size: 'small',
                                        clearable: true,
                                        sx: {
                                            minWidth: 300,
                                            '& input': {
                                                padding: '4px 8px', 
                                                fontSize: '1rem', 
                                            },
                                            '& .MuiInputLabel-root': { 
                                                top: -3, 
                                                fontSize: '0.9rem', 
                                            },
                                            '& .MuiInputLabel-shrink': { 
                                                fontSize: '1rem', 
                                            },
                                        },
                                    },
                                }}
                                value={archiveDateTime ? dayjs(archiveDateTime) : null} 
                                onChange={(newValue) => {
                                    handleDateTimeChange({
                                        target: { value: newValue?.format('YYYY-MM-DDTHH:mm:ss') || '' },
                                    });
                                }}
                                ampm={false}
                                views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']} 
                                inputFormat="DD.MM.YYYY HH:mm:ss" 
                                timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                            />
                            <Button variant="contained" size="small" color="success" sx={{ ml: 1, mr: 1 }} onClick={GetPhotoFromArchive} disabled={!archiveDateTime}>Загрузить из архива</Button>
                        </Box>
                        <Box>
                            <DateRangePicker
                                label="Дата - Дата"
                                value={[startDateTime ? dayjs(startDateTime) : null, endDateTime ? dayjs(endDateTime) : null]}
                                onChange={([newStartDateTime, newEndDateTime]) => {
                                    handleStartDateTimeChange({
                                        target: { value: newStartDateTime ? newStartDateTime.format('YYYY-MM-DDTHH:mm:ss') : '' }
                                    });
                                    handleEndDateTimeChange({
                                        target: { value: newEndDateTime ? newEndDateTime.format('YYYY-MM-DDTHH:mm:ss') : '' }
                                    });
                                }}
                                slots={{ field: SingleInputDateRangeField }}
                                slotProps={{
                                    field: {
                                        InputProps: {
                                            endAdornment: <Calendar style={{ marginLeft: '15px' }} /> 
                                        },
                                        size: 'small',
                                        clearable: true,
                                        sx: {
                                            minWidth: 300,
                                            '& input': {
                                                padding: '4px 8px', 
                                                fontSize: '1rem', 
                                            },
                                            '& .MuiInputLabel-root': { 
                                                top: -3, 
                                                fontSize: '0.9rem', 
                                            },
                                            '& .MuiInputLabel-shrink': { 
                                                fontSize: '1rem', 
                                            },
                                        },
                                    }
                                }}
                            />
                            <Button variant="contained" size="small" color="success" sx={{ ml: 1 }} onClick={GetFilterByDate} disabled={!startDateTime}>Фильтровать</Button>
                        </Box>
                        <Box sx={{ ml: 2 }}>
                            <Button
                                color="primary"
                                startIcon={<StartIcon />}
                                component="a"
                                href="/client"
                                rel="noopener noreferrer"
                            />
                        </Box>
                    </Box>
                </AppBar>
            </LocalizationProvider>
           <BaseModal
                open={BaseOpen}
                onClose={BaseModalClose}
           />
        </>
    );
}

export default Header;