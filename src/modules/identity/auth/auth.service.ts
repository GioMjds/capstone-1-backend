import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
  Inject,
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
  VerifyUserDto,
  ResendVerificationDto,
  ChangePasswordDto,
  ForgotPasswordRequestDto,
  ForgotPasswordVerifyDto,
  ForgotPasswordResetDto,
  GoogleLoginOAuthDto,
} from './dto';
import { compare, hash } from 'bcrypt';
import { generateUserId, OAuth, OtpService, Token } from '@/shared/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VerifyUserEvent } from '@/modules/email/events/verify-user.event';
import type { IUserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { LoginUseCase } from '@/application/use-cases/identity/auth';

@Injectable()
export class AuthService {
  private readonly log = new Logger(AuthService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly usersRepo: IUserRepository,
    private readonly loginUseCase: LoginUseCase,
    private token: Token,
    private otpService: OtpService,
    private oauth: OAuth,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async login(dto: LoginUserDto) {
    return await this.loginUseCase.execute(dto);
  }

  async logout() {
    return { message: 'Logout successful' };
  }

  async register(dto: RegisterUserDto) {
    const { firstName, lastName, email, password, confirmPassword } = dto;

    const existingUser = await this.usersRepo.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const passwordHash = await hash(password, 12);

    const createPayload = {
      id: generateUserId(),
      firstName,
      lastName,
      email,
      password: passwordHash,
      isEmailVerified: false,
      phone: null,
      isActive: true,
    };

    const newUser = await this.usersRepo.create(createPayload);

    const otp = this.otpService.generate();
    await this.otpService.store(newUser.email, otp);

    this.eventEmitter.emit('email.sendOtp', {
      to: newUser.email,
      name: newUser.firstName,
      otp: otp,
    });

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

    const user = await this.usersRepo.findByEmail(email);

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

    await this.usersRepo.update(user.id, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      phone: user.phone ?? null,
      isActive: user.isActive,
      isEmailVerified: true,
    } as any);

    const verifyUserEvent = new VerifyUserEvent();
    verifyUserEvent.email = user.email;
    verifyUserEvent.name = user.firstName;
    this.eventEmitter.emit('user.verified', verifyUserEvent);

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

    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const otp = this.otpService.generate();
    await this.otpService.store(email, otp);

    this.eventEmitter.emit('email.sendOtp', {
      to: user.email,
      name: user.firstName,
      otp: otp,
    });

    return {
      message: 'Verification OTP sent. Please check your inbox.',
    };
  }

  async forgotPasswordRequest(dto: ForgotPasswordRequestDto) {
    const { email } = dto;

    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'Email is not verified. Please verify your email first.',
      );
    }

    if (email.length === 0) {
      throw new BadRequestException('Email is required');
    }

    // Generate OTP for password reset
    const otp = this.otpService.generate();
    await this.otpService.store(email, otp);

    // Send OTP email
    this.eventEmitter.emit('email.sendOtp', {
      to: user.email,
      name: user.firstName,
      otp: otp,
    });

    return {
      message:
        'Password reset OTP sent to your email. Please check your inbox.',
    };
  }

  async forgotPasswordVerify(dto: ForgotPasswordVerifyDto) {
    const { email, otp } = dto;

    if (!otp || otp.trim() === '') {
      throw new BadRequestException('OTP is required');
    }

    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidOtp = await this.otpService.verify(email, otp);

    if (!isValidOtp) {
      throw new BadRequestException(
        'Invalid or expired OTP. Please request a new one.',
      );
    }

    return {
      message: 'OTP verified successfully. You can now reset your password.',
      verified: true,
    };
  }

  async forgotPasswordReset(dto: ForgotPasswordResetDto) {
    const { email, otp, newPassword, confirmNewPassword } = dto;

    if (!otp || otp.trim() === '') {
      throw new BadRequestException('OTP is required');
    }

    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidOtp = await this.otpService.verify(email, otp);

    if (!isValidOtp) {
      throw new BadRequestException(
        'Invalid or expired OTP. Please request a new one.',
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (user.password) {
      const isSamePassword = await compare(newPassword, user.password);
      if (isSamePassword) {
        throw new BadRequestException(
          'New password must be different from your current password',
        );
      }
    }

    const hashedNewPassword = await hash(newPassword, 12);

    await this.usersRepo.update(user.id, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashedNewPassword,
      phone: user.phone ?? null,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
    } as any);

    await this.otpService.invalidate(email);

    return {
      message:
        'Password reset successfully. You can now log in with your new password.',
    };
  }

  async changePassword(dto: ChangePasswordDto) {
    const { email, confirmNewPassword, currentPassword, newPassword } = dto;

    const user = await this.usersRepo.findByEmail(email);

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

    await this.usersRepo.update(user.id, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashedNewPassword,
      phone: user.phone ?? null,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
    });

    return {
      message: 'Password changed successfully',
    };
  }

  async googleAuth(dto: GoogleLoginOAuthDto) {
    const googleUser = await this.oauth.validateGoogleToken(dto.idToken);

    let user = await this.usersRepo.findByEmail(googleUser.email);

    if (!user) {
      user = await this.usersRepo.create({
        id: generateUserId(),
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        password: '',
        isEmailVerified: true,
        phone: null,
        isActive: true,
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
