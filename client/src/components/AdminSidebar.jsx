import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, LogOut, X, Settings, Images
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const { shopkeeper, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-canvas border-r border-ink/10">
      {/* Brand Protocol */}
      <div className="p-12 border-b border-ink/10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="logo-heritage text-3xl text-ink tracking-tighter">HABIBI</h2>
            {onClose && (
              <button onClick={onClose} className="text-ink hover:text-accent transition-colors lg:hidden">
                <X size={20} />
              </button>
            )}
          </div>
          <p className="text-whisper text-[9px] text-accent tracking-[0.5em]">ARCHIVE . PORTAL</p>
        </div>
      </div>

      {/* Navigation Matrix */}
      <nav className="flex-1 p-8 space-y-3 overflow-y-auto">
        <p className="text-whisper text-[8px] opacity-20 mb-8 px-6 uppercase tracking-[0.5em]">Navigation . Elements</p>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-6 px-6 py-5 transition-all duration-700 group interactive relative overflow-hidden ${
                isActive 
                  ? 'bg-ink text-canvas' 
                  : 'text-ink/40 hover:text-ink hover:bg-ink/[0.02] hover:pl-10'
              }`}
            >
              {/* Active Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-accent transition-transform duration-700 ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`} />
              
              <Icon size={14} className={`transition-colors duration-500 ${isActive ? 'text-canvas' : 'group-hover:text-accent'}`} />
              
              <span className={`text-[10px] tracking-[0.4em] font-bold uppercase transition-all duration-500 ${
                isActive ? 'text-canvas' : 'group-hover:text-accent group-hover:translate-x-1'
              }`}>
                {label}
              </span>

              {isActive && (
                <div className="ml-auto">
                  <div className="w-1 h-1 bg-canvas rounded-full" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Identity Zone */}
      <div className="p-8 border-t border-ink/10 bg-ink/[0.02] space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-ink/20 flex items-center justify-center bg-canvas group interactive hover:border-accent transition-all duration-500">
            <span className="logo-heritage text-lg text-ink">
              {shopkeeper?.name?.charAt(0) || 'H'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-whisper text-[9px] text-ink truncate font-bold">{shopkeeper?.name || 'Admin'}</p>
            <p className="text-[9px] font-mono opacity-40 truncate lowercase">{shopkeeper?.email || 'admin@habibi.com'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-4 w-full border border-ink/10 hover:border-accent/40 text-whisper text-[9px] py-5 transition-all interactive opacity-60 hover:opacity-100 bg-canvas hover:bg-ink hover:text-canvas font-bold tracking-[0.3em]"
        >
          <LogOut size={12} />
          <span>TERMINATE . SESSION</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Perspective */}
      <div className="fixed top-0 left-0 bottom-0 w-80 hidden lg:flex flex-col z-40 transition-all">
        {sidebarContent}
      </div>

      {/* Mobile Perspective */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-canvas/80 backdrop-blur-md" onClick={onClose} />
          <div className="relative w-full max-w-xs h-full flex flex-col animate-slide-right shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
