import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAuthLoginResponse, ISuccessResponse } from 'src/interfaces';
import { LoginUser } from './dto';
import { PrismaService } from 'src/configs';
import { compare } from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginUser): Promise<IAuthLoginResponse> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = await compare(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const accessToken = this.generateToken(user);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      access_token: accessToken,
    };
  }

  async register() {}

  async verifyEmail() {}

  async resendEmail() {}

  logout(userId: string): Promise<ISuccessResponse> {
    return Promise.resolve({
      success: true,
      message: `User with ID ${userId} has been logged out successfully.`,
    });
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
