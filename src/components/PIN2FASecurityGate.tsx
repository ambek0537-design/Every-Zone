import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, Key, Smartphone, Keyboard, X, Check } from 'lucide-react';

interface SecurityGateProps {
  actionName: string;
  actionNameAm?: string;
  isDarkMode: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  lang?: string;
}

export function PIN2FASecurityGate({ actionName, actionNameAm, isDarkMode, onSuccess, onCancel, lang = 'en' }: SecurityGateProps) {
  const [pinMode, setPinMode] = useState<'pin' | 'otp'>('pin');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('7742');
  const [errorText, setErrorText] = useState<string>('');
  const [isSuccessState, setIsSuccessState] = useState<boolean>(false);
  
  // Prompt instructions depending on language
  const title = lang === 'en' ? "Security 2FA Authentication Gate" : "ደህንነት ማረጋገጫ ማዕከል (2FA)";
  const description = lang === 'en' 
    ? `A secure action requires multi-factor clearance. Action: ${actionName}` 
    : `ይህንን ድርጊት ለማከናወን ተጨማሪ የደህንነት ማረጋገጫ ያስፈልጋል:: ድርጊት: ${actionNameAm || actionName}`;

  useEffect(() => {
    // Generate a random OTP code and trigger alert-like message
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
  }, []);

  const triggerMockOtpNotification = () => {
    setErrorText('');
    alert(`💬 [Every-zone Security Alert]\nYour 2FA OTP security verification activation code is: ${generatedOtp}.\nDo not share this code with anyone.`);
  };

  const handleKeyPress = (num: string) => {
    setErrorText('');
    if (pinMode === 'pin') {
      if (enteredPin.length < 4) {
        setEnteredPin(prev => prev + num);
      }
    } else {
      if (enteredOtp.length < 4) {
        setEnteredOtp(prev => prev + num);
      }
    }
  };

  const handleDelete = () => {
    setErrorText('');
    if (pinMode === 'pin') {
      setEnteredPin(prev => prev.slice(0, -1));
    } else {
      setEnteredOtp(prev => prev.slice(0, -1));
    }
  };

  const verifyCode = () => {
    if (pinMode === 'pin') {
      // Default passcode is '1234'
      if (enteredPin === '1234') {
        processVerificationSuccess();
      } else {
        setErrorText(lang === 'en' ? 'Incorrect 4-digit PIN! Code is (1234)' : 'የገቡት የፒን ቁጥር የተሳሳተ ነው! ፍንጭ: (1234)');
        setEnteredPin('');
      }
    } else {
      if (enteredOtp === generatedOtp) {
        processVerificationSuccess();
      } else {
        setErrorText(lang === 'en' ? 'Incorrect OTP code! Resend SMS code.' : 'የገቡት የኦቲፒ ኮድ የተሳሳተ ነው!');
        setEnteredOtp('');
      }
    }
  };

  const processVerificationSuccess = () => {
    setIsSuccessState(true);
    setTimeout(() => {
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-stone-950/75 backdrop-blur-xs p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-xs rounded-3xl border shadow-2xl overflow-hidden p-5 flex flex-col items-center space-y-4 ${
          isDarkMode 
            ? 'bg-zinc-950 border-amber-500 text-zinc-100' 
            : 'bg-white border-[#C5A059] text-stone-900'
        }`}
      >
        <div className="w-full flex justify-between items-center border-b pb-2.5 border-stone-100 dark:border-zinc-900">
          <div className="flex items-center gap-1.5 text-amber-500">
            <ShieldCheck size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider">{title}</span>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-900 text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {isSuccessState ? (
          <motion.div 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            className="flex flex-col items-center justify-center py-6 text-center space-y-2.5"
          >
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 rounded-full flex items-center justify-center">
              <Check size={26} className="stroke-[3]" />
            </div>
            <div className="text-xs font-black text-emerald-500 uppercase tracking-wider">
              {lang === 'en' ? 'ACCESS CONFIRMED' : 'ደህንነት ተረጋግጧል'}
            </div>
            <p className="text-[9.5px] opacity-70">
              {lang === 'en' ? 'MFA check cleared successfully. Processing...' : 'ማረጋገጫው ተቀባይነት አግኝቷል:: በመከናወን ላይ...'}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="text-center space-y-1">
              <p className="text-[9.5px] opacity-70 leading-relaxed font-sans">
                {description}
              </p>
            </div>

            {/* Selector tabs between standard PIN or SMS One Time Passcode (OTP) */}
            <div className="grid grid-cols-2 gap-1 bg-stone-100 dark:bg-zinc-900 p-1 rounded-xl w-full">
              <button
                type="button"
                onClick={() => { setPinMode('pin'); setErrorText(''); }}
                className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9.5px] font-bold uppercase transition-all ${
                  pinMode === 'pin'
                    ? (isDarkMode ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-[#1E3A1A] text-white font-black')
                    : 'text-stone-500 dark:text-zinc-400'
                }`}
              >
                <Keyboard size={12} /> PIN Lock (1234)
              </button>
              <button
                type="button"
                onClick={() => { setPinMode('otp'); triggerMockOtpNotification(); }}
                className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9.5px] font-bold uppercase transition-all ${
                  pinMode === 'otp'
                    ? (isDarkMode ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-[#1E3A1A] text-white font-black')
                    : 'text-stone-500 dark:text-zinc-400'
                }`}
              >
                <Smartphone size={12} /> SMS OTP (2FA)
              </button>
            </div>

            {/* Display Circles of Keyed numbers */}
            <div className="flex gap-3 my-1">
              {[0, 1, 2, 3].map((idx) => {
                const targetText = pinMode === 'pin' ? enteredPin : enteredOtp;
                const hasValue = targetText.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      hasValue 
                        ? (isDarkMode ? 'bg-amber-400 border-amber-400 scale-110 shadow-md' : 'bg-[#1E3A1A] border-[#1E3A1A] scale-110 shadow')
                        : 'border-stone-300 dark:border-zinc-800'
                    }`}
                  />
                );
              })}
            </div>

            {/* Helper to send OTP text */}
            {pinMode === 'otp' && (
              <button
                type="button"
                onClick={triggerMockOtpNotification}
                className="text-[9px] hover:underline font-extrabold tracking-wider uppercase text-amber-500 dark:text-amber-400 flex items-center gap-1"
              >
                📩 Send Code to verified +251...
              </button>
            )}

            {errorText && (
              <span className="text-[9px] font-black text-red-500 uppercase tracking-tight text-center bg-red-500/10 p-1.5 rounded-lg w-full">
                ⚠️ {errorText}
              </span>
            )}

            {/* Virtual Numerical Keypad for touch simulation */}
            <div className="w-full grid grid-cols-3 gap-2 px-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-zinc-90 w-100 bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:border-amber-400/50' 
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleDelete}
                className="py-2 rounded-xl text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer border border-transparent"
              >
                ⌫
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800' 
                    : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                0
              </button>
              <button
                type="button"
                disabled={(pinMode === 'pin' ? enteredPin : enteredOtp).length !== 4}
                onClick={verifyCode}
                className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  (pinMode === 'pin' ? enteredPin : enteredOtp).length === 4
                    ? (isDarkMode ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' : 'bg-emerald-700 text-white hover:bg-emerald-800')
                    : 'bg-stone-200 dark:bg-zinc-900 text-stone-400 dark:text-zinc-650 border border-transparent cursor-not-allowed'
                }`}
              >
                OK ✓
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
