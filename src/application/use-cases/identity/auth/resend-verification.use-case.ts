import { ResendVerificationDto } from '@/application/dto/auth';
import type { IUserRepository } from '@/domain/repositories';
import { EmailValueObject } from '@/domain/value-objects';
import { OtpService } from '@/shared/utils';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ResendVerificationUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: ResendVerificationDto): Promise<{ message: string }> {
    const email = new EmailValueObject(dto.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified)
      throw new NotFoundException('Email is already verified');

    const otp = this.otpService.generate();
    await this.otpService.store(email.getValue(), otp);

    this.eventEmitter.emit('email.sendOtp', {
      to: user.email.getValue(),
      name: user.getFullName(),
      otp,
    });

    return {
      message:
        'Verification email resent successfully. Please check your inbox.',
    };
  }
}
