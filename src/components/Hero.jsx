import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../utils/api';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const [postsRes, eventsRes] = await Promise.all([
          axios.get(`${API_URL}/api/posts`),
          axios.get(`${API_URL}/api/events`)
        ]);
        
        const latestPosts = postsRes.data.slice(0, 2).map(p => ({
          id: p._id,
          type: 'news',
          title: p.title,
          subtitle: (p.description?.substring(0, 100) || '') + '...',
          image: p.image ? `${API_URL}${p.image}` : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
          link: `/news/${p._id}`
        }));

        const latestEvents = eventsRes.data.slice(0, 1).map(e => ({
          id: e._id,
          type: 'event',
          title: 'Upcoming Event: ' + e.title,
          subtitle: (e.description?.substring(0, 100) || '') + '...',
          image: e.images?.[0] ? `${API_URL}${e.images[0]}` : 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80',
          link: '/login'
        }));

        const combined = [...latestPosts, ...latestEvents];
        if (combined.length === 0) {
           setSlides([
            {
              title: 'Welcome to AIONAI Club',
              subtitle: 'The hub for AI innovators and tech enthusiasts',
              image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
              link: '/login'
            }
          ]);
        } else {
          setSlides(combined);
        }
      } catch (error) {
        console.error('Error fetching hero data', error);
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-brand-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-brand-dark z-10" />
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6 }}
            src={slides[current].image}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-4xl"
            >
              {slides[current].type && (
                <span className="inline-block px-4 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6">
                  {slides[current].type}
                </span>
              )}
              <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
                {slides[current].title}
              </h1>
              <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
                {slides[current].subtitle}
              </p>
              <Link 
                to={slides[current].link} 
                className="inline-flex items-center px-10 py-4 bg-white text-black text-lg font-black rounded-full hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 shadow-2xl shadow-white/10 group"
              >
                {slides[current].type === 'news' ? 'Read Full Story' : 'Get Started'}
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm border border-white/10 hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm border border-white/10 hidden md:block"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-500 h-1 rounded-full ${
                  index === current ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;
