export type ApplicationStage =
  | "Applied"
  | "Documents Verified"
  | "Under Review"
  | "Interview Scheduled"
  | "Accepted"
  | "Visa Processing"
  | "Travel Ready"
  | "Completed"
  | "Rejected";

export interface JobApplication {
  id: string; // unique tracking number
  jobId: string;
  jobTitle: string;
  agencyId: string;
  agencyName: string;
  applicantId: string; // user ID
  applicantName: string;
  stage: ApplicationStage;
  documents: {
    passport?: string;
    cv?: string;
    nationalId?: string;
    educationalCertificate?: string;
    experienceLetter?: string;
    medicalCertificate?: string;
    passportPhoto?: string;
    policeClearance?: string;
    other?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
