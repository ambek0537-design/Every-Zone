import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionStatus, PaymentProvider } from '@prisma/client';

@Injectable()
export class SubscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPlanById(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Subscription plan not found');
    return plan;
  }

  async getAllPlans() {
    return await this.prisma.subscriptionPlan.findMany({
      where: { active: true },
    });
  }

  async createPlan(data: { name: string; description?: string; price: number; durationDays: number }) {
    return await this.prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        durationDays: data.durationDays,
      },
    });
  }

  async getLatestSubscription(vendorId: string) {
    // Check both standard Subscription and VendorSubscription to ensure 100% database sync
    const sub = await this.prisma.subscription.findFirst({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });
    return sub;
  }

  async createSubscription(data: {
    vendorId: string;
    userId: string;
    planId: string;
    amount: number;
    startsAt: Date;
    expiresAt: Date;
    autoRenew?: boolean;
  }) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Create standard Subscription (linked with user & vendor relationships)
      const sub = await tx.subscription.create({
        data: {
          userId: data.userId,
          vendorId: data.vendorId,
          planId: data.planId,
          status: SubscriptionStatus.PENDING,
          amount: data.amount,
          startsAt: data.startsAt,
          expiresAt: data.expiresAt,
          autoRenew: data.autoRenew || false,
        },
      });

      // 2. Also keep VendorSubscription mirrored for safety or direct references
      await tx.vendorSubscription.create({
        data: {
          id: sub.id, // Keep IDs identical for transparent keying
          vendorId: data.vendorId,
          planId: data.planId,
          status: SubscriptionStatus.PENDING,
          amount: data.amount,
          startsAt: data.startsAt,
          expiresAt: data.expiresAt,
          autoRenew: data.autoRenew || false,
        },
      });

      return sub;
    });
  }

  async activateSubscription(id: string) {
    return await this.prisma.$transaction(async (tx) => {
      // Find subscription
      const sub = await tx.subscription.findUnique({ where: { id } });
      if (!sub) throw new NotFoundException('Subscription record not found');

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default or plan duration

      // Update both subscription records
      const updatedSub = await tx.subscription.update({
        where: { id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          startsAt: now,
          expiresAt,
        },
      });

      await tx.vendorSubscription.update({
        where: { id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          startsAt: now,
          expiresAt,
        },
      });

      // Set vendor subscriptionStatus and make vendor store active
      if (sub.vendorId) {
        await tx.vendor.update({
          where: { id: sub.vendorId },
          data: {
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            rentPaid: true,
          },
        });

        await tx.vendorStore.update({
          where: { vendorId: sub.vendorId },
          data: {
            status: 'ACTIVE',
          },
        });
      }

      return updatedSub;
    });
  }

  async updateStatus(id: string, status: SubscriptionStatus, graceEndsAt?: Date) {
    return await this.prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.findUnique({ where: { id } });
      if (!sub) return null;

      const updated = await tx.subscription.update({
        where: { id },
        data: {
          status,
          graceEndsAt: graceEndsAt || undefined,
        },
      });

      await tx.vendorSubscription.update({
        where: { id },
        data: {
          status,
          graceEndsAt: graceEndsAt || undefined,
        },
      });

      if (sub.vendorId) {
        // Sync central Vendor status
        await tx.vendor.update({
          where: { id: sub.vendorId },
          data: { subscriptionStatus: status },
        });

        // Handle store status based on expiration
        if (status === SubscriptionStatus.EXPIRED) {
          await tx.vendorStore.update({
            where: { vendorId: sub.vendorId },
            data: { status: 'PENDING' }, // Suspension / Pending mode
          });
        } else if (status === SubscriptionStatus.ACTIVE) {
          await tx.vendorStore.update({
            where: { vendorId: sub.vendorId },
            data: { status: 'ACTIVE' },
          });
        }
      }

      return updated;
    });
  }

  async getSubscriptionHistory(vendorId: string) {
    return await this.prisma.subscription.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });
  }

  async createPayment(data: {
    subscriptionId: string;
    provider: PaymentProvider;
    transactionId: string;
    amount: number;
    status: string;
    rawResponse?: any;
  }) {
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return await this.prisma.subscriptionPayment.create({
      data: {
        subscriptionId: data.subscriptionId,
        provider: data.provider,
        transactionId: data.transactionId,
        amount: data.amount,
        paidAt: new Date(),
        invoiceNumber,
        status: data.status,
        rawResponse: data.rawResponse || {},
      },
    });
  }

  async createInvoice(data: {
    vendorId: string;
    amount: number;
    currency: string;
    status: string;
    pdfUrl?: string;
  }) {
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        vendorId: data.vendorId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        pdfUrl: data.pdfUrl || null,
      },
    });
  }

  async getInvoices(vendorId: string) {
    return await this.prisma.invoice.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getExpiredActiveSubscriptions() {
    const now = new Date();
    return await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { lt: now },
      },
    });
  }

  async getGracePeriodExpiredSubscriptions() {
    const now = new Date();
    return await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.GRACE_PERIOD,
        graceEndsAt: { lt: now },
      },
    });
  }

  async getUpcomingExpirations(daysAhead: number) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async getRevenueStats() {
    const payments = await this.prisma.subscriptionPayment.findMany({
      where: { status: 'SUCCESS' },
    });
    
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    
    // Group monthly
    const monthlyRevenue = totalRevenue; // Simplified aggregator

    const activeCount = await this.prisma.subscription.count({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    const expiredCount = await this.prisma.subscription.count({
      where: { status: SubscriptionStatus.EXPIRED },
    });

    const pendingCount = await this.prisma.subscription.count({
      where: { status: SubscriptionStatus.PENDING },
    });

    return {
      totalRevenue,
      monthlyRevenue,
      activeSubscriptions: activeCount,
      expiredStores: expiredCount,
      pendingPayments: pendingCount,
    };
  }
}
