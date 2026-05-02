import React from 'react';

const LoadingSpinner = ({ fullPage = true }) => {
  return (
    <div className={`${fullPage ? 'fixed inset-0 z-[10000] bg-white flex' : 'w-full h-64 flex'} items-center justify-center overflow-hidden`}>
      {/* signature soft grid background */}
      {fullPage && (
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #50C878 1px, transparent 1px), linear-gradient(to bottom, #50C878 1px, transparent 1px)', 
            backgroundSize: '80px 80px' 
          }} 
        />
      )}

      <div className="relative flex flex-col items-center">
        {/* 3D Glass Rings */}
        <div className="relative w-24 h-24 perspective-1000">
          <div className="absolute inset-0 border-4 border-green-400/30 rounded-full animate-spin-slow rotate-x-45" />
          <div className="absolute inset-0 border-4 border-black rounded-full animate-spin rotate-y-45 shadow-[0_0_20px_#50C878]" />
          <div className="absolute inset-0 border-4 border-green-500/50 rounded-full animate-pulse blur-sm" />
        </div>

        {/* Branding */}
        <div className="mt-8 text-center animate-pulse">
          <h2 className="font-rock-salt text-xl font-black text-black tracking-tighter uppercase">VOID</h2>
          <div className="h-1 w-12 bg-green-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_#50C878]" />
          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-3">Syncing Culture...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg) rotateX(45deg); }
          to { transform: rotate(360deg) rotateX(45deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg) rotateY(45deg); }
          to { transform: rotate(360deg) rotateY(45deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .rotate-x-45 {
          transform: rotateX(45deg);
        }
        .rotate-y-45 {
          transform: rotateY(45deg);
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
