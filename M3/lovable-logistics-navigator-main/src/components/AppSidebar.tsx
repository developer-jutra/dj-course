import { LayoutDashboard, Truck, Package, AlertTriangle, FileText, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Zarządzanie Flotą", url: "/fleet", icon: Truck },
  { title: "Zgłoszenia Transportowe", url: "/shipments", icon: Package },
  { title: "Incydenty", url: "/incidents", icon: AlertTriangle },
  { title: "Negocjacje Umów", url: "/contracts", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Wylogowano pomyślnie");
    navigate("/login");
  };

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary rounded-lg p-2">
            <Truck className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-sm font-bold text-sidebar-foreground">Logistics</h2>
              <p className="text-xs text-sidebar-foreground/70">Manager Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Główne</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="hover:bg-sidebar-accent">
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Wyloguj</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
