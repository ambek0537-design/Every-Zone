import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, ShieldAlert, CheckCircle2, Heart, MessageCircle, Plus, 
  Search, Clock, Send, Star, Bookmark, MapPin, Phone, ShieldCheck, 
  Check, X, ChevronRight, Play, Pause, Volume2, VolumeX, Mail, FileText, Globe
} from 'lucide-react';
import { TraditionalCornerOrnament } from './TraditionalCornerOrnament';

interface VendorStorefrontProps {
  viewedVendorId: string;
  setViewedVendorId: (id: string | null) => void;
  lang: string;
  isDarkMode: boolean;
  t: (key: string) => string;
  listings: any[];
  setSelectedListing: (listing: any) => void;
  actingVendorId: string;
  setActingVendorId: (id: string) => void;
  vendorsSocial: { [key: string]: any };
  setVendorsSocial: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  triggerPushNotification: (title: string, desc: string, icon: string, type: string) => void;
  setIsMessageModalOpen: (open: boolean) => void;
  setBookingModalItem: (item: any) => void;
  activeVideoModal: any | null;
  setActiveVideoModal: (video: any | null) => void;
  timelinePosts: any[];
  setTimelinePosts: React.Dispatch<React.SetStateAction<any[]>>;
  isFetchingTimeline: boolean;
  newPostTitle: string;
  setNewPostTitle: (t: string) => void;
  newPostContent: string;
  setNewPostContent: (c: string) => void;
  newPostType: 'PRODUCT' | 'PROPERTY' | 'JOB' | 'ANNOUNCEMENT' | 'PROMOTION';
  setNewPostType: (t: 'PRODUCT' | 'PROPERTY' | 'JOB' | 'ANNOUNCEMENT' | 'PROMOTION') => void;
  newPostVisibility: 'PUBLIC' | 'FOLLOWERS_ONLY';
  setNewPostVisibility: (v: 'PUBLIC' | 'FOLLOWERS_ONLY') => void;
  newCommentTexts: { [postId: string]: string };
  setNewCommentTexts: React.Dispatch<React.SetStateAction<{ [postId: string]: string }>>;
  activeCommentPostId: string | null;
  setActiveCommentPostId: (id: string | null) => void;
  handleCreateTimelinePost: (vId: string) => void;
  handleLikeTimelinePost: (postId: string) => void;
  handleShareTimelinePost: (postId: string) => void;
  handleCommentTimelinePost: (postId: string) => void;
  trustScore: any;
  reviewSuccessMsg: string | null;
  setReviewSuccessMsg: (msg: string | null) => void;
  reviewErrorMsg: string | null;
  setReviewErrorMsg: (msg: string | null) => void;
  reviewFormRating: number;
  setReviewFormRating: (r: number) => void;
  reviewFormText: string;
  setReviewFormText: (t: string) => void;
  reviewFormPhoto: string;
  setReviewFormPhoto: (p: string) => void;
  reviewFormVideo: string;
  setReviewFormVideo: (v: string) => void;
  reviewsLoading: boolean;
  dynamicReviews: any[];
  fetchVendorReviewsAndTrust: (vId: string) => void;
  setSelectedMarketplaceProduct: (p: any) => void;
  vendorMarketplaceProducts: any[];
}

export function VendorStorefront({
  viewedVendorId,
  setViewedVendorId,
  lang,
  isDarkMode,
  t,
  listings,
  setSelectedListing,
  actingVendorId,
  setActingVendorId,
  vendorsSocial,
  setVendorsSocial,
  triggerPushNotification,
  setIsMessageModalOpen,
  setBookingModalItem,
  activeVideoModal,
  setActiveVideoModal,
  timelinePosts,
  setTimelinePosts,
  isFetchingTimeline,
  newPostTitle,
  setNewPostTitle,
  newPostContent,
  setNewPostContent,
  newPostType,
  setNewPostType,
  newPostVisibility,
  setNewPostVisibility,
  newCommentTexts,
  setNewCommentTexts,
  activeCommentPostId,
  setActiveCommentPostId,
  handleCreateTimelinePost,
  handleLikeTimelinePost,
  handleShareTimelinePost,
  handleCommentTimelinePost,
  trustScore,
  reviewSuccessMsg,
  setReviewSuccessMsg,
  reviewErrorMsg,
  setReviewErrorMsg,
  reviewFormRating,
  setReviewFormRating,
  reviewFormText,
  setReviewFormText,
  reviewFormPhoto,
  setReviewFormPhoto,
  reviewFormVideo,
  setReviewFormVideo,
  reviewsLoading,
  dynamicReviews,
  fetchVendorReviewsAndTrust,
  setSelectedMarketplaceProduct,
  vendorMarketplaceProducts
}: VendorStorefrontProps) {

  const [vendorProfileTab, setVendorProfileTab] = useState<'all' | 'services' | 'products' | 'videos' | 'posts' | 'reviews' | 'about' | 'policies' | 'team'>('all');
  const [vendorStoreSearch, setVendorStoreSearch] = useState('');
  const [vendorStoreSort, setVendorStoreSort] = useState<'newest' | 'popular' | 'rating' | 'priceAsc' | 'priceDesc'>('newest');

  // Helper translations inside modular file
  const localT = (key: string) => {
    const dict: { [k: string]: { [l: string]: string } } = {
      backToMarketplace: { en: "Back to Marketplace", am: "ወደ መገበያያ ተመለስ" },
      reportVendor: { en: "Report Vendor", am: "ሪፖርት አድርግ" },
      verified: { en: "Verified", am: "የተረጋገጠ" },
      followers: { en: "followers", am: "ተከታዮች" },
      activeSubscription: { en: "Merchant Subscription: ACTIVE / SECURED", am: "የነጋዴ የደንበኝነት ሁኔታ፡ ንቁ አባል / የተጠበቀ" },
      secText: { 
        en: "Authenticated Fayda identity merchant with active Escrow Node status. Secured by Chapa automatic monthly clearance protect.",
        am: "የይገባኛል ማረጋገጫ (ፋይዳ) የተረጋገጠ ነጋዴ። ወርሃዊ ኪራዩ በቻፓ በኩል ተከፍሎ በኤስክሮው የተጠበቀ የክፍያ ዋስትና አለው።"
      }
    };
    return dict[key]?.[lang] || key;
  };

  const getVendorCover = (vId: string) => {
    const COVERS: { [key: string]: string } = {
      v1: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200",
      v2: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1200",
      v3: "https://images.unsplash.com/photo-1530519729491-acf0b340c6bc?auto=format&fit=crop&q=80&w=1200",
      v4: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1200",
      v5: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      v6: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
      v7: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
      v8: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1200"
    };
    return COVERS[vId] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200";
  };

  const getVendorLogoInitials = (vId: string) => {
    const LOGOS: { [key: string]: { txt: string, bg: string, text: string } } = {
      v1: { txt: "MRW", bg: "bg-amber-600", text: "text-white" },
      v2: { txt: "KHC", bg: "bg-amber-900", text: "text-amber-100" },
      v3: { txt: "ZGL", bg: "bg-stone-850", text: "text-amber-500" },
      v4: { txt: "ABP", bg: "bg-teal-900", text: "text-teal-100" },
      v5: { txt: "APRE", bg: "bg-slate-900", text: "text-white" },
      v6: { txt: "YLC", bg: "bg-[#1E3A1A]", text: "text-amber-400" },
      v7: { txt: "GIP", bg: "bg-blue-900", text: "text-blue-150" },
      v8: { txt: "HAE", bg: "bg-emerald-900", text: "text-white" }
    };
    return LOGOS[vId] || { txt: "M", bg: "bg-[#1E3A1A]", text: "text-white" };
  };

  const sVendor = vendorsSocial[viewedVendorId] || { followed: false, followersCount: 1250, videos: [] };
  const sampleL = listings.find(l => l.vendorId === viewedVendorId);
  const vName = sampleL ? (lang === 'en' ? sampleL.vendorName : sampleL.vendorNameAm || sampleL.vendorName) : 'Verified Merchant';
  const vCategory = sampleL ? sampleL.category : 'Retailer';
  const isFollowed = sVendor.followed;

  const handleToggleFollow = () => {
    setVendorsSocial(prev => {
      const current = prev[viewedVendorId];
      if (!current) return prev;
      return {
        ...prev,
        [viewedVendorId]: {
          ...current,
          followed: !current.followed,
          followersCount: current.followed ? current.followersCount - 1 : current.followersCount + 1
        }
      };
    });
  };

  const handleWebShareVendor = async () => {
    const deepLink = `${window.location.origin}${window.location.pathname}#vendor=${viewedVendorId}`;
    const shareData = {
      title: vName,
      text: lang === 'en' 
        ? `Check out ${vName} on Every-zone - Premium Shop & Vendor Hub!` 
        : `በኤቭሪ-ዞን ላይ የ ${vName} ምርጥ የሱቅ ገጽን ይመልከቱ!`,
      url: deepLink
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        triggerPushNotification(
          lang === 'en' ? 'Shared!' : 'ተጋርቷል!',
          lang === 'en' ? `Shared ${vName} successfully!` : `የ ${vName} ገጽ በተሳካ ሁኔታ ተጋርቷል!`,
          '📢',
          'social'
        );
      } catch (err: any) {
        if (err && err.name !== 'AbortError') {
          navigator.clipboard.writeText(deepLink);
          triggerPushNotification(
            lang === 'en' ? 'Link Copied!' : 'ሊንክ ኮፒ ተደርጓል!',
            lang === 'en' ? `Web Share failed. Copied deep link to clipboard instead.` : `ሊንኩ ኮፒ ተደርጓል።`,
            '🔗',
            'social'
          );
        }
      }
    } else {
      navigator.clipboard.writeText(deepLink);
      triggerPushNotification(
        lang === 'en' ? 'Link Copied!' : 'ሊንክ ኮፒ ተደርጓል!',
        lang === 'en' ? `Web Share not supported. Copied deep link to ${vName} to clipboard!` : `የመጋሪያ አገልግሎት ስለማይደገፍ የ ${vName} ሊንክ ኮፒ ተደርጓል!`,
        '🔗',
        'social'
      );
    }
  };

  const logoStyle = getVendorLogoInitials(viewedVendorId);

  // VENDOR CONTACT DATABASE MOCKUP
  const VENDOR_CONTACTS: { [key: string]: { phone: string, email: string, website: string, tin: string } } = {
    v1: { phone: "+251911425678", email: "info@makedaroyal.et", website: "www.makedaroyal.et", tin: "TIN-842-105-001" },
    v2: { phone: "+251904123456", email: "export@makedacoffee.et", website: "www.makedacoffee.et", tin: "TIN-955-402-911" },
    v3: { phone: "+251910887766", email: "contact@zewdituleather.et", website: "www.zewdituleather.et", tin: "TIN-204-556-881" },
    v4: { phone: "+251911334455", email: "sales@boleheights.et", website: "www.boleheights.et", tin: "TIN-504-112-990" },
    v5: { phone: "+251912998877", email: "rentals@cmcambassador.et", website: "www.cmcambassador.et", tin: "TIN-119-450-202" },
    v6: { phone: "+251902778899", email: "admin@sarbetcorner.et", website: "www.sarbetcorner.et", tin: "TIN-776-102-404" },
    v7: { phone: "+251920112233", email: "placement@dubaihotelchef.et", website: "www.dubaihotelchef.et", tin: "TIN-332-909-121" },
    v8: { phone: "+251944556677", email: "recruiting@warsawrecruit.et", website: "www.warsawrecruit.et", tin: "TIN-662-881-432" }
  };
  const contactInfo = VENDOR_CONTACTS[viewedVendorId] || { phone: "+251911000000", email: `heritage@${viewedVendorId}.et`, website: `www.heritage-${viewedVendorId}.et`, tin: "TIN-555-444-333" };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 pb-12 text-left"
    >
      {/* 1. Header Back & Report Bar */}
      <div className="flex justify-between items-center gap-2">
        <button 
          onClick={() => setViewedVendorId(null)}
          className="flex items-center gap-2 text-xs font-extrabold text-[#1E3A1A] hover:opacity-85 transition-opacity bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-xl border border-stone-200 shrink-0 cursor-pointer"
        >
          ← {localT('backToMarketplace')}
        </button>

        <button 
          onClick={() => {
            alert(lang === 'en' ? `🚨 Report filed against ${vName}. Our compliance team will investigate within 12 hours.` : `🚨 አቤቱታ በ ${vName} ላይ ቀርቧል። ህጋዊ ቡድናችን በ12 ሰዓታት ውስጥ ያጣራዋል።`);
          }}
          className="flex items-center gap-1 text-[11px] font-black text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2.5 rounded-xl border border-red-200 cursor-pointer transition-all duration-200 shadow-sm"
          title="Report Vendor Fraud"
        >
          <ShieldAlert size={13} className="text-red-500 shrink-0" />
          <span>🚨 {lang === 'en' ? 'Report' : 'ሪፖርት'}</span>
        </button>
      </div>

      {/* 2. COVER (Business Cover Photo) */}
      <div className="bg-neutral-950 border border-neutral-850 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="h-32 relative overflow-hidden bg-stone-950">
          <img 
            src={getVendorCover(viewedVendorId)} 
            alt={`${vName} Cover`} 
            className="w-full h-full object-cover opacity-60 filter saturate-75" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
          
          <button
            onClick={handleWebShareVendor}
            className="absolute top-3.5 left-3.5 bg-neutral-950/75 hover:bg-neutral-900 text-amber-500 hover:text-amber-400 p-2 rounded-xl z-20 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg flex items-center justify-center cursor-pointer group"
          >
            <Share2 size={13} className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-bold ml-1 uppercase tracking-wider hidden sm:inline">
              {lang === 'en' ? 'Share' : 'አጋራ'}
            </span>
          </button>

          <span className="absolute top-3.5 right-3.5 bg-amber-500 text-stone-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full z-10 font-sans shadow-lg animate-pulse">
            {vCategory} {lang === 'en' ? 'STOREFRONT' : 'ሱቅ'}
          </span>
        </div>

        {/* 3. PROFILE (Bio, Logo, Stats, Verification, Active Escrow ribbon) */}
        <div className="px-5 pb-5 pt-4 relative">
          {/* Logo overlapping Cover */}
          <div className={`absolute top-[-38px] left-5 w-18 h-18 rounded-full border-4 border-neutral-950 overflow-hidden shadow-xl flex items-center justify-center font-serif font-black select-none z-10 ${logoStyle.bg} ${logoStyle.text}`}>
            <span className="text-xl tracking-tight">{logoStyle.txt}</span>
          </div>

          <div className="pl-22 min-h-[44px] flex flex-col justify-center mb-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-lg font-extrabold text-stone-100 flex items-center gap-1">
                {vName}
              </h2>
              
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/25 flex items-center gap-1">
                <CheckCircle2 size={10} className="fill-current text-emerald-500" />
                {localT('verified')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400 mt-1 font-sans">
              <span className="text-amber-500 font-bold flex items-center gap-0.5">★ 4.9</span>
              <span className="text-stone-600">•</span>
              <span className="font-semibold text-stone-300">
                {sVendor.followersCount.toLocaleString()} {localT('followers')}
              </span>
            </div>

            {/* Detailed Business Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 p-3 bg-neutral-900/60 border border-neutral-850 rounded-2xl text-[11px] text-stone-300">
              <div>
                <span className="text-stone-550 block text-[9px] uppercase font-bold tracking-wider">📍 Address</span>
                <span className="font-medium text-stone-250 truncate block">Bole Atlas, Addis Ababa</span>
              </div>
              <div>
                <span className="text-stone-550 block text-[9px] uppercase font-bold tracking-wider">⏳ On Every-zone</span>
                <span className="font-semibold text-amber-500">3 Years</span>
              </div>
              <div>
                <span className="text-stone-550 block text-[9px] uppercase font-bold tracking-wider">⚡ Response Time</span>
                <span className="font-semibold text-emerald-400">&lt; 15 mins</span>
              </div>
              <div>
                <span className="text-stone-550 block text-[9px] uppercase font-bold tracking-wider">🟢 Last Active</span>
                <span className="font-semibold text-emerald-400 font-mono">Active 4m ago</span>
              </div>
              <div>
                <span className="text-stone-550 block text-[9px] uppercase font-bold tracking-wider">🛡 KYC Verified</span>
                <span className="font-semibold text-emerald-400">Level 2 (Fayda)</span>
              </div>
              <div>
                <span className="text-stone-550 block text-[9px] uppercase font-bold tracking-wider">💼 Store Code</span>
                <span className="font-mono font-bold text-amber-500">EZ-{viewedVendorId.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Active Subscription details */}
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 mb-4 space-y-1.5 text-xs text-left relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5 font-serif font-black text-4xl translate-x-3 translate-y-[-5px] select-none text-amber-500">✓</div>
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-stone-400 uppercase tracking-wider text-[9px] font-sans">
                {lang === 'en' ? 'Merchant Subscription:' : 'የነጋዴ የደንበኝነት ሁኔታ፡'}
              </span>
              <span className="text-amber-400 font-black bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 text-[9px] uppercase tracking-wider flex items-center gap-1 font-sans">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                {lang === 'en' ? 'ACTIVE / SECURED' : 'ንቁ አባል / የተጠበቀ'}
              </span>
            </div>
            <p className="text-stone-400 text-[10.5px] leading-relaxed font-medium">
              {localT('secText')}
            </p>
          </div>

          {/* 4. FOLLOW, MESSAGE, CALL, SHARE ACTIONS */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={handleToggleFollow}
                className={`text-xs py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isFollowed 
                    ? 'bg-neutral-850 border border-neutral-750 text-stone-300 hover:text-white' 
                    : 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-black shadow-lg shadow-amber-500/10'
                }`}
              >
                {isFollowed ? `✓ Following` : `+ Follow`}
              </button>
              <button 
                onClick={() => setIsMessageModalOpen(true)}
                className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-stone-700 text-stone-200 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                💬 {lang === 'en' ? 'Message' : 'መልዕክት'}
              </button>
              <button 
                onClick={() => {
                  alert(lang === 'en' ? `📞 Calling ${vName} at ${contactInfo.phone}...` : `📞 ወደ ${vName} በስልክ ቁጥር ${contactInfo.phone} በመደወል ላይ...`);
                }}
                className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-stone-700 text-stone-200 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                📞 {lang === 'en' ? 'Call' : 'ደውል'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Selector Bar for Fast Jump Filters */}
      <div className="flex gap-1.5 border-b border-neutral-850 pb-2 overflow-x-auto scrollbar-none select-none">
        {(['all', 'services', 'products', 'videos', 'posts', 'reviews', 'about', 'policies', 'team'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setVendorProfileTab(tab)}
            className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 uppercase tracking-wider ${
              vendorProfileTab === tab
                ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {tab === 'all' && "🏪 " + (lang === 'en' ? 'All-in-One' : 'ሁሉም በአንድ')}
            {tab === 'services' && "🛠️ " + (lang === 'en' ? 'Services' : 'አገልግሎቶች')}
            {tab === 'products' && "📦 " + (lang === 'en' ? 'Products' : 'ዕቃዎች')}
            {tab === 'videos' && "🎞️ " + (lang === 'en' ? 'Videos' : 'ቪዲዮዎች')}
            {tab === 'posts' && "📢 " + (lang === 'en' ? 'Posts' : 'ልጥፎች')}
            {tab === 'reviews' && "★ " + (lang === 'en' ? 'Reviews' : 'ግምገማዎች')}
            {tab === 'about' && "ℹ " + (lang === 'en' ? 'About' : 'ስለ እኛ')}
            {tab === 'policies' && "📜 " + (lang === 'en' ? 'Policies' : 'ፖሊሲዎች')}
            {tab === 'team' && "👥 " + (lang === 'en' ? 'Team' : 'ቡድናችን')}
          </button>
        ))}
      </div>

      {/* STACKED REDESIGNED VIEWS CONTAINER */}
      <div className="space-y-8 w-full">

        {/* 5. SERVICES SECTION */}
        {(vendorProfileTab === 'all' || vendorProfileTab === 'services') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl"
          >
            {vendorProfileTab === 'all' && (
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-850">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20 text-xs">
                  🛠️
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {lang === 'en' ? 'Verified Services & Packages' : 'የተረጋገጡ አገልግሎቶች እና ጥቅሎች'}
                  </h3>
                  <p className="text-[10px] text-stone-550">
                    {lang === 'en' ? 'Tailored commercial offerings & service packages' : 'ለእርስዎ የቀረቡ ልዩ ልዩ የንግድ አገልግሎቶች'}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                🛠️ {lang === 'en' ? 'Verified Business Offerings' : 'የተረጋገጡ የንግድ አገልግሎቶች'}
              </span>

              {(() => {
                const VENDOR_SERVICES_DB: any = {
                  v1: [
                    { id: "s-1", name: "Custom Tailoring & Fitting", duration: "3-5 Days", price: 2500, desc: "Personalized measurements and premium handweaving tailoring." },
                    { id: "s-2", name: "Habesha Wedding Styling Consultation", duration: "2 Hours", price: 1000, desc: "Bespoke embroidery geometry guidance for couples." }
                  ],
                  v2: [
                    { id: "s-3", name: "Traditional Roasting Ceremony Catering", duration: "4 Hours", price: 5000, desc: "Live high-altitude clay roasting ceremony for corporate celebrations." },
                    { id: "s-4", name: "Premium Bean Tasting & Export Consultancy", duration: "1 Day", price: 3000, desc: "Professional grade-1 Q-Grader flavor grading." }
                  ]
                };

                const list = VENDOR_SERVICES_DB[viewedVendorId] || [
                  { id: "s-def", name: "Premium Brand Bespoke Delivery Consultancy", duration: "Flexible", price: 1500, desc: "Secure commercial logistics planning and routing." }
                ];

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {list.map((srv: any) => (
                      <div key={srv.id} className="bg-neutral-900 border border-neutral-850 p-4 rounded-2xl flex justify-between gap-4 items-start relative overflow-hidden text-left">
                        <TraditionalCornerOrnament />
                        <div className="space-y-2 flex-1">
                          <h4 className="text-xs font-extrabold text-stone-100">{srv.name}</h4>
                          <p className="text-[10.5px] text-stone-400 leading-normal font-sans">{srv.desc}</p>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-amber-500 font-bold">
                            <span>⏱ {srv.duration}</span>
                            <span>•</span>
                            <span>💰 {srv.price.toLocaleString()} ETB</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setBookingModalItem({ ...srv, type: "SERVICE", vendorId: viewedVendorId })}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10px] font-black rounded-lg transition shrink-0 cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* 6. PRODUCTS & LISTINGS SECTION */}
        {(vendorProfileTab === 'all' || vendorProfileTab === 'products') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl"
          >
            {vendorProfileTab === 'all' && (
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-850">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20 text-xs">
                  📦
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {lang === 'en' ? 'Bespoke Storefront Inventory' : 'የሱቅ ዕቃዎች እና የንግድ ካታሎግ'}
                  </h3>
                  <p className="text-[10px] text-stone-550">
                    {lang === 'en' ? 'Premium products and verified real estate listings' : 'የተረጋገጡ ምርቶች እና የሪል እስቴት ካታሎግ'}
                  </p>
                </div>
              </div>
            )}

            {/* Search and filter controls */}
            <div className="bg-neutral-900/40 p-3 rounded-2xl border border-neutral-850 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input 
                  type="text"
                  value={vendorStoreSearch}
                  onChange={(e) => setVendorStoreSearch(e.target.value)}
                  placeholder={lang === 'en' ? "Search products inside this store..." : "በዚህ ሱቅ ውስጥ ዕቃዎችን ፈልግ..."}
                  className="w-full text-xs bg-neutral-950 border border-neutral-800 text-stone-200 placeholder-stone-500 pl-9 pr-4 py-2 rounded-xl focus:border-amber-500/50 outline-none transition"
                />
              </div>

              <select
                value={vendorStoreSort}
                onChange={(e) => setVendorStoreSort(e.target.value as any)}
                className="bg-neutral-950 border border-neutral-800 text-stone-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500/50"
              >
                <option value="newest">🕒 Newest</option>
                <option value="popular">🔥 Popular</option>
                <option value="rating">★ Rating</option>
                <option value="priceAsc">💰 Price: Low to High</option>
                <option value="priceDesc">💰 Price: High to Low</option>
              </select>
            </div>

            {/* Products grid render */}
            <div className="space-y-4">
              {(() => {
                let filteredProds = [...(vendorMarketplaceProducts || [])];
                if (vendorStoreSearch.trim() !== '') {
                  const query = vendorStoreSearch.toLowerCase();
                  filteredProds = filteredProds.filter(p => 
                    p.title?.toLowerCase().includes(query) || 
                    p.description?.toLowerCase().includes(query)
                  );
                }
                if (vendorStoreSort === 'newest') {
                  filteredProds.sort((a, b) => b.id.localeCompare(a.id));
                } else if (vendorStoreSort === 'popular') {
                  filteredProds.sort((a, b) => (b.salesCount || 10) - (a.salesCount || 10));
                } else if (vendorStoreSort === 'rating') {
                  filteredProds.sort((a, b) => (b.rating || 4.9) - (a.rating || 4.9));
                } else if (vendorStoreSort === 'priceAsc') {
                  filteredProds.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                } else if (vendorStoreSort === 'priceDesc') {
                  filteredProds.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
                }

                if (filteredProds.length === 0) {
                  return (
                    <div className="text-center py-6 text-stone-500 text-xs font-sans">
                      {lang === 'en' ? 'No products match your search.' : 'ምርቶች አልተገኙም።'}
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                      🛍️ {lang === 'en' ? 'Shop Products' : 'የሱቅ ዕቃዎች'} ({filteredProds.length})
                    </span>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredProds.map(p => {
                        const mainImage = p.images?.[0]?.imageUrl || p.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600';
                        return (
                          <motion.div 
                            key={p.id}
                            whileHover={{ y: -3 }}
                            onClick={() => setSelectedMarketplaceProduct(p)}
                            className="bg-neutral-900 border border-neutral-850 hover:border-amber-500/40 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between relative transition-all group shadow-sm hover:shadow-md text-left"
                          >
                            <img src={mainImage} alt={p.title} className="w-full h-28 object-cover group-hover:scale-105 transition-all duration-500 opacity-80" referrerPolicy="no-referrer" />
                            <div className="p-2.5 flex-1 flex flex-col justify-between bg-neutral-950">
                              <div>
                                <h3 className="text-xs font-bold line-clamp-2 text-stone-200 mb-2 leading-relaxed h-8 font-sans">
                                  {p.title}
                                </h3>
                              </div>
                              <div>
                                <div className="text-xs font-black text-amber-500 font-mono mb-1">
                                  {p.discountPrice ? `${p.discountPrice.toLocaleString()} ETB` : `${p.price.toLocaleString()} ETB`}
                                </div>
                                {p.discountPrice && (
                                  <div className="text-[10px] text-stone-500 line-through font-mono">
                                    {p.price.toLocaleString()} ETB
                                  </div>
                                )}
                              </div>
                            </div>
                            <TraditionalCornerOrnament />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* 7. VIDEOS SECTION */}
        {(vendorProfileTab === 'all' || vendorProfileTab === 'videos') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl"
          >
            {vendorProfileTab === 'all' && (
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-850">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20 text-xs">
                  🎞️
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {lang === 'en' ? 'Short Creator Video Logs' : 'የፈጣሪ አጫጭር ቪዲዮዎች'}
                  </h3>
                  <p className="text-[10px] text-stone-550">
                    {lang === 'en' ? 'Behind-the-scenes craft loops and custom promotions' : 'የምርት ጥራትና ዝግጅት ቪዲዮ ማሳያዎች'}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                🎞️ {lang === 'en' ? 'Short Creator Reels' : 'የፈጣሪ አጫጭር ቪዲዮዎች'} ({sVendor.videos.length})
              </span>

              {sVendor.videos.length === 0 ? (
                <div className="text-center py-6 text-stone-500 text-xs font-sans">
                  No video reels uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sVendor.videos.map((vid: any) => {
                    const viewsCount = (vid.likes * 14) + 420;
                    const isLiked = vid.liked;

                    return (
                      <motion.div 
                        key={vid.id} 
                        whileHover={{ scale: 1.01, y: -2 }}
                        onClick={() => setActiveVideoModal({ ...vid, thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600", views: viewsCount })}
                        className="bg-neutral-950 border border-neutral-850 hover:border-amber-500/30 rounded-2xl overflow-hidden cursor-pointer relative flex flex-col aspect-[9/14] group shadow-lg text-left"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600" 
                          alt={vid.titleEn} 
                          className="absolute inset-0 w-full h-full object-cover opacity-75 filter brightness-90 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
                          <span className="bg-amber-500 text-stone-950 text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase select-none font-sans shadow-md">
                            ▶ REEL
                          </span>
                          <span className="text-[9px] text-stone-300 font-bold bg-black/55 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10 font-mono">
                            {viewsCount.toLocaleString()} views
                          </span>
                        </div>

                        <div className="mt-auto p-3 z-10 space-y-2">
                          <h4 className="text-[11px] font-black text-white leading-snug line-clamp-2 drop-shadow-md">
                            {lang === 'en' ? vid.titleEn : vid.titleAm}
                          </h4>
                          
                          <div className="flex items-center justify-between text-[10px] text-stone-300 select-none">
                            <span className={`flex items-center gap-1 font-bold ${isLiked ? 'text-red-500' : 'text-stone-300'}`}>
                              <Heart size={11} fill={isLiked ? 'currentColor' : 'none'} />
                              <span>{vid.likes}</span>
                            </span>
                            <span className="flex items-center gap-1 font-bold">
                              <MessageCircle size={11} />
                              <span>{vid.comments.length}</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 8. POSTS (SOCIAL TIMELINE) SECTION */}
        {(vendorProfileTab === 'all' || vendorProfileTab === 'posts') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl"
          >
            {vendorProfileTab === 'all' && (
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-850">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20 text-xs">
                  📢
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {lang === 'en' ? 'Merchant Updates & Promotion Feed' : 'የሻጭ ልጥፎች እና የማስታወቂያ ገጽ'}
                  </h3>
                  <p className="text-[10px] text-stone-550">
                    {lang === 'en' ? 'Social timeline updates, promotions and product launches' : 'የማህበራዊ ገጽ ልጥፎች፣ ማስታወቂያዎችና ዜናዎች'}
                  </p>
                </div>
              </div>
            )}

            {/* CREATE NEW POST FORM (ONLY SHOWN IF ACTING AS THE VIEWED VENDOR) */}
            {actingVendorId === viewedVendorId && (
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3 shadow-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
                    📢 {lang === 'en' ? 'Publish a Merchant Update' : 'አዲስ የሱቅ ልጥፍ ያውጡ'}
                  </h4>
                  <span className="text-[9px] text-amber-400 font-bold font-mono px-2 py-0.5 bg-amber-500/10 rounded">EZ-CREATOR MODE</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {(['PRODUCT', 'PROMOTION', 'ANNOUNCEMENT', 'JOB', 'PROPERTY'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewPostType(type)}
                        className={`px-2.5 py-1 rounded-lg text-[8.5px] font-black tracking-wider transition border ${
                          newPostType === type
                            ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-sm'
                            : 'bg-neutral-950 border-neutral-850 text-stone-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder={lang === 'en' ? "Post Title (Optional)" : "ርዕስ (አማራጭ)"}
                      className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-1.5 text-stone-250 outline-none focus:border-amber-500/40"
                    />
                    <select
                      value={newPostVisibility}
                      onChange={(e) => setNewPostVisibility(e.target.value as any)}
                      className="bg-neutral-950 border border-neutral-850 text-stone-300 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-amber-500/40"
                    >
                      <option value="PUBLIC">🌎 Public</option>
                      <option value="FOLLOWERS_ONLY">👥 Followers Only</option>
                    </select>
                  </div>

                  <textarea
                    required
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={lang === 'en' ? "Share your exciting news, discount codes, or new inventory with customers..." : "አዳዲስ የሱቅ ዜናዎችን፣ ቅናሾችን ወይም ምርቶችን ለደንበኞች ያካፍሉ..."}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-2.5 text-stone-200 outline-none focus:border-amber-500/40 min-h-[50px]"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCreateTimelinePost(viewedVendorId)}
                      className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] px-4 py-2 rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus size={12} />
                      <span>{lang === 'en' ? 'Publish Update' : 'ልጥፍ አውጣ'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TIMELINE POSTS FEED LIST */}
            <div className="space-y-4">
              {isFetchingTimeline ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <div className="w-5 h-5 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                  <span className="text-[11px] text-stone-400">Loading ledger posts...</span>
                </div>
              ) : timelinePosts.length > 0 ? (
                timelinePosts.map((post) => {
                  const isCommentsOpen = activeCommentPostId === post.id;
                  return (
                    <div key={post.id} className="bg-neutral-900/60 border border-neutral-850 rounded-2xl p-4 space-y-3 shadow-lg text-left relative overflow-hidden">
                      <TraditionalCornerOrnament />
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center font-serif font-black text-amber-500 border border-amber-500/25 text-xs">
                            {vName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-stone-100">{vName}</span>
                              <span className="bg-emerald-500/10 text-emerald-400 text-[7px] font-black px-1 py-0.5 rounded border border-emerald-500/20">
                                ✓ Verified
                              </span>
                            </div>
                            <span className="text-[8px] text-stone-500 flex items-center gap-0.5 mt-0.5">
                              <Clock size={8} /> {lang === 'en' ? 'Posted recently' : 'በቅርቡ የተለጠፈ'}
                            </span>
                          </div>
                        </div>
                        <span className="bg-neutral-950 border border-neutral-800 text-stone-400 text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                          📢 {post.type}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        {post.title && (
                          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wide">
                            {post.title}
                          </h4>
                        )}
                        <p className="text-[10.5px] text-stone-300 leading-relaxed whitespace-pre-wrap font-sans">
                          {post.content}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-850/60 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <button 
                          onClick={() => handleLikeTimelinePost(post.id)}
                          className="flex items-center gap-1 hover:text-red-400 transition cursor-pointer"
                        >
                          <Heart size={11} /> <span>{post.likesCount || 0} Likes</span>
                        </button>
                        <button 
                          onClick={() => setActiveCommentPostId(isCommentsOpen ? null : post.id)}
                          className="flex items-center gap-1 hover:text-amber-500 transition cursor-pointer"
                        >
                          <MessageCircle size={11} /> <span>{post.commentsCount || 0} Comments</span>
                        </button>
                        <button 
                          onClick={() => {
                            handleShareTimelinePost(post.id);
                            const postLink = `${window.location.origin}${window.location.pathname}#post=${post.id}`;
                            navigator.clipboard.writeText(postLink);
                            triggerPushNotification(
                              lang === 'en' ? 'Link Copied!' : 'ሊንክ ተገልብጧል!',
                              lang === 'en' ? 'Copied post share link.' : 'የልጥፉ መጋሪያ ሊንክ ኮፒ ተደርጓል።',
                              '🔗',
                              'social'
                            );
                          }}
                          className="flex items-center gap-1 hover:text-blue-400 transition cursor-pointer"
                        >
                          <Share2 size={11} /> <span>Share</span>
                        </button>
                      </div>

                      {/* Comments block */}
                      {isCommentsOpen && (
                        <div className="mt-2.5 pt-2.5 border-t border-neutral-850/40 space-y-2">
                          {post.comments && post.comments.length > 0 && (
                            <div className="space-y-2 max-h-[120px] overflow-y-auto scrollbar-none">
                              {post.comments.map((comm: any, idx: number) => (
                                <div key={comm.id || idx} className="text-[9.5px] bg-neutral-950 p-2 rounded-xl border border-neutral-850/50 flex gap-2">
                                  <span className="font-extrabold text-amber-500 shrink-0">@{comm.author.split(' ')[0]}</span>
                                  <p className="text-stone-300 flex-1">{comm.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-1.5">
                            <input 
                              type="text"
                              value={newCommentTexts[post.id] || ''}
                              onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder={lang === 'en' ? "Write a comment..." : "አስተያየት ይጻፉ..."}
                              className="flex-1 text-[10px] bg-neutral-950 border border-neutral-850 text-stone-200 px-3 py-1 rounded-lg outline-none focus:border-amber-500/20"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCommentTimelinePost(post.id);
                              }}
                            />
                            <button
                              onClick={() => handleCommentTimelinePost(post.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-3.5 rounded-lg flex items-center justify-center transition"
                            >
                              <Send size={9} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-stone-550 text-xs italic">
                  No social posts published yet by this merchant.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 9. REVIEWS SECTION */}
        {(vendorProfileTab === 'all' || vendorProfileTab === 'reviews') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl"
          >
            {vendorProfileTab === 'all' && (
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-850">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20 text-xs">
                  ★
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {lang === 'en' ? 'Amazon & Google Maps Style Reviews' : 'የደንበኞች አስተያየትና ታማኝነት ግምገማ'}
                  </h3>
                  <p className="text-[10px] text-stone-550">
                    {lang === 'en' ? 'Transparent escrow ledger transaction feedback & rating breakdown' : 'ደህንነቱ የተጠበቀና የተረጋገጠ የደንበኞች ግብረመልስ'}
                  </p>
                </div>
              </div>
            )}

            {/* Amazon Style Trust & Ratings break up */}
            <div className="bg-neutral-900 border border-neutral-850 p-4 rounded-2xl space-y-4 shadow-md text-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 flex items-center justify-center bg-neutral-950 font-mono text-base font-black text-amber-500">
                    {trustScore ? `${trustScore.score}%` : "95%"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">Identity KYC Score</span>
                      <span className="bg-emerald-500/15 text-emerald-400 text-[7px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {trustScore ? trustScore.badgeLevel : "EXCELLENT"}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500 font-bold text-xs mt-1 gap-1">
                      <span>{"★".repeat(5)}</span>
                      <span className="text-[9.5px] text-stone-400 font-bold font-mono">({trustScore ? trustScore.rating : "4.9"} / 5)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(trustScore?.badges || [
                    "✅ Verified Identity", "🛒 Verified Seller", "🛡 Escrow Protected", "⚡ Fast Response"
                  ]).map((badge: string, idx: number) => (
                    <span 
                      key={badge + idx} 
                      className="bg-neutral-950 border border-neutral-850 text-stone-300 text-[8.5px] font-bold px-2 py-1 rounded-lg flex items-center gap-0.5"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Write review form for non-vendors */}
            {actingVendorId !== viewedVendorId && (
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3 shadow-md text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
                    ✍️ {lang === 'en' ? 'Share Your Experience' : 'ልምድዎን ያካፍሉ'}
                  </h4>
                  <span className="text-[9px] text-stone-500">Act secure as <strong className="text-amber-500">@Selamawit</strong></span>
                </div>

                {reviewSuccessMsg && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold">
                    {reviewSuccessMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-stone-400">{lang === 'en' ? 'Your Rating:' : 'ደረጃ ይስጡ:'}</span>
                    <div className="flex gap-0.5 text-base">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewFormRating(star)}
                          className={`hover:scale-110 cursor-pointer ${star <= reviewFormRating ? 'text-amber-500' : 'text-neutral-700'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    value={reviewFormText}
                    onChange={(e) => setReviewFormText(e.target.value)}
                    placeholder={lang === 'en' ? "Describe your purchasing and delivery experience..." : "ደህንነቱ የተጠበቀውን የክፍያ እና የአቅርቦት ልምድዎን ያብራሩ..."}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-2 text-stone-200 outline-none focus:border-amber-500/40 min-h-[50px]"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCreateReviewLocal()}
                      className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] px-3.5 py-1.5 rounded-xl shadow-sm cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List of Reviews */}
            <div className="space-y-3">
              {reviewsLoading ? (
                <div className="text-center py-4 text-xs text-stone-400">Loading ledger reviews...</div>
              ) : dynamicReviews.length > 0 ? (
                dynamicReviews.map((rev, idx) => (
                  <div key={rev.id || idx} className="bg-neutral-900/40 border border-neutral-850/60 p-4 rounded-2xl space-y-2 relative overflow-hidden text-xs">
                    <TraditionalCornerOrnament />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-stone-850 flex items-center justify-center font-bold text-stone-300 text-[10px] uppercase">
                          {rev.userName.substring(0, 1)}
                        </div>
                        <div>
                          <span className="font-extrabold text-stone-200 block">{rev.userName}</span>
                          <span className="text-[8px] text-stone-500">Verified Buyer</span>
                        </div>
                      </div>
                      <span className="text-amber-500 font-bold">{"★".repeat(rev.rating)}</span>
                    </div>
                    <p className="text-stone-300 text-[10.5px] leading-relaxed font-sans">{rev.text}</p>
                    
                    {rev.reply && (
                      <div className="ml-4 p-2.5 bg-neutral-950 border-l-2 border-amber-500 rounded-r-xl space-y-1 text-[10px]">
                        <span className="font-black text-amber-500 uppercase tracking-wider block">Merchant Reply:</span>
                        <p className="text-stone-400 italic">{rev.reply}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-stone-500">No verified purchase reviews loaded on the ledger yet.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* 10. ABOUT & POLICIES SECTION */}
        {(vendorProfileTab === 'all' || vendorProfileTab === 'about' || vendorProfileTab === 'policies') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl"
          >
            {vendorProfileTab === 'all' && (
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-850">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20 text-xs">
                  ℹ
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {lang === 'en' ? 'About, TIN Credentials & Policies' : 'ስለ ሻጩ ማረጋገጫዎች እና የሱቅ መመሪያዎች'}
                  </h3>
                  <p className="text-[10px] text-stone-550">
                    {lang === 'en' ? 'Tax verification certificates, brand story and escrow policies' : 'የግብር ሰነዶች፣ የመመለሻ መመሪያዎች እና የሽምግልና ዋስትናዎች'}
                  </p>
                </div>
              </div>
            )}

            {/* Narrative story */}
            <div className="space-y-3 text-xs leading-relaxed text-stone-300">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
                📜 {lang === 'en' ? 'Our Brand Story' : 'የብራንዳችን ታሪክ'}
              </span>
              <p className="font-sans">
                {lang === 'en' 
                  ? "Founded in Addis Ababa, Ethiopia, we celebrate authentic Abyssinian heritage. Every item is produced securely under certified ESG environmental guidelines and traditional craftsmanship methods. We prioritize local employment and premium organic resources."
                  : "በአዲስ አበባ የተመሰረተው ሱቃችን እውነተኛ የኢትዮጵያን ጥበብና ቅርስ ያንጸባርቃል። እያንዳንዱ ምርት በባህላዊ እደ ጥበብ ዘዴዎች የተመረተ ሲሆን የአካባቢ ጥበቃን ያገናዘበ ነው። ለአካባቢው ማህበረሰብ የስራ እድል መፍጠርና ጥራትን ቅድሚያ እንሰጣለን።"}
              </p>

              {/* TIN & Official documents verification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
                <div className="bg-neutral-900 border border-neutral-850 p-3.5 rounded-2xl space-y-2 relative overflow-hidden">
                  <TraditionalCornerOrnament />
                  <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-wider block">Official Business Register</span>
                  <div className="space-y-1 text-[10.5px] font-mono text-stone-400">
                    <div>TIN: <strong className="text-stone-100">{contactInfo.tin}</strong></div>
                    <div>VAT ID: <strong className="text-stone-100">VAT-2244-885</strong></div>
                    <div>Tax Office: <strong className="text-stone-100">Addis Ababa Bole Region</strong></div>
                    <div className="text-[9px] text-emerald-400 font-black mt-1">✓ TAX COMPLIANCE CLEARANCE ACTIVE</div>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-850 p-3.5 rounded-2xl space-y-2 relative overflow-hidden">
                  <TraditionalCornerOrnament />
                  <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-wider block">Digital Coordinates Node</span>
                  <div className="space-y-1 text-[10.5px] font-mono text-stone-400">
                    <div>Fayda ID: <strong className="text-stone-100 font-sans">FYD-{viewedVendorId.toUpperCase()}-ETH-942</strong></div>
                    <div>Email: <strong className="text-stone-100 font-sans">{contactInfo.email}</strong></div>
                    <div>Web: <strong className="text-stone-100 font-sans">{contactInfo.website}</strong></div>
                    <div className="text-[9.5px] text-emerald-400 font-black mt-1 flex justify-between items-center">
                      <span>✓ ESCROW LEDGER SYNCED</span>
                      <button 
                        onClick={() => alert("Redirecting to Bole Atlas district navigator coordinates...")}
                        className="text-amber-500 font-extrabold hover:underline font-sans cursor-pointer text-[9px]"
                      >
                        Maps ↗
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapa Escrow Agreement & Shipping Standards Policies */}
            <div className="pt-4 border-t border-neutral-850 space-y-3 text-xs text-left">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
                🛡️ {lang === 'en' ? 'Store Escrow & Delivery Policies' : 'የክፍያና ማድረሻ መመሪያዎች'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-2xl text-[10.5px] leading-relaxed text-stone-400">
                  <span className="text-white font-black block mb-1">🛡 Escrow Guarantee</span>
                  {lang === 'en' 
                    ? "Your funds are securely held in escrow. The seller is only paid after you receive, inspect, and approve the product. If there is a dispute, our board will resolve it in 12 hours."
                    : "ገንዘብዎ በኤስክሮው ማቆያ ውስጥ በደህና ይቆያል። ለሻጩ የሚከፈለው ምርቱን ተቀብለው ትክክለኛነቱን ሲያረጋግጡ ብቻ ነው። በአለመግባባት ጊዜ በ12 ሰዓታት ውስጥ ውሳኔ ይሰጣል።"}
                </div>

                <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-2xl text-[10.5px] leading-relaxed text-stone-400">
                  <span className="text-white font-black block mb-1">🚚 48-Hour Returns</span>
                  {lang === 'en' 
                    ? "If the item is different from the catalog, you can file a return request within 48 hours for an instant full refund. Return delivery courier charges are covered."
                    : "ምርቱ ከተገለጸው የተለየ ከሆነ ሙሉ ክፍያዎን ለመመለስ በ48 ሰዓታት ውስጥ የይመለስልኝ ጥያቄ ማቅረብ ይችላሉ። የመመለሻ ፈጣን መልዕክተኛ ዋጋ በሱቃችን ይሸፈናል።"}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 11. TEAM MEMBERS TAB (Real Estate Agency specific design audit) */}
        {(vendorProfileTab === 'all' || vendorProfileTab === 'team') && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-850">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20 text-xs">
                👥
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  {lang === 'en' ? 'Our Certified Expert Team' : 'የተረጋገጡ የባለሙያዎች ቡድናችን'}
                </h3>
                <p className="text-[10px] text-stone-550">
                  {lang === 'en' 
                    ? 'Licensed real estate brokers, escrow appraisal officers and diaspora legal guides' 
                    : 'ፈቃድ ያላቸው የሪል እስቴት ደላሎች፣ የንብረት አጋሮች እና የዲያስፖራ ህግ አማካሪዎች'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                {
                  name: "Almaz Tesfaye",
                  nameAm: "አልማዝ ተስፋዬ",
                  role: "Senior Acquisitions & Luxury Listings Lead",
                  roleAm: "ከፍተኛ የንብረት ግዥና የቅንጦት ቤቶች ኃላፊ",
                  license: "REA-ET-9204A",
                  languages: ["Amharic", "English", "Oromo"],
                  rating: "4.9",
                  phone: "+251911245678",
                  photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                },
                {
                  name: "Dawit Kebede",
                  nameAm: "ዳዊት ከበደ",
                  role: "Valuation Specialist & Escrow Appraisal Officer",
                  roleAm: "የንብረት ግምት ስፔሻሊስት እና የኤስክሮው ኦፊሰር",
                  license: "REA-ET-4811B",
                  languages: ["Amharic", "English", "Tigrinya"],
                  rating: "4.8",
                  phone: "+251912349876",
                  photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
                },
                {
                  name: "Nebiyu Solomon",
                  nameAm: "ነቢዩ ሰለሞን",
                  role: "Diaspora Clients Liaison & Title Appraisal Guide",
                  roleAm: "የዲያስፖራ ደንበኞች አስተባባሪ እና የባለቤትነት ህግ አማካሪ",
                  license: "REA-ET-5023D",
                  languages: ["Amharic", "English", "Arabic", "Somali"],
                  rating: "5.0",
                  phone: "+251910556677",
                  photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
                }
              ].map((member, idx) => (
                <div 
                  key={idx} 
                  className="bg-neutral-900 border border-neutral-850 p-4 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group shadow-md"
                >
                  <TraditionalCornerOrnament />
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300 shadow-md">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <h4 className="text-xs font-extrabold text-white">
                      {lang === 'en' ? member.name : member.nameAm}
                    </h4>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider font-sans">
                      {lang === 'en' ? member.role : member.roleAm}
                    </p>
                    <div className="text-[9px] text-stone-500 font-mono">
                      License: {member.license} • ★ {member.rating}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mt-2.5">
                    {member.languages.map((l, lIdx) => (
                      <span key={lIdx} className="text-[8px] font-black px-1.5 py-0.5 bg-neutral-950 text-stone-400 rounded-md border border-neutral-850">
                        {l}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full mt-4 pt-3.5 border-t border-neutral-850/60 text-[9.5px] font-black">
                    <button 
                      onClick={() => alert(`📞 Call triggered directly to ${member.name} at ${member.phone}...`)}
                      className="py-1.5 bg-neutral-950 border border-neutral-800 text-stone-300 rounded-xl hover:text-white hover:border-amber-500/40 transition cursor-pointer"
                    >
                      📞 Call
                    </button>
                    <button 
                      onClick={() => {
                        const preText = encodeURIComponent(`Selam ${member.name}, I found your agency card on Every-zone and would like to consult on a premium real estate listing!`);
                        window.open(`https://wa.me/${member.phone.replace('+', '')}?text=${preText}`, '_blank');
                      }}
                      className="py-1.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition cursor-pointer"
                    >
                      💬 WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Callback request widget */}
            <div className="mt-4 p-4 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-2.5 text-left relative overflow-hidden">
              <span className="text-[9.5px] font-extrabold text-amber-500 uppercase tracking-widest block font-sans">
                ✉️ {lang === 'en' ? 'Request Private Callback or Consultation' : 'የምክር ወይም የስልክ ጥሪ ጥያቄ ያቅርቡ'}
              </span>
              <p className="text-[10.5px] text-stone-400 font-sans leading-relaxed">
                {lang === 'en' 
                  ? "Input your phone or telegram handle below. Our dedicated diaspora support desk will coordinate with a senior agent to call you back within 15 minutes."
                  : "ስልክ ቁጥርዎን ወይም ቴሌግራም አድራሻዎን ከታች ያስገቡ። የዲያስፖራ አገልግሎት ሰራተኞቻችን በ15 ደቂቃ ውስጥ በባለሙያ ያስደውሉልዎታል።"}
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. +251 911 00 0000 or @telegram_handle" 
                  className="flex-1 bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none focus:border-amber-500"
                />
                <button 
                  onClick={() => alert("🎉 Callback Request Registered! A verified agent from the team will call you back shortly.")}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs px-4 py-2 rounded-xl uppercase transition cursor-pointer"
                >
                  {lang === 'en' ? 'Submit' : 'ላክ'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );

  function handleCreateReviewLocal() {
    if (!reviewFormText.trim()) return;
    setReviewSuccessMsg(lang === 'en' ? 'Review submitted successfully! Trust score updated.' : 'አስተያየትዎ በተሳካ ሁኔታ ደርሷል! የታማኝነት ነጥቡ ተሻሽሏል።');
    
    // Simulate updating the reviews on the parent ledger instantly
    const simulatedReview = {
      id: "sim-rev-" + Date.now(),
      targetType: 'VENDOR',
      targetId: viewedVendorId,
      userId: 'u-2',
      userName: 'Selamawit Tekle',
      rating: reviewFormRating,
      text: reviewFormText,
      reply: null,
      createdAt: new Date()
    };

    // Trigger local push notification
    triggerPushNotification(
      lang === 'en' ? 'Review Ledger Updated!' : 'ግምገማ ደርሷል!',
      lang === 'en' ? 'Your review is verified and saved on the ledger.' : 'ግምገማዎ ተረጋግጦ በደብተራችን ላይ ተቀምጧል።',
      '⭐',
      'reviews'
    );

    // Call actual backend submission if any
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simulatedReview)
    }).then(() => {
      fetchVendorReviewsAndTrust(viewedVendorId);
    });

    // Reset Form
    setReviewFormText('');
    setReviewFormPhoto('');
    setReviewFormVideo('');
    setReviewFormRating(5);
  }
}
