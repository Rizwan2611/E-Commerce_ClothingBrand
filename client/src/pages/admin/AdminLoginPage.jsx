import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, UserPlus, User, Phone } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const AdminLoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, googleLogin } = useAdminAuth();
  const navigate = useNavigate();
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
  }, [isLogin]);

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      await googleLogin(tokenResponse.credential || tokenResponse.access_token);
      toast.success('System Access Granted');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google Access Denied')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Access Granted');
        navigate('/admin/dashboard');
      } else {
        await register(name, email, password, contact);
        toast.success('Profile Archived');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized Access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-canvas font-body overflow-hidden relative text-ink">
      <div className="bg-grain opacity-[0.03]" />
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      
      {/* Geometric Backdrop */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none geometric-grid" />

      {/* Operational Core */}
      <div className="flex-1 flex flex-col justify-center px-6 relative z-10 items-center py-20 overflow-y-auto">
         <div className="w-full max-w-md bg-canvas border border-ink/20 p-12 lg:p-16 relative">
           
           {/* Protocol Header */}
           <div className="mb-16 text-center">
              <h2 className="logo-heritage text-6xl text-ink tracking-tighter mb-4">HABIBI</h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-accent/30" />
                <p className="text-whisper text-[9px] text-accent tracking-[0.5em]">SYSTEM . ENTRY</p>
                <div className="h-px w-8 bg-accent/30" />
              </div>
           </div>

           {/* Mode Matrix */}
           <div className="flex border-b border-ink/10 mb-12">
               <button 
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-4 text-whisper text-[10px] tracking-widest transition-all duration-500 interactive ${isLogin ? 'text-ink border-b-2 border-accent' : 'text-ink/30 hover:text-ink'}`}
               >
                 SIGN IN
               </button>
               <button 
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-4 text-whisper text-[10px] tracking-widest transition-all duration-500 interactive ${!isLogin ? 'text-ink border-b-2 border-accent' : 'text-ink/30 hover:text-ink'}`}
               >
                 SIGN UP
               </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-10">
              {!isLogin && (
                <>
                  <div className="space-y-3">
                     <label className="text-whisper text-[9px] text-accent opacity-60 px-1">Full Name</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 group-focus-within:text-accent transition-colors" size={14} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent border-b border-ink/20 focus:border-accent py-4 pl-12 text-sm font-medium focus:outline-none transition-all placeholder:text-ink/5 text-ink"
                          placeholder="ENTERING NAME..."
                          required={!isLogin}
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-whisper text-[9px] text-accent opacity-60 px-1">Contact</label>
                     <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 group-focus-within:text-accent transition-colors" size={14} />
                        <input
                          type="tel"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="w-full bg-transparent border-b border-ink/20 focus:border-accent py-4 pl-12 text-sm font-medium focus:outline-none transition-all placeholder:text-ink/5 text-ink"
                          placeholder="ENTERING PHONE..."
                          required={!isLogin}
                        />
                     </div>
                  </div>
                </>
              )}

              <div className="space-y-3">
                 <label className="text-whisper text-[9px] text-accent opacity-60 px-1">Email Matrix</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 group-focus-within:text-accent transition-colors" size={14} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-ink/20 focus:border-accent py-4 pl-12 text-sm font-medium focus:outline-none transition-all placeholder:text-ink/5 text-ink"
                      placeholder="ENTERING EMAIL..."
                      required
                    />
                 </div>
              </div>
              
              <div className="space-y-3">
                 <label className="text-whisper text-[9px] text-accent opacity-60 px-1">Security Key</label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 group-focus-within:text-accent transition-colors" size={14} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-ink/20 focus:border-accent py-4 pl-12 text-sm font-medium focus:outline-none transition-all placeholder:text-ink/5 text-ink"
                      placeholder="••••••••"
                      required
                    />
                 </div>
              </div>

              {/* Submit Protocol */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ink text-canvas font-bold text-[10px] tracking-[0.4em] py-6 transition-all interactive flex items-center justify-center gap-4 mt-12 hover:bg-accent uppercase"
              >
                  {loading ? (
                     <div className="w-4 h-4 border border-canvas/20 border-t-canvas rounded-full animate-spin" />
                  ) : (
                    isLogin ? <LogIn size={14} /> : <UserPlus size={14} />
                  )}
                  <span>{loading ? 'PROCESSING...' : (isLogin ? 'INITIATE SESSION' : 'CREATE ACCOUNT')}</span>
              </button>
           </form>

           {/* Alternate Entry */}
           <div className="mt-16 pt-12 border-t border-ink/10 border-dashed">
               <button 
                  type="button" 
                  onClick={() => loginWithGoogle()}
                  className="w-full border border-ink/30 text-whisper text-[9px] tracking-widest py-4 flex items-center justify-center gap-3 hover:bg-ink hover:text-canvas transition-all interactive opacity-80 hover:opacity-100"
                >
                 <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                 </svg>
                 GOOGLE . AUTHENTICATION
               </button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
