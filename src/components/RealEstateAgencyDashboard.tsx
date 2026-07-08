import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Landmark, Users, Calendar, DollarSign, Plus, Trash2, Edit3, 
  CheckCircle2, RefreshCw, Eye, Star, Search, ShieldAlert, TrendingUp, 
  MessageSquare, ArrowDownCircle, ShieldCheck, CreditCard, ArrowRight, X
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';

interface RealEstateAgencyDashboardProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  onClose: () => void;
}

export function RealEstateAgencyDashboard({ isDarkMode, lang, onClose }: RealEstateAgencyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'leads' | 'wallet' | 'analytics'>('dashboard');
  
  // Storage for listings
  const [listings, setListings] = useState([
    { id: 're1', title: 'Grand Bole Luxury Penthouse', type: 'Apartment', price: 120000, city: 'Addis Ababa', status: 'Active', views: 1840, leads: 24, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=250' },
    { id: 're2', title: 'Bishoftu Lake-View Modern Villa', type: 'Villa', price: 85000, city: 'Bishoftu', status: 'Active', views: 1420, leads: 18, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=250' },
    { id: 're3', title: 'Premium Loft near Bole Medhanialem', type: 'Condominium', price: 45000, city: 'Addis Ababa', status: 'Active', views: 980, leads: 12, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=250' },
    { id: 're4', title: 'Hawassa Shoreline Vacation Cottage', type: 'Cottage', price: 3200000, city: 'Hawassa', status: 'Draft', views: 110, leads: 2, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=250' }
  ]);

  // Form for adding new property
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProp, setNewProp] = useState({
    title: '',
    type: 'Apartment',
    price: '',
    city: 'Addis Ababa',
  });

  // Leads state
  const [leads, setLeads] = useState([
    { id: 'lead-1', name: 'Marta Hailu', phone: '+251 911 445566', property: 'Grand Bole Luxury Penthouse', status: 'Tour Scheduled', date: '2026-07-08 at 10:00 AM' },
    { id: 'lead-2', name: 'Yared Tadesse', phone: '+251 922 889900', property: 'Bishoftu Lake-View Modern Villa', status: 'Inquiry Pending', date: 'Just now' },
    { id: 'lead-3', name: 'Dr. Kidus Abera', phone: '+251 932 011500', property: 'Premium Loft near Bole Medhanialem', status: 'Offer Received', date: 'Yesterday' },
    { id: 'lead-4', name: 'Almaz Belay', phone: '+251 944 556677', property: 'Grand Bole Luxury Penthouse', status: 'Closed', date: '3 days ago' }
  ]);

  // Wallet and withdrawal
  const [balance, setBalance] = useState(389400);
  const [escrowBalance, setEscrowBalance] = useState(145000);
  const [withdrawStep, setWithdrawStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [withdrawAmount, setWithdrawAmount] = useState('50000');
  const [withdrawBank, setWithdrawBank] = useState('CBE');
  const [withdrawAccount, setWithdrawAccount] = useState('1000293481242');

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.title || !newProp.price) return;
    const item = {
      id: `re-${Date.now()}`,
      title: newProp.title,
      type: newProp.type,
      price: parseFloat(newProp.price),
      city: newProp.city,
      status: 'Active',
      views: 12,
      leads: 1,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=250'
    };
    setListings([item, ...listings]);
    setNewProp({ title: '', type: 'Apartment', price: '', city: 'Addis Ababa' });
    setShowAddForm(false);
  };

  const handleDeleteProperty = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
  };

  const handleWithdrawal = () => {
    setWithdrawStep('processing');
    setTimeout(() => {
      setBalance(prev => prev - parseFloat(withdrawAmount));
      setWithdrawStep('success');
      setTimeout(() => setWithdrawStep('idle'), 2500);
    }, 1500);
  };

  // Recharts Data
  const leadTrendData = [
    { name: 'Mon', visits: 120, inquiries: 15 },
    { name: 'Tue', visits: 180, inquiries: 24 },
    { name: 'Wed', visits: 240, inquiries: 32 },
    { name: 'Thu', visits: 190, inquiries: 20 },
    { name: 'Fri', visits: 290, inquiries: 45 },
    { name: 'Sat', visits: 310, inquiries: 58 },
    { name: 'Sun', visits: 420, inquiries: 84 }
  ];

  return (
    <div className={`p-4 rounded-3xl border shadow-xl flex flex-col space-y-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-[#FAF9F5] border-stone-250 text-stone-850'
    }`} id="real-estate-agency-dashboard">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center pb-3 border-b border-stone-200/50 dark:border-zinc-850">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Home size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider font-sans">
              {lang === 'en' ? 'Real Estate Agency Console' : 'የሪል እስቴት ወኪል መቆጣጠሪያ'}
            </h2>
            <p className="text-[9px] font-mono text-stone-400 dark:text-zinc-500 uppercase font-black">
              Bole Elite Agency Node
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-zinc-850 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Internal Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'dashboard', label: lang === 'en' ? 'Overview' : 'አጠቃላይ መግለጫ' },
          { id: 'listings', label: lang === 'en' ? 'My Properties' : 'ቤቶቼ' },
          { id: 'leads', label: lang === 'en' ? 'Buyer Leads' : 'ፈላጊ ደንበኞች' },
          { id: 'wallet', label: lang === 'en' ? 'Sovereign Wallet' : 'የአክሲዮን ቦርሳ' },
          { id: 'analytics', label: lang === 'en' ? 'Insights' : 'ትንታኔዎች' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === t.id
                ? (isDarkMode ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-[#1E3A1A] text-white')
                : (isDarkMode ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850' : 'bg-stone-100 text-stone-600 hover:bg-stone-200')
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[350px] overflow-y-auto">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Active Listings', val: listings.length, suffix: 'Properties', color: 'text-blue-500', icon: '🏢' },
                { label: 'Buyer Leads', val: leads.length, suffix: 'Inquiries', color: 'text-emerald-500', icon: '👥' },
                { label: 'Total Commissions', val: `${balance.toLocaleString()} ETB`, suffix: 'Earned', color: 'text-amber-500', icon: '💼' },
                { label: 'Pending Escrow', val: `${escrowBalance.toLocaleString()} ETB`, suffix: 'Secured', color: 'text-purple-500', icon: '🛡️' }
              ].map((s, idx) => (
                <div key={idx} className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-white border-stone-200'} space-y-1`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[14px]">{s.icon}</span>
                    <span className="text-[8px] font-bold text-stone-400 uppercase">LIVE</span>
                  </div>
                  <div className={`text-sm font-black ${s.color}`}>{s.val}</div>
                  <div className="text-[8.5px] text-stone-400 font-bold uppercase">{s.label}</div>
                  <div className="text-[7.5px] text-stone-500 font-medium italic">{s.suffix}</div>
                </div>
              ))}
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => { setActiveTab('listings'); setShowAddForm(true); }}
                className="flex-1 min-h-[40px] bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>{lang === 'en' ? 'Add Property Listing' : 'አዲስ የቤት ማስታወቂያ ፍጠር'}</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex-1 min-h-[40px] border font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850' : 'bg-white border-stone-250 hover:bg-stone-50'
                }`}
              >
                <CreditCard size={14} className="text-[#C5A059]" />
                <span>{lang === 'en' ? 'Request CBE/Telebirr Payout' : 'የገንዘብ ማውጫ ጠይቅ'}</span>
              </button>
            </div>

            {/* Recent Leads Preview */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                {lang === 'en' ? 'Recent Tour Inquiries' : 'የቅርብ ጊዜ የቤት ፈላጊዎች ቀጠሮ'}
              </h3>
              <div className="space-y-1.5">
                {leads.slice(0, 2).map((l) => (
                  <div key={l.id} className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                    isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-white border-stone-200'
                  }`}>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>👤 {l.name}</span>
                        <span className="text-[8px] bg-blue-500/10 text-blue-500 font-mono px-1.5 py-0.5 rounded uppercase">
                          {l.status}
                        </span>
                      </div>
                      <div className="text-[9.5px] text-stone-400 font-medium mt-0.5">Property: {l.property}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold block text-emerald-600 dark:text-emerald-400 font-mono">{l.phone}</span>
                      <span className="text-[8px] text-stone-400 block mt-0.5">{l.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MY PROPERTIES (Listings) */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            
            {/* Add property form toggle */}
            {showAddForm ? (
              <form onSubmit={handleAddProperty} className={`p-4 rounded-2xl border space-y-3.5 ${
                isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-stone-250'
              }`}>
                <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-zinc-850">
                  <h3 className="text-xs font-black uppercase text-blue-500">
                    Add New Property Gated Listing
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-stone-400 uppercase">Property Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Modern Bole Vista Condo"
                      value={newProp.title}
                      onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none bg-transparent dark:border-zinc-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-stone-400 uppercase">Property Type</label>
                    <select 
                      value={newProp.type}
                      onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none bg-transparent dark:border-zinc-800 dark:text-zinc-200"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Condominium">Condominium</option>
                      <option value="Townhouse">Townhouse</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-stone-400 uppercase">Monthly Price (ETB)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 75000"
                      value={newProp.price}
                      onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none bg-transparent dark:border-zinc-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-stone-400 uppercase">Select City Location</label>
                    <select 
                      value={newProp.city}
                      onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                      className="w-full text-xs p-2.5 border rounded-xl outline-none bg-transparent dark:border-zinc-800 dark:text-zinc-200"
                    >
                      <option value="Addis Ababa">Addis Ababa</option>
                      <option value="Hawassa">Hawassa</option>
                      <option value="Bishoftu">Bishoftu</option>
                      <option value="Adama">Adama</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full min-h-[38px] bg-blue-500 hover:bg-blue-600 text-white font-black text-xs py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Confirm & Publish Property Listing
                </button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Active Agency Portfolio</span>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[9.5px] font-black rounded-lg cursor-pointer flex items-center gap-1 uppercase"
                >
                  <Plus size={12} /> Add Property
                </button>
              </div>
            )}

            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {listings.map((l) => (
                <div key={l.id} className={`rounded-2xl border overflow-hidden flex ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'
                }`}>
                  <img 
                    src={l.image} 
                    alt={l.title} 
                    className="w-24 h-24 object-cover shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-2.5 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] uppercase tracking-wider font-mono text-[#C5A059] font-bold">
                          {l.type}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                          l.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-stone-200 text-stone-500'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-black truncate mt-0.5">{l.title}</h4>
                      <div className="text-[9px] text-stone-400 flex items-center gap-1">
                        <span>📍 {l.city}</span>
                        <span>•</span>
                        <span>{l.views} Views</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-stone-100 dark:border-zinc-850">
                      <span className="text-[11.5px] font-black text-[#C5A059]">{l.price.toLocaleString()} ETB / mo</span>
                      <button 
                        onClick={() => handleDeleteProperty(l.id)}
                        className="text-stone-400 hover:text-red-500 p-1 rounded hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                        title="Delete Property"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: BUYER LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-1">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                Platform Tenant & Buyer Leads
              </span>
              <span className="text-[9px] text-blue-500 font-bold uppercase">4 Live Leads Mapped</span>
            </div>

            <div className="space-y-2">
              {leads.map((l) => (
                <div key={l.id} className={`p-3 rounded-2xl border space-y-2 ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200 shadow-xs'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-xs">👤 {l.name}</h4>
                      <span className="text-[9.5px] text-stone-400 font-mono font-medium block">{l.phone}</span>
                    </div>
                    <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase ${
                      l.status === 'Tour Scheduled' ? 'bg-blue-500/10 text-blue-500 animate-pulse' :
                      l.status === 'Inquiry Pending' ? 'bg-amber-500/10 text-amber-500' :
                      l.status === 'Offer Received' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-stone-100 text-stone-500'
                    }`}>
                      {l.status}
                    </span>
                  </div>

                  <div className={`p-2 rounded-xl text-[10.5px] flex items-center justify-between ${
                    isDarkMode ? 'bg-zinc-950 text-zinc-300' : 'bg-stone-50 text-stone-600'
                  }`}>
                    <span>🏢 Property: <strong>{l.property}</strong></span>
                    <span className="text-[8.5px] font-mono opacity-70">{l.date}</span>
                  </div>

                  {/* Actions bar */}
                  <div className="flex justify-end gap-2 pt-1 border-t border-stone-100 dark:border-zinc-850">
                    <button className="px-2.5 py-1 text-[9.5px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg cursor-pointer flex items-center gap-1 hover:bg-emerald-500/15">
                      <MessageSquare size={10} />
                      <span>Contact Tenant</span>
                    </button>
                    <button className="px-2.5 py-1 text-[9.5px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer flex items-center gap-1 hover:bg-blue-500/15">
                      <Calendar size={10} />
                      <span>Reschedule Tour</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SOVEREIGN WALLET (Ledger, Instant Withdrawal) */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            
            {/* Balance HUD */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-250 shadow-xs'
              }`}>
                <div className="text-[8.5px] font-mono text-stone-400 uppercase">Available Agency Balance</div>
                <div className="text-lg font-black text-blue-500 font-mono mt-1">{balance.toLocaleString()} ETB</div>
                <span className="text-[8.5px] text-stone-400 italic">CBE Registered Account linked</span>
              </div>

              <div className={`p-3.5 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-250 shadow-xs'
              }`}>
                <div className="text-[8.5px] font-mono text-stone-400 uppercase">Gated Escrow Balance</div>
                <div className="text-lg font-black text-emerald-500 font-mono mt-1">{escrowBalance.toLocaleString()} ETB</div>
                <span className="text-[8.5px] text-stone-400 italic">Sovereign custody active</span>
              </div>
            </div>

            {/* Withdrawal form */}
            <div className={`p-4 rounded-2xl border space-y-3.5 ${
              isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-[#FAF9F5] border-stone-200'
            }`}>
              <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Landmark size={12} />
                <span>Request Sovereign Payout Withdrawal</span>
              </div>

              {withdrawStep === 'processing' && (
                <div className="p-4 rounded-xl text-center space-y-2">
                  <RefreshCw size={22} className="animate-spin text-amber-500 mx-auto" />
                  <p className="text-xs font-bold animate-pulse">Broadcasting payout transaction to CBE bank API...</p>
                </div>
              )}

              {withdrawStep === 'success' && (
                <div className="p-4 rounded-xl text-center space-y-2 text-emerald-600 bg-emerald-500/5 border border-emerald-500/20">
                  <CheckCircle2 size={24} className="mx-auto" />
                  <p className="text-xs font-black">Withdrawal request authorized! Payout arriving in 15 minutes.</p>
                </div>
              )}

              {withdrawStep === 'idle' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-400 uppercase">Bank/Wallet Channel</label>
                      <select 
                        value={withdrawBank} 
                        onChange={(e) => setWithdrawBank(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none bg-transparent dark:border-zinc-800 dark:text-zinc-200"
                      >
                        <option value="CBE">Commercial Bank of Ethiopia (CBE)</option>
                        <option value="TELEBIRR">Ethio Telecom Telebirr</option>
                        <option value="CHAPA">Chapa Secure Node</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-400 uppercase">Payout Account Number / Phone</label>
                      <input 
                        type="text" 
                        required
                        value={withdrawAccount}
                        onChange={(e) => setWithdrawAccount(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none bg-transparent dark:border-zinc-800"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-stone-400 uppercase">Withdrawal Amount (ETB)</label>
                      <input 
                        type="number" 
                        required
                        max={balance}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none bg-transparent dark:border-zinc-800"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleWithdrawal}
                    className="w-full min-h-[40px] bg-[#1E3A1A] hover:bg-[#122410] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-black text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck size={14} />
                    <span>Authorize Secure Withdrawal</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: ANALYTICS (Charts) */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            
            <div className="flex justify-between items-center pb-1">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                Leads & Visitor Performance Statistics
              </span>
              <span className="text-[8.5px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded">
                Weekly Insights
              </span>
            </div>

            {/* Area Chart of Leads Traffic */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'} space-y-1`}>
              <h4 className="text-[10px] font-black uppercase text-stone-400 mb-2">Visits vs Tour Requests Trend</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={leadTrendData}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" fontSize={9} tickLine={false} />
                    <YAxis fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '10px', background: isDarkMode ? '#18181b' : '#ffffff' }} />
                    <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                    <Area type="monotone" dataKey="inquiries" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInquiries)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
