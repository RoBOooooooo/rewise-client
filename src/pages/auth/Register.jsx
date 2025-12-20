import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';
import api from '../../services/api';
import { PATHS } from '../../routes/paths';
import { Mail, Lock, User, Image as ImageIcon, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photoURL: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        // basic validation
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            // 1. Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Update Firebase Profile
            await updateProfile(user, {
                displayName: formData.name,
                photoURL: formData.photoURL
            });

            // 3. Create user in MongoDB
            // We send the data to our backend to store user roles/etc.
            await api.post('/users', {
                name: formData.name,
                email: formData.email,
                image: formData.photoURL
            });

            toast.success('Registration successful! Welcome aboard.');
            navigate(PATHS.HOME); // Redirect to home or dashboard
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email is already registered');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Try to create user in backend (if they don't exist)
            // Note: Backend should handle "if exists, return user, else create" logic 
            // or we check existence first. For simplicity, we'll try to sync.
            await api.post('/users', {
                name: user.displayName,
                email: user.email,
                image: user.photoURL
            });

            toast.success('Registered with Google!');
            navigate(PATHS.HOME);
        } catch (error) {
            // If it fails, maybe they are already registered or backend issue.
            // We'll let them through as AuthContext will try to fetch /user/me
            console.error("Backend sync/create error (Google):", error);
            navigate(PATHS.HOME);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join Rewise and start your journey</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <ImageIcon size={18} />
                            </div>
                            <input
                                type="url"
                                name="photoURL"
                                value={formData.photoURL}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="https://example.com/me.jpg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <span className="animate-spin">⌛</span> : <UserPlus size={20} />}
                        Create Account
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleRegister}
                        type="button"
                        className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                        Sign up with Google
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to={PATHS.LOGIN} className="font-semibold text-blue-600 hover:text-blue-500">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
