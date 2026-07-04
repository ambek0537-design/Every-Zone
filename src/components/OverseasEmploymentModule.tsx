import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, Search, Filter, Globe, DollarSign, Clock, ShieldAlert, CheckCircle2, 
  XCircle, Plus, ChevronRight, Star, Upload, Calendar, Bell, FileText, Lock, 
  AlertTriangle, User, Users, TrendingUp, MapPin, Sparkles, MessageSquare, Shield, Info, Eye, Trash2
} from "lucide-react";

import { Job, JobCategory } from "../modules/overseas/jobs/job.types";
import { JobApplication, ApplicationStage } from "../modules/overseas/applications/application.types";
import { Interview } from "../modules/overseas/interviews/interview.types";
import { OverseasReview } from "../modules/overseas/reviews/review.types";
import { OverseasNotification } from "../modules/overseas/notifications/notification.types";
import { DestinationCountry } from "../modules/overseas/countries/country.types";
import { overseasStore } from "../modules/overseas/repositories/overseas.repository";

interface OverseasEmploymentModuleProps {
  isDarkMode: boolean;
  lang: string;
}

export default function OverseasEmploymentModule({ isDarkMode, lang }: OverseasEmploymentModuleProps) {
  // Mode selection: "applicant" or "agency"
  const [activeRole, setActiveRole] = useState<"applicant" | "agency">("applicant");
  
  // Applicant Tabs: "marketplace", "my_portal"
  const [applicantTab, setApplicantTab] = useState<"marketplace" | "my_portal">("marketplace");
  
  // Active state lists
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [notifications, setNotifications] = useState<OverseasNotification[]>([]);
  const [reviews, setReviews] = useState<OverseasReview[]>([]);
  
  // Loading & status alerts
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(true);

  // Selected Detail views
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeApplication, setActiveApplication] = useState<JobApplication | null>(null);

  // Application wizard state
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [appNotes, setAppNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{
    passport?: { name: string; url: string };
    cv?: { name: string; url: string };
    nationalId?: { name: string; url: string };
    medical?: { name: string; url: string };
    experience?: { name: string; url: string };
  }>({});
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // Star Rating Input
  const [userReviewRating, setUserReviewRating] = useState(5);
  const [userReviewComment, setUserReviewComment] = useState("");

  // Scam reporting input
  const [scamAgencyId, setScamAgencyId] = useState("");
  const [scamDescription, setScamDescription] = useState("");

  // New Job formulation input (Agency mode)
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobEmployer, setNewJobEmployer] = useState("");
  const [newJobCategory, setNewJobCategory] = useState<JobCategory>("Hotel");
  const [newJobCountry, setNewJobCountry] = useState("United Arab Emirates");
  const [newJobCity, setNewJobCity] = useState("");
  const [newJobSalary, setNewJobSalary] = useState("4,200 AED/mo");
  const [newJobSalaryNum, setNewJobSalaryNum] = useState(115000);
  const [newJobHours, setNewJobHours] = useState("8 hrs/day");
  const [newJobContract, setNewJobContract] = useState("2 Years");
  const [newJobAccom, setNewJobAccom] = useState<"Included" | "Not Included">("Included");
  const [newJobGender, setNewJobGender] = useState<"Male" | "Female" | "Any">("Any");
  const [newJobAge, setNewJobAge] = useState("21 - 38");
  const [newJobExperience, setNewJobExperience] = useState("1+ Year");
  const [newJobDesc, setNewJobDesc] = useState("");

  // Mock applicant parameters
  const mockUserId = "u-2";
  const mockUserName = "Selamawit Tekle";
  
  // Selected active Agency for Agency mode
  const [currentAgencyId, setCurrentAgencyId] = useState("v7"); // default as Gigi Placements

  // Fetch initial datasets
  useEffect(() => {
    loadOverseasData();
  }, [activeRole, applicantTab]);

  const loadOverseasData = () => {
    // Sync React states to overseasStore arrays for true live interaction
    setJobs([...overseasStore.jobs]);
    setApplications([...overseasStore.applications]);
    setInterviews([...overseasStore.interviews]);
    setReviews([...overseasStore.reviews]);
    setNotifications(overseasStore.notifications.filter(n => n.userId === mockUserId));
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  // Simulate file upload with premium visual progress
  const handleSimulateUpload = (docType: "passport" | "cv" | "nationalId" | "medical" | "experience", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(docType);
    setTimeout(() => {
      const simulatedUrl = `https://storage.everyzone.com/users/${mockUserId}/docs/${Date.now()}_${file.name}`;
      setUploadedFiles(prev => ({
        ...prev,
        [docType]: { name: file.name, url: simulatedUrl }
      }));
      setIsUploading(null);
      showSuccess(`✅ Secure encrypted upload of ${file.name} complete.`);
    }, 1500);
  };

  // Perform Application Submission
  const handleApplySubmit = () => {
    if (!applyingJob) return;

    if (!uploadedFiles.passport || !uploadedFiles.cv) {
      showError(lang === 'en' 
        ? "Uploading your Passport and CV is mandatory for Overseas placements." 
        : "የውጭ አገር ስራ ለመቀጠር ፓስፖርት እና ሲቪ (CV) ማስገባት ግዴታ ነው።"
      );
      return;
    }

    const trackingNumber = `APP-${Math.floor(10000 + Math.random() * 90000)}-${Date.now().toString().slice(-1)}`;
    const newApp: JobApplication = {
      id: trackingNumber,
      jobId: applyingJob.id,
      jobTitle: applyingJob.title,
      agencyId: applyingJob.agencyId,
      agencyName: applyingJob.agencyName,
      applicantId: mockUserId,
      applicantName: mockUserName,
      stage: "Applied",
      documents: {
        passport: uploadedFiles.passport.name,
        cv: uploadedFiles.cv.name,
        nationalId: uploadedFiles.nationalId?.name,
        medicalCertificate: uploadedFiles.medical?.name,
        experienceLetter: uploadedFiles.experience?.name
      },
      notes: appNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to the in-memory global store
    overseasStore.applications.unshift(newApp);

    // Add applicant notification
    const newNotif: OverseasNotification = {
      id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: mockUserId,
      type: "Application Submitted",
      title: "ማመልከቻዎ በተሳካ ሁኔታ ገብቷል / Application Submitted",
      message: `Your application for "${applyingJob.title}" has been successfully logged with ${applyingJob.agencyName}. Your unique tracking reference is: ${trackingNumber}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    overseasStore.notifications.unshift(newNotif);

    loadOverseasData();
    setApplyingJob(null);
    setAppNotes("");
    setUploadedFiles({});
    showSuccess(`🎉 ${lang === 'en' ? 'Application logged!' : 'ማመልከቻው ገብቷል!'} Ref: ${trackingNumber}`);
  };

  // Leave Review Form submit
  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const newReview: OverseasReview = {
      id: `REV-${Math.floor(10000 + Math.random() * 90000)}`,
      agencyId: selectedJob.agencyId,
      userId: mockUserId,
      userName: mockUserName,
      rating: userReviewRating,
      comment: userReviewComment || "Excellent, prompt legal support and verification checks.",
      createdAt: new Date().toISOString()
    };

    overseasStore.reviews.unshift(newReview);
    setUserReviewComment("");
    loadOverseasData();
    showSuccess("⭐️ Review submitted and verified successfully.");
  };

  // Fraud scam report
  const handleReportScam = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAgency = scamAgencyId || selectedJob?.agencyId || "v7";
    
    const newReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      reporterId: mockUserId,
      agencyId: targetAgency,
      description: scamDescription,
      status: "PENDING" as const,
      createdAt: new Date().toISOString()
    };

    overseasStore.fraudReports.unshift(newReport);
    
    // Auto suspension triggers if reports are logged
    const totalReports = overseasStore.fraudReports.filter(r => r.agencyId === targetAgency).length;
    if (totalReports >= 2) {
      overseasStore.suspendedAgencies.add(targetAgency);
      overseasStore.jobs.forEach(j => {
        if (j.agencyId === targetAgency) {
          j.status = "SUSPENDED";
        }
      });
      showSuccess(`🚨 Safety Lock Alert: This agency has been automatically suspended pending investigation.`);
    } else {
      showSuccess("⚠️ Fraud and scam report successfully sent to Ministry of Labor auditing unit.");
    }

    setScamDescription("");
    loadOverseasData();
  };

  // AGENCY ACTION: Publish new job listing
  const handleAgencyPublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newJobTitle || !newJobEmployer || !newJobCity || !newJobDesc) {
      showError("Please fill out all mandatory fields to publish.");
      return;
    }

    const activeAgencyDetails = currentAgencyId === "v7" 
      ? { name: "Gigi International Placements (ጂጂ ወኪል)", license: "MEA-2026-64120", verified: true }
      : { name: "Horn-of-Africa Employment Co. (ቀንድ ኤጀንሲ)", license: "MEA-2026-11002", verified: true };

    const newJob: Job = {
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      agencyId: currentAgencyId,
      agencyName: activeAgencyDetails.name,
      agencyLicense: activeAgencyDetails.license,
      isAgencyVerified: activeAgencyDetails.verified,
      country: newJobCountry,
      city: newJobCity,
      category: newJobCategory,
      title: newJobTitle,
      titleAm: newJobTitle,
      employer: newJobEmployer,
      salary: newJobSalary,
      salaryNum: Number(newJobSalaryNum),
      contractDuration: newJobContract,
      accommodation: newJobAccom,
      foodIncluded: true,
      medicalInsurance: true,
      transportationIncluded: true,
      workingHours: newJobHours,
      deadline: new Date(Date.now() + 30 * 24 * 3600000).toISOString().split('T')[0],
      requirements: {
        ageLimit: newJobAge,
        gender: newJobGender,
        education: "High School / Diploma",
        experience: newJobExperience,
        language: "English / Basic Arabic"
      },
      benefits: ["Paid Flights", "Shared Air-conditioned Studio", "Tips Share"],
      description: newJobDesc,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    overseasStore.jobs.unshift(newJob);
    
    // Reset inputs
    setNewJobTitle("");
    setNewJobEmployer("");
    setNewJobCity("");
    setNewJobDesc("");

    loadOverseasData();
    showSuccess("💼 Vacancy published live to Every-zone Marketplace!");
  };

  // AGENCY ACTION: Advance candidate application stage
  const handleAdvanceStage = (appId: string, nextStage: ApplicationStage) => {
    const app = overseasStore.applications.find(a => a.id === appId);
    if (!app) return;

    app.stage = nextStage;
    app.updatedAt = new Date().toISOString();

    // Spawn matching notification
    const newNotif: OverseasNotification = {
      id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: app.applicantId,
      type: "Document Approved",
      title: `የማመልከቻ ደረጃ ማሻሻያ / Stage Updated to: ${nextStage}`,
      message: `Excellent news! Your application ${app.id} for "${app.jobTitle}" has progressed to ${nextStage}.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    overseasStore.notifications.unshift(newNotif);

    loadOverseasData();
    showSuccess(`Stage advanced to ${nextStage}`);
  };

  // Filtering calculation
  const filteredJobs = jobs.filter(job => {
    if (job.status !== "ACTIVE") return false;

    if (filterVerifiedOnly && !job.isAgencyVerified) return false;
    
    if (filterCountry !== "all" && job.country !== filterCountry) return false;
    
    if (filterCategory !== "all" && job.category !== filterCategory) return false;
    
    if (filterGender !== "all" && job.requirements.gender !== "Any" && job.requirements.gender !== filterGender) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        (job.titleAm && job.titleAm.toLowerCase().includes(q)) ||
        job.employer.toLowerCase().includes(q) ||
        job.agencyName.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const getStageColor = (stage: ApplicationStage) => {
    switch (stage) {
      case "Applied": return "bg-zinc-700 text-zinc-300";
      case "Documents Verified": return "bg-blue-600/30 text-blue-400";
      case "Under Review": return "bg-yellow-600/30 text-yellow-400";
      case "Interview Scheduled": return "bg-purple-600/30 text-purple-400";
      case "Accepted": return "bg-emerald-600/30 text-emerald-400";
      case "Visa Processing": return "bg-indigo-600/30 text-indigo-400";
      case "Travel Ready": return "bg-amber-500/30 text-amber-400";
      case "Completed": return "bg-green-600 text-white";
      case "Rejected": return "bg-rose-950 text-rose-400";
      default: return "bg-stone-500 text-white";
    }
  };

  return (
    <div className="space-y-4">
      {/* SUCCESS / ERROR ALERTS */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 bg-rose-950/90 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <AlertTriangle size={16} className="text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP PREMIUM PORTAL ROLE CONTROLLER (Applicant Workspace vs Agency Workspace) */}
      <div className="flex bg-neutral-900 border border-amber-500/15 p-1 rounded-2xl">
        <button 
          onClick={() => { setActiveRole("applicant"); setSelectedJob(null); }}
          className={`flex-1 py-2 text-xs font-black tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeRole === "applicant"
              ? "bg-[#C5A059] text-stone-950 shadow-lg font-bold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <User size={13} />
          {lang === 'en' ? "Applicant Portal" : "የስራ ፈላጊ ፖርታል"}
        </button>
        <button 
          onClick={() => { setActiveRole("agency"); setSelectedJob(null); }}
          className={`flex-1 py-2 text-xs font-black tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeRole === "agency"
              ? "bg-[#C5A059] text-stone-950 shadow-lg font-bold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Briefcase size={13} />
          {lang === 'en' ? "Agency Workspace" : "የወኪል የስራ ክፍል"}
        </button>
      </div>

      {/* =========================================================================
          APPLICANT PORTAL
          ========================================================================= */}
      {activeRole === "applicant" && (
        <div className="space-y-4">
          {/* APPLICANT SCREEN NAV TABS */}
          <div className="flex gap-2">
            <button
              onClick={() => setApplicantTab("marketplace")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                applicantTab === "marketplace"
                  ? "bg-amber-500/15 border border-amber-500 text-amber-400"
                  : "bg-neutral-900 text-zinc-400 border border-transparent"
              }`}
            >
              🌐 Employment Marketplace
            </button>
            <button
              onClick={() => setApplicantTab("my_portal")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                applicantTab === "my_portal"
                  ? "bg-amber-500/15 border border-amber-500 text-amber-400"
                  : "bg-neutral-900 text-zinc-400 border border-transparent"
              }`}
            >
              👤 My Dashboard & Tracker
              {applications.length > 0 && (
                <span className="bg-amber-500 text-stone-950 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                  {applications.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: MARKETPLACE */}
          {applicantTab === "marketplace" && (
            <div className="space-y-4">
              {/* SEARCH ENGINE & DETAILED FILTER ACCORDION */}
              <div className="bg-neutral-950 border border-zinc-800 p-4 rounded-2xl space-y-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-3 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'en' ? "Search certified vacancies (e.g. Dubai Driver, Nurse)..." : "የተረጋገጡ የስራ ማስታወቂያዎችን ይፈልጉ..."}
                    className="w-full bg-neutral-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* FILTER GRID */}
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Destination</label>
                    <select
                      value={filterCountry}
                      onChange={(e) => setFilterCountry(e.target.value)}
                      className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-1.5 text-zinc-300 focus:outline-none"
                    >
                      <option value="all">All Countries</option>
                      <option value="United Arab Emirates">Dubai / UAE 🇦🇪</option>
                      <option value="Poland">Poland 🇵🇱</option>
                      <option value="Germany">Germany 🇩🇪</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Gender Focus</label>
                    <select
                      value={filterGender}
                      onChange={(e) => setFilterGender(e.target.value)}
                      className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-1.5 text-zinc-300 focus:outline-none"
                    >
                      <option value="all">Any Gender</option>
                      <option value="Male">Male Only</option>
                      <option value="Female">Female Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Job Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-1.5 text-zinc-300 focus:outline-none"
                    >
                      <option value="all">All Sectors</option>
                      <option value="Hotel">Hotel & Catering</option>
                      <option value="Driver">Driver / Logistics</option>
                      <option value="Construction">Construction</option>
                      <option value="Nurse">Medical / Nurse</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-zinc-900 pt-2 text-[10.5px]">
                  <input
                    type="checkbox"
                    id="verified_agencies"
                    checked={filterVerifiedOnly}
                    onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <label htmlFor="verified_agencies" className="text-zinc-400 flex items-center gap-1 cursor-pointer select-none">
                    <Shield size={11} className="text-emerald-500" />
                    {lang === 'en' ? "Show only licensed Ministry of Labor certified agencies" : "በቅጥር ኤጀንሲ ሰርተፍኬት የተረጋገጡ ብቻ አሳይ"}
                  </label>
                </div>
              </div>

              {/* VACANCIES DISPLAY LIST */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-amber-500" />
                    Available Contracts ({filteredJobs.length})
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Real-time matching active</span>
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12 bg-neutral-950 border border-dashed border-zinc-800 rounded-2xl space-y-2">
                    <Briefcase className="mx-auto text-zinc-600" size={28} />
                    <p className="text-xs text-zinc-400 font-medium">No active certified jobs match this filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredJobs.map(job => (
                      <motion.div
                        key={job.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedJob(job)}
                        className="bg-neutral-950 hover:bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group"
                      >
                        {/* HEADER: verified BADGE & COUNTRY */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg leading-none">{job.countryFlag || "✈️"}</span>
                            <div>
                              <span className="text-[10px] text-zinc-400 block font-mono">{job.country} • {job.city}</span>
                            </div>
                          </div>

                          <div className="bg-emerald-950 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <Shield size={9} />
                            Verified Lic: {job.agencyLicense}
                          </div>
                        </div>

                        {/* TITLE & AGENCY */}
                        <div>
                          <h3 className="text-sm font-black text-white leading-snug group-hover:text-amber-400 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-1 font-sans">
                            <Users size={11} className="text-amber-500" />
                            {job.agencyName}
                          </p>
                        </div>

                        {/* METADATA CHIPS */}
                        <div className="grid grid-cols-2 gap-2 text-[10.5px] bg-neutral-900 p-2.5 rounded-xl border border-zinc-900">
                          <div className="flex items-center gap-1 text-zinc-300 font-medium">
                            <DollarSign size={12} className="text-emerald-500" />
                            <span>Salary: <strong className="text-white font-black">{job.salary}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-300">
                            <Clock size={12} className="text-amber-500" />
                            <span>Duration: <strong className="text-white">{job.contractDuration}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-300 col-span-2">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span>Housing & Medical: <strong className="text-emerald-400">Included (ነፃ)</strong></span>
                          </div>
                        </div>

                        {/* BOTTOM ACTIONS */}
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Apply Deadline: {job.deadline}</span>
                          <span className="text-[10px] text-amber-400 font-black flex items-center gap-1 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            Apply Now
                            <ChevronRight size={12} />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: APPLICANT DASHBOARD (MY PORTAL) */}
          {applicantTab === "my_portal" && (
            <div className="space-y-4">
              {/* COMPLIANCE ALERT */}
              <div className="bg-neutral-950 border border-zinc-800 p-3.5 rounded-2xl flex items-start gap-2.5">
                <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[11px] text-zinc-300 leading-relaxed">
                  <span className="font-extrabold text-amber-500 uppercase block tracking-wider mb-0.5">Government Regulatory Notice:</span>
                  All applicants must upload their authorized biometric passport and federal police clearances. Fayda Digital National ID validation is authenticated instantly.
                </div>
              </div>

              {/* TRACKING PROGRESS OF SUBMITTED APPLICATIONS */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Submitted Placements ({applications.length})
                </h4>

                {applications.length === 0 ? (
                  <div className="text-center py-8 bg-neutral-950 border border-zinc-800 rounded-2xl">
                    <p className="text-xs text-zinc-500 font-semibold">You haven't submitted any job applications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div 
                        key={app.id} 
                        onClick={() => setActiveApplication(activeApplication?.id === app.id ? null : app)}
                        className="bg-neutral-950 border border-zinc-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/25 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9.5px] font-mono font-black text-amber-500 uppercase tracking-widest">Tracking Ref: {app.id}</span>
                            <h5 className="text-xs font-black text-white mt-1">{app.jobTitle}</h5>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{app.agencyName}</p>
                          </div>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md ${getStageColor(app.stage)}`}>
                            {app.stage}
                          </span>
                        </div>

                        {/* STEPPED TRACKER VISUALIZATIONS */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center text-[8.5px] text-zinc-500 font-mono">
                          <div className={`p-1 rounded-sm border ${app.stage === "Applied" ? "border-amber-500 text-amber-400 bg-amber-500/5 font-black" : "border-zinc-800"}`}>
                            1. Applied
                          </div>
                          <div className={`p-1 rounded-sm border ${app.stage === "Documents Verified" ? "border-amber-500 text-amber-400 bg-amber-500/5 font-black" : "border-zinc-800"}`}>
                            2. Verified
                          </div>
                          <div className={`p-1 rounded-sm border ${app.stage === "Interview Scheduled" ? "border-amber-500 text-amber-400 bg-amber-500/5 font-black" : "border-zinc-800"}`}>
                            3. Interview
                          </div>
                          <div className={`p-1 rounded-sm border ${app.stage === "Visa Processing" || app.stage === "Travel Ready" || app.stage === "Completed" ? "border-amber-500 text-amber-400 bg-amber-500/5 font-black" : "border-zinc-800"}`}>
                            4. Travel Ready
                          </div>
                        </div>

                        {/* ACCORDION DETAILS */}
                        {activeApplication?.id === app.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pt-3 border-t border-zinc-900 space-y-3 text-[11px] text-zinc-300"
                          >
                            <div className="bg-neutral-900 p-3 rounded-xl space-y-2">
                              <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Submitted Document Pack</span>
                              <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                  <FileText size={12} className="text-emerald-500" />
                                  <span>Passport: <strong>{app.documents.passport}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <FileText size={12} className="text-emerald-500" />
                                  <span>CV/Resume: <strong>{app.documents.cv}</strong></span>
                                </div>
                                {app.documents.nationalId && (
                                  <div className="flex items-center gap-1.5">
                                    <FileText size={12} className="text-emerald-500" />
                                    <span>National ID: <strong>Verified (Fayda)</strong></span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* CHAT WITH AGENCY */}
                            <div className="flex gap-2">
                              <a 
                                href={`mailto:placement@gigiagency.com?subject=Inquiry on Application ${app.id}`}
                                className="flex-1 bg-neutral-900 hover:bg-zinc-850 text-white border border-zinc-800 text-center py-2 rounded-lg font-bold text-[10px] uppercase transition-colors"
                              >
                                💬 Live Chat Agency
                              </a>
                              <button 
                                onClick={() => {
                                  setScamAgencyId(app.agencyId);
                                  setSelectedJob(jobs.find(j => j.id === app.jobId) || null);
                                  showSuccess("Scroll down to report fraud form configured below.");
                                }}
                                className="bg-rose-950/20 hover:bg-rose-950 border border-rose-500/40 text-rose-300 px-3 py-2 rounded-lg font-bold text-[10px] uppercase"
                              >
                                🚨 Report Fraud
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* INTERVIEW MANAGER */}
              <div className="bg-neutral-950 border border-zinc-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={13} className="text-purple-400" />
                  Scheduled Interviews ({interviews.length})
                </h4>

                {interviews.length === 0 ? (
                  <p className="text-[11px] text-zinc-500">No interviews currently scheduled.</p>
                ) : (
                  <div className="space-y-2.5">
                    {interviews.map(i => (
                      <div key={i.id} className="bg-neutral-900 p-3 rounded-xl border border-zinc-800 flex justify-between items-center gap-2">
                        <div className="text-[11px] space-y-1">
                          <span className="text-[9px] font-bold text-purple-400 uppercase font-mono bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-500/10">Ref: {i.applicationId}</span>
                          <h5 className="font-bold text-white mt-1">Virtual Video Screening Panel</h5>
                          <p className="text-[10px] text-zinc-400">Time: {new Date(i.scheduledAt).toLocaleString()}</p>
                        </div>
                        <a 
                          href={i.meetingLink} 
                          target="_blank" 
                          referrerPolicy="no-referrer"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shrink-0 transition-all uppercase"
                        >
                          Launch Meet
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* REAL-TIME NOTIFICATIONS BOX */}
              <div className="bg-neutral-950 border border-zinc-800 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bell size={13} className="text-amber-500 animate-swing" />
                  Notification Center
                </h4>

                {notifications.length === 0 ? (
                  <p className="text-[11px] text-zinc-500">Your regulatory inbox is clean.</p>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div key={n.id} className="bg-neutral-900 p-2.5 rounded-lg border border-zinc-900 text-[11px] space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-amber-400 font-bold">{n.title}</strong>
                          <span className="text-[9px] text-zinc-500 font-mono">Just Now</span>
                        </div>
                        <p className="text-zinc-300 text-[10px] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FRAUD & SCAM REPORTING FORM (Anti-Fraud protection) */}
              <div className="bg-rose-950/10 border border-rose-500/20 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-rose-400" />
                  Every-zone Anti-Fraud Enforcement
                </h4>
                <p className="text-[10px] text-rose-300 leading-normal font-sans">
                  Suspicious agency charging illegal upfront fees? Report immediately. Every-zone guarantees automated suspension of fake entities and forwards coordinates to state investigation officers.
                </p>

                <form onSubmit={handleReportScam} className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Target Agency Reference</label>
                    <input
                      type="text"
                      value={scamAgencyId}
                      onChange={(e) => setScamAgencyId(e.target.value)}
                      placeholder="e.g. v7 (Gigi), v8 (Horn-of-Africa)"
                      className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Scam description & illegal requests detail</label>
                    <textarea
                      rows={2}
                      value={scamDescription}
                      onChange={(e) => setScamDescription(e.target.value)}
                      placeholder="State what went wrong (charging placement fees, fake documents request, etc)..."
                      className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-colors"
                  >
                    File Regulatory Report
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          AGENCY WORKSPACE (CONTROL CENTER)
          ========================================================================= */}
      {activeRole === "agency" && (
        <div className="space-y-4">
          {/* CHOOSE VENDOR PROFILE MOCK */}
          <div className="bg-neutral-950 border border-zinc-800 p-3.5 rounded-2xl space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-extrabold block">Select Active Agency Session</label>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentAgencyId("v7")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                  currentAgencyId === "v7"
                    ? "bg-amber-500/15 border-amber-500 text-amber-400 font-extrabold"
                    : "bg-neutral-900 border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Gigi Placements (ጂጂ ወኪል)
              </button>
              <button
                onClick={() => setCurrentAgencyId("v8")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                  currentAgencyId === "v8"
                    ? "bg-amber-500/15 border-amber-500 text-amber-400 font-extrabold"
                    : "bg-neutral-900 border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Horn of Africa (ቀንድ ኤጀንሲ)
              </button>
            </div>
          </div>

          {/* PUBLISH NEW JOB FORM */}
          <div className="bg-neutral-950 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-amber-500" />
              Publish New Vacancy
            </h4>

            <form onSubmit={handleAgencyPublish} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Executive Chef, Driver"
                    className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Employer / Company Name</label>
                  <input
                    type="text"
                    value={newJobEmployer}
                    onChange={(e) => setNewJobEmployer(e.target.value)}
                    placeholder="e.g. Ritz Carlton Dubai"
                    className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Destination</label>
                  <select
                    value={newJobCountry}
                    onChange={(e) => setNewJobCountry(e.target.value)}
                    className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 focus:outline-none"
                  >
                    <option value="United Arab Emirates">Dubai / UAE 🇦🇪</option>
                    <option value="Poland">Poland 🇵🇱</option>
                    <option value="Germany">Germany 🇩🇪</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Category</label>
                  <select
                    value={newJobCategory}
                    onChange={(e) => setNewJobCategory(e.target.value as JobCategory)}
                    className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 focus:outline-none"
                  >
                    <option value="Hotel">Hotel & Restaurant</option>
                    <option value="Driver">Driver / Transport</option>
                    <option value="Construction">Construction</option>
                    <option value="Nurse">Medical / Nurse</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    placeholder="e.g. 4,500 AED/mo"
                    className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Job Description & Accommodation Details</label>
                <textarea
                  rows={2}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Summarize working hours, flights, accommodation, and requirements..."
                  className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C5A059] text-stone-950 font-black py-2.5 rounded-xl text-[10.5px] uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
              >
                Launch Vacancy to Live Zone
              </button>
            </form>
          </div>

          {/* MANAGE CANDIDATES INBOX */}
          <div className="bg-neutral-950 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-amber-500" />
              Incoming Placement Applications ({applications.filter(a => a.agencyId === currentAgencyId).length})
            </h4>

            {applications.filter(a => a.agencyId === currentAgencyId).length === 0 ? (
              <p className="text-[11px] text-zinc-500 py-2">No active applicant submissions for this agency.</p>
            ) : (
              <div className="space-y-3">
                {applications.filter(a => a.agencyId === currentAgencyId).map(app => (
                  <div key={app.id} className="bg-neutral-900 p-3.5 rounded-xl border border-zinc-800 space-y-3 text-[11px]">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-amber-500 font-mono font-bold block">{app.id}</span>
                        <strong className="text-white text-xs block mt-0.5">{app.applicantName}</strong>
                        <span className="text-[10px] text-zinc-400">Position: {app.jobTitle}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${getStageColor(app.stage)}`}>
                        {app.stage}
                      </span>
                    </div>

                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-zinc-900 text-[10px] text-zinc-400 space-y-1">
                      <div className="font-bold text-zinc-300">Compliance Files:</div>
                      <div>📁 Passport File: <span className="text-emerald-400 font-bold">{app.documents.passport}</span> (Verified ✅)</div>
                      <div>📁 Resume/CV: <span className="text-emerald-400 font-bold">{app.documents.cv}</span> (Verified ✅)</div>
                    </div>

                    {/* ACTIONS CONTROLLERS */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleAdvanceStage(app.id, "Documents Verified")}
                        className="bg-neutral-950 hover:bg-zinc-800 border border-zinc-800 text-[9px] text-zinc-300 font-bold px-2 py-1 rounded transition-colors"
                      >
                        ✅ Verify Docs
                      </button>
                      <button
                        onClick={() => handleAdvanceStage(app.id, "Under Review")}
                        className="bg-neutral-950 hover:bg-zinc-800 border border-zinc-800 text-[9px] text-zinc-300 font-bold px-2 py-1 rounded transition-colors"
                      >
                        🔍 Screening Review
                      </button>
                      <button
                        onClick={() => handleAdvanceStage(app.id, "Interview Scheduled")}
                        className="bg-purple-950/40 border border-purple-500/30 text-[9px] text-purple-300 font-bold px-2 py-1 rounded transition-colors"
                      >
                        📅 Book Interview
                      </button>
                      <button
                        onClick={() => handleAdvanceStage(app.id, "Accepted")}
                        className="bg-emerald-950/40 border border-emerald-500/30 text-[9px] text-emerald-300 font-bold px-2 py-1 rounded transition-colors"
                      >
                        🎉 Accept Candidate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SLIDE-UP DETAILED JOB VACANCY VIEW SHEET
          ========================================================================= */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40"
            />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85%] bg-neutral-950 border-t-2 border-amber-500 rounded-t-[32px] overflow-y-auto z-50 p-5 shadow-2xl flex flex-col space-y-4 text-zinc-100"
            >
              <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto shrink-0 mb-1"></div>

              {/* AGENCY OVERLAY BRAND HEADER */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest font-black block">
                    {selectedJob.agencyName}
                  </span>
                  <h2 className="text-base font-black text-white leading-snug">
                    {selectedJob.title}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full font-bold flex items-center justify-center text-xs shrink-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* COVER OR PRIMARY PIC */}
              {selectedJob.photos?.[0] && (
                <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-md">
                  <img 
                    src={selectedJob.photos[0]} 
                    alt={selectedJob.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover" 
                  />
                </div>
              )}

              {/* AGENCY METADATA PROFILE HEADER */}
              <div className="bg-neutral-900 p-3.5 rounded-2xl border border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-base font-bold text-amber-500 border border-amber-500/20">
                    🏢
                  </div>
                  <div>
                    <strong className="text-xs text-white block">Agency Evaluation & Licensure</strong>
                    <span className="text-[10px] text-zinc-400">License: {selectedJob.agencyLicense} (Active Subscription ✅)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-zinc-400 border-t border-zinc-800 pt-2">
                  <div>
                    <span className="block text-white font-extrabold text-[11px]">★ 4.8 / 5.0</span>
                    Rating
                  </div>
                  <div>
                    <span className="block text-white font-extrabold text-[11px]">&lt; 2 Hours</span>
                    Response
                  </div>
                  <div>
                    <span className="block text-white font-extrabold text-[11px]">2,490+</span>
                    Placed
                  </div>
                </div>
              </div>

              {/* VACANCY DETAIL BLOCK */}
              <div className="space-y-3.5 text-xs text-zinc-300">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider font-extrabold">Employment Parameters</h4>
                  <div className="grid grid-cols-2 gap-2 bg-neutral-900/60 p-3 rounded-xl border border-zinc-900">
                    <div>📍 Destination: <strong className="text-white">{selectedJob.country}</strong></div>
                    <div>💼 Sector: <strong className="text-white">{selectedJob.category}</strong></div>
                    <div>💰 Salary: <strong className="text-emerald-400 font-extrabold">{selectedJob.salary}</strong></div>
                    <div>⏱️ Contract: <strong className="text-white">{selectedJob.contractDuration}</strong></div>
                    <div>🏢 Employer: <strong className="text-zinc-300">{selectedJob.employer}</strong></div>
                    <div>🏠 Accommodation: <strong className="text-emerald-400">Included (ነፃ)</strong></div>
                  </div>
                </div>

                {/* DETAILED CONTRACT DESCRIPTION */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider font-extrabold">Detailed Contract Description</h4>
                  <p className="text-[11px] leading-relaxed text-zinc-400 font-sans">
                    {selectedJob.description}
                  </p>
                </div>

                {/* COMPLIANCE CRITERIA */}
                <div className="bg-neutral-900 p-3.5 rounded-2xl border border-zinc-800 space-y-2">
                  <h4 className="text-[10px] text-amber-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
                    <Shield size={12} />
                    Ministry Compliance & Requirements
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] text-zinc-300 font-mono">
                    <div>• Age Limit: <strong>{selectedJob.requirements?.ageLimit || "21 - 40 Years"}</strong></div>
                    <div>• Gender Focus: <strong>{selectedJob.requirements?.gender || "Any"}</strong></div>
                    <div>• Min Experience: <strong>{selectedJob.requirements?.experience || "1 Year"}</strong></div>
                    <div>• Language: <strong>{selectedJob.requirements?.language || "English"}</strong></div>
                  </div>
                </div>
              </div>

              {/* ACTION: APPLY AND ENTER MANDATORY STEP */}
              <div className="pt-2">
                <button
                  onClick={() => { setApplyingJob(selectedJob); setSelectedJob(null); }}
                  className="w-full bg-[#C5A059] text-stone-950 hover:bg-[#C5A059]/95 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  📝 Apply & Upload Documents
                </button>
              </div>

              {/* AGENCY REVIEWS LOG */}
              <div className="p-4 bg-neutral-900 rounded-2xl border border-zinc-800 space-y-2">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex justify-between items-center">
                  <span>Candidate Placement Reviews</span>
                  <span className="text-amber-500">★ 4.8 / 5.0</span>
                </h4>

                <div className="space-y-2 pt-1 max-h-40 overflow-y-auto">
                  {reviews.filter(r => r.agencyId === selectedJob.agencyId).length === 0 ? (
                    <p className="text-[10.5px] text-zinc-500">No reviews logged yet. Be the first to review after placement!</p>
                  ) : (
                    reviews.filter(r => r.agencyId === selectedJob.agencyId).map(rev => (
                      <div key={rev.id} className="bg-neutral-950 p-2.5 rounded-lg text-[10.5px] space-y-1 border border-zinc-900">
                        <div className="flex justify-between items-center text-[10px]">
                          <strong className="text-zinc-300">{rev.userName}</strong>
                          <span className="text-amber-500 font-extrabold">{"★".repeat(rev.rating)}</span>
                        </div>
                        <p className="text-zinc-400 font-sans leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* WRITE A REVIEW FORM */}
                <form onSubmit={handlePostReview} className="space-y-2 border-t border-zinc-800 pt-3 text-[11px]">
                  <strong className="text-zinc-300 block">Post Placement Review</strong>
                  <div className="flex gap-1.5 items-center">
                    <span className="text-zinc-500">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setUserReviewRating(star)}
                        className={`text-sm ${star <= userReviewRating ? "text-amber-400" : "text-zinc-600"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={userReviewComment}
                    onChange={(e) => setUserReviewComment(e.target.value)}
                    placeholder="Provide comments about agency services..."
                    className="w-full bg-neutral-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 font-black px-3 py-1.5 rounded text-[9.5px] uppercase border border-amber-500/30 transition-all cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =========================================================================
          APPLICATION FORM DIALOG (MANDATORY DOCUMENT CHECKS)
          ========================================================================= */}
      <AnimatePresence>
        {applyingJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setApplyingJob(null)}
              className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-[10%] left-4 right-4 max-h-[80%] bg-neutral-950 border-2 border-[#C5A059] rounded-3xl z-51 overflow-y-auto p-5 shadow-2xl space-y-4 text-zinc-100"
            >
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <div>
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest font-black block">Apply & Submit Credentials</span>
                  <h3 className="text-xs font-black text-white">{applyingJob.title}</h3>
                </div>
                <button 
                  onClick={() => setApplyingJob(null)}
                  className="w-6 h-6 bg-zinc-800 text-zinc-300 rounded-full font-bold flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              {/* REGULATORY CHECKLIST STAT */}
              <div className="bg-amber-500/5 p-3 rounded-xl border border-dashed border-amber-500/30 flex items-center gap-2.5 text-[10px] text-zinc-300 leading-relaxed font-sans">
                <Lock size={16} className="text-amber-500 shrink-0" />
                <span>
                  <strong>Strict Security Rule:</strong> All credentials are encrypted end-to-end to secure personal records against unauthorized third-party scanning.
                </span>
              </div>

              {/* UPLOAD FORM CHANNELS */}
              <div className="space-y-3.5 text-xs">
                {/* 1. Passport Upload */}
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold block">1. Biometric Passport (ማንነቱን የሚያረጋግጥ ፓስፖርት) *</label>
                  <div className="bg-neutral-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10.5px] text-zinc-400 font-mono">
                      {uploadedFiles.passport ? `✅ ${uploadedFiles.passport.name}` : "Passport_Verify_Pack.pdf"}
                    </span>
                    <label className="bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-stone-950 font-black px-2.5 py-1.5 rounded text-[9.5px] uppercase cursor-pointer transition-all">
                      {isUploading === "passport" ? "Uploading..." : "Upload PDF / JPG"}
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleSimulateUpload("passport", e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* 2. CV/Resume Upload */}
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold block">2. Professional Curriculum Vitae (CV) *</label>
                  <div className="bg-neutral-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10.5px] text-zinc-400 font-mono">
                      {uploadedFiles.cv ? `✅ ${uploadedFiles.cv.name}` : "CV_Professional_Resume.pdf"}
                    </span>
                    <label className="bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-stone-950 font-black px-2.5 py-1.5 rounded text-[9.5px] uppercase cursor-pointer transition-all">
                      {isUploading === "cv" ? "Uploading..." : "Upload CV"}
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleSimulateUpload("cv", e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* 3. Fayda Digital ID */}
                <div className="space-y-1">
                  <label className="text-zinc-400 block font-medium">3. Fayda National Digital ID (Optional)</label>
                  <div className="bg-neutral-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10.5px] text-zinc-400 font-mono">
                      {uploadedFiles.nationalId ? `✅ ${uploadedFiles.nationalId.name}` : "Digital_Fayda_ID.png"}
                    </span>
                    <label className="bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-stone-950 font-black px-2.5 py-1.5 rounded text-[9.5px] uppercase cursor-pointer transition-all">
                      {isUploading === "nationalId" ? "Uploading..." : "Upload Image"}
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleSimulateUpload("nationalId", e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Cover Notes */}
                <div className="space-y-1">
                  <label className="text-zinc-400 block font-medium">Additional Cover Notes / Message to Agency</label>
                  <textarea
                    rows={2}
                    value={appNotes}
                    onChange={(e) => setAppNotes(e.target.value)}
                    placeholder="Describe any professional certificates, language proficiency, or details..."
                    className="w-full bg-neutral-900 border border-zinc-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* ACTION: FINAL LOG SUBMIT */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleApplySubmit}
                  className="w-full bg-[#C5A059] text-stone-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  🚀 Transmit Encrypted Application Pack
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
