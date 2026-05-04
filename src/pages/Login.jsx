import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo && userInfo !== 'undefined') {
        const user = JSON.parse(userInfo);
        if (user.role === 'user') navigate('/user-dashboard');
        else navigate('/admin');
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('userInfo');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.role === 'user') {
        navigate('/user-dashboard');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-md w-full space-y-8 bg-brand-accent p-10 rounded-2xl border border-white/10 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {role === 'user' ? 'Student Login' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {role === 'user' ? 'Sign in to access events and live sessions' : 'Sign in to manage AIONAI Club content'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Login Type</label>
              <select
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 bg-brand-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm transition-all"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Student (Normal User)</option>
                <option value="admin">Admin / Super Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 bg-brand-dark placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 bg-brand-dark placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-white transition-all transform hover:scale-[1.02]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
