import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { KycStatus, IdentityDocumentType, VendorKyc, KycReviewHistory } from '@prisma/client';

@Injectable()
export class KycRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByVendorId(vendorId: string): Promise<VendorKyc | null> {
    return this.prisma.vendorKyc.findUnique({
      where: { vendorId },
    });
  }

  async findById(id: string): Promise<VendorKyc | null> {
    return this.prisma.vendorKyc.findUnique({
      where: { id },
    });
  }

  async createOrUpdateKyc(vendorId: string, dto: SubmitKycDto): Promise<VendorKyc> {
    const data = {
      vendorId,
      documentType: dto.documentType as IdentityDocumentType,
      documentNumber: dto.documentNumber,
      fullName: dto.fullName,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
      nationality: dto.nationality || null,
      selfieImageUrl: dto.selfieImageUrl,
      documentFrontUrl: dto.documentFrontUrl,
      documentBackUrl: dto.documentBackUrl || null,
      businessLicenseUrl: dto.businessLicenseUrl || null,
      status: KycStatus.SUBMITTED,
      submittedAt: new Date(),
      rejectionReason: null,
    };

    return this.prisma.vendorKyc.upsert({
      where: { vendorId },
      update: data,
      create: data,
    });
  }

  async updateStatus(id: string, status: KycStatus, reviewerId?: string, rejectionReason?: string): Promise<VendorKyc> {
    return this.prisma.vendorKyc.update({
      where: { id },
      data: {
        status,
        reviewedAt: status === KycStatus.APPROVED || status === KycStatus.REJECTED ? new Date() : undefined,
        reviewedBy: reviewerId,
        rejectionReason: rejectionReason || null,
      },
    });
  }

  async findPending(limit = 50, offset = 0): Promise<VendorKyc[]> {
    return this.prisma.vendorKyc.findMany({
      where: {
        status: {
          in: [KycStatus.SUBMITTED, KycStatus.UNDER_REVIEW],
        },
      },
      orderBy: { submittedAt: 'asc' },
      take: limit,
      skip: offset,
    });
  }

  async createReviewHistory(kycId: string, adminId: string, action: string, note?: string): Promise<KycReviewHistory> {
    return this.prisma.kycReviewHistory.create({
      data: {
        kycId,
        adminId,
        action,
        note,
      },
    });
  }

  async getReviewHistory(kycId: string): Promise<KycReviewHistory[]> {
    return this.prisma.kycReviewHistory.findMany({
      where: { kycId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Fraud detection helpers
  async findByDocumentNumber(documentNumber: string, excludeVendorId?: string): Promise<VendorKyc[]> {
    return this.prisma.vendorKyc.findMany({
      where: {
        documentNumber,
        vendorId: excludeVendorId ? { not: excludeVendorId } : undefined,
      },
    });
  }

  async findBySelfieImage(selfieImageUrl: string, excludeVendorId?: string): Promise<VendorKyc[]> {
    return this.prisma.vendorKyc.findMany({
      where: {
        selfieImageUrl,
        vendorId: excludeVendorId ? { not: excludeVendorId } : undefined,
      },
    });
  }

  async findByBusinessLicense(businessLicenseUrl: string, excludeVendorId?: string): Promise<VendorKyc[]> {
    return this.prisma.vendorKyc.findMany({
      where: {
        businessLicenseUrl,
        vendorId: excludeVendorId ? { not: excludeVendorId } : undefined,
      },
    });
  }

  async getMetrics() {
    const allKycs = await this.prisma.vendorKyc.findMany();
    const pendingCount = allKycs.filter(k => k.status === KycStatus.SUBMITTED || k.status === KycStatus.UNDER_REVIEW).length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const approvedToday = allKycs.filter(k => k.status === KycStatus.APPROVED && k.reviewedAt && k.reviewedAt >= today).length;
    const rejectedToday = allKycs.filter(k => k.status === KycStatus.REJECTED && k.reviewedAt && k.reviewedAt >= today).length;

    return {
      pendingVerifications: pendingCount,
      approvedToday,
      rejectedToday,
      totalKycSubmissions: allKycs.length,
    };
  }
}
