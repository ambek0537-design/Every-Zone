import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { VendorsRepository } from './vendors.repository';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VendorsService {
  private readonly logger = new Logger(VendorsService.name);

  constructor(
    private readonly vendorsRepository: VendorsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createVendor(userId: string, dto: CreateVendorDto) {
    this.logger.log(`Creating vendor profile and store for user ID "${userId}"`);
    const result = await this.vendorsRepository.createVendorProfile(userId, dto);
    
    // Auto-evaluate verification and activation state
    await this.evaluateActivation(result.vendor.id);

    return {
      message: 'Vendor profile and storefront created successfully.',
      ...result,
    };
  }

  async getVendorMe(userId: string) {
    const vendor = await this.vendorsRepository.findVendorByUserId(userId);
    if (!vendor) {
      throw new NotFoundException('You do not have a vendor profile yet.');
    }
    return vendor;
  }

  async updateVendorMe(userId: string, dto: UpdateVendorDto) {
    const result = await this.vendorsRepository.updateVendorProfile(userId, dto);
    
    // Re-evaluate state in case of updates
    await this.evaluateActivation(result.vendor.id);

    return {
      message: 'Vendor profile updated successfully.',
      ...result,
    };
  }

  async findStoreBySlug(slug: string) {
    const store = await this.vendorsRepository.findStoreBySlug(slug);

    // Business rule: Suspended stores are hidden from public searches/retrievals
    if (store.status === 'SUSPENDED') {
      throw new BadRequestException('This store is currently suspended.');
    }

    return store;
  }

  async uploadLogo(userId: string, logoUrl: string) {
    const vendor = await this.getVendorMe(userId);
    const updated = await this.vendorsRepository.updateVendorProfile(userId, { logoUrl });
    return {
      message: 'Logo updated successfully.',
      logoUrl: updated.store.logoUrl,
    };
  }

  async uploadCover(userId: string, coverUrl: string) {
    const vendor = await this.getVendorMe(userId);
    const updated = await this.vendorsRepository.updateVendorProfile(userId, { coverUrl });
    return {
      message: 'Cover image updated successfully.',
      coverUrl: updated.store.coverUrl,
    };
  }

  async getDashboard(userId: string) {
    const vendor = await this.getVendorMe(userId);
    // Auto-run verification check before sending dashboard info
    await this.evaluateActivation(vendor.id);
    return this.vendorsRepository.getDashboardKPIs(vendor.id);
  }

  async updateSettings(userId: string, dto: UpdateStoreSettingsDto) {
    const vendor = await this.getVendorMe(userId);
    const settings = await this.vendorsRepository.updateStoreSettings(vendor.id, dto);
    return {
      message: 'Storefront settings updated successfully.',
      settings,
    };
  }

  async getAnalytics(userId: string) {
    const vendor = await this.getVendorMe(userId);
    return this.vendorsRepository.getAnalytics(vendor.id);
  }

  async getWorkingHours(userId: string) {
    const vendor = await this.getVendorMe(userId);
    return this.vendorsRepository.getWorkingHours(vendor.store.id);
  }

  async updateWorkingHours(userId: string, hours: any[]) {
    const vendor = await this.getVendorMe(userId);
    await this.vendorsRepository.updateWorkingHours(vendor.store.id, hours);
    return {
      message: 'Working hours updated successfully.',
    };
  }

  async getGallery(userId: string) {
    const vendor = await this.getVendorMe(userId);
    return this.vendorsRepository.getGallery(vendor.id);
  }

  async addGalleryItem(userId: string, mediaUrl: string, mediaType: string) {
    const vendor = await this.getVendorMe(userId);
    const item = await this.vendorsRepository.addGalleryItem(vendor.id, mediaUrl, mediaType as any);
    return {
      message: 'Gallery item added successfully.',
      item,
    };
  }

  async deleteGalleryItem(userId: string, id: string) {
    const vendor = await this.getVendorMe(userId);
    await this.vendorsRepository.deleteGalleryItem(id, vendor.id);
    return {
      message: 'Gallery item deleted successfully.',
    };
  }

  async getSocialLinks(userId: string) {
    const vendor = await this.getVendorMe(userId);
    return this.vendorsRepository.getSocialLinks(vendor.id);
  }

  async updateSocialLinks(userId: string, links: any[]) {
    const vendor = await this.getVendorMe(userId);
    await this.vendorsRepository.updateSocialLinks(vendor.id, links);
    return {
      message: 'Social links updated successfully.',
    };
  }

  /**
   * Evaluates and updates a Vendor's overall activation state based on:
   * 1. Passed KYC checks (Approved)
   * 2. Active Subscription status
   */
  async evaluateActivation(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE', expiresAt: { gte: new Date() } },
          take: 1,
        },
      },
    });

    if (!vendor) return;

    // Check KYC status for this user
    const kyc = await this.prisma.kYC.findUnique({
      where: { userId: vendor.userId },
    });

    const hasPassedKYC = kyc && kyc.status === 'APPROVED';
    const hasActiveSubscription = vendor.subscriptions.length > 0;

    let targetStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED' = 'PENDING';

    if (hasPassedKYC && hasActiveSubscription) {
      targetStatus = 'ACTIVE';
    } else if (!hasPassedKYC) {
      targetStatus = 'PENDING'; // Awaiting KYC
    } else {
      targetStatus = 'SUSPENDED'; // KYC Passed but expired/no subscription
    }

    // Update Vendor table
    await this.prisma.vendor.update({
      where: { id: vendorId },
      data: {
        status: targetStatus,
        subscriptionStatus: hasActiveSubscription ? 'ACTIVE' : 'EXPIRED',
      },
    });

    // Sync state with VendorStore
    const storeStatusMap = {
      ACTIVE: 'ACTIVE' as const,
      PENDING: 'PENDING' as const,
      SUSPENDED: 'SUSPENDED' as const,
    };

    await this.prisma.vendorStore.updateMany({
      where: { vendorId },
      data: {
        status: storeStatusMap[targetStatus],
        verification: hasPassedKYC ? 'APPROVED' : 'PENDING',
      },
    });

    // Business Rules Automation: If subscription expired, hide listings
    if (!hasActiveSubscription) {
      await this.prisma.listing.updateMany({
        where: { vendorId },
        data: { active: false },
      });
    }

    this.logger.log(`Automation trigger evaluated for vendor "${vendorId}": KYC Approved=${hasPassedKYC}, Subscription Active=${hasActiveSubscription}. Status: ${targetStatus}`);
  }

  /**
   * Thread-safe transaction follow toggle
   */
  async toggleFollowVendor(vendorId: string, userId: string) {
    this.logger.log(`Toggling follow for user "${userId}" on vendor "${vendorId}"`);

    // Verify user exists
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`User with ID "${userId}" was not found.`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const vendorExists = await tx.vendor.findUnique({
        where: { id: vendorId },
      });

      if (!vendorExists) {
        throw new NotFoundException(`Vendor with ID "${vendorId}" was not found.`);
      }

      const existingFollow = await tx.vendorFollow.findUnique({
        where: {
          userId_vendorId: { userId, vendorId },
        },
      });

      let action: 'FOLLOWED' | 'UNFOLLOWED';

      if (!existingFollow) {
        await tx.vendorFollow.create({
          data: { userId, vendorId },
        });
        action = 'FOLLOWED';
      } else {
        await tx.vendorFollow.delete({
          where: {
            userId_vendorId: { userId, vendorId },
          },
        });
        action = 'UNFOLLOWED';
      }

      const totalFollowers = await tx.vendorFollow.count({
        where: { vendorId },
      });

      // Sync total count to Vendor & VendorStore atomically
      await tx.vendorStore.update({
        where: { vendorId },
        data: { totalFollowers },
      });

      await tx.vendor.update({
        where: { id: vendorId },
        data: { followers: totalFollowers },
      });

      return {
        status: 'success',
        vendorId,
        shopName: vendorExists.shopName,
        userId,
        action,
        atomicFollowersCount: totalFollowers,
        timestamp: new Date().toISOString(),
      };
    });
  }
}
