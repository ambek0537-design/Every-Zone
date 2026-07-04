import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "everyzone_enterprise_secure_secret_2026_xyz";

export function hashPassword(password: string): string {
  const salt = "everyzone_salt_constant_hash_2026";
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

export function comparePassword(password: string, hashed: string): boolean {
  if (!password || !hashed) return false;
  return hashPassword(password) === hashed;
}

export function generateToken(payload: any, expiresInSeconds = 86400): string {
  const header = { alg: "HS256", typ: "JWT" };
  const base64UrlEncode = (obj: any) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const encodedHeader = base64UrlEncode(header);
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const enrichedPayload = { ...payload, exp };
  const encodedPayload = base64UrlEncode(enrichedPayload);

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signatureInput}.${signature}`;
}

export function verifyToken(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(signatureInput)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    if (signature !== expectedSignature) return null;

    const decodedPayload = JSON.parse(
      Buffer.from(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );

    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token has expired
    }

    return decodedPayload;
  } catch {
    return null;
  }
}
