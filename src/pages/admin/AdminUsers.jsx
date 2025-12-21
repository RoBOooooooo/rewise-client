import { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import useAuth from '../../hooks/useAuth';

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            // ... existing fetch logic
            try {
                // Fetch users and all lessons to calculate counts
                const [usersRes, lessonsRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/lessons')
                ]);

                const userList = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.data || []);
                const lessonsList = Array.isArray(lessonsRes.data) ? lessonsRes.data : (lessonsRes.data.lessons || lessonsRes.data || []);

                // Calculate lessons per user
                const processedUsers = userList.map(user => {
                    const userLessonCount = lessonsList.filter(l =>
                        l.authorEmail === user.email || l.author?.email === user.email
                    ).length;
                    return { ...user, lessonsCount: userLessonCount };
                });

                setUsers(processedUsers);
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
                toast.error('Could not load users');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter(user => {
        // Hide Admin Self
        if (currentUser && user.email === currentUser.email) return false;

        const name = user.name || '';
        const email = user.email || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const makeAdmin = async (userId) => {
        try {
            await api.patch(`/users/admin/${userId}`);
            toast.success('User promoted to Admin');
            setUsers(users.map(u => (u._id === userId || u.id === userId) ? { ...u, role: 'admin' } : u));
        } catch (error) {
            toast.error('Failed to promote user');
        }
    };

    const deleteUser = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This user will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/admin/users/${userId}`);
                    toast.success('User deleted successfully');
                    setUsers(users.filter(u => (u._id !== userId && u.id !== userId)));
                } catch (error) {
                    toast.error('Failed to delete user');
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lessons</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                                    <img
                                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                                ${user.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.isPremium ? 'Premium' : 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-700">{user.lessonsCount || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => makeAdmin(user._id || user.id)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Make Admin"
                                                    >
                                                        <Shield size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteUser(user._id || user.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
