export interface PersonalizedFeedDto {
  userId?: string;
  location?: string;
  budget?: number;
  language?: "en" | "am";
  searchHistory?: string[];
  preferredCategories?: string[];
}

export interface JobProfileDto {
  education?: string;
  experience?: string;
  languages?: string[];
  preferredCountry?: string;
  expectedSalary?: number;
}

export interface HouseRecommendationDto {
  userId?: string;
  budget: number; // in ETB
}

export interface VendorRecommendationDto {
  category?: string;
  nearby?: boolean;
  userLocation?: string;
}

export interface FraudCheckDto {
  type: "listing" | "review" | "account";
  targetId: string;
  content: string;
  metadata?: any;
}
