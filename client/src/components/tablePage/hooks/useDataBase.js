import axios from 'axios';
import { useState, useEffect } from 'react';

export const useDataBase = (initialRowsCount = 200) => {
    const [rowsCount, setRowsCount] = useState(initialRowsCount);
    const [loading, setLoading] = useState(false); 
    const [dbData, setDbData] = useState([]); 
    const [shouldFetch, setShouldFetch] = useState(false); 
    const [tableId, setTableId] = useState(1); 

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getDataFromDB(rowsCount, tableId);
            setDbData(response.data);
            console.log('tableId',tableId);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDataFromDB = async (limit = 200, tableId = 1) => {
        try {
            const response = await axios.get('/api/database/get-table', {
                params: { limit, tableId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (shouldFetch) { 
            fetchData();
        }
    }, [shouldFetch, rowsCount, tableId]); 

    return { rowsCount, setRowsCount, dbData, loading, fetchData, setShouldFetch, setTableId, tableId };
};