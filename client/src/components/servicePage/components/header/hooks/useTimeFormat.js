import { useState } from 'react';
import dayjs from 'dayjs';

export const useTimeFormat = () => {
    const [archiveDateTime, setArchiveDateTime] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    const handleDateTimeChange = (event) => setArchiveDateTime(event.target.value);
    const handleStartDateTimeChange = (event) => setStartDateTime(event.target.value);
    const handleEndDateTimeChange = (event) => setEndDateTime(event.target.value);

    const formatTimestamp = (dateString, isFilterFormat = false) => {
        const date = dayjs(dateString);
        return isFilterFormat
            ? date.format('YYYY-MM-DD HH:mm:ss')
            : date.format('YYYYMMDDTHHmmss');
    };

    return { 
        archiveDateTime, 
        startDateTime, 
        endDateTime, 
        handleDateTimeChange, 
        handleStartDateTimeChange, 
        handleEndDateTimeChange, 
        formatTimestamp 
    };
};