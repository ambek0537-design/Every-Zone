import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, Image, Video, File, X, Check, CheckCheck, 
  Search, ShieldAlert, Phone, Users, Home, Briefcase, ShoppingBag, ArrowLeft,
  Trash2, CornerUpLeft, Forward, Smile, MoreVertical, Volume2, MapPin, 
  Sparkles, PhoneCall, VideoIcon, Monitor, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string | null;
}

interface Reaction {
  emoji: string;
  userId: string;
}

interface CardContent {
  id: string;
  name?: string;
  title?: string;
  price?: string | number;
  image?: string;
  photo?: string;
  location?: string;
  country?: string;
  salary?: string;
  agency?: string;
  category?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'VOICE_NOTE' | 'PDF' | 'LOCATION' | 'PRODUCT_CARD' | 'PROPERTY_CARD' | 'JOB_CARD' | 'SERVICE_CARD';
  content: string | null;
  mediaUrl: string | null;
  createdAt: string;
  attachments?: Attachment[];
  replyToMessageId?: string | null;
  reactions?: Reaction[];
  isForwarded?: boolean;
  deletedForUserIds?: string[];
  isDeletedForEveryone?: boolean;
  cardMetadata?: CardContent | null;
}

interface Conversation {
  id: string;
  type: 'PRODUCT' | 'PROPERTY' | 'JOB' | 'GENERAL';
  buyerId: string;
  vendorId: string;
  recipientName: string;
  recipientAvatar: string;
  lastMessage: {
    content: string | null;
    messageType: string;
    createdAt: string;
    senderId: string;
    isRead: boolean;
  } | null;
}

interface ChatSystemProps {
  isDarkMode: boolean;
  userId: string; // Current user e.g. "u-2" (Selamawit)
  onClose?: () => void;
  lang: 'en' | 'am';
}

export function ChatSystem({ isDarkMode, userId, onClose, lang }: ChatSystemProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PRODUCT' | 'PROPERTY' | 'JOB'>('ALL');
  const [uploadingFile, setUploadingFile] = useState<{ name: string; url: string; type: Message['messageType'] } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // High-fidelity feature states
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const [isForwardOpen, setIsForwardOpen] = useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(null);
  const [presenceMap, setPresenceMap] = useState<Record<string, { online: boolean; lastSeen: string | null }>>({});
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const [showReactionId, setShowReactionId] = useState<string | null>(null);
  
  // Calling system states (Future Ready Preparation Overlay)
  const [activeCall, setActiveCall] = useState<{ type: 'VOICE' | 'VIDEO' | 'SCREEN'; status: 'DIALING' | 'CONNECTED' | 'ENDED' } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch conversations
  const loadConversations = async () => {
    try {
      const res = await fetch(`/api/chat/conversations?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  // Fetch messages for active conversation
  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/chat/${convId}?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // Load presence and typing indicator for active recipient
  const fetchPresenceAndTyping = async () => {
    if (!activeConv) return;
    const otherId = activeConv.buyerId === userId ? activeConv.vendorId : activeConv.buyerId;
    try {
      // Presence check
      const presRes = await fetch(`/api/chat/presence/${otherId}`);
      if (presRes.ok) {
        const pData = await presRes.json();
        if (pData.presence) {
          setPresenceMap(prev => ({
            ...prev,
            [otherId]: { online: pData.presence.online, lastSeen: pData.presence.lastSeen }
          }));
        }
      }

      // Typing check
      const typingRes = await fetch(`/api/chat/typing/${activeConv.id}`);
      if (typingRes.ok) {
        const tData = await typingRes.json();
        // Filter out current user from typing list
        setTypingUsers((tData.activeTypingUsers || []).filter((id: string) => id !== userId));
      }
    } catch (error) {
      console.error('Failed to fetch typing/presence status:', error);
    }
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 6000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv.id);
      fetchPresenceAndTyping();
      const interval = setInterval(() => {
        loadMessages(activeConv.id);
        fetchPresenceAndTyping();
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
      setTypingUsers([]);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || (!inputText.trim() && !uploadingFile)) return;

    try {
      if (uploadingFile) {
        // Simulated attachment upload
        const payload = {
          conversationId: activeConv.id,
          senderId: userId,
          content: inputText.trim() || `Shared ${uploadingFile.type.replace('_', ' ')}: ${uploadingFile.name}`,
          messageType: uploadingFile.type,
          fileName: uploadingFile.name,
          fileUrl: uploadingFile.url,
          fileSize: uploadingFile.type === 'VOICE_NOTE' ? '320 KB (0:45)' : '1.4 MB'
        };

        const res = await fetch('/api/chat/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setInputText('');
          setUploadingFile(null);
          await loadMessages(activeConv.id);
          await loadConversations();
        }
      } else {
        // Standard text message
        const payload = {
          conversationId: activeConv.id,
          senderId: userId,
          content: inputText.trim(),
          messageType: 'TEXT',
          replyToMessageId: replyMessage ? replyMessage.id : null
        };

        // Emit typing.stop before sending
        await fetch('/api/chat/typing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: activeConv.id, userId, isTyping: false })
        });

        const res = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setInputText('');
          setReplyMessage(null);
          await loadMessages(activeConv.id);
          await loadConversations();
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTypingStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!activeConv) return;

    // Trigger typing POST api
    try {
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv.id,
          userId,
          isTyping: e.target.value.length > 0
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReactToMessage = async (messageId: string, emoji: string) => {
    try {
      const res = await fetch('/api/chat/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, userId, emoji })
      });
      if (res.ok) {
        if (activeConv) loadMessages(activeConv.id);
        setShowReactionId(null);
        setShowOptionsId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (messageId: string, deleteType: 'FOR_ME' | 'EVERYONE') => {
    try {
      const res = await fetch('/api/chat/message', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, userId, type: deleteType })
      });
      if (res.ok) {
        if (activeConv) loadMessages(activeConv.id);
        setShowOptionsId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleForwardMessage = async (targetConvId: string) => {
    if (!messageToForward) return;
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: targetConvId,
          senderId: userId,
          messageType: messageToForward.messageType,
          content: messageToForward.content ? `[Forwarded]: ${messageToForward.content}` : null,
          mediaUrl: messageToForward.mediaUrl,
          cardMetadata: messageToForward.cardMetadata
        })
      });
      if (res.ok) {
        setIsForwardOpen(false);
        setMessageToForward(null);
        loadConversations();
        // If current active is the forwarded target, refresh messages
        if (activeConv?.id === targetConvId) {
          loadMessages(targetConvId);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const simulateAttachFile = (type: Message['messageType']) => {
    if (type === 'IMAGE') {
      setUploadingFile({
        name: 'authentic_handwoven_details.jpg',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        type: 'IMAGE'
      });
    } else if (type === 'VIDEO') {
      setUploadingFile({
        name: 'premium_villa_tour.mp4',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
        type: 'VIDEO'
      });
    } else if (type === 'VOICE_NOTE') {
      setUploadingFile({
        name: 'negotiation_terms_audio.mp3',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        type: 'VOICE_NOTE'
      });
    } else if (type === 'PDF') {
      setUploadingFile({
        name: 'escrow_agreement_cleared_ledger.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'PDF'
      });
    } else if (type === 'LOCATION') {
      setUploadingFile({
        name: 'Addis Ababa Bole International Area',
        url: 'https://maps.google.com/?q=8.9806,38.7897',
        type: 'LOCATION'
      });
    } else {
      setUploadingFile({
        name: 'commercial_license.pdf',
        url: '#',
        type: 'FILE'
      });
    }
  };

  // High Fidelity Sharing Card Templates to click & send cards directly in chat
  const sendDemoSharingCard = async (cardType: 'PRODUCT' | 'PROPERTY' | 'JOB' | 'SERVICE') => {
    if (!activeConv) return;
    let cardMetadata: CardContent | null = null;
    let desc = "";

    if (cardType === 'PRODUCT') {
      cardMetadata = {
        id: 'p-1',
        name: 'Habesha Silk Wedding Wear Deluxe',
        price: '45,000 ETB',
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=200'
      };
      desc = "📦 Shared product details with vendor";
    } else if (cardType === 'PROPERTY') {
      cardMetadata = {
        id: 'prop-1',
        title: 'Modern Bole G+2 Stone Penthouse',
        price: '180,000 ETB / month',
        photo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200',
        location: 'Bole, Addis Ababa'
      };
      desc = "🏠 Shared house property listing";
    } else if (cardType === 'JOB') {
      cardMetadata = {
        id: 'job-1',
        title: 'Senior Logistics Coordinator',
        salary: '$2,800 USD / month',
        country: 'Dubai, UAE',
        agency: 'Abyssinia Premium Employment Agency'
      };
      desc = "🌍 Shared overseas job opening";
    } else if (cardType === 'SERVICE') {
      cardMetadata = {
        id: 'srv-1',
        name: 'Unified Chapa Escrow Integration Service',
        price: 'Free Trial Active',
        category: 'Tech Solutions Integration'
      };
      desc = "⚡ Shared business integration service Card";
    }

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv.id,
          senderId: userId,
          messageType: `${cardType}_CARD`,
          content: desc,
          cardMetadata
        })
      });
      if (res.ok) {
        loadMessages(activeConv.id);
        loadConversations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Calling Simulations Overlay Controls
  const triggerCallSimulation = (type: 'VOICE' | 'VIDEO' | 'SCREEN') => {
    setActiveCall({ type, status: 'DIALING' });
    // Transition to CONNECTED after 2.5 seconds
    setTimeout(() => {
      setActiveCall({ type, status: 'CONNECTED' });
    }, 2500);
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || c.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getRecipientPresence = () => {
    if (!activeConv) return null;
    const otherId = activeConv.buyerId === userId ? activeConv.vendorId : activeConv.buyerId;
    return presenceMap[otherId] || { online: true, lastSeen: null };
  };

  return (
    <div className={`relative rounded-3xl border shadow-xl flex h-[620px] overflow-hidden ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
      
      {/* Sidebar List */}
      <div className={`w-full md:w-80 flex flex-col border-r h-full ${activeConv ? 'hidden md:flex' : 'flex'} ${isDarkMode ? 'border-zinc-850 bg-zinc-900/40' : 'border-stone-150 bg-[#FAF9F6]'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5 font-sans">
              <MessageCircle size={16} className="text-[#D4AF37]" /> {lang === 'en' ? 'Every-zone Messenger' : 'የመልእክት ደብተር'}
            </h3>
            {onClose && (
              <button onClick={onClose} className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-lg">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-stone-400" size={13} />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search conversations...' : 'መልእክት ፈልግ...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[9px] font-black uppercase tracking-wider">
            {(['ALL', 'PRODUCT', 'PROPERTY', 'JOB'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${activeFilter === filter ? 'bg-[#1E3A1A] text-[#D4AF37]' : 'text-stone-400 hover:text-stone-700'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400 font-mono italic">
              No active conversations located.
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isSelected = activeConv?.id === conv.id;
              const otherId = conv.buyerId === userId ? conv.vendorId : conv.buyerId;
              const presence = presenceMap[otherId];
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-all ${
                    isSelected 
                      ? 'bg-[#1E3A1A]/10 border border-[#1E3A1A]/20' 
                      : 'hover:bg-stone-100 dark:hover:bg-zinc-900/60 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.recipientAvatar}
                      alt={conv.recipientName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 ${presence?.online !== false ? 'bg-emerald-500' : 'bg-stone-405 dark:bg-zinc-700'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-extrabold text-xs block truncate text-stone-800 dark:text-zinc-200">
                        {conv.recipientName}
                      </span>
                      <span className="text-[8px] font-mono text-stone-400 shrink-0">
                        {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className={`text-[8px] font-black px-1 rounded uppercase tracking-wider ${
                        conv.type === 'PROPERTY' ? 'bg-blue-500/10 text-blue-500' :
                        conv.type === 'JOB' ? 'bg-purple-500/10 text-purple-500' :
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {conv.type}
                      </span>
                      <p className="text-[10px] text-stone-450 dark:text-zinc-400 truncate flex-1 font-serif">
                        {conv.lastMessage?.content || 'No messages yet.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-full bg-stone-50 dark:bg-zinc-900/20 ${!activeConv ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b flex justify-between items-center bg-white dark:bg-zinc-950`}>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveConv(null)} className="md:hidden p-1 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg mr-1">
                  <ArrowLeft size={16} />
                </button>
                <div className="relative">
                  <img
                    src={activeConv.recipientAvatar}
                    alt={activeConv.recipientName}
                    className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/30"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white dark:border-zinc-950 ${getRecipientPresence()?.online !== false ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-stone-800 dark:text-zinc-200 flex items-center gap-1">
                    {activeConv.recipientName}
                  </h4>
                  <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    {getRecipientPresence()?.online !== false ? (
                      <>
                        <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Active Online
                      </>
                    ) : (
                      <>
                        Last seen {getRecipientPresence()?.lastSeen ? new Date(getRecipientPresence()!.lastSeen!).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'recently'}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Secure calls, Video and screen sharing buttons */}
              <div className="flex items-center gap-1 md:gap-2">
                <button 
                  onClick={() => triggerCallSimulation('VOICE')}
                  title="Secure Voice Call (V2)"
                  className="p-2 text-stone-500 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  <PhoneCall size={14} />
                </button>
                <button 
                  onClick={() => triggerCallSimulation('VIDEO')}
                  title="Secure Video Call (V2)"
                  className="p-2 text-stone-500 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  <VideoIcon size={14} />
                </button>
                <button 
                  onClick={() => triggerCallSimulation('SCREEN')}
                  title="Secure Screen Sharing (V2)"
                  className="p-2 text-stone-500 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  <Monitor size={14} />
                </button>
                <span className="text-[9px] font-black uppercase text-amber-500 bg-[#1E3A1A]/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Secured
                </span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 italic">
                  Start of secured transaction negotiation. Send a message or cards to begin.
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === userId;
                  const replyToMsg = msg.replyToMessageId ? messages.find(m => m.id === msg.replyToMessageId) : null;
                  
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} relative group`}>
                      <div className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-sm space-y-2 relative border ${
                        isMe 
                          ? 'bg-[#1E3A1A] text-[#D4AF37] border-emerald-950 rounded-tr-none' 
                          : 'bg-white dark:bg-zinc-800 text-stone-800 dark:text-zinc-250 border-stone-200 dark:border-zinc-750 rounded-tl-none'
                      }`}>
                        
                        {/* Display replies if active */}
                        {replyToMsg && (
                          <div className="p-2 rounded-lg bg-black/10 border-l-2 border-[#D4AF37] mb-1 text-[10px] opacity-80">
                            <span className="block font-black text-[9px] opacity-60">Quoting:</span>
                            <p className="truncate italic font-serif">{replyToMsg.content}</p>
                          </div>
                        )}

                        {/* Forwarded Status Label */}
                        {msg.isForwarded && (
                          <span className="text-[7px] uppercase font-bold tracking-wider opacity-60 flex items-center gap-0.5">
                            <Forward size={8} /> Forwarded
                          </span>
                        )}

                        {/* If it contains standard attachment (IMAGE, VIDEO, PDF) */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="space-y-1">
                            {msg.attachments.map(att => (
                              <div key={att.id} className="p-2 rounded-xl bg-black/10 flex flex-col gap-2 border border-white/10">
                                {msg.messageType === 'IMAGE' ? (
                                  <div className="space-y-1">
                                    <img src={att.fileUrl} alt={att.fileName} className="rounded-lg max-h-32 object-cover" />
                                    <span className="text-[8px] opacity-70 block font-mono">{att.fileName}</span>
                                  </div>
                                ) : msg.messageType === 'VIDEO' ? (
                                  <div className="space-y-1">
                                    <video src={att.fileUrl} controls className="rounded-lg max-h-40" />
                                    <span className="text-[8px] opacity-70 block font-mono">{att.fileName}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <File size={14} className="text-[#D4AF37]" />
                                    <div className="min-w-0">
                                      <p className="text-[9px] font-black truncate">{att.fileName}</p>
                                      {att.fileSize && <p className="text-[7.5px] opacity-60">{att.fileSize}</p>}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Custom Voice Note Bubble */}
                        {msg.messageType === 'VOICE_NOTE' && (
                          <div className="flex items-center gap-3 p-1.5 rounded-xl bg-black/15">
                            <button className="p-1.5 bg-[#D4AF37] hover:bg-amber-500 rounded-full text-stone-900 cursor-pointer">
                              <Volume2 size={12} className="animate-pulse" />
                            </button>
                            <div className="flex-1 min-w-[120px]">
                              {/* Waveform graphic bars */}
                              <div className="flex gap-0.5 h-6 items-center">
                                {[3, 6, 4, 8, 2, 9, 5, 7, 3, 6, 2, 8, 4, 5].map((h, i) => (
                                  <span key={i} className="flex-1 bg-amber-500/50 rounded-full" style={{ height: `${h * 10}%` }} />
                                ))}
                              </div>
                              <span className="text-[7px] font-mono opacity-75">Voice Note • 0:45</span>
                            </div>
                          </div>
                        )}

                        {/* Custom Location sharing Pin bubble */}
                        {msg.messageType === 'LOCATION' && (
                          <div className="rounded-xl overflow-hidden border border-amber-500/20 bg-black/10">
                            <div className="p-2 flex items-center gap-2">
                              <MapPin size={14} className="text-red-500" />
                              <span className="font-mono text-[9px] font-bold">{msg.content}</span>
                            </div>
                            <a href={msg.mediaUrl || '#'} target="_blank" rel="noreferrer" className="block text-center py-1 bg-[#D4AF37] hover:bg-[#c39e2e] text-stone-950 text-[8px] font-black uppercase tracking-wider">
                              Open Maps Location
                            </a>
                          </div>
                        )}

                        {/* --- PRODUCT SHARING CARD BUBBLE --- */}
                        {msg.messageType === 'PRODUCT_CARD' && msg.cardMetadata && (
                          <div className="rounded-xl border border-emerald-500/20 bg-black/15 overflow-hidden w-48 text-left space-y-1">
                            <img src={msg.cardMetadata.image} alt={msg.cardMetadata.name} className="w-full h-24 object-cover" />
                            <div className="p-2 space-y-1">
                              <span className="bg-emerald-500/10 text-emerald-400 text-[7px] font-black px-1 rounded uppercase">📦 PRODUCT CARD</span>
                              <h5 className="font-extrabold text-[10px] text-white truncate">{msg.cardMetadata.name}</h5>
                              <p className="text-amber-500 font-bold text-[9px] font-mono">{msg.cardMetadata.price}</p>
                              <button className="w-full bg-[#D4AF37] text-stone-950 py-1 rounded text-[8px] font-black uppercase tracking-wider hover:bg-[#c09d2d] cursor-pointer">
                                Open Product
                              </button>
                            </div>
                          </div>
                        )}

                        {/* --- PROPERTY SHARING CARD BUBBLE --- */}
                        {msg.messageType === 'PROPERTY_CARD' && msg.cardMetadata && (
                          <div className="rounded-xl border border-blue-500/20 bg-black/15 overflow-hidden w-48 text-left space-y-1">
                            <img src={msg.cardMetadata.photo} alt={msg.cardMetadata.title} className="w-full h-24 object-cover" />
                            <div className="p-2 space-y-1">
                              <span className="bg-blue-500/10 text-blue-400 text-[7px] font-black px-1 rounded uppercase">🏠 PROPERTY CARD</span>
                              <h5 className="font-extrabold text-[10px] text-white truncate">{msg.cardMetadata.title}</h5>
                              <p className="text-amber-500 font-bold text-[9px] font-mono">{msg.cardMetadata.price}</p>
                              <span className="text-[7.5px] text-stone-400 block truncate">📍 {msg.cardMetadata.location}</span>
                              <button className="w-full bg-[#D4AF37] text-stone-950 py-1 rounded text-[8px] font-black uppercase tracking-wider hover:bg-[#c09d2d] cursor-pointer">
                                Open Listing
                              </button>
                            </div>
                          </div>
                        )}

                        {/* --- JOB SHARING CARD BUBBLE --- */}
                        {msg.messageType === 'JOB_CARD' && msg.cardMetadata && (
                          <div className="rounded-xl border border-purple-500/20 bg-black/15 p-2.5 w-48 text-left space-y-2">
                            <span className="bg-purple-500/10 text-purple-400 text-[7px] font-black px-1 rounded uppercase">🌍 JOB CARD</span>
                            <div>
                              <h5 className="font-extrabold text-[10px] text-white truncate">{msg.cardMetadata.title}</h5>
                              <p className="text-stone-300 text-[8px]">{msg.cardMetadata.agency}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[7.5px] font-mono">
                              <div className="bg-black/10 p-1 rounded">
                                <span className="block text-stone-500 font-black">Country</span>
                                <span className="text-white font-extrabold">{msg.cardMetadata.country}</span>
                              </div>
                              <div className="bg-black/10 p-1 rounded">
                                <span className="block text-stone-500 font-black">Salary</span>
                                <span className="text-amber-500 font-extrabold">{msg.cardMetadata.salary}</span>
                              </div>
                            </div>
                            <button className="w-full bg-[#D4AF37] text-stone-950 py-1 rounded text-[8px] font-black uppercase tracking-wider hover:bg-[#c09d2d] cursor-pointer">
                              Apply
                            </button>
                          </div>
                        )}

                        {/* --- SERVICE SHARING CARD BUBBLE --- */}
                        {msg.messageType === 'SERVICE_CARD' && msg.cardMetadata && (
                          <div className="rounded-xl border border-amber-500/25 bg-black/15 p-2.5 w-48 text-left space-y-1.5">
                            <span className="bg-amber-500/10 text-amber-500 text-[7px] font-black px-1 rounded uppercase">⚡ SERVICE CARD</span>
                            <h5 className="font-extrabold text-[10px] text-white leading-tight">{msg.cardMetadata.name}</h5>
                            <p className="text-stone-400 text-[8px]">{msg.cardMetadata.category}</p>
                            <p className="text-[#D4AF37] font-black text-[8.5px] font-mono">{msg.cardMetadata.price}</p>
                            <button className="w-full bg-[#D4AF37] text-stone-950 py-1 rounded text-[8px] font-black uppercase tracking-wider hover:bg-[#c09d2d] cursor-pointer">
                              Open Service
                            </button>
                          </div>
                        )}

                        {/* Content text (unless custom card handles representation) */}
                        {msg.content && msg.messageType !== 'LOCATION' && msg.messageType !== 'PRODUCT_CARD' && msg.messageType !== 'PROPERTY_CARD' && msg.messageType !== 'JOB_CARD' && msg.messageType !== 'SERVICE_CARD' && (
                          <p className="leading-relaxed font-serif break-words">{msg.content}</p>
                        )}
                        
                        {/* Emoji Reactions display */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex gap-1 flex-wrap pt-1">
                            {msg.reactions.map((react, i) => (
                              <span key={i} className="bg-stone-100 dark:bg-zinc-900 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded-full" title={`Reacted by user ${react.userId}`}>
                                {react.emoji}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Metadata block (timestamp and read receipt) */}
                        <div className="flex justify-between items-center gap-2 opacity-60 text-[7px] font-mono pt-1">
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <div className="flex items-center gap-1">
                            {isMe && (msg.isRead ? <CheckCheck size={10} className="text-[#D4AF37]" /> : <Check size={10} />)}
                          </div>
                        </div>

                        {/* Hover Overlay Trigger for options: Reply, Reaction, Delete, Forward */}
                        <div className={`absolute top-1 z-30 hidden group-hover:flex items-center gap-1 bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-full p-1 shadow-md ${isMe ? 'right-full mr-2' : 'left-full ml-2'}`}>
                          {/* Reaction emojis micro trigger */}
                          <button 
                            onClick={() => setShowReactionId(showReactionId === msg.id ? null : msg.id)}
                            className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-full text-amber-500"
                            title="React"
                          >
                            <Smile size={11} />
                          </button>
                          <button 
                            onClick={() => setReplyMessage(msg)}
                            className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-full text-stone-500"
                            title="Reply"
                          >
                            <CornerUpLeft size={11} />
                          </button>
                          <button 
                            onClick={() => {
                              setMessageToForward(msg);
                              setIsForwardOpen(true);
                            }}
                            className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-full text-stone-500"
                            title="Forward"
                          >
                            <Forward size={11} />
                          </button>
                          
                          <button 
                            onClick={() => setShowOptionsId(showOptionsId === msg.id ? null : msg.id)}
                            className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-full text-stone-400 hover:text-stone-100"
                          >
                            <MoreVertical size={11} />
                          </button>
                        </div>

                        {/* Reactions Strip dropdown */}
                        {showReactionId === msg.id && (
                          <div className={`absolute bottom-full mb-1 z-40 bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-full p-1 shadow-xl flex gap-1 ${isMe ? 'right-0' : 'left-0'}`}>
                            {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emo => (
                              <button 
                                key={emo} 
                                onClick={() => handleReactToMessage(msg.id, emo)}
                                className="hover:scale-125 transition-transform text-xs cursor-pointer p-0.5"
                              >
                                {emo}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Options Menu Dropdown (Deletes, Flag) */}
                        {showOptionsId === msg.id && (
                          <div className={`absolute top-full mt-1 z-40 w-36 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-1 shadow-2xl text-[9px] ${isMe ? 'right-0' : 'left-0'}`}>
                            <button 
                              onClick={() => handleDeleteMessage(msg.id, 'FOR_ME')}
                              className="w-full text-left p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-lg flex items-center gap-1.5 text-stone-750 dark:text-zinc-300"
                            >
                              <Trash2 size={10} /> Delete for me
                            </button>
                            {isMe && (
                              <button 
                                onClick={() => handleDeleteMessage(msg.id, 'EVERYONE')}
                                className="w-full text-left p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-lg flex items-center gap-1.5 text-red-500 font-extrabold"
                              >
                                <X size={10} /> Delete for everyone
                              </button>
                            )}
                            <button 
                              onClick={async () => {
                                try {
                                  await fetch('/api/chat/report', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ conversationId: activeConv.id, reporterId: userId, reason: 'Spam / offensive chat content' })
                                  });
                                  alert('Report submitted successfully. Evidence secured.');
                                  setShowOptionsId(null);
                                } catch (e) { console.error(e); }
                              }}
                              className="w-full text-left p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-lg flex items-center gap-1.5 text-amber-500"
                            >
                              <ShieldAlert size={10} /> Report Content
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicators */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-stone-100 dark:bg-zinc-850 p-2.5 rounded-2xl rounded-tl-none border border-stone-200 dark:border-zinc-800 text-[10px] text-stone-500 flex items-center gap-1.5 italic">
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span>Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Demo Card Sharers Strip (allows sending high fidelity cards on the fly) */}
            <div className="px-4 py-1.5 bg-stone-100/60 dark:bg-zinc-950/40 border-t border-stone-150 dark:border-zinc-850 flex gap-1.5 items-center overflow-x-auto">
              <span className="text-[7.5px] uppercase font-black text-stone-500 tracking-wider">Share:</span>
              <button onClick={() => sendDemoSharingCard('PRODUCT')} className="bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors">
                📦 Product Card
              </button>
              <button onClick={() => sendDemoSharingCard('PROPERTY')} className="bg-blue-500/10 border border-blue-500/20 hover:border-blue-500 text-blue-400 text-[8px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors">
                🏠 Property Card
              </button>
              <button onClick={() => sendDemoSharingCard('JOB')} className="bg-purple-500/10 border border-purple-500/20 hover:border-purple-500 text-purple-400 text-[8px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors">
                🌍 Job Card
              </button>
              <button onClick={() => sendDemoSharingCard('SERVICE')} className="bg-amber-500/10 border border-amber-500/20 hover:border-amber-500 text-amber-500 text-[8px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors">
                ⚡ Service Card
              </button>
            </div>

            {/* Quoting parent message header */}
            {replyMessage && (
              <div className="px-4 py-2 bg-amber-500/5 border-t border-amber-500/20 flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1 text-stone-600 dark:text-zinc-300">
                  <CornerUpLeft size={11} className="text-amber-500" />
                  <span className="italic truncate">Replying to: {replyMessage.content}</span>
                </div>
                <button onClick={() => setReplyMessage(null)} className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-lg">
                  <X size={11} />
                </button>
              </div>
            )}

            {/* Attachment preview */}
            {uploadingFile && (
              <div className="px-4 py-2 bg-amber-500/5 border-t border-amber-500/20 flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-2">
                  {uploadingFile.type === 'IMAGE' ? <Image size={12} className="text-amber-600" /> : <File size={12} className="text-amber-600" />}
                  <span className="font-mono text-stone-600 dark:text-zinc-300">Ready to upload: {uploadingFile.name}</span>
                </div>
                <button onClick={() => setUploadingFile(null)} className="p-1 hover:bg-stone-200 dark:hover:bg-zinc-800 rounded-lg">
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-zinc-950 border-t border-stone-150 dark:border-zinc-850 flex items-center gap-2">
              {/* Attachment selector */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => simulateAttachFile('IMAGE')}
                  title="Attach Image Specification"
                  className="p-2 text-stone-400 hover:text-[#D4AF37] hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  <Image size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => simulateAttachFile('VIDEO')}
                  title="Attach Property Video Tour"
                  className="p-2 text-stone-400 hover:text-[#D4AF37] hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  <Video size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => simulateAttachFile('VOICE_NOTE')}
                  title="Attach Voice Message"
                  className="p-2 text-stone-400 hover:text-[#D4AF37] hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  <Volume2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => simulateAttachFile('PDF')}
                  title="Attach PDF Document"
                  className="p-2 text-stone-400 hover:text-[#D4AF37] hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  <Paperclip size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => simulateAttachFile('LOCATION')}
                  title="Attach Location Pin"
                  className="p-2 text-stone-400 hover:text-[#D4AF37] hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  <MapPin size={15} />
                </button>
              </div>

              <input
                type="text"
                placeholder={lang === 'en' ? 'Type secured chat...' : 'መልእክት እዚህ ይጻፉ...'}
                value={inputText}
                onChange={handleTypingStatus}
                className="flex-1 px-3 py-2 bg-stone-100 dark:bg-zinc-900 border border-transparent rounded-xl text-xs focus:outline-none focus:border-amber-500/40"
              />

              <button
                type="submit"
                className="p-2 bg-[#1E3A1A] text-[#D4AF37] hover:bg-[#152a13] rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="p-4 bg-amber-500/10 text-[#D4AF37] rounded-3xl animate-bounce">
              <MessageCircle size={28} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-stone-700 dark:text-zinc-200">
                Secured Abyssinian Escrow Chats
              </h4>
              <p className="text-[10px] text-stone-400 max-w-xs mx-auto leading-normal">
                Select a merchant conversation from the sidebar ledger to begin high-fidelity contract & delivery negotiations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- FORWARD DIALOG POPUP --- */}
      {isForwardOpen && messageToForward && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-80 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-3xl p-5 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-wider">Forward Message</h4>
              <button onClick={() => { setIsForwardOpen(false); setMessageToForward(null); }} className="p-1 hover:bg-stone-100 dark:hover:bg-zinc-900 rounded-lg">
                <X size={12} />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 italic bg-black/5 dark:bg-black/25 p-2 rounded-lg">
              "{messageToForward.content || 'Attachment Card'}"
            </p>
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-bold text-stone-500 block">Select Target Conversation</span>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {conversations.map(conv => (
                  <button 
                    key={conv.id}
                    onClick={() => handleForwardMessage(conv.id)}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#1E3A1A]/15 border border-transparent hover:border-amber-500/20 flex items-center gap-2.5"
                  >
                    <img src={conv.recipientAvatar} className="w-6 h-6 rounded-full" />
                    <span className="font-extrabold">{conv.recipientName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SECURE CALL OVERLAY SIMULATION (Future Ready - Version 2) --- */}
      {activeCall && (
        <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="space-y-4 max-w-sm">
            <div className="relative">
              {/* Spinning calling orbit ring */}
              <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin absolute inset-0 m-auto" />
              <img 
                src={activeConv?.recipientAvatar} 
                className="w-20 h-20 rounded-full object-cover border-4 border-zinc-900 relative z-10 m-auto" 
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm">{activeConv?.recipientName}</h3>
              <p className="text-[10px] font-mono text-amber-500 tracking-wider font-bold">
                {activeCall.status === 'DIALING' ? 'DIALING SECURED NETWORK...' : 'CONNECTED (ENCRYPTED PEER-TO-PEER)'}
              </p>
              <span className="inline-block bg-neutral-900 border border-neutral-800 text-[8px] font-black px-2 py-0.5 rounded-full text-stone-400 uppercase">
                {activeCall.type} Call Preparation Mode (V2)
              </span>
            </div>

            {/* Custom interactive controls inside calling overlay */}
            <div className="flex gap-4 justify-center py-4">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`p-3 rounded-full transition-all cursor-pointer ${isMuted ? 'bg-amber-500 text-stone-950' : 'bg-neutral-900 hover:bg-neutral-850'}`}
                title="Mute Mic"
              >
                <Volume2 size={16} />
              </button>
              {activeCall.type === 'VIDEO' && (
                <button 
                  onClick={() => setIsCamOff(!isCamOff)} 
                  className={`p-3 rounded-full transition-all cursor-pointer ${isCamOff ? 'bg-amber-500 text-stone-950' : 'bg-neutral-900 hover:bg-neutral-850'}`}
                  title="Toggle Camera"
                >
                  <VideoIcon size={16} />
                </button>
              )}
              <button 
                onClick={() => setActiveCall(null)} 
                className="p-3 bg-red-650 hover:bg-red-700 text-white rounded-full transition-all cursor-pointer shadow-lg shadow-red-650/20"
                title="End Call"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[9px] text-stone-400 leading-normal">
              Unified real-time peer communication channel using WebRTC & Fayda Auth certificates. Future elements [Voice/Video/Screen Sharing] are ready for deployment in production.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
