import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Video, Navigation, ShieldCheck, Clock, Layers, Play, Pause,
  Volume2, VolumeX, Eye, Heart, MessageSquare, Share2, ArrowRight, Zap, Check
} from 'lucide-react';

interface MapPinItem {
  id: string;
  name: string;
  category: 'shop' | 'house' | 'vendor' | 'agency' | 'delivery' | 'service';
  lat: number; // custom grid coordinates
  lng: number;
  meta: string;
  contact: string;
}

const SEED_PINS: Record<string, MapPinItem[]> = {
  ET: [
    { id: 'pin-et-1', name: 'Abebe Tibeb Shop (Bole Hub)', category: 'shop', lat: 35, lng: 40, meta: 'Authentic Habesha Silks', contact: '+251 911 004 812' },
    { id: 'pin-et-2', name: 'Atlas Heights Luxury Loft', category: 'house', lat: 55, lng: 60, meta: '2 Bed Modern Apartment', contact: '+251 912 345 678' },
    { id: 'pin-et-3', name: 'Makeda Specialty Roastery', category: 'vendor', lat: 20, lng: 70, meta: 'Sidama Micro-lot Coffee', contact: '+251 911 888 999' },
    { id: 'pin-et-4', name: 'Horizon Placements (Bole)', category: 'agency', lat: 45, lng: 25, meta: 'Overseas Visa Quotas', contact: '+251 922 111 222' },
    { id: 'pin-et-5', name: 'Sheger Courier Express #12', category: 'delivery', lat: 30, lng: 55, meta: 'Transit: Escrow Hand-off', contact: 'Rider: Kidus S.' },
    { id: 'pin-et-6', name: 'Bole Cultural Café & Lounge', category: 'service', lat: 65, lng: 45, meta: 'Matchmaking Coffee Venue', contact: 'Verified Host' }
  ],
  KE: [
    { id: 'pin-ke-1', name: 'Nairobi Crafts (Westlands)', category: 'shop', lat: 40, lng: 45, meta: 'Maasai Handlooms & Beads', contact: '+254 711 000 111' },
    { id: 'pin-ke-2', name: 'Oysterbay Condo Nairobi Outpost', category: 'house', lat: 60, lng: 50, meta: 'Penthouse Apartment', contact: '+254 722 000 222' },
    { id: 'pin-ke-3', name: 'Mombasa Specialty Tea & Beans', category: 'vendor', lat: 25, lng: 80, meta: 'Specialty Arabica & Spices', contact: '+254 733 000 333' },
    { id: 'pin-ke-4', name: 'Nairobi Talent Link', category: 'agency', lat: 50, lng: 30, meta: 'Hospitality Contract Visas', contact: '+254 744 000 444' },
    { id: 'pin-ke-5', name: 'BodaBoda Express Courier #88', category: 'delivery', lat: 35, lng: 65, meta: 'Transit: Escrow Delivery', contact: 'Rider: Juma K.' }
  ],
  UG: [
    { id: 'pin-ug-1', name: 'Kampala Handloom Co.', category: 'shop', lat: 30, lng: 50, meta: 'Traditional Ugandan Wear', contact: '+256 701 111 222' },
    { id: 'pin-ug-2', name: 'Kololo Heights Penthouse', category: 'house', lat: 50, lng: 55, meta: 'Premium 3-Bedroom Loft', contact: '+256 702 333 444' },
    { id: 'pin-ug-3', name: 'Horizon Recruitment Kampala', category: 'agency', lat: 45, lng: 40, meta: 'Middle-East Delivery Drivers', contact: '+256 703 555 666' }
  ],
  RW: [
    { id: 'pin-rw-1', name: 'Kigali Art Hub (Nyarutarama)', category: 'shop', lat: 35, lng: 45, meta: 'Premium Handcrafted Pottery', contact: '+250 788 123 456' },
    { id: 'pin-rw-2', name: 'Kigali Heights Office Condo', category: 'house', lat: 55, lng: 60, meta: 'Corporate Exec Suites', contact: '+250 788 456 789' }
  ],
  TZ: [
    { id: 'pin-tz-1', name: 'Dar Handcrafts (Oysterbay)', category: 'shop', lat: 40, lng: 40, meta: 'Kanga & Kitenge Cottons', contact: '+255 712 111 222' },
    { id: 'pin-tz-2', name: 'Msasani Luxury Peninsula Loft', category: 'house', lat: 50, lng: 65, meta: 'Sea-facing Apartments', contact: '+255 712 333 444' }
  ]
};

const SEED_VIDEOS = [
  {
    id: 'vid-1',
    author: 'Abebe Tibeb Handlooms',
    category: 'Crafts Store',
    caption: 'Discover how we craft the golden fringe of our authentic Silk Habesha Dress. Fully handmade in 12 days! 🧵✨',
    views: '4.8k',
    likes: 312,
    duration: '42s',
    url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop',
    actionText: '⚡ Order Silk Dress',
    amount: '14,500 ETB'
  },
  {
    id: 'vid-2',
    author: 'Makeda Royal Coffee',
    category: 'Specialty Vendor',
    caption: 'Washing station reveal in Sidama. See how we meticulously hand-sort only red organic cherries for your cups! ☕🍒',
    views: '12.4k',
    likes: 1042,
    duration: '58s',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    actionText: '🌱 Secure Wholesale Batch',
    amount: '750 ETB/kg'
  },
  {
    id: 'vid-3',
    author: 'Horizon Overseas Agency',
    category: 'Recruiting Placements',
    caption: 'Dubai courier driver orientation contract. Live from our Dubai Logistics center. Secure your passport placement quota! 💼✈️',
    views: '8.1k',
    likes: 644,
    duration: '35s',
    url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop',
    actionText: '💼 Register Passport',
    amount: '5,000 AED/mo'
  },
  {
    id: 'vid-4',
    author: 'Abyssinia Luxury Homes',
    category: 'Real Estate Loft',
    caption: 'Bole Heights duplex tour. Modern smart automation, floor-to-ceiling glass, 24/7 security. Escrow deposit enabled! 🏠🔑',
    views: '6.5k',
    likes: 489,
    duration: '45s',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop',
    actionText: '🏠 Reserve Rent Slot',
    amount: '65,000 ETB/mo'
  }
];

interface EcosystemMapsAndVideosProps {
  isDarkMode: boolean;
  selectedCountry: string;
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  lang: 'en' | 'am';
}

export function EcosystemMapsAndVideos({
  isDarkMode,
  selectedCountry,
  triggerPushNotification,
  lang
}: EcosystemMapsAndVideosProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'videos'>('map');

  // MAP STATE
  const [selectedPinCat, setSelectedPinCat] = useState<'all' | 'shop' | 'house' | 'vendor' | 'agency' | 'delivery' | 'service'>('all');
  const [selectedPin, setSelectedPin] = useState<MapPinItem | null>(null);
  const [liveRiderCoords, setLiveRiderCoords] = useState({ x: 30, y: 55 });
  const [isTrackingLive, setIsTrackingLive] = useState(false);

  // SHORT VIDEOS STATE
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [videoProgress, setVideoProgress] = useState(35); // simulated percent

  const activeCountryPins = SEED_PINS[selectedCountry] || SEED_PINS['ET'];

  // Map Delivery Rider Motion Simulation
  useEffect(() => {
    let interval: any;
    if (isTrackingLive) {
      interval = setInterval(() => {
        setLiveRiderCoords(prev => {
          const dx = (Math.random() - 0.5) * 4;
          const dy = (Math.random() - 0.5) * 4;
          const nx = Math.max(10, Math.min(90, prev.x + dx));
          const ny = Math.max(10, Math.min(90, prev.y + dy));
          return { x: nx, y: ny };
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isTrackingLive]);

  // Video progress bar motion
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress(p => (p >= 100 ? 0 : p + 2));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleLike = (vidId: string, initialLikes: number) => {
    const currentlyLiked = hasLiked[vidId];
    setHasLiked(prev => ({ ...prev, [vidId]: !currentlyLiked }));
    setLikesCount(prev => ({
      ...prev,
      [vidId]: currentlyLiked ? (prev[vidId] || initialLikes) - 1 : (prev[vidId] || initialLikes) + 1
    }));
    if (!currentlyLiked) {
      triggerPushNotification('Video Liked', 'Added to your smart feed favorites list.', '❤️', 'feed');
    }
  };

  return (
    <div className={`p-5 rounded-3xl border ${
      isDarkMode ? 'bg-[#0f0f0f] border-zinc-850' : 'bg-white border-stone-200'
    }`}>
      {/* HEADER SWITCH */}
      <div className="flex justify-between items-center border-b border-zinc-850/60 pb-3 mb-4">
        <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Navigation size={13} />
            <span>{lang === 'en' ? 'Map Everywhere' : 'ካርታ በሁሉም ቦታ'}</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Video size={13} />
            <span>{lang === 'en' ? 'Short Videos Feed' : 'አጫጭር ቪዲዮዎች'}</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-stone-500 flex items-center gap-1.5 uppercase font-bold">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span>Ecosystem v3 Live Nodes</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* MAP EVERYWHERE */}
        {/* ========================================================= */}
        {activeTab === 'map' && (
          <motion.div
            key="map-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {/* Sidebar Pins List */}
            <div className="space-y-4 lg:col-span-1">
              <div>
                <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">Filter Map POIs</span>
                <h3 className="text-sm font-extrabold">{lang === 'en' ? 'Locations List' : 'የአቅጣጫዎች ዝርዝር'}</h3>
              </div>

              {/* Pin Category Filters */}
              <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'shop', label: '🏪 Shop' },
                  { id: 'house', label: '🏠 Rent' },
                  { id: 'vendor', label: '🌱 Micro' },
                  { id: 'agency', label: '💼 Job' },
                  { id: 'delivery', label: '🚴 Courier' },
                  { id: 'service', label: '💑 Meeting' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedPinCat(filter.id as any)}
                    className={`text-[9px] font-bold px-2 py-1 rounded-lg cursor-pointer transition ${
                      selectedPinCat === filter.id
                        ? 'bg-amber-500 text-stone-950'
                        : isDarkMode ? 'bg-zinc-900 text-stone-400' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Pins Container */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {activeCountryPins
                  .filter(p => selectedPinCat === 'all' || p.category === selectedPinCat)
                  .map(pin => (
                    <div
                      key={pin.id}
                      onClick={() => {
                        setSelectedPin(pin);
                        if (pin.category === 'delivery') {
                          setIsTrackingLive(true);
                        } else {
                          setIsTrackingLive(false);
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedPin?.id === pin.id
                          ? 'bg-amber-500/10 border-amber-500/50'
                          : isDarkMode ? 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          <MapPin size={11} className="text-amber-500" />
                          <span>{pin.name}</span>
                        </span>
                        <span className="text-[8px] font-mono uppercase bg-black/40 px-1.5 py-0.5 rounded text-amber-400">
                          {pin.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-medium leading-relaxed">{pin.meta}</p>
                      <div className="flex items-center justify-between text-[9px] text-stone-500 font-mono mt-2">
                        <span>{pin.contact}</span>
                        {pin.category === 'delivery' && (
                          <span className="text-emerald-400 font-bold animate-pulse">● Live Tracking</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Interactive Vector Map Grid Canvas */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className={`relative h-[320px] rounded-3xl border overflow-hidden flex flex-col justify-end p-4 ${
                isDarkMode ? 'bg-[#050505] border-zinc-900' : 'bg-stone-100 border-stone-200'
              }`} style={{ backgroundImage: 'radial-gradient(circle, rgba(197, 160, 89, 0.08) 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                
                {/* Simulated Map Coordinates & City label */}
                <div className="absolute top-4 left-4 bg-black/85 backdrop-blur border border-zinc-800 rounded-2xl p-3 z-10 space-y-1">
                  <span className="text-[8px] font-black uppercase text-amber-500 font-mono tracking-widest block">Geospatial Grid active</span>
                  <h4 className="text-xs font-black flex items-center gap-1">
                    <span>🗺️</span>
                    <span>
                      {selectedCountry === 'ET' ? 'Addis Ababa Bole Hub' : 
                       selectedCountry === 'KE' ? 'Nairobi Westlands Hub' :
                       selectedCountry === 'UG' ? 'Kampala Kololo Outpost' :
                       selectedCountry === 'RW' ? 'Kigali Nyarutarama Hub' : 'Dar es Salaam Oysterbay'}
                    </span>
                  </h4>
                  <p className="text-[9px] text-stone-400 font-mono">EPSG:3857 Latency Offset: 14ms</p>
                </div>

                {/* Simulated Pins Plotted on Grid */}
                {activeCountryPins
                  .filter(p => selectedPinCat === 'all' || p.category === selectedPinCat)
                  .map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPin(p);
                        setIsTrackingLive(p.category === 'delivery');
                      }}
                      className="absolute group z-10 transition-transform hover:scale-125"
                      style={{ top: `${p.lat}%`, left: `${p.lng}%` }}
                    >
                      <div className="relative">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg ${
                          selectedPin?.id === p.id 
                            ? 'bg-amber-500 text-stone-950 scale-110' 
                            : 'bg-zinc-900 border border-zinc-700 text-stone-200'
                        }`}>
                          {p.category === 'shop' ? '🏪' : p.category === 'house' ? '🏠' : p.category === 'vendor' ? '🌱' : p.category === 'agency' ? '💼' : p.category === 'delivery' ? '🚴' : '💑'}
                        </div>
                        {/* Interactive tooltip badge */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 bg-black/95 text-[9px] border border-zinc-800 text-stone-200 px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap font-bold pointer-events-none shadow-xl">
                          {p.name}
                        </div>
                      </div>
                    </button>
                  ))}

                {/* Simulated moving live courier rider */}
                {isTrackingLive && (
                  <div
                    className="absolute z-20 transition-all duration-1000 ease-in-out"
                    style={{ top: `${liveRiderCoords.y}%`, left: `${liveRiderCoords.x}%` }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping"></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs shadow-lg font-bold border border-white">
                        🚴
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 top-9 bg-black text-[8px] text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap shadow-md">
                        EZ Courier Active
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Control overlay overlay */}
                <div className="bg-black/85 backdrop-blur border border-zinc-850 p-3 rounded-2xl w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="text-left">
                    {selectedPin ? (
                      <>
                        <span className="text-[8px] font-black uppercase text-[#C5A059] font-mono">Selected Pointer Target</span>
                        <h5 className="text-xs font-bold text-stone-200">{selectedPin.name}</h5>
                        <p className="text-[10px] text-stone-400 mt-0.5">{selectedPin.meta} • {selectedPin.contact}</p>
                      </>
                    ) : (
                      <>
                        <span className="text-[8px] font-black uppercase text-stone-500 font-mono">POI Diagnostic</span>
                        <h5 className="text-xs font-bold text-stone-400">Tap pointer node to query coordinate detail</h5>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 w-full md:w-auto shrink-0">
                    <button
                      onClick={() => {
                        triggerPushNotification('Escrow Direct Map Route', `Calculated optimal logistics corridor to selected target.`, '🗺️', 'feed');
                      }}
                      className="flex-1 md:flex-none text-[10px] font-black uppercase px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Navigation size={10} />
                      <span>Request Route</span>
                    </button>
                    {selectedPin?.category === 'delivery' && (
                      <button
                        onClick={() => setIsTrackingLive(!isTrackingLive)}
                        className={`text-[10px] font-black uppercase px-3 py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition ${
                          isTrackingLive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500 text-stone-950'
                        }`}
                      >
                        {isTrackingLive ? 'Pause Stream' : 'Trace Live'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* SHORT VIDEOS (Tiktok Style) */}
        {/* ========================================================= */}
        {activeTab === 'videos' && (
          <motion.div
            key="videos-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center"
          >
            <div className={`w-full max-w-2xl grid grid-cols-1 md:grid-cols-5 gap-5`}>
              
              {/* Left Video Selector List */}
              <div className="md:col-span-2 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">Trending Pitches</span>
                  <h3 className="text-xs font-extrabold mb-2">Select Short Pitch</h3>
                </div>

                {SEED_VIDEOS.map((vid, i) => (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setActiveVideoIdx(i);
                      setVideoProgress(15);
                      setIsPlaying(true);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex gap-3 transition-all cursor-pointer ${
                      activeVideoIdx === i
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : isDarkMode ? 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800' : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="w-12 h-14 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 shrink-0 relative">
                      <img src={vid.url} className="w-full h-full object-cover" alt="Thumb" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                        <Play size={10} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-black text-amber-500 uppercase font-mono tracking-wider block">
                        {vid.category}
                      </span>
                      <h4 className="text-xs font-bold truncate text-stone-200">{vid.author}</h4>
                      <p className="text-[10px] text-stone-400 truncate mt-0.5">{vid.caption}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Center Portrait Video Player */}
              <div className="md:col-span-3">
                {(() => {
                  const vid = SEED_VIDEOS[activeVideoIdx];
                  const likes = likesCount[vid.id] || vid.likes;
                  const liked = hasLiked[vid.id] || false;

                  return (
                    <div className={`relative h-[380px] rounded-3xl border overflow-hidden flex flex-col justify-between p-4 ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-stone-100 border-stone-200'
                    }`}>
                      {/* Dark Overlay Mask */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60 pointer-events-none"></div>

                      <img src={vid.url} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90" alt="Video frame background" referrerPolicy="no-referrer" />

                      {/* Top Header Row overlay */}
                      <div className="z-10 flex justify-between items-start">
                        <div className="bg-black/85 border border-zinc-850 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 text-amber-500 font-mono">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                          <span>{vid.category}</span>
                        </div>

                        <div className="flex gap-1.5 z-10">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-1.5 bg-black/80 hover:bg-black border border-zinc-800 rounded-xl text-stone-200 transition cursor-pointer"
                          >
                            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                          </button>
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-1.5 bg-black/80 hover:bg-black border border-zinc-800 rounded-xl text-stone-200 transition cursor-pointer"
                          >
                            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                          </button>
                        </div>
                      </div>

                      {/* Right interaction column overlay */}
                      <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-3.5 items-center">
                        <button
                          onClick={() => toggleLike(vid.id, vid.likes)}
                          className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            liked ? 'bg-red-500 text-white' : 'bg-black/75 hover:bg-black border border-zinc-800 text-stone-200'
                          }`}>
                            <Heart size={14} className={liked ? 'fill-current' : 'group-hover:scale-110'} />
                          </div>
                          <span className="text-[9px] font-mono text-white drop-shadow font-bold">{likes}</span>
                        </button>

                        <button
                          onClick={() => {
                            triggerPushNotification('Simulated Video Comment', 'Comments modal opened.', '💬', 'feed');
                          }}
                          className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-full bg-black/75 hover:bg-black border border-zinc-850 text-stone-200 flex items-center justify-center transition-all">
                            <MessageSquare size={14} className="group-hover:scale-110" />
                          </div>
                          <span className="text-[9px] font-mono text-white drop-shadow font-bold">14</span>
                        </button>

                        <button className="flex flex-col items-center gap-1 group cursor-pointer">
                          <div className="w-9 h-9 rounded-full bg-black/75 hover:bg-black border border-zinc-850 text-stone-200 flex items-center justify-center transition-all">
                            <Share2 size={14} />
                          </div>
                          <span className="text-[9px] font-mono text-white drop-shadow font-bold">Share</span>
                        </button>
                      </div>

                      {/* Bottom captions overlay */}
                      <div className="z-10 space-y-3 mt-auto text-left">
                        <div className="space-y-1 max-w-[80%]">
                          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{vid.author}</span>
                            <span className="bg-amber-500 text-stone-950 text-[7px] font-bold px-1 rounded uppercase tracking-wider">PRO</span>
                          </h4>
                          <p className="text-[10px] text-stone-200 leading-snug drop-shadow-md font-medium">{vid.caption}</p>
                        </div>

                        {/* Direct Escrow Order Overlays */}
                        <div className="bg-black/90 backdrop-blur border border-zinc-850 p-2.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xl">
                          <div className="min-w-0">
                            <span className="text-[8px] font-mono text-stone-500 uppercase block font-bold">Price Listing</span>
                            <span className="text-[11.5px] font-black text-amber-500 font-mono">{vid.amount}</span>
                          </div>

                          <button
                            onClick={() => {
                              triggerPushNotification('Direct Purchase Commited', `Initiated escrow lock verification for ${vid.author} - Amount: ${vid.amount}`, '🛍️', 'feed');
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10px] font-black uppercase px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition shadow"
                          >
                            <Zap size={11} />
                            <span>{vid.actionText}</span>
                          </button>
                        </div>

                        {/* Custom video slider progress timeline */}
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative">
                          <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${videoProgress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
