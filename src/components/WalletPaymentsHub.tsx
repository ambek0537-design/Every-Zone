import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Clock, 
  ShieldCheck, AlertTriangle, ShieldAlert, BarChart3, TrendingUp, 
  CheckCircle2, XCircle, Landmark, RefreshCw, Layers, Sparkles, AlertCircle, FileText, Send, Award,
  Camera, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PIN2FASecurityGate } from './PIN2FASecurityGate';
import { QRCodeScanner as PassportQRScanner, ScanResult } from './QRCodeScanner';

interface WalletPaymentsHubProps {
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
  lang: 'en' | 'am';
  requestCameraPermission?: (onGranted: () => void) => void;
}

// Interfaces replicating Prisma schema
interface TransactionType {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'TRANSFER' | 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'LOTTERY_PRIZE' | 'EQUB_PAYOUT';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  reference: string;
  description: string;
  createdAt: string;
  walletId: string;
}

interface EscrowContract {
  id: string;
  buyerId: string;
  vendorName: string;
  amount: number;
  status: 'HELD' | 'RELEASED' | 'REFUNDED';
  orderId: string;
  createdAt: string;
}

interface LedgerEntry {
  id: string;
  transactionId: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

interface RiskEvent {
  id: string;
  transactionId: string;
  riskScore: number; // 0 to 1
  reason: string;
  createdAt: string;
}

export function WalletPaymentsHub({ walletBalance, setWalletBalance, isDarkMode, lang, requestCameraPermission }: WalletPaymentsHubProps) {
  // Tabs
  const [subTab, setSubTab] = useState<'overview' | 'actions' | 'escrow' | 'ledgers' | 'risk'>('overview');

  // Local state seeded from cache
  const [transactions, setTransactions] = useState<TransactionType[]>(() => {
    const saved = localStorage.getItem('ez_db_transactions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'tx-8041-92b0',
        amount: 5000,
        type: 'DEPOSIT',
        status: 'SUCCESS',
        reference: 'CHAPA-DEP-893041',
        description: 'Chapa Secure Gateway Funding',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        walletId: 'w-user-99'
      },
      {
        id: 'tx-2201-1b2c',
        amount: 200,
        type: 'PAYMENT',
        status: 'SUCCESS',
        reference: 'TELEBIRR-SUB-11029',
        description: 'Vendor Premium Subscription Feed',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        walletId: 'w-user-99'
      },
      {
        id: 'tx-9043-c0d1',
        amount: 1500,
        type: 'TRANSFER',
        status: 'SUCCESS',
        reference: 'EZ-P2P-948123',
        description: 'Tadesse Abebe (P2P Client transfer)',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        walletId: 'w-user-99'
      }
    ];
  });

  const [escrows, setEscrows] = useState<EscrowContract[]>(() => {
    const saved = localStorage.getItem('ez_db_escrow');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'escrow-realestate-01',
        buyerId: 'user-current',
        vendorName: 'Zemen Real Estate Inc.',
        amount: 25000,
        status: 'HELD',
        orderId: 'villa-booking-99a2',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: 'escrow-marketplace-04',
        buyerId: 'user-current',
        vendorName: 'Sheger Coffee Importers',
        amount: 1200,
        status: 'RELEASED',
        orderId: 'order-sheger-884c',
        createdAt: new Date(Date.now() - 3600000 * 180).toISOString()
      }
    ];
  });

  const [ledgers, setLedgers] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('ez_db_ledgers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'ldg-01', transactionId: 'tx-8041-92b0', balanceBefore: 1200, balanceAfter: 6200, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
      { id: 'ldg-02', transactionId: 'tx-2201-1b2c', balanceBefore: 6200, balanceAfter: 6000, createdAt: new Date(Date.now() - 3600000 * 12).toISOString() },
      { id: 'ldg-03', transactionId: 'tx-9043-c0d1', balanceBefore: 6000, balanceAfter: 4500, createdAt: new Date(Date.now() - 3600000 * 2).toISOString() }
    ];
  });

  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>(() => {
    const saved = localStorage.getItem('ez_db_risks');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'risk-8831',
        transactionId: 'tx-dummy-99',
        riskScore: 0.12,
        reason: 'Low risk - domestic mobile transaction fingerprint matching user baseline pattern.',
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
      }
    ];
  });

  // Action input states
  const [depositAmount, setDepositAmount] = useState('2000');
  const [depositProvider, setDepositProvider] = useState<'Chapa' | 'Telebirr' | 'CBE' | 'Awash Bank'>('Telebirr');
  const [withdrawalAmount, setWithdrawalAmount] = useState('1500');
  const [withdrawalAccount, setWithdrawalAccount] = useState('10002930485912');
  const [withdrawalProvider, setWithdrawalProvider] = useState<'Telebirr' | 'CBE' | 'Awash Bank'>('CBE');
  
  // Transfer inputs
  const [transferAmount, setTransferAmount] = useState('500');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferDesc, setTransferDesc] = useState('');

  // Loyalty engine points state
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    const saved = localStorage.getItem('ez_loyalty_points');
    return saved ? parseInt(saved, 10) : 340;
  });

  // Recent receipt overlay state
  const [recentReceipt, setRecentReceipt] = useState<{
    id: string;
    amount: number;
    type: string;
    reference: string;
    timestamp: string;
    description: string;
    feePaid?: number;
  } | null>(null);

  // Security gate action callback state
  const [securityAction, setSecurityAction] = useState<{
    name: string;
    nameAm: string;
    onVerify: () => void;
  } | null>(null);

  // Manual offline transaction inputs
  const [manualChannel, setManualChannel] = useState<'Telebirr' | 'CBE Birr' | 'Bank of Abyssinia' | 'Awash Birr' | 'Dashen Bank / Amole'>('Telebirr');
  const [manualRef, setManualRef] = useState('');
  const [manualProofCode, setManualProofCode] = useState('');
  const [manualDepositorEmail, setManualDepositorEmail] = useState('depositor@everyzone.com');
  const [manualAlertMsg, setManualAlertMsg] = useState<string | null>(null);
  const [manualErrorMsg, setManualErrorMsg] = useState<string | null>(null);
  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);

  // Save states
  useEffect(() => {
    localStorage.setItem('ez_loyalty_points', loyaltyPoints.toString());
  }, [loyaltyPoints]);

  // Save states
  useEffect(() => {
    localStorage.setItem('ez_db_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ez_db_escrow', JSON.stringify(escrows));
  }, [escrows]);

  useEffect(() => {
    localStorage.setItem('ez_db_ledgers', JSON.stringify(ledgers));
  }, [ledgers]);

  useEffect(() => {
    localStorage.setItem('ez_db_risks', JSON.stringify(riskEvents));
  }, [riskEvents]);

  // Offline State Tracking and Auto Sync
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  const forceProcessQueue = () => {
    localStorage.setItem('ez_simulated_offline', 'false');
    window.dispatchEvent(new Event('ez_network_change'));
    alert('🔌 Network simulation set to ONLINE! Processing queued scans...');
  };

  useEffect(() => {
    const checkQueue = () => {
      try {
        const saved = localStorage.getItem('ez_queued_scans');
        if (saved) {
          const queue = JSON.parse(saved);
          const paymentScans = queue.filter((item: any) => 
            item.type === 'PAYMENT_CODE' || item.type === 'TRANSFER_CODE'
          );
          setOfflineQueueCount(paymentScans.length);
        } else {
          setOfflineQueueCount(0);
        }
      } catch (e) {
        setOfflineQueueCount(0);
      }
    };

    checkQueue();
    window.addEventListener('storage', checkQueue);
    window.addEventListener('online', checkQueue);
    window.addEventListener('ez_network_change', checkQueue);

    const interval = setInterval(checkQueue, 2500);

    return () => {
      window.removeEventListener('storage', checkQueue);
      window.removeEventListener('online', checkQueue);
      window.removeEventListener('ez_network_change', checkQueue);
      clearInterval(interval);
    };
  }, []);

  // Automatic processing of offline queued payment/transfer scans
  useEffect(() => {
    const processQueuedScans = () => {
      // Check if we are online (neither browser offline nor simulated offline)
      const isSimulatedOffline = localStorage.getItem('ez_simulated_offline') === 'true';
      const isOnline = navigator.onLine && !isSimulatedOffline;
      if (!isOnline) return;

      const saved = localStorage.getItem('ez_queued_scans');
      if (!saved) return;

      try {
        const queue = JSON.parse(saved);
        if (queue.length === 0) return;

        // Find the first payment/transfer scan
        const targetIndex = queue.findIndex((item: any) => 
          item.type === 'PAYMENT_CODE' || item.type === 'TRANSFER_CODE'
        );

        if (targetIndex !== -1) {
          const item = queue[targetIndex];
          
          // Remove from queue first to prevent double-processing loops
          const updatedQueue = [...queue];
          updatedQueue.splice(targetIndex, 1);
          localStorage.setItem('ez_queued_scans', JSON.stringify(updatedQueue));

          // Trigger processing with a delay so UI loads nicely
          setTimeout(() => {
            handleScanSuccess({
              type: item.type,
              data: item.data
            });
          }, 800);
        }
      } catch (err) {
        console.error("Failed to process queued scans:", err);
      }
    };

    // Run on mount
    processQueuedScans();

    // Listen for online events
    window.addEventListener('online', processQueuedScans);
    window.addEventListener('ez_network_change', processQueuedScans);

    return () => {
      window.removeEventListener('online', processQueuedScans);
      window.removeEventListener('ez_network_change', processQueuedScans);
    };
  }, [walletBalance, lang]);

  // QR Code Scanner Integration
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const handleScanSuccess = (result: ScanResult) => {
    if (result.type === 'PAYMENT_CODE') {
      setSubTab('actions');
      if (result.data.amount) setDepositAmount(result.data.amount.toString());
      if (result.data.provider) setDepositProvider(result.data.provider);
      
      const amt = result.data.amount || 0;
      const merchant = result.data.merchantName || 'Merchant';
      const prov = result.data.provider || 'Telebirr';
      
      const confirmPay = window.confirm(`⚡ ${lang === 'en' ? 'QR Code Scanned!' : 'ክፍያ በ QR ኮድ!'}\n\n${lang === 'en' ? 'Merchant' : 'ነጋዴ'}: ${merchant}\n${lang === 'en' ? 'Amount' : 'የገንዘብ መጠን'}: ${amt.toLocaleString()} ETB\n${lang === 'en' ? 'Gateway' : 'አገልግሎት አቅራቢ'}: ${prov}\n\n${lang === 'en' ? 'Would you like to authorize this payment from your Every-Zone wallet balance immediately?' : 'ይህንን ክፍያ ከኪስ ቦርሳዎ ላይ አሁን መክፈል ይፈልጋሉ?'}`);
      
      if (confirmPay) {
        if (walletBalance < amt) {
          alert(`❌ ${lang === 'en' ? `Funds Insufficient: This payment requires ${amt.toLocaleString()} ETB but your balance is only ${walletBalance.toLocaleString()} ETB. The payment fields have been pre-filled for you so you can top up.` : `ቀሪ ሂሳብዎ በቂ አይደለም፡ ይህንን ለመክፈል ${amt.toLocaleString()} ብር ያስፈልጋል፤ የእርስዎ ቀሪ ሂሳብ ግን ${walletBalance.toLocaleString()} ብር ነው። የክፍያው ቅጽ በራስ-ሰር ተሞልቶልዎታል።`}`);
          return;
        }
        
        const txId = 'tx-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
        const ref = result.data.reference || `${prov.toUpperCase()}-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
        const desc = `QR Scan Pay to ${merchant}`;
        
        const nextTx: TransactionType = {
          id: txId,
          amount: amt,
          type: 'PAYMENT',
          status: 'SUCCESS',
          reference: ref,
          description: desc,
          createdAt: new Date().toISOString(),
          walletId: 'w-user-99'
        };
        
        const previousBalance = walletBalance;
        const currentBalance = previousBalance - amt;
        setWalletBalance(currentBalance);
        setTransactions(prev => [nextTx, ...prev]);
        
        // Loyalty points (10% cashback bonus!)
        const points = Math.floor(amt * 0.1);
        setLoyaltyPoints(prev => prev + points);
        
        // Ledger
        const nextLdg: LedgerEntry = {
          id: 'ldg-' + Math.floor(1000 + Math.random() * 9000),
          transactionId: txId,
          balanceBefore: previousBalance,
          balanceAfter: currentBalance,
          createdAt: new Date().toISOString()
        };
        setLedgers(prev => [nextLdg, ...prev]);
        
        // Receipt
        setRecentReceipt({
          id: txId,
          amount: amt,
          type: 'PAYMENT',
          reference: ref,
          timestamp: new Date().toLocaleString(),
          description: desc
        });
        
        alert(`🎉 ${lang === 'en' ? 'Payment Successful!' : 'ክፍያው በተሳካ ሁኔታ ተፈጽሟል!'}\n\n${lang === 'en' ? 'Sent' : 'የተከፈለው'}: ${amt.toLocaleString()} ETB to ${merchant}\nRef: ${ref}\nLoyalty: +${points} points!`);
      }
    } else if (result.type === 'TRANSFER_CODE') {
      setSubTab('actions');
      if (result.data.recipientName) setTransferRecipient(result.data.recipientName);
      if (result.data.amount) setTransferAmount(result.data.amount.toString());
      if (result.data.reference) setTransferDesc(result.data.reference);
      
      const amt = result.data.amount || 0;
      const rec = result.data.recipientName || 'Peer';
      const refCode = result.data.reference || '';
      
      const confirmTransfer = window.confirm(`⚡ ${lang === 'en' ? 'Peer P2P QR Scanned!' : 'የአቻ ለአቻ የክፍያ QR ኮድ ተቃኝቷል!'}\n\n${lang === 'en' ? 'Recipient' : 'ተቀባይ'}: ${rec}\n${lang === 'en' ? 'Amount' : 'የገንዘብ መጠን'}: ${amt.toLocaleString()} ETB\n\n${lang === 'en' ? `Would you like to instantly transfer ${amt.toLocaleString()} ETB to ${rec}?` : `በአስቸኳይ ${amt.toLocaleString()} ብር ለ ${rec} ማስተላለፍ ይፈልጋሉ?`}`);
      
      if (confirmTransfer) {
        if (walletBalance < amt) {
          alert(`❌ ${lang === 'en' ? `Funds Insufficient: This transfer requires ${amt.toLocaleString()} ETB but your balance is only ${walletBalance.toLocaleString()} ETB.` : `ቀሪ ሂሳብዎ በቂ አይደለም፡ ይህ ማስተላለፊያ ${amt.toLocaleString()} ብር ይጠይቃል፣ የእርስዎ ግን ${walletBalance.toLocaleString()} ብር ነው።`}`);
          return;
        }
        
        const txId = 'tx-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
        const ref = refCode || `EZ-P2P-${Math.floor(100000 + Math.random() * 900000)}`;
        const desc = `Instant P2P Transfer to ${rec}`;
        
        const nextTx: TransactionType = {
          id: txId,
          amount: amt,
          type: 'TRANSFER',
          status: 'SUCCESS',
          reference: ref,
          description: desc,
          createdAt: new Date().toISOString(),
          walletId: 'w-user-99'
        };
        
        const previousBalance = walletBalance;
        const currentBalance = previousBalance - amt;
        setWalletBalance(currentBalance);
        setTransactions(prev => [nextTx, ...prev]);
        
        // Ledger
        const nextLdg: LedgerEntry = {
          id: 'ldg-' + Math.floor(1000 + Math.random() * 9000),
          transactionId: txId,
          balanceBefore: previousBalance,
          balanceAfter: currentBalance,
          createdAt: new Date().toISOString()
        };
        setLedgers(prev => [nextLdg, ...prev]);
        
        // Receipt
        setRecentReceipt({
          id: txId,
          amount: amt,
          type: 'TRANSFER',
          reference: ref,
          timestamp: new Date().toLocaleString(),
          description: desc
        });
        
        alert(`🎉 ${lang === 'en' ? 'Transfer Complete!' : 'ገንዘቡ በተሳካ ሁኔታ ተላልፏል!'}\n\n${lang === 'en' ? 'Transferred' : 'የተላለፈው'}: ${amt.toLocaleString()} ETB to ${rec}\nRef: ${ref}`);
      }
    } else {
      alert(`ℹ️ ${lang === 'en' ? `Scanned code of type: ${result.type}. This code is designed for the Ethiopia Passport Hub. Please open the Passport Hub and click 'Scan' to auto-fill booking details.` : `የተቃኘው ኮድ አይነት፡ ${result.type} ነው። ይህ ኮድ ለፓስፖርት ቀጠሮ የተዘጋጀ ነው። እባክዎ የፓስፖርት ገጹን ከፍተው መቃኛውን ይጠቀሙ።`}`);
    }
  };

  // Handle Manual Offline Verification
  const handleManualPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRef.trim()) {
      alert('⚠️ Please key in the exact bank Reference Number received.');
      return;
    }

    setIsSubmitInProgress(true);
    setManualAlertMsg(null);
    setManualErrorMsg(null);

    try {
      const response = await fetch('/api/payments/manual-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentChannel: manualChannel,
          referenceNumber: manualRef,
          offlineProofCode: manualProofCode || undefined,
          userEmail: manualDepositorEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        setManualAlertMsg(data.smsAlert || data.message || "✓ Claim logged successfully! Verification queue dispatch completed.");
        const txId = 'tx-manual-' + Math.floor(1000 + Math.random() * 9000);
        const nextTx: TransactionType = {
          id: txId,
          amount: 200,
          type: 'DEPOSIT',
          status: 'PENDING',
          reference: manualRef,
          description: `Offline Verification: ${manualChannel} Rent Claim`,
          createdAt: new Date().toISOString(),
          walletId: 'w-user-99'
        };
        setTransactions(prev => [nextTx, ...prev]);
        setManualRef('');
        setManualProofCode('');
      } else {
        setManualErrorMsg(data.error || "Ref code collision or submission threshold block.");
        if (data.isSuspended) {
          alert(`⚠️ DIGITAL ID LOCKED SUSPENDED!\nReason: ${data.details || 'False inputs limit exceeded.'}\nAll access including matchmaking pools is now restricted. Reset can only be configured by a subadmin.`);
        }
      }
    } catch (err: any) {
      setManualErrorMsg("Network verification channel timed out.");
    } finally {
      setIsSubmitInProgress(false);
    }
  };

  // Handle Deposit
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      alert('⚠️ Enter a valid amount greater than 0.');
      return;
    }

    const txId = 'tx-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
    const ref = `${depositProvider.toUpperCase().replace(' ', '')}-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    const desc = `${depositProvider} Channel Instant top-up`;

    const nextTx: TransactionType = {
      id: txId,
      amount: amt,
      type: 'DEPOSIT',
      status: 'SUCCESS',
      reference: ref,
      description: desc,
      createdAt: new Date().toISOString(),
      walletId: 'w-user-99'
    };

    const previousBalance = walletBalance;
    const currentBalance = previousBalance + amt;

    // Mutate state
    setWalletBalance(currentBalance);
    setTransactions(prev => [nextTx, ...prev]);

    // Loyalty points (5%)
    const points = Math.floor(amt * 0.05);
    setLoyaltyPoints(prev => prev + points);

    // Ledger
    const nextLdg: LedgerEntry = {
      id: 'ldg-' + Math.floor(1000 + Math.random() * 9000),
      transactionId: txId,
      balanceBefore: previousBalance,
      balanceAfter: currentBalance,
      createdAt: new Date().toISOString()
    };
    setLedgers(prev => [nextLdg, ...prev]);

    // Risk calculation
    const score = amt > 15000 ? 0.65 : 0.05;
    if (amt > 15000) {
      const nextRisk: RiskEvent = {
        id: 'risk-' + Math.floor(1000 + Math.random() * 9000),
        transactionId: txId,
        riskScore: score,
        reason: `Flagged: Depositing large volume (${amt.toLocaleString()} ETB) via ${depositProvider} requires compliance check.`,
        createdAt: new Date().toISOString()
      };
      setRiskEvents(prev => [nextRisk, ...prev]);
    }

    // Set digital receipt
    setRecentReceipt({
      id: txId,
      amount: amt,
      type: 'DEPOSIT',
      reference: ref,
      timestamp: new Date().toLocaleString(),
      description: desc
    });
  };

  // Helper method to proceed with checked withdrawal
  const executeWithdrawal = (amt: number, provider: string, phoneOrAccount: string) => {
    const txId = 'tx-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
    const ref = `${provider.toUpperCase().replace(' ', '')}-WDW-${Math.floor(100000 + Math.random() * 900000)}`;
    const desc = `Withdrawal to bank account ${phoneOrAccount}`;

    const nextTx: TransactionType = {
      id: txId,
      amount: amt,
      type: 'WITHDRAWAL',
      status: 'PROCESSING',
      reference: ref,
      description: desc,
      createdAt: new Date().toISOString(),
      walletId: 'w-user-99'
    };

    const previousBalance = walletBalance;
    const currentBalance = previousBalance - amt;

    setWalletBalance(currentBalance);
    setTransactions(prev => [nextTx, ...prev]);

    // Loyalty points (5% for using platform services)
    const points = Math.floor(amt * 0.02); // 2% for withdrawal transactions if applicable
    if (points > 0) {
      setLoyaltyPoints(prev => prev + points);
    }

    // Ledger log
    const nextLdg: LedgerEntry = {
      id: 'ldg-' + Math.floor(1000 + Math.random() * 9000),
      transactionId: txId,
      balanceBefore: previousBalance,
      balanceAfter: currentBalance,
      createdAt: new Date().toISOString()
    };
    setLedgers(prev => [nextLdg, ...prev]);

    // Simulating completion of processing
    setTimeout(() => {
      setTransactions(prev => prev.map(t => {
        if (t.id === txId) {
          return { ...t, status: 'SUCCESS' };
        }
        return t;
      }));
    }, 4500);

    // Risk assessment
    const score = amt > 10000 ? 0.45 : 0.15;
    if (amt > 10000) {
      const nextRisk: RiskEvent = {
        id: 'risk-' + Math.floor(1000 + Math.random() * 9000),
        transactionId: txId,
        riskScore: score,
        reason: `Withdrawal request of ${amt.toLocaleString()} ETB to account ${phoneOrAccount} placed in audit queue.`,
        createdAt: new Date().toISOString()
      };
      setRiskEvents(prev => [nextRisk, ...prev]);
    }

    // Digital receipt generator
    setRecentReceipt({
      id: txId,
      amount: amt,
      type: 'WITHDRAWAL',
      reference: ref,
      timestamp: new Date().toLocaleString(),
      description: desc
    });
  };

  // Handle Withdrawal Form Submit
  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawalAmount);
    if (!amt || amt <= 0) {
      alert('⚠️ Enter a valid amount.');
      return;
    }
    if (amt > walletBalance) {
      alert(`❌ Funds Insufficient: You requested withdrawal of ${amt.toLocaleString()} ETB but have only ${walletBalance.toLocaleString()} ETB available.`);
      return;
    }

    // TRIGGER 2FA PIN Gate SECURITY MITIGATION
    setSecurityAction({
      name: `Withdraw ${amt.toLocaleString()} ETB to ${withdrawalProvider} A/C ${withdrawalAccount}`,
      nameAm: `${amt.toLocaleString()} ብር ወደ ${withdrawalProvider} አካውንት ${withdrawalAccount} ማውጣት`,
      onVerify: () => {
        executeWithdrawal(amt, withdrawalProvider, withdrawalAccount);
      }
    });
  };

  // Helper method to execute transfer after 2FA Gate clears
  const executeTransfer = (amt: number, fee: number, recipient: string, descNote: string) => {
    const txId = 'tx-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
    const ref = `EZ-P2P-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalDesc = `Internal transfer to ${recipient}` + (descNote ? ` (${descNote})` : '');

    // Mutate and ledger
    const previousBalance = walletBalance;
    const currentBalance = previousBalance - (amt + fee); // Deduct amount + fee

    const nextTx: TransactionType = {
      id: txId,
      amount: amt,
      type: 'TRANSFER',
      status: 'SUCCESS',
      reference: ref,
      description: finalDesc,
      createdAt: new Date().toISOString(),
      walletId: 'w-user-99'
    };

    setWalletBalance(currentBalance);
    setTransactions(prev => [nextTx, ...prev]);

    // Loyalty points (5% credited)
    const points = Math.floor(amt * 0.05);
    setLoyaltyPoints(prev => prev + points);

    // Ledger log
    const nextLdg: LedgerEntry = {
      id: 'ldg-' + Math.floor(1000 + Math.random() * 9000),
      transactionId: txId,
      balanceBefore: previousBalance,
      balanceAfter: currentBalance,
      createdAt: new Date().toISOString()
    };
    setLedgers(prev => [nextLdg, ...prev]);

    // Risk scoring
    let score = 0.05;
    let flag = false;
    let reason = '';

    if (amt >= 20000) {
      score = 0.92;
      flag = true;
      reason = `CRITICAL FRAUD SHIELD: Suspiciously high-value P2P transfer (${amt.toLocaleString()} ETB) initiated. Held for review.`;
    } else if (amt >= 8000) {
      score = 0.58;
      flag = true;
      reason = `MODERATE RISK: peer transfer exceeds standard 5,000 ETB daily limit.`;
    } else if (recipient.toLowerCase().includes('fraud') || recipient.toLowerCase().includes('test')) {
      score = 0.75;
      flag = true;
      reason = `COMPLIANCE DETECTED: Target username matching restricted watchlists.`;
    }

    if (flag) {
      const nextRisk: RiskEvent = {
        id: 'risk-' + Math.floor(1000 + Math.random() * 9000),
        transactionId: txId,
        riskScore: score,
        reason: reason,
        createdAt: new Date().toISOString()
      };
      setRiskEvents(prev => [nextRisk, ...prev]);
    }

    // Set digital receipt
    setRecentReceipt({
      id: txId,
      amount: amt,
      type: 'TRANSFER',
      reference: ref,
      timestamp: new Date().toLocaleString(),
      description: finalDesc,
      feePaid: fee
    });
  };

  // Handle Transfer (Peer-to-Peer) Form Submit
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) {
      alert('⚠️ Enter a valid transfer amount.');
      return;
    }
    if (!transferRecipient.trim()) {
      alert('⚠️ Please specify recipient username or phone number (+251...).');
      return;
    }

    // PLATFORM PROCESSING COMMISSION OF 1.5% or 2 ETB minimum
    const fee = Math.max(2, parseFloat((amt * 0.015).toFixed(2)));
    const totalNeeded = amt + fee;

    if (totalNeeded > walletBalance) {
      alert(`❌ Funds Insufficient: You requested a transfer of ${amt.toLocaleString()} ETB + ${fee} ETB system fee, but have only ${walletBalance.toLocaleString()} ETB available.`);
      return;
    }

    // TRIGGER 2FA PIN Gate SECURITY MITIGATION
    setSecurityAction({
      name: `P2P Transfer of ${amt.toLocaleString()} ETB to ${transferRecipient} (+ ${fee} ETB platform commission fee)`,
      nameAm: `${amt.toLocaleString()} ብር ወደ ${transferRecipient} ማስተላለፍ (ከ ${fee} ብር የአገልግሎት ክፍያ ጋር)`,
      onVerify: () => {
        executeTransfer(amt, fee, transferRecipient, transferDesc);
      }
    });
  };

  // Release Escrow
  const handleReleaseEscrow = (id: string, amount: number) => {
    if (!confirm('Are you absolutely sure you want to release these funds to the Vendor? This action is irreversible once finalized.')) return;

    setEscrows(prev => prev.map(esc => {
      if (esc.id === id) return { ...esc, status: 'RELEASED' };
      return esc;
    }));

    // Log the release transaction
    const txId = 'tx-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
    const nextTx: TransactionType = {
      id: txId,
      amount: amount,
      type: 'ESCROW_RELEASE',
      status: 'SUCCESS',
      reference: `ESC-RLS-${Math.floor(100000 + Math.random() * 900000)}`,
      description: `Escrow release allocation to primary vendor account.`,
      createdAt: new Date().toISOString(),
      walletId: 'w-user-99'
    };
    setTransactions(prev => [nextTx, ...prev]);

    alert('🎉 Escrow Released! The escrowed funds have been transferred directly to the verified Vendor.');
  };

  // Refund Escrow
  const handleRefundEscrow = (id: string, amount: number) => {
    if (!confirm('Return funds back to your wallet? The seller will be notified of the settlement cancellation request.')) return;

    setEscrows(prev => prev.map(esc => {
      if (esc.id === id) return { ...esc, status: 'REFUNDED' };
      return esc;
    }));

    // Back to current user balance
    const previousBalance = walletBalance;
    const currentBalance = previousBalance + amount;

    // Updates
    setWalletBalance(currentBalance);

    const txId = 'tx-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
    const nextTx: TransactionType = {
      id: txId,
      amount: amount,
      type: 'REFUND',
      status: 'SUCCESS',
      reference: `ESC-RFD-${Math.floor(100000 + Math.random() * 900000)}`,
      description: `Amortized Escrow Refund return to buyer wallet`,
      createdAt: new Date().toISOString(),
      walletId: 'w-user-99'
    };
    setTransactions(prev => [nextTx, ...prev]);

    const nextLdg: LedgerEntry = {
      id: 'ldg-' + Math.floor(1000 + Math.random() * 9000),
      transactionId: txId,
      balanceBefore: previousBalance,
      balanceAfter: currentBalance,
      createdAt: new Date().toISOString()
    };
    setLedgers(prev => [nextLdg, ...prev]);

    alert(`💵 Escrow Refund Issued! ${amount.toLocaleString()} ETB returned safely to your active wallet balance.`);
  };

  // Data for chart showing transactions summary
  const getChartData = () => {
    // Generate simple dynamic chart of transaction progression
    return [
      { name: 'Mon', balance: 5000 },
      { name: 'Tue', balance: 4800 },
      { name: 'Wed', balance: 6500 },
      { name: 'Thu', balance: 6300 },
      { name: 'Fri', balance: 7800 },
      { name: 'Sat', balance: 7500 },
      { name: 'Sun', balance: walletBalance }
    ];
  };

  // Helper colors
  const getStatusColor = (status: TransactionType['status']) => {
    switch (status) {
      case 'SUCCESS': return 'text-emerald-600 bg-emerald-50 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-800/30';
      case 'PROCESSING': return 'text-amber-500 bg-amber-50 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/20';
      case 'FAILED': return 'text-red-500 bg-red-50 border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/20';
      default: return 'text-stone-500 bg-stone-100 dark:bg-zinc-800';
    }
  };

  const getTxTypeLabel = (type: TransactionType['type']) => {
    return type.replace('_', ' ');
  };

  return (
    <div className={`border p-4 rounded-3xl shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#1E3A1A]/10 text-[#1E3A1A]'}`}>
            <Wallet size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#C5A059] block">⚡ Core Payments Gateway</span>
            <h2 className="text-sm font-bold font-sans">
              {lang === 'en' ? 'Central Ledger & Wallet Management' : 'ማዕከላዊ የክፍያ ቦርሳና ሂሳብ መድረክ'}
            </h2>
          </div>
        </div>

        {/* Mini Balance Badge */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-[11px] font-extrabold ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-amber-400' : 'bg-stone-50 border-stone-200 text-[#1E3A1A]'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
          {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB
        </div>
      </div>

      {/* LOW BALANCE ALERT WARNING */}
      {walletBalance < 250 && (
        <div className="bg-amber-500/10 border-2 border-dashed border-amber-500/40 text-amber-600 dark:text-amber-400 p-3 rounded-2xl flex items-start gap-2.5 text-xs animate-pulse mb-3.5 select-none">
          <span className="text-sm">⚠️</span>
          <div className="flex-1 space-y-0.5">
            <div className="font-extrabold uppercase tracking-tight text-[10px]">ማስጠንቀቂያ፦ የኪስ ቦርሳዎ ቀሪ ሂሳብ አነስተኛ ነው!</div>
            <p className="text-[10px] leading-relaxed opacity-90">የሱቅ ኪራይዎ እንዳይቋረጥ እባክዎ ሂሳብ ይሙሉ:: (Warning: Your wallet balance is below 250 ETB! Please recharge to prevent shop suspension.)</p>
          </div>
        </div>
      )}

      {/* LOYALTY ENGAGEMENT POINTS CARDS */}
      <div className={`p-3 rounded-2xl border mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${isDarkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-amber-500/5 border-amber-500/20'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Award size={16} className="animate-bounce" />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1 font-sans">
              <span>⭐ Loyalty Points Engine</span>
              <span className="bg-amber-500/10 px-1 py-0.2 rounded font-mono font-black">5% CB Active</span>
            </div>
            <div className="text-[10.5px] font-bold text-stone-700 dark:text-zinc-300 font-sans mt-0.5">
              You accumulated <strong className="text-amber-500 font-mono font-black text-xs">{loyaltyPoints}</strong> reward points on account!
            </div>
          </div>
        </div>

        {/* Redeem Actions */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              if (loyaltyPoints < 100) {
                alert("⚠️ Minimum 100 points required to redeem a Weekend Lottery Ticket Voucher!");
                return;
              }
              setLoyaltyPoints(prev => prev - 100);
              // credit user wallet with 20 ETB or equivalent lottery value
              setWalletBalance(prev => prev + 20);
              alert("🎉 Redeemed! 100 points exchanged for 20 ETB Free Weekend Lottery Ticket Voucher credit.");
            }}
            className="flex-1 sm:flex-initial px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-black rounded-lg text-[8.5px] uppercase tracking-wider transition-all cursor-pointer border border-transparent"
          >
            🎟️ Redeem Lottery Token (100 pts)
          </button>
          <button
            type="button"
            onClick={() => {
              if (loyaltyPoints < 250) {
                alert("⚠️ Minimum 250 points required to activate a 1-Week Vendor Premium Visibility Boost!");
                return;
              }
              setLoyaltyPoints(prev => prev - 250);
              alert("🚀 Boost Active! 250 points exchanged. Your vendor store has been granted high-priority search visibility for 1-Week!");
            }}
            className="flex-1 sm:flex-initial px-2.5 py-1.5 bg-[#1E3A1A] hover:bg-[#1E3A1A]/90 text-white font-black rounded-lg text-[8.5px] uppercase tracking-wider transition-all cursor-pointer border border-[#C5A059]/30"
          >
            🔥 Shop Boost (250 pts)
          </button>
        </div>
      </div>

      {/* METRIC RIBBON */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className={`p-2.5 rounded-2xl border text-center ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-100'}`}>
          <div className="text-[9px] text-stone-400 font-bold block uppercase tracking-tight">Active Escrows</div>
          <div className="text-sm font-black font-mono text-[#C5A059] mt-0.5">
            {escrows.filter(e => e.status === 'HELD').length} <span className="text-[9px] font-sans text-stone-500">contracts</span>
          </div>
        </div>
        <div className={`p-2.5 rounded-2xl border text-center ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-100'}`}>
          <div className="text-[9px] text-stone-400 font-bold block uppercase tracking-tight">Fraud Scored</div>
          <div className="text-sm font-black font-mono text-emerald-500 mt-0.5">
            100% <span className="text-[9px] font-sans text-stone-500">shielded</span>
          </div>
        </div>
        <div className={`p-2.5 rounded-2xl border text-center ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-100'}`}>
          <div className="text-[9px] text-stone-400 font-bold block uppercase tracking-tight">CBE/Tele Integration</div>
          <div className="text-[10px] font-bold text-green-600 mt-1 uppercase flex items-center justify-center gap-0.5">
            <ShieldCheck size={10} /> Online
          </div>
        </div>
        <div className={`p-2.5 rounded-2xl border text-center ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-100'}`}>
          <div className="text-[9px] text-stone-400 font-bold block uppercase tracking-tight">Ledger Status</div>
          <div className="text-[10px] font-bold text-amber-500 mt-1 uppercase flex items-center justify-center gap-0.5">
            <Layers size={10} /> Audited
          </div>
        </div>
      </div>

      {/* UNIVERSAL QR PAY BAR */}
      <div className={`p-3 rounded-2xl border mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
        isDarkMode ? 'bg-[#C5A059]/10 border-[#C5A059]/20' : 'bg-[#FAF9F6] border-[#C5A059]/30'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
            <QrCode size={16} className="animate-pulse text-[#C5A059]" />
          </div>
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#C5A059] flex items-center gap-1 font-sans">
              <span>📷 Instant QR Scan & Pay Gate</span>
              <span className="bg-emerald-500/10 text-emerald-600 px-1 py-0.2 rounded font-mono font-black">Secure</span>
            </div>
            <div className="text-[10px] opacity-75 font-bold text-stone-700 dark:text-zinc-300 font-sans mt-0.5">
              {lang === 'en' 
                ? 'Scan Telebirr, CBE Birr Merchant QR codes, or Every-zone transfer tickets.' 
                : 'የቴሌብር፣ የንግድ ባንክ ወይም የኤቭሪዞን የክፍያ QR ኮዶችን በቀጥታ በካሜራ ይቃኙ።'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (requestCameraPermission) {
              requestCameraPermission(() => setIsScannerOpen(true));
            } else {
              setIsScannerOpen(true);
            }
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#1E3A1A] hover:bg-emerald-850 text-white font-black rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow-sm"
        >
          <Camera size={13} />
          {lang === 'en' ? 'Scan to Pay' : 'ለመክፈል ይቃኙ'}
        </button>
      </div>

      {/* SUB-NAVBAR ROUTING */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-3 border-b border-stone-100 dark:border-zinc-850" style={{ scrollbarWidth: 'none' }}>
        <button 
          onClick={() => setSubTab('overview')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${subTab === 'overview' ? (isDarkMode ? 'bg-amber-400 text-zinc-950' : 'bg-[#1E3A1A] text-white') : 'bg-stone-100 dark:bg-zinc-850 text-stone-500 hover:text-stone-700'}`}
        >
          📈 Ledger Overview
        </button>
        <button 
          onClick={() => setSubTab('actions')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${subTab === 'actions' ? (isDarkMode ? 'bg-amber-400 text-zinc-950' : 'bg-[#1E3A1A] text-white') : 'bg-stone-100 dark:bg-zinc-850 text-stone-500 hover:text-stone-700'}`}
        >
          💸 Pay / Deposit / Withdraw
        </button>
        <button 
          onClick={() => setSubTab('escrow')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${subTab === 'escrow' ? (isDarkMode ? 'bg-amber-400 text-zinc-950' : 'bg-[#1E3A1A] text-white') : 'bg-stone-100 dark:bg-zinc-850 text-stone-500 hover:text-stone-700'}`}
        >
          🔐 Escrow Contracts
        </button>
        <button 
          onClick={() => setSubTab('ledgers')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${subTab === 'ledgers' ? (isDarkMode ? 'bg-amber-400 text-zinc-950' : 'bg-[#1E3A1A] text-white') : 'bg-stone-100 dark:bg-zinc-850 text-stone-500 hover:text-stone-700'}`}
        >
          📋 Audit Ledger Logs
        </button>
        <button 
          onClick={() => setSubTab('risk')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${subTab === 'risk' ? (isDarkMode ? 'bg-amber-400 text-zinc-950' : 'bg-[#1E3A1A] text-white') : 'bg-stone-100 dark:bg-zinc-850 text-stone-500 hover:text-stone-700'}`}
        >
          🛡️ Fraud Shield ({riskEvents.length})
        </button>
      </div>

      {/* CORE DISPLAY STAGE */}
      <AnimatePresence mode="wait">
        
        {/* OVERVIEW TAB */}
        {subTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* OFFLINE QUEUED SCANS ALERT */}
            {offlineQueueCount > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-600 font-sans">
                <div className="flex gap-2 items-center">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 shrink-0 animate-bounce">
                    <QrCode size={16} />
                  </div>
                  <div>
                    <span className="font-extrabold uppercase tracking-wider block">
                      {lang === 'en' ? '📥 Offline Scans Queued' : '📥 ከመስመር ውጭ የተቃኙ የክፍያ ትኬቶች አሉ'}
                    </span>
                    <p className="text-[10px] opacity-80 leading-normal">
                      {lang === 'en'
                        ? `You have ${offlineQueueCount} payment/transfer scans cached locally. They will process automatically once online.`
                        : `${offlineQueueCount} ከመስመር ውጭ የተቃኙ የክፍያ መዝገቦች ተቀምጠዋል። መስመር ላይ ሲሆኑ በራስ-ሰር ይተላለፋሉ።`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={forceProcessQueue}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold uppercase text-[9px] rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  {lang === 'en' ? 'Force Sync Now' : 'አሁን አስተላልፍ'}
                </button>
              </div>
            )}

            {/* STUNNING REALISTIC GRAPH */}
            <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">Historical Balance Drift</span>
                <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp size={9} /> Verified Audited Realtime
                </span>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData()} margin={{ top: 2, right: 2, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: isDarkMode ? '#18181b' : '#ffffff', border: '1px solid #e4e4e7', fontSize: '9px', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#balanceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LIVE DYNAMIC TRANSACTION STREAM */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase font-black text-stone-400 tracking-widest flex items-center gap-1.5">
                <Clock size={11} className="text-[#C5A059]" /> {lang === 'en' ? 'Live Audital Ledger Stream' : 'ቅጽበታዊ የሂሳብ ዝርዝር መዝገብ'}
              </h4>

              {transactions.slice(0, 4).map(tx => (
                <div key={tx.id} className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all text-xs font-sans ${isDarkMode ? 'bg-zinc-950/20 border-zinc-850 hover:bg-zinc-950/55' : 'bg-white border-stone-150 hover:bg-stone-50'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl border ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' || tx.type === 'LOTTERY_PRIZE' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-stone-500 border-stone-200 bg-stone-50'}`}>
                      {tx.type === 'DEPOSIT' && <ArrowDownLeft size={14} />}
                      {tx.type === 'WITHDRAWAL' && <ArrowUpRight size={14} />}
                      {tx.type === 'TRANSFER' && <ArrowLeftRight size={14} />}
                      {!(tx.type === 'DEPOSIT' || tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER') && <Landmark size={14} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-stone-800 dark:text-zinc-200 uppercase tracking-tight text-[10px]">{getTxTypeLabel(tx.type)}</span>
                        <span className={`text-[8.5px] font-black uppercase tracking-widest border rounded px-1 py-0.2 ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{tx.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono font-extrabold text-xs tracking-tight ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' || tx.type === 'LOTTERY_PRIZE' ? 'text-emerald-600' : 'text-stone-700 dark:text-stone-300'}`}>
                      {tx.type === 'DEPOSIT' || tx.type === 'REFUND' || tx.type === 'LOTTERY_PRIZE' ? '+' : '-'} {tx.amount.toLocaleString()} ETB
                    </span>
                    <span className="text-[8.5px] font-mono text-stone-400 block mt-0.5">{tx.reference}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PAY / DEPOSIT / WITHDRAW ACTIONS TAB */}
        {subTab === 'actions' && (
          <motion.div 
            key="actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* DEPOSIT CARD (INTEGRATING CHAPA/TELEBIRR) */}
            <form onSubmit={handleDepositSubmit} className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50/60 border-stone-200'}`}>
              <h3 className="text-xs font-black uppercase text-emerald-600 mb-3 flex items-center gap-1.5">
                <ArrowDownLeft size={16} /> Instant Escrow Deposit
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-400 tracking-wider">Select Pay Provider Gateway</label>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {(['Telebirr', 'Chapa', 'CBE', 'Awash Bank'] as const).map(provider => (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => setDepositProvider(provider)}
                        className={`py-1.5 rounded-xl border text-[10px] font-black transition-all ${depositProvider === provider ? 'bg-emerald-600/10 border-emerald-500 text-emerald-700 dark:text-emerald-450' : 'bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-600 hover:bg-stone-100'}`}
                      >
                         {provider === 'Telebirr' ? '📱 Telebirr' : provider === 'Chapa' ? '🦄 Chapa API' : provider === 'CBE' ? '🏛️ CBE Birr' : '💳 Awash'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-400 tracking-wider">Deposit Volume (ETB)</label>
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="E.g., 1000"
                    className="w-full mt-1 px-3 py-2 bg-white dark:bg-zinc-900 text-xs border border-stone-200 dark:border-zinc-805 rounded-xl font-mono text-emerald-600 font-extrabold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                >
                  🚀 Connect Gateway & Fetch Cash
                </button>
              </div>
            </form>

            {/* WITHDRAWAL CARD */}
            <form onSubmit={handleWithdrawalSubmit} className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50/60 border-stone-200'}`}>
              <h3 className="text-xs font-black uppercase text-[#C5A059] mb-3 flex items-center gap-1.5">
                <ArrowUpRight size={16} /> Bank Settlement Transfer
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-stone-400 tracking-wider">Provider</label>
                    <select
                      value={withdrawalProvider}
                      onChange={(e: any) => setWithdrawalProvider(e.target.value)}
                      className="w-full mt-1 px-2 py-1.5 bg-white dark:bg-zinc-900 text-[10px] font-bold border border-stone-200 dark:border-zinc-805 rounded-xl focus:outline-none"
                    >
                      <option value="CBE">🏛️ Commercial Bank of Ethiopia (CBE)</option>
                      <option value="Telebirr">📱 Telebirr App</option>
                      <option value="Awash Bank">💳 Awash Pro Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-stone-400 tracking-wider">Account Number</label>
                    <input 
                      type="text"
                      value={withdrawalAccount}
                      onChange={(e) => setWithdrawalAccount(e.target.value)}
                      placeholder="Account reference info"
                      className="w-full mt-1 px-2.5 py-1.5 bg-white dark:bg-zinc-900 text-[10px] border border-stone-200 dark:border-zinc-805 rounded-xl font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-400 tracking-wider">Withdrawal Value (ETB)</label>
                  <input 
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="ETB amount"
                    className="w-full mt-1 px-3 py-2 bg-white dark:bg-zinc-900 text-xs border border-stone-200 dark:border-zinc-805 rounded-xl font-mono text-amber-600 font-extrabold focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-stone-850 hover:bg-stone-900 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                >
                  📥 Dispense External Cash Outflow
                </button>
              </div>
            </form>

            {/* P2P PEER TRANSFERS (WITH FRAUD CHECKS) */}
            <form onSubmit={handleTransferSubmit} className={`p-3.5 rounded-2xl border md:col-span-2 ${isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-stone-50/60 border-stone-200'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black uppercase text-amber-500 flex items-center gap-1.5">
                  <ArrowLeftRight size={16} /> Instant peer-to-peer (P2P) transfers
                </h3>
                <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1 py-0.5 rounded font-black tracking-widest uppercase">
                  👮 Risk Guard Live
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-400 tracking-wider">Target Recipient (User / Phone)</label>
                  <input 
                    type="text"
                    required
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    placeholder="E.g., fita_kebede@tele.et"
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-zinc-900 text-xs border border-stone-200 dark:border-zinc-805 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-400 tracking-wider">Transfer Amount (ETB)</label>
                  <input 
                    type="number"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Amount to send"
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-zinc-900 text-xs border border-stone-200 dark:border-zinc-805 rounded-xl font-mono text-zinc-800 dark:text-zinc-100 font-extrabold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-400 tracking-wider">Transaction Note (Reference)</label>
                  <input 
                    type="text"
                    value={transferDesc}
                    onChange={(e) => setTransferDesc(e.target.value)}
                    placeholder="Optional message context"
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-zinc-900 text-xs border border-stone-200 dark:border-zinc-805 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl text-xs transition-all shadow-sm"
              >
                🔐 Execute Secure P2P Wallet Transfer
              </button>
            </form>

            {/* MANUAL OFFLINE DEPOSIT AUDITING UPLOADER (STANDALONE CARD) */}
            <form onSubmit={handleManualPaymentSubmit} className={`p-4 rounded-2xl border md:col-span-2 space-y-4 bg-gradient-to-br ${isDarkMode ? 'from-zinc-950/80 to-zinc-900 border-zinc-800' : 'from-stone-50 to-stone-100 border-stone-250'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-black uppercase text-[#D4AF37] flex items-center gap-1.5">
                    🏛️ Fallback Direct Manual Payment & Premium Active Rent
                  </h3>
                  <p className="text-[10px] text-stone-400 mt-1 leading-normal">
                    If an automated checkout behaves unstably, transfer ETB manually via your mobile banking apps and submit the claim reference log below.
                  </p>
                </div>
                <span className="text-[8.5px] font-black bg-stone-100 text-stone-500 border dark:bg-zinc-800 border-stone-200 rounded px-1.5 py-0.5 uppercase tracking-wide">
                  Offline Ticket Queue
                </span>
              </div>

              {/* Bank credentials settlement guidelines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-500/5 border border-amber-500/25 rounded-xl text-xs leading-relaxed">
                <div>
                  <div className="text-[9.5px] uppercase font-black text-amber-500 tracking-wider">Settlement Bank Account (CBE / Abyssinia)</div>
                  <div className="font-extrabold text-[#D4AF37] mt-0.5">Bank of Abyssinia (የአቢሲኒያ ባንክ)</div>
                  <div className="font-mono font-black mt-0.2 text-stone-700 dark:text-zinc-200 select-all text-xs">Account: 65965275</div>
                </div>
                <div>
                  <div className="text-[9.5px] uppercase font-black text-amber-500 tracking-wider">Owner Direct Phone Alerts</div>
                  <div className="font-extrabold text-[#D4AF37] mt-0.5">Everyzone Administrator Office</div>
                  <div className="font-mono font-black mt-0.2 text-stone-700 dark:text-zinc-200 select-all text-xs">Phone: +251932011500</div>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-405 tracking-wider">Payment Channel Network</label>
                  <select
                    value={manualChannel}
                    onChange={(e: any) => setManualChannel(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 rounded-xl text-xs font-bold leading-none select-none focus:outline-none"
                  >
                    <option value="Telebirr">📱 Telebirr (ቴሌብር)</option>
                    <option value="CBE Birr">ሲቢኢ ብር (CBE Birr)</option>
                    <option value="Bank of Abyssinia">የአቢሲኒያ ባንክ (Bank of Abyssinia - Apollo)</option>
                    <option value="Awash Birr">አዋሽ ብር (Awash Birr)</option>
                    <option value="Dashen Bank / Amole">ዳሽን ባንክ / Amole</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-405 tracking-wider">Transaction Reference Number</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., REF-65275"
                    value={manualRef}
                    onChange={(e) => setManualRef(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 rounded-xl text-xs font-mono font-black placeholder-stone-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-450 tracking-wider">Your Email Account</label>
                  <input
                    type="email"
                    required
                    placeholder="depositor@everyzone.com"
                    value={manualDepositorEmail}
                    onChange={(e) => setManualDepositorEmail(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-stone-250 dark:border-zinc-800 rounded-xl text-xs font-sans font-semibold placeholder-stone-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="text-[9px] font-bold uppercase text-stone-405 tracking-wider">Proof Screenshot Hash / Offline Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Scan text or code string (E.g., PROOF-AX-993)"
                    value={manualProofCode}
                    onChange={(e) => setManualProofCode(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-stone-250 dark:border-zinc-805 rounded-xl text-xs font-mono placeholder-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Success / Error notification logs */}
              {manualAlertMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-450 rounded-xl text-[11px] leading-relaxed font-sans font-bold flex items-start gap-2 animate-pulse">
                  <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="block uppercase text-[9.5px] font-black tracking-wider">💬 SMS ALERT / IN-APP NOTIFICATION:</span>
                    <div>"{manualAlertMsg}"</div>
                  </div>
                </div>
              )}

              {manualErrorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-650 rounded-xl text-xs font-bold leading-relaxed flex items-center gap-1.5">
                  <AlertTriangle size={15} /> Error submitting claim: {manualErrorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitInProgress}
                className="w-full py-3 bg-[#1E3A1A] hover:bg-[#152a13] text-white font-extrabold rounded-xl text-xs transition-all shadow-md select-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitInProgress ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Verifying Reference logs...
                  </>
                ) : (
                  <>
                    🔐 Dispatch Manual Claim Ticket & Verification Alerts
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* ESCROW CONTRACTS TAB */}
        {subTab === 'escrow' && (
          <motion.div 
            key="escrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className={`p-3 rounded-2xl border flex items-start gap-3 ${isDarkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-amber-50/50 border-amber-200/50'}`}>
              <ShieldCheck size={20} className="text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#C5A059] tracking-wider block">Escrow Security System</span>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Every pre-booking or product purchase is held in our neutral trust vault. Funds are only transferred to vendors when you click <strong className="text-stone-700 dark:text-zinc-300">Release</strong>, or can be claimed instantly back through <strong className="text-stone-705">Claim Refund</strong> if delivery criteria fails.
                </p>
              </div>
            </div>

            {escrows.map(esc => (
              <div key={esc.id} className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDarkMode ? 'bg-zinc-950/20 border-zinc-500/20' : 'bg-white border-stone-200'}`}>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-extrabold text-stone-800 dark:text-zinc-200">{esc.vendorName}</span>
                    <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded ${esc.status === 'HELD' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : esc.status === 'RELEASED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
                      🔐 {esc.status === 'HELD' ? 'Vetted / Held' : esc.status === 'RELEASED' ? 'Released to Vendor' : 'Cancelled / Refunded'}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 space-x-2">
                    <span>Order: <strong>{esc.orderId}</strong></span>
                    <span>•</span>
                    <span>Created: <strong>{new Date(esc.createdAt).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-black text-xs text-[#1E3A1A] dark:text-emerald-450 block">{esc.amount.toLocaleString()} ETB</span>
                    <span className="text-[8px] uppercase tracking-wider text-stone-400 block">Locked Value</span>
                  </div>

                  {esc.status === 'HELD' && (
                    <div className="flex gap-1.5 shrink-0">
                      <button 
                        onClick={() => handleReleaseEscrow(esc.id, esc.amount)}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black uppercase"
                      >
                        Release
                      </button>
                      <button 
                        onClick={() => handleRefundEscrow(esc.id, esc.amount)}
                        className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[9px] font-black uppercase"
                      >
                        Refund
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* LEDGERS TAB */}
        {subTab === 'ledgers' && (
          <motion.div 
            key="ledgers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2.5"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-extrabold uppercase text-stone-400 tracking-wider">Triple-Entry Bookkeeping Ledger Integrity</span>
              <span className="text-[8.5px] font-mono font-black text-stone-450">Active SHA-256 Ledger Block</span>
            </div>

            {ledgers.map(ldg => {
              const pairedTx = transactions.find(t => t.id === ldg.transactionId);
              return (
                <div key={ldg.id} className={`p-3 rounded-2xl border font-mono text-[10px] transition-all hover:border-[#C5A059] ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-650'}`}>
                  <div className="flex justify-between items-start border-b border-stone-200/40 dark:border-zinc-800/40 pb-1.5 mb-1.5">
                    <div>
                      <span className="text-[#C5A059] font-black">ENT_ID: #{ldg.id}</span>
                      <span className="text-stone-400 ml-2">Paired TX: {ldg.transactionId}</span>
                    </div>
                    <span className="text-stone-400">{new Date(ldg.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10.5px]">
                    <div>
                      <span className="text-stone-400 text-[9px] block">CARRY BEFORE</span>
                      <span className="font-bold text-stone-800 dark:text-zinc-200">{ldg.balanceBefore.toLocaleString()} ETB</span>
                    </div>

                    <div>
                      <span className="text-stone-400 text-[9px] block">CARRY AFTER</span>
                      <span className="font-bold text-stone-800 dark:text-zinc-200">{ldg.balanceAfter.toLocaleString()} ETB</span>
                    </div>

                    <div>
                      <span className="text-stone-400 text-[9px] block">DRIFT FLOW</span>
                      <span className={`font-black ${ldg.balanceAfter > ldg.balanceBefore ? 'text-emerald-600' : 'text-red-500'}`}>
                        {ldg.balanceAfter > ldg.balanceBefore ? '+' : ''}{(ldg.balanceAfter - ldg.balanceBefore).toLocaleString()} ETB
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 text-[9px] block">AUDIT SECURITY</span>
                      <span className="text-emerald-500 flex items-center gap-0.5 font-bold uppercase text-[9px]">
                        <ShieldCheck size={10} /> Validated
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* FRAUD RISK MONITORING TAB */}
        {subTab === 'risk' && (
          <motion.div 
            key="risk"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className={`p-3 rounded-2xl border flex items-center gap-3 ${isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}>
              <ShieldAlert size={28} className="text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#C5A059] tracking-wider block">Autonomous Anti-Fraud Risk Scoring Monitor</span>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Our system evaluates active transaction fingerprint telemetry points and scores risks in accordance with Ethiopian cyber-crimes prevention compliance guidelines. Transfer frequencies and large payouts are flagged automatically.
                </p>
              </div>
            </div>

            {riskEvents.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-stone-200 rounded-2xl">
                <ShieldCheck className="mx-auto text-emerald-500 mb-1" size={24} />
                <p className="text-[11px] text-stone-500">Zero policy risk flags in current session window.</p>
              </div>
            ) : (
              riskEvents.map(risk => (
                <div key={risk.id} className={`p-3 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${isDarkMode ? 'bg-zinc-950/20 border-zinc-850' : 'bg-red-50/10 border-stone-200'}`}>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className={`shrink-0 mt-0.5 ${risk.riskScore > 0.8 ? 'text-red-500 animate-bounce' : 'text-amber-500'}`} size={16} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-stone-700 dark:text-zinc-200 font-mono">RISK_EVENT: #{risk.id}</span>
                        <span className="text-[9px] text-stone-405 font-sans">• {new Date(risk.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">{risk.reason}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-base font-black font-mono block ${risk.riskScore > 0.8 ? 'text-red-600' : risk.riskScore > 0.4 ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {(risk.riskScore * 100).toFixed(0)}%
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-stone-440 block font-bold">Severity Score</span>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* DIGITAL RECEIPT GENERATOR OVERLAY */}
      <AnimatePresence>
        {recentReceipt && (
          <div className="fixed inset-0 z-55 flex items-center justify-center bg-stone-950/75 backdrop-blur-xs p-4 font-sans select-none">
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="w-full max-w-sm bg-white text-stone-900 rounded-[28px] overflow-hidden shadow-2xl border-2 border-stone-200 relative flex flex-col"
            >
              <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-red-500 w-full" />
              
              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-center border-b pb-2.5 border-stone-150">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 text-lg">📄</span>
                    <span className="font-extrabold text-[10px] uppercase tracking-widest text-[#1E3A1A]">EVERY-ZONE DIGITAL LEDGER RECEIPT</span>
                  </div>
                  <button
                    onClick={() => setRecentReceipt(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <XCircle size={16} />
                  </button>
                </div>

                {/* Receipt printable container */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 font-mono text-[10.5px]">
                  <div className="text-center py-2 border-b border-dashed border-stone-300">
                    <h4 className="text-xs font-black uppercase text-[#1E3A1A] tracking-wider">PAYMENT CONFIRMED ✓</h4>
                    <span className="text-[9px] text-stone-405 font-normal">{recentReceipt.timestamp}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Transaction ID:</span>
                      <span className="font-bold text-stone-800">{recentReceipt.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Reference:</span>
                      <span className="font-bold text-stone-800">{recentReceipt.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Transaction Type:</span>
                      <span className="font-bold uppercase text-emerald-600">{recentReceipt.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Description:</span>
                      <span className="font-bold text-stone-800 text-right max-w-[200px] truncate">{recentReceipt.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Gross Amount:</span>
                      <span className="font-black text-stone-905">{recentReceipt.amount.toLocaleString()}.00 ETB</span>
                    </div>
                    {recentReceipt.feePaid && (
                      <div className="flex justify-between text-stone-600">
                        <span className="text-stone-400">System Processing Fee:</span>
                        <span className="font-bold text-stone-700">+{recentReceipt.feePaid.toLocaleString()} ETB</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-dashed border-stone-300 pt-3 flex justify-between items-center text-xs">
                    <span className="font-extrabold text-[#1E3A1A]">NET DEBIT:</span>
                    <span className="font-black text-[#1E3A1A] text-sm">
                      {((recentReceipt.amount + (recentReceipt.feePaid || 0))).toLocaleString()}.00 ETB
                    </span>
                  </div>

                  {/* Certified stamp */}
                  <div className="border-t border-stone-200 pt-3.5 flex flex-col items-center space-y-1 relative">
                    <div className="inline-block border border-emerald-500/30 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full transform -rotate-1">
                       ★ Every-Zone Certified Ledger ★
                    </div>
                    <span className="text-[7.5px] text-stone-400">Ministry of Revenue Compliant System</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      alert("📸 Receipt Saved!\nDigital transaction receipt sheet has been downloaded to device database file cabinet successfully.");
                      setRecentReceipt(null);
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-xl shadow transition-colors cursor-pointer"
                  >
                    📥 Save Receipt / ደረሰኝ አስቀምጥ
                  </button>
                  <button
                    onClick={() => setRecentReceipt(null)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-605 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2FA PIN/OTP SECURITY GATES */}
      {securityAction && (
        <PIN2FASecurityGate
          actionName={securityAction.name}
          actionNameAm={securityAction.nameAm}
          isDarkMode={isDarkMode}
          lang={lang}
          onSuccess={securityAction.onVerify}
          onCancel={() => setSecurityAction(null)}
        />
      )}

      <PassportQRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        lang={lang}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
