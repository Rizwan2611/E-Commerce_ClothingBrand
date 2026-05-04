import { useEffect, useState, useRef } from 'react';

const IntroLoader = ({ onComplete }) => {
  const [exit, setExit] = useState(false);
  const containerRef = useRef(null);

  const images = [
    '/images/shirt.webp',
    '/images/baggy_jeans.jpg',
    '/images/jacket.jpg',
    '/images/tshirt.jpg',
    '/images/model1.jpg',
    '/images/model2.jpg',
    '/images/shirt.webp',
    '/images/baggy_jeans.jpg',
  ];

  useEffect(() => {
    // End animation after 5 seconds (roughly one full slow rotation)
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 1000); // Wait for fade out animation
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-arabesque flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${exit ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Dynamic Arabian Mashrabiya Pattern */}
      <div className="absolute inset-0 z-0 bg-arabesque opacity-[0.4]" />

      {/* Floating Logo - Classic Heritage Branding */}
      <div className="absolute top-20 z-20 text-center animate-float">
         <h1 className="font-rock-salt text-4xl md:text-6xl text-black font-black tracking-tighter drop-shadow-md">
            VOID CULTURE
         </h1>
         <p className="text-amber-600 font-bold uppercase tracking-[0.5em] text-[10px] mt-4">
            Classic Arabian Heritage
         </p>
      </div>

      {/* 3D Circular Gallery Container */}
      <div className="relative w-full h-full flex items-center justify-center perspective-2000 overflow-hidden">
        <div className="relative w-48 h-64 md:w-72 md:h-96 transform-style-3d animate-rotate-3d">
          {images.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl border-2 md:border-4 border-white overflow-hidden shadow-2xl backface-hidden"
              style={{
                transform: `rotateY(${i * (360 / images.length)}deg) translateZ(var(--gallery-depth))`,
                boxShadow: '0 20px 50px rgba(60,42,33,0.15)'
              }}
            >
              <img src={src} alt="Product" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A120B]/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Progress Bar - Sand Theme */}
      <div className="absolute bottom-20 w-48 md:w-64 h-1.5 bg-zinc-200/50 rounded-full overflow-hidden border border-amber-200">
        <div className="h-full bg-amber-500 animate-progress-full shadow-[0_0_15px_#D4AF37]" />
      </div>

      <style jsx>{`
        :root {
          --gallery-depth: 450px;
        }
        @media (max-width: 768px) {
          :root {
            --gallery-depth: 250px;
          }
        }
        @keyframes rotate-3d {
          from { transform: rotateY(0deg) rotateX(-5deg); }
          to { transform: rotateY(360deg) rotateX(-5deg); }
        }
        @keyframes progress-full {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-rotate-3d {
          animation: rotate-3d 10s linear infinite;
        }
        .animate-progress-full {
          animation: progress-full 6s linear forwards;
        }
        .perspective-2000 {
          perspective: 2000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default IntroLoader;
