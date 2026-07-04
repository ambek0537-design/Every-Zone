import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  GitBranch, 
  Cpu, 
  Layers, 
  Server, 
  Database, 
  ShieldAlert,
  Terminal as TerminalIcon, 
  ArrowRight, 
  RefreshCw, 
  Tag, 
  Check, 
  Shield, 
  Globe, 
  Box, 
  Activity, 
  Workflow, 
  FileText,
  ChevronRight,
  Settings
} from 'lucide-react';

interface DevOpsConsoleHubProps {
  isDarkMode: boolean;
  lang: 'en' | 'am';
}

type PipelineStep = 
  | 'idle'
  | 'checkout'
  | 'dependencies'
  | 'lint'
  | 'tsc'
  | 'test'
  | 'prisma'
  | 'build_nestjs'
  | 'docker_build'
  | 'docker_push'
  | 'deploy_server'
  | 'run_migration'
  | 'restart_services'
  | 'health_check'
  | 'live'
  | 'failed'
  | 'rollback_image'
  | 'rollback_release'
  | 'rollback_db'
  | 'rolled_back';

interface LogLine {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'cmd';
  timestamp: string;
}

export default function DevOpsConsoleHub({ isDarkMode, lang }: DevOpsConsoleHubProps) {
  // Branch state
  const [selectedBranch, setSelectedBranch] = useState<string>('develop');
  const [customBranchName, setCustomBranchName] = useState<string>('');
  
  // Environment state
  const [selectedEnv, setSelectedEnv] = useState<'development' | 'staging' | 'production'>('staging');
  
  // Registry state
  const [selectedRegistry, setSelectedRegistry] = useState<'ghcr' | 'dockerhub' | 'ecr'>('ghcr');
  
  // Simulator states
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [failureStage, setFailureStage] = useState<'lint' | 'test' | 'migration' | 'health_check'>('test');
  
  // Checklist states (Best Practices)
  const [bestPractices, setBestPractices] = useState({
    protectedBranches: true,
    requiredReviews: true,
    secretsManagement: true,
    deploymentApproval: false,
    environmentIsolation: true,
    automatedTesting: true,
    automatedBuild: true,
    dockerDeployments: true,
    rollbacks: true,
    versioning: true,
    releaseManagement: true,
  });

  // Release Tags
  const [releases, setReleases] = useState<string[]>(['v1.0.0', 'v1.0.1', 'v1.1.0', 'v2.0.0']);
  const [newTag, setNewTag] = useState<string>('');

  // Active step in execution
  const [currentStep, setCurrentStep] = useState<PipelineStep>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Terminal autoscroll
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Initial greeting logs
  useEffect(() => {
    addLog('System initialized. Every-zone Orchestrator Agent v2.4.1 online.', 'info');
    addLog('Ready to poll and execute deployment pipelines.', 'success');
  }, []);

  const addLog = (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'cmd' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { text, type, timestamp }]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs cleared.', 'info');
  };

  // Automated pipeline sequence
  const runPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep('checkout');
    setProgress(5);
    setLogs([]);
    
    addLog(`🚀 STARTING CI/CD PIPELINE TRACE FOR BRANCH: [${customBranchName || selectedBranch}]`, 'cmd');
    addLog(`Targeting Environment: ${selectedEnv.toUpperCase()}`, 'info');
    addLog(`Container Registry Destination: ${selectedRegistry.toUpperCase()}`, 'info');

    // Helper sleep
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // Step 1: Checkout & Setup
      await delay(800);
      addLog('Git checkout: pulling latest commit HEAD...', 'info');
      addLog(`Branch matches target: ${customBranchName || selectedBranch}. Integrity token verified.`, 'success');
      
      // Step 2: Install dependencies
      setCurrentStep('dependencies');
      setProgress(15);
      addLog('Executing: npm ci', 'cmd');
      await delay(1200);
      addLog('added 1420 packages, audited 1421 packages in 1.12s', 'success');
      addLog('✓ Dependencies installed successfully.', 'success');

      // Step 3: Run ESLint
      setCurrentStep('lint');
      setProgress(25);
      addLog('Executing: npm run lint', 'cmd');
      await delay(1000);
      if (simulateFailure && failureStage === 'lint') {
        addLog('✖ [ESLint] Found 4 syntax errors, 12 formatting errors in src/App.tsx', 'error');
        addLog('Error: ESLint execution failed. Pipeline aborted.', 'error');
        throw new Error('Linting failed');
      }
      addLog('✓ ESLint passed. 0 errors, 2 warnings.', 'success');

      // Step 4: TypeScript compile check
      setCurrentStep('tsc');
      setProgress(35);
      addLog('Executing: npx tsc --noEmit', 'cmd');
      await delay(1100);
      addLog('✓ TypeScript structural validation checks successful. No unresolved types.', 'success');

      // Step 5: Unit Tests
      setCurrentStep('test');
      setProgress(45);
      addLog('Executing: npm run test', 'cmd');
      await delay(1400);
      if (simulateFailure && failureStage === 'test') {
        addLog('✖ [Unit Tests] Failed test suite: src/wallet/Ledger.test.ts', 'error');
        addLog('  - Expected: ETB 6800.00 | Received: NaN', 'error');
        addLog('Error: Jest test execution failed. Pipeline aborted.', 'error');
        throw new Error('Tests failed');
      }
      addLog('✓ Jest: 42 test suites passed, 321 assertions satisfied.', 'success');

      // Step 6: Prisma Schema Validation
      setCurrentStep('prisma');
      setProgress(55);
      addLog('Executing: npx prisma validate', 'cmd');
      await delay(900);
      addLog('✓ Prisma Schema syntax is syntactically sound. PostgreSQL mappings matching target tables.', 'success');

      // Step 7: Build Application (NestJS Backend + Vite Client)
      setCurrentStep('build_nestjs');
      setProgress(65);
      addLog('Executing: npm run build', 'cmd');
      await delay(1500);
      addLog('✓ Server-side NestJS compiled. Assets minimized for deployment (dist/ directory is populated).', 'success');

      // Step 8: Build Docker Image
      setCurrentStep('docker_build');
      setProgress(75);
      addLog(`Executing: docker build -t everyzone:${selectedEnv}-latest .`, 'cmd');
      await delay(1400);
      addLog(`✓ Docker multi-stage build completed. Layer caching successfully used. Image size: 148.5MB.`, 'success');

      // Step 9: Push Docker Image to selected registry
      setCurrentStep('docker_push');
      setProgress(80);
      const regUrl = selectedRegistry === 'ghcr' ? 'ghcr.io/everyzone-app' : selectedRegistry === 'dockerhub' ? 'docker.io/everyzone' : 'aws-ecr.everyzone';
      addLog(`Pushing image to registry: ${regUrl}/backend:${selectedEnv}-latest`, 'cmd');
      await delay(1200);
      addLog(`✓ Container image uploaded. Push status: COMPLETE. Checksum sha256:d8123ae73...`, 'success');

      // Step 10: Deploy Server & Set up Ingress
      setCurrentStep('deploy_server');
      setProgress(85);
      addLog(`Deploying to Kubernetes pods / Cloud Run container instance...`, 'info');
      await delay(1200);
      addLog(`✓ Active container instance updated. Load balancer redirect configured.`, 'success');

      // Step 11: Run Prisma Migration on Live/Staging Database
      setCurrentStep('run_migration');
      setProgress(90);
      addLog('Database Migration checklist active: [Backup DB -> Run Migration -> Verify Tables]', 'info');
      addLog('Executing database backup: pg_dump --cluster=prod...', 'cmd');
      await delay(700);
      addLog('✓ Backup completed. File: s3://everyzone-db-backups/bkp_20260626.sql', 'success');
      addLog('Executing: npx prisma migrate deploy', 'cmd');
      await delay(1100);
      if (simulateFailure && failureStage === 'migration') {
        addLog('✖ [Prisma Migrate] SQL Error: Database migration collision! Unique constraint violation on altered table.', 'error');
        addLog('Error: Database migration failed. Post-deploy hook crashed.', 'error');
        throw new Error('Database migration failed');
      }
      addLog('✓ 2 schema migration scripts applied. Database updated successfully.', 'success');
      addLog('Executing table verification: SELECT count(*) FROM "MigrationRegistry"...', 'cmd');
      await delay(500);
      addLog('✓ Database state verified. Tables synced.', 'success');

      // Step 12: Restart Services & Reload Nginx configs
      setCurrentStep('restart_services');
      setProgress(95);
      addLog('Sending reload signal to Nginx master process...', 'info');
      await delay(800);
      addLog('✓ Nginx config reloaded. Downstream services restarted cleanly.', 'success');

      // Step 13: Live Health Check
      setCurrentStep('health_check');
      addLog('Executing HTTP live health ping: /api/health-check...', 'cmd');
      await delay(1200);
      if (simulateFailure && failureStage === 'health_check') {
        addLog('✖ [Health Check] Ping failed. Route /api/health-check returned 502 Bad Gateway.', 'error');
        addLog('Error: Live server check failed. Pipeline unstable.', 'error');
        throw new Error('Health Check failed');
      }
      addLog('✓ HTTP /api/health-check returned 200 OK.', 'success');
      addLog('✓ Telemetry ping response: { "status": "UP", "version": "v2.0.0", "connections": "OK" }', 'success');

      // Final Step: Complete & Live!
      setCurrentStep('live');
      setProgress(100);
      setIsRunning(false);
      addLog('🎉 PIPELINE COMPLETED SUCCESSFULLY! EVERY-ZONE IS LIVE!', 'success');
      addLog(`Production server URL updated with container version tag. Deployment metrics saved.`, 'success');

    } catch (err: any) {
      setCurrentStep('failed');
      addLog('❌ PIPELINE CRASHED. INITIATING AUTO-ROLLBACK STATE MACHINE...', 'error');
      await triggerRollback();
    }
  };

  const triggerRollback = async () => {
    setIsRunning(true);
    addLog('⚠️ EMERGENCY SYSTEM FAULT RECOVERY SYSTEM ENFORCED', 'warning');
    
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Step 1: Restore Previous Docker Image
    setCurrentStep('rollback_image');
    setProgress(33);
    addLog('Pulling previous stable docker image from cached layer registry...', 'info');
    await delay(1500);
    addLog('✓ Stable cached image loaded. Swapping target container descriptors.', 'success');

    // Step 2: Restore Previous Release Target in Nginx config
    setCurrentStep('rollback_release');
    setProgress(66);
    addLog('Reverting Nginx target upstream config to previous secure release...', 'info');
    await delay(1500);
    addLog('✓ Upstream redirected. Reloading Nginx: configuration applied.', 'success');

    // Step 3: Revert Database from Backup S3 Dump
    setCurrentStep('rollback_db');
    setProgress(90);
    addLog('Reverting database state from last micro-backup file...', 'info');
    await delay(1500);
    addLog('✓ Database reverted. Verifying table checksum counts... PASS.', 'success');

    // Complete Rollback
    setCurrentStep('rolled_back');
    setProgress(100);
    setIsRunning(false);
    addLog('✅ ROLLBACK COMPLETE. STABLE ENVIRONMENT RESTORED TO PREVIOUS RELEASE.', 'success');
    addLog('Systems are green but running on the fallback build.', 'warning');
  };

  // Quick action tags
  const addReleaseTag = () => {
    if (!newTag.trim()) return;
    if (releases.includes(newTag.trim())) {
      addLog(`Tag ${newTag} already exists!`, 'warning');
      return;
    }
    setReleases(prev => [...prev, newTag.trim()]);
    addLog(`Tagged new stable release: ${newTag.trim()}`, 'success');
    setNewTag('');
  };

  const togglePractice = (key: keyof typeof bestPractices) => {
    setBestPractices(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    addLog(`DevOps checklist altered: ${(key as string).replace(/([A-Z])/g, ' $1')} toggled.`, 'info');
  };

  // Branch names mapping
  const branchList = [
    { name: 'main', desc: 'Production release branch', env: 'production' as const },
    { name: 'develop', desc: 'Staging Integration branch', env: 'staging' as const },
    { name: 'feature/wallet-escrow', desc: 'Chapa direct checkout integration', env: 'development' as const },
    { name: 'hotfix/leak-remedy', desc: 'High-priority token cleanup', env: 'development' as const }
  ];

  return (
    <div className={`p-4 md:p-6 rounded-3xl border shadow-xl transition-all duration-300 max-w-5xl mx-auto ${
      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-[#FAF9F5] border-stone-200 text-stone-900'
    }`}>
      
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4 border-stone-250/50 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
            <Workflow className="animate-spin-slow" size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight flex items-center gap-2">
              {lang === 'en' ? 'Orchestration & DevOps Console' : 'የሲአይ/ሲዲ ፓይፕላይን እና ዴቭኦፕስ ሰሌዳ'}
              <span className="text-[9px] bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">
                v2.4
              </span>
            </h2>
            <p className="text-xs opacity-65 mt-0.5">
              {lang === 'en' 
                ? 'Simulate and control Every-zone automated deployment cycles, container registries, and rollback environments.' 
                : 'የኤቭሪ-ዞን አውቶማቲክ ስራ ዝርጋታዎች፣ የዶከር ምስሎች፣ የደህንነት ፍተሻዎች እና ድንገተኛ መመለሻዎች መቆጣጠሪያ ሰሌዳ።'}
            </p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button 
            type="button"
            onClick={clearLogs}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850' : 'bg-stone-100 border-stone-250 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {lang === 'en' ? 'Clear Logs' : 'አፅዳ'}
          </button>
          
          <button
            type="button"
            disabled={isRunning}
            onClick={runPipeline}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
              isRunning 
                ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-650 hover:from-emerald-600 hover:to-teal-700 text-white border-b-2 border-emerald-700'
            }`}
          >
            <Play size={12} className={isRunning ? 'animate-pulse' : ''} />
            {isRunning ? (lang === 'en' ? 'Deploying...' : 'በማሰማራት ላይ...') : (lang === 'en' ? 'Trigger Pipeline' : 'ዝርጋታውን ጀምር')}
          </button>
        </div>
      </div>

      {/* CORE GRID: Controls vs Pipeline Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Left column: Pipeline Config & Best Practices (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Branch & Environment Selector */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} shadow-xs`}>
            <h3 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
              <GitBranch size={14} />
              {lang === 'en' ? '1. Branch & Environment' : '፩. ቅርንጫፍ እና አካባቢ'}
            </h3>
            
            <div className="space-y-3">
              {/* Branch Selector */}
              <div>
                <label className="text-[10px] font-bold opacity-60 block mb-1">Git Branch Selection</label>
                <select 
                  value={selectedBranch}
                  onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    const br = branchList.find(b => b.name === e.target.value);
                    if (br) setSelectedEnv(br.env);
                  }}
                  disabled={isRunning}
                  className={`w-full p-2 rounded-xl text-xs border font-mono outline-none ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-stone-50 border-stone-250 text-stone-700'
                  }`}
                >
                  {branchList.map(b => (
                    <option key={b.name} value={b.name}>{b.name} ({b.desc})</option>
                  ))}
                  <option value="custom">Custom Branch...</option>
                </select>
              </div>

              {selectedBranch === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1"
                >
                  <label className="text-[9px] font-bold opacity-50 block">Enter branch name:</label>
                  <input 
                    type="text"
                    value={customBranchName}
                    onChange={(e) => setCustomBranchName(e.target.value)}
                    placeholder="feature/auth-endpoint"
                    disabled={isRunning}
                    className={`w-full p-2 rounded-xl text-xs border font-mono outline-none ${
                      isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-stone-50 border-stone-250 text-stone-700'
                    }`}
                  />
                </motion.div>
              )}

              {/* Target Environment */}
              <div>
                <label className="text-[10px] font-bold opacity-60 block mb-1">Target Environment</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['development', 'staging', 'production'] as const).map(env => (
                    <button
                      key={env}
                      type="button"
                      disabled={isRunning}
                      onClick={() => setSelectedEnv(env)}
                      className={`py-1.5 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedEnv === env 
                          ? 'bg-cyan-500 text-white border-cyan-500 shadow-xs' 
                          : (isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white' : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-900')
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              {/* Container Registry Select */}
              <div>
                <label className="text-[10px] font-bold opacity-60 block mb-1">Docker Image Registry</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'ghcr' as const, label: 'GHCR' },
                    { id: 'dockerhub' as const, label: 'Docker Hub' },
                    { id: 'ecr' as const, label: 'AWS ECR' }
                  ].map(reg => (
                    <button
                      key={reg.id}
                      type="button"
                      disabled={isRunning}
                      onClick={() => setSelectedRegistry(reg.id)}
                      className={`py-1.5 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedRegistry === reg.id 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : (isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white' : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-900')
                      }`}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fault Simulation Configuration */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} shadow-xs`}>
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                <ShieldAlert size={14} />
                {lang === 'en' ? '2. Inject Failure / Test Rollback' : '፪. ችግሮችን ፈትሽና ወደኋላ መልስ'}
              </h3>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={simulateFailure}
                  onChange={() => setSimulateFailure(!simulateFailure)}
                  disabled={isRunning}
                  className="sr-only peer"
                  id="simulate-fault-toggle"
                />
                <div className="w-9 h-5 bg-stone-250 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
              </div>
            </div>

            <p className="text-[10px] opacity-65 mb-3 leading-relaxed">
              Enable to simulate a pipeline failure at a specific task. Great for testing the automated rollback strategy.
            </p>

            {simulateFailure && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 bg-stone-100 dark:bg-zinc-950 p-2.5 rounded-xl border border-stone-250/30 dark:border-zinc-850"
              >
                <label className="text-[9px] font-extrabold uppercase tracking-wider opacity-60 block">Fail at Stage:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'lint' as const, label: 'ESLint Code Syntax' },
                    { id: 'test' as const, label: 'Jest Unit Testing' },
                    { id: 'migration' as const, label: 'DB Migration Conflict' },
                    { id: 'health_check' as const, label: 'Ingress Web Ping 502' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      disabled={isRunning}
                      onClick={() => setFailureStage(f.id)}
                      className={`p-1.5 rounded-lg text-[9px] font-bold text-left border transition-all cursor-pointer ${
                        failureStage === f.id 
                          ? 'bg-amber-500/15 border-amber-500 text-amber-500 font-black' 
                          : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900')
                      }`}
                    >
                      ⚠️ {f.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* DevOps Compliance Best Practices Checklist */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} shadow-xs`}>
            <h3 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Shield size={14} />
              {lang === 'en' ? '3. Quality Gate / Settings' : '፫. የጥራት ደረጃና ደህንነት ማጣሪያ'}
            </h3>
            <p className="text-[10px] opacity-65 mb-3 leading-tight">
              Best practices currently implemented. Toggle to view compliance parameters:
            </p>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
              {Object.entries(bestPractices).map(([key, val]) => (
                <button
                  key={key}
                  disabled={isRunning}
                  onClick={() => togglePractice(key as any)}
                  className={`w-full flex items-center justify-between p-1.5 rounded-xl text-left border transition-all text-[9.5px] cursor-pointer ${
                    val 
                      ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800')
                      : (isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:border-zinc-750' : 'bg-stone-50 border-stone-150 text-stone-500 hover:border-stone-200')
                  }`}
                >
                  <span className="font-bold tracking-tight uppercase">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] font-black">{val ? 'ACTIVE' : 'OFF'}</span>
                    {val ? <CheckCircle2 size={11} className="text-emerald-500" /> : <XCircle size={11} className="text-stone-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Interactive Visual Pipeline Graph (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          
          {/* Active Flowchart Diagram Card */}
          <div className={`p-4 rounded-2xl border flex-1 flex flex-col justify-between ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'
          } shadow-xs`}>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                  <Workflow size={14} className="animate-spin-slow" />
                  {lang === 'en' ? 'Live Execution Diagram' : 'ስራ ላይ ያለ የፓይፕላይን ዝርጋታ ካርታ'}
                </h3>
                
                {/* Pipeline General Status badge */}
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                  currentStep === 'idle' ? 'bg-stone-100 dark:bg-zinc-950 text-stone-500 border-stone-200 dark:border-zinc-850'
                  : currentStep === 'live' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : currentStep === 'failed' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                  : currentStep.startsWith('rollback') ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                  : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 animate-pulse'
                }`}>
                  {currentStep === 'idle' ? 'STANDBY' 
                   : currentStep === 'live' ? 'LIVE & ONLINE'
                   : currentStep === 'failed' ? 'CRASHED / FAILED'
                   : currentStep.startsWith('rollback') ? 'ROLLBACK IN PROGRESS'
                   : `EXECUTING: ${currentStep.toUpperCase()}`}
                </span>
              </div>

              {/* Graphical nodes represent: Developer -> GitHub -> GitHub Actions -> Build & Test -> Docker Build -> Container Registry -> Production Server -> Nginx -> Every-zone Live */}
              <div className="relative overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800">
                <div className="flex items-center min-w-[700px] justify-between p-4 bg-stone-50 dark:bg-zinc-950 rounded-2xl border border-stone-150 dark:border-zinc-850 relative">
                  
                  {/* Nodes list */}
                  {[
                    { id: 'dev', label: 'Dev', icon: '💻', stepGroup: ['checkout'] },
                    { id: 'github', label: 'GitHub', icon: '🐙', stepGroup: ['checkout'] },
                    { id: 'actions', label: 'Actions', icon: '⚙️', stepGroup: ['dependencies', 'lint', 'tsc', 'test', 'prisma'] },
                    { id: 'build', label: 'Build', icon: '🏗️', stepGroup: ['build_nestjs', 'docker_build'] },
                    { id: 'registry', label: 'Registry', icon: '📦', stepGroup: ['docker_push'] },
                    { id: 'server', label: 'Cloud Run', icon: '☁️', stepGroup: ['deploy_server', 'run_migration'] },
                    { id: 'nginx', label: 'Nginx Proxy', icon: '🔄', stepGroup: ['restart_services'] },
                    { id: 'live', label: 'Live Server', icon: '⚡', stepGroup: ['health_check', 'live'] }
                  ].map((node, idx) => {
                    // Check if current step matches this node
                    const isNodeActive = isRunning && node.stepGroup.includes(currentStep);
                    const isNodePassed = (() => {
                      if (currentStep === 'live') return true;
                      if (currentStep === 'idle') return false;
                      const order = ['dev', 'github', 'actions', 'build', 'registry', 'server', 'nginx', 'live'];
                      const activeIdx = order.findIndex(o => {
                        const activeNode = ['checkout'].includes(currentStep) ? 'dev' 
                          : ['dependencies', 'lint', 'tsc', 'test', 'prisma'].includes(currentStep) ? 'actions'
                          : ['build_nestjs', 'docker_build'].includes(currentStep) ? 'build'
                          : ['docker_push'].includes(currentStep) ? 'registry'
                          : ['deploy_server', 'run_migration'].includes(currentStep) ? 'server'
                          : ['restart_services'].includes(currentStep) ? 'nginx'
                          : ['health_check', 'live'].includes(currentStep) ? 'live' : 'none';
                        return o === activeNode;
                      });
                      return idx < activeIdx;
                    })();

                    const isNodeFailed = currentStep === 'failed' && node.stepGroup.includes(failureStage);

                    return (
                      <React.Fragment key={node.id}>
                        {/* Node Card */}
                        <div className="flex flex-col items-center relative z-10">
                          <motion.div
                            animate={isNodeActive ? { scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-md border-2 transition-all duration-300 relative ${
                              isNodeFailed 
                                ? 'bg-red-500 border-red-600 text-white shadow-red-500/20'
                                : isNodeActive 
                                  ? 'bg-cyan-500 border-cyan-400 text-white shadow-cyan-500/40 animate-pulse'
                                  : isNodePassed 
                                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/20'
                                    : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-stone-100 border-stone-200 text-stone-400')
                            }`}
                          >
                            <span>{node.icon}</span>
                            {/* Visual glowing aura */}
                            {isNodeActive && (
                              <span className="absolute inset-0 rounded-full border-4 border-cyan-300 animate-ping opacity-60" />
                            )}
                          </motion.div>
                          <span className={`text-[9px] font-black uppercase mt-1.5 tracking-wider ${
                            isNodeFailed ? 'text-rose-500 font-extrabold'
                            : isNodeActive ? 'text-cyan-500 font-extrabold'
                            : isNodePassed ? 'text-emerald-500 font-bold'
                            : 'opacity-50'
                          }`}>
                            {node.label}
                          </span>
                        </div>

                        {/* Connector arrow line */}
                        {idx < 7 && (
                          <div className="flex-1 h-0.5 mx-2 relative min-w-[20px]">
                            <div className={`absolute inset-0 rounded transition-all duration-300 ${
                              isNodePassed 
                                ? 'bg-emerald-500' 
                                : isNodeActive 
                                  ? 'bg-gradient-to-r from-cyan-500 to-zinc-800 animate-pulse' 
                                  : (isDarkMode ? 'bg-zinc-850' : 'bg-stone-200')
                            }`} />
                            {isNodeActive && (
                              <motion.div 
                                animate={{ x: ['0%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-xs"
                              />
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                </div>
              </div>
            </div>

            {/* Task list sub-stages Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-stone-100 dark:border-zinc-850/70">
              
              {/* Build & Compile Phase */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold block mb-2 text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                  <Cpu size={12} />
                  {lang === 'en' ? 'Build & Verification Phase (CI)' : 'የግንባታና የጥራት ደረጃ መፈተሻ (CI)'}
                </span>
                
                <div className="space-y-1.5 bg-stone-50 dark:bg-zinc-950/50 p-2.5 rounded-xl border border-stone-200/50 dark:border-zinc-850/60 text-left">
                  {[
                    { id: 'checkout', label: '1. Git Repository Checkout' },
                    { id: 'dependencies', label: '2. Install Project Dependencies' },
                    { id: 'lint', label: '3. ESLint Style Standards' },
                    { id: 'tsc', label: '4. TypeScript structural compiler check' },
                    { id: 'test', label: '5. Jest API Unit Suite Testing' },
                    { id: 'prisma', label: '6. Prisma schema & model mapping validations' },
                    { id: 'build_nestjs', label: '7. Node.js backend transpilation & bundling' },
                    { id: 'docker_build', label: '8. Compile production multi-stage Docker file' }
                  ].map(item => {
                    const status = (() => {
                      if (currentStep === 'idle') return 'pending';
                      const order = ['checkout', 'dependencies', 'lint', 'tsc', 'test', 'prisma', 'build_nestjs', 'docker_build', 'docker_push', 'deploy_server', 'run_migration', 'restart_services', 'health_check', 'live'];
                      const activeIdx = order.indexOf(currentStep);
                      const itemIdx = order.indexOf(item.id);
                      if (activeIdx === -1) return 'pending';
                      if (currentStep === 'failed' && item.id === failureStage) return 'failed';
                      if (itemIdx < activeIdx) return 'passed';
                      if (itemIdx === activeIdx) return 'active';
                      return 'pending';
                    })();

                    return (
                      <div key={item.id} className="flex items-center justify-between text-[9px] font-mono py-0.5">
                        <span className={`tracking-tight ${
                          status === 'failed' ? 'text-red-500 font-extrabold'
                          : status === 'active' ? 'text-cyan-500 font-extrabold'
                          : status === 'passed' ? 'text-emerald-500 opacity-90'
                          : 'opacity-40'
                        }`}>
                          {item.label}
                        </span>
                        
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1 rounded font-sans shrink-0 ${
                          status === 'failed' ? 'bg-red-500/10 text-red-500'
                          : status === 'active' ? 'bg-cyan-500/10 text-cyan-500 animate-pulse'
                          : status === 'passed' ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-stone-200/50 dark:bg-zinc-850 text-stone-500 opacity-40'
                        }`}>
                          {status === 'failed' ? 'CRASH' 
                           : status === 'active' ? 'RUNNING'
                           : status === 'passed' ? 'PASS' : 'WAIT'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Infrastructure & Rollbacks */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold block mb-2 text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                  <Server size={12} />
                  {lang === 'en' ? 'Infrastructure & Deployment Phase (CD)' : 'የመሠረተ ልማት እና የስርጭት ምዕራፍ (CD)'}
                </span>

                <div className="space-y-1.5 bg-stone-50 dark:bg-zinc-950/50 p-2.5 rounded-xl border border-stone-200/50 dark:border-zinc-850/60 text-left">
                  {[
                    { id: 'docker_push', label: '9. Tag & Push to Container registry' },
                    { id: 'deploy_server', label: '10. Run Pod instance rolling reload' },
                    { id: 'run_migration', label: '11. Deploy Database SQL Migrations' },
                    { id: 'restart_services', label: '12. Restart Microservice & Nginx config' },
                    { id: 'health_check', label: '13. Live HTTP Web Ingress Ping check' }
                  ].map(item => {
                    const status = (() => {
                      if (currentStep === 'idle') return 'pending';
                      const order = ['checkout', 'dependencies', 'lint', 'tsc', 'test', 'prisma', 'build_nestjs', 'docker_build', 'docker_push', 'deploy_server', 'run_migration', 'restart_services', 'health_check', 'live'];
                      const activeIdx = order.indexOf(currentStep);
                      const itemIdx = order.indexOf(item.id);
                      if (activeIdx === -1) return 'pending';
                      if (currentStep === 'failed' && item.id === failureStage) return 'failed';
                      if (itemIdx < activeIdx) return 'passed';
                      if (itemIdx === activeIdx) return 'active';
                      return 'pending';
                    })();

                    return (
                      <div key={item.id} className="flex items-center justify-between text-[9px] font-mono py-0.5">
                        <span className={`tracking-tight ${
                          status === 'failed' ? 'text-red-500 font-extrabold'
                          : status === 'active' ? 'text-cyan-500 font-extrabold'
                          : status === 'passed' ? 'text-emerald-500 opacity-90'
                          : 'opacity-40'
                        }`}>
                          {item.label}
                        </span>
                        
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1 rounded font-sans shrink-0 ${
                          status === 'failed' ? 'bg-red-500/10 text-red-500'
                          : status === 'active' ? 'bg-cyan-500/10 text-cyan-500 animate-pulse'
                          : status === 'passed' ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-stone-200/50 dark:bg-zinc-850 text-stone-500 opacity-40'
                        }`}>
                          {status === 'failed' ? 'CRASH' 
                           : status === 'active' ? 'RUNNING'
                           : status === 'passed' ? 'PASS' : 'WAIT'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Interactive SQL Migrations and Rollback details panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Schema migration details card */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} shadow-xs`}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 text-indigo-500">
                <Database size={14} />
                Prisma SQL Migration Engine
              </h3>
              <p className="text-[10px] opacity-65 mb-3 leading-tight">
                Continuous Database migrations matching local Postgres schema. Safe-apply pipeline steps:
              </p>

              <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-zinc-950 rounded-xl border border-stone-200/50 dark:border-zinc-850/60 text-left">
                <div className="space-y-1 text-[9.5px] font-mono text-stone-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1 text-emerald-500">
                    <span>✓</span> <span>1. Database Backup (pg_dump)</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <span>✓</span> <span>2. Execute SQL scripts</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <span>✓</span> <span>3. Integrity Table Validation</span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[7.5px] uppercase font-black tracking-widest text-emerald-500 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                    SYNCED
                  </span>
                  <span className="text-[8px] font-mono mt-1 opacity-50">Active DB Schema v2</span>
                </div>
              </div>
            </div>

            {/* Emergency Rollback procedures card */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} shadow-xs`}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 text-rose-500">
                <RotateCcw size={14} />
                Automatic Rollback Procedures
              </h3>
              <p className="text-[10px] opacity-65 mb-3 leading-tight">
                Triggered on ingress failures, memory overflows, or DB conflicts to restore target environments instantly:
              </p>

              <div className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-zinc-950 rounded-xl border border-stone-200/50 dark:border-zinc-850/60 text-left">
                <div className="space-y-1 text-[9.5px] font-mono text-stone-500 dark:text-zinc-400">
                  <div className={`flex items-center gap-1.5 ${currentStep === 'rollback_image' ? 'text-amber-500 animate-pulse font-bold' : ''}`}>
                    <span>📦</span> <span>1. Revert Container Image</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${currentStep === 'rollback_release' ? 'text-amber-500 animate-pulse font-bold' : ''}`}>
                    <span>🔌</span> <span>2. Revert Release Upstream</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${currentStep === 'rollback_db' ? 'text-amber-500 animate-pulse font-bold' : ''}`}>
                    <span>💾</span> <span>3. Restore database backup</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={triggerRollback}
                  disabled={isRunning}
                  className={`text-[9px] font-black uppercase tracking-wider py-1.5 px-2.5 rounded-xl border transition-all cursor-pointer ${
                    isRunning 
                      ? 'bg-zinc-850 border-zinc-800 text-zinc-600 cursor-not-allowed' 
                      : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-sm active:scale-95'
                  }`}
                >
                  ROLLBACK
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* FOOTER SECTION: Live CLI terminal output of trace & Release version tagging */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-3">
        
        {/* Release Versioning Tag (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className={`p-4 rounded-2xl border flex-1 flex flex-col justify-between ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200'} shadow-xs`}>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-amber-500">
                <Tag size={14} />
                {lang === 'en' ? '4. Release Version Tags' : '፬. የሪሊዝ ታግ ታሪክ (Release Tags)'}
              </h3>
              
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto mb-4">
                {releases.map(r => (
                  <span 
                    key={r}
                    className="text-[9px] font-mono font-black uppercase bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 text-amber-500 px-2 py-1 rounded-lg flex items-center gap-1"
                  >
                    🔖 {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-zinc-850/70">
              <label className="text-[10px] font-bold opacity-60 block mb-1">Create Release Tag</label>
              <div className="flex gap-1.5">
                <input 
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="v2.1.0"
                  disabled={isRunning}
                  className={`flex-1 p-2 rounded-xl text-xs font-mono border outline-none ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-850 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={addReleaseTag}
                  disabled={isRunning}
                  className="px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black text-xs active:scale-95 transition-all shadow-xs"
                >
                  Tag
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live CLI Trace Terminal (8 cols) */}
        <div className="lg:col-span-8">
          <div className="p-3 bg-black rounded-2xl border border-zinc-800 text-left flex flex-col h-[230px] relative">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2">
              <span className="text-cyan-500 font-bold uppercase tracking-widest text-[9px] flex items-center gap-2">
                <TerminalIcon size={12} className="animate-pulse" />
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                DevOps Console Live Deployment Trace Log:
              </span>
              <button 
                onClick={() => setLogs([])}
                className="text-[8px] text-zinc-500 hover:text-white uppercase font-bold underline cursor-pointer"
              >
                Clear Screen
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[9px] leading-relaxed pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {logs.length === 0 ? (
                <div className="text-zinc-600 italic h-full flex items-center justify-center">
                  Terminal ready. Press "Trigger Pipeline" to start.
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={`flex items-start gap-2 ${
                    log.type === 'error' ? 'text-red-400 font-bold'
                    : log.type === 'success' ? 'text-emerald-400'
                    : log.type === 'warning' ? 'text-amber-400 font-bold'
                    : log.type === 'cmd' ? 'text-cyan-400 font-bold border-l-2 border-cyan-500 pl-1.5 my-1'
                    : 'text-zinc-400'
                  }`}>
                    <span className="text-zinc-600 select-none shrink-0 font-light">[{log.timestamp}]</span>
                    {log.type === 'cmd' && <span className="text-cyan-500 select-none font-bold shrink-0">$</span>}
                    {log.type === 'error' && <span className="text-red-500 select-none font-bold shrink-0">[FAIL]</span>}
                    {log.type === 'warning' && <span className="text-amber-500 select-none font-bold shrink-0">[WARN]</span>}
                    {log.type === 'success' && <span className="text-emerald-500 select-none font-bold shrink-0">[SUCCESS]</span>}
                    <span className="break-all">{log.text}</span>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Ingress status footer */}
            <div className="absolute bottom-2.5 right-4 pointer-events-none flex items-center gap-1.5 opacity-80 select-none">
              <span className="text-[8px] font-black uppercase text-zinc-500 font-mono">LB Ingress:</span>
              <span className={`w-2 h-2 rounded-full ${
                currentStep === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'
              }`} />
              <span className={`text-[8.5px] font-mono uppercase ${
                currentStep === 'live' ? 'text-emerald-400 font-bold' : 'text-zinc-500'
              }`}>
                {currentStep === 'live' ? 'Ingress 200 OK' : 'No traffic'}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
