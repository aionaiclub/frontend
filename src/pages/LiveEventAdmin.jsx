import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Play, Square, Users, Info } from 'lucide-react';
import { API_URL } from '../utils/api';

const socket = io(API_URL);

const LiveEventAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (!stored || stored === 'undefined') {
        navigate('/login');
        return;
      }
      const user = JSON.parse(stored);
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        navigate('/login');
      } else {
        setUserInfo(user);
        fetchEvent();
      }
    } catch (error) {
      console.error(error);
      navigate('/login');
    }

    socket.emit('join_event', id);

    socket.on('user_joined', (count) => {
      setConnectedUsers(count);
    });

    return () => {
      socket.off('user_joined');
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

  const toggleLive = async () => {
    const newStatus = isLive ? 'inactive' : 'active';
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${API_URL}/api/events/${id}/live`, { liveStatus: newStatus }, config);
      setIsLive(!isLive);
    } catch (error) {
      console.error(error);
    }
  };

  const changeSlide = (direction) => {
    if (!event.images || event.images.length === 0) return;
    
    let nextSlide = currentSlide;
    if (direction === 'next' && currentSlide < event.images.length - 1) nextSlide += 1;
    if (direction === 'prev' && currentSlide > 0) nextSlide -= 1;
    
    if (nextSlide !== currentSlide) {
      setCurrentSlide(nextSlide);
      socket.emit('slide_changed', { eventId: id, currentSlide: nextSlide });
      updateSlideInDB(nextSlide);
    }
  };

  const updateSlideInDB = async (slide) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${API_URL}/api/events/${id}/live`, { currentSlide: slide }, config);
    } catch (error) {
      console.error(error);
    }
  };

  if (!event) return <div className="pt-24 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-brand-dark pt-24 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
            <div className="flex items-center text-gray-400 mt-2">
              <Users size={18} className="mr-2 text-blue-400" />
              <span>{connectedUsers} Students Connected</span>
            </div>
          </div>
          <button 
            onClick={toggleLive}
            className={`flex items-center px-6 py-3 rounded-full font-bold transition-all shadow-lg ${isLive ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            {isLive ? <><Square size={18} className="mr-2" /> Stop Presentation</> : <><Play size={18} className="mr-2" /> Go Live</>}
          </button>
        </div>

        <div className="bg-brand-accent rounded-3xl border border-white/10 overflow-hidden shadow-2xl aspect-video flex flex-col relative group">
          {event.images && event.images.length > 0 ? (
            <img 
              src={`${API_URL}${event.images[currentSlide]}`} 
              className="w-full h-full object-contain bg-black"
              alt={`Slide ${currentSlide + 1}`}
            />
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500 p-10 text-center">
              <Info size={64} className="mb-4 opacity-20" />
              <p className="text-xl">No slides uploaded for this event.</p>
              <p className="text-sm mt-2">Upload images in the Event Management tab to use the slide share feature.</p>
            </div>
          )}
          
          <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="flex space-x-4">
              <button 
                onClick={() => changeSlide('prev')}
                disabled={currentSlide === 0}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={() => changeSlide('next')}
                disabled={!event.images || currentSlide === event.images.length - 1}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={32} />
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold">
              Slide {currentSlide + 1} / {event.images?.length || 0}
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-accent p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-widest">Status</div>
            <div className={`text-2xl font-black ${isLive ? 'text-green-400' : 'text-gray-500'}`}>{isLive ? 'BROADCASTING' : 'OFFLINE'}</div>
          </div>
          <div className="bg-brand-accent p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-widest">Control Mode</div>
            <div className="text-2xl font-black text-white">MANUAL SYNC</div>
          </div>
          <div className="bg-brand-accent p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-widest">Connected</div>
            <div className="text-2xl font-black text-blue-400">{connectedUsers} STUDENTS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveEventAdmin;
