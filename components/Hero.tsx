
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse-slow"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        
        {/* Animated Data Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scanline"></div>
          <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scanline [animation-delay:2s]"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-14 animate-in fade-in slide-in-from-bottom-6 duration-700">
           <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
           </span>
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-300 mono">VONE Quantum Backbone Online</span>
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-[11rem] font-black uppercase italic leading-[0.8] mb-10 tracking-tighter text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
          <span className="relative inline-block hover:skew-x-2 transition-transform duration-500">QUANTUM</span><br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-600 to-purple-600 glitch-text">SPEED.</span>
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-20 max-w-4xl mx-auto">
          <div className="flex-1 text-left border-l-2 border-indigo-600/50 pl-10">
            <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
              Willkommen in der Zukunft der <span className="text-white">Streaming-Infrastruktur</span>. 
              Wir nutzen dedizierte Quantum-Nodes für <span className="text-indigo-400 italic font-black">Latenzfreie</span> Übertragungen weltweit.
            </p>
          </div>
          <div className="flex gap-10 items-center">
            <div className="text-center">
              <div className="text-3xl font-black italic text-white mono">1.2<span className="text-indigo-500">ms</span></div>
              <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest mt-1">Ping Avg</div>
            </div>
            <div className="w-[1px] h-12 bg-white/10"></div>
            <div className="text-center">
              <div className="text-3xl font-black italic text-white mono">100<span className="text-indigo-500">%</span></div>
              <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest mt-1">Uptime</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-2xl mx-auto">
          <button 
            onClick={onCtaClick}
            className="group relative flex-[1.5] bg-indigo-600 hover:bg-indigo-500 text-white py-8 rounded-3xl font-black uppercase text-[12px] tracking-[0.4em] shadow-[0_25px_60px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              Tier Konfigurieren <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform duration-500"></i>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
          
          <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-8 rounded-3xl font-black uppercase text-[12px] tracking-[0.4em] backdrop-blur-md transition-all hover:border-indigo-500/30">
            Live Nodes
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        .animate-scanline { animation: scanline 8s linear infinite; }
        
        .glitch-text:hover {
          animation: glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite;
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
