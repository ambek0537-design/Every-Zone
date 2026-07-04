import React from 'react';
import { Tag } from 'lucide-react';

interface DiscountBadgeProps {
  price: number;
  discountPrice: number | null;
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({ price, discountPrice }) => {
  if (!discountPrice || discountPrice >= price) return null;

  const saving = price - discountPrice;
  const pct = Math.round((saving / price) * 100);

  return (
    <div id="discount-badge" className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
      <Tag className="w-3 h-3" />
      <span>{pct}% OFF</span>
    </div>
  );
};
