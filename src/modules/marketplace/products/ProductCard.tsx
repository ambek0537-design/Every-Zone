import React from 'react';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { DiscountBadge } from '../discounts/DiscountBadge';

interface ProductImage {
  id: string;
  imageUrl: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  currency: string;
  quantity: number;
  status: string;
  condition: string;
  averageRating: number;
  totalReviews: number;
  featured: boolean;
  images?: ProductImage[];
  vendor?: {
    id: string;
    shopName: string;
  };
  vendorId?: string;
}

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onViewDetails: (slug: string) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  onAddToCart: (id: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onViewDetails,
  onToggleWishlist,
  onAddToCart
}) => {
  const mainImage = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600';
  const isOutOfStock = product.quantity <= 0 || product.status === 'OUT_OF_STOCK';

  // Deterministic sold count for realistic feel
  const soldCount = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) {
      hash = product.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const base = Math.abs(hash % 450) + 50;
    return `${base}+ sold`;
  }, [product.id]);

  // Discount percentage
  const discountPercentage = React.useMemo(() => {
    if (!product.discountPrice) return null;
    const diff = product.price - product.discountPrice;
    return Math.round((diff / product.price) * 100);
  }, [product.price, product.discountPrice]);

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product.slug)}
      className="group relative bg-[#131316]/80 hover:bg-[#1a1a20] border border-zinc-800/80 hover:border-[#C5A059]/40 rounded-[22px] overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer shadow-xl shadow-black/50 hover:shadow-[#C5A059]/5 select-none"
    >
      {/* Upper Thumbnail Section */}
      <div className="relative aspect-[4/3] w-full bg-[#09090b] overflow-hidden">
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-full object-cover transition-all duration-750 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Backdrop gold sheen on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badge Layer */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercentage && (
            <span className="bg-[#E2B755] text-[#09090b] text-[9px] font-black px-2.5 py-1 rounded-full shadow-md tracking-wider">
              {discountPercentage}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-zinc-900/90 border border-[#C5A059]/30 text-[#E2B755] text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm tracking-wider">
              ✦ SIGNATURE
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Wishlist Toggle overlay - Dark Luxury Glass style */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id, e);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md border cursor-pointer ${
            isWishlisted 
              ? 'bg-[#C5A059] border-[#C5A059] text-zinc-950 scale-105 shadow-[#C5A059]/30' 
              : 'bg-black/40 border-white/10 text-stone-300 hover:text-white hover:bg-black/60 hover:scale-105'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Modern Hover Sheen Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 z-5">
          <div className="bg-[#131316]/95 text-stone-100 border border-[#C5A059]/20 px-3.5 py-2 rounded-xl text-[10px] font-extrabold tracking-widest uppercase flex items-center gap-1.5 shadow-xl">
            <Eye className="w-3.5 h-3.5 text-[#E2B755]" />
            <span>Redefine View</span>
          </div>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2.5">
        
        {/* Vendor and Rating Stats */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            {product.vendor && (
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-[10px] text-[#C5A059] font-black tracking-wider uppercase truncate">
                  {product.vendor.shopName}
                </span>
                {/* Verified Gold Tick */}
                <span className="inline-flex items-center justify-center w-3 h-3 bg-[#C5A059]/10 rounded-full text-[#E2B755] font-black text-[7px]" title="Every-zone Verified Merchant">
                  ✓
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono shrink-0">
              <Star className="w-3 h-3 fill-current text-[#E2B755]" />
              <span>{product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}</span>
            </div>
          </div>

          <h3 className="text-xs font-bold text-stone-200 group-hover:text-[#E2B755] transition-colors duration-150 line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </div>

        {/* Sold Count & Price Bottom Line */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 mt-auto">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-[9px] text-stone-500 line-through leading-none">
                  {product.price.toLocaleString()} {product.currency}
                </span>
                <span className="text-xs font-black text-[#E2B755] mt-0.5">
                  {product.discountPrice.toLocaleString()} {product.currency}
                </span>
              </>
            ) : (
              <span className="text-xs font-black text-stone-200">
                {product.price.toLocaleString()} {product.currency}
              </span>
            )}
            {/* Deterministic Sold Count Label */}
            <span className="text-[8.5px] text-stone-500 font-medium font-mono mt-1">
              {soldCount}
            </span>
          </div>

          <button
            id={`add-cart-card-${product.id}`}
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product.id, e);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-zinc-850 text-stone-600 border border-zinc-800 cursor-not-allowed'
                : 'bg-gradient-to-br from-[#916E2E] via-[#C5A059] to-[#E2B755] hover:brightness-110 text-neutral-950 shadow-md shadow-[#C5A059]/10 active:scale-95'
            }`}
            title="Add to Basket"
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
