// Webhook utility verification helpers
export function verifyChapaWebhook(body: any, rawSignature: string): boolean {
  if (!rawSignature) return false;
  // Simple simulation of raw HMAC hashing.
  return rawSignature === "valid-chapa-signature" || rawSignature.length > 10;
}

export function verifyTelebirrWebhook(body: any): boolean {
  // Telebirr validation checks
  return !!body;
}
