import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
  VerifyUserDto,
  ResendVerificationDto,
} from './dto';
import { PrismaService } from '@/configs';
import { compare, hash } from 'bcrypt';
import {
  generateUserId,
  OAuth,
  Token,
  VerificationToken,
} from '@/shared/utils';
import { EmailService } from '../email';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private token: Token,
    private verificationToken: VerificationToken,
    private emailService: EmailService,
    private oauth: OAuth,
  ) {}

  async login(dto: LoginUserDto) {
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

    if (!user.isEmailVerified) {
      throw new BadRequestException('Email is not verified.');
    }

    const accessToken = this.token.generate(user);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
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
        isEmailVerified: false,
      },
    });

    const verificationJwt = this.verificationToken.generate(
      newUser.id,
      newUser.email,
    );

    let emailSent = false;
    try {
      emailSent = await this.emailService.sendVerificationEmail(
        newUser.email,
        newUser.firstName,
        verificationJwt,
      );
    } catch {
      emailSent = false;
    }

    if (!emailSent) {
      return {
        message:
          'Registration successful, but we could not send the verification email. Please use the resend verification option.',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
        emailError: true,
      };
    }

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    };
  }

  async verifyUser(dto: VerifyUserDto) {
    const { token } = dto;

    if (!token || token.trim() === '') {
      throw new BadRequestException('Verification token is required');
    }

    const payload = this.verificationToken.verify(token);

    if (!payload) {
      throw new BadRequestException(
        'Invalid or expired verification token. Please request a new verification email.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    if (user.email !== payload.email) {
      throw new BadRequestException('Token does not match user email');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });

    await this.emailService.welcomeUserEmail(user.email, user.firstName);

    return {
      message: 'Email verified successfully. You can now log in.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      }
    };
  }

  async resendEmail(dto: ResendVerificationDto) {
    const { email } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationJwt = this.verificationToken.generate(
      user.id,
      user.email,
    );

    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationJwt,
    );

    return {
      message: 'Verification email sent. Please check your inbox.',
    };
  }

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
          isEmailVerified: true,
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
      },
      access_token: accessToken,
    };
  }
}
