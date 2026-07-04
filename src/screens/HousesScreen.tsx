import React from 'react';
import { motion } from 'motion/react';
import { Home, MapPin } from 'lucide-react';
import { TraditionalCornerOrnament } from '../components/TraditionalCornerOrnament';

interface HousesScreenProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  houseDealType: 'rent' | 'buy';
  setHouseDealType: (val: 'rent' | 'buy') => void;
  housesPropertyType: string;
  setHousesPropertyType: (val: string) => void;
  activeListings: any[];
  setSelectedListing: (val: any) => void;
  setViewedVendorId: (val: string | null) => void;
  searchQuery: string;
  filterCity: string;
  filterCategory: string;
  filterMaxPrice: string;
  setSavedSearches: React.Dispatch<React.SetStateAction<any[]>>;
}

export function HousesScreen({
  isDarkMode,
  lang,
  houseDealType,
  setHouseDealType,
  housesPropertyType,
  setHousesPropertyType,
  activeListings,
  setSelectedListing,
  setViewedVendorId,
  searchQuery,
  filterCity,
  filterCategory,
  filterMaxPrice,
  setSavedSearches,
}: HousesScreenProps) {
  return (
    <div className="space-y-4">
      {/* DYNAMIC SEGMENT DEAL TYPE SELECTOR (RENT VS SALE) */}
      <div id="houses_segment_control" className={`p-1 rounded-xl flex items-center gap-1 border transition-all ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-200/50 border-stone-250'
      }`}>
        <button 
          onClick={() => setHouseDealType('rent')}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            houseDealType === 'rent'
              ? 'bg-[#1E3A1A] text-white shadow-md scale-[1.01]'
              : 'text-stone-500 dark:text-zinc-400 hover:text-[#1E3A1A] dark:hover:text-amber-400'
          }`}
        >
          🔑 {lang === 'en' ? 'For Rent / የሚከራይ' : 'የሚከራይ'}
        </button>
        <button 
          onClick={() => setHouseDealType('buy')}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            houseDealType === 'buy'
              ? 'bg-[#1E3A1A] text-white shadow-md scale-[1.01]'
              : 'text-stone-500 dark:text-zinc-400 hover:text-[#1E3A1A] dark:hover:text-amber-400'
          }`}
        >
          🏬 {lang === 'en' ? 'For Sale / የሚሸጥ' : 'የሚሸጥ'}
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button 
          onClick={() => {
            setHousesPropertyType('all');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
            housesPropertyType === 'all' 
              ? 'bg-[#1E3A1A] text-white shadow-sm border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500' 
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 border-stone-200 dark:border-zinc-800'
          }`}
        >
          🏡 All Properties
        </button>
        <button 
          onClick={() => {
            setHousesPropertyType(housesPropertyType === 'condominium' ? 'all' : 'condominium');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
            housesPropertyType === 'condominium' 
              ? 'bg-[#1E3A1A] text-white shadow-sm border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500' 
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 border-stone-200 dark:border-zinc-800'
          }`}
        >
          🏢 ኮንዶሚኒየም
        </button>
        <button 
          onClick={() => {
            setHousesPropertyType(housesPropertyType === 'villa' ? 'all' : 'villa');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
            housesPropertyType === 'villa' 
              ? 'bg-[#1E3A1A] text-white shadow-sm border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500' 
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 border-stone-200 dark:border-zinc-800'
          }`}
        >
          🏡 ቪላ
        </button>
        <button 
          onClick={() => {
            setHousesPropertyType(housesPropertyType === 'apartment' ? 'all' : 'apartment');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
            housesPropertyType === 'apartment' 
              ? 'bg-[#1E3A1A] text-white shadow-sm border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500' 
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 border-stone-200 dark:border-zinc-800'
          }`}
        >
          🏢 አፓርትመንት
        </button>
        <button 
          onClick={() => {
            setHousesPropertyType(housesPropertyType === 'studio' ? 'all' : 'studio');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
            housesPropertyType === 'studio' 
              ? 'bg-[#1E3A1A] text-white shadow-sm border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500' 
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 border-stone-200 dark:border-zinc-800'
          }`}
        >
          🏬 ስቱዲዮ
        </button>
      </div>

      {activeListings.length === 0 ? (
        <div className="flex flex-col gap-3">
          <div className="text-center py-12 bg-white/70 border border-dashed border-stone-300 rounded-2xl dark:bg-zinc-900/40 dark:border-zinc-800">
            <Home className="mx-auto text-stone-400 mb-2" size={32} />
            <p className="text-xs text-stone-600 font-medium font-bold dark:text-zinc-400">No properties found.</p>
          </div>

          <div className="p-4 bg-amber-500/5 rounded-2xl border border-dashed border-amber-500/30 text-center space-y-2.5">
            <span className="text-xs">🔔</span>
            <h5 className="text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-tight">ፍለጋውን አስቀምጥ / Save Search Subscribe Radar</h5>
            <p className="text-[10px] text-stone-500 dark:text-zinc-400 leading-normal max-w-xs mx-auto font-sans">
              Get an immediate high-priority system alert notice the moment a vendor logs a matching house property matching your active query in <strong>{filterCity === 'all' ? 'Any Location/City' : filterCity}</strong>!
            </p>
            <button
              type="button"
              onClick={() => {
                const newQueryId = 'srch-' + Math.floor(100000 + Math.random() * 900000);
                const newSearchObj = {
                  id: newQueryId,
                  query: searchQuery || 'All Houses',
                  city: filterCity,
                  category: filterCategory,
                  maxPrice: filterMaxPrice,
                  tab: 'houses'
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
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewedVendorId(item.vendorId);
                        setSelectedListing(null);
                      }}
                      title={lang === 'en' ? "Click to view Seller Profile instantly" : "የሻጩን ፕሮፋይል ወዲያውኑ ለመመልከት እዚህ ይጫኑ"}
                      className="text-[9.5px] text-[#C5A059] hover:text-[#1E3A1A] dark:hover:text-amber-400 hover:underline uppercase tracking-wider font-black block mb-1 cursor-pointer flex items-center gap-0.5"
                    >
                      👥 {item.vendorName}
                    </span>
                    <h3 className="text-xs font-bold line-clamp-2 text-stone-800 dark:text-zinc-200 mb-2 leading-relaxed h-8">{item.title}</h3>
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-bold text-green-700 dark:text-green-400 font-mono mb-1">{item.price}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-zinc-400">
                      <MapPin size={10} className="text-[#C5A059] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
                <TraditionalCornerOrnament />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
