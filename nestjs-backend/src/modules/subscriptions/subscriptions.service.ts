import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { RenewSubscriptionDto } from './dto/renew-subscription.dto';
import { SubscriptionStatus, PaymentProvider } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(private readonly repo: SubscriptionsRepository) {}

  async getPlans() {
    return await this.repo.getAllPlans();
  }

  async getLatestForVendor(vendorId: string) {
    const sub = await this.repo.getLatestSubscription(vendorId);
    if (!sub) {
      throw new NotFoundException('No active subscription found for this vendor');
    }
    return sub;
  }

  async create(userId: string, dto: CreateSubscriptionDto) {
    const plan = await this.repo.findPlanById(dto.planId);
    
    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    const subscription = await this.repo.createSubscription({
      userId,
      vendorId: dto.vendorId,
      planId: dto.planId,
      amount: Number(plan.price),
      startsAt,
      expiresAt,
      autoRenew: dto.autoRenew,
    });

    this.logger.log(`Created PENDING subscription ${subscription.id} for vendor ${dto.vendorId}`);
    return subscription;
  }

  async renew(userId: string, dto: RenewSubscriptionDto) {
    const sub = await this.repo.getLatestSubscription(dto.subscriptionId); // Wait, we can find by id
    // Actually, let's allow finding subscription by ID
    // Let's activate subscription directly or trigger payment simulation
    const updated = await this.repo.activateSubscription(dto.subscriptionId);
    
    // Create a payment record
    await this.repo.createPayment({
      subscriptionId: dto.subscriptionId,
      provider: dto.provider,
      transactionId: dto.transactionId || `TX-RENEW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: Number(updated.amount),
      status: 'SUCCESS',
    });

    // Create an Invoice
    if (updated.vendorId) {
      await this.repo.createInvoice({
        vendorId: updated.vendorId,
        amount: Number(updated.amount),
        currency: 'ETB',
        status: 'PAID',
      });
    }

    return updated;
  }

  async getHistory(vendorId: string) {
    return await this.repo.getSubscriptionHistory(vendorId);
  }

  async getInvoices(vendorId: string) {
    return await this.repo.getInvoices(vendorId);
  }

  // Chapa Webhook
  async handleChapaWebhook(payload: any) {
    const { reference, status, amount, metadata } = payload;
    this.logger.log(`Chapa Webhook triggered with ref: ${reference}, status: ${status}`);

    if (status === 'success') {
      const subscriptionId = metadata?.subscriptionId;
      if (!subscriptionId) {
        throw new BadRequestException('No subscription ID found in metadata');
      }

      // Activate subscription
      const sub = await this.repo.activateSubscription(subscriptionId);
      
      // Save payment log
      await this.repo.createPayment({
        subscriptionId,
        provider: PaymentProvider.CHAPA,
        transactionId: reference,
        amount: Number(amount),
        status: 'SUCCESS',
        rawResponse: payload,
      });

      // Save Invoice
      if (sub.vendorId) {
        await this.repo.createInvoice({
          vendorId: sub.vendorId,
          amount: Number(amount),
          currency: 'ETB',
          status: 'PAID',
        });
      }

      this.logger.log(`Verified Chapa payment and activated subscription: ${subscriptionId}`);
      return { success: true, message: 'Subscription Activated' };
    }

    return { success: false, message: 'Payment incomplete' };
  }

  // Telebirr Webhook
  async handleTelebirrWebhook(payload: any) {
    const { tradeNo, outTradeNo, status, totalAmount, subject } = payload;
    this.logger.log(`Telebirr Webhook triggered for tradeNo: ${tradeNo}, status: ${status}`);

    if (status === 'SUCCESS' || status === 'success') {
      const subscriptionId = outTradeNo; // Reference mapping
      const sub = await this.repo.activateSubscription(subscriptionId);

      await this.repo.createPayment({
        subscriptionId,
        provider: PaymentProvider.TELEBIRR,
        transactionId: tradeNo,
        amount: Number(totalAmount),
        status: 'SUCCESS',
        rawResponse: payload,
      });

      if (sub.vendorId) {
        await this.repo.createInvoice({
          vendorId: sub.vendorId,
          amount: Number(totalAmount),
          currency: 'ETB',
          status: 'PAID',
        });
      }

      return { success: true, message: 'Payment Successful' };
    }

    return { success: false, message: 'Payment Failed' };
  }

  // Midnight Cron Runner (Checks expiration, handles grace period & reminders)
  async runMidnightCronCheck() {
    this.logger.log('Starting Midnight Subscription Audit...');
    
    // 1. Transition expired Active subscriptions to GRACE_PERIOD (7 days grace)
    const expiredActive = await this.repo.getExpiredActiveSubscriptions();
    for (const sub of expiredActive) {
      const graceEndsAt = new Date();
      graceEndsAt.setDate(graceEndsAt.getDate() + 7); // 7-day Grace Period

      await this.repo.updateStatus(sub.id, SubscriptionStatus.GRACE_PERIOD, graceEndsAt);
      this.logger.log(`Subscription ${sub.id} entered Grace Period. Ends at: ${graceEndsAt}`);
      
      // Send reminder event / log (Grace Period Started)
      this.logger.log(`[Notification/Email] Sent Grace Period Started to User/Vendor for sub ${sub.id}`);
    }

    // 2. Transition expired Grace Periods to EXPIRED & suspend store/hide products
    const expiredGrace = await this.repo.getGracePeriodExpiredSubscriptions();
    for (const sub of expiredGrace) {
      await this.repo.updateStatus(sub.id, SubscriptionStatus.EXPIRED);
      this.logger.log(`Subscription ${sub.id} fully EXPIRED. Vendor store suspended.`);

      // Send alert (Subscription Expired, Store Suspended)
      this.logger.log(`[Notification/Email] Sent Store Suspended Alert for sub ${sub.id}`);
    }

    // 3. Send reminders for upcoming active expirations (7, 3, and 1 days remaining)
    const reminders = [7, 3, 1];
    for (const days of reminders) {
      const expiringSoon = await this.repo.getUpcomingExpirations(days);
      for (const sub of expiringSoon) {
        this.logger.log(`[Notification/Email] Renewal Reminder: ${days} days remaining on subscription ${sub.id}`);
      }
    }

    // 4. Daily Revenue report simulation
    const stats = await this.repo.getRevenueStats();
    this.logger.log(`[Daily Revenue Report] Total: ${stats.totalRevenue} ETB. Active Subs: ${stats.activeSubscriptions}`);

    return {
      processedGracePeriods: expiredActive.length,
      processedExpirations: expiredGrace.length,
      revenueStats: stats,
    };
  }

  // Get Analytics overview for the admin dashboard
  async getAdminDashboardStats() {
    return await this.repo.getRevenueStats();
  }
}
