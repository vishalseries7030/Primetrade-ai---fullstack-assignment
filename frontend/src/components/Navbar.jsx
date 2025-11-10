import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, BarChart3 } from 'lucide-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">TaskVerse</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition"
                >
                  <BarChart3 size={20} />
                  <span>Analytics</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-blue-100">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
