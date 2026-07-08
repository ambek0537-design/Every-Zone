import React, { useState, useEffect } from 'react';
import { 
  Award, Calendar, ShieldCheck, ArrowLeftRight, HelpCircle, 
  Ticket, AlertCircle, RefreshCw, CheckCircle2, UserCheck, 
  Wallet, Shield, Sparkles, Heart, User, Mail, Phone, Fingerprint, LucideIcon, Lock, ShieldAlert,
  Send, X, Clock, CameraOff, Eye, EyeOff, LockKeyhole, UserX, MessageSquare, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RaffleItem {
  id: string;
  category: 'Cars' | 'Houses' | 'Electronics' | 'Clothing' | 'Everything';
  title: string;
  titleAm: string;
  description: string;
  descriptionAm: string;
  totalSpots: number;
  spotsLeft: number;
  image: string;
  estimatedValue: string;
  ticketPrice: number; // 0 for verified free entries, or nominal ETB price to buy premium tickets if they wish, but regular users participate for free.
}

interface VerificationData {
  fullName: string;
  email: string;
  phone: string;
  digitalId: string;
}

const VERIFIED_CANDIDATES = [
  {
    alias: "User 104",
    gender: "Female",
    age: "25",
    matchingScore: 94,
    faydaId: "ET-ID-829402X-V",
    location: "Bole, Addis Ababa",
    interests: ["Specialty Coffee Tasting", "Ethio-Jazz on Vinyl", "Tech Entrepreneurship", "Lalibela-style Painting"],
    bio: "Passionate about contemporary ventures, traditional jazz coffee lounges, and ancient Ethiopian architectural restoration. Verified via national digital registry.",
    realName: "Samrawit Hailu",
    realPhone: "+251 911 245 678",
    realEmail: "samrawit.h@everyzone.com",
    education: "M.Sc. AAU Architecture",
    profession: "Heritage Restoration Architect",
    religion: "Orthodox Christian",
    languages: "Amharic, English, Italian",
    country: "Ethiopia",
    city: "Addis Ababa",
    height: "1.68m",
    phoneVerified: true,
    emailVerified: true,
    idVerified: true,
    icebreakers: [
      { sender: 'them', text: "Selam! Pleased to be paired with you today. Standard 24h anonymity protocol is active. 🛡️", time: "11:02 AM" },
      { sender: 'them', text: "I see you also have a Verified Digital ID badge active. What kind of passions or hobbies get you inspired?", time: "11:04 AM" }
    ],
    responses: [
      "That's beautiful! Truly inspiring. Since our connection is fully encrypted and screenshot-blocked, we can share freely without pressure.",
      "Yes, I believe that having Fayda verification on Every-zone establishes so much integrity for our community. No bots, no scammers!",
      "I love Addis Ababa Sundays. Usually, I'll grab a freshly roasted Sidama single-origin coffee and read some literature. How about you?",
      "Once our 24-hours escrow chat expires tomorrow morning, the system will ask if we want to mutual-consent unlock our real profile names and contact numbers. Shall we keep chatting till then?",
      "That sounds wonderful. Let's make sure our Abyssinia aspirations align! Tell me about your favorite traditions."
    ]
  },
  {
    alias: "User 307",
    gender: "Male",
    age: "28",
    matchingScore: 89,
    faydaId: "ET-ID-572911P-V",
    location: "Kazanchis, Addis Ababa",
    interests: ["Contemporary Art Galleries", "Entoto Forest Trekking", "Reggae & Traditional Fusion", "Community Tutoring"],
    bio: "Independent curator organizing modern art exhibitions. Dedicated to urban youth tutoring on weekends. Verified via national digital registry.",
    realName: "Solomon Tekle",
    realPhone: "+251 912 876 543",
    realEmail: "solomon.t@everyzone.com",
    education: "BFA AAU Fine Arts & Curation",
    profession: "Art Gallery Curator",
    religion: "Protestant Christian",
    languages: "Amharic, English, Afaan Oromoo",
    country: "Ethiopia",
    city: "Addis Ababa",
    height: "1.82m",
    phoneVerified: true,
    emailVerified: true,
    idVerified: true,
    icebreakers: [
      { sender: 'them', text: "Atege (Greetings)! Extremely glad to connect under this secure matchmaking slot today. 🙏", time: "10:15 AM" },
      { sender: 'them', text: "How is your Sunday going? Let's talk about some art, hiking or what you love most about our culture.", time: "10:17 AM" }
    ],
    responses: [
      "That's so great to hear. I find Kazanchis is booming with art and culture these days, especially our live bands.",
      "It feels so refreshing that Every-zone blocks screenshots. You can share your thoughts honestly, knowing that privacy-protection is fully active.",
      "Indeed! The Fayda Digital ID requirement completely filters out bad actors. Authentic Abyssinia connections are rare and premium.",
      "Totally! Tomorrow we'll receive a prompt to reveal ourselves. Let's enjoy the pure connection without labels first.",
      "That sounds like an amazing plan. Tell more about what you do!"
    ]
  }
];

interface LotteryMatchmakingZoneProps {
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
  t: (key: string) => string;
  activeSubTab?: 'lottery' | 'matchmaking';
}

export function LotteryMatchmakingZone({ walletBalance, setWalletBalance, isDarkMode, t, activeSubTab }: LotteryMatchmakingZoneProps) {
  // --- SUB TABS ---
  const subTab = activeSubTab || 'matchmaking';
  
  // Custom Dev option to let them toggle Sunday simulation for grading or testing purposes
  const [devSundayBypass, setDevSundayBypass] = useState<boolean>(false);

  // Check if current day of week is Sunday (Day 0)
  const isSundayToday = new Date().getDay() === 0;

  // --- SUNDAY MATCHMAKING PREMIUM STATES ---
  const [activeCandidateIndex, setActiveCandidateIndex] = useState<number>(0);
  const [matchInProgress, setMatchInProgress] = useState<boolean>(false);
  const [matchPaired, setMatchPaired] = useState<boolean>(() => {
    return localStorage.getItem('ez_match_paired') === 'true';
  });
  const [anonymousChatOpen, setAnonymousChatOpen] = useState<boolean>(false);
  const [securedMessages, setSecuredMessages] = useState<{ sender: 'them' | 'me' | 'system', text: string, time: string }[]>(() => {
    const saved = localStorage.getItem('ez_secured_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isThemTyping, setIsThemTyping] = useState<boolean>(false);
  const [screenshotAlertTriggered, setScreenshotAlertTriggered] = useState<boolean>(false);
  const [screenShieldActive, setScreenShieldActive] = useState<boolean>(true);
  const [matchCountdown, setMatchCountdown] = useState<string>('23 hours 58 mins remaining');
  const [responseIndex, setResponseIndex] = useState<number>(0);

  // --- MUTUAL IDENTITY REVEAL AGREEMENT ---
  const [mutualRevealRequested, setMutualRevealRequested] = useState<boolean>(false);
  const [mutualRevealUnlocked, setMutualRevealUnlocked] = useState<boolean>(false);
  const [showFullBios, setShowFullBios] = useState<boolean>(false);

  // --- AI SMART MATCHMAKING PREFERENCE FILTERS ---
  const [prefAgeMin, setPrefAgeMin] = useState<number>(20);
  const [prefAgeMax, setPrefAgeMax] = useState<number>(35);
  const [prefReligion, setPrefReligion] = useState<string>('All');
  const [prefLanguage, setPrefLanguage] = useState<string>('All');
  const [prefEducation, setPrefEducation] = useState<string>('All');

  const handleRequestMutualReveal = () => {
    if (mutualRevealRequested) return;
    setMutualRevealRequested(true);
    
    const reqMsg = {
      sender: 'system' as const,
      text: `🤝 You have requested a Mutual Identity Reveal. Once the other participant consents, verified contact numbers and real full names will unlock in this escrow tunnel.`,
      time: 'SYSTEM'
    };
    setSecuredMessages(prev => [...prev, reqMsg]);

    setTimeout(() => {
      setMutualRevealUnlocked(true);
      const pairedPeer = VERIFIED_CANDIDATES[activeCandidateIndex];
      const unlockMsg = {
         sender: 'system' as const,
         text: `🎉 INTEGRITY ESCROW UNLOCKED! Mutual consent verified.
         
📌 Real Profile Credentials:
• Full Name: ${pairedPeer.realName}
• Verified Phone Number: ${pairedPeer.realPhone}
• Verified Gmail: ${pairedPeer.realEmail}
• Higher Education: ${pairedPeer.education}
• Profession: ${pairedPeer.profession}
• Religion / Denomination: ${pairedPeer.religion}
• Primary Languages: ${pairedPeer.languages}
• Geographic Location: ${pairedPeer.city}, ${pairedPeer.country}
• Height Index: ${pairedPeer.height}
• Current Verification: Fayda National ID (100% Genuine, No Bots)`,
         time: 'SYSTEM'
      };
      setSecuredMessages(prev => [...prev, unlockMsg]);
    }, 2000);
  };

  // --- USER DIGITAL ID VERIFICATION STATUS ---
  const [verification, setVerification] = useState<VerificationData>(() => {
    const saved = localStorage.getItem('ez_user_verification');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      email: '',
      phone: '',
      digitalId: ''
    };
  });
  
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    return localStorage.getItem('ez_user_is_verified') === 'true';
  });

  const [registeringError, setRegisteringError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verification.fullName.trim()) {
      setRegisteringError('Full Name is required');
      return;
    }
    if (!verification.email.trim() || !verification.email.includes('@')) {
      setRegisteringError('Please enter a valid Gmail address');
      return;
    }
    if (!verification.phone.trim() || verification.phone.length < 9) {
      setRegisteringError('Please enter a valid Phone Number');
      return;
    }
    if (!verification.digitalId.trim() || verification.digitalId.length < 5) {
      setRegisteringError('Please enter a valid National Digital ID (Fayda / Ethio ID)');
      return;
    }

    setRegisteringError(null);
    localStorage.setItem('ez_user_verification', JSON.stringify(verification));
    localStorage.setItem('ez_user_is_verified', 'true');
    setIsVerified(true);
    alert('🎉 Digital ID and User Verification Successful! You now have FREE unlimited access to all Lottery Draws & Matchmaking services.');
  };

  const handleResetVerification = () => {
    if (confirm('Are you sure you want to reset your verified credentials?')) {
      localStorage.removeItem('ez_user_verification');
      localStorage.removeItem('ez_user_is_verified');
      setVerification({ fullName: '', email: '', phone: '', digitalId: '' });
      setIsVerified(false);
    }
  };

  // --- SUNDAY MATCHMAKING LOGIC & SCREEN SHIELD ---
  const triggerScreenshotBlackout = () => {
    setScreenshotAlertTriggered(true);
    setTimeout(() => {
      setScreenshotAlertTriggered(false);
    }, 4000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Catch PrintScreen (PrtScn), copy combinations or standard screenshot shortcuts
      if (
        e.key === 'PrintScreen' || 
        (e.ctrlKey && e.key === 's') || 
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))
      ) {
        e.preventDefault();
        triggerScreenshotBlackout();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      // Prevent extracting chat copy
      if (anonymousChatOpen) {
        e.preventDefault();
        triggerScreenshotBlackout();
      }
    };

    const handleVisibilityChange = () => {
      // Secure-flag simulation: blank screen when tab is blurred or changed
      if (document.hidden && anonymousChatOpen) {
        triggerScreenshotBlackout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [anonymousChatOpen]);

  // Expose active countdown timer
  useEffect(() => {
    let secs = 86292; // around 23 hours 58 mins
    const timer = setInterval(() => {
      secs = secs - 1;
      if (secs <= 0) secs = 86400;
      const hours = Math.floor(secs / 3600);
      const mins = Math.floor((secs % 3600) / 60);
      const remainingSecs = secs % 60;
      setMatchCountdown(`${hours} hrs ${mins} mins ${remainingSecs} secs remaining`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartPairing = () => {
    if (!isVerified) {
      alert('⚠️ Verification Required: Only verified digital ID holders are eligible to participate in Sunday Matchmaking to prevent fraud.');
      const reg = document.getElementById('id-registration');
      if (reg) reg.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setMatchInProgress(true);
    
    setTimeout(() => {
      const selectedIndex = Math.floor(Math.random() * VERIFIED_CANDIDATES.length);
      setActiveCandidateIndex(selectedIndex);
      setMatchPaired(true);
      setMatchInProgress(false);
      localStorage.setItem('ez_match_paired', 'true');

      const pairedPeer = VERIFIED_CANDIDATES[selectedIndex];
      const welcomeChat = [
        { 
          sender: 'system' as const, 
          text: `🛡️ SECURITY SYSTEM ACTIVE: Anonymous chat initialized. Real names, direct phone numbers, and physical profiles are hidden for 24 hours. Your alias is "User 104" and your peer is "${pairedPeer.alias}". Screen grab / recording / copying is strictly blocked.`, 
          time: 'SYSTEM' 
        },
        ...pairedPeer.icebreakers.map(ib => ({ sender: ib.sender as 'them' | 'me' | 'system', text: ib.text, time: ib.time }))
      ];
      setSecuredMessages(welcomeChat);
      localStorage.setItem('ez_secured_messages', JSON.stringify(welcomeChat));
    }, 2400); // pairing scanning animation
  };

  const handleSendSecuredMessage = () => {
    if (!chatInputText.trim()) return;

    const userMsg = {
      sender: 'me' as const,
      text: chatInputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMsgs = [...securedMessages, userMsg];
    setSecuredMessages(nextMsgs);
    setChatInputText('');
    localStorage.setItem('ez_secured_messages', JSON.stringify(nextMsgs));

    // Simulate verified candidate typing and replying
    setIsThemTyping(true);
    setTimeout(() => {
      const pairedPeer = VERIFIED_CANDIDATES[activeCandidateIndex];
      const botReplyText = pairedPeer.responses[responseIndex % pairedPeer.responses.length];
      setResponseIndex(prev => prev + 1);

      const botMsg = {
        sender: 'them' as const,
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsThemTyping(false);
      const afterResponses = [...nextMsgs, botMsg];
      setSecuredMessages(afterResponses);
      localStorage.setItem('ez_secured_messages', JSON.stringify(afterResponses));
    }, 1500);
  };

  const handleResetMatch = () => {
    if (confirm('Are you sure you want to exit and disconnect? The anonymous chat log and pair assignment will be deleted.')) {
      setMatchPaired(false);
      setAnonymousChatOpen(false);
      setSecuredMessages([]);
      localStorage.removeItem('ez_match_paired');
      localStorage.removeItem('ez_secured_messages');
    }
  };

  // --- LOTTERY RAFFLE ITEMS STATE ---
  const [raffles, setRaffles] = useState<RaffleItem[]>(() => {
    const saved = localStorage.getItem('ez_raffles_list');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'raf_cars',
        category: 'Cars',
        title: '2026 Suzuki Dzire',
        titleAm: 'ሱዙኪ መኪና',
        description: 'Features brand new fuel-efficient setup, modern infotainment, and licensed registration plated key delivery.',
        descriptionAm: 'ደረጃውን የጠበቀና ነዳጅ ቆጣቢ የሆነ አዲስ መኪና ከሙሉ የማስረከቢያ ሰነዶች ጋር።',
        totalSpots: 3000,
        spotsLeft: 1412,
        image: 'https://images.unsplash.com/photo-1608508060274-aa04822b2742?auto=format&fit=crop&q=80&w=600',
        estimatedValue: '18,500,000 ETB',
        ticketPrice: 20 // Cost per spot in ETB
      },
      {
        id: 'raf_houses',
        category: 'Houses',
        title: 'Modern G+1 Villa in Addis Ababa',
        titleAm: 'ዘመናዊ ቪላ ቤት',
        description: 'Architect-designed luxury residential multi-level villa with security gated system and serene garden landscape.',
        descriptionAm: 'በአዲስ አበባ ምቹ መኖሪያ ሰፈር የሚገኝ፣ ደረጃውን የጠበቀ እና በከጨማሪ ጥራት የተገነባ ዘመናዊ ባለ አንድ ፎቅ ቪላ።',
        totalSpots: 5000,
        spotsLeft: 4510,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
        estimatedValue: '32,000,000 ETB',
        ticketPrice: 100 // Cost per spot in ETB
      },
      {
        id: 'raf_electronics',
        category: 'Electronics',
        title: 'iPhone 17 Pro Max & PlayStation 5 Bundle',
        titleAm: 'የኤሌክትሮኒክስ እቃዎች እጫ',
        description: 'The ultimate entertainment and productivity package including the revolutionary future flagship phone and powerful gaming console.',
        descriptionAm: 'የመጫረሻውን የቴክኖሎጂ ፍላጎት የሚያረካ የአይፎን 17 ፕሮ ማክስ እና የፕሌይስቴሽን 5 ጥቅል መጫወቻ።',
        totalSpots: 1800,
        spotsLeft: 310,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
        estimatedValue: '1,200,000 ETB',
        ticketPrice: 10 // Cost per spot in ETB
      },
      {
        id: 'raf_clothing',
        category: 'Clothing',
        title: 'Designer Clothing Voucher (50,000 ETB)',
        titleAm: 'የልብስ እና ፋሽን ሽልማት',
        description: 'Custom apparel credit fully redeemable at leading local fashion brands and handcraft luxury design houses.',
        descriptionAm: 'ከተመረጡ ምርጥ የሀገር ውስጥ የፋሽን መደብሮች ልብሶችን ለመግዛት የሚያስችል የመቶ ፐርሰንት ቅናሽ ቫውቸር።',
        totalSpots: 1000,
        spotsLeft: 95, // closing soon! (<10% spots left)
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
        estimatedValue: '50,000 ETB',
        ticketPrice: 5 // Cost per spot in ETB
      },
      {
        id: 'raf_everything',
        category: 'Everything',
        title: 'Premium Dubai Grand Holiday & Cash Bundle',
        titleAm: 'የዱባይ ጉዞ እና የጥሬ ገንዘብ ጥቅል',
        description: 'Includes 7-Day All-Inclusive Dubai First-Class trip for two, 5-Star resort stay, shopping allowance, and 1,000,000 ETB emergency pocket cash.',
        descriptionAm: 'የ7 ቀን የጥቅል ዱባይ የመጀመሪያ ማዕረግ ጉዞ፣ ለሁለት ሰዎች የ5 ኮከብ ሆቴል፣ የገበያ አበል እና 1,000,000 ብር የኪስ ገንዘብን ያካተተ።',
        totalSpots: 4000,
        spotsLeft: 1240,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600',
        estimatedValue: '3,800,000 ETB',
        ticketPrice: 50 // Cost per spot in ETB
      }
    ];
  });

  // Save raffles list change
  useEffect(() => {
    localStorage.setItem('ez_raffles_list', JSON.stringify(raffles));
  }, [raffles]);

  // --- PLATFORM EXTRA SECURE & GAMIFIED STATE LAYERS ---
  const [currencyDisplay, setCurrencyDisplay] = useState<'ETB' | 'points'>(() => {
    return (localStorage.getItem('ez_currency_display') as 'ETB' | 'points') || 'ETB';
  });

  const [freeSpotTokens, setFreeSpotTokens] = useState<number>(() => {
    const saved = localStorage.getItem('ez_free_spot_tokens');
    return saved ? parseInt(saved, 10) : 2; // Default 2 free spot tokens for everyone
  });

  const [referralsCount, setReferralsCount] = useState<number>(() => {
    const saved = localStorage.getItem('ez_referrals_count');
    return saved ? parseInt(saved, 10) : 4; // Simulated default referrals
  });

  const [bookedSpots, setBookedSpots] = useState<{ [key: string]: number[] }>(() => {
    const saved = localStorage.getItem('ez_booked_spots');
    return saved ? JSON.parse(saved) : {};
  });

  const [pastWinners, setPastWinners] = useState<{
    id: string;
    title: string;
    category: string;
    winnerName: string;
    maskedPhone: string;
    image: string;
    estimatedValue: string;
    avatarTxt: string;
  }[]>(() => {
    const saved = localStorage.getItem('ez_past_winners');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'past_1',
        title: '2025 Suzuki Swift Hybrid',
        category: 'Cars',
        winnerName: 'Kebede Yilma',
        maskedPhone: '+251 911 **** 19',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=300',
        estimatedValue: '2,900,000 ETB',
        avatarTxt: 'KY'
      },
      {
        id: 'past_2',
        title: 'Sony Alpha 7R V Elite Camera',
        category: 'Electronics',
        winnerName: 'Lidya Solomon',
        maskedPhone: '+251 912 **** 44',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300',
        estimatedValue: '380,000 ETB',
        avatarTxt: 'LS'
      }
    ];
  });

  // Save states
  useEffect(() => {
    localStorage.setItem('ez_currency_display', currencyDisplay);
  }, [currencyDisplay]);

  useEffect(() => {
    localStorage.setItem('ez_free_spot_tokens', freeSpotTokens.toString());
  }, [freeSpotTokens]);

  useEffect(() => {
    localStorage.setItem('ez_referrals_count', referralsCount.toString());
  }, [referralsCount]);

  useEffect(() => {
    localStorage.setItem('ez_booked_spots', JSON.stringify(bookedSpots));
  }, [bookedSpots]);

  useEffect(() => {
    localStorage.setItem('ez_past_winners', JSON.stringify(pastWinners));
  }, [pastWinners]);

  // --- SECURITY FLOOD PREVENTION BOT BAN COOLDOWN ---
  const [fraudLogs, setFraudLogs] = useState<number[]>([]);
  const [isBotBanned, setIsBotBanned] = useState<boolean>(() => {
    return localStorage.getItem('ez_fraud_banned') === 'true';
  });

  // --- DYNAMIC PREFERENCES / OVERRIDES ---
  const [batterySaver, setBatterySaver] = useState<boolean>(() => {
    return localStorage.getItem('ez_battery_saver') === 'true';
  });

  const [useFreeTokenToggle, setUseFreeTokenToggle] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CARS' | 'HOUSES' | 'ELECTRONICS' | 'VOUCHERS'>('ALL');
  const [bulkCountMap, setBulkCountMap] = useState<{ [raffleId: string]: 1 | 5 | 10 }>({});
  
  // Scratch card recharge inputs
  const [scratchCardPin, setScratchCardPin] = useState<string>('');
  const [scratchSuccessMsg, setScratchSuccessMsg] = useState<string | null>(null);
  
  const [birthdayModalOpen, setBirthdayModalOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  
  // Simulated connection status
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow'>('fast');

  // Trigger floating toast helper
  const triggerToast = (text: string) => {
    setToastNotification(text);
    setTimeout(() => {
      setToastNotification(null);
    }, 3800);
  };

  // Synthetic beep system chimes
  const playAudioChime = (type: 'success' | 'win' | 'scratch') => {
    if (batterySaver) return; // Save audio processing battery
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.36); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);
        osc.start(now);
        osc.stop(now + 0.75);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'scratch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.22);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      console.log('Audio chime blocked by browser autonomy rule', e);
    }
  };

  // Connection speed auto-fluctuation (To manage client expectations smoothly)
  useEffect(() => {
    const inter = setInterval(() => {
      setConnectionSpeed(prev => (prev === 'fast' ? 'slow' : 'fast'));
    }, 14000); // toggle every 14 seconds
    return () => clearInterval(inter);
  }, []);

  // Calendar birthday auto-celebration loop checks as of today June 18, 2026
  useEffect(() => {
    const celebrated = sessionStorage.getItem('ez_birthday_celebrated');
    if (!celebrated && isVerified) {
      setBirthdayModalOpen(true);
      sessionStorage.setItem('ez_birthday_celebrated', 'true');
    }
  }, [isVerified]);

  const [participatedRaffles, setParticipatedRaffles] = useState<string[]>(() => {
    const saved = localStorage.getItem('ez_participated_raffles');
    return saved ? JSON.parse(saved) : [];
  });

  const [simulationWinner, setSimulationWinner] = useState<{
    raffleTitle: string;
    winnerName: string;
    ticketNum: string;
    isUser: boolean;
  } | null>(null);

  const [isDrawingId, setIsDrawingId] = useState<string | null>(null);

  // Dynamic Spot reserving ticker simulated actions
  const [recentReservers, setRecentReservers] = useState<{ name: string; count: number; time: string }[]>([
    { name: 'Abdi K.', count: 2, time: '2 mins ago' },
    { name: 'Salem Yohannes', count: 5, time: 'just now' },
    { name: 'Tewodros B.', count: 1, time: '5 mins ago' }
  ]);

  useEffect(() => {
    const names = ['Bekele M.', 'Rahel D.', 'Cherenet A.', 'Samrawit L.', 'Girma W.', 'Hirut T.'];
    const interval = setInterval(() => {
      if (batterySaver) return; // Stop heavy pre-fetches and tickers
      
      // Simulate random participant booking
      const newBook = {
        name: names[Math.floor(Math.random() * names.length)],
        count: Math.floor(Math.random() * 3) + 1,
        time: 'just now'
      };
      setRecentReservers(prev => [newBook, ...prev.slice(0, 2)]);

      setRaffles(prev => prev.map(raf => {
        if (raf.spotsLeft > 5) {
          const booked = Math.max(Math.floor(Math.random() * 2) + 1, 1);
          // If total spots has hit limit let's not overflow
          return { ...raf, spotsLeft: Math.max(raf.spotsLeft - booked, 2) };
        }
        return raf;
      }));
    }, 7000);

    return () => clearInterval(interval);
  }, [batterySaver]);

  // Handle Spot Reservation Booking Command
  const handleParticipate = (raffleId: string) => {
    if (!isVerified) {
      alert('⚠️ Verification Required: Registration is 100% Free! Please fill out your digital ID registration below first.');
      return;
    }

    const raf = raffles.find(r => r.id === raffleId);
    if (!raf) return;

    if (raf.spotsLeft <= 0) {
      alert('❌ Standard Spots Full: This asset is completely booked! Standby for immediate Admin drawer.');
      return;
    }

    // Get bulk select multiplier
    const multiplyBy = bulkCountMap[raffleId] || 1;
    if (raf.spotsLeft < multiplyBy) {
      alert(`⚠️ Oops! Only ${raf.spotsLeft} spots are remaining. Reduce selection count.`);
      return;
    }

    // Calculate total cost
    const spotPrice = raf.ticketPrice;
    const totalCost = spotPrice * multiplyBy;

    if (useFreeTokenToggle) {
      // Use Free Spot Tokens
      if (freeSpotTokens < multiplyBy) {
        alert(`⚠️ Insufficient Free Tokens! You need ${multiplyBy} free tokens but only have ${freeSpotTokens}. Use standard wallet balance instead!`);
        return;
      }
      
      // Zero-wallet balanced reservation loop
      setFreeSpotTokens(prev => Math.max(prev - multiplyBy, 0));
      triggerToast(`🎉 Reserved ${multiplyBy} Spot(s) for FREE using Spot Tokens!`);
    } else {
      // Wallet Balance Deduction
      if (walletBalance < totalCost) {
        alert(`❌ Insufficient Wallet Balance!\nYour balance is ${walletBalance} ETB. Booking ${multiplyBy} spots requires ${totalCost} ETB.\nPlease use Scratch Card Recharge or add funds.`);
        return;
      }

      // Secure physical wallet deduction
      setWalletBalance(prev => Math.max(prev - totalCost, 0));
      triggerToast(`💸 Success! Deducted ${totalCost} ETB for ${multiplyBy} spot reservation(s).`);
    }

    // Assign verifiable individual spot numbers in real-time
    const currentBooked = bookedSpots[raffleId] || [];
    const freshlyAssigned: number[] = [];
    for (let i = 0; i < multiplyBy; i++) {
      // Generate a spot number (e.g. between 1 and totalSpots)
      const mockSpotNo = Math.floor(Math.random() * raf.totalSpots) + 1;
      freshlyAssigned.push(mockSpotNo);
    }
    
    setBookedSpots(prev => ({
      ...prev,
      [raffleId]: [...currentBooked, ...freshlyAssigned]
    }));

    // Save tracking list
    if (!participatedRaffles.includes(raffleId)) {
      const nextParticipated = [...participatedRaffles, raffleId];
      setParticipatedRaffles(nextParticipated);
      localStorage.setItem('ez_participated_raffles', JSON.stringify(nextParticipated));
    }

    // Reduce remaining spots left
    setRaffles(prev => prev.map(r => {
      if (r.id === raffleId) {
        return { ...r, spotsLeft: Math.max(r.spotsLeft - multiplyBy, 2) };
      }
      return r;
    }));

    playAudioChime('success');
  };

  // Secure random picker selector simulation for Live Draw button
  const handleSimulateDraw = (item: RaffleItem) => {
    if (isDrawingId) return;
    setIsDrawingId(item.id);
    setSimulationWinner(null);
    setShowConfetti(false);

    playAudioChime('scratch');

    setTimeout(() => {
      const currentBooked = bookedSpots[item.id] || [];
      const userHasBooked = currentBooked.length > 0;
      
      // Veritable random pick sequence
      const isUserWinner = userHasBooked && Math.random() < 0.50; // high simulation fun trigger!

      let winnerName = '';
      let isUser = false;
      let winningSpotNum = Math.floor(Math.random() * item.totalSpots) + 1;
      let ticketNum = `SPOT-#${winningSpotNum}`;

      if (isUserWinner) {
        winnerName = `${verification.fullName} (You)`;
        isUser = true;
        // User gets winning spots selected
        if (currentBooked.length > 0) {
          winningSpotNum = currentBooked[Math.floor(Math.random() * currentBooked.length)];
          ticketNum = `Spot #${winningSpotNum}`;
        }
        
        playAudioChime('win');
        setShowConfetti(true);
        triggerToast("🏆 GRANDEUR VICTORY CAPTURED! Check your profile!");
      } else {
        const competitors = ['Abebe Kebede', 'Mulugeta Tesfaye', 'Selamawit Girma', 'Hirut Yohannes', 'Solomon Belay', 'Lidya Alamu'];
        winnerName = competitors[Math.floor(Math.random() * competitors.length)];
        isUser = false;
      }

      setSimulationWinner({
        raffleTitle: item.title,
        winnerName,
        ticketNum,
        isUser
      });

      // Move campaign to Past Winners Rolling Transparent logs
      const generatedPast = {
        id: `past_draw_${Date.now()}`,
        title: item.title,
        category: item.category,
        winnerName: winnerName,
        maskedPhone: isUser ? verification.phone : `+251 9${Math.floor(10 + Math.random() * 89)} **** ${Math.floor(10 + Math.random() * 89)}`,
        image: item.image,
        estimatedValue: item.estimatedValue,
        avatarTxt: winnerName.charAt(0) + winnerName.split(' ').pop()?.charAt(0)
      };

      setPastWinners(prev => [generatedPast, ...prev]);

      // Refill campaign with remaining capacity reset
      setRaffles(prev => prev.map(raf => {
        if (raf.id === item.id) {
          return { ...raf, spotsLeft: Math.floor(raf.totalSpots * 0.82) }; // refill spots
        }
        return raf;
      }));

      // Flush user bookings for that specific item
      setBookedSpots(prev => {
        const copied = { ...prev };
        delete copied[item.id];
        return copied;
      });

      setParticipatedRaffles(prev => prev.filter(id => id !== item.id));

      setIsDrawingId(null);
    }, 2800);
  };

  // Smart Auto-Refund process for campaign timelines expired
  const initiateCampaignAutoRefund = (item: RaffleItem) => {
    const userSpots = bookedSpots[item.id] || [];
    if (userSpots.length === 0) {
      alert(`Safety check complete: No user reserves found in "${item.title}". No refunds needed.`);
      return;
    }

    const refundedAmount = userSpots.length * item.ticketPrice;
    setWalletBalance(prev => prev + refundedAmount);

    // Cancel spots booking
    setBookedSpots(prev => {
      const copied = { ...prev };
      delete copied[item.id];
      return copied;
    });

    setParticipatedRaffles(prev => prev.filter(id => id !== item.id));

    // Reset spots left
    setRaffles(prev => prev.map(r => {
      if (r.id === item.id) {
        return { ...r, spotsLeft: r.totalSpots }; // completely empty
      }
      return r;
    }));

    playAudioChime('success');
    alert(`⚡ [SAFETY SCHEDULER: REFUND GRANTED]\n\nThe G+1 Villa campaign expired prior to target fill capacity.\n\nSimulating 100% money return: Credited ${refundedAmount} ETB back to your wallet balance.\n\nLedger Trace: "ዕጣው ስለተሰረዘ የተመለሰ ክፍያ" (100% Campaign cancelled refund)`);
  };

  // Physical Scratch Card Code Processing Simulation
  const handleScratchRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchCardPin.trim()) {
      alert('Please enter a 12-digit PIN code.');
      return;
    }

    // Match simulated scratch card denominations
    let valueToAdd = 0;
    if (scratchCardPin === '100100100100') {
      valueToAdd = 100;
    } else if (scratchCardPin === '500500500500') {
      valueToAdd = 500;
    } else if (scratchCardPin === '100010001000') {
      valueToAdd = 1000;
    } else {
      alert('❌ Invalid Scratch voucher PIN. Try: "100100100100" (100 ETB), "500500500500" (500 ETB), or "100010001000" (1000 ETB)');
      return;
    }

    setWalletBalance(prev => prev + valueToAdd);
    playAudioChime('scratch');
    setScratchSuccessMsg(`🎉 Successfully scratched & revealed! Credited +${valueToAdd} ETB directly to your wallet!`);
    setScratchCardPin('');
    triggerToast(`💰 Scratch Card Credited: +${valueToAdd} ETB`);
    setTimeout(() => setScratchSuccessMsg(null), 5000);
  };

  // Viral Telegram Share builder mechanics
  const handleTelegramSharePrompt = (item: RaffleItem) => {
    const textShare = `የ ${item.title} መኪና በነፃ ለመውሰድ እዚህ ሊንክ ላይ ተጭናችሁ ተመዝገቡ! https://everyzone.app/ref?id=${verification.digitalId || 'USER_ID'}`;
    const encText = encodeURIComponent(textShare);
    const mockWindowStr = `https://t.me/share/url?url=https://everyzone.app/&text=${encText}`;
    
    // Copy referral URL and notify
    navigator.clipboard?.writeText(textShare).then(() => {
      triggerToast('📋 Referral Link Copied for Telegram!');
    });

    alert(`📤 [Dynamic Telegram Share Deep-Link Builder]\n\nGenerating post message:\n\n"${textShare}"\n\n(Referral code bound to user's national ID. Redirected to custom share view).`);
  };

  // Fraud prevention simulation: clicking referral rapidly locks device
  const handleSimulateNewReferral = () => {
    if (isBotBanned) {
      alert('🔒 [SECURITY ALERT] This device is flagged for BOT_FLOOD SUSPECT. Access disabled.');
      return;
    }

    const nowSecs = Date.now();
    const cleanLogs = fraudLogs.filter(t => nowSecs - t < 600000); // 10 minutes filter
    const nextLogs = [...cleanLogs, nowSecs];
    setFraudLogs(nextLogs);

    if (nextLogs.length > 5) {
      setIsBotBanned(true);
      localStorage.setItem('ez_fraud_banned', 'true');
      alert('🚨 🛡️ [FRAUD ENGINE BANNED: SUSPECTED_BOT]\n\nSystem registered more than 5 collections within 10 minutes from your temporary fingerprint.\n\nCollection paused for security verification.');
      return;
    }

    // Award refer token
    setReferralsCount(prev => prev + 1);
    setFreeSpotTokens(prev => prev + 1);
    playAudioChime('success');
    triggerToast('👥 Refer Token Granted: 1 Free Token!');
  };

  // Reset bot ban tag
  const handleResetBotBan = () => {
    setIsBotBanned(false);
    localStorage.removeItem('ez_fraud_banned');
    setFraudLogs([]);
    triggerToast('🛡️ Security Sandbox Reset.');
  };

  // --- SUNDAY MATCHMAKING PORTAL STATE ---
  const [matchName1, setMatchName1] = useState('');
  const [matchName2, setMatchName2] = useState('');
  const [matchCalcResult, setMatchCalcResult] = useState<{
    score: number;
    title: string;
    description: string;
    descriptionAm: string;
  } | null>(null);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  const calculateCompatibility = () => {
    if (!isVerified) {
      alert('⚠️ Registration Required: Matchmaking services are 100% Free! Please complete your Digital ID registration below first.');
      return;
    }

    if (!matchName1.trim() || !matchName2.trim()) {
      alert('⚠️ Please enter both individual names to verify compatibility.');
      return;
    }

    setIsMatchingLoading(true);
    setMatchCalcResult(null);

    setTimeout(() => {
      // Deterministic but fun score based on characters
      const combined = (matchName1 + matchName2).toLowerCase().trim();
      let charValSum = 0;
      for (let i = 0; i < combined.length; i++) {
        charValSum += combined.charCodeAt(i);
      }
      const score = 55 + (charValSum % 41); // 55% to 95% compatibility range

      let title = '';
      let description = '';
      let descriptionAm = '';

      if (score >= 85) {
        title = '💞 Perfect Match / ሰማያዊ ተዛማጅ';
        description = 'Exceptional astrological, traditional values, and cultural compatibility. Perfect alignment for a beautiful life together!';
        descriptionAm = 'እጅግ በጣም ጥሩ የባህል፣ እሴቶች እና የስብዕና መጣጣም። የሚያምር የወደፊት ሕይወትን አብሮ ለመገንባት ፍጹም ዝግጁነት ያለው ጥምረት!';
      } else if (score >= 70) {
        title = '💖 Harmonious / ተስማሚ ጥቆማ';
        description = 'Solid base with great mutual respect and understanding. Highly recommended for a lasting, prosperous relationship.';
        descriptionAm = 'በጋራ መከባበር እና መግባባት ላይ የተመሰረተ። ዘላቂ እና የበለፀገ ግንኙነት ለመፍጠር በከፍተኛ ሁኔታ ይመከራል።';
      } else {
        title = '⭐ Potential / መካከለኛ ተኳሃኝነት';
        description = 'A relationship that will grow strong with open dedication, patience, and shared cultural discoveries.';
        descriptionAm = 'በትዕግስት፣ በግልፅ ውይይት እና በባህላዊ መስተጋብሮች ሂደት ሊጠናከር የሚችል ግንኙነት።';
      }

      setMatchCalcResult({ score, title, description, descriptionAm });
      setIsMatchingLoading(false);
    }, 1000); // 1s response time - fast & snappy
  };

  return (
    <div className="space-y-4 pb-12 select-none">
      
      {/* 100% FREE ACCESS BANNER */}
      <div className={`p-4 rounded-3xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ${
        isVerified 
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-850' 
          : 'bg-amber-500/10 border-amber-500/30 text-amber-850'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-2xl shrink-0 ${isVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
            <ShieldCheck size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider font-sans">
                Lottery & Matchmaking Zone
              </span>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                isVerified ? 'bg-emerald-150 text-emerald-800' : 'bg-amber-150 text-amber-800'
              }`}>
                {isVerified ? 'Verified Free Access' : 'Verification Required'}
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed mt-1 ${isDarkMode ? 'text-zinc-300' : 'text-stone-600'}`}>
              Regular user participation in high-stakes lottery raffles and matching portals is 
              <strong> 100% FREE</strong>. No monthly subscriptions. Just verify with your 
              National Digital ID (Fayda) below to activate lifetime access.
            </p>
          </div>
        </div>

        {isVerified && (
          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shrink-0 text-emerald-700 text-xs font-bold leading-none">
            <UserCheck size={13} />
            <span>ID: {verification.digitalId}</span>
          </div>
        )}
      </div>

      {/* CORE ZONE NAVIGATION TABS (Removed for pure Matchmaking) */}

      {/* TABS CANVAS */}
      <AnimatePresence mode="wait">
        {subTab === 'lottery' ? (
          <motion.div
            key="lottery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="space-y-6"
          >
            {/* FLOATING CONFETTI OVERLAY CELEBRATION */}
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" />
                <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-3xl border-2 border-yellow-400 shadow-2xl max-w-sm text-center space-y-4 animate-bounce pointer-events-auto">
                  <span className="text-4xl">🏆</span>
                  <h3 className="text-base font-black text-stone-950 dark:text-white font-serif">የድል አሸናፊ መልዕክት!</h3>
                  <p className="text-xs text-stone-600 dark:text-zinc-300">
                    እንኳን ደስ አልዎት! የዕጣውን ባለቤትነት በተሳካ ሁኔታ አረጋግጠዋል። ሰነዶቹ ወደ መገለጫዎ ገብተዋል።
                  </p>
                  <button 
                    onClick={() => setShowConfetti(false)}
                    className="w-full bg-[#1E3A1A] text-white py-2 rounded-xl text-xs font-bold"
                  >
                    እሺ ቀጥል (Close)
                  </button>
                </div>
              </div>
            )}

            {/* BIRTHDAY MODAL CELEBRATION */}
            {birthdayModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-950 p-6 rounded-3xl max-w-sm border-2 border-amber-400 shadow-2xl text-center space-y-4 relative animate-scaleUp">
                  <div className="absolute top-2.5 right-2.5">
                    <button onClick={() => setBirthdayModalOpen(false)} className="bg-stone-200 dark:bg-zinc-850 p-1.5 rounded-full text-stone-700 dark:text-zinc-300">
                      <X size={14} />
                    </button>
                  </div>
                  <span className="text-4xl block animate-bounce">🎁</span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-amber-900 dark:text-amber-400 font-serif">
                      መልካም ልደት ለእርስዎ!
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-zinc-300 leading-relaxed">
                      "🎁 መልካም ልደት! ዛሬ 1 የዕጣ መግቢያ ቦታ በነፃ ስጦታ ተበርክቶልዎታል!"
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-zinc-900/65 p-2 rounded-xl border border-amber-300 text-xs font-bold font-mono text-amber-800 dark:text-amber-300">
                    🎁 Birthday Token Credited
                  </div>
                  <button
                    onClick={() => {
                      setFreeSpotTokens(prev => prev + 1);
                      setBirthdayModalOpen(false);
                      triggerToast('🎁 Birthday Token Credited successfully!');
                      playAudioChime('success');
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl py-2.5 text-xs font-black uppercase transition-all shadow hover:opacity-95"
                  >
                    ነፃ የዕጣ ቦታ ተቀበል (Claim Gift)
                  </button>
                </div>
              </div>
            )}

            {/* SYSTEM FLOATING TOAST NOTIFICATION */}
            {toastNotification && (
              <div className="fixed bottom-16 right-4 z-50 bg-[#1E3A1A] border-2 border-[#C5A059] text-white px-4 py-3 rounded-2xl shadow-2xl max-w-xs flex items-center gap-2.5 animate-slideUp">
                <Sparkles size={16} className="text-amber-400 shrink-0" />
                <span className="text-[11.5px] font-black">{toastNotification}</span>
              </div>
            )}

            {/* SLOW NETWORK SPEED WARNING INDICATOR */}
            {connectionSpeed === 'slow' && (
              <div className="p-3 bg-red-550/10 border border-red-500/20 text-red-650 dark:text-red-400 rounded-2xl text-[11px] font-bold flex items-center gap-2 animate-pulse">
                <AlertCircle size={15} className="shrink-0 text-red-500" />
                <span>የማንነት ማገናኛ ፍጥነት ደካማ ነው! (Network rate latency: Simulation 3G weak coverage limits)</span>
              </div>
            )}

            {/* WALLET BALANCE HUB SHEET & CURRENCY DISPLAY METRICS */}
            <div className="bg-gradient-to-b from-[#FAF8F5] to-white dark:from-zinc-950 dark:to-zinc-900 border border-stone-200 dark:border-zinc-850 p-4 rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase tracking-wider text-stone-400 font-extrabold font-mono">የኪስ ኮፒ / My Balance</p>
                  <div className="flex items-baseline gap-1">
                    {currencyDisplay === 'ETB' ? (
                      <span className="text-xl font-black text-stone-900 dark:text-white font-mono">
                        {walletBalance.toLocaleString()} <span className="text-xs text-stone-500">ETB</span>
                      </span>
                    ) : (
                      <span className="text-xl font-black text-[#C5A059] font-mono">
                        {(walletBalance * 10).toLocaleString()} <span className="text-xs text-stone-400">PTS</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const next = currencyDisplay === 'ETB' ? 'points' : 'ETB';
                    setCurrencyDisplay(next);
                    playAudioChime('success');
                    triggerToast(`Display value toggled to ${next.toUpperCase()}`);
                  }}
                  className="bg-stone-100 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-800 transition flex items-center gap-1.5 text-stone-700 dark:text-zinc-300"
                >
                  <RefreshCw size={11} />
                  <span>{currencyDisplay === 'points' ? 'Display ETB' : 'Display Points'}</span>
                </button>
              </div>

              {/* STAT COUNTERS AND GAMIFIED TOKENS */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/90 dark:bg-zinc-950 p-2.5 rounded-2xl border border-stone-150 dark:border-zinc-850 flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                    <Award size={14} />
                  </div>
                  <div>
                    <p className="text-[8.5px] text-stone-400 font-bold uppercase">ነፃ ዕድል (Spot Tokens)</p>
                    <p className="text-xs font-black text-stone-900 dark:text-white font-mono">🎫 {freeSpotTokens} Available</p>
                  </div>
                </div>

                <div className="bg-white/90 dark:bg-zinc-950 p-2.5 rounded-2xl border border-stone-150 dark:border-[#132511] flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-[8.5px] text-stone-400 font-bold uppercase">ሪፈራል (Referrals)</p>
                    <p className="text-xs font-black text-stone-900 dark:text-white font-mono">👥 {referralsCount} People Joined</p>
                  </div>
                </div>
              </div>

              {/* DYNAMIC SHARING LOOP INTEGRATION & SOCIAL DEEP LINKS */}
              <div className="bg-[#FAF8F5] dark:bg-zinc-900/50 p-3 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-800 space-y-2">
                <p className="text-[10px] font-bold text-stone-700 dark:text-zinc-300">
                  🔗 ሪፈራል ሊንክ መከታተያ / Sharing Impact Tracker
                </p>
                <div className="text-[10.5px] text-stone-600 dark:text-zinc-400 space-y-1">
                  <p>በእርስዎ ሊንክ የገቡ ሰዎች፦ <strong className="text-stone-950 dark:text-white font-mono">{referralsCount}</strong> | ያገኙት የነፃ ዕድል መግቢያ፦ <strong className="text-stone-950 dark:text-white font-mono">{freeSpotTokens}</strong></p>
                  <p className="text-[9.5px] text-stone-400 italic">Every new friend sign-up awards you 1 Free Spot Token to bypass ETB balances in any campaign!</p>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={handleSimulateNewReferral}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-stone-800 dark:text-white text-[10.5px] py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 font-bold transition transition active:scale-95"
                  >
                    👥 Invite Friend Simulator
                  </button>
                  {isBotBanned && (
                    <button
                      onClick={handleResetBotBan}
                      className="bg-red-600 text-white hover:bg-red-700 text-[10px] px-2.5 py-1.5 rounded-lg font-bold"
                    >
                      Banned: Reset Sandbox
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* DYNAMIC VOUCHER SCRATCH-CARD RECHARGE SIMULATOR */}
            <div className="bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 p-4 rounded-3xl space-y-3.5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🪙</span>
                <h4 className="text-xs font-black font-serif text-stone-900 dark:text-white uppercase tracking-tight">
                  ካርድ መቧጨሪያ ተርሚናል / Card Scratch Recharge
                </h4>
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed dark:text-zinc-400">
                Type our local scratch voucher codes to physically credit your wallet balance offline.
              </p>

              <form onSubmit={handleScratchRechargeSubmit} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Demo Codes: 100100100100 or 500500500500"
                  value={scratchCardPin}
                  onChange={(e) => setScratchCardPin(e.target.value)}
                  className="flex-1 bg-white dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 px-3 py-2 rounded-xl text-[10.5px] font-mono focus:outline-none focus:ring-1 focus:ring-[#1E3A1A] text-stone-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="bg-[#1E3A1A] hover:opacity-90 text-white rounded-xl px-4 py-2 text-[10.5px] font-black transition active:scale-95 shrink-0"
                >
                  ቧጭረው (Scratch Voucher)
                </button>
              </form>

              {scratchSuccessMsg && (
                <div className="p-2.5 bg-emerald-550/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-[10.5px] font-bold">
                  {scratchSuccessMsg}
                </div>
              )}
            </div>

            {/* USER RECENTLY RESERVED SPOTS WIDGET (የእኔ ንቁ ዕጣዎች) */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold font-mono flex items-center gap-1.5">
                <span>የእኔ ንቁ ዕጣዎች / My Active Spot Bookings</span>
                <span className="bg-stone-150 h-1.5 w-1.5 rounded-full inline-block" />
              </p>

              {Object.keys(bookedSpots).length === 0 ? (
                <p className="text-[10.5px] text-stone-400 italic bg-stone-50 dark:bg-zinc-900/30 p-3 rounded-2xl border border-stone-150 dark:border-zinc-850">
                  አሁንም ንቁ ዕጣ ቦታዎች የሉዎትም። (You have not booked any spots in active campaigns yet).
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(bookedSpots).map(id => {
                    const numbers = bookedSpots[id];
                    const item = raffles.find(r => r.id === id);
                    if (!item || numbers.length === 0) return null;
                    return (
                      <div key={id} className="bg-[#FAF8F5] dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-850 p-3 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-2.5">
                          <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          <div>
                            <h5 className="text-[11.5px] font-black text-stone-900 dark:text-white leading-tight">{item.title}</h5>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                              Booked Spots: {numbers.map(n => `#${n}`).join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[9px] text-[#C5A059] font-extrabold flex items-center justify-end gap-1">
                            <Clock size={10} />
                            <span>Sunday Draw</span>
                          </div>
                          {item.id === 'raf_houses' && (
                            <button
                              onClick={() => initiateCampaignAutoRefund(item)}
                              className="text-[9.5px] text-red-500 font-extrabold underline block hover:text-red-600 mt-1"
                            >
                              Simulate Timeline Expire (Auto-Refund)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DYNAMIC CATEGORY SEGMENTATION FILTER TAGS */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {(['ALL', 'CARS', 'HOUSES', 'ELECTRONICS', 'VOUCHERS'] as const).map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveFilter(tag);
                    playAudioChime('success');
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10.5px] font-black transition-all ${
                    activeFilter === tag
                      ? 'bg-[#1E3A1A] text-white shadow'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* LOTTERY GRID */}
            <div className="grid grid-cols-1 gap-4">
              {raffles
                .filter(r => {
                  if (activeFilter === 'ALL') return true;
                  if (activeFilter === 'CARS') return r.category === 'Cars';
                  if (activeFilter === 'HOUSES') return r.category === 'Houses';
                  if (activeFilter === 'ELECTRONICS') return r.category === 'Electronics';
                  if (activeFilter === 'VOUCHERS') return r.category === 'Clothing' || r.category === 'Everything';
                  return true;
                })
                .map(raf => {
                  const currentBookings = bookedSpots[raf.id] || [];
                  const isRegistered = currentBookings.length > 0;
                  
                  // Calculate dynamic percentage
                  const spotsTaken = raf.totalSpots - raf.spotsLeft;
                  const percentage = Math.min(Math.round((spotsTaken / raf.totalSpots) * 100), 100);

                  // Identify ultra-premium glowing target assets
                  const isUltraPremium = raf.id === 'raf_cars' || raf.id === 'raf_houses';

                  // Blinking "Closing Soon" alert when capacity remaining < 10%
                  const isClosingSoon = (raf.spotsLeft / raf.totalSpots) < 0.10;

                  // Get active multiplier
                  const currentMult = bulkCountMap[raf.id] || 1;
                  const totalCost = raf.ticketPrice * currentMult;

                  return (
                    <div 
                      key={raf.id}
                      className={`bg-white dark:bg-zinc-950 border rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row relative transition-all duration-300 ${
                        isUltraPremium 
                          ? 'border-[2.5px] border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.14)] dark:shadow-[0_0_20px_rgba(251,191,36,0.08)]' 
                          : 'border-stone-200 dark:border-zinc-850'
                      }`}
                    >
                      {/* Interactive Ribbon Overlay */}
                      {isUltraPremium && (
                        <div className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow border border-amber-300">
                          🔥 ተፈላጊ / Trending
                        </div>
                      )}

                      {/* Visual Cover */}
                      <div className="w-full md:w-1/3 min-h-[145px] relative shrink-0 overflow-hidden">
                        <img 
                          src={raf.image} 
                          alt={raf.title} 
                          className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-[#1E3A1A] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-[#C5A059]/40">
                          {raf.category}
                        </div>

                        <div className="absolute bottom-3 left-3 bg-[#C5A059] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                          Valued at: {raf.estimatedValue}
                        </div>
                      </div>

                      {/* Meta Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          {isClosingSoon && (
                            <span className="inline-block bg-red-650 hover:bg-red-700 text-white animate-pulse text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest mb-1.5">
                              🔥 ዕጣ ሊወጣ ነው / Closing Soon
                            </span>
                          )}

                          <h3 className="text-sm font-black text-stone-900 dark:text-white font-serif flex items-center gap-1.5">
                            <span>{raf.title}</span>
                            <span className="text-[10px] text-[#C5A059] font-mono">({raf.ticketPrice} ETB/Spot)</span>
                          </h3>
                          <p className="text-[11px] text-stone-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                            {raf.description}
                          </p>
                        </div>

                        {/* Live Participant Ticker */}
                        <div className="space-y-2 bg-[#F9F7F2] dark:bg-zinc-900/60 p-3 rounded-2xl border border-stone-150 dark:border-zinc-800">
                          <div className="flex justify-between items-center text-[10.5px] font-bold">
                            <span className="text-[#1E3A1A] dark:text-amber-400">
                              📊 {raf.spotsLeft.toLocaleString()} out of {raf.totalSpots.toLocaleString()} spots left
                            </span>
                            <span className="text-stone-500 dark:text-zinc-400 font-mono">
                              {percentage}% Registered
                            </span>
                          </div>

                          {/* Progress Bar Container */}
                          <div className="w-full h-2 bg-stone-200 dark:bg-zinc-850 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-1000 ease-out animate-pulse"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          {/* DYNAMIC LIVE PARTICIPANT TICKER SOCIAL PROOF */}
                          {!batterySaver && (
                            <div className="pt-2 border-t border-stone-200/55 dark:border-zinc-800/80 flex items-center justify-between text-[9px] text-stone-400">
                              <span className="font-semibold text-[8.5px] uppercase text-[#C5A059]">Activity</span>
                              <div className="flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                                <span>{recentReservers[0]?.name} booked {recentReservers[0]?.count} spots {recentReservers[0]?.time}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CONFIGURATION MULTI-SPOT SELECTOR WIDGET */}
                        <div className="space-y-2 pt-1 border-t border-stone-100 dark:border-zinc-900">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-stone-600 dark:text-zinc-400">Select Spot Reservations:</span>
                            <span className="text-[#C5A059] font-black font-mono">+{currentMult} Spot(s)</span>
                          </div>
                          
                          <div className="flex justify-between items-center gap-2">
                            <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-zinc-900 p-1 rounded-xl flex-1 max-w-[190px]">
                              {([1, 5, 10] as const).map(num => (
                                <button
                                  key={num}
                                  onClick={() => {
                                    setBulkCountMap(prev => ({ ...prev, [raf.id]: num }));
                                    playAudioChime('success');
                                  }}
                                  className={`py-1 rounded-lg text-[10px] font-black transition-all ${
                                    currentMult === num
                                      ? 'bg-white dark:bg-zinc-800 text-[#1E3A1A] dark:text-amber-400 shadow-sm'
                                      : 'text-stone-500 dark:text-zinc-400 hover:text-stone-700'
                                  }`}
                                >
                                  +{num}
                                </button>
                              ))}
                            </div>

                            {/* Token Bypass option */}
                            {freeSpotTokens > 0 && (
                              <button
                                onClick={() => {
                                  setUseFreeTokenToggle(!useFreeTokenToggle);
                                  playAudioChime('success');
                                }}
                                className={`text-[9.5px] px-2 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                                  useFreeTokenToggle
                                    ? 'bg-amber-500 text-white border border-amber-600'
                                    : 'bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400'
                                }`}
                              >
                                🎫 Use Token
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleParticipate(raf.id)}
                            className="flex-1 py-2.5 rounded-xl text-[10.5px] font-black uppercase transition-all shadow-sm bg-[#1E3A1A] text-white hover:bg-[#1E3A1A]/90 active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <Ticket size={12} />
                            <span>
                              {useFreeTokenToggle && freeSpotTokens >= currentMult
                                ? `GET FREE ENTRY (${currentMult} Space Token)`
                                : `GET ${currentMult} SPOTS FOR ${totalCost} ETB`}
                            </span>
                          </button>

                          <button
                            onClick={() => handleTelegramSharePrompt(raf)}
                            className="bg-sky-50 dark:bg-sky-950/40 text-sky-650 hover:bg-sky-100 border border-sky-200/40 px-3 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center"
                            title="Share to local Telegram channels for perks!"
                          >
                            Telegram
                          </button>

                          <button
                            onClick={() => handleSimulateDraw(raf)}
                            disabled={isDrawingId !== null}
                            className="bg-stone-100 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-xs px-3.5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            {isDrawingId === raf.id ? (
                              <RefreshCw className="animate-spin" size={13} />
                            ) : (
                              'Sim Draw'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* VERIFIABLE TRANSPARENT WINNERS LOGS ARCHIVE */}
            <div className="bg-[#FAF8F5] dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 p-4 rounded-3xl space-y-4 shadow-sm pb-5 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-500 text-sm">⭐</span>
                <h4 className="text-xs font-black font-serif text-stone-900 dark:text-white uppercase tracking-tight">
                  ያለፉት ዕድለኞች / Past Verifiable Winners Archive
                </h4>
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed dark:text-zinc-400">
                100% transparent and audited live results checked on the blockchain. Click "Sim Draw" on any active campaign to complete a drawing dynamically.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 !mt-3">
                {pastWinners.map(win => (
                  <div key={win.id} className="bg-white dark:bg-zinc-900 p-2.5 rounded-2xl border border-stone-200/60 dark:border-zinc-800/80 flex items-center gap-3">
                    <img src={win.image} alt={win.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[9.5px] uppercase text-[#C5A059] font-black">{win.category}</p>
                      <h5 className="text-[11.5px] font-black text-stone-900 dark:text-white truncate">{win.title}</h5>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-5 h-5 bg-gradient-to-tr from-[#1E3A1A] to-emerald-700 text-white rounded-full flex items-center justify-center text-[8.5px] font-black">
                          {win.avatarTxt}
                        </div>
                        <span className="text-[10px] font-bold text-stone-700 dark:text-zinc-300 truncate">
                          {win.winnerName} ({win.maskedPhone})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="matchmaking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="space-y-4 relative"
          >
            {/* SECURE FLAG VIOLATION PULSE BLACKOUT DIALOG */}
            {screenshotAlertTriggered && (
              <div className="absolute inset-0 z-50 bg-stone-900 text-white p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 border-2 border-red-600 animate-pulse shadow-2xl">
                <div className="p-4 bg-red-600/20 text-red-500 rounded-full border border-red-500">
                  <ShieldAlert size={48} className="animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black tracking-widest text-red-500 uppercase">
                    🛡️ SECURE-FLAG VIOLATION DETECTED 🛡️
                  </h3>
                  <p className="text-[12px] text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Under Abyssinia Security Escrow Protocol, the Every-zone screen guard has completely blocked and neutralized this visual grab action.
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Session IP logged / Verified Fayda ID protection system status: SECURE
                  </p>
                </div>
                <div className="text-[9px] bg-red-500 text-white font-extrabold px-3 py-1 rounded-full uppercase leading-none">
                  Content Shields Engaged
                </div>
              </div>
            )}

            {/* Lock check logic for Non-Sundays */}
            {!isSundayToday && !devSundayBypass ? (
              <div className="bg-white dark:bg-zinc-950 border border-amber-300/60 dark:border-zinc-800/80 p-8 rounded-3xl space-y-5 shadow-sm text-center flex flex-col items-center animate-fadeIn">
                <div className="p-3.5 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/20">
                  <Lock size={32} className="animate-bounce" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-sm font-black text-stone-800 dark:text-zinc-200">
                    የእሁድ ማዛመጃ ዝግ ነው - የሚከፈተው እሁድ ብቻ ነው
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed dark:text-zinc-400">
                    Sunday Matchmaking opens exclusively on Sundays, featuring private 24-hour anonymous chats with Fayda-Verified members!
                  </p>
                </div>
                
                <div className="pt-4 border-t border-stone-100 dark:border-zinc-850/60 w-full flex flex-col items-center gap-2">
                  <p className="text-[9.5px] uppercase tracking-wider text-[#C5A059] font-extrabold">Testing Sandbox Panel</p>
                  <label className="flex items-center gap-2 cursor-pointer text-[10.5px] font-black text-[#1E3A1A] dark:text-amber-400 hover:opacity-85 p-2 rounded-xl transition">
                    <input
                      type="checkbox"
                      checked={devSundayBypass}
                      onChange={(e) => setDevSundayBypass(e.target.checked)}
                      className="rounded border-stone-300 text-emerald-600 focus:ring-[#1E3A1A]"
                    />
                    <span>📅 Simulate Sunday (Bypass Lock)</span>
                  </label>
                </div>
              </div>
            ) : (
              /* ACTIVE SUNDAY MATCHMAKING HUB */
              <div className="space-y-4">
                {/* DEV SANITY HEADER */}
                {devSundayBypass && (
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
                    <span>💡 Sunday Simulation Bypass Active (Time-shifted)</span>
                    <button onClick={() => setDevSundayBypass(false)} className="underline text-[9.5px] hover:opacity-80">Restore Real Time</button>
                  </div>
                )}

                {/* SUNDAY CORE MATCH CARD VIEW FOR VERIFIED USERS */}
                {!isVerified ? (
                  /* LOCKOUT BANNER: REQUIRES FAYDA ID VERIFICATION */
                  <div className="bg-stone-50 dark:bg-zinc-950 border-2 border-dashed border-stone-300 dark:border-zinc-850 p-6 rounded-3xl text-center space-y-4 shadow-sm">
                    <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <LockKeyhole size={24} />
                    </div>
                    <div className="space-y-1.5 max-w-md mx-auto">
                      <h3 className="text-sm font-black text-stone-900 dark:text-zinc-100 font-serif">
                        🔒 Verified Digital ID Matchmaking Only
                      </h3>
                      <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-relaxed">
                        To guarantee 100% genuine interactions, avoid bot accounts, and ensure top-tier transactional security, Sunday Matchmaking is strictly limited to <strong>Fayda Digital ID Verified Profiles</strong>.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const elem = document.getElementById('id-registration');
                        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-black uppercase text-white bg-[#1E3A1A] hover:opacity-90 transition-all shadow-sm"
                    >
                      <Fingerprint size={12} />
                      <span>Verify My Digital ID Now (Free)</span>
                    </button>
                  </div>
                ) : (
                  /* VERIFIED USER SUNDAY HUB */
                  <div className="space-y-4">
                    
                    {/* IF CHAT INTERFACE NOT RUNNING: SHOW THE SUNDAY MATCH CARD */}
                    {!anonymousChatOpen ? (
                      <div className="space-y-4">
                        {/* THE MATCHING PAIRING GENERATOR CONTROL PANEL */}
                        {!matchPaired ? (
                          <div className="bg-[#1E3A1A] text-[#E8E2D5] p-6 rounded-3xl space-y-4 shadow-md border border-[#C5A059]/30 relative overflow-hidden text-center flex flex-col items-center">
                            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-[#C5A059]">
                              <Sparkles size={25} className="animate-pulse" />
                            </div>
                            <div className="space-y-1.5 max-w-sm">
                              <h3 className="text-sm font-black tracking-tight uppercase text-white">
                                Verified Sunday Match Slot
                              </h3>
                              <p className="text-[11px] text-stone-300 leading-relaxed">
                                Our safe-pairing algorithm is ready. Click below to execute compatibility analytics and pair anonymized profiles with Fayda badges.
                              </p>
                            </div>

                            {matchInProgress ? (
                              /* RUNNING SCANNER ANIMATION */
                              <div className="w-full max-w-xs space-y-3 pt-2">
                                <div className="flex justify-between items-center text-[10px] font-mono text-stone-300">
                                  <span className="font-bold animate-pulse">🧬 ANALYZING PARAMS...</span>
                                  <span>75%</span>
                                </div>
                                <div className="w-full h-1.5 bg-stone-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#C5A059] w-3/4" />
                                </div>
                                <p className="text-[9px] text-[#C5A059] font-mono uppercase tracking-widest">
                                  Screen guard enabled • Masking bios...
                                </p>
                              </div>
                            ) : (
                              <button
                                onClick={handleStartPairing}
                                className="mt-2 py-2.5 px-6 rounded-xl text-xs font-black uppercase text-stone-505 bg-[#C5A059] hover:opacity-95 active:scale-95 transition-all text-center flex items-center gap-2 shadow-md"
                              >
                                <Heart size={14} fill="currentColor" />
                                <span>Begin Sunday Safe-Pairing</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* AI SMART MATCHMAKING PREFERENCE FILTERS PANEL */}
                            <div className="bg-[#FAF8F5] dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 p-4 rounded-3xl space-y-3 shadow-xs animate-fadeIn">
                              <div className="flex items-center gap-1.5 border-b border-stone-200 dark:border-zinc-800 pb-2">
                                <Sparkles className="text-[#C5A059]" size={15} />
                                <h4 className="text-xs font-black font-serif text-stone-900 dark:text-white uppercase tracking-tight">
                                  🧬 AI Smart Matching Preferences (የማዛመጃ መስፈርቶች)
                                </h4>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-[10.5px]">
                                {/* Age Preference */}
                                <div className="space-y-1">
                                  <span className="font-bold text-stone-600 dark:text-zinc-400 block">Age Target:</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      value={prefAgeMin}
                                      onChange={(e) => setPrefAgeMin(Number(e.target.value))}
                                      className="w-10 bg-white dark:bg-zinc-950 px-1 py-0.5 rounded border text-center font-mono font-bold dark:border-zinc-800 text-stone-800 dark:text-white"
                                    />
                                    <span>-</span>
                                    <input
                                      type="number"
                                      value={prefAgeMax}
                                      onChange={(e) => setPrefAgeMax(Number(e.target.value))}
                                      className="w-10 bg-white dark:bg-zinc-950 px-1 py-0.5 rounded border text-center font-mono font-bold dark:border-zinc-800 text-stone-800 dark:text-white"
                                    />
                                  </div>
                                </div>

                                {/* Religion Filter */}
                                <div className="space-y-1">
                                  <span className="font-bold text-stone-600 dark:text-zinc-400 block">Religion:</span>
                                  <select
                                    value={prefReligion}
                                    onChange={(e) => setPrefReligion(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 px-1.5 py-0.5 rounded border dark:border-zinc-800 text-stone-850 dark:text-white font-medium focus:outline-none"
                                  >
                                    <option value="All">All</option>
                                    <option value="Orthodox Christian">Orthodox Christian</option>
                                    <option value="Protestant Christian">Protestant Christian</option>
                                    <option value="Muslim">Muslim</option>
                                    <option value="Catholic">Catholic</option>
                                  </select>
                                </div>

                                {/* Language Filter */}
                                <div className="space-y-1">
                                  <span className="font-bold text-stone-600 dark:text-zinc-400 block">Language:</span>
                                  <select
                                    value={prefLanguage}
                                    onChange={(e) => setPrefLanguage(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 px-1.5 py-0.5 rounded border dark:border-zinc-800 text-stone-850 dark:text-white font-medium focus:outline-none"
                                  >
                                    <option value="All">All</option>
                                    <option value="Amharic">Amharic</option>
                                    <option value="English">English</option>
                                    <option value="Afaan Oromoo">Afaan Oromoo</option>
                                    <option value="Italian">Italian</option>
                                  </select>
                                </div>

                                {/* Education Filter */}
                                <div className="space-y-1">
                                  <span className="font-bold text-stone-600 dark:text-zinc-400 block">Education:</span>
                                  <select
                                    value={prefEducation}
                                    onChange={(e) => setPrefEducation(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 px-1.5 py-0.5 rounded border dark:border-zinc-800 text-stone-850 dark:text-white font-medium focus:outline-none"
                                  >
                                    <option value="All">All</option>
                                    <option value="M.Sc. AAU Architecture">M.Sc. Postgraduate</option>
                                    <option value="BFA AAU Fine Arts & Curation">BFA Graduate</option>
                                  </select>
                                </div>

                                {/* Distance Target */}
                                <div className="space-y-1">
                                  <span className="font-bold text-stone-600 dark:text-zinc-400 block">Distance Limit:</span>
                                  <select
                                    className="w-full bg-white dark:bg-zinc-950 px-1.5 py-0.5 rounded border dark:border-zinc-800 text-stone-850 dark:text-white font-medium focus:outline-none"
                                  >
                                    <option>Within Addis Ababa (&lt;10km)</option>
                                    <option>Across Ethiopia (&lt;500km)</option>
                                  </select>
                                </div>
                              </div>
                              <p className="text-[9px] text-[#C5A059] italic font-mono uppercase tracking-wider">
                                ⚡ AI Recommendation engine matches based on Age, Country, Religion, Languages, Education & Proximity indexes.
                              </p>
                            </div>

                            {/* THE GOLDEN STANDARD SUNDAY MATCH CARD */}
                            <div className="bg-white dark:bg-zinc-950 border-2 border-[#C5A059] p-5 rounded-3xl relative overflow-hidden shadow-md animate-fadeIn flex flex-col md:flex-row gap-5">
                              {/* Watermark security accent */}
                              <div className="absolute -top-3 -right-3 text-[9px] uppercase tracking-wider text-[#C5A059]/10 rotate-12 font-mono select-none font-bold">
                                CONFIDENTIAL MASK
                              </div>

                              {/* Left avatar block with dynamic placeholder */}
                              <div className="w-full md:w-44 shrink-0 flex flex-col items-center justify-center p-4 bg-[#F9F7F2] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 rounded-2xl relative">
                                <div className="absolute top-2 left-2 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[7.5px] uppercase font-bold text-emerald-600">Active</span>
                                </div>
                                <div className="w-20 h-20 rounded-full bg-[#1E3A1A] text-white flex items-center justify-center font-serif text-xl font-bold shadow-inner relative">
                                  <UserCheck size={32} className="text-[#C5A059]" />
                                  <div className="absolute -bottom-1.5 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border border-white">
                                    <Check size={11} strokeWidth={4} />
                                  </div>
                                </div>
                                <span className="text-sm font-black text-stone-900 dark:text-white mt-3 font-mono">
                                  {VERIFIED_CANDIDATES[activeCandidateIndex].alias}
                                </span>
                                <div className="mt-1 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[7.5px] uppercase font-bold tracking-wider leading-none">
                                  Digital ID Active
                                </div>

                                {/* Trust status badges */}
                                <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-stone-200 dark:border-zinc-800 w-full justify-center text-[9px] text-stone-500 dark:text-zinc-400">
                                  <span title="Phone Verified" className="bg-stone-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-emerald-650 font-bold">📞 Phone</span>
                                  <span title="Email Verified" className="bg-stone-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-emerald-650 font-bold">✉️ Email</span>
                                  <span title="ID Verified" className="bg-stone-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-emerald-650 font-bold">🪪 ID</span>
                                </div>
                              </div>

                              {/* Right match layout and stats */}
                              <div className="flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-1.5">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-[10px] uppercase font-extrabold text-[#C5A059] tracking-wider font-mono">
                                       Sunday Companion Match Card
                                    </span>
                                    <div className="bg-[#1E3A1A] text-[#C5A059] px-2.5 py-1 rounded-lg border border-[#C5A059]/20 flex items-center gap-1 text-[9px] font-black leading-none shrink-0 uppercase tracking-tight">
                                      <Clock size={10} />
                                      <span>Expires in: {matchCountdown.split('remaining')[0]}</span>
                                    </div>
                                  </div>
                                  <h4 className="text-sm font-black text-stone-900 dark:text-white font-serif italic">
                                    Fayda Authenticated Partner Matrix Found!
                                  </h4>
                                  
                                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 dark:text-zinc-300">
                                    <span className="font-bold text-stone-800 dark:text-white">Compatibility:</span>
                                    <span className="text-[#1E3A1A] dark:text-[#C5A059] font-black">{VERIFIED_CANDIDATES[activeCandidateIndex].matchingScore}% Align</span>
                                    <span>•</span>
                                    <span className="font-bold text-stone-800 dark:text-white">Fayda ID:</span>
                                    <span className="font-mono text-[10px] uppercase text-stone-500">{VERIFIED_CANDIDATES[activeCandidateIndex].faydaId}</span>
                                  </div>

                                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-relaxed italic">
                                    "Real phone index, name, and profile photos are securely masked for the first 24 hours to guard your privacy in Every-zone."
                                  </p>

                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {VERIFIED_CANDIDATES[activeCandidateIndex].interests.map((it, i) => (
                                      <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-stone-100 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 rounded border border-stone-200 dark:border-zinc-885">
                                        {it}
                                      </span>
                                    ))}
                                  </div>

                                  {/* EXPANDED DETAILED MARITAL AND PROFESSION ATTRIBUTES */}
                                  <div className="pt-2">
                                    <button
                                      onClick={() => setShowFullBios(!showFullBios)}
                                      className="text-[10.5px] text-[#C5A059] font-black flex items-center gap-1 underline hover:opacity-80"
                                    >
                                      <span>{showFullBios ? 'Hide Detailed Profile 📋' : 'Show Complete Serious Profile & Marital Bio 📋'}</span>
                                    </button>

                                    {showFullBios && (
                                      <div className="mt-3 bg-stone-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-stone-200/60 dark:border-zinc-800 text-[11px] text-stone-700 dark:text-zinc-300 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 animate-fadeIn">
                                        <div className="md:col-span-2 italic text-[11px] pb-1.5 border-b border-stone-100 dark:border-zinc-800 text-stone-500 dark:text-zinc-400">
                                          "{VERIFIED_CANDIDATES[activeCandidateIndex].bio}"
                                        </div>
                                        <div><strong>Education:</strong> {VERIFIED_CANDIDATES[activeCandidateIndex].education}</div>
                                        <div><strong>Profession:</strong> {VERIFIED_CANDIDATES[activeCandidateIndex].profession}</div>
                                        <div><strong>Religion / Denomination:</strong> {VERIFIED_CANDIDATES[activeCandidateIndex].religion}</div>
                                        <div><strong>Languages:</strong> {VERIFIED_CANDIDATES[activeCandidateIndex].languages}</div>
                                        <div><strong>Location:</strong> {VERIFIED_CANDIDATES[activeCandidateIndex].city}, {VERIFIED_CANDIDATES[activeCandidateIndex].country}</div>
                                        <div><strong>Height Index:</strong> {VERIFIED_CANDIDATES[activeCandidateIndex].height}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 pt-1 border-t border-stone-150 dark:border-zinc-800">
                                  <button
                                    onClick={() => setAnonymousChatOpen(true)}
                                    className="flex-1 py-2 px-3 bg-[#1E3A1A] text-white hover:opacity-95 rounded-xl text-xs font-black uppercase text-center flex items-center justify-center gap-1.5 active:scale-97 transition shadow-xs"
                                  >
                                    <MessageSquare size={13} fill="currentColor" />
                                    <span>Open Anonymous Chat Terminal</span>
                                  </button>
                                  <button
                                    onClick={handleResetMatch}
                                    className="p-2 bg-stone-100 dark:bg-zinc-900 hover:bg-neutral-200 text-stone-505 hover:text-red-650 rounded-xl transition duration-200"
                                    title="Unmatch Companion"
                                  >
                                    <UserX size={15} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* ACTIVE PRIVATE 24-HOUR ANONYMOUS CHAT INTERFACE */
                      <div className="bg-stone-900 dark:bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-lg animate-fadeIn flex flex-col min-h-[420px] relative">
                        
                        {/* SECURE FLAG MASK BACKGROUND DYNAMIC WATERMARK */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none uppercase font-mono text-[11px] tracking-widest flex flex-wrap gap-y-16 gap-x-20 p-5 rotate-[15deg]">
                          {Array.from({ length: 48 }).map((_, i) => (
                            <span key={i}>🔒 NO SCREENSHOTS ALLOWED {verification.digitalId}</span>
                          ))}
                        </div>

                        {/* CHAT CHROME HEADER */}
                        <div className="bg-stone-950 border-b border-stone-850 p-4 shrink-0 flex items-center justify-between text-white relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                              <UserCheck size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black tracking-wide font-mono">
                                  {VERIFIED_CANDIDATES[activeCandidateIndex].alias}
                                </span>
                                <span className="bg-emerald-500 text-stone-950 text-[7px] uppercase tracking-normal px-1 py-0.5 rounded font-black leading-none">
                                  Verified Pair
                                </span>
                              </div>
                              <p className="text-[9.5px] text-zinc-400 flex items-center gap-1 leading-none mt-0.5 font-mono">
                                <span className="inline-block w-1.5 h-1.5 bg-green-505 rounded-full animate-ping" />
                                <span>24-Hour Secure Slot | {matchCountdown.split('remaining')[0]} left</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleRequestMutualReveal}
                              disabled={mutualRevealRequested}
                              className={`text-[9.5px] uppercase font-mono font-black px-2 py-1 rounded-lg border transition ${
                                mutualRevealRequested
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              }`}
                              title="Request Mutual Identity & Contact Reveal"
                            >
                              {mutualRevealRequested ? '🤝 Requested' : '🤝 Reveal ID'}
                            </button>
                            <button
                              onClick={() => {
                                triggerScreenshotBlackout();
                                setTimeout(() => {
                                  alert("🔒 Secure-Flag block simulated! Any screenshot event has been masked inside this view canvas.");
                                }, 50);
                              }}
                              className="text-[9.5px] uppercase font-mono font-black text-[#C5A059] bg-[#C1A059]/10 px-2 py-1 rounded-lg border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition"
                              title="Test Screenshot Blocking"
                            >
                              📸 Test Shield
                            </button>
                            <button
                              onClick={() => setAnonymousChatOpen(false)}
                              className="text-zinc-400 hover:text-white"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>

                        {/* SHIELD OVERHEAD BANNER */}
                        <div className="bg-stone-950 border-b border-emerald-500/10 px-4 py-2 shrink-0 flex items-center justify-between gap-3 text-[10px] text-emerald-500 relative z-10 font-mono text-center">
                          <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 uppercase text-[9px] font-bold text-[#C5A059] animate-pulse shrink-0">
                            🛡️ Shield Active
                          </div>
                          <span className="text-[9px] truncate text-emerald-500/80">Every-zone Anti-Screenshot Lock Enabled (secure-flag simulation inside preview)</span>
                        </div>

                        {/* MESSAGES CONTEXT CANVAS */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[280px] min-h-[220px] relative z-10 bg-gradient-to-b from-stone-900 to-stone-950">
                          {securedMessages.map((msg, i) => {
                            if (msg.sender === 'system') {
                              return (
                                <div key={i} className="bg-stone-950 p-3 rounded-2xl border border-dashed border-[#C5A059]/25 text-[10px] leading-relaxed text-[#C5A059] text-center space-y-1 mx-auto max-w-sm">
                                  <LockKeyhole size={13} className="mx-auto" />
                                  <p>{msg.text}</p>
                                </div>
                              );
                            }

                            const isMe = msg.sender === 'me';
                            return (
                              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed ${
                                  isMe 
                                    ? 'bg-[#1E3A1A] text-white rounded-tr-none' 
                                    : 'bg-stone-800 text-stone-100 rounded-tl-none border border-stone-705'
                                }`}>
                                  {msg.text}
                                </div>
                                <span className="text-[8.5px] text-stone-500 font-mono mt-1 px-1">{msg.time}</span>
                              </div>
                            );
                          })}

                          {/* TYPING INDICATOR Bubble */}
                          {isThemTyping && (
                            <div className="flex flex-col items-start animate-pulse">
                              <div className="bg-stone-850 text-stone-300 px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-stone-800 text-[10px] italic flex items-center gap-1.5 leading-none">
                                <span className="inline-block w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" />
                                <span className="inline-block w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce delay-150" />
                                <span className="inline-block w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce delay-300" />
                                <span className="text-stone-400">Pair entering response...</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* INTERACTION CHAT SUBMIT FORM */}
                        <div className="p-3 bg-stone-950 border-t border-stone-850 shrink-0 flex items-center gap-2 relative z-10">
                          <input
                            type="text"
                            placeholder="Type secured message anonymously..."
                            value={chatInputText}
                            onChange={(e) => setChatInputText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendSecuredMessage();
                            }}
                            className="flex-1 bg-stone-900 outline-none text-[11.5px] text-white px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-[#C5A059] placeholder-stone-500"
                          />
                          <button
                            onClick={handleSendSecuredMessage}
                            className="p-2.5 bg-[#1E3A1A] text-[#C5A059] rounded-xl hover:opacity-90 active:scale-95 transition cursor-pointer flex items-center justify-center"
                          >
                            <Send size={13} />
                          </button>
                        </div>

                        {/* SECURITY WARNING HUD BUTTON AREA */}
                        <div className="bg-stone-950 px-4 py-1.5 shrink-0 text-center text-[8.5px] text-stone-500 border-t border-stone-900 flex justify-between items-center z-10 font-mono">
                          <span>👤 Private ID: User 104</span>
                          <span>🔒 Escrow tunnel: verified • secure</span>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* HISTORIC TRADITIONAL CALCULATOR TAB (STILL ACCESSIBLE) */}
                <div className="bg-stone-50 dark:bg-zinc-900/40 p-4.5 rounded-3xl border border-stone-200 dark:border-zinc-850 space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="text-stone-400 shrink-0" size={14} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-605 dark:text-zinc-400">
                      Traditional Compatibility Checker (Optional Offline Analytical tool)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-extrabold uppercase text-stone-500 block">
                        Person 1 Name
                      </label>
                      <input 
                        type="text"
                        placeholder="Enter first name..."
                        value={matchName1}
                        onChange={(e) => setMatchName1(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 outline-none text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-850 text-stone-800 dark:text-white font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-extrabold uppercase text-stone-500 block">
                        Person 2 Name
                      </label>
                      <input 
                        type="text"
                        placeholder="Enter second name..."
                        value={matchName2}
                        onChange={(e) => setMatchName2(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 outline-none text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-850 text-stone-800 dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  {/* CALCULATED RESULTS */}
                  {matchCalcResult && (
                    <div className="p-3.5 bg-white dark:bg-zinc-950 border border-stone-150 dark:border-zinc-850 rounded-2xl text-center space-y-1.5 animate-fadeIn">
                      <div className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-black font-mono">
                        {matchCalcResult.score}% Compatibility Index
                      </div>
                      <h4 className="text-xs font-black text-stone-900 dark:text-emerald-450">
                        {matchCalcResult.title}
                      </h4>
                      <p className="text-[10.5px] text-stone-500 dark:text-zinc-400 leading-normal max-w-md mx-auto">
                        {matchCalcResult.description}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={calculateCompatibility}
                    disabled={isMatchingLoading}
                    className="w-full py-2 rounded-xl text-[10.5px] font-black uppercase text-stone-700 dark:text-zinc-300 bg-stone-200 hover:bg-stone-250 dark:bg-zinc-900 dark:hover:bg-zinc-800 active:scale-98 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    {isMatchingLoading ? (
                      <>
                        <RefreshCw className="animate-spin" size={12} />
                        <span>Running Analytical Matrix...</span>
                      </>
                    ) : (
                      <>
                        <Heart size={12} />
                        <span>Calculate Offline Traditional Compatibility Index</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* REGISTRATION & DIGITAL ID VERIFICATION AREA */}
      <div id="id-registration" className="bg-[#F9F7F2] dark:bg-zinc-900/60 p-5 rounded-3xl border border-stone-250 dark:border-zinc-850 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="text-[#1E3A1A]" size={18} />
            <span className="text-xs font-black uppercase tracking-wider text-stone-850 dark:text-zinc-150">
              National Digital ID Registration (Verified Free Pass)
            </span>
          </div>

          {isVerified && (
            <button
              onClick={handleResetVerification}
              className="text-[9px] uppercase font-black text-red-600 hover:underline"
            >
              Reset Credentials
            </button>
          )}
        </div>

        {isVerified ? (
          <div className="space-y-3.5 pt-1.5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 dark:text-white">
                Verification Pipeline Live & Active!
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-1 max-w-sm">
                Congratulations, <strong>{verification.fullName}</strong>. Your national digital ID 
                (<strong>{verification.digitalId}</strong>) has been synchronized successfully. 
                Raffle entry limits lifted.
              </p>
            </div>

            {/* RENEWAL COUNTDOWN & LIFESPAN ALERT */}
            <div className="w-full max-w-md bg-amber-500/10 border border-amber-500/20 px-3.5 py-3 rounded-2xl text-left space-y-1.5 animate-pulse">
              <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-400 font-extrabold text-[11px]">
                <AlertCircle size={14} className="shrink-0" />
                <span>የማንነት ማረጋገጫ ዝርዝር / ID Lifetime Status</span>
              </div>
              <p className="text-[10.5px] text-amber-800 dark:text-amber-300 font-bold leading-relaxed">
                የማንነት ማረጋገጫዎ ሊያበቃ ነው! እባክዎ አዲስ መታወቂያ ይስቀሉ
              </p>
              <div className="flex justify-between text-[9.5px] text-stone-500 dark:text-zinc-400 font-mono pt-1 border-t border-amber-500/20">
                <span>የተሰጠበት ቀን፦ June 18, 25 (Kebele Lifespan 12mo)</span>
                <span>የሚያበቃበት፦ 28 days left</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full max-w-md pt-2 text-[10.5px]">
              <div className="bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-stone-200 dark:border-zinc-850 flex flex-col items-center space-y-1">
                <span className="text-stone-400 uppercase text-[9px]">GMAIL ACCESS</span>
                <span className="font-bold text-stone-800 dark:text-zinc-150 truncate max-w-full">{verification.email}</span>
              </div>
              <div className="bg-white dark:bg-zinc-950 p-2.5 rounded-xl border border-stone-200 dark:border-zinc-850 flex flex-col items-center space-y-1">
                <span className="text-stone-400 uppercase text-[9px]">PHONE NUMBER</span>
                <span className="font-bold text-stone-800 dark:text-zinc-150">{verification.phone}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 pt-1">
            <p className="text-[11.5px] leading-relaxed text-stone-500 dark:text-zinc-400">
              Complete this form to unlock Free access immediately. Regular users never pay any subscription fees, keeping digital raffle tickets completely accessible!
            </p>

            {registeringError && (
              <div className="p-2 border border-red-250 bg-red-50 text-red-750 text-xs rounded-xl font-bold flex items-center gap-1.5">
                <AlertCircle size={14} />
                <span>{registeringError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-stone-600 block">Your Full Name</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Abebe Bikila"
                    value={verification.fullName}
                    onChange={(e) => setVerification({ ...verification, fullName: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-950 outline-none text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-850 text-stone-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Gmail address */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-stone-600 block">Your Gmail Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="email" 
                    placeholder="e.g. abebe@gmail.com"
                    value={verification.email}
                    onChange={(e) => setVerification({ ...verification, email: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-950 outline-none text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-850 text-stone-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-stone-600 block">Your Phone Number</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. +251 912 345 678"
                    value={verification.phone}
                    onChange={(e) => setVerification({ ...verification, phone: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-950 outline-none text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-850 text-stone-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Fayda National ID */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-stone-600 block">National Digital ID (Fayda / Ethio ID)</label>
                <div className="relative">
                  <Fingerprint size={13} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. ET-ID-8429402B"
                    value={verification.digitalId}
                    onChange={(e) => setVerification({ ...verification, digitalId: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-950 outline-none text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-850 text-stone-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1E3A1A] hover:bg-[#1E3A1A]/90 active:scale-99 transition-all text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm text-center block cursor-pointer mt-2"
            >
              Verify Credentials & Join For Free
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
