import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Target, Mail, 
  BarChart3, Settings, HelpCircle, Database
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, isOpen, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
        ${isActive 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-gray-700 hover:bg-gray-100'
        }
      `}
      onClick={onClick}
    >
      <div className={`${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="font-medium"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Handle outside clicks on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768
      ) {
        // Close sidebar on mobile when clicking outside
        // This would typically call the toggle function
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      ref={sidebarRef}
      className={`
        bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-20
        ${isOpen ? 'w-64' : 'w-16'}
        ${isOpen ? 'shadow-md md:shadow-none' : ''}
        fixed md:relative inset-y-0 left-0 h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        {/* Logo or branding could go here if needed */}
      </div>
      
      <div className="p-3 space-y-1">
        <NavItem
          to="/"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          isOpen={isOpen}
        />
        <NavItem
          to="/customers"
          icon={<Users size={20} />}
          label="Customers"
          isOpen={isOpen}
        />
        <NavItem
          to="/segments"
          icon={<Target size={20} />}
          label="Segments"
          isOpen={isOpen}
        />
        <NavItem
          to="/campaigns"
          icon={<Mail size={20} />}
          label="Campaigns"
          isOpen={isOpen}
        />
        <NavItem
          to="/analytics"
          icon={<BarChart3 size={20} />}
          label="Analytics"
          isOpen={isOpen}
        />
        <NavItem
          to="/data-ingestion"
          icon={<Database size={20} />}
          label="Data Ingestion"
          isOpen={isOpen}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 space-y-1">
        <NavItem
          to="/settings"
          icon={<Settings size={20} />}
          label="Settings"
          isOpen={isOpen}
        />
        <NavItem
          to="/help"
          icon={<HelpCircle size={20} />}
          label="Help"
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

export default Sidebar;