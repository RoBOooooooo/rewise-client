import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { PATHS } from "./paths";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    // Check if user is logged in AND is an admin
    if (user && user.role === 'admin') {
        return children;
    }

    // If logged in but not admin, redirect to user dashboard
    if (user) {
        return <Navigate to={PATHS.DASHBOARD.ROOT} replace />;
    }

    // If not logged in, redirect to login
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
};

export default AdminRoute;
