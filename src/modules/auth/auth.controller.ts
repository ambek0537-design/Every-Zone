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

// -------------------------------------------------------------
// GOOGLE OAUTH & SIMULATOR ENDPOINTS
// -------------------------------------------------------------

// 1. Get Google OAuth Authorization URL or Simulation URL
authRouter.get("/google/url", (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (clientId && clientId !== "dummy") {
    const redirectUri = `${req.protocol}://${req.get("host")}/api/auth/google/callback`;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account"
    }).toString();
    return res.json({ url, simulated: false });
  } else {
    // Return URL for the premium, high-fidelity Choose Account simulation page
    const simulationUrl = `${req.protocol}://${req.get("host")}/api/auth/google/simulation`;
    return res.json({ url: simulationUrl, simulated: true });
  }
});

// 2. Google OAuth Callback (for real Google credentials)
authRouter.get("/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send("Authorization code is missing.");
  }
  try {
    const redirectUri = `${req.protocol}://${req.get("host")}/api/auth/google/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Google token exchange failed: ${errorText}`);
    }
    const tokens: any = await tokenResponse.json();
    
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    if (!userinfoResponse.ok) {
      throw new Error("Failed to fetch userinfo from Google.");
    }
    const googleUser: any = await userinfoResponse.json();
    const { email, name, picture } = googleUser;
    
    const authResult = await authService.handleGoogleAuth(email, name, picture);
    
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Google Sign-In Success</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #fafaf9; color: #1c1917; }
          .card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; max-width: 400px; width: 90%; }
          h2 { margin-top: 0; color: #1c1917; }
          p { color: #78716c; font-size: 14px; }
          .spinner { border: 3px solid #e7e5e4; border-top: 3px solid #22c55e; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 20px auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Google Sign-In Verified</h2>
          <p>Redirecting you back to Every-zone...</p>
          <div class="spinner"></div>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: "GOOGLE_OAUTH_SUCCESS",
              token: "${authResult.token}",
              user: ${JSON.stringify(authResult.user)}
            }, "*");
            window.close();
          } else {
            document.body.innerHTML = '<h2>✓ Authentication Successful</h2><p>You can close this tab and return to the application.</p>';
          }
        </script>
      </body>
      </html>
    `);
  } catch (err: any) {
    console.error("Google OAuth callback error:", err);
    return res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

// 3. Render High-Fidelity Google Choose Account Simulation Page
authRouter.get("/google/simulation", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in with Google - Every-zone</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        body { font-family: 'Roboto', sans-serif; }
      </style>
    </head>
    <body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm max-w-md w-full p-8 md:p-10 text-center">
        <!-- Google Logo -->
        <div class="flex justify-center mb-6">
          <svg class="w-16 h-8" viewBox="0 0 74 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.24 10.9V13.84H14.86C14.62 15.11 13.62 17.58 9.24 17.58C5.46 17.58 2.38 14.45 2.38 10.59C2.38 6.72999 5.46 3.59999 9.24 3.59999C11.39 3.59999 12.83 4.49999 13.65 5.28999L15.97 3.01999C14.48 1.62999 12.06 0.779991 9.24 0.779991C3.83 0.779991 -0.0199997 5.17 -0.0199997 10.59C-0.0199997 16 3.83 20.39 9.24 20.39C14.89 20.39 18.64 16.42 18.64 10.83C18.64 10.15 18.56 9.54999 18.45 9.04999H9.24V10.9ZM28.53 7.03999C24.47 7.03999 21.21 10.12 21.21 14.12C21.21 18.12 24.47 21.2 28.53 21.2C32.59 21.2 35.85 18.12 35.85 14.12C35.85 10.12 32.59 7.03999 28.53 7.03999ZM28.53 18.4C26.31 18.4 24.36 16.57 24.36 14.12C24.36 11.67 26.31 9.83999 28.53 9.83999C30.75 9.83999 32.7 11.67 32.7 14.12C32.7 16.57 30.75 18.4 28.53 18.4ZM46.97 7.03999C42.91 7.03999 39.65 10.12 39.65 14.12C39.65 18.12 42.91 21.2 46.97 21.2C51.03 21.2 54.29 18.12 54.29 14.12C54.29 10.12 51.03 7.03999 46.97 7.03999ZM46.97 18.4C44.75 18.4 42.8 16.57 42.8 14.12C42.8 11.67 44.75 9.83999 46.97 9.83999C49.19 9.83999 51.14 11.67 51.14 14.12C51.14 16.57 49.19 18.4 46.97 18.4ZM64.53 7.03999C60.79 7.03999 57.77 10.29 57.77 14.16C57.77 18 60.79 21.2 64.53 21.2C66.86 21.2 68.49 20.08 69.34 19.06V20.37C69.34 23.01 67.92 24.42 65.65 24.42C63.81 24.42 62.67 23.11 62.2 22.02L59.57 23.11C60.33 24.94 62.33 27.22 65.65 27.22C69.21 27.22 72.22 25.13 72.22 20.03V7.39999H69.34V8.65999C68.49 7.64999 66.86 7.03999 64.53 7.03999ZM64.83 18.4C62.64 18.4 60.92 16.51 60.92 14.12C60.92 11.73 62.64 9.83999 64.83 9.83999C67.02 9.83999 68.68 11.73 68.68 14.12C68.68 16.51 67.02 18.4 64.83 18.4Z" fill="#4285F4"/>
            <path d="M76.99 0.779991H74.11V20.37H76.99V0.779991Z" fill="#34A853"/>
            <path d="M84.7 18.4C83.18 18.4 81.65 17.7 80.96 16.03L89.65 12.42L89.36 11.7C88.84 10.3 87.27 7.03999 83.35 7.03999C79.43 7.03999 76.15 10.15 76.15 14.12C76.15 18.06 79.4 21.2 83.74 21.2C87.23 21.2 89.28 19.06 90.12 17.82L87.81 16.28C87.03 17.43 85.83 18.4 84.7 18.4ZM84.44 9.80999C85.64 9.80999 86.66 10.42 87 11.33L79.11 14.59C79.11 11.83 81.16 9.80999 84.44 9.80999Z" fill="#EA4335"/>
          </svg>
        </div>

        <h1 class="text-2xl font-medium text-gray-800 tracking-tight">Choose an account</h1>
        <p class="text-sm text-gray-500 mt-1 mb-8">to continue to <span class="font-semibold text-gray-700">Every-zone</span></p>

        <!-- Loader overlay -->
        <div id="loader" class="hidden my-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-xs text-gray-400 mt-2">Connecting to secure Google SSO...</p>
        </div>

        <div id="main-content" class="space-y-3 text-left">
          <!-- Accounts list -->
          <div class="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden bg-white">
            <!-- Ambek Everyzone -->
            <button onclick="selectAccount('ambek0537@gmail.com', 'Ambek Everyzone')" class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition duration-150 group">
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">AE</div>
                <div>
                  <p class="text-sm font-medium text-gray-700">Ambek Everyzone</p>
                  <p class="text-xs text-gray-400">ambek0537@gmail.com</p>
                </div>
              </div>
              <span class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Verified</span>
            </button>

            <!-- Selamawit Tekle -->
            <button onclick="selectAccount('test.buyer@everyzone.com', 'Selamawit Tekle')" class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition duration-150 group">
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">ST</div>
                <div>
                  <p class="text-sm font-medium text-gray-700">Selamawit Tekle</p>
                  <p class="text-xs text-gray-400">test.buyer@everyzone.com</p>
                </div>
              </div>
              <span class="text-xs text-gray-400">Buyer</span>
            </button>

            <!-- Kidus Abera -->
            <button onclick="selectAccount('admin@everyzone.com', 'Kidus Abera')" class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition duration-150 group">
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-sm">KA</div>
                <div>
                  <p class="text-sm font-medium text-gray-700">Kidus Abera</p>
                  <p class="text-xs text-gray-400">admin@everyzone.com</p>
                </div>
              </div>
              <span class="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Admin</span>
            </button>
          </div>

          <!-- Use another account button -->
          <button onclick="toggleCustomForm()" class="w-full py-3.5 px-4 flex items-center space-x-3 text-sm text-blue-600 font-medium hover:bg-blue-50/50 rounded-lg transition duration-150">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            <span>Use another Google account</span>
          </button>

          <!-- Custom User Form -->
          <form id="custom-form" class="hidden space-y-3 pt-3 border-t border-gray-100" onsubmit="handleCustomSubmit(event)">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
              <input type="text" id="custom-name" required placeholder="e.g. Almaz Kebede" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Google Email Address</label>
              <input type="email" id="custom-email" required placeholder="e.g. almaz@gmail.com" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
            </div>
            <div class="flex space-x-2 pt-2">
              <button type="button" onclick="toggleCustomForm()" class="w-1/2 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50">Cancel</button>
              <button type="submit" class="w-1/2 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">Sign in</button>
            </div>
          </form>
        </div>

        <p class="text-xs text-gray-400 mt-8 leading-relaxed">
          By continuing, Google will share your name, email address, language preference, and profile picture with Every-zone. Before using this app, you can review its <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#" class="text-blue-600 hover:underline">Terms of Service</a>.
        </p>
      </div>

      <script>
        function selectAccount(email, name) {
          document.getElementById('main-content').classList.add('hidden');
          document.getElementById('loader').classList.remove('hidden');
          
          // Submit to simulated callback route after a 1.2s realistic network delay
          setTimeout(() => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/api/auth/google/callback-simulated';
            
            const emailInput = document.createElement('input');
            emailInput.type = 'hidden';
            emailInput.name = 'email';
            emailInput.value = email;
            
            const nameInput = document.createElement('input');
            nameInput.type = 'hidden';
            nameInput.name = 'fullName';
            nameInput.value = name;
            
            form.appendChild(emailInput);
            form.appendChild(nameInput);
            document.body.appendChild(form);
            form.submit();
          }, 1200);
        }

        function toggleCustomForm() {
          const form = document.getElementById('custom-form');
          form.classList.toggle('hidden');
        }

        function handleCustomSubmit(event) {
          event.preventDefault();
          const name = document.getElementById('custom-name').value;
          const email = document.getElementById('custom-email').value;
          if (name && email) {
            selectAccount(email, name);
          }
        }
      </script>
    </body>
    </html>
  `);
});

// 4. Google Callback Simulated (registers and signs in user)
authRouter.post("/google/callback-simulated", async (req: Request, res: Response) => {
  const { email, fullName } = req.body;
  if (!email || !fullName) {
    return res.status(400).send("Email and Full Name are required for Google verification simulation.");
  }
  try {
    const authResult = await authService.handleGoogleAuth(email, fullName);
    
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Google Sign-In Success</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #fafaf9; color: #1c1917; }
          .card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; max-width: 400px; width: 90%; }
          h2 { margin-top: 0; color: #16a34a; }
          p { color: #78716c; font-size: 14px; }
          .spinner { border: 3px solid #e7e5e4; border-top: 3px solid #22c55e; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 20px auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Google SSO Handshake Verified</h2>
          <p>Logged in successfully as <strong>${fullName}</strong>.</p>
          <p>Redirecting you back to Every-zone...</p>
          <div class="spinner"></div>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: "GOOGLE_OAUTH_SUCCESS",
              token: "${authResult.token}",
              user: ${JSON.stringify(authResult.user)}
            }, "*");
            window.close();
          } else {
            document.body.innerHTML = '<h2>✓ Authentication Successful</h2><p>You can close this tab and return to the application.</p>';
          }
        </script>
      </body>
      </html>
    `);
  } catch (err: any) {
    console.error("Google simulated callback error:", err);
    return res.status(500).send(`Simulation login failed: ${err.message}`);
  }
});
