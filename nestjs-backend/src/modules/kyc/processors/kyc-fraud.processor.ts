import { Injectable, Logger } from '@nestjs/common';
import { KycRepository } from '../kyc.repository';

export interface FraudAnalysisResult {
  isFlagged: boolean;
  flags: string[];
  duplicateIdDetected: boolean;
  duplicateSelfieDetected: boolean;
  duplicateLicenseDetected: boolean;
  blacklisted: boolean;
  multipleAccountsDetected: boolean;
}

@Injectable()
export class KycFraudProcessor {
  private readonly logger = new Logger(KycFraudProcessor.name);

  // Hardcoded blacklist for simulator purposes
  private readonly ID_BLACKLIST = [
    'ET-BLACKLIST-001',
    'ET-BLACKLIST-999',
    'ET-FRAUD-12345',
  ];

  constructor(private readonly kycRepository: KycRepository) {}

  /**
   * Processes fraud detection algorithms on newly submitted KYC profiles.
   */
  async analyzeKyc(
    vendorId: string,
    documentNumber: string,
    selfieImageUrl: string,
    businessLicenseUrl?: string,
  ): Promise<FraudAnalysisResult> {
    this.logger.log(`Executing fraud evaluation pipeline for vendor profile: ${vendorId}`);

    const flags: string[] = [];
    let duplicateIdDetected = false;
    let duplicateSelfieDetected = false;
    let duplicateLicenseDetected = false;
    let blacklisted = false;
    let multipleAccountsDetected = false;

    // 1. Blacklisted Identity Check
    if (this.ID_BLACKLIST.includes(documentNumber.toUpperCase())) {
      blacklisted = true;
      flags.push('CRITICAL: Identification Number is registered in our security blacklist.');
    }

    // 2. Duplicate National ID Detection
    const duplicateIdRecords = await this.kycRepository.findByDocumentNumber(documentNumber, vendorId);
    if (duplicateIdRecords.length > 0) {
      duplicateIdDetected = true;
      multipleAccountsDetected = true;
      flags.push(`SUSPICIOUS: National ID ${documentNumber} is already in use by vendor ${duplicateIdRecords[0].vendorId}.`);
    }

    // 3. Duplicate Selfie Detection (Simulating facial biometric reuse)
    if (selfieImageUrl) {
      const duplicateSelfieRecords = await this.kycRepository.findBySelfieImage(selfieImageUrl, vendorId);
      if (duplicateSelfieRecords.length > 0) {
        duplicateSelfieDetected = true;
        flags.push(`SUSPICIOUS: Selfie image matches a profile previously uploaded by vendor ${duplicateSelfieRecords[0].vendorId}.`);
      }
    }

    // 4. Duplicate Business License
    if (businessLicenseUrl) {
      const duplicateLicenseRecords = await this.kycRepository.findByBusinessLicense(businessLicenseUrl, vendorId);
      if (duplicateLicenseRecords.length > 0) {
        duplicateLicenseDetected = true;
        flags.push(`SUSPICIOUS: Business Trade License is identical to the certificate used by vendor ${duplicateLicenseRecords[0].vendorId}.`);
      }
    }

    return {
      isFlagged: flags.length > 0,
      flags,
      duplicateIdDetected,
      duplicateSelfieDetected,
      duplicateLicenseDetected,
      blacklisted,
      multipleAccountsDetected,
    };
  }
}
