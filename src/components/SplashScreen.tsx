import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Cpu, Layers, Star } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  lang: string;
}

const statusLogsByLang: Record<string, string[]> = {
  en: [
    "Initializing Every-zone Premium Hub...",
    "Securing Chapa & Telebirr ledger keys...",
    "Configuring AWS S3 & Cloudinary buckets...",
    "Synchronizing multi-zone container endpoints..."
  ],
  am: [
    "የኤቭሪ-ዞን ፕሪሚየም ማዕከል በመነሳት ላይ...",
    "የቻፓ እና ቴሌብር ምስጢራዊ ቁልፎችን በማስጠበቅ ላይ...",
    "የAWS S3 እና ክላውዲናሪ ማከማቻዎችን በማዘጋጀት ላይ...",
    "የባለብዙ-ዞን ኮንቴይነር መገናኛዎችን በማመሳሰል ላይ..."
  ]
};

export function SplashScreen({ onComplete, lang }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  const logs = statusLogsByLang[lang] || statusLogsByLang.en;

  useEffect(() => {
    // 2 seconds total duration. 20ms * 100 intervals = 2000ms (2s)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress > 75) {
      setActiveLogIndex(3);
    } else if (progress > 50) {
      setActiveLogIndex(2);
    } else if (progress > 25) {
      setActiveLogIndex(1);
    } else {
      setActiveLogIndex(0);
    }
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 400); // Small satisfying completion pause
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <div 
      id="splash-screen-container" 
      className="absolute inset-0 z-50 flex flex-col justify-between p-6 bg-radial from-[#1e1a11] via-[#0b0a08] to-[#040404] text-white overflow-hidden select-none"
    >
      {/* Background Ornaments / Ambient Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Gold Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 -left-10 w-60 h-60 bg-yellow-600/5 blur-[80px] rounded-full" />
        
        {/* Fine Luxury Geometrics (Mesh / Sunburst) */}
        <svg className="absolute inset-0 w-full h-full opacity-5 text-amber-500/40 animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.15">
          <circle cx="50" cy="50" r="46" />
          <polygon points="50,4 96,50 50,96 4,50" />
          <path d="M 50 0 L 50 100 M 0 50 L 100 50 M 14 14 L 86 86 M 14 86 L 86 14" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Top Header - Live Sandbox Status Indicator */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-widest font-mono text-amber-400">
            PROD_CLUSTER v1.0
          </span>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="text-[9.5px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 transition-all active:scale-95 cursor-pointer"
        >
          {lang === 'en' ? 'Skip ➔' : 'ዝለል ➔'}
        </button>
      </div>

      {/* Center Logo Hub */}
      <div className="flex flex-col items-center justify-center text-center space-y-7 z-10 my-auto">
        
        {/* Animated Gold Every-zone Emblem */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-32 h-32 flex items-center justify-center"
        >
          {/* Rotating Golden Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 border border-dashed border-amber-500/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute inset-2 border border-double border-amber-400/10 rounded-full"
          />
          
          {/* Outer Glowing Starburst */}
          <div className="absolute inset-4 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
          
          {/* Center Luxury Shield Icon */}
          <div className="w-22 h-22 bg-gradient-to-br from-[#E2B755] via-[#C5A059] to-[#916E2E] p-[1.5px] rounded-3xl shadow-2xl shadow-amber-500/10 rotate-45 transform">
            <div className="w-full h-full bg-[#0d0d0c] rounded-[22px] flex items-center justify-center">
              <div className="-rotate-45 flex flex-col items-center justify-center text-[#E2B755]">
                <Sparkles size={28} className="animate-pulse" />
                <span className="text-[13px] font-black font-mono tracking-tighter mt-1">EZ</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brand Text Header */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-extrabold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6C4] to-[#C5A059]">
            Every-zone
          </h1>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-black font-mono">
            {lang === 'en' ? "Everything in One Zone" : "ሁሉም በአንድ ዞን"}
          </p>
          <div className="text-[13px] font-black text-amber-500/80 font-serif tracking-widest mt-1">
            ኤቭሪ-ዞን
          </div>
        </motion.div>
      </div>

      {/* Bottom Diagnostics / Powered Brand footer */}
      <div className="space-y-5 z-10">
        
        {/* Sequence Diagnostics Terminal Output */}
        <div className="min-h-[28px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLogIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-[9.5px] text-stone-400 font-mono text-center flex items-center justify-center gap-2 max-w-[280px]"
            >
              <Cpu size={11} className="text-amber-500 animate-spin shrink-0" />
              <span className="truncate">{logs[activeLogIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Premium Gold Progress Loader */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[8.5px] font-black font-mono tracking-widest text-[#C5A059]">
            <span>BOOTING PRODUCTION INFRASTRUCTURE</span>
            <span>{progress}%</span>
          </div>
          <div className="h-[4px] w-full bg-zinc-950 rounded-full overflow-hidden border border-amber-500/10">
            <div 
              className="h-full bg-gradient-to-r from-[#916E2E] via-[#C5A059] to-[#E2B755] rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Security & Standard Logos */}
        <div className="flex justify-center items-center gap-4 text-[8px] text-stone-500 font-mono font-black border-t border-amber-500/5 pt-4">
          <div className="flex items-center gap-1">
            <Shield size={10} className="text-amber-500" />
            <span>AES-256 SECURED</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers size={10} className="text-amber-500" />
            <span>NGINX BALANCED</span>
          </div>
          <div className="flex items-center gap-1 text-stone-600">
            <Star size={8} className="text-amber-500" />
            <span>POWERED BY EVERY-ZONE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
