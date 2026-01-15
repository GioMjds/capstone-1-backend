import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ISuccessResponse } from 'src/interfaces';
import { LoginUser, RegisterUserDto, VerifyUserDto } from './dto';
import { PrismaService } from 'src/configs';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateUserId, OAuth, Token } from '@/shared/utils';
import { EmailService } from '../email';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private token: Token,
    private emailService: EmailService,
    private oauth: OAuth,
  ) {}

  async login(dto: LoginUser) {
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

    const accessToken = this.token.generate(user);

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

  async register(dto: RegisterUserDto) {
    const { firstName, lastName, email, password, confirmPassword } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const passwordHash = await hash(password, 12);

    const newUser = await this.prisma.user.create({
      data: {
        id: generateUserId(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHash,
      },
    });

    return newUser;
  }

  async verifyEmail(dto: VerifyUserDto) {}

  async resendEmail() {}

  async googleAuth(idToken: string) {
    const googleUser = await this.oauth.validateGoogleToken(idToken);

    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: generateUserId(),
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          password: '',
          emailVerified: true,
        },
      });
    }

    const accessToken = this.token.generate(user);

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

  logout(userId: string): Promise<ISuccessResponse> {
    return Promise.resolve({
      success: true,
      message: `User with ID #${userId} has been logged out successfully.`,
    });
  }
}
