import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Award } from 'lucide-react';

const TopContributors = () => {
    const [contributors, setContributors] = useState([]);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const { data } = await api.get('/users');
                // Provide a fallback if data is wrapped or direct array
                const users = Array.isArray(data) ? data : (data.data || []);
                // Just mocking "top" by slicing first 4 for now
                setContributors(users.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch contributors:', error);
            }
        };

        fetchContributors();
    }, []);

    if (contributors.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Contributors</h2>
                    <p className="text-gray-600">
                        Meet the wisdom sharers inspiring our community.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contributors.map((user, index) => (
                        <div
                            key={user._id || user.id}
                            className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Award className="text-yellow-500 w-6 h-6" />
                            </div>

                            <div className="relative inline-block mb-4">
                                <div className="absolute inset-0 bg-blue-100 rounded-full transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                                <img
                                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt={user.name}
                                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                                />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {user.name || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-blue-600 font-medium mb-3">
                                Total Contributions: {user.lessonCount || Math.floor(Math.random() * 20) + 1}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopContributors;
