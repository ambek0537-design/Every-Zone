import { isMemoryDb } from "../../../../server";
import { overseasStore } from "../../overseas/repositories/overseas.repository";

export class AIRepository {
  async getProducts() {
    return isMemoryDb.products || [];
  }

  async getProperties() {
    return isMemoryDb.properties || [];
  }

  async getJobs() {
    return overseasStore.jobs || [];
  }

  async getVendors() {
    return isMemoryDb.vendors || [];
  }

  async getUsers() {
    return isMemoryDb.users || [];
  }

  async getSearchHistory() {
    return isMemoryDb.searchHistory || [];
  }

  async getFraudReports() {
    return isMemoryDb.fraudReports || [];
  }

  async getVendorRiskScores() {
    return isMemoryDb.vendorRiskScores || [];
  }

  async getSavedPosts() {
    return isMemoryDb.savedPosts || [];
  }

  async getTimelineAnalytics() {
    return isMemoryDb.timelineAnalytics || [];
  }

  async saveSearchHistory(search: any) {
    if (!isMemoryDb.searchHistory) {
      isMemoryDb.searchHistory = [];
    }
    isMemoryDb.searchHistory.push({
      id: `sh-${Date.now()}`,
      ...search,
      createdAt: new Date()
    });
  }

  async updateVendorRisk(vendorId: string, score: number, reason: string) {
    if (!isMemoryDb.vendorRiskScores) {
      isMemoryDb.vendorRiskScores = [];
    }
    const idx = isMemoryDb.vendorRiskScores.findIndex((r: any) => r.vendorId === vendorId);
    if (idx >= 0) {
      isMemoryDb.vendorRiskScores[idx].score = score;
      isMemoryDb.vendorRiskScores[idx].reason = reason;
      isMemoryDb.vendorRiskScores[idx].updatedAt = new Date();
    } else {
      isMemoryDb.vendorRiskScores.push({
        id: `vrisk-${Date.now()}`,
        vendorId,
        score,
        reason,
        updatedAt: new Date()
      });
    }
  }
}
