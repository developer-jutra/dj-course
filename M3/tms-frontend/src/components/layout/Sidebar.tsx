import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Truck } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: '📊' },
  { title: 'Transportation Orders', url: '/orders', icon: '📦' },
  { title: 'Route Planner', url: '/routes', icon: '🗺️' },
  { title: 'Drivers', url: '/drivers', icon: '👨‍✈️' },
  { title: 'Fleet', url: '/vehicles', icon: '🚚' },
  { title: 'Documents', url: '/documents', icon: '📄' },
  { title: 'Maintenance', url: '/maintenance', icon: '🔧' },
  { title: 'Payments', url: '/payments', icon: '💳' },
  { title: 'Expenses', url: '/expenses', icon: '💷' },
  { title: 'Urgent', url: '/urgent', icon: '🚨' },
  { title: 'Transit Incidents', url: '/incidents', icon: '⚠️' },
  { title: 'Customer Claims', url: '/claims', icon: '📋' },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const getNavClass = (path: string) => {
    const { pathname } = location;
    const isActive =
      path === '/dashboard' ? pathname === path : pathname.startsWith(path);
    return isActive
      ? 'bg-slate-100 text-slate-900 font-medium'
      : 'hover:bg-gray-100';
  };

  return (
    <Sidebar className={isCollapsed ? "w-20" : "w-64"} collapsible="icon">
      <div className="h-16 p-3 border-b">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
          <span
            className="
              ml-1
              h-10 w-10 flex items-center justify-center rounded-lg
              bg-gray-800
              transition-colors
            "
          >
            <img src="/deliveroo-logo.png" alt="Deliveroo Logo" className="h-8 w-8" />
          </span>
          {!isCollapsed && (
            <div className="text-2xl font-bold">
              Deliveroo
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        {/* User Profile Section */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate">{user?.company}</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild label={item.title}>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <span className="text-lg mr-3">{item.icon}</span>
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Mobile Logout Button */}
        <div className="p-4 border-t mt-auto md:hidden">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
            size={isCollapsed ? "sm" : "default"}
          >
            {isCollapsed ? '🚪' : '🚪 Logout'}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
