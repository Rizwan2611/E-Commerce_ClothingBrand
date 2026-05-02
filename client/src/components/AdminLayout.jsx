import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-black selection:text-white relative overflow-hidden">
      {/* signature soft grid background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #50C878 1px, transparent 1px), linear-gradient(to bottom, #50C878 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />

      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 flex flex-col min-h-screen relative z-10">
        {/* Top Bar - Floating & Glass */}
        <header className="px-6 sm:px-10 py-8 flex items-center justify-between sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-6 glass-premium px-8 py-5 rounded-[2.5rem] border-2 border-white/50 depth-md w-full justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 bg-black text-white rounded-2xl hover:scale-105 transition-transform"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-sm font-[1000] text-black uppercase tracking-[0.4em]">{title}</h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">System Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-10 animate-fade-in max-w-full overflow-hidden">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
