import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, PieChart, Bell, User, LogOut, 
  Settings, HelpCircle, Search
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link to="/" className="ml-3 flex items-center gap-2">
              <PieChart size={28} className="text-primary-600" />
              <span className="text-xl font-bold text-gray-900">PulseCRM</span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search customers, campaigns..."
                  className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm transition duration-150"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                <Bell size={20} />
              </button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200"
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">New campaign created</p>
                        <p className="text-xs text-gray-500 mt-1">Summer Sale campaign has been scheduled</p>
                        <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                      </div>
                      
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">15 new customers added</p>
                        <p className="text-xs text-gray-500 mt-1">Data import completed successfully</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                      
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">Campaign delivered</p>
                        <p className="text-xs text-gray-500 mt-1">Spring Collection campaign delivered to 1,245 customers</p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-200 mt-2">
                      <button className="w-full text-center text-sm text-primary-600 hover:text-primary-800">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Profile dropdown */}
            <div className="relative ml-2" ref={profileRef}>
              <button
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-primary-600" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200"
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings size={16} className="mr-3 text-gray-500" />
                        Settings
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <HelpCircle size={16} className="mr-3 text-gray-500" />
                        Help Center
                      </button>
                    </div>
                    
                    <div className="py-1 border-t border-gray-200">
                      <button 
                        onClick={() => logout()}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-3 text-gray-500" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search - shown only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm transition duration-150"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;