import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, CheckCircle, FileText, Download, ExternalLink, Play } from 'lucide-react';
import { API_URL } from '../utils/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customAnswers, setCustomAnswers] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (!stored || stored === 'undefined') {
        navigate('/login');
        return;
      }
      const user = JSON.parse(stored);
      if (user.role !== 'user') {
        navigate('/login');
      } else {
        setUserInfo(user);
        fetchEvents();
        fetchMyRegistrations(user.token);
      }
    } catch (error) {
      console.error(error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/events`);
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyRegistrations = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/api/registrations/my`, config);
      setMyRegistrations(data.map(reg => reg.event._id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(
        `${API_URL}/api/registrations`,
        { eventId: selectedEvent._id, customAnswers },
        config
      );
      setMessage('Successfully registered!');
      setSelectedEvent(null);
      setCustomAnswers({});
      fetchMyRegistrations(userInfo.token);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-brand-dark pt-24 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {userInfo.name}</p>
          </div>
          <button
            onClick={logoutHandler}
            className="flex items-center space-x-2 bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {message && (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-md mb-6 text-center border border-green-500/50 flex items-center justify-center">
            <CheckCircle size={20} className="mr-2" />
            {message}
          </div>
        )}

        {selectedEvent ? (
          <div className="bg-brand-accent p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Register: {selectedEvent.title}</h2>
            <p className="text-gray-400 mb-6">{selectedEvent.description}</p>
            
            {selectedEvent.youtubeUrl && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={selectedEvent.youtubeUrl.includes('watch?v=') ? selectedEvent.youtubeUrl.replace('watch?v=', 'embed/') : selectedEvent.youtubeUrl} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                  <input type="text" disabled value={userInfo.name} className="w-full px-3 py-2 bg-brand-dark border border-white/5 rounded-md text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input type="email" disabled value={userInfo.email} className="w-full px-3 py-2 bg-brand-dark border border-white/5 rounded-md text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              {selectedEvent.customFormFields?.map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{field.label} {field.required && '*'}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      required={field.required}
                      className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white focus:border-white outline-none"
                      onChange={(e) => setCustomAnswers({...customAnswers, [field.label]: e.target.value})}
                    />
                  ) : (
                    <input 
                      type={field.type} 
                      required={field.required}
                      className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white focus:border-white outline-none"
                      onChange={(e) => setCustomAnswers({...customAnswers, [field.label]: e.target.value})}
                    />
                  )}
                </div>
              ))}

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 bg-white text-black font-bold py-3 rounded-md hover:bg-gray-200 transition-all">
                  Confirm Registration
                </button>
                <button type="button" onClick={() => setSelectedEvent(null)} className="flex-1 bg-brand-dark border border-white/20 text-white font-bold py-3 rounded-md hover:bg-white/10 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-white mb-8 flex items-center">
              <Calendar className="mr-2 text-blue-500" /> Event Hub
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const isRegistered = myRegistrations.includes(event._id);
                return (
                  <div key={event._id} className="bg-brand-accent p-6 rounded-2xl border border-white/10 flex flex-col h-full hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{event.title}</h3>
                      <span className="text-xs text-gray-500 bg-brand-dark px-2 py-1 rounded">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">{event.description}</p>
                    
                    {isRegistered ? (
                      <div className="space-y-4">
                        <div className="flex items-center text-green-400 font-bold bg-green-400/5 p-3 rounded-xl border border-green-400/10">
                          <CheckCircle size={18} className="mr-2" /> Registered
                        </div>
                        
                        {event.documents && event.documents.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reference Materials</p>
                            {event.documents.map((doc, i) => (
                              <a 
                                key={i} 
                                href={`${API_URL}${doc.url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 bg-brand-dark rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                              >
                                <span className="flex items-center"><FileText size={14} className="mr-2" /> {doc.name}</span>
                                <ExternalLink size={12} />
                              </a>
                            ))}
                          </div>
                        )}

                        {event.liveStatus === 'active' && (
                          <button 
                            onClick={() => navigate(`/live/${event._id}`)}
                            className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-500 transition-all font-black animate-pulse flex items-center justify-center shadow-lg shadow-red-600/20"
                          >
                            <Play size={18} className="mr-2 fill-current" />
                            JOIN LIVE SESSION
                          </button>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-600/20"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                );
              })}
              {events.length === 0 && <p className="text-gray-500">No events found.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
