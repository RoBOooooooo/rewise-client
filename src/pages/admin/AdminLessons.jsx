import { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Loader2, Filter, ExternalLink, BookOpen, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import SEO from '../../components/common/SEO';

const AdminLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, premium, free
    const [filterVisibility, setFilterVisibility] = useState('all'); // all, public, private
    const [filterCategory, setFilterCategory] = useState('all');

    // Stats
    const stats = {
        total: lessons.length,
        public: lessons.filter(l => l.visibility === 'public').length,
        private: lessons.filter(l => l.visibility === 'private').length,
        premium: lessons.filter(l => l.accessLevel === 'premium').length
    };

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const { data } = await api.get('/lessons');
                const list = Array.isArray(data) ? data : (data.lessons || data.data || []);
                setLessons(list);
            } catch (error) {
                console.error('Failed to fetch lessons:', error);
                toast.error('Failed to load lessons.');
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    const filteredLessons = lessons.filter(lesson => {
        const title = lesson.title || '';
        const authorEmail = lesson.authorEmail || '';
        const category = lesson.category || '';
        const visibility = lesson.visibility || 'public';
        const accessLevel = lesson.accessLevel || 'free';

        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            authorEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' ||
            (filterType === 'premium' ? accessLevel === 'premium' : accessLevel === 'free');

        const matchesVisibility = filterVisibility === 'all' || visibility === filterVisibility;

        const matchesCategory = filterCategory === 'all' || category === filterCategory;

        return matchesSearch && matchesType && matchesVisibility && matchesCategory;
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete this lesson?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/lessons/${id}`);
                    toast.success('Lesson deleted');
                    setLessons(lessons.filter(l => (l._id || l.id) !== id));
                } catch (error) {
                    toast.error('Failed to delete lesson');
                }
            }
        });
    };

    const toggleFeatured = async (lesson) => {
        try {
            const isFeatured = !lesson.isFeatured;
            // Assuming endpoint for updating generic fields or specific feature toggle
            // Using PATCH /lessons/:id for general update if available, or simulate
            await api.patch(`/lessons/${lesson._id}`, { isFeatured });

            setLessons(lessons.map(l => l._id === lesson._id ? { ...l, isFeatured } : l));
            toast.success(isFeatured ? 'Lesson marked as featured' : 'Lesson removed from featured');
        } catch (error) {
            console.error('Feature toggle failed:', error);
            toast.error('Could not update status');
        }
    };

    const markReviewed = async (lesson) => {
        if (lesson.isReviewed) return;
        try {
            await api.patch(`/lessons/${lesson._id}`, { isReviewed: true });

            setLessons(lessons.map(l => l._id === lesson._id ? { ...l, isReviewed: true } : l));
            toast.success('Lesson marked as reviewed');
        } catch (error) {
            toast.error('Could not mark as reviewed');
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-6">
            <SEO title="Manage Lessons" description="Admin Lesson Management" />

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Manage Lessons</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <span className="text-gray-500 text-xs font-semibold uppercase">Total</span>
                        <div className="text-xl font-bold text-gray-900">{stats.total}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <span className="text-gray-500 text-xs font-semibold uppercase">Public</span>
                        <div className="text-xl font-bold text-green-600">{stats.public}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <span className="text-gray-500 text-xs font-semibold uppercase">Private</span>
                        <div className="text-xl font-bold text-gray-600">{stats.private}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <span className="text-gray-500 text-xs font-semibold uppercase">Premium</span>
                        <div className="text-xl font-bold text-amber-600">{stats.premium}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer text-sm"
                    >
                        <option value="all">All Categories</option>
                        {['Tech', 'Language', 'Science', 'Arts', 'Lifestyle', 'Business'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={filterVisibility}
                        onChange={(e) => setFilterVisibility(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer text-sm"
                    >
                        <option value="all">All Visibility</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer text-sm"
                    >
                        <option value="all">All Access</option>
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLessons.map((lesson) => (
                                <tr key={lesson._id || lesson.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                                {lesson.image ? (
                                                    <img src={lesson.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <BookOpen size={18} className="text-gray-400" />
                                                )}
                                                {lesson.isFeatured && (
                                                    <div className="absolute top-0 right-0 p-0.5 bg-yellow-400">
                                                        <Star size={8} className="text-white fill-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 line-clamp-1 flex items-center gap-1">
                                                    {lesson.title}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">{lesson.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {lesson.authorEmail || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <div className="flex gap-1.5">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize 
                                                ${lesson.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {lesson.visibility || 'Public'}
                                                </span>
                                                {lesson.accessLevel === 'premium' && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800">
                                                        Premium
                                                    </span>
                                                )}
                                            </div>
                                            {lesson.isReviewed && (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-medium">
                                                    <CheckCircle size={10} /> Reviewed
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => toggleFeatured(lesson)}
                                                className={`p-2 rounded-lg transition-colors ${lesson.isFeatured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50'}`}
                                                title={lesson.isFeatured ? "Remove Featured" : "Make Featured"}
                                            >
                                                <Star size={16} className={lesson.isFeatured ? "fill-yellow-500" : ""} />
                                            </button>

                                            <button
                                                onClick={() => markReviewed(lesson)}
                                                className={`p-2 rounded-lg transition-colors ${lesson.isReviewed ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-green-600 hover:bg-gray-50'}`}
                                                title="Mark Reviewed"
                                                disabled={lesson.isReviewed}
                                            >
                                                <CheckCircle size={16} />
                                            </button>

                                            <Link
                                                to={PATHS.LESSON_DETAILS.replace(':id', lesson._id || lesson.id)}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <ExternalLink size={16} />
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(lesson._id || lesson.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Lesson"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLessons;
