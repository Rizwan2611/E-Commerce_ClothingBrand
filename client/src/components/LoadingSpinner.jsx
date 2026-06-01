import React from 'react';

const LoadingSpinner = ({ fullPage = true }) => {
  return (
    <div className={`${fullPage ? 'fixed inset-0 z-[10000] bg-canvas flex' : 'w-full h-64 flex'} items-center justify-center overflow-hidden`}>
      {/* Geometric Silence Backdrop */}
      {fullPage && (
        <>
          <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none geometric-grid" />
        </>
      )}

      <div className="relative flex flex-col items-center">
        {/* Minimalist Geometric Pulse */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border border-accent/20 rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-accent animate-ping" />
        </div>

        {/* Branding Protocol */}
        <div className="mt-12 text-center">
          <h2 className="logo-heritage text-3xl text-ink tracking-tighter lowercase">HABIBI</h2>
          <div className="h-px w-8 bg-accent/30 mx-auto mt-4" />
          <p className="text-whisper text-[9px] text-accent tracking-[0.5em] mt-6 opacity-40">Synchronizing . Protocol</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
