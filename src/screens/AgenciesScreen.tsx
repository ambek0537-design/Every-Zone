import React from 'react';
import { motion } from 'motion/react';
import { Award, Briefcase, Users } from 'lucide-react';
import { TraditionalCornerOrnament } from '../components/TraditionalCornerOrnament';
import OverseasEmploymentModule from '../components/OverseasEmploymentModule';

interface AgenciesScreenProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  agencyDealType: 'rent' | 'buy';
  setAgencyDealType: (val: 'rent' | 'buy') => void;
  agenciesFilter: string;
  setJobFilter: (val: string) => void;
  activeListings: any[];
  setSelectedListing: (val: any) => void;
  setViewedVendorId: (val: string | null) => void;
  searchQuery: string;
  filterCity: string;
  filterCategory: string;
  filterMaxPrice: string;
  setSavedSearches: React.Dispatch<React.SetStateAction<any[]>>;
}

export function AgenciesScreen({
  isDarkMode,
  lang,
  agencyDealType,
  setAgencyDealType,
  agenciesFilter,
  setJobFilter,
  activeListings,
  setSelectedListing,
  setViewedVendorId,
  searchQuery,
  filterCity,
  filterCategory,
  filterMaxPrice,
  setSavedSearches,
}: AgenciesScreenProps) {
  return (
    <div className="space-y-4">
      {/* DYNAMIC SEGMENT DEAL TYPE SELECTOR (LOCAL VS OVERSEAS) */}
      <div id="agencies_segment_control" className={`p-1 rounded-xl flex items-center gap-1 border transition-all ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-200/50 border-stone-250'
      }`}>
        <button 
          onClick={() => setAgencyDealType('rent')}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            agencyDealType === 'rent'
              ? 'bg-[#1E3A1A] text-white shadow-md scale-[1.01]'
              : 'text-stone-500 dark:text-zinc-400 hover:text-[#1E3A1A] dark:hover:text-amber-400'
          }`}
        >
          🔑 {lang === 'en' ? 'Local / Short Contract' : 'የአገር ውስጥ'}
        </button>
        <button 
          onClick={() => setAgencyDealType('buy')}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            agencyDealType === 'buy'
              ? 'bg-[#1E3A1A] text-white shadow-md scale-[1.01]'
              : 'text-stone-500 dark:text-zinc-400 hover:text-[#1E3A1A] dark:hover:text-amber-400'
          }`}
        >
          🏬 {lang === 'en' ? 'International / Europe' : 'የውጭ አገር'}
        </button>
      </div>

      {agencyDealType === 'buy' ? (
        <OverseasEmploymentModule isDarkMode={isDarkMode} lang={lang} />
      ) : (
        <>
          <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex items-start gap-2.5 shadow-sm text-left dark:bg-emerald-950/15 dark:border-emerald-900/30">
            <Award size={18} className="text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
              <span className="font-bold text-[#1E3A1A] dark:text-emerald-400">Certified Agencies Only:</span> All agency vendors display legal Ministry of Labor licensures to prevent deceptive recruitment.
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button 
              onClick={() => setJobFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
                agenciesFilter === 'all' 
                  ? 'bg-[#1E3A1A] text-white border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500 shadow-sm' 
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-250 border-stone-200 dark:bg-zinc-850 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800'
              }`}
            >
              💼 All Positions
            </button>
            <button 
              onClick={() => setJobFilter('gulf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
                agenciesFilter === 'gulf' 
                  ? 'bg-[#1E3A1A] text-white border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500 shadow-sm' 
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-250 border-stone-200 dark:bg-zinc-850 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800'
              }`}
            >
              ✈️ Gulf Region (ገልፍ)
            </button>
            <button 
              onClick={() => setJobFilter('europe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
                agenciesFilter === 'europe' 
                  ? 'bg-[#1E3A1A] text-white border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500 shadow-sm' 
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-250 border-stone-200 dark:bg-zinc-850 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800'
              }`}
            >
              🇪🇺 European Visas
            </button>
          </div>

          {activeListings.length === 0 ? (
            <div className="flex flex-col gap-3">
              <div className="text-center py-12 bg-white/70 border border-dashed border-stone-300 rounded-2xl dark:bg-zinc-900/40 dark:border-zinc-800">
                <Briefcase className="mx-auto text-stone-400 mb-2" size={32} />
                <p className="text-xs text-stone-600 font-medium font-semibold dark:text-zinc-400">No vacancies open.</p>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-2xl border border-dashed border-amber-500/30 text-center space-y-2.5">
                <span className="text-xs">🔔</span>
                <h5 className="text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-tight">ፍለጋውን አስቀምጥ / Save Search Subscribe Radar</h5>
                <p className="text-[10px] text-stone-500 dark:text-zinc-400 leading-normal max-w-xs mx-auto font-sans">
                  Get an immediate high-priority system alert notice the moment a vendor logs a matching agency position matching your active query in <strong>{filterCity === 'all' ? 'Any Location/City' : filterCity}</strong>!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const newQueryId = 'srch-' + Math.floor(100000 + Math.random() * 900000);
                    const newSearchObj = {
                      id: newQueryId,
                      query: searchQuery || 'All Positions',
                      city: filterCity,
                      category: filterCategory,
                      maxPrice: filterMaxPrice,
                      tab: 'agencies'
                    };
                    setSavedSearches(prev => [...prev, newSearchObj]);
                    alert(`🎉 Search Saved & Subscribed!\nWe have generated a live subscription in our smart matching database radar.\nYou will receive immediate notification once a matching vendor item goes online.`);
                  }}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-lg text-[9px] uppercase tracking-wider transition-transform active:scale-95 cursor-pointer font-sans"
                >
                  Subscribe & Bookmark Filter Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-6">
              {activeListings.map(item => {
                const isPremium = item.isPremium;
                return (
                  <motion.div 
                    key={item.id}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedListing(item)}
                    className={`bg-white hover:bg-stone-50 border rounded-2xl overflow-hidden cursor-pointer flex flex-col relative transition-all group shadow-sm hover:shadow-md dark:bg-zinc-900/60 dark:hover:bg-zinc-900 ${
                      isPremium 
                        ? 'border-amber-400 ring-1 ring-amber-400/40 shadow-amber-500/10' 
                        : 'border-stone-200 hover:border-stone-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                    }`}
                  >
                    {isPremium && (
                      <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 text-[7px] font-black tracking-widest px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5 animate-pulse">
                        👑 VIP VERIFIED
                      </div>
                    )}
                    <img src={item.image} alt={item.title} className="w-full h-28 object-cover group-hover:scale-105 transition-all duration-500" />
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div className="text-left">
                        <div className="text-[9px] text-[#C5A059] uppercase tracking-wider font-extrabold block mb-1">Lic: {item.agencyLicense}</div>
                        <h3 className="text-xs font-bold line-clamp-2 text-stone-800 dark:text-zinc-200 mb-2 leading-relaxed h-8">{item.title}</h3>
                      </div>
                      <div className="text-left">
                        <div className="text-[13px] font-bold text-green-700 dark:text-green-400 font-mono mb-1">{item.price}</div>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewedVendorId(item.vendorId);
                            setSelectedListing(null);
                          }}
                          title={lang === 'en' ? "Click to view Seller Profile instantly" : "የሻጩን ፕሮፋይል ወዲያውኑ ለመመልከት እዚህ ይጫኑ"}
                          className="flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-zinc-400 hover:text-[#1E3A1A] cursor-pointer"
                        >
                          <Users size={10} className="text-[#C5A059] shrink-0" />
                          <span className="truncate hover:underline font-bold">👥 {item.vendorName}</span>
                        </div>
                      </div>
                    </div>
                    <TraditionalCornerOrnament />
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
