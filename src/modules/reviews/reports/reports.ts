export type ReportTargetType = "PRODUCT" | "VENDOR" | "HOUSE" | "AGENCY" | "SERVICE" | "USER";

export type ReportReason =
  | "FAKE_PRODUCT"
  | "SCAM"
  | "WRONG_PRICE"
  | "ABUSIVE_BEHAVIOUR"
  | "COUNTERFEIT"
  | "NO_DELIVERY"
  | "DUPLICATE_LISTING"
  | "FAKE_AGENCY"
  | "HARASSMENT"
  | "OTHER";

export interface EvidencePayload {
  screenshotUrl?: string;
  photoUrl?: string;
  videoUrl?: string;
  receiptUrl?: string;
  chatHistoryText?: string;
  description: string;
}

export interface FraudReport {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  evidence: EvidencePayload;
  status: "PENDING" | "UNDER_REVIEW" | "ACTION_TAKEN" | "REJECTED" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
}
