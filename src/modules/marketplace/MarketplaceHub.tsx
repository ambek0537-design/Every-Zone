import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, SlidersHorizontal, ShoppingCart, Heart, Store, Users, 
  TrendingUp, HelpCircle, Plus, AlertTriangle, RefreshCw, BarChart3, Package, DollarSign, Sparkles, Filter, X, QrCode, Camera,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoriesList } from './categories/CategoriesList';
import { BrandsGrid } from './brands/BrandsGrid';
import { FilterSidebar } from './search/FilterSidebar';
import { ProductCard } from './products/ProductCard';
import { ProductDetailModal } from './products/ProductDetailModal';
import { CartDrawer } from './cart/CartDrawer';
import { WishlistDrawer } from './wishlist/WishlistDrawer';
import { InventoryManager } from './inventory/InventoryManager';
import { 
  EZButton, EZCard, EZInput, EZSearchBar, EZBadge, EZSkeleton, EZTokens 
} from '../../components/DesignSystem';

interface MarketplaceHubProps {
  currentUserId?: string;
  isDarkMode?: boolean;
  lang?: string;
  onViewVendorProfile?: (vendorId: string) => void;
  onSelectListing?: (listing: any) => void;
  onSelectProduct?: (product: any) => void;
  onToggleVoiceWelcome?: () => void;
  isPlayingVoice?: boolean;
}

export const MarketplaceHub: React.FC<MarketplaceHubProps> = ({
  currentUserId = "u-2", // Default to Selamawit Tekle (Buyer)
  isDarkMode = true,
  lang = 'en',
  onViewVendorProfile,
  onSelectListing,
  onSelectProduct,
  onToggleVoiceWelcome,
  isPlayingVoice = false
}) => {
  // Navigation / Mode Switcher State
  const [hubMode, setHubMode] = useState<'buyer' | 'merchant'>('buyer');

  // --- Recently viewed / Continue Browsing list ---
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('ez_recently_viewed_v3');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('ez_recently_viewed_v3');
        if (stored) {
          setRecentlyViewed(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('ez_recently_viewed_updated', handleUpdate);
    return () => window.removeEventListener('ez_recently_viewed_updated', handleUpdate);
  }, []);

  const aiRecommendationHeading = useMemo(() => {
    if (recentlyViewed.length > 0) {
      const firstJob = recentlyViewed.find(x => x.type === 'agencies');
      if (firstJob) {
        return lang === 'am' 
          ? `በዱባይ ስራ ፍላጎትዎ መሰረት... (Because you viewed Dubai jobs)`
          : `Because you viewed Dubai jobs…`;
      }
      const firstPhone = recentlyViewed.find(x => x.title?.toLowerCase().includes('phone') || x.title?.toLowerCase().includes('iphone'));
      if (firstPhone) {
        return lang === 'am'
          ? `የ iPhone ፍላጎትዎን መሰረት በማድረግ... (Because you searched iPhone)`
          : `Because you searched iPhone…`;
      }
      const firstHouse = recentlyViewed.find(x => x.type === 'houses');
      if (firstHouse) {
        return lang === 'am'
          ? `የአዲስ አበባ ቤቶች ፍላጎትዎ መሰረት... (Based on your interest in Addis housing)`
          : `Based on your interest in Addis housing…`;
      }
    }
    return lang === 'am' 
      ? `በእርስዎ ፍላጎት ላይ የተመረጡ... (Based on your interests)`
      : `Based on your interests…`;
  }, [recentlyViewed, lang]);



  // Core Data Lists
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  // Selected Entities
  const [activeProductSlug, setActiveProductSlug] = useState<string | null>(null);
  const [activeProductDetail, setActiveProductDetail] = useState<any | null>(null);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [availability, setAvailability] = useState('all');
  const [featured, setFeatured] = useState(false);
  const [newArrivals, setNewArrivals] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Drawers Visibility
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  // Vendor / Merchant Hub states
  const [merchantVendorId, setMerchantVendorId] = useState('v-2'); // default to Makeda Specialty Coffee (Active Vendor)
  const [vendorDashboard, setVendorDashboard] = useState<any | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [merchantTab, setMerchantTab] = useState<'listings' | 'inventory'>('listings');

  // Toast System state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- Every-zone Premium Shop states ---
  const [activeSlide, setActiveSlide] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 44, seconds: 18 });
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const cached = localStorage.getItem('ez_wallet_balance');
    return cached ? Number(cached) : 5400;
  });

  // Keep wallet balance in sync with localStorage in case other modules update it
  useEffect(() => {
    const handleStorage = () => {
      const cached = localStorage.getItem('ez_wallet_balance');
      if (cached) setWalletBalance(Number(cached));
    };
    window.addEventListener('storage', handleStorage);
    // Periodically poll since iframe might change storage without dispatching storage event
    const pollInterval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(pollInterval);
    };
  }, []);

  // Flash Deals Countdown Clock Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 3, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto Slider transition timer
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Add Product Form fields
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDiscountPrice, setNewProdDiscountPrice] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdQty, setNewProdQty] = useState('');
  const [newProdCatId, setNewProdCatId] = useState('');
  const [newProdBrandId, setNewProdBrandId] = useState('');
  const [newProdCondition, setNewProdCondition] = useState('NEW');
  const [newProdImagesStr, setNewProdImagesStr] = useState('');

  // QR Scanner Simulation States
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanResult, setQrScanResult] = useState<string | null>(null);
  const [qrScannerError, setQrScannerError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [customQrPayload, setCustomQrPayload] = useState('');

  // Real Camera stream support
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [realCameraActive, setRealCameraActive] = useState(false);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (showQRScanner) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            activeStream = stream;
            setCameraStream(stream);
            setRealCameraActive(true);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((err) => {
            console.warn("Real camera access failed or was denied, using simulated live viewfinder", err);
            setRealCameraActive(false);
          });
      } else {
        setRealCameraActive(false);
      }
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setRealCameraActive(false);
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showQRScanner]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, videoRef.current]);

  // Extract unique vendors from loaded products for QR targets
  const availableVendors = useMemo(() => {
    const map = new Map();
    products.forEach(p => {
      if (p.vendor && p.vendor.id) {
        map.set(p.vendor.id, p.vendor);
      }
    });
    return Array.from(map.values()).slice(0, 3);
  }, [products]);

  const handleScanValue = (value: string) => {
    setIsScanning(true);
    setQrScannerError(null);
    setQrScanResult(value);
    
    // Simulate parsing delay
    setTimeout(() => {
      setIsScanning(false);
      const trimmedVal = value.trim();
      
      const saveToScanHistory = (item: { id: string; type: 'product' | 'vendor'; title: string; subtitle: string; image?: string; color?: string; txt?: string; productData?: any; vendorId?: string }) => {
        try {
          const saved = localStorage.getItem('ez_scan_history');
          let list: any[] = [];
          if (saved) {
            list = JSON.parse(saved);
          }
          list = list.filter(x => !(x.id === item.id && x.type === item.type));
          list.unshift({ ...item, timestamp: Date.now() });
          list = list.slice(0, 5);
          localStorage.setItem('ez_scan_history', JSON.stringify(list));
        } catch (e) {
          console.error("Failed to save scan history", e);
        }
      };

      const vendorsList = [
        { id: 'v1', nameEn: 'Makeda Royal Weaving', nameAm: 'ማከዳ አልባሳት (Weaving)', color: 'bg-amber-600', txt: "MRW" },
        { id: 'v2', nameEn: 'Makeda Specialty Coffee', nameAm: 'ማከዳ ቡና (Coffee)', color: 'bg-amber-900', txt: "KHC" },
        { id: 'v3', nameEn: 'Zewditu Genuine Leather', nameAm: 'ዘውዲቱ የቆዳ ውጤቶች (Leather)', color: 'bg-stone-850', txt: "ZGL" },
        { id: 'v4', nameEn: 'Bole Atlas Heights Real Estate', nameAm: 'ቦሌ አትላስ ሪል እስቴት (Bole)', color: 'bg-teal-900', txt: "ABP" },
        { id: 'v5', nameEn: 'CMC Ambassador Villa Rentals', nameAm: 'ሲኤምሲ አምባሳደር ቪላ (CMC)', color: 'bg-slate-900', txt: "APRE" },
        { id: 'v6', nameEn: 'Sarbet Commercial Corner', nameAm: 'ሳርቤት ኮሜርሻል (Sarbet)', color: 'bg-[#1E3A1A]', txt: "YLC" },
        { id: 'v7', nameEn: 'Dubai Hotel Chef Placement', nameAm: 'ዱባይ ሆቴል ቅጥር (Dubai)', color: 'bg-blue-900', txt: "GIP" },
        { id: 'v8', nameEn: 'Warsaw Construction Recruitment', nameAm: 'ዋርሶ ኮንስትራክሽን (Warsaw)', color: 'bg-emerald-900', txt: "HAE" }
      ];

      // Let's find matched items
      const matchedProduct = products.find(p => p.slug === trimmedVal || p.id === trimmedVal || p.title.toLowerCase() === trimmedVal.toLowerCase());
      const matchedVendor = products.find(p => p.vendor && (p.vendor.id === trimmedVal || p.vendor.id.replace('-', '') === trimmedVal || p.vendor.shopName.toLowerCase() === trimmedVal.toLowerCase()));
      
      if (matchedProduct) {
        showToast(lang === 'en' ? `🎉 Found scanned product: ${matchedProduct.title}` : `🎉 የተገኘ የታኘ ዕቃ: ${matchedProduct.title}`);
        saveToScanHistory({
          id: matchedProduct.id,
          type: 'product',
          title: matchedProduct.title,
          subtitle: `${matchedProduct.price.toLocaleString()} ETB`,
          image: matchedProduct.imageUrl,
          productData: matchedProduct
        });
        setActiveProductSlug(matchedProduct.slug);
        setShowQRScanner(false);
      } else if (matchedVendor && matchedVendor.vendor) {
        showToast(lang === 'en' ? `🎉 Found scanned vendor: ${matchedVendor.vendor.shopName}` : `🎉 የተገኘ የታኘ ነጋዴ: ${matchedVendor.vendor.shopName}`);
        saveToScanHistory({
          id: matchedVendor.vendor.id,
          type: 'vendor',
          title: matchedVendor.vendor.shopName,
          subtitle: lang === 'en' ? 'Verified Escrow Merchant' : 'የተረጋገጠ የክፍያ ዋስትና ነጋዴ',
          image: matchedVendor.vendor.logoUrl || undefined,
          vendorId: matchedVendor.vendor.id
        });
        if (onViewVendorProfile) {
          onViewVendorProfile(matchedVendor.vendor.id);
        }
        setShowQRScanner(false);
      } else {
        // Specific format check for vendor IDs
        if (trimmedVal.startsWith('v-') || trimmedVal.match(/^v\d+$/)) {
          const vId = trimmedVal.includes('-') ? trimmedVal : `v-${trimmedVal.substring(1)}`;
          showToast(lang === 'en' ? '🎉 Opened Scanned Vendor Profile!' : '🎉 የነጋዴ ፕሮፋይል ተከፍቷል!');
          
          const normalizedId = vId.replace('-', '');
          const found = vendorsList.find(v => v.id === normalizedId);
          saveToScanHistory({
            id: vId,
            type: 'vendor',
            title: found ? (lang === 'en' ? found.nameEn : found.nameAm) : `Vendor ${vId}`,
            subtitle: lang === 'en' ? 'Verified Escrow Merchant' : 'የተረጋገጠ የክፍያ ዋስትና ነጋዴ',
            color: found?.color || 'bg-neutral-700',
            txt: found?.txt || 'VND',
            vendorId: vId
          });

          if (onViewVendorProfile) {
            onViewVendorProfile(vId);
          }
          setShowQRScanner(false);
        } else {
          // Instead of fallback search query, report that the item was not found among our active merchants
          const errMsg = lang === 'en' 
            ? `⚠️ Scanned item "${trimmedVal}" not found on active sellers' inventories!` 
            : `⚠️ የቀረበው ዕቃ/ነጋዴ "${trimmedVal}" በንቁ ሻጮች ዝርዝር ውስጥ አልተገኘም!`;
          setQrScannerError(errMsg);
          showToast(errMsg);
        }
      }
      setQrScanResult(null);
      setCustomQrPayload('');
    }, 1200);
  };


  // -------------------------------------------------------------
  // LIFE CYCLES & REFETCH HOOKS
  // -------------------------------------------------------------
  useEffect(() => {
    fetchMarketplaceInitialData();
    fetchCart();
    fetchWishlist();
  }, [currentUserId]);

  useEffect(() => {
    if (hubMode === 'merchant') {
      fetchVendorDashboard();
    }
  }, [hubMode, merchantVendorId, products]);

  // Fetch product detail when details slug changes
  useEffect(() => {
    if (activeProductSlug) {
      fetchProductDetail(activeProductSlug);
    } else {
      setActiveProductDetail(null);
    }
  }, [activeProductSlug]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMarketplaceInitialData = async () => {
    try {
      // 1. Fetch Categories
      const catRes = await fetch('/api/categories?activeOnly=true');
      const catData = await catRes.json();
      if (catData.status === 'success') setCategories(catData.data);

      // 2. Fetch Brands
      const bRes = await fetch('/api/brands');
      const bData = await bRes.json();
      if (bData.status === 'success') setBrands(bData.data);

      // 3. Fetch Products
      await reloadProducts();
    } catch (e) {
      console.error("Initial data loading failed:", e);
    }
  };

  const reloadProducts = async () => {
    try {
      const prodRes = await fetch('/api/products?includeDrafts=true&activeVendorOnly=true');
      const prodData = await prodRes.json();
      if (prodData.status === 'success') {
        setProducts(prodData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart?userId=${currentUserId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setCartItems(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`/api/wishlist?userId=${currentUserId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setWishlistProducts(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProductDetail = async (slug: string) => {
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      if (data.status === 'success') {
        setActiveProductDetail(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVendorDashboard = async () => {
    try {
      const res = await fetch(`/api/vendor-dashboard/${merchantVendorId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setVendorDashboard(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // CUSTOMER (BUYER) ACTIONS
  // -------------------------------------------------------------
  const handleAddToCart = async (productId: string, quantity: number = 1, variantId: string | null = null) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, productId, quantity, variantId })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast("Added item securely to your shopping cart!");
        fetchCart();
      }
    } catch (err) {
      showToast("Failed to add to cart.", "error");
    }
  };

  const handleUpdateCartQty = async (productId: string, delta: number, variantId: string | null = null) => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, productId, quantity: delta, variantId })
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveCartItem = async (productId: string, variantId: string | null = null) => {
    // Setting delta to a large negative number wipes it out
    try {
      await handleUpdateCartQty(productId, -999, variantId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, productId })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast(data.added ? "Saved to your wishlist!" : "Removed from your wishlist.");
        fetchWishlist();
      }
    } catch (err) {
      showToast("Failed to adjust wishlist.", "error");
    }
  };

  // -------------------------------------------------------------
  // MERCHANT / VENDOR ACTIONS
  // -------------------------------------------------------------
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle || !newProdPrice || !newProdQty || !newProdCatId || !newProdSku) {
      showToast("Please fill in all mandatory product fields.", "error");
      return;
    }

    const imgArray = newProdImagesStr 
      ? newProdImagesStr.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    try {
      const slug = newProdTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: merchantVendorId,
          categoryId: newProdCatId,
          brandId: newProdBrandId || null,
          title: newProdTitle,
          slug,
          description: newProdDesc,
          sku: newProdSku,
          price: Number(newProdPrice),
          discountPrice: newProdDiscountPrice ? Number(newProdDiscountPrice) : null,
          quantity: Number(newProdQty),
          condition: newProdCondition,
          imageUrls: imgArray
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast("Product listing published successfully!");
        setShowAddProductModal(false);
        
        // Reset inputs
        setNewProdTitle('');
        setNewProdPrice('');
        setNewProdDiscountPrice('');
        setNewProdSku('');
        setNewProdDesc('');
        setNewProdQty('');
        setNewProdCatId('');
        setNewProdBrandId('');
        setNewProdImagesStr('');

        await reloadProducts();
      } else {
        showToast(data.error || "Failed to create product listing.", "error");
      }
    } catch (err) {
      showToast("Network failure listing product.", "error");
    }
  };

  const handleUpdateProductStatus = async (productId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast(`Listing status updated to ${newStatus}.`);
        await reloadProducts();
      }
    } catch (err) {
      showToast("Failed to update status.", "error");
    }
  };

  const handleReplenishInventory = async (productId: string, finalQty: number, reason: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quantity: finalQty,
          changeReason: reason
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast("Stock inventory replenished and logged successfully.");
        await reloadProducts();
      }
    } catch (err) {
      showToast("Inventory replenishment failed.", "error");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setSelectedBrandId(null);
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating(null);
    setAvailability('all');
    setFeatured(false);
    setNewArrivals(false);
  };

  // -------------------------------------------------------------
  // FILTER ENGINE (CLIENT-SIDE EXTRA SAFETY LAYER)
  // -------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // 1. Keyword search (title / description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const inTitle = prod.title?.toLowerCase().includes(query);
        const inDesc = prod.description?.toLowerCase().includes(query);
        const inSku = prod.sku?.toLowerCase().includes(query);
        if (!inTitle && !inDesc && !inSku) return false;
      }

      // 2. Category selection
      if (selectedCategoryId && prod.categoryId !== selectedCategoryId) return false;

      // 3. Brand selection
      if (selectedBrandId && prod.brandId !== selectedBrandId) return false;

      // 4. Min Price limits
      if (minPrice && Number(prod.price) < Number(minPrice)) return false;

      // 5. Max Price limits
      if (maxPrice && Number(prod.price) > Number(maxPrice)) return false;

      // 6. Average Rating
      if (selectedRating && prod.averageRating < selectedRating) return false;

      // 7. Availability stock filter
      if (availability === 'instock' && (prod.quantity <= 0 || prod.status === 'OUT_OF_STOCK')) return false;
      if (availability === 'outofstock' && prod.quantity > 0 && prod.status !== 'OUT_OF_STOCK') return false;

      // 8. Featured Products
      if (featured && !prod.featured) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategoryId, selectedBrandId, minPrice, maxPrice, selectedRating, availability, featured]);

  // Is product wishlisted checks
  const wishlistIds = useMemo(() => {
    return wishlistProducts.map(p => p.id);
  }, [wishlistProducts]);

  // Low stock alert products (merchant view)
  const lowStockCount = useMemo(() => {
    return products.filter(p => p.vendorId === merchantVendorId && p.quantity > 0 && p.quantity <= 5).length;
  }, [products, merchantVendorId]);

  return (
    <div id="marketplace-hub" className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-stone-300">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-neutral-900 border-emerald-500/20 text-emerald-400'
                : 'bg-neutral-900 border-red-500/20 text-red-400'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EMBROIDERY DECORATIVE DIVIDER FOR VISUAL COHESION - Removed per request */}

      {/* ========================================================= */}
      {/* 1. CUSTOMER SHOPPING BROWSER MODULE                       */}
      {/* ========================================================= */}
      {hubMode === 'buyer' && (
        <div id="buyer-browse-view" className="space-y-8 animate-fade-in pb-12">
          
          {/* PREMIUM TOP APP BAR */}
          <div className="bg-[#111115]/95 border border-zinc-800/80 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl shadow-black/80 backdrop-blur-md">
            
            {/* Elegant Logo with gold crown */}
            <div className="flex items-center gap-3 self-start md:self-auto select-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#916E2E] via-[#C5A059] to-[#E2B755] flex items-center justify-center shadow-lg shadow-[#C5A059]/15">
                <span className="text-zinc-950 font-black text-xl">✦</span>
              </div>
              <div>
                <h2 className="text-md font-black tracking-widest text-[#E2B755] uppercase leading-tight font-sans">
                  EVERY-ZONE
                </h2>
                <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">
                  Luxury Marketplace
                </p>
              </div>
            </div>

            {/* Global Search Bar (Amazon + Shein Style) */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-3.5 text-[#C5A059] w-4.5 h-4.5" />
              <input
                id="search-input"
                type="text"
                placeholder={lang === 'en' ? "Search artisanal garments, organic coffee, tech..." : "ዕቃዎችን ወይም ሱቆችን እዚህ ይፈልጉ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-[#C5A059]/60 rounded-2xl py-3 pl-11 pr-24 text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-all shadow-inner font-medium"
              />
              <div className="absolute right-3.5 top-2.5 flex items-center gap-2">
                {searchQuery && (
                  <button
                    id="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    className="text-stone-500 hover:text-white p-1 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  id="qr-scanner-open-btn"
                  onClick={() => setShowQRScanner(true)}
                  className="text-[#E2B755] hover:brightness-110 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow"
                  title={lang === 'en' ? "Contactless Scan" : "QR ቃኝ"}
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Wallet Balance, Wishlist & Basket Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {onToggleVoiceWelcome && (
                <button
                  id="marketplace-voice-guide-btn"
                  type="button"
                  onClick={onToggleVoiceWelcome}
                  title={lang === 'en' ? "Play/Stop Voice Guide Assistant" : "የድምፅ ረዳት ይጫወቱ ወይም ያቁሙ"}
                  className={`p-2.5 rounded-2xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                    isPlayingVoice 
                      ? 'bg-emerald-500 border-emerald-600 text-white animate-pulse scale-105' 
                      : 'bg-zinc-950 border-zinc-800 text-[#E2B755] hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <Volume2 className={`w-4.5 h-4.5 ${isPlayingVoice ? "animate-bounce" : ""}`} />
                </button>
              )}

              <button
                id="toggle-wishlist-btn"
                onClick={() => setShowWishlist(true)}
                className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 p-2.5 rounded-2xl text-stone-300 flex items-center justify-center cursor-pointer transition relative hover:scale-105 active:scale-95 shadow-md"
                title="Wishlist"
              >
                <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500/20" />
                {wishlistProducts.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-neutral-950 font-black font-mono">
                    {wishlistProducts.length}
                  </span>
                )}
              </button>

              <button
                id="toggle-cart-btn"
                onClick={() => setShowCart(true)}
                className="bg-gradient-to-br from-[#916E2E] via-[#C5A059] to-[#E2B755] text-zinc-950 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition shadow-lg shadow-[#C5A059]/10 hover:brightness-110 hover:scale-105 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Basket</span>
                {cartItems.length > 0 && (
                  <span className="bg-zinc-950 text-[#E2B755] text-[9.5px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold font-mono border border-[#C5A059]/30">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DYNAMIC CATEGORY CHIPS */}
          <div className="bg-[#111115]/40 border border-zinc-900/60 rounded-3xl p-1 px-4 shadow-sm">
            <CategoriesList
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={(catId, customQuery) => {
                setSelectedCategoryId(catId);
                if (customQuery) {
                  setSearchQuery(customQuery);
                } else if (catId === null) {
                  setSearchQuery('');
                }
              }}
            />
          </div>

          {/* FEATURED BANNER LARGE AUTO SLIDER (Apple + Shein Style) */}
          <div className="relative h-[220px] sm:h-[280px] w-full bg-zinc-950 rounded-[28px] overflow-hidden border border-zinc-800/60 shadow-2xl">
            {/* Auto slide renders */}
            {activeSlide === 0 && (
              <div className="absolute inset-0 transition-all duration-700 ease-in-out flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
                  alt="Slide 1" 
                  className="absolute inset-0 w-full h-full object-cover opacity-45 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
                <div className="relative z-10 px-6 sm:px-12 max-w-lg space-y-3">
                  <span className="bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E2B755] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    ✦ The Emperor Collection
                  </span>
                  <h1 className="text-xl sm:text-3xl font-black text-stone-100 tracking-tight leading-tight">
                    Traditional Ethiopian Couture Reimagined
                  </h1>
                  <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed max-w-sm">
                    Exquisite hand-woven Habesha Kemis and premium tilet detailing for standard gala event wear. Fully custom tailored.
                  </p>
                  <button 
                    onClick={() => { setSelectedCategoryId('cat-1'); }}
                    className="bg-[#C5A059] hover:bg-[#E2B755] text-zinc-950 text-[10px] font-black tracking-widest uppercase py-2.5 px-5 rounded-xl cursor-pointer transition shadow-md active:scale-95"
                  >
                    Examine Catalog
                  </button>
                </div>
              </div>
            )}

            {activeSlide === 1 && (
              <div className="absolute inset-0 transition-all duration-700 ease-in-out flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200" 
                  alt="Slide 2" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
                <div className="relative z-10 px-6 sm:px-12 max-w-lg space-y-3">
                  <span className="bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E2B755] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    ✦ High Tech Studio
                  </span>
                  <h1 className="text-xl sm:text-3xl font-black text-stone-100 tracking-tight leading-tight">
                    Smart Sound Acoustics
                  </h1>
                  <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed max-w-sm">
                    Immersive spatial audio gear with active noise cancelling. Secure payment & fast delivery via Every-zone partners.
                  </p>
                  <button 
                    onClick={() => { setSelectedCategoryId('cat-2'); }}
                    className="bg-[#C5A059] hover:bg-[#E2B755] text-zinc-950 text-[10px] font-black tracking-widest uppercase py-2.5 px-5 rounded-xl cursor-pointer transition shadow-md active:scale-95"
                  >
                    Browse Tech
                  </button>
                </div>
              </div>
            )}

            {activeSlide === 2 && (
              <div className="absolute inset-0 transition-all duration-700 ease-in-out flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Slide 3" 
                  className="absolute inset-0 w-full h-full object-cover opacity-45 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
                <div className="relative z-10 px-6 sm:px-12 max-w-lg space-y-3">
                  <span className="bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E2B755] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    ✦ Harar Specialty Gold
                  </span>
                  <h1 className="text-xl sm:text-3xl font-black text-stone-100 tracking-tight leading-tight">
                    Original organic Arabica Selection
                  </h1>
                  <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed max-w-sm">
                    Rich, honey-washed single origin coffee beans direct from certified farm cooperatives in Yirgacheffe and Sidamo.
                  </p>
                  <button 
                    onClick={() => { setSelectedCategoryId('cat-3'); }}
                    className="bg-[#C5A059] hover:bg-[#E2B755] text-zinc-950 text-[10px] font-black tracking-widest uppercase py-2.5 px-5 rounded-xl cursor-pointer transition shadow-md active:scale-95"
                  >
                    Collect Roast
                  </button>
                </div>
              </div>
            )}

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-6 sm:left-12 flex gap-2 z-20">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'bg-[#E2B755] w-7' : 'bg-stone-600/60 hover:bg-stone-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CONTINUE BROWSING (Horizontal Cards Section) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">✦</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-200">
                  {lang === 'en' ? "Continue Browsing" : "ቀጥል ማሰስ"}
                </h3>
              </div>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
                {lang === 'en' ? "Your History" : "ታሪክዎ"}
              </span>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {recentlyViewed.length > 0 ? (
                recentlyViewed.map((item, idx) => (
                  <motion.div
                    key={item.id + '-' + idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (item.type === 'shop' && onSelectProduct) {
                        onSelectProduct(item.raw || item);
                      } else if ((item.type === 'houses' || item.type === 'agencies') && onSelectListing) {
                        onSelectListing(item.raw || item);
                      }
                    }}
                    className="min-w-[260px] max-w-[280px] bg-[#131316]/70 border border-zinc-850 rounded-2xl p-3 flex items-center gap-3 shadow-md hover:border-[#C5A059]/30 transition-all cursor-pointer shrink-0"
                  >
                    <div className="w-16 h-16 rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800 shrink-0">
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200"} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] bg-zinc-900 border border-zinc-800 px-1 py-0.2 rounded text-amber-500 font-bold uppercase font-mono">
                          {item.type === 'shop' ? 'Shop' : item.type === 'houses' ? 'House' : 'Job'}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-bold text-stone-300 truncate mt-1">
                        {lang === 'en' ? item.title : item.titleAm || item.title}
                      </h4>
                      <p className="text-[10px] text-[#C5A059] font-black mt-0.5">
                        {lang === 'en' ? item.price : item.priceAm || item.price}
                      </p>
                      <span className="text-[8.5px] text-stone-500 block truncate font-mono">
                        {lang === 'en' ? item.location : item.locationAm || item.location}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                /* Beautiful design fallback if no history exists yet */
                <>
                  <div className="min-w-[260px] max-w-[280px] bg-[#131316]/40 border border-zinc-850/50 rounded-2xl p-3 flex items-center gap-3 opacity-60">
                    <div className="w-16 h-16 rounded-xl bg-zinc-950/60 border border-zinc-850 shrink-0 flex items-center justify-center text-stone-600 font-mono text-xs">
                      ☕
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11px] font-bold text-stone-500 truncate">No history yet</h4>
                      <p className="text-[10px] text-stone-600 font-black mt-1">Browse items to fill</p>
                      <span className="text-[8.5px] text-stone-600 block mt-0.5 font-mono">Every-zone Smart Sync</span>
                    </div>
                  </div>
                  <div className="min-w-[260px] max-w-[280px] bg-[#131316]/40 border border-zinc-850/50 rounded-2xl p-3 flex items-center gap-3 opacity-60">
                    <div className="w-16 h-16 rounded-xl bg-zinc-950/60 border border-zinc-850 shrink-0 flex items-center justify-center text-stone-600 font-mono text-xs">
                      🏡
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11px] font-bold text-stone-500 truncate">No real estate viewed</h4>
                      <p className="text-[10px] text-stone-600 font-black mt-1">Select a villa or condo</p>
                      <span className="text-[8.5px] text-stone-600 block mt-0.5 font-mono">Every-zone Smart Sync</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* POPULAR NEAR YOU (Horizontal Scrolling Grid with exact geolocation proximity) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">📍</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-200">
                  {lang === 'en' ? "Popular Near You" : "በአቅራቢያዎ ተወዳጅ"}
                </h3>
              </div>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-amber-500 font-extrabold font-mono">
                Bole, Addis Ababa
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {products.slice(0, 4).map((p, idx) => {
                const distance = ["0.8 km", "1.2 km", "2.1 km", "3.0 km"][idx % 4];
                return (
                  <div 
                    key={p.id}
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(p);
                      } else {
                        setActiveProductSlug(p.slug);
                      }
                    }}
                    className="bg-[#131316]/60 border border-zinc-850 hover:border-[#C5A059]/30 p-2.5 rounded-2xl transition-all shadow-lg cursor-pointer group"
                  >
                    <div className="aspect-[4/3] w-full bg-zinc-950 rounded-xl overflow-hidden relative border border-zinc-900">
                      <img 
                        src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/85 backdrop-blur-md border border-[#C5A059]/35 text-[#E2B755] text-[8.5px] font-black px-2 py-0.5 rounded-md font-mono">
                        {distance}
                      </span>
                    </div>
                    <div className="mt-2 text-left">
                      <h4 className="text-[11px] font-bold text-stone-300 truncate leading-snug">{lang === 'en' ? p.title : p.titleAm || p.title}</h4>
                      <p className="text-[10px] text-[#C5A059] font-black mt-0.5">{(p.discountPrice || p.price).toLocaleString()} ETB</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECOMMENDED FOR YOU (AI Section - Luxury styled with dynamic context-aware headers) */}
          <div className="bg-gradient-to-r from-zinc-950 via-[#191510] to-zinc-950 border border-[#C5A059]/20 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C5A059]/10 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#E2B755] animate-pulse">✦</span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#E2B755] font-mono">
                    {lang === 'en' ? "AI Curated Matching" : "በአይ የተመረጠ ተዛማጅ"}
                  </h3>
                </div>
                <h4 className="text-md sm:text-lg font-black text-stone-100 tracking-tight leading-none">
                  {aiRecommendationHeading}
                </h4>
              </div>
              <span className="text-[10px] bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E2B755] px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 self-start sm:self-auto font-mono">
                Neural Match Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* AI Match Product 1 */}
              <div 
                onClick={() => {
                  const match = products.find(p => p.id === 'prod-2') || products[0];
                  if (match && onSelectProduct) onSelectProduct(match);
                }}
                className="bg-[#111114]/90 border border-zinc-850 hover:border-[#C5A059]/30 p-3.5 rounded-2xl flex gap-3.5 cursor-pointer group"
              >
                <div className="w-20 h-20 bg-zinc-950 rounded-xl overflow-hidden shrink-0 relative border border-zinc-900">
                  <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200" alt="Curated 1" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                  <span className="absolute top-1.5 left-1.5 bg-[#C5A059] text-zinc-950 text-[8px] font-black px-1.5 py-0.2 rounded font-mono">
                    98% AFFINITY
                  </span>
                </div>
                <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h5 className="text-[11px] font-black text-[#E2B755] uppercase tracking-wider">Premium Habesha</h5>
                    <h4 className="text-xs font-bold text-stone-200 truncate leading-snug group-hover:text-[#E2B755] transition">Empress Tilet Gown Suite</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-100">14,500 ETB</span>
                    <span className="text-[9px] text-emerald-400 font-bold">Fast Escrow</span>
                  </div>
                </div>
              </div>

              {/* AI Match Product 2 */}
              <div 
                onClick={() => {
                  const match = products.find(p => p.id === 'prod-3') || products[1];
                  if (match && onSelectProduct) onSelectProduct(match);
                }}
                className="bg-[#111114]/90 border border-zinc-850 hover:border-[#C5A059]/30 p-3.5 rounded-2xl flex gap-3.5 cursor-pointer group"
              >
                <div className="w-20 h-20 bg-zinc-950 rounded-xl overflow-hidden shrink-0 relative border border-zinc-900">
                  <img src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=200" alt="Curated 2" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                  <span className="absolute top-1.5 left-1.5 bg-[#C5A059] text-zinc-950 text-[8px] font-black px-1.5 py-0.2 rounded font-mono">
                    94% AFFINITY
                  </span>
                </div>
                <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h5 className="text-[11px] font-black text-[#E2B755] uppercase tracking-wider">Bespoke Brew</h5>
                    <h4 className="text-xs font-bold text-stone-200 truncate leading-snug group-hover:text-[#E2B755] transition">Specialty Yirgacheffe Dark Roast</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-100">950 ETB</span>
                    <span className="text-[9px] text-[#C5A059] font-bold">Gold Medal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FLASH DEALS (Countdown Timer Section) */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#916E2E]/10 via-zinc-950 to-zinc-950 border border-[#C5A059]/35 rounded-[22px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center border border-[#C5A059]/45 text-[#E2B755]">
                  ⏱
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black text-stone-100 uppercase tracking-wider">FLASH SALES</h3>
                  <p className="text-[10px] text-stone-400">Exclusive limited quantity markdowns.</p>
                </div>
              </div>

              {/* Ticking Countdown clock */}
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[9px] text-[#C5A059] font-black uppercase tracking-widest mr-1.5">ENDS IN</span>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-black text-stone-200 shadow shadow-black">
                  {String(countdown.hours).padStart(2, '0')}h
                </div>
                <span className="text-[#C5A059] font-black">:</span>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-black text-[#E2B755] shadow shadow-black animate-pulse">
                  {String(countdown.minutes).padStart(2, '0')}m
                </div>
                <span className="text-[#C5A059] font-black">:</span>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-black text-stone-200 shadow shadow-black">
                  {String(countdown.seconds).padStart(2, '0')}s
                </div>
              </div>
            </div>

            {/* Flash Deals product cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {products.slice(0, 4).map((p, idx) => {
                const promoPrice = Math.round(p.price * 0.6); // 40% OFF
                return (
                  <div 
                    key={`flash-${p.id}`}
                    onClick={() => setActiveProductSlug(p.slug)}
                    className="bg-[#131316]/50 border border-zinc-850 hover:border-[#C5A059]/30 rounded-2xl overflow-hidden p-3 transition-all relative group cursor-pointer shadow-md"
                  >
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm tracking-wider">
                      40% OFF
                    </span>
                    <div className="aspect-square w-full rounded-xl bg-zinc-950 overflow-hidden border border-zinc-900">
                      <img src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'} alt={p.title} className="w-full h-full object-cover group-hover:scale-102 transition" />
                    </div>
                    <div className="mt-2.5 space-y-1">
                      <h4 className="text-[11px] font-bold text-stone-300 truncate">{p.title}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-red-500">{promoPrice.toLocaleString()} ETB</span>
                        <span className="text-[9px] text-stone-500 line-through">{p.price.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOP RATED VENDORS (Horizontal Scroll of Shops) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">🏪</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-200">
                  Top Rated Vendors
                </h3>
              </div>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                Certified Shops
              </span>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {/* Vendor Card 1 */}
              <div 
                onClick={() => onViewVendorProfile && onViewVendorProfile('v-2')}
                className="min-w-[280px] bg-gradient-to-br from-zinc-900 to-[#161310] border border-zinc-800/80 hover:border-[#C5A059]/40 p-4 rounded-2xl flex flex-col justify-between shadow-lg cursor-pointer group transition duration-350"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800 shrink-0 relative flex items-center justify-center text-[#E2B755] font-black text-lg shadow">
                    ☕
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-stone-100 group-hover:text-[#E2B755] transition">Makeda Specialty Coffee</h4>
                      <span className="text-[#E2B755] text-[9px] font-bold" title="Gold Star Merchant">★</span>
                    </div>
                    <p className="text-[10px] text-[#C5A059] font-semibold mt-0.5 font-mono">12.4k Followers • 99% Score</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/60">
                  <span className="text-[9px] bg-[#C5A059]/15 text-[#E2B755] px-2 py-0.5 rounded font-black font-mono">FAYDA SECURED</span>
                  <span className="text-[10px] text-stone-400 group-hover:translate-x-1 transition font-bold uppercase tracking-wider">Visit Store ➔</span>
                </div>
              </div>

              {/* Vendor Card 2 */}
              <div 
                onClick={() => onViewVendorProfile && onViewVendorProfile('v-1')}
                className="min-w-[280px] bg-gradient-to-br from-zinc-900 to-[#101316] border border-zinc-800/80 hover:border-[#C5A059]/40 p-4 rounded-2xl flex flex-col justify-between shadow-lg cursor-pointer group transition duration-350"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800 shrink-0 relative flex items-center justify-center text-[#E2B755] font-black text-lg shadow">
                    👗
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-stone-100 group-hover:text-[#E2B755] transition">Bole Habesha Premium Wear</h4>
                      <span className="text-[#E2B755] text-[9px] font-bold" title="Gold Star Merchant">★</span>
                    </div>
                    <p className="text-[10px] text-[#C5A059] font-semibold mt-0.5 font-mono">8.9k Followers • 96% Score</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/60">
                  <span className="text-[9px] bg-[#C5A059]/15 text-[#E2B755] px-2 py-0.5 rounded font-black font-mono">ESTABLISHED 2022</span>
                  <span className="text-[10px] text-stone-400 group-hover:translate-x-1 transition font-bold uppercase tracking-wider">Visit Store ➔</span>
                </div>
              </div>

              {/* Vendor Card 3 */}
              <div 
                onClick={() => {
                  alert(lang === 'en' ? "🏪 Lalibela Souvenirs: Our premium boutique store layout is loading catalog details..." : "🏪 ላሊበላ ቅርሶች፡ የሱቅ ዝርዝር መረጃዎችን በመጫን ላይ...");
                }}
                className="min-w-[280px] bg-gradient-to-br from-zinc-900 to-[#121612] border border-zinc-800/80 hover:border-[#C5A059]/40 p-4 rounded-2xl flex flex-col justify-between shadow-lg cursor-pointer group transition duration-350"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800 shrink-0 relative flex items-center justify-center text-[#E2B755] font-black text-lg shadow">
                    🏺
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-stone-100 group-hover:text-[#E2B755] transition">Lalibela Souvenirs & Crafts</h4>
                      <span className="text-[#E2B755] text-[9px] font-bold" title="Gold Star Merchant">★</span>
                    </div>
                    <p className="text-[10px] text-[#C5A059] font-semibold mt-0.5 font-mono">15.2k Followers • 98% Score</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/60">
                  <span className="text-[9px] bg-[#C5A059]/15 text-[#E2B755] px-2 py-0.5 rounded font-black font-mono">GOVERNMENT VERIFIED</span>
                  <span className="text-[10px] text-stone-400 group-hover:translate-x-1 transition font-bold uppercase tracking-wider">Visit Store ➔</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN PRODUCT BROWSER CATALOG WITH FILTERS Sidebar */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">✦</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-200">
                  Trending Products & Catalog
                </h3>
              </div>
              <button
                id="toggle-filter-sidebar-btn"
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className="bg-zinc-900 border border-zinc-800 hover:border-[#C5A059]/30 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-300 flex items-center gap-2 cursor-pointer transition shadow"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Filters {showFilterDrawer ? '(Hide)' : '(Show)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Filter sidebar */}
              <div className={`lg:col-span-1 space-y-4 ${showFilterDrawer ? 'block' : 'hidden lg:block'}`}>
                <FilterSidebar
                  minPrice={minPrice} setMinPrice={setMinPrice}
                  maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                  selectedRating={selectedRating} setSelectedRating={setSelectedRating}
                  availability={availability} setAvailability={setAvailability}
                  featured={featured} setFeatured={setFeatured}
                  newArrivals={newArrivals} setNewArrivals={setNewArrivals}
                  onClearFilters={handleClearFilters}
                />
                
                <div className="bg-[#111115]/80 border border-zinc-850 p-4 rounded-2xl">
                  <span className="text-[10px] font-black text-stone-500 uppercase font-mono block mb-2 tracking-wider">Verified Brands</span>
                  <BrandsGrid
                    brands={brands}
                    selectedBrandId={selectedBrandId}
                    onSelectBrand={setSelectedBrandId}
                  />
                </div>
              </div>

              {/* Right Products list grid */}
              <div className={`grid grid-cols-2 gap-4 ${showFilterDrawer ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                {filteredProducts.length === 0 ? (
                  <div id="no-products-view" className="col-span-full py-20 bg-zinc-950 border border-dashed border-zinc-850 rounded-3xl flex flex-col items-center justify-center text-center space-y-3.5">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-stone-600 border border-zinc-800">
                      <Filter className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-stone-300">No products match your filters</p>
                      <p className="text-xs text-stone-500 font-medium">Try adjusting your keyword searches, price limits, or category selectors.</p>
                    </div>
                    <button
                      id="reset-all-filters-btn"
                      onClick={handleClearFilters}
                      className="bg-zinc-900 hover:bg-zinc-850 text-stone-300 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isWishlisted={wishlistIds.includes(p.id)}
                      onViewDetails={() => setActiveProductSlug(p.slug)}
                      onToggleWishlist={() => handleToggleWishlist(p.id)}
                      onAddToCart={() => handleAddToCart(p.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MERCHANT / VENDOR MANAGEMENT MODULE                     */}
      {/* ========================================================= */}
      {hubMode === 'merchant' && (
        <div id="merchant-portal-view" className="space-y-6">
          
          {/* Dashboard Telemetry Cards */}
          {vendorDashboard && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-500 uppercase font-mono flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Revenue</span>
                </span>
                <span className="text-lg font-black text-stone-100 mt-2">
                  {vendorDashboard.telemetry.totalRevenue.toLocaleString()} <span className="text-xs font-normal text-stone-400">ETB</span>
                </span>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-500 uppercase font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>Units Sold</span>
                </span>
                <span className="text-lg font-black text-stone-100 mt-2">
                  {vendorDashboard.telemetry.totalSalesUnits} <span className="text-xs font-normal text-stone-400">Items</span>
                </span>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl flex flex-col justify-between relative">
                <span className="text-[10px] font-bold text-stone-500 uppercase font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Low Stock Warnings</span>
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-black text-stone-100">{lowStockCount}</span>
                  {lowStockCount > 0 && (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] px-1.5 py-0.2 rounded font-extrabold animate-pulse">
                      ACTION REQUIRED
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-500 uppercase font-mono flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-500" />
                  <span>Active Listings</span>
                </span>
                <span className="text-lg font-black text-stone-100 mt-2">
                  {vendorDashboard.telemetry.activeProducts} / {vendorDashboard.telemetry.totalProducts}
                </span>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-500 uppercase font-mono flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Out of Stock</span>
                </span>
                <span className="text-lg font-black text-red-400 mt-2">
                  {vendorDashboard.telemetry.outOfStockProducts} <span className="text-xs text-stone-500">listings</span>
                </span>
              </div>

            </div>
          )}

          {/* Merchant Hub sub-tabs toggler (Active products vs inventory log) */}
          <div className="flex justify-between items-center bg-neutral-900/30 border border-neutral-850 p-3.5 rounded-2xl">
            <div className="flex gap-1.5">
              <button
                id="merchant-listings-tab"
                onClick={() => setMerchantTab('listings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  merchantTab === 'listings'
                    ? 'bg-amber-500 text-neutral-950 font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                My Product Listings
              </button>
              <button
                id="merchant-inventory-tab"
                onClick={() => setMerchantTab('inventory')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  merchantTab === 'inventory'
                    ? 'bg-amber-500 text-neutral-950 font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Inventory & Audit Logs
              </button>
            </div>

            <button
              id="show-add-product-modal-btn"
              onClick={() => setShowAddProductModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List New Product</span>
            </button>
          </div>

          {/* Tab 1: Product Listings Management Table */}
          {merchantTab === 'listings' && (
            <div id="merchant-listings-table-view" className="bg-neutral-900/40 border border-neutral-850 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950 text-stone-400 border-b border-neutral-900">
                      <th className="p-3.5">Product Detail</th>
                      <th className="p-3.5">SKU / SKU Variant</th>
                      <th className="p-3.5">Price (ETB)</th>
                      <th className="p-3.5">Stock Quantity</th>
                      <th className="p-3.5">Listing Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {products.filter(p => p.vendorId === merchantVendorId).map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-900/30 transition">
                        {/* Title details */}
                        <td className="p-3.5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-900 flex-shrink-0">
                            <img
                              src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=100'}
                              alt=""
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-stone-200 block">{p.title}</span>
                            <span className="text-[10px] text-stone-500 font-mono capitalize">Condition: {p.condition}</span>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="p-3.5 font-mono text-[11px] text-stone-400">{p.sku}</td>

                        {/* Price */}
                        <td className="p-3.5 font-semibold text-stone-200">
                          {p.discountPrice ? (
                            <div>
                              <span className="text-amber-400">{p.discountPrice.toLocaleString()}</span>
                              <span className="text-[9px] text-stone-500 block line-through">{p.price.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span>{p.price.toLocaleString()}</span>
                          )}
                        </td>

                        {/* Quantity */}
                        <td className="p-3.5">
                          <span className={`font-bold font-mono ${p.quantity <= 0 ? 'text-red-400' : p.quantity <= 5 ? 'text-amber-400' : 'text-stone-300'}`}>
                            {p.quantity} Units
                          </span>
                        </td>

                        {/* Status tag */}
                        <td className="p-3.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            p.status === 'ACTIVE'
                              ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
                              : p.status === 'DRAFT'
                              ? 'bg-blue-500/15 border-blue-500/20 text-blue-400'
                              : p.status === 'OUT_OF_STOCK'
                              ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                              : 'bg-neutral-900 border-neutral-800 text-stone-500'
                          }`}>
                            {p.status}
                          </span>
                        </td>

                        {/* Row management buttons */}
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {p.status === 'DRAFT' && (
                            <button
                              id={`active-btn-${p.id}`}
                              onClick={() => handleUpdateProductStatus(p.id, 'ACTIVE')}
                              className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-neutral-950 font-bold py-1 px-2.5 rounded-lg cursor-pointer"
                            >
                              Publish Active
                            </button>
                          )}
                          {p.status === 'ACTIVE' && (
                            <button
                              id={`draft-btn-${p.id}`}
                              onClick={() => handleUpdateProductStatus(p.id, 'DRAFT')}
                              className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-neutral-950 font-bold py-1 px-2.5 rounded-lg cursor-pointer"
                            >
                              Make Draft
                            </button>
                          )}
                          {p.status !== 'ARCHIVED' && (
                            <button
                              id={`archive-btn-${p.id}`}
                              onClick={() => handleUpdateProductStatus(p.id, 'ARCHIVED')}
                              className="text-[10px] bg-neutral-900 hover:bg-red-500/10 hover:text-red-400 border border-neutral-800 font-bold py-1 px-2.5 rounded-lg cursor-pointer"
                            >
                              Archive
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Inventory replenished controls */}
          {merchantTab === 'inventory' && vendorDashboard && (
            <InventoryManager
              products={products.filter(p => p.vendorId === merchantVendorId && p.status !== 'ARCHIVED')}
              history={vendorDashboard.inventoryHistory}
              onReplenish={handleReplenishInventory}
            />
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CORE DRAWER OVERLAYS & MODALS                           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {/* Product Details overlay screen */}
        {activeProductDetail && (
          <ProductDetailModal
            product={activeProductDetail}
            isWishlisted={wishlistIds.includes(activeProductDetail.id)}
            onClose={() => setActiveProductSlug(null)}
            onToggleWishlist={() => handleToggleWishlist(activeProductDetail.id)}
            onAddToCart={(productId, qty, variantId) => {
              handleAddToCart(productId, qty, variantId);
              setActiveProductSlug(null);
            }}
            lang={lang}
            onViewVendorProfile={(vendorId) => {
              if (onViewVendorProfile) {
                onViewVendorProfile(vendorId);
              }
              setActiveProductSlug(null);
            }}
          />
        )}

        {/* Shopping Cart Drawer */}
        {showCart && (
          <CartDrawer
            items={cartItems}
            onClose={() => setShowCart(false)}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
          />
        )}

        {/* Saved Favorites Wishlist Drawer */}
        {showWishlist && (
          <WishlistDrawer
            items={wishlistProducts}
            onClose={() => setShowWishlist(false)}
            onRemoveItem={handleToggleWishlist}
            onAddToCart={(productId) => handleAddToCart(productId, 1, null)}
          />
        )}

        {/* Add Product Modal (For Merchants) */}
        {showAddProductModal && (
          <div id="add-product-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div id="add-product-modal" className="relative w-full max-w-lg bg-neutral-950 border border-neutral-850 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-4.5 border-b border-neutral-900 flex items-center justify-between">
                <span className="font-extrabold text-stone-100 text-sm">Add New Product Listing</span>
                <button
                  id="close-add-product-modal-btn"
                  onClick={() => setShowAddProductModal(false)}
                  className="text-stone-400 hover:text-white hover:bg-neutral-900 p-1 rounded-lg border border-neutral-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateProduct} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Product Title *</label>
                  <input
                    id="add-prod-title"
                    type="text"
                    value={newProdTitle}
                    onChange={(e) => setNewProdTitle(e.target.value)}
                    placeholder="e.g. Traditional Habesha Cotton Shawl"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Price (ETB) *</label>
                    <input
                      id="add-prod-price"
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="1800"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  {/* Discount Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Promo Price (ETB)</label>
                    <input
                      id="add-prod-discount-price"
                      type="number"
                      value={newProdDiscountPrice}
                      onChange={(e) => setNewProdDiscountPrice(e.target.value)}
                      placeholder="1500"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* SKU */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Product SKU *</label>
                    <input
                      id="add-prod-sku"
                      type="text"
                      value={newProdSku}
                      onChange={(e) => setNewProdSku(e.target.value)}
                      placeholder="EVZ-KEM-102"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Stock Qty *</label>
                    <input
                      id="add-prod-qty"
                      type="number"
                      value={newProdQty}
                      onChange={(e) => setNewProdQty(e.target.value)}
                      placeholder="15"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Category select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Category *</label>
                    <select
                      id="add-prod-cat"
                      value={newProdCatId}
                      onChange={(e) => setNewProdCatId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                      required
                    >
                      <option value="">-- Choose --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Brand select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Brand</label>
                    <select
                      id="add-prod-brand"
                      value={newProdBrandId}
                      onChange={(e) => setNewProdBrandId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="">-- None --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Condition selector */}
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Condition</label>
                    <div className="flex gap-2">
                      {['NEW', 'USED', 'REFURBISHED'].map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          id={`add-cond-btn-${cond}`}
                          onClick={() => setNewProdCondition(cond)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                            newProdCondition === cond
                              ? 'bg-amber-500 text-neutral-950 border-amber-500'
                              : 'bg-neutral-900 border-neutral-800 text-stone-400'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Description</label>
                  <textarea
                    id="add-prod-desc"
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Provide details about weave design, dimensions, or origin..."
                    rows={3}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Image URLs input (Comma-separated) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase font-mono tracking-wider">Image URLs (comma-separated)</label>
                  <input
                    id="add-prod-images"
                    type="text"
                    value={newProdImagesStr}
                    onChange={(e) => setNewProdImagesStr(e.target.value)}
                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  id="publish-product-btn"
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold py-3 px-4 rounded-xl text-xs transition duration-150 cursor-pointer shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-98"
                >
                  Publish Active Product Listing
                </button>

              </form>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* QR CODE SCANNER OVERLAY MODAL                            */}
        {/* ========================================================= */}
        {showQRScanner && (
          <div
            id="qr-scanner-modal-overlay"
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <style>{`
              @keyframes scan {
                0% { top: 10%; }
                50% { top: 90%; }
                100% { top: 10%; }
              }
            `}</style>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col text-stone-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-neutral-850 p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-500/10 text-amber-500 p-1.5 rounded-xl border border-amber-500/20">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-stone-100 uppercase tracking-wider font-sans">
                      {lang === 'en' ? 'Scan QR Code' : 'QR ኮድ ማንበቢያ'}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-sans">
                      {lang === 'en' ? 'Open products or vendor profiles instantly' : 'የእቃዎችን ወይም የነጋዴዎችን ገጽ ይክፈቱ'}
                    </p>
                  </div>
                </div>
                <button
                  id="close-qr-scanner-btn"
                  onClick={() => {
                    setShowQRScanner(false);
                    setQrScannerError(null);
                    setQrScanResult(null);
                    setCustomQrPayload('');
                  }}
                  className="bg-neutral-950 text-stone-400 hover:text-white border border-neutral-850 p-1.5 rounded-xl cursor-pointer transition active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Viewfinder Content */}
              <div className="p-5 space-y-5">
                
                {/* Simulated Lens Screen */}
                <div className="qr-scanner-container relative w-64 h-64 mx-auto rounded-3xl border border-neutral-800 overflow-hidden bg-neutral-950 flex flex-col items-center justify-center shadow-inner">
                  
                  {/* REAL VIDEO CAMERA or BACKDROP STREAM */}
                  {realCameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <>
                      {/* Active matrix / camera viewfinder backplate */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-950 to-emerald-950/20 z-0 opacity-80" />
                      
                      {/* Glowing focus circle indicator */}
                      <div className="absolute w-32 h-32 rounded-full border border-amber-500/20 bg-amber-500/5 animate-ping opacity-40 z-0 pointer-events-none" />
                      <div className="absolute w-48 h-48 rounded-full border border-dashed border-amber-500/10 animate-spin opacity-30 z-0 pointer-events-none" style={{ animationDuration: '10s' }} />
                      
                      {/* Scanning video sensor noise overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-0 pointer-events-none opacity-40" />
                    </>
                  )}

                  {/* Sweep scanline laser */}
                  <div className="absolute left-0 right-0 h-0.5 bg-amber-500 shadow-[0_0_12px_#f59e0b] top-0 animate-[scan_2s_ease-in-out_infinite] z-10 pointer-events-none" />
                  
                  {/* Scanner targets corner visual brackets */}
                  <div className={`absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 rounded-tl-md z-10 transition-colors duration-300 ${qrScannerError ? 'border-rose-500' : 'border-amber-500'}`} />
                  <div className={`absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 rounded-tr-md z-10 transition-colors duration-300 ${qrScannerError ? 'border-rose-500' : 'border-amber-500'}`} />
                  <div className={`absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 rounded-bl-md z-10 transition-colors duration-300 ${qrScannerError ? 'border-rose-500' : 'border-amber-500'}`} />
                  <div className={`absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 rounded-br-md z-10 transition-colors duration-300 ${qrScannerError ? 'border-rose-500' : 'border-amber-500'}`} />

                  {/* Intermittent flashing grid background */}
                  <div className="absolute inset-0 border border-neutral-850 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] z-10" />

                  {/* Simulated viewfinder target status graphics */}
                  <div className="text-center p-4 select-none pointer-events-none space-y-2 z-10">
                    {isScanning ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 block font-bold">
                          {lang === 'en' ? 'READING PAYLOAD...' : 'እያነበበ ነው...'}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Camera className={`w-10 h-10 mx-auto animate-pulse ${realCameraActive ? 'text-amber-500/80' : 'text-stone-700'}`} />
                        <span className="text-[9px] uppercase font-mono tracking-widest text-stone-350 block font-bold bg-neutral-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs border border-neutral-800">
                          {realCameraActive 
                            ? (lang === 'en' ? '📷 REAL CAMERA ONLINE' : '📷 ካሜራው በርቷል') 
                            : (lang === 'en' ? '📷 SCAN VIEWPORT ACTIVE' : '📷 የቃኚ ካሜራ እይታ ክፍት ነው')}
                        </span>
                        {qrScanResult && !qrScannerError && (
                          <div className="text-emerald-500 font-mono text-[10px] font-bold bg-neutral-950/90 px-2 py-1 rounded-md border border-emerald-500/20">
                            Detected: {qrScanResult}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* INTERACTIVE RETRY OVERLAY (Appears on failure, covers lens with clickable retry option) */}
                  {qrScannerError && (
                    <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-4 text-center z-20">
                      <AlertTriangle className="w-9 h-9 text-rose-500 animate-pulse mb-2" />
                      <p className="text-[10px] text-rose-400 font-bold max-w-[200px] mb-3 leading-normal">
                        {qrScannerError}
                      </p>
                      <button
                        id="qr-scan-retry-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQrScannerError(null);
                          setQrScanResult(null);
                          setIsScanning(false);
                          setCustomQrPayload('');
                        }}
                        className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition duration-150 shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5 pointer-events-auto"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                        {lang === 'en' ? 'Retry Scan' : 'እንደገና ሞክር'}
                      </button>
                    </div>
                  )}

                </div>

                {/* Simulated Physical Tag Buttons Grid */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block text-center font-mono">
                    💡 {lang === 'en' ? 'Simulate Scanning a Physical Code' : 'የአካላዊ ኮድ ንባብ ለመምሰል'}
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {/* Products shortcuts */}
                    {products.slice(0, 2).map((prod) => (
                      <button
                        key={prod.id}
                        id={`qr-scan-prod-${prod.id}`}
                        onClick={() => handleScanValue(prod.slug)}
                        disabled={isScanning}
                        className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 p-2.5 rounded-2xl text-left cursor-pointer transition active:scale-95 text-xs flex flex-col justify-between disabled:opacity-50"
                      >
                        <span className="font-bold text-stone-200 truncate w-full font-sans">
                          📦 {prod.title}
                        </span>
                        <span className="text-[8px] text-stone-500 font-mono mt-1">
                          Type: Product (Slug: {prod.slug})
                        </span>
                      </button>
                    ))}

                    {/* Fallbacks if no products listed */}
                    {products.length === 0 && (
                      <>
                        <button
                          id="qr-scan-prod-fallback-1"
                          onClick={() => handleScanValue('sidamo-organic-coffee')}
                          disabled={isScanning}
                          className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 p-2.5 rounded-2xl text-left cursor-pointer transition active:scale-95 text-xs flex flex-col justify-between disabled:opacity-50"
                        >
                          <span className="font-bold text-stone-200 truncate w-full font-sans">
                            ☕ Sidamo Organic Coffee
                          </span>
                          <span className="text-[8px] text-stone-500 font-mono mt-1">
                            Type: Product
                          </span>
                        </button>
                        <button
                          id="qr-scan-prod-fallback-2"
                          onClick={() => handleScanValue('ethiopian-habesha-kemis')}
                          disabled={isScanning}
                          className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 p-2.5 rounded-2xl text-left cursor-pointer transition active:scale-95 text-xs flex flex-col justify-between disabled:opacity-50"
                        >
                          <span className="font-bold text-stone-200 truncate w-full font-sans">
                            👗 Ethiopian Habesha Kemis
                          </span>
                          <span className="text-[8px] text-stone-500 font-mono mt-1">
                            Type: Product
                          </span>
                        </button>
                      </>
                    )}

                    {/* Vendor Shortcuts */}
                    {availableVendors.map((vendor) => (
                      <button
                        key={vendor.id}
                        id={`qr-scan-vendor-${vendor.id}`}
                        onClick={() => handleScanValue(vendor.id)}
                        disabled={isScanning}
                        className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 p-2.5 rounded-2xl text-left cursor-pointer transition active:scale-95 text-xs flex flex-col justify-between disabled:opacity-50"
                      >
                        <span className="font-bold text-amber-500 truncate w-full font-sans">
                          🏪 {vendor.shopName}
                        </span>
                        <span className="text-[8px] text-stone-500 font-mono mt-1">
                          Type: Vendor (ID: {vendor.id})
                        </span>
                      </button>
                    ))}

                    {/* Fallbacks if no vendors listed */}
                    {availableVendors.length === 0 && (
                      <>
                        <button
                          id="qr-scan-vendor-fallback-1"
                          onClick={() => handleScanValue('v-2')}
                          disabled={isScanning}
                          className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 p-2.5 rounded-2xl text-left cursor-pointer transition active:scale-95 text-xs flex flex-col justify-between disabled:opacity-50"
                        >
                          <span className="font-bold text-amber-500 truncate w-full font-sans">
                            🏪 Makeda Specialty Coffee
                          </span>
                          <span className="text-[8px] text-stone-500 font-mono mt-1">
                            Type: Vendor
                          </span>
                        </button>
                        <button
                          id="qr-scan-vendor-fallback-2"
                          onClick={() => handleScanValue('v-1')}
                          disabled={isScanning}
                          className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 p-2.5 rounded-2xl text-left cursor-pointer transition active:scale-95 text-xs flex flex-col justify-between disabled:opacity-50"
                        >
                          <span className="font-bold text-green-500 truncate w-full font-sans">
                            🏢 Addis Garment Agency
                          </span>
                          <span className="text-[8px] text-stone-500 font-mono mt-1">
                            Type: Vendor
                          </span>
                        </button>
                      </>
                    )}

                  </div>
                </div>

                {/* Input Manual field */}
                <div className="border-t border-neutral-850 pt-4">
                  <div className="flex gap-2">
                    <input
                      id="qr-manual-payload-input"
                      type="text"
                      value={customQrPayload}
                      onChange={(e) => setCustomQrPayload(e.target.value)}
                      placeholder={lang === 'en' ? "Or enter code (e.g., v-2 or coffee)..." : "ወይም ኮድ እዚህ ይጻፉ (ለምሳሌ v-2)..."}
                      disabled={isScanning}
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-sans disabled:opacity-50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customQrPayload.trim()) {
                          handleScanValue(customQrPayload);
                        }
                      }}
                    />
                    <button
                      id="qr-manual-scan-btn"
                      onClick={() => {
                        if (customQrPayload.trim()) {
                          handleScanValue(customQrPayload);
                        }
                      }}
                      disabled={isScanning || !customQrPayload.trim()}
                      className="bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-800 disabled:text-stone-500 text-neutral-950 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition active:scale-95 shadow-sm disabled:cursor-not-allowed font-sans"
                    >
                      {lang === 'en' ? 'Scan' : 'ቃኝ'}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
