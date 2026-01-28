import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { EmailValueObject } from '@/domain/value-objects';
import { OtpService } from '@/shared/utils';
import { ForgotPasswordVerifyDto } from '@/application/dto/auth';

@Injectable()
export class ForgotPasswordVerifyUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
  ) {}

  async execute(dto: ForgotPasswordVerifyDto): Promise<{ message: string }> {
    const email = new EmailValueObject(dto.email);
    if (!dto.otp || dto.otp.trim() === '')
      throw new NotFoundException('OTP is required');

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isValidOtp = await this.otpService.verify(email.getValue(), dto.otp);
    if (!isValidOtp) throw new NotFoundException('Invalid or expired OTP. Please request a new one.');

    return {
      message: 'OTP verified successfully. You can now reset your password.',
    };
  }
}
