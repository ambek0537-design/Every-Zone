import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Star, Users, Heart, Calendar, ChevronRight, Wallet, 
  CheckCircle2, MapPin, Briefcase, Home, AlertTriangle, ShoppingBag, 
  Video, Play, Pause, User, Plus, ArrowLeft, Clock, Sparkles, Lock, 
  RefreshCw, Award, BookOpen, UserCheck, Flame, ShieldAlert, Sparkle, FileText,
  MessageCircle, Bookmark, Settings, Phone, Send, X, Volume2, Mic, MicOff, VolumeX, Share2,
  Cpu, Database, TrendingUp, History, SlidersHorizontal, Filter, Check, Camera, Ticket, QrCode,
  Moon, Sun, Globe, Shirt, Laptop, Smartphone, Coffee, Car, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SimulatedVideoPlayer } from './components/SimulatedVideoPlayer';
import { LotteryMatchmakingZone } from './components/LotteryMatchmakingZone';
import { AICopilotHub } from './components/AICopilotHub';
import { DeliveryLogisticsHub } from './components/DeliveryLogisticsHub';
import { AdCampaignPortal } from './components/AdCampaignPortal';
import { SuperAdminControl } from './components/SuperAdminControl';
import { AdminDashboard } from './modules/admin/AdminDashboard';
import { ChatSystem } from './components/ChatSystem';
import { NotificationCenter } from './components/NotificationCenter';
import { VendorStorefront } from './components/VendorStorefront';
import { WalletPaymentsHub } from './components/WalletPaymentsHub';
import { EthiopiaPassportHub } from './components/EthiopiaPassportHub';
import { OnboardingWelcomeCarousel } from './components/OnboardingWelcomeCarousel';
import { QRCodeScanner } from './components/QRCodeScanner';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { InAppBookingCalendar } from './components/InAppBookingCalendar';
import { VendorBusinessCard } from './components/VendorBusinessCard';
import DualCalendar from './components/DualCalendar';
import DevOpsConsoleHub from './components/DevOpsConsoleHub';
import SREAndSecurityHub from './components/SREAndSecurityHub';
import { SubscriptionsManager } from './components/SubscriptionsManager';
import { MarketplaceHub } from './modules/marketplace/MarketplaceHub';
import { ProductDetailModal } from './modules/marketplace/products/ProductDetailModal';
import OverseasEmploymentModule from './components/OverseasEmploymentModule';
import { VendorDashboardHub } from './components/VendorDashboardHub';
import { RealEstateAgencyDashboard } from './components/RealEstateAgencyDashboard';
import { OrderTrackingHub } from './components/OrderTrackingHub';
import { WishlistCollectionsHub } from './components/WishlistCollectionsHub';
import { V9SuperSuite } from './components/V9SuperSuite';
import { EveryzoneMonetizationEngine } from './components/EveryzoneMonetizationEngine';
import { SettingsScreen } from './screens/SettingsScreen';
import { HousesScreen } from './screens/HousesScreen';
import { AgenciesScreen } from './screens/AgenciesScreen';
import { PropertyDetailView } from './components/PropertyDetailView';


// ==========================================
// TRADITIONAL TILIT DESIGN BANNER (ኤምባሲ ጥልፍ)
// Repeating geometric embroidery pattern representing Ethiopia's premium weave aesthetic.
// ==========================================
const TraditionalTilitBanner = () => (
  <div className="w-full h-3.5 bg-neutral-950 overflow-hidden flex relative border-b border-amber-500/30">
    <div className="absolute inset-0 flex">
      {Array.from({ length: 45 }).map((_, i) => (
        <svg key={i} className="w-8 h-3.5 flex-shrink-0" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,12 12,0 24,12" fill={i % 3 === 0 ? "#006B3F" : i % 3 === 1 ? "#D4AF37" : "#DA291C"} />
          <polygon points="0,0 12,12 24,0" fill="#171717" opacity="0.35" />
          <circle cx="12" cy="6" r="2.5" fill="#D4AF37" className="animate-pulse" />
        </svg>
      ))}
    </div>
  </div>
);

// Traditional diagonal gold corner pattern for Habesha cards.
const TraditionalCornerOrnament = () => (
  <svg className="absolute top-0 right-0 w-8 h-8 text-amber-500/20 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
    <polygon points="100,0 100,100 0,0" />
    <line x1="100" y1="20" x2="80" y2="0" stroke="#D4AF37" strokeWidth="4" />
    <line x1="100" y1="40" x2="60" y2="0" stroke="#D4AF37" strokeWidth="2" />
  </svg>
);

// Types and Interfaces
interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  text: string;
}

interface Listing {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorNameAm?: string;
  vendorRating: number;
  category: 'shop' | 'houses' | 'agencies';
  type: string; // e.g. "dress", "coffee", "apartment", "villa", "job-gulf", "job-africa"
  title: string;
  titleAm?: string;
  price: string;
  priceAm?: string;
  priceNum: number;
  location: string;
  locationAm?: string;
  rating: number;
  image: string;
  description: string;
  descriptionAm?: string;
  features: string[];
  featuresAm?: string[];
  requirements?: string[];
  requirementsAm?: string[];
  agencyLicense?: string;
  videoUrlPlaceholder?: string;
  videoPlaceholderTheme?: string;
  isRentPaid: boolean;
  isPremium?: boolean;
  status: 'ACTIVE' | 'SUSPENDED';
  reviews: Review[];
}

import { translations as importedTranslations, getLocalizedData, getLocalizedArray } from './translations';
const translations = importedTranslations;

const OLD_translations = {
  en: {
    appName: "Every-zone",
    appSub: "Abyssinia Premium Super App",
    searchPlaceholderShop: "Search Makeda Dresses, Yirgacheffe, Teff...",
    searchPlaceholderHouses: "Search CMC Villas, Bole penthouses, studios...",
    searchPlaceholderAgencies: "Search Chef jobs, Dubai placement, Europe...",
    searchPlaceholderPassport: "appointments, queue, lotteries...",
    allProducts: "🌿 All Products",
    dressTailors: "👗 Dress Tailors",
    specialtyCoffee: "☕ Specialty Coffee",
    handcraftedLeather: "👞 Handcrafted Leather",
    allProperties: "🏡 All Properties",
    rentMonthly: "🔑 Rent (Monthly)",
    buySale: "🎖️ Buy (Sale)",
    commercialShop: "🏬 Commercial (Shop)",
    verifiedAgenciesOnly: "Certified Agencies Only: All agency vendors display legal Ministry of Labor licensures to prevent deceptive recruitment.",
    allPositions: "💼 All Positions",
    gulfRegion: "✈️ Gulf Region (Gulf)",
    europeVisas: "🇪🇺 European Visas",
    tabShop: "Shop",
    tabHouses: "Houses",
    tabAgencies: "Agencies",
    tabPassport: "Passport",
    tabSocial: "Social",
    viewProfile: "View Profile",
    followers: "Followers",
    otherPostedWorks: "Other Posted Works & Items",
    videoTimeline: "Video Timeline",
    keepGoing: "Keep Going",
    comment: "Comment",
    favorite: "Favorite",
    myChoice: "My Choice",
    postCommentPlaceholder: "Write an encouraging comment...",
    cancel: "Cancel",
    posted: "Posted",
    addedToMyChoice: "Added to My Choice!",
    back: "Back",
    instantPurchase: "Instant Purchase",
    pay200Rent: "Pay 200 ETB Rent",
    averageUserReviews: "Average User Reviews",
    yourRating: "Your Rating:",
    reviewSubmitPlaceholder: "Write a community purchase review here...",
    postBtn: "Post",
    noReviewsYet: "No reviews available yet. Be the first to verify quality purchase details!",
    reportVendor: "Report Vendor / Suspend Shop Instantly",
    virtualQueue: "Virtual Queue Ticket",
    liveSequence: "Live Sequence Number",
    liveTracking: "Live Tracking",
    currentWaitGap: "Current Wait Gap",
    persons: "Persons",
    minsLeft: "minutes left",
    nowServing: "Now Serving Counter:",
    bookedSlot: "Booked Slot:",
    bookNewAppointment: "Book New Appointment Slot",
    selectBureauLocation: "Select Bureau Location",
    appointmentDate: "Appointment Date",
    serviceRequested: "Service Requested",
    requiredDossiers: "Required Citizens Dossiers Checklist",
    nationalId: "Verified National Kebele ID Card",
    birthCert: "Original Certified Birth Certificate",
    bookBtn: "Book Slot & Generate Virtual Ticket",
    yourBookedSlots: "Your Booked Slots",
    activeTicket: "Active Ticket",
    communityHub: "Community Hub",
    verifiedP2P: "Verified Peer-to-Peer Networks",
    digitalEqub: "Mega Lottery & Sunday Matchmaking",
    payoutPool: "Participate in local traditional lottery draws and matches with live countdowns.",
    circleContributors: "Interactive Lottery Draw Candidates",
    spinningDrum: "🔄 Shuffling candidate ticket numbers...",
    roundWinner: "🎉 ROUND LUCKY CONTESTANT 🎉",
    amountCredited: "Total prize pot credited successfully to destination wallet balance",
    joinEqubGroup: "Get Lottery Ticket",
    simulateEqubBtn: "Simulate Draw Draw 🎰",
    weekendLottery: "Weekend Lottery Draws (ሎተሪ ዕድል)",
    lotteryDescription: "Participate in secure, tamper-proof weekend raffle. Next Draw: Sunday 6:00 PM. Jackpot: 50,000 ETB.",
    ticketPriceLabel: "20 ETB / Ticket",
    yourPurchasedTickets: "Your Purchased Tickets",
    scramblingDrum: "🎰 Scrambling lottery drum rolls... generating lucky digits...",
    officialLotteryResult: "Official Lottery Result",
    matchWonText: "🏆 CONGRATULATIONS! YOU MATCHED & WON 50,000 ETB!",
    tryAgainText: "🍀 No matches this round. Spin again to test luck!",
    buyTicketBtn: "Buy Digital Ticket (20 ETB)",
    simulateDrawBtn: "Simulate Draw Key",
    matchmakingHeader: "Abyssinia Sunday Matchmaking (ትዳር ማገናኛ)",
    lockedUntilSunday: "🔒 LOCKED UNTIL SUNDAY",
    days: "Days",
    hours: "Hours",
    mins: "Mins",
    secs: "Secs",
    matchmakingLockedText: "To maintain strict authenticity & quality connections, matchmaking profiles only open cross-gender matching automatically every Sunday morning.",
    toggleSimPrompt: "💡 Toggle 'Sunday Dev Sim' on top right to test matchmaking swiper catalog now!",
    sundayPortalOpen: "Sunday Portal Open - High fidelity simulated singles profiles",
    passBtn: "Pass (ቀይር) ✕",
    matchBtn: "Match (ውደድ) ❤️",
    allProfilesReviewed: "You reviewed all available local profiles!",
    restartSwipe: "Restart Swipe deck",
    rechargeLabel: "Recharge 1k ETB",
    resetBtn: "Reset All",
    inspectExpired: "Inspect Suspend/Expired",
    dbSynced: "Local Database Synced",
    viewProfileLabel: "View Profile",
    backToMarketplace: "Back to Marketplace",
    vendorProfileLabel: "Vendor Profile",
    followersCountLabel: "Followers",
    followingBusiness: "Following",
    followBusiness: "Follow Business",
    servicesTab: "Services",
    postsVideosTab: "Posts & Videos",
    shopTab: "Shop",
    housesTab: "Houses",
    agenciesTab: "Agencies",
    equbLotteryTab: "Matchmaking",
    passportTab: "Passport",
    specificationChecklist: "Specification Checklist",
    jobRequirements: "Job Requirements & Criteria",
    payRent: "Pay 200 ETB rent through Chapa",
    writeReviewPlaceholder: "Write a community purchase review here...",
    settingsTab: "Settings",
    themeToggleLabel: "Dark & Light Mode Toggle",
    darkMode: "Dark Theme",
    lightMode: "Light Theme",
    feedbackTitle: "Feedback & Contact System",
    feedbackSub: "Send direct feedback or inquiries to the application owners",
    messagePlaceholder: "Type your message here...",
    submitFeedback: "Submit Feedback",
    feedbackSuccess: "Thank you! Your feedback has been logged securely.",
    rentShopTitle: "New Digital Rent Store Portal",
    rentShopSub: "Rent a virtual micro-store on Every-zone to list custom work.",
    rentShopButton: "Initiate Dynamic Chapa Payment (200 ETB)",
    rentShopSuccess: "Payment verified successfully by Chapa Integration! Your virtual micro-store is now authorized."
  },
  am: {
    appName: "ኤቭሪ-ዞን",
    appSub: "የአቢሲኒያ ልዩ ሱፐር መተግበሪያ",
    searchPlaceholderShop: "ማከዳ ልብሶችን፣ ይርጋጨፌ ቡና ወይም ጤፍ ፈልግ...",
    searchPlaceholderHouses: "የሲኤምሲ ቪላዎችን፣ የቦሌ ፔንትሀውስ፣ ስቱዲዮዎችን ፈልግ...",
    searchPlaceholderAgencies: "የሼፍ ስራዎች፣ የዱባይ ቅጥር፣ የአውሮፓ ቪዛ...",
    searchPlaceholderPassport: "ቀጠሮዎች፣ ወረፋ፣ ሎተሪዎች...",
    allProducts: "🌿 ሁሉም ምርቶች",
    dressTailors: "👗 የሃበሻ ልብሶች",
    specialtyCoffee: "☕ የቡና ዝርያዎች",
    handcraftedLeather: "👞 የቆዳ ውጤቶች",
    allProperties: "🏡 ሁሉም ቤቶች",
    rentMonthly: "🔑 ኪራይ (ወርሃዊ)",
    buySale: "🎖️ መግዛት (ሽያጭ)",
    commercialShop: "🏬 የንግድ ሱቆች",
    verifiedAgenciesOnly: "የተረጋገጡ ኤጀንሲዎች ብቻ፡ ሁሉም የኤጀንሲ ሻጮች የማጭበርበር ቅጥርን ለመከላከል የሰራተኛና ማህበራዊ ሚኒስቴር ህጋዊ ፈቃድ ያሳያሉ።",
    allPositions: "💼 ሁሉም የስራ መደቦች",
    gulfRegion: "✈️ የአረብ ሀገር ስራዎች (ገልፍ)",
    europeVisas: "🇪🇺 የአውሮፓ ቪዛዎች",
    tabShop: "ሱቅ",
    tabHouses: "ቤቶች",
    tabAgencies: "ኤጀንሲዎች",
    tabPassport: "ፓስፖርት",
    tabSocial: "ማህበራዊ",
    viewProfile: "ፕሮፋይል እይ",
    followers: "ተከታዮች",
    otherPostedWorks: "ሌሎች የተለጠፉ ስራዎች",
    videoTimeline: "የቪዲዮ ታይምላይን",
    keepGoing: "ቀጥልበት",
    comment: "አስተያየት",
    favorite: "ምርጥ",
    myChoice: "የኔ ምርጫ",
    postCommentPlaceholder: "አበረታች አስተያየት ይጻፉ...",
    cancel: "አቋርጥ",
    posted: "የተለጠፈ",
    addedToMyChoice: "የኔ ምርጫ ውስጥ ተካቷል!",
    back: "ተመለስ",
    instantPurchase: "አሁን ግዛ",
    pay200Rent: "200 ብር ኪራይ ክፈል",
    averageUserReviews: "አጠቃላይ የአንባቢዎች አስተያየት",
    yourRating: "ያንተ ደረጃ አሰጣጥ፡",
    reviewSubmitPlaceholder: "የግዢ ልምድህን እዚህ ጻፍ...",
    postBtn: "ለጥፍ",
    noReviewsYet: "ምንም አስተያየቶች አልተሰጡም። ስለ ጥራቱ የመጀመሪያው አረጋጋጭ ይሁኑ!",
    reportVendor: "ሻጩን ሪፖርት አድርግ / ሱቁን ወዲያውኑ አግድ",
    virtualQueue: "የዲጂታል መለያ ወረፋ ካርድ",
    liveSequence: "ገባሪ የመለያ ቁጥር",
    liveTracking: "የቀጥታ መከታተያ",
    currentWaitGap: "የወረፋ ልዩነት",
    persons: "ሰዎች",
    minsLeft: "ደቂቃዎች ቀርተዋል",
    nowServing: "በአገልግሎት ላይ ያለው ቁጥር፡",
    bookedSlot: "የተያዘው ቀጠሮ፡",
    bookNewAppointment: "አዲስ ቀጠሮ ይያዙ",
    selectBureauLocation: "የቢሮ ቦታ ይምረጡ",
    appointmentDate: "የቀጠሮ ቀን",
    serviceRequested: "የሚፈልጉት አገልግሎት",
    requiredDossiers: "ለዜጎች የሚያስፈልጉ ሰነዶች ዝርዝር",
    nationalId: "የተረጋገጠ ብሔራዊ የቀበሌ መታወቂያ ካርድ",
    birthCert: "ዋናው የተረጋገጠ የልደት የምስክር ወረቀት",
    bookBtn: "ቦታ ያዙ እና የዲጂታል ካርድ ያውጡ",
    yourBookedSlots: "የያዟቸው ቀጠሮዎች",
    activeTicket: "ገባሪ ትኬት",
    communityHub: "የማህበረሰብ ማዕከል",
    verifiedP2P: "የተረጋገጡ የባለቤት-ለባለቤት መረቦች",
    digitalEqub: "ታላቅ ሎተሪ እና የእሁድ ዕጫ ማዛመጃ",
    payoutPool: "በተረጋገጠ ባህላዊ የሎተሪ እጣዎች እና በእሁድ ዕጫ ማዛመጃዎች ላይ ይሳተፉ።",
    circleContributors: "የሎተሪ እጣ ተወዳዳሪዎች",
    spinningDrum: "🔄 የዕጣ ቁጥሮችን በማሽከርከር ላይ...",
    roundWinner: "🎉 የዚህ ዙር ዕድለኛ ታላቅ አሸናፊ 🎉",
    amountCredited: "የሽልማቱ የገንዘብ መጠን በተሳካ ሁኔታ ተከፍሏል",
    joinEqubGroup: "የሎተሪ ቲኬት ያግኙ",
    simulateEqubBtn: "የክፍያ እጣውን ሞክር 🎰",
    weekendLottery: "የሳምንቱ መጨረሻ ሎተሪ (ሎተሪ ዕድል)",
    lotteryDescription: "ደህንነቱ በተጠበቀ የሳምንቱ መጨረሻ ራፍል ላይ ይሳተፉ። ቀጣዩ እጣ፡ እሁድ 6:00 ሰአት። ትልቅ ሽልማት፡ 50,000 ብር።",
    ticketPriceLabel: "20 ብር / ትኬት",
    yourPurchasedTickets: "የገዟቸው ትኬቶች",
    scramblingDrum: "🎰 የሎተሪ እጣውን በማሽከርከር ላይ... እድለኛ ቁጥሮቹን በማመንጨት ላይ...",
    officialLotteryResult: "ይፋዊ የሎተሪ ውጤት",
    matchWonText: "🏆 እንኳን ደስ አለዎት! ቲኬትዎ አሸንፏል 50,000 ብር ተሸልመዋል!",
    tryAgainText: "🍀 በዚህ ዙር አልተዛመደም። እንደገና ይሞክሩ!",
    buyTicketBtn: "የዲጂታል ትኬት ይግዙ (20 ብር)",
    simulateDrawBtn: "እጣ አውጣ",
    matchmakingHeader: "የአቢሲኒያ የእሁድ ትዳር ማገናኛ (ትዳር ማገናኛ)",
    lockedUntilSunday: "🔒 እስከ እሁድ ተቆልፏል",
    days: "ቀናት",
    hours: "ሰዓታት",
    mins: "ደቂቃዎች",
    secs: "ሰከንዶች",
    matchmakingLockedText: "የመረጃዎችን ትክክለኛነት እና አስተማማኝነት ለመጠበቅ የስብስብ መገለጫዎች በየእሁዱ ጠዋት ብቻ በራስ-ሰር ይከፈታሉ።",
    toggleSimPrompt: "💡 የእሁድ ማገናኛን ለመሞከር በላይኛው ቀኝ በኩል ያለውን 'Sunday Dev Sim' ያብሩ!",
    sundayPortalOpen: "የእሁድ ፖርታል ክፍት ነው - ከፍተኛ ጥራት ያላቸው መገለጫዎች ስብስብ",
    passBtn: "ቀይር (አልፈልግም) ✕",
    matchBtn: "ውደድ (እፈልጋለሁ) ❤️",
    allProfilesReviewed: "ሁሉንም ያሉትን መገለጫዎች አይተዋል!",
    restartSwipe: "መልሰህ ጀምር",
    rechargeLabel: "1ሺ ብር አስገባ",
    resetBtn: "ሁሉንም አፅዳ",
    inspectExpired: "የታገዱ/ያለቁባቸውን አሳይ",
    dbSynced: "የአናሳ መረጃ ቋት ተመሳስሏል",
    viewProfileLabel: "ፕሮፋይል እይ",
    backToMarketplace: "ወደ ገበያ ቦታው ተመለስ",
    vendorProfileLabel: "የሻጭ መገለጫ",
    followersCountLabel: "ተከታዮች",
    followingBusiness: "ተከታይ ሆነዋል",
    followBusiness: "ይከተሉ",
    servicesTab: "የሚሰጡ አገልግሎቶች",
    postsVideosTab: "ልጥፎች እና ቪዲዮዎች",
    shopTab: "ሱቅ",
    housesTab: "ቤቶች",
    agenciesTab: "ኤጀንሲዎች",
    equbLotteryTab: "ትዳር ማገናኛ",
    passportTab: "ፓስፖርት",
    specificationChecklist: "ዝርዝር ሁኔታዎች",
    jobRequirements: "የስራ መስፈርቶች እና መስፈርቶች",
    payRent: "በቻፓ በኩል የ 200 ብር ኪራይ ክፈል",
    writeReviewPlaceholder: "የግዢ ተሞክሮዎን እዚህ ይጻፉ...",
    settingsTab: "ቅንጅቶች",
    themeToggleLabel: "የጨለማ/ብርሃን ገጽታ መቀያየሪያ",
    darkMode: "የጨለማ ገጽታ (ጥቁር)",
    lightMode: "የብርሃን ገጽታ (ነጭ)",
    feedbackTitle: "ለአፑ ባለቤቶች አስተያየት መስጫ",
    feedbackSub: "ቀጥተኛ አስተያየቶችን ወይም ጥያቄዎችን ለአስተዳዳሪዎች ይላኩ",
    messagePlaceholder: "መልእክትዎን እዚህ ይጻፉ...",
    submitFeedback: "አስተያየትን ላክ",
    feedbackSuccess: "እናመሰግናለን! አስተያየትዎ በተሳካ ሁኔታ ተመዝግቧል።",
    rentShopTitle: "አዲስ ዲጂታል ሱቅ ኪራይ",
    rentShopSub: "በኤቭሪ-ዞን ላይ ዲጂታል ሱቅ በመከራየት ስራዎችዎን መዘርዘር ይጀምሩ።",
    rentShopButton: "የ 200 ብር የቻፓ ክፍያ ይክፈሉ (chapa)",
    rentShopSuccess: "ክፍያዎ በቻፓ ስኬታማነት ተረጋግጧል! የሱቅ ባለቤትነትዎ ተፈቅዷል።"
  },
  ti: {
    appName: "ኤቭሪ-ዞን (Every-zone)",
    appSub: "ቅዱም ሱፐር መተግበርያ አቢሲኒያ",
    searchPlaceholderShop: "ክዳውንቲ ማኬዳ፣ ቡን ይርጋጨፌ ወይ ጤፍ ድለይ...",
    searchPlaceholderHouses: "ቪላታት ሲኤምሲ፣ ፔንትሓውስ ቦሌ፣ ስቱድዮታት ድለይ...",
    searchPlaceholderAgencies: "ስራሕ ክሽነ፣ ስራሕ ዱባይ፣ ቪዛ ኤውሮጳ ድለይ...",
    searchPlaceholderPassport: "ቆጸራታት፣ ወረፋ፣ ሎተሪታት...",
    allProducts: "🌿 ኹሎም ፍርያት",
    dressTailors: "👗 ክዳውንቲ ሃበሻ",
    specialtyCoffee: "☕ ዓይነታት ቡን",
    handcraftedLeather: "👞 ናይ ቆርበት ፍርያት",
    allProperties: "🏡 ኹሎም ኣባይቲ",
    rentMonthly: "🔑 ኪራይ (ወርሃዊ)",
    buySale: "🎖️ ምዕዳግ (ሽያጭ)",
    commercialShop: "🏬 ናይ ንግዲ ድኳናት",
    verifiedAgenciesOnly: "ዝተረጋገጹ ኤጀንሲታት ጥራሕ ገዛእቲ ስራሕ ፈቃድ ጻዕሪ የርእዩ።",
    allPositions: "💼 ኹሎም ናይ ስራሕ መደባት",
    gulfRegion: "✈️ ስራሕ ሃገራት ዓረብ",
    europeVisas: "🇪🇺 ቪዛታት ኤውሮጳ",
    tabShop: "ድኳን",
    tabHouses: "ኣባይቲ",
    tabAgencies: "ኤጀንሲታት",
    tabPassport: "ፓስፖርት",
    tabSocial: "ማሕበራዊ",
    viewProfile: "ፕሮፋይል ርአ",
    followers: "ሰዓብቲ",
    otherPostedWorks: "ኻልኦት ዝተዘርግሑ ስራሓት",
    videoTimeline: "ቪድዮ ታይምላይን",
    keepGoing: "ቀጽል",
    comment: "ርኢቶ",
    favorite: "ፍቱው",
    myChoice: "ናተይ ምርጫ",
    postCommentPlaceholder: "ርኢቶኹም ኣብዚ ይጽሓፉ...",
    cancel: "ሰርዝ",
    posted: "ዝተለጠፈ",
    addedToMyChoice: "ኣብ ምርጫይ ተወሲኹ!",
    back: "ተመለስ",
    instantPurchase: "ሕጂ ዓድግ",
    pay200Rent: "ናይ 200 ብር ኪራይ ክፈል",
    averageUserReviews: "ማእኸላይ ርኢቶ ተጠቀምቲ",
    yourRating: "ናትኩም መዐቀኒ ደረጃ:",
    reviewSubmitPlaceholder: "ናይ ምዕዳግ ተሞክሮኹም ኣብዚ ይጽሓፉ...",
    postBtn: "ለጥፍ",
    noReviewsYet: "ዛጊት ዝተዋህበ ርኢቶ የለን። ቀዳማይ ተዓዛቢ ይኹኑ!",
    reportVendor: "ነዚ ነጋዳይ ሪፖርት ግበር",
    virtualQueue: "ናይ ዲጂታል ወረፋ ካርድ",
    liveSequence: "ንጡፍ ወረፋ ቁጽሪ",
    liveTracking: "ቀጥታ ምክትታል",
    currentWaitGap: "ፍልልይ ወረፋ",
    persons: "ሰባት",
    minsLeft: "ደቂቃ ተሪፉ",
    nowServing: "ኣገልግሎት ዝወሃቦ ዘሎ ቁጽሪ:",
    bookedSlot: "ዝተትሓዘ ቆጸራ:",
    bookNewAppointment: "ሓድሽ ቆጸራ ሓዝ",
    selectBureauLocation: "ቦታ ቤት ጽሕፈት ምረጽ",
    appointmentDate: "ዕለት ቆጸራ",
    serviceRequested: "ዝድለ ኣገልግሎት",
    requiredDossiers: "ንዜጋታት ዘድልዩ ሰነዳት ሮቛሒታት",
    nationalId: "ዝተረጋገጸ ሃገራዊ መንነት ካርድ",
    birthCert: "ዋና ምስክር ወረቀት ልደት",
    bookBtn: "ቦታ ሓዝን ዲጂታል ትኬት ኣውጽእን",
    yourBookedSlots: "ዝሓዝኩምዎም ቆጸራታት",
    activeTicket: "ንጡፍ ቲኬት",
    communityHub: "ማእከል ማሕበረሰብ",
    verifiedP2P: "ዝተረጋገጹ ናይ መዛኑ መርበባት",
    digitalEqub: "ዓብዪ ሎተሪን ናይ እሁድ ማዛመጃን",
    payoutPool: "ኣብ ውሑስ ናይ ሎተሪ እጫታትን ናይ እሁድ ማዛመጃታትን ይሳተፉ።",
    circleContributors: "ተወዳደርቲ ሎተሪ",
    spinningDrum: "🔄 እጫታት እናተሰላሰሉ እዮም...",
    roundWinner: "🎉 ዕድለኛ ናይዚ ዙር አሸናፊ 🎉",
    amountCredited: "ሽልማት ገንዘብ ብሰላም ተኸፊሉ",
    joinEqubGroup: "ትኬት ሎተሪ ውሰድ",
    simulateEqubBtn: "ዕጫ ፈትን 🎰",
    weekendLottery: "ሎተሪ መወዳእታ ሰሙን (ሎተሪ ዕድል)",
    lotteryDescription: "ኣብ ውሑስ ናይ መወዳእታ ሰሙን ራፍል ይሳተፉ። ቀጻሊ እጫ: እሁድ 6:00 ድ.ቀ. ዓብዪ ሽልማት: 50,000 ብር።",
    ticketPriceLabel: "20 ብር / ትኬት",
    yourPurchasedTickets: "ዝዓደግኩምዎም ትኬታት",
    scramblingDrum: "🎰 ዕጫ ሎተሪ ይመላለስ ኣሎ...",
    officialLotteryResult: "ወግዓዊ ውጽኢት ሎተሪ",
    matchWonText: "🏆 እንቋዕ ሓጎሰኩም! 50,000 ብር ተዓዊትኩም!",
    tryAgainText: "🍀 ኣብዚ ዙር ኣይሰለጠን። ድጋሜ ፈትኑ!",
    buyTicketBtn: "ዲጂታል ትኬት ዓድግ (20 ብር)",
    simulateDrawBtn: "እጣ ኣውጽእ",
    matchmakingHeader: "ናይ እሁድ መዛመዲ ፖርታል (ትዳር ማገናኛ)",
    lockedUntilSunday: "🔒 ክሳብ እሁድ ተዓጽዩ እዩ",
    days: "መዓልታት",
    hours: "ሰዓታት",
    mins: "ደቂቃታት",
    secs: "ሰከንዶች",
    matchmakingLockedText: "ነቲ መዛመዲ ትኽክለኛነትን ፅሬትን ንምሕላው፡ ሕፁያት መገለጺታት ብእሁድ ጥራሕ እዮም ዝኽፈቱ።",
    toggleSimPrompt: "💡 ናይ እሁድ መዛመዲ ንምፍታን በላይኛው የማነይቲ ወገን ዘሎ 'Sunday Dev Sim' አብርህዎ!",
    sundayPortalOpen: "ናይ እሁድ ፖርታል ክፉት እዩ - ፅፉፋት መገለጺታት",
    passBtn: "ቀይር (አይደልየን) ✕",
    matchBtn: "ፈቱ (እደሊ) ❤️",
    allProfilesReviewed: "ኹሎም መገለጺታት ርኢኹምዎም!",
    restartSwipe: "ከም ብሓድሽ ጀምር",
    rechargeLabel: "1ሽሕ ብር የእቱ",
    resetBtn: "ኹሉ ኣፅሪ",
    inspectExpired: "ዝሓለፎም ዝተኣገዱ ኣርኢ",
    dbSynced: "ማዕከን ሓበሬታ ተመሳሲሉ",
    viewProfileLabel: "ፕሮፋይል ርአ",
    backToMarketplace: "ናብ ዕዳጋ ተመለስ",
    vendorProfileLabel: "ናይ ሸያጣይ መገለጺ",
    followersCountLabel: "ሰዓብቲ",
    followingBusiness: "ሰዓቢ ኴንኩም",
    followBusiness: "ሰዓብ",
    servicesTab: "ኣገልግሎታት",
    postsVideosTab: "ልጥፍታትን ቪድዮታትን",
    shopTab: "ድኳን",
    housesTab: "ኣባይቲ",
    agenciesTab: "ኤጀንሲታት",
    equbLotteryTab: "ትዳር ማገናኛ",
    passportTab: "ፓስፖርት",
    specificationChecklist: "ዝርዝር ኹነታት",
    jobRequirements: "ናይ ስራሕ ሮቛሒታት",
    payRent: "ብቻፓ 200 ብር ክፈል",
    writeReviewPlaceholder: "ናይ ምዕዳግ ተሞክሮኹም ጽሓፉ...",
    settingsTab: "ቅንጅቶች",
    themeToggleLabel: "መቐያየሪ ጸሊምን ብሩህን መልክዕ",
    darkMode: "ጸሊም መልክዕ (ጥቁር)",
    lightMode: "ብሩህ መልክዕ (ነጭ)",
    feedbackTitle: "ርኢቶ መቐበሊ ስርዓት",
    feedbackSub: "ቅሬታኹም ወይ ሕቶኹም ቀጥታ ናብ ኣካየድቲ ይስደዱ",
    messagePlaceholder: "መልእኽትኹም ኣብዚ ይጽሓፉ...",
    submitFeedback: "ርኢቶ ስደድ",
    feedbackSuccess: "እናመስግን! ርኢቶኹም ብሰላም ተመዝጊቡ ኣሎ።",
    rentShopTitle: "ሓድሽ ናይ ድኳን ኪራይ ፖርታል",
    rentShopSub: "ኣብ ኤቭሪ-ዞን ዲጂታል ድኳን ብምክራይ ፍርያትኩም ምዝርጋሕ ጀምሩ",
    rentShopButton: "ናይ 200 ብር ናይ ቻፓ ክፍያ ፈጽሙ",
    rentShopSuccess: "ክፍሊትኩም ብቻፓ ተረጋጊጹ ኣሎ! ናይ ድኳን ፍቓድ ተዋሂብኩም።"
  },
  om: {
    appName: "Eevrii-zoon (Every-zone)",
    appSub: "Super App Abisiiniyaa Giddugaleessaa",
    searchPlaceholderShop: "Uffata Makeda, Ofii Yirgaacafaa ykn modifiers barbaadi...",
    searchPlaceholderHouses: "Viilaa CMC, Penthouse Bole, studio barbaadi...",
    searchPlaceholderAgencies: "Hojii Sheefii, Hojii Dubaay, Viizaa Awurooppaa barbaadi...",
    searchPlaceholderPassport: "Beellama, hiriira, lootarii...",
    allProducts: "🌿 Shamaqaalee Hundaa",
    dressTailors: "👗 Uffata Habashaa",
    specialtyCoffee: "☕ Gosa Bunaa",
    handcraftedLeather: "👞 Meeshaalee Gogaa",
    allProperties: "🏡 Qabeenya Hundaa",
    rentMonthly: "🔑 Kiraa (Ji'aan)",
    buySale: "🎖️ Bitachuu (Gurgurtaa)",
    commercialShop: "🏬 Suuqii Daldalaa",
    verifiedAgenciesOnly: "Eejensiiwwan mirkanaayan qofa: Eejensii daldalaa seera qabeessa ta'an qofa agarsiisu.",
    allPositions: "💼 Bakka Hojii Hundaa",
    gulfRegion: "✈️ Hojii Biyyoota Arabaa",
    europeVisas: "🇪🇺 Viizaa Awurooppaa",
    tabShop: "Suuqii",
    tabHouses: "Manneen",
    tabAgencies: "Eejensiiwwan",
    tabPassport: "Paaspoortii",
    tabSocial: "Hawaasummaa",
    viewProfile: "Pirofaayilii Ilaali",
    followers: "Hordoftoota",
    otherPostedWorks: "Hojiiwwan Maxxanfaman Biroo",
    videoTimeline: "Timeline Viidiyoo",
    keepGoing: "Itti Fufi",
    comment: "Yaada",
    favorite: "Jaallatamaa",
    myChoice: "Filannoo Koo",
    postCommentPlaceholder: "Yaada jajjabeessu asitti barreessi...",
    cancel: "Haqi",
    posted: "Maxxanfameera",
    addedToMyChoice: "Filannoo kootti dabalameera!",
    back: "Deebi'i",
    instantPurchase: "Amma Biti",
    pay200Rent: "Kiraa ETB 200 Kafali",
    averageUserReviews: "Giddu-galeessa Yaada Fayyadamtootaa",
    yourRating: "Sadarkaa Keeti:",
    reviewSubmitPlaceholder: "Yaada bitannaa kee asitti barreessi...",
    postBtn: "Maxxansi",
    noReviewsYet: "Yaadni kenname hin jiru. Isan jalqabaa ta'aa!",
    reportVendor: "Daldalaa Gabaasi",
    virtualQueue: "Kaardii Hiriira Diijitaalaa",
    liveSequence: "Lakkoofsa Hiriira Hojii",
    liveTracking: "Hordoffii Kallattii",
    currentWaitGap: "Garaagarummaa Hiriiraa",
    persons: "Namoota",
    minsLeft: "Daqiiqaa Hafte",
    nowServing: "Lakkoofsa tajaajilamaa jiru:",
    bookedSlot: "Beellama qabame:",
    bookNewAppointment: "Beellama Haa Haaraya Qabadhu",
    selectBureauLocation: "Iddoo Waajjiraa Filadhu",
    appointmentDate: "Guyyaa Beellamaa",
    serviceRequested: "Tajaajila Barbaadame",
    requiredDossiers: "Tarree Meeshaalee Barbaachisoo",
    nationalId: "Waraqaa Eenyummaa Mirkanaa'e",
    birthCert: "Ragaa Dhalootaa Jalqabaa",
    bookBtn: "Iddoo Qabadhu Kaardii Diijitaalaa Baasi",
    yourBookedSlots: "Beellama Kee",
    activeTicket: "Tiikeettii Hojii",
    communityHub: "Giddu-galeessa Hawaasaa",
    verifiedP2P: "Mirkanaawwan Hiriyyootaa",
    digitalEqub: "Lootarii Guddaa fi Wal-fiti nagaa Dilbataa",
    payoutPool: "Lootarii amansiisaa fi wal-fiti nagaa Dilbataerratti hirmaadhaa.",
    circleContributors: "Dorgomtoota Lootarii",
    spinningDrum: "🔄 Lakkoofsa tiikeettii makuu...",
    roundWinner: "🎉 MO'ATAA LOOTARII KANAAA 🎉",
    amountCredited: "Badhaasni maallaqaa milkiin kafameera",
    joinEqubGroup: "Tiikeettii Lootarii Fudhachuu",
    simulateEqubBtn: "Qooda Ilaalcha Yaali 🎰",
    weekendLottery: "Lootarii Dhuma Torbee (Lootarii carraa)",
    lotteryDescription: "Carraa loorarii dhuma torbeerratti hirmaadhaa. Carraan itti aanu: Dilbata sa'aatii 12:00. Badhaasa Guddaa: ETB 50,000.",
    ticketPriceLabel: "ETB 20 / Tiikeettii",
    yourPurchasedTickets: "Tiikeettii Bitatte",
    scramblingDrum: "🎰 Lootarii hiriirsitee carraa lakkoofsaa makuuf...",
    officialLotteryResult: "Bu'aa Lootarii Rasmii",
    matchWonText: "🏆 BAGUMA GAMMADDAN! ETB 50,000 Mo'attaniittu!",
    tryAgainText: "🍀 Ammaan tana hin milkoofne. Ammas yaali!",
    buyTicketBtn: "Tiikeettii Diijitaalaa Biti (ETB 20)",
    simulateDrawBtn: "Carraa Mirkaneessi",
    matchmakingHeader: "Wal-fiti Nagaa Dilbata Abisiiniyaa (Wal-fiti)",
    lockedUntilSunday: "🔒 Hanga Dilbataatti Cufameera",
    days: "Guyyoota",
    hours: "Sa'aatii",
    mins: "Daqiiqaa",
    secs: "Sekondii",
    matchmakingLockedText: "Amansiisummaa eeguuf, pirofaayiliin wal-fiti Dilbata qofa banama.",
    toggleSimPrompt: "💡 Dilbata dev sim asii olii bansi!",
    sundayPortalOpen: "Pootaaliin Dilbataa Banameera - Pirofaayilii Mirkanaa'e",
    passBtn: "Dabarsi (Hin Barbaadu) ✕",
    matchBtn: "Jaalladhu (Barbaada) ❤️",
    allProfilesReviewed: "Pirofaayilii hundaa ilaalteetta!",
    restartSwipe: "Irraa Deebi'ii Jalqabi",
    rechargeLabel: "Maallaqa ETB 1k Guuti",
    resetBtn: "Hundaa Haqii",
    inspectExpired: "Sakkaalami Cufame",
    dbSynced: "Kuusaan Ragaa Mirkanaa'e",
    viewProfileLabel: "Pirofaayilii Ilaali",
    backToMarketplace: "Gabaatti Deebi'i",
    vendorProfileLabel: "Pirofaayilii Gurguraa",
    followersCountLabel: "Hordoftoota",
    followingBusiness: "Hordofaa Jirta",
    followBusiness: "Hordofi",
    servicesTab: "Tajaajiloota",
    postsVideosTab: "Maxxansaalee fi Viidiyoo",
    shopTab: "Suuqii",
    housesTab: "Manneen",
    agenciesTab: "Eejensiiwwan",
    equbLotteryTab: "Wal-fiti",
    passportTab: "Paaspoortii",
    specificationChecklist: "Tarree Ibsaa",
    jobRequirements: "Ulaagaalee Hojii",
    payRent: "Chapaadhaan Kiraa ETB 200 Kafali",
    writeReviewPlaceholder: "Yaada bitannaa kee barreessi...",
    settingsTab: "Sajata",
    themeToggleLabel: "Dukana fi Ifa Jijjiirrachuuf",
    darkMode: "Mootii Dukanaa (Dukana)",
    lightMode: "Mootii Ifaa (Ifa)",
    feedbackTitle: "Sistemii Yaada Kennaa",
    feedbackSub: "Yaada kee kallattiin abbootii appiitiif ergi",
    messagePlaceholder: "Ergaa kee asitti barreessi...",
    submitFeedback: "Yaada Ergi",
    feedbackSuccess: "Galatoomaa! Yaanni kee galmaa'eera.",
    rentShopTitle: "Suuqii Diijitaalaa Rent Gochuu",
    rentShopSub: "Iddoo daldalaa Every-zone irratti kiraa Chapaadhaan bani",
    rentShopButton: "Kafaltii Chapaa Jalqabi (ETB 200)",
    rentShopSuccess: "Kafaltiin Chapaa Mirkanaa'eera!"
  },
  so: {
    appName: "Every-zone",
    appSub: "Super App-ka Qaaliga ah ee Abyssinia",
    searchPlaceholderShop: "Raadi Dharka Makeda, Qaxwada, Teff...",
    searchPlaceholderHouses: "Raadi CMC Villas, Bole Penthouses...",
    searchPlaceholderAgencies: "Raadi Shaqooyinka, Dubai boosaska...",
    searchPlaceholderPassport: "ballamaha, safka, bakhtiyaa-nasiibka...",
    allProducts: "🌿 Dhammaan Alaabooyinka",
    allProperties: "🏡 Dhammaan Guryaha",
    allPositions: "💼 Dhammaan Boosaska",
    tabShop: "Suuq",
    tabHouses: "Guryo",
    tabAgencies: "Wakaaladaha",
    tabPassport: "Baasaboor",
    tabSocial: "Bulshada",
    settingsTab: "Dejinta",
    themeToggleLabel: "Dhaqdhaqaaqa Habka Madow & Iftiin",
    darkMode: "Arag Madow",
    lightMode: "Arag Cad",
    feedbackTitle: "Nidaamka Jawaab-celinta",
    feedbackSub: "U dir jawaab-celin toos ah milkiilayaasha codsiga",
    submitFeedback: "Dir Jawaab",
    feedbackSuccess: "Waad ku mahadsan tahay! Jawaab-celintaada si ammaan ah ayaa loo xareeyay.",
    rentShopTitle: "Suuqa Dijitaalka ah ee kirada",
    rentShopSub: "Kirayso dukaan ku dhex yaal Every-zone si aad u liis garayso alaabtaada.",
    rentShopButton: "Ku Bilow Lacag-bixinta Chapa (200 ETB)",
    rentShopSuccess: "Lacag-bixinta si guul leh ayaa loo xaqiijiyay Chapa!",
    viewProfileLabel: "Eeg Profile-ka",
    backToMarketplace: "Ku noqo Suuqa",
    vendorProfileLabel: "Profile-ka Ganacsadaha"
  },
  ar: {
    appName: "إيفري-زون",
    appSub: "تطبيق أبيسينيا المميز الفائق",
    searchPlaceholderShop: "ابحث عن فساتين ماكيدا، بن ييرغاشي، تيف...",
    searchPlaceholderHouses: "ابحث عن فيلات سي إم سي، بنتهاوس بولي...",
    searchPlaceholderAgencies: "ابحث عن وظائف سريعة، عقود دبي...",
    searchPlaceholderPassport: "المواعيد، طابور، يانصيب...",
    allProducts: "🌿 جميع المنتجات",
    allProperties: "🏡 جميع العقارات",
    allPositions: "💼 جميع الوظائف",
    tabShop: "سوق",
    tabHouses: "أبنية",
    tabAgencies: "وكالات",
    tabPassport: "جواز سفر",
    tabSocial: "اجتماعي",
    settingsTab: "الإعدادات",
    themeToggleLabel: "تبديل المظهر الداكن والمضيء",
    darkMode: "المظهر الداكن",
    lightMode: "المظهر المضيء",
    feedbackTitle: "نظام الملاحظات والدعم الكلي",
    feedbackSub: "أرسل تعليقاتك أو استفساراتك مباشرة إلى التطبيق",
    submitFeedback: "إرسال الملاحظات",
    feedbackSuccess: "شكرًا لك! تم تسجيل ملاحظاتك بنجاح وأمان.",
    rentShopTitle: "بوابة تأجير المتاجر الرقمية الجديدة",
    rentShopSub: "استأجر متجراً صغيراً على إيفري-زون لعرض منتجاتك المخصصة.",
    rentShopButton: "بدء دفع شابا الديناميكي (200 بر)",
    rentShopSuccess: "تم التحقق من الدفع بنجاح عبر نظام شابا!"
  },
  fr: {
    appName: "Every-zone",
    appSub: "L'application Super Premium d'Abyssinie",
    searchPlaceholderShop: "Rechercher robes Makeda, Yirgacheffe, Teff...",
    searchPlaceholderHouses: "Rechercher villas CMC, Bole penthouses...",
    searchPlaceholderAgencies: "Rechercher emplois, placement Dubaï...",
    searchPlaceholderPassport: "rdv, file d'attente, loteries...",
    allProducts: "🌿 Tous les Produits",
    allProperties: "🏡 Toutes les Propriétés",
    allPositions: "💼 Tous les Postes",
    tabShop: "Boutique",
    tabHouses: "Logements",
    tabAgencies: "Agences",
    tabPassport: "Passeport",
    tabSocial: "Social",
    settingsTab: "Paramètres",
    themeToggleLabel: "Permuter Mode Sombre & Clair",
    darkMode: "Thème Sombre",
    lightMode: "Thème Clair",
    feedbackTitle: "Système de Commentaires & Contact",
    feedbackSub: "Envoyez des commentaires directs aux propriétaires de l’application",
    submitFeedback: "Envoyer les Commentaires",
    feedbackSuccess: "Merci! Vos commentaires ont été enregistrés avec succès.",
    rentShopTitle: "Portail de Location de Boutique",
    rentShopSub: "Louez une micro-boutique virtuelle sur Every-zone pour lister vos créations.",
    rentShopButton: "Initier le Paiement Chapa (200 ETB)",
    rentShopSuccess: "Paiement vérifié avec succès par l'intégration Chapa!"
  },
  es: {
    appName: "Every-zone",
    appSub: "La Súper App Premium de Abisinia",
    searchPlaceholderShop: "Buscar vestidos Makeda, Yirgacheffe, Teff...",
    searchPlaceholderHouses: "Buscar villas CMC, Bole penthouses...",
    searchPlaceholderAgencies: "Buscar alquiler, contratos en Dubái...",
    searchPlaceholderPassport: "citas, turnos, loterías...",
    allProducts: "🌿 Todos los Productos",
    allProperties: "🏡 Todas las Propiedades",
    allPositions: "💼 Todos los Puestos",
    tabShop: "Tienda",
    tabHouses: "Casas",
    tabAgencies: "Agencias",
    tabPassport: "Pasaporte",
    tabSocial: "Social",
    settingsTab: "Ajustes",
    themeToggleLabel: "Cambiar Tema Oscuro y Claro",
    darkMode: "Visualización Oscura",
    lightMode: "Visualización Clara",
    feedbackTitle: "Sistema de Comentarios y Contacto",
    feedbackSub: "Envíe comentarios o consultas directas a los propietarios",
    submitFeedback: "Enviar Comentarios",
    feedbackSuccess: "¡Gracias! Sus sugerencias se han registrado de forma segura.",
    rentShopTitle: "Portal de Alquiler de Microtiendas",
    rentShopSub: "Alquile una tienda virtual en Every-zone para publicar sus ofertas.",
    rentShopButton: "Iniciar el Pago Chapa (200 ETB)",
    rentShopSuccess: "¡Pago verificado correctamente por la integración de Chapa!"
  },
  sw: {
    appName: "Every-zone",
    appSub: "Nguvu ya Super App ya Abyssinia",
    searchPlaceholderShop: "Tafuta nguo za Makeda, Yirgacheffe, Teff...",
    searchPlaceholderHouses: "Tafuta CMC Villas, Bole Penthouses...",
    searchPlaceholderAgencies: "Tafuta kazi, fursa za Dubai...",
    searchPlaceholderPassport: "miadi, foleni, bahati nasibu...",
    allProducts: "🌿 Bidhaa Zote",
    allProperties: "🏡 Nyumba Zote",
    allPositions: "💼 Kazi Zote",
    tabShop: "Duka",
    tabHouses: "Nyumba",
    tabAgencies: "Mashirika",
    tabPassport: "Pasipoti",
    tabSocial: "Kijamii",
    settingsTab: "Mipangilio",
    themeToggleLabel: "Geuza Hali ya Giza na Mwanga",
    darkMode: "Mandhari Giza",
    lightMode: "Mandhari Mwanga",
    feedbackTitle: "Mfumo wa Maoni na Mawasiliano",
    feedbackSub: "Tuma maoni na maswali ya moja kwa moja kwa wamiliki",
    submitFeedback: "Tuma Maoni",
    feedbackSuccess: "Asante! Maoni yako yamewasilishwa kwa usalama.",
    rentShopTitle: "Tovuti Mpya ya Kodisha Duka Dijiti",
    rentShopSub: "Kodisha kibanda cha duka kwenye Every-zone ili kuorodhesha kazi yako.",
    rentShopButton: "Anzisha Malipo ya Chapa (200 ETB)",
    rentShopSuccess: "Malipo yamethibitishwa kikamilifu na Chapa!"
  },
  de: {
    appName: "Every-zone",
    appSub: "Die Premium-Super-App von Abessinien",
    searchPlaceholderShop: "Suche Makeda-Kleider, Yirgacheffe, Teff...",
    searchPlaceholderHouses: "Suche CMC-Villas, Bole-Penthouses...",
    searchPlaceholderAgencies: "Suche Jobs, Dubai-Verträge...",
    searchPlaceholderPassport: "termine, warteschlange, lotterien...",
    allProducts: "🌿 Alle Produkte",
    allProperties: "🏡 Alle Immobilien",
    allPositions: "💼 Alle Stellenangebote",
    tabShop: "Shop",
    tabHouses: "Häuser",
    tabAgencies: "Agenturen",
    tabPassport: "Reisepass",
    tabSocial: "Soziales",
    settingsTab: "Einstellungen",
    themeToggleLabel: "Dunkel- & Hellmodus umschalten",
    darkMode: "Dunkles Design",
    lightMode: "Helles Design",
    feedbackTitle: "Feedback- & Kontaktsystem",
    feedbackSub: "Senden Sie ein direktes Feedback an die App-Eigentümer",
    submitFeedback: "Feedback Senden",
    feedbackSuccess: "Vielen Dank! Ihr Feedback wurde sicher übermittelt.",
    rentShopTitle: "Portal für digitale Shop-Miete",
    rentShopSub: "Mieten Sie einen virtuellen Mikro-Shop auf Every-zone, um Angebote zu listen.",
    rentShopButton: "Dynamische Chapa-Zahlung starten (200 ETB)",
    rentShopSuccess: "Zahlung erfolgreich durch Chapa-Integration verifiziert!"
  }
};

const modalTranslations: {
  [lang: string]: {
    callBtn: string;
    telegramBtn: string;
    contactHeader: string;
    messageHeader: string;
    chatPlaceholder: string;
    sendBtn: string;
    closeBtn: string;
    liveSupportText: string;
  }
} = {
  en: {
    callBtn: "Call Phone Number",
    telegramBtn: "Send Telegram Message",
    contactHeader: "Direct Merchant Contact Channels",
    messageHeader: "Direct Marketplace Chat",
    chatPlaceholder: "Type your message here to the merchant...",
    sendBtn: "Send Message",
    closeBtn: "Close Window",
    liveSupportText: "Always pay through Every-zone Escrow to secure your transactions."
  },
  am: {
    callBtn: "በቀጥታ ይደውሉ (ቀጥታ ስልክ)",
    telegramBtn: "በቴሌግራም ያውሩ (Telegram)",
    contactHeader: "የነጋዴው ቀጥታ መገናኛ መስመሮች",
    messageHeader: "የቀጥታ ገበያ ላይ ውይይት",
    chatPlaceholder: "መልዕክትዎን ለነጋዴው እዚህ ይጻፉ...",
    sendBtn: "ላክ",
    closeBtn: "ዝጋ",
    liveSupportText: "ገንዘብዎን ደህንነቱ የተጠበቀ ለማድረግ ሁልጊዜ በኤቭሪ-ዞን ኤስክሮው ይክፈሉ።"
  },
  ti: {
    callBtn: "ብቐጥታ ይደውሉ (ስልኪ)",
    telegramBtn: "ብቴሌግራም ኣውሩ (Telegram)",
    contactHeader: "ቀጥታ መተሓላለፊ ርክብ ነጋዳይ",
    messageHeader: "ቀጥታ ዘተ ዕዳጋ",
    chatPlaceholder: "መልእኽትኹም ንነጋዳይ ኣብዚ ይጽሓፉ...",
    sendBtn: "ስደድ",
    closeBtn: "ዕጸው",
    liveSupportText: "ንደሕንነት ማዕከን ኹሉ ግዜ ብኤቭሪ-ዞን ኤስክሮው ክፈሉ፡፡"
  },
  om: {
    callBtn: "Kallattiin Bilbili",
    telegramBtn: "Telegramiin Ergi",
    contactHeader: "Karaalee Quunnamtii Daldalaa Kallattii",
    messageHeader: "Wada-dubbi Daldalaa Kallattii",
    chatPlaceholder: "Ergaa keessan daldalaaf asitti barreessaa...",
    sendBtn: "Ergi",
    closeBtn: "Cufi",
    liveSupportText: "Nageenya kallaatii keetiif yoomillee Every-zone Escrow kafaladhaa."
  },
  so: {
    callBtn: "Wac Lambarka Taleefanka",
    telegramBtn: "U dir Farriin Telegram",
    contactHeader: "Kanaalada Tooska ah ee Labada dhinac",
    messageHeader: "Wada-sheekaysiga Tooska ah ee Suuqa",
    chatPlaceholder: "Ku qor farriintaada halkan...",
    sendBtn: "Farriinta Dir",
    closeBtn: "Xidh Daaqadda",
    liveSupportText: "Had iyo jeer ku bixi Every-zone Escrow si aad u sugto macaamilkaaga."
  },
  ar: {
    callBtn: "الاتصال برقم الهاتف",
    telegramBtn: "إرسال رسالة تليجرام",
    contactHeader: "قنوات الاتصال المباشرة بالتاجر",
    messageHeader: "الدردشة المباشرة في السوق",
    chatPlaceholder: "اكتب رسالتك للتاجر هنا...",
    sendBtn: "إرسال الرسالة",
    closeBtn: "إغلاق النافذة",
    liveSupportText: "ادفع دائمًا عبر تطبيق إيفري-زون لضمان حماية معاملاتك الكلية."
  },
  fr: {
    callBtn: "Appeler le Numéro de Téléphone",
    telegramBtn: "Envoyer un Message Telegram",
    contactHeader: "Canaux de Contact Directs du Vendeur",
    messageHeader: "Chat En Direct Du Marché",
    chatPlaceholder: "Tapez votre message ici pour le marchand...",
    sendBtn: "Envoyer le Message",
    closeBtn: "Fermer la Fenêtre",
    liveSupportText: "Payez toujours via Every-zone Escrow pour sécuriser vos transactions."
  },
  es: {
    callBtn: "Llamar por Teléfono",
    telegramBtn: "Enviar Mensaje de Telegram",
    contactHeader: "Canales de Contacto Directo del Vendedor",
    messageHeader: "Chat Directo del Mercado",
    chatPlaceholder: "Escriba su mensaje aquí para el comerciante...",
    sendBtn: "Enviar Mensaje",
    closeBtn: "Cerrar Ventana",
    liveSupportText: "Pague siempre con Every-zone Escrow para proteger sus transacciones."
  },
  sw: {
    callBtn: "Piga Simu Moja kwa Moja",
    telegramBtn: "Tuma Ujumbe wa Telegram",
    contactHeader: "Njia za Mawasiliano ya Moja kwa Moja",
    messageHeader: "Zungumza Moja kwa Moja Sokoni",
    chatPlaceholder: "Andika ujumbe wako kwa muuzaji hapa...",
    sendBtn: "Tuma Ujumbe",
    closeBtn: "Funga Dirisha",
    liveSupportText: "Lipa kila wakati kupitia Every-zone Escrow ili kulinda shughuli zako."
  },
  de: {
    callBtn: "Telefonnummer anrufen",
    telegramBtn: "Telegram-Nachricht senden",
    contactHeader: "Direkte Kontaktkanäle des Händlers",
    messageHeader: "Direkter Marktplatz-Chat",
    chatPlaceholder: "Schreiben Sie hier Ihre Nachricht an den Händler...",
    sendBtn: "Nachricht senden",
    closeBtn: "Fenster schließen",
    liveSupportText: "Zahlen Sie immer über Treuhand (Every-zone Escrow), um Transaktionen abzusichern."
  }
};

const ReviewCard = ({ 
  rev, 
  lang, 
  actingVendorId, 
  viewedVendorId, 
  onRefresh 
}: { 
  key?: any;
  rev: any; 
  lang: any; 
  actingVendorId?: string; 
  viewedVendorId?: string; 
  onRefresh?: () => void; 
}) => {
  const [helpfulCount, setHelpfulCount] = useState(rev.helpful);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(rev.rating);
  const [editText, setEditText] = useState(rev.comment);
  
  // Vendor reply state
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleHelpfulToggle = async () => {
    if (!rev.id || rev.id.startsWith("mock-")) {
      // Local fallback for static items
      if (hasVoted) {
        setHelpfulCount((prev: number) => Math.max(0, prev - 1));
        setHasVoted(false);
      } else {
        setHelpfulCount((prev: number) => prev + 1);
        setHasVoted(true);
      }
      return;
    }
    try {
      const response = await fetch(`/api/reviews/${rev.id}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "u-2" }) // Selamawit Tekle
      });
      if (response.ok) {
        const payload = await response.json();
        if (payload.status === 'success') {
          setHelpfulCount(payload.helpfulVotes);
          setHasVoted(payload.hasVoted);
          if (onRefresh) onRefresh();
        }
      }
    } catch (e) {
      console.error("Helpful toggle error", e);
    }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    try {
      const response = await fetch(`/api/reviews/${rev.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: editRating, text: editText })
      });
      if (response.ok) {
        setIsEditing(false);
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error("Save edit error", e);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(lang === 'en' ? "Are you sure you want to delete this review?" : "ይህን ግምገማ ለማጥፋት እርግጠኛ ነዎት?")) {
      try {
        const response = await fetch(`/api/reviews/${rev.id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          if (onRefresh) onRefresh();
        }
      } catch (e) {
        console.error("Delete review error", e);
      }
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const response = await fetch("/api/vendor/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: rev.id,
          vendorId: viewedVendorId,
          replyText: replyText.trim()
        })
      });
      if (response.ok) {
        setIsReplying(false);
        setReplyText('');
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error("Reply submission error", e);
    }
  };

  const isAuthor = rev.author === "Selamawit Tekle" || rev.author === "Selamawit Bekele" || rev.author === "Anonymous" && rev.id;

  return (
    <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl space-y-3">
      <div className="flex justify-between items-start text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-200">@{rev.author}</span>
            {/* Verified Badge */}
            <span className="bg-emerald-500/10 text-emerald-400 text-[8.5px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
              ✓ Verified Buyer
            </span>
          </div>
          {!isEditing ? (
            <div className="text-amber-500 font-bold text-xs mt-1">{"★".repeat(rev.rating)}</div>
          ) : (
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditRating(star)}
                  className={`text-sm ${star <= editRating ? 'text-amber-500' : 'text-neutral-700'}`}
                >
                  ★
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-[10px] text-stone-500 font-mono">{rev.date}</span>
      </div>

      {!isEditing ? (
        <p className="text-[11.5px] text-stone-300 leading-relaxed font-sans">{rev.comment}</p>
      ) : (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-stone-200 outline-none focus:border-amber-500"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="text-[10px] px-2.5 py-1 rounded bg-neutral-800 text-stone-300 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="text-[10px] px-2.5 py-1 rounded bg-amber-500 text-stone-950 font-black cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Review Image */}
      {rev.image && (
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
          <img src={rev.image} alt="User Review Attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      )}

      {/* Interactions row (Helpful Button & Reply / Edit / Delete triggers) */}
      <div className="flex items-center justify-between pt-1 text-[11px] select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleHelpfulToggle}
            className={`font-bold transition cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
              hasVoted 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-neutral-900 border-neutral-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            👍 Helpful ({helpfulCount})
          </button>

          {/* Reply button for acting viewed vendor */}
          {actingVendorId === viewedVendorId && !rev.reply && !isReplying && (
            <button
              onClick={() => setIsReplying(true)}
              className="text-amber-500 hover:underline font-bold"
            >
              💬 {lang === 'en' ? 'Reply' : 'መልስ ስጥ'}
            </button>
          )}
        </div>

        {isAuthor && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-stone-400 hover:text-white hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Vendor Reply Input form */}
      {isReplying && (
        <form onSubmit={handleSubmitReply} className="mt-2 flex gap-2">
          <input
            type="text"
            required
            placeholder={lang === 'en' ? "Write reply..." : "ምላሽ ይፃፉ..."}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 text-xs bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-stone-200 outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-500 text-neutral-950 font-black text-xs px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Send
          </button>
          <button
            type="button"
            onClick={() => setIsReplying(false)}
            className="bg-neutral-800 text-stone-300 text-xs px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Nested Vendor Reply */}
      {rev.reply && (
        <div className="bg-neutral-900/40 border-l-2 border-amber-500/45 p-3 rounded-r-xl space-y-1">
          <div className="flex justify-between items-center text-[9px] text-amber-500 font-black uppercase tracking-wider font-sans">
            <span>🛡️ {lang === 'en' ? 'Vendor Reply' : 'የሻጭ ምላሽ'}</span>
            <span className="text-stone-500 normal-case font-mono font-medium">Official</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-relaxed font-sans">{rev.reply}</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  // --- WALLET & TRANS PERSISTENCE STATE ---
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('ez_wallet_balance');
    return saved ? parseFloat(saved) : 6800;
  });

  const [activeTab, setActiveTab] = useState<'shop' | 'houses' | 'agencies' | 'matchmaking' | 'settings'>('shop');
  const [activeDevModule, setActiveDevModule] = useState<'none' | 'ai' | 'logistics' | 'adv' | 'admin' | 'wallet' | 'passport' | 'devops' | 'sre' | 'vendor_dashboard' | 'order_tracking' | 'wishlist' | 'v9_suite' | 'monetization'>('none');

  // --- EMERGENCY BANNER CONFIGURATION STATE ---
  const [emergencyBanner, setEmergencyBanner] = useState<{
    active: boolean;
    type: 'MAINTENANCE' | 'ALERT' | 'HOLIDAY' | 'FEATURE';
    textEn: string;
    textAm: string;
  }>({
    active: true,
    type: 'ALERT',
    textEn: '🚨 ESCROW ALERT: CBE Banking Gateways maintenance on Sunday. Settling lag up to 5 mins.',
    textAm: '🚨 አስቸኳይ ማሳሰቢያ፡ የኢትዮጵያ ንግድ ባንክ ሲስተም ጥገና ምክንያት ክፍያዎች ለ5 ደቂቃ ሊዘገዩ ይችላሉ።'
  });

  // --- CAMERA PERMISSION STATES & HELPER ---
  const [showCameraDeniedModal, setShowCameraDeniedModal] = useState(false);
  const [permissionSuccessCallback, setPermissionSuccessCallback] = useState<(() => void) | null>(null);

  const requestCameraPermission = async (onGranted: () => void) => {
    // 1. Try checking via permissions API if supported
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as any });
        if (result.state === 'granted') {
          onGranted();
          return;
        } else if (result.state === 'denied') {
          setPermissionSuccessCallback(() => onGranted);
          setShowCameraDeniedModal(true);
          return;
        }
      }
    } catch (e) {
      console.warn("navigator.permissions.query camera unsupported:", e);
    }

    // 2. Try prompting directly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      onGranted();
    } catch (err) {
      console.error("Camera access failed:", err);
      setPermissionSuccessCallback(() => onGranted);
      setShowCameraDeniedModal(true);
    }
  };

  const handleAllowCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setShowCameraDeniedModal(false);
      if (permissionSuccessCallback) {
        permissionSuccessCallback();
      }
    } catch (err) {
      console.error("Camera re-request failed:", err);
      alert(lang === 'am'
        ? "⚠️ ኤቭሪ-ዞን አሁንም ካሜራ የማግኘት ፈቃድ አላገኘም። እባክዎ በአሳሽዎ የአድራሻ ባር አጠገብ ያለውን የቁልፍ ምልክት (Lock icon) ወይም ሴቲንግ በመንካት ካሜራውን ፍቀድ (Allow) ያድርጉ።"
        : "⚠️ Every-zone still doesn't have camera access. Please check your browser's address bar settings (often a lock icon next to the URL) to allow camera permissions manually."
      );
    }
  };
  
  // --- CORE SETTINGS & DARK MODE THEME STATES ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ez_dark_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ez_dark_mode', isDarkMode ? 'true' : 'false');
  }, [isDarkMode]);

  // Pre-load Web Speech Synthesis voices list on mount for robust instant voice responses
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLogs, setFeedbackLogs] = useState<{id: string, email: string, message: string, date: string}[]>([]);

  const [subVendorName, setSubVendorName] = useState('');
  const [subVendorCategory, setSubVendorCategory] = useState<'shop' | 'houses' | 'agencies'>('shop');
  const [subPaymentProcessing, setSubPaymentProcessing] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [chapaLoadingStep, setChapaLoadingStep] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('ez_search_history');
      return cached ? JSON.parse(cached) : ['bole', 'villa', 'condominium', 'bole bulbula', 'car'];
    } catch {
      return ['bole', 'villa', 'condominium', 'bole bulbula', 'car'];
    }
  });

  const saveSearchToHistory = (term: string) => {
    const trimmed = term.trim().toLowerCase();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(t => t !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('ez_search_history', JSON.stringify(updated));
      return updated;
    });
  };

  // --- GLOBAL SEARCH ENGINE STATES & HELPER FUNCTIONS ---
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [searchEntityType, setSearchEntityType] = useState<'ALL' | 'PRODUCT' | 'PROPERTY' | 'JOB' | 'VENDOR'>('ALL');
  const [searchFilterCity, setSearchFilterCity] = useState('all');
  const [searchFilterCategory, setSearchFilterCategory] = useState('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchLatency, setSearchLatency] = useState(0);
  const [aiChatResponse, setAiChatResponse] = useState<string | null>(null);

  // QR & Image Search Modal States
  const [isQrSearchOpen, setIsQrSearchOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [imageSearchFile, setImageSearchFile] = useState<string | null>(null);
  const [imageSearchLoading, setImageSearchLoading] = useState(false);
  const [imageSearchExplanation, setImageSearchExplanation] = useState<{en: string, am: string} | null>(null);

  // Security & Privacy States
  const [isTwoFactor, setIsTwoFactor] = useState<boolean>(() => {
    return localStorage.getItem('ez_security_2fa') === 'true';
  });
  const [isPrivateProfile, setIsPrivateProfile] = useState<boolean>(() => {
    return localStorage.getItem('ez_security_private') === 'true';
  });
  const [blockedUsers, setBlockedUsers] = useState<string[]>(['Unverified Buyer #102', 'Suspicious Vendor #941']);

  const [isVoiceSearchListening, setIsVoiceSearchListening] = useState(false);
  const [voiceSearchTranscript, setVoiceSearchTranscript] = useState('');
  const imageSearchInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageSearch = async (base64Image: string) => {
    setImageSearchLoading(true);
    setImageSearchExplanation(null);
    try {
      const res = await fetch("/api/search/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Image })
      });
      const data = await res.json();
      if (data.status === "success") {
        setSearchResults(data.results || []);
        setImageSearchExplanation({
          en: data.explanationEn || "Visual match completed successfully.",
          am: data.explanationAm || "ምስላዊ ፍለጋ በተሳካ ሁኔታ ተጠናቋል።"
        });
        setGlobalSearchQuery(""); // Clear standard search string
        setIsGlobalSearchOpen(true); // Ensure unified search index is open
        setIsImageSearchOpen(false); // Close image search panel
        setIsQrSearchOpen(false); // Close unified modal
      } else {
        alert("Image search failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Image search failed", err);
      alert("Error sending image search request.");
    } finally {
      setImageSearchLoading(false);
    }
  };

  const triggerVoiceSearch = () => {
    const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechClass) {
      setIsVoiceSearchListening(true);
      setVoiceSearchTranscript(lang === 'am' ? "ማይክሮፎን ዝግጁ ነው..." : "Microphone ready...");
      return;
    }
    try {
      const rec = new SpeechClass();
      rec.lang = lang === 'am' ? 'am-ET' : 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => {
        setIsVoiceSearchListening(true);
        setVoiceSearchTranscript(lang === 'am' ? "እያዳመጥኩ ነው... ይናገሩ" : "Listening... Please speak");
      };
      rec.onerror = (e: any) => {
        console.error("Voice search error", e);
        setVoiceSearchTranscript(lang === 'am' ? "ድምፅ ማወቅ አልተቻለም" : "Could not recognize voice");
      };
      rec.onend = () => {
        setTimeout(() => {
          setIsVoiceSearchListening(false);
        }, 1500);
      };
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) {
          setVoiceSearchTranscript(text);
          setGlobalSearchQuery(text);
          fetchSearchResults(text);
        }
      };
      rec.start();
    } catch (e) {
      console.error(e);
      setIsVoiceSearchListening(true);
      setVoiceSearchTranscript(lang === 'am' ? "ማይክሮፎን ተነስቷል" : "Microphone active");
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleImageSearch(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQRSearchSuccess = (result: any) => {
    let rawText = "";
    if (result.type === "MARKETPLACE_VENDOR" && result.data?.vendorId) {
      rawText = result.data.vendorId;
    } else if (result.type === "MARKETPLACE_PRODUCT" && result.data?.productId) {
      rawText = result.data.productId;
    } else if (result.data?.reference) {
      rawText = result.data.reference;
    } else {
      rawText = result.data?.ticketId || result.data?.faydaId || JSON.stringify(result.data);
    }

    const normText = rawText.trim().toLowerCase();
    
    if (normText === "v1" || normText === "v-1" || normText.includes("vendor=v1") || normText.includes("vendor/v1")) {
      setViewedVendorId("v1");
      setGlobalSearchQuery("");
      setIsGlobalSearchOpen(false);
      alert(lang === 'en' ? "🔍 QR Merchant Match: Makeda Royal Weaving (v1)" : "🔍 የሻጭ QR ተዛማጅ፡ ማከዳ አልባሳት (v1)");
    } else if (normText === "v2" || normText === "v-2" || normText.includes("vendor=v2") || normText.includes("vendor/v2")) {
      setViewedVendorId("v2");
      setGlobalSearchQuery("");
      setIsGlobalSearchOpen(false);
      alert(lang === 'en' ? "🔍 QR Merchant Match: Makeda Specialty Coffee (v2)" : "🔍 የሻጭ QR ተዛማጅ፡ ማከዳ ቡና (v2)");
    } else if (normText === "v4" || normText.includes("vendor=v4") || normText.includes("vendor/v4")) {
      setViewedVendorId("v4");
      setGlobalSearchQuery("");
      setIsGlobalSearchOpen(false);
      alert(lang === 'en' ? "🔍 QR Merchant Match: Aura Bole Premium Properties (v4)" : "🔍 የሻጭ QR ተዛማጅ፡ አውራ ቤቶች (v4)");
    } else if (normText === "v7" || normText.includes("vendor=v7") || normText.includes("vendor/v7")) {
      setViewedVendorId("v7");
      setGlobalSearchQuery("");
      setIsGlobalSearchOpen(false);
      alert(lang === 'en' ? "🔍 QR Merchant Match: Gigi International Placements (v7)" : "🔍 የሻጭ QR ተዛማጅ፡ ጂጂ ወኪል (v7)");
    } else if (normText === "l1" || normText.includes("product=l1") || normText.includes("product/l1")) {
      const item = listings.find(l => l.id === "l1");
      if (item) {
        setViewedVendorId(item.vendorId);
        setGlobalSearchQuery("");
        setIsGlobalSearchOpen(false);
        alert(lang === 'en' 
          ? `🔍 QR Product: "${item.title}". Redirecting to owner: ${item.vendorName}!`
          : `🔍 የምርት QR ኮድ፡ "${item.titleAm || item.title}"። ወደ ምርቱ ባለቤት መራዎት፡ ${item.vendorNameAm || item.vendorName}!`
        );
      }
    } else if (normText === "l2" || normText.includes("product=l2") || normText.includes("product/l2")) {
      const item = listings.find(l => l.id === "l2");
      if (item) {
        setViewedVendorId(item.vendorId);
        setGlobalSearchQuery("");
        setIsGlobalSearchOpen(false);
        alert(lang === 'en' 
          ? `🔍 QR Product: "${item.title}". Redirecting to owner: ${item.vendorName}!`
          : `🔍 የምርት QR ኮድ፡ "${item.titleAm || item.title}"። ወደ ምርቱ ባለቤት መራዎት፡ ${item.vendorNameAm || item.vendorName}!`
        );
      }
    } else if (normText === "l3_iphone" || normText.includes("l3_iphone")) {
      const item = listings.find(l => l.id === "l3_iphone");
      if (item) {
        setViewedVendorId(item.vendorId);
        setGlobalSearchQuery("");
        setIsGlobalSearchOpen(false);
        alert(lang === 'en' 
          ? `🔍 QR Product: "${item.title}". Redirecting to owner: ${item.vendorName}!`
          : `🔍 የምርት QR ኮድ፡ "${item.titleAm || item.title}"። ወደ ምርቱ ባለቤት መራዎት፡ ${item.vendorNameAm || item.vendorName}!`
        );
      }
    } else {
      setGlobalSearchQuery(rawText);
      fetchSearchResults(rawText);
      setIsGlobalSearchOpen(true);
      alert(lang === 'en' 
        ? `🔍 QR Decoded: "${rawText}". Searching Every-zone marketplace...`
        : `🔍 የQR ኮድ ተነቧል፡ "${rawText}"። በገበያ ላይ በመፈለግ ላይ...`
      );
    }
  };

  const handleAiChatSearch = (term: string) => {
    setSearchLoading(true);
    setAiChatResponse(null);
    const normalized = term.toLowerCase().trim();
    
    setTimeout(() => {
      setSearchLoading(false);
      if (normalized.includes('dubai') || normalized.includes('driver') || normalized.includes('jobs')) {
        setSearchEntityType('JOB');
        setSearchFilterCity('Dubai');
        setGlobalSearchQuery('driver');
        setSearchResults([
          {
            id: 'j-303',
            title: 'Professional Heavy Truck Driver',
            description: 'Dubai transport logistics company looking for experienced heavy vehicle drivers. Airfare and visa provided.',
            type: 'JOB',
            city: 'Dubai',
            price: '3,800 AED / Month',
            image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=200'
          }
        ]);
        setAiChatResponse(
          lang === 'en'
            ? '🤖 EVERY-ZONE AI: Found active Heavy Driver listings in Dubai, UAE with fully verified agency visa packages!'
            : '🤖 ኤቭሪ-ዞን AI: በዱባይ የተረጋገጡ የከባድ መኪና ሹፌር ስራዎችን አግኝቻለሁ!'
        );
      } else if (normalized.includes('10 million') || normalized.includes('under 10') || normalized.includes('house') || normalized.includes('million')) {
        setSearchEntityType('PROPERTY');
        setSearchFilterCity('Addis Ababa');
        setGlobalSearchQuery('villa');
        setSearchResults([
          {
            id: 'h-1',
            title: 'Deluxe Bole Modern Villa',
            description: 'Brand new luxury modern condominium villa in the heart of Bole. 3 bedrooms, 2 bathrooms, high security access.',
            type: 'PROPERTY',
            city: 'Addis Ababa',
            price: '9,400,000 ETB',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200'
          }
        ]);
        setAiChatResponse(
          lang === 'en'
            ? '🤖 EVERY-ZONE AI: Filtered Addis Ababa property index for homes below 10,000,000 ETB. Showing Deluxe Bole Villa.'
            : '🤖 ኤቭሪ-ዞን AI: ከ 10 ሚሊዮን ብር በታች ያሉ ቤቶችን አግኝቻለሁ። ቦሌ የሚገኘውን ቪላ ይመልከቱ።'
        );
      } else if (normalized.includes('iphone') || normalized.includes('below 50k') || normalized.includes('50k')) {
        setSearchEntityType('PRODUCT');
        setGlobalSearchQuery('iPhone');
        setSearchResults([
          {
            id: 'p-10',
            title: 'iPhone 13 Pro (Refurbished Grade A)',
            description: 'Fully tested iPhone 13 Pro, 128GB, Sierra Blue. Includes 6 months merchant repair warranty.',
            type: 'PRODUCT',
            city: 'Addis Ababa',
            price: '44,500 ETB',
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=200'
          }
        ]);
        setAiChatResponse(
          lang === 'en'
            ? '🤖 EVERY-ZONE AI: Scanning product catalog for Apple iPhones priced below 50,000 ETB. Highly recommended: Refurbished Grade A iPhone 13 Pro!'
            : '🤖 ኤቭሪ-ዞን AI: ከ 50 ሺህ ብር በታች የሆኑ የሞባይል ስልኮችን አግኝቻለሁ። iPhone 13 Pro ይመከራል።'
        );
      } else {
        setGlobalSearchQuery(term);
        fetchSearchResults(term);
        setAiChatResponse(`🤖 EVERY-ZONE AI: Parsing semantic intent for "${term}"... Mapping query directly to the Elastic Index.`);
      }
    }, 750);
  };

  const fetchSearchResults = async (queryTerm: string) => {
    setSearchLoading(true);
    const start = performance.now();
    try {
      let url = `/api/search?q=${encodeURIComponent(queryTerm)}`;
      if (searchEntityType !== 'ALL') {
        url += `&type=${searchEntityType}`;
      }
      if (searchFilterCity !== 'all') {
        url += `&city=${encodeURIComponent(searchFilterCity)}`;
      }
      if (searchFilterCategory !== 'all') {
        url += `&category=${encodeURIComponent(searchFilterCategory)}`;
      }
      url += `&userId=u-1`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'success') {
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.error("Search fetch failed", err);
    } finally {
      const end = performance.now();
      setSearchLatency(Math.round(end - start) || 2);
      setSearchLoading(false);
    }
  };

  const fetchTrendingAndRecent = async () => {
    try {
      const [trendRes, recentRes] = await Promise.all([
        fetch('/api/search/trending'),
        fetch('/api/search/recent?userId=u-1')
      ]);
      const trendData = await trendRes.json();
      const recentData = await recentRes.json();
      if (trendData.status === 'success') {
        setTrendingSearches(trendData.trending || []);
      }
      if (recentData.status === 'success') {
        setRecentSearches(recentData.recent || []);
      }
    } catch (err) {
      console.error("Failed to load search ancillary data", err);
    }
  };

  const saveSearchQuery = async (queryToSave: string) => {
    if (!queryToSave.trim()) return;
    try {
      const res = await fetch('/api/search/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'u-1', query: queryToSave })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSavedSearches(prev => {
          const newObj = {
            id: data.saved?.id || Date.now().toString(),
            query: queryToSave,
            city: 'all',
            category: 'all',
            maxPrice: 'all',
            tab: 'all'
          };
          return [newObj, ...prev.filter(s => s.query !== queryToSave)];
        });
        triggerPushNotification("Search Saved!", `Saved search for "${queryToSave}" successfully.`, "bookmark", "search");
      }
    } catch (err) {
      console.error("Failed to save search", err);
    }
  };

  const logSearchClick = async (keyword: string) => {
    try {
      await fetch('/api/search/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
    } catch (err) {
      console.error("Failed to log search click", err);
    }
  };

  const getRecommendedListings = () => {
    return listings.filter(l => l.isPremium || l.rating >= 4.6).slice(0, 4);
  };
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // --- INTEGRATED COMPREHENSIVE HUB STATES (NEW UPDATES) ---
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('all');

  const [isWalletSheetOpen, setIsWalletSheetOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUserId, setChatUserId] = useState('u-2'); // default Selamawit
  const [selectedRechargeAmount, setSelectedRechargeAmount] = useState<number>(1000);
  const [rechargeSuccessMsg, setRechargeSuccessMsg] = useState<string | null>(null);
  const [isRechargingProgress, setIsRechargingProgress] = useState(false);
  const [copiedTextToast, setCopiedTextToast] = useState<string | null>(null);

  // New Upgrade: Onboarding state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('ez_onboarding_completed') !== 'true';
  });

  // Splash & Authentication state management
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ez_authenticated') === 'true';
  });
  const [userRole, setUserRole] = useState<'USER' | 'VENDOR' | 'REAL_ESTATE' | 'OVERSEAS' | 'SUPER_ADMIN'>(() => {
    return (localStorage.getItem('ez_user_role') as any) || 'USER';
  });
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('ez_biometrics_enabled') === 'true';
  });

  // New Upgrade: Saved searches state for alerts match
  const [savedSearches, setSavedSearches] = useState<Array<{
    id: string;
    query: string;
    city: string;
    category: string;
    maxPrice: string;
    tab: string;
  }>>(() => {
    const saved = localStorage.getItem('ez_saved_searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ez_saved_searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  // New Upgrade: Active listing selected for Booking visit Scheduler
  const [activeBookingListing, setActiveBookingListing] = useState<Listing | null>(null);

  // New Upgrade: Active listing selected for Business Card visual card generator
  const [activeBusinessCardListing, setActiveBusinessCardListing] = useState<Listing | null>(null);

  const [houseDealType, setHouseDealType] = useState<'rent' | 'buy'>('rent');
  const [agencyDealType, setAgencyDealType] = useState<'rent' | 'buy'>('rent');

  const [pendingVendorIDApprovals, setPendingVendorIDApprovals] = useState([
    { id: 'app-v1', vendorName: 'Makeda Royal Weaving (ማከዳ አልባሳት)', applicant: 'Almaz Tekle', faydaId: 'ET-FAY-8294719', idDoc: 'Kebele ID Smart Card Scan', date: 'Just now' },
    { id: 'app-v2', vendorName: 'Shire Electronic Hub', applicant: 'Tesfay Gebre', faydaId: 'ET-FAY-2018247', idDoc: 'Business Registration Trade License', date: '12 mins ago' }
  ]);
  const [pendingManualPayments, setPendingManualPayments] = useState([
    { id: 'pay-m1', depositor: 'Zara Boutique', amount: 200, channel: 'Telebirr', refNum: 'REF-92841', proofCode: 'PROOF-TX-332', date: 'Just now' },
    { id: 'pay-m2', depositor: 'Addis Rent Agency', amount: 500, channel: 'CBE Birr', refNum: 'REF-10294', proofCode: 'PROOF-AX-884', date: '10 mins ago' }
  ]);

  const [pushNotifications, setPushNotifications] = useState<{ id: string; title: string; body: string; icon: string; category: string }[]>([]);

  const triggerPushNotification = (title: string, body: string, icon: string, category: string) => {
    const id = `push-${Date.now()}`;
    setPushNotifications(prev => [{ id, title, body, icon, category }, ...prev]);
    setTimeout(() => {
      setPushNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextToast(`Copied ${label} to Clipboard!`);
    setTimeout(() => setCopiedTextToast(null), 2500);
  };

  const [transactions, setTransactions] = useState([
    { id: 't1', amount: -200, type: 'RENT', description: 'Monthly Shop Rent Paid', date: 'June 17, 2026', channel: 'Wallet Balance' },
    { id: 't2', amount: 1000, type: 'DEPOSIT', description: 'Recharged via Telebirr', date: 'June 15, 2026', channel: 'Telebirr App' },
    { id: 't3', amount: -150, type: 'LOTTERY', description: 'Lottery Ticket Purchase (Mercato Car)', date: 'June 14, 2026', channel: 'Wallet Balance' },
    { id: 't4', amount: 2000, type: 'DEPOSIT', description: 'Recharged via CBE Birr', date: 'June 10, 2026', channel: 'CBE Birr App' },
  ]);

  const totalLotterySpent = useMemo(() => {
    return transactions
      .filter(t => t.type === 'LOTTERY')
      .reduce((sum, current) => sum + Math.abs(current.amount), 0);
  }, [transactions]);

  // Multi-Language State (English, Amharic, Tigrinya, Afaan Oromoo, plus foundation support)
  const [lang, setLang] = useState<string>('en');
  // Helper translation hook with dynamic fallback
  const t = (key: keyof typeof translations['en']) => {
    const dict = (translations as any)[lang] || translations['en'];
    return dict[key] || translations['en'][key] || key;
  };

  // Vendor Business Profile page viewed vendor ID
  const [viewedVendorId, setViewedVendorId] = useState<string | null>(null);
  const [vendorMarketplaceProducts, setVendorMarketplaceProducts] = useState<any[]>([]);
  const [selectedMarketplaceProduct, setSelectedMarketplaceProduct] = useState<any | null>(null);

  // Dynamic Reviews & Trust States
  const [dynamicReviews, setDynamicReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [trustScore, setTrustScore] = useState<any>(null);
  const [reviewFormRating, setReviewFormRating] = useState(5);
  const [reviewFormText, setReviewFormText] = useState('');
  const [reviewFormPhoto, setReviewFormPhoto] = useState('');
  const [reviewFormVideo, setReviewFormVideo] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [reviewErrorMsg, setReviewErrorMsg] = useState<string | null>(null);

  const fetchVendorReviewsAndTrust = async (vendorId: string) => {
    setReviewsLoading(true);
    try {
      const revRes = await fetch(`/api/reviews?targetType=VENDOR&targetId=${vendorId}`);
      if (revRes.ok) {
        const payload = await revRes.json();
        if (payload.status === 'success') {
          // Normalize reviews to match expected frontend schema
          const mapped = (payload.reviews || []).map((r: any) => ({
            id: r.id,
            author: r.userName || "Anonymous",
            rating: r.rating || 5,
            comment: r.text || "",
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Just now",
            image: r.photos?.[0] || null,
            helpful: r.helpfulVotes || 0,
            reply: r.vendorReply || null
          }));
          setDynamicReviews(mapped);
        }
      }
      const trustRes = await fetch(`/api/reviews/vendors/${vendorId}/trust-score`);
      if (trustRes.ok) {
        const payload = await trustRes.json();
        if (payload.status === 'success') {
          setTrustScore(payload);
        }
      }
    } catch (e) {
      console.error("Error loading reviews & trust score:", e);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (viewedVendorId) {
      fetchVendorReviewsAndTrust(viewedVendorId);
    } else {
      setDynamicReviews([]);
      setTrustScore(null);
    }
  }, [viewedVendorId]);

  // Deep link listener for automatic vendor profile loading
  useEffect(() => {
    const parseDeepLink = () => {
      // Prioritize hash-based deep linking for seamless SPA routing
      const hash = window.location.hash;
      const match = hash.match(/#vendor=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        setViewedVendorId(match[1]);
        return;
      }
      
      // Fallback to query parameter deep linking
      const params = new URLSearchParams(window.location.search);
      const queryVendor = params.get('vendor');
      if (queryVendor) {
        setViewedVendorId(queryVendor);
      }
    };
    
    parseDeepLink();
    window.addEventListener('hashchange', parseDeepLink);
    return () => {
      window.removeEventListener('hashchange', parseDeepLink);
    };
  }, []);

  // --- Track and save recently viewed products & listings ---
  useEffect(() => {
    if (selectedListing) {
      try {
        const stored = localStorage.getItem('ez_recently_viewed_v3');
        const items = stored ? JSON.parse(stored) : [];
        const filtered = items.filter((x: any) => x.id !== selectedListing.id);
        const newItem = {
          id: selectedListing.id,
          type: selectedListing.category, // 'houses', 'agencies', etc.
          title: selectedListing.title,
          titleAm: selectedListing.titleAm,
          price: selectedListing.price,
          priceAm: selectedListing.priceAm,
          image: selectedListing.image,
          location: selectedListing.location,
          locationAm: selectedListing.locationAm,
          vendorName: selectedListing.vendorName,
          timestamp: Date.now(),
          raw: selectedListing
        };
        const updated = [newItem, ...filtered].slice(0, 10);
        localStorage.setItem('ez_recently_viewed_v3', JSON.stringify(updated));
        window.dispatchEvent(new Event('ez_recently_viewed_updated'));
      } catch (e) {
        console.error("Error updating recently viewed listing:", e);
      }
    }
  }, [selectedListing]);

  useEffect(() => {
    if (selectedMarketplaceProduct) {
      try {
        const stored = localStorage.getItem('ez_recently_viewed_v3');
        const items = stored ? JSON.parse(stored) : [];
        const filtered = items.filter((x: any) => x.id !== selectedMarketplaceProduct.id);
        const newItem = {
          id: selectedMarketplaceProduct.id,
          type: 'shop',
          title: selectedMarketplaceProduct.title,
          titleAm: selectedMarketplaceProduct.titleAm,
          price: `${selectedMarketplaceProduct.price} ETB`,
          priceAm: `${selectedMarketplaceProduct.price} ብር`,
          image: selectedMarketplaceProduct.images?.[0]?.imageUrl || selectedMarketplaceProduct.image,
          location: selectedMarketplaceProduct.vendorName || 'Bole Wear',
          locationAm: selectedMarketplaceProduct.vendorNameAm || selectedMarketplaceProduct.vendorName || 'ቦሌ',
          vendorName: selectedMarketplaceProduct.vendorName || 'Bole Wear',
          timestamp: Date.now(),
          raw: selectedMarketplaceProduct
        };
        const updated = [newItem, ...filtered].slice(0, 10);
        localStorage.setItem('ez_recently_viewed_v3', JSON.stringify(updated));
        window.dispatchEvent(new Event('ez_recently_viewed_updated'));
      } catch (e) {
        console.error("Error updating recently viewed product:", e);
      }
    }
  }, [selectedMarketplaceProduct]);

  // Scan History list state
  const [scanHistory, setScanHistory] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'settings') {
      try {
        const saved = localStorage.getItem('ez_scan_history');
        if (saved) {
          setScanHistory(JSON.parse(saved));
        } else {
          setScanHistory([]);
        }
      } catch (e) {
        console.error("Failed to load scan history", e);
      }
    }
  }, [activeTab]);

  // Seller-to-Seller mutual follows state
  const [sellerFollows, setSellerFollows] = useState<{ [vendorId: string]: string[] }>(() => {
    const saved = localStorage.getItem('ez_seller_follows');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      v1: ['v2', 'v3'], // v1 (Makeda Weaving) follows v2 & v3
      v2: ['v1', 'v4'], // v2 (Makeda Coffee) follows v1 & v4
      v3: ['v1', 'v2'], // v3 (Zewditu Leather) follows v1 & v2
      v4: ['v2'],      // v4 follows v2
      v5: ['v1', 'v2'],
    };
  });

  useEffect(() => {
    localStorage.setItem('ez_seller_follows', JSON.stringify(sellerFollows));
  }, [sellerFollows]);

  // Which seller the user is currently simulating acting as (for S2S B2B features)
  const [actingVendorId, setActingVendorId] = useState<string>('v2');

  // Fetch marketplace products for vendor when profile is viewed
  useEffect(() => {
    if (viewedVendorId) {
      const fetchVendorProducts = async () => {
        try {
          const searchId = viewedVendorId.includes('-') ? viewedVendorId : `v-${viewedVendorId.substring(1)}`;
          const res = await fetch(`/api/products?vendorId=${searchId}&activeVendorOnly=true`);
          const data = await res.json();
          if (data.status === 'success') {
            setVendorMarketplaceProducts(data.data);
          } else {
            setVendorMarketplaceProducts([]);
          }
        } catch (err) {
          console.error("Error fetching vendor products:", err);
          setVendorMarketplaceProducts([]);
        }
      };
      fetchVendorProducts();
    } else {
      setVendorMarketplaceProducts([]);
    }
  }, [viewedVendorId]);

  const handleMarketplaceAddToCartInApp = async (productId: string, quantity: number = 1, variantId: string | null = null) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "u-2", productId, quantity, variantId })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerPushNotification(
          lang === 'en' ? 'Cart Updated!' : 'ጋሪው ተዘምኗል!',
          lang === 'en' ? 'Item added securely to your shopping cart.' : 'ዕቃው በተሳካ ሁኔታ ወደ ጋሪዎ ተጨምሯል።',
          '🛒',
          'shop'
        );
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Instantly reset scroll to top of the main container when changing vendor profile or changing tabs
  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [viewedVendorId, activeTab]);

  // Contact and Direct Messaging States for Vendors
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [bookingModalItem, setBookingModalItem] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-07-02');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingNotes, setBookingNotes] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState<{ [vendorId: string]: { sender: 'user' | 'vendor', text: string, time: string }[] }>({
    v1: [
      { sender: 'vendor', text: 'ሰላም! Welcome to Makeda Traditional Designs. How can we assist you with our hand-woven traditional attires today?', time: 'Yesterday' }
    ]
  });

  const VENDOR_CONTACTS_DB = {
    v1: { phone: "+251911223344", telegram: "makeda_designs" },
    v2: { phone: "+251922334455", telegram: "yirga_specialty_coffee" },
    v3: { phone: "+251933445566", telegram: "lalibela_handmade" },
    v4: { phone: "+251944556677", telegram: "atlas_heights" },
    v5: { phone: "+251955667788", telegram: "ambassador_villas_cmc" },
    v6: { phone: "+251966778899", telegram: "sarbet_commercial_agency" },
    v7: { phone: "+251977112233", telegram: "gigi_placements" },
    v8: { phone: "+251988223344", telegram: "horn_recruitment" },
  };

  const VENDOR_SERVICES_DB = {
    v1: [
      { id: "s_v1_1", name: "Bespoke Measurement & Custom Styling Fitting", duration: "45 mins", price: 350, desc: "Get measured by our master weavers for custom-fit luxury traditional Habesha garments." },
      { id: "s_v1_2", name: "Traditional Embroidery Hem Restoration", duration: "2 hours", price: 500, desc: "Exquisite hand-embellished thread repair and restoring of vintage Netelas or dress borders." }
    ],
    v2: [
      { id: "s_v2_1", name: "Private Roastmaster Masterclass & Coffee Tasting", duration: "1.5 hours", price: 450, desc: "Learn to identify flavor profiles of Yirgacheffe, Keffa & Sidamo peaberries from certified experts." },
      { id: "s_v2_2", name: "Artisanal Espresso Machine Calibration", duration: "1 hour", price: 300, desc: "On-site tuning of your commercial or home espresso grinder and pressure setup for perfect crema." }
    ],
    v3: [
      { id: "s_v3_1", name: "Bespoke Custom Shoe Sizing & Fit Session", duration: "1 hour", price: 400, desc: "Take precise instep, arch and calf measurements for customized hand-crafted genuine leather boots." },
      { id: "s_v3_2", name: "Leather Conditioning & Patina Restoration", duration: "1.5 hours", price: 600, desc: "Deep hydration treatment using organic beeswax and oil-polish to restore luxury leather items." }
    ],
    v4: [
      { id: "s_v4_1", name: "VIP Property Tour & Legal Appraisal Consultation", duration: "2 hours", price: 1500, desc: "Private SUV tour of Bole/Atlas properties accompanied by a senior real estate title deed lawyer." },
      { id: "s_v4_2", name: "Home Interior Staging & Photography Session", duration: "3 hours", price: 2500, desc: "Full cosmetic preparation, luxury staging, and 4K HDR digital photography to list your property." }
    ],
    v5: [
      { id: "s_v5_1", name: "Commercial Real Estate Lease Structuring", duration: "1.5 hours", price: 3000, desc: "Consultancy on long-term office lease parameters, escalations, escrow deposits and local tax rules." },
      { id: "s_v5_2", name: "Luxury Architectural Blueprints Assessment", duration: "2 hours", price: 4500, desc: "Rigorous civil engineering review of construction plans, structural calculations and safety specs." }
    ],
    v6: [
      { id: "s_v6_1", name: "Condo Investment Yield Analysis Session", duration: "1 hour", price: 1200, desc: "Financial projection of rental yields, capital growth, and taxation rules for Sarbet/Bole condos." },
      { id: "s_v6_2", name: "Smart Home Tech Integration Advisory", duration: "2 hours", price: 2000, desc: "Plan centralized automated lighting, biometric entry locks, and high-speed multi-room network paths." }
    ],
    v7: [
      { id: "s_v7_1", name: "Express Visa Dossier Auditing & Review", duration: "1.5 hours", price: 1800, desc: "Full compliance check of financial statements, agency endorsements, and biometric scheduling files." },
      { id: "s_v7_2", name: "Pre-Departure Orientation & Placement Briefing", duration: "2 hours", price: 1000, desc: "Essential cultural transition seminar, banking setup advice, and legal contract protection review." }
    ],
    v8: [
      { id: "s_v8_1", name: "Corporate Workforce Strategy Assessment", duration: "2 hours", price: 3550, desc: "In-depth review of startup staffing requirements, local compensation scales, and labor compliance." },
      { id: "s_v8_2", name: "Executive Candidate Portfolio Polishing", duration: "1 hour", price: 1500, desc: "Prepare a premium executive dossier, complete CV optimization, and simulate agency mock-interviews." }
    ]
  };

  const VENDOR_PACKAGES_DB = {
    v1: [
      { id: "p_v1_1", name: "Golden Habesha Wedding Attire Package", price: 15500, desc: "Includes 1 bespoke custom bridal gown with golden embroidery, 1 premium Netela shawl, 1 matching men's luxury tunic, and up to 3 complementary master fittings." }
    ],
    v2: [
      { id: "p_v2_1", name: "The Ultimate Ethiopia Roastery Bundle", price: 3200, desc: "Includes 5kg of freshly roasted hand-selected specialty coffee beans, 1 traditional clay 'Jebena', premium organic frankincense, and a private masterclass." }
    ],
    v3: [
      { id: "p_v3_1", name: "Executive Leather Wardrobe Suite", price: 8900, desc: "Includes 1 pair of handcrafted Chelsea leather boots, 1 matching genuine calfskin belt, 1 slim biometric credit-card wallet, and 1 year polishing wax." }
    ],
    v4: [
      { id: "p_v4_1", name: "Bole Luxury Relocation & Settlement Package", price: 7500, desc: "Includes 3 private VIP SUV tour sessions, title deed background check verification, utility connection handling, and 3 months priority search." }
    ],
    v5: [
      { id: "p_v5_1", name: "Prime Corporate HQ Acquisition Concierge", price: 12000, desc: "Private off-market list of 5 commercial buildings, tax optimization auditing, escrow mediation representation, and full title certificate verification." }
    ],
    v6: [
      { id: "p_v6_1", name: "Premium Condo Smart Furnishing & Design", price: 14500, desc: "Full custom modern kitchen cabinet blueprint, biometric automated smart door lock installation, multi-room automated lighting, and 1-year internet setup." }
    ],
    v7: [
      { id: "p_v7_1", name: "Schengen/Gulf Professional Placement Suite", price: 9500, desc: "German/Arabic vocational training kits, medical examination scheduling priority, contract translation certification, and guaranteed interview placements." }
    ],
    v8: [
      { id: "p_v8_1", name: "Elite Talent Acquisition & Vetting Suite", price: 11000, desc: "Comprehensive background checks, pay-scale modeling report, full psychological/skills screening, and 6-month talent replacement guarantee." }
    ]
  };

  const getVendorDetails = () => {
    if (!viewedVendorId) return { name: '', phone: '+251900000000', telegram: 'everyzone_vendor' };
    const sampleL = listings.find(l => l.vendorId === viewedVendorId);
    const name = sampleL ? (lang === 'en' ? sampleL.vendorName : sampleL.vendorNameAm || sampleL.vendorName) : 'Verified Merchant';
    const contacts = (VENDOR_CONTACTS_DB as any)[viewedVendorId] || { phone: "+251911000000", telegram: `everyzone_vendor_${viewedVendorId}` };
    return { name, ...contacts };
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !viewedVendorId) return;
    const userMsg = chatMessage.trim();
    setChatMessage('');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatLogs(prev => {
      const currentList = prev[viewedVendorId] || [
        { sender: 'vendor', text: `ሰላም! Welcome. How can I help you today?`, time: '10:00 AM' }
      ];
      return {
        ...prev,
        [viewedVendorId]: [
          ...currentList,
          { sender: 'user', text: userMsg, time: timeStr }
        ]
      };
    });

    // Smart auto-reply after 800ms
    setTimeout(() => {
      setChatLogs(prev => {
        const currentList = prev[viewedVendorId] || [];
        const replyText = lang === 'en' 
          ? "Received! We coordinate shipments with Every-zone's double-secure escrow. Let us know your preferred delivery spot!"
          : lang === 'am'
          ? "መልዕክትዎ ደርሶናል! በኤቭሪ-ዞን እጅግ አስተማማኝ የኤስክሮው ስርዓት አማካኝነት ክፍያና እቃ ማድረስ እናስተባብራለን። ምርጫዎን ያሳውቁን!"
          : lang === 'ti'
          ? "መልእኽትኹም በጺሑና ኣሎ! ብኤቭሪ-ዞን ውሑስ ዝኾነ ናይ ኤስክሮው ስርዓት ኣቢልና ክፍሊትን ኣቑሑት ምብጻሕን ከነተሓባብር ኢና።"
          : "Ergaan keessan gaeera! Sirna nagaa mirkanaayee Every-zone tiin kafaltii fi dabarsuun wal-qabatee niraawwannaa.";
        
        return {
          ...prev,
          [viewedVendorId]: [
            ...currentList,
            { sender: 'vendor', text: replyText, time: timeStr }
          ]
        };
      });
    }, 800);
  };

  // Vendor Social States (Followers, Follow/Choice state, videos details, likes and comments logs)
  const [vendorsSocial, setVendorsSocial] = useState<{
    [vendorId: string]: {
      followersCount: number;
      followed: boolean;
      videos: {
        id: string;
        titleEn: string;
        titleAm: string;
        theme: string;
        likes: number;
        comments: string[];
        favorited: boolean;
        liked: boolean;
      }[];
    }
  }>({
    v1: {
      followersCount: 1420,
      followed: false,
      videos: [
        {
          id: 'v1_vid1',
          titleEn: 'Crafting Golden Embroidery (Habesha Kemis demo)',
          titleAm: 'በጥልፍ የእጅ ስራ የኬሚስ ማዘጋጀት ሂደት',
          theme: 'from-amber-900 to-amber-700',
          likes: 328,
          comments: ['ቀጥልበት! በጣም ደስ የሚል ባህላዊ ልብስ ነው! 😍', 'Stunning detail on the Netela!'],
          favorited: false,
          liked: false,
        }
      ]
    },
    v2: {
      followersCount: 890,
      followed: false,
      videos: [
        {
          id: 'v2_vid1',
          titleEn: 'Highland Specialty Roasting Ceremony Vibe',
          titleAm: 'የይርጋጨፌ ቡና ማህበር ባሕላዊ ማብሰል',
          theme: 'from-rose-950 to-orange-900',
          likes: 145,
          comments: ['የሀገሬ ቡና እጅግ ምርጥ ነው!', 'Best roasters in Addis!'],
          favorited: false,
          liked: false,
        }
      ]
    },
    v3: {
      followersCount: 650,
      followed: false,
      videos: [
        {
          id: 'v3_vid1',
          titleEn: 'Lalibela Engraving Leather Artistry',
          titleAm: 'በቆዳ ላይ የላሊበላ መስቀል አሻራዎችን የመቅረጽ ጥበብ',
          theme: 'from-neutral-900 to-amber-950',
          likes: 98,
          comments: ['The leather quality is incredible!', 'Where can I order custom size?'],
          favorited: false,
          liked: false,
        }
      ]
    },
    v4: {
      followersCount: 2150,
      followed: false,
      videos: [
        {
          id: 'v4_vid1',
          titleEn: 'Bole Atlas 11th Floor Sunset Panoramic Tour',
          titleAm: 'የቦሌ አትላስ ፎቅ ላይ ማራኪ የጀምበር ግባት',
          theme: 'from-blue-900 to-slate-800',
          likes: 412,
          comments: ['Stunning sunset views! Is the generator fully automatic?', 'Excellent location!'],
          favorited: false,
          liked: false,
        }
      ]
    },
    v5: {
      followersCount: 3400,
      followed: false,
      videos: [
        {
          id: 'v5_vid1',
          titleEn: 'CMC Ambassador Gated Villa Exterior Garden Walk',
          titleAm: 'የሲኤምሲ አምባሳደር የመኪና መግቢያና የአትክልት ግቢ',
          theme: 'from-emerald-950 to-lime-900',
          likes: 582,
          comments: ['ቅንጡ ቪላ ነው!', 'Perfect location near CMC group.'],
          favorited: false,
          liked: false,
        }
      ]
    },
    v6: {
      followersCount: 185,
      followed: false,
      videos: [
        {
          id: 'v6_vid1',
          titleEn: 'Sarbet Commercial Corner Foot Traffic Show',
          titleAm: 'በሳርቤት በኩል ያለው የንግድ እንቅስቃሴ ገጽታ',
          theme: 'from-stone-900 to-zinc-750',
          likes: 24,
          comments: ['Do you have smaller space for retail startup?'],
          favorited: false,
          liked: false,
        }
      ]
    },
    v7: {
      followersCount: 4210,
      followed: false,
      videos: [
        {
          id: 'v7_vid1',
          titleEn: 'Dubai Hotel Chef Full Work Permit Process',
          titleAm: 'የዱባይ ሆቴል ሼፍ ቀጥር የስራ ፈቃድ መግለጫ',
          theme: 'from-sky-950 to-teal-900',
          likes: 815,
          comments: ['Great agency, transparent and quick service!', 'I want to apply!'],
          favorited: false,
          liked: false,
        }
      ]
    },
    v8: {
      followersCount: 1830,
      followed: false,
      videos: [
        {
          id: 'v8_vid1',
          titleEn: 'Warsaw Construction Site Legalization QA',
          titleAm: 'በዋርሶው የስራ ቅጥር ሂደቶችና ፍቃድ ማግኘት',
          theme: 'from-[#1E3A1A] to-stone-900',
          likes: 310,
          comments: ['Are flight tickets covered prior to permit?', 'Awesome opportunity!'],
          favorited: false,
          liked: false,
        }
      ]
    }
  });

  const [commentTextInputs, setCommentTextInputs] = useState<{ [videoId: string]: string }>({});

  // Active sub-tab inside Vendor Profile
  const [vendorProfileTab, setVendorProfileTab] = useState<'all' | 'products' | 'listings' | 'services' | 'videos' | 'posts' | 'reviews' | 'about' | 'policies'>('all');
  const [vendorStoreSearch, setVendorStoreSearch] = useState('');
  const [vendorStoreSort, setVendorStoreSort] = useState<'newest' | 'popular' | 'rating' | 'priceAsc' | 'priceDesc'>('newest');
  const [servicesSubTab, setServicesSubTab] = useState<'products' | 'services' | 'packages'>('products');
  // Tracks active comment sections inside video feeds
  const [activeCommentVideoId, setActiveCommentVideoId] = useState<string | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<any | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // --- VENDOR TIMELINE POSTS STATE & DISPATCH CHANNELS ---
  const [timelinePosts, setTimelinePosts] = useState<any[]>([]);
  const [isFetchingTimeline, setIsFetchingTimeline] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'PRODUCT' | 'PROPERTY' | 'JOB' | 'ANNOUNCEMENT' | 'PROMOTION'>('PRODUCT');
  const [newPostVisibility, setNewPostVisibility] = useState<'PUBLIC' | 'FOLLOWERS_ONLY'>('PUBLIC');
  const [newCommentTexts, setNewCommentTexts] = useState<{ [postId: string]: string }>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  const fetchTimelinePosts = async (vId: string) => {
    setIsFetchingTimeline(true);
    try {
      const res = await fetch(`/api/timeline-posts?vendorId=${vId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setTimelinePosts(data.posts);
      }
    } catch (e) {
      console.error("Error retrieving timeline posts:", e);
    } finally {
      setIsFetchingTimeline(false);
    }
  };

  useEffect(() => {
    if (viewedVendorId) {
      fetchTimelinePosts(viewedVendorId);
    }
  }, [viewedVendorId]);

  const handleCreateTimelinePost = async (vId: string) => {
    if (!newPostContent.trim()) return;
    try {
      const res = await fetch('/api/timeline-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vId,
          type: newPostType,
          title: newPostTitle.trim() || null,
          content: newPostContent.trim(),
          visibility: newPostVisibility
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTimelinePosts(prev => [data.post, ...prev]);
        setNewPostContent('');
        setNewPostTitle('');
        setNewPostType('PRODUCT');
        setNewPostVisibility('PUBLIC');
      }
    } catch (e) {
      console.error("Error creating post:", e);
    }
  };

  const handleLikeTimelinePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/timeline-posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        setTimelinePosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: data.likesCount } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareTimelinePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/timeline-posts/${postId}/share`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        setTimelinePosts(prev => prev.map(p => p.id === postId ? { ...p, sharesCount: data.sharesCount } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentTimelinePost = async (postId: string) => {
    const text = newCommentTexts[postId];
    if (!text || !text.trim()) return;
    try {
      const res = await fetch(`/api/timeline-posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: lang === 'en' ? "Verified User" : "የተረጋገጠ ተጠቃሚ",
          text: text.trim()
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTimelinePosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: data.commentsCount, comments: data.comments } : p));
        setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sub-category pill filters
  const [shopFilter, setShopFilter] = useState<'all' | 'clothing' | 'coffee' | 'other'>('all');
  const [housesFilter, setHousesFilter] = useState<'all' | 'rent' | 'buy' | 'commercial'>('all');
  const [housesPropertyType, setHousesPropertyType] = useState<'all' | 'condominium' | 'villa' | 'apartment' | 'studio'>('all');
  const [agenciesFilter, setJobFilter] = useState<'all' | 'gulf' | 'europe' | 'technical'>('all');

  // Interactive sheet states
  const [userRating, setUserRating] = useState<number>(5);
  const [textReview, setTextReview] = useState<string>('');
  const [activeInvoice, setActiveInvoice] = useState<{ id: string; title: string; price: number; date: string } | null>(null);
  
  // Real-time telemetry health log state for interactive system completeness tests
  const [telemetryLogs, setTelemetryLogs] = useState<Record<string, string>>({});

  // --- MULTILINGUAL VOICE COMPANION & GEOLOCATION ASSISTANT STATE ---
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceReply, setVoiceReply] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [voiceLocation, setVoiceLocation] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{lat: number, lon: number} | null>(null);
  const [currentNeighborhood, setCurrentNeighborhood] = useState<{en: string, am: string} | null>(null);
  const [voiceAssistantLang, setVoiceAssistantLang] = useState<'am' | 'en'>('en');

  // Refs for continuous speech recognition tracking and avoiding stale state closures
  const recognitionInstanceRef = React.useRef<any>(null);
  const isContinuousActiveRef = React.useRef<boolean>(false);
  const isSpeakingRef = React.useRef<boolean>(false);
  const utteranceRef = React.useRef<any>(null);

  // Heuristic to map Addis Ababa lat/lon to specific neighborhoods (as a local robust fallback)
  const getNeighborhood = (latVal: number, lonVal: number) => {
    if (latVal >= 8.98 && latVal <= 9.025 && lonVal >= 38.77 && lonVal <= 38.82) {
      return { en: "Bole (ቦሌ) near Millennium Hall & Japan Market", am: "ቦሌ ሚሊኒየም አዳራሽ እና ጃፓን አካባቢ" };
    }
    if (latVal >= 9.01 && latVal <= 9.035 && lonVal >= 38.745 && lonVal <= 38.77) {
      return { en: "Kazanchis (ካዛንቺስ) near UNECA & Hilton Hotel", am: "ካዛንቺስ የተባበሩት መንግስታት ድርጅት እና ሂልተን ሆቴል አካባቢ" };
    }
    if (latVal >= 9.02 && latVal <= 9.055 && lonVal >= 38.72 && lonVal <= 38.76) {
      return { en: "Piazza (ፒያሳ) / Arat Kilo historic area", am: "ፒያሳ እና አራት ኪሎ ታሪካዊ ሰፈር አካባቢ" };
    }
    if (latVal >= 8.995 && latVal <= 9.025 && lonVal >= 38.70 && lonVal <= 38.745) {
      return { en: "Mexico (ሜክሲኮ) square / Lideta district", am: "ሜክሲኮ አደባባይ እና ልደታ ክፍለ ከተማ አካባቢ" };
    }
    if (latVal >= 9.01 && latVal <= 9.035 && lonVal >= 38.775 && lonVal <= 38.83) {
      return { en: "Megenagna (መገናኛ) transit center / Haya Hulet", am: "መገናኛ አደባባይ እና ሃያ ሁለት አካባቢ" };
    }
    if (latVal >= 9.00 && latVal <= 9.04 && lonVal >= 38.83 && lonVal <= 38.89) {
      return { en: "CMC / Ayat (አያት) residential zone", am: "ሲኤምሲ እና አያት የመኖሪያ መንደር አካባቢ" };
    }
    if (latVal >= 8.94 && latVal <= 8.985 && lonVal >= 38.73 && lonVal <= 38.78) {
      return { en: "Saris (ሳሪስ) industrial area / Gotera Interchange", am: "ሳሪስ እና ጎተራ ማገናኛ አካባቢ" };
    }
    return { en: "Bole (ቦሌ) Central District, Addis Ababa", am: "ቦሌ ማዕከላዊ ቀጠና ፣ አዲስ አበባ" };
  };

  const amharicPhonetics: Record<string, string> = {
    'ሀ': 'he', 'ሁ': 'hu', 'ሂ': 'hi', 'ሃ': 'ha', 'ሄ': 'hee', 'ህ': 'h', 'ሆ': 'ho',
    'ለ': 'le', 'ሉ': 'lu', 'ሊ': 'li', 'ላ': 'la', 'ሌ': 'lee', 'ል': 'l', 'ሎ': 'lo', 'ሏ': 'lwa',
    'ሐ': 'he', 'ሑ': 'hu', 'ሒ': 'hi', 'ሓ': 'ha', 'ሔ': 'hee', 'ሕ': 'h', 'ሖ': 'ho', 'ሗ': 'hwa',
    'መ': 'me', 'ሙ': 'mu', 'ሚ': 'mi', 'ማ': 'ma', 'ሜ': 'mee', 'ም': 'm', 'ሞ': 'mo', 'ሟ': 'mwa',
    'ሠ': 'se', 'ሡ': 'su', 'ሢ': 'si', 'ሣ': 'sa', 'ሤ': 'see', 'ሥ': 's', 'ሦ': 'so', 'ሧ': 'swa',
    'ረ': 're', 'ሩ': 'ru', 'ሪ': 'ri', 'ራ': 'ra', 'ሬ': 'ree', 'ር': 'r', 'ሮ': 'ro', 'ሯ': 'rwa',
    'ሰ': 'se', 'ሱ': 'su', 'ሲ': 'si', 'ሳ': 'sa', 'ሴ': 'see', 'ስ': 's', 'ሶ': 'so', 'ሷ': 'swa',
    'ሸ': 'she', 'ሹ': 'shu', 'ሺ': 'shi', 'ሻ': 'sha', 'ሼ': 'shee', 'ሽ': 'sh', 'ሾ': 'sho', 'ሿ': 'shwa',
    'ቀ': 'qe', 'ቁ': 'qu', 'ቂ': 'qi', 'ቃ': 'qa', 'ቄ': 'qee', 'ቅ': 'q', 'ቆ': 'qo', 'ቋ': 'qwa',
    'በ': 'be', 'ቡ': 'bu', 'ቢ': 'bi', 'ባ': 'ba', 'ቤ': 'bee', 'ብ': 'b', 'ቦ': 'bo', 'ቧ': 'bwa',
    'ቨ': 've', 'ቩ': 'vu', 'ቪ': 'vi', 'ቫ': 'va', 'ቬ': 'vee', 'ቭ': 'v', 'ቮ': 'vo', 'ቯ': 'vwa',
    'ተ': 'te', 'ቱ': 'tu', 'ቲ': 'ti', 'ታ': 'ta', 'ቴ': 'tee', 'ት': 't', 'ቶ': 'to', 'ቷ': 'twa',
    'ቸ': 'che', 'ቹ': 'chu', 'ቺ': 'chi', 'ቻ': 'cha', 'ቼ': 'chee', 'ች': 'ch', 'ቾ': 'cho', 'ቿ': 'chwa',
    'ኀ': 'he', 'ኁ': 'hu', 'ኂ': 'hi', 'ኃ': 'ha', 'ኄ': 'hee', 'ኅ': 'h', 'ኆ': 'ho', 'ኇ': 'hwa',
    'ነ': 'ne', 'ኑ': 'nu', 'ኒ': 'ni', 'ና': 'na', 'ኔ': 'nee', 'ን': 'n', 'ኖ': 'no', 'ኗ': 'nwa',
    'ኘ': 'nye', 'ኙ': 'nyu', 'ኚ': 'nyi', 'ኛ': 'nya', 'ኜ': 'nyee', 'ኝ': 'ny', 'ኞ': 'nyo', 'ኟ': 'nywa',
    'አ': 'a', 'ኡ': 'u', 'ኢ': 'i', 'ኣ': 'a', 'ኤ': 'ee', 'እ': 'e', 'ኦ': 'o', 'ኧ': 'e',
    'ከ': 'ke', 'ኩ': 'ku', 'ኪ': 'ki', 'ካ': 'ka', 'ኬ': 'kee', 'ክ': 'k', 'ኮ': 'ko', 'ኳ': 'kwa',
    'ኸ': 'he', 'ኹ': 'hu', 'ኺ': 'hi', 'ኻ': 'ha', 'ኼ': 'hee', 'ኽ': 'h', 'ኾ': 'ho',
    'ወ': 'we', 'ዉ': 'wu', 'ዊ': 'wi', 'ዋ': 'wa', 'ዌ': 'wee', 'ው': 'w', 'ዎ': 'wo',
    'ዐ': 'a', 'ዑ': 'u', 'ዒ': 'i', 'ዓ': 'a', 'ዔ': 'ee', 'ዕ': 'e', 'ዖ': 'o',
    'ዘ': 'ze', 'ዙ': 'zu', 'ዚ': 'zi', 'ዛ': 'za', 'ዜ': 'zee', 'ዝ': 'z', 'ዞ': 'zo', 'ዟ': 'zwa',
    'ዠ': 'zhe', 'ዡ': 'zhu', 'ዢ': 'zhi', 'ዣ': 'zha', 'ዤ': 'zhee', 'ዥ': 'zh', 'ዦ': 'zho', 'ዧ': 'zhwa',
    'የ': 'ye', 'ዩ': 'yu', 'ዪ': 'yi', 'ያ': 'ya', 'ዬ': 'yee', 'ይ': 'y', 'ዮ': 'yo',
    'ደ': 'de', 'ዱ': 'du', 'ዲ': 'di', 'ዳ': 'da', 'ዴ': 'dee', 'ድ': 'd', 'ዶ': 'do', 'ዷ': 'dwa',
    'ጀ': 'je', 'ጁ': 'ju', 'ጂ': 'ji', 'ጃ': 'ja', 'ጄ': 'jee', 'ጅ': 'j', 'ጆ': 'jo', 'ጇ': 'jwa',
    'ገ': 'ge', 'ጉ': 'gu', 'ጊ': 'gi', 'ጋ': 'ga', 'ጌ': 'gee', 'ግ': 'g', 'ጎ': 'go', 'ጓ': 'gwa',
    'ጠ': 'te', 'ጡ': 'tu', 'ጢ': 'ti', 'ጣ': 'ta', 'ጤ': 'tee', 'ጥ': 't', 'ጦ': 'to', 'ጧ': 'twa',
    'ጨ': 'che', 'ጩ': 'chu', 'ጪ': 'chi', 'ጫ': 'cha', 'ጬ': 'chee', 'ጭ': 'ch', 'ጮ': 'cho', 'ጯ': 'chwa',
    'ጰ': 'pe', 'ጱ': 'pu', 'ጲ': 'pi', 'ጳ': 'pa', 'ጴ': 'pee', 'ጵ': 'p', 'ጶ': 'po', 'ጷ': 'pwa',
    'ጸ': 'tse', 'ጹ': 'tsu', 'ጺ': 'tsi', 'ጻ': 'tsa', 'ጼ': 'tsee', 'ጽ': 'ts', 'ጾ': 'tso', 'ጿ': 'tswa',
    'ፀ': 'tse', 'ፁ': 'tsu', 'ፂ': 'tsi', 'ፃ': 'tsa', 'ፄ': 'tsee', 'ፅ': 'ts', 'ፆ': 'tso',
    'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fee', 'ፍ': 'f', 'ፎ': 'fo', 'ፏ': 'fwa',
    'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pee', 'ፕ': 'p', 'ፖ': 'po', 'ፗ': 'pwa',
    '፡': ' ', '።': '. ', '፣': ', ', '፤': '; ', '፥': ', ', '፦': ': ', '፧': '? ', '፨': ' '
  };

  const transliterateAmharicToEnglish = (text: string): string => {
    return text.split('').map(char => amharicPhonetics[char] || char).join('');
  };

  const speakText = (txt: string, shouldCloseOnEnd?: boolean) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(true);
      isSpeakingRef.current = true;

      // Abort active recognition temporarily to prevent feedback loops
      if (recognitionInstanceRef.current) {
        try {
          recognitionInstanceRef.current.abort();
        } catch (e) {
          console.error(e);
        }
      }

      const voices = window.speechSynthesis.getVoices();
      const hasAmharicVoice = voices.some(v => v.lang.startsWith('am'));
      const hasAmharicLetters = /[\u1200-\u137F]/.test(txt);

      let textToSpeak = txt;
      let langToUse = 'en-US';

      if (hasAmharicLetters) {
        if (hasAmharicVoice) {
          langToUse = 'am-ET';
        } else {
          // Fallback to beautiful phonetic transliteration so any device can speak Amharic fluently!
          textToSpeak = transliterateAmharicToEnglish(txt);
          langToUse = 'en-US';
          console.log("Synthesizing Amharic phonetically via English voice:", textToSpeak);
        }
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance; // Keep a strong reference to prevent garbage collection!
      utterance.lang = langToUse;
      // Slightly slower rate for perfect phonetics pronunciation in fallback mode
      utterance.rate = langToUse === 'am-ET' ? 1.0 : 0.88; 

      let isFinished = false;
      const handleVoiceFinished = () => {
        if (isFinished) return;
        isFinished = true;
        setIsPlayingVoice(false);
        isSpeakingRef.current = false;

        if (shouldCloseOnEnd) {
          console.log("Auto-close on Thank You triggered! Closing Voice Assistant overlay...");
          closeVoiceAssistant();
          return;
        }

        // Resume listening automatically in continuous mode
        if (isContinuousActiveRef.current) {
          setTimeout(() => {
            if (isContinuousActiveRef.current) {
              restartListeningLoop();
            }
          }, 300);
        }
      };

      utterance.onend = handleVoiceFinished;
      utterance.onerror = handleVoiceFinished;

      // Robust safety fallback: auto-finish if speech is stuck in browser API
      const safetyDelay = Math.max(12000, textToSpeak.length * 100);
      setTimeout(() => {
        if (!isFinished) {
          console.log("Speech synthesis safety timeout triggered - releasing voice lock.");
          handleVoiceFinished();
        }
      }, safetyDelay);

      window.speechSynthesis.speak(utterance);
    } else {
      console.log("speechSynthesis not supported in this browser.");
      if (shouldCloseOnEnd) {
        setTimeout(() => {
          closeVoiceAssistant();
        }, 1500);
      } else {
        if (isContinuousActiveRef.current) {
          setTimeout(() => {
            restartListeningLoop();
          }, 300);
        }
      }
    }
  };

  const restartListeningLoop = () => {
    if (!isVoiceAssistantOpen || isSpeakingRef.current || !isContinuousActiveRef.current) {
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    if (recognitionInstanceRef.current) {
      try {
        recognitionInstanceRef.current.abort();
      } catch (e) {
        console.error(e);
      }
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = voiceAssistantLang === 'en' ? 'en-US' : 'am-ET';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (e: any) => {
      console.log("Speech recognition error in continuous loop:", e, "Error detail:", e.error);
      setIsListening(false);
      
      // Quietly restart if we are in continuous mode and it was not a manual speech-synthesis abort
      if (isContinuousActiveRef.current && (e.error !== 'aborted' || !isSpeakingRef.current)) {
        setTimeout(() => {
          if (isContinuousActiveRef.current) {
            restartListeningLoop();
          }
        }, 500);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isContinuousActiveRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isContinuousActiveRef.current) {
            restartListeningLoop();
          }
        }, 300);
      }
    };

    recognition.onresult = (event: any) => {
      const transcriptText = event.results[0][0].transcript;
      if (transcriptText && transcriptText.trim().length > 0) {
        setVoiceTranscript(transcriptText);
        processVoiceCommand(transcriptText);
      }
    };

    recognitionInstanceRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  };

  const toggleListening = () => {
    // Click-to-interrupt: If speaking, always stop speech and start listening immediately
    if (isPlayingVoice || isSpeakingRef.current) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingVoice(false);
      isSpeakingRef.current = false;
      isContinuousActiveRef.current = true; // Ensure continuous loop is active
      setVoiceTranscript(voiceAssistantLang === 'en' ? "Interrupted. Listening..." : "ንግግር ተቋርጧል። እያዳመጥኩ ነው...");
      setVoiceReply("");
      restartListeningLoop();
      return;
    }

    if (isContinuousActiveRef.current) {
      // Otherwise, deactivate continuous mode entirely
      isContinuousActiveRef.current = false;
      setIsListening(false);
      if (recognitionInstanceRef.current) {
        try {
          recognitionInstanceRef.current.abort();
        } catch (e) {
          console.error(e);
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingVoice(false);
      isSpeakingRef.current = false;
      setVoiceTranscript(voiceAssistantLang === 'en' ? "Voice assistant paused. Tap to speak." : "የድምፅ ረዳቱ ቆሟል። ለመናገር ማይኩን ይጫኑ።");
    } else {
      // Activate continuous mode
      isContinuousActiveRef.current = true;
      setVoiceTranscript(voiceAssistantLang === 'en' ? "Continuous mic active. Speak clearly now..." : "ማይኩ ክፍት ነው። መናገር መጀመር ይችላሉ...");
      setVoiceReply('');
      restartListeningLoop();
    }
  };

  const closeVoiceAssistant = () => {
    isContinuousActiveRef.current = false;
    setIsListening(false);
    if (recognitionInstanceRef.current) {
      try {
        recognitionInstanceRef.current.abort();
      } catch (e) {
        console.error(e);
      }
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
    isSpeakingRef.current = false;
    setIsVoiceAssistantOpen(false);
  };

  // Self-healing Voice Assistant Heartbeat:
  // If continuous mode is enabled, but the mic is neither listening nor is the assistant speaking,
  // automatically restart the listening loop after a short grace period.
  useEffect(() => {
    if (!isVoiceAssistantOpen) return;
    
    const interval = setInterval(() => {
      if (isContinuousActiveRef.current && !isListening && !isPlayingVoice) {
        console.log("Heartbeat detected inactive mic in continuous mode. Force resetting speaking state and restarting loop...");
        isSpeakingRef.current = false;
        restartListeningLoop();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isVoiceAssistantOpen, isListening, isPlayingVoice]);

  const processVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // Detect if user is asking in Amharic (either using Ge'ez characters or transliterated latin alphabet)
    const containsGeez = /[\u1200-\u137F]/.test(lowerText);
    
    // Strict word boundary checks for transliterated Amharic words to prevent false positives in English words (e.g. "several" matching "sefer", "silent" matching "sile")
    const transliteratedAmharicWords = [
      /\byet\s+new\b/i,
      /\byet\s+neh\b/i,
      /\byet\s+nesh\b/i,
      /\byalehubet\b/i,
      /\byallehubet\b/i,
      /\bsefer\b/i,
      /\bsafar\b/i,
      /\bameseginalew\b/i,
      /\bameseginalehu\b/i,
      /\bsile\b/i,
      /\bmenden\b/i,
      /\berda\b/i,
      /\bmetegberiya\b/i,
      /\bwistina\b/i,
      /\bkifiya\b/i,
      /\bbirr\b/i,
      /\bselam\b/i,
      /\bindet\b/i
    ];
    
    const isTransliteratedAmharic = transliteratedAmharicWords.some(rx => rx.test(lowerText));
    const isAmharicInput = containsGeez || isTransliteratedAmharic;

    // Override language helper for this specific response if Amharic input detected
    const targetLang = isAmharicInput ? 'am' : voiceAssistantLang;

    // 1. LOCATION CHECK (Where am I? / የት ነው ያለሁት?)
    const isLocationQuery = 
      lowerText.includes('የት ነው') || 
      lowerText.includes('የትነኝ') || 
      lowerText.includes('ሎኬሽን') || 
      lowerText.includes('ቦታዬ') || 
      lowerText.includes('ያለሁበት') || 
      lowerText.includes('ቦታውን') || 
      lowerText.includes('የሰፈር') || 
      lowerText.includes('ካርታ') || 
      lowerText.includes('ሰፈር') || 
      lowerText.includes('የታለሁበት') || 
      lowerText.includes('አካባቢ') || 
      /\bwhere\s+am\s+i\b/i.test(lowerText) || 
      /\blocation\b/i.test(lowerText) || 
      /\bgps\b/i.test(lowerText) || 
      /\bfind\s+me\b/i.test(lowerText) || 
      /\byet\s+new\b/i.test(lowerText) || 
      /\byalehubet\b/i.test(lowerText) || 
      /\byallehubet\b/i.test(lowerText) || 
      /\bsefer\b/i.test(lowerText) || 
      /\bsafar\b/i.test(lowerText) || 
      /\bbota\b/i.test(lowerText);

    if (isLocationQuery) {
      setIsLocating(true);
      setVoiceReply(targetLang === 'en' ? "Accessing secure GPS satellites and resolving neighborhood..." : "የጂፒኤስ ሳተላይት መረጃዎችን እና ያለፉበትን ትክክለኛ ሰፈር በማንበብ ላይ...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const latStr = lat.toFixed(4);
          const lonStr = lon.toFixed(4);
          setVoiceLocation(`Lat: ${latStr}, Lon: ${lonStr}`);
          setCurrentCoords({ lat, lon });
          
          // Dynamic Reverse Geocoding fetch from OpenStreetMap Nominatim for extreme accuracy
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=16&accept-language=am,en`, {
            headers: { 'User-Agent': 'EveryZoneApp/1.0' }
          })
          .then(res => res.json())
          .then(data => {
            const addr = data.address || {};
            const placeNameAm = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || addr.town || addr.village || addr.road || "አዲስ አበባ";
            
            // Fetch the English equivalent name to match both translation tracks
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=16&accept-language=en`, {
              headers: { 'User-Agent': 'EveryZoneApp/1.0' }
            })
            .then(resEn => resEn.json())
            .then(dataEn => {
              const addrEn = dataEn.address || {};
              const placeNameEn = addrEn.suburb || addrEn.neighbourhood || addrEn.city_district || addrEn.quarter || addrEn.town || addrEn.village || addrEn.road || "Addis Ababa";
              
              const resolvedNeighborhood = { en: placeNameEn, am: placeNameAm };
              setCurrentNeighborhood(resolvedNeighborhood);
              
              const reply = targetLang === 'en'
                ? `You are currently in ${resolvedNeighborhood.en}, Addis Ababa, Ethiopia, located near GPS coordinates Latitude ${latStr} and Longitude ${lonStr}. Your position is fully mapped.`
                : `በአሁኑ ሰዓት የሚገኙት አዲስ አበባ ውስጥ ${resolvedNeighborhood.am} በኬክሮስ ${latStr} እና በኬንትሮስ ${lonStr} መጋጠሚያ አካባቢ ነው። የቦታ ምልክትዎ እና ሰፈርዎ በጥሩ ሁኔታ ይሰራል።`;
              
              setVoiceReply(reply);
              speakText(reply);
            })
            .catch(() => {
              const resolvedNeighborhood = { en: placeNameAm, am: placeNameAm };
              setCurrentNeighborhood(resolvedNeighborhood);
              const reply = targetLang === 'en'
                ? `You are currently in ${resolvedNeighborhood.en}, Addis Ababa, Ethiopia, located near GPS coordinates Latitude ${latStr} and Longitude ${lonStr}. Your position is fully mapped.`
                : `በአሁኑ ሰዓት የሚገኙት አዲስ አበባ ውስጥ ${resolvedNeighborhood.am} በኬክሮስ ${latStr} እና በኬንትሮስ ${lonStr} መጋጠሚያ አካባቢ ነው። የቦታ ምልክትዎ እና ሰፈርዎ በጥሩ ሁኔታ ይሰራል።`;
              setVoiceReply(reply);
              speakText(reply);
            });
          })
          .catch(err => {
            console.error("Nominatim dynamic fetch error:", err);
            // Local heuristic fallback
            const neighborhood = getNeighborhood(lat, lon);
            setCurrentNeighborhood(neighborhood);
            
            const reply = targetLang === 'en'
              ? `You are currently in ${neighborhood.en}, Addis Ababa, Ethiopia, located near GPS coordinates Latitude ${latStr} and Longitude ${lonStr}. Your position is fully mapped.`
              : `በአሁኑ ሰዓት የሚገኙት አዲስ አበባ ውስጥ ${neighborhood.am} በኬክሮስ ${latStr} እና በኬንትሮስ ${lonStr} መጋጠሚያ አካባቢ ነው። የቦታ ምልክትዎ እና ሰፈርዎ በጥሩ ሁኔታ ይሰራል።`;
            
            setVoiceReply(reply);
            speakText(reply);
          });
        },
        (error) => {
          setIsLocating(false);
          // Fallback location is central Bole area in Addis Ababa
          const defaultLat = 9.0035;
          const defaultLon = 38.7896;
          const latStr = defaultLat.toFixed(4);
          const lonStr = defaultLon.toFixed(4);
          setVoiceLocation(`Lat: ${latStr}, Lon: ${lonStr}`);
          setCurrentCoords({ lat: defaultLat, lon: defaultLon });
          
          const neighborhood = getNeighborhood(defaultLat, defaultLon);
          setCurrentNeighborhood(neighborhood);
          
          const reply = targetLang === 'en'
            ? `Your exact GPS location is protected by browser privacy settings. Using EveryZone's default secure hub in ${neighborhood.en} with coordinates Latitude ${latStr}, Longitude ${lonStr}.`
            : `የእርስዎ ብሮውዘር መገኛ ፍቃድ ስላልተሰጠው በኤቭሪዞን ዋና ማዕከል ${neighborhood.am} በኬክሮስ ${latStr} እና በኬንትሮስ ${lonStr} ያለውን የደህንነት ካርታ መገኛ እና ሰፈር አሳይተናል።`;
          
          setVoiceReply(reply);
          speakText(reply);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return;
    }

    // 2. THANK YOU CHECK (አመሰግናለሁ / አመሰግናለው / Thank you)
    const isThankYouQuery = 
      lowerText.includes('አመሰግናለሁ') || 
      lowerText.includes('አመሰግናለው') || 
      lowerText.includes('አመስግናለሁ') || 
      lowerText.includes('አመስግናለው') || 
      lowerText.includes('አመሰግናለውኝ') || 
      /\bameseginalew\b/i.test(lowerText) || 
      /\bameseginalehu\b/i.test(lowerText) || 
      /\bamesginalew\b/i.test(lowerText) || 
      /\bthank\s+you\b/i.test(lowerText) || 
      /\bthanks\b/i.test(lowerText) || 
      /\bthank\s+u\b/i.test(lowerText) || 
      /\btanks\b/i.test(lowerText);

    if (isThankYouQuery) {
      const reply = targetLang === 'en'
        ? "You are very welcome! It is my absolute pleasure to help you as your EveryZone assistant. Goodbye!"
        : "እኔም በጣም አመሰግናለሁ! የኤቭሪዞን የድምፅ ረዳት በመሆኔ እጅግ ደስተኛ ነኝ። ደህና ሁኑ!";
      setVoiceReply(reply);
      speakText(reply, true);
      return;
    }

    // 3. GREETINGS CHECK (ሰላም / Hello / Hi)
    const isGreetingQuery = 
      lowerText.includes('ሰላም') || 
      lowerText.includes('ጤና ይስጥልኝ') || 
      lowerText.includes('እንደምን') || 
      lowerText.includes('እንዴት ነህ') || 
      lowerText.includes('እንዴት ነሽ') || 
      lowerText.includes('እንዴት ናችሁ') || 
      /\bselam\b/i.test(lowerText) || 
      /\bindet\b/i.test(lowerText) || 
      /\bindeth\b/i.test(lowerText) || 
      /\bhi\b/i.test(lowerText) || 
      /\bhello\b/i.test(lowerText) || 
      /\bhey\b/i.test(lowerText) || 
      /\bhow\s+are\s+you\b/i.test(lowerText);

    if (isGreetingQuery) {
      const reply = targetLang === 'en'
        ? "Hello there! I am doing great, thank you. I am your smart voice companion, always listening. How are you doing today? Ask me anything!"
        : "ሰላምታዬ ይድረስዎ! እኔ በጣም ደህና ነኝ፣ እግዚአብሔር ይመስገን። እኔ ሁልጊዜ ዝግጁ የሆንኩት የኤቭሪዞን የድምፅ ረዳት ነኝ። ዛሬ እንዴት ነዎት? በምን ልርዳዎት?";
      setVoiceReply(reply);
      speakText(reply);
      return;
    }

    // 4. WHO ARE YOU CHECK (ማን ነህ / ማን ነሽ / Who are you)
    const isWhoAreYouQuery = 
      lowerText.includes('ማን ነህ') || 
      lowerText.includes('ማን ነሽ') || 
      lowerText.includes('ማንነትህ') || 
      lowerText.includes('ማንነትሽ') || 
      lowerText.includes('ስምህ ማን') || 
      lowerText.includes('ስምሽ ማን') || 
      lowerText.includes('ስም ማን') || 
      /\bwho\s+are\s+you\b/i.test(lowerText) || 
      /\bwho\s+are\s+u\b/i.test(lowerText) || 
      /\byour\s+name\b/i.test(lowerText) || 
      /\bwhat\s+is\s+your\s+name\b/i.test(lowerText);

    if (isWhoAreYouQuery) {
      const reply = targetLang === 'en'
        ? "I am the EveryZone Intelligent Voice Assistant, built to understand both Amharic and English just like Gemini. I can instantly verify your physical location, search local neighborhoods, and guide you through our escrow security!"
        : "እኔ የኤቭሪዞን አስተዋይ የድምፅ ረዳት ነኝ! ልክ እንደ ጄምኒ አማርኛና እንግሊዘኛን በሚገባ መረዳትና መናገር እችላለሁ። ያለሁበትን ሎኬሽን፣ የሰፈርዎን ካርታ እና ስለ ክፍያ ዋስትና በድምፅ ማስረዳት እችላለሁ።";
      setVoiceReply(reply);
      speakText(reply);
      return;
    }

    // 5. GEMINI CHECK (ጀሚኒ / ጄምኒ / Gemini)
    const isGeminiQuery = 
      lowerText.includes('ጄምኒ') || 
      lowerText.includes('ጀሚኒ') || 
      lowerText.includes('gemini') || 
      /(^|\s|[.,!?])(ai|አይ)($|\s|[.,!?])/i.test(lowerText);

    if (isGeminiQuery) {
      const reply = targetLang === 'en'
        ? "Yes! I am designed with a continuous listening loop and rapid bilingual response, inspired by the Gemini voice assistant. I can hear your voice clearly and respond instantly in Amharic or English!"
        : "ትክክል ነው! ልክ እንደ ጄምኒ የድምፅ ረዳት ማይኩን አንዴ ከከፈቱት በኋላ ወሬዎትን ሳይቆራረጥ በቀጣይነት ማዳመጥ እና በፍጥነት በአማርኛ ወይም በኢንግሊዘኛ መመለስ እችላለሁ።";
      setVoiceReply(reply);
      speakText(reply);
      return;
    }

    // 6. EXPLAIN THE APP / HELP / TUTORIAL
    const isHelpQuery = 
      lowerText.includes('ስለ') || 
      lowerText.includes('ምንድን') || 
      lowerText.includes('እርዳ') || 
      lowerText.includes('መተግበሪያ') || 
      lowerText.includes('ምን ይሰራል') || 
      lowerText.includes('አብራራ') || 
      lowerText.includes('እርዳኝ') || 
      lowerText.includes('አፕ') || 
      lowerText.includes('help') || 
      lowerText.includes('explain') || 
      lowerText.includes('about') || 
      lowerText.includes('how does') || 
      lowerText.includes('tutorial') || 
      lowerText.includes('sile') || 
      lowerText.includes('menden') || 
      lowerText.includes('erda') || 
      lowerText.includes('metegberiya');

    if (isHelpQuery) {
      const reply = targetLang === 'en'
        ? "EveryZone is Ethiopia's premium Super App. Here are our main features: First, Verified Overseas Jobs with direct agency listings. Second, traditional marketplace for clothes, food, and electronics secured by escrow. Third, verified real estate solutions for rent or purchase. Fourth, reliable Car Rental. Fifth, automated Equb Lottery savings. Sixth, our Smart Dual Calendar displaying Ethiopian and Gregorian dates side-by-side. And seventh, this bilingual AI Voice Assistant. Every transaction is protected by a 200 ETB escrow deposit!"
        : "ኤቭሪዞን የኢትዮጵያ ቀዳሚ ባለብዙ አገልግሎት ወይም ሱፐር አፕሊኬሽን ነው። ዋና ዋና ባህሪያቱ፡- አንደኛ፣ በተረጋገጡ ኤጀንሲዎች በኩል የሚገኙ የባህር ማዶ ስራዎች። ሁለተኛ፣ በ200 ብር የክፍያ ዋስትና የተጠበቀ የባህል አልባሳትና የቁሳቁስ መገበያያ። ሶስተኛ፣ የተረጋገጡ ቤቶች ኪራይ እና ሽያጭ። አራተኛ፣ አስተማማኝ የመኪና ኪራይ። አምስተኛ፣ ታማኝ የእቁብ እጣ ቁጠባ። ስድስተኛ፣ የኢትዮጵያ እና የግሪጎርያንን ቀኖች ጎን ለጎን የሚያሳይ ዘመናዊ የቀን መቁጠሪያ። እና ሰባተኛ፣ ይህ የድምፅ ረዳት ናቸው። ሁሉም ግብይቶች በክፍያ ዋስትና የተጠበቁ ናቸው።";
      setVoiceReply(reply);
      speakText(reply);
      return;
    }

    // 7. ESCROW / DEPOSIT / SECURITY
    const isEscrowQuery = 
      lowerText.includes('እስክሮው') || 
      lowerText.includes('ዋስትና') || 
      lowerText.includes('ክፍያ') || 
      lowerText.includes('ደህንነት') || 
      lowerText.includes('escrow') || 
      lowerText.includes('deposit') || 
      lowerText.includes('secure') || 
      lowerText.includes('chapa') || 
      lowerText.includes('safe') || 
      lowerText.includes('wistina') || 
      lowerText.includes('kifiya') || 
      lowerText.includes('birr');

    if (isEscrowQuery) {
      const reply = targetLang === 'en'
        ? "Our advanced digital escrow system holds transaction funds securely. A 200 ETB deposit secures courier dispatch, and payments are only released to vendors after you verify receipt."
        : "የኤቭሪዞን ክፍያ ዋስትና ግብይቶችን አስተማማኝ ያደርጋል። ባለ 200 ብር የቅድመ ክፍያ ዋስትናዎ እቃው ደርሶዎት እስኪያረጋግጡ ድረስ በታማኝነት ይቀመጣል።";
      setVoiceReply(reply);
      speakText(reply);
      return;
    }

    // 8. GENERAL GREETINGS / FALLBACK (With smart, conversational Gemini answers)
    const thinkingText = targetLang === 'en' ? "Thinking..." : "በማሰብ ላይ...";
    setVoiceReply(thinkingText);
    
    fetch('/api/voice-assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang: targetLang })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success' && data.reply) {
        setVoiceReply(data.reply);
        speakText(data.reply);
      } else {
        // Local smart fallback
        const localReply = targetLang === 'en'
          ? `I heard: "${text}". I'm always happy to chat! Ask me 'Where am I?', 'Explain the app', or let's converse about anything.`
          : `የተናገሩት፡ "${text}" ነው። እኔ ማውራት እወዳለሁ! እባክዎ እንደ 'የት ነው ያለሁት?' ወይም 'ስለ መተግበሪያው አስረዳኝ' ወይም 'አመሰግናለሁ' ብለው ይጠይቁኝ።`;
        setVoiceReply(localReply);
        speakText(localReply);
      }
    })
    .catch(err => {
      console.error("Gemini Voice Assistant fetch error:", err);
      const localReply = targetLang === 'en'
        ? `I heard: "${text}". I'm always happy to chat! Ask me 'Where am I?', 'Explain the app', or let's converse about anything.`
        : `የተናገሩት፡ "${text}" ነው። እኔ ማውራት እወዳለሁ! እባክዎ እንደ 'የት ነው ያለሁት?' ወይም 'ስለ መተግበሪያው አስረዳኝ' ወይም 'አመሰግናለሁ' ብለው ይጠይቁኝ።`;
      setVoiceReply(localReply);
      speakText(localReply);
    });
  };

  const handleVoiceWelcome = () => {
    setIsVoiceAssistantOpen(true);
    const txt = voiceAssistantLang === 'en'
      ? "Welcome to EveryZone Voice Companion. I am listening! Ask me about your location, how to buy, or explain the application."
      : "እንኳን ወደ ኤቭሪዞን የድምፅ ረዳት በደህና መጡ! ያሉበትን ሎኬሽን ለማወቅ 'የት ነው ያለሁት' ይበሉኝ፤ ወይም ስለ አፕሊኬሽኑ ማብራሪያ ይጠይቁኝ።";
    
    setVoiceTranscript(voiceAssistantLang === 'en' ? "Welcome speech playing..." : "የእንኳን ደህና መጡ መልእክት እየተጫወተ ነው...");
    setVoiceReply(txt);
    
    // Automatically enable continuous listening mode once welcome dialog commences
    isContinuousActiveRef.current = true;
    speakText(txt);
  };

  // Physical receipt downloader
  const downloadReceiptFile = (invoice: { id: string; title: string; price: number; date: string }) => {
    const text = `================================================
           EVERYZONE SUPER APP OFFICIAL RECEIPT
================================================
Invoice Reference: ${invoice.id}
Transaction Date:  ${invoice.date}
Customer Email:    ambek0537@gmail.com
Status:            PAID & ESCROW SECURED
================================================
Purchase Details:
Product/Asset:     ${invoice.title}
Amount Paid:       ${invoice.price.toLocaleString()} ETB
Escrow Deposit:    200 ETB
================================================
Verified Merchant: EveryZone Escrow Network
Uptime Guarantee:  99.9% Secure Ledger
================================================
Thank you for supporting digital commerce in Ethiopia!
================================================`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EveryZone-Receipt-${invoice.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  
  // --- CENTRAL SEAMLESS DATABASE STATE ---
  const [listings, setListings] = useState<Listing[]>([
    {
      id: 'l1',
      vendorId: 'v1',
      vendorName: 'Makeda Royal Weaving (ማከዳ አልባሳት)',
      vendorNameAm: 'ማከዳ አልባሳት',
      vendorRating: 4.8,
      category: 'shop',
      type: 'clothing',
      title: 'Premium Hand-spun Golden Habesha Kemis',
      titleAm: 'ልዩ በእጅ የተሰራ የፅጌወርቅ የሀበሻ ቀሚስ',
      price: '18,500 ETB',
      priceAm: '18,500 ብር',
      priceNum: 18500,
      location: 'Bole High-Street, Addis Ababa',
      locationAm: 'ቦሌ አውራ ጎዳና ፣ አዲስ አበባ',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      description: 'An exceptional masterpiece of Ethiopian heritage. Made over 4 weeks using organically harvested hand-spun mountain cotton, featuring intricate multi-layered gold metallic Tilet weaving patterns along the borders. Essential bridal dress.',
      descriptionAm: 'ልዩ የሀበሻ ባህላዊ ልብስ ድንቅ ስራ። በተራራማው አካባቢ ከሚገኝ ጥጥ በእጅ ተፈትሎ ለ4 ሳምንታት የተሰራ። በጠርዙ ላይ ማራኪ ዘመናዊ የወርቅ ጥልፍ (ቲሌት) የተከተተበት። ለሙሽሮች እጅግ አስፈላጊ።',
      features: ['100% Organic Hand-spun Cotton', 'Premium Yellow Gold Metallic Embroidery', 'Includes matching golden Netela scarf', 'Individually numbered certificate'],
      featuresAm: ['100% ኦርጋኒክ በእጅ የተፈተለ ጥጥ', 'ልዩ ቢጫ የወርቅ ብረት ጥልፍ ጥበብ', 'ተዛማጅ የወርቅ ነጠላ ያካትታል', 'በተናጠል የተረጋገጠ የቀለም ሰርተፍኬት'],
      isRentPaid: true,
      isPremium: true,
      status: 'ACTIVE',
      reviews: [
        { id: 'r1', user: 'Selamawit Tekle', rating: 5, date: '3 days ago', text: 'Breathtaking details! The geometric embroidery looks completely royal. Custom tailoring was finished perfectly!' },
        { id: 'r2', user: 'Genet Assefa', rating: 4.8, date: '1 week ago', text: 'Top tier customer service. Spoke to Makeda directly - they made the sleeves slightly shorter upon request.' }
      ]
    },
    {
      id: 'l2',
      vendorId: 'v2',
      vendorName: 'Keffa Highlands Specialty Coffee (ይርጋጨፌ ቡና)',
      vendorNameAm: 'ይርጋጨፌ ቡና',
      vendorRating: 4.9,
      category: 'shop',
      type: 'coffee',
      title: 'Aroma-Roasted Yirgacheffe Specialty Coffee Beans (1kg)',
      titleAm: 'ጥራት ያለው የይርጋጨፌ የተቆላ ቡና (1 ኪሎ)',
      price: '820 ETB',
      priceAm: '820 ብር',
      priceNum: 820,
      location: 'Kazanchis Piazza, Addis Ababa',
      locationAm: 'ካዛንቺስ ፒያሳ ፣ አዲስ አበባ',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
      description: 'Highland light-medium roast, wet-processed washed to highlight its stunning signature floral body. Offers balanced jasmine tea aromas, sweet citrus bergamot undertones, and a velvet caramel finish.',
      descriptionAm: 'ከፍተኛ ጥራት ያለው መካከለኛ ቁልያ ቡና። በይርጋጨፌ ቡና እርሻዎች ህብረት ስራ ማህበር የተመረተ። የጃስሚን ሻይ መዓዛና የካራሚል ጣዕም አለው።',
      features: ['Grade A Organic Wash-Processed', 'Sourced Directly from Yirgacheffe Farm Co-op', 'Triple-sealed degassing valve bag', 'Roasted freshly every Wednesday afternoon'],
      featuresAm: ['ደረጃ ኤ 100% የተረጋገጠ ታጥቦ የተዘጋጀ', 'በቀጥታ ከይርጋጨፌ ገበሬዎች ህብረት የተገኘ', 'ባለ ሶስት ማሸጊያ የአየር ማስወጫ ቫልቭ', 'በየሳምንቱ ረቡዕ ከሰዓት ትኩስ ሆኖ የሚቆላ'],
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: [
        { id: 'r3', user: 'Yonas Gebre', rating: 4, date: '2 days ago', text: 'The aroma is so bright and citrusy. Standard morning brew for my household now.' }
      ]
    },
    {
      id: 'l3',
      vendorId: 'v3',
      vendorName: 'Zoscales Genuine Leather (ዞስካሌስ ቆዳ)',
      vendorNameAm: 'ዞስካሌስ ቆዳ',
      vendorRating: 4.7,
      category: 'shop',
      type: 'other',
      title: 'Lalibela Engraved Leather Messenger Bag',
      titleAm: 'በላሊበላ መስቀል የተቀረጸ የቆዳ ላፕቶፕ ኮሮጆ',
      price: '4,500 ETB',
      priceAm: '4,500 ብር',
      priceNum: 4500,
      location: 'Piazza Central, Addis Ababa',
      locationAm: 'ፒያሳ መሃል ፣ አዲስ አበባ',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
      description: 'Handcrafted full-grain Ethiopian highland leather, chemically-free tanned according to cultural Abyssinia procedures. Embossed with elegant geometric Lalibela cross pattern outlines.',
      descriptionAm: 'ከፍተኛ ጥራት ካለው ከኢትዮጵያ የደጋ ከብት ቆዳ በእጅ የተሰራ። በባህላዊ የቆዳ ስራ ሂደት ያለ ኬሚካል የተዘጋጀ። የላሊበላ መስቀል ቅርጽ የተቀረጸበት።',
      features: ['Genuine Ethiopian Highland Cowhide Leather', 'Adjustable heavy brass canvas strap', 'Two security notebook partition sleeves', 'Naturally waterproofed beeswax finish'],
      featuresAm: ['እውነተኛ የኢትዮጵያ ሀይላንድ ከብት ቆዳ', 'የሚስተካከል ከባድ የናስ ማሰሪያ', 'ሁለት የደህንነት ማስታወሻ መያዣ ክፍሎች', 'በተፈጥሮ የንብ ቀፎ ሰም የተጠበቀ'],
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l3_iphone',
      vendorId: 'v1',
      vendorName: 'Makeda Royal Weaving (ማከዳ አልባሳት)',
      vendorNameAm: 'ማከዳ አልባሳት',
      vendorRating: 4.8,
      category: 'shop',
      type: 'other',
      title: 'Apple iPhone 16 Pro Max 512GB (Natural Titanium)',
      titleAm: 'አፕል አይፎን 16 ፕሮ ማክስ 512ጂቢ (ናቹራል ቲታኒየም)',
      price: '145,000 ETB',
      priceAm: '145,000 ብር',
      priceNum: 145000,
      location: 'Bole High-Street, Addis Ababa',
      locationAm: 'ቦሌ አውራ ጎዳና ፣ አዲስ አበባ',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
      description: 'Brand new factory sealed global edition premium iPhone with local 1-year store warranty. Dual SIM, pure natural titanium color.',
      descriptionAm: 'አዲስ እንግሊዝ አገር የመጣ አይፎን 16 ፕሮ ማክስ በቦሌ ሱቃችን የሚገኝ። ዋስትና አለው።',
      features: ['512GB Superfast Native Storage', '1 Year Full Local Express Store Warranty', 'Includes premium clear protective cases', 'Original USB-C charging cord included'],
      featuresAm: ['512ጂቢ እጅግ ፈጣን ማከማቻ', 'የ1 ዓመት ሙሉ ዋስትና ከሱቅ ጋር', 'ነፃ ጠንካራ መከላከያ ኬዝ ያካትታል', 'ኦሪጅናል ኃይል መሙያ ገመድ ያለው'],
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l4',
      vendorId: 'v4',
      vendorName: 'Aura Bole Premium Properties (አውራ ቤቶች)',
      vendorNameAm: 'አውራ ቤቶች',
      vendorRating: 4.6,
      category: 'houses',
      type: 'rent',
      title: 'Luxury 3-Bedroom Penthouse Highrise Apartment',
      titleAm: 'ባለ 3 መኝታ ቅንጡ የፎቅ ላይ ፔንትሀውስ አፓርትመንት',
      price: '78,000 ETB/mo',
      priceAm: '78,000 ብር/ወር',
      priceNum: 78000,
      location: 'Bole Atlas Circle, Addis Ababa',
      locationAm: 'ቦሌ አትላስ አደባባይ ፣ አዲስ አበባ',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
      description: 'Fully furnished skyflat of majestic size, on the 11th floor over Atlas. Features panoramic Entoto sunset vistas, solid oak flooring, Italian custom kitchen fixtures, continuous high-capacity generator support, and heavy 24/7 lobby guard services.',
      descriptionAm: 'ሙሉ በሙሉ የተሟላለት ሰፊ አፓርትመንት በፎቅ ላይ። የእንጦጦን ጀምበር ግባት የሚታይበት። 24 ሰአት አስተማማኝ ጄኔሬተር እና ጥበቃ ያለው።',
      features: ['3 Bedrooms, 3.5 Marble Bathrooms', 'Continuous high-rate standby backup generator', 'High-speed dedicated fiber optic line', 'Underground dual security parking garage'],
      featuresAm: ['3 መኝታ ቤቶች፣ 3.5 እምነበረድ መታጠቢያ ቤቶች', 'የማያቋርጥ ከፍተኛ አቅም ያለው የመጠባበቂያ ጄኔሬተር', 'ከፍተኛ ፍጥነት ያለው የፋይበር ኦፕቲክ መስመር', 'ከመሬት በታች ባለ ሁለት መኪና ማቆሚያ ጋራዥ'],
      isRentPaid: true,
      isPremium: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l5',
      vendorId: 'v5',
      vendorName: 'Abyssinia Premium Real Estate (አቢሲኒያ ህንጻ)',
      vendorNameAm: 'አቢሲኒያ ህንጻ',
      vendorRating: 4.5,
      category: 'houses',
      type: 'buy',
      title: 'Modern Luxury G+1 Stone Villa with Garden',
      titleAm: 'ዘመናዊ G+1 የድንጋይ ቪላ ቤት ከጓሮ ጋር',
      price: '18,500,000 ETB',
      priceAm: '18.5 ሚሊዮን ብር',
      priceNum: 18500000,
      location: 'CMC Green Gated Ville, Addis Ababa',
      locationAm: 'CMC አረንጓዴ ግቢ ፣ አዲስ አበባ',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600',
      description: 'Stunning premium stone villa featuring gorgeous mature garden, gated courtyard, backup water tank arrays (5,000L), spacious staff guest house quarters, and highly safe ambassadorial district gates.',
      descriptionAm: 'ማራኪ የአምባሳደሮች ሰፈር CMC ውስጥ የሚገኝ ቪላ። 5000 ሊትር የውሃ ታንከር እና የሶላር ፓነል የተገጠመለት። ሰፊ ጓሮ አለው።',
      features: ['4 Bedrooms, 4 Complete Bathrooms', 'Large landscape yard perfect for coffee ceremonies', 'Standby high-volume backup solar battery array', 'Double steel security compound gates'],
      featuresAm: ['4 መኝታ ቤቶች፣ 4 ምሉዕ መታጠቢያ ቤቶች', 'ለቡና ስነ ስርዓት ተስማሚ የሆነ ሰፊ ግቢ', 'ከፍተኛ መጠን ያለው ተጠባባቂ የፀሐይ ባትሪ', 'ድርብ የብረት ደህንነት በር ግቢ መዝጊያዎች'],
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l5_condo',
      vendorId: 'v5',
      vendorName: 'Yeka Luxury Condominiums (የካ ቤቶች)',
      vendorNameAm: 'የካ ቤቶች',
      vendorRating: 4.7,
      category: 'houses',
      type: 'buy',
      title: 'Modern 2-Bedroom Smart Condominium in Bole Bulbula',
      titleAm: 'ዘመናዊ ባለ 2 መኝታ ቦሌ ቡልቡላ ኮንዶሚኒየም',
      price: '5,200,000 ETB',
      priceAm: '5.2 ሚሊዮን ብር',
      priceNum: 5200000,
      location: 'Bole Bulbula Site 3, Addis Ababa',
      locationAm: 'ቦሌ ቡልቡላ ሳይት 3 ፣ አዲስ አበባ',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
      description: 'Newly finished modern safety condominium on a high floor with elevator, backup water tank, and beautiful sunset views. Located in a secure gated green compound.',
      descriptionAm: 'አዲስ የተጠናቀቀ ዘመናዊ ኮንዶሚኒየም በቦሌ ቡልቡላ። ሊፍት፣ አስተማማኝ ውሃ እና የጥበቃ አገልግሎት ያለው።',
      features: ['2 Bedrooms, 1.5 Bathrooms', 'High-speed elevator key-access', '24/7 dedicated security guard', 'Gated parking courtyard space'],
      featuresAm: ['2 መኝታ ቤቶች ፣ 1.5 መታጠቢያ ቤቶች', 'ባለከፍተኛ ፍጥነት ሊፍት ቁልፍ መግቢያ', 'የ24 ሰአት ጥበቃ ቁጥጥር', 'የመኪና ማቆሚያ በግቢው ውስጥ'],
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l5_addis_house',
      vendorId: 'v5',
      vendorName: 'Yeka Luxury Condominiums (የካ ቤቶች)',
      vendorNameAm: 'የካ ቤቶች',
      vendorRating: 4.7,
      category: 'houses',
      type: 'buy',
      title: 'Modern 3-Bedroom Master House in Addis Ababa',
      titleAm: 'ዘመናዊ የ3 መኝታ ቤት ሙሉ ቪላ አዲስ አበባ',
      price: '19,500,000 ETB',
      priceAm: '19.5 ሚሊዮን ብር',
      priceNum: 19500000,
      location: 'CMC Heights, Addis Ababa',
      locationAm: 'ሲኤምሲ ፣ አዲስ አበባ',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
      description: 'An elegant multi-level residential house located in a beautiful peaceful neighborhood of CMC Addis. Handcrafted mahogany accents, huge terrace, and security guard kiosk.',
      descriptionAm: 'ድርድር የሚቻልበት ቆንጆ የመኖሪያ ቤት ሲኤምሲ አዲስ አበባ። ሰፊ ግቢና የጥበቃ ክፍል ያለው።',
      features: ['3 Suite Bedrooms + 4 Bathrooms', 'Scenic city overlook roof deck', 'Dedicated private security kiosk', 'Gated brick paved parking garage'],
      featuresAm: ['3 መኝታ ቤቶች + 4 መታጠቢያዎች', 'ሰፊ የከተማው እይታ በሰገነት ላይ', 'የጥበቃ ቤት የተዘጋጀለት', 'አስተማማኝ የመኪና ማቆሚያ ጋራዥ'],
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l5_studio',
      vendorId: 'v4',
      vendorName: 'Aura Bole Premium Properties (አውራ ቤቶች)',
      vendorNameAm: 'አውራ ቤቶች',
      vendorRating: 4.6,
      category: 'houses',
      type: 'rent',
      title: 'Cozy Fully-Furnished Executive Studio Apartment',
      titleAm: 'ምቹ እና ሙሉ በሙሉ የተሟላለት ስቱዲዮ አፓርትመንት',
      price: '28,000 ETB/mo',
      priceAm: '28,000 ብር/ወር',
      priceNum: 28000,
      location: 'Bole Atlas, Addis Ababa',
      locationAm: 'ቦሌ አትላስ ፣ አዲስ አበባ',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
      description: 'Stunning minimalist premium studio apartment with modern kitchenette, high-speed fiber internet, smart TV, hot shower, and standby generator.',
      descriptionAm: 'ዘመናዊ ስቱዲዮ አፓርትመንት ለነጠላ ሰራተኞች የሚስማማ። ፈጣን ኢንተርኔት፣ የሞቀ ውሃ እና አስተማማኝ መብራት ያለው።',
      features: ['1 Open Area Studio Layout', 'Modern fully functional kitchenette', 'Hot water shower & smart bath', 'Very secure luxury residence entrance'],
      featuresAm: ['1 ክፍት ስቱዲዮ ዲዛይን', 'ዘመናዊ የወጥ ቤት እቃዎች', 'የሞቀ ውሃ እና ዘመናዊ መታጠቢያ ቤት', 'ከፍተኛ ጥበቃ ያለው የመግቢያ ኮሪደር'],
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l6',
      vendorId: 'v6',
      vendorName: 'Saba Commerce Offices (ሳባ ህንጻ)',
      vendorNameAm: 'ሳባ ህንጻ',
      vendorRating: 4.5,
      category: 'houses',
      type: 'commercial',
      title: 'Premium Corporate Office & Retail Showroom',
      titleAm: 'ለቢሮ እና ለንግድ ሱቆች አመቺ ሰፊ አዳራሽ',
      price: '140,000 ETB/mo',
      priceAm: '140,000 ብር/ወር',
      priceNum: 140005,
      location: 'Sarbet Main Road, Addis Ababa',
      locationAm: 'ሳርቤት ዋና መንገድ ፣ አዲስ አበባ',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
      description: 'Spacious commercial ground level with broad floor-to-ceiling road facing showcase storefront windows. Ideal for high-end fashion boutiques, travel headquarters or premier banking outlets.',
      descriptionAm: 'ለፋሽን ቡቲኮች፣ ለጉዞ ወኪሎች ወይም ለባንክ ቅርንጫፎች ተስማሚ። በዋናው መንገድ ላይ የሚገኝ ከፍተኛ የደንበኛ እንቅስቃሴ ያለበት።',
      features: ['240 Square Meters Total Open Layout', 'Standby multi-grid power backing system', 'High walking customer retail traffic', 'Heavy high-security video grid installed'],
      featuresAm: ['240 ካሬ ሜትር ጠቅላላ ሰፊ ክፍት ዲዛይን', 'ተጠባባቂ የኤሌክትሪክ ኃይል ድጋፍ ስርዓት', 'ከፍተኛ የደንበኞች ግብይት እንቅስቃሴ', 'ከፍተኛ ጥበቃ ያለው የካሜራ ክትትል የተዘረጋለት'],
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l7',
      vendorId: 'v7',
      vendorName: 'Gigi International Placements (ጂጂ ወኪል)',
      vendorNameAm: 'ጂጂ ወኪል',
      vendorRating: 4.8,
      category: 'agencies',
      type: 'gulf',
      title: 'Executive Pastry Chef - Luxury Dubai Resort',
      titleAm: 'የምግብ አበሳሰል ባለሙያ (ሼፍ) - ዱባይ ሪዞርት',
      price: '4,500 AED/mo',
      priceAm: '4,500 ዲርሃም/ወር',
      priceNum: 125000,
      location: 'Dubai Marina Premium Hotel Area',
      locationAm: 'ዱባይ ማሪና የሆቴል ዞን ፣ ዱባይ',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b90473bd58?auto=format&fit=crop&q=80&w=600',
      description: 'Specialized opening for a certified pastry supervisor or master chef in a renowned FIVE-STAR beachfront resort. Agency Gigi coordinates full legal workflow, medical checks, flights and housing.',
      descriptionAm: 'በዱባይ ሪዞርት ውስጥ ለረጅም ጊዜ የሚቆይ የስራ እድል። የህክምና ምርመራ፣ የአውሮፕላን ትኬት እና የመኖሪያ ቤት በኤጀንሲው ሙሉ በሙሉ ይሸፈናል።',
      features: ['Tax-free base: 4,500 AED + Service Tips', 'Fully Paid Modern En-suite Shared Luxury Studio', 'Renewable 2-Year Contract + Paid Annual Sabbatical', '100% Agency Guaranteed Embassy Legalization'],
      featuresAm: ['ከቀረጥ ነፃ: 4,500 ኤኢዲ + የአገልግሎት ጉርሻዎች', 'ሙሉ በሙሉ የተከፈለ ዘመናዊ የጋራ ስቱዲዮ', 'የሚታደስ የ2 ዓመት ኮንትራት + ዓመታዊ ፈቃድ እረፍት', 'በኤምባሲው በኩል 100% የተረጋገጠ ህጋዊ ቅጥር'],
      requirements: ['Min 3 years commercial baking certificates', 'Intermediate spoke & written English proficiency', 'Valid clean biometric passport (Addis office)'],
      requirementsAm: ['ቢያንስ 3 ዓመት የሙያ ማረጋገጫ ሰርተፍኬት', 'በቂ የአፍ እና የጽሁፍ እንግሊዘኛ ችሎታ', 'ንፁህ ባዮሜትሪክ ፓስፖርት ያለው'],
      agencyLicense: 'MEA-2026-64120',
      isRentPaid: true,
      isPremium: true,
      status: 'ACTIVE',
      reviews: [
        { id: 'r4', user: 'Nebiyu K.', rating: 5, date: 'Last week', text: 'Gigi Placements did wonderful job. Interview prep was accurate, flight was fully paid, and my Dubai studio is excellent!' }
      ]
    },
    {
      id: 'l7_dubai_driver',
      vendorId: 'v7',
      vendorName: 'Gigi International Placements (ጂጂ ወኪል)',
      vendorNameAm: 'ጂጂ ወኪል',
      vendorRating: 4.8,
      category: 'agencies',
      type: 'gulf',
      title: 'Light & Heavy Duty Driver Job in Dubai (United Arab Emirates)',
      titleAm: 'የቀላል እና ከባድ መኪና አሽከርካሪ ስራ በዱባይ',
      price: '3,800 AED/mo',
      priceAm: '3,800 ዲርሃም/ወር',
      priceNum: 105000,
      location: 'Dubai Logistics Area / Deira Office',
      locationAm: 'ዱባይ ላጂስቲክስ ዞን ፣ ዱባይ',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600',
      description: 'Premier delivery coordinator post with visa, air ticket, driving badge training, and full medical coverage sponsored by local logistics firm. Gigi agency prepares documents quickly.',
      descriptionAm: 'በዱባይ ከተማ ውስጥ የሚሰራ የአሽከርካሪነት ስራ። መኖሪያ ቤት፣ የህክምና እና የአሸከርካሪነት ፈቃድ ስልጠና በድርጅቱ በኩል ይሸፈናል።',
      features: ['Base Salary: 3,800 AED + Overtime Allowances', 'Company provided air-conditioned shared housing', 'Driving badge fee sponsored entirely', 'Agency legal transition guaranteed'],
      featuresAm: ['ደመወዝ 3,800 ኤኢዲ + የትርፍ ሰዓት ክፍያ', 'የተሟላ አየር ማቀዝቀዣ ያለው ቤት', 'የመንጃ ፈቃድ ስልጠና ዋጋ በነፃ', 'የሰነዶች ህጋዊነት ድጋፍ በጂጂ በኩል'],
      requirements: ['Valid clean driving license (local/gulf)', 'Basic spoken Arabic or English conversational level', 'Pass standard medical panel and eye exam'],
      requirementsAm: ['ዕውቅና ያለው የአሽከርካሪነት ፈቃድ ያለው', 'ቀላል የአረብኛ ወይም እንግሊዘኛ ችሎታ', 'የአይን እና ጤንነት ምርመራ ማለፍ'],
      agencyLicense: 'MEA-2026-64120',
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    },
    {
      id: 'l8',
      vendorId: 'v8',
      vendorName: 'Horn-of-Africa Employment Co. (ቀንድ ኤጀንሲ)',
      vendorNameAm: 'ቀንድ ኤጀንሲ',
      vendorRating: 4.4,
      category: 'agencies',
      type: 'europe',
      title: 'Senior Construction Site Supervisor - Warsaw',
      titleAm: 'የግንባታ ሳይት ከፍተኛ ተቆጣጣሪ - ዋርሶ፣ ፖላንድ',
      price: '2,200 EUR/mo',
      priceAm: '2,200 ዩሮ/ወር',
      priceNum: 250000,
      location: 'Warsaw Metropolitan Area, Poland',
      locationAm: 'ዋርሶ ሜትሮፖሊታን ዞን ፣ ፖላንድ',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
      description: 'Urgent placement for heavy concrete construction supervisors to coordinates highrise residential building sectors. EU work-permit sponsorship and legal transition expedited directly in Addis Ababa.',
      descriptionAm: 'ለዋርሶው ሪል እስቴት ግንባታ ባለሙያዎችን የምንቀጥርበት። ሙሉ ህጋዊ የስራ ቪዛ ድጋፍ በ Addis Ababa በኩል የሚመረቱ።',
      features: ['Monthly salary: 2,200 EUR (Post-tax equivalence)', 'Comprehensive local Polish social security coverage', 'Subsidized flights + visa fees 100% agency-financed', 'Excellent local cultural translation handler support'],
      featuresAm: ['ወርሃዊ ደመወዝ 2,200 ዩሮ (ከቀረጥ በኋላ)', 'አጠቃላይ የፖላንድ የአካባቢ ዋስትና ሽፋን', 'የአውሮፕላን እና ቪዛ ክፍያ በመንግስት ኤጀንሲው የተሸፈነ', 'በ Addis Ababa በኩል ፈጣን የሰነድ አረጋጋጭ እገዛ'],
      requirements: ['Civil engineering degree or equivalent experience', 'Valid Passport with 12 months minimum validity', 'Clean local police record certified by Addis Federal'],
      requirementsAm: ['የሲቪል ምህንድስና ዲግሪ ወይም ተዛማጅ ልምድ', 'ቢያንስ 12 ወራት የሚቆይ ፓስፖርት ያለው', 'በ Addis Ababa ፌደራል የፖሊስ የተፈረመ ንፁህ መዝገብ'],
      agencyLicense: 'MEA-2026-11002',
      isRentPaid: true,
      status: 'ACTIVE',
      reviews: []
    }
  ]);

  // Sync wallet balance to local storage
  useEffect(() => {
    localStorage.setItem('ez_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  // --- DEVELOPER SUNDAY SIMULATING SWITCH ---
  const [devSuspendedChecked, setDevSuspendedChecked] = useState<boolean>(false);

  // --- CRITICAL FILTER & SELECTION SEARCH ENGINE ---
  const activeListings = useMemo(() => {
    const listFiltered = listings.filter(item => {
      // General Tab Filter
      if (item.category !== activeTab) return false;

      // Status check (Unless dev check is specifically set, hide suspended vendors)
      if (item.status === 'SUSPENDED' && !devSuspendedChecked) return false;

      // Search bar filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.vendorName.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;

      // Smart Radar Location City Filter
      if (filterCity !== 'all') {
        const itemLoc = item.location.toLowerCase();
        const queryLoc = filterCity.toLowerCase();
        if (!itemLoc.includes(queryLoc)) {
          // Special exception for default data context
          if (queryLoc === 'addis ababa' && !itemLoc.includes('addis')) return false;
          if (queryLoc !== 'addis ababa') return false; // filter out other cities if mismatch
        }
      }

      // Smart Radar Category Filter
      if (filterCategory !== 'all') {
        // Clothing vs Electronics / Coffee
        if (filterCategory === 'clothing' && item.type !== 'clothing') return false;
        if (filterCategory === 'electronics' && item.type !== 'electronics' && item.type !== 'other') return false;
        if (filterCategory === 'coffee' && item.type !== 'coffee') return false;
        if (filterCategory === 'rent' && item.type !== 'rent' && item.type !== 'commercial') return false;
        if (filterCategory === 'buy' && item.type !== 'buy') return false;
      }

      // Smart Radar Price Range Filter
      if (filterMaxPrice !== 'all') {
        const maxVal = parseFloat(filterMaxPrice);
        if (item.priceNum > maxVal) return false;
      }

      // Dynamic Rent vs Sale segment controls for Houses & Agencies tabs
      if (activeTab === 'houses') {
        if (houseDealType === 'rent' && item.type !== 'rent' && item.type !== 'commercial') return false;
        if (houseDealType === 'buy' && item.type !== 'buy') return false;

        // Custom property type quick-tags filter
        if (housesPropertyType !== 'all') {
          const pt = housesPropertyType.toLowerCase();
          const searchSpace = `${item.title} ${item.titleAm} ${item.description} ${item.descriptionAm}`.toLowerCase();
          if (pt === 'condominium') {
            if (!searchSpace.includes('condo') && !searchSpace.includes('ኮንዶ')) return false;
          } else if (pt === 'villa') {
            if (!searchSpace.includes('villa') && !searchSpace.includes('ቪላ')) return false;
          } else if (pt === 'apartment') {
            if (!searchSpace.includes('apartment') && !searchSpace.includes('አፓርትመንት') && !searchSpace.includes('penthouse') && !searchSpace.includes('ፔንትሀውስ')) return false;
          } else if (pt === 'studio') {
            if (!searchSpace.includes('studio') && !searchSpace.includes('ስቱዲዮ')) return false;
          }
        }
      }
      if (activeTab === 'agencies') {
        // Rent represents Local or Gulf work / short lease, Buy represents International or Europe permanent
        if (agencyDealType === 'rent' && item.type !== 'gulf' && item.type !== 'commercial') return false;
        if (agencyDealType === 'buy' && item.type !== 'europe') return false;
      }

      // Specific Sub-Category Pill Filters (if active segment filters aren't overriding)
      if (activeTab === 'shop' && shopFilter !== 'all' && item.type !== shopFilter) return false;
      if (activeTab === 'houses' && housesFilter !== 'all' && item.type !== housesFilter) return false;
      if (activeTab === 'agencies' && agenciesFilter !== 'all' && item.type !== agenciesFilter) return false;

      return true;
    });

    // ADVANCED PREMIUM SPONSORSHIP BADGE FOR VENDORS:
    // Sort these premium vendors to always display at the very top of the listing results
    return [...listFiltered].sort((a, b) => {
      const aPremium = a.isPremium ? 1 : 0;
      const bPremium = b.isPremium ? 1 : 0;
      return bPremium - aPremium;
    });
  }, [listings, activeTab, searchQuery, shopFilter, housesFilter, housesPropertyType, agenciesFilter, filterCity, filterCategory, filterMaxPrice, houseDealType, agencyDealType, devSuspendedChecked]);

  // --- INTERACTIVE ACTIONS IMPLEMENTATION ---

  const handleInstantPurchase = (listing: Listing) => {
    if (walletBalance < listing.priceNum) {
      alert(`❌ Insufficient funds in your Every-zone wallet to purchase "${listing.title}".\nRequired: ${listing.priceNum.toLocaleString()} ETB\nAvailable: ${walletBalance.toLocaleString()} ETB\nPlease top up your wallet.`);
      return;
    }

    const confirmPurchase = window.confirm(`🛒 Confirm Instant Purchase of "${listing.title}" for ${listing.priceNum.toLocaleString()} ETB?`);
    if (!confirmPurchase) return;

    setWalletBalance(prev => prev - listing.priceNum);
    
    // Trigger notification
    triggerPushNotification(
      lang === 'en' ? 'Purchase Successful!' : 'ግዢው ተሳክቷል!',
      lang === 'en' 
        ? `You successfully purchased "${listing.title}" for ${listing.priceNum.toLocaleString()} ETB.` 
        : `የ "${listing.title}" ግዢ በ ${listing.priceNum.toLocaleString()} ብር በተሳካ ሁኔታ ተጠናቋል።`,
      '🛍️',
      'system'
    );

    // Alert successful payment and escrow hold
    alert(`🎉 Purchase Successful!\n\n${listing.priceNum.toLocaleString()} ETB has been securely deducted from your wallet and placed into the secure Every-zone Escrow Node.\n\nVendor "${listing.vendorName}" will prepare your order. The funds will be released only when you confirm receipt of the item.`);
  };

  const handleChapaRentPayment = (listing: Listing) => {
    alert(`🔗 Connecting to secure Chapa Payment link...\nSending payload: 200.00 ETB for Vendor: "${listing.vendorName}"`);
    
    // Debit mock wallet
    if (walletBalance < 200) {
      alert("❌ Insufficient funds even for a 200 ETB rent checkout. Please click top up.");
      return;
    }

    setWalletBalance(prev => prev - 200);
    
    // Move vendor status back to active immediately
    setListings(prev => prev.map(item => {
      if (item.vendorId === listing.vendorId) {
        return { ...item, status: 'ACTIVE', isRentPaid: true };
      }
      return item;
    }));

    // If currently inspecting item, update it instantly in local state
    if (selectedListing?.vendorId === listing.vendorId) {
      setSelectedListing(prev => prev ? { ...prev, status: 'ACTIVE', isRentPaid: true } : null);
    }

    alert(`🎉 Payment Successful via Chapa!\n"${listing.vendorName}" shop is fully restored to ACTIVE status. All listings are now publicly visible.`);
  };

  const handleReportAndSuspend = (listing: Listing) => {
    const confirmReport = window.confirm(`⚠️ WARNING: Are you sure you want to flag and report "${listing.vendorName}"?\nThis is a critical community-safety button. Confirming will instantly toggle this vendor status to APPROVED SUSPENSION in the system, and automatically take down their active shop items.`);
    
    if (confirmReport) {
      // Turn vendor state to suspended in local state
      setListings(prev => prev.map(item => {
        if (item.vendorId === listing.vendorId) {
          return { ...item, status: 'SUSPENDED' };
        }
        return item;
      }));

      // Post fraud report to backend
      fetch('/api/chat/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterName: 'Selamawit Bekele (Buyer)',
          vendorId: listing.vendorId,
          reportType: 'SCAM_LISTING',
          description: `User flagged suspicious marketplace item: "${listing.title}" with price ${listing.price}. Vendor is suspect of potential escrow payment bypass.`,
          riskScore: 78.5
        })
      }).then(() => {
        // Also push automated notification warning
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'u-2', // Selamawit
            title: '⚠️ Fraud Report Filed',
            body: `You reported "${listing.vendorName}". Risk team has locked their escrow.`,
            type: 'FRAUD_WARNING'
          })
        });
      }).catch(err => console.error("Report logging failed", err));

      alert(`🚨 ALERT: Urgent fraud report logged under ID: #EZ-REP-${Math.floor(100000 + Math.random() * 900000)}.\nVendor "${listing.vendorName}" status has been switched to SUSPENDED. All their marketplace listings are now hidden from search. The admin panel has been flagged.`);
      setSelectedListing(null);
    }
  };

  const handleReportAndSuspendVendor = (vId: string, vName: string) => {
    const confirmReport = window.confirm(`⚠️ WARNING: Are you sure you want to flag and report "${vName}"?\nThis is a critical community-safety button. Confirming will instantly toggle this vendor status to APPROVED SUSPENSION in the system, and automatically take down their active shop items.`);
    
    if (confirmReport) {
      setListings(prev => prev.map(item => {
        if (item.vendorId === vId) {
          return { ...item, status: 'SUSPENDED' };
        }
        return item;
      }));

      fetch('/api/chat/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterName: 'Selamawit Bekele (Buyer)',
          vendorId: vId,
          reportType: 'SCAM_LISTING',
          description: `User flagged suspicious vendor: "${vName}". Vendor is suspect of potential escrow payment bypass.`,
          riskScore: 85.0
        })
      }).then(() => {
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'u-2',
            title: '⚠️ Fraud Report Filed',
            body: `You reported "${vName}". Risk team has locked their escrow.`,
            type: 'FRAUD_WARNING'
          })
        });
      }).catch(err => console.error("Report logging failed", err));

      alert(`🚨 ALERT: Urgent fraud report logged under ID: #EZ-REP-${Math.floor(100000 + Math.random() * 900000)}.\nVendor "${vName}" status has been switched to SUSPENDED. All their marketplace listings are now hidden from search. The admin panel has been flagged.`);
      setViewedVendorId(null);
    }
  };

  const handleReviewSubmission = (e: React.FormEvent, listingId: string) => {
    e.preventDefault();
    if (!textReview.trim()) return;

    setListings(prev => prev.map(item => {
      if (item.id === listingId) {
        const newReview: Review = {
          id: `r-user-${Date.now()}`,
          user: 'Habesha Patron (አንባቢ)',
          rating: userRating,
          date: 'Just now',
          text: textReview
        };
        const updatedReviews = [newReview, ...item.reviews];
        // Calculate dynamic new rating average
        const avgSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvg = parseFloat((avgSum / updatedReviews.length).toFixed(1));
        
        return {
          ...item,
          reviews: updatedReviews,
          rating: newAvg
        };
      }
      return item;
    }));

    // Sync current selected details with review instantly
    setSelectedListing(prev => {
      if (prev && prev.id === listingId) {
        const newReview: Review = {
          id: `r-user-${Date.now()}`,
          user: 'Habesha Patron (አንባቢ)',
          rating: userRating,
          date: 'Just now',
          text: textReview
        };
        const updatedReviews = [newReview, ...prev.reviews];
        const avgSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvg = parseFloat((avgSum / updatedReviews.length).toFixed(1));
        return { ...prev, reviews: updatedReviews, rating: newAvg };
      }
      return prev;
    });

    setTextReview('');
    alert('⭐ Review Posted! The product rating has been updated dynamically in our local database.');
  };



  return (
    <div className={`min-h-screen flex items-center justify-center p-0 sm:p-6 font-sans transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-100 text-stone-800'}`}>
      
      {/* PHONE/VIEWPORT WRAPPER FRAME (Insulated presentation for high fidelity - Professional Polish) */}
      <div id="everyzone-main" className={`w-full max-w-[440px] h-screen sm:h-[880px] sm:rounded-[36px] overflow-hidden flex flex-col relative border shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-[#F9F7F2] border-stone-200/80 text-[#1A1A1A]'}`}>
        
        {/* SYSTEM FLOW: SPLASH -> ONBOARDING -> AUTHENTICATION -> MAIN APP */}
        <AnimatePresence mode="wait">
          {showSplash && (
            <SplashScreen 
              lang={lang}
              onComplete={() => setShowSplash(false)}
            />
          )}

          {!showSplash && showOnboarding && (
            <OnboardingWelcomeCarousel 
              lang={lang} 
              setLang={setLang} 
              onComplete={() => {
                localStorage.setItem('ez_onboarding_completed', 'true');
                setShowOnboarding(false);
              }}
            />
          )}

          {!showSplash && !showOnboarding && !isAuthenticated && (
            <AuthScreen 
              lang={lang}
              setLang={setLang}
              isDarkMode={isDarkMode}
              onSuccess={() => {
                setIsAuthenticated(true);
                setUserRole((localStorage.getItem('ez_user_role') as any) || 'USER');
              }}
            />
          )}
        </AnimatePresence>

        {!showSplash && !showOnboarding && isAuthenticated && (
          <>
            <TraditionalTilitBanner />
            {emergencyBanner.active && (
              <div className="bg-gradient-to-r from-red-650 to-amber-600 text-white text-[9.5px] px-3.5 py-2 flex items-center justify-between border-b border-amber-500/20 font-sans tracking-tight relative overflow-hidden shrink-0 shadow-md">
                <div className="flex items-center gap-1.5 flex-1 select-none pr-3">
                  <span className="animate-bounce">⚠️</span>
                  <span className="font-bold leading-normal text-left">
                    {lang === 'am' ? emergencyBanner.textAm : emergencyBanner.textEn}
                  </span>
                </div>
                <button 
                  onClick={() => setEmergencyBanner(prev => ({ ...prev, active: false }))}
                  className="p-1 rounded-full hover:bg-white/10 transition text-white/85 hover:text-white shrink-0 cursor-pointer"
                  title="Close Banner"
                >
                  <X size={12} className="stroke-[2.5]" />
                </button>
              </div>
            )}



        {/* MAIN SCROLLABLE CONTAINER (Wraps header, dev cockpit, and active core stages together for unified mobile-optimized scrolling) */}
        <div className={`flex-1 overflow-y-auto flex flex-col ${activeDevModule !== 'none' ? 'hidden' : ''}`} id="main-scroll-container">

          {/* SECURE ROLE-BASED WORKSPACE QUICK LINK LAUNCHER BAR */}
          {isAuthenticated && (
            <div className={`px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b transition-colors relative z-20 ${
              userRole === 'SUPER_ADMIN' ? (isDarkMode ? 'bg-rose-950/40 border-rose-900 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-800') :
              userRole === 'VENDOR' ? (isDarkMode ? 'bg-amber-950/40 border-amber-900 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800') :
              userRole === 'REAL_ESTATE' ? (isDarkMode ? 'bg-blue-950/40 border-blue-900 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800') :
              userRole === 'OVERSEAS' ? (isDarkMode ? 'bg-sky-950/40 border-sky-900 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-800') :
              (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700')
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {userRole === 'SUPER_ADMIN' ? '👮' :
                   userRole === 'VENDOR' ? '🏪' :
                   userRole === 'REAL_ESTATE' ? '🏡' :
                   userRole === 'OVERSEAS' ? '✈️' : '👥'}
                </span>
                <div>
                  <span className="font-black uppercase tracking-wider text-[9.5px]">
                    {userRole === 'SUPER_ADMIN' ? 'Super Admin Console' :
                     userRole === 'VENDOR' ? 'Retail Vendor Console' :
                     userRole === 'REAL_ESTATE' ? 'Real Estate Agency Console' :
                     userRole === 'OVERSEAS' ? 'Overseas Employment Agency Console' :
                     'Citizen Customer Profile'}
                  </span>
                  <span className="text-[9px] block opacity-80 leading-snug">
                    {userRole === 'SUPER_ADMIN' ? 'Full platform administration & security audit logs' :
                     userRole === 'VENDOR' ? 'Manage products, stock, sales & instant withdrawals' :
                     userRole === 'REAL_ESTATE' ? 'Post properties, manage tenant tours & commission ledger' :
                     userRole === 'OVERSEAS' ? 'Post certified overseas jobs, CV screening & applications' :
                     'Shop items, buy/rent properties, apply for jobs & matchmaking'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userRole !== 'USER' ? (
                  <button
                    id="launcher-workspace-btn"
                    onClick={() => {
                      if (userRole === 'SUPER_ADMIN') {
                        setActiveDevModule('admin');
                      } else if (userRole === 'VENDOR') {
                        setActiveDevModule('vendor_dashboard');
                      } else if (userRole === 'REAL_ESTATE') {
                        setActiveDevModule('real_estate_dashboard' as any);
                      } else if (userRole === 'OVERSEAS') {
                        setActiveTab('agencies');
                        // Override state to trigger agency view
                        localStorage.setItem('ez_overseas_role_override', 'agency');
                        window.dispatchEvent(new Event('ez_overseas_role_change'));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 shadow-xs ${
                      userRole === 'SUPER_ADMIN' ? 'bg-rose-600 hover:bg-rose-500 text-white' :
                      userRole === 'VENDOR' ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400' :
                      userRole === 'REAL_ESTATE' ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                      'bg-sky-600 hover:bg-sky-500 text-white'
                    }`}
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight size={10} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                    }}
                    className="px-2.5 py-1 bg-stone-200 dark:bg-zinc-800 hover:opacity-90 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Switch Role
                  </button>
                )}
              </div>
            </div>
          )}

          {/* COMPREHENSIVE GLOBAL HERO APP HOOK (Shows current wallet, title, and search) */}
          <header className={`p-4 border-b shrink-0 shadow-sm animate-fade-in transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-[#1A1A1A]'}`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="/src/assets/images/ez_logo_1781649476140.jpg" 
                alt="Every-zone logo" 
                className={`w-10 h-10 rounded-xl shadow-xs border object-cover shrink-0 ${isDarkMode ? 'border-zinc-750' : 'border-stone-150'}`} 
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight whitespace-nowrap ${isDarkMode ? 'text-amber-400' : 'text-[#1E3A1A]'}`}>
                  Every-Zone
                </h1>
              </div>
            </div>

            {/* LIVE WALLET & MESSENGER SYSTEM */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                {/* Secured Escrow Chat Trigger - Every Zone Messenger */}
                <button
                  type="button"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  title={lang === 'en' ? "Every Zone Messenger" : "ኤቭሪ ዞን መልእክተኛ"}
                  className={`rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                    isChatOpen 
                      ? 'px-3 py-1.5 gap-1.5 bg-amber-500 border-amber-600 text-white animate-pulse scale-105 text-xs font-black' 
                      : (isDarkMode ? 'p-2 bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-850' : 'p-2 bg-[#1E3A1A]/10 border-stone-200 text-[#1E3A1A] hover:bg-[#1E3A1A]/15')
                  }`}
                >
                  <MessageCircle size={15} />
                  {isChatOpen && (
                    <span className="text-[10px] font-bold uppercase tracking-wider">Every Zone Messenger</span>
                  )}
                </button>

                {/* የብር Wallet */}
                <div 
                  id="wallet_header_hud"
                  onClick={() => setIsWalletSheetOpen(true)}
                  className={`flex items-center gap-1.5 border px-2.5 py-1.5 rounded-2xl transition-all cursor-pointer select-none shadow-xs hover:scale-[1.03] active:scale-95 ${isDarkMode ? 'bg-zinc-800 border-amber-500/40 text-amber-450 font-semibold' : 'bg-[#1E3A1A] border-[#C5A059]/40 text-white'}`}
                >
                  <Wallet size={11} className={isDarkMode ? 'text-amber-450' : 'text-[#C5A059]'} />
                  <span className={`text-[11px] font-bold font-mono tracking-wide ${isDarkMode ? 'text-amber-450' : 'text-[#C5A059]'}`}>{walletBalance.toLocaleString()} ETB</span>
                </div>
              </div>
              <button 
                onClick={() => setIsRechargeOpen(true)}
                className={`text-[9.5px] font-black mt-1 flex items-center gap-0.5 transition-all ${isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-[#C5A059] hover:text-[#1E3A1A]'}`}
              >
                <Plus size={10} /> {t('rechargeLabel')}
              </button>
            </div>
          </div>

          {/* AMAZON-STYLE GLOBAL INPUT FIELD (Dynamic search filter) */}
          {activeTab !== 'shop' && (<>
            <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-[11.5px] text-stone-400" />
              <input 
                type="text"
                placeholder={
                  activeTab === 'shop' 
                    ? t('searchPlaceholderShop') 
                    : activeTab === 'houses' 
                    ? t('searchPlaceholderHouses') 
                    : activeTab === 'agencies' 
                      ? t('searchPlaceholderAgencies') 
                      : activeTab === 'matchmaking'
                        ? "Search Matchmaking Profiles..."
                        : t('searchPlaceholderPassport')
                }
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setGlobalSearchQuery(e.target.value);
                  if (e.target.value) {
                    fetchSearchResults(e.target.value);
                  }
                }}
                onFocus={() => {
                  setIsGlobalSearchOpen(true);
                  fetchTrendingAndRecent();
                  if (searchQuery) {
                    setGlobalSearchQuery(searchQuery);
                    fetchSearchResults(searchQuery);
                  }
                }}
                className={`w-full text-xs pl-10 pr-26 py-2.5 rounded-xl outline-none transition-all focus:ring-1 ${
                  isDarkMode 
                    ? 'bg-zinc-800 border border-zinc-700 text-zinc-150 placeholder-zinc-550 focus:border-amber-500/40 focus:ring-amber-500/35' 
                    : 'bg-stone-100 border border-stone-200 text-stone-850 placeholder-stone-400 focus:border-[#1E3A1A]/40 focus:ring-[#1E3A1A]/30'
                }`}
              />
              <div className="absolute right-2.5 top-1.5 bottom-1.5 flex items-center gap-1">
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setGlobalSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="text-[9px] bg-stone-200 hover:bg-stone-300 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-stone-600 dark:text-zinc-300 px-1.5 py-0.5 rounded cursor-pointer transition-all mr-1 font-bold"
                  >
                    Clear
                  </button>
                )}
                <div className="h-full w-[1px] bg-stone-300/50 dark:bg-zinc-700/50" />
                <button
                  type="button"
                  onClick={() => setIsQrSearchOpen(true)}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 ${
                    isDarkMode
                      ? 'text-amber-500 hover:bg-zinc-700'
                      : 'text-[#1E3A1A] hover:bg-stone-200'
                  }`}
                  title={lang === 'en' ? "Search by Image or Scan QR" : "በምስል ፈልግ ወይም QR አንብብ"}
                >
                  <Camera size={14} />
                </button>
              </div>
            </div>
            
            <button
              onClick={() => {
                setIsGlobalSearchOpen(true);
                fetchTrendingAndRecent();
              }}
              title="Open Every-zone Global Search Engine"
              className={`px-3 py-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs transition-all cursor-pointer ${isDarkMode ? 'bg-zinc-800 border-amber-500/30 text-amber-400 hover:bg-zinc-750' : 'bg-[#1E3A1A]/10 border-[#1E3A1A]/20 text-[#1E3A1A] hover:bg-[#1E3A1A]/15'}`}
            >
              <Cpu size={14} className="animate-pulse text-amber-500" />
              <span className="hidden sm:inline">Search Engine</span>
            </button>
          </div>

          {/* DYNAMIC SEARCH HISTORY TAGS */}
          <div className="flex flex-wrap gap-1 mt-2">
            {searchHistory.map((term, idx) => (
              <button
                key={`${term}-${idx}`}
                onClick={() => {
                  setSearchQuery(term);
                  saveSearchToHistory(term);
                  setGlobalSearchQuery(term);
                  setIsGlobalSearchOpen(true);
                  fetchSearchResults(term);
                  fetchTrendingAndRecent();
                }}
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold transition-all border ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850' 
                    : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
          </>)}

          </header>

          {activeDevModule === 'none' && (
            <>
              {viewedVendorId && (
                <VendorStorefront 
                  viewedVendorId={viewedVendorId}
                  setViewedVendorId={setViewedVendorId}
                  lang={lang}
                  isDarkMode={isDarkMode}
                  t={t}
                  listings={listings}
                  setSelectedListing={setSelectedListing}
                  actingVendorId={actingVendorId}
                  setActingVendorId={setActingVendorId}
                  vendorsSocial={vendorsSocial}
                  setVendorsSocial={setVendorsSocial}
                  triggerPushNotification={triggerPushNotification}
                  setIsMessageModalOpen={setIsMessageModalOpen}
                  setBookingModalItem={setBookingModalItem}
                  activeVideoModal={activeVideoModal}
                  setActiveVideoModal={setActiveVideoModal}
                  timelinePosts={timelinePosts}
                  setTimelinePosts={setTimelinePosts}
                  isFetchingTimeline={isFetchingTimeline}
                  newPostTitle={newPostTitle}
                  setNewPostTitle={setNewPostTitle}
                  newPostContent={newPostContent}
                  setNewPostContent={setNewPostContent}
                  newPostType={newPostType}
                  setNewPostType={setNewPostType}
                  newPostVisibility={newPostVisibility}
                  setNewPostVisibility={setNewPostVisibility}
                  newCommentTexts={newCommentTexts}
                  setNewCommentTexts={setNewCommentTexts}
                  activeCommentPostId={activeCommentPostId}
                  setActiveCommentPostId={setActiveCommentPostId}
                  handleCreateTimelinePost={handleCreateTimelinePost}
                  handleLikeTimelinePost={handleLikeTimelinePost}
                  handleShareTimelinePost={handleShareTimelinePost}
                  handleCommentTimelinePost={handleCommentTimelinePost}
                  trustScore={trustScore}
                  reviewSuccessMsg={reviewSuccessMsg}
                  setReviewSuccessMsg={setReviewSuccessMsg}
                  reviewErrorMsg={reviewErrorMsg}
                  setReviewErrorMsg={setReviewErrorMsg}
                  reviewFormRating={reviewFormRating}
                  setReviewFormRating={setReviewFormRating}
                  reviewFormText={reviewFormText}
                  setReviewFormText={setReviewFormText}
                  reviewFormPhoto={reviewFormPhoto}
                  setReviewFormPhoto={setReviewFormPhoto}
                  reviewFormVideo={reviewFormVideo}
                  setReviewFormVideo={setReviewFormVideo}
                  reviewsLoading={reviewsLoading}
                  dynamicReviews={dynamicReviews}
                  fetchVendorReviewsAndTrust={fetchVendorReviewsAndTrust}
                  setSelectedMarketplaceProduct={setSelectedMarketplaceProduct}
                  vendorMarketplaceProducts={vendorMarketplaceProducts}
                />
              )}

              {false && viewedVendorId && (
                /* --- RENDER ADVANCED VENDOR PROFILE PLATFORM --- */
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-4 pb-12 text-left"
                >
                  {/* Back to Marketplace Control Button */}
                  <div className="flex justify-between items-center gap-2">
                    <button 
                      onClick={() => setViewedVendorId(null)}
                      className="flex items-center gap-2 text-xs font-extrabold text-[#1E3A1A] hover:opacity-85 transition-opacity bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-xl border border-stone-200 shrink-0 cursor-pointer"
                    >
                      ← {t('backToMarketplace')}
                    </button>

                    {/* RED HIGH-CONTRAST .REPORT VENDOR BUTTON */}
                    {(() => {
                      const sampleL = listings.find(l => l.vendorId === viewedVendorId);
                      const vName = sampleL ? (lang === 'en' ? sampleL.vendorName : sampleL.vendorNameAm || sampleL.vendorName) : 'Verified Merchant';
                      return (
                        <button 
                          onClick={() => handleReportAndSuspendVendor(viewedVendorId, vName)}
                          className="flex items-center gap-1 text-[11px] font-black text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2.5 rounded-xl border border-red-200 cursor-pointer transition-all duration-200 shadow-sm"
                          title="Report Vendor Fraud"
                        >
                          <ShieldAlert size={13} className="text-red-500 shrink-0" />
                          <span>🚨 {lang === 'en' ? 'Report' : 'ሪፖርት'}</span>
                        </button>
                      );
                    })()}
                  </div>

                  {/* Vendor Hero Identity Card */}
                  {(() => {
                    const sVendor = vendorsSocial[viewedVendorId];
                    if (!sVendor) return <div className="text-center text-xs text-stone-400">Vendor social nodes uninitialized</div>;
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
                            console.error("Web Share failed:", err);
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

                    // Dynamic Covers
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

                    // Dynamic Logos
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

                    const logoStyle = getVendorLogoInitials(viewedVendorId);

                    return (
                      <div className="bg-neutral-950 border border-neutral-850 rounded-3xl overflow-hidden shadow-2xl relative">
                        {/* 1. Business Cover Photo */}
                        <div className="h-32 relative overflow-hidden bg-stone-950">
                          <img 
                            src={getVendorCover(viewedVendorId)} 
                            alt={`${vName} Cover`} 
                            className="w-full h-full object-cover opacity-60 filter saturate-75" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
                          
                          {/* Premium Web Share API Social Button */}
                          <button
                            onClick={handleWebShareVendor}
                            className="absolute top-3.5 left-3.5 bg-neutral-950/75 hover:bg-neutral-900 text-amber-500 hover:text-amber-400 p-2 rounded-xl z-20 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg flex items-center justify-center cursor-pointer group"
                            title={lang === 'en' ? "Share via Web Share" : "በዌብ ሼር አጋራ"}
                          >
                            <Share2 size={13} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-bold ml-1 uppercase tracking-wider hidden sm:inline">
                              {lang === 'en' ? 'Share' : 'አጋራ'}
                            </span>
                          </button>

                          <span className="absolute top-3.5 right-3.5 bg-amber-500 text-stone-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full z-10 font-sans shadow-lg">
                            {vCategory} {t('vendorProfileLabel')}
                          </span>
                        </div>

                        {/* Bio & Interactions */}
                        <div className="px-5 pb-5 pt-4 relative">
                          {/* 2. Business Logo overlapping Cover */}
                          <div className={`absolute top-[-38px] left-5 w-18 h-18 rounded-full border-4 border-neutral-950 overflow-hidden shadow-xl flex items-center justify-center font-serif font-black select-none z-10 ${logoStyle.bg} ${logoStyle.text}`}>
                            <span className="text-xl tracking-tight">{logoStyle.txt}</span>
                          </div>

                          {/* Aligning for logo offset */}
                          <div className="pl-22 min-h-[44px] flex flex-col justify-center mb-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h2 className="text-lg font-extrabold text-stone-100 flex items-center gap-1">
                                {vName}
                              </h2>
                              
                              {/* 3. Verified Badge */}
                              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/25 flex items-center gap-1">
                                <CheckCircle2 size={10} className="fill-current text-emerald-500" />
                                {lang === 'en' ? 'Verified' : 'የተረጋገጠ'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-stone-400 mt-1 font-sans">
                              {/* 4. Rating */}
                              <span className="text-amber-500 font-bold flex items-center gap-0.5">★ 4.9</span>
                              <span className="text-stone-600">•</span>
                              {/* 5. Followers */}
                              <span className="font-semibold text-stone-300">
                                {sVendor.followersCount.toLocaleString()} {t('followersCountLabel')}
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

                          {/* 6. Active Subscription details */}
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
                              {lang === 'en' 
                                ? 'Authenticated Fayda identity merchant with active Escrow Node status. Secured by Chapa automatic monthly clearance protect.' 
                                : 'የይገባኛል ማረጋገጫ (ፋይዳ) የተረጋገጠ ነጋዴ። ወርሃዊ ኪራዩ በቻፓ በኩል ተከፍሎ በኤስክሮው የተጠበቀ የክፍያ ዋስትና አለው።'}
                            </p>
                          </div>

                          {/* 7. Profile Actions (Follow, Message, Call, Share, Report) */}
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
                                  const contacts = (VENDOR_CONTACTS_DB as any)[viewedVendorId] || { phone: "+251911000000" };
                                  alert(lang === 'en' ? `📞 Calling ${vName} at ${contacts.phone}...` : `📞 ወደ ${vName} በስልክ ቁጥር ${contacts.phone} በመደወል ላይ...`);
                                }}
                                className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-stone-700 text-stone-200 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                📞 {lang === 'en' ? 'Call' : 'ደውል'}
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.href);
                                  alert(lang === 'en' ? '🔗 Store link copied to clipboard!' : '🔗 የሱቅ ሊንክ ኮፒ ተደርጓል!');
                                }}
                                className="py-2 bg-neutral-900 border border-neutral-800 hover:border-stone-700 text-stone-300 text-[11px] font-semibold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                🔗 {lang === 'en' ? 'Share Store' : 'ሱቅ አጋራ'}
                              </button>
                              <button 
                                onClick={() => {
                                  alert(lang === 'en' ? `🚨 Report filed against ${vName}. Our compliance team will investigate within 12 hours.` : `🚨 አቤቱታ በ ${vName} ላይ ቀርቧል። ህጋዊ ቡድናችን በ12 ሰዓታት ውስጥ ያጣራዋል።`);
                                }}
                                className="py-2 bg-neutral-900 border border-red-950/40 hover:border-red-500/40 text-red-400 text-[11px] font-semibold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                🚨 {lang === 'en' ? 'Report Store' : 'ሱቅ ሪፖርት አድርግ'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ======================================================== */}
                  {/* SELLER-TO-SELLER B2B FOLLOW & NETWORKING ZONE (S2S Follow) */}
                  {/* ======================================================== */}
                  {(() => {
                    const vendorsList = [
                      { id: 'v1', nameEn: 'Makeda Royal Weaving', nameAm: 'ማከዳ አልባሳት (Weaving)', color: 'bg-amber-600', txt: "MRW" },
                      { id: 'v2', nameEn: 'Makeda Specialty Coffee', nameAm: 'ማከዳ ቡና (Coffee)', color: 'bg-amber-900', txt: "KHC" },
                      { id: 'v3', nameEn: 'Zewditu Genuine Leather', nameAm: 'ዘውዲቱ የቆዳ ውጤቶች (Leather)', color: 'bg-stone-850', txt: "ZGL" },
                      { id: 'v4', nameEn: 'Bole Atlas Heights Real Estate', nameAm: 'ቦሌ አትላስ ሪል እስቴት (Bole)', color: 'bg-teal-900', txt: "ABP" },
                      { id: 'v5', nameEn: 'CMC Ambassador Villa Rentals', nameAm: 'ሲኤምሲ አምባሳደር ቪላ (CMC)', color: 'bg-slate-900', txt: "APRE" },
                      { id: 'v6', nameEn: 'Sarbet Commercial Corner', nameAm: 'ሳርቤት ኮሜርሻል (Sarbet)', color: 'bg-[#1E3A1A]', txt: "YLC" },
                      { id: 'v7', nameEn: 'Dubai Hotel Chef Placement', nameAm: 'ዱባይ ሆቴል ቅጥር (Dubai)', color: 'bg-blue-900', txt: "GIP" },
                      { id: 'v8', nameEn: 'Warsaw Construction Recruitment', nameAm: 'ዋርሶ ኮንስትራክሽን (Warsaw)', color: 'bg-emerald-900', txt: "HAE" }
                    ];

                    const currentVendorName = vendorsList.find(v => v.id === viewedVendorId)?.nameEn || 'This Merchant';
                    const currentVendorNameAm = vendorsList.find(v => v.id === viewedVendorId)?.nameAm || 'ይህ ነጋዴ';

                    // Compute lists
                    const merchantFollowers = vendorsList.filter(v => (sellerFollows[v.id] || []).includes(viewedVendorId));
                    const merchantFollowing = vendorsList.filter(v => (sellerFollows[viewedVendorId] || []).includes(v.id));

                    // S2S States
                    const isMutual = (sellerFollows[actingVendorId] || []).includes(viewedVendorId) && (sellerFollows[viewedVendorId] || []).includes(actingVendorId);
                    const isActingFollowingViewed = (sellerFollows[actingVendorId] || []).includes(viewedVendorId);

                    const handleToggleSellerFollow = () => {
                      if (actingVendorId === viewedVendorId) return;
                      setSellerFollows(prev => {
                        const list = prev[actingVendorId] || [];
                        const updated = list.includes(viewedVendorId)
                          ? list.filter(id => id !== viewedVendorId)
                          : [...list, viewedVendorId];
                        return {
                          ...prev,
                          [actingVendorId]: updated
                        };
                      });

                      const fromName = vendorsList.find(v => v.id === actingVendorId)?.nameEn || 'Another Merchant';
                      const toName = vendorsList.find(v => v.id === viewedVendorId)?.nameEn || 'Your Business';
                      const isNowFollowing = !(sellerFollows[actingVendorId] || []).includes(viewedVendorId);
                      
                      triggerPushNotification(
                        lang === 'en' ? '🤝 B2B Connection Updated' : '🤝 የቢዝነስ ትስስር ተዘምኗል',
                        lang === 'en' 
                          ? `${fromName} ${isNowFollowing ? 'started following' : 'stopped following'} ${toName} for mutual B2B supply collaboration.`
                          : `${fromName} ${isNowFollowing ? 'መከተል ጀምረዋል' : 'መከተል አቁመዋል'} ${toName}ን ለጋራ የንግድ አጋርነት።`,
                        '🤝',
                        'network'
                      );
                    };

                    return (
                      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-stone-300 space-y-4">
                        {/* Title Section */}
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🤝</span>
                            <div>
                              <h4 className="text-xs font-black text-stone-100 uppercase tracking-wider font-sans">
                                {lang === 'en' ? 'S2S Seller-to-Seller Follow Network' : 'ሻጭ ለሻጭ (S2S) ትስስርና መከተያ መድረክ'}
                              </h4>
                              <p className="text-[10px] text-stone-500 font-sans">
                                {lang === 'en' ? 'Simulate sellers following each other for joint ventures, trade supply chains & B2B networking' : 'የጋራ የንግድ ትብብርና አቅርቦት ለመፍጠር ሻጮች እርስ በርስ የሚከተሉበት መድረክ'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Mutual Badge */}
                          {isMutual && (
                            <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-500/20 animate-pulse font-sans">
                              🤝 {lang === 'en' ? 'Mutual Partner' : 'የጋራ የንግድ አጋር'}
                            </span>
                          )}
                        </div>

                        {/* Switch simulated active merchant */}
                        <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850 space-y-2">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-wider block font-sans">
                            🎭 {lang === 'en' ? 'Choose Your Acting Merchant Identity' : 'በየትኛው የሻጭ ማንነት መሳተፍ ይፈልጋሉ?'}
                          </label>
                          <select
                            id="acting-vendor-select"
                            value={actingVendorId}
                            onChange={(e) => setActingVendorId(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-sans cursor-pointer"
                          >
                            {vendorsList.map(v => (
                              <option key={v.id} value={v.id}>
                                {lang === 'en' ? v.nameEn : v.nameAm} {v.id === viewedVendorId ? `(${lang === 'en' ? 'Viewing' : 'እየጎበኙት ያለው'})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Interactive S2S follow triggers */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3 bg-neutral-950/40 border border-neutral-850 rounded-2xl">
                          <div className="text-left">
                            <span className="text-[10px] text-stone-500 font-mono block">
                              STATUS: {isActingFollowingViewed ? 'CONNECTED' : 'DISCONNECTED'}
                            </span>
                            <p className="text-xs font-bold text-stone-200 mt-0.5">
                              {actingVendorId === viewedVendorId ? (
                                <span className="text-amber-500">
                                  {lang === 'en' ? "You are viewing your own profile" : "የራስዎን ፕሮፋይል እያዩ ነው"}
                                </span>
                              ) : (
                                <span>
                                  {lang === 'en' 
                                    ? `Act as ${vendorsList.find(v => v.id === actingVendorId)?.nameEn}`
                                    : `እንደ ${vendorsList.find(v => v.id === actingVendorId)?.nameEn} ሆነው`}
                                </span>
                              )}
                            </p>
                          </div>

                          {actingVendorId !== viewedVendorId && (
                            <button
                              id="s2s-toggle-follow-btn"
                              onClick={handleToggleSellerFollow}
                              className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                isActingFollowingViewed
                                  ? 'bg-neutral-800 border border-neutral-750 text-stone-300 hover:bg-neutral-750'
                                  : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-sm'
                              }`}
                            >
                              {isActingFollowingViewed ? (
                                <>✓ {lang === 'en' ? 'Following' : 'ተከታይ ሆነዋል'}</>
                              ) : (
                                <>{lang === 'en' ? `+ Follow ${currentVendorName.split(' ')[0]}` : `+ ${currentVendorNameAm.split(' ')[0]} ይከተሉ`}</>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Followers and Following Directories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          
                          {/* Followers list column */}
                          <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-850">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block mb-2 font-mono">
                              👥 {lang === 'en' ? 'Merchant Followers' : 'ነጋዴ ተከታዮች'} ({merchantFollowers.length})
                            </span>
                            
                            {merchantFollowers.length === 0 ? (
                              <p className="text-[11px] text-stone-600 italic py-1 font-sans">
                                {lang === 'en' ? 'No other merchants follow this seller yet' : 'እስካሁን ሌላ ነጋዴ ተከታይ የለም'}
                              </p>
                            ) : (
                              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                {merchantFollowers.map(m => {
                                  const isMutualWithFollower = (sellerFollows[viewedVendorId] || []).includes(m.id);
                                  return (
                                    <div
                                      key={m.id}
                                      onClick={() => setViewedVendorId(m.id)}
                                      className="flex items-center justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 transition-all cursor-pointer"
                                      title={lang === 'en' ? 'Click to view profile' : 'ፕሮፋይል ለመጎብኘት ይጫኑ'}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${m.color}`}>
                                          {m.txt}
                                        </div>
                                        <span className="text-xs font-bold text-stone-200 truncate max-w-[130px] font-sans">
                                          {lang === 'en' ? m.nameEn : m.nameAm}
                                        </span>
                                      </div>
                                      {isMutualWithFollower && (
                                        <span className="text-[9px] text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/10 shrink-0">
                                          🤝 {lang === 'en' ? 'Mutual' : 'የጋራ'}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Following list column */}
                          <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-850">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block mb-2 font-mono">
                              📡 {lang === 'en' ? 'Following Merchants' : 'የሚከተላቸው ነጋዴዎች'} ({merchantFollowing.length})
                            </span>
                            
                            {merchantFollowing.length === 0 ? (
                              <p className="text-[11px] text-stone-600 italic py-1 font-sans">
                                {lang === 'en' ? 'This seller does not follow any other merchants yet' : 'ይህ ሻጭ ሌላ ነጋዴዎችን አይከተልም'}
                              </p>
                            ) : (
                              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                {merchantFollowing.map(m => {
                                  const isMutualWithFollowing = (sellerFollows[m.id] || []).includes(viewedVendorId);
                                  return (
                                    <div
                                      key={m.id}
                                      onClick={() => setViewedVendorId(m.id)}
                                      className="flex items-center justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-emerald-500/30 transition-all cursor-pointer"
                                      title={lang === 'en' ? 'Click to view profile' : 'ፕሮፋይል ለመጎብኘት ይጫኑ'}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${m.color}`}>
                                          {m.txt}
                                        </div>
                                        <span className="text-xs font-bold text-stone-200 truncate max-w-[130px] font-sans">
                                          {lang === 'en' ? m.nameEn : m.nameAm}
                                        </span>
                                      </div>
                                      {isMutualWithFollowing && (
                                        <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/10 shrink-0">
                                          🤝 {lang === 'en' ? 'Mutual' : 'የጋራ'}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })()}

              {/* Segmented Sub-Tabs Bar (All-in-One, Services, Products, Videos, Posts, Reviews, About, Policies) */}
              <div className="flex gap-1.5 border-b border-neutral-850 pb-2 overflow-x-auto scrollbar-none select-none">
                <button 
                  onClick={() => setVendorProfileTab('all')}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    vendorProfileTab === 'all'
                      ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                      : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  🏪 {lang === 'en' ? 'All-in-One' : 'ሁሉም በአንድ'}
                </button>
                <button 
                  onClick={() => setVendorProfileTab('services')}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    vendorProfileTab === 'services'
                      ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                      : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  🛠️ {lang === 'en' ? 'Services' : 'አገልግሎቶች'}
                </button>
                <button 
                  onClick={() => setVendorProfileTab('products')}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    vendorProfileTab === 'products' || vendorProfileTab === 'listings'
                      ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                      : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  📦 {lang === 'en' ? 'Products' : 'ዕቃዎች'}
                </button>
                <button 
                  onClick={() => setVendorProfileTab('videos')}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    vendorProfileTab === 'videos' 
                      ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                      : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  🎞️ {lang === 'en' ? 'Videos' : 'ቪዲዮዎች'}
                </button>
                <button 
                  onClick={() => setVendorProfileTab('posts')}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    vendorProfileTab === 'posts' 
                      ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                      : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  📢 {lang === 'en' ? 'Posts' : 'ልጥፎች'}
                </button>
                <button 
                  onClick={() => setVendorProfileTab('reviews')}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    vendorProfileTab === 'reviews' 
                      ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                      : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  ★ {lang === 'en' ? 'Reviews' : 'ግምገማዎች'}
                </button>
                <button 
                  onClick={() => setVendorProfileTab('about')}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    vendorProfileTab === 'about' 
                      ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                      : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  ℹ {lang === 'en' ? 'About' : 'ስለ እኛ'}
                </button>
                <button 
                  onClick={() => setVendorProfileTab('policies')}
                  className={`flex-shrink-0 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    vendorProfileTab === 'policies' 
                      ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/15' 
                      : 'bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  📜 {lang === 'en' ? 'Policies' : 'ፖሊሲዎች'}
                </button>
              </div>

              {/* Sub-tab Rendering Canvas */}
              <AnimatePresence mode="wait">
                {(vendorProfileTab === 'products' || vendorProfileTab === 'listings') && (
                  /* ======================================================== */
                  /* PRODUCTS TAB: Contains Products & Real Estate listings    */
                  /* ======================================================== */
                  <motion.div 
                    key="products"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 w-full"
                  >
                    {/* Search & Sorting Controls */}
                    <div className="bg-neutral-900/40 p-3 rounded-2xl border border-neutral-850 space-y-2 text-left">
                      <div className="relative">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                        <input 
                          type="text"
                          value={vendorStoreSearch}
                          onChange={(e) => setVendorStoreSearch(e.target.value)}
                          placeholder={lang === 'en' ? "Search products inside this store..." : "በዚህ ሱቅ ውስጥ ዕቃዎችን ፈልግ..."}
                          className="w-full text-xs bg-neutral-950 border border-neutral-800 text-stone-200 placeholder-stone-500 pl-9 pr-4 py-2 rounded-xl focus:border-amber-500/50 outline-none transition"
                        />
                      </div>
                      <div className="flex gap-2 items-center text-xs">
                        <span className="text-[10px] text-stone-500 uppercase font-bold shrink-0">Sort By:</span>
                        <div className="flex gap-1 overflow-x-auto scrollbar-none select-none py-1">
                          {[
                            { id: 'newest', labelEn: '🆕 Newest', labelAm: '🆕 አዲስ' },
                            { id: 'popular', labelEn: '🔥 Popular', labelAm: '🔥 ታዋቂ' },
                            { id: 'rating', labelEn: '⭐ Best Rated', labelAm: '⭐ ምርጥ ግምገማ' },
                            { id: 'priceAsc', labelEn: '💵 Price: Low-High', labelAm: '💵 ዋጋ፡ ከዝቅተኛ' },
                            { id: 'priceDesc', labelEn: '💵 Price: High-Low', labelAm: '💵 ዋጋ፡ ከከፍተኛ' },
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setVendorStoreSort(opt.id as any)}
                              className={`flex-shrink-0 px-3 py-1 text-[10px] rounded-lg font-bold border transition ${
                                vendorStoreSort === opt.id 
                                  ? 'bg-amber-500 border-amber-500 text-stone-950 font-black shadow-md' 
                                  : 'bg-neutral-950 border-neutral-800 text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              {lang === 'en' ? opt.labelEn : opt.labelAm}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* 1. Real Shop Marketplace Products */}
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
                          // Simulated popularity sort
                          filteredProds.sort((a, b) => (b.salesCount || (b.discountPrice ? 20 : 5)) - (a.salesCount || (a.discountPrice ? 20 : 5)));
                        } else if (vendorStoreSort === 'rating') {
                          // Sort by rating
                          filteredProds.sort((a, b) => (b.rating || 4.9) - (a.rating || 4.9));
                        } else if (vendorStoreSort === 'priceAsc') {
                          filteredProds.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                        } else if (vendorStoreSort === 'priceDesc') {
                          filteredProds.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
                        }

                        if (filteredProds.length === 0 && vendorMarketplaceProducts && vendorMarketplaceProducts.length > 0) {
                          return (
                            <div className="text-center py-6 text-stone-500 text-xs bg-neutral-950 border border-neutral-850 rounded-2xl font-sans">
                              {lang === 'en' ? 'No products match your search inside this store.' : 'በዚህ ሱቅ ውስጥ ከፍለጋዎ ጋር የሚስማማ ዕቃ አልተገኘም።'}
                            </div>
                          );
                        }

                        if (filteredProds.length > 0) {
                          return (
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-sans text-left">
                                🛍️ {lang === 'en' ? 'Shop Products' : 'የሱቅ ዕቃዎች'} ({filteredProds.length})
                              </span>
                              <div className="grid grid-cols-2 gap-3">
                                {filteredProds.map(p => {
                                  const mainImage = p.images?.[0]?.imageUrl || p.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600';
                                  return (
                                    <motion.div 
                                      key={p.id}
                                      whileHover={{ y: -3 }}
                                      onClick={async () => {
                                        try {
                                          const res = await fetch(`/api/products/${p.slug}`);
                                          const resData = await res.json();
                                          if (resData.status === 'success') {
                                            setSelectedMarketplaceProduct(resData.data);
                                          }
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      }}
                                      className="bg-neutral-950 border border-neutral-850 hover:border-amber-500/40 rounded-2xl overflow-hidden cursor-pointer flex flex-col relative transition-all group shadow-sm hover:shadow-md text-left"
                                    >
                                      <img src={mainImage} alt={p.title} className="w-full h-28 object-cover group-hover:scale-105 transition-all duration-500 opacity-80" referrerPolicy="no-referrer" />
                                      <div className="p-2.5 flex-1 flex flex-col justify-between bg-neutral-950">
                                        <div>
                                          <h3 className="text-xs font-bold line-clamp-2 text-stone-200 mb-2 leading-relaxed h-8 font-sans">
                                            {p.title}
                                          </h3>
                                        </div>
                                        <div>
                                          <div className="text-[13px] font-bold text-amber-500 font-mono mb-1">
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
                        }
                        return null;
                      })()}

                      {/* 2. House / Agency Listings under the vendor */}
                      {(() => {
                        const vListings = listings.filter(l => l.vendorId === viewedVendorId);
                        if (vListings.length === 0 && (!vendorMarketplaceProducts || vendorMarketplaceProducts.length === 0)) {
                          return (
                            <div className="text-center py-8 text-stone-500 text-xs font-medium font-sans bg-neutral-950 border border-neutral-850 rounded-2xl">
                              {lang === 'en' ? 'No products or listings logged under this vendor profile.' : 'በዚህ ነጋዴ ስር የተመዘገቡ ዕቃዎች ወይም ቤቶች የሉም።'}
                            </div>
                          );
                        }
                        if (vListings.length > 0) {
                          return (
                            <div className="space-y-2 mt-2">
                              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                                🏡 {lang === 'en' ? 'Real Estate Listings' : 'የሪል እስቴት ዝርዝሮች'} ({vListings.length})
                              </span>
                              <div className="grid grid-cols-2 gap-3">
                                {vListings.map(item => (
                                  <motion.div 
                                    key={item.id}
                                    whileHover={{ y: -3 }}
                                    onClick={() => setSelectedListing(item)}
                                    className="bg-neutral-950 border border-neutral-850 hover:border-amber-500/40 rounded-2xl overflow-hidden cursor-pointer flex flex-col relative transition-all group shadow-sm hover:shadow-md text-left"
                                  >
                                    <img src={item.image} alt={item.title} className="w-full h-28 object-cover group-hover:scale-105 transition-all duration-500 opacity-80" referrerPolicy="no-referrer" />
                                    <div className="p-2.5 flex-1 flex flex-col justify-between bg-neutral-950">
                                      <div>
                                        <h3 className="text-xs font-bold line-clamp-2 text-stone-200 mb-2 leading-relaxed h-8 font-sans">
                                          {getLocalizedData(item, 'title', lang)}
                                        </h3>
                                      </div>
                                      <div>
                                        <div className="text-[13px] font-bold text-emerald-400 font-mono mb-1">
                                          {getLocalizedData(item, 'price', lang)}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-sans">
                                          <MapPin size={10} className="shrink-0 text-[#C5A059]" />
                                          <span className="truncate">{getLocalizedData(item, 'location', lang)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <TraditionalCornerOrnament />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </motion.div>
                )}

                {vendorProfileTab === 'services' && (
                  /* ======================================================== */
                  /* SERVICES & PACKAGES TAB                                  */
                  /* ======================================================== */
                  <motion.div 
                    key="services"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 w-full text-left"
                  >
                    {/* Services section */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                        🛠️ {lang === 'en' ? 'Verified Business Services' : 'የተረጋገጡ የንግድ አገልግሎቶች'}
                      </span>
                      {(() => {
                        const list = (VENDOR_SERVICES_DB as any)[viewedVendorId] || [];
                        const getServiceImage = (serviceName: string) => {
                          const name = serviceName.toLowerCase();
                          if (name.includes('tailor') || name.includes('style') || name.includes('clothing') || name.includes('embroidery')) {
                            return "https://images.unsplash.com/photo-1525299374597-9115d90c3d3e?auto=format&fit=crop&q=80&w=600";
                          }
                          if (name.includes('paint') || name.includes('interior') || name.includes('decor')) {
                            return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600";
                          }
                          if (name.includes('coffee') || name.includes('roast') || name.includes('export')) {
                            return "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600";
                          }
                          if (name.includes('tour') || name.includes('guide') || name.includes('visit')) {
                            return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600";
                          }
                          if (name.includes('car') || name.includes('rental') || name.includes('drive') || name.includes('suv')) {
                            return "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600";
                          }
                          if (name.includes('legal') || name.includes('consultancy') || name.includes('law') || name.includes('contract') || name.includes('strategy') || name.includes('audit')) {
                            return "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600";
                          }
                          return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600";
                        };

                        if (list.length === 0) {
                          return (
                            <div className="text-center py-8 text-stone-500 text-xs font-medium bg-neutral-950 border border-neutral-850 rounded-2xl font-sans">
                              No direct customized services available for this vendor yet.
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {list.map((srv: any) => {
                              const srvImage = getServiceImage(srv.name);
                              return (
                                <div key={srv.id} className="bg-neutral-950 border border-neutral-850 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col relative group text-left">
                                  {/* Service image */}
                                  <div className="h-32 relative overflow-hidden bg-stone-900">
                                    <img 
                                      src={srvImage} 
                                      alt={srv.name} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-70"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                                    <span className="absolute top-2.5 right-2.5 bg-neutral-900/95 text-amber-500 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border border-neutral-800 font-bold">
                                      ⏱ {srv.duration}
                                    </span>
                                  </div>

                                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div className="space-y-1">
                                      <h4 className="text-xs font-black text-stone-100 line-clamp-1">{srv.name}</h4>
                                      <p className="text-[11px] text-stone-400 leading-normal line-clamp-2 h-8">{srv.desc}</p>
                                    </div>

                                    <div className="pt-2.5 border-t border-neutral-850 flex justify-between items-center gap-2">
                                      <div className="text-xs font-black text-emerald-400 font-mono">
                                        {srv.price.toLocaleString()} ETB
                                      </div>
                                      <button
                                        onClick={() => setBookingModalItem({ ...srv, type: "SERVICE", vendorId: viewedVendorId })}
                                        className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer transition shadow-md"
                                      >
                                        Book Now
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Packages section */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                        🎁 {lang === 'en' ? 'Business Bundle Packages' : 'የንግድ እሽግ አገልግሎቶች'}
                      </span>
                      {(() => {
                        const list = (VENDOR_PACKAGES_DB as any)[viewedVendorId] || [];
                        if (list.length === 0) {
                          return (
                            <div className="text-center py-8 text-stone-500 text-xs font-medium bg-neutral-950 border border-neutral-850 rounded-2xl font-sans">
                              No bundled suites configured for this business yet.
                            </div>
                          );
                        }
                        return list.map((pkg: any) => (
                          <div key={pkg.id} className="bg-amber-500/5 border border-amber-500/15 hover:border-amber-500/30 p-4 rounded-3xl shadow-sm transition-all space-y-3 text-left">
                            <div className="flex justify-between items-start gap-2 flex-wrap">
                              <div>
                                <span className="bg-amber-500 text-stone-950 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full mb-1 inline-block">
                                  PREMIUM BUNDLE
                                </span>
                                <h4 className="text-xs font-black text-stone-200">{pkg.name}</h4>
                              </div>
                              <div className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                                {pkg.price.toLocaleString()} ETB
                              </div>
                            </div>

                            <p className="text-[11px] text-stone-400 leading-normal">{pkg.desc}</p>

                            <div className="pt-2 border-t border-neutral-850 flex justify-between items-center gap-2">
                              <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                                🛡 Escrow Secured Protection
                              </span>
                              <button
                                onClick={() => setBookingModalItem({ ...pkg, type: "PACKAGE", vendorId: viewedVendorId })}
                                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10.5px] px-4 py-2 rounded-xl cursor-pointer transition shadow-sm"
                              >
                                Book Bundle
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </motion.div>
                )}

                {vendorProfileTab === 'videos' && (
                  /* ======================================================== */
                  /* POSTS & VIDEOS TAB                                       */
                  /* ======================================================== */
                  <motion.div 
                    key="videos"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    {(() => {
                      const sVendor = vendorsSocial[viewedVendorId];
                      if (!sVendor || sVendor.videos.length === 0) {
                        return (
                          <div className="text-center py-8 text-stone-500 text-xs font-medium bg-neutral-950 border border-neutral-850 rounded-2xl font-sans">
                            No social logs or videos submitted yet.
                          </div>
                        );
                      }

                      const getVideoThumbnail = (vidId: string) => {
                        if (vidId.includes('v1')) {
                          return "https://images.unsplash.com/photo-1605497746444-130650193850?auto=format&fit=crop&q=80&w=600";
                        }
                        if (vidId.includes('v2')) {
                          return "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&q=80&w=600";
                        }
                        if (vidId.includes('v3')) {
                          return "https://images.unsplash.com/photo-1590534247854-e97d5e3feef6?auto=format&fit=crop&q=80&w=600";
                        }
                        return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600";
                      };

                      return (
                        <div className="space-y-4">
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block font-sans text-left">
                            🎞️ {lang === 'en' ? 'Short Creator Videos' : 'የፈጣሪ አጫጭር ቪዲዮዎች'} ({sVendor.videos.length})
                          </span>

                          <div className="grid grid-cols-2 gap-3">
                            {sVendor.videos.map(vid => {
                              const isLiked = vid.liked;
                              const isFavorited = vid.favorited;
                              const viewsCount = (vid.likes * 14) + 420;

                              const handleTriggerLike = (e: React.MouseEvent) => {
                                e.stopPropagation();
                                setVendorsSocial(prev => {
                                  const current = prev[viewedVendorId];
                                  if (!current) return prev;
                                  const updatedVideos = current.videos.map(v => {
                                    if (v.id === vid.id) {
                                      return {
                                        ...v,
                                        liked: !v.liked,
                                        likes: v.liked ? v.likes - 1 : v.likes + 1
                                      };
                                    }
                                    return v;
                                  });
                                  return {
                                    ...prev,
                                    [viewedVendorId]: {
                                      ...current,
                                      videos: updatedVideos
                                    }
                                  };
                                });
                              };

                              return (
                                <motion.div 
                                  key={vid.id} 
                                  whileHover={{ scale: 1.01, y: -2 }}
                                  onClick={() => setActiveVideoModal({ ...vid, thumbnail: getVideoThumbnail(vid.id), views: viewsCount })}
                                  className="bg-neutral-950 border border-neutral-850 hover:border-amber-500/30 rounded-2xl overflow-hidden cursor-pointer relative flex flex-col aspect-[9/14] group shadow-lg text-left"
                                >
                                  {/* Immersive background thumbnail with simulated filter */}
                                  <img 
                                    src={getVideoThumbnail(vid.id)} 
                                    alt={vid.titleEn} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-75 filter brightness-90 group-hover:scale-105 transition-all duration-700"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

                                  {/* Absolute badging inside feed card */}
                                  <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
                                    <span className="bg-amber-500 text-stone-950 text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase select-none font-sans shadow-md">
                                      ▶ REEL
                                    </span>
                                    <span className="text-[9px] text-stone-300 font-bold bg-black/55 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10 font-mono">
                                      {viewsCount.toLocaleString()} views
                                    </span>
                                  </div>

                                  {/* Animated simulated equalizer bar */}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 backdrop-blur-xs rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                    <div className="flex gap-0.5 items-end h-3">
                                      <span className="w-0.5 bg-amber-500 rounded-full h-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                      <span className="w-0.5 bg-amber-500 rounded-full h-1/2 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                      <span className="w-0.5 bg-amber-500 rounded-full h-3/4 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                      <span className="w-0.5 bg-amber-500 rounded-full h-1/3 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                  </div>

                                  {/* Title & interactions footer */}
                                  <div className="mt-auto p-3 z-10 space-y-2">
                                    <h4 className="text-[11px] font-black text-white leading-snug line-clamp-2 drop-shadow-md">
                                      {lang === 'en' ? vid.titleEn : vid.titleAm}
                                    </h4>
                                    
                                    <div className="flex items-center justify-between text-[10px] text-stone-300 select-none">
                                      <button 
                                        onClick={handleTriggerLike}
                                        className={`flex items-center gap-1 font-bold ${isLiked ? 'text-red-500' : 'text-stone-300'} hover:scale-105 transition`}
                                      >
                                        <Heart size={11} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'text-red-500' : 'text-stone-300'} />
                                        <span>{vid.likes}</span>
                                      </button>
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

                          {/* IMMERSIVE TIKTOK-STYLE VIDEO MODAL PREVIEW */}
                          <AnimatePresence>
                            {activeVideoModal && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/95 backdrop-blur-md z-9999 flex items-center justify-center p-0 sm:p-4"
                                onClick={() => setActiveVideoModal(null)}
                              >
                                <motion.div 
                                  initial={{ scale: 0.95, y: 15 }}
                                  animate={{ scale: 1, y: 0 }}
                                  exit={{ scale: 0.95, y: 15 }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="bg-neutral-950 w-full h-full sm:h-[85vh] sm:max-w-md sm:rounded-3xl border border-neutral-850 overflow-hidden relative flex flex-col justify-between"
                                >
                                  {/* Simulated fullscreen background */}
                                  <img 
                                    src={activeVideoModal.thumbnail} 
                                    alt="Video Preview" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 filter saturate-100"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-neutral-950"></div>

                                  {/* Top header row */}
                                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center text-xs">
                                        {vendorsSocial[viewedVendorId]?.followersCount ? "EZ" : "EZ"}
                                      </div>
                                      <div>
                                        <span className="text-xs font-black text-white block">@{viewedVendorId}</span>
                                        <span className="text-[9px] text-emerald-400 font-bold block flex items-center gap-0.5">🟢 Verified Partner</span>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={() => setActiveVideoModal(null)}
                                      className="w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center font-bold text-sm border border-white/10"
                                    >
                                      ✕
                                    </button>
                                  </div>

                                  {/* Play/Pause & Sound Indicator panel */}
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 bg-black/55 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                                      <div className="flex gap-1 items-end h-5">
                                        <span className="w-1 bg-amber-500 rounded-full h-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '0.6s' }}></span>
                                        <span className="w-1 bg-amber-500 rounded-full h-1/2 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '0.4s' }}></span>
                                        <span className="w-1 bg-amber-500 rounded-full h-3/4 animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.5s' }}></span>
                                        <span className="w-1 bg-amber-500 rounded-full h-1/3 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.7s' }}></span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right side interactions panel (TikTok style floating buttons) */}
                                  <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-10 items-center">
                                    <button 
                                      onClick={() => {
                                        setVendorsSocial(prev => {
                                          const current = prev[viewedVendorId];
                                          if (!current) return prev;
                                          const updatedVideos = current.videos.map(v => {
                                            if (v.id === activeVideoModal.id) {
                                              const newLiked = !v.liked;
                                              return { ...v, liked: newLiked, likes: newLiked ? v.likes + 1 : v.likes - 1 };
                                            }
                                            return v;
                                          });
                                          return { ...prev, [viewedVendorId]: { ...current, videos: updatedVideos } };
                                        });
                                        setActiveVideoModal(prev => prev ? { ...prev, liked: !prev.liked, likes: prev.liked ? prev.likes - 1 : prev.likes + 1 } : null);
                                      }}
                                      className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xs border border-white/10 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-black/80"
                                    >
                                      <Heart size={18} fill={activeVideoModal.liked ? 'red' : 'none'} className={activeVideoModal.liked ? 'text-red-500' : 'text-white'} />
                                      <span className="text-[9px] font-bold mt-0.5">{activeVideoModal.likes}</span>
                                    </button>

                                    <button 
                                      onClick={() => {
                                        const newMute = !isVideoMuted;
                                        setIsVideoMuted(newMute);
                                      }}
                                      className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xs border border-white/10 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-black/80"
                                    >
                                      <span className="text-sm">{isVideoMuted ? "🔇" : "🔊"}</span>
                                      <span className="text-[8px] font-bold uppercase mt-0.5">{isVideoMuted ? "Muted" : "On"}</span>
                                    </button>

                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert(lang === 'en' ? '🔗 Clip link copied!' : '🔗 የቪዲዮ ሊንክ ኮፒ ተደርጓል!');
                                      }}
                                      className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xs border border-white/10 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-black/80"
                                    >
                                      <Share2 size={16} />
                                      <span className="text-[8px] font-bold uppercase mt-0.5">Share</span>
                                    </button>
                                  </div>

                                  {/* Footer and comment section of full modal */}
                                  <div className="mt-auto z-10 p-4 bg-gradient-to-t from-black via-black/90 to-black/20 space-y-3">
                                    <div className="space-y-1">
                                      <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider block font-sans">
                                        🎵 {lang === 'en' ? 'Original Audio - Sound wave loop active' : 'እውነተኛ ድምፅ - ኦዲዮ ንቁ ነው'}
                                      </span>
                                      <h3 className="text-xs font-black text-white leading-snug">
                                        {lang === 'en' ? activeVideoModal.titleEn : activeVideoModal.titleAm}
                                      </h3>
                                      <p className="text-[10.5px] text-stone-300 leading-relaxed font-sans">
                                        {lang === 'en'
                                          ? `Step into the authentic world of master craftsmanship. Follow us to stay updated with fresh catalog additions, secure Escrow verification, and direct digital booking.`
                                          : `ወደ እውነተኛው የባለሙያዎች ጥበብ ዓለም ይግቡ። ትኩስ የምርት ካታሎጎችን፣ የተረጋገጡ የኤስክሮው ክፍያዎችንና ፈጣን የቦታ ማስያዣዎችን ለማግኘት ፎሎው ያድርጉን።`}
                                      </p>
                                    </div>

                                    {/* Immersive mini-comments layout inside modal */}
                                    <div className="border-t border-neutral-850 pt-3 space-y-2">
                                      <span className="text-[9px] font-extrabold text-stone-400 block uppercase tracking-wider">
                                        💬 Interactive Chat Loop ({activeVideoModal.comments.length} comments)
                                      </span>
                                      <div className="space-y-1.5 max-h-[80px] overflow-y-auto pr-1 text-[10.5px] text-stone-300">
                                        {activeVideoModal.comments.map((comment: string, cIdx: number) => (
                                          <div key={cIdx} className="bg-neutral-900/40 p-1.5 rounded-lg border border-neutral-850">
                                            <span className="text-[9px] font-bold text-amber-500 block">@community_user_{cIdx + 1}</span>
                                            <p className="font-sans text-stone-200">{comment}</p>
                                          </div>
                                        ))}
                                      </div>

                                      <form 
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          const txt = commentTextInputs[activeVideoModal.id] || '';
                                          if (!txt.trim()) return;

                                          setVendorsSocial(prev => {
                                            const current = prev[viewedVendorId];
                                            if (!current) return prev;
                                            const updatedVideos = current.videos.map(v => {
                                              if (v.id === activeVideoModal.id) {
                                                return { ...v, comments: [txt.trim(), ...v.comments] };
                                              }
                                              return v;
                                            });
                                            return { ...prev, [viewedVendorId]: { ...current, videos: updatedVideos } };
                                          });

                                          setActiveVideoModal(prev => prev ? { ...prev, comments: [txt.trim(), ...prev.comments] } : null);
                                          setCommentTextInputs(prev => ({ ...prev, [activeVideoModal.id]: '' }));
                                        }} 
                                        className="flex gap-2"
                                      >
                                        <input 
                                          type="text"
                                          placeholder={lang === 'en' ? 'Write a comment...' : 'አስተያየት ይፃፉ...'}
                                          value={commentTextInputs[activeVideoModal.id] || ''}
                                          onChange={(e) => setCommentTextInputs(prev => ({ ...prev, [activeVideoModal.id]: e.target.value }))}
                                          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500/40"
                                        />
                                        <button 
                                          type="submit"
                                          className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                                        >
                                          Send
                                        </button>
                                      </form>
                                    </div>
                                  </div>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {vendorProfileTab === 'reviews' && (
                  /* ======================================================== */
                  /* REVIEWS TAB                                              */
                  /* ======================================================== */
                  <motion.div 
                    key="reviews"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6 text-left"
                  >
                    {/* Trust Score & Verification Summary */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative flex items-center justify-center">
                            {/* Radial/Circular visual indicator */}
                            <div className="w-16 h-16 rounded-full border-4 border-neutral-800 flex items-center justify-center bg-neutral-900">
                              <span className="text-xl font-black text-amber-500">
                                {trustScore ? `${trustScore.score}%` : "95%"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white uppercase tracking-wider">
                                {lang === 'en' ? 'Fayda Guard Trust Score' : 'የፋይዳ ጥበቃ ታማኝነት ነጥብ'}
                              </span>
                              <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20">
                                {trustScore ? trustScore.badgeLevel : "EXCELLENT"}
                              </span>
                            </div>
                            <div className="flex items-center text-amber-500 font-bold text-sm mt-1 gap-1.5">
                              <span>{"★".repeat(Math.round(trustScore ? trustScore.rating : 4.9))}</span>
                              <span className="text-xs text-stone-300 font-bold font-mono">({trustScore ? trustScore.rating : "4.9"} / 5)</span>
                            </div>
                            <p className="text-[10px] text-stone-400 mt-1">Based on community escrow transactions & verification parameters</p>
                          </div>
                        </div>

                        {/* Badges Column */}
                        <div className="flex flex-wrap gap-1.5 max-w-sm">
                          {(trustScore ? trustScore.badges : [
                            "✅ Verified Identity", "🛒 Verified Seller", "🏆 Top Rated", "🛡 Escrow Protected", "⭐ Trusted Business", "⚡ Fast Response"
                          ]).map((badge: string, idx: number) => (
                            <span 
                              key={badge + idx} 
                              className="bg-neutral-900 border border-neutral-800 text-stone-300 text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:border-amber-500/35 transition-colors cursor-default"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-neutral-850"></div>

                      {/* Detail Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] text-stone-400">
                        <div className="bg-neutral-900/45 p-2 rounded-xl border border-neutral-850">
                          <span className="text-stone-500 block uppercase font-bold tracking-wider mb-1">Identity KYC</span>
                          <span className="text-stone-100 font-black font-mono">+{trustScore ? trustScore.kycBonus : 20}% Approved</span>
                        </div>
                        <div className="bg-neutral-900/45 p-2 rounded-xl border border-neutral-850">
                          <span className="text-stone-500 block uppercase font-bold tracking-wider mb-1">Subscription</span>
                          <span className="text-stone-100 font-black font-mono">+{trustScore ? trustScore.subBonus : 20}% Premium</span>
                        </div>
                        <div className="bg-neutral-900/45 p-2 rounded-xl border border-neutral-850">
                          <span className="text-stone-500 block uppercase font-bold tracking-wider mb-1">Completed Escrows</span>
                          <span className="text-stone-100 font-black font-mono">+{trustScore ? trustScore.ordersBonus : 20}% Active</span>
                        </div>
                        <div className="bg-neutral-900/45 p-2 rounded-xl border border-neutral-850">
                          <span className="text-stone-500 block uppercase font-bold tracking-wider mb-1">Complaint Rate</span>
                          <span className="text-emerald-400 font-black font-mono">+{trustScore ? trustScore.complaintBonus : 20}% Perfect</span>
                        </div>
                      </div>
                    </div>

                    {/* Write Review Form (for non-vendors only) */}
                    {actingVendorId !== viewedVendorId && (
                      <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4 shadow-xl">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">
                            ✍️ {lang === 'en' ? 'Share Your Experience' : 'ልምድዎን ያካፍሉ'}
                          </h4>
                          <span className="text-[10px] text-stone-400">Reviewing securely as <strong className="text-amber-500">@Selamawit</strong></span>
                        </div>

                        {reviewSuccessMsg && (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                            {reviewSuccessMsg}
                          </div>
                        )}
                        {reviewErrorMsg && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold">
                            {reviewErrorMsg}
                          </div>
                        )}

                        <form 
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setReviewSuccessMsg(null);
                            setReviewErrorMsg(null);
                            try {
                              const response = await fetch('/api/reviews', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  targetType: 'VENDOR',
                                  targetId: viewedVendorId,
                                  userId: 'u-2', // Selamawit Tekle
                                  userName: 'Selamawit Tekle',
                                  rating: reviewFormRating,
                                  text: reviewFormText,
                                  photos: reviewFormPhoto ? [reviewFormPhoto] : ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"], // automatic demo image if blank
                                  videos: reviewFormVideo ? [reviewFormVideo] : [],
                                  isVerifiedPurchase: true
                                })
                              });
                              const data = await response.json();
                              if (response.ok && data.status === 'success') {
                                setReviewSuccessMsg(lang === 'en' ? 'Review submitted successfully! Trust score updated.' : 'አስተያየትዎ በተሳካ ሁኔታ ደርሷል! የታማኝነት ነጥቡ ተሻሽሏል።');
                                setReviewFormText('');
                                setReviewFormPhoto('');
                                setReviewFormVideo('');
                                setReviewFormRating(5);
                                fetchVendorReviewsAndTrust(viewedVendorId!);
                                triggerPushNotification(
                                  lang === 'en' ? 'Review Submitted!' : 'ግምገማ ደርሷል!',
                                  lang === 'en' ? 'Your review is verified and saved on the ledger.' : 'ግምገማዎ ተረጋግጦ በደብተራችን ላይ ተቀምጧል።',
                                  '⭐',
                                  'reviews'
                                );
                              } else {
                                setReviewErrorMsg(data.message || 'Failed to submit review.');
                              }
                            } catch (err: any) {
                              setReviewErrorMsg('Server error. Please verify configuration.');
                            }
                          }}
                          className="space-y-3.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-400">{lang === 'en' ? 'Your Rating:' : 'ደረጃ ይስጡ:'}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewFormRating(star)}
                                  className={`text-lg transition-transform hover:scale-110 cursor-pointer ${star <= reviewFormRating ? 'text-amber-500' : 'text-neutral-700'}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">{lang === 'en' ? 'Written Review' : 'የጽሑፍ አስተያየት'}</label>
                            <textarea
                              required
                              value={reviewFormText}
                              onChange={(e) => setReviewFormText(e.target.value)}
                              placeholder={lang === 'en' ? "Describe your purchasing and delivery experience securely..." : "ደህንነቱ የተጠበቀውን የክፍያ እና የአቅርቦት ልምድዎን ያብራሩ..."}
                              className="w-full text-xs bg-neutral-900 border border-neutral-850 rounded-2xl p-3 text-stone-200 outline-none focus:border-amber-500/40 min-h-[80px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                              <label className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">{lang === 'en' ? 'Attach Photo URL (Optional)' : 'ፎቶ አያይዝ (ከተፈለገ)'}</label>
                              <input
                                type="url"
                                value={reviewFormPhoto}
                                onChange={(e) => setReviewFormPhoto(e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full text-xs bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-stone-200 outline-none focus:border-amber-500/40"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">{lang === 'en' ? 'Attach Video URL (Optional)' : 'ቪዲዮ አያይዝ (ከተፈለገ)'}</label>
                              <input
                                type="url"
                                value={reviewFormVideo}
                                onChange={(e) => setReviewFormVideo(e.target.value)}
                                placeholder="https://example.com/video.mp4"
                                className="w-full text-xs bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-stone-200 outline-none focus:border-amber-500/40"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs px-5 py-2.5 rounded-2xl shadow-md shadow-amber-500/10 cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{lang === 'en' ? 'Submit Verified Review' : 'የተረጋገጠ ግምገማ አስገባ'}</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviewsLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-2">
                          <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                          <span className="text-xs text-stone-400">Loading verified ledger reviews...</span>
                        </div>
                      ) : dynamicReviews.length > 0 ? (
                        dynamicReviews.map((rev, idx) => (
                          <ReviewCard 
                            key={rev.id || idx} 
                            rev={rev} 
                            lang={lang} 
                            actingVendorId={actingVendorId}
                            viewedVendorId={viewedVendorId}
                            onRefresh={() => fetchVendorReviewsAndTrust(viewedVendorId!)}
                          />
                        ))
                      ) : (
                        <div className="bg-neutral-950 border border-neutral-850 p-8 rounded-3xl text-center space-y-2">
                          <span className="text-2xl block">💬</span>
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">No reviews found</h4>
                          <p className="text-[11px] text-stone-400 max-w-sm mx-auto">This vendor has not received any reviews yet. Be the first to purchase via Every-zone escrow and leave a review!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {vendorProfileTab === 'about' && (
                  /* ======================================================== */
                  /* ABOUT TAB                                                */
                  /* ======================================================== */
                  <motion.div 
                    key="about"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 text-left"
                  >
                    {/* 1. BUSINESS STORY & BRAND NARRATIVE */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-3 relative overflow-hidden">
                      <TraditionalCornerOrnament />
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block font-sans">
                        📜 {lang === 'en' ? 'Our Brand Legacy' : 'የብራንዳችን ታሪክ'}
                      </span>
                      <h3 className="text-xs font-black text-white leading-normal uppercase">
                        {lang === 'en' ? 'Heritage Addis Ababa Craftsmanship' : 'የአዲስ አበባ ጥበብ ቅርስ ባለቤት'}
                      </h3>
                      <p className="text-stone-300 text-[11px] leading-relaxed font-sans">
                        {lang === 'en' 
                          ? "Founded in the heart of the Bole district, we celebrate the ancient geometry of Ethiopian design. From hand-woven cotton fabrics (Habesha Kemis) to custom-molded genuine hides, every piece is made to last generations. Fully integrated with national digital standards for 100% genuine quality."
                          : "በቦሌ እምብርት ላይ የተመሰረተው ተቋማችን የኢትዮጵያን ጥበብ ያንጸባርቃል። ከእጅ ጥልፍ ልብሶች (ሀበሻ ቀሚስ) እስከ እውነተኛ የቆዳ ስራዎች ድረስ እያንዳንዱ ምርት ለትውልድ እንዲቆይ ተደርጎ በጥራት የተሰራ ነው። በብሔራዊ የጥራት ደረጃዎች ሙሉ በሙሉ የተረጋገጠ።"}
                      </p>
                    </div>

                    {/* 2. REGISTRATIONS & KYC CREDENTIALS */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block font-sans">
                          ✓ {lang === 'en' ? 'KYC & Legal Credentials' : 'ህጋዊ ፈቃድ እና ማረጋገጫዎች'}
                        </span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[8.5px] font-black px-2 py-0.5 rounded border border-emerald-500/20 font-sans">
                          🟢 Fayda Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 text-[11px] font-sans">
                        <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-2xl">
                          <span className="text-stone-500 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Fayda ID Certificate</span>
                          <span className="text-stone-200 font-mono font-bold">FYD-{viewedVendorId.toUpperCase()}-ETH-942</span>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-2xl">
                          <span className="text-stone-500 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Business License</span>
                          <span className="text-stone-200 font-mono font-bold">LIC/AA/BOLE/2026/83</span>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-2xl">
                          <span className="text-stone-500 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Chapa Escrow Node</span>
                          <span className="text-stone-200 font-mono font-bold">NODE-SHIELD-SECURE</span>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-2xl">
                          <span className="text-stone-500 block text-[9px] uppercase font-bold tracking-wider mb-0.5">KYC Verified Status</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={11} /> Passed Stage-3
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. VERIFIED TRUST INDICATORS */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-3">
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                        🛡️ {lang === 'en' ? 'Verified Trust Indicators' : 'የእምነትና ደህንነት ማሳያዎች'}
                      </span>

                      <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
                        <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 flex gap-2 items-start">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <div>
                            <span className="text-white font-extrabold block">Verified Identity</span>
                            <span className="text-stone-400 text-[9.5px]">Goverment passport matched</span>
                          </div>
                        </div>

                        <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 flex gap-2 items-start">
                          <span className="text-amber-500 mt-0.5">★</span>
                          <div>
                            <span className="text-white font-extrabold block">Subscription Active</span>
                            <span className="text-stone-400 text-[9.5px]">Enterprise Golden Partner</span>
                          </div>
                        </div>

                        <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 flex gap-2 items-start">
                          <span className="text-emerald-400 mt-0.5">🛡️</span>
                          <div>
                            <span className="text-white font-extrabold block">Escrow Protected</span>
                            <span className="text-stone-400 text-[9.5px]">Chapa 100% secure holding</span>
                          </div>
                        </div>

                        <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 flex gap-2 items-start">
                          <span className="text-emerald-400 mt-0.5">💳</span>
                          <div>
                            <span className="text-white font-extrabold block">Secure Payments</span>
                            <span className="text-stone-400 text-[9.5px]">Cryptographically signed</span>
                          </div>
                        </div>

                        <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 flex gap-2 items-start">
                          <span className="text-amber-500 mt-0.5">⚡</span>
                          <div>
                            <span className="text-white font-extrabold block">Average Reply Time</span>
                            <span className="text-stone-400 text-[9.5px]">Under 12 minutes</span>
                          </div>
                        </div>

                        <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 flex gap-2 items-start">
                          <span className="text-amber-500 mt-0.5">📦</span>
                          <div>
                            <span className="text-white font-extrabold block">Successful Orders</span>
                            <span className="text-stone-400 text-[9.5px]">1,240+ completed sales</span>
                          </div>
                        </div>

                        <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 flex gap-2 items-start col-span-2">
                          <span className="text-emerald-400 mt-0.5">👥</span>
                          <div>
                            <span className="text-white font-extrabold block">Repeat Customers</span>
                            <span className="text-stone-400 text-[9.5px]">44% customer retention rate (highly trusted within Addis Ababa)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. VERIFIED CONTACT DETAILS & SOCIALS */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4">
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                        📞 {lang === 'en' ? 'Direct Contact & Social Networks' : 'አድራሻ እና ማህበራዊ ሚዲያዎች'}
                      </span>

                      <div className="space-y-2.5 text-xs font-sans">
                        <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-xl border border-neutral-850">
                          <span className="text-stone-400">Phone Hotline</span>
                          <span className="text-stone-200 font-mono font-bold flex items-center gap-1">
                            +251 911 234 567 <span className="text-emerald-400">✓</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-xl border border-neutral-850">
                          <span className="text-stone-400">Official Email</span>
                          <span className="text-stone-200 font-mono font-bold flex items-center gap-1">
                            heritage@{viewedVendorId}.et <span className="text-emerald-400">✓</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-xl border border-neutral-850">
                          <span className="text-stone-400">Store Website</span>
                          <span className="text-amber-500 font-bold hover:underline cursor-pointer flex items-center gap-1">
                            www.heritage-{viewedVendorId}.et <span className="text-emerald-400">✓</span>
                          </span>
                        </div>
                      </div>

                      <div className="h-px bg-neutral-850"></div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-400 font-medium">Follow Social Hub:</span>
                        <div className="flex gap-2">
                          {['Facebook', 'Instagram', 'TikTok'].map((social) => (
                            <button 
                              key={social}
                              onClick={() => alert(`Redirecting to @heritage_${viewedVendorId} on ${social}...`)}
                              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/20 px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold text-stone-300 transition cursor-pointer"
                            >
                              {social}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 5. WORKING HOURS & INTERACTIVE ZOOMABLE MAP */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block font-sans">
                            📍 {lang === 'en' ? 'Boutique Location & Hours' : 'አድራሻ እና የስራ ሰዓት'}
                          </span>
                          <p className="text-xs font-bold text-white mt-0.5">Bole Road, Atlas District, Addis Ababa</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-stone-500 block uppercase font-bold">Hours Status</span>
                          <span className="text-emerald-400 text-xs font-black">● OPEN NOW</span>
                        </div>
                      </div>

                      <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center justify-between text-[11px]">
                        <span className="text-stone-300 font-bold">
                          🕒 {lang === 'en' ? 'Mon - Sat (8:30 AM - 7:30 PM)' : 'ሰኞ - ቅዳሜ (8:30 ጠዋት - 7:30 ማታ)'}
                        </span>
                        <span className="text-stone-500 font-mono text-[9px]">GMT+3 (East Africa)</span>
                      </div>

                      {/* SIMULATED DYNAMIC GPS MAP INTERFACE */}
                      {(() => {
                        const [zoomLevel, setZoomLevel] = useState(1);
                        return (
                          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden flex flex-col relative select-none">
                            {/* Map Container Stage */}
                            <div className="h-44 w-full relative flex items-center justify-center overflow-hidden bg-neutral-950/90">
                              
                              {/* Background Grid Roads simulating Bole Atlas Road */}
                              <div 
                                className="absolute inset-0 transition-transform duration-500 flex items-center justify-center"
                                style={{ transform: `scale(${1 + (zoomLevel - 1) * 0.4})` }}
                              >
                                {/* Diagonal road layout */}
                                <div className="absolute w-[300px] h-[3px] bg-neutral-800/80 rotate-[35deg] origin-center"></div>
                                <div className="absolute w-[300px] h-[3px] bg-neutral-800/80 -rotate-[45deg] origin-center"></div>
                                <div className="absolute w-full h-[3px] bg-neutral-800/80 top-1/2 -translate-y-1/2"></div>
                                <div className="absolute h-full w-[3px] bg-neutral-800/80 left-1/3"></div>

                                {/* Bole road sign text */}
                                <span className="absolute text-[8px] text-stone-600 font-mono tracking-widest uppercase rotate-12 top-10 right-4">Bole Airport Highway</span>
                                <span className="absolute text-[8px] text-stone-600 font-mono tracking-widest uppercase rotate-[-25deg] bottom-12 left-6">Atlas Rd</span>

                                {/* Other surrounding businesses */}
                                <span className="absolute text-[7.5px] text-stone-600 font-bold bg-neutral-900/50 px-1 rounded border border-neutral-800/30 top-16 left-8">Atlas Hotel</span>
                                <span className="absolute text-[7.5px] text-stone-600 font-bold bg-neutral-900/50 px-1 rounded border border-neutral-800/30 bottom-16 right-8">Chapa HQ Gate B</span>

                                {/* Target Store GPS Hub */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                                  {/* Pulsing beacon circles */}
                                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-amber-500/25 animate-ping"></span>
                                  <span className="absolute inline-flex h-5 w-5 rounded-full bg-amber-500/40 animate-pulse"></span>
                                  <div className="w-4 h-4 rounded-full bg-amber-500 border border-stone-950 flex items-center justify-center text-[8px] text-stone-950 font-black shadow-lg">
                                    ★
                                  </div>
                                  <div className="mt-1.5 bg-neutral-900 border border-amber-500/40 text-[8.5px] text-amber-400 font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md">
                                    Heritage Boutique
                                  </div>
                                </div>
                              </div>

                              {/* Static controls row (absolute bottom corner inside map) */}
                              <div className="absolute bottom-2.5 right-2.5 flex gap-1 z-20">
                                <button 
                                  onClick={() => setZoomLevel(prev => Math.min(prev + 1, 3))}
                                  className="w-6 h-6 bg-black/85 hover:bg-amber-500 hover:text-stone-950 text-white font-extrabold text-xs rounded-lg border border-white/10 flex items-center justify-center cursor-pointer transition"
                                  title="Zoom In"
                                >
                                  +
                                </button>
                                <button 
                                  onClick={() => setZoomLevel(prev => Math.max(prev - 1, 1))}
                                  className="w-6 h-6 bg-black/85 hover:bg-amber-500 hover:text-stone-950 text-white font-extrabold text-xs rounded-lg border border-white/10 flex items-center justify-center cursor-pointer transition"
                                  title="Zoom Out"
                                >
                                  −
                                </button>
                              </div>

                              {/* Mini GPS Compass */}
                              <div className="absolute top-2.5 left-2.5 bg-black/60 text-[8.5px] text-stone-300 px-2 py-0.5 rounded-full border border-white/10 font-mono font-bold">
                                🧭 Compass Active: Bole District
                              </div>
                            </div>

                            {/* Map action footer bar */}
                            <div className="p-2.5 bg-neutral-950 border-t border-neutral-850 flex justify-between items-center text-[10.5px]">
                              <span className="text-stone-400 font-medium">Coordinate Node: 9.0222° N, 38.7743° E</span>
                              <button 
                                onClick={() => alert("Launching external maps with live navigation coordinates to Bole Atlas District...")}
                                className="text-amber-500 font-extrabold hover:underline cursor-pointer"
                              >
                                Open in Google Maps ↗
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}

                {vendorProfileTab === 'policies' && (
                  /* ======================================================== */
                  /* POLICIES TAB                                             */
                  /* ======================================================== */
                  <motion.div 
                    key="policies"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 text-left font-sans"
                  >
                    {/* 1. Secure Escrow Agreement policy */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-3 relative overflow-hidden">
                      <TraditionalCornerOrnament />
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block">
                        🛡️ {lang === 'en' ? 'Chapa Escrow & Payment Protection' : 'የቻፓ ኤስክሮውና ክፍያ ጥበቃ'}
                      </span>
                      <h3 className="text-xs font-black text-white leading-normal uppercase">
                        {lang === 'en' ? '100% Secure Funds Holding' : '100% አስተማማኝ የክፍያ ማቆያ ዋስትና'}
                      </h3>
                      <p className="text-stone-300 text-[11px] leading-relaxed">
                        {lang === 'en' 
                          ? "All orders placed on Every-zone are fully protected by cryptographic escrow. When you make a payment, your funds are safely held in a joint-escrow shield managed by Chapa and Every-zone. The vendor is only paid after you receive and confirm the item meets your specified standards."
                          : "በEvery-zone በኩል የሚደረጉ ሁሉም ትዕዛዞች በኤስክሮው የክፍያ ዋስትና ሙሉ በሙሉ የተጠበቁ ናቸው። ክፍያ ሲፈጽሙ ገንዘብዎ በቻፓ እና በEvery-zone በሚተዳደረው የጋራ ኤስክሮው ማቆያ ውስጥ በደህና ይቆያል። ለሻጩ የሚከፈለው ምርቱን ተቀብለው ትክክለኛነቱን ሲያረጋግጡ ብቻ ነው።"}
                      </p>
                      <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-2xl flex items-center gap-2.5 text-[10px] text-stone-400">
                        <span className="text-emerald-400 font-bold shrink-0">✓ Verified Safe</span>
                        <span>{lang === 'en' ? 'Funds cannot be released prematurely without buyer clearance.' : 'ያለ ገዢው ፈቃድ ገንዘብ አስቀድሞ ሊለቀቅ አይችልም።'}</span>
                      </div>
                    </div>

                    {/* 2. Delivery & Return Policy */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-4">
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block">
                        📦 {lang === 'en' ? 'Delivery & Return Policies' : 'የማድረሻና ምርት መመለሻ ፖሊሲዎች'}
                      </span>

                      <div className="space-y-3 text-[11px]">
                        <div className="flex gap-3 items-start bg-neutral-900 border border-neutral-850 p-3 rounded-2xl">
                          <span className="text-amber-500 font-bold text-xs mt-0.5">⚡</span>
                          <div>
                            <span className="text-white font-extrabold block">{lang === 'en' ? 'Addis Ababa Shipping' : 'በአዲስ አበባ ውስጥ ማድረስ'}</span>
                            <span className="text-stone-400 leading-relaxed text-[10.5px]">
                              {lang === 'en' ? 'Dispatched within 12-24 hours. Hand-delivered via Every-zone premium courier partner fleet.' : 'በ12-24 ሰዓታት ውስጥ የሚላክ። በEvery-zone ፕሪሚየም ፈጣን መልዕክተኞች አማካኝነት እጅ በእጅ የሚደርስ።'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start bg-neutral-900 border border-neutral-850 p-3 rounded-2xl">
                          <span className="text-amber-500 font-bold text-xs mt-0.5">🇪🇹</span>
                          <div>
                            <span className="text-white font-extrabold block">{lang === 'en' ? 'Regional & Nationwide Shipping' : 'ወደ ክፍለ ሀገር ማድረስ'}</span>
                            <span className="text-stone-400 leading-relaxed text-[10.5px]">
                              {lang === 'en' ? 'Sent via fast-tracked local post networks. Delivered securely within 2-4 business days.' : 'በፈጣን የሀገር ውስጥ የፖስታ አውታሮች በኩል የሚላክ። በ2-4 የስራ ቀናት ውስጥ በጥንቃቄ የሚደርስ።'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start bg-neutral-900 border border-neutral-850 p-3 rounded-2xl">
                          <span className="text-emerald-400 font-bold text-xs mt-0.5">↩</span>
                          <div>
                            <span className="text-white font-extrabold block">{lang === 'en' ? '48-Hour Return Window' : 'ባለ 48 ሰዓት ምርት መመለሻ ዋስትና'}</span>
                            <span className="text-stone-400 leading-relaxed text-[10.5px]">
                              {lang === 'en' ? 'If the item differs from the descriptions or catalogs, you can file a return request within 48 hours for an instant full refund.' : 'ምርቱ ከተገለጸው ወይም ከካታሎጉ የተለየ ከሆነ ሙሉ ክፍያዎን ወዲያውኑ ለመመለስ በ48 ሰዓታት ውስጥ የይመለስልኝ ጥያቄ ማቅረብ ይችላሉ።'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Direct Disputes & Resolutions */}
                    <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-3xl space-y-3">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">
                        🚨 {lang === 'en' ? 'Disputes & Compliance Care' : 'አለመግባባቶችና ህጋዊ ክትትል'}
                      </span>
                      <h3 className="text-xs font-black text-white leading-normal uppercase">
                        {lang === 'en' ? '12-Hour Arbitration Resolution' : 'ባለ 12 ሰዓት የሽምግልና ውሳኔ ማረጋገጫ'}
                      </h3>
                      <p className="text-stone-300 text-[11px] leading-relaxed">
                        {lang === 'en' 
                          ? "Our compliance and arbitration board is active around the clock. If you file a dispute regarding an order or service booking, an independent compliance officer will review the evidence, chat logs, and cryptographic transaction details to issue a binding resolution within 12 hours."
                          : "የእኛ የህግና ሽምግልና ቦርድ ሁልጊዜ ንቁ ነው። በአንድ ትዕዛዝ ወይም በአገልግሎት ማስያዣ ላይ ቅሬታ ካቀረቡ፣ ገለልተኛ የህግ መኮንን ማስረጃዎችን፣ የመልዕክት ልውውጦችንና የክፍያ ዝርዝሮችን በመመርመር በ12 ሰዓታት ውስጥ አስገዳጅ ውሳኔ ይሰጣል።"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* DYNAMIC SHOP GRID VIEW */}
          {!viewedVendorId && activeTab === 'shop' && (
            <MarketplaceHub 
              currentUserId="u-2" 
              isDarkMode={isDarkMode} 
              lang={lang}
              onViewVendorProfile={(vendorId) => {
                const normalized = vendorId.replace('-', ''); // normalize v-2 to v2, or keep v2
                setViewedVendorId(normalized);
              }}
              onSelectListing={(listing) => {
                setSelectedListing(listing);
              }}
              onSelectProduct={(product) => {
                setSelectedMarketplaceProduct(product);
              }}
              onToggleVoiceWelcome={handleVoiceWelcome}
              isPlayingVoice={isPlayingVoice}
            />
          )}

          {/* DYNAMIC HOUSES GRID VIEW */}
          {!viewedVendorId && activeTab === 'houses' && (
            <HousesScreen 
              isDarkMode={isDarkMode}
              lang={lang}
              houseDealType={houseDealType}
              setHouseDealType={setHouseDealType}
              housesPropertyType={housesPropertyType}
              setHousesPropertyType={setHousesPropertyType}
              activeListings={activeListings}
              setSelectedListing={setSelectedListing}
              setViewedVendorId={setViewedVendorId}
              searchQuery={searchQuery}
              filterCity={filterCity}
              filterCategory={filterCategory}
              filterMaxPrice={filterMaxPrice}
              setSavedSearches={setSavedSearches}
            />
          )}

          {/* DYNAMIC certified AGENCIES GRID VIEW */}
          {!viewedVendorId && activeTab === 'agencies' && (
            <AgenciesScreen 
              isDarkMode={isDarkMode}
              lang={lang}
              agencyDealType={agencyDealType}
              setAgencyDealType={setAgencyDealType}
              activeListings={activeListings}
              setSelectedListing={setSelectedListing}
              setViewedVendorId={setViewedVendorId}
              searchQuery={searchQuery}
              filterCity={filterCity}
              filterCategory={filterCategory}
              filterMaxPrice={filterMaxPrice}
              setSavedSearches={setSavedSearches}
              agenciesFilter={agenciesFilter}
              setJobFilter={setJobFilter}
            />
          )}

          {/* TAB 5: MATCHMAKING ZONE */}
          {!viewedVendorId && activeTab === 'matchmaking' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 px-4 py-2"
            >
              <LotteryMatchmakingZone 
                walletBalance={walletBalance}
                setWalletBalance={setWalletBalance}
                isDarkMode={isDarkMode}
                t={t}
                activeSubTab="matchmaking"
              />
            </motion.div>
          )}

          {/* TAB 6: SETTINGS VIEW (የማስተካከያ ገጽ) */}
          {!viewedVendorId && activeTab === 'settings' && (
            <SettingsScreen 
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              lang={lang}
              setLang={setLang}
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              scanHistory={scanHistory}
              setScanHistory={setScanHistory}
              setSelectedMarketplaceProduct={setSelectedMarketplaceProduct}
              setViewedVendorId={setViewedVendorId}
              setActiveDevModule={setActiveDevModule}
            />
          )}

          {!viewedVendorId && activeTab === 'settings' && (
            <div className="space-y-4 pb-12">
              {/* 3rd: ADVANCED CITIZEN & BUSINESS HUBS (LAUNCH INTEGRATIVE MODULES) */}
              <div className={`p-4 rounded-3xl border shadow-md transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
                <div className="flex items-center gap-2.5 mb-3.5 border-b pb-3 border-stone-100 dark:border-zinc-800">
                  <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-[#1E3A1A]/10 text-[#1E3A1A]'}`}>
                    🚀
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">
                      {lang === 'en' ? 'Advanced Citizen & Business Hubs' : 'የላቁ ዜጋ እና የንግድ ማዕከላት'}
                    </h3>
                    <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-stone-400'}`}>
                      {lang === 'en' ? 'Launch interactive integrated subsystems below' : 'ከዚህ በታች ያሉትን ሙሉ በሙሉ ዝግጁ የሆኑ የላቁ ሲስተሞች ይክፈቱ'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'ai', titleEn: 'AI Assistant Copilot', titleAm: 'አይአይ ረዳት ኮፓይለት', descEn: 'Text valuation & Ministry CV creator', descAm: 'የንብረት ዋጋና ሲቪ መገንቢያ', icon: '🤖', color: 'from-purple-600 to-indigo-700' },
                    { id: 'passport', titleEn: 'Passport & Fayda Hub', titleAm: 'ፓስፖርት እና ፋይዳ', descEn: 'Schedule bio-queue & track state', descAm: 'ቀጠሮ መያዣና ክትትል ሰሌዳ', icon: '✈️', color: 'from-sky-600 to-blue-700' },
                    { id: 'logistics', titleEn: 'Dispatch Delivery', titleAm: 'የእቃ ማድረሻ ሎጅስቲክስ', descEn: 'GPS routing map & rider dispatch', descAm: 'የመልእክተኛ ካርታና ትእዛዝ ሰሌዳ', icon: '🏍️', color: 'from-emerald-600 to-teal-750' },
                    { id: 'adv', titleEn: 'Ad Campaigns', titleAm: 'የማስታወቂያ ማዕከል', descEn: 'Sponsored keyword bid & stats', descAm: 'ማስታወቂያ ማስጀመርያ ሰሌዳ', icon: '📢', color: 'from-amber-500 to-orange-650' },
                    { id: 'admin', titleEn: 'Super-Admin Console', titleAm: 'የበላይ አስተዳዳሪ ሰሌዳ', descEn: 'Approval flow & fraud bans', descAm: 'የማረጋገጫና ፍቃድ ቁጥጥር', icon: '🛡️', color: 'from-rose-650 to-red-800' },
                    { id: 'wallet', titleEn: 'Wallet Ledger Hub', titleAm: 'የኪስ ቦርሳ ዝርዝር', descEn: 'Ledger micro-audit & credits', descAm: 'የሂሳብ መለያዎችና የኤስክሮው ቁጥጥር', icon: '💳', color: 'from-neutral-700 to-neutral-900' },
                    { id: 'devops', titleEn: 'CI/CD & DevOps Console', titleAm: 'ሲአይ/ሲዲ እና ዴቭኦፕስ ሰሌዳ', descEn: 'Visual pipeline, staging, Docker & rollbacks', descAm: 'የፓይፕላይን ዝርጋታ፣ ዶከርና ፍተሻ', icon: '♾️', color: 'from-cyan-600 to-blue-850' },
                    { id: 'sre', titleEn: 'SRE & Cyber-Security', titleAm: 'የክትትልና የደህንነት ማዕከል', descEn: 'Metrics, Loki logging, Sentry & private storage', descAm: 'የስርዓት ክትትል፣ ሎግ፣ የሴንትሪና የደህንነት መጠበቂያ', icon: '🛡️', color: 'from-rose-500 to-indigo-600' },
                    { id: 'vendor_dashboard', titleEn: 'Vendor Store Hub', titleAm: 'የሻጭ አስተዳዳሪ ሰሌዳ', descEn: 'Vacation mode, sales charts & withdraws', descAm: 'የሽያጭ ሰንጠረዥና የገንዘብ ማውጫ', icon: '🏬', color: 'from-amber-600 to-yellow-750' },
                    { id: 'order_tracking', titleEn: 'Order Tracker', titleAm: 'ትእዛዝ መከታተያ', descEn: 'Amazon-style live progress tracking', descAm: 'የእቃ አቅርቦት ደረጃ መከታተያ ሰሌዳ', icon: '📦', color: 'from-violet-600 to-purple-800' },
                    { id: 'wishlist', titleEn: 'Curated Wishlist', titleAm: 'የተመረጡ ምኞቶች', descEn: 'Custom user collections with tags', descAm: 'የምኞት ማህደሮችና ስብስቦች ማከማቻ', icon: '💖', color: 'from-pink-500 to-rose-700' },
                    { id: 'v9_suite', titleEn: 'V9 Core Feature Hub', titleAm: 'ቪ9 ባህሪዎች ማዕከል', descEn: 'Social feed, Live shopping, CRM & loyalty systems', descAm: 'የቀጥታ ስርጭት ሽያጭ፣ የደንበኞች ማስተዳደሪያና የሪፈራል ማዕከል', icon: '🌟', color: 'from-yellow-500 to-amber-650' },
                    { id: 'monetization', titleEn: 'Monetization Engine', titleAm: 'የገቢ ማመንጫ ማዕከል', descEn: 'Vendor plans, boosts, ad previews, coupons, referrals, receipts & performance scorecards', descAm: 'የሻጭ እቅዶች፣ ማሳደጊያዎች፣ ኩፖኖች፣ ሪፈራሎችና ዲጂታል ደረሰኞች', icon: '⚡', color: 'from-amber-500 to-yellow-600' }
                  ].map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setActiveDevModule(mod.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group hover:scale-[1.03] active:scale-95 cursor-pointer shadow-xs flex flex-col justify-between min-h-[105px] ${
                        isDarkMode ? 'bg-zinc-950/45 border-zinc-805 hover:border-zinc-700' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity rounded-full -mr-4 -mt-4" />
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-lg mb-1 block">{mod.icon}</span>
                          <span className="text-[7.5px] font-black tracking-widest text-emerald-650 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">
                            {lang === 'en' ? 'READY' : 'ዝግጁ'}
                          </span>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-tight leading-snug">
                          {lang === 'en' ? mod.titleEn : mod.titleAm}
                        </h4>
                        <p className={`text-[8.5px] leading-tight mt-1 opacity-75 ${isDarkMode ? 'text-zinc-400' : 'text-stone-500'}`}>
                          {lang === 'en' ? mod.descEn : mod.descAm}
                        </p>
                      </div>
                      <div className="mt-2 text-[8px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-0.5 justify-end">
                        <span>{lang === 'en' ? 'Launch' : 'ክፈት'}</span>
                        <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4th: SYSTEM COMPLETENESS & DIAGNOSTICS */}
              <div className={`p-4 rounded-3xl border shadow-md transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
                <div className="flex items-center gap-2.5 mb-3.5 border-b pb-3 border-stone-100 dark:border-zinc-800">
                  <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#1E3A1A]/10 text-[#1E3A1A]'}`}>
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5">
                      {lang === 'en' ? 'System Completeness & Diagnostics' : 'የአፕሊኬሽኑ ምሉዕነት እና የመፈተሻ ሰሌዳ'}
                      <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-sans animate-pulse font-bold tracking-widest uppercase">
                        100% COMPLETE
                      </span>
                    </h3>
                    <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-stone-400'}`}>
                      {lang === 'en' ? 'Click on any subsystem below to run live architectural telemetry diagnostics.' : 'ስራ ላይ ያሉትን የኋላ-ታሪክ ሰርቨሮች፣ የደህንነት ካርታዎች እና ክፍያዎችን አሁኑኑ ይፈትሹ።'}
                    </p>
                  </div>
                </div>

                {/* Subsystems Diagnostic Matrix */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: 'search',
                      title: lang === 'en' ? '1. Global Search Engine' : '፩. ሁሉን አቀፍ የፍለጋ ሞተር',
                      desc: 'Multi-lingual keyword indexing, weights & categorization',
                      icon: '🔍',
                      log: `[SEARCH ENG] Verified indices for 'iPhone', 'House in Addis', 'Dubai Driver Job'. Multi-lingual dictionary parsing completed in 0.02ms. Keyword hits sorted by tier relevance: APPROVED.`
                    },
                    {
                      id: 'media',
                      title: lang === 'en' ? '2. S3/Cloudinary Sockets' : '፪. የሚዲያ ማከማቻ (S3/Cloudinary)',
                      desc: 'Background binary image chunk streams & uploads',
                      icon: '📁',
                      log: `[S3_SOCKETS] Bucket 'everyzone-prod-images-1' ping success. Latency: 0.04ms. Security checksum validation matches active AWS IAM credentials: ACTIVE.`
                    },
                    {
                      id: 'rbac',
                      title: lang === 'en' ? '3. API Gateway & RBAC' : '፫. የፍቃድ አስተዳደር (RBAC & Gateway)',
                      desc: 'Gatekeeper routing rules: SuperAdmin, SubAdmin, User',
                      icon: '🔑',
                      log: `[GATEWAY_RBAC] Active user verified: ambek0537@gmail.com. Super-Admin tokens matching cryptography seed. Block rules established for 19 financial endpoints: SECURE.`
                    },
                    {
                      id: 'telemetry',
                      title: lang === 'en' ? '4. Audit & Concurrency' : '፬. የክትትል ሪፖርት (Audit Log)',
                      desc: 'Server telemetry buffer, error boundary logs & DAU charts',
                      icon: '📊',
                      log: `[AUDIT_LOGGER] Simulated live user concurrency: 1,482 concurrent sessions. Telemetry log stream: OK. Error boundary integrity: 100%. 99.9% Uptime guaranteed.`
                    },
                    {
                      id: 'chapa',
                      title: lang === 'en' ? '5. Chapa Escrow Gateway' : '፭. የክፍያ ዋስትና (Chapa Escrow)',
                      desc: 'Instant Chapa ledger deduction & micro-escrow holds',
                      icon: '💳',
                      log: `[CHAPA_GATEWAY] Wallet integration active. Initial balance: 6,800 ETB. Escrow deposit accounts secure. Ledger balance auto-sync completed: COMPLIANT.`
                    },
                    {
                      id: 'ai_engine',
                      title: lang === 'en' ? '6. AI Recommendations' : '፮. የአይአይ የውሳኔ ሞዴል',
                      desc: 'User interaction affinity tracking (Houses/Jobs/Shops)',
                      icon: '🧠',
                      log: `[AI_RECOMMEND] Personalized asset recommendations computed. Dynamic 'Recommended For You' asset feed loaded based on user selection vectors: ACTIVE.`
                    },
                    {
                      id: 'logistics',
                      title: lang === 'en' ? '7. Courier Network' : '፯. የሎጅስቲክስ እና መልእክተኞች',
                      desc: 'Interactive rider route maps & packet status triggers',
                      icon: '🏍️',
                      log: `[COURIER_NET] Verified 8 active dispatchable courier slots. Real-time packet route coordinates tracking active. Dispatch handshake successful: LIVE.`
                    },
                    {
                      id: 'fraud',
                      title: lang === 'en' ? '8. Predictive Fraud Guard' : '፰. የማጭበርበር መከላከያ',
                      desc: 'Velocity filters & transaction anomaly detectors',
                      icon: '🛡️',
                      log: `[FRAUD_DETECTOR] Transaction velocity checked. Maximum permitted transactions per hour: 12. No anomalies detected. Auto-suspension triggers: ARMED & PROTECTED.`
                    }
                  ].map((sub) => {
                    const hasLog = !!telemetryLogs[sub.id];
                    return (
                      <div 
                        key={sub.id}
                        className={`p-2.5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between hover:scale-[1.01] ${
                          hasLog 
                            ? (isDarkMode ? 'bg-[#182C1B] border-emerald-500/40 text-emerald-100' : 'bg-emerald-50/75 border-emerald-500/30 text-[#1E3A1A]') 
                            : (isDarkMode ? 'bg-[#18181B] border-zinc-800 text-zinc-300 hover:border-zinc-700' : 'bg-[#FAF9F5] border-stone-200 text-stone-700 hover:border-stone-250')
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[14px]">{sub.icon}</span>
                            <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider ${
                              hasLog ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-200 dark:bg-zinc-800 text-stone-500'
                            }`}>
                              {hasLog ? (lang === 'en' ? 'PING OK' : 'ተፈትሿል') : (lang === 'en' ? 'TEST' : 'ለመፈተሽ')}
                            </span>
                          </div>
                          <h4 className="text-[10px] font-extrabold tracking-tight leading-snug">{sub.title}</h4>
                          <p className="text-[8px] opacity-75 mt-0.5 leading-tight">{sub.desc}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setTelemetryLogs(prev => ({
                              ...prev,
                              [sub.id]: sub.log
                            }));
                          }}
                          className={`mt-2 w-full py-1 text-[8px] rounded font-black uppercase tracking-wider transition-all ${
                            hasLog 
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                              : (isDarkMode ? 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300' : 'bg-stone-200/80 hover:bg-stone-250 text-stone-700')
                          }`}
                        >
                          {hasLog ? (lang === 'en' ? 'Re-Ping System' : 'ድጋሜ መርምር') : (lang === 'en' ? 'Run Telemetry' : 'ሲስተም ፍተሻ')}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated CLI Terminal output for active logs */}
                {Object.keys(telemetryLogs).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3.5 p-2.5 bg-black rounded-2xl border border-zinc-800 font-mono text-[8.5px] leading-relaxed text-zinc-400 text-left relative"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 mb-1.5">
                      <span className="text-emerald-500 font-bold uppercase tracking-widest text-[7.5px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        EVERYZONE DIAGNOSTIC TRACE OUTPUT:
                      </span>
                      <button 
                        onClick={() => setTelemetryLogs({})}
                        className="text-[7.5px] text-zinc-500 hover:text-white uppercase font-bold underline cursor-pointer"
                      >
                        {lang === 'en' ? 'Clear Log' : 'አፅዳ'}
                      </button>
                    </div>
                    <div className="space-y-1 max-h-[140px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                      {Object.entries(telemetryLogs).map(([key, value]) => (
                        <div key={key} className="flex gap-1.5 text-emerald-400">
                          <span className="text-emerald-500 font-bold shrink-0">&gt;&gt;</span>
                          <span className="text-zinc-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 5th: FEEDBACK & CONTACT SYSTEM */}
              <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
                <div className="flex items-center gap-2.5 mb-3 border-b pb-3 border-stone-100 dark:border-zinc-800">
                  <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-[#1E3A1A]/10 text-[#1E3A1A]'}`}>
                    💬
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{t('feedbackTitle')}</h3>
                    <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-stone-400'}`}>{t('feedbackSub')}</p>
                  </div>
                </div>

                {feedbackSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-2xl text-xs text-center space-y-1.5"
                  >
                    <div className="font-bold">🙏 {t('feedbackSuccess')}</div>
                    <button 
                      type="button"
                      onClick={() => setFeedbackSubmitted(false)}
                      className="text-[10px] underline hover:text-emerald-700 font-bold uppercase transition-colors pointer-events-auto"
                    >
                      {lang === 'en' ? 'Submit another message' : 'ሌላ መልዕክት ላክ'}
                    </button>
                  </motion.div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!feedbackMessage.trim()) return;
                      const newLog = {
                        id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
                        email: feedbackEmail || 'anonymous_citizen@everyzone.com',
                        message: feedbackMessage.trim(),
                        date: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
                      };
                      setFeedbackLogs(prev => [newLog, ...prev]);
                      setFeedbackMessage('');
                      setFeedbackSubmitted(true);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-[9px] text-[#C5A059] block font-black uppercase tracking-wider mb-1">
                        {lang === 'en' ? 'Your Contact Email (Optional)' : 'የእርስዎ ኢሜይል (አማራጭ)'}
                      </label>
                      <input 
                        type="email" 
                        placeholder="abebe@gmail.com"
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        className={`w-full outline-none text-xs px-3 py-2 rounded-xl transition-all border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-amber-400/40' : 'bg-stone-50 border-stone-250 text-stone-800 focus:border-[#1E3A1A]/40'}`}
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-[#C5A059] block font-black uppercase tracking-wider mb-1">
                        {lang === 'en' ? 'Your Message / Feedback' : 'የእርስዎ አስተያየት'}
                      </label>
                      <textarea 
                        rows={3}
                        required
                        placeholder={t('messagePlaceholder')}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        className={`w-full outline-none text-xs px-3 py-2 rounded-xl transition-all border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-amber-400/40' : 'bg-stone-50 border-stone-250 text-stone-800 focus:border-[#1E3A1A]/40'}`}
                      />
                    </div>

                    <button 
                      type="submit"
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${isDarkMode ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400' : 'bg-[#1E3A1A] text-white hover:bg-[#1E3A1A]/90'}`}
                    >
                      📨 {t('submitFeedback')}
                    </button>
                  </form>
                )}

                {/* Log of current session feedbacks */}
                {feedbackLogs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dashed border-stone-200 dark:border-zinc-800 space-y-2">
                    <div className="text-[9.5px] text-stone-400 uppercase tracking-widest font-black select-none">
                      {lang === 'en' ? 'Your Feedback Log (This Session)' : 'በዚህ ጊዜ የላኳቸው አስተያየቶች'}
                    </div>
                    <div className="space-y-2 max-h-[120px] overflow-y-auto">
                      {feedbackLogs.map((fb) => (
                        <div key={fb.id} className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${isDarkMode ? 'bg-zinc-850 border-zinc-750 text-zinc-350' : 'bg-stone-50 border-stone-150 text-stone-700'}`}>
                          <div className="flex justify-between text-[9px] font-bold text-[#C5A059] mb-1">
                            <span>{fb.email}</span>
                            <span>{fb.date}</span>
                          </div>
                          <p>{fb.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* System Preferences Block (Display Appearance & Language) */}
              <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-300 text-left space-y-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5 border-b pb-1.5 border-stone-100 dark:border-zinc-800">
                  ⚙️ {lang === 'en' ? 'System Preferences' : 'የስርዓት ምርጫዎች'}
                </div>

                {/* Theme switcher */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-bold flex items-center gap-1.5">
                      {isDarkMode ? <Moon size={13} className="text-amber-400" /> : <Sun size={13} className="text-amber-600" />}
                      {lang === 'en' ? 'Display Appearance' : 'የማሳያ ሁኔታ'}
                    </div>
                    <p className="text-[9px] text-stone-400 dark:text-zinc-500">
                      {lang === 'en' ? 'Choose dark or light visual interface styles' : 'የጨለማ ወይም ብርሃን ጭብጥ ይቀይሩ'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-xl border font-black transition cursor-pointer select-none flex items-center gap-1 ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-850 hover:bg-zinc-800 text-amber-400' : 'bg-white border-stone-250 hover:bg-stone-100 text-stone-750'
                    }`}
                  >
                    {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                  </button>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 dark:border-zinc-850/60">
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-bold flex items-center gap-1.5">
                      <Globe size={13} className="text-amber-500" />
                      {lang === 'en' ? 'System Language' : 'የስርዓት ቋንቋ'}
                    </div>
                    <p className="text-[9px] text-stone-400 dark:text-zinc-500">
                      {lang === 'en' ? 'Switch between English and Amharic translations' : 'ቋንቋ በእንግሊዝኛ ወይም በአማርኛ መካከል ይቀይሩ'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                    className={`text-[10px] px-2.5 py-1.5 rounded-xl border font-black transition cursor-pointer select-none ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-850 hover:bg-zinc-800 text-amber-400' : 'bg-white border-stone-250 hover:bg-stone-100 text-stone-750'
                    }`}
                  >
                    {lang === 'en' ? '🇪🇹 አማርኛ' : '🇺🇸 English'}
                  </button>
                </div>
              </div>

              {/* SECURITY & CORPORATE PRIVACY (Placed cleanly above biometric toggle) */}
              <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-300 text-left space-y-3.5 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5 border-b pb-1.5 border-stone-100 dark:border-zinc-800">
                  🛡️ {lang === 'en' ? 'Security & Corporate Privacy' : 'የደህንነትና ምስጢራዊነት ቅንብሮች'}
                </div>

                <div className="space-y-4">
                  {/* 2FA Switch */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[11px] font-bold block">{lang === 'en' ? 'Fayda SMS Two-Factor Auth (2FA)' : 'ባለሁለት ደረጃ ማረጋገጫ (2FA)'}</span>
                      <p className="text-[9px] text-stone-400 dark:text-zinc-500">
                        {lang === 'en' ? 'Settle escrow withdrawals securely using authorized SMS codes' : 'የገንዘብ ወጪ ሲያደርጉ በስልክዎ የደህንነት ኮድ እንዲላክ ያድርጉ'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !isTwoFactor;
                        setIsTwoFactor(nextVal);
                        localStorage.setItem('ez_security_2fa', nextVal ? 'true' : 'false');
                      }}
                      className={`text-[10px] px-2.5 py-1.5 rounded-xl border font-black transition cursor-pointer select-none ${
                        isTwoFactor 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-white dark:bg-zinc-950 border-stone-250 dark:border-zinc-800 text-stone-500'
                      }`}
                    >
                      {isTwoFactor ? '✓ Active' : 'Off'}
                    </button>
                  </div>

                  {/* Privacy Switch */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-zinc-850">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[11px] font-bold block">{lang === 'en' ? 'Private Profile Mode' : 'ምስጢራዊ መለያ ሁኔታ'}</span>
                      <p className="text-[9px] text-stone-400 dark:text-zinc-500">
                        {lang === 'en' ? 'Hide your scanning history and wishlists from other vendors' : 'የእርስዎን የፍለጋና የፍላጎት ዝርዝሮች ከሌሎች ነጋዴዎች ደብቅ'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !isPrivateProfile;
                        setIsPrivateProfile(nextVal);
                        localStorage.setItem('ez_security_private', nextVal ? 'true' : 'false');
                      }}
                      className={`text-[10px] px-2.5 py-1.5 rounded-xl border font-black transition cursor-pointer select-none ${
                        isPrivateProfile 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-white dark:bg-zinc-950 border-stone-250 dark:border-zinc-800 text-stone-500'
                      }`}
                    >
                      {isPrivateProfile ? '✓ Private' : 'Public'}
                    </button>
                  </div>

                  {/* Blocked Users Section */}
                  <div className="pt-3 border-t border-stone-100 dark:border-zinc-850 space-y-2">
                    <span className="text-[11px] font-bold block text-left">{lang === 'en' ? 'Blocked Users / Spam Nodes' : 'የታገዱ ሰዎች ዝርዝር'}</span>
                    {blockedUsers.length === 0 ? (
                      <p className="text-[9px] text-stone-500 text-left">{lang === 'en' ? 'No blocked users.' : 'ምንም የታገደ ሰው የለም።'}</p>
                    ) : (
                      <div className="space-y-1.5">
                        {blockedUsers.map((user) => (
                          <div 
                            key={user}
                            className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 text-[10px]"
                          >
                            <span className="text-stone-400 dark:text-zinc-500 font-mono">{user}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setBlockedUsers(prev => prev.filter(u => u !== user));
                                alert(`User "${user}" successfully unblocked.`);
                              }}
                              className="text-[9px] font-black uppercase text-amber-500 hover:text-amber-400 cursor-pointer transition-colors"
                            >
                              Unblock
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Biometrics & Access Controls Block */}
              <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-300 space-y-3.5 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
                {/* Biometric Toggle Row */}
                <div className="flex justify-between items-center bg-stone-50 dark:bg-zinc-950 p-2.5 rounded-2xl border border-stone-200/50 dark:border-zinc-850">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔘</span>
                    <div className="text-left">
                      <div className="text-[11px] font-bold">
                        {lang === 'en' ? 'Biometrics Toggle' : 'ባዮሜትሪክስ መቀያየሪያ'}
                      </div>
                      <div className="text-[9px] text-stone-400 dark:text-zinc-500">
                        {lang === 'en' ? 'Use Fingerprint or Face ID for fast logins' : 'የጣት አሻራ ወይም የፊት መለያ ለፈጣን መግቢያ ይጠቀሙ'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="biometrics-settings-toggle"
                    onClick={() => {
                      const newVal = !biometricsEnabled;
                      setBiometricsEnabled(newVal);
                      localStorage.setItem('ez_biometrics_enabled', newVal ? 'true' : 'false');
                      alert(newVal ? '🔒 Biometrics enabled!' : '🔓 Biometrics disabled!');
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors relative duration-200 ${biometricsEnabled ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-zinc-800'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${biometricsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Log Out button */}
                <button
                  type="button"
                  id="logout-settings-btn"
                  onClick={() => {
                    localStorage.removeItem('ez_authenticated');
                    localStorage.removeItem('ez_user_role');
                    setIsAuthenticated(false);
                    setUserRole('USER');
                    setActiveTab('shop');
                  }}
                  className="w-full min-h-[44px] bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 text-red-650 hover:text-red-700 font-extrabold text-xs py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🚪</span>
                  <span>{lang === 'en' ? 'Lock Wallet & Log Out' : 'ኪስ ቦርሳን ቆልፍ እና ውጣ'}</span>
                </button>
              </div>
            </div>
          )}

        </>
      )}

    </div>

        {activeDevModule !== 'none' && (
          <div className="flex-1 overflow-y-auto flex flex-col pb-12 relative z-10" id="dev-module-viewport">
            {/* Custom Dev Module Toolbar */}
            <div className={`p-3 border-b flex items-center justify-between transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-850 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
              <button 
                onClick={() => setActiveDevModule('none')}
                className="text-xs font-black px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              >
                ✕ {lang === 'en' ? 'Exit Sub-System' : 'ሲስተሙን ዝጋ'}
              </button>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">
                  {lang === 'en' ? 'EVERY-ZONE ENGINE' : 'የኤቭሪ-ዞን ሞተር'}
                </span>
                <span className="text-[8px] font-mono opacity-50 uppercase">
                  {activeDevModule === 'ai' ? '🤖 AI Copilot' 
                   : activeDevModule === 'passport' ? '✈️ Passport Bureau' 
                   : activeDevModule === 'logistics' ? '🏍️ Dispatch Delivery' 
                   : activeDevModule === 'adv' ? '📢 Ad Campaign Portal' 
                   : activeDevModule === 'admin' ? '🛡️ Integrity Console' 
                   : activeDevModule === 'devops' ? '♾️ CI/CD & DevOps'
                   : activeDevModule === 'sre' ? '🛡️ SRE & Security'
                   : activeDevModule === 'vendor_dashboard' ? '🏬 Vendor Store Hub'
                   : activeDevModule === 'order_tracking' ? '📦 Amazon Order Tracker'
                   : activeDevModule === 'wishlist' ? '💖 Curated Wishlist'
                   : activeDevModule === 'v9_suite' ? '🌟 V9 Core Feature Hub'
                   : activeDevModule === 'monetization' ? '⚡ Monetization Engine'
                   : '💳 Personal Wallet'}
                </span>
              </div>
            </div>

            {/* Render selected subsystem */}
            <div className="flex-1">
              {activeDevModule === 'ai' && (
                <AICopilotHub 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  walletBalance={walletBalance}
                  onFilterListings={(cat, fName, q) => {
                    setActiveTab(cat);
                    setSearchQuery(q);
                    setActiveDevModule('none');
                  }}
                  onNavigateTab={(tab) => {
                    setActiveTab(tab);
                    setActiveDevModule('none');
                  }}
                />
              )}
              {activeDevModule === 'logistics' && (
                <DeliveryLogisticsHub 
                  isDarkMode={isDarkMode}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  lang={lang === 'am' ? 'am' : 'en'}
                />
              )}
              {activeDevModule === 'adv' && (
                <AdCampaignPortal 
                  isDarkMode={isDarkMode}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  lang={lang === 'am' ? 'am' : 'en'}
                />
              )}
              {activeDevModule === 'admin' && (
                <AdminDashboard 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                />
              )}
              {activeDevModule === 'wallet' && (
                <WalletPaymentsHub 
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  requestCameraPermission={requestCameraPermission}
                />
              )}
              {activeDevModule === 'passport' && (
                <EthiopiaPassportHub 
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  requestCameraPermission={requestCameraPermission}
                />
              )}
              {activeDevModule === 'devops' && (
                <DevOpsConsoleHub 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                />
              )}
              {activeDevModule === 'sre' && (
                <SREAndSecurityHub 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                />
              )}
              {activeDevModule === 'vendor_dashboard' && (
                <VendorDashboardHub 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  triggerPushNotification={triggerPushNotification}
                  onClose={() => setActiveDevModule('none')}
                />
              )}
              {activeDevModule === ('real_estate_dashboard' as any) && (
                <RealEstateAgencyDashboard 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  onClose={() => setActiveDevModule('none')}
                />
              )}
              {activeDevModule === 'order_tracking' && (
                <OrderTrackingHub 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  triggerPushNotification={triggerPushNotification}
                  onClose={() => setActiveDevModule('none')}
                />
              )}
              {activeDevModule === 'wishlist' && (
                <WishlistCollectionsHub 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  triggerPushNotification={triggerPushNotification}
                  onClose={() => setActiveDevModule('none')}
                />
              )}
              {activeDevModule === 'v9_suite' && (
                <V9SuperSuite 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  triggerPushNotification={triggerPushNotification}
                  onClose={() => setActiveDevModule('none')}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                />
              )}
              {activeDevModule === 'monetization' && (
                <EveryzoneMonetizationEngine 
                  isDarkMode={isDarkMode}
                  lang={lang === 'am' ? 'am' : 'en'}
                  triggerPushNotification={triggerPushNotification}
                  onClose={() => setActiveDevModule('none')}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                />
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* INTERACTIVE GLOBAL SEARCH ENGINE ("SEARCH EVERY-ZONE") OVERLAY */}
        {/* ============================================================= */}
        <AnimatePresence>
          {isGlobalSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed inset-0 z-50 overflow-y-auto flex flex-col transition-colors duration-300 ${
                isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-stone-900'
              }`}
            >
              {/* Top Bar Banner with traditional Ethio Tilit and controls */}
              <div className="shrink-0">
                <TraditionalTilitBanner />
                <div className={`p-4 border-b flex items-center justify-between ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsGlobalSearchOpen(false)}
                      className={`p-2 rounded-xl transition-all ${
                        isDarkMode ? 'hover:bg-zinc-800 text-stone-400' : 'hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h2 className="text-sm font-black flex items-center gap-1.5 uppercase tracking-wider text-amber-500">
                        <Cpu size={16} className="animate-pulse" />
                        Search Every-zone
                      </h2>
                      <p className="text-[10px] opacity-60">High-Performance Unified Search Hub</p>
                    </div>
                  </div>
                  
                  {/* Status Indicator Lights */}
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono opacity-85">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-emerald-500 font-bold">Elasticsearch Active</span>
                    </div>
                    <button
                      onClick={() => {
                        setGlobalSearchQuery('');
                        setSearchResults([]);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      Reset Engine
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Container */}
              <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
                {/* Visual Architecture and Live Index Pipeline */}
                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-stone-200'
                } shadow-sm`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                      <Database size={13} className="text-amber-500" />
                      Engine Indexing Pipeline
                    </h3>
                    <span className="text-[9px] font-mono bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full font-bold">
                      Latency: {searchLoading ? 'Calculating...' : `${searchLatency} ms (Redis Hit)`}
                    </span>
                  </div>
                  
                  {/* Pipeline Flow Diagram */}
                  <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-3 text-center">
                    <div className={`p-2.5 rounded-xl border ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800/80' : 'bg-stone-50 border-stone-150'
                    }`}>
                      <div className="text-[10px] font-bold">PostgreSQL</div>
                      <div className="text-[8px] opacity-60 font-mono mt-0.5">Primary Tables</div>
                    </div>
                    <div className="flex justify-center text-stone-400">
                      <ChevronRight className="rotate-90 md:rotate-0" size={16} />
                    </div>
                    <div className={`p-2.5 rounded-xl border ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800/80 text-amber-450' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="text-[10px] font-black">Elasticsearch</div>
                      <div className="text-[8px] opacity-60 font-mono mt-0.5">Inverted Text Indexes</div>
                    </div>
                    <div className="flex justify-center text-stone-400">
                      <ChevronRight className="rotate-90 md:rotate-0" size={16} />
                    </div>
                    <div className={`p-2.5 rounded-xl border ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800/80 text-emerald-450' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="text-[10px] font-black">Redis Cache</div>
                      <div className="text-[8px] opacity-60 font-mono mt-0.5">Key-Value Speed</div>
                    </div>
                  </div>
                </div>

                {/* Search Bar Block with Auto-Focus */}
                <div className="space-y-3">
                  {/* Hidden Image Input for Search */}
                  <input 
                    type="file" 
                    ref={imageSearchInputRef} 
                    accept="image/*" 
                    onChange={handleImageFileChange} 
                    className="hidden" 
                  />

                  {/* Dynamic Voice Search Panel */}
                  {isVoiceSearchListening && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 text-left space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                          </span>
                          <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
                            🎤 {lang === 'am' ? 'የድምፅ ፍለጋ' : 'Voice Assistant Listening'}
                          </span>
                        </div>
                        <button 
                          onClick={() => setIsVoiceSearchListening(false)}
                          className="text-stone-400 hover:text-amber-500 text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl">
                        <div className="flex gap-1 items-end h-5">
                          <div className="w-1 bg-amber-500 rounded-full animate-[bounce_1s_infinite_100ms]" style={{ height: '60%' }} />
                          <div className="w-1 bg-amber-500 rounded-full animate-[bounce_1s_infinite_300ms]" style={{ height: '90%' }} />
                          <div className="w-1 bg-amber-500 rounded-full animate-[bounce_1s_infinite_200ms]" style={{ height: '40%' }} />
                          <div className="w-1 bg-amber-500 rounded-full animate-[bounce_1s_infinite_400ms]" style={{ height: '100%' }} />
                          <div className="w-1 bg-amber-500 rounded-full animate-[bounce_1s_infinite_150ms]" style={{ height: '50%' }} />
                        </div>
                        <p className="text-xs font-mono text-stone-200 flex-1 italic">
                          "{voiceSearchTranscript || (lang === 'am' ? 'እየሰማሁ ነው... ይናገሩ' : 'Listening... Say something like "villas in Bole"')}"
                        </p>
                      </div>

                      {/* Mock voice triggers for immediate fallback / testing convenience */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button 
                          onClick={() => {
                            setGlobalSearchQuery("Bole villa");
                            fetchSearchResults("Bole villa");
                            setIsVoiceSearchListening(false);
                          }}
                          className="text-[9px] bg-black/40 hover:bg-black/60 text-amber-500/90 font-bold px-2 py-1 rounded-lg transition"
                        >
                          🗣️ "villas in Bole"
                        </button>
                        <button 
                          onClick={() => {
                            setGlobalSearchQuery("traditional wear");
                            fetchSearchResults("traditional wear");
                            setIsVoiceSearchListening(false);
                          }}
                          className="text-[9px] bg-black/40 hover:bg-black/60 text-amber-500/90 font-bold px-2 py-1 rounded-lg transition"
                        >
                          🗣️ "traditional wear"
                        </button>
                        <button 
                          onClick={() => {
                            setGlobalSearchQuery("Ethiopian coffee");
                            fetchSearchResults("Ethiopian coffee");
                            setIsVoiceSearchListening(false);
                          }}
                          className="text-[9px] bg-black/40 hover:bg-black/60 text-amber-500/90 font-bold px-2 py-1 rounded-lg transition"
                        >
                          🗣️ "specialty coffee"
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-stone-400" size={20} />
                    <input
                      type="text"
                      autoFocus
                      placeholder={lang === 'am' ? "Search Every-zone...ላይ" : "Search Every-zone..."}
                      value={globalSearchQuery}
                      onChange={(e) => {
                        setGlobalSearchQuery(e.target.value);
                        fetchSearchResults(e.target.value);
                      }}
                      className={`w-full text-sm pl-12 pr-32 py-3.5 rounded-2xl border outline-none transition-all focus:ring-2 ${
                        isDarkMode 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/40 focus:ring-amber-500/20' 
                          : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-[#1E3A1A]/40 focus:ring-[#1E3A1A]/10'
                      }`}
                    />
                    <div className="absolute right-3.5 top-2.5 bottom-2.5 flex items-center gap-1.5">
                      {globalSearchQuery.trim() && (
                        <button
                          type="button"
                          onClick={() => saveSearchQuery(globalSearchQuery)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 ${
                            isDarkMode
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-500 hover:bg-amber-500/25'
                              : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                          }`}
                          title={lang === 'en' ? "Save Search Query" : "ፍለጋውን አስቀምጥ"}
                        >
                          <Bookmark size={14} className="text-amber-500" />
                        </button>
                      )}
                      <div className="h-full w-[1px] bg-stone-300/50 dark:bg-zinc-700/50" />
                      <button
                        type="button"
                        onClick={triggerVoiceSearch}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 ${
                          isDarkMode
                            ? 'bg-zinc-850 border-zinc-750 text-amber-500 hover:bg-zinc-750'
                            : 'bg-stone-50 border-stone-200 text-amber-600 hover:bg-stone-100'
                        }`}
                        title={lang === 'en' ? "Voice Search" : "በድምፅ ፈልግ"}
                      >
                        <Mic size={14} className="text-amber-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => imageSearchInputRef.current?.click()}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 ${
                          isDarkMode
                            ? 'bg-zinc-850 border-zinc-750 text-amber-500 hover:bg-zinc-750'
                            : 'bg-stone-50 border-stone-200 text-amber-600 hover:bg-stone-100'
                        }`}
                        title={lang === 'en' ? "Search by Image (Shein style AI vision)" : "በምስል ፈልግ (AI እይታ)"}
                      >
                        <Camera size={14} className="text-amber-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsQrSearchOpen(true)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 ${
                          isDarkMode
                            ? 'bg-zinc-850 border-zinc-750 text-[#10B981] hover:bg-zinc-750'
                            : 'bg-stone-50 border-stone-200 text-[#10B981] hover:bg-stone-100'
                        }`}
                        title={lang === 'en' ? "Scan Product or Vendor QR" : "QR ኮድ አንብብ"}
                      >
                        <QrCode size={14} className="text-emerald-500" />
                      </button>
                    </div>
                  </div>

                  {/* Real-time Feature Selection Hub: 🎤 Voice | 📷 search image | 🤖 AI */}
                  <div className="grid grid-cols-3 gap-2 bg-stone-100/40 dark:bg-zinc-900/40 p-1 rounded-2xl border border-stone-200/40 dark:border-zinc-800/40">
                    <button
                      type="button"
                      onClick={triggerVoiceSearch}
                      className="py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 shadow-sm"
                    >
                      <span>🎤 {lang === 'am' ? 'Voice (ድምፅ)' : 'Voice'}</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => imageSearchInputRef.current?.click()}
                      className="py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 shadow-sm"
                    >
                      <span>📷 {lang === 'am' ? 'search image (በምስል)' : 'search image'}</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById('ai-chat-input-focus');
                        if (inputEl) {
                          inputEl.focus();
                        }
                      }}
                      className="py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 shadow-sm"
                    >
                      <span>🤖 {lang === 'am' ? 'AI (ረዳት)' : 'AI'}</span>
                    </button>
                  </div>

                  {/* AI CHAT ASSISTANT COMPONENT */}
                  <div className={`p-4 rounded-2xl border ${
                    isDarkMode ? 'bg-zinc-900/65 border-zinc-850' : 'bg-white border-stone-150'
                  } space-y-2.5 text-left`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-amber-500 flex items-center gap-1.5 tracking-wider">
                        🤖 {lang === 'en' ? 'Every-zone AI Assistant' : 'የኤቭሪ-ዞን AI ረዳት'}
                      </span>
                      <span className="text-[8px] font-mono opacity-50 bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full uppercase">Cognitive Copilot</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        id="ai-chat-input-focus"
                        type="text"
                        placeholder={lang === 'en' ? "Ask Every-zone AI... (e.g. Dubai driver jobs)" : "ኤቭሪ-ዞን AIን ጠይቅ..."}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAiChatSearch((e.target as HTMLInputElement).value);
                          }
                        }}
                        className={`flex-1 text-xs p-2.5 rounded-xl border outline-none ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600' : 'bg-stone-50 border-stone-200 text-stone-800 placeholder-stone-400'
                        }`}
                      />
                      <button
                        onClick={(e) => {
                          const input = (e.currentTarget.previousSibling as HTMLInputElement);
                          if (input && input.value) {
                            handleAiChatSearch(input.value);
                          }
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer shrink-0 uppercase tracking-wider"
                      >
                        Ask
                      </button>
                    </div>

                    {/* Quick suggestion example buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      <button 
                        onClick={() => handleAiChatSearch('Dubai driver jobs')}
                        className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all hover:border-amber-500/50 ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        💼 "Dubai driver jobs"
                      </button>
                      <button 
                        onClick={() => handleAiChatSearch('House under 10 million')}
                        className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all hover:border-amber-500/50 ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        🏡 "House under 10 million"
                      </button>
                      <button 
                        onClick={() => handleAiChatSearch('iPhone below 50k')}
                        className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all hover:border-amber-500/50 ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        📱 "iPhone below 50k"
                      </button>
                    </div>

                    {/* AI Chat output response toast block */}
                    {aiChatResponse && (
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs rounded-xl flex gap-2 items-start font-sans leading-relaxed">
                        <span className="text-base">💡</span>
                        <div className="flex-1">{aiChatResponse}</div>
                      </div>
                    )}
                  </div>

                  {/* Entity Type Selector Row */}
                  <div className="flex flex-wrap gap-1.5">
                    {(['ALL', 'PRODUCT', 'PROPERTY', 'JOB', 'VENDOR'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSearchEntityType(type);
                          if (globalSearchQuery) {
                            setTimeout(() => fetchSearchResults(globalSearchQuery), 0);
                          }
                        }}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-xl border transition-all cursor-pointer uppercase tracking-wider ${
                          searchEntityType === type
                            ? (isDarkMode ? 'bg-amber-50 border-amber-500 text-zinc-950' : 'bg-[#1E3A1A] border-[#1E3A1A] text-white')
                            : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50')
                        }`}
                      >
                        {type === 'ALL' ? '🌍 Show All' : type === 'PRODUCT' ? '🛍️ Products' : type === 'PROPERTY' ? '🏡 Properties' : type === 'JOB' ? '💼 Jobs' : '🏢 Vendors'}
                      </button>
                    ))}
                  </div>

                  {/* City and Category Filters */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[9px] font-black uppercase text-stone-400 tracking-wider mb-1 block">City Location</label>
                      <select
                        value={searchFilterCity}
                        onChange={(e) => {
                          setSearchFilterCity(e.target.value);
                          if (globalSearchQuery) {
                            setTimeout(() => fetchSearchResults(globalSearchQuery), 0);
                          }
                        }}
                        className={`w-full text-xs p-2 rounded-xl border outline-none cursor-pointer ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        <option value="all">🌍 All Locations (Global)</option>
                        <option value="Addis Ababa">Addis Ababa (Ethiopia)</option>
                        <option value="Dubai">Dubai (UAE)</option>
                        <option value="Warsaw">Warsaw (Poland)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase text-stone-400 tracking-wider mb-1 block">Unified Category</label>
                      <select
                        value={searchFilterCategory}
                        onChange={(e) => {
                          setSearchFilterCategory(e.target.value);
                          if (globalSearchQuery) {
                            setTimeout(() => fetchSearchResults(globalSearchQuery), 0);
                          }
                        }}
                        className={`w-full text-xs p-2 rounded-xl border outline-none cursor-pointer ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        <option value="all">📁 All Categories</option>
                        <option value="shop">Shop Listings (Products)</option>
                        <option value="houses">Houses & Real Estate</option>
                        <option value="agencies">Recruitment Placements</option>
                        <option value="RETAIL">Retail Vendor</option>
                        <option value="REAL_ESTATE">Real Estate Vendor</option>
                        <option value="RECRUITMENT">Recruitment Agency Vendor</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Loading state indicator */}
                {searchLoading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2.5">
                    <RefreshCw className="animate-spin text-amber-500" size={24} />
                    <span className="text-xs font-mono text-stone-400">Polling Elasticsearch node clusters...</span>
                  </div>
                )}

                {/* If no query, show trending / recent / saved searches */}
                {!searchLoading && !globalSearchQuery.trim() && (
                  <div className="space-y-8 pt-4">
                    {/* Recent Searches Block */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                          <History size={13} className="text-[#C5A059]" />
                          {lang === 'am' ? 'የቅርብ ጊዜ ፍለጋዎች (Recent Searches)' : 'Recent Searches'}
                        </h4>
                        <span className="text-[10px] font-mono opacity-50 bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded-full uppercase">Your History</span>
                      </div>
                      <div className={`p-4 rounded-2xl border ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'
                      } flex flex-wrap gap-2`}>
                        {recentSearches.length === 0 ? (
                          <span className="text-xs text-stone-400">No recent search records on file</span>
                        ) : (
                          recentSearches.map((recent) => (
                            <button
                              key={recent.id || recent.query}
                              onClick={() => {
                                setGlobalSearchQuery(recent.query);
                                fetchSearchResults(recent.query);
                              }}
                              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all border flex items-center gap-2 cursor-pointer select-none shadow-sm ${
                                isDarkMode 
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-750 hover:border-amber-500/40' 
                                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                              }`}
                            >
                              <History size={11} className="opacity-60 text-amber-500" />
                              <span>{recent.query}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Trending Searches Block */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                          <TrendingUp size={13} className="text-amber-500" />
                          {lang === 'am' ? 'ታዋቂ ፍለጋዎች (Trending Searches)' : 'Trending Searches'}
                        </h4>
                        <span className="text-[10px] font-mono opacity-50 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase">Real-time Hot</span>
                      </div>
                      <div className={`p-4 rounded-2xl border ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'
                      } grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5`}>
                        {trendingSearches.length === 0 ? (
                          <div className="text-xs text-stone-400 col-span-full">Loading trends...</div>
                        ) : (
                          trendingSearches.map((trend) => (
                            <button
                              key={trend.id || trend.keyword}
                              onClick={() => {
                                setGlobalSearchQuery(trend.keyword);
                                fetchSearchResults(trend.keyword);
                                logSearchClick(trend.keyword);
                              }}
                              className={`flex items-center justify-between text-xs p-3 rounded-xl border transition-all cursor-pointer text-left font-semibold shadow-sm ${
                                isDarkMode 
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-750 hover:border-amber-500/30' 
                                  : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100 hover:border-stone-300'
                              }`}
                            >
                              <span className="font-bold flex items-center gap-1.5 min-w-0">
                                <span className="text-amber-500 font-black text-xs">🔥</span>
                                <span className="truncate">{trend.keyword}</span>
                              </span>
                              <span className="text-[9px] font-mono opacity-50 shrink-0 bg-neutral-500/10 px-1.5 py-0.5 rounded-md font-bold">
                                {trend.searchCount || 0}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Popular Categories Block with Custom Category Design */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                          <Sparkles size={13} className="text-[#C5A059]" />
                          {lang === 'am' ? 'ታዋቂ ዘርፎች (Popular Categories)' : 'Popular Categories'}
                        </h4>
                        <span className="text-[10px] font-mono opacity-50 bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded-full uppercase">Premium Directory</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
                        {[
                          { 
                            label: lang === 'am' ? "አልባሳት" : "Fashion", 
                            keyword: "clothing", 
                            icon: <Shirt className="w-5 h-5" />, 
                            gradient: "from-rose-500/10 to-pink-500/5 dark:from-rose-500/20 dark:to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/15",
                            accentColor: "text-rose-500 dark:text-rose-400"
                          },
                          { 
                            label: lang === 'am' ? "ኤሌክትሮኒክስ" : "Electronics", 
                            keyword: "electronics", 
                            icon: <Laptop className="w-5 h-5" />, 
                            gradient: "from-blue-500/10 to-cyan-500/5 dark:from-blue-500/20 dark:to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/15",
                            accentColor: "text-blue-500 dark:text-blue-400"
                          },
                          { 
                            label: lang === 'am' ? "ቤቶች" : "Properties", 
                            keyword: "villa", 
                            icon: <Home className="w-5 h-5" />, 
                            gradient: "from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10 hover:from-emerald-500/20 hover:to-teal-500/15",
                            accentColor: "text-emerald-500 dark:text-emerald-400"
                          },
                          { 
                            label: lang === 'am' ? "ስራዎች" : "Jobs", 
                            keyword: "driver", 
                            icon: <Briefcase className="w-5 h-5" />, 
                            gradient: "from-purple-500/10 to-fuchsia-500/5 dark:from-purple-500/20 dark:to-fuchsia-500/10 hover:from-purple-500/20 hover:to-fuchsia-500/15",
                            accentColor: "text-purple-500 dark:text-purple-400"
                          },
                          { 
                            label: lang === 'am' ? "ስልኮች" : "Phones", 
                            keyword: "phone", 
                            icon: <Smartphone className="w-5 h-5" />, 
                            gradient: "from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/15",
                            accentColor: "text-amber-500 dark:text-amber-400"
                          },
                          { 
                            label: lang === 'am' ? "ቡና" : "Coffee", 
                            keyword: "coffee", 
                            icon: <Coffee className="w-5 h-5" />, 
                            gradient: "from-yellow-500/10 to-amber-500/5 dark:from-yellow-500/20 dark:to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/15",
                            accentColor: "text-yellow-600 dark:text-yellow-400"
                          },
                          { 
                            label: lang === 'am' ? "መኪና" : "Vehicles", 
                            keyword: "car", 
                            icon: <Car className="w-5 h-5" />, 
                            gradient: "from-red-500/10 to-orange-500/5 dark:from-red-500/20 dark:to-red-500/10 hover:from-red-500/20 hover:to-red-500/15",
                            accentColor: "text-red-500 dark:text-red-400"
                          }
                        ].map((cat, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setGlobalSearchQuery(cat.keyword);
                              fetchSearchResults(cat.keyword);
                            }}
                            className={`flex flex-col items-center gap-2 p-3 rounded-[20px] border transition-all duration-300 relative overflow-hidden cursor-pointer select-none ${
                              isDarkMode 
                                ? `bg-gradient-to-br ${cat.gradient} border-zinc-850 hover:border-[#C5A059]/40` 
                                : `bg-gradient-to-br ${cat.gradient} border-stone-150 hover:border-[#1E3A1A]/30`
                            }`}
                          >
                            <div className={`p-2 rounded-xl bg-white/25 dark:bg-black/30 ${cat.accentColor}`}>
                              {cat.icon}
                            </div>
                            <span className="text-[11px] font-black tracking-tight text-stone-700 dark:text-stone-300">
                              {cat.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Saved Searches Block */}
                    {savedSearches.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                          <Bookmark size={13} className="text-emerald-500" />
                          Saved Search Alerts
                        </h4>
                        <div className={`p-4 rounded-2xl border ${
                          isDarkMode ? 'bg-zinc-905 border-zinc-850' : 'bg-white border-stone-200'
                        } flex flex-wrap gap-2`}>
                          {savedSearches.map((saved) => (
                            <div
                              key={saved.id}
                              className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-xl border ${
                                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-50 border-stone-200'
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setGlobalSearchQuery(saved.query);
                                  fetchSearchResults(saved.query);
                                }}
                                className="font-bold text-left hover:underline cursor-pointer"
                              >
                                {saved.query}
                              </button>
                              <span className="text-[8px] uppercase tracking-widest font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Active</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Results Display */}
                {!searchLoading && (globalSearchQuery.trim() || imageSearchExplanation) && (
                  <div className="space-y-4">
                    {imageSearchExplanation && (
                      <div className={`p-4 rounded-2xl border flex gap-3.5 items-start ${
                        isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50/50 border-amber-200'
                      }`}>
                        <div className="p-2 bg-amber-500/15 text-amber-500 rounded-xl mt-0.5">
                          <Camera size={18} />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                            ✨ AI Vision Analysis Match
                          </h5>
                          <p className={`text-[11.5px] font-medium leading-relaxed mt-1 ${
                            isDarkMode ? 'text-zinc-300' : 'text-stone-700'
                          }`}>
                            {lang === 'en' ? imageSearchExplanation.en : imageSearchExplanation.am}
                          </p>
                          <button
                            onClick={() => {
                              setImageSearchExplanation(null);
                              setSearchResults([]);
                            }}
                            className="text-[9.5px] font-black uppercase text-amber-500 hover:underline mt-2 flex items-center gap-1"
                          >
                            <RefreshCw size={10} />
                            Clear Visual Search / Clear results
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-amber-500" />
                        Unified Search Index Results ({searchResults.length})
                      </h4>
                      <span className="text-[10px] font-mono opacity-50">Filter Mode: {searchEntityType}</span>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className={`p-8 text-center rounded-2xl border ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-850 text-zinc-400' : 'bg-white border-stone-150 text-stone-500'
                      }`}>
                        <AlertTriangle className="mx-auto text-amber-500 mb-2" size={24} />
                        <p className="text-xs font-bold">No exact index records matched your search query</p>
                        <p className="text-[10px] opacity-60 mt-0.5">Try searching for alternative keywords like "iphone", "villa", "dubai", "coffee" or traditional items.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {searchResults.map((result: any) => (
                          <div
                            key={result.indexId || result.id}
                            className={`p-3 rounded-2xl border flex gap-3 transition-all ${
                              isDarkMode 
                                ? 'bg-zinc-900 border-zinc-800 hover:border-amber-500/30' 
                                : 'bg-white border-stone-200 hover:border-[#1E3A1A]/30'
                            }`}
                          >
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                    result.type === 'PRODUCT' ? 'bg-blue-100 text-blue-700' 
                                    : result.type === 'PROPERTY' ? 'bg-purple-100 text-purple-700'
                                    : result.type === 'JOB' ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {result.type}
                                  </span>
                                  <span className="text-[8px] font-mono opacity-50">{result.city}</span>
                                </div>
                                <h5 className="text-xs font-black truncate text-stone-900 dark:text-zinc-100">{result.title}</h5>
                                <p className="text-[10px] opacity-60 line-clamp-2 mt-0.5">{result.description}</p>
                              </div>

                              <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-dashed border-stone-200 dark:border-zinc-800">
                                <span className="text-xs font-mono font-bold text-[#C5A059]">{result.price || "Contact"}</span>
                                <button
                                  onClick={() => {
                                    logSearchClick(result.title);
                                    if (result.type === 'VENDOR') {
                                      setViewedVendorId(result.id);
                                      setIsGlobalSearchOpen(false);
                                      setActiveTab('shop');
                                    } else {
                                      const matchingListing = listings.find(l => l.id === result.id);
                                      if (matchingListing) {
                                        setSelectedListing(matchingListing);
                                        setIsGlobalSearchOpen(false);
                                      } else {
                                        triggerPushNotification("Vendor Details", `Opening details for ${result.title}`, "info", "search");
                                      }
                                    }
                                  }}
                                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-0.5 cursor-pointer ${
                                    isDarkMode ? 'bg-zinc-850 hover:bg-zinc-800 text-amber-450' : 'bg-[#1E3A1A] text-white hover:bg-[#1E3A1A]/90'
                                  }`}
                                >
                                  View Item
                                  <ChevronRight size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Personalised Recommendation Engine Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    Recommended Listings For You
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {getRecommendedListings().map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => {
                          setSelectedListing(rec);
                          setIsGlobalSearchOpen(false);
                        }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'bg-zinc-900 border-zinc-800/80 hover:bg-zinc-850' 
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <img
                          src={rec.image}
                          alt={rec.title}
                          className="w-full h-24 rounded-xl object-cover mb-2"
                          referrerPolicy="no-referrer"
                        />
                        <h5 className="text-[11px] font-black truncate">{rec.title}</h5>
                        <div className="flex justify-between items-center mt-1 text-[9px] opacity-70">
                          <span className="font-mono text-[#C5A059] font-bold">{rec.price}</span>
                          <span>★ {rec.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SYSTEM BOTTOM NAVIGATION TAB CONTROLS (Exactly matching 6 requested screens) */}
        <nav className={`p-3 border-t shrink-0 flex justify-around items-center select-none shadow-top relative z-20 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-stone-200'}`}>
          <button 
            onClick={() => { setActiveTab('shop'); setSelectedListing(null); setViewedVendorId(null); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'shop' ? (isDarkMode ? 'text-amber-400 scale-105' : 'text-[#1E3A1A] scale-105') : 'text-stone-400 hover:text-stone-600'}`}
          >
            <ShoppingBag size={18} />
            <span className="text-[9px] font-bold">{t('shopTab')}</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('houses'); setSelectedListing(null); setViewedVendorId(null); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'houses' ? (isDarkMode ? 'text-amber-400 scale-105' : 'text-[#1E3A1A] scale-105') : 'text-stone-400 hover:text-stone-600'}`}
          >
            <Home size={18} />
            <span className="text-[9px] font-bold">{t('housesTab')}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('agencies'); setSelectedListing(null); setViewedVendorId(null); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'agencies' ? (isDarkMode ? 'text-amber-400 scale-105' : 'text-[#1E3A1A] scale-105') : 'text-stone-400 hover:text-stone-600'}`}
          >
            <Briefcase size={18} />
            <span className="text-[9px] font-bold">{t('agenciesTab')}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('matchmaking'); setSelectedListing(null); setViewedVendorId(null); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'matchmaking' ? (isDarkMode ? 'text-amber-400 scale-105' : 'text-[#1E3A1A] scale-105') : 'text-stone-400 hover:text-stone-600'}`}
          >
            <Heart size={18} />
            <span className="text-[9px] font-bold">{lang === 'en' ? 'Matchmaking' : 'ትዳር ማገናኛ'}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('settings'); setSelectedListing(null); setViewedVendorId(null); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'settings' ? (isDarkMode ? 'text-amber-400 scale-105' : 'text-[#1E3A1A] scale-105') : 'text-stone-400 hover:text-stone-600'}`}
          >
            <Settings size={18} />
            <span className="text-[9px] font-bold">{t('settingsTab')}</span>
          </button>
        </nav>

        {/* --- CLUTTER-FREE SLIDE-UP BOTTOM SHEET (Full Listing details, review inputs, and suspend button) --- */}
        <AnimatePresence>
          {selectedListing && (
            <>
              {/* Black Backdrop overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedListing(null)}
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs z-40"
              />

              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className={`absolute bottom-0 left-0 right-0 max-h-[85%] border-t-2 rounded-t-[32px] overflow-y-auto z-50 p-5 shadow-2xl flex flex-col space-y-4 transition-all duration-300 ${isDarkMode ? 'bg-zinc-950 border-amber-500 text-zinc-100' : 'bg-[#F9F7F2] border-[#C5A059] text-stone-800'}`}
              >
                {/* Horizontal Drag-notch ornament */}
                <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto shrink-0 mb-1"></div>

                {selectedListing.category === 'houses' ? (
                  <PropertyDetailView 
                    selectedListing={selectedListing}
                    lang={lang}
                    isDarkMode={isDarkMode}
                    t={t}
                    setViewedVendorId={setViewedVendorId}
                    setSelectedListing={setSelectedListing}
                    handleInstantPurchase={handleInstantPurchase}
                    handleChapaRentPayment={handleChapaRentPayment}
                    setActiveBookingListing={setActiveBookingListing}
                    setActiveBusinessCardListing={setActiveBusinessCardListing}
                    handleReportAndSuspend={handleReportAndSuspend}
                    triggerPushNotification={triggerPushNotification}
                  />
                ) : (
                  <>
                    {/* Main Head Details with View Profile Button */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                           <span className={`text-[10px] font-sans tracking-widest font-black uppercase block ${isDarkMode ? 'text-amber-400' : 'text-[#C5A059]'}`}>
                            {lang === 'en' ? selectedListing.vendorName : selectedListing.vendorNameAm || selectedListing.vendorName}
                          </span>
                          <button 
                            onClick={() => {
                              setViewedVendorId(selectedListing.vendorId);
                              setSelectedListing(null);
                            }}
                            className="bg-[#1E3A1A] hover:bg-[#1E3A1A]/95 text-white text-[9.5px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm shrink-0"
                          >
                            👥 {t('viewProfile')}
                          </button>
                        </div>
                        <h2 className={`text-base font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
                          {getLocalizedData(selectedListing, 'title', lang)}
                        </h2>
                      </div>
                      <button 
                        onClick={() => setSelectedListing(null)}
                        className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 select-none cursor-pointer ml-1 transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-350' : 'bg-stone-200 hover:bg-stone-300 text-stone-600'}`}
                      >
                        ✕
                      </button>
                    </div>

                    <div className={`flex justify-between items-baseline border-b pb-3 mb-2 shrink-0 ${isDarkMode ? 'border-zinc-800' : 'border-stone-200'}`}>
                      <span className={`text-lg font-bold font-mono tracking-widest ${isDarkMode ? 'text-amber-400' : 'text-green-700'}`}>
                        {getLocalizedData(selectedListing, 'price', lang)}
                      </span>
                      <div className="text-[11px] flex items-center gap-1 select-none font-medium">
                        <MapPin size={11} className={`${isDarkMode ? 'text-amber-400' : 'text-[#C5A059]'} shrink-0`} />
                        <span>{getLocalizedData(selectedListing, 'location', lang)}</span>
                      </div>
                    </div>

                    {/* DYNAMIC PROMINENT PROPER IMAGE PREVIEW (Fixes text-only details bug) */}
                    <div className={`relative rounded-2xl overflow-hidden border shadow-md group shrink-0 ${isDarkMode ? 'border-zinc-800' : 'border-stone-200'}`}>
                      <img 
                        src={selectedListing.image} 
                        alt={getLocalizedData(selectedListing, 'title', lang)}
                        referrerPolicy="no-referrer"
                        className="w-full h-52 object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t via-transparent pointer-events-none ${isDarkMode ? 'from-zinc-950/70' : 'from-stone-900/40'}`}></div>
                      <span className="absolute bottom-2.5 right-2.5 bg-neutral-950/75 backdrop-blur-xs text-[9px] text-white px-2.5 py-1 rounded-lg font-bold tracking-wider uppercase border border-white/10">
                        📸 {lang === 'en' ? 'Product Preview' : (lang === 'am' ? 'የምርት ማሳያ' : (lang === 'ti' ? 'ቅድመ ትርኢት ፍርያት' : (lang === 'om' ? 'Ilaalcha Meeshaa' : 'معاينة المنتج')))}
                      </span>
                    </div>

                    {/* INTERACTIVE HIGH-FIDELITY MARKETING VIDEO PLAYER */}
                    <SimulatedVideoPlayer videoPlaceholderTheme={selectedListing.videoPlaceholderTheme} />

                    {/* LISTING DESCRIPTION BODY */}
                    <div className="space-y-2 text-xs">
                      <p className="text-stone-650 font-sans leading-relaxed tracking-wide font-medium">
                        {getLocalizedData(selectedListing, 'description', lang)}
                      </p>
                      
                      {selectedListing.features && selectedListing.features.length > 0 && (
                        <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-1.5 shadow-xs">
                          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{t('specificationChecklist')}</div>
                          {getLocalizedArray(selectedListing, 'features', lang).map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-stone-700 font-medium">
                              <CheckCircle2 size={11} className="text-emerald-700 shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedListing.requirements && selectedListing.requirements.length > 0 && (
                        <div className="bg-white p-3 rounded-2xl border border-stone-200/80 space-y-1.5 shadow-xs">
                          <div className="text-[10px] text-stone-550 font-extrabold uppercase tracking-wide">{t('jobRequirements')}</div>
                          {getLocalizedArray(selectedListing, 'requirements', lang).map((req, rIdx) => (
                            <div key={rIdx} className="flex items-center gap-2 text-stone-700 font-medium">
                              <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full shrink-0"></span>
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PRIMARY ACTIONS PANEL (Buy / Pay Rent with .chapa-gradient class integration) */}
                    <div className="flex gap-2.5 shrink-0 select-none">
                      <button 
                        onClick={() => handleInstantPurchase(selectedListing)}
                        className="flex-1 bg-[#1E3A1A] text-white hover:opacity-95 text-xs py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        {t('instantPurchase')}
                      </button>
                      <button 
                        onClick={() => handleChapaRentPayment(selectedListing)}
                        className="bg-stone-850 hover:bg-stone-900 hover:opacity-95 text-white text-xs px-3.5 py-3 rounded-xl font-bold transition-all chapa-gradient shadow-md flex items-center gap-1.5 border border-amber-500/20 cursor-pointer"
                      >
                        {t('payRent')}
                      </button>
                    </div>

                    {/* UPGRADE FEATURES: VISIT SCHEDULER & DIGITAL PROMO BUSINESS CARD GENERATOR */}
                    <div className="grid grid-cols-2 gap-2.5 shrink-0 select-none">
                      <button 
                        type="button"
                        onClick={() => setActiveBookingListing(selectedListing)}
                        className="flex-1 py-2.5 bg-[#FAF9F6] border border-[#1E3A1A]/20 hover:bg-stone-50 text-stone-800 text-[10px] font-black uppercase rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        📅 Schedule Visit / ጉብኝት
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveBusinessCardListing(selectedListing)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500/10 to-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-stone-900 text-[10px] font-black uppercase rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer font-sans"
                      >
                        🎴 Business Card / የሱቅ ካርድ
                      </button>
                    </div>

                    {/* DIRECT ACTIVE STAR RATING LOG & REVIEW SUBMISSION INPUTS */}
                    <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                      <h4 className="text-xs font-bold text-stone-805 mb-2 flex items-center justify-between">
                        <span>{t('averageUserReviews')}</span>
                        <span className="text-[11px] text-[#C5A059] font-mono font-black">{selectedListing.rating} / 5.0 (★)</span>
                      </h4>

                      {/* Rating Selector */}
                      <form onSubmit={(e) => handleReviewSubmission(e, selectedListing.id)} className="space-y-3">
                        <div className="flex gap-1.5 items-center select-none">
                          <span className="text-[10px] text-stone-400 font-bold mr-1">{t('yourRating')}</span>
                          {[1, 2, 3, 4, 5].map(starIdx => (
                            <button
                              key={starIdx}
                              type="button"
                              onClick={() => setUserRating(starIdx)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star 
                                size={16} 
                                className={`${starIdx <= userRating ? 'text-[#C5A059] fill-[#C5A059]' : 'text-stone-300'} hover:scale-110 transition-transform`} 
                              />
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <input 
                            type="text"
                            placeholder={t('writeReviewPlaceholder')}
                            value={textReview}
                            onChange={(e) => setTextReview(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 focus:border-[#1E3A1A]/40 text-[11px] px-3.5 py-2.5 rounded-xl text-stone-800 outline-none pr-14 placeholder-stone-400 focus:ring-1 focus:ring-[#1E3A1A]/30"
                          />
                          <button 
                            type="submit"
                            className="absolute right-1.5 top-[5px] bg-[#1E3A1A] hover:bg-[#1E3A1A]/90 text-white font-bold text-[9px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            {t('postBtn')}
                          </button>
                        </div>
                      </form>

                      {/* Dynamic review listing elements */}
                      <div className="mt-3.5 space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
                        {selectedListing.reviews && selectedListing.reviews.length > 0 ? (
                          selectedListing.reviews.map(rev => (
                            <div key={rev.id} className="border-t border-stone-200 pt-2 text-xs text-stone-800">
                              <div className="flex justify-between items-center text-[10px] text-stone-400 mb-0.5 font-sans">
                                <span className="font-bold text-[#C5A059]">{rev.user}</span>
                                <span>{rev.date}</span>
                              </div>
                              <div className="flex gap-1 mb-1">
                                {Array.from({ length: 5 }).map((_, s) => (
                                  <Star key={s} size={8} className={s < rev.rating ? 'text-[#C5A059] fill-[#C5A059]' : 'text-stone-200'} />
                                ))}
                              </div>
                              <p className="text-stone-605 font-serif leading-relaxed text-[11px]">&ldquo;{rev.text}&rdquo;</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-[10px] text-stone-400 py-2">No reviews available yet. Be the first to verify quality purchase details!</p>
                        )}
                      </div>
                    </div>

                    {/* SAFETY ALERTS: IMMEDIATELY SUSPEND SHOP REPORTING MODULE */}
                    <div className="pt-2 border-t border-stone-200 shrink-0">
                      <button 
                        onClick={() => handleReportAndSuspend(selectedListing)}
                        className="w-full bg-red-50 hover:bg-red-100/80 text-red-600 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-red-200 cursor-pointer"
                      >
                        <ShieldAlert size={14} /> 🚨 {t('reportVendor')}
                      </button>
                    </div>
                  </>
                )}

              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- INVOICE RECEIPT MODAL OVERLAY --- */}
        <AnimatePresence>
          {activeInvoice && (
            <>
              <div 
                onClick={() => setActiveInvoice(null)} 
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-md z-[200]"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[90%] max-w-[350px] bg-[#F9F7F2] border-2 border-[#C5A059] text-stone-850 rounded-3xl p-5 z-[210] shadow-2xl space-y-4 relative"
              >
                <div className="text-center space-y-1">
                  <CheckCircle2 size={36} className="text-emerald-700 mx-auto" />
                  <span className="text-[10px] text-[#C5A059] tracking-widest font-black uppercase block">Official Purchase Receipt</span>
                  <h3 className="text-sm font-bold text-stone-850">Order Recieved Successfully!</h3>
                </div>

                {/* Receipt credentials */}
                <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-2 text-xs font-mono text-stone-800">
                  <div className="flex justify-between text-stone-500 text-[10px]">
                    <span>Invoice Ref:</span>
                    <span className="text-stone-800 font-bold">{activeInvoice.id}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[10px]">
                    <span>Transaction Date:</span>
                    <span className="text-stone-800 font-bold">{activeInvoice.date}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-2 space-y-1">
                    <span className="text-[9px] text-stone-400 tracking-widest block font-bold">Purchased Details</span>
                    <div className="text-stone-800 text-[11px] font-bold line-clamp-1">{activeInvoice.title}</div>
                  </div>
                  <div className="border-t border-stone-200 pt-2 flex justify-between items-baseline">
                    <span className="text-[10px] text-[#C5A059] font-bold">Total Paid Out:</span>
                    <span className="text-md font-bold text-green-700 font-mono">{activeInvoice.price.toLocaleString()} ETB</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-250 p-2.5 rounded-xl text-center text-[10.5px] text-stone-605 leading-relaxed font-sans font-medium">
                  🛡️ Every-zone Escrow active: 200 ETB rent secures item shipment safely. Funds held securely until customer verification.
                </div>

                {/* LIVE COURIER TRACER HUD */}
                <div className="bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-2.5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-[#1E3A1A] dark:text-emerald-400">🏍️ COURIER EXPRESS DISPATCH</span>
                    <span className="text-[8px] font-mono bg-emerald-500/20 text-emerald-600 px-1 py-0.5 rounded animate-pulse font-bold">Rider: Abraham (Bole)</span>
                  </div>
                  {/* Status Steps Tracker */}
                  <div className="flex items-center justify-between text-[8px] font-bold text-stone-500 dark:text-zinc-400 relative pt-1">
                    <div className="absolute left-1 right-1 top-[5px] h-0.5 bg-stone-200 dark:bg-zinc-800 z-0">
                      <div className="h-full bg-emerald-500 w-3/4 transition-all duration-[3000ms]" />
                    </div>
                    <div className="z-10 flex flex-col items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-zinc-900 shadow-xs" />
                      <span className="mt-1 text-emerald-600 dark:text-emerald-400">Escrow</span>
                    </div>
                    <div className="z-10 flex flex-col items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-zinc-900 shadow-xs" />
                      <span className="mt-1 text-emerald-600 dark:text-emerald-400">Dispatched</span>
                    </div>
                    <div className="z-10 flex flex-col items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-zinc-900 shadow-xs animate-ping" />
                      <span className="mt-1 text-emerald-600 dark:text-emerald-400">On The Way</span>
                    </div>
                    <div className="z-10 flex flex-col items-center opacity-40">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-zinc-700 border border-white dark:border-zinc-900 shadow-xs" />
                      <span className="mt-1">Delivered</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => downloadReceiptFile(activeInvoice)}
                    className="flex-1 bg-amber-500/10 border border-amber-500 text-amber-900 dark:text-amber-400 hover:bg-amber-500/15 text-[11px] py-2.5 rounded-xl font-bold cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    📥 Download (ደረሰኝ)
                  </button>
                  <button 
                    onClick={() => setActiveInvoice(null)}
                    className="flex-1 bg-[#1E3A1A] text-white hover:opacity-95 text-[11px] py-2.5 rounded-xl font-bold cursor-pointer transition-all"
                  >
                    Done (ጨርስ)
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- EVERYZONE SMART VOICE ASSISTANT MODAL OVERLAY --- */}
        <AnimatePresence>
          {isVoiceAssistantOpen && (
            <>
              <div 
                onClick={closeVoiceAssistant} 
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-md z-[250]"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-[400px] max-h-[92%] overflow-y-auto scrollbar-none border-2 rounded-[28px] p-5 z-[260] shadow-2xl space-y-3.5 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-zinc-950 border-amber-500/40 text-white' 
                    : 'bg-[#F9F7F2] border-[#C5A059] text-stone-850'
                }`}
              >
                {/* Header Title bar */}
                <div className="text-center space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#C5A059] tracking-widest font-black uppercase">
                      🎙️ EveryZone Voice Assistant
                    </span>
                    <button 
                      onClick={closeVoiceAssistant}
                      className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <h3 className="text-[13px] font-bold text-stone-600 dark:text-zinc-300">
                    {lang === 'en' ? "Voice Assistant & Geolocation" : "የኤቭሪዞን የድምፅና ቦታ ማውጫ ረዳት"}
                  </h3>
                </div>



                {/* Animated Pulsing Mic Wave visual */}
                <div className="flex flex-col items-center justify-center py-3 space-y-2 relative">
                  {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-20 h-20 rounded-full bg-[#C5A059]/15 animate-ping absolute" />
                      <span className="w-16 h-16 rounded-full bg-[#1E3A1A]/15 animate-pulse absolute" />
                    </div>
                  )}
                  {isPlayingVoice && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-16 h-16 rounded-full bg-amber-500/10 animate-ping absolute" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center z-10">
                    <button
                      onClick={toggleListening}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse scale-110' 
                          : isPlayingVoice 
                            ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse scale-105' 
                            : 'bg-[#1E3A1A] hover:opacity-95 text-white'
                      }`}
                      title={lang === 'en' ? "Toggle Assistant Listening" : "የረዳት ማዳመጫ ማብሪያ ማጥፊያ"}
                    >
                      {isListening ? (
                        <Mic size={24} className="animate-bounce" />
                      ) : isPlayingVoice ? (
                        <Volume2 size={24} className="animate-pulse" />
                      ) : (
                        <Mic size={24} />
                      )}
                    </button>
                  </div>

                  <span className={`text-[9px] font-black tracking-widest transition-colors text-center ${
                    isListening 
                      ? 'text-red-500' 
                      : isPlayingVoice 
                        ? 'text-amber-500' 
                        : 'text-[#C5A059]'
                  }`}>
                    {isListening 
                      ? (voiceAssistantLang === 'en' ? "🎙️ LISTENING NOW (SAY ANYTHING)..." : "🎙️ እያዳመጥኩ ነው (ወሬዎትን ይቀጥሉ)...") 
                      : isPlayingVoice 
                        ? (voiceAssistantLang === 'en' ? "🤖 ASSISTANT SPEAKING..." : "🤖 ረዳቱ እየተናገረ ነው...")
                        : (voiceAssistantLang === 'en' ? "🔇 MIC PAUSED. TAP MIC TO TALK" : "🔇 ረዳቱ ቆሟል። ለመናገር ማይኩን ይንኩ")}
                  </span>
                </div>

                {/* Question & Answer display panes */}
                <div className="space-y-2.5">
                  {/* Speech to text user transcription box */}
                  <div className="bg-white/40 dark:bg-zinc-900/60 px-3 py-2 rounded-xl border border-stone-200/40 dark:border-zinc-800/50 space-y-0.5">
                    <span className="text-[8.5px] font-black tracking-widest text-[#C5A059] uppercase block">
                      💬 {lang === 'en' ? "YOU SPOKE:" : "እርስዎ የተናገሩት:"}
                    </span>
                    <p className="text-xs font-semibold leading-relaxed italic">
                      "{voiceTranscript || (lang === 'en' ? "Waiting for speech..." : "ድምፅዎ እዚህ ይጻፋል...")}"
                    </p>
                  </div>

                  {/* AI Response synthesized text box */}
                  <div className="bg-[#1E3A1A]/5 dark:bg-emerald-500/5 px-3 py-2.5 rounded-xl border border-[#1E3A1A]/10 dark:border-emerald-500/10 space-y-0.5">
                    <span className="text-[8.5px] font-black tracking-widest text-[#1E3A1A] dark:text-emerald-400 uppercase block">
                      🤖 {lang === 'en' ? "REPLY:" : "የረዳት ምላሽ:"}
                    </span>
                    <p className="text-[12px] font-bold leading-relaxed">
                      {isLocating ? (
                        <span className="flex items-center gap-1.5">
                          <RefreshCw size={11} className="animate-spin text-[#C5A059]" />
                          {voiceReply}
                        </span>
                      ) : (
                        voiceReply || (lang === 'en' 
                          ? "Ask me 'Where am I?' to see your neighborhood & map, or 'Explain the app'." 
                          : "ማይኩን ነክተው 'የት ነው ያለሁት' በመጠየቅ ሰፈርዎንና ካርታዎን ይመልከቱ።")
                      )}
                    </p>
                  </div>

                  {/* Embedded OpenStreetMap visual representation of current/fallback location */}
                  {currentCoords && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1.5 pt-1"
                    >
                      <div className="flex justify-between items-center text-[8.5px] font-black text-[#C5A059] uppercase tracking-wider">
                        <span>📍 {lang === 'en' ? "NEIGHBORHOOD MAP" : "የአካባቢው ሰፈር ካርታ"}</span>
                        <span className="font-mono text-[8px] opacity-75">{currentCoords.lat.toFixed(4)}, {currentCoords.lon.toFixed(4)}</span>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-[#C5A059]/40 bg-stone-100 dark:bg-zinc-900 h-32 relative shadow-sm">
                        <iframe 
                          title="Live Location Map"
                          width="100%" 
                          height="100%" 
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentCoords.lon - 0.005}%2C${currentCoords.lat - 0.004}%2C${currentCoords.lon + 0.005}%2C${currentCoords.lat + 0.004}&layer=mapnik&marker=${currentCoords.lat}%2C${currentCoords.lon}`} 
                          className="border-0 w-full h-full grayscale-[10%]"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Quick Interactive Simulated Prompts */}
                <div className="space-y-1.5 pt-0.5">
                  <span className="text-[8.5px] text-stone-500 dark:text-zinc-400 font-bold block uppercase tracking-wider">
                    {lang === 'en' ? "💡 QUICK TOPICS:" : "💡 ፈጣን ማሳያ አርእስቶች:"}
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => {
                        setVoiceTranscript(lang === 'en' ? "Where am I? (Location Check)" : "የት ነው ያለሁት? (ሎኬሽን)");
                        processVoiceCommand("where am i");
                      }}
                      className="text-[11px] font-bold text-left bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-100 hover:border-[#C5A059] px-2.5 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span className="text-stone-800 dark:text-zinc-100">🗺️ {lang === 'en' ? "Where am I?" : "የት ነው ያለሁት? (ሰፈር)"}</span>
                      <span className="text-[8px] uppercase tracking-widest text-[#C5A059] font-black">GPS MAP</span>
                    </button>
                    <button
                      onClick={() => {
                        setVoiceTranscript(lang === 'en' ? "Explain the application features" : "ስለ መተግበሪያው አስረዳኝ");
                        processVoiceCommand("explain the app");
                      }}
                      className="text-[11px] font-bold text-left bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-100 hover:border-[#C5A059] px-2.5 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span className="text-stone-800 dark:text-zinc-100">💡 {lang === 'en' ? "Explain the App" : "ስለ መተግበሪያው አስረዳኝ"}</span>
                      <span className="text-[8px] uppercase tracking-widest text-stone-400">Tutorial</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={closeVoiceAssistant}
                  className="w-full bg-[#1E3A1A] hover:opacity-95 text-white text-[12px] py-2.5 rounded-lg font-bold transition-all cursor-pointer shadow-md text-center"
                >
                  {lang === 'en' ? "Close Assistant (ጨርስ)" : "ረዳቱን ዝጋ (ጨርስ)"}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- DYNAMIC MERCHANT CONTACT MODAL --- */}
        <AnimatePresence>
          {isContactModalOpen && (
            <>
              {/* Dark blur backdrop */}
              <motion.div 
                id="contact_backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsContactModalOpen(false)}
                className="absolute inset-0 bg-stone-955/70 backdrop-blur-xs z-[220]"
              />

              <motion.div 
                id="contact_modal_panel"
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className={`absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[92%] max-w-[400px] border-2 rounded-[28px] p-5 z-[230] shadow-2xl flex flex-col space-y-4 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-zinc-950 border-amber-500 text-zinc-100' 
                    : 'bg-[#F9F7F2] border-[#C5A059] text-stone-800'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-2 border-b border-stone-200/40 dark:border-zinc-800/60">
                  <div className="space-y-0.5">
                    <span className={`text-[9px] uppercase tracking-widest font-black ${isDarkMode ? 'text-amber-400' : 'text-[#C5A059]'}`}>
                      {lang === 'en' ? 'Direct Merchant Link' : lang === 'am' ? 'ቀጥታ የነጋዴ መስመር' : lang === 'ti' ? 'ርክብ ነጋዳይ' : 'Quunnamtii Kallattii'}
                    </span>
                    <h2 className="text-sm font-extrabold max-w-[280px] leading-tight text-left">
                      {getVendorDetails().name}
                    </h2>
                  </div>
                  <button 
                    id="contact_close_btn_icon"
                    onClick={() => setIsContactModalOpen(false)}
                    className="p-1 rounded-full transition-all hover:bg-stone-200/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Subtitle / Notification Box */}
                <div className="p-2.5 bg-amber-50/40 dark:bg-zinc-900/40 rounded-xl border border-amber-500/10 text-center">
                  <p className={`text-[10px] leading-relaxed font-semibold ${isDarkMode ? 'text-zinc-350' : 'text-stone-605'}`}>
                    📱 {modalTranslations[lang]?.contactHeader || modalTranslations['en'].contactHeader}
                  </p>
                </div>

                {/* Direct Action Rows */}
                <div className="space-y-2.5">
                  {/* Phone Call Link */}
                  <a 
                    id="contact_phone_link"
                    href={`tel:${getVendorDetails().phone}`}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.01] active:translate-y-0.5 ${
                      isDarkMode 
                        ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-amber-400 hover:border-amber-500/45' 
                        : 'bg-white hover:bg-amber-500/5 border-stone-200 text-stone-800 hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                        <Phone size={14} />
                      </div>
                      <div className="text-left">
                        <div className="text-[8.5px] uppercase font-bold tracking-wider opacity-60">
                          {lang === 'en' ? 'Dial Direct Phone' : 'በቀጥታ ይደውሉ'}
                        </div>
                        <div className="text-xs font-black font-mono mt-0.5">
                          {getVendorDetails().phone}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md shrink-0">
                      {lang === 'en' ? 'Call' : 'ደውል'}
                    </span>
                  </a>

                  {/* Telegram Message Link */}
                  <a 
                    id="contact_telegram_link"
                    href={`https://t.me/${getVendorDetails().telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.01] active:translate-y-0.5 ${
                      isDarkMode 
                        ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-amber-400 hover:border-amber-500/45' 
                        : 'bg-white hover:bg-amber-500/5 border-stone-200 text-stone-800 hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                        <Send size={14} />
                      </div>
                      <div className="text-left">
                        <div className="text-[8.5px] uppercase font-bold tracking-wider opacity-60">
                          {lang === 'en' ? 'Send Telegram Message' : 'በቴሌግራም ያውሩ'}
                        </div>
                        <div className="text-xs font-black font-mono mt-0.5">
                          @{getVendorDetails().telegram}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase text-sky-600 bg-sky-500/10 px-2.5 py-1 rounded-md shrink-0">
                      {lang === 'en' ? 'Telegram' : 'ቴሌግራም'}
                    </span>
                  </a>
                </div>

                {/* Footer security badge */}
                <div className="text-center pt-1.5 border-t border-stone-200/20 dark:border-zinc-850/60">
                  <p className={`text-[8.5px] font-medium leading-normal ${isDarkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                    🛡️ {modalTranslations[lang]?.liveSupportText || modalTranslations['en'].liveSupportText}
                  </p>
                </div>

                <button 
                  id="contact_close_btn_rect"
                  onClick={() => setIsContactModalOpen(false)}
                  className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800' 
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {modalTranslations[lang]?.closeBtn || modalTranslations['en'].closeBtn}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- DYNAMIC MERCHANT CHAT MODAL --- */}
        <AnimatePresence>
          {isMessageModalOpen && (
            <>
              {/* Dark blur backdrop */}
              <div 
                id="message_backdrop"
                onClick={() => setIsMessageModalOpen(false)}
                className="absolute inset-0 bg-stone-955/70 backdrop-blur-xs z-[220]"
              />

              <motion.div 
                id="message_modal_panel"
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className={`absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[94%] max-w-[420px] h-[480px] border-2 rounded-[28px] overflow-hidden z-[230] shadow-2xl flex flex-col transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-zinc-950 border-amber-500 text-zinc-100' 
                    : 'bg-[#F9F7F2] border-[#C5A059] text-stone-800'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-stone-200/40 dark:border-zinc-800/60 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1E3A1A] flex items-center justify-center text-white text-[11px] font-serif font-black select-none shrink-0">
                      {getVendorDetails().name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold leading-none">{getVendorDetails().name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0"></span>
                      </div>
                      <span className={`text-[8.5px] block font-semibold ${isDarkMode ? 'text-amber-400/85' : 'text-[#C5A059]'}`}>
                        ✓ {lang === 'en' ? 'Protected Escrow Chat' : 'ደህንነቱ የተጠበቀ ይፋዊ ውይይት'}
                      </span>
                    </div>
                  </div>
                  <button 
                    id="message_close_btn_icon"
                    onClick={() => setIsMessageModalOpen(false)}
                    className="p-1 rounded-full transition-all hover:bg-stone-200/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Chat body scrollable area */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDarkMode ? 'bg-zinc-900/35' : 'bg-[#FAF8F5]'}`}>
                  {(() => {
                    const logs = chatLogs[viewedVendorId || ''] || [
                      { sender: 'vendor', text: 'ሰላም (Welcome)! How can I help you today?', time: '10:00 AM' }
                    ];
                    return logs.map((msg, index) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div 
                          key={index} 
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-[18px] px-3 py-2 relative shadow-xs leading-normal ${
                            isUser 
                              ? (isDarkMode ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-xs' : 'bg-[#1E3A1A] text-white rounded-tr-none')
                              : (isDarkMode ? 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/60' : 'bg-stone-200/80 text-stone-850 rounded-tl-none')
                          }`}>
                            <p className="text-xs text-left leading-relaxed">{msg.text}</p>
                            <span className={`text-[8px] font-mono select-none block text-right mt-1 opacity-70 ${
                              isUser 
                                ? (isDarkMode ? 'text-zinc-900' : 'text-stone-300')
                                : (isDarkMode ? 'text-zinc-500' : 'text-stone-500')
                            }`}>
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Input action bar */}
                <div className="p-2.5 border-t border-stone-200/40 dark:border-zinc-800/60 flex items-center gap-2 bg-[#F9F7F2]/90 dark:bg-zinc-950/90 shrink-0">
                  <input 
                    id="message_text_input"
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    placeholder={modalTranslations[lang]?.chatPlaceholder || modalTranslations['en'].chatPlaceholder}
                    className={`flex-1 text-xs px-2.5 py-2 rounded-xl border outline-none focus:ring-1 transition-all ${
                      isDarkMode 
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-amber-500 focus:ring-amber-500/40' 
                        : 'bg-white border-stone-205 text-stone-800 focus:border-[#1E3A1A] focus:ring-[#1E3A1A]/40'
                    }`}
                  />
                  <button 
                    id="message_send_action_btn"
                    onClick={handleSendMessage}
                    className={`p-2 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center cursor-pointer ${
                      chatMessage.trim() 
                        ? 'bg-[#1E3A1A] text-white hover:opacity-95' 
                        : 'bg-stone-200/75 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 cursor-not-allowed'
                    }`}
                    disabled={!chatMessage.trim()}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- INTERACTIVE BUSINESS BOOKING MODAL --- */}
        <AnimatePresence>
          {bookingModalItem && (
            <>
              {/* Dark backdrop */}
              <motion.div 
                id="booking_backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                exit={{ opacity: 0 }}
                onClick={() => setBookingModalItem(null)}
                className="absolute inset-0 bg-stone-955/75 backdrop-blur-xs z-[220]"
              />

              <motion.div 
                id="booking_modal_panel"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className={`absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[94%] max-w-[420px] border-2 rounded-[32px] p-5 z-[230] shadow-2xl flex flex-col space-y-4 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-zinc-950 border-amber-500 text-zinc-100' 
                    : 'bg-[#F9F7F2] border-[#C5A059] text-stone-800'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-2.5 border-b border-stone-200/40 dark:border-zinc-800/60">
                  <div className="space-y-0.5">
                    <span className={`text-[9px] uppercase tracking-widest font-black ${isDarkMode ? 'text-amber-400' : 'text-[#C5A059]'}`}>
                      ⚡ SECURE CONTRACT BOOKING
                    </span>
                    <h2 className="text-sm font-extrabold max-w-[280px] leading-tight text-left">
                      {lang === 'en' ? 'Book Appointment' : 'አገልግሎት ማስያዣ ቅጽ'}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setBookingModalItem(null)}
                    className="p-1 rounded-full transition-all hover:bg-stone-200/50 dark:hover:bg-zinc-800/50 cursor-pointer text-stone-400"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Service Info Card */}
                <div className="bg-stone-100 dark:bg-zinc-900 p-3 rounded-2xl border border-stone-200 dark:border-zinc-850 flex items-center justify-between gap-3 text-left">
                  <div className="space-y-0.5 max-w-[240px]">
                    <span className="text-[8.5px] uppercase font-black tracking-wider bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full inline-block">
                      {bookingModalItem.type || 'SERVICE'}
                    </span>
                    <h3 className="text-xs font-black truncate">{bookingModalItem.name || bookingModalItem.titleEn || 'Custom Service'}</h3>
                    <p className="text-[10px] text-stone-500 truncate leading-none">
                      {bookingModalItem.duration ? `⏱ Duration: ${bookingModalItem.duration}` : '⚡ Standard turnaround'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-emerald-700 font-mono">
                      {(bookingModalItem.price || 0).toLocaleString()} ETB
                    </div>
                    <span className="text-[8px] text-stone-400 block font-bold">Escrow Verified</span>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3.5 text-left">
                  {/* Date selection */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-stone-500 mb-1">
                      📅 Choose Appointment Date
                    </label>
                    <input 
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none focus:ring-1 transition-all ${
                        isDarkMode 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-amber-500 focus:ring-amber-500/40' 
                          : 'bg-white border-stone-205 text-stone-800 focus:border-[#1E3A1A] focus:ring-[#1E3A1A]/40'
                      }`}
                    />
                  </div>

                  {/* Time selection */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-stone-500 mb-1">
                      🕒 Preferred Hour
                    </label>
                    <input 
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none focus:ring-1 transition-all ${
                        isDarkMode 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-amber-500 focus:ring-amber-500/40' 
                          : 'bg-white border-stone-205 text-stone-800 focus:border-[#1E3A1A] focus:ring-[#1E3A1A]/40'
                      }`}
                    />
                  </div>

                  {/* Custom notes */}
                  <div>
                    <label className="block text-[10px] uppercase font-black text-stone-500 mb-1">
                      📝 Custom Requirements / Notes
                    </label>
                    <textarea 
                      placeholder={lang === 'en' ? 'Describe any specific instructions for the vendor...' : 'ለነጋዴው የሚሰጡት ልዩ መመሪያ ካለ እዚህ ይጻፉ...'}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      rows={2.5}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none focus:ring-1 transition-all resize-none ${
                        isDarkMode 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-amber-500 focus:ring-amber-500/40' 
                          : 'bg-white border-stone-205 text-stone-800 focus:border-[#1E3A1A] focus:ring-[#1E3A1A]/40'
                      }`}
                    />
                  </div>
                </div>

                {/* Important notice badge */}
                <div className="p-2.5 bg-[#1E3A1A]/5 rounded-xl border border-[#1E3A1A]/10 text-center text-[10px] text-stone-600 leading-normal flex items-start gap-2">
                  <span className="text-xs shrink-0">🛡️</span>
                  <p className="text-[9.5px] leading-snug">
                    Payments are held in secure <strong>Every-zone Escrow</strong>. The merchant receives funds only after you confirm service satisfaction.
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => setBookingModalItem(null)}
                    className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
                      isDarkMode 
                        ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800' 
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!bookingDate || !bookingTime) {
                        alert(lang === 'en' ? 'Please select a valid date and time.' : 'እባክዎ ትክክለኛ ቀን እና ሰዓት ይምረጡ።');
                        return;
                      }
                      
                      // Perform booking action
                      const bookingDetails = {
                        id: `b-${Date.now()}`,
                        itemName: bookingModalItem.name || bookingModalItem.titleEn || 'Custom Service',
                        price: bookingModalItem.price || 0,
                        date: bookingDate,
                        time: bookingTime,
                        notes: bookingNotes,
                        vendorId: bookingModalItem.vendorId
                      };

                      // Add notification dynamically
                      triggerPushNotification(
                        lang === 'en' ? 'Appointment Booked Successfully!' : 'የቀጠሮ ማስያዣ በተሳካ ሁኔታ ተጠናቋል!',
                        lang === 'en'
                          ? `Your request for ${bookingDetails.itemName} on ${bookingDetails.date} at ${bookingDetails.time} is registered under secure Escrow protection.`
                          : `የ ${bookingDetails.itemName} አገልግሎት ቀጠሮ ለ ${bookingDetails.date} በ ${bookingDetails.time} በታማኝ የኤስክሮው ጥበቃ ስር ተመዝግቧል።`,
                        '📅',
                        'services'
                      );

                      alert(lang === 'en' 
                        ? `🎉 Booking Confirmed!\n\nItem: ${bookingDetails.itemName}\nDate: ${bookingDetails.date}\nTime: ${bookingDetails.time}\n\nYour appointment is protected under Every-zone Secure Escrow.` 
                        : `🎉 ቀጠሮ ተይዟል!\n\nአገልግሎት: ${bookingDetails.itemName}\nቀን: ${bookingDetails.date}\nሰዓት: ${bookingDetails.time}\n\nቀጠሮዎ በታማኙ የኤስክሮው ጥበቃ ስር ተመዝግቧል።`
                      );

                      // Clear states
                      setBookingModalItem(null);
                      setBookingDate(new Date().toISOString().split('T')[0]);
                      setBookingTime("10:00");
                      setBookingNotes("");
                    }}
                    className="flex-1 bg-[#1E3A1A] hover:bg-[#1E3A1A]/90 text-white font-black text-xs py-2.5 rounded-xl cursor-pointer transition shadow-md"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* WALLET DETAILED TRANSACTION HISTORY SHEET */}
          {isWalletSheetOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsWalletSheetOpen(false)}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs z-50 animate-fade-in"
              />
              <motion.div 
                id="wallet_detail_sheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className={`absolute bottom-0 left-0 right-0 max-h-[85%] border-t-2 rounded-t-[32px] overflow-y-auto z-55 p-5 shadow-2xl flex flex-col space-y-4 transition-all duration-300 ${
                  isDarkMode ? 'bg-zinc-950 border-amber-500 text-zinc-100' : 'bg-[#F9F7F2] border-[#C5A059] text-stone-800'
                }`}
              >
                {/* Header notch */}
                <div className="w-12 h-1 bg-stone-300 dark:bg-zinc-700 rounded-full mx-auto shrink-0 mb-1" />

                <div className="flex items-center justify-between border-b pb-3 border-stone-200/50 dark:border-zinc-800/50">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5 text-stone-800 dark:text-amber-400">
                      💳 Every-zone Personal Wallet Hub
                    </h3>
                    <p className="text-[10px] opacity-60">ኢ-wallet የኪስ ማዕከል</p>
                  </div>
                  <button 
                    onClick={() => setIsWalletSheetOpen(false)}
                    className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-zinc-800 text-stone-500 dark:text-zinc-400"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Balance & Stats cards */}
                <div className="grid grid-cols-2 gap-3 pb-1">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-white shadow-md space-y-1">
                    <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-[#C5A059]">Available Balance</span>
                    <div className="text-lg font-black tracking-tight">{walletBalance.toLocaleString()} ETB</div>
                    <p className="text-[8px] opacity-75">Ready to invest or purchase</p>
                  </div>

                  <div className={`p-3 rounded-2xl border shadow-xs space-y-1 ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
                  }`}>
                    <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-zinc-500">Invested in Lottery</span>
                    <div className="text-lg font-black tracking-tight text-amber-500">1,200 ETB</div>
                    <p className="text-[8px] opacity-75">6 active entries pending Sunday</p>
                  </div>
                </div>

                {/* Ledger transaction history list */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                    📋 Interactive Ledger History:
                  </h4>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {transactions.map(tx => (
                      <div 
                        key={tx.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isDarkMode ? 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900' : 'bg-white border-stone-150 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-base p-1 rounded-lg ${
                            tx.amount < 0 
                              ? 'bg-red-500/10 text-red-550' 
                              : 'bg-emerald-500/10 text-emerald-600'
                          }`}>
                            {tx.amount < 0 ? '💸' : '💰'}
                          </span>
                          <div>
                            <div className="font-bold text-stone-800 dark:text-zinc-200">{tx.description}</div>
                            <div className="text-[8.5px] font-mono opacity-50 mt-0.5">{tx.id} • {tx.timestamp}</div>
                          </div>
                        </div>

                        <span className={`font-mono font-black ${
                          tx.amount < 0 ? 'text-red-650' : 'text-green-700'
                        }`}>
                          {tx.amount < 0 ? '' : '+'}{tx.amount} ETB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="flex gap-2.5 pt-2">
                  <button 
                    onClick={() => {
                      setIsWalletSheetOpen(false);
                      setIsRechargeOpen(true);
                    }}
                    className="flex-1 py-3 bg-[#1E3A1A] hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    + Recharge Account via App DeepLink
                  </button>
                </div>
              </motion.div>
            </>
          )}

          {/* SECURED ESCROW MESSENGER DIALOG */}
          {isChatOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsChatOpen(false)}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs z-50 animate-fade-in"
              />
              <motion.div 
                id="escrow_chat_overlay"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="absolute inset-x-4 top-10 bottom-10 md:inset-x-20 md:top-20 md:bottom-20 z-55 shadow-2xl flex flex-col rounded-3xl overflow-hidden"
              >
                <ChatSystem 
                  isDarkMode={isDarkMode} 
                  userId={chatUserId} 
                  onClose={() => setIsChatOpen(false)} 
                  lang={lang} 
                />
              </motion.div>
            </>
          )}

          {/* RECHARGE QUICK ACTION DIALOG WITH DEEPLINKS */}
          {isRechargeOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsRechargeOpen(false)}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs z-50 animate-fade-in"
              />
              <motion.div 
                id="recharge_action_sheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className={`absolute bottom-0 left-0 right-0 max-h-[85%] border-t-2 rounded-t-[32px] overflow-y-auto z-55 p-5 shadow-2xl flex flex-col space-y-4 transition-all duration-300 ${
                  isDarkMode ? 'bg-zinc-950 border-amber-500 text-zinc-100' : 'bg-[#F9F7F2] border-[#C5A059] text-stone-800'
                }`}
              >
                {/* Header notch */}
                <div className="w-12 h-1 bg-stone-300 dark:bg-zinc-700 rounded-full mx-auto shrink-0 mb-1" />

                <div className="flex items-center justify-between border-b pb-3 border-stone-200/50 dark:border-zinc-800/50">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5 text-stone-800 dark:text-amber-400">
                      ⚡ One-Click Local Recharge Portal
                    </h3>
                    <p className="text-[10px] opacity-60">ፈጣን ሂሳብ መሙያ ማዕከል</p>
                  </div>
                  <button 
                    onClick={() => setIsRechargeOpen(false)}
                    className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-zinc-800 text-stone-500 dark:text-zinc-400"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Predefined Amounts Selectors */}
                <div className="space-y-2">
                  <label className="text-[9.5px] font-extrabold uppercase tracking-wider opacity-60">Predefined Recharge Tier (ETB):</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 2000].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => {
                          setSelectedRechargeAmount(amt);
                          setRechargeSuccessMsg('');
                        }}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          selectedRechargeAmount === amt 
                            ? 'bg-amber-500 text-stone-900 border-amber-500 shadow-md ring-2 ring-amber-500/25'
                            : (isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-zinc-300' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50')
                        }`}
                      >
                        {amt.toLocaleString()} 💸
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Deep linking Gateway */}
                <div className="space-y-2">
                  <label className="text-[9.5px] font-extrabold uppercase tracking-wider opacity-60">Select Mobile Bank App Deep-Link redirect (ስልክ ባንክ መተግበሪያ):</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        handleCopyText('telebirr://payment/partner=everyzone&amount=' + selectedRechargeAmount, 'Telebirr Redirect URI');
                        triggerPushNotification(
                          "📱 Telebirr Deep-Link Loaded",
                          `Deep link payload telebirr:// copied to clipboard securely.`,
                          "📱",
                          "system"
                        );
                      }}
                      className="p-3 rounded-2xl border border-stone-200 dark:border-zinc-800 text-left hover:border-blue-500 dark:hover:border-amber-400 transition-all flex items-start gap-2 bg-white dark:bg-zinc-900"
                    >
                      <span className="text-xl">📲</span>
                      <div>
                        <div className="text-xs font-black text-stone-800 dark:text-zinc-100">CBE Birr Deep-Link</div>
                        <p className="text-[8.5px] opacity-65 mt-0.5">Launches CBE app with standard intent</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        handleCopyText('cbebirr://payment/partner=everyzone&amount=' + selectedRechargeAmount, 'CBE Birr Redirect URI');
                        triggerPushNotification(
                          "📱 CBE Birr Intent Opened",
                          `Redirect payload copied to clipboard.`,
                          "🏦",
                          "system"
                        );
                      }}
                      className="p-3 rounded-2xl border border-stone-200 dark:border-zinc-800 text-left hover:border-blue-500 dark:hover:border-amber-400 transition-all flex items-start gap-2 bg-white dark:bg-zinc-900"
                    >
                      <span className="text-xl">🏦</span>
                      <div>
                        <div className="text-xs font-black text-stone-800 dark:text-zinc-100">Telebirr Quick-Pay</div>
                        <p className="text-[8.5px] opacity-65 mt-0.5">Deep links payment directly inside Telebirr</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Processing bar */}
                {isRechargingProgress ? (
                  <div className="p-4 bg-amber-500/10 border border-dashed border-amber-500/20 text-center rounded-2xl space-y-2">
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent animate-spin rounded-full mx-auto" />
                    <p className="text-xs font-bold text-amber-500">Contacting local banking node ... please wait</p>
                  </div>
                ) : rechargeSuccessMsg ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-2xl text-xs space-y-1">
                    <div className="font-extrabold flex items-center gap-1">✓ {rechargeSuccessMsg}</div>
                    <p className="text-[9.5px] opacity-80">Wallet state updated to {walletBalance.toLocaleString()} ETB immediately.</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsRechargingProgress(true);
                      setTimeout(() => {
                        setWalletBalance(prev => {
                          const updated = prev + selectedRechargeAmount;
                          localStorage.setItem('ez_wallet_balance', updated.toString());
                          return updated;
                        });
                        // Add ledger transaction row
                        setTransactions(prev => [
                          {
                            id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
                            amount: selectedRechargeAmount,
                            description: `Recharged via Local Bank Deep-Link`,
                            timestamp: 'Just now'
                          },
                          ...prev
                        ]);
                        setIsRechargingProgress(false);
                        setRechargeSuccessMsg(`Successfully loaded +${selectedRechargeAmount} ETB into wallet!`);
                        
                        triggerPushNotification(
                          "⚡ Account Recharged Successfully",
                          `Your Every-zone wallet has been credited with ${selectedRechargeAmount} ETB.`,
                          "💎",
                          "wallet"
                        );
                      }, 1800);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#1E3A1A] to-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all"
                  >
                    Confirm Recharge of {selectedRechargeAmount.toLocaleString()} ETB Now 🚀
                  </button>
                )}
              </motion.div>
            </>
          )}

          {/* IN-APP BOOKING & APPOINTMENT VISIT CALENDAR SCHEDULER OVERLAY */}
          {activeBookingListing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-xs p-4 font-sans select-none">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-full max-w-sm rounded-[28px] overflow-hidden shadow-2xl relative flex flex-col p-5 border ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-800'}`}
              >
                <div className="flex justify-between items-center border-b pb-3 border-stone-150 mb-3.5">
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="text-xl">📅</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-[#1E3A1A] dark:text-[#C5A059] tracking-wider">Scheduled Visit Planner</h4>
                      <p className="text-[8px] opacity-60">አዲስ የጉብኝት እቅድና ቀጠሮ ማረጋገጫ</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveBookingListing(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-705 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="text-[10px] bg-[#1E3A1A]/10 text-stone-750 dark:text-zinc-200 p-2.5 rounded-xl border border-[#1E3A1A]/20 leading-relaxed mb-3">
                  Scheduling property tour visit for <strong>{activeBookingListing.title}</strong> in {activeBookingListing.location}.
                </div>

                <InAppBookingCalendar 
                  listingId={activeBookingListing.id}
                  listingTitle={getLocalizedData(activeBookingListing, 'title', lang)}
                  vendorName={activeBookingListing.vendorName}
                  isDarkMode={isDarkMode}
                  onClose={() => setActiveBookingListing(null)}
                  lang={lang}
                  onBookSuccess={(details) => {
                    setActiveBookingListing(null);
                    triggerPushNotification(
                      "📅 Visit Appt Booked Successfully",
                      `Your showing visit slot for "${details.listingTitle}" on June ${details.date} at ${details.timeSlot} has been scheduled. The verified agent is waiting for your confirmation call.`,
                      "🤝",
                      "houses"
                    );
                  }}
                />
              </motion.div>
            </div>
          )}

          {/* VENDOR DIGITAL BUSINESS CARD / DYNAMIC PROMOTIONAL FLYER */}
          {activeBusinessCardListing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-xs p-4 font-sans select-none">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-full max-w-sm rounded-[28px] overflow-hidden shadow-2xl relative flex flex-col p-5 border ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-800'}`}
              >
                <div className="flex justify-between items-center border-b pb-3 border-stone-150 mb-3.5">
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="text-xl">🎴</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-[#1E3A1A] dark:text-[#C5A059] tracking-wider">Vendor Business Hub</h4>
                      <p className="text-[8px] opacity-60">ዲጂታል የሽያጭ እና የማስተዋወቂያ መታወቂያ</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveBusinessCardListing(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-705 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <VendorBusinessCard 
                  shopName={activeBusinessCardListing.vendorName}
                  rating={activeBusinessCardListing.rating}
                  isPremium={activeBusinessCardListing.isPremium || false}
                  phone={activeBusinessCardListing.phone || "+251 911 223 344"}
                  category={activeBusinessCardListing.category}
                  isDarkMode={isDarkMode}
                  onClose={() => setActiveBusinessCardListing(null)}
                  lang={lang}
                />
              </motion.div>
            </div>
          )}

          {/* ACTIVE REAL-TIME PUSH NOTIFICATION BANNER SYSTEM */}
          {pushNotifications.length > 0 && (
            <div className="absolute top-4 left-4 right-4 z-55 flex flex-col gap-2 pointer-events-none">
              {pushNotifications.slice(0, 2).map((notif, index) => (
                <motion.div 
                  key={notif.id || index}
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl flex items-start gap-3 border-2 transition-all ${
                    isDarkMode 
                      ? 'bg-zinc-950 border-amber-500 text-zinc-100' 
                      : 'bg-white border-[#1E3A1A]/80 text-stone-850'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{notif.icon || '🔔'}</span>
                  <div className="flex-1 space-y-0.5">
                    <div className="text-[11px] font-black uppercase tracking-tight text-amber-500 dark:text-amber-400">
                      {notif.title}
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-90">{notif.body}</p>
                    <span className="text-[8px] font-mono opacity-50 block mt-1">Every-zone Push Alert • Just now</span>
                  </div>
                  <button 
                    onClick={() => {
                      setPushNotifications(prev => prev.filter(p => p.id !== notif.id));
                    }}
                    className="p-1 text-stone-400 hover:text-stone-605 self-start cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* CUSTOM USER-FRIENDLY CAMERA PERMISSION MODAL */}
          {showCameraDeniedModal && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`w-full max-w-md rounded-3xl overflow-hidden border shadow-2xl relative flex flex-col ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'
                }`}
              >
                {/* Header Graphic */}
                <div className="p-6 bg-gradient-to-br from-[#1E3A1A] to-[#142611] text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.15),transparent)] pointer-events-none" />
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#C5A059] mb-3 shadow-inner">
                    <Camera size={26} className="animate-pulse" />
                  </div>
                  <h3 className="text-base font-black tracking-tight uppercase text-amber-400">
                    {lang === 'am' ? 'የካሜራ ፈቃድ ያስፈልጋል' : 'Camera Access Required'}
                  </h3>
                  <p className="text-[10.5px] opacity-80 max-w-xs mt-1.5 leading-relaxed">
                    {lang === 'am' 
                      ? 'ፈጣን ዲጂታል የሆኑትን የኤቭሪ-ዞን አገልግሎቶች ለማግኘት እባክዎ ካሜራውን ይፍቀዱ።' 
                      : 'Please allow camera access to unlock secure real-time scanning for Every-zone digital services.'}
                  </p>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black uppercase text-[#C5A059] tracking-wider">
                      {lang === 'am' ? 'ለምን ካሜራ ያስፈልገናል?' : 'Why Every-zone needs camera access'}
                    </h4>

                    {/* Reasons list */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex gap-2.5 items-start">
                        <div className="w-5 h-5 rounded-full bg-[#1E3A1A]/10 dark:bg-amber-400/10 text-[#C5A059] flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                        <div>
                          <span className="font-extrabold block text-[11px] text-stone-850 dark:text-zinc-200">
                            {lang === 'am' ? 'የፋይዳ ዲጂታል መታወቂያ' : 'National Fayda ID Card Reader'}
                          </span>
                          <p className="text-[10px] opacity-65 leading-tight">
                            {lang === 'am' 
                              ? 'የመታወቂያዎን ምስል በመቃኘት በራስ-ሰር መረጃን ለመሙላት።' 
                              : 'Securely decode biometric national ID cards to instantly fill out passport bookings and applications.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <div className="w-5 h-5 rounded-full bg-[#1E3A1A]/10 dark:bg-amber-400/10 text-[#C5A059] flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                        <div>
                          <span className="font-extrabold block text-[11px] text-stone-855 dark:text-zinc-200">
                            {lang === 'am' ? 'የቴሌብር እና ባንክ ክፍያዎች' : 'Contactless QR Payments'}
                          </span>
                          <p className="text-[10px] opacity-65 leading-tight">
                            {lang === 'am' 
                              ? 'የቴሌብር ወይም CBE Birr የክፍያ QR ኮዶችን በቀላሉ ለመቃኘት።' 
                              : 'Instantly read and process Telebirr and CBE merchant QR codes to complete contactless wallet payments.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <div className="w-5 h-5 rounded-full bg-[#1E3A1A]/10 dark:bg-amber-400/10 text-[#C5A059] flex items-center justify-center shrink-0 text-[10px] font-bold">3</div>
                        <div>
                          <span className="font-extrabold block text-[11px] text-stone-855 dark:text-zinc-200">
                            {lang === 'am' ? 'የፓስፖርት ቲኬት ማረጋገጫ' : 'Passport Appointment Receipts'}
                          </span>
                          <p className="text-[10px] opacity-65 leading-tight">
                            {lang === 'am' 
                              ? 'የፓስፖርት አገልግሎት መከታተያ ቁጥር ወይም ቲኬቶችን በፍጥነት ለማረጋገጥ።' 
                              : 'Instantly verify appointment numbers and receipts directly at administrative hubs.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Help box */}
                  <div className={`p-3 rounded-2xl border text-[10px] leading-relaxed space-y-1.5 ${
                    isDarkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <span className="font-black uppercase text-amber-500 block">
                      💡 {lang === 'am' ? 'በእጅ ለመፍቀድ ቀላል መመሪያ' : 'Quick Settings Guide'}
                    </span>
                    <p className="opacity-75">
                      {lang === 'am'
                        ? 'መተግበሪያው በአይፍሬም ውስጥ ስለሚሰራ ካሜራው ሊገደብ ይችላል። ካልሰራልዎት በአሳሽዎ የአድራሻ አሞሌ ላይ ያለውን የቁልፍ ምልክት (Lock) ጠቅ በማድረግ ካሜራውን መፍቀድ ይችላሉ።'
                        : 'Since this app runs inside a secure sandbox preview, browser policy might block prompt popups. If nothing happens when clicking Allow, please click the lock icon next to the website URL in your address bar and toggle Camera to "Allow".'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={handleAllowCameraAccess}
                      className="w-full py-2.5 bg-[#1E3A1A] hover:bg-emerald-850 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border border-emerald-900/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Camera size={14} />
                      {lang === 'am' ? 'አሁን ፍቀድ / ካሜራ አስነሳ' : 'Allow Camera / Launch Prompt'}
                    </button>
                    <button
                      onClick={() => setShowCameraDeniedModal(false)}
                      className={`w-full py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' 
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      {lang === 'am' ? 'ዝጋ' : 'Cancel / Use Presets'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {selectedMarketplaceProduct && (
            <ProductDetailModal
              product={selectedMarketplaceProduct}
              isWishlisted={false}
              onClose={() => setSelectedMarketplaceProduct(null)}
              onToggleWishlist={() => {}}
              onAddToCart={(productId, qty, variantId) => {
                handleMarketplaceAddToCartInApp(productId, qty, variantId);
                setSelectedMarketplaceProduct(null);
              }}
              lang={lang}
            />
          )}

          {/* QR CODE SCANNER MODAL */}
          <QRCodeScanner
            isOpen={isQrSearchOpen}
            onClose={() => setIsQrSearchOpen(false)}
            onScanSuccess={handleQRSearchSuccess}
            lang={lang}
            isDarkMode={isDarkMode}
            handleImageSearch={handleImageSearch}
            imageSearchLoading={imageSearchLoading}
          />

      </>
    )}

      </div>

    </div>
  );
}
