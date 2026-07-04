import { Router, Request, Response } from "express";
import { WalletService } from "./wallet.service";
import { verifyChapaWebhook, verifyTelebirrWebhook } from "./webhooks";

const service = new WalletService();

// =========================================================================
// 1. WALLET ENDPOINTS (/wallet or /api/wallet)
// =========================================================================
export const walletRouter = Router();

// GET /wallet
walletRouter.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || "u-2"; // Fallback to buyer test user
    const type = (req.query.type as any) || "BUYER";
    const wallet = await service.getOrCreateWallet(userId, type);
    return res.status(200).json({ status: "success", wallet });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /wallet/balance
walletRouter.get("/balance", async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || "u-2";
    const wallet = await service.getOrCreateWallet(userId, "BUYER");
    return res.status(200).json({
      status: "success",
      balance: wallet.balance,
      availableBalance: wallet.availableBalance,
      heldBalance: wallet.heldBalance,
      currency: wallet.currency,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /wallet/transactions
walletRouter.get("/transactions", async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || "u-2";
    const wallet = await service.getOrCreateWallet(userId, "BUYER");
    const transactions = await service.getTransactions(wallet.id);
    return res.status(200).json({ status: "success", transactions });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /wallet/deposit
walletRouter.post("/deposit", async (req: Request, res: Response) => {
  try {
    const { userId, amount, provider } = req.body;
    if (!userId || !amount || !provider) {
      return res.status(400).json({ error: "Missing required deposit fields: userId, amount, provider" });
    }
    const result = await service.initiateDeposit(userId, Number(amount), provider);
    return res.status(200).json({ status: "success", ...result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /wallet/withdraw
walletRouter.post("/withdraw", async (req: Request, res: Response) => {
  try {
    const { vendorId, amount, bankName, accountNumber } = req.body;
    if (!vendorId || !amount || !bankName || !accountNumber) {
      return res.status(400).json({ error: "Missing required withdrawal fields: vendorId, amount, bankName, accountNumber" });
    }
    const result = await service.requestWithdrawal(vendorId, Number(amount), bankName, accountNumber);
    return res.status(200).json({ status: "success", ...result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /wallet/transfer
walletRouter.post("/transfer", async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId, amount, description } = req.body;
    if (!senderId || !recipientId || !amount) {
      return res.status(400).json({ error: "Missing senderId, recipientId, or amount." });
    }
    const result = await service.transferFunds({
      senderId,
      recipientId,
      amount: Number(amount),
      description,
    });
    return res.status(200).json({ status: "success", ...result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /wallet/webhook/chapa
walletRouter.post("/webhook/chapa", async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-chapa-signature"] as string;
    // For local simulation we also allow a body reference trigger
    const { reference, amount, userId } = req.body;

    const isValid = verifyChapaWebhook(req.body, signature || "valid-chapa-signature");
    if (!isValid) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    if (reference && amount) {
      const result = await service.verifyAndCreditDeposit(reference, Number(amount), "Chapa", { userId });
      return res.status(200).json(result);
    }

    return res.status(200).json({ status: "success", message: "Chapa webhook received" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /wallet/webhook/telebirr
walletRouter.post("/webhook/telebirr", async (req: Request, res: Response) => {
  try {
    const { reference, amount, userId } = req.body;
    const isValid = verifyTelebirrWebhook(req.body);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid Telebirr payload" });
    }

    if (reference && amount) {
      const result = await service.verifyAndCreditDeposit(reference, Number(amount), "Telebirr", { userId });
      return res.status(200).json(result);
    }

    return res.status(200).json({ status: "success", message: "Telebirr webhook processed" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /wallet/webhook/cbe
walletRouter.post("/webhook/cbe", async (req: Request, res: Response) => {
  try {
    const { reference, amount, userId } = req.body;
    if (reference && amount) {
      const result = await service.verifyAndCreditDeposit(reference, Number(amount), "CBE Birr", { userId });
      return res.status(200).json(result);
    }
    return res.status(200).json({ status: "success", message: "CBE Birr webhook logged" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});


// =========================================================================
// 2. VENDOR WALLET ENDPOINTS (/vendor/payouts, /vendor/payout, /vendor/earnings)
// =========================================================================
export const vendorWalletRouter = Router();

// GET /vendor/payouts
vendorWalletRouter.get("/payouts", async (req: Request, res: Response) => {
  try {
    const vendorId = (req.query.vendorId as string) || "u-1"; // default vendor test account
    const payouts = await service.getPayoutsStats(vendorId);
    return res.status(200).json({ status: "success", payouts });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /vendor/payout (Initiates payout)
vendorWalletRouter.post("/payout", async (req: Request, res: Response) => {
  try {
    const { vendorId, amount, bankName, accountNumber } = req.body;
    if (!vendorId || !amount || !bankName || !accountNumber) {
      return res.status(400).json({ error: "Missing required payout parameters." });
    }
    const result = await service.requestWithdrawal(vendorId, Number(amount), bankName, accountNumber);
    return res.status(200).json({ status: "success", ...result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /vendor/earnings
vendorWalletRouter.get("/earnings", async (req: Request, res: Response) => {
  try {
    const vendorId = (req.query.vendorId as string) || "u-1";
    const wallet = await service.getOrCreateWallet(vendorId, "VENDOR");
    return res.status(200).json({
      status: "success",
      totalEarnings: Number(wallet.balance) + Number(wallet.heldBalance),
      availableBalance: wallet.availableBalance,
      heldBalance: wallet.heldBalance,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// =========================================================================
// 3. ADMIN WALLET ENDPOINTS
// =========================================================================
export const adminWalletRouter = Router();

// GET /admin/transactions
adminWalletRouter.get("/transactions", async (req: Request, res: Response) => {
  try {
    const transactions = await service.getTransactions();
    return res.status(200).json({ status: "success", transactions });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /admin/payouts
adminWalletRouter.get("/payouts", async (req: Request, res: Response) => {
  try {
    const payouts = await service.getPayoutsStats();
    return res.status(200).json({ status: "success", payouts });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /admin/payouts/:id (Allows approving/rejecting a payout)
adminWalletRouter.patch("/payouts/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminId } = req.body;
    if (!status || !adminId) {
      return res.status(400).json({ error: "status and adminId are required." });
    }
    const payouts = await service.processPayout(id, status, adminId);
    return res.status(200).json({ status: "success", payouts });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /admin/revenue
adminWalletRouter.get("/revenue", async (req: Request, res: Response) => {
  try {
    const stats = await service.getRevenueStats();
    return res.status(200).json({ status: "success", ...stats });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /admin/platform-wallet
adminWalletRouter.get("/platform-wallet", async (req: Request, res: Response) => {
  try {
    const wallet = await service.getPlatformWalletDetails();
    return res.status(200).json({ status: "success", wallet });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /admin/manual-adjustment
adminWalletRouter.post("/manual-adjustment", async (req: Request, res: Response) => {
  try {
    const { userId, amount, type, description } = req.body;
    if (!userId || !amount || !type || !description) {
      return res.status(400).json({ error: "Missing manual-adjustment fields: userId, amount, type, description" });
    }
    const wallet = await service.manualAdjustment(userId, Number(amount), type, description);
    return res.status(200).json({ status: "success", wallet });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});
