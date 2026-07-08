import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, MessageSquare, Send, CheckCircle, Plus, Sparkles, DollarSign,
  TrendingUp, Megaphone, Target, Sliders, Eye, MousePointer, Activity, RefreshCw, BarChart2
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface B2BCompany {
  id: string;
  name: string;
  category: string;
  avatar: string;
  country: string;
  verified: boolean;
  slogan: string;
}

interface B2BProposal {
  id: string;
  author: string;
  targetCategory: string;
  text: string;
  time: string;
}

interface AdCampaign {
  id: string;
  name: string;
  headline: string;
  category: string;
  budget: number;
  country: string;
  targetAudience: string;
  impressions: number;
  clicks: number;
  ctr: number;
  status: 'Active' | 'Paused' | 'Pending';
}

const SEED_COMPANIES: B2BCompany[] = [
  { id: 'b2b-1', name: 'Abebe Handlooms Corp', category: 'Traditional Textile Mfg', avatar: '👗', country: 'Ethiopia', verified: true, slogan: 'Wholesale handloom exports across East Africa' },
  { id: 'b2b-2', name: 'Westlands Logistics Ltd', category: 'Border Clearing & Freight', avatar: '🚛', country: 'Kenya', verified: true, slogan: 'Fast transit and customs clearance Nairobi-Mombasa-Kampala' },
  { id: 'b2b-3', name: 'Makeda Royal Roasters', category: 'Specialty Coffee Export', avatar: '☕', country: 'Ethiopia', verified: true, slogan: 'Premium single-origin wholesale coffee beans' },
  { id: 'b2b-4', name: 'Horizon Placements (Dubai)', category: 'Human Capital Recruitment', avatar: '💼', country: 'Kenya', verified: true, slogan: 'International contract logistics placement solutions' },
  { id: 'b2b-5', name: 'Kampala Cotton Distributors', category: 'Raw Materials Supplier', avatar: '🧶', country: 'Uganda', verified: false, slogan: 'High grade Ugandan cotton thread distribution' }
];

const SEED_PROPOSALS: B2BProposal[] = [
  { id: 'prop-1', author: 'Abebe Handlooms Corp', targetCategory: 'Logistics', text: 'Seeking a verified cross-border freight partner to handle bi-weekly shipments of silk traditional dress cargo from Addis Ababa to Westlands Nairobi showroom.', time: '2 hours ago' },
  { id: 'prop-2', author: 'Westlands Logistics Ltd', targetCategory: 'Supply Chain', text: 'Offering specialized reefer container rates for raw specialty coffee and agricultural items transit from Addis/Hawassa dry port to Mombasa port. Standard customs clearing included.', time: '1 day ago' },
  { id: 'prop-3', author: 'Kampala Cotton Distributors', targetCategory: 'Textiles', text: 'Looking to supply premium raw combed organic cotton thread to weavers and boutique handloom manufacturers in Ethiopia. Custom bulk pricing available upon request.', time: '2 days ago' }
];

const SEED_CAMPAIGNS: AdCampaign[] = [
  { id: 'ad-1', name: 'Sidama Coffee Wholesale Launch', headline: 'Direct Sidama organic lot batch wholesale discounts!', category: 'Products', budget: 15000, country: 'Kenya', targetAudience: 'Café Owners', impressions: 42100, clicks: 3420, ctr: 8.1, status: 'Active' },
  { id: 'ad-2', name: 'Nairobi Luxury Apartments Promo', headline: 'Bole Atlas 2-Bedroom Lofts with Escrow Security', category: 'Properties', budget: 25000, country: 'Ethiopia', targetAudience: 'Foreign Investors', impressions: 18450, clicks: 1240, ctr: 6.7, status: 'Active' }
];

interface B2BAdPlatformProps {
  isDarkMode: boolean;
  selectedCountry: string;
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  lang: 'en' | 'am';
}

export function B2BAdPlatform({
  isDarkMode,
  selectedCountry,
  triggerPushNotification,
  lang
}: B2BAdPlatformProps) {
  const [activeTab, setActiveTab] = useState<'network' | 'adplatform'>('network');

  // B2B NETWORK STATE
  const [proposals, setProposals] = useState<B2BProposal[]>(SEED_PROPOSALS);
  const [showAddProposal, setShowAddProposal] = useState(false);
  const [newProposalText, setNewProposalText] = useState('');
  const [newProposalTarget, setNewProposalTarget] = useState('Logistics');
  const [b2bChatPartner, setB2bChatPartner] = useState<B2BCompany | null>(SEED_COMPANIES[0]);
  const [b2bChatText, setB2bChatText] = useState('');
  const [b2bChatThreads, setB2bChatThreads] = useState<Record<string, { sender: 'user' | 'them', text: string, time: string }[]>>({
    'b2b-1': [
      { sender: 'them', text: 'Greeting Henok! We saw your profile. Are you looking to coordinate raw silk supply to Nairobi?', time: '10:00 AM' },
      { sender: 'user', text: 'Yes, looking to establish bulk escrow shipments. What is your wholesale rate per roll?', time: '10:15 AM' }
    ]
  });

  // AD PLATFORM STATE
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(SEED_CAMPAIGNS);
  const [newAdName, setNewAdName] = useState('');
  const [newAdHeadline, setNewAdHeadline] = useState('');
  const [newAdCategory, setNewAdCategory] = useState('Products');
  const [newAdBudget, setNewAdBudget] = useState(10000);
  const [newAdCountry, setNewAdCountry] = useState('Ethiopia');
  const [newAdAudience, setNewAdAudience] = useState('All Business Owners');
  const [showAddAd, setShowAddAd] = useState(false);

  // Simulated Recharts chart data
  const adPerformanceData = [
    { name: 'Mon', Impressions: 4200, Clicks: 310, CTR: 7.3 },
    { name: 'Tue', Impressions: 6500, Clicks: 540, CTR: 8.3 },
    { name: 'Wed', Impressions: 8900, Clicks: 810, CTR: 9.1 },
    { name: 'Thu', Impressions: 12100, Clicks: 920, CTR: 7.6 },
    { name: 'Fri', Impressions: 10400, Clicks: 840, CTR: 8.0 }
  ];

  const handleSendB2BMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bChatPartner || !b2bChatText.trim()) return;

    const partnerId = b2bChatPartner.id;
    const userMsg = b2bChatText;
    setB2bChatText('');

    setB2bChatThreads(prev => ({
      ...prev,
      [partnerId]: [...(prev[partnerId] || []), { sender: 'user', text: userMsg, time: 'Just now' }]
    }));

    // Simulated reply
    setTimeout(() => {
      setB2bChatThreads(prev => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), { sender: 'them', text: `🤝 Thank you for the note. Our B2B commercial division has registered your proposal regarding "${userMsg}". We will transmit formal contract terms shortly via Every-zone Escrow Ledger.`, time: 'Just now' }]
      }));
      triggerPushNotification('B2B Corporate Response', `Corporate inquiry response from ${b2bChatPartner.name}`, '🤝', 'inbox');
    }, 1500);
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdName || !newAdHeadline) return;

    const newAd: AdCampaign = {
      id: `ad-${Date.now()}`,
      name: newAdName,
      headline: newAdHeadline,
      category: newAdCategory,
      budget: newAdBudget,
      country: newAdCountry,
      targetAudience: newAdAudience,
      impressions: Math.floor(Math.random() * 500) + 120,
      clicks: Math.floor(Math.random() * 20) + 5,
      ctr: parseFloat((Math.random() * 4 + 4).toFixed(1)),
      status: 'Active'
    };

    setCampaigns([newAd, ...campaigns]);
    triggerPushNotification('Campaign Launched!', `Your self-serve ad "${newAdName}" is now active in the ecosystem feed.`, '📢', 'admin');
    
    // reset form
    setNewAdName('');
    setNewAdHeadline('');
    setNewAdBudget(10000);
    setShowAddAd(false);
  };

  const handleAddProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposalText.trim()) return;

    const newProp: B2BProposal = {
      id: `prop-${Date.now()}`,
      author: 'Every-zone Partner LLC',
      targetCategory: newProposalTarget,
      text: newProposalText,
      time: 'Just now'
    };

    setProposals([newProp, ...proposals]);
    triggerPushNotification('Proposal Published', 'Your B2B networking proposal was broadcast to verified companies.', '💼', 'feed');
    setNewProposalText('');
    setShowAddProposal(false);
  };

  return (
    <div className={`p-5 rounded-3xl border ${
      isDarkMode ? 'bg-[#0f0f0f] border-zinc-850' : 'bg-white border-stone-200'
    }`}>
      {/* HEADER TABS */}
      <div className="flex justify-between items-center border-b border-zinc-850/60 pb-3 mb-4">
        <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'network'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Briefcase size={13} />
            <span>{lang === 'en' ? 'B2B Business Network' : 'የንግድ ትስስር (B2B)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('adplatform')}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'adplatform'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Megaphone size={13} />
            <span>{lang === 'en' ? 'Ad Campaign Platform' : 'የማስታወቂያ መድረክ'}</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-amber-500 font-extrabold uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
          B2B Enterprise Node
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* BUSINESS NETWORK (B2B) */}
        {/* ========================================================= */}
        {activeTab === 'network' && (
          <motion.div
            key="b2b-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Top row: Verified corporate directory */}
            <div className="space-y-3">
              <div>
                <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">Verified Corporate Members</span>
                <h3 className="text-sm font-extrabold">{lang === 'en' ? 'B2B Corporate Directory' : 'የኩባንያዎች ማውጫ'}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {SEED_COMPANIES.map(comp => (
                  <div
                    key={comp.id}
                    onClick={() => setB2bChatPartner(comp)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      b2bChatPartner?.id === comp.id
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : isDarkMode ? 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex gap-2 items-start mb-2">
                      <div className="text-2xl">{comp.avatar}</div>
                      <div>
                        <h4 className="text-xs font-extrabold text-stone-200 flex items-center gap-1">
                          <span>{comp.name}</span>
                          {comp.verified && (
                            <span className="text-[9px]" title="Verified Corporate Partner">🛡️</span>
                          )}
                        </h4>
                        <span className="text-[8.5px] font-mono text-amber-500">{comp.category}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-400 italic leading-snug">"{comp.slogan}"</p>
                    <div className="text-[8.5px] font-mono text-stone-500 mt-2 flex justify-between">
                      <span>Origin: {comp.country}</span>
                      <span className="text-amber-400 group-hover:underline">Chat B2B →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B2B Collaboration board & Live Negotiation chat */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Proposals Board */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">B2B Partnership Board</span>
                    <h3 className="text-xs font-black">Joint Collaborations</h3>
                  </div>
                  
                  <button
                    onClick={() => setShowAddProposal(!showAddProposal)}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-stone-200 text-[10px] font-black px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    {showAddProposal ? 'Cancel' : '+ Post Proposal'}
                  </button>
                </div>

                <AnimatePresence>
                  {showAddProposal && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddProposal}
                      className="bg-black/60 border border-zinc-850 p-4 rounded-2xl space-y-3"
                    >
                      <div>
                        <label className="text-[9px] text-stone-500 uppercase font-mono font-black block mb-1">Target Category</label>
                        <select
                          value={newProposalTarget}
                          onChange={(e) => setNewProposalTarget(e.target.value)}
                          className="bg-zinc-950 border border-zinc-850 text-xs rounded-xl px-3 py-2 w-full text-stone-200 outline-none"
                        >
                          <option value="Logistics">Logistics & Freight</option>
                          <option value="Supply Chain">Supply Chain Bulk</option>
                          <option value="Textiles">Textile Raw Thread</option>
                          <option value="Agriculture">Agriculture & Beans</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] text-stone-500 uppercase font-mono font-black block mb-1">Proposal Pitch Details</label>
                        <textarea
                          value={newProposalText}
                          onChange={(e) => setNewProposalText(e.target.value)}
                          placeholder="Detail your corporate needs, cross-border goals, or supply demands..."
                          className="bg-zinc-950 border border-zinc-850 text-xs rounded-xl px-3 py-2 w-full text-stone-200 outline-none h-20 resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] uppercase px-4 py-2 rounded-xl cursor-pointer transition w-full"
                      >
                        Publish Proposal Broadcaster
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {proposals.map(prop => (
                    <div key={prop.id} className={`p-3 bg-black/30 border border-zinc-900 rounded-2xl text-left`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-stone-300">{prop.author}</span>
                        <span className="text-[8px] font-mono uppercase bg-amber-500/10 text-amber-500 px-2 rounded">
                          {prop.targetCategory}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 leading-normal mb-2">{prop.text}</p>
                      <span className="text-[8px] text-stone-500 font-mono block">{prop.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live B2B Negotiator Chat */}
              <div className="lg:col-span-2">
                <div className="bg-black/60 border border-zinc-900 rounded-3xl p-4 flex flex-col h-[300px]">
                  {b2bChatPartner ? (
                    <>
                      <div className="border-b border-zinc-850 pb-2 mb-2 text-left">
                        <span className="text-[8px] font-black uppercase text-amber-500 font-mono">B2B SECURE NEGOTIATOR</span>
                        <h4 className="text-xs font-black text-stone-200 flex items-center gap-1">
                          <span>{b2bChatPartner.avatar}</span>
                          <span>{b2bChatPartner.name}</span>
                        </h4>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[10px]">
                        {(b2bChatThreads[b2bChatPartner.id] || []).map((msg, idx) => (
                          <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-2.5 rounded-xl max-w-[85%] ${
                              msg.sender === 'user'
                                ? 'bg-amber-500 text-stone-950 font-semibold rounded-tr-none'
                                : 'bg-zinc-900 text-stone-200 rounded-tl-none'
                            }`}>
                              <p className="leading-snug">{msg.text}</p>
                            </div>
                            <span className="text-[7.5px] text-stone-500 font-mono mt-0.5 px-1">{msg.time}</span>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSendB2BMsg} className="mt-2.5 flex gap-1.5 border-t border-zinc-850 pt-2.5">
                        <input
                          type="text"
                          value={b2bChatText}
                          onChange={(e) => setB2bChatText(e.target.value)}
                          placeholder="Inquire wholesale escrow terms..."
                          className="flex-1 text-[10.5px] bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 outline-none focus:border-amber-500/40 text-stone-200"
                        />
                        <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-stone-950 p-2 rounded-lg cursor-pointer">
                          <Send size={12} />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="m-auto text-xs text-stone-500 text-center">Select business from directory above to negotiate.</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* AD CAMPAIGN PLATFORM */}
        {/* ========================================================= */}
        {activeTab === 'adplatform' && (
          <motion.div
            key="adplatform-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Top Campaign summary performance charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-black/20 border border-zinc-900 p-4 rounded-3xl h-56 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-500 font-mono">Live Impressions Analytics</span>
                  <h4 className="text-xs font-black">All Campaigns CTR Performance</h4>
                </div>

                <div className="h-36 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adPerformanceData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={8} />
                      <YAxis stroke="#52525b" fontSize={8} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', fontSize: '9px' }} />
                      <Area type="monotone" dataKey="Impressions" stroke="#d97706" fillOpacity={1} fill="url(#colorImp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-black/20 border border-zinc-900 p-4 rounded-3xl h-56 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-emerald-400 font-mono">Click-Through Ratio</span>
                  <h4 className="text-xs font-black">Clicks acquired per campaign</h4>
                </div>

                <div className="h-36 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={adPerformanceData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={8} />
                      <YAxis stroke="#52525b" fontSize={8} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', fontSize: '9px' }} />
                      <Bar dataKey="Clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Campaign control manager & campaign creator */}
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">Self-Serve Console</span>
                  <h3 className="text-sm font-extrabold">{lang === 'en' ? 'My Active Campaigns' : 'የማስታወቂያ ዘመቻዎች'}</h3>
                </div>

                <button
                  onClick={() => setShowAddAd(!showAddAd)}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition"
                >
                  <Plus size={14} />
                  <span>{showAddAd ? 'Close Panel' : 'Create Campaign'}</span>
                </button>
              </div>

              <AnimatePresence>
                {showAddAd && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleLaunchCampaign}
                    className="bg-black/40 border border-zinc-850 p-5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9.5px] text-stone-400 font-mono font-bold uppercase block mb-1">Campaign Name</label>
                        <input
                          type="text"
                          value={newAdName}
                          onChange={(e) => setNewAdName(e.target.value)}
                          placeholder="e.g. Traditional Handwoven Silk Sale"
                          className="bg-zinc-950 border border-zinc-850 text-xs rounded-xl px-4 py-2.5 w-full text-stone-200 outline-none focus:border-amber-500/40"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[9.5px] text-stone-400 font-mono font-bold uppercase block mb-1">Ad Banner Headline</label>
                        <input
                          type="text"
                          value={newAdHeadline}
                          onChange={(e) => setNewAdHeadline(e.target.value)}
                          placeholder="e.g. Silk Habesha Dress back in bulk stock! 15% discount for bulk escrow orders"
                          className="bg-zinc-950 border border-zinc-850 text-xs rounded-xl px-4 py-2.5 w-full text-stone-200 outline-none focus:border-amber-500/40"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9.5px] text-stone-400 font-mono font-bold uppercase block mb-1">Category Target</label>
                          <select
                            value={newAdCategory}
                            onChange={(e) => setNewAdCategory(e.target.value)}
                            className="bg-zinc-950 border border-zinc-850 text-xs rounded-xl px-3 py-2.5 w-full text-stone-200 outline-none"
                          >
                            <option value="Products">Products Marketplace</option>
                            <option value="Properties">Real Estate Properties</option>
                            <option value="Jobs">Overseas Placements</option>
                            <option value="Services">Services Providers</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9.5px] text-stone-400 font-mono font-bold uppercase block mb-1">Country Target</label>
                          <select
                            value={newAdCountry}
                            onChange={(e) => setNewAdCountry(e.target.value)}
                            className="bg-zinc-950 border border-zinc-850 text-xs rounded-xl px-3 py-2.5 w-full text-stone-200 outline-none"
                          >
                            <option value="Ethiopia">🇪🇹 Ethiopia</option>
                            <option value="Kenya">🇰🇪 Kenya</option>
                            <option value="Uganda">🇺🇬 Uganda</option>
                            <option value="Rwanda">🇷🇼 Rwanda</option>
                            <option value="Tanzania">🇹🇿 Tanzania</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[9.5px] text-stone-400 font-mono font-bold uppercase block mb-1">Target Audience Tag</label>
                        <input
                          type="text"
                          value={newAdAudience}
                          onChange={(e) => setNewAdAudience(e.target.value)}
                          placeholder="e.g. Traditional Dress Retailers"
                          className="bg-zinc-950 border border-zinc-850 text-xs rounded-xl px-4 py-2.5 w-full text-stone-200 outline-none focus:border-amber-500/40"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9.5px] text-stone-400 font-mono font-bold uppercase block">Daily Campaign Budget</label>
                          <span className="text-xs font-black text-amber-500 font-mono">{newAdBudget.toLocaleString()} ETB</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="100000"
                          step="1000"
                          value={newAdBudget}
                          onChange={(e) => setNewAdBudget(parseInt(e.target.value))}
                          className="w-full accent-amber-500 bg-zinc-900 h-1 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] font-mono text-stone-500 mt-1">
                          <span>1,000 ETB</span>
                          <span>100,000 ETB max</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs uppercase px-4 py-3 rounded-2xl cursor-pointer transition w-full flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10"
                      >
                        <Sparkles size={14} />
                        <span>Launch Campaign Now</span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Active Campaigns grid list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map(camp => (
                  <div key={camp.id} className="p-4 rounded-3xl border border-zinc-900 bg-black/40 text-left flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-amber-500/10 text-amber-500 text-[8.5px] font-bold uppercase rounded-bl-2xl border-l border-b border-amber-500/15 font-mono">
                      ● Active
                    </div>

                    <div className="mb-4">
                      <span className="text-[8px] font-mono font-black text-stone-500 uppercase bg-zinc-900 px-2 py-0.5 rounded">
                        {camp.category} • Target: {camp.country}
                      </span>
                      <h4 className="text-xs font-black mt-2 text-stone-200">{camp.name}</h4>
                      <p className="text-[10px] text-amber-500 font-medium italic mt-1 bg-amber-500/5 border border-amber-500/10 p-2 rounded-xl">
                        "{camp.headline}"
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center font-mono text-xs border-t border-zinc-900 pt-3">
                      <div className="bg-zinc-950/60 p-2 rounded-xl">
                        <span className="text-[8px] text-stone-500 block uppercase font-sans">Impressions</span>
                        <span className="font-extrabold text-stone-250">{camp.impressions.toLocaleString()}</span>
                      </div>
                      <div className="bg-zinc-950/60 p-2 rounded-xl">
                        <span className="text-[8px] text-stone-500 block uppercase font-sans">Clicks</span>
                        <span className="font-extrabold text-emerald-400">{camp.clicks.toLocaleString()}</span>
                      </div>
                      <div className="bg-zinc-950/60 p-2 rounded-xl">
                        <span className="text-[8px] text-stone-500 block uppercase font-sans">CTR Ratio</span>
                        <span className="font-extrabold text-amber-500">{camp.ctr}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
