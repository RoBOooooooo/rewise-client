import { useState, useEffect } from 'react';
import { Users, BookOpen, ShieldAlert, Award, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

import useAuth from '../../hooks/useAuth';

const AdminDashboardHome = () => {
    const { user: currentUser } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLessons: 0,
        totalReported: 0,
        activeContributors: 0
    });
    const [loading, setLoading] = useState(true);
    const [graphData, setGraphData] = useState({
        userGrowth: [],
        lessonGrowth: []
    });
    const [recentData, setRecentData] = useState({
        contributors: [],
        newLessons: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Data from available endpoints
                const [usersRes, lessonsRes, reportsRes] = await Promise.allSettled([
                    api.get('/admin/users'), // From AdminUsers.jsx
                    api.get('/lessons'),      // General lessons
                    api.get('/admin/reports') // From ReportedLessons.jsx
                ]);

                // Process Users
                const users = usersRes.status === 'fulfilled' ? (usersRes.value.data.data || usersRes.value.data || []) : [];
                // Process Lessons
                const lessons = lessonsRes.status === 'fulfilled' ? (lessonsRes.value.data.lessons || lessonsRes.value.data || []) : [];
                // Process Reports
                const reports = reportsRes.status === 'fulfilled' ? (reportsRes.value.data.reports || reportsRes.value.data || []) : [];

                // 1. Calculate Stats
                const totalUsers = users.length;
                const totalLessons = lessons.length;
                const totalReported = reports.length;

                // Active Contributors (Unique Authors from Lessons)
                const authorCounts = lessons.reduce((acc, lesson) => {
                    const email = lesson.authorEmail || lesson.author?.email || 'unknown';
                    // Skip if the email matches current admin
                    if (currentUser && email === currentUser.email) return acc;

                    acc[email] = (acc[email] || 0) + 1;
                    return acc;
                }, {});
                const activeContributors = Object.keys(authorCounts).length;

                setStats({ totalUsers, totalLessons, totalReported, activeContributors });

                // 2. Prepare Graph Data (Growth over months/weeks)
                // Helper to group by date
                const groupByDate = (items, key = 'createdAt') => {
                    const groups = {};
                    items.forEach(item => {
                        if (!item[key]) return;
                        const date = new Date(item[key]);
                        // Group by Month (e.g., "Jan")
                        const label = date.toLocaleString('default', { month: 'short' });
                        groups[label] = (groups[label] || 0) + 1;
                    });
                    // Convert to array and simple sort (assuming current year trends for MVP)
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return months.map(m => ({ name: m, count: groups[m] || 0 }));
                };

                const userGrowth = groupByDate(users);
                const lessonGrowth = groupByDate(lessons);
                setGraphData({ userGrowth, lessonGrowth });

                // 3. Recent Activity Lists
                // Top Contributors (Most lessons)
                const sortedContributors = Object.entries(authorCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([email, count]) => {
                        const user = users.find(u => u.email === email);
                        return {
                            name: user?.name || email.split('@')[0],
                            email,
                            count,
                            avatar: user?.photoURL || `https://ui-avatars.com/api/?name=${email}`
                        };
                    });

                // New Lessons
                const latestLessons = [...lessons]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3)
                    .map(l => ({
                        title: l.title,
                        author: l.author?.name || 'Anonymous',
                        category: l.category,
                        time: new Date(l.createdAt).toLocaleDateString()
                    }));

                setRecentData({ contributors: sortedContributors, newLessons: latestLessons });

            } catch (error) {
                console.error('Failed to load dashboard data', error);
                toast.error('Could not load some dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: <Users size={24} className="text-blue-600" />, bg: 'bg-blue-50' },
        { label: 'Total Lessons', value: stats.totalLessons, icon: <BookOpen size={24} className="text-purple-600" />, bg: 'bg-purple-50' },
        { label: 'Reported Content', value: stats.totalReported, icon: <ShieldAlert size={24} className="text-red-600" />, bg: 'bg-red-50' },
        { label: 'Active Contributors', value: stats.activeContributors, icon: <Award size={24} className="text-green-600" />, bg: 'bg-green-50' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SEO title="Admin Dashboard" description="Overview of platform statistics" />
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
                <p className="text-gray-500">Real-time platform statistics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" /> User Signups (YTD)
                    </h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={graphData.userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lesson Creation Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen size={20} className="text-purple-600" /> New Lessons (YTD)
                    </h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={graphData.lessonGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
                                <RechartsTooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Active Contributors & New Lessons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Top Contributors */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Top Contributors</h2>
                    </div>
                    <div className="space-y-4">
                        {recentData.contributors.length > 0 ? recentData.contributors.map((creator, index) => (
                            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full bg-gray-100 object-cover" />
                                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-white">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{creator.name}</h4>
                                        <p className="text-xs text-gray-500">{creator.count} lessons</p>
                                    </div>
                                </div>
                                <div>
                                    <Award size={16} className={index === 0 ? "text-yellow-500" : "text-gray-300"} />
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm text-center py-4">No contributors yet.</p>
                        )}
                    </div>
                </div>

                {/* Latest Lessons */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Latest Lessons</h2>
                    </div>
                    <div className="space-y-4">
                        {recentData.newLessons.length > 0 ? recentData.newLessons.map((lesson, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600 shrink-0">
                                    <BookOpen size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{lesson.title}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-xs text-gray-500">by {lesson.author}</p>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <p className="text-xs text-gray-400">{lesson.time}</p>
                                    </div>
                                </div>
                                <span className="hidden sm:inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{lesson.category}</span>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm text-center py-4">No lessons yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardHome;
