import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation  } from 'react-router-dom';
import { ConfigProvider} from "antd";

import { WsProvider } from './context/ws-Context';
import ServicePage from './components/servicePage/ServicePage';
import ClientPage from './components/clientPage/ClientPage';

import { SnackbarProvider } from 'notistack';

import locale from 'antd/locale/ru_RU';
import 'dayjs/locale/ru.js';

function ChangePageName() {
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === '/service') {
			document.title = 'Сервис - Анализ оборота автоклавных вагонеток';
		} else if (location.pathname === '/client') {
			document.title = 'Клиент - Анализ оборота автоклавных вагонеток';
		}
	}, [location]);

	return null;
}

const App = () => {
	
	return (
		<ConfigProvider locale={locale}>
			<SnackbarProvider 
				maxSnack={3}
				anchorOrigin={{
					vertical: 'bottom',  
					horizontal: 'right',
				}}>
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
							<Route path="/client" element={<ClientPage />} />
						</Routes>
				</Router>
			</SnackbarProvider>	
		</ConfigProvider>
	);
}

export default App;