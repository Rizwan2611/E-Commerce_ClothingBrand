import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to VOID CULTURE');
      navigate('/shop');
    } catch (err) {
      let errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Account exists, but password is incorrect. (If you used Google before, please sign in with Google).';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-canvas geometric-grid min-h-screen flex flex-col items-center pt-32 pb-16 px-6">
      <div className="bg-grain opacity-[0.03]" />
      
      <div className="w-full max-w-md mt-auto mb-auto">
        <div className="text-center mb-12">
          <p className="text-whisper mb-6">Initialize . Account</p>
          <h1 className="logo-heritage text-5xl text-ink mb-6">HABIBI</h1>
          <p className="text-whisper opacity-40">Join the Quiet Revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-whisper opacity-60">Identity</label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-border py-4 text-whisper focus:outline-none focus:border-accent"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-4">
              <label className="text-whisper opacity-60">Voice Signature</label>
              <input
                type="tel"
                className="w-full bg-transparent border-b border-border py-4 text-whisper focus:outline-none focus:border-accent"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-whisper opacity-60">Email Protocol</label>
            <input
              type="email"
              className="w-full bg-transparent border-b border-border py-4 text-whisper focus:outline-none focus:border-accent"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-whisper opacity-60">Cipher Key</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full bg-transparent border-b border-border py-4 text-whisper focus:outline-none focus:border-accent"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-mute hover:text-ink transition-colors interactive"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-whisper opacity-60">Confirm Cipher</label>
            <input
              type="password"
              className="w-full bg-transparent border-b border-border py-4 text-whisper focus:outline-none focus:border-accent"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-canvas py-5 text-whisper hover:bg-accent/90 transition-all disabled:opacity-30 interactive tracking-widest uppercase font-bold"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-canvas border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'Confirm Identity'
            )}
          </button>
        </form>

        <div className="relative my-10 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border opacity-20"></div>
          </div>
          <span className="relative px-4 bg-canvas text-[10px] uppercase tracking-[0.3em] text-mute">OR</span>
        </div>

        <button
          onClick={async () => {
            try {
              await loginWithGoogle();
              toast.success('Signed in with Google');
              navigate('/shop');
            } catch (err) {
              toast.error('Google Sign-In failed');
            }
          }}
          className="w-full border border-border py-4 flex items-center justify-center gap-4 hover:bg-ink hover:text-canvas transition-all interactive group"
        >
          <svg className="w-4 h-4 group-hover:invert transition-all" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-whisper">Continue with Google</span>
        </button>

        <div className="mt-16 text-center">
          <p className="text-whisper opacity-60 mb-6 uppercase tracking-widest text-[10px]">
            Already known?
          </p>
          <Link to="/login" className="text-ink font-black uppercase tracking-widest border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors interactive">
            Verify Identity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
