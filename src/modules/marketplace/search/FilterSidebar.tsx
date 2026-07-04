import React from 'react';
import { 
  X, Filter, RotateCcw, DollarSign, Star, Check 
} from 'lucide-react';

interface FilterSidebarProps {
  minPrice: string;
  setMinPrice: (p: string) => void;
  maxPrice: string;
  setMaxPrice: (p: string) => void;
  selectedRating: number | null;
  setSelectedRating: (r: number | null) => void;
  availability: string;
  setAvailability: (a: string) => void;
  featured: boolean;
  setFeatured: (f: boolean) => void;
  newArrivals: boolean;
  setNewArrivals: (n: boolean) => void;
  onClearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  selectedRating, setSelectedRating,
  availability, setAvailability,
  featured, setFeatured,
  newArrivals, setNewArrivals,
  onClearFilters
}) => {
  return (
    <div id="filter-sidebar" className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4.5 space-y-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-stone-100">Search Filters</span>
        </div>
        <button
          id="clear-filters-btn"
          onClick={onClearFilters}
          className="text-[11px] text-stone-400 hover:text-amber-500 flex items-center gap-1 transition cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-300">Price Range (ETB)</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2.5 text-stone-500 text-xs">Min</span>
            <input
              id="filter-min-price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 pl-9 pr-2 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2.5 text-stone-500 text-xs">Max</span>
            <input
              id="filter-max-price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="150k"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 pl-9 pr-2 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Customer Rating */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-300">Minimum Rating</label>
        <div className="flex flex-wrap gap-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              id={`filter-rating-${stars}`}
              onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                selectedRating === stars
                  ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{stars}+ Stars</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Status */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-300">Availability</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'In Stock', value: 'instock' },
            { label: 'Out of Stock', value: 'outofstock' }
          ].map((item) => (
            <button
              key={item.value}
              id={`filter-avail-${item.value}`}
              onClick={() => setAvailability(availability === item.value ? 'all' : item.value)}
              className={`py-1.5 px-2 rounded-lg text-xs text-center border font-medium transition cursor-pointer ${
                availability === item.value
                  ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Badges Toggle */}
      <div className="space-y-2 border-t border-neutral-900 pt-3">
        <label className="text-xs font-semibold text-stone-300">Special Filters</label>
        <div className="space-y-2">
          {/* Featured */}
          <label className="flex items-center gap-2.5 text-xs text-stone-400 cursor-pointer select-none">
            <input
              id="filter-featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
              featured ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-800 bg-neutral-900'
            }`}>
              {featured && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Featured Products Only</span>
          </label>

          {/* New Arrivals */}
          <label className="flex items-center gap-2.5 text-xs text-stone-400 cursor-pointer select-none">
            <input
              id="filter-new-arrivals"
              type="checkbox"
              checked={newArrivals}
              onChange={(e) => setNewArrivals(e.target.checked)}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
              newArrivals ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-800 bg-neutral-900'
            }`}>
              {newArrivals && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>New Arrivals (Last 30 days)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
