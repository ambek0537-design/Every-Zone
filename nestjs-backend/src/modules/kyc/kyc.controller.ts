import { Controller, Post, Get, Patch, Body, Req, UseGuards, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ReviewKycDto, KycReviewAction } from './dto/review-kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { KycOwnerGuard } from './guards/kyc-owner.guard';

@Controller()
export class KycController {
  constructor(private readonly kycService: KycService) {}

  // ==========================================
  // VENDOR ENDPOINTS
  // ==========================================

  @UseGuards(JwtAuthGuard)
  @Post('kyc/submit')
  @HttpCode(HttpStatus.CREATED)
  async submitKyc(@Req() req: any, @Body() dto: SubmitKycDto) {
    // In our authentication system, user has vendorProfile attachment in token or user.id
    const vendorId = req.user.vendorProfile?.id || req.user.id;
    return this.kycService.submitKyc(vendorId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('kyc/me')
  @HttpCode(HttpStatus.OK)
  async getMyKyc(@Req() req: any) {
    const vendorId = req.user.vendorProfile?.id || req.user.id;
    return this.kycService.getKycByVendor(vendorId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('kyc/resubmit')
  @HttpCode(HttpStatus.OK)
  async resubmitKyc(@Req() req: any, @Body() dto: SubmitKycDto) {
    const vendorId = req.user.vendorProfile?.id || req.user.id;
    return this.kycService.submitKyc(vendorId, dto);
  }

  // ==========================================
  // ADMIN CONTROL ENDPOINTS
  // ==========================================

  @UseGuards(JwtAuthGuard)
  @Post('admin/kyc/approve')
  @HttpCode(HttpStatus.OK)
  async approveKyc(
    @Req() req: any,
    @Body() body: { id: string; note?: string },
  ) {
    return this.kycService.reviewKyc(body.id, req.user.id, {
      action: KycReviewAction.APPROVE,
      note: body.note,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/kyc/reject')
  @HttpCode(HttpStatus.OK)
  async rejectKyc(
    @Req() req: any,
    @Body() body: { id: string; note?: string; rejectionReason: string },
  ) {
    return this.kycService.reviewKyc(body.id, req.user.id, {
      action: KycReviewAction.REJECT,
      note: body.note,
      rejectionReason: body.rejectionReason,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/kyc/pending')
  @HttpCode(HttpStatus.OK)
  async getPendingKycs(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.kycService.getPendingKycs(limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/kyc/metrics')
  @HttpCode(HttpStatus.OK)
  async getMetrics() {
    return this.kycService.getMetrics();
  }

  @UseGuards(JwtAuthGuard, KycOwnerGuard)
  @Get('admin/kyc/:id')
  @HttpCode(HttpStatus.OK)
  async getKycDetails(@Param('id') id: string) {
    return this.kycService.getKycById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/kyc/:id/history')
  @HttpCode(HttpStatus.OK)
  async getKycHistory(@Param('id') id: string) {
    return this.kycService.getReviewHistory(id);
  }
}
