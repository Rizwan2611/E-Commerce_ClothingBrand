import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden font-sans selection:bg-black selection:text-white">
      {/* signature soft grid background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #50C878 1px, transparent 1px), linear-gradient(to bottom, #50C878 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />

      {/* Decorative 3D Side - Cinematic */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent animate-pulse" />
        <div className="relative z-10 text-center px-12 animate-float">
          <h1 className="font-rock-salt text-7xl text-white font-black tracking-tighter drop-shadow-[0_0_30px_rgba(80,200,120,0.4)] mb-6">
            VOID<br/>CULTURE
          </h1>
          <p className="text-green-400 font-[1000] uppercase tracking-[0.5em] text-xs">Join the street elite</p>
          <div className="mt-20 grid grid-cols-2 gap-6 opacity-30 perspective-1000">
             <div className="w-48 h-64 bg-zinc-800 rounded-3xl rotate-12 depth-md border border-white/10" />
             <div className="w-48 h-64 bg-zinc-700 rounded-3xl -rotate-12 depth-lg border border-white/10 mt-12" />
          </div>
        </div>
      </div>

      {/* Form Side - Glass 3D */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="three-d-card glass-premium p-12 md:p-16 rounded-[3.5rem] border-2 border-white/50 depth-lg">
            <div className="text-center mb-12">
              <h2 className="font-rock-salt text-4xl font-black text-black mb-4">Wecome Back</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Authorized Access Only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-2">Digital Identity</label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@voidculture.com"
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-green-400 focus:bg-white transition-all outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-2">Secure Cipher</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-green-400 focus:bg-white transition-all outline-none"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest depth-md hover:depth-lg transition-all active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} /> Access System
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                New to the culture?
              </p>
              <Link to="/register" className="inline-block text-black font-black font-rock-salt text-xs hover:text-green-500 transition-colors border-b-2 border-black pb-1 uppercase tracking-widest">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
