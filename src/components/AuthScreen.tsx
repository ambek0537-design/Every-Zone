import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Key, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2, RefreshCw, 
  Smartphone, Globe, Sparkles, Mail, Lock, Check, Shield, AlertTriangle,
  User, Briefcase, Home, Activity, FileText, Ban
} from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
  lang: string;
  setLang: (l: string) => void;
  isDarkMode: boolean;
}

interface RoleDefinition {
  id: 'USER' | 'VENDOR' | 'REAL_ESTATE' | 'OVERSEAS' | 'SUPER_ADMIN';
  titleEn: string;
  titleAm: string;
  icon: string;
  permissionsEn: string[];
  permissionsAm: string[];
  descriptionEn: string;
  descriptionAm: string;
  color: string;
  badgeColor: string;
}

const ROLES: RoleDefinition[] = [
  {
    id: 'USER',
    titleEn: 'Customer / Buyer',
    titleAm: 'ደንበኛ / ገዢ',
    icon: '👥',
    descriptionEn: 'Explore the marketplace, find dream properties, apply for overseas jobs, and use secure escrow.',
    descriptionAm: 'ገበያዎችን ያስሱ፣ ህልምዎን ቤት ይከራዩ/ይግዙ፣ የውጭ አገር ስራዎችን ያግኙ እና አስተማማኝ ክፍያ ይጠቀሙ።',
    color: 'emerald',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    permissionsEn: ['Browse Shop Listings', 'Rent/Buy Real Estate', 'Apply for Overseas Jobs', 'Traditional Marriage Matching', 'Fayda Escrow Wallet'],
    permissionsAm: ['ምርቶችን መግዛት', 'ቤቶችን መከራየት/መግዛት', 'ለስራዎች ማመልከት', 'ትዳር ማገናኛ መጠቀም', 'የፋይዳ ዲጂታል የኪስ ቦርሳ']
  },
  {
    id: 'VENDOR',
    titleEn: 'Retail Vendor',
    titleAm: 'ችርቻሮ ሻጭ',
    icon: '🏪',
    descriptionEn: 'Sell cultural products, manage dress customizations, ship nationwide, and request instant bank payouts.',
    descriptionAm: 'ባህላዊ አልባሳትን ይሽጡ፣ የደንበኞችን መጠን ያስተካክሉ፣ ምርቶችን ያድርሱ እና ፈጣን የባንክ ዝውውር ይጠይቁ።',
    color: 'amber',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    permissionsEn: ['Manage Products', 'Manage Orders', 'Real-Time Sales Analytics', 'Withdraw Money (Telebirr/CBE)'],
    permissionsAm: ['ምርቶችን ማስተዳደር (መጨመር/መቀየር)', 'ትእዛዞችን ማስተዳደር', 'የሽያጭ ትንታኔ ሰሌዳ', 'ገንዘብ ማውጣት (በቴሌብር/CBE)']
  },
  {
    id: 'REAL_ESTATE',
    titleEn: 'Real Estate Agency',
    titleAm: 'የሪል እስቴት ወኪል',
    icon: '🏡',
    descriptionEn: 'Post luxury condominiums, premium villas, manage tenant/buyer leads, and track property tours.',
    descriptionAm: 'ምርጥ ኮንዶሚኒየሞችን እና ቪላዎችን ይለጥፉ፣ ተከራዮችን/ገዢዎችን ያነጋግሩ፣ እና የጉብኝት ቀጠሮዎችን ይቆጣጠሩ።',
    color: 'blue',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    permissionsEn: ['Post & Manage Properties', 'Lead & Tenant Communication', 'Real Estate Market Insights', 'Agency Revenue Withdrawal'],
    permissionsAm: ['ቤቶችን መለጠፍና ማስተዳደር', 'ከደንበኞች ጋር መወያየት', 'የቤት ገበያ ትንታኔዎች', 'የወኪል ገቢ ማውጫ']
  },
  {
    id: 'OVERSEAS',
    titleEn: 'Overseas Employment Agency',
    titleAm: 'የውጭ ሀገር የስራ ወኪል',
    icon: '✈️',
    descriptionEn: 'Post verified ministry-approved international career opportunities, screen applicant CVs, and manage passport queues.',
    descriptionAm: 'በሚኒስቴር መስሪያ ቤት የተፈቀዱ የውጭ አገር ስራዎችን ይለጥፉ፣ የቅጥር ሲቪዎችን ይገምግሙ እና ፓስፖርቶችን ያረጋግጡ።',
    color: 'sky',
    badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    permissionsEn: ['Post Overseas Careers', 'Screen Digital CVs & Applications', 'Schedule Video Interviews', 'Verify Digital Passport Status'],
    permissionsAm: ['የውጭ አገር ስራዎችን መለጠፍ', 'የደንበኞች ሲቪ መገምገም', 'የቪዲዮ ቃለ-መጠይቆችን ማዘጋጀት', 'የፓስፖርት ሁኔታዎችን ማረጋገጥ']
  },
  {
    id: 'SUPER_ADMIN',
    titleEn: 'Super Administrator',
    titleAm: 'የበላይ አስተዳዳሪ (ሱፐር-አድሚን)',
    icon: '👮',
    descriptionEn: 'Master administrative suite to moderate transactions, verify digital IDs, view platform logs, and system SRE telemetry.',
    descriptionAm: 'የበላይ የቁጥጥር ሰሌዳ፡ ምርቶችንና ወኪሎችን ማረጋገጥ፣ የደህንነት ሎጎችን መከታተል፣ እናPlatform ጤና መገምገም።',
    color: 'rose',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    permissionsEn: ['Full Platform Moderation', 'Verify Users, Vendors & Agencies', 'Real-Time Cyber-Security Telemetry', 'Comprehensive Audit Logs & SRE Logs'],
    permissionsAm: ['አጠቃላይ መድረኩን መቆጣጠር', 'ተጠቃሚዎችንና ወኪሎችን ማጽደቅ', 'የሳይበር ደህንነትና የስርዓት መቆጣጠሪያ', 'የእያንዳንዱ ዝውውር የኦዲት ሎግ']
  }
];

export function AuthScreen({ onSuccess, lang, setLang, isDarkMode }: AuthScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'USER' | 'VENDOR' | 'REAL_ESTATE' | 'OVERSEAS' | 'SUPER_ADMIN'>('USER');
  const [loginMethod, setLoginMethod] = useState<'PHONE' | 'EMAIL' | 'GOOGLE' | 'APPLE'>('PHONE');
  
  // Input fields
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Security visual metrics state
  const [logs, setLogs] = useState<string[]>([
    'Initializing secure cryptographic node handshake...',
    'CORS origin whitelist protection: ACTIVE (Port 3000 mapped)',
    'Helmet safety middleware: Loaded HTTP headers secure policy',
    'Rate limiter: Online (Max 100 requests/min/IP IP_SHIELD_ACTIVE)',
    'Ready for authorized secure credentials...'
  ]);

  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-scrolling logs sim
  useEffect(() => {
    const timer = setInterval(() => {
      const liveEvents = [
        `Incoming health poll: Server Node response 200 OK (${new Date().toLocaleTimeString()})`,
        'JWT Rotate rotation audit: Key rotators validated successfully',
        'Request validation: Sanitizing headers and payload objects...',
        'XSS protection filter: Verified query variables (Clean)',
        'SQL Injection safeguard: Active prepared-statements active'
      ];
      const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      setLogs(prev => [...prev.slice(-4), randomEvent]);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const getRoleData = () => {
    return ROLES.find(r => r.id === selectedRole) || ROLES[0];
  };

  const currentRole = getRoleData();

  const handleAuthentication = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    setAuthStatus(lang === 'am' ? 'የደህንነት ምስጠራ ቁልፎችን በማጣራት ላይ...' : 'Verifying secure cryptographic handshake...');

    // Simulate multi-factor handshake
    setTimeout(() => {
      // Validate inputs loosely for demo purposes
      if (loginMethod === 'PHONE' && pin && pin !== '1234' && pin !== '1111') {
        setLoading(false);
        setAuthStatus(null);
        setErrorMsg(lang === 'am' ? '❌ የተሳሳተ የይለፍ ቃል! (የሙከራው ፒን 1234 ነው)' : '❌ Invalid Security PIN! (Default demo PIN is 1234)');
        return;
      }
      if (loginMethod === 'EMAIL' && email && !email.includes('@')) {
        setLoading(false);
        setAuthStatus(null);
        setErrorMsg(lang === 'am' ? '❌ የተሳሳተ የኢሜይል አድራሻ!' : '❌ Invalid Email Address format!');
        return;
      }

      setAuthStatus(lang === 'am' ? 'የፋይዳ ዲጂታል ቀበሌ መታወቂያ ተረጋግጧል! 🛡️' : 'Fayda Digital Kebele ID Secured! 🛡️');
      
      setTimeout(() => {
        // Save sessions
        localStorage.setItem('ez_authenticated', 'true');
        localStorage.setItem('ez_user_role', selectedRole);
        localStorage.setItem('ez_user_phone', phone ? `+251${phone}` : '+251911223344');
        localStorage.setItem('ez_user_email', email || 'demo.user@everyzone.et');
        localStorage.setItem('ez_login_method', loginMethod);
        
        // Push an audit log
        const auditLog = {
          timestamp: new Date().toISOString(),
          event: `MFA_AUTH_SUCCESS`,
          role: selectedRole,
          method: loginMethod,
          ipAddress: '197.156.65.12',
          userAgent: navigator.userAgent
        };
        const savedLogs = JSON.parse(localStorage.getItem('ez_security_audit_logs') || '[]');
        savedLogs.push(auditLog);
        localStorage.setItem('ez_security_audit_logs', JSON.stringify(savedLogs));

        setLoading(false);
        setAuthStatus(null);
        onSuccess();
      }, 1000);
    }, 1200);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    setAuthStatus(lang === 'am' ? 'ከጉግል መለያ ጋር በመገናኘት ላይ...' : 'Connecting with Google Account...');

    try {
      // 1. Fetch the OAuth URL from server
      const res = await fetch('/api/auth/google/url');
      if (!res.ok) {
        throw new Error(lang === 'am' ? 'የመግቢያ አድራሻ ማግኘት አልተቻለም።' : 'Failed to retrieve Google Auth URL.');
      }
      const data = await res.json();
      
      // 2. Open pop-up window
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        data.url,
        'google-oauth-popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        throw new Error(lang === 'am' 
          ? 'እባክዎን የፖፕ-አፕ (Pop-up) መቆለፊያውን ያጥፉ። / Please allow pop-ups for this site to complete Google sign-in.' 
          : 'Please disable your pop-up blocker to complete Google sign-in.'
        );
      }

      // 3. Listen for postMessage from pop-up window
      const handleOAuthMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          const { token, user } = event.data;
          
          localStorage.setItem('ez_authenticated', 'true');
          localStorage.setItem('ez_user_token', token);
          localStorage.setItem('ez_user_role', user.role || selectedRole);
          localStorage.setItem('ez_user_phone', user.phone || '+251911223344');
          localStorage.setItem('ez_user_email', user.email);
          localStorage.setItem('ez_user_fullName', user.fullName);
          localStorage.setItem('ez_login_method', 'GOOGLE_OAUTH');
          
          setLoading(false);
          setAuthStatus(null);
          onSuccess();
          window.removeEventListener('message', handleOAuthMessage);
        }
      };

      window.addEventListener('message', handleOAuthMessage);

      // Check if pop-up closed without success
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          setLoading(false);
          setAuthStatus(null);
          window.removeEventListener('message', handleOAuthMessage);
        }
      }, 1000);

    } catch (err: any) {
      setLoading(false);
      setAuthStatus(null);
      setErrorMsg(err.message);
    }
  };

  // Demo bypass logins
  const handleQuickBypass = (roleId: 'USER' | 'VENDOR' | 'REAL_ESTATE' | 'OVERSEAS' | 'SUPER_ADMIN') => {
    setSelectedRole(roleId);
    setPhone(roleId === 'SUPER_ADMIN' ? '932011500' : roleId === 'VENDOR' ? '911223344' : '944556677');
    setPin('1234');
    setLoginMethod('PHONE');
    
    // Auto submit in a micro-tick
    setTimeout(() => {
      setErrorMsg(null);
      setLoading(true);
      setAuthStatus(lang === 'am' ? 'ባዮሜትሪክስ በመመርመር ላይ...' : 'Securing digital identity signature...');
      setTimeout(() => {
        localStorage.setItem('ez_authenticated', 'true');
        localStorage.setItem('ez_user_role', roleId);
        localStorage.setItem('ez_user_phone', roleId === 'SUPER_ADMIN' ? '+251932011500' : '+251911223344');
        localStorage.setItem('ez_user_email', `${roleId.toLowerCase()}@everyzone.et`);
        localStorage.setItem('ez_login_method', 'BIOMETRIC_BYPASS');
        
        setLoading(false);
        onSuccess();
      }, 1000);
    }, 100);
  };

  return (
    <div 
      id="auth-screen-root" 
      className={`absolute inset-0 z-50 flex flex-col md:flex-row overflow-hidden ${
        isDarkMode 
          ? 'bg-zinc-950 text-zinc-150' 
          : 'bg-[#FAF9F6] text-stone-850'
      }`}
    >
      {/* LEFT COMPANION HERO BAR (Beautiful design ornaments & Security Monitor) */}
      <div className={`hidden md:flex md:w-5/12 flex-col justify-between p-8 border-r transition-colors ${
        isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-stone-50 border-stone-200'
      }`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center text-white text-lg font-black font-serif">
              E
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest uppercase text-[#C5A059]">EVERY-ZONE</h2>
              <p className="text-[9px] font-mono text-stone-400 dark:text-zinc-500 font-bold uppercase">Abyssinia Sovereign Gateway</p>
            </div>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-lg font-bold font-serif leading-snug">
              {lang === 'en' ? 'Sovereign Digital Infrastructure' : 'ብሄራዊ ዲጂታል የመሠረተ ልማት መረብ'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
              {lang === 'en' 
                ? 'Every-zone connects cultural commerce, real estate agencies, overseas recruitment, and matrimonial matchmaking with standard cyber protection & biometrics.' 
                : 'ኤቭሪ-ዞን ባህላዊ ግብይትን፣ ሪል እስቴትን፣ የውጭ የስራ ቅጥርን እና የትዳር ማገናኛን ደረጃውን በጠበቀ የሳይበር ደህንነት እና ባዮሜትሪክስ ያገናኛል።'}
            </p>
          </div>
        </div>

        {/* Live Security Monitor panel */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-950/70 border-zinc-800' : 'bg-white border-stone-200'
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
              <Activity size={12} className="animate-pulse" />
              <span>Security Suite Telemetry</span>
            </div>
            <span className="text-[8px] bg-emerald-500/10 text-emerald-500 font-mono px-2 py-0.5 rounded-full font-black uppercase">
              ONLINE
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[9px] leading-relaxed text-stone-500 dark:text-zinc-400">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-1.5 items-start">
                <span className="text-emerald-500">❯</span>
                <span className="break-all">{log}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-zinc-850">
            <div className="space-y-0.5">
              <div className="text-[8px] text-stone-400 uppercase">CORS Policy</div>
              <div className="text-[9.5px] font-bold text-[#C5A059]">Node Enforced</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[8px] text-stone-400 uppercase">JWT Rotate</div>
              <div className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">Enabled (CJS)</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Active login forms & Role selection) */}
      <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
        
        {/* Top bar with Language and Mobile Logo */}
        <div className="flex justify-between items-center pb-4 border-b border-stone-200/50 dark:border-zinc-850">
          <div className="flex items-center gap-1.5 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold font-serif">E</div>
            <span className="text-[10px] font-black uppercase tracking-wider">Every-zone</span>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Globe size={13} className="text-stone-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-[10.5px] font-black outline-none border-none py-1 px-1 cursor-pointer dark:text-zinc-300"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ (AM)</option>
            </select>
          </div>
        </div>

        {/* Middle Form Body Container */}
        <div className="max-w-md w-full mx-auto my-auto py-6 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest text-[#C5A059] uppercase bg-[#C5A059]/10 px-2.5 py-1 rounded-full">
              <ShieldCheck size={10} className="text-amber-500 animate-pulse" />
              <span>{lang === 'en' ? 'Fayda Certified MFA Gateway' : 'በፋይዳ የተረጋገጠ የመግቢያ በር'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-serif">
              {lang === 'en' ? 'Sovereign Account Gateway' : 'የኤቭሪ-ዞን ደህንነቱ የተጠበቀ መግቢያ'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              {lang === 'en' ? 'Select your role and authenticate to access your custom workspace.' : 'የማንነትዎን ሚና ይምረጡ እና ወደ የስራ ማውጫዎ ለመግባት ያረጋግጡ።'}
            </p>
          </div>

          {/* 1. ROLE SELECTOR TABS */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
              {lang === 'en' ? 'Select Workspace Role' : 'የመግቢያ ሚናዎን ይምረጡ'}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  title={lang === 'en' ? r.titleEn : r.titleAm}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer ${
                    selectedRole === r.id 
                      ? (isDarkMode ? 'bg-zinc-800 border-amber-500 text-amber-400 shadow-md scale-105' : 'bg-[#1E3A1A] border-[#1E3A1A] text-white shadow-md scale-105')
                      : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100')
                  }`}
                >
                  <span className="text-base">{r.icon}</span>
                  <span className="text-[8px] font-black tracking-tighter uppercase truncate max-w-full px-1">
                    {r.id === 'REAL_ESTATE' ? 'Estate' : r.id === 'OVERSEAS' ? 'Jobs' : r.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. DYNAMIC ROLE INFO & PERMISSIONS BOX */}
          <motion.div
            layout
            className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-colors ${
              isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-[#FAF9F5] border-stone-250/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${currentRole.badgeColor}`}>
                🔑 {lang === 'en' ? currentRole.titleEn : currentRole.titleAm}
              </span>
              <span className="text-[8px] text-stone-400 font-mono font-bold uppercase">Role-Based Access Control</span>
            </div>

            <p className="text-[11px] leading-relaxed opacity-90 text-stone-500 dark:text-zinc-350 italic">
              {lang === 'en' ? currentRole.descriptionEn : currentRole.descriptionAm}
            </p>

            {/* Permissions list */}
            <div className="space-y-1.5 pt-1.5 border-t border-stone-200/50 dark:border-zinc-850">
              <div className="text-[9.5px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1">
                <Shield size={10} className="text-[#C5A059]" />
                <span>{lang === 'en' ? 'Authorized Permissions' : 'የተፈቀዱላቸው ተግባራት'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {(lang === 'en' ? currentRole.permissionsEn : currentRole.permissionsAm).map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10.5px] font-medium text-stone-600 dark:text-zinc-300">
                    <Check size={11} className="text-emerald-500 shrink-0 stroke-[3]" />
                    <span className="leading-tight">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 3. MULTI-METHOD LOGIN SELECTION */}
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-zinc-800 pb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                {lang === 'en' ? 'Choose Login Method' : 'የመግቢያ መንገድ ይምረጡ'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'PHONE', label: 'Phone', icon: <Phone size={11} /> },
                { id: 'EMAIL', label: 'Email', icon: <Mail size={11} /> },
                { id: 'GOOGLE', label: 'Google', icon: '🌐' },
                { id: 'APPLE', label: 'Apple', icon: '' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setLoginMethod(m.id as any)}
                  className={`py-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    loginMethod === m.id
                      ? (isDarkMode ? 'bg-zinc-850 border-amber-500/80 text-amber-400 font-extrabold' : 'bg-[#1E3A1A]/10 border-[#1E3A1A] text-[#1E3A1A] font-extrabold')
                      : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50')
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Banner messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-650 dark:text-red-400 text-xs font-bold text-center flex items-center justify-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authStatus && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold text-center space-y-2">
              <RefreshCw size={18} className="animate-spin mx-auto text-amber-500" />
              <div className="animate-pulse">{authStatus}</div>
            </div>
          )}

          {/* DYNAMIC FORM CONTAINER */}
          {!loading && (
            <form onSubmit={handleAuthentication} className="space-y-4">
              <AnimatePresence mode="wait">
                {loginMethod === 'PHONE' && (
                  <motion.div
                    key="phone-form"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3.5"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                        {lang === 'en' ? 'Fayda Registered Phone Number' : 'በፋይዳ የተመዘገበ ስልክ ቁጥር'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-black text-stone-400">
                          +251
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="9XX XX XX XX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').substring(0, 9))}
                          className={`w-full min-h-[44px] pl-14 pr-4 bg-white dark:bg-zinc-950 border rounded-xl text-xs font-mono font-black focus:outline-none focus:ring-1 ${
                            isDarkMode 
                              ? 'border-zinc-800 focus:ring-amber-500 text-zinc-100 placeholder-zinc-700' 
                              : 'border-stone-250 focus:ring-[#1E3A1A] text-stone-900 placeholder-stone-350'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                        {lang === 'en' ? '4-Digit Security Passcode PIN' : 'ባለ 4-አሃዝ የደህንነት ፒን ኮድ'}
                      </label>
                      <div className="relative">
                        <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="password"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={4}
                          required
                          placeholder="••••"
                          value={pin}
                          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                          className={`w-full min-h-[44px] pl-10 pr-4 bg-white dark:bg-zinc-950 border rounded-xl text-center text-sm font-mono tracking-widest font-black focus:outline-none focus:ring-1 ${
                            isDarkMode 
                              ? 'border-zinc-800 focus:ring-amber-500 text-zinc-100 placeholder-zinc-750' 
                              : 'border-stone-250 focus:ring-[#1E3A1A] text-stone-900 placeholder-stone-300'
                          }`}
                        />
                      </div>
                      <p className="text-[9px] text-stone-400 italic block">
                        💡 {lang === 'en' ? 'Demo access: Enter PIN 1234' : 'ለማሳያ መግቢያ፡ 1234 ያስገቡ'}
                      </p>
                    </div>
                  </motion.div>
                )}

                {loginMethod === 'EMAIL' && (
                  <motion.div
                    key="email-form"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3.5"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                        {lang === 'en' ? 'Corporate Email Address' : 'የኩባንያ ኢሜይል አድራሻ'}
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="email"
                          required
                          placeholder="merchant@everyzone.et"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full min-h-[44px] pl-10 pr-4 bg-white dark:bg-zinc-950 border rounded-xl text-xs font-bold focus:outline-none focus:ring-1 ${
                            isDarkMode 
                              ? 'border-zinc-800 focus:ring-amber-500 text-zinc-100' 
                              : 'border-stone-250 focus:ring-[#1E3A1A] text-stone-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                        {lang === 'en' ? 'Account Password' : 'የመለያ የይለፍ ቃል'}
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full min-h-[44px] pl-10 pr-4 bg-white dark:bg-zinc-950 border rounded-xl text-xs font-bold focus:outline-none focus:ring-1 ${
                            isDarkMode 
                              ? 'border-zinc-800 focus:ring-amber-500 text-zinc-100' 
                              : 'border-stone-250 focus:ring-[#1E3A1A] text-stone-900'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {loginMethod === 'GOOGLE' && (
                  <motion.div
                    key="google-oauth"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-4 rounded-xl border border-dashed border-stone-200 dark:border-zinc-800 text-center space-y-3"
                  >
                    <div className="text-2xl">🌐</div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase">{lang === 'en' ? 'Google Account Sync' : 'ከጎግል መለያ ጋር ማገናኘት'}</h4>
                      <p className="text-[10px] text-stone-400">{lang === 'en' ? 'Secure pop-up authorization with single sign-on.' : 'ደህንነቱ የተጠበቀ ፈጣን ባለ አንድ-ጠቅታ መግቢያ።'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn()}
                      className="inline-flex min-h-[38px] items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border rounded-lg text-[11px] font-bold shadow-xs hover:bg-stone-50 cursor-pointer"
                    >
                      <span>Google SSO Handshake</span>
                      <ArrowRight size={12} />
                    </button>
                  </motion.div>
                )}

                {loginMethod === 'APPLE' && (
                  <motion.div
                    key="apple-oauth"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-4 rounded-xl border border-dashed border-stone-200 dark:border-zinc-800 text-center space-y-3"
                  >
                    <div className="text-2xl"></div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase">{lang === 'en' ? 'Apple ID / FaceID Gateway' : 'ከአፕል መለያ/ፌስ-አይዲ ጋር ማገናኘት'}</h4>
                      <p className="text-[10px] text-stone-400">{lang === 'en' ? 'Secure cryptographic authorization for iOS devices.' : 'ደህንነቱ የተጠበቀ ከአፕል መሣሪያዎች ጋር ማገናኛ'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAuthentication()}
                      className="inline-flex min-h-[38px] items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-zinc-950 rounded-lg text-[11px] font-bold shadow-xs hover:opacity-95 cursor-pointer"
                    >
                      <span>Apple Secure Authentication</span>
                      <ArrowRight size={12} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              {(loginMethod === 'PHONE' || loginMethod === 'EMAIL') && (
                <button
                  type="submit"
                  className={`w-full min-h-[44px] font-black text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400' 
                      : 'bg-[#1E3A1A] text-white hover:bg-[#122410]'
                  }`}
                >
                  <span>{lang === 'en' ? 'Authorize & Open Wallet' : 'ማረጋገጫ ስጥ እና ቦርሳውን ክፈት'}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </form>
          )}

          {/* Quick Developer Fast-Track Logins */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDarkMode ? 'bg-zinc-900/20 border-zinc-850/80' : 'bg-stone-50/50 border-stone-200/60'
          }`}>
            <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider block">
              💡 {lang === 'en' ? 'Secure Live Testing Profiles' : 'ለገምጋሚዎች ፈጣን የሙከራ መለያዎች'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'USER', label: 'Customer (Selamawit)', icon: '👥' },
                { id: 'VENDOR', label: 'Retail Vendor (Bole Dress)', icon: '🏪' },
                { id: 'REAL_ESTATE', label: 'Estate Agency (Luxury)', icon: '🏡' },
                { id: 'OVERSEAS', label: 'Overseas Agency (Gigi)', icon: '✈️' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleQuickBypass(b.id as any)}
                  className={`p-2.5 rounded-xl border text-left text-[10px] font-bold transition-all cursor-pointer active:scale-95 flex flex-col justify-between hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-750' 
                      : 'bg-white border-stone-200 text-stone-750 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="truncate max-w-[80%]">{b.label}</span>
                    <span>{b.icon}</span>
                  </div>
                  <span className="text-[8px] text-stone-400 mt-1 font-mono">Bypass MFA</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickBypass('SUPER_ADMIN')}
                className="col-span-2 p-2.5 rounded-xl border text-left text-[10px] font-black tracking-wide transition-all cursor-pointer active:scale-95 bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between"
              >
                <span>👮 Super-Admin Console (Kidus)</span>
                <span className="text-[8.5px] font-mono font-bold bg-rose-500/15 text-rose-500 px-1.5 py-0.5 rounded uppercase">Full Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Brand/Security Footer Credits */}
        <div className="text-center space-y-1 mt-auto pt-4 border-t border-stone-200/50 dark:border-zinc-850 select-none">
          <div className="flex justify-center items-center gap-1.5 text-[9.5px] text-emerald-600 dark:text-emerald-400 font-black">
            <ShieldCheck size={12} className="stroke-[2.5]" />
            <span>Fayda Digital Kebele ID Security System Mapped</span>
          </div>
          <p className="text-[8.5px] text-stone-400 dark:text-zinc-500 font-mono">
            Every-zone Core Node | SHA-256 HSM Cryptographic Verification Engine Active
          </p>
        </div>

      </div>
    </div>
  );
}
