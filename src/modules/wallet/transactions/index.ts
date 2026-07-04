// Wallet transaction structures and immutability controls
export interface FraudAlert {
  id: string;
  walletId: string;
  type: "DUPLICATE_TX" | "VELOCITY_LIMIT" | "LARGE_WITHDRAW" | "AML_WARNING";
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date;
}

export const fraudAlertsStore: FraudAlert[] = [];

export function logFraudAlert(walletId: string, type: "DUPLICATE_TX" | "VELOCITY_LIMIT" | "LARGE_WITHDRAW" | "AML_WARNING", description: string, severity: "LOW" | "MEDIUM" | "HIGH") {
  const alert: FraudAlert = {
    id: `fraud-${Date.now()}`,
    walletId,
    type,
    description,
    severity,
    createdAt: new Date()
  };
  fraudAlertsStore.push(alert);
  console.warn(`🚨 [FRAUD ALERT] Detected ${type} for Wallet ${walletId}: ${description}`);
  return alert;
}
