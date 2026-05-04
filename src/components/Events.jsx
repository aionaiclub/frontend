import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/api';

const Events = () => {
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
  }, []);

  return (
    <section id="events" className="py-24 bg-brand-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            Upcoming Events
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-400"
          >
            Join our workshops, hackathons and tech talks
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
          {events.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No upcoming events scheduled yet.
            </div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-brand-accent rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all group flex flex-col md:flex-row gap-6"
              >
                <div className="flex-shrink-0 w-full md:w-48 h-48 rounded-xl overflow-hidden bg-brand-dark">
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
                </div>
                
                <div className="flex-grow flex flex-col">
                  <div className="flex items-center text-blue-400 text-sm font-bold mb-2">
                    <Calendar size={16} className="mr-2" />
                    {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                      Register Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
