import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from '@/modules/identity/auth/dto';
import type { IUserRepository } from '@/domain/repositories';
import { Token } from '@/shared/utils';
import { compare } from 'bcrypt';
import { User } from '@/domain/entities/user.entity';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly token: Token,
  ) {}

  async execute(dto: LoginUserDto): Promise<{
    user: { id: string; firstName: string; lastName: string; email: string };
    access_token: string;
  }> {
    const userRecord = await this.userRepository.findByEmail(dto.email);
    if (!userRecord) throw new NotFoundException('User not found');

    const user = User.fromPrisma(userRecord);
    if (!user) throw new NotFoundException('User not found');

    const passwordValid = await compare(dto.password, userRecord.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified) throw new UnauthorizedException('Email not verified');

    const accessToken = this.token.generate(userRecord);

    return {
      user: {
        id: userRecord.id,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        email: userRecord.email,
      },
      access_token: accessToken,
    };
  }
}
