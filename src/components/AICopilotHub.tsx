import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, MessageSquare, Send, Search, TrendingUp, Home, Briefcase, 
  User, CheckCircle2, AlertCircle, Bell, ShieldAlert, Sliders, MapPin, 
  DollarSign, GraduationCap, Award, Languages, Clock, ShoppingBag, 
  ArrowRight, ShieldCheck, Heart, Share2, BarChart2, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface AICopilotHubProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  walletBalance: number;
  onFilterListings: (category: 'shop' | 'houses' | 'agencies', filterName: string, query: string) => void;
  onNavigateTab: (tab: 'shop' | 'houses' | 'agencies' | 'equbLottery' | 'settings') => void;
}

export function AICopilotHub({ isDarkMode, lang, walletBalance, onFilterListings, onNavigateTab }: AICopilotHubProps) {
  // Navigation tabs within AI Hub
  const [activeTab, setActiveTab] = useState<'feed' | 'search' | 'houses' | 'jobs' | 'vendors' | 'fraud' | 'dashboard'>('feed');

  // Shared Data State
  const [products, setProducts] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selected item modal (for Similar items explorer)
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [similarData, setSimilarData] = useState<any | null>(null);

  // 1. Personalized Feed Settings
  const [userId, setUserId] = useState<string>('u-2');
  const [userLocation, setUserLocation] = useState<string>('Bole, Addis Ababa');
  const [userBudget, setUserBudget] = useState<number>(4000000);
  const [userLanguage, setUserLanguage] = useState<'en' | 'am'>('en');
  const [searchHistory, setSearchHistory] = useState<string[]>(['iphone', '3 bedroom', 'chef jobs']);
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(['Retail Item', 'Real Estate House']);
  const [personalizedFeed, setPersonalizedFeed] = useState<any>(null);

  // 2. Smart Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchGps, setSearchGps] = useState<boolean>(true);

  // 3. House Budget State
  const [houseBudgetInput, setHouseBudgetInput] = useState<number>(4000000);
  const [houseResults, setHouseResults] = useState<any[]>([]);
  const [houseLimits, setHouseLimits] = useState<{ min: number; max: number }>({ min: 3800000, max: 4200000 });

  // 4. Overseas Job State
  const [jobEducation, setJobEducation] = useState<string>('Hospitality Certificate');
  const [jobExperience, setJobExperience] = useState<string>('3 Years');
  const [jobLanguages, setJobLanguages] = useState<string[]>(['English']);
  const [jobCountry, setJobCountry] = useState<string>('United Arab Emirates');
  const [jobSalary, setJobSalary] = useState<number>(100000);
  const [jobResults, setJobResults] = useState<any[]>([]);

  // 5. Vendor Recommendations State
  const [recommendedVendors, setRecommendedVendors] = useState<any[]>([]);

  // 6. Fraud Detection audit state
  const [fraudType, setFraudType] = useState<'listing' | 'review' | 'account'>('listing');
  const [fraudContent, setFraudContent] = useState<string>('Get rich quick! Click here to win a gursha bonus lottery of 50,000 ETB instantly!! duplicate post duplication.');
  const [fraudPrice, setFraudPrice] = useState<number>(0);
  const [fraudResult, setFraudResult] = useState<any | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // 7. Smart Notifications List
  const [smartNotifications, setSmartNotifications] = useState<any[]>([]);

  // 8. Admin AI Dashboard State
  const [adminMetrics, setAdminMetrics] = useState<any | null>(null);

  // Fetch initial base data & pre-populate
  useEffect(() => {
    fetchBaseData();
  }, [userId]);

  const fetchBaseData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch personalization feed
      const feedRes = await fetch(`/ai/recommendations?userId=${userId}`);
      if (feedRes.ok) {
        const feedData = await feedRes.json();
        setPersonalizedFeed(feedData.data);
        setUserLocation(feedData.data.userContext.location);
        setUserBudget(feedData.data.userContext.budget);
      }

      // 2. Fetch trending engine results
      const trendRes = await fetch(`/ai/trending`);
      if (trendRes.ok) {
        const trendData = await trendRes.json();
        setProducts(trendData.data.products);
        setProperties(trendData.data.properties);
        setJobs(trendData.data.jobs);
        setVendors(trendData.data.vendors);
      }

      // 3. Fetch smart notifications
      const notifRes = await fetch(`/ai/notifications?userId=${userId}`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setSmartNotifications(notifData.data);
      }

      // 4. Fetch vendors recommendation
      const vendorRecRes = await fetch(`/ai/vendors`);
      if (vendorRecRes.ok) {
        const vendorRecData = await vendorRecRes.json();
        setRecommendedVendors(vendorRecData.data);
      }

      // 5. Fetch admin dashboard
      const dashRes = await fetch(`/ai/dashboard`);
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setAdminMetrics(dashData.data);
      }

      // Run default house & job recs
      runHouseRecommendation(houseBudgetInput);
      runJobRecommendation();

    } catch (error) {
      console.error("Error loading AI Engine data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run House Recommendations
  const runHouseRecommendation = async (budget: number) => {
    try {
      const res = await fetch(`/ai/houses?budget=${budget}`);
      if (res.ok) {
        const payload = await res.json();
        setHouseResults(payload.data.properties);
        setHouseLimits({ min: payload.data.minBound, max: payload.data.maxBound });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run Job Recommendations
  const runJobRecommendation = async () => {
    try {
      const queryParams = new URLSearchParams({
        education: jobEducation,
        experience: jobExperience,
        languages: jobLanguages.join(','),
        preferredCountry: jobCountry,
        expectedSalary: jobSalary.toString()
      });
      const res = await fetch(`/ai/jobs?${queryParams}`);
      if (res.ok) {
        const payload = await res.json();
        setJobResults(payload.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Smart Search live autocomplete suggestions
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchSuggestions([]);
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const lat = searchGps ? 9.0192 : undefined; // Addis Ababa central lat
        const lon = searchGps ? 38.7525 : undefined;
        const queryParams = new URLSearchParams({
          query: searchQuery,
          ...(lat && { latitude: lat.toString() }),
          ...(lon && { longitude: lon.toString() })
        });
        const res = await fetch(`/ai/search?${queryParams}`);
        if (res.ok) {
          const payload = await res.json();
          setSearchSuggestions(payload.data.suggestions || []);
          setSearchResults(payload.data.results || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, searchGps]);

  // Open item detail with its five corresponding similar recommendations lines
  const handleOpenItem = async (item: any) => {
    try {
      setSelectedItem(item);
      const res = await fetch(`/ai/similar/${item.id}`);
      if (res.ok) {
        const payload = await res.json();
        setSimilarData(payload.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle active search autocomplete selection
  const handleSelectSuggestion = (suggest: string) => {
    setSearchQuery(suggest);
    setSearchSuggestions([]);
  };

  // Trigger manual Fraud Detection Audit
  const handleAuditFraud = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch(`/ai/fraud-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: fraudType,
          targetId: `manual-audit-${Date.now()}`,
          content: fraudContent,
          price: fraudPrice
        })
      });
      if (res.ok) {
        const payload = await res.json();
        setFraudResult(payload.data);
        
        // Refresh admin metrics count to show predictions update
        const dashRes = await fetch(`/ai/dashboard`);
        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setAdminMetrics(dashData.data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  // Formatter for large currency values
  const formatEtb = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ETB`;
    }
    return `${value.toLocaleString()} ETB`;
  };

  // Chart Data preparation
  const salesForecastData = [
    { name: 'Jul 2', Current: 400000, Projected: 450000 },
    { name: 'Jul 3', Current: 520000, Projected: 580000 },
    { name: 'Jul 4', Current: 610000, Projected: 700000 },
    { name: 'Jul 5', Current: 750000, Projected: 890000 },
    { name: 'Jul 6', Current: 900000, Projected: 1100000 },
    { name: 'Jul 7', Current: 1200000, Projected: 1400000 },
    { name: 'Jul 8', Current: 1350000, Projected: 1550000 },
  ];

  const categoryPopularityData = [
    { name: 'Retail Items', views: 2400, orders: 1200 },
    { name: 'Bole Houses', views: 4200, orders: 350 },
    { name: 'Overseas Jobs', views: 5300, orders: 890 },
    { name: 'Trusted Shops', views: 1800, orders: 950 },
  ];

  return (
    <div id="ai_engine_root" className={`min-h-screen ${isDarkMode ? 'bg-[#121212] text-zinc-100' : 'bg-[#FAFAF9] text-zinc-800'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Top Banner Header */}
      <header className={`p-5 border-b ${isDarkMode ? 'border-zinc-800 bg-[#161616]' : 'border-stone-200 bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-emerald-600/10 rounded text-emerald-500 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Every-zone AI Suite
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded border border-amber-500/20">Active VM Engine</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight font-sans">Every-zone Recommendation & Search Ranking Engine</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
              State-of-the-art multi-dimensional AI scorer, strict property price matching, job qualification mapping, smart autocompletes, real-time metrics trending calculators, and active LLM fraud detection networks.
            </p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={fetchBaseData}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-800 text-xs font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-Sync Datasets
            </button>
            <div className={`px-4 py-1.5 rounded-xl border ${isDarkMode ? 'border-zinc-800 bg-[#1e1e1e]' : 'border-stone-200 bg-stone-50'} text-right`}>
              <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Secure Wallet Balance</div>
              <div className="text-xs font-mono font-bold text-emerald-600">{walletBalance.toLocaleString()} ETB</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-5">
          <div className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm`}>
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest mb-3">AI Sub-Systems</h3>
            <nav className="flex flex-col gap-1.5">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'feed' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-stone-100 dark:hover:bg-zinc-800'}`}
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Personalized Feed
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'feed' ? 'bg-emerald-700' : 'bg-stone-200 dark:bg-zinc-700'}`}>9 Metrics</span>
              </button>

              <button 
                onClick={() => setActiveTab('search')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'search' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-stone-100 dark:hover:bg-zinc-800'}`}
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" /> Smart Suggest & Search
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'search' ? 'bg-emerald-700' : 'bg-stone-200 dark:bg-zinc-700'}`}>Ranking</span>
              </button>

              <button 
                onClick={() => setActiveTab('houses')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'houses' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-stone-100 dark:hover:bg-zinc-800'}`}
              >
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4" /> Strict House Matcher
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'houses' ? 'bg-emerald-700' : 'bg-stone-200 dark:bg-zinc-700'}`}>±5% ETB</span>
              </button>

              <button 
                onClick={() => setActiveTab('jobs')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'jobs' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-stone-100 dark:hover:bg-zinc-800'}`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Job Credentials Filter
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'jobs' ? 'bg-emerald-700' : 'bg-stone-200 dark:bg-zinc-700'}`}>5 Factors</span>
              </button>

              <button 
                onClick={() => setActiveTab('vendors')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'vendors' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-stone-100 dark:hover:bg-zinc-800'}`}
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Reputable Vendors
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'vendors' ? 'bg-emerald-700' : 'bg-stone-200 dark:bg-zinc-700'}`}>Rating</span>
              </button>

              <button 
                onClick={() => setActiveTab('fraud')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'fraud' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-stone-100 dark:hover:bg-zinc-800'}`}
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> LLM Fraud & Spam Audit
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'fraud' ? 'bg-emerald-700' : 'bg-stone-200 dark:bg-zinc-700'}`}>Audit</span>
              </button>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-stone-100 dark:hover:bg-zinc-800'}`}
              >
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" /> Admin AI Dashboard
                </span>
                <span className="text-[8px] bg-red-500 text-white px-1 py-0.5 rounded font-black uppercase">Stats</span>
              </button>
            </nav>
          </div>

          {/* Smart Notifications Sidebar Widget */}
          <div className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-3`}>
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-xs font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> Smart Notifications
              </h4>
              <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">Tailored</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {smartNotifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => {
                    setActiveTab(n.actionTab);
                  }}
                  className={`p-2.5 rounded-xl border text-[11px] cursor-pointer hover:scale-[1.02] transition-all ${isDarkMode ? 'bg-[#202020] border-zinc-800 hover:border-zinc-700' : 'bg-stone-50 border-stone-150 hover:border-stone-300'}`}
                >
                  <div className="font-extrabold text-xs mb-0.5 flex items-center justify-between">
                    <span>{n.title}</span>
                    <span className="text-[8px] text-zinc-400 font-mono font-normal">{n.time}</span>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[10.5px] mb-1">{n.message}</p>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-0.5 hover:underline">
                    {n.actionLabel} <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Center Panel Content */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="h-[400px] flex flex-col justify-center items-center gap-3">
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-xs font-bold text-zinc-400 font-mono">Calculating Every-zone AI scoring weights...</p>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                
                {/* 1. PERSONALIZED FEED TAB */}
                {activeTab === 'feed' && personalizedFeed && (
                  <div className="space-y-6">
                    {/* Settings Config Card (The Left-side customizable context) */}
                    <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-4`}>
                      <div className="flex items-center gap-2 border-b pb-3">
                        <Sliders className="w-4 h-4 text-emerald-500" />
                        <div>
                          <h2 className="text-sm font-black tracking-tight">Personalized Profile Settings</h2>
                          <p className="text-[10px] text-zinc-500">Fine-tune the 9 real-time AI context parameters used to organize your Every-zone home feed.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Column 1: User & Language */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Simulated Session Persona</label>
                            <select 
                              value={userId} 
                              onChange={(e) => setUserId(e.target.value)}
                              className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-xl"
                            >
                              <option value="u-2">Selamawit Tekle (Buyer / Budget: 4M ETB)</option>
                              <option value="u-1">Ambek Everyzone (Vendor / Budget: 1.5M ETB)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Preferred Language</label>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setUserLanguage('en')}
                                className={`flex-1 py-1 px-3 border rounded-lg text-[10px] font-bold ${userLanguage === 'en' ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500' : ''}`}
                              >
                                English
                              </button>
                              <button 
                                onClick={() => setUserLanguage('am')}
                                className={`flex-1 py-1 px-3 border rounded-lg text-[10px] font-bold ${userLanguage === 'am' ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500' : ''}`}
                              >
                                አማርኛ (Amharic)
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Location & Budget */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Primary Location Context</label>
                            <input 
                              type="text"
                              value={userLocation}
                              onChange={(e) => setUserLocation(e.target.value)}
                              className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-xl"
                              placeholder="e.g. Bole, CMC, Saris"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Primary Target Budget (ETB)</label>
                            <input 
                              type="number"
                              value={userBudget}
                              onChange={(e) => setUserBudget(Number(e.target.value))}
                              className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-xl font-mono"
                            />
                          </div>
                        </div>

                        {/* Column 3: Category Preferences & Search Terms */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Simulated Search History</label>
                            <div className="flex flex-wrap gap-1">
                              {searchHistory.map((s, idx) => (
                                <span key={idx} className="bg-stone-100 dark:bg-zinc-800 text-[10px] px-2 py-0.5 rounded border border-stone-200 dark:border-zinc-750 font-bold font-mono">
                                  {s}
                                </span>
                              ))}
                              <button 
                                onClick={() => {
                                  const item = prompt('Add Search History term:');
                                  if (item) setSearchHistory([...searchHistory, item]);
                                }}
                                className="text-[9px] text-emerald-600 hover:underline px-1"
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Favorite Categories</label>
                            <div className="flex flex-wrap gap-1">
                              {favoriteCategories.map((c, idx) => (
                                <span key={idx} className="bg-stone-100 dark:bg-zinc-800 text-[10px] px-2 py-0.5 rounded border border-stone-200 dark:border-zinc-750 font-bold">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-3.5 flex justify-between items-center text-[10.5px]">
                        <span className="text-zinc-500 italic">Every change triggers full feed re-ranking instantly.</span>
                        <button 
                          onClick={fetchBaseData}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Recalculate AI Feed
                        </button>
                      </div>
                    </div>

                    {/* Personalization Outputs Feed */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5">
                          ✨ Your Tailored Feed Showcase
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-400">Score Range: 0 - 100</span>
                      </div>

                      {/* Products */}
                      <div>
                        <h4 className="text-xs font-black uppercase text-emerald-600 tracking-wider mb-3">🛍️ Recommended For You: Premium Marketplace</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {personalizedFeed.products?.map((p: any) => (
                            <div 
                              key={p.id} 
                              onClick={() => handleOpenItem(p)}
                              className={`rounded-2xl p-3.5 border cursor-pointer hover:shadow-md transition-all flex flex-col justify-between ${isDarkMode ? 'bg-[#161616] border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-2">
                                  <span className="text-[8.5px] bg-emerald-600/10 text-emerald-500 font-black px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                                    AI SCORE: {p.aiRelevancyScore}%
                                  </span>
                                  {p.featured && (
                                    <span className="text-[8.5px] bg-amber-500/10 text-amber-500 font-bold px-1.5 py-0.5 rounded uppercase">Featured</span>
                                  )}
                                </div>
                                <h5 className="font-extrabold text-xs tracking-tight line-clamp-1 mb-1">{p.title}</h5>
                                <p className="text-[10.5px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">{p.description}</p>
                              </div>
                              <div className="border-t pt-2 flex justify-between items-center">
                                <span className="text-xs font-black font-mono text-emerald-600">{(p.price || 0).toLocaleString()} ETB</span>
                                <span className="text-[9px] text-zinc-400 font-mono">Bole Store</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Properties */}
                      <div>
                        <h4 className="text-xs font-black uppercase text-emerald-600 tracking-wider mb-3">🏡 Match Finder: Curated Properties</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {personalizedFeed.properties?.map((h: any) => (
                            <div 
                              key={h.id} 
                              onClick={() => handleOpenItem(h)}
                              className={`rounded-2xl p-4 border cursor-pointer hover:shadow-md transition-all flex flex-col justify-between ${isDarkMode ? 'bg-[#161616] border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-2.5">
                                  <span className="text-[8.5px] bg-emerald-600/10 text-emerald-500 font-black px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                                    AI RELEVANCY: {h.aiRelevancyScore}%
                                  </span>
                                  <span className="text-[8.5px] bg-stone-100 dark:bg-zinc-800 font-bold px-1.5 py-0.5 rounded">{h.propertyType}</span>
                                </div>
                                <h5 className="font-black text-xs tracking-tight mb-1">{h.title}</h5>
                                <p className="text-[10.5px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">{h.description}</p>
                              </div>
                              <div className="border-t pt-2.5 flex justify-between items-center text-[11px] font-mono">
                                <span className="font-extrabold text-emerald-600">{formatEtb(h.price || 0)}</span>
                                <span className="text-zinc-400 flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {h.subCity || 'Addis'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Jobs */}
                      <div>
                        <h4 className="text-xs font-black uppercase text-emerald-600 tracking-wider mb-3">💼 Pathway Finder: Matched Overseas Vacancies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {personalizedFeed.jobs?.map((j: any) => (
                            <div 
                              key={j.id} 
                              onClick={() => handleOpenItem(j)}
                              className={`rounded-2xl p-4 border cursor-pointer hover:shadow-md transition-all flex flex-col justify-between ${isDarkMode ? 'bg-[#161616] border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-2.5">
                                  <span className="text-[8.5px] bg-emerald-600/10 text-emerald-500 font-black px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                                    AI FIT: {j.aiRelevancyScore}%
                                  </span>
                                  <span className="text-[10px]">{j.countryFlag} Poland</span>
                                </div>
                                <h5 className="font-black text-xs tracking-tight mb-1 line-clamp-1">{j.title}</h5>
                                <p className="text-[10.5px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">{j.description}</p>
                              </div>
                              <div className="border-t pt-2.5 flex justify-between items-center text-[10.5px] font-mono">
                                <span className="font-extrabold text-emerald-600">{j.salary}</span>
                                <span className="text-zinc-400 font-semibold">{j.category}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 2. SMART SEARCH PLAYGROUND TAB */}
                {activeTab === 'search' && (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-4`}>
                      <div className="flex justify-between items-center border-b pb-3">
                        <div>
                          <h2 className="text-sm font-black tracking-tight">AI Multi-Dimensional Search Playground</h2>
                          <p className="text-[10px] text-zinc-500">Search items in Bole. Results are scored & re-ranked based on trust index, verification status, distance, freshness and popularity.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-zinc-400 font-mono font-bold flex items-center gap-1">
                            <input 
                              type="checkbox" 
                              checked={searchGps}
                              onChange={(e) => setSearchGps(e.target.checked)}
                              className="accent-emerald-600"
                            /> Simulate GPS Geolocation
                          </label>
                        </div>
                      </div>

                      {/* Interactive Autocomplete Input */}
                      <div className="relative">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                            <input 
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder='Type "iphone", "house" or "job" to trigger AI smart expansion and re-ranking...'
                              className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-xl text-xs"
                            />
                            {isSearching && (
                              <RefreshCw className="absolute right-3 top-2.5 w-4 h-4 text-emerald-500 animate-spin" />
                            )}
                          </div>
                          <button 
                            onClick={() => setSearchQuery('iphone')}
                            className="px-4 py-2 bg-stone-100 dark:bg-zinc-800 border hover:bg-stone-150 text-xs font-bold rounded-xl"
                          >
                            Demo "iphone"
                          </button>
                        </div>

                        {/* Autocomplete dropdown */}
                        <AnimatePresence>
                          {searchSuggestions.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className={`absolute left-0 right-0 mt-1.5 rounded-xl border p-2 shadow-lg z-50 ${isDarkMode ? 'bg-[#202020] border-zinc-700 text-zinc-100' : 'bg-white border-stone-200 text-zinc-800'}`}
                            >
                              <div className="text-[8.5px] uppercase tracking-widest text-zinc-400 font-bold px-2 py-1 border-b mb-1">AI Smart Suggest Paths</div>
                              {searchSuggestions.map((suggest, idx) => (
                                <button 
                                  key={idx}
                                  onClick={() => handleSelectSuggestion(suggest)}
                                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-stone-50 dark:hover:bg-zinc-800 flex items-center justify-between"
                                >
                                  <span>{suggest}</span>
                                  <span className="text-[9px] text-emerald-500 font-mono uppercase font-black">AI Route →</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Ranked Search Results */}
                      <div className="space-y-3.5">
                        <div className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">AI Re-ranked Results</div>
                        {searchResults.length > 0 ? (
                          <div className="space-y-2.5">
                            {searchResults.map((item) => {
                              const isVerified = item.isAgencyVerified || item.isVendorVerified || item.verified || false;
                              return (
                                <div 
                                  key={item.id}
                                  onClick={() => handleOpenItem(item)}
                                  className={`p-3.5 rounded-2xl border cursor-pointer hover:shadow-sm transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${isDarkMode ? 'bg-[#1c1c1c] border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                                >
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <span className="text-[8.5px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded font-mono uppercase">
                                        Score: {item.aiSearchScore}
                                      </span>
                                      <span className="text-[9px] font-mono text-zinc-400">{item.categoryName}</span>
                                      {isVerified && (
                                        <span className="text-[8.5px] bg-blue-600/10 text-blue-500 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase">
                                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified Vendor
                                        </span>
                                      )}
                                      <span className="text-[9px] text-zinc-400 font-bold">⭐ {item.rating || '4.5'}</span>
                                      <span className="text-[9px] text-zinc-400 font-mono">Trust: {item.trustScore || (isVerified ? 90 : 60)}/100</span>
                                    </div>
                                    <h4 className="font-extrabold text-xs tracking-tight">{item.title || item.name}</h4>
                                    <p className="text-[10.5px] text-zinc-400 line-clamp-1 leading-relaxed">{item.description}</p>
                                  </div>
                                  <div className="text-right flex flex-col items-end gap-1">
                                    <span className="text-xs font-black font-mono text-emerald-600">
                                      {item.price ? formatEtb(item.price) : item.salary || 'Varies'}
                                    </span>
                                    <span className="text-[9px] text-zinc-400 flex items-center gap-0.5 font-mono">
                                      <MapPin className="w-2.5 h-2.5" /> {item.subCity || item.city || 'Overseas'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-32 flex justify-center items-center text-zinc-400 italic text-xs">
                            Start typing (e.g., "iph", "house", "chef") to load ranked search outputs...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HOUSE BUDGET MATCHING ±5% TAB */}
                {activeTab === 'houses' && (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-4`}>
                      <div className="flex items-center gap-2 border-b pb-3 justify-between">
                        <div>
                          <h2 className="text-sm font-black tracking-tight">AI Strict Real Estate Budget Matcher</h2>
                          <p className="text-[10px] text-zinc-500">Business Rule: Displays properties only within +/- 5% range of your exact budget target.</p>
                        </div>
                        <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded uppercase">Strict ±5% Bounds</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Target Budget Slider</label>
                          <input 
                            type="range"
                            min="1000000"
                            max="10000000"
                            step="100000"
                            value={houseBudgetInput}
                            onChange={(e) => {
                              const budget = Number(e.target.value);
                              setHouseBudgetInput(budget);
                              runHouseRecommendation(budget);
                            }}
                            className="w-full accent-emerald-600"
                          />
                        </div>
                        <div className="text-center md:text-left">
                          <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Budget Target</label>
                          <div className="text-sm font-extrabold font-mono text-emerald-600">{formatEtb(houseBudgetInput)}</div>
                        </div>
                        <div className="p-3 bg-stone-50 dark:bg-zinc-850 border border-stone-200 dark:border-zinc-750 rounded-xl">
                          <div className="text-[8.5px] uppercase tracking-wider text-zinc-400 font-bold mb-0.5">Strict AI Filter Scope (±5%)</div>
                          <div className="text-[10.5px] font-mono font-bold">
                            Min: <span className="text-amber-600">{formatEtb(houseLimits.min)}</span> <br/>
                            Max: <span className="text-emerald-600">{formatEtb(houseLimits.max)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        <div className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Filtered Houses In Range</div>
                        {houseResults.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {houseResults.map((h) => (
                              <div 
                                key={h.id}
                                onClick={() => handleOpenItem(h)}
                                className={`p-4 rounded-2xl border cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between ${isDarkMode ? 'bg-[#1c1c1c] border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                              >
                                <div>
                                  <div className="flex justify-between items-start gap-2 mb-2">
                                    <span className="text-[8.5px] bg-emerald-600/10 text-emerald-500 font-black px-1.5 py-0.5 rounded font-mono uppercase">
                                      Within ±5% range
                                    </span>
                                    <span className="text-[9px] text-zinc-400 font-bold">⭐ {h.rating || '4.8'}</span>
                                  </div>
                                  <h4 className="font-extrabold text-xs tracking-tight line-clamp-1 mb-1">{h.title}</h4>
                                  <p className="text-[10.5px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">{h.description}</p>
                                </div>
                                <div className="border-t pt-2.5 flex justify-between items-center text-[10.5px] font-mono">
                                  <span className="font-extrabold text-emerald-600">{formatEtb(h.price || 0)}</span>
                                  <span className="text-zinc-400 flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {h.subCity || 'Bole'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-32 flex justify-center items-center text-zinc-400 italic text-xs border border-dashed rounded-2xl">
                            No listings match within {formatEtb(houseLimits.min)} - {formatEtb(houseLimits.max)}. Try adjusting budget!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. OVERSEAS JOB RECOMMENDATIONS TAB */}
                {activeTab === 'jobs' && (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-4`}>
                      <div className="flex items-center gap-2 border-b pb-3 justify-between">
                        <div>
                          <h2 className="text-sm font-black tracking-tight">AI Overseas Job Vacancy Matcher</h2>
                          <p className="text-[10px] text-zinc-500">Business Rule: Scoring and matching vacancies against 5 criteria: Education, Experience, languages, Preferred Country, and Expected Salary.</p>
                        </div>
                        <span className="text-[9px] bg-emerald-600/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">5-factor Matcher</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Education level</label>
                          <select 
                            value={jobEducation}
                            onChange={(e) => setJobEducation(e.target.value)}
                            className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-lg"
                          >
                            <option value="Hospitality Certificate">Hospitality Cert (ሼፍ)</option>
                            <option value="High School">High School diploma</option>
                            <option value="Construction Degree">Construction degree</option>
                            <option value="Associate Degree">Associate Degree</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Experience Years</label>
                          <select 
                            value={jobExperience}
                            onChange={(e) => setJobExperience(e.target.value)}
                            className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-lg"
                          >
                            <option value="1 Year">1 Year</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3+ Years</option>
                            <option value="5 Years">5+ Years</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Preferred Country</label>
                          <select 
                            value={jobCountry}
                            onChange={(e) => setJobCountry(e.target.value)}
                            className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-lg"
                          >
                            <option value="United Arab Emirates">United Arab Emirates 🇦🇪</option>
                            <option value="Poland">Poland 🇵🇱</option>
                            <option value="Saudi Arabia">Saudi Arabia 🇸🇦</option>
                            <option value="Germany">Germany 🇩🇪</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Expected Monthly (ETB)</label>
                          <input 
                            type="number"
                            value={jobSalary}
                            onChange={(e) => setJobSalary(Number(e.target.value))}
                            className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-lg font-mono"
                          />
                        </div>

                        <div className="flex items-end">
                          <button 
                            onClick={runJobRecommendation}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold font-sans"
                          >
                            ⚡ Filter Match Scores
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Matching Jobs</div>
                        {jobResults.length > 0 ? (
                          <div className="space-y-2.5">
                            {jobResults.map((j) => (
                              <div 
                                key={j.id}
                                onClick={() => handleOpenItem(j)}
                                className={`p-3.5 rounded-2xl border cursor-pointer hover:shadow-sm transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${isDarkMode ? 'bg-[#1c1c1c] border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[8.5px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded font-mono uppercase">
                                      AI MATCH: {j.aiMatchingScore}%
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-0.5">
                                      {j.countryFlag} {j.country} • {j.city}
                                    </span>
                                  </div>
                                  <h4 className="font-extrabold text-xs tracking-tight">{j.title}</h4>
                                  <p className="text-[10.5px] text-zinc-400 line-clamp-1 leading-relaxed">{j.description}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                  <span className="text-xs font-black font-mono text-emerald-600">{j.salary}</span>
                                  <span className="text-[8px] bg-stone-100 dark:bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border uppercase tracking-wider font-mono font-bold">
                                    {j.category}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-32 flex justify-center items-center text-zinc-400 italic text-xs">
                            No vacancy matches found. Try widening your filters.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. VENDOR RECOMMENDATIONS TAB */}
                {activeTab === 'vendors' && (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-4`}>
                      <div>
                        <h2 className="text-sm font-black tracking-tight">AI Recommended High-Reputation Vendors</h2>
                        <p className="text-[10px] text-zinc-500">Curates best peer-to-peer vendors based on: Top Ratings, Fast Delivery tags, Verified Seller badges, Proximity distance, and Recent Activity.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {recommendedVendors.map((v) => (
                          <div 
                            key={v.id}
                            className={`p-4 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-all ${isDarkMode ? 'bg-[#1c1c1c] border-zinc-800' : 'bg-white border-stone-200'}`}
                          >
                            <div>
                              <div className="flex justify-between items-start mb-2.5">
                                <span className="text-[8.5px] bg-blue-600/10 text-blue-500 font-bold px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-wide">
                                  {v.deliverySpeed}
                                </span>
                                {v.isVerified && (
                                  <span className="text-[8.5px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase">
                                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-xs tracking-tight mb-1">{v.shopName}</h4>
                              <p className="text-[10px] text-zinc-400 mb-3">Professional seller specializing in {v.category.toLowerCase()} markets.</p>
                            </div>
                            <div className="border-t pt-2.5 flex justify-between items-center text-[10.5px] font-mono">
                              <span className="font-bold text-amber-500">⭐ {v.rating} Rating</span>
                              <span className="text-zinc-400 font-semibold">{v.distance} km away</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. FRAUD & AUDITING TAB */}
                {activeTab === 'fraud' && (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-4`}>
                      <div className="flex items-center gap-2 border-b pb-3 justify-between">
                        <div>
                          <h2 className="text-sm font-black tracking-tight">AI Fraud Detection & Spam Auditor</h2>
                          <p className="text-[10px] text-zinc-500">Check for duplicate listings, spam, fake reviews, price manipulations, bot accounts, or suspicious logins.</p>
                        </div>
                        <span className="text-[9px] bg-red-500/10 text-red-500 font-bold px-1.5 py-0.5 rounded border border-red-500/20 uppercase">Admin Moderation API</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Check Target Type</label>
                          <select 
                            value={fraudType}
                            onChange={(e: any) => setFraudType(e.target.value)}
                            className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-lg font-bold"
                          >
                            <option value="listing">Marketplace Listing Post</option>
                            <option value="review">User Review / Feedback</option>
                            <option value="account">User Account Activity</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Price Metadata (if listing)</label>
                          <input 
                            type="number"
                            value={fraudPrice}
                            onChange={(e) => setFraudPrice(Number(e.target.value))}
                            className="w-full text-xs p-2 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-lg font-mono"
                          />
                        </div>
                        <div className="flex items-end">
                          <button 
                            onClick={handleAuditFraud}
                            disabled={isAuditing}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg text-xs font-bold"
                          >
                            {isAuditing ? 'Auditing Content...' : '🔬 Audit Listing Content'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase text-zinc-400 tracking-wider block mb-1">Content body to audit</label>
                        <textarea 
                          rows={3}
                          value={fraudContent}
                          onChange={(e) => setFraudContent(e.target.value)}
                          className="w-full p-3 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-750 rounded-xl leading-relaxed"
                          placeholder="Paste a review, description or bot login log to test safety compliance..."
                        />
                      </div>

                      {/* Display Audit results */}
                      {fraudResult && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`p-5 rounded-2xl border ${fraudResult.flagged ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'} space-y-3`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              {fraudResult.flagged ? (
                                <span className="p-1 bg-red-600 text-white rounded font-mono text-[8.5px] font-black uppercase">HIGH RISK</span>
                              ) : (
                                <span className="p-1 bg-emerald-600 text-white rounded font-mono text-[8.5px] font-black uppercase">CLEAN</span>
                              )}
                              <span className="font-extrabold text-xs">AI Evaluation Report</span>
                            </div>
                            <span className={`text-xs font-black font-mono ${fraudResult.flagged ? 'text-red-500' : 'text-emerald-500'}`}>
                              Risk Meter: {fraudResult.riskScore}/100
                            </span>
                          </div>

                          <p className="text-[11px] leading-relaxed italic text-zinc-500 dark:text-zinc-400">
                            🔍 <strong>Reason:</strong> {fraudResult.reason}
                          </p>

                          {fraudResult.flagged && (
                            <div className="p-2.5 bg-red-500/10 rounded-xl text-[10px] text-red-500 border border-red-500/20 flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
                              <span>Listing redirected to **Admin Review Queue** inside the Integrity Console. Public view disabled.</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* 7. ADMIN AI DASHBOARD TAB */}
                {activeTab === 'dashboard' && adminMetrics && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Box 1: Verified listings */}
                      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm`}>
                        <div className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Marketplace Products</div>
                        <div className="text-xl font-black font-mono mt-1 text-emerald-600">{adminMetrics.trendingProductsCount} Products</div>
                        <div className="text-[9.5px] text-zinc-400 mt-1">Recalculated 1 min ago</div>
                      </div>

                      {/* Box 2: Properties */}
                      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm`}>
                        <div className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Verified Real Estate</div>
                        <div className="text-xl font-black font-mono mt-1 text-emerald-600">{adminMetrics.trendingHousesCount} Houses</div>
                        <div className="text-[9.5px] text-zinc-400 mt-1">±5% constraints active</div>
                      </div>

                      {/* Box 3: Jobs */}
                      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm`}>
                        <div className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Overseas Vacancies</div>
                        <div className="text-xl font-black font-mono mt-1 text-emerald-600">{adminMetrics.trendingJobsCount} Jobs</div>
                        <div className="text-[9.5px] text-zinc-400 mt-1">Ministry approved list</div>
                      </div>

                      {/* Box 4: Fraud warnings */}
                      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm`}>
                        <div className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Fraud Predictions</div>
                        <div className="text-xl font-black font-mono mt-1 text-red-500">{adminMetrics.fraudPredictions} Flagged</div>
                        <div className="text-[9.5px] text-zinc-400 mt-1">Admin review pending</div>
                      </div>
                    </div>

                    {/* Forecasting grids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-4`}>
                        <div className="border-b pb-2 flex items-center gap-1.5">
                          <BarChart2 className="w-4 h-4 text-emerald-500" />
                          <h4 className="font-extrabold text-xs uppercase tracking-wider">AI Sales & Escrow Forecast</h4>
                        </div>
                        <div className="h-64 text-xs font-mono">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                              <XAxis dataKey="name" stroke={isDarkMode ? '#888' : '#444'} fontSize={10} />
                              <YAxis stroke={isDarkMode ? '#888' : '#444'} fontSize={10} />
                              <Tooltip contentStyle={{ background: isDarkMode ? '#1e1e1e' : '#fff', border: 'none', borderRadius: 8 }} />
                              <Area type="monotone" dataKey="Current" stroke="#059669" fill="#059669" fillOpacity={0.15} />
                              <Area type="monotone" dataKey="Projected" stroke="#d97706" fill="#d97706" fillOpacity={0.05} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="p-3 bg-stone-50 dark:bg-zinc-850 rounded-xl border text-[11px] leading-relaxed">
                          ⚡ <strong>AI Forecast Outlook:</strong> {adminMetrics.salesForecast}
                        </div>
                      </div>

                      <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'} shadow-sm space-y-4`}>
                        <div className="border-b pb-2 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <h4 className="font-extrabold text-xs uppercase tracking-wider">AI Activity Growth Forecast</h4>
                        </div>
                        <div className="h-64 text-xs font-mono">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryPopularityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                              <XAxis dataKey="name" stroke={isDarkMode ? '#888' : '#444'} fontSize={10} />
                              <YAxis stroke={isDarkMode ? '#888' : '#444'} fontSize={10} />
                              <Tooltip contentStyle={{ background: isDarkMode ? '#1e1e1e' : '#fff', border: 'none', borderRadius: 8 }} />
                              <Legend wrapperStyle={{ fontSize: 9 }} />
                              <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="p-3 bg-stone-50 dark:bg-zinc-850 rounded-xl border text-[11px] leading-relaxed">
                          📈 <strong>AI Growth Outlook:</strong> {adminMetrics.growthForecast}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 5-Channel Similar items Explorer Modal Detail */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border shadow-2xl relative ${isDarkMode ? 'bg-[#161616] border-zinc-800' : 'bg-white border-stone-200'}`}
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setSelectedItem(null);
                  setSimilarData(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full border hover:bg-stone-100 dark:hover:bg-zinc-800 font-extrabold text-xs"
              >
                ✕ Close
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6 mb-6">
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-lg font-mono font-bold uppercase">
                      Catalog item
                    </span>
                    <span className="text-xs text-zinc-400 font-mono font-bold">⭐ {selectedItem.rating || '4.6'} Verified Item</span>
                  </div>
                  <h2 className="text-lg font-black tracking-tight">{selectedItem.title || selectedItem.name}</h2>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{selectedItem.description || selectedItem.descriptionAm}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#202020] border-zinc-800' : 'bg-stone-50 border-stone-150'} flex flex-col justify-center items-center gap-2 text-center`}>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Price Valuation</div>
                  <div className="text-base font-black font-mono text-emerald-600">
                    {selectedItem.price ? formatEtb(selectedItem.price) : selectedItem.salary || 'Salary Match'}
                  </div>
                  <button 
                    onClick={() => {
                      alert('📁 Redirecting you to checkout escrow secure wallet modules...');
                      setSelectedItem(null);
                      setSimilarData(null);
                      onNavigateTab('shop');
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-bold"
                  >
                    🛒 Purchase with Escrow
                  </button>
                </div>
              </div>

              {/* Similar Items 5 Channels */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> AI Similar Product recommendations Index (5 Channels)
                </h3>

                {similarData ? (
                  <div className="space-y-6">
                    {/* Channel 1: You May Also Like */}
                    {similarData.youMayLike?.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-wider mb-2">🌸 You May Also Like</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {similarData.youMayLike.map((item: any) => (
                            <div 
                              key={item.id}
                              onClick={() => handleOpenItem(item)}
                              className={`p-3 rounded-xl border text-[11px] cursor-pointer hover:border-emerald-500/50 transition-all ${isDarkMode ? 'bg-[#202020] border-zinc-800' : 'bg-stone-50 border-stone-150'}`}
                            >
                              <h5 className="font-extrabold truncate mb-0.5">{item.title || item.name}</h5>
                              <div className="font-mono text-emerald-600 font-bold">{item.price ? formatEtb(item.price) : item.salary}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Channel 2: Similar Products */}
                    {similarData.similar?.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-wider mb-2">🔄 Similar Products</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {similarData.similar.map((item: any) => (
                            <div 
                              key={item.id}
                              onClick={() => handleOpenItem(item)}
                              className={`p-3 rounded-xl border text-[11px] cursor-pointer hover:border-emerald-500/50 transition-all ${isDarkMode ? 'bg-[#202020] border-zinc-800' : 'bg-stone-50 border-stone-150'}`}
                            >
                              <h5 className="font-extrabold truncate mb-0.5">{item.title || item.name}</h5>
                              <div className="font-mono text-emerald-600 font-bold">{item.price ? formatEtb(item.price) : item.salary}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Channel 3: Frequently Bought Together */}
                    {similarData.frequentlyBought?.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-wider mb-2">🤝 Frequently Bought Together</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {similarData.frequentlyBought.map((item: any) => (
                            <div 
                              key={item.id}
                              onClick={() => handleOpenItem(item)}
                              className={`p-3 rounded-xl border text-[11px] cursor-pointer hover:border-emerald-500/50 transition-all ${isDarkMode ? 'bg-[#202020] border-zinc-800' : 'bg-stone-50 border-stone-150'}`}
                            >
                              <h5 className="font-extrabold truncate mb-0.5">{item.title || item.name}</h5>
                              <div className="font-mono text-emerald-600 font-bold">{item.price ? formatEtb(item.price) : item.salary}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Channel 4: Best Alternatives */}
                    {similarData.alternatives?.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-wider mb-2">⚖️ Best Alternatives</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {similarData.alternatives.map((item: any) => (
                            <div 
                              key={item.id}
                              onClick={() => handleOpenItem(item)}
                              className={`p-3 rounded-xl border text-[11px] cursor-pointer hover:border-emerald-500/50 transition-all ${isDarkMode ? 'bg-[#202020] border-zinc-800' : 'bg-stone-50 border-stone-150'}`}
                            >
                              <h5 className="font-extrabold truncate mb-0.5">{item.title || item.name}</h5>
                              <div className="font-mono text-emerald-600 font-bold">{item.price ? formatEtb(item.price) : item.salary}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Channel 5: Customers Also Viewed */}
                    {similarData.customersViewed?.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-emerald-600 tracking-wider mb-2">👥 Customers Also Viewed</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {similarData.customersViewed.map((item: any) => (
                            <div 
                              key={item.id}
                              onClick={() => handleOpenItem(item)}
                              className={`p-3 rounded-xl border text-[11px] cursor-pointer hover:border-emerald-500/50 transition-all ${isDarkMode ? 'bg-[#202020] border-zinc-800' : 'bg-stone-50 border-stone-150'}`}
                            >
                              <h5 className="font-extrabold truncate mb-0.5">{item.title || item.name}</h5>
                              <div className="font-mono text-emerald-600 font-bold">{item.price ? formatEtb(item.price) : item.salary}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-16 flex justify-center items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin" />
                    <span className="text-xs font-mono">Computing similarities vectors...</span>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
