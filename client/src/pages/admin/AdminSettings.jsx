import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../lib/axios';
import AdminLayout from '../../components/AdminLayout';
import { toast } from 'react-hot-toast';
import { Save, MapPin, Phone, Mail, Store, Settings, Globe, Lock, Unlock, Search, Loader2 } from 'lucide-react';

const AdminSettings = () => {
  const [form, setForm] = useState({
    shopName: '',
    address: '',
    phone: '',
    email: '',
    instagram: '',
    lat: '',
    lng: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    adminApi.get('/admin/settings')
      .then(res => {
        const settings = res.data.settings || {};
        setForm(settings);
        if (settings.address) {
          setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&z=17&output=embed`);
        } else if (settings.lat && settings.lng) {
          setMapUrl(`https://www.google.com/maps?q=${settings.lat},${settings.lng}&z=17&output=embed`);
        }
        setLoading(false);
      })
      .catch(() => { toast.error('Failed to load settings'); setLoading(false); });
  }, []);

  // Optimized geocoding with visual feedback
  useEffect(() => {
    // Only search if UNLOCKED and address is substantial
    if (!isLocked && form.address && form.address.trim().length > 10) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      
      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          // 1. Update the Map URL immediately using text (this is most stable)
          setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(form.address)}&z=17&output=embed`);

          // 2. Background attempt for precision coordinates (for directions feature)
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}&limit=1`);
          const data = await res.json();
          
          if (data && data.length > 0) {
            const newLat = parseFloat(data[0].lat);
            const newLng = parseFloat(data[0].lon);
            
            // Only update form if coordinates are valid and different
            setForm(prev => {
              if (Math.abs(prev.lat - newLat) < 0.0001 && Math.abs(prev.lng - newLng) < 0.0001) return prev;
              return { ...prev, lat: newLat, lng: newLng };
            });
          }
        } catch (err) {
          console.error('Background geocoding error:', err);
        } finally {
          setIsSearching(false);
        }
      }, 2000); // Longer 2s debounce for maximum typing stability
    }

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [form.address, isLocked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLocked) return toast.error('Please lock the location to verify your shop address');
    setSaving(true);
    try {
      await adminApi.put('/admin/settings', form);
      toast.success('Store settings updated');
    } catch (err) { 
      const msg = err.response?.data?.message || 'Failed to save settings';
      toast.error(msg); 
    }
    finally { setSaving(false); }
  };

  if (loading) return (
    <AdminLayout title="Settings">
      <div className="h-96 bg-white border-2 border-zinc-100 rounded-[3rem] animate-pulse" />
    </AdminLayout>
  );

  return (
    <AdminLayout title="System Configuration">
      <div className="max-w-4xl mx-auto pb-32">
        <div className="border border-ink/10 bg-canvas relative overflow-hidden">
          {/* Settings Header Protocol */}
          <div className="p-12 border-b border-ink/10 flex items-center justify-between bg-ink/[0.01]">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 bg-accent" />
                <h2 className="text-whisper text-[10px] font-bold uppercase tracking-[0.4em] text-ink">Store . Protocol</h2>
              </div>
              <p className="text-whisper text-[11px] opacity-40 font-mono">Archive . Identity . Management</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-16">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Shop Name */}
              <div className="md:col-span-2 space-y-4">
                <label className="text-whisper text-[9px] text-ink opacity-40 uppercase tracking-widest flex items-center gap-3">
                  <Store size={12} /> System Identity
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all text-ink uppercase tracking-widest"
                  value={form.shopName}
                  onChange={e => setForm({...form, shopName: e.target.value})}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-4">
                <label className="text-whisper text-[9px] text-ink opacity-40 uppercase tracking-widest flex items-center gap-3">
                  <Mail size={12} /> Digital Matrix
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all text-ink font-mono"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-4">
                <label className="text-whisper text-[9px] text-ink opacity-40 uppercase tracking-widest flex items-center gap-3">
                  <Phone size={12} /> Contact Protocol
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all text-ink font-mono"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  required
                />
              </div>

              {/* Instagram */}
              <div className="md:col-span-2 space-y-4">
                <label className="text-whisper text-[9px] text-ink opacity-40 uppercase tracking-widest flex items-center gap-3">
                  <Globe size={12} /> Social Resonance
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all text-ink"
                  value={form.instagram}
                  onChange={e => setForm({...form, instagram: e.target.value})}
                  placeholder="ARCHIVE_ID..."
                />
              </div>

              {/* Full Address Section */}
              <div className="md:col-span-2 pt-12 border-t border-ink/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
                  <div className="space-y-2">
                    <label className="text-whisper text-[9px] text-accent font-bold uppercase tracking-[0.4em] flex items-center gap-4">
                      <MapPin size={12} /> 
                      Geographic . Anchor
                    </label>
                    <p className="text-[9px] text-ink opacity-20 uppercase tracking-widest">
                      {isLocked 
                        ? "Protocol Locked . Unlock to redefine location" 
                        : "Synchronizing Matrix . Define address to update anchor"}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSearching}
                    onClick={() => setIsLocked(!isLocked)}
                    className={`flex items-center justify-center gap-4 px-8 py-4 text-[9px] font-bold uppercase tracking-[0.3em] transition-all border interactive ${
                      isSearching
                        ? 'border-ink/10 text-ink/20 cursor-not-allowed'
                        : isLocked 
                          ? 'border-ink/20 text-ink hover:bg-ink hover:text-canvas' 
                          : 'bg-accent border-accent text-canvas'
                    }`}
                  >
                    {isSearching ? (
                      <><Loader2 size={12} className="animate-spin" /> Verifying...</>
                    ) : (
                      isLocked ? <><Lock size={12} /> Override Location</> : <><Unlock size={12} /> Lock Matrix</>
                    )}
                  </button>
                </div>
                
                <div className="relative group">
                  <textarea
                    disabled={isLocked}
                    className={`w-full border border-ink/10 py-8 px-10 text-sm font-medium focus:outline-none transition-all min-h-[120px] uppercase tracking-widest ${
                      isLocked 
                        ? 'bg-ink/[0.01] text-ink opacity-30 cursor-not-allowed' 
                        : 'bg-transparent border-accent text-ink'
                    }`}
                    value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                    required
                    placeholder="ENTER PHYSICAL ADDRESS PROTOCOL..."
                  />
                  {!isLocked && (
                    <div className="absolute top-6 right-10 flex items-center gap-4">
                      {isSearching ? (
                        <div className="flex items-center gap-3 text-accent text-[9px] font-bold uppercase tracking-widest">
                          <Loader2 size={12} className="animate-spin" /> Synchronizing...
                        </div>
                      ) : (
                        <div className="text-ink/20">
                          <Search size={18} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Google Maps Embed Preview */}
                <div className="mt-12">
                  <div className="h-96 w-full border border-ink/10 relative overflow-hidden">
                    {!isLocked && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 bg-canvas/90 backdrop-blur-md text-accent px-8 py-3 text-[9px] font-bold uppercase tracking-[0.4em] border border-accent/20 flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                        Live . Sync . Active
                      </div>
                    )}
                    {mapUrl ? (
                      <iframe
                        title="Store Location"
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="w-full h-full bg-ink/[0.02] flex items-center justify-center text-ink/20 text-[9px] uppercase tracking-widest">
                        Awaiting Geographic Pulse...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>

            <div className="flex justify-end pt-12 border-t border-ink/10">
              <button 
                type="submit" 
                disabled={saving || !isLocked}
                className="bg-ink text-canvas px-16 py-6 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-6 transition-all interactive hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} /> 
                    Synchronize Configuration
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
