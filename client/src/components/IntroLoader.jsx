import { useEffect, useState } from 'react';

const IntroLoader = ({ onComplete }) => {
  const [exit, setExit] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 15);

    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 600);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-canvas flex flex-col items-center justify-center transition-all duration-[1.5s] ease-in-out ${
        exit ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none geometric-grid" />

      {/* ── Geometric Silence Reveal ── */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-whisper mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          Heritage . Identity . Future
        </p>

        <div className="overflow-hidden">
          <h1 
            className="logo-heritage text-[12vw] md:text-[8rem] leading-none tracking-tight opacity-0"
            style={{ 
              animation: 'reveal-text 2s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards' 
            }}
          >
            HABIBI
          </h1>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <p className="text-whisper opacity-40">
            {progress < 10 ? `00${progress}` : progress < 100 ? `0${progress}` : progress} . Archive . Loading
          </p>
          
          <div className="w-48 h-px bg-border/20 relative overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-accent transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes reveal-text {
          from { 
            opacity: 0; 
            transform: translateY(100%); 
            letter-spacing: 0.5em;
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
            letter-spacing: 0.05em;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default IntroLoader;
