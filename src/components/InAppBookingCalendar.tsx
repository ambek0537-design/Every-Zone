import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, User, Check, X, ShieldAlert, CalendarClock, AlertTriangle, Bell, RefreshCw, Trash2 } from 'lucide-react';

interface BookingProps {
  listingId: string;
  listingTitle: string;
  vendorName: string;
  isDarkMode: boolean;
  onClose: () => void;
  lang: string;
  onBookSuccess: (bookingDetails: { id: string; date: string; timeSlot: string; listingTitle: string }) => void;
}

interface BookingRecord {
  id: string;
  listingTitle: string;
  vendorName: string;
  date: string;
  timeSlot: string;
  reminderEnabled: boolean;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export function InAppBookingCalendar({ listingId, listingTitle, vendorName, isDarkMode, onClose, lang, onBookSuccess }: BookingProps) {
  const [activeSubTab, setActiveSubTab] = useState<'book' | 'manage'>('book');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [extraNote, setExtraNote] = useState<string>('');
  const [bookingProgress, setBookingProgress] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Rescheduling states
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDay, setNewDay] = useState<number | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState<string | null>(null);

  // Load or initialize bookings list
  const [myBookings, setMyBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('ez_my_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'APT-8112',
        listingTitle: 'Luxury Bole Modern Villa',
        vendorName: 'Bole Properties Ltd',
        date: 'June 24, 2026',
        timeSlot: '11:00 AM - 12:30 PM (ረፋድ)',
        reminderEnabled: true,
        status: 'CONFIRMED'
      },
      {
        id: 'APT-3019',
        listingTitle: 'Premium Dental Orthodontics Care',
        vendorName: 'Dr. Abdi Dental Clinic',
        date: 'June 26, 2026',
        timeSlot: '04:00 PM - 05:30 PM (ደመና)',
        reminderEnabled: false,
        status: 'PENDING'
      }
    ];
  });

  const saveBookings = (list: BookingRecord[]) => {
    setMyBookings(list);
    localStorage.setItem('ez_my_bookings', JSON.stringify(list));
  };

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
      
      const newRecord: BookingRecord = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        listingTitle: listingTitle,
        vendorName: vendorName || 'Verified Zone Partner',
        date: `June ${selectedDay}, 2026`,
        timeSlot: selectedTimeSlot,
        reminderEnabled: true,
        status: 'PENDING'
      };

      const updated = [newRecord, ...myBookings];
      saveBookings(updated);

      onBookSuccess({
        id: newRecord.id,
        date: newRecord.date,
        timeSlot: newRecord.timeSlot,
        listingTitle: newRecord.listingTitle
      });
    }, 1200);
  };

  const handleToggleReminder = (id: string) => {
    const updated = myBookings.map(b => b.id === id ? { ...b, reminderEnabled: !b.reminderEnabled } : b);
    saveBookings(updated);
  };

  const handleCancelBooking = (id: string) => {
    if (confirm(lang === 'en' ? 'Are you sure you want to cancel this booking?' : 'በእርግጥ ይህንን ቀጠሮ መሰረዝ ይፈልጋሉ?')) {
      const updated = myBookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' as const } : b);
      saveBookings(updated);
      alert(lang === 'en' ? '❌ Booking cancelled successfully.' : '❌ ቀጠሮው በተሳካ ሁኔታ ተሰርዟል።');
    }
  };

  const startReschedule = (booking: BookingRecord) => {
    setReschedulingId(booking.id);
    setNewDay(parseInt(booking.date.replace(/[^0-9]/g, '')) || 20);
    setNewTimeSlot(booking.timeSlot);
  };

  const handleSaveReschedule = () => {
    if (!newDay || !newTimeSlot) return;
    const updated = myBookings.map(b => {
      if (b.id === reschedulingId) {
        return {
          ...b,
          date: `June ${newDay}, 2026`,
          timeSlot: newTimeSlot,
          status: 'PENDING' as const
        };
      }
      return b;
    });
    saveBookings(updated);
    setReschedulingId(null);
    alert(lang === 'en' ? '🔄 Rescheduled successfully! Vendor will verify shortly.' : '🔄 ቀጠሮው ተቀይሯል! ሻጩ በቅርቡ ያረጋግጣል።');
  };

  return (
    <div className="fixed inset-0 z-55 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className={`w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border shadow-2xl p-5 flex flex-col space-y-4 max-h-[90%] overflow-y-auto ${
          isDarkMode 
            ? 'bg-zinc-950 border-amber-500 text-zinc-100' 
            : 'bg-[#F9F7F2] border-[#C5A059] text-stone-900'
        }`}
      >
        <div className="w-12 h-1 bg-stone-300 dark:bg-zinc-700 rounded-full mx-auto sm:hidden shrink-0" />

        <div className="flex items-center justify-between border-b pb-3 border-stone-200/50 dark:border-zinc-800/50">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-stone-800 dark:text-amber-400 font-sans">
              📅 {lang === 'en' ? 'Interactive Visits & Booking Scheduler' : 'ቀጠሮ መያዣና ማስተዳደሪያ ማዕከል'}
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

        {/* Sub-tabs to manage or schedule */}
        <div className="flex bg-stone-200/40 dark:bg-zinc-900/60 p-1 rounded-xl">
          <button
            onClick={() => { setActiveSubTab('book'); setSuccess(false); }}
            className={`flex-1 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
              activeSubTab === 'book'
                ? (isDarkMode ? 'bg-amber-500 text-zinc-950 shadow' : 'bg-[#1E3A1A] text-white shadow')
                : 'text-stone-500 dark:text-zinc-400'
            }`}
          >
            ✍️ {lang === 'en' ? 'Book New Visit' : 'አዲስ ቀጠሮ ያዝ'}
          </button>
          <button
            onClick={() => setActiveSubTab('manage')}
            className={`flex-1 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all relative ${
              activeSubTab === 'manage'
                ? (isDarkMode ? 'bg-amber-500 text-zinc-950 shadow' : 'bg-[#1E3A1A] text-white shadow')
                : 'text-stone-500 dark:text-zinc-400'
            }`}
          >
            💼 {lang === 'en' ? 'My Bookings' : 'የያዝኳቸው ቀጠሮዎች'}
            {myBookings.filter(b => b.status === 'PENDING').length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black animate-pulse">
                {myBookings.filter(b => b.status === 'PENDING').length}
              </span>
            )}
          </button>
        </div>

        {activeSubTab === 'book' ? (
          success ? (
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
              <div className="p-2.5 bg-stone-100 dark:bg-zinc-900 rounded-xl space-y-1">
                <span className="text-[8px] font-mono text-amber-500 block uppercase font-black">
                  🔔 Smart Reminders Activated
                </span>
                <p className="text-[9px] text-stone-500">
                  {lang === 'en' 
                    ? 'We will trigger push alerts 1 hour before scheduled time.' 
                    : 'ከቀጠሮው 1 ሰዓት አስቀድሞ የማሳሰቢያ መልዕክት ይደርስዎታል።'}
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('manage')}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold uppercase transition-all"
              >
                {lang === 'en' ? 'Go to My Bookings' : 'ወደ ቀጠሮዎች ሂድ'}
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4 text-left">
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-stone-150 dark:border-zinc-800 space-y-1 shadow-xs">
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#C5A059] block">Selected Listing</span>
                <div className="text-xs font-black text-stone-800 dark:text-zinc-100 truncate">{listingTitle}</div>
                <p className="text-[8.5px] opacity-60 flex items-center gap-1">
                  <MapPin size={9} /> physical visit inspection protocol
                </p>
              </div>

              {/* Date Selection Grid */}
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
                <div className="grid grid-cols-6 gap-1.5 max-h-[110px] overflow-y-auto p-1 border border-stone-200/50 dark:border-zinc-800/50 rounded-2xl">
                  {daysInJune.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border hover:scale-105 ${
                        selectedDay === day
                          ? (isDarkMode ? 'bg-amber-500 border-amber-500 text-zinc-950 font-black' : 'bg-[#1E3A1A] border-[#1E3A1A] text-white font-black')
                          : (isDarkMode ? 'bg-zinc-90 w-100 bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-stone-200 text-stone-700')
                      }`}
                    >
                      <span className="text-[8px] tracking-tighter uppercase mb-0.5">Jun</span>
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
                          : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-stone-200 text-stone-700')
                      }`}
                    >
                      <span className="font-extrabold">{slot.split(' (')[0]}</span>
                      <span className={`text-[7.5px] font-sans opacity-70 ${selectedTimeSlot === slot ? 'text-white' : 'text-stone-450'}`}>
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
                  placeholder="e.g. looking for a quiet upper apartment..."
                  value={extraNote}
                  onChange={(e) => setExtraNote(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 px-3 py-2 rounded-xl text-[10px] text-stone-800 dark:text-zinc-100 outline-none placeholder-stone-400"
                />
              </div>

              {/* Submit button */}
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
          )
        ) : (
          <div className="space-y-4 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              📋 {lang === 'en' ? 'Manage Scheduled Appointments' : 'ቀጠሮዎችዎን ያስተዳድሩ'}
            </h4>

            {myBookings.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                No appointments booked yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {myBookings.map((b) => (
                  <div 
                    key={b.id} 
                    className={`p-3 rounded-2xl border text-xs space-y-2.5 transition-all relative ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-mono font-bold uppercase bg-stone-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-stone-400">
                          {b.id}
                        </span>
                        <h5 className="font-extrabold text-stone-800 dark:text-stone-100 mt-1 line-clamp-1">{b.listingTitle}</h5>
                        <p className="text-[8.5px] text-stone-450">{b.vendorName}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-500/15 text-emerald-500' :
                        b.status === 'CANCELLED' ? 'bg-red-500/15 text-red-500' : 'bg-amber-500/15 text-amber-500'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-stone-50 dark:bg-zinc-950 p-2 rounded-xl border border-stone-100 dark:border-zinc-850">
                      <div className="flex items-center gap-1.5 opacity-80">
                        <Calendar size={11} className="text-amber-500" />
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-80">
                        <Clock size={11} className="text-amber-500" />
                        <span className="truncate">{b.timeSlot.split(' (')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-zinc-850">
                      {/* Reminders Toggle */}
                      <button
                        onClick={() => handleToggleReminder(b.id)}
                        className={`flex items-center gap-1.5 text-[9px] font-bold ${
                          b.reminderEnabled ? 'text-amber-500' : 'text-stone-450'
                        }`}
                        title="Toggle Alarm Reminder"
                      >
                        <Bell size={11} className={b.reminderEnabled ? "fill-amber-500/10 animate-bounce" : ""} />
                        <span>{b.reminderEnabled ? 'Reminder On (1h prior)' : 'Reminder Off'}</span>
                      </button>

                      {/* Action buttons (Reschedule / Cancel) */}
                      {b.status !== 'CANCELLED' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startReschedule(b)}
                            className="text-[9px] font-black uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg hover:bg-blue-500/20"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-[9px] font-black uppercase tracking-wider text-red-500 bg-red-500/10 p-1 rounded-lg hover:bg-red-500/20"
                            title="Cancel Booking"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Rescheduling Form Overlay inside item */}
                    {reschedulingId === b.id && (
                      <div className="absolute inset-0 bg-stone-950/95 rounded-2xl p-3 flex flex-col justify-between text-left">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                            <span className="text-[9px] font-black uppercase text-amber-500">🔄 Reschedule Appointment</span>
                            <button onClick={() => setReschedulingId(null)} className="text-stone-400">
                              <X size={12} />
                            </button>
                          </div>
                          
                          {/* Day selection */}
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] text-stone-400 uppercase font-mono">Date:</span>
                            <select 
                              value={newDay || ''} 
                              onChange={(e) => setNewDay(parseInt(e.target.value))}
                              className="bg-zinc-900 border border-zinc-800 text-xs p-1 rounded font-bold text-zinc-100 outline-none"
                            >
                              {daysInJune.map(d => (
                                <option key={d} value={d}>June {d}</option>
                              ))}
                            </select>
                          </div>

                          {/* Time selection */}
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] text-stone-400 uppercase font-mono">Slot:</span>
                            <select 
                              value={newTimeSlot || ''} 
                              onChange={(e) => setNewTimeSlot(e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 text-[10px] p-1 rounded font-bold text-zinc-100 outline-none max-w-[200px]"
                            >
                              {timeSlots.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={handleSaveReschedule}
                          className="w-full py-1.5 bg-amber-500 text-zinc-950 font-black uppercase tracking-widest text-[9px] rounded-lg mt-2 flex items-center justify-center gap-1"
                        >
                          <RefreshCw size={10} className="animate-spin-slow" /> Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveSubTab('book')}
              className="w-full py-2 border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:scale-[1.01] transition-all"
            >
              ➕ Book Another Visit
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
