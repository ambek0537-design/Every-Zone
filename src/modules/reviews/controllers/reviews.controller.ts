import { Router, Request, Response } from "express";
import { ReviewsService } from "../services/reviews.service";
import { ReviewsRepository } from "../repositories/reviews.repository";

export const reviewsRouter = Router();
export const reportsRouter = Router();
export const adminReviewsRouter = Router();
export const vendorReviewsRouter = Router();

const service = new ReviewsService();
const repository = new ReviewsRepository();

// ==========================================
// 1. REVIEWS APIs
// ==========================================

// POST /reviews - Submit a review
reviewsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { targetType, targetId, userId, userName, rating, text, photos, videos, isVerifiedPurchase } = req.body;
    
    if (!targetType || !targetId || !userId || !userName || !rating || !text) {
      return res.status(400).json({ error: "Missing required review parameters." });
    }

    const review = await service.submitReview({
      targetType,
      targetId,
      userId,
      userName,
      rating: Number(rating),
      text,
      photos,
      videos,
      isVerifiedPurchase
    });

    return res.status(201).json({ status: "success", review });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /reviews - Fetch all reviews for a target
reviewsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { targetType, targetId } = req.query;
    if (!targetType || !targetId) {
      return res.status(400).json({ error: "targetType and targetId query params are required." });
    }
    const reviews = await repository.getReviewsForTarget(targetType as any, targetId as string);
    return res.status(200).json({ status: "success", reviews });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /reviews/:id - Get detailed review
reviewsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await repository.getReviewById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }
    return res.status(200).json({ status: "success", review });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /reviews/:id - Update review
reviewsRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, text, photos, videos } = req.body;
    
    const updated = await repository.updateReview(id, {
      rating: rating ? Number(rating) : undefined,
      text,
      photos,
      videos
    });

    if (!updated) {
      return res.status(404).json({ error: "Review not found to update." });
    }

    return res.status(200).json({ status: "success", review: updated });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// DELETE /reviews/:id - Delete review
reviewsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await repository.deleteReview(id);
    if (!deleted) {
      return res.status(404).json({ error: "Review not found to delete." });
    }
    return res.status(200).json({ status: "success", message: "Review deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /reviews/:id/helpful - Toggle helpful vote
reviewsRouter.post("/:id/helpful", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required to vote." });
    }

    const result = await repository.toggleHelpfulVote(id, userId);
    if (!result) {
      return res.status(404).json({ error: "Review not found." });
    }

    return res.status(200).json({ status: "success", ...result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. FRAUD REPORTS APIs
// ==========================================

// POST /reports - Create a fraud report
reportsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { reporterId, targetType, targetId, reason, evidence } = req.body;
    if (!reporterId || !targetType || !targetId || !reason || !evidence) {
      return res.status(400).json({ error: "Missing required report parameters." });
    }

    const report = await service.submitFraudReport({
      reporterId,
      targetType,
      targetId,
      reason,
      evidence
    });

    return res.status(201).json({ status: "success", report });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /reports/me - Get active reports for logged in user
reportsRouter.get("/me", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId query parameter is required." });
    }

    const reports = await repository.getReportsForUser(userId as string);
    return res.status(200).json({ status: "success", reports });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. ADMIN APIs
// ==========================================

// GET /admin/reports - Get all reports in moderation queue
adminReviewsRouter.get("/reports", async (req: Request, res: Response) => {
  try {
    const reports = await repository.getAllReports();
    return res.status(200).json({ status: "success", reports });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /admin/reports/status - Moderate a report with escrow action & logs
adminReviewsRouter.patch("/reports/status", async (req: Request, res: Response) => {
  try {
    const { reportId, status, notes, resolution, adminId, escrowAction } = req.body;
    if (!reportId || !status || !adminId) {
      return res.status(400).json({ error: "reportId, status, and adminId are required." });
    }

    const success = await service.resolveReport(
      reportId,
      status,
      notes || `Report updated by admin: ${status}`,
      resolution || `Action details: ${status}`,
      adminId,
      escrowAction
    );

    if (!success) {
      return res.status(404).json({ error: "Report not found or resolve failed." });
    }

    return res.status(200).json({ status: "success", message: "Report moderated successfully." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /admin/audit-logs - Fetch audit logs
adminReviewsRouter.get("/audit-logs", async (req: Request, res: Response) => {
  try {
    const logs = await repository.getAuditLogs();
    return res.status(200).json({ status: "success", logs });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. VENDOR & TRUST APIs
// ==========================================

// POST /vendor/reply - Vendor responds to review
vendorReviewsRouter.post("/reply", async (req: Request, res: Response) => {
  try {
    const { reviewId, vendorId, replyText } = req.body;
    if (!reviewId || !vendorId || !replyText) {
      return res.status(400).json({ error: "reviewId, vendorId, and replyText are required." });
    }

    const updated = await service.submitVendorReply({
      reviewId,
      vendorId,
      replyText
    });

    return res.status(200).json({ status: "success", review: updated });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /vendors/:id/trust-score - Dynamic trust score & badges
reviewsRouter.get("/vendors/:id/trust-score", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await service.calculateTrustScore(id);
    return res.status(200).json({ status: "success", ...stats });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
