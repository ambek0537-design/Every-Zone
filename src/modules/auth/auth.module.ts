import { Express } from "express";
import { authRouter } from "./auth.controller";

export function registerAuthModule(app: Express) {
  // Mount /api/auth and /auth endpoints
  app.use("/api/auth", authRouter);
  app.use("/auth", authRouter);

  console.log("🔐 [AUTHENTICATION MODULE] Registered JWT Security, OTP, and Password Recovery APIs successfully.");
}
