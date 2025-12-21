import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ShieldAlert, Trash2, CheckCircle, ExternalLink, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ReportedLessons = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const { data } = await api.get('/admin/reports'); // Hypothetical endpoint
            const list = Array.isArray(data) ? data : (data.reports || data.data || []);
            setReports(list);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDeleteLesson = async (lessonId, reportId) => {
        const result = await Swal.fire({
            title: 'Delete this reported lesson?',
            text: "This content will be permanently removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete Content'
        });

        if (result.isConfirmed) {
            try {
                // 1. Delete the lesson
                await api.delete(`/lessons/${lessonId}`);

                // 2. Delete/Resolve the report
                if (reportId) {
                    await api.delete(`/admin/reports/${reportId}`);
                }

                setReports(prev => prev.filter(r => (r.lessonId || r._id) !== lessonId && r._id !== reportId));
                Swal.fire('Deleted!', 'Content removed.', 'success');
            } catch (error) {
                console.error("Delete failed", error);
                toast.error('Failed to delete content.');
            }
        }
    };

    const handleIgnoreReport = async (reportId) => {
        try {
            await api.delete(`/admin/reports/${reportId}`);
            setReports(prev => prev.filter(r => r._id !== reportId));
            toast.success('Report resolved/ignored.');
        } catch (error) {
            console.error('Failed to ignore report:', error);
            toast.error('Failed to ignore report.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <SEO title="Reported Content" description="Moderate community reports" />
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldAlert className="text-red-600" /> Reported Lessons
            </h1>

            {reports.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                    <p className="text-gray-500 font-medium">All clear! No reported content requiring attention.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Lesson Title</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Report Reason</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Reporter</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {report.lesson?.title || 'Untitled Lesson'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-red-600">
                                        {report.reason || 'Inappropriate Content'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {report.reporterEmail || 'Anonymous'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={PATHS.LESSON_DETAILS.replace(':id', report.lessonId)}
                                                target="_blank"
                                                className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg"
                                                title="View Object"
                                            >
                                                <ExternalLink size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleIgnoreReport(report._id)}
                                                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                Ignore
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(report.lessonId, report._id)}
                                                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                            >
                                                Delete Lesson
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReportedLessons;
