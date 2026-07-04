export type DocumentType =
  | "Passport"
  | "CV"
  | "National ID"
  | "Educational Certificate"
  | "Experience Letter"
  | "Medical Certificate"
  | "Passport Photo"
  | "Police Clearance"
  | "Other";

export interface DocumentUpload {
  id: string;
  userId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  isVerified: boolean;
}
