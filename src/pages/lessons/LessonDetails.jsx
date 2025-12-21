import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { Loader2, ArrowLeft, Heart, Share2, Crown, User, Calendar, Bookmark, Flag, Eye, Clock, ShieldAlert, Star, CheckCircle, Download } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';

// Sub-components
import CommentsSection from '../../components/lessons/CommentsSection';
import SimilarLessons from '../../components/lessons/SimilarLessons';
import ReportModal from '../../components/lessons/ReportModal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LessonPDF from '../../components/lessons/LessonPDF';

const LessonDetails = () => {
    // ... existing state ...
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likeLoading, setLikeLoading] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    // Random view count for demo purposes as requested
    const [viewCount] = useState(Math.floor(Math.random() * 10000));

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
            toast.error('Please log in to like');
            navigate(PATHS.LOGIN);
            return;
        }

        // Optimistic UI Update
        const originalLikes = lesson.likes || [];
        const originalCount = lesson.likesCount || 0;
        const isLiked = originalLikes.includes(user._id);

        setLesson(prev => ({
            ...prev,
            likes: isLiked ? prev.likes.filter(uid => uid !== user._id) : [...prev.likes, user._id],
            likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1
        }));

        try {
            await api.post(`/lessons/${id}/like`);
        } catch (error) {
            console.error('Like failed', error);
            // Revert on failure
            setLesson(prev => ({
                ...prev,
                likes: originalLikes,
                likesCount: originalCount
            }));
            toast.error('Failed to update like');
        }
    };

    const handleFavorite = async () => {
        if (!user) {
            toast.error('Please login to save lessons');
            navigate(PATHS.LOGIN);
            return;
        }

        try {
            setLikeLoading(true);
            const { data } = await api.post(`/lessons/${id}/favorite`);
            await refreshUser(); // Sync local user state

            if (data.favorited) {
                toast.success('Added to favorites!');
            } else {
                toast.success('Removed from favorites.');
            }
        } catch (error) {
            console.error('Favorite toggle failed:', error);
            toast.error('Failed to update favorites');
        } finally {
            setLikeLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <SEO title="Loading Lesson..." />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            </>
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
    const hasAccess = !isPremiumContent || (user && user.isPremium);
    const isFavorited = user?.favorites?.includes(id);
    const isLiked = lesson.likes?.includes(user?._id);

    // Share URL
    const shareUrl = window.location.href;

    return (
        <div className="min-h-screen bg-white pb-20">
            <SEO
                title={lesson.title}
                description={lesson.description?.substring(0, 160)}
                image={lesson.image}
            />

            {/* 1. HERO SECTION */}
            <div className="relative h-[500px] w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                <img
                    src={lesson.image || `https://ui-avatars.com/api/?name=${lesson.title}&background=random`}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <Link
                            to={PATHS.ALL_LESSONS}
                            className="text-white/80 hover:text-white flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-colors hover:bg-white/20"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </Link>
                        <span className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
                            {lesson.category}
                        </span>
                        {isPremiumContent && (
                            <span className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-amber-500/20">
                                <Crown size={16} />
                                Premium
                            </span>
                        )}
                        {lesson.isFeatured && (
                            <span className="flex items-center gap-1 bg-yellow-400/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-yellow-400/20">
                                <Star size={16} className="fill-current" />
                                Featured
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl drop-shadow-sm">
                        {lesson.title}
                    </h1>

                    {/* 2. Metadata Block */}
                    <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-blue-400" />
                            <span>5 min read</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-blue-400" />
                            <span>{new Date(lesson.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye size={18} className="text-blue-400" />
                            <span>{viewCount.toLocaleString()} Views</span>
                        </div>
                        {/* Emotional Tone Badge */}
                        {lesson.emotionalTone && (
                            <span className="px-3 py-1 rounded-lg border border-white/30 text-xs uppercase tracking-wider text-white">
                                {lesson.emotionalTone}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT CONTENT COLUMN */}
                <div className="lg:col-span-8 space-y-12">

                    {/* PREMIUM GATE CHECK */}
                    {!hasAccess ? (
                        <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm p-8 bg-gray-50 text-center space-y-6">
                            <div className="absolute inset-0 backdrop-blur-xl bg-white/60 z-10 flex flex-col items-center justify-center p-8 text-center space-y-6">
                                <Crown size={64} className="text-amber-500 mb-2 drop-shadow-md" />
                                <h2 className="text-3xl font-bold text-gray-900">Premium Content</h2>
                                <p className="text-xl text-gray-600 max-w-lg">
                                    Unlock this lesson and get full access to all premium wisdom by upgrading your plan.
                                </p>
                                <Link
                                    to={PATHS.PRICING}
                                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                >
                                    Upgrade to Premium
                                </Link>
                            </div>
                            {/* Blurred Content Placeholder */}
                            <div className="blur-md select-none opacity-50 space-y-4 text-left">
                                <p className="h-4 bg-gray-300 rounded w-3/4"></p>
                                <p className="h-4 bg-gray-300 rounded w-full"></p>
                                <p className="h-4 bg-gray-300 rounded w-5/6"></p>
                                <p className="h-4 bg-gray-300 rounded w-4/5"></p>
                            </div>
                        </div>
                    ) : (
                        // FULL CONTENT
                        <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed font-serif">
                            {/* Standard text rendering, could be markdown if needed */}
                            {lesson.description.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    )}

                    {/* 5. Interaction Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 transform active:scale-95 border ${isLiked
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 shadow-sm'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Heart size={20} className={isLiked ? "fill-current" : ""} />
                                <span className="font-semibold">{lesson.likesCount || 0} Likes</span>
                            </button>

                            {/* Favorite Button */}
                            <button
                                onClick={handleFavorite}
                                disabled={likeLoading}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 border ${isFavorited
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Bookmark size={20} className={isFavorited ? "fill-current" : ""} />
                                <span className="font-semibold">{isFavorited ? 'Saved' : 'Save'}</span>
                            </button>
                        </div>

                        {/* Share & actions */}
                        <div className="flex items-center gap-3">
                            {/* PDF Download */}
                            <PDFDownloadLink
                                document={<LessonPDF lesson={lesson} />}
                                fileName={`${lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Loading PDF...' : (
                                        <>
                                            <Download size={16} /> {/* Reusing Share icon for generic export feel, or could use FileText */}
                                            <span>PDF</span>
                                        </>
                                    )
                                }
                            </PDFDownloadLink>

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                            {/* Social Share (react-share) */}
                            <div className="flex items-center gap-2">
                                <FacebookShareButton url={shareUrl} quote={lesson.title} className="hover:opacity-80 transition-opacity">
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={shareUrl} title={lesson.title} className="hover:opacity-80 transition-opacity">
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <LinkedinShareButton url={shareUrl} title={lesson.title} className="hover:opacity-80 transition-opacity">
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                            </div>

                            <button
                                onClick={() => setReportModalOpen(true)}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors tooltip ml-2"
                                title="Report this lesson"
                            >
                                <Flag size={20} />
                            </button>
                        </div>
                    </div>

                    {/* 6. Comment Section */}
                    <CommentsSection lessonId={id} />

                </div>

                {/* RIGHT SIDEBAR / AUTHOR COLUMN */}
                <div className="lg:col-span-4 space-y-8">
                    {/* 3. Author / Creator Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            About the Author
                        </h3>

                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4 group cursor-pointer">
                                <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src={lesson.author?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lesson.author?.name || 'Guest'}`}
                                    alt={lesson.author?.name}
                                    className="relative w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                                />
                            </div>

                            <div className="flex items-center gap-2 mb-1 justify-center">
                                <h4 className="text-xl font-bold text-gray-900">{lesson.author?.name || 'Anonymous Creator'}</h4>
                                {lesson.isReviewed && (
                                    <CheckCircle size={18} className="text-green-500 fill-green-50" title="Verified Creator" />
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mb-6">Expert Contributor</p>

                            <div className="w-full grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-3 text-center">
                                    <span className="block text-xl font-bold text-gray-900">12</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Lessons</span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 text-center">
                                    <span className="block text-xl font-bold text-gray-900">4.8k</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Followers</span>
                                </div>
                            </div>

                            <button className="w-full py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-900 hover:text-gray-900 transition-all">
                                View Profile
                            </button>
                        </div>
                    </div>

                    {/* 4. Stats & Engagement (Sidebar Block) */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Community Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Heart size={18} />
                                    <span>Likes</span>
                                </div>
                                <span className="font-bold text-xl">{lesson.likesCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Bookmark size={18} />
                                    <span>Favorites</span>
                                </div>
                                <span className="font-bold text-xl">342</span>
                                {/* Placeholder as per request "342 favorites" or dynamic if available */}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Eye size={18} />
                                    <span>Total Views</span>
                                </div>
                                <span className="font-bold text-xl">{viewCount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 7. Similar Lessons Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <SimilarLessons
                    currentLessonId={id}
                    category={lesson.category}
                    emotionalTone={lesson.emotionalTone}
                />
            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                lessonId={id}
                userId={user?._id}
            />

        </div>
    );
};

export default LessonDetails;
