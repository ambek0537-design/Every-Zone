import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * GET /analytics/dashboard
   */
  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard() {
    return this.analyticsService.getDashboard();
  }

  /**
   * GET /analytics/revenue
   */
  @Get('revenue')
  @HttpCode(HttpStatus.OK)
  async getRevenue() {
    return this.analyticsService.getRevenueAnalytics();
  }

  /**
   * GET /analytics/users
   */
  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.analyticsService.getUserAnalytics();
  }

  /**
   * GET /analytics/vendors
   */
  @Get('vendors')
  @HttpCode(HttpStatus.OK)
  async getVendors() {
    return this.analyticsService.getVendorPerformance();
  }

  /**
   * GET /analytics/products
   */
  @Get('products')
  @HttpCode(HttpStatus.OK)
  async getProducts() {
    return this.analyticsService.getProductAnalytics();
  }

  /**
   * GET /analytics/properties
   */
  @Get('properties')
  @HttpCode(HttpStatus.OK)
  async getProperties() {
    return this.analyticsService.getPropertyAnalytics();
  }

  /**
   * GET /analytics/jobs
   */
  @Get('jobs')
  @HttpCode(HttpStatus.OK)
  async getJobs() {
    return this.analyticsService.getJobAnalytics();
  }

  /**
   * GET /analytics/searches
   */
  @Get('searches')
  @HttpCode(HttpStatus.OK)
  async getSearches() {
    return this.analyticsService.getSearchTrends();
  }
}
