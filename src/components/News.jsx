import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { API_URL, getImageUrl } from '../utils/api';

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/posts`);
        setNews(data);
      } catch (error) {
        console.error('Error fetching news', error);
      }
    };
    fetchNews();
  }, []);

  return (
    <section id="news" className="py-24 bg-brand-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight"
          >
            Latest News & Updates
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-400"
          >
            Stay up to date with the latest from the AIONAI Club
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {news.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No recent news published yet.
            </div>
          ) : (
            news.slice(0, 3).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/news/${item._id}`}
                  className="bg-brand-accent rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group block h-full flex flex-col"
                >
                  {item.image && (
                    <div className="h-56 w-full overflow-hidden relative">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-accent to-transparent opacity-60"></div>
                    </div>
                  )}
                  <div className="p-8 flex-grow">
                    <div className="text-xs text-blue-400 font-bold tracking-widest uppercase mb-4 flex items-center">
                      <span className="w-8 h-[2px] bg-blue-500 mr-3"></span>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="mt-auto flex items-center text-white font-bold text-sm">
                      Read More <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
        
        {news.length > 3 && (
          <div className="text-center mt-12">
            <Link to="/all-news" className="inline-flex items-center px-8 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white hover:text-black transition-all border border-white/20 group">
              View All News <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
