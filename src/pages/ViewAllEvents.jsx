import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/api';

const ViewAllEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/events`);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events', error);
      }
    };
    fetchEvents();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">All Events</h1>
          <p className="text-xl text-gray-400">Join our upcoming sessions or view past workshops</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
          {events.map((event, index) => {
            const eventDate = new Date(event.date);
            const isPast = new Date() > eventDate;
            
            return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-brand-accent rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all group flex flex-col md:flex-row gap-6"
              >
                <div className="flex-shrink-0 w-full md:w-48 h-48 rounded-xl overflow-hidden bg-brand-dark relative">
                  {event.images && event.images.length > 0 ? (
                    <img 
                      src={`${API_URL}${event.images[0]}`} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Calendar size={48} />
                    </div>
                  )}
                  {isPast && (
                    <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-full font-black uppercase tracking-wider border border-white/10">
                      Conducted
                    </div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col">
                  <div className="flex items-center text-blue-400 text-sm font-bold mb-2">
                    <Calendar size={16} className="mr-2" />
                    {eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 mb-6 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center text-white font-bold bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full border border-white/10 transition-all"
                    >
                      {isPast ? 'View Details' : 'Register Now'} <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewAllEvents;
