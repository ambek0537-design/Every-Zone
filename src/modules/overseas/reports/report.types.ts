export interface FraudReport {
  id: string;
  reporterId: string;
  agencyId: string;
  jobId?: string;
  description: string;
  status: "PENDING" | "UNDER_INVESTIGATION" | "RESOLVED" | "SUSPENDED";
  adminNotes?: string;
  createdAt: string;
}
