import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { KycRepository } from './kyc.repository';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ReviewKycDto, KycReviewAction } from './dto/review-kyc.dto';
import { FaydaService } from './services/fayda.service';
import { KycFraudProcessor } from './processors/kyc-fraud.processor';
import { KycStatus, VendorKyc, KycReviewHistory, VendorStatus, StoreStatus, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private readonly kycRepository: KycRepository,
    private readonly faydaService: FaydaService,
    private readonly fraudProcessor: KycFraudProcessor,
    private readonly prisma: PrismaService,
  ) {}

  async submitKyc(vendorId: string, dto: SubmitKycDto): Promise<VendorKyc> {
    this.logger.log(`Processing new KYC filing for vendor: ${vendorId}`);

    // Validate vendor exists
    const vendorExists = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendorExists) {
      throw new NotFoundException(`Vendor with ID ${vendorId} does not exist in our system.`);
    }

    // 1. Fayda Digital ID Verification Check
    if (dto.documentType === 'NATIONAL_ID' || dto.documentType === 'PASSPORT') {
      const faydaResult = await this.faydaService.verifyDigitalId(dto.documentNumber, dto.fullName);
      if (!faydaResult.verified) {
        throw new BadRequestException('Security Block: Government Fayda ID lookup could not verify these credentials.');
      }
    }

    // 2. Fraud Analysis
    const fraudResult = await this.fraudProcessor.analyzeKyc(
      vendorId,
      dto.documentNumber,
      dto.selfieImageUrl,
      dto.businessLicenseUrl,
    );

    if (fraudResult.blacklisted) {
      throw new BadRequestException('Security Alert: This identification is flagged as blacklisted and cannot register.');
    }

    // Create or update the KYC record in database
    const kyc = await this.kycRepository.createOrUpdateKyc(vendorId, dto);

    // Write initial review trail for audit logs
    await this.kycRepository.createReviewHistory(
      kyc.id,
      'SYSTEM_OCR_BOT',
      'SUBMIT',
      `Auto-scrub completed. ${fraudResult.isFlagged ? `Flagged issues found: ${fraudResult.flags.join(', ')}` : 'No immediate duplicates found.'}`,
    );

    // If flagged with warnings, we keep UNDER_REVIEW, otherwise we can place in SUBMITTED queue
    const targetStatus = fraudResult.isFlagged ? KycStatus.UNDER_REVIEW : KycStatus.SUBMITTED;
    return this.kycRepository.updateStatus(kyc.id, targetStatus, 'SYSTEM_OCR_BOT');
  }

  async getKycByVendor(vendorId: string): Promise<VendorKyc> {
    const kyc = await this.kycRepository.findByVendorId(vendorId);
    if (!kyc) {
      throw new NotFoundException(`No KYC file exists for vendor ${vendorId}.`);
    }
    return kyc;
  }

  async getKycById(id: string): Promise<VendorKyc> {
    const kyc = await this.kycRepository.findById(id);
    if (!kyc) {
      throw new NotFoundException(`KYC certificate with ID ${id} was not found.`);
    }
    return kyc;
  }

  async getPendingKycs(limit?: number, offset?: number): Promise<VendorKyc[]> {
    return this.kycRepository.findPending(limit, offset);
  }

  async reviewKyc(id: string, reviewerId: string, dto: ReviewKycDto): Promise<VendorKyc> {
    const kyc = await this.kycRepository.findById(id);
    if (!kyc) {
      throw new NotFoundException(`KYC certificate with ID ${id} was not found.`);
    }

    if (kyc.status === KycStatus.APPROVED || kyc.status === KycStatus.REJECTED) {
      throw new BadRequestException(`Filing is already in final status: ${kyc.status}`);
    }

    const nextStatus = dto.action === KycReviewAction.APPROVE ? KycStatus.APPROVED : KycStatus.REJECTED;
    const updatedKyc = await this.kycRepository.updateStatus(id, nextStatus, reviewerId, dto.rejectionReason);

    // Create review trail audit log
    await this.kycRepository.createReviewHistory(
      id,
      reviewerId,
      dto.action,
      dto.note || (dto.action === KycReviewAction.REJECT ? `Rejected: ${dto.rejectionReason}` : 'Approved by manual auditor audit.'),
    );

    // APPLY ENFORCEMENT RULES
    if (nextStatus === KycStatus.APPROVED) {
      // Rule 1: APPROVED -> Vendor Verification = TRUE, Store Eligible for Activation
      await this.prisma.vendor.update({
        where: { id: kyc.vendorId },
        data: {
          verified: true,
          status: VendorStatus.ACTIVE,
        },
      });

      // Activate VendorStore automatically if registered
      const storeExists = await this.prisma.vendorStore.findUnique({
        where: { vendorId: kyc.vendorId },
      });
      if (storeExists) {
        await this.prisma.vendorStore.update({
          where: { vendorId: kyc.vendorId },
          data: {
            status: StoreStatus.ACTIVE,
            verification: VerificationStatus.APPROVED,
          },
        });
      }

      this.logger.log(`Enforcement: Vendor ${kyc.vendorId} and Store activated successfully.`);
    } else if (nextStatus === KycStatus.REJECTED) {
      // Rule 2: REJECTED -> Vendor can re-submit documents, keep current vendor suspended/pending
      await this.prisma.vendor.update({
        where: { id: kyc.vendorId },
        data: {
          verified: false,
          status: VendorStatus.REJECTED,
        },
      });

      // Update store to suspended or pending
      const storeExists = await this.prisma.vendorStore.findUnique({
        where: { vendorId: kyc.vendorId },
      });
      if (storeExists) {
        await this.prisma.vendorStore.update({
          where: { vendorId: kyc.vendorId },
          data: {
            status: StoreStatus.SUSPENDED,
            verification: VerificationStatus.REJECTED,
          },
        });
      }

      this.logger.warn(`Enforcement: Vendor ${kyc.vendorId} registration rejected.`);
    }

    return updatedKyc;
  }

  async getReviewHistory(kycId: string): Promise<KycReviewHistory[]> {
    return this.kycRepository.getReviewHistory(kycId);
  }

  async getMetrics() {
    return this.kycRepository.getMetrics();
  }
}
