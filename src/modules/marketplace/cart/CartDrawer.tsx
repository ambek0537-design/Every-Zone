import React, { useState } from 'react';
import { 
  X, ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowRight, ShieldCheck, 
  CheckCircle2, Heart, Gift, Sparkles, MapPin, Zap, AlertCircle, Info
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  discountPrice: number | null;
  image: string | null;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  variantId: string | null;
  product: Product;
  variant?: {
    id: string;
    color: string | null;
    size: string | null;
    price: number | null;
  } | null;
}

interface CartDrawerProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, qty: number, variantId: string | null) => void;
  onRemoveItem: (productId: string, variantId: string | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  onClose,
  onUpdateQty,
  onRemoveItem
}) => {
  // Step: 'cart' (Step 1) | 'address' (Step 2) | 'payment' (Step 3)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState<any>(null);

  // Address validation states
  const [addressLine, setAddressLine] = useState('Kirkos Subcity, House #402, Addis Ababa');
  const [isDetectingAddress, setIsDetectingAddress] = useState(false);
  const [addressVerified, setAddressVerified] = useState(true);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCouponName, setAppliedCouponName] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Local state for Save For Later
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);

  // Math totals
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.variant?.price || item.product.discountPrice || item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  // Free shipping threshold: 5000 ETB
  const freeShippingThreshold = 5000;
  const deliveryFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const discountedSubtotal = Math.max(0, subtotal - appliedDiscount);
  const grandTotal = discountedSubtotal + deliveryFee;

  const handleApplyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME100') {
      setAppliedDiscount(100);
      setAppliedCouponName('WELCOME100');
      setCouponError(null);
    } else if (cleanCode === 'ESKROWTRUST') {
      const discountVal = Math.floor(subtotal * 0.1); // 10% Off
      setAppliedDiscount(discountVal);
      setAppliedCouponName('ESKROWTRUST (10%)');
      setCouponError(null);
    } else if (cleanCode === 'ABYSSINIA20') {
      const discountVal = Math.floor(subtotal * 0.2); // 20% Off
      setAppliedDiscount(discountVal);
      setAppliedCouponName('ABYSSINIA20 (20%)');
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleDetectAddress = () => {
    setIsDetectingAddress(true);
    setAddressVerified(false);
    setTimeout(() => {
      setIsDetectingAddress(false);
      setAddressLine('Bole District, Behind Friendship Mall, Block 12, Addis Ababa');
      setAddressVerified(true);
    }, 1200);
  };

  const handleCheckout = async (gateway: string) => {
    setIsProcessing(true);

    // Simulate real gateway latency
    setTimeout(() => {
      setIsProcessing(false);
      const txRef = `EZ-${gateway.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setTxSuccess({
        tx_ref: txRef,
        amount: grandTotal,
        gateway,
        settlementAccount: '65965275',
        settlementBank: 'Bank of Abyssinia'
      });
    }, 2000);
  };

  const handleSaveForLater = (item: CartItem) => {
    setSavedForLater(prev => [...prev, item]);
    onRemoveItem(item.productId, item.variantId);
  };

  const handleMoveToCart = (item: CartItem) => {
    // Add back to cart
    onUpdateQty(item.productId, item.quantity, item.variantId);
    setSavedForLater(prev => prev.filter(i => !(i.productId === item.productId && i.variantId === item.variantId)));
  };

  const handleMoveToWishlist = (item: CartItem) => {
    alert(`💖 "${item.product.title}" has been moved to your Saved Favorites Wishlist.`);
    onRemoveItem(item.productId, item.variantId);
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
      {/* Drawer box */}
      <div id="cart-drawer" className="w-full max-w-md bg-neutral-950 border-l border-neutral-900 h-full flex flex-col shadow-2xl relative select-none">
        
        {/* Header section with Dynamic Progress steps */}
        <div className="p-4 border-b border-neutral-900 bg-neutral-950/95 sticky top-0 z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              <span className="font-extrabold text-stone-100 text-sm">Every-zone Smart Cart</span>
              <span className="bg-neutral-900 border border-neutral-800 text-amber-400 text-xs px-2 py-0.5 rounded-full font-mono">{items.length}</span>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="text-stone-400 hover:text-white hover:bg-neutral-900 p-1.5 rounded-lg border border-neutral-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Checkout Progress Steps */}
          {items.length > 0 && !txSuccess && (
            <div className="grid grid-cols-3 gap-1 pt-1.5 text-center">
              <button 
                onClick={() => setCheckoutStep('cart')}
                className={`py-1.5 rounded-xl text-[9.5px] font-black uppercase tracking-wider border transition-all ${
                  checkoutStep === 'cart' 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                    : 'bg-neutral-900/40 border-neutral-850 text-stone-500 hover:text-stone-300'
                }`}
              >
                1. Basket
              </button>
              <button 
                onClick={() => {
                  if (items.length > 0) setCheckoutStep('address');
                }}
                className={`py-1.5 rounded-xl text-[9.5px] font-black uppercase tracking-wider border transition-all ${
                  checkoutStep === 'address' 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                    : 'bg-neutral-900/40 border-neutral-850 text-stone-500 hover:text-stone-300'
                }`}
              >
                2. Shipping
              </button>
              <button 
                onClick={() => {
                  if (items.length > 0) setCheckoutStep('payment');
                }}
                className={`py-1.5 rounded-xl text-[9.5px] font-black uppercase tracking-wider border transition-all ${
                  checkoutStep === 'payment' 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                    : 'bg-neutral-900/40 border-neutral-850 text-stone-500 hover:text-stone-300'
                }`}
              >
                3. Escrow
              </button>
            </div>
          )}
        </div>

        {/* Success Transaction Layer */}
        {txSuccess ? (
          <div id="checkout-success-view" className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-stone-100">Order Placed Securely!</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Your payment of <span className="text-amber-400 font-bold">{txSuccess.amount.toLocaleString()} ETB</span> is now safely held in our Escrow Shield contract.
              </p>
            </div>

            <div className="w-full bg-neutral-900/50 border border-neutral-850 p-4 rounded-2xl text-left space-y-3">
              <div className="flex justify-between text-xs border-b border-neutral-850 pb-2">
                <span className="text-stone-500">Transaction Ref:</span>
                <span className="text-stone-300 font-mono font-bold">{txSuccess.tx_ref}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-neutral-850 pb-2">
                <span className="text-stone-500">Payment Gateway:</span>
                <span className="text-stone-300 uppercase font-mono font-bold">{txSuccess.gateway}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-neutral-850 pb-2">
                <span className="text-stone-500">Delivery Location:</span>
                <span className="text-stone-300 truncate max-w-[180px] text-right block">{addressLine}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Logistics status:</span>
                <span className="text-amber-400 font-bold">Awaiting Vendor Clearance</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-stone-500 justify-center bg-amber-500/5 border border-amber-500/10 p-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Payments are cleared to the seller only after your satisfied delivery receipt.</span>
            </div>

            <button
              id="back-shopping-btn"
              onClick={() => {
                setTxSuccess(null);
                setCheckoutStep('cart');
                onClose();
              }}
              className="w-full bg-stone-100 hover:bg-stone-200 text-neutral-950 font-black py-3 px-4 rounded-xl text-xs transition cursor-pointer"
            >
              Done & Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable list content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              
              {/* STEP 1: BASKET VIEW */}
              {checkoutStep === 'cart' && (
                <>
                  {/* Free Shipping Progress bar */}
                  {items.length > 0 && (
                    <div className="bg-neutral-900/60 border border-neutral-850 rounded-2xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-400 flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 text-amber-400" />
                          <span>Free Delivery Progress</span>
                        </span>
                        <span className="font-bold font-mono text-amber-400 text-[11px]">
                          {subtotal >= freeShippingThreshold 
                            ? 'FREE SHIPPING UNLOCKED!' 
                            : `${subtotal.toLocaleString()} / ${freeShippingThreshold.toLocaleString()} ETB`}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-850">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      {subtotal < freeShippingThreshold && (
                        <p className="text-[10px] text-stone-500">
                          Add <span className="font-bold text-amber-500">{(freeShippingThreshold - subtotal).toLocaleString()} ETB</span> more to qualify for FREE delivery courier service.
                        </p>
                      )}
                    </div>
                  )}

                  {items.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center text-stone-500 space-y-3">
                      <ShoppingCart className="w-12 h-12 text-stone-700 stroke-[1.5]" />
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-stone-400">Your cart is empty</p>
                        <p className="text-[11px] text-stone-500 max-w-[200px]">Find unique products in the marketplace and add them here.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">Items in Basket</span>
                      {items.map((item) => {
                        const activePrice = item.variant?.price || item.product.discountPrice || item.product.price;
                        return (
                          <div
                            key={item.id}
                            id={`cart-item-${item.id}`}
                            className="flex gap-3 bg-neutral-900/30 border border-neutral-850 p-3 rounded-2xl relative group hover:border-neutral-800 transition"
                          >
                            {/* Product Thumbnail image */}
                            <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-900 overflow-hidden flex-shrink-0">
                              <img
                                src={item.product.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Product text details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="space-y-0.5 pr-6">
                                <h4 className="text-xs font-bold text-stone-200 line-clamp-1 leading-tight group-hover:text-amber-400 transition duration-150">
                                  {item.product.title}
                                </h4>
                                {item.variant && (
                                  <div className="flex gap-1.5 text-[9px] text-stone-400">
                                    {item.variant.color && <span className="bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-750 font-medium">Color: {item.variant.color}</span>}
                                    {item.variant.size && <span className="bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-750 font-medium">Size: {item.variant.size}</span>}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs font-mono font-extrabold text-stone-100">
                                  {(activePrice * item.quantity).toLocaleString()} ETB
                                </span>

                                {/* Qty increment controls */}
                                <div className="flex items-center bg-neutral-950 border border-neutral-850 rounded-lg py-0.5 px-1">
                                  <button
                                    id={`dec-qty-item-${item.id}`}
                                    onClick={() => onUpdateQty(item.productId, -1, item.variantId)}
                                    className="w-5 h-5 rounded hover:bg-neutral-900 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer"
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span id={`qty-display-item-${item.id}`} className="w-6 text-center text-[11px] font-bold text-stone-300">{item.quantity}</span>
                                  <button
                                    id={`inc-qty-item-${item.id}`}
                                    onClick={() => onUpdateQty(item.productId, 1, item.variantId)}
                                    className="w-5 h-5 rounded hover:bg-neutral-900 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Save for later / Move to Wishlist Quick Actions */}
                              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-neutral-900/60">
                                <button 
                                  onClick={() => handleSaveForLater(item)}
                                  className="text-[9px] font-bold text-stone-400 hover:text-amber-400 transition flex items-center gap-1 cursor-pointer"
                                >
                                  📥 Save For Later
                                </button>
                                <button 
                                  onClick={() => handleMoveToWishlist(item)}
                                  className="text-[9px] font-bold text-stone-400 hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                                >
                                  💖 Move To Wishlist
                                </button>
                              </div>
                            </div>

                            {/* Trash action button */}
                            <button
                              id={`remove-item-${item.id}`}
                              onClick={() => onRemoveItem(item.productId, item.variantId)}
                              className="absolute top-2.5 right-2.5 text-stone-500 hover:text-red-400 p-1 rounded-lg hover:bg-neutral-900/60 transition duration-150 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Saved For Later items block */}
                  {savedForLater.length > 0 && (
                    <div className="border-t border-neutral-900 pt-3 space-y-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">Saved For Later ({savedForLater.length})</span>
                      <div className="space-y-2">
                        {savedForLater.map((sItem) => (
                          <div 
                            key={sItem.id}
                            className="flex items-center justify-between p-2.5 bg-neutral-950 border border-neutral-900 rounded-xl"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img 
                                src={sItem.product.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150'} 
                                alt={sItem.product.title} 
                                className="w-10 h-10 object-cover rounded-lg border border-neutral-850"
                              />
                              <div className="min-w-0 text-left">
                                <h5 className="text-[11px] font-bold text-stone-300 truncate">{sItem.product.title}</h5>
                                <span className="text-[10px] text-amber-500 font-mono">
                                  {(sItem.product.discountPrice || sItem.product.price).toLocaleString()} ETB
                                </span>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleMoveToCart(sItem)}
                              className="text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 hover:border-stone-700 text-stone-200 font-extrabold px-2.5 py-1 rounded-lg cursor-pointer transition"
                            >
                              🛒 Move To Cart
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Products Complement Block */}
                  <div className="border-t border-neutral-900 pt-3 space-y-2.5">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Recommended Companions</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-neutral-900/40 border border-neutral-850 rounded-xl p-2 flex flex-col justify-between">
                        <div className="flex items-start gap-2">
                          <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=150" alt="accessory" className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0 text-left">
                            <h6 className="text-[10px] font-bold text-stone-200 truncate">Porcelain Brew Mug</h6>
                            <span className="text-[9.5px] text-amber-400 font-bold font-mono">450 ETB</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => alert('Porcelain Brew Mug added to basket!')}
                          className="w-full mt-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-[9.5px] font-black text-stone-200 py-1 rounded-lg cursor-pointer"
                        >
                          + Quick Add
                        </button>
                      </div>

                      <div className="bg-neutral-900/40 border border-neutral-850 rounded-xl p-2 flex flex-col justify-between">
                        <div className="flex items-start gap-2">
                          <img src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=150" alt="accessory" className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0 text-left">
                            <h6 className="text-[10px] font-bold text-stone-200 truncate">Organic Spice Kolo</h6>
                            <span className="text-[9.5px] text-amber-400 font-bold font-mono">220 ETB</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => alert('Organic Spice Kolo added to basket!')}
                          className="w-full mt-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-[9.5px] font-black text-stone-200 py-1 rounded-lg cursor-pointer"
                        >
                          + Quick Add
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2: SHIPPING & ADDRESS VIEW */}
              {checkoutStep === 'address' && (
                <div className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-stone-400 font-mono block">Delivery Address</span>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                        <input 
                          type="text" 
                          value={addressLine}
                          onChange={(e) => {
                            setAddressLine(e.target.value);
                            setAddressVerified(false);
                          }}
                          placeholder="Enter your subcity, street and house number"
                          className="w-full bg-neutral-950 border border-neutral-850 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-sans"
                        />
                      </div>
                      <button 
                        onClick={handleDetectAddress}
                        disabled={isDetectingAddress}
                        className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-750 text-stone-300 font-black text-[11px] px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-40 transition-all shrink-0"
                      >
                        {isDetectingAddress ? (
                          <div className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          '🛰️ Auto-Detect'
                        )}
                      </button>
                    </div>

                    {addressVerified && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 border border-emerald-500/15 p-2 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Address successfully validated via Ethiopian GIS Mapping Registry.</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-neutral-900/40 border border-neutral-850 p-3 rounded-2xl space-y-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">Logistics Partner Details</span>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Carrier:</span>
                      <span className="text-stone-200 font-bold">Every-zone Express Courier</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Shipping Mode:</span>
                      <span className="text-stone-200 font-bold">Same Day / 24-Hour Express</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-neutral-850 pt-2">
                      <span className="text-stone-400">Escrow Insurance:</span>
                      <span className="text-emerald-400 font-extrabold flex items-center gap-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Protected
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCheckoutStep('payment')}
                    disabled={!addressLine || isDetectingAddress}
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Proceed to Escrow Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 3: PAYMENT & ONE-TAP ESCROW */}
              {checkoutStep === 'payment' && (
                <div className="space-y-4 text-left">
                  {/* Coupon Codes Promo input */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 font-mono block">Promo Coupon Codes</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="WELCOME100, ESKROWTRUST..."
                        className="flex-1 bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 uppercase font-mono"
                      />
                      <button 
                        onClick={() => handleApplyCoupon(couponCode)}
                        className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-stone-300 font-black text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {appliedCouponName && (
                      <p className="text-[10px] text-emerald-400 font-bold">
                        🎉 Coupon "{appliedCouponName}" successfully applied!
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                      </p>
                    )}

                    {/* Fast Coupon chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button 
                        onClick={() => {
                          setCouponCode('WELCOME100');
                          handleApplyCoupon('WELCOME100');
                        }}
                        className="text-[9px] bg-neutral-900 border border-neutral-850 hover:border-amber-500/40 text-stone-400 hover:text-stone-200 px-2.5 py-1 rounded-lg font-mono font-bold cursor-pointer transition"
                      >
                        WELCOME100 (-100)
                      </button>
                      <button 
                        onClick={() => {
                          setCouponCode('ESKROWTRUST');
                          handleApplyCoupon('ESKROWTRUST');
                        }}
                        className="text-[9px] bg-neutral-900 border border-neutral-850 hover:border-amber-500/40 text-stone-400 hover:text-stone-200 px-2.5 py-1 rounded-lg font-mono font-bold cursor-pointer transition"
                      >
                        ESKROWTRUST (-10%)
                      </button>
                    </div>
                  </div>

                  {/* One-Tap Payment / Escrow Auto Settlement */}
                  <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-black text-stone-100 uppercase tracking-wide block">⚡ One-Click Escrow Checkout</span>
                        <p className="text-[9px] text-stone-500 leading-tight">Settle immediately using pre-authenticated mobile wallet balance.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCheckout('telebirr')}
                      className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-neutral-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer hover:shadow-lg shadow-amber-500/5 active:scale-95"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Settle Instantly (One-Tap Payment)</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Calculations & Checkout (Sticky bottom block) */}
            {items.length > 0 && (
              <div className="p-4 border-t border-neutral-900 bg-neutral-950/95 space-y-4 sticky bottom-0">
                
                {/* Detailed Order Summary breakdown */}
                <div className="space-y-1.5 bg-neutral-900/20 border border-neutral-900/60 p-3 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-500 font-mono block mb-1">Order Summary</span>
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Basket Subtotal</span>
                    <span className="font-mono text-stone-200">{subtotal.toLocaleString()} ETB</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span className="font-mono">-{appliedDiscount.toLocaleString()} ETB</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Delivery Fee</span>
                    <span className="font-mono text-stone-200">{deliveryFee === 0 ? 'FREE' : `${deliveryFee} ETB`}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-550 border-t border-neutral-900 pt-1.5">
                    <span className="flex items-center gap-1">🛡️ Joint Escrow Fee <Info className="w-3 h-3 text-stone-600" title="Every-zone provides free escrow guarantees for transactions" /></span>
                    <span className="text-emerald-500 font-black uppercase text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-neutral-850 pt-2 text-stone-100 font-extrabold">
                    <span>Grand Total</span>
                    <span className="font-mono text-amber-400 text-base">{grandTotal.toLocaleString()} ETB</span>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="space-y-2 py-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-500 font-medium">
                      <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <span>Processing Escrow Settle Agreement...</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-2/3 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Render different gateway selectors for Payment step */}
                    {checkoutStep === 'payment' ? (
                      <div className="space-y-2">
                        <span className="text-[10px] text-stone-500 uppercase font-bold block font-mono">Select Secure Payment Gateway</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            id="checkout-telebirr-btn"
                            onClick={() => handleCheckout('telebirr')}
                            className="bg-[#00529b]/10 hover:bg-[#00529b]/25 border border-[#00529b]/30 text-[#00a8ff] font-bold py-3 px-3 rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Pay with Telebirr</span>
                          </button>
                          <button
                            id="checkout-chapa-btn"
                            onClick={() => handleCheckout('chapa')}
                            className="bg-[#00c853]/10 hover:bg-[#00c853]/25 border border-[#00c853]/30 text-[#00e676] font-bold py-3 px-3 rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <ArrowRight className="w-4 h-4" />
                            <span>Pay with Chapa</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          if (checkoutStep === 'cart') setCheckoutStep('address');
                          else if (checkoutStep === 'address') setCheckoutStep('payment');
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer hover:shadow-lg shadow-amber-500/10 active:scale-[0.99]"
                      >
                        <span>{checkoutStep === 'cart' ? 'Proceed to Delivery Details' : 'Proceed to Escrow Payment'}</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </>
                )}

                <div className="flex items-center gap-1 text-[10px] text-stone-500 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Verified Escrow Protection Guarantee</span>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
