export interface TrendingMetrics {
  views: number;
  orders: number;
  saves: number;
  shares: number;
  velocity: number; // growth rate
  score: number;
}

export class TrendingEngine {
  /**
   * Calculates trending score for any given item
   */
  calculateTrendingScore(item: any, analytics: any = {}): number {
    // Read parameters from existing analytics if present, or fallback to properties on the item itself
    const views = analytics.views || item.viewsCount || Math.floor(100 + Math.random() * 900);
    const orders = analytics.orders || item.ordersCount || Math.floor(5 + Math.random() * 45);
    const saves = analytics.saves || item.savesCount || item.likesCount || Math.floor(10 + Math.random() * 150);
    const shares = analytics.shares || item.sharesCount || Math.floor(2 + Math.random() * 30);
    const growthRate = analytics.growthRate || (item.featured ? 1.5 : 1.0);

    // Weighted Formula:
    // Views (10%), Saves/Likes (25%), Shares (30%), Orders (35%) multiplied by the Growth Velocity factor
    const score = (views * 0.1 + saves * 2.5 + shares * 4.0 + orders * 8.0) * growthRate;
    return Math.round(score);
  }

  /**
   * Filters and sorts list to get trending products
   */
  getTrendingProducts(products: any[], analyticsList: any[] = []): any[] {
    return products
      .map((p) => {
        const itemAnalytics = analyticsList.find((a) => a.productId === p.id) || {};
        return {
          ...p,
          trendingScore: this.calculateTrendingScore(p, itemAnalytics),
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore);
  }

  /**
   * Filters and sorts list to get trending houses
   */
  getTrendingHouses(properties: any[], analyticsList: any[] = []): any[] {
    return properties
      .map((h) => {
        const itemAnalytics = analyticsList.find((a) => a.propertyId === h.id) || {};
        // Add additional boost for featured houses
        const score = this.calculateTrendingScore(h, itemAnalytics) + (h.featured ? 150 : 0);
        return {
          ...h,
          trendingScore: score,
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore);
  }

  /**
   * Filters and sorts list to get trending jobs
   */
  getTrendingJobs(jobs: any[]): any[] {
    return jobs
      .map((j) => {
        // Compute trend for jobs
        const views = j.viewsCount || Math.floor(80 + Math.random() * 600);
        const saves = j.savesCount || Math.floor(15 + Math.random() * 100);
        const applications = j.applicationsCount || Math.floor(3 + Math.random() * 35);
        const score = views * 0.1 + saves * 1.5 + applications * 10.0;
        return {
          ...j,
          trendingScore: Math.round(score),
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore);
  }

  /**
   * Sorts vendors by trending activity
   */
  getTrendingVendors(vendors: any[]): any[] {
    return vendors
      .map((v) => {
        const rating = v.rating || 4.2;
        const activeStatusBoost = v.subscriptionStatus === "ACTIVE" ? 200 : 0;
        const activity = Math.floor(50 + Math.random() * 500); // simulated sales/views
        const score = rating * 100 + activeStatusBoost + activity;
        return {
          ...v,
          trendingScore: Math.round(score),
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore);
  }
}
