import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, Image as ImageIcon, Award } from 'lucide-react';
import { API_URL, getImageUrl } from '../utils/api';

const AchievementTab = ({ userInfo }) => {
  const [achievements, setAchievements] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/achievements`);
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements', error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imagePath = editingAchievement?.image || '';
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post(`${API_URL}/api/upload`, formData);
        imagePath = data;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const achievementData = { title, description, image: imagePath };

      if (editingAchievement) {
        await axios.put(`${API_URL}/api/achievements/${editingAchievement._id}`, achievementData, config);
        alert('Achievement Updated!');
      } else {
        await axios.post(`${API_URL}/api/achievements`, achievementData, config);
        alert('Achievement Published!');
      }

      resetForm();
      fetchAchievements();
    } catch (error) {
      console.error(error);
      alert('Error saving achievement');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setEditingAchievement(null);
  };

  const editHandler = (achievement) => {
    setEditingAchievement(achievement);
    setTitle(achievement.title);
    setDescription(achievement.description);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this achievement?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${API_URL}/api/achievements/${id}`, config);
        fetchAchievements();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-brand-accent p-6 rounded-xl border border-white/10 h-fit shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          {editingAchievement ? <Edit className="mr-2" /> : <Plus className="mr-2" />} 
          {editingAchievement ? 'Edit Achievement' : 'New Achievement'}
        </h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <input 
            required 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" 
          />
          <textarea 
            required 
            rows={4} 
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" 
          />
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image</label>
            <label className="cursor-pointer bg-brand-dark border border-gray-600 p-2 rounded-md hover:border-white transition-colors flex items-center justify-center w-full">
              <ImageIcon size={18} className="mr-2 text-gray-400" />
              <span className="text-gray-300 text-xs truncate">{file ? file.name : 'Select'}</span>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
            </label>
          </div>

          <button 
            type="submit" 
            disabled={uploading} 
            className="w-full bg-white text-black font-bold py-3 rounded-md hover:bg-gray-200 disabled:bg-gray-500 transition-all shadow-lg"
          >
            {uploading ? 'Processing...' : (editingAchievement ? 'Update' : 'Publish')}
          </button>
          {editingAchievement && (
            <button 
              type="button" 
              onClick={resetForm} 
              className="w-full bg-transparent text-gray-400 py-2 hover:text-white transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center"><Award className="mr-2 text-yellow-500" /> Recent Achievements</h2>
        {achievements.map((achievement) => (
          <div key={achievement._id} className="bg-brand-accent p-4 rounded-xl border border-white/10 flex items-center justify-between group hover:border-white/30 transition-all">
            <div className="flex items-center space-x-4">
              {achievement.image && <img src={getImageUrl(achievement.image)} className="w-16 h-16 object-cover rounded-lg" alt="" />}
              <div>
                <h3 className="text-white font-bold">{achievement.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-1">{achievement.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => editHandler(achievement)} 
                className="text-gray-500 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                <Edit size={20} />
              </button>
              <button 
                onClick={() => deleteHandler(achievement._id)} 
                className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {achievements.length === 0 && <p className="text-gray-500 text-center py-10">No achievements found.</p>}
      </div>
    </div>
  );
};

export default AchievementTab;
