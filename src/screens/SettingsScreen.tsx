import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, Moon, Sun, Globe, Shield, HelpCircle, ArrowRight, User, 
  CheckCircle2, Award, Upload, AlertTriangle, Check, X, Building, 
  CreditCard, Landmark, FileText, Sparkles, ShieldCheck, Mail, Phone
} from 'lucide-react';
import DualCalendar from '../components/DualCalendar';
import { SubscriptionsManager } from '../components/SubscriptionsManager';

interface SettingsScreenProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  lang: 'en' | 'am';
  setLang: (val: 'en' | 'am') => void;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  scanHistory: any[];
  setScanHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedMarketplaceProduct: (prod: any) => void;
  setViewedVendorId: (id: string | null) => void;
  setActiveDevModule?: (val: 'none' | 'ai' | 'logistics' | 'adv' | 'admin' | 'wallet' | 'passport' | 'devops' | 'sre' | 'vendor_dashboard' | 'order_tracking' | 'wishlist' | 'v9_suite') => void;
}

export function SettingsScreen({
  isDarkMode,
  setIsDarkMode,
  lang,
  setLang,
  walletBalance,
  setWalletBalance,
  scanHistory,
  setScanHistory,
  setSelectedMarketplaceProduct,
  setViewedVendorId,
  setActiveDevModule,
}: SettingsScreenProps) {
  // --- Profile & Verification States ---
  const [vendorVerified, setVendorVerified] = useState<boolean>(() => {
    return localStorage.getItem('ez_vendor_verified_v2') === 'true';
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [storeName, setStoreName] = useState(() => localStorage.getItem('ez_vendor_store_name_v2') || '');
  const [storeDesc, setStoreDesc] = useState(() => localStorage.getItem('ez_vendor_store_desc_v2') || '');
  const [category, setCategory] = useState('RETAIL');
  const [ownerName, setOwnerName] = useState('Amare Belay');
  const [tinNumber, setTinNumber] = useState('');
  const [faydaNumber, setFaydaNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('0911223344');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseFileName, setLicenseFileName] = useState('');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idFileName, setIdFileName] = useState('');

  // Handle Save State
  const handleCompleteVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('ez_vendor_verified_v2', 'true');
      localStorage.setItem('ez_vendor_store_name_v2', storeName || 'Makeda Royal Traditional Store');
      localStorage.setItem('ez_vendor_store_desc_v2', storeDesc || 'Authentic Handwoven Habesha Gowns & Coffee Beans');
      setVendorVerified(true);
      setIsVerifying(false);
      setIsSubmitting(false);
      setVerificationStep(1);
    }, 2500); // Simulated secure credentials screening
  };

  const handleResetVerification = () => {
    localStorage.removeItem('ez_vendor_verified_v2');
    localStorage.removeItem('ez_vendor_store_name_v2');
    localStorage.removeItem('ez_vendor_store_desc_v2');
    setVendorVerified(false);
    setStoreName('');
    setStoreDesc('');
  };


  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4 pb-12 text-left"
    >
      {/* 1st: EVERYZONE SMART CALENDAR (ETHIOPIAN & GREGORIAN DUAL CALENDAR) */}
      <DualCalendar lang={lang} isDarkMode={isDarkMode} />

      {/* 2nd: PROFILE & VENDOR VERIFICATION FLOW */}
      <div className={`p-4 rounded-3xl border shadow-md transition-all duration-300 relative overflow-hidden ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'
      }`}>
        {/* Ambient top decoration */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500" />

        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100 dark:border-zinc-850">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-[#1E3A1A]/10 text-[#1E3A1A]'}`}>
              <User size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {lang === 'en' ? 'Profile & Merchant Status' : 'የመለያ መረጃና የነጋዴነት ደረጃ'}
              </h3>
              <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-stone-400'}`}>
                {lang === 'en' ? 'Manage your corporate identity and vendor credentials' : 'የግል መለያዎንና የድርጅትዎን ደረጃዎች እዚህ ይቆጣጠሩ'}
              </p>
            </div>
          </div>

          {vendorVerified && (
            <span className="text-[10px] font-black uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={11} />
              {lang === 'en' ? 'VERIFIED VENDOR' : 'የተረጋገጠ ሻጭ'}
            </span>
          )}
        </div>

        {/* Regular Profile Details Card */}
        <div className={`p-3.5 rounded-2xl border mb-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
          isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center font-black text-white text-lg relative">
              A
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[9px] text-white">
                ✓
              </div>
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold font-mono">Amare Belay</h4>
              <p className="text-[10px] text-stone-450 flex items-center gap-1 mt-0.5">
                <Mail size={10} className="text-amber-500" /> ambek0537@gmail.com
              </p>
              <p className="text-[10px] text-stone-450 flex items-center gap-1">
                <Phone size={10} className="text-amber-500" /> +251 911 22 33 44
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[9px] text-stone-400 block uppercase tracking-wider font-mono">Fayda National ID</span>
            <span className="text-xs font-black font-mono text-zinc-300">ET-39401-2940</span>
          </div>
        </div>

        {/* Access Flow Controller */}
        {!vendorVerified ? (
          // Access Flow Step 1 & 2: Become Vendor -> Vendor Verification
          <div className="space-y-3">
            <div className={`p-3 rounded-xl border flex items-start gap-3 bg-amber-500/[0.02] border-amber-500/20`}>
              <Award className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <h5 className="text-[11px] font-extrabold text-amber-500 uppercase tracking-wider">
                  {lang === 'en' ? 'Become Every-zone Enterprise Vendor' : 'የኤቭሪ-ዞን የተረጋገጠ ነጋዴ ይሁኑ'}
                </h5>
                <p className={`text-[10px] leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-stone-500'}`}>
                  {lang === 'en' 
                    ? 'Unlock your dedicated, beautiful, premium Vendor Center! Set up custom storefronts, list physical items and services, host live shopping, and settle transactions instantly via secure, escrow-shielded banking.' 
                    : 'ሙሉ በሙሉ የተሟላውን የሻጭ ማስተዳደሪያ ማዕከል ይክፈቱ! የራስዎን የዲጂታል ሱቅ ያዋቅሩ፣ አገልግሎቶችንና ዕቃዎችን ይሽጡ፣ የቀጥታ ስርጭት ግብይት ያስጀምሩ እንዲሁም በታማኝ ኤስክሮው ደህንነት ክፍያዎችን በቀጥታ ይቀበሉ።'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsVerifying(true);
                setVerificationStep(1);
              }}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
            >
              🚀 {lang === 'en' ? 'Become Vendor & Verify Store' : 'የሻጭነት ማረጋገጫ ፎርም ይሙሉ'}
            </button>
          </div>
        ) : (
          // Access Flow Step 3: Verified Vendor -> Launch Vendor Center
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] flex items-start gap-3.5">
              <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="text-xs font-black text-emerald-500 uppercase tracking-wider">
                  {lang === 'en' ? 'Verified Merchant Node Active' : 'የነጋዴነት ደረጃዎ ሙሉ በሙሉ ተረጋግጧል'}
                </h5>
                <p className="text-[10px] text-stone-400 leading-relaxed mt-0.5">
                  Store: <strong className="text-stone-200">{storeName || 'Makeda Royal Traditional Store'}</strong><br />
                  License Status: <span className="text-emerald-400">Verified Trade License (Active)</span><br />
                  Risk Rating: <span className="text-emerald-400">Excellent (Store Health Score: 98%)</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (setActiveDevModule) {
                    setActiveDevModule('vendor_dashboard');
                  } else {
                    alert('Vendor Center is loading...');
                  }
                }}
                className="py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-amber-500/10"
              >
                🏬 {lang === 'en' ? 'Launch Enterprise Vendor Center' : 'የሻጭ አስተዳዳሪ ሰሌዳ ይክፈቱ'}
              </button>

              <button
                onClick={handleResetVerification}
                className="py-2.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/15 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all cursor-pointer"
              >
                🗑️ {lang === 'en' ? 'Delete Store / Reset' : 'ሱቅህን ሰርዝ / እንደገና ጀምር'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VENDOR VERIFICATION WIZARD DIALOG */}
      <AnimatePresence>
        {isVerifying && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-lg rounded-3xl border shadow-2xl relative overflow-hidden ${
                isDarkMode ? 'bg-[#0E110E] border-zinc-800 text-zinc-100' : 'bg-white border-stone-250 text-stone-900'
              }`}
            >
              {/* Top gradient border bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-emerald-600" />

              {/* Header */}
              <div className="p-4 border-b border-stone-150 dark:border-zinc-850 flex justify-between items-center bg-zinc-950/20">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Sparkles size={16} />
                  </span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-500">Every-zone V2</h3>
                    <h4 className="text-sm font-bold">{lang === 'en' ? 'Merchant Onboarding Portal' : 'አዲስ የነጋዴነት መለያ ማረጋገጫ'}</h4>
                  </div>
                </div>
                <button
                  onClick={() => setIsVerifying(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-850 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Wizard progress bar */}
              <div className="px-5 pt-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2">
                  <span>{lang === 'en' ? `Step ${verificationStep} of 4` : `ደረጃ ${verificationStep} ከ 4`}</span>
                  <span>
                    {verificationStep === 1 && (lang === 'en' ? 'Store Branding' : 'የሱቅ ስም ዝርዝር')}
                    {verificationStep === 2 && (lang === 'en' ? 'Identity Screening' : 'የባለቤትነት ማረጋገጫ')}
                    {verificationStep === 3 && (lang === 'en' ? 'Tax & Business Registration' : 'ግብርና የንግድ ፈቃድ')}
                    {verificationStep === 4 && (lang === 'en' ? 'Escrow & Guidelines' : 'የደህንነት ደንቦች')}
                  </span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-zinc-850 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-600 to-yellow-500 h-full transition-all duration-300" 
                    style={{ width: `${(verificationStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Wizard Content Scroll */}
              <div className="p-5 max-h-[360px] overflow-y-auto space-y-4">
                {verificationStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3.5 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                        {lang === 'en' ? 'Store Name' : 'የሱቅዎ ስም'} <span className="text-amber-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Makeda Royal Traditional Store"
                        className="w-full bg-zinc-950/40 border border-stone-250 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                        {lang === 'en' ? 'Store Description' : 'የሱቅዎ መግለጫ'} <span className="text-amber-500">*</span>
                      </label>
                      <textarea
                        value={storeDesc}
                        onChange={(e) => setStoreDesc(e.target.value)}
                        placeholder="e.g. Authentic hand-spun traditional Habesha garments & Yirgacheffe specialty coffee."
                        rows={3}
                        className="w-full bg-zinc-950/40 border border-stone-250 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                          {lang === 'en' ? 'Primary Store Category' : 'የንግድ ዘርፍ'}
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-zinc-950 dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans cursor-pointer"
                        >
                          <option value="RETAIL">🛍️ Retail Goods & Fashion</option>
                          <option value="REAL_ESTATE">🏡 Real Estate & Housing</option>
                          <option value="RECRUITMENT">💼 Recruitment & Employment</option>
                          <option value="SERVICES">🛠️ Custom Services & Hospitality</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                          {lang === 'en' ? 'Estimated Stock Size' : 'የዕቃዎች ብዛት ግምት'}
                        </label>
                        <select className="w-full bg-zinc-950 dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans cursor-pointer">
                          <option>1 - 50 items</option>
                          <option>51 - 200 items</option>
                          <option>201 - 1000 items</option>
                          <option>1000+ items</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {verificationStep === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3.5 text-left">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                          {lang === 'en' ? 'Store Owner Full Name' : 'የባለቤቱ ሙሉ ስም'}
                        </label>
                        <input 
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Amare Belay"
                          className="w-full bg-zinc-950/40 border border-stone-250 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                          {lang === 'en' ? 'Store Phone Number' : 'ስልክ ቁጥር'}
                        </label>
                        <input 
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="0911223344"
                          className="w-full bg-zinc-950/40 border border-stone-250 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                        {lang === 'en' ? 'Fayda ID / Passport Number' : 'የፋይዳ ብሔራዊ መታወቂያ ቁጥር'} <span className="text-amber-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={faydaNumber}
                        onChange={(e) => setFaydaNumber(e.target.value)}
                        placeholder="e.g. ET-39401-2940"
                        className="w-full bg-zinc-950/40 border border-stone-250 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                        {lang === 'en' ? 'Upload Fayda ID or Passport Photo' : 'የመታወቂያ/ፓስፖርት ፎቶ ይጫኑ'}
                      </label>
                      <div className="border-2 border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl p-4 text-center cursor-pointer hover:border-amber-500/50 transition relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setIdFile(e.target.files[0]);
                              setIdFileName(e.target.files[0].name);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload size={24} className="mx-auto text-amber-500 mb-1.5" />
                        <span className="text-xs font-bold block mb-0.5">
                          {idFileName ? `Selected: ${idFileName}` : 'Drag and drop or click to select image'}
                        </span>
                        <span className="text-[10px] text-stone-450 block">PNG, JPG up to 5MB</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {verificationStep === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3.5 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                        {lang === 'en' ? 'Taxpayer Identification Number (TIN)' : 'የታክስ ከፋይ መለያ ቁጥር (TIN)'} <span className="text-amber-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={tinNumber}
                        onChange={(e) => setTinNumber(e.target.value)}
                        placeholder="e.g. 1004928194"
                        className="w-full bg-zinc-950/40 border border-stone-250 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block font-mono">
                        {lang === 'en' ? 'Upload Federal Trade License (PDF/JPG)' : 'የፌደራል የንግድ ፈቃድ ማረጋገጫ ሰነድ ይጫኑ'}
                      </label>
                      <div className="border-2 border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl p-4 text-center cursor-pointer hover:border-amber-500/50 transition relative">
                        <input 
                          type="file" 
                          accept=".pdf,image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setLicenseFile(e.target.files[0]);
                              setLicenseFileName(e.target.files[0].name);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <FileText size={24} className="mx-auto text-amber-500 mb-1.5" />
                        <span className="text-xs font-bold block mb-0.5">
                          {licenseFileName ? `Selected: ${licenseFileName}` : 'Drag and drop or click to select certificate'}
                        </span>
                        <span className="text-[10px] text-stone-450 block">PDF, PNG, JPG up to 10MB</span>
                      </div>
                    </div>

                    <div className="flex gap-2 p-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] text-amber-500">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-relaxed">
                        Every-zone automatically checks the Ethiopian Ministry of Trade database for TIN matching to verify entity registration authenticity.
                      </p>
                    </div>
                  </motion.div>
                )}

                {verificationStep === 4 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
                    <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-zinc-850 bg-stone-50/50 dark:bg-zinc-950/20 space-y-3">
                      <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                        🛡️ Escrow Trust Commitment
                      </h5>
                      
                      <div className="space-y-2 text-[10px] leading-relaxed text-stone-400">
                        <p className="flex items-start gap-2">
                          <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>All retail listings operate under <strong>Every-zone Joint Escrow Protective Shield</strong>. Payouts are safely cleared once customers confirm satisfaction.</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>We agree to a 2.5% platform billing commission per completed escrow withdrawal.</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>Withdrawals are settled instantly via Telebirr, CBE Birr, or Chapa.</span>
                        </p>
                      </div>
                    </div>

                    <p className={`text-[10px] leading-normal text-center ${isDarkMode ? 'text-zinc-400' : 'text-stone-500'}`}>
                      By clicking complete, you verify that all supplied corporate credentials are true. Our autonomous AI verification validator clears matches in approximately 3 seconds.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-stone-150 dark:border-zinc-850 flex justify-between items-center bg-zinc-950/25">
                <button
                  onClick={() => {
                    if (verificationStep > 1) {
                      setVerificationStep(verificationStep - 1);
                    } else {
                      setIsVerifying(false);
                    }
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer select-none ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850 text-zinc-300' : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-750'
                  }`}
                  disabled={isSubmitting}
                >
                  {verificationStep === 1 ? (lang === 'en' ? 'Cancel' : 'ሰርዝ') : (lang === 'en' ? 'Back' : 'ተመለስ')}
                </button>

                {verificationStep < 4 ? (
                  <button
                    onClick={() => setVerificationStep(verificationStep + 1)}
                    disabled={
                      (verificationStep === 1 && (!storeName || !storeDesc)) ||
                      (verificationStep === 2 && !faydaNumber) ||
                      (verificationStep === 3 && !tinNumber)
                    }
                    className="text-xs px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-black rounded-xl cursor-pointer flex items-center gap-1 transition-all"
                  >
                    {lang === 'en' ? 'Continue' : 'ቀጥል'} <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteVerification}
                    disabled={isSubmitting}
                    className="text-xs px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-55"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {lang === 'en' ? 'Verifying Credentials...' : 'ማስረጃዎችን በማረጋገጥ ላይ...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} />
                        {lang === 'en' ? 'Complete & Verify' : 'ማረጋገጫ ጨርስ'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3rd: EVERYZONE SUBSCRIPTION ENGINE PORTAL */}
      <SubscriptionsManager 
        walletBalance={walletBalance} 
        setWalletBalance={setWalletBalance} 
        isDarkMode={isDarkMode} 
        lang={lang} 
      />

      {/* Scan History Section for successfully scanned QRs */}
      <div className={`p-4 rounded-3xl border shadow-md transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
        <div className="flex items-center justify-between mb-3 border-b pb-3 border-stone-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-[#1E3A1A]/10 text-[#1E3A1A]'}`}>
              <History size={16} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold">
                {lang === 'en' ? 'QR Scan History' : 'የቃና ታሪክ'}
              </h3>
              <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-stone-400'}`}>
                {lang === 'en' ? 'Quickly access your last 5 successfully scanned items' : 'በቅርቡ በካሜራ የቃኟቸውን የነጋዴዎችና የዕቃዎች ታሪክ በፍጥነት ይክፈቱ'}
              </p>
            </div>
          </div>

          {scanHistory.length > 0 && (
            <button
              onClick={() => {
                localStorage.removeItem('ez_scan_history');
                setScanHistory([]);
              }}
              className="text-[9px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 border border-rose-500/20 px-2 py-1 rounded-xl transition-all cursor-pointer bg-rose-500/5 hover:bg-rose-500/10"
            >
              {lang === 'en' ? 'Clear' : 'አጽዳ'}
            </button>
          )}
        </div>

        {scanHistory.length === 0 ? (
          <div className="py-6 text-center">
            <span className="text-2xl block mb-1.5">📷</span>
            <p className={`text-[11px] leading-relaxed max-w-[280px] mx-auto ${isDarkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
              {lang === 'en' 
                ? 'No scanned items yet. Scan active products or vendor barcodes via the QR feature to see them here!' 
                : 'እስካሁን ምንም ታሪክ የለም! ለመጀመር የነጋዴዎችን ወይም የዕቃዎችን QR በካሜራ ያንቡ።'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {scanHistory.map((item, idx) => {
              const isProduct = item.type === 'product';
              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    if (isProduct) {
                      setSelectedMarketplaceProduct(item.productData);
                    } else if (item.vendorId) {
                      setViewedVendorId(item.vendorId);
                    }
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all group hover:scale-[1.01] active:scale-95 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-zinc-950/40 border-zinc-850 hover:border-zinc-700' 
                      : 'bg-stone-50 border-stone-200 hover:border-stone-250'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Visual Avatar */}
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-zinc-800"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white uppercase shadow-sm ${item.color || 'bg-amber-600'}`}>
                        {item.txt || 'QR'}
                      </div>
                    )}

                    <div className="text-left">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isProduct
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {isProduct 
                            ? (lang === 'en' ? 'Product' : 'ዕቃ') 
                            : (lang === 'en' ? 'Seller' : 'ሻጭ')}
                        </span>
                        <span className="text-[8px] text-stone-400 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold line-clamp-1 group-hover:text-amber-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-stone-450 leading-none mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={14} className="text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>



      {/* PROFILE EXTENSIONS: LINKED ACCOUNTS, ACTIVITY LOGS, QUICK SUPPORT */}
      <div className={`p-4 rounded-3xl border shadow-md transition-all duration-300 text-left space-y-4 ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'
      }`}>
        {/* Linked Accounts */}
        <div className="space-y-2 pb-3 border-b border-stone-100 dark:border-zinc-850">
          <span className="text-xs font-black uppercase tracking-wider text-amber-500 block font-mono">🔗 Linked & Verified Accounts</span>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 p-2 rounded-xl text-center">
              <span className="text-[11px] block font-extrabold text-[#00529b]">Telebirr</span>
              <span className="text-[9px] text-emerald-500 font-bold block">✓ Connected</span>
            </div>
            <div className="bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 p-2 rounded-xl text-center">
              <span className="text-[11px] block font-extrabold text-amber-600">CBE Birr</span>
              <span className="text-[9px] text-emerald-500 font-bold block">✓ Verified</span>
            </div>
            <div className="bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 p-2 rounded-xl text-center">
              <span className="text-[11px] block font-extrabold text-stone-300 font-mono">Fayda ID</span>
              <span className="text-[9px] text-emerald-500 font-bold block">✓ Authenticated</span>
            </div>
          </div>
        </div>

        {/* Corporate Activity Logs */}
        <div className="space-y-2 pb-3 border-b border-stone-100 dark:border-zinc-850">
          <span className="text-xs font-black uppercase tracking-wider text-amber-500 block font-mono">📜 Corporate Activity Logs</span>
          <div className="space-y-1.5 text-[10px] font-mono text-stone-400">
            <div className="flex justify-between border-b border-stone-100 dark:border-zinc-850 pb-1">
              <span>👤 Login approved via Fayda Biometrics</span>
              <span className="text-stone-500">Today, 09:24 AM</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 dark:border-zinc-850 pb-1">
              <span>💸 Escrow payout settled to Telebirr</span>
              <span className="text-stone-500">Yesterday, 04:12 PM</span>
            </div>
            <div className="flex justify-between">
              <span>🛠️ Corporate trade license updated</span>
              <span className="text-stone-500">July 2, 11:30 AM</span>
            </div>
          </div>
        </div>

        {/* Quick Arbitrator Helpline Support */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-500 block font-mono">📞 Quick Helpline & Escrow Arbitrator</span>
          <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-2xl flex items-start gap-2.5">
            <HelpCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <div className="space-y-1">
              <h5 className="text-[11px] font-extrabold text-stone-200 uppercase tracking-wider">Instant Dispute Resolution Center</h5>
              <p className="text-[9.5px] leading-relaxed text-stone-450">
                Facing delivery delays or specify disputes? Directly ping our 24/7 dedicated Federal Escrow Arbitrators for immediate contract reviews.
              </p>
              <button
                onClick={() => alert('📞 Ringing Every-zone National Support Arbitrator Helpline... (Toll Free: 9400)')}
                className="mt-1 text-[9.5px] font-black uppercase bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-lg hover:bg-amber-500/25 cursor-pointer transition-colors"
              >
                📞 Dial Arbitrator Hotline (9400)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security & System Integrity Policy Badge */}
      <div className={`p-4 rounded-3xl border flex gap-3 text-left items-start ${
        isDarkMode ? 'bg-zinc-900/40 border-zinc-850/80' : 'bg-stone-50 border-stone-200'
      }`}>
        <Shield className="text-amber-500 shrink-0 mt-0.5" size={16} />
        <div className="space-y-1">
          <span className="text-xs font-black uppercase text-stone-400 block tracking-widest font-mono">Every-zone Escrow Protocol</span>
          <p className="text-[10px] text-stone-450 leading-relaxed font-sans">
            Every deal made inside Every-zone (shop, house visits, agent contracts) operates under tokenized security checkpoints verified by certified banking clearance protocols. Funds remain sealed in trust vaults until fulfillment is complete.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
