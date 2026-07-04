import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createVendor(@Req() req: any, @Body() dto: CreateVendorDto) {
    return this.vendorsService.createVendor(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getVendorMe(@Req() req: any) {
    return this.vendorsService.getVendorMe(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  async updateVendorMe(@Req() req: any, @Body() dto: UpdateVendorDto) {
    return this.vendorsService.updateVendorMe(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logo')
  @HttpCode(HttpStatus.OK)
  async uploadLogo(@Req() req: any, @Body('logoUrl') logoUrl: string) {
    return this.vendorsService.uploadLogo(req.user.id, logoUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cover')
  @HttpCode(HttpStatus.OK)
  async uploadCover(@Req() req: any, @Body('coverUrl') coverUrl: string) {
    return this.vendorsService.uploadCover(req.user.id, coverUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Req() req: any) {
    return this.vendorsService.getDashboard(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Req() req: any, @Body() dto: UpdateStoreSettingsDto) {
    return this.vendorsService.updateSettings(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  @HttpCode(HttpStatus.OK)
  async getAnalytics(@Req() req: any) {
    return this.vendorsService.getAnalytics(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('working-hours')
  @HttpCode(HttpStatus.OK)
  async getWorkingHours(@Req() req: any) {
    return this.vendorsService.getWorkingHours(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('working-hours')
  @HttpCode(HttpStatus.OK)
  async updateWorkingHours(@Req() req: any, @Body('workingHours') workingHours: any[]) {
    return this.vendorsService.updateWorkingHours(req.user.id, workingHours);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gallery')
  @HttpCode(HttpStatus.OK)
  async getGallery(@Req() req: any) {
    return this.vendorsService.getGallery(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('gallery')
  @HttpCode(HttpStatus.CREATED)
  async addGalleryItem(
    @Req() req: any,
    @Body('mediaUrl') mediaUrl: string,
    @Body('mediaType') mediaType: string,
  ) {
    return this.vendorsService.addGalleryItem(req.user.id, mediaUrl, mediaType);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('gallery/:id')
  @HttpCode(HttpStatus.OK)
  async deleteGalleryItem(@Req() req: any, @Param('id') id: string) {
    return this.vendorsService.deleteGalleryItem(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('social-links')
  @HttpCode(HttpStatus.OK)
  async getSocialLinks(@Req() req: any) {
    return this.vendorsService.getSocialLinks(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('social-links')
  @HttpCode(HttpStatus.OK)
  async updateSocialLinks(@Req() req: any, @Body('socialLinks') socialLinks: any[]) {
    return this.vendorsService.updateSocialLinks(req.user.id, socialLinks);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async findStoreBySlug(@Param('slug') slug: string) {
    return this.vendorsService.findStoreBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  @HttpCode(HttpStatus.OK)
  async followVendor(@Req() req: any, @Param('id') id: string) {
    return this.vendorsService.toggleFollowVendor(id, req.user.id);
  }
}
