import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api'; // Use centralized api instance
import { MessageSquare, Send, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const CommentsSection = ({ lessonId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [lessonId]);

    const fetchComments = async () => {
        try {
            // Adjust endpoint if needed
            const { data } = await api.get(`/lessons/${lessonId}/comments`);
            // Fallback for demo if API returns nothing or structured diff
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const { data } = await api.post(`/lessons/${lessonId}/comments`, {
                text: newComment
            });

            // Optimistic update or use response data
            setComments(prev => [data.comment || data, ...prev]);
            setNewComment('');
            toast.success('Comment posted!');
        } catch (error) {
            console.error('Failed to post comment:', error);
            toast.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={20} />
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
                    <img
                        src={user.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[100px] bg-gray-50 focus:bg-white transition-all"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? 'Posting...' : <><Send size={16} /> Post Comment</>}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center mb-8">
                    <p className="text-gray-600 mb-2">Please log in to join the discussion.</p>
                    <Link to={PATHS.LOGIN} className="text-blue-600 font-semibold hover:underline">
                        Log In Now
                    </Link>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-4 text-gray-500">Loading comments...</div>
                ) : comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={comment._id || index} className="flex gap-4 group">
                            <div className="shrink-0">
                                <img
                                    src={comment.userPhoto || comment.authorImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (comment.authorName || 'Guest')}
                                    alt={comment.authorName}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900 line-clamp-1">{comment.userName || comment.authorName || 'Anonymous'}</h4>
                                        <span className="text-xs text-gray-500">
                                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed text-sm">{comment.text || comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 italic">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
