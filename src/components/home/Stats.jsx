const Stats = () => {
    const stats = [
        { label: 'Active Users', value: '10K+' },
        { label: 'Stories Shared', value: '50K+' },
        { label: 'Lessons Learned', value: '100K+' },
        { label: 'Countries Reached', value: '120+' },
    ];

    return (
        <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="space-y-2">
                            <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200">
                                {stat.value}
                            </div>
                            <div className="text-blue-100 font-medium text-lg">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
