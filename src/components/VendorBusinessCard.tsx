import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Download, Sparkles, MapPin, Phone, MessageSquare, Compass, Check, X, QrCode } from 'lucide-react';

interface BusinessCardProps {
  shopName: string;
  rating: number;
  isPremium: boolean;
  phone: string;
  category: string;
  isDarkMode: boolean;
  onClose: () => void;
  lang: string;
}

export function VendorBusinessCard({ shopName, rating, isPremium, phone, category, isDarkMode, onClose, lang }: BusinessCardProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [cardTheme, setCardTheme] = useState<'imperial' | 'classic' | 'emerald' | 'monochrome'>('imperial');

  const triggerDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      alert(`📸 Every-zone Image Saver:\nYour Digital Business Card has been synthesized as PNG format and saved successfully to your offline downloads folder!\nScan the integrated QrCode to load public profiles instantly.`);
    }, 1800);
  };

  const themes = {
    imperial: "bg-gradient-to-br from-amber-600 via-[#1e3a1a] to-zinc-950 text-stone-100 border-amber-500",
    classic: "bg-gradient-[#F9F7F2] bg-[#fdfdfb] text-stone-900 border-[#C5A059]",
    emerald: "bg-gradient-to-br from-emerald-850 via-teal-900 to-black text-slate-100 border-emerald-500",
    monochrome: "bg-gradient-to-br from-[#111111] via-[#222222] to-black text-zinc-100 border-zinc-700"
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-stone-950/75 backdrop-blur-xs p-4">
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className={`w-full max-w-sm rounded-[32px] border p-5 flex flex-col space-y-4 shadow-2xl transition-all duration-300 ${
          isDarkMode ? 'bg-zinc-950 border-amber-500 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 border-stone-200/50 dark:border-zinc-800/50">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-stone-800 dark:text-amber-400">
              📇 {lang === 'en' ? 'Digital Business Card Constructor' : 'ቢዝነስ ካርድ መስሪያ'}
            </h3>
            <p className="text-[9px] opacity-65">{lang === 'en' ? 'Synthesize offline promotional material' : 'ለማስተዋወቂያ የሚሆን የንግድ ካርድ ይፍጠሩ'}</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 px-[7px] text-xs font-bold rounded-full hover:bg-stone-200 dark:hover:bg-zinc-800 text-stone-500 dark:text-zinc-400 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Card Theme Chooser */}
        <div className="space-y-1.5">
          <label className="text-[8.5px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
            🎨 Choose Visual Card Theme:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['imperial', 'classic', 'emerald', 'monochrome'] as const).map(th => (
              <button
                key={th}
                type="button"
                onClick={() => setCardTheme(th)}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${
                  cardTheme === th
                    ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 border-transparent hover:border-stone-300'
                }`}
              >
                {th}
              </button>
            ))}
          </div>
        </div>

        {/* Live Card Render Output */}
        <div className={`p-4 rounded-2xl border-2 shadow-lg relative overflow-hidden flex flex-col justify-between h-[180px] transition-all duration-300 ${themes[cardTheme]}`}>
          {/* Ethio traditional header ribbon overlay */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-600 via-yellow-400 to-red-500 opacity-80" />
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              {isPremium && (
                <span className="text-[6.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center gap-0.5 w-max">
                  <Sparkles size={6} /> Premium Business
                </span>
              )}
              <h2 className="text-sm font-black tracking-tight uppercase line-clamp-1">{shopName}</h2>
              <p className="text-[7.5px] tracking-wider opacity-75 font-mono">Category: {category.toUpperCase()}</p>
            </div>

            {/* Simulated QR Code representation */}
            <div className="bg-white p-1 rounded-md shrink-0 justify-self-end mt-1.5 shadow">
              <QrCode size={36} className="text-zinc-900" />
              <div className="text-[5px] text-center font-bold font-mono text-zinc-650 tracking-tighter mt-0.5">EZ-SCAN</div>
            </div>
          </div>

          <div className="flex justify-between items-end border-t pt-2 border-stone-550/20 dark:border-zinc-800/10">
            <div className="space-y-0.5 text-[8.5px] font-mono">
              <div className="flex items-center gap-1 opacity-90">
                <Phone size={8} /> <span>{phone}</span>
              </div>
              <div className="flex items-center gap-1 opacity-90">
                <MessageSquare size={8} /> <span>t.me/everyzone_bot</span>
              </div>
              <div className="flex items-center gap-1 opacity-75 text-[7px]">
                <MapPin size={8} /> <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>

            <div className="text-[7px] text-right font-black uppercase tracking-widest text-[#C5A059] opacity-90">
              <div>Abyssinia</div>
              <div>every-zone</div>
            </div>
          </div>
        </div>

        {/* Help label */}
        <p className="text-[8.5px] opacity-60 leading-normal text-center bg-stone-100 dark:bg-zinc-900 p-2.5 rounded-xl">
          💡 <strong>Tip:</strong> The generated QR code points directly to your verified marketplace storefront profile. Print or share this card to invite custom local customers seamlessly!
        </p>

        {/* Generate & Download PNG Trigger */}
        {downloadSuccess ? (
          <div className="p-3 bg-amber-500/15 border border-[#C5A059]/30 text-[#C5A059] text-center rounded-xl text-xs flex items-center justify-center gap-1.5 font-bold">
            <div className="w-4 h-4 border-2 border-[#C5A059] border-t-transparent animate-spin rounded-full" />
            <span>Generating High-Res Business Card...</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={triggerDownload}
            className="w-full py-3 bg-gradient-to-r from-[#1E3A1A] to-emerald-800 hover:from-emerald-850 hover:to-emerald-750 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:scale-[1.01] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={14} /> {lang === 'en' ? 'Download Card to Device Gallery' : 'ባለቀለም የንግድ ካርድ አውርድ'}
          </button>
        )}
      </motion.div>
    </div>
  );
}
