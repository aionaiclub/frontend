import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2 } from 'lucide-react';
import { API_URL } from '../utils/api';

const UserTab = ({ userInfo }) => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${API_URL}/api/users`, config);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(
        `${API_URL}/api/users`,
        { name, email, password, role },
        config
      );
      setMessage('User created successfully');
      setName(''); setEmail(''); setPassword('');
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create user');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${API_URL}/api/users/${id}`, config);
        fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-brand-accent p-6 rounded-xl border border-white/10 h-fit">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <UserPlus className="mr-2" /> Add New User
        </h2>
        {message && <p className="text-sm mb-4 text-green-400">{message}</p>}
        <form onSubmit={submitHandler} className="space-y-4">
          <input required type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
          <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
          <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white" />
          
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 bg-brand-dark border border-gray-600 rounded-md text-white">
            <option value="user">Normal User (Student)</option>
            <option value="admin">Admin</option>
          </select>
          
          <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded-md hover:bg-gray-200 mt-4">
            Create Account
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-brand-accent p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-brand-dark text-gray-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'superadmin' ? 'bg-red-500/20 text-red-400' : user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.role !== 'superadmin' && (
                      <button onClick={() => deleteHandler(user._id)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTab;
