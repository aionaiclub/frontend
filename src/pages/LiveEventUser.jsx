import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Users, Info, Wifi } from 'lucide-react';
import { API_URL } from '../utils/api';

const socket = io(API_URL);

const LiveEventUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (!stored || stored === 'undefined') {
        navigate('/login');
        return;
      }
      JSON.parse(stored); // Verify it's valid JSON
      fetchEvent();
    } catch (error) {
      console.error(error);
      navigate('/login');
    }

    socket.emit('join_event', id);

    socket.on('sync_slide', (slideNumber) => {
      setCurrentSlide(slideNumber);
    });

    socket.on('event_status_changed', (status) => {
      setIsLive(status === 'active');
    });

    return () => {
      socket.off('sync_slide');
      socket.off('event_status_changed');
    };
  }, [id, navigate]);

  const fetchEvent = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/events/${id}`);
      setEvent(data);
      setCurrentSlide(data.currentSlide || 0);
      setIsLive(data.liveStatus === 'active');
    } catch (error) {
      console.error(error);
    }
  };

  if (!event) return <div className="pt-24 text-center text-white font-bold text-xl">Connecting to Event Hub...</div>;

  return (
    <div className="min-h-screen bg-brand-dark pt-24 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{event.title}</h1>
            <div className="flex items-center text-gray-400 mt-2">
              <span className={`w-3 h-3 rounded-full mr-2 ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></span>
              <span className="font-medium">{isLive ? 'Live Session in Progress' : 'Session is Offline'}</span>
            </div>
          </div>
          {isLive && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-1 rounded-full flex items-center text-xs font-bold animate-pulse">
              <Wifi size={14} className="mr-2" /> LIVE SYNC ACTIVE
            </div>
          )}
        </div>

        {!isLive ? (
          <div className="bg-brand-accent rounded-3xl border border-white/10 p-16 text-center flex flex-col items-center justify-center shadow-xl">
            <div className="w-20 h-20 bg-brand-dark rounded-full flex items-center justify-center mb-6">
              <Info size={40} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Wait for the Host</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              The Super Admin hasn't started the presentation yet. Once they go live, your screen will automatically update.
            </p>
          </div>
        ) : (
          <div className="bg-brand-accent rounded-3xl border border-white/10 overflow-hidden shadow-2xl aspect-video flex flex-col items-center justify-center relative bg-black">
            {event.images && event.images.length > 0 ? (
              <img 
                src={`${API_URL}${event.images[currentSlide]}`} 
                className="w-full h-full object-contain"
                alt={`Slide ${currentSlide + 1}`}
                key={currentSlide} // Force re-render for animation if needed
              />
            ) : (
              <div className="text-gray-600 text-center p-10">
                <p className="text-2xl font-bold">Slide {currentSlide + 1}</p>
                <p className="mt-2">No slide image available</p>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white/80 text-xs font-bold px-3 py-1 rounded-full flex items-center">
              Slide {currentSlide + 1} of {event.images?.length || 0}
            </div>
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-brand-accent p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Info size={20} className="mr-2 text-blue-400" /> About this Event
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {event.description}
            </p>
          </div>
          <div className="bg-brand-accent p-8 rounded-3xl border border-white/10 flex flex-col justify-center text-center">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Connected Users</div>
            <div className="text-4xl font-black text-white flex items-center justify-center">
              <Users size={32} className="mr-3 text-blue-500" />
              <span>LIVE</span>
            </div>
            <p className="text-gray-500 text-xs mt-4">Synced with Presentation Hub</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveEventUser;
