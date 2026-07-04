export interface CreatePropertyDto {
  vendorId: string;
  title: string;
  description: string;
  propertyType: "HOUSE" | "APARTMENT" | "CONDOMINIUM" | "VILLA" | "LAND" | "COMMERCIAL" | "OFFICE" | "WAREHOUSE";
  listingType: "SALE" | "RENT";
  price: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  sizeSqm?: number;
  yearBuilt?: number;
  city: string;
  subCity?: string;
  address?: string;
  latitude: number;
  longitude: number;
  featured?: boolean;
  amenities?: string[];
  images?: { imageUrl: string; sortOrder?: number; primaryImage?: boolean }[];
  videos?: { videoUrl: string; thumbnailUrl?: string }[];
}

export interface UpdatePropertyDto {
  title?: string;
  description?: string;
  propertyType?: "HOUSE" | "APARTMENT" | "CONDOMINIUM" | "VILLA" | "LAND" | "COMMERCIAL" | "OFFICE" | "WAREHOUSE";
  listingType?: "SALE" | "RENT";
  status?: "DRAFT" | "PENDING" | "ACTIVE" | "SOLD" | "RENTED" | "SUSPENDED" | "ARCHIVED";
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  sizeSqm?: number;
  yearBuilt?: number;
  city?: string;
  subCity?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  featured?: boolean;
}

export interface PropertyInquiryDto {
  buyerId: string;
  message: string;
}

export interface PropertyVisitDto {
  buyerId: string;
  visitDate: string; // ISO String
  note?: string;
}
