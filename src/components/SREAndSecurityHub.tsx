import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Activity, 
  Terminal as TerminalIcon, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  FolderTree, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCw, 
  Trash2, 
  Send, 
  Eye, 
  Download, 
  Lock, 
  Key, 
  Globe, 
  Sliders, 
  UserCheck, 
  Flame, 
  Server, 
  Network, 
  Layers, 
  Database, 
  Plus, 
  ChevronRight, 
  FileCode, 
  AlertOctagon, 
  Info,
  Clock,
  ExternalLink,
  LockKeyhole
} from 'lucide-react';

interface SREAndSecurityHubProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
}

type TabType = 'metrics' | 'logs' | 'security' | 'blueprint' | 'onboarding' | 'infrastructure';

interface SystemLog {
  id: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  service: string;
  message: string;
  metadata: any;
  createdAt: string;
}

interface AlertConfig {
  id: string;
  name: string;
  condition: string;
  triggered: boolean;
  severity: 'warning' | 'critical';
  channels: { email: boolean; telegram: boolean; slack: boolean; sms: boolean };
}

interface Session {
  id: string;
  userId: string;
  role: 'BUYER' | 'VENDOR' | 'ADMIN';
  ip: string;
  device: string;
  location: string;
  active: boolean;
  createdAt: string;
}

export default function SREAndSecurityHub({ isDarkMode, lang }: SREAndSecurityHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');
  
  // --- Vendor Onboarding Flow Playground States ---
  const [obFlowStep, setObFlowStep] = useState<number>(1);
  const [obUsers, setObUsers] = useState<any[]>([
    { id: 'usr-buyer-9021', firstName: 'Abebe', lastName: 'Bekele', phone: '+251911223344', email: 'abebe@everyzone.et', role: 'BUYER', active: true, verified: false, createdAt: '2026-06-25' },
    { id: 'usr-vendor-4431', firstName: 'Kidus', lastName: 'Yared', phone: '+251922556677', email: 'kidus@everyzone.et', role: 'VENDOR', active: true, verified: true, createdAt: '2026-06-24' },
  ]);
  const [obVendors, setObVendors] = useState<any[]>([
    { id: 'ven-abc-112', userId: 'usr-vendor-4431', businessName: 'Kidus Real Estate', businessDescription: 'Luxury housing plots in Adama and Hawassa.', vendorType: 'REAL_ESTATE', verified: true, followers: 14, createdAt: '2026-06-24' },
  ]);
  const [obKYCs, setObKYCs] = useState<any[]>([
    { id: 'kyc-kidus', userId: 'usr-vendor-4431', status: 'APPROVED', idType: 'FAYDA', idNumber: 'ET-88392104-Y', createdAt: '2026-06-24' },
  ]);

  const [obFormUser, setObFormUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const [obFormVendor, setObFormVendor] = useState({
    businessName: '',
    businessDescription: '',
    vendorType: 'RETAIL',
  });

  const [obFormKYC, setObFormKYC] = useState({
    idType: 'FAYDA',
    idNumber: '',
    fullName: '',
    dateOfBirth: '',
    nationality: 'Ethiopian',
    selfieImageUrl: '',
    documentFrontUrl: '',
    documentBackUrl: '',
    businessLicenseUrl: '',
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentVendor, setCurrentVendor] = useState<any>(null);
  const [currentKYC, setCurrentKYC] = useState<any>(null);
  const [registeredJwt, setRegisteredJwt] = useState<string>('');

  
  // Real-time counter for simulated metric charts
  const [tick, setTick] = useState<number>(0);
  
  // Custom states for Metrics
  const [apiResponseData, setApiResponseData] = useState<any[]>([]);
  const [dbQueriesData, setDbQueriesData] = useState<any[]>([]);
  const [serverMetrics, setServerMetrics] = useState({
    cpu: 42,
    memory: 68,
    redisHealth: 'HEALTHY',
    queueHealth: 'ACTIVE',
    ordersPerHour: 124,
    paymentsPerHour: 88,
    newUsers: 12,
    vendorRegs: 4,
    failedTxSpike: false,
    fraudReports: 1,
  });

  // Logs state (SystemLog simulation)
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [logServiceFilter, setLogServiceFilter] = useState<string>('ALL');
  const [maxLogsCount, setMaxLogsCount] = useState<number>(100);

  // Sentry simulation
  const [sentryIssues, setSentryIssues] = useState<any[]>([
    { id: 'SEN-204', title: 'TypeError: Cannot read properties of undefined (reading "wallet")', count: 142, lastSeen: '2 mins ago', severity: 'error' },
    { id: 'SEN-205', title: 'NetworkError: Chapa Payment gateway timeout on /v1/charge', count: 28, lastSeen: '15 mins ago', severity: 'warning' },
    { id: 'SEN-206', title: 'PrismaClientKnownRequestError: Unique constraint failed on User(email)', count: 9, lastSeen: '1 hour ago', severity: 'info' }
  ]);

  // AlertManager state
  const [alerts, setAlerts] = useState<AlertConfig[]>([
    { id: '1', name: 'API Down', condition: 'Response rate 5xx > 15%', triggered: false, severity: 'critical', channels: { email: true, telegram: true, slack: true, sms: false } },
    { id: '2', name: 'Database Down', condition: 'Prisma ConnectionPool timeout', triggered: false, severity: 'critical', channels: { email: true, telegram: true, slack: true, sms: true } },
    { id: '3', name: 'Redis Down', condition: 'Redis cluster cache unavailable', triggered: false, severity: 'warning', channels: { email: false, telegram: true, slack: true, sms: false } },
    { id: '4', name: 'Payment Failure Spike', condition: 'Chapa direct gateway 400 responses > 25%', triggered: false, severity: 'critical', channels: { email: true, telegram: true, slack: true, sms: true } },
    { id: '5', name: 'Server CPU > 90%', condition: 'Docker container core throttling', triggered: false, severity: 'warning', channels: { email: true, telegram: false, slack: true, sms: false } },
    { id: '6', name: 'Disk Usage > 80%', condition: 'Logical disk storage threshold breached', triggered: false, severity: 'warning', channels: { email: true, telegram: false, slack: false, sms: false } },
  ]);

  // Alert trigger activity
  const [notifiedChannelsLog, setNotifiedChannelsLog] = useState<string[]>([]);

  // Security layer states
  const [jwtConfig, setJwtConfig] = useState({
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    tokenRotation: true,
    rateLimitThreshold: 100, // requests per min
    ipBlockingCount: 4,
  });

  const [blockedIPs, setBlockedIPs] = useState<string[]>([
    '185.220.101.4', '193.106.191.22', '45.146.164.11', '80.94.95.210'
  ]);
  const [newBlockedIp, setNewBlockedIp] = useState<string>('');

  const [activeSessions, setActiveSessions] = useState<Session[]>([
    { id: 'S-719', userId: 'usr_buyer_9021', role: 'BUYER', ip: '197.156.121.8', device: 'iPhone 15 Pro - Safari', location: 'Addis Ababa, ET', active: true, createdAt: '10 mins ago' },
    { id: 'S-201', userId: 'usr_vendor_4431', role: 'VENDOR', ip: '197.156.120.44', device: 'Chrome / Windows 11', location: 'Hawassa, ET', active: true, createdAt: '2 hours ago' },
    { id: 'S-001', userId: 'usr_admin_0001', role: 'ADMIN', ip: '197.156.64.91', device: 'MacBook Pro - Arc Browser', location: 'Bole, Addis Ababa', active: true, createdAt: '1 min ago' },
    { id: 'S-356', userId: 'usr_buyer_1109', role: 'BUYER', ip: '102.164.12.5', device: 'Samsung S24 Ultra', location: 'Adama, ET', active: true, createdAt: '3 hours ago' },
  ]);

  // GCP Private Signed URL Simulator
  const [privateFileName, setPrivateFileName] = useState<string>('contracts/vendor_kyc_usr_9021.pdf');
  const [signedUrlDuration, setSignedUrlDuration] = useState<number>(15); // minutes
  const [generatedSignedUrl, setGeneratedSignedUrl] = useState<string>('');

  // Security checks checklist
  const [securityChecklist, setSecurityChecklist] = useState({
    tls13: true,
    firewall: true,
    encryptedBackups: true,
    leastPrivilege: true,
    readReplicas: false,
    secretRotation: true,
    inputSanitization: true,
    fail2ban: true,
    ddosProtection: true,
  });

  // --- Every-zone Production Infrastructure States ---
  const [scalingFactor, setScalingFactor] = useState<'1k' | '10k' | '100k' | '1m'>('10k');
  const [drStatus, setDrStatus] = useState<'HEALTHY' | 'DISASTER' | 'FAILOVER' | 'RESTORING' | 'RECOVERED'>('HEALTHY');
  const [backupStatus, setBackupStatus] = useState<'IDLE' | 'BACKING_UP' | 'COMPLETED'>('IDLE');
  const [backupStorage, setBackupStorage] = useState<'S3' | 'CLOUDINARY'>('S3');
  const [backupLogs, setBackupLogs] = useState<string[]>([
    'Scheduled cron: daily automated backup initialized.',
    'Next run: Today at 03:00 AM EAT.',
  ]);
  const [selectedContainerId, setSelectedContainerId] = useState<string>('nestjs-api-1');
  const [infraLogs, setInfraLogs] = useState<string[]>([
    'Every-zone production infrastructure monitoring online.',
    'Connecting to Prometheus metrics scraping target...',
    'Nginx Load Balancer is healthy and actively routing.',
  ]);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([
    { id: 'WH-881', timestamp: '10:14 AM', gateway: 'Chapa', event: 'charge.completed', amount: '12,500 ETB', status: 'VERIFIED', txId: 'TX-CHP-9041' },
    { id: 'WH-880', timestamp: '09:42 AM', gateway: 'Telebirr', event: 'payment.success', amount: '3,800 ETB', status: 'VERIFIED', txId: 'TX-TLB-1122' },
  ]);
  const [webhookVerifying, setWebhookVerifying] = useState<boolean>(false);
  const [selectedWebhookSource, setSelectedWebhookSource] = useState<'Chapa' | 'Telebirr' | 'CBE'>('Chapa');
  const [webhookTestAmount, setWebhookTestAmount] = useState<string>('4,500');
  
  // Storage Browser Mock Files
  const [storageFiles, setStorageFiles] = useState<any[]>([
    { name: 'product_image_4011.png', folder: 'products', size: '2.4 MB', bucket: 'AWS S3' },
    { name: 'bole_apartment_lobby.jpg', folder: 'house_images', size: '4.1 MB', bucket: 'Cloudinary' },
    { name: 'passport_scan_abebe.pdf', folder: 'passport', size: '1.2 MB', bucket: 'AWS S3' },
    { name: 'cv_yared_software_eng.pdf', folder: 'cv', size: '840 KB', bucket: 'AWS S3' },
    { name: 'profile_kidus.jpg', folder: 'profile_photos', size: '512 KB', bucket: 'Cloudinary' },
  ]);
  const [selectedStorageFolder, setSelectedStorageFolder] = useState<string>('products');
  const [newUploadedFileName, setNewUploadedFileName] = useState<string>('');

  const [containers, setContainers] = useState<any[]>([
    { id: 'flutter-web', name: 'Frontend (Flutter Web)', status: 'RUNNING', cpu: 1.2, memory: 45, port: '3000:3000', service: 'Frontend Service' },
    { id: 'nestjs-api-1', name: 'NestJS API Node 1', status: 'RUNNING', cpu: 3.4, memory: 128, port: '3001:3000', service: 'NestJS Core' },
    { id: 'nestjs-api-2', name: 'NestJS API Node 2', status: 'RUNNING', cpu: 2.1, memory: 122, port: '3002:3000', service: 'NestJS Core' },
    { id: 'postgres-primary', name: 'PostgreSQL Primary DB', status: 'RUNNING', cpu: 1.5, memory: 512, port: '5432:5432', service: 'PostgreSQL' },
    { id: 'postgres-replica', name: 'PostgreSQL Read Replica', status: 'RUNNING', cpu: 0.8, memory: 256, port: '5433:5432', service: 'PostgreSQL Standby' },
    { id: 'redis-cluster', name: 'Redis Cache Cluster', status: 'RUNNING', cpu: 0.5, memory: 64, port: '6379:6379', service: 'Redis' },
    { id: 'bullmq-worker', name: 'BullMQ Workers Engine', status: 'RUNNING', cpu: 4.8, memory: 92, port: 'N/A', service: 'BullMQ' },
    { id: 'socket-io', name: 'Socket.io Chat Server', status: 'RUNNING', cpu: 1.0, memory: 78, port: '3003:3000', service: 'Socket.io Server' },
    { id: 'nginx', name: 'Nginx Load Balancer', status: 'RUNNING', cpu: 0.2, memory: 16, port: '80:80, 443:443', service: 'Nginx Router' },
    { id: 'monitoring-stack', name: 'Grafana & Prometheus', status: 'RUNNING', cpu: 5.2, memory: 384, port: '9090:9090', service: 'Prometheus & Grafana' },
  ]);

  // NestJS Architecture Explorer State
  const [selectedFolder, setSelectedFolder] = useState<string>('src/modules/auth');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'src/modules': true,
  });

  // Logs stream auto scroll
  const logEndRef = useRef<HTMLDivElement>(null);

  // Generate initial simulated logs
  useEffect(() => {
    const initialLogs: SystemLog[] = [];
    const services = ['AuthService', 'MarketplaceService', 'WalletProxy', 'PassportWorkflow', 'AdCampaignManager', 'PrismaConnector'];
    const messages = [
      'Successfully rotated JWT Secret key dynamically.',
      'Database connection pooling: active 12, idle 8, max 40.',
      'API GET /api/marketplace/listings returned 200 OK (38ms).',
      'Wallet credits escrow completed for Transaction ET-3301.',
      'Health check status report: UP - memory usage optimized.',
      'Ad campaign payload verified for bidding ID #CAD-99.',
    ];

    for (let i = 0; i < 20; i++) {
      const isErr = Math.random() < 0.1;
      const isWarn = Math.random() < 0.15;
      const level = isErr ? 'ERROR' : isWarn ? 'WARNING' : 'INFO';
      const svc = services[Math.floor(Math.random() * services.length)];
      const msg = isErr 
        ? 'External API request rejected: service unavailable.' 
        : isWarn 
          ? 'Memory usage rising: heap allocation near 78% limit.' 
          : messages[Math.floor(Math.random() * messages.length)];

      initialLogs.push({
        id: `LOG-${1000 + i}`,
        level,
        service: svc,
        message: msg,
        metadata: { clientIp: `197.156.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, path: '/v1/graphql', durationMs: Math.floor(Math.random() * 120) + 15 },
        createdAt: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString()
      });
    }
    setLogs(initialLogs);

    // Initial metrics data
    const apiData = [];
    const dbData = [];
    for (let i = 0; i < 15; i++) {
      apiData.push({
        time: `${i * 4}m ago`,
        'Vite Client API': Math.floor(Math.random() * 40) + 20,
        'NestJS Backend': Math.floor(Math.random() * 120) + 40,
        'Database Query Latency': Math.floor(Math.random() * 25) + 5
      });
      dbData.push({
        time: `${i * 4}m ago`,
        'Active Queries': Math.floor(Math.random() * 15) + 3,
        'Connection Pool Size': 24,
        'Redis Cache Hits': Math.floor(Math.random() * 300) + 150
      });
    }
    setApiResponseData(apiData);
    setDbQueriesData(dbData);
  }, []);

  // Background simulation tick (updating charts & server metrics)
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);

      // Fluctuate Docker Containers stats in real-time
      setContainers(prev => prev.map(c => {
        if (c.status === 'RUNNING') {
          const cpuDelta = (Math.random() * 2 - 1) * 0.4; // -0.4 to +0.4
          const memDelta = (Math.random() * 6 - 3);       // -3 to +3
          return {
            ...c,
            cpu: Math.max(0.1, parseFloat((c.cpu + cpuDelta).toFixed(1))),
            memory: Math.max(5, Math.round(c.memory + memDelta))
          };
        }
        return c;
      }));

      // Randomly adjust CPU/Memory
      setServerMetrics(prev => {
        const cpuDelta = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const memDelta = Math.floor(Math.random() * 5) - 2;   // -2 to +2
        const nextCpu = Math.max(10, Math.min(95, prev.cpu + cpuDelta));
        const nextMem = Math.max(30, Math.min(90, prev.memory + memDelta));
        
        return {
          ...prev,
          cpu: nextCpu,
          memory: nextMem,
          ordersPerHour: prev.ordersPerHour + (Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0),
          paymentsPerHour: prev.paymentsPerHour + (Math.random() < 0.2 ? (Math.random() < 0.5 ? 1 : -1) : 0),
        };
      });

      // Update Chart metrics with a new slide
      setApiResponseData(prev => {
        const next = [...prev.slice(1)];
        next.push({
          time: 'now',
          'Vite Client API': Math.floor(Math.random() * 40) + 20,
          'NestJS Backend': Math.floor(Math.random() * 100) + 50,
          'Database Query Latency': Math.floor(Math.random() * 20) + 5
        });
        return next;
      });

      setDbQueriesData(prev => {
        const next = [...prev.slice(1)];
        next.push({
          time: 'now',
          'Active Queries': Math.floor(Math.random() * 20) + 5,
          'Connection Pool Size': 24,
          'Redis Cache Hits': Math.floor(Math.random() * 400) + 200
        });
        return next;
      });

      // Randomly generate new logs
      if (Math.random() < 0.4) {
        const levels: ('INFO' | 'WARNING' | 'ERROR')[] = ['INFO', 'INFO', 'INFO', 'WARNING', 'ERROR'];
        const lvl = levels[Math.floor(Math.random() * levels.length)];
        const services = ['AuthService', 'MarketplaceService', 'WalletProxy', 'AdCampaignManager', 'SearchEngine', 'KyvVerificationService'];
        const svc = services[Math.floor(Math.random() * services.length)];
        
        let msg = '';
        if (lvl === 'INFO') {
          const infoMsgs = [
            'API fetch query resolved successfully.',
            'Refreshed access token via rotated refresh token flow.',
            'Redis cache entry invalidated for key: listings_list.',
            'SMS OTP dispatched to +251911****** for 2FA validation.',
          ];
          msg = infoMsgs[Math.floor(Math.random() * infoMsgs.length)];
        } else if (lvl === 'WARNING') {
          const warnMsgs = [
            'Rate limiting near limit of 100 req/min for IP: 197.156.41.2',
            'Connection pool response time elevated (240ms).',
            'S3 backup pipeline bucket synchronizing in low bandwidth.',
          ];
          msg = warnMsgs[Math.floor(Math.random() * warnMsgs.length)];
        } else {
          const errMsgs = [
            'JWT verification failed: TokenExpiredError.',
            'Database constraint violated: user already subscribed to lottery group.',
            'Chapa payload returned signature mismatch, verify webhook key.',
          ];
          msg = errMsgs[Math.floor(Math.random() * errMsgs.length)];
        }

        setLogs(prev => {
          const next = [...prev];
          if (next.length >= maxLogsCount) {
            next.shift();
          }
          next.push({
            id: `LOG-${Date.now().toString().slice(-4)}`,
            level: lvl,
            service: svc,
            message: msg,
            metadata: { threadId: Math.floor(Math.random() * 1000) },
            createdAt: new Date().toLocaleTimeString()
          });
          return next;
        });
      }

    }, 4500);

    return () => clearInterval(timer);
  }, [maxLogsCount]);

  const triggerSentryCrash = () => {
    // Generate an ERROR or CRITICAL log item
    const errorLog: SystemLog = {
      id: `CRASH-${Date.now().toString().slice(-4)}`,
      level: 'CRITICAL',
      service: 'MarketplaceService',
      message: 'FATAL EXCEPTION: Cannot read properties of undefined (reading "wallet_balance")',
      metadata: { 
        stackTrace: [
          'at MarketplaceService.checkEscrowBalance (/src/modules/marketplace/listings.service.ts:182:33)',
          'at PaymentController.processEscrow (/src/modules/payments/payments.controller.ts:44:21)'
        ],
        contextUserRole: 'BUYER',
        environment: 'staging'
      },
      createdAt: new Date().toLocaleTimeString()
    };

    setLogs(prev => [...prev, errorLog]);
    
    // Add to Sentry list
    setSentryIssues(prev => [
      { id: `SEN-${Math.floor(Math.random() * 500) + 300}`, title: errorLog.message, count: 1, lastSeen: 'Just now', severity: 'critical' },
      ...prev
    ]);

    // Add alert trigger
    triggerAlert('Payment Failure Spike', 'Chapa direct gateway 400 responses > 25%');
  };

  const triggerAlert = (alertName: string, condition: string) => {
    setAlerts(prev => prev.map(a => a.name === alertName ? { ...a, triggered: true } : a));
    
    const activeAlert = alerts.find(a => a.name === alertName);
    const channels = activeAlert ? Object.entries(activeAlert.channels).filter(([_, v]) => v).map(([k]) => k.toUpperCase()) : ['EMAIL', 'TELEGRAM', 'SLACK'];
    
    const channelLog = `ALERT FIRING: [${alertName}] (${condition}) => Dispatched to [${channels.join(', ')}]`;
    setNotifiedChannelsLog(prev => [channelLog, ...prev]);

    // Send a critical system log
    setLogs(prev => [
      ...prev,
      {
        id: `ALERT-${Date.now().toString().slice(-3)}`,
        level: 'CRITICAL',
        service: 'AlertManager',
        message: `System threshold alert triggered: ${alertName}. Dispatched notifications.`,
        metadata: { condition, channels },
        createdAt: new Date().toLocaleTimeString()
      }
    ]);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, triggered: false } : a));
    const alt = alerts.find(a => a.id === alertId);
    if (alt) {
      setNotifiedChannelsLog(prev => [`ALERT RESOLVED: [${alt.name}] status returned to normal.`, ...prev]);
    }
  };

  const toggleAlertChannel = (alertId: string, channel: 'email' | 'telegram' | 'slack' | 'sms') => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          channels: {
            ...a.channels,
            [channel]: !a.channels[channel]
          }
        };
      }
      return a;
    }));
  };

  // JWT Token rotation trigger
  const rotateTokensNow = () => {
    setLogs(prev => [
      ...prev,
      {
        id: `SEC-${Date.now().toString().slice(-4)}`,
        level: 'WARNING',
        service: 'AuthModule',
        message: 'Manual Secret rotation triggered: revoking invalid current JWT handles and deploying TLS-1.3 aligned token set.',
        metadata: { algorithm: 'RS256', keyLength: 4096 },
        createdAt: new Date().toLocaleTimeString()
      }
    ]);
    alert('JWT secret keys rotated and updated in Redis registry.');
  };

  // Session Revocation
  const revokeSession = (id: string) => {
    const s = activeSessions.find(sess => sess.id === id);
    setActiveSessions(prev => prev.map(sess => sess.id === id ? { ...sess, active: false } : sess));
    setLogs(prev => [
      ...prev,
      {
        id: `SEC-${Date.now().toString().slice(-4)}`,
        level: 'WARNING',
        service: 'AuthModule',
        message: `Session revoked for user ID ${s?.userId || 'unknown'} from IP ${s?.ip || 'unknown'}`,
        metadata: { sessionId: id, device: s?.device },
        createdAt: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Block list IP adder
  const blockIpAddress = () => {
    if (!newBlockedIp.trim()) return;
    if (blockedIPs.includes(newBlockedIp.trim())) {
      alert('IP address already blocked.');
      return;
    }
    setBlockedIPs(prev => [...prev, newBlockedIp.trim()]);
    setLogs(prev => [
      ...prev,
      {
        id: `SEC-${Date.now().toString().slice(-4)}`,
        level: 'WARNING',
        service: 'Fail2BanGuard',
        message: `IP ${newBlockedIp.trim()} blacklisted and dropped by system firewall rule.`,
        metadata: { reason: 'Manual Block / Suspicious API polling requests' },
        createdAt: new Date().toLocaleTimeString()
      }
    ]);
    setNewBlockedIp('');
  };

  // Remove blocked IP
  const unblockIp = (ip: string) => {
    setBlockedIPs(prev => prev.filter(x => x !== ip));
    setLogs(prev => [
      ...prev,
      {
        id: `SEC-${Date.now().toString().slice(-4)}`,
        level: 'INFO',
        service: 'Fail2BanGuard',
        message: `IP ${ip} removed from firewall blocklist.`,
        metadata: {},
        createdAt: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Private File url generator
  const generateSignedUrl = () => {
    if (!privateFileName.trim()) return;
    const expiresSec = signedUrlDuration * 60;
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const mockUrl = `https://storage.googleapis.com/everyzone-private-bucket/${privateFileName}?GoogleAccessId=service-account-everyzone@project.iam.gserviceaccount.com&Expires=${Math.floor(Date.now() / 1000) + expiresSec}&Signature=${token}`;
    setGeneratedSignedUrl(mockUrl);

    setLogs(prev => [
      ...prev,
      {
        id: `SEC-${Date.now().toString().slice(-4)}`,
        level: 'INFO',
        service: 'CloudStorageProxy',
        message: `Generated Signed private download URL for GCP Asset: ${privateFileName}`,
        metadata: { expiryMinutes: signedUrlDuration },
        createdAt: new Date().toLocaleTimeString()
      }
    ]);
  };

  // NestJS code folder structure data
  const nestStructure: any = {
    'src': {
      type: 'dir',
      desc: 'Base directory of the NestJS full-stack API.',
      children: {
        'common': {
          type: 'dir',
          desc: 'Global pipes, filters, guards, interceptors, and common utilities used across all API requests.',
          children: {
            'guards': { type: 'file', desc: 'JwtAuthGuard, RolesGuard (enforces UserRole authorization)' },
            'interceptors': { type: 'file', desc: 'LoggingInterceptor (formats API Response metrics), TransformInterceptor' },
            'pipes': { type: 'file', desc: 'ValidationPipe (sanitizes SQL input, parses body properties)' }
          }
        },
        'config': {
          type: 'dir',
          desc: 'Environment variable handling, TypeORM/Prisma settings, Redis cache thresholds, and JWT expiry configuration.',
          children: {
            'configuration.ts': { type: 'file', desc: 'Processes standard env files and exposes secure objects.' },
            'jwt.config.ts': { type: 'file', desc: 'Specifies 15m Access Token + 7d Refresh token parameters.' }
          }
        },
        'database': {
          type: 'dir',
          desc: 'Primary schema definition, Prisma migration runner scripts, and Postgres connection pool configuration.',
          children: {
            'prisma.service.ts': { type: 'file', desc: 'Prisma Client integration provider, handles DB context.' }
          }
        },
        'modules': {
          type: 'dir',
          desc: 'Self-contained feature folders encapsulating specific business logic domains, schemas, controllers, and services.',
          children: {
            'auth': {
              type: 'dir',
              desc: 'Authenticates users, administers JWT rotation, controls MFA PINs, and implements session revocation.',
              children: {
                'auth.controller.ts': { type: 'file', desc: 'Exposes /api/auth/login, /api/auth/refresh endpoints.' },
                'auth.service.ts': { type: 'file', desc: 'Generates JWT tokens and validates user profiles.' }
              }
            },
            'users': {
              type: 'dir',
              desc: 'User account management, role allocation, status flags, and user security configurations.',
              children: {
                'user.entity.ts': { type: 'file', desc: 'Maps User schema, defining role field as Enum: UserRole (BUYER, VENDOR, ADMIN).' }
              }
            },
            'vendors': {
              type: 'dir',
              desc: 'Handles business directory profiles, trade licensing documents, and commission configurations.',
              children: {}
            },
            'kyc': {
              type: 'dir',
              desc: 'Know-Your-Customer processing, government registration integrations, and Fayda biometric schedules.',
              children: {}
            },
            'subscriptions': {
              type: 'dir',
              desc: 'Processes premium memberships, recurring payments, billing records, and subscriber status.',
              children: {}
            },
            'marketplace': {
              type: 'dir',
              desc: 'Integrates local shop catalog listings, item categorizations, inventory states, and public queries.',
              children: {}
            },
            'properties': {
              type: 'dir',
              desc: 'Handles real estate entries, leasing documents, scheduling property viewing, and rental contracts.',
              children: {}
            },
            'jobs': {
              type: 'dir',
              desc: 'Encompasses jobs portals, CV templates, bidding matches, and professional credentials.',
              children: {}
            },
            'wallet': {
              type: 'dir',
              desc: 'Manages ledger micro-audits, tracks user balances, and processes internal credit swaps.',
              children: {}
            },
            'payments': {
              type: 'dir',
              desc: 'Facilitates external payments (Chapa API), processes escrows, and handles secure webhooks.',
              children: {}
            },
            'search': {
              type: 'dir',
              desc: 'Optimizes global keywords across categories with Elasticsearch/Meilisearch indexes.',
              children: {}
            },
            'chat': {
              type: 'dir',
              desc: 'Handles instant communication between buyers, vendors, and landlords.',
              children: {}
            },
            'notifications': {
              type: 'dir',
              desc: 'Triggers system push notifications, SMS OTP pings, and email statements.',
              children: {}
            },
            'reports': {
              type: 'dir',
              desc: 'Logs suspicious vendor fraud indicators, catalog flags, and system reviews.',
              children: {}
            },
            'analytics': {
              type: 'dir',
              desc: 'Aggregates microservices traffic, metrics collection, and dashboard calculations.',
              children: {}
            },
            'admin': {
              type: 'dir',
              desc: 'Super-Admin panel endpoints, listing blocks, platform moderation parameters, and emergency kill-switches.',
              children: {}
            }
          }
        },
        'main.ts': {
          type: 'file',
          desc: 'API entry point. Configures port 3000, attaches CORS headers, enables security rate-limit headers, and mounts global exception handlers.'
        }
      }
    }
  };

  // --- Every-zone Production Infrastructure Handlers ---
  const restartContainer = (id: string) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, status: 'RESTARTING', cpu: 0, memory: 0 } : c));
    setInfraLogs(prev => [`[${new Date().toLocaleTimeString()}] ♻️ RESTART: Container "${id}" initialization process started.`, ...prev]);
    
    setTimeout(() => {
      setContainers(prev => prev.map(c => {
        if (c.id === id) {
          const original = [
            { id: 'flutter-web', cpu: 1.2, memory: 45 },
            { id: 'nestjs-api-1', cpu: 3.4, memory: 128 },
            { id: 'nestjs-api-2', cpu: 2.1, memory: 122 },
            { id: 'postgres-primary', cpu: 1.5, memory: 512 },
            { id: 'postgres-replica', cpu: 0.8, memory: 256 },
            { id: 'redis-cluster', cpu: 0.5, memory: 64 },
            { id: 'bullmq-worker', cpu: 4.8, memory: 92 },
            { id: 'socket-io', cpu: 1.0, memory: 78 },
            { id: 'nginx', cpu: 0.2, memory: 16 },
            { id: 'monitoring-stack', cpu: 5.2, memory: 384 },
          ].find(x => x.id === id);
          return { ...c, status: 'RUNNING', cpu: original?.cpu || 1.5, memory: original?.memory || 128 };
        }
        return c;
      }));
      setInfraLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ SUCCESS: Container "${id}" is online and serving traffic.`, ...prev]);
    }, 1500);
  };

  const toggleContainerStatus = (id: string) => {
    setContainers(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'RUNNING' ? 'STOPPED' : 'RUNNING';
        setInfraLogs(prevLog => [`[${new Date().toLocaleTimeString()}] 🔌 COMMAND: Power state for "${id}" toggled to ${nextStatus}.`, ...prevLog]);
        return {
          ...c,
          status: nextStatus,
          cpu: nextStatus === 'STOPPED' ? 0 : 2.5,
          memory: nextStatus === 'STOPPED' ? 0 : 120
        };
      }
      return c;
    }));
  };

  const runManualBackup = () => {
    if (backupStatus === 'BACKING_UP') return;
    setBackupStatus('BACKING_UP');
    setBackupLogs(prev => [`[${new Date().toLocaleTimeString()}] 💾 BACKUP START: Invoking pg_dump database extraction...`, ...prev]);

    setTimeout(() => {
      setBackupLogs(prev => [`[${new Date().toLocaleTimeString()}] ⏳ DUMPING: [1/4] Scanning Postgres metadata & indexes...`, ...prev]);
    }, 1000);

    setTimeout(() => {
      setBackupLogs(prev => [`[${new Date().toLocaleTimeString()}] 📦 PACKING: [2/4] Binary compressed (48.2 MB down to 8.6 MB tar.gz).`, ...prev]);
    }, 2200);

    setTimeout(() => {
      setBackupLogs(prev => [`[${new Date().toLocaleTimeString()}] 🔒 ENCRYPTING: [3/4] Running AES-256-GCM cipher encryption...`, ...prev]);
    }, 3400);

    setTimeout(() => {
      setBackupLogs(prev => {
        const fileId = `backup-snap-${Date.now().toString().slice(-4)}.sql.enc`;
        return [
          `[${new Date().toLocaleTimeString()}] 💾 SUCCESS: Archive encrypted & stored safely with 30-day retention lock. Snapshot ID: "${fileId}"`,
          `[${new Date().toLocaleTimeString()}] ☁️ UPLOADED: [4/4] Transferred bundle securely via TLS-1.3 to ${backupStorage} Bucket "everyzone-production-backups".`,
          ...prev
        ];
      });
      setBackupStatus('COMPLETED');
    }, 4600);
  };

  const triggerDisaster = () => {
    setDrStatus('DISASTER');
    setContainers(prev => prev.map(c => {
      if (c.id === 'postgres-primary') {
        return { ...c, status: 'DOWN', cpu: 0, memory: 0 };
      }
      if (c.id.startsWith('nestjs-api') || c.id === 'bullmq-worker' || c.id === 'socket-io') {
        return { ...c, status: 'UNSTABLE', cpu: 0.2, memory: 80 };
      }
      return c;
    }));
    setInfraLogs(prev => [
      `[${new Date().toLocaleTimeString()}] 🚨 SRE CRITICAL ERROR: Connection to PostgreSQL Primary DB port 5432 failed!`,
      `[${new Date().toLocaleTimeString()}] 🚨 SRE CRITICAL ERROR: API connection pools saturated (retrying upstreams with exponential backoff).`,
      `[${new Date().toLocaleTimeString()}] 🚨 SRE ALERT: Sentry exception captured. PagerDuty on-call engineers notified.`,
      ...prev
    ]);
  };

  const runDisasterRecovery = () => {
    if (drStatus !== 'DISASTER') return;
    setDrStatus('FAILOVER');
    setInfraLogs(prev => [`[${new Date().toLocaleTimeString()}] 🛠️ RECOVERY: Initiating disaster mitigation protocol...`, ...prev]);

    setTimeout(() => {
      setDrStatus('RESTORING');
      setInfraLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🛠️ RECOVERY STEP 1: Promoting Read Replica "postgres-replica" (port 5433) to Primary R/W Authority.`,
        ...prev
      ]);
      setContainers(prev => prev.map(c => {
        if (c.id === 'postgres-replica') {
          return { ...c, name: 'PostgreSQL (Promoted Primary)', port: '5432:5432', cpu: 2.1 };
        }
        return c;
      }));
    }, 1500);

    setTimeout(() => {
      setInfraLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🛠️ RECOVERY STEP 2: Restoring schema tables from latest clean daily S3 backup checkpoint...`,
        ...prev
      ]);
    }, 3000);

    setTimeout(() => {
      setInfraLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🛠️ RECOVERY STEP 3: Re-pointing NestJS configuration maps to new db host and recycling upstreams...`,
        ...prev
      ]);
      setContainers(prev => prev.map(c => {
        if (c.id.startsWith('nestjs-api')) {
          return { ...c, status: 'RUNNING', cpu: 3.5, memory: 128 };
        }
        return c;
      }));
    }, 4500);

    setTimeout(() => {
      setDrStatus('RECOVERED');
      setInfraLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🎉 RECOVERY SUCCESS: All upstreams reporting green. Health checks complete (200 OK). Traffic routing restored!`,
        ...prev
      ]);
      setContainers(prev => prev.map(c => {
        if (c.id === 'bullmq-worker' || c.id === 'socket-io' || c.id === 'postgres-primary') {
          return { ...c, status: 'RUNNING', cpu: 2.5, memory: 90 };
        }
        return c;
      }));
    }, 6000);
  };

  const verifyWebhook = () => {
    if (webhookVerifying) return;
    setWebhookVerifying(true);
    const txId = `TX-${selectedWebhookSource.toUpperCase().substring(0, 3)}-${Math.floor(Math.random() * 90000) + 10000}`;
    
    setWebhookLogs(prev => [
      { id: `WH-${Math.floor(Math.random() * 900) + 100}`, timestamp: 'Just now', gateway: selectedWebhookSource, event: 'charge.completed', amount: `${webhookTestAmount} ETB`, status: 'VERIFYING', txId },
      ...prev
    ]);

    setTimeout(() => {
      setWebhookLogs(prev => {
        const updated = [...prev];
        if (updated[0]) {
          updated[0] = { ...updated[0], status: 'VERIFIED' };
        }
        return updated;
      });
      
      setLogs(sysLogs => [
        {
          id: `WH-OK-${Date.now().toString().slice(-3)}`,
          level: 'INFO',
          service: 'PaymentProxy',
          message: `Cryptographic SHA-256 validation succeeded for ${selectedWebhookSource} endpoint. Transaction ${txId} amount: ${webhookTestAmount} ETB verified. Dual-entry ledger balance credited.`,
          metadata: { provider: selectedWebhookSource, amount: webhookTestAmount, txId },
          createdAt: new Date().toLocaleTimeString()
        },
        ...sysLogs
      ]);
      
      setWebhookVerifying(false);
    }, 1500);
  };

  const handleMockUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUploadedFileName.trim()) return;
    
    const size = `${(Math.random() * 5 + 0.1).toFixed(1)} MB`;
    const bucket = selectedStorageFolder === 'house_images' || selectedStorageFolder === 'profile_photos' ? 'Cloudinary' : 'AWS S3';
    
    setStorageFiles(prev => [
      { name: newUploadedFileName.trim(), folder: selectedStorageFolder, size, bucket },
      ...prev
    ]);
    
    setInfraLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ☁️ STORAGE: Uploaded "${newUploadedFileName.trim()}" directly to S3/Cloudinary directory "/${selectedStorageFolder}/"`,
      ...prev
    ]);
    
    setNewUploadedFileName('');
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const filteredLogs = logs.filter(l => {
    if (logFilter !== 'ALL' && l.level !== logFilter) return false;
    if (logServiceFilter !== 'ALL' && l.service !== logServiceFilter) return false;
    return true;
  });

  return (
    <div className={`p-4 md:p-6 rounded-3xl border shadow-xl transition-all duration-300 max-w-6xl mx-auto ${
      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-[#FAF9F5] border-stone-200 text-stone-900'
    }`}>
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4 border-stone-250/50 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white shadow-md">
            <Activity className="animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight flex items-center gap-2">
              {lang === 'en' ? 'SRE, Monitoring & Security Platform' : 'ኤስአርኢ፣ ክትትልና የደህንነት ማዕከል'}
              <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">
                SEC-OPS
              </span>
            </h2>
            <p className="text-xs opacity-65 mt-0.5">
              {lang === 'en' 
                ? 'Consolidated view of core microservices metrics, Loki logging, Sentry error telemetry, JWT token rotation, and private cloud storage.' 
                : 'የኤቭሪ-ዞን ዋና ሲስተም ክትትል፣ የሎኪ ሰሌዳ፣ የሴንትሪ ስህተቶች ቁጥጥር፣ የጄደብሊውቲ ቶከን ዑደት እና የደህንነት መጠበቂያ በሮች።'}
            </p>
          </div>
        </div>

        {/* Global tab options */}
        <div className="flex flex-wrap gap-1 bg-stone-100 dark:bg-zinc-900 p-1 rounded-xl border border-stone-200/50 dark:border-zinc-800">
          {[
            { id: 'metrics' as const, label: lang === 'en' ? 'Metrics & Alerts' : 'ሜትሪክስና ማንቂያ', icon: <Activity size={14} /> },
            { id: 'logs' as const, label: lang === 'en' ? 'Log Aggregator' : 'የሲስተም ሎግ', icon: <TerminalIcon size={14} /> },
            { id: 'security' as const, label: lang === 'en' ? 'Security Gate' : 'ደህንነት መጠበቂያ', icon: <Shield size={14} /> },
            { id: 'onboarding' as const, label: lang === 'en' ? 'Vendor Onboarding' : 'የሻጭ ምዝገባ ሒደት', icon: <UserCheck size={14} /> },
            { id: 'blueprint' as const, label: lang === 'en' ? 'NestJS Blueprint' : 'ኔስትጄኤስ መዋቅር', icon: <FolderTree size={14} /> },
            { id: 'infrastructure' as const, label: lang === 'en' ? 'Prod Infra & Ops' : 'የምርት መሰረተ ልማት', icon: <Server size={14} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === t.id 
                  ? 'bg-gradient-to-r from-red-500 to-indigo-600 text-white shadow-xs' 
                  : (isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-stone-600 hover:text-stone-900')
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE VIEW RENDERING */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          
          {/* ======================================================== */}
          {/* TAB 1: METRICS & ALERTS (Prometheus, Grafana, AlertManager) */}
          {/* ======================================================== */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              
              {/* Top Quick Status Dashboard Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Server CPU Usage', val: `${serverMetrics.cpu}%`, desc: 'Docker container usage', status: serverMetrics.cpu > 80 ? 'critical' : serverMetrics.cpu > 65 ? 'warning' : 'healthy', icon: '💻' },
                  { title: 'Active Memory', val: `${serverMetrics.memory}%`, desc: 'Heap allocation count', status: serverMetrics.memory > 80 ? 'critical' : 'healthy', icon: '💾' },
                  { title: 'Redis Cache Status', val: serverMetrics.redisHealth, desc: 'Cluster response time: 2ms', status: 'healthy', icon: '⚡' },
                  { title: 'Orders Per Hour', val: `${serverMetrics.ordersPerHour} Tx`, desc: 'Average transaction velocity', status: 'healthy', icon: '🛒' },
                ].map((c, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'
                  } relative overflow-hidden flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-black tracking-wider text-stone-500 dark:text-zinc-400">{c.title}</span>
                      <span className="text-sm">{c.icon}</span>
                    </div>
                    <div className="my-2 flex items-baseline gap-1.5">
                      <span className="text-xl font-black font-mono">{c.val}</span>
                      <span className={`text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
                        c.status === 'critical' ? 'bg-red-500/10 text-red-500 animate-pulse'
                        : c.status === 'warning' ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <span className="text-[8.5px] opacity-60 block truncate">{c.desc}</span>
                  </div>
                ))}
              </div>

              {/* Graphical Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Chart A: API Response Time Latencies */}
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-indigo-500">API Response Time Latency (Prometheus / Grafana)</h4>
                      <span className="text-[9px] opacity-60 block">Real-time HTTP request execution span in milliseconds</span>
                    </div>
                    <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      POLLING ACTIVE
                    </span>
                  </div>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={apiResponseData}>
                        <defs>
                          <linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorBackend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#27272a" : "#e7e5e4"} />
                        <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke={isDarkMode ? "#52525b" : "#78716c"} />
                        <YAxis tick={{ fontSize: 9 }} stroke={isDarkMode ? "#52525b" : "#78716c"} unit="ms" />
                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#09090b' : '#faf9f6', borderColor: isDarkMode ? '#27272a' : '#e7e5e4', fontSize: 10 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="Vite Client API" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorClient)" />
                        <Area type="monotone" dataKey="NestJS Backend" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBackend)" />
                        <Line type="monotone" dataKey="Database Query Latency" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart B: Database Queries and Connections */}
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-rose-500">Database Queries & Cache Performance</h4>
                      <span className="text-[9px] opacity-60 block">PostgreSQL concurrent connection pools vs Redis cache hits ratio</span>
                    </div>
                    <span className="text-[8px] font-mono bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded">
                      DB_POOL_HEALTHY
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dbQueriesData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#27272a" : "#e7e5e4"} />
                        <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke={isDarkMode ? "#52525b" : "#78716c"} />
                        <YAxis tick={{ fontSize: 9 }} stroke={isDarkMode ? "#52525b" : "#78716c"} />
                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#09090b' : '#faf9f6', borderColor: isDarkMode ? '#27272a' : '#e7e5e4', fontSize: 10 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="Active Queries" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Redis Cache Hits" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* AlertManager & Incident monitoring section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left panel: AlertManager triggers (7 columns) */}
                <div className={`lg:col-span-7 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} flex flex-col justify-between`}>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <Flame size={14} className="animate-bounce" />
                        AlertManager Rules Configuration
                      </h4>
                      <span className="text-[8.5px] opacity-65 font-mono">Status: ACTIVE</span>
                    </div>
                    <p className="text-[10px] opacity-65 mb-4">
                      Select custom notification channels (Email, Telegram, Slack, SMS) for each rule and trigger them manually to verify the alerts delivery loop.
                    </p>

                    <div className="space-y-2">
                      {alerts.map(a => (
                        <div key={a.id} className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          a.triggered 
                            ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                            : (isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-stone-50 border-stone-150')
                        }`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${a.triggered ? 'bg-red-500 animate-ping' : 'bg-stone-300 dark:bg-zinc-700'}`} />
                              <span className="text-[11px] font-extrabold uppercase tracking-tight">{a.name}</span>
                              <span className={`text-[7.5px] uppercase font-black px-1.5 py-0.2 rounded ${
                                a.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                              }`}>
                                {a.severity}
                              </span>
                            </div>
                            <span className="text-[9.5px] font-mono opacity-65 block mt-0.5">{a.condition}</span>
                          </div>

                          {/* Trigger channel checkmarks */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-900 p-1 rounded-lg border border-stone-250/20 dark:border-zinc-800">
                              {(['email', 'telegram', 'slack', 'sms'] as const).map(ch => (
                                <button
                                  key={ch}
                                  type="button"
                                  onClick={() => toggleAlertChannel(a.id, ch)}
                                  className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tight cursor-pointer ${
                                    a.channels[ch] 
                                      ? 'bg-indigo-500 text-white shadow-xs' 
                                      : 'opacity-40 hover:opacity-75'
                                  }`}
                                >
                                  {ch}
                                </button>
                              ))}
                            </div>

                            {a.triggered ? (
                              <button
                                type="button"
                                onClick={() => resolveAlert(a.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider cursor-pointer"
                              >
                                RESOLVE
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => triggerAlert(a.name, a.condition)}
                                className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-wider cursor-pointer"
                              >
                                FIRE ALERT
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right panel: Active dispatch logs (5 columns) */}
                <div className={`lg:col-span-5 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} flex flex-col justify-between`}>
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-1.5">
                        <Send size={14} />
                        Alert Notification Dispatch Hub
                      </h4>
                      <p className="text-[10px] opacity-65 mb-3">
                        Outputs real-time channel delivery statuses of triggered infrastructure events.
                      </p>
                    </div>

                    <div className="flex-1 min-h-[180px] max-h-[220px] overflow-y-auto bg-stone-100 dark:bg-zinc-950 p-3 rounded-xl border border-stone-250/30 dark:border-zinc-850 font-mono text-[9px] space-y-2">
                      {notifiedChannelsLog.length === 0 ? (
                        <div className="h-full flex items-center justify-center opacity-40">
                          Standby: No alerts fired recently.
                        </div>
                      ) : (
                        notifiedChannelsLog.map((log, index) => (
                          <div key={index} className={`pb-1.5 border-b border-stone-200/50 dark:border-zinc-850 last:border-0 ${
                            log.includes('RESOLVED') ? 'text-emerald-500' : 'text-rose-500 font-bold'
                          }`}>
                            <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span> {log}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-3 p-2.5 bg-yellow-500/10 border border-yellow-500/25 rounded-xl flex items-start gap-2">
                      <Info className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" size={13} />
                      <p className="text-[9px] text-yellow-700 dark:text-yellow-400 leading-normal">
                        <strong>Escalation Policy:</strong> Critical category events not resolved within 5 minutes are auto-escalated to SMS and continuous phone ringing through our Twilio backup proxies.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SYSTEM LOG AGGREGATOR & ERROR TRACKING (Loki/Sentry) */}
          {/* ======================================================== */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              
              {/* Loki Log Aggregation Search Filters & Stats */}
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                      <TerminalIcon size={14} />
                      Loki Log Aggregator (SystemLog Index)
                    </h3>
                    <p className="text-[10px] opacity-65 mt-0.5">
                      Queries full database index mapping for prisma SystemLog records. Auto-injects simulated microservices outputs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={triggerSentryCrash}
                    className="self-end sm:self-auto px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-500 to-indigo-600 text-white font-black text-xs cursor-pointer active:scale-95 shadow-md flex items-center gap-1.5 border-b-2 border-indigo-800"
                  >
                    <AlertOctagon size={13} />
                    TRIGGER MOCK SENTRY EXCEPTION
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[9px] font-extrabold uppercase opacity-60 block mb-1">Filter by Level</label>
                    <select
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      className={`w-full p-1.5 rounded-lg text-xs font-mono border outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      <option value="ALL">ALL LEVELS</option>
                      <option value="INFO">INFO ONLY</option>
                      <option value="WARNING">WARNINGS ONLY</option>
                      <option value="ERROR">ERRORS ONLY</option>
                      <option value="CRITICAL">CRITICAL EXCELLENCE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold uppercase opacity-60 block mb-1">Filter by Service</label>
                    <select
                      value={logServiceFilter}
                      onChange={(e) => setLogServiceFilter(e.target.value)}
                      className={`w-full p-1.5 rounded-lg text-xs font-mono border outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      <option value="ALL">ALL SERVICES</option>
                      <option value="AuthService">AuthService</option>
                      <option value="MarketplaceService">MarketplaceService</option>
                      <option value="WalletProxy">WalletProxy</option>
                      <option value="AdCampaignManager">AdCampaignManager</option>
                      <option value="SearchEngine">SearchEngine</option>
                      <option value="PrismaConnector">PrismaConnector</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold uppercase opacity-60 block mb-1">Max Logs limit</label>
                    <select
                      value={maxLogsCount}
                      onChange={(e) => setMaxLogsCount(Number(e.target.value))}
                      className={`w-full p-1.5 rounded-lg text-xs font-mono border outline-none ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      <option value="50">Show last 50</option>
                      <option value="100">Show last 100</option>
                      <option value="250">Show last 250</option>
                    </select>
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => setLogs([])}
                      className={`w-full py-1.5 px-3 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                        isDarkMode ? 'bg-zinc-950 hover:bg-zinc-900 border-zinc-850 text-zinc-400' : 'bg-stone-50 hover:bg-stone-100 border-stone-250 text-stone-600'
                      }`}
                    >
                      Clear Index logs
                    </button>
                  </div>
                </div>

                {/* Main terminal screen */}
                <div className="bg-black border border-zinc-800 rounded-xl p-3 flex flex-col justify-between h-80">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2 text-[9px] text-zinc-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>UTC AGGREGATOR INGRESS LIVE CONNECTION STREAM (STDOUT)</span>
                    </div>
                    <span>TOTAL SHOWN: {filteredLogs.length} LINES</span>
                  </div>

                  <div className="flex-1 overflow-y-auto font-mono text-[9.5px] leading-relaxed space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 pr-1 select-text">
                    {filteredLogs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-zinc-600 italic">
                        No logs match current level filters. Active-polling is working...
                      </div>
                    ) : (
                      filteredLogs.map((lg, index) => {
                        const levelColors = lg.level === 'CRITICAL' ? 'text-red-500 font-extrabold bg-red-950/30 border border-red-800 px-1 py-0.5 rounded'
                          : lg.level === 'ERROR' ? 'text-red-400 font-bold'
                          : lg.level === 'WARNING' ? 'text-yellow-400'
                          : 'text-zinc-400';

                        return (
                          <div key={index} className="flex flex-col md:flex-row md:items-start gap-1 p-1 hover:bg-zinc-950 rounded transition-colors group">
                            <span className="text-zinc-600 shrink-0 select-none">[{lg.createdAt}]</span>
                            <span className={`shrink-0 uppercase text-[8px] tracking-wide font-black px-1 rounded inline-block text-center mr-1 ${levelColors}`}>
                              {lg.level}
                            </span>
                            <span className="text-cyan-400 font-bold shrink-0">[{lg.service}]:</span>
                            <span className="text-zinc-200 flex-1">{lg.message}</span>
                            {lg.metadata && (
                              <span className="text-zinc-500 text-[8px] font-light opacity-0 group-hover:opacity-100 transition-opacity">
                                metadata: {JSON.stringify(lg.metadata)}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                    <div ref={logEndRef} />
                  </div>
                </div>

              </div>

              {/* Sentry dashboard and exception list */}
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-3`}>
                <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-zinc-800/80 pb-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                      <AlertOctagon size={14} />
                      Sentry Exception & Crash Tracker (SRE)
                    </h3>
                    <p className="text-[10px] opacity-65">
                      Captures raw uncaught errors on client (React) and server (NestJS) layers.
                    </p>
                  </div>
                  <span className="text-[8px] font-mono bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded">
                    3 BLOCKED ISSUES
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sentryIssues.map(issue => (
                    <div key={issue.id} className={`p-3 rounded-xl border flex flex-col justify-between ${
                      issue.severity === 'critical' ? 'bg-red-500/5 border-red-500/30'
                      : issue.severity === 'error' ? 'bg-orange-500/5 border-orange-500/30'
                      : 'bg-zinc-100/10 dark:bg-zinc-950 border-stone-200 dark:border-zinc-850'
                    }`}>
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[8.5px] font-mono uppercase bg-stone-200 dark:bg-zinc-900 px-1.5 py-0.5 rounded font-black text-rose-500">
                            {issue.id}
                          </span>
                          <span className="text-[8px] opacity-55">Last seen: {issue.lastSeen}</span>
                        </div>
                        <h4 className="text-[10px] font-extrabold leading-tight text-stone-800 dark:text-zinc-200 line-clamp-2">
                          {issue.title}
                        </h4>
                      </div>

                      <div className="mt-3 flex justify-between items-center pt-2 border-t border-stone-200/50 dark:border-zinc-800/50">
                        <span className="text-[9px] opacity-60">Total hits: <strong>{issue.count}</strong></span>
                        <span className="text-[8.5px] uppercase font-black text-indigo-500 hover:underline cursor-pointer flex items-center gap-0.5">
                          View details <ChevronRight size={10} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: THE SECURITY LAYER (JWT, Session Revocation, firewall) */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Token rotation & Session controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left: Token rotation limits (5 cols) */}
                <div className={`lg:col-span-5 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 mb-2">
                      <Key size={14} />
                      JWT Authorization & Token Rotation
                    </h3>
                    <p className="text-[10px] opacity-65 mb-4 leading-normal">
                      Configures micro-services token verification values. Employs security measures preventing hijack replay attacks.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold opacity-75 mb-1">
                          <span>Access Token Lifespan</span>
                          <span className="font-mono text-indigo-500">{jwtConfig.accessTokenExpiry}</span>
                        </div>
                        <input 
                          type="range" 
                          min={5} 
                          max={60} 
                          step={5}
                          value={parseInt(jwtConfig.accessTokenExpiry) || 15}
                          onChange={(e) => setJwtConfig(prev => ({ ...prev, accessTokenExpiry: `${e.target.value}m` }))}
                          className="w-full h-1 bg-stone-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between text-[8px] opacity-50 font-mono mt-0.5">
                          <span>5m (Strict)</span>
                          <span>60m (Relaxed)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-bold opacity-75 mb-1">
                          <span>Refresh Token Lifespan</span>
                          <span className="font-mono text-indigo-500">{jwtConfig.refreshTokenExpiry}</span>
                        </div>
                        <select
                          value={jwtConfig.refreshTokenExpiry}
                          onChange={(e) => setJwtConfig(prev => ({ ...prev, refreshTokenExpiry: e.target.value }))}
                          className={`w-full p-2 rounded-xl text-xs font-mono border outline-none ${
                            isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          <option value="1d">1 Day</option>
                          <option value="3d">3 Days</option>
                          <option value="7d">7 Days (Default)</option>
                          <option value="30d">30 Days (Extended)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-stone-100 dark:bg-zinc-950 rounded-xl border border-stone-200/50 dark:border-zinc-850">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase block text-stone-800 dark:text-zinc-200">Continuous Token Rotation</span>
                          <span className="text-[8.5px] opacity-60 block">Rotates the refresh token on every usage</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={jwtConfig.tokenRotation}
                            onChange={() => setJwtConfig(prev => ({ ...prev, tokenRotation: !prev.tokenRotation }))}
                            className="sr-only peer"
                            id="token-rotation-toggle"
                          />
                          <div className="w-9 h-5 bg-stone-250 dark:bg-zinc-850 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-stone-100 dark:bg-zinc-950 rounded-xl border border-stone-200/50 dark:border-zinc-850">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase block text-stone-800 dark:text-zinc-200">Rate Limiting Limit</span>
                          <span className="text-[8.5px] opacity-60 block">Default requests threshold per IP / min</span>
                        </div>
                        <span className="text-[10px] font-mono font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {jwtConfig.rateLimitThreshold} / MIN
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200/50 dark:border-zinc-800/80 mt-4">
                    <button
                      type="button"
                      onClick={rotateTokensNow}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-black uppercase text-xs active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={13} className="animate-spin-slow" />
                      Rotate Master Encryption Key
                    </button>
                  </div>
                </div>

                {/* Right: Active Sessions & Revocation (7 cols) */}
                <div className={`lg:col-span-7 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5 mb-2">
                      <UserCheck size={14} />
                      Active User Session Revocation
                    </h3>
                    <p className="text-[10px] opacity-65 mb-3 leading-normal">
                      Security monitors live logged-in user tokens. Administrators can terminate compromised session tokens instantly.
                    </p>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-1">
                      {activeSessions.map(sess => (
                        <div key={sess.id} className={`p-2.5 rounded-xl border flex items-center justify-between text-left text-[10px] font-mono transition-colors ${
                          sess.active 
                            ? (isDarkMode ? 'bg-zinc-950 border-zinc-855' : 'bg-stone-50 border-stone-150') 
                            : 'bg-stone-100/50 dark:bg-zinc-900/50 border-stone-200/50 dark:border-zinc-850 opacity-55'
                        }`}>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${sess.active ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                              <span className="font-extrabold uppercase">{sess.userId}</span>
                              <span className="text-[7.5px] uppercase font-black bg-stone-200 dark:bg-zinc-850 text-stone-500 px-1 rounded font-sans">{sess.role}</span>
                            </div>
                            <div className="text-[9px] opacity-60">IP: {sess.ip} | Location: {sess.location}</div>
                            <div className="text-[8.5px] opacity-50 truncate max-w-[280px]">Client: {sess.device} ({sess.createdAt})</div>
                          </div>

                          <div className="shrink-0 ml-2">
                            {sess.active ? (
                              <button
                                type="button"
                                onClick={() => revokeSession(sess.id)}
                                className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-sans font-black uppercase text-[8px] active:scale-95 transition-all cursor-pointer"
                              >
                                REVOKE TOKEN
                              </button>
                            ) : (
                              <span className="text-[8.5px] font-bold text-stone-400 uppercase">Revoked</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-start gap-2 mt-4">
                    <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                    <p className="text-[9px] text-emerald-700 dark:text-emerald-400 leading-normal">
                      <strong>Redis Session Storage enabled:</strong> Revocations propagate to all live node API gates within 250 milliseconds using redis pub-sub triggers.
                    </p>
                  </div>
                </div>

              </div>

              {/* IP Blocking, Fail2Ban, DDoS Panel, Private storage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Fail2Ban & IP blocklist (6 cols) */}
                <div className={`lg:col-span-6 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5 mb-2">
                      <Network size={14} />
                      Fail2Ban Guard & IP Blocklist
                    </h3>
                    <p className="text-[10px] opacity-65 mb-3 leading-normal">
                      Drop malicious scripts trying to perform DDoS or brute-force authorization. Block specific subnets dynamically.
                    </p>

                    <div className="flex gap-1.5 mb-3">
                      <input 
                        type="text"
                        value={newBlockedIp}
                        onChange={(e) => setNewBlockedIp(e.target.value)}
                        placeholder="e.g. 185.120.44.22"
                        className={`flex-1 p-2 rounded-xl text-xs font-mono border outline-none ${
                          isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={blockIpAddress}
                        className="px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs active:scale-95 transition-all shadow-xs"
                      >
                        Block IP
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                      {blockedIPs.map(ip => (
                        <div key={ip} className="flex items-center justify-between p-1.5 bg-stone-100 dark:bg-zinc-950 rounded-lg border border-stone-200/50 dark:border-zinc-850/80 text-[10px] font-mono">
                          <div className="flex items-center gap-1.5 text-rose-500">
                            <span>🚫</span>
                            <span>{ip}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => unblockIp(ip)}
                            className="text-[8.5px] font-bold text-indigo-500 hover:underline cursor-pointer"
                          >
                            Unblock Rule
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-150 dark:border-zinc-850 text-left">
                    <div className="flex justify-between items-center text-[9px] font-mono opacity-65">
                      <span>Live Block Filter Rate:</span>
                      <strong className="text-rose-500 font-extrabold">2,412 Packets/Sec</strong>
                    </div>
                  </div>
                </div>

                {/* GCP Signed URLs Private Storage Generator (6 cols) */}
                <div className={`lg:col-span-6 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-2">
                      <LockKeyhole size={14} />
                      GCP Private Storage & Signed URLs
                    </h3>
                    <p className="text-[10px] opacity-65 mb-3 leading-normal">
                      Files are securely stored in private cloud buckets. Request a secure temporary signed download URL for sensitive assets.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-extrabold uppercase opacity-60 block mb-1">Target Asset File Path</label>
                        <input 
                          type="text"
                          value={privateFileName}
                          onChange={(e) => setPrivateFileName(e.target.value)}
                          placeholder="contracts/licence_agreement.pdf"
                          className={`w-full p-2 rounded-xl text-xs font-mono border outline-none ${
                            isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase opacity-60 block mb-1">Signed URL Expiration duration (Minutes)</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[5, 15, 60, 180].map(dur => (
                            <button
                              key={dur}
                              type="button"
                              onClick={() => setSignedUrlDuration(dur)}
                              className={`p-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                                signedUrlDuration === dur 
                                  ? 'bg-amber-500 text-zinc-950 border-amber-500 font-black' 
                                  : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-stone-50 border-stone-200 text-stone-600')
                              }`}
                            >
                              {dur} Mins
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={generateSignedUrl}
                        className="w-full py-1.5 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-600 font-black text-xs active:scale-95 transition-all shadow-xs"
                      >
                        Generate Secure Signed URL
                      </button>

                      {generatedSignedUrl && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-1.5 bg-stone-100 dark:bg-zinc-950 p-2.5 rounded-xl border border-amber-500/30 font-mono text-[8.5px]"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-amber-500 font-black">SIGNED ACCESS URL CREATED</span>
                            <span className="opacity-55">Expires: in {signedUrlDuration} minutes</span>
                          </div>
                          <div className="p-1 bg-black text-zinc-300 rounded break-all max-h-[60px] overflow-y-auto">
                            {generatedSignedUrl}
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedSignedUrl);
                                alert('Link copied!');
                              }}
                              className="text-amber-500 hover:underline font-bold"
                            >
                              Copy Link
                            </button>
                            <a
                              href="#void"
                              onClick={(e) => { e.preventDefault(); alert('Signed token validation simulation passed. Download started safely.'); }}
                              className="text-cyan-500 hover:underline font-bold"
                            >
                              Simulate Download
                            </a>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>
                </div>

              </div>

              {/* Complete Security Compliance Audit checklist */}
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-3`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  Continuous Security Compliance Audit checklist
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { key: 'tls13' as const, label: 'TLS 1.3 / HTTPS Encryption', desc: 'Secure transit' },
                    { key: 'firewall' as const, label: 'Kubernetes VPC Firewall', desc: 'Secure virtual network' },
                    { key: 'encryptedBackups' as const, label: 'Encrypted S3 Backups', desc: 'AES-256 database storage' },
                    { key: 'leastPrivilege' as const, label: 'Least Privilege Access', desc: 'IAM Service accounts' },
                    { key: 'readReplicas' as const, label: 'Active PostgreSQL Read Replicas', desc: 'Database scale out' },
                    { key: 'secretRotation' as const, label: 'Weekly Secret Rotation', desc: 'Vault integrations' },
                    { key: 'inputSanitization' as const, label: 'Request Input Sanitization', desc: 'Anti XSS & SQLi injections' },
                    { key: 'fail2ban' as const, label: 'Fail2Ban Guard rules', desc: 'Intrusion prevention' },
                    { key: 'ddosProtection' as const, label: 'Cloudflare DDoS Protection', desc: 'Rate Limiting gate' },
                  ].map(chk => (
                    <div
                      key={chk.key}
                      onClick={() => setSecurityChecklist(prev => ({ ...prev, [chk.key]: !prev[chk.key] }))}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        securityChecklist[chk.key]
                          ? (isDarkMode ? 'bg-emerald-500/5 border-emerald-500/40' : 'bg-emerald-50 border-emerald-200')
                          : (isDarkMode ? 'bg-zinc-900/50 border-zinc-850 opacity-50' : 'bg-stone-50 border-stone-200 opacity-55')
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-tight">{chk.label}</span>
                        {securityChecklist[chk.key] ? (
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle size={12} className="text-stone-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[8px] opacity-60 mt-1 leading-tight">{chk.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: VENDOR ONBOARDING FLOW PLAYGROUND */}
          {/* ======================================================== */}
          {activeTab === 'onboarding' && (
            <div className="space-y-6">
              
              {/* Introduction header */}
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-2`}>
                <h3 className="text-sm font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <UserCheck size={16} />
                  Every-Zone Vendor Onboarding Pipeline Simulator
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  Test and trace our backend registration database state machine. This flow implements <strong>NestJS Auth/Vendors controllers</strong>, encrypts phone profiles, saves <strong>Prisma user/vendor relations</strong>, collects KYC documents, and routes admin reviews.
                </p>
                
                {/* Horizontal Progress bar steps */}
                <div className="grid grid-cols-5 gap-1.5 pt-3">
                  {[
                    { nr: 1, title: '1. Register', desc: 'POST /auth/register', active: obFlowStep >= 1, done: obFlowStep > 1 },
                    { nr: 2, title: '2. Create Vendor', desc: 'POST /vendors/create', active: obFlowStep >= 2, done: obFlowStep > 2 },
                    { nr: 3, title: '3. Submit KYC', desc: 'ID Documents Upload', active: obFlowStep >= 3, done: obFlowStep > 3 },
                    { nr: 4, title: '4. Admin Review', desc: 'KYC Verification Panel', active: obFlowStep >= 4, done: obFlowStep > 4 },
                    { nr: 5, title: '5. Approved!', desc: 'Vendor Activated', active: obFlowStep >= 5, done: obFlowStep > 5 },
                  ].map(step => (
                    <div 
                      key={step.nr}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        obFlowStep === step.nr 
                          ? 'bg-rose-500/5 border-rose-500 shadow-sm'
                          : step.done 
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : (isDarkMode ? 'bg-zinc-900/50 border-zinc-850 opacity-40' : 'bg-stone-50 border-stone-200 opacity-50')
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${
                          obFlowStep === step.nr ? 'text-rose-500' : step.done ? 'text-emerald-500' : 'opacity-65'
                        }`}>
                          {step.title}
                        </span>
                        {step.done ? (
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        ) : obFlowStep === step.nr ? (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        ) : null}
                      </div>
                      <span className="text-[8px] font-mono block opacity-60 truncate">{step.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Workspace Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left side: Interactive Forms (7 columns) */}
                <div className={`lg:col-span-7 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-4`}>
                  
                  {/* STEP 1 FORM: Register */}
                  {obFlowStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded font-black">
                          STEP 1: USER REGISTRATION (POST /auth/register)
                        </span>
                        <h4 className="text-sm font-black tracking-tight mt-1">Create your customer profile</h4>
                        <p className="text-[10px] opacity-65 leading-normal mt-0.5">
                          Submitting this form dispatches the Registration DTO, hashes the password, and returns a dynamic JWT Bearer token pair.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">First Name</label>
                          <input 
                            type="text"
                            placeholder="e.g. Almaz"
                            value={obFormUser.firstName}
                            onChange={(e) => setObFormUser(prev => ({ ...prev, firstName: e.target.value }))}
                            className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Last Name</label>
                          <input 
                            type="text"
                            placeholder="e.g. Kebede"
                            value={obFormUser.lastName}
                            onChange={(e) => setObFormUser(prev => ({ ...prev, lastName: e.target.value }))}
                            className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Phone (Required @unique)</label>
                          <input 
                            type="text"
                            placeholder="+251911998877"
                            value={obFormUser.phone}
                            onChange={(e) => setObFormUser(prev => ({ ...prev, phone: e.target.value }))}
                            className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Email (Optional @unique)</label>
                          <input 
                            type="email"
                            placeholder="almaz@example.com"
                            value={obFormUser.email}
                            onChange={(e) => setObFormUser(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Password</label>
                        <input 
                          type="password"
                          placeholder="••••••••"
                          value={obFormUser.password}
                          onChange={(e) => setObFormUser(prev => ({ ...prev, password: e.target.value }))}
                          className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!obFormUser.firstName || !obFormUser.lastName || !obFormUser.phone || !obFormUser.password) {
                            alert('Please fill out all required fields: Name, Phone and Password.');
                            return;
                          }
                          const uId = `usr-user-${Math.floor(Math.random()*9000)+1000}`;
                          const newUser = {
                            id: uId,
                            firstName: obFormUser.firstName,
                            lastName: obFormUser.lastName,
                            fullName: `${obFormUser.firstName} ${obFormUser.lastName}`,
                            phone: obFormUser.phone,
                            email: obFormUser.email || `${obFormUser.phone}@everyzone.et`,
                            role: 'BUYER',
                            active: true,
                            verified: false,
                            createdAt: new Date().toISOString().split('T')[0]
                          };
                          setObUsers(prev => [newUser, ...prev]);
                          setCurrentUser(newUser);
                          
                          // Generate simulated JWT
                          const jwtHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
                          const jwtPayload = btoa(JSON.stringify({ sub: newUser.id, role: newUser.role, phone: newUser.phone }));
                          setRegisteredJwt(`${jwtHeader}.${jwtPayload}.signatureHash`);

                          // Add system log
                          setLogs(prev => [
                            ...prev,
                            {
                              id: `SEC-${Date.now().toString().slice(-4)}`,
                              level: 'INFO',
                              service: 'AuthService',
                              message: `User registration success for phone ${newUser.phone}. Role defaulted to BUYER.`,
                              metadata: { userId: uId },
                              createdAt: new Date().toLocaleTimeString()
                            }
                          ]);

                          setObFlowStep(2);
                        }}
                        className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-xs active:scale-95 transition-all shadow"
                      >
                        Submit Registration & Get Token
                      </button>
                    </div>
                  )}

                  {/* STEP 2 FORM: Become Vendor / Business Info */}
                  {obFlowStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded font-black">
                          STEP 2: BECOME VENDOR (POST /vendors/create)
                        </span>
                        <h4 className="text-sm font-black tracking-tight mt-1">Submit your Business Profile</h4>
                        <p className="text-[10px] opacity-65 leading-normal mt-0.5">
                          Converts the logged-in user profile's role to <strong>VENDOR</strong> and establishes the parent relation details in Prisma database.
                        </p>
                      </div>

                      <div className="p-3 bg-stone-100 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-xl space-y-1.5">
                        <div className="text-[9px] font-extrabold opacity-60 uppercase">Authenticated Session User:</div>
                        <div className="text-xs font-mono text-cyan-500 font-bold flex items-center gap-1">
                          👤 {currentUser?.fullName} ({currentUser?.phone})
                        </div>
                        <div className="text-[8.5px] opacity-55 truncate font-mono">
                          Bearer AccessToken: <span className="text-indigo-400">{registeredJwt}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Business Name</label>
                        <input 
                          type="text"
                          placeholder="e.g. Bole Premium Boutique"
                          value={obFormVendor.businessName}
                          onChange={(e) => setObFormVendor(prev => ({ ...prev, businessName: e.target.value }))}
                          className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Vendor Service Category</label>
                        <select
                          value={obFormVendor.vendorType}
                          onChange={(e) => setObFormVendor(prev => ({ ...prev, vendorType: e.target.value }))}
                          className={`w-full p-2 rounded-xl text-xs font-mono border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-855 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                        >
                          <option value="RETAIL">RETAIL (Marketplace Store)</option>
                          <option value="REAL_ESTATE">REAL_ESTATE (Housing plots/rentals)</option>
                          <option value="EMPLOYMENT_AGENCY">EMPLOYMENT_AGENCY (Job recruitment)</option>
                          <option value="SERVICE_PROVIDER">SERVICE_PROVIDER (On-demand services)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Business Description (Optional)</label>
                        <textarea 
                          placeholder="Briefly detail what catalog items or services you plan to offer..."
                          rows={2}
                          value={obFormVendor.businessDescription}
                          onChange={(e) => setObFormVendor(prev => ({ ...prev, businessDescription: e.target.value }))}
                          className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setObFlowStep(1)}
                          className="px-4 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 text-xs font-bold hover:bg-stone-100 dark:hover:bg-zinc-900 active:scale-95 transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!obFormVendor.businessName) {
                              alert('Please provide your official Business Name.');
                              return;
                            }
                            
                            // Upgrade User role in users state
                            setObUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, role: 'VENDOR' } : u));
                            setCurrentUser(prev => ({ ...prev, role: 'VENDOR' }));

                            const vId = `ven-${Math.floor(Math.random()*9000)+1000}`;
                            const newVen = {
                              id: vId,
                              userId: currentUser.id,
                              businessName: obFormVendor.businessName,
                              businessDescription: obFormVendor.businessDescription,
                              vendorType: obFormVendor.vendorType,
                              verified: false,
                              followers: 0,
                              createdAt: new Date().toISOString().split('T')[0]
                            };

                            setObVendors(prev => [newVen, ...prev]);
                            setCurrentVendor(newVen);

                            // Log backend event
                            setLogs(prev => [
                              ...prev,
                              {
                                id: `SVC-${Date.now().toString().slice(-4)}`,
                                level: 'WARNING',
                                service: 'VendorsService',
                                message: `Created vendor profile "${newVen.businessName}" (ID: ${vId}) for user ${currentUser.id}. Role upgraded to VENDOR.`,
                                metadata: { userId: currentUser.id, vendorId: vId },
                                createdAt: new Date().toLocaleTimeString()
                              }
                            ]);

                            setObFlowStep(3);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-xs active:scale-95 transition-all shadow"
                        >
                          Submit Business profile
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 FORM: Submit KYC */}
                  {obFlowStep === 3 && (
                    <div className="space-y-4 font-sans">
                      <div>
                        <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded font-black">
                          STEP 3: IDENTITY VERIFICATION (SUBMIT KYC)
                        </span>
                        <h4 className="text-sm font-black tracking-tight mt-1">Submit Verification Documents</h4>
                        <p className="text-[10px] opacity-65 leading-normal mt-0.5">
                          Upload national identification references. Links the citizen's biometric identity with the Ethiopia Fayda ID system.
                        </p>
                      </div>

                      <div className="p-3 bg-stone-100 dark:bg-zinc-950 border border-stone-200/50 dark:border-zinc-850 rounded-xl space-y-1">
                        <div className="text-[9px] font-extrabold opacity-60 uppercase">Registering Shop:</div>
                        <div className="text-xs font-mono text-cyan-500 font-bold">
                          🏪 {currentVendor?.businessName} ({currentVendor?.vendorType})
                        </div>
                      </div>

                      {/* Complete Form Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Full Name (Matching ID)</label>
                          <input 
                            type="text"
                            placeholder="e.g. Abebe Bekele"
                            value={obFormKYC.fullName}
                            onChange={(e) => setObFormKYC(prev => ({ ...prev, fullName: e.target.value }))}
                            className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Nationality</label>
                          <input 
                            type="text"
                            placeholder="Ethiopian"
                            value={obFormKYC.nationality}
                            onChange={(e) => setObFormKYC(prev => ({ ...prev, nationality: e.target.value }))}
                            className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Date of Birth</label>
                          <input 
                            type="date"
                            value={obFormKYC.dateOfBirth}
                            onChange={(e) => setObFormKYC(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-855 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">Government Issued ID Type</label>
                          <select
                            value={obFormKYC.idType}
                            onChange={(e) => setObFormKYC(prev => ({ ...prev, idType: e.target.value }))}
                            className={`w-full p-2 rounded-xl text-xs font-mono border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-855 text-zinc-300' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                          >
                            <option value="FAYDA">Ethiopia Fayda National ID (ዲጂታል መታወቂያ)</option>
                            <option value="PASSPORT">Passport (የውጭ አገር ፓስፖርት)</option>
                            <option value="DRIVERS_LICENSE">Driver's License (የመንጃ ፈቃድ)</option>
                            <option value="BUSINESS_LICENSE">Business Trade License (የንግድ ፈቃድ)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-extrabold uppercase block mb-1 opacity-75">ID Reference / Document Number</label>
                        <input 
                          type="text"
                          placeholder="e.g. ET-99210-441-A"
                          value={obFormKYC.idNumber}
                          onChange={(e) => setObFormKYC(prev => ({ ...prev, idNumber: e.target.value }))}
                          className={`w-full p-2 rounded-xl text-xs border outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                        />
                      </div>

                      {/* Mock Interactive Upload Zones with State ticks */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-1 bg-stone-50/50 dark:bg-zinc-950/40">
                          <span className="text-lg">🆔</span>
                          <span className="text-[9px] font-bold">Front Document Scan</span>
                          {obFormKYC.documentFrontUrl ? (
                            <span className="text-[8px] font-mono text-emerald-500 font-extrabold flex items-center gap-0.5">✓ ID_FRONT.jpg</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setObFormKYC(prev => ({ ...prev, documentFrontUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4' }))}
                              className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black uppercase hover:bg-rose-600 active:scale-95 transition-all"
                            >
                              Attach File
                            </button>
                          )}
                        </div>

                        <div className="p-3 border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-1 bg-stone-50/50 dark:bg-zinc-950/40">
                          <span className="text-lg">📄</span>
                          <span className="text-[9px] font-bold">Back Document Scan</span>
                          {obFormKYC.documentBackUrl ? (
                            <span className="text-[8px] font-mono text-emerald-500 font-extrabold flex items-center gap-0.5">✓ ID_BACK.jpg</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setObFormKYC(prev => ({ ...prev, documentBackUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4' }))}
                              className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black uppercase hover:bg-rose-600 active:scale-95 transition-all"
                            >
                              Attach File
                            </button>
                          )}
                        </div>

                        <div className="p-3 border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-1 bg-stone-50/50 dark:bg-zinc-950/40">
                          <span className="text-lg">📸</span>
                          <span className="text-[9px] font-bold">Selfie holding ID Card</span>
                          {obFormKYC.selfieImageUrl ? (
                            <span className="text-[8px] font-mono text-emerald-500 font-extrabold flex items-center gap-0.5">✓ SELFIE_ID.png</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setObFormKYC(prev => ({ ...prev, selfieImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' }))}
                              className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black uppercase hover:bg-rose-600 active:scale-95 transition-all"
                            >
                              Capture / Upload
                            </button>
                          )}
                        </div>

                        <div className="p-3 border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-1 bg-stone-50/50 dark:bg-zinc-950/40">
                          <span className="text-lg">💼</span>
                          <span className="text-[9px] font-bold">Business License (Optional)</span>
                          {obFormKYC.businessLicenseUrl ? (
                            <span className="text-[8px] font-mono text-emerald-500 font-extrabold flex items-center gap-0.5">✓ LICENSE.pdf</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setObFormKYC(prev => ({ ...prev, businessLicenseUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b' }))}
                              className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black uppercase hover:bg-rose-600 active:scale-95 transition-all"
                            >
                              Attach PDF
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setObFlowStep(2)}
                          className="px-4 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 text-xs font-bold hover:bg-stone-100 dark:hover:bg-zinc-900 active:scale-95 transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!obFormKYC.fullName || !obFormKYC.idNumber) {
                              alert('Please fill out your Full Name and Official ID Reference number.');
                              return;
                            }
                            if (!obFormKYC.documentFrontUrl || !obFormKYC.selfieImageUrl) {
                              alert('Please attach Front Document scan and Selfie to proceed.');
                              return;
                            }

                            // Simulation: Fayda Govt Registry Check
                            if (obFormKYC.idNumber.toUpperCase().includes('INVALID')) {
                              alert('Government Fayda ID registry check failed. Please double-check your ID number.');
                              return;
                            }

                            const kId = `kyc-${Math.floor(Math.random()*9000)+1000}`;
                            const newKyc = {
                              id: kId,
                              userId: currentUser.id,
                              fullName: obFormKYC.fullName,
                              dateOfBirth: obFormKYC.dateOfBirth,
                              nationality: obFormKYC.nationality,
                              status: 'UNDER_REVIEW',
                              idType: obFormKYC.idType,
                              idNumber: obFormKYC.idNumber,
                              selfieImageUrl: obFormKYC.selfieImageUrl,
                              documentFrontUrl: obFormKYC.documentFrontUrl,
                              documentBackUrl: obFormKYC.documentBackUrl,
                              businessLicenseUrl: obFormKYC.businessLicenseUrl,
                              createdAt: new Date().toISOString().split('T')[0]
                            };

                            setObKYCs(prev => [newKyc, ...prev]);
                            setCurrentKYC(newKyc);

                            setLogs(prev => [
                              ...prev,
                              {
                                id: `SVC-${Date.now().toString().slice(-4)}`,
                                level: 'INFO',
                                service: 'KycVerificationService',
                                message: `KYC documents submitted for "${newKyc.fullName}" (Ref: ${newKyc.idNumber}). Digital ID validated with Fayda registry.`,
                                metadata: { id: kId, idType: newKyc.idType },
                                createdAt: new Date().toLocaleTimeString()
                              }
                            ]);

                            setObFlowStep(4);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-xs active:scale-95 transition-all shadow"
                        >
                          Submit KYC for Verification
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 FORM: Admin Review & KYC Approvals */}
                  {obFlowStep === 4 && (
                    <div className="space-y-4 font-sans text-left">
                      
                      {/* Admin Header with Metrics Row */}
                      <div>
                        <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded font-black animate-pulse">
                          🛡️ ADMINISTRATOR KYC AUDIT PORTAL
                        </span>
                        <h4 className="text-sm font-black tracking-tight mt-1 text-stone-850 dark:text-zinc-100">Pending Verifications & Security Checks</h4>
                        <p className="text-[10px] opacity-65 leading-normal mt-0.5">
                          Audit the onboarding files, check digital security parameters, and run automatic fraud checks.
                        </p>
                      </div>

                      {/* Admin Metrics Dashboard Row */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-stone-100 dark:bg-zinc-950 p-2 rounded-xl border border-stone-250 dark:border-zinc-850 font-sans">
                        <div className="text-center p-1.5 border-r border-stone-200/50 dark:border-zinc-850">
                          <span className="block text-[8px] opacity-50 uppercase font-bold">Pending</span>
                          <span className="text-xs font-black text-amber-500 font-mono">
                            {obKYCs.filter(k => k.status === 'UNDER_REVIEW' || k.status === 'PENDING').length}
                          </span>
                        </div>
                        <div className="text-center p-1.5 border-r border-stone-200/50 dark:border-zinc-850">
                          <span className="block text-[8px] opacity-50 uppercase font-bold">Approved Today</span>
                          <span className="text-xs font-black text-emerald-500 font-mono">
                            {obKYCs.filter(k => k.status === 'APPROVED').length + 2}
                          </span>
                        </div>
                        <div className="text-center p-1.5 border-r border-stone-200/50 dark:border-zinc-850">
                          <span className="block text-[8px] opacity-50 uppercase font-bold">Rejected Today</span>
                          <span className="text-xs font-black text-rose-500 font-mono">
                            {obKYCs.filter(k => k.status === 'REJECTED').length}
                          </span>
                        </div>
                        <div className="text-center p-1.5 border-r border-stone-200/50 dark:border-zinc-850">
                          <span className="block text-[8px] opacity-50 uppercase font-bold">Avg. Audit Time</span>
                          <span className="text-xs font-black text-cyan-500 font-mono">11.4m</span>
                        </div>
                        <div className="text-center p-1.5 border-r border-stone-200/50 dark:border-zinc-850">
                          <span className="block text-[8px] opacity-50 uppercase font-bold">Flagged Cases</span>
                          <span className="text-xs font-black text-red-500 font-mono">
                            {currentKYC?.idNumber?.toUpperCase().includes('BLACK') || currentKYC?.fullName === 'Abebe Bekele' ? '1' : '0'}
                          </span>
                        </div>
                        <div className="text-center p-1.5 font-sans">
                          <span className="block text-[8px] opacity-50 uppercase font-bold">Duplicate IDs</span>
                          <span className="text-xs font-black text-orange-400 font-mono">
                            {currentKYC?.idNumber === 'ET-88392104-Y' || currentKYC?.fullName === 'Abebe Bekele' ? '1' : '0'}
                          </span>
                        </div>
                      </div>

                      {/* Submitted Filing details card */}
                      <div className="p-3.5 border border-rose-500/35 rounded-xl bg-rose-500/5 space-y-3 font-sans">
                        <div className="flex justify-between items-center pb-2 border-b border-stone-200/50 dark:border-zinc-800">
                          <span className="text-[11px] font-black text-stone-850 dark:text-zinc-100">APPLICANT DOCUMENTS DOSSIER</span>
                          <span className="text-[8px] font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded uppercase font-black">
                            {currentKYC?.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs leading-tight">
                          <div>
                            <span className="text-[8.5px] uppercase opacity-55 block">Full Name (Government Issued)</span>
                            <strong className="text-stone-800 dark:text-zinc-200">{currentKYC?.fullName}</strong>
                          </div>
                          <div>
                            <span className="text-[8.5px] uppercase opacity-55 block">Birth & Nationality</span>
                            <strong className="text-stone-800 dark:text-zinc-200">{currentKYC?.dateOfBirth || '1995-10-14'} ({currentKYC?.nationality || 'Ethiopian'})</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs leading-tight">
                          <div>
                            <span className="text-[8.5px] uppercase opacity-55 block">Proposed Store</span>
                            <strong className="text-cyan-500 font-sans">🏪 {currentVendor?.businessName}</strong>
                          </div>
                          <div>
                            <span className="text-[8.5px] uppercase opacity-55 block">Verification Method</span>
                            <strong className="text-stone-800 dark:text-zinc-200">{currentKYC?.idType} (Ref: <span className="font-mono text-indigo-400">{currentKYC?.idNumber}</span>)</strong>
                          </div>
                        </div>

                        {/* File previews mock view buttons */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1.5">
                          <button
                            type="button"
                            onClick={() => alert(`Opening encrypted ID Scan Front: ${currentKYC?.documentFrontUrl || 'Attached'}`)}
                            className="bg-stone-200/50 dark:bg-zinc-950 p-1.5 rounded-lg border border-stone-300 dark:border-zinc-850 text-[8.5px] hover:border-cyan-500 text-left truncate flex items-center gap-1 font-mono"
                          >
                            🖼️ Front ID
                          </button>
                          <button
                            type="button"
                            onClick={() => alert(`Opening encrypted ID Scan Back: ${currentKYC?.documentBackUrl || 'Attached'}`)}
                            className="bg-stone-200/50 dark:bg-zinc-950 p-1.5 rounded-lg border border-stone-300 dark:border-zinc-850 text-[8.5px] hover:border-cyan-500 text-left truncate flex items-center gap-1 font-mono"
                          >
                            🖼️ Back ID
                          </button>
                          <button
                            type="button"
                            onClick={() => alert(`Opening biometric selfie scan: ${currentKYC?.selfieImageUrl || 'Attached'}`)}
                            className="bg-stone-200/50 dark:bg-zinc-950 p-1.5 rounded-lg border border-stone-300 dark:border-zinc-850 text-[8.5px] hover:border-cyan-500 text-left truncate flex items-center gap-1 font-mono"
                          >
                            📸 Selfie Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => alert(`Opening trade license: ${currentKYC?.businessLicenseUrl || 'None Attached'}`)}
                            className="bg-stone-200/50 dark:bg-zinc-950 p-1.5 rounded-lg border border-stone-300 dark:border-zinc-850 text-[8.5px] hover:border-cyan-500 text-left truncate flex items-center gap-1 font-mono"
                          >
                            💼 Trade License
                          </button>
                        </div>
                      </div>

                      {/* HIGH-ASSURANCE FRAUD AND VERIFICATION PROTOCOLS PANEL */}
                      <div className="p-3 bg-stone-100 dark:bg-zinc-950 rounded-xl border border-stone-250 dark:border-zinc-850 space-y-2 font-sans">
                        <span className="text-[9.5px] font-black text-rose-500 flex items-center gap-1 uppercase">
                          <ShieldCheck size={13} />
                          Automated Anti-Fraud Pipeline Checks
                        </span>
                        
                        <div className="space-y-1.5 text-[10px] font-mono">
                          
                          {/* Duplicate National ID Detection check */}
                          <div className="flex items-start gap-1.5 p-1 bg-white dark:bg-zinc-900 rounded border border-stone-200/50 dark:border-zinc-850/50 text-left">
                            {currentKYC?.idNumber === 'ET-88392104-Y' || currentKYC?.idNumber === 'ET-99210-441-A' ? (
                              <>
                                <span className="text-amber-500 shrink-0">⚠️</span>
                                <div>
                                  <span className="font-bold text-amber-500">Duplicate National ID Detected!</span>
                                  <p className="text-[8px] opacity-65 leading-tight text-stone-500">This National ID reference number is already bound to Vendor Profile: usr-vendor-4431 (Kidus Yared).</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-emerald-500 shrink-0">✓</span>
                                <div>
                                  <span className="font-bold text-emerald-500">Duplicate National ID Check</span>
                                  <p className="text-[8px] opacity-60 leading-tight text-stone-500">No other vendor account is registered with this document reference number.</p>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Duplicate Selfie Detection */}
                          <div className="flex items-start gap-1.5 p-1 bg-white dark:bg-zinc-900 rounded border border-stone-200/50 dark:border-zinc-850/50 text-left">
                            {currentKYC?.fullName === 'Abebe Bekele' ? (
                              <>
                                <span className="text-amber-500 shrink-0">⚠️</span>
                                <div>
                                  <span className="font-bold text-amber-500">Duplicate Selfie Warning (AI Biometric Face Check)</span>
                                  <p className="text-[8px] opacity-65 leading-tight text-stone-500">Biometric pixel match shows 98.7% face structure similarity to user usr-buyer-9021.</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-emerald-500 shrink-0">✓</span>
                                <div>
                                  <span className="font-bold text-emerald-500">Duplicate Selfie Detection (AI-ready)</span>
                                  <p className="text-[8px] opacity-60 leading-tight text-stone-500">Biometric facial similarity index falls within safe non-overlapping thresholds.</p>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Duplicate Business License Check */}
                          <div className="flex items-start gap-1.5 p-1 bg-white dark:bg-zinc-900 rounded border border-stone-200/50 dark:border-zinc-850/50 text-left">
                            <span className="text-emerald-500 shrink-0">✓</span>
                            <div>
                              <span className="font-bold text-emerald-500">Duplicate Business License Scanner</span>
                              <p className="text-[8px] opacity-60 leading-tight text-stone-500">Tax registration ID and licensing reference are unique to this business profile.</p>
                            </div>
                          </div>

                          {/* Blacklist check */}
                          <div className="flex items-start gap-1.5 p-1 bg-white dark:bg-zinc-900 rounded border border-stone-200/50 dark:border-zinc-850/50 text-left">
                            {currentKYC?.idNumber?.toUpperCase().includes('BLACK') ? (
                              <>
                                <span className="text-red-500 shrink-0">⚠️</span>
                                <div>
                                  <span className="font-bold text-red-500">Blacklisted Identity Check</span>
                                  <p className="text-[8px] opacity-65 leading-tight text-stone-500">CRITICAL: ID Reference matches national fraud/default blacklist entries.</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-emerald-500 shrink-0">✓</span>
                                <div>
                                  <span className="font-bold text-emerald-500">Blacklisted Identity Check</span>
                                  <p className="text-[8px] opacity-60 leading-tight text-stone-500">Verification coordinates clean. Citizen is in good standing with credit & trade bureaux.</p>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Multiple account detection */}
                          <div className="flex items-start gap-1.5 p-1 bg-white dark:bg-zinc-900 rounded border border-stone-200/50 dark:border-zinc-850/50 text-left">
                            <span className="text-emerald-500 shrink-0">✓</span>
                            <div>
                              <span className="font-bold text-emerald-500">Multiple Vendor Accounts Check</span>
                              <p className="text-[8px] opacity-60 leading-tight text-stone-500">This user does not operate any other active, pending or blocked trade licenses.</p>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Decision Controls */}
                      <div className="flex gap-2 font-sans">
                        <button
                          type="button"
                          onClick={() => {
                            // Simulate rejection
                            setObKYCs(prev => prev.map(k => k.id === currentKYC.id ? { ...k, status: 'REJECTED' } : k));
                            
                            // Suspends store
                            setObVendors(prev => prev.map(v => v.id === currentVendor.id ? { ...v, verified: false, status: 'SUSPENDED' } : v));

                            setLogs(prev => [
                              ...prev,
                              {
                                id: `ADM-${Date.now().toString().slice(-4)}`,
                                level: 'ERROR',
                                service: 'AdminController',
                                message: `KYC submission for "${currentKYC?.fullName}" was REJECTED. Shop "${currentVendor?.businessName}" suspended.`,
                                metadata: { userId: currentUser.id, vendorId: currentVendor?.id },
                                createdAt: new Date().toLocaleTimeString()
                              }
                            ]);

                            alert('Vendor KYC has been REJECTED. Suspended KYC automatically suspends vendor store. Vendor can resubmit.');
                            setObFlowStep(3); // roll back to Step 3 so they can resubmit
                          }}
                          className="px-4 py-2.5 rounded-xl border border-rose-500 hover:bg-rose-500/5 text-rose-500 text-xs font-black uppercase active:scale-95 transition-all cursor-pointer"
                        >
                          Reject Application
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            // Additional doc request
                            setLogs(prev => [
                              ...prev,
                              {
                                id: `ADM-${Date.now().toString().slice(-4)}`,
                                level: 'WARNING',
                                service: 'AdminController',
                                message: `Additional documents requested for KYC filer: ${currentKYC?.fullName}.`,
                                metadata: { userId: currentUser.id },
                                createdAt: new Date().toLocaleTimeString()
                              }
                            ]);

                            alert('Notification sent: Additional Document Scan requested. Redirecting vendor to upload portal.');
                            setObFlowStep(3); // rolls back to upload
                          }}
                          className="px-3.5 py-2.5 rounded-xl border border-amber-500 text-amber-500 hover:bg-amber-500/5 text-xs font-bold uppercase active:scale-95 transition-all"
                        >
                          Request More Docs
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            // Approve!
                            setObUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, verified: true } : u));
                            setCurrentUser(prev => ({ ...prev, verified: true }));

                            setObVendors(prev => prev.map(v => v.id === currentVendor.id ? { ...v, verified: true, status: 'ACTIVE' } : v));
                            setCurrentVendor(prev => ({ ...prev, verified: true, status: 'ACTIVE' }));

                            setObKYCs(prev => prev.map(k => k.id === currentKYC.id ? { ...k, status: 'APPROVED' } : k));
                            setCurrentKYC(prev => ({ ...prev, status: 'APPROVED' }));

                            setLogs(prev => [
                              ...prev,
                              {
                                id: `ADM-${Date.now().toString().slice(-4)}`,
                                level: 'INFO',
                                service: 'AdminController',
                                message: `Auditor Manual KYC check approved. Shop "${currentVendor?.businessName}" activated on Every-Zone.`,
                                metadata: { userId: currentUser.id, vendorId: currentVendor?.id, status: 'ACTIVE' },
                                createdAt: new Date().toLocaleTimeString()
                              }
                            ]);

                            setObFlowStep(5);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black uppercase text-xs active:scale-95 transition-all shadow"
                        >
                          Approve and Activate Vendor ✓
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Vendor approved success */}
                  {obFlowStep === 5 && (
                    <div className="space-y-4 text-center py-6 font-sans">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-2xl border border-emerald-500/20">
                        ✓
                      </div>

                      <div>
                        <h4 className="text-base font-black tracking-tight text-emerald-500 font-sans">CONGRATULATIONS: VENDOR IS APPROVED!</h4>
                        <p className="text-[11px] opacity-75 max-w-sm mx-auto leading-normal mt-1 text-stone-600 dark:text-zinc-400">
                          The business registration cycle has concluded. The database schemas are updated, and the endpoint <strong>GET /vendors/:id</strong> is ready for traffic.
                        </p>
                      </div>

                      {/* Display beautiful shop metadata card */}
                      <div className={`p-4 rounded-2xl border text-left max-w-sm mx-auto space-y-3 relative overflow-hidden font-sans ${
                        isDarkMode ? 'bg-zinc-950 border-zinc-855' : 'bg-stone-50 border-stone-200'
                      }`}>
                        {/* Decorative background badge */}
                        <div className="absolute right-2 top-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider font-mono">
                          ACTIVE VENDOR
                        </div>

                        <div>
                          <span className="text-[8.5px] font-mono text-cyan-500 font-extrabold uppercase">{currentVendor?.vendorType} COMPANY</span>
                          <h5 className="text-sm font-black text-stone-850 dark:text-zinc-100 font-sans">{currentVendor?.businessName}</h5>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-stone-250/35 dark:border-zinc-850/60 font-mono">
                          <div>
                            <span className="opacity-55 block text-[8px]">Vendor ID</span>
                            <strong>{currentVendor?.id}</strong>
                          </div>
                          <div>
                            <span className="opacity-55 block text-[8px]">Followers</span>
                            <strong>{currentVendor?.followers || 0} followers</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div>
                            <span className="opacity-55 block text-[8px]">Owner profile</span>
                            <strong>{currentUser?.fullName}</strong>
                          </div>
                          <div>
                            <span className="opacity-55 block text-[8px]">Fayda KYC reference</span>
                            <strong className="text-indigo-400">{currentKYC?.idNumber}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Constraint Verification Ticks */}
                      <div className="p-3 bg-stone-100 dark:bg-zinc-950 rounded-xl border border-stone-250 dark:border-zinc-850 text-left max-w-sm mx-auto space-y-1 text-[10px] font-sans">
                        <span className="font-bold text-[8px] uppercase tracking-wider text-stone-400 block mb-1">State Machine Constraints Status</span>
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <span>✓</span>
                          <span>Vendor store eligible to publish catalog listings</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <span>✓</span>
                          <span>Complete security trail created in table KycReviewHistory</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <span>✓</span>
                          <span>Vendor Verification flag = TRUE</span>
                        </div>
                      </div>

                      <div className="pt-3 font-sans">
                        <button
                          type="button"
                          onClick={() => {
                            setObFormUser({ firstName: '', lastName: '', phone: '', email: '', password: '' });
                            setObFormVendor({ businessName: '', businessDescription: '', vendorType: 'RETAIL' });
                            setObFormKYC({ idType: 'FAYDA', idNumber: '', fullName: '', dateOfBirth: '', nationality: 'Ethiopian', selfieImageUrl: '', documentFrontUrl: '', documentBackUrl: '', businessLicenseUrl: '' });
                            setCurrentUser(null);
                            setCurrentVendor(null);
                            setCurrentKYC(null);
                            setObFlowStep(1);
                          }}
                          className="px-6 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-xs font-black uppercase active:scale-95 transition-all font-sans"
                        >
                          Onboard another business
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right side: Database State Explorer (5 columns) */}
                <div className="lg:col-span-5 space-y-5 text-left font-mono text-[9px]">
                  
                  {/* Schema State Tree */}
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-3`}>
                    <h4 className="text-xs font-black uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                      <Database size={13} />
                      Live PostgreSQL Prisma database state
                    </h4>
                    
                    {/* Users list */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8.5px] opacity-50 uppercase font-black">
                        <span>Database Table: User ({obUsers.length})</span>
                        <span className="text-rose-500">@unique constraint</span>
                      </div>
                      <div className="space-y-1.5 max-h-[100px] overflow-y-auto bg-stone-100 dark:bg-zinc-950 p-2 rounded-lg border border-stone-200/50 dark:border-zinc-850">
                        {obUsers.map(u => (
                          <div key={u.id} className="border-b border-stone-200/30 dark:border-zinc-850 last:border-0 pb-1 last:pb-0 flex justify-between items-start">
                            <div>
                              <div className="font-bold flex items-center gap-1">
                                <span className={`w-1 h-1 rounded-full ${u.role === 'VENDOR' ? 'bg-amber-500' : 'bg-cyan-500'}`} />
                                {u.fullName}
                              </div>
                              <div className="opacity-55 text-[8.5px]">phone: {u.phone} | role: <span className="font-bold text-indigo-400">{u.role}</span></div>
                            </div>
                            <span className="text-[7.5px] bg-stone-200 dark:bg-zinc-900 px-1 rounded text-stone-500 shrink-0 font-sans">
                              {u.id.substring(0, 10)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vendors list */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8.5px] opacity-50 uppercase font-black">
                        <span>Database Table: Vendor ({obVendors.length})</span>
                        <span className="text-amber-500">1:1 user relation</span>
                      </div>
                      <div className="space-y-1.5 max-h-[100px] overflow-y-auto bg-stone-100 dark:bg-zinc-950 p-2 rounded-lg border border-stone-200/50 dark:border-zinc-850">
                        {obVendors.map(v => (
                          <div key={v.id} className="border-b border-stone-200/30 dark:border-zinc-850 last:border-0 pb-1 last:pb-0 flex justify-between items-start">
                            <div>
                              <div className="font-bold text-stone-700 dark:text-zinc-300">🏪 {v.businessName}</div>
                              <div className="opacity-55 text-[8.5px]">category: {v.vendorType} | verified: <span className={v.verified ? 'text-emerald-500 font-bold' : 'text-yellow-500 font-bold'}>{v.verified ? 'APPROVED' : 'PENDING'}</span></div>
                            </div>
                            <span className="text-[7.5px] bg-stone-200 dark:bg-zinc-900 px-1 rounded text-stone-500 shrink-0 font-sans">
                              {v.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* KYCs list */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8.5px] opacity-50 uppercase font-black">
                        <span>Database Table: KYC ({obKYCs.length})</span>
                        <span className="text-indigo-400">biometric national link</span>
                      </div>
                      <div className="space-y-1.5 max-h-[100px] overflow-y-auto bg-stone-100 dark:bg-zinc-950 p-2 rounded-lg border border-stone-200/50 dark:border-zinc-850">
                        {obKYCs.length === 0 ? (
                          <div className="opacity-40 italic py-1 text-center">No KYC logs registered.</div>
                        ) : (
                          obKYCs.map(k => (
                            <div key={k.id} className="border-b border-stone-200/30 dark:border-zinc-850 last:border-0 pb-1 last:pb-0 flex justify-between items-start">
                              <div>
                                <div className="font-bold">{k.idType}: {k.idNumber}</div>
                                <div className="opacity-55 text-[8.5px]">status: <span className={`font-bold ${k.status === 'APPROVED' ? 'text-emerald-500' : k.status === 'REJECTED' ? 'text-rose-500' : 'text-yellow-500'}`}>{k.status}</span></div>
                              </div>
                              <span className="text-[7.5px] bg-stone-200 dark:bg-zinc-900 px-1 rounded text-stone-500 shrink-0 font-sans">
                                {k.id}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                  {/* REST API Endpoints log */}
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-2`}>
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                      <TerminalIcon size={13} />
                      NestJS API routes tracker
                    </h4>
                    
                    <div className="space-y-1 bg-black p-2.5 rounded-lg text-zinc-300 font-mono text-[8px] max-h-[140px] overflow-y-auto">
                      <div className="text-zinc-500">Ready REST endpoints routing rules mapped:</div>
                      <div className="flex justify-between text-rose-400 font-bold">
                        <span>POST /auth/register</span>
                        <span className="text-zinc-500">public</span>
                      </div>
                      <div className="flex justify-between text-rose-400 font-bold">
                        <span>POST /auth/login</span>
                        <span className="text-zinc-500">public</span>
                      </div>
                      <div className="flex justify-between text-yellow-400">
                        <span>POST /auth/refresh</span>
                        <span className="text-zinc-500">Bearer Auth</span>
                      </div>
                      <div className="flex justify-between text-yellow-400">
                        <span>POST /auth/logout</span>
                        <span className="text-zinc-500">Bearer Auth</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>GET /auth/profile</span>
                        <span className="text-zinc-500">@UseGuards(JwtAuthGuard)</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>POST /vendors/create</span>
                        <span className="text-zinc-500">@UseGuards(JwtAuthGuard)</span>
                      </div>
                      <div className="flex justify-between text-teal-400">
                        <span>GET /vendors/me</span>
                        <span className="text-zinc-500">@UseGuards(JwtAuthGuard)</span>
                      </div>
                      <div className="flex justify-between text-teal-400">
                        <span>PATCH /vendors/update</span>
                        <span className="text-zinc-500">@UseGuards(JwtAuthGuard)</span>
                      </div>
                      <div className="flex justify-between text-cyan-400">
                        <span>GET /vendors/:id</span>
                        <span className="text-zinc-500">public</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: NESTJS ARCHITECTURE BLUEPRINT BROWSER */}
          {/* ======================================================== */}
          {activeTab === 'blueprint' && (
            <div className="space-y-6">
              
              {/* Architecture Introduction */}
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} grid grid-cols-1 md:grid-cols-12 gap-5 items-center`}>
                <div className="md:col-span-8 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                    <Layers size={14} />
                    NestJS Modular Clean Architecture Directory
                  </h3>
                  <p className="text-[11px] opacity-75 leading-relaxed">
                    Explore the modular directory layout designed for Every-zone backend. Employs clean architecture patterns segregating business domain models from database queries, securing API routes with roles protection, and auditing data inputs in custom pipes.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[9px] font-mono">
                    <span className="bg-stone-200 dark:bg-zinc-950 px-2 py-0.5 rounded text-stone-600 dark:text-zinc-400">⚡ High Performance NestJS</span>
                    <span className="bg-stone-200 dark:bg-zinc-950 px-2 py-1.5 rounded text-stone-600 dark:text-zinc-400">🛡️ Strict TypeScript checks</span>
                    <span className="bg-stone-200 dark:bg-zinc-950 px-2 py-0.5 rounded text-stone-600 dark:text-zinc-400">🗄️ Prisma Database Model layer</span>
                  </div>
                </div>

                <div className="md:col-span-4 p-3 bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-xl space-y-2 text-left font-mono text-[9px]">
                  <div className="font-extrabold text-stone-700 dark:text-zinc-300">USER ROLES ENUM:</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-cyan-500">BUYER</span>
                      <span className="opacity-55">Access to catalog, wallet, chat</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-500">VENDOR</span>
                      <span className="opacity-55">Manage listings, accept dispatch</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-rose-500">ADMIN</span>
                      <span className="opacity-55">Ban frauds, rotate security secrets</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tree Browser Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left column: Tree folder browser (6 cols) */}
                <div className={`lg:col-span-6 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'}`}>
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                    <FolderTree size={14} />
                    Project File Tree (Interactive)
                  </h4>
                  
                  <div className="space-y-1 text-[11px] font-mono text-left bg-stone-100 dark:bg-zinc-950 p-4 rounded-xl border border-stone-250/40 dark:border-zinc-850 max-h-[440px] overflow-y-auto">
                    
                    {/* Root Folder 'src/' */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleFolder('src')}
                        className="flex items-center gap-1 text-cyan-500 hover:underline font-bold"
                      >
                        {expandedFolders['src'] ? '📂' : '📁'} src/
                      </button>

                      {expandedFolders['src'] && (
                        <div className="pl-4 border-l border-stone-300 dark:border-zinc-800 space-y-1.5 mt-1.5">
                          
                          {/* common folder */}
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleFolder('src/common')}
                              className="flex items-center gap-1 text-yellow-500 hover:underline font-bold"
                            >
                              {expandedFolders['src/common'] ? '📂' : '📁'} common/
                            </button>
                            {expandedFolders['src/common'] && (
                              <div className="pl-4 border-l border-stone-300 dark:border-zinc-800 space-y-1 mt-1">
                                <button type="button" onClick={() => setSelectedFolder('src/common/guards')} className="text-stone-600 dark:text-zinc-400 hover:text-white flex items-center gap-1">📄 guards/</button>
                                <button type="button" onClick={() => setSelectedFolder('src/common/interceptors')} className="text-stone-600 dark:text-zinc-400 hover:text-white flex items-center gap-1">📄 interceptors/</button>
                                <button type="button" onClick={() => setSelectedFolder('src/common/pipes')} className="text-stone-600 dark:text-zinc-400 hover:text-white flex items-center gap-1">📄 pipes/</button>
                              </div>
                            )}
                          </div>

                          {/* config folder */}
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleFolder('src/config')}
                              className="flex items-center gap-1 text-yellow-500 hover:underline font-bold"
                            >
                              {expandedFolders['src/config'] ? '📂' : '📁'} config/
                            </button>
                            {expandedFolders['src/config'] && (
                              <div className="pl-4 border-l border-stone-300 dark:border-zinc-800 space-y-1 mt-1">
                                <button type="button" onClick={() => setSelectedFolder('src/config/configuration.ts')} className="text-stone-600 dark:text-zinc-400 hover:text-white flex items-center gap-1">📄 configuration.ts</button>
                                <button type="button" onClick={() => setSelectedFolder('src/config/jwt.config.ts')} className="text-stone-600 dark:text-zinc-400 hover:text-white flex items-center gap-1">📄 jwt.config.ts</button>
                              </div>
                            )}
                          </div>

                          {/* database folder */}
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleFolder('src/database')}
                              className="flex items-center gap-1 text-yellow-500 hover:underline font-bold"
                            >
                              {expandedFolders['src/database'] ? '📂' : '📁'} database/
                            </button>
                            {expandedFolders['src/database'] && (
                              <div className="pl-4 border-l border-stone-300 dark:border-zinc-800 space-y-1 mt-1">
                                <button type="button" onClick={() => setSelectedFolder('src/database/prisma.service.ts')} className="text-stone-600 dark:text-zinc-400 hover:text-white flex items-center gap-1">📄 prisma.service.ts</button>
                              </div>
                            )}
                          </div>

                          {/* modules folder */}
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleFolder('src/modules')}
                              className="flex items-center gap-1 text-yellow-500 hover:underline font-bold"
                            >
                              {expandedFolders['src/modules'] ? '📂' : '📁'} modules/
                            </button>

                            {expandedFolders['src/modules'] && (
                              <div className="pl-4 border-l border-stone-300 dark:border-zinc-800 space-y-1.5 mt-1.5">
                                {[
                                  { id: 'auth', label: '🔑 auth/' },
                                  { id: 'users', label: '👥 users/' },
                                  { id: 'vendors', label: '🏬 vendors/' },
                                  { id: 'kyc', label: '🆔 kyc/' },
                                  { id: 'subscriptions', label: '💳 subscriptions/' },
                                  { id: 'marketplace', label: '🛒 marketplace/' },
                                  { id: 'properties', label: '🏠 properties/' },
                                  { id: 'jobs', label: '💼 jobs/' },
                                  { id: 'wallet', label: '💰 wallet/' },
                                  { id: 'payments', label: '💳 payments/' },
                                  { id: 'search', label: '🔍 search/' },
                                  { id: 'chat', label: '💬 chat/' },
                                  { id: 'notifications', label: '🔔 notifications/' },
                                  { id: 'reports', label: '🚩 reports/' },
                                  { id: 'analytics', label: '📊 analytics/' },
                                  { id: 'admin', label: '🛡️ admin/' },
                                ].map(mod => (
                                  <button
                                    key={mod.id}
                                    type="button"
                                    onClick={() => setSelectedFolder(`src/modules/${mod.id}`)}
                                    className={`w-full text-left hover:text-cyan-400 flex items-center gap-1 ${
                                      selectedFolder === `src/modules/${mod.id}` ? 'text-cyan-400 font-extrabold' : 'text-stone-600 dark:text-zinc-400'
                                    }`}
                                  >
                                    {mod.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* main.ts */}
                          <button
                            type="button"
                            onClick={() => setSelectedFolder('src/main.ts')}
                            className="text-stone-600 dark:text-zinc-400 hover:text-white flex items-center gap-1"
                          >
                            📄 main.ts
                          </button>

                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Right column: Selected file/folder architectural notes (6 cols) */}
                <div className={`lg:col-span-6 p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} flex flex-col justify-between`}>
                  
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-cyan-500 mb-3 flex items-center gap-1.5">
                      <FileCode size={14} />
                      Architecture Inspector: {selectedFolder.replace('src/modules/', '')}
                    </h4>

                    {/* Metadata summary */}
                    <div className="bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 p-4 rounded-xl space-y-3">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-stone-500 dark:text-zinc-400 block">Path Location</span>
                        <span className="text-xs font-mono text-cyan-500">{selectedFolder}</span>
                      </div>

                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-stone-500 dark:text-zinc-400 block">Description & Responsibility</span>
                        <p className="text-[11px] leading-relaxed mt-1 opacity-80">
                          {selectedFolder === 'src/main.ts' 
                            ? 'Bootstrap entry file. Connects Express/Vite server parameters, attaches CORS profiles, maps generic exceptions to JSON outputs, and binds live port 3000 listeners.'
                            : selectedFolder === 'src/common/guards'
                              ? 'Security checkpoint containing JwtAuthGuard and RolesGuard. Inspects Authorization Headers, validates signature rotation parameters, and rejects unauthorized UserRoles.'
                              : selectedFolder === 'src/common/interceptors'
                                ? 'Collects logging payloads. Intercepts outgoing client flows to report API response timings directly to Prometheus scraping indexes.'
                                : selectedFolder === 'src/common/pipes'
                                  ? 'Standard ValidationPipes. Sanitizes input string payloads, strips script coordinates preventing XSS attacks, and formats class validator errors.'
                                  : selectedFolder === 'src/config/configuration.ts'
                                    ? 'Processes .env configurations. Resolves secure environment properties safely without exposing sensitive variables to browser bundles.'
                                    : selectedFolder === 'src/config/jwt.config.ts'
                                      ? 'Establishes authorization details. Locks Access Tokens to 15m expiration, and configures secure HttpOnly cookie storage parameters for the 7d Refresh Token.'
                                      : selectedFolder === 'src/database/prisma.service.ts'
                                        ? 'Postgres database prisma adapter. Oversees database pool sizes, controls concurrent connection pools, and logs SQL duration execution metrics.'
                                        : selectedFolder.startsWith('src/modules/auth')
                                          ? 'Authenticates clients. Exposes login, registration, and refresh-token rotation triggers. Stores revoked token blocks directly in our temporary Redis list.'
                                          : selectedFolder.startsWith('src/modules/users')
                                            ? 'Maintains account profiles. Controls roles configuration (BUYER, VENDOR, ADMIN), KYC verification status metadata, and secure profile adjustments.'
                                            : selectedFolder.startsWith('src/modules/vendors')
                                              ? 'Stores business accounts directory list. Maps official registration references, trade documents, and controls active status coordinates.'
                                              : selectedFolder.startsWith('src/modules/kyc')
                                                ? 'Validates citizen identification indexes. Integrates biometrics with Ethiopia National ID Fayda, scheduling biometric validation queues.'
                                                : selectedFolder.startsWith('src/modules/subscriptions')
                                                  ? 'Subscription engine. Calculates membership durations, recurring billing receipts, and controls premium tier feature grants.'
                                                  : selectedFolder.startsWith('src/modules/marketplace')
                                                    ? 'Catalog database queries. Coordinates item uploads, image references, search tags, and controls buyer-vendor direct transactions.'
                                                    : selectedFolder.startsWith('src/modules/properties')
                                                      ? 'Real estate module. Processes house listings, landlord identities, lease agreements, and controls dual Ethiopian calendar schedules.'
                                                      : selectedFolder.startsWith('src/modules/jobs')
                                                        ? 'Recruitment domain. Manages CV generation, parses candidate credentials, matches company demands, and outputs salary stats.'
                                                        : selectedFolder.startsWith('src/modules/wallet')
                                                          ? 'Secures ledger logs. Implements micro-audits tracking wallet credits, balance locks, and locks Chapa gateway escrow transactions.'
                                                          : selectedFolder.startsWith('src/modules/payments')
                                                            ? 'Chapa direct gateway controller. Dispatches secure payment requests, authenticates webhook hash keys, and validates transaction status.'
                                                            : selectedFolder.startsWith('src/modules/search')
                                                              ? 'Fuzzy text index manager. Optimizes keywords, builds Elasticsearch categories, and returns matching listings.'
                                                              : selectedFolder.startsWith('src/modules/chat')
                                                                ? 'Socket.io messaging router. Manages real-time conversations, encrypts persistent messages, and marks delivery ticks.'
                                                                : selectedFolder.startsWith('src/modules/notifications')
                                                                  ? 'Alert proxy. Dispatches SMS verification codes, live push alerts, and emails statements.'
                                                                  : selectedFolder.startsWith('src/modules/reports')
                                                                    ? 'Stores reporting tickets. Logs catalog flags, maps copyright claims, and notifies moderator channels.'
                                                                    : selectedFolder.startsWith('src/modules/analytics')
                                                                      ? 'Traffic aggregation indices. Counts active sessions, reports transaction velocities, and summarizes dashboard stats.'
                                                                      : selectedFolder.startsWith('src/modules/admin')
                                                                        ? 'Moderator console endpoint. Banish fraud listings, inspect reports, blocks malicious IPs, and enforces global kill switches.'
                                                                        : 'Modular domain folder. Contains dedicated REST Controllers, Data Services, Dependency Injectors, and Schema Entities matching this feature domain.'
                          }
                        </p>
                      </div>

                      {/* NestJS Code Pattern illustration */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-200/50 dark:border-zinc-800">
                        <span className="text-[9px] font-extrabold uppercase text-stone-500 dark:text-zinc-400 block">Class Architecture Pattern</span>
                        <div className="bg-black p-2.5 rounded-lg text-[9px] font-mono text-zinc-300 space-y-1 select-text">
                          {selectedFolder.startsWith('src/modules/auth') ? (
                            <>
                              <div className="text-zinc-500">@Controller('api/auth')</div>
                              <div>export class AuthController {'{'}</div>
                              <div className="pl-4 text-zinc-500">@Post('login')</div>
                              <div className="pl-4">async login(@Body() dto: LoginDto) {'{'}</div>
                              <div className="pl-8 text-cyan-400">return this.authService.sign(dto);</div>
                              <div className="pl-4">{'}'}</div>
                              <div>{'}'}</div>
                            </>
                          ) : selectedFolder.startsWith('src/modules/users') ? (
                            <>
                              <div className="text-zinc-500">@Entity()</div>
                              <div>export class User {'{'}</div>
                              <div className="pl-4 text-zinc-500">@PrimaryGeneratedColumn()</div>
                              <div className="pl-4">id: string;</div>
                              <div className="pl-4 text-zinc-500">@Column({'{'} type: 'enum', enum: UserRole {'}'})</div>
                              <div className="pl-4 text-amber-400">role: UserRole; // BUYER, VENDOR, ADMIN</div>
                              <div>{'}'}</div>
                            </>
                          ) : selectedFolder.startsWith('src/modules/wallet') ? (
                            <>
                              <div className="text-zinc-500">@Injectable()</div>
                              <div>export class WalletService {'{'}</div>
                              <div className="pl-4">async processEscrow(txId: string) {'{'}</div>
                              <div className="pl-8 text-zinc-500">{"// Strict atomic balance operations"}</div>
                              <div className="pl-8 text-cyan-400">await this.prisma.$transaction(async (tx) =&gt; {'{'}</div>
                              <div className="pl-12">{"/* verify and update Ledger tables */"}</div>
                              <div className="pl-8">{'}'});</div>
                              <div className="pl-4">{'}'}</div>
                              <div>{'}'}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-zinc-500">@Module({'{'}</div>
                              <div className="pl-4">imports: [],</div>
                              <div className="pl-4">controllers: [FeatureController],</div>
                              <div className="pl-4">providers: [FeatureService],</div>
                              <div className="text-zinc-500">{'}'})</div>
                              <div>export class FeatureModule {'{}'}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SRE model schema display at footer */}
                  <div className="mt-4 p-3 bg-[#FAF9F5] dark:bg-zinc-950 border border-stone-250 dark:border-zinc-850 rounded-xl space-y-1.5 text-left">
                    <span className="text-[9.5px] font-bold text-rose-500 uppercase flex items-center gap-1">
                      <Database size={12} />
                      Prisma Schema definition: model SystemLog
                    </span>
                    <p className="text-[10px] opacity-65 leading-tight">
                      This system database model is fully synchronized to track security logs and system metrics dynamically:
                    </p>
                    <div className="bg-black p-2.5 rounded-lg font-mono text-[9px] text-indigo-400 select-text">
                      <div>model SystemLog {'{'}</div>
                      <div className="pl-4">id        String   @id @default(uuid())</div>
                      <div className="pl-4">level     String   {"// INFO, WARNING, ERROR, CRITICAL"}</div>
                      <div className="pl-4">service   String   {"// AuthService, PaymentProxy, etc."}</div>
                      <div className="pl-4">message   String</div>
                      <div className="pl-4">metadata  Json?</div>
                      <div className="pl-4">createdAt DateTime @default(now())</div>
                      <div>{'}'}</div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: EVERY-ZONE PRODUCTION INFRASTRUCTURE & OPS */}
          {/* ======================================================== */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-6">
              
              {/* Header Overview KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border text-left ${
                  drStatus === 'HEALTHY' || drStatus === 'RECOVERED' 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : drStatus === 'DISASTER'
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">Cluster Health</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      drStatus === 'HEALTHY' || drStatus === 'RECOVERED' 
                        ? 'bg-emerald-500 animate-pulse' 
                        : drStatus === 'DISASTER' 
                          ? 'bg-rose-500 animate-ping' 
                          : 'bg-amber-500 animate-spin'
                    }`} />
                    <span className="text-sm font-black uppercase tracking-tight font-mono">
                      {drStatus === 'HEALTHY' || drStatus === 'RECOVERED' ? 'SYSTEM HEALTHY' : drStatus}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border text-left ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-250'}`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-50">Active Scale Tier</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Sliders size={14} className="text-cyan-500" />
                    <span className="text-sm font-black uppercase tracking-tight font-mono text-cyan-500">
                      {scalingFactor === '1k' && '1K Users (Basic)'}
                      {scalingFactor === '10k' && '10K Users (Active)'}
                      {scalingFactor === '100k' && '100K Users (Cluster)'}
                      {scalingFactor === '1m' && '1M Users (Enterprise)'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border text-left ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-250'}`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-50">Last Backup Cycle</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-indigo-500" />
                    <span className="text-sm font-black uppercase tracking-tight font-mono text-indigo-500">
                      Today, 03:00 AM (SUCCESS)
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border text-left ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-250'}`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-50">Storage Repositories</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Database size={14} className="text-amber-500" />
                    <span className="text-sm font-black uppercase tracking-tight font-mono text-amber-500">
                      AWS S3 & Cloudinary
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left side: Interactive Topology & Docker Container Orchestrator */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* 1. Interactive Scaling & Topology Diagram */}
                  <div className={`p-5 rounded-2xl border text-left ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-4`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                          <Network size={14} />
                          Dynamic Cluster Topology Simulator
                        </h3>
                        <p className="text-[10.5px] opacity-75 mt-0.5 font-sans">
                          Every-zone scales dynamically from a single node to high-performance load-balanced server groups with sharded databases.
                        </p>
                      </div>

                      {/* Selector Buttons */}
                      <div className="flex bg-stone-100 dark:bg-zinc-950 p-1 rounded-xl border border-stone-200 dark:border-zinc-850 self-start shrink-0">
                        {(['1k', '10k', '100k', '1m'] as const).map(factor => (
                          <button
                            key={factor}
                            onClick={() => {
                              setScalingFactor(factor);
                              setInfraLogs(prev => [`[${new Date().toLocaleTimeString()}] SCALING: System configuration dynamically scaled to ${factor === '1k' ? '1,000' : factor === '10k' ? '10,000' : factor === '100k' ? '100,000' : '1,000,000'} users state.`, ...prev]);
                            }}
                            className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                              scalingFactor === factor 
                                ? 'bg-cyan-500 text-white shadow-xs' 
                                : 'text-stone-500 dark:text-zinc-400 hover:text-cyan-500'
                            }`}
                          >
                            {factor}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Network Diagram Box */}
                    <div className="p-4 rounded-xl border bg-stone-50 dark:bg-zinc-950 border-stone-200/60 dark:border-zinc-850 flex flex-col items-center justify-center font-mono relative overflow-hidden min-h-[200px]">
                      
                      {/* Connection lines using SVGs */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                        <defs>
                          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                        {/* Interactive flow path vectors */}
                        <line x1="15%" y1="50%" x2="35%" y2="50%" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
                        
                        {scalingFactor !== '1k' ? (
                          <>
                            <path d="M 35% 50% Q 42% 35% 50% 30%" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
                            <path d="M 35% 50% Q 42% 65% 50% 70%" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
                            <line x1="50%" y1="30%" x2="68%" y2="35%" stroke="#3b82f6" strokeWidth="1.2" />
                            <line x1="50%" y1="70%" x2="68%" y2="65%" stroke="#3b82f6" strokeWidth="1.2" />
                          </>
                        ) : (
                          <line x1="35%" y1="50%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="1.5" />
                        )}

                        <line x1="68%" y1="50%" x2="85%" y2="50%" stroke="#10b981" strokeWidth="1.5" />
                      </svg>

                      <div className="flex flex-wrap items-center justify-between w-full max-w-2xl gap-2 z-10 text-[9px] uppercase font-black">
                        
                        {/* Node 1: Internet / CDN */}
                        <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center w-[90px] transition-all duration-300 ${
                          scalingFactor === '1m'
                            ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-orange-500/10'
                            : 'bg-stone-100 dark:bg-zinc-900 border-stone-300 dark:border-zinc-800 text-stone-600 dark:text-zinc-400'
                        }`}>
                          <Globe size={14} className="mb-1" />
                          <span>Internet</span>
                          <span className="text-[7.5px] opacity-75 font-normal mt-0.5">
                            {scalingFactor === '1m' ? 'Cloudflare CDN' : 'Direct DNS'}
                          </span>
                        </div>

                        {/* Node 2: Load Balancer (Nginx) */}
                        <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center w-[110px] transition-all duration-300 ${
                          scalingFactor === '1k'
                            ? 'opacity-40 bg-stone-100 dark:bg-zinc-900 border-stone-300 dark:border-zinc-800'
                            : 'bg-cyan-500/10 border-cyan-500 text-cyan-500 shadow-cyan-500/10'
                        }`}>
                          <Server size={14} className="mb-1" />
                          <span>Nginx Proxy</span>
                          <span className="text-[7.5px] opacity-75 font-normal mt-0.5">
                            {scalingFactor === '1k' ? 'Bypassed' : 'Load Balancer'}
                          </span>
                        </div>

                        {/* Node 3: NestJS Applications */}
                        <div className="flex flex-col gap-2">
                          <div className={`p-2.5 rounded-lg border text-center w-[120px] bg-indigo-500/10 border-indigo-500 text-indigo-500 transition-all ${
                            drStatus === 'DISASTER' ? 'border-rose-500 text-rose-500 bg-rose-500/10 animate-pulse' : ''
                          }`}>
                            <div className="font-extrabold flex items-center justify-center gap-1">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                              NestJS Node 1
                            </div>
                            <span className="text-[7.5px] opacity-75 block font-normal mt-0.5">CPU: {containers.find(x => x.id === 'nestjs-api-1')?.cpu}%</span>
                          </div>

                          {scalingFactor !== '1k' && (
                            <div className={`p-2.5 rounded-lg border text-center w-[120px] bg-indigo-500/10 border-indigo-500 text-indigo-500 transition-all ${
                              drStatus === 'DISASTER' ? 'border-rose-500 text-rose-500 bg-rose-500/10 animate-pulse' : ''
                            }`}>
                              <div className="font-extrabold flex items-center justify-center gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                NestJS Node 2
                              </div>
                              <span className="text-[7.5px] opacity-75 block font-normal mt-0.5">CPU: {containers.find(x => x.id === 'nestjs-api-2')?.cpu}%</span>
                            </div>
                          )}
                        </div>

                        {/* Node 4: Cache & Queues (Redis / BullMQ) */}
                        <div className="flex flex-col gap-2">
                          {scalingFactor !== '1k' ? (
                            <div className="p-2 rounded-lg border text-center w-[110px] bg-pink-500/10 border-pink-500 text-pink-500">
                              <span className="font-bold">Redis Cluster</span>
                              <span className="text-[7px] block opacity-75 font-normal">Active Caching</span>
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg border text-center w-[110px] border-stone-300 dark:border-zinc-800 opacity-30 text-stone-500">
                              <span className="font-bold">Redis</span>
                              <span className="text-[7px] block font-normal">Disabled</span>
                            </div>
                          )}

                          {scalingFactor === '100k' || scalingFactor === '1m' ? (
                            <div className="p-2 rounded-lg border text-center w-[110px] bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-500 animate-pulse">
                              <span className="font-bold">BullMQ Workers</span>
                              <span className="text-[7px] block opacity-75 font-normal">Background Jobs</span>
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg border text-center w-[110px] border-stone-300 dark:border-zinc-800 opacity-30 text-stone-500">
                              <span className="font-bold">BullMQ Queue</span>
                              <span className="text-[7px] block font-normal">Disabled</span>
                            </div>
                          )}
                        </div>

                        {/* Node 5: Databases */}
                        <div className="flex flex-col gap-2">
                          <div className={`p-2.5 rounded-lg border text-center w-[120px] transition-all duration-300 ${
                            drStatus === 'HEALTHY' || drStatus === 'RECOVERED'
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                              : drStatus === 'DISASTER'
                                ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-bounce font-black'
                                : 'bg-amber-500/10 border-amber-500 text-amber-500 animate-pulse'
                          }`}>
                            <div className="font-extrabold flex items-center justify-center gap-1">
                              <Database size={11} />
                              Postgres Primary
                            </div>
                            <span className="text-[7.5px] block font-normal mt-0.5">
                              {drStatus === 'DISASTER' ? 'FATAL OUTAGE' : drStatus === 'RESTORING' ? 'RESTORING...' : 'WRITE / READ'}
                            </span>
                          </div>

                          {scalingFactor !== '1k' ? (
                            <div className={`p-2.5 rounded-lg border text-center w-[120px] transition-all duration-300 ${
                              drStatus === 'DISASTER' 
                                ? 'bg-amber-500/10 border-amber-500 text-amber-500 animate-pulse'
                                : drStatus === 'RESTORING' || drStatus === 'FAILOVER'
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 font-extrabold animate-bounce'
                                  : 'bg-emerald-500/10 border-emerald-500 text-emerald-500 opacity-80'
                            }`}>
                              <div className="font-extrabold flex items-center justify-center gap-1">
                                <Database size={11} />
                                Read Replica
                              </div>
                              <span className="text-[7.5px] block font-normal mt-0.5">
                                {drStatus === 'DISASTER' ? 'STANDBY READY' : drStatus === 'RESTORING' || drStatus === 'FAILOVER' ? 'PROMOTING TO PRIMARY...' : 'READ ONLY'}
                              </span>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg border text-center w-[120px] border-stone-300 dark:border-zinc-800 opacity-30 text-stone-500">
                              <span>No Read Replica</span>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* 2. Docker Container Orchestrator Terminal */}
                  <div className={`p-5 rounded-2xl border text-left ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-4`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                          <Layers size={14} />
                          Docker Containers Orchestrator Terminal
                        </h3>
                        <p className="text-[10.5px] opacity-75 mt-0.5">
                          Configure docker runtime parameters, toggle container threads, restart microservices, and inspect active logs.
                        </p>
                      </div>
                      <span className="text-[8px] font-mono bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                        10 DEPLOYED SERVICES
                      </span>
                    </div>

                    {/* Container Cards List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {containers.map(container => (
                        <div
                          key={container.id}
                          onClick={() => setSelectedContainerId(container.id)}
                          className={`p-3 rounded-xl border text-left font-sans cursor-pointer transition-all ${
                            selectedContainerId === container.id 
                              ? 'bg-stone-100 dark:bg-zinc-950 border-rose-500 ring-1 ring-rose-500/30' 
                              : (isDarkMode ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-850' : 'bg-stone-50 border-stone-200 hover:bg-stone-100')
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-[8px] font-mono opacity-55 block uppercase font-bold">{container.service}</span>
                              <h4 className="text-xs font-black text-stone-800 dark:text-zinc-200 flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${
                                  container.status === 'RUNNING' 
                                    ? 'bg-emerald-500 animate-pulse' 
                                    : container.status === 'RESTARTING' 
                                      ? 'bg-amber-500 animate-spin' 
                                      : container.status === 'UNSTABLE' 
                                        ? 'bg-orange-500 animate-pulse' 
                                        : 'bg-rose-500'
                                }`} />
                                {container.name}
                              </h4>
                            </div>
                            <span className="text-[8.5px] font-mono bg-stone-200 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-stone-500 shrink-0">
                              Port {container.port}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-3 text-[9.5px] font-mono border-t border-stone-250/40 dark:border-zinc-850/60 pt-2 opacity-85">
                            <div>
                              <span>CPU: </span>
                              <span className="font-extrabold text-cyan-500">{container.cpu}%</span>
                            </div>
                            <div>
                              <span>RAM: </span>
                              <span className="font-extrabold text-indigo-500">{container.memory} MB</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 font-sans" onClick={e => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => restartContainer(container.id)}
                                className="px-1.5 py-0.5 bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-750 rounded text-[8px] uppercase font-bold"
                              >
                                Restart
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleContainerStatus(container.id)}
                                className="px-1.5 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded text-[8px] uppercase font-bold"
                              >
                                {container.status === 'RUNNING' ? 'Stop' : 'Start'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Live Container Logs */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono opacity-50 uppercase font-bold">
                        <span>Terminal Output: {containers.find(x => x.id === selectedContainerId)?.name}</span>
                        <span className="text-emerald-500 animate-pulse">● scraping Loki logs</span>
                      </div>
                      <div className="bg-black p-3 rounded-xl border border-stone-200/20 font-mono text-[9px] text-zinc-300 min-h-[100px] max-h-[140px] overflow-y-auto text-left space-y-1">
                        <div className="text-zinc-500">{"// Streaming stdout from Docker container logs:"}</div>
                        <div>[LOKI] Fetching stdout buffer for id={selectedContainerId}...</div>
                        <div>[DOCKER] {"{"} node_env: "production", log_level: "info" {"}"}</div>
                        {selectedContainerId === 'postgres-primary' ? (
                          <>
                            <div className="text-emerald-400">[POSTGRES] LOG: database system is ready to accept connections</div>
                            <div className="text-emerald-400">[POSTGRES] LOG: database connection pool sizes initialized to 50</div>
                            {drStatus === 'DISASTER' && <div className="text-rose-500 font-bold">[POSTGRES] FATAL: connection failed. Server down.</div>}
                          </>
                        ) : selectedContainerId.startsWith('nestjs-api') ? (
                          <>
                            <div className="text-cyan-400">[NESTJS] NestApplication started. Mapped Express route list.</div>
                            <div className="text-cyan-400">[NESTJS] Prisma client instantiated successfully.</div>
                            <div className="text-cyan-400">[NESTJS] Connected to Redis cache node on cluster port 6379.</div>
                            {drStatus === 'DISASTER' && <div className="text-rose-500 font-bold">[NESTJS] ERROR: connection timeout to PostgreSQL primary on 5432!</div>}
                          </>
                        ) : selectedContainerId === 'nginx' ? (
                          <>
                            <div className="text-indigo-400">[NGINX] starting load balancer on ports 80 and 443.</div>
                            <div className="text-indigo-400">{"[NGINX] routing upstream \"everyzone_app\" -> nestjs-api-1 (3001), nestjs-api-2 (3002)"}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-zinc-400">[SYSTEM] Deployed microservice container running safely.</div>
                            <div className="text-zinc-400">[SYSTEM] Scraped by Prometheus endpoint at duration 15ms.</div>
                          </>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* 3. Disaster Recovery Sandbox */}
                  <div className={`p-5 rounded-2xl border text-left ${
                    drStatus === 'DISASTER' 
                      ? 'bg-rose-500/5 border-rose-500/30' 
                      : (isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200')
                  } space-y-4`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                          <Flame size={14} className={drStatus === 'DISASTER' ? 'animate-bounce text-rose-500' : ''} />
                          Disaster Recovery & Failover Sandbox
                        </h3>
                        <p className="text-[10.5px] opacity-75 mt-0.5">
                          Test platform resiliency. Simulate a complete primary PostgreSQL database outage, witness automated failovers promoting standby replicas, and restore schemas from encrypted daily dumps.
                        </p>
                      </div>
                      <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                        drStatus === 'HEALTHY' || drStatus === 'RECOVERED' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse'
                      }`}>
                        STATUS: {drStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Outage trigger */}
                      <div className="bg-stone-50 dark:bg-zinc-950 p-4 border border-stone-200/50 dark:border-zinc-850 rounded-xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black uppercase text-rose-500 flex items-center gap-1">
                            <span>🚨</span> Scenario: Primary Server Outage
                          </h4>
                          <p className="text-[10.5px] opacity-75">
                            Crashes PostgreSQL Primary database, causing active API nodes to fail. This simulates severe downtime, alerting SRE, sound alarms, and triggering Sentry exceptions.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={triggerDisaster}
                          disabled={drStatus !== 'HEALTHY' && drStatus !== 'RECOVERED'}
                          className={`w-full py-2.5 rounded-xl text-xs font-black uppercase active:scale-95 transition-all font-sans ${
                            drStatus !== 'HEALTHY' && drStatus !== 'RECOVERED'
                              ? 'bg-stone-300 dark:bg-zinc-800 text-stone-500 cursor-not-allowed opacity-50'
                              : 'bg-rose-500 text-white hover:bg-rose-600 shadow-md'
                          }`}
                        >
                          Trigger Database Disaster
                        </button>
                      </div>

                      {/* Failover action */}
                      <div className="bg-stone-50 dark:bg-zinc-950 p-4 border border-stone-200/50 dark:border-zinc-850 rounded-xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black uppercase text-emerald-500 flex items-center gap-1">
                            <span>🛠️</span> Pipeline: Promote Standby & Recover
                          </h4>
                          <p className="text-[10.5px] opacity-75">
                            Engages the recovery policy: promotes standby Read Replica to R/W Primary, restores missing checkpoints from 03:00 AM S3 dump, configures upstreams, and runs automated health checks.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={runDisasterRecovery}
                          disabled={drStatus !== 'DISASTER'}
                          className={`w-full py-2.5 rounded-xl text-xs font-black uppercase active:scale-95 transition-all font-sans ${
                            drStatus !== 'DISASTER'
                              ? 'bg-stone-300 dark:bg-zinc-800 text-stone-500 cursor-not-allowed opacity-50'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md'
                          }`}
                        >
                          Engage Failover & Restore Database
                        </button>
                      </div>
                    </div>

                    {/* Recovery Logs */}
                    {drStatus !== 'HEALTHY' && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[9.5px] font-mono opacity-50 uppercase font-black">Disaster Recovery Protocol Stream</span>
                        <div className="bg-black p-3 rounded-lg font-mono text-[9px] text-zinc-300 text-left h-[100px] overflow-y-auto space-y-1">
                          {drStatus === 'DISASTER' && (
                            <div className="text-rose-500 font-bold animate-pulse">
                              🚨 CRITICAL OUTAGE: database port 5432 closed! Primary database went offline.
                            </div>
                          )}
                          {drStatus === 'FAILOVER' && (
                            <div className="text-yellow-400">
                              ⏳ INITIATING FAILOVER: SRE Failover Engine engaged. Auditing standby health...
                            </div>
                          )}
                          {drStatus === 'RESTORING' && (
                            <>
                              <div className="text-cyan-400">⏳ RECOVERY STEP 1: Promoting standby read replica postgres-replica to primary...</div>
                              <div className="text-cyan-400">⏳ RECOVERY STEP 2: Connecting to S3 backups, pulling "backup-snap-latest.sql.enc"...</div>
                              <div className="text-cyan-400">⏳ RECOVERY STEP 2: Decrypting AES-256 backup payload...</div>
                            </>
                          )}
                          {drStatus === 'RECOVERED' && (
                            <div className="text-emerald-400 font-bold">
                              🎉 RECOVERY COMPLETE: Database upstreams successfully restored to promoted master. Active Node metrics are green.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                </div>

                {/* Right side: Backups, Webhooks, Storage Drawer */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* 4. AES-256 Daily Automated Backup Scheduler */}
                  <div className={`p-4 rounded-2xl border text-left ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-3`}>
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                      <Download size={13} />
                      Encrypted Cloud Backup Scheduler
                    </h4>
                    
                    <div className="space-y-2 text-[10.5px]">
                      <p className="opacity-75">
                        Database pg_dump is fully automated to run daily at **03:00 AM EAT**. Snapshots are compressed, AES-256 encrypted, and transferred to cloud containers.
                      </p>
                      
                      <div className="space-y-1 bg-stone-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-stone-200/50 dark:border-zinc-850">
                        <div className="flex justify-between items-center text-[9px] font-mono">
                          <span>CRON TIMER:</span>
                          <span className="text-indigo-400 font-bold">0 3 * * *</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-mono pt-1">
                          <span>RETENTION LOCK:</span>
                          <span className="text-indigo-400 font-bold">30 Days (Strict)</span>
                        </div>
                      </div>

                      {/* Backup Bucket Selector */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold uppercase opacity-55">Cloud Bucket Destination</label>
                        <select
                          value={backupStorage}
                          onChange={e => setBackupStorage(e.target.value as any)}
                          className="w-full bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-lg p-1.5 text-xs font-mono"
                        >
                          <option value="S3">AWS S3 (everyzone-backups)</option>
                          <option value="CLOUDINARY">Cloudinary Backup Bucket</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={runManualBackup}
                        disabled={backupStatus === 'BACKING_UP'}
                        className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 font-sans ${
                          backupStatus === 'BACKING_UP'
                            ? 'bg-stone-200 dark:bg-zinc-800 text-stone-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                        }`}
                      >
                        {backupStatus === 'BACKING_UP' ? 'Running pg_dump snapshot...' : 'Trigger Manual Backup Snapshot'}
                      </button>
                    </div>

                    {/* Backup Log panel */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[8.5px] font-mono opacity-50 uppercase font-black">Backup Console Stream</span>
                      <div className="bg-black p-2.5 rounded-lg font-mono text-[8px] text-zinc-300 max-h-[110px] overflow-y-auto text-left space-y-1">
                        {backupLogs.map((bLog, bIdx) => (
                          <div key={bIdx} className={bLog.includes('SUCCESS') ? 'text-emerald-400' : 'text-zinc-400'}>
                            {bLog}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 5. Cryptographic Webhook Security Gateway */}
                  <div className={`p-4 rounded-2xl border text-left ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-3`}>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                      <ShieldCheck size={13} />
                      Cryptographic Webhook Gateway
                    </h4>
                    
                    <div className="space-y-2 text-[10.5px]">
                      <p className="opacity-75">
                        Simulate secure webhooks sent from Chapa, Telebirr, or commercial bank APIs. Verifies cryptographic hashes to secure ledger logs and prevent duplicate transaction attempts.
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8.5px] font-extrabold uppercase opacity-55">Gateway</label>
                          <select
                            value={selectedWebhookSource}
                            onChange={e => setSelectedWebhookSource(e.target.value as any)}
                            className="w-full bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-lg p-1.5 text-xs font-mono"
                          >
                            <option value="Chapa">Chapa API</option>
                            <option value="Telebirr">Telebirr API</option>
                            <option value="CBE">CBE Commercial</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8.5px] font-extrabold uppercase opacity-55">Amount (ETB)</label>
                          <input
                            type="text"
                            value={webhookTestAmount}
                            onChange={e => setWebhookTestAmount(e.target.value)}
                            className="w-full bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-lg p-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="bg-stone-50 dark:bg-zinc-950 p-2 border border-stone-200/50 dark:border-zinc-850 rounded-xl font-mono text-[8.5px] text-zinc-500 space-y-1">
                        <div className="font-bold text-stone-700 dark:text-zinc-300 text-[9px] uppercase">Payload Security Check:</div>
                        <div>Header signature hash: SHA-256</div>
                        <div>Anti-replay nonce: <span className="text-emerald-500">active</span></div>
                      </div>

                      <button
                        type="button"
                        onClick={verifyWebhook}
                        disabled={webhookVerifying}
                        className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 font-sans ${
                          webhookVerifying
                            ? 'bg-stone-200 dark:bg-zinc-800 text-stone-400 cursor-not-allowed animate-pulse'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                        }`}
                      >
                        {webhookVerifying ? 'Verifying Signature Hash...' : 'Dispatch Secured Webhook'}
                      </button>
                    </div>

                    {/* Webhook logs */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[8.5px] font-mono opacity-50 uppercase font-black">Webhook Transaction Audit</span>
                      <div className="space-y-1.5 max-h-[110px] overflow-y-auto font-mono text-[8px] bg-stone-50 dark:bg-zinc-950 p-2 rounded-lg border border-stone-200/30 dark:border-zinc-850">
                        {webhookLogs.map(wh => (
                          <div key={wh.id} className="border-b border-stone-200/30 dark:border-zinc-850/60 pb-1.5 last:pb-0 last:border-0 flex justify-between items-start text-left">
                            <div>
                              <div className="font-bold text-stone-800 dark:text-zinc-200">
                                🔌 {wh.gateway} | {wh.amount}
                              </div>
                              <div className="opacity-55 text-[7px]">Tx ID: {wh.txId} | event: charge.completed</div>
                            </div>
                            <span className={`px-1 rounded text-[7.5px] font-bold shrink-0 ${
                              wh.status === 'VERIFIED' 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : 'bg-amber-500/10 text-amber-500 animate-pulse'
                            }`}>
                              {wh.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 6. Secure Cloud Storage Bucket Explorer */}
                  <div className={`p-4 rounded-2xl border text-left ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} space-y-3`}>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <LockKeyhole size={13} />
                      S3 / Cloudinary Bucket Explorer
                    </h4>
                    
                    <div className="space-y-2 text-[10.5px]">
                      <p className="opacity-75">
                        Browse secure private files uploaded by users. Items in `passport` and `cv` are protected and require GCP Signed Access URLs.
                      </p>

                      {/* Folder tabs */}
                      <div className="flex flex-wrap gap-1 bg-stone-100 dark:bg-zinc-950 p-1 rounded-xl border border-stone-200/50 dark:border-zinc-850 font-mono text-[8.5px] font-bold">
                        {[
                          { id: 'products', label: 'Products' },
                          { id: 'house_images', label: 'Houses' },
                          { id: 'passport', label: 'Passports' },
                          { id: 'cv', label: 'CVs' },
                        ].map(fld => (
                          <button
                            key={fld.id}
                            type="button"
                            onClick={() => setSelectedStorageFolder(fld.id)}
                            className={`px-2 py-1 rounded text-[7.5px] uppercase transition-all ${
                              selectedStorageFolder === fld.id 
                                ? 'bg-amber-500 text-white' 
                                : 'text-stone-500 dark:text-zinc-400 hover:text-amber-500'
                            }`}
                          >
                            {fld.label}
                          </button>
                        ))}
                      </div>

                      {/* Upload mock file form */}
                      <form onSubmit={handleMockUpload} className="flex gap-1.5 items-center">
                        <input
                          type="text"
                          required
                          placeholder="E.g., house_lease_pdf.pdf"
                          value={newUploadedFileName}
                          onChange={e => setNewUploadedFileName(e.target.value)}
                          className="flex-1 bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-lg px-2 py-1 text-xs font-mono text-left"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase shrink-0 font-sans"
                        >
                          Upload
                        </button>
                      </form>

                      {/* File item list */}
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto font-mono text-[8.5px] bg-stone-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-stone-200/40 dark:border-zinc-850">
                        {storageFiles.filter(f => f.folder === selectedStorageFolder).length === 0 ? (
                          <div className="opacity-40 italic text-center py-2">No files in this bucket folder.</div>
                        ) : (
                          storageFiles.filter(f => f.folder === selectedStorageFolder).map((f, fIdx) => (
                            <div key={fIdx} className="border-b border-stone-200/30 dark:border-zinc-850/60 pb-1.5 last:pb-0 last:border-0 flex justify-between items-center">
                              <div>
                                <div className="font-bold text-stone-800 dark:text-zinc-200 truncate max-w-[140px]">📄 {f.name}</div>
                                <div className="opacity-55 text-[7px]">{f.size} | repo: {f.bucket}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setPrivateFileName(`${selectedStorageFolder}/${f.name}`);
                                  setActiveTab('security');
                                  alert(`Routing to Security tab to generate signed URL for bucket asset: ${selectedStorageFolder}/${f.name}`);
                                }}
                                className="px-1.5 py-0.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 rounded text-[7.5px] uppercase font-extrabold"
                              >
                                Sign URL
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
