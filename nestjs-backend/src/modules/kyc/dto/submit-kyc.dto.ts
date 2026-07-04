export enum IdentityDocumentType {
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
}

export class SubmitKycDto {
  documentType: IdentityDocumentType;
  documentNumber: string;
  fullName: string;
  dateOfBirth?: string;
  nationality?: string;
  selfieImageUrl: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  businessLicenseUrl?: string;
}
