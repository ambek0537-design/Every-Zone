export type VendorStatus = "ACTIVE" | "UNDER_REVIEW" | "PENDING" | "SUSPENDED" | "BANNED";

export interface AuditLog {
  id: string;
  action: string;
  adminId: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: Date;
}
