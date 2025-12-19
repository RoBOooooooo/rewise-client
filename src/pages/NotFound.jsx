import { Link } from 'react-router-dom';
import { Home, MoveLeft } from 'lucide-react';
import { PATHS } from '../routes/paths';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-blue-50 p-6 rounded-full mb-8 animate-bounce">
                <span className="text-6xl">🛸</span>
            </div>

            <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
                Oops! The wisdom you are looking for seems to have drifted into a black hole.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to={PATHS.HOME}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-medium"
                >
                    <Home size={20} />
                    Go Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                    <MoveLeft size={20} />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;
