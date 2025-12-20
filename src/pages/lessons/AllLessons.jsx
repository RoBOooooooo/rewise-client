import { useEffect, useState } from 'react';
import api from '../../services/api';
import LessonCard from '../../components/common/LessonCard';
import { Loader2, Filter } from 'lucide-react';

const AllLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    // We will add filter/search state in the next step (Step 17)

    useEffect(() => {
        const fetchLessons = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/lessons');
                // Handle { lessons: [...] } or { data: [...] } or direct array
                const list = Array.isArray(data) ? data : (data.lessons || data.data || []);
                setLessons(list);
            } catch (error) {
                console.error('Failed to fetch lessons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Life Lessons</h1>
                        <p className="text-gray-600">Browse wisdom shared by the community</p>
                    </div>

                    {/* Placeholder for Filter/Sort (Step 17) */}
                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                        <Filter size={18} />
                        <span>Filters & Sort</span>
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                    </div>
                ) : lessons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {lessons.map((lesson) => (
                            <LessonCard key={lesson._id || lesson.id} lesson={lesson} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-5xl mb-4">📚</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No lessons found</h3>
                        <p className="text-gray-500">Be the first to share your wisdom!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllLessons;
