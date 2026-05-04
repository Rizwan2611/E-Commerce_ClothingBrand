import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

const LocationPage = () => {
  const { data: shop, isLoading } = useQuery({
    queryKey: ['shop-info'],
    queryFn: () => api.get('/shop-info').then(res => res.data.shop),
  });

  if (isLoading) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-96 w-full card animate-pulse bg-zinc-900" />
      </div>
    );
  }

  const shopData = shop || {};
  const lat = parseFloat(shopData.lat);
  const lng = parseFloat(shopData.lng);

  // High-reliability Map URL generator (Prioritizing Address for better local results)
  const getMapEmbedUrl = () => {
    if (shopData.address) {
      // Using the address directly is often more accurate for local labels in Google Maps
      return `https://www.google.com/maps?q=${encodeURIComponent(shopData.address)}&z=17&output=embed`;
    }
    if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0) {
      return `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    }
    return `https://www.google.com/maps?q=Mumbai&z=12&output=embed`;
  };

  const getDirectionsUrl = () => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shopData.address || '')}`;
  };

  return (
    <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
      {/* signature Arabian Sand grid background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.08] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #D4AF37 1px, transparent 1px), linear-gradient(to bottom, #D4AF37 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />

      {/* Header */}
      <div className="mb-20 text-center relative z-10">
        <span className="text-xs font-[1000] text-amber-500 uppercase tracking-[0.5em] mb-4 block">Visit the Oasis</span>
        <h1 className="font-rock-salt text-4xl md:text-5xl font-black text-black uppercase tracking-tighter drop-shadow-sm">
          Find Our Culture
        </h1>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Experience the Void in Person</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="glass-premium rounded-[2.5rem] p-10 border-2 border-white/50 depth-lg">
            <h3 className="text-xl font-[1000] text-black mb-10 uppercase tracking-widest border-b border-zinc-100 pb-6 flex items-center gap-3">
              <Phone size={20} className="text-amber-500" />
              Contact Info
            </h3>
            <div className="space-y-10">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                  <MapPin size={24} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-black font-[1000] text-[10px] uppercase tracking-widest mb-2">Our Studio</p>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed tracking-tight">
                    {shopData.address || 'Void Sector, Karachi'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                  <Phone size={24} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-black font-[1000] text-[10px] uppercase tracking-widest mb-2">Call Us</p>
                  <a href={`tel:${shopData.phone}`} className="text-zinc-500 text-xs font-bold hover:text-black transition-colors tracking-tight">
                    {shopData.phone || '+92 300 0000000'}
                  </a>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                  <Mail size={24} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-black font-[1000] text-[10px] uppercase tracking-widest mb-2">Email Inquiries</p>
                  <a href={`mailto:${shopData.email}`} className="text-zinc-500 text-xs font-bold hover:text-black transition-colors tracking-tight">
                    {shopData.email || 'hello@voidculture.pk'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1A120B] rounded-[2.5rem] p-10 depth-md text-white border-2 border-black relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-sm font-[1000] text-amber-400 mb-6 uppercase tracking-[0.4em] relative z-10">Store Hours</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-start gap-4">
                <Clock className="text-zinc-500" size={18} />
                <div className="text-xs font-bold leading-relaxed tracking-widest uppercase text-zinc-300">
                  Mon — Sat: 10AM — 9PM<br />
                  Sun: 12PM — 7PM
                </div>
              </div>
            </div>
          </div>

          {/* Directions Button */}
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noreferrer"
            className="group w-full bg-black text-white py-6 rounded-[2rem] flex items-center justify-center gap-4 text-xs font-[1000] uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-2xl shadow-black/20 active:scale-95 border-2 border-black"
          >
            <Navigation size={18} className="text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Navigate to Oasis
          </a>
        </div>

        {/* Google Maps Embed */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-black rounded-[3rem] p-4 h-full min-h-[500px] shadow-2xl shadow-black/5 relative overflow-hidden">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-zinc-100" style={{ minHeight: '500px' }}>
              <iframe
                title="Store Location"
                src={getMapEmbedUrl()}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
