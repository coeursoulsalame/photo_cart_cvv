import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation  } from 'react-router-dom';
import { WsProvider } from './context/ws-Context';
import { ConfigProvider} from "antd";

import ServicePage from './components/servicePage/ServicePage';
import ClientPage from './components/clientPage/ClientPage';
import TablePage from './components/tablePage/TablePage';

import "antd/dist/reset.css";
import theme from "./theme";
import ruRU from 'antd/es/locale/ru_RU';

import 'dayjs/locale/ru.js';

function ChangePageName() {
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === '/service') {
			document.title = 'Сервис - Анализ оборота автоклавных вагонеток';
		} else if (location.pathname === '/client') {
			document.title = 'Клиент - Анализ оборота автоклавных вагонеток';
		} else if (location.pathname === '/database') {
			document.title = 'База данных - Анализ оборота автоклавных вагонеток';
		}
	}, [location]);

	return null;
}

const App = () => {
	
	return (
		<ConfigProvider theme={theme} locale={ruRU}>
			<Router
				future={{
					v7_startTransition: true,
					v7_relativeSplatRoutes: true,
					v7_relativeSplatPath: true
				}}>		
				<ChangePageName />
					<Routes>
						<Route path="/" element={<Navigate to="/client" />} />
						<Route path="/service" element={<WsProvider><ServicePage /></WsProvider>} />
						<Route path="/database" element={<WsProvider><TablePage /></WsProvider>} />
						<Route path="/client" element={<ClientPage />} />
					</Routes>
			</Router>
		</ConfigProvider>
	);
}

export default App;