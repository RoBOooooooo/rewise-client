import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { BookOpen, Heart, Award, Clock } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const DashboardHome = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState({
        totalLessons: 0,
        likedLessons: 0,
    });
    const [recentLessons, setRecentLessons] = useState([]);
    const [chartData, setChartData] = useState({
        categoryData: [],
        likesData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all lessons (inefficient but works for MVP without specific backend endpoints)
                const { data } = await api.get('/lessons');
                const allLessons = Array.isArray(data) ? data : (data.lessons || []);

                // My Lessons
                const myLessons = allLessons.filter(l =>
                    l.creatorEmail === user?.email ||
                    l.author?.email === user?.email ||
                    l.authorEmail === user?.email
                );

                // Stats
                setStatsData({
                    totalLessons: myLessons.length,
                    likedLessons: 0 // Placeholder as we don't have this data easily yet
                });

                // Recent Lessons (User's latest 2)
                const sortedMyLessons = [...myLessons].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                if (sortedMyLessons.length > 0) {
                    setRecentLessons(sortedMyLessons.slice(0, 2));
                } else {
                    // Fallback: Show "Best" (Top liked public lessons)
                    const topLessons = [...allLessons]
                        .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
                        .slice(0, 2);
                    setRecentLessons(topLessons);
                }

                // Chart 1: Lessons by Category
                const categoryCounts = myLessons.reduce((acc, curr) => {
                    acc[curr.category] = (acc[curr.category] || 0) + 1;
                    return acc;
                }, {});
                const catData = Object.keys(categoryCounts).map(key => ({ name: key, value: categoryCounts[key] }));

                // Chart 2: Top Liked Lessons (Impact)
                const likesData = sortedMyLessons
                    .slice(0, 5)
                    .map(l => ({ name: l.title.substring(0, 10) + '...', likes: l.likesCount || 0 }));

                setChartData({ categoryData: catData, likesData });

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    const stats = [
        {
            label: 'Total Lessons',
            value: statsData.totalLessons,
            icon: <BookOpen className="text-white" size={24} />,
            color: 'bg-blue-500'
        },
        {
            label: 'Stories Liked',
            value: statsData.likedLessons, // This remains 0 for now
            icon: <Heart className="text-white" size={24} />,
            color: 'bg-rose-500'
        },
        {
            label: 'Member Since',
            value: new Date(user?.createdAt || Date.now()).toLocaleDateString(),
            icon: <Clock className="text-white" size={24} />,
            color: 'bg-purple-500'
        },
        {
            label: 'Plan',
            value: user?.isPremium ? 'Premium' : 'Free',
            icon: <Award className="text-white" size={24} />,
            color: user?.isPremium ? 'bg-yellow-500' : 'bg-gray-500'
        },
    ];

    const shortcuts = [
        { label: 'Create Lesson', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.ADD_LESSON}`, color: 'bg-blue-600 hover:bg-blue-700' },
        { label: 'Edit Profile', path: `${PATHS.DASHBOARD.ROOT}/${PATHS.DASHBOARD.PROFILE}`, color: 'bg-gray-800 hover:bg-gray-900' },
    ];

    return (
        <div>
            <SEO title="Dashboard" description="Overview of your learning progress on Rewise." />
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-500">Here's what's happening with your learning journey.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`${stat.color} p-3 rounded-lg shadow-md`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Recent / Best Lessons */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            {statsData.totalLessons > 0 ? 'Recently Added Lessons' : 'Top Rated on Rewise'}
                        </h2>

                        <div className="space-y-4">
                            {loading ? (
                                // Skeleton Loader
                                <>
                                    <div className="flex items-center gap-4 p-3 border border-gray-50 rounded-lg">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 border border-gray-50 rounded-lg">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                recentLessons.map((lesson) => (
                                    <div key={lesson._id || lesson.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-50">
                                        <img
                                            src={lesson.image || 'https://via.placeholder.com/40'}
                                            alt=""
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 line-clamp-1">{lesson.title}</h4>
                                            <p className="text-xs text-gray-500">
                                                {new Date(lesson.createdAt).toLocaleDateString()} • {lesson.category}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${lesson.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {lesson.visibility || 'Public'}
                                            </span>
                                            {lesson.likesCount > 0 && (
                                                <span className="text-xs text-rose-500 flex items-center gap-1">
                                                    <Heart size={10} fill="currentColor" /> {lesson.likesCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            {!loading && recentLessons.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No activity yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Charts Section */}
                    {statsData.totalLessons > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Chart 1: Category Distribution */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Focus Areas</h2>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData.categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center mt-2">
                                    {chartData.categoryData.map((entry, index) => (
                                        <div key={index} className="flex items-center gap-1 text-xs text-gray-500">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                            {entry.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chart 2: Lesson Performance (Likes) */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Top Impact</h2>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData.likesData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" hide />
                                            <YAxis allowDecimals={false} width={30} />
                                            <RechartsTooltip />
                                            <Bar dataKey="likes" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                                {chartData.likesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar / Shortcuts - Cleaned up */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            {shortcuts.map((action, i) => (
                                <Link
                                    key={i}
                                    to={action.path}
                                    className={`block w-full py-3 px-4 text-center text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${action.color}`}
                                >
                                    {action.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {!user?.isPremium && (
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Upgrade to Premium</h3>
                            <p className="text-blue-100 text-sm mb-4">Unlock exclusive features and unlimited access.</p>
                            <Link to={PATHS.SUBSCRIPTION} className="block w-full text-center py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                                View Plans
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
