import React, { useState } from 'react';
import { 
  X, Star, Heart, ShoppingBag, Plus, Minus, ShieldAlert, BadgePercent 
} from 'lucide-react';
import { ProductMediaGallery } from '../product-media/ProductMediaGallery';
import { ReviewsSection } from '../reviews/ReviewsSection';
import { ShippingDetails } from '../shipping/ShippingDetails';
import { PriceHistoryChart } from './PriceHistoryChart';

interface ProductImage {
  id: string;
  imageUrl: string;
}

interface ProductVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

interface ProductVariant {
  id: string;
  color: string | null;
  size: string | null;
  sku: string;
  quantity: number;
}

interface Vendor {
  id: string;
  shopName: string;
  subscriptionStatus: string;
}

interface Review {
  id: string;
  reviewerName: string;
  ratingValue: number;
  reviewText: string;
  createdAt: string;
}

interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  currency: string;
  quantity: number;
  status: string;
  condition: string;
  averageRating: number;
  totalReviews: number;
  images: ProductImage[];
  videos: ProductVideo[];
  variants: ProductVariant[];
  vendor: Vendor | null;
  reviews: Review[];
}

interface ProductDetailModalProps {
  product: ProductDetail;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string, qty: number, variantId: string | null) => void;
  lang?: string;
  onViewVendorProfile?: (vendorId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  lang = 'en',
  onViewVendorProfile
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId) || null;
  const maxAvailable = selectedVariant ? selectedVariant.quantity : product.quantity;
  const isOutOfStock = maxAvailable <= 0 || product.status === 'OUT_OF_STOCK';

  const handleIncrement = () => {
    if (quantity < maxAvailable) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div id="product-detail-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div id="product-detail-modal" className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-850 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto max-h-[90vh] md:max-h-[85vh]">
        
        {/* Close button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 bg-neutral-900/80 backdrop-blur hover:bg-neutral-800 text-stone-300 hover:text-white p-2 rounded-full border border-neutral-800 transition z-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Block (Left Column) */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 overflow-y-auto no-scrollbar md:border-r border-neutral-900">
          <ProductMediaGallery images={product.images} videos={product.videos} />
          
          <div className="mt-6">
            <ReviewsSection reviews={product.reviews} averageRating={product.averageRating} />
          </div>
        </div>

        {/* Configuration Block (Right Column) */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto no-scrollbar bg-neutral-950">
          <div className="space-y-4">
            {/* Vendor Name */}
            {product.vendor && (
              <div className="flex flex-col gap-2 border-b border-neutral-900 pb-3">
                <div className="flex flex-wrap items-center gap-1.5 text-amber-500 font-medium text-xs uppercase tracking-wider">
                  <span className="text-stone-400 normal-case">Sold by:</span>
                  <span className="font-extrabold">{product.vendor.shopName}</span>
                  {product.vendor.id === 'v-1' ? (
                    <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-wider flex items-center gap-1">
                      👑 {lang === 'en' ? 'Trusted Business' : 'ታማኝ ንግድ'}
                    </span>
                  ) : product.vendor.id === 'v-2' ? (
                    <span className="bg-yellow-500/15 text-yellow-500 border border-yellow-500/35 text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-wider flex items-center gap-1">
                      🟡 {lang === 'en' ? 'Premium Seller' : 'ፕሪሚየም ሻጭ'}
                    </span>
                  ) : (
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-wider flex items-center gap-1">
                      🟢 {lang === 'en' ? 'Verified' : 'የተረጋገጠ'}
                    </span>
                  )}
                </div>
                {onViewVendorProfile && (
                  <button
                    id="view-vendor-profile-btn"
                    onClick={() => onViewVendorProfile(product.vendor!.id)}
                    className="w-full sm:w-auto self-start bg-amber-500 hover:bg-amber-600 text-neutral-950 text-[10px] font-black px-2.5 py-1.2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    👥 {lang === 'en' ? 'View Profile' : 'ፕሮፋይል እይ'}
                  </button>
                )}
              </div>
            )}

            {/* Product Title */}
            <h1 className="text-lg sm:text-xl font-extrabold text-stone-100 tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price Details */}
            <div className="flex items-center gap-3">
              {product.discountPrice ? (
                <>
                  <span className="text-xl font-extrabold text-amber-400">
                    {product.discountPrice.toLocaleString()} {product.currency}
                  </span>
                  <span className="text-stone-500 line-through text-xs font-mono">
                    {product.price.toLocaleString()} {product.currency}
                  </span>
                  <span className="bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <BadgePercent className="w-3.5 h-3.5" />
                    <span>Promo Price</span>
                  </span>
                </>
              ) : (
                <span className="text-xl font-extrabold text-stone-100">
                  {product.price.toLocaleString()} {product.currency}
                </span>
              )}
            </div>

            {/* Condition badge */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">Condition:</span>
              <span className="text-stone-200 font-semibold uppercase bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg">
                {product.condition}
              </span>
              <span className="text-stone-600">|</span>
              <span className="text-stone-400">SKU:</span>
              <span className="text-stone-300 font-mono text-[11px]">{product.sku}</span>
            </div>

            {/* Description content */}
            <div className="border-t border-neutral-900 pt-3">
              <p className="text-xs text-stone-400 leading-relaxed max-h-[120px] overflow-y-auto no-scrollbar">
                {product.description}
              </p>
            </div>

            {/* Price History Chart */}
            <div className="border-t border-neutral-900 pt-3">
              <PriceHistoryChart
                productId={product.id}
                originalPrice={product.price}
                discountPrice={product.discountPrice}
                currency={product.currency}
              />
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 border-t border-neutral-900 pt-3">
                <label className="text-xs font-bold text-stone-300">Choose Variant / Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      id={`variant-btn-${v.id}`}
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setQuantity(1);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition cursor-pointer ${
                        selectedVariantId === v.id
                          ? 'border-amber-500 bg-amber-500/5 text-amber-400 shadow-md'
                          : 'border-neutral-800 bg-neutral-900 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {v.color && <span>{v.color}</span>}
                        {v.size && <span className="bg-neutral-800 text-[10px] px-1.5 py-0.5 rounded border border-neutral-700 font-semibold">{v.size}</span>}
                      </div>
                      <span className="text-[9px] text-stone-500 font-mono mt-0.5 block">
                        {v.quantity > 0 ? `${v.quantity} items left` : 'Out of Stock'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Details */}
            <div className="border-t border-neutral-900 pt-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">Product Specifications</label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-neutral-900/60 p-2 rounded-xl border border-neutral-850/50">
                  <span className="text-stone-500 block text-[9px] uppercase font-mono font-semibold">Origin</span>
                  <span className="text-stone-200 font-bold">{product.title.toLowerCase().includes('coffee') ? 'Yirgacheffe, Ethiopia' : product.title.toLowerCase().includes('leather') ? 'Addis Ababa, Ethiopia' : 'Abyssinia Craftlands'}</span>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-xl border border-neutral-850/50">
                  <span className="text-stone-500 block text-[9px] uppercase font-mono font-semibold">Security Level</span>
                  <span className="text-amber-400 font-bold">Fayda Escrow Secured</span>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-xl border border-neutral-850/50">
                  <span className="text-stone-500 block text-[9px] uppercase font-mono font-semibold">Shipping time</span>
                  <span className="text-stone-200 font-bold">1 - 3 Business Days</span>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-xl border border-neutral-850/50">
                  <span className="text-stone-500 block text-[9px] uppercase font-mono font-semibold">Quality grade</span>
                  <span className="text-stone-200 font-bold">Premium Grade A+</span>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            <div className="border-t border-neutral-900 pt-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">Related Items in Inventory</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-2 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-stone-900 flex-shrink-0 overflow-hidden border border-neutral-800">
                    <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150" alt="Related" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[10px] font-bold text-stone-200 truncate">Traditional Habesha Tilet</h5>
                    <span className="text-[9px] text-amber-400 font-mono font-bold">1,200 ETB</span>
                  </div>
                </div>
                <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-2 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-stone-900 flex-shrink-0 overflow-hidden border border-neutral-800">
                    <img src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=150" alt="Related 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[10px] font-bold text-stone-200 truncate">Golden Kolo Blend</h5>
                    <span className="text-[9px] text-amber-400 font-mono font-bold">450 ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping details */}
            <div className="border-t border-neutral-900 pt-3">
              <ShippingDetails price={product.discountPrice || product.price} />
            </div>
          </div>

          {/* Checkout controls */}
          <div className="border-t border-neutral-900 pt-4 mt-5 space-y-3">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 bg-red-950/20 text-red-400 border border-red-500/10 p-3 rounded-xl text-xs justify-center font-semibold">
                <ShieldAlert className="w-4.5 h-4.5" />
                <span>Product / Selected Variant is currently OUT OF STOCK</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Quantity adjuster */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider font-mono">Quantity</span>
                  <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-1.5 py-1">
                    <button
                      id="dec-qty-btn"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg hover:bg-neutral-800 text-stone-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span id="qty-display" className="w-8 text-center text-xs font-bold text-stone-200">{quantity}</span>
                    <button
                      id="inc-qty-btn"
                      onClick={handleIncrement}
                      disabled={quantity >= maxAvailable}
                      className="w-8 h-8 rounded-lg hover:bg-neutral-800 text-stone-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stacked purchase CTAs */}
                <div className="flex-1 flex flex-col gap-2">
                  <button
                    id="add-to-cart-cta-btn"
                    onClick={() => onAddToCart(product.id, quantity, selectedVariantId)}
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 fill-current" />
                    <span>Add {quantity} Item{quantity > 1 ? 's' : ''} to Cart</span>
                  </button>

                  <button
                    id="buy-now-cta-btn"
                    onClick={() => {
                      onAddToCart(product.id, quantity, selectedVariantId);
                      alert(lang === 'en' ? '🛒 Items added to cart! Proceeding to fast secure escrow checkout...' : '🛒 እቃው ወደ ጋሪ ታክሏል! ወደ ክፍያ ዋስትና መክፈያ በመሸጋገር ላይ...');
                    }}
                    className="w-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-neutral-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    ⚡ Buy Now (Fast Checkout)
                  </button>
                </div>
              </div>
            )}

            {/* Auxiliary actions: Wishlist, Chat, and Visit Store */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                id="wishlist-detail-btn"
                onClick={() => onToggleWishlist(product.id)}
                className={`py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                  isWishlisted
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-neutral-900 border-neutral-850 text-stone-400 hover:border-stone-700 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                <span>Wishlist</span>
              </button>

              <button
                id="chat-vendor-detail-btn"
                onClick={() => {
                  alert(lang === 'en' 
                    ? `💬 Secure encrypted chat initiated with ${product.vendor?.shopName || 'Merchant'}. (Fayda Verified)` 
                    : `💬 ደህንነቱ የተጠበቀ ምስጢራዊ ውይይት ከ ${product.vendor?.shopName || 'ነጋዴ'} ጋር ተጀምሯል።`);
                }}
                className="bg-neutral-900 border border-neutral-850 hover:border-stone-700 text-stone-300 hover:text-white py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>💬 Chat Seller</span>
              </button>

              {product.vendor && onViewVendorProfile && (
                <button
                  id="visit-store-detail-btn"
                  onClick={() => {
                    onClose();
                    onViewVendorProfile(product.vendor!.id);
                  }}
                  className="bg-neutral-900 border border-neutral-850 hover:border-stone-700 text-amber-500 hover:text-amber-400 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>🏪 Visit Store</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
