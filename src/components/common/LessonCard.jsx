import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { Heart, BookOpen, Crown, Star, CheckCircle } from 'lucide-react';

const LessonCard = ({ lesson }) => {
    const isPremium = lesson.accessLevel === 'premium';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group overflow-hidden relative">

            {/* Image Section */}
            <div className="h-52 overflow-hidden bg-gray-100 relative">
                <img
                    src={lesson.image || `https://ui-avatars.com/api/?name=${lesson.title}&background=random`}
                    alt={lesson.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges Container */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100 self-start">
                        {lesson.category || 'Life Lesson'}
                    </div>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
                    {/* Premium Badge */}
                    {isPremium && (
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                            <Crown size={12} className="fill-current" />
                            Premium
                        </div>
                    )}
                    {/* Featured Badge */}
                    {lesson.isFeatured && (
                        <div className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                            <Star size={12} className="fill-current" />
                            Featured
                        </div>
                    )}
                </div>

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={lesson.author?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (lesson.author?.name || 'User')}
                        alt={lesson.author?.name}
                        className="w-8 h-8 rounded-full border border-gray-100 object-cover"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-gray-900 leading-none">
                                {lesson.author?.name || 'Anonymous'}
                            </span>
                            {/* Verified/Reviewed Badge - Logic check: admins verify content */}
                            {lesson.isReviewed && (
                                <CheckCircle size={12} className="text-green-500 fill-green-50" />
                            )}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                            {new Date(lesson.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <Link to={PATHS.LESSON_DETAILS.replace(':id', lesson.id || lesson._id)} className="block mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {lesson.title}
                    </h3>
                </Link>

                {/* Description Excerpt */}
                <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {lesson.description || 'No description provided for this lesson.'}
                </p>

                {/* Footer / Stats */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-gray-500 text-xs">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Heart size={14} className={lesson.isLiked ? "fill-red-500 text-red-500" : ""} />
                            <span className="font-semibold">{lesson.likesCount || 0}</span>
                        </span>
                        {lesson.emotionalTone && (
                            <span className="text-gray-400 font-medium hidden sm:inline-block">
                                {lesson.emotionalTone}
                            </span>
                        )}
                    </div>

                    <Link
                        to={PATHS.LESSON_DETAILS.replace(':id', lesson.id || lesson._id)}
                        className="flex items-center gap-1 text-blue-600 font-semibold hover:gap-2 transition-all"
                    >
                        Read
                        <BookOpen size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;
