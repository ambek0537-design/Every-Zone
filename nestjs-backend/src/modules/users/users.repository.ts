import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    // Return or auto-create UserProfile
    let profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      profile = await this.prisma.userProfile.create({
        data: { userId },
      });
    }
    return profile;
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        city: data.city,
        country: data.country,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
      create: {
        userId,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        city: data.city,
        country: data.country,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
    });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: { avatarUrl },
      create: { userId, avatarUrl },
    });
  }

  async getSettings(userId: string) {
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });
    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: { userId },
      });
    }
    return settings;
  }

  async updateSettings(userId: string, data: any) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      update: {
        language: data.language,
        darkMode: data.darkMode,
        pushNotifications: data.pushNotifications,
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
      },
      create: {
        userId,
        language: data.language ?? 'am',
        darkMode: data.darkMode ?? false,
        pushNotifications: data.pushNotifications ?? true,
        emailNotifications: data.emailNotifications ?? true,
        smsNotifications: data.smsNotifications ?? true,
      },
    });
  }

  async logActivity(userId: string, action: string, entityType: string, entityId?: string) {
    return this.prisma.userActivity.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
      },
    });
  }

  async getActivities(userId: string) {
    return this.prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- FAVORITES: PRODUCTS ---
  async addFavoriteProduct(userId: string, productId: string) {
    return this.prisma.favoriteProduct.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
  }

  async removeFavoriteProduct(userId: string, id: string) {
    // Try by primary ID, or by productId
    return this.prisma.favoriteProduct.deleteMany({
      where: {
        userId,
        OR: [{ id }, { productId: id }],
      },
    });
  }

  async getFavoriteProducts(userId: string) {
    return this.prisma.favoriteProduct.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- FAVORITES: PROPERTIES ---
  async addFavoriteProperty(userId: string, propertyId: string) {
    return this.prisma.favoriteProperty.upsert({
      where: { userId_propertyId: { userId, propertyId } },
      create: { userId, propertyId },
      update: {},
    });
  }

  async removeFavoriteProperty(userId: string, id: string) {
    return this.prisma.favoriteProperty.deleteMany({
      where: {
        userId,
        OR: [{ id }, { propertyId: id }],
      },
    });
  }

  async getFavoriteProperties(userId: string) {
    return this.prisma.favoriteProperty.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- FAVORITES: JOBS ---
  async addSavedJob(userId: string, jobId: string) {
    return this.prisma.savedJob.upsert({
      where: { userId_jobId: { userId, jobId } },
      create: { userId, jobId },
      update: {},
    });
  }

  async removeSavedJob(userId: string, id: string) {
    return this.prisma.savedJob.deleteMany({
      where: {
        userId,
        OR: [{ id }, { jobId: id }],
      },
    });
  }

  async getSavedJobs(userId: string) {
    return this.prisma.savedJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- VENDOR FOLLOWS ---
  async followVendor(userId: string, vendorId: string) {
    return this.prisma.vendorFollow.upsert({
      where: { userId_vendorId: { userId, vendorId } },
      create: { userId, vendorId },
      update: {},
    });
  }

  async unfollowVendor(userId: string, vendorId: string) {
    return this.prisma.vendorFollow.deleteMany({
      where: { userId, vendorId },
    });
  }

  async getFollowingVendors(userId: string) {
    return this.prisma.vendorFollow.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
