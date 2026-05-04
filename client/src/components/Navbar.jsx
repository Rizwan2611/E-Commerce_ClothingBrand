import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Package, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { customer, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] lg:w-[90%] glass-premium rounded-[2.5rem] depth-lg border-2 border-white/50 animate-fade-in transition-all duration-500 hover:top-5">
      <div className="max-w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo Section */}
          <div className="flex-none md:flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
              <span className="logo-heritage text-3xl md:text-4xl font-normal uppercase tracking-tighter hover:scale-105 transition-transform duration-300">
                VOID CULTURE
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-10">
            <Link to="/" className="text-sm font-[1000] tracking-[0.4em] hover:scale-110 hover:text-amber-500 transition-all duration-300 uppercase">
              HOME
            </Link>
            <Link to="/shop" className="text-sm font-[1000] tracking-[0.4em] hover:scale-110 hover:text-amber-500 transition-all duration-300 uppercase">
              SHOP
            </Link>
            <Link to="/location" className="text-sm font-[1000] tracking-[0.4em] hover:scale-110 hover:text-amber-500 transition-all duration-300 uppercase">
              FIND US
            </Link>
          </div>

          {/* Actions - Right */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 bg-[#1A120B]/5 hover:bg-[#1A120B]/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-all duration-300 border border-[#1A120B]/10 dark:border-white/10 group active:scale-90"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun size={20} className="text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon size={20} className="text-[#1A120B] group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative group hover:scale-110 transition-transform duration-300">
              <img src="/images/brush-cart.png" alt="Cart" className="h-12 w-auto mix-blend-multiply dark:invert group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all duration-300" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-black transform group-hover:scale-110 transition-transform">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {customer ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-zinc-100 hover:bg-amber-50 border-2 border-black hover:border-amber-400 px-3 py-2 rounded-xl text-sm text-black transition-all duration-300"
                >
                  <User size={16} className="text-amber-500" />
                  <span className="hidden sm:block">{customer.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-black rounded-xl shadow-2xl w-48 py-2 animate-fade-in">
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:text-amber-500 hover:bg-amber-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Package size={14} /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-zinc-100"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-4 text-sm">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-zinc-600 hover:text-amber-500 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-black animate-slide-up shadow-lg">
          <div className="px-4 py-8 space-y-6 flex flex-col items-center">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-3xl font-black hover:scale-110 hover:text-amber-500 transition-all uppercase">
              HOME
            </Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-3xl font-black hover:scale-110 hover:text-amber-500 transition-all uppercase">
              SHOP
            </Link>
            <Link to="/location" onClick={() => setMenuOpen(false)} className="text-3xl font-black hover:scale-110 hover:text-amber-500 transition-all uppercase">
              FIND US
            </Link>
            {customer && (
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-black font-black font-rock-salt text-xl uppercase tracking-widest pt-4 hover:text-amber-500 transition-colors">My Orders</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
