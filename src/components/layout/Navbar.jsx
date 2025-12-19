import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, LogIn, UserPlus } from 'lucide-react';
import { PATHS } from '../../routes/paths';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // TODO: Replace with actual auth context later
    const user = null;
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: PATHS.HOME },
        { name: 'Lessons', path: PATHS.ALL_LESSONS },
    ];

    const isActiveLink = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to={PATHS.HOME} className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-2 rounded-xl text-white transition-transform group-hover:scale-110">
                            <Rocket size={20} />
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
                                        ? 'text-blue-600'
                                        : 'text-gray-600 hover:text-blue-600'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <Link to={PATHS.DASHBOARD.ROOT} className="flex items-center gap-2">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    alt="User"
                                    className="h-8 w-8 rounded-full border border-gray-200"
                                />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to={PATHS.LOGIN}
                                    className="text-gray-600 hover:text-blue-600 font-medium text-sm flex items-center gap-2"
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
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-blue-600 p-2 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute w-full bg-white border-b border-gray-100 shadow-xl">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-3 rounded-lg text-base font-medium ${isActiveLink(link.path)
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-gray-100 my-2"></div>
                        {!user && (
                            <div className="space-y-3 pt-2">
                                <Link
                                    to={PATHS.LOGIN}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50"
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
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
