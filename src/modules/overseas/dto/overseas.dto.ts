import { JobCategory } from "../jobs/job.types";
import { DocumentType } from "../documents/document.types";

export interface CreateJobDto {
  agencyId: string;
  category: JobCategory;
  title: string;
  titleAm?: string;
  employer: string;
  salary: string;
  salaryNum: number;
  contractDuration: string;
  accommodation: "Included" | "Not Included" | "Allowance Provided";
  foodIncluded: boolean;
  medicalInsurance: boolean;
  transportationIncluded: boolean;
  workingHours: string;
  deadline: string;
  country: string;
  city: string;
  requirements: {
    ageLimit?: string;
    gender?: "Male" | "Female" | "Any";
    education?: string;
    experience?: string;
    language?: string;
  };
  benefits?: string[];
  description: string;
  descriptionAm?: string;
  photos?: string[];
}

export interface UpdateJobDto {
  category?: JobCategory;
  title?: string;
  titleAm?: string;
  employer?: string;
  salary?: string;
  salaryNum?: number;
  contractDuration?: string;
  accommodation?: "Included" | "Not Included" | "Allowance Provided";
  foodIncluded?: boolean;
  medicalInsurance?: boolean;
  transportationIncluded?: boolean;
  workingHours?: string;
  deadline?: string;
  country?: string;
  city?: string;
  requirements?: {
    ageLimit?: string;
    gender?: "Male" | "Female" | "Any";
    education?: string;
    experience?: string;
    language?: string;
  };
  benefits?: string[];
  description?: string;
  descriptionAm?: string;
  photos?: string[];
  status?: "ACTIVE" | "SUSPENDED" | "EXPIRED" | "DRAFT";
}

export interface SubmitApplicationDto {
  jobId: string;
  applicantId: string;
  applicantName: string;
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
}

export interface ScheduleInterviewDto {
  applicationId: string;
  scheduledAt: string;
  durationMinutes?: number;
  meetingLink?: string;
  location?: string;
  notes?: string;
}

export interface UpdateApplicationStatusDto {
  status: "Applied" | "Documents Verified" | "Under Review" | "Interview Scheduled" | "Accepted" | "Visa Processing" | "Travel Ready" | "Completed" | "Rejected";
  notes?: string;
}

export interface CreateReviewDto {
  agencyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  photos?: string[];
}

export interface ReportFraudDto {
  reporterId: string;
  agencyId: string;
  jobId?: string;
  description: string;
}
