import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText, Download, User } from 'lucide-react';
import { API_URL } from '../utils/api';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/posts/${id}`);
        setNews(data);
      } catch (error) {
        console.error('Error fetching news', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-white">Loading News...</div>;
  if (!news) return <div className="pt-32 text-center text-white">News not found.</div>;

  return (
    <div className="min-h-screen bg-brand-dark pt-32 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-accent rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        >
          {news.image && (
            <div className="w-full h-96 overflow-hidden">
              <img 
                src={`${API_URL}${news.image}`} 
                alt={news.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-4 items-center mb-6 text-sm text-gray-500">
              <span className="flex items-center"><Calendar size={16} className="mr-2" /> {new Date(news.createdAt).toLocaleDateString()}</span>
              {news.createdBy && <span className="flex items-center"><User size={16} className="mr-2" /> By {news.createdBy.name}</span>}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">{news.title}</h1>
            
            <div className="text-gray-300 leading-relaxed text-lg mb-12 whitespace-pre-wrap">
              {news.description}
            </div>

            {news.documents && news.documents.length > 0 && (
              <div className="border-t border-white/10 pt-8 mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Attachments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {news.documents.map((doc, i) => (
                    <a 
                      key={i} 
                      href={`${API_URL}${doc.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-brand-dark rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all group"
                    >
                      <div className="flex items-center overflow-hidden">
                        <div className="p-2 bg-blue-500/10 rounded-lg mr-4 text-blue-500">
                          <FileText size={20} />
                        </div>
                        <span className="text-gray-300 text-sm font-medium truncate">{doc.name}</span>
                      </div>
                      <Download size={18} className="text-gray-500 group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsDetail;
