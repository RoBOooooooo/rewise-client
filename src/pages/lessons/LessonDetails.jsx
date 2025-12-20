import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { Loader2, ArrowLeft, Heart, Share2, Crown, User, Calendar } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import toast from 'react-hot-toast';

const LessonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const { data } = await api.get(`/lessons/${id}`);
                setLesson(data);
            } catch (err) {
                console.error('Failed to fetch lesson details:', err);
                setError('Lesson not found or you do not have permission to view it.');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like lessons');
            navigate(PATHS.LOGIN);
            return;
        }
        // TODO: Implement like functionality API call
        toast.success('Liked! (Feature coming soon)');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error || 'Lesson not found'}</p>
                    <Link
                        to={PATHS.ALL_LESSONS}
                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                    >
                        <ArrowLeft size={20} />
                        Back to Lessons
                    </Link>
                </div>
            </div>
        );
    }

    const isPremiumContent = lesson.accessLevel === 'premium';
    // If we decided to enforce content hiding on frontend:
    // const canView = !isPremiumContent || (user && user.isPremium);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero / Header Image */}
            <div className="relative h-[400px] w-full">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src={lesson.image || `https://ui-avatars.com/api/?name=${lesson.title}&background=random`}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <Link
                        to={PATHS.ALL_LESSONS}
                        className="text-white/80 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Lessons
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {lesson.category}
                        </span>
                        {isPremiumContent && (
                            <span className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                <Crown size={14} />
                                Premium
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {lesson.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div className="flex items-center gap-2">
                            <img
                                src={lesson.author?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                alt={lesson.author?.name}
                                className="w-10 h-10 rounded-full border-2 border-white/50"
                            />
                            <span className="font-medium">{lesson.author?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                    {/* Actions Bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                                <Heart size={20} className={lesson.likes?.includes(user?._id) ? "fill-current" : ""} />
                                <span className="font-semibold">{lesson.likesCount || 0} Likes</span>
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success('Link copied to clipboard!');
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                <Share2 size={20} />
                                <span className="font-medium">Share</span>
                            </button>
                        </div>
                        {/* Could add bookmark or other actions here */}
                    </div>

                    {/* Main Text */}
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {lesson.description}
                    </div>

                    {/* Tag / Tone */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Emotional Tone</h3>
                        <div className="flex gap-2">
                            <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                                {lesson.emotionalTone || 'Neutral'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonDetails;
