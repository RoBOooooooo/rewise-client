import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { PATHS } from '../../routes/paths';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574&auto=format&fit=crop',
        title: 'Share Your Life Lessons',
        description: 'Turn your experiences into wisdom. Create, share, and inspire others with your stories.',
        cta: 'Start Writing',
        link: PATHS.DASHBOARD.ADD_LESSON,
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop',
        title: 'Discover Global Wisdom',
        description: 'Explore a vast library of life lessons from people around the world. Learn from their journeys.',
        cta: 'Explore Lessons',
        link: PATHS.ALL_LESSONS,
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop',
        title: 'Join a Community of Learners',
        description: 'Connect, comment, and grow with a community that values deep learning and personal growth.',
        cta: 'Join Now',
        link: PATHS.REGISTER,
    },
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    const next = () => setCurrent((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[600px] w-full overflow-hidden bg-gray-900 group">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transform scale-105 transition-transform duration-[10000ms] ease-linear"
                        style={{ transform: index === current ? 'scale(100)' : 'scale(105)' }} // Simple generic zoom effect attempt, slightly buggy with just inline style, keeping standard object-cover.
                    />

                    {/* Content */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                        <div className={`max-w-3xl transform transition-all duration-700 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                                {slide.description}
                            </p>
                            <Link
                                to={slide.link}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-blue-600/30 transform hover:-translate-y-1"
                            >
                                {slide.cta}
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={32} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-blue-600' : 'w-2 bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
