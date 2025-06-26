import "antd/dist/reset.css";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import ruRU from 'antd/es/locale/ru_RU';
import { ConfigProvider, Layout } from "antd";
import theme from "./style/theme";
import "./style/global.style.css";
import Gallery from "./components/gallery/Gallery";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/Header";
import Repair from "./components/repair/Repair";
import Service from "./components/service/Service";
import Base from "./components/base/Base";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./components/auth/Login";
import HeatmapComponent from "./components/heatmap/Heatmap";

const { Content } = Layout;

dayjs.extend(utc); 

const App = () => {
    return (
        <ConfigProvider theme={theme} locale={ruRU}>
            <AuthProvider>
                <BrowserRouter>
                    <Header hideOnPaths={['/auth']} />
                    <Content>
                        <Routes>
                            <Route path="/auth" element={<Login />} />
                            <Route path="/" element={<PrivateRoute><Gallery /></PrivateRoute>} />
                            <Route path="/repair" element={<PrivateRoute><Repair /></PrivateRoute>} />
                            <Route path="/service" element={<PrivateRoute><Service /></PrivateRoute>} />
                            <Route path="/base" element={<PrivateRoute><Base /></PrivateRoute>} />
                            <Route path="/heatmap" element={<PrivateRoute><HeatmapComponent /></PrivateRoute>} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Content>
                </BrowserRouter>
            </AuthProvider>
        </ConfigProvider>
    );
};

export default App;