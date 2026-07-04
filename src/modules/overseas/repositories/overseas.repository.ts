import { Job, JobCategory } from "../jobs/job.types";
import { JobApplication, ApplicationStage } from "../applications/application.types";
import { Interview } from "../interviews/interview.types";
import { OverseasReview } from "../reviews/review.types";
import { FraudReport } from "../reports/report.types";
import { OverseasNotification } from "../notifications/notification.types";
import { CreateJobDto, UpdateJobDto, SubmitApplicationDto, ScheduleInterviewDto, CreateReviewDto, ReportFraudDto } from "../dto/overseas.dto";

// Central In-Memory Store for Overseas module
export const overseasStore = {
  jobs: [
    {
      id: "l7",
      agencyId: "v7",
      agencyName: "Gigi International Placements (ጂጂ ወኪል)",
      agencyLogo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
      agencyLicense: "MEA-2026-64120",
      isAgencyVerified: true,
      country: "United Arab Emirates",
      countryFlag: "🇦🇪",
      city: "Dubai Marina",
      category: "Hotel" as JobCategory,
      title: "Executive Pastry Chef - Luxury Dubai Resort",
      titleAm: "የምግብ አበሳሰል ባለሙያ (ሼፍ) - ዱባይ ሪዞርት",
      employer: "FIVE Beachfront Marina Resort",
      salary: "4,500 AED/mo",
      salaryNum: 125000,
      contractDuration: "2 Years",
      accommodation: "Included" as const,
      foodIncluded: true,
      medicalInsurance: true,
      transportationIncluded: true,
      workingHours: "8 hrs/day (Split Shifts)",
      deadline: "2026-08-15",
      requirements: {
        ageLimit: "22 - 40",
        gender: "Any" as const,
        education: "Hospitality Certificate",
        experience: "3+ Years",
        language: "English"
      },
      benefits: ["Paid annual ticket", "Daily meals at resort staff lounge", "Tips share", "Uniform laundry"],
      description: "Specialized opening for a certified pastry supervisor or master chef in a renowned FIVE-STAR beachfront resort. Agency Gigi coordinates full legal workflow, medical checks, flights and housing.",
      descriptionAm: "በዱባይ ሪዞርት ውስጥ ለረጅም ጊዜ የሚቆይ የስራ እድል። የህክምና ምርመራ፣ የአውሮፕላን ትኬት እና የመኖሪያ ቤት በኤጀንሲው ሙሉ በሙሉ ይሸፈናል።",
      photos: ["https://images.unsplash.com/photo-1521737711867-e3b90473bd58?auto=format&fit=crop&q=80&w=600"],
      status: "ACTIVE" as const,
      createdAt: new Date().toISOString()
    },
    {
      id: "l7_dubai_driver",
      agencyId: "v7",
      agencyName: "Gigi International Placements (ጂጂ ወኪል)",
      agencyLogo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
      agencyLicense: "MEA-2026-64120",
      isAgencyVerified: true,
      country: "United Arab Emirates",
      countryFlag: "🇦🇪",
      city: "Deira, Dubai",
      category: "Driver" as JobCategory,
      title: "Light & Heavy Duty Driver Job in Dubai (United Arab Emirates)",
      titleAm: "የቀላል እና ከባድ መኪና አሽከርካሪ ስራ በዱባይ",
      employer: "Al-Maktoum Logistics & Courier Fleet",
      salary: "3,800 AED/mo",
      salaryNum: 105000,
      contractDuration: "2 Years",
      accommodation: "Included" as const,
      foodIncluded: true,
      medicalInsurance: true,
      transportationIncluded: true,
      workingHours: "9 hrs/day",
      deadline: "2026-09-01",
      requirements: {
        ageLimit: "25 - 45",
        gender: "Male" as const,
        education: "High School",
        experience: "2 Years driving experience",
        language: "Arabic or English"
      },
      benefits: ["Driving license upgrade fee fully paid", "Overtime allowance", "Annual return ticket"],
      description: "Premier delivery coordinator post with visa, air ticket, driving badge training, and full medical coverage sponsored by local logistics firm. Gigi agency prepares documents quickly.",
      descriptionAm: "በዱባይ ከተማ ውስጥ የሚሰራ የአሽከርካሪነት ስራ። መኖሪያ ቤት፣ የህክምና እና የአሸከርካሪነት ፈቃድ ስልጠና በድርጅቱ በኩል ይሸፈናል።",
      photos: ["https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600"],
      status: "ACTIVE" as const,
      createdAt: new Date().toISOString()
    },
    {
      id: "l8",
      agencyId: "v8",
      agencyName: "Horn-of-Africa Employment Co. (ቀንድ ኤጀንሲ)",
      agencyLogo: "",
      agencyLicense: "MEA-2026-11002",
      isAgencyVerified: true,
      country: "Poland",
      countryFlag: "🇵🇱",
      city: "Warsaw",
      category: "Construction" as JobCategory,
      title: "Senior Construction Site Supervisor - Warsaw",
      titleAm: "የግንባታ ሳይት ከፍተኛ ተቆጣጣሪ - ዋርሶ፣ ፖላንድ",
      employer: "Mostostal Warszawa S.A.",
      salary: "2,200 EUR/mo",
      salaryNum: 250000,
      contractDuration: "2 Years",
      accommodation: "Included" as const,
      foodIncluded: false,
      medicalInsurance: true,
      transportationIncluded: true,
      workingHours: "8 hrs/day",
      deadline: "2026-07-30",
      requirements: {
        ageLimit: "28 - 50",
        gender: "Any" as const,
        education: "Civil Engineering Degree",
        experience: "5+ Years",
        language: "English"
      },
      benefits: ["EU Blue Card route eligibility", "Relocation package", "Annual leave 24 days", "Social Security"],
      description: "Urgent placement for heavy concrete construction supervisors to coordinates highrise residential building sectors. EU work-permit sponsorship and legal transition expedited directly in Addis Ababa.",
      descriptionAm: "ለዋርሶው ሪል እስቴት ግንባታ ባለሙያዎችን የምንቀጥርበት። ሙሉ ህጋዊ የስራ ቪዛ ድጋፍ በ Addis Ababa በኩል የሚመረቱ።",
      photos: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600"],
      status: "ACTIVE" as const,
      createdAt: new Date().toISOString()
    },
    {
      id: "l9",
      agencyId: "v8",
      agencyName: "Horn-of-Africa Employment Co. (ቀንድ ኤጀንሲ)",
      agencyLogo: "",
      agencyLicense: "MEA-2026-11002",
      isAgencyVerified: true,
      country: "Germany",
      countryFlag: "🇩🇪",
      city: "Frankfurt",
      category: "Nurse" as JobCategory,
      title: "Geriatric Caregiver & Assistant Nurse",
      titleAm: "የአረጋውያን እንክብካቤ ረዳት ነርስ - ጀርመን",
      employer: "Klinikum Frankfurt Care Network",
      salary: "2,600 EUR/mo",
      salaryNum: 295000,
      contractDuration: "3 Years",
      accommodation: "Allowance Provided" as const,
      foodIncluded: false,
      medicalInsurance: true,
      transportationIncluded: true,
      workingHours: "7.5 hrs/day",
      deadline: "2026-10-15",
      requirements: {
        ageLimit: "21 - 45",
        gender: "Any" as const,
        education: "Nursing Diploma / Degree",
        experience: "1+ Year",
        language: "German B1/B2 (Paid course provided)"
      },
      benefits: ["Language training allowance", "13th month salary", "Full German pension track", "Subsidized meals"],
      description: "Premium recruitment track for certified nursing assistants in Frankfurt. Excellent career advancement with official recognition program supported by German state board.",
      descriptionAm: "በጀርመን አገር የነርሲንግ ሙያ ላላቸው ባለሙያዎች የተዘጋጀ የቅጥር ትራክ። የቋንቋ ስልጠና እና የስራ ፈቃድ በኤጀንሲው በኩል ይመቻቻል።",
      photos: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"],
      status: "ACTIVE" as const,
      createdAt: new Date().toISOString()
    }
  ] as Job[],

  applications: [
    {
      id: "APP-59420-1",
      jobId: "l7",
      jobTitle: "Executive Pastry Chef - Luxury Dubai Resort",
      agencyId: "v7",
      agencyName: "Gigi International Placements (ጂጂ ወኪል)",
      applicantId: "u-2",
      applicantName: "Selamawit Tekle",
      stage: "Interview Scheduled" as ApplicationStage,
      documents: {
        passport: "Passport_Selamawit_Verified.pdf",
        cv: "CV_MasterPastryChef_Selamawit.pdf",
        nationalId: "Fayda_ID_Selamawit.png"
      },
      notes: "Excited to join the team in Dubai Marina. I have attached my 3 years pastry certificate.",
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    }
  ] as JobApplication[],

  interviews: [
    {
      id: "INT-84910",
      applicationId: "APP-59420-1",
      jobId: "l7",
      applicantId: "u-2",
      agencyId: "v7",
      scheduledAt: new Date(Date.now() + 3600000 * 24 * 2).toISOString(), // 2 days from now
      durationMinutes: 30,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      location: "Online Video Panel",
      status: "SCHEDULED" as const,
      notes: "Technical pastry and plating portfolio interview with FIVE Marina executive chef.",
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    }
  ] as Interview[],

  reviews: [
    {
      id: "REV-90123",
      agencyId: "v7",
      userId: "u-2",
      userName: "Selamawit Tekle",
      rating: 5,
      comment: "Gigi Placements is exceptionally fast and transparent. They verified my Fayda ID, helped with passport authentication, and Scheduled my interview under 4 days!",
      photos: [],
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString()
    }
  ] as OverseasReview[],

  fraudReports: [] as FraudReport[],

  notifications: [] as OverseasNotification[],

  // Store suspended status of agencies
  suspendedAgencies: new Set<string>()
};

export class OverseasRepository {
  private generateId(prefix: string): string {
    return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  // --- JOB CRUD ---
  async getJobs(filters: any = {}): Promise<Job[]> {
    let result = [...overseasStore.jobs];

    // Filter out jobs from suspended agencies
    result = result.filter(job => !overseasStore.suspendedAgencies.has(job.agencyId));

    if (filters.verifiedAgenciesOnly === "true" || filters.verifiedAgenciesOnly === true) {
      result = result.filter(job => job.isAgencyVerified);
    }

    if (filters.country) {
      result = result.filter(job => job.country.toLowerCase().includes(filters.country.toLowerCase()));
    }

    if (filters.city) {
      result = result.filter(job => job.city.toLowerCase().includes(filters.city.toLowerCase()));
    }

    if (filters.category) {
      result = result.filter(job => job.category === filters.category);
    }

    if (filters.gender && filters.gender !== "Any") {
      result = result.filter(job => job.requirements.gender === filters.gender || job.requirements.gender === "Any");
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(q) || 
        (job.titleAm && job.titleAm.toLowerCase().includes(q)) ||
        job.employer.toLowerCase().includes(q) ||
        job.agencyName.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q)
      );
    }

    return result;
  }

  async getJobById(id: string): Promise<Job | null> {
    const job = overseasStore.jobs.find(j => j.id === id);
    if (!job || overseasStore.suspendedAgencies.has(job.agencyId)) {
      return null;
    }
    return job;
  }

  async createJob(dto: CreateJobDto, agencyDetails: { name: string; license: string; verified: boolean }): Promise<Job> {
    const newJob: Job = {
      id: this.generateId("JOB"),
      agencyId: dto.agencyId,
      agencyName: agencyDetails.name,
      agencyLicense: agencyDetails.license,
      isAgencyVerified: agencyDetails.verified,
      country: dto.country,
      category: dto.category,
      title: dto.title,
      titleAm: dto.titleAm,
      employer: dto.employer,
      salary: dto.salary,
      salaryNum: dto.salaryNum,
      contractDuration: dto.contractDuration,
      accommodation: dto.accommodation,
      foodIncluded: dto.foodIncluded,
      medicalInsurance: dto.medicalInsurance,
      transportationIncluded: dto.transportationIncluded,
      workingHours: dto.workingHours,
      deadline: dto.deadline,
      city: dto.city,
      requirements: dto.requirements,
      benefits: dto.benefits || [],
      description: dto.description,
      descriptionAm: dto.descriptionAm,
      photos: dto.photos || [],
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    overseasStore.jobs.unshift(newJob);
    return newJob;
  }

  async updateJob(id: string, dto: UpdateJobDto): Promise<Job | null> {
    const index = overseasStore.jobs.findIndex(j => j.id === id);
    if (index === -1) return null;

    const existing = overseasStore.jobs[index];
    const updated: Job = {
      ...existing,
      ...dto,
      requirements: {
        ...existing.requirements,
        ...dto.requirements
      }
    };

    overseasStore.jobs[index] = updated;
    return updated;
  }

  async deleteJob(id: string): Promise<boolean> {
    const index = overseasStore.jobs.findIndex(j => j.id === id);
    if (index === -1) return false;
    overseasStore.jobs.splice(index, 1);
    return true;
  }

  // --- APPLICATION OPERATIONS ---
  async createApplication(dto: SubmitApplicationDto, jobDetails: Job): Promise<JobApplication> {
    const trackingNumber = `APP-${Math.floor(10000 + Math.random() * 90000)}-${Date.now().toString().slice(-1)}`;
    const newApp: JobApplication = {
      id: trackingNumber,
      jobId: dto.jobId,
      jobTitle: jobDetails.title,
      agencyId: jobDetails.agencyId,
      agencyName: jobDetails.agencyName,
      applicantId: dto.applicantId,
      applicantName: dto.applicantName,
      stage: "Applied",
      documents: dto.documents,
      notes: dto.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    overseasStore.applications.unshift(newApp);

    // Create a matching notification for applicant
    this.createNotification({
      userId: dto.applicantId,
      type: "Application Submitted",
      title: "ተአማኝ የውጭ ስራ ማመልከቻ ገብቷል / Application Submitted",
      message: `Your application for "${jobDetails.title}" with unique tracking ID: ${trackingNumber} has been successfully logged with ${jobDetails.agencyName}.`
    });

    return newApp;
  }

  async getApplicationsForApplicant(userId: string): Promise<JobApplication[]> {
    return overseasStore.applications.filter(app => app.applicantId === userId);
  }

  async getApplicationsForAgency(agencyId: string): Promise<JobApplication[]> {
    return overseasStore.applications.filter(app => app.agencyId === agencyId);
  }

  async updateApplicationStage(id: string, stage: ApplicationStage): Promise<JobApplication | null> {
    const app = overseasStore.applications.find(a => a.id === id);
    if (!app) return null;

    app.stage = stage;
    app.updatedAt = new Date().toISOString();

    // Map stages to corresponding Notification titles/messages
    let notifType: any = "Under Review";
    let title = "ማመልከቻዎ በምልከታ ላይ ነው / Application Under Review";
    let msg = `Your application ${app.id} is now under review by our screening team.`;

    if (stage === "Documents Verified") {
      notifType = "Document Approved";
      title = "ሰነዶችዎ ተረጋግጠዋል / Documents Verified";
      msg = `Excellent news! All submitted compliance certificates & Fayda credentials for tracking ID ${app.id} have been fully approved.`;
    } else if (stage === "Interview Scheduled") {
      notifType = "Interview Scheduled";
      title = "የቃለ-መጠይቅ ቀጠሮ ተይዟል / Interview Scheduled";
      msg = `An official interview session has been configured for your application ${app.id}. Check your interview portal dashboard.`;
    } else if (stage === "Accepted") {
      notifType = "Application Accepted";
      title = "እንኳን ደስ አሰኘዎት የስራ ቅጥር ተቀብለዋል / Application Accepted";
      msg = `Congratulations! You have been officially accepted for "${app.jobTitle}". Travel readiness preparations will begin shortly.`;
    } else if (stage === "Visa Processing") {
      notifType = "Visa Ready";
      title = "የቪዛ ስራ ተጀምሯል / Visa Processing Initiated";
      msg = `The agency has submitted your cryptographic contract to the Ministry for visa issuance under tracking ID ${app.id}.`;
    } else if (stage === "Travel Ready") {
      notifType = "Travel Reminder";
      title = "የጉዞ ዝግጅት ተጠናቋል / Travel Ready & Flight Details";
      msg = `Your visa, security clearances, and air tickets are secured. Safe travels! Let us keep the app updated.`;
    } else if (stage === "Rejected") {
      notifType = "Application Rejected";
      title = "ማመልከቻ ውድቅ ሆኗል / Application Status Update";
      msg = `The agency has completed evaluation of application ${app.id} and has chosen to proceed with other candidates.`;
    }

    this.createNotification({
      userId: app.applicantId,
      type: notifType,
      title,
      message: msg
    });

    return app;
  }

  // --- INTERVIEWS ---
  async scheduleInterview(dto: ScheduleInterviewDto, appDetails: JobApplication): Promise<Interview> {
    const interviewId = this.generateId("INT");
    const newInterview: Interview = {
      id: interviewId,
      applicationId: dto.applicationId,
      jobId: appDetails.jobId,
      applicantId: appDetails.applicantId,
      agencyId: appDetails.agencyId,
      scheduledAt: dto.scheduledAt,
      durationMinutes: dto.durationMinutes || 30,
      meetingLink: dto.meetingLink || "https://meet.google.com/abc-defg-hij",
      location: dto.location || "Virtual Video Link",
      status: "SCHEDULED",
      notes: dto.notes,
      createdAt: new Date().toISOString()
    };

    overseasStore.interviews.unshift(newInterview);

    // Update application stage automatically as per rules
    await this.updateApplicationStage(dto.applicationId, "Interview Scheduled");

    return newInterview;
  }

  async getInterviewsForApplicant(userId: string): Promise<Interview[]> {
    return overseasStore.interviews.filter(i => i.applicantId === userId);
  }

  async getInterviewsForAgency(agencyId: string): Promise<Interview[]> {
    return overseasStore.interviews.filter(i => i.agencyId === agencyId);
  }

  // --- REVIEWS ---
  async createReview(dto: CreateReviewDto): Promise<OverseasReview> {
    const newReview: OverseasReview = {
      id: this.generateId("REV"),
      agencyId: dto.agencyId,
      userId: dto.userId,
      userName: dto.userName,
      rating: dto.rating,
      comment: dto.comment,
      photos: dto.photos || [],
      createdAt: new Date().toISOString()
    };

    overseasStore.reviews.unshift(newReview);
    return newReview;
  }

  async getReviewsForAgency(agencyId: string): Promise<OverseasReview[]> {
    return overseasStore.reviews.filter(r => r.agencyId === agencyId);
  }

  // --- FRAUD REPORTING & ANTI-FRAUD CONTROL ---
  async reportFraud(dto: ReportFraudDto): Promise<FraudReport> {
    const newReport: FraudReport = {
      id: this.generateId("REP"),
      reporterId: dto.reporterId,
      agencyId: dto.agencyId,
      jobId: dto.jobId,
      description: dto.description,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    overseasStore.fraudReports.unshift(newReport);
    return newReport;
  }

  async suspendAgency(agencyId: string): Promise<boolean> {
    overseasStore.suspendedAgencies.add(agencyId);
    
    // Suspend all active jobs by this agency as per Anti-Fraud: "Hidden Fake Jobs"
    overseasStore.jobs.forEach(job => {
      if (job.agencyId === agencyId) {
        job.status = "SUSPENDED";
      }
    });

    return true;
  }

  // --- NOTIFICATIONS ---
  private createNotification(params: { userId: string; type: any; title: string; message: string }): OverseasNotification {
    const newNotif: OverseasNotification = {
      id: this.generateId("NTF"),
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    overseasStore.notifications.unshift(newNotif);
    return newNotif;
  }

  async getNotifications(userId: string): Promise<OverseasNotification[]> {
    return overseasStore.notifications.filter(n => n.userId === userId);
  }
}
