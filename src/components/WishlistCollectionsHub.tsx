import React, { useState, useEffect } from 'react';
import { 
  Heart, Plus, FolderHeart, Trash2, Tag, ShoppingBag, ArrowRight,
  ExternalLink, Sparkles, Check, CheckSquare, FolderArchive, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WishlistCollectionsHubProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
  triggerPushNotification: (title: string, body: string, icon: string, category: string) => void;
  onClose: () => void;
}

interface CollectionItem {
  id: string;
  title: string;
  category: 'shop' | 'houses' | 'agencies';
  price?: string;
  location?: string;
  image: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: CollectionItem[];
}

export function WishlistCollectionsHub({
  isDarkMode,
  lang,
  triggerPushNotification,
  onClose
}: WishlistCollectionsHubProps) {
  
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('ez_favorite_collections');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'coll-wedding',
        name: lang === 'en' ? 'Wedding Inspiration' : 'የሰርግ ዝግጅት',
        description: 'Traditional Habesha kemis garments and luxury jewelry listings',
        icon: '🌸',
        items: [
          {
            id: 'p-1',
            title: 'Royal Emperor Habesha Kemis',
            category: 'shop',
            price: '4,200 ETB',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200'
          },
          {
            id: 'p-3',
            title: 'Gold Plated Traditional Set',
            category: 'shop',
            price: '8,500 ETB',
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200'
          }
        ]
      },
      {
        id: 'coll-dream-house',
        name: lang === 'en' ? 'Dream Houses' : 'የህልሜ ቤቶች',
        description: 'Condos and luxury modern villas in Addis Ababa',
        icon: '🏡',
        items: [
          {
            id: 'h-1',
            title: 'Deluxe Bole Modern Villa',
            category: 'houses',
            location: 'Bole, Addis Ababa',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200'
          }
        ]
      },
      {
        id: 'coll-electronics',
        name: lang === 'en' ? 'Electronics & Gear' : 'ኤሌክትሮኒክስ',
        description: 'Personal tech and merchant equipment wishlist',
        icon: '📱',
        items: []
      },
      {
        id: 'coll-cars',
        name: lang === 'en' ? 'Luxury Cars' : 'መኪናዎች',
        description: 'Electric vehicles and luxury transport',
        icon: '⚡',
        items: []
      }
    ];
  });

  const [activeCollectionId, setActiveCollectionId] = useState<string>('coll-wedding');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [newCollectionIcon, setNewCollectionIcon] = useState('⭐');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ez_favorite_collections', JSON.stringify(collections));
  }, [collections]);

  const activeCollection = collections.find(c => c.id === activeCollectionId) || collections[0];

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      alert(lang === 'en' ? 'Please enter a collection name' : 'እባክዎ የስብስብ ስም ያስገቡ');
      return;
    }

    const newColl: Collection = {
      id: `coll-${Date.now()}`,
      name: newCollectionName.trim(),
      description: newCollectionDesc.trim() || 'Custom curated wishlist collection',
      icon: newCollectionIcon,
      items: []
    };

    setCollections(prev => [...prev, newColl]);
    setActiveCollectionId(newColl.id);
    setNewCollectionName('');
    setNewCollectionDesc('');
    setNewCollectionIcon('⭐');
    setIsCreateOpen(false);

    triggerPushNotification(
      '📁 Collection Created!',
      `You added: "${newColl.name}" collection. You can now save favorites here!`,
      newColl.icon,
      'wishlist'
    );
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm(lang === 'en' ? 'Are you sure you want to delete this collection?' : 'ይህን ስብስብ በእርግጠኝነት ማጥፋት ይፈልጋሉ?')) {
      const remaining = collections.filter(c => c.id !== id);
      setCollections(remaining);
      if (activeCollectionId === id && remaining.length > 0) {
        setActiveCollectionId(remaining[0].id);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id === activeCollectionId) {
        return {
          ...c,
          items: c.items.filter(item => item.id !== itemId)
        };
      }
      return c;
    }));
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-stone-900'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-200/85 pb-4 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-black tracking-wider uppercase text-amber-500 flex items-center gap-2">
            <FolderHeart size={20} className="text-amber-500 animate-pulse" />
            {lang === 'en' ? 'Every-zone Favorites & Collections' : 'የኤቭሪ-ዞን የተመረጡ ስብስቦች'}
          </h2>
          <p className="text-[10px] opacity-65 tracking-wide">
            {lang === 'en' ? 'Organize traditional fashion, dream villas, and visas into curated custom portfolios' : 'የተመረጡ ባህላዊ አልባሳትን፣ የህልም ቤቶችንና የስራ አማራጮችን በምድብ የሚያስቀምጡበት ማዕከል'}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-850' : 'bg-white border-stone-200 hover:bg-stone-50'
          }`}
        >
          {lang === 'en' ? 'Close Curator' : 'ስብስቦቹን ዝጋ'}
        </button>
      </div>

      {/* Grid: Left Column Collections List, Right Column Selected Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Collections sidebar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-450">CURATED PORTFOLIOS</span>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-[10px] font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} />
              {lang === 'en' ? 'New Collection' : 'አዲስ ስብስብ'}
            </button>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {collections.map(coll => (
              <div
                key={coll.id}
                className={`p-3 rounded-2xl border text-left transition-all relative flex justify-between items-center ${
                  activeCollectionId === coll.id
                    ? 'border-amber-500 bg-amber-500/5 text-amber-500'
                    : isDarkMode ? 'border-zinc-850 bg-zinc-900/40 text-stone-400 hover:bg-zinc-900' : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <button
                  onClick={() => setActiveCollectionId(coll.id)}
                  className="flex-1 flex gap-3 items-center text-left cursor-pointer"
                >
                  <span className="text-xl">{coll.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{coll.name}</span>
                    <span className="text-[9px] opacity-65 block">{coll.items.length} items saved</span>
                  </div>
                </button>

                {coll.id !== 'coll-wedding' && coll.id !== 'coll-dream-house' && (
                  <button
                    onClick={() => handleDeleteCollection(coll.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg cursor-pointer transition-all"
                    title="Delete collection"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Items list in active collection */}
        <div className="md:col-span-2 space-y-4">
          
          {/* Active Collection Description Header */}
          <div className={`p-4 rounded-2xl border text-left flex justify-between items-start ${
            isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">{activeCollection.icon}</span>
                <h3 className="text-sm font-black text-stone-200 uppercase tracking-wide">{activeCollection.name}</h3>
              </div>
              <p className="text-[10px] text-stone-450 mt-1 leading-relaxed font-sans">{activeCollection.description}</p>
            </div>
          </div>

          {/* Items Stream Grid */}
          {activeCollection.items.length === 0 ? (
            <div className={`p-12 rounded-2xl border border-dashed text-center ${
              isDarkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-stone-200'
            }`}>
              <FolderHeart size={32} className="text-stone-500 mx-auto mb-3 opacity-60" />
              <p className="text-xs text-stone-400 font-bold">This collection is currently empty</p>
              <p className="text-[10px] text-stone-500 mt-1 max-w-xs mx-auto font-sans">
                Browse the Marketplace, Houses, or Overseas Employment boards and tap favorites to add listings here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeCollection.items.map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border text-left flex gap-3 items-center ${
                    isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-stone-150'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-xl border border-stone-200 dark:border-zinc-800"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-stone-200 block truncate">{item.title}</span>
                    <span className="text-[9px] text-stone-450 block font-mono font-bold uppercase mt-0.5">
                      {item.price || item.location || 'Fayda Verified Listing'}
                    </span>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          alert(`Re-routing to product detail viewer node: ID ${item.id}`);
                        }}
                        className="px-2 py-0.5 bg-neutral-800 text-stone-200 text-[8.5px] font-black uppercase rounded hover:bg-neutral-700 cursor-pointer flex items-center gap-0.5"
                      >
                        <ExternalLink size={9} /> View
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8.5px] font-black uppercase rounded hover:bg-red-500/15 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* CREATE COLLECTION DIALOG MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-100 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-sm w-full p-5 rounded-3xl border shadow-2xl relative ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-250 text-stone-900'
              }`}
            >
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
                <FolderHeart size={15} />
                Create Favorite Collection
              </h3>

              <form onSubmit={handleCreateCollection} className="space-y-4 text-xs text-left">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-stone-450 tracking-wider">Collection Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traditional outfits"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-stone-50 border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-stone-450 tracking-wider">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Clothes and accessories for the ceremony"
                    value={newCollectionDesc}
                    onChange={(e) => setNewCollectionDesc(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-stone-50 border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                {/* Emoji Icons selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-stone-450 tracking-wider">Choose Theme Symbol</label>
                  <div className="flex gap-2">
                    {['🌸', '🏡', '📱', '⚡', '👜', '💍', '🍲'].map(sym => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setNewCollectionIcon(sym)}
                        className={`text-lg p-1.5 rounded-lg border transition-all ${
                          newCollectionIcon === sym ? 'border-amber-500 bg-amber-500/10' : 'border-stone-200 dark:border-zinc-800'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 font-extrabold uppercase text-[10px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-2 rounded-xl cursor-pointer uppercase text-[10px]"
                  >
                    Save Collection
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
