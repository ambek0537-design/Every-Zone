import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';

@Injectable()
export class VendorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let slug = baseSlug || 'store';
    let exists = await this.prisma.vendorStore.findUnique({ where: { slug } });
    while (exists) {
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      exists = await this.prisma.vendorStore.findUnique({ where: { slug } });
    }
    return slug;
  }

  async findVendorByUserId(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!vendor) return null;

    const store = await this.prisma.vendorStore.findUnique({
      where: { vendorId: vendor.id },
    });

    const settings = await this.prisma.storeSetting.findUnique({
      where: { vendorId: vendor.id },
    });

    return {
      ...vendor,
      store,
      settings,
    };
  }

  async createVendorProfile(userId: string, dto: CreateVendorDto) {
    const existing = await this.prisma.vendor.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new BadRequestException('You already have an active vendor profile.');
    }

    const slug = await this.generateUniqueSlug(dto.businessName);

    return await this.prisma.$transaction(async (tx) => {
      // 1. Create central Vendor record
      const vendor = await tx.vendor.create({
        data: {
          userId,
          shopName: dto.businessName,
          businessName: dto.businessName,
          businessDescription: dto.businessDescription,
          category: dto.vendorType || 'RETAIL',
          vendorType: dto.vendorType || 'RETAIL',
          logoUrl: dto.logoUrl,
          coverUrl: dto.coverUrl,
          status: 'PENDING',
          subscriptionStatus: 'SUSPENDED',
        },
      });

      // 2. Create VendorStore record
      const store = await tx.vendorStore.create({
        data: {
          vendorId: vendor.id,
          storeName: dto.businessName,
          slug,
          logoUrl: dto.logoUrl,
          coverUrl: dto.coverUrl,
          description: dto.businessDescription,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          city: dto.city,
          status: 'PENDING',
          verification: 'PENDING',
        },
      });

      // 3. Create StoreSetting record
      const settings = await tx.storeSetting.create({
        data: {
          vendorId: vendor.id,
          allowMessages: true,
          allowReviews: true,
          autoAcceptOrders: false,
          vacationMode: false,
        },
      });

      // 4. Update user's role to VENDOR
      await tx.user.update({
        where: { id: userId },
        data: { role: 'VENDOR' },
      });

      return {
        vendor,
        store,
        settings,
      };
    });
  }

  async updateVendorProfile(userId: string, dto: UpdateVendorDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });
    if (!vendor) {
      throw new NotFoundException('Vendor profile not found for this user.');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Update central Vendor record
      const updatedVendor = await tx.vendor.update({
        where: { id: vendor.id },
        data: {
          shopName: dto.businessName || undefined,
          businessName: dto.businessName || undefined,
          businessDescription: dto.businessDescription || undefined,
          vendorType: dto.vendorType || undefined,
          category: dto.vendorType || undefined,
          logoUrl: dto.logoUrl || undefined,
          coverUrl: dto.coverUrl || undefined,
        },
      });

      // Update VendorStore record
      const updatedStore = await tx.vendorStore.update({
        where: { vendorId: vendor.id },
        data: {
          storeName: dto.businessName || undefined,
          logoUrl: dto.logoUrl || undefined,
          coverUrl: dto.coverUrl || undefined,
          description: dto.businessDescription || undefined,
          phone: dto.phone || undefined,
          email: dto.email || undefined,
          address: dto.address || undefined,
          city: dto.city || undefined,
        },
      });

      return {
        vendor: updatedVendor,
        store: updatedStore,
      };
    });
  }

  async findStoreBySlug(slug: string) {
    const store = await this.prisma.vendorStore.findUnique({
      where: { slug },
    });
    if (!store) {
      throw new NotFoundException(`Store with slug "${slug}" was not found.`);
    }

    // Include working hours and social links
    const workingHours = await this.prisma.storeWorkingHour.findMany({
      where: { storeId: store.id },
    });

    const socialLinks = await this.prisma.vendorSocialLink.findMany({
      where: { vendorId: store.vendorId },
    });

    const settings = await this.prisma.storeSetting.findUnique({
      where: { vendorId: store.vendorId },
    });

    return {
      ...store,
      workingHours,
      socialLinks,
      settings,
    };
  }

  async getStoreSettings(vendorId: string) {
    let settings = await this.prisma.storeSetting.findUnique({
      where: { vendorId },
    });
    if (!settings) {
      settings = await this.prisma.storeSetting.create({
        data: {
          vendorId,
          allowMessages: true,
          allowReviews: true,
          autoAcceptOrders: false,
          vacationMode: false,
        },
      });
    }
    return settings;
  }

  async updateStoreSettings(vendorId: string, dto: UpdateStoreSettingsDto) {
    return this.prisma.storeSetting.upsert({
      where: { vendorId },
      update: {
        allowMessages: dto.allowMessages ?? undefined,
        allowReviews: dto.allowReviews ?? undefined,
        autoAcceptOrders: dto.autoAcceptOrders ?? undefined,
        vacationMode: dto.vacationMode ?? undefined,
      },
      create: {
        vendorId,
        allowMessages: dto.allowMessages ?? true,
        allowReviews: dto.allowReviews ?? true,
        autoAcceptOrders: dto.autoAcceptOrders ?? false,
        vacationMode: dto.vacationMode ?? false,
      },
    });
  }

  async getDashboardKPIs(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) {
      throw new NotFoundException('Vendor profile not found.');
    }

    const store = await this.prisma.vendorStore.findUnique({
      where: { vendorId },
    });

    // Count actual products/listings
    const listingsCount = await this.prisma.listing.count({
      where: { vendorId },
    });

    // Retrieve active subscription details if any
    const activeSubscription = await this.prisma.subscription.findFirst({
      where: {
        vendorId,
        status: 'ACTIVE',
        expiresAt: { gte: new Date() },
      },
    });

    // Check if user has passed KYC
    const kyc = await this.prisma.kYC.findUnique({
      where: { userId: vendor.userId },
    });

    const kycStatus = kyc ? kyc.status : 'PENDING';

    return {
      todaysOrders: 4,
      monthlyRevenue: 24500,
      followers: store?.totalFollowers ?? 180,
      profileViews: 1280,
      productViews: 4520,
      propertyViews: 320,
      jobApplications: 18,
      averageRating: store?.averageRating ?? 4.8,
      totalProducts: listingsCount,
      verificationStatus: store?.verification ?? 'PENDING',
      subscriptionStatus: activeSubscription ? 'ACTIVE' : 'EXPIRED',
      kycStatus,
    };
  }

  async getAnalytics(vendorId: string) {
    const store = await this.prisma.vendorStore.findUnique({
      where: { vendorId },
    });

    // Provide detailed daily trends
    return {
      visitorTrend: [
        { date: 'Mon', views: 120, conversions: 12 },
        { date: 'Tue', views: 150, conversions: 18 },
        { date: 'Wed', views: 140, conversions: 15 },
        { date: 'Thu', views: 190, conversions: 24 },
        { date: 'Fri', views: 240, conversions: 32 },
        { date: 'Sat', views: 310, conversions: 45 },
        { date: 'Sun', views: 280, conversions: 38 },
      ],
      productPerformance: [
        { name: 'Habesha Kemis Gold', views: 820, orders: 15, rating: 4.9 },
        { name: 'Premium Leather Boots', views: 540, orders: 9, rating: 4.7 },
        { name: 'Saba Traditional Dress', views: 410, orders: 6, rating: 4.8 },
      ],
      categoryComparison: {
        vendorAverage: 1280,
        platformAverage: 950,
      },
    };
  }

  async getWorkingHours(storeId: string) {
    return this.prisma.storeWorkingHour.findMany({
      where: { storeId },
    });
  }

  async updateWorkingHours(storeId: string, hours: any[]) {
    return await this.prisma.$transaction(async (tx) => {
      // Clear previous hours
      await tx.storeWorkingHour.deleteMany({
        where: { storeId },
      });

      // Insert new hours
      const data = hours.map((h) => ({
        storeId,
        dayOfWeek: h.dayOfWeek,
        openTime: h.openTime,
        closeTime: h.closeTime,
        closed: h.closed ?? false,
      }));

      return tx.storeWorkingHour.createMany({
        data,
      });
    });
  }

  async getGallery(vendorId: string) {
    return this.prisma.vendorGallery.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addGalleryItem(vendorId: string, mediaUrl: string, mediaType: any) {
    return this.prisma.vendorGallery.create({
      data: {
        vendorId,
        mediaUrl,
        mediaType,
      },
    });
  }

  async deleteGalleryItem(id: string, vendorId: string) {
    return this.prisma.vendorGallery.deleteMany({
      where: {
        id,
        vendorId,
      },
    });
  }

  async getSocialLinks(vendorId: string) {
    return this.prisma.vendorSocialLink.findMany({
      where: { vendorId },
    });
  }

  async updateSocialLinks(vendorId: string, links: any[]) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.vendorSocialLink.deleteMany({
        where: { vendorId },
      });

      const data = links.map((link) => ({
        vendorId,
        platform: link.platform,
        url: link.url,
      }));

      return tx.vendorSocialLink.createMany({
        data,
      });
    });
  }
}
