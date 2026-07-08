import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, MapPin, SlidersHorizontal, Trash2, ShieldCheck, Check } from 'lucide-react';
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
  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number | 'all'>('all');
  const [bedrooms, setBedrooms] = useState<'all' | '1' | '2' | '3' | '4+'>('all');
  const [bathrooms, setBathrooms] = useState<'all' | '1' | '2' | '3+'>('all');
  const [furnishedOnly, setFurnishedOnly] = useState<'all' | 'furnished' | 'unfurnished'>('all');
  const [parkingRequired, setParkingRequired] = useState(false);
  const [areaRange, setAreaRange] = useState<'all' | 'under100' | '100-200' | '200plus'>('all');
  const [selectedCity, setSelectedCity] = useState<'all' | 'Addis Ababa' | 'Adama' | 'Hawassa' | 'Bishoftu' | 'Bahir Dar'>('all');

  // Helper parsers to extract attributes from listings
  const parsedItems = useMemo(() => {
    return activeListings.map(item => {
      const searchStr = `${item.title} ${item.titleAm} ${item.description} ${item.descriptionAm} ${item.features?.join(' ')} ${item.featuresAm?.join(' ')}`.toLowerCase();
      
      // Parse Bedrooms
      let bd = 1;
      const bdMatch = searchStr.match(/(\d+)\s*(bedroom|መኝታ)/);
      if (bdMatch) bd = parseInt(bdMatch[1]);
      else if (searchStr.includes('studio') || searchStr.includes('ስቱዲዮ')) bd = 1;

      // Parse Bathrooms
      let bt = 1;
      const btMatch = searchStr.match(/(\d+)\s*(bathroom|complete bathroom|መታጠቢያ)/);
      if (btMatch) bt = parseInt(btMatch[1]);

      // Parse Furnished status
      const furnished = searchStr.includes('furnished') || searchStr.includes('የተሟላለት') || searchStr.includes('የተሟላ');

      // Parse Parking status
      const parking = searchStr.includes('parking') || searchStr.includes('ማቆሚያ') || searchStr.includes('ጋራዥ');

      // Parse Area square meters
      let area = 85; // default condo / general
      if (searchStr.includes('villa') || searchStr.includes('ቪላ')) area = 250;
      else if (searchStr.includes('studio') || searchStr.includes('ስቱዲዮ')) area = 45;
      else if (searchStr.includes('apartment') || searchStr.includes('አፓርትመንት')) area = 120;
      const areaMatch = searchStr.match(/(\d+)\s*(sq\.?m|sqm|ካሬ)/);
      if (areaMatch) area = parseInt(areaMatch[1]);

      // Parse City
      let city: 'Addis Ababa' | 'Adama' | 'Hawassa' | 'Bishoftu' | 'Bahir Dar' = 'Addis Ababa';
      if (searchStr.includes('adama') || searchStr.includes('አዳማ')) city = 'Adama';
      else if (searchStr.includes('hawassa') || searchStr.includes('ሀዋሳ')) city = 'Hawassa';
      else if (searchStr.includes('bishoftu') || searchStr.includes('ቢሾፍቱ')) city = 'Bishoftu';
      else if (searchStr.includes('bahir dar') || searchStr.includes('ባህር ዳር')) city = 'Bahir Dar';

      return {
        ...item,
        parsedBedrooms: bd,
        parsedBathrooms: bt,
        parsedFurnished: furnished,
        parsedParking: parking,
        parsedArea: area,
        parsedCity: city
      };
    });
  }, [activeListings]);

  // Apply filters on the parsed items
  const filteredListings = useMemo(() => {
    return parsedItems.filter(item => {
      // 1. Min Price
      if (minPrice !== 'all') {
        if (item.priceNum < minPrice) return false;
      }

      // 2. Max Price
      if (maxPrice !== 'all') {
        if (item.priceNum > maxPrice) return false;
      }

      // 3. Bedrooms
      if (bedrooms !== 'all') {
        if (bedrooms === '4+') {
          if (item.parsedBedrooms < 4) return false;
        } else {
          if (item.parsedBedrooms !== parseInt(bedrooms)) return false;
        }
      }

      // 4. Bathrooms
      if (bathrooms !== 'all') {
        if (bathrooms === '3+') {
          if (item.parsedBathrooms < 3) return false;
        } else {
          if (item.parsedBathrooms !== parseInt(bathrooms)) return false;
        }
      }

      // 5. Furnished Status
      if (furnishedOnly === 'furnished' && !item.parsedFurnished) return false;
      if (furnishedOnly === 'unfurnished' && item.parsedFurnished) return false;

      // 6. Parking Required
      if (parkingRequired && !item.parsedParking) return false;

      // 7. Area Range
      if (areaRange !== 'all') {
        if (areaRange === 'under100' && item.parsedArea >= 100) return false;
        if (areaRange === '100-200' && (item.parsedArea < 100 || item.parsedArea > 200)) return false;
        if (areaRange === '200plus' && item.parsedArea <= 200) return false;
      }

      // 8. City Select
      if (selectedCity !== 'all') {
        if (item.parsedCity !== selectedCity) return false;
      }

      return true;
    });
  }, [parsedItems, minPrice, maxPrice, bedrooms, bathrooms, furnishedOnly, parkingRequired, areaRange, selectedCity]);

  // Clean all filters
  const handleResetFilters = () => {
    setMinPrice('all');
    setMaxPrice('all');
    setBedrooms('all');
    setBathrooms('all');
    setFurnishedOnly('all');
    setParkingRequired(false);
    setAreaRange('all');
    setSelectedCity('all');
  };

  const isFilterActive = useMemo(() => {
    return (
      minPrice !== 'all' ||
      maxPrice !== 'all' ||
      bedrooms !== 'all' ||
      bathrooms !== 'all' ||
      furnishedOnly !== 'all' ||
      parkingRequired ||
      areaRange !== 'all' ||
      selectedCity !== 'all'
    );
  }, [minPrice, maxPrice, bedrooms, bathrooms, furnishedOnly, parkingRequired, areaRange, selectedCity]);

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
              : 'text-stone-550 dark:text-zinc-400 hover:text-[#1E3A1A] dark:hover:text-amber-400'
          }`}
        >
          🔑 {lang === 'en' ? 'For Rent / የሚከራይ' : 'የሚከራይ'}
        </button>
        <button 
          onClick={() => setHouseDealType('buy')}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            houseDealType === 'buy'
              ? 'bg-[#1E3A1A] text-white shadow-md scale-[1.01]'
              : 'text-stone-550 dark:text-zinc-400 hover:text-[#1E3A1A] dark:hover:text-amber-400'
          }`}
        >
          🏬 {lang === 'en' ? 'For Sale / የሚሸጥ' : 'የሚሸጥ'}
        </button>
      </div>

      {/* FILTER BUTTON AND PROPERTY TYPES QUICK FILTERS */}
      <div className="flex gap-1.5 items-center">
        {/* Advanced filter toggle */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold shrink-0 transition-all cursor-pointer ${
            showFilters || isFilterActive
              ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md font-black'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 border-stone-200 dark:border-zinc-850'
          }`}
          title="Advanced Filters"
        >
          <SlidersHorizontal size={14} />
          <span>{lang === 'en' ? 'Filters' : 'ማጣሪያዎች'}</span>
          {isFilterActive && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse ml-0.5"></span>}
        </button>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1 select-none scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {(['all', 'condominium', 'villa', 'apartment', 'studio'] as const).map((type) => {
            const label = {
              all: lang === 'en' ? 'All Types' : 'ሁሉም ዓይነቶች',
              condominium: lang === 'en' ? 'Condominium' : 'ኮንዶሚኒየም',
              villa: lang === 'en' ? 'Villa' : 'ቪላ',
              apartment: lang === 'en' ? 'Apartment' : 'አፓርትመንት',
              studio: lang === 'en' ? 'Studio' : 'ስቱዲዮ'
            }[type];

            return (
              <button 
                key={type}
                onClick={() => setHousesPropertyType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold leading-none shrink-0 transition-all border cursor-pointer ${
                  housesPropertyType === type 
                    ? 'bg-[#1E3A1A] text-white shadow-sm border-[#1E3A1A] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-500' 
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 border-stone-200 dark:border-zinc-850'
                }`}
              >
                {type === 'all' ? "🏡 " : ""}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* EXPANDABLE FILTER SETTINGS DRAWERS / PANEL */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border rounded-2xl overflow-hidden shadow-lg text-left relative ${
              isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-stone-50 border-stone-250'
            }`}
          >
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-stone-200 dark:border-zinc-850">
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                  ⚙️ {lang === 'en' ? 'Premium Real Estate Search Filters' : 'ተጨማሪ የሪል እስቴት መፈለጊያ ማጣሪያዎች'}
                </span>
                {isFilterActive && (
                  <button 
                    onClick={handleResetFilters}
                    className="text-[10px] text-red-500 hover:text-red-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={11} />
                    <span>{lang === 'en' ? 'Reset' : 'አጽዳ'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Price Budget Sliders / selectors */}
                <div className="space-y-1.5 text-xs text-left">
                  <label className="text-stone-700 dark:text-zinc-300 font-extrabold block">
                    💰 {lang === 'en' ? 'Budget Price range (ETB)' : 'የዋጋ ክልል (ብር)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                      className="bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs"
                    >
                      <option value="all">{lang === 'en' ? 'Min: Any' : 'ቢያንስ፡ የለም'}</option>
                      <option value="20000">20k {houseDealType === 'rent' ? '/mo' : ''}</option>
                      <option value="50000">50k {houseDealType === 'rent' ? '/mo' : ''}</option>
                      <option value="100000">100k {houseDealType === 'rent' ? '/mo' : ''}</option>
                      <option value="1000000">1M {houseDealType === 'rent' ? '' : ''}</option>
                      <option value="5000000">5M</option>
                      <option value="10000000">10M</option>
                    </select>

                    <select 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                      className="bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs"
                    >
                      <option value="all">{lang === 'en' ? 'Max: Any' : 'በከፍተኛ፡ የለም'}</option>
                      <option value="30000">30k {houseDealType === 'rent' ? '/mo' : ''}</option>
                      <option value="80000">80k {houseDealType === 'rent' ? '/mo' : ''}</option>
                      <option value="150000">150k {houseDealType === 'rent' ? '/mo' : ''}</option>
                      <option value="3000000">3M</option>
                      <option value="8000000">8M</option>
                      <option value="20000000">20M</option>
                    </select>
                  </div>
                </div>

                {/* 2. City select */}
                <div className="space-y-1.5 text-xs">
                  <label className="text-stone-700 dark:text-zinc-300 font-extrabold block">
                    📍 {lang === 'en' ? 'Target Location / City' : 'የሚፈልጉበት ከተማ'}
                  </label>
                  <select 
                    value={selectedCity}
                    onChange={(e: any) => setSelectedCity(e.target.value)}
                    className="w-full bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs outline-none"
                  >
                    <option value="all">{lang === 'en' ? 'All Ethiopian Cities' : 'ሁሉም ከተሞች'}</option>
                    <option value="Addis Ababa">Addis Ababa / አዲስ አበባ</option>
                    <option value="Adama">Adama / አዳማ</option>
                    <option value="Hawassa">Hawassa / ሀዋሳ</option>
                    <option value="Bishoftu">Bishoftu / ቢሾፍቱ</option>
                    <option value="Bahir Dar">Bahir Dar / ባህር ዳር</option>
                  </select>
                </div>

                {/* 3. Bedrooms Select */}
                <div className="space-y-1.5 text-xs">
                  <label className="text-stone-700 dark:text-zinc-300 font-extrabold block">
                    🛏️ {lang === 'en' ? 'Bedrooms count' : 'የመኝታ ክፍሎች ብዛት'}
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['all', '1', '2', '3', '4+'] as const).map((b) => (
                      <button 
                        key={b}
                        onClick={() => setBedrooms(b)}
                        className={`py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer text-center ${
                          bedrooms === b 
                            ? 'bg-[#1E3A1A] text-white border-[#1E3A1A]' 
                            : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800'
                        }`}
                      >
                        {b === 'all' ? 'All' : b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Bathrooms Select */}
                <div className="space-y-1.5 text-xs">
                  <label className="text-stone-700 dark:text-zinc-300 font-extrabold block">
                    🚿 {lang === 'en' ? 'Bathrooms count' : 'የመታጠቢያ ክፍሎች ብዛት'}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['all', '1', '2', '3+'] as const).map((bt) => (
                      <button 
                        key={bt}
                        onClick={() => setBathrooms(bt)}
                        className={`py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer text-center ${
                          bathrooms === bt 
                            ? 'bg-[#1E3A1A] text-white border-[#1E3A1A]' 
                            : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800'
                        }`}
                      >
                        {bt === 'all' ? 'All' : bt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Furnished Status & Parking checkbox */}
                <div className="space-y-1.5 text-xs">
                  <label className="text-stone-700 dark:text-zinc-300 font-extrabold block">
                    🛋️ {lang === 'en' ? 'Furnishing Setup' : 'የቤት እቃዎች ሁኔታ'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['all', 'furnished', 'unfurnished'] as const).map((f) => (
                      <button 
                        key={f}
                        onClick={() => setFurnishedOnly(f)}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer capitalize ${
                          furnishedOnly === f 
                            ? 'bg-[#1E3A1A] text-white border-[#1E3A1A]' 
                            : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800'
                        }`}
                      >
                        {f === 'all' ? 'Any' : f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Area Size (sq.m) & Parking */}
                <div className="space-y-2 text-xs">
                  <label className="text-stone-700 dark:text-zinc-300 font-extrabold block">
                    📐 {lang === 'en' ? 'Property Area Size (sq.m)' : 'የቤቱ ስፋት (በካሬ ሜትር)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={areaRange}
                      onChange={(e: any) => setAreaRange(e.target.value)}
                      className="bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs outline-none"
                    >
                      <option value="all">Any Size / ሁሉም</option>
                      <option value="under100">Under 100 ㎡ / ከ100 በታች</option>
                      <option value="100-200">100 - 200 ㎡</option>
                      <option value="200plus">Over 200 ㎡ / ከ200 በላይ</option>
                    </select>

                    <button 
                      onClick={() => setParkingRequired(!parkingRequired)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        parkingRequired
                          ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-extrabold'
                          : 'bg-stone-100 border-stone-200 text-stone-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      <span>🚗 {lang === 'en' ? 'Parking Garage' : 'መኪና ማቆሚያ'}</span>
                      {parkingRequired && <ShieldCheck size={12} className="text-amber-500" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-stone-200 dark:border-zinc-850 justify-end">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-stone-700 dark:text-zinc-300 font-bold rounded-xl text-xs uppercase cursor-pointer"
                >
                  {lang === 'en' ? 'Close' : 'ዝጋ'}
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-[#1E3A1A] text-white font-black rounded-xl text-xs uppercase cursor-pointer shadow-md"
                >
                  {lang === 'en' ? 'Apply Filters' : 'ማጣሪያዎችን ተግብር'} ({filteredListings.length})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredListings.length === 0 ? (
        <div className="flex flex-col gap-3">
          <div className="text-center py-12 bg-white/70 border border-dashed border-stone-300 rounded-2xl dark:bg-zinc-900/40 dark:border-zinc-800">
            <Home className="mx-auto text-stone-400 mb-2" size={32} />
            <p className="text-xs text-stone-600 font-medium font-bold dark:text-zinc-400">No properties found matching your filter criteria.</p>
          </div>

          <div className="p-4 bg-amber-500/5 rounded-2xl border border-dashed border-amber-500/30 text-center space-y-2.5">
            <span className="text-xs">🔔</span>
            <h5 className="text-[11px] font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-tight">ፍለጋውን አስቀምጥ / Save Search Subscribe Radar</h5>
            <p className="text-[10px] text-stone-550 dark:text-zinc-400 leading-normal max-w-xs mx-auto font-sans">
              Get an immediate high-priority system alert notice the moment a vendor logs a matching house property matching your active query in <strong>{selectedCity === 'all' ? 'Any Location/City' : selectedCity}</strong>!
            </p>
            <button
              type="button"
              onClick={() => {
                const newQueryId = 'srch-' + Math.floor(100000 + Math.random() * 900000);
                const newSearchObj = {
                  id: newQueryId,
                  query: searchQuery || 'All Houses',
                  city: selectedCity,
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
          {filteredListings.map(item => {
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
                    
                    {/* Badge details */}
                    <div className="flex gap-1 flex-wrap mb-1.5 select-none">
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-stone-100 text-stone-550 rounded border border-stone-200 dark:bg-zinc-800 dark:border-zinc-750 dark:text-zinc-400">
                        🛏️ {item.parsedBedrooms} Beds
                      </span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-stone-100 text-stone-550 rounded border border-stone-200 dark:bg-zinc-800 dark:border-zinc-750 dark:text-zinc-400">
                        🚿 {item.parsedBathrooms} Baths
                      </span>
                      {item.parsedFurnished && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                          🛋️ Furnished
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[9.5px] text-stone-500 dark:text-zinc-400">
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
