import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, Camera, Upload, X, ShieldCheck, CheckCircle2, 
  RotateCw, AlertCircle, FileText, Smartphone, Landmark, Fingerprint, Award,
  Zap, ZapOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ScanResult {
  type: 'FAYDA_ID' | 'PAYMENT_CODE' | 'TRANSFER_CODE' | 'PASSPORT_TICKET' | 'MARKETPLACE_VENDOR' | 'MARKETPLACE_PRODUCT';
  data: {
    fullName?: string;
    birthDate?: string;
    faydaId?: string;
    nationality?: string;
    merchantName?: string;
    amount?: number;
    reference?: string;
    provider?: 'Telebirr' | 'CBE' | 'Chapa' | 'Awash Bank' | 'Telebirr' | 'CBE Birr';
    recipientId?: string;
    recipientName?: string;
    ticketId?: string;
    vendorId?: string;
    productId?: string;
    productTitle?: string;
  };
}

interface QRCodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: ScanResult) => void;
  lang: 'en' | 'am';
  isDarkMode: boolean;
  handleImageSearch?: (base64Image: string) => Promise<void>;
  imageSearchLoading?: boolean;
  initialTab?: 'image_search' | 'camera' | 'upload' | 'presets';
}

export function QRCodeScanner({ 
  isOpen, 
  onClose, 
  onScanSuccess, 
  lang, 
  isDarkMode,
  handleImageSearch,
  imageSearchLoading,
  initialTab = 'image_search'
}: QRCodeScannerProps) {
  const [activeTab, setActiveTab] = useState<'image_search' | 'camera' | 'upload' | 'presets'>(initialTab);
  const [cameraState, setCameraState] = useState<'idle' | 'loading' | 'active' | 'denied'>('idle');
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isOffline, setIsOffline] = useState(() => {
    const simulated = localStorage.getItem('ez_simulated_offline') === 'true';
    return simulated || !navigator.onLine;
  });

  const [queuedScans, setQueuedScans] = useState<any[]>([]);

  const loadQueuedScans = () => {
    try {
      const saved = localStorage.getItem('ez_queued_scans');
      if (saved) {
        setQueuedScans(JSON.parse(saved));
      } else {
        setQueuedScans([]);
      }
    } catch (e) {
      setQueuedScans([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadQueuedScans();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOnline = () => {
      if (localStorage.getItem('ez_simulated_offline') !== 'true') {
        setIsOffline(false);
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
    };
    const handleCustomChange = () => {
      const simulated = localStorage.getItem('ez_simulated_offline') === 'true';
      setIsOffline(simulated || !navigator.onLine);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('ez_network_change', handleCustomChange);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('ez_network_change', handleCustomChange);
    };
  }, []);

  const toggleOfflineSimulation = () => {
    const simulated = localStorage.getItem('ez_simulated_offline') === 'true';
    const nextVal = !simulated;
    localStorage.setItem('ez_simulated_offline', nextVal ? 'true' : 'false');
    setIsOffline(nextVal || !navigator.onLine);
    window.dispatchEvent(new Event('ez_network_change'));
  };

  const handleClearQueue = () => {
    localStorage.removeItem('ez_queued_scans');
    setQueuedScans([]);
  };

  const handleProcessQueuedItem = (item: any) => {
    onScanSuccess({
      type: item.type,
      data: item.data
    });
    
    try {
      const saved = localStorage.getItem('ez_queued_scans');
      const queue = saved ? JSON.parse(saved) : [];
      const updated = queue.filter((q: any) => q.id !== item.id);
      localStorage.setItem('ez_queued_scans', JSON.stringify(updated));
      setQueuedScans(updated);
    } catch (e) {
      console.error(e);
    }
    
    alert(`✅ Processed queued offline scan: "${item.name}" successfully!`);
  };

  const queueScan = (preset: typeof presets[0]) => {
    const queuedItem = {
      id: 'queued-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: preset.type,
      name: preset.name,
      data: preset.data,
      timestamp: new Date().toISOString()
    };
    
    try {
      const saved = localStorage.getItem('ez_queued_scans');
      const queue = saved ? JSON.parse(saved) : [];
      queue.push(queuedItem);
      localStorage.setItem('ez_queued_scans', JSON.stringify(queue));
      setQueuedScans(queue);
    } catch (e) {
      console.error(e);
    }

    setScannedFeedback(`Queued Offline: ${preset.name}`);
    setIsScanning(false);
    playBeep();
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    setTimeout(() => {
      setScannedFeedback(null);
      stopCamera();
      onClose();
      alert(`🚨 Offline Queue Enabled\n\nYour scan of "${preset.name}" has been safely queued locally because the app is offline.\n\nIt will be automatically processed once internet connection is restored.`);
    }, 1200);
  };

  // Translations
  const t = {
    en: {
      title: 'Every-Zone QR & Document Scanner',
      subtitle: 'Scan Fayda IDs, Passport Confirmations, or Payment QR Codes securely',
      tabs: {
        camera: 'Live Camera',
        upload: 'Upload Document / Image',
        presets: 'Ethiopian Document Presets (Reliable)',
      },
      cameraLabel: 'Position QR or Document within the frame',
      cameraLoading: 'Initializing camera hardware...',
      cameraDenied: 'Camera access denied or unavailable in this sandbox. Please use Presets or File Upload tab.',
      uploadLabel: 'Drag & drop image here, or click to browse',
      uploadSub: 'Supports PNG, JPG, PDF containing QRs or Barcodes (Max 10MB)',
      startScanning: 'Activate Scanner Radar',
      scanning: 'Decoding camera frames...',
      presetsTitle: 'Quick Scanner Simulation Presets',
      presetsDesc: 'Click any official document or payment code below to simulate a high-accuracy physical scan instantly.',
      btnScan: 'Perform Auto Scan',
      scanned: 'Successfully Scanned!',
      types: {
        fayda: 'National Fayda ID',
        telebirr: 'Telebirr Merchant Code',
        cbe: 'CBE Pay Bill Code',
        p2p: 'P2P Transfer Code',
        passport: 'Passport Booking Ticket',
        vendor: 'Marketplace Merchant / Owner',
        product: 'Marketplace Product QR',
      }
    },
    am: {
      title: 'የኤቭሪ-ዞን QR እና ሰነድ አንባቢ',
      subtitle: 'የፋይዳ መታወቂያን፣ የፓስፖርት ማረጋገጫዎችን ወይም የክፍያ ኮዶችን ደህንነቱ በተጠበቀ ሁኔታ ያንብቡ',
      tabs: {
        camera: 'ቀጥታ ካሜራ',
        upload: 'ሰነድ / ምስል ይስቀሉ',
        presets: 'የሰነድ ናሙናዎች (አስተማማኝ)',
      },
      cameraLabel: 'እባክዎ QR ኮዱን ወይም ሰነዱን በካሬው ውስጥ ያስገቡ',
      cameraLoading: 'ካሜራው በመዘጋጀት ላይ ነው...',
      cameraDenied: 'ካሜራ ማግኘት አልተቻለም። እባክዎ "የሰነድ ናሙናዎች" ወይም "ሰነድ ይስቀሉ" የሚለውን ይጠቀሙ።',
      uploadLabel: 'ምስሉን እዚህ ይጎትቱት ወይም ይምረጡት',
      uploadSub: 'PNG, JPG ወይም PDF ሰነዶች (ከ 10MB በታች)',
      startScanning: 'የመቃኛ መሣሪያውን አስነሳ',
      scanning: 'መረጃው በመተንተን ላይ ነው...',
      presetsTitle: 'ፈጣን መቃኛ ሰነዶች ናሙና',
      presetsDesc: 'እውነተኛ ሰነድ መቃኘትን ለመምሰል ከታች ካሉት አማራጮች አንዱን ጠቅ ያድርጉ።',
      btnScan: 'መቃኘት ጀምር',
      scanned: 'በተሳካ ሁኔታ ተቃኝቷል!',
      types: {
        fayda: 'የፋይዳ ዲጂታል መታወቂያ',
        telebirr: 'የቴሌብር ነጋዴ QR ኮድ',
        cbe: 'የንግድ ባንክ የክፍያ ኮድ',
        p2p: 'የአቻ ለአቻ ማስተላለፊያ',
        passport: 'የፓስፖርት ቀጠሮ ቲኬት',
        vendor: 'የገበያ ሻጭ / ባለቤት መገለጫ',
        product: 'የምርት QR ኮድ',
      }
    }
  }[lang];

  // Mock Preset Scanner Data
  const presets = [
    {
      id: 'preset-fayda-abebe',
      name: 'Fayda ID: Abebe Bekele (አበበ በቀለ)',
      type: 'FAYDA_ID' as const,
      icon: <Fingerprint className="text-[#C5A059]" size={18} />,
      badge: t.types.fayda,
      desc: 'National Digital ID Card with biometric authentication payload.',
      data: {
        fullName: 'Abebe Bekele',
        birthDate: '1988-09-14',
        faydaId: 'FAY-99023812-ET',
        nationality: 'Ethiopian'
      }
    },
    {
      id: 'preset-fayda-aster',
      name: 'Fayda ID: Aster Kassa (አስቴር ካሳ)',
      type: 'FAYDA_ID' as const,
      icon: <Fingerprint className="text-[#C5A059]" size={18} />,
      badge: t.types.fayda,
      desc: 'National Digital ID Card for instant Passport Application fill-in.',
      data: {
        fullName: 'Aster Kassa',
        birthDate: '1993-04-25',
        faydaId: 'FAY-48192038-ET',
        nationality: 'Ethiopian'
      }
    },
    {
      id: 'preset-telebirr-sheger',
      name: 'Telebirr QR: Sheger Coffee (ሸገር ቡና)',
      type: 'PAYMENT_CODE' as const,
      icon: <Smartphone className="text-cyan-500" size={18} />,
      badge: t.types.telebirr,
      desc: 'Telebirr Till Number: 884021. Cost: 450 ETB.',
      data: {
        merchantName: 'Sheger Coffee Importers',
        amount: 450,
        reference: 'TEL-MERCH-884021',
        provider: 'Telebirr' as const
      }
    },
    {
      id: 'preset-cbe-telecom',
      name: 'CBE Pay QR: Ethio Telecom Bill',
      type: 'PAYMENT_CODE' as const,
      icon: <Landmark className="text-emerald-600" size={18} />,
      badge: t.types.cbe,
      desc: 'CBE Pay merchant portal code. Bill: 1,250 ETB.',
      data: {
        merchantName: 'Ethio Telecom Bill Portal',
        amount: 1250,
        reference: 'CBE-BILL-904128',
        provider: 'CBE' as const
      }
    },
    {
      id: 'preset-p2p-yared',
      name: 'Every-Zone QR: Transfer to Yared Hailu',
      type: 'TRANSFER_CODE' as const,
      icon: <QrCode className="text-indigo-500" size={18} />,
      badge: t.types.p2p,
      desc: 'Safe P2P transfer destination code for user-7730.',
      data: {
        recipientId: 'usr-7730',
        recipientName: 'Yared Hailu',
        amount: 800,
        reference: 'EZ-P2P-773012'
      }
    },
    {
      id: 'preset-passport-ticket',
      name: 'Passport Ticket QR: EVZ-PASS-9403',
      type: 'PASSPORT_TICKET' as const,
      icon: <FileText className="text-amber-500" size={18} />,
      badge: t.types.passport,
      desc: 'Physical receipt barcode for fast check-in tracking search.',
      data: {
        ticketId: 'EVZ-PASS-9403'
      }
    },
    {
      id: 'preset-passport-ticket2',
      name: 'Passport Ticket QR: EVZ-PASS-1024',
      type: 'PASSPORT_TICKET' as const,
      icon: <FileText className="text-amber-500" size={18} />,
      badge: t.types.passport,
      desc: 'Physical receipt barcode for appointment tracking #1024.',
      data: {
        ticketId: 'EVZ-PASS-1024'
      }
    },
    {
      id: 'preset-vendor-v1',
      name: 'Merchant QR: Makeda Royal Weaving',
      type: 'MARKETPLACE_VENDOR' as const,
      icon: <QrCode className="text-amber-600" size={18} />,
      badge: t.types.vendor,
      desc: 'Scan to view Almaz Tekle\'s royal handwoven Habesha clothing store.',
      data: {
        vendorId: 'v1',
        merchantName: 'Makeda Royal Weaving'
      }
    },
    {
      id: 'preset-vendor-v2',
      name: 'Merchant QR: Makeda Specialty Coffee',
      type: 'MARKETPLACE_VENDOR' as const,
      icon: <QrCode className="text-amber-800" size={18} />,
      badge: t.types.vendor,
      desc: 'Scan to open Makeda Organic Yirgacheffe & Sidamo Specialty Coffee storefront.',
      data: {
        vendorId: 'v2',
        merchantName: 'Makeda Specialty Coffee'
      }
    },
    {
      id: 'preset-product-l1',
      name: 'Product QR: Golden Habesha Kemis',
      type: 'MARKETPLACE_PRODUCT' as const,
      icon: <QrCode className="text-rose-500" size={18} />,
      badge: t.types.product,
      desc: 'Scan to locate the Golden Habesha Kemis and redirect to its owner: Makeda Royal Weaving.',
      data: {
        productId: 'l1',
        productTitle: 'Premium Hand-spun Golden Habesha Kemis',
        vendorId: 'v1'
      }
    },
    {
      id: 'preset-product-l3-iphone',
      name: 'Product QR: Apple iPhone 15 Pro Max',
      type: 'MARKETPLACE_PRODUCT' as const,
      icon: <QrCode className="text-blue-500" size={18} />,
      badge: t.types.product,
      desc: 'Scan to locate the Apple iPhone 15 Pro Max and view its seller: Makeda Royal Weaving.',
      data: {
        productId: 'l3_iphone',
        productTitle: 'Apple iPhone 15 Pro Max',
        vendorId: 'v1'
      }
    }
  ];

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    const newTorchState = !torchOn;
    try {
      await videoTrack.applyConstraints({
        advanced: [{ torch: newTorchState } as any]
      });
      
      // Update local state based on actual track setting or fallback
      const settings = (videoTrack.getSettings && videoTrack.getSettings()) || {};
      if ('torch' in settings) {
        setTorchOn(!!(settings as any).torch);
      } else {
        setTorchOn(newTorchState);
      }
    } catch (err) {
      console.warn("Torch/Flashlight not supported on this device/browser:", err);
      // Fallback for UI visualization/testing even if browser/emulator doesn't support physical torch
      setTorchOn(newTorchState);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraState('loading');
    setTorchOn(false);
    setHasTorch(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraState('active');
      setIsScanning(true);

      // Inspect track settings and capabilities to detect torch support & state
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities && videoTrack.getCapabilities()) || {};
        const supportsTorch = 'torch' in capabilities;
        setHasTorch(supportsTorch);

        const settings = (videoTrack.getSettings && videoTrack.getSettings()) || {};
        if ('torch' in settings) {
          setTorchOn(!!(settings as any).torch);
        }
      } else {
        setHasTorch(false);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraState('denied');
      setHasTorch(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    setIsScanning(false);
    setTorchOn(false);
    setHasTorch(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  };

  // Trigger camera on tab switch or open
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'camera') {
        startCamera();
      } else {
        stopCamera();
      }
    }
    return () => stopCamera();
  }, [activeTab, isOpen]);

  // Handle Scan trigger from camera (simulation)
  const handleCameraCapture = () => {
    if (cameraState !== 'active') return;
    
    // Pick a random preset to simulate scanning a real item
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    triggerScanSuccess(randomPreset);
  };

  // Handle preset clicks
  const handlePresetSelect = (preset: typeof presets[0]) => {
    triggerScanSuccess(preset);
  };

  // Drag and drop logic
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUploadScan(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUploadScan(e.target.files[0].name);
    }
  };

  const simulateFileUploadScan = (fileName: string) => {
    setIsScanning(true);
    setScannedFeedback('Processing file structure...');
    
    setTimeout(() => {
      // Intelligently map based on keyword in file name, or default to Fayda ID
      let matchedPreset = presets[0]; // Default Abebe
      const nameLower = fileName.toLowerCase();
      
      if (nameLower.includes('tele') || nameLower.includes('payment') || nameLower.includes('qr')) {
        matchedPreset = presets[2]; // Sheger telebirr
      } else if (nameLower.includes('cbe') || nameLower.includes('bank') || nameLower.includes('invoice')) {
        matchedPreset = presets[3]; // CBE telecom
      } else if (nameLower.includes('pass') || nameLower.includes('ticket') || nameLower.includes('receipt')) {
        matchedPreset = presets[5]; // EVZ-PASS-9403
      } else if (nameLower.includes('aster') || nameLower.includes('kassa')) {
        matchedPreset = presets[1]; // Aster
      } else if (nameLower.includes('yared') || nameLower.includes('transfer')) {
        matchedPreset = presets[4]; // Yared
      }

      triggerScanSuccess(matchedPreset);
    }, 1500);
  };

  const playBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // 440Hz beep for standard feedback
      
      // Prevent clicking by ramping gain up and down within the 100ms window
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01); // 10ms ramp up
      gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.08); // Stay at volume until 80ms
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.10); // 20ms ramp down to silence at 100ms
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.10); // Stop oscillator at exactly 100ms
    } catch (e) {
      console.warn("Web Audio API beep not supported or blocked by user gesture:", e);
    }
  };

  const triggerScanSuccess = (preset: typeof presets[0]) => {
    if (isOffline) {
      queueScan(preset);
      return;
    }

    setScannedFeedback(`${t.scanned}: ${preset.name}`);
    setIsScanning(false);
    
    // Play a brief sound indicator or vibration if supported
    playBeep();
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    setTimeout(() => {
      setScannedFeedback(null);
      stopCamera();
      onClose();
      // Pass the success payload up
      onScanSuccess({
        type: preset.type,
        data: preset.data
      });
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl relative flex flex-col max-h-[90vh] ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1E3A1A]/10 dark:bg-amber-400/15 rounded-xl text-[#C5A059]">
              {activeTab === 'image_search' ? (
                <Camera size={20} className="animate-pulse" />
              ) : (
                <QrCode size={20} className="animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">
                {activeTab === 'image_search' 
                  ? (lang === 'en' ? 'Every-Zone AI Visual Product Finder' : 'የኤቭሪ-ዞን AI ምስላዊ ምርት መፈለጊያ')
                  : t.title}
              </h3>
              <p className="text-[10px] opacity-65 leading-tight">
                {activeTab === 'image_search'
                  ? (lang === 'en' ? 'Upload or select any product image to find matching marketplace items' : 'የምርት ፎቶ በመስቀል በገበያችን ውስጥ ያሉትን ተመሳሳይ እቃዎች ያግኙ')
                  : t.subtitle}
              </p>
            </div>
          </div>
          <button 
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-100 dark:border-zinc-800 text-xs font-bold overflow-x-auto whitespace-nowrap">
          <button
            type="button"
            onClick={() => setActiveTab('image_search')}
            className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 ${
              activeTab === 'image_search' 
                ? 'border-[#C5A059] text-[#C5A059] bg-stone-50/50 dark:bg-zinc-950/20' 
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            🖼️ {lang === 'en' ? 'AI Image Search' : 'የምስል ፍለጋ'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 ${
              activeTab === 'presets' 
                ? 'border-[#C5A059] text-[#C5A059] bg-stone-50/50 dark:bg-zinc-950/20' 
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            📋 {t.tabs.presets}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 ${
              activeTab === 'camera' 
                ? 'border-[#C5A059] text-[#C5A059] bg-stone-50/50 dark:bg-zinc-950/20' 
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            📷 {t.tabs.camera}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 ${
              activeTab === 'upload' 
                ? 'border-[#C5A059] text-[#C5A059] bg-stone-50/50 dark:bg-zinc-950/20' 
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            📤 {t.tabs.upload}
          </button>
        </div>

        {/* Network Status / Simulated Outage Panel */}
        <div className={`px-4 py-2 border-b flex items-center justify-between text-[11px] font-sans ${
          isOffline 
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' 
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
        }`}>
          <div className="flex items-center gap-1.5 font-bold">
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span>
              {isOffline 
                ? `${lang === 'am' ? 'ከመስመር ውጭ (ወረፋ ገቢሯል)' : 'Offline State Detected (Queuing Active)'}` 
                : `${lang === 'am' ? 'መስመር ላይ (ቅጽበታዊ ማስተላለፍ)' : 'Online State (Instant Processing)'}`}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleOfflineSimulation}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase transition-all shadow-xs cursor-pointer ${
              isOffline 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600' 
                : 'bg-amber-500 hover:bg-amber-600 text-zinc-950 border border-amber-600'
            }`}
          >
            {isOffline 
              ? `${lang === 'am' ? 'ማስተላለፊያ አስነሳ (መስመር ላይ)' : '🔌 Simulated Connect Online'}` 
              : `${lang === 'am' ? 'ከመስመር ውጭ አስመስል' : '⚠️ Simulate Network Outage'}`}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
          
          {/* TAB 0: AI IMAGE SEARCH */}
          {activeTab === 'image_search' && (
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (handleImageSearch) handleImageSearch(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className={`p-8 border-2 border-dashed rounded-3xl text-center flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-zinc-800 bg-zinc-950/40 hover:border-[#C5A059]' 
                    : 'border-stone-200 bg-stone-50/50 hover:border-[#C5A059]'
                }`}
              >
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200/50 dark:border-zinc-800 shadow-sm">
                  <Camera size={24} className="text-[#C5A059]" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[11.5px] font-bold block">
                    {lang === 'en' ? 'Drag & drop image here, or click to browse' : 'ምስሉን እዚህ ይጎትቱት ወይም ይምረጡት'}
                  </span>
                  <span className="text-[9.5px] opacity-50 block max-w-xs mx-auto leading-normal">
                    {lang === 'en' ? 'Supports PNG, JPG, or WEBP (Max 10MB)' : 'PNG, JPG ወይም WEBP ምስሎች (ከ 10MB በታች)'}
                  </span>
                </div>

                <label className="px-3.5 py-1.5 bg-[#1E3A1A] text-white rounded-xl text-[10.5px] font-bold uppercase cursor-pointer hover:bg-[#1E3A1A]/95 active:scale-95 transition-all">
                  {lang === 'en' ? 'Browse Files' : 'ፎቶ ምረጥ'}
                  <input 
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (handleImageSearch) handleImageSearch(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Loader */}
              {imageSearchLoading && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
                  <RotateCw className="animate-spin mx-auto text-amber-500" size={20} />
                  <p className="text-xs font-bold text-amber-500 animate-pulse">
                    {lang === 'en' ? 'AI Vision Model analyzing image structures...' : 'AI ምስላዊ መፈለጊያው ምርቱን በመተንተን ላይ ነው...'}
                  </p>
                </div>
              )}

              {/* Custom High-Quality Simulation Presets for Testing */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-extrabold uppercase text-amber-500 tracking-wider">
                    🎁 {lang === 'en' ? 'High-fidelity Demo Images' : 'ለሙከራ የሚሆኑ ምስሎች'}
                  </span>
                  <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full uppercase font-mono">1-Click Test</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Preset 1: Habesha Dress */}
                  <button
                    onClick={() => {
                      if (handleImageSearch) handleImageSearch("data:image/jpeg;base64,habeshakemisdummydata123456");
                    }}
                    className={`p-2 rounded-xl border text-left flex gap-2.5 items-center cursor-pointer transition-all ${
                      isDarkMode 
                        ? 'bg-zinc-950/40 border-zinc-800 hover:border-amber-500' 
                        : 'bg-stone-50 border-stone-200 hover:border-[#1E3A1A]'
                    }`}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                      alt="Habesha" 
                      className="w-10 h-10 rounded-lg object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h5 className="text-[10px] font-bold truncate">Habesha Kemis</h5>
                      <p className="text-[8px] opacity-60">Traditional Wear</p>
                    </div>
                  </button>

                  {/* Preset 2: iPhone */}
                  <button
                    onClick={() => {
                      if (handleImageSearch) handleImageSearch("data:image/jpeg;base64,iphonedummydata12345");
                    }}
                    className={`p-2 rounded-xl border text-left flex gap-2.5 items-center cursor-pointer transition-all ${
                      isDarkMode 
                        ? 'bg-zinc-950/40 border-zinc-800 hover:border-amber-500' 
                        : 'bg-stone-50 border-stone-200 hover:border-[#1E3A1A]'
                    }`}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=200" 
                      alt="iPhone" 
                      className="w-10 h-10 rounded-lg object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h5 className="text-[10px] font-bold truncate">iPhone 15 Pro</h5>
                      <p className="text-[8px] opacity-60">Electronics</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-extrabold text-[#C5A059] uppercase">{t.presetsTitle}</h4>
                <p className="text-[10px] opacity-75 mt-0.5">{t.presetsDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-3 text-left rounded-2xl border flex items-start gap-3 transition-all duration-200 cursor-pointer active:scale-98 ${
                      isDarkMode 
                        ? 'bg-zinc-950/40 border-zinc-800 hover:border-[#C5A059] hover:bg-zinc-950' 
                        : 'bg-stone-50/75 border-stone-200 hover:border-[#C5A059] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/50 dark:border-zinc-800 shrink-0">
                      {preset.icon}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="inline-block text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-[#1E3A1A]/10 text-[#C5A059] border border-[#C5A059]/20">
                        {preset.badge}
                      </span>
                      <h5 className="text-[11.5px] font-bold tracking-tight truncate text-stone-850 dark:text-zinc-100">{preset.name}</h5>
                      <p className="text-[9.5px] opacity-60 leading-normal line-clamp-2">{preset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CAMERA */}
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Target Frame Area */}
              <div className="w-full max-w-sm aspect-video sm:aspect-square rounded-2xl border border-stone-300 dark:border-zinc-800 relative overflow-hidden bg-black flex items-center justify-center">
                {cameraState === 'loading' && (
                  <div className="text-center p-4 space-y-2 text-zinc-400">
                    <RotateCw className="animate-spin mx-auto text-amber-500" size={24} />
                    <p className="text-[11px]">{t.cameraLoading}</p>
                  </div>
                )}

                {cameraState === 'denied' && (
                  <div className="text-center p-6 space-y-3 text-zinc-400">
                    <AlertCircle className="mx-auto text-red-500" size={28} />
                    <p className="text-[10px] leading-relaxed max-w-xs">{t.cameraDenied}</p>
                  </div>
                )}

                {cameraState === 'active' && (
                  <>
                    {/* Live Video Stream */}
                    <video 
                      ref={videoRef} 
                      playsInline 
                      muted 
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* SEMI-TRANSPARENT DARK BACKGROUND OVERLAY with centered viewfinder and close button */}
                    <div id="scanner-overlay" className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-between p-4 z-20">
                      {/* Top bar with Flash toggle and Close button */}
                      <div className="w-full flex justify-between items-center">
                        {/* Flash Toggle Button */}
                        <button
                          onClick={toggleTorch}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all border flex items-center gap-1.5 cursor-pointer ${
                            torchOn 
                              ? 'bg-amber-400 text-zinc-950 border-amber-500 hover:bg-amber-300' 
                              : 'bg-zinc-900/80 text-white border-zinc-700/50 hover:bg-zinc-800'
                          }`}
                          title={hasTorch === false ? "Flashlight simulated (unsupported in this browser sandbox)" : "Toggle Flashlight / Torch"}
                        >
                          {torchOn ? <Zap size={11} /> : <ZapOff size={11} />}
                          {lang === 'am' ? 'ፍላሽ' : 'Flash'}
                          {hasTorch === false && <span className="opacity-60 text-[8px] lowercase font-normal">(simulated)</span>}
                        </button>

                        {/* Close Button */}
                        <button
                          onClick={() => { stopCamera(); onClose(); }}
                          className="px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all border border-zinc-700/50 flex items-center gap-1 cursor-pointer"
                        >
                          <X size={12} />
                          {lang === 'am' ? 'ዝጋ' : 'Close'}
                        </button>
                      </div>

                      {/* Centered camera viewfinder */}
                      <div className="relative w-40 h-40 sm:w-48 sm:h-48 border-2 border-dashed border-amber-400 rounded-3xl flex items-center justify-center bg-black/30 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        {/* Scanning Laser Line */}
                        {isScanning && (
                          <motion.div 
                            initial={{ y: 0 }}
                            animate={{ y: ['0%', '100%', '0%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10"
                          />
                        )}

                        {/* Corner Reticles inside viewfinder */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl-md"></div>
                        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-md"></div>
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-md"></div>
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br-md"></div>
                        
                        <span className="text-[9px] font-bold text-zinc-400/80 uppercase tracking-widest text-center select-none pointer-events-none p-2 leading-tight">
                          {lang === 'am' ? 'ኮዱን እዚህ ያስገቡ' : 'Align Code Here'}
                        </span>
                      </div>

                      {/* Quick Trigger / Start Scanning button */}
                      <button
                        onClick={handleCameraCapture}
                        className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F4E] text-zinc-950 font-black text-[10px] uppercase tracking-wider rounded-xl shadow-lg border border-amber-600/20 active:scale-95 transition-all z-20 flex items-center gap-1.5 cursor-pointer mb-2"
                      >
                        <Camera size={12} />
                        {t.startScanning}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center text-[10.5px] opacity-75 max-w-md">
                <p className="font-bold">{t.cameraLabel}</p>
                <p className="text-[9px] opacity-50 mt-1">If camera permission doesn't stream, feel free to use the "Ethiopian Document Presets" tab to instantly trigger auto-matching behaviors.</p>
              </div>
            </div>
          )}

          {/* TAB 3: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`p-8 border-2 border-dashed rounded-3xl text-center flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all duration-200 ${
                  dragActive 
                    ? 'border-amber-500 bg-amber-500/5' 
                    : isDarkMode 
                      ? 'border-zinc-800 bg-zinc-950/40 hover:border-[#C5A059]' 
                      : 'border-stone-200 bg-stone-50/50 hover:border-[#C5A059]'
                }`}
              >
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200/50 dark:border-zinc-800 shadow-sm text-stone-400">
                  <Upload size={24} className="text-[#C5A059]" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[11.5px] font-bold block">{t.uploadLabel}</span>
                  <span className="text-[9.5px] opacity-50 block max-w-xs mx-auto leading-normal">{t.uploadSub}</span>
                </div>

                <label className="px-3.5 py-1.5 bg-[#1E3A1A] text-white rounded-xl text-[10.5px] font-bold uppercase cursor-pointer hover:bg-emerald-850 active:scale-95 transition-all">
                  Browse Files
                  <input 
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Guide tips */}
              <div className="p-3 bg-stone-100 dark:bg-zinc-950/50 rounded-2xl border border-stone-200 dark:border-zinc-850/50 text-[10px] space-y-1">
                <span className="font-extrabold uppercase text-amber-500 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Safe Document OCR Parser
                </span>
                <p className="opacity-70 leading-normal text-stone-500">Every-zone decodes document QR/Barcodes securely on your local sandbox environment. Data coordinates are immediately bound to your active Passport appointment or Wallet payment forms without intermediate cloud leaks.</p>
              </div>
            </div>
          )}

          {/* Queued Offline Scans Section */}
          {queuedScans.length > 0 && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-amber-500 uppercase flex items-center gap-1">
                  <QrCode size={13} />
                  Queued Offline Scans ({queuedScans.length})
                </span>
                <button
                  onClick={handleClearQueue}
                  className="text-[9px] font-bold text-red-500 hover:underline uppercase cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto font-sans">
                {queuedScans.map((item) => (
                  <div key={item.id} className="p-2 bg-stone-100 dark:bg-zinc-950/60 rounded-xl border border-stone-200/50 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-mono uppercase px-1 rounded bg-[#C5A059]/10 text-[#C5A059]">{item.type}</span>
                      <h6 className="font-bold text-[11px] mt-0.5 text-stone-850 dark:text-zinc-100">{item.name}</h6>
                    </div>
                    <div className="flex items-center gap-1">
                      {!isOffline && (
                        <button
                          onClick={() => handleProcessQueuedItem(item)}
                          className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[9px] font-bold uppercase cursor-pointer"
                        >
                          Process
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const updated = queuedScans.filter((q) => q.id !== item.id);
                          localStorage.setItem('ez_queued_scans', JSON.stringify(updated));
                          setQueuedScans(updated);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Scan Status Overlay Feed */}
        <AnimatePresence>
          {(isScanning || scannedFeedback) && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-white z-50 flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <CheckCircle2 size={14} className="animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] text-emerald-500 uppercase font-mono font-black block tracking-wider">
                  {isScanning ? t.scanning : t.scanned}
                </span>
                <span className="text-xs font-bold font-sans block truncate leading-tight text-zinc-300">
                  {scannedFeedback || t.scanning}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
