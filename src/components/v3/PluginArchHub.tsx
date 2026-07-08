import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Puzzle, Sliders, Play, Settings, Plus, Layers, Shield, Key, Database, Server,
  Globe, Terminal, CheckCircle, Zap, Ban, Trash2, ArrowRight
} from 'lucide-react';

interface DynamicPlugin {
  id: string;
  name: string;
  category: 'Marketplace' | 'RealEstate' | 'Matchmaking' | 'OverseasJob' | 'Logistics' | 'Utilities';
  endpoint: string;
  permissions: string[];
  status: 'Installed' | 'Pending' | 'Disabled';
  widgetContent: string;
}

const SEED_PLUGINS: DynamicPlugin[] = [
  { id: 'plug-1', name: 'Sheger Courier Dispatch Tracker', category: 'Logistics', endpoint: 'https://api.sheger-dispatch.et/v1', permissions: ['location', 'notifications'], status: 'Installed', widgetContent: '📍 Rider live transit speed: 34 km/h • Escrow contract locked' },
  { id: 'plug-2', name: 'Traditional Coffee Auction Bidder', category: 'Marketplace', endpoint: 'https://auction.coffee-ethiopia.et/ws', permissions: ['notifications', 'biometrics'], status: 'Installed', widgetContent: '☕ Sidama lot #241 bidding live: Current Bid 720 ETB/kg' },
  { id: 'plug-3', name: 'Bole Atlas Room Tour VR Engine', category: 'RealEstate', endpoint: 'https://vr.bole-atlas.com/api', permissions: ['camera'], status: 'Installed', widgetContent: '🏠 3D Interactive Virtual walk-through buffer active' }
];

interface PluginArchHubProps {
  isDarkMode: boolean;
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  lang: 'en' | 'am';
}

export function PluginArchHub({
  isDarkMode,
  triggerPushNotification,
  lang
}: PluginArchHubProps) {
  const [activeTab, setActiveTab] = useState<'plugins' | 'arch'>('plugins');

  // PLUGIN REGISTRY STATE
  const [plugins, setPlugins] = useState<DynamicPlugin[]>(SEED_PLUGINS);
  const [newPluginName, setNewPluginName] = useState('');
  const [newPluginCat, setNewPluginCat] = useState<'Marketplace' | 'RealEstate' | 'Matchmaking' | 'OverseasJob' | 'Logistics' | 'Utilities'>('Marketplace');
  const [newPluginEndpoint, setNewPluginEndpoint] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>(['notifications']);
  const [showAddPlugin, setShowAddPlugin] = useState(false);
  const [activeWidgetIdx, setActiveWidgetIdx] = useState<number>(0);

  const availablePerms = [
    { id: 'location', label: '📍 Geolocation API' },
    { id: 'camera', label: '📷 Camera Scanner' },
    { id: 'notifications', label: '🔔 Push Alert Nodes' },
    { id: 'biometrics', label: '🧬 Fayda Biometric ID' }
  ];

  const handleTogglePerm = (permId: string) => {
    if (selectedPerms.includes(permId)) {
      setSelectedPerms(selectedPerms.filter(p => p !== permId));
    } else {
      setSelectedPerms([...selectedPerms, permId]);
    }
  };

  const handleRegisterPlugin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPluginName || !newPluginEndpoint) return;

    const newPlug: DynamicPlugin = {
      id: `plug-${Date.now()}`,
      name: newPluginName,
      category: newPluginCat,
      endpoint: newPluginEndpoint,
      permissions: selectedPerms,
      status: 'Installed',
      widgetContent: `⚡ [${newPluginName}] Custom registered module successfully active. Endpoint: ${newPluginEndpoint}`
    };

    setPlugins([...plugins, newPlug]);
    triggerPushNotification(
      'Plugin Registered!',
      `Autoname: ${newPluginName} mounted safely. Permissions granted: ${selectedPerms.join(', ')}`,
      '🧩',
      'admin'
    );

    // Reset forms
    setNewPluginName('');
    setNewPluginEndpoint('');
    setSelectedPerms(['notifications']);
    setShowAddPlugin(false);
  };

  const handleTogglePluginStatus = (plugId: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === plugId) {
        const nextStatus = p.status === 'Installed' ? 'Disabled' : 'Installed';
        triggerPushNotification(
          nextStatus === 'Installed' ? 'Plugin Enabled' : 'Plugin Suspended',
          `Plugin "${p.name}" has updated state to ${nextStatus}.`,
          '🧩',
          'admin'
        );
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleUninstallPlugin = (plugId: string, name: string) => {
    setPlugins(prev => prev.filter(p => p.id !== plugId));
    triggerPushNotification('Plugin Uninstalled', `Deleted virtual registry index for ${name}.`, '🗑️', 'admin');
  };

  return (
    <div className={`p-5 rounded-3xl border ${
      isDarkMode ? 'bg-[#0f0f0f] border-zinc-850' : 'bg-white border-stone-200'
    }`}>
      {/* HEADER TABS */}
      <div className="flex justify-between items-center border-b border-zinc-850/60 pb-3 mb-4">
        <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('plugins')}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'plugins'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Puzzle size={13} />
            <span>{lang === 'en' ? 'Modular Plugin Registry' : 'የፕለጊን ሲስተም'}</span>
          </button>

          <button
            onClick={() => setActiveTab('arch')}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'arch'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers size={13} />
            <span>{lang === 'en' ? 'Enterprise Architecture v3' : 'ስርዓት አርክቴክቸር v3'}</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-amber-500 font-extrabold uppercase bg-amber-500/10 px-2.5 py-0.5 rounded animate-pulse">
          Admin Dev Mode
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* PLUGIN SYSTEM */}
        {/* ========================================================= */}
        {activeTab === 'plugins' && (
          <motion.div
            key="plugins-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              
              {/* Plugin Control Form Panel */}
              <div className="lg:col-span-2 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">Dynamic Registration</span>
                    <h3 className="text-xs font-black">Register New Plugin</h3>
                  </div>

                  <button
                    onClick={() => setShowAddPlugin(!showAddPlugin)}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-stone-200 text-[10px] font-black px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    {showAddPlugin ? 'Close form' : '+ New Plugin'}
                  </button>
                </div>

                <AnimatePresence>
                  {showAddPlugin ? (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleRegisterPlugin}
                      className="bg-black/60 border border-zinc-850 p-4 rounded-2xl space-y-3.5 text-xs"
                    >
                      <div>
                        <label className="text-[8.5px] text-stone-500 uppercase font-mono block mb-1">Plugin Module Name</label>
                        <input
                          type="text"
                          value={newPluginName}
                          onChange={(e) => setNewPluginName(e.target.value)}
                          placeholder="e.g. Hawassa Flower Dispatcher"
                          className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 w-full text-stone-200 outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8.5px] text-stone-500 uppercase font-mono block mb-1">Module Category</label>
                          <select
                            value={newPluginCat}
                            onChange={(e) => setNewPluginCat(e.target.value as any)}
                            className="bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-2 w-full text-stone-200 outline-none"
                          >
                            <option value="Marketplace">Marketplace</option>
                            <option value="RealEstate">Real Estate</option>
                            <option value="Matchmaking">Matchmaking</option>
                            <option value="OverseasJob">Overseas Job</option>
                            <option value="Logistics">Logistics</option>
                            <option value="Utilities">Utilities</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[8.5px] text-stone-500 uppercase font-mono block mb-1">Secure Endpoint URL</label>
                          <input
                            type="text"
                            value={newPluginEndpoint}
                            onChange={(e) => setNewPluginEndpoint(e.target.value)}
                            placeholder="https://api..."
                            className="bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-2 w-full text-stone-200 outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[8.5px] text-stone-500 uppercase font-mono block mb-1.5">Request Sandbox Permissions</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {availablePerms.map(perm => {
                            const isChecked = selectedPerms.includes(perm.id);
                            return (
                              <button
                                key={perm.id}
                                type="button"
                                onClick={() => handleTogglePerm(perm.id)}
                                className={`p-2 rounded-xl text-left transition border text-[10px] cursor-pointer ${
                                  isChecked
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                                    : 'bg-zinc-950 border-zinc-900 text-stone-400'
                                }`}
                              >
                                {perm.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black uppercase text-[10px] px-4 py-2.5 rounded-xl w-full cursor-pointer transition shadow"
                      >
                        Install Plugin Assembly
                      </button>
                    </motion.form>
                  ) : (
                    <div className="bg-black/30 border border-zinc-900 rounded-3xl p-4 space-y-3">
                      <span className="text-[8px] font-black uppercase text-amber-500 font-mono block">Dynamic Mounting Terminal</span>
                      <h4 className="text-xs font-black text-stone-300">Selected Plugin Widget Engine</h4>
                      
                      {plugins.length > 0 ? (
                        <div className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-2xl text-left space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-[11px] text-stone-200">{plugins[activeWidgetIdx]?.name}</span>
                            <span className="text-[7.5px] font-mono text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded uppercase">
                              Mount Node Active
                            </span>
                          </div>
                          
                          <p className="text-[10px] font-mono leading-relaxed p-2 bg-black/40 text-amber-400 border border-zinc-900 rounded-xl">
                            {plugins[activeWidgetIdx]?.status === 'Installed' 
                              ? plugins[activeWidgetIdx]?.widgetContent 
                              : '⚠️ Plugin Status Suspended. Reactivate below to mount sub-frame.'}
                          </p>

                          <div className="text-[8px] font-mono text-stone-500 space-y-0.5">
                            <div>Endpoint: {plugins[activeWidgetIdx]?.endpoint}</div>
                            <div>Allowed Sandbox Keys: {plugins[activeWidgetIdx]?.permissions.join(', ')}</div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-stone-500 text-[10px]">No active plugins installed. Create a virtual plugin above.</p>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Installed Plugins Grid list */}
              <div className="lg:col-span-3 space-y-3.5 text-left">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">Installed Modules</span>
                  <h3 className="text-sm font-extrabold">Active Assemblies Registry</h3>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {plugins.map((plug, idx) => (
                    <div
                      key={plug.id}
                      onClick={() => setActiveWidgetIdx(idx)}
                      className={`p-3.5 rounded-3xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                        activeWidgetIdx === idx
                          ? 'bg-amber-500/5 border-amber-500/40'
                          : isDarkMode ? 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-stone-200">{plug.name}</span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 rounded uppercase ${
                            plug.status === 'Installed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {plug.status}
                          </span>
                        </div>
                        <p className="text-[9.5px] text-stone-500 font-mono">Cat: {plug.category} • {plug.endpoint}</p>
                      </div>

                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleTogglePluginStatus(plug.id)}
                          className={`text-[9.5px] font-mono font-black uppercase px-2.5 py-1.5 rounded-xl cursor-pointer transition ${
                            plug.status === 'Installed'
                              ? 'bg-zinc-900 border border-zinc-800 text-stone-300 hover:bg-zinc-850'
                              : 'bg-emerald-500 text-stone-950 font-black'
                          }`}
                        >
                          {plug.status === 'Installed' ? 'Disable' : 'Enable'}
                        </button>

                        <button
                          onClick={() => handleUninstallPlugin(plug.id, plug.name)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-xl transition cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* ENTERPRISE ARCHITECTURE V3 DIAGRAM */}
        {/* ========================================================= */}
        {activeTab === 'arch' && (
          <motion.div
            key="arch-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <div className={`w-full max-w-4xl bg-black/60 border border-zinc-900 rounded-3xl p-5 text-left`}>
              <div className="border-b border-zinc-850 pb-3 mb-5">
                <span className="text-[9px] font-black tracking-widest text-[#C5A059] font-mono block">ENTERPRISE SYSTEM CORRIDOR</span>
                <h3 className="text-base font-black uppercase">Every-zone High Performance Architecture v3</h3>
                <p className="text-[10.5px] text-stone-400 mt-1">
                  Multi-tier container orchestrations running real-time Fayda ledger, biometric audits, and high-frequency escrow settlements.
                </p>
              </div>

              {/* Dynamic Stack visualization */}
              <div className="space-y-3 text-xs">
                
                {/* 1. Presentation Node */}
                <div className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex gap-2.5 items-center">
                    <span className="text-lg">📱</span>
                    <div>
                      <h4 className="font-extrabold text-stone-200">Layer 1: Unified Multi-Country Client Apps</h4>
                      <p className="text-[10px] text-stone-500">React + Vite SPA • Touch Optimizations • Multi-Country Currency Conversions</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono uppercase bg-amber-500/10 text-amber-500 px-2 py-1 rounded">Ingress Target</span>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-3 bg-zinc-800"></div>
                </div>

                {/* 2. Routing Gateways */}
                <div className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex gap-2.5 items-center">
                    <span className="text-lg">🛣️</span>
                    <div>
                      <h4 className="font-extrabold text-stone-200">Layer 2: Load Balancing API Gateways</h4>
                      <p className="text-[10px] text-stone-500">Nginx Reverse Proxy • Rate Limiting Node • Fayda Biometrics Token Authorizer</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono uppercase bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Transit Route</span>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-3 bg-zinc-800"></div>
                </div>

                {/* 3. Core Domain Microservices */}
                <div className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-2xl space-y-2.5">
                  <div className="flex gap-2.5 items-center border-b border-zinc-900 pb-2">
                    <span className="text-lg">⚙️</span>
                    <div>
                      <h4 className="font-extrabold text-stone-200">Layer 3: Core Domain Microservices Hub</h4>
                      <p className="text-[10px] text-stone-500">Decoupled autonomous transactional loops triggered via virtual plugin registers.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[9px] font-bold">
                    <div className="bg-black/55 p-2 rounded-xl border border-zinc-900 text-stone-300">🏪 Marketplace</div>
                    <div className="bg-black/55 p-2 rounded-xl border border-zinc-900 text-stone-300">🏠 Real Estate</div>
                    <div className="bg-black/55 p-2 rounded-xl border border-zinc-900 text-stone-300">💼 Overseas Job</div>
                    <div className="bg-black/55 p-2 rounded-xl border border-zinc-900 text-stone-300">💑 Matchmaking</div>
                    <div className="bg-black/55 p-2 rounded-xl border border-zinc-900 text-stone-300">🗺️ Geolocation</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-3 bg-zinc-800"></div>
                </div>

                {/* 4. Infrastructure & Shared Core */}
                <div className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex gap-2.5 items-center">
                    <span className="text-lg">🗄️</span>
                    <div>
                      <h4 className="font-extrabold text-stone-200">Layer 4: Distributed Database, Monitoring & Logs</h4>
                      <p className="text-[10px] text-stone-500">Google Spanner Cluster • Redis High Speed Cache • Chapa Settlement Webhook ledger</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Durable State</span>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
