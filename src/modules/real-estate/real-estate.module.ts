import { Express } from "express";
import { propertyRouter, vendorPropertyRouter, adminPropertyRouter } from "./controllers/property.controller";

export function registerRealEstateModule(app: Express) {
  // Public property listings endpoints
  app.use("/api/properties", propertyRouter);
  app.use("/properties", propertyRouter);

  // Vendor dashboard & management endpoints
  app.use("/api/vendor/real-estate", vendorPropertyRouter);
  app.use("/vendor/real-estate", vendorPropertyRouter);

  // Admin dashboard & moderation endpoints
  app.use("/api/admin/real-estate", adminPropertyRouter);
  app.use("/admin/real-estate", adminPropertyRouter);

  console.log("🏢 [REAL ESTATE MODULE] Registered Public properties, Vendor property dashboards, and Admin property moderators successfully.");
}
