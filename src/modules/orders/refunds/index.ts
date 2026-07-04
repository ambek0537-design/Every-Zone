// Refunds definitions
export interface RefundSummary {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: "PENDING" | "PROCESSED" | "FAILED";
  processedAt?: Date;
}
