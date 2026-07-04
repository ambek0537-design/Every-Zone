import { Controller, Get, Post, Body, Req, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { RenewSubscriptionDto } from './dto/renew-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @HttpCode(HttpStatus.OK)
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createSubscription(@Req() req: any, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('renew')
  @HttpCode(HttpStatus.OK)
  async renewSubscription(@Req() req: any, @Body() dto: RenewSubscriptionDto) {
    return this.subscriptionsService.renew(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMySubscription(@Query('vendorId') vendorId: string) {
    if (!vendorId) {
      return { status: 'NO_VENDOR', message: 'No vendor ID provided' };
    }
    return this.subscriptionsService.getLatestForVendor(vendorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  @HttpCode(HttpStatus.OK)
  async getMyHistory(@Query('vendorId') vendorId: string) {
    if (!vendorId) {
      return [];
    }
    return this.subscriptionsService.getHistory(vendorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('invoices')
  @HttpCode(HttpStatus.OK)
  async getMyInvoices(@Query('vendorId') vendorId: string) {
    if (!vendorId) {
      return [];
    }
    return this.subscriptionsService.getInvoices(vendorId);
  }

  @Post('webhook/chapa')
  @HttpCode(HttpStatus.OK)
  async handleChapaWebhook(@Body() payload: any) {
    return this.subscriptionsService.handleChapaWebhook(payload);
  }

  @Post('webhook/telebirr')
  @HttpCode(HttpStatus.OK)
  async handleTelebirrWebhook(@Body() payload: any) {
    return this.subscriptionsService.handleTelebirrWebhook(payload);
  }

  @Post('cron/trigger')
  @HttpCode(HttpStatus.OK)
  async triggerMidnightCron() {
    return this.subscriptionsService.runMidnightCronCheck();
  }

  @Get('admin/stats')
  @HttpCode(HttpStatus.OK)
  async getAdminStats() {
    return this.subscriptionsService.getAdminDashboardStats();
  }
}
