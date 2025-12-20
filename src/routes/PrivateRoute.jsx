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
        // Redirect them to the /login page, but save the current location they were
        // trying to go to within the state prop, so we can send them back there 
        // after they login.
        return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
    }

    // If roles are defined and user doesn't have the required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Determine where to send unauthorized users
        // If they are logged in but just don't have permission (e.g. user trying to access admin)
        // Send to home or a specific unauthorized page
        return <Navigate to={PATHS.HOME} replace />;
    }

    return children;
};

export default PrivateRoute;
