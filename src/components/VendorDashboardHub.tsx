import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, TrendingUp, Users, Eye, Play, DollarSign, Wallet, ArrowDownCircle,
  Clock, CheckCircle2, MessageSquare, ToggleLeft, ToggleRight, Calendar, AlertTriangle,
  RefreshCw, Landmark, CreditCard, ArrowRight, Check, X, ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface VendorDashboardHubProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  onClose: () => void;
}

export function VendorDashboardHub({
  isDarkMode,
  lang,
  walletBalance,
  setWalletBalance,
  triggerPushNotification,
  onClose
}: VendorDashboardHubProps) {
  // Stats
  const [todaySales, setTodaySales] = useState(14500);
  const [weeklySales, setWeeklySales] = useState(94200);
  const [vendorBalance, setVendorBalance] = useState(() => {
    const saved = localStorage.getItem('ez_vendor_wallet_balance');
    return saved ? parseFloat(saved) : 154000;
  });
  const [productViews, setProductViews] = useState(1420);
  const [videoViews, setVideoViews] = useState(4820);
  const [followersCount, setFollowersCount] = useState(2450);

  // Vacation Mode state
  const [isVacationMode, setIsVacationMode] = useState(() => {
    return localStorage.getItem('ez_vendor_vacation_active') === 'true';
  });
  const [vacationReturnDate, setVacationReturnDate] = useState(() => {
    return localStorage.getItem('ez_vendor_vacation_return') || '2026-07-25';
  });

  // Withdrawal modal state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawChannel, setWithdrawChannel] = useState<'CBE' | 'TELEBIRR' | 'CHAPA'>('TELEBIRR');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('5000');
  const [withdrawStep, setWithdrawStep] = useState<'idle' | 'processing' | 'verifying' | 'completed'>('idle');
  const [withdrawPhone, setWithdrawPhone] = useState('0911223344');
  const [withdrawAccount, setWithdrawAccount] = useState('1000234192452');

  // Pending orders state
  const [pendingOrders, setPendingOrders] = useState([
    { id: 'EZ-ORD-9211', title: 'Luxury Habesha Makeda Kemis', qty: 1, total: 4200, status: 'CONFIRMED', buyer: 'Selamawit T.', date: '3 hours ago' },
    { id: 'EZ-ORD-8842', title: 'Organic Yirgacheffe Specialty (2kg)', qty: 2, total: 1100, status: 'CONFIRMED', buyer: 'Kidus A.', date: '1 day ago' },
    { id: 'EZ-ORD-4912', title: 'Zewditu Genuine Leather Handbag', qty: 1, total: 3200, status: 'PACKED', buyer: 'Tsige H.', date: '2 days ago' }
  ]);

  // Messages state
  const [vendorMessages, setVendorMessages] = useState([
    { id: 'msg-1', sender: 'Selamawit Tekle', preview: 'Can I get the Habesha Dress custom tailored in size XL?', date: '10 mins ago', unread: true },
    { id: 'msg-2', sender: 'Kidus Abera', preview: 'Is the Yirgacheffe medium roast currently in stock?', date: '1 hour ago', unread: false },
    { id: 'msg-3', sender: 'Tsige Haile', preview: 'Received my parcel! Excellent leather quality, thank you.', date: 'Yesterday', unread: false }
  ]);

  // Mock charts data
  const revenueData = [
    { name: 'Mon', sales: 12000, views: 320 },
    { name: 'Tue', sales: 19000, views: 410 },
    { name: 'Wed', sales: 14500, views: 420 },
    { name: 'Thu', sales: 22000, views: 510 },
    { name: 'Fri', sales: 26000, views: 650 },
    { name: 'Sat', sales: 31000, views: 720 },
    { name: 'Sun', sales: 24500, views: 590 },
  ];

  const followersAnalytics = [
    { name: 'Mon', count: 2310 },
    { name: 'Tue', count: 2340 },
    { name: 'Wed', count: 2380 },
    { name: 'Thu', count: 2410 },
    { name: 'Fri', count: 2435 },
    { name: 'Sat', count: 2445 },
    { name: 'Sun', count: 2450 },
  ];

  useEffect(() => {
    localStorage.setItem('ez_vendor_wallet_balance', vendorBalance.toString());
  }, [vendorBalance]);

  const handleToggleVacationMode = () => {
    const nextState = !isVacationMode;
    setIsVacationMode(nextState);
    localStorage.setItem('ez_vendor_vacation_active', nextState ? 'true' : 'false');
    localStorage.setItem('ez_vendor_vacation_return', vacationReturnDate);

    triggerPushNotification(
      nextState ? '🌴 Vacation Mode Active' : '🏬 Store Re-Opened!',
      nextState 
        ? `Your store is temporarily closed. Buyers will see return date: ${vacationReturnDate}.`
        : `Welcome back! Your store and messaging are now fully operational.`,
      '🌴',
      'vendor'
    );
  };

  const handleUpdateReturnDate = (date: string) => {
    setVacationReturnDate(date);
    localStorage.setItem('ez_vendor_vacation_return', date);
  };

  const handleShipOrder = (orderId: string) => {
    setPendingOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'SHIPPED' } : o));
    triggerPushNotification(
      '📦 Order Shipped!',
      `Order ${orderId} has been successfully marked as Shipped. Dispatch courier dispatched.`,
      '📦',
      'vendor'
    );
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert(lang === 'en' ? 'Please enter a valid amount' : 'እባክዎ ትክክለኛ የብር መጠን ያስገቡ');
      return;
    }
    if (amount > vendorBalance) {
      alert(lang === 'en' ? 'Insufficient balance in Vendor wallet' : 'የሻጭ ቦርሳዎ ውስጥ በቂ ቀሪ ሂሳብ የለም');
      return;
    }

    setWithdrawStep('processing');
    
    // Simulate multi-step NPS (National Payment System) settlement clearance
    setTimeout(() => {
      setWithdrawStep('verifying');
      
      setTimeout(() => {
        setVendorBalance(prev => prev - amount);
        setWalletBalance(prev => prev + amount); // Simulating CBE transfer into personal wallet
        setWithdrawStep('completed');
        
        triggerPushNotification(
          lang === 'en' ? '💸 Payout Settled Successfully!' : '💸 የክፍያ ስረዛ በተሳካ ሁኔታ ተጠናቋል!',
          lang === 'en' 
            ? `Transferred ${amount.toLocaleString()} ETB to your verified ${withdrawChannel} account.`
            : `${amount.toLocaleString()} ETB ወደ እርስዎ የተረጋገጠ የ${withdrawChannel} ሂሳብ ተላልፏል።`,
          '💸',
          'vendor'
        );
      }, 1800);
    }, 1500);
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-stone-900'}`}>
      
      {/* Title block */}
      <div className="flex justify-between items-center border-b border-stone-200/85 pb-4 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-black tracking-wider uppercase text-amber-500 flex items-center gap-2">
            <BarChart3 className="text-amber-500 animate-pulse" size={18} />
            {lang === 'en' ? 'Every-zone Merchant Console' : 'የኤቭሪ-ዞን የነጋዴ ዳሽቦርድ'}
          </h2>
          <p className="text-[10px] opacity-65 tracking-wide">
            {lang === 'en' ? 'High-Performance Store Analytics & Core B2B Settlement Gateways' : 'ከፍተኛ አፈፃፀም ያለው የሱቅ ማዘዣና ክፍያዎችን መቆጣጠሪያ ማዕከል'}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850' : 'bg-white border-stone-200 hover:bg-stone-50'
          }`}
        >
          {lang === 'en' ? 'Exit Dashboard' : 'ዳሽቦርዱን ዝጋ'}
        </button>
      </div>

      {/* Vacation mode banner */}
      {isVacationMode && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-left items-start animate-fade-in text-xs">
          <span className="text-xl">🌴</span>
          <div className="space-y-1">
            <h4 className="font-extrabold text-amber-500 uppercase tracking-wider text-[11px]">
              {lang === 'en' ? '🌴 Vacation Mode Active' : '🌴 የእረፍት ሁኔታ በርቷል'}
            </h4>
            <p className="text-stone-400">
              {lang === 'en' 
                ? `Your store profile displays "Store temporarily closed" to buyers. Message and call features are disabled until your scheduled return date:` 
                : `ሱቅዎ ለደንበኞች ጊዜያዊ ዝግ መሆኑን ያሳያል። መልዕክትና ስልክ አገልግሎት እስከሚመለሱበት ቀን ድረስ ዝግ ነው፡`}
            </p>
            <span className="inline-block font-mono font-black text-amber-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {vacationReturnDate}
            </span>
          </div>
        </div>
      )}

      {/* Metrics Row Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Today sales */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'} shadow-xs text-left`}>
          <span className="text-stone-450 block text-[9px] uppercase font-black tracking-widest font-mono">Today's Sales</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-black font-mono text-emerald-500">ETB {todaySales.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-mono mt-1 block font-semibold">📈 +12% from yesterday</span>
        </div>

        {/* Weekly sales */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'} shadow-xs text-left`}>
          <span className="text-stone-450 block text-[9px] uppercase font-black tracking-widest font-mono">Weekly Sales</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-black font-mono">ETB {weeklySales.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-mono mt-1 block font-semibold">📈 +4.8% this week</span>
        </div>

        {/* Wallet Balance */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-amber-500/30' : 'bg-white border-amber-500/25'} shadow-xs text-left bg-gradient-to-br from-amber-500/[0.02] to-transparent`}>
          <span className="text-stone-450 block text-[9px] uppercase font-black tracking-widest font-mono text-amber-500">Wallet Balance</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-black font-mono text-amber-500">ETB {vendorBalance.toLocaleString()}</span>
          </div>
          <button
            onClick={() => {
              setWithdrawAmount(Math.min(10000, vendorBalance).toString());
              setWithdrawStep('idle');
              setIsWithdrawOpen(true);
            }}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[10px] uppercase py-1.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            <ArrowDownCircle size={12} />
            {lang === 'en' ? 'Withdraw Funds' : 'ገንዘብ አውጣ'}
          </button>
        </div>

        {/* Views */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'} shadow-xs text-left`}>
          <span className="text-stone-450 block text-[9px] uppercase font-black tracking-widest font-mono">Views & Followers</span>
          <div className="space-y-1 mt-1.5 text-xs">
            <div className="flex justify-between items-center font-mono font-medium">
              <span className="text-stone-400">Products</span>
              <span className="font-bold">{productViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center font-mono font-medium">
              <span className="text-stone-400">Videos</span>
              <span className="font-bold text-amber-500">{videoViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center font-mono font-medium">
              <span className="text-stone-400">Followers</span>
              <span className="font-bold text-emerald-400">{followersCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Graph Using Recharts */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'} text-left`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <TrendingUp size={13} className="text-emerald-500" />
              Store Revenue Pipeline
            </h3>
            <p className="text-[9px] opacity-60">Visual weekly sales and customer product engagement tracking</p>
          </div>
        </div>

        <div className="h-52 w-full font-mono text-[9px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#e7e5e4'} />
              <XAxis dataKey="name" stroke="#888888" tickLine={false} />
              <YAxis stroke="#888888" tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#09090b' : '#ffffff', 
                  borderColor: isDarkMode ? '#27272a' : '#e7e5e4',
                  borderRadius: '12px',
                  color: isDarkMode ? '#f4f4f5' : '#1c1917'
                }} 
              />
              <Area type="monotone" dataKey="sales" name="Sales (ETB)" stroke="#22c55e" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Double Column Area: Orders & Messaging */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pending Orders with Live Amazon Stepper Tracking */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'} text-left space-y-4`}>
          <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-850 pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Clock size={13} className="text-amber-500" />
              Pending Fulfillment Orders ({pendingOrders.length})
            </h3>
            <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Escrow Protection
            </span>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {pendingOrders.map(order => (
              <div key={order.id} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50 border-stone-200'} space-y-2`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-400 block">{order.id}</span>
                    <span className="text-xs font-bold text-stone-200 block">{order.title}</span>
                    <span className="text-[10px] text-stone-450">Buyer: {order.buyer} • {order.date}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-500">ETB {order.total.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-200/50 dark:border-zinc-850/50">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    order.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400' :
                    order.status === 'PACKED' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {order.status}
                  </span>
                  
                  {order.status !== 'SHIPPED' && (
                    <button
                      onClick={() => handleShipOrder(order.id)}
                      className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[9px] uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1"
                    >
                      <ArrowRight size={10} />
                      {lang === 'en' ? 'Ship Order' : 'ትዕዛዙን ላክ'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messaging Box */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'} text-left space-y-4`}>
          <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-850 pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <MessageSquare size={13} className="text-[#D4AF37]" />
              Inbox & Customer Chats ({vendorMessages.length})
            </h3>
            <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-mono font-black animate-pulse">
              1 Active Chat
            </span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {vendorMessages.map(msg => (
              <div
                key={msg.id}
                onClick={() => {
                  alert(`Starting secure escrow encrypted chat route to ${msg.sender}.`);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  msg.unread 
                    ? (isDarkMode ? 'bg-amber-500/[0.02] border-amber-500/35' : 'bg-amber-50 border-amber-200/50') 
                    : (isDarkMode ? 'bg-zinc-950 border-zinc-850 hover:bg-zinc-900' : 'bg-stone-50 border-stone-200 hover:bg-stone-100')
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    {msg.unread && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />}
                    {msg.sender}
                  </span>
                  <span className="text-[8px] font-mono text-stone-450">{msg.date}</span>
                </div>
                <p className="text-[10px] text-stone-450 mt-1 line-clamp-1 leading-normal font-sans">{msg.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vacation mode configuration widget */}
      <div className={`p-4 rounded-3xl border text-left ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'}`}>
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5 border-b border-stone-100 dark:border-zinc-850 pb-2.5 mb-3">
          <Calendar size={13} className="text-amber-500" />
          🌴 Vendor Vacation Mode Configuration
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-extrabold text-stone-200">Enable Vacation/Closure Mode</span>
            <p className="text-[10px] text-stone-450 leading-relaxed max-w-md font-sans">
              Going out of town? Toggle vacation mode to automatically inform buyers, label store profile temporarily closed, and disable new orders temporarily.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="date" 
              value={vacationReturnDate}
              onChange={(e) => handleUpdateReturnDate(e.target.value)}
              disabled={isVacationMode}
              className={`text-xs p-2 rounded-xl border outline-none cursor-pointer ${
                isDarkMode 
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-200 disabled:opacity-40' 
                  : 'bg-stone-50 border-stone-200 text-stone-750 disabled:opacity-40'
              }`}
            />
            <button
              onClick={handleToggleVacationMode}
              className="cursor-pointer transition-all active:scale-95"
              title="Toggle vacation mode"
            >
              {isVacationMode ? (
                <ToggleRight size={38} className="text-amber-500 fill-amber-500/10" />
              ) : (
                <ToggleLeft size={38} className="text-stone-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* WITHDRAWAL PROCESSOR MODAL OVERLAY */}
      <AnimatePresence>
        {isWithdrawOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-100 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-sm w-full p-5 rounded-3xl border shadow-2xl relative ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-250 text-stone-900'
              }`}
            >
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white"
              >
                <X size={16} />
              </button>

              <h3 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-1 flex items-center gap-1">
                <Landmark size={15} />
                Withdrawal Settlement Gateway
              </h3>
              <p className="text-[10px] opacity-65 mb-4">Secured by National Bank NPS Protocol</p>

              {withdrawStep === 'idle' && (
                <form onSubmit={handleWithdrawalSubmit} className="space-y-4 text-xs text-left">
                  
                  {/* Select channel */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-stone-450 tracking-wider">Transfer Channel</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['TELEBIRR', 'CBE', 'CHAPA'] as const).map(channel => (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => setWithdrawChannel(channel)}
                          className={`p-2.5 rounded-xl border text-[10px] font-black tracking-wider transition-all flex flex-col items-center gap-1 cursor-pointer uppercase ${
                            withdrawChannel === channel
                              ? 'border-amber-500 bg-amber-500/5 text-amber-500'
                              : 'border-stone-200 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-850'
                          }`}
                        >
                          {channel === 'TELEBIRR' ? <CreditCard size={14} /> : <Landmark size={14} />}
                          {channel}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input details */}
                  {withdrawChannel === 'TELEBIRR' ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-450 tracking-wider">Telebirr Wallet Phone Number</label>
                      <input
                        type="text"
                        required
                        value={withdrawPhone}
                        onChange={(e) => setWithdrawPhone(e.target.value)}
                        className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-stone-50 border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-450 tracking-wider">CBE Account Number</label>
                      <input
                        type="text"
                        required
                        value={withdrawAccount}
                        onChange={(e) => setWithdrawAccount(e.target.value)}
                        className={`w-full p-2.5 rounded-xl border outline-none font-mono ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-stone-50 border-stone-200 text-stone-900'
                        }`}
                      />
                    </div>
                  )}

                  {/* Amount */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-450 tracking-wider">Amount to Withdraw (ETB)</label>
                    <input
                      type="number"
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border outline-none font-mono text-base font-black ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-stone-50 border-stone-200 text-stone-900'
                      }`}
                    />
                    <span className="text-[9px] text-stone-450 block font-mono">
                      Max available: ETB {vendorBalance.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-2.5 rounded-xl cursor-pointer shadow-lg shadow-amber-500/10 tracking-wider uppercase text-[10.5px] transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    Confirm &amp; Settle Withdrawal
                  </button>
                </form>
              )}

              {/* Multi-step loading */}
              {withdrawStep === 'processing' && (
                <div className="py-10 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="animate-spin text-amber-500" size={32} />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-500 animate-pulse">Contacting NPS Gateway...</span>
                  <p className="text-[10px] text-stone-450">Initializing secure tokenized bank transfer handshake</p>
                </div>
              )}

              {withdrawStep === 'verifying' && (
                <div className="py-10 flex flex-col items-center justify-center gap-3">
                  <ShieldCheck className="text-emerald-500 animate-bounce" size={32} />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-500 animate-pulse">NPS Verification...</span>
                  <p className="text-[10px] text-stone-450">Fayda compliance check and instant settlement lockin</p>
                </div>
              )}

              {withdrawStep === 'completed' && (
                <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-1">
                    <Check size={24} className="stroke-[3]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-500">Settlement Complete!</span>
                  <p className="text-[11px] text-stone-300">
                    Your payout of <strong className="font-mono text-emerald-400">{parseFloat(withdrawAmount).toLocaleString()} ETB</strong> has been cleared. Funds are available instantly in your CBE/Telebirr profile.
                  </p>
                  <button
                    onClick={() => setIsWithdrawOpen(false)}
                    className="mt-4 px-6 py-2 bg-neutral-800 text-stone-200 hover:bg-neutral-750 text-[10px] uppercase font-black tracking-wider rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
