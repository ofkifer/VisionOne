
import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    users: 12402,
    latency: 14,
    load: 42,
    threats: 8942
  });
  const [testingPing, setTestingPing] = useState(false);
  const [userPing, setUserPing] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        users: prev.users + (Math.random() > 0.5 ? 1 : -1),
        latency: 12 + Math.floor(Math.random() * 5),
        load: 38 + Math.floor(Math.random() * 10),
        threats: prev.threats + Math.floor(Math.random() * 2)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const runPingTest = () => {
    setTestingPing(true);
    setUserPing(null);
    setTimeout(() => {
      setUserPing(10 + Math.floor(Math.random() * 25));
      setTestingPing(false);
    }, 2000);
  };

  return (
    <section className="py-32 px-6 relative border-y border-white/5 bg-[#050508] overflow-hidden">
      <div className="absolute top-0 right-0 p-32 opacity-[0.02] pointer-events-none">
        <i className="fas fa-globe-europe text-[30rem] text-indigo-500"></i>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <div className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.5em] mb-4">Backbone Realtime Data</div>
            <h2 className="text-4xl md:text-7xl font-black uppercase italic mb-2 text-white">QUANTUM <span className="text-indigo-500">FEED.</span></h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button 
              onClick={runPingTest}
              disabled={testingPing}
              className="px-8 py-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600/20 transition-all disabled:opacity-50"
            >
              {testingPing ? (
                <span className="flex items-center gap-3">
                  <i className="fas fa-spinner animate-spin"></i> Pinging Node...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <i className="fas fa-bolt"></i> Test Latency
                </span>
              )}
            </button>
            <div className="px-6 py-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              Backbone Status: Optimal
            </div>
          </div>
        </div>

        {userPing && (
          <div className="mb-12 p-10 glass rounded-[3rem] border-indigo-500/40 animate-in zoom-in slide-in-from-top-4 duration-500 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-black uppercase italic text-white mb-2">Deine Verbindung</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                Verbindung zum nächstgelegenen VONE-Edge Node (Frankfurt-1) erfolgreich.
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black italic text-emerald-400 mono tracking-tighter">{userPing}ms</div>
              <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest mt-2">Local Gateway Latency</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Active Links" value={metrics.users.toLocaleString()} icon="fa-network-wired" color="indigo" unit="" progress={85} />
          <MetricCard title="Backbone Latency" value={metrics.latency.toString()} icon="fa-bolt" color="emerald" unit="ms" />
          <MetricCard title="Node Efficiency" value={metrics.load.toString()} icon="fa-server" color="cyan" unit="%" />
          <MetricCard title="Secure Blocks" value={metrics.threats.toLocaleString()} icon="fa-shield-halved" color="amber" />
        </div>

        {/* System Log Section */}
        <div className="mt-20 p-8 bg-black/40 border border-white/5 rounded-[3rem] font-mono text-[9px] uppercase tracking-widest text-slate-600 space-y-2 h-40 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-10"></div>
          <div className="animate-scroll-log">
             <div className="flex gap-4"><span>[{new Date().toISOString()}]</span> <span className="text-indigo-500">SYS</span> <span>Quantum Handshake successful at Frankfurt-Node-01</span></div>
             <div className="flex gap-4"><span>[{new Date().toISOString()}]</span> <span className="text-emerald-500">NET</span> <span>Bypass active for ISP: Deutsche Telekom</span></div>
             <div className="flex gap-4"><span>[{new Date().toISOString()}]</span> <span className="text-sky-500">ENC</span> <span>AES-256-GCM Tunnels provisioned for 2,400 new users</span></div>
             <div className="flex gap-4"><span>[{new Date().toISOString()}]</span> <span className="text-amber-500">SEC</span> <span>Mitigated DDoS attempt from IP Range 194.22.x.x</span></div>
             <div className="flex gap-4"><span>[{new Date().toISOString()}]</span> <span className="text-indigo-500">SYS</span> <span>Backbone sync 100% complete across all clusters</span></div>
             <div className="flex gap-4"><span>[{new Date().toISOString()}]</span> <span className="text-indigo-500">SYS</span> <span>Quantum Handshake successful at London-Edge-04</span></div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll-log {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-log { animation: scroll-log 10s linear infinite; }
      `}</style>
    </section>
  );
};

const MetricCard: React.FC<{title: string, value: string, icon: string, color: string, unit?: string, progress?: number}> = ({title, value, icon, color, unit, progress}) => (
  <div className="glass p-10 rounded-[3rem] relative overflow-hidden group hover:bg-white/5 transition-all duration-700 hover:-translate-y-2 border-white/5 hover:border-indigo-500/20">
    <div className={`absolute -top-6 -right-6 p-12 opacity-[0.03] group-hover:opacity-10 transition-all text-8xl text-${color}-500 group-hover:rotate-12 duration-700`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 mono">{title}</div>
    <div className="text-5xl font-black text-white mb-4 mono italic tracking-tighter group-hover:scale-105 transition-transform">
      {value}<span className="text-lg text-slate-600 ml-1">{unit}</span>
    </div>
    {progress !== undefined ? (
      <div className="w-full bg-slate-900/50 h-2 mt-6 overflow-hidden rounded-full border border-white/5">
        <div className={`bg-${color}-500 h-full w-[${progress}%] shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-pulse`}></div>
      </div>
    ) : (
      <div className="flex gap-1.5 mt-8 h-8 items-end">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className={`w-1.5 bg-${color}-500/30 group-hover:bg-${color}-500 transition-all rounded-full`} style={{height: `${30 + Math.random() * 70}%`}}></div>
        ))}
      </div>
    )}
  </div>
);

export default Dashboard;
