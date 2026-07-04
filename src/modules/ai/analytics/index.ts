export interface RecommendationEvent {
  id: string;
  userId?: string;
  itemId: string;
  type: "product" | "property" | "job";
  action: "impression" | "click" | "purchase" | "bookmark";
  timestamp: Date;
}

export class AIAnalyticsService {
  private events: RecommendationEvent[] = [];

  logEvent(userId: string | undefined, itemId: string, type: "product" | "property" | "job", action: "impression" | "click" | "purchase" | "bookmark") {
    this.events.push({
      id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      itemId,
      type,
      action,
      timestamp: new Date()
    });
  }

  getClickThroughRate(itemId: string): number {
    const itemEvents = this.events.filter(e => e.itemId === itemId);
    const impressions = itemEvents.filter(e => e.action === "impression").length;
    const clicks = itemEvents.filter(e => e.action === "click").length;

    if (impressions === 0) return 0;
    return parseFloat((clicks / impressions).toFixed(3));
  }

  getUserInterestsFromClicks(userId: string): string[] {
    const clicks = this.events.filter(e => e.userId === userId && e.action === "click");
    // Sort items by click frequency
    const itemMap = new Map<string, number>();
    clicks.forEach((c) => {
      itemMap.set(c.itemId, (itemMap.get(c.itemId) || 0) + 1);
    });
    return Array.from(itemMap.keys());
  }
}
