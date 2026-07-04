export interface LedgerEntry {
  id: string;
  transactionId: string;
  reference: string;
  debitWalletId?: string;  // Where money came out
  creditWalletId?: string; // Where money went in
  amount: number;
  type: string;
  timestamp: Date;
}

// In-Memory or DB helper to register ledger entries
export class FinancialLedger {
  private static ledgerLogs: LedgerEntry[] = [];

  static record(transactionId: string, reference: string, type: string, amount: number, debitId?: string, creditId?: string) {
    const entry: LedgerEntry = {
      id: `ledg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      transactionId,
      reference,
      type,
      amount,
      debitWalletId: debitId,
      creditWalletId: creditId,
      timestamp: new Date()
    };
    this.ledgerLogs.push(entry);
    console.log(`🧾 [FINANCIAL LEDGER] Immutably recorded: ${type} of ${amount} ETB. Ref: ${reference}. (Debit: ${debitId || 'none'}, Credit: ${creditId || 'none'})`);
    return entry;
  }

  static getLogs() {
    return this.ledgerLogs;
  }
}
