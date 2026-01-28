import { Injectable } from '@nestjs/common';
import {
  LoginUserDto,
  ChangePasswordDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResetDto,
  ForgotPasswordVerifyDto,
  GoogleLoginOAuthDto,
  RegisterUserDto,
  ResendVerificationDto,
  VerifyUserDto,
} from '@/application/dto/auth';
import { LoginUseCase } from '@/application/use-cases/identity/auth';
import { RegisterUserUseCase } from '@/application/use-cases/identity/auth/register.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  async login(dto: LoginUserDto) {
    return await this.loginUseCase.execute(dto);
  }

  async logout() {
    return { message: 'Logout successful' };
  }

  async register(dto: RegisterUserDto) {
    return await this.registerUserUseCase.execute(dto);
  }

  // async verifyUser(dto: VerifyUserDto) {
  //   const { email, otp } = dto;

  //   if (!otp || otp.trim() === '') {
  //     throw new BadRequestException('OTP is required');
  //   }

  //   const user = await this.usersRepo.findByEmail(email);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   if (user.isEmailVerified) {
  //     throw new BadRequestException('Email is already verified');
  //   }

  //   const isValidOtp = await this.otpService.verify(email, otp);

  //   if (!isValidOtp) {
  //     throw new BadRequestException(
  //       'Invalid or expired OTP. Please request a new one.',
  //     );
  //   }

  //   await this.otpService.invalidate(email);

  //   const accessToken = this.token.generate(user);

  //   await this.usersRepo.update(user.id, {
  //     id: user.id,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     password: user.password,
  //     phone: user.phone ?? null,
  //     isActive: user.isActive,
  //     isEmailVerified: true,
  //   } as any);

  //   const verifyUserEvent = new VerifyUserEvent();
  //   verifyUserEvent.email = user.email;
  //   verifyUserEvent.name = user.firstName;
  //   this.eventEmitter.emit('user.verified', verifyUserEvent);

  //   return {
  //     message: 'Email verified successfully. You can now log in.',
  //     user: {
  //       id: user.id,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //       isEmailVerified: true,
  //     },
  //     access_token: accessToken,
  //   };
  // }

  // async resendEmail(dto: ResendVerificationDto) {
  //   const { email } = dto;

  //   const user = await this.usersRepo.findByEmail(email);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   if (user.isEmailVerified) {
  //     throw new BadRequestException('Email is already verified');
  //   }

  //   const otp = this.otpService.generate();
  //   await this.otpService.store(email, otp);

  //   this.eventEmitter.emit('email.sendOtp', {
  //     to: user.email,
  //     name: user.firstName,
  //     otp: otp,
  //   });

  //   return {
  //     message: 'Verification OTP sent. Please check your inbox.',
  //   };
  // }

  // async forgotPasswordRequest(dto: ForgotPasswordRequestDto) {
  //   const { email } = dto;

  //   const user = await this.usersRepo.findByEmail(email);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   if (!user.isEmailVerified) {
  //     throw new BadRequestException(
  //       'Email is not verified. Please verify your email first.',
  //     );
  //   }

  //   if (email.length === 0) {
  //     throw new BadRequestException('Email is required');
  //   }

  //   // Generate OTP for password reset
  //   const otp = this.otpService.generate();
  //   await this.otpService.store(email, otp);

  //   // Send OTP email
  //   this.eventEmitter.emit('email.sendOtp', {
  //     to: user.email,
  //     name: user.firstName,
  //     otp: otp,
  //   });

  //   return {
  //     message:
  //       'Password reset OTP sent to your email. Please check your inbox.',
  //   };
  // }

  // async forgotPasswordVerify(dto: ForgotPasswordVerifyDto) {
  //   const { email, otp } = dto;

  //   if (!otp || otp.trim() === '') {
  //     throw new BadRequestException('OTP is required');
  //   }

  //   const user = await this.usersRepo.findByEmail(email);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const isValidOtp = await this.otpService.verify(email, otp);

  //   if (!isValidOtp) {
  //     throw new BadRequestException(
  //       'Invalid or expired OTP. Please request a new one.',
  //     );
  //   }

  //   return {
  //     message: 'OTP verified successfully. You can now reset your password.',
  //     verified: true,
  //   };
  // }

  // async forgotPasswordReset(dto: ForgotPasswordResetDto) {
  //   const { email, otp, newPassword, confirmNewPassword } = dto;

  //   if (!otp || otp.trim() === '') {
  //     throw new BadRequestException('OTP is required');
  //   }

  //   const user = await this.usersRepo.findByEmail(email);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const isValidOtp = await this.otpService.verify(email, otp);

  //   if (!isValidOtp) {
  //     throw new BadRequestException(
  //       'Invalid or expired OTP. Please request a new one.',
  //     );
  //   }

  //   if (newPassword !== confirmNewPassword) {
  //     throw new BadRequestException('Passwords do not match');
  //   }

  //   if (user.password) {
  //     const isSamePassword = await compare(newPassword, user.password);
  //     if (isSamePassword) {
  //       throw new BadRequestException(
  //         'New password must be different from your current password',
  //       );
  //     }
  //   }

  //   const hashedNewPassword = await hash(newPassword, 12);

  //   await this.usersRepo.update(user.id, {
  //     id: user.id,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     password: hashedNewPassword,
  //     phone: user.phone ?? null,
  //     isActive: user.isActive,
  //     isEmailVerified: user.isEmailVerified,
  //   } as any);

  //   await this.otpService.invalidate(email);

  //   return {
  //     message:
  //       'Password reset successfully. You can now log in with your new password.',
  //   };
  // }

  // async changePassword(dto: ChangePasswordDto) {
  //   const { email, confirmNewPassword, currentPassword, newPassword } = dto;

  //   const user = await this.usersRepo.findByEmail(email);

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const isPasswordValid = await compare(currentPassword, user.password);

  //   if (!isPasswordValid) {
  //     throw new BadRequestException('Your current password is incorrect');
  //   }

  //   if (newPassword !== confirmNewPassword) {
  //     throw new BadRequestException('New passwords do not match');
  //   }

  //   const isSamePassword = await compare(newPassword, user.password);

  //   if (isSamePassword) {
  //     throw new BadRequestException(
  //       'New password must be different from the current password',
  //     );
  //   }

  //   const hashedNewPassword = await hash(newPassword, 12);

  //   await this.usersRepo.update(user.id, {
  //     id: user.id,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     password: hashedNewPassword,
  //     phone: user.phone ?? null,
  //     isActive: user.isActive,
  //     isEmailVerified: user.isEmailVerified,
  //   });

  //   return {
  //     message: 'Password changed successfully',
  //   };
  // }

  // async googleAuth(dto: GoogleLoginOAuthDto) {
  //   const googleUser = await this.oauth.validateGoogleToken(dto.idToken);

  //   let user = await this.usersRepo.findByEmail(googleUser.email);

  //   if (!user) {
  //     user = await this.usersRepo.create({
  //       id: generateUserId(),
  //       firstName: googleUser.firstName,
  //       lastName: googleUser.lastName,
  //       email: googleUser.email,
  //       password: '',
  //       isEmailVerified: true,
  //       phone: null,
  //       isActive: true,
  //     });
  //   }

  //   const accessToken = this.token.generate(user);

  //   return {
  //     user: {
  //       id: user.id,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //     },
  //     access_token: accessToken,
  //   };
  // }
}
