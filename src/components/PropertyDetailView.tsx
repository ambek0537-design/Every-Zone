import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, CheckCircle2, Phone, Star, ShieldAlert, Share2, 
  Sparkles, Calculator, Building, School, ShieldCheck, Heart
} from 'lucide-react';
import { TraditionalCornerOrnament } from './TraditionalCornerOrnament';

interface PropertyDetailViewProps {
  selectedListing: any;
  lang: 'en' | 'am';
  isDarkMode: boolean;
  t: (key: string) => string;
  setViewedVendorId: (id: string | null) => void;
  setSelectedListing: (listing: any) => void;
  handleInstantPurchase: (item: any) => void;
  handleChapaRentPayment: (item: any) => void;
  setActiveBookingListing: (item: any) => void;
  setActiveBusinessCardListing: (item: any) => void;
  handleReportAndSuspend: (item: any) => void;
  triggerPushNotification?: (title: string, desc: string, icon: string, type: string) => void;
}

export function PropertyDetailView({
  selectedListing,
  lang,
  isDarkMode,
  t,
  setViewedVendorId,
  setSelectedListing,
  handleInstantPurchase,
  handleChapaRentPayment,
  setActiveBookingListing,
  setActiveBusinessCardListing,
  handleReportAndSuspend,
  triggerPushNotification
}: PropertyDetailViewProps) {
  // Gallery active index
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Mortgage Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTermYears, setLoanTermYears] = useState(20);

  // Parse price number
  const propertyPrice = useMemo(() => {
    return selectedListing.priceNum || 6500000;
  }, [selectedListing]);

  // Gallery Photos (Unsplash Luxury Addis / African Estate Photos)
  const photos = useMemo(() => {
    const defaultPhotos = [
      selectedListing.image,
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600"
    ];
    return defaultPhotos;
  }, [selectedListing]);

  // Live Mortgage calculations
  const mortgageCalculations = useMemo(() => {
    const P = propertyPrice * (1 - downPaymentPercent / 100);
    const r = (interestRate / 100) / 12;
    const n = loanTermYears * 12;
    
    let monthlyPayment = 0;
    if (r > 0) {
      monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      monthlyPayment = P / n;
    }

    const totalPaid = monthlyPayment * n;
    const totalInterest = totalPaid - P;

    return {
      downPaymentAmount: propertyPrice * (downPaymentPercent / 100),
      loanAmount: P,
      monthlyPayment: Math.round(monthlyPayment),
      totalPaid: Math.round(totalPaid),
      totalInterest: Math.round(totalInterest)
    };
  }, [propertyPrice, downPaymentPercent, interestRate, loanTermYears]);

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    if (triggerPushNotification) {
      triggerPushNotification(
        isSaved ? 'Listing Removed' : 'Listing Bookmarked!',
        isSaved 
          ? 'Removed property from your saved portfolio.' 
          : 'Saved this premium property to your bookmarks folder for offline matching radar!',
        '🏡',
        'social'
      );
    } else {
      alert(isSaved ? 'Removed from Bookmarks!' : 'Saved to your Bookmarks!');
    }
  };

  const handleShareProperty = async () => {
    const deepLink = `${window.location.origin}${window.location.pathname}#listing=${selectedListing.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedListing.title,
          text: `Check out this gorgeous property on Every-zone Real Estate!`,
          url: deepLink
        });
      } catch (err) {
        navigator.clipboard.writeText(deepLink);
        alert("Copied property deep link to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(deepLink);
      alert("Copied property deep link to clipboard!");
    }
  };

  const localLabel = (en: string, am: string) => {
    return lang === 'en' ? en : am;
  };

  return (
    <div className="space-y-4 text-left">
      {/* 1. TOP TITLE BAR & DISMISS */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-sans tracking-widest font-black uppercase block ${isDarkMode ? 'text-amber-400' : 'text-[#C5A059]'}`}>
              {lang === 'en' ? selectedListing.vendorName : selectedListing.vendorNameAm || selectedListing.vendorName}
            </span>
            <button 
              onClick={() => {
                setViewedVendorId(selectedListing.vendorId);
                setSelectedListing(null);
              }}
              className="bg-[#1E3A1A] hover:bg-[#1E3A1A]/95 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              👥 {lang === 'en' ? 'View Agency' : 'ኤጀንሲውን እይ'}
            </button>
          </div>
          <h2 className={`text-base font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
            {lang === 'en' ? selectedListing.title : selectedListing.titleAm || selectedListing.title}
          </h2>
        </div>
        <button 
          onClick={() => setSelectedListing(null)}
          className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 cursor-pointer ml-1 transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-350' : 'bg-stone-200 hover:bg-stone-300 text-stone-600'}`}
        >
          ✕
        </button>
      </div>

      {/* 2. PRICE & SAVE CONTROL */}
      <div className={`flex justify-between items-center border-b pb-3 ${isDarkMode ? 'border-zinc-800' : 'border-stone-200'}`}>
        <div>
          <span className={`text-lg font-bold font-mono tracking-widest block ${isDarkMode ? 'text-amber-400' : 'text-green-700'}`}>
            {lang === 'en' ? selectedListing.price : selectedListing.priceAm || selectedListing.price}
          </span>
          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
            Unit Price: {propertyPrice.toLocaleString()} ETB
          </div>
        </div>

        <div className="flex gap-2">
          {/* Bookmark Button */}
          <button 
            onClick={handleToggleSave}
            className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
              isSaved 
                ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-black scale-[1.05]'
                : 'bg-stone-100 hover:bg-stone-200 border-stone-250 text-stone-600 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-300'
            }`}
            title="Bookmark Property"
          >
            <Heart size={14} className={isSaved ? 'fill-amber-500 text-amber-500' : ''} />
          </button>
          {/* Share Button */}
          <button 
            onClick={handleShareProperty}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-600 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-300 cursor-pointer transition-all"
            title="Share Property"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* 3. MULTI-PHOTO INTERACTIVE SLIDER */}
      <div className={`relative rounded-2xl overflow-hidden border shadow-md group ${isDarkMode ? 'border-zinc-800' : 'border-stone-200'}`}>
        <img 
          src={photos[activePhotoIdx]} 
          alt="Property Photo" 
          className="w-full h-56 object-cover object-center transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent pointer-events-none"></div>
        
        {/* Gallery thumbnails layout */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10">
          <div className="flex gap-1.5 bg-neutral-950/60 p-1 rounded-xl border border-white/10 backdrop-blur-xs">
            {photos.map((ph, idx) => (
              <button 
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`w-10 h-7 rounded-md overflow-hidden border transition-all ${
                  activePhotoIdx === idx ? 'border-amber-500 scale-105 ring-1 ring-amber-500/50' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={ph} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
          <span className="bg-neutral-950/75 text-[8.5px] text-stone-300 px-2.5 py-1 rounded-lg font-bold font-mono">
            {activePhotoIdx + 1} / {photos.length} PHOTOS
          </span>
        </div>
      </div>

      {/* 4. KEY PROPERTY SPECS */}
      <div className="grid grid-cols-3 gap-2.5 text-center text-xs select-none">
        <div className="bg-stone-100 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-850 p-2.5 rounded-2xl space-y-1 relative overflow-hidden">
          <TraditionalCornerOrnament />
          <span className="text-stone-400 text-[9px] uppercase tracking-wider block">📐 {localLabel('Area Size', 'ስፋት')}</span>
          <span className="font-black text-stone-850 dark:text-white font-mono">
            {selectedListing.title.toLowerCase().includes('villa') ? '250' : (selectedListing.title.toLowerCase().includes('studio') ? '45' : '110')} ㎡
          </span>
        </div>
        <div className="bg-stone-100 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-850 p-2.5 rounded-2xl space-y-1 relative overflow-hidden">
          <TraditionalCornerOrnament />
          <span className="text-stone-400 text-[9px] uppercase tracking-wider block">🛏️ {localLabel('Bedrooms', 'መኝታ ክፍሎች')}</span>
          <span className="font-black text-stone-850 dark:text-white font-mono">
            {selectedListing.title.toLowerCase().includes('studio') ? '1' : (selectedListing.title.toLowerCase().includes('2-bedroom') ? '2' : '3')} Beds
          </span>
        </div>
        <div className="bg-stone-100 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-850 p-2.5 rounded-2xl space-y-1 relative overflow-hidden">
          <TraditionalCornerOrnament />
          <span className="text-stone-400 text-[9px] uppercase tracking-wider block">🚿 {localLabel('Bathrooms', 'መታጠቢያ ቤቶች')}</span>
          <span className="font-black text-stone-850 dark:text-white font-mono">
            {selectedListing.title.toLowerCase().includes('studio') ? '1' : (selectedListing.title.toLowerCase().includes('2-bedroom') ? '1.5' : '3')} Baths
          </span>
        </div>
      </div>

      {/* 5. DESCRIPTION */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block font-sans">
          📝 {localLabel('Property Details & Description', 'የንብረቱ ዝርዝር መግለጫ')}
        </span>
        <p className="text-stone-650 dark:text-zinc-300 text-xs leading-relaxed font-sans font-medium">
          {lang === 'en' ? selectedListing.description : selectedListing.descriptionAm || selectedListing.description}
        </p>
      </div>

      {/* 6. SPECIFICATION CHECKLIST */}
      {selectedListing.features && selectedListing.features.length > 0 && (
        <div className="bg-stone-100 dark:bg-zinc-900/40 p-4 rounded-2xl border border-stone-200 dark:border-zinc-850 space-y-2 relative overflow-hidden text-xs">
          <TraditionalCornerOrnament />
          <div className="text-[10px] text-stone-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
            {t('specificationChecklist')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(lang === 'en' ? selectedListing.features : selectedListing.featuresAm || selectedListing.features).map((feature: string, fIdx: number) => (
              <div key={fIdx} className="flex items-center gap-2 text-stone-700 dark:text-zinc-300 font-medium">
                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. MAP LOCATION & LOCAL AMENITIES WIDGET */}
      <div className="bg-stone-100 dark:bg-zinc-900/40 p-4 rounded-2xl border border-stone-200 dark:border-zinc-850 space-y-3 relative overflow-hidden">
        <TraditionalCornerOrnament />
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block font-sans">
          🗺️ {localLabel('Interactive Location Coordinates', 'አቅራቢያ የሚገኙ አገልግሎቶች ካርታ')}
        </span>

        {/* Mock Graphic Map Widget */}
        <div className="h-40 bg-zinc-900 border border-zinc-800 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 select-none">
          {/* SVG Map Grid Background overlay */}
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #FAF9F6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          {/* Custom vector map coordinates and route */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <path d="M 10,40 L 150,80 L 300,50 L 350,150" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeDasharray="4" />
            <circle cx="150" cy="80" r="4" fill="#C5A059" />
            <circle cx="300" cy="50" r="4" fill="#C5A059" />
          </svg>

          <div className="flex justify-between items-start z-10">
            <span className="bg-[#1E3A1A] text-white font-mono font-bold text-[8.5px] px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
              Addis Bole Subcity Grid
            </span>
            <span className="text-[8.5px] text-stone-400 font-mono">
              GPS: 9.0192° N, 38.7891° E
            </span>
          </div>

          {/* Glowing Target listing center Pin */}
          <div className="absolute left-[60%] top-[45%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
            </div>
            <span className="bg-neutral-950 text-[7.5px] text-white px-1.5 py-0.5 rounded border border-amber-500/30 mt-1 font-bold whitespace-nowrap shadow-md uppercase tracking-wider">
              🏡 Property Hub
            </span>
          </div>

          <div className="z-10 flex justify-between items-end">
            <span className="text-[9px] text-stone-400 leading-normal font-sans">
              📍 Nearby Landmarks: <strong className="text-white">Bole Atlas Area / CMC Heights</strong>
            </span>
            <button 
              onClick={() => alert(`Redirecting coordinates FYD-${selectedListing.id.toUpperCase()} to your devices default native maps application...`)}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 text-[8.5px] font-black rounded uppercase transition cursor-pointer"
            >
              Open Maps ↗
            </button>
          </div>
        </div>

        {/* Local Amenities Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-[10px] text-left">
          <div className="bg-neutral-900 border border-neutral-850 p-2 rounded-xl space-y-1">
            <span className="text-amber-500 font-bold block flex items-center gap-0.5"><School size={10} /> {localLabel('Schools', 'ትምህርት ቤቶች')}</span>
            <div className="text-stone-300 font-mono">Gibson School: 400m</div>
            <div className="text-stone-400 font-sans">Bole Academy: 1.2km</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-850 p-2 rounded-xl space-y-1">
            <span className="text-amber-500 font-bold block flex items-center gap-0.5"><Building size={10} /> {localLabel('Health', 'ህክምና')}</span>
            <div className="text-stone-300 font-mono">Hayat Hospital: 800m</div>
            <div className="text-stone-400 font-sans">CMC Clinic: 1.5km</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-850 p-2 rounded-xl space-y-1">
            <span className="text-amber-500 font-bold block flex items-center gap-0.5">🚇 {localLabel('Transport', 'ትራንስፖርት')}</span>
            <div className="text-stone-300 font-mono">LRT Station: 500m</div>
            <div className="text-stone-400 font-sans">Anbessa Bus: 300m</div>
          </div>
        </div>
      </div>

      {/* 8. INTERACTIVE MORTGAGE CALCULATOR */}
      <div className="bg-stone-100 dark:bg-zinc-900/40 p-4 rounded-2xl border border-stone-200 dark:border-zinc-850 space-y-3.5 relative overflow-hidden">
        <TraditionalCornerOrnament />
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-zinc-850">
          <Calculator size={14} className="text-amber-500" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest block font-sans">
            📐 {localLabel('Interactive Smart Mortgage & Loan Calculator', 'የቤት ብድር ስሌት ማስያ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Downpayment Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-stone-700 dark:text-zinc-300">
              <span className="font-bold">Down Payment ({downPaymentPercent}%)</span>
              <span className="font-mono text-amber-500 font-black">{(propertyPrice * (downPaymentPercent / 100)).toLocaleString()} ETB</span>
            </div>
            <input 
              type="range" 
              min={10} 
              max={80} 
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 h-1 rounded-lg"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-stone-700 dark:text-zinc-300">
              <span className="font-bold">Interest Rate (%)</span>
              <span className="font-mono text-amber-500 font-black">{interestRate}% Yr</span>
            </div>
            <input 
              type="range" 
              min={5} 
              max={20} 
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 h-1 rounded-lg"
            />
          </div>

          {/* Loan Term Years */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-stone-700 dark:text-zinc-300">
              <span className="font-bold">Loan Term (Years)</span>
              <span className="font-mono text-amber-500 font-black">{loanTermYears} Years</span>
            </div>
            <input 
              type="range" 
              min={5} 
              max={30} 
              step={5}
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 h-1 rounded-lg"
            />
          </div>
        </div>

        {/* Live Calculation Results Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="bg-neutral-900 p-2 rounded-xl text-center space-y-0.5">
            <span className="text-[8px] text-stone-500 uppercase">Down Payment</span>
            <span className="text-[10.5px] font-black text-stone-200 font-mono block">{mortgageCalculations.downPaymentAmount.toLocaleString()} ETB</span>
          </div>
          <div className="bg-neutral-900 p-2 rounded-xl text-center space-y-0.5">
            <span className="text-[8px] text-stone-500 uppercase">Net Loan Amount</span>
            <span className="text-[10.5px] font-black text-stone-200 font-mono block">{mortgageCalculations.loanAmount.toLocaleString()} ETB</span>
          </div>
          <div className="bg-neutral-900 p-2 rounded-xl text-center space-y-0.5">
            <span className="text-[8px] text-stone-500 uppercase">Total Interest</span>
            <span className="text-[10.5px] font-black text-stone-200 font-mono block">{mortgageCalculations.totalInterest.toLocaleString()} ETB</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/35 p-2 rounded-xl text-center space-y-0.5">
            <span className="text-[8px] text-amber-500 uppercase font-black">Monthly Payment</span>
            <span className="text-xs font-black text-amber-500 font-mono block">{mortgageCalculations.monthlyPayment.toLocaleString()} ETB/mo</span>
          </div>
        </div>

        {/* Dynamic Proportion Amortization bar chart */}
        <div className="space-y-1.5 pt-1.5">
          <div className="flex justify-between text-[9px] font-bold text-stone-500 dark:text-zinc-400">
            <span className="text-amber-500 flex items-center gap-1">■ Down Payment ({downPaymentPercent}%)</span>
            <span className="text-[#1D4ED8] flex items-center gap-1">■ Principal Loan ({100 - downPaymentPercent}%)</span>
            <span className="text-stone-300 flex items-center gap-1">■ Total Accrued Interest</span>
          </div>
          <div className="h-2.5 rounded-full bg-neutral-800 overflow-hidden flex">
            <div className="h-full bg-amber-500" style={{ width: `${downPaymentPercent}%` }}></div>
            <div className="h-full bg-[#1D4ED8]" style={{ width: `${100 - downPaymentPercent}%` }}></div>
          </div>
          <span className="text-[8.5px] text-stone-400 block text-center font-sans">
            Secured by local bank clearance approvals: CBE, Awash Bank, Dashen Bank, Abyssinia Bank compliant models.
          </span>
        </div>
      </div>

      {/* 9. PRIMARY PORTFOLIO ACTIONS */}
      <div className="flex gap-2.5 select-none pt-2.5 border-t border-stone-200 dark:border-zinc-850">
        <button 
          onClick={() => handleInstantPurchase(selectedListing)}
          className="flex-1 bg-[#1E3A1A] text-white hover:opacity-95 text-xs py-3 rounded-xl font-black transition-all shadow-md active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          {t('instantPurchase')} (ETB)
        </button>
        <button 
          onClick={() => handleChapaRentPayment(selectedListing)}
          className="bg-stone-850 hover:bg-stone-900 hover:opacity-95 text-white text-xs px-4 py-3 rounded-xl font-black transition-all chapa-gradient shadow-md flex items-center gap-1.5 border border-amber-500/20 cursor-pointer uppercase tracking-wider"
        >
          {t('payRent')}
        </button>
      </div>

      {/* 10. BOOKING VISIT & BUSINESS CARDS SHORTCUTS */}
      <div className="grid grid-cols-2 gap-2.5 select-none">
        <button 
          type="button"
          onClick={() => setActiveBookingListing(selectedListing)}
          className="flex-1 py-2.5 bg-[#FAF9F6] border border-[#1E3A1A]/20 hover:bg-stone-50 text-stone-800 text-[10px] font-black uppercase rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          📅 Schedule Visit / ጉብኝት
        </button>
        <button 
          type="button"
          onClick={() => setActiveBusinessCardListing(selectedListing)}
          className="flex-1 py-2.5 bg-gradient-to-r from-amber-500/10 to-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-stone-900 text-[10px] font-black uppercase rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer font-sans"
        >
          🎴 Business Card / የኤጀንሲ ካርድ
        </button>
      </div>

      {/* 11. AGENT DIRECT WHATSAPP / TELEGRAM CHAT */}
      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex justify-between items-center text-xs">
        <div className="space-y-0.5">
          <span className="text-[9.5px] font-black text-emerald-500 uppercase tracking-wider block">💬 DIRECT BROKER CONCIERGE</span>
          <span className="text-[10.5px] text-stone-605 dark:text-zinc-300 font-sans leading-relaxed block">
            Chat with our verified listings Desk directly.
          </span>
        </div>
        <button 
          onClick={() => {
            const preText = encodeURIComponent(`Selam, I am interested in your property listing: ${selectedListing.title} (${selectedListing.price}). Let's schedule a site visit!`);
            window.open(`https://wa.me/251911245678?text=${preText}`, '_blank');
          }}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-[10px] uppercase transition cursor-pointer flex items-center gap-1"
        >
          <Phone size={11} /> WhatsApp
        </button>
      </div>
    </div>
  );
}
