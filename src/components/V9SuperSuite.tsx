import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, TrendingUp, Award, Users, ShieldCheck, ShieldAlert, Sliders, Globe,
  MessageCircle, Video, Play, Sparkles, Send, Check, X, RefreshCw, BarChart2,
  Lock, ArrowRight, UserPlus, Phone, MapPin, Search, FileText,
  Percent, Eye, Gift, Shield, CheckCircle, Tag, Settings, Briefcase, Home,
  CreditCard, Scale, ChevronRight, Activity, Ban, Trash2, Layers,
  Calendar, Map, Download, Mail, QrCode, Bell, Clock, Plus, Heart, Share2, Flame, Zap
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { EcosystemMapsAndVideos } from './v3/EcosystemMapsAndVideos';
import { B2BAdPlatform } from './v3/B2BAdPlatform';
import { AIPremGiftAcademy } from './v3/AIPremGiftAcademy';
import { PluginArchHub } from './v3/PluginArchHub';
import { Phase9SuperAppSuite } from './v3/Phase9SuperAppSuite';

interface V9SuperSuiteProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  onClose: () => void;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
}

// ----------------------------------------------------
// DB MOCK DATA
// ----------------------------------------------------
const SEED_INBOX_CHATS = [
  { id: 'ch-1', sender: 'Abebe Tibeb (Shop)', avatar: '🏪', type: 'shop', msg: 'Your Silk Habesha Dress is ready for courier hand-off.', time: '10:15 AM', unread: true },
  { id: 'ch-2', sender: 'Bole Heights (House)', avatar: '🏠', type: 'house', msg: 'The rental agreement for Atlas Apartment is approved!', time: 'Yesterday', unread: false },
  { id: 'ch-3', sender: 'Horizon Recruit (Jobs)', avatar: '💼', type: 'jobs', msg: 'Dubai delivery driver contract visa quota issued.', time: '2 days ago', unread: false },
  { id: 'ch-4', sender: 'Frehiwot (Match)', avatar: '❤️', type: 'matchmaking', msg: 'I would love to join you for traditional coffee!', time: '12:44 PM', unread: true },
  { id: 'ch-5', sender: 'Every-zone Support', avatar: '👤', type: 'support', msg: 'Escrow Dispute #2810 has been successfully resolved.', time: '3 days ago', unread: false },
  { id: 'ch-6', sender: 'Makeda Coffee (Vendor)', avatar: '☕', type: 'vendor', msg: 'Wholesale batch prices updated for specialty Sidama.', time: 'Just now', unread: true },
];

const GLOBAL_SEARCH_POOL = [
  { id: 'sp-1', name: 'Premium Silk Habesha Dress', category: 'Products', rate: '14,500 ETB', meta: 'Abebe Tibeb • Traditional' },
  { id: 'sp-2', name: 'Zewditu Genuine Leather Shoes', category: 'Products', rate: '6,400 ETB', meta: 'Zewditu Leather • Bole Atlas' },
  { id: 'sp-3', name: 'Makeda Sidama Specialty Beans', category: 'Products', rate: '750 ETB', meta: 'Makeda Coffee • Organic' },
  { id: 'sp-4', name: 'Modern 2-Bedroom Bole Condo', category: 'Properties', rate: '65,000 ETB/mo', meta: 'Abyssinia Luxury Homes' },
  { id: 'sp-5', name: 'Dubai Heavy Delivery Driver', category: 'Jobs', rate: '5,000 AED/mo', meta: 'Horizon Overseas Recruiting' },
  { id: 'sp-6', name: 'Abebe Tibeb Official Store', category: 'Stores', rate: 'Verified Partner', meta: '1,240+ Sales • 4.9 Rating' },
  { id: 'sp-7', name: 'Heritage Handloom Showcase', category: 'Videos', rate: '2.4k Views', meta: 'Live Stream Replay' },
];

export function V9SuperSuite({
  isDarkMode,
  lang,
  triggerPushNotification,
  onClose,
  walletBalance,
  setWalletBalance
}: V9SuperSuiteProps) {
  // ----------------------------------------------------
  // NAVIGATION (10 Pillars)
  // ----------------------------------------------------
  const [activeSuiteTab, setActiveSuiteTab] = useState<
    'profile' | 'inbox' | 'search' | 'activity' | 'feed' | 'creator' | 'reputation' | 'card' | 'community' | 'admin' | 'phase9'
  >('profile');

  // v3.0 ECOSYSTEM STATES
  const [selectedCountry, setSelectedCountry] = useState<'ET' | 'KE' | 'UG' | 'RW' | 'TZ'>('ET');
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

  // 1. UNIVERSAL PROFILE STATE
  const [activeRole, setActiveRole] = useState<'customer' | 'vendor' | 'agent' | 'courier'>('customer');
  const [userMetadata, setUserMetadata] = useState({
    name: 'Henok Tadesse',
    phone: '+251 911 004 812',
    faydaId: 'FYD-HENOK-ETH-2026',
    email: 'henok.tadesse@everyzone.et',
  });

  // 2. UNIVERSAL INBOX STATE
  const [inboxFilter, setInboxFilter] = useState<'all' | 'shop' | 'house' | 'jobs' | 'matchmaking' | 'support' | 'vendor'>('all');
  const [selectedChatId, setSelectedChatId] = useState<string>('ch-1');
  const [typedMessage, setTypedMessage] = useState('');
  const [chatsList, setChatsList] = useState(SEED_INBOX_CHATS);
  const [chatThread, setChatThread] = useState<Record<string, { sender: 'user' | 'them', text: string, time: string }[]>>({
    'ch-1': [
      { sender: 'them', text: 'ሰላም Henok, your traditional silk embroidery details are finalized.', time: '10:00 AM' },
      { sender: 'user', text: 'Fantastic! Has it been verified on the escrow ledger yet?', time: '10:05 AM' },
      { sender: 'them', text: 'Yes, escrow deposit is secured. We are handing over to Sheger Courier today.', time: '10:15 AM' }
    ],
    'ch-4': [
      { sender: 'them', text: 'Hello! I saw your matchmaking profile and matching values.', time: '12:30 PM' },
      { sender: 'user', text: 'Hello Frehiwot! Nice to connect with you.', time: '12:40 PM' },
      { sender: 'them', text: 'I would love to join you for traditional coffee!', time: '12:44 PM' }
    ]
  });

  // 3. UNIVERSAL SEARCH STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<string>('All');

  // 4. ACTIVITY CENTER STATE
  const [activityCategory, setActivityCategory] = useState<'all' | 'orders' | 'payments' | 'followers' | 'matches'>('all');
  const [activitiesList, setActivitiesList] = useState([
    { id: 'act-1', type: 'orders', title: 'Order EZ-9810 Shipped', desc: 'Handed to Sheger Express. Live map route activated.', time: '10 mins ago', unread: true },
    { id: 'act-2', type: 'payments', title: 'Escrow Revenue Payout', desc: '14,500 ETB successfully settled to Chapa wallet.', time: '1 hour ago', unread: false },
    { id: 'act-3', type: 'followers', title: 'New Customer Gained', desc: 'Saron Kassa followed your Sidama Coffee store page.', time: '3 hours ago', unread: true },
    { id: 'act-4', type: 'matches', title: 'High Compatibility Match!', desc: 'Computed 94% lifestyle match with Frehiwot (Nurse, 28).', time: '4 hours ago', unread: true },
    { id: 'act-5', type: 'orders', title: 'Dispute Resolved', desc: 'Arbitration resolved dispute in favor of escrow holding.', time: '1 day ago', unread: false },
  ]);

  // 5. SMART FEED STATE
  const [smartFeedPosts, setSmartFeedPosts] = useState([
    { id: 'f-1', author: 'Makeda Royal Coffee', avatar: '☕', content: 'Our Sidama washing station is active! Hand-sorted premium single-origin micro-lots back in inventory. Verified organic certified.', media: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop', likes: 142, liked: false, comments: [{ author: 'Henok', text: 'Order secured! Smells beautiful.' }] },
    { id: 'f-2', author: 'Abebe Handlooms', avatar: '👗', content: 'Crafting the classic Gold Tibeb fringe pattern. Handcrafted over 12 days in Bole district. Limited v2.0 Enterprise collection.', media: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop', likes: 98, liked: false, comments: [] }
  ]);
  const [newCommentInput, setNewCommentInput] = useState<Record<string, string>>({});
  const [newPostText, setNewPostText] = useState('');
  const [newPostUrl, setNewPostUrl] = useState('');

  // 6. CREATOR MODE STATE
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [liveViewers, setLiveViewers] = useState(0);
  const [liveChat, setLiveChat] = useState<{ author: string; text: string }[]>([]);
  const [creatorRevenue, setCreatorRevenue] = useState(12450);

  // 7. REPUTATION STATE
  const [reputationScore, setReputationScore] = useState(94);
  const [isFaydaBiometricsVerified, setIsFaydaBiometricsVerified] = useState(false);

  // 8. DIGITAL BUSINESS CARD STATE
  const [cardTheme, setCardTheme] = useState<'amber' | 'emerald' | 'teal' | 'rose'>('amber');
  const [cardSlogan, setCardSlogan] = useState('Premium Ethiopian Crafts & High-Fidelity Logistics');

  // 9. COMMUNITY STATE
  const [selectedCommunity, setSelectedCommunity] = useState<'guild' | 'club' | 'houses' | 'jobs'>('guild');
  const [groupMessages, setGroupMessages] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    guild: [
      { author: 'Zewditu Leather', text: 'Any merchant experiencing Chapa gateway delays today?', time: '09:12 AM' },
      { author: 'Abebe Tibeb', text: 'All clearing smoothly on our end. Escrow clearance completed.', time: '09:15 AM' }
    ],
    club: [
      { author: 'Aster', text: 'Got my Habesha dress today! The WebP image loading in the gallery was spot on.', time: '11:00 AM' }
    ],
    houses: [
      { author: 'Yonas Agent', text: 'New Bole modern loft coming online tomorrow. Escrow deposit accepted.', time: 'Yesterday' }
    ],
    jobs: [
      { author: 'Brook', text: 'Highly recommend getting the Fayda certificate for the Dubai courier contracts.', time: '2 days ago' }
    ]
  });
  const [typedGroupMsg, setTypedGroupMsg] = useState('');

  // 10. ENTERPRISE ADMIN STATE
  const [flaggedUsers, setFlaggedUsers] = useState([
    { id: 'usr-441', name: 'Suspect Store LLC', reason: 'High dispute rate (>12%)', frozen: false, status: 'Review Needed' },
    { id: 'usr-992', name: 'Mulugeta Alarms', reason: 'Velocity check velocity peak', frozen: true, status: 'Frozen' }
  ]);
  const [apiLogs, setApiLogs] = useState([
    { time: '10:14:02', node: 'CHAPA_PAY', status: 200, latency: '142ms' },
    { time: '10:14:15', node: 'GEMINI_REASON_FLASH', status: 200, latency: '480ms' },
    { time: '10:14:22', node: 'MAPS_ROUTING_NODE', status: 200, latency: '82ms' }
  ]);

  // ----------------------------------------------------
  // INTERACTIVE REPLIES & DISPATCHES
  // ----------------------------------------------------
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const currentChat = chatsList.find(c => c.id === selectedChatId);
    if (!currentChat) return;

    const newMessage = { sender: 'user' as const, text: typedMessage, time: 'Just now' };
    setChatThread(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
    
    const textSent = typedMessage;
    setTypedMessage('');

    // Mark as read
    setChatsList(prev => prev.map(c => c.id === selectedChatId ? { ...c, unread: false, msg: textSent } : c));

    // Simulated Intelligent Reply
    setTimeout(() => {
      let replyText = `🤖 [Every-zone AI Support Agent] I registered your note regarding "${currentChat.sender}". Proceeding with automatic escrow verification.`;
      if (currentChat.type === 'shop') {
        replyText = `🏪 [Abebe Tibeb Shop] We acknowledged your request "${textSent}". Your courier tracking is actively monitored.`;
      } else if (currentChat.type === 'matchmaking') {
        replyText = `❤️ [Frehiwot] That sounds perfect Henok! Shall we reserve a table at the Bole Cultural Café this Friday around 5:30 PM?`;
      } else if (currentChat.type === 'house') {
        replyText = `🏠 [Bole Rent Node] Our agent has pinned your lease contract. Safe deposits are secured.`;
      } else if (currentChat.type === 'jobs') {
        replyText = `💼 [Horizon Placements] Your passport was matched on our database. Work permit generation will begin.`;
      }
      
      setChatThread(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), { sender: 'them', text: replyText, time: 'Just now' }]
      }));
      setChatsList(prev => prev.map(c => c.id === selectedChatId ? { ...c, msg: replyText } : c));
      triggerPushNotification('New Reply Received', replyText.substring(0, 50) + '...', '💬', 'inbox');
    }, 1500);
  };

  // Live stream commenters simulation
  useEffect(() => {
    let interval: any;
    if (isLiveStreaming) {
      const simulatedChatComments = [
        "Is that the authentic leather jacket?",
        "Beautiful Sidama beans showing on camera!",
        "Sent you a Rose gift! 🌹",
        "Does the escrow handle Telebirr payouts?",
        "Sending love from Addis! ❤️",
        "Sent you a Golden Lion! 🦁",
        "How can I book an appointment with Solomon?",
      ];
      setLiveViewers(148);
      interval = setInterval(() => {
        setLiveViewers(prev => prev + Math.floor(Math.random() * 9) - 4);
        const randomComment = simulatedChatComments[Math.floor(Math.random() * simulatedChatComments.length)];
        const randomUser = ['Aster', 'Yonas', 'Saron', 'Kidus', 'Almaz', 'Brook'][Math.floor(Math.random() * 6)];
        
        // Auto credit balance if tipping detected
        if (randomComment.includes("🌹")) {
          setWalletBalance(b => b + 50);
          setCreatorRevenue(r => r + 50);
          triggerPushNotification('Viewer Tip received!', `${randomUser} gifted you a Rose (+50 ETB)`, '🌹', 'creator');
        } else if (randomComment.includes("🦁")) {
          setWalletBalance(b => b + 500);
          setCreatorRevenue(r => r + 500);
          triggerPushNotification('BIG GIFT ALERT!', `${randomUser} gifted you a Golden Lion (+500 ETB)`, '🦁', 'creator');
        }

        setLiveChat(prev => [...prev.slice(-12), { author: randomUser, text: randomComment }]);
      }, 2500);
    } else {
      setLiveViewers(0);
      setLiveChat([]);
    }
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Handle smart search filtration
  const filteredSearchItems = useMemo(() => {
    return GLOBAL_SEARCH_POOL.filter(item => {
      const matchesCat = searchCategory === 'All' || item.category === searchCategory;
      const matchesText = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.meta.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesText;
    });
  }, [searchQuery, searchCategory]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-hidden ${
      isDarkMode ? 'bg-black/85' : 'bg-stone-900/60'
    }`} id="v9-super-suite-backdrop">
      <div className={`relative w-full max-w-6xl h-[90vh] rounded-3xl flex flex-col border overflow-hidden shadow-2xl transition-all duration-300 ${
        isDarkMode ? 'bg-[#0a0a0a] border-zinc-850 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-900'
      }`}>
        
        {/* TOP HUB METADATA HEADER */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-zinc-950/80 border-zinc-900' : 'bg-stone-100 border-stone-200'
        }`}>
          <div className="flex items-center gap-3 text-left">
            <div className="bg-amber-500 text-stone-950 p-2 rounded-2xl shadow-lg shadow-amber-500/20">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-500 font-mono">EVERY-ZONE v3.0</span>
                <span className="bg-amber-500/10 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">WORLD CLASS SUPER APP</span>
                {isPremiumUser && (
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-950 text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce">★ PLUS VIP</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <h2 className="text-xs md:text-sm font-extrabold uppercase tracking-wide">
                  {lang === 'en' ? 'Super App Suite Control Center' : 'ሱፐር አፕ ሲስተም መቆጣጠሪያ ማዕከል'}
                </h2>
                <div className="flex gap-1 items-center bg-black/40 border border-zinc-800 rounded-xl p-0.5">
                  {[
                    { code: 'ET', flag: '🇪🇹', name: 'Ethiopia' },
                    { code: 'KE', flag: '🇰🇪', name: 'Kenya' },
                    { code: 'UG', flag: '🇺🇬', name: 'Uganda' },
                    { code: 'RW', flag: '🇷🇼', name: 'Rwanda' },
                    { code: 'TZ', flag: '🇹🇿', name: 'Tanzania' }
                  ].map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCountry(c.code as any);
                        triggerPushNotification(
                          'Country Context Switched',
                          `Every-zone ecosystem aligned to ${c.name} (Currency, maps, and local micro-commerce updated!)`,
                          c.flag,
                          'profile'
                        );
                      }}
                      className={`text-xs px-1.5 py-0.5 rounded transition ${
                        selectedCountry === c.code 
                          ? 'bg-amber-500 text-stone-950 scale-110 font-black' 
                          : 'opacity-50 hover:opacity-100 hover:bg-zinc-800 text-stone-300'
                      }`}
                      title={c.name}
                    >
                      {c.flag} <span className="text-[8px] font-mono font-bold">{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Wallet Feed */}
            <div className={`px-4 py-1.5 rounded-2xl flex items-center gap-2 border font-mono text-xs ${
              isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-stone-200/50 border-stone-300'
            }`}>
              <DollarSign size={13} className="text-amber-500" />
              <span>{walletBalance.toLocaleString()} ETB</span>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-red-500/10 hover:text-red-400 transition"
              title="Close System Overlay"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 11 PILLARS GRID SELECTION NAV */}
        <div className={`px-6 py-2.5 border-b grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-1.5 text-center overflow-x-auto scrollbar-none ${
          isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-stone-100/50 border-stone-200'
        }`}>
          {[
            { id: 'profile', icon: <Users size={14} />, label: lang === 'en' ? 'Profile' : 'ፕሮፋይል' },
            { id: 'inbox', icon: <MessageCircle size={14} />, label: lang === 'en' ? 'Inbox' : 'መልዕክት' },
            { id: 'search', icon: <Search size={14} />, label: lang === 'en' ? 'Search' : 'ፍለጋ' },
            { id: 'activity', icon: <Bell size={14} />, label: lang === 'en' ? 'Activity' : 'ማሳወቂያ' },
            { id: 'feed', icon: <Flame size={14} />, label: lang === 'en' ? 'Feed' : 'አዲስ ነገሮች' },
            { id: 'creator', icon: <Video size={14} />, label: lang === 'en' ? 'Creator' : 'ቀጥታ ስርጭት' },
            { id: 'reputation', icon: <Award size={14} />, label: lang === 'en' ? 'Reputed' : 'ደረጃ' },
            { id: 'card', icon: <QrCode size={14} />, label: lang === 'en' ? 'Card' : 'ካርድ' },
            { id: 'community', icon: <Globe size={14} />, label: lang === 'en' ? 'Community' : 'ማህበረሰብ' },
            { id: 'admin', icon: <Sliders size={14} />, label: lang === 'en' ? 'Sys Admin' : 'አድሚን' },
            { id: 'phase9', icon: <Sparkles size={14} />, label: lang === 'en' ? 'Phase 9 Elite' : 'ምዕራፍ 9' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSuiteTab(tab.id as any)}
              className={`py-2 px-1.5 rounded-xl transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                activeSuiteTab === tab.id
                  ? 'bg-amber-500 text-stone-950 font-black shadow shadow-amber-500/15'
                  : isDarkMode ? 'hover:bg-zinc-900 text-stone-400 hover:text-white' : 'hover:bg-stone-200 text-stone-600 hover:text-stone-950'
              }`}
            >
              {tab.icon}
              <span className="text-[9px] font-extrabold truncate w-full">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CORE WORKSPACE VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            
            {/* ---------------------------------------------------- */}
            {/* PILLAR 1: UNIVERSAL PROFILE */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Persona Identity Badge */}
                  <div className={`p-6 rounded-3xl w-full md:w-1/3 flex flex-col items-center text-center relative overflow-hidden border ${
                    isDarkMode ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-850' : 'bg-white border-stone-200'
                  }`}>
                    <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase rounded-bl-2xl font-mono border-l border-b border-emerald-500/20">
                      🟢 Active Client
                    </div>
                    
                    <div className="w-18 h-18 bg-amber-500 rounded-full flex items-center justify-center text-3xl font-black text-stone-950 shadow-xl shadow-amber-500/20 mb-4">
                      {userMetadata.name.split(' ')[0][0]}
                    </div>

                    <h3 className="font-extrabold text-base">{userMetadata.name}</h3>
                    <p className="text-xs text-stone-400 font-mono mb-1">{userMetadata.faydaId}</p>
                    <div className="flex items-center gap-1.5 justify-center mb-2.5">
                      <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Fayda Identity Verified
                      </span>
                      <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        ID: EZ-1002458
                      </span>
                    </div>

                    <div className="w-full h-px bg-stone-850 my-5"></div>

                    <div className="w-full text-left space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Official Hotline</span>
                        <span className="font-medium">{userMetadata.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Registered Email</span>
                        <span className="font-medium">{userMetadata.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono font-bold">Active Auth Node</span>
                        <span className="text-emerald-400 font-mono">Chapa Unified Gateway</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Role Switchboard Engine */}
                  <div className="flex-1 space-y-6 w-full">
                    <div className={`p-5 rounded-3xl border ${
                      isDarkMode ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-stone-200'
                    }`}>
                      <h3 className="text-xs font-black uppercase text-amber-500 flex items-center gap-1.5 mb-2">
                        <Sliders size={14} /> Multi-Role Sub-System Router
                      </h3>
                      <p className="text-[11px] text-stone-400 mb-4">
                        Every-zone operates on a unified multi-tenant architecture. Select your active context below. Role transitions are instantly propagated without account re-registrations.
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        {[
                          { id: 'customer', label: '🛒 Customer', desc: 'Escrow Checkout & Feed' },
                          { id: 'vendor', label: '🏪 Store Vendor', desc: 'CRM, Listings & Promotions' },
                          { id: 'agent', label: '🏠 Real Estate', desc: 'Apartment Contracts' },
                          { id: 'courier', label: '💼 Overseas Agency', desc: 'Job Recruitment Visa' },
                        ].map(role => (
                          <button
                            key={role.id}
                            onClick={() => {
                              setActiveRole(role.id as any);
                              triggerPushNotification('Role Switched Successfully', `Switched active node to ${role.label}`, '🔄', 'profile');
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                              activeRole === role.id
                                ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-md'
                                : isDarkMode ? 'bg-zinc-950/40 border-zinc-850 hover:border-zinc-700' : 'bg-stone-50 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <span className="font-black text-xs block">{role.label}</span>
                            <span className="text-[9px] text-stone-400 block mt-0.5">{role.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Role-Specific State Variables Preview */}
                    <div className={`p-5 rounded-3xl border space-y-3 ${
                      isDarkMode ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-stone-200'
                    }`}>
                      <h4 className="text-xs font-black uppercase text-stone-300">
                        {activeRole.toUpperCase()} CONTEXT STATISTICS
                      </h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                        {activeRole === 'customer' && (
                          <>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">ORDERS IN ESCROW</span>
                              <span className="text-base font-black text-amber-500">3 Active</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">TOTAL DISBURSED</span>
                              <span className="text-base font-black">42,900 ETB</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">FAYDA BIOMETRICS</span>
                              <span className="text-base font-black text-emerald-400">PASSED</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">MATCH COUPLING</span>
                              <span className="text-base font-black">94%</span>
                            </div>
                          </>
                        )}

                        {activeRole === 'vendor' && (
                          <>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">TODAY'S ORDERS</span>
                              <span className="text-base font-black text-emerald-400">12 Packed</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">STORE ESCROW RESERVES</span>
                              <span className="text-base font-black text-amber-500">114,800 ETB</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">CUSTOMER RETENTION</span>
                              <span className="text-base font-black">44.8%</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">CRM CONTACTS</span>
                              <span className="text-base font-black">142 Loyal</span>
                            </div>
                          </>
                        )}

                        {activeRole === 'agent' && (
                          <>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">LISTINGS COMMITTED</span>
                              <span className="text-base font-black text-teal-400">8 Units</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">MONTHLY RENTALS REVENUE</span>
                              <span className="text-base font-black">130,000 ETB</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">FEATURED CAMPAIGNS</span>
                              <span className="text-base font-black text-amber-500">3 Scheduled</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">KYC TRUST SCORE</span>
                              <span className="text-base font-black">98 / 100</span>
                            </div>
                          </>
                        )}

                        {activeRole === 'courier' && (
                          <>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">OVERSEAS VISAS GRANTED</span>
                              <span className="text-base font-black text-pink-400">14 Active</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">PAY-PER-JOB CONTRACTS</span>
                              <span className="text-base font-black">1,500 AED / Job</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">AGENCY SUBSCRIPTION</span>
                              <span className="text-base font-black text-amber-500">Premium Plan</span>
                            </div>
                            <div className="p-3 bg-black/30 rounded-xl">
                              <span className="text-[9px] text-stone-500 block">PENDING INTERVIEWS</span>
                              <span className="text-base font-black">6 Applicants</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Universal Activity Timeline */}
                <div className={`p-6 rounded-3xl border ${
                  isDarkMode ? 'bg-zinc-900/40 border-zinc-900/80' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex justify-between items-center border-b border-stone-850 pb-3 mb-4">
                    <div>
                      <h3 className="text-xs font-black uppercase text-amber-500 flex items-center gap-1.5">
                        <Activity size={14} /> Universal Activity Timeline (Every-zone ID: EZ-1002458)
                      </h3>
                      <p className="text-[10px] text-stone-400">
                        Tracks and unifies your activity fingerprint across all decentralized Every-zone modules.
                      </p>
                    </div>
                    <span className="text-[9px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold">
                      7 Synchronized Events
                    </span>
                  </div>

                  <div className="relative border-l-2 border-stone-800 ml-4 pl-6 space-y-5 my-2">
                    {[
                      {
                        title: 'Order Delivered Successfully 📦',
                        module: 'Marketplace Escrow',
                        desc: 'Your Samsung Galaxy S24 Ultra was successfully delivered and escrow funds cleared.',
                        id: 'EZ-1002458-M1',
                        status: 'COMPLETED',
                        color: 'bg-emerald-500',
                        time: 'Just now'
                      },
                      {
                        title: 'Overseas Interview Passed 🏆',
                        module: 'Overseas Employment',
                        desc: 'Passed the final round video interview with UAE Logistic Group representatives.',
                        id: 'EZ-1002458-J4',
                        status: 'VERIFIED',
                        color: 'bg-indigo-500',
                        time: '2 hours ago'
                      },
                      {
                        title: 'Wallet Security Deposit Settled 🪙',
                        module: 'Decentralized Wallet',
                        desc: 'Settled 14,500 ETB escrow holding vault deposit via Chapa API integration.',
                        id: 'EZ-1002458-W7',
                        status: 'SECURED',
                        color: 'bg-amber-500',
                        time: '1 day ago'
                      },
                      {
                        title: 'New Vendor Store Followed 🏪',
                        module: 'Vendor Network',
                        desc: 'Subscribed to Aster Handloom Guild store. Received 10% coupon.',
                        id: 'EZ-1002458-V9',
                        status: 'FOLLOWED',
                        color: 'bg-purple-500',
                        time: '3 days ago'
                      },
                      {
                        title: 'Premium House Property Saved 🏠',
                        module: 'Real Estate Portal',
                        desc: 'Bookmarked Bole Atlas Penthouse unit with smart-lock reservation option.',
                        id: 'EZ-1002458-H2',
                        status: 'SAVED',
                        color: 'bg-teal-500',
                        time: '4 days ago'
                      },
                      {
                        title: 'Applied For Dubai Logistics Job 💼',
                        module: 'Overseas Employment',
                        desc: 'Passport biometric matched. Visa processing queue node generated automatically.',
                        id: 'EZ-1002458-J4',
                        status: 'IN PROGRESS',
                        color: 'bg-blue-500',
                        time: '1 week ago'
                      },
                      {
                        title: 'Purchased Samsung S24 Phone 🛒',
                        module: 'Marketplace',
                        desc: 'Secured transaction, initiated escrow ledger. Dispatched via Sheger EV-courier.',
                        id: 'EZ-1002458-M1',
                        status: 'DELIVERED',
                        color: 'bg-cyan-500',
                        time: '1 week ago'
                      }
                    ].map((evt, idx) => (
                      <div key={idx} className="relative group text-left">
                        {/* Glowing node point */}
                        <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 ${isDarkMode ? 'border-[#0a0a0b]' : 'border-stone-100'} ${evt.color} shadow-lg group-hover:scale-125 transition-transform`} />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <h4 className="text-xs font-extrabold text-stone-200">{evt.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5 font-mono text-[9px]">
                              <span className="text-stone-400 font-bold">{evt.module}</span>
                              <span className="text-stone-600">•</span>
                              <span className="text-amber-500 font-black">{evt.id}</span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-1 max-w-xl">{evt.desc}</p>
                          </div>
                          
                          <div className="flex sm:flex-col items-start sm:items-end gap-1.5 justify-between">
                            <span className="text-[8px] font-mono text-stone-500">{evt.time}</span>
                            <span className={`text-[8.5px] font-mono font-black px-2 py-0.5 rounded ${
                              evt.status === 'COMPLETED' || evt.status === 'VERIFIED' || evt.status === 'SECURED'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {evt.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B2B Partnership & Self-Service Ad Campaign Gateway */}
                <B2BAdPlatform 
                  isDarkMode={isDarkMode}
                  triggerPushNotification={triggerPushNotification}
                  lang={lang}
                  selectedCountry={selectedCountry}
                />
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 2: UNIVERSAL INBOX */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'inbox' && (
              <motion.div
                key="inbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[58vh] flex gap-4 overflow-hidden"
              >
                {/* Inbox Left Sidebar */}
                <div className={`w-1/3 rounded-3xl p-3 flex flex-col gap-3 border ${
                  isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex gap-1 overflow-x-auto scrollbar-none pb-2">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'shop', label: '🛒 Shop' },
                      { id: 'house', label: '🏠 House' },
                      { id: 'jobs', label: '💼 Jobs' },
                      { id: 'matchmaking', label: '❤️ Match' },
                      { id: 'support', label: '👤 Support' },
                      { id: 'vendor', label: '☕ Vendor' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setInboxFilter(btn.id as any)}
                        className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                          inboxFilter === btn.id
                            ? 'bg-amber-500 text-stone-950 font-black'
                            : isDarkMode ? 'bg-zinc-900 text-stone-400 hover:text-stone-200' : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1.5">
                    {chatsList
                      .filter(c => inboxFilter === 'all' || c.type === inboxFilter)
                      .map(chat => (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChatId(chat.id)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition relative ${
                            selectedChatId === chat.id
                              ? 'bg-amber-500/10 border-amber-500/40'
                              : isDarkMode ? 'bg-zinc-900/30 border-transparent hover:bg-zinc-900/70' : 'bg-stone-50 border-transparent hover:bg-stone-100'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs flex items-center gap-1.5">
                              <span>{chat.avatar}</span> {chat.sender}
                            </span>
                            <span className="text-[8px] opacity-60 font-mono">{chat.time}</span>
                          </div>
                          <p className="text-[10px] text-stone-400 truncate pr-5 leading-normal">{chat.msg}</p>
                          {chat.unread && (
                            <div className="absolute right-3.5 bottom-3.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Active Chat Panel */}
                <div className={`flex-1 rounded-3xl p-4 flex flex-col border ${
                  isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  {(() => {
                    const currentChat = chatsList.find(c => c.id === selectedChatId);
                    if (!currentChat) return <div className="m-auto text-xs text-stone-500">Select conversation node.</div>;
                    const messages = chatThread[selectedChatId] || [
                      { sender: 'them', text: currentChat.msg, time: currentChat.time }
                    ];

                    return (
                      <>
                        <div className="flex items-center gap-2 border-b pb-3 mb-3">
                          <span className="text-xl">{currentChat.avatar}</span>
                          <div>
                            <h4 className="text-xs font-black">{currentChat.sender}</h4>
                            <span className="text-[8.5px] text-emerald-400 font-mono flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                              Unified secure channel active
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                          {messages.map((m, idx) => (
                            <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                              <div className={`p-3 rounded-2xl max-w-md ${
                                m.sender === 'user'
                                  ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                                  : isDarkMode ? 'bg-zinc-900 text-stone-250 rounded-tl-none' : 'bg-stone-100 text-stone-900 rounded-tl-none'
                              }`}>
                                <p className="leading-relaxed">{m.text}</p>
                              </div>
                              <span className="text-[8px] opacity-45 font-mono mt-0.5 px-1">{m.time}</span>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-3 border-t">
                          <input
                            type="text"
                            value={typedMessage}
                            onChange={(e) => setTypedMessage(e.target.value)}
                            placeholder="Type secure encrypted message..."
                            className="flex-1 text-xs bg-black border border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-amber-500/40 text-stone-200"
                          />
                          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                            <Send size={12} />
                            <span>Send</span>
                          </button>
                        </form>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 3: UNIVERSAL SEARCH & MAPS */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Map Everywhere Subsystem Core Grid */}
                <EcosystemMapsAndVideos 
                  isDarkMode={isDarkMode}
                  selectedCountry={selectedCountry}
                  triggerPushNotification={triggerPushNotification}
                  lang={lang}
                />

                <div className={`p-5 rounded-3xl border space-y-4 text-left ${
                  isDarkMode ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Global search across Shop Products, Real Estate Houses, Recruiting Jobs, Verified Stores, Videos..."
                      className="w-full text-xs bg-black border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-amber-500/40 text-stone-200"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                    {['All', 'Products', 'Properties', 'Jobs', 'Stores', 'Videos'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSearchCategory(cat)}
                        className={`text-[9px] font-black px-3.5 py-2 rounded-xl cursor-pointer ${
                          searchCategory === cat
                            ? 'bg-amber-500 text-stone-950 font-black'
                            : isDarkMode ? 'bg-zinc-950/80 hover:bg-zinc-900 text-stone-400' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {filteredSearchItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between hover:border-amber-500/35 transition ${
                        isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="mb-4 text-left">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[8px] font-black tracking-widest text-amber-500 font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs font-black text-amber-500 font-mono">{item.rate}</span>
                        </div>
                        <h4 className="text-xs font-bold leading-snug">{item.name}</h4>
                        <p className="text-[10px] text-stone-500 font-medium mt-1">{item.meta}</p>
                      </div>

                      <button
                        onClick={() => {
                          triggerPushNotification('Universal Direct Order', `Committed check out session for ${item.name}`, '🛍️', 'search');
                        }}
                        className={`w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/30 text-[10px] font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1`}
                      >
                        <span>Request Escrow Direct</span>
                        <ArrowRight size={10} className="mt-0.5" />
                      </button>
                    </div>
                  ))}

                  {filteredSearchItems.length === 0 && (
                    <div className="col-span-full py-16 text-center text-stone-500 text-xs uppercase font-bold tracking-wider">
                      No matching records found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 4: ACTIVITY CENTER */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5">
                    {[
                      { id: 'all', label: 'All Alerts' },
                      { id: 'orders', label: '🛒 Orders' },
                      { id: 'payments', label: '💰 Payments' },
                      { id: 'followers', label: '👥 Followers' },
                      { id: 'matches', label: '❤️ Matches' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActivityCategory(tab.id as any)}
                        className={`text-[9.5px] font-black px-3.5 py-2 rounded-xl cursor-pointer ${
                          activityCategory === tab.id
                            ? 'bg-amber-500 text-stone-950 font-black'
                            : isDarkMode ? 'bg-zinc-900 hover:bg-zinc-850 text-stone-400' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const sampleAlerts = [
                        { id: `act-${Date.now()}`, type: 'payments', title: 'Withdrawal Approved', desc: '4,500 ETB sent directly to Telebirr mobile number.', time: 'Just now', unread: true },
                        { id: `act-${Date.now()}`, type: 'orders', title: 'New Store Order Received', desc: 'Yared Shimelis purchased Silk Dress. Verification lock active.', time: 'Just now', unread: true }
                      ];
                      setActivitiesList(prev => [sampleAlerts[Math.floor(Math.random() * 2)], ...prev]);
                      triggerPushNotification('Interactive Mockup Alert', 'New live transaction simulation fed into Activity Feed.', '🔔', 'activity');
                    }}
                    className="bg-[#C5A059] hover:bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={10} />
                    <span>Simulate Incoming Alert</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activitiesList
                    .filter(a => activityCategory === 'all' || a.type === activityCategory)
                    .map(act => (
                      <div
                        key={act.id}
                        className={`p-4 rounded-3xl border flex items-center justify-between text-left ${
                          isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                        } ${act.unread ? 'border-l-4 border-l-amber-500' : ''}`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className={`p-2.5 rounded-2xl bg-black/45 text-sm`}>
                            {act.type === 'orders' ? '🛒' : act.type === 'payments' ? '💰' : act.type === 'followers' ? '👥' : '❤️'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black">{act.title}</h4>
                              {act.unread && (
                                <span className="bg-amber-500/15 border border-amber-500/25 text-amber-500 text-[8px] font-black px-1.5 rounded uppercase font-mono">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-stone-400 mt-0.5 leading-normal">{act.desc}</p>
                          </div>
                        </div>

                        <span className="text-[9px] text-stone-500 font-mono font-bold shrink-0">{act.time}</span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 5: SMART FEED & SHORT VIDEOS */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'feed' && (
              <motion.div
                key="feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                {/* Dynamic Short Videos AI Feed Subsystem */}
                <EcosystemMapsAndVideos 
                  isDarkMode={isDarkMode}
                  selectedCountry={selectedCountry}
                  triggerPushNotification={triggerPushNotification}
                  lang={lang}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Creator Feed Timeline */}
                <div className="md:col-span-2 space-y-6">
                  {smartFeedPosts.map(post => (
                    <div
                      key={post.id}
                      className={`p-5 rounded-3xl border text-left space-y-4 relative ${
                        isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-sm font-bold">
                            {post.avatar}
                          </div>
                          <div>
                            <span className="text-xs font-extrabold block">{post.author}</span>
                            <span className="text-[8.5px] text-stone-400 font-mono">Verified Influencer</span>
                          </div>
                        </div>

                        <button className="text-stone-400 hover:text-white transition">
                          <Share2 size={13} />
                        </button>
                      </div>

                      <p className="text-xs leading-relaxed text-stone-300 font-medium">{post.content}</p>

                      {post.media && (
                        <div className="h-48 rounded-2xl overflow-hidden border border-zinc-850 relative">
                          <img src={post.media} className="w-full h-full object-cover" alt="Feed Media" referrerPolicy="no-referrer" />
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs font-mono border-t border-b border-zinc-850/60 py-2">
                        <button
                          onClick={() => {
                            setSmartFeedPosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p));
                            triggerPushNotification('Social Reaction', 'Registered like metrics on smart blockchain feed.', '❤️', 'feed');
                          }}
                          className={`flex items-center gap-1.5 transition ${post.liked ? 'text-rose-500' : 'text-stone-400 hover:text-stone-200'}`}
                        >
                          <Heart size={13} className={post.liked ? 'fill-current' : ''} />
                          <span>{post.likes}</span>
                        </button>

                        <div className="flex items-center gap-1 text-stone-400">
                          <MessageCircle size={13} />
                          <span>{post.comments.length} Comments</span>
                        </div>
                      </div>

                      {/* Comment sections */}
                      <div className="space-y-2 text-xs">
                        {post.comments.map((comment, cIdx) => (
                          <div key={cIdx} className="bg-black/30 p-2.5 rounded-xl">
                            <span className="font-bold text-amber-500 block text-[9.5px]">{comment.author}</span>
                            <p className="text-stone-300 leading-normal mt-0.5">{comment.text}</p>
                          </div>
                        ))}

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const txt = newCommentInput[post.id];
                            if (!txt || !txt.trim()) return;
                            setSmartFeedPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments: [...p.comments, { author: 'Henok', text: txt }] } : p));
                            setNewCommentInput(prev => ({ ...prev, [post.id]: '' }));
                            triggerPushNotification('Social Comment Posted', 'Comment dynamically attached directly to feed entry.', '💬', 'feed');
                          }}
                          className="flex gap-2 pt-2"
                        >
                          <input
                            type="text"
                            value={newCommentInput[post.id] || ''}
                            onChange={(e) => setNewCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Add your verified comment..."
                            className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-[11px] outline-none text-stone-200"
                          />
                          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-3 py-1.5 rounded-lg text-[10px] cursor-pointer">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left Side: Create Post */}
                <div className="space-y-6">
                  <div className={`p-5 rounded-3xl border space-y-4 text-left ${
                    isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                  }`}>
                    <h4 className="text-xs font-black uppercase text-amber-500 flex items-center gap-1">
                      <Plus size={14} /> Publish Creator Update
                    </h4>
                    
                    <textarea
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder="What Sidama coffee or traditional Tibeb styles are you launching today?"
                      className="w-full text-xs bg-black border border-zinc-800 rounded-xl p-3 text-stone-200 min-h-[90px] outline-none"
                    />

                    <input
                      type="url"
                      value={newPostUrl}
                      onChange={(e) => setNewPostUrl(e.target.value)}
                      placeholder="Attach image/video URL (Optional)"
                      className="w-full text-xs bg-black border border-zinc-800 rounded-lg px-3 py-2 text-stone-200 outline-none"
                    />

                    <button
                      onClick={() => {
                        if (!newPostText.trim()) return;
                        const newPost = {
                          id: `f-${Date.now()}`,
                          author: 'Henok Tadesse (User)',
                          avatar: '👤',
                          content: newPostText,
                          media: newPostUrl || undefined,
                          likes: 0,
                          liked: false,
                          comments: []
                        };
                        setSmartFeedPosts(prev => [newPost, ...prev]);
                        setNewPostText('');
                        setNewPostUrl('');
                        triggerPushNotification('Feed Post Created', 'Post live on decentralized client smart feeds.', '📱', 'feed');
                      }}
                      className="w-full py-2.5 bg-[#C5A059] hover:bg-amber-400 text-stone-950 font-black text-xs uppercase rounded-xl transition cursor-pointer"
                    >
                      Broadcast to Every-zone
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 6: CREATOR MODE (LIVESTREAM SIMULATOR) */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'creator' && (
              <motion.div
                key="creator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Left side: Simulated Live stream viewport */}
                <div className="md:col-span-2 space-y-4">
                  <div className="h-[48vh] bg-stone-950 border border-zinc-850 rounded-3xl overflow-hidden relative shadow-inner">
                    {/* Live Stream Animated Streamer Frame */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
                    
                    {isLiveStreaming ? (
                      <div className="w-full h-full flex flex-col justify-between p-4 relative z-20">
                        {/* Overlay Header */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded animate-pulse font-mono uppercase">
                              LIVE 🔴
                            </span>
                            <span className="bg-black/60 text-stone-200 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                              👤 {liveViewers} Viewers
                            </span>
                          </div>

                          <span className="bg-[#C5A059]/20 border border-[#C5A059]/30 text-amber-500 font-mono text-[9px] font-extrabold px-3 py-1 rounded-full">
                            EZ-TIPS ENABLED
                          </span>
                        </div>

                        {/* Animated Video Stream Frame */}
                        <div className="text-center my-auto">
                          <div className="w-16 h-16 rounded-full border-2 border-red-500 animate-ping mx-auto absolute inset-0 m-auto opacity-35" />
                          <p className="text-sm font-black text-white uppercase tracking-widest drop-shadow animate-pulse">
                            Broadcasting Live Video Stream
                          </p>
                          <p className="text-[10px] text-stone-400 mt-1">Camera and microphone access authorized via requestFramePermissions</p>
                        </div>

                        {/* Stream Waterfall Chat Overlay */}
                        <div className="h-32 bg-gradient-to-t from-black/60 to-transparent rounded-xl p-2.5 overflow-y-auto space-y-1.5 text-left text-[10px]">
                          {liveChat.map((msg, index) => (
                            <div key={index} className="flex gap-1.5">
                              <span className="font-extrabold text-amber-400 shrink-0 font-sans">{msg.author}:</span>
                              <span className="text-white leading-relaxed">{msg.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8">
                        <span className="text-4xl">🎥</span>
                        <div className="text-center max-w-sm space-y-2">
                          <h4 className="font-black text-sm uppercase tracking-wide">Ready to go Live on Every-zone?</h4>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            Simulate interactive live streaming. Go live and watch automated user comments and tipping flow in. 100% simulated Chapa transaction callbacks are handled in real-time.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsLiveStreaming(true);
                            triggerPushNotification('Live Broadcast Started', 'Every-zone community notified. Viewer lobbies routing...', '🔴', 'creator');
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase px-6 py-2.5 rounded-full shadow-lg shadow-red-500/10 cursor-pointer"
                        >
                          Start Live Stream 🔴
                        </button>
                      </div>
                    )}
                  </div>

                  {isLiveStreaming && (
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-stone-400 italic">Comments containing emoji triggers credit your real system balance.</p>
                      <button
                        onClick={() => {
                          setIsLiveStreaming(false);
                          triggerPushNotification('Live Broadcast Ended', 'Live stream statistics recorded.', '⏹️', 'creator');
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-stone-200 text-[10px] font-black uppercase px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Terminate Broadcast
                      </button>
                    </div>
                  )}
                </div>

                {/* Creator Stats and monetization panel */}
                <div className="space-y-6">
                  <div className={`p-5 rounded-3xl border space-y-4 text-left ${
                    isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                  }`}>
                    <h4 className="text-xs font-black uppercase text-amber-500 flex items-center gap-1.5">
                      <TrendingUp size={14} /> Creator Monetization
                    </h4>

                    <div className="space-y-3 font-mono">
                      <div className="p-3.5 bg-black/35 rounded-2xl flex justify-between items-center">
                        <div>
                          <span className="text-[8px] text-stone-500 block uppercase font-sans">Accumulated Tips</span>
                          <span className="text-base font-black text-amber-500">{creatorRevenue.toLocaleString()} ETB</span>
                        </div>
                        <span className="text-xl">💎</span>
                      </div>

                      <div className="p-3.5 bg-black/35 rounded-2xl flex justify-between items-center">
                        <div>
                          <span className="text-[8px] text-stone-500 block uppercase font-sans">Ad View Revenue</span>
                          <span className="text-base font-black text-emerald-400">4,120 ETB</span>
                        </div>
                        <span className="text-xl">📈</span>
                      </div>

                      <div className="p-3.5 bg-black/35 rounded-2xl flex justify-between items-center">
                        <div>
                          <span className="text-[8px] text-stone-500 block uppercase font-sans">Live Payout Status</span>
                          <span className="text-xs font-black text-emerald-400">READY FOR CHAPA</span>
                        </div>
                        <button
                          onClick={() => {
                            if (creatorRevenue === 0) return;
                            setWalletBalance(b => b + creatorRevenue);
                            setCreatorRevenue(0);
                            triggerPushNotification('Creator Payout Success', 'Disbursed tipping pools to main system wallet successfully.', '💰', 'creator');
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[9px] px-2.5 py-1 rounded-lg uppercase cursor-pointer"
                        >
                          Disburse
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 7: REPUTATION SYSTEM */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'reputation' && (
              <motion.div
                key="reputation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Gauge score display */}
                  <div className={`p-8 rounded-3xl border w-full md:w-2/5 flex flex-col items-center justify-center text-center ${
                    isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                  }`}>
                    <h3 className="text-xs font-black uppercase text-amber-500 tracking-wider mb-6 font-mono">
                      AI-Scored Reputation Gauge
                    </h3>

                    <div className="relative w-36 h-36 flex items-center justify-center">
                      {/* CSS-based circular score ring */}
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="64" fill="transparent" stroke="#222" strokeWidth="8" />
                        <circle 
                          cx="72" 
                          cy="72" 
                          r="64" 
                          fill="transparent" 
                          stroke="#C5A059" 
                          strokeWidth="8" 
                          strokeDasharray={402}
                          strokeDashoffset={402 - (402 * reputationScore) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-black font-mono text-white leading-none">{reputationScore}</span>
                        <span className="text-[10px] text-stone-400 font-mono font-bold mt-1 uppercase">Excellent</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-500 leading-normal mt-6">
                      Calculated using cryptographically verified ledger activities: KYC (Fayda ID), resolution rates, delivery maps verification speed, and premium store review statuses.
                    </p>
                  </div>

                  {/* Reputation break down & boosting items */}
                  <div className="flex-1 space-y-4">
                    <div className={`p-5 rounded-3xl border ${
                      isDarkMode ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-stone-200'
                    }`}>
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block font-mono">
                        🛡️ ACTIVE TRUST FACTORS
                      </span>
                      <h4 className="text-xs font-black uppercase mt-1 mb-3">Verified Ledger Strengths</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                        <div className="p-3 bg-black/25 rounded-2xl flex gap-2.5 items-start">
                          <span className="text-emerald-400">✓</span>
                          <div>
                            <span className="font-extrabold block text-stone-200">KYC Level 2 Registered</span>
                            <span className="text-[9.5px] text-stone-500 font-mono">Goverment passport and TIN match</span>
                          </div>
                        </div>

                        <div className="p-3 bg-black/25 rounded-2xl flex gap-2.5 items-start">
                          <span className="text-emerald-400">✓</span>
                          <div>
                            <span className="font-extrabold block text-stone-200">Zero Disputes Opened</span>
                            <span className="text-[9.5px] text-stone-500 font-mono">100% compliance rate</span>
                          </div>
                        </div>

                        <div className="p-3 bg-black/25 rounded-2xl flex gap-2.5 items-start">
                          <span className="text-emerald-400">✓</span>
                          <div>
                            <span className="font-extrabold block text-stone-200">Courier Delivery Speed</span>
                            <span className="text-[9.5px] text-stone-500 font-mono">Sheger Express averages &lt; 28 mins</span>
                          </div>
                        </div>

                        <div className="p-3 bg-black/25 rounded-2xl flex gap-2.5 items-start">
                          <span className="text-emerald-400">✓</span>
                          <div>
                            <span className="font-extrabold block text-stone-200">Merchant subscription status</span>
                            <span className="text-[9.5px] text-stone-500 font-mono">Verified Gold Merchant tier</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Boosting actions */}
                    <div className={`p-5 rounded-3xl border flex justify-between items-center ${
                      isDarkMode ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-stone-200'
                    }`}>
                      <div>
                        <span className="text-[9px] text-amber-500 font-black uppercase block font-mono">⚠️ Reputation Action Required</span>
                        <h4 className="text-xs font-bold leading-normal">Verify Government Fayda biometric ID</h4>
                        <p className="text-[10px] text-stone-400">Instantly boosts reputation scorecard to level 3 (+5 Reputation Points) and unlocks automated escrow clearance limits.</p>
                      </div>

                      <button
                        onClick={() => {
                          if (isFaydaBiometricsVerified) return;
                          setIsFaydaBiometricsVerified(true);
                          setReputationScore(99);
                          triggerPushNotification('Biometrics Verified', 'Fayda ID level 3 certificate validated. Score updated.', '🛡️', 'reputation');
                        }}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition ${
                          isFaydaBiometricsVerified
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-black shadow shadow-amber-500/10'
                        }`}
                      >
                        {isFaydaBiometricsVerified ? '✓ Verified (Score: 99)' : 'Verify Fayda Biometrics'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Business Insights, Premium Club, Digital Gift Cards & Escrow Academy Subsystems */}
                <AIPremGiftAcademy 
                  isDarkMode={isDarkMode}
                  triggerPushNotification={triggerPushNotification}
                  lang={lang}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  isPremiumUser={isPremiumUser}
                  setIsPremiumUser={setIsPremiumUser}
                />
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 8: DIGITAL BUSINESS CARD */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'card' && (
              <motion.div
                key="card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Customizer */}
                <div className={`p-5 rounded-3xl border space-y-4 text-left h-fit ${
                  isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  <h4 className="text-xs font-black uppercase text-amber-500">Customize Branding Profile</h4>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-400">Card Theme</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'amber', color: 'bg-amber-500' },
                        { id: 'emerald', color: 'bg-emerald-500' },
                        { id: 'teal', color: 'bg-teal-500' },
                        { id: 'rose', color: 'bg-rose-500' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setCardTheme(t.id as any)}
                          className={`h-8 rounded-lg ${t.color} border transition cursor-pointer ${
                            cardTheme === t.id ? 'border-white scale-105 shadow' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-400">Enterprise Slogan</label>
                    <input
                      type="text"
                      value={cardSlogan}
                      onChange={(e) => setCardSlogan(e.target.value)}
                      placeholder="Enter brand slogan..."
                      className="w-full text-xs bg-black border border-zinc-800 rounded-lg px-3 py-2 text-stone-200 outline-none"
                    />
                  </div>

                  <div className="w-full h-px bg-stone-850"></div>

                  <button
                    onClick={() => {
                      triggerPushNotification('Business Card Saved', 'Branding details finalized and committed to vCard QR cache.', '📇', 'card');
                    }}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-stone-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Commit Theme Configuration
                  </button>
                </div>

                {/* Card Output Visual Block */}
                <div className="md:col-span-2 flex flex-col justify-center items-center">
                  <div className={`w-full max-w-lg rounded-3xl p-6 text-left relative overflow-hidden shadow-2xl transition border ${
                    cardTheme === 'amber' ? 'bg-[#1a1202] border-amber-500/20' : 
                    cardTheme === 'emerald' ? 'bg-[#021a0f] border-emerald-500/20' :
                    cardTheme === 'teal' ? 'bg-[#02181a] border-teal-500/20' : 'bg-[#1a0208] border-rose-500/20'
                  }`}>
                    {/* Floating geometric ornaments */}
                    <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-bl-full" />
                    
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded font-mono text-white/90">
                          EVERY-ZONE VERIFIED VENDOR
                        </span>
                        <h3 className="text-base font-black text-white mt-1.5">{userMetadata.name}</h3>
                        <p className="text-[10.5px] text-white/60">Lead Craft &amp; Logistics Manager</p>
                      </div>
                      <span className="text-2xl">🌍</span>
                    </div>

                    <p className="text-xs text-white/80 italic leading-relaxed min-h-[36px] font-medium font-sans">
                      "{cardSlogan}"
                    </p>

                    <div className="w-full h-px bg-white/10 my-4"></div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-1 text-[9.5px] text-white/70 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Phone size={10} className="text-white/40" />
                          <span>{userMetadata.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail size={10} className="text-white/40" />
                          <span>{userMetadata.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck size={10} className="text-white/40" />
                          <span>Fayda ID: Verified Active</span>
                        </div>
                      </div>

                      {/* Standard CSS simulated QR code */}
                      <div className="bg-white p-1.5 rounded-lg border border-stone-200">
                        <QrCode className="w-14 h-14 text-stone-900" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 w-full max-w-lg text-center text-[10px]">
                    <button
                      onClick={() => alert('vCard .vcf file downloading sequence activated.')}
                      className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-stone-200 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download size={11} />
                      <span>Download vCard Contact</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://everyzone.et/share/henok_tadesse`);
                        triggerPushNotification('Link Copied', 'Personal profile link copied to clipboard.', '🔗', 'card');
                      }}
                      className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-stone-200 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 size={11} />
                      <span>Copy Card Link</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 9: COMMUNITY HUBS */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'community' && (
              <motion.div
                key="community"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[58vh] flex gap-4 overflow-hidden"
              >
                {/* Guild selectors */}
                <div className={`w-1/4 rounded-3xl p-3 flex flex-col gap-1.5 border ${
                  isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  <span className="text-[9px] font-black uppercase text-stone-500 tracking-wider p-1 text-left">Community Channels</span>
                  {[
                    { id: 'guild', label: '🏪 Vendors Guild', desc: 'B2B Trade Network' },
                    { id: 'club', label: '🛒 Customer Club', desc: 'General Swapping' },
                    { id: 'houses', label: '🏠 House Hunters', desc: 'Rentals & Sales Chat' },
                    { id: 'jobs', label: '💼 Job Seekers', desc: 'Overseas Contract Tips' },
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedCommunity(g.id as any)}
                      className={`p-3 rounded-2xl text-left transition cursor-pointer ${
                        selectedCommunity === g.id
                          ? 'bg-amber-500/10 border border-amber-500/25 text-amber-500 font-black'
                          : isDarkMode ? 'hover:bg-zinc-900 text-stone-400' : 'hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      <span className="text-xs font-bold block">{g.label}</span>
                      <span className="text-[9px] opacity-70 block font-normal mt-0.5">{g.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Channel Thread chat pane */}
                <div className={`flex-1 rounded-3xl p-4 flex flex-col border ${
                  isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  <div className="border-b pb-3 mb-3 text-left">
                    <h3 className="text-xs font-black uppercase text-amber-500">
                      #{selectedCommunity.toUpperCase()} CORE CHANNEL
                    </h3>
                    <p className="text-[9px] text-stone-400">Encrypted community forum, compliant with national security standards.</p>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 text-left text-xs pr-1">
                    {(groupMessages[selectedCommunity] || []).map((msg, i) => (
                      <div key={i} className="bg-black/25 p-3 rounded-2xl border border-zinc-850/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-extrabold text-amber-400 text-[10px]">{msg.author}</span>
                          <span className="text-[8px] text-stone-500 font-mono">{msg.time}</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed font-sans">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!typedGroupMsg.trim()) return;
                      const msg = { author: 'Henok Tadesse', text: typedGroupMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                      setGroupMessages(prev => ({ ...prev, [selectedCommunity]: [...(prev[selectedCommunity] || []), msg] }));
                      setTypedGroupMsg('');
                      triggerPushNotification('Community Broadcast', 'Dispatched message block to active chatroom routing.', '👥', 'community');
                    }}
                    className="mt-3 flex gap-2 pt-3 border-t"
                  >
                    <input
                      type="text"
                      value={typedGroupMsg}
                      onChange={(e) => setTypedGroupMsg(e.target.value)}
                      placeholder={`Send message to #${selectedCommunity}...`}
                      className="flex-1 text-xs bg-black border border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-amber-500/40 text-stone-200"
                    />
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                      <Send size={12} />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 10: ENTERPRISE ADMIN ENGINE */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                {/* Stats Dashboard charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Revenue metrics chart panel */}
                  <div className={`p-4 rounded-3xl border h-48 flex flex-col justify-between ${
                    isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                  }`}>
                    <div>
                      <span className="text-[8px] font-black uppercase text-amber-500 font-mono">Commission Revenue</span>
                      <h4 className="text-xs font-black">Marketplace commissions: 3-8%</h4>
                    </div>
                    {/* Simulated Recharts widget */}
                    <div className="h-28 w-full flex items-end gap-2 pt-2">
                      {[32, 45, 62, 54, 78, 92, 110].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-amber-600 to-amber-500 rounded-lg group relative cursor-pointer" style={{ height: `${h}%` }}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[7.5px] px-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap font-mono text-amber-400">
                            {(h * 1500).toLocaleString()} ETB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API performance latency log */}
                  <div className={`p-4 rounded-3xl border h-48 flex flex-col justify-between ${
                    isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                      }`}>
                    <div>
                      <span className="text-[8px] font-black uppercase text-emerald-400 font-mono">Active API Node latency</span>
                      <h4 className="text-xs font-black">Integrated Payment Settlement Webhooks</h4>
                    </div>

                    <div className="h-28 w-full bg-black/60 border border-zinc-850 rounded-2xl p-2 font-mono text-[7.5px] text-emerald-400 space-y-1 overflow-y-auto">
                      {apiLogs.map((log, i) => (
                        <div key={i} className="flex justify-between">
                          <span>[{log.time}] {log.node}</span>
                          <span className="font-bold text-amber-500">{log.latency}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System health diagnostics parameters */}
                  <div className={`p-4 rounded-3xl border h-48 flex flex-col justify-between ${
                    isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                  }`}>
                    <div>
                      <span className="text-[8px] font-black uppercase text-[#C5A059] font-mono">Server Diagnostics</span>
                      <h4 className="text-xs font-black">Nginx load balancers operational</h4>
                    </div>

                    <div className="space-y-1.5 text-[9.5px] leading-relaxed mt-2 font-mono">
                      <div className="flex justify-between">
                        <span className="opacity-70 font-sans">CPU Utilization:</span>
                        <span className="text-emerald-500 font-bold">14.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70 font-sans">Redis Memory Caching:</span>
                        <span className="text-emerald-500 font-bold">542MB / 2.0GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70 font-sans">Spanner Cluster health:</span>
                        <span className="text-emerald-500 font-bold">🟢 Secure (99.98% uptime)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flagged user controls and fraud dashboard */}
                <div className={`p-5 rounded-3xl border space-y-4 ${
                  isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex justify-between items-center border-b border-zinc-850/60 pb-3">
                    <div>
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block font-mono">
                        🛡️ AI SYSTEM RISK CONTROL
                      </span>
                      <h3 className="text-xs font-black uppercase">Fraud Velocity Spikes and Account Holds</h3>
                    </div>
                    
                    <button
                      onClick={() => {
                        setApiLogs(prev => [{ time: new Date().toLocaleTimeString(), node: 'RECACHE_FLUSH', status: 200, latency: '42ms' }, ...prev]);
                        triggerPushNotification('Nginx Cache Flushed', 'Flushed Redis caching proxy layers successfully.', '⚙️', 'admin');
                      }}
                      className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-stone-200 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Flush proxy cache layers
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {flaggedUsers.map(user => (
                      <div key={user.id} className="p-3 bg-black/20 rounded-2xl border border-zinc-850/50 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-200">{user.name}</span>
                            <span className={`text-[8px] font-mono font-bold px-1.5 rounded ${
                              user.frozen ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {user.status}
                            </span>
                          </div>
                          <p className="text-[9.5px] text-stone-500 mt-1 font-mono">{user.reason}</p>
                        </div>

                        <button
                          onClick={() => {
                            setFlaggedUsers(prev => prev.map(u => u.id === user.id ? { ...u, frozen: !u.frozen, status: !u.frozen ? 'Frozen' : 'Review Needed' } : u));
                            triggerPushNotification(
                              user.frozen ? 'User Thawed Successfully' : 'Account Frozen Safely',
                              `${user.name} transactional lock toggled.`,
                              '🛡️',
                              'admin'
                            );
                          }}
                          className={`text-[9.5px] font-black uppercase px-3 py-1.5 rounded-xl cursor-pointer transition ${
                            user.frozen
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black'
                              : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {user.frozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modular Plugin Registry and Enterprise Architecture System Layer */}
                <PluginArchHub 
                  isDarkMode={isDarkMode}
                  triggerPushNotification={triggerPushNotification}
                  lang={lang}
                />
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* PILLAR 11: PHASE 9 WORLD-CLASS SUPER APP FEATURES */}
            {/* ---------------------------------------------------- */}
            {activeSuiteTab === 'phase9' && (
              <motion.div
                key="phase9"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Phase9SuperAppSuite 
                  isDarkMode={isDarkMode}
                  triggerPushNotification={triggerPushNotification}
                  lang={lang}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
