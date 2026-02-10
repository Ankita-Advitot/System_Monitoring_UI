import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  Activity,
  LayoutDashboard,
  Sliders,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NotificationIcon } from '@/components/notifications/NotificationIcon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    path: '/app/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/app/thresholds',
    label: 'Thresholds',
    icon: Sliders
  },
  {
    path: '/app/spike-simulation',
    label: 'Spike Simulation',
    icon: Zap
  },
];

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="animate-slide-in">
              <h1 className="font-bold text-foreground">SysMonitor</h1>
              <p className="text-xs text-muted-foreground">Resource Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'sidebar-item',
                isActive && 'sidebar-item-active'
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="animate-slide-in">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-item w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen border-r border-sidebar-border transition-all duration-300 z-50 hidden md:flex flex-col',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300 flex flex-col w-full',
          collapsed ? 'md:ml-16' : 'md:ml-64',
          'ml-0'
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-none">
                  <SidebarContent isMobile />
                </SheetContent>
              </Sheet>
              <h2 className="text-sm font-medium text-muted-foreground hidden sm:block">System Overview</h2>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <NotificationIcon />
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-xs font-medium text-primary">JD</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
