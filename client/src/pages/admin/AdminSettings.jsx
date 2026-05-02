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
  // Stabilized Map URL state to prevent unnecessary iframe flickering
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    adminApi.get('/admin/settings')
      .then(res => {
        setForm(res.data.settings);
        const { lat, lng, address } = res.data.settings;
        if (lat && lng) {
          setMapUrl(`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`);
        } else if (address) {
          setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`);
        }
        setLoading(false);
      })
      .catch(err => {
        toast.error('Failed to load settings');
        setLoading(false);
      });
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
    if (!isLocked) {
      return toast.error('Please lock the location to verify your shop address');
    }
    setSaving(true);
    try {
      await adminApi.put('/admin/settings', form);
      toast.success('Store settings updated');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout title="Settings">
      <div className="h-96 bg-white border-2 border-zinc-100 rounded-[3rem] animate-pulse" />
    </AdminLayout>
  );

  return (
    <AdminLayout title="Settings">
      <div className="max-w-4xl mx-auto pb-20">
        <div className="bg-white border-2 border-black rounded-[3rem] shadow-2xl shadow-black/5 overflow-hidden">
          {/* Settings Header */}
          <div className="p-10 border-b-2 border-black flex items-center justify-between bg-zinc-50/50">
            <div>
              <h2 className="text-2xl font-bold text-black flex items-center gap-3">
                <Settings className="text-black" size={24} />
                Store Settings
              </h2>
              <p className="text-zinc-400 text-sm mt-1">Manage your store information and location</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Shop Name */}
              <div className="md:col-span-2">
                <label className="block text-black font-bold text-sm mb-3 flex items-center gap-2">
                  <Store size={16} className="text-zinc-400" /> Shop Name
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all"
                  value={form.shopName}
                  onChange={e => setForm({...form, shopName: e.target.value})}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-black font-bold text-sm mb-3 flex items-center gap-2">
                  <Mail size={16} className="text-zinc-400" /> Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-black font-bold text-sm mb-3 flex items-center gap-2">
                  <Phone size={16} className="text-zinc-400" /> Phone Number
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  required
                />
              </div>

              {/* Instagram */}
              <div className="md:col-span-2">
                <label className="block text-black font-bold text-sm mb-3 flex items-center gap-2">
                  <Globe size={16} className="text-zinc-400" /> Instagram Profile (URL or Handle)
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all"
                  value={form.instagram}
                  onChange={e => setForm({...form, instagram: e.target.value})}
                  placeholder="e.g. https://instagram.com/voidculture or @voidculture"
                />
              </div>

              {/* Full Address Section */}
              <div className="md:col-span-2 pt-6 border-t-2 border-zinc-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <label className="block text-black font-bold text-sm flex items-center gap-2">
                      <Globe size={16} className="text-black" /> 
                      Store Address & Location
                    </label>
                    <p className="text-xs text-zinc-400 mt-1">
                      {isLocked 
                        ? "Address is locked. Unlock to change location." 
                        : "Start typing; the map will find your shop instantly."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLocked(!isLocked)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all border-2 ${
                      isLocked 
                        ? 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-white hover:text-black hover:border-black' 
                        : 'bg-green-400 text-black border-black shadow-lg shadow-green-400/20'
                    }`}
                  >
                    {isLocked ? <><Lock size={14} /> Unlock Address</> : <><Unlock size={14} /> Lock Location</>}
                  </button>
                </div>
                
                <div className="relative group">
                  <textarea
                    disabled={isLocked}
                    className={`w-full border-2 rounded-3xl py-6 px-8 text-sm font-medium focus:outline-none transition-all min-h-[120px] ${
                      isLocked 
                        ? 'bg-zinc-50 border-zinc-100 text-zinc-500 cursor-not-allowed' 
                        : 'bg-white border-black text-black shadow-xl shadow-black/5'
                    }`}
                    value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                    required
                    placeholder="Enter your full store address (e.g. Studio 404, Void Sector, Karachi)"
                  />
                  {!isLocked && (
                    <div className="absolute top-4 right-6 flex items-center gap-2">
                      {isSearching ? (
                        <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase">
                          <Loader2 size={14} className="animate-spin" /> Searching...
                        </div>
                      ) : (
                        <div className="text-zinc-300">
                          <Search size={18} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Google Maps Embed Preview */}
                <div className="mt-8">
                  <div className="h-96 w-full rounded-[3rem] overflow-hidden border-2 border-black shadow-2xl relative">
                    {!isLocked && (
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-md text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Live Search Active
                      </div>
                    )}
                    <iframe
                      title="Store Location"
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
              
            </div>

            <div className="flex justify-end pt-10 border-t-2 border-black">
              <button 
                type="submit" 
                disabled={saving || !isLocked}
                className="group bg-black text-white px-12 py-5 rounded-[2rem] text-sm font-bold flex items-center gap-4 hover:bg-zinc-800 transition-all shadow-2xl shadow-black/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} className="group-hover:scale-110 transition-transform" /> 
                    Save Settings
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
