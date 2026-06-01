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
    <div className="bg-canvas geometric-grid min-h-screen section-quiet px-6 sm:px-12 lg:px-24">
      <div className="bg-grain opacity-[0.03]" />

      {/* Header: Geometric Silence */}
      <div className="mb-20 pt-24 md:pt-32 text-center flex flex-col items-center reveal-hidden">
        <p className="text-whisper mb-6 opacity-60">Atelier . Presence</p>
        <h1 className="logo-heritage text-3xl sm:text-5xl md:text-6xl text-ink mb-6 tracking-widest">Contact</h1>
        <div className="w-24 h-px bg-accent/30 mb-6" />
        <p className="text-whisper opacity-80">Direct . Inquiry . Location</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10">
        {/* Contact Info System */}
        <div className="lg:col-span-4 space-y-16 reveal-hidden">
          <div className="border border-border p-12 space-y-12 bg-canvas">
            <p className="text-whisper mb-12 font-black">Channel . 01</p>
            
            <div className="space-y-12">
              <div className="group interactive">
                <p className="text-whisper text-[10px] text-accent mb-4 font-black">The Studio</p>
                <p className="font-body text-ink text-sm leading-loose italic font-medium">
                  {shopData.address || 'Void Sector, Karachi'}
                </p>
              </div>
              
              <div className="group interactive">
                <p className="text-whisper text-[10px] text-accent mb-4 font-black">Voice Signature</p>
                <a href={`tel:${shopData.phone}`} className="font-body text-ink text-sm italic hover:text-accent transition-colors font-medium">
                  {shopData.phone || '+92 300 0000000'}
                </a>
              </div>

              <div className="group interactive">
                <p className="text-whisper text-[10px] text-accent mb-4 font-black">Digital Inquiry</p>
                <a href={`mailto:${shopData.email}`} className="font-body text-ink text-sm italic hover:text-accent transition-colors font-medium">
                  {shopData.email || 'hello@voidculture.pk'}
                </a>
              </div>
            </div>
          </div>

          <div className="border border-border p-12 bg-ink/5">
            <p className="text-whisper mb-8 font-black">Operational . Cycle</p>
            <div className="space-y-4">
              <p className="text-whisper text-[10px] text-ink/80 lowercase font-bold">Mon — Sat: 10AM — 9PM</p>
              <p className="text-whisper text-[10px] text-ink/80 lowercase font-bold">Sun: 12PM — 7PM</p>
            </div>
          </div>

          <div className="pt-4 pb-12">
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-[85%] max-w-sm bg-ink text-canvas py-5 px-8 items-center justify-between hover:bg-accent transition-colors duration-500 font-black tracking-[0.3em] uppercase interactive group rounded-sm shadow-premium"
            >
              <span>Locate Studio</span>
              <Navigation size={18} className="text-canvas ml-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
            </a>
          </div>
        </div>

        {/* Satellite Imagery Embed */}
        <div className="lg:col-span-8 reveal-hidden">
          <div className="border border-border p-2 h-full min-h-[600px] grayscale hover:grayscale-0 transition-all duration-[2s]">
            <div className="w-full h-full overflow-hidden border border-border" style={{ minHeight: '600px' }}>
              <iframe
                title="Store Location"
                src={getMapEmbedUrl()}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '600px' }}
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
