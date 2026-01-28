import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ITokenService, TokenPayload } from "@/application/ports/token-service.port";

@Injectable()
export class JwtTokenService implements ITokenService {
  private readonly expiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const expiryString = this.configService.get<string>('jwt.accessTokenExpiry', '1h');
    this.expiresIn = this.parseExpiryToSeconds(expiryString);
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
    return this.expiresIn;
  }

  private parseExpiryToSeconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);

    if (!match) return 3600; // Default 1 hour
    
    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600;
    }
  }
}