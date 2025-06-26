import { useMemo, memo } from 'react';
import { Layout, Card, Alert, Badge } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useHeatmapWebSocket } from './hooks/useHeatmapWebSocket';

const { Content } = Layout;

type EChartsOption = echarts.EChartsOption;

const ConnectionStatus = memo(({ isConnected }: { isConnected: boolean }) => (
    <Badge 
        status={isConnected ? "success" : "error"} 
        text={isConnected ? "В сети" : "Отключено"} 
    />
));

const UpdateTime = memo(({ timestamp }: { timestamp: string }) => (
    <span style={{ fontSize: '12px', color: '#888' }}>
        Обновлено: {new Date(timestamp).toLocaleTimeString()}
    </span>
));

const DemoHeatmap = () => {
    const { data, isConnected, error } = useHeatmapWebSocket();

    const option: EChartsOption = useMemo(() => {
        if (!data) {
            return {};
        }

        const { xLabels, yLabels, heatmapData, sensors } = data;

        const scatterData = sensors.map(s => {
            const xIndex = xLabels.findIndex(label => parseFloat(label) === s.x);
            const yIndex = yLabels.findIndex(label => parseFloat(label) === s.y);
            return [xIndex, yIndex, s.value];
        });
        
        return {
            tooltip: {
                position: 'top',
                trigger: 'item',
                formatter: (params: any) => {
                    if (!params || !params.value) {
                        return '';
                    }
                    if (params.seriesType === 'heatmap') {
                        const x = xLabels[params.value[0]];
                        const y = yLabels[params.value[1]];
                        if (x === undefined || y === undefined || params.value[2] === undefined) {
                            return '';
                        }
                        return `Координаты: ${x}м, ${y}м<br>Температура: ${params.value[2].toFixed(1)}°C`;
                    }
                    if (params.seriesType === 'scatter') {
                        const sensor = sensors[params.dataIndex];
                        if (sensor) {
                            return `${sensor.id}<br>X: ${sensor.x}м, Y: ${sensor.y}м<br>Температура: ${sensor.value}°C`;
                        }
                    }
                    return '';
                },
                transitionDuration: 0.2,
            },
            grid: {
                top: '10%',
                right: '5%',
                bottom: '15%',
            },
            xAxis: {
                type: 'category',
                data: xLabels,
                axisLabel: { formatter: '{value} м' },
            },
            yAxis: {
                type: 'category',
                data: yLabels,
                axisLabel: { formatter: '{value} м' },
            },
            visualMap: {
                min: 25,
                max: 70,
                calculable: true,
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
                },
                textStyle: { color: '#333' },
                orient: 'horizontal',
                left: 'center',
                bottom: 0,
            },
            animationDurationUpdate: 50,
            animationEasingUpdate: 'linear',
            series: [
                {
                    name: 'Интерполяция',
                    type: 'heatmap',
                    data: heatmapData,
                    progressive: 500,
                    progressiveThreshold: 3000,
                    itemStyle: {
                        opacity: 0.5,
                    },
                },
                {
                    name: 'Датчики',
                    type: 'scatter',
                    data: scatterData,
                    symbolSize: 15,
                    itemStyle: {
                        color: 'black',
                        borderColor: 'white',
                        borderWidth: 2,
                    },
                    label: {
                        show: true,
                        formatter: (params: any) => sensors[params.dataIndex]?.id ?? '',
                        color: 'white',
                        fontWeight: 'bold',
                        position: 'top',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: [2, 4],
                        borderRadius: 3,
                    },
                },
            ],
        };
    }, [data]);

    if (error) {
        return (
            <Content style={{ padding: '24px' }}>
                <Alert message="Ошибка" description={error} type="error" showIcon />
            </Content>
        );
    }
    
    if (!data) {
        return (
            <Content style={{ padding: '24px' }}>
                <Alert 
                    message="Нет данных" 
                    description={
                        <div>
                            <p>Данные для тепловой карты еще не поступили. Ожидайте...</p>
                            <ConnectionStatus isConnected={isConnected} />
                        </div>
                    } 
                    type="info" 
                    showIcon 
                />
            </Content>
        );
    }

    return (
        <Content style={{ padding: '24px' }}>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>Тепловая карта датчиков ({data.sensors.length} активных)</span>
                        <ConnectionStatus isConnected={isConnected} />
                    </div>
                }
                extra={<UpdateTime timestamp={data.gridInfo.timestamp} />}
            >
                <div style={{ height: '80vh' }}>
                    <ReactECharts
                        echarts={echarts}
                        option={option}
                        style={{ height: '50%', width: '50%' }}
                        opts={{ 
                            renderer: 'canvas',
                        }}
                    />
                </div>
            </Card>
        </Content>
    );
};

export default DemoHeatmap;