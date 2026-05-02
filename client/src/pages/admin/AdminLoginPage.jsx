import { useState } from 'react';
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

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      await googleLogin(tokenResponse.credential || tokenResponse.access_token);
      toast.success('Successfully Signed In with Google');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Google Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google Login Failed')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Successfully Signed In');
        navigate('/admin/dashboard');
      } else {
        await register(name, email, password, contact);
        toast.success('Successfully Registered');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-zinc-50 font-sans overflow-hidden relative">
      {/* Soft Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #50C878 1px, transparent 1px), linear-gradient(to bottom, #50C878 1px, transparent 1px)', 
          backgroundSize: '60px 60px' 
        }} 
      />

      {/* Form Panel - Centered */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 relative z-10 overflow-y-auto items-center py-20">
         <div className="w-full max-w-md three-d-card glass-premium p-10 rounded-[3rem] border-2 border-white/50 depth-lg">
           {/* Form Header */}
           <div className="mb-10 text-center flex flex-col items-center">
              <div className="w-full flex justify-center">
                <img src="/images/void-culture-logo.png" alt="VOID CULTURE" className="h-20 sm:h-24 w-auto mix-blend-multiply drop-shadow-xl" />
              </div>
              <p className="mt-4 text-xs font-[1000] text-zinc-400 uppercase tracking-[0.4em]">Management Portal</p>
           </div>

           {/* Simple Mode Toggle */}
           <div className="flex bg-zinc-100 p-2 rounded-[2rem] mb-8 border-2 border-zinc-200">
               <button 
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-4 rounded-[1.5rem] text-sm font-[1000] uppercase tracking-widest transition-all duration-300 ${isLogin ? 'bg-black text-white shadow-xl translate-z-10' : 'text-zinc-400 hover:text-black'}`}
               >
                 Sign In
               </button>
               <button 
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-4 rounded-[1.5rem] text-sm font-[1000] uppercase tracking-widest transition-all duration-300 ${!isLogin ? 'bg-black text-white shadow-xl translate-z-10' : 'text-zinc-400 hover:text-black'}`}
               >
                 Register
               </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  {/* Full Name */}
                  <div className="space-y-2 group">
                     <label className="text-black font-bold uppercase text-[10px] tracking-[0.2em] pl-1">Full Name</label>
                     <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" size={18} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none transition-all depth-sm focus:depth-md"
                          placeholder="Enter your full name"
                          required={!isLogin}
                        />
                     </div>
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2 group">
                     <label className="text-black font-bold uppercase text-[10px] tracking-[0.2em] pl-1">Contact Number</label>
                     <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" size={18} />
                        <input
                          type="tel"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="w-full bg-white/50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none transition-all depth-sm focus:depth-md"
                          placeholder="Enter your phone number"
                          required={!isLogin}
                        />
                     </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="space-y-2 group">
                 <label className="text-black font-bold uppercase text-[10px] tracking-[0.2em] pl-1">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none transition-all depth-sm focus:depth-md"
                      placeholder="Enter your email address"
                      required
                    />
                 </div>
              </div>
              
              {/* Password */}
              <div className="space-y-2 group">
                 <label className="text-black font-bold uppercase text-[10px] tracking-[0.2em] pl-1">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none transition-all depth-sm focus:depth-md"
                      placeholder="••••••••"
                      required
                    />
                 </div>
              </div>

              {isLogin && (
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-black uppercase tracking-wider underline underline-offset-4">Forgot Password?</a>
                </div>
              )}

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-zinc-800 text-white font-[1000] uppercase tracking-widest text-sm py-5 rounded-[2rem] transition-all depth-md hover:depth-lg hover:-translate-y-1 flex items-center justify-center gap-4 mt-8"
              >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    isLogin ? <LogIn size={18} /> : <UserPlus size={18} />
                  )}
                  <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
              </button>
           </form>

           {/* Social Auth Option */}
           <div className="mt-10 pt-10 border-t-2 border-zinc-100 border-dashed">
               <button 
                  type="button" 
                  onClick={() => loginWithGoogle()}
                  className="w-full bg-white border-2 border-black text-black font-[1000] uppercase tracking-widest text-sm py-4 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all depth-sm hover:depth-md active:scale-95"
                >
                 <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                 </svg>
                 Continue with Google
               </button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
