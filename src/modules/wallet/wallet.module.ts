import { Express } from "express";
import { walletRouter, vendorWalletRouter, adminWalletRouter } from "./wallet.controller";

export function registerWalletModule(app: Express) {
  // Mount /wallet and /api/wallet endpoints
  app.use("/api/wallet", walletRouter);
  app.use("/wallet", walletRouter);

  // Mount vendor payout / earnings endpoints
  app.use("/api/vendor", vendorWalletRouter);
  app.use("/vendor", vendorWalletRouter);

  // Mount admin wallet / payouts / analytics endpoints
  app.use("/api/admin", adminWalletRouter);
  app.use("/admin", adminWalletRouter);

  console.log("💳 [WALLET MODULE] Registered Wallet, Deposits, Withdrawals, Transfers, Escrow, and Admin APIs successfully.");
}
