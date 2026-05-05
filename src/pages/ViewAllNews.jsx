import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { API_URL } from '../utils/api';

const ViewAllNews = () => {
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
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">All News & Updates</h1>
          <p className="text-xl text-gray-400">Everything happening at AIONAI Club</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {news.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                to={`/news/${item._id}`}
                className="bg-brand-accent rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group block h-full flex flex-col"
              >
                {item.image && (
                  <div className="h-56 w-full overflow-hidden relative">
                    <img 
                      src={`${API_URL}${item.image}`} 
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAllNews;
