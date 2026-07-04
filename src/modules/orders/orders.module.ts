import { Express } from "express";
import { ordersRouter, vendorOrdersRouter, adminOrdersRouter } from "./orders.controller";

export function registerOrdersModule(app: Express) {
  // Support both standard /api/... routes and direct paths requested by user
  app.use("/api/orders", ordersRouter);
  app.use("/orders", ordersRouter);

  app.use("/api/vendor/orders", vendorOrdersRouter);
  app.use("/vendor/orders", vendorOrdersRouter);

  app.use("/api/admin", adminOrdersRouter);
  app.use("/admin", adminOrdersRouter);

  console.log("📦 [ORDERS MODULE] Registered Buyer, Vendor, and Admin APIs successfully.");
}
