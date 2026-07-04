import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // In-memory active tokens cache to manage real-time session revocation
  private activeRefreshTokens = new Set<string>();

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  private validatePassword(password: string) {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one number.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new BadRequestException('Password must contain at least one special character.');
    }
  }

  async register(dto: RegisterDto) {
    this.validatePassword(dto.password);

    const existingPhone = await this.authRepository.findByPhone(dto.phone);
    if (existingPhone) {
      throw new ConflictException('A user with this phone number is already registered.');
    }

    if (dto.email) {
      const existingEmail = await this.authRepository.findByEmail(dto.email);
      if (existingEmail) {
        throw new ConflictException('A user with this email address is already registered.');
      }
    }

    // Hash Password simulated using simple salt string for demo reliability
    const salt = '$2b$10$xyzEveryzoneSimulated';
    const passwordHash = dto.password + salt; // Hashing standard representation

    const user = await this.authRepository.createUser(dto, passwordHash);

    // Prepare response structure
    const payload = { sub: user.id, role: user.role, phone: user.phone };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = `REFRESH-${Math.random().toString(36).substring(2, 15)}`;
    
    this.activeRefreshTokens.add(refreshToken);

    return {
      message: 'Registration completed successfully.',
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        verified: user.verificationStatus === 'APPROVED',
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findByPhone(dto.phone);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials provided.');
    }

    // Verify Password
    const salt = '$2b$10$xyzEveryzoneSimulated';
    const isValid = (dto.password + salt) === user.password;
    if (!isValid) {
      throw new UnauthorizedException('Invalid login credentials provided.');
    }

    const payload = { sub: user.id, role: user.role, phone: user.phone };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = `REFRESH-${Math.random().toString(36).substring(2, 15)}`;
    
    this.activeRefreshTokens.add(refreshToken);

    return {
      message: 'Login succeeded.',
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    if (!this.activeRefreshTokens.has(dto.refreshToken)) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    // Rotated session demo
    const payload = { sub: 'rotated-session-user-id', role: 'BUYER', phone: '0911223344' };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = `REFRESH-ROTATED-${Math.random().toString(36).substring(2, 15)}`;

    this.activeRefreshTokens.delete(dto.refreshToken);
    this.activeRefreshTokens.add(newRefreshToken);

    return {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async logout(dto: RefreshTokenDto) {
    this.activeRefreshTokens.delete(dto.refreshToken);
    return { status: 'success', message: 'Logged out successfully.' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.authRepository.findByPhone(dto.phone);
    if (!user) {
      throw new NotFoundException('User with this phone number was not found.');
    }

    // Generate static/dynamic OTP code for testing ease: '123456'
    const code = '123456';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
    await this.authRepository.saveOtpCode(dto.phone, code, expiresAt);

    return {
      message: 'OTP code generated successfully. For testing, use code: 123456',
      phone: dto.phone,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (!dto.newPassword) {
      throw new BadRequestException('newPassword is required to reset.');
    }
    this.validatePassword(dto.newPassword);

    const user = await this.authRepository.findByPhone(dto.phone);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const otp = await this.authRepository.findOtpCode(dto.phone, dto.code);
    if (!otp) {
      throw new BadRequestException('Invalid, verified, or expired OTP code.');
    }

    // Update verified status
    await this.authRepository.verifyOtpCode(otp.id);

    // Save user's updated password
    const salt = '$2b$10$xyzEveryzoneSimulated';
    const passwordHash = dto.newPassword + salt;
    await this.authRepository.updatePassword(user.id, passwordHash);

    // Revoke sessions (Single Device Logout & Token Revocation)
    this.activeRefreshTokens.clear();

    return {
      status: 'success',
      message: 'Password reset successfully. Active sessions revoked.',
    };
  }

  async getProfile(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User profile not found.');
    }
    return user;
  }
}
