import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, ShoppingBag, Boxes, Wrench, Video, FileText, MessageSquare, Star, Wallet, 
  LineChart, Settings, TrendingUp, Users, Eye, DollarSign, Check, X, Clock, Sparkles, 
  Plus, Search, ShieldCheck, Percent, ToggleLeft, ToggleRight, Calendar, Landmark, 
  CreditCard, ArrowDownCircle, RefreshCw, Trash2, Edit2, Award, UserCheck, AlertTriangle, 
  Play, ArrowRight, Bookmark, ShieldAlert, Heart, EyeOff, CalendarRange, Copy, Inbox,
  Briefcase, Send, ThumbsUp, SendToBack, Sparkle
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

interface VendorDashboardHubProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  onClose: () => void;
}

type SubTab = 
  | 'dashboard' 
  | 'products' 
  | 'services' 
  | 'orders' 
  | 'customers' 
  | 'posts' 
  | 'videos' 
  | 'messages' 
  | 'reviews' 
  | 'wallet' 
  | 'analytics' 
  | 'settings';

export function VendorDashboardHub({
  isDarkMode,
  lang,
  walletBalance,
  setWalletBalance,
  triggerPushNotification,
  onClose
}: VendorDashboardHubProps) {
  const [activeTab, setActiveTab] = useState<SubTab>('dashboard');

  // --- 1. PERSISTENT WALLET STATE ---
  const [vendorWallet, setVendorWallet] = useState(() => {
    const saved = localStorage.getItem('ez_vendor_wallet_balance_v2');
    return saved ? parseFloat(saved) : 248900;
  });

  const [escrowHold, setEscrowHold] = useState(34500);

  useEffect(() => {
    localStorage.setItem('ez_vendor_wallet_balance_v2', vendorWallet.toString());
  }, [vendorWallet]);

  // --- 2. PRODUCTS STATE (Add, Edit, Duplicate, Stock, Bulk Actions, Variants) ---
  const [products, setProducts] = useState([
    { id: 'p1', name: 'Luxury Habesha Makeda Kemis', price: 4200, stock: 12, views: 540, status: 'Active', category: 'Dresses', variants: ['Ivory Gown', 'Golden Gown'] },
    { id: 'p2', name: 'Organic Yirgacheffe Specialty Grade-1 (2kg)', price: 550, stock: 45, views: 980, status: 'Active', category: 'Coffee', variants: ['Medium Roast', 'Dark Roast'] },
    { id: 'p3', name: 'Zewditu Genuine Handwoven Leather Tote Bag', price: 3200, stock: 4, views: 310, status: 'Active', category: 'Bags', variants: ['Midnight Black', 'Sahara Gold'] },
    { id: 'p4', name: 'Gondar Styled Traditional Crown Bead Set', price: 1800, stock: 0, views: 120, status: 'Draft', category: 'Jewelry', variants: ['Standard'] }
  ]);
  
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  // Form State
  const [prodForm, setProdForm] = useState({ name: '', price: '', stock: '', category: 'Dresses', variants: '' });

  // --- 3. SERVICES STATE (Bookings, Calendar, Pricing) ---
  const [services, setServices] = useState([
    { id: 's1', name: 'Traditional Coffee Ceremony Hosting', price: 7500, status: 'Active', bookings: 14 },
    { id: 's2', name: 'Authentic Ethiopian Meal Prep Cooking Class', price: 4500, status: 'Active', bookings: 22 },
    { id: 's3', name: 'Custom Tailored Habesha Dress Measuring', price: 1200, status: 'Active', bookings: 38 }
  ]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [servicePriceInput, setServicePriceInput] = useState('');
  
  const [bookings, setBookings] = useState([
    { id: 'B-902', service: 'Traditional Coffee Ceremony Hosting', date: '2026-07-06', customer: 'Kidus A.', status: 'Confirmed' },
    { id: 'B-114', service: 'Custom Tailored Habesha Dress Measuring', date: '2026-07-10', customer: 'Marta D.', status: 'Pending Approval' },
    { id: 'B-408', service: 'Authentic Ethiopian Meal Prep Cooking Class', date: '2026-07-15', customer: 'Dawit S.', status: 'Completed' }
  ]);

  const [calendarSlots, setCalendarSlots] = useState<{ [date: string]: 'Available' | 'Unavailable' }>({
    '2026-07-04': 'Available',
    '2026-07-05': 'Available',
    '2026-07-06': 'Unavailable',
    '2026-07-07': 'Available',
    '2026-07-08': 'Available',
    '2026-07-09': 'Available',
    '2026-07-10': 'Unavailable',
    '2026-07-11': 'Available'
  });

  // --- 4. ORDERS STATE (Pending, Processing, Delivered, Cancelled, Returned, Refund Requests) ---
  const [orders, setOrders] = useState([
    { id: 'ORD-9211', title: 'Luxury Habesha Makeda Kemis', qty: 1, total: 4200, status: 'Pending', buyer: 'Selamawit T.', date: '3 hours ago', type: 'Product' },
    { id: 'ORD-8842', title: 'Organic Yirgacheffe Specialty Grade-1 (2kg)', qty: 2, total: 1100, status: 'Processing', buyer: 'Kidus A.', date: '1 day ago', type: 'Product' },
    { id: 'ORD-4912', title: 'Zewditu Genuine Handwoven Leather Tote Bag', qty: 1, total: 3200, status: 'Delivered', buyer: 'Tsige H.', date: '2 days ago', type: 'Product' },
    { id: 'ORD-1011', title: 'Traditional Coffee Ceremony Hosting', qty: 1, total: 7500, status: 'Returned', buyer: 'Betty S.', date: '3 days ago', type: 'Service' },
    { id: 'ORD-3051', title: 'Gondar Styled Traditional Crown Bead Set', qty: 1, total: 1800, status: 'Refund Requests', buyer: 'Dawit L.', date: '5 days ago', type: 'Product' },
    { id: 'ORD-2291', title: 'Luxury Habesha Makeda Kemis', qty: 1, total: 4200, status: 'Cancelled', buyer: 'Amanuel K.', date: '1 week ago', type: 'Product' }
  ]);
  const [orderFilter, setOrderFilter] = useState<'All' | 'Pending' | 'Processing' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refund Requests'>('All');

  // --- 5. CUSTOMERS STATE (Followers, Repeat Customers, VIP Customers, Blocked Customers) ---
  const [customers, setCustomers] = useState([
    { id: 'c1', name: 'Selamawit Tekle', email: 'selam@everyzone.et', type: 'VIP', ordersCount: 8, spend: 33600, followed: true, blocked: false },
    { id: 'c2', name: 'Kidus Abera', email: 'kidus@everyzone.et', type: 'Repeat', ordersCount: 4, spend: 12200, followed: true, blocked: false },
    { id: 'c3', name: 'Tsige Haile', email: 'tsige@everyzone.et', type: 'VIP', ordersCount: 6, spend: 19200, followed: true, blocked: false },
    { id: 'c4', name: 'Almaz Belay', email: 'almaz@everyzone.et', type: 'Follower', ordersCount: 1, spend: 4200, followed: true, blocked: false },
    { id: 'c5', name: 'Yared Tadesse', email: 'yared@spam.com', type: 'Blocked', ordersCount: 0, spend: 0, followed: false, blocked: true }
  ]);
  const [customerSegment, setCustomerSegment] = useState<'Followers' | 'Repeat' | 'VIP' | 'Blocked'>('Followers');

  // --- 6. POSTS STATE (Create, Schedule, Pin, Archive) ---
  const [posts, setPosts] = useState([
    { id: 'post1', text: '🎨 Elegant traditional handwoven Habesha Kemis customized to your exact dimensions now open for booking! Use code KEMIS15.', views: 1240, likes: 210, status: 'Pinned', scheduledFor: null },
    { id: 'post2', text: '☕ Just roasted! Organic Grade-1 Yirgacheffe specialty coffee beans. Smell the real Addis aroma.', views: 850, likes: 145, status: 'Published', scheduledFor: null },
    { id: 'post3', text: '✨ Flash sale coming this weekend for leather bags! Stay tuned.', views: 0, likes: 0, status: 'Scheduled', scheduledFor: '2026-07-10' },
    { id: 'post4', text: 'Archived promotional update on spring jewelry sets.', views: 320, likes: 45, status: 'Archived', scheduledFor: null }
  ]);
  const [newPostText, setNewPostText] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  // --- 7. VIDEOS STATE (Upload, Analytics, Comments) ---
  const [videos, setVideos] = useState([
    { id: 'v1', title: 'Unboxing Makeda Royal Habesha Gowns Live!', views: 4820, likes: 920, ctr: '8.4%', commentsCount: 12, url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
    { id: 'v2', title: 'Behind the scenes: Roasting Sidamo specialty coffee beans', views: 3250, likes: 710, ctr: '12.1%', commentsCount: 6, url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=200' }
  ]);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [videoComments, setVideoComments] = useState([
    { id: 'vc1', videoId: 'v1', user: 'Selamawit T.', comment: 'This golden embroidery looks amazing!', reply: '' },
    { id: 'vc2', videoId: 'v1', user: 'Aster L.', comment: 'Is it available in blue accent?', reply: '' },
    { id: 'vc3', videoId: 'v2', user: 'Dawit S.', comment: 'Smells amazing already through the video!', reply: 'We roast daily!' }
  ]);
  const [commentReplyText, setCommentReplyText] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  // --- 8. MESSAGES STATE (Inbox, Quick Replies, Auto Replies) ---
  const [chats, setChats] = useState([
    { id: 'chat1', sender: 'Selamawit Tekle', preview: 'Can I get the Habesha Dress custom tailored in size XL?', date: '10 mins ago', unread: true, thread: [
      { sender: 'Selamawit Tekle', text: 'Hi, I love your Makeda gown collection.' },
      { sender: 'You', text: 'Thank you! Yes, we tailor according to your sizes.' },
      { sender: 'Selamawit Tekle', text: 'Can I get the Habesha Dress custom tailored in size XL?' }
    ]},
    { id: 'chat2', sender: 'Kidus Abera', preview: 'Is the Yirgacheffe medium roast currently in stock?', date: '2 hours ago', unread: false, thread: [
      { sender: 'Kidus Abera', text: 'Hello, is the Yirgacheffe medium roast currently in stock?' }
    ]}
  ]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('chat1');
  const [messageReplyText, setMessageReplyText] = useState('');
  
  const [quickReplies] = useState([
    'Yes, we currently have this item in stock!',
    'Our typical custom tailoring process takes 5-7 working days.',
    'Every-zone Secure Escrow guarantees instant full refund if you are not satisfied.',
    'Our physical warehouse is situated around Bole Medhanialem, Addis Ababa.'
  ]);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [autoReplyMessage, setAutoReplyMessage] = useState('Thank you for contacting Every-zone Merchant! We are currently busy with deliveries but our system will notify you shortly.');

  // --- 9. REVIEWS STATE & AI COGNITIVE REPLY ---
  const [reviews, setReviews] = useState([
    { id: 'rev1', user: 'Selamawit Tekle', rating: 5, text: 'Absolutely mesmerizing Habesha gown. Extremely rich premium embroidery!', date: 'Today', reply: '' },
    { id: 'rev2', user: 'Dawit K.', rating: 4, text: 'Escrow payment went very smooth. Sidamo coffee beans have premium aroma. Shipping took 1 day extra.', date: '2 days ago', reply: 'Thank you for the wonderful feedback! We will improve delivery speed.' }
  ]);

  // --- 10. WALLET & INVOICES ---
  const [transactions, setTransactions] = useState([
    { id: 'TX-921', type: 'Escrow Release', description: 'Order ORD-4912 payout release', amount: 3200, date: '2026-07-02', status: 'Completed' },
    { id: 'TX-804', type: 'Payout Withdrawal', description: 'Telebirr payout transfer', amount: -15000, date: '2026-06-29', status: 'Completed' },
    { id: 'TX-115', type: 'Store Sale Deposit', description: 'Order ORD-8842 escrow lock', amount: 1100, date: '2026-07-03', status: 'Escrow Lock' }
  ]);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawChannel, setWithdrawChannel] = useState<'TELEBIRR' | 'CBE' | 'CHAPA'>('TELEBIRR');
  const [withdrawAmount, setWithdrawAmount] = useState('10000');
  const [withdrawPhone, setWithdrawPhone] = useState('0911223344');
  const [withdrawAccount, setWithdrawAccount] = useState('1000234192452');
  const [withdrawStep, setWithdrawStep] = useState<'idle' | 'processing' | 'completed'>('idle');

  // --- 11. ANALYTICS CHART DATA ---
  const revenueChartData = [
    { name: 'Mon', revenue: 45000, escrow: 12000 },
    { name: 'Tue', revenue: 59000, escrow: 18000 },
    { name: 'Wed', revenue: 46200, escrow: 15000 },
    { name: 'Thu', revenue: 74500, escrow: 22000 },
    { name: 'Fri', revenue: 91000, escrow: 29000 },
    { name: 'Sat', revenue: 88500, escrow: 24000 },
    { name: 'Sun', revenue: 103400, escrow: 31000 }
  ];

  const salesChartData = [
    { name: 'Week 1', sales: 42 },
    { name: 'Week 2', sales: 68 },
    { name: 'Week 3', sales: 95 },
    { name: 'Week 4', sales: 124 }
  ];

  const conversionRateData = [
    { name: 'Bounced', value: 35 },
    { name: 'Browsing Only', value: 45 },
    { name: 'Added to Cart', value: 12 },
    { name: 'Purchased (Escrow)', value: 8 }
  ];

  const COLORS = ['#1E293B', '#475569', '#F59E0B', '#10B981'];

  // --- 12. STORE SETTINGS ---
  const [businessHours, setBusinessHours] = useState('08:00 AM - 08:00 PM');
  const [vacationMode, setVacationMode] = useState(false);
  const [shippingFee, setShippingFee] = useState(150);
  const [coupons, setCoupons] = useState([
    { code: 'MAKEDAVIP', value: '15%', type: 'Percentage', active: true },
    { code: 'ADDISFREE', value: '150', type: 'Fixed ETB', active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState('10%');

  // Multi-Step / Bulk Actions State
  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'Activate' | 'Draft' | 'Delete' | 'PriceIncrease') => {
    if (selectedProductIds.length === 0) {
      alert('No products selected.');
      return;
    }
    setProducts(prev => prev.map(p => {
      if (selectedProductIds.includes(p.id)) {
        if (action === 'Activate') return { ...p, status: 'Active' };
        if (action === 'Draft') return { ...p, status: 'Draft' };
        if (action === 'PriceIncrease') return { ...p, price: Math.round(p.price * 1.1) };
      }
      return p;
    }).filter(p => !(action === 'Delete' && selectedProductIds.includes(p.id))));
    
    setSelectedProductIds([]);
    triggerPushNotification('⚡ Bulk Operations Executed', `Bulk modified ${selectedProductIds.length} catalog items successfully.`, '⚡', 'vendor');
  };

  const handleDuplicateProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const duplicated = {
      ...prod,
      id: 'p_' + Date.now(),
      name: `${prod.name} (Copy)`,
      views: 0
    };
    setProducts(prev => [...prev, duplicated]);
    triggerPushNotification('📋 Product Duplicated', `Duplicated ${prod.name} successfully.`, '📋', 'vendor');
  };

  const handleUpdateStock = (id: string, amount: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, p.stock + amount);
        const nextStatus = nextStock === 0 ? 'Out of Stock' : p.status === 'Draft' ? 'Draft' : 'Active';
        return { ...p, stock: nextStock, status: nextStatus };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost = {
      id: 'post_' + Date.now(),
      text: newPostText,
      views: 0,
      likes: 0,
      status: scheduleDate ? 'Scheduled' : 'Published',
      scheduledFor: scheduleDate || null
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setScheduleDate('');
    triggerPushNotification('✍️ Update Shared', 'Your business feed update is live!', '✍️', 'vendor');
  };

  const handleAIAutoReply = (reviewId: string, text: string) => {
    const responses = [
      `🤖 Every-zone AI: "We are thrilled that you loved the hand-spun details! Your support keeps our local artisans thriving."`,
      `🤖 Every-zone AI: "Thank you for trusting Every-zone Escrow! Sidamo coffee cherries are hand-selected for this magical aroma. We appreciate the feedback!"`,
      `🤖 Every-zone AI: "We always roast in small artisanal batches. Thank you for your gorgeous feedback!"`
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply } : r));
    triggerPushNotification('🤖 AI Response Drafted', 'Context-aware review auto-response generated.', '🤖', 'vendor');
  };

  // --- NOTIFICATIONS STATE ---
  const [vendorNotifications, setVendorNotifications] = useState([
    { id: 'n1', title: '🛍️ New Escrow Order Received', desc: 'Selamawit T. ordered Luxury Habesha Makeda Kemis. ETB 4,200 is locked in escrow.', time: '10 mins ago', read: false },
    { id: 'n2', title: '💬 Client Direct Message', desc: 'Kidus A. sent: "Is the Yirgacheffe medium roast in stock?"', time: '2 hours ago', read: false },
    { id: 'n3', title: '👥 New Store Follower', desc: 'Almaz B. began following your storefront.', time: '1 day ago', read: true },
    { id: 'n4', title: '⭐ New Customer Review', desc: 'Selamawit T. left a 5-star rating on Luxury Habesha Makeda Kemis.', time: '1 day ago', read: true },
    { id: 'n5', title: '💸 Withdrawal Payout Approved', desc: 'Your withdrawal of ETB 15,000 via Telebirr was approved and cleared by Chapa.', time: '5 days ago', read: true }
  ]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // --- SECURITY STATES ---
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [trustedDevices, setTrustedDevices] = useState([
    { id: 'd1', name: 'iPhone 15 Pro Max (Addis Ababa)', browser: 'Every-zone Mobile App', status: 'Current Active Device' },
    { id: 'd2', name: 'Apple MacBook Pro M3 (Bole Zone)', browser: 'Google Chrome', status: 'Last sync: 2 hours ago' }
  ]);
  const [loginHistory, setLoginHistory] = useState([
    { id: 'lh1', ip: '197.156.104.22', device: 'Chrome on macOS (Addis Ababa)', date: 'Today, 08:42 AM', success: true },
    { id: 'lh2', ip: '197.156.104.99', device: 'Mobile Safari (Bole Medhanialem)', date: 'Yesterday, 06:14 PM', success: true },
    { id: 'lh3', ip: '102.132.84.15', device: 'Firefox on Linux (Kirkos Zone)', date: '3 days ago, 11:20 AM', success: false }
  ]);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > vendorWallet) {
      alert('Invalid withdrawal amount.');
      return;
    }
    setWithdrawStep('processing');
    setTimeout(() => {
      setVendorWallet(prev => prev - amount);
      setWalletBalance(prev => prev + amount);
      setTransactions([
        {
          id: 'TX-' + Math.floor(Math.random() * 900 + 100),
          type: 'Payout Withdrawal',
          description: `Withdrawal via ${withdrawChannel}`,
          amount: -amount,
          date: 'Just now',
          status: 'Completed'
        },
        ...transactions
      ]);
      setWithdrawStep('completed');
      triggerPushNotification('💸 Payout Dispatched', `Successfully wired ETB ${amount.toLocaleString()} to your ${withdrawChannel} account.`, '💸', 'vendor');
    }, 1500);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) return;
    const newP = {
      id: 'p' + (products.length + 1),
      name: prodForm.name,
      price: parseFloat(prodForm.price),
      stock: parseInt(prodForm.stock) || 10,
      views: 0,
      status: 'Active',
      category: prodForm.category,
      variants: prodForm.variants.split(',').map(v => v.trim()).filter(Boolean)
    };
    setProducts([newP, ...products]);
    setProdForm({ name: '', price: '', stock: '', category: 'Dresses', variants: '' });
    setShowAddProduct(false);
    triggerPushNotification('🛍️ Product Created', `Successfully listed ${newP.name} into Every-zone database.`, '🛍️', 'vendor');
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 text-left rounded-3xl border font-sans ${
      isDarkMode ? 'bg-[#0A0D0A] text-zinc-100 border-zinc-850' : 'bg-stone-50 text-stone-900 border-stone-200'
    } relative overflow-hidden shadow-2xl max-w-7xl mx-auto`}>
      
      {/* GLOWING AMBER ACCENT HEADER BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-emerald-600 shadow-md" />

      {/* TOP HEADER CONSOLE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200/50 dark:border-zinc-850 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 shadow-inner">
            <BarChart3 className="animate-pulse" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase font-black tracking-wider">
                Elite Pro Merchant
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase font-black tracking-wider">
                Autonomous CRM V3
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight uppercase text-amber-500 flex items-center gap-2 mt-1">
              {lang === 'en' ? 'Every-zone Luxury Vendor Center' : 'የኤቭሪ-ዞን የንግድ ማስተዳደሪያ ማዕከል'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block mr-2">
            <span className="text-[10px] text-stone-400 block uppercase tracking-widest font-mono">Verified Node ID</span>
            <span className="text-xs font-black font-mono text-zinc-300">EZ-VEN-4029-MKD</span>
          </div>
          
          {/* NOTIFICATION CENTER DROPDOWN TRIGGER */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className={`p-2 rounded-xl border font-bold transition-all relative hover:scale-105 cursor-pointer shadow-sm ${
                isDarkMode ? 'bg-zinc-900 border-zinc-850 hover:bg-zinc-800 text-amber-500' : 'bg-white border-stone-200 hover:bg-stone-50 text-amber-600'
              }`}
              title="Notifications Panel"
            >
              <span className="relative inline-block">
                🔔
                {vendorNotifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
              </span>
            </button>
            
            {/* FLOATING DROPDOWN LIST */}
            <AnimatePresence>
              {showNotificationCenter && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-80 p-4 rounded-3xl border shadow-2xl z-50 text-xs ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200 shadow-black/80' : 'bg-white border-stone-200 text-stone-900 shadow-stone-200/50'
                  }`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800 mb-2">
                    <span className="font-black uppercase text-amber-500 tracking-wider">🔔 Secure Alerts ({vendorNotifications.filter(n => !n.read).length})</span>
                    <button 
                      onClick={() => {
                        setVendorNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        triggerPushNotification('✓ Marked Read', 'All security alerts marked read.', '✓', 'vendor');
                      }}
                      className="text-[9px] text-amber-500 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {vendorNotifications.map(n => (
                      <div key={n.id} className={`p-2 rounded-xl border transition ${
                        !n.read 
                          ? (isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-500/[0.03] border-amber-200')
                          : (isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-stone-50 border-stone-200')
                      }`}>
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-extrabold text-[11px] text-stone-250 dark:text-zinc-150 leading-tight">{n.title}</span>
                          <span className="text-[8px] text-stone-450 font-mono shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1 leading-normal">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onClose}
            className={`text-xs px-4 py-2 rounded-xl border font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850 text-zinc-200' : 'bg-white border-stone-250 hover:bg-stone-100 text-stone-850'
            }`}
          >
            {lang === 'en' ? 'Exit Console' : 'ዳሽቦርዱን ዝጋ'}
          </button>
        </div>
      </div>

      {/* RESPONSIVE LAYOUT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPACT MATERIAL 3 NAVIGATION COLUMN */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-stone-250 dark:border-zinc-850 pr-0 lg:pr-4">
          {[
            { id: 'dashboard', label: '📊 Dashboard', desc: 'Core Operational Hub' },
            { id: 'products', label: '🛍 Products', desc: 'Inventory & Variants' },
            { id: 'services', label: '🛠 Services', desc: 'Bookings & Calendars' },
            { id: 'orders', label: '📦 Orders', desc: 'Fulfillment & Escrows' },
            { id: 'customers', label: '👥 Customers', desc: 'VIPs & Blocklists' },
            { id: 'posts', label: '📝 Posts', desc: 'Social Feeds & Promos' },
            { id: 'videos', label: '🎥 Videos', desc: 'Live Shoppable Hub' },
            { id: 'messages', label: '💬 Messages', desc: 'Inbox & CRM Responses' },
            { id: 'reviews', label: '⭐ Reviews', desc: 'Ratings & AI Responder' },
            { id: 'wallet', label: '💰 Wallet & Payouts', desc: 'Withdrawal Portals' },
            { id: 'analytics', label: '📈 Analytics', desc: 'Cognitive Financials' },
            { id: 'settings', label: '⚙️ Store Config', desc: 'Hours, Vacation, Subs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SubTab)}
              className={`p-2.5 rounded-xl text-xs font-bold text-left shrink-0 lg:w-full transition-all border flex flex-col justify-start items-start gap-0.5 cursor-pointer hover:scale-[1.01] ${
                activeTab === tab.id
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 font-extrabold shadow-sm'
                  : (isDarkMode ? 'bg-zinc-900/40 border-zinc-900 hover:bg-zinc-900/80 text-zinc-350' : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-700')
              }`}
            >
              <span className="flex items-center gap-1.5 text-[12px]">{tab.label}</span>
              <span className="text-[8px] opacity-60 hidden lg:block uppercase font-mono tracking-wide">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* RIGHT ACTIVE MODULE CONTENT PANEL */}
        <div className="lg:col-span-9 space-y-6">

          {/* ========================================================
              SUB-TAB 1: DASHBOARD (HOME) - 10 INTEGRATED CARD BLOCKS
              ======================================================== */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              
              {/* store health banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r ${
                isDarkMode ? 'from-amber-500/[0.03] to-transparent border-amber-500/20' : 'from-amber-50/50 to-transparent border-amber-200'
              }`}>
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-amber-500/15 text-amber-500 rounded-xl mt-0.5 animate-bounce">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">Autonomous CRM Intelligence</h4>
                    <p className={`text-[11px] leading-relaxed mt-0.5 ${isDarkMode ? 'text-zinc-300' : 'text-stone-750'}`}>
                      Makeda store is currently operating under prime health parameters. Delivery latency: ~14 minutes.
                    </p>
                  </div>
                </div>
                {vacationMode && (
                  <span className="text-[10px] font-black uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-xl shrink-0">
                    🌴 Vacation mode on
                  </span>
                )}
              </div>

              {/* 10 CORE METRIC CARDS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* 1. Today's Sales */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest">Today's Sales</span>
                  <div className="text-sm font-black font-mono text-emerald-500 mt-2">ETB 14,500</div>
                  <span className="text-[8px] text-emerald-400 font-mono block mt-1">📈 +12.4% vs yesterday</span>
                </div>

                {/* 2. Weekly Sales */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest">Weekly Sales</span>
                  <div className="text-sm font-black font-mono mt-2">ETB 94,200</div>
                  <span className="text-[8px] text-emerald-400 font-mono block mt-1">📈 +4.8% this week</span>
                </div>

                {/* 3. Monthly Revenue */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest text-amber-500">Monthly Rev</span>
                  <div className="text-sm font-black font-mono text-amber-500 mt-2">ETB 412,000</div>
                  <span className="text-[8px] text-emerald-400 font-mono block mt-1">📈 +15.2% vs June</span>
                </div>

                {/* 4. Wallet Balance */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-amber-500/10' : 'bg-amber-50/10 border-amber-500/20'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest">Wallet Ball</span>
                  <div className="text-sm font-black font-mono text-amber-500 mt-2">ETB {vendorWallet.toLocaleString()}</div>
                  <button 
                    onClick={() => {
                      setWithdrawAmount(Math.min(25000, vendorWallet).toString());
                      setWithdrawStep('idle');
                      setIsWithdrawOpen(true);
                    }}
                    className="text-[8px] bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black uppercase px-2 py-1 rounded-lg mt-1 w-full text-center transition-all cursor-pointer"
                  >
                    Withdraw
                  </button>
                </div>

                {/* 5. Pending Orders */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest">Pending Orders</span>
                  <div className="text-sm font-black font-mono text-amber-600 mt-2">
                    {orders.filter(o => o.status === 'Pending').length} Orders
                  </div>
                  <span className="text-[8px] text-stone-400 font-sans block mt-1">Fulfillment queue hot</span>
                </div>

                {/* 6. Unread Messages */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest text-emerald-500">Unread Msg</span>
                  <div className="text-sm font-black font-mono text-emerald-500 mt-2">
                    {chats.filter(c => c.unread).length} Threads
                  </div>
                  <span className="text-[8px] text-emerald-400 font-sans block mt-1 animate-pulse">● Instant Replies Active</span>
                </div>

                {/* 7. Followers */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest">Followers</span>
                  <div className="text-sm font-black font-mono mt-2">2,450</div>
                  <span className="text-[8px] text-emerald-400 font-mono block mt-1">📈 +84 this week</span>
                </div>

                {/* 8. Product Views */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest">Product Views</span>
                  <div className="text-sm font-black font-mono mt-2">15,800</div>
                  <span className="text-[8px] text-stone-400 font-sans block mt-1">Across 4 digital catalog items</span>
                </div>

                {/* 9. Video Views */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest text-indigo-400">Video Views</span>
                  <div className="text-sm font-black font-mono text-indigo-400 mt-2">34,200</div>
                  <span className="text-[8px] text-emerald-400 font-mono block mt-1">📈 +41% click-through</span>
                </div>

                {/* 10. Store Health Score */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-950 border-amber-500/10' : 'bg-white border-stone-200'}`}>
                  <span className="text-stone-450 block text-[9px] uppercase font-black font-mono tracking-widest text-amber-500">Store Health</span>
                  <div className="text-sm font-black font-mono mt-2 text-amber-500">98%</div>
                  <span className="text-[8px] text-amber-400 font-sans block mt-1 uppercase font-bold">Elite Status</span>
                </div>
              </div>

              {/* RECENT ACTIVITY LOGS */}
              <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-2">
                  <Clock size={14} /> Global Escrow & System Action Pipeline
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-neutral-900/30 rounded-xl border border-zinc-850/50 flex justify-between items-center">
                    <div>
                      <span className="font-extrabold text-stone-250 block">Customer order registered</span>
                      <span className="text-[9px] text-stone-450">Selamawit T. reserved Luxury Habesha Dress. Escrow locked.</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full uppercase">LOCKED</span>
                  </div>
                  <div className="p-2.5 bg-neutral-900/30 rounded-xl border border-zinc-850/50 flex justify-between items-center">
                    <div>
                      <span className="font-extrabold text-stone-250 block">Withdrawal payout processed</span>
                      <span className="text-[9px] text-stone-450">Settled payouts wired securely through Telebirr instant gate.</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full uppercase">SETTLED</span>
                  </div>
                </div>
              </div>

              {/* AI BUSINESS COGNITIVE ASSISTANT (HIGH PERFORMANCE ACTIONS) */}
              <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white border-stone-200'} space-y-4`}>
                <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-zinc-850/60 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-2">
                    <Sparkles className="text-amber-500 animate-spin" size={14} /> AI Business Assistant Suggestions
                  </h3>
                  <span className="text-[8.5px] uppercase font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-mono animate-pulse">Cognitive Node Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Suggestion 1: Optimize Price */}
                  <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/40 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-bold text-amber-500 font-mono uppercase">🎯 Price Optimizer</span>
                        <span className="text-[7.5px] font-bold bg-amber-500/10 text-amber-500 px-1.5 rounded-full">+ETB 210 margin</span>
                      </div>
                      <h4 className="font-extrabold text-[11.5px] mt-1.5 text-zinc-100">Optimize Makeda Gown Price</h4>
                      <p className="text-[10.5px] text-stone-400 mt-1 leading-relaxed">
                        Demand is peaking in Bole zone. AI suggests optimizing Habesha Makeda Kemis price by 5%.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setProducts(prev => prev.map(p => p.id === 'p1' ? { ...p, price: Math.round(p.price * 1.05) } : p));
                        triggerPushNotification('🤖 AI Optimization Applied', 'Price of Luxury Habesha Makeda Kemis optimized by 5% to ETB 4,410.', '🤖', 'vendor');
                        alert('AI Pricing Applied! Product: Luxury Habesha Makeda Kemis is now ETB 4,410.');
                      }}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 border border-zinc-800 font-black py-2 rounded-xl text-[9px] uppercase transition-all tracking-wider cursor-pointer text-center"
                    >
                      Apply 5% Optimization
                    </button>
                  </div>

                  {/* Suggestion 2: Low Stock Replenishment */}
                  <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/40 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-bold text-rose-400 font-mono uppercase">🚨 Stock Alert</span>
                        <span className="text-[7.5px] font-bold bg-rose-500/10 text-rose-400 px-1.5 rounded-full">0 Stock left</span>
                      </div>
                      <h4 className="font-extrabold text-[11.5px] mt-1.5 text-zinc-100">Replenish Gondar Crown Bead Set</h4>
                      <p className="text-[10.5px] text-stone-400 mt-1 leading-relaxed">
                        Traditional crown sets have 0 inventory. 18 visitors added to wishlist today. Suggest replenishing.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setProducts(prev => prev.map(p => p.id === 'p4' ? { ...p, stock: 20, status: 'Active' } : p));
                        triggerPushNotification('🤖 Stock Replenished', 'Gondar Styled Traditional Crown Bead Set restocked to 20 units.', '🤖', 'vendor');
                        alert('Stock Replenished! Crown Bead Set stock increased to 20.');
                      }}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 border border-zinc-800 font-black py-2 rounded-xl text-[9px] uppercase transition-all tracking-wider cursor-pointer text-center"
                    >
                      Restock to 20 Units
                    </button>
                  </div>

                  {/* Suggestion 3: Inactive VIP Retargeting */}
                  <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/40 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-bold text-emerald-400 font-mono uppercase">👥 VIP Retargeting</span>
                        <span className="text-[7.5px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 rounded-full">3 Inactive VIPs</span>
                      </div>
                      <h4 className="font-extrabold text-[11.5px] mt-1.5 text-zinc-100">Dispatch Personalized Promo Packs</h4>
                      <p className="text-[10.5px] text-stone-400 mt-1 leading-relaxed">
                        3 high-value VIP buyers have not ordered in 14 days. Suggest dispatching a 15% discount.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newC = { code: 'VIPBACK15', value: '15%', type: 'Percentage', active: true };
                        setCoupons([...coupons, newC]);
                        triggerPushNotification('🤖 VIP Retargeting Dispatched', 'Personalized coupon VIPBACK15 sent to inactive buyers.', '🤖', 'vendor');
                        alert('Personalized Coupon VIPBACK15 created and dispatched to VIP clients!');
                      }}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 border border-zinc-800 font-black py-2 rounded-xl text-[9px] uppercase transition-all tracking-wider cursor-pointer text-center"
                    >
                      Dispatch VIP Discount
                    </button>
                  </div>

                  {/* Suggestion 4: Sunday Coffee Flash Sale */}
                  <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/40 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-bold text-blue-400 font-mono uppercase">⚡ Flash Promotion</span>
                        <span className="text-[7.5px] font-bold bg-blue-500/10 text-blue-400 px-1.5 rounded-full">High conversion</span>
                      </div>
                      <h4 className="font-extrabold text-[11.5px] mt-1.5 text-zinc-100">Sunday Roasted Coffee Flash Sale</h4>
                      <p className="text-[10.5px] text-stone-400 mt-1 leading-relaxed">
                        Yirgacheffe coffee beans have peak search volume on Sundays. Launch Sunday flash sale.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newC = { code: 'SUNDAYCOFFEE', value: '15%', type: 'Percentage', active: true };
                        setCoupons([...coupons, newC]);
                        triggerPushNotification('🤖 Campaign Activated', 'Sunday coffee campaign is live on Every-zone streams!', '🤖', 'vendor');
                        alert('Flash Sale Activated! Promo code: SUNDAYCOFFEE (15% Off) published.');
                      }}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 border border-zinc-800 font-black py-2 rounded-xl text-[9px] uppercase transition-all tracking-wider cursor-pointer text-center"
                    >
                      Activate Flash Sale
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 2: PRODUCTS (CATALOG MANAGEMENT)
              ======================================================== */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">🛍 Core Inventory Catalog</h3>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[10px] uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={12} /> Add New Product
                </button>
              </div>

              {/* BULK ACTIONS CONTROL PANEL */}
              <div className="p-3 rounded-2xl bg-neutral-900/40 border border-zinc-850/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black text-stone-400">Selected: {selectedProductIds.length}</span>
                  <div className="h-4 w-[1px] bg-zinc-800" />
                  <span className="text-[10px] opacity-60">Manage multiple listings simultaneously</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleBulkAction('Activate')} className="bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer">Activate</button>
                  <button onClick={() => handleBulkAction('Draft')} className="bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer">Draft</button>
                  <button onClick={() => handleBulkAction('PriceIncrease')} className="bg-amber-500/15 text-amber-500 border border-amber-500/20 hover:bg-amber-500/25 font-bold text-[9px] uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer">Price +10%</button>
                  <button onClick={() => handleBulkAction('Delete')} className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold text-[9px] uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer">Delete</button>
                </div>
              </div>

              {/* PRODUCTS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(prod => (
                  <div key={prod.id} className={`p-4 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
                    selectedProductIds.includes(prod.id) ? 'border-amber-500 bg-amber-500/[0.02]' : (isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-white border-stone-200')
                  }`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={selectedProductIds.includes(prod.id)}
                            onChange={() => toggleSelectProduct(prod.id)}
                            className="rounded border-stone-300 dark:border-zinc-800 text-amber-500 focus:ring-amber-500/30 cursor-pointer"
                          />
                          <span className="text-[9px] font-mono opacity-50 uppercase">{prod.id}</span>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          prod.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-stone-500/15 text-stone-400'
                        }`}>
                          {prod.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-stone-200 dark:text-zinc-100 mt-2">{prod.name}</h4>
                      <p className="text-[9px] opacity-65 uppercase font-mono mt-0.5">Category: {prod.category}</p>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm font-black text-amber-500 font-mono">ETB {prod.price.toLocaleString()}</span>
                        <span className="text-[9px] text-stone-400">({prod.views} organic views)</span>
                      </div>

                      {/* VARIANTS ACCORDION */}
                      {prod.variants && prod.variants.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-zinc-800/60">
                          <span className="text-[8px] uppercase tracking-wider font-extrabold text-stone-450 block">Active Variants ({prod.variants.length})</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {prod.variants.map((v, idx) => (
                              <span key={idx} className="text-[9px] bg-neutral-950 border border-zinc-800 px-1.5 py-0.5 rounded text-stone-300 font-mono">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* STOCK CONTROLS & ACTIONS */}
                    <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleUpdateStock(prod.id, -1)} className="p-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs w-6 text-center cursor-pointer font-bold">-</button>
                        <span className="text-[11px] font-mono font-bold px-2">Stock: {prod.stock}</span>
                        <button onClick={() => handleUpdateStock(prod.id, 1)} className="p-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs w-6 text-center cursor-pointer font-bold">+</button>
                      </div>

                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleDuplicateProduct(prod.id)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-750 text-stone-300 rounded-lg cursor-pointer transition-all hover:scale-105"
                          title="Duplicate Product"
                        >
                          <Copy size={11} />
                        </button>
                        <button 
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-750 text-stone-300 rounded-lg cursor-pointer transition-all hover:scale-105"
                          title="Edit Product"
                        >
                          <Edit2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* INLINE ADD PRODUCT FORM */}
              {showAddProduct && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
                  <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-250 text-stone-900'
                  }`}>
                    <button onClick={() => setShowAddProduct(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white cursor-pointer">
                      <X size={15} />
                    </button>
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1">
                      <Boxes size={14} /> Add Digital Product
                    </h3>
                    <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs text-left">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-450">Product Name</label>
                        <input
                          type="text"
                          required
                          value={prodForm.name}
                          onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-stone-450">Price (ETB)</label>
                          <input
                            type="number"
                            required
                            value={prodForm.price}
                            onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-stone-450">Initial Stock</label>
                          <input
                            type="number"
                            required
                            value={prodForm.stock}
                            onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-450">Variants (Comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Size M, Size L, Ivory Gold"
                          value={prodForm.variants}
                          onChange={(e) => setProdForm({ ...prodForm, variants: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-2.5 rounded-xl uppercase tracking-wider text-[10px] shadow-md transition-all">
                        Publish to Every-zone Catalog
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* INLINE EDIT PRODUCT FORM */}
              {editingProduct && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
                  <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-250 text-stone-900'
                  }`}>
                    <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-stone-400 hover:text-white cursor-pointer">
                      <X size={15} />
                    </button>
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1">
                      <Edit2 size={14} /> Edit Catalog Product
                    </h3>
                    <div className="space-y-4 text-xs text-left">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-450">Product Name</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-stone-450">Price (ETB)</label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                            className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-stone-450">Stock</label>
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                            className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
                          setEditingProduct(null);
                          triggerPushNotification('✏️ Product Updated', 'Catalog modifications synchronized successfully.', '✏️', 'vendor');
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-2.5 rounded-xl uppercase tracking-wider text-[10px] shadow-md"
                      >
                        Save Inventory Sync
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 3: SERVICES (BOOKINGS & AVAILABILITY CALENDAR)
              ======================================================== */}
          {activeTab === 'services' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              
              {/* SERVICE PRICES CONFIGURATION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {services.map(serv => (
                  <div key={serv.id} className={`p-4 rounded-3xl border flex flex-col justify-between h-36 ${
                    isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-200'
                  }`}>
                    <div>
                      <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest block">Service Node</span>
                      <h4 className="text-xs font-black text-stone-200 dark:text-zinc-100 line-clamp-2 h-8">{serv.name}</h4>
                    </div>
                    <div>
                      <div className="text-[13px] font-mono font-black text-amber-500 flex justify-between items-center">
                        <span>ETB {serv.price.toLocaleString()}</span>
                        <button 
                          onClick={() => {
                            setSelectedService(serv);
                            setServicePriceInput(serv.price.toString());
                          }}
                          className="text-[9px] bg-zinc-800 text-stone-300 hover:text-white px-2 py-0.5 rounded cursor-pointer"
                        >
                          Pricing
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-800/30">
                        <span className="text-[9px] text-emerald-400 font-bold">{serv.bookings} bookings</span>
                        <span className="text-[8px] uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">{serv.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOOKINGS PIPELINE */}
              <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
                  <CalendarRange size={14} /> Active Client Bookings
                </h3>
                <div className="space-y-2 text-xs">
                  {bookings.map(book => (
                    <div key={book.id} className="p-3 bg-neutral-900/30 rounded-xl border border-zinc-850/50 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <span className="font-extrabold text-stone-200 text-[11px] block">{book.service}</span>
                        <span className="text-[9px] text-stone-450">Date: {book.date} • Client: {book.customer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8.5px] font-bold uppercase px-2 py-0.5 rounded ${
                          book.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-500'
                        }`}>
                          {book.status}
                        </span>
                        {book.status === 'Pending Approval' && (
                          <button 
                            onClick={() => {
                              setBookings(prev => prev.map(b => b.id === book.id ? { ...b, status: 'Confirmed' } : b));
                              triggerPushNotification('📅 Booking Confirmed', `Scheduled event for ${book.customer} confirmed.`, '📅', 'vendor');
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[8.5px] uppercase px-2 py-1 rounded"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VISUAL AVAILABILITY CALENDAR GRID */}
              <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Calendar size={14} /> Interactive Store Availability Calendar
                  </h3>
                  <span className="text-[9px] text-stone-400 font-mono">Bole Medhanialem Timezone</span>
                </div>
                <p className="text-[10px] text-stone-400 mb-4">Click on any date slot below to toggle your service availability (e.g. mark off-duty hours or busy times):</p>
                
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Object.entries(calendarSlots).map(([date, status]) => (
                    <button
                      key={date}
                      onClick={() => {
                        const nextStatus = status === 'Available' ? 'Unavailable' : 'Available';
                        setCalendarSlots({ ...calendarSlots, [date]: nextStatus });
                      }}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 ${
                        status === 'Available' 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/5 border-rose-500/20 text-rose-500 line-through'
                      }`}
                    >
                      <span className="text-[9px] font-mono font-bold block">{date.substring(5)}</span>
                      <span className="text-[8px] uppercase tracking-wider block font-bold mt-1">
                        {status === 'Available' ? 'OPEN' : 'BLOCKED'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* EDIT SERVICE PRICE OVERLAY */}
              {selectedService && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
                  <div className={`max-w-sm w-full p-6 rounded-3xl border shadow-2xl relative ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-250 text-stone-900'
                  }`}>
                    <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 text-stone-400 hover:text-white cursor-pointer">
                      <X size={15} />
                    </button>
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-4">
                      ⚙️ Configure Service Pricing
                    </h3>
                    <div className="space-y-4 text-xs text-left">
                      <p className="text-[11px] text-stone-400">Set base rate for: <strong>{selectedService.name}</strong></p>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-stone-450">Price Rate (ETB)</label>
                        <input
                          type="number"
                          value={servicePriceInput}
                          onChange={(e) => setServicePriceInput(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, price: parseFloat(servicePriceInput) || s.price } : s));
                          setSelectedService(null);
                          triggerPushNotification('⚡ Rates Modified', 'New service tariff published.', '⚡', 'vendor');
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-2 rounded-xl uppercase font-mono text-[10px]"
                      >
                        Apply New Base Rate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 4: ORDERS (ESCROW CONTROL DESK)
              ======================================================== */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">📦 Escrow Settlement & Orders</h3>
                
                {/* PIPELINE CATEGORY FILTER */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled', 'Returned', 'Refund Requests'].map((filterName) => (
                    <button
                      key={filterName}
                      onClick={() => setOrderFilter(filterName as any)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                        orderFilter === filterName 
                          ? 'bg-amber-500 text-neutral-950 border-amber-500' 
                          : 'bg-zinc-900/60 border-zinc-850 text-stone-400 hover:bg-zinc-800'
                      }`}
                    >
                      {filterName}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIST OF ESCROW PIPELINE ORDERS */}
              <div className="overflow-x-auto border border-stone-200/80 dark:border-zinc-850 rounded-2xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'bg-zinc-900 border-zinc-850 text-stone-450' : 'bg-stone-100 border-stone-200 text-stone-500'} font-black text-[9px] uppercase tracking-wider`}>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Buyer</th>
                      <th className="p-3">Escrow Status</th>
                      <th className="p-3">Payout</th>
                      <th className="p-3 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/50 dark:divide-zinc-850/50">
                    {orders
                      .filter(o => orderFilter === 'All' || o.status === orderFilter)
                      .map(order => (
                        <tr key={order.id} className="hover:bg-neutral-900/10 transition">
                          <td className="p-3 font-mono font-bold text-[10px] text-stone-400">{order.id}</td>
                          <td className="p-3">
                            <span className="font-extrabold text-[11px] block">{order.title}</span>
                            <span className="text-[8px] opacity-60 font-mono uppercase bg-zinc-850 px-1 rounded">{order.type}</span>
                          </td>
                          <td className="p-3 font-medium">{order.buyer}</td>
                          <td className="p-3">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                              order.status === 'Pending' ? 'bg-amber-500/15 text-amber-500' :
                              order.status === 'Processing' ? 'bg-blue-500/15 text-blue-400' :
                              order.status === 'Delivered' ? 'bg-emerald-500/15 text-emerald-400' :
                              order.status === 'Cancelled' ? 'bg-rose-500/15 text-rose-500' :
                              'bg-stone-500/15 text-stone-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-black text-amber-500">ETB {order.total.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              {order.status === 'Pending' && (
                                <button
                                  onClick={() => {
                                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Processing' } : o));
                                    triggerPushNotification('📦 Order Pipeline Status', `Order ${order.id} processed. Ready for logistics.`, '📦', 'vendor');
                                  }}
                                  className="bg-blue-500 text-white font-bold text-[8.5px] uppercase px-2 py-1 rounded hover:bg-blue-600 cursor-pointer"
                                >
                                  Process
                                </button>
                              )}
                              {order.status === 'Processing' && (
                                <button
                                  onClick={() => {
                                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Delivered' } : o));
                                    // Escrow release simulation: add to wallet balance automatically
                                    setVendorWallet(prev => prev + order.total);
                                    setEscrowHold(prev => Math.max(0, prev - order.total));
                                    triggerPushNotification('🎉 Payout Released', `Escrow payment of ETB ${order.total} has been credited to your active balance.`, '🎉', 'vendor');
                                  }}
                                  className="bg-emerald-500 text-white font-bold text-[8.5px] uppercase px-2 py-1 rounded hover:bg-emerald-600 cursor-pointer"
                                >
                                  Ship / Release
                                </button>
                              )}
                              {order.status === 'Refund Requests' && (
                                <button
                                  onClick={() => {
                                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Cancelled' } : o));
                                    triggerPushNotification('💸 Refund Approved', `Refund of ETB ${order.total} cleared securely.`, '💸', 'vendor');
                                  }}
                                  className="bg-rose-500 text-white font-bold text-[8.5px] uppercase px-2 py-1 rounded hover:bg-rose-600 cursor-pointer"
                                >
                                  Approve Refund
                                </button>
                              )}
                              {order.status === 'Delivered' && (
                                <span className="text-[9px] text-emerald-400 font-bold">✓ Settled</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 5: CUSTOMERS (CRM SEGMENTATION & BLOCKED LISTS)
              ======================================================== */}
          {activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">👥 Client Relationship Management Node</h3>
                
                {/* SEGMENT TABS */}
                <div className="flex gap-1.5">
                  {(['Followers', 'Repeat', 'VIP', 'Blocked'] as const).map(segment => (
                    <button
                      key={segment}
                      onClick={() => setCustomerSegment(segment)}
                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                        customerSegment === segment
                          ? 'bg-amber-500 text-neutral-950 border-amber-500'
                          : 'bg-zinc-900 border-zinc-850 text-stone-400 hover:bg-zinc-800'
                      }`}
                    >
                      {segment}
                    </button>
                  ))}
                </div>
              </div>

              {/* CUSTOMERS DIRECTORY GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customers
                  .filter(c => {
                    if (customerSegment === 'Followers') return c.followed && !c.blocked;
                    if (customerSegment === 'Repeat') return c.ordersCount >= 3 && !c.blocked;
                    if (customerSegment === 'VIP') return c.type === 'VIP' && !c.blocked;
                    if (customerSegment === 'Blocked') return c.blocked;
                    return true;
                  })
                  .map(cust => (
                    <div key={cust.id} className={`p-4 rounded-3xl border flex justify-between items-center ${
                      isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-white border-stone-200'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-zinc-100">{cust.name}</h4>
                          <span className={`text-[8px] font-mono uppercase px-2 py-0.2 rounded-full ${
                            cust.type === 'VIP' ? 'bg-amber-500/10 text-amber-500' :
                            cust.type === 'Repeat' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-stone-500/10 text-stone-400'
                          }`}>
                            {cust.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400">{cust.email}</p>
                        
                        <div className="flex items-center gap-3 text-[9px] text-stone-450 mt-2 font-mono">
                          <span>Total Orders: <strong>{cust.ordersCount}</strong></span>
                          <span>Total Spend: <strong>ETB {cust.spend.toLocaleString()}</strong></span>
                        </div>
                      </div>

                      <div>
                        {cust.blocked ? (
                          <button
                            onClick={() => {
                              setCustomers(prev => prev.map(c => c.id === cust.id ? { ...c, blocked: false, type: 'Follower' } : c));
                              triggerPushNotification('🛡️ CRM Policy Update', `Unblocked ${cust.name}.`, '🛡️', 'vendor');
                            }}
                            className="bg-emerald-500 text-white font-bold text-[8px] uppercase px-2 py-1 rounded"
                          >
                            Unblock
                          </button>
                        ) : (
                          <div className="flex flex-col gap-1.5 items-end">
                            {cust.type === 'VIP' && (
                              <button
                                onClick={() => {
                                  triggerPushNotification('🎟️ Exclusive VIP Coupon sent', `Sent personal 15% promo discount KEMIS15 directly to ${cust.name}.`, '🎟️', 'vendor');
                                  alert(`Personal promo coupon dispatched to VIP client: ${cust.name}`);
                                }}
                                className="bg-amber-500 text-neutral-950 font-bold text-[8px] uppercase px-2 py-1 rounded animate-pulse cursor-pointer"
                              >
                                Send Coupon
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setCustomers(prev => prev.map(c => c.id === cust.id ? { ...c, blocked: true, type: 'Blocked' } : c));
                                triggerPushNotification('🛡️ Policy Warning', `Citizen ${cust.name} blocked from contacting and placing escrow orders.`, '🛡️', 'vendor');
                              }}
                              className="text-stone-500 hover:text-rose-500 text-[8px] uppercase font-bold"
                            >
                              Block User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 6: POSTS (SOCIAL FEED DISPATCHER)
              ======================================================== */}
          {activeTab === 'posts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">📝 Create Social Feed Story Posts</h3>
              
              <form onSubmit={handleCreatePost} className="p-4 rounded-3xl bg-neutral-900/40 border border-zinc-850/60 space-y-3">
                <textarea
                  placeholder="Draft your promotional update here (e.g. exclusive coupon notices, new arrivals, traditional weaving timelines)..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl bg-neutral-950 border border-zinc-850 outline-none text-zinc-100 min-h-[80px]"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400">Schedule release (optional):</span>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="p-1 bg-neutral-950 border border-zinc-850 rounded text-[10px] text-stone-300"
                    />
                  </div>
                  <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[9.5px] uppercase px-4 py-2 rounded-xl cursor-pointer">
                    Publish Story Post
                  </button>
                </div>
              </form>

              {/* POST LIST */}
              <div className="space-y-2">
                {posts.map(p => (
                  <div key={p.id} className="p-4 rounded-3xl border border-zinc-850 bg-zinc-900/20 text-xs flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${
                          p.status === 'Pinned' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/25' :
                          p.status === 'Scheduled' ? 'bg-blue-500/15 text-blue-400' : 'bg-stone-500/15 text-stone-400'
                        }`}>
                          {p.status}
                        </span>
                        {p.scheduledFor && <span className="text-[8px] text-stone-400 font-mono">Scheduled: {p.scheduledFor}</span>}
                      </div>
                      <p className="text-[11.5px] text-stone-200 font-sans leading-relaxed">{p.text}</p>
                      <div className="flex gap-4 text-[9.5px] text-stone-450 font-mono">
                        <span>Views: {p.views}</span>
                        <span>Likes: {p.likes}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      {p.status === 'Published' && (
                        <button
                          onClick={() => {
                            setPosts(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Pinned' } : item));
                            triggerPushNotification('📌 Post Pinned', 'Highlighting story at top of user feed.', '📌', 'vendor');
                          }}
                          className="p-1 bg-zinc-850 hover:bg-zinc-750 rounded text-[9px] uppercase font-bold"
                        >
                          Pin
                        </button>
                      )}
                      {p.status === 'Pinned' && (
                        <button
                          onClick={() => {
                            setPosts(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Published' } : item));
                          }}
                          className="p-1 bg-zinc-850 hover:bg-zinc-750 rounded text-[9px] uppercase font-bold"
                        >
                          Unpin
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setPosts(prev => prev.filter(item => item.id !== p.id));
                          triggerPushNotification('🗑️ Story Deleted', 'Post removed from marketplace social space.', '🗑️', 'vendor');
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                        title="Delete Post"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 7: VIDEOS (LIVE SHOPPING AND CTR METRICS)
              ======================================================== */}
          {activeTab === 'videos' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">🎥 Live Shopping & Product Stream Hub</h3>

              {/* UPLOAD VIDEO DEMO */}
              <div className="p-4 rounded-3xl bg-neutral-900/40 border border-zinc-850/60 flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">Publish Live Video Clip</span>
                  <input
                    type="text"
                    placeholder="Enter shoppable video clip title..."
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="p-2 rounded-xl bg-neutral-950 border border-zinc-850 outline-none text-zinc-100 text-xs w-64"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newVideoTitle.trim()) return;
                    const newV = {
                      id: 'v_' + Date.now(),
                      title: newVideoTitle,
                      views: 0,
                      likes: 0,
                      ctr: '0%',
                      commentsCount: 0,
                      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                    };
                    setVideos([...videos, newV]);
                    setNewVideoTitle('');
                    triggerPushNotification('🎥 Video Published', 'Shoppable video clip posted on Every-zone stream.', '🎥', 'vendor');
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[9.5px] uppercase px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Publish Video Clip
                </button>
              </div>

              {/* VIDEO GALLERY GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map(vid => (
                  <div key={vid.id} className="p-4 rounded-3xl border border-zinc-850 bg-zinc-900/20 text-xs space-y-3">
                    <div className="flex gap-3 items-start">
                      <img src={vid.url} alt={vid.title} className="w-12 h-12 rounded-xl object-cover border border-zinc-800" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-xs font-black text-zinc-100">{vid.title}</h4>
                        <div className="flex gap-3 text-[9px] text-stone-400 font-mono mt-1">
                          <span>Views: <strong>{vid.views}</strong></span>
                          <span>CTR (Click-Through): <strong className="text-amber-500">{vid.ctr}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-850 flex justify-between items-center text-[10px]">
                      <button
                        onClick={() => setSelectedVideo(selectedVideo?.id === vid.id ? null : vid)}
                        className="text-amber-500 font-bold hover:underline"
                      >
                        Comments ({videoComments.filter(c => c.videoId === vid.id).length})
                      </button>
                      <button
                        onClick={() => {
                          setVideos(prev => prev.filter(v => v.id !== vid.id));
                          triggerPushNotification('🗑️ Video Deleted', 'Shoppable clip removed from feed.', '🗑️', 'vendor');
                        }}
                        className="text-rose-500 hover:underline"
                      >
                        Delete Stream
                      </button>
                    </div>

                    {/* EXPANDED VIDEO COMMENTS BOARD */}
                    {selectedVideo?.id === vid.id && (
                      <div className="p-3 bg-neutral-950 rounded-2xl border border-zinc-850 text-[10.5px] space-y-2 mt-2 animate-fade-in">
                        <span className="font-bold text-stone-400 block uppercase text-[8.5px]">Viewer Comments</span>
                        
                        <div className="space-y-2 divide-y divide-zinc-900 max-h-[120px] overflow-y-auto">
                          {videoComments.filter(c => c.videoId === vid.id).map(comm => (
                            <div key={comm.id} className="pt-2 text-left">
                              <span className="font-bold text-amber-500">{comm.user}:</span>
                              <p className="text-stone-300 mt-0.5">{comm.comment}</p>
                              {comm.reply && (
                                <p className="text-[10px] text-emerald-400 pl-2 mt-1 border-l border-emerald-500/30">
                                  Response: {comm.reply}
                                </p>
                              )}
                              {!comm.reply && (
                                <div className="mt-1 flex gap-1">
                                  <input
                                    type="text"
                                    placeholder="Type answer..."
                                    onChange={(e) => setCommentReplyText(e.target.value)}
                                    className="p-1 bg-zinc-900 border border-zinc-800 text-[10px] text-white rounded w-full outline-none"
                                  />
                                  <button
                                    onClick={() => {
                                      if (!commentReplyText.trim()) return;
                                      setVideoComments(prev => prev.map(c => c.id === comm.id ? { ...c, reply: commentReplyText } : c));
                                      setCommentReplyText('');
                                      triggerPushNotification('💬 Comment Replied', 'Your reply is visible on the feed.', '💬', 'vendor');
                                    }}
                                    className="bg-emerald-500 text-white font-bold text-[8px] px-2 py-0.5 rounded"
                                  >
                                    Send
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 8: MESSAGES (INBOX & QUICK REPLIES)
              ======================================================== */}
          {activeTab === 'messages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">💬 Verified Customer Communications Console</h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* CHAT THREAD LIST */}
                <div className="md:col-span-5 space-y-2">
                  <span className="text-[9px] uppercase font-black text-stone-400 block tracking-widest">Active Client Sockets</span>
                  {chats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setSelectedChatId(chat.id);
                        setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c));
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex justify-between items-center cursor-pointer transition-all ${
                        selectedChatId === chat.id 
                          ? 'border-amber-500 bg-amber-500/[0.02]' 
                          : 'bg-zinc-900/40 border-zinc-850 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[11.5px] font-black text-zinc-100">{chat.sender}</h4>
                          {chat.unread && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping shrink-0" />}
                        </div>
                        <p className="text-[10px] text-stone-400 truncate mt-0.5">{chat.preview}</p>
                      </div>
                      <span className="text-[8px] text-stone-450 font-mono font-bold shrink-0">{chat.date}</span>
                    </button>
                  ))}
                </div>

                {/* THREAD CHAT DIALOGUE */}
                <div className="md:col-span-7 p-4 rounded-3xl border border-zinc-850 bg-zinc-900/10 flex flex-col justify-between min-h-[300px]">
                  {selectedChatId ? (
                    <div className="space-y-4 flex flex-col h-full justify-between">
                      <div className="space-y-2 overflow-y-auto max-h-[180px] pr-2">
                        {chats.find(c => c.id === selectedChatId)?.thread.map((msg, idx) => (
                          <div key={idx} className={`max-w-[85%] p-2.5 rounded-2xl text-[11px] ${
                            msg.sender === 'You' 
                              ? 'bg-[#1E3A1A] text-white self-end ml-auto text-right' 
                              : 'bg-zinc-850 text-stone-200 self-start mr-auto'
                          }`}>
                            <span className="text-[8px] font-black opacity-50 block uppercase font-mono">{msg.sender}</span>
                            <p className="mt-0.5 leading-normal">{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-zinc-850/60">
                        {/* QUICK REPLIES UTILITY PANEL */}
                        <div className="space-y-1">
                          <span className="text-[8px] uppercase tracking-wider font-extrabold text-stone-450 block">🏷️ Tap Quick Replies Template:</span>
                          <div className="flex flex-wrap gap-1">
                            {quickReplies.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => setMessageReplyText(q)}
                                className="text-[8.5px] bg-zinc-950 border border-zinc-850 hover:border-amber-500/40 text-stone-300 px-2 py-0.5 rounded-lg transition-all text-left"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* MESSAGE SENDING COMPONENT */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type verified reply..."
                            value={messageReplyText}
                            onChange={(e) => setMessageReplyText(e.target.value)}
                            className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl outline-none text-zinc-100"
                          />
                          <button
                            onClick={() => {
                              if (!messageReplyText.trim()) return;
                              setChats(prev => prev.map(c => {
                                if (c.id === selectedChatId) {
                                  return {
                                    ...c,
                                    preview: messageReplyText,
                                    thread: [...c.thread, { sender: 'You', text: messageReplyText }]
                                  };
                                }
                                return c;
                              }));
                              setMessageReplyText('');
                              triggerPushNotification('💬 Reply Transmitted', 'Secured messaging packet cleared.', '💬', 'vendor');
                            }}
                            className="bg-amber-500 text-neutral-950 font-black text-xs px-4 rounded-xl hover:bg-amber-400"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-stone-450 text-xs">
                      Select client thread socket to initiate secure dialogue.
                    </div>
                  )}
                </div>
              </div>

              {/* AUTO REPLY ENGINE CONFIG */}
              <div className="p-4 rounded-3xl bg-neutral-900/40 border border-zinc-850/60 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">🤖 Automated Closed Hours CRM Auto-Responder</h4>
                  <button 
                    onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                    className="p-1 cursor-pointer"
                  >
                    {autoReplyEnabled ? (
                      <ToggleRight className="text-amber-500" size={32} />
                    ) : (
                      <ToggleLeft className="text-stone-500" size={32} />
                    )}
                  </button>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400">Response Trigger Script:</span>
                  <input
                    type="text"
                    disabled={!autoReplyEnabled}
                    value={autoReplyMessage}
                    onChange={(e) => setAutoReplyMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-zinc-850 outline-none text-xs text-stone-300 disabled:opacity-40"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 9: REVIEWS (RATINGS & AI AUTO-REPLY CHIPS)
              ======================================================== */}
          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">⭐ Client Feedback & AI Cognitive Reply Node</h3>

              <div className="space-y-3">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-3xl border border-zinc-850 bg-zinc-900/20 text-xs space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-extrabold font-mono">
                          {'★'.repeat(rev.rating)}
                        </span>
                        <h4 className="font-extrabold text-zinc-150">{rev.user}</h4>
                      </div>
                      <span className="text-[8.5px] text-stone-450 font-mono">{rev.date}</span>
                    </div>

                    <p className="text-[11.5px] text-stone-300 font-sans leading-relaxed">{rev.text}</p>

                    {rev.reply ? (
                      <div className="p-2.5 bg-[#1E3A1A]/10 border border-[#1E3A1A]/30 rounded-xl text-[10.5px] text-emerald-400 pl-3">
                        <span className="font-black text-[9px] uppercase tracking-wider block">Merchant Reply Published:</span>
                        <p className="mt-0.5 leading-normal">{rev.reply}</p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAIAutoReply(rev.id, rev.text)}
                          className="bg-amber-500 text-neutral-950 font-black text-[9px] uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse cursor-pointer"
                        >
                          <Sparkles size={11} /> 🤖 AI Response Draft
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 10: WALLET (ESCROW STATEMENTS & LEDGER)
              ======================================================== */}
          {activeTab === 'wallet' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              
              {/* BALANCE OVERVIEW ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.02] to-transparent space-y-3">
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-widest font-mono">Settled Account Balance</span>
                  <div className="text-2xl font-black font-mono text-amber-500">ETB {vendorWallet.toLocaleString()}</div>
                  <button
                    onClick={() => {
                      setWithdrawAmount(Math.min(25000, vendorWallet).toString());
                      setWithdrawStep('idle');
                      setIsWithdrawOpen(true);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all w-full cursor-pointer text-center"
                  >
                    Withdraw Settled Balance
                  </button>
                </div>

                <div className="p-5 rounded-3xl border border-zinc-850 space-y-3 bg-zinc-900/10">
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-widest font-mono">Locked Escrow Hold</span>
                  <div className="text-2xl font-black font-mono text-stone-250">ETB {escrowHold.toLocaleString()}</div>
                  <p className="text-[10px] text-stone-450 leading-relaxed">
                    Escrow payouts are held under secured cloud protocol until customer confirms visual fulfillment.
                  </p>
                </div>
              </div>

              {/* TRANSACTIONS HISTORICAL LEDGER & INVOICES */}
              <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
                  <Landmark size={14} /> Account Ledger & Invoices
                </h3>

                <div className="space-y-2">
                  {transactions.map(tx => (
                    <div key={tx.id} className="p-3 bg-neutral-900/30 rounded-xl border border-zinc-850/50 flex justify-between items-center text-xs flex-wrap gap-2">
                      <div className="flex gap-2.5 items-center">
                        <div className={`p-1.5 rounded-lg ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'}`}>
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="font-extrabold text-stone-200 text-[11px] block">{tx.description}</span>
                          <span className="text-[9px] text-stone-450 font-mono">Ref ID: {tx.id} • {tx.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-black text-[12px] ${tx.amount > 0 ? 'text-emerald-500' : 'text-stone-200'}`}>
                          {tx.amount > 0 ? '+' : ''}ETB {tx.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            alert(`🧾 Generating Official Invoice \n====================================\nEVERY-ZONE DIGITAL LEDGER INVOICE\n------------------------------------\nInvoice ID: INV-${tx.id}\nReference: ${tx.description}\nAmount: ETB ${Math.abs(tx.amount).toLocaleString()}\nStatus: SETTLED\n====================================\nDownloaded under verified signature.`);
                          }}
                          className="text-[8.5px] uppercase font-black tracking-wider bg-zinc-800 text-stone-400 hover:text-stone-200 px-2 py-0.8 rounded"
                        >
                          Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WITHDRAWAL GATEWAY FORM MODAL */}
              {isWithdrawOpen && (
                <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
                  <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-250 text-stone-900'
                  }`}>
                    <button onClick={() => setIsWithdrawOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-white cursor-pointer">
                      <X size={15} />
                    </button>
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-4">
                      💸 Payout Settlement Gateway
                    </h3>

                    {withdrawStep === 'idle' && (
                      <form onSubmit={handleWithdrawalSubmit} className="space-y-4 text-xs text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-stone-450">Select Payout Channel</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['TELEBIRR', 'CBE', 'CHAPA'] as const).map(channel => (
                              <button
                                type="button"
                                key={channel}
                                onClick={() => setWithdrawChannel(channel)}
                                className={`p-2.5 rounded-xl text-center border font-mono font-bold cursor-pointer transition-all ${
                                  withdrawChannel === channel 
                                    ? 'bg-amber-500 border-amber-500 text-neutral-950' 
                                    : 'bg-zinc-900 border-zinc-850 text-stone-400 hover:bg-zinc-800'
                                }`}
                              >
                                {channel}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-stone-450">Withdrawal Payout Amount (ETB)</label>
                          <input
                            type="number"
                            required
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                          />
                        </div>

                        {withdrawChannel === 'TELEBIRR' ? (
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-stone-450">Telebirr Account (Phone)</label>
                            <input
                              type="text"
                              required
                              value={withdrawPhone}
                              onChange={(e) => setWithdrawPhone(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-stone-450">Bank Account number</label>
                            <input
                              type="text"
                              required
                              value={withdrawAccount}
                              onChange={(e) => setWithdrawAccount(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-zinc-800 bg-neutral-900 text-white outline-none"
                            />
                          </div>
                        )}

                        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-2.5 rounded-xl uppercase tracking-wider text-[10px]">
                          Dispatch Payout Request
                        </button>
                      </form>
                    )}

                    {withdrawStep === 'processing' && (
                      <div className="text-center py-8 space-y-3">
                        <RefreshCw className="animate-spin text-amber-500 mx-auto" size={24} />
                        <h4 className="text-xs font-bold text-amber-500 animate-pulse">Synchronizing banking gateway ledger...</h4>
                      </div>
                    )}

                    {withdrawStep === 'completed' && (
                      <div className="text-center py-6 space-y-3">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-lg">
                          ✓
                        </div>
                        <h4 className="text-xs font-black text-emerald-400">Payout Cleared & Transferred Successfully!</h4>
                        <button
                          onClick={() => setIsWithdrawOpen(false)}
                          className="bg-zinc-800 text-white font-bold text-[9.5px] px-4 py-2 rounded-xl mt-2 cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 11: ANALYTICS (RECHARTS FINANCIAL PERFORMANCE)
              ======================================================= */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">📈 Cognitive Business Analytics Panel</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. REVENUE GROWTH AREA CHART */}
                <div className="p-4 rounded-3xl border border-zinc-850 bg-zinc-900/10 text-xs">
                  <h4 className="font-extrabold uppercase text-amber-500 text-[10px] tracking-widest mb-3">Revenue & Escrow Hold Growth</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#F59E0B" fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="escrow" stroke="#10B981" fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. SALES BAR CHART */}
                <div className="p-4 rounded-3xl border border-zinc-850 bg-zinc-900/10 text-xs">
                  <h4 className="font-extrabold uppercase text-amber-500 text-[10px] tracking-widest mb-3">Fulfillment Volume Log</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. CONVERSION RATE PIE CHART */}
                <div className="p-4 rounded-3xl border border-zinc-850 bg-zinc-900/10 text-xs">
                  <h4 className="font-extrabold uppercase text-amber-500 text-[10px] tracking-widest mb-3">Merchant Traffic Funnel CTR</h4>
                  <div className="h-[200px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={conversionRateData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {conversionRateData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. PERFORMANCE RATINGS LEADERBOARD */}
                <div className="p-4 rounded-3xl border border-zinc-850 bg-zinc-900/10 text-xs text-left">
                  <h4 className="font-extrabold uppercase text-amber-500 text-[10px] tracking-widest mb-3">Performance Rankings</h4>
                  <div className="space-y-2 text-[10.5px]">
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                      <span className="font-bold text-stone-200">1. Top Product:</span>
                      <span className="text-amber-500 font-mono">Habesha Makeda Kemis</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                      <span className="font-bold text-stone-200">2. Top Service:</span>
                      <span className="text-amber-500 font-mono">Traditional Coffee ceremony</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                      <span className="font-bold text-stone-200">3. Top Video CTR:</span>
                      <span className="text-amber-500 font-mono">Roasting Sidamo (12.1%)</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                      <span className="font-bold text-stone-200">4. Traffic Source:</span>
                      <span className="text-amber-500 font-mono">Organic QR Codes (54%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SUB-TAB 12: SETTINGS (VACATION, HOURS, & DEALS)
              ======================================================= */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">⚙️ Global Store Operational Config</h3>

              {/* HOURS & COURIER FEES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-neutral-900/30 border border-zinc-850 space-y-3">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">Operating Business Hours</span>
                  <input
                    type="text"
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-zinc-850 outline-none text-xs text-zinc-150"
                  />
                  <p className="text-[10px] text-stone-450 leading-relaxed">
                    Customer dispatch locks outside of operating window.
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-neutral-900/30 border border-zinc-850 space-y-3">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">Flat Courier Shipping Rate</span>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-zinc-850 outline-none text-xs text-zinc-150"
                  />
                  <p className="text-[10px] text-stone-450 leading-relaxed">
                    Applied flat across all Every-zone moto delivery dispatches.
                  </p>
                </div>
              </div>

              {/* VACATION MODE TOGGLE */}
              <div className="p-4 rounded-3xl bg-neutral-900/30 border border-zinc-850 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">Store-Wide Vacation Mode</h4>
                  <p className="text-[10.5px] text-stone-400 mt-1 max-w-md">
                    Enabling vacation mode will immediately flag all catalog listings as closed, protecting your store's delivery metrics while you are offline.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const nextVal = !vacationMode;
                    setVacationMode(nextVal);
                    triggerPushNotification(
                      nextVal ? '🌴 Vacation Mode Activated' : '🏬 Store Re-opened',
                      nextVal ? 'Store marked closed temporarily.' : 'Your store is active.',
                      '🌴',
                      'vendor'
                    );
                  }}
                  className="p-1 cursor-pointer shrink-0"
                >
                  {vacationMode ? (
                    <ToggleRight className="text-amber-500" size={32} />
                  ) : (
                    <ToggleLeft className="text-stone-500" size={32} />
                  )}
                </button>
              </div>

              {/* PROMO COUPONS CREATOR */}
              <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-3">🎟️ Active Store Promo Coupons</h4>

                <div className="flex gap-2 flex-wrap mb-4">
                  <input
                    type="text"
                    placeholder="COUPON CODE"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="p-2 rounded-xl bg-neutral-950 border border-zinc-850 outline-none text-xs text-white uppercase"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 15% / 100)"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(e.target.value)}
                    className="p-2 rounded-xl bg-neutral-950 border border-zinc-850 outline-none text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newCouponCode) return;
                      setCoupons([...coupons, { code: newCouponCode, value: newCouponValue, type: 'Percentage', active: true }]);
                      setNewCouponCode('');
                      setNewCouponValue('10%');
                      triggerPushNotification('🎟️ Coupon Created', 'Promo campaign published.', '🎟️', 'vendor');
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[10px] px-4 rounded-xl cursor-pointer"
                  >
                    Create Campaign
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {coupons.map((c, idx) => (
                    <div key={idx} className="p-3 bg-neutral-950 rounded-xl border border-zinc-850 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-extrabold text-amber-500 block tracking-wider font-mono">{c.code}</span>
                        <span className="text-[10px] text-stone-400">Discount value: {c.value}</span>
                      </div>
                      <span className="text-[8.5px] uppercase font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">ACTIVE</span>
                    </div>
                  ))}
                </div>
              </div>

                  {/* CYBER SECURITY CONTROL CENTRE (2FA & SECURE LEDGERS) */}
              <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white border-stone-200'} space-y-4`}>
                <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-zinc-850/60 pb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-2">
                    🛡️ Cyber Security & Access Controls
                  </h4>
                  <span className="text-[8.5px] uppercase font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">Secured Socket (SSL)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Column 1: 2FA & Trusted Devices */}
                  <div className="space-y-4">
                    {/* 2FA Toggle */}
                    <div className="p-3.5 rounded-2xl bg-neutral-950/40 border border-zinc-850/50 flex justify-between items-center">
                      <div>
                        <h5 className="text-[11px] font-black uppercase text-zinc-200">Two-Factor Authentication (2FA)</h5>
                        <p className="text-[9.5px] text-stone-450 mt-0.5 leading-relaxed">
                          Enforce biometric fayda registry validation for withdrawals.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const nextVal = !twoFactorEnabled;
                          setTwoFactorEnabled(nextVal);
                          triggerPushNotification(
                            nextVal ? '🛡️ 2FA Activated' : '⚠️ 2FA Disabled',
                            nextVal ? 'Biometric fayda challenge enforced.' : 'Biometric challenge bypass active.',
                            '🛡️',
                            'vendor'
                          );
                        }}
                        className="p-1 cursor-pointer shrink-0"
                      >
                        {twoFactorEnabled ? (
                          <ToggleRight className="text-amber-500" size={28} />
                        ) : (
                          <ToggleLeft className="text-stone-500" size={28} />
                        )}
                      </button>
                    </div>

                    {/* Trusted Devices */}
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-stone-400 block">Authorized Devices</span>
                      <div className="space-y-1.5">
                        {trustedDevices.map(d => (
                          <div key={d.id} className="p-2.5 rounded-xl bg-neutral-950/20 border border-zinc-850/40 text-[10.5px]">
                            <div className="flex justify-between font-bold text-zinc-150">
                              <span>{d.name}</span>
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded-full font-normal">{d.status}</span>
                            </div>
                            <p className="text-[9.5px] text-stone-450 mt-0.5">{d.browser}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Login History Ledger */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-stone-400 block">Login Auditing Ledger</span>
                    <div className="space-y-1.5">
                      {loginHistory.map(lh => (
                        <div key={lh.id} className="p-2.5 rounded-xl bg-neutral-950/20 border border-zinc-850/40 text-[10px] flex justify-between items-center">
                          <div>
                            <span className="font-mono font-bold text-stone-300 block">{lh.ip}</span>
                            <span className="text-stone-450 text-[9.5px]">{lh.device} • {lh.date}</span>
                          </div>
                          <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            lh.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500 font-bold'
                          }`}>
                            {lh.success ? 'SUCCESS' : 'BLOCKED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* VERIFICATION & SUBSCRIPTION TIERS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-neutral-900/30 border border-zinc-850 space-y-2">
                  <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">Official Store Credentials</h4>
                  <div className="space-y-1 text-[10.5px] font-mono text-stone-400">
                    <p>TIN Registry: <strong className="text-zinc-200">1002341924</strong></p>
                    <p>Business License: <strong className="text-zinc-200">EZ-CORP-4029</strong></p>
                    <p>Fayda Registry ID: <strong className="text-zinc-200">9281-1142-9908</strong></p>
                  </div>
                  <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block mt-2">
                    ✓ Full Verification Validated
                  </span>
                </div>

                <div className="p-4 rounded-3xl bg-neutral-900/30 border border-zinc-850 space-y-2 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">Every-Zone Merchant Tier</h4>
                    <p className="text-[10.5px] text-stone-400 mt-1">
                      You are subscribed to the **Elite Pro Tier** with 0% escrow mediation fees.
                    </p>
                  </div>
                  <span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl self-start">
                    Pro Elite Sub active
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
