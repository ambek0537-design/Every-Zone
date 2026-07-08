import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, Camera, Sparkles, X } from 'lucide-react';

/**
 * Global Constants & Design Tokens for Every-zone
 */
export const EZTokens = {
  colors: {
    primary: {
      light: '#1E3A1A', // Ethiopian Forest Green
      dark: '#C5A059',  // Axum Gold
    },
    accent: {
      light: '#E2B755',
      dark: '#10B981',
    },
    background: {
      light: 'bg-stone-50 text-stone-900 border-stone-250',
      dark: 'bg-[#0a0a0c] text-zinc-100 border-zinc-800',
    }
  },
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  },
  spacing: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }
};

// ==========================================
// 1. EZButton
// ==========================================
interface EZButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isDarkMode?: boolean;
}

export const EZButton: React.FC<EZButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isDarkMode = true,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[11px] font-bold rounded-xl',
    md: 'px-4.5 py-2.5 text-xs font-black rounded-2xl',
    lg: 'px-6 py-3 text-sm font-black rounded-3xl',
  };

  const getVariantClasses = () => {
    if (variant === 'primary') {
      return isDarkMode 
        ? 'bg-gradient-to-br from-[#916E2E] via-[#C5A059] to-[#E2B755] text-zinc-950 shadow-md shadow-[#C5A059]/10 hover:brightness-110'
        : 'bg-[#1E3A1A] text-white shadow-md hover:bg-[#2e5229]';
    }
    if (variant === 'secondary') {
      return isDarkMode
        ? 'bg-zinc-900 text-stone-250 border border-zinc-850 hover:bg-zinc-850'
        : 'bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200';
    }
    if (variant === 'outline') {
      return isDarkMode
        ? 'bg-transparent text-[#E2B755] border border-[#C5A059]/30 hover:bg-[#C5A059]/10'
        : 'bg-transparent text-[#1E3A1A] border border-[#1E3A1A]/30 hover:bg-[#1E3A1A]/5';
    }
    if (variant === 'danger') {
      return 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25';
    }
    return 'bg-transparent text-stone-400 hover:text-stone-200';
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={`inline-flex items-center justify-center gap-2 border border-transparent transition-all duration-200 cursor-pointer select-none font-sans ${sizeClasses[size]} ${getVariantClasses()} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// ==========================================
// 2. EZCard
// ==========================================
interface EZCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isDarkMode?: boolean;
  hoverable?: boolean;
}

export const EZCard: React.FC<EZCardProps> = ({
  children,
  isDarkMode = true,
  hoverable = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`border overflow-hidden transition-all duration-300 rounded-[22px] ${
        isDarkMode 
          ? 'bg-[#131316]/80 border-zinc-800/80 text-zinc-200 shadow-xl shadow-black/40' 
          : 'bg-white border-stone-200 text-stone-800 shadow-md shadow-stone-100'
      } ${
        hoverable 
          ? isDarkMode 
            ? 'hover:border-[#C5A059]/40 hover:bg-[#1a1a20] hover:shadow-2xl hover:shadow-[#C5A059]/5' 
            : 'hover:border-stone-300 hover:bg-stone-50/50 hover:shadow-lg'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// 3. EZInput
// ==========================================
interface EZInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isDarkMode?: boolean;
  icon?: React.ReactNode;
}

export const EZInput: React.FC<EZInputProps> = ({
  isDarkMode = true,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
          {icon}
        </div>
      )}
      <input
        className={`w-full text-xs py-2.5 rounded-xl outline-none transition-all focus:ring-1 ${
          icon ? 'pl-10' : 'px-4'
        } ${
          isDarkMode
            ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/40 focus:ring-amber-500/35'
            : 'bg-stone-100 border border-stone-200 text-stone-850 placeholder-stone-400 focus:border-[#1E3A1A]/40 focus:ring-[#1E3A1A]/30'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

// ==========================================
// 4. EZSearchBar
// ==========================================
interface EZSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVoiceSearch?: () => void;
  onImageSearch?: () => void;
  onAiSearch?: () => void;
  isDarkMode?: boolean;
}

export const EZSearchBar: React.FC<EZSearchBarProps> = ({
  placeholder = 'Search Every-zone...',
  value,
  onChange,
  onVoiceSearch,
  onImageSearch,
  onAiSearch,
  isDarkMode = true,
}) => {
  return (
    <div className={`relative flex items-center w-full rounded-2xl border transition-all ${
      isDarkMode 
        ? 'bg-zinc-950/80 border-zinc-800 focus-within:border-[#C5A059]/50 shadow-inner' 
        : 'bg-stone-100 border-stone-200 focus-within:border-[#1E3A1A]/50'
    }`}>
      <Search className={`ml-4 w-4 h-4 shrink-0 ${isDarkMode ? 'text-[#C5A059]' : 'text-[#1E3A1A]'}`} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-none py-3 px-3 text-xs focus:outline-none focus:ring-0 text-stone-100 placeholder-stone-500"
      />
      
      <div className="flex items-center gap-1.5 mr-3 shrink-0">
        {value && (
          <button
            onClick={() => {
              const e = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
              onChange(e);
            }}
            className="text-stone-500 hover:text-white p-1 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        
        {onVoiceSearch && (
          <button
            type="button"
            onClick={onVoiceSearch}
            className={`p-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all ${
              isDarkMode ? 'text-amber-500 hover:bg-zinc-900' : 'text-[#1E3A1A] hover:bg-stone-200/50'
            }`}
            title="Search with Voice"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        )}

        {onImageSearch && (
          <button
            type="button"
            onClick={onImageSearch}
            className={`p-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all ${
              isDarkMode ? 'text-amber-500 hover:bg-zinc-900' : 'text-[#1E3A1A] hover:bg-stone-200/50'
            }`}
            title="Search by Photo/QR"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        )}

        {onAiSearch && (
          <button
            type="button"
            onClick={onAiSearch}
            className={`p-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border ${
              isDarkMode ? 'text-purple-400 border-purple-500/20 hover:bg-purple-500/20' : 'text-purple-700 border-purple-200 hover:bg-purple-50 font-bold'
            }`}
            title="Ask AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. EZBottomSheet
// ==========================================
interface EZBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

export const EZBottomSheet: React.FC<EZBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  isDarkMode = true,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] border-t p-6 z-50 shadow-2xl ${
              isDarkMode 
                ? 'bg-zinc-950 border-zinc-850 text-zinc-150' 
                : 'bg-white border-stone-200 text-stone-850'
            }`}
          >
            {/* Grab handle bar */}
            <div className="flex justify-center mb-4.5">
              <div className="w-12 h-1 bg-stone-300 dark:bg-zinc-800 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3.5 mb-4 border-stone-100 dark:border-zinc-850">
              <h3 className="text-sm font-black uppercase tracking-wider">{title}</h3>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-4.5 h-4.5 text-stone-400" />
              </button>
            </div>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 6. EZDialog
// ==========================================
interface EZDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

export const EZDialog: React.FC<EZDialogProps> = ({
  isOpen,
  onClose,
  title,
  isDarkMode = true,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
          />

          {/* Box content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className={`relative max-w-md w-full rounded-3xl border p-5 shadow-2xl overflow-hidden z-50 ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-150' 
                : 'bg-white border-stone-200 text-stone-850'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4.5 border-stone-100 dark:border-zinc-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">{title}</h4>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-850 cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 7. EZBadge
// ==========================================
interface EZBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'neutral' | 'purple';
}

export const EZBadge: React.FC<EZBadgeProps> = ({
  children,
  variant = 'gold',
}) => {
  const badgeClasses = {
    gold: 'bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E2B755]',
    green: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
    red: 'bg-red-500/10 border border-red-500/30 text-red-400',
    purple: 'bg-purple-500/10 border border-purple-500/30 text-purple-400',
    neutral: 'bg-stone-500/10 border border-stone-500/30 text-stone-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm leading-none ${badgeClasses[variant]}`}>
      {children}
    </span>
  );
};

// ==========================================
// 8. EZSkeleton (Facebook/LinkedIn/Amazon Style)
// ==========================================
interface EZSkeletonProps {
  variant?: 'card' | 'list' | 'text' | 'image' | 'category';
  count?: number;
}

export const EZSkeleton: React.FC<EZSkeletonProps> = ({
  variant = 'card',
  count = 1,
}) => {
  const items = Array.from({ length: count });

  const renderSkeletonItem = (index: number) => {
    if (variant === 'card') {
      return (
        <div key={index} className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-3 space-y-3.5 animate-pulse">
          <div className="aspect-[4/3] w-full bg-zinc-800 rounded-xl" />
          <div className="space-y-2">
            <div className="h-3 w-1/3 bg-zinc-800 rounded" />
            <div className="h-4.5 w-5/6 bg-zinc-800 rounded" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-zinc-850/60">
            <div className="space-y-1 w-1/2">
              <div className="h-2.5 w-1/2 bg-zinc-800 rounded" />
              <div className="h-4 w-3/4 bg-zinc-800 rounded" />
            </div>
            <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
          </div>
        </div>
      );
    }

    if (variant === 'list') {
      return (
        <div key={index} className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-3 flex items-center gap-3 animate-pulse">
          <div className="w-16 h-16 bg-zinc-800 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 bg-zinc-800 rounded" />
            <div className="h-2.5 w-1/2 bg-zinc-800 rounded" />
            <div className="h-3 w-1/4 bg-zinc-800 rounded" />
          </div>
        </div>
      );
    }

    if (variant === 'category') {
      return (
        <div key={index} className="flex flex-col items-center gap-1.5 animate-pulse p-1">
          <div className="w-12 h-12 bg-zinc-800 rounded-full" />
          <div className="h-2 w-10 bg-zinc-800 rounded" />
        </div>
      );
    }

    if (variant === 'image') {
      return <div key={index} className="w-full h-full bg-zinc-800 animate-pulse rounded-2xl" />;
    }

    return (
      <div key={index} className="space-y-2 animate-pulse">
        <div className="h-4.5 bg-zinc-800 rounded w-full" />
        <div className="h-4 bg-zinc-800 rounded w-5/6" />
        <div className="h-3 bg-zinc-800 rounded w-2/3" />
      </div>
    );
  };

  return (
    <>
      {items.map((_, idx) => renderSkeletonItem(idx))}
    </>
  );
};
