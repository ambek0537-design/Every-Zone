import { Router, Request, Response } from "express";
import { RecommendationService } from "../services/recommendation.service";

const service = new RecommendationService();

export const aiRouter = Router();

// =========================================================================
// 1. RE-RANKED AND PERSONALIZED HOME FEED RECOMMENDATIONS
// =========================================================================
// GET /ai/recommendations - Personalized Home Feed
aiRouter.get("/ai/recommendations", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || "u-2"; // default test buyer
    const data = await service.getPersonalizedFeed(userId);
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 2. REAL-TIME TRENDING CAROUSELS
// =========================================================================
// GET /ai/trending - Calculate Most Viewed, Most Ordered, Most Saved, Fast Growing
aiRouter.get("/ai/trending", async (req: Request, res: Response) => {
  try {
    const data = await service.getTrendingSummary();
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 3. SIMILAR ITEM COMPASS (PRODUCT PAGE)
// =========================================================================
// GET /ai/similar/:id - You may also like, Similar, Frequently Bought Together, Best Alternatives, Customers Also Viewed
aiRouter.get("/ai/similar/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await service.getSimilarItems(id);
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(404).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 4. SMART AUTOCOMPLETE & AUTO-SUGGEST SEARCH SEARCH
// =========================================================================
// GET /ai/search - Advanced search with suggestions & nearby verification
aiRouter.get("/ai/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string || "";
    const lat = req.query.latitude ? Number(req.query.latitude) : undefined;
    const lon = req.query.longitude ? Number(req.query.longitude) : undefined;

    const data = await service.searchSmart(query, lat, lon);
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 5. TAILORED OVERSEAS JOBS MATCHING
// =========================================================================
// GET /ai/jobs - Matches overseas jobs against user experience / education credentials
aiRouter.get("/ai/jobs", async (req: Request, res: Response) => {
  try {
    const profile = {
      education: (req.query.education as string) || "Hospitality Certificate",
      experience: (req.query.experience as string) || "2 Years",
      languages: req.query.languages ? (req.query.languages as string).split(",") : ["English"],
      preferredCountry: req.query.preferredCountry as string,
      expectedSalary: req.query.expectedSalary ? Number(req.query.expectedSalary) : undefined
    };

    const data = await service.getJobRecommendations(profile);
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 6. TAILORED HOUSES BUDGET BOUND CHECK
// =========================================================================
// GET /ai/houses - Strict house recommendations between 0.95 and 1.05 of budget
aiRouter.get("/ai/houses", async (req: Request, res: Response) => {
  try {
    const budget = Number(req.query.budget || 4000000); // default 4 Million ETB
    const data = await service.getHouseRecommendations(budget);
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 7. HIGH REPUTATION VENDOR RECOMMENDATIONS
// =========================================================================
// GET /ai/vendors - Returns highly-rated, fast delivery, verified, active, nearby vendors
aiRouter.get("/ai/vendors", async (req: Request, res: Response) => {
  try {
    const data = await service.getVendorRecommendations();
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// ADDITIONAL AI UTILITY ENDPOINTS FOR NOTIFICATIONS, AUDITING, DASHBOARD
// =========================================================================

// POST /ai/fraud-check - Manual review trigger
aiRouter.post("/ai/fraud-check", async (req: Request, res: Response) => {
  try {
    const { type, targetId, content, price } = req.body;
    if (!type || !targetId || !content) {
      return res.status(400).json({ status: "error", error: "Missing required parameters: type, targetId, content" });
    }

    const data = await service.runFraudDetection(type, targetId, content, price);
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// GET /ai/notifications - Custom Smart notifications matching user activities
aiRouter.get("/ai/notifications", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || "u-2";
    const data = await service.getSmartNotifications(userId);
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// GET /ai/dashboard - Admin metrics and forecasting
aiRouter.get("/ai/dashboard", async (req: Request, res: Response) => {
  try {
    const data = await service.getAdminDashboardMetrics();
    return res.status(200).json({ status: "success", data });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});
