export class PersonalizationEngine {
  /**
   * Generates a personalized relevancy score for a listing based on user metrics
   */
  calculateRelevancy(
    item: any,
    userContext: {
      searchHistory?: string[];
      viewedProducts?: string[];
      wishlist?: string[];
      orders?: string[];
      favoriteCategories?: string[];
      location?: string;
      budget?: number;
      language?: string;
      previousClicks?: string[];
    }
  ): number {
    let score = 50; // baseline score out of 100

    const title = (item.title || item.name || "").toLowerCase();
    const description = (item.description || item.descriptionAm || "").toLowerCase();
    const categoryId = item.categoryId || item.category || "";
    const city = (item.city || "").toLowerCase();
    const subCity = (item.subCity || "").toLowerCase();
    const price = item.price || item.salaryNum || 0;

    // 1. Match Search History
    if (userContext.searchHistory && userContext.searchHistory.length > 0) {
      userContext.searchHistory.forEach((term) => {
        const termLower = term.toLowerCase();
        if (title.includes(termLower) || description.includes(termLower)) {
          score += 15;
        }
      });
    }

    // 2. Match Favorite Categories
    if (userContext.favoriteCategories && userContext.favoriteCategories.length > 0) {
      if (userContext.favoriteCategories.includes(categoryId)) {
        score += 20;
      }
    }

    // 3. Match Location (e.g. Bole, Addis Ababa, CMC, Saris)
    if (userContext.location && userContext.location.trim() !== "") {
      const locLower = userContext.location.toLowerCase();
      if (city.includes(locLower) || subCity.includes(locLower)) {
        score += 15;
      }
    }

    // 4. Budget constraints for houses vs products
    if (userContext.budget && userContext.budget > 0) {
      const budget = userContext.budget;
      // If it is a house, closer to the budget is better
      if (item.category === "houses" || item.propertyType) {
        const diff = Math.abs(price - budget);
        const ratio = diff / budget;
        if (ratio <= 0.05) {
          score += 25; // perfectly within +/- 5% range
        } else if (ratio <= 0.15) {
          score += 10; // within +/- 15% range
        } else if (price > budget) {
          score -= 15; // out of reach
        }
      } else {
        // Retail product budget: penalize if it exceeds user's budget
        if (price > budget) {
          score -= 20;
        } else if (price > budget * 0.7) {
          score += 10; // affordable sweet spot
        }
      }
    }

    // 5. Match Previous Clicks
    if (userContext.previousClicks && userContext.previousClicks.length > 0) {
      if (userContext.previousClicks.includes(item.id)) {
        score += 25; // highly relevant since user clicked it before
      }
    }

    // 6. Match Wishlisted Items
    if (userContext.wishlist && userContext.wishlist.length > 0) {
      if (userContext.wishlist.includes(item.id)) {
        score += 30;
      }
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Sort items by personalized score
   */
  rankItems(items: any[], userContext: any): any[] {
    return items
      .map((item) => ({
        ...item,
        aiRelevancyScore: this.calculateRelevancy(item, userContext),
      }))
      .sort((a, b) => b.aiRelevancyScore - a.aiRelevancyScore);
  }
}
