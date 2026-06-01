import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { customer, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 selection:bg-accent selection:text-canvas ${
        menuOpen ? 'bg-canvas' : 'bg-white/10 backdrop-blur-2xl border-b border-white/30 shadow-[0_8px_32px_rgba(42,34,27,0.05)]'
      }`}>
      <div className="max-w-full mx-auto px-6 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section - Understated */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="group interactive" onClick={() => setMenuOpen(false)}>
              <span className="logo-heritage text-2xl md:text-3xl text-ink font-normal uppercase tracking-[0.3em] transition-all duration-500 hover:text-accent">
                HABIBI
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Precise Whisper */}
          <div className="hidden md:flex flex-none justify-center items-center gap-20">
            <Link to="/" className="text-whisper text-[10px] hover:text-accent transition-all interactive">
              Discovery
            </Link>
            <Link to="/shop" className="text-whisper text-[10px] hover:text-accent transition-all interactive">
              Archive
            </Link>
            <Link to="/location" className="text-whisper text-[10px] hover:text-accent transition-all interactive">
              Contact
            </Link>
          </div>

          {/* Actions - Right */}
          <div className="flex-1 flex items-center justify-end gap-12">
            {/* Auth Signature */}
            <div className="hidden md:block">
              {customer ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="text-whisper text-[10px] flex items-center gap-3 text-ink hover:text-accent transition-all interactive"
                  >
                    <User size={12} />
                    <span>{customer.name.split(' ')[0]}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-12 bg-canvas border border-border w-64 py-8 shadow-deep animate-fade-in-up glass-premium">
                        {/* Identity Hub */}
                        <div className="px-8 pb-6 border-b border-ink/5 mb-4">
                          <p className="text-whisper text-[10px] font-black tracking-[0.2em] text-ink uppercase mb-2">
                            {customer.name}
                          </p>
                          <p className="text-whisper text-[9px] opacity-40 lowercase tracking-wider">
                            {customer.email}
                          </p>
                        </div>

                        <div className="px-4">
                          <Link
                            to="/orders"
                            className="text-whisper text-[9px] flex items-center gap-4 px-4 py-3 text-ink/60 hover:text-accent hover:bg-ink/[0.02] transition-all interactive"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Package size={12} /> Order Archive
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="text-whisper text-[9px] flex items-center gap-4 w-full px-4 py-3 text-red-900/60 hover:text-red-900 hover:bg-red-900/[0.02] transition-all interactive"
                          >
                            <LogOut size={12} /> Disconnect
                          </button>
                        </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-whisper text-[10px] text-accent border-b border-accent/20 hover:border-accent pb-1 transition-all interactive">
                  Identification
                </Link>
              )}
            </div>

            {/* Cart Icon - Geometric */}
            <Link to="/cart" className="relative group interactive">
              <ShoppingBag size={18} className="text-ink group-hover:text-accent transition-all" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-accent text-[8px] font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-ink hover:text-accent transition-colors interactive"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Liquid Overlay */}
      <div 
        className={`md:hidden fixed inset-x-0 top-20 bottom-0 bg-canvas z-[100] px-8 py-12 overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-8 invisible'
        }`}
      >
        <div className="flex flex-col gap-8 min-h-full pb-8">
          {/* Identity Hub - Mobile */}
          {customer && (
            <div className={`mb-4 transition-all duration-1000 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <p className="text-whisper text-[11px] font-black tracking-[0.3em] text-accent uppercase mb-2">{customer.name}</p>
              <p className="text-whisper text-[10px] opacity-40 lowercase">{customer.email}</p>
              <div className="h-px w-8 bg-accent/20 mt-8" />
            </div>
          )}

          {[
            { label: 'Home', path: '/', delay: '100ms' },
            { label: 'Archive', path: '/shop', delay: '200ms' },
            { label: 'Contact', path: '/location', delay: '300ms' }
          ].map((item) => (
            <Link 
              key={item.label}
              to={item.path} 
              onClick={() => setMenuOpen(false)} 
              className={`logo-heritage text-5xl text-ink hover:text-accent transition-all duration-700 ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: item.delay }}
            >
              {item.label}
            </Link>
          ))}
          
          <div className={`pt-12 transition-all duration-1000 delay-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            {customer ? (
              <div className="flex flex-col gap-8">
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-whisper text-accent font-black tracking-widest uppercase">View History</Link>
                <button onClick={handleLogout} className="text-whisper text-red-900/60 text-left font-black tracking-widest uppercase">Disconnect</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-whisper text-accent font-black tracking-widest uppercase">Identification</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
