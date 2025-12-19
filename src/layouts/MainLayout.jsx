import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <Toaster position="top-center" />
        </div>
    );
};

export default MainLayout;
