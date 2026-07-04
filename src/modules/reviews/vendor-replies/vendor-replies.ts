export interface VendorReply {
  reviewId: string;
  vendorId: string;
  replyText: string;
  repliedAt: Date;
}

export const VENDOR_REPLY_TEMPLATES = [
  "Thank you for shopping with us. We appreciate your feedback.",
  "We are delighted that you enjoyed our product/service! Thank you for the trust.",
  "Thank you for your valuable response. We are committed to continuous improvements.",
  "We apologize for the inconvenience. Our team will reach out to resolve any issues immediately."
];
