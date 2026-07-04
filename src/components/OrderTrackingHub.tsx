import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, CheckSquare, Package, Truck, Compass, CheckCircle2, 
  MapPin, Clock, RefreshCw, RefreshCw as SimulateIcon, Navigation, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderTrackingHubProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  itemName: string;
  vendorName: string;
  price: number;
  quantity: number;
  image: string;
  trackingStage: 'ORDERED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  eta: string;
  courierName: string;
  courierPhone: string;
  lastUpdate: string;
}

export function OrderTrackingHub({
  isDarkMode,
  lang,
  triggerPushNotification,
  onClose
}: OrderTrackingHubProps) {
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('ez_customer_tracked_orders');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'EZ-92841',
        itemName: 'Luxury Habesha Royal Kemis Dress',
        vendorName: 'Bole Premium Habesha Wear',
        price: 4200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200',
        trackingStage: 'SHIPPED',
        eta: 'Today at 4:30 PM',
        courierName: 'Kalkidan Girmay (Sheger Dispatch #912)',
        courierPhone: '+251911928412',
        lastUpdate: 'Parcel cleared Sheger Bole sorting hub.'
      },
      {
        id: 'EZ-10294',
        itemName: 'Organic Makeda Premium Coffee Beans (1kg)',
        vendorName: 'Makeda Organic Coffee Shop',
        price: 550,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=200',
        trackingStage: 'CONFIRMED',
        eta: 'Tomorrow, July 4',
        courierName: 'Aschalew Abebe (Sheger Dispatch #103)',
        courierPhone: '+251912093842',
        lastUpdate: 'Payment verified via telebirr escrow reserve.'
      }
    ];
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string>('EZ-92841');
  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  useEffect(() => {
    localStorage.setItem('ez_customer_tracked_orders', JSON.stringify(orders));
  }, [orders]);

  const stages = [
    { key: 'ORDERED', label: lang === 'en' ? 'Ordered' : 'ታዟል', icon: <ShoppingBag size={14} /> },
    { key: 'CONFIRMED', label: lang === 'en' ? 'Confirmed' : 'ተረጋግጧል', icon: <CheckSquare size={14} /> },
    { key: 'PACKED', label: lang === 'en' ? 'Packed' : 'ተዘጋጅቷል', icon: <Package size={14} /> },
    { key: 'SHIPPED', label: lang === 'en' ? 'Shipped' : 'ተልኳል', icon: <Truck size={14} /> },
    { key: 'OUT_FOR_DELIVERY', label: lang === 'en' ? 'Out for Delivery' : 'ለመድረስ በመንገድ ላይ', icon: <Compass size={14} /> },
    { key: 'DELIVERED', label: lang === 'en' ? 'Delivered' : 'ደርሷል', icon: <CheckCircle2 size={14} /> }
  ] as const;

  const getStageIndex = (stage: OrderItem['trackingStage']) => {
    return stages.findIndex(s => s.key === stage);
  };

  const activeStageIndex = getStageIndex(activeOrder.trackingStage);

  const handleAdvanceStage = () => {
    const currentIndex = activeStageIndex;
    if (currentIndex >= stages.length - 1) {
      alert(lang === 'en' ? 'Order is already fully Delivered!' : 'ትዕዛዙ አስቀድሞ በሰላም ደርሷል!');
      return;
    }

    const nextStage = stages[currentIndex + 1].key as OrderItem['trackingStage'];
    let updateMessage = '';
    
    switch (nextStage) {
      case 'CONFIRMED':
        updateMessage = 'Vendor accepted. Escrow collateral locked safely in Fayda smart registry.';
        break;
      case 'PACKED':
        updateMessage = 'Handcrafted parcel is fully packed and sealed with security labels.';
        break;
      case 'SHIPPED':
        updateMessage = 'Handed over to Sheger Dispatch courier service for city-wide transfer.';
        break;
      case 'OUT_FOR_DELIVERY':
        updateMessage = `Courier ${activeOrder.courierName} is on the way. ETA updated to 15 minutes!`;
        break;
      case 'DELIVERED':
        updateMessage = 'Package signed & verified via customer OTP. Thank you for using Every-zone!';
        break;
    }

    setOrders(prev => prev.map(o => o.id === activeOrder.id ? { 
      ...o, 
      trackingStage: nextStage, 
      lastUpdate: updateMessage 
    } : o));

    triggerPushNotification(
      `📦 Order Update: ${activeOrder.id}`,
      `Your order is now: ${stages[currentIndex + 1].label}. ${updateMessage}`,
      '📦',
      'orders'
    );
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-stone-900'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-200/85 pb-4 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-black tracking-wider uppercase text-amber-500 flex items-center gap-2">
            <Truck size={20} className="text-amber-500 animate-pulse" />
            {lang === 'en' ? 'Every-zone Live Order Tracker' : 'የኤቭሪ-ዞን ቀጥታ ትዕዛዝ መከታተያ'}
          </h2>
          <p className="text-[10px] opacity-65 tracking-wide">
            {lang === 'en' ? 'Real-time multi-stage visual tracking powered by Sheger Logistics Integration' : 'በእውነተኛ ሰዓት የሚደረግ የትዕዛዝ ማድረሻ ሂደት መከታተያ ማዕከል'}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850' : 'bg-white border-stone-200 hover:bg-stone-50'
          }`}
        >
          {lang === 'en' ? 'Close Tracker' : 'መከታተያውን ዝጋ'}
        </button>
      </div>

      {/* Selector of Active Tracked Orders */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {orders.map(order => (
          <button
            key={order.id}
            onClick={() => setSelectedOrderId(order.id)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              selectedOrderId === order.id
                ? 'border-amber-500 bg-amber-500/5 text-amber-500'
                : isDarkMode ? 'border-zinc-850 bg-zinc-900 text-stone-400 hover:text-white' : 'border-stone-200 bg-white text-stone-600 hover:text-stone-900'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{order.itemName} ({order.id})</span>
          </button>
        ))}
      </div>

      {/* Main Track Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Visual Progress Stepper & Map Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* visual Stepper widget */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'} text-left space-y-5`}>
            <div className="flex justify-between items-center pb-2.5 border-b border-stone-100 dark:border-zinc-850">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Fulfillment Pipeline Timeline</span>
              <span className="text-xs font-bold text-amber-500 font-mono">ETA: {activeOrder.eta}</span>
            </div>

            {/* Stepper Line and Circles */}
            <div className="relative pt-2 pb-6">
              
              {/* Desktop Stepper */}
              <div className="hidden sm:flex justify-between relative">
                {/* Horizontal progress bar background */}
                <div className="absolute top-4 left-4 right-4 h-1 bg-stone-200 dark:bg-zinc-800 -z-10" />
                {/* Active progress bar highlight */}
                <div 
                  className="absolute top-4 left-4 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 -z-10 transition-all duration-500" 
                  style={{ width: `${(activeStageIndex / (stages.length - 1)) * 92}%` }}
                />

                {stages.map((stage, idx) => {
                  const done = idx <= activeStageIndex;
                  const isCurrent = idx === activeStageIndex;
                  
                  return (
                    <div key={stage.key} className="flex flex-col items-center space-y-2 text-center w-20">
                      <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                        done 
                          ? 'bg-emerald-500 border-emerald-500 text-neutral-950 font-extrabold shadow-md' 
                          : isDarkMode ? 'bg-zinc-950 border-zinc-800 text-stone-500' : 'bg-stone-50 border-stone-250 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                        {stage.icon}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${
                        done ? 'text-emerald-400' : 'text-stone-500'
                      } ${isCurrent ? 'text-amber-500' : ''}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Vertical Stepper */}
              <div className="flex sm:hidden flex-col gap-6 relative pl-6">
                {/* Vertical line background */}
                <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-stone-200 dark:bg-zinc-800" />
                <div 
                  className="absolute top-2 left-2.5 w-0.5 bg-emerald-500 transition-all duration-500" 
                  style={{ height: `${(activeStageIndex / (stages.length - 1)) * 90}%` }}
                />

                {stages.map((stage, idx) => {
                  const done = idx <= activeStageIndex;
                  const isCurrent = idx === activeStageIndex;
                  
                  return (
                    <div key={stage.key} className="flex items-center gap-4 text-left">
                      <div className={`absolute left-0 w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all ${
                        done 
                          ? 'bg-emerald-500 border-emerald-500 text-neutral-950 font-extrabold shadow-sm' 
                          : isDarkMode ? 'bg-zinc-950 border-zinc-800 text-stone-500' : 'bg-stone-50 border-stone-250 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                        {stage.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        done ? 'text-emerald-400' : 'text-stone-500'
                      } ${isCurrent ? 'text-amber-500' : ''}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Current status comment block */}
            <div className={`p-4 rounded-xl border text-xs ${
              isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-extrabold uppercase text-[9px] tracking-wider text-stone-400">Latest Live Transit Note</span>
              </div>
              <p className="text-stone-200 leading-relaxed font-sans">{activeOrder.lastUpdate}</p>
            </div>
          </div>

          {/* Interactive Simulation Dashboard (Advanced Delivery Sandbox) */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'} text-left space-y-4`}>
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-850 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <SimulateIcon size={13} className="text-amber-500 animate-spin" />
                Fulfillment Courier Simulation Sandbox
              </h3>
              <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full font-bold uppercase">
                Demonstration Console
              </span>
            </div>

            <p className="text-[10px] text-stone-450 leading-normal font-sans">
              Test the real-time responsiveness of the platform. Click the button below to manually advance the courier tracking pipeline through its subsequent stages. This will fire live push alerts immediately!
            </p>

            <button
              onClick={handleAdvanceStage}
              className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[10.5px] uppercase py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <Navigation size={13} className="animate-pulse" />
              Simulate Transit Update (Advance Next Step)
            </button>
          </div>

        </div>

        {/* Right Column: Courier Identity & Escrow Information */}
        <div className="space-y-4">
          
          {/* Dispatch courier bio */}
          <div className={`p-5 rounded-2xl border text-left space-y-4 ${
            isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'
          }`}>
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-zinc-850 pb-2">
              Assigned courier agent
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 text-base">
                👤
              </div>
              <div>
                <span className="text-xs font-bold text-stone-200 block">{activeOrder.courierName}</span>
                <span className="text-[9px] text-stone-450 block font-mono">Fayda Verified Driver</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-stone-400">Mobile Support:</span>
                <span className="text-stone-200 font-bold">{activeOrder.courierPhone}</span>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-stone-400">Dispatch hub:</span>
                <span className="text-stone-200 font-bold">Bole Hub Zone A</span>
              </div>
            </div>
          </div>

          {/* Secure Escrow protection Card */}
          <div className={`p-5 rounded-2xl border text-left bg-gradient-to-br from-emerald-500/[0.03] to-transparent ${
            isDarkMode ? 'bg-zinc-900/60 border-emerald-500/25' : 'bg-white border-emerald-500/20'
          }`}>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 font-mono mb-1">
              🔒 Fayda Escrow Secured
            </h4>
            <p className="text-[10px] text-stone-450 leading-relaxed font-sans">
              Your payments are held securely in the Every-zone trust settlement registry. The merchant will receive clearance only after you OTP-verify and accept delivery of the items.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
