import { Express } from "express";
import { adminRouter } from "./controllers/admin.controller";

export function registerAdminModule(app: Express) {
  // Bind standard administration routes
  app.use("/api/admin", adminRouter);
  app.use("/admin", adminRouter);

  console.log("👥 [ADMIN MODULE] Registered Every-zone Admin Dashboard routes successfully.");
}
