import { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';

interface Su168Record {
    id: number;
    date: string;
    file_name: string;
    detection: string;
    value: string;
    pred: string;
    confidence_score: number;
    valid_ai: boolean;
}

interface Su168Response {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: Su168Record[];
}

interface UseBaseTableReturn {
    data: Su168Record[];
    loading: boolean;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    fetchData: (page?: number, limit?: number) => void;
}

const useBaseTable = (): UseBaseTableReturn => {
    const [data, setData] = useState<Su168Record[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(50);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchData = async (newPage: number = 1, newLimit: number = 50) => {
        setLoading(true);
        setPage(newPage);
        setLimit(newLimit);

        try {
            const response = await axios.get<Su168Response>('/api/static/su-table', {
                params: {
                    page: newPage,
                    limit: newLimit,
                },
            });

            setData(response.data.data);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (err: any) {
            let errorMessage = 'Неизвестная ошибка';
            
            if (err.response) {
                errorMessage = `Ошибка ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
            } else if (err.request) {
                errorMessage = 'Нет ответа от сервера';
            } else {
                errorMessage = err.message;
            }
            
            message.error(`Ошибка загрузки данных: ${errorMessage}`);
            console.error('Error fetching base table data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1, 50);
    }, []);

    return {
        data,
        loading,
        total,
        page,
        limit,
        totalPages,
        fetchData,
    };
};

export default useBaseTable;