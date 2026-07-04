import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a security or structural action carried out by an administrative user
   */
  async log(
    adminId: string,
    action: string,
    entityType: string,
    entityId: string,
    oldData?: any,
    newData?: any,
    ipAddress?: string,
  ) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          adminId,
          action,
          entityType,
          entityId,
          oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : undefined,
          newData: newData ? JSON.parse(JSON.stringify(newData)) : undefined,
          ipAddress: ipAddress || '127.0.0.1',
        },
      });
    } catch (error) {
      console.error('AuditLog creation failure:', error);
      // Fail gracefully so as not to block critical actions if auditing fails
    }
  }
}
