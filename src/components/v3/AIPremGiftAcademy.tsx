import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, TrendingUp, Award, Gift, DollarSign, Send, CheckCircle, Clock, Check,
  BookOpen, Star, HelpCircle, Shield, CreditCard, ChevronRight, Zap, Target, Lock, Heart
} from 'lucide-react';

interface AIPremGiftAcademyProps {
  isDarkMode: boolean;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  lang: 'en' | 'am';
  isPremiumUser: boolean;
  setIsPremiumUser: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AIPremGiftAcademy({
  isDarkMode,
  walletBalance,
  setWalletBalance,
  triggerPushNotification,
  lang,
  isPremiumUser,
  setIsPremiumUser
}: AIPremGiftAcademyProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'premium' | 'gift' | 'academy'>('insights');

  // AI BUSINESS INSIGHTS STATE
  const [typedInsightQuery, setTypedInsightQuery] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: 'user' | 'ai', text: string }[]>([
    { sender: 'ai', text: 'ሰላም! I am your Every-zone Strategic AI Coach. I analyze sales, logistics, and demand velocity across Ethiopia, Kenya, and Uganda. Ask me anything about scaling your catalog!' }
  ]);
  const [selectedTopic, setSelectedTopic] = useState<'coffee' | 'textiles' | 'properties'>('coffee');

  // PREMIUM MEMBERSHIP STATE
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // GIFT SYSTEM STATE
  const [giftTheme, setGiftTheme] = useState<'newyear' | 'coffee' | 'housing' | 'jobs'>('newyear');
  const [giftRecipientPhone, setGiftRecipientPhone] = useState('');
  const [giftAmount, setGiftAmount] = useState<number>(1000);
  const [giftMessage, setGiftMessage] = useState('');
  
  const [p2pPhone, setP2pPhone] = useState('');
  const [p2pAmount, setP2pAmount] = useState<number>(500);
  const [p2pStatus, setP2pStatus] = useState('');

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [generatedPromoCodes, setGeneratedPromoCodes] = useState<string[]>(['EZ-GOLD-2026', 'SIDAMA-COFFEE-15']);

  // LEARNING ACADEMY STATE
  const [selectedCourseCat, setSelectedCourseCat] = useState<'vendors' | 'candidates' | 'customers'>('vendors');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const quizQuestions = [
    {
      id: 'q1',
      question: 'When is funds released to a vendor in Every-zone Escrow?',
      options: [
        'Immediately upon order placement by customer',
        'Only after customer inspects and signs off verification receipt',
        'Directly when the shipping label is created'
      ],
      correct: 'Only after customer inspects and signs off verification receipt'
    },
    {
      id: 'q2',
      question: 'What is the role of a verified Fayda Digital ID on Every-zone?',
      options: [
        'It is optional and does not provide reputation benefits',
        'It binds biometric identities to prevent double-merchant fraud and secure transactions',
        'It is only used for tax filings'
      ],
      correct: 'It binds biometric identities to prevent double-merchant fraud and secure transactions'
    }
  ];

  // AI Insights strategies selector
  const insightsPool = {
    coffee: {
      trending: 'Makeda Sidama Specialty Coffee beans (1kg retail packets) - Demand peak in Nairobi cafés (+34% MoM).',
      cold: 'Yirgacheffe unwashed bulk - Low CTR in Kampala, recommendation: lower prices by 4%.',
      bestTime: 'Post micro-content on AI Feed at 11:30 AM East Africa Time (EAT) for optimal engagement.',
      pricingAdvice: 'Price Sidama at 750 ETB/kg in Ethiopian markets, but list at 2,300 KES in Kenyan showrooms to capture transit premium margin.'
    },
    textiles: {
      trending: 'Traditional Golden Silk Habesha Fringe Dress - Premium niche demand surging in Rwanda.',
      cold: 'Basic cotton shawls - Low engagement, recommendation: include high-fidelity short video pitch.',
      bestTime: 'Post video walkthroughs on Friday evenings around 6:00 PM EAT.',
      pricingAdvice: 'Package standard dresses with premium embroidery as a bundle to boost Average Order Value (AOV) by 18%.'
    },
    properties: {
      trending: 'Bole Heights 2-Bedroom furnished lofts with automated escrow rent security.',
      cold: 'Unfurnished studio listings in outer Atlas - consider updating video gallery.',
      bestTime: 'Broadast live listing virtual tours on Saturday mornings around 10:00 AM.',
      pricingAdvice: 'Standardize security holding deposit to 1-month equivalent in escrow ledger to maximize occupancy conversion.'
    }
  };

  const handleAskAICoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInsightQuery.trim()) return;

    const userText = typedInsightQuery;
    setTypedInsightQuery('');
    setAiChatLogs(prev => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      let aiResponse = `💡 [AI Strategic Advice] Regarding your query on "${userText}": Based on live analytics of 14,000 active cross-border transactions in Ethiopia & Kenya, I recommend optimizing your wholesale listing escrow limits. Standardizing your transport clearing fees via Westlands Logistics also increases client trust scores by 24%.`;
      if (userText.toLowerCase().includes('coffee')) {
        aiResponse = `☕ [AI Coffee Expert] Special analysis activated: Makeda Specialty beans are selling exceptionally well in Nairobi Westlands. Try creating a cross-border bundle targeting KES-paying cafe networks to bypass currency delays.`;
      } else if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('discount')) {
        aiResponse = `📊 [AI Pricing Engine] Predictive price models suggest offering a 5% discount for transactions backed by the Fayda Biometric badge. This increases order conversion by 42% while retaining high-margin buyers.`;
      }
      setAiChatLogs(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      triggerPushNotification('AI Coach Updated', 'New strategic pricing advice calculated.', '💡', 'activity');
    }, 1200);
  };

  const handleP2PTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p2pPhone || p2pAmount <= 0) return;

    if (walletBalance < p2pAmount) {
      setP2pStatus('❌ Insufficient wallet balance for transfer.');
      return;
    }

    setWalletBalance(prev => prev - p2pAmount);
    setP2pStatus(`🟢 Success! Transferred ${p2pAmount.toLocaleString()} ETB to recipient ${p2pPhone}. Receipts locked in ledger.`);
    triggerPushNotification('Transfer Complete', `Sent ${p2pAmount} ETB securely to ${p2pPhone}`, '💸', 'card');
    
    // reset form
    setP2pPhone('');
    setP2pAmount(500);
  };

  const handleGeneratePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const code = promoCodeInput.trim().toUpperCase();
    if (generatedPromoCodes.includes(code)) {
      triggerPushNotification('Duplicate Code', 'Promo code already exists in catalog.', '⚠️', 'card');
      return;
    }

    setGeneratedPromoCodes([code, ...generatedPromoCodes]);
    triggerPushNotification('Promo Code Created', `Voucher code "${code}" registered successfully.`, '🏷️', 'card');
    setPromoCodeInput('');
  };

  const handleSubscribePremium = () => {
    const cost = billingCycle === 'monthly' ? 500 : 4500;
    if (walletBalance < cost) {
      triggerPushNotification('Upgrade Failed', 'Insufficient wallet balance for Customer Plus.', '❌', 'reputation');
      return;
    }

    setWalletBalance(prev => prev - cost);
    setIsPremiumUser(true);
    triggerPushNotification('Upgrade Successful! 🎉', 'Welcome to Every-zone Customer Plus VIP status!', '💎', 'reputation');
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === quizQuestions.length) {
      triggerPushNotification('Certified Master!', 'You earned the verified Escrow Security Badge!', '🏆', 'reputation');
    } else {
      triggerPushNotification('Quiz Completed', 'Review answers and try again to secure your certification.', '📖', 'reputation');
    }
  };

  return (
    <div className={`p-5 rounded-3xl border ${
      isDarkMode ? 'bg-[#0f0f0f] border-zinc-850' : 'bg-white border-stone-200'
    }`}>
      {/* HEADER TABS */}
      <div className="flex justify-between items-center border-b border-zinc-850/60 pb-3 mb-4">
        <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'insights' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles size={13} />
            <span>AI Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('premium')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'premium' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Star size={13} />
            <span>Customer Plus</span>
          </button>

          <button
            onClick={() => setActiveTab('gift')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gift' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Gift size={13} />
            <span>Gift System</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'academy' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen size={13} />
            <span>Learning Center</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Smart Sub-System v3
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* AI BUSINESS INSIGHTS */}
        {/* ========================================================= */}
        {activeTab === 'insights' && (
          <motion.div
            key="insights-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-5"
          >
            {/* Left Strategic Recommendations */}
            <div className="lg:col-span-3 space-y-4 text-left">
              <div>
                <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">Merchant Intelligence Coach</span>
                <h3 className="text-sm font-extrabold">Strategic Industry Analysis</h3>
              </div>

              {/* Topic Selectors */}
              <div className="flex gap-2.5">
                {[
                  { id: 'coffee', label: '☕ Sidama Coffee Wholesale' },
                  { id: 'textiles', label: '👗 Traditional Textiles' },
                  { id: 'properties', label: '🏠 Real Estate Agents' }
                ].map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id as any)}
                    className={`text-[9.5px] font-black px-3.5 py-2 rounded-xl border transition cursor-pointer ${
                      selectedTopic === topic.id
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
                        : isDarkMode ? 'bg-zinc-950 border-zinc-900 text-stone-400' : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>

              {/* Recommendations Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-black/30 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[8px] font-black uppercase text-emerald-400 font-mono flex items-center gap-1">
                    <TrendingUp size={10} /> Trending Catalyst
                  </span>
                  <p className="text-[10.5px] text-stone-200 leading-snug">{insightsPool[selectedTopic].trending}</p>
                </div>

                <div className="bg-black/30 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[8px] font-black uppercase text-red-400 font-mono">⚠️ Slow Inventory Alerts</span>
                  <p className="text-[10.5px] text-stone-200 leading-snug">{insightsPool[selectedTopic].cold}</p>
                </div>

                <div className="bg-black/30 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[8px] font-black uppercase text-amber-500 font-mono">⏰ Optimal Posting Windows</span>
                  <p className="text-[10.5px] text-stone-200 leading-snug">{insightsPool[selectedTopic].bestTime}</p>
                </div>

                <div className="bg-black/30 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[8px] font-black uppercase text-purple-400 font-mono">💡 Smart Pricing Tactics</span>
                  <p className="text-[10.5px] text-stone-200 leading-snug">{insightsPool[selectedTopic].pricingAdvice}</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Coach Chat */}
            <div className="lg:col-span-2">
              <div className="bg-black/40 border border-zinc-900 rounded-3xl p-4 flex flex-col h-[300px]">
                <div className="border-b border-zinc-850 pb-2 mb-2 text-left">
                  <span className="text-[8px] font-black uppercase text-amber-500 font-mono">Every-zone AI Advisor</span>
                  <h4 className="text-xs font-black text-stone-200">strategic business coach</h4>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[10px] text-left">
                  {aiChatLogs.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-2.5 rounded-xl max-w-[85%] ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-stone-950 font-semibold rounded-tr-none'
                          : 'bg-zinc-900 text-stone-200 rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAskAICoach} className="mt-2.5 flex gap-1.5 border-t border-zinc-850 pt-2.5">
                  <input
                    type="text"
                    value={typedInsightQuery}
                    onChange={(e) => setTypedInsightQuery(e.target.value)}
                    placeholder="Ask AI strategic query..."
                    className="flex-1 text-[10.5px] bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 outline-none focus:border-amber-500/40 text-stone-200"
                  />
                  <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-stone-950 p-2 rounded-lg cursor-pointer">
                    <Send size={12} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* PREMIUM MEMBERSHIP (Customer Plus) */}
        {/* ========================================================= */}
        {activeTab === 'premium' && (
          <motion.div
            key="premium-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <div className={`w-full max-w-3xl bg-zinc-950/60 p-6 rounded-3xl border border-zinc-900 text-left relative overflow-hidden`}>
              {/* Premium Background Ambience */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-tr from-amber-600/10 to-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-zinc-900 pb-5 mb-5">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono block">UPGRADE SUBSCRIPTION</span>
                  <h3 className="text-xl font-extrabold text-stone-200">Customer Plus VIP</h3>
                  <p className="text-xs text-stone-400 mt-1">Unlock raw privilege, lower fees, faster escrows and global priority support.</p>
                </div>

                {isPremiumUser ? (
                  <div className="bg-amber-500 text-stone-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-amber-500/15">
                    <Award size={14} />
                    <span>Customer Plus Active</span>
                  </div>
                ) : (
                  <div className="flex gap-1.5 bg-black/50 p-1 rounded-xl border border-zinc-850 shrink-0">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`text-[9.5px] font-black px-3 py-1.5 rounded-lg transition-all ${
                        billingCycle === 'monthly' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      500 ETB / Mo
                    </button>
                    <button
                      onClick={() => setBillingCycle('annual')}
                      className={`text-[9.5px] font-black px-3 py-1.5 rounded-lg transition-all ${
                        billingCycle === 'annual' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      4,500 ETB / Yr
                    </button>
                  </div>
                )}
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
                {[
                  { title: '🚫 Absolute Ad Free Experience', desc: 'No system ads or campaign popups displaying on search galleries or catalog listings.' },
                  { title: '⚡ Hyper Fast Dispute Resolution', desc: 'SLA disputes handled in less than 2 hours under premium human arbitrator review.' },
                  { title: '🏷️ Exclusive 15% Merchant Discounts', desc: 'Unlock access to exclusive coupon discounts across traditional clothing and coffee.' },
                  { title: '🏆 Golden Profile VIP Badge', desc: 'Add a high-trust prestige credential next to your Fayda name in search results.' },
                  { title: '💼 Early Access Jobs Visas', desc: 'See and apply for Dubai heavy delivery contracts 24 hours before standard candidates.' }
                ].map((b, i) => (
                  <div key={i} className="p-3 bg-black/45 border border-zinc-900 rounded-2xl flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Check size={11} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-200">{b.title}</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5 leading-normal">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!isPremiumUser && (
                <button
                  onClick={handleSubscribePremium}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs uppercase px-5 py-3 rounded-2xl cursor-pointer w-full flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/15"
                >
                  <Zap size={14} className="animate-bounce" />
                  <span>Upgrade to Customer Plus Now</span>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* GIFT SYSTEM */}
        {/* ========================================================= */}
        {activeTab === 'gift' && (
          <motion.div
            key="gift-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
              
              {/* P2P Wallet Transfer Panel */}
              <div className="bg-black/20 border border-zinc-900 p-4 rounded-3xl space-y-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-500 font-mono">P2P Peer-to-Peer</span>
                  <h4 className="text-xs font-black">Direct Wallet Transfer</h4>
                </div>

                <form onSubmit={handleP2PTransfer} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[8.5px] text-stone-500 uppercase font-mono block mb-1">Recipient Phone / Fayda ID</label>
                    <input
                      type="text"
                      value={p2pPhone}
                      onChange={(e) => setP2pPhone(e.target.value)}
                      placeholder="+251 911 000 000"
                      className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 w-full text-stone-200 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[8.5px] text-stone-500 uppercase font-mono block mb-1">Transfer Amount (ETB)</label>
                    <input
                      type="number"
                      value={p2pAmount}
                      onChange={(e) => setP2pAmount(parseInt(e.target.value) || 0)}
                      className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 w-full text-stone-200 outline-none font-mono text-amber-500 font-black"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] uppercase px-4 py-2 rounded-xl w-full cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>Send Funds Instantly</span>
                  </button>

                  {p2pStatus && (
                    <p className="text-[9.5px] font-mono leading-relaxed mt-2 text-stone-300 bg-zinc-950 border border-zinc-900 p-2 rounded-lg">{p2pStatus}</p>
                  )}
                </form>
              </div>

              {/* Digital Gift Cards Maker */}
              <div className="bg-black/20 border border-zinc-900 p-4 rounded-3xl space-y-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-500 font-mono">Custom Gift Vouchers</span>
                  <h4 className="text-xs font-black">Digital Gift Card Portal</h4>
                </div>

                <div className="flex gap-1.5">
                  {[
                    { id: 'newyear', label: '🌸 New Year' },
                    { id: 'coffee', label: '☕ Coffee' },
                    { id: 'housing', label: '🏠 House' }
                  ].map(thm => (
                    <button
                      key={thm.id}
                      onClick={() => setGiftTheme(thm.id as any)}
                      className={`text-[8.5px] font-bold px-2 py-1 rounded border cursor-pointer ${
                        giftTheme === thm.id
                          ? 'bg-amber-500 text-stone-950 font-black'
                          : 'bg-zinc-900 text-stone-400'
                      }`}
                    >
                      {thm.label}
                    </button>
                  ))}
                </div>

                {/* Animated Digital Card Preview */}
                <div className={`h-28 rounded-2xl p-3 flex flex-col justify-between text-left relative overflow-hidden border ${
                  giftTheme === 'newyear' ? 'bg-gradient-to-tr from-[#9B111E] to-[#C5A059] border-[#C5A059]/30' :
                  giftTheme === 'coffee' ? 'bg-gradient-to-tr from-[#3b2314] to-[#c7a47c] border-[#c7a47c]/30' :
                  'bg-gradient-to-tr from-[#142d3b] to-[#7ca2c7] border-[#7ca2c7]/30'
                }`}>
                  <span className="text-[7.5px] font-mono font-bold tracking-widest text-white/60">EVERY-ZONE DIGITAL GIFT CARD</span>
                  <div className="space-y-1">
                    <span className="text-[9px] text-white/90 font-black block truncate">"{giftMessage || 'Sending you love!'}"</span>
                    <h5 className="text-base font-black font-mono text-white">{giftAmount.toLocaleString()} ETB</h5>
                  </div>
                  <div className="flex justify-between items-center text-[7.5px] text-white/50 font-mono">
                    <span>TO: {giftRecipientPhone || '+251 XXX'}</span>
                    <span>SECURE BLOCKCHAIN LEDGER</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Recipient Phone"
                    value={giftRecipientPhone}
                    onChange={(e) => setGiftRecipientPhone(e.target.value)}
                    className="bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-1.5 w-full text-stone-200 outline-none text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Personalized Message"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-1.5 w-full text-stone-200 outline-none text-[11px]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={giftAmount}
                      onChange={(e) => setGiftAmount(parseInt(e.target.value) || 0)}
                      className="bg-zinc-950 border border-zinc-850 rounded-xl px-2.5 py-1.5 w-1/2 text-stone-200 outline-none font-mono text-amber-500"
                    />
                    <button
                      onClick={() => {
                        if (walletBalance < giftAmount) {
                          triggerPushNotification('Gift Failed', 'Insufficient wallet balance to buy gift card.', '⚠️', 'card');
                          return;
                        }
                        setWalletBalance(b => b - giftAmount);
                        triggerPushNotification('Gift Sent Successfully 🎁', `Sent digital gift card to ${giftRecipientPhone}`, '🎁', 'card');
                        setGiftRecipientPhone('');
                        setGiftMessage('');
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[9.5px] uppercase px-3 py-1.5 rounded-xl flex-1 cursor-pointer transition"
                    >
                      Buy & Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo code generator voucher catalog */}
              <div className="bg-black/20 border border-zinc-900 p-4 rounded-3xl space-y-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-500 font-mono">Discount Vouchers</span>
                  <h4 className="text-xs font-black">Generate Merchant Coupons</h4>
                </div>

                <form onSubmit={handleGeneratePromoCode} className="space-y-2 text-xs">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. DISCOUNT-15"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-1.5 flex-1 text-stone-200 outline-none text-[11px]"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] px-3.5 py-1.5 rounded-xl cursor-pointer"
                    >
                      Create
                    </button>
                  </div>
                </form>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {generatedPromoCodes.map(code => (
                    <div key={code} className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                      <span className="font-mono font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{code}</span>
                      <span className="text-[9px] text-stone-500">Active Coupon</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* LEARNING ACADEMY */}
        {/* ========================================================= */}
        {activeTab === 'academy' && (
          <motion.div
            key="academy-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-5 text-left text-xs"
          >
            {/* Category selection list */}
            <div className="lg:col-span-2 space-y-3.5">
              <div>
                <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase font-mono">Certified Hub</span>
                <h3 className="text-sm font-extrabold">Ecosystem Tutorials</h3>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'vendors', title: '🏪 For Store Vendors', desc: 'Succeed in escrow micro-commerce' },
                  { id: 'candidates', title: '💼 For Job Candidates', desc: 'Visa recruitment and drivers' },
                  { id: 'customers', title: '🛒 For Escrow Customers', desc: 'Secure deposits and logistics' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCourseCat(cat.id as any);
                      setQuizSubmitted(false);
                      setQuizScore(null);
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      selectedCourseCat === cat.id
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : isDarkMode ? 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <span className="font-extrabold block text-stone-200">{cat.title}</span>
                    <span className="text-[9.5px] text-stone-400 block mt-0.5">{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Courses and interactive quiz section */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-black/30 border border-zinc-900 p-4 rounded-3xl space-y-3">
                <span className="text-[8px] font-black uppercase text-amber-500 font-mono">Featured Curricular Tutorial</span>
                {selectedCourseCat === 'vendors' && (
                  <>
                    <h4 className="text-xs font-black text-stone-200">Course #1: Exporting Specialty Sidama Coffee to Nairobi</h4>
                    <p className="text-[10px] text-stone-400 leading-relaxed">
                      Learn how to set up multi-country pricing profiles, clearing with Westlands customs agents, and securing bulk escrow payments safely.
                    </p>
                  </>
                )}
                {selectedCourseCat === 'candidates' && (
                  <>
                    <h4 className="text-xs font-black text-stone-200">Course #2: Understanding Dubai Visa Quotas and Biometrics</h4>
                    <p className="text-[10px] text-stone-400 leading-relaxed">
                      Ensure your Fayda biometric passport details are aligned with Dubai delivery company quotas to speed up entry approvals by 3 weeks.
                    </p>
                  </>
                )}
                {selectedCourseCat === 'customers' && (
                  <>
                    <h4 className="text-xs font-black text-stone-200">Course #3: Escrow Disputes and Verification Sign-offs</h4>
                    <p className="text-[10px] text-stone-400 leading-relaxed">
                      Protect your housing rental deposits. Learn when to approve release on Chapa wallets and how to activate immediate arbitration reviews.
                    </p>
                  </>
                )}
              </div>

              {/* Secure certification quiz */}
              <form onSubmit={handleQuizSubmit} className="bg-black/20 border border-zinc-900 p-4 rounded-3xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="text-[8px] font-black uppercase text-emerald-400 font-mono">Ecosystem Security Certification</span>
                  <span className="text-[9px] font-bold text-stone-500">Test Your Escrow Security IQ</span>
                </div>

                <div className="space-y-4 text-left">
                  {quizQuestions.map((q, qidx) => (
                    <div key={q.id} className="space-y-2">
                      <p className="font-bold text-stone-300 text-[10.5px]">{qidx+1}. {q.question}</p>
                      <div className="space-y-1.5 pl-2">
                        {q.options.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer text-[10px] text-stone-400 hover:text-stone-200">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={quizAnswers[q.id] === opt}
                              onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt })}
                              className="accent-amber-500"
                              disabled={quizSubmitted}
                              required
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] uppercase px-4 py-2.5 rounded-xl cursor-pointer transition w-full"
                  >
                    Submit Certification Answers
                  </button>
                ) : (
                  <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-900 flex justify-between items-center">
                    <div>
                      <span className="text-[8px] font-mono uppercase text-emerald-400 font-black">Score Results</span>
                      <h5 className="text-xs font-black">
                        {quizScore} / {quizQuestions.length} Correct
                      </h5>
                      <p className="text-[9px] text-stone-500 mt-0.5">
                        {quizScore === quizQuestions.length ? '🥇 Perfect score! Verified Escrow Master credential unlocked.' : 'Keep studying to secure master badge.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizScore(null);
                        setQuizAnswers({});
                      }}
                      className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-black px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
