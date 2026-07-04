// Returns definitions and return policy constraints
export interface ReturnRequestSummary {
  id: string;
  orderId: string;
  reason: string;
  description?: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: Date;
}

export const RETURN_POLICY_DAYS = 7;
