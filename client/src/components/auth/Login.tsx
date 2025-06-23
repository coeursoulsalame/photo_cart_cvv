import React, { useContext, useState } from 'react';
import { Form, Input, Button, Row, Col, Card, AutoComplete, notification } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import debounce from 'lodash/debounce';
import { useUserSearch } from '../common/hooks/useUserSearch';
import { User } from '../common/types/types';

const { Item } = Form;

interface LoginFormValues {
	login: string;
	password: string;
}

const Login: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const context = useContext(AuthContext);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [searchValue, setSearchValue] = useState<string>('');
	const { users = [], loading: usersLoading, searchUsers } = useUserSearch();

	if (!context) {
		return null;
	}
	
	const { login: authLogin } = context;

	const from = location.state?.from?.pathname || "/";

	const debouncedFetch = debounce(searchUsers, 300);

	const handleSubmit = async (values: LoginFormValues) => {
		if (!selectedUser) {
			notification.warning({
				message: 'Необходимо выбрать пользователя',
				placement: 'bottomRight',
				closeIcon: false
			});
			return;
		}

		try {
			const response = await axios.post('/api/auth/login', {
				id: Number(selectedUser.id),
				login: selectedUser.login,
				password: values.password,
				email: selectedUser.email,
				name: selectedUser.name
			});

			if (response.data) {
				const { user, token } = response.data;
				authLogin(token, user);
				notification.success({
					message: 'Вход выполнен успешно',
					placement: 'bottomRight',
					closeIcon: false
				});
				navigate(from, { replace: true });
			}
		} catch (error: any) {
			notification.error({
				message: error.response.data.details,
				placement: 'bottomRight',
				closeIcon: false
			});
		}
	};

	const handleSearch = (text: string) => {
		setSearchValue(text);
		
		if (text.length >= 2) {
			debouncedFetch(text);
		} else {
			setSelectedUser(null);
		}
	};

	const options = users.map((user, index) => ({
		key: `${user.id}-${index}`,
		label: `${user.name}`,
		value: user.name,
		user: user,
	}));

	return (
		<Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#edf1f7' }}>
			<Col span={6}>
				<Card title="Вход">
					<Form onFinish={handleSubmit}>
						<Item
							name="login"
							rules={[{ required: true, message: 'Пожалуйста, введите ФИО пользователя!' }]}
						>
							<AutoComplete
								placeholder="Введите ФИО пользователя"
								value={searchValue}
								onSearch={handleSearch}
								onChange={(value, option) => {
									setSearchValue(value);
									if (option && typeof option === 'object' && 'user' in option) {
										setSelectedUser(option.user as User);
										console.log('Selected user object:', option.user);
									} else if (!value) {
										setSelectedUser(null);
									}
								}}
								options={options}
								notFoundContent={usersLoading}
							/>
						</Item>

						<Item
							name="password"
							rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
						>
							<Input.Password 
								placeholder="Введите пароль"
								autoComplete="new-password"
							/>
						</Item>

						<Item style={{justifyContent: 'flex-end'}}>
							<Button 
								type="primary" 
								htmlType="submit" 
								block
								disabled={usersLoading}
							>
								Войти
							</Button>
						</Item>
					</Form>
				</Card>
			</Col>
		</Row>
	);
};

export default Login;