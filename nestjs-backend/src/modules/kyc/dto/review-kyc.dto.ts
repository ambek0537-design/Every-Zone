export enum KycReviewAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class ReviewKycDto {
  action: KycReviewAction;
  note?: string;
  rejectionReason?: string;
}
