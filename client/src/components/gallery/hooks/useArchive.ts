import axios from 'axios';
import { Dayjs } from 'dayjs';

const useArchive = () => {
    const loadArchive = (date: Dayjs): void => {
        const timestamp = date.format('YYYYMMDD[T]HHmmss');
        const url = `${process.env['REACT_APP_NODERED_URL']}/screenshot?dt=${timestamp}`;
        axios.get(url, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(() => {
        });
    };

    return { loadArchive };
};

export default useArchive;