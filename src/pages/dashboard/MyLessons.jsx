import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { Edit2, Trash2, Eye, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SEO from '../../components/common/SEO';

const MyLessons = () => {
    const { user } = useAuth();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyLessons = async () => {
        try {
            const { data } = await api.get('/my-lessons', { params: { email: user?.email } });
            const list = Array.isArray(data) ? data : (data.lessons || data.data || []);
            const myLessons = list.filter(l =>
                l.creatorEmail === user?.email ||
                l.author?.email === user?.email ||
                l.authorEmail === user?.email
            );
            setLessons(myLessons);
        } catch (error) {
            console.error('Failed to fetch my lessons:', error);
            toast.error('Could not load your lessons.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMyLessons();
    }, [user]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/lessons/${id}`);
                setLessons(prev => prev.filter(l => l._id !== id && l.id !== id));
                Swal.fire('Deleted!', 'Your lesson has been deleted.', 'success');
            } catch (error) {
                console.error('Delete failed:', error);
                toast.error('Failed to delete lesson.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size={40} />
            </div>
        );
    }

    return (
        <div>
            <SEO title="My Lessons" description="Manage the lessons you have shared with the community." />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Lessons</h1>
                <Link
                    to={`${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.ADD_LESSON}`}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} />
                    Add New
                </Link>
            </div>

            {lessons.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 mb-4">You haven't shared any lessons yet.</p>
                    <Link
                        to={`${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.ADD_LESSON}`}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Share your first lesson
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Lesson Info</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stats</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Visibility</th>
                                    {user?.isPremium && <th className="px-6 py-4 text-sm font-semibold text-gray-600">Access</th>}
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lessons.map((lesson) => (
                                    <tr key={lesson._id || lesson.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={lesson.image || 'https://via.placeholder.com/40'}
                                                    alt=""
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900 line-clamp-1">{lesson.title}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(lesson.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span>❤️ {lesson.likesCount || 0} Likes</span>
                                                {/* <span>⭐ {lesson.savesCount || 0} Saves</span> */}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {lesson.visibility || 'public'}
                                            </span>
                                        </td>
                                        {user?.isPremium && (
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.accessLevel === 'premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                    {lesson.accessLevel || 'free'}
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={PATHS.LESSON_DETAILS.replace(':id', lesson._id || lesson.id)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    to={`${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.UPDATE_LESSON.replace(':id', lesson._id || lesson.id)}`}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(lesson._id || lesson.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLessons;
