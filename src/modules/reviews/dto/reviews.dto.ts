import { ReviewTargetType } from "../reviews/reviews";
import { ReportTargetType, ReportReason, EvidencePayload } from "../reports/reports";

export interface CreateReviewDto {
  targetType: ReviewTargetType;
  targetId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  photos?: string[];
  videos?: string[];
  isVerifiedPurchase?: boolean;
}

export interface UpdateReviewDto {
  rating?: number;
  text?: string;
  photos?: string[];
  videos?: string[];
}

export interface CreateReportDto {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  evidence: EvidencePayload;
}

export interface UpdateReportStatusDto {
  status: "PENDING" | "UNDER_REVIEW" | "ACTION_TAKEN" | "REJECTED" | "CLOSED";
  adminId: string;
  notes?: string;
  resolution?: string;
}

export interface CreateVendorReplyDto {
  reviewId: string;
  vendorId: string;
  replyText: string;
}
