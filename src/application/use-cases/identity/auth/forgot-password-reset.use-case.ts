import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { ForgotPasswordResetDto } from '@/application/dto/identity/auth';
import {
  EmailValueObject,
  PasswordValueObject,
} from '@/domain/value-objects/identity';
import { OtpService } from '@/shared/utils';

@Injectable()
export class ForgotPasswordResetUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
  ) {}

  async execute(dto: ForgotPasswordResetDto): Promise<{ message: string }> {
    const email = new EmailValueObject(dto.email);
    if (!dto.otp || dto.otp.trim() === '')
      throw new BadRequestException('OTP is required');

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const isValidOtp = await this.otpService.verify(email.getValue(), dto.otp);
    if (!isValidOtp)
      throw new BadRequestException(
        'Invalid or expired OTP. Please request a new one.',
      );

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const isSamePassword = await user.verifyPassword(dto.newPassword);
    if (isSamePassword)
      throw new BadRequestException(
        'New password must be different from your current password.',
      );

    const newPasswordVo = await PasswordValueObject.fromPlainText(
      dto.newPassword,
    );
    await user.updatePassword(newPasswordVo);
    await this.userRepository.save(user);
    await this.otpService.invalidate(dto.email);

    return {
      message: 'Password has been reset successfully.',
    };
  }
}
