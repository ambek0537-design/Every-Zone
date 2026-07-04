export interface AgencyVerification {
  governmentLicense: string;
  companyRegistration: string;
  officeAddress: string;
  businessPhone: string;
  responsibleManager: string;
  kycVerificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  monthlySubscriptionActive: boolean;
}

export interface Agency {
  id: string; // matches vendorId
  userId: string;
  companyName: string;
  logoUrl?: string;
  rating: number;
  followersCount: number;
  responseTime: string; // e.g., "Under 2 Hours"
  joinedSince: string; // e.g., "Jan 2025"
  isVerified: boolean;
  isSuspended: boolean;
  verification: AgencyVerification;
}
