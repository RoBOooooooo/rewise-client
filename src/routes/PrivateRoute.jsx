import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PATHS } from './paths';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={PATHS.HOME} replace />;
    }

    return children;
};

export default PrivateRoute;
