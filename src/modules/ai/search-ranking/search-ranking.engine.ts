export class SearchRankingEngine {
  /**
   * Sorts search results based on multidimensional weights
   */
  rankSearchResults(
    items: any[],
    query: string,
    options: {
      latitude?: number;
      longitude?: number;
    } = {}
  ): any[] {
    const q = (query || "").toLowerCase().trim();

    return items
      .map((item) => {
        let score = 0;

        const title = (item.title || item.name || "").toLowerCase();
        const desc = (item.description || item.descriptionAm || "").toLowerCase();

        // 1. Relevance text matches
        if (title === q) {
          score += 1000; // exact title match
        } else if (title.startsWith(q)) {
          score += 500;
        } else if (title.includes(q)) {
          score += 250;
        }

        if (desc.includes(q)) {
          score += 100;
        }

        // Split search words for broad matching
        const words = q.split(/\s+/);
        if (words.length > 1) {
          words.forEach((word) => {
            if (word.length > 2) {
              if (title.includes(word)) score += 50;
              if (desc.includes(word)) score += 10;
            }
          });
        }

        // 2. Verified Vendor Boost (Business Rule)
        const isVerified = item.isAgencyVerified || item.isVendorVerified || item.verified || false;
        if (isVerified) {
          score += 150;
        }

        // 3. Rating (0.0 to 5.0)
        const rating = item.rating || 4.0;
        score += rating * 30; // up to 150 points

        // 4. Trust Score (0 to 100)
        const trustScore = item.trustScore || (isVerified ? 90 : 60);
        score += trustScore * 1.5; // up to 150 points

        // 5. Distance Penalty (only if latitude/longitude is provided)
        if (options.latitude !== undefined && options.longitude !== undefined && item.latitude !== undefined && item.longitude !== undefined) {
          const lat1 = options.latitude;
          const lon1 = options.longitude;
          const lat2 = item.latitude;
          const lon2 = item.longitude;

          // Simple Manhattan distance for performance
          const distanceDeg = Math.abs(lat1 - lat2) + Math.abs(lon1 - lon2);
          // 1 degree in Addis is roughly 111km. If distance is within 2km (0.018 degrees), boost!
          if (distanceDeg < 0.02) {
            score += 100;
          } else {
            // Apply gradual penalty for extreme distance
            score -= Math.min(distanceDeg * 1000, 200);
          }
        }

        // 6. Popularity boost (clicks, views, purchases)
        const views = item.viewsCount || item.views || 0;
        score += Math.min(views * 0.1, 50);

        // 7. Freshness (created date)
        const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();
        const ageInDays = (Date.now() - createdAt.getTime()) / (1000 * 3600 * 24);
        if (ageInDays <= 1) {
          score += 100; // less than 24 hours
        } else if (ageInDays <= 7) {
          score += 50; // less than a week
        } else {
          score -= Math.min(ageInDays * 0.5, 50); // slight older penalty
        }

        return {
          ...item,
          aiSearchScore: Math.round(score),
        };
      })
      .sort((a, b) => b.aiSearchScore - a.aiSearchScore);
  }
}
