import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { Heart, BookOpen } from 'lucide-react';

const LessonCard = ({ lesson }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group overflow-hidden">
            {/* Lesson Image (Optional or Placeholder) */}
            <div className="h-48 overflow-hidden bg-gray-100 relative">
                <img
                    src={lesson.image || `https://ui-avatars.com/api/?name=${lesson.title}&background=random`}
                    alt={lesson.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                    {lesson.category || 'Life Lesson'}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-4">
                    <img
                        src={lesson.author?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        alt={lesson.author?.name}
                        className="w-8 h-8 rounded-full border border-gray-100"
                    />
                    <span className="text-sm text-gray-500 font-medium">
                        {lesson.author?.name || 'Anonymous'}
                    </span>
                </div>

                <Link to={PATHS.LESSON_DETAILS.replace(':id', lesson.id || lesson._id)}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {lesson.title}
                    </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {lesson.description || 'No description provided.'}
                </p>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <Heart size={16} className={lesson.isLiked ? "fill-red-500 text-red-500" : ""} />
                            {lesson.likes || 0}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BookOpen size={16} />
                            Read
                        </span>
                    </div>
                    <Link
                        to={PATHS.LESSON_DETAILS.replace(':id', lesson.id || lesson._id)}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Read More →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;
