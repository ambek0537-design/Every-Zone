import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, Search, Filter, Globe, DollarSign, Clock, ShieldAlert, CheckCircle2, 
  XCircle, Plus, ChevronRight, Star, Upload, Calendar, Bell, FileText, Lock, 
  AlertTriangle, User, Users, TrendingUp, MapPin, Sparkles, MessageSquare, Shield, 
  Info, Eye, Trash2, Download, Phone, Heart, Camera, Mic, Send, Check, Activity, FileCheck
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
  
  // Applicant Sub-Tabs: "marketplace", "dashboard", "smart_cv", "countries", "agencies", "chat"
  const [applicantTab, setApplicantTab] = useState<"marketplace" | "dashboard" | "smart_cv" | "countries" | "agencies" | "chat">("marketplace");
  
  // Active state lists synchronized with overseasStore
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [notifications, setNotifications] = useState<OverseasNotification[]>([]);
  const [reviews, setReviews] = useState<OverseasReview[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  
  // Local active chat system
  const [chatAgencyId, setChatAgencyId] = useState<string>("v7");
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: "applicant" | "agency";
    text?: string;
    image?: string;
    docName?: string;
    voiceDuration?: string;
    timestamp: string;
  }>>([
    { id: "1", sender: "agency", text: "ሰላም! ይህ ከጂጂ ምልመላ ኤጀንሲ ነው። ፓስፖርትዎን እና Fayda ዲጂታል መታወቂያዎን በሲስተሙ ካረጋገጡ በኋላ ወዲያውኑ ቃለ-መጠይቅ እናስይዛለን።", timestamp: "9:30 AM" },
    { id: "2", sender: "applicant", text: "እንደምን አደሩ፣ ፓስፖርቴን ወደ ሲስተሙ ጭኛለሁ። መቼ ነው የቃለ መጠይቅ ቀጠሮው?", timestamp: "9:32 AM" },
    { id: "3", sender: "agency", text: "በጣም ግሩም ነው! ሰነዶችዎን መርምረን በ30 ደቂቃ ውስጥ መልስ እንሰጣለን።", timestamp: "9:35 AM" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  // Smart CV Builder States
  const [cvData, setCvData] = useState({
    fullName: "Selamawit Tekle",
    email: "selamawit.tekle@everyzone.com",
    phone: "+251 912 345 678",
    city: "Addis Ababa, Ethiopia",
    education: "Diploma in Food Preparation & Pastry Arts - National Hospitality Institute",
    experience: "2 Years Assistant Pastry Chef at Hyatt Regency Addis Ababa",
    skills: "Pastry & Baking, Cake Decoration, Sanitation Standards, Inventory Control",
    languages: "Amharic (Native), English (Conversational), Arabic (Basic)",
    certificates: "COC Level III Pastry Certified, First Aid Certificate"
  });
  const [isSavingCV, setIsSavingCV] = useState(false);

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
  const [useSmartCV, setUseSmartCV] = useState(true);
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

  // Agency formulation input (Agency mode)
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

  // Selected Country for Countries view Detail
  const [selectedCountryObj, setSelectedCountryObj] = useState<any | null>(null);

  // Fetch initial datasets
  useEffect(() => {
    loadOverseasData();
  }, [activeRole, applicantTab]);

  // Synchronize dynamic role switcher from quick access dashboard bar
  useEffect(() => {
    const handleRoleOverride = () => {
      const override = localStorage.getItem('ez_overseas_role_override');
      if (override === 'agency') {
        setActiveRole('agency');
        localStorage.removeItem('ez_overseas_role_override');
      }
    };
    handleRoleOverride(); // run on mount
    window.addEventListener('ez_overseas_role_change', handleRoleOverride);
    return () => window.removeEventListener('ez_overseas_role_change', handleRoleOverride);
  }, []);

  const loadOverseasData = () => {
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

  // Profile Completion Percentage Calculation
  const calculateProfileCompletion = () => {
    let score = 30; // base score
    if (cvData.education) score += 15;
    if (cvData.experience) score += 15;
    if (cvData.skills) score += 15;
    if (cvData.certificates) score += 15;
    if (uploadedFiles.passport || cvData.phone) score += 10;
    return Math.min(score, 100);
  };

  // Toggle Job Bookmark/Save
  const toggleSaveJob = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      showSuccess(lang === 'en' ? "Job removed from bookmarks." : "ስራው ከምልክት ማድረጊያ ተሰርዟል።");
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      showSuccess(lang === 'en' ? "Job saved successfully to bookmarks." : "ስራው በተሳካ ሁኔታ ተቀምጧል።");
    }
  };

  // Handle PDF Simulation Download
  const handleDownloadCV = () => {
    showSuccess(lang === 'en' ? "Generating certified PDF layout..." : "ህጋዊ የሲቪ ሰነድ በመዘጋጀት ላይ ነው...");
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", `EveryZone_SmartCV_${cvData.fullName.replace(/\s+/g, '_')}.pdf`);
      showSuccess(lang === 'en' ? "🎉 Smart CV downloaded successfully!" : "🎉 ሲቪዎ በተሳካ ሁኔታ ወርዷል!");
    }, 1500);
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
      showSuccess(lang === 'en' ? `✅ Secure encrypted upload of ${file.name} complete.` : `✅ የ ${file.name} ሰነድ በምስጢር ተቀምጧል።`);
    }, 1500);
  };

  // Submit Application
  const handleApplySubmit = () => {
    if (!applyingJob) return;

    if (!uploadedFiles.passport) {
      showError(lang === 'en' 
        ? "Uploading your Biometric Passport is mandatory for placements." 
        : "የውጭ አገር ስራ ለመቀጠር ፓስፖርት ማስገባት ግዴታ ነው።"
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
        cv: useSmartCV ? `Smart_CV_${cvData.fullName.replace(/\s+/g, '_')}.pdf` : (uploadedFiles.cv?.name || "Manual_Resume.pdf"),
        nationalId: uploadedFiles.nationalId?.name || "Verified_Fayda_ID.png",
        medicalCertificate: uploadedFiles.medical?.name || "Pending_Verification_Doc",
        experienceLetter: uploadedFiles.experience?.name
      },
      notes: appNotes || `Applied using Every-Zone Smart CV Builder. Ready for deployment.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to global in-memory store
    overseasStore.applications.unshift(newApp);

    // Create notifications
    const newNotif: OverseasNotification = {
      id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: mockUserId,
      type: "Application Submitted",
      title: "ማመልከቻዎ በተሳካ ሁኔታ ገብቷል / Application Received",
      message: `Your tracking code: ${trackingNumber} for ${applyingJob.title} is now under review.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    overseasStore.notifications.unshift(newNotif);

    loadOverseasData();
    setApplyingJob(null);
    setAppNotes("");
    showSuccess(lang === 'en' ? `🎉 Placed! Reference Track Code: ${trackingNumber}` : `🎉 ማመልከቻው ገብቷል! መከታተያ ኮድ፡ ${trackingNumber}`);
  };

  // Submit Review Form
  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReviewComment) return;

    const targetAgency = selectedJob?.agencyId || chatAgencyId || "v7";
    const newReview: OverseasReview = {
      id: `REV-${Math.floor(10000 + Math.random() * 90000)}`,
      agencyId: targetAgency,
      userId: mockUserId,
      userName: mockUserName,
      rating: userReviewRating,
      comment: userReviewComment,
      createdAt: new Date().toISOString()
    };

    overseasStore.reviews.unshift(newReview);
    setUserReviewComment("");
    loadOverseasData();
    showSuccess(lang === 'en' ? "⭐️ Review submitted successfully. Anti-Scam protection updated." : "⭐️ ግምገማዎ ገብቷል። የአጭበርባሪ መከላከያ መዝገብ ተዘምኗል።");
  };

  // Report scam
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
    
    // Auto suspension triggers if multiple reports logged
    const totalReports = overseasStore.fraudReports.filter(r => r.agencyId === targetAgency).length;
    if (totalReports >= 2) {
      overseasStore.suspendedAgencies.add(targetAgency);
      overseasStore.jobs.forEach(j => {
        if (j.agencyId === targetAgency) j.status = "SUSPENDED";
      });
      showSuccess(`🚨 SAFETY SUSPENSION: Agency ${targetAgency} is restricted from Every-zone due to repeated fraud audits.`);
    } else {
      showSuccess(lang === 'en' ? "⚠️ Report filed to Ministry of Labor auditing unit." : "⚠️ ሪፖርቱ ለሰራተኛና ማህበራዊ ጉዳይ ሚኒስቴር ተልኳል።");
    }

    setScamDescription("");
    loadOverseasData();
  };

  // Voice recording simulation
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // add voice message to chat
      const newMsg = {
        id: Date.now().toString(),
        sender: "applicant" as const,
        voiceDuration: "0:12",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMsg]);
      showSuccess(lang === 'en' ? "Voice message recorded and sent." : "የድምጽ መልዕክት ተልኳል።");
      // simulated response
      simulateAgencyReply();
    } else {
      setIsRecording(true);
      setRecordTime(0);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Send Text Message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: "applicant" as const,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputText("");
    
    // Auto-respond simulation
    simulateAgencyReply();
  };

  const simulateAgencyReply = () => {
    setTimeout(() => {
      const responseText = "እሺ፣ ሰነዶችዎን እየተመለከትን ነው። በቅርቡ በስልክ ወይም እዚሁ ቻት ላይ እናሳውቅዎታለን።";
      const replyMsg = {
        id: (Date.now() + 1).toString(),
        sender: "agency" as const,
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, replyMsg]);
    }, 2000);
  };

  // Publish Job
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
        language: "English / Arabic"
      },
      benefits: ["Paid Flights", "Free Shared Studio Accommodation", "Performance Tips"],
      description: newJobDesc,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    overseasStore.jobs.unshift(newJob);
    setNewJobTitle("");
    setNewJobEmployer("");
    setNewJobCity("");
    setNewJobDesc("");
    loadOverseasData();
    showSuccess("💼 Vacancy published live to Every-zone Marketplace!");
  };

  // Change Candidate Stage from CRM
  const handleAdvanceStage = (appId: string, nextStage: ApplicationStage) => {
    const app = overseasStore.applications.find(a => a.id === appId);
    if (!app) return;

    app.stage = nextStage;
    app.updatedAt = new Date().toISOString();

    // Add applicant notification
    const newNotif: OverseasNotification = {
      id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: app.applicantId,
      type: "Document Approved",
      title: `የማመልከቻ ደረጃ ተለውጧል / Stage Updated to: ${nextStage}`,
      message: `Excellent news! Your application ${app.id} for "${app.jobTitle}" is updated to ${nextStage}.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    overseasStore.notifications.unshift(newNotif);

    loadOverseasData();
    showSuccess(`Stage successfully advanced to: ${nextStage}`);
  };

  // Countries Dataset Requirements
  const destinationCountriesData = [
    {
      id: "uae",
      name: "United Arab Emirates",
      nameAm: "የተባበሩት አረብ ኤምሬትስ (ዱባይ)",
      flag: "🇦🇪",
      salary: "1,200 - 5,500 AED",
      hours: "8 - 9 hours / day",
      contract: "2 Years (Renewable)",
      accommodation: "Included (ነፃ መኖሪያ ቤት)",
      food: "Included or Allowance provided",
      transport: "Free Shuttle Provided",
      visaRequirements: "Fayda Digital ID, Biometric Passport, Police Clearance, Basic English or Arabic, Ministry medical approval."
    },
    {
      id: "poland",
      name: "Poland",
      nameAm: "ፖላንድ (አውሮፓ)",
      flag: "🇵🇱",
      salary: "1,800 - 3,200 EUR",
      hours: "8 hours / day (5 days/week)",
      contract: "2 Years (EU Work Permit Route)",
      accommodation: "Subsidized or Allowance provided",
      food: "Self-catering",
      transport: "Public transport allowance",
      visaRequirements: "Schengen compliance audit, Degree/Diploma verification, Professional COC certificates, Police check."
    },
    {
      id: "germany",
      name: "Germany",
      nameAm: "ጀርመን (አውሮፓ)",
      flag: "🇩🇪",
      salary: "2,400 - 4,000 EUR",
      hours: "7.5 - 8 hours / day",
      contract: "3 Years (German Blue Card)",
      accommodation: "Assisted Housing (በድርጅት የሚመቻች)",
      food: "Subsidized staff canteen",
      transport: "Monthly transit pass included",
      visaRequirements: "German B1 language proficiency, Certified nursing/technical credentials, Federal Labor authorization."
    },
    {
      id: "saudi",
      name: "Saudi Arabia",
      nameAm: "ሳዑዲ አረቢያ",
      flag: "🇸🇦",
      salary: "1,500 - 3,500 SAR",
      hours: "8 hours / day",
      contract: "2 Years",
      accommodation: "Fully Included",
      food: "Included",
      transport: "Free company transport",
      visaRequirements: "Medical fit check certificate, Musaned alignment approval, Fayda ID validation."
    },
    {
      id: "qatar",
      name: "Qatar",
      nameAm: "ኳታር",
      flag: "🇶🇦",
      salary: "1,800 - 4,500 QAR",
      hours: "8 hours / day",
      contract: "2 Years",
      accommodation: "Company Managed Villas",
      food: "Catered Staff Meals",
      transport: "Included",
      visaRequirements: "Biometric Passport, Labor Contract endorsement, Qatari medical screening."
    }
  ];

  // Verified Agencies list
  const registeredAgencies = [
    {
      id: "v7",
      name: "Gigi International Placements (ጂጂ ወኪል)",
      license: "MEA-2026-64120",
      rating: "4.9",
      response: "< 1 Hour",
      placements: "2,450 workers",
      contact: "+251 11 654 0910",
      verified: true
    },
    {
      id: "v8",
      name: "Horn-of-Africa Employment Co. (ቀንድ ኤጀንሲ)",
      license: "MEA-2026-11002",
      rating: "4.7",
      response: "< 2 Hours",
      placements: "1,820 workers",
      contact: "+251 11 412 8092",
      verified: true
    },
    {
      id: "v9",
      name: "Red Sea Oversea Placements",
      license: "MEA-2026-90412",
      rating: "4.5",
      response: "< 4 Hours",
      placements: "940 workers",
      contact: "+251 11 511 2309",
      verified: false
    }
  ];

  // Filtering calculations
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
    <div className="space-y-4 max-w-7xl mx-auto text-left">
      {/* ALERTS */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 z-50 relative"
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
            className="p-3.5 bg-rose-950/90 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 z-50 relative"
          >
            <AlertTriangle size={16} className="text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PORTAL SELECTOR: APPLICANT VS AGENCY CLIENT-SIDE CRM */}
      <div className="flex bg-zinc-950 border border-amber-500/15 p-1 rounded-2xl shadow-lg">
        <button 
          onClick={() => { setActiveRole("applicant"); setSelectedJob(null); }}
          className={`flex-1 py-2 text-xs font-black tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeRole === "applicant"
              ? "bg-[#C5A059] text-stone-950 shadow-md font-extrabold scale-[1.01]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <User size={13} />
          {lang === 'en' ? "Applicant Workspace" : "የስራ ፈላጊ የስራ ክፍል"}
        </button>
        <button 
          onClick={() => { setActiveRole("agency"); setSelectedJob(null); }}
          className={`flex-1 py-2 text-xs font-black tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeRole === "agency"
              ? "bg-[#C5A059] text-stone-950 shadow-md font-extrabold scale-[1.01]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Briefcase size={13} />
          {lang === 'en' ? "Agency CRM Dashboard" : "የኤጀንሲ አስተዳደር ፖርታል"}
        </button>
      </div>

      {/* APPLICANT INTERFACE */}
      {activeRole === "applicant" && (
        <div className="space-y-4">
          {/* HORIZONTAL PREMIUM TABS */}
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setApplicantTab("marketplace")}
              className={`px-3 py-2 rounded-xl text-[11px] font-black shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
                applicantTab === "marketplace"
                  ? "bg-amber-500/15 border-amber-500 text-amber-400"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              🌐 {lang === 'en' ? "Job Listings" : "ክፍት ስራዎች"}
            </button>
            <button
              onClick={() => setApplicantTab("dashboard")}
              className={`px-3 py-2 rounded-xl text-[11px] font-black shrink-0 transition-all border flex items-center gap-1.5 cursor-pointer ${
                applicantTab === "dashboard"
                  ? "bg-amber-500/15 border-amber-500 text-amber-400"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              📊 {lang === 'en' ? "My Dashboard" : "የእኔ ዴሽቦርድ"}
              {applications.length > 0 && (
                <span className="bg-amber-500 text-zinc-950 text-[9px] px-1.5 py-0.2 rounded-full font-black">
                  {applications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setApplicantTab("smart_cv")}
              className={`px-3 py-2 rounded-xl text-[11px] font-black shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
                applicantTab === "smart_cv"
                  ? "bg-amber-500/15 border-amber-500 text-amber-400"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              📄 {lang === 'en' ? "Smart CV Builder" : "ሲቪ መፍጠሪያ"}
            </button>
            <button
              onClick={() => setApplicantTab("countries")}
              className={`px-3 py-2 rounded-xl text-[11px] font-black shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
                applicantTab === "countries"
                  ? "bg-amber-500/15 border-amber-500 text-amber-400"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              🌍 {lang === 'en' ? "Target Countries" : "ሀገራት ዝርዝር"}
            </button>
            <button
              onClick={() => setApplicantTab("agencies")}
              className={`px-3 py-2 rounded-xl text-[11px] font-black shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
                applicantTab === "agencies"
                  ? "bg-amber-500/15 border-amber-500 text-amber-400"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              🏢 {lang === 'en' ? "Agencies Directory" : "ኤጀንሲዎች"}
            </button>
            <button
              onClick={() => setApplicantTab("chat")}
              className={`px-3 py-2 rounded-xl text-[11px] font-black shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
                applicantTab === "chat"
                  ? "bg-amber-500/15 border-amber-500 text-amber-400"
                  : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              💬 {lang === 'en' ? "Direct Agent Chat" : "ቀጥታ ውይይት"}
            </button>
          </div>

          {/* SUB-TAB 1: JOB MARKETPLACE */}
          {applicantTab === "marketplace" && (
            <div className="space-y-4">
              {/* FILTERS & SEARCH */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl space-y-3 shadow-xl">
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'en' ? "Search certified vacancies (e.g., Pastry, Driver, Europe)..." : "የተረጋገጡ የውጭ አገር ስራዎችን እዚህ ይፈልጉ..."}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                {/* FILTER GRID */}
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Destination</label>
                    <select
                      value={filterCountry}
                      onChange={(e) => setFilterCountry(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-300 focus:outline-none"
                    >
                      <option value="all">All Countries</option>
                      <option value="United Arab Emirates">Dubai / UAE 🇦🇪</option>
                      <option value="Poland">Poland 🇵🇱</option>
                      <option value="Germany">Germany 🇩🇪</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Gender Focus</label>
                    <select
                      value={filterGender}
                      onChange={(e) => setFilterGender(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-300 focus:outline-none"
                    >
                      <option value="all">Any Gender</option>
                      <option value="Male">Male Only</option>
                      <option value="Female">Female Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Sector</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-zinc-300 focus:outline-none"
                    >
                      <option value="all">All Sectors</option>
                      <option value="Hotel">Hotel & Catering</option>
                      <option value="Driver">Driver / Logistics</option>
                      <option value="Construction">Construction</option>
                      <option value="Nurse">Medical / Nurse</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-zinc-900 pt-2.5 text-[11px]">
                  <input
                    type="checkbox"
                    id="verified_agencies"
                    checked={filterVerifiedOnly}
                    onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <label htmlFor="verified_agencies" className="text-zinc-400 flex items-center gap-1 cursor-pointer select-none">
                    <Shield size={11} className="text-emerald-500" />
                    {lang === 'en' ? "Show only legally certified Ministry of Labor placement agencies" : "በቅጥር ኤጀንሲ ሰርተፍኬት የተረጋገጡ ብቻ አሳይ"}
                  </label>
                </div>
              </div>

              {/* LISTINGS GRID */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-amber-500" />
                    {lang === 'en' ? `Available Contracts (${filteredJobs.length})` : `ክፍት የስራ ውሎች (${filteredJobs.length})`}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">End-to-End Audit Protection</span>
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-950 border border-dashed border-zinc-800 rounded-3xl space-y-2">
                    <Briefcase className="mx-auto text-zinc-600" size={28} />
                    <p className="text-xs text-zinc-400 font-semibold">No active audited vacancies match criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredJobs.map(job => {
                      const isSaved = savedJobs.includes(job.id);
                      return (
                        <motion.div
                          key={job.id}
                          whileHover={{ y: -2 }}
                          onClick={() => setSelectedJob(job)}
                          className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-[#C5A059]/40 p-4 rounded-3xl cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group shadow-md"
                        >
                          {/* FLAG AND ACCREDITATION */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <span className="text-2xl leading-none">{job.countryFlag || "✈️"}</span>
                              <div>
                                <span className="text-[9.5px] text-zinc-400 block font-mono uppercase tracking-wider">{job.country} • {job.city}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={(e) => toggleSaveJob(job.id, e)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isSaved 
                                    ? "bg-rose-950/40 border-rose-500/30 text-rose-400" 
                                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white"
                                }`}
                              >
                                <Heart size={11} fill={isSaved ? "currentColor" : "none"} />
                              </button>
                              <div className="bg-emerald-950 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                                <Shield size={9} />
                                {lang === 'en' ? "Verified Lic" : "ሕጋዊ"}
                              </div>
                            </div>
                          </div>

                          {/* JOB TEXT */}
                          <div>
                            <h3 className="text-xs font-black text-white leading-normal group-hover:text-[#C5A059] transition-colors">
                              {lang === 'en' ? job.title : (job.titleAm || job.title)}
                            </h3>
                            <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1 font-sans">
                              <Users size={11} className="text-amber-500" />
                              {job.agencyName}
                            </p>
                          </div>

                          {/* METRICS */}
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-900">
                            <div className="flex items-center gap-1 text-zinc-300">
                              <DollarSign size={11} className="text-emerald-500" />
                              <span>{lang === 'en' ? "Salary" : "ደመወዝ"}: <strong className="text-white font-black">{job.salary}</strong></span>
                            </div>
                            <div className="flex items-center gap-1 text-zinc-300">
                              <Clock size={11} className="text-amber-500" />
                              <span>{lang === 'en' ? "Contract" : "ውል"}: <strong className="text-white">{job.contractDuration}</strong></span>
                            </div>
                          </div>

                          {/* FOOTER */}
                          <div className="flex justify-between items-center pt-1 text-[10px]">
                            <span className="text-zinc-500 uppercase tracking-widest font-mono text-[8px]">Deadline: {job.deadline}</span>
                            <span className="text-[#C5A059] font-black flex items-center gap-0.5 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                              {lang === 'en' ? "Apply Now" : "አሁኑኑ መዝገብ"}
                              <ChevronRight size={12} />
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: APPLICANT DASHBOARD */}
          {applicantTab === "dashboard" && (
            <div className="space-y-4">
              {/* TOP SUMMARY STATISTICS & COMPLIANCE METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Profile completion meter */}
                <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl flex items-center gap-4 shadow-xl">
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16">
                      <circle className="text-zinc-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32"/>
                      <circle className="text-amber-500 transition-all duration-1000" strokeWidth="6" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - calculateProfileCompletion() / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32"/>
                    </svg>
                    <span className="absolute text-xs font-black text-white font-mono">{calculateProfileCompletion()}%</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{lang === 'en' ? "Profile Completion" : "የእርስዎ ፕሮፋይል ሙላት"}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                      {calculateProfileCompletion() < 90 
                        ? (lang === 'en' ? "Complete your Smart CV to reach 100% and unlock fast visa tracks." : "ሲቪዎን በማጠናቀቅ 100% ያድርሱና ፈጣን ቪዛ ያግኙ።")
                        : (lang === 'en' ? "Your profile is fully verified! Ready for quick job match." : "ፕሮፋይልዎ ተጠናቋል! ለስራ ዝግጁ ነዎት።")
                      }
                    </p>
                  </div>
                </div>

                {/* 2. Passport Status */}
                <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl flex items-center gap-3.5 shadow-xl">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${uploadedFiles.passport ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{lang === 'en' ? "Passport Registry" : "የፓስፖርት ሁኔታ"}</h4>
                    <span className="text-[9.5px] font-bold block mt-0.5">
                      {uploadedFiles.passport 
                        ? `✅ ${lang === 'en' ? "Verified & Encrypted" : "የተረጋገጠ"}` 
                        : `⚠️ ${lang === 'en' ? "Not Uploaded Yet" : "እባክዎን ፓስፖርት ይጫኑ"}`
                      }
                    </span>
                    <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Biometric passport check</p>
                  </div>
                </div>

                {/* 3. Medical & Visa Hub */}
                <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl flex items-center gap-3.5 shadow-xl">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Activity size={20} />
                  </div>
                  <div className="text-[11px]">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{lang === 'en' ? "Medical & Visa Audit" : "የህክምና እና ቪዛ ሁኔታ"}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[8.5px] text-zinc-300">Med: <strong>Cleared ✅</strong></span>
                      <span className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[8.5px] text-zinc-300">Visa: <strong>Processing 🎫</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COURIER-STYLE APPLICATION TRACKING LEDGER */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {lang === 'en' ? "Live Placement Tracker" : "የቅጥር መከታተያ መዝገብ"}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-800">
                    {applications.length} Placements Logged
                  </span>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs">
                    No active applications found. Choose a job to submit.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {applications.map(app => {
                      // tracking stage lists
                      const stagesList: ApplicationStage[] = [
                        "Applied", "Documents Verified", "Under Review", "Interview Scheduled", 
                        "Accepted", "Visa Processing", "Travel Ready", "Completed"
                      ];
                      
                      const currentIdx = stagesList.indexOf(app.stage);

                      return (
                        <div key={app.id} className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl space-y-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-zinc-900 pb-2.5">
                            <div>
                              <span className="text-[9.5px] font-mono font-black text-[#C5A059] uppercase tracking-widest">Courier Tracking Ref: {app.id}</span>
                              <h5 className="text-xs font-black text-white mt-0.5">{app.jobTitle}</h5>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{app.agencyName}</p>
                            </div>
                            <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-lg shrink-0 ${getStageColor(app.stage)}`}>
                              {app.stage}
                            </span>
                          </div>

                          {/* COURIER FLOW STEPPER */}
                          <div className="relative pt-2">
                            {/* Horizontal progress bar background */}
                            <div className="absolute top-3.5 left-2 right-2 h-1 bg-zinc-800 rounded-full z-0 hidden md:block"></div>
                            {/* Active progress bar fill */}
                            <div 
                              className="absolute top-3.5 left-2 h-1 bg-amber-500 rounded-full z-0 hidden md:block transition-all duration-500"
                              style={{ width: `${(currentIdx / (stagesList.length - 1)) * 100}%` }}
                            ></div>

                            <div className="grid grid-cols-2 md:grid-cols-8 gap-3 relative z-10 text-center">
                              {stagesList.map((stg, sIdx) => {
                                const isPassed = sIdx <= currentIdx;
                                const isCurrent = sIdx === currentIdx;
                                return (
                                  <div key={stg} className="flex md:flex-col items-center gap-2 md:gap-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                      isCurrent 
                                        ? "bg-amber-500 text-zinc-950 border-amber-500 scale-110 shadow-lg ring-4 ring-amber-500/25" 
                                        : isPassed 
                                          ? "bg-zinc-900 text-emerald-400 border-emerald-500" 
                                          : "bg-zinc-950 text-zinc-600 border-zinc-800"
                                    }`}>
                                      {isPassed ? <Check size={12} strokeWidth={3} /> : <span className="text-[9px] font-mono font-bold">{sIdx + 1}</span>}
                                    </div>
                                    <span className={`text-[8.5px] font-mono font-black block tracking-tight text-left md:text-center ${isCurrent ? "text-amber-400 font-extrabold" : isPassed ? "text-zinc-300" : "text-zinc-600"}`}>
                                      {stg}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* NOTES */}
                          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 text-[10.5px] text-zinc-400">
                            <strong>Audit Action Status:</strong> Gigi Agency verified Fayda digital records. Visa clearance queue established at National Bureau of Overseas Labor.
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* INTERVIEWS & SAVED JOBS DUAL COHORTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* INTERVIEW INVITATION BOX */}
                <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl shadow-xl space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                    <Calendar size={13} className="text-purple-400" />
                    {lang === 'en' ? "Interview Invitations" : "የቃለ-መጠይቅ ቀጠሮዎች"}
                  </h4>

                  {interviews.length === 0 ? (
                    <p className="text-[11px] text-zinc-500">No upcoming interviews scheduled yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {interviews.map(i => (
                        <div key={i.id} className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-850 flex justify-between items-center gap-3">
                          <div className="text-[10.5px] space-y-1">
                            <span className="text-[8px] font-bold text-purple-400 uppercase font-mono bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-500/10">Ref: {i.applicationId}</span>
                            <h5 className="font-bold text-white text-xs">Video Placements Assessment</h5>
                            <p className="text-zinc-400">Time: {new Date(i.scheduledAt).toLocaleString()}</p>
                          </div>
                          <a 
                            href={i.meetingLink} 
                            target="_blank" 
                            referrerPolicy="no-referrer"
                            className="bg-purple-600 hover:bg-purple-700 text-white text-[9.5px] font-black px-3 py-2 rounded-xl shrink-0 transition-all uppercase tracking-wider"
                          >
                            Launch Meet
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SAVED JOBS BOOKMARKS LIST */}
                <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl shadow-xl space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                    <Heart size={13} className="text-rose-500" />
                    {lang === 'en' ? `Saved Jobs (${savedJobs.length})` : `የተቀመጡ ስራዎች (${savedJobs.length})`}
                  </h4>

                  {savedJobs.length === 0 ? (
                    <p className="text-[11px] text-zinc-500">You haven't bookmarked any listings yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      {savedJobs.map(jobId => {
                        const savedJobObj = jobs.find(j => j.id === jobId);
                        if (!savedJobObj) return null;
                        return (
                          <div 
                            key={jobId} 
                            onClick={() => setSelectedJob(savedJobObj)}
                            className="bg-zinc-900/50 hover:bg-zinc-900 p-2.5 rounded-2xl border border-zinc-850 flex justify-between items-center cursor-pointer transition-all"
                          >
                            <div className="text-[10.5px]">
                              <strong className="text-white text-xs block">{savedJobObj.title}</strong>
                              <span className="text-zinc-400 block mt-0.5">{savedJobObj.countryFlag} {savedJobObj.country} • {savedJobObj.salary}</span>
                            </div>
                            <button 
                              onClick={(e) => toggleSaveJob(jobId, e)}
                              className="text-rose-500 hover:text-zinc-400 p-1 rounded-lg"
                            >
                              <Heart size={12} fill="currentColor" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* NOTIFICATION FEED */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl shadow-xl space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bell size={13} className="text-amber-500 animate-swing" />
                  {lang === 'en' ? "Compliance Regulatory Inbox" : "የክብር የቁጥጥር መልዕክቶች"}
                </h4>

                {notifications.length === 0 ? (
                  <p className="text-[11px] text-zinc-500">Your notification center is clean.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div key={n.id} className="bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-850 text-[11px] space-y-1">
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
            </div>
          )}

          {/* SUB-TAB 3: SMART CV BUILDER */}
          {applicantTab === "smart_cv" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* EDITABLE FORM */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="border-b border-zinc-900 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    {lang === 'en' ? "Smart CV Builder & Analyzer" : "ዘመናዊ ሲቪ ማጠናቀቂያ"}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Every-zone auto-translates your experience to match Middle East and European visa parameters.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={cvData.fullName}
                      onChange={(e) => setCvData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Email</label>
                      <input 
                        type="text" 
                        value={cvData.email}
                        onChange={(e) => setCvData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Phone</label>
                      <input 
                        type="text" 
                        value={cvData.phone}
                        onChange={(e) => setCvData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Education History</label>
                    <textarea 
                      rows={2}
                      value={cvData.education}
                      onChange={(e) => setCvData(prev => ({ ...prev, education: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Experience & Placements</label>
                    <textarea 
                      rows={2}
                      value={cvData.experience}
                      onChange={(e) => setCvData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Skills (Comma separated)</label>
                      <input 
                        type="text" 
                        value={cvData.skills}
                        onChange={(e) => setCvData(prev => ({ ...prev, skills: e.target.value }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Languages Known</label>
                      <input 
                        type="text" 
                        value={cvData.languages}
                        onChange={(e) => setCvData(prev => ({ ...prev, languages: e.target.value }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1 font-extrabold uppercase">Certificates & Clearance Status</label>
                    <input 
                      type="text" 
                      value={cvData.certificates}
                      onChange={(e) => setCvData(prev => ({ ...prev, certificates: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-sans"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button 
                      onClick={() => {
                        setIsSavingCV(true);
                        setTimeout(() => {
                          setIsSavingCV(false);
                          showSuccess(lang === 'en' ? "Smart CV synchronized & database updated!" : "ዘመናዊ ሲቪ ተቀምጧል! ዝግጁ ነዎት።");
                        }, 1000);
                      }}
                      className="flex-1 bg-[#C5A059] text-stone-950 font-black py-2.5 rounded-2xl uppercase text-[10px] tracking-wider hover:opacity-90 transition-all cursor-pointer"
                    >
                      {isSavingCV ? "Syncing..." : "Sync Smart CV Profile"}
                    </button>
                    <button 
                      onClick={handleDownloadCV}
                      className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 p-2.5 rounded-2xl flex items-center justify-center cursor-pointer"
                      title="Download PDF Layout"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* REAL-TIME PREMIUM CV PREVIEW SHEET */}
              <div className="bg-white text-stone-950 p-6 rounded-3xl shadow-2xl relative border-2 border-stone-100 flex flex-col justify-between">
                <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Verified EveryZone Template
                </div>

                <div className="space-y-4">
                  {/* CV Header */}
                  <div className="border-b-2 border-stone-900 pb-3">
                    <h2 className="text-lg font-black text-stone-900 uppercase tracking-tight">{cvData.fullName || "Selamawit Tekle"}</h2>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-600 font-mono mt-1">
                      <div>📧 {cvData.email}</div>
                      <div>📞 {cvData.phone}</div>
                      <div>📍 {cvData.city}</div>
                      <div>🌍 Fayda Digital ID Verified ✅</div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-0.5">Professional Experience</h3>
                    <p className="text-[11px] text-stone-700 leading-relaxed font-sans">{cvData.experience || "Not defined yet."}</p>
                  </div>

                  {/* Education */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-0.5">Education & Vocational</h3>
                    <p className="text-[11px] text-stone-700 leading-relaxed font-sans">{cvData.education || "Not defined yet."}</p>
                  </div>

                  {/* Skills & languages */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-0.5">Core Strengths</h4>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {cvData.skills.split(",").map(sk => (
                          <span key={sk} className="bg-stone-100 px-2 py-0.5 rounded text-[9px] text-stone-700 font-mono">{sk.trim()}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-0.5">Languages</h4>
                      <p className="text-[10.5px] text-stone-700 font-sans mt-1">{cvData.languages}</p>
                    </div>
                  </div>

                  {/* Certification */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-0.5">Certificates & Licenses</h3>
                    <p className="text-[10.5px] text-stone-700 font-mono leading-relaxed">{cvData.certificates}</p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-[9px] text-stone-400 font-mono">
                  <span>Export Ref: EZ-CV-95420</span>
                  <span>Ministry of Labor Compliant</span>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: COUNTRIES REQUIREMENTS DIRECTORY */}
          {applicantTab === "countries" && (
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  {lang === 'en' ? "Global Placement Requirements & Salary Ranges" : "የውጭ ሀገራት የስራ ዝግጅት፣ ደመወዝ እና መስፈርቶች"}
                </h4>
                <p className="text-[10.5px] text-zinc-400 mt-1">
                  Choose a target country directly below to examine working conditions, legal limitations, and compliance guidelines verified by government audits.
                </p>
              </div>

              {/* COUNTRY SELECTOR CARD GRID */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {destinationCountriesData.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCountryObj(c)}
                    className={`p-4 rounded-3xl border text-center cursor-pointer transition-all ${
                      selectedCountryObj?.id === c.id 
                        ? "bg-amber-500/10 border-amber-500 text-amber-400 scale-[1.02]" 
                        : "bg-zinc-950 border-zinc-850 hover:bg-zinc-900 text-zinc-300"
                    }`}
                  >
                    <span className="text-4xl block mb-2 leading-none">{c.flag}</span>
                    <strong className="text-xs text-white block truncate">{lang === 'en' ? c.name : c.nameAm}</strong>
                    <span className="text-[10px] text-zinc-400 block mt-1 font-mono">{c.salary}</span>
                  </div>
                ))}
              </div>

              {/* DYNAMIC REQUIREMENTS INFO-BOARD */}
              {selectedCountryObj && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-950 border-2 border-amber-500/40 p-5 rounded-3xl shadow-2xl space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                    <span className="text-3xl">{selectedCountryObj.flag}</span>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase">{lang === 'en' ? selectedCountryObj.name : selectedCountryObj.nameAm}</h3>
                      <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Official Labor Framework</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-300">
                    <div className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-850">
                      <span className="text-zinc-500 uppercase tracking-wider text-[9px] block font-extrabold mb-1">💼 Employment Specs</span>
                      <div className="space-y-1 font-sans">
                        <div>• Salary range: <strong>{selectedCountryObj.salary}</strong></div>
                        <div>• Working hours: <strong>{selectedCountryObj.hours}</strong></div>
                        <div>• Contract length: <strong>{selectedCountryObj.contract}</strong></div>
                      </div>
                    </div>

                    <div className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-850">
                      <span className="text-zinc-500 uppercase tracking-wider text-[9px] block font-extrabold mb-1">🏠 Logistics & Welfare</span>
                      <div className="space-y-1 font-sans">
                        <div>• Housing accommodation: <strong>{selectedCountryObj.accommodation}</strong></div>
                        <div>• Food & meals: <strong>{selectedCountryObj.food}</strong></div>
                        <div>• Travel transport: <strong>{selectedCountryObj.transport}</strong></div>
                      </div>
                    </div>

                    <div className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-850">
                      <span className="text-zinc-500 uppercase tracking-wider text-[9px] block font-extrabold mb-1">📜 Visa Audit Checklist</span>
                      <p className="text-[10.5px] leading-relaxed text-zinc-400 font-sans">{selectedCountryObj.visaRequirements}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* SUB-TAB 5: AGENCIES DIRECTORY (SCAM AUDITING & RATINGS) */}
          {applicantTab === "agencies" && (
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl flex items-start gap-3">
                <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-zinc-300 leading-relaxed">
                  <strong>Strict Ministry of Labor Integration:</strong> All registered agencies are subject to periodic performance audits. Placing illegal upfront fee charges results in instant suspension.
                </div>
              </div>

              {/* AGENCY PROFILES LIST */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {registeredAgencies.map(ag => (
                  <div key={ag.id} className="bg-zinc-950 border border-zinc-850 p-4 rounded-3xl space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-lg">🏢</div>
                        {ag.verified ? (
                          <span className="bg-emerald-950 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
                            <Check size={9} /> Verified
                          </span>
                        ) : (
                          <span className="bg-amber-950 text-amber-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-amber-500/20">
                            Awaiting Audit
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-white">{ag.name}</h4>
                        <span className="text-[9px] text-zinc-500 block font-mono">License: {ag.license}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-zinc-400 border-t border-zinc-900 pt-2.5">
                        <div>
                          <strong className="text-white block text-[11px]">★ {ag.rating}</strong>
                          Rating
                        </div>
                        <div>
                          <strong className="text-white block text-[11px]">{ag.response}</strong>
                          Response
                        </div>
                        <div>
                          <strong className="text-white block text-[11px]">{ag.placements}</strong>
                          Placed
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 pt-3 border-t border-zinc-900 mt-2">
                      <button
                        onClick={() => {
                          setChatAgencyId(ag.id);
                          setApplicantTab("chat");
                        }}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-center py-2 rounded-xl text-[9.5px] font-black uppercase transition-all cursor-pointer"
                      >
                        💬 Chat Agency
                      </button>
                      <button
                        onClick={() => {
                          setScamAgencyId(ag.id);
                          showSuccess("Anti-Scam reporting form launched below.");
                        }}
                        className="bg-rose-950/20 hover:bg-rose-950 border border-rose-500/30 text-rose-300 px-3 py-2 rounded-xl text-[9.5px] font-bold uppercase transition-all"
                      >
                        🚨 Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PLACED WORKER REVIEWS CAROUSEL */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-3xl space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Placed Workers' Verified Reviews (ማጭበርበርን ለመቀነስ)
                </h4>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Every feedback entry below is verified through physical border exit logs to guarantee actual deployment feedback.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-52 overflow-y-auto pt-1">
                  {reviews.map(rev => (
                    <div key={rev.id} className="bg-zinc-900/40 p-3 rounded-2xl text-[11px] border border-zinc-850 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <strong className="text-white">{rev.userName}</strong>
                        <span className="text-amber-500 font-extrabold">{"★".repeat(rev.rating)}</span>
                      </div>
                      <p className="text-zinc-400 font-sans leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                {/* WRITE PLACEMENT REVIEW FORM */}
                <form onSubmit={handlePostReview} className="space-y-2 border-t border-zinc-900 pt-3">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-extrabold">Have you travelled with an agency? Share your experience</span>
                  <div className="flex gap-3 text-xs items-center">
                    <span className="text-zinc-400">Score Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setUserReviewRating(star)}
                          className={`text-sm ${star <= userReviewRating ? "text-amber-400" : "text-zinc-700"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userReviewComment}
                      onChange={(e) => setUserReviewComment(e.target.value)}
                      placeholder="Write deployment feedback, accommodation notes, salary accuracy..."
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                    <button 
                      type="submit"
                      className="bg-amber-500 text-zinc-950 font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider"
                    >
                      Post Audit review
                    </button>
                  </div>
                </form>
              </div>

              {/* ANTI-FRAUD REGULATORY REPORT FORM */}
              <div className="bg-rose-950/10 border border-rose-500/20 p-5 rounded-3xl space-y-3">
                <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-rose-400" />
                  Every-zone Anti-Fraud Enforcement Audit
                </h4>
                <p className="text-[10.5px] text-rose-300 leading-normal">
                  Everyzone maintains zero-tolerance for placement fraud. If any agency asks for illegal upfront payments or processes unapproved visas, file a complaint immediately. Suspected entities are restricted.
                </p>

                <form onSubmit={handleReportScam} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1 font-bold">Target Agency</label>
                    <input
                      type="text"
                      value={scamAgencyId}
                      onChange={(e) => setScamAgencyId(e.target.value)}
                      placeholder="e.g., Gigi Placements, Horn-of-Africa"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1 font-bold">Scam Detail Description</label>
                    <input
                      type="text"
                      value={scamDescription}
                      onChange={(e) => setScamDescription(e.target.value)}
                      placeholder="Describe what occurred (upfront payments, visa delay)..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    File Complaint
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SUB-TAB 6: DIRECT INTERACTIVE CHAT ROOM */}
          {applicantTab === "chat" && (
            <div className="bg-zinc-950 border border-zinc-800 p-1 rounded-3xl shadow-2xl flex flex-col md:flex-row h-[550px] overflow-hidden">
              {/* CHAT LEFT SIDEBAR (AGENCY SWITCHER) */}
              <div className="w-full md:w-64 bg-zinc-900/40 border-r border-zinc-900 p-3 flex flex-col gap-2 shrink-0">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold block px-1">Registered Agencies</span>
                {registeredAgencies.map(ag => (
                  <div
                    key={ag.id}
                    onClick={() => setChatAgencyId(ag.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${
                      chatAgencyId === ag.id 
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                        : "bg-zinc-950/40 border-transparent hover:bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    <div>
                      <strong className="text-xs text-white block truncate">{ag.name.split(" ")[0]} Placements</strong>
                      <span className="text-[9px] text-zinc-500 block font-mono">Response: {ag.response}</span>
                    </div>
                    {chatAgencyId === ag.id && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>}
                  </div>
                ))}
              </div>

              {/* CHAT MAIN MESSAGE BOX */}
              <div className="flex-1 flex flex-col h-full bg-zinc-950 justify-between">
                {/* CHAT HEADER */}
                <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-amber-500 border border-amber-500/20">🏢</div>
                    <div>
                      <h4 className="text-xs font-black text-white">{registeredAgencies.find(a => a.id === chatAgencyId)?.name}</h4>
                      <span className="text-[9px] text-zinc-400 font-mono">License Verified: {registeredAgencies.find(a => a.id === chatAgencyId)?.license}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[9px] text-zinc-500 uppercase font-mono">Live Session</span>
                  </div>
                </div>

                {/* MESSAGES VIEW CONTAINER */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, idx) => {
                    const isApplicant = msg.sender === "applicant";
                    return (
                      <div key={msg.id || idx} className={`flex ${isApplicant ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs p-3 rounded-2xl text-xs space-y-1 shadow-md ${
                          isApplicant 
                            ? "bg-[#C5A059] text-stone-950 font-medium rounded-tr-none" 
                            : "bg-zinc-900 text-zinc-100 rounded-tl-none border border-zinc-850"
                        }`}>
                          {msg.text && <p className="font-sans leading-relaxed">{msg.text}</p>}
                          {msg.image && (
                            <img src={msg.image} alt="Attachment" className="rounded-lg max-w-full h-32 object-cover border border-zinc-700" />
                          )}
                          {msg.docName && (
                            <div className="flex items-center gap-2 bg-zinc-950/30 p-2 rounded-xl text-[10px]">
                              <FileText size={14} className="text-red-400" />
                              <span>{msg.docName}</span>
                            </div>
                          )}
                          {msg.voiceDuration && (
                            <div className="flex items-center gap-2 text-[11px]">
                              <Mic size={14} className="animate-pulse" />
                              <div className="flex gap-0.5 items-center">
                                <span className="h-2 w-0.5 bg-current"></span>
                                <span className="h-4 w-0.5 bg-current"></span>
                                <span className="h-3 w-0.5 bg-current"></span>
                                <span className="h-5 w-0.5 bg-current"></span>
                                <span className="h-1 w-0.5 bg-current"></span>
                              </div>
                              <span className="font-mono text-[9px]">{msg.voiceDuration} Voice Note</span>
                            </div>
                          )}
                          <span className={`text-[8px] block text-right font-mono ${isApplicant ? "text-stone-800" : "text-zinc-500"}`}>{msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AUDIO RECORDING BANNER */}
                {isRecording && (
                  <div className="bg-amber-500/10 border-t border-amber-500/30 p-2.5 flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 text-xs text-amber-400">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                      <span>Recording Voice Memo (0:{(recordTime < 10 ? "0" : "") + recordTime})</span>
                    </div>
                    <button 
                      onClick={() => setIsRecording(false)}
                      className="text-[9px] text-zinc-400 uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* INPUT ZONE */}
                <div className="p-3 border-t border-zinc-900 bg-zinc-900/20 flex items-center gap-2">
                  <div className="flex gap-1">
                    {/* Simulated document attach */}
                    <button
                      onClick={() => {
                        const newMsg = {
                          id: Date.now().toString(),
                          sender: "applicant" as const,
                          docName: "Smart_CV_Selamawit.pdf",
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setChatMessages(prev => [...prev, newMsg]);
                        showSuccess("Smart CV document shared.");
                        simulateAgencyReply();
                      }}
                      className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
                      title="Attach Smart CV PDF"
                    >
                      <FileText size={14} />
                    </button>

                    {/* Simulated Image attach */}
                    <button
                      onClick={() => {
                        const newMsg = {
                          id: Date.now().toString(),
                          sender: "applicant" as const,
                          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setChatMessages(prev => [...prev, newMsg]);
                        showSuccess("Fayda ID Photo shared.");
                        simulateAgencyReply();
                      }}
                      className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
                      title="Attach Fayda ID Photo"
                    >
                      <Camera size={14} />
                    </button>

                    {/* Simulated Voice note */}
                    <button
                      onClick={toggleRecording}
                      className={`p-2.5 border rounded-xl transition-all ${
                        isRecording 
                          ? "bg-rose-600 border-rose-500 text-white animate-pulse" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                      title="Record Voice Message"
                    >
                      <Mic size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                    placeholder="Type Amharic/English message to agency audit desk..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-2.5 text-xs text-white focus:outline-none"
                  />

                  <button
                    onClick={handleSendMessage}
                    className="bg-[#C5A059] hover:opacity-90 text-stone-950 p-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          AGENCY CONTROL SYSTEM (CRM WORKSPACE)
          ========================================================================= */}
      {activeRole === "agency" && (
        <div className="space-y-4">
          {/* SESSIONS PICKER */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-3xl space-y-2 shadow-xl">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-extrabold block">Authorized Agency Identity</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentAgencyId("v7")}
                className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                  currentAgencyId === "v7"
                    ? "bg-amber-500/15 border-amber-500 text-amber-400 font-extrabold"
                    : "bg-zinc-900/60 border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Gigi International Placements (ጂጂ ወኪል)
              </button>
              <button
                onClick={() => setCurrentAgencyId("v8")}
                className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                  currentAgencyId === "v8"
                    ? "bg-amber-500/15 border-amber-500 text-amber-400 font-extrabold"
                    : "bg-zinc-900/60 border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                Horn-of-Africa Employment Co. (ቀንድ ኤጀንሲ)
              </button>
            </div>
          </div>

          {/* CRM NUMERICAL METRICS SUMMARY */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-2xl">
              <span className="text-[10px] text-zinc-500 block uppercase">Total Applicants</span>
              <strong className="text-xl text-white font-mono block mt-1">48 Candidates</strong>
              <span className="text-[9px] text-emerald-400 font-mono mt-1 block">▲ 14% this week</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-2xl">
              <span className="text-[10px] text-zinc-500 block uppercase">Active Jobs</span>
              <strong className="text-xl text-white font-mono block mt-1">
                {jobs.filter(j => j.agencyId === currentAgencyId).length} Vacancies
              </strong>
              <span className="text-[9px] text-zinc-500 font-mono mt-1 block">Ministry Certified</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-2xl">
              <span className="text-[10px] text-zinc-500 block uppercase">Pending Docs</span>
              <strong className="text-xl text-white font-mono block mt-1">3 Audits</strong>
              <span className="text-[9px] text-amber-400 font-mono mt-1 block">Fayda review queue</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-2xl">
              <span className="text-[10px] text-zinc-500 block uppercase">Interviews</span>
              <strong className="text-xl text-white font-mono block mt-1">5 Video Meets</strong>
              <span className="text-[9px] text-purple-400 font-mono mt-1 block">Scheduled on Google Meet</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-2xl">
              <span className="text-[10px] text-zinc-500 block uppercase">Response Rate</span>
              <strong className="text-xl text-white font-mono block mt-1">98.4%</strong>
              <span className="text-[9px] text-emerald-400 font-mono mt-1 block">Outstanding rating</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-2xl">
              <span className="text-[10px] text-zinc-500 block uppercase">Estimated Revenue</span>
              <strong className="text-xl text-white font-mono block mt-1">140,000 ETB</strong>
              <span className="text-[9px] text-zinc-500 font-mono mt-1 block">Secure Escrow Safe</span>
            </div>
          </div>

          {/* CRM ACTIVE APPLICANT TRAFFIC LEDGER CONTROL */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-3xl shadow-xl space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-amber-500" />
              Incoming Candidate Placement Files ({applications.filter(a => a.agencyId === currentAgencyId).length})
            </h4>

            {applications.filter(a => a.agencyId === currentAgencyId).length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-4">No active candidates in pipeline.</p>
            ) : (
              <div className="space-y-4">
                {applications.filter(a => a.agencyId === currentAgencyId).map(app => (
                  <div key={app.id} className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl space-y-4 text-xs">
                    <div className="flex justify-between items-start border-b border-zinc-900 pb-2.5">
                      <div>
                        <span className="text-[9px] text-amber-500 font-mono block">{app.id}</span>
                        <strong className="text-white text-sm block mt-0.5">{app.applicantName}</strong>
                        <span className="text-[10.5px] text-zinc-400">Position Applying: {app.jobTitle}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${getStageColor(app.stage)}`}>
                        {app.stage}
                      </span>
                    </div>

                    {/* COMPLIANCE ATTACHMENTS FOR SECURITY CHECK */}
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-red-400" />
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Biometric Passport</span>
                          <strong className="text-zinc-300 block truncate">{app.documents.passport || "Passport_Selamawit.pdf"}</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-emerald-400" />
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Smart CV Profile</span>
                          <strong className="text-zinc-300 block truncate">{app.documents.cv}</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-blue-400" />
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Fayda National ID</span>
                          <strong className="text-zinc-300 block text-[9.5px]">VERIFIED (Fayda Digital Integration) ✅</strong>
                        </div>
                      </div>
                    </div>

                    {/* CRM APPLICATION STEP PROMOTER */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Promote Applicant Courier Stage:</span>
                      
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleAdvanceStage(app.id, "Documents Verified")}
                          className={`px-2.5 py-1 rounded-lg border text-[9.5px] font-black transition-all ${
                            app.stage === "Documents Verified" ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          1. Verify Docs
                        </button>
                        <button
                          onClick={() => handleAdvanceStage(app.id, "Under Review")}
                          className={`px-2.5 py-1 rounded-lg border text-[9.5px] font-black transition-all ${
                            app.stage === "Under Review" ? "bg-yellow-600/20 border-yellow-500 text-yellow-400" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          2. Review Audit
                        </button>
                        <button
                          onClick={() => handleAdvanceStage(app.id, "Interview Scheduled")}
                          className={`px-2.5 py-1 rounded-lg border text-[9.5px] font-black transition-all ${
                            app.stage === "Interview Scheduled" ? "bg-purple-600/20 border-purple-500 text-purple-400" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          3. Set Interview
                        </button>
                        <button
                          onClick={() => handleAdvanceStage(app.id, "Accepted")}
                          className={`px-2.5 py-1 rounded-lg border text-[9.5px] font-black transition-all ${
                            app.stage === "Accepted" ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          4. Clear Medical (Accept)
                        </button>
                        <button
                          onClick={() => handleAdvanceStage(app.id, "Visa Processing")}
                          className={`px-2.5 py-1 rounded-lg border text-[9.5px] font-black transition-all ${
                            app.stage === "Visa Processing" ? "bg-indigo-600/20 border-indigo-500 text-indigo-400" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          5. Visa Submission
                        </button>
                        <button
                          onClick={() => handleAdvanceStage(app.id, "Travel Ready")}
                          className={`px-2.5 py-1 rounded-lg border text-[9.5px] font-black transition-all ${
                            app.stage === "Travel Ready" ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          6. Issue Flight Ticket
                        </button>
                        <button
                          onClick={() => handleAdvanceStage(app.id, "Completed")}
                          className={`px-2.5 py-1 rounded-lg border text-[9.5px] font-black transition-all ${
                            app.stage === "Completed" ? "bg-green-600/20 border-green-500 text-green-400" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          7. Complete Travel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PUBLISH NEW JOB FORM */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-3xl shadow-xl space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-[#C5A059]" />
              Publish Audited Vacancy Placement
            </h4>

            <form onSubmit={handleAgencyPublish} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 font-bold uppercase">Job Title</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g., Senior Baker / Pastry Supervisor"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 font-bold uppercase">Employer Company Name</label>
                  <input
                    type="text"
                    value={newJobEmployer}
                    onChange={(e) => setNewJobEmployer(e.target.value)}
                    placeholder="e.g., FIVE Resorts Dubai"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 font-bold uppercase">Destination Country</label>
                  <select
                    value={newJobCountry}
                    onChange={(e) => setNewJobCountry(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 focus:outline-none"
                  >
                    <option value="United Arab Emirates">Dubai / UAE 🇦🇪</option>
                    <option value="Poland">Poland 🇵🇱</option>
                    <option value="Germany">Germany 🇩🇪</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 font-bold uppercase">Job Sector</label>
                  <select
                    value={newJobCategory}
                    onChange={(e) => setNewJobCategory(e.target.value as JobCategory)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 focus:outline-none"
                  >
                    <option value="Hotel">Hotel & Catering</option>
                    <option value="Driver">Driver / Logistics</option>
                    <option value="Construction">Construction</option>
                    <option value="Nurse">Medical / Nurse</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 font-bold uppercase">Salary Scale</label>
                  <input
                    type="text"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    placeholder="e.g., 4,500 AED / month"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 font-bold uppercase">Working Hours</label>
                  <input
                    type="text"
                    value={newJobHours}
                    onChange={(e) => setNewJobHours(e.target.value)}
                    placeholder="e.g., 8 hours / day"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block mb-1 font-bold uppercase">Job Description & Accommodation Details</label>
                <textarea
                  rows={2}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Elaborate on candidate requirements, language expectations, housing arrangements..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C5A059] text-stone-950 font-black py-3 rounded-2xl text-[11px] uppercase tracking-wider transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                Launch Vacancy placement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SLIDE-UP DETAILED JOB VACANCY SHEET
          ========================================================================= */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs z-40"
            />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[90%] bg-zinc-950 border-t-2 border-[#C5A059] rounded-t-[32px] overflow-y-auto z-50 p-6 shadow-2xl flex flex-col space-y-4 text-zinc-100"
            >
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto shrink-0 mb-1"></div>

              {/* AGENCY SUMMARY HEADER */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest font-black block">
                    {selectedJob.agencyName}
                  </span>
                  <h2 className="text-base font-black text-white leading-snug">
                    {lang === 'en' ? selectedJob.title : (selectedJob.titleAm || selectedJob.title)}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-full font-bold flex items-center justify-center text-xs shrink-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* COVER PICTURE */}
              {selectedJob.photos?.[0] && (
                <div className="rounded-2xl overflow-hidden border border-zinc-850 shadow-md">
                  <img 
                    src={selectedJob.photos[0]} 
                    alt={selectedJob.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover" 
                  />
                </div>
              )}

              {/* DETAILED AGENCY METADATA BLOCK */}
              <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-850 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-base font-bold text-amber-500 border border-amber-500/20">
                    🏢
                  </div>
                  <div>
                    <strong className="text-xs text-white block">Agency Evaluation & Licensure</strong>
                    <span className="text-[10px] text-zinc-400">License: {selectedJob.agencyLicense} (Active License ✅)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-zinc-400 border-t border-zinc-800 pt-2.5">
                  <div>
                    <span className="block text-white font-extrabold text-[11px]">★ 4.9 / 5.0</span>
                    Rating
                  </div>
                  <div>
                    <span className="block text-white font-extrabold text-[11px]">&lt; 1 Hour</span>
                    Response
                  </div>
                  <div>
                    <span className="block text-white font-extrabold text-[11px]">2,450+</span>
                    Placed
                  </div>
                </div>
              </div>

              {/* VACANCY PARAMETERS */}
              <div className="space-y-4 text-xs text-zinc-300">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold">Employment Parameters</h4>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-3.5 rounded-2xl border border-zinc-850 font-sans">
                    <div>📍 Destination: <strong className="text-white">{selectedJob.country} ({selectedJob.city})</strong></div>
                    <div>💼 Sector: <strong className="text-white">{selectedJob.category}</strong></div>
                    <div>💰 Salary: <strong className="text-emerald-400 font-extrabold">{selectedJob.salary}</strong></div>
                    <div>⏱️ Contract: <strong className="text-white">{selectedJob.contractDuration}</strong></div>
                    <div>🏢 Employer: <strong className="text-zinc-300">{selectedJob.employer}</strong></div>
                    <div>🏠 Accommodation: <strong className="text-emerald-400">Included (ነፃ)</strong></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold">Detailed Contract Description</h4>
                  <p className="text-[11px] leading-relaxed text-zinc-400 font-sans">
                    {lang === 'en' ? selectedJob.description : (selectedJob.descriptionAm || selectedJob.description)}
                  </p>
                </div>

                <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-850 space-y-2">
                  <h4 className="text-[10px] text-amber-500 uppercase tracking-widest font-extrabold flex items-center gap-1">
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

              {/* PLACEMENT BUTTON */}
              <div className="pt-2">
                <button
                  onClick={() => { setApplyingJob(selectedJob); setSelectedJob(null); }}
                  className="w-full bg-[#C5A059] text-stone-950 hover:bg-[#C5A059]/95 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  📝 {lang === 'en' ? "Apply & Upload Documents" : "ሰነዶችን በመጫን አሁኑኑ ያመልክቱ"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =========================================================================
          APPLICATION FORM MODAL DIALOG
          ========================================================================= */}
      <AnimatePresence>
        {applyingJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setApplyingJob(null)}
              className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs z-50"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-[10%] left-4 right-4 max-h-[80%] bg-zinc-950 border-2 border-[#C5A059] rounded-3xl z-51 overflow-y-auto p-5 shadow-2xl space-y-4 text-zinc-100"
            >
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <div>
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest font-black block">Apply & Submit Credentials</span>
                  <h3 className="text-xs font-black text-white">{applyingJob.title}</h3>
                </div>
                <button 
                  onClick={() => setApplyingJob(null)}
                  className="w-6 h-6 bg-zinc-900 text-zinc-300 rounded-full font-bold flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="bg-amber-500/5 p-3 rounded-xl border border-dashed border-amber-500/30 flex items-center gap-2.5 text-[10px] text-zinc-300 leading-relaxed font-sans">
                <Lock size={16} className="text-amber-500 shrink-0" />
                <span>
                  <strong>Encrypted Transmission:</strong> Your Biometric passport and Fayda ID are securely locked. Only Ministry certified staff can inspect credentials.
                </span>
              </div>

              {/* SMART CV OPT-IN CHECKBOX */}
              <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-white block">Apply using EveryZone Smart CV</strong>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Use your live builder profile details to pre-fill credentials.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={useSmartCV} 
                  onChange={(e) => setUseSmartCV(e.target.checked)}
                  className="rounded text-amber-500 w-4 h-4 focus:ring-0"
                />
              </div>

              {/* UPLOAD PORTALS */}
              <div className="space-y-3.5 text-xs">
                {/* 1. Passport Upload */}
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold block">1. Biometric Passport (ማንነቱን የሚያረጋግጥ ፓስፖርት) *</label>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10.5px] text-zinc-400 font-mono">
                      {uploadedFiles.passport ? `✅ ${uploadedFiles.passport.name}` : "Passport_Verify_Pack.pdf"}
                    </span>
                    <label className="bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-stone-950 font-black px-2.5 py-1.5 rounded text-[9.5px] uppercase cursor-pointer transition-all">
                      {isUploading === "passport" ? "Uploading..." : "Upload File"}
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleSimulateUpload("passport", e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* 2. CV/Resume Upload (Manual if not opt-in) */}
                {!useSmartCV && (
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-bold block">2. Professional Curriculum Vitae (CV)</label>
                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
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
                )}

                {/* 3. Fayda Digital ID */}
                <div className="space-y-1">
                  <label className="text-zinc-400 block font-medium">3. Fayda National Digital ID (Auto-verified)</label>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* ACTION: FINAL SUBMIT */}
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
