export interface CreateWalletDto {
  userId: string;
  type: "BUYER" | "VENDOR" | "PLATFORM";
  currency?: string;
}

export interface DepositDto {
  userId: string;
  amount: number;
  provider: "CHAPA" | "TELEBIRR" | "CBE";
  reference?: string;
}

export interface WithdrawDto {
  vendorId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
}

export interface TransferDto {
  senderId: string;
  recipientId: string;
  amount: number;
  description?: string;
}
