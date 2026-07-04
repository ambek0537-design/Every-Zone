import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsPeriod, Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Auto-seeds some basic analytics and trends on startup if empty
   */
  async onModuleInit() {
    try {
      this.logger.log('Initializing BI Analytics Seeder check...');
      
      // Seed Search trends
      const searchTrendCount = await this.prisma.searchTrend.count();
      if (searchTrendCount === 0) {
        this.logger.log('Seeding initial search trends...');
        await this.prisma.searchTrend.createMany({
          data: [
            { keyword: 'Apartment Addis Ababa', searches: 1450, clicks: 820 },
            { keyword: 'Toyota Vitz', searches: 2100, clicks: 1150 },
            { keyword: 'Web Developer Jobs', searches: 1890, clicks: 920 },
            { keyword: 'iPhone 15 Pro Max', searches: 3200, clicks: 2100 },
            { keyword: 'Bole Studio Rent', searches: 980, clicks: 430 },
            { keyword: 'Delivery Driver', searches: 1540, clicks: 760 },
          ],
        });
      }

      // Seed Vendor performance
      const vendorPerformanceCount = await this.prisma.vendorPerformance.count();
      if (vendorPerformanceCount === 0) {
        this.logger.log('Seeding initial vendor performance analytics...');
        // Let's grab some existing vendors if any
        const vendors = await this.prisma.vendor.findMany({ take: 5 });
        if (vendors.length > 0) {
          for (let i = 0; i < vendors.length; i++) {
            await this.prisma.vendorPerformance.upsert({
              where: { vendorId: vendors[i].id },
              update: {},
              create: {
                vendorId: vendors[i].id,
                profileViews: 1200 + i * 450,
                followers: 150 + i * 65,
                orders: 45 + i * 15,
                revenue: new Prisma.Decimal(15000 + i * 8500),
                conversionRate: 0.035 + i * 0.01,
              },
            });
          }
        } else {
          // Placeholder vendor performance references
          const demoVendorIds = ['v-1', 'v-2', 'v-3', 'v-4'];
          for (const vid of demoVendorIds) {
            await this.prisma.vendorPerformance.upsert({
              where: { vendorId: vid },
              update: {},
              create: {
                vendorId: vid,
                profileViews: Math.floor(Math.random() * 2000) + 500,
                followers: Math.floor(Math.random() * 300) + 50,
                orders: Math.floor(Math.random() * 80) + 10,
                revenue: new Prisma.Decimal((Math.random() * 50000) + 5000),
                conversionRate: 0.02 + Math.random() * 0.05,
              },
            });
          }
        }
      }

      // Seed Revenue analytics
      const revCount = await this.prisma.revenueAnalytics.count();
      if (revCount === 0) {
        this.logger.log('Seeding initial revenue analytics...');
        await this.prisma.revenueAnalytics.createMany({
          data: [
            { period: AnalyticsPeriod.DAILY, totalRevenue: new Prisma.Decimal(4500), marketplaceRevenue: new Prisma.Decimal(3100), subscriptionRevenue: new Prisma.Decimal(1400) },
            { period: AnalyticsPeriod.WEEKLY, totalRevenue: new Prisma.Decimal(28000), marketplaceRevenue: new Prisma.Decimal(19500), subscriptionRevenue: new Prisma.Decimal(8500) },
            { period: AnalyticsPeriod.MONTHLY, totalRevenue: new Prisma.Decimal(115000), marketplaceRevenue: new Prisma.Decimal(78000), subscriptionRevenue: new Prisma.Decimal(37000) },
            { period: AnalyticsPeriod.YEARLY, totalRevenue: new Prisma.Decimal(1380000), marketplaceRevenue: new Prisma.Decimal(920000), subscriptionRevenue: new Prisma.Decimal(460000) },
          ],
        });
      }

      // Seed User analytics
      const userAnalyticsCount = await this.prisma.userAnalytics.count();
      if (userAnalyticsCount === 0) {
        this.logger.log('Seeding initial user analytics...');
        const totalUserCount = await this.prisma.user.count();
        const totalVendorCount = await this.prisma.vendor.count();
        await this.prisma.userAnalytics.create({
          data: {
            totalUsers: totalUserCount || 1250,
            activeUsers: Math.round((totalUserCount || 1250) * 0.68),
            newUsers: 145,
            vendors: totalVendorCount || 120,
            buyers: Math.round((totalUserCount || 1250) * 0.8),
          },
        });
      }

      // Seed Marketplace analytics
      const marketplaceAnalyticsCount = await this.prisma.marketplaceAnalytics.count();
      if (marketplaceAnalyticsCount === 0) {
        this.logger.log('Seeding initial marketplace analytics...');
        const listingsCount = await this.prisma.listing.count();
        const deliveryCount = await this.prisma.delivery.count();
        await this.prisma.marketplaceAnalytics.create({
          data: {
            totalProducts: listingsCount || 450,
            activeProducts: Math.round((listingsCount || 450) * 0.85),
            orders: deliveryCount || 280,
            sales: new Prisma.Decimal(45000),
          },
        });
      }

      // Seed Property analytics
      const propertyAnalyticsCount = await this.prisma.propertyAnalytics.count();
      if (propertyAnalyticsCount === 0) {
        this.logger.log('Seeding initial property analytics...');
        await this.prisma.propertyAnalytics.create({
          data: {
            totalProperties: 180,
            activeProperties: 145,
            inquiries: 92,
          },
        });
      }

      // Seed Job analytics
      const jobAnalyticsCount = await this.prisma.jobAnalytics.count();
      if (jobAnalyticsCount === 0) {
        this.logger.log('Seeding initial job analytics...');
        await this.prisma.jobAnalytics.create({
          data: {
            totalJobs: 110,
            activeJobs: 84,
            applications: 420,
          },
        });
      }

      this.logger.log('BI Analytics Seeding completed successfully.');
    } catch (err) {
      this.logger.error('Failed to auto-seed or initialize BI Analytics:', err);
    }
  }

  /**
   * Retrieves high level overview dashboard KPIs and growth charts
   */
  async getDashboard() {
    try {
      const totalUsers = await this.prisma.user.count();
      const activeVendors = await this.prisma.vendor.count({
        where: { subscriptionStatus: 'ACTIVE' },
      });
      const ordersCount = await this.prisma.delivery.count();
      const listingsCount = await this.prisma.listing.count();
      
      const inquiries = await this.prisma.propertyAnalytics.findFirst();
      const jobApplications = await this.prisma.jobAnalytics.findFirst();
      const searchTrends = await this.prisma.searchTrend.findMany({ take: 10, orderBy: { searches: 'desc' } });
      const searchVolume = searchTrends.reduce((sum, item) => sum + item.searches, 0);

      // Financials
      const subLogs = await this.prisma.subscriptionLog.findMany();
      const subscriptionRevenue = subLogs.reduce((sum, log) => sum + Number(log.amount), 0);

      return {
        kpis: {
          totalRevenue: subscriptionRevenue + 24500.00, // actual subs + simulated escrow cut
          totalUsers: totalUsers || 1250,
          activeVendors: activeVendors || 145,
          ordersToday: Math.round(ordersCount * 0.08) || 12,
          propertyInquiries: inquiries?.inquiries || 92,
          jobApplications: jobApplications?.applications || 420,
          searchVolume: searchVolume || 11160,
          subscriptionRevenue: subscriptionRevenue || 37000.00,
          walletVolume: 874350.00,
        },
        charts: {
          revenue: [
            { month: 'Jan', amount: 8500, marketplace: 5200, subscription: 3300 },
            { month: 'Feb', amount: 12400, marketplace: 7800, subscription: 4600 },
            { month: 'Mar', amount: 15900, marketplace: 10400, subscription: 5500 },
            { month: 'Apr', amount: 21000, marketplace: 14000, subscription: 7000 },
            { month: 'May', amount: 28500, marketplace: 19200, subscription: 9300 },
            { month: 'Jun', amount: 37000, marketplace: 24500, subscription: 12500 },
          ],
          userGrowth: [
            { month: 'Jan', users: 400, active: 310 },
            { month: 'Feb', users: 550, active: 430 },
            { month: 'Mar', users: 710, active: 520 },
            { month: 'Apr', users: 900, active: 680 },
            { month: 'May', users: 1100, active: 810 },
            { month: 'Jun', users: totalUsers || 1250, active: Math.round((totalUsers || 1250) * 0.72) },
          ],
          vendorGrowth: [
            { month: 'Jan', vendors: 30 },
            { month: 'Feb', vendors: 45 },
            { month: 'Mar', vendors: 68 },
            { month: 'Apr', vendors: 95 },
            { month: 'May', vendors: 120 },
            { month: 'Jun', vendors: activeVendors || 145 },
          ],
          orderTrend: [
            { week: 'W1', orders: 25 },
            { week: 'W2', orders: 40 },
            { week: 'W3', orders: 38 },
            { week: 'W4', orders: 55 },
            { week: 'W5', orders: 62 },
            { week: 'W6', orders: ordersCount || 280 },
          ],
          propertyViews: [
            { type: 'Apartment', views: 2400, inquiries: 145 },
            { type: 'Villa', views: 1800, inquiries: 92 },
            { type: 'Condominium', views: 3200, inquiries: 210 },
            { type: 'Commercial', views: 950, inquiries: 40 },
          ],
          jobApplications: [
            { sector: 'Technology', applications: 180 },
            { sector: 'Healthcare', applications: 95 },
            { sector: 'Finance', applications: 120 },
            { sector: 'Education', applications: 65 },
            { sector: 'Construction', applications: 110 },
          ],
        },
        aggregations: {
          topVendors: await this.getTopVendorsSummary(),
          topProducts: [
            { id: 'p-1', name: 'iPhone 15 Pro Max', sales: 45000, qty: 15, city: 'Addis Ababa' },
            { id: 'p-2', name: 'Toyota Vitz 2015', sales: 780000, qty: 1, city: 'Hawassa' },
            { id: 'p-3', name: 'Smart Watch Series 9', sales: 12000, qty: 8, city: 'Adama' },
          ],
          topProperties: [
            { id: 'prop-1', title: 'Luxury Bole Apartment', views: 1420, price: '8,500,000 ETB' },
            { id: 'prop-2', title: 'Commercial Shop in Mercato', views: 1150, price: '45,000 ETB/mo' },
          ],
          topSearches: searchTrends.map(s => ({ keyword: s.keyword, count: s.searches, conversion: Math.round((s.clicks / s.searches) * 100) + '%' })),
        }
      };
    } catch (err) {
      this.logger.error('Error fetching dashboard analytics:', err);
      return this.getFallbackDashboard();
    }
  }

  /**
   * Helper to fetch top performing vendors aggregated summary
   */
  private async getTopVendorsSummary() {
    try {
      const topPerformance = await this.prisma.vendorPerformance.findMany({
        take: 5,
        orderBy: { revenue: 'desc' },
      });

      const list = [];
      for (const perf of topPerformance) {
        const vendor = await this.prisma.vendor.findUnique({
          where: { id: perf.vendorId },
          select: { shopName: true }
        });
        list.push({
          vendorId: perf.vendorId,
          shopName: vendor?.shopName || 'Unknown Shop',
          revenue: Number(perf.revenue),
          orders: perf.orders,
          followers: perf.followers,
          conversionRate: Math.round(perf.conversionRate * 100) + '%'
        });
      }
      return list;
    } catch {
      return [
        { vendorId: 'v-1', shopName: 'Bole Electronics Hub', revenue: 45000.00, orders: 45, followers: 230, conversionRate: '4.2%' },
        { vendorId: 'v-2', shopName: 'Abyssinia Fashion Loft', revenue: 32500.00, orders: 38, followers: 185, conversionRate: '3.8%' },
        { vendorId: 'v-3', shopName: 'Mercato Whole Foods', revenue: 29000.00, orders: 84, followers: 95, conversionRate: '5.1%' },
      ];
    }
  }

  /**
   * GET /analytics/revenue
   */
  async getRevenueAnalytics() {
    try {
      const dbRecords = await this.prisma.revenueAnalytics.findMany();
      const subLogs = await this.prisma.subscriptionLog.findMany();
      const subscriptionRevenue = subLogs.reduce((sum, log) => sum + Number(log.amount), 0);

      return {
        totalRevenue: subscriptionRevenue + 24500.00,
        marketplaceRevenue: 24500.00,
        subscriptionRevenue,
        periodBreakdown: dbRecords,
        highestRevenueCities: [
          { city: 'Addis Ababa', revenue: 320000, percentage: 65 },
          { city: 'Hawassa', revenue: 85000, percentage: 17 },
          { city: 'Adama', revenue: 52000, percentage: 11 },
          { city: 'Bahir Dar', revenue: 24000, percentage: 5 },
          { city: 'Dire Dawa', revenue: 11000, percentage: 2 },
        ],
        refundsRate: {
          totalRefunds: 4500,
          rate: '1.2%',
          count: 5
        },
        escrowBalances: {
          currentInEscrow: 145000.00,
          releasedOrders: 320,
          disputedAmount: 1800.00
        }
      };
    } catch {
      return {
        totalRevenue: 61500.00,
        marketplaceRevenue: 24500.00,
        subscriptionRevenue: 37000.00,
        periodBreakdown: [],
        highestRevenueCities: [
          { city: 'Addis Ababa', revenue: 320000, percentage: 65 },
          { city: 'Hawassa', revenue: 85000, percentage: 17 },
          { city: 'Adama', revenue: 52000, percentage: 11 },
        ],
        refundsRate: { totalRefunds: 4500, rate: '1.2%', count: 5 },
        escrowBalances: { currentInEscrow: 145000.00, releasedOrders: 320, disputedAmount: 1800.00 }
      };
    }
  }

  /**
   * GET /analytics/users
   */
  async getUserAnalytics() {
    try {
      const usersCount = await this.prisma.user.count();
      const vendorsCount = await this.prisma.vendor.count();
      
      return {
        totalUsers: usersCount || 1250,
        activeUsers: Math.round((usersCount || 1250) * 0.68),
        newUsersThisMonth: 145,
        vendors: vendorsCount || 120,
        buyers: Math.round((usersCount || 1250) * 0.82),
        verificationRates: {
          pending: await this.prisma.user.count({ where: { verificationStatus: 'PENDING' } }),
          approved: await this.prisma.user.count({ where: { verificationStatus: 'APPROVED' } }),
          rejected: await this.prisma.user.count({ where: { verificationStatus: 'REJECTED' } }),
        },
        growthOverTime: [
          { period: 'Jan', users: 400, growth: '12%' },
          { period: 'Feb', users: 550, growth: '37%' },
          { period: 'Mar', users: 710, growth: '29%' },
          { period: 'Apr', users: 900, growth: '26%' },
          { period: 'May', users: 1100, growth: '22%' },
          { period: 'Jun', users: usersCount || 1250, growth: '13%' },
        ]
      };
    } catch {
      return {
        totalUsers: 1250,
        activeUsers: 850,
        newUsersThisMonth: 145,
        vendors: 120,
        buyers: 1025,
        verificationRates: { pending: 45, approved: 1150, rejected: 55 }
      };
    }
  }

  /**
   * GET /analytics/vendors
   */
  async getVendorPerformance() {
    try {
      const performances = await this.prisma.vendorPerformance.findMany({
        orderBy: { revenue: 'desc' },
      });

      const records = [];
      for (const perf of performances) {
        const vendor = await this.prisma.vendor.findUnique({
          where: { id: perf.vendorId },
          select: { shopName: true, shopCategory: true }
        });
        records.push({
          vendorId: perf.vendorId,
          shopName: vendor?.shopName || 'Unknown Shop',
          category: vendor?.shopCategory || 'Marketplace',
          profileViews: perf.profileViews,
          followers: perf.followers,
          orders: perf.orders,
          revenue: Number(perf.revenue),
          conversionRate: perf.conversionRate,
        });
      }

      return {
        bestPerformingVendors: records.slice(0, 5),
        fastestGrowingCategories: [
          { category: 'Electronics', growth: '+45%' },
          { category: 'Vehicles', growth: '+32%' },
          { category: 'Real Estate', growth: '+28%' },
          { category: 'Fashion', growth: '+15%' },
        ],
        aggregatePerformance: {
          averageViews: 1240,
          averageFollowers: 145,
          averageOrders: 28,
          averageConversionRate: '3.6%'
        }
      };
    } catch {
      return {
        bestPerformingVendors: [],
        fastestGrowingCategories: [
          { category: 'Electronics', growth: '+45%' },
          { category: 'Vehicles', growth: '+32%' },
        ],
        aggregatePerformance: { averageViews: 1240, averageFollowers: 145, averageOrders: 28, averageConversionRate: '3.6%' }
      };
    }
  }

  /**
   * GET /analytics/products
   */
  async getProductAnalytics() {
    try {
      const listingsCount = await this.prisma.listing.count();
      const ordersCount = await this.prisma.delivery.count();

      return {
        totalProducts: listingsCount || 450,
        activeProducts: Math.round((listingsCount || 450) * 0.85),
        orders: ordersCount || 280,
        sales: 45000,
        topSellingProducts: [
          { id: 'p-1', title: 'iPhone 15 Pro Max 256GB', price: 92000, sold: 15, revenue: 1380000, rating: 4.8 },
          { id: 'p-2', title: 'HP EliteBook 840 G5', price: 28000, sold: 9, revenue: 252000, rating: 4.5 },
          { id: 'p-3', title: 'Xiaomi Redmi Note 13', price: 14500, sold: 22, revenue: 319000, rating: 4.2 },
          { id: 'p-4', title: 'Leather Office Chair', price: 8500, sold: 6, revenue: 51000, rating: 4.4 },
        ],
        categoryDistribution: [
          { category: 'Electronics', count: 180, sales: 240000 },
          { category: 'Vehicles', count: 45, sales: 110000 },
          { category: 'Fashion', count: 120, sales: 34000 },
          { category: 'Home & Kitchen', count: 75, sales: 18000 },
          { category: 'Other', count: 30, sales: 4500 },
        ]
      };
    } catch {
      return {
        totalProducts: 450,
        activeProducts: 382,
        orders: 280,
        sales: 45000,
        topSellingProducts: []
      };
    }
  }

  /**
   * GET /analytics/properties
   */
  async getPropertyAnalytics() {
    try {
      const analytics = await this.prisma.propertyAnalytics.findFirst();
      return {
        totalProperties: analytics?.totalProperties || 180,
        activeProperties: analytics?.activeProperties || 145,
        inquiries: analytics?.inquiries || 92,
        mostViewedProperties: [
          { id: 'prop-1', title: 'Luxury 3 Bedroom Bole Apartment', views: 2400, inquiries: 45, price: '8,500,000 ETB' },
          { id: 'prop-2', title: 'Commercial Office Space in Kazanchis', views: 1850, inquiries: 28, price: '45,000 ETB/mo' },
          { id: 'prop-3', title: 'Beautiful Villa in CMC', views: 1420, inquiries: 19, price: '22,000,000 ETB' },
        ],
        propertyTypeBreakdown: [
          { type: 'Apartment For Rent', count: 65, active: 52 },
          { type: 'Apartment For Sale', count: 35, active: 30 },
          { type: 'Villa For Sale', count: 15, active: 11 },
          { type: 'Commercial Rent', count: 45, active: 38 },
          { type: 'Land Sale', count: 20, active: 14 },
        ]
      };
    } catch {
      return {
        totalProperties: 180,
        activeProperties: 145,
        inquiries: 92,
        mostViewedProperties: []
      };
    }
  }

  /**
   * GET /analytics/jobs
   */
  async getJobAnalytics() {
    try {
      const analytics = await this.prisma.jobAnalytics.findFirst();
      return {
        totalJobs: analytics?.totalJobs || 110,
        activeJobs: analytics?.activeJobs || 84,
        applications: analytics?.applications || 420,
        mostAppliedJobs: [
          { id: 'job-1', title: 'Senior React Developer', employer: 'EthioTech Solutions', applications: 85, views: 340, status: 'Active' },
          { id: 'job-2', title: 'Accountant & Auditor', employer: 'Gibe Bank', applications: 124, views: 410, status: 'Active' },
          { id: 'job-3', title: 'Delivery Dispatcher', employer: 'Sheger Delivery', applications: 76, views: 220, status: 'Closed' },
          { id: 'job-4', title: 'Sales Representative', employer: 'Oromia Trading', applications: 95, views: 290, status: 'Active' },
        ],
        sectorDistribution: [
          { sector: 'Technology & Software', count: 35, applications: 180 },
          { sector: 'Finance & Banking', count: 18, applications: 120 },
          { sector: 'Healthcare & Medical', count: 12, applications: 45 },
          { sector: 'Sales & Marketing', count: 25, applications: 110 },
          { sector: 'Education & Teaching', count: 10, applications: 35 },
          { sector: 'Other', count: 10, applications: 15 },
        ]
      };
    } catch {
      return {
        totalJobs: 110,
        activeJobs: 84,
        applications: 420,
        mostAppliedJobs: []
      };
    }
  }

  /**
   * GET /analytics/searches
   */
  async getSearchTrends() {
    try {
      const trends = await this.prisma.searchTrend.findMany({
        orderBy: { searches: 'desc' },
      });

      return {
        searchTrends: trends,
        topSearches: trends.slice(0, 5).map(t => ({
          keyword: t.keyword,
          searches: t.searches,
          clicks: t.clicks,
          ctr: Math.round((t.clicks / t.searches) * 100) + '%'
        })),
        searchVolumeToday: 840,
        overallStats: {
          totalTrackedKeywords: trends.length,
          averageClicksRate: '52.4%',
          noResultSearchesRate: '3.1%'
        }
      };
    } catch {
      return {
        searchTrends: [],
        topSearches: [],
        searchVolumeToday: 840,
        overallStats: { totalTrackedKeywords: 0, averageClicksRate: '50%', noResultSearchesRate: '5%' }
      };
    }
  }

  /**
   * Standard fallback response containing full mockup context
   */
  private getFallbackDashboard() {
    return {
      kpis: {
        totalRevenue: 61500.00,
        totalUsers: 1250,
        activeVendors: 145,
        ordersToday: 12,
        propertyInquiries: 92,
        jobApplications: 420,
        searchVolume: 11160,
        subscriptionRevenue: 37000.00,
        walletVolume: 874350.00,
      },
      charts: {
        revenue: [
          { month: 'Jan', amount: 8500, marketplace: 5200, subscription: 3300 },
          { month: 'Feb', amount: 12400, marketplace: 7800, subscription: 4600 },
          { month: 'Mar', amount: 15900, marketplace: 10400, subscription: 5500 },
        ],
        userGrowth: [],
        vendorGrowth: [],
        orderTrend: [],
        propertyViews: [],
        jobApplications: [],
      },
      aggregations: {
        topVendors: [],
        topProducts: [],
        topProperties: [],
        topSearches: [],
      }
    };
  }
}
