import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, WifiOff, ShieldAlert, CreditCard, HelpCircle, RefreshCw } from 'lucide-react';

export type ErrorType = 'network' | 'validation' | 'payment' | 'login' | 'unknown';

interface UnifiedErrorComponentProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  onClose?: () => void;
  isDarkMode?: boolean;
}

export const UnifiedErrorComponent: React.FC<UnifiedErrorComponentProps> = ({
  type,
  message,
  onRetry,
  onClose,
  isDarkMode = false
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          title: 'Network Connection Failure',
          amTitle: 'የኔትወርክ ግንኙነት መቋረጥ',
          desc: message || 'Unable to establish secure handshake with Every-zone routing servers. Please verify your internet connection or check regional server nodes status.',
          icon: WifiOff,
          color: 'text-rose-500 bg-rose-500/10 border-rose-500/30'
        };
      case 'validation':
        return {
          title: 'Input Validation Violation',
          amTitle: 'የመረጃ ስህተት ተገኝቷል',
          desc: message || 'The provided form parameters do not match required security schemas or national biometric ID length rules. Please correct invalid fields and submit again.',
          icon: ShieldAlert,
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
        };
      case 'payment':
        return {
          title: 'Payment Escrow Declined',
          amTitle: 'የክፍያ ሂደት አልተሳካም',
          desc: message || 'Chapa API rejected the transaction ledger sign request. This may be due to insufficient reserve balance, expired tokenized keys, or network timeout.',
          icon: CreditCard,
          color: 'text-red-500 bg-red-500/10 border-red-500/30'
        };
      case 'login':
        return {
          title: 'Identity Authentication Expired',
          amTitle: 'የመግቢያ ፈቃድዎ አልቋል',
          desc: message || 'Biometric Fayda signature key check failed or your Google SSO OAuth token has expired. Please authenticate via secure credentials prompt.',
          icon: AlertCircle,
          color: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
        };
      default:
        return {
          title: 'System Execution Error',
          amTitle: 'ያልታወቀ የስርዓት ስህተት',
          desc: message || 'An unhandled exception was intercepted by the Every-zone local virtual machine daemon. The error report has been forwarded to the SRE admin logging terminal.',
          icon: HelpCircle,
          color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/30'
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`p-5 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all max-w-md mx-auto ${
        isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-stone-850 shadow-md'
      } ${config.color}`}
    >
      <div className="flex gap-4 items-start">
        <div className="p-3.5 rounded-full bg-white/10 shrink-0 border border-current/15">
          <IconComponent size={22} className="text-current" />
        </div>
        <div className="space-y-1 flex-1">
          <span className="text-[9px] font-black tracking-widest uppercase opacity-75 font-mono block">
            System Alert • {type.toUpperCase()}
          </span>
          <h4 className="text-xs font-black uppercase tracking-tight text-stone-100">{config.title}</h4>
          <h5 className="text-[10px] opacity-90 text-amber-400 dark:text-amber-300 font-bold">{config.amTitle}</h5>
          <p className="text-[10.5px] leading-relaxed opacity-80 font-mono mt-1.5">{config.desc}</p>
        </div>
      </div>

      <div className="flex gap-2.5 pt-1.5 border-t border-current/10">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1E3A1A] hover:bg-[#254A20] dark:bg-[#C5A059] dark:text-zinc-950 font-black text-[10px] uppercase tracking-wider cursor-pointer text-white"
          >
            <RefreshCw size={11} className="animate-spin" style={{ animationDuration: '4s' }} />
            <span>Retry Operation</span>
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="px-4.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 font-bold text-[10px] uppercase tracking-wider cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </motion.div>
  );
};
