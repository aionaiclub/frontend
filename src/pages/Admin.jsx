import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Plus, Image as ImageIcon, Trash2, LayoutDashboard, Users, Calendar, FileText } from 'lucide-react';
import UserTab from '../components/UserTab';
import EventTab from '../components/EventTab';
import AchievementTab from '../components/AchievementTab';
import { API_URL, getImageUrl } from '../utils/api';
import { Award, Video, Edit } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('news');
  const [posts, setPosts] = useState([]);
  
  // News Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [docFiles, setDocFiles] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

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
        fetchPosts();
      }
    } catch (error) {
      console.error('Invalid user data in localStorage:', error);
      localStorage.removeItem('userInfo');
      navigate('/login');
    }
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/posts`);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) return;

    try {
      setUploading(true);
      let imagePath = '';
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post(`${API_URL}/api/upload`, formData);
        imagePath = data;
      }

      const docUrls = [];
      if (docFiles.length > 0) {
        for (const f of docFiles) {
          const formData = new FormData();
          formData.append('image', f);
          const { data } = await axios.post(`${API_URL}/api/upload`, formData);
          docUrls.push({ name: f.name, url: data });
        }
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const postData = { title, description, image: imagePath, documents: docUrls, youtubeUrl };

      if (editingPost) {
        await axios.put(`${API_URL}/api/posts/${editingPost._id}`, postData, config);
        alert('Post Updated!');
      } else {
        await axios.post(`${API_URL}/api/posts`, postData, config);
        alert('Post Published!');
      }

      resetForm();
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert('Error saving post');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setDocFiles([]);
    setYoutubeUrl('');
    setEditingPost(null);
  };

  const editHandler = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setYoutubeUrl(post.youtubeUrl || '');
    setActiveTab('news');
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this post?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${API_URL}/api/posts/${id}`, config);
        fetchPosts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-brand-dark pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Hub</h1>
            <p className="text-gray-400">Managing AIONAI Club as {userInfo.role}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('news')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'news' ? 'bg-white text-black' : 'bg-brand-accent text-white hover:bg-white/10'}`}
            >
              <LayoutDashboard size={18} className="mr-2" /> News
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'events' ? 'bg-white text-black' : 'bg-brand-accent text-white hover:bg-white/10'}`}
            >
              <Calendar size={18} className="mr-2" /> Events
            </button>
            {userInfo && userInfo.role === 'superadmin' && (
              <>
                <button 
                  onClick={() => setActiveTab('achievements')}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'achievements' ? 'bg-white text-black' : 'bg-brand-accent text-white hover:bg-white/10'}`}
                >
                  <Award size={18} className="mr-2" /> Achievements
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'users' ? 'bg-white text-black' : 'bg-brand-accent text-white hover:bg-white/10'}`}
                >
                  <Users size={18} className="mr-2" /> Users
                </button>
              </>
            )}
            <button onClick={logoutHandler} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors ml-4 shadow-lg shadow-red-500/20">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-brand-accent p-6 rounded-xl border border-white/10 h-fit shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  {editingPost ? <Edit className="mr-2" /> : <Plus className="mr-2" />} 
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h2>
                {editingPost && <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white underline">Cancel</button>}
              </div>
              <form onSubmit={submitHandler} className="space-y-4">
                <input required type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
                <textarea required rows={4} placeholder="Content" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center"><Video size={14} className="mr-1 text-red-500"/> YouTube URL (Optional)</label>
                  <input type="text" placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image</label>
                    <label className="cursor-pointer bg-brand-dark border border-gray-600 p-2 rounded-md hover:border-white transition-colors flex items-center justify-center w-full">
                      <ImageIcon size={18} className="mr-2 text-gray-400" />
                      <span className="text-gray-300 text-xs truncate">{file ? file.name : 'Select'}</span>
                      <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Attachments</label>
                    <label className="cursor-pointer bg-brand-dark border border-gray-600 p-2 rounded-md hover:border-white transition-colors flex items-center justify-center w-full">
                      <FileText size={18} className="mr-2 text-gray-400" />
                      <span className="text-gray-300 text-xs truncate">{docFiles.length > 0 ? `${docFiles.length} files` : 'Select'}</span>
                      <input type="file" multiple className="hidden" onChange={(e) => setDocFiles(Array.from(e.target.files))} />
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-white text-black font-bold py-3 rounded-md hover:bg-gray-200 disabled:bg-gray-500 transition-all shadow-lg">
                  {uploading ? 'Posting News...' : 'Publish Post'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Recent Posts</h2>
              {posts.map((post) => (
                <div key={post._id} className="bg-brand-accent p-4 rounded-xl border border-white/10 flex items-center justify-between group hover:border-white/30 transition-all">
                  <div className="flex items-center space-x-4">
                    {post.image && <img src={getImageUrl(post.image)} className="w-16 h-16 object-cover rounded-lg" />}
                    <div>
                      <h3 className="text-white font-bold">{post.title}</h3>
                      <p className="text-gray-400 text-xs line-clamp-1">{post.description}</p>
                      {post.documents?.length > 0 && <span className="text-[10px] text-blue-400 mt-1 block">{post.documents.length} attachments</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => editHandler(post)} className="text-gray-500 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"><Edit size={20} /></button>
                    <button onClick={() => deleteHandler(post._id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p className="text-gray-500 text-center py-10">No posts found.</p>}
            </div>
          </div>
        )}

        {activeTab === 'events' && <EventTab userInfo={userInfo} />}
        {activeTab === 'achievements' && userInfo.role === 'superadmin' && <AchievementTab userInfo={userInfo} />}
        {activeTab === 'users' && userInfo.role === 'superadmin' && <UserTab userInfo={userInfo} />}
      </div>
    </div>
  );
};

export default Admin;
