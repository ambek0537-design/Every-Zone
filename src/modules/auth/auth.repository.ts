import { prisma, useDbFallback, isMemoryDb } from "../../../server";
import { RegisterDto } from "./dto/auth.dto";

export class AuthRepository {
  async findByEmail(email: string) {
    if (prisma && !useDbFallback) {
      return prisma.user.findUnique({
        where: { email },
      });
    } else {
      return isMemoryDb.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  }

  async findByPhone(phone: string) {
    if (prisma && !useDbFallback) {
      return prisma.user.findUnique({
        where: { phone },
      });
    } else {
      return isMemoryDb.users.find((u: any) => u.phone === phone) || null;
    }
  }

  async findById(id: string) {
    if (prisma && !useDbFallback) {
      return prisma.user.findUnique({
        where: { id },
      });
    } else {
      return isMemoryDb.users.find((u: any) => u.id === id) || null;
    }
  }

  async createUser(data: RegisterDto & { passwordHash: string }) {
    if (prisma && !useDbFallback) {
      return prisma.user.create({
        data: {
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          password: data.passwordHash,
          role: (data.role || "BUYER") as any,
          nationalId: data.nationalId || null,
          verificationStatus: "PENDING",
          active: true,
          verified: false,
        },
      });
    } else {
      const newUser = {
        id: `u-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        email: data.email,
        fullName: data.fullName,
        firstName: data.fullName.split(" ")[0] || "",
        lastName: data.fullName.split(" ").slice(1).join(" ") || "",
        phone: data.phone,
        password: data.passwordHash,
        role: data.role || "BUYER",
        active: true,
        verified: false,
        nationalId: data.nationalId || null,
        verificationStatus: "PENDING",
        failedRefAttempts: 0,
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      isMemoryDb.users.push(newUser);
      return newUser;
    }
  }

  async updateUserPassword(email: string, passwordHash: string) {
    if (prisma && !useDbFallback) {
      return prisma.user.update({
        where: { email },
        data: { password: passwordHash },
      });
    } else {
      const user = isMemoryDb.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user.password = passwordHash;
        user.updatedAt = new Date();
        return user;
      }
      return null;
    }
  }

  async updateUserSuspension(id: string, isSuspended: boolean) {
    if (prisma && !useDbFallback) {
      return prisma.user.update({
        where: { id },
        data: { isSuspended },
      });
    } else {
      const user = isMemoryDb.users.find((u: any) => u.id === id);
      if (user) {
        user.isSuspended = isSuspended;
        user.updatedAt = new Date();
        return user;
      }
      return null;
    }
  }
}
