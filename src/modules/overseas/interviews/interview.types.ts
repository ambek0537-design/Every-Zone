export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  applicantId: string;
  agencyId: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  location?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  notes?: string;
  feedback?: string;
  createdAt: string;
}
