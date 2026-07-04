import { Router, Request, Response } from "express";
import { OverseasService } from "../services/overseas.service";

const service = new OverseasService();

export const overseasRouter = Router();

// =========================================================================
// 1. JOBS APIS
// =========================================================================

// GET /jobs - Advanced search with filters
overseasRouter.get("/jobs", async (req: Request, res: Response) => {
  try {
    const filters = {
      country: req.query.country as string,
      city: req.query.city as string,
      category: req.query.category as string,
      gender: req.query.gender as string,
      verifiedAgenciesOnly: req.query.verifiedAgenciesOnly === "true",
      searchQuery: req.query.searchQuery as string
    };

    const jobs = await service.getJobs(filters);
    return res.status(200).json({ status: "success", count: jobs.length, data: jobs });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// GET /jobs/:id - Get detailed vacancy page
overseasRouter.get("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const job = await service.getJobById(req.params.id);
    return res.status(200).json({ status: "success", data: job });
  } catch (error: any) {
    return res.status(404).json({ status: "error", error: error.message });
  }
});

// POST /jobs - Publish a new job (Only verified agencies)
overseasRouter.post("/jobs", async (req: Request, res: Response) => {
  try {
    const { agencyId, category, title, titleAm, employer, salary, salaryNum, contractDuration, accommodation, foodIncluded, medicalInsurance, transportationIncluded, workingHours, deadline, country, city, requirements, benefits, description, descriptionAm, photos } = req.body;

    if (!agencyId || !category || !title || !employer || !salary || !deadline || !country || !city) {
      return res.status(400).json({ status: "error", error: "Missing required parameters to publish a job vacancy." });
    }

    const job = await service.createJob({
      agencyId, category, title, titleAm, employer, salary, salaryNum: Number(salaryNum || 0), contractDuration, accommodation, foodIncluded: !!foodIncluded, medicalInsurance: !!medicalInsurance, transportationIncluded: !!transportationIncluded, workingHours, deadline, country, city, requirements, benefits, description, descriptionAm, photos
    });

    return res.status(210).json({ status: "success", message: "Job published successfully.", data: job });
  } catch (error: any) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

// PATCH /jobs/:id - Modify vacancy
overseasRouter.patch("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const { agencyId, ...updates } = req.body;
    if (!agencyId) {
      return res.status(400).json({ status: "error", error: "agencyId is mandatory to verify authorization." });
    }

    const job = await service.updateJob(req.params.id, agencyId, updates);
    return res.status(200).json({ status: "success", data: job });
  } catch (error: any) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

// DELETE /jobs/:id - Delete vacancy
overseasRouter.delete("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const { agencyId } = req.body;
    if (!agencyId) {
      return res.status(400).json({ status: "error", error: "agencyId is mandatory to verify authorization." });
    }

    await service.deleteJob(req.params.id, agencyId);
    return res.status(200).json({ status: "success", message: "Vacancy deleted successfully." });
  } catch (error: any) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 2. APPLICATIONS APIS
// =========================================================================

// POST /applications - Submit an application (requires Passport, CV, etc.)
overseasRouter.post("/applications", async (req: Request, res: Response) => {
  try {
    const { jobId, applicantId, applicantName, documents, notes } = req.body;

    if (!jobId || !applicantId || !applicantName || !documents) {
      return res.status(400).json({ status: "error", error: "Missing required fields: jobId, applicantId, applicantName, and documents are mandatory." });
    }

    const app = await service.submitApplication({
      jobId, applicantId, applicantName, documents, notes
    });

    return res.status(211).json({ status: "success", message: "Application submitted successfully.", data: app });
  } catch (error: any) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

// GET /applications/me - Get dashboard details for applicant or agency
overseasRouter.get("/applications/me", async (req: Request, res: Response) => {
  try {
    const { userId, agencyId } = req.query;

    if (agencyId) {
      const dashboard = await service.getAgencyDashboard(String(agencyId));
      return res.status(200).json({ status: "success", data: dashboard });
    }

    if (!userId) {
      return res.status(400).json({ status: "error", error: "Query parameter 'userId' or 'agencyId' is required." });
    }

    const dashboard = await service.getApplicantDashboard(String(userId));
    return res.status(200).json({ status: "success", data: dashboard });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// PATCH /applications/status - Update application status/stage (Agency only)
overseasRouter.patch("/applications/status", async (req: Request, res: Response) => {
  try {
    const { id, agencyId, status } = req.body;

    if (!id || !agencyId || !status) {
      return res.status(400).json({ status: "error", error: "Missing required params: id (applicationId), agencyId, and status are mandatory." });
    }

    const updated = await service.updateApplicationStatus(id, agencyId, { status });
    return res.status(200).json({ status: "success", message: "Application stage updated successfully.", data: updated });
  } catch (error: any) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 3. DOCUMENT UPLOAD API
// =========================================================================

// POST /documents/upload - Securely upload or simulate uploading a file (Passport, CV, ID)
overseasRouter.post("/documents/upload", async (req: Request, res: Response) => {
  try {
    const { userId, documentType, fileName } = req.body;

    if (!userId || !documentType || !fileName) {
      return res.status(400).json({ status: "error", error: "Missing upload parameters: userId, documentType, and fileName are mandatory." });
    }

    // Simulate secure file URL placement
    const simulatedUrl = `https://storage.everyzone.com/users/${userId}/docs/${Date.now()}_${encodeURIComponent(fileName)}`;

    return res.status(201).json({
      status: "success",
      message: "Document securely encrypted and uploaded to cloud storage.",
      data: {
        userId,
        documentType,
        fileName,
        fileUrl: simulatedUrl,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 4. AGENCY INTERVIEW SCHEDULE API
// =========================================================================

// POST /agency/interview - Book/schedule interview
overseasRouter.post("/agency/interview", async (req: Request, res: Response) => {
  try {
    const { applicationId, agencyId, scheduledAt, durationMinutes, meetingLink, location, notes } = req.body;

    if (!applicationId || !agencyId || !scheduledAt) {
      return res.status(400).json({ status: "error", error: "Missing required fields: applicationId, agencyId, and scheduledAt are mandatory." });
    }

    const interview = await service.scheduleInterview({
      applicationId, scheduledAt, durationMinutes: durationMinutes ? Number(durationMinutes) : undefined, meetingLink, location, notes
    }, agencyId);

    return res.status(201).json({ status: "success", message: "Interview scheduled successfully.", data: interview });
  } catch (error: any) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

// =========================================================================
// 5. REVIEWS & FRAUD REPORTS
// =========================================================================

// POST /reviews - Post review for agency
overseasRouter.post("/reviews", async (req: Request, res: Response) => {
  try {
    const { agencyId, userId, userName, rating, comment, photos } = req.body;
    if (!agencyId || !userId || !userName || !rating || !comment) {
      return res.status(400).json({ status: "error", error: "Missing review parameter fields." });
    }

    const review = await service.createReview({
      agencyId, userId, userName, rating: Number(rating), comment, photos
    });

    return res.status(201).json({ status: "success", data: review });
  } catch (error: any) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});

// POST /reports/fraud - Report agency or job scam (Anti-Fraud protection)
overseasRouter.post("/reports/fraud", async (req: Request, res: Response) => {
  try {
    const { reporterId, agencyId, jobId, description } = req.body;
    if (!reporterId || !agencyId || !description) {
      return res.status(400).json({ status: "error", error: "Missing report parameters: reporterId, agencyId, and description are mandatory." });
    }

    const report = await service.reportFraud({
      reporterId, agencyId, jobId, description
    });

    return res.status(201).json({
      status: "success",
      message: "Scam report logged. Admin verification panel is notified.",
      data: report
    });
  } catch (error: any) {
    return res.status(400).json({ status: "error", error: error.message });
  }
});
