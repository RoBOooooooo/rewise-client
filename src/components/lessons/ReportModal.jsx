import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const REPORT_REASONS = [
    'Inappropriate Content',
    'Hate Speech or Harassment',
    'Misleading or False Information',
    'Spam or Promotional Content',
    'Sensitive or Disturbing Content',
    'Other'
];

const ReportModal = ({ isOpen, onClose, lessonId, userId }) => {
    const [reason, setReason] = useState(REPORT_REASONS[0]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/reports', {
                lessonId,
                reporterUserId: userId, // Optional, usually handled by auth middleware
                reason,
                timestamp: new Date().toISOString()
            });
            toast.success('Report submitted. We will review this lesson.');
            onClose();
        } catch (error) {
            console.error('Report failed:', error);
            toast.error('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={24} />
                        Report Lesson
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-gray-600 mb-4 text-sm">
                        Please select the reason why you are reporting this lesson. We take all reports seriously.
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            {REPORT_REASONS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
