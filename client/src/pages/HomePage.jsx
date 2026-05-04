import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

const HomePage = () => {
  const { data } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?limit=4&sort=-createdAt').then((r) => r.data),
  });

  const { data: shopInfo } = useQuery({
    queryKey: ['shop-info'],
    queryFn: () => api.get('/shop-info').then(res => res.data.shop),
  });

  const categories = [
    { name: 'Shirts', image: '/images/shirt.webp', textImage: '/images/Shirt_text.png', path: '/shop?category=shirts' },
    { name: 'Jeans', image: '/images/baggy_jeans.jpg', textImage: '/images/Jeans_text.png', path: '/shop?category=jeans' },
    { name: 'Jackets', image: '/images/jacket.jpg', textImage: '/images/Jacket_Text.png', path: '/shop?category=jackets' },
    { name: 'T-Shirts', image: '/images/tshirt.jpg', textImage: '/images/T-shirt_Text.png', path: '/shop?category=tshirts' },
  ];

  const getInstagramUrl = () => {
    if (!shopInfo?.instagram) return '#';
    if (shopInfo.instagram.startsWith('http')) return shopInfo.instagram;
    const handle = shopInfo.instagram.startsWith('@') ? shopInfo.instagram.slice(1) : shopInfo.instagram;
    return `https://instagram.com/${handle}`;
  };

  return (
    <div className="pt-24 bg-arabesque">
      {/* 3D Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-12 py-20">
        {/* Mashrabiya Pattern Background */}
        <div className="absolute inset-0 z-0 opacity-[0.3] pointer-events-none bg-arabesque" />

        <div className="relative z-10 max-w-full w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Hero Text - Wrapped in 3D Glass Card */}
          <div className="flex-1 three-d-card glass-premium p-10 md:p-20 rounded-[4rem] border-2 border-white/50 depth-lg animate-slide-up text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-600 font-bold text-[10px] uppercase tracking-[0.5em] mb-10">
              <Sparkles size={14} />
              <span>Heritage Drop // 2026</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-rock-salt leading-[0.85] text-black tracking-tighter mix-blend-multiply mb-12">
              VOID<br/>CULTURE
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed mb-14 tracking-tight">
              Honoring Arabian craftsmanship with modern silhouettes. Discover a legacy of cinematic aesthetics and heritage luxury.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10">
              <Link to="/shop" className="btn-primary px-14 py-6 text-xl flex items-center gap-3 depth-md hover:depth-lg transition-all scale-105">
                Explore Shop <ArrowRight size={24} />
              </Link>
              <Link to="/location" className="text-black font-black font-rock-salt text-xs uppercase tracking-[0.3em] hover:text-amber-600 transition-colors border-b-2 border-black pb-1">
                Our Legacy
              </Link>
            </div>
          </div>

          {/* 3D Hero Visuals */}
          <div className="flex-1 w-full relative perspective-1000 flex justify-center items-center h-[450px] md:h-[600px] mt-20 lg:mt-0">
            {/* Primary Image Card */}
            <div className="three-d-card w-[240px] md:w-[350px] aspect-[3/4] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden depth-lg border-2 md:border-4 border-white shadow-2xl relative z-20 group rotate-[-8deg] hover:rotate-0 translate-y-5 hover:translate-y-0">
              <img src="/images/model1.jpg" alt="Hero Model" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                <span className="text-white font-rock-salt text-xl md:text-2xl font-black uppercase tracking-tighter">Oversized Essentials</span>
              </div>
            </div>

            {/* Floating Secondary Card */}
            <div className="three-d-card w-[180px] md:w-[280px] aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden depth-md border-2 md:border-4 border-white shadow-xl absolute z-30 right-4 md:right-0 top-0 group rotate-[12deg] hover:rotate-0 -translate-x-5 md:-translate-x-10 translate-y-10 hover:translate-y-5">
              <img src="/images/model2.jpg" alt="Hero Style" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6">
                <span className="text-black font-rock-salt text-lg md:text-xl font-black uppercase tracking-tighter">Ancient Weaves</span>
              </div>
            </div>

            {/* Background Accent Element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-400/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse-glow" />
          </div>
        </div>
      </section>

      {/* Categories with 3D Depth */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-xs font-[1000] text-amber-600 uppercase tracking-[0.5em] mb-4">Ancestral Selections</span>
          <h2 className="text-4xl md:text-5xl font-black font-rock-salt uppercase tracking-tighter text-black">
            The Heritage Collection
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.path} className="three-d-card group bg-white rounded-[2rem] p-4 border border-zinc-100 depth-sm hover:depth-lg flex flex-col">
              <div className="w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6 relative shadow-inner">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-amber-400/10 transition-colors duration-500 z-10" />
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex justify-center items-center pb-4">
                <span className="text-xl font-[1000] uppercase tracking-tighter text-black group-hover:text-amber-500 transition-all duration-300">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Accent Light */}
        <div className="absolute -right-20 top-0 w-96 h-96 bg-green-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-end justify-between mb-12 relative z-10">
          <div className="flex-1">
            <h2 className="text-4xl font-black font-rock-salt uppercase tracking-tighter text-black">
              New Arrivals
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 font-rock-salt lowercase mt-3 tracking-[0.3em]">
              fresh styles // dropped just now
            </p>
          </div>
          <Link to="/shop" className="group flex items-center gap-4 text-black hover:text-amber-500 text-[10px] font-black transition-all uppercase tracking-[0.2em]">
            <span className="border-b-2 border-black group-hover:border-amber-500 pb-1">Explore Oasis</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 relative z-10">
          {data?.products?.length ? (
            data.products.map((p) => <ProductCard key={p._id} product={p} />)
          ) : (
            [...Array(4)].map((_, i) => (
              <div key={i} className="three-d-card aspect-[3/4] animate-pulse rounded-[2rem] bg-zinc-100 depth-sm" />
            ))
          )}
        </div>
      </section>

      {/* Heritage Features Section */}
      <section className="py-32 bg-[#F4EBD0] relative overflow-hidden">
        <div className="absolute inset-0 bg-arabesque opacity-[0.2]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Truck, title: 'Rapid Delivery', desc: 'Across Pakistan within 2-5 business days' },
              { icon: Shield, title: 'Pro Quality', desc: 'Rigorous quality-check protocols for every item' },
              { icon: Sparkles, title: 'Premium Drop', desc: 'Elite curated styles for the modern individual' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="three-d-card group flex flex-col items-center text-center p-10 rounded-[2.5rem] bg-white border border-zinc-100 depth-md hover:depth-lg">
                <div className="w-20 h-20 bg-zinc-50 border-2 border-zinc-100 group-hover:border-amber-500 group-hover:bg-amber-500/10 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-inner">
                  <Icon size={32} className="text-black group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-black mb-4 tracking-tighter font-rock-salt group-hover:text-amber-600 transition-colors uppercase">{title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 sm:px-6 lg:px-12 border-t border-amber-900/10 bg-transparent relative z-10">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <img
              src="/images/void-culture-logo.png"
              alt="VOID CULTURE"
              className="h-16 w-auto mix-blend-multiply"
            />
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              Modernizing street culture with premium essentials. VOID CULTURE is more than a brand, it's a movement towards cinematic aesthetics and urban luxury.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-rock-salt text-lg font-black mb-8">QUICK LINKS</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-zinc-600 hover:text-amber-500 transition-colors font-medium">Desert Collection</Link></li>
              <li><Link to="/location" className="text-zinc-600 hover:text-amber-500 transition-colors font-medium">Our Oasis</Link></li>
              <li><Link to="/orders" className="text-zinc-600 hover:text-amber-500 transition-colors font-medium">My Orders</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-rock-salt text-lg font-black mb-8">CONTACT</h4>
            <ul className="space-y-4">
              <li className="text-zinc-600 font-medium tracking-tight lowercase">
                <a href={`mailto:${shopInfo?.email || 'contact@voidculture.com'}`} className="hover:text-green-500 transition-colors">
                  {shopInfo?.email || 'contact@voidculture.com'}
                </a>
              </li>
              <li className="text-zinc-600 font-medium tracking-tight uppercase font-bold">
                {shopInfo?.address || 'STUDIO 404, VOID SECTOR'}
              </li>
              <li className="text-zinc-600 font-medium tracking-tight uppercase">GLOBAL DISTRIBUTION</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-rock-salt text-lg font-black mb-8">FOLLOW</h4>
            <div className="flex gap-4">
              <a
                href={getInstagramUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 border border-black rounded-xl text-center text-xs font-black hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all uppercase"
              >
                Instagram
              </a>
              <a
                href={`mailto:${shopInfo?.email || 'contact@voidculture.com'}`}
                className="flex-1 py-3 border border-black rounded-xl text-center text-xs font-black hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all uppercase"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} Void Culture. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
