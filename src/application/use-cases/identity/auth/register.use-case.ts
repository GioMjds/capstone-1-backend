import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { UserEntity } from '@/domain/entities';
import {
  EmailValueObject,
  PasswordValueObject,
  PhoneValueObject,
} from '@/domain/value-objects';
import { RegisterUserDto } from '@/application/dto/auth';
import { generateUserId, OtpService } from '@/shared/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserResponseDto } from '@/application/dto/responses';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    dto: RegisterUserDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const email = new EmailValueObject(dto.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser)
      throw new BadRequestException('User with this email already exists');

    const password = await PasswordValueObject.fromPlainText(dto.password);
    const phone = dto.phone ? new PhoneValueObject(dto.phone) : null;

    const userId = generateUserId();

    const user = new UserEntity(
      userId,
      dto.firstName,
      dto.lastName,
      email,
      password,
      phone,
      true,
      false,
    );

    const savedUser = await this.userRepository.save(user);

    await this.processPostRegistration(savedUser);

    Logger.log(`User registered with email: ${savedUser.email.getValue()}`);

    return {
      message: 'User registered successfully. Please verify your email.',
      user: this.mapToResponse(savedUser),
    };
  }

  private mapToResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.getValue(),
      phone: user.phone?.getValue() || null,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async processPostRegistration(user: UserEntity): Promise<void> {
    const otp = this.otpService.generate();
    await this.otpService.store(user.email.getValue(), otp);
    this.eventEmitter.emit('email.sendOtp', {
      to: user.email.getValue(),
      name: user.getFullName(),
      otp,
    });
  }
}
