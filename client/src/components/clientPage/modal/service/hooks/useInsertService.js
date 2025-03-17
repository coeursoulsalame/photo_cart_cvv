import axios from "axios";
import { message } from "antd";

const useInsertService = () => {
    const sendServiceData = async (wagonNumber, startDate, endDate, serviceOption) => {
        try {
            const response = await axios.post('/api/service/insert', {
                number: wagonNumber,
                start_date: startDate,
                end_date: endDate,
                option: serviceOption,
            });
            message.success('Запись успешно сохранена');
            return response;
        } catch (err) {  
            message.error('Ошибка при сохранении записи');
        }
    };

    return { sendServiceData };
};

export default useInsertService;