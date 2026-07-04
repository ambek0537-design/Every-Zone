import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { validateRegister, validateLogin } from "./dto/auth.dto";

export const authRouter = Router();
const authService = new AuthService();

// Simple in-memory rate limiting map for login protection
const loginAttempts = new Map<string, { count: number; blockedUntil: number }>();

function rateLimitLogin(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "unknown-ip";
  const now = Date.now();
  const limitInfo = loginAttempts.get(ip);

  if (limitInfo && limitInfo.blockedUntil > now) {
    const minutesLeft = Math.ceil((limitInfo.blockedUntil - now) / 60000);
    return res.status(429).json({
      error: `እባክዎን ከ ${minutesLeft} ደቂቃ በኋላ እንደገና ይሞክሩ። / Too many failed attempts. Please try again in ${minutesLeft} minute(s).`,
    });
  }
  next();
}

function handleLoginFailure(ip: string) {
  const now = Date.now();
  const current = loginAttempts.get(ip) || { count: 0, blockedUntil: 0 };
  current.count += 1;

  if (current.count >= 5) {
    current.blockedUntil = now + 15 * 60000; // Block for 15 minutes
    current.count = 0; // Reset counter after block triggers
  }
  loginAttempts.set(ip, current);
}

function handleLoginSuccess(ip: string) {
  loginAttempts.delete(ip);
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Register user
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const validationError = validateRegister(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Login User (Rate Limited)
authRouter.post("/login", rateLimitLogin, async (req: Request, res: Response) => {
  const ip = req.ip || "unknown-ip";
  try {
    const validationError = validateLogin(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await authService.login(req.body);
    handleLoginSuccess(ip);
    return res.status(200).json(result);
  } catch (err: any) {
    handleLoginFailure(ip);
    return res.status(401).json({ error: err.message });
  }
});

// Verify OTP
authRouter.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "ኢሜይል እና የይለፍ OTP ኮድ ያስፈልጋል። / Email and OTP code are required." });
    }

    const result = await authService.verifyOtp({ email, otp });
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Reset Password
authRouter.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const result = await authService.resetPassword(req.body);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Fetch current logged-in user profile from token
authRouter.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "ይግቡ። / Authentication token is missing." });
    }

    const profile = await authService.getProfileFromToken(authHeader);
    return res.status(200).json(profile);
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
});
