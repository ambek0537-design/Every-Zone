import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  UsePipes, 
  ValidationPipe,
  Query,
  Headers
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { SuspendVendorDto } from './dto/suspend-vendor.dto';
import { ApproveVendorDto } from './dto/approve-vendor.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Roles } from './permissions/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { AdminRole, VerificationStatus } from '@prisma/client';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /admin/dashboard
   * Retrieves aggregated operational, safety, and financial dashboard metrics
   */
  @Get('dashboard')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.FINANCE_ADMIN, AdminRole.KYC_ADMIN, AdminRole.SUPPORT_ADMIN, AdminRole.CONTENT_ADMIN, AdminRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  /**
   * GET /admin/users
   * Lists verified and unverified system users with their identity properties
   */
  @Get('users')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.KYC_ADMIN, AdminRole.SUPPORT_ADMIN)
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.adminService.getUsers();
  }

  /**
   * GET /admin/vendors
   * Lists registration details and active rental/subscription details of vendors
   */
  @Get('vendors')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.KYC_ADMIN, AdminRole.SUPPORT_ADMIN, AdminRole.FINANCE_ADMIN)
  @HttpCode(HttpStatus.OK)
  async getVendors() {
    return this.adminService.getVendors();
  }

  /**
   * GET /admin/reports
   * Fetches fraud and safety complaints reported by users
   */
  @Get('reports')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.SUPPORT_ADMIN, AdminRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  async getReports() {
    return this.adminService.getReports();
  }

  /**
   * GET /admin/transactions
   * Lists all direct subscription charges and offline user receipts
   */
  @Get('transactions')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.FINANCE_ADMIN)
  @HttpCode(HttpStatus.OK)
  async getTransactions() {
    return this.adminService.getTransactions();
  }

  /**
   * POST /admin/vendors/suspend
   * Restricts vendor access, hides products and logs suspension details
   */
  @Post('vendors/suspend')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.MODERATOR, AdminRole.SUPPORT_ADMIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async suspendVendor(
    @Body() dto: SuspendVendorDto,
    @Headers('x-admin-id') adminId?: string,
  ) {
    return this.adminService.suspendVendor(dto, adminId);
  }

  /**
   * POST /admin/vendors/approve
   * Validates vendor applications, updates subscription logs and enables active selling
   */
  @Post('vendors/approve')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.KYC_ADMIN)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async approveVendor(
    @Body() dto: ApproveVendorDto,
    @Headers('x-admin-id') adminId?: string,
  ) {
    return this.adminService.approveVendor(dto, adminId);
  }

  /**
   * POST /admin/announcements
   * Launches high priority announcement banners across the application platform
   */
  @Post('announcements')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.CONTENT_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createAnnouncement(
    @Body() dto: CreateAnnouncementDto,
    @Headers('x-admin-id') adminId?: string,
  ) {
    return this.adminService.createAnnouncement(dto, adminId);
  }

  // ==========================================
  // ADDITIONAL OPERATIONAL UTILITIES
  // ==========================================

  /**
   * POST /admin/vendors/:id/restore
   * Unlocks suspended vendor shops
   */
  @Post('vendors/:id/restore')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.SUPPORT_ADMIN, AdminRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  async restoreVendor(
    @Param('id') id: string,
    @Headers('x-admin-id') adminId?: string,
  ) {
    return this.adminService.restoreVendor(id, adminId);
  }

  /**
   * POST /admin/users/:id/kyc
   * Approves, suspends, or rejects users' identity checks (e.g., PENDING, APPROVED, REJECTED)
   */
  @Post('users/:id/kyc')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.KYC_ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateKycStatus(
    @Param('id') id: string,
    @Body('status') status: VerificationStatus,
    @Headers('x-admin-id') adminId?: string,
  ) {
    return this.adminService.updateKycStatus(id, status, adminId);
  }

  /**
   * POST /admin/listings/:id/moderate
   * Deletes, hides or approves physical marketplace listing records
   */
  @Post('listings/:id/moderate')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.MODERATOR, AdminRole.CONTENT_ADMIN)
  @HttpCode(HttpStatus.OK)
  async moderateListing(
    @Param('id') id: string,
    @Body('action') action: 'APPROVE' | 'HIDE' | 'DELETE',
    @Headers('x-admin-id') adminId?: string,
  ) {
    return this.adminService.moderateListing(id, action, adminId);
  }

  /**
   * POST /admin/payments/:id/approve
   * Approves a user's pending manual payment submission
   */
  @Post('payments/:id/approve')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.FINANCE_ADMIN)
  @HttpCode(HttpStatus.OK)
  async approveManualPayment(
    @Param('id') id: string,
    @Headers('x-admin-id') adminId?: string,
  ) {
    return this.adminService.approveManualPayment(id, adminId);
  }

  /**
   * GET /admin/announcements
   * Fetches active announcements
   */
  @Get('announcements')
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.CONTENT_ADMIN, AdminRole.SUPPORT_ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAnnouncements() {
    return this.adminService.getAnnouncements();
  }

  /**
   * GET /admin/audit-logs
   * Fetches comprehensive system administrative audit trails
   */
  @Get('audit-logs')
  @Roles(AdminRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
