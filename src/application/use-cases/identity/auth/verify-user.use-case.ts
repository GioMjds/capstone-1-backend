import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  VerifyUserDto,
  VerifyUserResponseDto,
} from '@/application/dto/identity/auth';
import type { ITokenService } from '@/application/ports';
import type { IUserRepository } from '@/domain/repositories';
import { EmailValueObject } from '@/domain/value-objects/identity';
import { VerifyUserEvent } from '@/shared/email/events';
import { OtpService } from '@/shared/utils';

@Injectable()
export class VerifyUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: VerifyUserDto): Promise<VerifyUserResponseDto> {
    if (!dto.otp || dto.otp.trim() === '') {
      throw new NotFoundException('OTP is required');
    }

    const email = new EmailValueObject(dto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified)
      throw new NotFoundException('Email is already verified');

    const isValidOtp = await this.otpService.verify(dto.email, dto.otp);
    if (!isValidOtp)
      throw new BadRequestException(
        'Invalid or expired OTP. Please request a new one.',
      );

    await this.otpService.invalidate(dto.email);
    user.isEmailVerified = true;

    await this.userRepository.update(user);

    const accessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email.getValue(),
    });

    const verifyUserEvent = new VerifyUserEvent();
    verifyUserEvent.email = user.email.getValue();
    verifyUserEvent.name = user.getFullName();

    this.eventEmitter.emit('user.verified', verifyUserEvent);

    return {
      message: 'Your account has been successfully verified.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.getValue(),
        phone: user.phone?.getValue() || null,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        archivedAt: user.archivedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: accessToken,
    };
  }
}
