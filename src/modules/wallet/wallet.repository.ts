import { prisma, useDbFallback, isMemoryDb } from "../../../server";
import { FinancialLedger } from "./ledger";
import { logFraudAlert } from "./transactions";

export class WalletRepository {
  // Ensure wallet exists for a user
  async findByUserId(userId: string) {
    if (prisma && !useDbFallback) {
      return prisma.wallet.findUnique({
        where: { userId },
      });
    } else {
      return isMemoryDb.wallets.find((w: any) => w.userId === userId) || null;
    }
  }

  async findById(id: string) {
    if (prisma && !useDbFallback) {
      return prisma.wallet.findUnique({
        where: { id },
      });
    } else {
      return isMemoryDb.wallets.find((w: any) => w.id === id) || null;
    }
  }

  async createWallet(userId: string, type: "BUYER" | "VENDOR" | "PLATFORM", currency = "ETB") {
    if (prisma && !useDbFallback) {
      return prisma.wallet.create({
        data: {
          userId,
          type,
          status: "ACTIVE",
          balance: 0,
          availableBalance: 0,
          heldBalance: 0,
          currency,
        },
      });
    } else {
      const wallet = {
        id: `wal-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        userId,
        type,
        status: "ACTIVE" as any,
        balance: 0,
        availableBalance: 0,
        heldBalance: 0,
        currency,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      isMemoryDb.wallets.push(wallet);
      return wallet;
    }
  }

  async updateWalletBalances(
    walletId: string,
    balanceChange: number,
    availableChange: number,
    heldChange: number
  ) {
    if (prisma && !useDbFallback) {
      const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
      if (!wallet) throw new Error("Wallet not found");

      const newBalance = Number(wallet.balance) + balanceChange;
      const newAvailable = Number(wallet.availableBalance) + availableChange;
      const newHeld = Number(wallet.heldBalance) + heldChange;

      if (newBalance < 0 || newAvailable < 0 || newHeld < 0) {
        throw new Error("ይቅርታ፣ በቂ ሂሳብ የሎትም ወይም ቀሪ ሂሳብ ከዜሮ በታች ሊሆን አይችልም። / Insufficient balance. Negative balances are strictly prohibited.");
      }

      return prisma.wallet.update({
        where: { id: walletId },
        data: {
          balance: newBalance,
          availableBalance: newAvailable,
          heldBalance: newHeld,
          updatedAt: new Date(),
        },
      });
    } else {
      const wallet = isMemoryDb.wallets.find((w: any) => w.id === walletId);
      if (!wallet) throw new Error("Wallet not found");

      const newBalance = (wallet.balance || 0) + balanceChange;
      const newAvailable = (wallet.availableBalance || 0) + availableChange;
      const newHeld = (wallet.heldBalance || 0) + heldChange;

      if (newBalance < 0 || newAvailable < 0 || newHeld < 0) {
        throw new Error("ይቅርታ፣ በቂ ሂሳብ የሎትም ወይም ቀሪ ሂሳብ ከዜሮ በታች ሊሆን አይችልም። / Insufficient balance. Negative balances are strictly prohibited.");
      }

      wallet.balance = newBalance;
      wallet.availableBalance = newAvailable;
      wallet.heldBalance = newHeld;
      wallet.updatedAt = new Date();
      return wallet;
    }
  }

  async createTransaction(
    walletId: string,
    type: any,
    amount: number,
    balanceBefore: number,
    balanceAfter: number,
    reference: string,
    description?: string
  ) {
    // Duplicate reference detection (Fraud Protection)
    const isDup = await this.findTransactionByReference(reference);
    if (isDup) {
      logFraudAlert(walletId, "DUPLICATE_TX", `Detected duplicate transaction reference: ${reference}`, "HIGH");
      throw new Error(`የግብይት ስህተት፡ ግልባጭ ግብይት ተገኝቷል። / Transaction security error: Duplicate reference detected. Action blocked.`);
    }

    if (prisma && !useDbFallback) {
      const tx = await prisma.walletTransaction.create({
        data: {
          walletId,
          type,
          amount,
          balanceBefore,
          balanceAfter,
          reference,
          description: description || null,
        },
      });
      return tx;
    } else {
      const tx = {
        id: `tx-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        walletId,
        type,
        amount,
        balanceBefore,
        balanceAfter,
        reference,
        description: description || null,
        createdAt: new Date(),
      };
      isMemoryDb.walletTransactions.push(tx);
      return tx;
    }
  }

  async findTransactionByReference(reference: string) {
    if (prisma && !useDbFallback) {
      return prisma.walletTransaction.findUnique({
        where: { reference },
      });
    } else {
      return isMemoryDb.walletTransactions.find((tx: any) => tx.reference === reference) || null;
    }
  }

  async getTransactions(walletId?: string, limit = 50) {
    if (prisma && !useDbFallback) {
      const where = walletId ? { walletId } : {};
      return prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    } else {
      let list = [...isMemoryDb.walletTransactions];
      if (walletId) {
        list = list.filter((tx: any) => tx.walletId === walletId);
      }
      list.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
      return list.slice(0, limit);
    }
  }

  async updateWalletStatus(walletId: string, status: any) {
    if (prisma && !useDbFallback) {
      return prisma.wallet.update({
        where: { id: walletId },
        data: { status, updatedAt: new Date() },
      });
    } else {
      const wallet = isMemoryDb.wallets.find((w: any) => w.id === walletId);
      if (!wallet) throw new Error("Wallet not found");
      wallet.status = status;
      wallet.updatedAt = new Date();
      return wallet;
    }
  }

  // Payout Repository Functions
  async createPayout(vendorId: string, amount: number, status: string, bankName?: string, accountNumber?: string, reference?: string) {
    if (prisma && !useDbFallback) {
      return prisma.vendorPayout.create({
        data: {
          vendorId,
          amount,
          status,
          bankName: bankName || null,
          accountNumber: accountNumber || null,
          transactionReference: reference || null,
        },
      });
    } else {
      const payout = {
        id: `pay-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        vendorId,
        amount,
        status,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        transactionReference: reference || null,
        processedAt: null,
        createdAt: new Date(),
      };
      isMemoryDb.vendorPayouts.push(payout);
      return payout;
    }
  }

  async getPayouts(vendorId?: string) {
    if (prisma && !useDbFallback) {
      const where = vendorId ? { vendorId } : {};
      return prisma.vendorPayout.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } else {
      let list = [...isMemoryDb.vendorPayouts];
      if (vendorId) {
        list = list.filter((p: any) => p.vendorId === vendorId);
      }
      list.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
      return list;
    }
  }

  async updatePayoutStatus(id: string, status: string, processedAt?: Date, reference?: string) {
    if (prisma && !useDbFallback) {
      const data: any = { status };
      if (processedAt) data.processedAt = processedAt;
      if (reference) data.transactionReference = reference;
      return prisma.vendorPayout.update({
        where: { id },
        data,
      });
    } else {
      const payout = isMemoryDb.vendorPayouts.find((p: any) => p.id === id);
      if (!payout) throw new Error("Payout record not found");
      payout.status = status;
      if (processedAt) payout.processedAt = processedAt;
      if (reference) payout.transactionReference = reference;
      return payout;
    }
  }

  async getPlatformWallet() {
    let platformWallet = null;
    if (prisma && !useDbFallback) {
      platformWallet = await prisma.wallet.findFirst({
        where: { type: "PLATFORM" },
      });
    } else {
      platformWallet = isMemoryDb.wallets.find((w: any) => w.type === "PLATFORM") || null;
    }

    if (!platformWallet) {
      // Lazy auto-create platform wallet if not present
      platformWallet = await this.createWallet("platform-system-id", "PLATFORM", "ETB");
    }
    return platformWallet;
  }
}
