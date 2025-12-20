import HeroSlider from '../../components/home/HeroSlider';

const Home = () => {
    return (
        <div className="min-h-screen">
            <HeroSlider />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Other sections will go here */}
                <div className="text-center text-gray-500 py-12">
                    More content incoming...
                </div>
            </div>
        </div>
    );
};

export default Home;
