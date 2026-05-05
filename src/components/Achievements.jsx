import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL, getImageUrl } from '../utils/api';

const Achievements = () => {
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
  }, []);

  return (
    <section id="achievements" className="py-24 bg-brand-accent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            Our Achievements
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-400"
          >
            Celebrating the milestones and successes of AIONAI Club
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {achievements.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No achievements posted yet.
            </div>
          ) : (
            achievements.slice(0, 3).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-brand-dark rounded-2xl p-6 border border-white/5 hover:border-yellow-500/30 transition-all group text-center"
              >
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Award className="text-yellow-500" size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3">
                  {item.description}
                </p>
                {item.image && (
                  <div className="mt-6 rounded-xl overflow-hidden h-40">
                    <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {achievements.length > 3 && (
          <div className="text-center mt-12">
            <Link to="/all-achievements" className="inline-flex items-center px-8 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white hover:text-black transition-all border border-white/20 group">
              View All Achievements <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;
