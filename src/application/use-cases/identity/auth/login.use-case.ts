import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from '@/application/dto/identity/auth';
import type { IUserRepository } from '@/domain/repositories';
import type { ITokenService } from '@/application/ports/token-service.port';
import { AuthResponseDto } from '@/application/dto/responses';
import { EmailValueObject } from '@/domain/value-objects/identity';

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

    if (!user) throw new NotFoundException('Invalid credentials');
    if (!user.canLogin()) throw new BadRequestException('Account is inactive');

    const isPasswordValid = await user.verifyPassword(dto.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

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
        role: user.role,
        archivedAt: user.archivedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
