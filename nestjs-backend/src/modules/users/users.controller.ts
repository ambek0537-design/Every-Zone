import { Controller, Get, Patch, Post, Delete, Body, Req, UseGuards, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Post('avatar')
  @HttpCode(HttpStatus.OK)
  async updateAvatar(@Req() req: any, @Body('avatarUrl') avatarUrl: string) {
    return this.usersService.updateAvatar(req.user.id, avatarUrl);
  }

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  async getSettings(@Req() req: any) {
    return this.usersService.getSettings(req.user.id);
  }

  @Patch('settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Req() req: any, @Body() body: any) {
    return this.usersService.updateSettings(req.user.id, body);
  }

  @Get('activity')
  @HttpCode(HttpStatus.OK)
  async getActivities(@Req() req: any) {
    return this.usersService.getActivities(req.user.id);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly usersService: UsersService) {}

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  async addFavoriteProduct(@Req() req: any, @Body('productId') productId: string) {
    return this.usersService.addFavoriteProduct(req.user.id, productId);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  async removeFavoriteProduct(@Req() req: any, @Param('id') id: string) {
    return this.usersService.removeFavoriteProduct(req.user.id, id);
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  async getFavoriteProducts(@Req() req: any) {
    return this.usersService.getFavoriteProducts(req.user.id);
  }

  @Post('properties')
  @HttpCode(HttpStatus.CREATED)
  async addFavoriteProperty(@Req() req: any, @Body('propertyId') propertyId: string) {
    return this.usersService.addFavoriteProperty(req.user.id, propertyId);
  }

  @Delete('properties/:id')
  @HttpCode(HttpStatus.OK)
  async removeFavoriteProperty(@Req() req: any, @Param('id') id: string) {
    return this.usersService.removeFavoriteProperty(req.user.id, id);
  }

  @Get('properties')
  @HttpCode(HttpStatus.OK)
  async getFavoriteProperties(@Req() req: any) {
    return this.usersService.getFavoriteProperties(req.user.id);
  }

  @Post('jobs')
  @HttpCode(HttpStatus.CREATED)
  async addSavedJob(@Req() req: any, @Body('jobId') jobId: string) {
    return this.usersService.addSavedJob(req.user.id, jobId);
  }

  @Delete('jobs/:id')
  @HttpCode(HttpStatus.OK)
  async removeSavedJob(@Req() req: any, @Param('id') id: string) {
    return this.usersService.removeSavedJob(req.user.id, id);
  }

  @Get('jobs')
  @HttpCode(HttpStatus.OK)
  async getSavedJobs(@Req() req: any) {
    return this.usersService.getSavedJobs(req.user.id);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('vendors')
export class UserVendorsController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/follow')
  @HttpCode(HttpStatus.OK)
  async followVendor(@Req() req: any, @Param('id') id: string) {
    return this.usersService.followVendor(req.user.id, id);
  }

  @Delete(':id/follow')
  @HttpCode(HttpStatus.OK)
  async unfollowVendor(@Req() req: any, @Param('id') id: string) {
    return this.usersService.unfollowVendor(req.user.id, id);
  }

  @Get('following')
  @HttpCode(HttpStatus.OK)
  async getFollowing(@Req() req: any) {
    return this.usersService.getFollowingVendors(req.user.id);
  }
}
