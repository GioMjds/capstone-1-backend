import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
  VerifyUserDto,
  ResendVerificationDto,
  ChangePasswordDto,
} from './dto';
import { PrismaService } from '@/configs';
import { compare, hash } from 'bcrypt';
import { generateUserId, OAuth, OtpService, Token } from '@/shared/utils';
import { EmailService } from '../email';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private token: Token,
    private otpService: OtpService,
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
      throw new BadRequestException('Your password is incorrect.');
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

  async logout() {
    return { message: 'Logout successful' };
  }

  async register(dto: RegisterUserDto) {
    const { firstName, lastName, email, password, confirmPassword } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
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

    const otp = this.otpService.generate();
    await this.otpService.store(newUser.email, otp);

    let emailSent = false;
    try {
      emailSent = await this.emailService.sendOtpEmail(
        newUser.email,
        newUser.firstName,
        otp,
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
        'Registration successful. Please check your email for the OTP code to verify your account.',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    };
  }

  async verifyUser(dto: VerifyUserDto) {
    const { email, otp } = dto;

    if (!otp || otp.trim() === '') {
      throw new BadRequestException('OTP is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const isValidOtp = await this.otpService.verify(email, otp);

    if (!isValidOtp) {
      throw new BadRequestException(
        'Invalid or expired OTP. Please request a new one.',
      );
    }

    await this.otpService.invalidate(email);

    const accessToken = this.token.generate(user);

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
        isEmailVerified: true,
      },
      access_token: accessToken,
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

    const otp = this.otpService.generate();
    await this.otpService.store(email, otp);

    await this.emailService.sendOtpEmail(user.email, user.firstName, otp);

    return {
      message: 'Verification OTP sent. Please check your inbox.',
    };
  }

  async changePassword(dto: ChangePasswordDto) {
    const { email, confirmNewPassword, currentPassword, newPassword } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Your current password is incorrect');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const isSamePassword = await compare(newPassword, user.password);

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedNewPassword = await hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return {
      message: 'Password changed successfully',
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
