import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';

const PaymentSuccess = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. Your subscription is now active and you have full access to all premium features.
                </p>

                <div className="space-y-4">
                    <Link
                        to={PATHS.DASHBOARD.ROOT}
                        className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        Go to Dashboard <ArrowRight size={20} />
                    </Link>

                    <Link
                        to={PATHS.ALL_LESSONS}
                        className="block w-full text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Browse Lessons
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
