import axios from "axios";
import { useSnackbar } from 'notistack';

const useInsertService = () => {
    const { enqueueSnackbar } = useSnackbar();

    const sendServiceData = async (wagonNumber, startDate, endDate, serviceOption) => {
        try {
            const response = await axios.post('/api/service/insert', {
                number: wagonNumber,
                start_date: startDate,
                end_date: endDate,
                option: serviceOption,
            });
            enqueueSnackbar('Запись успешно сохранена', { variant: 'success' })
            return response;
        } catch (error) {
            console.log(error);   
            enqueueSnackbar('Ошибка при сохранении записи', { variant: 'error' })
        }
    };

    return { sendServiceData };
};

export default useInsertService;