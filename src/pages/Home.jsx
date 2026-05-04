import Hero from '../components/Hero';
import About from '../components/About';
import News from '../components/News';
import Events from '../components/Events';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="bg-brand-dark">
      <Hero />
      <About />
      <News />
      <Events />

      <section id="achievements" className="py-24 bg-brand-accent border-t border-white/10">
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Our Achievements</h2>
          <p className="text-gray-400">Loading achievements...</p>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
