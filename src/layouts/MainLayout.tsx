import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Bell, X } from 'lucide-react';

type Notification = {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
};

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const location = useLocation();

  // Example notification system
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [
      { ...notification, id, timestamp: new Date() },
      ...prev.slice(0, 4) // Keep only the 5 most recent notifications
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Demonstrate notifications on page changes
  useEffect(() => {
    if (location.pathname === '/campaigns') {
      setTimeout(() => {
        addNotification({
          message: 'Campaign analytics updated',
          type: 'info'
        });
      }, 1000);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`p-4 rounded-lg shadow-lg flex items-start gap-3
                ${notification.type === 'success' ? 'bg-success-500 text-white' : ''}
                ${notification.type === 'info' ? 'bg-primary-500 text-white' : ''}
                ${notification.type === 'warning' ? 'bg-warning-500 text-white' : ''}
                ${notification.type === 'error' ? 'bg-error-500 text-white' : ''}
              `}
            >
              <Bell size={20} />
              <p className="flex-1">{notification.message}</p>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="text-white hover:text-gray-100"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;