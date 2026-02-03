import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IUserRepository } from '@/domain/repositories';
import { ForgotPasswordRequestDto } from '@/application/dto/identity/auth';
import { EmailValueObject } from '@/domain/value-objects/identity';
import { OtpService } from '@/shared/utils';

@Injectable()
export class ForgotPasswordRequestUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: ForgotPasswordRequestDto): Promise<{ message: string }> {
    const email = new EmailValueObject(dto.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified)
      throw new NotFoundException(
        'Email is already verified. Please verify your email first.',
      );
    const otp = this.otpService.generate();
    await this.otpService.store(email.getValue(), otp);

    this.eventEmitter.emit('email.sendOtp', {
      to: user.email.getValue(),
      name: user.getFullName(),
      otp,
    });

    return {
      message: 'Password reset OTP sent successfully. Please check your inbox.',
    };
  }
}
