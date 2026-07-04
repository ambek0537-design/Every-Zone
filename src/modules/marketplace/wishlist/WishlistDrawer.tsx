import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  discountPrice: number | null;
  currency: string;
  image: string | null;
}

interface WishlistDrawerProps {
  items: Product[];
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  items,
  onClose,
  onRemoveItem,
  onAddToCart
}) => {
  return (
    <div id="wishlist-drawer-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
      {/* Drawer Box container */}
      <div id="wishlist-drawer" className="w-full max-w-md bg-neutral-950 border-l border-neutral-900 h-full flex flex-col shadow-2xl relative select-none">
        
        {/* Header bar */}
        <div className="p-4 border-b border-neutral-900 flex items-center justify-between bg-neutral-950/90 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="font-extrabold text-stone-100 text-sm">Saved Wishlist</span>
            <span className="bg-neutral-900 border border-neutral-800 text-red-400 text-xs px-2 py-0.5 rounded-full font-mono">{items.length}</span>
          </div>
          <button
            id="close-wishlist-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-white hover:bg-neutral-900 p-1.5 rounded-lg border border-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable list contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 space-y-3">
              <Heart className="w-12 h-12 text-stone-700 stroke-[1.5]" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-stone-400">Your wishlist is empty</p>
                <p className="text-[11px] text-stone-500 max-w-[200px]">Save products to your wishlist so you can buy them later.</p>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const activePrice = item.discountPrice || item.price;
              return (
                <div
                  key={item.id}
                  id={`wishlist-item-${item.id}`}
                  className="flex gap-3 bg-neutral-900/30 border border-neutral-850 p-3 rounded-2xl relative group hover:border-neutral-800 transition"
                >
                  {/* Thumbnail Image */}
                  <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-900 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Text details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5 pr-6">
                      <h4 className="text-xs font-bold text-stone-200 line-clamp-1 leading-tight group-hover:text-red-400 transition duration-150">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-xs font-mono font-extrabold text-amber-400">
                          {activePrice.toLocaleString()} {item.currency}
                        </span>
                        {item.discountPrice && (
                          <span className="text-[10px] text-stone-500 line-through leading-none">
                            {item.price.toLocaleString()} {item.currency}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Add and Delete actions */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        id={`wishlist-add-cart-${item.id}`}
                        onClick={() => {
                          onAddToCart(item.id);
                          onRemoveItem(item.id); // move to cart logic
                        }}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Trash delete button */}
                  <button
                    id={`wishlist-remove-${item.id}`}
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2.5 right-2.5 text-stone-500 hover:text-red-400 p-1 rounded-lg hover:bg-neutral-900/60 transition duration-150 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
