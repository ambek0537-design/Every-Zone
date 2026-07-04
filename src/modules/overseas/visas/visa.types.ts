export interface VisaTracking {
  id: string;
  applicationId: string;
  applicantId: string;
  country: string;
  visaType: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "ISSUED";
  visaNumber?: string;
  issuedAt?: string;
  expiresAt?: string;
  notes?: string;
  updatedAt: string;
}
