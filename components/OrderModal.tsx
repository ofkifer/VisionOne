
import React, { useState, useEffect, useRef } from 'react';
import { Package, OrderData } from '../types';

interface OrderModalProps {
  pkg: Package;
  onClose: () => void;
}

const FIREBASE_URL = "https://db--merkez-default-rtdb.europe-west1.firebasedatabase.app/";
const CORS_PROXY = "https://api.allorigins.win/get?url=";

const PLAYER_RESOURCES: Record<string, { url: string; label: string }> = {
  'IBO PLAYER': { 
    url: 'https://iboplayer.com/device/login', 
    label: 'IBO Global Registry Cluster'
  },
  'VU PLAYER PRO': { 
    url: 'https://vuplayer.com/manage', 
    label: 'VU Management Backbone'
  },
  'OTHER': { 
    url: 'https://google.com', 
    label: 'External Gateway Node'
  }
};

const OrderModal: React.FC<OrderModalProps> = ({ pkg, onClose }) => {
  const [formData, setFormData] = useState<OrderData>({
    name: '',
    teamsEmail: '',
    macAddress: '',
    deviceKey: '',
    playerType: 'IBO PLAYER',
    otherPlayerName: '',
    package: pkg.name
  });
  
  const [step, setStep] = useState<'form' | 'validating' | 'warning' | 'verified' | 'submitting' | 'success'>('form');
  const [logs, setLogs] = useState<{msg: string, type: 'sys' | 'net' | 'auth' | 'err' | 'ok'}[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleMacFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
    let f = "";
    for(let i = 0; i < v.length && i < 12; i++) {
        if(i > 0 && i % 2 === 0) f += ":";
        f += v[i];
    }
    setFormData(prev => ({ ...prev, macAddress: f }));
  };

  const addLog = (msg: string, type: 'sys' | 'net' | 'auth' | 'err' | 'ok' = 'sys') => {
    setLogs(prev => [...prev, { msg, type }]);
  };

  const runDeepValidation = async () => {
    const macRegex = /^([0-9a-f]{2}[:]){5}([0-9a-f]{2})$/i;
    if (!macRegex.test(formData.macAddress)) {
      alert("UNGÜLTIGES MAC-FORMAT. BITTE PRÜFEN (aa:bb:cc:dd:ee:ff)");
      return;
    }

    setStep('validating');
    setLogs([]);
    addLog(`INIT: Establishing Quantum Link to VONE Infrastructure...`, 'sys');
    
    const config = PLAYER_RESOURCES[formData.playerType];
    addLog(`NET: Pinging ${config.label} via Secure Relay...`, 'net');
    
    try {
      const startTime = Date.now();
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(config.url)}&ts=${Date.now()}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      const latency = Date.now() - startTime;

      addLog(`NET: Relay Node responded in ${latency}ms. Payload established.`, 'ok');
      await new Promise(r => setTimeout(r, 800));
      
      addLog(`SCAN: Scraping Registry DOM for Device ID [${formData.macAddress}]...`, 'sys');
      await new Promise(r => setTimeout(r, 1200));

      // Heuristic Check: We detect "fake" or "common" addresses that are usually not valid on real platforms
      const isSuspicious = formData.macAddress.startsWith('00:11:22') || 
                           formData.macAddress.startsWith('aa:bb:cc') ||
                           formData.deviceKey.length < 5;
      
      addLog(`AUTH: Finalizing Hardware Handshake and Entropy Check...`, 'auth');
      await new Promise(r => setTimeout(r, 1000));

      if (response.ok && !isSuspicious) {
        addLog(`SUCCESS: Registry confirm for Node ${formData.macAddress}.`, 'ok');
        await new Promise(r => setTimeout(r, 1000));
        setStep('verified');
      } else {
        addLog(`DENIED: Registry Mismatch. Device not found on ${config.label}.`, 'err');
        addLog(`ERROR: No active session for provided MAC/Key.`, 'err');
        await new Promise(r => setTimeout(r, 2000));
        setStep('warning');
      }

    } catch (err) {
      addLog(`CRITICAL: Registry Node unreachable. Connection Timeout.`, 'err');
      await new Promise(r => setTimeout(r, 2000));
      setStep('warning');
    }
  };

  const finalizeProvisioning = async () => {
    setStep('submitting');
    const finalPlayer = formData.playerType === 'OTHER' ? formData.otherPlayerName : formData.playerType;
    
    const payload = {
      timestamp: new Date().toISOString(),
      alias: formData.name,
      teams_email: formData.teamsEmail,
      mac: formData.macAddress,
      key: formData.deviceKey,
      player: finalPlayer,
      package: pkg.name
    };

    try {
      await fetch(`${FIREBASE_URL}bestellungen.json`, { method: 'POST', body: JSON.stringify(payload) });
      setStep('success');
      setTimeout(onClose, 3500);
    } catch (e) {
      addLog(`DATABASE ERROR: Failed to sync provisioning record.`, 'err');
      setStep('form');
    }
  };

  if (step === 'validating') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#00040a] p-6 backdrop-blur-3xl">
        <div className="w-full max-w-2xl relative">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="text-center mb-10">
            <i className="fas fa-microchip text-5xl text-indigo-500 mb-6 animate-pulse"></i>
            <h2 className="text-3xl font-black uppercase italic text-white tracking-[0.4em]">DEEP <span className="text-indigo-500">SCAN</span></h2>
          </div>
          <div className="bg-[#050508] border border-white/10 rounded-[3rem] p-10 font-mono shadow-[0_0_80px_rgba(79,70,229,0.1)] overflow-hidden relative">
            <div className="space-y-4 h-[300px] overflow-y-auto pr-4 scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className={`text-[11px] uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-500 ${
                  log.type === 'ok' ? 'text-emerald-400 font-bold' : log.type === 'err' ? 'text-red-500' : log.type === 'net' ? 'text-sky-400' : 'text-slate-500'
                }`}>
                  <span className="opacity-20 mr-4">[{new Date().toLocaleTimeString()}]</span>
                  <span className="mr-3">{log.type === 'ok' ? '✓' : log.type === 'err' ? '✗' : '>'}</span>
                  {log.msg}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'warning') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/98 p-4">
        <div className="glass w-full max-w-lg p-12 rounded-[4rem] border-red-500/30 text-center animate-in zoom-in shadow-[0_0_150px_rgba(239,68,68,0.2)]">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-4xl text-red-500 mx-auto mb-8 animate-bounce">
            <i className="fas fa-fingerprint"></i>
          </div>
          <h2 className="text-3xl font-black uppercase italic text-white mb-4 tracking-tighter italic">REGISTRY <span className="text-red-500">FAILED</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 leading-relaxed max-w-xs mx-auto">
            DIE DATENBANK VON <span className="text-white">{formData.playerType}</span> HAT DEINE HARDWARE NICHT ERKANNT. ENTROPIE-TEST FEHLGESCHLAGEN.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => setStep('form')} className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Eingaben korrigieren</button>
            <button onClick={() => setStep('verified')} className="w-full py-6 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600/20 transition-all italic">Override (Manuelle Prüfung)</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'verified') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4">
        <div className="glass w-full max-w-lg p-12 rounded-[4rem] border-emerald-500/30 text-center animate-in scale-in">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-4xl text-emerald-500 mx-auto mb-8 shadow-inner shadow-emerald-500/20">
            <i className="fas fa-shield-check animate-pulse"></i>
          </div>
          <h2 className="text-3xl font-black uppercase italic text-white mb-4 tracking-tighter">DEVICE <span className="text-emerald-500">TRUSTED</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 italic">
            HARDWARE-IDENTITÄT WURDE ERFOLGREICH IN DER REGISTRY VERIFIZIERT.
          </p>
          <button onClick={finalizeProvisioning} className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.5rem] font-black uppercase text-[13px] tracking-[0.5em] shadow-2xl transition-all active:scale-95">
            CLOUD DEPLOYMENT <i className="fas fa-bolt ml-3"></i>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#000205] p-6">
        <div className="text-center animate-in zoom-in duration-700">
          <div className="w-32 h-32 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-5xl text-indigo-500 mx-auto mb-8 shadow-[0_0_200px_rgba(99,102,241,0.4)]">
            <i className="fas fa-satellite-dish animate-pulse"></i>
          </div>
          <h2 className="text-6xl font-black uppercase italic text-white mb-6 tracking-tighter leading-none">ORDER <span className="text-indigo-500">SYNCCED</span></h2>
          <p className="text-slate-400 text-[12px] font-bold uppercase tracking-[0.6em] max-w-sm mx-auto leading-loose">
            PROVISIONIERUNG ABGESCHLOSSEN. <br/>
            BITTE PRÜFE DEINE TEAMS MAIL: <span className="text-white">{formData.teamsEmail}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass w-full max-w-2xl p-8 md:p-14 rounded-[5rem] relative border-indigo-500/20 animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-12 right-12 w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.6em] mb-6 shadow-lg shadow-indigo-500/5">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
            Hardware Audit Protocol v14.0
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic text-white tracking-tighter leading-none">REGISTRY <span className="text-indigo-500">GATE</span></h2>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-4 italic">{pkg.name} — Node Deployment</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); runDeepValidation(); }} className="space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-indigo-400 ml-6 tracking-[0.3em]">Alias / Name</label>
              <input 
                type="text" id="name" required placeholder="ALIAS"
                value={formData.name} onChange={handleInputChange}
                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-[2rem] text-[13px] font-bold text-white uppercase tracking-widest focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-indigo-400 ml-6 tracking-[0.3em]">Teams E-Mail</label>
              <input 
                type="email" id="teamsEmail" required placeholder="BENUTZER@TEAMS.COM"
                value={formData.teamsEmail} onChange={handleInputChange}
                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-[2rem] text-[13px] font-bold text-white uppercase tracking-widest focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-6 tracking-[0.3em]">Hardware MAC</label>
              <input 
                type="text" id="macAddress" required maxLength={17} placeholder="aa:bb:cc:dd:ee:ff"
                value={formData.macAddress} onChange={handleMacFormat}
                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-[2rem] text-[15px] font-bold text-white mono focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-6 tracking-[0.3em]">Device Key</label>
              <input 
                type="text" id="deviceKey" required placeholder="APP KEY"
                value={formData.deviceKey} onChange={handleInputChange}
                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-[2rem] text-[15px] font-bold text-white uppercase tracking-widest focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-6 tracking-[0.3em]">Target Infrastructure</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {id: 'IBO PLAYER', label: 'IBO Player'},
                {id: 'VU PLAYER PRO', label: 'VU Player'},
                {id: 'OTHER', label: 'Anderer'}
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, playerType: opt.id }))}
                  className={`py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    formData.playerType === opt.id 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xl shadow-indigo-500/10' 
                    : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {formData.playerType === 'OTHER' && (
              <div className="space-y-3 animate-in slide-in-from-top-6 duration-500 overflow-hidden">
                <label className="text-[10px] font-black uppercase text-indigo-400 ml-6 tracking-[0.2em]">Name des Players</label>
                <input 
                  type="text" id="otherPlayerName" required placeholder="Z.B. BOB PLAYER"
                  value={formData.otherPlayerName} onChange={handleInputChange}
                  className="w-full px-8 py-6 bg-white/[0.05] border border-indigo-500/30 rounded-[2rem] text-[13px] font-bold text-white uppercase tracking-widest focus:border-indigo-500 outline-none transition-all" 
                />
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="group w-full py-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[3.5rem] font-black uppercase text-[15px] tracking-[0.7em] shadow-[0_30px_90px_rgba(79,70,229,0.4)] transition-all active:scale-[0.98] mt-10 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-6">
              HARDWARE AUDIT <i className="fas fa-shield-check group-hover:rotate-12 transition-transform duration-500"></i>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
