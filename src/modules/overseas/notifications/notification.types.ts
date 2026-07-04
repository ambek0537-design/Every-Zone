export type OverseasNotificationType =
  | "Application Submitted"
  | "Document Approved"
  | "Interview Scheduled"
  | "Interview Reminder"
  | "Application Accepted"
  | "Application Rejected"
  | "Visa Ready"
  | "Travel Reminder";

export interface OverseasNotification {
  id: string;
  userId: string;
  type: OverseasNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
