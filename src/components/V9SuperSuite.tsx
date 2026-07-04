import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rss, Tv, Search, Shuffle, FileText, Clock, Award, Users, DollarSign, 
  ShieldAlert, UserCheck, Play, Heart, Send, Check, X, Bookmark, Plus, 
  Trash2, ArrowRightLeft, QrCode, Download, Share2, AwardIcon, Trophy, 
  Sparkles, TrendingUp, BarChart2, ShieldCheck, Mail, MessageSquare, PlusCircle, UserPlus, Info 
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface V9SuperSuiteProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  onClose: () => void;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
}

export function V9SuperSuite({
  isDarkMode,
  lang,
  triggerPushNotification,
  onClose,
  walletBalance,
  setWalletBalance
}: V9SuperSuiteProps) {
  const [activeTab, setActiveTab] = useState<string>('feed');

  // --- 1. ACTIVITY FEED STATE ---
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 'f-1',
      category: 'LIVE',
      author: 'Abeba Textiles PLC',
      avatar: '🛍️',
      time: 'Just Now',
      title: '🚨 Abeba Live Shopping is Streaming!',
      body: 'Demonstrating traditional Tibeb dresses and offering 20% discount on order matching in the next 15 minutes. Join now!',
      likes: 42,
      comments: 11,
      hasLiked: false,
      badgeColor: 'bg-red-500 text-white animate-pulse',
      actionText: 'Watch Stream 🎥'
    },
    {
      id: 'f-2',
      category: 'NEW PRODUCT',
      author: 'Organic Coffee Importers',
      avatar: '☕',
      time: '15 mins ago',
      title: 'Yirgacheffe Grade 1 Special Roast',
      body: 'Freshly harvested specialty green coffee from the high-altitude Gedeo zone. Full city roast profile with honey notes.',
      price: '650 ETB / 500g',
      likes: 128,
      comments: 34,
      hasLiked: false,
      badgeColor: 'bg-emerald-500 text-white',
      actionText: 'View Product ☕'
    },
    {
      id: 'f-3',
      category: 'FLASH SALE',
      author: 'Zewditu Leather Crafts',
      avatar: '👜',
      time: '45 mins ago',
      title: '⚡ Flash Sale: 35% OFF Luxury Purses',
      body: 'Only 4 units left of our signature brown embossed goat leather handbag. Free delivery in Addis Ababa!',
      price: '2,900 ETB (was 4,500 ETB)',
      likes: 89,
      comments: 19,
      hasLiked: false,
      badgeColor: 'bg-amber-500 text-zinc-950 font-black animate-bounce',
      actionText: 'Buy Instantly ⚡'
    },
    {
      id: 'f-4',
      category: 'OVERSEAS JOB',
      author: 'Global Agency Placement',
      avatar: '✈️',
      time: '2 hours ago',
      title: 'Dubai Heavy Transport Drivers (10 Openings)',
      body: 'Verified agency job vacancy. Generous overtime, accommodation, and round-trip airfare fully covered. Verified by Ministry of Labor.',
      price: '3,800 AED / Month',
      likes: 215,
      comments: 72,
      hasLiked: false,
      badgeColor: 'bg-blue-600 text-white',
      actionText: 'Apply Securely ✈️'
    },
    {
      id: 'f-5',
      category: 'NEW HOUSE',
      author: 'Bole Premium Properties',
      avatar: '🏡',
      time: '4 hours ago',
      title: '3-Bedroom Modern Condo in Bole',
      body: 'Under 10 million! Safe Gated Community, multi-level security, backup power generator, and private balcony. Perfect for families.',
      price: '9,400,000 ETB',
      likes: 304,
      comments: 98,
      hasLiked: false,
      badgeColor: 'bg-indigo-600 text-white',
      actionText: 'Inspect Property 🏡'
    },
    {
      id: 'f-6',
      category: 'LOTTERY WINNER',
      author: 'National Zone Tombola',
      avatar: '🎟️',
      time: '1 day ago',
      title: '🎉 Lot #9217 Grand Prize Claimed!',
      body: 'Congratulations to Elias M. from Hawassa who won the 100,000 ETB Wallet Balance Voucher using only a 10 ETB Zone Ticket.',
      likes: 512,
      comments: 145,
      hasLiked: false,
      badgeColor: 'bg-purple-600 text-white',
      actionText: 'View Winners Hub 🏆'
    },
    {
      id: 'f-7',
      category: 'MATCH RECOMMENDATION',
      author: 'Zone AI Matchmaking',
      avatar: '❤️',
      time: '1 day ago',
      title: '✨ Daily Cognitive Compatibility Match',
      body: 'Our AI has identified 3 verified profiles in Addis Ababa sharing high cultural alignment and professional goals with your profile.',
      likes: 74,
      comments: 8,
      hasLiked: false,
      badgeColor: 'bg-pink-500 text-white',
      actionText: 'Explore Matches ❤️'
    }
  ]);

  const handleLikePost = (postId: string) => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  // --- 2. VENDOR LIVE SHOPPING STATE ---
  const [liveLikes, setLiveLikes] = useState(1402);
  const [isLikingLive, setIsLikingLive] = useState(false);
  const [liveComments, setLiveComments] = useState([
    { id: 1, user: 'Kidus_A', text: 'Does it come in Dark Blue? 🙏' },
    { id: 2, user: 'Selam_T', text: 'Is shipping free in Bole area?' },
    { id: 3, user: 'Dr_Elias', text: 'Quality looks premium! ordering now' },
    { id: 4, user: 'Tsige_H', text: 'Can I pay with Telebirr? 💳' }
  ]);
  const [newLiveComment, setNewLiveComment] = useState('');
  const [askQuestionText, setAskQuestionText] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<string | null>(
    'How long is the local warranty on the stitching?'
  );

  const handleSendLiveComment = () => {
    if (!newLiveComment.trim()) return;
    setLiveComments(prev => [...prev, { id: Date.now(), user: 'You_Verified', text: newLiveComment }]);
    setNewLiveComment('');
  };

  const handleAskQuestion = () => {
    if (!askQuestionText.trim()) return;
    setActiveQuestion(askQuestionText);
    setAskQuestionText('');
    triggerPushNotification(
      '🎙️ Question Broadcasted',
      'Your question has been highlighted to the Vendor Host!',
      '🎙️',
      'live'
    );
  };

  const handleLikeLive = () => {
    setLiveLikes(prev => prev + 1);
    setIsLikingLive(true);
    setTimeout(() => setIsLikingLive(false), 200);
  };

  // --- 3. SAVED SEARCH STATE ---
  const [savedSearches, setSavedSearches] = useState<{ id: string; term: string; date: string; category: string }[]>(() => {
    const saved = localStorage.getItem('ez_saved_searches');
    return saved ? JSON.parse(saved) : [
      { id: 's-1', term: 'Dubai Driver Jobs', date: 'Jul 2, 2026', category: 'JOBS' },
      { id: 's-2', term: 'Bole House under 10 million', date: 'Jul 3, 2026', category: 'HOUSES' },
      { id: 's-3', term: 'Grade-A Refurbished iPhone', date: 'Jul 4, 2026', category: 'PRODUCTS' }
    ];
  });
  const [newSearchTerm, setNewSearchTerm] = useState('');

  const saveSearchItem = () => {
    if (!newSearchTerm.trim()) return;
    const item = {
      id: `s-${Date.now()}`,
      term: newSearchTerm,
      date: 'Today',
      category: 'GENERAL'
    };
    const updated = [...savedSearches, item];
    setSavedSearches(updated);
    localStorage.setItem('ez_saved_searches', JSON.stringify(updated));
    setNewSearchTerm('');
    triggerPushNotification('🔍 Search Saved', `Successfully subscribed to alerts for "${item.term}"`, '🔍', 'search');
  };

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('ez_saved_searches', JSON.stringify(updated));
  };

  const triggerSimulatedMatch = (term: string) => {
    triggerPushNotification(
      '🔥 NEW ALERT MATCH!',
      `AI Found a new entry matching your saved search "${term}": "Dubai Logistics Heavy Trucker Visa Package" available now!`,
      '💼',
      'alert'
    );
  };

  // --- 4. SMART COMPARE STATE ---
  const [compareCategory, setCompareCategory] = useState<'PRODUCT' | 'HOUSE' | 'JOB'>('PRODUCT');
  const [compareItems, setCompareItems] = useState({
    itemA: '0',
    itemB: '1'
  });

  const productOptions = [
    { id: '0', name: 'Refurbished iPhone 13 Pro', price: '44,500 ETB', spec1: '128GB Storage', spec2: 'A15 Bionic CPU', spec3: 'Grade A Refurbished', spec4: '6 Months Warranty' },
    { id: '1', name: 'New Xiaomi Redmi Note 13', price: '29,800 ETB', spec1: '256GB Storage', spec2: 'Snapdragon CPU', spec3: 'Brand New Boxed', spec4: '1 Year Warranty' },
    { id: '2', name: 'Samsung S22 Ultra (Used)', price: '58,000 ETB', spec1: '256GB Storage', spec2: 'Exynos CPU', spec3: 'Slight Scratches', spec4: '3 Months Warranty' }
  ];

  const houseOptions = [
    { id: '0', name: 'Deluxe Bole Villa', price: '9,400,000 ETB', spec1: 'Bole Gated Zone', spec2: '3 Bedrooms, 2 Bath', spec3: 'Brand New Built', spec4: 'Backup Generator, Security Guard' },
    { id: '1', name: 'CMC Luxury Apartment', price: '7,800,000 ETB', spec1: 'CMC Condominium', spec2: '2 Bedrooms, 2 Bath', spec3: 'Fully Finished Interior', spec4: 'Dedicated Parking Slot' },
    { id: '2', name: 'Old Airport Cozy Villa', price: '12,500,000 ETB', spec1: 'Old Airport Area', spec2: '4 Bedrooms, 3 Bath', spec3: 'Spacious Front Yard', spec4: 'Servants Quarter Annex' }
  ];

  const jobOptions = [
    { id: '0', name: 'Dubai Heavy Truck Driver', price: '3,800 AED / mo', spec1: 'Heavy Vehicle License', spec2: 'Accommodation Provided', spec3: 'Agency Visa & Airfare paid', spec4: 'Renewable 2-Year Contract' },
    { id: '1', name: 'Saudi Hospitality Staff', price: '2,500 SAR / mo', spec1: 'Basic English required', spec2: 'Shared Lodging & Meal Plan', spec3: 'Agency placement certified', spec4: 'Single-entry seasonal contract' },
    { id: '2', name: 'Qatar Warehousing Assistant', price: '2,200 QAR / mo', spec1: 'No experience needed', spec2: 'Health insurance included', spec3: 'Overtime hours multiplier', spec4: 'Immediate agency deployment' }
  ];

  // --- 5. DIGITAL RECEIPTS STATE ---
  const [selectedReceipt, setSelectedReceipt] = useState({
    invoiceNo: 'EZ-INV-2026-904',
    date: 'July 4, 2026',
    customerName: 'Abdi Elias',
    items: [
      { name: 'Habesha Luxury Makeda Dress', qty: 1, price: 4200 },
      { name: 'Yirgacheffe Specialty Coffee Beans (1kg)', qty: 1, price: 1100 }
    ],
    subtotal: 5300,
    escrowFee: 50,
    pointsAccrued: 53,
    total: 5350,
    paymentMode: 'Telebirr Escrow Secure',
    qrCodeValue: 'https://every-zone.com/verify/invoice/EZ-INV-2026-904',
    isVerified: true
  });

  const handleDownloadInvoice = () => {
    alert(`📥 [PDF EXPORT HANDSHAKE]\n\nDownloading ${selectedReceipt.invoiceNo}.pdf to local filesystem. Format signed by Ethio-Telecom Cryptographic Signatures.`);
    triggerPushNotification('🧾 Invoice Downloaded', `Digital Receipt ${selectedReceipt.invoiceNo} successfully saved.`, '🧾', 'invoice');
  };

  const handleShareInvoice = () => {
    alert(`📤 Generating Secure Quick-Share Telegram Gateway Link:\n\n"Check my verified receipt of ${selectedReceipt.total} ETB on Every-zone!"`);
  };

  // --- 6. RECENTLY VIEWED STATE ---
  const [recentlyViewed, setRecentlyViewed] = useState([
    { id: 'rv-1', category: 'PRODUCT', title: 'Refurbished Grade A iPhone 13 Pro', price: '44,500 ETB', store: 'Kidus Gadgets' },
    { id: 'rv-2', category: 'HOUSE', title: 'Deluxe Bole Modern Villa', price: '9,400,000 ETB', store: 'Bole Homes' },
    { id: 'rv-3', category: 'JOB', title: 'Dubai Professional Truck Driver vacancy', price: '3,800 AED / Mo', store: 'Express Agencies' },
    { id: 'rv-4', category: 'SERVICE', title: 'Ethiopian Passport Fast-Track Consultation', price: '4,500 ETB', store: 'Passport Bureau Agent' }
  ]);

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  // --- 7. LOYALTY & REWARDS STATE ---
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => {
    const saved = localStorage.getItem('ez_loyalty_points');
    return saved ? parseInt(saved, 10) : 345;
  });

  const getMembershipLevel = (pts: number) => {
    if (pts >= 1000) return { title: '💎 Platinum Elite', color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5', discount: '5% Checkout CashBack' };
    if (pts >= 500) return { title: '🥇 Gold Benefactor', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5', discount: '3% Checkout CashBack' };
    if (pts >= 200) return { title: '🥈 Silver Supporter', color: 'text-stone-300 border-stone-300/30 bg-stone-300/5', discount: '1.5% Checkout CashBack' };
    return { title: '🥉 Bronze Member', color: 'text-amber-600 border-amber-600/30 bg-amber-600/5', discount: 'Standard rewards access' };
  };

  const membership = getMembershipLevel(loyaltyPoints);

  const claimLoyaltyReward = (ptsCost: number, rewardTitle: string) => {
    if (loyaltyPoints < ptsCost) {
      alert('⚠️ Insufficient loyalty points for this redemption!');
      return;
    }
    setLoyaltyPoints(prev => {
      const next = prev - ptsCost;
      localStorage.setItem('ez_loyalty_points', next.toString());
      return next;
    });
    alert(`🎉 Successfully redeemed reward: ${rewardTitle}! Applied voucher directly to checkout checkout.`);
    triggerPushNotification('🎁 Reward Redeemed!', `You successfully redeemed "${rewardTitle}" for ${ptsCost} points!`, '🎁', 'rewards');
  };

  // --- 8. REFERRAL SYSTEM HUB ---
  const [referralCode, setReferralCode] = useState('ZONE-ABI-8422');
  const [referrals, setReferrals] = useState([
    { name: 'Kidus Solomon', date: 'Jul 1, 2026', commission: '150 ETB', status: 'PAID' },
    { name: 'Selam Hailu', date: 'Jul 3, 2026', commission: '250 ETB', status: 'PAID' },
    { name: 'Yosef Alemu', date: 'Jul 4, 2026', commission: '0 ETB', status: 'PENDING' }
  ]);
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Elias_M', referrals: 412, earning: '41,200 ETB' },
    { rank: 2, name: 'Saba_H', referrals: 304, earning: '30,400 ETB' },
    { rank: 3, name: 'Dr_Daniel', referrals: 189, earning: '18,900 ETB' },
    { rank: 4, name: 'You_Verified', referrals: 45, earning: '4,500 ETB' }
  ]);

  const triggerSimulatedInvite = () => {
    const names = ['Henok T.', 'Meron A.', 'Tewodros B.', 'Helen G.'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newRef = { name: randomName, date: 'Today', commission: '100 ETB', status: 'PENDING' };
    setReferrals(prev => [newRef, ...prev]);
    setLoyaltyPoints(prev => prev + 25);
    alert(`👥 [SIMULATION SUCCESS]\n\nYour friend ${randomName} signed up using your link! You earned 100 ETB pending commission and +25 Loyalty points.`);
    triggerPushNotification('👥 New Referral Joined!', `${randomName} is now active on Every-zone using your code.`, '👥', 'referral');
  };

  // --- 9. AI PRICE SUGGESTION TOOL (For Vendors) ---
  const [suggestName, setSuggestName] = useState('Habesha Kemis Tibeb');
  const [suggestCategory, setSuggestCategory] = useState('Handicrafts');
  const [suggestResults, setSuggestResults] = useState<{
    price: string;
    demand: string;
    competition: string;
    bestCat: string;
  } | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const calculateAiPricing = () => {
    setSuggestLoading(true);
    setTimeout(() => {
      setSuggestLoading(false);
      const hash = suggestName.length % 3;
      if (hash === 0) {
        setSuggestResults({
          price: '4,200 ETB - 4,800 ETB',
          demand: 'HIGH (88/100) - Holiday Season',
          competition: 'MEDIUM (60/100) - High variety competitors',
          bestCat: 'Traditional Apparel / Tibeb Dresses'
        });
      } else if (hash === 1) {
        setSuggestResults({
          price: '1,200 ETB - 1,500 ETB',
          demand: 'MEDIUM (54/100)',
          competition: 'HIGH (85/100)',
          bestCat: 'Packaged Organic Spices & Teas'
        });
      } else {
        setSuggestResults({
          price: '800 ETB - 1,100 ETB',
          demand: 'VERY HIGH (94/100)',
          competition: 'LOW (25/100) - Scarce raw supply',
          bestCat: 'Premium Specialty Coffee / Gedeo Zone'
        });
      }
    }, 800);
  };

  // --- 10. AI FRAUD DETECTION DASHBOARD ---
  const [fraudScans, setFraudScans] = useState([
    { id: 'sc-1', type: 'SPAM REVIEW', target: 'Xiaomi Redmi Note 13', severity: 'HIGH', action: 'FLAGGED & INVISIBLE', message: 'Identified identical text patterns block across 5 accounts from identical IP pool.' },
    { id: 'sc-2', type: 'DUPLICATE ACC', target: 'User_Yosef_818', severity: 'MEDIUM', action: 'UNDER COGNITIVE AUDIT', message: 'Shared national ID hash matching deactivated fraudulent credential database.' },
    { id: 'sc-3', type: 'FAKE SALE', target: 'Grade-A 100 ETB Flash item', severity: 'LOW', action: 'RESOLVED - GENUINE', message: 'Abnormal low price checked against vendor escrow holding. Fully collateralized.' }
  ]);

  const runActiveFraudSweep = () => {
    triggerPushNotification(
      '🤖 AI Fraud Guard Scan',
      'Scanning cognitive indices, review pools, and escrow logs for non-authentic behavior...',
      '🤖',
      'fraud'
    );
    alert('🤖 [AI Cognitive Fraud Scan Launched]\n\nZero duplicates found in active memory cache. All current reviews score >0.92 on the authenticity confidence index.');
  };

  // --- 11. MINI CRM FOR VENDORS ---
  const [crmCustomers, setCrmCustomers] = useState([
    { id: 'c-1', name: 'Selamawit Tekle', vip: true, orders: 12, notes: 'Prefers red accent Tibeb borders, quick direct payout', birthday: 'July 18 (Sends Discount Voucher)', totalSpent: '54,200 ETB' },
    { id: 'c-2', name: 'Kidus Solomon', vip: false, orders: 4, notes: 'Requires fast delivery in CMC area, usually pays cash escrow', birthday: 'Oct 12', totalSpent: '12,400 ETB' },
    { id: 'c-3', name: 'Tsige Haile', vip: true, orders: 8, notes: 'Enthusiastic leather product collector, responds well to VIP deals', birthday: 'July 6 (Birthday Soon!)', totalSpent: '31,500 ETB' }
  ]);
  const [newCrmNotes, setNewCrmNotes] = useState<{ [key: string]: string }>({});

  const handleUpdateCrmNotes = (id: string, text: string) => {
    setNewCrmNotes(prev => ({ ...prev, [id]: text }));
  };

  const saveCrmNotes = (id: string) => {
    const text = newCrmNotes[id];
    if (text === undefined) return;
    setCrmCustomers(prev => prev.map(c => c.id === id ? { ...c, notes: text } : c));
    alert('📝 Customer notes updated successfully in Mini-CRM cache.');
  };

  // --- 12. VENDOR SUBSCRIPTION TIERS ---
  const [activeVendorSub, setActiveVendorSub] = useState<'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'>('FREE');

  const vendorPlans = [
    { name: 'FREE', price: '0 ETB', fee: '5%', live: 'No Live Shopping', support: 'Standard Helpdesk', badge: 'bg-stone-500/20 text-stone-400' },
    { name: 'STARTER', price: '450 ETB/mo', fee: '2.5%', live: 'Audio live streams', support: '24h Ticketing', badge: 'bg-blue-500/20 text-blue-400' },
    { name: 'PROFESSIONAL', price: '1,200 ETB/mo', fee: '1.2%', live: 'Full Video Live Shopping + QA', support: 'Priority Instant Escrow Support', badge: 'bg-amber-500/20 text-amber-500' },
    { name: 'ENTERPRISE', price: '3,500 ETB/mo', fee: '0.5%', live: 'Dedicated studio stream + multi-host', support: 'Personal CRM and Escrow Audit Agent', badge: 'bg-purple-500/20 text-purple-400' }
  ];

  // --- 13. USER VERIFICATION TIERS ---
  const [activeUserVerif, setActiveUserVerif] = useState<'BASIC' | 'VERIFIED' | 'PREMIUM' | 'ELITE'>('BASIC');

  const verificationLevels = [
    { name: 'BASIC', req: 'Email & Phone Number', perks: 'Buy products, standard service access', badge: 'bg-stone-500 text-stone-100' },
    { name: 'VERIFIED', req: 'Fayda National ID Scan', perks: 'Escrow payment active, buy land/houses, lottery participation', badge: 'bg-green-600 text-white' },
    { name: 'PREMIUM', req: 'Fayda + Bank biometric link', perks: 'Instant 15,000 ETB overdraft wallet, priority dispatch courier', badge: 'bg-amber-500 text-zinc-950 font-black' },
    { name: 'ELITE', req: 'Verified Enterprise registration', perks: 'Zero fee direct settlements, customized passport bureau priority', badge: 'bg-purple-600 text-white' }
  ];

  return (
    <div className={`w-full rounded-3xl border shadow-xl flex flex-col overflow-hidden ${
      isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-100' : 'bg-stone-50 border-stone-200 text-stone-900'
    }`}>
      {/* Title block */}
      <div className="p-4 border-b border-stone-200/50 dark:border-zinc-900/50 flex justify-between items-center bg-stone-100/40 dark:bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌟</span>
          <div className="text-left">
            <h2 className="text-sm font-black uppercase tracking-wider font-sans text-amber-500 flex items-center gap-1.5">
              Every-Zone Suite V9
            </h2>
            <p className="text-[9px] opacity-65 font-mono">13 Unified Cognitive Features Active</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-zinc-800 transition text-stone-500 dark:text-zinc-400"
        >
          <X size={16} />
        </button>
      </div>

      {/* Grid of sub-tabs */}
      <div className="flex flex-wrap border-b border-stone-200/50 dark:border-zinc-900/50 p-2 gap-1 bg-stone-100/10 dark:bg-zinc-950/20">
        {[
          { id: 'feed', icon: <Rss size={11} />, label: 'Activity Feed' },
          { id: 'live', icon: <Tv size={11} />, label: 'Vendor Live 🔴' },
          { id: 'saved', icon: <Search size={11} />, label: 'Saved Searches' },
          { id: 'compare', icon: <Shuffle size={11} />, label: 'Smart Compare' },
          { id: 'receipts', icon: <FileText size={11} />, label: 'Digital Receipts' },
          { id: 'recently', icon: <Clock size={11} />, label: 'Recently Viewed' },
          { id: 'loyalty', icon: <Award size={11} />, label: 'Loyalty & Levels' },
          { id: 'referral', icon: <Users size={11} />, label: 'Referrals Hub' },
          { id: 'pricing', icon: <DollarSign size={11} />, label: 'AI Price Predictor' },
          { id: 'fraud', icon: <ShieldAlert size={11} />, label: 'Fraud Monitor' },
          { id: 'crm', icon: <MessageSquare size={11} />, label: 'Mini-CRM' },
          { id: 'billing', icon: <UserCheck size={11} />, label: 'Subs & Verification' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-wider ${
              activeTab === t.id
                ? (isDarkMode ? 'bg-amber-500 text-zinc-950 shadow' : 'bg-[#1E3A1A] text-white shadow')
                : (isDarkMode ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50')
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[580px]">
        <AnimatePresence mode="wait">
          
          {/* 1. ACTIVITY FEED TAB */}
          {activeTab === 'feed' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-stone-200/50 dark:border-zinc-900/50 pb-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-500">📢 Global Ecosystem Feed</h3>
                  <p className="text-[9px] opacity-60">Facebook &amp; LinkedIn style social timeline of Every-zone activities</p>
                </div>
                <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full font-mono font-black animate-pulse">
                  7 Active Signals
                </span>
              </div>

              {/* Status Bar */}
              <div className={`p-3 rounded-2xl border flex items-center gap-3 ${isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-white border-stone-150'}`}>
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xs">
                  ME
                </div>
                <input 
                  type="text" 
                  placeholder="Share a new verified listing, review, or flash sale idea with your zone..."
                  disabled
                  className="flex-1 bg-stone-100/50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs outline-none opacity-60 cursor-not-allowed"
                />
              </div>

              {/* Posts Timeline */}
              <div className="space-y-3.5">
                {feedPosts.map((post) => (
                  <div 
                    key={post.id}
                    className={`p-4 rounded-3xl border space-y-3 transition-all hover:scale-[1.005] ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-base">
                          {post.avatar}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-stone-850 dark:text-zinc-100">{post.author}</h4>
                          <span className="text-[8px] font-mono text-stone-450">{post.time}</span>
                        </div>
                      </div>

                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${post.badgeColor}`}>
                        {post.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-extrabold text-[#C5A059]">{post.title}</h5>
                      <p className="text-[11px] leading-relaxed opacity-85 font-sans">{post.body}</p>
                      {post.price && (
                        <div className="text-xs font-mono font-black text-amber-500 bg-amber-500/5 px-2 py-1 rounded-lg inline-block">
                          🏷️ {post.price}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-2.5 border-t border-stone-100 dark:border-zinc-850">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 text-[10px] font-bold ${
                            post.hasLiked ? 'text-rose-500' : 'text-stone-450 hover:text-stone-300'
                          }`}
                        >
                          <Heart size={12} className={post.hasLiked ? 'fill-rose-500' : ''} />
                          <span>{post.likes}</span>
                        </button>
                        <span className="flex items-center gap-1.5 text-[10px] text-stone-450 font-sans">
                          <MessageSquare size={12} />
                          <span>{post.comments} comments</span>
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          alert(`Opening related deep module route for ${post.category}: "${post.title}"`);
                        }}
                        className="text-[9.5px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/5 border border-amber-500/20 px-3 py-1 rounded-xl hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer"
                      >
                        {post.actionText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. VENDOR LIVE SHOPPING TAB */}
          {activeTab === 'live' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 text-left"
            >
              {/* Left Column: Simulated Stream Player */}
              <div className="md:col-span-7 space-y-3">
                <div className="relative rounded-3xl overflow-hidden border border-red-500 bg-zinc-950 aspect-video flex flex-col justify-between p-4 shadow-xl shadow-red-500/5">
                  
                  {/* Stream Indicator overlays */}
                  <div className="flex justify-between items-start z-10">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 text-white font-mono font-black text-[8px] uppercase px-2 py-0.5 rounded animate-pulse">
                        🔴 LIVE STREAM
                      </span>
                      <span className="bg-black/60 text-white font-mono text-[8.5px] px-2 py-0.5 rounded-full flex items-center gap-1.5">
                        👁️ 1.2K watching
                      </span>
                    </div>

                    <div className="bg-black/60 text-white font-mono text-[8.5px] px-2 py-0.5 rounded-full flex items-center gap-1 text-rose-500">
                      ❤️ <span className="font-bold text-white">{liveLikes}</span>
                    </div>
                  </div>

                  {/* Simulated Stream video illustration / animation */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                    <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500">Broadcasting tibeb live studio feed...</span>
                  </div>

                  {/* Active Question Highlight Overlays */}
                  {activeQuestion && (
                    <div className="z-10 bg-gradient-to-r from-amber-500 to-yellow-600 p-2.5 rounded-2xl max-w-xs text-zinc-950 shadow-md">
                      <span className="text-[8px] font-black uppercase tracking-wider block text-zinc-900">Highlighted Question</span>
                      <p className="text-[10px] font-bold leading-normal">"{activeQuestion}"</p>
                    </div>
                  )}

                  {/* Bottom: buy while watching overlay */}
                  <div className="z-10 bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👗</span>
                      <div className="text-left">
                        <span className="text-[8px] text-amber-500 font-extrabold uppercase block tracking-wider">Live Deal (20% OFF)</span>
                        <h6 className="text-[10.5px] font-bold text-zinc-100 truncate max-w-[150px]">Luxury Tibeb Makeda Dress</h6>
                        <span className="text-[10px] font-mono text-zinc-300">3,360 ETB <span className="line-through text-zinc-500 text-[8px]">4,200 ETB</span></span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setWalletBalance(prev => {
                          if (prev < 3360) {
                            alert('⚠️ Insufficient funds in wallet! Load wallet first.');
                            return prev;
                          }
                          const next = prev - 3360;
                          localStorage.setItem('ez_wallet_balance', next.toString());
                          alert('🎉 Order placed successfully via Live stream! Escrow deposit locked.');
                          triggerPushNotification('👗 Stream Purchase Complete!', 'You bought the Luxury Makeda Dress directly from the Live stream.', '🛍️', 'purchase');
                          return next;
                        });
                      }}
                      className="bg-red-500 hover:bg-red-400 text-white font-black text-[9px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition cursor-pointer"
                    >
                      Buy Now 🛒
                    </button>
                  </div>
                </div>

                {/* Question Broadcast Form */}
                <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block mb-1">🎙️ Ask Live Question to Host</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Can you show the back embroidery details?" 
                      value={askQuestionText}
                      onChange={(e) => setAskQuestionText(e.target.value)}
                      className={`flex-1 text-xs p-2 rounded-xl border outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-650' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
                      }`}
                    />
                    <button 
                      onClick={handleAskQuestion}
                      className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[10px] uppercase px-3.5 py-1 rounded-xl cursor-pointer"
                    >
                      Ask Host
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Likes & Scrolling Chat comment block */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-3 h-[320px] md:h-auto">
                <div className={`flex-1 p-3 rounded-3xl border flex flex-col justify-between ${
                  isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-white border-stone-200'
                }`}>
                  <div className="border-b border-stone-200/50 dark:border-zinc-850 pb-2 mb-2">
                    <h4 className="text-[10px] font-black uppercase text-stone-400">💬 Live Scrolling Comments</h4>
                  </div>

                  {/* Comments scroll pane */}
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-48 pr-1">
                    {liveComments.map(c => (
                      <div key={c.id} className="text-[10.5px] leading-relaxed">
                        <strong className="text-amber-500 mr-1.5 font-mono">@{c.user}:</strong>
                        <span className="opacity-90">{c.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Input form */}
                  <div className="flex gap-1.5 pt-2 border-t border-stone-100 dark:border-zinc-850">
                    <input 
                      type="text" 
                      placeholder="Say something friendly..." 
                      value={newLiveComment}
                      onChange={(e) => setNewLiveComment(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendLiveComment(); }}
                      className={`flex-1 text-[10.5px] p-2 rounded-xl border outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-800'
                      }`}
                    />
                    <button 
                      onClick={handleSendLiveComment}
                      className={`p-2 rounded-xl border transition ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Send size={12} />
                    </button>
                    <button 
                      onClick={handleLikeLive}
                      className={`p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 transition active:scale-90 ${isLikingLive ? 'scale-110 bg-rose-500/20' : ''}`}
                    >
                      <Heart size={12} className="fill-rose-500" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-red-500/5 border border-dashed border-red-500/20 rounded-2xl flex items-center gap-2">
                  <span className="text-base">🍿</span>
                  <p className="text-[9px] text-red-500 leading-normal">
                    <strong>TikTok Shop &amp; Amazon Live Experience:</strong> Tap the heart button rapidly to dispatch micro-likes directly to the live stream queue!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. SAVED SEARCHES TAB */}
          {activeTab === 'saved' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div>
                <h3 className="text-xs font-black uppercase text-amber-500">🔍 Real-Time Alert Saved Searches</h3>
                <p className="text-[9px] opacity-60">Subscribe to any keywords or listings and get instant push notifications when matching records hit the network.</p>
              </div>

              {/* Add search term */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Dubai Driver Jobs, Bole House under 10M, iPhone 13..."
                  value={newSearchTerm}
                  onChange={(e) => setNewSearchTerm(e.target.value)}
                  className={`flex-1 text-xs p-3 rounded-2xl border outline-none ${
                    isDarkMode ? 'bg-zinc-90 w-100 bg-zinc-900 border-zinc-850 text-zinc-200' : 'bg-white border-stone-250 text-stone-900'
                  }`}
                />
                <button
                  onClick={saveSearchItem}
                  className="bg-[#1E3A1A] hover:bg-[#2e5728] text-white font-black text-xs px-5 py-3 rounded-2xl transition tracking-wider uppercase shrink-0"
                >
                  Save Alert
                </button>
              </div>

              {/* Active Alerts List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[9px] font-black uppercase text-stone-450 tracking-wider">Active Search Alert Pipelines</h4>
                {savedSearches.length === 0 ? (
                  <p className="text-xs text-stone-400 py-6 text-center">No active saved search alerts.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedSearches.map((s) => (
                      <div 
                        key={s.id} 
                        className={`p-3 rounded-2xl border flex justify-between items-center ${
                          isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="text-left space-y-0.5">
                          <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 px-1.5 py-0.2 rounded uppercase">
                            {s.category}
                          </span>
                          <h5 className="text-xs font-bold text-stone-800 dark:text-zinc-100">{s.term}</h5>
                          <p className="text-[8.5px] opacity-50">Saved {s.date}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => triggerSimulatedMatch(s.term)}
                            className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-[9px] font-bold hover:bg-amber-500/20"
                            title="Simulate Match"
                          >
                            🚀 Trigger Test Match
                          </button>
                          <button
                            onClick={() => deleteSavedSearch(s.id)}
                            className="p-1.5 text-stone-450 hover:text-red-500 rounded-lg"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. SMART COMPARE TAB */}
          {activeTab === 'compare' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-zinc-850 pb-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-500">⚖️ Smart Category Compare Engine</h3>
                  <p className="text-[9px] opacity-60">Side-by-side spec and value analysis across products, land, and job visas</p>
                </div>
                
                {/* Switch compare category */}
                <div className="flex bg-stone-200/55 dark:bg-zinc-900 p-1 rounded-xl">
                  {(['PRODUCT', 'HOUSE', 'JOB'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCompareCategory(cat);
                        setCompareItems({ itemA: '0', itemB: '1' });
                      }}
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${
                        compareCategory === cat
                          ? (isDarkMode ? 'bg-amber-500 text-zinc-950' : 'bg-[#1E3A1A] text-white')
                          : 'text-stone-500 dark:text-zinc-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selection dropdown selectors */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-100/50 dark:bg-zinc-900/40 rounded-2xl border border-stone-200/50 dark:border-zinc-850">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-stone-450 block">Compare Listing A</label>
                  <select
                    value={compareItems.itemA}
                    onChange={(e) => setCompareItems(prev => ({ ...prev, itemA: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none text-stone-800 dark:text-zinc-100 font-bold"
                  >
                    {(compareCategory === 'PRODUCT' ? productOptions : compareCategory === 'HOUSE' ? houseOptions : jobOptions).map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-stone-450 block">Compare Listing B</label>
                  <select
                    value={compareItems.itemB}
                    onChange={(e) => setCompareItems(prev => ({ ...prev, itemB: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs p-2 rounded-xl outline-none text-stone-800 dark:text-zinc-100 font-bold"
                  >
                    {(compareCategory === 'PRODUCT' ? productOptions : compareCategory === 'HOUSE' ? houseOptions : jobOptions).map(item => (
                      <option key={item.id} value={item.id} disabled={item.id === compareItems.itemA}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side by side sheet */}
              {(() => {
                const list = compareCategory === 'PRODUCT' ? productOptions : compareCategory === 'HOUSE' ? houseOptions : jobOptions;
                const itemA = list.find(x => x.id === compareItems.itemA) || list[0];
                const itemB = list.find(x => x.id === compareItems.itemB) || list[1];

                return (
                  <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? 'border-zinc-850' : 'border-stone-200'}`}>
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-stone-100/50 dark:bg-zinc-900 border-b border-stone-200/50 dark:border-zinc-850 font-black uppercase tracking-wider text-[9px] text-stone-500">
                          <th className="p-3 w-1/3">Specifications</th>
                          <th className="p-3 text-amber-500 w-1/3">{itemA.name}</th>
                          <th className="p-3 text-blue-400 w-1/3">{itemB.name}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-150 dark:divide-zinc-850">
                        <tr>
                          <td className="p-3 font-bold opacity-75">Valuation / Fee</td>
                          <td className="p-3 font-mono font-black text-amber-500 text-[12px]">{itemA.price}</td>
                          <td className="p-3 font-mono font-black text-blue-400 text-[12px]">{itemB.price}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold opacity-75">Primary Spec</td>
                          <td className="p-3 opacity-90">{itemA.spec1}</td>
                          <td className="p-3 opacity-90">{itemB.spec1}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold opacity-75">Secondary Spec</td>
                          <td className="p-3 opacity-90">{itemA.spec2}</td>
                          <td className="p-3 opacity-90">{itemB.spec2}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold opacity-75">Quality Assessment</td>
                          <td className="p-3 opacity-90">{itemA.spec3}</td>
                          <td className="p-3 opacity-90">{itemB.spec3}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold opacity-75">Assurance / Extras</td>
                          <td className="p-3 opacity-90 text-emerald-500 font-bold">{itemA.spec4}</td>
                          <td className="p-3 opacity-90 text-emerald-500 font-bold">{itemB.spec4}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* 5. DIGITAL RECEIPTS TAB */}
          {activeTab === 'receipts' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-500">🧾 Cognitive Escrow Digital Receipts</h3>
                  <p className="text-[9px] opacity-60">Verified invoices with dynamic cryptographic QR hashes &amp; export links</p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={handleDownloadInvoice}
                    className="p-2 bg-stone-200/50 dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 rounded-xl hover:scale-105 transition"
                    title="Download PDF"
                  >
                    <Download size={13} className="text-amber-500" />
                  </button>
                  <button 
                    onClick={handleShareInvoice}
                    className="p-2 bg-stone-200/50 dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 rounded-xl hover:scale-105 transition"
                    title="Share invoice"
                  >
                    <Share2 size={13} className="text-blue-500" />
                  </button>
                </div>
              </div>

              {/* Receipt Body design */}
              <div className={`p-5 rounded-3xl border text-xs space-y-4 max-w-sm mx-auto shadow-lg relative ${
                isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-150' : 'bg-white border-stone-300 text-stone-800'
              }`}>
                {/* Header stamps */}
                <div className="flex justify-between items-start border-b border-stone-200 dark:border-zinc-850 pb-3">
                  <div className="text-left">
                    <span className="text-[14px] font-black text-amber-500 tracking-tight font-sans">EVERY-ZONE CO.</span>
                    <p className="text-[8px] opacity-60">Addis Ababa, Ethiopia</p>
                    <p className="text-[8px] opacity-60 font-mono">TEL: +251-11-ZONE-000</p>
                  </div>
                  <div className="text-right text-[9px] font-mono">
                    <span className="font-extrabold text-emerald-500 uppercase border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 rounded">
                      🔒 PAID SECURE
                    </span>
                    <p className="mt-1 opacity-70">Invoice: {selectedReceipt.invoiceNo}</p>
                    <p className="opacity-75">{selectedReceipt.date}</p>
                  </div>
                </div>

                {/* Customer block */}
                <div className="text-left space-y-0.5 border-b border-stone-150 dark:border-zinc-850 pb-2.5">
                  <span className="text-[7.5px] font-black uppercase text-stone-400">Verified Buyer</span>
                  <div className="font-black text-stone-900 dark:text-zinc-100">{selectedReceipt.customerName}</div>
                  <p className="text-[8px] opacity-60">NID Token: FAYDA-ET-0419245-A</p>
                </div>

                {/* Items grid */}
                <div className="space-y-2 text-left">
                  <span className="text-[7.5px] font-black uppercase text-stone-400">Settled Transactions</span>
                  <div className="space-y-1.5">
                    {selectedReceipt.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10.5px]">
                        <span className="opacity-90">{it.name} <span className="text-[8.5px] font-mono text-stone-450">(x{it.qty})</span></span>
                        <span className="font-mono font-bold">{(it.price * it.qty).toLocaleString()} ETB</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary calculation */}
                <div className="border-t border-dashed border-stone-350 dark:border-zinc-800 pt-3 space-y-1 text-left text-[11px]">
                  <div className="flex justify-between opacity-75">
                    <span>Subtotal:</span>
                    <span className="font-mono">{selectedReceipt.subtotal.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between opacity-75">
                    <span>Ecosystem Escrow Fee:</span>
                    <span className="font-mono">+{selectedReceipt.escrowFee.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-amber-500 font-bold">
                    <span className="flex items-center gap-1">✨ Loyalty Points Earned:</span>
                    <span className="font-mono">+{selectedReceipt.pointsAccrued} Pts</span>
                  </div>
                  <div className="flex justify-between font-black text-xs border-t border-stone-200 dark:border-zinc-800 pt-1.5 text-stone-900 dark:text-white">
                    <span>NET CHARGED:</span>
                    <span className="font-mono text-amber-500">{selectedReceipt.total.toLocaleString()} ETB</span>
                  </div>
                </div>

                {/* QR Code and verification stamps */}
                <div className="flex items-center gap-3 bg-stone-50 dark:bg-zinc-900 p-2.5 rounded-2xl border border-stone-200/50 dark:border-zinc-850">
                  <div className="p-1.5 bg-white rounded-xl">
                    <QrCode size={45} className="text-neutral-950" />
                  </div>
                  <div className="text-left space-y-0.5 flex-1">
                    <span className="text-[7px] font-mono font-black uppercase bg-emerald-500/10 text-emerald-500 px-1 py-0.2 rounded">
                      ✓ QR Hash Verified
                    </span>
                    <p className="text-[8px] opacity-75 leading-tight">This receipt is cryptographically locked into the national tax verification registry.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. RECENTLY VIEWED TAB */}
          {activeTab === 'recently' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-zinc-850 pb-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-500">👁️ Smart Recently Viewed Tracker</h3>
                  <p className="text-[9px] opacity-60">Your dynamic local footprint across products, land, and job visas</p>
                </div>
                <button
                  onClick={clearRecentlyViewed}
                  className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/5 hover:bg-red-500/10 px-3 py-1 rounded-xl"
                >
                  Clear Footprint
                </button>
              </div>

              {recentlyViewed.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  Your footprint is empty.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recentlyViewed.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3.5 rounded-2xl border text-left flex justify-between items-center ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="space-y-1 max-w-[70%]">
                        <span className="text-[7.5px] font-mono font-black uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-500">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-black text-stone-850 dark:text-zinc-100 truncate">{item.title}</h4>
                        <p className="text-[8.5px] text-stone-450 font-semibold">{item.store}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-black text-[#C5A059] block mb-1">
                          {item.price}
                        </span>
                        <button
                          onClick={() => alert(`Navigating directly to cached asset "${item.title}"`)}
                          className="text-[9px] font-extrabold uppercase tracking-widest bg-[#1E3A1A] text-white px-2.5 py-1.5 rounded-xl hover:scale-105 transition"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* 7. LOYALTY & REWARDS TAB */}
          {activeTab === 'loyalty' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div>
                <h3 className="text-xs font-black uppercase text-amber-500">🏆 Loyalty &amp; Rewards Ledger</h3>
                <p className="text-[9px] opacity-60">Verify your current tier perks and redeem loyalty points for shopping vouchers</p>
              </div>

              {/* Points Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-[#1E3A1A] to-emerald-850 text-white flex flex-col justify-between gap-4 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-mono font-black uppercase tracking-widest text-[#C5A059] block">Cognitive Loyalty Balance</span>
                    <span className="text-2xl font-black font-mono tracking-tight">{loyaltyPoints} <span className="text-xs font-sans font-bold">Points</span></span>
                  </div>
                  <div className={`text-xs font-black px-3 py-1 rounded-full border ${membership.color}`}>
                    {membership.title}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] opacity-80">
                    <span>Next Level: Gold (500 pts)</span>
                    <span>{loyaltyPoints}/500</span>
                  </div>
                  <div className="w-full bg-black/35 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all" 
                      style={{ width: `${Math.min(100, (loyaltyPoints / 500) * 100)}%` }} 
                    />
                  </div>
                  <p className="text-[9px] text-amber-300 italic font-medium">{membership.discount}</p>
                </div>
              </div>

              {/* Rewards Store */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-stone-450 tracking-wider">🎁 Redeem Active Loyalty Vouchers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { title: '150 ETB Telebirr Voucher', points: 150, desc: 'Adds 150 ETB directly to your wallet account.', icon: '💳' },
                    { title: 'Free Passport Fast-Track Consultation', points: 300, desc: 'Waives fast-track assistance administrative surcharge fees.', icon: '✈️' },
                    { title: 'Premium Buyer Badge status', points: 400, desc: 'Unlocks priority customer support and premium level tags instantly.', icon: '⭐' }
                  ].map((reward, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-2xl border flex justify-between items-center ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="text-left space-y-0.5">
                        <span className="text-lg">{reward.icon}</span>
                        <h5 className="text-xs font-extrabold text-stone-850 dark:text-zinc-100">{reward.title}</h5>
                        <p className="text-[9px] opacity-65 leading-tight max-w-[170px]">{reward.desc}</p>
                      </div>

                      <button
                        onClick={() => claimLoyaltyReward(reward.points, reward.title)}
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition ${
                          loyaltyPoints >= reward.points
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer shadow'
                            : 'bg-stone-500/25 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        🏷️ {reward.points} Pts
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 8. REFERRAL SYSTEM TAB */}
          {activeTab === 'referral' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-500">👥 National Referral Network</h3>
                  <p className="text-[9px] opacity-60">Invite friends, track registered commission ledger payouts, and hit high leaderboards</p>
                </div>
                <button
                  onClick={triggerSimulatedInvite}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[9.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow cursor-pointer"
                >
                  Simulate Sign-up 👥
                </button>
              </div>

              {/* Invite Code Generator */}
              <div className={`p-4 rounded-3xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'} grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div className="space-y-2">
                  <span className="text-[8.5px] font-black uppercase text-stone-450 tracking-wider">Your Personal Referral Link</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`https://everyzone.app/join?code=${referralCode}`}
                      className={`flex-1 font-mono text-xs p-2.5 rounded-xl border outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-750'
                      }`}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`https://everyzone.app/join?code=${referralCode}`);
                        alert('📋 Link copied to clipboard!');
                      }}
                      className="bg-[#1E3A1A] text-white font-black text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-800"
                    >
                      Copy Link
                    </button>
                  </div>
                  <p className="text-[9px] text-stone-450">Receive <strong>100 ETB</strong> direct to wallet plus <strong>25 Loyalty Points</strong> for each verified friend who signs up with Fayda National ID.</p>
                </div>

                {/* Ledger metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-stone-100/50 dark:bg-zinc-950 border border-stone-200/55 dark:border-zinc-850 rounded-2xl flex flex-col justify-center">
                    <span className="text-[8px] uppercase text-stone-450 font-black">Joined friends</span>
                    <span className="text-base font-black text-amber-500 font-mono mt-1">👥 {referrals.length}</span>
                  </div>
                  <div className="p-3 bg-stone-100/50 dark:bg-zinc-950 border border-stone-200/55 dark:border-zinc-850 rounded-2xl flex flex-col justify-center">
                    <span className="text-[8px] uppercase text-stone-450 font-black">Cleared Payout</span>
                    <span className="text-base font-black text-emerald-500 font-mono mt-1">400 ETB</span>
                  </div>
                  <div className="p-3 bg-stone-100/50 dark:bg-zinc-950 border border-stone-200/55 dark:border-zinc-850 rounded-2xl flex flex-col justify-center">
                    <span className="text-[8px] uppercase text-stone-450 font-black">Pending Hold</span>
                    <span className="text-base font-black text-[#C5A059] font-mono mt-1">100 ETB</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-stone-450 tracking-wider">🏆 Ecosystem Referral Leaderboards</h4>
                <div className={`p-4 rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <div className="space-y-2">
                    {leaderboard.map((user, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-stone-100 dark:border-zinc-850 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-black text-[9px] ${
                            idx === 0 ? 'bg-yellow-400 text-zinc-950' :
                            idx === 1 ? 'bg-stone-300 text-zinc-950' :
                            idx === 2 ? 'bg-amber-600 text-white' : 'bg-stone-500/20 text-stone-400'
                          }`}>
                            #{user.rank}
                          </span>
                          <span className="font-bold opacity-90">{user.name}</span>
                        </div>
                        <div className="flex gap-4 font-mono font-bold text-[11px]">
                          <span className="text-stone-450">{user.referrals} Joined</span>
                          <span className="text-emerald-500">{user.earning} earned</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 9. AI PRICE PREDICTOR TAB */}
          {activeTab === 'pricing' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div>
                <h3 className="text-xs font-black uppercase text-amber-500">🏷️ Cognitive AI Price Suggester</h3>
                <p className="text-[9px] opacity-60">Enter product parameters to generate expected competition metrics, suggested fair market value ranges, and demand forecasts</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Inputs */}
                <div className={`md:col-span-5 p-4 rounded-3xl border space-y-3.5 ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'
                }`}>
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black uppercase text-stone-450 block">Product Label Name</label>
                    <input 
                      type="text" 
                      value={suggestName}
                      onChange={(e) => setSuggestName(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border outline-none font-bold ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-150' : 'bg-stone-50 border-stone-200 text-stone-800'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black uppercase text-stone-450 block">Ecosystem Category</label>
                    <select
                      value={suggestCategory}
                      onChange={(e) => setSuggestCategory(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border outline-none font-bold ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-150' : 'bg-stone-50 border-stone-200 text-stone-800'
                      }`}
                    >
                      <option value="Handicrafts">Handicrafts &amp; Tibeb dresses</option>
                      <option value="Spices">Spices &amp; Specialty Foodstuff</option>
                      <option value="Coffee">Specialty Coffee Beans</option>
                      <option value="ConsumerElectronics">Consumer Electronics</option>
                    </select>
                  </div>

                  <button
                    onClick={calculateAiPricing}
                    className="w-full bg-[#1E3A1A] hover:bg-emerald-800 text-white font-black py-2.5 text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-amber-500 animate-spin-slow" />
                    Predict Fair Valuation
                  </button>
                </div>

                {/* Prediction Result outputs */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  {suggestLoading ? (
                    <div className="h-full min-h-[140px] flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-amber-500 animate-pulse">Running semantic demand indexing...</span>
                    </div>
                  ) : suggestResults ? (
                    <div className={`p-4 rounded-3xl border h-full space-y-3.5 text-xs ${
                      isDarkMode ? 'bg-zinc-905 border-zinc-850' : 'bg-white border-stone-150'
                    }`}>
                      <div className="border-b border-stone-100 dark:border-zinc-850 pb-2 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-amber-500">✓ Pricing Analysis Locked</span>
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">Accuracy 94.2%</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="p-2.5 bg-stone-100/50 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-xl">
                          <span className="text-[8px] uppercase text-stone-450 font-black block mb-0.5">Suggested Fair Value Range</span>
                          <span className="text-[11.5px] font-black text-emerald-500 font-mono">{suggestResults.price}</span>
                        </div>
                        <div className="p-2.5 bg-stone-100/50 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-xl">
                          <span className="text-[8px] uppercase text-stone-450 font-black block mb-0.5">Demand Forecast Rating</span>
                          <span className="text-[11px] font-bold text-amber-500">{suggestResults.demand}</span>
                        </div>
                        <div className="p-2.5 bg-stone-100/50 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-xl">
                          <span className="text-[8px] uppercase text-stone-450 font-black block mb-0.5">Competitor Saturation Score</span>
                          <span className="text-[11px] font-bold text-zinc-300">{suggestResults.competition}</span>
                        </div>
                        <div className="p-2.5 bg-stone-100/50 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-xl">
                          <span className="text-[8px] uppercase text-stone-450 font-black block mb-0.5">Most Optimal Taxonomy</span>
                          <span className="text-[11px] font-bold text-[#C5A059]">{suggestResults.bestCat}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-[9.5px] text-amber-500 leading-relaxed rounded-xl flex gap-2">
                        <span>💡</span>
                        <p><strong>Recommendation:</strong> Setting your initial price to <strong>4,400 ETB</strong> optimizes both conversions and profit margins due to upcoming holiday seasonality.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-stone-300 dark:border-zinc-800 rounded-3xl">
                      <Sparkles size={24} className="text-stone-400 mb-1.5" />
                      <p className="text-xs text-stone-400 font-medium">Input product characteristics to trigger AI cognitive price modeling.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 10. AI FRAUD DETECTION TAB */}
          {activeTab === 'fraud' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-zinc-850 pb-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-500">🤖 Cognitive AI Fraud Guard Audit</h3>
                  <p className="text-[9px] opacity-60">Real-time scan logs filtering fake products, duplicated national IDs, and bot message spam</p>
                </div>
                <button
                  onClick={runActiveFraudSweep}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[9.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck size={12} /> Launch Live Sweep
                </button>
              </div>

              {/* Scanned Fraud Items */}
              <div className="space-y-2.5">
                {fraudScans.map((sc) => (
                  <div 
                    key={sc.id} 
                    className={`p-3.5 rounded-2xl border flex gap-3.5 items-start ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                    }`}
                  >
                    <span className={`p-2 rounded-xl text-base ${
                      sc.severity === 'HIGH' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      sc.severity === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      🚨
                    </span>
                    <div className="text-left space-y-1 flex-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[#C5A059] uppercase tracking-wider text-[10px]">{sc.type}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          sc.severity === 'HIGH' ? 'bg-red-500 text-white' :
                          sc.severity === 'MEDIUM' ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-blue-600 text-white'
                        }`}>
                          {sc.severity} RISK
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-800 dark:text-zinc-100">{sc.target}</h4>
                      <p className="text-[10.5px] opacity-80 leading-relaxed font-sans">{sc.message}</p>
                      
                      <div className="flex justify-between items-center pt-2 mt-1 border-t border-stone-100 dark:border-zinc-850 text-[9px] font-mono font-bold">
                        <span className="text-stone-450">Resolution Method:</span>
                        <span className="text-emerald-500 uppercase">{sc.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 11. MINI CRM TAB */}
          {activeTab === 'crm' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-left font-sans"
            >
              <div>
                <h3 className="text-xs font-black uppercase text-amber-500">🗃️ Store Merchant Mini-CRM</h3>
                <p className="text-[9px] opacity-60">Track repeat buyers, VIP flags, personal customer notes, and send instant promotional birthday vouchers</p>
              </div>

              {/* Customer table */}
              <div className="space-y-3">
                {crmCustomers.map((c) => (
                  <div 
                    key={c.id}
                    className={`p-4 rounded-3xl border space-y-3.5 ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      <div className="text-left space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-stone-850 dark:text-zinc-100">{c.name}</h4>
                          {c.vip && (
                            <span className="bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/25">
                              ⭐ VIP BUYER
                            </span>
                          )}
                          <span className="bg-stone-500/20 text-stone-400 text-[8px] font-mono px-1.5 py-0.2 rounded">
                            🔄 Repeat (Orders: {c.orders})
                          </span>
                        </div>
                        <p className="text-[8.5px] text-stone-450">Lifetime Volume: <strong className="font-mono text-[#C5A059]">{c.totalSpent}</strong></p>
                      </div>

                      <div className="text-right">
                        <span className="text-[8px] font-mono text-stone-450 uppercase block">🎂 Birthday Profile</span>
                        <span className="text-[10px] text-zinc-300 font-bold">{c.birthday}</span>
                      </div>
                    </div>

                    {/* CRM Note update block */}
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-stone-450 block">Customer Notes / Special Border Requirements</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder={c.notes}
                          value={newCrmNotes[c.id] !== undefined ? newCrmNotes[c.id] : ''}
                          onChange={(e) => handleUpdateCrmNotes(c.id, e.target.value)}
                          className={`flex-1 text-[10.5px] p-2 rounded-xl border outline-none ${
                            isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-150 placeholder-zinc-650' : 'bg-stone-50 border-stone-200 text-stone-800 placeholder-stone-400'
                          }`}
                        />
                        <button
                          onClick={() => saveCrmNotes(c.id)}
                          className="bg-[#1E3A1A] hover:bg-emerald-800 text-white font-black text-[9px] px-3.5 py-1 rounded-xl transition uppercase tracking-wider"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* Direct Quick Messages */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-zinc-850">
                      <span className="text-[8px] font-black uppercase text-stone-450 tracking-wider">Quick Actions:</span>
                      <button 
                        onClick={() => {
                          alert(`Directing 10% Birthday Discount voucher code to ${c.name} telegram inbox.`);
                          triggerPushNotification('🎂 Birthday Voucher Sent!', `Birthday promotion successfully dispatched to ${c.name}`, '🎉', 'marketing');
                        }}
                        className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-amber-500/50' : 'bg-stone-50 border-stone-200 text-stone-750 hover:border-amber-500'
                        }`}
                      >
                        🎁 Send 10% Birthday Code
                      </button>
                      <button 
                        onClick={() => {
                          alert(`Generating CBE/Telebirr fast payout settlement clearance link for ${c.name}.`);
                        }}
                        className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-amber-500/50' : 'bg-stone-50 border-stone-200 text-stone-750 hover:border-amber-500'
                        }`}
                      >
                        ⚡ Settle Instant Payout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 12. SUBS & VERIFICATIONS TAB */}
          {activeTab === 'billing' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5 text-left font-sans"
            >
              {/* 12.A VENDOR SUBSCRIPTIONS */}
              <div className="space-y-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-500">🏬 Merchant Store Subscriptions</h3>
                  <p className="text-[9px] opacity-60">Upgrade your merchant tier to unlock lower checkout fees and video stream capacity</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {vendorPlans.map((plan) => (
                    <div 
                      key={plan.name}
                      onClick={() => {
                        setActiveVendorSub(plan.name as any);
                        alert(`Subscribed successfully to the ${plan.name} merchant tier.`);
                        triggerPushNotification('🏬 Merchant Plan Upgraded!', `You are now on the Every-zone ${plan.name} subscription plan.`, '🏬', 'merchant');
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-between h-[155px] ${
                        activeVendorSub === plan.name
                          ? 'border-amber-500 bg-amber-500/[0.03] scale-[1.02]'
                          : (isDarkMode ? 'bg-zinc-90 w-100 bg-zinc-900 border-zinc-850 hover:bg-zinc-850' : 'bg-white border-stone-200 hover:bg-stone-50')
                      }`}
                    >
                      <div className="space-y-1">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${plan.badge}`}>
                          {plan.name}
                        </span>
                        <div className="font-mono font-black text-sm pt-1 text-stone-800 dark:text-zinc-100">{plan.price}</div>
                        <p className="text-[9px] text-[#C5A059] font-bold">{plan.fee} escrow fee</p>
                        <p className="text-[8px] opacity-60 leading-tight font-sans">{plan.live}</p>
                      </div>

                      <button
                        className={`w-full py-1.5 text-[8.5px] font-black uppercase tracking-widest rounded-xl transition ${
                          activeVendorSub === plan.name
                            ? 'bg-amber-500 text-zinc-950 font-black'
                            : (isDarkMode ? 'bg-zinc-950 text-zinc-300' : 'bg-stone-100 text-stone-700')
                        }`}
                      >
                        {activeVendorSub === plan.name ? 'Active Plan ✓' : 'Upgrade'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 12.B USER VERIFICATION LEVEL */}
              <div className="space-y-2 pt-2 border-t border-stone-200/50 dark:border-zinc-850">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-500">👤 Cognitive User Verification Badges</h3>
                  <p className="text-[9px] opacity-60">Unlock higher overdraft wallets, secure property visits, and fast passport services via ID audits</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {verificationLevels.map((level) => (
                    <div 
                      key={level.name}
                      onClick={() => {
                        setActiveUserVerif(level.name as any);
                        alert(`Biometric audit passed successfully! Your profile is verified at the "${level.name}" level.`);
                        triggerPushNotification('👤 Identity Verified!', `Your profile has been upgraded to ${level.name} status.`, '👤', 'verification');
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-between h-[155px] ${
                        activeUserVerif === level.name
                          ? 'border-emerald-500 bg-emerald-500/[0.03] scale-[1.02]'
                          : (isDarkMode ? 'bg-zinc-90 w-100 bg-zinc-900 border-zinc-850 hover:bg-zinc-850' : 'bg-white border-stone-200 hover:bg-stone-50')
                      }`}
                    >
                      <div className="space-y-1">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          activeUserVerif === level.name ? 'bg-emerald-500 text-white' : 'bg-stone-500/20 text-stone-400'
                        }`}>
                          {level.name}
                        </span>
                        <div className="text-[8px] text-stone-450 pt-1 font-mono uppercase font-black">Requirements</div>
                        <p className="text-[9px] font-bold text-stone-800 dark:text-zinc-100 leading-tight font-sans">{level.req}</p>
                        <p className="text-[8px] text-emerald-500 leading-tight font-sans mt-1">Perk: {level.perks}</p>
                      </div>

                      <button
                        className={`w-full py-1.5 text-[8.5px] font-black uppercase tracking-widest rounded-xl transition ${
                          activeUserVerif === level.name
                            ? 'bg-emerald-500 text-white font-black'
                            : (isDarkMode ? 'bg-zinc-950 text-zinc-300' : 'bg-stone-100 text-stone-700')
                        }`}
                      >
                        {activeUserVerif === level.name ? 'Verified ✓' : 'Authenticate'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
