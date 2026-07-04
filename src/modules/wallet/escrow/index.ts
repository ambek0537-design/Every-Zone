// Escrow logic support types
export interface EscrowHold {
  orderId: string;
  buyerWalletId: string;
  vendorWalletId: string;
  amount: number;
  commissionAmount: number;
  netAmount: number;
  status: "HELD" | "RELEASED" | "REFUNDED" | "DISPUTED";
  createdAt: Date;
}

export const escrowHoldsStore: EscrowHold[] = [];
