import HeroSlider from '../../components/home/HeroSlider';
import WhyLearn from '../../components/home/WhyLearn';
import Stats from '../../components/home/Stats';
import FeaturedLessons from '../../components/home/FeaturedLessons';
import TopContributors from '../../components/home/TopContributors';

const Home = () => {
    return (
        <div className="min-h-screen">
            <HeroSlider />
            <WhyLearn />
            <FeaturedLessons />
            <Stats />
            <TopContributors />

            {/* Spacer or additional content */}
            <div className="pb-12" />
        </div>
    );
};

export default Home;
