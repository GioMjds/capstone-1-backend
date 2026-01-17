import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface VerificationPayload {
  sub: string;
  email: string;
  type: 'email_verification';
}

@Injectable()
export class VerificationToken {
  private readonly verificationSecret: string;
  private readonly verificationExpiry = '24h';

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }
    this.verificationSecret = jwtSecret + '_verification';
  }

  generate(userId: string, email: string): string {
    const payload: VerificationPayload = {
      sub: userId,
      email: email,
      type: 'email_verification',
    };

    return this.jwtService.sign(payload, {
      secret: this.verificationSecret,
      expiresIn: this.verificationExpiry,
    });
  }

  verify(token: string): VerificationPayload | null {
    try {
      const decoded = this.jwtService.verify<VerificationPayload>(token, {
        secret: this.verificationSecret,
      });

      if (decoded.type !== 'email_verification') {
        return null;
      }

      return decoded;
    } catch (error) {
      const err = error as Error;
      console.error('Token verification failed:', err.message);
      console.error('Token (first 50 chars):', token?.substring(0, 50));
      return null;
    }
  }
}
