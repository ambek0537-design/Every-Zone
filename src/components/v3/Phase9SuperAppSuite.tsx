import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UnifiedErrorComponent, ErrorType } from '../UnifiedErrorComponent';
import {
  PrimaryButton,
  SecondaryButton,
  Card as DSCard,
  ProductCard,
  VendorCard,
  HouseCard,
  Input as DSInput,
  SearchBar as DSSearchBar,
  Badge as DSBadge,
  Avatar as DSAvatar,
  BottomSheet as DSBottomSheet,
  Modal as DSModal,
  Toast as DSToast,
  Loader as DSLoader
} from '../DesignSystemComponents';
import {
  Bell, Heart, History, QrCode, Shield, Award, BookOpen, Download, Cpu,
  Settings, Eye, Terminal, BarChart2, Check, CheckCircle2, AlertTriangle,
  RefreshCw, Play, Trash2, Archive, Volume2, User, Globe, Moon, FileText,
  DollarSign, Activity, Lock, Smartphone, HelpCircle, HardDrive, Zap, HelpCircle as HelpIcon, ArrowRight, Layers,
  Sparkles, TrendingUp, Building, ShoppingBag, MessageSquare
} from 'lucide-react';

// ==========================================
// TYPE DEFINITIONS FOR PHASE 9 MODULES
// ==========================================
interface AppNotification {
  id: string;
  category: 'Orders' | 'Messages' | 'Wallet' | 'Jobs' | 'Matchmaking' | 'House' | 'Vendor' | 'System' | 'Promotions';
  title: string;
  body: string;
  time: string;
  read: boolean;
  archived: boolean;
}

interface FavoriteItem {
  id: string;
  type: 'Products' | 'Houses' | 'Jobs' | 'Vendors' | 'Agencies' | 'Videos';
  title: string;
  subtitle: string;
  image?: string;
}

interface RecentlyViewedItem {
  id: string;
  type: 'Products' | 'Stores' | 'Jobs' | 'Houses' | 'Videos';
  title: string;
  time: string;
  icon: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'Login History' | 'Wallet Logs' | 'Vendor Logs' | 'Changes' | 'Deleted Records' | 'Audit Trail';
  message: string;
  user: string;
  ip: string;
}

// SEED DATA FOR UNIVERSAL NOTIFICATIONS
const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 'notif-1', category: 'Orders', title: '📦 Order Out for Delivery', body: 'Your Sidama specialty coffee has been dispatched via Sheger Courier.', time: '10 mins ago', read: false, archived: false },
  { id: 'notif-2', category: 'Messages', title: '💬 Matchmaking Message', body: 'Frehiwot sent you a proposal for the cultural weekend café meetup.', time: '20 mins ago', read: false, archived: false },
  { id: 'notif-3', category: 'Wallet', title: '💰 Escrow Clearance Complete', body: 'Chapa Webhook cleared 14,500 ETB directly into your reserve wallet.', time: '1 hour ago', read: true, archived: false },
  { id: 'notif-4', category: 'Jobs', title: '💼 Dubai Courier Interview Match', body: 'Passport authenticated. Pre-clearance checks passed successfully.', time: '3 hours ago', read: false, archived: false },
  { id: 'notif-5', category: 'House', title: '🏠 Lease Node Escrow Alert', body: 'Bole Atlas modern loft deposit is locked in Chapa holding system.', time: '1 day ago', read: true, archived: false },
  { id: 'notif-6', category: 'Vendor', title: '🏪 Stock Refill Suggestion', body: 'Abebe Tibeb: Habesha silk threads are low. AI recommends order.', time: '2 days ago', read: false, archived: true },
  { id: 'notif-7', category: 'System', title: '🛡️ Fayda Registry Synchronized', body: 'Your biometric national ID FYD-HENOK is verified at government node.', time: '3 days ago', read: true, archived: false },
  { id: 'notif-8', category: 'Promotions', title: '🔥 Eid-al-Adha Merchant Promo', body: 'Zero commission escrow transactions for top-rated marketplace vendors.', time: '4 days ago', read: true, archived: false }
];

// SEED DATA FOR FAVORITES
const SEED_FAVORITES: FavoriteItem[] = [
  { id: 'fav-1', type: 'Products', title: 'Premium Gold Tibeb Dress', subtitle: 'Abebe Handlooms • 14,500 ETB' },
  { id: 'fav-2', type: 'Houses', title: 'Bole Atlas Luxury Studio', subtitle: '65,000 ETB/mo • Verified Host' },
  { id: 'fav-3', type: 'Jobs', title: 'Courier Agent Specialist', subtitle: 'Sheger Logistics • 18,000 ETB' },
  { id: 'fav-4', type: 'Vendors', title: 'Zewditu Leather Emporium', subtitle: 'Bole Brass • 140+ Reviews' },
  { id: 'fav-5', type: 'Agencies', title: 'Horizon Placement Corp', subtitle: 'Overseas Employment Board' },
  { id: 'fav-6', type: 'Videos', title: 'Traditional Weaving Heritage Live', subtitle: 'Abebe Handlooms • 2.4k Views' }
];

// SEED DATA FOR RECENTLY VIEWED
const SEED_RECENTLY_VIEWED: RecentlyViewedItem[] = [
  { id: 'rc-1', type: 'Products', title: 'Organic Sidama Coffee', time: '5 mins ago', icon: '☕' },
  { id: 'rc-2', type: 'Stores', title: 'Makeda Royal Coffee Store', time: '15 mins ago', icon: '🏪' },
  { id: 'rc-3', type: 'Jobs', title: 'Heavy Delivery Driver (Dubai)', time: '1 hour ago', icon: '🚚' },
  { id: 'rc-4', type: 'Houses', title: '2-Bedroom Bole Luxury Condo', time: '3 hours ago', icon: '🏢' },
  { id: 'rc-5', type: 'Videos', title: 'Traditional Silk Embroidery Live Stream', time: '1 day ago', icon: '🎥' }
];

// SEED DATA FOR INTERNAL AUDIT TRAIL
const SEED_AUDIT_TRAIL: AuditLogEntry[] = [
  { id: 'log-1', timestamp: '10:14:02 UTC', category: 'Login History', message: 'Fayda Biometric signature validated successfully', user: 'Henok Tadesse', ip: '196.188.12.4' },
  { id: 'log-2', timestamp: '10:15:30 UTC', category: 'Wallet Logs', message: 'Escrow settlement cleared via Chapa Webhook', user: 'System (Chapa Node)', ip: '54.23.119.82' },
  { id: 'log-3', timestamp: '10:22:15 UTC', category: 'Vendor Logs', message: 'Created automatic stock alert rules', user: 'Abebe Tibeb Partner', ip: '196.188.45.191' },
  { id: 'log-4', timestamp: '10:30:11 UTC', category: 'Changes', message: 'Updated national biometric identity metadata', user: 'Security Officer', ip: '10.0.4.12' },
  { id: 'log-5', timestamp: '10:45:00 UTC', category: 'Deleted Records', message: 'Removed expired matchmaking application matching queue', user: 'Admin Engine', ip: 'localhost' },
  { id: 'log-6', timestamp: '10:59:59 UTC', category: 'Audit Trail', message: 'API Gateway security keys re-encryption cycle completed', user: 'Infra SRE Daemon', ip: '127.0.0.1' }
];

// VENDOR ACADEMY CHAPTERS
const ACADEMY_COURSES = [
  { id: 'ac-1', title: 'How To Sell', subtitle: 'How to setup escrow storefront & listing rules', amTitle: 'እንዴት መሸጥ እንደሚቻል', icon: '🏪', duration: '12 mins', chapters: ['Escrow Setup', 'Pricing Strategies', 'Chapa Onboarding'] },
  { id: 'ac-2', title: 'Marketing', subtitle: 'Ecosystem optimization and local target audience reach', amTitle: 'ግብይትና ማስተዋወቅ', icon: '📈', duration: '18 mins', chapters: ['Smart Feed Boosts', 'Community Referral Codes', 'Discount Codes'] },
  { id: 'ac-3', title: 'Photography', subtitle: 'Capturing handlooms and leather crafts with mobile phone', amTitle: 'ፎቶግራፍ አነሳስ', icon: '📸', duration: '15 mins', chapters: ['Natural Lighting hacks', 'White Balance optimization', '3D asset exports'] },
  { id: 'ac-4', title: 'Customer Service', subtitle: 'Dispute mitigation and keeping rating above 4.8 stars', amTitle: 'የደንበኞች አገልግሎት', icon: '🤝', duration: '10 mins', chapters: ['Instant auto-replies', 'Refund arbitrations', 'Fayda trust badges'] },
  { id: 'ac-5', title: 'AI Selling Tips', subtitle: 'Gemini-powered title & description generation tricks', amTitle: 'የአርቴፊሻል ኢንተለጀንስ ምክሮች', icon: '💡', duration: '20 mins', chapters: ['Prompting descriptions', 'Automated translation', 'Price optimization'] }
];

interface Phase9SuperAppSuiteProps {
  isDarkMode: boolean;
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  lang: 'en' | 'am';
}

export function Phase9SuperAppSuite({
  isDarkMode,
  triggerPushNotification,
  lang
}: Phase9SuperAppSuiteProps) {
  // NAVIGATION SUB-TABS (15 features grouped into 5 cohesive panels)
  const [activeSubTab, setActiveSubTab] = useState<'notifications' | 'identity' | 'vendor' | 'settings' | 'monitoring' | 'roadmap' | 'ecosystem'>('notifications');

  // ECOSYSTEM PLATFORM STATE
  const [activeEcosystemNode, setActiveEcosystemNode] = useState<string>('marketplace');
  const [activeBizCategory, setActiveBizCategory] = useState<string>('all');
  const [searchBizQuery, setSearchBizQuery] = useState<string>('');
  const [activeAiAgent, setActiveAiAgent] = useState<string>('shopping');
  const [aiAgentLog, setAiAgentLog] = useState<string[]>([]);
  const [aiAgentOutput, setAiAgentOutput] = useState<string>('');
  const [aiAgentProcessing, setAiAgentProcessing] = useState<boolean>(false);
  const [isAnalyzingBi, setIsAnalyzingBi] = useState<boolean>(false);
  const [biInsights, setBiInsights] = useState<string>('');

  // ACCESSIBILITY STATE (Actually functional!)
  const [accessLargeFont, setAccessLargeFont] = useState(false);
  const [accessHighContrast, setAccessHighContrast] = useState(false);
  const [accessReduceMotion, setAccessReduceMotion] = useState(false);
  const [accessScreenReader, setAccessScreenReader] = useState(false);

  // 1. UNIVERSAL NOTIFICATIONS STATE
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<string>('All');
  const [mutedCategories, setMutedCategories] = useState<string[]>([]);

  // ROADMAP & REVENUE PROJECTIONS STATE
  const [activeRoadmapVer, setActiveRoadmapVer] = useState<'v10' | 'v15' | 'v20' | 'v25' | 'v30'>('v10');
  const [revCartValue, setRevCartValue] = useState<number>(650);
  const [revMonthlyOrders, setRevMonthlyOrders] = useState<number>(4500);
  const [revPremiumVendors, setRevPremiumVendors] = useState<number>(150);
  const [revActiveAgencies, setRevActiveAgencies] = useState<number>(25);
  const [revAdClickEstimate, setRevAdClickEstimate] = useState<number>(12000);
  const [archActiveNode, setArchActiveNode] = useState<string>('gateway');

  // 2. FAVORITES STATE
  const [favorites, setFavorites] = useState<FavoriteItem[]>(SEED_FAVORITES);

  // 3. RECENTLY VIEWED STATE
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(SEED_RECENTLY_VIEWED);

  // 4. QR EVERYWHERE STATE
  const [selectedQrType, setSelectedQrType] = useState<'Store' | 'Product' | 'Wallet' | 'Business Card' | 'Payment' | 'Ticket' | 'Invoice'>('Wallet');
  const [qrPayload, setQrPayload] = useState('everyzone:wallet:FYD-HENOK-ETH-2026');

  // 5. BUSINESS VERIFICATION STATE
  const [businessVerification, setBusinessVerification] = useState<'Verified' | 'Gold Verified' | 'Premium Verified' | 'Government Verified'>('Verified');

  // 6. USER LEVEL STATE
  const [userLevel, setUserLevel] = useState<'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Platinum' | 'VIP'>('Diamond');
  const [userXP, setUserXP] = useState(8400);

  // 7. ACHIEVEMENT SYSTEM
  const [achievements, setAchievements] = useState([
    { id: 'ach-1', title: 'First Purchase', unlocked: true, date: 'May 12, 2026', icon: '🎉', xp: 500 },
    { id: 'ach-2', title: '100 Orders Milestone', unlocked: true, date: 'June 28, 2026', icon: '🏆', xp: 2000 },
    { id: 'ach-3', title: 'Top Reviewer', unlocked: false, progress: '3/5 reviews', icon: '⭐', xp: 1000 },
    { id: 'ach-4', title: 'Trusted Buyer Badge', unlocked: true, date: 'July 01, 2026', icon: '🛡️', xp: 1500 },
    { id: 'ach-5', title: 'Top Vendor Partner', unlocked: false, progress: 'Unlocks for vendor mode with >4.9 stars', icon: '🏪', xp: 5000 }
  ]);

  // 8. VENDOR ACADEMY STATE
  const [activeCourseIdx, setActiveCourseIdx] = useState<number>(0);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  // 9. SMART REPORTS STATE
  const [reportActor, setReportActor] = useState<'Vendor' | 'Agency' | 'Customer'>('Vendor');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);

  // 10. API READY STATE
  const [activeApiSandbox, setActiveApiSandbox] = useState<'Bank' | 'Courier' | 'Government' | 'Payment Gateway' | 'AI Provider'>('Payment Gateway');
  const [apiResponse, setApiResponse] = useState<any>({ status: 'Awaiting trigger...' });

  // 11. INTERNAL SETTINGS STATES
  const [settingsLanguage, setSettingsLanguage] = useState<'en' | 'am'>(lang);
  const [settingsForm, setSettingsForm] = useState({
    accountName: 'Henok Tadesse',
    accountEmail: 'henok.tadesse@everyzone.et',
    privacyLevel: 'Standard',
    securityTwoFactor: true,
    notificationsEnabled: true
  });

  // 13. DISASTER RECOVERY & HEALTH SIMULATION STATE
  const [drStatus, setDrStatus] = useState({
    backupState: 'Healthy (Synced 10m ago)',
    recoveryStatus: 'Stable',
    healthCheck: '100% Core Services Online',
    restartService: 'None Required',
    alerts: 'Zero Active Alerts'
  });
  const [drLogs, setDrLogs] = useState<string[]>([
    ' SRE Cluster initialized successfully on Cloud Run Container Node.',
    ' Backup automated daemon triggered (Target: Google Spanner Cluster DB).',
    ' Health Checks passed on all 10 domain microservices.'
  ]);

  // DESIGN SYSTEM & ARCHITECTURE SANDBOX STATES
  const [sandboxTab, setSandboxTab] = useState<'structure' | 'design' | 'tracer' | 'errors' | 'logs' | 'launch' | 'workflow' | 'dashboard' | 'docs' | 'strategy' | 'support' | 'brand'>('structure');
  const [demoSheetOpen, setDemoSheetOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoToast, setDemoToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({ show: false, msg: '', type: 'info' });
  const [demoSearchQuery, setDemoSearchQuery] = useState('');
  const [demoInputVal, setDemoInputVal] = useState('');

  // 🚀 Interactive Launch & KPI states
  const [kpiDownloads, setKpiDownloads] = useState(4850);
  const [kpiRegisteredUsers, setKpiRegisteredUsers] = useState(920);
  const [kpiVendors, setKpiVendors] = useState(78);
  const [kpiAgencies, setKpiAgencies] = useState(8);
  const [kpiOrders, setKpiOrders] = useState(185);
  const [kpiWalletUsers, setKpiWalletUsers] = useState(210);
  const [selectedRevenuePri, setSelectedRevenuePri] = useState<'vendor' | 'featured' | 'sponsor' | 'commission'>('vendor');
  const [simulatedRevenue, setSimulatedRevenue] = useState(128500);

  // 📞 Interactive Support Portal states
  const [supportTickets, setSupportTickets] = useState([
    { id: 'T-101', subject: 'In-app Wallet top-up delay (Chapa)', category: 'Wallet', status: 'Pending', createdAt: '2 mins ago', sla: '23:58:12' },
    { id: 'T-102', subject: 'Agency license verification status', category: 'Jobs', status: 'In Progress', createdAt: '10 mins ago', sla: '23:50:00' },
    { id: 'T-103', subject: 'Marketplace product filter performance', category: 'Marketplace', status: 'Resolved', createdAt: '1 hour ago', sla: 'Resolved' }
  ]);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportCategory, setSupportCategory] = useState<'Wallet' | 'Marketplace' | 'Vendor' | 'Chat' | 'House' | 'Jobs' | 'Other'>('Marketplace');
  const [supportMsg, setSupportMsg] = useState('');
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  // 🌍 Interactive Brand Identity Sandbox states
  const [brandColorTheme, setBrandColorTheme] = useState<'amber' | 'emerald' | 'gold' | 'purple'>('amber');
  const [brandButtonRoundness, setBrandButtonRoundness] = useState<'rounded-none' | 'rounded-md' | 'rounded-xl' | 'rounded-full'>('rounded-xl');
  const [brandTypography, setBrandTypography] = useState<'sans' | 'mono' | 'serif'>('sans');

  // PMO & Governance States
  const [pmoProgress, setPmoProgress] = useState(88);
  const [pmoOpenBugs, setPmoOpenBugs] = useState(14);
  const [pmoCriticalBugs, setPmoCriticalBugs] = useState(2);
  const [pmoCompletedFeatures, setPmoCompletedFeatures] = useState(72);
  const [pmoPendingFeatures, setPmoPendingFeatures] = useState(10);
  const [pmoTestCoverage, setPmoTestCoverage] = useState(94);
  const [pmoPerformanceScore, setPmoPerformanceScore] = useState(96);
  const [pmoSecurityScore, setPmoSecurityScore] = useState(98);

  // Definition of Done Checkboxes
  const [dodChecked, setDodChecked] = useState<Record<string, boolean>>({
    'ui': true,
    'backend': true,
    'api': true,
    'darkmode': true,
    'errors': true,
    'loading': true,
    'empty': true,
    'perf': false,
    'sec': false,
    'docs': true
  });

  // Release Management Active Stage
  const [releaseStage, setReleaseStage] = useState<'development' | 'testing' | 'beta' | 'rc' | 'production'>('beta');

  // Active Documentation Module Selection
  const [selectedDocModule, setSelectedDocModule] = useState<'marketplace' | 'vendor' | 'wallet' | 'real_estate' | 'overseas' | 'matchmaking' | 'ai' | 'chat' | 'notifications'>('marketplace');

  // Interactive Live Metrics
  const [metricDau, setMetricDau] = useState(1450);
  const [metricOrders, setMetricOrders] = useState(248);
  const [metricRevenue, setMetricRevenue] = useState(485000); // ETB
  const [metricTransactions, setMetricTransactions] = useState(1280);
  const [metricCrashRate, setMetricCrashRate] = useState(0.015); // %
  const [metricResponseTime, setMetricResponseTime] = useState(42); // ms

  const [isLiveLaunched, setIsLiveLaunched] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    // Auth
    'auth_email': true, 'auth_phone': true, 'auth_google': true, 'auth_apple': true, 'auth_forgot': true, 'auth_verify_email': true, 'auth_verify_phone': true, 'auth_2fa': true,
    // Profile
    'prof_edit': true, 'prof_photo': true, 'prof_status': true, 'prof_qr': true, 'prof_privacy': true, 'prof_timeline': true,
    // Marketplace
    'mkt_cat': true, 'mkt_search': true, 'mkt_filters': true, 'mkt_wishlist': true, 'mkt_cart': true, 'mkt_checkout': true, 'mkt_reviews': true, 'mkt_store': true, 'mkt_tracking': true,
    // Vendor
    'vnd_dash': true, 'vnd_prod': true, 'vnd_orders': true, 'vnd_analytics': true, 'vnd_followers': true, 'vnd_services': true, 'vnd_videos': true, 'vnd_posts': true, 'vnd_coupons': true, 'vnd_revenue': true,
    // Wallet
    'wlt_bal': true, 'wlt_dep': true, 'wlt_with': true, 'wlt_transfer': true, 'wlt_qr': true, 'wlt_history': true, 'wlt_stmt': true,
    // Real Estate
    're_list': true, 're_agency': true, 're_map': true, 're_saved': true, 're_contact': true, 're_book': true,
    // Overseas
    'job_agency': true, 'job_listings': true, 'job_apply': true, 'job_docs': true, 'job_track': true, 'job_interview': true,
    // Matchmaking
    'match_ai': true, 'match_verified': true, 'match_chat': true, 'match_safety': true, 'match_report': true,
    // Chat
    'chat_text': true, 'chat_img': true, 'chat_voice': true, 'chat_files': true, 'chat_read': true, 'chat_typing': true, 'chat_status': true,
    // Notifications
    'notif_push': true, 'notif_inapp': true, 'notif_email': true, 'notif_settings': true,
    // Search
    'search_uni': true,
    // Admin
    'adm_dash': true, 'adm_users': true, 'adm_vendors': true, 'adm_agencies': true, 'adm_orders': true, 'adm_wallet': true, 'adm_reports': true, 'adm_analytics': true,
    // Security
    'sec_ssl': true, 'sec_jwt': true, 'sec_upload': true, 'sec_val': true, 'sec_sql': true, 'sec_xss': true, 'sec_rate': true, 'sec_session': true, 'sec_audit': true,
    // Performance
    'perf_lazy': true, 'perf_comp': true, 'perf_pag': true, 'perf_cache': true, 'perf_split': true, 'perf_leak': true, 'perf_index': true,
    // UI
    'ui_dark': true, 'ui_light': true, 'ui_tablet': true, 'ui_small': true, 'ui_resp': true, 'ui_skel': true, 'ui_empty': true, 'ui_error': true,
    // Testing
    'test_unit': true, 'test_int': true, 'test_e2e': true, 'test_pay': true, 'test_offline': true, 'test_notif': true, 'test_stress': true,
  });
  
  // Trace Flow state
  const [activeTraceFlow, setActiveTraceFlow] = useState<'none' | 'wallet_deposit' | 'auth_check' | 'marketplace_order' | 'realestate_search'>('none');
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [isTracing, setIsTracing] = useState(false);

  // Simulated Unified Error States
  const [simulatedError, setSimulatedError] = useState<ErrorType | null>(null);

  // Live SRE Production Logs Monitor State
  const [sandboxLogs, setSandboxLogs] = useState<{ id: string; level: 'info' | 'warn' | 'error' | 'fatal'; message: string; timestamp: string; service: string }[]>([
    { id: 'l1', level: 'info', message: 'Every-zone SRE cluster daemon running on Node: 196.188.12.4', timestamp: '10:41:02 AM', service: 'SRE-Core' },
    { id: 'l2', level: 'info', message: 'Fayda Biometrics security bridge successfully synced with National ID Agency', timestamp: '10:41:05 AM', service: 'Auth-Service' },
    { id: 'l3', level: 'warn', message: 'Chapa webhook latency spiked (92ms) during high-frequency microservice audit', timestamp: '10:41:12 AM', service: 'Payment-Ledger' },
    { id: 'l4', level: 'info', message: 'Local storage cache garbage collector freed 14.2MB of stale JSON assets', timestamp: '10:41:20 AM', service: 'Client-Cache' }
  ]);

  // 14. INTERNAL AUDIT LOGS STATE
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(SEED_AUDIT_TRAIL);
  const [auditFilter, setAuditFilter] = useState<string>('All');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // 15. ENTERPRISE MONITORING LIVE TELEMETRY
  const [telemetry, setTelemetry] = useState({
    apiHealth: 99.8,
    databaseLoad: 12,
    storageUsage: 34,
    cpuUsage: 18,
    ramUsage: 42,
    paymentsRate: 24,
    ordersPending: 5,
    chatLatency: 45,
    notificationsInQueue: 0
  });

  // Access Screen Reader Speech Synthesis support
  const handleAccessibilitySpeak = (text: string) => {
    if (accessScreenReader && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = settingsLanguage === 'am' ? 'am-ET' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Live simulation for monitoring metrics and disaster alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Dynamic SRE/RAM metrics simulation
      setTelemetry(prev => ({
        apiHealth: Math.random() > 0.01 ? 99.9 : 98.4,
        databaseLoad: Math.min(100, Math.max(5, prev.databaseLoad + Math.floor(Math.random() * 5) - 2)),
        storageUsage: prev.storageUsage,
        cpuUsage: Math.min(100, Math.max(2, prev.cpuUsage + Math.floor(Math.random() * 9) - 4)),
        ramUsage: Math.min(100, Math.max(10, prev.ramUsage + Math.floor(Math.random() * 3) - 1)),
        paymentsRate: Math.max(0, prev.paymentsRate + Math.floor(Math.random() * 3) - 1),
        ordersPending: Math.max(0, prev.ordersPending + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0)),
        chatLatency: Math.max(10, prev.chatLatency + Math.floor(Math.random() * 5) - 2),
        notificationsInQueue: Math.max(0, prev.notificationsInQueue + (Math.random() > 0.9 ? 1 : 0) - (Math.random() > 0.9 ? 1 : 0))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update QR code payloads based on type selection
  useEffect(() => {
    const payloads: Record<string, string> = {
      'Store': 'everyzone:store:abebe-tibeb-771',
      'Product': 'everyzone:product:habesha-dress-9810',
      'Wallet': 'everyzone:wallet:FYD-HENOK-ETH-2026',
      'Business Card': 'everyzone:business_card:henok-tadesse-abyssinia',
      'Payment': 'everyzone:payment:escrow:deposit-chapa-14500',
      'Ticket': 'everyzone:event-ticket:cultural-gala-addis-2026',
      'Invoice': 'everyzone:invoice:EZ-INV-440182'
    };
    setQrPayload(payloads[selectedQrType] || '');
  }, [selectedQrType]);

  // ==========================================
  // NOTIFICATION UTILITIES
  // ==========================================
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchCat = notifFilter === 'All' || n.category === notifFilter;
      return matchCat && !n.archived;
    });
  }, [notifications, notifFilter]);

  const handleReadAllNotifs = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerPushNotification('Bulk Action Saved', 'All primary notifications marked as read.', '🔔', 'system');
    handleAccessibilitySpeak('All notifications marked as read.');
  };

  const handleDeleteNotif = (id: string, title: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    triggerPushNotification('Notification Cleared', `Successfully purged: "${title}"`, '🗑️', 'system');
    handleAccessibilitySpeak(`Deleted notification: ${title}`);
  };

  const handleArchiveNotif = (id: string, title: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n));
    triggerPushNotification('Notification Archived', `Moved "${title}" to background storage.`, '📦', 'system');
    handleAccessibilitySpeak(`Archived notification: ${title}`);
  };

  const handleToggleMuteNotifCategory = (cat: string) => {
    if (mutedCategories.includes(cat)) {
      setMutedCategories(mutedCategories.filter(c => c !== cat));
      triggerPushNotification('Alert Volume Active', `Push alerts enabled for ${cat}.`, '🔊', 'system');
    } else {
      setMutedCategories([...mutedCategories, cat]);
      triggerPushNotification('Category Muted', `Alerts suspended silently for ${cat}.`, '🔇', 'system');
    }
  };

  // ==========================================
  // DYNAMIC SMART REPORT GENERATOR
  // ==========================================
  const triggerGenerateReport = () => {
    if (isGeneratingReport) return;
    setIsGeneratingReport(true);
    setReportProgress(0);

    const interval = setInterval(() => {
      setReportProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGeneratingReport(false);
            // Simulate actual text file download!
            const element = document.createElement("a");
            const fileContent = `--- EVERY-ZONE v3.0 AUTOMATED REPORT ---
Actor Entity: ${reportActor} Mode
Requested Format: ${reportFormat} File Link
Timestamp: ${new Date().toISOString()}
Data Nodes Audited: Escrow Logs, National Fayda records, Chapa Settlement webhook.
Ecosystem Status: Perfect Integrity
Security Clearance: Signed with Government Cryptographic Key.`;
            const file = new Blob([fileContent], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `EveryZone_${reportActor}_Report_${Date.now()}.${reportFormat.toLowerCase() === 'excel' ? 'xlsx' : reportFormat.toLowerCase()}`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            triggerPushNotification(
              'Smart Report Dispatched',
              `Downloaded ${reportActor} custom financial auditing report in ${reportFormat} format!`,
              '📊',
              'admin'
            );
          }, 300);
          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  // ==========================================
  // DESIGN SYSTEM & ARCHITECTURE TRACER SEQUENCER
  // ==========================================
  const handleTriggerTrace = (flowType: 'wallet_deposit' | 'auth_check' | 'marketplace_order' | 'realestate_search') => {
    if (isTracing) return;
    setIsTracing(true);
    setActiveTraceFlow(flowType);
    setTraceLogs([]);

    const stepsMap: Record<string, string[]> = {
      wallet_deposit: [
        '🔄 [UI Component] WalletScreen trigger deposit of 14,500 ETB via Chapa',
        '⚡ [Hook] useWallet.deposit(14500) sets loading=true, initial state is signed',
        '🧱 [Service] walletService.processDeposit() runs validation and generates Chapa secure key',
        '🔌 [API Engine] api.wallet.createChapaDeposit() posts encrypted payload to /api/wallet/deposit',
        '☁️ [Cloud Run Node] Express server authenticates token, binds to Port 3000, updates Spanner DB ledger'
      ],
      auth_check: [
        '🔄 [UI Component] IdentityScreen triggers biometric auth scan verification',
        '⚡ [Hook] useAuth.verifyBiometric() sets scanState=scanning',
        '🧱 [Service] authService.verifyBiometric() triggers cryptographic challenge generation',
        '🔌 [API Engine] api.auth.verifyFaydaBiometrics() dispatches public signature to Fayda Agency National DB',
        '☁️ [Cloud Run Node] Express server validates response packet and returns signed JWT token with level'
      ],
      marketplace_order: [
        '🔄 [UI Component] ProductCard checkout click for "Habesha Handwoven Dress"',
        '⚡ [Hook] useMarketplace.createOrder() validates product SKU in local cart state',
        '🧱 [Service] marketplaceService.submitOrder() generates unique UUID for merchant checkout',
        '🔌 [API Engine] api.marketplace.checkoutOrder() sends secure transaction to payments gateway router',
        '☁️ [Cloud Run Node] Express server logs checkout event, flags SRE, and locks funds in digital escrow vault'
      ],
      realestate_search: [
        '🔄 [UI Component] RealEstateScreen performs fuzzy search query: "Bole modern villa"',
        '⚡ [Hook] useRealEstate.searchListings() registers query filter string in memo cache',
        '🧱 [Service] realEstateService.queryListings() optimizes listing records query limits',
        '🔌 [API Engine] api.realEstate.fetchListings() fires REST request to cloud geographic locator database',
        '☁️ [Cloud Run Node] Express server returns verified property array with lat/lng coordinates and images'
      ]
    };

    const steps = stepsMap[flowType] || [];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setTraceLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsTracing(false);
        triggerPushNotification('Flow Trace Completed', `Successfully executed decoupled architectural flow for ${flowType}!`, '🔗', 'system');
      }
    }, 800);
  };

  // ==========================================
  // DISASTER RECOVERY SIMULATOR
  // ==========================================
  const triggerSimulateDisaster = () => {
    setDrStatus({
      backupState: '⚠️ Database desynced due to simulated split-brain',
      recoveryStatus: '🔥 CRITICAL SHUTDOWN PENDING',
      healthCheck: '❌ Port 3000 Gateway Down',
      restartService: 'Running...',
      alerts: '🚨 CRITICAL ALERT DISPATCHED TO SRE'
    });
    setDrLogs(prev => [
      `[ALERT] ${new Date().toLocaleTimeString()} - Webhook response timeout on primary gateway router!`,
      `[FATAL] Database cluster state: UNKNOWN. Outage triggered.`,
      `[SRE] Dispatching recovery daemon scripts to revive services...`,
      ...prev
    ]);

    triggerPushNotification('System Disaster Simulated!', 'Critical services went down. SRE engine auto-recovering...', '🚨', 'system');

    // Run Auto Recovery sequence after 4 seconds
    setTimeout(() => {
      setDrStatus({
        backupState: 'Healthy (Restored to point-in-time)',
        recoveryStatus: '🟢 Recovery Succeeded',
        healthCheck: '100% Core Services Online',
        restartService: 'Completed (Restarted 1 node)',
        alerts: 'Zero Active Alerts'
      });
      setDrLogs(prev => [
        `[HEALTH] Service auto-restart sequence completed. Container port 3000 re-bound.`,
        `[RECOVERY] Recovered database state with 0 byte transactional loss.`,
        `[HEALTH] All health checks returned status 200. Safe state restored.`,
        ...prev
      ]);
      triggerPushNotification('System Recovered Safely', 'Disaster Recovery successfully restored the app to full health!', '💚', 'system');
    }, 4000);
  };

  // ==========================================
  // API TESTER UTILITY
  // ==========================================
  const handleTriggerApiSandbox = () => {
    let mockResponse: any = {};
    if (activeApiSandbox === 'Bank') {
      mockResponse = {
        node: 'CBE_INTEGRATION_GATEWAY',
        handshake: 'SUCCESS',
        protocol: 'ISO 8583 Message Structure',
        accountInquiry: 'Henok Tadesse - Verified Holder',
        escrowEscortBalance: '14,500 ETB Locked',
        latency: '42ms'
      };
    } else if (activeApiSandbox === 'Courier') {
      mockResponse = {
        node: 'SHEGER_EXPRESS_DISPATCH',
        courierId: 'SHG-COURIER-20419',
        activeRoute: 'Bole Atlas -> Hawassa Boulevard',
        assignedVehicle: 'Hero Electric EV-Moped (34 km/h)',
        telemetrySync: 'Active (GPS coordinates verified)',
        escrowReleaseOnSign: true
      };
    } else if (activeApiSandbox === 'Government') {
      mockResponse = {
        authority: 'Ethiopian National ID Agency (MInT)',
        registryNode: 'Fayda Decentralized Verification',
        nationalId: 'FYD-HENOK-ETH-2026',
        biometricsMatched: 'Fingerprints & Iris Verified (Gold Standard)',
        faydaStamps: ['Fayda-Kyc-Passed', 'Tax-Verified']
      };
    } else if (activeApiSandbox === 'Payment Gateway') {
      mockResponse = {
        gateway: 'Chapa Premium Node API',
        secureReference: 'TXN-CHAPA-9941-ADDIS',
        escrowLedgerId: 'ESC-91280-EVERYZONE',
        settlementCurrency: 'ETB',
        webhookVerifyCode: 'SHA256_MATCH',
        autoDisburseOnTrigger: 'Pending Signature'
      };
    } else if (activeApiSandbox === 'AI Provider') {
      mockResponse = {
        aiModel: 'Gemini 2.5 Flash Enterprise Server',
        promptTokens: 241,
        completionTokens: 89,
        latency: '340ms',
        generatedAdvice: 'Suggest adding Ethiopian Handwoven Tibeb keywords to maximize organic search queries in the Middle East.'
      };
    }

    setApiResponse(mockResponse);
    triggerPushNotification('API Sandbox Triggered', `Fired real request mock to ${activeApiSandbox} node.`, '🔌', 'admin');
  };

  // ==========================================
  // SEARCH / AUDIT TRAIL LOG FILTRATION
  // ==========================================
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchCat = auditFilter === 'All' || log.category === auditFilter;
      const matchText = log.message.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                        log.user.toLowerCase().includes(auditSearchQuery.toLowerCase());
      return matchCat && matchText;
    });
  }, [auditLogs, auditFilter, auditSearchQuery]);

  return (
    <div className={`p-6 rounded-3xl border text-left mt-8 ${
      isDarkMode ? 'bg-[#0b0b0c] border-zinc-900 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-800'
    } ${accessLargeFont ? 'text-lg' : 'text-sm'} ${accessHighContrast ? 'border-zinc-100 text-black' : ''}`}>
      
      {/* SECTION HEADER TITLE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase font-mono bg-amber-500/10 px-2.5 py-0.5 rounded">
              {lang === 'en' ? 'Phase 9 Enterprise Suite' : 'ምዕራፍ 9 የተሟላ አገልግሎት'}
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
              ★ 100% AUDITED
            </span>
          </div>
          <h2 className={`font-black tracking-tight ${accessLargeFont ? 'text-2xl' : 'text-lg'}`}>
            {lang === 'en' ? 'World-Class Super App Modules' : 'አለም አቀፍ የሱፐር አፕ አገልግሎት ሲስተም'}
          </h2>
          <p className="text-[11px] text-stone-500 font-mono mt-0.5">
            Ecosystem compliance, smart disaster recovery, universal notifications, audit trail & vendor academy.
          </p>
        </div>

        {/* ACCESSIBILITY & AUDIO FEEDBACK CONTROLS QUICK BAR */}
        <div className="flex flex-wrap gap-1.5 items-center bg-black/40 p-1.5 rounded-2xl border border-zinc-900">
          <button
            onClick={() => {
              setAccessLargeFont(!accessLargeFont);
              triggerPushNotification('Accessibility Updated', 'Large Fonts toggled.', '🔍', 'system');
            }}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-xl transition ${
              accessLargeFont ? 'bg-amber-500 text-stone-950 font-black' : 'bg-zinc-900 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle Large Fonts for readability"
          >
            🔍 A+
          </button>
          
          <button
            onClick={() => {
              setAccessHighContrast(!accessHighContrast);
              triggerPushNotification('Accessibility Updated', 'High Contrast mode updated.', '🌓', 'system');
            }}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-xl transition ${
              accessHighContrast ? 'bg-amber-500 text-stone-950 font-black' : 'bg-zinc-900 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle High Contrast Mode"
          >
            🌓 High Contrast
          </button>

          <button
            onClick={() => {
              setAccessScreenReader(!accessScreenReader);
              triggerPushNotification('Accessibility Updated', 'Speech Assist system is now active.', '🔊', 'system');
              setTimeout(() => handleAccessibilitySpeak('Every-zone super app accessibility reader initialized.'), 100);
            }}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-xl transition ${
              accessScreenReader ? 'bg-emerald-500 text-stone-950 font-black' : 'bg-zinc-900 text-stone-400 hover:text-stone-200'
            }`}
            title="Enable Text-to-Speech audio cues"
          >
            🔊 Read Out
          </button>
        </div>
      </div>

      {/* HORIZONTAL SUB-NAVIGATION BAR (The 7 cohesive panels) */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-zinc-900/60">
        {[
          { id: 'notifications', icon: <Bell size={13} />, label: lang === 'en' ? 'Notifications & Favorites' : 'ማሳወቂያዎች እና ምርጫዎች' },
          { id: 'identity', icon: <Award size={13} />, label: lang === 'en' ? 'Identity, Levels & QR' : 'ማንነት፣ ደረጃ እና QR' },
          { id: 'vendor', icon: <BookOpen size={13} />, label: lang === 'en' ? 'Vendor Academy & APIs' : 'የነጋዴዎች አካዳሚ' },
          { id: 'settings', icon: <Settings size={13} />, label: lang === 'en' ? 'Settings & Accessibility' : 'ማስተካከያዎች እና ረዳት' },
          { id: 'monitoring', icon: <Cpu size={13} />, label: lang === 'en' ? 'SRE Monitoring & Audit' : 'የስርዓት ቁጥጥር እና ኦዲት' },
          { id: 'roadmap', icon: <Layers size={13} />, label: lang === 'en' ? 'Roadmap & Revenue Core' : 'የልማት ፍሰትና የገቢ ምንጭ' },
          { id: 'ecosystem', icon: <Sparkles size={13} />, label: lang === 'en' ? 'Every-zone Ecosystem Hub' : 'የኤኮሲስተም ማዕከል' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              handleAccessibilitySpeak(`Navigating to ${tab.label} sub section.`);
            }}
            className={`px-4 py-2 text-xs font-extrabold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-amber-500 text-stone-950 shadow-md font-black scale-102'
                : isDarkMode ? 'bg-zinc-900/60 hover:bg-zinc-850 text-stone-400 hover:text-white border border-zinc-850' : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-950'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB VIEWPORT CONTENT */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        
        {/* ======================================================== */}
        {/* PANEL 1: UNIVERSAL NOTIFICATIONS, FAVORITES & RECENTLY VIEWED */}
        {/* ======================================================== */}
        {activeSubTab === 'notifications' && (
          <motion.div
            key="notifs-panel"
            initial={{ opacity: 0, y: accessReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Universal Notification Center (Feature 1) */}
            <div className={`p-5 rounded-3xl border ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                    <Bell size={14} className="text-amber-500" />
                    <span>{lang === 'en' ? '1. Universal Notification Center' : 'የማሳወቂያዎች ማዕከል'}</span>
                  </h3>
                  <p className="text-[10px] text-stone-500 mt-0.5">Filter, mute, archive or purge records across 9 domain nodes.</p>
                </div>

                {/* Global Notification Actions */}
                <div className="flex gap-1.5">
                  <button
                    onClick={handleReadAllNotifs}
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    Read All
                  </button>
                  <button
                    onClick={() => {
                      setNotifications([]);
                      triggerPushNotification('All Clear', 'Successfully deleted all messages.', '🗑️', 'system');
                      handleAccessibilitySpeak('Purged all notifications.');
                    }}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    Delete All
                  </button>
                </div>
              </div>

              {/* Grid Layout of filters and notification items */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                
                {/* 9 Category filters + Mute buttons */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-stone-500 uppercase block mb-1">Filter by Service Domain</span>
                  {['All', 'Orders', 'Messages', 'Wallet', 'Jobs', 'Matchmaking', 'House', 'Vendor', 'System', 'Promotions'].map(cat => {
                    const isMuted = mutedCategories.includes(cat);
                    const isActive = notifFilter === cat;
                    return (
                      <div key={cat} className="flex gap-1 items-center">
                        <button
                          onClick={() => setNotifFilter(cat)}
                          className={`flex-1 text-left px-3 py-1.5 text-xs font-extrabold rounded-xl transition flex justify-between items-center cursor-pointer ${
                            isActive
                              ? 'bg-amber-500 text-stone-950 font-black'
                              : isDarkMode ? 'bg-zinc-950/60 hover:bg-zinc-900 text-stone-400' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className="text-[8.5px] font-mono opacity-80">
                            ({cat === 'All' ? notifications.filter(x => !x.archived).length : notifications.filter(x => x.category === cat && !x.archived).length})
                          </span>
                        </button>
                        
                        {cat !== 'All' && (
                          <button
                            onClick={() => handleToggleMuteNotifCategory(cat)}
                            className={`p-1.5 rounded-xl border transition cursor-pointer ${
                              isMuted
                                ? 'bg-red-500/20 border-red-500/30 text-red-400'
                                : 'bg-zinc-950 border-zinc-900 text-stone-500 hover:text-stone-300'
                            }`}
                            title={`Toggle mute notifications for ${cat}`}
                          >
                            {isMuted ? '🔇' : '🔊'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Notifications items stream list */}
                <div className="lg:col-span-3 space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3.5 rounded-2xl border text-left flex justify-between items-start gap-3 transition-all ${
                          notif.read
                            ? isDarkMode ? 'bg-zinc-950/20 border-zinc-900/60 opacity-70' : 'bg-stone-100/50 border-stone-200 opacity-80'
                            : isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50/50 border-amber-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[8px] font-mono font-black uppercase bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">
                              {notif.category}
                            </span>
                            <span className="text-xs font-black text-stone-200">{notif.title}</span>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 font-mono leading-relaxed">{notif.body}</p>
                          <span className="text-[9px] text-stone-600 font-mono block mt-1">🕒 {notif.time}</span>
                        </div>

                        {/* Action Nodes per item */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: !n.read } : n));
                              handleAccessibilitySpeak(`Marked as ${notif.read ? 'unread' : 'read'}`);
                            }}
                            className={`p-1.5 rounded-xl border transition cursor-pointer ${
                              notif.read
                                ? 'bg-zinc-900 border-zinc-800 text-stone-500 hover:text-stone-300'
                                : 'bg-amber-500 text-stone-950 hover:bg-amber-600'
                            }`}
                            title="Toggle Read/Unread State"
                          >
                            <Check size={11} />
                          </button>
                          
                          <button
                            onClick={() => handleArchiveNotif(notif.id, notif.title)}
                            className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-stone-400 hover:text-stone-200 p-1.5 rounded-xl cursor-pointer"
                            title="Archive to Background"
                          >
                            <Archive size={11} />
                          </button>

                          <button
                            onClick={() => handleDeleteNotif(notif.id, notif.title)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-xl cursor-pointer"
                            title="Purge Log"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center border border-zinc-900 rounded-3xl bg-black/20">
                      <p className="text-stone-500 text-xs font-mono uppercase">No notifications active in filtered scope.</p>
                      <button
                        onClick={() => {
                          setNotifications(SEED_NOTIFICATIONS);
                          triggerPushNotification('Registry Restored', 'Seeded notifications loaded successfully.', '✅', 'system');
                        }}
                        className="mt-3 bg-zinc-900 hover:bg-zinc-850 text-stone-300 border border-zinc-800 text-[10px] px-3 py-1.5 rounded-xl"
                      >
                        Reset Demo Data
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Grid for Feature 2 (Favorite Center) and Feature 3 (Recently Viewed) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Feature 2: Favorite Center */}
              <div className={`p-5 rounded-3xl border text-left ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                      <Heart size={14} className="text-red-500 fill-red-500" />
                      <span>{lang === 'en' ? '2. Universal Favorite Center' : 'ምርጥ ምርጫዎች ማዕከል'}</span>
                    </h3>
                    <p className="text-[10px] text-stone-500">Keep track of your products, properties, jobs, and creators.</p>
                  </div>
                  <span className="text-[8.5px] font-mono text-stone-500 bg-zinc-900 px-2 py-0.5 rounded">
                    {favorites.length} Saved
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {favorites.length > 0 ? (
                    favorites.map(fav => (
                      <div
                        key={fav.id}
                        className={`p-3 rounded-2xl border flex justify-between items-start gap-1.5 ${
                          isDarkMode ? 'bg-zinc-950/80 border-zinc-900 hover:border-zinc-800' : 'bg-stone-100 border-stone-200'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono font-bold text-red-400 bg-red-500/5 px-1.5 py-0.2 rounded uppercase">
                            {fav.type}
                          </span>
                          <h4 className="font-bold text-[11px] text-stone-200 line-clamp-1">{fav.title}</h4>
                          <p className="text-[9.5px] text-stone-500 font-mono truncate">{fav.subtitle}</p>
                        </div>

                        <button
                          onClick={() => {
                            setFavorites(prev => prev.filter(x => x.id !== fav.id));
                            triggerPushNotification('Item Removed', `Removed ${fav.title} from favorites.`, '💔', 'system');
                            handleAccessibilitySpeak(`Removed from favorites: ${fav.title}`);
                          }}
                          className="text-red-400 hover:bg-red-500/10 p-1 rounded-xl cursor-pointer"
                          title="Remove favorite"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-stone-600 text-xs uppercase font-bold">
                      Favorite registry is empty.
                      <button
                        onClick={() => setFavorites(SEED_FAVORITES)}
                        className="block mx-auto mt-2 text-[10px] text-amber-500 hover:underline"
                      >
                        Reload Defaults
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Feature 3: Recently Viewed */}
              <div className={`p-5 rounded-3xl border text-left ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                      <History size={14} className="text-amber-500" />
                      <span>{lang === 'en' ? '3. Recently Viewed Timeline' : 'በቅርብ የታዩ ነገሮች'}</span>
                    </h3>
                    <p className="text-[10px] text-stone-500">Fast tracking memory node inspired by top global super apps.</p>
                  </div>
                  <button
                    onClick={() => {
                      setRecentlyViewed([]);
                      triggerPushNotification('History Cleared', 'Your session navigation logs were scrubbed.', '🧹', 'system');
                    }}
                    className="text-[9.5px] font-mono text-stone-500 hover:text-stone-300"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {recentlyViewed.length > 0 ? (
                    recentlyViewed.map(item => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border flex justify-between items-center ${
                          isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm">{item.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-[11px] font-black text-stone-200">{item.title}</h4>
                              <span className="text-[7.5px] font-mono text-amber-500 bg-amber-500/5 px-1.5 py-0.2 rounded uppercase">
                                {item.type}
                              </span>
                            </div>
                            <span className="text-[9px] text-stone-500 font-mono">🕒 Visited {item.time}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            // Add back to favorites if clicked
                            const alreadyFav = favorites.some(f => f.title === item.title);
                            if (alreadyFav) {
                              triggerPushNotification('Already Saved', 'This item is already in your Favorite Center.', 'ℹ️', 'system');
                            } else {
                              const newFav: FavoriteItem = {
                                id: `fav-${Date.now()}`,
                                type: item.type === 'Stores' ? 'Vendors' : (item.type as any),
                                title: item.title,
                                subtitle: 'Bespoke high-fidelity marketplace item'
                              };
                              setFavorites([newFav, ...favorites]);
                              triggerPushNotification('Item Liked', `Moved "${item.title}" into Favorite Center!`, '❤️', 'system');
                            }
                          }}
                          className="bg-zinc-900 hover:bg-zinc-850 text-stone-300 text-[9.5px] font-bold px-2 py-1 rounded-xl border border-zinc-850"
                        >
                          + Favorite
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-stone-600 text-xs uppercase font-bold">
                      Session navigation logs are empty.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* PANEL 2: IDENTITY CERTIFICATION, GAMIFICATION & QR WALLET */}
        {/* ======================================================== */}
        {activeSubTab === 'identity' && (
          <motion.div
            key="identity-panel"
            initial={{ opacity: 0, y: accessReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Grid layout containing 1. QR Everywhere, 2. Business Certification, 3. Gamification */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Feature 4: QR Everywhere (Col span 5) */}
              <div className={`lg:col-span-5 p-5 rounded-3xl border flex flex-col justify-between text-left ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div className="border-b border-zinc-900 pb-3 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                    <QrCode size={14} className="text-amber-500" />
                    <span>{lang === 'en' ? '4. QR Everywhere Secure Node' : 'የQR ኮድ ማዕከል'}</span>
                  </h3>
                  <p className="text-[10px] text-stone-500">Universal scan credentials for stores, payments, and tickets.</p>
                </div>

                {/* Tab layout inside QR selector */}
                <div className="flex flex-wrap gap-1 mb-4 bg-zinc-950 p-1 rounded-xl">
                  {['Store', 'Product', 'Wallet', 'Business Card', 'Payment', 'Ticket', 'Invoice'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedQrType(type as any)}
                      className={`text-[9px] font-black uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer ${
                        selectedQrType === type
                          ? 'bg-amber-500 text-stone-950'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* High Fidelity QR Graphics visualizer */}
                <div className="flex flex-col items-center p-4 bg-zinc-950 border border-zinc-900 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-[8px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-400/5 px-2 py-0.5 rounded animate-pulse">
                    🟢 AES-256 SECURE
                  </div>

                  {/* Simulated QR block generated dynamically */}
                  <div className="w-36 h-36 bg-white p-2.5 rounded-2xl flex flex-col items-center justify-center relative shadow-lg">
                    {/* Nested decorative patterns to resemble real high-density QR */}
                    <div className="grid grid-cols-3 gap-1 w-full h-full opacity-90">
                      <div className="border-4 border-black rounded w-9 h-9"></div>
                      <div className="flex flex-wrap gap-0.5 p-1 bg-black/10 rounded"></div>
                      <div className="border-4 border-black rounded w-9 h-9 ml-auto"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-1 bg-black w-full"></div>
                        <div className="h-2 bg-black/60 w-3/4"></div>
                        <div className="h-1 bg-black/30 w-1/2"></div>
                      </div>
                      <div className="flex items-center justify-center bg-amber-500 text-stone-950 rounded-full font-black text-[9px] w-6 h-6">
                        EZ
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <div className="h-1 bg-black w-full"></div>
                        <div className="h-1 bg-black/80 w-5/6"></div>
                      </div>
                      <div className="border-4 border-black rounded w-9 h-9 mt-auto"></div>
                      <div className="flex flex-wrap gap-0.5 p-1 bg-black/20 rounded"></div>
                      <div className="bg-black w-4 h-4 rounded-sm mt-auto ml-auto"></div>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-amber-500 mt-3 text-center truncate w-full px-4">
                    Payload: {qrPayload}
                  </p>
                  <span className="text-[8.5px] text-stone-500 font-mono mt-0.5">Click "Trigger Scan" below to unlock webhook ledger actions.</span>
                </div>

                {/* Interactive Scan Simulator Action */}
                <button
                  onClick={() => {
                    triggerPushNotification(
                      'QR Node Synchronized',
                      `Verified payload "${qrPayload}". Chapa contract successfully resolved!`,
                      '💳',
                      'wallet'
                    );
                    handleAccessibilitySpeak(`Scanned Everyzone ${selectedQrType} QR code successful.`);
                  }}
                  className="mt-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black uppercase text-[10px] py-2 rounded-2xl cursor-pointer w-full text-center"
                >
                  Simulate Camera Scan Webhook
                </button>
              </div>

              {/* Feature 5 & 6: Business Verification & User Levels (Col span 7) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Feature 5: Business Verification Stamps */}
                <div className={`p-5 rounded-3xl border text-left ${
                  isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  <div className="border-b border-zinc-900 pb-3 mb-4">
                    <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                      <Shield size={14} className="text-emerald-400" />
                      <span>{lang === 'en' ? '5. Unified Business Verification' : 'የንግድ ማረጋገጫ ደረጃዎች'}</span>
                    </h3>
                    <p className="text-[10px] text-stone-500">Establish ecosystem trust using biometrics and national database verification.</p>
                  </div>

                  {/* Level selection button triggers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {[
                      { id: 'Verified', label: 'Verified', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                      { id: 'Gold Verified', label: '⭐ Gold Certified', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                      { id: 'Premium Verified', label: '👑 Premium VIP', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                      { id: 'Government Verified', label: '🇪🇹 Gov Audited', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setBusinessVerification(btn.id as any);
                          triggerPushNotification('Identity Upgraded', `Verification state set to: ${btn.id}`, '🛡️', 'admin');
                          handleAccessibilitySpeak(`Verification upgraded to ${btn.id}`);
                        }}
                        className={`p-2 rounded-xl text-left border text-[10px] font-black transition cursor-pointer ${
                          businessVerification === btn.id
                            ? 'bg-amber-500 text-stone-950 border-amber-500 font-black scale-102 shadow'
                            : 'bg-zinc-950 border-zinc-900 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Live preview profile mockup showcasing the chosen badge */}
                  <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏬</span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-extrabold text-[11px] text-stone-200">Abyssinia Weavers Guild PLC</h4>
                          <span className={`text-[7.5px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                            businessVerification === 'Verified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' :
                            businessVerification === 'Gold Verified' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                            businessVerification === 'Premium Verified' ? 'bg-purple-500/10 text-purple-400 border-purple-500/25' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                          }`}>
                            🛡️ {businessVerification}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-0.5">National ID registry: FYD-CORP-4401-2026 • Chapa Escrow Registered</p>
                      </div>
                    </div>

                    <div className="text-[9px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded">
                      🟢 100% SECURED
                    </div>
                  </div>
                </div>

                {/* Feature 6: User Levels Progress Map */}
                <div className={`p-5 rounded-3xl border text-left ${
                  isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
                }`}>
                  <div className="border-b border-zinc-900 pb-3 mb-4">
                    <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                      <Award size={14} className="text-amber-500" />
                      <span>{lang === 'en' ? '6. Gamified User Levels Matrix' : 'የተጠቃሚ ደረጃዎች ማሳያ'}</span>
                    </h3>
                    <p className="text-[10px] text-stone-500">Unlocks lower transaction rates, priority couriers and zero escrow downpayments.</p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center mb-4">
                    {['Bronze', 'Silver', 'Gold', 'Diamond', 'Platinum', 'VIP'].map(level => (
                      <button
                        key={level}
                        onClick={() => {
                          setUserLevel(level as any);
                          const xpMap: Record<string, number> = { Bronze: 500, Silver: 1500, Gold: 3500, Diamond: 8400, Platinum: 15000, VIP: 25000 };
                          setUserXP(xpMap[level]);
                          triggerPushNotification('Ecosystem Tier Updated', `Your test state upgraded to ${level} tier.`, '🏆', 'system');
                          handleAccessibilitySpeak(`Tier set to ${level}`);
                        }}
                        className={`py-1.5 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
                          userLevel === level
                            ? 'bg-amber-500 text-stone-950 border-amber-500'
                            : 'bg-zinc-950 border-zinc-900 text-stone-400'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                  {/* Level progress indicator visualizer */}
                  <div className="space-y-2 font-mono text-xs text-stone-400">
                    <div className="flex justify-between items-center text-[10px]">
                      <span>XP: <strong className="text-amber-500">{userXP.toLocaleString()} / 30,000</strong></span>
                      <span className="text-amber-500">Tier Status: {userLevel} Member</span>
                    </div>
                    {/* Real styled progress bar */}
                    <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-850">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(userXP / 30000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[8px] text-stone-500 block">
                      💡 {userLevel === 'VIP' ? '★ VIP benefits fully active: 0.1% processing fee, free air cargo priority!' : 'Next level unlocks: lower processing fees (-0.5%) & verified premium badge.'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Feature 7: Gamified Achievements System */}
            <div className={`p-5 rounded-3xl border text-left ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" />
                    <span>{lang === 'en' ? '7. Decentralized Achievement Ledger' : 'የስራ ውጤት ማሳያ ማህተሞች'}</span>
                  </h3>
                  <p className="text-[10px] text-stone-500">Collect verified badges from escrow events and customer rating reviews.</p>
                </div>
                <span className="text-[10px] font-mono text-amber-500 font-extrabold bg-amber-500/10 px-2.5 py-0.5 rounded">
                  {achievements.filter(a => a.unlocked).length} Unlocked
                </span>
              </div>

              {/* Achievements flex Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between text-left relative overflow-hidden transition-all ${
                      ach.unlocked
                        ? 'bg-amber-500/5 border-amber-500/30 shadow-md shadow-amber-500/5'
                        : 'bg-zinc-950/40 border-zinc-900/80 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl">{ach.icon}</span>
                        <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded font-bold">
                          +{ach.xp} XP
                        </span>
                      </div>
                      <h4 className="text-[11px] font-black text-stone-200 mt-1">{ach.title}</h4>
                      <p className="text-[9px] text-stone-500 font-mono leading-relaxed">
                        {ach.unlocked ? `Unlocked: ${ach.date}` : `Req: ${ach.progress}`}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (ach.unlocked) {
                          triggerPushNotification('Reward Claimed!', `You claimed your ${ach.xp} XP reward for "${ach.title}"!`, ach.icon, 'system');
                          handleAccessibilitySpeak(`Claimed reward for achievement ${ach.title}`);
                        } else {
                          // Simulate unlock
                          setAchievements(prev => prev.map(a => a.id === ach.id ? { ...a, unlocked: true, date: 'Just now' } : a));
                          triggerPushNotification('Achievement Unlocked!', `Verified badge "${ach.title}" unlocked on ledger.`, ach.icon, 'system');
                        }
                      }}
                      className={`mt-3 w-full py-1 text-[9px] font-black uppercase rounded-lg transition-all ${
                        ach.unlocked
                          ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 cursor-pointer'
                          : 'bg-zinc-900 text-stone-500 cursor-not-allowed border border-zinc-850'
                      }`}
                    >
                      {ach.unlocked ? 'Claim Reward' : 'Unlock Now'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* PANEL 3: VENDOR ACADEMY, SMART REPORTS & API READY */}
        {/* ======================================================== */}
        {activeSubTab === 'vendor' && (
          <motion.div
            key="vendor-panel"
            initial={{ opacity: 0, y: accessReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Grid layout containing Feature 8 (Academy) & Feature 9 (Reports) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
              
              {/* Feature 8: Vendor Academy (Col span 7) */}
              <div className={`lg:col-span-7 p-5 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div className="border-b border-zinc-900 pb-3 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                    <BookOpen size={14} className="text-amber-500" />
                    <span>{lang === 'en' ? '8. Every-zone Vendor Academy Hub' : 'የነጋዴዎች ማሰልጠኛ አካዳሚ'}</span>
                  </h3>
                  <p className="text-[10px] text-stone-500">Accelerate your marketplace revenues using standard AI selling strategies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Side Courses Selection */}
                  <div className="md:col-span-1 space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {ACADEMY_COURSES.map((course, idx) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          setActiveCourseIdx(idx);
                          setSelectedChapterIdx(0);
                          handleAccessibilitySpeak(`Loaded course ${course.title}`);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          activeCourseIdx === idx
                            ? 'bg-amber-500 text-stone-950 border-amber-500'
                            : isDarkMode ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-sm">{course.icon}</span>
                          <span className="text-[7px] font-mono opacity-80">{course.duration}</span>
                        </div>
                        <h4 className="text-[10px] font-black line-clamp-1">
                          {settingsLanguage === 'am' ? course.amTitle : course.title}
                        </h4>
                      </button>
                    ))}
                  </div>

                  {/* Right Side Active Chapter Player */}
                  <div className="md:col-span-2 bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[8.5px] font-mono text-amber-500 font-extrabold uppercase bg-amber-500/5 px-2 py-0.5 rounded">
                        <span>Course Tutorial Node Active</span>
                        <span>Chapter {selectedChapterIdx + 1} of 3</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-stone-200">
                        {ACADEMY_COURSES[activeCourseIdx].title} — {ACADEMY_COURSES[activeCourseIdx].chapters[selectedChapterIdx]}
                      </h4>
                      <p className="text-[10px] text-stone-500 leading-relaxed font-mono">
                        {selectedChapterIdx === 0 && `🎓 Setup instructions: Initialize your secure vendor passport inside Every-zone by proving biometric identity, and synchronize automated escrow payouts.`}
                        {selectedChapterIdx === 1 && `📈 Optimization guide: Learn when to schedule automated Chapa settlements and trigger smart pushes during high frequency regional order streams.`}
                        {selectedChapterIdx === 2 && `💡 Advanced Module: Harness Gemini AI context prompting rules to instantly write multilingual sales descriptions with correct localization.`}
                      </p>
                    </div>

                    {/* Chapter navigation nodes */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(num => (
                          <button
                            key={num}
                            onClick={() => setSelectedChapterIdx(num)}
                            className={`w-4 h-4 rounded-full font-mono text-[8px] font-black transition ${
                              selectedChapterIdx === num ? 'bg-amber-500 text-stone-950' : 'bg-zinc-900 text-stone-400'
                            }`}
                          >
                            {num + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (selectedChapterIdx < 2) {
                            setSelectedChapterIdx(selectedChapterIdx + 1);
                          } else {
                            triggerPushNotification('Course Completed!', `Earned academy badge for "${ACADEMY_COURSES[activeCourseIdx].title}"!`, '🎓', 'system');
                            handleAccessibilitySpeak(`Completed course ${ACADEMY_COURSES[activeCourseIdx].title}`);
                          }
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-[9px] font-black uppercase px-3 py-1.5 rounded-xl transition"
                      >
                        {selectedChapterIdx === 2 ? 'Complete Course' : 'Next Lesson'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 9: Smart Auditing Reports (Col span 5) */}
              <div className={`lg:col-span-5 p-5 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div className="border-b border-zinc-900 pb-3 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                    <Download size={14} className="text-amber-500" />
                    <span>{lang === 'en' ? '9. Multilingual Smart Reports' : 'የሂሳብ መግለጫዎች ማውረጃ'}</span>
                  </h3>
                  <p className="text-[10px] text-stone-500">Compile and export verified cryptographic audits directly on device.</p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Select Actor Role */}
                  <div>
                    <label className="text-[9px] text-stone-500 uppercase font-mono block mb-1">Select Auditor Context</label>
                    <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1 rounded-xl">
                      {['Vendor', 'Agency', 'Customer'].map(role => (
                        <button
                          key={role}
                          onClick={() => setReportActor(role as any)}
                          className={`text-[9.5px] font-black uppercase py-1.5 rounded-lg transition-all cursor-pointer ${
                            reportActor === role ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Export Format */}
                  <div>
                    <label className="text-[9px] text-stone-500 uppercase font-mono block mb-1">Select Output Format File</label>
                    <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1 rounded-xl">
                      {['PDF', 'Excel', 'CSV'].map(format => (
                        <button
                          key={format}
                          onClick={() => setReportFormat(format as any)}
                          className={`text-[9.5px] font-black uppercase py-1.5 rounded-lg transition-all cursor-pointer ${
                            reportFormat === format ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generation Trigger with Simulated Progress loading */}
                  <div className="space-y-2">
                    {isGeneratingReport ? (
                      <div className="space-y-1 bg-zinc-950/80 border border-zinc-900 p-2.5 rounded-2xl">
                        <div className="flex justify-between items-center text-[8.5px] font-mono text-amber-500 font-extrabold uppercase">
                          <span>Assembling cryptographic hashes...</span>
                          <span>{reportProgress}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full transition-all duration-150" style={{ width: `${reportProgress}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={triggerGenerateReport}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-black uppercase text-[10px] py-2.5 rounded-xl cursor-pointer shadow flex items-center justify-center gap-1.5"
                      >
                        <Download size={12} />
                        <span>Compile & Download {reportActor} {reportFormat}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Feature 10: Future-Ready API Sandbox Terminal */}
            <div className={`p-5 rounded-3xl border text-left ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900 pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                    <Cpu size={14} className="text-amber-500" />
                    <span>{lang === 'en' ? '10. Microservice Gateway API Integration Sandbox' : 'ቀጣይነት ያለው የAPI ግንኙነቶች ማሳያ'}</span>
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Pre-architected decoupling wrappers ensuring code remains untouched as banking, payment, courier, or government networks connect.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 bg-zinc-950 p-1 rounded-xl">
                  {['Bank', 'Courier', 'Government', 'Payment Gateway', 'AI Provider'].map(apiName => (
                    <button
                      key={apiName}
                      onClick={() => setActiveApiSandbox(apiName as any)}
                      className={`text-[9.5px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeApiSandbox === apiName ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {apiName}
                    </button>
                  ))}
                </div>
              </div>

              {/* API sandbox terminal output */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-stone-500 uppercase block">Integration Scope</span>
                    <h4 className="text-xs font-black text-stone-300">
                      {activeApiSandbox === 'Bank' && '🏦 National Banks (CBE, Awash, Telebirr Reserve)'}
                      {activeApiSandbox === 'Courier' && '🚚 Sheger Courier Electric Moped Dispatch fleet'}
                      {activeApiSandbox === 'Government' && '🇪🇹 National Identity Agency (Fayda Biometrics Node)'}
                      {activeApiSandbox === 'Payment Gateway' && '💳 Chapa Settlement Webhook Integrator'}
                      {activeApiSandbox === 'AI Provider' && '💡 Google Gemini Flash LLM Advisory Node'}
                    </h4>
                    <p className="text-[10.5px] text-stone-400 leading-relaxed font-mono">
                      {activeApiSandbox === 'Bank' && 'Bypasses legacy core limits by utilizing tokenized virtual ledger contracts.'}
                      {activeApiSandbox === 'Courier' && 'Triggers live dispatch routing signals directly upon Chapa escrow deposit completion.'}
                      {activeApiSandbox === 'Government' && 'Authenticates biometrics securely via end-to-end encrypted TLS tunnels.'}
                      {activeApiSandbox === 'Payment Gateway' && 'Performs zero-trust signature check on webhook payloads for high-speed settlements.'}
                      {activeApiSandbox === 'AI Provider' && 'Provides smart pricing feedback and storefront metadata suggestions dynamically.'}
                    </p>
                  </div>

                  <button
                    onClick={handleTriggerApiSandbox}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-stone-200 font-extrabold uppercase text-[10px] py-2 px-4 rounded-xl cursor-pointer"
                  >
                    Simulate API Call Handshake
                  </button>
                </div>

                <div className="lg:col-span-3">
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 font-mono text-[10px] space-y-2">
                    <div className="flex justify-between items-center text-stone-500 border-b border-zinc-900 pb-1.5">
                      <span>Live JSON Output</span>
                      <span className="text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded uppercase">200 OK</span>
                    </div>
                    <pre className="text-amber-400 leading-relaxed overflow-x-auto select-all p-1 whitespace-pre-wrap">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* PANEL 4: GLOBAL SETTINGS & SYSTEM ACCESSIBILITY */}
        {/* ======================================================== */}
        {activeSubTab === 'settings' && (
          <motion.div
            key="settings-panel"
            initial={{ opacity: 0, y: accessReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Grid layout containing Feature 11 (Settings Grid) and Feature 12 (Accessibility) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
              
              {/* Feature 11: Enterprise Settings Config (Col span 7) */}
              <div className={`lg:col-span-7 p-5 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div>
                  <div className="border-b border-zinc-900 pb-3 mb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                        <Settings size={14} className="text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
                        <span>{lang === 'en' ? '11. Every-zone Core App Settings' : 'የሱፐር አፕ ማስተካከያዎች ማዕከል'}</span>
                      </h3>
                      <p className="text-[10px] text-stone-500">Configure global preferences, security layers, language, and connected hardware.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    {/* Account Settings group */}
                    <div className="bg-zinc-950 p-3.5 rounded-2xl space-y-2.5 border border-zinc-900">
                      <span className="text-[8px] text-stone-500 uppercase block font-black border-b border-zinc-900 pb-1">👤 Account & Privacy</span>
                      <div>
                        <label className="text-[9px] text-stone-400 block mb-1">User Name</label>
                        <input
                          type="text"
                          value={settingsForm.accountName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accountName: e.target.value })}
                          className="bg-black border border-zinc-850 rounded-lg px-2 py-1 w-full text-stone-300 outline-none text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-stone-400 block mb-1">Email Node Address</label>
                        <input
                          type="text"
                          value={settingsForm.accountEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accountEmail: e.target.value })}
                          className="bg-black border border-zinc-850 rounded-lg px-2 py-1 w-full text-stone-300 outline-none text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Security & Notifications group */}
                    <div className="bg-zinc-950 p-3.5 rounded-2xl space-y-2.5 border border-zinc-900 flex flex-col justify-between">
                      <span className="text-[8px] text-stone-500 uppercase block font-black border-b border-zinc-900 pb-1">🛡️ Cryptographic Security</span>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-extrabold text-[10.5px]">Two-Factor Biometrics</h4>
                          <span className="text-[8.5px] text-stone-500">Verify ledger transactions via Fayda</span>
                        </div>
                        <button
                          onClick={() => setSettingsForm({ ...settingsForm, securityTwoFactor: !settingsForm.securityTwoFactor })}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            settingsForm.securityTwoFactor ? 'bg-amber-500 flex justify-end' : 'bg-zinc-800 flex justify-start'
                          }`}
                        >
                          <span className="w-4.5 h-4.5 bg-black rounded-full shadow"></span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-extrabold text-[10.5px]">Global Push Nodes</h4>
                          <span className="text-[8.5px] text-stone-500">Enable real-time transaction updates</span>
                        </div>
                        <button
                          onClick={() => setSettingsForm({ ...settingsForm, notificationsEnabled: !settingsForm.notificationsEnabled })}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            settingsForm.notificationsEnabled ? 'bg-amber-500 flex justify-end' : 'bg-zinc-800 flex justify-start'
                          }`}
                        >
                          <span className="w-4.5 h-4.5 bg-black rounded-full shadow"></span>
                        </button>
                      </div>
                    </div>

                    {/* Language & Wallet settings */}
                    <div className="bg-zinc-950 p-3.5 rounded-2xl space-y-2 border border-zinc-900 col-span-1 md:col-span-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <span className="text-[8px] text-stone-500 uppercase block font-black mb-1">🌍 Language & Localized Settings</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              setSettingsLanguage('en');
                              triggerPushNotification('Language Altered', 'System locale shifted to English.', '🇬🇧', 'system');
                            }}
                            className={`px-3 py-1 text-[10px] font-black rounded-lg transition ${
                              settingsLanguage === 'en' ? 'bg-amber-500 text-stone-950' : 'bg-black text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            English
                          </button>
                          <button
                            onClick={() => {
                              setSettingsLanguage('am');
                              triggerPushNotification('ቋንቋ ተቀይሯል', 'የስርዓቱ መግባቢያ ቋንቋ ወደ አማርኛ ተቀይሯል።', '🇪🇹', 'system');
                            }}
                            className={`px-3 py-1 text-[10px] font-black rounded-lg transition ${
                              settingsLanguage === 'am' ? 'bg-amber-500 text-stone-950' : 'bg-black text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            አማርኛ (Amharic)
                          </button>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="text-[8px] text-stone-500 uppercase block font-black mb-1">📱 Associated Active Devices</span>
                        <p className="text-[10px] text-stone-400">Google Pixel 9 Pro • Active Node</p>
                        <span className="text-[8px] text-stone-600 font-mono">Last IP: 196.188.12.4 • Addis Ababa</span>
                      </div>
                    </div>

                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerPushNotification('System Configuration Restructured', 'Successfully saved all nested setting parameters into container memory.', '💾', 'admin');
                    handleAccessibilitySpeak('All settings changes saved successfully.');
                  }}
                  className="mt-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black uppercase text-[10px] py-2 rounded-2xl cursor-pointer w-full text-center"
                >
                  Save Active Configuration Params
                </button>
              </div>

              {/* Feature 12: Advanced Accessibility Controllers (Col span 5) */}
              <div className={`lg:col-span-5 p-5 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div>
                  <div className="border-b border-zinc-900 pb-3 mb-4">
                    <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                      <Volume2 size={14} className="text-amber-500" />
                      <span>{lang === 'en' ? '12. Inclusive Accessibility Core' : 'የአካል ጉዳተኞች ረዳት ማስተካከያ'}</span>
                    </h3>
                    <p className="text-[10px] text-stone-500">Provide adaptive styling constraints for maximum inclusivity.</p>
                  </div>

                  <div className="space-y-3.5 text-xs font-mono">
                    
                    {/* Dark Mode toggle */}
                    <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-900/60">
                      <div>
                        <h4 className="font-extrabold text-[11px]">Force Ambient Dark Canvas</h4>
                        <span className="text-[8.5px] text-stone-500">Calm eye-safe twilight rendering mode</span>
                      </div>
                      <span className="text-stone-300 font-bold bg-zinc-900 px-2 py-0.5 rounded text-[10px]">
                        {isDarkMode ? 'Active 🌙' : 'Inactive ☀️'}
                      </span>
                    </div>

                    {/* Large Font toggle */}
                    <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-900/60">
                      <div>
                        <h4 className="font-extrabold text-[11px]">Large Font Scale Display</h4>
                        <span className="text-[8.5px] text-stone-500">Enhances visual spacing & readability</span>
                      </div>
                      <button
                        onClick={() => {
                          setAccessLargeFont(!accessLargeFont);
                          handleAccessibilitySpeak(`Large fonts scale display ${!accessLargeFont ? 'activated' : 'deactivated'}`);
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          accessLargeFont ? 'bg-amber-500 flex justify-end' : 'bg-zinc-800 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 bg-black rounded-full shadow"></span>
                      </button>
                    </div>

                    {/* High Contrast toggle */}
                    <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-900/60">
                      <div>
                        <h4 className="font-extrabold text-[11px]">High Contrast Mode</h4>
                        <span className="text-[8.5px] text-stone-500">Pure monochrome boundaries for low-sight users</span>
                      </div>
                      <button
                        onClick={() => {
                          setAccessHighContrast(!accessHighContrast);
                          handleAccessibilitySpeak(`High contrast mode ${!accessHighContrast ? 'activated' : 'deactivated'}`);
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          accessHighContrast ? 'bg-amber-500 flex justify-end' : 'bg-zinc-800 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 bg-black rounded-full shadow"></span>
                      </button>
                    </div>

                    {/* Reduce Motion toggle */}
                    <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-900/60">
                      <div>
                        <h4 className="font-extrabold text-[11px]">Reduce Motion Settings</h4>
                        <span className="text-[8.5px] text-stone-500">Mutes framer transitions & flickering</span>
                      </div>
                      <button
                        onClick={() => {
                          setAccessReduceMotion(!accessReduceMotion);
                          handleAccessibilitySpeak(`Reduce motion settings ${!accessReduceMotion ? 'activated' : 'deactivated'}`);
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          accessReduceMotion ? 'bg-amber-500 flex justify-end' : 'bg-zinc-800 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 bg-black rounded-full shadow"></span>
                      </button>
                    </div>

                    {/* Screen Reader Assist */}
                    <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-900/60">
                      <div>
                        <h4 className="font-extrabold text-[11px]">Screen Reader Support</h4>
                        <span className="text-[8.5px] text-stone-500">Triggers standard speech synthesis audio guides</span>
                      </div>
                      <button
                        onClick={() => {
                          setAccessScreenReader(!accessScreenReader);
                          if (!accessScreenReader) {
                            setTimeout(() => handleAccessibilitySpeak('Screen reader active.'), 100);
                          }
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          accessScreenReader ? 'bg-amber-500 flex justify-end' : 'bg-zinc-800 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 bg-black rounded-full shadow"></span>
                      </button>
                    </div>

                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900/60 p-2.5 rounded-xl text-center text-[10px] text-stone-500">
                  ⚡ Accessibility layer active. Custom styles will wrap all v3.0 dashboards automatically.
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* PANEL 5: DISASTER RECOVERY, INTERNAL AUDIT & SYSTEM STATUS */}
        {/* ======================================================== */}
        {activeSubTab === 'monitoring' && (
          <motion.div
            key="monitoring-panel"
            initial={{ opacity: 0, y: accessReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Feature 15: Enterprise Monitoring Live Dashboard Panel */}
            <div className={`p-5 rounded-3xl border text-left ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                    <BarChart2 size={14} className="text-amber-500 animate-pulse" />
                    <span>{lang === 'en' ? '15. Enterprise Monitoring Real-Time Telemetry' : 'የስርዓት ቁጥጥር የቀጥታ መረጃ ሰሌዳ'}</span>
                  </h3>
                  <p className="text-[10px] text-stone-500">Continuous health auditing metrics for APIs, payments, databases & container clusters.</p>
                </div>
                <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded uppercase">
                  ● Core Node Online
                </span>
              </div>

              {/* Dynamic Telemetry metrics cards layout */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
                {[
                  { label: 'API Health', val: `${telemetry.apiHealth.toFixed(1)}%`, icon: '⚡', color: 'text-emerald-400' },
                  { label: 'DB Load', val: `${telemetry.databaseLoad}%`, icon: '🗄️', color: 'text-blue-400' },
                  { label: 'Storage', val: `${telemetry.storageUsage}%`, icon: '💾', color: 'text-amber-500' },
                  { label: 'CPU Usage', val: `${telemetry.cpuUsage}%`, icon: '⚙️', color: 'text-purple-400' },
                  { label: 'RAM Load', val: `${telemetry.ramUsage}%`, icon: '🧬', color: 'text-pink-400' },
                  { label: 'Payments', val: `${telemetry.paymentsRate}/m`, icon: '💳', color: 'text-emerald-500' },
                  { label: 'Pending Ord', val: `${telemetry.ordersPending} active`, icon: '📦', color: 'text-teal-400' },
                  { label: 'Chat Latency', val: `${telemetry.chatLatency}ms`, icon: '💬', color: 'text-yellow-400' },
                  { label: 'Notif Queue', val: `${telemetry.notificationsInQueue} pending`, icon: '🔔', color: 'text-amber-500' }
                ].map(metric => (
                  <div key={metric.label} className="bg-zinc-950 border border-zinc-900/60 p-2.5 rounded-2xl flex flex-col justify-between items-start">
                    <span className="text-[8px] font-mono text-stone-500 uppercase">{metric.label}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs">{metric.icon}</span>
                      <span className={`text-[11px] font-mono font-black ${metric.color}`}>{metric.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid layout containing Feature 13 (DR) & Feature 14 (Audit Trail) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
              
              {/* Feature 13: Disaster Recovery Simulator (Col span 5) */}
              <div className={`lg:col-span-5 p-5 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div>
                  <div className="border-b border-zinc-900 pb-3 mb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                        <Terminal size={14} className="text-amber-500" />
                        <span>{lang === 'en' ? '13. Disaster Recovery Engine' : 'የድንገተኛ አደጋ መከላከያ ስርዓት'}</span>
                      </h3>
                      <p className="text-[10px] text-stone-500">Simulate container failure points and trigger automated backup recovery playbooks.</p>
                    </div>
                  </div>

                  {/* Status displays */}
                  <div className="space-y-2 text-[10.5px] font-mono mb-4 bg-zinc-950 border border-zinc-900 p-3 rounded-2xl">
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-stone-500">DB Backup Node:</span>
                      <span className="text-stone-300 font-bold">{drStatus.backupState}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-stone-500">Recovery Status:</span>
                      <span className="text-stone-300 font-bold">{drStatus.recoveryStatus}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-stone-500">Port 3000 Ingress:</span>
                      <span className="text-stone-300 font-bold">{drStatus.healthCheck}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-stone-500">Service Restart:</span>
                      <span className="text-amber-500 font-bold">{drStatus.restartService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">SRE Alerts Feed:</span>
                      <span className="text-red-400 font-bold">{drStatus.alerts}</span>
                    </div>
                  </div>
                </div>

                {/* SRE Action Trigger buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={triggerSimulateDisaster}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-black uppercase text-[9px] py-2 rounded-xl transition cursor-pointer"
                    >
                      🚨 Force Server Crash
                    </button>
                    <button
                      onClick={() => {
                        setDrStatus({
                          backupState: 'Healthy (Manual sync forced)',
                          recoveryStatus: 'Stable',
                          healthCheck: '100% Core Services Online',
                          restartService: 'None Required',
                          alerts: 'Zero Active Alerts'
                        });
                        setDrLogs(prev => [`[SRE] ${new Date().toLocaleTimeString()} - Forced manual point-in-time recovery backup synch successfully.`, ...prev]);
                        triggerPushNotification('Ledger Backup Complete', 'Point-In-Time recovery snap saved.', '💾', 'system');
                      }}
                      className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-stone-200 border border-zinc-800 font-black uppercase text-[9px] py-2 rounded-xl transition cursor-pointer"
                    >
                      💾 Sync DB Backup
                    </button>
                  </div>

                  {/* Micro live logs inside DR component */}
                  <div className="bg-black p-2 rounded-xl h-[80px] overflow-y-auto font-mono text-[8.5px] text-stone-400 border border-zinc-900 space-y-1">
                    {drLogs.map((logStr, i) => (
                      <div key={i} className="leading-tight truncate">
                        <span className="text-stone-600">🕒 {new Date().toLocaleTimeString()}</span> &gt; {logStr}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature 14: Internal Security Audit Trail (Col span 7) */}
              <div className={`lg:col-span-7 p-5 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div>
                  <div className="border-b border-zinc-900 pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                        <Shield size={14} className="text-emerald-400" />
                        <span>{lang === 'en' ? '14. Universal Security Audit Trail' : 'የውስጥ የደህንነት ኦዲት መዝገብ'}</span>
                      </h3>
                      <p className="text-[10px] text-stone-500">Searchable continuous hash logs tracking admin alterations and transaction deletes.</p>
                    </div>
                  </div>

                  {/* Audit Filters bar */}
                  <div className="flex flex-wrap gap-1 mb-3 bg-zinc-950 p-1 rounded-xl">
                    {['All', 'Login History', 'Wallet Logs', 'Vendor Logs', 'Changes', 'Deleted Records'].map(filterName => (
                      <button
                        key={filterName}
                        onClick={() => setAuditFilter(filterName)}
                        className={`text-[8.5px] font-black uppercase px-2 py-1 rounded-md transition-all cursor-pointer ${
                          auditFilter === filterName ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {filterName}
                      </button>
                    ))}
                  </div>

                  {/* Audit Search bar */}
                  <div className="mb-3.5 relative">
                    <input
                      type="text"
                      placeholder="Search audit trail by user, IP address, or action message..."
                      value={auditSearchQuery}
                      onChange={(e) => setAuditSearchQuery(e.target.value)}
                      className="bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-1.5 w-full text-[11px] font-mono text-stone-300 outline-none"
                    />
                  </div>

                  {/* Audit Log table stream */}
                  <div className="space-y-1.5 max-h-[145px] overflow-y-auto pr-1">
                    {filteredAuditLogs.length > 0 ? (
                      filteredAuditLogs.map(log => (
                        <div
                          key={log.id}
                          className="bg-zinc-950/60 border border-zinc-900 p-2 rounded-xl flex justify-between items-start gap-2 text-[9.5px] font-mono hover:border-zinc-800"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[7.5px] font-black uppercase bg-zinc-900 text-stone-400 px-1.5 py-0.2 rounded border border-zinc-850">
                                {log.category}
                              </span>
                              <span className="text-stone-500">{log.timestamp}</span>
                            </div>
                            <p className="text-stone-300 font-extrabold leading-tight">{log.message}</p>
                          </div>

                          <div className="text-right text-[8px] text-stone-500">
                            <div>{log.user}</div>
                            <div>{log.ip}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-stone-500 text-xs font-mono py-6 text-center">No matching security logs tracked in active filter.</p>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 flex justify-between items-center text-[9px] font-mono text-stone-500 border-t border-zinc-900/60 pt-3">
                  <span>Audit verification key: SHA256_VERIFIED</span>
                  <button
                    onClick={() => {
                      const newLog: AuditLogEntry = {
                        id: `log-${Date.now()}`,
                        timestamp: 'Just now',
                        category: 'Changes',
                        message: 'Cleared temporary browser cache nodes manually',
                        user: 'Henok Tadesse',
                        ip: '196.188.12.4'
                      };
                      setAuditLogs([newLog, ...auditLogs]);
                      triggerPushNotification('Audit Recorded', 'Injected manual event into persistent audit trail ledger.', '📝', 'admin');
                    }}
                    className="text-amber-500 hover:underline text-[9.5px] font-bold"
                  >
                    + Log Custom Test Event
                  </button>
                </div>
              </div>

            </div>

            {/* ======================================================== */}
            {/* DEV SANDBOX: ARCHITECTURE, DESIGN SYSTEM & RUNTIME CONSOLE */}
            {/* ======================================================== */}
            <div className={`p-6 rounded-3xl border text-left space-y-6 ${
              isDarkMode ? 'bg-black/80 border-zinc-900/80 shadow-2xl' : 'bg-white border-stone-200 shadow-lg'
            }`}>
              
              {/* Header section with active stats */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[9px] font-mono text-amber-500 font-extrabold tracking-widest uppercase bg-amber-500/10 px-2.5 py-0.5 rounded">
                    Every-zone Dev-Suite Terminal
                  </span>
                  <h3 className="text-base font-black uppercase tracking-tight mt-1 flex items-center gap-2">
                    <Terminal size={16} className="text-amber-400" />
                    <span>Design Tokens, Decoupled Tracer & Error Sandbox</span>
                  </h3>
                  <p className="text-[10.5px] text-stone-500 font-mono">
                    Verify complete folder architecture compliance, live component styles, error handling, and 5-layer API trace flows in the preview.
                  </p>
                </div>

                {/* Horizontal tabs */}
                <div className="flex flex-wrap gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-900">
                  {[
                    { id: 'structure', label: '📂 Folder Structure', icon: '📂' },
                    { id: 'design', label: '🎨 Component Library', icon: '🎨' },
                    { id: 'tracer', label: '🔗 Pipeline Tracer', icon: '🔗' },
                    { id: 'errors', label: '🚨 Unified Errors', icon: '🚨' },
                    { id: 'logs', label: '🖥️ Live SRE Terminal', icon: '🖥️' },
                    { id: 'launch', label: '🚀 Launch & Checklist', icon: '🚀' },
                    { id: 'workflow', label: '🏛️ Workflow & DoD', icon: '🏛️' },
                    { id: 'dashboard', label: '📊 PMO Dashboard', icon: '📊' },
                    { id: 'docs', label: '📚 Module Docs', icon: '📚' },
                    { id: 'strategy', label: '📈 Launch Strategy', icon: '📈' },
                    { id: 'support', label: '📞 Support Hub', icon: '📞' },
                    { id: 'brand', label: '🌍 Brand Identity', icon: '🌍' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSandboxTab(tab.id as any);
                        handleAccessibilitySpeak(`Switched sandbox terminal to ${tab.label}`);
                      }}
                      className={`text-[9.5px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        sandboxTab === tab.id
                          ? 'bg-amber-500 text-stone-950'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Render area */}
              <div className="min-h-[350px]">
                
                {/* 1. VISUAL FILE TREE AND DESCRIPTIONS */}
                {sandboxTab === 'structure' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
                  >
                    {/* Visual folder diagram (Col span 5) */}
                    <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 font-mono text-xs text-stone-300 leading-relaxed overflow-x-auto">
                      <span className="text-[9px] font-black text-stone-600 uppercase block mb-3">✓ Visualizing src/ Directory Schema</span>
                      <div className="space-y-0.5">
                        <div className="text-amber-500 font-bold">src/</div>
                        <div className="pl-4 text-emerald-400">├── app/ <span className="text-stone-600 font-normal">// Application core settings</span></div>
                        <div className="pl-4 text-emerald-400">├── navigation/ <span className="text-stone-600 font-normal">// Tab & Stack routers</span></div>
                        <div className="pl-4 text-emerald-400">├── screens/ <span className="text-stone-600 font-normal">// Module dashboards</span></div>
                        <div className="pl-8 text-stone-400">├── marketplace/</div>
                        <div className="pl-8 text-stone-400">├── vendor/</div>
                        <div className="pl-8 text-stone-400">├── wallet/</div>
                        <div className="pl-8 text-stone-400">├── jobs/</div>
                        <div className="pl-8 text-stone-400">├── realEstate/</div>
                        <div className="pl-8 text-stone-400">├── matchmaking/</div>
                        <div className="pl-8 text-stone-400">└── profile/</div>
                        <div className="pl-4 text-amber-500 font-extrabold">├── components/ <span className="text-stone-500 font-normal">// Shared Design System components</span></div>
                        <div className="pl-4 text-amber-500 font-extrabold">├── theme/ <span className="text-stone-500 font-normal">// Colors, radius, typography, shadows</span></div>
                        <div className="pl-4 text-amber-500 font-extrabold">├── hooks/ <span className="text-stone-500 font-normal">// State Management hooks (useWallet, useAuth...)</span></div>
                        <div className="pl-4 text-amber-500 font-extrabold">├── services/ <span className="text-stone-500 font-normal">// Decoupled business logic services</span></div>
                        <div className="pl-4 text-amber-500 font-extrabold">├── api/ <span className="text-stone-500 font-normal">// Centralized HTTP/Fetch endpoints layer</span></div>
                        <div className="pl-4 text-amber-500 font-extrabold">├── types/ <span className="text-stone-500 font-normal">// Global shared TS types & enums</span></div>
                        <div className="pl-4 text-stone-500">├── context/ <span className="text-stone-600">// React state providers</span></div>
                        <div className="pl-4 text-stone-500">├── store/ <span className="text-stone-600">// Shared memory managers</span></div>
                        <div className="pl-4 text-stone-500">├── utils/ <span className="text-stone-600">// Cryptographic & formatting helpers</span></div>
                        <div className="pl-4 text-stone-500">├── constants/ <span className="text-stone-600">// Multilingual strings & assets lookup</span></div>
                        <div className="pl-4 text-stone-500">└── config/ <span className="text-stone-600">// Client settings / Fayda IDs</span></div>
                      </div>
                    </div>

                    {/* Architectural narrative explanation (Col span 7) */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-black uppercase">Decoupled Architectural Flow Blueprint</span>
                        <h4 className="text-sm font-black text-stone-200">Zero-Leak, Type-Safe Data Routing</h4>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          By strictly segregating raw networking endpoints (<span className="text-amber-400 font-mono">api/</span>), client state transitions (<span className="text-amber-400 font-mono">hooks/</span>), and business controllers (<span className="text-amber-400 font-mono">services/</span>), Every-zone ensures 100% testable and modular logic.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900/60 space-y-1.5">
                          <span className="text-[9px] font-mono text-amber-400 font-black">1. DESIGN TOKENS SYSTEM</span>
                          <p className="text-[10.5px] text-stone-500 leading-normal">
                            Hardcoded CSS variables are completely banned. Every layout height, shadow intensity, rounding radius, and text color is mapped directly to our semantic <span className="text-stone-300">src/theme/</span> tokens list.
                          </p>
                        </div>

                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900/60 space-y-1.5">
                          <span className="text-[9px] font-mono text-emerald-400 font-black">2. ENCAPSULATED SERVICE HOOKS</span>
                          <p className="text-[10.5px] text-stone-500 leading-normal">
                            Screens do not call APIs directly. Rather, they subscribe to standard React hooks (e.g. <span className="text-stone-300">useWallet()</span>) which manage background data synchronization while preserving interface performance.
                          </p>
                        </div>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-xs space-y-1">
                        <span className="text-amber-400 font-black flex items-center gap-1.5">
                          💡 Why this folder structure is production-grade:
                        </span>
                        <p className="text-stone-400 leading-relaxed">
                          It ensures that as the Every-zone ecosystem scales from 4 to 9+ modules (Marketplace, Real Estate, Jobs, Matchmaking, etc.), developer collision is reduced to 0%. Each sub-team owns a pristine workspace.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. SHARED DESIGN SYSTEM COMPONENTS SHOWCASE */}
                {sandboxTab === 'design' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-left"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      
                      {/* Interactive Buttons showcase */}
                      <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl space-y-4">
                        <div className="border-b border-zinc-900 pb-1.5">
                          <h4 className="text-xs font-black text-stone-200">1. Buttons & Loaders</h4>
                          <span className="text-[9px] text-stone-500 font-mono">Primary, Secondary, Loader state integrations</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <PrimaryButton label="Primary Solid" icon="CheckCircle2" isDarkMode={isDarkMode} onClick={() => {
                              setDemoToast({ show: true, msg: 'Primary button trigger success!', type: 'success' });
                              triggerPushNotification('Component Handshake', 'Fired PrimaryButton event.', '🖱️', 'system');
                            }} />
                            <SecondaryButton label="Secondary Border" icon="Settings" isDarkMode={isDarkMode} onClick={() => {
                              setDemoToast({ show: true, msg: 'Secondary button trigger success!', type: 'info' });
                            }} />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-stone-500 font-mono">Loader Widget:</span>
                            <DSLoader size={20} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </div>

                      {/* Badges, Avatars & Input Forms */}
                      <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl space-y-4">
                        <div className="border-b border-zinc-900 pb-1.5">
                          <h4 className="text-xs font-black text-stone-200">2. Badges, Avatars & Inputs</h4>
                          <span className="text-[9px] text-stone-500 font-mono">Inputs connected to form states</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <DSBadge label="Fayda KYC Passed" color="success" />
                            <DSBadge label="Locked Escrow" color="warning" />
                            <DSBadge label="API Rate Alert" color="error" />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <DSAvatar label="HT" size="md" />
                            <DSAvatar label="EZ" size="lg" />
                            <span className="text-[10px] text-stone-500 font-mono">Fayda Verified Avatars</span>
                          </div>

                          <DSInput
                            label="Form Input State Integration"
                            placeholder="Type test data here..."
                            value={demoInputVal}
                            onChange={(e) => setDemoInputVal(e.target.value)}
                            isDarkMode={isDarkMode}
                          />
                        </div>
                      </div>

                      {/* Bottom Sheet, Modal, Toast controllers */}
                      <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl space-y-4">
                        <div className="border-b border-zinc-900 pb-1.5">
                          <h4 className="text-xs font-black text-stone-200">3. Popups & Sheets Overlay</h4>
                          <span className="text-[9px] text-stone-500 font-mono">Modal Overlays & Toast Trigger points</span>
                        </div>
                        <div className="space-y-3.5">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setDemoSheetOpen(true)}
                              className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-black uppercase text-[9.5px] py-2 rounded-xl transition cursor-pointer"
                            >
                              🔼 Open Bottom Sheet
                            </button>
                            <button
                              onClick={() => setDemoModalOpen(true)}
                              className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-black uppercase text-[9.5px] py-2 rounded-xl transition cursor-pointer"
                            >
                              🔳 Open Modal Panel
                            </button>
                          </div>

                          <DSSearchBar
                            placeholder="Fuzzy search matching..."
                            value={demoSearchQuery}
                            onChange={(e) => setDemoSearchQuery(e.target.value)}
                            onSearch={(q) => setDemoToast({ show: true, msg: `Searching database for: "${q}"`, type: 'info' })}
                            isDarkMode={isDarkMode}
                          />

                          <p className="text-[10px] text-stone-500 font-mono">
                            Type in input or search bar to view immediate React state binds in preview.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Shared Cards Gallery (Products, Vendors, Houses) */}
                    <div className="space-y-3">
                      <span className="text-[9px] font-mono text-stone-500 uppercase block">Shared Object Card Gallery</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        
                        <ProductCard
                          title="Traditional Habesha Handwoven Dress"
                          price="11,200 ETB"
                          category="Marketplace Luxury"
                          rating={4.9}
                          reviewsCount={108}
                          onBuy={() => setDemoToast({ show: true, msg: 'Checkout item added to escrow!', type: 'success' })}
                          isDarkMode={isDarkMode}
                        />

                        <VendorCard
                          name="Abebe Cultural Tibeb Store"
                          category="Verified Handwoven Garments"
                          location="Bole Shola Market, Addis Ababa"
                          rating={4.8}
                          ordersCount={412}
                          isDarkMode={isDarkMode}
                        />

                        <HouseCard
                          title="Bole Modern Apartment Suite"
                          price="45,000 ETB / month"
                          location="Atlas Close to CBE Branch, Addis"
                          beds={3}
                          baths={2}
                          size="142 sqm"
                          isDarkMode={isDarkMode}
                        />

                      </div>
                    </div>

                    {/* Overlay Component Handlers */}
                    <DSBottomSheet isOpen={demoSheetOpen} onClose={() => setDemoSheetOpen(false)} isDarkMode={isDarkMode}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                          <h4 className="text-xs font-black uppercase text-amber-500">Every-zone Escrow Info Sheet</h4>
                          <span className="text-[8px] font-mono text-stone-500">Fayda Secured Node</span>
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed font-mono">
                          This bottom sheet was rendered dynamically using the modular design system library. It uses framer spring physics to adapt to mobile touch sweeps.
                        </p>
                        <div className="flex gap-2">
                          <PrimaryButton label="Authorize Release" isDarkMode={isDarkMode} onClick={() => {
                            setDemoSheetOpen(false);
                            setDemoToast({ show: true, msg: 'Escrow release signature broadcasted!', type: 'success' });
                          }} />
                          <button onClick={() => setDemoSheetOpen(false)} className="px-4 text-[10px] font-bold uppercase text-stone-400 hover:text-stone-200">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </DSBottomSheet>

                    <DSModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} title="Biometric Security Challenge" isDarkMode={isDarkMode}>
                      <div className="space-y-4 text-left">
                        <p className="text-xs text-stone-400 font-mono leading-relaxed">
                          Please place your finger on your laptop's fingerprint scanner or look into the camera to finalize Fayda cryptographic ledger signing.
                        </p>
                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 font-mono text-[10.5px] space-y-1">
                          <div className="text-stone-500">Authority: MInT Fayda Agency</div>
                          <div className="text-stone-500">Payload Hash: <span className="text-stone-300 font-bold">SHA256_31a8bc...</span></div>
                        </div>
                        <div className="flex justify-end gap-2.5">
                          <button onClick={() => setDemoModalOpen(false)} className="px-4 text-[10px] font-bold uppercase text-stone-500 hover:text-stone-300 cursor-pointer">
                            Cancel
                          </button>
                          <PrimaryButton label="Validate Identity" isDarkMode={isDarkMode} onClick={() => {
                            setDemoModalOpen(false);
                            setDemoToast({ show: true, msg: 'Biometrics check passed on Fayda node!', type: 'success' });
                            triggerPushNotification('Fayda Signature Validated', 'Government ID verification passed.', '🛡️', 'system');
                          }} />
                        </div>
                      </div>
                    </DSModal>

                    <DSToast
                      message={demoToast.msg}
                      type={demoToast.type}
                      show={demoToast.show}
                      onClose={() => setDemoToast(prev => ({ ...prev, show: false }))}
                    />

                  </motion.div>
                )}

                {/* 3. 5-LAYER API & HOOK DATA FLOW TRACER */}
                {sandboxTab === 'tracer' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
                  >
                    
                    {/* Flow controllers (Col span 4) */}
                    <div className="lg:col-span-4 space-y-3">
                      <span className="text-[9px] font-mono text-stone-500 uppercase block mb-1">Select Integration Stream</span>
                      {[
                        { id: 'wallet_deposit', label: '🪙 Chapa Wallet Deposit Flow', icon: '🪙' },
                        { id: 'auth_check', label: '🛡️ Fayda Biometrics Auth Flow', icon: '🛡️' },
                        { id: 'marketplace_order', label: '🛒 Escrow Order Checkout Flow', icon: '🛒' },
                        { id: 'realestate_search', label: '🏠 Real Estate Directory Query', icon: '🏠' }
                      ].map(flow => (
                        <button
                          key={flow.id}
                          disabled={isTracing}
                          onClick={() => handleTriggerTrace(flow.id as any)}
                          className={`w-full p-3.5 rounded-xl border text-left flex justify-between items-center transition ${
                            isTracing ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                          } ${
                            activeTraceFlow === flow.id
                              ? 'bg-amber-500/10 border-amber-500 text-stone-200'
                              : 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 text-stone-400'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-black block">{flow.label}</span>
                            <span className="text-[9px] font-mono text-stone-500">Trace layers handshake timeline</span>
                          </div>
                          <Play size={13} className="text-amber-500" />
                        </button>
                      ))}

                      {activeTraceFlow !== 'none' && (
                        <button
                          onClick={() => {
                            setActiveTraceFlow('none');
                            setTraceLogs([]);
                          }}
                          className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-[10px] font-black uppercase text-stone-400 hover:text-stone-200 rounded-xl transition cursor-pointer text-center"
                        >
                          Clear Trace Log
                        </button>
                      )}
                    </div>

                    {/* Flow tracker log stream (Col span 8) */}
                    <div className="lg:col-span-8 flex flex-col justify-between bg-zinc-950 p-5 rounded-2xl border border-zinc-900 font-mono">
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                          <span className="text-[9.5px] text-stone-400 font-extrabold uppercase">
                            {isTracing ? '⚡ Continuous Ledger Handshake Trace Streaming...' : 'Awaiting Flow Selection...'}
                          </span>
                          <span className="text-[8px] text-stone-500">5-Layer Architecture Match</span>
                        </div>

                        {/* Interactive Timeline Diagrams */}
                        {activeTraceFlow !== 'none' && (
                          <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-zinc-900/60 text-[9.5px]">
                            <div className={`flex flex-col items-center gap-1 ${traceLogs.length >= 1 ? 'text-amber-500 font-bold' : 'text-stone-600'}`}>
                              <span>📱</span><span>Screens UI</span>
                            </div>
                            <div className="text-stone-800">➡</div>
                            <div className={`flex flex-col items-center gap-1 ${traceLogs.length >= 2 ? 'text-emerald-400 font-bold' : 'text-stone-600'}`}>
                              <span>🧬</span><span>Hooks State</span>
                            </div>
                            <div className="text-stone-800">➡</div>
                            <div className={`flex flex-col items-center gap-1 ${traceLogs.length >= 3 ? 'text-indigo-400 font-bold' : 'text-stone-600'}`}>
                              <span>🧱</span><span>Services</span>
                            </div>
                            <div className="text-stone-800">➡</div>
                            <div className={`flex flex-col items-center gap-1 ${traceLogs.length >= 4 ? 'text-purple-400 font-bold' : 'text-stone-600'}`}>
                              <span>🔌</span><span>API Fetch</span>
                            </div>
                            <div className="text-stone-800">➡</div>
                            <div className={`flex flex-col items-center gap-1 ${traceLogs.length >= 5 ? 'text-pink-400 font-bold' : 'text-stone-600'}`}>
                              <span>☁️</span><span>Cloud Backend</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {traceLogs.length > 0 ? (
                            traceLogs.map((log, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className={`text-[10px] py-1.5 px-3 rounded-lg border leading-relaxed ${
                                  idx === traceLogs.length - 1
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-extrabold'
                                    : 'bg-zinc-900/40 border-zinc-900/60 text-stone-400'
                                }`}
                              >
                                {log}
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-10 text-stone-600 text-xs">
                              Select a flow stream on the left to watch raw logs propagate across decoupled modules in real time.
                            </div>
                          )}
                        </div>
                      </div>

                      {isTracing && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-stone-500 text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          <span>Streaming cryptographic stack frames...</span>
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}

                {/* 4. UNIFIED ERROR SYSTEM SIMULATOR */}
                {sandboxTab === 'errors' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
                  >
                    
                    {/* Error triggers (Col span 4) */}
                    <div className="lg:col-span-4 space-y-2.5">
                      <span className="text-[9px] font-mono text-stone-500 uppercase block mb-1">Trigger Standard Systems Errors</span>
                      {[
                        { id: 'network', label: '🔌 1. Network Connection Failure', type: 'network' },
                        { id: 'validation', label: '🛡️ 2. Input Validation Violation', type: 'validation' },
                        { id: 'payment', label: '💳 3. Payment Escrow Decline', type: 'payment' },
                        { id: 'login', label: '🔑 4. Auth Credential Timeout', type: 'login' },
                        { id: 'unknown', label: '👽 5. Unknown VM Intercept', type: 'unknown' }
                      ].map(err => (
                        <button
                          key={err.id}
                          onClick={() => {
                            setSimulatedError(err.type as any);
                            triggerPushNotification('System Alert Intercepted', `Rendered standardized ${err.type} error card.`, '🚨', 'system');
                          }}
                          className={`w-full p-3 rounded-xl border text-left transition text-xs font-black uppercase cursor-pointer ${
                            simulatedError === err.type
                              ? 'bg-red-500/25 border-red-500/40 text-red-400'
                              : 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 text-stone-400 hover:text-stone-300'
                          }`}
                        >
                          {err.label}
                        </button>
                      ))}

                      {simulatedError && (
                        <button
                          onClick={() => setSimulatedError(null)}
                          className="w-full py-2 bg-zinc-900 text-[9.5px] font-mono text-stone-500 hover:text-stone-300 rounded-xl border border-zinc-850 hover:bg-zinc-850 cursor-pointer"
                        >
                          Reset / Clear Error Card
                        </button>
                      )}
                    </div>

                    {/* Live Error Renderer Area (Col span 8) */}
                    <div className="lg:col-span-8 flex items-center justify-center bg-zinc-950 border border-zinc-900 rounded-2xl p-6 min-h-[280px]">
                      {simulatedError ? (
                        <UnifiedErrorComponent
                          type={simulatedError}
                          isDarkMode={isDarkMode}
                          onRetry={() => {
                            setDemoToast({ show: true, msg: 'Re-authenticating handshakes on secure node...', type: 'info' });
                          }}
                          onClose={() => setSimulatedError(null)}
                        />
                      ) : (
                        <div className="text-center space-y-1.5 max-w-sm font-mono">
                          <AlertTriangle className="text-stone-600 mx-auto animate-bounce" size={24} style={{ animationDuration: '3s' }} />
                          <h4 className="text-xs font-black text-stone-500 uppercase tracking-wide">No Active Exception Intercepted</h4>
                          <p className="text-[10px] text-stone-600 leading-relaxed">
                            Click any error simulation target on the left to see the unified error card wrapper handle failure modes gracefully.
                          </p>
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}

                {/* 5. LIVE PRODUCTION LOGS MONITORING TERMINAL */}
                {sandboxTab === 'logs' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
                  >
                    
                    {/* Log operations controllers (Col span 4) */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-amber-500 font-extrabold uppercase">SRE Audit Stream Controls</span>
                        <h4 className="text-xs font-black text-stone-200">Simulate Host Events</h4>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          Push real telemetry actions directly into the persistent server daemon log viewer stream below.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            const newL = {
                              id: `l-${Date.now()}`,
                              level: 'info' as const,
                              message: 'CBE API handshake returned ISO-8583 response: HTTP 200 OK',
                              timestamp: new Date().toLocaleTimeString(),
                              service: 'CBE-Gateway'
                            };
                            setSandboxLogs(prev => [newL, ...prev]);
                            triggerPushNotification('Info Logged', 'CBE gateway heartbeat registered.', '💾', 'system');
                          }}
                          className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-bold text-[9px] uppercase rounded-xl transition cursor-pointer"
                        >
                          Log CBE Handshake
                        </button>
                        <button
                          onClick={() => {
                            const newL = {
                              id: `l-${Date.now()}`,
                              level: 'warn' as const,
                              message: 'Fayda ID verification delay detected on regional router cell (Atlas-Bole)',
                              timestamp: new Date().toLocaleTimeString(),
                              service: 'Fayda-Router'
                            };
                            setSandboxLogs(prev => [newL, ...prev]);
                          }}
                          className="p-2.5 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/25 text-amber-400 font-bold text-[9px] uppercase rounded-xl transition cursor-pointer"
                        >
                          Log Fayda Warn
                        </button>
                        <button
                          onClick={() => {
                            const newL = {
                              id: `l-${Date.now()}`,
                              level: 'error' as const,
                              message: 'Chapa transaction signature verification mismatch on merchant node #4418',
                              timestamp: new Date().toLocaleTimeString(),
                              service: 'Chapa-Verify'
                            };
                            setSandboxLogs(prev => [newL, ...prev]);
                          }}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-400 font-bold text-[9px] uppercase rounded-xl transition cursor-pointer"
                        >
                          Log Chapa Error
                        </button>
                        <button
                          onClick={() => {
                            const newL = {
                              id: `l-${Date.now()}`,
                              level: 'fatal' as const,
                              message: 'Container memory footprint reached 94% threshold, triggering garbage clean',
                              timestamp: new Date().toLocaleTimeString(),
                              service: 'Docker-Host'
                            };
                            setSandboxLogs(prev => [newL, ...prev]);
                          }}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/15 border border-red-500/25 text-red-500 font-bold text-[9px] uppercase rounded-xl transition cursor-pointer"
                        >
                          Log VM Memory Alert
                        </button>
                      </div>

                      <button
                        onClick={() => setSandboxLogs([])}
                        className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-[10px] text-stone-500 hover:text-stone-300 font-black uppercase rounded-xl border border-zinc-850 transition cursor-pointer text-center"
                      >
                        Purge Monitor Buffer
                      </button>
                    </div>

                    {/* Visual terminal console (Col span 8) */}
                    <div className="lg:col-span-8 bg-black p-4 rounded-2xl border border-zinc-900 font-mono text-[10.5px]">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-2.5 text-stone-500 text-[9px]">
                        <span>🖥️ ACTIVE STACK TRACE STREAM • EXPORT READY</span>
                        <span>IP: 196.188.12.4</span>
                      </div>

                      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                        {sandboxLogs.length > 0 ? (
                          sandboxLogs.map(log => {
                            let levelColor = 'text-blue-400';
                            let bgClass = 'bg-blue-500/5';
                            if (log.level === 'warn') {
                              levelColor = 'text-amber-400';
                              bgClass = 'bg-amber-500/5';
                            } else if (log.level === 'error') {
                              levelColor = 'text-rose-500';
                              bgClass = 'bg-rose-500/5';
                            } else if (log.level === 'fatal') {
                              levelColor = 'text-red-500 font-black animate-pulse';
                              bgClass = 'bg-red-500/10 border-red-500/20 border';
                            }

                            return (
                              <div
                                key={log.id}
                                className={`p-2 rounded-xl flex justify-between items-start gap-3 hover:bg-zinc-900/40 transition-colors ${bgClass}`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[8px] font-black uppercase ${levelColor}`}>
                                      [{log.level.toUpperCase()}]
                                    </span>
                                    <span className="text-[8px] text-stone-600 font-mono">🕒 {log.timestamp}</span>
                                    <span className="text-[8.5px] text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded font-extrabold">{log.service}</span>
                                  </div>
                                  <p className="text-stone-300 leading-relaxed font-mono">{log.message}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-16 text-stone-700">
                            Terminal stream buffer empty. Use the controllers on the left to inject simulated server daemon events.
                          </div>
                        )}
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* 6. LAUNCH & PERFORMANCE CHECKLISTS & METRICS */}
                {sandboxTab === 'launch' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-left"
                  >
                    {/* Readiness Overview Banner */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-emerald-400 font-extrabold tracking-widest uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded">
                            Launch Readiness Core Dashboard
                          </span>
                          {isLiveLaunched && (
                            <span className="text-[9px] font-mono text-amber-500 font-extrabold tracking-widest uppercase bg-amber-500/10 px-2.5 py-0.5 rounded animate-bounce">
                              🚀 LIVE ON MAINNET
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-stone-100 uppercase tracking-tight">Every-zone Launch Verification Portal</h4>
                        <p className="text-[11px] text-stone-500 font-mono">
                          Real-time telemetry and validation suite mapped to the 12-Module Launch & Security specifications.
                        </p>
                      </div>

                      {/* Readiness Progress Ring/Bar */}
                      <div className="w-full md:w-64 space-y-1.5 shrink-0">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-stone-300">
                          <span>SYSTEM READINESS LEVEL</span>
                          <span className="text-emerald-400 font-black">
                            {Math.round((Object.values(checkedItems).filter(Boolean).length / Object.keys(checkedItems).length) * 100)}%
                          </span>
                        </div>
                        <div className="h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                            style={{ width: `${(Object.values(checkedItems).filter(Boolean).length / Object.keys(checkedItems).length) * 100}%` }}
                            transition={{ type: 'spring', stiffness: 80 }}
                          />
                        </div>
                        <span className="text-[8.5px] font-mono text-stone-500 block text-right">
                          {Object.values(checkedItems).filter(Boolean).length} / {Object.keys(checkedItems).length} tasks validated
                        </span>
                      </div>
                    </div>

                    {/* Bento Grid: Metrics Simulator & Milestones */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Live Launch Metrics Monitor */}
                      <div className="lg:col-span-7 bg-zinc-950 p-5 rounded-2xl border border-zinc-900/60 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-black text-stone-200 uppercase">📊 Real-Time Launch Telemetry Metrics</h4>
                            <span className="text-[9px] text-stone-500 font-mono">Active tracking nodes simulation</span>
                          </div>
                          <DSBadge label="Streaming Live" color="success" />
                        </div>

                        {/* Metrics readout cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                          
                          <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[8.5px] font-mono text-stone-500 block uppercase">Daily Active Users (DAU)</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-black font-mono text-stone-100">{metricDau}</span>
                              <span className="text-[8px] font-mono text-emerald-400 font-extrabold">▲ 14.5%</span>
                            </div>
                          </div>

                          <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[8.5px] font-mono text-stone-500 block uppercase">Settled Orders</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-black font-mono text-stone-100">{metricOrders}</span>
                              <span className="text-[8px] font-mono text-emerald-400 font-extrabold">▲ {((metricOrders/248)*100-100).toFixed(1)}%</span>
                            </div>
                          </div>

                          <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left col-span-2 sm:col-span-1">
                            <span className="text-[8.5px] font-mono text-stone-500 block uppercase">Gross Revenue</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[10px] font-mono text-amber-500 font-bold">ETB</span>
                              <span className="text-sm font-black font-mono text-stone-100">{metricRevenue.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[8.5px] font-mono text-stone-500 block uppercase">Wallet Transactions</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-black font-mono text-stone-100">{metricTransactions}</span>
                              <span className="text-[8px] font-mono text-stone-500">ledger logs</span>
                            </div>
                          </div>

                          <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[8.5px] font-mono text-stone-500 block uppercase">Container Crash Rate</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className={`text-sm font-black font-mono ${metricCrashRate > 0.02 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {metricCrashRate.toFixed(3)}%
                              </span>
                              <span className="text-[8px] font-mono text-stone-500">SRE SLA</span>
                            </div>
                          </div>

                          <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left col-span-2 sm:col-span-1">
                            <span className="text-[8.5px] font-mono text-stone-500 block uppercase">API Response Time</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className={`text-sm font-black font-mono ${metricResponseTime > 100 ? 'text-amber-400' : 'text-stone-100'}`}>
                                {metricResponseTime}ms
                              </span>
                              <span className="text-[8px] font-mono text-stone-500">p99 avg</span>
                            </div>
                          </div>

                        </div>

                        {/* Interactive Metrics Simulation Panel */}
                        <div className="bg-black/30 p-3.5 rounded-xl border border-zinc-900/60 space-y-2 text-left">
                          <span className="text-[9px] font-mono text-amber-500 font-extrabold uppercase block">
                            ⚡ Simulated User & Market Interactions
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setMetricOrders(prev => prev + 1);
                                setMetricRevenue(prev => prev + 1850);
                                setMetricTransactions(prev => prev + 2);
                                triggerPushNotification('CBE Checkout Logged', 'Simulated 1,850 ETB purchase via Chapa Escrow gateway.', '🪙', 'system');
                                handleAccessibilitySpeak('Order simulation registered successfully');
                              }}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 font-bold text-[9.5px] uppercase rounded-lg transition cursor-pointer"
                            >
                              🪙 Sim Chapa Order (+1)
                            </button>
                            <button
                              onClick={() => {
                                setMetricDau(prev => prev + 450);
                                setMetricResponseTime(prev => prev + 18);
                                if (metricResponseTime > 60) {
                                  setMetricCrashRate(prev => Math.min(prev + 0.005, 0.05));
                                }
                                triggerPushNotification('Stress Test Implemented', 'Registered high-frequency user bursts. Latency and memory metrics updated.', '⚡', 'system');
                              }}
                              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 font-bold text-[9.5px] uppercase rounded-lg transition cursor-pointer"
                            >
                              ⚡ Sim User Spike (+450 DAU)
                            </button>
                            <button
                              onClick={() => {
                                setMetricCrashRate(0.005);
                                setMetricResponseTime(24);
                                triggerPushNotification('SRE Optimized', 'V8 garbage collection run completed. SLA normalized.', '🧹', 'system');
                              }}
                              className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-400 font-bold text-[9.5px] uppercase rounded-lg transition cursor-pointer"
                            >
                              🧹 Optimize Node SLA
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Final Milestones Trackers */}
                      <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-2xl border border-zinc-900/60 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="border-b border-zinc-900 pb-2">
                            <h4 className="text-xs font-black text-stone-200 uppercase">🏁 Final Deployment Milestones</h4>
                            <span className="text-[9px] text-stone-500 font-mono">Verified rollout checklist sequence</span>
                          </div>

                          {/* Roadmap Timeline */}
                          <div className="space-y-3.5 text-left pl-1">
                            {[
                              { label: 'Milestone 1: Refactor Project Structure', status: 'Passed', date: 'Jul 2026' },
                              { label: 'Milestone 2: Complete Core Modules (1-12)', status: 'Passed', date: 'Jul 2026' },
                              { label: 'Milestone 3: Security & Performance Audit', status: 'Passed', date: 'Jul 2026' },
                              { label: 'Milestone 4: Internal Testing & Sanity Sandbox', status: 'Passed', date: 'Jul 2026' },
                              { label: 'Milestone 5: Closed Beta (100-500 Users)', status: 'Active', date: 'Active' },
                              { label: 'Milestone 6: Public Launch on Cloud Run Node', status: isLiveLaunched ? 'Live' : 'Pending', date: isLiveLaunched ? 'Now' : 'Target' },
                            ].map((milestone, idx) => {
                              const isPassed = milestone.status === 'Passed';
                              const isActive = milestone.status === 'Active';
                              const isLive = milestone.status === 'Live';

                              return (
                                <div key={idx} className="flex gap-3 items-start relative">
                                  {idx !== 5 && <div className="absolute left-[7px] top-[18px] bottom-[-18px] w-0.5 bg-zinc-900" />}
                                  
                                  <div className={`w-[15px] h-[15px] rounded-full shrink-0 border flex items-center justify-center text-[8px] font-black ${
                                    isPassed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                                    isActive ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse' :
                                    isLive ? 'bg-pink-500/20 border-pink-500 text-pink-400 animate-bounce' :
                                    'bg-zinc-900 border-zinc-800 text-stone-600'
                                  }`}>
                                    {isPassed ? '✓' : idx + 1}
                                  </div>

                                  <div className="space-y-0.5 flex-1 leading-none">
                                    <div className="flex justify-between items-center">
                                      <span className={`text-[10.5px] font-black ${
                                        isPassed ? 'text-stone-300' :
                                        isActive ? 'text-amber-400' :
                                        isLive ? 'text-pink-400 font-extrabold' : 'text-stone-500'
                                      }`}>
                                        {milestone.label}
                                      </span>
                                      <span className="text-[8px] font-mono text-stone-600 uppercase tracking-widest">{milestone.date}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Trigger Launch Trigger Button */}
                        <div className="pt-4 border-t border-zinc-900 mt-4">
                          <button
                            onClick={() => {
                              setIsLiveLaunched(true);
                              triggerPushNotification('🚀 EVERY-ZONE IS LIVE!', 'SuperApp officially launched on Every-zone network mesh in Addis Ababa!', '🎉', 'system');
                              setDemoToast({ show: true, msg: '🎉 EVERY-ZONE OFFICIALLY LIVE IN ADDIS ABABA!', type: 'success' });
                              handleAccessibilitySpeak('Ecosystem successfully launched in Addis Ababa!');
                            }}
                            className={`w-full p-3 rounded-xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer ${
                              isLiveLaunched
                                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 hover:opacity-90'
                                : 'bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-stone-950 font-extrabold shadow-md hover:shadow-amber-500/15'
                            }`}
                          >
                            <span>{isLiveLaunched ? '🎉 ECOSYSTEM OFFICIALLY LIVE!' : '🚀 TRIGGER WORLDWIDE MAINNET LAUNCH'}</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Functional Modules Interactive Checklist Accordion grids */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-900 pb-2">
                        <div>
                          <h4 className="text-xs font-black text-stone-200 uppercase">📋 Core 12-Module Functional Verification Checklist</h4>
                          <span className="text-[9px] text-stone-500 font-mono">Verify that each core feature has compiled cleanly with real state loops</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              const resetCheck: Record<string, boolean> = {};
                              Object.keys(checkedItems).forEach(k => resetCheck[k] = true);
                              setCheckedItems(resetCheck);
                              triggerPushNotification('All Passed', 'Checklist items verified successfully.', '✓', 'system');
                              handleAccessibilitySpeak('Checked all items to passed state.');
                            }}
                            className="text-[9px] font-mono text-emerald-400 hover:underline cursor-pointer"
                          >
                            Check All (100% Passed)
                          </button>
                          <span className="text-stone-700">|</span>
                          <button
                            onClick={() => {
                              const resetCheck: Record<string, boolean> = {};
                              Object.keys(checkedItems).forEach(k => resetCheck[k] = false);
                              setCheckedItems(resetCheck);
                              handleAccessibilitySpeak('Cleared all checklist items.');
                            }}
                            className="text-[9px] font-mono text-stone-500 hover:underline cursor-pointer"
                          >
                            Reset All
                          </button>
                        </div>
                      </div>

                      {/* Checklist grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        
                        {/* Section 1: Auth & User Profile */}
                        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3 text-left">
                          <div className="border-b border-zinc-900 pb-1.5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-stone-300 uppercase">🔑 Authentication & Profile</span>
                            <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 rounded">Verified</span>
                          </div>
                          <div className="space-y-2">
                            {[
                              { id: 'auth_email', label: 'Email Credentials Login' },
                              { id: 'auth_phone', label: 'Phone Number OTP Verification' },
                              { id: 'auth_google', label: 'Google SSO Authentication' },
                              { id: 'auth_apple', label: 'Apple Login Secure handshake' },
                              { id: 'auth_forgot', label: 'Forgot/Reset Password Protocol' },
                              { id: 'auth_verify_email', label: 'Email Security Verification link' },
                              { id: 'auth_verify_phone', label: 'Phone SMS Gateway verification' },
                              { id: 'auth_2fa', label: 'Two-Factor Authentication (2FA)' },
                              { id: 'prof_edit', label: 'Edit Profile metadata' },
                              { id: 'prof_photo', label: 'Secure profile photo upload' },
                              { id: 'prof_status', label: 'National Biometric ID KYC Status' },
                              { id: 'prof_qr', label: 'Unique Profile QR Identifier' },
                              { id: 'prof_privacy', label: 'Biometrics Privacy Control Settings' },
                              { id: 'prof_timeline', label: 'User Activity Ledger timeline' },
                            ].map(item => (
                              <label key={item.id} className="flex gap-2 items-start text-xs text-stone-400 select-none cursor-pointer hover:text-stone-300">
                                <input
                                  type="checkbox"
                                  checked={checkedItems[item.id] || false}
                                  onChange={() => {
                                    setCheckedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                  }}
                                  className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0 mt-0.5 shrink-0 cursor-pointer"
                                />
                                <span className={`text-[10.5px] font-mono leading-none ${checkedItems[item.id] ? 'text-stone-300 line-through opacity-70' : ''}`}>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Section 2: Marketplace & Vendor Center */}
                        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3 text-left">
                          <div className="border-b border-zinc-900 pb-1.5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-stone-300 uppercase">🛒 Marketplace & Vendor Center</span>
                            <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 rounded">Verified</span>
                          </div>
                          <div className="space-y-2">
                            {[
                              { id: 'mkt_cat', label: 'Categories Taxonomy engine' },
                              { id: 'mkt_search', label: 'Fuzzy item keyword query' },
                              { id: 'mkt_filters', label: 'Multi-criteria filter facets' },
                              { id: 'mkt_wishlist', label: 'User favorites folder list' },
                              { id: 'mkt_cart', label: 'Local caching cart memory' },
                              { id: 'mkt_checkout', label: 'Verified Escrow Secure Checkout' },
                              { id: 'mkt_reviews', label: 'Star reviews and ratings ledger' },
                              { id: 'mkt_store', label: 'Vendor Showcase Digital storefront' },
                              { id: 'mkt_tracking', label: 'Real-time GPS courier delivery tracker' },
                              { id: 'vnd_dash', label: 'Vendor Store live dashboard' },
                              { id: 'vnd_prod', label: 'Vendor product list manager' },
                              { id: 'vnd_orders', label: 'Vendor order processing stream' },
                              { id: 'vnd_analytics', label: 'SRE vendor analytics charts' },
                              { id: 'vnd_followers', label: 'Vendor follower tracking core' },
                              { id: 'vnd_services', label: 'Vendor physical services catalog' },
                              { id: 'vnd_videos', label: 'Vendor product demo video loops' },
                              { id: 'vnd_posts', label: 'Vendor news post timeline feeds' },
                              { id: 'vnd_coupons', label: 'Vendor promotional coupons code validation' },
                              { id: 'vnd_revenue', label: 'Vendor revenue withdraw portal' },
                            ].map(item => (
                              <label key={item.id} className="flex gap-2 items-start text-xs text-stone-400 select-none cursor-pointer hover:text-stone-300">
                                <input
                                  type="checkbox"
                                  checked={checkedItems[item.id] || false}
                                  onChange={() => {
                                    setCheckedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                  }}
                                  className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0 mt-0.5 shrink-0 cursor-pointer"
                                />
                                <span className={`text-[10.5px] font-mono leading-none ${checkedItems[item.id] ? 'text-stone-300 line-through opacity-70' : ''}`}>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Section 3: Wallet, Real Estate & Search */}
                        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3 text-left">
                          <div className="border-b border-zinc-900 pb-1.5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-stone-300 uppercase">🪙 Wallet, Real Estate & Search</span>
                            <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 rounded">Verified</span>
                          </div>
                          <div className="space-y-2">
                            {[
                              { id: 'wlt_bal', label: 'ETB Balance real-time ledger' },
                              { id: 'wlt_dep', label: 'Chapa deposit API webhooks' },
                              { id: 'wlt_with', label: 'CBE bank payout node routing' },
                              { id: 'wlt_transfer', label: 'P2P wallet-to-wallet transfer' },
                              { id: 'wlt_qr', label: 'Wallet QR payment scanner' },
                              { id: 'wlt_history', label: 'Transaction history' },
                              { id: 'wlt_stmt', label: 'PDF transaction ledger generator' },
                              { id: 're_list', label: 'Real Estate listing catalog' },
                              { id: 're_agency', label: 'Broker & Agency digital profiles' },
                              { id: 're_map', label: 'Interactive Map listing locator' },
                              { id: 're_saved', label: 'Saved house bookmark folders' },
                              { id: 're_contact', label: 'Direct agent secure dialer routing' },
                              { id: 're_book', label: 'Home viewing booking appointment' },
                              { id: 'search_uni', label: 'አንድ Search Box (Products, Stores, Services, Houses, Jobs, Agencies, Videos)' },
                            ].map(item => (
                              <label key={item.id} className="flex gap-2 items-start text-xs text-stone-400 select-none cursor-pointer hover:text-stone-300">
                                <input
                                  type="checkbox"
                                  checked={checkedItems[item.id] || false}
                                  onChange={() => {
                                    setCheckedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                  }}
                                  className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0 mt-0.5 shrink-0 cursor-pointer"
                                />
                                <span className={`text-[10.5px] font-mono leading-none ${checkedItems[item.id] ? 'text-stone-300 line-through opacity-70' : ''}`}>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Section 4: Overseas, Matchmaking & Chat */}
                        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3 text-left">
                          <div className="border-b border-zinc-900 pb-1.5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-stone-300 uppercase">🌍 Global Employment & Matching</span>
                            <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 rounded">Verified</span>
                          </div>
                          <div className="space-y-2">
                            {[
                              { id: 'job_agency', label: 'Overseas Ministry licensed agency directory' },
                              { id: 'job_listings', label: 'Verified job postings board' },
                              { id: 'job_apply', label: 'One-click employment job apply form' },
                              { id: 'job_docs', label: 'Biometrics document secure vault upload' },
                              { id: 'job_track', label: 'Visa/Application progress pipeline tracking' },
                              { id: 'job_interview', label: 'Skype/In-app interview schedulers' },
                              { id: 'match_ai', label: 'AI Matchmaking affinity scoring engine' },
                              { id: 'match_verified', label: 'Fayda ID Matchmaking profiles verification' },
                              { id: 'match_chat', label: 'Matchmaking encrypted messaging stack' },
                              { id: 'match_safety', label: 'Emergency Safety Reporting center' },
                              { id: 'match_report', label: 'Block & Flag malicious actor nodes' },
                              { id: 'chat_text', label: 'Real-time text chat socket streams' },
                              { id: 'chat_img', label: 'Secure image attachment uploads' },
                              { id: 'chat_voice', label: 'Voice notes record and wave playback' },
                              { id: 'chat_files', label: 'Encrypted document sharing pipeline' },
                              { id: 'chat_read', label: 'Message read receipts callbacks' },
                              { id: 'chat_typing', label: 'Dynamic user typing indicators' },
                              { id: 'chat_status', label: 'Real-time web socket online statuses' },
                            ].map(item => (
                              <label key={item.id} className="flex gap-2 items-start text-xs text-stone-400 select-none cursor-pointer hover:text-stone-300">
                                <input
                                  type="checkbox"
                                  checked={checkedItems[item.id] || false}
                                  onChange={() => {
                                    setCheckedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                  }}
                                  className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0 mt-0.5 shrink-0 cursor-pointer"
                                />
                                <span className={`text-[10.5px] font-mono leading-none ${checkedItems[item.id] ? 'text-stone-300 line-through opacity-70' : ''}`}>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Section 5: Notifications & Admin Systems */}
                        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3 text-left">
                          <div className="border-b border-zinc-900 pb-1.5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-stone-300 uppercase">📢 Notifications & Admin System</span>
                            <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 rounded">Verified</span>
                          </div>
                          <div className="space-y-2">
                            {[
                              { id: 'notif_push', label: 'Google FCM Mobile Push Notifications' },
                              { id: 'notif_inapp', label: 'In-App real-time toast alert bars' },
                              { id: 'notif_email', label: 'Automated SMTP email notifications system' },
                              { id: 'notif_settings', label: 'Notification categories opt-in/opt-out configuration' },
                              { id: 'adm_dash', label: 'Centralized Administrative dashboard' },
                              { id: 'adm_users', label: 'User accounts and security lock manager' },
                              { id: 'adm_vendors', label: 'Vendor verification and KYC auditor' },
                              { id: 'adm_agencies', label: 'Overseas Employment licensing manager' },
                              { id: 'adm_orders', label: 'Transaction dispute escrow arbiter' },
                              { id: 'adm_wallet', label: 'System overall treasury balance ledgers' },
                              { id: 'adm_reports', label: 'Automated compliance PDF report generators' },
                              { id: 'adm_analytics', label: 'SRE user engagement charts dashboard' },
                            ].map(item => (
                              <label key={item.id} className="flex gap-2 items-start text-xs text-stone-400 select-none cursor-pointer hover:text-stone-300">
                                <input
                                  type="checkbox"
                                  checked={checkedItems[item.id] || false}
                                  onChange={() => {
                                    setCheckedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                  }}
                                  className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0 mt-0.5 shrink-0 cursor-pointer"
                                />
                                <span className={`text-[10.5px] font-mono leading-none ${checkedItems[item.id] ? 'text-stone-300 line-through opacity-70' : ''}`}>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Section 6: Security, Performance, UI & Testing NFRs */}
                        <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3 text-left">
                          <div className="border-b border-zinc-900 pb-1.5 flex justify-between items-center">
                            <span className="text-[10px] font-black text-stone-300 uppercase">🛡️ Security, Performance & UI NFRs</span>
                            <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 rounded">Verified</span>
                          </div>
                          <div className="space-y-2">
                            {[
                              { id: 'sec_ssl', label: '🔐 TLS 1.3 Transport Encrypted layers' },
                              { id: 'sec_jwt', label: '🔐 JWT dual state access refresh tokens' },
                              { id: 'sec_upload', label: '🔐 Malware scanned secure file uploads' },
                              { id: 'sec_val', label: '🔐 API JSON schema input validation' },
                              { id: 'sec_sql', label: '🔐 SQL Injection proof parametrized queries' },
                              { id: 'sec_xss', label: '🔐 XSS sanitized react dynamic values' },
                              { id: 'sec_rate', label: '🔐 API rate limit IP traffic throttling' },
                              { id: 'sec_session', label: '🔐 Multi-device active login sessions logs' },
                              { id: 'sec_audit', label: '🔐 Immutable tamper-proof SRE Audit Logs' },
                              { id: 'perf_lazy', label: '⚡ Lazy loading module component boundaries' },
                              { id: 'perf_comp', label: '⚡ Lossless image compression and caching' },
                              { id: 'perf_pag', label: '⚡ CBE database infinite scroll pagination' },
                              { id: 'perf_cache', label: '⚡ API redis memory caching layers' },
                              { id: 'perf_split', label: '⚡ Webpack chunk split size bundles optimization' },
                              { id: 'perf_leak', label: '⚡ Chrome profiler memory leak clean audit' },
                              { id: 'perf_index', label: '⚡ SQL database optimized index execution plans' },
                              { id: 'ui_dark', label: '📱 Dark Mode visual slate layout' },
                              { id: 'ui_light', label: '📱 Light Mode high-contrast theme layout' },
                              { id: 'ui_tablet', label: '📱 Fluid medium responsive tablet support' },
                              { id: 'ui_small', label: '📱 Extra small screen phone micro layout boundaries' },
                              { id: 'ui_resp', label: '📱 High fidelity Tailwind responsive flex' },
                              { id: 'ui_skel', label: '📱 Skeleton loaders visual state' },
                              { id: 'ui_empty', label: '📱 Standard verified zero data empty states' },
                              { id: 'ui_error', label: '📱 Unified error components interceptors fallback' },
                              { id: 'test_unit', label: '🧪 Jest modular isolated unit testing' },
                              { id: 'test_int', label: '🧪 Decoupled module integration test pipelines' },
                              { id: 'test_e2e', label: '🧪 Cypress E2E visual pipeline flows' },
                              { id: 'test_pay', label: '🧪 Simulated Chapa transaction callbacks testing' },
                              { id: 'test_offline', label: '🧪 Client-side service worker offline support' },
                              { id: 'test_notif', label: '🧪 Notification payload stream latency audit' },
                              { id: 'test_stress', label: '🧪 K6 virtual users API stress tests validation' },
                            ].map(item => (
                              <label key={item.id} className="flex gap-2 items-start text-xs text-stone-400 select-none cursor-pointer hover:text-stone-300">
                                <input
                                  type="checkbox"
                                  checked={checkedItems[item.id] || false}
                                  onChange={() => {
                                    setCheckedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                  }}
                                  className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0 mt-0.5 shrink-0 cursor-pointer"
                                />
                                <span className={`text-[10.5px] font-mono leading-none ${checkedItems[item.id] ? 'text-stone-300 line-through opacity-70' : ''}`}>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                  </motion.div>
                )}

                {/* 7. DEV WORKFLOW & DEFINITION OF DONE */}
                {sandboxTab === 'workflow' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-left"
                  >
                    {/* Header Banner */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-amber-500 font-extrabold tracking-widest uppercase bg-amber-500/10 px-2.5 py-0.5 rounded">
                            🏛️ Governance & DoD Portal
                          </span>
                          <span className="text-[9px] font-mono text-pink-500 font-extrabold tracking-widest uppercase bg-pink-500/10 px-2.5 py-0.5 rounded">
                            Standard Operating Procedure
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-stone-100 uppercase tracking-tight">Structured Development Lifecycle</h4>
                        <p className="text-[11px] text-stone-500 font-mono">
                          Features are routed through absolute testing pipelines. Direct mainnet pushes are strictly locked.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Idea to Release Pipeline Flow */}
                      <div className="lg:col-span-7 bg-zinc-950 p-5 rounded-2xl border border-zinc-900/60 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-black text-stone-200 uppercase">🏛️ Idea-to-Release Workflow (ቅደም ተከተል)</h4>
                            <span className="text-[9px] text-stone-500 font-mono">"Feature በቀጥታ ወደ App አይገባም" (Never deployed directly)</span>
                          </div>
                          <DSBadge label="Active Pipeline" color="info" />
                        </div>

                        {/* Steps Timeline Grid */}
                        <div className="space-y-3 pl-1 text-left relative">
                          {[
                            { id: 'idea', title: 'Idea (ሐሳብ)', desc: 'Defining market-fit user needs in Addis Ababa.', color: 'border-zinc-800 text-stone-400' },
                            { id: 'ux', title: 'UX Design (የተጠቃሚ ተሞክሮ ዲዛይን)', desc: 'Wireframing multi-criteria search and fast checkout flows.', color: 'border-zinc-800 text-stone-400' },
                            { id: 'ui', title: 'UI Design (የተጠቃሚ ገጽታ ዲዛይን)', desc: 'Implementing pixel-perfect design tokens, spacing & color palettes.', color: 'border-zinc-800 text-stone-400' },
                            { id: 'tech', title: 'Technical Design (ቴክኒካል ዲዛይን)', desc: 'Designing decoupled state schema, types & modular interfaces.', color: 'border-zinc-800 text-stone-400' },
                            { id: 'backend', title: 'Backend (የጀርባ ኮድ)', desc: 'Deploying database schemas, controllers & Spanner transactions.', color: 'border-emerald-500/30 text-emerald-400' },
                            { id: 'frontend', title: 'Frontend (የፊት ገጽታ ኮድ)', desc: 'Assembling React screens with state hooks & smooth motion.', color: 'border-emerald-500/30 text-emerald-400' },
                            { id: 'testing', title: 'Testing & QA (ሙከራና ጥራት ማረጋገጫ)', desc: 'Failing tests in Cypress, optimizing performance latency.', color: 'border-amber-500/30 text-amber-400 animate-pulse' },
                            { id: 'review', title: 'Code Review (የኮድ ክለሳ)', desc: 'Checking naming conventions, reusability & security rules.', color: 'border-zinc-800 text-stone-400' },
                            { id: 'release', title: 'Release Candidate (ልቀት)', desc: 'Staging nodes before deploying to verified beta environments.', color: 'border-zinc-800 text-stone-400' }
                          ].map((step, idx) => (
                            <div key={step.id} className="flex gap-4 items-start relative pl-2">
                              {idx < 8 && <div className="absolute left-[13px] top-[24px] bottom-[-24px] w-0.5 bg-zinc-900" />}
                              <div className={`w-[22px] h-[22px] rounded-full border shrink-0 flex items-center justify-center font-mono text-[10px] font-bold bg-zinc-950 ${step.color}`}>
                                {idx + 1}
                              </div>
                              <div className="space-y-0.5 leading-tight">
                                <span className="text-[11px] font-black text-stone-200 block">{step.title}</span>
                                <p className="text-[10px] text-stone-500 font-mono leading-relaxed">{step.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Side: DoD and Release Management */}
                      <div className="lg:col-span-5 space-y-6">
                        
                        {/* Definition of Done Checkbox Suite */}
                        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900/60 space-y-4">
                          <div className="border-b border-zinc-900 pb-2">
                            <h4 className="text-xs font-black text-stone-200 uppercase">📋 Definition of Done (DoD) Checklist</h4>
                            <span className="text-[9px] text-stone-500 font-mono">"Feature ተጠናቋል የሚባለው እነዚህ ሲሟሉ ብቻ ነው"</span>
                          </div>

                          {/* DoD progress */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono font-bold text-stone-400">
                              <span>DoD Compliance</span>
                              <span className="text-amber-500">
                                {Math.round((Object.values(dodChecked).filter(Boolean).length / Object.keys(dodChecked).length) * 100)}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden p-0.5">
                              <div 
                                className="h-full bg-amber-500 rounded-full transition-all duration-300" 
                                style={{ width: `${(Object.values(dodChecked).filter(Boolean).length / Object.keys(dodChecked).length) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2.5 pt-2">
                            {[
                              { id: 'ui', title: 'UI ተጠናቋል', desc: 'All views aligned to design system constraints.' },
                              { id: 'backend', title: 'Backend ተጠናቋል', desc: 'State layers integrated with mock database servers.' },
                              { id: 'api', title: 'API ተፈትኗል', desc: 'Handshakes validated in integrated tracer logs.' },
                              { id: 'darkmode', title: 'Dark Mode ይሰራል', desc: 'No hardcoded light assumptions, seamless toggling.' },
                              { id: 'errors', title: 'Error Handling አለ', desc: 'Zero-crash boundary recovery nodes registered.' },
                              { id: 'loading', title: 'Loading State አለ', desc: 'Micro-animations active during async processes.' },
                              { id: 'empty', title: 'Empty State አለ', desc: 'Visual zero-data instructions shown to end-user.' },
                              { id: 'perf', title: 'Performance ተመርምሯል', desc: 'Memory leaks profile audited. Sub-100ms render SLA.' },
                              { id: 'sec', title: 'Security ተመርምሯል', desc: 'Fayda ID and CBE/Chapa webhook verification checks enabled.' },
                              { id: 'docs', title: 'Documentation ተጽፏል', desc: 'Complete architecture manual recorded in onboarding guide.' }
                            ].map(item => (
                              <label key={item.id} className="flex gap-2 items-start text-xs text-stone-400 select-none cursor-pointer hover:text-stone-300">
                                <input
                                  type="checkbox"
                                  checked={dodChecked[item.id] || false}
                                  onChange={() => {
                                    setDodChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                    handleAccessibilitySpeak(`Toggled DoD item ${item.title}`);
                                  }}
                                  className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0 mt-0.5 shrink-0 cursor-pointer"
                                />
                                <div className="leading-tight">
                                  <span className={`text-[10.5px] font-bold block ${dodChecked[item.id] ? 'text-amber-500 font-extrabold' : 'text-stone-300'}`}>{item.title}</span>
                                  <span className="text-[9px] text-stone-500 font-mono block">{item.desc}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Release Management Node Progression */}
                        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900/60 space-y-4">
                          <div className="border-b border-zinc-900 pb-2">
                            <h4 className="text-xs font-black text-stone-200 uppercase">📂 Release Management Pipeline</h4>
                            <span className="text-[9px] text-stone-500 font-mono">"Production ላይ በቀጥታ አንለቅም" (Staging sequence mandatory)</span>
                          </div>

                          {/* Stages display */}
                          <div className="grid grid-cols-5 gap-1.5">
                            {[
                              { id: 'development', label: 'Dev', desc: 'Active coder sandbox' },
                              { id: 'testing', label: 'Test', desc: 'QA Automated runs' },
                              { id: 'beta', label: 'Beta', desc: 'Closed user tests' },
                              { id: 'rc', label: 'RC', desc: 'Candidate verification' },
                              { id: 'production', label: 'Prod', desc: 'Mainnet Live' }
                            ].map((stage, idx) => {
                              const isActive = releaseStage === stage.id;
                              return (
                                <button
                                  key={stage.id}
                                  onClick={() => {
                                    if (stage.id === 'production' && releaseStage !== 'rc') {
                                      setDemoToast({ show: true, msg: '⚠️ BLOCKED: Deploying directly is restricted. Promote to RC first!', type: 'error' });
                                      triggerPushNotification('Pipeline Security Triggered', 'Blocked direct push. Release Management policy enforces RC verification.', '⚠️', 'system');
                                      handleAccessibilitySpeak('Deployment blocked. Production releases require release candidate approval.');
                                      return;
                                    }
                                    setReleaseStage(stage.id as any);
                                    triggerPushNotification('Release Flow Promoted', `Pipeline updated to: ${stage.label.toUpperCase()}`, '📂', 'system');
                                    setDemoToast({ show: true, msg: `Pipeline promoted to ${stage.label.toUpperCase()}`, type: 'success' });
                                    handleAccessibilitySpeak(`Pipeline updated to ${stage.label}`);
                                  }}
                                  className={`p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition text-center space-y-1 ${
                                    isActive 
                                      ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                                      : 'bg-black/40 border-zinc-900 hover:border-zinc-800 text-stone-500'
                                  }`}
                                >
                                  <span className="text-[10px] font-black">{stage.label}</span>
                                  <span className="text-[7.5px] font-mono leading-none tracking-tight block opacity-60">{stage.desc}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[9px] font-mono text-amber-500 font-extrabold uppercase">🛡️ Release Constraints</span>
                            <p className="text-[10px] text-stone-400 font-mono leading-relaxed">
                              Deployment to **Prod** is locked behind strict security gateways. You must first route the code through **Testing**, promote it to **Beta**, and register a **Release Candidate (RC)** for cryptographic compliance verification.
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 8. WEEKLY PROJECT DASHBOARD */}
                {sandboxTab === 'dashboard' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-left"
                  >
                    {/* Header Banner */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-emerald-400 font-extrabold tracking-widest uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded">
                            📊 PMO & QA Metrics Hub
                          </span>
                          <span className="text-[9px] font-mono text-stone-400 font-extrabold tracking-widest uppercase bg-zinc-900 px-2.5 py-0.5 rounded">
                            Weekly Status Node
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-stone-100 uppercase tracking-tight">Project Health & Test Coverage Indicators</h4>
                        <p className="text-[11px] text-stone-500 font-mono">
                          Live telemetry monitoring overall system test coverage, critical bug resolution rate, and performance indices.
                        </p>
                      </div>
                    </div>

                    {/* Dashboard Metrics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                        <span className="text-[9px] font-mono text-stone-500 block uppercase">Project Progress</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black font-mono text-stone-100">{pmoProgress}%</span>
                          <span className="text-[8px] font-mono text-emerald-400 font-extrabold">▲ 2.1%</span>
                        </div>
                        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pmoProgress}%` }} />
                        </div>
                      </div>

                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                        <span className="text-[9px] font-mono text-stone-500 block uppercase">Active Open Bugs</span>
                        <div className="flex justify-between items-center">
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-xl font-black font-mono ${pmoOpenBugs > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>{pmoOpenBugs}</span>
                            <span className="text-[8.5px] font-mono text-stone-500">tickets</span>
                          </div>
                          {pmoOpenBugs > 0 && (
                            <button
                              onClick={() => {
                                if (pmoOpenBugs > 0) {
                                  setPmoOpenBugs(prev => prev - 1);
                                  setPmoProgress(prev => Math.min(prev + 1, 100));
                                  handleAccessibilitySpeak('Resolved one bug');
                                }
                              }}
                              className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[8.5px] font-mono font-bold rounded cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                        <span className="text-[8px] font-mono text-stone-600">SRE tracking active</span>
                      </div>

                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                        <span className="text-[9px] font-mono text-stone-500 block uppercase">Critical Bugs</span>
                        <div className="flex justify-between items-center">
                          <div className="flex items-baseline gap-1.5">
                            <span className={`text-xl font-black font-mono ${pmoCriticalBugs > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>{pmoCriticalBugs}</span>
                            <span className="text-[8px] font-mono text-red-500 font-extrabold bg-red-500/10 px-1.5 rounded uppercase">Blockers</span>
                          </div>
                          {pmoCriticalBugs > 0 && (
                            <button
                              onClick={() => {
                                if (pmoCriticalBugs > 0) {
                                  setPmoCriticalBugs(prev => prev - 1);
                                  setPmoOpenBugs(prev => Math.max(prev - 1, 0));
                                  handleAccessibilitySpeak('Critical blocker resolved');
                                }
                              }}
                              className="px-2 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[8.5px] font-mono font-bold rounded cursor-pointer"
                            >
                              Fix Block
                            </button>
                          )}
                        </div>
                        <span className="text-[8px] font-mono text-stone-600">SLA priority 1</span>
                      </div>

                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                        <span className="text-[9px] font-mono text-stone-500 block uppercase">Test Coverage</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black font-mono text-stone-100">{pmoTestCoverage}%</span>
                          <span className="text-[8.5px] font-mono text-emerald-400 font-bold">Passed</span>
                        </div>
                        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pmoTestCoverage}%` }} />
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Quality Metrics & Simulation controls */}
                      <div className="lg:col-span-7 bg-zinc-950 p-5 rounded-2xl border border-zinc-900/60 space-y-4">
                        <div className="border-b border-zinc-900 pb-2">
                          <h4 className="text-xs font-black text-stone-200 uppercase">🛡️ Code Review Rules & Simulation</h4>
                          <span className="text-[9px] text-stone-500 font-mono">Strict rules checked during each Pull Request (PR)</span>
                        </div>

                        {/* Code Review Rules List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <div className="bg-black/30 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[9.5px] font-mono text-amber-500 font-extrabold uppercase">1. Naming Convention</span>
                            <p className="text-[10px] text-stone-400 font-mono leading-relaxed">
                              All modules must use camelCase for variables and PascalCase for components. Hardcoded IDs are banned.
                            </p>
                          </div>
                          <div className="bg-black/30 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[9.5px] font-mono text-amber-500 font-extrabold uppercase">2. Reusable Components</span>
                            <p className="text-[10px] text-stone-400 font-mono leading-relaxed">
                              Custom inputs, badges, and avatars must extend shared <span className="text-stone-300">DesignSystemComponents</span> directly.
                            </p>
                          </div>
                          <div className="bg-black/30 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[9.5px] font-mono text-amber-500 font-extrabold uppercase">3. No Duplicate Code</span>
                            <p className="text-[10px] text-stone-400 font-mono leading-relaxed">
                              Hooks and helper wrappers are registered in centralized structures to completely avoid overlapping logic.
                            </p>
                          </div>
                          <div className="bg-black/30 p-3 rounded-xl border border-zinc-900 space-y-1.5 text-left">
                            <span className="text-[9.5px] font-mono text-amber-500 font-extrabold uppercase">4. Performance & Security Check</span>
                            <p className="text-[10px] text-stone-400 font-mono leading-relaxed">
                              V8 leak verification, input data sanitation, and strict accessibility tags (contrast, voice keys) validated.
                            </p>
                          </div>
                        </div>

                        {/* Simulated PR Review Interactive Console */}
                        <div className="bg-black/40 p-4 rounded-xl border border-zinc-900/60 space-y-2.5 text-left">
                          <span className="text-[9.5px] font-mono text-emerald-400 font-black uppercase block">⚡ Pull Request (PR) Simulation Hub</span>
                          <p className="text-[10px] text-stone-400 font-mono">Submit code drafts through simulated review rules.</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setPmoCompletedFeatures(prev => prev + 1);
                                setPmoProgress(prev => Math.min(prev + 2, 100));
                                triggerPushNotification('PR Approved', 'Verified Naming Conventions and Reusability. Code merged.', '🛡️', 'system');
                                setDemoToast({ show: true, msg: '🛡️ PR Approved: Passed Naming & Code Duplicity Checks!', type: 'success' });
                                handleAccessibilitySpeak('Pull request approved successfully');
                              }}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 font-bold text-[9.5px] uppercase rounded-lg transition cursor-pointer"
                            >
                              🛡️ Submit Code Review & Approve PR
                            </button>
                            <button
                              onClick={() => {
                                setPmoOpenBugs(prev => prev + 1);
                                if (Math.random() > 0.6) {
                                  setPmoCriticalBugs(prev => prev + 1);
                                }
                                triggerPushNotification('QA Automation Fail', 'Critical code smell or naming violation found.', '🚨', 'system');
                                setDemoToast({ show: true, msg: '🚨 PR REJECTED: Duplicated code or invalid state found!', type: 'error' });
                                handleAccessibilitySpeak('Pull request rejected by automation');
                              }}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 font-bold text-[9.5px] uppercase rounded-lg transition cursor-pointer"
                            >
                              🚨 Fail Code Review (Inject Code Smell)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Scores Cards & Simulated QA Trigger */}
                      <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-2xl border border-zinc-900/60 flex flex-col justify-between text-left">
                        <div className="space-y-4">
                          <div className="border-b border-zinc-900 pb-2">
                            <h4 className="text-xs font-black text-stone-200 uppercase">📈 Quality Indices & Scores</h4>
                            <span className="text-[9px] text-stone-500 font-mono">Target values audited weekly by PMO</span>
                          </div>

                          {/* Scores Sliders / Displays */}
                          <div className="space-y-3.5">
                            <div>
                              <div className="flex justify-between text-[10px] font-mono font-bold text-stone-300">
                                <span>PERFORMANCE SCORE</span>
                                <span className="text-emerald-400 font-black">{pmoPerformanceScore}/100</span>
                              </div>
                              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden p-0.5 mt-1 border border-zinc-800">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: `${pmoPerformanceScore}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] font-mono font-bold text-stone-300">
                                <span>SECURITY COMPLIANCE</span>
                                <span className="text-emerald-400 font-black">{pmoSecurityScore}/100</span>
                              </div>
                              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden p-0.5 mt-1 border border-zinc-800">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: `${pmoSecurityScore}%` }} />
                              </div>
                            </div>

                            <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1 text-left mt-2">
                              <div className="flex justify-between text-[8px] font-mono text-stone-500">
                                <span>COMPLETED FEATURES</span>
                                <span>PENDING FEATURES</span>
                              </div>
                              <div className="flex justify-between items-baseline">
                                <span className="text-sm font-black font-mono text-stone-100">{pmoCompletedFeatures}</span>
                                <span className="text-xs font-black font-mono text-stone-500">{pmoPendingFeatures} left</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Simulated QA Suite Automation Trigger */}
                        <div className="pt-4 border-t border-zinc-900 mt-4">
                          <button
                            onClick={() => {
                              setPmoTestCoverage(99);
                              setPmoPerformanceScore(99);
                              setPmoSecurityScore(100);
                              setDemoToast({ show: true, msg: '🧹 Full Security & Performance audit completed cleanly!', type: 'success' });
                              triggerPushNotification('QA Audit Successful', 'Performance and security compliance registered at 100% SLA.', '✓', 'system');
                              handleAccessibilitySpeak('Full security and performance audit executed cleanly.');
                            }}
                            className="w-full p-3 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 hover:from-amber-500/20 hover:to-emerald-500/20 border border-amber-500/30 text-amber-400 rounded-xl font-black text-[10.5px] uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>⚡ Trigger SRE Compliance Audit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 9. MODULAR SPECIFICATION DOCUMENTATION */}
                {sandboxTab === 'docs' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-left"
                  >
                    {/* Header Banner */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-purple-400 font-extrabold tracking-widest uppercase bg-purple-500/10 px-2.5 py-0.5 rounded">
                            📚 Interactive Module Documentation
                          </span>
                          <span className="text-[9px] font-mono text-stone-400 font-extrabold tracking-widest uppercase bg-zinc-900 px-2.5 py-0.5 rounded">
                            Developer Onboarding Guide
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-stone-100 uppercase tracking-tight">Ecosystem Architecture & Database Guidelines</h4>
                        <p className="text-[11px] text-stone-500 font-mono">
                          Helps new developers quickly understand the Spanner schemas, security boundaries, and API integrations of each of the 9 core modules.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Module List Navigation (Col span 4) */}
                      <div className="lg:col-span-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-900/60 space-y-2">
                        <span className="text-[9px] font-mono text-stone-600 block uppercase pl-2">Select Core Module</span>
                        <div className="space-y-1 flex flex-col">
                          {[
                            { id: 'marketplace', label: '🛒 Marketplace (ገበያ ቦታ)' },
                            { id: 'vendor', label: '🏪 Vendor Center (የነጋዴዎች ማዕከል)' },
                            { id: 'wallet', label: '🪙 Wallet (የገንዘብ ቦርሳ)' },
                            { id: 'real_estate', label: '🏠 Real Estate (የሪል እስቴት አገልግሎት)' },
                            { id: 'overseas', label: '🌍 Overseas Employment (የውጭ አገር የቅጥር ሁኔታ)' },
                            { id: 'matchmaking', label: '❤️ Matchmaking (የማህበራዊ ትስስር)' },
                            { id: 'ai', label: '🧠 AI Integration (ሰው ሰራሽ አስተውሎት)' },
                            { id: 'chat', label: '💬 Encrypted Chat (ምስጢራዊ መልዕክት)' },
                            { id: 'notifications', label: '📢 Notifications System (የማስታወቂያ)' }
                          ].map(mod => (
                            <button
                              key={mod.id}
                              onClick={() => {
                                setSelectedDocModule(mod.id as any);
                                handleAccessibilitySpeak(`Showing documentation for ${mod.label}`);
                              }}
                              className={`w-full p-2.5 rounded-xl text-left text-[10.5px] font-black uppercase transition-all flex items-center justify-between cursor-pointer border ${
                                selectedDocModule === mod.id
                                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 font-extrabold shadow-sm'
                                  : 'bg-transparent border-transparent text-stone-400 hover:text-stone-200 hover:bg-zinc-900/50'
                              }`}
                            >
                              <span>{mod.label}</span>
                              <span className="text-[8px] font-mono opacity-50">v1.2.0</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right: Selected Documentation Content (Col span 8) */}
                      <div className="lg:col-span-8 bg-zinc-950 p-5 rounded-2xl border border-zinc-900/60 space-y-4 text-stone-300">
                        
                        {/* Selected Module Detail */}
                        {selectedDocModule === 'marketplace' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">🛒 Marketplace Module (ገበያ ቦታ ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">B2C & C2C Digital Goods and Handcrafts Logistics</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Provides multi-faceted search, fuzzy item filters, and a secure holding escrow gateway for verified Addis Ababa buyers.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/screens/marketplace/ProductGrid.tsx` -&gt; Infinite paging.<br />
                                  `src/hooks/useCart.ts` -&gt; Persistent local checkout state.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  Funds remain in the Chapa holding escrow wallet until the physical QR handshake is authenticated by the Sheger Courier.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDocModule === 'vendor' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">🏪 Vendor Center Module (የነጋዴዎች ማዕከል ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">Decoupled Merchant Storefront and Live Analytics</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Empowers traditional Habesha weavers, leather craftsmen, and organic growers to display demo videos, news posts, and withdraw earnings.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/screens/vendor/Dashboard.tsx` -&gt; Interactive sales charts.<br />
                                  `src/hooks/useVendor.ts` -&gt; Manage store state and product inventory lists.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  All vendors must submit biometric national Fayda KYC registry prior to unlocking payout withdrawal permissions.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDocModule === 'wallet' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">🪙 Wallet Module (የገንዘብ ቦርሳ ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">P2P Payments, Bank Payout Gateways and PDF Ledgers</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Direct integrations with Chapa payment Webhooks and Commercial Bank of Ethiopia (CBE) payout networks.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/screens/wallet/TransactionList.tsx` -&gt; High-fidelity financial history.<br />
                                  `src/hooks/useWallet.ts` -&gt; Cryptographic signature verification and balance caching.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  All transfers are secured via secondary biometrics check. Financial events logged in write-only audit trail node.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDocModule === 'real_estate' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">🏠 Real Estate Module (የሪል እስቴት አገልግሎት ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">Interactive Lease Nodes and Map Locators</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Integrated map listing locator, viewing scheduling, and direct agency/broker dialer integrations.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/screens/realEstate/PropertyMap.tsx` -&gt; Renders active listings.<br />
                                  `src/hooks/useLease.ts` -&gt; Manages rent deposits and landlord agreement schemas.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  Rent deposits are locked in CBE bank accounts until digital lease agreements are signed by both counterparties.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDocModule === 'overseas' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">🌍 Overseas Employment Module (የውጭ አገር የቅጥር ሁኔታ ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">Ministry Licensed Placements and Passport Handshakes</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Connects Ethiopian specialized workers with licensed agencies. Manages passport uploads and visa application tracking.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/screens/jobs/AgencyDirectory.tsx` -&gt; Official license audit nodes.<br />
                                  `src/hooks/usePlacement.ts` -&gt; Progress tracking bar data pipeline.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  Only Ministry-authorized agencies can post active jobs. File uploads are scanned for malware payloads.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDocModule === 'matchmaking' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">❤️ Matchmaking Module (የማህበራዊ ትስስር ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">Fayda ID Verified AI Matchmaking Profiles</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Facilitates verified, safe social pairing based on mutual compatibility indices and verified biometric profiles.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/screens/matchmaking/AffinityScore.tsx` -&gt; AI affinity calculation.<br />
                                  `src/hooks/useMatch.ts` -&gt; Manage matching profiles state and reports.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  Profiles must link active Fayda government national registry. Abuse report instantly triggers administrative locking keys.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDocModule === 'ai' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">🧠 AI Integration Module (ሰው ሰራሽ አስተውሎት ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">Gemini-Powered Chatbot & Smart Recommenders</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Smart AI agent assist, generating instant product restock recommendations, automatic matchmaking matches, and search assistance.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/services/gemini.ts` -&gt; Decoupled API connector.<br />
                                  `src/hooks/useAIAgent.ts` -&gt; Prompt management and thread caching.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  Strict content filtering applied to prevent jailbreaks. User tokens are encrypted and kept entirely server-side.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDocModule === 'chat' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">💬 Encrypted Chat Module (ምስጢራዊ መልዕክት ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">Real-Time Messaging and Encrypted File Transmissions</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Low-latency Web Socket chat channels complete with typing indicators, online statuses, and encrypted document sharing.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/screens/chat/ChatWindow.tsx` -&gt; Interactive bubble view.<br />
                                  `src/hooks/useChat.ts` -&gt; Message logs, status notifications caching.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  Direct peer-to-peer transport encryption protocols prevent data inspection by centralized network intermediate hops.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDocModule === 'notifications' && (
                          <div className="space-y-4 font-sans">
                            <div className="border-b border-zinc-900 pb-2 text-left">
                              <h4 className="text-xs font-black text-purple-400 uppercase">📢 Notifications System (የማስታወቂያ ሰነድ)</h4>
                              <p className="text-[10px] text-stone-500 font-mono">Google FCM Push Notifications and SMTP Gateways</p>
                            </div>
                            <div className="space-y-3 font-mono text-[11px] leading-relaxed text-left">
                              <p>
                                **Overview:** Consolidated feed pushing transaction notices, P2P chats, and government status alerts directly to the user viewport.
                              </p>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-amber-500 font-bold block">📂 Core Files & State Scheme</span>
                                <p className="text-stone-500 text-[10px]">
                                  `src/components/NotificationFeed.tsx` -&gt; Real-time alert feed dropdown.<br />
                                  `src/hooks/useNotifications.ts` -&gt; Local storage state caching.
                                </p>
                              </div>
                              <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                                <span className="text-[9px] text-emerald-400 font-bold block">🔒 Security & Escrow SLA</span>
                                <p className="text-stone-500 text-[10px]">
                                  Users retain absolute control over notifications permissions, allowing modular silencing of marketing notifications.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 10. LAUNCH STRATEGY & KPIS (የማስጀመሪያ እቅድ እና አመልካቾች) */}
                {sandboxTab === 'strategy' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-left"
                  >
                    {/* 🎯 የEvery-zone ዋና የንግድ መርህ Centerpiece */}
                    <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-stone-950 p-6 rounded-3xl border border-amber-500/40 shadow-xl relative overflow-hidden">
                      <div className="absolute right-4 top-4 opacity-10">
                        <Award size={120} className="text-amber-500" />
                      </div>
                      <div className="space-y-3 max-w-3xl">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest flex items-center gap-1">
                            <Award size={10} /> 🎯 የEvery-zone ዋና የንግድ መርህ
                          </span>
                          <span className="text-stone-400 font-mono text-[9px]">Ecosystem Core Philosophy</span>
                        </div>
                        <h4 className="text-lg font-black text-amber-400 leading-tight">
                          Every-zone ስኬታማ የሚሆነው በብዙ Feature ብዛት አይደለም!
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                          <div className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 space-y-1">
                            <span className="text-[10px] text-amber-500 font-extrabold uppercase font-mono block">1. ⚡ ፈጣን ስራ</span>
                            <p className="text-[10.5px] text-stone-300">ተጠቃሚው ስራውን በፍጥነት ስለሚጨርስ ነው።</p>
                          </div>
                          <div className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 space-y-1">
                            <span className="text-[10px] text-emerald-400 font-extrabold uppercase font-mono block">2. 🏪 ነጋዴው (Vendor)</span>
                            <p className="text-[10.5px] text-stone-300">ነጋዴው በቀላሉ ሽያጭ አግኝቶ ገቢ ስለሚያገኝ ነው።</p>
                          </div>
                          <div className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 space-y-1">
                            <span className="text-[10px] text-purple-400 font-extrabold uppercase font-mono block">3. 💼 ኤጀንሲው (Agency)</span>
                            <p className="text-[10.5px] text-stone-300">ኤጀንሲዎች ህጋዊ የውጭ ስራ ደንበኞችን ስለሚያገኙ ነው።</p>
                          </div>
                          <div className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 space-y-1">
                            <span className="text-[10px] text-blue-400 font-extrabold uppercase font-mono block">4. 🛒 ደንበኛው (Customer)</span>
                            <p className="text-[10.5px] text-stone-300">ደንበኞች የሚፈልጉትን ነገር በቀላሉ ስለሚያገኙ ነው።</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Launch Levels and KPIs */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left Block: Launch Levels Steps (Launch 0, 1, 2) */}
                      <div className="lg:col-span-6 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                          <div>
                            <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">🚀 3-Stage Rollout Levels</h5>
                            <span className="text-[9px] text-stone-500 font-mono">From internal testing to Play Store launch</span>
                          </div>
                          <span className="text-[8.5px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-extrabold uppercase">
                            Stage: {releaseStage}
                          </span>
                        </div>

                        <div className="space-y-3 text-left">
                          
                          {/* Launch 0 */}
                          <div 
                            onClick={() => {
                              setReleaseStage('testing');
                              setKpiDownloads(35);
                              setKpiRegisteredUsers(20);
                              setKpiVendors(4);
                              setKpiAgencies(1);
                              setKpiOrders(5);
                              setKpiWalletUsers(12);
                              triggerPushNotification('Launch Phase 0 Active', 'Simulated Developer, Friends and 20-50 Test users.', '🚀', 'system');
                              setDemoToast({ show: true, msg: '🚀 Phase 0: Internal Testing Activated!', type: 'info' });
                            }}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              releaseStage === 'testing' || releaseStage === 'development'
                                ? 'bg-amber-500/10 border-amber-500/40 text-stone-200 shadow-md shadow-amber-500/5'
                                : 'bg-black/30 border-zinc-900 hover:border-zinc-800 text-stone-400'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <h6 className="text-[11px] font-extrabold uppercase tracking-tight flex items-center gap-1.5">
                                  <span>🚀 Launch 0 — Internal</span>
                                  <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 px-1 rounded uppercase font-extrabold">ከPlay Store በፊት</span>
                                </h6>
                                <p className="text-[10px] text-stone-500 font-mono leading-relaxed">
                                  Includes **Developer Team, Friends, and 20–50 Test Users**. Focuses purely on gathering logs and fixing bugs (Bug ይሰበስባሉ።).
                                </p>
                              </div>
                              <span className="text-[9px] font-mono bg-zinc-900 px-2 py-0.5 rounded">20-50 Users</span>
                            </div>
                          </div>

                          {/* Launch 1 */}
                          <div 
                            onClick={() => {
                              setReleaseStage('beta');
                              setKpiDownloads(450);
                              setKpiRegisteredUsers(280);
                              setKpiVendors(32);
                              setKpiAgencies(4);
                              setKpiOrders(85);
                              setKpiWalletUsers(110);
                              triggerPushNotification('Launch Phase 1 Active', 'Closed Beta deployment with 100-500 users.', '🚀', 'system');
                              setDemoToast({ show: true, msg: '🚀 Phase 1: Closed Beta Activated!', type: 'info' });
                            }}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              releaseStage === 'beta' || releaseStage === 'rc'
                                ? 'bg-purple-500/10 border-purple-500/40 text-stone-200 shadow-md shadow-purple-500/5'
                                : 'bg-black/30 border-zinc-900 hover:border-zinc-800 text-stone-400'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <h6 className="text-[11px] font-extrabold uppercase tracking-tight flex items-center gap-1.5">
                                  <span>🚀 Launch 1 — Closed Beta</span>
                                  <span className="text-[8px] font-mono font-bold bg-purple-500/10 text-purple-400 px-1 rounded uppercase font-extrabold">የተገደበ ሙከራ</span>
                                </h6>
                                <p className="text-[10px] text-stone-500 font-mono leading-relaxed">
                                  Deploys to **100–500 target users**. Core modules checked: **Marketplace, Wallet, Vendor, Chat, House, and Jobs**. Feedback is systematically compiled (Feedback ይሰበሰባሉ።).
                                </p>
                              </div>
                              <span className="text-[9px] font-mono bg-zinc-900 px-2 py-0.5 rounded">100-500 Users</span>
                            </div>
                          </div>

                          {/* Launch 2 */}
                          <div 
                            onClick={() => {
                              setReleaseStage('production');
                              setKpiDownloads(10450);
                              setKpiRegisteredUsers(2050);
                              setKpiVendors(212);
                              setKpiAgencies(22);
                              setKpiOrders(1020);
                              setKpiWalletUsers(520);
                              triggerPushNotification('Launch Phase 2 Live', 'Ecosystem officially deployed to Play Store and App Store!', '🚀', 'system');
                              setDemoToast({ show: true, msg: '🚀 Phase 2: Official Public Launch Achieved!', type: 'success' });
                            }}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              releaseStage === 'production'
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-stone-200 shadow-md shadow-emerald-500/5'
                                : 'bg-black/30 border-zinc-900 hover:border-zinc-800 text-stone-400'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <h6 className="text-[11px] font-extrabold uppercase tracking-tight flex items-center gap-1.5">
                                  <span>🚀 Launch 2 — Public Release</span>
                                  <span className="text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1 rounded uppercase font-extrabold">ህዝባዊ መለቀቅ</span>
                                </h6>
                                <p className="text-[10px] text-stone-500 font-mono leading-relaxed">
                                  Official deployment to **Google Play Store and Apple App Store**. Available globally to the public (ይለቀቃል።).
                                </p>
                              </div>
                              <span className="text-[9px] font-mono bg-zinc-900 px-2 py-0.5 rounded">Unlimited</span>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Right Block: Live KPI Dashboard Trackers (90-day cycle) */}
                      <div className="lg:col-span-6 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                          <div>
                            <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">📈 First 90 Days KPI Tracker</h5>
                            <span className="text-[9px] text-stone-500 font-mono">የመጀመሪያ 90 ቀን የልኬት ጠቋሚዎች</span>
                          </div>
                          {kpiDownloads >= 10000 && kpiRegisteredUsers >= 2000 && kpiVendors >= 200 && kpiAgencies >= 20 && kpiOrders >= 1000 && kpiWalletUsers >= 500 ? (
                            <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-extrabold">All Targets Met! 🎉</span>
                          ) : (
                            <span className="text-[8.5px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-extrabold">Progressing...</span>
                          )}
                        </div>

                        {/* KPI Grid */}
                        <div className="grid grid-cols-2 gap-3 text-left">
                          
                          {/* Downloads */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-900 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] text-stone-500 uppercase font-mono">Downloads</span>
                              <span className="text-[9px] text-stone-400 font-mono font-bold">{kpiDownloads.toLocaleString()} / 10k</span>
                            </div>
                            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: `${Math.min((kpiDownloads / 10000) * 100, 100)}%` }} />
                            </div>
                          </div>

                          {/* Registered Users */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-900 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] text-stone-500 uppercase font-mono font-extrabold">Reg. Users</span>
                              <span className="text-[9px] text-stone-400 font-mono font-bold">{kpiRegisteredUsers.toLocaleString()} / 2k</span>
                            </div>
                            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{ width: `${Math.min((kpiRegisteredUsers / 2000) * 100, 100)}%` }} />
                            </div>
                          </div>

                          {/* Vendors */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-900 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] text-stone-500 uppercase font-mono">Vendors</span>
                              <span className="text-[9px] text-stone-400 font-mono font-bold">{kpiVendors} / 200</span>
                            </div>
                            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${Math.min((kpiVendors / 200) * 100, 100)}%` }} />
                            </div>
                          </div>

                          {/* Agencies */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-900 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] text-stone-500 uppercase font-mono font-extrabold">Agencies</span>
                              <span className="text-[9px] text-stone-400 font-mono font-bold">{kpiAgencies} / 20</span>
                            </div>
                            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${Math.min((kpiAgencies / 20) * 100, 100)}%` }} />
                            </div>
                          </div>

                          {/* Orders */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-900 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] text-stone-500 uppercase font-mono">Orders</span>
                              <span className="text-[9px] text-stone-400 font-mono font-bold">{kpiOrders} / 1k</span>
                            </div>
                            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-pink-500" style={{ width: `${Math.min((kpiOrders / 1000) * 100, 100)}%` }} />
                            </div>
                          </div>

                          {/* Wallet Users */}
                          <div className="bg-black/30 p-2.5 rounded-xl border border-zinc-900 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] text-stone-500 uppercase font-mono font-extrabold">Wallet Users</span>
                              <span className="text-[9px] text-stone-400 font-mono font-bold">{kpiWalletUsers} / 500</span>
                            </div>
                            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500" style={{ width: `${Math.min((kpiWalletUsers / 500) * 100, 100)}%` }} />
                            </div>
                          </div>

                        </div>

                        {/* Simulator Controls */}
                        <div className="bg-black/40 p-3 rounded-xl border border-zinc-900 space-y-2 text-left">
                          <span className="text-[8.5px] font-mono text-amber-500 font-black uppercase block">⚡ Simulate Growth Interactions (90-Day KPI Booster)</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setKpiDownloads(prev => prev + 450);
                                setKpiRegisteredUsers(prev => prev + 120);
                                setKpiWalletUsers(prev => prev + 30);
                                triggerPushNotification('Ecosystem Download Spike', 'Simulated +450 downloads & +120 new registrations!', '📈', 'system');
                                setDemoToast({ show: true, msg: '📈 Growth Booster: Downloads & Users Spiked!', type: 'success' });
                              }}
                              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[9px] font-mono font-bold rounded cursor-pointer transition-all"
                            >
                              + Sim Downloads/Regs
                            </button>
                            <button
                              onClick={() => {
                                setKpiVendors(prev => Math.min(prev + 12, 300));
                                setKpiAgencies(prev => Math.min(prev + 2, 40));
                                triggerPushNotification('Partner Acquisition Boost', 'Acquired +12 Vendors and +2 Employment Agencies.', '🏪', 'system');
                                setDemoToast({ show: true, msg: '🏪 Vendors & Agencies Acquired!', type: 'success' });
                              }}
                              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold rounded cursor-pointer transition-all"
                            >
                              + Sim Merchant Partners
                            </button>
                            <button
                              onClick={() => {
                                setKpiOrders(prev => prev + 45);
                                setKpiWalletUsers(prev => prev + 25);
                                triggerPushNotification('Orders & Wallet Spike', 'Logged +45 escrow completed orders and +25 wallet activations.', '🪙', 'system');
                                setDemoToast({ show: true, msg: '🪙 Sales Transaction Boost Triggered!', type: 'success' });
                              }}
                              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-[9px] font-mono font-bold rounded cursor-pointer transition-all"
                            >
                              + Sim Orders & Wallets
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Revenue Priorities & Marketing & Continuous Improvement */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Revenue Model Priorities */}
                      <div className="lg:col-span-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 text-left">
                          <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight font-extrabold">💰 Revenue priorities (የገቢ ቅድሚያዎች)</h5>
                          <span className="text-[9px] text-stone-500 font-mono">Immediate Monetization Strategy</span>
                        </div>

                        <div className="space-y-3">
                          
                          {/* Phase 1 Priorities */}
                          <div className="space-y-2 text-left">
                            <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-extrabold uppercase font-extrabold">
                              Phase 1: Immediate (መጀመሪያ ከእነዚህ)
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-left">
                              {[
                                { id: 'vendor', label: '1. Vendor Subs', rate: '500 ETB/mo' },
                                { id: 'featured', label: '2. Featured items', rate: '150 ETB/post' },
                                { id: 'sponsor', label: '3. Sponsored Stores', rate: '1200 ETB/mo' },
                                { id: 'commission', label: '4. Sales Comm. (2%)', rate: '2% Escrow fee' }
                              ].map(p => (
                                <div 
                                  key={p.id}
                                  onClick={() => setSelectedRevenuePri(p.id as any)}
                                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                                    selectedRevenuePri === p.id 
                                      ? 'bg-amber-500/10 border-amber-500/40 text-stone-200' 
                                      : 'bg-black/30 border-zinc-900 hover:border-zinc-800 text-stone-400'
                                  }`}
                                >
                                  <span className="text-[10px] font-bold block leading-none">{p.label}</span>
                                  <span className="text-[8.5px] font-mono text-stone-500 leading-none">{p.rate}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Phase 2 Priorities */}
                          <div className="space-y-2 pt-1 border-t border-zinc-900 text-left">
                            <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-extrabold uppercase font-extrabold">
                              Phase 2: Secondary (ከዚያ በኋላ)
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-mono font-bold text-stone-500">
                              <div className="p-1.5 bg-zinc-900/40 border border-zinc-900 rounded-lg whitespace-nowrap overflow-hidden text-ellipsis">Premium Memb.</div>
                              <div className="p-1.5 bg-zinc-900/40 border border-zinc-900 rounded-lg whitespace-nowrap overflow-hidden text-ellipsis font-extrabold">Business Ads</div>
                              <div className="p-1.5 bg-zinc-900/40 border border-zinc-900 rounded-lg whitespace-nowrap overflow-hidden text-ellipsis">AI Services</div>
                            </div>
                          </div>

                          {/* Live Revenue Projections Calculator */}
                          <div className="bg-black/40 p-3 rounded-xl border border-zinc-900 text-left space-y-2">
                            <span className="text-[9px] font-mono text-emerald-400 font-extrabold uppercase">ETB Revenue Estimator</span>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs text-stone-400">Projected Monthly:</span>
                              <span className="text-sm font-mono font-black text-emerald-400">
                                {((kpiVendors * 500) + (kpiOrders * 80) + (kpiRegisteredUsers * 2.5)).toLocaleString(undefined, {maximumFractionDigits: 0})} ETB
                              </span>
                            </div>
                            <p className="text-[8.5px] text-stone-500 font-mono leading-tight">
                              Estimated dynamically using active KPIs: Subscriptions ({kpiVendors} Vendors @500 ETB), Marketplace Commissions & Featured campaigns.
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* Middle: Marketing Channels & Campaigns */}
                      <div className="lg:col-span-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 text-left">
                          <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">📢 Marketing Launch Channels</h5>
                          <span className="text-[9px] text-stone-500 font-mono">Ecosystem campaign readiness</span>
                        </div>

                        <div className="space-y-3 text-left">
                          
                          {/* Channels List */}
                          <div className="space-y-1.5 text-left">
                            <span className="text-[9.5px] font-mono text-stone-500 uppercase block">Active Channels:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['Telegram', 'TikTok', 'Facebook', 'YouTube', 'Instagram'].map(chan => (
                                <span key={chan} className="text-[9px] font-mono font-bold px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-stone-300 rounded-full font-extrabold">
                                  📱 {chan}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Marketing Materials Readiness */}
                          <div className="space-y-1.5 text-left border-t border-zinc-900 pt-2">
                            <span className="text-[9.5px] font-mono text-stone-500 uppercase block">Content Assets Ready (ይዘጋጁ):</span>
                            <div className="space-y-1.5">
                              {[
                                { label: 'Vendor Success Stories (የነጋዴዎች የስኬት ታሪክ)', status: 'Approved' },
                                { label: 'Customer Success Stories (የደንበኞች አስተያየት)', status: 'Approved' },
                                { label: 'Interactive Tutorial Videos (ቪዲዮ መመሪያዎች)', status: 'Approved' }
                              ].map((m, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-black/40 px-2 py-1.5 rounded-lg border border-zinc-900">
                                  <span className="text-[9.5px] font-mono text-stone-400 leading-tight">{m.label}</span>
                                  <span className="text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1 rounded">Ready</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Blast Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setKpiDownloads(prev => prev + 1200);
                              setKpiRegisteredUsers(prev => prev + 450);
                              triggerPushNotification('⚡ Social Blast Active', 'Campaigns pushed on TikTok, Telegram and Facebook. +1.2k Downloads logged!', '📢', 'system');
                              setDemoToast({ show: true, msg: '📢 Social Marketing Blast deployed successfully!', type: 'success' });
                            }}
                            className="w-full py-2 bg-gradient-to-r from-blue-500/10 to-teal-500/10 hover:from-blue-500/20 hover:to-teal-500/20 border border-blue-500/30 text-blue-400 rounded-xl font-black text-[9.5px] uppercase tracking-wider transition cursor-pointer"
                          >
                            ⚡ Blast Social Campaigns
                          </button>

                        </div>
                      </div>

                      {/* Right: Continuous Improvement */}
                      <div className="lg:col-span-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 text-left">
                          <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">🔄 Continuous Improvement (SLA)</h5>
                          <span className="text-[9px] text-stone-500 font-mono">የረጅም ጊዜ የድጋፍ እና ማሻሻያ እቅድ</span>
                        </div>

                        <div className="space-y-3.5 text-left">
                          
                          {/* SLA Items */}
                          <div className="space-y-2.5 text-left">
                            
                            <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900/60 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-extrabold uppercase text-stone-300">በየ2 ሳምንቱ Bug Fix</span>
                                <span className="text-[8px] font-mono bg-red-500/10 text-red-400 px-1 rounded uppercase font-extrabold">Bi-weekly</span>
                              </div>
                              <p className="text-[9.5px] text-stone-500 font-mono">Continuous deployment cycle checking SRE logs, telemetry metrics, and clearing open issues.</p>
                            </div>

                            <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900/60 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-extrabold uppercase text-stone-300 font-extrabold">በየወሩ Feature Update</span>
                                <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 px-1 rounded uppercase font-extrabold">Monthly</span>
                              </div>
                              <p className="text-[9.5px] text-stone-500 font-mono">Pushing incremental microservices enhancements, wallet integrations, and local business features.</p>
                            </div>

                            <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900/60 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-extrabold uppercase text-stone-300">በየ3 ወሩ Major Release</span>
                                <span className="text-[8px] font-mono bg-blue-500/10 text-blue-400 px-1 rounded uppercase font-extrabold">Quarterly</span>
                              </div>
                              <p className="text-[9.5px] text-stone-500 font-mono">Architecture overhaul, AI feature scaling, Spanner clustering optimizations, and international expansion.</p>
                            </div>

                          </div>

                          {/* Quick Release Action */}
                          <button
                            type="button"
                            onClick={() => {
                              setMetricCrashRate(0.002);
                              setMetricResponseTime(21);
                              setPmoOpenBugs(0);
                              setPmoCriticalBugs(0);
                              triggerPushNotification('Release S-1.0.4 Pushed', 'Bi-weekly release successfully compiled and deployed on Cloud Run cluster.', '🔄', 'system');
                              setDemoToast({ show: true, msg: '🔄 SRE: Bi-weekly Bug-Fix Release deployed successfully!', type: 'success' });
                            }}
                            className="w-full py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 text-purple-400 rounded-xl font-black text-[9.5px] uppercase tracking-wider transition cursor-pointer"
                          >
                            🚀 Trigger Bi-Weekly Hotfix
                          </button>

                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 11. CUSTOMER SUPPORT CENTER (የደንበኞች አገልግሎት ማዕከል) */}
                {sandboxTab === 'support' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-left"
                  >
                    {/* Header Banner */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-emerald-400 font-extrabold tracking-widest uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded font-extrabold">
                            📞 IN-APP CUSTOMER SUPPORT PORTAL
                          </span>
                          <span className="text-[8.5px] font-mono text-stone-400 font-extrabold bg-zinc-900 px-2 rounded uppercase font-extrabold">
                            SLA: በ24 ሰዓት ውስጥ ምላሽ (24-Hour SLA)
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-stone-100 uppercase tracking-tight">Every-zone Help Desk & Ticket System</h4>
                        <p className="text-[11px] text-stone-500 font-mono">
                          Live Chat, FAQ Help Center, and Ticket reporting system supporting the Every-zone mobile client ecosystem.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left Side: Support Ticket System Form */}
                      <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 text-left">
                          <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">✉️ Open a Support Ticket (ሪፖርት አድርግ)</h5>
                          <span className="text-[9px] text-stone-500 font-mono">Submit technical bugs or transaction disputes</span>
                        </div>

                        <div className="space-y-3.5 text-left">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-stone-500 uppercase">Issue Category (ክፍል)</label>
                            <select
                              value={supportCategory}
                              onChange={(e) => setSupportCategory(e.target.value as any)}
                              className="w-full bg-black/60 border border-zinc-900 text-xs rounded-xl p-2.5 text-stone-300 focus:outline-none focus:border-amber-500/50 font-mono"
                            >
                              <option value="Wallet">🪙 Wallet (የገንዘብ ቦርሳ)</option>
                              <option value="Marketplace">🛒 Marketplace (ገበያ ቦታ)</option>
                              <option value="Vendor">🏪 Vendor (የነጋዴዎች ማዕከል)</option>
                              <option value="Chat">💬 Chat (ምስጢራዊ መልዕክት)</option>
                              <option value="House">🏠 House (የሪል እስቴት)</option>
                              <option value="Jobs">💼 Jobs (የውጭ አገር ቅጥር)</option>
                              <option value="Other">❓ General Question (ሌላ ጠቅላላ ጥያቄ)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-stone-500 uppercase">Subject Title (ርዕስ)</label>
                            <input
                              type="text"
                              value={supportSubject}
                              onChange={(e) => setSupportSubject(e.target.value)}
                              placeholder="e.g. Wallet balance not updated after Chapa checkout"
                              className="w-full bg-black/60 border border-zinc-900 text-xs rounded-xl p-2.5 text-stone-300 focus:outline-none focus:border-amber-500/50 font-mono placeholder:text-stone-700"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-stone-500 uppercase">Describe Problem (ዝርዝር መግለጫ)</label>
                            <textarea
                              rows={3}
                              value={supportMsg}
                              onChange={(e) => setSupportMsg(e.target.value)}
                              placeholder="Describe your issue with error codes if possible..."
                              className="w-full bg-black/60 border border-zinc-900 text-xs rounded-xl p-2.5 text-stone-300 focus:outline-none focus:border-amber-500/50 font-mono placeholder:text-stone-700 resize-none"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!supportSubject || !supportMsg) {
                                setDemoToast({ show: true, msg: 'Please enter subject and message.', type: 'error' });
                                return;
                              }
                              const newId = `T-${104 + supportTickets.length}`;
                              const newTicket = {
                                id: newId,
                                subject: supportSubject,
                                category: supportCategory,
                                status: 'Pending',
                                createdAt: 'Just now',
                                sla: '23:59:59'
                              };
                              setSupportTickets([newTicket, ...supportTickets]);
                              setSupportSubject('');
                              setSupportMsg('');
                              setPmoOpenBugs(prev => prev + 1); // Connect ticket to SRE/PMO bugs dynamically!
                              triggerPushNotification('Support Ticket Received', `Ticket ${newId} logged under ${supportCategory}. Response SLA initiated.`, '📞', 'system');
                              setDemoToast({ show: true, msg: `🎉 Ticket ${newId} Submitted! SLA countdown started.`, type: 'success' });
                              handleAccessibilitySpeak('Support ticket submitted successfully. SLA activated.');
                            }}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-black text-[10px] uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>✉️ Submit Support Ticket & Launch SLA</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Side: Active Ticket Monitor & FAQ accordion list */}
                      <div className="lg:col-span-7 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-5">
                        
                        {/* Support Tickets Queue */}
                        <div className="space-y-3 text-left">
                          <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                            <div>
                              <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">📁 Active Tickets Monitor</h5>
                              <span className="text-[9px] text-stone-500 font-mono">Bi-directional user ticket tracking</span>
                            </div>
                            <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-extrabold uppercase font-extrabold">
                              Active SLA Priority
                            </span>
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-left">
                            {supportTickets.map((ticket, idx) => (
                              <div key={idx} className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 flex justify-between items-center text-left">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8.5px] font-mono bg-zinc-900 text-stone-400 px-1.5 py-0.2 rounded font-extrabold border border-zinc-800 font-extrabold">{ticket.id}</span>
                                    <span className="text-[8.5px] font-mono text-amber-500 font-extrabold bg-amber-500/5 px-1.5 rounded font-extrabold">{ticket.category}</span>
                                    <span className={`text-[8px] font-mono font-bold uppercase px-1.5 rounded font-extrabold ${
                                      ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' :
                                      ticket.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                                      'bg-red-500/10 text-red-400 animate-pulse'
                                    }`}>{ticket.status}</span>
                                  </div>
                                  <p className="text-[10px] text-stone-300 font-mono">{ticket.subject}</p>
                                  <p className="text-[8px] text-stone-500 font-mono">Created: {ticket.createdAt} | SLA Countdown: <span className="text-red-400 font-bold">{ticket.sla}</span></p>
                                </div>

                                {ticket.status !== 'Resolved' && (
                                  <button
                                    onClick={() => {
                                      setSupportTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'Resolved', sla: 'Resolved' } : t));
                                      setPmoOpenBugs(prev => Math.max(prev - 1, 0));
                                      triggerPushNotification('Ticket Resolved', `Ticket ${ticket.id} has been marked as completed. SLA terminated.`, '✓', 'system');
                                      setDemoToast({ show: true, msg: `Ticket ${ticket.id} resolved successfully!`, type: 'success' });
                                    }}
                                    className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[8.5px] font-mono font-bold rounded cursor-pointer transition-all"
                                  >
                                    Resolve
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive FAQ / Help Center Section */}
                        <div className="space-y-3 pt-2 border-t border-zinc-900 text-left">
                          <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">📚 Help Center & FAQ (የድጋፍ ማዕከል)</h5>
                          <div className="space-y-2">
                            {[
                              {
                                id: 'faq_chapa',
                                q: 'Chapa Escrow ክፍያ እንዴት ነው የሚሰራው?',
                                a: 'Chapa የክፍያ መዋቅር ነው። ገዢው ገንዘቡን ሲከፍል በEscrow መልክ ተይዞ ይቆያል። ሸቀጡ በትክክል ለገዢው መድረሱ በ Sheger Courier የQR ኮድ ተረጋግጦ ሲፈረም ብቻ ገንዘቡ ወደ ሻጩ Wallet ይተላለፋል።'
                              },
                              {
                                id: 'faq_vendor',
                                q: 'እንዴት ነው Vendor ሆኜ መመዝገብ የምችለው?',
                                a: 'በቀጥታ በVendor Center (የነጋዴዎች ማዕከል) በኩል የንግድ ፈቃድዎን እና የድርጅት ሰነድዎን በማስገባት KYC Verification ያገኛሉ። ፈቃድ ሲሰጥዎ ምርቶችን፣ ፎቶዎችን፣ እና ማስተዋወቂያዎችን መጫን ይችላሉ።'
                              },
                              {
                                id: 'faq_sla',
                                q: 'የድጋፍ ሰጪ ቡድኑ ምላሽ SLA ምንድነው?',
                                a: 'Any support ticket submitted to Every-zone Help Desk triggers a strict 24-hour SLA (Support በ24 ሰዓት ውስጥ ምላሽ እንዲሰጥ) . Engineers are notified dynamically via system logs.'
                              }
                            ].map((faq, idx) => {
                              const isOpen = activeFaqId === faq.id;
                              return (
                                <div key={idx} className="bg-black/30 rounded-xl border border-zinc-900 overflow-hidden text-left">
                                  <button
                                    type="button"
                                    onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                                    className="w-full p-3 text-left flex justify-between items-center focus:outline-none cursor-pointer"
                                  >
                                    <span className="text-[10px] font-extrabold text-stone-300">{faq.q}</span>
                                    <span className="text-[10px] font-mono text-amber-500">{isOpen ? '▲' : '▼'}</span>
                                  </button>
                                  {isOpen && (
                                    <div className="px-3 pb-3 pt-1 border-t border-zinc-900/40 text-[9.5px] text-stone-400 font-mono leading-relaxed bg-black/10 text-left">
                                      {faq.a}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 12. UNIFIED BRAND IDENTITY (የብራንድ መለያ መመሪያ) */}
                {sandboxTab === 'brand' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-left"
                  >
                    {/* Header Banner */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-purple-400 font-extrabold tracking-widest uppercase bg-purple-500/10 px-2.5 py-0.5 rounded font-extrabold">
                            🌍 UNIFIED BRAND IDENTITY & DESIGN SYSTEM
                          </span>
                          <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold bg-emerald-500/10 px-2 rounded uppercase font-extrabold">
                            Every-zone Consistency Tokenizer
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-stone-100 uppercase tracking-tight font-extrabold">Every-zone Design System Consistency Suite</h4>
                        <p className="text-[11px] text-stone-500 font-mono">
                          Every-zone ሁሉም ቦታ ተመሳሳይ መሆን አለበት። Interactively configure Design Tokens and test UI components alignment across all modules.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Design Tokens Configuration Sandbox */}
                      <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="border-b border-zinc-900 pb-2 text-left">
                          <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">🎨 Config Brand Style Tokens</h5>
                          <span className="text-[9px] text-stone-500 font-mono">Toggle dynamic design parameters in real-time</span>
                        </div>

                        {/* Theme color select */}
                        <div className="space-y-1.5 text-left">
                          <span className="text-[9px] font-mono font-bold text-stone-500 uppercase block font-extrabold">Ecosystem Primary Color (ቀለም):</span>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { id: 'amber', label: 'Classic Amber', bg: 'bg-amber-500', border: 'border-amber-500' },
                              { id: 'emerald', label: 'Sheger Emerald', bg: 'bg-emerald-500', border: 'border-emerald-500' },
                              { id: 'gold', label: 'Abyssinia Gold', bg: 'bg-yellow-500', border: 'border-yellow-500' },
                              { id: 'purple', label: 'Royal Purple', bg: 'bg-purple-500', border: 'border-purple-500' }
                            ].map(c => (
                              <button
                                type="button"
                                key={c.id}
                                onClick={() => {
                                  setBrandColorTheme(c.id as any);
                                  handleAccessibilitySpeak(`Theme color set to ${c.label}`);
                                }}
                                className={`p-1.5 rounded-lg border text-center cursor-pointer transition-all ${
                                  brandColorTheme === c.id ? `border-stone-100 bg-white/5` : 'border-zinc-900 bg-black/40'
                                }`}
                              >
                                <div className={`w-3 h-3 rounded-full mx-auto ${c.bg} mb-1`} />
                                <span className="text-[8px] font-mono font-bold text-stone-400 block whitespace-nowrap overflow-hidden text-ellipsis font-extrabold">{c.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Button Roundness select */}
                        <div className="space-y-1.5 text-left pt-2 border-t border-zinc-900">
                          <span className="text-[9px] font-mono font-bold text-stone-500 uppercase block font-extrabold">Border Roundness (የአዝራሮች ቅርጽ):</span>
                          <div className="grid grid-cols-4 gap-2 text-[9px] font-mono">
                            {[
                              { id: 'rounded-none', label: 'Flat Square' },
                              { id: 'rounded-md', label: 'Standard Medium' },
                              { id: 'rounded-xl', label: 'SuperApp Curved' },
                              { id: 'rounded-full', label: 'Capsule Round' }
                            ].map(r => (
                              <button
                                type="button"
                                key={r.id}
                                onClick={() => setBrandButtonRoundness(r.id as any)}
                                className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                                  brandButtonRoundness === r.id ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-black/40 border-zinc-900 text-stone-400'
                                }`}
                              >
                                {r.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Font Family select */}
                        <div className="space-y-1.5 text-left pt-2 border-t border-zinc-900">
                          <span className="text-[9px] font-mono font-bold text-stone-500 uppercase block font-extrabold">Typography Font Family (ፊደል):</span>
                          <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
                            {[
                              { id: 'sans', label: 'Inter Sans (Clean)' },
                              { id: 'mono', label: 'JetBrains Mono (Tech)' },
                              { id: 'serif', label: 'Abyssinia Serif (Elite)' }
                            ].map(f => (
                              <button
                                type="button"
                                key={f.id}
                                onClick={() => setBrandTypography(f.id as any)}
                                className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                                  brandTypography === f.id ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' : 'bg-black/40 border-zinc-900 text-stone-400'
                                }`}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Design system manual alignment note */}
                        <div className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 text-[9px] font-mono text-stone-500 leading-normal text-left">
                          💡 **Consistency Rule:** All UI cards, layouts, icons, buttons, and headers are synchronized to a unified JSON config dictionary (`theme-tokens.json`). This ensures that whether in the Chat, Job hub, Real Estate platform, or Wallet, the brand presents a unified, clean Habesha identity.
                        </div>
                      </div>

                      {/* Right: Live Brand Preview Area */}
                      <div className="lg:col-span-7 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="border-b border-zinc-900 pb-2 text-left">
                            <h5 className="text-xs font-black text-stone-200 uppercase tracking-tight">👁️ Real-Time Ecosystem Component Consistency Preview</h5>
                            <span className="text-[9px] text-stone-500 font-mono">Dynamic components responding to selected style tokens</span>
                          </div>

                          {/* Dynamic components render container */}
                          <div className={`p-6 bg-black/80 rounded-2xl border border-zinc-900 space-y-5 text-left ${
                            brandTypography === 'sans' ? 'font-sans' : brandTypography === 'mono' ? 'font-mono' : 'font-serif'
                          }`}>
                            
                            {/* Component 1: Brand Logo Token */}
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                              <span className="text-[8.5px] font-mono text-stone-600 uppercase">1. Logo Brandmark</span>
                              <div className="flex items-center gap-1.5 font-black tracking-tighter text-sm uppercase font-extrabold">
                                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] text-stone-950 font-black font-extrabold ${
                                  brandColorTheme === 'amber' ? 'bg-amber-500' :
                                  brandColorTheme === 'emerald' ? 'bg-emerald-500' :
                                  brandColorTheme === 'gold' ? 'bg-yellow-500' : 'bg-purple-500'
                                }`}>EZ</span>
                                <span className={
                                  brandColorTheme === 'amber' ? 'text-amber-500 font-extrabold' :
                                  brandColorTheme === 'emerald' ? 'text-emerald-500 font-extrabold' :
                                  brandColorTheme === 'gold' ? 'text-yellow-500 font-extrabold' : 'text-purple-400 font-extrabold'
                                }>Every-Zone</span>
                              </div>
                            </div>

                            {/* Component 2: Unified Button Style */}
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                              <span className="text-[8.5px] font-mono text-stone-600 uppercase">2. Action Button Style</span>
                              <button
                                type="button"
                                className={`px-4 py-2 text-stone-950 font-black uppercase text-[9.5px] tracking-wider font-bold transition-all ${brandButtonRoundness} ${
                                  brandColorTheme === 'amber' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10' :
                                  brandColorTheme === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10' :
                                  brandColorTheme === 'gold' ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/10' :
                                  'bg-purple-500 hover:bg-purple-600 shadow-purple-500/10'
                                } shadow-md cursor-pointer font-extrabold`}
                              >
                                Checkout Item
                              </button>
                            </div>

                            {/* Component 3: Styled Info Card */}
                            <div className="flex justify-between items-start border-b border-zinc-900 pb-3 text-left">
                              <span className="text-[8.5px] font-mono text-stone-600 uppercase">3. Display Card Style</span>
                              <div className={`p-3.5 bg-zinc-900/40 border rounded-xl max-w-[200px] text-left space-y-1.5 ${
                                brandColorTheme === 'amber' ? 'border-amber-500/20' :
                                brandColorTheme === 'emerald' ? 'border-emerald-500/20' :
                                brandColorTheme === 'gold' ? 'border-yellow-500/20' :
                                'border-purple-500/20'
                              }`}>
                                <div className="flex items-center gap-1 text-left">
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    brandColorTheme === 'amber' ? 'bg-amber-500' :
                                    brandColorTheme === 'emerald' ? 'bg-emerald-500' :
                                    brandColorTheme === 'gold' ? 'bg-yellow-500' : 'bg-purple-500'
                                  }`} />
                                  <span className="text-[8px] font-mono text-stone-500 uppercase font-extrabold">Escrow Release</span>
                                </div>
                                <p className="text-[10px] text-stone-300 font-bold leading-tight font-extrabold">CBE Wallet Account Verified</p>
                              </div>
                            </div>

                            {/* Component 4: Supported Icons & Typo alignment */}
                            <div className="flex justify-between items-center">
                              <span className="text-[8.5px] font-mono text-stone-600 uppercase font-extrabold">4. Supported Iconography</span>
                              <div className="flex items-center gap-3">
                                <Shield size={16} className={
                                  brandColorTheme === 'amber' ? 'text-amber-500' :
                                  brandColorTheme === 'emerald' ? 'text-emerald-500' :
                                  brandColorTheme === 'gold' ? 'text-yellow-500' : 'text-purple-400'
                                } />
                                <HelpCircle size={16} className={
                                  brandColorTheme === 'amber' ? 'text-amber-500' :
                                  brandColorTheme === 'emerald' ? 'text-emerald-500' :
                                  brandColorTheme === 'gold' ? 'text-yellow-500' : 'text-purple-400'
                                } />
                                <MessageSquare size={16} className={
                                  brandColorTheme === 'amber' ? 'text-amber-500' :
                                  brandColorTheme === 'emerald' ? 'text-emerald-500' :
                                  brandColorTheme === 'gold' ? 'text-yellow-500' : 'text-purple-400'
                                } />
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Trigger Consistency confirmation */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              triggerPushNotification('Design Tokens Synced', 'Successfully configured and pushed style properties across all 12 modules.', '🎨', 'system');
                              setDemoToast({ show: true, msg: '🌍 Style Tokens synced globally across the Every-zone client!', type: 'success' });
                              handleAccessibilitySpeak('Ecosystem style tokens updated across all client containers.');
                            }}
                            className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border font-extrabold ${
                              brandColorTheme === 'amber' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                              brandColorTheme === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                              brandColorTheme === 'gold' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                              'bg-purple-500/10 border-purple-500/30 text-purple-400'
                            }`}
                          >
                            🌍 Sync Style Consistency Across SuperApp
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

              </div>

            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* PANEL 6: SYSTEM ROADMAP, INCOME & ENTERPRISE ARCHITECTURE */}
        {/* ======================================================== */}
        {activeSubTab === 'roadmap' && (
          <motion.div
            key="roadmap-panel"
            initial={{ opacity: 0, y: accessReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Row 1: Product Roadmap Versions */}
            <div className={`p-6 rounded-3xl border text-left ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900 pb-3 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                    <Layers size={14} className="text-amber-500" />
                    <span>Every-zone Product Release Roadmap (v1.0 - v3.0)</span>
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Track the evolutionary phases from the stable launch MVP towards a decentralized global AI ecosystem.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 bg-zinc-950 p-1 rounded-xl">
                  {[
                    { id: 'v10', label: '🥇 Version 1.0', desc: 'Launch MVP' },
                    { id: 'v15', label: '🥈 Version 1.5', desc: 'Growth Booster' },
                    { id: 'v20', label: '🥉 Version 2.0', desc: 'Social Commerce' },
                    { id: 'v25', label: '🏅 Version 2.5', desc: 'AI Everywhere' },
                    { id: 'v30', label: '🎖️ Version 3.0', desc: 'Global Platform' }
                  ].map(ver => (
                    <button
                      key={ver.id}
                      onClick={() => {
                        setActiveRoadmapVer(ver.id as any);
                        triggerPushNotification('Roadmap Node Audited', `Explored ${ver.label} release specifications.`, '🚀', 'admin');
                        handleAccessibilitySpeak(`Loaded ${ver.label} details.`);
                      }}
                      className={`text-[9.5px] font-black uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeRoadmapVer === ver.id ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {ver.id.replace('v', 'V')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Version content visualizers */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left col: Description and details */}
                <div className="lg:col-span-4 space-y-4">
                  {activeRoadmapVer === 'v10' && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-black text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded uppercase">
                        Current Release Node
                      </span>
                      <h4 className="text-base font-extrabold text-stone-200">Version 1.0 (Launch MVP)</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Establishing the foundational high-fidelity transaction channels across Ethiopia. Prioritizes security, verified national biometric identities, and safe escrow payments.
                      </p>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-xs">
                        <span className="text-emerald-400 font-bold block mb-1">🎯 Operational Goal</span>
                        <span className="text-stone-300">Deploy stable and tested multi-role core modules with immediate Chapa payment settlements.</span>
                      </div>
                    </div>
                  )}

                  {activeRoadmapVer === 'v15' && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded uppercase">
                        Phase 2: 3-6 Months
                      </span>
                      <h4 className="text-base font-extrabold text-stone-200">Version 1.5 (Business Growth)</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Unlocks advanced vendor scaling mechanisms, promotional campaigns, and community viral loops to increase transaction velocity and merchant retention.
                      </p>
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-3 text-xs">
                        <span className="text-indigo-400 font-bold block mb-1">🎯 Revenue Goal</span>
                        <span className="text-stone-300">Boost marketplace commission velocity and establish recurring premium seller subscriptions.</span>
                      </div>
                    </div>
                  )}

                  {activeRoadmapVer === 'v20' && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-black text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded uppercase">
                        Phase 3: Social Hub
                      </span>
                      <h4 className="text-base font-extrabold text-stone-200">Version 2.0 (Social Commerce)</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Merges media entertainment with immediate purchasing. Implements video-first loops, real-time feedback feeds, and community creator portfolios.
                      </p>
                      <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-3 text-xs">
                        <span className="text-pink-400 font-bold block mb-1">🎯 Engagement Goal</span>
                        <span className="text-stone-300">Increase daily active screen duration from 4 minutes to 22 minutes through creator loops.</span>
                      </div>
                    </div>
                  )}

                  {activeRoadmapVer === 'v25' && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded uppercase">
                        Phase 4: AI Core
                      </span>
                      <h4 className="text-base font-extrabold text-stone-200">Version 2.5 (AI Everywhere)</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Weaves Google Gemini API context agents into every module. Autonomously analyzes risk, predicts pricing, translates languages, and recommends listings.
                      </p>
                      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-3 text-xs">
                        <span className="text-cyan-400 font-bold block mb-1">🎯 Intelligence Goal</span>
                        <span className="text-stone-300">Reduce manual customer support overhead by 80% and block fraudulent ledger events automatically.</span>
                      </div>
                    </div>
                  )}

                  {activeRoadmapVer === 'v30' && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-black text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded uppercase">
                        Phase 5: Global Expansion
                      </span>
                      <h4 className="text-base font-extrabold text-stone-200">Version 3.0 (Global Platform)</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Scales Every-zone outwards from Ethiopia into neighboring East African countries and Middle Eastern hubs. Unlocks international payments and cross-border agencies.
                      </p>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3 text-xs">
                        <span className="text-purple-400 font-bold block mb-1">🎯 Global Goal</span>
                        <span className="text-stone-300">Enable diaspora users to purchase products, secure houses, and hire local agencies using USD.</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-900 font-mono text-[9.5px]">
                    <div className="flex justify-between items-center text-stone-500 mb-1">
                      <span>Ecosystem Node Status</span>
                      <span className="text-emerald-400">ONLINE</span>
                    </div>
                    <p className="text-stone-400">All release modules are pre-architected as decoupled plugins, ensuring 0% breaking-change risk during live transitions.</p>
                  </div>
                </div>

                {/* Right col: Modules grid with verification simulation */}
                <div className="lg:col-span-8">
                  <span className="text-[9px] font-mono text-stone-500 uppercase block mb-2.5">
                    Module Integration Status for Active Version
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeRoadmapVer === 'v10' && [
                      { title: '🛒 Marketplace Engine', status: 'Active MVP', desc: 'Secure retail checkout with Chapa integration.', percent: 100 },
                      { title: '🏪 Vendor Store CRM', status: 'Active MVP', desc: 'Custom micro-stores with review and stock logs.', percent: 100 },
                      { title: '🪙 Decentralized Wallet', status: 'Active MVP', desc: 'Escrow ledgers, balance statements, and deposits.', percent: 100 },
                      { title: '💼 Overseas Employment', status: 'Active MVP', desc: 'Verified agency job listings & passport verification.', percent: 100 },
                      { title: '🏠 Real Estate Directory', status: 'Active MVP', desc: 'Verified property booking with map integration.', percent: 100 },
                      { title: '❤️ Matchmaking Engine', status: 'Active MVP', desc: 'Value-based matchmaking with verified trust ratings.', percent: 100 },
                      { title: '💬 Real-Time Chat Nodes', status: 'Active MVP', desc: 'Encrypted communication lines between clients.', percent: 100 },
                      { title: '🔔 Push Notifications', status: 'Active MVP', desc: 'Sub-system microservice notifications.', percent: 100 },
                      { title: '🔳 QR Code Center', status: 'Active MVP', desc: 'Dynamic secure payloads for instant handshakes.', percent: 100 },
                      { title: '🔍 Intelligent Search', status: 'Active MVP', desc: 'Fast fuzzy search across stores, products & drivers.', percent: 100 },
                      { title: '⚙️ Enterprise Admin Panel', status: 'Active MVP', desc: 'SRE monitoring, disaster recovery & logs.', percent: 100 }
                    ].map((mod, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl relative overflow-hidden group hover:border-zinc-800 transition">
                        <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 w-full" />
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-[11.5px] text-stone-200">{mod.title}</h5>
                            <p className="text-[10px] text-stone-500 mt-0.5 leading-normal">{mod.desc}</p>
                          </div>
                          <span className="text-[8.5px] font-mono font-black text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                            {mod.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeRoadmapVer === 'v15' && [
                      { title: '🔥 Vendor Store Promotions', status: 'Standby / Ready', desc: 'Automated discount campaign scheduling tools.' },
                      { title: '⭐ Sponsored Products', status: 'Standby / Ready', desc: 'Pay-per-click ranking boost node for merchants.' },
                      { title: '👥 Referral Loop Engine', status: 'Standby / Ready', desc: 'Fayda ID verified viral recruitment cash rewards.' },
                      { title: '💎 Loyalty Points Ledger', status: 'Standby / Ready', desc: 'User XP mapped directly into lower checkout commissions.' },
                      { title: '🎟️ Smart Promo Coupons', status: 'Standby / Ready', desc: 'Dynamic merchant discount generator tools.' },
                      { title: '🎁 Digital Gift Cards', status: 'Standby / Ready', desc: 'Tokenized credit transfer vouchers.' },
                      { title: '👑 Premium VIP Vendors', status: 'Standby / Ready', desc: 'Enhanced storage nodes and verified badges.' }
                    ].map((mod, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl relative overflow-hidden group hover:border-zinc-850 transition">
                        <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 w-1/3 group-hover:w-full transition-all duration-300" />
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-[11.5px] text-stone-200">{mod.title}</h5>
                            <p className="text-[10px] text-stone-500 mt-0.5 leading-normal">{mod.desc}</p>
                          </div>
                          <span className="text-[8.5px] font-mono font-black text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded">
                            {mod.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeRoadmapVer === 'v20' && [
                      { title: '🎥 Vertical Short Videos', status: 'Standby / Ready', desc: 'High-speed media content server with direct buy hooks.' },
                      { title: '📢 Interactive Store Feed', status: 'Standby / Ready', desc: 'Real-time updates, announcements & coupon drop timelines.' },
                      { title: '🔴 Live Selling Broadcasts', status: 'Standby / Ready', desc: 'RTMP stream routing with escrow flash bids.' },
                      { title: '👥 Creator Accounts', status: 'Standby / Ready', desc: 'Verify influencers via national Fayda ID nodes.' },
                      { title: '💬 Video Comment Threads', status: 'Standby / Ready', desc: 'Fuzzy content filtering and moderations.' },
                      { title: '➕ Following Network', status: 'Standby / Ready', desc: 'Subscription notifications linked to store events.' }
                    ].map((mod, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl relative overflow-hidden group hover:border-zinc-850 transition">
                        <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500 w-1/3 group-hover:w-full transition-all duration-300" />
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-[11.5px] text-stone-200">{mod.title}</h5>
                            <p className="text-[10px] text-stone-500 mt-0.5 leading-normal">{mod.desc}</p>
                          </div>
                          <span className="text-[8.5px] font-mono font-black text-pink-400 bg-pink-500/15 px-2 py-0.5 rounded">
                            {mod.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeRoadmapVer === 'v25' && [
                      { title: '🧠 AI Shopping Assistant', status: 'Standby / Ready', desc: 'Gemini conversational storefront searching and smart cart sizing.' },
                      { title: '🧠 AI Smart Job Matcher', status: 'Standby / Ready', desc: 'Matches passport skills with global courier requirements.' },
                      { title: '🧠 AI Real Estate Valuator', status: 'Standby / Ready', desc: 'Estimates regional properties values based on telemetry.' },
                      { title: '🧠 AI Wallet Advisory Agent', status: 'Standby / Ready', desc: 'Smart escrow logs and budget health advice.' },
                      { title: '🧠 AI Automated Support Node', status: 'Standby / Ready', desc: 'Closes common escrow disputes in under 9 seconds.' },
                      { title: '🧠 AI Personalized Recommendations', status: 'Standby / Ready', desc: 'Computes deep semantic storefront interest vectors.' },
                      { title: '🧠 AI Fraud Detection SRE', status: 'Standby / Ready', desc: 'Blocks high-velocity ledger transactions.' },
                      { title: '🧠 AI Real-Time Translation', status: 'Standby / Ready', desc: 'Instant Amharic-to-Arabic description translator.' }
                    ].map((mod, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl relative overflow-hidden group hover:border-zinc-850 transition">
                        <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 w-1/3 group-hover:w-full transition-all duration-300" />
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-[11.5px] text-stone-200">{mod.title}</h5>
                            <p className="text-[10px] text-stone-500 mt-0.5 leading-normal">{mod.desc}</p>
                          </div>
                          <span className="text-[8.5px] font-mono font-black text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded">
                            {mod.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeRoadmapVer === 'v30' && [
                      { title: '🌍 Multi-Country Support', status: 'Standby / Ready', desc: 'Localized database sharding for Ethiopia, UAE, Saudi Arabia, and Kenya.' },
                      { title: '💱 Multi-Currency Node', status: 'Standby / Ready', desc: 'Real-time exchange settlements (ETB, AED, USD, SAR).' },
                      { title: '🗣️ Multi-Language Localization', status: 'Standby / Ready', desc: 'Deep support for Amharic, Oromiffa, English, Arabic & Swahili.' },
                      { title: '💳 International Escrow Payments', status: 'Standby / Ready', desc: 'Connects diaspora Visa/Mastercard nodes securely with local escrow.' },
                      { title: '🏪 Regional Verified Vendors', status: 'Standby / Ready', desc: 'Allow international importers to source specialty goods direct.' },
                      { title: '🏢 Regional Recruiting Agencies', status: 'Standby / Ready', desc: 'Accredited cross-border employment node partnerships.' }
                    ].map((mod, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl relative overflow-hidden group hover:border-zinc-850 transition">
                        <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 w-1/3 group-hover:w-full transition-all duration-300" />
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-[11.5px] text-stone-200">{mod.title}</h5>
                            <p className="text-[10px] text-stone-500 mt-0.5 leading-normal">{mod.desc}</p>
                          </div>
                          <span className="text-[8.5px] font-mono font-black text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded">
                            {mod.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Row 2: 10 Interactive Revenue Streams Calculator */}
            <div className={`p-6 rounded-3xl border text-left ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900 pb-3 mb-5">
                <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-400" />
                  <span>Every-zone Cohesive Revenue Engine (10 Connected Streams)</span>
                </h3>
                <p className="text-[10px] text-stone-500">
                  Slide parameters to calculate simulated transaction volume and estimate platform financial yields in multi-currency metrics.
                </p>
              </div>

              {/* Sliders layout */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slider 1: Average Order value */}
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-900 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-stone-400">
                      <span>Avg Cart Value (ETB)</span>
                      <strong className="text-amber-500">{revCartValue.toLocaleString()} ETB</strong>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="3000"
                      step="50"
                      value={revCartValue}
                      onChange={(e) => setRevCartValue(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-zinc-900 rounded-lg cursor-pointer h-1.5"
                    />
                    <span className="text-[8px] text-stone-500 font-mono block">From handloom crafts to premium lofts escrow holds</span>
                  </div>

                  {/* Slider 2: Monthly Orders */}
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-900 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-stone-400">
                      <span>Monthly Orders Volume</span>
                      <strong className="text-amber-500">{revMonthlyOrders.toLocaleString()} orders</strong>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={revMonthlyOrders}
                      onChange={(e) => setRevMonthlyOrders(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-zinc-900 rounded-lg cursor-pointer h-1.5"
                    />
                    <span className="text-[8px] text-stone-500 font-mono block">Total retail transactions matching regional nodes</span>
                  </div>

                  {/* Slider 3: Premium Vendors */}
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-900 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-stone-400">
                      <span>Premium Subscribed Vendors</span>
                      <strong className="text-indigo-400">{revPremiumVendors.toLocaleString()} Stores</strong>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="1000"
                      step="10"
                      value={revPremiumVendors}
                      onChange={(e) => setRevPremiumVendors(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-zinc-900 rounded-lg cursor-pointer h-1.5"
                    />
                    <span className="text-[8px] text-stone-500 font-mono block">Stores subscribing to custom CRM logs & VIP badges</span>
                  </div>

                  {/* Slider 4: Active Agencies */}
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-900 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-stone-400">
                      <span>Active Agencies Partners</span>
                      <strong className="text-pink-400">{revActiveAgencies.toLocaleString()} Agencies</strong>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="5"
                      value={revActiveAgencies}
                      onChange={(e) => setRevActiveAgencies(Number(e.target.value))}
                      className="w-full accent-pink-500 bg-zinc-900 rounded-lg cursor-pointer h-1.5"
                    />
                    <span className="text-[8px] text-stone-500 font-mono block">Recruiting nodes utilizing secure Fayda passport matching</span>
                  </div>
                </div>

                {/* Right col: Projected Total results box */}
                <div className="md:col-span-2 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-emerald-400 font-black uppercase bg-emerald-400/5 px-2 py-0.5 rounded tracking-widest">
                      TOTAL ECOSYSTEM REVENUE ESTIMATE
                    </span>
                    
                    {/* Calculate total */}
                    {(() => {
                      const stream1 = revCartValue * revMonthlyOrders * 0.025; // marketplace commission
                      const stream2 = revPremiumVendors * 400; // vendor subscription
                      const stream3 = revActiveAgencies * 1500; // agency sub
                      const stream4 = 42000; // featured listings
                      const stream5 = revAdClickEstimate * 1.25; // sponsored products
                      const stream6 = 85000; // ads platform
                      const stream7 = revCartValue * revMonthlyOrders * 0.005; // wallet cashout fee
                      const stream8 = 51000; // premium members
                      const stream9 = 25000; // verification
                      const stream10 = 18000; // API fee

                      const totalETB = stream1 + stream2 + stream3 + stream4 + stream5 + stream6 + stream7 + stream8 + stream9 + stream10;
                      const exchangeRate = 120; // 120 ETB per USD
                      const totalUSD = totalETB / exchangeRate;

                      return (
                        <div className="pt-2">
                          <h4 className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
                            {totalETB.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs">ETB / mo</span>
                          </h4>
                          <p className="text-xs text-stone-400 font-mono font-bold">
                            ≈ ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD / mo <span className="text-[9px] text-stone-600">(1 USD = 120 ETB)</span>
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="text-[9px] font-mono text-stone-500 border-t border-zinc-900 pt-2.5 leading-normal">
                    💡 <strong>Commission Model Setup:</strong> Low processing fees of 0.5% on wallet settlement combined with 2.5% marketplace commission provides massive competitive edges against traditional payment hubs.
                  </div>
                </div>
              </div>

              {/* Grid of the 10 streams */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {[
                  {
                    name: '1. Marketplace Commission',
                    formula: '2.5% per product order',
                    desc: 'Primary retail commission node',
                    yield: revCartValue * revMonthlyOrders * 0.025,
                    color: 'text-amber-500'
                  },
                  {
                    name: '2. Vendor Subscription',
                    formula: '400 ETB / premium store / mo',
                    desc: 'Stores subscribing to CRM & stats',
                    yield: revPremiumVendors * 400,
                    color: 'text-indigo-400'
                  },
                  {
                    name: '3. Agency Subscription',
                    formula: '1,500 ETB / partner agency / mo',
                    desc: 'Accredited job recruiters node fee',
                    yield: revActiveAgencies * 1500,
                    color: 'text-pink-400'
                  },
                  {
                    name: '4. Featured Listings',
                    formula: 'Fixed rates for prioritizations',
                    desc: 'Premium rent condo or job posts',
                    yield: 42000,
                    color: 'text-teal-400'
                  },
                  {
                    name: '5. Sponsored Products',
                    formula: '1.25 ETB click bidding node',
                    desc: 'In-app keyword booster bids',
                    yield: revAdClickEstimate * 1.25,
                    color: 'text-emerald-400'
                  },
                  {
                    name: '6. Ads Platform Slots',
                    formula: 'Flat monthly campaign packages',
                    desc: 'External partner banners & slides',
                    yield: 85000,
                    color: 'text-yellow-400'
                  },
                  {
                    name: '7. Wallet Cashout Fees',
                    formula: '0.5% per ledger settlement',
                    desc: 'Chapa to local bank transfer yield',
                    yield: revCartValue * revMonthlyOrders * 0.005,
                    color: 'text-cyan-400'
                  },
                  {
                    name: '8. Premium Memberships',
                    formula: 'VIP benefits package tier',
                    desc: 'Flat rate subscription for priority clients',
                    yield: 51000,
                    color: 'text-purple-400'
                  },
                  {
                    name: '9. Trust Verification',
                    formula: 'Flat biometric stamp fee',
                    desc: 'Recurring business audit certificate',
                    yield: 25000,
                    color: 'text-orange-400'
                  },
                  {
                    name: '10. API Integration Fees',
                    formula: 'Microservice handshake packages',
                    desc: 'Paid connections for external couriers',
                    yield: 18000,
                    color: 'text-rose-400'
                  }
                ].map((stream, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3 rounded-2xl flex flex-col justify-between text-left font-mono">
                    <div>
                      <span className="text-[10px] font-black text-stone-200 block truncate">{stream.name}</span>
                      <span className="text-[8px] text-stone-500 block mt-0.5">{stream.desc}</span>
                      <p className="text-[8.5px] text-stone-400 mt-1.5 leading-normal">{stream.formula}</p>
                    </div>

                    <div className="border-t border-zinc-900 mt-2.5 pt-2 flex justify-between items-center text-[10px]">
                      <span className="text-stone-500 font-bold">Yield:</span>
                      <span className={`font-black ${stream.color}`}>{stream.yield.toLocaleString(undefined, { maximumFractionDigits: 0 })} ETB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Enterprise Architecture Map Visualizer */}
            <div className={`p-6 rounded-3xl border text-left ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900 pb-3 mb-5">
                <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                  <Cpu size={14} className="text-amber-500" />
                  <span>Enterprise Decoupled microservices topology Map</span>
                </h3>
                <p className="text-[10px] text-stone-500">
                  Select any architectural tier to inspect technical schema bindings, REST routing nodes, and data synchronization pathways.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Topology Diagram (SVG node flow) */}
                <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-3xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-[8px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-400/5 px-2 py-0.5 rounded animate-pulse">
                    🟢 DECOUPLED ARCHITECTURE
                  </div>

                  <div className="w-full space-y-4 max-w-lg relative py-3">
                    
                    {/* Layer 1: Client Node */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setArchActiveNode('client')}
                        className={`px-4 py-2.5 rounded-xl border text-center font-mono text-xs font-black transition-all cursor-pointer ${
                          archActiveNode === 'client' ? 'bg-amber-500 text-stone-950 border-amber-500 scale-105 shadow-md shadow-amber-500/10' : 'bg-zinc-900 border-zinc-800 text-stone-300 hover:border-stone-500'
                        }`}
                      >
                        📱 Every-zone Client Mobile App (React Native/Web)
                      </button>
                    </div>

                    {/* Flow Line */}
                    <div className="flex justify-center h-4">
                      <div className="w-0.5 bg-gradient-to-b from-amber-500 to-indigo-500 h-full" />
                    </div>

                    {/* Layer 2: API Gateway */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setArchActiveNode('gateway')}
                        className={`px-4 py-2.5 rounded-xl border text-center font-mono text-xs font-black transition-all cursor-pointer ${
                          archActiveNode === 'gateway' ? 'bg-indigo-500 text-white border-indigo-400 scale-105 shadow-md shadow-indigo-500/10' : 'bg-zinc-900 border-zinc-800 text-stone-300 hover:border-stone-500'
                        }`}
                      >
                        🌐 Decoupled API Gateway Router (Node/Express Port 3000)
                      </button>
                    </div>

                    {/* Flow Line */}
                    <div className="flex justify-center h-4">
                      <div className="w-0.5 bg-gradient-to-b from-indigo-500 to-pink-500 h-full" />
                    </div>

                    {/* Layer 3: Auth Gateway */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setArchActiveNode('auth')}
                        className={`px-4 py-2 text-center font-mono text-[11px] font-black rounded-lg border transition-all cursor-pointer ${
                          archActiveNode === 'auth' ? 'bg-pink-500 text-white border-pink-400 scale-105' : 'bg-zinc-900 border-zinc-800 text-stone-300 hover:border-stone-500'
                        }`}
                      >
                        🔐 Authentication Engine (National Fayda ID Node + Chapa SSO)
                      </button>
                    </div>

                    {/* Flow Line */}
                    <div className="flex justify-center h-4">
                      <div className="w-0.5 bg-gradient-to-b from-pink-500 to-cyan-500 h-full" />
                    </div>

                    {/* Layer 4: Microservices Grid */}
                    <div className="bg-zinc-900/60 border border-zinc-850 p-3.5 rounded-2xl">
                      <span className="text-[8px] font-mono text-stone-500 uppercase block text-center mb-2">Decoupled Domain Service Nodes</span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 font-mono text-[9.5px]">
                        {[
                          { id: 'marketplace', label: '🛒 Marketplace' },
                          { id: 'vendor', label: '🏪 Vendor Stores' },
                          { id: 'wallet', label: '🪙 Wallet Escrow' },
                          { id: 'estate', label: '🏠 Real Estate' },
                          { id: 'jobs', label: '💼 Overseas Jobs' },
                          { id: 'matchmaking', label: '❤️ Matchmaking' },
                          { id: 'chat', label: '💬 Chat Nodes' },
                          { id: 'ai', label: '🧠 AI (Gemini)' },
                          { id: 'analytics', label: '📊 Analytics' },
                          { id: 'notifs', label: '🔔 Notifications' }
                        ].map(node => (
                          <button
                            key={node.id}
                            onClick={() => setArchActiveNode(node.id)}
                            className={`p-2 rounded-lg border text-center transition-all truncate cursor-pointer font-extrabold ${
                              archActiveNode === node.id ? 'bg-cyan-500 text-stone-950 border-cyan-400 scale-102' : 'bg-black border-zinc-850 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {node.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Flow Line */}
                    <div className="flex justify-center h-4">
                      <div className="w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500 h-full" />
                    </div>

                    {/* Layer 5: Shared Services */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setArchActiveNode('shared')}
                        className={`px-4 py-2 text-center font-mono text-[11px] font-black rounded-lg border transition-all cursor-pointer ${
                          archActiveNode === 'shared' ? 'bg-purple-500 text-white border-purple-400 scale-105' : 'bg-zinc-900 border-zinc-800 text-stone-300 hover:border-stone-500'
                        }`}
                      >
                        🧬 Unified Shared Services Layer (Caching, Logging, DNS)
                      </button>
                    </div>

                    {/* Flow Line */}
                    <div className="flex justify-center h-4">
                      <div className="w-0.5 bg-gradient-to-b from-purple-500 to-emerald-500 h-full" />
                    </div>

                    {/* Layer 6: Persistent Infrastructure DB */}
                    <div className="bg-zinc-900/60 border border-zinc-850 p-3.5 rounded-2xl">
                      <span className="text-[8px] font-mono text-stone-500 uppercase block text-center mb-2">Persistent Ledger & Database Layer</span>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 font-mono text-[9px]">
                        {[
                          { id: 'db', label: '🗄️ Database' },
                          { id: 'storage', label: '💾 File Storage' },
                          { id: 'cache', label: '⚡ Redis Cache' },
                          { id: 'monitoring_node', label: '🖥️ SRE Monitor' },
                          { id: 'logging', label: '📝 Audit Logs' },
                          { id: 'backups', label: '🛡️ Backup Nodes' }
                        ].map(infra => (
                          <button
                            key={infra.id}
                            onClick={() => setArchActiveNode(infra.id)}
                            className={`p-2 rounded-lg border text-center transition-all truncate cursor-pointer font-extrabold ${
                              archActiveNode === infra.id ? 'bg-emerald-500 text-stone-950 border-emerald-400 scale-102' : 'bg-black border-zinc-850 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {infra.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Technical Node Specifications Sheet Panel */}
                <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-3xl p-5 flex flex-col justify-between font-mono text-[11px]">
                  
                  {/* Switch content based on archActiveNode */}
                  <div className="space-y-4">
                    <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                      <span className="text-[8.5px] text-stone-500 uppercase font-black">Active Tier Specification</span>
                      <span className="text-[9px] text-amber-500 font-extrabold">EZ-INFRA-NODE</span>
                    </div>

                    {archActiveNode === 'client' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-amber-500 uppercase">📱 Client Mobile App</h4>
                        <p className="text-stone-400 leading-relaxed">
                          A unified, cross-platform client app written in React Native. Delivers frictionless user interface transitions, biometric sign-in keys, and fast offline state caching.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1">
                          <span className="text-[8px] text-stone-500 block uppercase">Client Port Binding</span>
                          <span className="text-stone-300 block">WebSocket / TCP Secure Endpoint</span>
                          <span className="text-stone-300 block">Biometric Node Hash: FYD_SIGN</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'gateway' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-indigo-400 uppercase">🌐 API Gateway Router</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Highly scalable entry point binding to Port 3000. Decouples client queries, manages rate-limiting rules, verifies Fayda biometric signatures, and proxies API handshakes.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1">
                          <span className="text-[8px] text-stone-500 block uppercase">Gateway Protocols</span>
                          <span className="text-stone-300 block">HTTP Proxy Server on Port 3000</span>
                          <span className="text-stone-300 block">Rate-limiting: 100 req/s/user</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'auth' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-pink-400 uppercase">🔐 Authentication Node</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Integrated directly with the national biometric database node. Generates cryptographically signed authorization payloads for lower-trust entities.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1">
                          <span className="text-[8px] text-stone-500 block uppercase">Biometrics Protocol</span>
                          <span className="text-stone-300 block">Decentralized Cryptography JWT</span>
                          <span className="text-stone-300 block">Key Exchange: AES-256 TLS Tunnel</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'marketplace' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">🛒 Marketplace Service</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Manages product catalogs, escrow transaction queues, and dynamic courier dispatch webhooks. Completely isolated from the Wallet service.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1 text-[10px]">
                          <span className="text-[8px] text-stone-500 block uppercase">Marketplace DB Schemas</span>
                          <span className="text-stone-300 block">• table_marketplace_items</span>
                          <span className="text-stone-300 block">• table_escrow_orders</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'vendor' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">🏪 Vendor Stores Service</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Saves store specifications, verified certificates, review logs, and automated inventory threshold alert configurations.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1 text-[10px]">
                          <span className="text-[8px] text-stone-500 block uppercase">Vendor Store DB Schemas</span>
                          <span className="text-stone-300 block">• table_vendors_profiles</span>
                          <span className="text-stone-300 block">• table_vendors_review_logs</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'wallet' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">🪙 Wallet Escrow Service</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Tracks transactional balances, locks client funds, verifies Chapa settlement triggers, and initiates point-in-time double-entry ledgers.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1 text-[10px]">
                          <span className="text-[8px] text-stone-500 block uppercase">Wallet Escrow DB Schemas</span>
                          <span className="text-stone-300 block">• table_user_balances_ledger</span>
                          <span className="text-stone-300 block">• table_escrow_holding_vault</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'estate' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">🏠 Real Estate Directory</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Handles property listings, booking records, host credentials, and map coordinates sync with our Google Maps platform API wrappers.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1 text-[10px]">
                          <span className="text-[8px] text-stone-500 block uppercase">Real Estate DB Schemas</span>
                          <span className="text-stone-300 block">• table_estate_units</span>
                          <span className="text-stone-300 block">• table_properties_bookings</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'jobs' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">💼 Overseas Jobs Service</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Tracks accredited recruiter agencies, passport verification logs, driver contracts, and UAE/Saudi work visa quota numbers.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1 text-[10px]">
                          <span className="text-[8px] text-stone-500 block uppercase">Jobs DB Schemas</span>
                          <span className="text-stone-300 block">• table_recruiting_agencies_profiles</span>
                          <span className="text-stone-300 block">• table_job_postings_vacancies</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'matchmaking' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">❤️ Matchmaking Service</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Processes user value matrices, compatibility scores, active matching queues, and schedules verified dates at accredited cultural cafes.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1 text-[10px]">
                          <span className="text-[8px] text-stone-500 block uppercase">Matchmaking DB Schemas</span>
                          <span className="text-stone-300 block">• table_matchmaking_matrices</span>
                          <span className="text-stone-300 block">• table_scheduled_rendezvous</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'chat' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">💬 Real-Time Chat Service</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Direct TCP secure socket messaging daemon ensuring end-to-end encryption. Archives transaction message threads into storage nodes.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1 text-[10px]">
                          <span className="text-[8px] text-stone-500 block uppercase">Chat DB Schemas</span>
                          <span className="text-stone-300 block">• table_direct_messages_threads</span>
                          <span className="text-stone-300 block">• table_socket_connections_status</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'ai' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">🧠 Gemini AI Module</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Integrates the server-side @google/genai SDK, providing text translations, image analysis, conversational search grounding, and smart escrow pricing suggestions.
                        </p>
                        <div className="p-2.5 bg-black border border-zinc-900 rounded-xl space-y-1 text-[10px]">
                          <span className="text-[8px] text-stone-500 block uppercase">AI Model Configurations</span>
                          <span className="text-stone-300 block">Model alias: gemini-2.5-flash-enterprise</span>
                          <span className="text-stone-300 block">Latency: ≈ 340ms per query</span>
                        </div>
                      </div>
                    )}

                    {archActiveNode === 'analytics' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">📊 Analytics Service</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Compiles telemetry, aggregates storefront visits, traces revenue yields, and compiles smart multilingual financial auditing reports.
                        </p>
                      </div>
                    )}

                    {archActiveNode === 'notifs' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-cyan-400 uppercase">🔔 Notifications Service</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Universal dispatch queue. Manages push notifications, email nodes, and SMS gateways connected to Chapa and Fayda events.
                        </p>
                      </div>
                    )}

                    {archActiveNode === 'shared' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-purple-400 uppercase">🧬 Shared Services Layer</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Ecosystem utility rail. Manages global routing protocols, cross-origin cookies configurations, TLS handshakes, and distributed clock synchronizations.
                        </p>
                      </div>
                    )}

                    {archActiveNode === 'db' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase">🗄️ Primary Database</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Secure Cloud Firestore with custom generated security rules, providing near-instant querying speeds and point-in-time transaction restoration capabilities.
                        </p>
                      </div>
                    )}

                    {archActiveNode === 'storage' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase">💾 Cloud File Storage</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Stores high-definition handloom photography assets, PDF audit files, and corporate accreditation documents securely.
                        </p>
                      </div>
                    )}

                    {archActiveNode === 'cache' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase">⚡ Memory Redis Cache</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Sub-millisecond data sharding. Caches trending products, active chat socket statuses, and active session auth nodes.
                        </p>
                      </div>
                    )}

                    {archActiveNode === 'monitoring_node' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase">🖥️ SRE Monitoring Node</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Continuous health telemetry. Feeds real-time CPU, database load, and API handshake performance analytics into the admin console.
                        </p>
                      </div>
                    )}

                    {archActiveNode === 'logging' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase">📝 Cryptographic Audit Trail</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Immutable hash logs tracking admin alterations, balance settlements, and security-relevant events using strict SHA-256 protocols.
                        </p>
                      </div>
                    )}

                    {archActiveNode === 'backups' && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase">🛡️ Disaster Recovery Backups</h4>
                        <p className="text-stone-400 leading-relaxed">
                          Automated split-brain recovery. Guarantees 0 byte transaction loss by keeping active standby backups synchronizations running.
                        </p>
                      </div>
                    )}

                  </div>

                  <div className="pt-3 border-t border-zinc-900 mt-4 text-[9.5px] text-stone-500 leading-normal">
                    💡 Click on any topology node in the flowchart on the left to see its decoupled specification.
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ======================================================== */}
        {/* PANEL 7: EVERY-ZONE ECOSYSTEM MASTER CONTROL HUB          */}
        {/* ======================================================== */}
        {activeSubTab === 'ecosystem' && (
          <motion.div
            key="ecosystem-panel"
            initial={{ opacity: 0, y: accessReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-left"
          >
            {/* Title Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-teal-500/10 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-stone-600">
                EZ-ID: EZ-1002458 • SECURE CHANNEL
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-wider text-stone-100">
                    {lang === 'en' ? 'Every-zone Complete Ecosystem Hub' : 'የEvery-zone ሙሉ የኤኮሲስተም ማዕከል'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {lang === 'en' 
                      ? 'Experience the fully integrated, decentralized Super-App framework covering transactional, business, AI, SRE intelligence, and cloud services.'
                      : 'የንግድ፣ የኪስ ቦርሳ፣ የኤአይ ረዳት እና የደመና አገልግሎቶችን በአንድ ላይ የሚያገናኝ የተሟላ የሱፐር አፕ መድረክ።'}
                  </p>
                </div>
              </div>
            </div>

            {/* Row 1: Section 1 (Ecosystem Tree) & Section 5 (Cloud Services) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive Ecosystem Tree */}
              <div className={`lg:col-span-7 p-6 rounded-3xl border ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div className="border-b border-zinc-900/60 pb-3 mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                    <Layers size={13} />
                    <span>Every-zone Decentralized Ecosystem Tree</span>
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Click on any node in the directory tree below to inspect its operational microservice logs and port allocations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Visual tree directories list */}
                  <div className="md:col-span-6 bg-zinc-950 p-4 rounded-2xl border border-zinc-900 font-mono text-xs text-stone-300 space-y-2">
                    <span className="text-[10px] font-black text-amber-500 uppercase">🌳 Root: Every-zone App</span>
                    
                    <div className="space-y-1.5 pl-3 border-l border-zinc-850">
                      {[
                        { id: 'marketplace', label: '├── 🛒 Marketplace', role: 'Retail Escrow System' },
                        { id: 'vendor_center', label: '├── 🏪 Vendor Center', role: 'Merchant CRM Portal' },
                        { id: 'wallet', label: '├── 🪙 Wallet Escrow', role: 'Chapa Ledger Integrations' },
                        { id: 'real_estate', label: '├── 🏠 Real Estate', role: 'Property Rent & Buy Node' },
                        { id: 'overseas_jobs', label: '├── 💼 Overseas Employment', role: 'Passport Biometric Queue' },
                        { id: 'matchmaking', label: '├── 💖 Matchmaking', role: 'Trust-based Matching Engine' },
                        { id: 'ai_assistant', label: '├── 🤖 AI Assistant Platform', role: 'Google Gemini 1.5 Agents' },
                        { id: 'chat', label: '├── 💬 Encrypted Chat', role: 'Real-time Socket.io lines' },
                        { id: 'biz_platform', label: '├── 🏢 Business Platform', role: 'Verified Profiles Registry' },
                        { id: 'ad_platform', label: '├── 📢 Ad Campaign Platform', role: 'Keyword Ad Bid Platform' },
                        { id: 'api_platform', label: '├── 🔌 API Integrations', role: 'Third-party Courier Bridges' },
                        { id: 'admin_cloud', label: '└── ☁️ Admin SRE Cloud', role: 'Kubernetes Container Gateway' }
                      ].map(node => (
                        <button
                          key={node.id}
                          onClick={() => {
                            setActiveEcosystemNode(node.id);
                            triggerPushNotification('Ecosystem Audit Triggered', `Inspecting operational details of ${node.id}.`, '🎛️', 'system');
                            handleAccessibilitySpeak(`Loaded ecosystem node ${node.id}`);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                            activeEcosystemNode === node.id 
                              ? 'bg-amber-500 text-stone-950 font-black font-mono' 
                              : 'text-stone-400 hover:text-stone-200 hover:bg-zinc-900/60'
                          }`}
                        >
                          <span>{node.label}</span>
                          <span className={`text-[8.5px] font-bold ${activeEcosystemNode === node.id ? 'text-stone-900' : 'text-stone-600'}`}>
                            {activeEcosystemNode === node.id ? '• SELECTED' : ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Node specifications output panel */}
                  <div className="md:col-span-6 flex flex-col justify-between bg-zinc-950 border border-zinc-900 rounded-2xl p-4 font-mono text-[11px] text-stone-400">
                    <div className="space-y-3">
                      <div className="border-b border-zinc-900 pb-2">
                        <span className="text-[8px] text-amber-500 font-bold uppercase tracking-widest block">Node Status Report</span>
                        <h5 className="font-extrabold text-[12px] text-stone-200 uppercase mt-0.5">
                          {activeEcosystemNode.replace('_', ' ')}
                        </h5>
                      </div>

                      {activeEcosystemNode === 'marketplace' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Primary consumer transactional engine. Manages secure buyer orders, dynamic product category tags, and EV-courier dispatch handshakes.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Port Binding: <strong className="text-stone-300">Port 3000 API Node</strong></div>
                            <div>Storage Engine: <strong className="text-stone-300">Cloud Firestore Collection</strong></div>
                            <div>Verification: <strong className="text-amber-500">Fayda Biometric Enforced</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'vendor_center' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Merchant inventory panel. Allows shop owners to log products, schedule discounts, track client reviews, and manage business metrics.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Sync Pipeline: <strong className="text-stone-300">Real-time DB stream</strong></div>
                            <div>Access Scope: <strong className="text-stone-300">Verified Stores Only</strong></div>
                            <div>Verification: <strong className="text-emerald-400">Certified Business Stamp</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'wallet' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Decentralized Escrow Ledger. Seamlessly connects Chapa payment APIs with local bank transfers to hold transactional trust deposits securely.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Ledger Format: <strong className="text-stone-300">Cryptographically Chained</strong></div>
                            <div>Holding Fee: <strong className="text-stone-300">0.5% per Cashout</strong></div>
                            <div>Currency Range: <strong className="text-emerald-400">ETB, USD, SAR, AED</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'real_estate' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Property rent and purchase directory. Fully integrated with location telemetry maps and smart keycard locking APIs for short-stay reservations.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Map Engine: <strong className="text-stone-300">Google Maps Platform</strong></div>
                            <div>Escrow Hold: <strong className="text-stone-300">10,000 ETB Reservation Cap</strong></div>
                            <div>Verification: <strong className="text-stone-300">Property Deed Notarization</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'overseas_jobs' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Cross-border job matching framework. Links verified Middle Eastern cargo agencies with domestic Ethiopian candidates using biometric visa matching.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Passport Sync: <strong className="text-stone-300">Biometric National Database</strong></div>
                            <div>Visa Queue: <strong className="text-stone-300">Automated FIFO Pipeline</strong></div>
                            <div>Status Track: <strong className="text-indigo-400">Unified Timeline Sync</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'matchmaking' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Value-driven, verified relationship directory. Promotes high-integrity introductions based on biometric profiles and trust ratings.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Trust Model: <strong className="text-stone-300">Mutual Verification Handshake</strong></div>
                            <div>Profile Mode: <strong className="text-stone-300">Encrypted Chat Anonymization</strong></div>
                            <div>Badge Tier: <strong className="text-pink-400">Fayda Identity Verified</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'ai_assistant' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Google Gemini context automation network. Operates specialized sub-agents for translation, fraud detection, and customer support.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>SDK Pipeline: <strong className="text-stone-300">@google/genai Node SDK</strong></div>
                            <div>Intelligence: <strong className="text-cyan-400">Gemini 1.5 Flash Model</strong></div>
                            <div>Response Speed: <strong className="text-stone-300">Under 1.2 seconds</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'chat' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Highly secure instant message router. Coordinates real-time chat nodes between buyers, sellers, recruitment officers, and support desks.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Protocol: <strong className="text-stone-300">WebSocket / TCP Secure</strong></div>
                            <div>Encryption: <strong className="text-stone-300">End-to-End Cryptography</strong></div>
                            <div>Socket Count: <strong className="text-stone-300">Up to 50,000 active concurrent</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'biz_platform' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Enterprise profile repository. Allows clinics, schools, pharmacies, restaurants, and hotels to build public, audited landing pages.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Profile Status: <strong className="text-stone-300">Verified Business Badging</strong></div>
                            <div>Directory Keys: <strong className="text-stone-300">Linked to Every-zone ID (EZ)</strong></div>
                            <div>Moderation: <strong className="text-amber-500">AI Auto-audited</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'ad_platform' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Self-service keyword advertisement campaign manager. Lets verified businesses bid on platform search results keywords to boost listing ranks.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Auction Model: <strong className="text-stone-300">PPC Real-time Bidding (RTB)</strong></div>
                            <div>Payout Loop: <strong className="text-stone-300">Linked directly to Escrow Wallet</strong></div>
                            <div>Analytics: <strong className="text-emerald-400">Live CTR tracking logs</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'api_platform' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Third-party integrations gateway. Allows regional logistics couriers, delivery drivers, and retail ERP software to hook into the checkout cycle.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Standard: <strong className="text-stone-300">RESTful JSON Webhooks</strong></div>
                            <div>Auth Protocol: <strong className="text-stone-300">OAuth 2.0 / Bearer Tokens</strong></div>
                            <div>API Status: <strong className="text-stone-300">High Availability</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcosystemNode === 'admin_cloud' && (
                        <div className="space-y-2">
                          <p className="leading-relaxed">Kubernetes-orchestrated server infrastructure. Monitors platform logs, processes database shard backups, and triggers automated disaster recovery protocols.</p>
                          <div className="space-y-1 text-[10px] text-stone-500">
                            <div>Orchestrator: <strong className="text-stone-300">Kubernetes (GKE Cluster)</strong></div>
                            <div>Cloud Ingress: <strong className="text-stone-300">Port 3000 Ingress Controller</strong></div>
                            <div>Status Rating: <strong className="text-emerald-400">99.99% Availability SRE</strong></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-zinc-900 pt-3 mt-4 text-[10px] text-stone-500">
                      💡 <strong>Unified Identity Sync:</strong> Every action across these nodes automatically logs a synchronized record under user ID: <strong className="text-amber-500">EZ-1002458</strong>.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Section 5 (Cloud Services Topology) */}
              <div className={`lg:col-span-5 p-6 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div>
                  <div className="border-b border-zinc-900/60 pb-3 mb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                      <Cpu size={13} />
                      <span>Every-zone Microservice Cloud Architecture</span>
                    </h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      As the platform scales, services are decoupled into isolated cloud containers to optimize performance.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: '💾 Cloud Binary Storage', desc: 'S3-compatible bucket storing business flyers & user passport photos.', status: '99.9%', mem: '12% load', color: 'bg-emerald-500' },
                      { name: '🔔 Notification microservice', desc: 'Processes real-time SMS & secure app notifications queues.', status: 'Active', mem: '4.2 req/s', color: 'bg-indigo-500' },
                      { name: '📊 Analytics stream engine', desc: 'Aggregates click events and checkout telemetry in real-time.', status: 'Active', mem: '1.4 ms latency', color: 'bg-amber-500' },
                      { name: '🎥 Media Transcoder Node', desc: 'Processes creator vertical videos & live selling streams.', status: 'Standby', mem: '0% idle', color: 'bg-pink-500' },
                      { name: '🔌 Gateway Router APIs', desc: 'Distributes incoming HTTP queries across backend nodes.', status: '99.99%', mem: 'Port 3000 mapped', color: 'bg-cyan-500' },
                      { name: '💬 Encrypted Chat Sockets', desc: 'WebSocket container handling mutual matchmaking chats.', status: 'Active', mem: '120 active/s', color: 'bg-purple-500' },
                      { name: '🧠 AI Pipeline Agents', desc: 'Dedicated queue feeding context queries to Gemini API.', status: '99.8%', mem: 'Gemini 1.5 Flash', color: 'bg-teal-500' }
                    ].map((srv, idx) => (
                      <div key={idx} className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 flex justify-between items-center gap-3">
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${srv.color}`} />
                            <strong className="text-[11px] text-stone-200 font-mono">{srv.name}</strong>
                          </div>
                          <p className="text-[9.5px] text-stone-500 font-mono leading-tight mt-0.5">{srv.desc}</p>
                        </div>
                        <div className="text-right font-mono text-[9px] shrink-0">
                          <span className="text-emerald-400 font-black block">{srv.status}</span>
                          <span className="text-stone-600 block text-[8.5px]">{srv.mem}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 mt-4 text-[9.5px] font-mono text-stone-400">
                  <span className="text-indigo-400 font-black block mb-1">☁️ Scaling Rule Enforced</span>
                  Each service functions as an isolated Docker package, ready for auto-scaling on Google Cloud Run clusters.
                </div>
              </div>

            </div>

            {/* Row 2: Section 2 - Verified Business Profiles Platform */}
            <div className={`p-6 rounded-3xl border ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900/60 pb-3 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <Building size={13} />
                    <span>Every-zone Business Platform (Verified Business Profiles)</span>
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Explore trusted, accredited businesses with national biometric registration and verified physical address ratings.
                  </p>
                </div>

                {/* Search Business */}
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'Search verified businesses...' : 'የተረጋገጡ የንግድ መደብሮችን ይፈልጉ...'}
                  value={searchBizQuery}
                  onChange={(e) => setSearchBizQuery(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 placeholder-stone-600 w-full md:w-64 font-mono"
                />
              </div>

              {/* Category Filter Bar */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none">
                {[
                  { id: 'all', label: lang === 'en' ? 'All Businesses' : 'ሁሉም' },
                  { id: 'shops', label: lang === 'en' ? 'Shops' : 'ሱቆች' },
                  { id: 'restaurants', label: lang === 'en' ? 'Restaurants' : 'ሬስቶራንቶች' },
                  { id: 'pharmacies', label: lang === 'en' ? 'Pharmacies' : 'ፋርማሲዎች' },
                  { id: 'hotels', label: lang === 'en' ? 'Hotels' : 'ሆቴሎች' },
                  { id: 'garages', label: lang === 'en' ? 'Garages' : 'ጋራዦች' },
                  { id: 'clinics', label: lang === 'en' ? 'Clinics' : 'ክሊኒኮች' },
                  { id: 'law', label: lang === 'en' ? 'Law Offices' : 'የህግ ቢሮዎች' },
                  { id: 'education', label: lang === 'en' ? 'Education' : 'የትምህርት ተቋማት' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveBizCategory(cat.id);
                      handleAccessibilitySpeak(`Showing business category: ${cat.label}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap cursor-pointer ${
                      activeBizCategory === cat.id 
                        ? 'bg-emerald-500 text-stone-950 font-black' 
                        : 'bg-zinc-900 hover:bg-zinc-850 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Business Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  const items = [
                    // Shops
                    { name: lang === 'en' ? 'Aster Handwoven Apparel 🛍️' : 'አስቴር የእጅ ሽመና አልባሳት 🛍️', category: 'shops', ezId: 'EZ-BIZ-88902', faydaId: 'FYD-998-A29', location: lang === 'en' ? 'Addis Ababa (Bole)' : 'አዲስ አበባ (ቦሌ)', rating: 4.9, staff: 12, phone: '+251 911 23 4567', services: lang === 'en' ? 'Specialty handwoven gabis, traditional dresses, premium textiles' : 'ልዩ የእጅ ሽመና ጋቢዎች፣ ባህላዊ ቀሚሶች፣ ዋና ጨርቃ ጨርቆች' },
                    { name: lang === 'en' ? 'Sheger Tech Central 💻' : 'ሸገር ቴክ ሴንትራል 💻', category: 'shops', ezId: 'EZ-BIZ-44102', faydaId: 'FYD-125-K88', location: lang === 'en' ? 'Addis Ababa (Mercato)' : 'አዲስ አበባ (መርካቶ)', rating: 4.7, staff: 8, phone: '+251 912 34 5678', services: lang === 'en' ? 'Smartphones, laptop components, customized system configurations' : 'ስልኮች፣ ላፕቶፕ ዕቃዎች፣ የሲስተም ኮንፊገሬሽን' },
                    // Restaurants
                    { name: lang === 'en' ? 'Kategna Traditional Restaurant 🍲' : 'ቃጠኛ ባህላዊ ምግብ ቤት 🍲', category: 'restaurants', ezId: 'EZ-BIZ-11029', faydaId: 'FYD-452-T01', location: lang === 'en' ? 'Addis Ababa (Bole Atlas)' : 'አዲስ አበባ (ቦሌ አትላስ)', rating: 4.8, staff: 45, phone: '+251 911 44 2211', services: lang === 'en' ? 'Authentic Ethiopian cuisine, gourmet coffee ceremonies, private catering' : 'ጣፋጭ ባህላዊ ምግቦች፣ የቡና ስነ-ስርዓት፣ የቤት ካተሪንግ' },
                    { name: lang === 'en' ? 'Sheger Organic Café ☕' : 'ሸገር ኦርጋኒክ ካፌ ☕', category: 'restaurants', ezId: 'EZ-BIZ-55291', faydaId: 'FYD-773-C12', location: lang === 'en' ? 'Hawassa (Lakefront)' : 'ሀዋሳ (ሐይቅ ዳር)', rating: 4.6, staff: 15, phone: '+251 946 88 9900', services: lang === 'en' ? 'Organic single-origin coffees, fresh fruit smoothies, local pastries' : 'ኦርጋኒክ ንፁህ ቡና፣ ትኩስ የፍራፍሬ ጭማቂ፣ ጣፋጭ ኬኮች' },
                    // Pharmacies
                    { name: lang === 'en' ? 'Abyssinia Premium Pharmacy 💊' : 'አቢሲኒያ ፕሪሚየም ፋርማሲ 💊', category: 'pharmacies', ezId: 'EZ-BIZ-33201', faydaId: 'FYD-882-P44', location: lang === 'en' ? 'Addis Ababa (Megenagna)' : 'አዲስ አበባ (መገናኛ)', rating: 4.9, staff: 6, phone: '+251 911 77 8899', services: lang === 'en' ? 'Prescription fillings, organic health supplements, rapid blood glucose tests' : 'ማንኛውንም መድሃኒቶች፣ የቫይታሚን ተጨማሪዎች፣ የደም ምርመራዎች' },
                    // Hotels
                    { name: lang === 'en' ? 'Hilton Oasis Resort & Spa 🏨' : 'ሒልተን ኦአሲስ ሪዞርት እና ስፓ 🏨', category: 'hotels', ezId: 'EZ-BIZ-77302', faydaId: 'FYD-339-H55', location: lang === 'en' ? 'Hawassa (Resort Strip)' : 'ሀዋሳ (ሪዞርት መንገድ)', rating: 4.8, staff: 180, phone: '+251 911 33 4455', services: lang === 'en' ? 'Premium suites, thermal spring access, business conference centers' : 'VIP ክፍሎች፣ የሙቅ ውሃ መታጠቢያ፣ የስብሰባ አዳራሽ' },
                    { name: lang === 'en' ? 'Bole Atlas Penthouse Suites 🏨' : 'ቦሌ አትላስ ፔንትሀውስ ስዊትስ 🏨', category: 'hotels', ezId: 'EZ-BIZ-22104', faydaId: 'FYD-812-P91', location: lang === 'en' ? 'Addis Ababa (Bole Atlas)' : 'አዲስ አበባ (ቦሌ አትላስ)', rating: 4.9, staff: 34, phone: '+251 920 11 2233', services: lang === 'en' ? 'Luxury short-stay suites, secure keycard entry, high-speed fiber internet' : 'የቅንጦት ክፍሎች፣ የዲጂታል ካርድ በር ቁልፍ፣ ባለከፍተኛ ፍጥነት ዋይፋይ' },
                    // Garages
                    { name: lang === 'en' ? 'Sheger EV-Courier Repair Depot 🔧' : 'ሸገር ኤሌክትሪክ ጋራዥ 🔧', category: 'garages', ezId: 'EZ-BIZ-55403', faydaId: 'FYD-551-G33', location: lang === 'en' ? 'Addis Ababa (Kality)' : 'አዲስ አበባ (ቃሊቲ)', rating: 4.7, staff: 22, phone: '+251 911 99 0011', services: lang === 'en' ? 'Electric vehicle maintenance, rapid battery diagnostics, brake calibration' : 'የኤሌክትሪክ ተሽከርካሪ ጥገና፣ የባተሪ ምርመራ፣ የፍሬን ማስተካከል' },
                    // Clinics
                    { name: lang === 'en' ? 'Bole Atlas Specialist Clinic 🏥' : 'ቦሌ አትላስ ስፔሻሊስት ክሊኒክ 🏥', category: 'clinics', ezId: 'EZ-BIZ-99104', faydaId: 'FYD-901-C77', location: lang === 'en' ? 'Addis Ababa (Bole)' : 'አዲስ አበባ (ቦሌ)', rating: 4.8, staff: 28, phone: '+251 911 55 6677', services: lang === 'en' ? 'Pediatrics, dental implants, general health physicals' : 'የህጻናት ህክምና፣ የጥርስ ህክምና፣ ጠቅላላ የአካል ምርመራ' },
                    // Law Offices
                    { name: lang === 'en' ? 'Selam & Partners Legal Chambers ⚖️' : 'ሰላም እና አጋሮቹ የህግ ቢሮ ⚖️', category: 'law', ezId: 'EZ-BIZ-66702', faydaId: 'FYD-110-L03', location: lang === 'en' ? 'Addis Ababa (Bole Atlas)' : 'አዲስ አበባ (ቦሌ አትላስ)', rating: 4.9, staff: 14, phone: '+251 911 88 1122', services: lang === 'en' ? 'Corporate structuring, business licensing, cross-border employment compliance' : 'የድርጅት ማቋቋም ስራ፣ የንግድ ፈቃድ፣ የውጭ ስራ ህግ ማማከር' },
                    // Educational Institutions
                    { name: lang === 'en' ? 'Afro-Tech Coding Academy 🎓' : 'አፍሮ-ቴክ የኮዲንግ አካዳሚ 🎓', category: 'education', ezId: 'EZ-BIZ-11920', faydaId: 'FYD-441-E11', location: lang === 'en' ? 'Addis Ababa (Megenagna)' : 'አዲስ አበባ (መገናኛ)', rating: 4.9, staff: 18, phone: '+251 911 44 8833', services: lang === 'en' ? 'Full-stack software engineering, AI engineering bootcamp, corporate dev training' : 'ሙሉ የሶፍትዌር ኢንጂነሪንግ ስልጠና፣ የኤአይ ኮርስ፣ የድርጅቶች ስልጠና' }
                  ];

                  const filtered = items.filter(b => {
                    const matchesCategory = activeBizCategory === 'all' || b.category === activeBizCategory;
                    const matchesSearch = b.name.toLowerCase().includes(searchBizQuery.toLowerCase()) || 
                                          b.location.toLowerCase().includes(searchBizQuery.toLowerCase()) ||
                                          b.ezId.toLowerCase().includes(searchBizQuery.toLowerCase());
                    return matchesCategory && matchesSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="col-span-full py-8 text-center text-stone-500 font-mono text-xs bg-zinc-950 rounded-2xl border border-zinc-900">
                        ⚠️ No verified businesses match your search criteria.
                      </div>
                    );
                  }

                  return filtered.map((biz, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between hover:border-zinc-800 transition-all group">
                      {/* Top glowing bar */}
                      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                      
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between items-start gap-1.5">
                          <h5 className="font-extrabold text-xs text-stone-200 group-hover:text-emerald-400 transition">{biz.name}</h5>
                          <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 flex items-center gap-1">
                            🛡️ VERIFIED
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[9px] text-stone-500">
                          <span>EZ ID: <strong className="text-amber-500">{biz.ezId}</strong></span>
                          <span>•</span>
                          <span>Fayda: <strong className="text-stone-400">{biz.faydaId}</strong></span>
                        </div>

                        <p className="text-[11px] text-stone-400 leading-normal">{biz.services}</p>
                      </div>

                      <div className="border-t border-zinc-900 mt-3 pt-2.5 flex justify-between items-center text-[10px] font-mono text-stone-500">
                        <span>📍 {biz.location}</span>
                        <span className="text-stone-400 font-bold">⭐ {biz.rating} ({biz.staff} staff)</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Row 3: Section 3 - Every-zone Interactive AI Agents Sandbox */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: AI Agent Selector */}
              <div className={`lg:col-span-4 p-6 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
              }`}>
                <div>
                  <div className="border-b border-zinc-900/60 pb-3 mb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                      <Sparkles size={13} />
                      <span>Every-zone AI Agents Sandbox</span>
                    </h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      AI is not just a chatbot. Select any specialized Google Gemini API agent and execute deep logic simulations.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { id: 'shopping', label: '🛍️ Shopping Assistant', desc: 'Computes deep semantic storefront interest vectors.' },
                      { id: 'job', label: '💼 Job Advisor', desc: 'Matches passport metrics with global logistics jobs.' },
                      { id: 'house', label: '🏠 House Finder', desc: 'Estimates real estate valuations based on regional telemetry.' },
                      { id: 'vendor', label: '🏪 Vendor Assistant', desc: 'Generates promotional discount strategy and inventory suggestions.' },
                      { id: 'support', label: '🛎️ Customer Support', desc: 'Auto-resolves marketplace escrow disputes under 2 seconds.' },
                      { id: 'translation', label: '🗣️ Real-time Translation', desc: 'Amharic-to-English neural translation pipeline.' },
                      { id: 'search', label: '🔍 Intelligent Smart Search', desc: 'Fuzzy geolocated matching with biometric weight bias.' },
                      { id: 'fraud', label: '🔒 AI Fraud Detection', desc: 'Verifies Chapa wallet ledgers and blocks risk vectors.' },
                      { id: 'moderation', label: '🛡️ Content Auto-Moderation', desc: 'Filters offensive comments on store short-videos.' }
                    ].map(agent => (
                      <button
                        key={agent.id}
                        onClick={() => {
                          setActiveAiAgent(agent.id);
                          setAiAgentLog([]);
                          setAiAgentOutput('');
                          handleAccessibilitySpeak(`Selected ${agent.label} agent.`);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center gap-3 cursor-pointer ${
                          activeAiAgent === agent.id 
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' 
                            : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800 text-stone-400'
                        }`}
                      >
                        <div className="text-left">
                          <strong className="text-[11.5px] block">{agent.label}</strong>
                          <span className="text-[9.5px] text-stone-500 block leading-tight">{agent.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 mt-4">
                  <button
                    onClick={() => {
                      // Execute simulation
                      setActiveEcosystemNode('ai_assistant'); // Highlight AI node
                      setAiAgentLog([]);
                      setAiAgentOutput('');
                      setAiAgentProcessing(true);
                      
                      const steps: { [key: string]: string[] } = {
                        shopping: [
                          '🔍 Accessing Every-zone Marketplace index cache...',
                          '📈 Scanning historical order vectors for user ID: EZ-1002458...',
                          '💡 Match found: High affinity for local handwoven apparel & premium smartphones.',
                          '🧠 Running semantic recommendation matching against 4,800 active vendor catalogs...',
                          '✨ Optimal matching computed!'
                        ],
                        job: [
                          '💼 Querying Overseas Employment database nodes...',
                          '🔍 Scanning active visa processing queues in Dubai Logistics Cluster...',
                          '📋 Inspecting verified skills for profile: EZ-1002458...',
                          '📊 Computing skill matching ratio (98.4% fit with Port Logistics Admin).',
                          '✨ Matching job recommendation generated!'
                        ],
                        house: [
                          '🏠 Initiating Real Estate catalog search...',
                          '📍 Filtering by geographic cluster: Addis Ababa (Bole Atlas)...',
                          '🔑 Evaluating smart-lock keycard reservation options and escrow safety layers...',
                          '💵 Running price estimation model based on current regional telemetry...',
                          '✨ Best property matching found!'
                        ],
                        vendor: [
                          '🏪 Activating Every-zone Vendor Center advisor engine...',
                          '📈 Scanning active store metrics for Aster Handwoven Guild...',
                          '🛒 Analyzing shopping cart abandonment rates for Q3...',
                          '💡 Recommendation: Launch a 10% coupon promo on handwoven scarves to clear winter inventory.',
                          '✨ Promo strategy computed!'
                        ],
                        support: [
                          '🛎️ Initializing Customer Support ticket dispatcher...',
                          '💬 Scanning active customer chats for potential dispute triggers...',
                          '⚖️ Verifying escrow ledger holding vault for transaction EZ-1002458-M1...',
                          '🛡️ Automated Dispute Resolution Engine evaluates merchant shipping manifest...',
                          '✨ Resolution ready: Escrow funds cleared automatically!'
                        ],
                        translation: [
                          '🗣️ Initializing Neural Translation Pipeline...',
                          '📝 Detecting source content text language: Amharic (አማርኛ)...',
                          '🔄 Running bi-directional transformer model to target: English (US)...',
                          '🧠 Refining grammar structures for technical business terminology...',
                          '✨ Output translation successfully refined!'
                        ],
                        search: [
                          '🔍 Querying Every-zone Decentralized Search Index...',
                          '⚡ Executing fast fuzzy search across 12,000 active listings...',
                          '📌 Applying spatial geolocation filters (distance < 3.2km)...',
                          '🤖 Adjusting weights based on business verification stamps and Fayda reviews...',
                          '✨ 14 matching results computed in 1.4ms!'
                        ],
                        fraud: [
                          '🛡️ Deploying Smart Fraud Detection Sentinel...',
                          '💳 Inspecting Chapa API wallet ledger logs...',
                          '⚠️ Scanning for high-frequency or split-brain balance withdrawal attempts...',
                          '🔒 Matching behavior against 45 common financial fraud vectors...',
                          '✨ Transaction pattern verified as 100% SECURE.'
                        ],
                        moderation: [
                          '🤖 Activating Auto Moderation Sentinel...',
                          '💬 Streaming latest comment feed logs for creator video nodes...',
                          '🚫 Filtering offensive words, spam links, and duplicate promotional payloads...',
                          '📊 Computing positive sentiment density score: 94.6%...',
                          '✨ Moderation complete. All public streams approved!'
                        ]
                      };

                      const outputs: { [key: string]: string } = {
                        shopping: '🛍️ Every-zone AI suggests: Aster Handwoven Traditional Habesha Kemis (10% off for verified users) or Sheger Tech premium S24 Ultra matching your recent search footprint. Click "Buy" to route to safe escrow checkout.',
                        job: '💼 Every-zone AI suggests: Dubai Logistics Hub is hiring Senior Cargo Admins ($2,400 USD/mo). Your verified passport and logistics profile matching EZ-1002458 qualifies you for instant priority application filing.',
                        house: '🏠 Every-zone AI suggests: Bole Atlas Luxury Penthouse. Estimated value: 18,500,000 ETB. Rent rate: 45,000 ETB/mo. Secure smart-lock reservation available with safe escrow holding deposit.',
                        vendor: '🏪 Every-zone AI recommends: Aster Handloom Store should bundle "Traditional Gabi" with "Habesha Scarf" for 1,200 ETB total. Predicted sales surge: +24% based on regional holiday search analytics.',
                        support: '🛎️ Every-zone AI Resolved Dispute: Order EZ-1002458-M1. Merchant Sheger EV-Courier provided verified digital delivery proof. Escrow vault funds (14,500 ETB) cleared and credited to the vendor wallet in 1.2s.',
                        translation: '📝 Translation Output:\n[አማርኛ]: "እባክዎን የፋይዳ መታወቂያዎን በኪስ ቦርሳዎ ውስጥ ያረጋግጡ።"\n[English]: "Please verify your Fayda Identity inside your digital wallet for instant escrow clearances."',
                        search: '🔍 Fast Search Results:\n1. Aster Handwoven - Bole Atlas (0.4km)\n2. Abyssinia Pharmacy - Megenagna (2.1km)\n3. Selam Legal Chambers - Bole (0.8km)',
                        fraud: '🟢 Fraud Prevention Sentinel: Analyzed transaction EZ-W7-9912. No split-brain pattern detected. IP address matches registered Fayda bio-signature. Transaction cleared to proceed.',
                        moderation: '🛡️ Auto Moderation Status: analyzed 142 new chat comments. 1 bot spam comment block-listed automatically. Platform health rating: EXCELLENT.'
                      };

                      const activeAgentId = activeAiAgent;
                      let delay = 180;
                      steps[activeAgentId].forEach((step, i) => {
                        setTimeout(() => {
                          setAiAgentLog(prev => [...prev, step]);
                          if (i === steps[activeAgentId].length - 1) {
                            setAiAgentOutput(outputs[activeAgentId]);
                            setAiAgentProcessing(false);
                            triggerPushNotification('AI Simulation Settled', `Agent ${activeAgentId} completed pipeline execution.`, '🤖', 'system');
                            handleAccessibilitySpeak(`Agent execution complete.`);
                          }
                        }, delay * (i + 1));
                      });
                    }}
                    disabled={aiAgentProcessing}
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-stone-850 text-stone-950 disabled:text-stone-500 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    {aiAgentProcessing ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Processing Pipeline...
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        Execute AI Agent Simulation
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: AI Terminal Outputs & Sandbox Logs */}
              <div className="lg:col-span-8 flex flex-col justify-between bg-black border border-zinc-900 rounded-3xl p-6 font-mono text-xs">
                
                {/* Console Log Header */}
                <div className="border-b border-zinc-900 pb-2.5 flex justify-between items-center text-[10px] text-stone-500">
                  <span>SYSTEM CONSOLE // USER-EZ-1002458</span>
                  <span className="text-cyan-400 font-bold">STATUS: INTERACTIVE</span>
                </div>

                {/* Simulated Steps Outputs */}
                <div className="space-y-2 py-4 flex-1 min-h-[180px] text-left">
                  {aiAgentLog.length === 0 && !aiAgentProcessing && (
                    <div className="text-stone-600 text-xs py-8 text-center italic">
                      Click "Execute AI Agent Simulation" on the left to stream real-time Google Gemini container logs.
                    </div>
                  )}

                  {aiAgentLog.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-stone-400 flex items-start gap-2"
                    >
                      <span className="text-cyan-500 text-[10px] select-none">&gt;</span>
                      <span>{step}</span>
                    </motion.div>
                  ))}

                  {/* Ultimate result outputs */}
                  {aiAgentOutput && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3.5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-cyan-300 text-xs leading-relaxed font-mono whitespace-pre-wrap"
                    >
                      {aiAgentOutput}
                    </motion.div>
                  )}
                </div>

                {/* Console footer metadata */}
                <div className="border-t border-zinc-900 pt-3 flex justify-between items-center text-[9px] text-stone-500">
                  <span>Engine: Gemini-1.5-Flash</span>
                  <span>Port Binding: Decoupled API Container Router</span>
                </div>

              </div>

            </div>

            {/* Row 4: Section 4 - Business Intelligence Analytics Dashboard */}
            <div className={`p-6 rounded-3xl border ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900/60 pb-3 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                    <TrendingUp size={13} />
                    <span>Every-zone Business Intelligence Dashboard (Admin Panel)</span>
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Real-time transaction yields, merchant conversion analytics, and smart recommendations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    triggerPushNotification('BI Query Run', 'Running Gemini analysis on marketplace performance.', '📊', 'system');
                    setIsAnalyzingBi(true);
                    setBiInsights('');
                    setTimeout(() => {
                      setBiInsights(`📊 Google Gemini Business Intelligence Recommendations:
1. 📈 Conversion Rate Optimization: Your current conversion rate is 3.4% (Target: 4.5%). Action: schedule a regional vendor promotion coupon cycle for the high-volume electronics category to capture high shopping intent.
2. 🌍 Top Cities Expansion: Addis Ababa leads with 82% of transaction volume. However, Hawassa shows a 14% month-over-month surge in tourism/hotel listings. Plan: Launch regional advertising packages focused on local Hawassa resorts.
3. 📦 Escrow Release Health: 99.8% of marketplace orders are cleared within 2 hours. This is excellent! Action: promote the "Secure Escrow Guarantee" to prospective premium vendors to increase VIP store subscriptions.
4. 💼 Job-to-Agency Ratio: Dubai and Riyadh agencies are reporting shortfalls in cargo coordinator biometrics. Leverage Every-zone ID (EZ-1002458) verified credentials to pre-fill candidate visa applications.`);
                      setIsAnalyzingBi(false);
                      triggerPushNotification('AI BI Advice Settled', 'Actionable marketing advice generated.', '✨', 'system');
                      handleAccessibilitySpeak('Business intelligence recommendation ready.');
                    }, 1000);
                  }}
                  disabled={isAnalyzingBi}
                  className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-stone-850 text-white disabled:text-stone-500 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition active:scale-98"
                >
                  {isAnalyzingBi ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      {lang === 'en' ? 'Analyzing...' : 'በመተንተን ላይ...'}
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      {lang === 'en' ? 'Generate AI BI Analysis' : 'የኤአይ ቢዝነስ ትንተና ስራ'}
                    </>
                  )}
                </button>
              </div>

              {/* Core Analytics Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-5">
                {[
                  { label: 'Daily Revenue 🪙', val: '145,200 ETB', stat: '+12.4% vs yesterday', color: 'text-amber-500' },
                  { label: 'Weekly Revenue 🪙', val: '1,016,400 ETB', stat: '+8.1% vs last week', color: 'text-amber-500' },
                  { label: 'Monthly Revenue 🪙', val: '4,356,000 ETB', stat: '+14.9% vs Q2 base', color: 'text-amber-500' },
                  { label: 'Active Users 👥', val: '18,520 users', stat: '94% biometric verified', color: 'text-indigo-400' },
                  { label: 'Active Vendors 🏪', val: '480 Stores', stat: '65 premium subscribed', color: 'text-emerald-400' },
                  { label: 'Active Agencies 💼', val: '35 Agencies', stat: 'A-tier certified licenses', color: 'text-pink-400' },
                  { label: 'Most Viewed 🛍️', val: 'Samsung Galaxy S24', stat: 'Bole Penthouse (2nd)', color: 'text-cyan-400' },
                  { label: 'Top Cities 📍', val: 'Addis, Hawassa, Adama', stat: 'Dire Dawa emerging', color: 'text-stone-300' },
                  { label: 'Top Categories 📂', val: 'Electronics, Housing', stat: 'Overseas Jobs (3rd)', color: 'text-stone-300' },
                  { label: 'Conversion Rate 📈', val: '3.4%', stat: 'Target: 4.5% overall', color: 'text-yellow-400' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl flex flex-col justify-between text-left font-mono">
                    <span className="text-[10px] text-stone-500 block truncate font-bold">{item.label}</span>
                    <strong className={`text-sm block mt-1.5 ${item.color}`}>{item.val}</strong>
                    <span className="text-[8px] text-stone-600 block mt-1 font-bold leading-tight">{item.stat}</span>
                  </div>
                ))}
              </div>

              {/* Simulated Gemini BI insights output */}
              {biInsights && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-left"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-3 font-mono text-[10px]">
                    <Sparkles size={12} className="text-indigo-400" />
                    <span className="text-stone-200 uppercase font-black">Google Gemini Intelligent Advisor Output</span>
                  </div>
                  <pre className="text-stone-300 text-[11px] leading-relaxed font-mono whitespace-pre-wrap">{biInsights}</pre>
                </motion.div>
              )}
            </div>

            {/* Row 5: Section 6 - Every-zone Family Launchpad */}
            <div className={`p-6 rounded-3xl border ${
              isDarkMode ? 'bg-black/60 border-zinc-900' : 'bg-white border-stone-200'
            }`}>
              <div className="border-b border-zinc-900/60 pb-3 mb-5 text-left">
                <h4 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
                  <Smartphone size={13} />
                  <span>Every-zone Application Family Roadmap</span>
                </h4>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Future dedicated applications. To maximize visual focus, initial operations are synchronized inside this unified Super-App.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Every-zone Customer 📱', role: 'Main Consumer Portal', desc: 'Allows users to secure listings, apply for visas, chat with matches, and clear escrow payments.', status: 'ACTIVE IN SUPER-APP', color: 'from-amber-500/10 to-transparent border-amber-500/20' },
                  { name: 'Every-zone Vendor 🏪', role: 'Merchant CRM Portal', desc: 'Allows shop owners to list inventory, review delivery logs, track payouts, and schedule discount coupons.', status: 'STANDBY INTEGRATION', color: 'from-indigo-500/10 to-transparent border-indigo-500/20' },
                  { name: 'Every-zone Delivery 📦', role: 'EV-Courier Logistics', desc: 'Dedicated terminal for Sheger courier drivers to claim local parcels, verify deliveries, and trigger payout handshakes.', status: 'STANDBY INTEGRATION', color: 'from-pink-500/10 to-transparent border-pink-500/20' },
                  { name: 'Every-zone Admin Cloud ⚙️', role: 'SRE Monitor Portal', desc: 'Enterprise cockpit for SRE monitoring, disaster recovery audits, database backups, and customer support ticket resolutions.', status: 'STANDBY INTEGRATION', color: 'from-teal-500/10 to-transparent border-teal-500/20' }
                ].map((app, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border bg-gradient-to-b ${app.color} flex flex-col justify-between text-left h-44`}>
                    <div>
                      <span className="text-[9px] font-mono font-black text-stone-500 uppercase">{app.role}</span>
                      <h5 className="font-extrabold text-[12px] text-stone-200 mt-1">{app.name}</h5>
                      <p className="text-[10px] text-stone-400 mt-1.5 leading-normal">{app.desc}</p>
                    </div>
                    <div className="border-t border-zinc-900/50 pt-2 flex justify-between items-center text-[8.5px] font-mono">
                      <span className="text-stone-500">Node Status:</span>
                      <span className="text-amber-500 font-bold">{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
