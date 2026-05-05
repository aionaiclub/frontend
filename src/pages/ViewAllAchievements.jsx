import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/api';

const ViewAllAchievements = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/achievements`);
        setAchievements(data);
      } catch (error) {
        console.error('Error fetching achievements', error);
      }
    };
    fetchAchievements();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Our Achievements</h1>
          <p className="text-xl text-gray-400">Celebrating our milestones and successes</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {achievements.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-brand-accent rounded-2xl p-8 border border-white/5 hover:border-yellow-500/30 transition-all group text-center flex flex-col"
            >
              <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="text-yellow-500" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                {item.description}
              </p>
              {item.image && (
                <div className="mt-auto rounded-xl overflow-hidden h-56">
                  <img src={`${API_URL}${item.image}`} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAllAchievements;
