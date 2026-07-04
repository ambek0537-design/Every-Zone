import React from 'react';
import { Truck, ShieldCheck, MapPin } from 'lucide-react';

interface ShippingDetailsProps {
  price: number;
}

export const ShippingDetails: React.FC<ShippingDetailsProps> = ({ price }) => {
  const isFree = price > 5000;
  const fee = isFree ? 0 : 150;

  return (
    <div id="shipping-details" className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-3.5 space-y-2 text-stone-300 text-xs">
      <div className="flex items-center gap-2.5">
        <Truck className="w-4.5 h-4.5 text-amber-500" />
        <div>
          <div className="font-medium text-stone-100 flex items-center gap-1.5">
            <span>Fast Express Dispatch</span>
            {isFree ? (
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-md font-semibold border border-emerald-500/20">FREE</span>
            ) : (
              <span className="text-stone-400 font-normal">({fee} ETB)</span>
            )}
          </div>
          <div className="text-[11px] text-stone-400">Guaranteed hand-to-hand delivery in Addis Ababa within 2-4 hours.</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <MapPin className="w-4.5 h-4.5 text-amber-500" />
        <div>
          <div className="font-medium text-stone-100">Fayda Verified Secure Pickup</div>
          <div className="text-[11px] text-stone-400">Merchant location verified securely against National ID credentials.</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <ShieldCheck className="w-4.5 h-4.5 text-amber-500" />
        <div>
          <div className="font-medium text-stone-100">100% Every-zone Escrow Protection</div>
          <div className="text-[11px] text-stone-400">Funds are held safely in escrow. Released only upon confirmation of delivery.</div>
        </div>
      </div>
    </div>
  );
};
