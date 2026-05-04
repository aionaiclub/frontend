import { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash, Users, Play, Download, Image as ImageIcon, Calendar, FileText, Edit, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/api';

const EventTab = ({ userInfo }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  
  const [slides, setSlides] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/events`);
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${API_URL}/api/registrations/event/${eventId}`, config);
      setRegistrations(data);
      setSelectedEventId(eventId);
    } catch (error) {
      console.error(error);
    }
  };

  const addField = () => {
    if (!newFieldLabel) return;
    setCustomFields([...customFields, { label: newFieldLabel, type: newFieldType, required: true }]);
    setNewFieldLabel('');
  };

  const removeField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const pptExtractHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('ppt', file);
      const { data } = await axios.post(`${API_URL}/api/upload/extract-ppt`, formData);
      // data is an array of slide image URLs
      setSlides(data); 
      alert(`Successfully extracted ${data.length} slides from PPTX!`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data || 'Failed to extract PPTX. Make sure it is a valid .pptx file.');
    } finally {
      setUploading(false);
    }
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let slideUrls = editingEvent?.images || [];
      let docUrls = editingEvent?.documents || [];

      // If slides are in memory as URLs (from PPT extraction or existing), we keep them
      // If slides are File objects, we need to upload them (manual upload case)
      if (slides.length > 0 && slides[0] instanceof File) {
        slideUrls = [];
        for (const file of slides) {
          const formData = new FormData();
          formData.append('image', file);
          const { data } = await axios.post(`${API_URL}/api/upload`, formData);
          slideUrls.push(data);
        }
      } else if (slides.length > 0 && typeof slides[0] === 'string') {
        slideUrls = slides; // These are already uploaded URLs
      }

      // Upload docs
      if (documents.length > 0 && documents[0] instanceof File) {
        docUrls = [];
        for (const file of documents) {
          const formData = new FormData();
          formData.append('image', file);
          const { data } = await axios.post(`${API_URL}/api/upload`, formData);
          docUrls.push({ name: file.name, url: data });
        }
      }

      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const eventData = { 
        title, 
        description, 
        date, 
        customFormFields: customFields,
        images: slideUrls,
        documents: docUrls
      };

      if (editingEvent) {
        await axios.put(`${API_URL}/api/events/${editingEvent._id}`, eventData, config);
        alert('Event Updated Successfully!');
      } else {
        await axios.post(`${API_URL}/api/events`, eventData, config);
        alert('Event Created Successfully!');
      }
      
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert('Error saving event');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setDate(''); setCustomFields([]); setSlides([]); setDocuments([]); setEditingEvent(null);
  };

  const editHandler = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date.split('T')[0]);
    setCustomFields(event.customFormFields || []);
    setSlides(event.images || []);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${API_URL}/api/events/${id}`, config);
        fetchEvents();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-brand-accent p-6 rounded-xl border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
          {editingEvent && <button onClick={resetForm} className="text-sm text-gray-400 hover:text-white underline">Cancel Edit</button>}
        </div>
        <form onSubmit={submitEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input required type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
            <textarea required rows={4} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
            
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-brand-dark rounded-lg border border-white/5 border-dashed">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center">
                   <Zap size={14} className="mr-1 text-yellow-500" /> Auto-Extract PPT Slides
                </label>
                <label className="cursor-pointer bg-brand-accent border border-gray-700 p-2 rounded-md hover:border-white transition-colors flex items-center justify-center w-full">
                  <ImageIcon size={18} className="mr-2 text-gray-400" />
                  <span className="text-gray-300 text-xs truncate">Select .pptx file</span>
                  <input type="file" className="hidden" onChange={pptExtractHandler} accept=".pptx" />
                </label>
                <p className="text-[10px] text-gray-500 mt-2">Will extract images from the PPTX to use as slides.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Manual Slides</label>
                  <label className="cursor-pointer bg-brand-dark border border-gray-600 p-2 rounded-md hover:border-white transition-colors flex items-center justify-center w-full">
                    <span className="text-gray-300 text-xs truncate">{slides.length > 0 ? `${slides.length} slides` : 'Select Images'}</span>
                    <input type="file" multiple className="hidden" onChange={(e) => setSlides(Array.from(e.target.files))} accept="image/*" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ref. Docs</label>
                  <label className="cursor-pointer bg-brand-dark border border-gray-600 p-2 rounded-md hover:border-white transition-colors flex items-center justify-center w-full">
                    <FileText size={18} className="mr-2 text-gray-400" />
                    <span className="text-gray-300 text-xs truncate">{documents.length > 0 ? `${documents.length} files` : 'Select Files'}</span>
                    <input type="file" multiple className="hidden" onChange={(e) => setDocuments(Array.from(e.target.files))} />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 border-l border-white/10 pl-6">
            <h3 className="text-white font-medium">Registration Form Fields</h3>
            <div className="flex space-x-2">
              <input type="text" placeholder="Label (e.g. Roll No)" value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)} className="flex-1 px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white text-sm" />
              <select value={newFieldType} onChange={e => setNewFieldType(e.target.value)} className="bg-brand-dark border border-gray-600 rounded-md text-white px-2 text-sm">
                <option value="text">Text</option>
                <option value="number">Num</option>
                <option value="textarea">Large</option>
              </select>
              <button type="button" onClick={addField} className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition-all"><Plus size={20}/></button>
            </div>
            <ul className="space-y-2 mt-4 max-h-60 overflow-y-auto">
              {customFields.map((f, i) => (
                <li key={i} className="flex justify-between text-sm text-gray-300 bg-brand-dark p-2 rounded border border-white/5">
                  <span>{f.label} ({f.type})</span>
                  <button type="button" onClick={() => removeField(i)} className="text-red-400 hover:text-red-300"><Trash size={16}/></button>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={uploading} className="w-full bg-white text-black font-black py-4 rounded-md hover:bg-blue-500 hover:text-white disabled:bg-gray-500 transition-all shadow-xl">
              {uploading ? 'Processing files...' : (editingEvent ? 'Update Event' : 'Publish Event')}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-brand-accent p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center"><Calendar className="mr-2 text-blue-500"/> Events List</h2>
          <div className="space-y-4">
            {events.map(event => (
              <div key={event._id} className={`p-4 bg-brand-dark rounded-md border flex justify-between items-center transition-all ${selectedEventId === event._id ? 'border-blue-500' : 'border-gray-700 hover:border-gray-500'}`} onClick={() => fetchRegistrations(event._id)}>
                <div className="cursor-pointer">
                  <h3 className="text-white font-bold">{event.title}</h3>
                  <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/live-admin/${event._id}`); }} className="bg-green-600/20 text-green-400 p-2 rounded hover:bg-green-600 hover:text-white transition-all">
                    <Play size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); editHandler(event); }} className="bg-blue-600/20 text-blue-400 p-2 rounded hover:bg-blue-600 hover:text-white transition-all">
                    <Edit size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteHandler(event._id); }} className="bg-red-600/20 text-red-400 p-2 rounded hover:bg-red-600 hover:text-white transition-all">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedEventId && registrations.length > 0 && (
          <div className="bg-brand-accent p-6 rounded-xl border border-white/10 h-fit">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-white">Registrations ({registrations.length})</h2>
               <CSVLink data={csvData} filename="registrations.csv" className="text-xs bg-gray-700 text-white px-2 py-1 rounded">Export</CSVLink>
            </div>
             <div className="h-40 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrations.reduce((acc, curr) => {
                    const date = new Date(curr.createdAt).toLocaleDateString();
                    const existing = acc.find(a => a.name === date);
                    if (existing) existing.count++;
                    else acc.push({ name: date, count: 1 });
                    return acc;
                  }, [])}>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTab;
