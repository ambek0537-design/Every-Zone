import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, User, Check, X, ShieldAlert, CalendarClock } from 'lucide-react';

interface BookingProps {
  listingId: string;
  listingTitle: string;
  vendorName: string;
  isDarkMode: boolean;
  onClose: () => void;
  lang: string;
  onBookSuccess: (bookingDetails: { id: string; date: string; timeSlot: string; listingTitle: string }) => void;
}

export function InAppBookingCalendar({ listingId, listingTitle, vendorName, isDarkMode, onClose, lang, onBookSuccess }: BookingProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [extraNote, setExtraNote] = useState<string>('');
  const [bookingProgress, setBookingProgress] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // June 2026 Days grid (Current date is June 18, 2026, let's offer future booking dates)
  // Let's offer June 19 to June 30 appointments
  const daysInJune = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const timeSlots = [
    "09:00 AM - 10:30 AM (ጠዋት)",
    "11:00 AM - 12:30 PM (ረፋድ)",
    "02:00 PM - 03:30 PM (ከሰዓት)",
    "04:00 PM - 05:30 PM (ደመና)"
  ];

  const handleBookingConfirm = () => {
    if (!selectedDay) {
      alert(lang === 'en' ? '⚠️ Please select a date!' : '⚠️ እባክዎ ቀጠሮ መያዝ የሚፈልጉትን ቀን ይምረጡ!');
      return;
    }
    if (!selectedTimeSlot) {
      alert(lang === 'en' ? '⚠️ Please choose an available time slot!' : '⚠️ እባክዎ ተስማሚ ሰዓት ይምረጡ!');
      return;
    }

    setBookingProgress(true);

    setTimeout(() => {
      setBookingProgress(false);
      setSuccess(true);
      const apptDetails = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        date: `June ${selectedDay}, 2026`,
        timeSlot: selectedTimeSlot,
        listingTitle: listingTitle
      };
      
      onBookSuccess(apptDetails);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className={`w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] border shadow-2xl p-5 flex flex-col space-y-4 max-h-[90%] overflow-y-auto ${
          isDarkMode 
            ? 'bg-zinc-950 border-amber-500 text-zinc-100' 
            : 'bg-[#F9F7F2] border-[#C5A059] text-stone-900'
        }`}
      >
        <div className="w-12 h-1 bg-stone-300 dark:bg-zinc-700 rounded-full mx-auto sm:hidden shrink-0" />

        <div className="flex items-center justify-between border-b pb-3 border-stone-200/50 dark:border-zinc-805/50">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-stone-800 dark:text-amber-400 font-sans">
              📅 {lang === 'en' ? 'In-App Visit Booking Scheduler' : 'ቀጠሮ መያዣ ማዕከል'}
            </h3>
            <p className="text-[9px] opacity-65 font-mono">{vendorName}</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-zinc-800 text-stone-500 dark:text-zinc-400 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 text-center space-y-3"
          >
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check size={26} className="stroke-[3]" />
            </div>
            <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest">
              {lang === 'en' ? 'REQUEST SUBMITTED!' : 'ቀጠሮዎ ተይዟል!'}
            </h4>
            <p className="text-[10px] leading-relaxed opacity-85">
              {lang === 'en' 
                ? `Your booking to inspect '${listingTitle}' on June ${selectedDay}, 2026 (${selectedTimeSlot}) is pending.` 
                : `'${listingTitle}' ለማየት ሰኔ ${selectedDay} አጥቢያ (${selectedTimeSlot}) ቀጠሮዎ በይሁንታ ተመዝግቧል።`}
            </p>
            <span className="text-[8px] font-mono opacity-50 block bg-stone-100 dark:bg-zinc-900 p-2 rounded-lg">
              🎯 Routed to Vendor Dashboard Queue. Vendor confirmation push notification dispatched.
            </span>
            <button
              onClick={onClose}
              className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold uppercase transition-all"
            >
              Close / ዝጋ
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-stone-150 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#C5A059] block">Selected Property</span>
              <div className="text-xs font-black text-stone-800 dark:text-zinc-100 truncate">{listingTitle}</div>
              <p className="text-[8.5px] opacity-60 flex items-center gap-1">
                <MapPin size={9} /> physical visit inspection protocol
              </p>
            </div>

            {/* Date Selection Wheel/Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                  📅 Select Date (June 2026):
                </label>
                {selectedDay && (
                  <span className="text-[9.5px] font-mono font-black text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded">
                    June {selectedDay} (ሰኔ {selectedDay})
                  </span>
                )}
              </div>
              <div className="grid grid-cols-6 gap-1.5 max-h-[140px] overflow-y-auto p-1 border border-stone-200/50 dark:border-zinc-800/50 rounded-2xl">
                {daysInJune.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border hover:scale-105 ${
                      selectedDay === day
                        ? (isDarkMode ? 'bg-amber-500 border-amber-500 text-zinc-950 font-black' : 'bg-[#1E3A1A] border-[#1E3A1A] text-white font-black')
                        : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-stone-200 text-stone-700')
                    }`}
                  >
                    <span className="text-[9px] tracking-tighter uppercase mb-0.5">Jun</span>
                    <span className="text-xs font-extrabold">{day}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slot picker */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                ⏰ Select Inspection Hour Slot:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2.5 rounded-xl text-[9px] text-left border flex flex-col transition-all hover:scale-[1.02] ${
                      selectedTimeSlot === slot
                        ? (isDarkMode ? 'bg-amber-500 border-amber-500 text-zinc-950 font-black' : 'bg-[#1E3A1A] border-[#1E3A1A] text-white font-black')
                        : (isDarkMode ? 'bg-zinc-90 w-100 bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-stone-200 text-stone-700')
                    }`}
                  >
                    <span className="font-extrabold">{slot.split(' (')[0]}</span>
                    <span className={`text-[7.5px] font-sans opacity-70 ${selectedTimeSlot === slot ? 'text-white' : 'text-stone-400'}`}>
                      {slot.includes('ጠዋት') ? 'Morning slot' : slot.includes('ረፋድ') ? 'Midday slot' : 'Afternoon slot'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional notes */}
            <div className="space-y-1">
              <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                📝 Visit Notes / Special Requirements:
              </label>
              <input
                type="text"
                placeholder="e.g. looking for a quiet upper apartment/commercial entry..."
                value={extraNote}
                onChange={(e) => setExtraNote(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 px-3 py-2 rounded-xl text-[10px] text-stone-800 dark:text-zinc-100 outline-none placeholder-stone-400"
              />
            </div>

            {/* Submit progress / Confirm button */}
            {bookingProgress ? (
              <div className="p-3 bg-amber-500/10 border border-dashed border-amber-500/20 text-center rounded-2xl flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent animate-spin rounded-full" />
                <span className="text-[10px] font-bold text-amber-500">Transmitting calendar slot coordinates...</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBookingConfirm}
                className="w-full py-3 bg-gradient-to-r from-[#1E3A1A] to-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
              >
                <CalendarClock size={14} /> Submit Visit Schedule Request 🚀
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
