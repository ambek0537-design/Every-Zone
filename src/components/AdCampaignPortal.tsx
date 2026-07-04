import React, { useState } from 'react';
import { 
  Megaphone, Plus, Calendar, DollarSign, BarChart3, TrendingUp, 
  CheckCircle2, AlertCircle, Sparkles, RefreshCw, Layers,
  ChevronRight, ArrowUpRight, Percent, Target, MousePointerClick
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area 
} from 'recharts';

interface Campaign {
  id: string;
  title: string;
  type: 'SPONSORED_PRODUCT' | 'SPONSORED_PROPERTY' | 'SPONSORED_JOB' | 'BANNER_AD';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through Rate
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

interface AdCampaignPortalProps {
  isDarkMode: boolean;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  lang: 'en' | 'am';
}

export function AdCampaignPortal({ isDarkMode, walletBalance, setWalletBalance, lang }: AdCampaignPortalProps) {
  const [campaignTab, setCampaignTab] = useState<'campaigns' | 'analytics' | 'creator'>('campaigns');
  
  // Real active campaigns state
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 'ad_101', title: 'Makeda Silk Kemis Holiday Promo', type: 'SPONSORED_PRODUCT', budget: 1200, spent: 420, impressions: 8500, clicks: 520, ctr: 6.1, status: 'ACTIVE' },
    { id: 'ad_102', title: 'Bole High-rise Luxury Condo Launch', type: 'SPONSORED_PROPERTY', budget: 3500, spent: 1850, impressions: 14200, clicks: 840, ctr: 5.9, status: 'ACTIVE' },
    { id: 'ad_103', title: 'Dubai Chef Recruitment Drive', type: 'SPONSORED_JOB', budget: 1800, spent: 1200, impressions: 9400, clicks: 680, ctr: 7.2, status: 'ACTIVE' },
    { id: 'ad_104', title: 'Premium Yirgacheffe Teff Combo Banner', type: 'SPONSORED_PRODUCT', budget: 1500, spent: 1500, impressions: 12400, clicks: 430, ctr: 3.4, status: 'COMPLETED' }
  ]);

  // Designer Creator input state
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdType, setNewAdType] = useState<'SPONSORED_PRODUCT' | 'SPONSORED_PROPERTY' | 'SPONSORED_JOB' | 'BANNER_AD'>('SPONSORED_PRODUCT');
  const [newAdBudget, setNewAdBudget] = useState(800);
  const [newAdCity, setNewAdCity] = useState('Addis Ababa');
  const [newAdAge, setNewAdAge] = useState('22-45');

  // Interactive Recharts Daily Performance mock logs
  const analyticsData = [
    { day: 'Mon', impressions: 2400, clicks: 120, spend: 80 },
    { day: 'Tue', impressions: 3800, clicks: 190, spend: 130 },
    { day: 'Wed', impressions: 5100, clicks: 310, spend: 200 },
    { day: 'Thu', impressions: 6400, clicks: 410, spend: 280 },
    { day: 'Fri', impressions: 8500, clicks: 620, spend: 410 },
    { day: 'Sat', impressions: 12000, clicks: 850, spend: 550 },
    { day: 'Sun', impressions: 14200, clicks: 940, spend: 640 }
  ];

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle.trim()) {
      alert('Please fill in Ad Campaign Title!');
      return;
    }
    if (walletBalance < newAdBudget) {
      alert(`❌ Insufficient custom Every-zone Wallet balance! Selected budget is: ${newAdBudget} ETB but you possess only ${walletBalance} ETB. Please click top-right Top Up to recharge dynamic funds first.`);
      return;
    }

    // Deduct budget
    setWalletBalance(prev => prev - newAdBudget);

    // Append to campaigns state
    const newCamp: Campaign = {
      id: `ad_${Math.floor(200 + Math.random() * 800)}`,
      title: newAdTitle,
      type: newAdType,
      budget: newAdBudget,
      spent: 0,
      impressions: 1,
      clicks: 0,
      ctr: 0.0,
      status: 'ACTIVE'
    };

    setCampaigns([newCamp, ...campaigns]);
    setNewAdTitle('');
    setCampaignTab('campaigns');
    alert(`🎉 Campaign Launched Successfully!\n"${newAdTitle}" is now active in Every-zone sponsored feeds. Target demographic has been configured successfully for ${newAdCity} (${newAdAge}).`);
  };

  const handleToggleState = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...c, status: nextStatus as any };
      }
      return c;
    }));
  };

  // Aggregated totals
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImps = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const avgCtr = Math.round((totalClicks / (totalImps || 1)) * 1000) / 10;

  return (
    <div className={`rounded-3xl border shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
      
      {/* Header section */}
      <div className={`p-4 border-b flex justify-between items-center bg-gradient-to-r ${isDarkMode ? 'from-zinc-950 to-zinc-900 border-zinc-800' : 'from-[#1E3A1A]/10 to-[#1E3A1A]/5 border-stone-200'}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl animate-pulse">
            <Megaphone size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5 font-sans">
              📣 Sponsored Ads & Campaign Portal (የማስታወቂያ ሰሌዳ)
            </h3>
            <p className="text-[10px] text-stone-400">Target custom listings, bidding budgets, CPC/CPM analytics, and click performance</p>
          </div>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex bg-stone-150 dark:bg-zinc-800 p-1 rounded-xl text-[9px] font-black uppercase tracking-wider select-none">
          <button 
            type="button"
            onClick={() => setCampaignTab('campaigns')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${campaignTab === 'campaigns' ? 'bg-neutral-900 text-white' : 'text-stone-500'}`}
          >
            Campaigns
          </button>
          <button 
            type="button"
            onClick={() => setCampaignTab('analytics')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${campaignTab === 'analytics' ? 'bg-neutral-900 text-white' : 'text-stone-500'}`}
          >
            Analytics
          </button>
          <button 
            type="button"
            onClick={() => setCampaignTab('creator')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${campaignTab === 'creator' ? 'bg-neutral-900 text-white' : 'text-stone-500'}`}
          >
            + Create Campaign
          </button>
        </div>
      </div>

      {/* BODY CANVAS */}
      <div className="p-4 space-y-4">
        
        {campaignTab === 'campaigns' && (
          <div className="space-y-4">
            {/* Top Stats Overview Row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-stone-50 dark:bg-zinc-800/40 border rounded-2xl border-stone-200 dark:border-zinc-850">
                <span className="text-[8px] text-stone-400 block uppercase font-mono">My Spend Balance</span>
                <span className="text-sm font-black text-emerald-600">{totalSpent.toLocaleString()} ETB</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-zinc-800/40 border rounded-2xl border-stone-200 dark:border-zinc-850">
                <span className="text-[8px] text-stone-400 block uppercase font-mono">Impressions</span>
                <span className="text-sm font-black text-stone-700 dark:text-zinc-200">{totalImps.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-zinc-800/40 border rounded-2xl border-stone-200 dark:border-zinc-850">
                <span className="text-[8px] text-stone-400 block uppercase font-mono">Click Logs</span>
                <span className="text-sm font-black text-amber-500">{totalClicks.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-zinc-800/40 border rounded-2xl border-stone-200 dark:border-zinc-850">
                <span className="text-[8px] text-stone-400 block uppercase font-mono">Avg conversion CTR</span>
                <span className="text-sm font-black text-[#1E3A1A] dark:text-amber-400">{avgCtr}%</span>
              </div>
            </div>

            {/* List of active campaigns */}
            <div className="space-y-3">
              <div className="text-[9.5px] uppercase font-black tracking-widest text-[#C5A059] select-none flex justify-between">
                <span>Active campaigns ledgers</span>
                <span>Bid priority: CPC Bidding Node verified</span>
              </div>

              <div className="space-y-2.5">
                {campaigns.map(cmp => (
                  <div 
                    key={cmp.id}
                    className="p-3.5 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[7px] font-black bg-emerald-50 text-emerald-600 border border-emerald-300 rounded px-1.5 py-0.2 uppercase">
                          {cmp.type}
                        </span>
                        <h4 className="text-xs font-bold leading-none">{cmp.title}</h4>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px] text-stone-400 font-mono">
                        <span>Budget: <strong>{cmp.budget} ETB</strong></span>
                        <span>Spent: <strong className="text-stone-600 dark:text-zinc-300">{cmp.spent} ETB</strong></span>
                        <span>Ctr: <strong>{cmp.ctr}%</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-2 sm:pt-0 border-stone-100">
                      <div className="text-[10px] font-mono text-stone-500 flex gap-2">
                        <span>👁️ {cmp.impressions} imps</span>
                        <span>🖱️ {cmp.clicks} clicks</span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleToggleState(cmp.id)}
                          className={`px-3 py-1 text-[9.5px] rounded-lg font-black uppercase cursor-pointer transition-all ${
                            cmp.status === 'ACTIVE' 
                              ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400' 
                              : 'bg-stone-100 dark:bg-zinc-800 text-stone-400 hover:text-stone-600'
                          }`}
                        >
                          {cmp.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Click-Fraud prevention report banner */}
            <div className="p-3 bg-[#F9F7F2] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl text-[10.5px] text-stone-600 dark:text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
              🛡️ <strong>Click-Fraud Protection Active:</strong> Rate-limiting algorithm actively filters duplicate IPs and bot clicks to preserve real advertiser budget.
            </div>
          </div>
        )}

        {/* ANALYTICS GRAPH VIEW */}
        {campaignTab === 'analytics' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-[#C5A059] flex items-center gap-1.5">
                <BarChart3 size={12} /> Campaign Impression & Spend Metrics Charts
              </h4>
              <p className="text-[10.5px] text-stone-400">Recharts verified graphs indicating dynamic CTR impressions fluctuations in Addis Ababa.</p>
            </div>

            {/* Area Chart Component */}
            <div className="bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 p-4 rounded-2xl aspect-video w-full select-none">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpends" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A1A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1E3A1A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                  <YAxis style={{ fontSize: '9px' }} />
                  <Tooltip contentStyle={{ background: '#1c1917', border: '1px solid #C5A059', borderRadius: '12px', fontSize: '10.5px', color: '#fff' }} />
                  <Area type="monotone" dataKey="impressions" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" name="Impressions" />
                  <Area type="monotone" dataKey="spend" stroke="#1E3A1A" strokeWidth={2} fillOpacity={1} fill="url(#colorSpends)" name="Spend (ETB)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-150">
                <span className="text-[9px] text-[#C5A059] block uppercase tracking-wider font-extrabold mb-1">Ad Score Bidding Criteria</span>
                <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
                  "Ad Placement order is resolved by: **Vendor Rating (40%) + Budget Bid (45%) + Geographic Relevance (15%)**."
                </p>
              </div>
              <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-150">
                <span className="text-[9px] text-emerald-600 block uppercase tracking-wider font-extrabold mb-1">Weekly CPC Conversion</span>
                <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
                  "Conversion rate holds at **4.2% Average** since deploying targeted sub-city filtering index protocols."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CAMPAIGN CREATION PORTAL */}
        {campaignTab === 'creator' && (
          <form onSubmit={handleLaunchCampaign} className="bg-white dark:bg-zinc-900 border rounded-2xl p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-black uppercase text-[#C5A059] flex items-center gap-1.5">
              <Megaphone size={12} /> Launch Live Sponsored Campaign Banner
            </h4>
            <p className="text-[10px] text-stone-400">Specify an active budget to boost visibility inside search filters immediately.</p>

            <div className="space-y-3.5">
              <div>
                <label className="text-[8.5px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Campaign Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Traditional Habesha Garments Grand Promo"
                  value={newAdTitle}
                  onChange={(e) => setNewAdTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8.5px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Placement Focus</label>
                  <select 
                    value={newAdType}
                    onChange={(e) => setNewAdType(e.target.value as any)}
                    className="w-full text-xs px-2 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg font-semibold"
                  >
                    <option value="SPONSORED_PRODUCT">Sponsored Product (ሱቅ እቃ)</option>
                    <option value="SPONSORED_PROPERTY">Sponsored Property (ቤት/ቪላ)</option>
                    <option value="SPONSORED_JOB">Sponsored Job (የቅጥር ስራ)</option>
                    <option value="BANNER_AD">Homepage Top Banner (ሰሌዳ ሰነድ)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8.5px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Bidding Campaign Budget (ETB)</label>
                  <input 
                    type="number" 
                    value={newAdBudget}
                    onChange={(e) => setNewAdBudget(parseInt(e.target.value) || 200)}
                    className="w-full text-xs px-2.5 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-emerald-600 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8.5px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Target Geographic City</label>
                  <select 
                    value={newAdCity} 
                    onChange={(e) => setNewAdCity(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg"
                  >
                    <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                    <option value="Nazret / Adama">Nazret / Adama (አዳማ)</option>
                    <option value="Hawassa">Hawassa (ሐዋሳ)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8.5px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Target Demographic Age</label>
                  <select 
                    value={newAdAge} 
                    onChange={(e) => setNewAdAge(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg"
                  >
                    <option value="18-24">Gen Z (18-24)</option>
                    <option value="22-45">Young Professionals (22-45)</option>
                    <option value="All Ages">All Ages (ባጠቃላይ)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1E3A1A] hover:bg-[#1E3A1A]/95 text-white rounded-xl text-xs font-bold transition-all shadow-md select-none"
              >
                🚀 Deduct Budget & Launch Campaign
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
