import { useState, useEffect, useRef } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    
    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    
    const handleHover = () => cursor.classList.add('hovering');
    const handleLeave = () => cursor.classList.remove('hovering');
    
    window.addEventListener('mousemove', moveCursor);
    const interactives = document.querySelectorAll('a, button, .interactive');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [children]);

  return (
    <div className="min-h-screen bg-canvas flex font-body selection:bg-accent selection:text-canvas relative overflow-hidden">
      <div className="bg-grain opacity-[0.03]" />
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      
      {/* Geometric Silence Backdrop */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none geometric-grid" />

      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Arena */}
      <div className="flex-1 lg:ml-80 flex flex-col min-h-screen relative z-10">
        {/* Top Navigation Protocol */}
        <header className="px-6 lg:px-12 py-8 flex items-center justify-between sticky top-0 z-30 transition-all backdrop-blur-md bg-canvas/40 border-b border-ink/10">
          <div className="flex items-center gap-8 w-full justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-ink hover:text-accent transition-colors"
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-whisper text-[10px] mb-1 opacity-40">Protocol . System</p>
                <h1 className="logo-heritage text-2xl text-ink tracking-tight">{title}</h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4 group interactive">
              <div className="h-1 w-8 bg-accent/30 overflow-hidden relative">
                <div className="absolute inset-0 bg-accent animate-shimmer-sweep" />
              </div>
              <span className="text-whisper text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">System . Online</span>
            </div>
          </div>
        </header>

        {/* Operational Zone */}
        <main className="flex-1 p-6 lg:p-12 animate-fade-in max-w-full overflow-hidden">
          <div className="max-w-[1400px] mx-auto section-quiet">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
