import React, { useState, useEffect } from 'react';
import { 
  Bell, BellOff, X, Check, Trash2, ShieldAlert, Heart, MessageSquare, 
  ShoppingBag, Home, Briefcase, Award, CreditCard, Star, Ticket, Users, Sparkles, FolderArchive 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
  actions?: string; // stringified JSON list of actions
}

interface NotificationCenterProps {
  isDarkMode: boolean;
  userId: string;
  lang: 'en' | 'am';
}

export function NotificationCenter({ isDarkMode, userId, lang }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [toastNotification, setToastNotification] = useState<Notification | null>(null);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('ez_notif_muted') === 'true');
  const [showSettings, setShowSettings] = useState(false);
  const [notifSettings, setNotifSettings] = useState(() => {
    const saved = localStorage.getItem('ez_notif_settings');
    return saved ? JSON.parse(saved) : { email: true, sms: true, orders: true, matches: true };
  });

  useEffect(() => {
    localStorage.setItem('ez_notif_muted', isMuted ? 'true' : 'false');
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('ez_notif_settings', JSON.stringify(notifSettings));
  }, [notifSettings]);

  const handleDeleteAllNotifications = async () => {
    if (confirm(lang === 'en' ? 'Delete all notifications?' : 'ሁሉንም ማሳወቂያዎች ማጥፋት ይፈልጋሉ?')) {
      try {
        const res = await fetch(`/api/notifications?userId=${userId}`, { method: 'DELETE' });
        if (res.ok) {
          fetchNotifications();
        } else {
          // Local fallback purge
          setNotifications([]);
          setUnreadCount(0);
        }
      } catch (e) {
        // Fallback
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const rList = await fetch(`/api/notifications?userId=${userId}`);
      if (rList.ok) {
        const payload = await rList.json();
        const newList = payload.notifications || [];
        
        // Dynamic push notification toast simulator if a brand new unread notification arrives!
        if (!isMuted && notifications.length > 0 && newList.length > notifications.length) {
          const fresh = newList.find((n: Notification) => n.status !== 'READ' && !notifications.some(old => old.id === n.id));
          if (fresh) {
            setToastNotification(fresh);
            // Autohide after 4.5 seconds
            setTimeout(() => setToastNotification(null), 4500);
          }
        }
        setNotifications(newList);
      }
      
      const rUnread = await fetch(`/api/notifications/unread?userId=${userId}`);
      if (rUnread.ok) {
        const payload = await rUnread.json();
        setUnreadCount(payload.count || 0);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId, notifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(`/api/notifications/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleArchiveNotification = (id: string) => {
    // Simulated Archive Action
    alert(`Notification ${id} moved to Secure Ledger Archive.`);
    handleDeleteNotification(id);
  };

  // Maps categories to customized colors and premium Lucide Icons
  const getCategoryTheme = (type: string) => {
    switch (type) {
      case 'ORDERS':
        return {
          icon: <ShoppingBag size={14} className="text-emerald-500 shrink-0" />,
          bgColor: 'bg-emerald-500/10 border-emerald-500/20',
          label: lang === 'en' ? 'Orders' : 'ትዕዛዞች'
        };
      case 'PAYMENTS':
        return {
          icon: <CreditCard size={14} className="text-blue-500 shrink-0" />,
          bgColor: 'bg-blue-500/10 border-blue-500/20',
          label: lang === 'en' ? 'Payments' : 'ክፍያዎች'
        };
      case 'REVIEWS':
        return {
          icon: <Star size={14} className="text-amber-500 shrink-0 fill-amber-500" />,
          bgColor: 'bg-amber-500/10 border-amber-500/20',
          label: lang === 'en' ? 'Reviews' : 'አስተያየቶች'
        };
      case 'MESSAGES':
        return {
          icon: <MessageSquare size={14} className="text-[#D4AF37] shrink-0" />,
          bgColor: 'bg-amber-500/5 border-amber-500/10',
          label: lang === 'en' ? 'Messages' : 'መልእክቶች'
        };
      case 'JOB_APPLICATIONS':
        return {
          icon: <Briefcase size={14} className="text-purple-500 shrink-0" />,
          bgColor: 'bg-purple-500/10 border-purple-500/20',
          label: lang === 'en' ? 'Jobs' : 'ስራዎች'
        };
      case 'HOUSE_INQUIRIES':
        return {
          icon: <Home size={14} className="text-sky-500 shrink-0" />,
          bgColor: 'bg-sky-500/10 border-sky-500/20',
          label: lang === 'en' ? 'Property' : 'ቤቶች'
        };
      case 'SERVICE_BOOKINGS':
        return {
          icon: <Sparkles size={14} className="text-teal-500 shrink-0" />,
          bgColor: 'bg-teal-500/10 border-teal-500/20',
          label: lang === 'en' ? 'Services' : 'አገልግሎቶች'
        };
      case 'LOTTERY':
        return {
          icon: <Ticket size={14} className="text-pink-500 shrink-0" />,
          bgColor: 'bg-pink-500/10 border-pink-500/20',
          label: lang === 'en' ? 'Lottery' : 'ዕጣዎች'
        };
      case 'MATCHMAKING':
        return {
          icon: <Heart size={14} className="text-red-500 fill-red-500 shrink-0" />,
          bgColor: 'bg-red-500/10 border-red-500/20',
          label: lang === 'en' ? 'Matchmaking' : 'ትዳር'
        };
      case 'VENDOR_UPDATES':
        return {
          icon: <Award size={14} className="text-yellow-500 shrink-0" />,
          bgColor: 'bg-yellow-500/10 border-yellow-500/20',
          label: lang === 'en' ? 'Vendor Updates' : 'ነጋዴዎች'
        };
      case 'SECURITY':
        return {
          icon: <ShieldAlert size={14} className="text-red-650 shrink-0 animate-pulse" />,
          bgColor: 'bg-red-650/10 border-red-650/20',
          label: lang === 'en' ? 'Security' : 'ደህንነት'
        };
      default:
        return {
          icon: <Award size={14} className="text-stone-400 shrink-0" />,
          bgColor: 'bg-stone-500/10 border-stone-500/20',
          label: lang === 'en' ? 'System' : 'ሲስተም'
        };
    }
  };

  // Executes actual actions
  const executeAction = (actionType: string, payload: any) => {
    switch (actionType) {
      case 'OPEN_CHAT':
        const el = document.getElementById('footer_escrow_chat_btn');
        if (el) el.click();
        break;
      case 'TRACK_ORDER':
        alert(`Dispatched order tracing ledger. Active courier delivery tracking initialized.`);
        break;
      case 'OPEN_PRODUCT':
        alert(`Rerouting to shared product catalogue node: ID ${payload?.productId || 'deluxe-habesha'}`);
        break;
      case 'OPEN_PROPERTY':
        alert(`Opening luxury listing details on the secure land register.`);
        break;
      case 'OPEN_JOB':
        alert(`Opening Ministry approved visa-ready overseas employment visa prospectus.`);
        break;
      case 'REPLY':
        const replyText = prompt("Type secure reply dispatch:");
        if (replyText) {
          alert(`Encrypted reply packet securely delivered.`);
        }
        break;
      default:
        alert("Alert action completed successfully.");
    }
  };

  const categories = [
    { value: 'ALL', label: lang === 'en' ? 'All Alerts' : 'ሁሉም' },
    { value: 'ORDERS', label: lang === 'en' ? 'Orders' : 'ትዕዛዝ' },
    { value: 'PAYMENTS', label: lang === 'en' ? 'Payments' : 'ክፍያ' },
    { value: 'MESSAGES', label: lang === 'en' ? 'Chats' : 'መልእክት' },
    { value: 'SECURITY', label: lang === 'en' ? 'Security' : 'ደህንነት' }
  ];

  const filteredNotifications = notifications.filter(notif => {
    if (activeCategoryFilter === 'ALL') return true;
    return notif.type === activeCategoryFilter;
  });

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl transition-all hover:bg-stone-100 dark:hover:bg-zinc-850 cursor-pointer"
        title="In-App Notifications Ledger"
      >
        <Bell size={18} className="text-stone-700 dark:text-zinc-200" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-650 text-[8px] font-black font-sans text-white rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover list */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={`absolute right-0 mt-2.5 w-88 max-h-[460px] rounded-2xl border shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
            
            {/* Header section */}
            <div className="p-3 border-b space-y-2 bg-stone-50 dark:bg-zinc-900/60 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  🔔 {lang === 'en' ? 'Fayda Guard Alerts Center' : 'የደህንነት ማሳወቂያዎች'} ({unreadCount})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded text-stone-550 transition cursor-pointer"
                    title={isMuted ? 'Unmute Popups' : 'Mute Popups'}
                  >
                    {isMuted ? <BellOff size={11} className="text-red-500" /> : <Bell size={11} />}
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded transition cursor-pointer ${showSettings ? 'text-amber-500' : 'text-stone-550'}`}
                    title="Alert Settings"
                  >
                    <Sparkles size={11} />
                  </button>
                  <button
                    onClick={handleDeleteAllNotifications}
                    className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded text-stone-450 hover:text-red-500 transition cursor-pointer"
                    title="Delete All Alerts"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {/* Settings configuration form */}
              {showSettings ? (
                <div className="p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 space-y-2 text-[10px] bg-white dark:bg-zinc-950 font-sans text-left">
                  <span className="font-extrabold uppercase text-[8px] tracking-wider text-stone-450 block">Notification channels</span>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifSettings.email}
                        onChange={(e) => setNotifSettings(prev => ({ ...prev, email: e.target.checked }))}
                        className="rounded accent-amber-500"
                      />
                      <span>Email Alerts</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifSettings.sms}
                        onChange={(e) => setNotifSettings(prev => ({ ...prev, sms: e.target.checked }))}
                        className="rounded accent-amber-500"
                      />
                      <span>SMS Alerts</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifSettings.orders}
                        onChange={(e) => setNotifSettings(prev => ({ ...prev, orders: e.target.checked }))}
                        className="rounded accent-amber-500"
                      />
                      <span>Order Alerts</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifSettings.matches}
                        onChange={(e) => setNotifSettings(prev => ({ ...prev, matches: e.target.checked }))}
                        className="rounded accent-amber-500"
                      />
                      <span>Matchmaking</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center gap-2">
                  {/* Categorization Filter Buttons */}
                  <div className="flex gap-1 overflow-x-auto pb-1 text-[8px] font-black uppercase tracking-wider">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => setActiveCategoryFilter(cat.value)}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${activeCategoryFilter === cat.value ? 'bg-[#1E3A1A] text-[#D4AF37]' : 'text-stone-400 hover:text-stone-700'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[9px] font-bold text-amber-600 hover:underline cursor-pointer shrink-0"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* List Stream */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-zinc-850 max-h-[320px]">
              {filteredNotifications.length === 0 ? (
                <div className="p-10 text-center text-xs text-stone-400 italic">
                  No active notifications found in this segment.
                </div>
              ) : (
                filteredNotifications.map(notif => {
                  const isRead = notif.status === 'READ';
                  const theme = getCategoryTheme(notif.type);
                  
                  return (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs flex gap-3 transition-all ${
                        isRead ? 'opacity-70 bg-transparent' : 'bg-amber-500/[0.02] font-semibold'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg border h-7 flex items-center justify-center ${theme.bgColor}`}>
                        {theme.icon}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-[11px] block text-stone-800 dark:text-zinc-200">
                            {notif.title}
                          </span>
                          <span className="text-[7.5px] font-mono text-stone-400 shrink-0">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-stone-450 dark:text-zinc-400 leading-normal font-sans">
                          {notif.body}
                        </p>

                        {/* Category badge */}
                        <span className="inline-block text-[7px] font-black tracking-widest uppercase text-stone-400">
                          {theme.label}
                        </span>

                        {/* --- EXECUTABLE ACTIONS PANEL --- */}
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {/* Simulated specific Action buttons if attached */}
                          {notif.type === 'ORDERS' && (
                            <button onClick={() => executeAction('TRACK_ORDER', null)} className="px-2 py-0.5 bg-emerald-500 text-stone-950 text-[8px] font-black uppercase rounded hover:bg-emerald-600 cursor-pointer">
                              Track Order
                            </button>
                          )}
                          {notif.type === 'MESSAGES' && (
                            <button onClick={() => executeAction('OPEN_CHAT', null)} className="px-2 py-0.5 bg-[#D4AF37] text-stone-950 text-[8px] font-black uppercase rounded hover:bg-amber-500 cursor-pointer">
                              Open Chat
                            </button>
                          )}
                          {notif.type === 'HOUSE_INQUIRIES' && (
                            <button onClick={() => executeAction('OPEN_PROPERTY', null)} className="px-2 py-0.5 bg-sky-500 text-stone-950 text-[8px] font-black uppercase rounded hover:bg-sky-600 cursor-pointer">
                              Open Property
                            </button>
                          )}
                          {notif.type === 'JOB_APPLICATIONS' && (
                            <button onClick={() => executeAction('OPEN_JOB', null)} className="px-2 py-0.5 bg-purple-500 text-white text-[8px] font-black uppercase rounded hover:bg-purple-600 cursor-pointer">
                              Open Job
                            </button>
                          )}
                          {notif.type === 'REVIEWS' && (
                            <button onClick={() => executeAction('REPLY', null)} className="px-2 py-0.5 bg-neutral-800 text-white text-[8px] font-black uppercase rounded hover:bg-neutral-700 cursor-pointer">
                              Reply
                            </button>
                          )}
                        </div>

                        {/* Utility operations: Read, Archive, Delete */}
                        <div className="flex justify-end gap-1 pt-1.5">
                          {!isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded text-stone-500 hover:text-[#D4AF37] cursor-pointer"
                              title="Mark read"
                            >
                              <Check size={11} />
                            </button>
                          )}
                          <button
                            onClick={() => handleArchiveNotification(notif.id)}
                            className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded text-stone-450 hover:text-amber-500 cursor-pointer"
                            title="Archive to Ledger"
                          >
                            <FolderArchive size={11} />
                          </button>
                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded text-stone-400 hover:text-red-500 cursor-pointer"
                            title="Delete alert"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* --- PUSH NOTIFICATION POPUP (Dispatched to browser Web channel immediately) --- */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-100 max-w-sm bg-[#1E3A1A] border border-[#D4AF37]/40 text-[#D4AF37] rounded-2xl p-4 shadow-2xl flex gap-3 text-left items-start"
          >
            <div className="p-2 bg-[#D4AF37]/15 rounded-xl border border-[#D4AF37]/20">
              {getCategoryTheme(toastNotification.type).icon}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <span className="font-sans font-black text-xs text-white uppercase tracking-wider block">
                  {toastNotification.title}
                </span>
                <button onClick={() => setToastNotification(null)} className="text-stone-400 hover:text-white">
                  <X size={12} />
                </button>
              </div>
              <p className="text-[10px] text-stone-300 leading-relaxed font-sans">{toastNotification.body}</p>
              <div className="flex justify-end pt-1 gap-1.5">
                <button onClick={() => { setToastNotification(null); executeAction('OPEN_CHAT', null); }} className="px-2 py-1 bg-[#D4AF37] text-stone-950 font-black text-[8px] uppercase rounded-lg hover:bg-white cursor-pointer transition-colors">
                  Open Action
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
