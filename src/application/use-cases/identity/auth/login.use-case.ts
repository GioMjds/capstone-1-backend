import { Injectable, Inject, UnauthorizedException, Logger } from '@nestjs/common';
import { LoginUserDto } from '@/application/dto/auth';
import type { IUserRepository } from '@/domain/repositories';
import type { ITokenService } from '@/application/ports/token-service.port';
import { AuthResponseDto } from '@/application/dto/responses';
import { EmailValueObject } from '@/domain/value-objects';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginUserDto): Promise<AuthResponseDto> {
    const email = new EmailValueObject(dto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found.');
    if (!user.canLogin())
      throw new UnauthorizedException('Account is inactive');

    const isPasswordValid = await user.verifyPassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Your password is incorrect.');
    }

    const accessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email.getValue(),
    });

    return {
      accessToken: accessToken,
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
