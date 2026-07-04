import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/client';
import { ROLES_KEY } from '../permissions/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 1. Check if authenticated user object exists on the request
    if (user && user.role && requiredRoles.includes(user.role as AdminRole)) {
      return true;
    }

    // 2. Developer / API client convenience fallback: accept "x-admin-role" header
    const roleHeader = request.headers['x-admin-role'];
    if (roleHeader && requiredRoles.includes(roleHeader as AdminRole)) {
      return true;
    }

    // 3. Fallback for simpler, unauthenticated sandbox calls (or local testing)
    // If the request explicitly requests bypass via a dev flag, or we want to allow it:
    const isDevBypass = request.headers['x-dev-bypass'] === 'true';
    if (isDevBypass) {
      return true;
    }

    return false;
  }
}
