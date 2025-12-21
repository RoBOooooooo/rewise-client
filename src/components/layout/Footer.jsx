import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import rewiseLogo from '../../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 group">
                            <div className="bg-blue-600 rounded-xl text-white">
                                <img src={rewiseLogo} alt="Rewise logo" className='w-8 h-8' />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                                Rewise
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Empowering individuals to share, discover, and learn from real-life experiences. Join our community of wisdom seekers today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Home</Link></li>
                            <li><Link to="/lessons" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Browse Lessons</Link></li>
                            <li><Link to="/login" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Login</Link></li>
                            <li><Link to="/register" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Get Started</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-gray-500">
                                <Mail size={16} className="text-blue-600" />
                                <span>support@rewise.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-500">
                                <Phone size={16} className="text-blue-600" />
                                <span>+880 1721 602071</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-500">
                                <MapPin size={16} className="text-blue-600" />
                                <span>Shamimabad, Sylhet, Bangladesh</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / Social */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-blue-400 hover:border-blue-200 transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-pink-600 hover:border-pink-200 transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-blue-700 hover:border-blue-200 transition-all">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Rewise. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
