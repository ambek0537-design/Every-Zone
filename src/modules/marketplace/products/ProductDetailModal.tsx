import React, { useState } from 'react';
import { 
  X, Star, Heart, ShoppingBag, Plus, Minus, ShieldAlert, BadgePercent,
  ShieldCheck, HelpCircle, ChevronDown, Clock, RefreshCw, CheckCircle2, Award,
  Play, Volume2, Coins, Phone, MessageSquare, ArrowRight, Clipboard, Tag
} from 'lucide-react';
import { ProductMediaGallery } from '../product-media/ProductMediaGallery';
import { ReviewsSection } from '../reviews/ReviewsSection';
import { ShippingDetails } from '../shipping/ShippingDetails';
import { PriceHistoryChart } from './PriceHistoryChart';
import { OptimizedImage } from '../../../components/OptimizedImage';

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
  const [expandedQa, setExpandedQa] = useState<number | null>(null);
  
  // Interactive simulated video states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);

  // Multi-currency future-ready selection
  const [selectedCurrency, setSelectedCurrency] = useState<'ETB' | 'USD' | 'SAR' | 'AED'>('ETB');

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

  // Currency Converter calculation
  const convertPrice = (amount: number) => {
    const rates = {
      ETB: 1,
      USD: 0.0085,
      SAR: 0.032,
      AED: 0.031
    };
    const symbols = {
      ETB: 'ETB',
      USD: '$',
      SAR: 'SAR',
      AED: 'AED'
    };
    const converted = amount * rates[selectedCurrency];
    return `${symbols[selectedCurrency]} ${converted.toLocaleString(undefined, {
      minimumFractionDigits: selectedCurrency === 'ETB' ? 0 : 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Pre-configured Questions and Answers
  const faqList = [
    {
      q: 'Is this item authentic and handmade?',
      a: 'Yes, this product is hand-woven or crafted by certified local Ethiopian weaving cooperatives in Chencha, using 100% natural organic cotton or materials.'
    },
    {
      q: 'Can I inspect the product before accepting delivery?',
      a: 'Absolutely! Our Every-zone Express courier waits for you to check the product condition. Only after you sign satisfactions will the escrow funds clear to the merchant.'
    },
    {
      q: 'What is the refund policy?',
      a: 'We support a 14-Day Free Escrow Return Guarantee. If you find any quality discrepancies, request a return inside the app to automatically receive full refunds.'
    }
  ];

  // Deterministic delivery options based on product ID
  const deliveryType = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) {
      hash = product.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash % 2 === 0 ? "Arrives Tomorrow" : "Pickup Today";
  }, [product.id]);

  const handleTogglePlayVideo = () => {
    setIsVideoPlaying(p => !p);
    if (!isVideoPlaying) {
      const interval = setInterval(() => {
        setVideoProgress(v => {
          if (v >= 100) {
            clearInterval(interval);
            setIsVideoPlaying(false);
            return 0;
          }
          return v + 1;
        });
      }, 300);
    }
  };

  return (
    <div id="product-detail-overlay" className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div id="product-detail-modal" className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-850 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto max-h-[95vh] md:max-h-[90vh]">
        
        {/* Close button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 bg-neutral-950/90 backdrop-blur-md hover:bg-neutral-900 text-stone-300 hover:text-white p-2.5 rounded-full border border-neutral-800 transition-all z-50 cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ==================== LEFT COLUMN (Gallery ↓ Video) ==================== */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 overflow-y-auto no-scrollbar md:border-r border-neutral-900 space-y-6">
          
          {/* SECTION 1: Gallery */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">
              ✦ Product Gallery
            </span>
            <ProductMediaGallery images={product.images} videos={product.videos} />
          </div>

          {/* SECTION 2: Video */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">
              📽 Video Walkthrough
            </span>
            <div 
              onClick={handleTogglePlayVideo}
              className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-850 bg-neutral-900 group cursor-pointer shadow-md"
            >
              <img 
                src={product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'} 
                alt="Video presentation" 
                className={`w-full h-full object-cover transition-all duration-700 ${isVideoPlaying ? 'brightness-[0.15]' : 'brightness-50 group-hover:scale-105'}`}
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay elements */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                {isVideoPlaying ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-stone-300 font-medium">Playing Live Craft Demonstration...</p>
                    <p className="text-[9px] text-[#C5A059] font-mono uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded inline-block">Fayda Secured Stream</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-full bg-[#E2B755]/15 backdrop-blur-md border border-[#E2B755]/40 flex items-center justify-center text-[#E2B755] group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="w-6 h-6 fill-current pl-1 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-100 font-extrabold text-shadow">Watch Master-Weaver Story</p>
                      <p className="text-[8.5px] font-mono text-stone-400 uppercase tracking-wider mt-0.5">Duration: 1m 24s • Ultra HD</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
                <div 
                  className="h-full bg-gradient-to-r from-[#C5A059] via-[#E2B755] to-amber-400 transition-all duration-300"
                  style={{ width: `${isVideoPlaying ? videoProgress : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>

        {/* ==================== RIGHT COLUMN (Price ↓ Variants ↓ Stock ↓ Delivery ↓ Description ↓ Reviews ↓ Questions ↓ Vendor ↓ Related Products) ==================== */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto no-scrollbar bg-neutral-950">
          
          <div className="space-y-6">
            
            {/* Header Title Info */}
            <div className="space-y-1 text-left">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-500 font-mono bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {lang === 'en' ? 'Fayda Certified Authenticity' : 'የፋይዳ ማረጋገጫ ያለው'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-100 tracking-tight leading-tight pt-1.5">
                {product.title}
              </h1>
              <div className="text-[10px] text-stone-500 font-mono">SKU: {product.sku} | Condition: <span className="text-stone-300 uppercase font-bold">{product.condition}</span></div>
            </div>

            {/* SECTION 3: Price & Currency Selector */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">
                  Price Conversion
                </span>
                {/* Future Ready currency picker */}
                <div className="flex bg-neutral-950 p-0.5 rounded-xl border border-neutral-850">
                  {(['ETB', 'USD', 'SAR', 'AED'] as const).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => setSelectedCurrency(cur)}
                      className={`px-2 py-1 text-[9px] font-black rounded-lg transition-all cursor-pointer ${selectedCurrency === cur ? 'bg-[#C5A059] text-neutral-950' : 'text-stone-400 hover:text-stone-200'}`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-black text-[#E2B755] tracking-tight">
                      {convertPrice(product.discountPrice)}
                    </span>
                    <span className="text-stone-500 line-through text-xs font-mono">
                      {convertPrice(product.price)}
                    </span>
                    <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%</span>
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-stone-100 tracking-tight">
                    {convertPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* SECTION 4: Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2.5 text-left">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">Choose Variant / Size</label>
                  <span className="text-[9px] text-stone-400 font-mono">Handcrafted Specs</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      id={`variant-btn-${v.id}`}
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setQuantity(1);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition cursor-pointer flex-1 min-w-[110px] ${
                        selectedVariantId === v.id
                          ? 'border-amber-500 bg-amber-500/5 text-amber-400 shadow-md shadow-amber-500/5'
                          : 'border-neutral-850 bg-neutral-900/60 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {v.color && <span className="font-bold">{v.color}</span>}
                        {v.size && <span className="bg-neutral-800 text-[10px] px-1.5 py-0.5 rounded border border-neutral-700 font-bold">{v.size}</span>}
                      </div>
                      <span className="text-[9px] text-stone-500 font-mono mt-0.5 block">
                        {v.quantity > 0 ? `${v.quantity} items ready` : 'Out of Stock'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: Stock Status */}
            <div className="text-left">
              <div className="bg-neutral-900/20 border border-neutral-850 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">Availability Status</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-ping'}`} />
                  <span className={`text-[11px] font-extrabold ${isOutOfStock ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isOutOfStock ? 'Out of stock' : `In stock (${maxAvailable} units remaining)`}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 6: Delivery Info */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-3.5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">
                Fayda Logistics & Shipping
              </span>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-stone-300 font-semibold">
                    {deliveryType === "Arrives Tomorrow" ? "🚚 Arrives Tomorrow (Priority Delivery)" : "🏪 Pickup Today (Local Store)"}
                  </span>
                </div>
                <span className="text-[9.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Escrow Courier
                </span>
              </div>
              <p className="text-[10px] text-stone-450 leading-relaxed font-sans">
                Inspected by our rider before payment release. Secured under Fayda Cooperative Escrow terms.
              </p>
            </div>

            {/* SECTION 7: Description & Specs */}
            <div className="border-t border-neutral-900 pt-4 text-left space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">
                Overview & Description
              </span>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {product.description}
              </p>

              <PriceHistoryChart
                productId={product.id}
                originalPrice={product.price}
                discountPrice={product.discountPrice}
                currency={product.currency}
              />
            </div>

            {/* SECTION 8: Reviews Section */}
            <div className="border-t border-neutral-900 pt-4 text-left">
              <ReviewsSection reviews={product.reviews} averageRating={product.averageRating} />
            </div>

            {/* SECTION 9: QuestionsAccordion */}
            <div className="border-t border-neutral-900 pt-4 text-left space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">
                Q&A Corner
              </span>
              <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
                {faqList.map((faq, index) => (
                  <div key={`faq-${index}`} className="border border-neutral-900 bg-neutral-900/30 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setExpandedQa(expandedQa === index ? null : index)}
                      className="w-full flex items-center justify-between text-xs font-bold text-stone-200 hover:text-stone-100 p-3 text-left transition-colors hover:bg-neutral-900"
                    >
                      <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" /> {faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-300 ${expandedQa === index ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedQa === index && (
                      <p className="text-[11px] text-stone-450 pl-8 pr-4 pb-3 leading-normal bg-neutral-950/20 font-sans border-t border-neutral-900/50 pt-2">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 10: Vendor Trust Node */}
            {product.vendor && (
              <div className="border-t border-neutral-900 pt-4 text-left space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">
                  Merchant Trust Node
                </span>
                <div className="bg-neutral-900/60 border border-neutral-850 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[8.5px] uppercase font-black text-stone-500 tracking-wider block font-mono">Verified Node Status</span>
                      <h4 className="text-xs font-black text-stone-100 flex items-center gap-1.5">
                        🏪 {product.vendor.shopName}
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] px-1.5 py-0.2 rounded font-black uppercase tracking-wide">
                          ✓ Verified Active
                        </span>
                      </h4>
                    </div>

                    {onViewVendorProfile && (
                      <button
                        id="view-vendor-profile-btn"
                        onClick={() => {
                          onClose();
                          onViewVendorProfile(product.vendor!.id);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-neutral-950 text-[10px] font-black px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-md shadow-[#C5A059]/10"
                      >
                        Visit Store
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-stone-400 border-t border-neutral-850/60 pt-3">
                    <div className="text-left">
                      <span className="text-stone-500 block uppercase text-[8px] font-mono font-bold">Seller Rating</span>
                      <span className="text-amber-400 font-extrabold flex items-center gap-0.5">★ 4.9</span>
                    </div>
                    <div className="text-left border-l border-neutral-850 pl-2">
                      <span className="text-stone-500 block uppercase text-[8px] font-mono font-bold">Escrow Deals</span>
                      <span className="text-emerald-400 font-extrabold">120+ Completed</span>
                    </div>
                    <div className="text-left border-l border-neutral-850 pl-2">
                      <span className="text-stone-500 block uppercase text-[8px] font-mono font-bold">Licenses</span>
                      <span className="text-stone-200 font-mono font-bold truncate">ET-TIN-8390</span>
                    </div>
                  </div>

                  {/* Vendor contact/actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => alert(`📞 Call scheduled with ${product.vendor?.shopName || 'Merchant'}. System checking line availability...`)}
                      className="bg-neutral-950 border border-neutral-850 hover:border-[#C5A059]/40 hover:text-white text-stone-300 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Phone className="w-3 h-3 text-[#C5A059]" />
                      <span>Call Merchant</span>
                    </button>
                    <button
                      onClick={() => alert(`💬 Secure Chat initiated with ${product.vendor?.shopName || 'Merchant'}. Ready to type.`)}
                      className="bg-neutral-950 border border-neutral-850 hover:border-[#C5A059]/40 hover:text-white text-stone-300 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 text-[#C5A059]" />
                      <span>Message Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 11: Related Products */}
            <div className="border-t border-neutral-900 pt-4 text-left space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono block">
                Recommended For You (Cooperative Inventory)
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-2 flex items-center gap-2.5 hover:border-neutral-800 transition-colors cursor-pointer">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150"
                    alt="Related"
                    className="w-10 h-10 rounded-lg border border-neutral-800"
                    aspectRatio="h-full w-full"
                  />
                  <div className="min-w-0">
                    <h5 className="text-[10px] font-extrabold text-stone-200 truncate">Traditional Habesha Tilet</h5>
                    <span className="text-[9px] text-amber-400 font-mono font-black">1,200 ETB</span>
                  </div>
                </div>
                <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-2 flex items-center gap-2.5 hover:border-neutral-800 transition-colors cursor-pointer">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=150"
                    alt="Related 2"
                    className="w-10 h-10 rounded-lg border border-neutral-800"
                    aspectRatio="h-full w-full"
                  />
                  <div className="min-w-0">
                    <h5 className="text-[10px] font-extrabold text-stone-200 truncate">Golden Kolo Blend</h5>
                    <span className="text-[9px] text-amber-400 font-mono font-black">450 ETB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick specifications / Shipping details summary */}
            <div className="border-t border-neutral-900 pt-4">
              <ShippingDetails price={product.discountPrice || product.price} />
            </div>

          </div>

          {/* ==================== FOOTER PURCHASE CONTROLS ==================== */}
          <div className="border-t border-neutral-900 pt-4 mt-6 space-y-3">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 bg-red-950/20 text-red-400 border border-red-500/10 p-3 rounded-xl text-xs justify-center font-semibold">
                <ShieldAlert className="w-4.5 h-4.5 animate-pulse" />
                <span>Selected Variant is currently OUT OF STOCK</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Quantity adjuster */}
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[8.5px] font-black text-stone-500 uppercase tracking-wider font-mono">Qty</span>
                  <div className="flex items-center bg-neutral-900 border border-neutral-850 rounded-xl px-1 py-0.5">
                    <button
                      id="dec-qty-btn"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-7 h-7 rounded-lg hover:bg-neutral-850 text-stone-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span id="qty-display" className="w-6 text-center text-xs font-black text-stone-200">{quantity}</span>
                    <button
                      id="inc-qty-btn"
                      onClick={handleIncrement}
                      disabled={quantity >= maxAvailable}
                      className="w-7 h-7 rounded-lg hover:bg-neutral-850 text-stone-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Purchase CTAs */}
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <button
                    id="add-to-cart-cta-btn"
                    onClick={() => onAddToCart(product.id, quantity, selectedVariantId)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 fill-current" />
                    <span>Add to Basket</span>
                  </button>

                  <button
                    id="buy-now-cta-btn"
                    onClick={() => {
                      onAddToCart(product.id, quantity, selectedVariantId);
                      alert(lang === 'en' ? '🛒 Items added to cart! Proceeding to fast secure escrow checkout...' : '🛒 እቃው ወደ ጋሪ ታክሏል! ወደ ክፍያ ዋስትና መክፈያ በመሸጋገር ላይ...');
                    }}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 active:scale-95 text-neutral-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Auxiliary actions: Wishlist, Chat */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="wishlist-detail-btn"
                onClick={() => onToggleWishlist(product.id)}
                className={`py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                  isWishlisted
                    ? 'bg-red-500/10 border-red-500/30 text-red-450'
                    : 'bg-neutral-900 border-neutral-850 text-stone-400 hover:border-stone-700 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-red-500 animate-pulse' : ''}`} />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
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
                <span>💬 Contact Support</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
