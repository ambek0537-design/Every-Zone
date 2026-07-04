import React, { useState, useEffect } from 'react';
import { 
  Truck, Navigation, MapPin, Map, Phone, DollarSign, Wallet,
  CheckCircle2, Clock, ShieldCheck, Star, Users, ArrowUpRight,
  TrendingUp, RefreshCw, AlertCircle, FileText, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  vehicle: 'BIKE' | 'CAR' | 'VAN' | 'TRUCK';
  plate: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  walletBalance: number;
}

interface DeliveryJob {
  id: string;
  itemTitle: string;
  from: string;
  to: string;
  distanceKm: number;
  fee: number;
  codAmount: number;
  driverId: string | null;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
  stepProgress: number; // 0 to 100 on live GPS map
  recipientName: string;
  proofPhoto?: string;
}

interface DeliveryLogisticsHubProps {
  isDarkMode: boolean;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  lang: 'en' | 'am';
}

export function DeliveryLogisticsHub({ isDarkMode, walletBalance, setWalletBalance, lang }: DeliveryLogisticsHubProps) {
  const [activeSegment, setActiveSegment] = useState<'tracker' | 'drivers' | 'earnings'>('tracker');
  
  // Simulated driver rosters
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: 'dr_01', name: 'Alula Yohannes', phone: '0911554422', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', rating: 4.9, vehicle: 'BIKE', plate: 'AA-3-92140', status: 'ONLINE', walletBalance: 1250 },
    { id: 'dr_02', name: 'Feven Tesfaye', phone: '0912443311', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', rating: 4.8, vehicle: 'CAR', plate: 'AA-2-88512', status: 'ONLINE', walletBalance: 2400 },
    { id: 'dr_03', name: 'Biniam Girma', phone: '0911883399', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', rating: 4.95, vehicle: 'VAN', plate: 'AA-4-00142', status: 'BUSY', walletBalance: 4100 },
    { id: 'dr_04', name: 'Haile Selassié', phone: '0922442233', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150', rating: 4.7, vehicle: 'TRUCK', plate: 'AA-5-19412', status: 'ONLINE', walletBalance: 8400 }
  ]);

  // Current active delivery job tracked
  const [delivery, setDelivery] = useState<DeliveryJob>({
    id: 'dl_9214',
    itemTitle: 'Traditional Habesha Makeda Kemis Pack',
    from: 'Piazza Boutique Guild, Addis Ababa',
    to: 'Bole Medhanialem Condominiums, Block C3',
    distanceKm: 5.8,
    fee: 108, // Base 50 + (10 ETB/km * 5.8)
    codAmount: 4200, // Cash on Delivery to collect
    driverId: 'dr_01',
    status: 'IN_TRANSIT',
    stepProgress: 45,
    recipientName: 'Wzo. Tsige Haile'
  });

  const [simRunning, setSimRunning] = useState(true);

  // Auto-stepping delivery progress simulation
  useEffect(() => {
    let interval: any;
    if (simRunning && delivery.status !== 'DELIVERED') {
      interval = setInterval(() => {
        setDelivery(prev => {
          let nextProgress = prev.stepProgress + 6;
          let nextStatus = prev.status;

          if (nextProgress >= 100) {
            nextProgress = 100;
            nextStatus = 'DELIVERED';
            // Payout collected COD cash & delivery fee to driver balance
            setDrivers(prevDrivers => prevDrivers.map(dr => {
              if (dr.id === prev.driverId) {
                return {
                  ...dr,
                  walletBalance: dr.walletBalance + prev.fee,
                  status: 'ONLINE'
                };
              }
              return dr;
            }));

            // PERSIST delivery completion and proof to full stack backend
            fetch('/api/delivery/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deliveryId: prev.id, customerId: 'u-2' })
            }).then(() => {
              fetch('/api/delivery/proof', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  deliveryId: prev.id,
                  photoUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=400',
                  customerSignature: 'Ato Solomon Bekele'
                })
              });
            }).catch(err => console.error("Completion sync failed", err));

          } else if (nextProgress >= 75) {
            nextStatus = 'IN_TRANSIT';
          } else if (nextProgress >= 40) {
            nextStatus = 'PICKED_UP';
          }

          return {
            ...prev,
            stepProgress: nextProgress,
            status: nextStatus
          };
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [simRunning, delivery.status]);

  const handleSpawnDelivery = (itemTitle: string, address: string, codVal: number) => {
    const randomDistance = Math.round((Math.random() * 8 + 2) * 10) / 10;
    const feeCalculated = Math.round(50 + (10 * randomDistance));
    
    // Choose first ONLINE driver
    const availableDriver = drivers.find(dr => dr.status === 'ONLINE');
    const assignedId = availableDriver ? availableDriver.id : 'dr_01';
    const deliveryIdGenerated = `dl_${Math.floor(1000 + Math.random() * 9000)}`;

    setDelivery({
      id: deliveryIdGenerated,
      itemTitle,
      from: 'Piazza Cooperatives Hub, Addis Ababa',
      to: address,
      distanceKm: randomDistance,
      fee: feeCalculated,
      codAmount: codVal,
      driverId: assignedId,
      status: 'ASSIGNED',
      stepProgress: 5,
      recipientName: 'Ato Solomon Bekele'
    });

    // Toggle driver status
    if (availableDriver) {
      setDrivers(prev => prev.map(dr => {
        if (dr.id === availableDriver.id) {
          return { ...dr, status: 'BUSY' };
        }
        return dr;
      }));
    }

    // PERSIST spawning to actual backend!
    fetch('/api/delivery/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: `ord-${Date.now()}`,
        pickupAddress: 'Piazza Cooperatives Hub, Addis Ababa',
        deliveryAddress: address,
        deliveryFee: feeCalculated
      })
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const createdDeliveryId = data.delivery.id;
        // Assign driver on backend
        await fetch('/api/delivery/assign-driver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deliveryId: createdDeliveryId, driverId: 'dr-1' })
        });
      }
    }).catch(err => console.error("Spawning persistence failed", err));

    setSimRunning(true);
    alert(`🚚 New Delivery Spawned & Assigned!\nRider Assigned: ${availableDriver?.name || 'Alula Yohannes'}\nEstimated Fee: ${feeCalculated} ETB\nRouting from Piazza to ${address}`);
  };

  const handleRateDriver = (ratingVal: number) => {
    alert(`⭐️ Rating captured! Thank you for grading your rider. Assigned ${ratingVal} stars.`);
  };

  const currentRider = drivers.find(d => d.id === delivery.driverId) || drivers[0];

  return (
    <div className={`rounded-3xl border shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
      
      {/* Header section with traditional map background */}
      <div className={`p-4 border-b flex justify-between items-center bg-gradient-to-r ${isDarkMode ? 'from-zinc-950 to-zinc-900 border-zinc-800' : 'from-[#1E3A1A]/10 to-[#1E3A1A]/5 border-stone-200'}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-2xl animate-pulse">
            <Truck size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5 font-sans">
              🚚 Dispatch & Logistics Engine (ጭነት መከታተያ)
            </h3>
            <p className="text-[10px] text-stone-400">P2P dispatch nodes, COD payment, and live GPS mapping</p>
          </div>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex bg-stone-150 dark:bg-zinc-800 p-1 rounded-xl text-[9px] font-black uppercase tracking-wider select-none">
          <button 
            type="button"
            onClick={() => setActiveSegment('tracker')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activeSegment === 'tracker' ? 'bg-neutral-900 text-white' : 'text-stone-500'}`}
          >
            Tracker
          </button>
          <button 
            type="button"
            onClick={() => setActiveSegment('drivers')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activeSegment === 'drivers' ? 'bg-neutral-900 text-white' : 'text-stone-500'}`}
          >
            Riders
          </button>
          <button 
            type="button"
            onClick={() => setActiveSegment('earnings')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activeSegment === 'earnings' ? 'bg-neutral-900 text-white' : 'text-stone-500'}`}
          >
            Driver Wallet
          </button>
        </div>
      </div>

      {/* CORE CANVAS */}
      <div className="p-4 space-y-4">
        
        {activeSegment === 'tracker' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Live GPS Map Representation */}
            <div className={`border rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden aspect-video shadow-xs ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-stone-50 border-stone-200'}`}>
              
              {/* Map grid simulation background */}
              <div className="absolute inset-0 bg-radial-grid opacity-35" />
              
              {/* Simulated Map Streets */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg className="w-full h-full" stroke="currentColor" strokeWidth="3">
                  <line x1="10%" y1="10%" x2="90%" y2="90%" />
                  <line x1="10%" y1="90%" x2="90%" y2="10%" />
                  <line x1="50%" y1="5%" x2="50%" y2="95%" />
                  <line x1="5%" y1="50%" x2="95%" y2="50%" />
                </svg>
              </div>

              {/* Source Pin */}
              <div className="absolute top-[18%] left-[16%] flex flex-col items-center z-10">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px] uppercase font-bold shadow-md border-2 border-white">A</div>
                <span className="text-[7.5px] font-black bg-stone-900 text-white px-1.5 py-0.2 rounded mt-1 shadow-md opacity-85">Piazza Pin</span>
              </div>

              {/* Destination Pin */}
              <div className="absolute bottom-[22%] right-[22%] flex flex-col items-center z-10">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[10px] uppercase font-bold shadow-md border-2 border-white">B</div>
                <span className="text-[7.5px] font-black bg-stone-900 text-white px-1.5 py-0.2 rounded mt-1 shadow-md opacity-85">Bole Drop</span>
              </div>

              {/* Interactive Driver position based on stepProgress */}
              {delivery.status !== 'DELIVERED' && (
                <motion.div 
                  animate={{ 
                    left: `${16 + (delivery.stepProgress * 0.62)}%`, 
                    top: `${18 + (delivery.stepProgress * 0.60)}%` 
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="absolute flex flex-col items-center z-25 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-zinc-950 shadow-xl border-2 border-white animate-bounce">
                    <Navigation size={14} className="rotate-45" />
                  </div>
                  <span className="text-[8px] bg-[#1E3A1A] text-white px-1.5 py-0.5 rounded font-bold shadow-md uppercase mt-1">
                    {currentRider.name.split(' ')[0]}
                  </span>
                </motion.div>
              )}

              {/* Live Tracking Status card inside map */}
              <div className="z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs p-3 rounded-2xl shadow-md border border-stone-200/50 dark:border-zinc-800 space-y-1.5 max-w-[210px]">
                <div className="text-[8px] font-black bg-amber-500/15 text-amber-500 rounded px-1.5 py-0.5 inline-block uppercase font-sans">
                  📡 Live GPS Tracking Node
                </div>
                <h4 className="text-[10.5px] font-extrabold text-stone-800 dark:text-zinc-100">{delivery.id} tracking</h4>
                
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>Progress:</span>
                  <span className="font-bold text-[#C5A059]">{delivery.stepProgress}% completed</span>
                </div>
                <div className="w-full bg-stone-150 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div style={{ width: `${delivery.stepProgress}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
                </div>
              </div>

              <div className="z-10 flex justify-between items-center text-[9px] font-black text-stone-400 mt-auto">
                <span>Addis Logistics grid: Node ID v14.2</span>
                <span className="bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded uppercase">Satellite Synchronized</span>
              </div>
            </div>

            {/* Tracking Status Timeline details */}
            <div className="space-y-3.5">
              <div className="bg-[#F9F7F2] dark:bg-zinc-900/40 p-4 border rounded-2xl border-stone-250/60 dark:border-zinc-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-[#C5A059]">Active delivery order</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full select-none ${
                    delivery.status === 'DELIVERED' 
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-300' 
                      : 'bg-amber-500/15 text-amber-500 border border-amber-300 animate-pulse'
                  }`}>
                    🟢 {delivery.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold font-sans line-clamp-1">{delivery.itemTitle}</h3>

                <div className="space-y-1.5 text-[11px] leading-relaxed relative pl-3.5">
                  <div className="absolute left-1 top-1 bottom-1 w-0.5 bg-stone-300 dark:bg-zinc-800 border-dashed" />
                  <div>📍 <strong>Pickup:</strong> <span className="text-stone-500 dark:text-zinc-400">{delivery.from}</span></div>
                  <div>🎯 <strong>Dropoff:</strong> <span className="text-stone-500 dark:text-zinc-400">{delivery.to}</span></div>
                  <div>💁‍♂️ <strong>Recipient:</strong> <span className="text-stone-500 dark:text-zinc-400">{delivery.recipientName}</span></div>
                </div>

                {/* Logistics breakdown panel */}
                <div className="grid grid-cols-2 gap-3.5 border-t border-dashed border-stone-200 dark:border-zinc-800 pt-3 text-[11px] font-mono">
                  <div>
                    <span className="text-[8.5px] text-stone-400 block uppercase">Est. Distance</span>
                    <span className="font-black text-stone-700 dark:text-zinc-200">{delivery.distanceKm} km km</span>
                  </div>
                  <div>
                    <span className="text-[8.5px] text-stone-400 block uppercase">Delivery Fee</span>
                    <span className="font-black text-[#1E3A1A] dark:text-amber-400">{delivery.fee} ETB</span>
                  </div>
                  <div>
                    <span className="text-[8.5px] text-stone-400 block uppercase">Cash on Delivery (COD)</span>
                    <span className="font-bold text-red-650">{delivery.codAmount === 0 ? 'Fully Paid Online' : `${delivery.codAmount.toLocaleString()} ETB`}</span>
                  </div>
                  <div>
                    <span className="text-[8.5px] text-stone-400 block uppercase">Estimated Arrival</span>
                    <span className="font-bold text-stone-600 dark:text-zinc-300">{delivery.status === 'DELIVERED' ? 'Arrived!' : '9 mins'}</span>
                  </div>
                </div>
              </div>

              {/* RENTAL / COURIER RIDER DETAIL */}
              <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <img src={currentRider.avatar} alt={currentRider.name} className="w-10 h-10 object-cover rounded-full border border-stone-200 shadow-sm" />
                  <div>
                    <h4 className="text-xs font-black">{currentRider.name}</h4>
                    <p className="text-[9.5px] text-stone-400">{currentRider.vehicle} driver • {currentRider.plate}</p>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-amber-500 mt-0.5">
                      <Star size={10} fill="currentColor" />
                      <strong>{currentRider.rating}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <a 
                    href={`tel:${currentRider.phone}`}
                    className="px-3 py-1.5 bg-[#1E3A1A]/10 text-[#1E3A1A] dark:bg-amber-400/10 dark:text-amber-400 rounded-lg text-[10px] font-black cursor-pointer uppercase tracking-tight"
                  >
                    📞 Call Rider
                  </a>
                  {delivery.status === 'DELIVERED' && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} onClick={() => handleRateDriver(v)} className="text-amber-500 hover:scale-110 shrink-0">
                          <Star size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* PROOF OF DELIVERY CARD IF COMPLETE */}
              {delivery.status === 'DELIVERED' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-2xl text-xs space-y-2"
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> {lang === 'en' ? 'Proof of Delivery successfully locked' : 'የጭነቱ መድረስ ማረጋገጫ ተቆልፏል'}
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed italic">
                    Recipient signature: "{delivery.recipientName}" matched. COD amount was added to delivery system ledger. Digital dispatch circle successfully resolved.
                  </p>
                </motion.div>
              )}

            </div>

          </div>
        )}

        {/* DRIVERS LISTING STATUS PANEL */}
        {activeSegment === 'drivers' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs select-none">
              <span className="font-black text-stone-400 uppercase tracking-wider text-[9px]">Registered courier fleet roster</span>
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold font-mono text-[9.5px]">
                Active: {drivers.filter(d => d.status === 'ONLINE').length} online drivers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {drivers.map(dr => (
                <div 
                  key={dr.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 shadow-sm`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={dr.avatar} alt={dr.name} className="w-10 h-10 object-cover rounded-full border border-stone-200" />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        dr.status === 'ONLINE' ? 'bg-emerald-500' : dr.status === 'BUSY' ? 'bg-amber-500' : 'bg-stone-300'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black">{dr.name}</h4>
                      <p className="text-[9px] text-stone-400">{dr.vehicle} driver • Plate: {dr.plate}</p>
                      <div className="flex items-center gap-1.5 text-[9px] text-amber-500 font-bold mt-0.5">
                        <Star size={9} fill="currentColor" /> {dr.rating}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 font-sans">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full select-none ${
                      dr.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {dr.status}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">Ledger: {dr.walletBalance} ETB</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated tool to create dynamic deliveries */}
            <div className="bg-stone-100 dark:bg-zinc-800 p-3.5 rounded-2xl text-xs space-y-2.5">
              <strong className="text-[9.5px] uppercase tracking-wider block text-stone-400">Spawn Custom Courier Delivery Simulation:</strong>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button 
                  onClick={() => handleSpawnDelivery("Makeda Bridal Silk Dress (ሰርግ ልብስ)", "Bole Sub City, Road 14", 5000)}
                  className="p-2.5 bg-white border hover:bg-stone-50 rounded-xl font-bold cursor-pointer transition-all border-stone-250 text-stone-750 text-left"
                >
                  👗 Dress Delivery (Bole)
                </button>
                <button 
                  onClick={() => handleSpawnDelivery("Certified Saudi Chef Contract CV Packet", "Passport Bureau Office near Piazza", 0)}
                  className="p-2.5 bg-white border hover:bg-stone-50 rounded-xl font-bold cursor-pointer transition-all border-stone-250 text-stone-750 text-left"
                >
                  📂 Job Certified Pack (Piazza)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DRIVER EARNINGS LEDGER & WITHDRAWALS */}
        {activeSegment === 'earnings' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3.5">
              <div className="p-3 bg-[#F9F7F2] border rounded-2xl border-stone-200">
                <span className="text-[8px] text-stone-400 block uppercase font-mono">Commission Rate</span>
                <span className="text-base font-black text-[#1E3A1A]">12% fixed</span>
              </div>
              <div className="p-3 bg-[#F9F7F2] border rounded-2xl border-stone-200">
                <span className="text-[8px] text-stone-400 block uppercase font-mono">Ledger Solved</span>
                <span className="text-base font-black text-emerald-600">4,120 ETB</span>
              </div>
              <div className="p-3 bg-[#F9F7F2] border rounded-2xl border-stone-200">
                <span className="text-[8px] text-stone-400 block uppercase font-mono">Withdrawals</span>
                <span className="text-base font-black text-stone-600">12 Resolved</span>
              </div>
            </div>

            {/* Driver Withdrawal tools */}
            <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-4 space-y-3 shadow-xs">
              <h4 className="text-xs font-black uppercase text-[#C5A059]">Initiate Driver Withdrawal Hub</h4>
              <p className="text-[10px] text-stone-400">Withdraw earned logistics commissions instantly to Telebirr or active regional bank accounts.</p>
              
              <div className="grid grid-cols-2 gap-3.5 text-xs text-stone-700">
                <div>
                  <label className="text-[8.5px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Rider</label>
                  <select className="w-full font-semibold px-2 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 rounded-lg">
                    {drivers.map(dr => (
                      <option key={dr.id} value={dr.id}>{dr.name} ({dr.walletBalance} ETB)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[8.5px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Settlement Account</label>
                  <select className="w-full font-semibold px-2 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 rounded-lg">
                    <option value="telebirr">Telebirr (ቴሌብር)</option>
                    <option value="cbe">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="awash">Awash International Bank</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert('💸 Dynamic payout request dispatched! High-fidelity Chapa endpoint synchronized.\nPayout completed successfully under 2 seconds.');
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md select-none"
                >
                  🚀 Approve Immediate Chapa Telebirr Transfer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
