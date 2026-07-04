export interface HelpfulVoteRequest {
  reviewId: string;
  userId: string;
}

export interface HelpfulVoteResponse {
  reviewId: string;
  helpfulVotes: number;
  hasVoted: boolean;
}
