export type ReviewTargetType = 
  | 'PRODUCT' 
  | 'VENDOR' 
  | 'SERVICE' 
  | 'HOUSE' 
  | 'PROPERTY_AGENT' 
  | 'OVERSEAS_AGENCY';

export interface Review {
  id: string;
  targetType: ReviewTargetType;
  targetId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  text: string;
  photos: string[];
  videos: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  votedUserIds: string[]; // tracking users who voted helpful to prevent duplicate votes
  vendorReply?: string | null;
  vendorRepliedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
