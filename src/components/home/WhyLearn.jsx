import { BookOpen, Users, TrendingUp, Shield } from 'lucide-react';

const features = [
    {
        icon: <BookOpen className="w-8 h-8 text-blue-600" />,
        title: 'Curated Wisdom',
        description: 'Access thousands of verified life lessons from experienced individuals across the globe.',
    },
    {
        icon: <Users className="w-8 h-8 text-blue-600" />,
        title: 'Community Driven',
        description: 'Engage with a supportive community. Share your thoughts, like, and comment on stories.',
    },
    {
        icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
        title: 'Personal Growth',
        description: 'Track your learning journey and bookmark lessons that resonate with your life goals.',
    },
    {
        icon: <Shield className="w-8 h-8 text-blue-600" />,
        title: 'Safe Environment',
        description: 'A moderated platform ensuring high-quality content and respectful interactions.',
    },
];

const WhyLearn = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Learning From Life Matters</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience is the best teacher. Rewise connects you with the collective wisdom of humanity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300 group"
                        >
                            <div className="mb-6 bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyLearn;
