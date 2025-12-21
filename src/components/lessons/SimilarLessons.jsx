import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PATHS } from '../../routes/paths';

const SimilarLessons = ({ currentLessonId, category, emotionalTone }) => {
    const [similarLessons, setSimilarLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilar = async () => {
            try {
                // Fetch all and filter client side for better matching based on request
                // Ideally this should be a dedicated endpoint like /lessons/similar/:id
                const { data } = await api.get('/lessons');
                const all = Array.isArray(data) ? data : (data.lessons || []);

                // Filter logic
                const filtered = all.filter(l =>
                    (l._id || l.id) !== currentLessonId && // Exclude current
                    (l.category === category || l.emotionalTone === emotionalTone)
                ).slice(0, 6); // Max 6

                setSimilarLessons(filtered);
            } catch (error) {
                console.error('Failed to fetch similar lessons:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentLessonId) fetchSimilar();
    }, [currentLessonId, category, emotionalTone]);

    if (loading || similarLessons.length === 0) return null;

    return (
        <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarLessons.map((lesson) => (
                    <Link
                        key={lesson._id || lesson.id}
                        to={PATHS.LESSON_DETAILS.replace(':id', lesson._id || lesson.id)}
                        className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col h-full"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={lesson.image || `https://ui-avatars.com/api/?name=${lesson.title}&background=random`}
                                alt={lesson.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow-sm">
                                {lesson.category}
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {lesson.title}
                            </h4>
                            <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
                                <span>{lesson.author?.name || 'Unknown'}</span>
                                <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SimilarLessons;
