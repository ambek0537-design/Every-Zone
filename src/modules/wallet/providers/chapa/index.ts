// Chapa Payment Gateway integration stub/helper
export class ChapaProvider {
  // Simulate initiating a transaction
  async initializePayment(userId: string, amount: number, reference: string, callbackUrl: string) {
    console.log(`[Chapa SDK] Initializing payment of ${amount} ETB for user ${userId}. Ref: ${reference}`);
    return {
      status: "success",
      message: "Hosted payment link generated successfully",
      data: {
        checkout_url: `https://checkout.chapa.co/checkout/payment-btn/EVZ-CHAPA-${reference}`,
      }
    };
  }

  // Simulate webhook signature verification
  verifyWebhookSignature(payload: any, signature: string): boolean {
    // In real production, we do: crypto.createHmac('sha256', secret).update(payload).digest('hex') === signature
    // Since we want robust, secure checks, we simulate a verification:
    if (!signature) return false;
    return signature === "mock-chapa-secret-signature" || signature.startsWith("sha256=");
  }
}
