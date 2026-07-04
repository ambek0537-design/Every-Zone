import React from 'react';
import { 
  Shirt, Laptop, Home, Sparkles, Smartphone, Coffee, Briefcase, Car, Grid, Layers
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  active: boolean;
}

interface CategoriesListProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null, customQuery?: string) => void;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}) => {
  // Map the exact requested categories
  const premiumCategories = [
    { label: "Fashion", queryId: "cat-1", icon: <Shirt className="w-4 h-4" /> },
    { label: "Electronics", queryId: "cat-2", icon: <Laptop className="w-4 h-4" /> },
    { label: "Home", queryId: "cat-4", icon: <Home className="w-4 h-4" /> },
    { label: "Beauty", queryId: "cat-5", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Phones", queryId: "cat-2", customQuery: "phone", icon: <Smartphone className="w-4 h-4" /> },
    { label: "Food", queryId: "cat-3", icon: <Coffee className="w-4 h-4" /> },
    { label: "Services", queryId: "custom-services", icon: <Briefcase className="w-4 h-4" /> },
    { label: "Vehicles", queryId: "custom-vehicles", customQuery: "car", icon: <Car className="w-4 h-4" /> },
    { label: "More", queryId: null, icon: <Grid className="w-4 h-4" /> }
  ];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-4 pt-1.5 no-scrollbar select-none scroll-smooth">
      <button
        id="cat-all-btn"
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border whitespace-nowrap cursor-pointer ${
          selectedCategoryId === null 
            ? 'bg-gradient-to-r from-[#916E2E] via-[#C5A059] to-[#E2B755] text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]' 
            : 'bg-[#131316]/85 text-stone-300 border-zinc-800/80 hover:border-[#C5A059]/40 hover:text-[#E2B755] hover:bg-zinc-900'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span>All Items</span>
      </button>

      {premiumCategories.map((pCat, idx) => {
        const isSelected = selectedCategoryId === pCat.queryId && (!pCat.customQuery || selectedCategoryId !== null);
        return (
          <button
            key={idx}
            id={`cat-btn-premium-${idx}`}
            onClick={() => onSelectCategory(pCat.queryId, pCat.customQuery)}
            className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border whitespace-nowrap cursor-pointer ${
              isSelected 
                ? 'bg-[#C5A059] text-[#09090b] border-[#C5A059] shadow-lg shadow-amber-500/5 scale-[1.02]' 
                : 'bg-[#131316]/85 text-stone-400 border-zinc-850 hover:border-[#C5A059]/30 hover:text-stone-100 hover:bg-zinc-900'
            }`}
          >
            <span className={isSelected ? 'text-[#09090b]' : 'text-[#C5A059]'}>
              {pCat.icon}
            </span>
            <span>{pCat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
