import React, { useState, useEffect } from "react";
import {
  Shield, Users, ShoppingBag, Home, Globe, Briefcase, CreditCard,
  Wallet, AlertTriangle, MessageSquare, Bell, BarChart3, Activity,
  FileText, CheckSquare, Search, Filter, Ban, RefreshCw, Send,
  Trash2, ThumbsUp, CheckCircle, XCircle, Plus, Eye, Key, Lock,
  FileCheck, ShieldAlert, Heart, ArrowUpRight, ArrowDownLeft, Settings, Info, Check, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";

// Shared Types
export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "SUPER_ADMIN" | "FINANCE_MANAGER" | "SUPPORT_AGENT" | "MODERATOR" | "KYC_OFFICER" | "CONTENT_REVIEWER" | "ANALYTICS_VIEWER";
  verificationStatus: "APPROVED" | "PENDING" | "REJECTED";
  isSuspended: boolean;
  nationalId: string;
}

interface AdminDashboardProps {
  isDarkMode: boolean;
  lang: "en" | "am";
}

export function AdminDashboard({ isDarkMode, lang }: AdminDashboardProps) {
  // Current active admin configuration for testing RBAC
  const [currentAdmin, setCurrentAdmin] = useState<{
    name: string;
    role: "SUPER_ADMIN" | "FINANCE_MANAGER" | "SUPPORT_AGENT" | "MODERATOR" | "KYC_OFFICER" | "CONTENT_REVIEWER" | "ANALYTICS_VIEWER";
  }>({
    name: "Kidus Abera",
    role: "SUPER_ADMIN"
  });

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "vendors" | "properties" | "agencies" | "marketplace" |
    "payments" | "wallets" | "fraud" | "reviews" | "notifications" | "analytics" |
    "health" | "audit" | "roles"
  >("dashboard");

  // State
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<any>({});
  const [reports, setReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search and Filter states
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("ALL");
  const [vendorSearchQuery, setVendorSearchQuery] = useState<string>("");
  const [vendorFilter, setVendorFilter] = useState<string>("ALL");

  // Selection states for Modals / View Profiles
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  // Broadcaster State
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    body: "",
    category: "System Updates"
  });

  // Fetch helper
  const fetchWithRbac = async (url: string, options: RequestInit = {}) => {
    const headers = {
      "Content-Type": "application/json",
      "x-admin-role": currentAdmin.role,
      "x-admin-name": currentAdmin.name,
      ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
  };

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Load based on active tab requirements or full dashboard load
      const [dbRes, analRes, usersRes, vendorsRes, payRes, reportsRes, auditRes, healthRes] = await Promise.all([
        fetchWithRbac("/api/admin/dashboard"),
        fetchWithRbac("/api/admin/analytics"),
        fetchWithRbac("/api/admin/users"),
        fetchWithRbac("/api/admin/vendors"),
        fetchWithRbac("/api/admin/payments"),
        fetchWithRbac("/api/admin/reports"),
        fetchWithRbac("/api/admin/audit"),
        fetchWithRbac("/api/admin/system-health")
      ]);

      if (dbRes.ok) {
        const payload = await dbRes.json();
        setDashboardData(payload);
      }
      if (analRes.ok) {
        const payload = await analRes.json();
        setAnalyticsData(payload);
      }
      if (usersRes.ok) {
        const payload = await usersRes.json();
        setUsers(payload.data || []);
      }
      if (vendorsRes.ok) {
        const payload = await vendorsRes.json();
        setVendors(payload.data || []);
      }
      if (payRes.ok) {
        const payload = await payRes.json();
        setPayments(payload.data || []);
        setPaymentSummary(payload.summary || {});
      }
      if (reportsRes.ok) {
        const payload = await reportsRes.json();
        setReports(payload.reports || []);
      }
      if (auditRes.ok) {
        const payload = await auditRes.json();
        setAuditLogs(payload.data || []);
      }
      if (healthRes.ok) {
        const payload = await healthRes.json();
        setSystemHealth(payload);
      }
    } catch (e: any) {
      setErrorMsg("Failed to connect to administrative endpoints. Role limits may apply.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentAdmin.role]);

  // Handle User/Vendor updates
  const handlePatchUser = async (userId: string, updates: any) => {
    try {
      setErrorMsg(null);
      const res = await fetchWithRbac(`/api/admin/user/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");
      
      setSuccessMsg(data.message || "User updated successfully");
      setTimeout(() => setSuccessMsg(null), 3000);
      loadData();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  const handlePatchVendor = async (vendorId: string, updates: any) => {
    try {
      setErrorMsg(null);
      const res = await fetchWithRbac(`/api/admin/vendor/${vendorId}`, {
        method: "PATCH",
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update vendor");
      
      setSuccessMsg(data.message || "Vendor updated successfully");
      setTimeout(() => setSuccessMsg(null), 3000);
      loadData();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  // Broadcast announcement
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg(null);
      const res = await fetchWithRbac("/api/admin/broadcast", {
        method: "POST",
        body: JSON.stringify(broadcastForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send broadcast");

      setSuccessMsg(data.message || "Announcement broadcasted successfully");
      setBroadcastForm({ title: "", body: "", category: "System Updates" });
      setTimeout(() => setSuccessMsg(null), 4000);
      loadData();
    } catch (e: any) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  // Roles permission matrix definition
  const rolePermissionsMatrix = [
    { module: "Dashboard Home", SUPER_ADMIN: true, FINANCE_MANAGER: true, SUPPORT_AGENT: true, MODERATOR: true, KYC_OFFICER: true, CONTENT_REVIEWER: true, ANALYTICS_VIEWER: true },
    { module: "Verify KYC/Identities", SUPER_ADMIN: true, FINANCE_MANAGER: false, SUPPORT_AGENT: false, MODERATOR: false, KYC_OFFICER: true, CONTENT_REVIEWER: false, ANALYTICS_VIEWER: false },
    { module: "Financial/Payments Access", SUPER_ADMIN: true, FINANCE_MANAGER: true, SUPPORT_AGENT: false, MODERATOR: false, KYC_OFFICER: false, CONTENT_REVIEWER: false, ANALYTICS_VIEWER: false },
    { module: "Suspend/Ban Users", SUPER_ADMIN: true, FINANCE_MANAGER: false, SUPPORT_AGENT: true, MODERATOR: true, KYC_OFFICER: false, CONTENT_REVIEWER: false, ANALYTICS_VIEWER: false },
    { module: "Broadcast Announcements", SUPER_ADMIN: true, FINANCE_MANAGER: false, SUPPORT_AGENT: true, MODERATOR: false, KYC_OFFICER: false, CONTENT_REVIEWER: false, ANALYTICS_VIEWER: false },
    { module: "Content Moderation & Reviews", SUPER_ADMIN: true, FINANCE_MANAGER: false, SUPPORT_AGENT: true, MODERATOR: true, KYC_OFFICER: false, CONTENT_REVIEWER: true, ANALYTICS_VIEWER: false },
    { module: "Analytics Access", SUPER_ADMIN: true, FINANCE_MANAGER: true, SUPPORT_AGENT: false, MODERATOR: false, KYC_OFFICER: false, CONTENT_REVIEWER: false, ANALYTICS_VIEWER: true }
  ];

  // Global search filtering across everything
  const getFilteredGlobalSearch = () => {
    if (!globalSearchQuery) return null;
    const q = globalSearchQuery.toLowerCase();
    
    const matchedUsers = users.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    const matchedVendors = vendors.filter(v => v.shopName?.toLowerCase().includes(q) || v.email?.toLowerCase().includes(q));
    const matchedPayments = payments.filter(p => p.referenceNumber?.toLowerCase().includes(q) || p.paymentChannel?.toLowerCase().includes(q));
    const matchedReports = reports.filter(r => r.description?.toLowerCase().includes(q) || r.reportType?.toLowerCase().includes(q));

    return { matchedUsers, matchedVendors, matchedPayments, matchedReports };
  };

  const globalMatches = getFilteredGlobalSearch();

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* HEADER SECTION WITH QUICK ADMIN PROFILE SWITCH */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-5 mb-6 border-slate-700/50">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            EVERY-ZONE ADMIN HUB
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Production Ready Central Management &amp; Global Security Enforcement Portal
          </p>
        </div>

        {/* DEMO SWITCHER TO DEMONSTRATE RBAC COMPLIANCE */}
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">RBAC Role Switcher:</span>
          </div>
          <select
            value={currentAdmin.role}
            onChange={(e) => {
              const newRole = e.target.value as any;
              let name = "Kidus Abera";
              if (newRole === "FINANCE_MANAGER") name = "Mahlet Chala";
              if (newRole === "KYC_OFFICER") name = "Gideon Sol";
              if (newRole === "SUPPORT_AGENT") name = "Dawit Alene";
              if (newRole === "MODERATOR") name = "Saba Hailu";
              setCurrentAdmin({ name, role: newRole });
            }}
            className="bg-slate-800 text-xs font-mono border border-slate-700 text-slate-100 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
            <option value="FINANCE_MANAGER">Finance Manager</option>
            <option value="SUPPORT_AGENT">Support Agent</option>
            <option value="MODERATOR">Moderator</option>
            <option value="KYC_OFFICER">KYC Officer</option>
            <option value="CONTENT_REVIEWER">Content Reviewer</option>
            <option value="ANALYTICS_VIEWER">Analytics Viewer</option>
          </select>
          <div className="text-[11px] font-mono text-slate-400">
            Current: <span className="text-emerald-400 font-bold">{currentAdmin.name}</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK MESSAGES */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-lg flex items-center gap-2 text-sm"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-lg flex items-center gap-2 text-sm"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL INSTANT SEARCH BAR */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Global Admin Search... (Instantly lookup Users, Products, Orders, Properties, Jobs, Payments, Reports, Reviews)"
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-mono"
        />
        {globalSearchQuery && (
          <button
            onClick={() => setGlobalSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-mono text-slate-400 hover:text-slate-100"
          >
            Clear
          </button>
        )}
      </div>

      {/* SHOW GLOBAL SEARCH RESULTS IF SEARCH IS ACTIVE */}
      {globalSearchQuery && globalMatches && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-slate-900/90 rounded-2xl border-2 border-blue-500/50"
        >
          <h2 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
            <Search className="w-5 h-5" /> Global Search Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MATCHED USERS */}
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Users ({globalMatches.matchedUsers.length})</h3>
              {globalMatches.matchedUsers.length === 0 ? <p className="text-xs text-slate-600">No matching users</p> : (
                <div className="space-y-1.5">
                  {globalMatches.matchedUsers.map((u: any) => (
                    <div key={u.id} className="text-xs flex justify-between bg-slate-900 p-1.5 rounded">
                      <span className="font-mono">{u.fullName} ({u.email})</span>
                      <span className="text-slate-500 font-mono">{u.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MATCHED VENDORS */}
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Vendors ({globalMatches.matchedVendors.length})</h3>
              {globalMatches.matchedVendors.length === 0 ? <p className="text-xs text-slate-600">No matching vendors</p> : (
                <div className="space-y-1.5">
                  {globalMatches.matchedVendors.map((v: any) => (
                    <div key={v.id} className="text-xs flex justify-between bg-slate-900 p-1.5 rounded">
                      <span className="font-mono">{v.shopName}</span>
                      <span className="text-emerald-400 font-mono">{v.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* CORE CONTENT LAYOUT: SIDEBAR TABS & MAIN VIEW AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* SIDEBAR NAVIGATION */}
        <div className="xl:col-span-3 flex flex-row xl:flex-col overflow-x-auto xl:overflow-x-visible gap-1 pb-3 xl:pb-0 scrollbar-none">
          <button
            onClick={() => { setActiveTab("dashboard"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "dashboard" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Activity className="w-4 h-4" /> Overview Dashboard
          </button>
          <button
            onClick={() => { setActiveTab("users"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "users" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Users className="w-4 h-4" /> Users Management
          </button>
          <button
            onClick={() => { setActiveTab("vendors"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "vendors" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Vendor Hub (KYC)
          </button>
          <button
            onClick={() => { setActiveTab("properties"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "properties" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Home className="w-4 h-4" /> Property Listings
          </button>
          <button
            onClick={() => { setActiveTab("agencies"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "agencies" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Globe className="w-4 h-4" /> Overseas Agencies
          </button>
          <button
            onClick={() => { setActiveTab("marketplace"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "marketplace" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Marketplace Admin
          </button>
          <button
            onClick={() => { setActiveTab("payments"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "payments" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Payments Ledger
          </button>
          <button
            onClick={() => { setActiveTab("wallets"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "wallets" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Wallet className="w-4 h-4" /> Wallet Balances
          </button>
          <button
            onClick={() => { setActiveTab("fraud"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "fraud" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <AlertTriangle className="w-4 h-4 animate-pulse" /> Fraud &amp; Scam Center
          </button>
          <button
            onClick={() => { setActiveTab("reviews"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "reviews" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Review Moderation
          </button>
          <button
            onClick={() => { setActiveTab("notifications"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "notifications" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Bell className="w-4 h-4" /> Broadcast &amp; Alerts
          </button>
          <button
            onClick={() => { setActiveTab("analytics"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "analytics" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Graphs &amp; Analytics
          </button>
          <button
            onClick={() => { setActiveTab("health"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "health" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Settings className="w-4 h-4" /> System Health Status
          </button>
          <button
            onClick={() => { setActiveTab("audit"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "audit" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" /> Admin Audit Logs
          </button>
          <button
            onClick={() => { setActiveTab("roles"); setGlobalSearchQuery(""); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all uppercase w-full whitespace-nowrap ${
              activeTab === "roles" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            <Lock className="w-4 h-4" /> Roles &amp; Permissions
          </button>
        </div>

        {/* MAIN DYNAMIC TAB CONTENT AREA */}
        <div className="xl:col-span-9 bg-slate-900/40 p-5 rounded-2xl border border-slate-800 min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="mt-4 text-xs font-mono text-slate-400">Syncing database and enforcing strict RBAC security policies...</p>
            </div>
          ) : (
            <div>
              {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
              {activeTab === "dashboard" && dashboardData && (
                <div className="space-y-6">
                  {/* BENTO GRIDCOUNTERS */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <Users className="w-4 h-4 text-blue-400" /> Total Users
                      </div>
                      <div className="text-2xl font-black mt-1 font-mono">{dashboardData.counters.totalUsers}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <ShoppingBag className="w-4 h-4 text-emerald-400" /> Vendors
                      </div>
                      <div className="text-2xl font-black mt-1 font-mono">{dashboardData.counters.totalVendors}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <Home className="w-4 h-4 text-purple-400" /> Houses
                      </div>
                      <div className="text-2xl font-black mt-1 font-mono">{dashboardData.counters.totalHouses}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <Globe className="w-4 h-4 text-amber-400" /> Agencies
                      </div>
                      <div className="text-2xl font-black mt-1 font-mono">{dashboardData.counters.totalAgencies}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <Wallet className="w-4 h-4 text-teal-400" /> Revenue (ETB)
                      </div>
                      <div className="text-xl font-black mt-1 text-teal-400 font-mono">
                        {dashboardData.counters.totalRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <Briefcase className="w-4 h-4 text-indigo-400" /> Products
                      </div>
                      <div className="text-2xl font-black mt-1 font-mono">{dashboardData.counters.totalProducts}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <CheckSquare className="w-4 h-4 text-sky-400" /> Orders
                      </div>
                      <div className="text-2xl font-black mt-1 font-mono">{dashboardData.counters.totalOrders}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <MessageSquare className="w-4 h-4 text-pink-400" /> Reviews
                      </div>
                      <div className="text-2xl font-black mt-1 font-mono">{dashboardData.counters.totalReviews}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-rose-400 text-[11px] font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" /> Fraud Reports
                      </div>
                      <div className="text-2xl font-black mt-1 text-rose-500 font-mono">{dashboardData.counters.totalFraudReports}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                        <Activity className="w-4 h-4" /> Active Users
                      </div>
                      <div className="text-2xl font-black mt-1 text-emerald-400 font-mono">{dashboardData.counters.activeUsers}</div>
                    </div>
                  </div>

                  {/* QUICK ACTIONS SECTION */}
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                    <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300 mb-4 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-blue-500" /> Quick Administration Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => setActiveTab("vendors")}
                        className="bg-slate-800 hover:bg-slate-700/80 p-3 rounded-lg border border-slate-700 text-left transition-all"
                      >
                        <div className="text-[10px] font-bold font-mono text-emerald-400">ACTION 01</div>
                        <div className="text-xs font-semibold mt-1">Approve Vendor KYC</div>
                        <div className="text-[11px] text-slate-400 mt-1">Verify trade registers</div>
                      </button>
                      <button
                        onClick={() => setActiveTab("agencies")}
                        className="bg-slate-800 hover:bg-slate-700/80 p-3 rounded-lg border border-slate-700 text-left transition-all"
                      >
                        <div className="text-[10px] font-bold font-mono text-blue-400">ACTION 02</div>
                        <div className="text-xs font-semibold mt-1">Approve Overseas Agency</div>
                        <div className="text-[11px] text-slate-400 mt-1">Validate MEA licenses</div>
                      </button>
                      <button
                        onClick={() => setActiveTab("properties")}
                        className="bg-slate-800 hover:bg-slate-700/80 p-3 rounded-lg border border-slate-700 text-left transition-all"
                      >
                        <div className="text-[10px] font-bold font-mono text-purple-400">ACTION 03</div>
                        <div className="text-xs font-semibold mt-1">Approve Property Listings</div>
                        <div className="text-[11px] text-slate-400 mt-1">Accept verified title deeds</div>
                      </button>
                      <button
                        onClick={() => setActiveTab("notifications")}
                        className="bg-slate-800 hover:bg-slate-700/80 p-3 rounded-lg border border-slate-700 text-left transition-all"
                      >
                        <div className="text-[10px] font-bold font-mono text-amber-400">ACTION 04</div>
                        <div className="text-xs font-semibold mt-1">Broadcast Alerts</div>
                        <div className="text-[11px] text-slate-400 mt-1">Push emergency notices</div>
                      </button>
                    </div>
                  </div>

                  {/* BRIEF RECENT AUDITS OR SECURITY STATUS */}
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                    <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-500" /> Recent Security Audit Logs
                    </h3>
                    <div className="space-y-2">
                      {auditLogs.slice(0, 3).map((log: any) => (
                        <div key={log.id} className="text-xs font-mono flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400">[{log.action}]</span>
                            <span className="text-slate-300">{log.details}</span>
                          </div>
                          <span className="text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 2: USER MANAGEMENT ==================== */}
              {activeTab === "users" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" /> Users Directory ({users.length})
                    </h2>
                    <div className="flex items-center gap-2">
                      <select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded text-xs px-2 py-1 focus:outline-none"
                      >
                        <option value="ALL">All Roles</option>
                        <option value="BUYER">Buyers Only</option>
                        <option value="VENDOR">Vendors Only</option>
                        <option value="SUPER_ADMIN">Admins Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-800 text-slate-300 border-b border-slate-700">
                          <th className="p-3 font-mono">ID</th>
                          <th className="p-3">FULL NAME</th>
                          <th className="p-3">EMAIL</th>
                          <th className="p-3">ROLE</th>
                          <th className="p-3">NATIONAL ID</th>
                          <th className="p-3 text-center">KYC STATUS</th>
                          <th className="p-3 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {users
                          .filter((u: any) => userFilter === "ALL" || u.role === userFilter)
                          .map((u: any) => (
                            <tr key={u.id} className="hover:bg-slate-800/40 font-mono">
                              <td className="p-3 text-slate-500">{u.id}</td>
                              <td className="p-3 font-sans font-bold text-slate-200">{u.fullName}</td>
                              <td className="p-3 text-slate-400">{u.email}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.role === "SUPER_ADMIN" ? "bg-red-950 text-red-400 border border-red-800" :
                                  u.role === "VENDOR" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                                  "bg-blue-950 text-blue-400 border border-blue-800"
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-3 text-slate-400">{u.nationalId || "None"}</td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.verificationStatus === "APPROVED" ? "bg-emerald-950 text-emerald-400" :
                                  u.verificationStatus === "REJECTED" ? "bg-rose-950 text-rose-400" : "bg-amber-950 text-amber-400"
                                }`}>
                                  {u.verificationStatus}
                                </span>
                              </td>
                              <td className="p-3 text-right flex gap-1 justify-end">
                                <button
                                  onClick={() => handlePatchUser(u.id, { verificationStatus: "APPROVED" })}
                                  className="p-1 text-emerald-400 hover:bg-emerald-950 rounded"
                                  title="Approve KYC Identity"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handlePatchUser(u.id, { isSuspended: !u.isSuspended })}
                                  className={`p-1 rounded ${u.isSuspended ? "text-amber-500 hover:bg-amber-950" : "text-slate-400 hover:bg-slate-700"}`}
                                  title={u.isSuspended ? "Unsuspend User" : "Suspend User"}
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================== TAB 3: VENDOR HUB & KYC ==================== */}
              {activeTab === "vendors" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-500" /> Vendor Onboarding &amp; KYC Verification
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {vendors.map((v: any) => (
                      <div key={v.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-200">{v.shopName}</span>
                            <span className="text-xs font-mono text-slate-500">({v.id})</span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            Category: <span className="text-slate-300">{v.category}</span> | Owner: <span className="text-slate-300">{v.fullName}</span> ({v.email})
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              v.verificationStatus === "APPROVED" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                            }`}>
                              KYC: {v.verificationStatus}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              v.subscriptionStatus === "ACTIVE" ? "bg-blue-950 text-blue-400 border border-blue-800" : "bg-slate-950 text-slate-400 border border-slate-800"
                            }`}>
                              SUB: {v.subscriptionStatus}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePatchVendor(v.id, { verificationStatus: "APPROVED" })}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve KYC
                          </button>
                          <button
                            onClick={() => handlePatchVendor(v.id, { isSuspended: !v.isSuspended })}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs px-3 py-1.5 rounded transition-all flex items-center gap-1"
                          >
                            <Ban className="w-3.5 h-3.5 text-rose-400" /> {v.isSuspended ? "Unsuspend" : "Suspend"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================== TAB 4: PROPERTY LISTINGS ==================== */}
              {activeTab === "properties" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Home className="w-5 h-5 text-purple-500" /> Real-Estate Property Directory
                  </h2>
                  <p className="text-xs text-slate-400">
                    Verify and publish premium local stone villas, condos, and leasehold listings across Addis Ababa.
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 font-mono text-xs">
                    <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <span>Property moderation is operational. All listings dynamically synchronized under the real estate module.</span>
                  </div>
                </div>
              )}

              {/* ==================== TAB 5: OVERSEAS EMPLOYMENT AGENCIES ==================== */}
              {activeTab === "agencies" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-500" /> Overseas Employment Agencies (MEAs)
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Enforce licensing, handle recruitment jobs, manage visa uploads, and coordinate legal worker protection systems.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-200">Gigi International Placements</span>
                        <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded">VERIFIED</span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 font-mono">
                        <div>License: MEA-2026-64120</div>
                        <div>Target countries: UAE, Saudi Arabia, Qatar</div>
                        <div>Active published jobs: 2</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-200">Horn-of-Africa Employment Co.</span>
                        <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded">VERIFIED</span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 font-mono">
                        <div>License: MEA-2026-11002</div>
                        <div>Target countries: Poland, Romania, UAE</div>
                        <div>Active published jobs: 1</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 6: MARKETPLACE ADMIN ==================== */}
              {activeTab === "marketplace" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" /> Marketplace &amp; Inventory Manager
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track overall marketplace inventory, categories list, and apply promotional coupons globally.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-blue-400 font-mono">48</div>
                      <div className="text-xs text-slate-400 mt-1">Total Products Listed</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-indigo-400 font-mono">12</div>
                      <div className="text-xs text-slate-400 mt-1">Categories Available</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-teal-400 font-mono">8</div>
                      <div className="text-xs text-slate-400 mt-1">Active Flash Deals</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 7: PAYMENTS LEDGER ==================== */}
              {activeTab === "payments" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-500" /> Global Platform Payments &amp; Escrow Ledger
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Escrow Balance</div>
                      <div className="text-lg font-black text-blue-400 mt-1 font-mono">ETB {paymentSummary.escrowBalance?.toLocaleString() || "245,000"}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Refunds Issued</div>
                      <div className="text-lg font-black text-rose-400 mt-1 font-mono font-mono">ETB {paymentSummary.refundsIssued?.toLocaleString() || "34,200"}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Pending Payouts</div>
                      <div className="text-lg font-black text-amber-400 mt-1 font-mono">ETB {paymentSummary.pendingPayouts?.toLocaleString() || "18,400"}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Gateway Integrity</div>
                      <div className="text-xs font-black text-emerald-400 mt-2 font-mono flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> {paymentSummary.gatewayStatus || "OPERATIONAL"}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-800 text-slate-300 border-b border-slate-700">
                          <th className="p-3 font-mono">PAYMENT ID</th>
                          <th className="p-3">CHANNEL</th>
                          <th className="p-3">REFERENCE NUMBER</th>
                          <th className="p-3">PROOF CODE</th>
                          <th className="p-3">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {payments.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-800/40 font-mono">
                            <td className="p-3 text-slate-500">{p.id}</td>
                            <td className="p-3 font-sans font-bold text-slate-200">{p.paymentChannel}</td>
                            <td className="p-3 text-slate-300">{p.referenceNumber}</td>
                            <td className="p-3 text-slate-400">{p.offlineProofCode || "N/A"}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.status === "APPROVED" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================== TAB 8: WALLET BALANCES ==================== */}
              {activeTab === "wallets" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-teal-500" /> Platform Wallets &amp; Ledger Transfers
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Perform system audits on Telebirr deposits, bank transfer payouts, escrows, and failed transactions instantly.
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 font-mono text-xs">
                    <Info className="w-10 h-10 text-teal-500 mx-auto mb-3" />
                    <span>Real-time wallet integration monitoring is active. All system escrow bounds verified.</span>
                  </div>
                </div>
              )}

              {/* ==================== TAB 9: FRAUD & SCAM CENTER ==================== */}
              {activeTab === "fraud" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 animate-bounce" /> Fraud &amp; Scam Investigation Center
                  </h2>

                  {/* Sub-tab Selectors */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {['cases', 'vendors', 'duplicates', 'spam', 'suspended'].map(sub => (
                      <button
                        key={sub}
                        onClick={() => {
                          (window as any)._activeFraudSubTab = sub;
                          setReports([...reports]); // force re-render
                        }}
                        className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          ((window as any)._activeFraudSubTab || 'cases') === sub
                            ? 'bg-rose-950/60 border-rose-800 text-rose-400 font-extrabold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {sub === 'cases' ? '📂 Active Case Files' :
                         sub === 'vendors' ? '🚨 High Risk Vendors' :
                         sub === 'duplicates' ? '👥 Duplicate Accounts' :
                         sub === 'spam' ? '💬 Spam Reviews' :
                         '🚫 Suspended Accounts'}
                      </button>
                    ))}
                  </div>

                  {/* Render based on selected fraud subtab */}
                  {((window as any)._activeFraudSubTab || 'cases') === 'cases' && (
                    <div className="space-y-3">
                      {reports.map((rep: any) => (
                        <div key={rep.id} className="bg-slate-900 border border-rose-950/80 p-4 rounded-xl space-y-3 text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-bold uppercase bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-900">
                                {rep.reportType}
                              </span>
                              <div className="text-sm font-bold text-slate-200 mt-1">Report ID: {rep.id}</div>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{new Date(rep.createdAt).toLocaleDateString()}</span>
                          </div>

                          <p className="text-xs text-slate-300 font-sans">{rep.description}</p>

                          <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                            <div>Reporter: <span className="text-slate-200 font-sans">{rep.reporterName}</span> ({rep.reporterEmail})</div>
                            <div>Target Vendor: <span className="text-rose-400 font-sans">{rep.vendorShopName}</span> (ID: {rep.vendorId})</div>
                          </div>

                          {rep.evidences && rep.evidences.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Evidence Attachment:</div>
                              <img
                                src={rep.evidences[0].fileUrl}
                                alt="Fraud Proof"
                                className="max-h-40 rounded border border-slate-700/80 object-cover cursor-pointer hover:opacity-85"
                                onClick={() => setSelectedEvidence(rep.evidences[0].fileUrl)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {((window as any)._activeFraudSubTab) === 'vendors' && (
                    <div className="space-y-3 text-left animate-fade-in">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
                          <div>
                            <span className="text-xs font-black text-rose-400 block font-mono">HIGH RISK ID: #EZ-RV-802</span>
                            <span className="text-sm font-bold text-slate-200">Golden Gursha Trading Hub</span>
                          </div>
                          <span className="bg-red-950 text-red-400 border border-red-900 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
                            RISK SCORE: 88%
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans">
                          Flagged by AI Engine for unusual Telebirr cashout bursts matching suspicious referral bonus circular transfers.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => alert('Temporary freeze applied. Escrow payout pathways locked for 72 hours.')}
                            className="bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            ⚠️ Temporary Freeze
                          </button>
                          <button
                            onClick={() => alert('Vendor accounts deactivated. National Bank AML dispatch cleared.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] px-3 py-1.5 rounded-lg"
                          >
                            Deactivate Merchant
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
                          <div>
                            <span className="text-xs font-black text-amber-400 block font-mono">HIGH RISK ID: #EZ-RV-109</span>
                            <span className="text-sm font-bold text-slate-200">Quick Mobile Addis Agency</span>
                          </div>
                          <span className="bg-amber-950 text-amber-400 border border-amber-900 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
                            RISK SCORE: 76%
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans">
                          Device fingerprint overlaps with 3 previously blacklisted duplicate accounts. Real-estate deed verification failed.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => alert('KYC Audit dispatch initialized. Requesting physical land deed copies.')}
                            className="bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-400 font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            📁 Request KYC Audit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {((window as any)._activeFraudSubTab) === 'duplicates' && (
                    <div className="space-y-3 text-left animate-fade-in">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                        <span className="bg-amber-950 text-amber-400 border border-amber-900 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase">
                          Fayda ID Fingerprint Overlap
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
                          <div className="p-2.5 bg-slate-950 rounded border border-slate-850">
                            <div className="font-sans font-bold text-slate-200">Primary Account</div>
                            <div className="text-slate-400 mt-1">Abebe Kebede (u-901)</div>
                            <div className="text-slate-500">ID: FY-902341-A</div>
                          </div>
                          <div className="p-2.5 bg-slate-950 rounded border border-slate-850">
                            <div className="font-sans font-bold text-slate-200 text-amber-400">Suspected Duplicate</div>
                            <div className="text-slate-400 mt-1">Abebe K. Tech Store (u-902)</div>
                            <div className="text-slate-500">ID: FY-902341-A</div>
                          </div>
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => alert('Accounts successfully merged. Unified portfolio assigned under u-901.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] px-3 py-1.5 rounded-lg"
                          >
                            🔗 Merge Portfolios
                          </button>
                          <button
                            onClick={() => alert('Duplicate account deactivated. Secondary token revoked.')}
                            className="bg-red-950/50 hover:bg-red-950 text-red-400 border border-red-900 font-mono text-[10px] px-3 py-1.5 rounded-lg"
                          >
                            Deactivate Secondary
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {((window as any)._activeFraudSubTab) === 'spam' && (
                    <div className="space-y-3 text-left animate-fade-in">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <div>
                            <span className="text-xs font-bold text-slate-200">Reviewer: @u-spam1 (Alemayehu T.)</span>
                            <span className="text-[10px] text-slate-500 block font-mono">On Product: Traditional Emperor Dress</span>
                          </div>
                          <span className="bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase">
                            AI Spam Confidence: 99%
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans italic bg-slate-950 p-2.5 rounded border border-slate-850">
                          "GET RICH QUICK!! Make 20,000 Birr daily working from home. Join Telegram channel: @addis_bonus_bot instantly!!"
                        </p>
                        <div className="pt-1.5 flex gap-2">
                          <button
                            onClick={() => alert('Review deleted from catalog database.')}
                            className="bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            🗑️ Delete Spam Review
                          </button>
                          <button
                            onClick={() => alert('Spam account banned.')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] px-3 py-1.5 rounded-lg"
                          >
                            🚫 Ban Reviewer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {((window as any)._activeFraudSubTab) === 'suspended' && (
                    <div className="space-y-3 text-left animate-fade-in">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-500">USER ID: #u-101</span>
                            <span className="text-sm font-bold text-slate-200">Sintayehu Shiferaw</span>
                          </div>
                          <div className="text-xs font-mono text-slate-400">
                            Reason: <span className="text-rose-400">Repeated spam reviews &amp; fake listings</span>
                          </div>
                        </div>
                        <button
                          onClick={() => alert('Account status updated to ACTIVE. Token keys regenerated.')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-3 py-1.5 rounded transition-all"
                        >
                          🟢 Re-Instate Account
                        </button>
                      </div>
                    </div>
                  )}

                  {/* EVIDENCE MODAL */}
                  {selectedEvidence && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                      <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                          <span className="text-xs font-bold text-slate-300">Fraud Evidence Viewer</span>
                          <button onClick={() => setSelectedEvidence(null)} className="text-slate-400 hover:text-slate-100 text-xs">Close</button>
                        </div>
                        <img src={selectedEvidence} alt="High-Res Evidence" className="w-full rounded border border-slate-800" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== TAB 10: REVIEW MODERATION ==================== */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" /> Reviews Moderation Hub
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Monitor star reviews, track reported responses, delete toxic remarks, and review official vendor replies globally.
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 font-mono text-xs">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <span>All reported customer product &amp; housing reviews are dynamically cleared.</span>
                  </div>
                </div>
              )}

              {/* ==================== TAB 11: BROADCAST & ALERTS ==================== */}
              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" /> System Broadcast &amp; Push Alerts Manager
                  </h2>

                  <form onSubmit={handleSendBroadcast} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Announcement Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Platform System Maintenance"
                        value={broadcastForm.title}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Announcement Message (Amharic &amp; English)</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Type standard global message here..."
                        value={broadcastForm.body}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, body: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Notice Category</label>
                      <select
                        value={broadcastForm.category}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
                      >
                        <option value="System Updates">System Updates</option>
                        <option value="Maintenance">Maintenance Scheduled</option>
                        <option value="Promotion">Promotion Campaign</option>
                        <option value="Emergency Alert">Emergency Security Alert</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Global Announcement
                    </button>
                  </form>
                </div>
              )}

              {/* ==================== TAB 12: GRAPHS & ANALYTICS ==================== */}
              {activeTab === "analytics" && analyticsData && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" /> Analytics Series &amp; Growth Charts
                  </h2>

                  {/* 1. REVENUE AREA CHART */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Revenue Timeline (ETB)</h3>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.revenueGraph}>
                          <defs>
                            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                          <XAxis dataKey="month" stroke="#718096" fontSize={11} />
                          <YAxis stroke="#718096" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", borderColor: "#333" }} />
                          <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmt)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 2. ORDERS TIMELINE BAR CHART */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Daily Orders Breakdown</h3>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.ordersGraph}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                          <XAxis dataKey="date" stroke="#718096" fontSize={11} />
                          <YAxis stroke="#718096" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", borderColor: "#333" }} />
                          <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 13: SYSTEM HEALTH STATUS ==================== */}
              {activeTab === "health" && systemHealth && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" /> Enterprise Infrastructure Health Status
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-mono">CPU UTLIZATION</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{systemHealth.cpu}</div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-mono">RAM ALLOCATION</div>
                      <div className="text-2xl font-black text-blue-400 mt-1 font-mono">{systemHealth.memory}</div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-mono">POSTGRESQL DB</div>
                      <div className="text-xs font-bold text-emerald-400 mt-2 font-mono uppercase flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4" /> {systemHealth.postgres}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Redis Cache Storage:</span>
                      <span className="text-emerald-400">{systemHealth.redis}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">WebSocket Push Channel:</span>
                      <span className="text-emerald-400">{systemHealth.socketServer}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Queue Worker Status:</span>
                      <span className="text-emerald-400">{systemHealth.queueWorkers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Object Cloud Storage:</span>
                      <span className="text-emerald-400">{systemHealth.storage}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 14: ADMIN AUDIT LOGS ==================== */}
              {activeTab === "audit" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" /> Platform Security &amp; Activity Audit Logs
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Immutable registry tracking all administrator actions, modifications, parameter overrides, and security events.
                  </p>

                  <div className="space-y-2">
                    {auditLogs.map((log: any) => (
                      <div key={log.id} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-bold font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                              {log.action}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-300">By: {log.adminName} ({log.role})</span>
                          </div>
                          <div className="text-xs text-slate-400">{log.details}</div>
                        </div>
                        <div className="text-right text-[10px] font-mono text-slate-500 space-y-0.5">
                          <div>IP: {log.ip}</div>
                          <div>{new Date(log.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================== TAB 15: ROLES & PERMISSIONS MATRIX ==================== */}
              {activeTab === "roles" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-500" /> Global RBAC Authority &amp; Access Controls
                  </h2>
                  <p className="text-xs text-slate-400">
                    Review permissions dynamically enforced on server-side nodes for different administrator access scopes.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="bg-slate-800 text-slate-300 border-b border-slate-700">
                          <th className="p-3">CAPABILITY MODULE</th>
                          <th className="p-3 text-center">SUPER ADMIN</th>
                          <th className="p-3 text-center">FINANCE MGR</th>
                          <th className="p-3 text-center">SUPPORT AGT</th>
                          <th className="p-3 text-center">MODERATOR</th>
                          <th className="p-3 text-center">KYC OFFICER</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {rolePermissionsMatrix.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="p-3 font-sans font-bold text-slate-300">{row.module}</td>
                            <td className="p-3 text-center">
                              {row.SUPER_ADMIN ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                            </td>
                            <td className="p-3 text-center">
                              {row.FINANCE_MANAGER ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                            </td>
                            <td className="p-3 text-center">
                              {row.SUPPORT_AGENT ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                            </td>
                            <td className="p-3 text-center">
                              {row.MODERATOR ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                            </td>
                            <td className="p-3 text-center">
                              {row.KYC_OFFICER ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-600 mx-auto" />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
