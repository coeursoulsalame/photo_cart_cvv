import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'; 
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import useInsertService from './hooks/useInsertService';

dayjs.locale('ru');

const ServiceModal = ({onClose, open}) => {

	const { sendServiceData } = useInsertService();

	const [wagonNumber, setWagonNumber] = useState('');
	const [serviceType, setServiceType] = useState('');
	const [startDateTime, setStartDateTime] = useState(null);
	const [endDateTime, setEndDateTime] = useState(null);

	const handleWagonNumberChange = (event) => {
		setWagonNumber(event.target.value);
	};

	const handleServiceTypeChange = (event) => {
		setServiceType(event.target.value);
	};

	const handleSubmit = async () => {
		const selectedServiceType = serviceTypes.find((service) => service.id === serviceType);

		const serviceTypeId = selectedServiceType ? selectedServiceType.id : null;

		try {
		const response = await sendServiceData(
			wagonNumber,
			startDateTime ? dayjs(startDateTime).format('DD.MM.YYYY HH:mm') : '',
			endDateTime ? dayjs(endDateTime).format('DD.MM.YYYY HH:mm') : '',
			serviceTypeId
		);
			console.log('Ответ от сервера:', response);
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	const wagonNumbers = Array.from({ length: 99 }, (_, index) => ({
		id: String(index + 1).padStart(2, '0'),
		label: `${String(index + 1).padStart(2, '0')}`,
	}));

	const serviceTypes = [
		{ id: 1, label: 'Осмотр' },
		{ id: 2, label: 'Замена подшипников' },
		{ id: 3, label: 'Аварийная замена подшипников' },
	];

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle id="service-modal-title">Форма обслуживания</DialogTitle>
			<DialogContent>
				<Box sx={{ width: 400, padding: 2 }}>
					<FormControl fullWidth sx={{ mb: 4 }} size="small">
						<InputLabel id="wagon-number-label">Номер вагонетки</InputLabel>
						<Select
							labelId="wagon-number-label"
							value={wagonNumber}
							onChange={handleWagonNumberChange}
							label="Номер вагонетки"
							MenuProps={{
								PaperProps: {
								style: {
									maxHeight: 300,
									overflow: 'auto',
								},
								},
							}}
						>
						{wagonNumbers.map((wagon) => (
							<MenuItem key={wagon.id} value={wagon.id}>
								{wagon.label}
							</MenuItem>
						))}
						</Select>
					</FormControl>

					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
						<DateTimePicker
							label="Дата начала"
							value={startDateTime}
							onChange={(newValue) => setStartDateTime(newValue)}
							slotProps={{
								textField: {
								fullWidth: true,
								size: 'small',
								sx: { mb: 4 },
								},
								popper: {
								container: document.body, 
								},
							}}
						/>
						<DateTimePicker
							label="Дата окончания"
							value={endDateTime}
							onChange={(newValue) => setEndDateTime(newValue)}
							slotProps={{
								textField: {
                                    fullWidth: true,
                                    size: 'small',
								    sx: { mb: 4 },
								},
								popper: {
                                    container: document.body, 
								},
							}}
						/>
					</LocalizationProvider>

					<FormControl fullWidth sx={{ mb: 4 }} size="small">
						<InputLabel id="service-type-label">Вариант обслуживания</InputLabel>
						<Select
							labelId="service-type-label"
							value={serviceType}
							onChange={handleServiceTypeChange}
							label="Вариант обслуживания"
							>
							{serviceTypes.map((service) => (
								<MenuItem key={service.id} value={service.id}>
									{service.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</DialogContent>

			<DialogActions>
				<Button variant="outlined" onClick={onClose}>
				Закрыть
				</Button>
				<Button variant="contained" color="success" onClick={handleSubmit}>
				Сохранить
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ServiceModal;