import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Key, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2, RefreshCw, Smartphone, Globe, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
  lang: string;
  setLang: (l: string) => void;
  isDarkMode: boolean;
}

const authTexts: Record<string, Record<string, string>> = {
  en: {
    title: "Secure Identity Gateway",
    subtitle: "Verify your phone and secure wallet passcode",
    phoneLabel: "Phone Number (Fayda Registered)",
    phonePlaceholder: "9XX XX XX XX",
    pinLabel: "Enter 4-Digit Security PIN",
    biometricLabel: "Login with Biometrics",
    quickTitle: "Quick Developer / Reviewer Login",
    quickAdmin: "Login as Super-Admin (Fayda Secured)",
    quickUser: "Login as Citizen Buyer (Selamawit)",
    loginBtn: "Authorize & Unlock Wallet",
    biometricProcessing: "Processing biometrics...",
    biometricMatch: "Secure Fayda Credentials Matched!",
    invalidPin: "❌ Invalid Passcode! (Default demo PIN is 1234 or click Quick-Login)",
    pinPrompt: "Demo Access: Enter any phone and PIN 1234 to proceed",
    kebeleChecked: "Fayda Digital Kebele ID Secured"
  },
  am: {
    title: "ደህንነቱ የተጠበቀ ማንነት ማረጋገጫ",
    subtitle: "ስልክዎን እና የኪስ ቦርሳዎን የይለፍ ቃል ያረጋግጡ",
    phoneLabel: "የስልክ ቁጥር (በፋይዳ የተመዘገበ)",
    phonePlaceholder: "9XX XX XX XX",
    pinLabel: "ባለ 4-አሃዝ የደህንነት ፒን ያስገቡ",
    biometricLabel: "በባዮሜትሪክስ (ጣት/ፊት) ይግቡ",
    quickTitle: "ለገምጋሚዎች ፈጣን መግቢያ",
    quickAdmin: "እንደ የበላይ አስተዳዳሪ ግባ (ሱፐር-አድሚን)",
    quickUser: "እንደ መደበኛ ዜጋ ግባ (ሰላማዊት)",
    loginBtn: "ፈቃድ ስጥ እና ቦርሳውን ክፈት",
    biometricProcessing: "ባዮሜትሪክስ በመመርመር ላይ...",
    biometricMatch: "የፋይዳ ዲጂታል ባዮሜትሪክስ ተዛምዷል!",
    invalidPin: "❌ የተሳሳተ የይለፍ ቃል! (የሙከራው ፒን 1234 ነው ወይም ፈጣን መግቢያን ይጫኑ)",
    pinPrompt: "የሙከራ መግቢያ፡ የትኛውንም ስልክ ቁጥር እና 1234 ፒን በመጠቀም መግባት ይችላሉ",
    kebeleChecked: "የፋይዳ ዲጂታል ቀበሌ መታወቂያ ተረጋግጧል"
  },
  ti: {
    title: "ደህንነቱ ዝተሓለወ መንነት መረጋገጺ",
    subtitle: "ስልክኹምን ናይ ምትእኽኻብ ቦርሳኹምን መሕለፊ ቃል ኣረጋግጹ",
    phoneLabel: "ቁጽሪ ስልኪ (ብፋይዳ ዝተመዝገበ)",
    phonePlaceholder: "9XX XX XX XX",
    pinLabel: "ናይ 4-ዲጂት ናይ ደህንነት ፒን የእትዉ",
    biometricLabel: "ብባዮሜትሪክስ (ዓይኒ/ዓሰርተ ኣጻብዕ) እተዉ",
    quickTitle: "ንገምገምቲ ቅልጡፍ መእተዊ",
    quickAdmin: "ከም ላዕለዋይ ኣመሓዳሪ እተዉ (ሱፐር-አድሚን)",
    quickUser: "ከም ተራ ዜጋ እተዉ (ሰላማዊት)",
    loginBtn: "ፍቃድ ሃብን ቦርሳ ክፈትን",
    biometricProcessing: "ባዮሜትሪክስ ይምርምር ኣሎ...",
    biometricMatch: "ናይ ፋይዳ ባዮሜትሪክስ ተዛሚዱ ኣሎ!",
    invalidPin: "❌ ጌጋ መሕለፊ ቃል! (መተግበሪ ፈተነ ፒን 1234 እዩ ወይ ፈጣን መእተዊ ተጠቐሙ)",
    pinPrompt: "ፈተነ መእተዊ: ዝኾነ ቁጽሪ ስልክን 1234 ፒንን ተጠቐሙ",
    kebeleChecked: "ናይ ፋይዳ ዲጂታል ቀበሌ መታወቂያ ተረጋጊጹ"
  },
  om: {
    title: "Eenyummeessa Nageenyaa",
    subtitle: "Lakk bilbilaa fi koodii dhoksaa wallet keessanii mirkaneessaa",
    phoneLabel: "Lakk Bilbilaa (Fayda irratti kan galmaa'e)",
    phonePlaceholder: "9XX XX XX XX",
    pinLabel: "Koodii PIN Nageenyaa Diqitii 4 galchaa",
    biometricLabel: "Biometrics (Fingerprint/Face ID) n Seeni",
    quickTitle: "Galaafattotaaf Seensa Saffisaa",
    quickAdmin: "Seensa Super-Admin (Fayda qabu)",
    quickUser: "Seensa Lammii (Selamawit)",
    loginBtn: "Hayyami fi Wallet Bani",
    biometricProcessing: "Biometrics daddaffiin ilaalamaa jira...",
    biometricMatch: "Eenyummeessaan Fayda biometrics walsimeera!",
    invalidPin: "❌ PIN dogoggora! (Koodiin yaalii 1234 dha ykn Seensa Saffisaa cuqaasaa)",
    pinPrompt: "Akkamitti seentu: Lakk bilbilaa kamiyyuu fi koodii 1234 n seenaa",
    kebeleChecked: "Eenyummeessaa Kebele Fayda mirkanaa'eera"
  },
  ar: {
    title: "بوابة الهوية الآمنة",
    subtitle: "التحقق من رقم هاتفك ورمز أمان المحفظة",
    phoneLabel: "رقم الهاتف (المسجل في نظام فايدا)",
    phonePlaceholder: "9XX XX XX XX",
    pinLabel: "أدخل رمز الأمان المكون من 4 أرقام",
    biometricLabel: "تسجيل الدخول بالمقاييس الحيوية",
    quickTitle: "دخول سريع للمطورين والمراجعين",
    quickAdmin: "دخول بصفتك مسؤول رئيسي (Super-Admin)",
    quickUser: "دخول بصفتك مواطنة عادية (Selamawit)",
    loginBtn: "تفويض وفتح المحفظة الآمنة",
    biometricProcessing: "جاري فحص الخصائص الحيوية...",
    biometricMatch: "تمت مطابقة المقاييس الحيوية لـ Fayda بنجاح!",
    invalidPin: "❌ رمز PIN غير صحيح! (الرمز الافتراضي هو 1234 أو انقر للدخول السريع)",
    pinPrompt: "للوصول التجريبي: أدخل أي هاتف ورمز PIN 1234 للمتابعة",
    kebeleChecked: "تم التحقق من الهوية الرقمية لبلدية فايدا"
  }
};

export function AuthScreen({ onSuccess, lang, setLang, isDarkMode }: AuthScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<string | null>(null);
  const [showQuickTips, setShowQuickTips] = useState(true);

  const tAuth = authTexts[lang] || authTexts.en;

  // Handle standard manual login
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Filtered phone numbers and valid PIN check
    // We allow PIN 1234 or 1111 for general demo bypass, or any phone number with pin 1234
    if (pin === '1234' || pin === '1111') {
      // Success auth
      localStorage.setItem('ez_authenticated', 'true');
      localStorage.setItem('ez_user_phone', phoneNumber || '+251911223344');
      onSuccess();
    } else {
      setErrorMessage(tAuth.invalidPin);
    }
  };

  // Perform quick automated login for developers
  const handleQuickLogin = (role: 'admin' | 'user') => {
    setErrorMessage(null);
    setBiometricLoading(true);
    setBiometricStatus(tAuth.biometricProcessing);

    setTimeout(() => {
      setBiometricStatus(tAuth.biometricMatch);
      setTimeout(() => {
        if (role === 'admin') {
          localStorage.setItem('ez_authenticated', 'true');
          localStorage.setItem('ez_user_phone', '+251932011500');
          localStorage.setItem('ez_user_role', 'SUPER_ADMIN');
          // Dispatch a custom event to update active super admin control state if needed
          window.dispatchEvent(new Event('ez_login_admin'));
        } else {
          localStorage.setItem('ez_authenticated', 'true');
          localStorage.setItem('ez_user_phone', '+251944556677');
          localStorage.setItem('ez_user_role', 'USER');
        }
        setBiometricLoading(false);
        setBiometricStatus(null);
        onSuccess();
      }, 1000);
    }, 1200);
  };

  // Simulated Fingerprint Scan
  const triggerFingerprintScan = () => {
    setErrorMessage(null);
    setBiometricLoading(true);
    setBiometricStatus(tAuth.biometricProcessing);

    setTimeout(() => {
      // Success match
      setBiometricStatus(tAuth.biometricMatch);
      setTimeout(() => {
        localStorage.setItem('ez_authenticated', 'true');
        localStorage.setItem('ez_user_phone', '+251911223344');
        setBiometricLoading(false);
        setBiometricStatus(null);
        onSuccess();
      }, 1000);
    }, 1800);
  };

  return (
    <div 
      id="auth-screen-container" 
      className={`absolute inset-0 z-40 flex flex-col justify-between p-5 overflow-y-auto ${
        isDarkMode 
          ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100' 
          : 'bg-gradient-to-b from-[#FAF9F5] via-[#F3EFE6] to-[#FAF9F5] text-stone-850'
      }`}
    >
      {/* Decorative Gold geometric background line on top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-600 via-amber-400 to-amber-500" />

      {/* Language Header bar & Title */}
      <div className="flex flex-col space-y-4 pt-3 z-10 shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Smartphone size={16} className={isDarkMode ? 'text-amber-400' : 'text-[#1E3A1A]'} />
            <span className="text-[10px] font-black uppercase tracking-wider font-mono">
              Fayda Authenticator
            </span>
          </div>

          {/* Quick Language Toggle Selector directly inside Authentication */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-stone-200/50 dark:border-zinc-800">
            <Globe size={11} className="text-stone-400 ml-1.5" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-[9.5px] font-bold outline-none border-none py-1 px-1.5 cursor-pointer dark:text-zinc-300"
            >
              <option value="en">EN</option>
              <option value="am">አማ</option>
              <option value="ti">ትግ</option>
              <option value="om">Oro</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        {/* Branding header */}
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest text-[#C5A059] uppercase bg-[#C5A059]/10 px-2 py-0.5 rounded-full">
            <Sparkles size={8} /> Secure Sandbox Node
          </div>
          <h2 className="text-xl font-black font-sans leading-tight">
            {tAuth.title}
          </h2>
          <p className="text-[10px] text-stone-500 dark:text-zinc-400">
            {tAuth.subtitle}
          </p>
        </div>
      </div>

      {/* Middle form panel */}
      <div className="my-auto py-5 space-y-5 z-10">
        {/* Error message banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-650 text-xs font-bold text-center"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Biometrics loading modal indicator */}
        <AnimatePresence>
          {biometricLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2"
            >
              <RefreshCw size={20} className="animate-spin mx-auto text-amber-500" />
              <div className="text-xs font-bold text-amber-500 animate-pulse">
                {biometricStatus}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Login Form */}
        {!biometricLoading && (
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                {tAuth.phoneLabel}
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 font-mono">
                  +251
                </div>
                <input
                  id="auth-phone-input"
                  type="tel"
                  required
                  placeholder={tAuth.phonePlaceholder}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 9))}
                  className={`w-full min-h-[44px] pl-14 pr-4 bg-white dark:bg-zinc-950 border rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 ${
                    isDarkMode 
                      ? 'border-zinc-800 focus:ring-amber-500 text-zinc-100 placeholder-zinc-650' 
                      : 'border-stone-250 focus:ring-[#1E3A1A] text-stone-900 placeholder-stone-400'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                {tAuth.pinLabel}
              </label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  id="auth-pin-input"
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
                      ? 'border-zinc-800 focus:ring-amber-500 text-zinc-100 placeholder-zinc-600' 
                      : 'border-stone-250 focus:ring-[#1E3A1A] text-stone-900 placeholder-stone-300'
                  }`}
                />
              </div>
              <span className="text-[9px] text-stone-400 dark:text-zinc-500 font-medium block italic">
                💡 {tAuth.pinPrompt}
              </span>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full min-h-[44px] bg-[#1E3A1A] hover:bg-[#152912] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-extrabold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{tAuth.loginBtn}</span>
              <ArrowRight size={13} />
            </button>
          </form>
        )}

        {/* Simulated Biometrics scan button */}
        {!biometricLoading && (
          <div className="space-y-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-stone-200 dark:border-zinc-850" />
              <span className="flex-shrink mx-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest select-none">
                OR SECURE ACCESS
              </span>
              <div className="flex-grow border-t border-stone-200 dark:border-zinc-850" />
            </div>

            <button
              id="auth-biometric-btn"
              type="button"
              onClick={triggerFingerprintScan}
              className={`w-full min-h-[44px] border rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 ${
                isDarkMode 
                  ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-850' 
                  : 'bg-stone-50 border-stone-200 text-stone-750 hover:bg-stone-100/80'
              }`}
            >
              <span>🔘</span>
              <span>{tAuth.biometricLabel}</span>
            </button>
          </div>
        )}

        {/* Developer Quick Accounts Grid */}
        {!biometricLoading && showQuickTips && (
          <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
            isDarkMode ? 'bg-zinc-950/40 border-zinc-850/80' : 'bg-[#FAF9F5]/40 border-stone-200/60'
          }`} id="quick-accounts-section">
            <div className="flex justify-between items-center">
              <span className="text-[9.5px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                ⚙️ {tAuth.quickTitle}
              </span>
              <button 
                type="button"
                onClick={() => setShowQuickTips(false)}
                className="text-[8.5px] font-bold text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 uppercase"
              >
                Hide
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                id="quick-login-admin"
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl border text-left text-[10px] font-bold transition-all cursor-pointer active:scale-95 bg-amber-500/5 border-amber-500/20 text-amber-500 hover:bg-amber-500/10"
              >
                👮 {tAuth.quickAdmin}
                <div className="text-[8.5px] text-stone-400 mt-0.5 font-mono font-medium">Phone: +251 932 011 500 | PIN: 1234</div>
              </button>

              <button
                id="quick-login-user"
                type="button"
                onClick={() => handleQuickLogin('user')}
                className="p-2.5 rounded-xl border text-left text-[10px] font-bold transition-all cursor-pointer active:scale-95 bg-emerald-500/5 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
              >
                👥 {tAuth.quickUser}
                <div className="text-[8.5px] text-stone-400 mt-0.5 font-mono font-medium">Phone: +251 944 556 677 | PIN: 1234</div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Credentials Info */}
      <div className="text-center space-y-1.5 mt-auto pt-3 shrink-0 border-t border-stone-200/50 dark:border-zinc-850 select-none">
        <div className="flex justify-center items-center gap-1 text-[9.5px] text-emerald-600 dark:text-emerald-400 font-bold">
          <ShieldCheck size={11} />
          <span>{tAuth.kebeleChecked}</span>
        </div>
        <div className="text-[8.5px] text-stone-400 dark:text-zinc-500 font-mono">
          Secured by Abyssinia Central Bank cryptographic node
        </div>
      </div>
    </div>
  );
}
