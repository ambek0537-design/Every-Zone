import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  verified: boolean;
}

interface BrandsGridProps {
  brands: Brand[];
  selectedBrandId: string | null;
  onSelectBrand: (id: string | null) => void;
}

export const BrandsGrid: React.FC<BrandsGridProps> = ({ 
  brands, 
  selectedBrandId, 
  onSelectBrand 
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      <button
        id="brand-all-btn"
        onClick={() => onSelectBrand(null)}
        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all whitespace-nowrap cursor-pointer ${
          selectedBrandId === null
            ? 'bg-amber-500/15 border-amber-500 text-amber-400'
            : 'bg-neutral-900 border-neutral-800 text-stone-400 hover:border-stone-700'
        }`}
      >
        All Brands
      </button>

      {brands.map((brand) => (
        <button
          key={brand.id}
          id={`brand-btn-${brand.id}`}
          onClick={() => onSelectBrand(brand.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all whitespace-nowrap cursor-pointer ${
            selectedBrandId === brand.id
              ? 'bg-amber-500/15 border-amber-500 text-amber-400'
              : 'bg-neutral-900 border-neutral-800 text-stone-400 hover:border-stone-700'
          }`}
        >
          {brand.logoUrl ? (
            <img 
              src={brand.logoUrl} 
              alt={brand.name} 
              className="w-4 h-4 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center text-[8px] text-amber-500 font-bold">
              {brand.name.substring(0, 1)}
            </div>
          )}
          <span>{brand.name}</span>
          {brand.verified && (
            <CheckCircle2 className="w-3 h-3 text-amber-400 fill-neutral-950" />
          )}
        </button>
      ))}
    </div>
  );
};
