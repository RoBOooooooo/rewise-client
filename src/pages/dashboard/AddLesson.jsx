import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { PATHS } from '../../routes/paths';
import { UploadCloud, Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../utils/imageUpload';
import SEO from '../../components/common/SEO';
import Lottie from 'lottie-react';

const AddLesson = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Free Lottie JSON for Success (Checkmark)
    // Using a reliable public URL or embedded small JSON would be safer. 
    // I will use a direct fetch or just embed a very simple success animation if possible, 
    // but typically lottie-react needs an object.
    // I will fetch a simpler one or use a placeholder if fetch fails? 
    // Actually, lottie-react supports `path` prop for specific URL. 
    // Let's use a common one from LottieFiles CDN.
    const successAnimationUrl = "https://assets9.lottiefiles.com/packages/lf20_9kdsfm.json"; // Basic green checkmark

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        description: '', // Changed from content to description per user request
        category: '',
        emotionalTone: '',
        visibility: 'public',
        accessLevel: 'free'
    });

    // Image Handling
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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

    const removeImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Image (ImgBB)
            let lessonImageUrl = '';
            // User requested explicit toast for image upload status
            if (imageFile) {
                const uploadToast = toast.loading('Uploading cover image...');
                try {
                    lessonImageUrl = await uploadImage(imageFile);
                    toast.success('Image uploaded successfully!', { id: uploadToast });
                } catch (uploadError) {
                    toast.error('Image upload failed.', { id: uploadToast });
                    setLoading(false);
                    return; // Stop execution
                }
            }

            // 2. Prepare Payload
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                emotionalTone: formData.emotionalTone,
                image: lessonImageUrl,
                visibility: formData.visibility,
                accessLevel: formData.accessLevel,
                authorEmail: user.email,
                authorName: user.displayName || user.name,
                // author: user._id || user.uid // Include if needed by backend schema
            };

            // 3. Send to Backend
            await api.post('/lessons', payload);

            // 4. Show Success Animation
            setShowSuccessModal(true);

            // Navigate after 3 seconds
            setTimeout(() => {
                toast.success('Lesson created successfully!');
                navigate(`${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.MY_LESSONS}`);
            }, 3000);

        } catch (error) {
            console.error('Create lesson error:', error);
            toast.error(error.message || 'Failed to create lesson');
            setLoading(false); // Only stop loading on error, otherwise keep it during success anim
        }
        // Finally block removed to manually handle loading state transition to success
    };

    const isPremiumUser = user?.isPremium;

    // Fetch animation data on mount or usage? 
    // Lottie component with `path` handles fetching automatically.

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <SEO title="Add New Lesson" description="Create a new lesson on Rewise" />

            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300 max-w-sm w-full mx-4">
                        <div className="w-48 h-48">
                            <Lottie
                                path={successAnimationUrl}
                                loop={false}
                                autoplay={true}
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Lesson Created!</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center">Redirecting you to your lessons...</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Lesson</h1>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-colors">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g., The Art of Mindfulness"
                        />
                    </div>

                    {/* Image Upload - Wide Single Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>

                        {previewUrl ? (
                            <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                            </label>
                        )}
                    </div>

                    {/* Category & Tone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select a category...</option>
                                {['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned', 'Health & Wellness', 'Finance', 'Leadership'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Emotional Tone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emotional Tone</label>
                            <select
                                name="emotionalTone"
                                value={formData.emotionalTone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select a tone...</option>
                                {['Happy', 'Sad', 'Motivational', 'Reflective', 'Humorous', 'Serious', 'Grateful'].map(tone => (
                                    <option key={tone} value={tone}>{tone}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Visibility & Access */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                        {/* Visibility */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
                            <select
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        {/* Access Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Access Level
                                {!isPremiumUser && <span className="text-xs text-amber-600 ml-2">(Premium Users Only)</span>}
                            </label>
                            <select
                                name="accessLevel"
                                value={formData.accessLevel}
                                onChange={handleChange}
                                disabled={!isPremiumUser}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows="6"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                            placeholder="I learned the hard way that intentions matter..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Create Lesson
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default AddLesson;
