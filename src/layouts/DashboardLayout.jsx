import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, User, LogOut, Menu, X, Users, ShieldAlert, Home, Heart } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { PATHS } from '../routes/paths';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const isAdmin = user?.role === 'admin';

    // Dynamic Menu Items based on role
    const menuItems = isAdmin ? [
        { icon: <LayoutDashboard size={20} />, label: 'Admin Overview', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.ADMIN.ROOT}/${PATHS.ADMIN.DASHBOARD}` },
        { icon: <Users size={20} />, label: 'Manage Users', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.ADMIN.ROOT}/${PATHS.ADMIN.MANAGE_USERS}` },
        { icon: <BookOpen size={20} />, label: 'Manage Lessons', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.ADMIN.ROOT}/${PATHS.ADMIN.MANAGE_LESSONS}` },
        { icon: <ShieldAlert size={20} />, label: 'Reported Lessons', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.ADMIN.ROOT}/${PATHS.ADMIN.REPORTED_LESSONS}` },
        { icon: <User size={20} />, label: 'My Profile', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.PROFILE}` },
    ] : [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: PATHS.DASHBOARD.ROOT, exact: true },
        { icon: <PlusCircle size={20} />, label: 'Add Lesson', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.ADD_LESSON}` },
        { icon: <BookOpen size={20} />, label: 'My Lessons', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.MY_LESSONS}` },
        { icon: <Heart size={20} />, label: 'My Favorites', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.MY_FAVORITES}` },
        { icon: <User size={20} />, label: 'My Profile', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.PROFILE}` },
    ];

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
                        <Link to={PATHS.HOME} className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                            Rewise<span className="text-gray-500 dark:text-gray-400 text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full capitalize border border-gray-200 dark:border-gray-700">
                                {isAdmin ? 'Admin' : 'User'}
                            </span>
                        </Link>
                        <button onClick={closeSidebar} className="lg:hidden ml-auto text-gray-500 dark:text-gray-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {isAdmin ? 'Admin Controls' : 'User Menu'}
                        </div>
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive(item)
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                        <Link
                            to={PATHS.HOME}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Home size={20} />
                            Back to Home
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 sticky top-0 z-10 transition-colors duration-300">
                    <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-400 p-2 -ml-2">
                        <Menu size={24} />
                    </button>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">Dashboard</span>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
