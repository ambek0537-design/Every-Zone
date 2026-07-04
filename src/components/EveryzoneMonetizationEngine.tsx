import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Award, Zap, Sparkles, Share2, DollarSign, Gift, FileText, 
  BarChart2, Settings, ShieldCheck, CheckCircle2, TrendingUp, UserCheck, 
  Ticket, QrCode, Rss, ArrowUpRight, ShieldAlert, ArrowLeft, ArrowRight, 
  Clock, Plus, Trash2, Mail, Users, MessageSquare, Star, Info, HelpCircle, 
  ChevronRight, BadgePercent, ThumbsUp, RefreshCw, Layers, Copy, Check
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface MonetizationEngineProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  onClose: () => void;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
}

export function EveryzoneMonetizationEngine({
  isDarkMode,
  lang,
  triggerPushNotification,
  onClose,
  walletBalance,
  setWalletBalance
}: MonetizationEngineProps) {
  // Navigation tabs for the Monetization Engine
  const [activeTab, setActiveTab] = useState<'plans' | 'boosts' | 'ads' | 'coupons' | 'referrals' | 'premium' | 'receipts' | 'performance' | 'admin'>('plans');

  // --- 1. VENDOR SUBSCRIPTION PLANS DATA & STATE ---
  const plans = [
    {
      id: 'sub-free',
      name: 'Free Starter',
      nameAm: 'ነጻ መከፈቻ',
      price: 0,
      badge: 'Boutique Entry',
      color: 'from-stone-600 to-stone-800',
      limits: {
        storeLimits: '1 Micro-Store',
        productLimits: '5 Products Catalog',
        videoLimits: '0 Video Uploads',
        prioritySearch: 'No Priority',
        verifiedBadge: 'No Badge',
        analyticsLevel: 'Basic Views',
        supportLevel: 'Self-Service Wiki'
      }
    },
    {
      id: 'sub-starter',
      name: 'Starter Merchant',
      nameAm: 'ጀማሪ ነጋዴ',
      price: 450,
      badge: 'Popular',
      color: 'from-amber-650 to-orange-500',
      limits: {
        storeLimits: '2 Active Stores',
        productLimits: '50 Products Catalog',
        videoLimits: '2 Video Demos',
        prioritySearch: 'Low Boost',
        verifiedBadge: 'Standard Badge ✓',
        analyticsLevel: 'Monthly Insights',
        supportLevel: 'Email Ticket Support'
      }
    },
    {
      id: 'sub-pro',
      name: 'Professional Brand',
      nameAm: 'የላቀ ብራንድ',
      price: 1200,
      badge: 'High Performance',
      color: 'from-blue-600 to-indigo-700',
      limits: {
        storeLimits: '5 Managed Stores',
        productLimits: '250 Products Catalog',
        videoLimits: '10 High-Res Videos',
        prioritySearch: 'Medium Priority Boost',
        verifiedBadge: 'Trusted Seller Ribbon 👑',
        analyticsLevel: 'Real-Time Dashboard',
        supportLevel: '24/7 Priority Support'
      }
    },
    {
      id: 'sub-enterprise',
      name: 'Enterprise Co-op',
      nameAm: 'የኢንተርፕራይዝ ትብብር',
      price: 2900,
      badge: 'Unrestricted',
      color: 'from-yellow-500 to-amber-650',
      limits: {
        storeLimits: 'Unlimited Stores',
        productLimits: 'Unlimited Products',
        videoLimits: 'Unlimited Immersive Videos',
        prioritySearch: 'Premium Top Placement ⭐',
        verifiedBadge: 'Federal Verified Shield 🛡️',
        analyticsLevel: 'D3 Visual Deep Analytics',
        supportLevel: 'Dedicated Account Manager'
      }
    }
  ];

  const [activePlanId, setActivePlanId] = useState<string>(() => {
    return localStorage.getItem('ez_monetization_plan') || 'sub-free';
  });

  const handleSubscribe = (planId: string, price: number, name: string) => {
    if (walletBalance < price) {
      alert(`❌ Insufficient Funds! Subscribing to "${name}" requires ${price} ETB, but your Every-zone Wallet possesses only ${walletBalance} ETB. Please top up your wallet first.`);
      return;
    }
    setWalletBalance(prev => prev - price);
    setActivePlanId(planId);
    localStorage.setItem('ez_monetization_plan', planId);
    
    // Create audit log
    const newLog = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Subscription',
      description: `Upgrade to ${name} Plan`,
      amount: price,
      date: new Date().toLocaleString(),
      status: 'Settled Securely'
    };
    const existingLogs = JSON.parse(localStorage.getItem('ez_monetization_logs') || '[]');
    localStorage.setItem('ez_monetization_logs', JSON.stringify([newLog, ...existingLogs]));

    triggerPushNotification(
      'Subscription Activated! 👑',
      `You are now subscribed to the ${name} plan. All premium limits and priority search boosts have been unlocked!`,
      '👑',
      'MONETIZATION'
    );
    alert(`🎉 Successfully upgraded to "${name}" Plan! ${price} ETB has been deducted from your Every-zone corporate escrow ledger.`);
  };

  // --- 2. FEATURED LISTINGS STATE ---
  const [featuredTarget, setFeaturedTarget] = useState<'Products' | 'Services' | 'Stores' | 'Jobs' | 'Properties'>('Products');
  const [featuredDuration, setFeaturedDuration] = useState<'1 Day' | '7 Days' | '30 Days'>('7 Days');
  const [featuredTitle, setFeaturedTitle] = useState('');
  
  const featuredPrice = useMemo(() => {
    const base = featuredTarget === 'Products' ? 100 : featuredTarget === 'Services' ? 150 : featuredTarget === 'Stores' ? 250 : featuredTarget === 'Jobs' ? 200 : 350;
    const mult = featuredDuration === '1 Day' ? 1 : featuredDuration === '7 Days' ? 4 : 12;
    return base * mult;
  }, [featuredTarget, featuredDuration]);

  const handleLaunchFeatured = () => {
    if (!featuredTitle.trim()) {
      alert('Please specify a title or link for your featured promotion.');
      return;
    }
    if (walletBalance < featuredPrice) {
      alert(`❌ Insufficient Funds! Featured promotion requires ${featuredPrice} ETB.`);
      return;
    }
    setWalletBalance(prev => prev - featuredPrice);
    
    // Add to simulated active ads list
    const newAd = {
      id: `AD-F-${Math.floor(1000 + Math.random() * 9000)}`,
      title: featuredTitle,
      category: featuredTarget,
      duration: featuredDuration,
      spent: featuredPrice,
      status: 'AWAITING_APPROVAL'
    };
    const ads = JSON.parse(localStorage.getItem('ez_sponsored_items') || '[]');
    localStorage.setItem('ez_sponsored_items', JSON.stringify([newAd, ...ads]));

    // Log transaction
    const newLog = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Featured Promo',
      description: `Featured ${featuredTarget}: "${featuredTitle}" (${featuredDuration})`,
      amount: featuredPrice,
      date: new Date().toLocaleString(),
      status: 'AWAITING_APPROVAL'
    };
    const existingLogs = JSON.parse(localStorage.getItem('ez_monetization_logs') || '[]');
    localStorage.setItem('ez_monetization_logs', JSON.stringify([newLog, ...existingLogs]));

    setFeaturedTitle('');
    triggerPushNotification(
      'Promotion Submitted! 📢',
      `Your featured request for "${featuredTitle}" has been queued for Super-Admin review.`,
      '📢',
      'MONETIZATION'
    );
    alert(`🎉 Featured listing submitted! Total of ${featuredPrice} ETB deducted. Your promotion will become active immediately once approved by the Every-zone content moderator.`);
  };

  // --- 3. BOOST SYSTEM WITH ESTIMATED REACH ---
  const [boostTarget, setBoostTarget] = useState<'Boost Product' | 'Boost Store' | 'Boost Job' | 'Boost House' | 'Boost Service'>('Boost Product');
  const [boostBudget, setBoostBudget] = useState<number>(300); // ETB

  const estimatedReach = useMemo(() => {
    // 1 ETB delivers roughly 32-45 views/impressions in the region
    const minReach = Math.floor(boostBudget * 35);
    const maxReach = Math.floor(boostBudget * 52);
    return { min: minReach, max: maxReach };
  }, [boostBudget]);

  const handlePurchaseBoost = () => {
    if (walletBalance < boostBudget) {
      alert(`❌ Insufficient wallet balance for this boost budget.`);
      return;
    }
    setWalletBalance(prev => prev - boostBudget);

    // Save transaction log
    const newLog = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Hyper-Boost',
      description: `Instant ${boostTarget} Boost Budget`,
      amount: boostBudget,
      date: new Date().toLocaleString(),
      status: 'Boost Active'
    };
    const existingLogs = JSON.parse(localStorage.getItem('ez_monetization_logs') || '[]');
    localStorage.setItem('ez_monetization_logs', JSON.stringify([newLog, ...existingLogs]));

    triggerPushNotification(
      'Listing Boosted! 🚀',
      `Estimated reach of ${estimatedReach.min.toLocaleString()} - ${estimatedReach.max.toLocaleString()} users is now active.`,
      '🚀',
      'MONETIZATION'
    );
    alert(`🚀 Boost System engaged! ${boostBudget} ETB has been injected. Your item is now prioritised for the next ${estimatedReach.min.toLocaleString()} - ${estimatedReach.max.toLocaleString()} customer searches.`);
  };

  // --- 4. ADVERTISEMENTS (NATIVE SPONSORED CARDS) ---
  const sponsoredCards = [
    {
      id: 'sp-1',
      type: 'Sponsored Product',
      title: 'Makeda Elegant Handwoven Tibeb Kemis',
      vendor: 'Makeda Weaving Coop',
      rating: 4.9,
      price: '4,500 ETB',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=300',
      reach: 'Featured Brand Partner'
    },
    {
      id: 'sp-2',
      type: 'Sponsored Store',
      title: 'Lalibela Traditional Specialty Spices',
      vendor: 'Lalibela Artisanal Hub',
      rating: 4.8,
      price: 'Free Tasting Corner',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=300',
      reach: 'Verified High Response'
    },
    {
      id: 'sp-3',
      type: 'Sponsored Service',
      title: 'Certified Bole Passport Expedition & Courier',
      vendor: 'Abyssinia Travels & Logistics',
      rating: 5.0,
      price: '1,200 ETB / application',
      image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=300',
      reach: 'Government Liaison'
    }
  ];

  // --- 5. COUPONS & PROMO ENGINE ---
  const [couponsList, setCouponsList] = useState<{
    code: string;
    type: 'Vendor Coupon' | 'Platform Coupon' | 'Referral Coupon' | 'Automatic Discount';
    value: number;
    valueType: 'Flat ETB' | 'Percent %';
    status: 'ACTIVE' | 'EXPIRED';
  }[]>([
    { code: 'WELCOME100', type: 'Platform Coupon', value: 100, valueType: 'Flat ETB', status: 'ACTIVE' },
    { code: 'ESKROWTRUST', type: 'Platform Coupon', value: 10, valueType: 'Percent %', status: 'ACTIVE' },
    { code: 'MAKEDA20', type: 'Vendor Coupon', value: 20, valueType: 'Percent %', status: 'ACTIVE' },
    { code: 'ABYSSINIA200', type: 'Referral Coupon', value: 200, valueType: 'Flat ETB', status: 'ACTIVE' }
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'Vendor Coupon' | 'Platform Coupon' | 'Referral Coupon' | 'Automatic Discount'>('Vendor Coupon');
  const [newCouponVal, setNewCouponVal] = useState<number>(15);
  const [newCouponValType, setNewCouponValType] = useState<'Flat ETB' | 'Percent %'>('Percent %');

  const handleCreateCoupon = () => {
    if (!newCouponCode.trim()) {
      alert('Please fill in coupon code!');
      return;
    }
    const code = newCouponCode.trim().toUpperCase();
    if (couponsList.some(c => c.code === code)) {
      alert('A coupon with this code already exists!');
      return;
    }

    const newC = {
      code,
      type: newCouponType,
      value: newCouponVal,
      valueType: newCouponValType,
      status: 'ACTIVE' as const
    };
    setCouponsList([newC, ...couponsList]);
    setNewCouponCode('');
    triggerPushNotification(
      'Coupon Generated! 🎟️',
      `Your coupon code "${code}" is now active for customers at checkout.`,
      '🎟️',
      'MONETIZATION'
    );
    alert(`🎉 Coupon "${code}" successfully created and live for buyers!`);
  };

  // --- 6. REFERRAL PROGRAM ---
  const [referralHistory, setReferralHistory] = useState([
    { id: 'ref-1', email: 'kebede.t@fayda.et', reward: '150 ETB Credit', status: 'COMPLETED', date: 'July 2, 2026' },
    { id: 'ref-2', email: 'almaz.weavers@gmail.com', reward: '150 ETB Credit', status: 'COMPLETED', date: 'June 29, 2026' },
    { id: 'ref-3', email: 'samuel.d@bole.com', reward: 'Pending Activation', status: 'PENDING', date: 'June 28, 2026' }
  ]);
  const [referralInput, setReferralInput] = useState('');

  const handleSendInvite = () => {
    if (!referralInput.trim() || !referralInput.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    const newRef = {
      id: `ref-${Math.floor(10 + Math.random() * 90)}`,
      email: referralInput.trim(),
      reward: '150 ETB Credit',
      status: 'PENDING',
      date: 'Just Now'
    };
    setReferralHistory([newRef, ...referralHistory]);
    setReferralInput('');
    alert(`📩 Invitation successfully dispatched to ${referralInput.trim()} with your referral code "EVERYZONE-PARTNER-402". You will receive 150 ETB Wallet credit once they verify their Fayda ID and complete their first escrow transaction!`);
  };

  // --- 7. PREMIUM MEMBERSHIP ---
  const [isPremiumCustomer, setIsPremiumCustomer] = useState<boolean>(() => {
    return localStorage.getItem('ez_customer_premium') === 'true';
  });

  const handlePurchasePremium = () => {
    const premiumCost = 199; // ETB / Month
    if (walletBalance < premiumCost) {
      alert(`❌ Insufficient funds to buy Customer Premium. Cost is 199 ETB / Month.`);
      return;
    }
    setWalletBalance(prev => prev - premiumCost);
    setIsPremiumCustomer(true);
    localStorage.setItem('ez_customer_premium', 'true');

    // Audit logs
    const newLog = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Premium Member',
      description: 'Acquired 1-Month Premium Customer Pass',
      amount: premiumCost,
      date: new Date().toLocaleString(),
      status: 'Active Premium'
    };
    const existingLogs = JSON.parse(localStorage.getItem('ez_monetization_logs') || '[]');
    localStorage.setItem('ez_monetization_logs', JSON.stringify([newLog, ...existingLogs]));

    triggerPushNotification(
      'Premium Membership Active! 🌟',
      'You are now an Every-zone Gold Ribbon Customer! Free delivery and priority support activated.',
      '🌟',
      'MONETIZATION'
    );
    alert(`🎉 Welcome to Customer Premium! 199 ETB deducted. You now possess the Gold Premium Badge, 0 ETB Free Delivery on all marketplace orders, and expedited support lanes.`);
  };

  // --- 8. DIGITAL RECEIPTS & HISTORY ---
  const [activeReceiptInvoice, setActiveReceiptInvoice] = useState<any | null>(null);

  const mockReceiptLogs = useMemo(() => {
    // Generate a combining set of logs
    const localLogs = JSON.parse(localStorage.getItem('ez_monetization_logs') || '[]');
    const baseLogs = [
      { id: 'TX-839201', type: 'Vendor License', description: 'Annual Trade License Renewal', amount: 1500, date: '07/03/2026, 11:30 AM', status: 'Settled Securely' },
      { id: 'TX-520102', type: 'Escrow Release', description: 'Payout settled from Makeda Boutique Dress order', amount: 4500, date: '07/01/2026, 04:15 PM', status: 'Settled Securely' },
      { id: 'TX-291040', type: 'Referral Credit', description: 'Referral Bonus: samuel.d@bole.com', amount: -150, date: '06/28/2026, 10:04 AM', status: 'Settled Securely' }
    ];
    return [...localLogs, ...baseLogs];
  }, [walletBalance]);

  // --- 9. SELLER PERFORMANCE SCORECARD ---
  const sellerPerformance = {
    performanceScore: 96,
    responseRate: 98,
    deliveryRate: 95.4,
    reviewRating: 4.8,
    trustScore: 99.1
  };

  // --- 10. REAL-TIME MONETIZATION ANALYTICS DATA ---
  const analyticsChartData = [
    { month: 'Feb', Revenue: 1800, Subscriptions: 450, BoostSales: 200, AdRevenue: 650, ReferralRevenue: 500 },
    { month: 'Mar', Revenue: 3400, Subscriptions: 1200, BoostSales: 400, AdRevenue: 800, ReferralRevenue: 1000 },
    { month: 'Apr', Revenue: 6200, Subscriptions: 2900, BoostSales: 800, AdRevenue: 1500, ReferralRevenue: 1000 },
    { month: 'May', Revenue: 9500, Subscriptions: 4100, BoostSales: 1600, AdRevenue: 2200, ReferralRevenue: 1600 },
    { month: 'Jun', Revenue: 14800, Subscriptions: 5800, BoostSales: 2500, AdRevenue: 3900, ReferralRevenue: 2600 },
    { month: 'Jul', Revenue: 21400, Subscriptions: 8900, BoostSales: 3400, AdRevenue: 5200, ReferralRevenue: 3900 }
  ];

  // --- 11. CENTRAL ADMINISTRATIVE ACTIONS ---
  const [adminRequests, setAdminRequests] = useState([
    { id: 'REQ-401', vendor: 'Makeda Weaving Boutique', promoType: 'Featured Store', item: 'Makeda Weaving Studio (7 Days)', cost: 800, status: 'PENDING' },
    { id: 'REQ-402', vendor: 'Yirgacheffe Coffee Importers', promoType: 'Sponsored Product', item: 'Fresh Medium Roast Bag (30 Days)', cost: 1200, status: 'PENDING' },
    { id: 'REQ-403', vendor: 'Bole Executive Real Estate', promoType: 'Boost Property', item: 'Condo Listing Hyper-Boost', cost: 500, status: 'APPROVED' }
  ]);

  const handleAdminApprove = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setAdminRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    triggerPushNotification(
      'Admin Action Completed 🛡️',
      `Promotion request ${id} has been marked as ${action}.`,
      '🛡️',
      'MONETIZATION'
    );
    alert(`🛡️ Moderator Action Logged: Request "${id}" set to ${action}.`);
  };

  return (
    <div id="monetization-engine-container" className="flex flex-col h-full bg-neutral-950 text-stone-150 select-none">
      
      {/* HEADER BAR */}
      <div className="p-4 border-b border-neutral-900 bg-neutral-950 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-700 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-500 text-xs">⚡</span>
              <h1 className="text-sm font-black uppercase tracking-tight text-stone-100 font-sans">Every-zone Monetization Engine</h1>
            </div>
            <p className="text-[10px] text-stone-400">Chief Product Officer Executive Suite & Dynamic Financial Simulation</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-850 px-3 py-1.5 rounded-2xl">
          <DollarSign className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div className="text-left leading-none">
            <span className="text-[8px] text-stone-500 uppercase font-mono block">Escrow Ledger Balance</span>
            <span id="wallet-ledger-display" className="text-xs font-black font-mono text-amber-400">{walletBalance.toLocaleString()} ETB</span>
          </div>
        </div>
      </div>

      {/* MULTI-TAB CONTROLS */}
      <div className="flex gap-1.5 overflow-x-auto p-4 border-b border-neutral-900 bg-neutral-950/90 sticky top-[69px] z-10 no-scrollbar">
        {[
          { id: 'plans', icon: '👑', label: lang === 'en' ? 'Vendor Subscriptions' : 'የሻጭ እቅዶች' },
          { id: 'boosts', icon: '🚀', label: lang === 'en' ? 'Listing Hyper-Boost' : 'ዕቃዎችን ማሳደጊያ' },
          { id: 'ads', icon: '📢', label: lang === 'en' ? 'Sponsored Ads' : 'ስፖንሰር ማስታወቂያ' },
          { id: 'coupons', icon: '🎟', label: lang === 'en' ? 'Coupons & Promos' : 'ቅናሾችና ኩፖን' },
          { id: 'referrals', icon: '👥', label: lang === 'en' ? 'Referral Engine' : 'የሪፈራል ሰንሰለት' },
          { id: 'premium', icon: '🌟', label: lang === 'en' ? 'Customer Premium' : 'የደንበኛ ፕሪሚየም' },
          { id: 'receipts', icon: '📜', label: lang === 'en' ? 'Digital Invoices' : 'ዲጂታል ደረሰኞች' },
          { id: 'performance', icon: '📈', label: lang === 'en' ? 'Performance & Analytics' : 'ውጤታማነትና ትንተና' },
          { id: 'admin', icon: '🛡️', label: lang === 'en' ? 'Central Administration' : 'ዋና አስተዳደር ሰሌዳ' }
        ].map(tab => (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id as any);
              setActiveReceiptInvoice(null);
            }}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40' 
                : 'bg-neutral-900/60 border-neutral-850 text-stone-400 hover:text-stone-200 hover:border-neutral-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANEL */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar max-w-5xl mx-auto w-full space-y-6">
        
        {/* TAB 1: VENDOR SUBSCRIPTION PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-stone-100 flex items-center gap-1.5">
                <Award className="text-amber-500 w-5 h-5" />
                <span>Vendor Subscription Plans Portal</span>
              </h2>
              <p className="text-xs text-stone-400">Scale store capabilities, expand inventory thresholds, upload high-fidelity video demonstrations, and secure premium search prioritization.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {plans.map(plan => {
                const isActive = activePlanId === plan.id;
                return (
                  <div 
                    key={plan.id}
                    className={`bg-neutral-900 border rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                      isActive ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-neutral-850 hover:border-neutral-750'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-neutral-950 text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                        Active Plan
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] bg-neutral-950 text-stone-400 px-2 py-0.5 rounded border border-neutral-850 font-bold">
                          {plan.badge}
                        </span>
                        <h3 className="text-sm font-black mt-2 text-stone-100">
                          {lang === 'en' ? plan.name : plan.nameAm}
                        </h3>
                      </div>

                      <div className="border-b border-neutral-850 pb-3">
                        <span className="text-2xl font-black font-mono text-amber-400">{plan.price}</span>
                        <span className="text-[10px] text-stone-400 ml-1">ETB / Month</span>
                      </div>

                      {/* Plan Limits Grid */}
                      <div className="space-y-2 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Store Limit:</span>
                          <span className="font-semibold text-stone-200">{plan.limits.storeLimits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Product Limit:</span>
                          <span className="font-semibold text-stone-200">{plan.limits.productLimits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Video Limit:</span>
                          <span className="font-semibold text-stone-200">{plan.limits.videoLimits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Search priority:</span>
                          <span className="font-semibold text-stone-200">{plan.limits.prioritySearch}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Verified Badge:</span>
                          <span className="font-semibold text-stone-200">{plan.limits.verifiedBadge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Analytics scope:</span>
                          <span className="font-semibold text-stone-200">{plan.limits.analyticsLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Support Lane:</span>
                          <span className="font-semibold text-stone-200">{plan.limits.supportLevel}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`upgrade-plan-${plan.id}`}
                      onClick={() => handleSubscribe(plan.id, plan.price, plan.name)}
                      disabled={isActive || plan.price === 0}
                      className={`w-full mt-5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isActive 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 opacity-80 cursor-default' 
                          : plan.price === 0 
                            ? 'bg-neutral-850 border border-neutral-800 text-stone-400 hover:text-stone-200 cursor-pointer'
                            : 'bg-amber-500 hover:bg-amber-600 text-neutral-950'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Your Active Plan</span>
                        </>
                      ) : plan.price === 0 ? (
                        <span>Default Basic limits</span>
                      ) : (
                        <>
                          <span>Activate Plan</span>
                          <ArrowUpRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: FEATURED & BOOST LISTINGS */}
        {activeTab === 'boosts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Featured Listings Creator */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5">
                  <Sparkles className="text-amber-500 w-4 h-4" />
                  <span>Feature Your Listings</span>
                </h3>
                <p className="text-[10.5px] text-stone-400">Promote your custom offerings directly inside the prominent Every-zone category spotlight sliders.</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-500 uppercase font-mono font-black">Promotion Category</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['Products', 'Services', 'Stores', 'Jobs', 'Properties'] as const).map(target => (
                      <button
                        key={target}
                        onClick={() => setFeaturedTarget(target)}
                        className={`py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all cursor-pointer ${
                          featuredTarget === target 
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/35' 
                            : 'bg-neutral-950 border-neutral-850 text-stone-500'
                        }`}
                      >
                        {target}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-500 uppercase font-mono font-black">Feature Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1 Day', '7 Days', '30 Days'] as const).map(duration => (
                      <button
                        key={duration}
                        onClick={() => setFeaturedDuration(duration)}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          featuredDuration === duration 
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/35' 
                            : 'bg-neutral-950 border-neutral-850 text-stone-400'
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-500 uppercase font-mono font-black">Promotion Title / Item Reference</label>
                  <input
                    type="text"
                    value={featuredTitle}
                    onChange={(e) => setFeaturedTitle(e.target.value)}
                    placeholder="e.g. Makeda Boutique Traditional Silk Dress"
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="bg-neutral-950 border border-neutral-850 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-stone-500 block text-[9px] uppercase font-mono">Cost Calculation</span>
                    <span className="text-stone-200 font-bold">{featuredTarget} Feature ({featuredDuration})</span>
                  </div>
                  <span className="text-sm font-black font-mono text-amber-400">{featuredPrice} ETB</span>
                </div>

                <button
                  id="launch-featured-btn"
                  onClick={handleLaunchFeatured}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} className="fill-current" />
                  <span>Purchase & Launch Spotlight Feature</span>
                </button>
              </div>
            </div>

            {/* Instant Hyper-Boost with Estimated Reach */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5">
                    <Zap className="text-amber-500 w-4 h-4 fill-current" />
                    <span>Instant Feed Hyper-Boost</span>
                  </h3>
                  <p className="text-[10.5px] text-stone-400">Engage the rapid search algorithm to inject your listings directly in front of targeted Ethiopian consumers.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-500 uppercase font-mono font-black">Asset to Boost</label>
                    <div className="grid grid-cols-5 gap-1">
                      {(['Boost Product', 'Boost Store', 'Boost Job', 'Boost House', 'Boost Service'] as const).map(target => (
                        <button
                          key={target}
                          onClick={() => setBoostTarget(target)}
                          className={`py-1 rounded-lg text-[8px] font-black uppercase border transition-all cursor-pointer leading-tight text-center ${
                            boostTarget === target 
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/35' 
                              : 'bg-neutral-950 border-neutral-850 text-stone-500'
                          }`}
                        >
                          {target.split(' ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-stone-500 uppercase font-mono font-black">Boost Budget Injection</span>
                      <span className="text-amber-400 font-black font-mono">{boostBudget} ETB</span>
                    </div>
                    <input 
                      type="range"
                      min="100"
                      max="5000"
                      step="50"
                      value={boostBudget}
                      onChange={(e) => setBoostBudget(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-950 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-stone-500">
                      <span>100 ETB</span>
                      <span>2,500 ETB</span>
                      <span>5,000 ETB</span>
                    </div>
                  </div>

                  {/* Reach Estimator Box */}
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl space-y-2 text-center">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-stone-500 block">Simulated Audience Delivery Reach</span>
                    <div className="text-xl font-mono font-black text-emerald-400">
                      {estimatedReach.min.toLocaleString()} - {estimatedReach.max.toLocaleString()}
                    </div>
                    <span className="text-[9.5px] text-stone-400 block">Estimated active search impressions in Addis Ababa & Regional Zones</span>
                  </div>
                </div>
              </div>

              <button
                id="purchase-boost-btn"
                onClick={handlePurchaseBoost}
                className="w-full mt-5 bg-gradient-to-r from-amber-500 to-amber-650 hover:from-amber-600 text-neutral-950 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap size={14} className="fill-current" />
                <span>Inject Boost & Reach {estimatedReach.min.toLocaleString()} Buyers</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SPONSORED ADVERTISEMENTS */}
        {activeTab === 'ads' && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-stone-100 flex items-center gap-1.5">
                <Rss className="text-amber-500 w-5 h-5" />
                <span>Native Sponsored Cards Preview</span>
              </h2>
              <p className="text-xs text-stone-400">See how your promoted cards display inside the user's primary application feed. Each card is elegantly integrated and clearly labeled as sponsored according to trade compliance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {sponsoredCards.map(card => (
                <div 
                  key={card.id}
                  className="bg-neutral-900 border border-neutral-850 rounded-3xl overflow-hidden shadow-md flex flex-col group hover:border-amber-500/30 transition-all duration-300 relative"
                >
                  {/* Image container */}
                  <div className="aspect-video w-full overflow-hidden bg-neutral-950 relative border-b border-neutral-850">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {/* Clear Sponsored tag */}
                    <div className="absolute top-3 left-3 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 text-[8px] font-black uppercase text-amber-500 px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                      <span>Sponsored / ማስታወቂያ</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[8.5px] uppercase font-mono font-extrabold text-stone-500 block">
                        {card.type}
                      </span>
                      <h4 className="text-xs font-black text-stone-200 line-clamp-2 leading-tight">
                        {card.title}
                      </h4>
                    </div>

                    <div className="flex justify-between items-center border-t border-neutral-850/60 pt-2.5">
                      <div>
                        <span className="text-[8.5px] text-stone-500 uppercase font-mono">Promoter</span>
                        <span className="text-[10.5px] font-bold text-stone-300 block">🏪 {card.vendor}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8.5px] text-stone-500 uppercase font-mono">Value</span>
                        <span className="text-[11px] font-mono font-black text-amber-400 block">{card.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & PROMO ENGINE */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Coupon creator form */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl space-y-4 md:col-span-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5">
                    <Ticket className="text-amber-500 w-4 h-4" />
                    <span>Create Vendor Coupon</span>
                  </h3>
                  <p className="text-[10.5px] text-stone-400">Generate custom promotional discount tickets to reward your brand advocates or boost sales conversion.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9.5px] text-stone-500 uppercase font-mono font-bold">Coupon Code</label>
                    <input 
                      type="text"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      placeholder="e.g. SPECIAL30"
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500 uppercase font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] text-stone-500 uppercase font-mono font-bold">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e: any) => setNewCouponType(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-stone-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Vendor Coupon">Vendor Coupon (Custom store scope)</option>
                      <option value="Platform Coupon">Platform Coupon (General scope)</option>
                      <option value="Referral Coupon">Referral Coupon (Reward scope)</option>
                      <option value="Automatic Discount">Automatic Discount (Cart checkout triggers)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9.5px] text-stone-500 uppercase font-mono font-bold">Discount Value</label>
                      <input 
                        type="number"
                        value={newCouponVal}
                        onChange={(e) => setNewCouponVal(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] text-stone-500 uppercase font-mono font-bold">Unit</label>
                      <select
                        value={newCouponValType}
                        onChange={(e: any) => setNewCouponValType(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-stone-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="Percent %">Percent %</option>
                        <option value="Flat ETB">Flat ETB</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                id="create-coupon-btn"
                onClick={handleCreateCoupon}
                className="w-full mt-5 bg-amber-500 hover:bg-amber-600 text-neutral-950 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Generate & Publish Coupon Ticket</span>
              </button>
            </div>

            {/* Coupons list database */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl md:col-span-2 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5">
                  <Ticket className="text-amber-500 w-4 h-4" />
                  <span>Promo Database ({couponsList.length})</span>
                </h3>
                <p className="text-[10.5px] text-stone-400">Review all currently active, platform-wide, and vendor-specific automatic or code-based coupon codes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar">
                {couponsList.map(coupon => (
                  <div 
                    key={coupon.code}
                    className="bg-neutral-950 border border-neutral-850 p-3.5 rounded-2xl flex items-center justify-between hover:border-neutral-700 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-mono bg-neutral-900 border border-neutral-800 text-amber-400 px-2 py-0.5 rounded uppercase">
                          {coupon.code}
                        </span>
                        <span className="text-[8.5px] font-bold text-stone-500 uppercase">
                          {coupon.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 leading-none">
                        Discount: <strong className="text-stone-200 font-mono font-extrabold">{coupon.value} {coupon.valueType === 'Percent %' ? '%' : 'ETB'} Off</strong>
                      </p>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-400 text-[8.5px] px-2 py-0.5 rounded border border-emerald-500/20 font-black font-mono">
                      ✓ Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REFERRAL PROGRAM */}
        {activeTab === 'referrals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Invite section */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5">
                    <Share2 className="text-amber-500 w-4 h-4" />
                    <span>Invite Friends & Earn Wallet Credits</span>
                  </h3>
                  <p className="text-[10.5px] text-stone-400">Disseminate your unique Every-zone partner link. Get flat 150 ETB direct escrow credit deposited straight to your wallet for each merchant you recruit!</p>
                </div>

                <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-2xl space-y-2">
                  <span className="text-[8px] uppercase font-mono text-stone-500 block">Your Unique Partner Code</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-black text-amber-400 uppercase">EVERYZONE-PARTNER-402</span>
                    <button 
                      onClick={() => alert('Referral code copied to clipboard!')}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-stone-300 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] text-stone-500 uppercase font-mono font-bold">Invite a friend via Email Address</label>
                  <div className="flex gap-2">
                    <input 
                      type="email"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      placeholder="e.g. friend.weavers@gmail.com"
                      className="flex-1 bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={handleSendInvite}
                      className="bg-amber-500 hover:bg-amber-600 text-neutral-950 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-2xl flex gap-2 items-start mt-4">
                <Gift className="text-amber-500 shrink-0 mt-0.5" size={16} />
                <div className="text-[9.5px] text-stone-400 leading-normal">
                  <strong className="text-stone-200">Affiliate Bonus Program</strong>: Once your referred colleague verifies their business using Ethiopian trade registration biometric verification, you both receive 150 ETB gift tokens.
                </div>
              </div>
            </div>

            {/* Referrals list */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5">
                  <Users className="text-amber-500 w-4 h-4" />
                  <span>Referral History Dashboard</span>
                </h3>
                <p className="text-[10.5px] text-stone-400">Track sent invites, verification checkpoints, and settled wallet credit rewards in real-time.</p>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {referralHistory.map(ref => (
                  <div 
                    key={ref.id}
                    className="bg-neutral-950 border border-neutral-850 p-3 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-200 block truncate max-w-[180px]">{ref.email}</span>
                      <span className="text-[9px] text-stone-500 block">Invited on {ref.date}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-amber-400 block">{ref.reward}</span>
                      <span className={`text-[8.5px] font-bold ${
                        ref.status === 'COMPLETED' ? 'text-emerald-400' : 'text-stone-500 animate-pulse'
                      }`}>
                        {ref.status === 'COMPLETED' ? '✓ Registered' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PREMIUM MEMBERSHIP FOR CLIENTS */}
        {activeTab === 'premium' && (
          <div className="max-w-2xl mx-auto bg-neutral-900 border border-neutral-850 rounded-3xl p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Star className="w-10 h-10 fill-current animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-stone-100">Become an Every-zone Gold Ribbon Premium Customer</h2>
              <p className="text-xs text-stone-400 max-w-lg mx-auto">Elevate your customer status with our elite premium subscription. Settle payments with 0 delivery charges and unlock high priority customer access.</p>
            </div>

            {/* Premium Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-xl mx-auto">
              {[
                { label: 'Free Delivery', desc: '0 ETB logistics charges', icon: '🏍️' },
                { label: 'Exclusive Discounts', desc: 'Up to 25% Off brand items', icon: '🎟️' },
                { label: 'Priority Support', desc: '24/7 dedicated helpline', icon: '📞' },
                { label: 'Early Access', desc: 'First bids on lotteries', icon: '✈️' },
                { label: 'Premium Badge', desc: 'Show off golden ribbon ribbon', icon: '👑' }
              ].map((benefit, idx) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-850 p-3 rounded-2xl space-y-1 text-center">
                  <span className="text-lg block">{benefit.icon}</span>
                  <h4 className="text-[10px] font-black uppercase tracking-tight text-stone-200">{benefit.label}</h4>
                  <p className="text-[8.5px] text-stone-500 leading-tight">{benefit.desc}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-850/60 pt-5 max-w-md mx-auto space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400">Monthly Premium Subscription</span>
                <span className="text-sm font-black font-mono text-amber-400">199 ETB / Month</span>
              </div>

              {isPremiumCustomer ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>Your Premium Customer Pass is Active ✓</span>
                </div>
              ) : (
                <button
                  id="buy-premium-btn"
                  onClick={handlePurchasePremium}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 py-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Star size={14} className="fill-current" />
                  <span>Subscribe for 199 ETB / Month</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: DIGITAL RECEIPTS & WALLET HISTORY */}
        {activeTab === 'receipts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Receipts Log */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5">
                  <FileText className="text-amber-500 w-4 h-4" />
                  <span>Wallet Transaction Receipt History</span>
                </h3>
                <p className="text-[10.5px] text-stone-400">Select any finalized corporate trade transaction below to generate a production-ready digital PDF invoice with QR verification.</p>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {mockReceiptLogs.map(log => (
                  <button
                    key={log.id}
                    id={`receipt-btn-${log.id}`}
                    onClick={() => setActiveReceiptInvoice(log)}
                    className={`w-full bg-neutral-950 border p-3 rounded-2xl flex items-center justify-between text-xs text-left transition cursor-pointer ${
                      activeReceiptInvoice?.id === log.id 
                        ? 'border-amber-500 bg-amber-500/5' 
                        : 'border-neutral-850 hover:border-neutral-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-200 block truncate max-w-[180px]">{log.description}</span>
                      <span className="text-[9px] text-stone-500 block">Date: {log.date}</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-mono font-black block ${
                        log.amount < 0 ? 'text-emerald-400' : 'text-stone-300'
                      }`}>
                        {log.amount < 0 ? `+${Math.abs(log.amount)}` : `-${log.amount}`} ETB
                      </span>
                      <span className="text-[8px] bg-neutral-900 border border-neutral-800 text-stone-400 px-1.5 py-0.2 rounded font-mono">
                        {log.id}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PDF Invoice View */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl flex flex-col justify-between">
              {activeReceiptInvoice ? (
                <div id="invoice-pdf-simulator" className="bg-white text-stone-900 p-5 rounded-2xl space-y-4 relative overflow-hidden flex-1 flex flex-col justify-between shadow-2xl">
                  {/* Traditional Ornament Line inside PDF */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-500" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b pb-3 border-stone-200">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-stone-900">Every-zone Enterprise PLC</h4>
                        <span className="text-[8.5px] text-stone-500 block">Addis Ababa, Ethiopia | TIN-839201948</span>
                      </div>
                      <div className="text-right">
                        <span className="bg-amber-500/10 text-amber-700 text-[8px] font-black px-2 py-0.5 rounded uppercase border border-amber-500/20">
                          Invoice Receipt
                        </span>
                        <span className="text-[8.5px] text-stone-500 block font-mono mt-1">{activeReceiptInvoice.id}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[10px] text-stone-600">
                      <div className="flex justify-between">
                        <span>Transaction Action:</span>
                        <strong className="text-stone-900 font-extrabold">{activeReceiptInvoice.type}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Settled Details:</span>
                        <strong className="text-stone-900 font-extrabold">{activeReceiptInvoice.description}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Settled Timestamp:</span>
                        <span className="text-stone-800 font-mono">{activeReceiptInvoice.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fayda Escrow Reference:</span>
                        <span className="text-stone-800 font-mono">SEC-RELEASE-0921-ET</span>
                      </div>
                    </div>

                    {/* QR Code Verification representation */}
                    <div className="border-t border-dashed border-stone-200 pt-3 flex gap-3 items-center">
                      <div className="bg-neutral-100 p-1.5 rounded-lg border border-stone-250 shrink-0">
                        {/* Interactive Simulated QR Code */}
                        <QrCode className="w-14 h-14 text-stone-900 stroke-[1.5]" />
                      </div>
                      <div className="text-[8.5px] text-stone-500 space-y-0.5 leading-normal">
                        <span className="font-black uppercase text-stone-900 block">Scan to Verify Ledger Integrity</span>
                        <p>This QR-code contains cryptographically authenticated signature hash confirming transaction clearance via Federal Bank of Abyssinia.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t pt-3 border-stone-200 mt-4">
                    <span className="text-[9px] text-stone-500 uppercase font-mono">Amount Paid</span>
                    <span className="text-sm font-black text-stone-900 font-mono">{activeReceiptInvoice.amount} ETB</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center text-stone-500 space-y-3 flex-1 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/20">
                  <FileText className="w-10 h-10 text-stone-700 stroke-[1.5]" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-stone-400">No Receipt Selected</p>
                    <p className="text-[10px] text-stone-500 max-w-[200px] mx-auto">Choose a wallet transaction on the left to review its digital invoice & exportable QR receipt.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: SELLER PERFORMANCE & ANALYTICS */}
        {activeTab === 'performance' && (
          <div className="space-y-6 text-left">
            {/* Scorecard metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { title: 'Performance Score', value: `${sellerPerformance.performanceScore}%`, desc: 'Average fulfillment grade', icon: '🏆', color: 'text-amber-500' },
                { title: 'Response Rate', value: `${sellerPerformance.responseRate}%`, desc: 'Avg response under 12 mins', icon: '💬', color: 'text-indigo-400' },
                { title: 'Delivery Rate', value: `${sellerPerformance.deliveryRate}%`, desc: 'Same day dispatch ratio', icon: '🏍️', color: 'text-emerald-400' },
                { title: 'Review Rating', value: `${sellerPerformance.reviewRating} / 5.0`, desc: 'From certified marketplace reviews', icon: '★', color: 'text-yellow-400' },
                { title: 'Fayda Trust Score', value: `${sellerPerformance.trustScore}%`, desc: 'Biometric identity credential', icon: '🛡️', color: 'text-blue-400' }
              ].map((card, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-850 p-4 rounded-3xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-stone-400 uppercase font-mono">{card.title}</span>
                    <span className={card.color}>{card.icon}</span>
                  </div>
                  <h3 className="text-lg font-black font-mono text-stone-100">{card.value}</h3>
                  <p className="text-[8.5px] text-stone-500 leading-tight">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Recharts Analytics Charts */}
            <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-extrabold text-stone-100">Every-zone Corporate Monetization Analytics</h3>
                  <p className="text-[10px] text-stone-500">Real-time breakdown of subscriptions, boost injections, and native ad partner revenue (ETB).</p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] px-2 py-0.5 rounded font-black uppercase font-mono">
                    Updated: Real-time
                  </span>
                </div>
              </div>

              {/* Chart Stage */}
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" />
                    <XAxis dataKey="month" stroke="#78716c" fontSize={10} tickLine={false} />
                    <YAxis stroke="#78716c" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0c0a09', borderColor: '#292524', color: '#f5f5f4', fontSize: '11px', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="Revenue" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="Subscriptions" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSubs)" />
                    <Area type="monotone" dataKey="BoostSales" stroke="#10b981" strokeWidth={1.5} fillOpacity={0} />
                    <Area type="monotone" dataKey="AdRevenue" stroke="#8b5cf6" strokeWidth={1.5} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: CENTRAL ADMINISTRATION CONTROLS */}
        {activeTab === 'admin' && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-stone-100 flex items-center gap-1.5">
                <ShieldCheck className="text-amber-500 w-5 h-5" />
                <span>Central Monetization & Content Control</span>
              </h2>
              <p className="text-xs text-stone-400">Review submitted seller spotlight requests, monitor global platform revenue metrics, and moderate merchant trade coupon definitions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Promotion approvals */}
              <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl md:col-span-2 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 border-b pb-2 border-neutral-850">
                  📋 Promotion Approval & Review Queue
                </h3>

                <div className="space-y-2 max-h-[320px] overflow-y-auto no-scrollbar">
                  {adminRequests.map(req => (
                    <div 
                      key={req.id}
                      className="bg-neutral-950 border border-neutral-850 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-[10px] text-amber-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.2 rounded">
                            {req.id}
                          </span>
                          <span className="text-[9px] text-stone-400 uppercase font-mono">
                            {req.promoType}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-stone-200">
                          Item: "{req.item}"
                        </p>
                        <p className="text-[10px] text-stone-500">
                          Vendor: {req.vendor} | Escrow Deposit: <strong className="text-stone-300 font-mono">{req.cost} ETB</strong>
                        </p>
                      </div>

                      <div className="flex gap-2 self-stretch sm:self-auto justify-end">
                        {req.status === 'PENDING' ? (
                          <>
                            <button
                              id={`approve-${req.id}`}
                              onClick={() => handleAdminApprove(req.id, 'APPROVED')}
                              className="bg-emerald-500 hover:bg-emerald-600 text-neutral-950 px-3 py-1.5 rounded-xl font-bold text-[10px] cursor-pointer transition"
                            >
                              Approve ✓
                            </button>
                            <button
                              id={`reject-${req.id}`}
                              onClick={() => handleAdminApprove(req.id, 'REJECTED')}
                              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-rose-400 px-3 py-1.5 rounded-xl font-bold text-[10px] cursor-pointer transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`text-[10px] font-black uppercase tracking-wider font-mono px-3 py-1.5 rounded-xl border ${
                            req.status === 'APPROVED' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                          }`}>
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative analytics summary card */}
              <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-3xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 border-b pb-2 border-neutral-850">
                  📊 Platform Revenue Breakdown
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Total Subscription Revenue:</span>
                    <span className="font-bold font-mono text-stone-200">23,400 ETB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Listing Boost Sells:</span>
                    <span className="font-bold font-mono text-stone-200">14,200 ETB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Native Sponsored Ad Spend:</span>
                    <span className="font-bold font-mono text-stone-200">18,500 ETB</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-neutral-850 pt-2.5">
                    <span className="text-stone-400">Affiliate Referral Payouts:</span>
                    <span className="font-bold font-mono text-rose-400">-3,200 ETB</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-neutral-800 pt-3">
                    <span className="text-stone-350 font-black">Net Platform Revenue:</span>
                    <span className="text-sm font-black font-mono text-emerald-400">52,900 ETB</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-850">
                  <button
                    onClick={() => alert('📊 Generating downloadable corporate audit CSV file. Trade certificate: ET-SEC-9400')}
                    className="w-full bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-stone-300 py-2.5 rounded-xl text-[11px] font-bold cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>Download Audit Report (CSV)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
