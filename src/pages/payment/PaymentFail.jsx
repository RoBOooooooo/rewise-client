import { Link } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';
import { PATHS } from '../../routes/paths';

const PaymentFail = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <XCircle className="w-16 h-16 text-red-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
                <p className="text-gray-600 mb-8">
                    We couldn't process your payment. This might be due to insufficient funds or a card issue. No charges were made.
                </p>

                <div className="space-y-4">
                    <Link
                        to={PATHS.SUBSCRIPTION}
                        className="w-full py-3 px-6 rounded-xl bg-gray-900 text-white font-semibold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} /> Try Again
                    </Link>

                    <Link
                        to={PATHS.HOME}
                        className="block w-full text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;
