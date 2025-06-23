import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

interface PrivateRouteProps {
	children: React.ReactNode;
	allowedRoles?: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
	const context = useContext(AuthContext);
	const location = useLocation();

	if (!context) {
		return <Navigate to="/auth" state={{ from: location }} replace />;
	}

	const { auth, hasRole } = context;

	if (auth.loading) {
		return null;
	}

	if (!auth.isAuthenticated) {
		return <Navigate to="/auth" state={{ from: location }} replace />;
	}

	if (allowedRoles && allowedRoles.length > 0) {
		if (!hasRole(allowedRoles)) {
			return <Navigate to="/" replace />;
		}
	}

	return <>{children}</>;
};

export default PrivateRoute;