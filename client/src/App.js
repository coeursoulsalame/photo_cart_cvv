import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation  } from 'react-router-dom';

import { LicenseInfo } from '@mui/x-license-pro';
import { ThemeProvider } from '@mui/material/styles';

import { WsProvider } from './context/ws-Context';
import ServicePage from './components/servicePage/ServicePage';
import ClientPage from './components/clientPage/ClientPage';

import { CssBaseline } from '@mui/material';
import theme from './theme';

import { SnackbarProvider } from 'notistack';

LicenseInfo.setLicenseKey(
	'e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y'
);

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
		<ThemeProvider theme={theme}>
			<CssBaseline/>
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
		</ThemeProvider>
	);
}

export default App;