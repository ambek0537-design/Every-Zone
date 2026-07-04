import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'everyzone-jwt-master-secret-rotation-2026',
    });
  }

  async validate(payload: any) {
    const user = await this.authRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Access token references an invalid user.');
    }
    return user;
  }
}
