import React, { useState, useEffect } from 'react';
import { 
  Flame, Award, Search, CheckCircle2, Navigation, AlertTriangle, 
  Calendar, Phone, FileText, Fingerprint, RefreshCw, Send, Download, 
  UserCheck, CreditCard, Clock, Globe, ArrowRight, Camera, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeScanner, ScanResult } from './QRCodeScanner';

interface EthiopiaPassportHubProps {
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
  lang: 'en' | 'am';
  requestCameraPermission?: (onGranted: () => void) => void;
}

interface PassportBooking {
  id: string; // EVZ-PASS-XXXX
  fullName: string;
  birthDate: string;
  nationality: string;
  faydaId: string;
  branch: string;
  urgency: 'STANDARD' | 'EXPRESS' | 'EMERGENCY';
  appointmentDate: string;
  cbeRef: string;
  price: number;
  status: 'PENDING_PAYMENT' | 'BIOMETRICS_SCHEDULED' | 'UNDER_REVIEW' | 'PRINTED_IN_TRANSIT' | 'READY_FOR_COLLECTION';
  trackingQueue: number;
  createdAt: string;
}

export function EthiopiaPassportHub({ walletBalance, setWalletBalance, isDarkMode, lang, requestCameraPermission }: EthiopiaPassportHubProps) {
  // Navigation tabs
  const [activeSubView, setActiveSubView] = useState<'schedule' | 'track' | 'faq'>('schedule');

  // Urgency-pricing matrix (Ethio Passport official approximate rates)
  // STANDARD -> 2,000 ETB
  // EXPRESS -> 5,000 ETB
  // EMERGENCY -> 8,500 ETB
  
  // Input fields for scheduling
  const [fName, setFName] = useState('');
  const [dob, setDob] = useState('1998-05-12');
  const [fId, setFId] = useState('');
  const [bookingBranch, setBookingBranch] = useState('Addis Ababa Main Office (Urael)');
  const [urgencyLevel, setUrgencyLevel] = useState<'STANDARD' | 'EXPRESS' | 'EMERGENCY'>('EXPRESS');
  const [selectedDate, setSelectedDate] = useState('2026-07-20');
  const [mobileNum, setMobileNum] = useState('+251 9');

  // QR Code Scanner Integration
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const handleScanSuccess = (result: ScanResult) => {
    if (result.type === 'FAYDA_ID') {
      if (result.data.fullName) setFName(result.data.fullName);
      if (result.data.faydaId) setFId(result.data.faydaId);
      if (result.data.birthDate) setDob(result.data.birthDate);
      alert(`✅ ${lang === 'en' ? 'Fayda ID scanned successfully!' : 'የፋይዳ ዲጂታል መታወቂያ በተሳካ ሁኔታ ተቃኝቷል!'}\n\n${lang === 'en' ? 'Name' : 'ስም'}: ${result.data.fullName}\nFayda ID: ${result.data.faydaId}\n\n${lang === 'en' ? 'Scheduling form filled automatically.' : 'የቀጠሮ ቅጹ በራስ-ሰር ተሞልቷል።'}`);
    } else if (result.type === 'PASSPORT_TICKET') {
      if (result.data.ticketId) {
        setSearchTrackingId(result.data.ticketId);
        const matched = myBookings.find(b => b.id === result.data.ticketId);
        if (matched) {
          setTrackerResult(matched);
          setActiveSubView('track');
          alert(`✅ ${lang === 'en' ? `Passport Ticket ${result.data.ticketId} scanned and loaded.` : `የፓስፖርት ቲኬት ${result.data.ticketId} ተቃኝቶ ተገኝቷል።`}`);
        } else {
          alert(`🔍 ${lang === 'en' ? `Ticket ${result.data.ticketId} scanned but not found in active bookings database. Pre-filled in search bar.` : `ቲኬት ${result.data.ticketId} ተቃኝቷል ግን በሲስተሙ ውስጥ አልተገኘም። በፍለጋ ሳጥኑ ውስጥ ተሞልቷል።`}`);
        }
      }
    } else {
      alert(`⚠️ ${lang === 'en' ? `Scanned code of type: ${result.type}. This QR code is meant for the Wallet Hub. Please open the Wallet & Payments Hub to scan payment codes.` : `የተቃኘው ኮድ አይነት፡ ${result.type} ነው። ይህ QR ኮድ ለኪስ ቦርሳ (Wallet Hub) የተዘጋጀ ነው። እባክዎ ክፍያ ለመፈጸም የክፍያ ገጹን ይክፈቱ።`}`);
    }
  };

  // Search/Tracker state
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [trackerResult, setTrackerResult] = useState<PassportBooking | null>(null);

  // Database seed
  const [myBookings, setMyBookings] = useState<PassportBooking[]>(() => {
    const saved = localStorage.getItem('ez_passport_bookings');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'EVZ-PASS-9403',
        fullName: 'Abebech Kassa',
        birthDate: '1995-11-20',
        nationality: 'Ethiopian',
        faydaId: 'FAY-8840294-ET',
        branch: 'Addis Ababa Main Office (Urael)',
        urgency: 'EXPRESS',
        appointmentDate: '2026-06-25',
        cbeRef: 'CBE-DEP-773010',
        price: 5000,
        status: 'BIOMETRICS_SCHEDULED',
        trackingQueue: 142,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: 'EVZ-PASS-1024',
        fullName: 'Amare Mekonnen',
        birthDate: '1992-04-03',
        nationality: 'Ethiopian',
        faydaId: 'FAY-1102930-ET',
        branch: 'Adama Branch Office',
        urgency: 'STANDARD',
        appointmentDate: '2026-07-15',
        cbeRef: 'CBE-DEP-110293',
        price: 2000,
        status: 'PENDING_PAYMENT',
        trackingQueue: 885,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ];
  });

  // Save states
  useEffect(() => {
    localStorage.setItem('ez_passport_bookings', JSON.stringify(myBookings));
  }, [myBookings]);

  // Offline State Tracking and Auto Sync
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  const forceProcessQueue = () => {
    localStorage.setItem('ez_simulated_offline', 'false');
    window.dispatchEvent(new Event('ez_network_change'));
    alert('🔌 Network simulation set to ONLINE! Processing queued passport scans...');
  };

  useEffect(() => {
    const checkQueue = () => {
      try {
        const saved = localStorage.getItem('ez_queued_scans');
        if (saved) {
          const queue = JSON.parse(saved);
          const passportScans = queue.filter((item: any) => 
            item.type === 'FAYDA_ID' || item.type === 'PASSPORT_TICKET'
          );
          setOfflineQueueCount(passportScans.length);
        } else {
          setOfflineQueueCount(0);
        }
      } catch (e) {
        setOfflineQueueCount(0);
      }
    };

    checkQueue();
    window.addEventListener('storage', checkQueue);
    window.addEventListener('online', checkQueue);
    window.addEventListener('ez_network_change', checkQueue);

    const interval = setInterval(checkQueue, 2500);

    return () => {
      window.removeEventListener('storage', checkQueue);
      window.removeEventListener('online', checkQueue);
      window.removeEventListener('ez_network_change', checkQueue);
      clearInterval(interval);
    };
  }, []);

  // Automatic processing of offline queued passport scans
  useEffect(() => {
    const processQueuedPassportScans = () => {
      // Check if we are online (neither browser offline nor simulated offline)
      const isSimulatedOffline = localStorage.getItem('ez_simulated_offline') === 'true';
      const isOnline = navigator.onLine && !isSimulatedOffline;
      if (!isOnline) return;

      const saved = localStorage.getItem('ez_queued_scans');
      if (!saved) return;

      try {
        const queue = JSON.parse(saved);
        if (queue.length === 0) return;

        // Find the first passport scan (FAYDA_ID or PASSPORT_TICKET)
        const targetIndex = queue.findIndex((item: any) => 
          item.type === 'FAYDA_ID' || item.type === 'PASSPORT_TICKET'
        );

        if (targetIndex !== -1) {
          const item = queue[targetIndex];
          
          // Remove from queue first to prevent loops
          const updatedQueue = [...queue];
          updatedQueue.splice(targetIndex, 1);
          localStorage.setItem('ez_queued_scans', JSON.stringify(updatedQueue));

          // Trigger processing with a delay so UI loads nicely
          setTimeout(() => {
            handleScanSuccess({
              type: item.type,
              data: item.data
            });
          }, 800);
        }
      } catch (err) {
        console.error("Failed to process queued passport scans:", err);
      }
    };

    processQueuedPassportScans();

    window.addEventListener('online', processQueuedPassportScans);
    window.addEventListener('ez_network_change', processQueuedPassportScans);

    return () => {
      window.removeEventListener('online', processQueuedPassportScans);
      window.removeEventListener('ez_network_change', processQueuedPassportScans);
    };
  }, [lang, myBookings]);

  const getPrice = (urg: 'STANDARD' | 'EXPRESS' | 'EMERGENCY') => {
    if (urg === 'STANDARD') return 2000;
    if (urg === 'EXPRESS') return 5000;
    return 8500;
  };

  const currentPrice = getPrice(urgencyLevel);

  // Handle schedule creation
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim()) {
      alert('⚠️ Full Legal Name is required to match passport data.');
      return;
    }
    if (fId.length < 6) {
      alert('⚠️ Fayda (National Digital ID) is missing or invalid. Please verify.');
      return;
    }

    if (walletBalance < currentPrice) {
      alert(`❌ Funds Insufficient: Passport allocation (${urgencyLevel}) requires ${currentPrice.toLocaleString()} ETB but your wallet balance is ${walletBalance.toLocaleString()} ETB. Please top up first.`);
      return;
    }

    // Deduct
    setWalletBalance(prev => prev - currentPrice);

    const bookingId = 'EVZ-PASS-' + Math.floor(1000 + Math.random() * 9000);
    const mockRef = `CBE-PASS-${Math.floor(100000 + Math.random() * 900000)}`;

    const nextBooking: PassportBooking = {
      id: bookingId,
      fullName: fName,
      birthDate: dob,
      nationality: 'Ethiopian',
      faydaId: fId,
      branch: bookingBranch,
      urgency: urgencyLevel,
      appointmentDate: selectedDate,
      cbeRef: mockRef,
      price: currentPrice,
      status: 'BIOMETRICS_SCHEDULED',
      trackingQueue: Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString()
    };

    setMyBookings(prev => [nextBooking, ...prev]);

    // Reset fields
    setFName('');
    setFId('');

    // Trigger feedback
    alert(`🎉 Passport Appointment Scheduled!\n\nID: ${bookingId}\nUrgency: ${urgencyLevel}\nBranch: ${bookingBranch}\nDate: ${selectedDate}\n\n${currentPrice.toLocaleString()} ETB has been locked through safe escrow. Print receipt below to bring to the immigration office.`);
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTrackingId.trim().toUpperCase();
    if (!query) return;

    const matched = myBookings.find(b => b.id === query || b.cbeRef.toUpperCase() === query || b.faydaId.toUpperCase() === query);
    if (matched) {
      setTrackerResult(matched);
    } else {
      setTrackerResult(null);
      alert('🔍 Ticket / Reference Not Found. Verify ID prefix (e.g. EVZ-PASS-9403).');
    }
  };

  const getStatusColorBadge = (status: PassportBooking['status']) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 'bg-amber-100 text-amber-700 border border-amber-250';
      case 'BIOMETRICS_SCHEDULED': return 'bg-sky-100 text-sky-700 border border-sky-250';
      case 'UNDER_REVIEW': return 'bg-purple-100 text-purple-700 border border-purple-250';
      case 'PRINTED_IN_TRANSIT': return 'bg-blue-100 text-blue-700 border border-blue-250';
      case 'READY_FOR_COLLECTION': return 'bg-emerald-100 text-emerald-705 border border-emerald-250 font-black animate-pulse';
    }
  };

  return (
    <div className={`border p-4 rounded-3xl shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
      
      {/* HEADER TILE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-[#1E3A1A]/10 text-[#1E3A1A]'}`}>
            <Globe size={20} className="animate-spin text-[#C5A059]" style={{ animationDuration: '15s' }} />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#C5A059] block">✈️ National Passport Queue Booker</span>
            <h2 className="text-sm font-bold font-sans">
              {lang === 'en' ? 'Ethiopia Passport Express Placement Agency' : 'የኢትዮጵያ ፓስፖርት ፈጣን ቀጠሮና መግቢያ'}
            </h2>
          </div>
        </div>

        {/* Tracker Badge */}
        <div className="text-[9.5px] bg-red-105 border border-red-200/50 text-red-700 rounded-lg px-2.5 py-1.5 font-bold uppercase tracking-wide flex items-center gap-1">
          <Flame size={11} className="text-red-650 animate-bounce" /> 
          {lang === 'en' ? 'Direct Queue Access' : 'ትኩስ ቀጠሮ ማስቀመጫ'}
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={`p-2.5 rounded-2xl border text-center ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-100'}`}>
          <span className="text-[8.5px] font-bold uppercase tracking-tight text-stone-400">Total Booked</span>
          <span className="text-sm font-black text-[#C5A059] block mt-0.5">{myBookings.length} Active</span>
        </div>
        <div className={`p-2.5 rounded-2xl border text-center ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-100'}`}>
          <span className="text-[8.5px] font-bold uppercase tracking-tight text-stone-400">Next Slot Open</span>
          <span className="text-[10px] font-black text-emerald-600 block mt-1 uppercase">Today/Tommorrow</span>
        </div>
        <div className={`p-2.5 rounded-2xl border text-center ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-100'}`}>
          <span className="text-[8.5px] font-bold uppercase tracking-tight text-stone-400">Verified System</span>
          <span className="text-[10px] font-black text-sky-500 block mt-1 uppercase">Fayda Active</span>
        </div>
      </div>

      {/* SUB MENU NAVIGATION */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-3 border-b border-stone-100 dark:border-zinc-850" style={{ scrollbarWidth: 'none' }}>
        <button 
          onClick={() => setActiveSubView('schedule')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${activeSubView === 'schedule' ? (isDarkMode ? 'bg-amber-400 text-zinc-950' : 'bg-[#1E3A1A] text-white') : 'bg-stone-100 dark:bg-zinc-850 text-stone-500 hover:text-stone-700'}`}
        >
          📅 Schedule Appointment
        </button>
        <button 
          onClick={() => setActiveSubView('track')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${activeSubView === 'track' ? (isDarkMode ? 'bg-amber-400 text-zinc-950' : 'bg-[#1E3A1A] text-white') : 'bg-stone-100 dark:bg-zinc-850 text-stone-500 hover:text-stone-700'}`}
        >
          🔍 Tracking Board
        </button>
        <button 
          onClick={() => setActiveSubView('faq')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${activeSubView === 'faq' ? (isDarkMode ? 'bg-amber-400 text-zinc-950' : 'bg-[#1E3A1A] text-white') : 'bg-stone-100 dark:bg-zinc-850 text-stone-500 hover:text-stone-700'}`}
        >
          📖 Regulations & FAQ
        </button>
      </div>

      {/* CORE ACTIVE WORKFLOW STAGE */}
      <AnimatePresence mode="wait">
        
        {/* SCHEDULE FORM VIEW */}
        {activeSubView === 'schedule' && (
          <motion.form 
            key="schedule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleCreateBooking}
            className="space-y-3 font-sans text-xs"
          >
            {/* OFFLINE QUEUED PASSPORT SCANS ALERT */}
            {offlineQueueCount > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-600 font-sans">
                <div className="flex gap-2 items-center">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 shrink-0 animate-bounce">
                    <QrCode size={16} />
                  </div>
                  <div>
                    <span className="font-extrabold uppercase tracking-wider block">
                      {lang === 'en' ? '📥 Offline Passport/Fayda Scans Queued' : '📥 ከመስመር ውጭ የተቃኙ የፓስፖርት መዝገቦች አሉ'}
                    </span>
                    <p className="text-[10px] opacity-80 leading-normal">
                      {lang === 'en'
                        ? `You have ${offlineQueueCount} Fayda ID or Ticket scans cached locally. They will auto-fill your forms once online.`
                        : `${offlineQueueCount} ከመስመር ውጭ የተቃኙ የፋይዳ/ቲኬት መረጃዎች ተቀምጠዋል። መስመር ላይ ሲሆኑ ፎርሙን በራስ-ሰር ይሞላሉ።`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={forceProcessQueue}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold uppercase text-[9px] rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  {lang === 'en' ? 'Force Sync Now' : 'አሁን አስተላልፍ'}
                </button>
              </div>
            )}

            {/* FAST FILL SCAN BANNER */}
            <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isDarkMode ? 'bg-[#C5A059]/10 border-[#C5A059]/20' : 'bg-[#FAF9F6] border-[#C5A059]/30'
            }`}>
              <div className="flex gap-2.5 items-start">
                <div className="p-2 rounded-xl bg-amber-500/10 text-[#C5A059] border border-[#C5A059]/20 shrink-0">
                  <QrCode size={18} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] block">
                    {lang === 'en' ? '⚡ Biometric Auto-Fill Available' : '⚡ ፈጣን የቅጽ መሙያ ካሜራ'}
                  </span>
                  <p className="text-[9.5px] opacity-75 leading-normal">
                    {lang === 'en' 
                      ? 'Have a physical Fayda ID card? Scan with Every-zone camera to fill legal data instantly.' 
                      : 'የፋይዳ ዲጂታል መታወቂያ ካልዎት፣ ካሜራ በመጠቀም ቅጹን በፍጥነት በራስ-ሰር መሙላት ይችላሉ።'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (requestCameraPermission) {
                    requestCameraPermission(() => setIsScannerOpen(true));
                  } else {
                    setIsScannerOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-[#1E3A1A] hover:bg-[#1E3A1A]/90 text-white font-bold text-[10px] uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
              >
                <Camera size={12} />
                {lang === 'en' ? 'Scan Fayda ID' : 'መታወቂያ ይቃኙ'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* LEGAL NAME */}
              <div>
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-stone-400">Full Legal Name (as displays in ID)</label>
                <input 
                  type="text"
                  required
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  placeholder="E.g. Selamawit Tolossa"
                  className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                />
              </div>

              {/* FAYDA ID */}
              <div>
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-stone-400">National Fayda Digital ID Number</label>
                <div className="relative mt-1">
                  <Fingerprint size={14} className="absolute left-3 top-2.5 text-[#C5A059]" />
                  <input 
                    type="text"
                    required
                    value={fId}
                    onChange={(e) => setFId(e.target.value)}
                    placeholder="E.g. FAY-19403810-ET"
                    className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* BIRTH DATE */}
              <div>
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-stone-400">Date of Birth</label>
                <input 
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                />
              </div>

              {/* TELEPHONE */}
              <div>
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-stone-400">Mobile Phone Line (SMS alerts)</label>
                <div className="relative mt-1">
                  <Phone size={14} className="absolute left-3 top-2.5 text-stone-400" />
                  <input 
                    type="text"
                    required
                    value={mobileNum}
                    onChange={(e) => setMobileNum(e.target.value)}
                    placeholder="+251 911..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* SERVICE CENTER BRANCH */}
              <div>
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-stone-400">Select Service Center Branch</label>
                <select
                  value={bookingBranch}
                  onChange={(e) => setBookingBranch(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-white dark:bg-zinc-910 border border-stone-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                >
                  <option value="Addis Ababa Main Office (Urael)">Addis Ababa Head Office (Urael)</option>
                  <option value="Awassa Regional Center">Awassa Regional Center (አዋሳ)</option>
                  <option value="Dire Dawa Airport Branch">Dire Dawa Center (ድሬዳዋ)</option>
                  <option value="Bahir Dar Main Regional Hub">Bahir Dar Hub (ባህር ዳር)</option>
                </select>
              </div>

              {/* URGENCY SPEED CATEGORY */}
              <div>
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-stone-400">Urgency Level & Tiering</label>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {(['STANDARD', 'EXPRESS', 'EMERGENCY'] as const).map(urg => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setUrgencyLevel(urg)}
                      className={`py-1 rounded-lg border text-[9px] font-black transition-all ${urgencyLevel === urg ? 'bg-[#1E3A1A] text-white border-[#1E3A1A]' : 'bg-stone-50 dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-600 hover:bg-stone-100'}`}
                    >
                      {urg === 'STANDARD' ? '⏳ Standard' : urg === 'EXPRESS' ? '⚡ Express' : '🔥 Emergency'}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHOSEN DATE */}
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-[#C5A059] block mb-1">Pick Appointment Booking Date</label>
                <input 
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-1.5 font-bold text-[#1E3A1A] font-mono bg-[#FAF9F6] border border-[#C5A059]/40 rounded-xl focus:outline-none"
                />
              </div>

            </div>

            {/* LIVE PRICE SUMMARY TILE */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs mt-3 ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-sky-50/50 border-sky-100'}`}>
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold block">Passport Fee Total:</span>
                  <span className="text-[10px] text-stone-450 uppercase leading-none font-bold">
                    {urgencyLevel === 'STANDARD' ? 'Takes 30-45 Days (2000 ETB)' : urgencyLevel === 'EXPRESS' ? 'Takes 7-10 Days (5000 ETB)' : 'Takes 48 Hours Express (8500 ETB)'}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono font-black text-emerald-700 text-sm">
                {currentPrice.toLocaleString()} ETB
              </div>
            </div>

            {/* SEND BUTTON */}
            <button
              type="submit"
              className="w-full mt-2 py-2 bg-gradient-to-r from-[#1E3A1A] to-emerald-800 text-white font-bold rounded-xl text-xs transition-all shadow-md hover:scale-[1.01]"
            >
              💼 Reserve Queue Appointment Slot ({currentPrice.toLocaleString()} ETB Escrow)
            </button>
          </motion.form>
        )}

        {/* TRACKING BOARD VIEW */}
        {activeSubView === 'track' && (
          <motion.div 
            key="track"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* SEARCH BOX FOR TRACKING */}
            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input 
                type="text"
                required
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                placeholder="Enter Ticket (EVZ-PASS-9403) or Fayda ID..."
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl focus:outline-none uppercase"
              />
              <button 
                type="button"
                onClick={() => {
                  if (requestCameraPermission) {
                    requestCameraPermission(() => setIsScannerOpen(true));
                  } else {
                    setIsScannerOpen(true);
                  }
                }}
                className="px-3 bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-500 hover:text-stone-700 dark:text-zinc-300 rounded-xl shrink-0 border border-stone-200 dark:border-zinc-705 flex items-center justify-center gap-1 cursor-pointer"
                title="Scan Ticket Barcode"
              >
                <Camera size={13} />
                <span className="text-[10px] font-bold hidden sm:inline">Scan QR</span>
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-[#1E3A1A] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Search size={12} /> Find
              </button>
            </form>

            {/* MATCHED TRACKER DISPLAY */}
            {trackerResult ? (
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/20 border-zinc-800' : 'bg-white border-stone-200'}`}>
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-black font-serif text-[#C5A059]">{trackerResult.id}</span>
                    <h3 className="text-xs font-bold font-sans mt-0.5">{trackerResult.fullName}</h3>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${getStatusColorBadge(trackerResult.status)}`}>
                    {trackerResult.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* DETAILED TIMELINE STATS CARDS */}
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div>
                    <span className="text-stone-400 text-[9px] uppercase font-bold tracking-tight block">Assigned Branch Office</span>
                    <span className="font-extrabold text-stone-850 dark:text-zinc-200">{trackerResult.branch}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[9px] uppercase font-bold tracking-tight block">Appointment Date</span>
                    <span className="font-extrabold text-[#1E3A1A] dark:text-amber-400 font-mono">{trackerResult.appointmentDate}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[9px] uppercase font-bold tracking-tight block">Immigration Queue Number</span>
                    <span className="font-extrabold text-blue-600 font-mono">#{trackerResult.trackingQueue} ETB</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[9px] uppercase font-bold tracking-tight block">Payment Reference</span>
                    <span className="font-extrabold text-emerald-600 font-mono">{trackerResult.cbeRef}</span>
                  </div>
                </div>

                {/* VISUAL PROCESS TIMELINE */}
                <div className="border border-stone-150 rounded-xl p-2.5 mt-2 text-[10px] space-y-1.5 bg-stone-50/50 dark:bg-zinc-950/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-stone-400">Step 1: CBE Passport Fee Matching Escrow (Verified Success)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${trackerResult.status !== 'PENDING_PAYMENT' ? 'bg-emerald-500' : 'bg-stone-300'}`}></div>
                    <span className={trackerResult.status !== 'PENDING_PAYMENT' ? 'text-stone-700 dark:text-zinc-300 font-bold' : 'text-stone-400'}>
                      Step 2: Biometrics Capturing Appointment Reservation (Locked for {trackerResult.appointmentDate})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                    <span className="text-stone-400">Step 3: Document Validation & Immigration Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                    <span className="text-stone-400">Step 4: Transit from Printworks Printing Facility</span>
                  </div>
                </div>
              </div>
            ) : (
              // DEFAULT LIST RENDER OF ALL PAST BOOKINGS FOR CONVENIENCE
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">My Registered Appointment Queue Passes ({myBookings.length})</span>
                {myBookings.map(b => (
                  <div 
                    key={b.id} 
                    onClick={() => setTrackerResult(b)}
                    className={`p-2.5 rounded-2xl border text-xs cursor-pointer flex justify-between items-center transition-all ${isDarkMode ? 'bg-zinc-950/30 border-zinc-850 hover:border-amber-400' : 'bg-[#FAF9F6] border-stone-200 hover:border-[#1E3A1A]'}`}
                  >
                    <div>
                      <span className="font-extrabold text-[#C5A059] block font-serif text-[10px]">{b.id}</span>
                      <span className="font-bold">{b.fullName}</span>
                      <p className="text-[9.5px] mt-0.5 text-stone-400">{b.branch} • {b.appointmentDate}</p>
                    </div>

                    <div className="text-right">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${getStatusColorBadge(b.status)}`}>
                        {b.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10.5px] font-extrabold font-mono text-zinc-700 dark:text-zinc-300 block mt-1">{b.price.toLocaleString()} ETB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* QUESTIONS FAQS VIEW */}
        {activeSubView === 'faq' && (
          <motion.div 
            key="faq"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3 font-sans text-xs"
          >
            <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-stone-50 border-stone-150'}`}>
              <h3 className="font-extrabold text-stone-800 dark:text-zinc-200 mb-1">📋 What documents do I need to bring 2 my biometric appointment?</h3>
              <p className="text-stone-500 leading-normal">
                You must bring your original Fayda National Digital ID card, 2 certified passport-size photos with white backdrops, and the Every-Zone digital biometric reservation queue pass coupon.
              </p>
            </div>

            <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-stone-50 border-stone-150'}`}>
              <h3 className="font-extrabold text-stone-800 dark:text-zinc-200 mb-1">💸 How do refunds work if I miss my emergency appointment date?</h3>
              <p className="text-stone-500 leading-normal">
                Passport booking fees are securely escrowed. If you register a missed slot ticket or request a cancellation, funds are released and refunded back to your Every-Zone balance instantly less a nominal 5% administrative queue processing penalty.
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <QRCodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        lang={lang}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
