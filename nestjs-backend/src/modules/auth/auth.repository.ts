import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { phone },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(dto: RegisterDto, passwordHash: string): Promise<User> {
    // Combine fields safely matching the Prisma schema requirements
    return this.prisma.user.create({
      data: {
        fullName: `${dto.firstName} ${dto.lastName}`,
        email: dto.email || `${dto.phone}@everyzone.et`, // fallback to unique email format
        phone: dto.phone,
        password: passwordHash, // stored password
        role: 'BUYER', // default role
      },
    });
  }

  async updateRole(userId: string, role: any): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  }

  async saveOtpCode(phone: string, code: string, expiresAt: Date) {
    return this.prisma.otpCode.create({
      data: {
        phone,
        code,
        expiresAt,
        verified: false,
      },
    });
  }

  async findOtpCode(phone: string, code: string) {
    return this.prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        verified: false,
        expiresAt: { gte: new Date() },
      },
    });
  }

  async verifyOtpCode(otpId: string) {
    return this.prisma.otpCode.update({
      where: { id: otpId },
      data: { verified: true },
    });
  }
}
