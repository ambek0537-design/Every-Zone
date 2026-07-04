export interface OverseasReview {
  id: string;
  agencyId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  photos?: string[];
  createdAt: string;
}
