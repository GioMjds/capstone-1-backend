import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import type { ITokenService } from '@/application/ports';
import { generateUserId, OAuth } from '@/shared/utils';
import { UserEntity } from '@/domain/entities';
import { EmailValueObject, PasswordValueObject } from '@/domain/value-objects';
import { GoogleLoginOAuthDto } from '@/application/dto/auth';
import { AuthResponseDto } from '@/application/dto/responses';

@Injectable()
export class GoogleOAuthUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    private readonly oauth: OAuth,
  ) {}

  async execute(dto: GoogleLoginOAuthDto): Promise<AuthResponseDto> {
    const googleUser = await this.oauth.validateGoogleToken(dto.idToken);
    const email = new EmailValueObject(googleUser.email);
    const password = PasswordValueObject.fromHash('');

    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      const userId = generateUserId();
      const newUser = new UserEntity(
        userId,
        googleUser.firstName,
        googleUser.lastName,
        email,
        password,
        null,
        true,
        true,
      );

      user = await this.userRepository.save(newUser);
    }

    const accessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email.getValue(),
    });

    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.getValue(),
        phone: user.phone?.getValue() || null,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
