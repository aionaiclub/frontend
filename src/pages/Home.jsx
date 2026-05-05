import Hero from '../components/Hero';
import About from '../components/About';
import News from '../components/News';
import Events from '../components/Events';
import Achievements from '../components/Achievements';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="bg-brand-dark">
      <Hero />
      <Events />
      <About />
      <News />
      <Achievements />
    </div>
  );
};

export default Home;
