import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Switch, DatePicker, Layout, Flex, Space, Tooltip } from "antd";
import { CalendarOutlined, FilterOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { WsEventContext } from "../../../../context/ws-Context";
import { useTimeFormat } from "./hooks/useTimeFormat";
import { useLoadFromArchive } from "./hooks/useLoadFromArchive";
import { useLoadFilterByDate } from "./hooks/useLoadFilterByDate";
import useLoadUncorect from "./hooks/useLoadUncorect";

const { RangePicker } = DatePicker;
const { Header: AntHeader } = Layout;

function Header() {
    const { archiveDateTime, startDateTime, endDateTime, handleDateTimeChange, handleStartDateTimeChange, handleEndDateTimeChange, formatTimestamp } = useTimeFormat();
    const { fetchPhotoByDate } = useLoadFromArchive();
    const { filterPhotosByDate } = useLoadFilterByDate();
    const { uncorrectpred, toggleUncorrect } = useLoadUncorect();
    const { loading } = useContext(WsEventContext);

    const getPhotoFromArchive = async () => {
        const formattedTimestamp = formatTimestamp(archiveDateTime);
        try {
            await fetchPhotoByDate(formattedTimestamp);
        } catch (err) {
        }
    };

    const getFilterByDate = () => {
        if (startDateTime && endDateTime) {
            const formattedStart = formatTimestamp(startDateTime, true);
            const formattedEnd = formatTimestamp(endDateTime, true);
            filterPhotosByDate(formattedStart, formattedEnd);
        }
    };

    const LeftSection = () => (
        <Flex align="center" gap="middle">
            <Button type="primary">
                <Link to="/database" target="_blank" style={{ color: 'inherit' }}>
                    База данных
                </Link>
            </Button>
            <Flex align="center" gap="small">
                <Switch
                    checked={uncorrectpred}
                    onChange={toggleUncorrect}
                    loading={loading}
                />
                <span>Нераспознанные значения</span>
            </Flex>
        </Flex>
    );

    const ArchiveSection = () => (
        <Flex align="center" gap="small">
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
        </Flex>
    );

    const FilterSection = () => (
        <Flex align="center" gap="small">
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
        </Flex>
    );

    return (
        <>
            <AntHeader 
                style={{ 
                    background: '#fff', 
                    padding: '0 16px', 
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    boxShadow: '0px 5px 50px -34px rgba(34, 60, 80, 0.24)',
                    height: 'auto'
                }}
            >
                <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                    <LeftSection />
                    <Flex align="center" gap="middle">
                        <Space size="middle">
                            <ArchiveSection />
                            <FilterSection />
                            <Tooltip title="Перейти на клиентскую страницу">
                                <Button
                                    type="link"
                                    href="/client"
                                    icon={<RightOutlined />}
                                    rel="noopener noreferrer"
                                />
                            </Tooltip>
                        </Space>
                    </Flex>
                </Flex>
            </AntHeader>
        </>
    );
}

export default Header;