import { Express } from "express";
import { overseasRouter } from "./controllers/overseas.controller";

export function registerOverseasModule(app: Express) {
  // Public jobs endpoints
  app.use("/api", overseasRouter);
  app.use("/", overseasRouter);

  console.log("✈️ [OVERSEAS EMPLOYMENT MODULE] Registered Jobs, Applications, Uploads, and Anti-Fraud systems successfully.");
}
