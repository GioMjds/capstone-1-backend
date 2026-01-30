import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ITokenService,
  TokenPayload,
} from '@/application/ports/token-service.port';

@Injectable()
export class JwtTokenService implements ITokenService {
  private readonly expiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.expiresIn = this.getTokenExpiresIn();
  }

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync({
      sub: payload.userId,
      email: payload.email,
    });
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);

      return {
        userId: decoded.sub,
        email: decoded.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  getTokenExpiresIn(): number {
    return parseInt(
      this.configService.get<string>('JWT_EXPIRES_IN', '3600'),
      10,
    );
  }
}
