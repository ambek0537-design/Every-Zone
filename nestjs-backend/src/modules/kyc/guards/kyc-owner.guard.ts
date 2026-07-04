import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { KycRepository } from '../kyc.repository';

@Injectable()
export class KycOwnerGuard implements CanActivate {
  constructor(private readonly kycRepository: KycRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // populated by JwtAuthGuard
    
    if (!user) {
      return false;
    }

    // Admins and Superadmins have unrestricted access
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'KYC_ADMIN') {
      return true;
    }

    const kycId = request.params.id;
    if (!kycId) {
      return true; // if no specific ID param, defer validation to route/controller level
    }

    const kyc = await this.kycRepository.findById(kycId);
    if (!kyc) {
      return true; // let controller handle 404
    }

    // In this database, user has a 1-to-1 relationship with Vendor.
    // Check if the current user owns the kyc (i.e. matches vendorId or userId relation)
    // We can verify this via vendorProfile context
    const hasOwnership = kyc.vendorId === user.id || kyc.vendorId === user.vendorProfile?.id;
    
    if (!hasOwnership) {
      throw new ForbiddenException('Security Block: You do not have permission to access these identity files.');
    }

    return true;
  }
}
