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

  const lat = shop?.lat || 19.0760;
  const lng = shop?.lng || 72.8777;

  // Google Maps embed URL
  const getMapEmbedUrl = () => {
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }
    if (shop?.address) {
      return `https://www.google.com/maps?q=${encodeURIComponent(shop.address)}&z=15&output=embed`;
    }
    return `https://www.google.com/maps?q=0,0&z=2&output=embed`;
  };

  // Google Maps directions link
  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  return (
    <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="font-playfair text-4xl font-bold text-white mb-3">Find Our Store</h1>
        <p className="text-zinc-400 text-sm">Visit us in person or get in touch</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-black mb-8 border-b-2 border-black pb-4">
              Contact Info
            </h3>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-zinc-100 border-2 border-black rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="text-black" size={24} />
                </div>
                <div>
                  <p className="text-black font-bold text-sm mb-1">Address</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {shop?.address || 'Address not set'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-zinc-100 border-2 border-black rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="text-black" size={24} />
                </div>
                <div>
                  <p className="text-black font-bold text-sm mb-1">Phone</p>
                  <a href={`tel:${shop?.phone}`} className="text-zinc-500 text-sm hover:text-green-500 transition-colors">
                    {shop?.phone || 'Not available'}
                  </a>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 bg-zinc-100 border-2 border-black rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="text-black" size={24} />
                </div>
                <div>
                  <p className="text-black font-bold text-sm mb-1">Email</p>
                  <a href={`mailto:${shop?.email}`} className="text-zinc-500 text-sm hover:text-green-500 transition-colors">
                    {shop?.email || 'Not available'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border-2 border-dashed border-black/20 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-black mb-6">Store Hours</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-zinc-500">
                <Clock className="text-black" size={20} />
                <div className="flex-1 text-sm font-medium leading-relaxed">
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
            className="w-full bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold hover:bg-green-400 hover:text-black transition-all shadow-lg active:scale-95"
          >
            <Navigation size={18} />
            Get Directions
          </a>
        </div>

        {/* Google Maps Embed */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-black rounded-3xl p-3 h-full min-h-[500px] shadow-xl shadow-black/5">
            <div className="w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: '500px' }}>
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
