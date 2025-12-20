import { useEffect, useState } from 'react';
import api from '../../services/api';
import LessonCard from '../common/LessonCard';
import { Loader2 } from 'lucide-react';

const FeaturedLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                // Fetch all lessons then slice, or use query params if API supports it
                // Assuming GET /lessons returns { data: [...] } or [...]
                const { data } = await api.get('/lessons');
                // Provide a fallback if data is wrapped or direct array
                const lessonsData = Array.isArray(data)
                    ? data
                    : (data.lessons || data.data || []);
                setLessons(lessonsData.slice(0, 6)); // Display top 6
            } catch (error) {
                console.error('Failed to fetch featured lessons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    // Hide section if no lessons found (optional, but cleaner)
    if (lessons.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Life Lessons</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the most impactful stories shared by our community this week.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lessons.map((lesson) => (
                        <LessonCard key={lesson._id || lesson.id} lesson={lesson} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedLessons;
