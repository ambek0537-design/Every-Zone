import { prisma, useDbFallback, isMemoryDb } from "../../../../server";
import { Review, ReviewTargetType } from "../reviews/reviews";
import { FraudReport, ReportTargetType, ReportReason, EvidencePayload } from "../reports/reports";
import { AuditLog, VendorStatus } from "../moderation/moderation";
import { CreateReviewDto, UpdateReviewDto, CreateReportDto, CreateVendorReplyDto } from "../dto/reviews.dto";

export class ReviewsRepository {
  private get reviewsStore(): Review[] {
    if (!isMemoryDb) return [];
    if (!(isMemoryDb as any).reviews) {
      (isMemoryDb as any).reviews = [
        {
          id: "r-mock-1",
          targetType: "PRODUCT",
          targetId: "l1",
          userId: "u-2",
          userName: "Selamawit Tekle",
          rating: 5,
          text: "Premium handwoven golden Habesha Kemis is stunningly beautiful! Highly recommended.",
          photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"],
          videos: [],
          isVerifiedPurchase: true,
          helpfulVotes: 42,
          votedUserIds: [],
          vendorReply: "Thank you for shopping with us. We appreciate your feedback.",
          vendorRepliedAt: new Date(),
          createdAt: new Date(Date.now() - 3600000 * 48),
          updatedAt: new Date(Date.now() - 3600000 * 48)
        },
        {
          id: "r-mock-2",
          targetType: "VENDOR",
          targetId: "v1",
          userId: "u-2",
          userName: "Selamawit Tekle",
          rating: 5,
          text: "Excellent craftsmanship! Chapa escrow protection gave me total peace of mind.",
          photos: ["https://images.unsplash.com/photo-1525299374597-9115d90c3d3e?auto=format&fit=crop&q=80&w=300"],
          videos: [],
          isVerifiedPurchase: true,
          helpfulVotes: 12,
          votedUserIds: [],
          vendorReply: "Thank you Selamawit! We take great pride in our heritage weaving and direct digital clearance.",
          vendorRepliedAt: new Date(Date.now() - 3600000 * 12),
          createdAt: new Date(Date.now() - 3600000 * 24),
          updatedAt: new Date(Date.now() - 3600000 * 24)
        },
        {
          id: "r-mock-3",
          targetType: "VENDOR",
          targetId: "v1",
          userId: "u-sub1",
          userName: "Gideon Sol",
          rating: 5,
          text: "Very professional seller. Highly recommended for genuine items.",
          photos: ["https://images.unsplash.com/photo-1590534247854-e97d5e3feef6?auto=format&fit=crop&q=80&w=300"],
          videos: [],
          isVerifiedPurchase: true,
          helpfulVotes: 8,
          votedUserIds: [],
          vendorReply: "Much appreciated Gideon! Your continuous support on Every-zone means everything to us.",
          vendorRepliedAt: new Date(Date.now() - 3600000 * 24),
          createdAt: new Date(Date.now() - 3600000 * 48),
          updatedAt: new Date(Date.now() - 3600000 * 48)
        },
        {
          id: "r-mock-4",
          targetType: "VENDOR",
          targetId: "v2",
          userId: "u-2",
          userName: "Selamawit Tekle",
          rating: 5,
          text: "The coffee roasting is absolutely exquisite! Real Yirgacheffe fragrance.",
          photos: ["https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&q=80&w=300"],
          videos: [],
          isVerifiedPurchase: true,
          helpfulVotes: 15,
          votedUserIds: [],
          vendorReply: "Fantastic feedback! We look forward to custom roasting your next premium bundle.",
          vendorRepliedAt: new Date(Date.now() - 3600000 * 4),
          createdAt: new Date(Date.now() - 3600000 * 12),
          updatedAt: new Date(Date.now() - 3600000 * 12)
        }
      ] as Review[];
    }
    return (isMemoryDb as any).reviews;
  }

  private get auditLogsStore(): AuditLog[] {
    if (!isMemoryDb) return [];
    if (!(isMemoryDb as any).auditLogs) {
      (isMemoryDb as any).auditLogs = [
        {
          id: "log-1",
          action: "INITIAL_SEED",
          adminId: "u-super",
          targetType: "SYSTEM",
          targetId: "SYSTEM",
          details: "System audit logging initialized successfully.",
          createdAt: new Date()
        }
      ] as AuditLog[];
    }
    return (isMemoryDb as any).auditLogs;
  }

  // --- REVIEWS METHODS ---
  async createReview(dto: CreateReviewDto): Promise<Review> {
    const reviewId = `rev-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const review: Review = {
      id: reviewId,
      targetType: dto.targetType,
      targetId: dto.targetId,
      userId: dto.userId,
      userName: dto.userName,
      rating: dto.rating,
      text: dto.text,
      photos: dto.photos || [],
      videos: dto.videos || [],
      isVerifiedPurchase: dto.isVerifiedPurchase ?? true,
      helpfulVotes: 0,
      votedUserIds: [],
      vendorReply: null,
      vendorRepliedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.reviewsStore.push(review);
    return review;
  }

  async getReviewById(id: string): Promise<Review | null> {
    return this.reviewsStore.find(r => r.id === id) || null;
  }

  async updateReview(id: string, dto: UpdateReviewDto): Promise<Review | null> {
    const review = this.reviewsStore.find(r => r.id === id);
    if (!review) return null;

    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.text !== undefined) review.text = dto.text;
    if (dto.photos !== undefined) review.photos = dto.photos;
    if (dto.videos !== undefined) review.videos = dto.videos;
    review.updatedAt = new Date();

    return review;
  }

  async deleteReview(id: string): Promise<boolean> {
    const index = this.reviewsStore.findIndex(r => r.id === id);
    if (index === -1) return false;
    this.reviewsStore.splice(index, 1);
    return true;
  }

  async getReviewsForTarget(targetType: ReviewTargetType, targetId: string): Promise<Review[]> {
    return this.reviewsStore.filter(r => r.targetType === targetType && r.targetId === targetId);
  }

  // --- VENDOR REPLY METHOD ---
  async createVendorReply(dto: CreateVendorReplyDto): Promise<Review | null> {
    const review = this.reviewsStore.find(r => r.id === dto.reviewId);
    if (!review) return null;

    review.vendorReply = dto.replyText;
    review.vendorRepliedAt = new Date();
    return review;
  }

  // --- HELPFUL VOTE METHOD ---
  async toggleHelpfulVote(reviewId: string, userId: string): Promise<{ helpfulVotes: number; hasVoted: boolean } | null> {
    const review = this.reviewsStore.find(r => r.id === reviewId);
    if (!review) return null;

    const hasVoted = review.votedUserIds.includes(userId);
    if (hasVoted) {
      // Remove vote
      review.votedUserIds = review.votedUserIds.filter(id => id !== userId);
      review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
    } else {
      // Add vote
      review.votedUserIds.push(userId);
      review.helpfulVotes += 1;
    }

    return { helpfulVotes: review.helpfulVotes, hasVoted: !hasVoted };
  }

  // --- FRAUD REPORT SYSTEM ---
  async createReport(dto: CreateReportDto): Promise<any> {
    const reportId = `rep-${Date.now()}`;
    const report = {
      id: reportId,
      reporterId: dto.reporterId,
      vendorId: dto.targetType === "VENDOR" ? dto.targetId : null,
      orderId: null, // can be linked later if order context exists
      reportType: dto.reason,
      targetType: dto.targetType,
      targetId: dto.targetId,
      description: dto.evidence.description,
      status: "PENDING" as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in global isMemoryDb.fraudReports to sync perfectly with existing dashboard
    isMemoryDb.fraudReports.push(report);

    // Store evidence in reportEvidences
    if (dto.evidence.screenshotUrl) {
      isMemoryDb.reportEvidences.push({
        id: `ev-${Date.now()}-sc`,
        reportId,
        fileUrl: dto.evidence.screenshotUrl,
        fileType: "image/png",
        uploadedAt: new Date()
      });
    }
    if (dto.evidence.photoUrl) {
      isMemoryDb.reportEvidences.push({
        id: `ev-${Date.now()}-ph`,
        reportId,
        fileUrl: dto.evidence.photoUrl,
        fileType: "image/jpeg",
        uploadedAt: new Date()
      });
    }

    // Add admin queue element
    isMemoryDb.adminQueues.push({
      id: `q-${Date.now()}`,
      reportId,
      priority: dto.reason === "SCAM" ? 5 : 2, // scam is critical/high priority
      assignedAdmin: null,
      status: "PENDING",
      createdAt: new Date()
    });

    return report;
  }

  async getReportsForUser(userId: string): Promise<any[]> {
    return isMemoryDb.fraudReports.filter((r: any) => r.reporterId === userId);
  }

  async getAllReports(): Promise<any[]> {
    return isMemoryDb.fraudReports;
  }

  async updateReportStatus(
    id: string,
    status: "PENDING" | "UNDER_REVIEW" | "ACTION_TAKEN" | "REJECTED" | "CLOSED",
    notes: string,
    resolution: string,
    adminId: string
  ): Promise<boolean> {
    const report = isMemoryDb.fraudReports.find((r: any) => r.id === id);
    if (!report) return false;

    report.status = status;
    report.updatedAt = new Date();

    // Upsert investigation details
    let inv = isMemoryDb.investigations.find((i: any) => i.reportId === id);
    if (!inv) {
      inv = {
        id: `inv-${Date.now()}`,
        reportId: id,
        adminId,
        notes,
        resolution,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      isMemoryDb.investigations.push(inv);
    } else {
      inv.notes = notes;
      inv.resolution = resolution;
      inv.updatedAt = new Date();
    }

    // Update queue status
    const q = isMemoryDb.adminQueues.find((qi: any) => qi.reportId === id);
    if (q) {
      q.status = status;
    }

    return true;
  }

  // --- VENDOR MODERATION STATUS & TRUSTS ---
  async getVendorDetails(vendorId: string): Promise<any | null> {
    return isMemoryDb.vendors.find((v: any) => v.id === vendorId) || null;
  }

  async updateVendorStatus(vendorId: string, status: VendorStatus): Promise<boolean> {
    const vendor = isMemoryDb.vendors.find((v: any) => v.id === vendorId);
    if (!vendor) return false;

    vendor.subscriptionStatus = status; // active, suspended, under_review, banned
    return true;
  }

  // --- AUDIT LOGS ---
  async createAuditLog(
    adminId: string,
    action: string,
    targetType: string,
    targetId: string,
    details: string
  ): Promise<AuditLog> {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      action,
      adminId,
      targetType,
      targetId,
      details,
      createdAt: new Date()
    };
    this.auditLogsStore.push(log);
    return log;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogsStore;
  }
}
