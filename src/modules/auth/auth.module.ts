import express, { Express } from "express";
import { authRouter } from "./auth.controller";

export function registerAuthModule(app: Express) {
  // Parse urlencoded bodies (necessary for Google Auth simulated form posts)
  app.use(express.urlencoded({ extended: true }));

  // Mount /api/auth and /auth endpoints
  app.use("/api/auth", authRouter);
  app.use("/auth", authRouter);

  console.log("🔐 [AUTHENTICATION MODULE] Registered JWT Security, OTP, and Password Recovery APIs successfully.");
}
