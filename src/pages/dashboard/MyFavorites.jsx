import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Heart, ExternalLink, XCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { PATHS } from '../../routes/paths';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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

const MyFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [filteredFavorites, setFilteredFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', tone: '' });

    const fetchFavorites = async () => {
        try {
            const { data } = await api.get('/my-favorites');
            const list = data.lessons || [];
            setFavorites(list);
            setFilteredFavorites(list);
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
            // toast.error('Could not load favorites.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    useEffect(() => {
        let result = favorites;
        if (filter.category) {
            result = result.filter(l => l.category === filter.category);
        }
        if (filter.tone) {
            result = result.filter(l => l.emotionalTone === filter.tone);
        }
        setFilteredFavorites(result);
    }, [filter, favorites]);

    const handleRemoveFavorite = async (id) => {
        try {
            // Using the toggle endpoint to remove
            await api.post(`/lessons/${id}/favorite`);
            setFavorites(prev => prev.filter(lesson => (lesson._id || lesson.id) !== id));
            toast.success('Removed from favorites');
        } catch (error) {
            console.error('Remove failed:', error);
            toast.error('Failed to remove favorite');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <SEO title="My Favorites" description="Your collection of saved wisdom." />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="text-pink-500 fill-current" /> My Favorites
                </h1>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={filter.category}
                            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <select
                        value={filter.tone}
                        onChange={(e) => setFilter(prev => ({ ...prev, tone: e.target.value }))}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="">All Tones</option>
                        {TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                    </select>

                    {(filter.category || filter.tone) && (
                        <button
                            onClick={() => setFilter({ category: '', tone: '' })}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 mb-4">You haven't saved any lessons yet.</p>
                    <Link to={PATHS.ALL_LESSONS} className="text-blue-600 font-semibold hover:underline">
                        Explore Lessons
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Lesson Info</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category & Tone</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredFavorites.length > 0 ? (
                                    filteredFavorites.map((lesson) => (
                                        <tr key={lesson._id || lesson.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={lesson.image || 'https://via.placeholder.com/40'}
                                                        alt=""
                                                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900 line-clamp-1">{lesson.title}</div>
                                                        <div className="text-xs text-gray-500">By {lesson.author?.name || 'Unknown'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="flex flex-col gap-1">
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs w-fit font-medium">
                                                        {lesson.category}
                                                    </span>
                                                    {lesson.emotionalTone && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            • {lesson.emotionalTone}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={PATHS.LESSON_DETAILS.replace(':id', lesson._id || lesson.id)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                        title="View Lesson"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemoveFavorite(lesson._id || lesson.id)}
                                                        className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors border border-transparent hover:border-pink-100"
                                                        title="Remove from Favorites"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                            No recent favorites match your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyFavorites;
