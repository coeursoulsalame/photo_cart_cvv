import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../components/common/types/types';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    user: User | null;
}

interface AuthContextType {
    auth: AuthState;
    login: (token: string, user: User) => void;
    logout: () => void;
    hasRole: (roles: number | number[]) => boolean;
    getUserRolesText: (roleIds: number) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [auth, setAuth] = useState<AuthState>({ token: null, isAuthenticated: false, loading: true, user: null });

	const getUserRolesText = (roleIds: number): string => {
        if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0 || !auth.user?.roleRuName) {
            return 'Не указана';
        }
        
        if (auth.user.roleRuName) {
            return auth.user.roleRuName;
        }
        
        return 'Не указана';
    };

	const hasRole = (roles: number | number[]): boolean => {
		if (!auth.user?.roleId) return false;
		
		const userRole = auth.user.roleId;
		
		if (Array.isArray(roles)) {
			return roles.includes(userRole);
		}
		return userRole === roles;
	};

  	useEffect(() => {
		const token = Cookies.get('token-photochki');
		if (token) {
			axios.post('/api/token/verify', { token })
				.then(response => {
				if (response.status === 200) {
					setAuth({ token, isAuthenticated: true, loading: false, user: response.data.user });
					console.log(response.data.user);
				} else {
					setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
					Cookies.remove('token-photochki');
				}
			})
			.catch(error => {
				console.error('Verification error:', error);
				setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
				Cookies.remove('token-photochki');
			});
		} else {
			setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
		}
	}, []);

	const login = (token: string, user: User) => {
		Cookies.set('token-photochki', token );
		setAuth({ token, isAuthenticated: true, loading: false, user });
	};

	const logout = () => {
		Cookies.remove('token-photochki');
		setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
	};

	return (
		<AuthContext.Provider value={{ auth, login, logout, hasRole, getUserRolesText }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;