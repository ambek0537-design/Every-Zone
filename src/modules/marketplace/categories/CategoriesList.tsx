import React from 'react';
import { motion } from 'motion/react';
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
  lang?: string;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory,
  lang = 'en'
}) => {
  // Map the exact requested categories with modern gradient backgrounds
  const premiumCategories = [
    { 
      label: lang === 'en' ? "Fashion" : "ፋሽን", 
      queryId: "cat-1", 
      icon: <Shirt className="w-5 h-5" />, 
      gradient: "from-rose-500/20 to-pink-500/10 hover:from-rose-500/30 hover:to-pink-500/20",
      accentColor: "text-rose-400"
    },
    { 
      label: lang === 'en' ? "Electronics" : "ኤሌክትሮኒክስ", 
      queryId: "cat-2", 
      icon: <Laptop className="w-5 h-5" />, 
      gradient: "from-blue-500/20 to-cyan-500/10 hover:from-blue-500/30 hover:to-cyan-500/20",
      accentColor: "text-blue-400"
    },
    { 
      label: lang === 'en' ? "Home" : "ቤት", 
      queryId: "cat-4", 
      icon: <Home className="w-5 h-5" />, 
      gradient: "from-emerald-500/20 to-teal-500/10 hover:from-emerald-500/30 hover:to-teal-500/20",
      accentColor: "text-emerald-400"
    },
    { 
      label: lang === 'en' ? "Beauty" : "ውበት", 
      queryId: "cat-5", 
      icon: <Sparkles className="w-5 h-5" />, 
      gradient: "from-purple-500/20 to-fuchsia-500/10 hover:from-purple-500/30 hover:to-fuchsia-500/20",
      accentColor: "text-purple-400"
    },
    { 
      label: lang === 'en' ? "Phones" : "ስልኮች", 
      queryId: "cat-2", 
      customQuery: "phone", 
      icon: <Smartphone className="w-5 h-5" />, 
      gradient: "from-amber-500/20 to-orange-500/10 hover:from-amber-500/30 hover:to-orange-500/20",
      accentColor: "text-amber-400"
    },
    { 
      label: lang === 'en' ? "Food" : "ምግብ", 
      queryId: "cat-3", 
      icon: <Coffee className="w-5 h-5" />, 
      gradient: "from-yellow-500/20 to-amber-500/10 hover:from-yellow-500/30 hover:to-amber-500/20",
      accentColor: "text-yellow-400"
    },
    { 
      label: lang === 'en' ? "Services" : "አገልግሎት", 
      queryId: "custom-services", 
      icon: <Briefcase className="w-5 h-5" />, 
      gradient: "from-teal-500/20 to-indigo-500/10 hover:from-teal-500/30 hover:to-indigo-500/20",
      accentColor: "text-teal-400"
    },
    { 
      label: lang === 'en' ? "Vehicles" : "መኪና", 
      queryId: "custom-vehicles", 
      customQuery: "car", 
      icon: <Car className="w-5 h-5" />, 
      gradient: "from-red-500/20 to-orange-500/10 hover:from-red-500/30 hover:to-orange-500/20",
      accentColor: "text-red-400"
    },
    { 
      label: lang === 'en' ? "More" : "ተጨማሪ", 
      queryId: null, 
      icon: <Grid className="w-5 h-5" />, 
      gradient: "from-stone-500/20 to-zinc-500/10 hover:from-stone-500/30 hover:to-zinc-500/20",
      accentColor: "text-stone-300"
    }
  ];

  return (
    <div className="flex items-center gap-4.5 overflow-x-auto pb-4 pt-2 no-scrollbar select-none scroll-smooth">
      {/* "All" Category card */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectCategory(null)}
        className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer"
      >
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] flex items-center justify-center border transition-all duration-300 relative overflow-hidden shadow-sm ${
          selectedCategoryId === null 
            ? 'bg-gradient-to-br from-[#916E2E] via-[#C5A059] to-[#E2B755] border-[#C5A059] text-neutral-950 shadow-md shadow-[#C5A059]/20 ring-2 ring-[#C5A059]/30' 
            : 'bg-zinc-900/90 hover:bg-zinc-850 border-zinc-800 text-stone-300'
        }`}>
          {/* Inner shiny glow for active state */}
          {selectedCategoryId === null && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          )}
          <Layers className="w-5 h-5" />
        </div>
        <span className={`text-[10px] font-bold tracking-tight text-center ${
          selectedCategoryId === null ? 'text-[#C5A059] font-black' : 'text-stone-400'
        }`}>
          {lang === 'en' ? "All" : "ሁሉም"}
        </span>
      </motion.button>

      {premiumCategories.map((pCat, idx) => {
        const isSelected = selectedCategoryId === pCat.queryId && (!pCat.customQuery || selectedCategoryId !== null);
        return (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(pCat.queryId, pCat.customQuery)}
            className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] flex items-center justify-center border transition-all duration-300 relative overflow-hidden shadow-sm ${
              isSelected 
                ? 'bg-gradient-to-br from-zinc-950 to-zinc-900 border-[#C5A059] text-[#E2B755] ring-2 ring-[#C5A059]/40 shadow-[#C5A059]/10' 
                : `bg-gradient-to-br ${pCat.gradient} border-zinc-850/75 text-stone-300`
            }`}>
              {/* Overlay active highlight */}
              {isSelected && (
                <div className="absolute -inset-1 bg-[#C5A059]/5 blur-sm rounded-[22px]" />
              )}
              <span className={`transition-colors duration-300 ${isSelected ? 'text-[#E2B755]' : pCat.accentColor}`}>
                {pCat.icon}
              </span>
            </div>
            <span className={`text-[10px] font-bold tracking-tight text-center transition-colors ${
              isSelected ? 'text-[#E2B755] font-black' : 'text-stone-400 hover:text-stone-200'
            }`}>
              {pCat.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

