import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Home, Briefcase, Wallet, ChevronRight, 
  ChevronLeft, Sparkles, Globe, Lock, Shield, ArrowRight, CheckCircle2, MessageCircle
} from 'lucide-react';

interface OnboardingProps {
  lang: string;
  setLang: (l: string) => void;
  onComplete: () => void;
}

export function OnboardingWelcomeCarousel({ lang, setLang, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  // Content for the 5 pages in multiple languages
  const slidesContent = {
    en: [
      {
        header: "🛒 Shop Everything",
        title: "Everything You Need",
        desc: "Buy high-quality products from verified vendors securely. Fully integrated escrow and local delivery dispatch.",
        pills: ["Verified Vendors", "Escrow Protection", "Fast Logistics"]
      },
      {
        header: "🏠 Find Houses",
        title: "Explore Premium Properties",
        desc: "Find cozy studios, CMC villas, and luxury Bole apartments. Direct communication with certified local agencies.",
        pills: ["Buy Properties", "Rent Monthly", "Save Favorites", "Chat with Agents"]
      },
      {
        header: "🌍 Work Abroad",
        title: "Overseas Job Placements",
        desc: "Secure international careers with certified employment agencies. Highly audited and certified pathways only.",
        pills: ["Verified Agencies", "Secure Applications", "Track Progress Live"]
      },
      {
        header: "💳 Wallet & Payments",
        title: "Secured Digital Wallet",
        desc: "Manage cash transfers, Sunday escrow matchmaking billing, and retail checkouts from one digital terminal.",
        pills: ["Deposit Safely", "Pay In-Store", "Transfer Instantly", "Withdraw Cash"]
      },
      {
        header: "🎉 Welcome to Every-zone",
        title: "Everything in One Zone",
        desc: "Your premium Abyssinia Super App is ready. Access markets, lodging, and logistics instantly.",
        pills: ["Luxury Design", "Dual Language Support", "Verified Security"]
      }
    ],
    am: [
      {
        header: "🛒 ምርት ይሸምቱ",
        title: "የሚፈልጉት ነገር ሁሉ",
        desc: "ከተረጋገጡ የሀገር ውስጥ ሻጮች ምርቶችን ደህንነቱ በተጠበቀ ሁኔታ ይግዙ። ሙሉ በሙሉ የተዋሃደ አስተማማኝ ክፍያ።",
        pills: ["የተረጋገጡ ሻጮች", "ዋስትና ያለው ክፍያ", "ፈጣን መላኪያ"]
      },
      {
        header: "🏠 ቤቶች ያግኙ",
        title: "ምርጥ የመኖሪያ ቤቶች",
        desc: "ምቹ ስቱዲዮዎችን፣ የሲኤምሲ ቪላዎችን እና የቦሌ አፓርታማዎችን በቀላሉ ይከራዩ ወይም ይግዙ።",
        pills: ["ቤቶችን መግዛት", "በወር መከራየት", "ቤቶችን ማስቀመጥ", "ከኤጀንቶች ጋር ማውራት"]
      },
      {
        header: "🌍 የውጭ ሀገር የስራ እድል",
        title: "ደህንነቱ የተጠበቀ ቅጥር",
        desc: "በህጋዊ የቅጥር ኤጀንሲዎች አማካኝነት አስተማማኝ የውጭ የስራ እድሎችን ያግኙ።",
        pills: ["የተረጋገጡ ኤጀንሲዎች", "ደህንነቱ የተጠበቀ ምዝገባ", "ሒደትን መከታተል"]
      },
      {
        header: "💳 የኪስ ቦርሳ እና ክፍያ",
        title: "ዲጂታል የኪስ ቦርሳ",
        desc: "የክፍያ ዝውውሮችን፣ የእሁድ ትዳር ማገናኛ ክፍያዎችን እና የሸመታ ግዢዎችን በአንድ ቦርሳ ያካሂዱ።",
        pills: ["በታማኝነት ማስቀመጥ", "ፈጣን ክፍያ", "ገንዘብ ማስተላለፍ", "ማውጣት"]
      },
      {
        header: "🎉 እንኳን ወደ ኤቭሪ-ዞን መጡ",
        title: "ሁሉም በአንድ ዞን",
        desc: "የአቢሲኒያ ፕሪሚየም ሱፐር አፕ ተዘጋጅቷል። ገበያዎችን፣ ማረፊያዎችን እና ፋይናንስን አሁኑኑ ያግኙ።",
        pills: ["የላቀ ዲዛይን", "ሁለት ቋንቋዎች ድጋፍ", "የተረጋገጠ ደህንነት"]
      }
    ]
  };

  const activeSlides = slidesContent[lang === 'am' ? 'am' : 'en'];
  const totalSteps = activeSlides.length;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('ez_onboarding_completed', 'true');
    onComplete();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between p-6 bg-[#09090b] text-white select-none overflow-y-auto">
      
      {/* Top Header - Skip & Language Selection */}
      <div className="flex justify-between items-center z-10 shrink-0">
        {/* Language selector toggle button */}
        <div className="flex bg-zinc-900 border border-amber-500/10 p-0.5 rounded-full">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${
              lang === 'en'
                ? 'bg-[#C5A059] text-[#09090b]'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('am')}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${
              lang === 'am'
                ? 'bg-[#C5A059] text-[#09090b]'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            አማ
          </button>
        </div>

        {/* Skip button - hides on welcome page */}
        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={completeOnboarding}
            className="text-[10px] uppercase font-black tracking-widest text-[#C5A059] hover:text-amber-400 transition-colors"
          >
            {lang === 'en' ? 'Skip' : 'ዝለል'}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Main Slide Carousel container */}
      <div className="flex-1 flex flex-col justify-center my-4 max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Header Badge */}
            <div className="flex justify-center">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#C5A059] text-[10px] font-extrabold uppercase tracking-wider font-mono">
                {activeSlides[step].header}
              </span>
            </div>

            {/* Custom Golden SVG Illustration Box */}
            <div className="h-56 w-full flex items-center justify-center rounded-3xl bg-radial from-[#1e1a11]/40 to-[#0c0c0c] border border-amber-500/5 relative overflow-hidden p-4 shadow-inner">
              
              {/* Back light glow */}
              <div className="absolute inset-0 bg-amber-500/5 blur-2xl rounded-full" />

              {/* Decorative Geometric Web pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-5 text-[#C5A059]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.2" fill="none" />
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 2" fill="none" />
              </svg>

              {/* Page 1 illustration (Storefront) */}
              {step === 0 && (
                <svg className="w-40 h-40 text-[#C5A059]" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2B755" />
                      <stop offset="100%" stopColor="#916E2E" />
                    </linearGradient>
                  </defs>
                  {/* Shop counter & canopy lineart */}
                  <rect x="25" y="45" width="50" height="35" rx="4" stroke="url(#goldGrad1)" strokeWidth="1.5" />
                  <path d="M20 45 L30 30 L40 45 L50 30 L60 45 L70 30 L80 45" stroke="url(#goldGrad1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="38" y="60" width="12" height="20" rx="2" stroke="url(#goldGrad1)" strokeWidth="1" />
                  <circle cx="50" cy="20" r="8" fill="url(#goldGrad1)" opacity="0.1" />
                  <path d="M47 20 H53 M50 17 V23" stroke="url(#goldGrad1)" strokeWidth="1" />
                  {/* Glowing shopping badge */}
                  <circle cx="75" cy="30" r="6" fill="#10b981" />
                  <path d="M73 30 L74.5 31.5 L77.5 28.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
                </svg>
              )}

              {/* Page 2 illustration (Real Estate) */}
              {step === 1 && (
                <svg className="w-40 h-40 text-[#C5A059]" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C5A059" />
                      <stop offset="100%" stopColor="#785516" />
                    </linearGradient>
                  </defs>
                  {/* Modern Villa Lineart */}
                  <path d="M15 75 L35 40 L50 60 L65 35 L85 75 Z" stroke="url(#goldGrad2)" strokeWidth="1.2" strokeLinejoin="round" />
                  <rect x="35" y="60" width="30" height="20" rx="3" stroke="url(#goldGrad2)" strokeWidth="1.5" fill="#09090b" />
                  <line x1="10" y1="80" x2="90" y2="80" stroke="url(#goldGrad2)" strokeWidth="2" />
                  {/* Glowing Windows */}
                  <rect x="42" y="66" width="6" height="6" rx="1" fill="#E2B755" className="animate-pulse" />
                  <rect x="52" y="66" width="6" height="6" rx="1" fill="#E2B755" className="animate-pulse" />
                  {/* Key Accent */}
                  <circle cx="25" cy="30" r="4" stroke="url(#goldGrad2)" strokeWidth="1.5" />
                  <line x1="25" y1="34" x2="25" y2="44" stroke="url(#goldGrad2)" strokeWidth="1.5" />
                  <line x1="25" y1="40" x2="29" y2="40" stroke="url(#goldGrad2)" strokeWidth="1.5" />
                </svg>
              )}

              {/* Page 3 illustration (Globe & Jobs) */}
              {step === 2 && (
                <svg className="w-40 h-40 text-[#C5A059]" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="goldGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2B755" />
                      <stop offset="100%" stopColor="#916E2E" />
                    </linearGradient>
                  </defs>
                  {/* Globe structure */}
                  <circle cx="50" cy="50" r="28" stroke="url(#goldGrad3)" strokeWidth="1.5" strokeDasharray="3 1" />
                  <ellipse cx="50" cy="50" rx="12" ry="28" stroke="url(#goldGrad3)" strokeWidth="1" />
                  <ellipse cx="50" cy="50" rx="28" ry="12" stroke="url(#goldGrad3)" strokeWidth="1" />
                  {/* Plane flying around globe */}
                  <path d="M25 35 Q40 15 70 30" stroke="url(#goldGrad3)" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
                  <polygon points="70,30 63,26 67,31" fill="url(#goldGrad3)" />
                  {/* Certified badge stamp */}
                  <circle cx="75" cy="70" r="7" fill="#C5A059" />
                  <path d="M72 70 L74 72 L78 68" stroke="black" strokeWidth="1" strokeLinecap="round" />
                </svg>
              )}

              {/* Page 4 illustration (Wallet) */}
              {step === 3 && (
                <svg className="w-40 h-40 text-[#C5A059]" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="goldGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2B755" />
                      <stop offset="100%" stopColor="#C5A059" />
                    </linearGradient>
                  </defs>
                  {/* Credit Card Floating */}
                  <rect x="20" y="32" width="60" height="36" rx="6" stroke="url(#goldGrad4)" strokeWidth="1.5" fill="#09090b" className="animate-bounce" style={{ animationDuration: '4s' }} />
                  <rect x="26" y="38" width="10" height="7" rx="1.5" fill="url(#goldGrad4)" />
                  <line x1="20" y1="52" x2="80" y2="52" stroke="url(#goldGrad4)" strokeWidth="1.5" />
                  {/* Secure Shield Overlay */}
                  <circle cx="75" cy="65" r="9" fill="#1e1a11" stroke="url(#goldGrad4)" strokeWidth="1.5" />
                  <path d="M75 61 L78 63 V66 C78 68.5 75 70 75 70 C75 70 72 68.5 72 66 V63 Z" fill="url(#goldGrad4)" />
                </svg>
              )}

              {/* Page 5 illustration (Welcome/Super App Hub) */}
              {step === 4 && (
                <svg className="w-40 h-40 text-[#C5A059]" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="goldGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2B755" />
                      <stop offset="100%" stopColor="#916E2E" />
                    </linearGradient>
                  </defs>
                  {/* Radiant Crown-style Star Emblem */}
                  <circle cx="50" cy="50" r="30" stroke="url(#goldGrad5)" strokeWidth="0.5" />
                  <path d="M50 15 L54 38 L77 34 L59 47 L70 70 L50 54 L30 70 L41 47 L23 34 L46 38 Z" fill="url(#goldGrad5)" className="animate-pulse" />
                  <circle cx="50" cy="46" r="4" fill="#09090b" />
                </svg>
              )}

            </div>

            {/* Title & Description text */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6C4] to-[#C5A059] font-sans">
                {activeSlides[step].title}
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed max-w-[280px] mx-auto font-sans font-medium">
                {activeSlides[step].desc}
              </p>
            </div>

            {/* Horizontal Pill list to reinforce highlights */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {activeSlides[step].pills.map((pill, pIdx) => (
                <span 
                  key={pIdx}
                  className="px-2.5 py-1 rounded-full bg-stone-900 border border-amber-500/10 text-[9px] font-bold text-stone-400 flex items-center gap-1"
                >
                  <span className="w-1 h-1 bg-[#C5A059] rounded-full" />
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls Area */}
      <div className="space-y-6 shrink-0 z-10">
        
        {/* Page Dots Indicator */}
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                idx === step 
                  ? 'w-6 bg-[#C5A059] shadow-md shadow-amber-500/20' 
                  : 'w-1.5 bg-stone-800 hover:bg-stone-700'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="max-w-sm mx-auto w-full pt-1">
          {step < totalSteps - 1 ? (
            <div className="flex items-center justify-between gap-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-3 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
              ) : (
                <div className="w-10" />
              )}
              
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 bg-gradient-to-r from-[#916E2E] via-[#C5A059] to-[#E2B755] hover:brightness-110 text-[#09090b] rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/5 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {lang === 'en' ? 'Next' : 'ቀጣይ'} <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            // Page 5: Welcome Buttons: "Login" and "Create Account"
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={completeOnboarding}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#916E2E] via-[#C5A059] to-[#E2B755] hover:brightness-110 text-[#09090b] rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {lang === 'en' ? 'Login' : 'ግባ'}
                </button>
                <button
                  type="button"
                  onClick={completeOnboarding}
                  className="flex-1 py-3.5 border-2 border-[#C5A059] hover:bg-amber-500/10 text-[#C5A059] rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {lang === 'en' ? 'Create Account' : 'መለያ ፍጠር'}
                </button>
              </div>
              <p className="text-[9px] text-center opacity-40 font-mono">
                {lang === 'en' ? "By continuing, you agree to Every-zone standards" : "በመቀጠል በኤቭሪ-ዞን ደንቦች ይስማማሉ"}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
