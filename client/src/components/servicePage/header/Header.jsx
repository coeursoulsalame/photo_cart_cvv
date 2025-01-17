import React, { useState, useContext } from "react";
import { Button, Switch, DatePicker, Menu } from "antd";
import { DatabaseOutlined, CalendarOutlined, FilterOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { WsEventContext } from "../../../context/ws-Context";
import { useTimeFormat } from "./hooks/useTimeFormat";
import { useLoadFromArchive } from "./hooks/useLoadFromArchive";
import { useLoadFilterByDate } from "./hooks/useLoadFilterByDate";
import { useSnackbar } from "notistack";
import useLoadUncorect from "./hooks/useLoadUncorect";
import BaseModal from "../modal/base/BaseModal";
import "./style/header.style.css";

const { RangePicker } = DatePicker;

function Header() {
    const { archiveDateTime, startDateTime, endDateTime, handleDateTimeChange, handleStartDateTimeChange, handleEndDateTimeChange, formatTimestamp } = useTimeFormat();
    const { fetchPhotoByDate } = useLoadFromArchive();
    const { filterPhotosByDate } = useLoadFilterByDate();
    const { uncorrectpred, toggleUncorrect } = useLoadUncorect();
    const { enqueueSnackbar } = useSnackbar();
    const [baseOpen, setBaseOpen] = useState(false);
    const { loading } = useContext(WsEventContext);

    const getPhotoFromArchive = async () => {
        const formattedTimestamp = formatTimestamp(archiveDateTime);
        try {
            await fetchPhotoByDate(formattedTimestamp);
            enqueueSnackbar("Отправлен запрос на получение фото из архива", { variant: "success" });
        } catch (error) {
            console.log(error);
            enqueueSnackbar("Ошибка при получении фото", { variant: "error" });
        }
    };

    const getFilterByDate = () => {
        if (startDateTime && endDateTime) {
            const formattedStart = formatTimestamp(startDateTime, true);
            const formattedEnd = formatTimestamp(endDateTime, true);
            filterPhotosByDate(formattedStart, formattedEnd);
        }
    };

    const baseModalOpen = () => setBaseOpen(true);
    const baseModalClose = () => setBaseOpen(false);

    return (
        <>
            <Menu mode="horizontal" className="header-menu" theme="light">
                <div className="menu-left">
                    <Button type="link" icon={<DatabaseOutlined />} onClick={baseModalOpen}>
                        База данных
                    </Button>
                    <div className="menu-item">
                        <Switch
                            checked={uncorrectpred}
                            onChange={toggleUncorrect}
                            loading={loading}
                        />
                        <span className="menu-label">Нераспознанные значения</span>
                    </div>
                </div>
                <div className="menu-right">
                    <div className="menu-item">
                        <DatePicker
                            showTime
                            format="DD.MM.YYYY HH:mm:ss"
                            value={archiveDateTime ? dayjs(archiveDateTime) : null}
                            onChange={(date) =>
                                handleDateTimeChange({
                                    target: { value: date ? date.format("YYYY-MM-DDTHH:mm:ss") : "" },
                                })
                            }
                        />
                        <Button
                            type="primary"
                            icon={<CalendarOutlined />}
                            onClick={getPhotoFromArchive}
                            disabled={!archiveDateTime}
                        >
                            Загрузить из архива
                        </Button>
                    </div>
                    <div className="menu-item">
                        <RangePicker
                            showTime
                            format="DD.MM.YYYY HH:mm:ss"
                            value={[
                                startDateTime ? dayjs(startDateTime) : null,
                                endDateTime ? dayjs(endDateTime) : null,
                            ]}
                            onChange={([start, end]) => {
                                handleStartDateTimeChange({
                                    target: { value: start ? start.format("YYYY-MM-DDTHH:mm:ss") : "" },
                                });
                                handleEndDateTimeChange({
                                    target: { value: end ? end.format("YYYY-MM-DDTHH:mm:ss") : "" },
                                });
                            }}
                        />
                        <Button
                            type="primary"
                            icon={<FilterOutlined />}
                            onClick={getFilterByDate}
                            disabled={!startDateTime}
                        >
                            Фильтровать
                        </Button>
                    </div>
                    <Button
                        type="link"
                        href="/client"
                        icon={<RightOutlined />}
                        rel="noopener noreferrer"
                    />
                </div>
            </Menu>

            <BaseModal open={baseOpen} onClose={baseModalClose} />
        </>
    );
}

export default Header;
