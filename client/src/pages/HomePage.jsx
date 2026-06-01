import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

const HomePage = () => {
  const cursorRef = useRef(null);

  const { data } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?limit=4&sort=-createdAt').then((r) => r.data),
  });

  const { data: shopInfo } = useQuery({
    queryKey: ['shop-info'],
    queryFn: () => api.get('/shop-info').then(res => res.data.shop),
    staleTime: 0,              // always re-fetch from server
    refetchOnWindowFocus: true, // refresh when user switches back to the tab
  });

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
  }, [data, shopInfo]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '50px' });

    const hiddenElements = document.querySelectorAll('.reveal-hidden');
    hiddenElements.forEach(el => observer.observe(el));

    const handleScroll = () => {
      const scrolled = window.scrollY;
      document.documentElement.style.setProperty('--parallax-v-1', `${scrolled * 0.08}px`);
      document.documentElement.style.setProperty('--parallax-v-2', `${-scrolled * 0.12}px`);
      document.documentElement.style.setProperty('--parallax-v-3', `${scrolled * 0.04}px`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [data, shopInfo]);

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
    <div className="bg-canvas relative geometric-grid min-h-screen selection:bg-accent selection:text-canvas">
      <div className="bg-grain opacity-[0.03]" />
      <div ref={cursorRef} className="custom-cursor hidden md:block" />

      {/* ── Hero Section: Sovereign Heritage ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 section-quiet overflow-hidden">
        {/* Cinematic Background Asset */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/Users/rizwansalmani/.gemini/antigravity/brain/6852ca7d-cb4d-49d5-8f43-546eb91ed5ba/hero_boutique_interior_1778433885135.png" 
            alt="Habibi Boutique Interior" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-[drift_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-canvas/30 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/0 to-canvas" />
        </div>

        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none geometric-grid" />
        
        <div className="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col items-center text-center">
          <p className="text-whisper mb-12 reveal-stagger delay-100">Heritage . Identity . Future</p>
          
          <h1 className="logo-heritage text-[18vw] md:text-[14rem] text-ink leading-none tracking-tight mb-2 reveal-stagger delay-300">
            HABIBI
          </h1>
          <p className="text-whisper text-sm md:text-lg uppercase tracking-[1em] text-ink/60 mb-12 reveal-stagger delay-400 ml-[1em]">
            Boutique
          </p>

          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-16 reveal-stagger delay-500" />

          <p className="text-whisper max-w-xl mx-auto leading-loose reveal-stagger delay-700">
            A quiet revolution in Arabian aesthetics. <br />
            <span className="opacity-50">Crafted for the modern soul, inspired by the ancient sand.</span>
          </p>

          <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row gap-6 sm:gap-12 items-center w-full max-w-[280px] sm:max-w-none px-4 sm:px-0 reveal-stagger delay-[900ms]">
            <Link to="/shop" className="btn-primary w-full sm:w-auto">
              Shop Now
            </Link>
            <Link to="/location" className="text-whisper opacity-40 hover:opacity-100 transition-all interactive py-2">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Visual Archive: Masonry Scroll Parallax ── */}
      <section className="w-full relative section-quiet border-y border-border overflow-hidden bg-canvas py-64 px-6 sm:px-12 lg:px-24">
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none geometric-grid" />
        
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 relative z-10">
          
          {/* Column 01 - Drifting Down */}
          <div className="space-y-12 lg:space-y-24 transition-transform duration-700 ease-out" style={{ transform: 'translate3d(0, var(--parallax-v-1, 0), 0)' }}>
            {(shopInfo?.galleryImages?.length ? shopInfo.galleryImages.slice(0, 2) : [
              { image: '/images/shirt.webp', text: 'Structure' },
              { image: '/images/jacket.jpg', text: 'Form' }
            ]).map((item, idx) => (
              <div key={idx} className="group relative border border-border grayscale hover:grayscale-0 transition-[filter] duration-500 ease-out interactive">
                <div className="overflow-hidden aspect-[3/4]">
                  <img src={item.image} alt={item.text} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                </div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-whisper text-[8px] bg-canvas/90 p-2 border border-accent/20">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Column 02 - Drifting Up (Fast) */}
          <div className="space-y-12 lg:space-y-24 transition-transform duration-700 ease-out" style={{ transform: 'translate3d(0, var(--parallax-v-2, 0), 0)' }}>
            {(shopInfo?.galleryImages?.length ? shopInfo.galleryImages.slice(2, 4) : [
              { image: '/images/model1.jpg', text: 'Essence' },
              { image: '/images/baggy_jeans.jpg', text: 'Flow' }
            ]).map((item, idx) => (
              <div key={idx} className="group relative border border-border grayscale hover:grayscale-0 transition-[filter] duration-500 ease-out interactive">
                <div className="overflow-hidden aspect-[3/4]">
                  <img src={item.image} alt={item.text} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                </div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-whisper text-[8px] bg-canvas/90 p-2 border border-accent/20">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Column 03 - Drifting Down (Slow) */}
          <div className="space-y-12 lg:space-y-24 transition-transform duration-700 ease-out" style={{ transform: 'translate3d(0, var(--parallax-v-3, 0), 0)' }}>
            {(shopInfo?.galleryImages?.length ? shopInfo.galleryImages.slice(4, 6) : [
              { image: '/images/tshirt.jpg', text: 'Identity' },
              { image: '/images/model2.jpg', text: 'Heritage' }
            ]).map((item, idx) => (
              <div key={idx} className="group relative border border-border grayscale hover:grayscale-0 transition-[filter] duration-500 ease-out interactive">
                <div className="overflow-hidden aspect-[3/4]">
                  <img src={item.image} alt={item.text} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                </div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-whisper text-[8px] bg-canvas/90 p-2 border border-accent/20">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── Collections: Asymmetric Order ── */}
      <section className="section-quiet px-6 sm:px-12 lg:px-24 bg-canvas">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-32 reveal-hidden">
            <div className="max-w-md">
              <p className="text-whisper mb-6">Collections</p>
              <h2 className="logo-heritage text-5xl md:text-8xl text-ink leading-tight">Browse by <br />Essence</h2>
            </div>
            <p className="text-whisper opacity-40 max-w-[200px] text-right hidden md:block">
              Each piece is a dialogue between tradition and the contemporary grid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
            {categories.map((cat, i) => (
              <Link 
                key={cat.name} 
                to={cat.path} 
                className={`group block reveal-hidden interactive ${i % 2 !== 0 ? 'lg:mt-32' : ''}`}
              >
                <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-[filter] duration-500 border border-border group-hover:border-accent">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <span className="text-whisper group-hover:text-accent transition-colors">{cat.name}</span>
                  <span className="text-whisper opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals: Snap Precision ── */}
      <section className="section-quiet bg-canvas border-t border-border">
        <div className="px-6 sm:px-12 lg:px-24 mb-24 flex justify-between items-end">
          <div>
            <p className="text-whisper mb-6">Latest Drops</p>
            <h2 className="logo-heritage text-5xl md:text-7xl text-ink">New Arrivals</h2>
          </div>
          <Link to="/shop" className="text-whisper hover:text-accent transition-all flex items-center gap-2 interactive">
            Shop All <ArrowRight size={12} />
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar gap-8 sm:gap-12 px-6 sm:px-12 lg:px-24 snap-x snap-mandatory pb-20">
            {data?.products?.map((product, idx) => (
              <div 
                key={product._id} 
                className={`flex-none w-[260px] sm:w-[280px] md:w-[380px] snap-center reveal-hidden quiet-zone ${idx % 2 !== 0 ? 'mt-0 sm:mt-24' : ''}`}
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Heritage Logic: Smooth Transition ── */}
      <section className="py-32 bg-canvas border-t border-ink/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.01] pointer-events-none geometric-grid" />
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-32">
            {[
              { title: 'Logistics', desc: 'Swift nationwide distribution through refined logistics networks.' },
              { title: 'Quality', desc: 'Rigorous material selection and construction protocols.' },
              { title: 'Design', desc: 'Conceptual depth woven into every structural seam.' },
            ].map((feature, i) => (
              <div key={feature.title} className="reveal-hidden space-y-8" style={{ transitionDelay: `${i * 0.2}s` }}>
                <p className="text-whisper text-accent font-black tracking-[0.5em]">0{i+1} . {feature.title}</p>
                <p className="font-body text-ink leading-relaxed text-[13px] font-medium opacity-80 max-w-xs">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Minimal Footer ── */}
      <footer className="section-quiet bg-canvas border-t border-border">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-32 items-start">
            <div className="lg:col-span-6">
              <h2 className="logo-heritage text-5xl md:text-7xl text-ink mb-12 tracking-tighter">HABIBI</h2>
              <p className="text-whisper max-w-sm leading-relaxed opacity-60 font-black">
                A sanctuary for Arabian craft in the digital age. <br />
                Based in the heart of Heritage.
              </p>
            </div>
            
            <div className="lg:col-span-3">
              <p className="text-whisper mb-10 font-black text-accent">Navigate</p>
              <ul className="space-y-6">
                {['Shop All', 'Collections', 'Find Us', 'Orders'].map(item => (
                  <li key={item}>
                    <Link to="/" className="text-whisper opacity-60 hover:opacity-100 hover:text-ink transition-all font-black interactive">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <p className="text-whisper mb-10 font-black text-accent">Connect</p>
              <ul className="space-y-6">
                <li><a href="#" className="text-whisper opacity-60 hover:opacity-100 transition-all font-black interactive">Instagram</a></li>
                <li><a href="#" className="text-whisper opacity-60 hover:opacity-100 transition-all font-black interactive">Email</a></li>
                <li><a href="#" className="text-whisper opacity-60 hover:opacity-100 transition-all font-black interactive">Twitter</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-ink/10 pt-12">
            <p className="text-whisper opacity-60 font-bold">© {new Date().getFullYear()} HABIBI Heritage</p>
            <p className="text-whisper opacity-60 italic font-bold">Precision . Craft . Soul</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
