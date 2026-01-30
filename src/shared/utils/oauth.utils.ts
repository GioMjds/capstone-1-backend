import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  iat: number;
  exp: number;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

interface GoogleAuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

@Injectable()
export class OAuth {
  private readonly GOOGLE_TOKEN_URL =
    'https://www.googleapis.com/oauth2/v1/tokeninfo';
  private readonly GOOGLE_CERTS_URL =
    'https://www.googleapis.com/oauth2/v1/certs';
  private readonly TOKEN_EXPIRY_BUFFER = 300;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async validateGoogleToken(idToken: string): Promise<GoogleAuthResponse> {
    if (!idToken || typeof idToken !== 'string') {
      throw new BadRequestException('Invalid or missing ID token');
    }

    try {
      const payload = await this.verifyGoogleIdToken(idToken);
      return this.parseGooglePayload(payload);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to validate Google token');
    }
  }

  private async verifyGoogleIdToken(
    idToken: string,
  ): Promise<GoogleTokenPayload> {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    if (!googleClientId) {
      throw new InternalServerErrorException(
        'Google Client ID is not configured',
      );
    }

    try {
      const response = await firstValueFrom(
        this.http.get<GoogleTokenPayload>(this.GOOGLE_TOKEN_URL, {
          params: {
            id_token: idToken,
          },
        }),
      );

      const payload = response.data;

      this.validateTokenExpiry(payload.exp);
      this.validateTokenAudience(payload.aud, googleClientId);
      this.validateTokenIssuer(payload.iss);

      return payload;
    } catch (error) {
      this.handleTokenVerificationError(error);
    }
  }

  private validateTokenExpiry(expiryTimestamp: number): void {
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = currentTime + this.TOKEN_EXPIRY_BUFFER;

    if (expiryTimestamp < bufferTime) {
      throw new BadRequestException('Token has expired');
    }
  }

  private validateTokenAudience(
    tokenAudience: string,
    configuredClientId: string,
  ): void {
    if (tokenAudience !== configuredClientId) {
      throw new BadRequestException('Token audience does not match client ID');
    }
  }

  private validateTokenIssuer(issuer: string): void {
    const validIssuers = ['https://accounts.google.com', 'accounts.google.com'];

    if (!validIssuers.includes(issuer)) {
      throw new BadRequestException('Invalid token issuer');
    }
  }

  private parseGooglePayload(payload: GoogleTokenPayload): GoogleAuthResponse {
    if (!payload.email || !payload.email_verified) {
      throw new BadRequestException(
        'Email not verified or missing from Google token',
      );
    }

    const [firstName, lastName] = this.parseFullName(
      payload.name || '',
      payload.given_name,
      payload.family_name,
    );

    return {
      id: payload.sub,
      email: payload.email,
      firstName: firstName || payload.given_name || 'User',
      lastName: lastName || payload.family_name || '',
      picture: payload.picture,
    };
  }

  private parseFullName(
    fullName: string,
    givenName?: string,
    familyName?: string,
  ): [string, string] {
    if (givenName && familyName) {
      return [givenName, familyName];
    }

    if (fullName) {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return [parts[0], parts.slice(1).join(' ')];
      }
      return [parts[0] || '', ''];
    }

    return ['', ''];
  }

  private handleTokenVerificationError(error: any): never {
    if (error.response?.status === 400) {
      throw new BadRequestException('Invalid Google token');
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw new InternalServerErrorException(
        'Unable to verify token with Google services',
      );
    }

    throw new BadRequestException('Token verification failed');
  }
}
