// Payout configurations and daily limits
export const DAILY_WITHDRAWAL_LIMIT = 50000; // 50,000 ETB limit per day for fraud protection

export interface PayoutSettings {
  vendorId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}
