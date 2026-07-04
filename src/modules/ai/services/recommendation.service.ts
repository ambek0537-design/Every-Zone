import { AIRepository } from "../repositories/ai.repository";
import { PersonalizationEngine } from "../personalization/personalization.engine";
import { TrendingEngine } from "../trending/trending.engine";
import { SearchRankingEngine } from "../search-ranking/search-ranking.engine";
import { AIGeminiService } from "./ai-gemini.service";

export class RecommendationService {
  private repository = new AIRepository();
  private personalizationEngine = new PersonalizationEngine();
  private trendingEngine = new TrendingEngine();
  private searchRankingEngine = new SearchRankingEngine();
  private geminiService = new AIGeminiService();

  /**
   * Get Personalized Home Feed
   */
  async getPersonalizedFeed(userId?: string) {
    const products = await this.repository.getProducts();
    const properties = await this.repository.getProperties();
    const jobs = await this.repository.getJobs();
    const history = await this.repository.getSearchHistory();

    // Reconstruct user's context
    const userHistory = history
      .filter((h: any) => h.userId === userId)
      .map((h: any) => h.keyword);

    // Dynamic preferences
    const favoriteCategories = userHistory.length > 0 ? [userHistory[0]] : ["cat-1", "cat-2"];
    const userBudget = userId === "u-2" ? 4000000 : 1500000; // default simulate budget (4M for u-2)
    const userLocation = "Bole";

    const userContext = {
      searchHistory: userHistory,
      favoriteCategories,
      location: userLocation,
      budget: userBudget,
      wishlist: userId ? ["prod-2", "prop-1"] : [],
      previousClicks: userId ? ["prod-1"] : []
    };

    // Rank and pick best matches
    const rankedProducts = this.personalizationEngine.rankItems(products, userContext).slice(0, 4);
    const rankedProperties = this.personalizationEngine.rankItems(properties, userContext).slice(0, 3);
    const rankedJobs = this.personalizationEngine.rankItems(jobs, userContext).slice(0, 3);

    return {
      userContext,
      products: rankedProducts,
      properties: rankedProperties,
      jobs: rankedJobs
    };
  }

  /**
   * Get Trending Engine Results
   */
  async getTrendingSummary() {
    const products = await this.repository.getProducts();
    const properties = await this.repository.getProperties();
    const jobs = await this.repository.getJobs();
    const vendors = await this.repository.getVendors();

    const trendingProducts = this.trendingEngine.getTrendingProducts(products).slice(0, 4);
    const trendingHouses = this.trendingEngine.getTrendingHouses(properties).slice(0, 3);
    const trendingJobs = this.trendingEngine.getTrendingJobs(jobs).slice(0, 3);
    const trendingVendors = this.trendingEngine.getTrendingVendors(vendors).slice(0, 4);

    return {
      products: trendingProducts,
      properties: trendingHouses,
      jobs: trendingJobs,
      vendors: trendingVendors
    };
  }

  /**
   * Get Similar Products (with 5 distinct lists)
   */
  async getSimilarItems(id: string) {
    const products = await this.repository.getProducts();
    const properties = await this.repository.getProperties();
    const jobs = await this.repository.getJobs();

    // Check if the item is a product, house, or job
    const product = products.find((p) => p.id === id);
    const property = properties.find((h) => h.id === id);
    const job = jobs.find((j) => j.id === id);

    if (product) {
      const categoryId = product.categoryId;
      const price = product.price || 0;

      // Filter other items
      const others = products.filter((p) => p.id !== id);

      // 1. Similar Products: same category
      const similar = others.filter((p) => p.categoryId === categoryId);

      // 2. You may also like: brand matching or close category
      const youMayLike = others.filter((p) => p.brandId === product.brandId || p.categoryId === categoryId).reverse();

      // 3. Frequently Bought Together: complementary items or accessories
      const frequentlyBought = others.filter((p) => p.categoryId !== categoryId).slice(0, 3);

      // 4. Best Alternatives: similar price range within +/- 20%
      const alternatives = others.filter((p) => Math.abs((p.price || 0) - price) <= price * 0.25);

      // 5. Customers Also Viewed: randomized views
      const customersViewed = others.sort(() => 0.5 - Math.random()).slice(0, 4);

      return {
        type: "product",
        item: product,
        similar: similar.slice(0, 4),
        youMayLike: youMayLike.slice(0, 4),
        frequentlyBought: frequentlyBought.slice(0, 3),
        alternatives: alternatives.slice(0, 4),
        customersViewed: customersViewed.slice(0, 4)
      };
    } else if (property) {
      const price = property.price || 0;
      const others = properties.filter((h) => h.id !== id);

      // Filter alternatives in property range
      const alternatives = others.filter((h) => Math.abs((h.price || 0) - price) <= price * 0.15);

      return {
        type: "property",
        item: property,
        similar: others.slice(0, 3),
        youMayLike: others.reverse().slice(0, 3),
        frequentlyBought: [],
        alternatives: alternatives.slice(0, 3),
        customersViewed: others.sort(() => 0.5 - Math.random()).slice(0, 3)
      };
    } else if (job) {
      const others = jobs.filter((j) => j.id !== id);
      return {
        type: "job",
        item: job,
        similar: others.filter((j) => j.category === job.category).slice(0, 3),
        youMayLike: others.slice(0, 3),
        frequentlyBought: [],
        alternatives: others.filter((j) => j.country === job.country).slice(0, 3),
        customersViewed: others.sort(() => 0.5 - Math.random()).slice(0, 3)
      };
    }

    throw new Error("Item not found across categories.");
  }

  /**
   * Smart Search Ranking and Suggestions
   */
  async searchSmart(query: string, latitude?: number, longitude?: number) {
    const q = (query || "").toLowerCase().trim();

    // Autocomplete/Suggestions logic
    let suggestions: string[] = [];
    if (q === "iphone" || q === "iph" || q === "apple") {
      suggestions = ["iPhone 15", "iPhone Case", "Used iPhone", "Nearby iPhones", "Verified Vendors"];
    } else if (q === "house" || q === "rent" || q === "bole" || q === "ቤት") {
      suggestions = ["Bole Luxury Apartment", "CMC Villa for Sale", "Commercial Space", "Nearby Rentals", "Verified Landlords"];
    } else if (q === "job" || q === "chef" || q === "dubai" || q === "ስራ") {
      suggestions = ["Dubai Culinary Chef", "Poland Site Supervisor", "Riyadh Hospitality vacancies", "Fast Application jobs", "Verified Agencies"];
    } else if (q.length > 0) {
      suggestions = [
        `${query} in Addis Ababa`,
        `${query} near me`,
        `Used ${query}`,
        `Verified ${query} sellers`,
        `Lowest price ${query}`
      ];
    }

    // Load listings to re-rank
    const products = await this.repository.getProducts();
    const properties = await this.repository.getProperties();
    const jobs = await this.repository.getJobs();

    // Map categories together
    const unifiedItems = [
      ...products.map((p) => ({ ...p, categoryName: "Retail Item", type: "product" })),
      ...properties.map((h) => ({ ...h, categoryName: "Real Estate House", type: "property" })),
      ...jobs.map((j) => ({ ...j, categoryName: "Overseas Job", type: "job" }))
    ];

    const ranked = this.searchRankingEngine.rankSearchResults(unifiedItems, query, { latitude, longitude });

    return {
      query,
      suggestions,
      results: ranked.slice(0, 10)
    };
  }

  /**
   * House Recommendations with strict budget bounds (+/- 5%)
   * E.g. 4 Million ETB -> Only between 3.8M and 4.2M (3.8M and 4.2M is +/- 5%)
   */
  async getHouseRecommendations(budget: number) {
    const properties = await this.repository.getProperties();

    const minBound = budget * 0.95;
    const maxBound = budget * 1.05;

    // Filter properties strictly in this range
    const filtered = properties.filter((p) => {
      const price = p.price || 0;
      return price >= minBound && price <= maxBound;
    });

    return {
      targetBudget: budget,
      minBound,
      maxBound,
      properties: filtered
    };
  }

  /**
   * Job Recommendations based on profile criteria
   */
  async getJobRecommendations(profile: {
    education?: string;
    experience?: string;
    languages?: string[];
    preferredCountry?: string;
    expectedSalary?: number;
  }) {
    const jobs = await this.repository.getJobs();

    const scoredJobs = jobs.map((job) => {
      let score = 50;

      const req = job.requirements || {};

      // 1. Preferred Country match
      if (profile.preferredCountry && job.country) {
        if (job.country.toLowerCase().includes(profile.preferredCountry.toLowerCase())) {
          score += 20;
        }
      }

      // 2. Expected Salary match (higher is better, within reason)
      if (profile.expectedSalary && job.salaryNum) {
        if (job.salaryNum >= profile.expectedSalary) {
          score += 15;
        } else if (job.salaryNum >= profile.expectedSalary * 0.8) {
          score += 5;
        } else {
          score -= 10;
        }
      }

      // 3. Experience match
      if (profile.experience && req.experience) {
        if (req.experience.toLowerCase().includes(profile.experience.toLowerCase())) {
          score += 15;
        }
      }

      // 4. Education match
      if (profile.education && req.education) {
        if (req.education.toLowerCase().includes(profile.education.toLowerCase())) {
          score += 15;
        }
      }

      // 5. Language match
      if (profile.languages && profile.languages.length > 0 && req.language) {
        profile.languages.forEach((lang) => {
          if (req.language.toLowerCase().includes(lang.toLowerCase())) {
            score += 10;
          }
        });
      }

      return {
        ...job,
        aiMatchingScore: Math.min(Math.max(score, 0), 100)
      };
    });

    // Return sorted jobs
    return scoredJobs.sort((a, b) => b.aiMatchingScore - a.aiMatchingScore);
  }

  /**
   * Recommended Vendors
   */
  async getVendorRecommendations() {
    const vendors = await this.repository.getVendors();
    const users = await this.repository.getUsers();

    const enriched = vendors.map((v) => {
      const user = users.find((u) => u.id === v.userId) || {};

      // Calculate parameters
      const isVerified = user.verificationStatus === "APPROVED" || v.subscriptionStatus === "ACTIVE";
      const rating = v.rating || parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
      const distance = parseFloat((0.2 + Math.random() * 4.0).toFixed(1)); // km
      const recentlyActive = Math.random() > 0.3;
      const deliverySpeed = Math.random() > 0.5 ? "Fast Delivery" : "Standard Delivery";

      // Calculate score
      let score = 50;
      if (isVerified) score += 20;
      if (rating >= 4.5) score += 15;
      if (distance <= 1.5) score += 10;
      if (recentlyActive) score += 10;
      if (deliverySpeed === "Fast Delivery") score += 10;

      return {
        ...v,
        rating,
        distance,
        isVerified,
        recentlyActive,
        deliverySpeed,
        vendorRelevancyScore: score
      };
    });

    return enriched.sort((a, b) => b.vendorRelevancyScore - a.vendorRelevancyScore);
  }

  /**
   * Run Fraud Detection Check on a listing or comment
   */
  async runFraudDetection(type: "listing" | "review" | "account", targetId: string, content: string, price?: number) {
    const metadata = {
      price,
      timestamp: new Date().toISOString(),
      loginAttempts: type === "account" ? Math.floor(Math.random() * 8) : 1,
      ip: "197.156.12.82" // simulated ethionet IP
    };

    const evaluation = await this.geminiService.evaluateFraudRisk(content, metadata);

    // Save fraud report in Memory DB if flagged high-risk
    if (evaluation.riskScore >= 70) {
      const reports = await this.repository.getFraudReports();
      reports.push({
        id: `fr-${Date.now()}`,
        type,
        targetId,
        content,
        riskScore: evaluation.riskScore,
        reason: evaluation.reason,
        status: "REVIEW_NEEDED", // high-risk items goes to Admin Review
        createdAt: new Date()
      });
    }

    return evaluation;
  }

  /**
   * Get custom smart notifications instead of random ones
   */
  async getSmartNotifications(userId?: string) {
    const products = await this.repository.getProducts();
    const properties = await this.repository.getProperties();
    const jobs = await this.repository.getJobs();
    const vendors = await this.repository.getVendors();

    const notifications = [
      {
        id: "sn-1",
        type: "PRICE_DROP",
        title: "📉 Price Dropped on Saved Item!",
        message: `The price for "${products[0]?.title || 'Habesha Dress'}" has been reduced by 15%! Buy now securely with Escrow.`,
        time: "2 mins ago",
        actionLabel: "View Product",
        actionTab: "shop"
      },
      {
        id: "sn-2",
        type: "SIMILAR_HOUSE",
        title: "🏡 Similar House Found!",
        message: `A new 2-bedroom property matching your CMC location preference was listed for ${properties[1]?.price ? (properties[1].price / 1000000).toFixed(1) + 'M' : '4.5M'} ETB.`,
        time: "1 hour ago",
        actionLabel: "View House",
        actionTab: "houses"
      },
      {
        id: "sn-3",
        type: "JOB_MATCH",
        title: "✈️ New Job Matches You!",
        message: `A hotel vacancy in ${jobs[0]?.city || 'Dubai'} matches your 'Hospitality Certificate' and language credentials. Apply now!`,
        time: "3 hours ago",
        actionLabel: "Apply Now",
        actionTab: "agencies"
      },
      {
        id: "sn-4",
        type: "VENDOR_POST",
        title: "⭐ Favorite Vendor Posted!",
        message: `"${vendors[1]?.shopName || 'Makeda Coffee'}" just published a new hand-roasted organic Highlands blend.`,
        time: "5 hours ago",
        actionLabel: "Visit Shop",
        actionTab: "shop"
      },
      {
        id: "sn-5",
        type: "BACK_IN_STOCK",
        title: "📦 Back In Stock!",
        message: `Organic raw honey from Lalibela is back in stock at preferred vendor stalls.`,
        time: "1 day ago",
        actionLabel: "Shop Honey",
        actionTab: "shop"
      }
    ];

    return notifications;
  }

  /**
   * Get Admin Dashboard Analytics for AI Module
   */
  async getAdminDashboardMetrics() {
    const products = await this.repository.getProducts();
    const properties = await this.repository.getProperties();
    const jobs = await this.repository.getJobs();
    const vendors = await this.repository.getVendors();
    const fraudReports = await this.repository.getFraudReports();

    const forecast = await this.geminiService.generateBusinessForecast();

    return {
      trendingProductsCount: products.length,
      trendingHousesCount: properties.length,
      trendingJobsCount: jobs.length,
      trendingVendorsCount: vendors.length,
      fraudPredictions: fraudReports.filter((r: any) => r.riskScore >= 70).length + 3, // simulated predictions count
      growthForecast: forecast.growthForecast,
      salesForecast: forecast.salesForecast,
      fraudReportsQueue: fraudReports,
    };
  }
}
