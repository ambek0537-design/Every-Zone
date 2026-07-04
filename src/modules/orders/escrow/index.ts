// Escrow Logic helpers
export interface EscrowStatus {
  orderId: string;
  amount: number;
  released: boolean;
  releasedAt?: Date;
  isDisputed: boolean;
}
