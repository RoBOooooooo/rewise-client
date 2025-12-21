import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { Image as ImageIcon, BookOpen, Tag, Smile, Save, UploadCloud, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../utils/imageUpload';
import SEO from '../../components/common/SEO';

const CATEGORIES = [
    'Personal Growth',
    'Career',
    'Relationships',
    'Mindset',
    'Mistakes Learned',
    'Health & Wellness',
    'Finance',
    'Leadership'
];
const TONES = ['Happy', 'Sad', 'Motivational', 'Reflective', 'Humorous', 'Serious', 'Grateful'];

const UpdateLesson = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Image Handling
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORIES[0],
        emotionalTone: TONES[0],
        image: '',
        visibility: 'public',
        accessLevel: 'free'
    });

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const { data } = await api.get(`/lessons/${id}`);
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    category: data.category || CATEGORIES[0],
                    emotionalTone: data.emotionalTone || TONES[0],
                    image: data.image || '',
                    visibility: data.visibility || 'public',
                    accessLevel: data.accessLevel || 'free'
                });
                if (data.image) setPreviewUrl(data.image);
            } catch (error) {
                console.error('Failed to fetch lesson:', error);
                toast.error('Could not load lesson details.');
                navigate(`${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.MY_LESSONS}`);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        setFormData(prev => ({ ...prev, image: '' })); // Clear stored image URL if removing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Upload new image if selected
            let lessonImageUrl = formData.image;
            if (imageFile) {
                const uploadToast = toast.loading('Uploading new cover...');
                try {
                    lessonImageUrl = await uploadImage(imageFile);
                    toast.success('Image uploaded successfully!', { id: uploadToast });
                } catch (uploadError) {
                    toast.error('Image upload failed. Please try again.', { id: uploadToast });
                    setSubmitting(false);
                    return;
                }
            } else if (!previewUrl) {
                // If there's no preview URL, it means the user removed the image.
                lessonImageUrl = '';
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                emotionalTone: formData.emotionalTone,
                image: lessonImageUrl,
                visibility: formData.visibility,
                accessLevel: formData.accessLevel
            };

            await api.patch(`/lessons/${id}`, payload);
            toast.success('Lesson updated successfully!');
            navigate(`${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.MY_LESSONS}`);
        } catch (error) {
            console.error('Failed to update lesson:', error);
            toast.error('Failed to update lesson. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isPremiumUser = user?.isPremium;

    if (loading) return (
        <>
            <SEO title="Loading Lesson Update..." />
            <div className="p-10 text-center">Loading lesson details...</div>
        </>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <SEO title={`Update Lesson: ${formData.title}`} description="Edit your lesson content." />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Update Lesson</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g., The Art of Mindfulness"
                        />
                    </div>

                    {/* Image Upload - Wide Single Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>

                        {previewUrl ? (
                            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
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
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Select a category...</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Emotional Tone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Emotional Tone</label>
                            <select
                                name="emotionalTone"
                                value={formData.emotionalTone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Select a tone...</option>
                                {TONES.map(tone => (
                                    <option key={tone} value={tone}>{tone}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Visibility & Access */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        {/* Visibility */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                            <select
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        {/* Access Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Access Level
                                {!isPremiumUser && <span className="text-xs text-amber-600 ml-2">(Premium Users Only)</span>}
                            </label>
                            <select
                                name="accessLevel"
                                value={formData.accessLevel}
                                onChange={handleChange}
                                disabled={!isPremiumUser}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows="6"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                            placeholder="I learned the hard way that intentions matter..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Update Lesson
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default UpdateLesson;
