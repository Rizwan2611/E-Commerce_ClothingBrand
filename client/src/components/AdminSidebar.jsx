import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, LogOut, X, Settings
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

  const SidebarContent = () => (
    <>
      {/* Brand Label */}
      <div className="p-10 border-b border-zinc-100">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="font-rock-salt text-2xl font-black text-black uppercase tracking-tighter">VOID Culture</h2>
            {onClose && (
              <button onClick={onClose} className="text-black hover:scale-125 transition-transform lg:hidden">
                <X size={24} />
              </button>
            )}
          </div>
          <p className="text-green-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Admin Portal</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 group three-d-card ${
                isActive 
                  ? 'bg-black text-white shadow-xl translate-z-10 border-2 border-black' 
                  : 'text-zinc-500 hover:text-black hover:bg-zinc-100 hover:border-zinc-200 border-2 border-transparent'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-green-400' : 'group-hover:text-green-500 transition-colors'} />
              <span className="text-sm font-[1000] uppercase tracking-widest">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-8 border-t border-zinc-100">
        <div className="glass bg-zinc-50 rounded-[2rem] p-5 mb-6 border border-zinc-200 depth-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border-2 border-green-400/20">
              <span className="text-green-400 text-lg font-black uppercase">
                {shopkeeper?.name?.charAt(0) || 'V'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-black text-xs font-[1000] uppercase tracking-tight truncate">{shopkeeper?.name || 'Admin'}</p>
              <p className="text-zinc-400 text-[10px] font-bold truncate lowercase">{shopkeeper?.email || 'admin@store.com'}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full bg-white hover:bg-red-50 text-zinc-400 hover:text-red-500 py-4 rounded-2xl border-2 border-zinc-100 hover:border-red-100 transition-all text-xs font-[1000] uppercase tracking-widest"
        >
          <LogOut size={14} />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar - Floating & Glass */}
      <div className="fixed top-8 left-8 bottom-8 w-72 glass-premium rounded-[3rem] depth-lg border-2 border-white/50 hidden lg:flex flex-col z-40 overflow-hidden transition-all duration-500 hover:scale-[1.02]">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
          <div className="relative w-full max-w-sm h-full glass-premium rounded-[3rem] border-2 border-white/50 flex flex-col animate-slide-right overflow-hidden shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
