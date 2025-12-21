import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut, Moon, Sun } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import rewiseLogo from '../../assets/logo.png';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: PATHS.HOME },
        { name: 'Lessons', path: PATHS.ALL_LESSONS },
        { name: 'Pricing', path: PATHS.SUBSCRIPTION },
    ];

    const isActiveLink = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await logout();
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to={PATHS.HOME} className="flex items-center gap-2 group">
                        <div className="bg-blue-600 rounded-xl text-white transition-transform group-hover:scale-110">
                            <img src={rewiseLogo} alt="Rewise logo" className='w-8 h-8' />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                            Rewise
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${isActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons & Theme Toggle */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to={PATHS.DASHBOARD.ROOT}
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 focus:outline-none">
                                        <img
                                            src={user.photo || user.image || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                            alt="User"
                                            className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                        />
                                    </button>
                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all transform origin-top-right z-50">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.displayName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            to={`${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.PROFILE}`}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to={PATHS.LOGIN}
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm flex items-center gap-2"
                                >
                                    <LogIn size={18} />
                                    Login
                                </Link>
                                <Link
                                    to={PATHS.REGISTER}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                >
                                    <UserPlus size={18} />
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {/* Mobile Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 p-2 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-3 rounded-lg text-base font-medium ${isActiveLink(link.path)
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user && (
                            <Link
                                to={PATHS.DASHBOARD.ROOT}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Dashboard
                            </Link>
                        )}

                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>

                        {!user ? (
                            <div className="space-y-3 pt-2">
                                <Link
                                    to={PATHS.LOGIN}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <LogIn size={18} />
                                    Login
                                </Link>
                                <Link
                                    to={PATHS.REGISTER}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md"
                                >
                                    <UserPlus size={18} />
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3 pt-2">
                                <div className="px-3 py-2 flex items-center gap-3">
                                    <img
                                        src={user.photo || user.image || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                        alt="User"
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/20"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
