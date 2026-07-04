import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Settings, Users, Activity, BarChart3, AlertTriangle, 
  CheckCircle2, XCircle, RefreshCw, Send, Plus, Server, FileText,
  DollarSign, Mail, Heart, Sparkles, MessageSquare, Clipboard, ShieldAlert as ShieldIcon,
  Download, Trash2, Key, ToggleLeft, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip 
} from 'recharts';
import { FraudReportsDashboard } from './FraudReportsDashboard';

interface SubAdmin {
  id: string;
  email: string;
  fullName: string;
  role: string;
  verificationStatus: string;
  subAdminPermission?: {
    id?: string;
    canManageShops: boolean;
    canManageHouses: boolean;
    canManageLottery: boolean;
  };
}

interface ManualPayment {
  id: string;
  userId: string;
  paymentChannel: string;
  referenceNumber: string;
  offlineProofCode?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
}

interface SuperAdminControlProps {
  isDarkMode: boolean;
  onBlockVendor: (vendorId: string) => void;
  lang: 'en' | 'am';
}

export function SuperAdminControl({ isDarkMode, onBlockVendor, lang }: SuperAdminControlProps) {
  const [adminTab, setAdminTab] = useState<'overview' | 'subadmins' | 'manual_payments' | 'restoration' | 'fraud'>('overview');
  
  // Real active analytics state
  const [analytics, setAnalytics] = useState({
    totalRevenue: "14,800.00 ETB",
    activeVendors: 1,
    totalMatchedUsers: 2450,
    pendingVerifications: 0
  });

  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [manualPayments, setManualPayments] = useState<ManualPayment[]>([]);
  const [fraudReports, setFraudReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [subAdminPhoneReset, setSubAdminPhoneReset] = useState('');
  const [superAdminPhoneResetInput, setSuperAdminPhoneResetInput] = useState('');
  const [resetLogs, setResetLogs] = useState<string[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Simulation telemetry latency
  const [liveLatency, setLiveLatency] = useState<{ time: string; latency: number }[]>([
    { time: '10:00', latency: 42 },
    { time: '10:10', latency: 38 },
    { time: '10:20', latency: 45 },
    { time: '10:30', latency: 50 },
    { time: '10:40', latency: 39 },
    { time: '10:50', latency: 44 },
    { time: '11:00', latency: 41 }
  ]);

  // Fetch all endpoints
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const payload = await response.json();
        if (payload.status === 'success') {
          setAnalytics(payload.analytics);
        }
      }
    } catch (e) {
      console.error("error loading analytics", e);
    }
  };

  const fetchSubAdmins = async () => {
    try {
      const response = await fetch('/api/admin/subadmins');
      if (response.ok) {
        const payload = await response.json();
        if (payload.status === 'success') {
          setSubAdmins(payload.subAdmins);
        }
      }
    } catch (e) {
      console.error("error loading subadmins", e);
    }
  };

  const fetchManualPayments = async () => {
    try {
      const response = await fetch('/api/admin/manual-payments');
      if (response.ok) {
        const payload = await response.json();
        if (payload.status === 'success') {
          setManualPayments(payload.payments);
        }
      }
    } catch (e) {
      console.error("error loading manual payments", e);
    }
  };

  const fetchFraudReports = async () => {
    try {
      const response = await fetch('/api/admin/reports');
      if (response.ok) {
        const payload = await response.json();
        if (payload.status === 'success') {
          setFraudReports(payload.reports);
        }
      }
    } catch (e) {
      console.error("error loading fraud reports", e);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchAnalytics(), fetchSubAdmins(), fetchManualPayments(), fetchFraudReports()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [adminTab]);

  // Handle live Server latency fluctuating representation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(prev => {
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const nextVal = Math.floor(Math.random() * 25) + 30;
        return [...prev.slice(1), { time: nextTime, latency: nextVal }];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update granular permissions for SUB_ADMIN
  const handleTogglePermission = async (subAdminId: string, permissionKey: 'canManageShops' | 'canManageHouses' | 'canManageLottery') => {
    setUpdatingId(subAdminId);
    const sub = subAdmins.find(x => x.id === subAdminId);
    if (!sub) return;

    const permissions = sub.subAdminPermission || {
      canManageShops: false,
      canManageHouses: false,
      canManageLottery: false
    };

    const payload = {
      subAdminId,
      canManageShops: permissionKey === 'canManageShops' ? !permissions.canManageShops : permissions.canManageShops,
      canManageHouses: permissionKey === 'canManageHouses' ? !permissions.canManageHouses : permissions.canManageHouses,
      canManageLottery: permissionKey === 'canManageLottery' ? !permissions.canManageLottery : permissions.canManageLottery,
    };

    try {
      const response = await fetch('/api/admin/set-subadmin-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Refresh 
        await fetchSubAdmins();
      } else {
        alert("Authorization assignment failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Verify and Approve/Reject manual payment references
  const handleVerifyPayment = async (paymentId: string, actionStatus: 'APPROVED' | 'REJECTED') => {
    setUpdatingId(paymentId);
    try {
      const response = await fetch('/api/admin/verify-manual-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentId, status: actionStatus })
      });

      if (response.ok) {
        alert(`Payment reference entry ${actionStatus} successfully! Initialized updates.`);
        await Promise.all([fetchManualPayments(), fetchAnalytics()]);
      } else {
        alert("Failed to record manual approval status.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Re-enable/unban suspended user
  const handleReenableSuspension = async (userId: string) => {
    try {
      const resp = await fetch('/api/admin/reset-user-suspension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (resp.ok) {
        alert("User restriction unlocked and attempts cleared safely!");
        await fetchSubAdmins();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit fraud report review action
  const handleReviewReport = async (reportId: string, statusVal: string, resolutionText: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'u-super-admin',
          notes: `Handled at ${new Date().toLocaleDateString()}`,
          status: statusVal,
          resolution: resolutionText
        })
      });
      if (response.ok) {
        alert(`Report marked as ${statusVal} successfully!`);
        await fetchFraudReports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Suspend a fraudulent vendor
  const handleSuspendVendor = async (vendorId: string, reasonText: string) => {
    try {
      const response = await fetch('/api/admin/vendors/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          reason: reasonText,
          suspendedBy: 'u-super-admin'
        })
      });
      if (response.ok) {
        alert("Vendor shop suspended, status updated, and escrow safeguards triggered!");
        await fetchFraudReports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Restore vendor status
  const handleRestoreVendor = async (vendorId: string) => {
    try {
      const response = await fetch('/api/admin/vendors/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId })
      });
      if (response.ok) {
        alert("Vendor subscription restored to ACTIVE!");
        await fetchFraudReports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Data backup download
  const handleDownloadBackup = () => {
    window.open('/api/admin/backup', '_blank');
  };

  // Master reset execution
  const handleMasterCleanAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (superAdminPhoneResetInput !== "+251932011500") {
      alert("❌ STRICT DENIAL: Inputted phone number does not matches with global super admin master identity signature.");
      return;
    }

    if (!confirm("⚠️ CRITICAL ACTION: This clears all mock system manual payments, resets failed logs, and sets default active vendors. Proceed?")) {
      return;
    }

    try {
      const response = await fetch('/api/admin/reset-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ superAdminPhone: superAdminPhoneResetInput })
      });

      const data = await response.json();
      if (response.ok) {
        setResetLogs(prev => [...prev, `[SUCCESS - ${new Date().toLocaleTimeString()}] ${data.message}`]);
        alert("🧹 Platform master database fully restored to clear production defaults.");
        setSuperAdminPhoneResetInput('');
        loadAll();
      } else {
        setResetLogs(prev => [...prev, `[FAIL - ${new Date().toLocaleTimeString()}] ${data.error}`]);
        alert(`Reset denied: ${data.error}`);
      }
    } catch (err: any) {
      alert("Reset execution crashed");
    }
  };

  return (
    <div className={`rounded-3xl border shadow-sm transition-all duration-300 overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-850'}`}>
      
      {/* Dynamic Title Bar embroidery */}
      <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r ${isDarkMode ? 'from-zinc-950 to-zinc-900 border-zinc-805' : 'from-[#1E3A1A]/8 to-[#1E3A1A]/3 border-stone-200'}`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-red-600/10 text-red-650 rounded-2xl animate-pulse shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-600 block">👮 Abyssinian Control Desk</span>
            <h3 className="text-sm font-black font-sans">
              {lang === 'en' ? 'Every-Zone Control Dashboard' : 'የቁጥጥር ማዕከላዊ አስተዳዳሪ ሰሌዳ'}
            </h3>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex bg-stone-100 dark:bg-zinc-950/80 p-1 rounded-xl text-[9.5px] font-black uppercase tracking-wider select-none shrink-0 overflow-x-auto gap-0.5">
          <button 
            type="button" 
            onClick={() => setAdminTab('overview')} 
            className={`px-3 py-1.5 rounded-lg transition-all text-center min-h-[35px] cursor-pointer flex items-center gap-1 shrink-0 ${adminTab === 'overview' ? 'bg-neutral-900 text-white dark:bg-zinc-800' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <BarChart3 size={11} /> Overview
          </button>
          <button 
            type="button" 
            onClick={() => setAdminTab('subadmins')} 
            className={`px-3 py-1.5 rounded-lg transition-all text-center min-h-[35px] cursor-pointer flex items-center gap-1 shrink-0 ${adminTab === 'subadmins' ? 'bg-neutral-900 text-white dark:bg-zinc-800' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <Users size={11} /> Sub-Admin RBAC
          </button>
          <button 
            type="button" 
            onClick={() => setAdminTab('manual_payments')} 
            className={`px-3 py-1.5 rounded-lg transition-all text-center min-h-[35px] cursor-pointer flex items-center gap-1 shrink-0 ${adminTab === 'manual_payments' ? 'bg-neutral-900 text-white dark:bg-zinc-800' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <DollarSign size={11} /> manual auditing ({manualPayments.filter(p => p.status === 'PENDING').length})
          </button>
          <button 
            type="button" 
            onClick={() => setAdminTab('restoration')} 
            className={`px-3 py-1.5 rounded-lg transition-all text-center min-h-[35px] cursor-pointer flex items-center gap-1 shrink-0 ${adminTab === 'restoration' ? 'bg-neutral-900 text-white dark:bg-zinc-800' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <Server size={11} /> backup & reset
          </button>
          <button 
            type="button" 
            onClick={() => setAdminTab('fraud')} 
            className={`px-3 py-1.5 rounded-lg transition-all text-center min-h-[35px] cursor-pointer flex items-center gap-1 shrink-0 ${adminTab === 'fraud' ? 'bg-neutral-900 text-white dark:bg-zinc-800' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <AlertTriangle size={11} /> Fraud & Abuse ({fraudReports.length})
          </button>
        </div>
      </div>

      {/* ADMIN BODY STAGE */}
      <div className="p-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-stone-405">
            <RefreshCw size={14} className="animate-spin" /> Synchronising live database states...
          </div>
        )}

        {/* TAB 1: OVERVIEW & METRICS */}
        {adminTab === 'overview' && !loading && (
          <div className="space-y-4">
            {/* Live Metrics Ribbon widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-4.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-200'}`}>
                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-tight">Total revenue (ETB)</span>
                <span className="text-sm font-black font-mono text-[#D4AF37] block mt-1">{analytics.totalRevenue}</span>
                <span className="text-[8.5px] text-emerald-600 block mt-0.5">Automated webhooks + approved logs</span>
              </div>
              <div className={`p-4.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-200'}`}>
                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-tight">Active merchants</span>
                <span className="text-sm font-black font-mono text-stone-800 dark:text-zinc-100 block mt-1">{analytics.activeVendors} Active</span>
                <span className="text-[8.5px] text-stone-405 block mt-0.5">Shops with updated active rents</span>
              </div>
              <div className={`p-4.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-200'}`}>
                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-tight">matched population</span>
                <span className="text-sm font-black font-mono text-zinc-800 dark:text-zinc-100 block mt-1">{analytics.totalMatchedUsers}</span>
                <span className="text-[8.5px] text-emerald-600 block mt-0.5">Fayda-linked pairing pools</span>
              </div>
              <div className={`p-4.5 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-200'}`}>
                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-tight">pending approvals</span>
                <span className="text-sm font-black font-mono text-amber-500 block mt-1">{analytics.pendingVerifications} Users</span>
                <span className="text-[8.5px] text-amber-500 block mt-0.5">Awaiting audit KYC queue</span>
              </div>
            </div>

            {/* Live Telemetry Server Processing Response Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`md:col-span-2 p-4 rounded-3xl border ${isDarkMode ? 'bg-zinc-950/50 border-zinc-850' : 'bg-[#FAF9F6] border-stone-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase text-stone-700 dark:text-zinc-200">Abyssinia central ledger network telemetry</h4>
                    <p className="text-[9.5px] text-stone-400">Response microchannel loops telemetry latency log updates.</p>
                  </div>
                  <span className="text-[9px] font-bold text-red-650 bg-red-500/10 px-2 py-0.5 rounded border border-red-200/40 animate-pulse">
                    Live system feed
                  </span>
                </div>

                <div className="aspect-video w-full max-h-[170px] select-none">
                  <ResponsiveContainer width="100%" height={170}>
                    <AreaChart data={liveLatency} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLatencyAdmin" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                      <XAxis dataKey="time" style={{ fontSize: '7.5px', fontWeight: 'bold' }} />
                      <YAxis style={{ fontSize: '8px' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="latency" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorLatencyAdmin)" name="Latency (ms)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Real-time system compliance messages audit */}
              <div className={`p-4 rounded-3xl border space-y-3 ${isDarkMode ? 'bg-zinc-950/50 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <h4 className="text-xs font-black uppercase text-amber-500 flex items-center gap-1 select-none">
                  <Clipboard size={12} /> Live Integrity Audits
                </h4>

                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  <div className="text-[9.5px] leading-relaxed border-b pb-1.5 font-mono text-stone-500">
                    <span className="text-green-600 font-bold">[RESOLVED]</span> Chapa rent webhooks activated successfully.
                    <div className="text-[8px] text-stone-400 mt-0.5">just now &bull; payload #WEB-APV</div>
                  </div>
                  <div className="text-[9.5px] leading-relaxed border-b pb-1.5 font-mono text-stone-500">
                    <span className="text-amber-500 font-bold">[MAN_APRV]</span> Handled manual CBE Birr transaction code audit.
                    <div className="text-[8px] text-stone-400 mt-0.5">3 mins ago &bull; payload #REF-09K</div>
                  </div>
                  <div className="text-[9.5px] leading-relaxed font-mono text-stone-500">
                    <span className="text-red-500 font-bold">[SEC_LOCK]</span> Auto suspended fraudulent reference code submitter on Telebirr.
                    <div className="text-[8px] text-stone-400 mt-0.5">12 mins ago &bull; user #FY-635</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUB-ADMINS & GRANULAR PERMISSIONS (RBAC CONTROL) */}
        {adminTab === 'subadmins' && !loading && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black uppercase text-stone-700 dark:text-zinc-200">
                  Sub-Administrators checklist & Permissions Matrix
                </h4>
                <p className="text-[10px] text-stone-400">Assign specific privileges to subadmin nodes. Click toggles to instantly update privileges.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {subAdmins.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-405 border rounded-2xl">
                  No active system SUB_ADMIN role profiles discovered.
                </div>
              ) : (
                subAdmins.map(sub => {
                  const perms = sub.subAdminPermission || {
                    canManageShops: false,
                    canManageHouses: false,
                    canManageLottery: false
                  };

                  return (
                    <div 
                      key={sub.id} 
                      className={`p-4 rounded-2xl border text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDarkMode ? 'bg-zinc-950/20 border-zinc-800' : 'bg-white border-stone-200'}`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-stone-800 dark:text-zinc-200 text-sm">{sub.fullName}</span>
                          <span className="text-[8.5px] font-black bg-[#1E3A1A]/10 text-[#1E3A1A] border rounded px-1.5 py-0.2 uppercase">
                            {sub.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono">{sub.email} &bull; ID: {sub.id}</p>
                      </div>

                      {/* RBAC Privilege matrix checkbox togglers */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(sub.id, 'canManageShops')}
                          disabled={updatingId === sub.id}
                          className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[10px] font-black uppercase flex items-center justify-between gap-4 cursor-pointer select-none transition-all ${perms.canManageShops ? 'bg-emerald-600/15 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-stone-50 dark:bg-zinc-900 border-stone-250 dark:border-zinc-800 text-stone-405'}`}
                        >
                          <span>Manage Shops</span>
                          <div className={`w-3 h-3 rounded-full ${perms.canManageShops ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePermission(sub.id, 'canManageHouses')}
                          disabled={updatingId === sub.id}
                          className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[10px] font-black uppercase flex items-center justify-between gap-4 cursor-pointer select-none transition-all ${perms.canManageHouses ? 'bg-emerald-600/15 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-stone-50 dark:bg-zinc-900 border-stone-250 dark:border-zinc-800 text-stone-405'}`}
                        >
                          <span>Manage Houses</span>
                          <div className={`w-3 h-3 rounded-full ${perms.canManageHouses ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePermission(sub.id, 'canManageLottery')}
                          disabled={updatingId === sub.id}
                          className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[10px] font-black uppercase flex items-center justify-between gap-4 cursor-pointer select-none transition-all ${perms.canManageLottery ? 'bg-emerald-600/15 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-stone-50 dark:bg-zinc-900 border-stone-250 dark:border-zinc-800 text-stone-405'}`}
                        >
                          <span>Manage Lotterys</span>
                          <div className={`w-3 h-3 rounded-full ${perms.canManageLottery ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MANUAL DEPOSIT AUDITING QUEUE */}
        {adminTab === 'manual_payments' && !loading && (
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-black uppercase text-stone-700 dark:text-zinc-200">
                Pending offline Manual Payments Audits Queue
              </h4>
              <p className="text-[10px] text-stone-400">Claims submitted with reference codes from Telebirr, CBE, or Abyssinia. Approve status to activate their related vendor accounts.</p>
            </div>

            <div className="space-y-2.5">
              {manualPayments.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-405 border border-dashed rounded-2xl">
                  Manual auditing queue is clear. No pending submissions.
                </div>
              ) : (
                manualPayments.map(p => (
                  <div 
                    key={p.id} 
                    className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDarkMode ? 'bg-zinc-950/40 border-zinc-500/20' : 'bg-white border-stone-200'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-[#D4AF37] text-xs font-mono select-all">REF: {p.referenceNumber}</span>
                        <span className={`text-[8.5px] font-black border rounded px-1.5 py-0.2 uppercase ${p.status === 'PENDING' ? 'text-amber-500 bg-amber-500/10' : p.status === 'APPROVED' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-650 font-sans">
                        Channel: <strong>{p.paymentChannel}</strong> &bull; Proof ID Code: <strong>{p.offlineProofCode || 'Not provided'}</strong>
                      </p>
                      <p className="text-[9px] text-stone-400 font-mono mt-0.5">
                        Depositor: <strong>{p.user?.fullName || 'Ambek Everyzone'}</strong> &bull; Date: {new Date(p.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {p.status === 'PENDING' ? (
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleVerifyPayment(p.id, 'APPROVED')}
                          disabled={updatingId === p.id}
                          className="min-h-[44px] min-w-[90px] px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white hover:opacity-95 text-xs font-black rounded-xl cursor-pointer select-none"
                        >
                          Approve Rent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerifyPayment(p.id, 'REJECTED')}
                          disabled={updatingId === p.id}
                          className="min-h-[44px] min-w-[90px] px-3 py-2 bg-red-150 border hover:bg-stone-200 text-red-700 text-xs font-bold rounded-xl cursor-pointer select-none"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="text-[9.5px] text-stone-450 uppercase tracking-wider font-extrabold flex items-center gap-1 shrink-0">
                        {p.status === 'APPROVED' ? <CheckCircle2 size={13} className="text-green-500" /> : <XCircle size={13} className="text-red-500" />} Verified
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: FRAUD & TRUST GUARD SYSTEM */}
        {adminTab === 'fraud' && !loading && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black uppercase text-stone-700 dark:text-zinc-200">
                  Fayda Guard: Fraud Investigations Queue (ማጭበርበር መቆጣጠሪያ)
                </h4>
                <p className="text-[10px] text-stone-400">Review reported listings, analyze auto-calculated risk indexes, and administer bans/suspensions instantly to safeguard buyers.</p>
              </div>
            </div>

            <FraudReportsDashboard 
              isDarkMode={isDarkMode} 
              reports={fraudReports} 
              onRefresh={async () => { await fetchFraudReports(); }} 
            />
          </div>
        )}

        {/* TAB 4: RESTORATION & SMART COMPLIANCE RESETS */}
        {adminTab === 'restoration' && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Automated Backups system */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-200'}`}>
                <h4 className="text-xs font-black uppercase text-stone-705 flex items-center gap-1.5">
                  <Download size={14} /> Smart nightly state backups
                </h4>
                <p className="text-[10px] text-stone-400 leading-normal">
                  Download full system snapshots, database listings cache, security ledger entries, and active chat logs in compressed JSON formatting.
                </p>

                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="w-full min-h-[44px] bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} /> Export Dynamic Database Snapshot
                </button>
              </div>

              {/* Master Super Admin cleanup */}
              <form onSubmit={handleMasterCleanAll} className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-zinc-950/40 border-zinc-850' : 'bg-[#FAF9F6] border-stone-200'}`}>
                <h4 className="text-xs font-black uppercase text-red-650 flex items-center gap-1.5">
                  <Trash2 size={14} /> Master data reset (ቁልፍ ዳግም ማስጀመር)
                </h4>
                <p className="text-[10px] text-stone-400 leading-normal">
                  Resets the database transactional tables, clears reference code collisions, reinstates fraud bans, and restores active vendor defaults. Restricted strictly to superfone match.
                </p>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter Super-Admin Phone (+251932011500)"
                    value={superAdminPhoneResetInput}
                    onChange={(e) => setSuperAdminPhoneResetInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-805 rounded-xl font-mono text-xs focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="w-full min-h-[44px] bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={13} /> Clear All & Reset Baseline Mock Data
                  </button>
                </div>
              </form>
            </div>

            {/* Reset dynamic actions streams */}
            {resetLogs.length > 0 && (
              <div className="p-3 rounded-xl bg-stone-900 text-[9px] font-mono text-emerald-400 space-y-1 max-h-[110px] overflow-y-auto">
                <div className="text-amber-400 font-bold tracking-tight uppercase">--- RESET AUDITING TRAIL ---</div>
                {resetLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
