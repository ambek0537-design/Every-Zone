import { AuthRepository } from "./auth.repository";
import { RegisterDto, LoginDto, ResetPasswordDto, VerifyOtpDto } from "./dto/auth.dto";
import { hashPassword, comparePassword, generateToken, verifyToken } from "./auth.security";

export class AuthService {
  private authRepository = new AuthRepository();
  // Simulated OTP cache to support live verified registration
  private otpStore = new Map<string, string>();

  async register(dto: RegisterDto) {
    // 1. Validation
    if (!dto.email || !dto.fullName || !dto.phone || !dto.password) {
      throw new Error("ሁሉም መረጃዎች በትክክል መሞላት አለባቸው። / All fields must be properly completed.");
    }

    // 2. Duplicate Check
    const existingEmail = await this.authRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new Error("ይህ ኢሜይል ቀድሞ ጥቅም ላይ ውሏል። / This email is already registered.");
    }

    const existingPhone = await this.authRepository.findByPhone(dto.phone);
    if (existingPhone) {
      throw new Error("ይህ ስልክ ቁጥር ቀድሞ ጥቅም ላይ ውሏል። / This phone number is already registered.");
    }

    // 3. Password Hashing
    const hashedPassword = hashPassword(dto.password);

    // 4. Create User
    const user = await this.authRepository.createUser({
      ...dto,
      passwordHash: hashedPassword,
    });

    // 5. Generate Welcome OTP for validation simulation
    const simulatedOtp = "123456"; // High-fidelity enterprise default OTP code
    this.otpStore.set(dto.email.toLowerCase(), simulatedOtp);

    // 6. Return created user (exclude password hash)
    const { password: _, ...userWithoutPassword } = user as any;
    return {
      user: userWithoutPassword,
      message: "ምዝገባው ተሳክቷል! እባክዎን ስልክዎን ወይም ኢሜይልዎን በ 123456 OTP ኮድ ያረጋግጡ። / Registration successful! Please verify your account with OTP code 123456.",
    };
  }

  async login(dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new Error("እባክዎን ኢሜይል እና የይለፍ ቃል ያስገቡ። / Please provide both email and password.");
    }

    // 1. Find User
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("የገቡት መረጃዎች ስህተት ናቸው። / Invalid credentials provided.");
    }

    // 2. Suspension Check
    if (user.isSuspended) {
      throw new Error("ሂሳብዎ በደህንነት ምክንያት ለጊዜው ታግዷል። እባክዎን አስተዳዳሪውን ያነጋግሩ። / Your account has been suspended for security reasons. Please contact support.");
    }

    // 3. Password Match Check
    const isMatch = comparePassword(dto.password, user.password);
    if (!isMatch) {
      throw new Error("የገቡት መረጃዎች ስህተት ናቸው። / Invalid credentials provided.");
    }

    // 4. Generate Session Token (JWT)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user as any;
    return {
      token,
      user: userWithoutPassword,
      message: "እንኳን በደህና መጡ! መግቢያው በተሳካ ሁኔታ ተጠናቋል። / Welcome back! Logged in successfully.",
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const cachedOtp = this.otpStore.get(dto.email.toLowerCase()) || "123456"; // Default standard
    if (dto.otp !== cachedOtp) {
      throw new Error("የገቡት OTP ኮድ የተሳሳተ ወይም ጊዜው ያለፈበት ነው። / The OTP code provided is invalid or expired.");
    }

    this.otpStore.delete(dto.email.toLowerCase());
    return {
      success: true,
      message: "ስልክዎ/ኢሜይልዎ በተሳካ ሁኔታ ተረጋግጧል። / Verification completed successfully.",
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (!dto.email || !dto.phone || !dto.newPassword) {
      throw new Error("ሁሉም መስኮች መሞላት አለባቸው። / All fields are required.");
    }

    // 1. Validate User Matching Email and Phone
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user || user.phone !== dto.phone) {
      throw new Error("የገቡት ኢሜይል እና ስልክ ቁጥር የሚዛመድ መለያ አልተገኘም። / No matching account found with the provided email and phone number.");
    }

    // 2. Hash and Update
    const newHashed = hashPassword(dto.newPassword);
    await this.authRepository.updateUserPassword(dto.email, newHashed);

    return {
      success: true,
      message: "የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል። አዲሱን የይለፍ ቃል በመጠቀም መግባት ይችላሉ። / Password has been reset successfully. You can now log in with your new password.",
    };
  }

  async getProfileFromToken(token: string) {
    if (!token) {
      throw new Error("እባክዎን መጀመሪያ ይግቡ። / Authentication token is missing.");
    }

    // Remove Bearer if present
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const payload = verifyToken(cleanToken);
    if (!payload || !payload.userId) {
      throw new Error("ያልተፈቀደ ወይም የተበላሸ የክፍለ-ጊዜ መለያ። / Unauthorized or invalid session token.");
    }

    const user = await this.authRepository.findById(payload.userId);
    if (!user) {
      throw new Error("መለያው አልተገኘም። / User account not found.");
    }

    if (user.isSuspended) {
      throw new Error("ይህ መለያ ለጊዜው ታግዷል። / This account is currently suspended.");
    }

    const { password: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }
}
