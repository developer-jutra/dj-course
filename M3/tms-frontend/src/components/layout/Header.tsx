import React, { useState, useRef } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Truck, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import NotificationsPanel from '@/components/NotificationsPanel';
import { useNotificationsQuery } from '@/http/notifications.queries';

const Header: React.FC = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: notifications = [] } = useNotificationsQuery();
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 relative">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          ref={notificationsButtonRef}
          variant="ghost"
          size="sm"
          className="relative"
          onClick={handleNotificationsToggle}
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-gray-900" 
          onClick={handleProfileClick}
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </Button>
        
        {/* Desktop logout button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-gray-900" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>

      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        triggerRef={notificationsButtonRef}
      />
    </header>
  );
};

export default Header;
