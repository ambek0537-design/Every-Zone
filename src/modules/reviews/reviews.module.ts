import { Express } from "express";
import { reviewsRouter, reportsRouter, adminReviewsRouter, vendorReviewsRouter } from "./controllers/reviews.controller";

export function registerReviewsModule(app: Express) {
  // Bind standard client routes
  app.use("/api/reviews", reviewsRouter);
  app.use("/reviews", reviewsRouter);

  // Bind reports routes
  app.use("/api/reports", reportsRouter);
  app.use("/reports", reportsRouter);

  // Bind admin/moderator routes
  app.use("/api/admin", adminReviewsRouter);
  app.use("/admin", adminReviewsRouter);

  // Bind vendor routes
  app.use("/api/vendor", vendorReviewsRouter);
  app.use("/vendor", vendorReviewsRouter);

  console.log("⭐ [REVIEWS & TRUST MODULE] Registered Reviews, Ratings, Helpful, Fraud Reports, and Escrow Protections successfully.");
}
