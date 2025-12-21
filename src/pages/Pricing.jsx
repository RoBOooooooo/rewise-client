import { useState } from 'react';
import { Check, Star, Shield, Zap } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import SEO from '../components/common/SEO';

const Pricing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!user) {
            toast.error('Please login to subscribe');
            navigate(PATHS.LOGIN);
            return;
        }

        setLoading(true);
        try {
            // 1. Call backend to create Stripe Checkout Session
            const { data } = await api.post('/create-checkout-session', {
                planId: 'premium-monthly' // Example plan ID
            });

            // 2. Redirect to Stripe Checkout URL provided by backend
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error('Failed to initiate checkout. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SEO title="Pricing" description="Invest in your wisdom. Choose a plan that fits your learning journey." />
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Invest in Your Wisdom</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Unlock the full potential of Rewise with our Premium membership. Get exclusive access to detailed analytics, premium lessons, and more.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-md transition-shadow">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <p className="text-gray-500 mt-4">Perfect for getting started with life lessons.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3">
                                <Check className="text-green-500 flex-shrink-0" size={20} />
                                <span className="text-gray-600">Read unlimited free lessons</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="text-green-500 flex-shrink-0" size={20} />
                                <span className="text-gray-600">Create up to 3 lessons per month</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="text-green-500 flex-shrink-0" size={20} />
                                <span className="text-gray-600">Basic profile customization</span>
                            </li>
                        </ul>

                        <button
                            className="w-full py-3 px-6 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 transition-colors"
                            disabled
                        >
                            {loading ? 'Processing...' : user?.isPremium ? 'Your Previous Plan' : 'Your Current Plan'}
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-600 p-8 flex flex-col relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            RECOMMENDED
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                Premium <Star className="fill-yellow-400 text-yellow-400" size={20} />
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <p className="text-gray-500 mt-4">For those serious about personal growth.</p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3">
                                <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                                    <Check size={14} />
                                </div>
                                <span className="text-gray-700 font-medium">Everything in Basic</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                                    <Shield size={14} />
                                </div>
                                <span className="text-gray-700 font-medium">Read Premium-only lessons</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                                    <Zap size={14} />
                                </div>
                                <span className="text-gray-700 font-medium">Create unlimited lessons</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-blue-100 p-1 rounded-full text-blue-600">
                                    <Star size={14} />
                                </div>
                                <span className="text-gray-700 font-medium">Priority support & Verified Badge</span>
                            </li>
                        </ul>

                        <button
                            onClick={handleSubscribe}
                            disabled={loading || (user && user.isPremium)}
                            className="w-full py-4 px-6 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : user?.isPremium ? 'Currently Active' : 'Upgrade Now'}
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-3">Secure payment via Stripe. Cancel anytime.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
