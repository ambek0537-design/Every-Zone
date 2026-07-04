import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getProfile(userId: string) {
    return this.usersRepository.getProfile(userId);
  }

  async updateProfile(userId: string, data: any) {
    const profile = await this.usersRepository.updateProfile(userId, data);
    await this.usersRepository.logActivity(userId, 'UPDATE_PROFILE', 'USER_PROFILE', profile.id);
    return profile;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const profile = await this.usersRepository.updateAvatar(userId, avatarUrl);
    await this.usersRepository.logActivity(userId, 'UPDATE_AVATAR', 'USER_PROFILE', profile.id);
    return profile;
  }

  async getSettings(userId: string) {
    return this.usersRepository.getSettings(userId);
  }

  async updateSettings(userId: string, data: any) {
    const settings = await this.usersRepository.updateSettings(userId, data);
    await this.usersRepository.logActivity(userId, 'UPDATE_SETTINGS', 'USER_SETTINGS', settings.id);
    return settings;
  }

  async getActivities(userId: string) {
    return this.usersRepository.getActivities(userId);
  }

  // --- FAVORITE PRODUCTS ---
  async addFavoriteProduct(userId: string, productId: string) {
    const fav = await this.usersRepository.addFavoriteProduct(userId, productId);
    await this.usersRepository.logActivity(userId, 'ADD_FAVORITE_PRODUCT', 'PRODUCT', productId);
    return fav;
  }

  async removeFavoriteProduct(userId: string, id: string) {
    await this.usersRepository.removeFavoriteProduct(userId, id);
    await this.usersRepository.logActivity(userId, 'REMOVE_FAVORITE_PRODUCT', 'PRODUCT', id);
    return { status: 'success', message: 'Product removed from favorites.' };
  }

  async getFavoriteProducts(userId: string) {
    return this.usersRepository.getFavoriteProducts(userId);
  }

  // --- FAVORITE PROPERTIES ---
  async addFavoriteProperty(userId: string, propertyId: string) {
    const fav = await this.usersRepository.addFavoriteProperty(userId, propertyId);
    await this.usersRepository.logActivity(userId, 'ADD_FAVORITE_PROPERTY', 'PROPERTY', propertyId);
    return fav;
  }

  async removeFavoriteProperty(userId: string, id: string) {
    await this.usersRepository.removeFavoriteProperty(userId, id);
    await this.usersRepository.logActivity(userId, 'REMOVE_FAVORITE_PROPERTY', 'PROPERTY', id);
    return { status: 'success', message: 'Property removed from favorites.' };
  }

  async getFavoriteProperties(userId: string) {
    return this.usersRepository.getFavoriteProperties(userId);
  }

  // --- SAVED JOBS ---
  async addSavedJob(userId: string, jobId: string) {
    const job = await this.usersRepository.addSavedJob(userId, jobId);
    await this.usersRepository.logActivity(userId, 'SAVE_JOB', 'JOB', jobId);
    return job;
  }

  async removeSavedJob(userId: string, id: string) {
    await this.usersRepository.removeSavedJob(userId, id);
    await this.usersRepository.logActivity(userId, 'UNSAVE_JOB', 'JOB', id);
    return { status: 'success', message: 'Job removed from saved jobs.' };
  }

  async getSavedJobs(userId: string) {
    return this.usersRepository.getSavedJobs(userId);
  }

  // --- VENDOR FOLLOWS ---
  async followVendor(userId: string, vendorId: string) {
    const follow = await this.usersRepository.followVendor(userId, vendorId);
    await this.usersRepository.logActivity(userId, 'FOLLOW_VENDOR', 'VENDOR', vendorId);
    return follow;
  }

  async unfollowVendor(userId: string, vendorId: string) {
    await this.usersRepository.unfollowVendor(userId, vendorId);
    await this.usersRepository.logActivity(userId, 'UNFOLLOW_VENDOR', 'VENDOR', vendorId);
    return { status: 'success', message: 'Vendor unfollowed successfully.' };
  }

  async getFollowingVendors(userId: string) {
    return this.usersRepository.getFollowingVendors(userId);
  }
}
