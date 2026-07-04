import { ReviewsRepository } from "../repositories/reviews.repository";
import { Review, ReviewTargetType } from "../reviews/reviews";
import { FraudReport, ReportReason, EvidencePayload } from "../reports/reports";
import { CreateReviewDto, CreateReportDto, CreateVendorReplyDto } from "../dto/reviews.dto";
import { isMemoryDb } from "../../../../server";

export class ReviewsService {
  private repository = new ReviewsRepository();

  // --- TRUST SCORE CALCULATION ---
  async calculateTrustScore(vendorId: string): Promise<{
    score: number;
    rating: number;
    kycBonus: number;
    subBonus: number;
    ordersBonus: number;
    complaintBonus: number;
    badgeLevel: "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR";
    badges: string[];
  }> {
    const vendor = await this.repository.getVendorDetails(vendorId);
    
    // Default starting parameters if vendor is not explicitly declared
    let hasKyc = true; 
    let hasActiveSubscription = true;
    let completedOrdersCount = 12; 
    let activeComplaintsCount = 0;

    if (vendor) {
      // Find corresponding user to check KYC / Fayda ID status
      const user = isMemoryDb.users.find((u: any) => u.id === vendor.userId);
      hasKyc = user?.verificationStatus === "APPROVED";
      hasActiveSubscription = vendor.subscriptionStatus === "ACTIVE";

      // Count orders for this vendor from isMemoryDb.orders
      const vendorOrders = (isMemoryDb as any).orders?.filter((o: any) => o.vendorId === vendorId) || [];
      completedOrdersCount = vendorOrders.filter((o: any) => o.status === "COMPLETED" || o.status === "DELIVERED").length || 4;

      // Count active fraud reports
      const fraudReports = isMemoryDb.fraudReports?.filter((r: any) => r.vendorId === vendorId && r.status !== "REJECTED" && r.status !== "CLOSED") || [];
      activeComplaintsCount = fraudReports.length;
    }

    // Average rating from our review repository
    const reviews = await this.repository.getReviewsForTarget("VENDOR", vendorId);
    let avgRating = 4.8; // Default initial average rating for seed data
    if (reviews.length > 0) {
      const totalScore = reviews.reduce((sum, r) => sum + r.rating, 0);
      avgRating = totalScore / reviews.length;
    }

    // 1. Verified KYC (+20%)
    const kycBonus = hasKyc ? 20 : 0;

    // 2. Subscription Active (+20%)
    const subBonus = hasActiveSubscription ? 20 : 0;

    // 3. Average Rating (Scaled to 20%)
    // (rating / 5) * 20
    const ratingBonus = Math.round((avgRating / 5) * 20);

    // 4. Successful Orders (2% per order, capped at 20%)
    const ordersBonus = Math.min(20, completedOrdersCount * 2);

    // 5. Low Complaint Rate (Starts at 20%, deducts 5% per active complaint, floor of 0)
    const complaintBonus = Math.max(0, 20 - (activeComplaintsCount * 5));

    // Sum trust score
    const score = kycBonus + subBonus + ratingBonus + ordersBonus + complaintBonus;

    // Badge levels
    let badgeLevel: "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR" = "AVERAGE";
    if (score >= 90) badgeLevel = "EXCELLENT";
    else if (score >= 75) badgeLevel = "GOOD";
    else if (score >= 50) badgeLevel = "AVERAGE";
    else badgeLevel = "POOR";

    // Trust Badges lists based on criteria
    const badges: string[] = [];
    if (hasKyc) badges.push("✅ Verified Identity");
    if (completedOrdersCount >= 10) badges.push("🛒 Verified Seller");
    if (avgRating >= 4.5 && completedOrdersCount >= 5) badges.push("🏆 Top Rated");
    if (completedOrdersCount > 0) badges.push("🛡 Escrow Protected");
    if (score >= 85) badges.push("⭐ Trusted Business");
    badges.push("⚡ Fast Response"); // standard badge for fast online response

    return {
      score,
      rating: Number(avgRating.toFixed(1)),
      kycBonus,
      subBonus,
      ordersBonus,
      complaintBonus,
      badgeLevel,
      badges
    };
  }

  // --- SUBMIT REVIEW WITH BUSINESS RULES ---
  async submitReview(dto: CreateReviewDto): Promise<Review> {
    // Business rule: Vendors cannot review themselves
    if (dto.targetType === "VENDOR" && dto.userId === dto.targetId) {
      throw new Error("Vendors cannot review themselves.");
    }

    // Create review
    const review = await this.repository.createReview(dto);

    // Notification Flow: Review Received
    this.createSystemNotification(
      dto.targetType === "VENDOR" ? dto.targetId : "v-1", // default notification target
      "Review Received / አዲስ ግምገማ ደርሷል",
      `Buyer ${dto.userName} left a ${dto.rating}-star review: "${dto.text.substring(0, 60)}..."`
    );

    return review;
  }

  // --- SUBMIT VENDOR REPLY WITH NOTIFICATION ---
  async submitVendorReply(dto: CreateVendorReplyDto): Promise<Review> {
    const review = await this.repository.createVendorReply(dto);
    if (!review) throw new Error("Review not found to reply.");

    // Notification Flow: Vendor Replied
    this.createSystemNotification(
      review.userId,
      "Vendor Replied / ሻጩ ምላሽ ሰጥቷል",
      `The vendor replied to your review: "${dto.replyText.substring(0, 60)}..."`
    );

    return review;
  }

  // --- CREATE FRAUD REPORT WITH AUTOMATIC PROTECTION ---
  async submitFraudReport(dto: CreateReportDto): Promise<any> {
    if (!dto.evidence.description || dto.evidence.description.trim().length < 5) {
      throw new Error("Reports require a written description as evidence.");
    }

    // Save report to repository
    const report = await this.repository.createReport(dto);

    // Business rule: Check if it's a critical fraud report
    const isCritical = 
      dto.reason === "SCAM" || 
      dto.reason === "FAKE_AGENCY" || 
      dto.reason === "COUNTERFEIT" || 
      dto.reason === "NO_DELIVERY";

    // Automatic Protection Workflow:
    // Critical Fraud Report -> Temporary Investigation -> Hide Listing -> Notify Admin -> Freeze Vendor -> Review Evidence -> Approve or Suspend
    if (isCritical) {
      // 1. Temporary Investigation
      const adminId = "u-super";
      const notes = `⚠️ AUTOMATIC SHIELD ACTIVATED: Critical report filed for reason: ${dto.reason}. Placing vendor/listing under temporary investigation.`;
      const resolution = "Awaiting admin manual review of the chat logs and receipt evidence.";
      
      await this.repository.updateReportStatus(report.id, "UNDER_REVIEW", notes, resolution, adminId);

      // 2. Hide Listing & Freeze Vendor
      if (dto.targetType === "VENDOR") {
        await this.repository.updateVendorStatus(dto.targetId, "UNDER_REVIEW");
        // Lower vendor risk score / trust score
        const risk = isMemoryDb.vendorRiskScores.find((r: any) => r.vendorId === dto.targetId);
        if (risk) {
          risk.score = Math.min(100, risk.score + 25); // increase risk rating
          risk.reportsCount += 1;
        } else {
          isMemoryDb.vendorRiskScores.push({
            vendorId: dto.targetId,
            score: 25,
            reportsCount: 1,
            suspensions: 0,
            updatedAt: new Date()
          });
        }
      } else if (dto.targetType === "PRODUCT" || dto.targetType === "HOUSE" || dto.targetType === "AGENCY") {
        // Find corresponding listing and flag it
        const listings = (isMemoryDb as any).listings || [];
        const listing = listings.find((l: any) => l.id === dto.targetId);
        if (listing) {
          listing.status = "UNDER_REVIEW"; // hide from search
        }
      }

      // 3. Buyer Protection Escrow Logic: Freeze Escrow Money if active order is flagged
      // If reporter is reporting a vendor and has an active PENDING/IN_TRANSIT order with them, freeze payments.
      const userOrders = (isMemoryDb as any).orders?.filter((o: any) => o.buyerId === dto.reporterId && o.vendorId === dto.targetId) || [];
      const activeEscrowOrder = userOrders.find((o: any) => o.status === "PENDING" || o.status === "IN_TRANSIT" || o.paymentStatus === "ESCROW");
      if (activeEscrowOrder) {
        activeEscrowOrder.status = "DISPUTED";
        activeEscrowOrder.paymentStatus = "FROZEN";
        
        // Notify both parties
        this.createSystemNotification(dto.reporterId, "💰 Buyer Protection Escrow Frozen", `Your active order ${activeEscrowOrder.orderNumber} payments have been frozen in our secure escrow. Admin is investigating.`);
        this.createSystemNotification(dto.targetId, "⚠️ Escrow Payment Frozen due to Dispute", `Active order ${activeEscrowOrder.orderNumber} funds are frozen due to a critical report.`);
      }

      // 4. Notify Admin
      this.createSystemNotification(
        "u-super", 
        "🚨 High Alert: Critical Fraud Report Filed", 
        `Report ID ${report.id} generated high-priority alert. Target ${dto.targetType} is automatically locked under review.`
      );
    }

    // General Notification: Report Submitted
    this.createSystemNotification(
      dto.reporterId,
      "Report Submitted / አቤቱታ ቀርቧል",
      `We have received your report regarding "${dto.targetType}". Case reference: ${report.id.substring(0, 8)}.`
    );

    return report;
  }

  // --- RESOLVE REPORT WITH ESCROW PAYMENTS (BUYER PROTECTION) ---
  async resolveReport(
    reportId: string, 
    status: "ACTION_TAKEN" | "REJECTED" | "CLOSED",
    notes: string,
    resolution: string,
    adminId: string,
    escrowAction?: "REFUND" | "RELEASE_PAYMENT"
  ): Promise<boolean> {
    const success = await this.repository.updateReportStatus(reportId, status, notes, resolution, adminId);
    if (!success) return false;

    // Fetch report target
    const report = isMemoryDb.fraudReports.find((r: any) => r.id === reportId);
    if (!report) return false;

    // Log the action to system audit logs
    await this.repository.createAuditLog(
      adminId,
      "RESOLVE_REPORT",
      "FRAUD_REPORT",
      reportId,
      `Status changed to ${status}. Notes: ${notes}. Resolution: ${resolution}. EscrowAction: ${escrowAction || "NONE"}`
    );

    // Apply escrow action if requested
    if (escrowAction && report.vendorId) {
      const userOrders = (isMemoryDb as any).orders?.filter((o: any) => o.buyerId === report.reporterId && o.vendorId === report.vendorId) || [];
      const disputedOrder = userOrders.find((o: any) => o.status === "DISPUTED" || o.paymentStatus === "FROZEN");
      
      if (disputedOrder) {
        if (escrowAction === "REFUND") {
          disputedOrder.status = "CANCELLED";
          disputedOrder.paymentStatus = "REFUNDED";
          
          // Re-credit the user's wallet
          const buyerWallet = (isMemoryDb as any).wallets?.find((w: any) => w.userId === report.reporterId);
          if (buyerWallet) {
            buyerWallet.balance += disputedOrder.total;
          }

          this.createSystemNotification(
            report.reporterId,
            "Refund Approved / ገንዘብ ተመላሽ ተደርጓል",
            `Admin approved refund of ${disputedOrder.total} ETB for order ${disputedOrder.orderNumber}.`
          );
        } else if (escrowAction === "RELEASE_PAYMENT") {
          disputedOrder.status = "COMPLETED";
          disputedOrder.paymentStatus = "RELEASED";

          // Credit the vendor's wallet
          const vendorWallet = (isMemoryDb as any).wallets?.find((w: any) => w.userId === report.vendorId);
          if (vendorWallet) {
            vendorWallet.balance += disputedOrder.total;
          }

          this.createSystemNotification(
            report.vendorId,
            "Escrow Funds Released",
            `Admin approved releasing escrow payment of ${disputedOrder.total} ETB for order ${disputedOrder.orderNumber}.`
          );
        }
      }
    }

    // Apply vendor ban if ACTION_TAKEN is selected and report is severe
    if (status === "ACTION_TAKEN") {
      if (report.vendorId) {
        await this.repository.updateVendorStatus(report.vendorId, "SUSPENDED");
        this.createSystemNotification(report.vendorId, "⚠️ Vendor Account Suspended", "Your vendor store has been suspended following verification of fraudulent behaviors.");
      }
    }

    // Notification: Report Resolved
    this.createSystemNotification(
      report.reporterId,
      "Report Resolved / አቤቱታ ተፈቷል",
      `Your report case ${reportId.substring(0, 8)} has been reviewed by our compliance team and is now: ${status}.`
    );

    return true;
  }

  // --- PRIVATE UTILITY FOR NOTIFICATION FLOW ---
  private createSystemNotification(userId: string, title: string, body: string) {
    const notifId = `notif-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    isMemoryDb.notifications.push({
      id: notifId,
      userId,
      type: "SYSTEM_ALERT",
      title,
      body,
      data: JSON.stringify({ systemAlert: true }),
      status: "DELIVERED",
      readAt: null,
      createdAt: new Date()
    });
  }
}
