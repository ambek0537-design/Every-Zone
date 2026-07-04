import 'package:flutter/material.dart';

class Agency {
  final String id;
  final String name;
  final String logoUrl;
  final String coverUrl;
  final String licenseNumber;
  final int followers;
  final int completedPlacements;
  final double rating;
  final List<String> reviews;
  final String about;
  final List<String> policies;
  final List<String> branches;
  final String phoneNumber;
  final String email;
  final String location;
  final bool isVerified;
  final List<String> videos;
  final List<String> posts;

  const Agency({
    required this.id,
    required this.name,
    required this.logoUrl,
    required this.coverUrl,
    required this.licenseNumber,
    required this.followers,
    required this.completedPlacements,
    required this.rating,
    required this.reviews,
    required this.about,
    required this.policies,
    required this.branches,
    required this.phoneNumber,
    required this.email,
    required this.location,
    this.isVerified = true,
    required this.videos,
    required this.posts,
  });
}

class Job {
  final String id;
  final String title;
  final String company;
  final String companyLogo;
  final String country;
  final String countryFlag;
  final String salary;
  final String currency;
  final String category;
  final Agency agency;
  final String deadline;
  final String contractLength;
  final String workingHours;
  final String daysOff;
  final bool accommodation;
  final bool foodIncluded;
  final bool medicalInsurance;
  final bool visaIncluded;
  final bool airTicketIncluded;
  final List<String> requirements;
  final List<String> responsibilities;
  final List<String> documentsNeeded;
  final bool isAiRecommended;
  final String postedDate;

  const Job({
    required this.id,
    required this.title,
    required this.company,
    required this.companyLogo,
    required this.country,
    required this.countryFlag,
    required this.salary,
    required this.currency,
    required this.category,
    required this.agency,
    required this.deadline,
    required this.contractLength,
    required this.workingHours,
    required this.daysOff,
    required this.accommodation,
    required this.foodIncluded,
    required this.medicalInsurance,
    required this.visaIncluded,
    required this.airTicketIncluded,
    required this.requirements,
    required this.responsibilities,
    required this.documentsNeeded,
    this.isAiRecommended = false,
    required this.postedDate,
  });
}

class AppDocument {
  final String id;
  final String title;
  final String description;
  final String fileName;
  final String fileType; // PDF, Image, etc.
  final String uploadDate;
  final bool isVerified;

  AppDocument({
    required this.id,
    required this.title,
    required this.description,
    this.fileName = 'Not Uploaded',
    this.fileType = 'PDF',
    this.uploadDate = '--',
    this.isVerified = false,
  });

  AppDocument copyWith({
    String? fileName,
    String? fileType,
    String? uploadDate,
    bool? isVerified,
  }) {
    return AppDocument(
      id: id,
      title: title,
      description: description,
      fileName: fileName ?? this.fileName,
      fileType: fileType ?? this.fileType,
      uploadDate: uploadDate ?? this.uploadDate,
      isVerified: isVerified ?? this.isVerified,
    );
  }
}

class ApplicationStatusStep {
  final String status;
  final String date;
  final String description;
  final String notes;
  final bool isCompleted;

  const ApplicationStatusStep({
    required this.status,
    required this.date,
    required this.description,
    required this.notes,
    required this.isCompleted,
  });
}

class AppNotification {
  final String id;
  final String title;
  final String body;
  final String type; // success, info, warning, alert
  final DateTime timestamp;
  bool isRead;

  AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.timestamp,
    this.isRead = false,
  });
}

class OverseasState extends ChangeNotifier {
  static final OverseasState _instance = OverseasState._internal();
  factory OverseasState() => _instance;
  OverseasState._internal() {
    _initData();
  }

  final List<Job> _jobs = [];
  final List<Agency> _agencies = [];
  final List<AppNotification> _notifications = [];
  final List<AppDocument> _documents = [];
  final Set<String> _savedJobIds = {};
  
  // Tracks active application state
  Job? _activeApplyingJob;
  int _currentFlowStep = 0; // 0-based index for Steps 1-7
  
  // Tracking submitted applications
  final Map<String, List<ApplicationStatusStep>> _applications = {}; // jobId -> steps

  List<Job> get jobs => _jobs;
  List<Agency> get agencies => _agencies;
  List<AppNotification> get notifications => _notifications;
  List<AppDocument> get documents => _documents;
  Set<String> get savedJobIds => _savedJobIds;
  Job? get activeApplyingJob => _activeApplyingJob;
  int get currentFlowStep => _currentFlowStep;
  Map<String, List<ApplicationStatusStep>> get applications => _applications;

  void toggleSaveJob(String jobId) {
    if (_savedJobIds.contains(jobId)) {
      _savedJobIds.remove(jobId);
    } else {
      _savedJobIds.add(jobId);
    }
    notifyListeners();
  }

  void startApplication(Job job) {
    _activeApplyingJob = job;
    _currentFlowStep = 0;
    notifyListeners();
  }

  void setFlowStep(int step) {
    _currentFlowStep = step;
    notifyListeners();
  }

  void advanceFlowStep() {
    if (_currentFlowStep < 6) {
      _currentFlowStep++;
      notifyListeners();
    }
  }

  void previousFlowStep() {
    if (_currentFlowStep > 0) {
      _currentFlowStep--;
      notifyListeners();
    }
  }

  void uploadDocument(String docId, String name, String type) {
    final index = _documents.indexWhere((doc) => doc.id == docId);
    if (index != -1) {
      _documents[index] = _documents[index].copyWith(
        fileName: name,
        fileType: type,
        uploadDate: 'Today, ${DateTime.now().hour}:${DateTime.now().minute.toString().padLeft(2, '0')}',
        isVerified: true,
      );
      notifyListeners();
    }
  }

  void deleteDocument(String docId) {
    final index = _documents.indexWhere((doc) => doc.id == docId);
    if (index != -1) {
      _documents[index] = AppDocument(
        id: _documents[index].id,
        title: _documents[index].title,
        description: _documents[index].description,
        fileName: 'Not Uploaded',
        fileType: 'PDF',
        uploadDate: '--',
        isVerified: false,
      );
      notifyListeners();
    }
  }

  void completeApplication(String jobId) {
    final job = _jobs.firstWhere((j) => j.id == jobId);
    
    // Create status tracking for this job
    _applications[jobId] = [
      const ApplicationStatusStep(
        status: 'Submitted',
        date: 'Today',
        description: 'Application successfully transmitted to Every-zone gateway.',
        notes: 'Thank you for your application. Your profile check has cleared the system automatic gate.',
        isCompleted: true,
      ),
      const ApplicationStatusStep(
        status: 'Under Review',
        date: 'Pending',
        description: 'Agency is verifying matching qualifications.',
        notes: 'Your professional credentials are being checked against Saudi Labor Standards.',
        isCompleted: false,
      ),
      const ApplicationStatusStep(
        status: 'Interview',
        date: 'Pending',
        description: 'Virtual biometric video conference.',
        notes: 'A live Zoom session will be scheduled once the basic review closes.',
        isCompleted: false,
      ),
      const ApplicationStatusStep(
        status: 'Documents Verified',
        date: 'Pending',
        description: 'Embassy and Ministry of Labor clearances.',
        notes: 'Document bundle will be submitted to the Overseas Employment portal.',
        isCompleted: false,
      ),
      const ApplicationStatusStep(
        status: 'Visa Processing',
        date: 'Pending',
        description: 'Working Visa validation at destination consulate.',
        notes: 'Subject to medical fit clearance certification.',
        isCompleted: false,
      ),
      const ApplicationStatusStep(
        status: 'Ticket Ready',
        date: 'Pending',
        description: 'Airlines itinerary scheduling.',
        notes: 'Fly ticket sponsored by the employer under standard contract provisions.',
        isCompleted: false,
      ),
      const ApplicationStatusStep(
        status: 'Ready To Travel',
        date: 'Pending',
        description: 'Pre-departure orientation and briefing.',
        notes: 'Mandatory cultural training certificates will be dispatched.',
        isCompleted: false,
      ),
      const ApplicationStatusStep(
        status: 'Completed',
        date: 'Pending',
        description: 'Arrival and deployment check-in.',
        notes: 'Welcome check-in via the Every-zone Global Help desk.',
        isCompleted: false,
      ),
    ];

    // Add notification
    _notifications.insert(
      0,
      AppNotification(
        id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
        title: 'Application Transmitted',
        body: 'Your application for ${job.title} at ${job.company} was submitted successfully to ${job.agency.name}.',
        type: 'success',
        timestamp: DateTime.now(),
      ),
    );

    _activeApplyingJob = null;
    _currentFlowStep = 0;
    notifyListeners();
  }

  void markNotificationRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      _notifications[index].isRead = true;
      notifyListeners();
    }
  }

  void clearNotifications() {
    _notifications.clear();
    notifyListeners();
  }

  void _initData() {
    // Sample Agencies
    final agency1 = Agency(
      id: 'a1',
      name: 'Al-Burhan Premium Recruitment',
      logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=120',
      coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
      licenseNumber: 'LIG-ETH-2024-9981',
      followers: 12400,
      completedPlacements: 3500,
      rating: 4.9,
      reviews: [
        'Excellent service. They processed my visa to Riyadh in record time.',
        'Very supportive staff. Safe escrow payments and smooth travel.',
        'Certified agency. Highly recommend for medical personnel.'
      ],
      about: 'Al-Burhan is the premier agency for premium vetted Middle-East and European employment, registered legally under the Ministry of Labor and Skills of Ethiopia. We bridge qualified skilled professionals with luxury enterprises and high-tier medical institutions.',
      policies: [
        'Zero upfront placement fee policy.',
        'Verified contracts with guaranteed escrow backing.',
        '24/7 post-deployment emergency hotline.'
      ],
      branches: ['Addis Ababa (Bole Medhanialem)', 'Hawassa (Piazza)', 'Riyadh Office (Olaya District)'],
      phoneNumber: '+251 911 234 567',
      email: 'contact@alburhan.everyzone.com',
      location: 'Addis Ababa, Bole Road, Sheger Building 4th Floor',
      videos: ['https://assets.mixkit.co/videos/preview/mixkit-business-people-shaking-hands-32525-large.mp4'],
      posts: [
        'Great news! Over 150 nurses successfully deployed to UAE this month. Next batch screening starts Monday!',
        'Join our pre-departure briefing stream tonight at 7 PM Addis Time. Learn about Qatar housing guidelines.'
      ],
    );

    final agency2 = Agency(
      id: 'a2',
      name: 'Selam Global Placement',
      logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=120',
      coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
      licenseNumber: 'LIG-ETH-2025-4509',
      followers: 8900,
      completedPlacements: 1800,
      rating: 4.7,
      reviews: [
        'Helpful agents. Helped me with driver license translation for Dubai.',
        'Quick processing and transparent accommodation support.'
      ],
      about: 'Selam Global specializes in transport, hospitality, and heavy industry placement across Canada, Germany, and Arab Gulf countries. Committed to ethical labor practices and biometric security.',
      policies: [
        'Full health and medical coverage guaranteed pre-departure.',
        'Compliant with international labor laws (ILO verified).'
      ],
      branches: ['Addis Ababa (Megenagna)', 'Adama Branch (Posta Road)'],
      phoneNumber: '+251 922 456 789',
      email: 'info@selamglobal.com',
      location: 'Addis Ababa, Megenagna Tower, 8th Floor',
      videos: [],
      posts: [
        'Urgent opening for Heavy Duty Crane Operators in Germany and Poland. Apply today in the Document Vault!',
        'Check out our newly certified training labs for hospitality staff in Addis Ababa.'
      ],
    );

    _agencies.addAll([agency1, agency2]);

    // Sample Jobs
    _jobs.addAll([
      Job(
        id: 'j1',
        title: 'Certified Luxury Hotel Concierge',
        company: 'The Ritz-Carlton Riyadh',
        companyLogo: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=100',
        country: 'Saudi Arabia',
        countryFlag: '🇸🇦',
        salary: '1,800',
        currency: 'USD',
        category: 'Hotel',
        agency: agency1,
        deadline: '2026-08-15',
        contractLength: '2 Years (Renewable)',
        workingHours: '8 Hours / Day',
        daysOff: '1 Day / Week',
        accommodation: true,
        foodIncluded: true,
        medicalInsurance: true,
        visaIncluded: true,
        airTicketIncluded: true,
        isAiRecommended: true,
        postedDate: '2 hours ago',
        requirements: [
          'Excellent command of English language. Arabic is a major plus.',
          'Diploma/Degree in Hospitality or relevant vocational certificate.',
          'Minimum 1 year experience in high-end customer service or premium hotels.',
          'Clean biometric history and local police clearance.',
        ],
        responsibilities: [
          'Greet high-profile guests and manage premium cultural concierge desk requests.',
          'Coordinate with transport and luxury service providers.',
          'Maintain meticulous service standards according to Marriott corporate policies.'
        ],
        documentsNeeded: [
          'Valid Passport (Minimum 18 months validity)',
          'CV with Professional Headshot',
          'Educational Certificates / Diploma',
          'Biometric Medical Fit Report'
        ],
      ),
      Job(
        id: 'j2',
        title: 'Executive Clinical Nurse Specialist',
        company: 'King Hamad University Hospital',
        companyLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=100',
        country: 'Bahrain',
        countryFlag: '🇧🇭',
        salary: '2,400',
        currency: 'USD',
        category: 'Nurse',
        agency: agency1,
        deadline: '2026-07-20',
        contractLength: '3 Years (Renewable)',
        workingHours: '8 Hours / Day (Rotational Shifts)',
        daysOff: '2 Days / Week',
        accommodation: true,
        foodIncluded: false,
        medicalInsurance: true,
        visaIncluded: true,
        airTicketIncluded: true,
        isAiRecommended: true,
        postedDate: 'Yesterday',
        requirements: [
          'BSc Degree in Nursing from a recognized institution.',
          'Legally registered nurse with active license in Ethiopia.',
          'Minimum 3 years of clinical practice in emergency or general ward.',
          'Successful clearance of standard medical licensing exams.'
        ],
        responsibilities: [
          'Deliver expert clinical nursing care in high-dependency units.',
          'Collaborate with international medical staff for diagnostic procedures.',
          'Monitor safety codes and document patient recovery records meticulously.'
        ],
        documentsNeeded: [
          'Valid Passport',
          'Active Nursing License & Degree',
          'Comprehensive CV',
          'Police Clearance Certificate'
        ],
      ),
      Job(
        id: 'j3',
        title: 'Premium Logistics Driver (Heavy Truck)',
        company: 'Al-Futtaim Logistics',
        companyLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=100',
        country: 'UAE',
        countryFlag: '🇦🇪',
        salary: '1,500',
        currency: 'USD',
        category: 'Driver',
        agency: agency2,
        deadline: '2026-09-01',
        contractLength: '2 Years',
        workingHours: '10 Hours / Day (Overtime premium paid)',
        daysOff: '1 Day / Week',
        accommodation: true,
        foodIncluded: true,
        medicalInsurance: true,
        visaIncluded: true,
        airTicketIncluded: true,
        isAiRecommended: false,
        postedDate: '3 days ago',
        requirements: [
          'Valid Ethiopian heavy machinery or truck driving license (Class 4/5).',
          'Minimum 2 years experience driving multi-axle freight trucks.',
          'Basic communication skills in English.',
          'Ability to clear standard eye exams and physical fit evaluation.'
        ],
        responsibilities: [
          'Operate heavy logistics trucks on interstate express highways in the GCC.',
          'Ensure secure lashing of high-value freight cargo.',
          'Report electronic custom logs via the fleet telematics gateway.'
        ],
        documentsNeeded: [
          'Valid Passport',
          'Driving License (Original & Translated)',
          'CV',
          'Medical Clearance Document'
        ],
      ),
      Job(
        id: 'j4',
        title: 'Structural Construction Engineer',
        company: 'Vinci Construction Europe',
        companyLogo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=100',
        country: 'Europe',
        countryFlag: '🇪🇺',
        salary: '3,800',
        currency: 'EUR',
        category: 'Engineer',
        agency: agency2,
        deadline: '2026-08-30',
        contractLength: '2 Years',
        workingHours: '8 Hours / Day',
        daysOff: '2 Days / Week',
        accommodation: false,
        foodIncluded: false,
        medicalInsurance: true,
        visaIncluded: true,
        airTicketIncluded: true,
        isAiRecommended: true,
        postedDate: '5 days ago',
        requirements: [
          'BSc in Civil or Structural Engineering.',
          'Minimum 4 years active engineering experience in high-rise structures.',
          'Familiarity with Eurocodes and standard CAD/BIM software suite.',
          'English proficiency required. German language is a significant benefit.'
        ],
        responsibilities: [
          'Oversee structural integrity parameters on-site.',
          'Enforce strict European health and safety regulations (HSE).',
          'Verify quality control records of standard concrete pours and steel framing.'
        ],
        documentsNeeded: [
          'Valid Passport',
          'Engineering Degree & Transcripts',
          'IELTS/Language Scorecard',
          'Work Reference Letters'
        ],
      ),
      Job(
        id: 'j5',
        title: 'High-Sec Airport Terminal Officer',
        company: 'Securitas Middle East',
        companyLogo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=100',
        country: 'Qatar',
        countryFlag: '🇶🇦',
        salary: '1,400',
        currency: 'USD',
        category: 'Security',
        agency: agency1,
        deadline: '2026-07-28',
        contractLength: '2 Years',
        workingHours: '8 Hours / Day',
        daysOff: '1 Day / Week',
        accommodation: true,
        foodIncluded: true,
        medicalInsurance: true,
        visaIncluded: true,
        airTicketIncluded: true,
        isAiRecommended: false,
        postedDate: '6 days ago',
        requirements: [
          'Completed secondary high school or vocational security academy.',
          'Excellent physical condition (Height minimum 175cm for male, 162cm for female).',
          'Basic security protocol certifications or military background is preferred.',
          'Excellent English speaking abilities.'
        ],
        responsibilities: [
          'Conduct passenger screening and premium metal-detection procedures.',
          'Patrol airport terminals and handle secure luggage scanner monitors.',
          'Report security alerts immediately to civil aviation authorities.'
        ],
        documentsNeeded: [
          'Valid Passport',
          'High School Certificate',
          'CV',
          'Active Police Clearance (No record certificate)'
        ],
      )
    ]);

    // Initial Notifications
    _notifications.addAll([
      AppNotification(
        id: 'n1',
        title: 'Visa Application Approved',
        body: 'Congratulations! Your premium work visa for Saudi Arabia Ritz-Carlton has been stamped. Travel date upcoming.',
        type: 'success',
        timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      ),
      AppNotification(
        id: 'n2',
        title: 'Interview Scheduled',
        body: 'Al-Burhan Agency scheduled your live audio-visual interview for the Clinical Nurse post. Date: July 10, 10 AM.',
        type: 'info',
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
      ),
      AppNotification(
        id: 'n3',
        title: 'Medical Clearance Needed',
        body: 'Urgent: Please upload your certified biometric blood report to the Document Vault to advance to visa phase.',
        type: 'warning',
        timestamp: DateTime.now().subtract(const Duration(days: 3)),
      ),
      AppNotification(
        id: 'n4',
        title: 'Passport Expiring Notice',
        body: 'Attention: Your registered passport has less than 8 months of remaining validity. Please renew before visa stamping.',
        type: 'alert',
        timestamp: DateTime.now().subtract(const Duration(days: 5)),
      ),
    ]);

    // Initial Vault Documents
    _documents.addAll([
      AppDocument(
        id: 'doc_passport',
        title: 'Valid International Passport',
        description: 'First page showing scan of photo, biometric details, and signature.',
        fileName: 'Habtamu_Passport_Scan_2026.pdf',
        fileType: 'PDF',
        uploadDate: 'June 12, 2026',
        isVerified: true,
      ),
      AppDocument(
        id: 'doc_cv',
        title: 'Curriculum Vitae (CV)',
        description: 'Comprehensive resume containing contact details, work experience, and diplomas.',
        fileName: 'Habtamu_Hospitality_Resume.pdf',
        fileType: 'PDF',
        uploadDate: 'June 15, 2026',
        isVerified: true,
      ),
      AppDocument(
        id: 'doc_education',
        title: 'Educational Degree / Diploma',
        description: 'High school graduation diploma or university BSc certificate.',
        fileName: 'Hotel_Vocational_Diploma.pdf',
        fileType: 'PDF',
        uploadDate: 'June 18, 2026',
        isVerified: true,
      ),
      AppDocument(
        id: 'doc_certs',
        title: 'Specialty Training Certificates',
        description: 'HSE certificates, language proficiency cards, or vocational badges.',
        fileName: 'Not Uploaded',
        isVerified: false,
      ),
      AppDocument(
        id: 'doc_medical',
        title: 'Biometric Medical Certificate',
        description: 'Approved health certificate verifying physical fit from certified clinics.',
        fileName: 'GAMCA_Medical_Cleared.pdf',
        fileType: 'PDF',
        uploadDate: 'Yesterday',
        isVerified: true,
      ),
      AppDocument(
        id: 'doc_police',
        title: 'Police Clearance Certificate',
        description: 'Official document from Federal Police verifying clean criminal record.',
        fileName: 'Not Uploaded',
        isVerified: false,
      ),
      AppDocument(
        id: 'doc_visa',
        title: 'Visa Stamping Copy',
        description: 'Embassy approved e-visa printout copy.',
        fileName: 'Not Uploaded',
        isVerified: false,
      ),
      AppDocument(
        id: 'doc_flight',
        title: 'Flight Itinerary Ticket',
        description: 'Electronic passenger travel voucher.',
        fileName: 'Not Uploaded',
        isVerified: false,
      ),
    ]);
  }
}
