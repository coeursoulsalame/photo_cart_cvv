import { useState } from 'react';

export const useTimeFormat = () => {
    const [archiveDateTime, setArchiveDateTime] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    const handleDateTimeChange = (event) => setArchiveDateTime(event.target.value);
    const handleStartDateTimeChange = (event) => setStartDateTime(event.target.value);
    const handleEndDateTimeChange = (event) => setEndDateTime(event.target.value);

    const formatTimestamp = (dateString, isFilterFormat = false) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return isFilterFormat
            ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            : `${year}${month}${day}T${hours}${minutes}${seconds}`;
    };

    return { archiveDateTime, startDateTime, endDateTime, handleDateTimeChange, handleStartDateTimeChange, handleEndDateTimeChange, formatTimestamp };
};