import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';

// Design Token Imports
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

// 1. Primary Button
interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: keyof typeof Lucide;
  loading?: boolean;
  isDarkMode?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  icon,
  loading = false,
  isDarkMode = false,
  className = "",
  ...props
}) => {
  const IconComponent = icon ? (Lucide[icon] as React.ComponentType<{ size?: number; className?: string }>) : null;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer ${
        isDarkMode
          ? "bg-[#C5A059] text-zinc-950 hover:bg-[#D4B26F] active:bg-[#B38D4A]"
          : "bg-[#1E3A1A] text-white hover:bg-[#254A20] active:bg-[#172E14]"
      } disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {loading ? (
        <Lucide.Loader2 size={16} className="animate-spin text-current" />
      ) : (
        IconComponent && <IconComponent size={16} className="text-current" />
      )}
      <span>{label}</span>
    </motion.button>
  );
};

// 2. Secondary Button
interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: keyof typeof Lucide;
  isDarkMode?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  icon,
  isDarkMode = false,
  className = "",
  ...props
}) => {
  const IconComponent = icon ? (Lucide[icon] as React.ComponentType<{ size?: number; className?: string }>) : null;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
        isDarkMode
          ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white"
          : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900"
      } ${className}`}
      {...props}
    >
      {IconComponent && <IconComponent size={15} className="text-current" />}
      <span>{label}</span>
    </motion.button>
  );
};

// 3. Card Container
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isDarkMode?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  isDarkMode = false,
  hoverEffect = true,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isDarkMode
          ? "bg-zinc-900/60 border-zinc-800 text-zinc-100"
          : "bg-white border-stone-150 text-stone-850"
      } ${hoverEffect ? "hover:shadow-md hover:border-stone-200 dark:hover:border-zinc-700" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 4. Product Card
interface ProductCardProps {
  id: string | number;
  title: string;
  price: string;
  image: string;
  category: string;
  rating?: number;
  isDarkMode?: boolean;
  onAddToCart?: () => void;
  onClick?: () => void;
  lang?: 'en' | 'am';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  image,
  category,
  rating = 4.8,
  isDarkMode = false,
  onAddToCart,
  onClick,
  lang = 'en'
}) => {
  return (
    <div
      onClick={onClick}
      className={`group rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        isDarkMode ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700' : 'bg-white border-stone-150 hover:border-stone-250'
      } hover:shadow-lg`}
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-zinc-950">
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2.5 left-2.5 bg-[#1E3A1A] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
          {category}
        </span>
      </div>

      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center text-[10px] text-amber-500 dark:text-amber-400 font-bold mb-0.5">
            <span className="flex items-center gap-0.5">★ {rating}</span>
            <span className="text-stone-400 dark:text-zinc-500">Every-zone Verified</span>
          </div>
          <h4 className="text-[12px] font-extrabold tracking-tight line-clamp-1 group-hover:text-[#1E3A1A] dark:group-hover:text-[#C5A059] transition-colors">
            {title}
          </h4>
          <p className="text-xs font-black text-[#1E3A1A] dark:text-[#C5A059] mt-0.5">{price}</p>
        </div>

        {onAddToCart && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-full mt-2.5 py-2 rounded-lg bg-stone-100 dark:bg-zinc-800 text-[#1E3A1A] dark:text-[#C5A059] font-black text-[10px] uppercase tracking-wider hover:bg-[#1E3A1A] hover:text-white dark:hover:bg-[#C5A059] dark:hover:text-zinc-950 transition-all cursor-pointer"
          >
            {lang === 'am' ? 'ወደ ካርት አስገባ' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

// 5. Vendor Card
interface VendorCardProps {
  name: string;
  category: string;
  rating: number;
  deliveryTime?: string;
  image: string;
  isDarkMode?: boolean;
  onClick?: () => void;
  lang?: 'en' | 'am';
}

export const VendorCard: React.FC<VendorCardProps> = ({
  name,
  category,
  rating,
  deliveryTime = "15-25 min",
  image,
  isDarkMode = false,
  onClick,
  lang = 'en'
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border flex gap-3.5 cursor-pointer transition-all ${
        isDarkMode ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-150 hover:border-stone-250'
      } hover:shadow-md`}
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-950 shrink-0 border border-stone-100 dark:border-zinc-800">
        <img src={image} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-black tracking-tight">{name}</h4>
          <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded">
            ★ {rating}
          </span>
        </div>
        <p className="text-[10px] text-stone-500 dark:text-zinc-400 font-medium">{category}</p>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#1E3A1A]/10 dark:bg-amber-400/10 text-[#1E3A1A] dark:text-amber-400">
            {deliveryTime}
          </span>
          <span className="text-[8px] text-stone-400 font-mono">
            {lang === 'am' ? 'ፈጣን ማድረስ' : 'Express Delivery'}
          </span>
        </div>
      </div>
    </div>
  );
};

// 6. House Card (Real Estate)
interface HouseCardProps {
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  image: string;
  isDarkMode?: boolean;
  onClick?: () => void;
  lang?: 'en' | 'am';
}

export const HouseCard: React.FC<HouseCardProps> = ({
  title,
  location,
  price,
  beds,
  baths,
  image,
  isDarkMode = false,
  onClick,
  lang = 'en'
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 ${
        isDarkMode ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700' : 'bg-white border-stone-150 hover:border-stone-250'
      } hover:shadow-md`}
    >
      <div className="relative aspect-video overflow-hidden bg-stone-100 dark:bg-zinc-950">
        <img src={image} alt={title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        <span className="absolute bottom-2.5 left-2.5 bg-[#1E3A1A] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">
          {price}
        </span>
      </div>
      <div className="p-3.5 space-y-1.5">
        <h4 className="text-xs font-black tracking-tight line-clamp-1">{title}</h4>
        <p className="text-[10px] text-stone-500 dark:text-zinc-400 flex items-center gap-1">
          <Lucide.MapPin size={10} /> {location}
        </p>
        <div className="flex gap-3 text-[10px] font-bold text-stone-600 dark:text-zinc-400 pt-1 border-t border-stone-100 dark:border-zinc-800/80">
          <span className="flex items-center gap-1"><Lucide.Bed size={12} /> {beds} {lang === 'am' ? 'መኝታ' : 'Beds'}</span>
          <span className="flex items-center gap-1"><Lucide.Droplet size={12} /> {baths} {lang === 'am' ? 'መታጠቢያ' : 'Baths'}</span>
        </div>
      </div>
    </div>
  );
};

// 7. Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isDarkMode?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isDarkMode = false,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:ring-1 transition-all ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-[#C5A059] focus:ring-[#C5A059]"
            : "bg-white border-stone-200 text-stone-800 focus:border-[#1E3A1A] focus:ring-[#1E3A1A]"
        } ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
    </div>
  );
};

// 8. Search Bar
interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  onVoiceClick?: () => void;
  onCameraClick?: () => void;
  isDarkMode?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  onVoiceClick,
  onCameraClick,
  isDarkMode = false
}) => {
  return (
    <div className="relative flex items-center w-full">
      <Lucide.Search className="absolute left-3.5 text-stone-400 dark:text-zinc-500" size={16} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-20 py-3 rounded-full text-xs font-bold shadow-xs border focus:outline-none transition-all ${
          isDarkMode
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500'
            : 'bg-white border-stone-200 text-stone-800 focus:border-[#1E3A1A]'
        }`}
      />
      <div className="absolute right-3.5 flex items-center gap-2">
        {onVoiceClick && (
          <button
            onClick={onVoiceClick}
            className="p-1 text-stone-400 hover:text-stone-605 dark:hover:text-zinc-200 cursor-pointer"
          >
            <Lucide.Mic size={14} />
          </button>
        )}
        {onCameraClick && (
          <button
            onClick={onCameraClick}
            className="p-1 text-stone-400 hover:text-stone-605 dark:hover:text-zinc-200 cursor-pointer"
          >
            <Lucide.Camera size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

// 9. Badge (Tag)
interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  isDarkMode?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  isDarkMode = false
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'error':
        return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'secondary':
        return isDarkMode
          ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
          : 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return isDarkMode
          ? 'bg-amber-400/10 text-amber-400 border-amber-500/20'
          : 'bg-[#1E3A1A]/10 text-[#1E3A1A] border-[#1E3A1A]/20';
    }
  };

  return (
    <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getColors()}`}>
      {label}
    </span>
  );
};

// 10. Avatar
interface AvatarProps {
  src?: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  size = 'md',
  isOnline = false
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-base',
  };

  return (
    <div className="relative shrink-0 select-none">
      <div className={`rounded-full overflow-hidden flex items-center justify-center font-bold bg-[#1E3A1A]/10 text-[#1E3A1A] dark:bg-amber-400/10 dark:text-[#C5A059] border-2 border-white dark:border-zinc-950 ${sizeClasses[size]}`}>
        {src ? (
          <img src={src} alt={initials} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {isOnline && (
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full" />
      )}
    </div>
  );
};

// 11. Bottom Sheet
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDarkMode = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={`w-full max-w-lg rounded-t-[32px] border-t overflow-hidden relative flex flex-col max-h-[85vh] shadow-2xl z-51 ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'
            }`}
          >
            {/* Grabber handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-stone-300 dark:bg-zinc-800 rounded-full" />
            </div>

            <div className="px-5 pb-3 flex justify-between items-center border-b border-stone-100 dark:border-zinc-900">
              <h3 className="font-black text-sm uppercase tracking-wider">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-stone-400 hover:text-stone-705 dark:hover:text-zinc-200 cursor-pointer"
              >
                <Lucide.X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 12. Modal Dialog
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDarkMode = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className={`w-full max-w-md rounded-3xl border overflow-hidden shadow-2xl relative flex flex-col ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'
            }`}
          >
            <div className="p-5 flex justify-between items-center border-b border-stone-100 dark:border-zinc-800/80">
              <h3 className="font-black text-xs uppercase tracking-wider">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-stone-400 hover:text-stone-605 dark:hover:text-zinc-200 cursor-pointer"
              >
                <Lucide.X size={16} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 13. Toast Notification
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { icon: Lucide.CheckCircle2, color: 'border-green-500 text-green-700 bg-green-50' },
    error: { icon: Lucide.AlertCircle, color: 'border-red-500 text-red-700 bg-red-50' },
    info: { icon: Lucide.Info, color: 'border-blue-500 text-blue-700 bg-blue-50' }
  };

  const { icon: Icon, color } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-4 right-4 z-55 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 ${color}`}
    >
      <Icon size={16} />
      <span className="text-[11px] font-bold uppercase tracking-wide">{message}</span>
      <button onClick={onClose} className="p-0.5 text-current opacity-60 hover:opacity-100 cursor-pointer">
        <Lucide.X size={12} />
      </button>
    </motion.div>
  );
};

// 14. Loader Component
interface LoaderProps {
  label?: string;
  isDarkMode?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  label = "Loading...",
  isDarkMode = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-stone-200 border-t-[#1E3A1A] dark:border-zinc-800 dark:border-t-[#C5A059] rounded-full"
      />
      {label && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          {label}
        </p>
      )}
    </div>
  );
};
