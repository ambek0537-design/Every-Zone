import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Calendar, ArrowUpRight, FileText, RefreshCw, AlertCircle, 
  Coins, TrendingUp, Users, AlertTriangle, CheckCircle2, Download, Sparkles, Clock, ShieldAlert, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubscriptionsManagerProps {
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
  lang: 'en' | 'am';
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
}

interface VendorSubscription {
  id: string;
  planId: string;
  status: 'PENDING' | 'ACTIVE' | 'GRACE_PERIOD' | 'EXPIRED' | 'CANCELLED';
  amount: number;
  startsAt: string;
  expiresAt: string;
  graceEndsAt?: string;
  autoRenew: boolean;
}

interface PaymentLog {
  id: string;
  provider: string;
  transactionId: string;
  amount: number;
  paidAt: string;
  invoiceNumber: string;
  status: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export function SubscriptionsManager({ walletBalance, setWalletBalance, isDarkMode, lang }: SubscriptionsManagerProps) {
  // Available Plans
  const plans: SubscriptionPlan[] = [
    { id: 'p-1', name: lang === 'en' ? 'Standard Micro-Store' : 'መደበኛ ጥቃቅን ሱቅ', description: lang === 'en' ? 'Perfect for small boutique shops and local retail' : 'ለእለት ተእለት እና አነስተኛ የችርቻሮ ንግድ ተስማሚ', price: 200, durationDays: 30 },
    { id: 'p-2', name: lang === 'en' ? 'Premium Premium Habesha' : 'የላቀ የሀበሻ ብራንድ', description: lang === 'en' ? 'High-volume boutiques, custom orders & banner promos' : 'ለሰፊ ቡቲኮች፣ ልዩ ትእዛዞች እና የማስታወቂያ ማሳያዎች', price: 450, durationDays: 30 },
    { id: 'p-3', name: lang === 'en' ? 'Enterprise Realty Agency' : 'ቤቶች እና አፓርታማ ኤጀንሲ', description: lang === 'en' ? 'Unlimited properties and real-estate placement' : 'ያልተገደበ የሪል-ስቴት እና የኪራይ ቤቶች ማስታወቂያዎች', price: 800, durationDays: 30 }
  ];

  // Active States
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(plans[0]);
  const [activeSubscription, setActiveSubscription] = useState<VendorSubscription | null>(null);
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [autoRenew, setAutoRenew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'portal' | 'admin'>('portal');

  // Admin Dashboard Mock stats for high-fidelity interactive control
  const [adminStats, setAdminStats] = useState({
    monthlyRevenue: 18400,
    activeSubscriptionsCount: 42,
    expiredStoresCount: 3,
    renewalsToday: 5,
    pendingPaymentsCount: 2,
    topVendors: [
      { name: 'Bole Premium Habesha Wear', amount: 2400 },
      { name: 'Makeda Specialty Organic Coffee', amount: 1800 },
      { name: 'Lalibela Handmade Store', amount: 1200 },
      { name: 'Sheraton Residences Rental', amount: 800 }
    ]
  });

  // Calculate Days Remaining
  const getDaysRemaining = () => {
    if (!activeSubscription || activeSubscription.status !== 'ACTIVE') return 0;
    const exp = new Date(activeSubscription.expiresAt).getTime();
    const now = new Date().getTime();
    const diff = exp - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Seed initial values from localstorage to ensure durability across reloads
  useEffect(() => {
    const savedSub = localStorage.getItem('ez_vendor_subscription');
    const savedPayments = localStorage.getItem('ez_subscription_payments');
    const savedInvoices = localStorage.getItem('ez_subscription_invoices');

    if (savedSub) {
      setActiveSubscription(JSON.parse(savedSub));
    } else {
      // Default initial subscription (Active)
      const now = new Date();
      const exp = new Date();
      exp.setDate(now.getDate() + 18); // 18 Days remaining

      const initialSub: VendorSubscription = {
        id: 'sub-user-99',
        planId: 'p-1',
        status: 'ACTIVE',
        amount: 200,
        startsAt: now.toISOString(),
        expiresAt: exp.toISOString(),
        autoRenew: false
      };
      setActiveSubscription(initialSub);
      localStorage.setItem('ez_vendor_subscription', JSON.stringify(initialSub));
    }

    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    } else {
      const initialPayments: PaymentLog[] = [
        {
          id: 'pay-1',
          provider: 'CHAPA',
          transactionId: 'chapa-tx-100234',
          amount: 200,
          paidAt: new Date(Date.now() - 3600000 * 24 * 12).toLocaleString(),
          invoiceNumber: 'INV-100234-A',
          status: 'SUCCESS'
        }
      ];
      setPayments(initialPayments);
      localStorage.setItem('ez_subscription_payments', JSON.stringify(initialPayments));
    }

    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    } else {
      const initialInvoices: Invoice[] = [
        {
          id: 'inv-1',
          invoiceNumber: 'INV-100234-A',
          amount: 200,
          currency: 'ETB',
          status: 'PAID',
          createdAt: new Date(Date.now() - 3600000 * 24 * 12).toLocaleString()
        }
      ];
      setInvoices(initialInvoices);
      localStorage.setItem('ez_subscription_invoices', JSON.stringify(initialInvoices));
    }
  }, []);

  // Handle Create/Upgrade Subscription
  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (walletBalance < plan.price) {
      alert(`❌ ${lang === 'en' ? 'Insufficient Wallet Balance! Your current balance is: ' : 'ቀሪ ሂሳብዎ በቂ አይደለም! የእርስዎ ቀሪ ሂሳብ: '}${walletBalance.toLocaleString()} ETB. ${lang === 'en' ? 'Please top up your wallet first.' : 'እባክዎ መጀመሪያ ሂሳብዎን ይሙሉ::'}`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Deduct balance
      setWalletBalance(prev => prev - plan.price);

      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(startsAt.getDate() + plan.durationDays);

      const newSub: VendorSubscription = {
        id: `sub-${Math.floor(1000 + Math.random() * 9000)}`,
        planId: plan.id,
        status: 'ACTIVE',
        amount: plan.price,
        startsAt: startsAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        autoRenew: autoRenew
      };

      // Add payment
      const paymentId = `pay-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoiceNum = `INV-${Date.now().toString().substring(6)}`;
      const newPayment: PaymentLog = {
        id: paymentId,
        provider: 'CHAPA',
        transactionId: `chapa-tx-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: plan.price,
        paidAt: new Date().toLocaleString(),
        invoiceNumber: invoiceNum,
        status: 'SUCCESS'
      };

      const newInvoice: Invoice = {
        id: `inv-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceNumber: invoiceNum,
        amount: plan.price,
        currency: 'ETB',
        status: 'PAID',
        createdAt: new Date().toLocaleString()
      };

      setActiveSubscription(newSub);
      setPayments(prev => [newPayment, ...prev]);
      setInvoices(prev => [newInvoice, ...prev]);

      localStorage.setItem('ez_vendor_subscription', JSON.stringify(newSub));
      localStorage.setItem('ez_subscription_payments', JSON.stringify([newPayment, ...payments]));
      localStorage.setItem('ez_subscription_invoices', JSON.stringify([newInvoice, ...invoices]));

      // Update Admin stats
      setAdminStats(prev => ({
        ...prev,
        monthlyRevenue: prev.monthlyRevenue + plan.price,
        activeSubscriptionsCount: prev.activeSubscriptionsCount + 1,
        renewalsToday: prev.renewalsToday + 1
      }));

      setLoading(false);
      alert(`🎉 ${lang === 'en' ? 'Subscription Activated Successfully!' : 'ክፍያው በተሳካ ሁኔታ ተፈጽሟል! ሱቅዎ ነቅቷል።'}`);
    }, 1500);
  };

  // Toggle Auto Renew
  const handleToggleAutoRenew = () => {
    if (!activeSubscription) return;
    const nextVal = !autoRenew;
    setAutoRenew(nextVal);
    const updated = { ...activeSubscription, autoRenew: nextVal };
    setActiveSubscription(updated);
    localStorage.setItem('ez_vendor_subscription', JSON.stringify(updated));
  };

  // Simulate Midnight Check
  const triggerMidnightSync = () => {
    setLoading(true);
    setTimeout(() => {
      if (activeSubscription && activeSubscription.status === 'ACTIVE') {
        // Mock a test expiration
        const expiredSub: VendorSubscription = {
          ...activeSubscription,
          status: 'EXPIRED',
          expiresAt: new Date(Date.now() - 3600000).toISOString()
        };
        setActiveSubscription(expiredSub);
        localStorage.setItem('ez_vendor_subscription', JSON.stringify(expiredSub));
        alert(`⚠️ ${lang === 'en' ? 'Midnight Cron Job Executed!\n\nSubscription has expired. Your listings are now hidden, and store is set to PENDING.' : 'የሌሊት አውቶማቲክ ፍተሻ ተከናውኗል!\n\nክፍያዎ በመጠናቀቁ ሱቅዎ እንዲዘጋ ተደርጓል፤ እቃዎችዎም ተደብቀዋል።'}`);
      } else {
        alert(lang === 'en' ? 'Subscription is already in EXPIRED or GRACE_PERIOD mode.' : 'ሱቁ ቀድሞውኑ ተዘግቷል::');
      }
      setLoading(false);
    }, 1000);
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className={`p-5 rounded-3xl border shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
      
      {/* Title Header with tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-4 border-stone-150 dark:border-zinc-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#C5A059] flex items-center gap-2">
              <span>💳 Every-Zone Subscription Engine</span>
              <span className="bg-emerald-500/15 text-emerald-500 text-[9px] font-mono px-1.5 py-0.5 rounded font-black">Escrow Stable</span>
            </h3>
            <p className="text-[10px] opacity-75 mt-0.5">
              {lang === 'en' ? 'Manage micro-rent payments & billing transparently' : 'የዲጂታል ሱቅ ኪራይ ክፍያ እና የሂሳብ አከፋፈልን ይቆጣጠሩ'}
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-stone-100 dark:bg-zinc-950 p-1 rounded-xl self-stretch sm:self-auto">
          <button
            onClick={() => setActiveView('portal')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              activeView === 'portal' 
                ? (isDarkMode ? 'bg-amber-500 text-zinc-950' : 'bg-[#1E3A1A] text-white')
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {lang === 'en' ? 'Vendor Portal' : 'የሻጭ ገጽ'}
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              activeView === 'admin'
                ? (isDarkMode ? 'bg-amber-500 text-zinc-950' : 'bg-[#1E3A1A] text-white')
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {lang === 'en' ? 'Admin Board' : 'አስተዳዳሪ'}
          </button>
        </div>
      </div>

      {activeView === 'portal' ? (
        <div className="space-y-4">
          
          {/* Active Status Banner */}
          {activeSubscription && (
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              activeSubscription.status === 'ACTIVE'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  activeSubscription.status === 'ACTIVE' ? 'bg-emerald-500/15' : 'bg-red-500/15'
                }`}>
                  {activeSubscription.status === 'ACTIVE' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider">
                      {lang === 'en' ? 'Subscription Status:' : 'የአገልግሎት ሁኔታ፡'} {activeSubscription.status}
                    </span>
                    {activeSubscription.status === 'ACTIVE' && (
                      <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded">
                        {lang === 'en' ? 'Live' : 'አክቲቭ'}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] opacity-80 mt-1 font-mono">
                    {lang === 'en' 
                      ? `Your micro-store has ${daysRemaining} days remaining on the ${plans.find(p => p.id === activeSubscription.planId)?.name || 'Standard'} Plan.` 
                      : `ለሱቅዎ በ${plans.find(p => p.id === activeSubscription.planId)?.name || 'Standard'} መርሃ-ግብር መሰረት ${daysRemaining} ቀናት ይቀሩታል።`}
                  </p>
                  <p className="text-[9px] opacity-60 mt-0.5 font-mono">
                    {lang === 'en' ? `Maturity: ${new Date(activeSubscription.expiresAt).toLocaleDateString()}` : `ማብቂያ ቀን፡ ${new Date(activeSubscription.expiresAt).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              {/* Toggle Auto Renew & Cron trigger */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleToggleAutoRenew}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    autoRenew
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                      : 'bg-stone-100 dark:bg-zinc-950 border-stone-250 dark:border-zinc-800 text-stone-500'
                  }`}
                >
                  <RefreshCw size={11} className={autoRenew ? 'animate-spin' : ''} />
                  {lang === 'en' ? 'Auto-Renew: ' : 'አውቶማቲክ እድሳት፡ '} {autoRenew ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={triggerMidnightSync}
                  className="flex-1 sm:flex-none px-3 py-2 bg-stone-100 dark:bg-zinc-950 text-stone-500 hover:text-stone-700 dark:hover:text-zinc-300 border border-stone-250 dark:border-zinc-850 rounded-xl text-[9px] uppercase tracking-wider transition-all font-black flex items-center justify-center gap-1.5"
                >
                  <Clock size={11} />
                  {lang === 'en' ? 'Test Expiration' : 'ጊዜ ማለፉን ፈትን'}
                </button>
              </div>
            </div>
          )}

          {/* Premium Subscription Upgrade Choices */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] mb-2.5">
              🚀 {lang === 'en' ? 'Upgrade or Renew Subscription Plans' : 'አዲስ የሱቅ ኪራይ መርሃ-ግብር ይምረጡ'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plans.map((plan) => {
                const isActive = activeSubscription?.planId === plan.id && activeSubscription.status === 'ACTIVE';
                return (
                  <div 
                    key={plan.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all relative ${
                      isActive
                        ? (isDarkMode ? 'bg-[#C5A059]/10 border-[#C5A059]' : 'bg-[#FAF9F6] border-[#C5A059]')
                        : (isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50/60 border-stone-200')
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-zinc-950 font-black text-[8px] uppercase px-1.5 py-0.5 rounded font-mono">
                        Active Plan
                      </span>
                    )}

                    <div className="space-y-1">
                      <span className="text-xs font-black block text-stone-800 dark:text-zinc-100">{plan.name}</span>
                      <span className="text-[10px] opacity-75 block text-stone-500 dark:text-zinc-400 leading-relaxed min-h-[30px]">
                        {plan.description}
                      </span>
                      <div className="flex items-baseline gap-1 pt-1.5">
                        <span className="text-sm font-black text-[#C5A059]">{plan.price} ETB</span>
                        <span className="text-[9px] opacity-65 font-mono">/ {plan.durationDays} Days</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full py-2.5 mt-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/10 text-[#C5A059] border border-[#C5A059]/30 hover:bg-amber-500/20'
                          : (isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-[#1E3A1A] hover:bg-emerald-850 text-white')
                      }`}
                    >
                      {loading ? 'Processing...' : isActive ? (lang === 'en' ? 'Extend Plan' : 'ጊዜ ጨምር') : (lang === 'en' ? 'Select & Activate' : 'ክፈትና አግብር')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Billing & Invoices Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Payment logs */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-stone-50/40 border-stone-150'}`}>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] mb-3 flex items-center justify-between">
                <span>🕒 {lang === 'en' ? 'Escrow Payment History' : 'የክፍያ ታሪክ'}</span>
                <span className="text-[9px] font-mono lowercase opacity-60">Verified Logs</span>
              </h4>

              {payments.length === 0 ? (
                <div className="py-6 text-center text-[10px] opacity-50">No previous transactions found</div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-[11px] p-2 bg-stone-100/40 dark:bg-zinc-900/60 rounded-xl">
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center gap-1">
                          <span>{p.amount} ETB via {p.provider}</span>
                          <span className="bg-green-500/10 text-green-600 text-[8px] font-black uppercase px-1 rounded">Success</span>
                        </div>
                        <div className="text-[9px] opacity-50 font-mono">ID: {p.transactionId} | {p.paidAt}</div>
                      </div>
                      <ArrowUpRight size={13} className="text-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Invoices List */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-stone-50/40 border-stone-150'}`}>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] mb-3 flex items-center justify-between">
                <span>📄 {lang === 'en' ? 'Downloadable Invoices' : 'የክፍያ ደረሰኞች (Invoices)'}</span>
                <span className="text-[9px] font-mono lowercase opacity-60">PDF Ready</span>
              </h4>

              {invoices.length === 0 ? (
                <div className="py-6 text-center text-[10px] opacity-50">No invoices available</div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between text-[11px] p-2 bg-stone-100/40 dark:bg-zinc-900/60 rounded-xl">
                      <div className="space-y-0.5">
                        <div className="font-bold font-mono text-stone-700 dark:text-zinc-300">{inv.invoiceNumber}</div>
                        <div className="text-[9px] opacity-60">{inv.createdAt} • <span className="text-emerald-500 font-bold">PAID</span></div>
                      </div>
                      <button
                        onClick={() => alert(`📥 ${lang === 'en' ? `Downloading invoice PDF for ${inv.invoiceNumber}.` : `ደረሰኝ ${inv.invoiceNumber} በፒዲኤፍ እየወረደ ነው።`}`)}
                        className="p-1.5 bg-stone-200 dark:bg-zinc-850 hover:bg-[#C5A059]/20 text-[#C5A059] rounded-lg transition-all"
                        title="Download PDF"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Admin Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#C5A059] block">Monthly Revenue</span>
              <span className="text-sm font-black block mt-1 text-emerald-600 dark:text-emerald-400">{(adminStats.monthlyRevenue).toLocaleString()} ETB</span>
              <span className="text-[8px] opacity-50 font-mono block mt-0.5">Escrow settlements today</span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#C5A059] block">Active Subscriptions</span>
              <span className="text-sm font-black block mt-1 text-stone-800 dark:text-zinc-100">{adminStats.activeSubscriptionsCount} Stores</span>
              <span className="text-[8px] opacity-50 font-mono block mt-0.5">Verified digital shops</span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#C5A059] block">Expired Stores</span>
              <span className="text-sm font-black block mt-1 text-red-500">{adminStats.expiredStoresCount} Stores</span>
              <span className="text-[8px] opacity-50 font-mono block mt-0.5">Pending cash top-ups</span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#C5A059] block">Renewals Today</span>
              <span className="text-sm font-black block mt-1 text-emerald-500">+{adminStats.renewalsToday} Today</span>
              <span className="text-[8px] opacity-50 font-mono block mt-0.5">Automatic batch processed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Top Paying Vendors */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-stone-50/40 border-stone-150'}`}>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] mb-3 flex items-center justify-between">
                <span>💎 Top Paying Vendors</span>
                <span className="text-[9px] font-mono lowercase opacity-60">High-tier contributors</span>
              </h4>

              <div className="space-y-2.5">
                {adminStats.topVendors.map((v, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] p-2 bg-stone-100/40 dark:bg-zinc-900/60 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-amber-500 font-mono">#0{i+1}</span>
                      <span className="font-bold text-stone-700 dark:text-zinc-300">{v.name}</span>
                    </div>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{v.amount} ETB</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System logs / Audit checks */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-stone-50/40 border-stone-150'}`}>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] mb-3 flex items-center justify-between">
                <span>⚙️ Automated Task Automation</span>
                <span className="text-[9px] font-mono lowercase opacity-60">SRE cron hooks</span>
              </h4>

              <div className="space-y-2.5 text-[10px] font-mono leading-relaxed text-stone-600 dark:text-zinc-400">
                <div className="p-2.5 bg-stone-100/40 dark:bg-zinc-900/60 rounded-xl space-y-1">
                  <div className="flex justify-between font-bold text-[#C5A059]">
                    <span>Check Expired Subscriptions</span>
                    <span className="text-emerald-500 font-black">ACTIVE [Every midnight]</span>
                  </div>
                  <div>Scans active subscriptions, auto-renews if toggle is ON, else transitions to Grace Period.</div>
                </div>

                <div className="p-2.5 bg-stone-100/40 dark:bg-zinc-900/60 rounded-xl space-y-1">
                  <div className="flex justify-between font-bold text-[#C5A059]">
                    <span>Send Renewal Reminder</span>
                    <span className="text-emerald-500 font-black">ACTIVE [At 7d, 3d, 1d]</span>
                  </div>
                  <div>Triggers custom Fayda push/SMS templates when subscription gets close to maturity.</div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`⚙️ ${lang === 'en' ? 'Triggered manual SRE audit event logs. Subscriptions verified as 100% stable.' : 'የአስተዳዳሪ ፍተሻ ተጀምሯል። ሁሉም ሱቆች በስርዓቱ ተፈትሸዋል::'}`)}
                  className={`w-full py-2 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all hover:bg-amber-400`}
                >
                  Force System Subscription Audit
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
