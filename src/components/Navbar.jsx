import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (stored && stored !== 'undefined') {
        const user = JSON.parse(stored);
        setUserInfo(user);
      }
    } catch (error) {
      console.error('Error parsing userInfo', error);
    }
  }, [location]);

  return (
    <nav className="fixed w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/logo.jpg" alt="AIONAI Logo" className="h-12 w-auto mr-2 rounded-full border border-white/20" />
              <span className="text-2xl font-bold tracking-tighter text-white">
                AION<span className="text-gray-400">AI</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              <a href="#about" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
              <a href="#events" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Events</a>
              <a href="#news" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">News</a>
              
              {userInfo ? (
                <Link 
                  to={userInfo.role === 'user' ? '/user-dashboard' : '/admin'} 
                  className="flex items-center bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  <User size={16} className="mr-2" />
                  {userInfo.name?.split(' ')[0]}
                </Link>
              ) : (
                <Link to="/login" className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
                  Login
                </Link>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <a href="#about" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
            <a href="#events" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Events</a>
            <a href="#news" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">News</a>
            
            {userInfo ? (
              <Link 
                to={userInfo.role === 'user' ? '/user-dashboard' : '/admin'} 
                onClick={() => setIsOpen(false)}
                className="bg-white/10 text-white block text-center mt-4 px-3 py-2 rounded-md text-base font-bold"
              >
                Dashboard ({userInfo.name?.split(' ')[0]})
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="bg-white text-black block text-center mt-4 px-3 py-2 rounded-md text-base font-bold">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
