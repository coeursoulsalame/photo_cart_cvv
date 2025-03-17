// hooks/useSwitchPred.js
import { useContext } from 'react';
import { WsEventContext } from '../../../../../context/ws-Context';

const useLoadUncorect = () => {
    const { uncorrectpred, setUncorrectpred } = useContext(WsEventContext);

    const toggleUncorrect = () => {
        setUncorrectpred((prev) => !prev);
    };

    return { uncorrectpred, toggleUncorrect };
};

export default useLoadUncorect;
