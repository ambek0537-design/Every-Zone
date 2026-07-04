import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import {
  toEthiopian,
  ethiopianToJD,
  jdToEthiopian,
  jdToGregorian,
  AMHARIC_WEEKDAYS,
  ENGLISH_WEEKDAYS,
  ETHIOPIAN_MONTHS,
  GREGORIAN_MONTHS
} from '../utils/ethiopianCalendar';

interface DualCalendarProps {
  lang: string;
  isDarkMode: boolean;
}

export default function DualCalendar({ lang, isDarkMode }: DualCalendarProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  // Helper to get exact current time in East Africa Time (EAT - UTC+3)
  const getEthiopianLocalTime = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3 * 3600000));
  };

  const [today, setToday] = useState(getEthiopianLocalTime());

  // Browsing states for Gregorian Calendar
  const [gregYear, setGregYear] = useState(today.getFullYear());
  const [gregMonth, setGregMonth] = useState(today.getMonth()); // 0-indexed

  // Browsing states for Ethiopian Calendar
  const [ethYear, setEthYear] = useState(2018);
  const [ethMonth, setEthMonth] = useState(10); // 1-indexed (e.g. 10 is Sene)

  // Keep track of current Ethiopian Date today
  const ethToday = toEthiopian(today);

  // Sync browsing states to today initially
  useEffect(() => {
    setGregYear(today.getFullYear());
    setGregMonth(today.getMonth());
    setEthYear(ethToday.year);
    setEthMonth(ethToday.month);
  }, [today]);

  // Keep today's date updated (in case of midnight crossings, though mostly for accuracy)
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(getEthiopianLocalTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Helper for Gregorian days count
  const getGregorianDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  // Helper for Ethiopian days count
  const getEthiopianDaysInMonth = (y: number, m: number) => {
    if (m >= 1 && m <= 12) return 30;
    if (m === 13) {
      // Check if 6th day exists in this Ethiopian year using JDN check
      const jd6 = ethiopianToJD(y, 13, 6);
      const eth6 = jdToEthiopian(jd6);
      if (eth6.year === y && eth6.month === 13 && eth6.day === 6) {
        return 6;
      }
      return 5;
    }
    return 30;
  };

  // Gregorian next/prev month
  const prevGregMonth = () => {
    if (gregMonth === 0) {
      setGregMonth(11);
      setGregYear(gregYear - 1);
    } else {
      setGregMonth(gregMonth - 1);
    }
  };

  const nextGregMonth = () => {
    if (gregMonth === 11) {
      setGregMonth(0);
      setGregYear(gregYear + 1);
    } else {
      setGregMonth(gregMonth + 1);
    }
  };

  // Ethiopian next/prev month
  const prevEthMonth = () => {
    if (ethMonth === 1) {
      setEthMonth(13);
      setEthYear(ethYear - 1);
    } else {
      setEthMonth(ethMonth - 1);
    }
  };

  const nextEthMonth = () => {
    if (ethMonth === 13) {
      setEthMonth(1);
      setEthYear(ethYear + 1);
    } else {
      setEthMonth(ethMonth + 1);
    }
  };

  // Render Gregorian Calendar days grid
  const renderGregorianDays = () => {
    const totalDays = getGregorianDaysInMonth(gregYear, gregMonth);
    const firstDayIndex = new Date(gregYear, gregMonth, 1).getDay();

    const days = [];
    // Add empty spaces for previous month's offset
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`greg-empty-${i}`} className="h-6 w-6" />);
    }

    // Add days
    for (let day = 1; day <= totalDays; day++) {
      const isItToday = 
        day === today.getDate() && 
        gregMonth === today.getMonth() && 
        gregYear === today.getFullYear();

      days.push(
        <div 
          key={`greg-day-${day}`} 
          className={`h-7 w-7 flex items-center justify-center text-[11px] rounded-full font-bold transition-all ${
            isItToday 
              ? 'bg-[#1E3A1A] text-white ring-2 ring-[#C5A059]/40 font-black' 
              : isDarkMode
                ? 'hover:bg-zinc-800 text-zinc-300'
                : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  // Render Ethiopian Calendar days grid
  const renderEthiopianDays = () => {
    const totalDays = getEthiopianDaysInMonth(ethYear, ethMonth);
    
    // Get start day of the week for Ethiopian 1st of this month
    const jd1 = ethiopianToJD(ethYear, ethMonth, 1);
    const greg1 = jdToGregorian(jd1);
    const firstDayIndex = new Date(greg1.year, greg1.month - 1, greg1.day).getDay();

    const days = [];
    // Add empty spaces
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`eth-empty-${i}`} className="h-6 w-6" />);
    }

    // Add days
    for (let day = 1; day <= totalDays; day++) {
      const isItToday = 
        day === ethToday.day && 
        ethMonth === ethToday.month && 
        ethYear === ethToday.year;

      days.push(
        <div 
          key={`eth-day-${day}`} 
          className={`h-7 w-7 flex items-center justify-center text-[11px] rounded-full font-bold transition-all ${
            isItToday 
              ? 'bg-[#C5A059] text-zinc-950 ring-2 ring-[#1E3A1A]/40 font-black scale-105 shadow-sm' 
              : isDarkMode
                ? 'hover:bg-zinc-800 text-zinc-300'
                : 'hover:bg-stone-100 text-stone-700'
          }`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  // Get Amharic translation for Gregorian Month
  const getGregorianMonthName = (monthIdx: number) => {
    return GREGORIAN_MONTHS[monthIdx][lang === 'en' ? 'en' : 'am'];
  };

  // Get Ethiopian Month Name
  const getEthiopianMonthName = (monthIdx: number) => {
    return ETHIOPIAN_MONTHS[monthIdx - 1][lang === 'en' ? 'en' : 'am'];
  };

  return (
    <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-300 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
        : 'bg-white border-stone-200 text-stone-850'
    }`}>
      {/* Mini Calendar (Closed state / Header) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl shrink-0 ${
            isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-[#1E3A1A]/10 text-[#1E3A1A]'
          }`}>
            <CalendarIcon size={18} className="animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              {lang === 'en' ? 'EveryZone Smart Calendar' : 'የኤቭሪዞን ዘመናዊ የቀን መቁጠሪያ'}
            </h3>
            
            {/* Short inline date when minimized */}
            {!isMaximized && (
              <div className="text-xs font-extrabold flex flex-wrap items-center gap-1.5 mt-0.5 text-stone-850 dark:text-zinc-200 leading-normal">
                <span className="bg-[#1E3A1A] text-white px-1.5 py-0.5 rounded-lg text-[10px] uppercase font-mono tracking-tight shadow-sm">
                  {GREGORIAN_MONTHS[today.getMonth()].en.substring(0, 3)} {today.getDate()}, {today.getFullYear()}
                </span>
                <span className="text-[10px] text-[#C5A059] font-black font-sans shrink-0">
                  ⇄
                </span>
                <span className="bg-[#C5A059] text-zinc-950 px-1.5 py-0.5 rounded-lg text-[10px] font-sans font-black shadow-sm">
                  {ETHIOPIAN_MONTHS[ethToday.month - 1][lang === 'en' ? 'en' : 'am']} {ethToday.day}፣ {ethToday.year} {lang === 'en' ? 'E.C.' : 'ዓ.ም'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Maximize/Minimize Toggle button */}
        <button
          onClick={() => setIsMaximized(!isMaximized)}
          className={`p-1.5 rounded-xl border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            isDarkMode 
              ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' 
              : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-[#1E3A1A] hover:bg-stone-100'
          }`}
          title={isMaximized 
            ? (lang === 'en' ? "Collapse Calendar" : "ካላንደሩን አሳንስ") 
            : (lang === 'en' ? "Expand Full Calendar" : "ሙሉ ካላንደር ዘርጋ")
          }
        >
          {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {/* Expanded Grid (Side-by-side calendars) */}
      <AnimatePresence initial={false}>
        {isMaximized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800/60">
              
              {/* LEFT COLUMN: GREGORIAN CALENDAR */}
              <div className="p-3 rounded-2xl bg-stone-50/50 dark:bg-zinc-950/40 border border-stone-100 dark:border-zinc-800/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-widest font-black text-stone-400 dark:text-zinc-500 font-mono">
                    Gregorian Calendar (እ.ኤ.አ)
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={prevGregMonth} 
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[11px] font-black min-w-[100px] text-center uppercase tracking-tight">
                      {getGregorianMonthName(gregMonth)} {gregYear}
                    </span>
                    <button 
                      onClick={nextGregMonth} 
                      className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Weekday labels */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1 border-b pb-1 border-stone-100 dark:border-zinc-900/60">
                  {ENGLISH_WEEKDAYS.map((day) => (
                    <span key={`greg-wk-${day}`} className="text-[9px] font-black text-stone-400 dark:text-zinc-500">
                      {day.substring(0, 1)}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 justify-items-center">
                  {renderGregorianDays()}
                </div>
              </div>

              {/* RIGHT COLUMN: ETHIOPIAN CALENDAR */}
              <div className="p-3 rounded-2xl bg-[#C5A059]/5 border border-[#C5A059]/15">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-widest font-black text-[#C5A059] font-mono">
                    Ethiopian Calendar (ዓ.ም)
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={prevEthMonth} 
                      className="p-1 rounded-lg hover:bg-[#C5A059]/15 transition-colors text-amber-600 dark:text-amber-400"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[11px] font-black min-w-[100px] text-center uppercase tracking-tight text-[#1E3A1A] dark:text-[#C5A059]">
                      {getEthiopianMonthName(ethMonth)} {ethYear}
                    </span>
                    <button 
                      onClick={nextEthMonth} 
                      className="p-1 rounded-lg hover:bg-[#C5A059]/15 transition-colors text-amber-600 dark:text-amber-400"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Weekday labels */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1 border-b pb-1 border-[#C5A059]/20">
                  {(lang === 'en' ? ENGLISH_WEEKDAYS : AMHARIC_WEEKDAYS).map((day) => (
                    <span key={`eth-wk-${day}`} className="text-[9px] font-black text-[#C5A059] opacity-90">
                      {lang === 'en' ? day.substring(0, 2) : day.substring(0, 1)}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 justify-items-center">
                  {renderEthiopianDays()}
                </div>
              </div>

            </div>

            {/* Sync to Today Button */}
            <div className="mt-3 text-right">
              <button
                onClick={() => {
                  const now = getEthiopianLocalTime();
                  const ethNow = toEthiopian(now);
                  setToday(now);
                  setGregYear(now.getFullYear());
                  setGregMonth(now.getMonth());
                  setEthYear(ethNow.year);
                  setEthMonth(ethNow.month);
                  setIsMaximized(false);
                }}
                className={`text-[9.5px] px-2.5 py-1.5 font-bold rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-98 ${
                  isDarkMode 
                    ? 'bg-zinc-850 border-zinc-800 hover:bg-zinc-800 text-zinc-300' 
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-[#1E3A1A]'
                }`}
              >
                {lang === 'en' ? "📅 Back to Today" : "📅 ወደ ዛሬ ተመለስ"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
