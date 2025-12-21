import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';
import { syncUserWithBackend } from '../../services/api';
import { PATHS } from '../../routes/paths';
import { Mail, Lock, User, UploadCloud, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../utils/imageUpload';
import useAuth from '../../hooks/useAuth';
import SEO from '../../components/common/SEO';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshUser } = useAuth();

    // Strict Redirect Logic
    const from = location.state?.from?.pathname || PATHS.DASHBOARD.ROOT;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            // 1. Upload Image (ImgBB)
            let photoURL = '';
            if (imageFile) {
                const uploadToast = toast.loading('Uploading profile picture...');
                try {
                    photoURL = await uploadImage(imageFile);
                    toast.dismiss(uploadToast);
                } catch (err) {
                    toast.dismiss(uploadToast);
                    console.error("Image upload error", err);
                    toast.error('Image upload failed, creating account without image.');
                }
            }

            // 2. Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 3. Update Firebase Profile
            await updateProfile(user, {
                displayName: formData.name,
                photoURL: photoURL
            });
            // Force reload to update auth.currentUser
            await user.reload();

            // 4. API Sync (Required by Spec v1.1.0)
            await syncUserWithBackend(auth.currentUser);

            // 5. Refresh Auth Context to pull the new DB user
            await refreshUser();

            toast.success('Account created successfully!');
            navigate(from, { replace: true });

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            await syncUserWithBackend(user);
            await refreshUser();

            toast.success('Logged in with Google!');
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            toast.error('Google login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <SEO title="Create Account" description="Join Rewise community and start sharing your wisdom." />
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-gray-600">Join our community of learners</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John Doe"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="you@example.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                <div className="relative group overflow-hidden w-16 h-16 rounded-full border border-gray-200 bg-gray-50 flex-shrink-0">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>
                                <label className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <UploadCloud size={18} className="mr-2 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Upload Photo</span>
                                    </div>
                                    <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" disabled={loading} />
                                </label>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    minLength={6}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            'Create Account'
                        )}
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

                    <div className="mt-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                            Register with Google
                        </button>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to={PATHS.LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        {location.state?.from ? 'We will redirect you back to your previous page.' : ''}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
