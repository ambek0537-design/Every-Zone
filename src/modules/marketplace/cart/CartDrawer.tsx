import React, { useState } from 'react';
import { 
  X, ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowRight, ShieldCheck, CheckCircle2 
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
  const [checkoutGateway, setCheckoutGateway] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState<any>(null);

  // Math totals
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.variant?.price || item.product.discountPrice || item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 5000 ? 0 : 150;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = async (gateway: string) => {
    setCheckoutGateway(gateway);
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

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
      {/* Drawer box */}
      <div id="cart-drawer" className="w-full max-w-md bg-neutral-950 border-l border-neutral-900 h-full flex flex-col shadow-2xl relative select-none">
        
        {/* Header section */}
        <div className="p-4 border-b border-neutral-900 flex items-center justify-between bg-neutral-950/90 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
            <span className="font-extrabold text-stone-100 text-sm">Your Shopping Cart</span>
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

        {/* Success Transaction Layer */}
        {txSuccess ? (
          <div id="checkout-success-view" className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-stone-100">Order Confirmed!</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Your payment of <span className="text-amber-400 font-bold">{txSuccess.amount.toLocaleString()} ETB</span> was processed successfully.
              </p>
            </div>

            <div className="w-full bg-neutral-900/50 border border-neutral-850 p-4 rounded-2xl text-left space-y-3">
              <div className="flex justify-between text-xs border-b border-neutral-850 pb-2">
                <span className="text-stone-500">Transaction Ref:</span>
                <span className="text-stone-300 font-mono font-bold">{txSuccess.tx_ref}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-neutral-850 pb-2">
                <span className="text-stone-500">Payment Gateway:</span>
                <span className="text-stone-300 uppercase font-mono">{txSuccess.gateway}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-neutral-850 pb-2">
                <span className="text-stone-500">Escrow Agent:</span>
                <span className="text-stone-300">Every-zone Smart Escrow</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Logistics status:</span>
                <span className="text-amber-400 font-bold">Assigned to Express Rider</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-stone-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Payment held in escrow until delivery is confirmed.</span>
            </div>

            <button
              id="back-shopping-btn"
              onClick={() => {
                setTxSuccess(null);
                onClose();
              }}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-stone-200 border border-neutral-800 font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable list content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-stone-700 stroke-[1.5]" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-stone-400">Your cart is empty</p>
                    <p className="text-[11px] text-stone-500 max-w-[200px]">Find unique products in the marketplace and add them here.</p>
                  </div>
                </div>
              ) : (
                items.map((item) => {
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
                              {item.variant.color && <span className="bg-neutral-800 px-1 rounded border border-neutral-750 font-medium">Color: {item.variant.color}</span>}
                              {item.variant.size && <span className="bg-neutral-800 px-1 rounded border border-neutral-750 font-medium">Size: {item.variant.size}</span>}
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
                })
              )}
            </div>

            {/* Calculations & Checkout (Sticky bottom block) */}
            {items.length > 0 && (
              <div className="p-4 border-t border-neutral-900 bg-neutral-950/90 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-200">{subtotal.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Delivery Fee</span>
                    <span className="font-mono text-stone-200">{deliveryFee === 0 ? 'FREE' : `${deliveryFee} ETB`}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-neutral-900 pt-2 text-stone-100 font-extrabold">
                    <span>Grand Total</span>
                    <span className="font-mono text-amber-400">{grandTotal.toLocaleString()} ETB</span>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="space-y-2 py-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-500 font-medium">
                      <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <span>Contacting secure gateway simulator...</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-2/3 animate-pulse" />
                    </div>
                  </div>
                ) : (
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
