import { WalletRepository } from "./wallet.repository";
import { prisma, useDbFallback, isMemoryDb } from "../../../server";
import { FinancialLedger } from "./ledger";
import { logFraudAlert } from "./transactions";
import { DAILY_WITHDRAWAL_LIMIT } from "./payouts";
import { ChapaProvider } from "./providers/chapa";
import { TelebirrProvider } from "./providers/telebirr";
import { CBEProvider } from "./providers/cbe";

export class WalletService {
  private repository = new WalletRepository();
  private chapa = new ChapaProvider();
  private telebirr = new TelebirrProvider();
  private cbe = new CBEProvider();

  // Helper to dispatch user notifications in background
  private async sendNotification(userId: string, type: string, title: string, body: string) {
    try {
      if (prisma && !useDbFallback) {
        // Find user first to ensure notification won't fail on missing foreign keys
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (userExists) {
          await prisma.notification.create({
            data: {
              userId,
              type: type as any,
              title,
              body,
              status: "DELIVERED",
            },
          });
        }
      } else {
        isMemoryDb.notifications.push({
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          type,
          title,
          body,
          status: "DELIVERED",
          createdAt: new Date(),
        });
      }
    } catch (e) {
      console.warn("Background notification dispatcher omitted:", e);
    }
  }

  // --- 1. Get or Create Wallet ---
  async getOrCreateWallet(userId: string, type: "BUYER" | "VENDOR" | "PLATFORM") {
    let wallet = await this.repository.findByUserId(userId);
    if (!wallet) {
      wallet = await this.repository.createWallet(userId, type);
      await this.sendNotification(
        userId,
        "SYSTEM_ALERT",
        "የዲጂታል ቦርሳ ተፈጥሯል / Digital Wallet Created",
        "የኢቫንጋዲ ዲጂታል ቦርሳዎ በተሳካ ሁኔታ ተፈጥሯል። አሁን ማስቀመጥ፣ ማውጣት እና መግዛት ይችላሉ።"
      );
    }
    return wallet;
  }

  // --- 2. Deposit Money ---
  async initiateDeposit(userId: string, amount: number, providerName: "CHAPA" | "TELEBIRR" | "CBE") {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }

    const wallet = await this.getOrCreateWallet(userId, "BUYER");
    if (wallet.status !== "ACTIVE") {
      throw new Error("ይህ ቦርሳ በጊዜያዊነት ታግዷል። እባክዎ አስተዳዳሪዎችን ያነጋግሩ። / Wallet is currently locked or suspended.");
    }

    const reference = `EVZ-DEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let checkoutResult: any = {};
    if (providerName === "CHAPA") {
      checkoutResult = await this.chapa.initializePayment(userId, amount, reference, "https://evangadi.com/webhook/chapa");
    } else if (providerName === "TELEBIRR") {
      checkoutResult = await this.telebirr.createPaymentRequest(userId, amount, reference);
    } else {
      checkoutResult = await this.cbe.initiateCBEBirrPayment("+251911122233", amount, reference);
    }

    return {
      reference,
      amount,
      provider: providerName,
      checkoutUrl: checkoutResult.checkoutUrl || checkoutResult.toPayUrl || null,
      message: "ማስቀመጫው በተሳካ ሁኔታ ተጀምሯል። ክፍያውን ይፈጽሙ። / Deposit initialized successfully.",
    };
  }

  // --- 3. Webhook Verifications & Balance Crediting ---
  async verifyAndCreditDeposit(reference: string, amount: number, provider: string, extraPayload?: any) {
    // Check if transaction has already been credited (Fraud / Double Deposit prevention)
    const existingTx = await this.repository.findTransactionByReference(reference);
    if (existingTx) {
      console.warn(`[WEBHOOK WARNING] Webhook already processed for reference ${reference}. Skipping credit.`);
      return { status: "ignored", message: "Transaction already processed." };
    }

    // Identify user/buyer from reference or payload
    // In our implementation, we'll look up the user using the reference prefix or mock associations.
    // For general robustness, we resolve or default the depositor
    let userId = "u-2"; // Fallback to test user if not provided
    if (extraPayload && extraPayload.userId) {
      userId = extraPayload.userId;
    }

    const wallet = await this.getOrCreateWallet(userId, "BUYER");
    if (wallet.status !== "ACTIVE") {
      throw new Error("Cannot credit suspended wallet.");
    }

    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore + amount;

    // 1. Update wallet balance
    await this.repository.updateWalletBalances(wallet.id, amount, amount, 0);

    // 2. Create immutable wallet transaction
    const transaction = await this.repository.createTransaction(
      wallet.id,
      "DEPOSIT",
      amount,
      balanceBefore,
      balanceAfter,
      reference,
      `Deposit of ${amount} ETB via ${provider}`
    );

    // 3. Post debit and credit entries in ledger
    FinancialLedger.record(
      transaction.id,
      reference,
      "DEPOSIT",
      amount,
      undefined, // No debit wallet (external fund inflow)
      wallet.id  // Credited buyer wallet
    );

    // 4. Dispatch success notification
    await this.sendNotification(
      userId,
      "DEPOSIT_SUCCESS",
      "ገንዘብ ተቀማጭ ሆኗል / Deposit Successful",
      `የ ${amount} ETB ተቀማጭ በ ${provider} በተሳካ ሁኔታ ተጠናቋል። አዲሱ ቀሪ ሂሳብዎ ${balanceAfter} ETB ነው።`
    );

    return { status: "success", transaction };
  }

  // --- 4. Wallet to Wallet Transfer ---
  async transferFunds(dto: { senderId: string; recipientId: string; amount: number; description?: string }) {
    const { senderId, recipientId, amount, description } = dto;
    if (amount <= 0) throw new Error("Transfer amount must be positive");
    if (senderId === recipientId) throw new Error("Cannot transfer funds to yourself");

    const senderWallet = await this.getOrCreateWallet(senderId, "BUYER");
    const recipientWallet = await this.getOrCreateWallet(recipientId, "BUYER");

    if (senderWallet.status !== "ACTIVE") {
      throw new Error("ማስተላለፍ አይቻልም፡ የላኪው ቦርሳ ታግዷል። / Sender wallet is suspended.");
    }
    if (recipientWallet.status !== "ACTIVE") {
      throw new Error("ማስተላለፍ አይቻልም፡ የተቀባዩ ቦርሳ ታግዷል። / Recipient wallet is suspended.");
    }

    if (Number(senderWallet.availableBalance) < amount) {
      throw new Error("ይቅርታ፣ ማስተላለፍ ለመፈጸም በቂ ሂሳብ የሎትም። / Insufficient available balance for transfer.");
    }

    const reference = `EVZ-TRSF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Debit sender
    const senderBefore = Number(senderWallet.balance);
    const senderAfter = senderBefore - amount;
    await this.repository.updateWalletBalances(senderWallet.id, -amount, -amount, 0);
    const debitTx = await this.repository.createTransaction(
      senderWallet.id,
      "TRANSFER",
      amount,
      senderBefore,
      senderAfter,
      reference + "-DR",
      description || `Transfer to ${recipientId}`
    );

    // Credit recipient
    const recipientBefore = Number(recipientWallet.balance);
    const recipientAfter = recipientBefore + amount;
    await this.repository.updateWalletBalances(recipientWallet.id, amount, amount, 0);
    const creditTx = await this.repository.createTransaction(
      recipientWallet.id,
      "TRANSFER",
      amount,
      recipientBefore,
      recipientAfter,
      reference + "-CR",
      description || `Transfer from ${senderId}`
    );

    // Record in immutable accounting ledger
    FinancialLedger.record(
      debitTx.id,
      reference,
      "TRANSFER",
      amount,
      senderWallet.id,
      recipientWallet.id
    );

    // Notifications
    await this.sendNotification(
      senderId,
      "TRANSFER_SENT",
      "ገንዘብ ተላልፏል / Transfer Sent",
      `የ ${amount} ETB ማስተላለፍ ለተጠቃሚ ${recipientId} በተሳካ ሁኔታ ተጠናቋል።`
    );

    await this.sendNotification(
      recipientId,
      "TRANSFER_RECEIVED",
      "ገንዘብ ደርሶዎታል / Transfer Received",
      `ከደነበኛ ${senderId} የ ${amount} ETB ክፍያ ደርሶዎታል።`
    );

    return { debitTx, creditTx };
  }

  // --- 5. Escrow Hold Placement (Checkout Flow) ---
  async holdEscrow(buyerId: string, vendorId: string, amount: number, orderId: string) {
    const buyerWallet = await this.getOrCreateWallet(buyerId, "BUYER");
    const vendorWallet = await this.getOrCreateWallet(vendorId, "VENDOR");

    if (Number(buyerWallet.availableBalance) < amount) {
      throw new Error("ይቅርታ፣ ክፍያ ለመፈጸም በቂ ሂሳብ በቦርሳዎ ውስጥ የለም። እባክዎ አስቀድመው ገንዘብ ያስገቡ። / Insufficient balance in buyer wallet. Please deposit first.");
    }

    const reference = `EVZ-ESC-HOLD-${Date.now()}-${orderId}`;

    // Debit buyer available balance and place it on escrow hold (increase heldBalance)
    const buyerBefore = Number(buyerWallet.balance);
    const buyerAfter = buyerBefore - amount;
    await this.repository.updateWalletBalances(buyerWallet.id, -amount, -amount, 0);

    const tx = await this.repository.createTransaction(
      buyerWallet.id,
      "ESCROW_HOLD",
      amount,
      buyerBefore,
      buyerAfter,
      reference,
      `Escrow hold placed for Order ${orderId}`
    );

    // Also update vendor heldBalance to visually reflect incoming/pending escrow funds
    await this.repository.updateWalletBalances(vendorWallet.id, amount, 0, amount);

    FinancialLedger.record(
      tx.id,
      reference,
      "ESCROW_HOLD",
      amount,
      buyerWallet.id,
      vendorWallet.id
    );

    await this.sendNotification(
      buyerId,
      "ESCROW_HOLD",
      "ክፍያ በ Escrow ተይዟል / Funds Placed in Escrow",
      `ለትዕዛዝ ${orderId} የከፈሉት ${amount} ETB በታማኝ የሶስተኛ ወገን (Escrow) ተቀምጧል። እቃው ሲደርስዎ ማረጋገጫ ይስጡ።`
    );

    return tx;
  }

  // --- 6. Escrow Release Logic with Commission Split ---
  async releaseEscrow(orderId: string, commissionPercent = 5) {
    // Look up the order to fetch total amount, buyer and vendor details
    let amount = 1000; // default simulation
    let buyerId = "u-2";
    let vendorId = "u-1";

    if (prisma && !useDbFallback) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order) {
        amount = Number(order.total);
        buyerId = order.buyerId;
        vendorId = order.vendorId;
      }
    } else {
      const order = isMemoryDb.orders.find((o: any) => o.id === orderId);
      if (order) {
        amount = Number(order.total);
        buyerId = order.buyerId;
        vendorId = order.vendorId;
      }
    }

    const vendorWallet = await this.getOrCreateWallet(vendorId, "VENDOR");
    const platformWallet = await this.repository.getPlatformWallet();

    // Deduct from vendor's heldBalance
    // Out of total amount, calculate commission fee (e.g., 5%)
    const commissionAmount = (amount * commissionPercent) / 100;
    const vendorNetAmount = amount - commissionAmount;

    // Ensure the vendor has sufficient held balance
    if (Number(vendorWallet.heldBalance) < amount) {
      throw new Error("Invalid escrow release state: Vendor does not have enough held funds.");
    }

    const releaseRef = `EVZ-ESC-REL-${Date.now()}-${orderId}`;

    // Deduct heldBalance from vendor and credit availableBalance
    await this.repository.updateWalletBalances(vendorWallet.id, vendorNetAmount, vendorNetAmount, -amount);

    const vendorBefore = Number(vendorWallet.balance) - amount; // clear original held
    const vendorAfter = vendorBefore + vendorNetAmount;

    const vendorTx = await this.repository.createTransaction(
      vendorWallet.id,
      "ESCROW_RELEASE",
      vendorNetAmount,
      vendorBefore,
      vendorAfter,
      releaseRef + "-VN",
      `Escrow payout for Order ${orderId} minus ${commissionPercent}% platform commission`
    );

    // Credit platform wallet with commission fee
    const platformBefore = Number(platformWallet.balance);
    const platformAfter = platformBefore + commissionAmount;
    await this.repository.updateWalletBalances(platformWallet.id, commissionAmount, commissionAmount, 0);

    const platformTx = await this.repository.createTransaction(
      platformWallet.id,
      "COMMISSION",
      commissionAmount,
      platformBefore,
      platformAfter,
      releaseRef + "-PF",
      `Commission share from Order ${orderId}`
    );

    // Ledger record
    FinancialLedger.record(
      vendorTx.id,
      releaseRef,
      "ESCROW_RELEASE",
      amount,
      undefined, // Escrow release release
      vendorWallet.id
    );

    // Notify vendor
    await this.sendNotification(
      vendorId,
      "PAYMENT_RECEIVED",
      "ሂሳብ ገቢ ሆኗል / Escrow Funds Released",
      `ለትዕዛዝ ${orderId} በ Escrow ተይዞ የነበረው ክፍያ ${vendorNetAmount} ETB በተሳካ ሁኔታ ተለቆልዎታል።`
    );

    // Notify platform admin (system notifier)
    console.log(`[COMMISSION ENGINE] Credited platform account with ${commissionAmount} ETB (Commission) for order ${orderId}.`);

    return { vendorTx, platformTx };
  }

  // --- 7. Withdrawal Request (Payout Flow) ---
  async requestWithdrawal(vendorId: string, amount: number, bankName: string, accountNumber: string) {
    if (amount <= 0) throw new Error("Withdrawal amount must be positive");

    const wallet = await this.getOrCreateWallet(vendorId, "VENDOR");
    if (wallet.status !== "ACTIVE") {
      throw new Error("Withdrawal rejected: Vendor wallet is locked or suspended.");
    }

    if (Number(wallet.availableBalance) < amount) {
      throw new Error("ይቅርታ፣ ይህንን መጠን ለማውጣት በቂ ሂሳብ የሎትም። / Insufficient available balance for withdrawal.");
    }

    // AML/Fraud Limit Checks
    if (amount > DAILY_WITHDRAWAL_LIMIT) {
      logFraudAlert(wallet.id, "VELOCITY_LIMIT", `Vendor requested withdrawal of ${amount} ETB which exceeds daily velocity limit of ${DAILY_WITHDRAWAL_LIMIT}.`, "HIGH");
      
      // Auto-freeze high suspicious activity
      await this.repository.updateWalletStatus(wallet.id, "FROZEN");
      await this.sendNotification(
        vendorId,
        "SYSTEM_ALERT",
        "የቦርሳዎ እንቅስቃሴ ታግዷል / Wallet Automatically Frozen",
        `ደህንነትዎን ለመጠበቅ ሲባል ባልተለመደ የገንዘብ ማውጣት ሙከራ ምክንያት ቦርሳዎ በጊዜያዊነት ታግዷል። እባክዎ ድጋፍ ሰጪዎችን ያነጋግሩ።`
      );
      throw new Error("ይህ ግብይት በደህንነት ስጋት ምክንያት ታግዷል። ቦርሳዎ በጊዜያዊነት እንዲቆለፍ ተደርጓል። / Security violation: Withdrawal exceeds daily velocity limit. Wallet auto-frozen for security audit.");
    }

    // Record payout request
    const reference = `EVZ-WIT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const payout = await this.repository.createPayout(vendorId, amount, "PENDING", bankName, accountNumber, reference);

    // Deduct available balance and total balance from vendor wallet immediately to prevent double spend
    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore - amount;
    await this.repository.updateWalletBalances(wallet.id, -amount, -amount, 0);

    const tx = await this.repository.createTransaction(
      wallet.id,
      "WITHDRAW",
      amount,
      balanceBefore,
      balanceAfter,
      reference,
      `Withdrawal request to ${bankName} A/C: ${accountNumber}`
    );

    FinancialLedger.record(
      tx.id,
      reference,
      "WITHDRAW",
      amount,
      wallet.id,
      undefined
    );

    await this.sendNotification(
      vendorId,
      "WITHDRAWAL_SUBMITTED",
      "የገንዘብ ማውጣት ጥያቄ ቀርቧል / Withdrawal Request Submitted",
      `የ ${amount} ETB የገንዘብ ማውጣት ጥያቄዎ በተሳካ ሁኔታ ቀርቧል። በአሁኑ ጊዜ በመገምገም ላይ ነው።`
    );

    return { payout, tx };
  }

  // --- 8. Admin Process Payout ---
  async processPayout(payoutId: string, status: "APPROVED" | "REJECTED", adminId: string) {
    const payouts = await this.repository.getPayouts();
    const payout = payouts.find((p: any) => p.id === payoutId);
    if (!payout) throw new Error("Payout record not found");

    if (payout.status !== "PENDING") {
      throw new Error("Payout already processed");
    }

    if (status === "APPROVED") {
      await this.repository.updatePayoutStatus(payoutId, "COMPLETED", new Date());
      await this.sendNotification(
        payout.vendorId,
        "WITHDRAWAL_APPROVED",
        "የገንዘብ ማውጣት ጥያቄዎ ጸድቋል / Withdrawal Approved",
        `የ ${payout.amount} ETB ማውጣት ጥያቄዎ ተቀባይነት አግኝቶ ወደ ባንክዎ ${payout.bankName} ተልኳል።`
      );
    } else {
      await this.repository.updatePayoutStatus(payoutId, "REJECTED", new Date());

      // Refund funds back to vendor wallet if rejected
      const wallet = await this.getOrCreateWallet(payout.vendorId, "VENDOR");
      const balanceBefore = Number(wallet.balance);
      const balanceAfter = balanceBefore + Number(payout.amount);
      await this.repository.updateWalletBalances(wallet.id, Number(payout.amount), Number(payout.amount), 0);

      const refundRef = `EVZ-WIT-REF-${Date.now()}`;
      await this.repository.createTransaction(
        wallet.id,
        "REFUND",
        Number(payout.amount),
        balanceBefore,
        balanceAfter,
        refundRef,
        `Refund for rejected withdrawal request ${payoutId}`
      );

      await this.sendNotification(
        payout.vendorId,
        "WITHDRAWAL_REJECTED",
        "የገንዘብ ማውጣት ጥያቄዎ ውድቅ ሆኗል / Withdrawal Rejected",
        `የ ${payout.amount} ETB ማውጣት ጥያቄዎ ውድቅ ተደርጓል። ገንዘቡ ወደ ዲጂታል ቦርሳዎ ተመላሽ ሆኗል።`
      );
    }

    return this.repository.getPayouts();
  }

  // --- 9. Admin Manual Adjustment ---
  async manualAdjustment(userId: string, amount: number, type: "DEBIT" | "CREDIT", description: string) {
    const wallet = await this.getOrCreateWallet(userId, "BUYER");
    const before = Number(wallet.balance);

    const change = type === "CREDIT" ? amount : -amount;
    await this.repository.updateWalletBalances(wallet.id, change, change, 0);

    const after = before + change;
    const ref = `EVZ-ADJ-${Date.now()}`;

    const tx = await this.repository.createTransaction(
      wallet.id,
      type === "CREDIT" ? "DEPOSIT" : "WITHDRAW",
      amount,
      before,
      after,
      ref,
      `Admin adjustment: ${description}`
    );

    FinancialLedger.record(tx.id, ref, "TRANSFER", amount, type === "DEBIT" ? wallet.id : undefined, type === "CREDIT" ? wallet.id : undefined);

    await this.sendNotification(
      userId,
      "SYSTEM_ALERT",
      "የሂሳብ ማስተካከያ ተደርጓል / Account Balance Adjusted",
      `አስተዳዳሪው በሂሳብዎ ላይ የ ${amount} ETB ማስተካከያ አድርገዋል። መግለጫ፡ ${description}`
    );

    return wallet;
  }

  // --- 10. Analytics & Financial Metrics ---
  async getRevenueStats() {
    const ledgerLogs = FinancialLedger.getLogs();
    const commissions = ledgerLogs.filter((l) => l.type === "COMMISSION" || l.reference.endsWith("-PF"));
    const totalRevenue = commissions.reduce((sum, current) => sum + current.amount, 0);

    return {
      totalPlatformRevenue: totalRevenue,
      auditedTransactionsCount: ledgerLogs.length,
      currentAuditedInflow: ledgerLogs.filter((l) => l.type === "DEPOSIT").reduce((sum, c) => sum + c.amount, 0),
      currentAuditedOutflow: ledgerLogs.filter((l) => l.type === "WITHDRAW").reduce((sum, c) => sum + c.amount, 0),
    };
  }

  async getPlatformWalletDetails() {
    return this.repository.getPlatformWallet();
  }

  async getPayoutsStats(vendorId?: string) {
    return this.repository.getPayouts(vendorId);
  }

  async getTransactions(walletId?: string) {
    return this.repository.getTransactions(walletId);
  }

  async getWalletDetails(userId: string) {
    return this.repository.findByUserId(userId);
  }
}
