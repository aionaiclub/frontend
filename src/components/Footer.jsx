import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-black text-white tracking-tighter mb-6 block">
              AION<span className="text-gray-500">AI</span> CLUB
            </Link>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              Empowering students through cutting-edge technology and collaborative innovation. Join our community of AI enthusiasts and build the future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-blue-600 transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-blue-400 transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-blue-700 transition-all">
                <Globe size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#events" className="hover:text-white transition-colors">Upcoming Events</a></li>
              <li><a href="#news" className="hover:text-white transition-colors">Latest News</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Contact</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center"><Mail size={16} className="mr-3 text-blue-500" /> contact@aionai.club</li>
              <li className="flex items-center"><Phone size={16} className="mr-3 text-blue-500" /> +91 98765 43210</li>
              <li className="flex items-center"><MapPin size={16} className="mr-3 text-blue-500" /> AI Innovation Hub, Campus</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AIONAI Club. All rights reserved. Designed with ❤️ by AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
