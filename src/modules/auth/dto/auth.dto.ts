export interface RegisterDto {
  email: string;
  fullName: string;
  phone: string;
  password?: string;
  role?: "BUYER" | "VENDOR" | "ADMIN" | "SUPER_ADMIN" | "SUB_ADMIN" | "USER";
  nationalId?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  email: string;
  phone: string;
  newPassword?: string;
}

export function validateRegister(dto: RegisterDto): string | null {
  if (!dto.email || !dto.email.includes("@")) {
    return "እባክዎን ትክክለኛ የኢሜይል አድራሻ ያስገቡ። / Please provide a valid email address.";
  }
  if (!dto.fullName || dto.fullName.trim().length < 3) {
    return "ሙሉ ስም ቢያንስ 3 ፊደላት መሆን አለበት። / Full name must be at least 3 characters.";
  }
  if (!dto.phone || dto.phone.trim().length < 9) {
    return "ትክክለኛ ስልክ ቁጥር ያስገቡ። / Please provide a valid phone number.";
  }
  if (dto.password && dto.password.length < 6) {
    return "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት። / Password must be at least 6 characters long.";
  }
  return null;
}

export function validateLogin(dto: LoginDto): string | null {
  if (!dto.email || !dto.email.includes("@")) {
    return "እባክዎን ትክክለኛ የኢሜይል አድራሻ ያስገቡ። / Please provide a valid email address.";
  }
  return null;
}
