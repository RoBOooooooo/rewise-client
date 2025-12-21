import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { PATHS } from '../routes/paths';

const AdminLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: `${PATHS.ADMIN.ROOT}/${PATHS.ADMIN.DASHBOARD}` },
        { icon: <Users size={20} />, label: 'Manage Users', path: `${PATHS.ADMIN.ROOT}/${PATHS.ADMIN.USERS}` },
        { icon: <BookOpen size={20} />, label: 'Manage Lessons', path: `${PATHS.ADMIN.ROOT}/${PATHS.ADMIN.LESSONS}` },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white border-r border-slate-800
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-800">
                        <Link to={PATHS.HOME} className="text-2xl font-bold text-white flex items-center gap-2">
                            Rewise<span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                        </Link>
                        <button onClick={closeSidebar} className="lg:hidden ml-auto text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Admin Controls</div>
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive(item.path)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
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
                <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-10">
                    <button onClick={toggleSidebar} className="text-gray-600 p-2 -ml-2">
                        <Menu size={24} />
                    </button>
                    <span className="ml-2 font-semibold text-gray-900">Admin Panel</span>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
