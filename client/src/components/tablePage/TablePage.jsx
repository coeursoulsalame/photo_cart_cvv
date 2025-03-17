import React, { useEffect } from "react";
import { Layout, Typography, Flex, Card, Space, Spin } from "antd";
import { useDataBase } from "./hooks/useDataBase";
import Header from "./components/header/Header";
import TableSetting from "./components/settings/TableSetting";
import BaseTable from "./components/table/BaseTable";

const { Content } = Layout;
const { Text } = Typography;

const TablePage = () => {
    const { rowsCount, setRowsCount, dbData, loading, setShouldFetch, tableId, setTableId } = useDataBase();
    
    useEffect(() => {
        setShouldFetch(true);
        return () => setShouldFetch(false);
    }, [setShouldFetch]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header />
            
            <Content style={{ padding: '24px' }}>
                <Card style={{ marginBottom: 24 }}>
                    <TableSetting 
                        rowsCount={rowsCount}
                        setRowsCount={setRowsCount}
                        tableId={tableId}
                        setTableId={setTableId}
                    />
                </Card>
                
                {loading && dbData.length === 0 ? (
                    <Flex 
                        justify="center" 
                        align="center" 
                        style={{ 
                            height: 400, 
                            background: '#f5f5f5',
                            borderRadius: 8
                        }}
                    >
                        <Space direction="vertical" align="center">
                            <Spin size="small" />
                            <Text type="secondary">Загрузка данных из базы...</Text>
                        </Space>
                    </Flex>
                ) : (
                    <Card>
                        <BaseTable data={dbData} loading={loading}/>
                    </Card>
                )}
            </Content>
        </Layout>
    );
};

export default TablePage;