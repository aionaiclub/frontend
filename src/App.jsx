import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import LiveEventAdmin from './pages/LiveEventAdmin';
import LiveEventUser from './pages/LiveEventUser';
import NewsDetail from './pages/NewsDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-dark text-white flex flex-col font-inter">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/live-admin/:id" element={<LiveEventAdmin />} />
            <Route path="/live/:id" element={<LiveEventUser />} />
            <Route path="/news/:id" element={<NewsDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
